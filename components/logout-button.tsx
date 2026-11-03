"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    setSigningOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      window.location.assign("/login")
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={signingOut} onClick={signOut}>
      <LogOut data-icon="inline-start" aria-hidden="true" />
      Sign out
    </Button>
  )
}