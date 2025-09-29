import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : []),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? [GitHub] : []),
  ].map((P) => P({})),
  callbacks: {
    session: async ({ session, user }: { session: unknown; user: unknown }) => {
      if (session && typeof session === 'object' && 'user' in session && user && typeof user === 'object' && 'id' in user) {
        (session as { user: { id: string } }).user.id = user.id as string
      }
      return session
    }
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
} satisfies Parameters<typeof NextAuth>[0]

export const { auth } = NextAuth(authConfig)