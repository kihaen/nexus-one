import prisma from '../../../../lib/prisma';
import {NextApiRequest, NextApiResponse} from 'next'

// DELETE /api/message/:id
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const messageId = req?.query?.id as string;
  if (req.method === 'DELETE') {
    const message = await prisma.message.delete({
      where: { id: messageId },
    });
    res.json(message);
  }
  // POST update for messages
//   else if (req.method === 'POST'){
//     const message = await prisma.message.update({
//       where : {id : messageId},
//       data : {
//         ...req.body
//       }
//     })
//     res.json(message);

//   } else {
//     throw new Error(
//       `The HTTP ${req.method} method is not supported at this route.`,
//     );
//   }
}