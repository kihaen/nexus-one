// import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import {NextApiRequest, NextApiResponse} from 'next'
import { getServerSession } from "next-auth/next"
import { options } from '../auth/[...nextauth]';

// POST /api/message

export interface Message{ 
    id : string,
    title : string,
    content? : string,
    date : Date,
    messageAuthor : string,
    messageReceipient : string,
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  const currentDate = new Date();
  console.log(req.body, req.body.messageReceipient, session?.user?.email)
  const result = await prisma.message.create({
    data: {
      ...req.body,
      messageReceipient : { connect: { email: req.body.messageReceipient as string }},
      messageAuthor: { connect: { email: session?.user?.email as string } },
      date : currentDate.toISOString()
    },
  });
  console.log(result) // DEBUG
  res.json(result);
}