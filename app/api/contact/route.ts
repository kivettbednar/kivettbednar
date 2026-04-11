import {NextResponse} from 'next/server'
import {z} from 'zod'
import {createRateLimiter} from '@/lib/rate-limit'
import {validateCsrfToken} from '@/lib/csrf'

// 5 contact form submissions per minute per IP
const limiter = createRateLimiter({windowMs: 60_000, max: 5})

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
})

export async function POST(req: Request) {
  const limited = limiter.check(req)
  if (limited) return limited

  const csrfValid = await validateCsrfToken(req)
  if (!csrfValid) {
    return NextResponse.json({error: 'Invalid request. Please refresh the page and try again.'}, {status: 403})
  }

  try {
    const body = await req.json()
    const data = ContactSchema.parse(body)

    const {sendContactFormSubmission} = await import('@/lib/email')
    const result = await sendContactFormSubmission(data)

    if (!result.success) {
      return NextResponse.json(
        {error: 'Failed to send message. Please try emailing directly.'},
        {status: 500}
      )
    }

    return NextResponse.json({ok: true})
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({error: 'Invalid form data'}, {status: 400})
    }
    console.error('Contact form error:', e)
    return NextResponse.json({error: 'Something went wrong'}, {status: 500})
  }
}
