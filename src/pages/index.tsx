import Layout from "@/components/Layout";
import Post from "@/components/Post";
import { useEffect, useMemo, useRef, useState } from "react";
import { Inter } from "next/font/google";
import { GetServerSideProps } from "next/types";
import MapComponent from "@/components/MapComponent/MapComponent";
import prisma from "../../lib/prisma";
import { PostProps } from "@/components/Post";
import { Input } from "@/components/ui/input";
import Style from "../styles/Home.module.css";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/router";
import { Pagination } from "@/components/ui/pagination";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const page = Number(query.page) || 1;
  const pageSize = 6; // Number of posts per page
  const skip = (page - 1) * pageSize;

  const [feed, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
      take: pageSize,
      skip: skip,
      orderBy: { id: "desc" },
    }),
    prisma.post.count({
      where: { published: true },
    }),
  ]);

  return {
    props: {
      feed,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      pageSize,
    },
  };
};

type Props = {
  feed: PostProps[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

const Home = (props: Props): JSX.Element => {
  const searchText = useRef("");
  const [latestFeed, setLatestFeed] = useState<PostProps[]>([]);
  const { feed, currentPage, totalPages } = props;
  const router = useRouter();

  useEffect(() => {
    setLatestFeed(feed);
  }, [feed]);

  const onChangeSearch = (input: string) => {
    searchText.current = input;
    const sorted = feed.filter((iter) => {
      return iter.title.includes(input);
    });
    setLatestFeed(sorted);
  };

  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  const mapCoordinates = useMemo(() => {
    return latestFeed.map((post) => {
      return post.coordinate;
    });
  }, [latestFeed]);

  // HOME , LATEST
  return (
    <>
      <main className={Style.main}>
        <Layout>
          <Card className={Style.filters}>
            <Input
              className={Style.inputWrapper}
              placeholder="Search Address, building, title.."
              onChange={(e) => {
                onChangeSearch(e.target.value);
              }}
              value={searchText.current}
            />
          </Card>
          <div className={Style.homeOrientation}>
            <div className={Style.left}>
              <div className={Style.page}>
                <main className={Style.latestPostList}>
                  {latestFeed.length > 0
                    ? latestFeed.map((post) => (
                        <div key={post.id} className={Style.post}>
                          <Post post={post} />
                        </div>
                      ))
                    : "...no content available"}
                </main>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="my-8"
                />
              </div>
            </div>
            <div className={Style.right}>
              <MapComponent
                height="90vh"
                initialMarkers={mapCoordinates}
                hoverContent={latestFeed}
                showHover
              />
            </div>
          </div>

          <style jsx>{`
            .page > h1 {
              margin-bottom: 20px;
            }
            .post {
              background: white;
              transition: box-shadow 0.1s ease-in;
            }
            .post + .post {
              margin-top: 2rem;
            }
          `}</style>
        </Layout>
      </main>
    </>
  );
};

export default Home;
