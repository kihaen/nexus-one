import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

// Extend session with custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
    };
    accessToken?: string;
  }
}

// Extend JWT with custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              // emailVerified: true, //email verification needs building out!
              // image: true
            },
          });

          // If no user found or no password set (OAuth user)
          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          // Verify password
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            // emailVerified: user.emailVerified,
            // image: user.image
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true }, // This ensures accounts are loaded
        });

        if (existingUser && account) {
          // Safe check for accounts
          const hasProviderAccount =
            existingUser.accounts?.some(
              (acc) => acc.provider === account.provider
            ) ?? false;

          if (!hasProviderAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                // ... other account fields
              },
            });
          }
        }
      }
      return true;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub || user.id;
        session.user.role = (token.role as string) || "user"; // Default role
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = "user"; // consider different roles in future
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin", // Note this needs to be updated is path is changed
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);
export default authHandler;
