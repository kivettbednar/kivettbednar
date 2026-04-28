import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const orderConfirmationPage = defineType({
  name: 'orderConfirmationPage',
  title: 'Order Confirmation Page',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'thankYouHeading',
      title: 'Thank You Heading',
      type: 'string',
      initialValue: 'Thank You!',
    }),
    defineField({
      name: 'orderConfirmedLabel',
      title: 'Order Confirmed Label',
      type: 'string',
      initialValue: 'Order Confirmed',
    }),
    defineField({
      name: 'orderReceivedText',
      title: 'Order Received Text',
      type: 'string',
      description: 'Text shown after order confirmed (e.g., "Your order has been received and is being processed.")',
      initialValue: 'Your order has been received and is being processed.',
    }),
    defineField({
      name: 'whatsNextHeading',
      title: "What's Next Heading",
      type: 'string',
      initialValue: "What's Next?",
    }),
    defineField({
      name: 'nextStepEmail',
      title: 'Next Step: Email Confirmation',
      type: 'string',
      description: 'Template for email step. Use {email} as placeholder.',
      initialValue: "You'll receive an order confirmation email at {email}",
    }),
    defineField({
      name: 'nextStepShipping',
      title: 'Next Step: Shipping',
      type: 'string',
      initialValue: 'Your order will be processed and shipped within 3-5 business days',
    }),
    defineField({
      name: 'nextStepTracking',
      title: 'Next Step: Tracking',
      type: 'string',
      initialValue: "You'll receive tracking information once your order ships",
    }),
    defineField({
      name: 'orderDetailsHeading',
      title: 'Order Details Heading',
      type: 'string',
      initialValue: 'Order Details',
    }),
    defineField({
      name: 'shippingAddressHeading',
      title: 'Shipping Address Heading',
      type: 'string',
      initialValue: 'Shipping Address',
    }),
    defineField({
      name: 'orderItemsHeading',
      title: 'Order Items Heading',
      type: 'string',
      initialValue: 'Order Items',
    }),
    defineField({
      name: 'orderDateLabel',
      title: '"Order Date" Label',
      type: 'string',
      initialValue: 'Order Date',
    }),
    defineField({
      name: 'orderTotalLabel',
      title: '"Order Total" Label',
      type: 'string',
      initialValue: 'Order Total',
    }),
    defineField({
      name: 'paymentStatusLabel',
      title: '"Payment Status" Label',
      type: 'string',
      initialValue: 'Payment Status',
    }),
    defineField({
      name: 'paymentConfirmedText',
      title: '"Confirmed" Status Text',
      type: 'string',
      description: 'Shown next to the green checkmark when payment succeeds.',
      initialValue: 'Confirmed',
    }),
    defineField({
      name: 'orderItemQuantityPrefix',
      title: '"Quantity:" Prefix',
      type: 'string',
      description: 'Shown before each item\'s quantity (e.g. "Quantity: 2").',
      initialValue: 'Quantity:',
    }),
    defineField({
      name: 'continueShoppingText',
      title: 'Continue Shopping Button Text',
      type: 'string',
      initialValue: 'Continue Shopping',
    }),
    defineField({
      name: 'viewShowsText',
      title: 'View Shows Button Text',
      type: 'string',
      initialValue: 'View Upcoming Shows',
    }),
    defineField({
      name: 'noOrderHeading',
      title: 'No Order Found Heading',
      type: 'string',
      initialValue: 'No Order Found',
    }),
    defineField({
      name: 'noOrderText',
      title: 'No Order Found Text',
      type: 'string',
      initialValue: "We couldn't find your order information.",
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Order Confirmation Page'}
    },
  },
})
