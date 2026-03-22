import {NextResponse} from 'next/server'
import {z} from 'zod'

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
})

export async function POST(req: Request) {
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
