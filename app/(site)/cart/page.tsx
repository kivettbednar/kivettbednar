"use client"

import Link from 'next/link'
import Image from 'next/image'
import {useCart, optionsKey} from '@/components/ui/CartContext'
import {useRouter} from 'next/navigation'
import {PromoCodeInput} from '@/components/ui/PromoCodeInput'
import {motion} from 'framer-motion'
import {ShoppingCart, Trash2, ChevronRight, Package, ShieldCheck} from 'lucide-react'
import {useState, useEffect} from 'react'
import {formatPrice} from '@/lib/format'

export default function CartPage() {
  const {items, totalCents, updateQty, removeItem, clear, promoCode, applyPromoCode, removePromoCode, finalTotalCents} = useCart()
  const router = useRouter()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleApplyPromo = (discountCents: number, code: string, description?: string) => {
    applyPromoCode(code, discountCents, description)
  }

  const handleRemovePromo = () => {
    removePromoCode()
  }

  const proceedToCheckout = async () => {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      // Check if Stripe is enabled
      const statusRes = await fetch('/api/checkout/status')
      const stripeEnabled = statusRes.ok ? (await statusRes.json()).stripeEnabled : false

      if (stripeEnabled) {
        // Stripe flow: call checkout API and redirect to Stripe hosted checkout
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            items: items.map(it => ({
              slug: it.slug,
              quantity: it.quantity,
              options: it.options,
            })),
            promoCode: promoCode?.code || undefined,
          }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
          return
        }
        if (data.error) {
          setCheckoutError(data.error)
          setCheckoutLoading(false)
          return
        }
      }
      // Fallback: demo checkout
      router.push('/checkout')
    } catch (err) {
      console.error('Checkout error:', err)
      setCheckoutError('Something went wrong. Please try again.')
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-accent-primary w-12" />
                <ShoppingCart className="w-5 h-5 text-accent-primary" />
                <span className="text-accent-primary text-sm uppercase tracking-wider font-bold">
                  Shopping Cart
                </span>
                <div className="h-px bg-accent-primary w-12" />
              </div>
              <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-wide text-text-primary text-center">
                Your Cart
              </h1>
              {items.length > 0 && (
                <p className="text-text-secondary mt-4 text-center">
                  <span className="text-accent-primary font-bold">{items.length}</span> {items.length === 1 ? 'item' : 'items'} ready for checkout
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {items.length === 0 ? (
              <div className="text-center py-12 sm:py-16 md:py-24">
                <div className="relative bg-surface-elevated border border-border p-8 sm:p-12 md:p-16 max-w-2xl mx-auto overflow-hidden">
                  {/* Subtle gold gradient accent */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />

                  {/* Cart icon with gold accent */}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 mb-6 sm:mb-8">
                    <div className="absolute inset-0 rounded-full bg-accent-primary/5" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-12 h-12 sm:w-14 sm:h-14 text-accent-primary/60"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                  </div>

                  <h2 className="font-bebas text-3xl sm:text-4xl uppercase tracking-wide text-white mb-3 sm:mb-4">
                    Your cart is empty
                  </h2>
                  <p className="text-text-muted mb-8 sm:mb-10 text-sm sm:text-base max-w-sm mx-auto">
                    Looks like you haven&apos;t added any items to your cart yet. Check out the latest merch!
                  </p>

                  <Link
                    href="/merch"
                    className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold uppercase tracking-wider px-8 py-4 transition-all duration-300"
                  >
                    <span>Browse Merch</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((it, index) => {
                    const optKey = optionsKey(it.options)
                    const optDisplay = it.options
                      ? Object.entries(it.options)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')
                      : ''
                    return (
                      <motion.div
                        key={it.productId + optKey}
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: index * 0.1}}
                        className="group bg-surface-elevated border border-border hover:border-accent-primary/50 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start transition-all duration-300 card-elevate border-glow"
                      >
                        {/* Image and Basic Info - Mobile Layout */}
                        <div className="flex gap-4 w-full sm:w-auto">
                          {/* Image */}
                          {it.imageUrl && (
                            <Link href={`/merch/${it.slug}`} className="flex-shrink-0">
                              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-background border border-border overflow-hidden group">
                                <Image
                                  src={it.imageUrl}
                                  alt={it.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                            </Link>
                          )}

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/merch/${it.slug}`}>
                              <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-text-primary hover:text-accent-primary transition-colors">
                                {it.title}
                              </h3>
                            </Link>
                            {optDisplay && (
                              <div className="text-xs sm:text-sm text-text-muted uppercase tracking-wide mt-1">
                                {optDisplay}
                              </div>
                            )}
                            {/* Price - Mobile only */}
                            <div className="sm:hidden mt-2">
                              <div className="text-xl font-bold text-accent-primary">
                                ${formatPrice(it.priceCents * it.quantity)}
                              </div>
                              <div className="text-xs text-text-muted mt-0.5">
                                {it.currency} ${formatPrice(it.priceCents)} each
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls - Full Width on Mobile */}
                        <div className="w-full sm:w-auto sm:flex-1 sm:min-w-0">
                          <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:mt-4">
                            <span className="text-xs sm:text-sm uppercase tracking-wide text-text-secondary whitespace-nowrap">
                              Quantity
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQty(it.productId, Math.max(1, it.quantity - 1), optKey)
                                }
                                className="w-10 h-10 sm:w-9 sm:h-9 border border-border hover:border-accent-primary hover:text-accent-primary transition-colors flex items-center justify-center text-lg"
                              >
                                −
                              </button>
                              <div className="w-12 sm:w-14 h-10 sm:h-9 border border-border bg-background flex items-center justify-center text-text-primary font-bold">
                                {it.quantity}
                              </div>
                              <button
                                onClick={() => updateQty(it.productId, it.quantity + 1, optKey)}
                                className="w-10 h-10 sm:w-9 sm:h-9 border border-border hover:border-accent-primary hover:text-accent-primary transition-colors flex items-center justify-center text-lg"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(it.productId, optKey)}
                              className="ml-auto flex items-center gap-1 text-xs sm:text-sm text-accent-red hover:text-red-400 uppercase tracking-wide font-bold transition-colors group/remove"
                            >
                              <Trash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price - Desktop only */}
                        <div className="hidden sm:block text-right flex-shrink-0">
                          <div className="text-xl md:text-2xl font-bold text-accent-primary group-hover:scale-105 transition-transform origin-right">
                            ${formatPrice(it.priceCents * it.quantity)}
                          </div>
                          <div className="text-xs md:text-sm text-text-muted mt-1">
                            {it.currency} ${formatPrice(it.priceCents)} each
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.2}}
                    className="relative bg-surface-elevated border border-border p-6 sm:p-8 lg:sticky lg:top-24 border-glow"
                  >
                    {/* Corner accents */}
                    <div className="absolute -top-px -left-px w-6 h-6 border-l-2 border-t-2 border-accent-primary" />
                    <div className="absolute -top-px -right-px w-6 h-6 border-r-2 border-t-2 border-accent-primary" />
                    <div className="absolute -bottom-px -left-px w-6 h-6 border-l-2 border-b-2 border-accent-primary" />
                    <div className="absolute -bottom-px -right-px w-6 h-6 border-r-2 border-b-2 border-accent-primary" />

                    <h2 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-6 flex items-center gap-3">
                      <Package className="w-6 h-6 text-accent-primary" />
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-6 pb-6 border-b border-border">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Subtotal</span>
                        <span className="font-bold text-text-primary">
                          ${formatPrice(totalCents)}
                        </span>
                      </div>
                      {promoCode && promoCode.discountCents > 0 && (
                        <div className="flex justify-between text-accent-primary">
                          <span>
                            Discount
                            {promoCode.description && (
                              <span className="text-xs block text-text-muted mt-0.5">
                                {promoCode.description}
                              </span>
                            )}
                          </span>
                          <span className="font-bold">
                            -${formatPrice(promoCode.discountCents)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Shipping</span>
                        <span className="text-text-muted text-sm">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Tax</span>
                        <span className="text-text-muted text-sm">Calculated at checkout</span>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="mb-6">
                      <PromoCodeInput
                        cartTotal={totalCents}
                        onApply={handleApplyPromo}
                        onRemove={handleRemovePromo}
                        currentCode={promoCode?.code || ''}
                      />
                    </div>

                    <div className="flex justify-between mb-6">
                      <span className="font-bebas text-xl uppercase tracking-wide text-text-primary">
                        Total
                      </span>
                      <span className="text-3xl font-bold text-accent-primary">
                        ${formatPrice(finalTotalCents)}
                      </span>
                    </div>

                    <button
                      onClick={proceedToCheckout}
                      disabled={checkoutLoading}
                      className="group w-full bg-accent-primary hover:bg-accent-primary/90 disabled:bg-accent-primary/50 text-black font-bold text-lg uppercase tracking-wider py-4 transition-all duration-300 mb-3 flex items-center justify-center gap-2 btn-press"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed to Checkout
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {checkoutError && (
                      <div className="bg-red-500/10 border border-red-500/30 p-3 mb-3 text-center">
                        <p className="text-red-400 text-sm font-medium">{checkoutError}</p>
                      </div>
                    )}

                    <button
                      onClick={clear}
                      className="w-full border border-border hover:border-accent-red hover:text-accent-red text-text-secondary font-bold uppercase tracking-wide py-3 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Cart
                    </button>

                    {/* Trust badge */}
                    <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border text-text-muted text-xs">
                      <ShieldCheck className="w-4 h-4 text-accent-primary" />
                      <span>Secure checkout guaranteed</span>
                    </div>

                    <Link
                      href="/merch"
                      className="block text-center text-text-muted hover:text-accent-primary mt-4 text-sm uppercase tracking-wide transition-colors"
                    >
                      ← Continue Shopping
                    </Link>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

