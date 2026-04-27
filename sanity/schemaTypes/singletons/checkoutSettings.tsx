import {CreditCardIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Checkout Settings — text and trust elements shown around the cart and
 * checkout flow. Operational store config (currency, store enabled,
 * shipping countries) lives in Store Settings, not here.
 */
export const checkoutSettings = defineType({
  name: 'checkoutSettings',
  title: 'Checkout Settings',
  type: 'document',
  icon: CreditCardIcon,
  groups: [
    {name: 'trust', title: 'Trust & Reassurance', default: true},
    {name: 'cart', title: 'Cart Page'},
    {name: 'checkout', title: 'Checkout Page'},
    {name: 'redirecting', title: 'Stripe Redirect'},
  ],
  fields: [
    // === TRUST ===
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      description: 'Reassurance badges shown on the cart and checkout pages (e.g., "Secure", "Free Shipping").',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustBadge',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Short label, e.g., "Secure" or "Free Shipping".',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Supporting line, e.g., "256-bit SSL" or "On all orders".',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Choose the icon shown next to the badge.',
              options: {
                list: [
                  {title: 'Lock', value: 'lock'},
                  {title: 'Shield', value: 'shield'},
                  {title: 'Truck', value: 'truck'},
                  {title: 'Star', value: 'star'},
                  {title: 'Guitar', value: 'guitar'},
                  {title: 'Package', value: 'package'},
                ],
                layout: 'dropdown',
              },
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
    }),
    defineField({
      name: 'deliveryEstimateText',
      title: 'Delivery Estimate Text',
      type: 'text',
      rows: 2,
      description: 'Shown to customers reviewing their cart (e.g., "Your order will arrive in 3-5 business days after processing.").',
      initialValue: "Your order will arrive in 3-5 business days after processing. You'll receive tracking information via email.",
      group: 'trust',
    }),
    defineField({
      name: 'secureCheckoutText',
      title: 'Secure Checkout Reassurance',
      type: 'string',
      description: 'Short line displayed below the checkout button.',
      initialValue: 'Secure checkout guaranteed',
      group: 'trust',
    }),
    defineField({
      name: 'sslEncryptionText',
      title: 'SSL Encryption Footer',
      type: 'string',
      description: 'Security note shown at the bottom of the checkout page.',
      initialValue: 'Secure 256-bit SSL encryption',
      group: 'trust',
    }),

    // === CART ===
    defineField({
      name: 'cartHeading',
      title: 'Cart Heading',
      type: 'string',
      description: 'Main heading on the cart page.',
      initialValue: 'Your Cart',
      group: 'cart',
    }),
    defineField({
      name: 'cartEmptyHeading',
      title: 'Empty Cart — Heading',
      type: 'string',
      description: 'Heading shown when the cart is empty.',
      initialValue: 'Your cart is empty',
      group: 'cart',
    }),
    defineField({
      name: 'cartEmptyText',
      title: 'Empty Cart — Body Text',
      type: 'text',
      rows: 2,
      description: 'Friendly message shown when the cart is empty.',
      initialValue: "Looks like you haven't added any items to your cart yet. Check out the latest merch!",
      group: 'cart',
    }),
    defineField({
      name: 'cartEmptyButtonText',
      title: 'Empty Cart — Button Text',
      type: 'string',
      description: 'Button that takes the customer to the merch page.',
      initialValue: 'Browse Merch',
      group: 'cart',
    }),

    // === CHECKOUT ===
    defineField({
      name: 'secureCheckoutHeading',
      title: 'Checkout Heading',
      type: 'string',
      description: 'Main heading on the checkout page.',
      initialValue: 'Secure Checkout',
      group: 'checkout',
    }),
    defineField({
      name: 'orderSummaryHeading',
      title: 'Order Summary Heading',
      type: 'string',
      initialValue: 'Order Summary',
      group: 'checkout',
    }),
    defineField({
      name: 'returnToCartText',
      title: 'Return-to-Cart Link',
      type: 'string',
      description: 'Link that lets customers go back to the cart.',
      initialValue: '← Return to Cart',
      group: 'checkout',
    }),
    defineField({
      name: 'checkoutUnavailableHeading',
      title: 'Checkout Unavailable Heading',
      type: 'string',
      description: 'Shown when "Store Enabled" is off in Store Settings.',
      initialValue: 'Checkout Unavailable',
      group: 'checkout',
    }),

    // === REDIRECTING ===
    defineField({
      name: 'redirectingHeading',
      title: 'Redirecting — Heading',
      type: 'string',
      description: 'Shown briefly while the customer is redirected to Stripe.',
      initialValue: 'Setting Up Secure Payment',
      group: 'redirecting',
    }),
    defineField({
      name: 'redirectingText',
      title: 'Redirecting — Body Text',
      type: 'text',
      rows: 2,
      initialValue: "You'll be redirected to our secure payment partner (Stripe) to complete your purchase.",
      group: 'redirecting',
    }),
    defineField({
      name: 'redirectingSubtext',
      title: 'Redirecting — Subtext',
      type: 'string',
      initialValue: "Your cart is saved and you won't be charged until you confirm.",
      group: 'redirecting',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Checkout Settings'}
    },
  },
})
