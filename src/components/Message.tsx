import React, {useState} from "react";
import { useRouter } from "next/router";
import Style from "../styles/Inbox.module.scss";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export type MessageProps = {
  id: string;
  title: string;
  content? : string;
  context? : string;
  date : string;
  messageAuthor : {
    name: string;
    email: string;
  }
  messageReceipient : {
    name: string;
    email: string;
  }
};

type Message = {
    message : MessageProps
}

const Message = ({ message } : Message): JSX.Element => {
  const authorName = message.messageAuthor ? message.messageAuthor.name : "Unknown author";
  const localDate = new Date(message.date).toString()
  const router = useRouter();

  const [replyContent, setReplyContent] = useState("")
  const [showReplySection, setShowReplySection] = useState(false)

  async function replyMessage(id: string): Promise<void> {
    const body =  { title : message.title, content : message.content + "\n \n" + replyContent, messageReceipient : message.messageAuthor.email, context : message?.context };
    await fetch(`/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    router.replace(router.asPath);
    setShowReplySection(false)
  }
  
  async function deleteMessage(id: string): Promise<void> {
    await fetch(`/api/message/${id}`, {
      method: 'DELETE',
    });
    router.replace(router.asPath);
  }

  return (
    <div className={Style.messageWrapper} onClick={() => {}}>
      <>
      <div className={Style.messageHeader}>
        <h2>{message.title}</h2>
        <div className={Style.messageActionWrapper}>
          <button onClick={()=>{
            setShowReplySection((prev)=> !prev)
          }}>{!showReplySection ? 'Reply' : 'Hide Reply'}</button>
          <button onClick={()=>{
            deleteMessage(message.id)
          }}>Delete</button>
        </div>
      </div>

      <div className={Style.messageDetails}>
        <small>By {authorName}</small>
        <div><small> on :  {localDate}</small></div>
        <Link className={Style.messageContext} href={message.context ? `/p/${message.context}` : '/inbox'}><small> Original Post</small></Link>
      </div>
      <div className={Style.postContent}>
        <ReactMarkdown>{message?.content || ''}</ReactMarkdown>
      </div>
      { showReplySection && 
        <>
        <div className={Style.line}/>
          <div className={Style.postContent}>
            <textarea  className={Style.postReplyContent} placeholder="Reply here.." onChange={(e)=>{
              setReplyContent( "------------------ \n" + e.target.value) // Refactor
            }}/>
          </div>
          <button className={Style.button} onClick={()=>{
            replyMessage(message.id)
          }}>Send</button>
        </>
      }
    </>
    </div>

  );
};

export default Message;