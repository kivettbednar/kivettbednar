import {NextRequest, NextResponse} from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

/**
 * POST /api/gelato/webhook
 * Handles Gelato webhook events for order status updates
 * Updates Sanity orders with latest status, tracking info, etc.
 */
export async function POST(req: NextRequest) {
  // Verify webhook signature
  const secret = process.env.GELATO_WEBHOOK_SECRET
  if (!secret) {
    console.warn('Gelato webhook: GELATO_WEBHOOK_SECRET not configured')
    return new NextResponse('Webhook secret not configured', {status: 501})
  }
  const sig = req.headers.get('x-gelato-signature') || req.headers.get('x-signature')
  const sigBuf = Buffer.from(sig || '')
  const secretBuf = Buffer.from(secret)
  if (sigBuf.length !== secretBuf.length || !crypto.timingSafeEqual(sigBuf, secretBuf)) {
    console.warn('Gelato webhook: Invalid signature')
    return new NextResponse('Invalid signature', {status: 401})
  }

  // Webhook payload is untyped external data
  let data: Record<string, any> | null
  try {
    data = await req.json()
  } catch (error) {
    console.error('Gelato webhook: Failed to parse JSON', error)
    return NextResponse.json({ok: false, error: 'Invalid JSON'}, {status: 400})
  }

  if (!data) {
    return NextResponse.json({ok: false, error: 'No data provided'}, {status: 400})
  }

  try {
    // Extract relevant data from webhook payload
    const gelatoOrderId = data?.orderId || data?.id || data?.order?.id
    const status = data?.status || data?.event || data?.orderStatus
    const trackingNumber = data?.trackingNumber || data?.tracking?.number
    const trackingUrl = data?.trackingUrl || data?.tracking?.url
    const carrier = data?.carrier || data?.tracking?.carrier

    if (!gelatoOrderId) {
      console.warn('Gelato webhook: No order ID found in payload', data)
      return NextResponse.json({ok: true, message: 'No order ID found'})
    }

    // Update order in Sanity
    const {writeClient} = await import('@/sanity/lib/write-client')

    // Find the order
    const existingOrder = await writeClient
      .fetch(`*[_type == "order" && gelatoOrderId == $id][0]`, {id: gelatoOrderId})
      .catch(() => null)

    if (!existingOrder) {
      console.warn(`Gelato webhook: Order not found for Gelato ID ${gelatoOrderId}`)
      return NextResponse.json({ok: true, message: 'Order not found'})
    }

    // Build update payload
    const updateData: Record<string, string> = {
      updatedAt: new Date().toISOString(),
    }

    if (status) {
      updateData.status = status
      updateData.gelatoStatus = status
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    if (trackingUrl) {
      updateData.trackingUrl = trackingUrl
    }

    // Update the order
    await writeClient
      .patch(existingOrder._id)
      .set(updateData)
      .commit()

    // Send shipping update email if tracking info received
    if (trackingNumber && existingOrder.email) {
      try {
        const {sendShippingUpdate} = await import('@/lib/email')
        await sendShippingUpdate({
          orderId: existingOrder._id,
          email: existingOrder.email,
          name: existingOrder.name || undefined,
          trackingNumber,
          trackingUrl,
          carrier,
        })
      } catch (e) {
        console.error('Failed to send shipping update email:', e)
      }
    }

    return NextResponse.json({
      ok: true,
      orderId: existingOrder._id,
      gelatoOrderId,
      updated: Object.keys(updateData),
    })
  } catch (error: unknown) {
    console.error('Gelato webhook: Processing error', error)
    return NextResponse.json(
      {
        ok: false,
        error: 'Internal server error',
      },
      {status: 500}
    )
  }
}
