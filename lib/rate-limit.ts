/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window counter per IP address.
 *
 * Usage:
 *   const limiter = createRateLimiter({windowMs: 60_000, max: 5})
 *   // In your route handler:
 *   const limited = limiter.check(req)
 *   if (limited) return limited // Returns a 429 NextResponse
 */

import {NextResponse} from 'next/server'

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimiterOptions = {
  /** Time window in milliseconds */
  windowMs: number
  /** Max requests per window */
  max: number
  /** Response message when rate limited */
  message?: string
}

export function createRateLimiter(options: RateLimiterOptions) {
  const {windowMs, max, message = 'Too many requests. Please try again later.'} = options
  const store = new Map<string, RateLimitEntry>()

  // Periodically clean expired entries to prevent memory leaks
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key)
    }
  }, windowMs * 2).unref()

  return {
    check(req: Request): NextResponse | null {
      const ip = getClientIp(req)
      const now = Date.now()
      const entry = store.get(ip)

      if (!entry || now > entry.resetAt) {
        store.set(ip, {count: 1, resetAt: now + windowMs})
        return null
      }

      entry.count++
      if (entry.count > max) {
        return NextResponse.json(
          {error: message},
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
            },
          }
        )
      }

      return null
    },
  }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}
