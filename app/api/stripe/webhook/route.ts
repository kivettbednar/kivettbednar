import {NextRequest, NextResponse} from 'next/server'
import Stripe from 'stripe'
import {client} from '@/sanity/lib/client'
import {productBySlugQuery} from '@/sanity/lib/queries'
import {createGelatoOrder} from '@/lib/gelato'
import {getStripe} from '@/lib/stripe'
import {writeClient} from '@/sanity/lib/write-client'

export const runtime = 'nodejs'

type LineItemMeta = {
  productId: string
  slug: string
  options: Record<string, string>
}

async function extractLineItemMeta(
  stripe: Stripe,
  lineItem: Stripe.LineItem
): Promise<LineItemMeta | null> {
  let meta: Record<string, any> | null = null

  if (lineItem.price && typeof lineItem.price.product === 'string') {
    const price = await stripe.prices.retrieve(lineItem.price.id, {expand: ['product']})
    meta = (price.product as Stripe.Product).metadata || null
  } else if (lineItem.price && (lineItem.price.product as any)?.metadata) {
    meta = (lineItem.price.product as any).metadata || null
  }

  if (!meta?.productId) return null

  return {
    productId: meta.productId,
    slug: meta.slug || '',
    options: (() => { try { return JSON.parse(meta.options || '{}') } catch { return {} } })(),
  }
}

