import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<Data>) {
    // const user = await prisma.user.create(
    //   {data: {name : 'Sally', email : 'Sally2@gmail.com', createdAt : '1/2/2021', updatedAt : '2/3/2022', posts : undefined}}
    // )
    // res.json(user)
}