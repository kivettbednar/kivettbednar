import {ComponentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const ampsPage = defineType({
  name: 'ampsPage',
  title: 'Amps Page',
  type: 'document',
  icon: ComponentIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'showcase', title: 'Showcase'},
    {name: 'shop', title: 'Shop'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // === HERO ===
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Custom Amps',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Handcrafted artisan guitar amplifiers built with precision and soul.',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
      ],
      group: 'hero',
    }),

    // === SHOWCASE ===
    defineField({
      name: 'showcaseHeading',
      title: 'Showcase Heading',
      type: 'string',
      initialValue: 'The Craft',
      group: 'showcase',
    }),
    defineField({
      name: 'showcaseText',
      title: 'Showcase Text',
      type: 'text',
      rows: 4,
      initialValue: 'Each amp is built by hand with premium components, meticulous attention to detail, and a deep understanding of tone.',
      group: 'showcase',
    }),
    defineField({
      name: 'craftsmanshipHeading',
      title: 'Craftsmanship Heading',
      type: 'string',
      initialValue: 'Built by Hand',
      group: 'showcase',
    }),
    defineField({
      name: 'craftsmanshipText',
      title: 'Craftsmanship Text',
      type: 'text',
      rows: 4,
      group: 'showcase',
    }),
    defineField({
      name: 'craftsmanshipImage',
      title: 'Craftsmanship Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
      ],
      group: 'showcase',
    }),

    // === SHOP ===
    defineField({
      name: 'shopHeading',
      title: 'Shop Heading',
      type: 'string',
      initialValue: 'Available Amps',
      group: 'shop',
    }),
    defineField({
      name: 'shopSubheading',
      title: 'Shop Subheading',
      type: 'text',
      rows: 2,
      group: 'shop',
    }),
    defineField({
      name: 'emptyStateHeading',
      title: 'Empty State Heading',
      type: 'string',
      description: 'Shown when no amp products are available',
      initialValue: 'New Builds Coming Soon',
      group: 'shop',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Empty State Text',
      type: 'text',
      rows: 2,
      initialValue: 'Custom amps are built to order. Get in touch to discuss your dream amp.',
      group: 'shop',
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
    prepare() {
      return {title: 'Amps Page'}
    },
  },
})
