import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: Request) {
  const url = new URL(req.url)
  const isDashboard = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/patients") || url.pathname.startsWith("/billing") || url.pathname.startsWith("/settings")
  if (!isDashboard) return NextResponse.next()
  const token = await getToken({ req: req as Request, secret: process.env.AUTH_SECRET })
  if (!token) {
    const signin = new URL("/api/auth/signin", url.origin)
    return NextResponse.redirect(signin)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/billing/:path*", "/settings/:path*"],
}