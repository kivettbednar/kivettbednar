import {PackageIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {formatPrice} from '@/lib/format'
import {MarginDisplay} from '@/sanity/components/MarginDisplay'
import {GelatoProductUidInput} from '@/sanity/components/GelatoProductUidInput'

/**
 * Product schema for POD (Print on Demand) merch via Gelato
 * Includes variant management, pricing, and Gelato integration fields
 */
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            ...imagePositionFields,
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    }),
    defineField({
      name: 'priceCents',
      title: 'Price (cents)',
      type: 'number',
      description: 'Price in cents (e.g., 2500 = $25.00)',
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'compareAtPriceCents',
      title: 'Compare At Price (cents)',
      type: 'number',
      description: 'Original price before discount - creates "Was $X, Now $Y" display',
    }),
    defineField({
      name: 'onSale',
      title: 'On Sale',
      type: 'boolean',
      description: 'Mark product as on sale (shows sale badge)',
      initialValue: false,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
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
      description: 'Options like Size, Color, etc.',
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
      description: 'Product variants with option combinations',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'optionValues',
              title: 'Option Values',
              type: 'array',
              description: 'Key-value pairs like Size: Medium, Color: Black',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'key',
                      title: 'Option Name',
                      type: 'string',
                      description: 'e.g., "Size", "Color"',
                    }),
                    defineField({
                      name: 'value',
                      title: 'Option Value',
                      type: 'string',
                      description: 'e.g., "Medium", "Black"',
                    }),
                  ],
                }),
              ],
            }),
            defineField({
              name: 'priceCents',
              title: 'Price Override (cents)',
              type: 'number',
              description: 'Optional price override for this variant',
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
                    .join(', ')
                : 'No options'
              const price = priceCents ? ` - $${formatPrice(priceCents)}` : ''
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
      title: 'Gelato Product UID',
      type: 'string',
      description: 'Find this in your Gelato dashboard under Products → Product details. Leave blank for non-print-on-demand items.',
      components: {input: GelatoProductUidInput},
    }),
    defineField({
      name: 'gelatoCostCents',
      title: 'Gelato Cost (cents)',
      type: 'number',
      description: 'Production cost from Gelato in cents. Use /api/gelato/prices to look up. Your margin = Price - Cost.',
      components: {input: MarginDisplay},
    }),
    defineField({
      name: 'printAreas',
      title: 'Print Areas',
      type: 'array',
      description: 'Define artwork for each print area (front, back, etc.)',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'areaName',
              title: 'Area Name',
              type: 'string',
              description: 'e.g., "front", "back"',            }),
            defineField({
              name: 'artwork',
              title: 'Artwork',
              type: 'image',
              description: 'High-resolution artwork for this print area',            }),
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
      ],    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Apparel', value: 'apparel'},
          {title: 'Music', value: 'music'},
          {title: 'Accessories', value: 'accessories'},
          {title: 'Posters & Prints', value: 'prints'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stockStatus',
      title: 'Stock Status',
      type: 'string',
      description: 'Updated automatically when inventory tracking is enabled. Set manually for non-tracked products.',
      options: {
        list: [
          {title: 'In Stock', value: 'in_stock'},
          {title: 'Low Stock', value: 'low_stock'},
          {title: 'Out of Stock', value: 'out_of_stock'},
          {title: 'Pre-Order', value: 'pre_order'},
        ],
      },
      initialValue: 'in_stock',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Show this product prominently on the merch page',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Product Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Tags for search and filtering (e.g., "vintage", "tour-exclusive", "limited-edition")',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'badges',
      title: 'Product Badges',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      description: 'Display badges like "New", "Best Seller", "Limited Edition"',
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
      name: 'inventoryQuantity',
      title: 'Inventory Quantity',
      type: 'number',
      description: 'Current stock quantity (-1 for unlimited/made-to-order)',
      initialValue: -1,
    }),
    defineField({
      name: 'lowStockThreshold',
      title: 'Low Stock Threshold',
      type: 'number',
      description: 'Show "low stock" warning when inventory falls below this number',
      initialValue: 5,
    }),
    defineField({
      name: 'trackInventory',
      title: 'Track Inventory',
      type: 'boolean',
      description: 'Enable inventory tracking for this product',
      initialValue: false,
    }),
    defineField({
      name: 'availableDate',
      title: 'Available Date',
      type: 'datetime',
      description: 'When product becomes available (for pre-orders)',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'product'}],
        }),
      ],
      description: 'Products to show as "You might also like"',
    }),
    defineField({
      name: 'dimensions',
      title: 'Product Dimensions',
      type: 'object',
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
      rows: 2,
      description: 'Materials used in product (e.g., "100% Cotton", "Vinyl, Cardboard")',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      rows: 3,
      description: 'How to care for the product',
    }),
    defineField({
      name: 'shippingNotes',
      title: 'Shipping Notes',
      type: 'text',
      rows: 3,
      description: 'Display shipping time estimates, international availability, etc.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
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
      media: 'images.0',
    },
    prepare({title, priceCents, currency, media}) {
      const price = priceCents ? `${currency} $${formatPrice(priceCents)}` : 'No price'
      return {
        title,
        subtitle: price,
        media,
      }
    },
  },
})
