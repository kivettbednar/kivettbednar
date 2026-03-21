import {NextResponse} from 'next/server'
import {getGelatoCatalog, getGelatoProduct} from '@/lib/gelato'

export const runtime = 'nodejs'

/**
 * GET /api/gelato/catalog
 * Fetches Gelato product catalog
 * Query params:
 *   - productUid: (optional) Get specific product details
 */
export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url)
    const productUid = searchParams.get('productUid')

    // Get specific product
    if (productUid) {
      const product = await getGelatoProduct(productUid)
      if (!product) {
        return NextResponse.json({error: 'Product not found'}, {status: 404})
      }
      return NextResponse.json({product})
    }

    // Get full catalog
    const products = await getGelatoCatalog()
    return NextResponse.json({
      products,
      count: products.length,
      message: products.length === 0 ? 'Gelato API not configured or no products available' : undefined,
    })
  } catch (error: unknown) {
    console.error('Gelato catalog API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch Gelato catalog',
        configured: false,
      },
      {status: 500}
    )
  }
}
