import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFieldsInGroup} from '@/sanity/lib/schema-fields'

/**
 * Setlist Page singleton — content for the /setlist route.
 */
export const setlistPage = defineType({
  name: 'setlistPage',
  title: 'Setlist Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'stats', title: 'Stats Banner'},
    {name: 'imagery', title: 'Photos'},
    {name: 'repertoire', title: 'Repertoire'},
    {name: 'request', title: 'Special Request'},
    {name: 'cta', title: 'Call to Action'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // === HERO ===
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Big headline at the top of the page.',
      group: 'hero',
    }),
    defineField({
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      rows: 3,
      description: 'Short intro shown above the song list.',
      group: 'hero',
    }),
    defineField({
      name: 'subtitleSuffix',
      title: 'Hero Subtitle Suffix',
      type: 'string',
      description: 'Text appended to the song count in the hero subtitle (e.g., the count plus this string forms "32 timeless classics from the great American songbook"). Note the leading space.',
      initialValue: ' timeless classics from the great American songbook',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Background image used behind the hero.',
      group: 'hero',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Kivett Bednar blues setlist',
        }),
        ...imagePositionFields,
      ],
    }),

    // === STATS BANNER ===
    // The setlist page shows three stats. Stat 1 has an auto-counted song
    // total (just a label), stat 2 is icon + label only, stat 3 has both
    // a value and a label.
    defineField({
      name: 'statsLabel1',
      title: 'Songs Stat — Label',
      type: 'string',
      description: 'Caption under the auto-generated song count (the big number). Default: "Songs".',
      initialValue: 'Songs',
      group: 'stats',
    }),
    defineField({
      name: 'statsLabel2',
      title: 'Genre Stat — Label',
      type: 'string',
      description: 'Caption next to the spinning record icon. Default: "Classic Blues".',
      initialValue: 'Classic Blues',
      group: 'stats',
    }),
    defineField({
      name: 'statsValue3',
      title: 'Live Stat — Headline',
      type: 'string',
      description: 'Big text in the third stat. Default: "Live".',
      initialValue: 'Live',
      group: 'stats',
    }),
    defineField({
      name: 'statsLabel3',
      title: 'Live Stat — Caption',
      type: 'string',
      description: 'Caption under the third stat\'s big text. Default: "Performance Ready".',
      initialValue: 'Performance Ready',
      group: 'stats',
    }),

    // === IMAGERY ===
    defineField({
      name: 'performanceImage',
      title: 'Performance Image',
      type: 'image',
      description: 'A performance photo used for visual interest.',
      group: 'imagery',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Kivett Bednar performing live',
        }),
        ...imagePositionFields,
      ],
    }),
    defineField({
      name: 'guitarImage',
      title: 'Guitar Image',
      type: 'image',
      description: 'A guitar close-up or detail shot.',
      group: 'imagery',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Guitar detail',
        }),
        ...imagePositionFields,
      ],
    }),

    // === REPERTOIRE ===
    defineField({
      name: 'repertoireHeading',
      title: 'Section Heading',
      type: 'string',
      description: 'Heading above the song grid.',
      initialValue: 'The Repertoire',
      group: 'repertoire',
    }),
    defineField({
      name: 'songCountSummaryText',
      title: 'Song Count Summary',
      type: 'string',
      description: 'Text after the song count (e.g., the count plus this forms "32 songs ready for your event"). Note the leading space.',
      initialValue: ' songs ready for your event',
      group: 'repertoire',
    }),

    // === REQUEST ===
    defineField({
      name: 'requestHeading',
      title: 'Section Heading',
      type: 'string',
      description: 'Heading for the special-request section.',
      initialValue: 'Have a Special Request?',
      group: 'request',
    }),
    defineField({
      name: 'requestText',
      title: 'Section Text',
      type: 'text',
      rows: 3,
      initialValue: "Looking for a specific blues classic not on the list? Get in touch and let's talk about adding it to the setlist for your event.",
      group: 'request',
    }),
    defineField({
      name: 'requestButtonText',
      title: 'Request Button Text',
      type: 'string',
      initialValue: 'Make a Request',
      group: 'request',
    }),

    // === CTA ===
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for the bottom call-to-action.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaBookLessonButtonText',
      title: 'CTA — "Book a Lesson" Button',
      type: 'string',
      initialValue: 'Book a Lesson',
      group: 'cta',
    }),
    defineField({
      name: 'ctaContactButtonText',
      title: 'CTA — "Get in Touch" Button',
      type: 'string',
      initialValue: 'Get in Touch',
      group: 'cta',
    }),

    ...seoFieldsInGroup('seo'),
  ],
  preview: {
    prepare() {
      return {title: 'Setlist Page'}
    },
  },
})
