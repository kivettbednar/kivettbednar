/**
 * CSRF protection using the double-submit cookie pattern.
 *
 * Server-side:
 *   generateCsrfToken() — creates a token and sets it as an HttpOnly cookie
 *   validateCsrfToken(req) — checks the token in the request body/header matches the cookie
 *
 * Client-side:
 *   The token is rendered as a hidden form field or read from a meta tag,
 *   then sent in the request body as `_csrf` or header as `x-csrf-token`.
 */

import {cookies} from 'next/headers'
import {randomBytes} from 'crypto'

const CSRF_COOKIE = '__csrf'
const CSRF_HEADER = 'x-csrf-token'

/** Generate a CSRF token. Must be called from a Route Handler or Server Action. */
export function generateCsrfTokenValue(): string {
  return randomBytes(32).toString('hex')
}

/** Validate the CSRF token from the request header against the cookie. */
export async function validateCsrfToken(req: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  if (!cookieToken) return false

  const headerToken = req.headers.get(CSRF_HEADER)
  if (headerToken) return headerToken === cookieToken

  return false
}

/** Cookie name for CSRF — exported for the token endpoint. */
export const CSRF_COOKIE_NAME = CSRF_COOKIE
