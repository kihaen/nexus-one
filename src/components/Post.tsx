import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

import Style from "../styles/Post.module.scss"

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
    <div className={Style.postWrapper} onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <div className={Style.postContent}>
      <ReactMarkdown>
        {post.content}
      </ReactMarkdown>
      </div>
    </div>
  );
};

export default Post;