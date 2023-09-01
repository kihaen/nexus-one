import React, {useState, useEffect} from "react"
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

const Post = (props : any) => {
  const { data: session, status } = useSession();

  const [title, setTitle] = useState<string>(props?.title || '')
  const [content, setContent] = useState<string>(props.content || '')

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
  
  const editPost = async (id: string) => {
    try {
      const body = { title, content };
      await fetch(`/api/post/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      // await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  };

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  return (
    <Layout>
      <div className={Style.postOverviewWrapper}>
        <h1>Edit Post</h1>
        <input
            autoFocus
            onChange={(e)=>{setTitle(e.target.value)}}
            placeholder="Title"
            value={title}
            type="text"
          />
        {/* <p className={Style.postOverviewAuthor}>By {props?.author?.name || "Unknown author"}</p> */}
        <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            value={content}
            rows={8}
          />
        <div>
          {!props.published && userHasValidSession && postBelongsToUser && (
              <button className={Style.publishDraft} onClick={() => publishPost(props.id)}>Publish</button>
          )}
          {userHasValidSession && postBelongsToUser && (
            <button className={Style.deletePost} onClick={() => editPost(props.id)}>Edit</button>
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