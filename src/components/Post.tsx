import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

type Post = {
    post : PostProps
}

const Post = ({ post } : Post): JSX.Element => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div className="post-wrapper" onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <div className="post-content">
      <ReactMarkdown>
        {post.content}
      </ReactMarkdown>
      </div>
      <style jsx>{`
        h2{
          margin-bottom : 10px;
        }
        .post-content{
          margin-top: 20px;
        }
        .post-wrapper{
          border : 1px black solid;
          background-color : white;
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;