import {NextResponse} from 'next/server'
import {isStoreEnabled} from '@/lib/store-settings'

export async function GET() {
  const enabled = (await isStoreEnabled()) && !!process.env.STRIPE_SECRET_KEY
  return NextResponse.json({stripeEnabled: enabled})
}
