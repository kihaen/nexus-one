## Getting Started

[NEXUS-ONE](https://https://nexus-one-flax.vercel.app/)

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

To determine the best way to build out a modern day application with server-side rendering


## Prism Usuage

Once changes are made to Schema 

```bash
npx prisma db push
```

and Because Prisma Client is tailored to your own schema, you need to update it every time your Prisma schema file is changing by running the following command:

```bash
npx prisma generate
```