export async function POST(req: NextRequest) {
  if (process.env.STRIPE_ENABLED !== 'true') {
    return NextResponse.json({error: 'Stripe webhooks are disabled'}, {status: 501})
  }

  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.warn('Stripe webhook: STRIPE_WEBHOOK_SECRET not configured')
    return new NextResponse('Webhook secret not configured', {status: 501})
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: unknown) {
    return new NextResponse('Webhook signature verification failed', {status: 400})
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Idempotency check: if order already exists and was fully processed, skip
      const orderId = `order-${session.id}`
      const existingOrder = await writeClient.fetch(
        `*[_type == "order" && _id == $id][0]{ _id, postProcessed }`,
        {id: orderId}
      )
      if (existingOrder?.postProcessed) {
        return NextResponse.json({received: true})
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // Extract metadata for all line items in a single pass
      const itemsWithMeta: Array<{
        lineItem: Stripe.LineItem
        meta: LineItemMeta
        product: Record<string, any>
      }> = []

      for (const li of lineItems.data) {
        const meta = await extractLineItemMeta(stripe, li)
        if (!meta) continue

        const product = await client.fetch(productBySlugQuery, {slug: meta.slug})
        if (!product) continue

        itemsWithMeta.push({lineItem: li, meta, product})
      }

      // Build Gelato order items
      const gelatoItems = itemsWithMeta
        .filter(({product}) => product.gelatoProductUid)
        .map(({lineItem, meta, product}) => ({
          productUid: product.gelatoProductUid,
          quantity: lineItem.quantity || 1,
          attributes: meta.options,
          files: (product.printAreas || [])
            .filter((pa: {areaName?: string; artwork?: {asset?: {url?: string}}}) => pa?.artwork?.asset?.url)
            .map((pa: {areaName?: string; artwork: {asset: {url: string}}}) => ({type: pa.areaName || 'front', url: pa.artwork.asset.url})),
        }))

      // Build recipient from shipping_details
      const sd = session.shipping_details
      const recipient = {
        addressLine1: sd?.address?.line1 || '',
        addressLine2: sd?.address?.line2 || undefined,
        city: sd?.address?.city || '',
        country: sd?.address?.country || 'US',
        postalCode: sd?.address?.postal_code || '',
        state: sd?.address?.state || undefined,
        name: sd?.name || undefined,
        email: session.customer_details?.email || undefined,
      }

      // Create Gelato order
      let gelatoOrderId: string | undefined
      let gelatoError: string | undefined
      if (gelatoItems.length > 0) {
        try {
          const gelato = await createGelatoOrder({
            recipient,
            items: gelatoItems,
            marketplaceOrderId: session.id,
            currency: session.currency?.toUpperCase() || 'USD',
            itemPrices: gelatoItems.map((item, index) => {
              const match = itemsWithMeta.find(({product}) => product.gelatoProductUid === item.productUid)
              return {itemIndex: index, priceCents: match?.lineItem.price?.unit_amount || 0}
            }),
          })
          gelatoOrderId = gelato?.orderId || gelato?.id
        } catch (e: unknown) {
          console.error('Gelato order error', e)
          gelatoError = e instanceof Error ? e.message : 'Unknown Gelato error'
        }
      }

      // Build order items for Sanity
      const orderItems = itemsWithMeta.map(({lineItem, meta, product}) => ({
        productId: meta.productId,
        productTitle: lineItem.description || product.title || 'Unknown Product',
        productSlug: meta.slug,
        quantity: lineItem.quantity || 1,
        priceCents: lineItem.price?.unit_amount || 0,
        options: JSON.stringify(meta.options),
        gelatoProductUid: product.gelatoProductUid || '',
        imageUrl: product.images?.[0]?.asset?.url || '',
      }))

      const totalCents = itemsWithMeta.reduce(
        (sum, {lineItem}) => sum + (lineItem.amount_total || 0),
        0
      )

      // Create order in Sanity with deterministic ID for idempotency.
      // postProcessed starts false; set to true after inventory/promo are done.
      if (!existingOrder) {
        try {
          await writeClient.create({
            _id: orderId,
            _type: 'order',
            stripeSessionId: session.id,
            email: session.customer_details?.email || null,
            name: session.customer_details?.name || null,
            phone: session.customer_details?.phone || null,
            address: {
              line1: sd?.address?.line1 || null,
              line2: sd?.address?.line2 || null,
              city: sd?.address?.city || null,
              state: sd?.address?.state || null,
              postalCode: sd?.address?.postal_code || null,
              country: sd?.address?.country || null,
            },
            items: orderItems,
            totalCents,
            promoCode: session.metadata?.promoCode || null,
            discountAmountCents: session.metadata?.discountAmountCents
              ? (Number.isFinite(parseInt(session.metadata.discountAmountCents, 10))
                  ? parseInt(session.metadata.discountAmountCents, 10)
                  : null)
              : null,
            currency: session.currency?.toUpperCase() || 'USD',
            gelatoOrderId: gelatoOrderId || null,
            status: gelatoOrderId ? 'submitted' : gelatoError ? 'gelato_failed' : 'pending',
            gelatoError: gelatoError || null,
            postProcessed: false,
            createdAt: new Date().toISOString(),
          })
        } catch (e: unknown) {
          // 409 = document already exists (race between idempotency check and create)
          const err = e as {statusCode?: number; message?: string}
          if (err?.statusCode === 409 || err?.message?.includes('already exists')) {
            // Fall through — post-processing may still be needed
          } else {
            console.error('Failed to create Sanity order', e)
            return NextResponse.json({error: 'Order creation failed'}, {status: 500})
          }
        }
      }

      // Increment promo code usage if applicable
      const promoCodeStr = session.metadata?.promoCode
      if (promoCodeStr) {
        try {
          const {fetchPromoCode} = await import('@/lib/promo-validation')
          const promoDoc = await fetchPromoCode(promoCodeStr)
          if (promoDoc?._id) {
            await writeClient.patch(promoDoc._id).inc({currentUses: 1}).commit()
          }
        } catch (e) {
          console.error('Failed to increment promo code usage:', e)
        }
      }

      // Decrement inventory for tracked products (idempotent: check if already decremented via order existence)
      // The order was just created above with a deterministic ID, so this block only runs on first successful creation.
      // If we reach here, the order.create succeeded, meaning this is the first processing of this webhook.
      for (const {meta, lineItem, product} of itemsWithMeta) {
        if (!product.trackInventory || product.inventoryQuantity == null) continue
        const qty = lineItem.quantity || 1

        try {
          await writeClient.patch(product._id).dec({inventoryQuantity: qty}).commit()
          // Re-fetch to check stock status
          const updated = await writeClient.fetch(
            `*[_type == "product" && _id == $id][0]{inventoryQuantity, lowStockThreshold}`,
            {id: product._id}
          )
          if (updated) {
            const newQty = Math.max(0, updated.inventoryQuantity ?? 0)
            const statusPatch: Record<string, string | number> = {}
            if (newQty <= 0) {
              statusPatch.stockStatus = 'out_of_stock'
              statusPatch.inventoryQuantity = 0
            } else if (updated.lowStockThreshold && newQty <= updated.lowStockThreshold) {
              statusPatch.stockStatus = 'low_stock'
            }
            if (Object.keys(statusPatch).length > 0) {
              await writeClient.patch(product._id).set(statusPatch).commit()
            }
          }
        } catch (e) {
          console.error(`Failed to update inventory for ${meta.slug}`, e)
        }
      }

      // Mark post-processing as complete so retries skip these steps
      try {
        await writeClient.patch(orderId).set({postProcessed: true}).commit()
      } catch (e) {
        console.error('Failed to mark order as post-processed:', e)
      }

      // Send email notifications (gracefully degrades if no API key)
      try {
        const {sendOrderConfirmation, sendNewOrderNotification} = await import('@/lib/email')
        const emailOrder = {
          orderId: session.id,
          email: session.customer_details?.email || '',
          name: session.customer_details?.name || undefined,
          items: orderItems.map(oi => ({
            title: oi.productTitle,
            quantity: oi.quantity,
            priceCents: oi.priceCents,
          })),
          totalCents,
        }
        await sendOrderConfirmation(emailOrder)
        await sendNewOrderNotification(emailOrder)
      } catch (e) {
        console.error('Email notification error:', e)
      }
    }

    return NextResponse.json({received: true})
  } catch (err: unknown) {
    return new NextResponse('Internal server error', {status: 500})
  }
}
