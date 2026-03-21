import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {getStripe} from '@/lib/stripe'

export async function GET(
  req: NextRequest,
  {params}: {params: Promise<{sessionId: string}>}
) {
  const {sessionId} = await params
  const emailParam = req.nextUrl.searchParams.get('email')

  if (!sessionId) {
    return NextResponse.json({error: 'Session ID required'}, {status: 400})
  }

  // Determine the verified email
  let verifiedEmail: string | null = null

  if (process.env.STRIPE_ENABLED === 'true' && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = getStripe()
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      verifiedEmail = session.customer_details?.email || null
    } catch {
      return NextResponse.json({error: 'Order not found'}, {status: 404})
    }
  } else {
    // Dev/demo mode — no Stripe verification available.
    // Only allow if explicitly running in development, not in production.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({error: 'Stripe not configured'}, {status: 501})
    }
    verifiedEmail = emailParam
  }

  if (!verifiedEmail) {
    return NextResponse.json({error: 'Email required'}, {status: 400})
  }

  try {
    const order = await client.fetch(
      `*[_type == "order" && stripeSessionId == $sessionId][0]{
        _id,
        stripeSessionId,
        email,
        name,
        address,
        items,
        totalCents,
        currency,
        status,
        createdAt
      }`,
      {sessionId}
    )

    if (!order || order.email !== verifiedEmail) {
      return NextResponse.json({error: 'Order not found'}, {status: 404})
    }

    return NextResponse.json(order)
  } catch (error: unknown) {
    console.error('Failed to fetch order:', error)
    return NextResponse.json({error: 'Failed to fetch order'}, {status: 500})
  }
}
