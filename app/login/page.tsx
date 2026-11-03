import type { Metadata } from "next"

import { LoginForm } from "@/app/login/login-form"

export const metadata: Metadata = {
  title: "Sign in — daymark",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginForm />
}