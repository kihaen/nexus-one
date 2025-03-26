
import React,{useState, useEffect} from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Message, { MessageProps } from '../components/Message';
import prisma from '../../lib/prisma';
import Style from '../styles/Inbox.module.scss';
import { Input } from '@chakra-ui/react';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { messages: [] } };
  }

  const messages = await prisma.message.findMany({
    where: {
        messageReceipient: { email: session?.user?.email },
      },  
      include: {
          messageReceipient: {
              select: { name: true, email : true },
            },
            messageAuthor : {
                select: { name: true, email : true },
            }
      },
  });

  return {
    props: { messages },
  };
};

type Props = {
  messages: MessageProps[];
};

// Potentially refactor message and drafts to be the same component

const Inbox = (props : Props): JSX.Element => {
  const { data: session } = useSession();
//   const {Search} = Input;
  const feed = props.messages // double check

  const [searchInput, changeInput] = useState<string>('');
  const [message, changeMessages] = useState<MessageProps[]>([]); 


  useEffect(()=>{
    changeMessages(feed)
  },[feed])

  const onChangeSearch = (input : string)=>{
    changeInput(input);
    const sorted = feed.filter((iter)=>{
      return iter.title.includes(input)
    })
    changeMessages(sorted)
  }

  if (!session) {
    return (
      <Layout>
        <h1>My Inbox</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }


  return (
    <Layout>
      <Input className={Style.inputWrapper} placeholder='Search' onChange={(e)=>{onChangeSearch(e.target.value)}} value={searchInput}/>
      <div className={Style.inboxWrapper}>
        <h1>My Inbox</h1>
        <main>
        {message?.length > 0 ? message.map((message) => (
        <div key={message.id} className={Style.message}>
          <Message message={message} />
        </div>
        )) : <p>... No new messages available</p>}
        </main>
      </div>
    </Layout>
  );
};

export default Inbox;