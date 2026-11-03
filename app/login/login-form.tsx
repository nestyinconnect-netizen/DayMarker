"use client"

import { useState, type FormEvent } from "react"
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to sign in.")
      window.location.assign("/")
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_12%,oklch(0.88_0.07_82)_0%,transparent_38%),radial-gradient(ellipse_at_90%_88%,oklch(0.84_0.07_154)_0%,transparent_34%)] opacity-70" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:min-h-[560px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
          <div className="absolute -right-20 -top-20 size-80 rounded-full border border-sidebar-foreground/10" />
          <div className="absolute -bottom-28 -left-24 size-96 rounded-full border border-sidebar-foreground/10" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <Sparkles aria-hidden="true" />
            </span>
            <div>
              <p className="text-xl font-semibold">daymark</p>
              <p className="text-xs text-sidebar-foreground/65">Your personal rhythm</p>
            </div>
          </div>
          <div className="relative max-w-sm">
            <p className="text-xs font-semibold uppercase text-sidebar-primary">A little more focus</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Make room for what matters.</h1>
            <p className="mt-4 text-sm leading-6 text-sidebar-foreground/70">Your plans, tasks, and everyday spending, gathered in one private space.</p>
          </div>
          <p className="relative text-xs text-sidebar-foreground/50">Private workspace</p>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-10">
          <Card className="w-full max-w-sm border-0 shadow-none">
            <CardHeader className="px-0 pb-6">
              <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary lg:hidden">
                <Sparkles aria-hidden="true" />
              </span>
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-muted text-primary">
                <LockKeyhole aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your private dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required maxLength={120} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={256} />
                  </Field>
                  {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
                  <Button type="submit" className="mt-2 h-11 w-full" disabled={submitting}>
                    {submitting ? "Signing in…" : "Sign in"}
                    {!submitting ? <ArrowRight data-icon="inline-end" aria-hidden="true" /> : null}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}