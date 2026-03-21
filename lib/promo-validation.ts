import {client} from '@/sanity/lib/client'
import {promoCodeByCodeQuery} from '@/sanity/lib/queries'

export async function fetchPromoCode(code: string) {
  return client.fetch(promoCodeByCodeQuery, {code: code.trim().toUpperCase()})
}

export type PromoValidationResult =
  | {valid: true; discountCents: number}
  | {valid: false; reason: string}

interface PromoCode {
  validFrom?: string
  validUntil?: string
  maxUses: number
  currentUses: number
  minimumPurchaseCents?: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
}

export function validatePromoCode(
  promoCode: PromoCode | null,
  cartTotalCents: number,
  now = new Date()
): PromoValidationResult {
  if (!promoCode) return {valid: false, reason: 'Invalid promo code'}

  if (promoCode.validFrom && new Date(promoCode.validFrom) > now)
    return {valid: false, reason: 'This promo code is not yet valid'}

  if (promoCode.validUntil && new Date(promoCode.validUntil) < now)
    return {valid: false, reason: 'This promo code has expired'}

  if (promoCode.maxUses !== -1 && promoCode.currentUses >= promoCode.maxUses)
    return {valid: false, reason: 'This promo code has reached its usage limit'}

  if (promoCode.minimumPurchaseCents && cartTotalCents < promoCode.minimumPurchaseCents)
    return {
      valid: false,
      reason: `Minimum purchase of $${(promoCode.minimumPurchaseCents / 100).toFixed(2)} required`,
    }

  let discountCents = 0
  if (promoCode.discountType === 'percentage') {
    discountCents = Math.round((cartTotalCents * promoCode.discountValue) / 100)
  } else if (promoCode.discountType === 'fixed') {
    discountCents = promoCode.discountValue
  }
  discountCents = Math.max(0, Math.min(discountCents, cartTotalCents))

  return {valid: true, discountCents}
}
