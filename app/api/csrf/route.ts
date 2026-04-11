import {NextResponse} from 'next/server'
import {generateCsrfTokenValue, CSRF_COOKIE_NAME} from '@/lib/csrf'

export async function GET() {
  const token = generateCsrfTokenValue()

  const response = NextResponse.json({token})
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  })

  return response
}
