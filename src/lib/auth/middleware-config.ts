import type { NextAuthConfig } from "next-auth"

// Config base sin adapter (edge-compatible)
export const authMiddlewareConfig = {
  providers: [], // Vacío para edge runtime, los providers reales están en config.ts
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth?.user
    },
  },
  pages: {
    signIn: "/api/auth/signin",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig