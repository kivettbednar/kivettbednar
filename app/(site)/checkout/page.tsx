"use client"

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useCart} from '@/components/ui/CartContext'
import {useFormValidation} from '@/hooks/useFormValidation'
import {FormField} from '@/components/ui/FormField'
import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'framer-motion'
import {ShieldCheck, Lock, Truck, CreditCard, CheckCircle, ChevronRight} from 'lucide-react'
import {clientBrowser} from '@/sanity/lib/client-browser'
import {checkoutSettingsQuery} from '@/sanity/lib/queries'

export default function CheckoutPage() {
  const {items, totalCents} = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutSettings, setCheckoutSettings] = useState<{
    trustBadges?: Array<{_key?: string; title: string; description: string; icon: string}>
    deliveryEstimateText?: string
    [key: string]: unknown
  } | null>(null)

  useEffect(() => {
    clientBrowser.fetch(checkoutSettingsQuery).then(setCheckoutSettings).catch(() => {})
  }, [])

  // Form validation
  const {errors, touched, validateAll, handleBlur, handleChange: validateChange} = useFormValidation({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    address: {
      required: true,
      minLength: 5,
      maxLength: 100,
    },
    city: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    state: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    zipCode: {
      required: true,
      pattern: /^[0-9]{5}(-[0-9]{4})?$/,
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    validateChange(name, value)
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    handleBlur(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    if (!validateAll(formData)) {
      // Scroll to first error
      const firstError = document.querySelector('[aria-invalid="true"]')
      if (firstError) {
        firstError.scrollIntoView({behavior: 'smooth', block: 'center'})
      }
      return
    }

    setIsSubmitting(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a mock order ID
    const orderId = `KBM-${Date.now().toString().slice(-8)}`

    // Store order data in sessionStorage for confirmation page
    sessionStorage.setItem(
      'lastOrder',
      JSON.stringify({
        orderId,
        items,
        totalCents,
        shippingInfo: formData,
        orderDate: new Date().toISOString(),
      })
    )

    // Navigate to confirmation
    router.push(`/order-confirmation?id=${orderId}`)
  }

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
                Complete Your Order
              </h1>
              {/* Demo Mode Banner */}
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 px-6 py-4 text-center">
                <p className="text-amber-400 font-bold text-sm uppercase tracking-wide">
                  Demo Mode
                </p>
                <p className="text-text-muted text-sm mt-1">
                  This is a preview checkout. Payment processing will be enabled soon.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Contact Information */}
                  <motion.div
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.2}}
                    className="bg-surface-elevated border border-border p-8 border-glow"
                  >
                    <h2 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-6 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-accent-primary" />
                      Contact Information
                    </h2>
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      required
                      placeholder="your@email.com"
                      error={errors.email}
                      touched={touched.email}
                      autoComplete="email"
                    />
                  </motion.div>

                  {/* Shipping Address */}
                  <motion.div
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.3}}
                    className="bg-surface-elevated border border-border p-8 border-glow"
                  >
                    <h2 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-6 flex items-center gap-3">
                      <Truck className="w-6 h-6 text-accent-primary" />
                      Shipping Address
                    </h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          error={errors.firstName}
                          touched={touched.firstName}
                          autoComplete="given-name"
                        />
                        <FormField
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          error={errors.lastName}
                          touched={touched.lastName}
                          autoComplete="family-name"
                        />
                      </div>

                      <FormField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        required
                        placeholder="Street address"
                        error={errors.address}
                        touched={touched.address}
                        autoComplete="street-address"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          error={errors.city}
                          touched={touched.city}
                          autoComplete="address-level2"
                        />
                        <FormField
                          label="State/Region"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          error={errors.state}
                          touched={touched.state}
                          autoComplete="address-level1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          label="ZIP / Postal Code"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          error={errors.zipCode}
                          touched={touched.zipCode}
                          autoComplete="postal-code"
                        />
                        <div>
                          <label htmlFor="country" className="block text-sm uppercase tracking-wider font-bold text-text-primary mb-3">
                            Country <span className="text-accent-red">*</span>
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-background border border-border px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
                            autoComplete="country"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="IE">Ireland</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="ES">Spain</option>
                            <option value="IT">Italy</option>
                            <option value="AU">Australia</option>
                            <option value="NZ">New Zealand</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Trust Badges */}
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

                  {/* Delivery Estimate */}
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
                                ${((it.priceCents * it.quantity) / 100).toFixed(2)}
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
                          ${(totalCents / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Shipping</span>
                        <span className="font-bold text-accent-primary">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Tax</span>
                        <span className="text-text-muted text-xs">Calculated at checkout</span>
                      </div>
                    </div>

                    <div className="flex justify-between mb-6">
                      <span className="font-bebas text-xl uppercase tracking-wide text-text-primary">
                        Total
                      </span>
                      <span className="text-3xl font-bold text-accent-primary">
                        ${(totalCents / 100).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full bg-accent-primary hover:bg-accent-primary/90 disabled:bg-accent-primary/50 text-black font-bold text-lg uppercase tracking-wider py-4 transition-all duration-300 mb-4 flex items-center justify-center gap-2 btn-press"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Submit Demo Order
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
