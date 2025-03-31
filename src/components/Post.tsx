import React from "react";
import Router from "next/router";
import Image from "next/image";
import placeholder from '../assets/placeholderImage.png'
import { isValidURL } from "@/utility/util";
import {
  Card,
} from "@/components/ui/card"

import Style from "../styles/Post.module.scss"

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  files : string[];
  coverIdx : number;
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
    <Card className={Style.postWrapper} onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <>
      <Image width={400} height={250} className={Style.postImage} src={ post?.files[post.coverIdx]|| post?.coverImg || placeholder} alt=''/>
      <div className={Style.postContent}>
        <h2>{post.title}</h2>
        <small>By {authorName}</small>
        <p>{post.description}</p>
      </div>
    </>
    </Card>
  );
};

export default Post;