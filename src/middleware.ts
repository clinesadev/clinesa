export { auth as middleware } from "@/lib/auth/config"

export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/billing/:path*", "/settings/:path*"],
}