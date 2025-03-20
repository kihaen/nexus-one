import React from "react";
import Router from "next/router";
import Image from "next/image";
import placeholder from '../assets/placeholderImage.png'
import { isValidURL } from "@/utility/util";
import { Card } from "antd";

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
  coverImg : string;
  description : string;
  coordinate : number[]
};

type Post = {
    post : PostProps
}

const Post = ({ post } : Post): JSX.Element => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <Card className={Style.postWrapper} hoverable cover={<Image width={338} height={300} src={isValidURL(post?.coverImg)? post?.coverImg : placeholder} alt=''/>} onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <div className={Style.postContent}>
      <p>{post.description}</p>
      </div>
    </>
    </Card>
  );
};

export default Post;