import {NextResponse} from 'next/server'
import {validatePromoCode, fetchPromoCode} from '@/lib/promo-validation'

export async function POST(req: Request) {
  try {
    const {code, cartTotal} = await req.json()

    if (typeof cartTotal !== 'number' || !Number.isFinite(cartTotal) || cartTotal < 0) {
      return NextResponse.json({error: 'Invalid cart total'}, {status: 400})
    }

    const trimmedCode = typeof code === 'string' ? code.trim() : ''
    if (!trimmedCode || trimmedCode.length > 50) {
      return NextResponse.json({error: 'Invalid code'}, {status: 400})
    }

    const promoCode = await fetchPromoCode(trimmedCode)

    const result = validatePromoCode(promoCode, cartTotal)
    if (!result.valid) {
      return NextResponse.json({error: result.reason}, {status: promoCode ? 400 : 404})
    }

    const promo = promoCode as any
    return NextResponse.json({
      success: true,
      code: promo.code,
      discountType: promo.discountType,
      discountCents: result.discountCents,
      description: promo.description,
    })
  } catch (error: unknown) {
    console.error('Promo code error:', error)
    return NextResponse.json({error: 'Failed to validate promo code'}, {status: 500})
  }
}
