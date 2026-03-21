import {NextResponse} from 'next/server'
import Stripe from 'stripe'
import {z} from 'zod'
import {client} from '@/sanity/lib/client'
import {productBySlugQuery} from '@/sanity/lib/queries'
import {getStripe} from '@/lib/stripe'
import {validatePromoCode, fetchPromoCode} from '@/lib/promo-validation'
import {variantOptionValuesToRecord} from '@/types/product'

const CartItemSchema = z.object({
  slug: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(99),
  options: z.record(z.string(), z.string()).optional(),
})
const CheckoutBodySchema = z.object({
  items: z.array(CartItemSchema).min(1).max(50),
  promoCode: z.string().max(20).optional(),
})

export async function POST(req: Request) {
  if (process.env.STRIPE_ENABLED !== 'true') {
    return NextResponse.json({error: 'Checkout is disabled'}, {status: 501})
  }
  try {
    const body = await req.json()
    const parsed = CheckoutBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({error: 'Invalid request body'}, {status: 400})
    }
    const {items, promoCode: promoCodeStr} = parsed.data

    // Validate items against Sanity and check stock
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const validatedProducts: Array<{slug: string; _id: string; category: string}> = []
    for (const it of items) {
      const product = await client.fetch(productBySlugQuery, {slug: it.slug})
      if (!product) return NextResponse.json({error: 'Invalid product'}, {status: 400})
      validatedProducts.push({slug: it.slug, _id: product._id, category: product.category || ''})

      // Check stock availability
      if (product.trackInventory && product.stockStatus === 'out_of_stock') {
        return NextResponse.json(
          {error: `"${product.title}" is out of stock`},
          {status: 400}
        )
      }
      if (product.trackInventory && product.inventoryQuantity !== null && product.inventoryQuantity < it.quantity) {
        return NextResponse.json(
          {error: `Only ${product.inventoryQuantity} of "${product.title}" available`},
          {status: 400}
        )
      }

      // Use server-side price only — never trust client-sent price
      let unitAmount = product.priceCents as number
      if (!unitAmount || unitAmount <= 0) {
        return NextResponse.json({error: 'Product price not available'}, {status: 400})
      }
      // Check for variant-specific pricing
      let matchingVariant: {priceCents?: number} | null = null
      const opts = it.options
      if (opts && product.variants) {
        matchingVariant = product.variants.find((v: {optionValues?: Array<{key?: string; value?: string; _key: string}>; priceCents?: number}) => {
          if (!v.optionValues) return false
          const ov = variantOptionValuesToRecord(v.optionValues)
          return Object.entries(opts).every(
            ([key, val]) => ov[key] === val || ov[key.toLowerCase()] === val
          )
        })
        if (matchingVariant?.priceCents) {
          unitAmount = matchingVariant.priceCents
        }
      }

      // Reject invalid options that don't match any variant
      if (it.options && Object.keys(it.options).length > 0 && product.variants?.length > 0 && !matchingVariant) {
        return NextResponse.json({error: `Invalid options for "${product.title}"`}, {status: 400})
      }

      line_items.push({
        quantity: it.quantity,
        price_data: {
          currency: (product.currency as string) || 'USD',
          unit_amount: unitAmount,
          product_data: {
            name: product.title,
            images: product.images?.[0]?.asset?.url ? [product.images[0].asset.url] : [],
            metadata: {
              productId: product._id,
              slug: it.slug,
              options: it.options ? JSON.stringify(it.options) : '{}',
            },
          },
        },
      })
    }

    // Calculate cart total once for promo validation and discount distribution
    const cartTotal = line_items.reduce((sum, li) => {
      return sum + (li.price_data?.unit_amount || 0) * (li.quantity || 1)
    }, 0)

    // Handle promo code discount
    let discountAmountCents = 0
    if (promoCodeStr) {
      try {
        const promoCode = await fetchPromoCode(promoCodeStr)

        const result = validatePromoCode(promoCode, cartTotal)
        if (result.valid) {
          discountAmountCents = result.discountCents

          // Check product/category restrictions
          if (discountAmountCents > 0 && promoCode) {
            const hasProductRestrictions = promoCode.applicableProducts && promoCode.applicableProducts.length > 0
            const hasCategoryRestrictions = promoCode.applicableCategories && promoCode.applicableCategories.length > 0

            if (hasProductRestrictions || hasCategoryRestrictions) {
              const applicableProductIds = new Set(
                (promoCode.applicableProducts || []).map((p: {_id: string}) => p._id)
              )
              const applicableCategories = new Set(promoCode.applicableCategories || [])

              const hasMatchingItem = validatedProducts.some((vp) => {
                if (hasProductRestrictions && applicableProductIds.has(vp._id)) return true
                if (hasCategoryRestrictions && applicableCategories.has(vp.category)) return true
                return false
              })

              if (!hasMatchingItem) {
                discountAmountCents = 0
              }
            }
          }
        }
      } catch (e) {
        console.warn('Failed to validate promo code for Stripe checkout:', e)
      }
    }

    // Distribute discount proportionally across line items
    if (discountAmountCents > 0) {
      let remainingDiscount = discountAmountCents
      for (let i = 0; i < line_items.length; i++) {
        const li = line_items[i]
        const liTotal = (li.price_data?.unit_amount || 0) * (li.quantity || 1)
        const proportion = cartTotal > 0 ? liTotal / cartTotal : 0
        // Last item gets the remainder to handle rounding
        const itemDiscount =
          i === line_items.length - 1
            ? remainingDiscount
            : Math.round(discountAmountCents * proportion)
        const perUnitDiscount = Math.floor(itemDiscount / (li.quantity || 1))
        const currentAmount = li.price_data?.unit_amount || 0
        const newAmount = Math.max(0, currentAmount - perUnitDiscount)
        if (li.price_data) {
          li.price_data.unit_amount = newAmount
        }
        remainingDiscount -= perUnitDiscount * (li.quantity || 1)
      }
    }

    const stripe = getStripe()
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'IE', 'DE', 'FR', 'ES', 'IT', 'AU', 'NZ'],
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart?canceled=1`,
      metadata: {
        cartSize: String(items.length),
        promoCode: promoCodeStr || '',
        discountAmountCents: String(discountAmountCents),
      },
    }

    // Enable Stripe Tax if configured (enable in Stripe Dashboard first)
    // Uncomment when Stripe Tax is set up:
    // sessionParams.automatic_tax = { enabled: true }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({id: session.id, url: session.url})
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({error: 'Checkout failed'}, {status: 500})
  }
}
