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
      initialValue:
        'Every amp starts with a vision — a conversation about the sound you chase. From vintage tweed warmth to modern high-headroom cleans, each build is hand-wired from premium components selected for tone, reliability, and a century of service ahead.',
      group: 'showcase',
    }),
    defineField({
      name: 'craftsmanshipHeading',
      title: 'Craftsmanship Heading',
      type: 'string',
      initialValue: 'Built by Hand, Built to Last',
      group: 'showcase',
    }),
    defineField({
      name: 'craftsmanshipText',
      title: 'Craftsmanship Text',
      type: 'text',
      rows: 4,
      initialValue:
        'Point-to-point wiring. NOS-spec capacitors and resistors where it matters. Custom-wound transformers. Solid pine or baltic birch cabinets finished with real tweed, tolex, or leather. Each amp is signed, serial-numbered, and voiced on a Strat and a Tele before it leaves the bench.',
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
      initialValue:
        'Limited-run builds and one-of-a-kind commissions. Each amp includes a custom dovetail road case, a two-year warranty, and lifetime servicing.',
      group: 'shop',
    }),
    defineField({
      name: 'emptyStateHeading',
      title: 'Empty State Heading',
      type: 'string',
      description: 'Shown when no amp products are available',
      initialValue: 'Next Batch in Progress',
      group: 'shop',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Empty State Text',
      type: 'text',
      rows: 3,
      initialValue:
        'All current builds are spoken for. New amps drop in small batches — reach out to get on the list or to commission a custom build tailored to your tone.',
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
