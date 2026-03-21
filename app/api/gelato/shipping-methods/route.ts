import {NextRequest, NextResponse} from 'next/server'
import {getGelatoShippingMethods} from '@/lib/gelato'

export const runtime = 'nodejs'

/**
 * GET /api/gelato/shipping-methods?country=US
 * List available Gelato shipping methods for a country
 */
export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get('country')
  if (!country || country.length < 2) {
    return NextResponse.json({error: 'country parameter required (ISO 2-letter code)'}, {status: 400})
  }

  try {
    const methods = await getGelatoShippingMethods(country.toUpperCase())
    return NextResponse.json({methods, count: methods.length})
  } catch (error: unknown) {
    console.error('Shipping methods error:', error)
    return NextResponse.json({error: 'Failed to fetch shipping methods'}, {status: 500})
  }
}
