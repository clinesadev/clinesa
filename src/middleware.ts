import NextAuth from "next-auth"
import { authMiddlewareConfig } from "@/lib/auth/middleware-config"

export const { auth: middleware } = NextAuth(authMiddlewareConfig)

export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/billing/:path*", "/settings/:path*"],
}