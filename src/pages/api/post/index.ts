// import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import {NextApiRequest, NextApiResponse} from 'next'
import { getServerSession } from "next-auth/next"
import { options } from '../auth/[...nextauth]';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  const result = await prisma.post.create({
    data: {
      ...req.body,
      author: { connect: { email: session?.user?.email as string } },
    },
  });
  res.json(result);
}