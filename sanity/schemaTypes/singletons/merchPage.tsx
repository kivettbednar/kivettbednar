import {BasketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFields} from '@/sanity/lib/schema-fields'

/**
 * Merch Page singleton schema - content for the merchandise page
 */

export const merchPage = defineType({
  name: 'merchPage',
  title: 'Merch Page',
  type: 'document',
  icon: BasketIcon,
  fields: [
    // Hero Section
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Main heading for merch page (e.g., "Merch")',
      initialValue: 'Merch',    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
      description: 'Subtitle for merch page (e.g., "Official Kivett Bednar gear and music")',
      initialValue: 'Official Kivett Bednar gear and music',    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image (Optional)',
      type: 'image',
      description: 'Optional background image for hero section',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
              initialValue: 'Kivett Bednar merchandise',
        }),
        ...imagePositionFields,
      ],
    }),

    // Empty State Content (when no products)
    defineField({
      name: 'emptyStateHeading',
      title: 'Empty State Heading',
      type: 'string',
      description: 'Heading shown when no products are available',
      initialValue: 'Merch Store Opening Soon!',    }),
    defineField({
      name: 'emptyStateText',
      title: 'Empty State Text',
      type: 'text',
      rows: 3,
      description: 'Message shown when no products are available',
      initialValue:
        'T-shirts, vinyl records, and other official merchandise coming soon. Be the first to know when our store launches!',    }),
    defineField({
      name: 'emptyStateButton1Text',
      title: 'Empty State Button 1 Text',
      type: 'string',
      description: 'Text for first call-to-action button',
      initialValue: 'Get Notified',
    }),
    defineField({
      name: 'emptyStateButton1Link',
      title: 'Empty State Button 1 Link',
      type: 'string',
      description: 'URL or path for first button (e.g., "/contact" or "#newsletter")',
      initialValue: '/contact',
    }),
    defineField({
      name: 'emptyStateButton2Text',
      title: 'Empty State Button 2 Text',
      type: 'string',
      description: 'Text for second call-to-action button',
      initialValue: 'See Live Shows',
    }),
    defineField({
      name: 'emptyStateButton2Link',
      title: 'Empty State Button 2 Link',
      type: 'string',
      description: 'URL or path for second button',
      initialValue: '/shows',
    }),

    // Content When Products Exist
    defineField({
      name: 'contentHeading',
      title: 'Products Section Heading',
      type: 'string',
      description: 'Heading shown above products when store is active',
      initialValue: 'Official Merchandise',
    }),
    defineField({
      name: 'contentSubheading',
      title: 'Products Section Subheading',
      type: 'text',
      rows: 2,
      description: 'Subtitle for products section',
      initialValue: 'Support the music and show your blues pride',
    }),
    defineField({
      name: 'trustBadges',
      title: 'Product Trust Badges',
      type: 'array',
      description: 'Trust badges shown on product detail pages (e.g., "Authentic", "Free Shipping")',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustBadge',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'string'}),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Shield', value: 'shield'},
                  {title: 'Star', value: 'star'},
                  {title: 'Truck', value: 'truck'},
                  {title: 'Guitar', value: 'guitar'},
                  {title: 'Package', value: 'package'},
                  {title: 'Sparkles', value: 'sparkles'},
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
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {
        title: 'Merch Page',
      }
    },
  },
})
