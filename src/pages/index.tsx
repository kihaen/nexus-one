import Layout from '@/components/Layout'
import Post from '@/components/Post'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import { Customer } from '@/components/Customer'
import { GetServerSideProps } from 'next/types'
import  MapComponent  from '@/components/MapComponent/MapComponent'
import prisma from "../../lib/prisma";
import { PostProps } from '@/components/Post'
import { Input } from 'antd'
import Style from "../styles/Home.module.css";

const inter = Inter({ subsets: ['latin'] })
const { Search } = Input;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
  };
};

type Props = {
  feed : PostProps[]
}


const Home = (props : Props): JSX.Element =>{ //props here is bypass 
  const searchText = useRef('')
  const [latestFeed, setLatestFeed] = useState<PostProps[]>([]); 
  const { feed } = props;

  useEffect(()=>{
    setLatestFeed(feed)
  },[feed])

  const onChangeSearch = (input : string)=>{
    searchText.current = input;
    const sorted = feed.filter((iter)=>{
      return iter.title.includes(input)
    })
    setLatestFeed(sorted)
  }
  
  const mapCoordinates = useMemo(()=>{
    return latestFeed.map((post)=>{
      return post.coordinate
    })
  }, [latestFeed])

  console.log(mapCoordinates)

  return (
    <>
      <main className={Style.main}>
        <Layout>
          <div className={Style.homeOrientation}>
          <div className={Style.left}>
            <Search className={Style.inputWrapper} placeholder='Search' onChange={(e)=>{onChangeSearch(e.target.value)}} value={searchText.current}/>
            <MapComponent height='80vh' initialMarkers={mapCoordinates}/>
          </div>
          <div className={Style.right}>
            <div className={Style.page}>
              <h1 className={Style.publicTitle}>Latest Posts</h1>
              <main className={Style.latestPostList}>
                {latestFeed.length > 0 ? latestFeed.map((post) => (
                  <div key={post.id} className={Style.post}>
                    <Post post={post} />
                  </div>
                )) : "...no content available"}
              </main>
            </div>
          </div>
          </div>

          <style jsx>{`
            .page>h1{
              margin-bottom: 20px
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
  )
}

export default Home
