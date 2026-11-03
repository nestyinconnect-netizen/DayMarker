import { NextResponse } from "next/server"

import { SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (origin && new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  return response
}