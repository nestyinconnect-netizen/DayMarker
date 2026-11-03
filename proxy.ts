import { NextRequest, NextResponse } from "next/server"

import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === "/login"
  const isAuthEndpoint = pathname.startsWith("/api/auth/")
  const isAuthenticated = await isValidSessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (isAuthEndpoint) return NextResponse.next()
  if (isLoginPage) {
    return isAuthenticated ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next()
  }
  if (isAuthenticated) return NextResponse.next()

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  const loginUrl = new URL("/login", request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}