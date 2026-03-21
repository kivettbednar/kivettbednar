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
  const body = await req.text()
  const sig = req.headers.get('x-gelato-signature') || req.headers.get('x-signature')
  if (!sig) {
    console.warn('Gelato webhook: No signature header')
    return new NextResponse('Missing signature', {status: 401})
  }

  // Verify HMAC-SHA256 signature
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex')
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    console.warn('Gelato webhook: Invalid signature')
    return new NextResponse('Invalid signature', {status: 401})
  }

  // Webhook payload is untyped external data
  let data: Record<string, any> | null
  try {
    data = JSON.parse(body)
  } catch (error) {
    console.error('Gelato webhook: Failed to parse JSON', error)
    return NextResponse.json({ok: false, error: 'Invalid JSON'}, {status: 400})
  }

  if (!data) {
    return NextResponse.json({ok: false, error: 'No data provided'}, {status: 400})
  }

  try {
    // Determine event type from payload
    const eventType = data?.event || data?.eventType || data?.type || 'unknown'

    // Extract order ID — Gelato sends it in different fields depending on event type
    const gelatoOrderId = data?.orderId || data?.id || data?.order?.id || data?.order?.orderId

    if (!gelatoOrderId) {
      console.warn('Gelato webhook: No order ID found in payload', {eventType, keys: Object.keys(data)})
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

    // Build update payload based on event type
    const updateData: Record<string, string | number | null> = {
      updatedAt: new Date().toISOString(),
    }

    // Map Gelato fulfillment statuses to our order statuses
    const statusMap: Record<string, string> = {
      created: 'submitted',
      passed: 'submitted',
      in_production: 'in_production',
      produced: 'in_production',
      shipped: 'shipped',
      delivered: 'delivered',
      canceled: 'canceled',
      cancelled: 'canceled',
      failed: 'failed',
    }

    // Handle order status updates
    const rawStatus = data?.fulfillmentStatus || data?.status || data?.orderStatus
    if (rawStatus) {
      const normalizedStatus = rawStatus.toLowerCase().replace(/\s+/g, '_')
      updateData.gelatoStatus = rawStatus
      updateData.status = statusMap[normalizedStatus] || rawStatus
    }

    // Handle tracking info (from shipment data)
    const shipment = data?.shipment || data?.fulfillment || data
    const trackingNumber = shipment?.trackingCode || shipment?.trackingNumber || data?.trackingNumber || data?.tracking?.number
    const trackingUrl = shipment?.trackingUrl || data?.trackingUrl || data?.tracking?.url
    const carrier = shipment?.carrier || data?.carrier || data?.tracking?.carrier
    const shippingMethod = shipment?.shipmentMethodUid || shipment?.shippingMethod

    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (trackingUrl) updateData.trackingUrl = trackingUrl
    if (carrier) updateData.carrier = carrier
    if (shippingMethod) updateData.shippingMethod = shippingMethod

    // Handle delivery estimate updates
    const deliveryEstimate = data?.estimatedDeliveryDate || data?.deliveryEstimate
      || shipment?.estimatedDeliveryDate || shipment?.maxDeliveryDate
    if (deliveryEstimate) {
      updateData.deliveryEstimate = typeof deliveryEstimate === 'string'
        ? deliveryEstimate
        : JSON.stringify(deliveryEstimate)
    }

    // Update the order
    await writeClient
      .patch(existingOrder._id)
      .set(updateData)
      .commit()

    // Send shipping update email if tracking info received (and not already sent)
    if (trackingNumber && existingOrder.email && trackingNumber !== existingOrder.trackingNumber) {
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
      eventType,
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
