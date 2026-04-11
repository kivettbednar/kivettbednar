import {CreditCardIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const checkoutSettings = defineType({
  name: 'checkoutSettings',
  title: 'Checkout Settings',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      description: 'Trust badges shown on checkout and cart pages',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustBadge',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', description: 'e.g., "Secure", "Free Shipping"'}),
            defineField({name: 'description', title: 'Description', type: 'string', description: 'e.g., "256-bit SSL", "On all orders"'}),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
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
      description: 'e.g., "Your order will arrive in 3-5 business days after processing."',
      initialValue: 'Your order will arrive in 3-5 business days after processing. You\'ll receive tracking information via email.',
    }),
    defineField({
      name: 'secureCheckoutText',
      title: 'Secure Checkout Text',
      type: 'string',
      description: 'Text shown below checkout button',
      initialValue: 'Secure checkout guaranteed',
    }),
    // Cart page labels
    defineField({
      name: 'cartHeading',
      title: 'Cart Page Heading',
      type: 'string',
      description: 'Main heading on the cart page',
      initialValue: 'Your Cart',
    }),
    defineField({
      name: 'cartEmptyHeading',
      title: 'Cart Empty Heading',
      type: 'string',
      description: 'Heading when cart is empty',
      initialValue: 'Your cart is empty',
    }),
    defineField({
      name: 'cartEmptyText',
      title: 'Cart Empty Text',
      type: 'text',
      rows: 2,
      description: 'Text shown when cart is empty',
      initialValue: "Looks like you haven't added any items to your cart yet. Check out the latest merch!",
    }),
    defineField({
      name: 'cartEmptyButtonText',
      title: 'Cart Empty Button Text',
      type: 'string',
      description: 'Button text on empty cart page',
      initialValue: 'Browse Merch',
    }),
    // Checkout page labels
    defineField({
      name: 'secureCheckoutHeading',
      title: 'Secure Checkout Heading',
      type: 'string',
      description: 'Main heading on checkout page',
      initialValue: 'Secure Checkout',
    }),
    defineField({
      name: 'redirectingHeading',
      title: 'Redirecting Heading',
      type: 'string',
      description: 'Heading shown while redirecting to Stripe',
      initialValue: 'Setting Up Secure Payment',
    }),
    defineField({
      name: 'redirectingText',
      title: 'Redirecting Text',
      type: 'text',
      rows: 2,
      description: 'Text shown while redirecting to Stripe',
      initialValue: "You'll be redirected to our secure payment partner (Stripe) to complete your purchase.",
    }),
    defineField({
      name: 'redirectingSubtext',
      title: 'Redirecting Subtext',
      type: 'string',
      description: 'Secondary text shown while redirecting',
      initialValue: "Your cart is saved and you won't be charged until you confirm.",
    }),
    defineField({
      name: 'orderSummaryHeading',
      title: 'Order Summary Heading',
      type: 'string',
      initialValue: 'Order Summary',
    }),
    defineField({
      name: 'returnToCartText',
      title: 'Return to Cart Text',
      type: 'string',
      initialValue: '← Return to Cart',
    }),
    defineField({
      name: 'sslEncryptionText',
      title: 'SSL Encryption Text',
      type: 'string',
      description: 'Security text shown at bottom of checkout',
      initialValue: 'Secure 256-bit SSL encryption',
    }),
    defineField({
      name: 'checkoutUnavailableHeading',
      title: 'Checkout Unavailable Heading',
      type: 'string',
      initialValue: 'Checkout Unavailable',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Checkout Settings'}
    },
  },
})
