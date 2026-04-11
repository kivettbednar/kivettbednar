"use client"

import {useEffect, useRef, useState} from 'react'
import {useCart} from '@/components/ui/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'framer-motion'
import {ShieldCheck, Lock, Truck, CreditCard, CheckCircle, ChevronRight, Loader2} from 'lucide-react'
import {clientBrowser} from '@/sanity/lib/client-browser'
import {checkoutSettingsQuery} from '@/sanity/lib/queries'
import {formatCurrency} from '@/lib/format'

export default function CheckoutPage() {
  const {items, totalCents, promoCode, finalTotalCents} = useCart()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkoutSettings, setCheckoutSettings] = useState<{
    trustBadges?: Array<{_key?: string; title: string; description: string; icon: string}>
    deliveryEstimateText?: string
    [key: string]: unknown
  } | null>(null)
  const currency = items[0]?.currency || 'USD'

  useEffect(() => {
    clientBrowser.fetch(checkoutSettingsQuery).then(setCheckoutSettings).catch(() => {})
  }, [])

  // On mount, check if Stripe is enabled and redirect to Stripe checkout
  const hasInitiated = useRef(false)
  useEffect(() => {
    if (items.length === 0 || hasInitiated.current) return
    hasInitiated.current = true

    async function redirectToStripe() {
      try {
        const statusRes = await fetch('/api/checkout/status')
        const {stripeEnabled} = statusRes.ok ? await statusRes.json() : {stripeEnabled: false}

        if (!stripeEnabled) {
          setError('Payment processing is not yet configured. Please try again later.')
          return
        }

        setIsRedirecting(true)
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

        setError(data.error || 'Failed to create checkout session. Please try again.')
        setIsRedirecting(false)
        hasInitiated.current = false
      } catch {
        setError('Something went wrong. Please return to your cart and try again.')
        setIsRedirecting(false)
        hasInitiated.current = false
      }
    }

    redirectToStripe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="bg-surface-elevated border border-border p-16 max-w-2xl mx-auto text-center">
          <h1 className="font-bebas text-4xl uppercase tracking-wide text-text-primary mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-text-secondary mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link href="/merch" className="btn-primary inline-flex">
            Browse Merch
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header with Progress Indicator */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <motion.div
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              className="flex items-center justify-center gap-2 md:gap-4 mb-8"
            >
              {/* Step 1: Cart - Completed */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-black" />
                </div>
                <span className="hidden sm:block text-sm font-bold text-accent-primary uppercase tracking-wide">Cart</span>
              </div>
              <div className="w-8 md:w-16 h-px bg-accent-primary" />

              {/* Step 2: Checkout - Active */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center pulse-gold">
                  <span className="text-black font-bold text-sm">2</span>
                </div>
                <span className="hidden sm:block text-sm font-bold text-accent-primary uppercase tracking-wide">Checkout</span>
              </div>
              <div className="w-8 md:w-16 h-px bg-border" />

              {/* Step 3: Confirmation - Pending */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-elevated border-2 border-border flex items-center justify-center">
                  <span className="text-text-muted font-bold text-sm">3</span>
                </div>
                <span className="hidden sm:block text-sm font-bold text-text-muted uppercase tracking-wide">Confirm</span>
              </div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.1}}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px bg-accent-primary w-12" />
                <Lock className="w-4 h-4 text-accent-primary" />
                <span className="text-accent-primary text-sm uppercase tracking-wider font-bold">
                  Secure Checkout
                </span>
                <div className="h-px bg-accent-primary w-12" />
              </div>
              <h1 className="font-bebas text-5xl md:text-6xl uppercase tracking-wide text-text-primary text-center">
                {isRedirecting ? 'Redirecting to Payment...' : 'Checkout'}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Area */}
              <div className="lg:col-span-2 space-y-8">
                {isRedirecting && (
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="bg-surface-elevated border border-border p-12 text-center"
                  >
                    <Loader2 className="w-12 h-12 text-accent-primary animate-spin mx-auto mb-6" />
                    <h2 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-3">
                      Setting Up Secure Payment
                    </h2>
                    <p className="text-text-secondary mb-2">
                      You&apos;ll be redirected to our secure payment partner (Stripe) to complete your purchase.
                    </p>
                    <p className="text-text-muted text-sm">
                      Your cart is saved and you won&apos;t be charged until you confirm.
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="bg-red-500/10 border border-red-500/30 p-8 text-center"
                  >
                    <CreditCard className="w-10 h-10 text-red-400 mx-auto mb-4" />
                    <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                      Checkout Unavailable
                    </h2>
                    <p className="text-red-400 mb-6">{error}</p>
                    <Link
                      href="/cart"
                      className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold uppercase tracking-wider px-6 py-3 transition-all duration-300"
                    >
                      ← Return to Cart
                    </Link>
                  </motion.div>
                )}

                {/* Trust Badges */}
                {!error && (
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {(checkoutSettings?.trustBadges && checkoutSettings.trustBadges.length > 0
                      ? checkoutSettings.trustBadges
                      : [
                          {_key: 'secure', title: 'Secure', description: '256-bit SSL', icon: 'lock'},
                          {_key: 'shipping', title: 'Free Shipping', description: 'On all orders', icon: 'truck'},
                          {_key: 'guarantee', title: 'Guarantee', description: '30-day returns', icon: 'shield'},
                        ]
                    ).map((badge: {_key?: string; title: string; description: string; icon: string}) => {
                      const iconMap: Record<string, React.ComponentType<{className?: string}>> = { lock: Lock, truck: Truck, shield: ShieldCheck }
                      const IconComponent = iconMap[badge.icon] || ShieldCheck
                      return (
                        <div key={badge._key || badge.title} className="bg-surface-elevated border border-border p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-accent-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-text-primary">{badge.title}</p>
                            <p className="text-xs text-text-muted">{badge.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                )}

                {/* Delivery Estimate */}
                {!error && (
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5}}
                    className="bg-accent-primary/5 border border-accent-primary/20 p-6"
                  >
                    <div className="flex gap-3 items-start">
                      <Truck className="w-6 h-6 text-accent-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-text-primary mb-1 uppercase tracking-wide text-sm">
                          Estimated Delivery
                        </h4>
                        <p className="text-text-secondary text-sm">
                          {checkoutSettings?.deliveryEstimateText || 'Your order will arrive in 3-5 business days after processing. You\'ll receive tracking information via email.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.3}}
                  className="bg-surface-elevated border border-border p-8 sticky top-24 border-glow"
                >
                  {/* Corner accents */}
                  <div className="absolute -top-px -left-px w-6 h-6 border-l-2 border-t-2 border-accent-primary" />
                  <div className="absolute -top-px -right-px w-6 h-6 border-r-2 border-t-2 border-accent-primary" />
                  <div className="absolute -bottom-px -left-px w-6 h-6 border-l-2 border-b-2 border-accent-primary" />
                  <div className="absolute -bottom-px -right-px w-6 h-6 border-r-2 border-b-2 border-accent-primary" />

                  <h2 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-6">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    {items.map((it) => {
                      const optKey = it.options
                        ? Object.entries(it.options)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ')
                        : ''
                      return (
                        <div key={it.productId + optKey} className="flex gap-3">
                          {it.imageUrl && (
                            <div className="relative w-16 h-16 bg-background border border-border flex-shrink-0">
                              <Image
                                src={it.imageUrl}
                                alt={it.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute -top-2 -right-2 bg-accent-primary text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                {it.quantity}
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-text-primary truncate">
                              {it.title}
                            </div>
                            {optKey && (
                              <div className="text-xs text-text-muted">{optKey}</div>
                            )}
                            <div className="text-sm font-bold text-accent-primary mt-1">
                              {formatCurrency(it.priceCents * it.quantity, it.currency)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-bold text-text-primary">
                        {formatCurrency(totalCents, currency)}
                      </span>
                    </div>
                    {promoCode && promoCode.discountCents > 0 && (
                      <div className="flex justify-between text-sm text-accent-primary">
                        <span>Discount</span>
                        <span className="font-bold">
                          -{formatCurrency(promoCode.discountCents, currency)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Shipping</span>
                      <span className="text-text-muted text-xs">Calculated by Stripe</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Tax</span>
                      <span className="text-text-muted text-xs">Calculated by Stripe</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-bebas text-xl uppercase tracking-wide text-text-primary">
                      Estimated Total
                    </span>
                    <span className="text-3xl font-bold text-accent-primary">
                      {formatCurrency(finalTotalCents, currency)}
                    </span>
                  </div>

                  {/* Secure checkout note */}
                  <div className="flex items-center justify-center gap-2 text-text-muted text-xs mb-4">
                    <Lock className="w-3 h-3" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>

                  <Link
                    href="/cart"
                    className="block text-center text-text-muted hover:text-accent-primary text-sm uppercase tracking-wide transition-colors"
                  >
                    ← Return to Cart
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
