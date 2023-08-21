import React from "react"
import { GetServerSidePropsContext } from "next"
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import { useSession } from 'next-auth/react';
import Layout from "../../components/Layout"
import prisma from "../../../lib/prisma";
import Style from "../../styles/Post.module.scss";

// The route is dynamic here so use GetServerSideProps as this is done on runtime

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const post = await prisma?.post.findUnique({
        where : {
            id : String(params?.id)
        },
        include: {
            author: {
                select: { name: true, email : true },
              },
        }
    });
    return { props : post }
}


async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}

const Post = (props : any) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  let title = props.title;
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  if (!props.published) {
    title = `${title} ( Draft )`
  }

  return (
    <Layout>
      <div className={Style.postOverviewWrapper}>
        <h2>{title}</h2>
        <p className={Style.postOverviewAuthor}>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown className={Style.content}>
          {props.content}
        </ReactMarkdown>
        <div>
          {!props.published && userHasValidSession && postBelongsToUser && (
              <button className={Style.publishDraft} onClick={() => publishPost(props.id)}>Publish</button>
          )}
          {userHasValidSession && postBelongsToUser && (
            <button className={Style.deletePost} onClick={() => deletePost(props.id)}>Delete</button>
          )}
          </div>
        </div>
    </Layout>
  )
}

export default Post