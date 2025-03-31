import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'
import { PostState } from '@/pages/p/[id]';
import { getPost, setPost, deletePost, invalidateAuthorPosts } from '@/services/postCache';

// build out author index delete on redis, if user is deleted! TODO

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Increased from default 1MB to 10MB
    }
  }
};

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
  // DELETE /api/post/:id
  const postId = req?.query?.id as string;
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    // Invalidate cache
    await deletePost(postId);

    return res.json(post);
  }
  else if (req.method === 'GET'){
    const cachedPost = await getPost(postId);
    console.log("cache-?", cachedPost)
    if (cachedPost) {
      console.log("cache-hit", cachedPost)
      return res.json(cachedPost);
    }
    // Fallback to database
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (post) {
      // Cache the post with expiration
      await setPost(post);
      return res.json(post);
    }
    return res.status(404).json({ error: 'Post not found' });
  }
  // POST update for posts
  else if (req.method === 'POST'){
    const s3ImageData = await saveImage(req.body, postId)
    const post = await prisma.post.update({
      where : {id : postId},
      data : {
        ...req.body,
        files : s3ImageData?.map(i => i.presigned_url)
      }
    })

    // Update cache with new version
    await setPost(post);
    await invalidateAuthorPosts(post.authorId); // needs to be checked !!!

    return res.json(post);

  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

const saveImage = async( requestBody : PostState, id : string): Promise<{presigned_url : string}[]> => { 
  
  if(requestBody.files.length > 0){
    const files = requestBody?.files?.map(( data, index )=>  {
      const contentType = extractFromBase64(data)[0]
      const extension = getExtensionFromMime(contentType);
      return ({"object_key": `post/${id}/${requestBody.title}-${index}.${extension}`, "byte_data":  extractFromBase64(data)[1], "content_type": contentType, "expiration": 3600})})
    const body =  {files};
    const response = await fetch(process.env.S3_IMAGE_SERVICE || '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const resp = await response.json()
    return resp?.results
  }
  return []
}

function extractFromBase64(base64String: string): [string, string] {
  const matches = base64String.match(/^data:(.+?);base64,(.*)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string format');
  }
  return [matches[1], matches[2]]; // [contentType, base64Data]
}

function getExtensionFromMime(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico'
  };
  return mimeToExt[mimeType.toLowerCase()] || 'bin';
}
