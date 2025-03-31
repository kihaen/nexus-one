// services/postCache.ts
import redisClient from '@/lib/redis';
import { Post } from '@prisma/client';

const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

export const getPost = async (id: string): Promise<Post | null> => {
  const cacheKey = `post:${id}`;
  const cachedPost = await redisClient.get(cacheKey);
  
  if (cachedPost) {
    return JSON.parse(cachedPost) as Post;
  }
  return null;
};

// By Post

export const setPost = async (post: Post, ttl: number = DEFAULT_EXPIRATION): Promise<void> => {
  const cacheKey = `post:${post.id}`;
  await redisClient.setEx(cacheKey, ttl, JSON.stringify(post));
};

export const deletePost = async (id: string): Promise<void> => {
  const cacheKey = `post:${id}`;
  await redisClient.del(cacheKey);
};

// By Author ---- needs building out TODO // EX : if user is deleted

export const getPostsByAuthor = async (authorId: string): Promise<Post[]> => {
  const cacheKey = `posts:author:${authorId}`;
  const cachedPosts = await redisClient.get(cacheKey);
  
  if (cachedPosts) {
    return JSON.parse(cachedPosts) as Post[];
  }
  return [];
};

export const setPostsByAuthor = async (authorId: string, posts: Post[], ttl: number = DEFAULT_EXPIRATION): Promise<void> => {
  const cacheKey = `posts:author:${authorId}`;
  await redisClient.setEx(cacheKey, ttl, JSON.stringify(posts));
};

export const invalidateAuthorPosts = async (authorId: string): Promise<void> => {
  const cacheKey = `posts:author:${authorId}`;
  await redisClient.del(cacheKey);
};