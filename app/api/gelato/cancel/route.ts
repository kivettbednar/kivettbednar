import {NextResponse} from 'next/server'
import {z} from 'zod'
import {cancelGelatoOrder} from '@/lib/gelato'
import {writeClient} from '@/sanity/lib/write-client'

export const runtime = 'nodejs'

const CancelSchema = z.object({
  orderId: z.string().min(1),
})

/**
 * POST /api/gelato/cancel
 * Cancel a Gelato order and update status in Sanity
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = CancelSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({error: 'orderId is required'}, {status: 400})
    }

    const {orderId} = parsed.data

    // Find the order in Sanity to get the Gelato order ID
    const order = await writeClient.fetch(
      `*[_type == "order" && _id == $id][0]{ _id, gelatoOrderId, status }`,
      {id: orderId}
    )

    if (!order) {
      return NextResponse.json({error: 'Order not found'}, {status: 404})
    }

    if (!order.gelatoOrderId) {
      // No Gelato order — just update Sanity status
      await writeClient.patch(orderId).set({
        status: 'canceled',
        updatedAt: new Date().toISOString(),
      }).commit()
      return NextResponse.json({success: true, message: 'Order canceled (no Gelato order to cancel)'})
    }

    // Cancel in Gelato
    const result = await cancelGelatoOrder(order.gelatoOrderId)

    // Update Sanity regardless — even if Gelato cancel fails (already in production),
    // mark it as canceled in our system
    await writeClient.patch(orderId).set({
      status: 'canceled',
      ...(result.error && {gelatoError: `Cancel failed: ${result.error}`}),
      updatedAt: new Date().toISOString(),
    }).commit()

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: `Order marked canceled locally but Gelato cancel failed: ${result.error}. The order may already be in production.`,
      }, {status: 409})
    }

    return NextResponse.json({success: true})
  } catch (error: unknown) {
    console.error('Cancel order error:', error)
    return NextResponse.json({error: 'Failed to cancel order'}, {status: 500})
  }
}
