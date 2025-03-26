
import React,{useState, useEffect} from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import  MapComponent  from '@/components/MapComponent/MapComponent'
import Post, { PostProps } from '../components/Post';
import prisma from '../../lib/prisma';
import Style from '../styles/Post.module.scss';
import { Input } from '@chakra-ui/react';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session?.user?.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

const Drafts = (props : Props): JSX.Element => {
  const { data: session } = useSession();
  // const {Search} = Input;
  const feed = props.drafts // double check

  const [searchInput, changeInput] = useState<string>('');
  const [drafts, changeDrafts] = useState<PostProps[]>([]); 

  useEffect(()=>{
    changeDrafts(feed)
  },[feed])

  const onChangeSearch = (input : string)=>{
    changeInput(input);
    const sorted = feed.filter((iter)=>{
      return iter.title.includes(input)
    })
    changeDrafts(sorted)
  }

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Input className={Style.inputWrapper} placeholder='Search' onChange={(e)=>{onChangeSearch(e.target.value)}} value={searchInput}/>
      <div className={Style.drafts}>
        <h1>My Drafts</h1>
        <main>
        {drafts.length > 0 ? drafts.map((post) => (
        <div key={post.id} className={Style.post}>
          <Post post={post} />
        </div>
        )) : <p>... No Drafts available</p>}
        </main>
      </div>
    </Layout>
  );
};

export default Drafts;