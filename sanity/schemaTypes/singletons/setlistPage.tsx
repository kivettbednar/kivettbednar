import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFields} from '@/sanity/lib/schema-fields'

/**
 * Setlist Page singleton schema
 */

export const setlistPage = defineType({
  name: 'setlistPage',
  title: 'Setlist Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    // Hero Section
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Background image for hero section',
      options: {
        hotspot: true,
      },
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

    // Content Section
    defineField({
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      rows: 3,
      description: 'Text displayed above the song list',
    }),

    // Visual Interest Images
    defineField({
      name: 'performanceImage',
      title: 'Performance Image',
      type: 'image',
      description: 'Performance photo for visual interest',
      options: {
        hotspot: true,
      },
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
    defineField({
      name: 'guitarImage',
      title: 'Guitar Image',
      type: 'image',
      description: 'Guitar close-up or detail shot',
      options: {
        hotspot: true,
      },
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

    // CTA Section
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading for call-to-action section at bottom',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'text',
      rows: 2,
      description: 'Text for call-to-action at bottom',
    }),

    // Button Labels
    defineField({
      name: 'ctaBookLessonButtonText',
      title: 'CTA: Book Lesson Button Text',
      type: 'string',
      description: 'Text for "Book a Lesson" button in CTA',
      initialValue: 'Book a Lesson',
    }),
    defineField({
      name: 'ctaContactButtonText',
      title: 'CTA: Contact Button Text',
      type: 'string',
      description: 'Text for "Get in Touch" button in CTA',
      initialValue: 'Get in Touch',
    }),

    // Stats Section Labels
    defineField({
      name: 'statsLabel1',
      title: 'Stats Label 1',
      type: 'string',
      description: 'Label for song count stat (e.g., "Songs")',
      initialValue: 'Songs',
    }),
    defineField({
      name: 'statsLabel2',
      title: 'Stats Label 2',
      type: 'string',
      description: 'Label for genre stat (e.g., "Classic Blues")',
      initialValue: 'Classic Blues',
    }),
    defineField({
      name: 'statsValue3',
      title: 'Stats Value 3',
      type: 'string',
      description: 'Value for third stat (e.g., "Live")',
      initialValue: 'Live',
    }),
    defineField({
      name: 'statsLabel3',
      title: 'Stats Label 3',
      type: 'string',
      description: 'Label for third stat (e.g., "Performance Ready")',
      initialValue: 'Performance Ready',
    }),

    // Repertoire Section
    defineField({
      name: 'repertoireHeading',
      title: 'Repertoire Heading',
      type: 'string',
      description: 'Heading above the song grid',
      initialValue: 'The Repertoire',
    }),
    defineField({
      name: 'songCountSummaryText',
      title: 'Song Count Summary Text',
      type: 'string',
      description: 'Text after song count (e.g., " songs ready for your event")',
      initialValue: ' songs ready for your event',
    }),

    // Request Section
    defineField({
      name: 'requestHeading',
      title: 'Request Section Heading',
      type: 'string',
      description: 'Heading for "Have a Special Request?" section',
      initialValue: 'Have a Special Request?',
    }),
    defineField({
      name: 'requestText',
      title: 'Request Section Text',
      type: 'text',
      rows: 3,
      description: 'Description text for request section',
      initialValue: 'Looking for a specific blues classic not on the list? Get in touch and let\'s talk about adding it to the setlist for your event.',
    }),
    defineField({
      name: 'requestButtonText',
      title: 'Request Button Text',
      type: 'string',
      description: 'Button text for request section',
      initialValue: 'Make a Request',
    }),

    // Dynamic Text
    defineField({
      name: 'subtitleSuffix',
      title: 'Subtitle Suffix',
      type: 'string',
      description: 'Text appended to song count in hero subtitle (e.g., "32 [timeless classics...]")',
      initialValue: ' timeless classics from the great American songbook',
    }),
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {
        title: 'Setlist Page',
      }
    },
  },
})
