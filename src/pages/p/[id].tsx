import React from "react"
import { GetServerSidePropsContext } from "next"
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import { useSession } from 'next-auth/react';
import Layout from "../../components/Layout"
import prisma from "../../../lib/prisma";

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
      <div className="Post-Overview-Wrapper">
        <h2>{title}</h2>
        <p className="Post-Overview-Author">By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown>
          {props.content}
        </ReactMarkdown>
        <div className="post-overview-wrapper">
          {!props.published && userHasValidSession && postBelongsToUser && (
              <button className="publish-draft" onClick={() => publishPost(props.id)}>Publish</button>
          )}
          {userHasValidSession && postBelongsToUser && (
            <button className="delete-post" onClick={() => deletePost(props.id)}>Delete</button>
          )}
          </div>
        </div>
      <style jsx>{`
        h2{
          padding-bottom : 10px;
        }
        .Post-Overview-Author{
          padding-bottom : 30px;
          margin-bottom : 10px;
        }
        .post-overview-wrapper{
          margin-top : 20px;
        }
        .publish-draft{
          border : 1px black solid;
        }
        .publish-draft:hover{
          border : 1px black solid;
          color : white;
          background-color : black;
          transition-duration: .3s;
        }
        .delete-post{
          border : 1px black solid;
        }
        .delete-post:hover{
          border : 1px black solid;
          color : white;
          background-color : black;
          transition-duration: .3s;
        }
        .page {
          background: white;
          padding: 2rem;
        }
        .actions {
          margin-top: 2rem;
        }
        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }
        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post