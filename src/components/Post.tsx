import React from "react";
import Router from "next/router";
import Image from "next/image";
import placeholder from "../assets/placeholderImage.png";
import { Card } from "@/components/ui/card";

import Style from "../styles/Post.module.scss";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  files: string[];
  content: string;
  published: boolean;
  coverImg: string;
  description: string;
  coordinate: number[];
  tag: 'rental' | 'job' | 'selling' | 'meetup' | null;
};

type Post = {
  post: PostProps;
};

const Post = ({ post }: Post): JSX.Element => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <Card
      className={Style.postWrapper}
      onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
    >
      <>
        <Image
          width={400}
          height={250}
          className={Style.postImage}
          src={post?.coverImg || placeholder}
          alt=""
        />
        <div className={Style.postContent}>
          <h2>{post.title}</h2>
          <small>By {authorName}</small>
          {post.tag && (
            <span className={`${Style.tag} ${Style[post.tag]}`}>
              {post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
            </span>
          )}
          <p>{post.description}</p>
        </div>
      </>
    </Card>
  );
};

export default Post;
