import {defineField, defineType, defineArrayMember} from 'sanity'
import {BasketIcon} from '@sanity/icons'
import {TrackingUrlInput, StripeSessionIdInput} from '@/sanity/components/OrderExternalLinks'

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      description: 'Stripe checkout session ID',
      components: {input: StripeSessionIdInput},
    }),
    defineField({
      name: 'email',
      title: 'Customer Email',
      type: 'string',
    }),
    defineField({
      name: 'name',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({name: 'line1', title: 'Address Line 1', type: 'string'}),
        defineField({name: 'line2', title: 'Address Line 2', type: 'string'}),
        defineField({name: 'city', title: 'City', type: 'string'}),
        defineField({name: 'state', title: 'State/Province', type: 'string'}),
        defineField({name: 'postalCode', title: 'Postal/Zip Code', type: 'string'}),
        defineField({name: 'country', title: 'Country', type: 'string'}),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'productId', title: 'Product ID', type: 'string'}),
            defineField({name: 'productTitle', title: 'Product Title', type: 'string'}),
            defineField({name: 'productSlug', title: 'Product Slug', type: 'string'}),
            defineField({name: 'quantity', title: 'Quantity', type: 'number'}),
            defineField({name: 'priceCents', title: 'Price (cents)', type: 'number'}),
            defineField({
              name: 'options',
              title: 'Selected Options',
              type: 'text',
              description: 'Size, color, etc. (stored as JSON string)',
            }),
            defineField({name: 'gelatoProductUid', title: 'Gelato Product UID', type: 'string'}),
            defineField({name: 'imageUrl', title: 'Product Image URL', type: 'string'}),
          ],
          preview: {
            select: {
              title: 'productTitle',
              subtitle: 'quantity',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Unknown Product',
                subtitle: `Quantity: ${subtitle || 0}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'totalCents',
      title: 'Total Amount (cents)',
      type: 'number',
      description: 'Total order amount in cents',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
    }),
    defineField({
      name: 'gelatoOrderId',
      title: 'Gelato Order ID',
      type: 'string',
      description: 'ID from Gelato fulfillment system',
    }),
    defineField({
      name: 'gelatoStatus',
      title: 'Gelato Status (auto-updated)',
      type: 'string',
      description:
        'Raw status from Gelato. Updates automatically when their webhook fires. Read-only — to change overall status, use "Order Status" below.',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      description:
        'Tracks the order from checkout to delivery. Stays in sync with Gelato automatically — only change manually if you\'re fulfilling outside Gelato or need to mark a refund/dispute. Pending = paid, awaiting Gelato. Submitted = sent to Gelato. In Production / Shipped / Delivered = Gelato updates. Failed / Gelato Failed = something broke (see "Gelato Error").',
      options: {
        list: [
          {title: 'Pending — paid, awaiting Gelato submission', value: 'pending'},
          {title: 'Submitted to Gelato', value: 'submitted'},
          {title: 'In Production', value: 'in_production'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Canceled', value: 'canceled'},
          {title: 'Refunded', value: 'refunded'},
          {title: 'Disputed (Stripe)', value: 'disputed'},
          {title: 'Failed (payment or system error)', value: 'failed'},
          {title: 'Gelato Failed (retry available)', value: 'gelato_failed'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'promoCode',
      title: 'Promo Code',
      type: 'string',
      description: 'Discount code used for this order',
    }),
    defineField({
      name: 'discountAmountCents',
      title: 'Discount Amount (cents)',
      type: 'number',
      description: 'Discount amount applied in cents',
    }),
    defineField({
      name: 'gelatoError',
      title: 'Gelato Error',
      type: 'string',
      description: 'Error message if Gelato fulfillment failed',
    }),
    defineField({
      name: 'postProcessed',
      title: 'Post-Processed',
      type: 'boolean',
      description: 'Whether inventory deduction and promo code increment have been completed',
      initialValue: false,
      hidden: true,
    }),
    defineField({
      name: 'shippingMethod',
      title: 'Shipping Method',
      type: 'string',
      description: 'Gelato shipping method used (e.g., "normal", "express")',
    }),
    defineField({
      name: 'deliveryEstimate',
      title: 'Estimated Delivery',
      type: 'string',
      description: 'Estimated delivery date from Gelato',
    }),
    defineField({
      name: 'carrier',
      title: 'Carrier',
      type: 'string',
      description: 'Shipping carrier (e.g., "UPS", "FedEx", "USPS")',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Shipment tracking number from carrier',
    }),
    defineField({
      name: 'trackingUrl',
      title: 'Tracking URL',
      type: 'url',
      description: 'URL to track shipment',
      components: {input: TrackingUrlInput},
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
      description: 'Internal notes about this order',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      customerName: 'name',
      email: 'email',
      status: 'status',
      total: 'totalCents',
      currency: 'currency',
    },
    prepare({customerName, email, status, total, currency}) {
      const amount = total ? `${currency || 'USD'} $${(total / 100).toFixed(2)}` : 'No amount'
      return {
        title: customerName || email || 'Unknown Customer',
        subtitle: `${status || 'pending'} • ${amount}`,
      }
    },
  },
  orderings: [
    {
      title: 'Created Date (Newest First)',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
