import Layout from '@/components/Layout'
import Post from '@/components/Post'
import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { Customer } from '@/components/Customer'
import { GetServerSideProps } from 'next/types'
import prisma from "../../lib/prisma";
import { PostProps } from '@/components/Post'

const inter = Inter({ subsets: ['latin'] })

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
  const [searchInput, changeInput] = useState<string>('');
  const [publicFeed, changeFeed] = useState<PostProps[]>([]); 
  const { feed } = props;

  useEffect(()=>{
    changeFeed(feed)
  },[feed])

  const onChangeSearch = (input : string)=>{
    changeInput(input);
    const sorted = feed.filter((iter)=>{
      return iter.title.includes(input)
    })
    changeFeed(sorted)
  }

  return (
    <>
      <main className={''}>
        {/* <Customer data={{todo : 'dsds', 'something' : 4}}/> */}
        <Layout>
          <input onChange={(e)=>{onChangeSearch(e.target.value)}} value={searchInput}/>
          <div className="page">
            <h1>Public Feed</h1>
            <main>
              {/* {props.feed.map((post) => (
                <div key={post.id} className="post">
                  <Post post={post} />
                </div>
              ))} */}
              {publicFeed.map((post) => (
                <div key={post.id} className="post">
                  <Post post={post} />
                </div>
              ))}
            </main>
          </div>
          <style jsx>{`
            .page>h1{
              margin-bottom: 20px
            }
            .post {
              background: white;
              transition: box-shadow 0.1s ease-in;
            }
            .post:hover {
              box-shadow: 1px 1px 3px #aaa;
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
