export const SESSION_COOKIE_NAME = "daymark_session"
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

type SessionPayload = {
  username: string
  expiresAt: number
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function getSessionSecret() {
  const secret = process.env.DASHBOARD_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("DASHBOARD_SESSION_SECRET must be configured with at least 32 characters.")
  }
  return secret
}

function getDashboardCredentials() {
  const username = process.env.DASHBOARD_USERNAME
  const password = process.env.DASHBOARD_PASSWORD
  if (!username || !password) throw new Error("Dashboard login secrets are not configured.")
  return { username, password }
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left)
  const rightBytes = new TextEncoder().encode(right)
  const length = Math.max(leftBytes.length, rightBytes.length)
  let mismatch = leftBytes.length ^ rightBytes.length
  for (let index = 0; index < length; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0)
  }
  return mismatch === 0
}

export function areDashboardCredentialsValid(username: string, password: string) {
  const credentials = getDashboardCredentials()
  return constantTimeEqual(username, credentials.username) && constantTimeEqual(password, credentials.password)
}

export async function createSessionToken(username: string) {
  const payload: SessionPayload = {
    username,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload))
  return `${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`
}

export async function isValidSessionToken(token: string | undefined) {
  if (!token) return false
  try {
    const [encodedPayload, encodedSignature, extra] = token.split(".")
    if (!encodedPayload || !encodedSignature || extra !== undefined) return false
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(getSessionSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    )
    const verified = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload),
    )
    if (!verified) return false
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload))) as SessionPayload
    const configuredUsername = process.env.DASHBOARD_USERNAME
    return Boolean(
      configuredUsername &&
      payload.username === configuredUsername &&
      Number.isFinite(payload.expiresAt) &&
      payload.expiresAt > Math.floor(Date.now() / 1000),
    )
  } catch {
    return false
  }
}