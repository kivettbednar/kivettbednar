import {NextRequest, NextResponse} from 'next/server'
import {getGelatoProductPrices} from '@/lib/gelato'

export const runtime = 'nodejs'

/**
 * GET /api/gelato/prices?productUid=xxx&currency=USD
 * Get Gelato production costs for a product (for margin tracking)
 */
export async function GET(req: NextRequest) {
  const productUid = req.nextUrl.searchParams.get('productUid')
  if (!productUid) {
    return NextResponse.json({error: 'productUid parameter required'}, {status: 400})
  }

  const currency = req.nextUrl.searchParams.get('currency') || 'USD'

  try {
    const prices = await getGelatoProductPrices(productUid, currency)
    return NextResponse.json({
      productUid,
      currency,
      prices,
      count: prices.length,
    })
  } catch (error: unknown) {
    console.error('Gelato prices error:', error)
    return NextResponse.json({error: 'Failed to fetch product prices'}, {status: 500})
  }
}
