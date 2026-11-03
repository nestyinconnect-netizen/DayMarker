import { NextResponse } from "next/server"

import { areDashboardCredentialsValid, createSessionToken, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/auth"

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (origin && new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
  }

  let input: { username?: unknown; password?: unknown }
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 })
  }

  if (typeof input.username !== "string" || typeof input.password !== "string") {
    return NextResponse.json({ error: "Enter your username and password." }, { status: 400 })
  }

  try {
    if (!areDashboardCredentialsValid(input.username, input.password)) {
      return NextResponse.json({ error: "Username or password is incorrect." }, { status: 401 })
    }
    const sessionToken = await createSessionToken(input.username)
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: new URL(request.url).protocol === "https:",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    })
    return response
  } catch (error) {
    console.error("Dashboard authentication is not configured", error)
    return NextResponse.json({ error: "Login is not configured on the server." }, { status: 503 })
  }
}