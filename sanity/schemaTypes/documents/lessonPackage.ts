import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const lessonPackage = defineType({
  name: 'lessonPackage',
  title: 'Lesson Package',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'pricing', title: 'Pricing'},
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // === DETAILS ===
    defineField({
      name: 'title',
      title: 'Package Title',
      type: 'string',
      description: 'e.g., "Blues Fundamentals", "Advanced Improvisation"',
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short one-liner for cards and listings',
      group: 'details',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
      ],
      group: 'details',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
          {title: 'All Levels', value: 'all'},
        ],
      },
      initialValue: 'all',
      group: 'details',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          {title: 'In Person', value: 'in_person'},
          {title: 'Online', value: 'online'},
          {title: 'Both', value: 'both'},
        ],
      },
      initialValue: 'both',
      group: 'details',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "4 weeks", "Single session", "Ongoing"',
      group: 'details',
    }),
    defineField({
      name: 'sessionsCount',
      title: 'Number of Sessions',
      type: 'number',
      description: 'Total sessions in this package',
      validation: (Rule) => Rule.min(1).integer(),
      group: 'details',
    }),
    defineField({
      name: 'sessionLength',
      title: 'Session Length',
      type: 'string',
      description: 'e.g., "60 minutes", "90 minutes"',
      group: 'details',
    }),

    // === PRICING ===
    defineField({
      name: 'priceCents',
      title: 'Price (cents)',
      type: 'number',
      description: 'Price in cents. Enter 5000 for $50.00, 15000 for $150.00.',
      validation: (Rule) => Rule.required().min(0).integer(),
      group: 'pricing',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          {title: 'USD ($)', value: 'usd'},
          {title: 'CAD (C$)', value: 'cad'},
          {title: 'GBP (£)', value: 'gbp'},
          {title: 'EUR (€)', value: 'eur'},
        ],
      },
      initialValue: 'usd',
      group: 'pricing',
    }),
    defineField({
      name: 'compareAtPriceCents',
      title: 'Compare At Price (cents)',
      type: 'number',
      description: 'Original price for showing discounts. Leave empty if not on sale.',
      group: 'pricing',
    }),

    // === CONTENT ===
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Full description shown on the package detail page',
      group: 'content',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      description: 'What students will learn',
      of: [{type: 'string'}],
      group: 'content',
    }),
    defineField({
      name: 'includes',
      title: 'Includes',
      type: 'array',
      description: "What's included in the package",
      of: [{type: 'string'}],
      group: 'content',
    }),

    // === DISPLAY ===
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Highlight this package on the lessons page',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional badge text, e.g., "Most Popular", "Best Value"',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only active packages are shown on the site and available for purchase',
      initialValue: true,
    }),

    // === SEO ===
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'string',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tagline',
      media: 'image',
    },
  },
})
