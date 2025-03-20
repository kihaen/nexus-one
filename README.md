## Getting Started

[NEXUS-ONE](https://nexus-one-flax.vercel.app/)

![Screenshot 2025-03-14 at 1 03 03 PM](https://github.com/user-attachments/assets/7f00da84-1cd5-4963-a1dd-07dbd880d6ef)


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
## Tech Stack

This application uses the following : 

**Next.js,
Prisma,
PostgreSQL via Supabase,
NextAuth,
TypeScript,
Vercel for deployment**

## Project Goal

Building out the best new post listing website out a modern day application with server-side rendering, allow bookings and messaging to allow people to privately list and room out open and available space


## Prism Usuage

Once changes are made to Schema 

```bash
npx prisma db push
```

and Because Prisma Client is tailored to your own schema, you need to update it every time your Prisma schema file is changing by running the following command:

```bash
npx prisma generate
```
