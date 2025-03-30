import prisma from '../../../../lib/prisma';
import {NextApiRequest, NextApiResponse} from 'next'
import { PostState } from '@/pages/p/[id]';

// DELETE /api/post/:id

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
  const postId = req?.query?.id as string;
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  }
  // POST update for posts
  else if (req.method === 'POST'){
    const s3ImageData = await saveImage(req.body, postId)
    console.log(s3ImageData)
    const post = await prisma.post.update({
      where : {id : postId},
      data : {
        ...req.body,
        files : s3ImageData?.map(i => i.presigned_url)
      }
    })
    res.json(post);

  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

const saveImage = async( requestBody : PostState, id : string): Promise<{presigned_url : string}[]> => { // TODO
  console.log(requestBody.files)
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
    console.log(resp)
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
