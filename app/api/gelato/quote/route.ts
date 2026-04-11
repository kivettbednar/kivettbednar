import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'
import {quoteGelatoOrder} from '@/lib/gelato'
import {ensureAdminRequest} from '@/lib/admin-auth'

export const runtime = 'nodejs'

const QuoteSchema = z.object({
  items: z.array(z.object({
    productUid: z.string().min(1),
    quantity: z.number().int().min(1),
    attributes: z.record(z.string(), z.string()).optional(),
    files: z.array(z.object({type: z.string(), url: z.string()})).optional(),
  })).min(1),
  recipient: z.object({
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    country: z.string().min(2).max(3),
    postalCode: z.string().min(1),
    state: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
  }),
  currency: z.string().length(3).optional(),
})

/**
 * POST /api/gelato/quote
 * Get shipping options and production costs for a potential Gelato order
 */
export async function POST(req: NextRequest) {
  const authResponse = ensureAdminRequest(req)
  if (authResponse) return authResponse
  try {
    const body = await req.json()
    const parsed = QuoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({error: 'Invalid request', details: parsed.error.issues}, {status: 400})
    }

    const quote = await quoteGelatoOrder(parsed.data)
    if (!quote) {
      return NextResponse.json({error: 'Gelato API not configured'}, {status: 501})
    }

    return NextResponse.json(quote)
  } catch (error: unknown) {
    console.error('Gelato quote error:', error)
    const message = error instanceof Error ? error.message : 'Quote failed'
    return NextResponse.json({error: message}, {status: 500})
  }
}
