import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../../lib/prisma";
import Style from "../styles/Post.module.scss";
import { Input } from "@/components/ui/input";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { published: [] } };
  }

  const published = await prisma.post.findMany({
    where: {
      author: { email: session?.user?.email },
      published: true,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { published },
  };
};

type Props = {
  published: PostProps[];
};

// Potentially refactor published and drafts to be the same component

const Published = (props: Props): JSX.Element => {
  const { data: session } = useSession();
  const feed = props.published; // double check

  const [searchInput, changeInput] = useState<string>("");
  const [published, changePublished] = useState<PostProps[]>([]);

  useEffect(() => {
    changePublished(feed);
  }, [feed]);

  const onChangeSearch = (input: string) => {
    changeInput(input);
    const sorted = feed.filter((iter) => {
      return iter.title.includes(input);
    });
    changePublished(sorted);
  };

  if (!session) {
    return (
      <Layout>
        <h1>My Published</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Input
        className={Style.inputWrapper}
        placeholder="Search"
        onChange={(e) => {
          onChangeSearch(e.target.value);
        }}
        value={searchInput}
      />
      <div className={Style.published}>
        <h1>My Published</h1>
        <main>
          {published.length > 0 ? (
            published.map((post) => (
              <div key={post.id} className={Style.post}>
                <Post post={post} />
              </div>
            ))
          ) : (
            <p>... No published available</p>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Published;
