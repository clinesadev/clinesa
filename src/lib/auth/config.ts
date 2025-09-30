import NextAuth from "next-auth"
import type { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { PrismaClient } from "@prisma-generated/index"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const authConfig = {
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  session: { strategy: "database" as const },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : []),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? [GitHub] : []),
  ].map((P) => P({})),
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: "/api/auth/signin",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
} satisfies Parameters<typeof NextAuth>[0]

export const { auth, handlers } = NextAuth(authConfig)