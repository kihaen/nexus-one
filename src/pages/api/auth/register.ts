import { hash } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type UserResponse = {
  id: string;
  name: string | null;
  email: string | null;
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password }: RegisterData = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password : hashedPassword
        // In a real app, you'd include hashedPassword in your User model
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Create account record
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: user.id,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Registeration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}