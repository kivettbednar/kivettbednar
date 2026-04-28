import {PackageIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {formatPrice} from '@/lib/format'
import {MarginDisplay} from '@/sanity/components/MarginDisplay'
import {GelatoProductUidInput} from '@/sanity/components/GelatoProductUidInput'
import {PriceInput} from '@/sanity/components/PriceInput'
import {AutoSlugInput} from '@/sanity/components/AutoSlugInput'

/**
 * Product schema for POD (Print on Demand) merch via Gelato
 * Includes variant management, pricing, and Gelato integration fields
 */
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'images', title: 'Images'},
    {name: 'pricing', title: 'Pricing'},
    {name: 'variants', title: 'Options & Variants'},
    {name: 'inventory', title: 'Inventory'},
    {name: 'production', title: 'Production (POD)'},
    {name: 'marketing', title: 'Marketing'},
    {name: 'details', title: 'Details & Shipping'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      group: 'basics',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'basics',
      description:
        'The URL part for this product. Auto-fills from the title (e.g., "Tour Tee" → /merch/tour-tee). Only edit if you need a custom URL.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      components: {input: AutoSlugInput},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      group: 'basics',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          {title: 'Apparel', value: 'apparel'},
          {title: 'Music', value: 'music'},
          {title: 'Accessories', value: 'accessories'},
          {title: 'Posters & Prints', value: 'prints'},
          {title: 'Amps & Cases', value: 'amps'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'basics',
      description: 'Show this product prominently on the merch page',
      initialValue: false,
    }),
    defineField({
      name: 'archived',
      title: 'Archived',
      type: 'boolean',
      group: 'basics',
      description:
        'Archived products stay in your records (so order history keeps working) but disappear from the public merch page. Toggle off to bring back.',
      initialValue: false,
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      group: 'images',
      description: 'First image is used as the card thumbnail. Upload multiple to show in the product gallery.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
            aiAssist: {imageDescriptionField: 'alt'},
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description:
                'Describe the image for screen readers and search engines (e.g., "Black tee with Kivett Bednar wordmark on the front"). Required when an image is set.',
              validation: (rule) =>
                rule.custom((alt, context) => {
                  const parent = context.parent as {asset?: {_ref?: string}} | undefined
                  if (parent?.asset?._ref && !alt) return 'Alt text is required'
                  return true
                }),
            }),
            ...imagePositionFields,
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    }),
    defineField({
      name: 'priceCents',
      title: 'Price',
      type: 'number',
      group: 'pricing',
      description: 'Enter in dollars (e.g. 25 = $25.00, 19.99 = $19.99). Stored as cents under the hood.',
      components: {input: PriceInput},
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'compareAtPriceCents',
      title: 'Original Price',
      type: 'number',
      group: 'pricing',
      description:
        'When set and higher than Price, the product page shows "Was $X, Now $Y". Leave blank if not on sale.',
      components: {input: PriceInput},
      validation: (Rule) =>
        Rule.integer().positive().custom((value, context) => {
          if (!value) return true
          const parent = context?.parent as {priceCents?: number}
          if (parent?.priceCents && value <= parent.priceCents) {
            return 'Compare-at price must be higher than the sale price'
          }
          return true
        }),
    }),
    defineField({
      name: 'onSale',
      title: 'On Sale',
      type: 'boolean',
      group: 'pricing',
      description: 'Shows the "Sale" badge on the product card.',
      initialValue: false,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      group: 'pricing',
      initialValue: 'USD',
      options: {
        list: [
          {title: 'USD', value: 'USD'},
          {title: 'EUR', value: 'EUR'},
          {title: 'GBP', value: 'GBP'},
        ],
      },
    }),
    defineField({
      name: 'options',
      title: 'Product Options',
      type: 'array',
      group: 'variants',
      description: 'Define the axes customers choose from (e.g. Size → S/M/L, Color → Black/White). Leave empty if the product has no options.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Option Name',
              type: 'string',
              description: 'e.g., "Size", "Color"',            }),
            defineField({
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [{type: 'string'}],
              description: 'e.g., ["Small", "Medium", "Large"]',            }),
          ],
          preview: {
            select: {
              name: 'name',
              values: 'values',
            },
            prepare({name, values}) {
              return {
                title: name,
                subtitle: values?.join(', '),
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      group: 'variants',
      description: 'Each variant = one combination of option values. Only needed if you want per-combination pricing or SKUs. Otherwise leave empty and all combinations share the base price.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'optionValues',
              title: 'Which combination',
              type: 'array',
              description: 'List the option values for this variant (e.g. Size: Medium, Color: Black)',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'key',
                      title: 'Option',
                      type: 'string',
                      description: 'Must match an option name above (e.g. "Size")',
                    }),
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                      description: 'Must match one of the values for that option (e.g. "Medium")',
                    }),
                  ],
                  preview: {
                    select: {key: 'key', value: 'value'},
                    prepare: ({key, value}) => ({title: `${key || '?'}: ${value || '?'}`}),
                  },
                }),
              ],
            }),
            defineField({
              name: 'priceCents',
              title: 'Price override',
              type: 'number',
              components: {input: PriceInput},
              description: 'Leave empty to use the base product price.',
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              optionValues: 'optionValues',
              priceCents: 'priceCents',
            },
            prepare({optionValues, priceCents}) {
              const values = optionValues && Array.isArray(optionValues)
                ? optionValues
                    .map((opt: {key?: string; value?: string}) => `${opt.key}: ${opt.value}`)
                    .join(' · ')
                : 'No options'
              const price = priceCents ? ` — $${formatPrice(priceCents)}` : ''
              return {
                title: values,
                subtitle: `Variant${price}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'gelatoProductUid',
      title: 'Gelato Product ID',
      type: 'string',
      group: 'production',
      description:
        'For print-on-demand items only. Find this in your Gelato dashboard under Products → [your product] → Details (it\'s the long ID near the top). Leave blank for self-fulfilled items.',
      components: {input: GelatoProductUidInput},
    }),
    defineField({
      name: 'gelatoCostCents',
      title: 'Production Cost (from Gelato)',
      type: 'number',
      group: 'production',
      description:
        'How much Gelato charges to produce one unit. Enter in dollars. Used to show your margin (Price minus Cost) below.',
      components: {input: MarginDisplay},
    }),
    defineField({
      name: 'printAreas',
      title: 'Print Areas',
      type: 'array',
      group: 'production',
      description: 'Upload artwork for each print area (front, back, sleeve).',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'areaName',
              title: 'Area Name',
              type: 'string',
              description: 'e.g., "front", "back"',
            }),
            defineField({
              name: 'artwork',
              title: 'Artwork',
              type: 'image',
              description: 'High-resolution artwork for this print area',
            }),
          ],
          preview: {
            select: {
              areaName: 'areaName',
              media: 'artwork',
            },
            prepare({areaName, media}) {
              return {
                title: areaName || 'Print Area',
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'trackInventory',
      title: 'Track inventory for this product?',
      type: 'boolean',
      group: 'inventory',
      description: 'When on, "In Stock / Low Stock / Out of Stock" is computed from the quantity below. When off, set Stock Status manually.',
      initialValue: false,
    }),
    defineField({
      name: 'inventoryQuantity',
      title: 'Inventory Quantity',
      type: 'number',
      group: 'inventory',
      description: 'Current stock count. Use -1 for unlimited / made-to-order.',
      initialValue: -1,
      hidden: ({parent}) => !parent?.trackInventory,
    }),
    defineField({
      name: 'lowStockThreshold',
      title: 'Low Stock Threshold',
      type: 'number',
      group: 'inventory',
      description: 'Show "Only X left" badge when quantity falls at or below this.',
      initialValue: 5,
      hidden: ({parent}) => !parent?.trackInventory,
    }),
    defineField({
      name: 'stockStatus',
      title: 'Stock Status (manual override)',
      type: 'string',
      group: 'inventory',
      description: 'Used when inventory tracking is off.',
      options: {
        list: [
          {title: 'In Stock', value: 'in_stock'},
          {title: 'Low Stock', value: 'low_stock'},
          {title: 'Out of Stock', value: 'out_of_stock'},
          {title: 'Pre-Order', value: 'pre_order'},
        ],
      },
      initialValue: 'in_stock',
      hidden: ({parent}) => !!parent?.trackInventory,
    }),
    defineField({
      name: 'availableDate',
      title: 'Available Date',
      type: 'datetime',
      group: 'inventory',
      description: 'For pre-orders — when the product becomes available.',
    }),
    defineField({
      name: 'tags',
      title: 'Product Tags',
      type: 'array',
      group: 'marketing',
      of: [{type: 'string'}],
      description: 'Free-form tags for search and filtering (e.g. "vintage", "tour-exclusive").',
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'badges',
      title: 'Product Badges',
      type: 'array',
      group: 'marketing',
      of: [defineArrayMember({type: 'string'})],
      description: 'Visual pills shown on the product card. Only these 5 are supported in code.',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Best Seller', value: 'bestseller'},
          {title: 'Limited Edition', value: 'limited'},
          {title: 'Tour Exclusive', value: 'tour-exclusive'},
          {title: 'Back in Stock', value: 'back-in-stock'},
        ],
      },
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      group: 'marketing',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      description: 'Shown as "You might also like" on the product page.',
    }),
    defineField({
      name: 'dimensions',
      title: 'Product Dimensions',
      type: 'object',
      group: 'details',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'length',
          title: 'Length (inches)',
          type: 'number',
        }),
        defineField({
          name: 'width',
          title: 'Width (inches)',
          type: 'number',
        }),
        defineField({
          name: 'height',
          title: 'Height (inches)',
          type: 'number',
        }),
        defineField({
          name: 'weight',
          title: 'Weight (ounces)',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'text',
      group: 'details',
      rows: 2,
      description: 'e.g. "100% Cotton", "Vinyl, Cardboard"',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      group: 'details',
      rows: 3,
      description: 'How to care for the product.',
    }),
    defineField({
      name: 'shippingNotes',
      title: 'Shipping Notes',
      type: 'text',
      group: 'details',
      rows: 3,
      description: 'Shipping time estimates, international availability, etc.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'SEO Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      priceCents: 'priceCents',
      currency: 'currency',
      featured: 'featured',
      onSale: 'onSale',
      category: 'category',
      media: 'images.0',
    },
    prepare({title, priceCents, currency, featured, onSale, category, media}) {
      const price = priceCents ? `${currency || 'USD'} $${formatPrice(priceCents)}` : 'No price'
      const markers: string[] = []
      if (featured) markers.push('★ Featured')
      if (onSale) markers.push('Sale')
      const subtitle = [price, category, ...markers].filter(Boolean).join(' · ')
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
