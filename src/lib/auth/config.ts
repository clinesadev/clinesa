import NextAuth from "next-auth"
import type { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const authConfig = {
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : []),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? [GitHub] : []),
  ].map((P) => P({})),
  callbacks: {
    jwt: async ({ token, user }) => {
      // Al hacer login, guardar el ID del usuario en el token
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      // Pasar el ID del token a la sesión
      if (session.user && token.id) {
        session.user.id = token.id as string
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