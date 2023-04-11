import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

type Data = {
  name: string
}

const prisma = new PrismaClient()

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<Data>) {
    const user = await prisma.user.create({data: {name : 'Sally'}})
    console.log(user)
    res.json(user)
}