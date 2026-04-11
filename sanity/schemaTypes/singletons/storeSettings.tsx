import {BasketIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const storeSettings = defineType({
  name: 'storeSettings',
  title: 'Store Settings',
  type: 'document',
  icon: BasketIcon,
  groups: [
    {name: 'general', title: 'General'},
    {name: 'email', title: 'Email & Notifications'},
    {name: 'shipping', title: 'Shipping & Returns'},
  ],
  fields: [
    // === GENERAL ===
    defineField({
      name: 'storeEnabled',
      title: 'Store Enabled',
      type: 'boolean',
      description: 'Turn the checkout on or off. When off, customers can browse products but cannot purchase.',
      initialValue: false,
      group: 'general',
    }),
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      description: 'Used in order confirmation emails and receipts',
      initialValue: 'Kivett Bednar Music',
      group: 'general',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'Your live site URL (e.g., https://kivettbednar.com). Used for email links and Stripe redirects.',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
      group: 'general',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      description: 'Store currency',
      options: {
        list: [
          {title: 'USD ($)', value: 'usd'},
          {title: 'CAD (C$)', value: 'cad'},
          {title: 'GBP (£)', value: 'gbp'},
          {title: 'EUR (€)', value: 'eur'},
        ],
      },
      initialValue: 'usd',
      group: 'general',
    }),

    // === EMAIL ===
    defineField({
      name: 'adminEmail',
      title: 'Admin Email',
      type: 'string',
      description: 'Where order notifications, contact form messages, and fulfillment alerts are sent',
      validation: (Rule) => Rule.email(),
      group: 'email',
    }),
    defineField({
      name: 'emailFromName',
      title: 'Email "From" Name',
      type: 'string',
      description: 'The sender name on customer emails (e.g., "Kivett Bednar Music")',
      initialValue: 'Kivett Bednar Music',
      group: 'email',
    }),
    defineField({
      name: 'emailFromAddress',
      title: 'Email "From" Address',
      type: 'string',
      description: 'The sender email address (must be verified in Resend, e.g., orders@kivettbednar.com)',
      validation: (Rule) => Rule.email(),
      group: 'email',
    }),
    defineField({
      name: 'orderConfirmationSubject',
      title: 'Order Confirmation Subject',
      type: 'string',
      description: 'Subject line for order confirmation emails. Use {orderNumber} as placeholder.',
      initialValue: 'Order Confirmed — {orderNumber}',
      group: 'email',
    }),
    defineField({
      name: 'shippingUpdateSubject',
      title: 'Shipping Update Subject',
      type: 'string',
      description: 'Subject line for shipping notification emails. Use {orderNumber} as placeholder.',
      initialValue: 'Shipping Update - {orderNumber}',
      group: 'email',
    }),
    defineField({
      name: 'contactFormSubject',
      title: 'Contact Form Subject',
      type: 'string',
      description: 'Subject line for contact form notifications to admin. Use {name} and {subject} as placeholders.',
      initialValue: 'Contact Form — {name}',
      group: 'email',
    }),
    defineField({
      name: 'fulfillmentFailureSubject',
      title: 'Fulfillment Failure Subject',
      type: 'string',
      description: 'Subject line for fulfillment failure alerts. Use {orderNumber} as placeholder.',
      initialValue: 'ALERT: Fulfillment Failed — {orderNumber}',
      group: 'email',
    }),
    defineField({
      name: 'newOrderSubject',
      title: 'New Order Subject',
      type: 'string',
      description: 'Subject line for new order admin notifications. Use {orderNumber} as placeholder.',
      initialValue: 'New Order — {orderNumber}',
      group: 'email',
    }),
    defineField({
      name: 'emailSignature',
      title: 'Email Signature',
      type: 'string',
      description: 'Sign-off name in customer emails (e.g., "Kivett Bednar Music")',
      initialValue: 'Kivett Bednar Music',
      group: 'email',
    }),

    // === SHIPPING & RETURNS ===
    defineField({
      name: 'shippingCountries',
      title: 'Shipping Countries',
      type: 'array',
      description: 'Countries you ship to (ISO 2-letter codes). Leave empty to ship worldwide.',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'United States', value: 'US'},
          {title: 'Canada', value: 'CA'},
          {title: 'United Kingdom', value: 'GB'},
          {title: 'Australia', value: 'AU'},
          {title: 'Germany', value: 'DE'},
          {title: 'France', value: 'FR'},
          {title: 'Netherlands', value: 'NL'},
          {title: 'Japan', value: 'JP'},
        ],
      },
      group: 'shipping',
    }),
    defineField({
      name: 'processingTime',
      title: 'Processing Time Text',
      type: 'string',
      description: 'Shown to customers (e.g., "2-5 business days")',
      initialValue: '2-5 business days',
      group: 'shipping',
    }),
    defineField({
      name: 'returnPolicyDays',
      title: 'Return Window (days)',
      type: 'number',
      description: 'Number of days customers have to request a return. Set to 0 for no returns.',
      initialValue: 30,
      validation: (Rule) => Rule.min(0).integer(),
      group: 'shipping',
    }),
    defineField({
      name: 'returnPolicyNotes',
      title: 'Return Policy Notes',
      type: 'text',
      rows: 3,
      description: 'Additional return policy details shown to customers',
      initialValue: 'Items must be unused and in original packaging. Custom/print-on-demand items are final sale unless defective.',
      group: 'shipping',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Store Settings'}
    },
  },
})
