import {NextResponse} from 'next/server'
import {z} from 'zod'
import {createGelatoOrder} from '@/lib/gelato'
import {writeClient} from '@/sanity/lib/write-client'
import {client} from '@/sanity/lib/client'

export const runtime = 'nodejs'

const RetrySchema = z.object({
  orderId: z.string().min(1),
})

/**
 * POST /api/gelato/retry
 * Re-submit a failed Gelato order using stored order data
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RetrySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({error: 'orderId is required'}, {status: 400})
    }

    const {orderId} = parsed.data

    // Fetch the order from Sanity
    const order = await writeClient.fetch(
      `*[_type == "order" && _id == $id][0]{
        _id, status, gelatoError, items, email, name, phone, currency,
        address { line1, line2, city, state, postalCode, country },
        stripeSessionId
      }`,
      {id: orderId}
    )

    if (!order) {
      return NextResponse.json({error: 'Order not found'}, {status: 404})
    }

    if (order.status !== 'gelato_failed') {
      return NextResponse.json(
        {error: `Order status is "${order.status}", not "gelato_failed"`},
        {status: 400}
      )
    }

    // Fetch product data for each item to get current gelatoProductUid and printAreas
    const gelatoItems = []
    for (const item of order.items || []) {
      if (!item.productSlug) continue

      const product = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]{
          gelatoProductUid,
          "printAreas": printAreas[]{ areaName, "artworkUrl": artwork.asset->url }
        }`,
        {slug: item.productSlug}
      )

      if (!product?.gelatoProductUid) continue

      const options = (() => {
        try {
          return JSON.parse(item.options || '{}')
        } catch {
          return {}
        }
      })()

      gelatoItems.push({
        productUid: product.gelatoProductUid,
        quantity: item.quantity || 1,
        attributes: options,
        files: (product.printAreas || [])
          .filter((pa: {areaName?: string; artworkUrl?: string}) => pa?.artworkUrl)
          .map((pa: {areaName?: string; artworkUrl: string}) => ({
            type: pa.areaName || 'front',
            url: pa.artworkUrl,
          })),
      })
    }

    if (gelatoItems.length === 0) {
      return NextResponse.json(
        {error: 'No items with valid Gelato product UIDs found'},
        {status: 400}
      )
    }

    const recipient = {
      addressLine1: order.address?.line1 || '',
      addressLine2: order.address?.line2 || undefined,
      city: order.address?.city || '',
      country: order.address?.country || 'US',
      postalCode: order.address?.postalCode || '',
      state: order.address?.state || undefined,
      name: order.name || undefined,
      email: order.email || undefined,
    }

    // Submit to Gelato
    const gelato = await createGelatoOrder({
      recipient,
      items: gelatoItems,
      marketplaceOrderId: order.stripeSessionId || orderId,
      currency: order.currency || 'USD',
    })

    const newGelatoOrderId = gelato?.orderId || gelato?.id

    // Update the order in Sanity
    await writeClient
      .patch(orderId)
      .set({
        gelatoOrderId: newGelatoOrderId || null,
        gelatoError: newGelatoOrderId ? null : 'Retry returned no order ID',
        status: newGelatoOrderId ? 'submitted' : 'gelato_failed',
        updatedAt: new Date().toISOString(),
      })
      .commit()

    return NextResponse.json({
      success: true,
      gelatoOrderId: newGelatoOrderId,
    })
  } catch (error: unknown) {
    console.error('Retry Gelato order error:', error)
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Retry failed'},
      {status: 500}
    )
  }
}
