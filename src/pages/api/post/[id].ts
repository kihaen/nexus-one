import prisma from '../../../../lib/prisma';
import {NextApiRequest, NextApiResponse} from 'next'

// DELETE /api/post/:id
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
    const post = await prisma.post.update({
      where : {id : postId},
      data : {
        ...req.body
      }
    })
    res.json(post);

  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}