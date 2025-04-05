// import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import {NextApiRequest, NextApiResponse} from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]';

// POST /api/message

export interface Message{ 
    id : string,
    title : string,
    content? : string,
    date : Date,
    messageAuthor : string,
    messageReceipient : string,
}
// should we handle if user doesn't have sessions
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const currentDate = new Date();
  const result = await prisma.message.create({
    data: {
      ...req.body,
      messageReceipient : { connect: { email: req.body.messageReceipient as string }},
      messageAuthor: { connect: { email: session?.user?.email as string } },
      date : currentDate.toISOString()
    },
  });
  res.json(result);
}