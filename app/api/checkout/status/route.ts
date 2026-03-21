import {NextResponse} from 'next/server'

export async function GET() {
  const stripeEnabled = process.env.STRIPE_ENABLED === 'true' && !!process.env.STRIPE_SECRET_KEY
  return NextResponse.json({stripeEnabled})
}
