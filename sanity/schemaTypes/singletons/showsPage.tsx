import {CalendarIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFields} from '@/sanity/lib/schema-fields'

/**
 * Shows Page singleton schema - content for the shows/events page
 */

export const showsPage = defineType({
  name: 'showsPage',
  title: 'Shows Page',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    // Hero Section
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Main heading (e.g., "Live Shows")',    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      description: 'Subtitle text below the heading',    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Desktop Image',
      type: 'image',
      description: 'Desktop background image for the hero section',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility',
        }),
        ...imagePositionFields,
      ],
    }),
    defineField({
      name: 'heroMobileImage',
      title: 'Hero Mobile Image (Optional)',
      type: 'image',
      description: 'Different image for mobile devices. If not set, desktop image will be used.',
      options: {
        hotspot: true,
      },
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

    // Performance Gallery Section
    defineField({
      name: 'performanceGalleryHeading',
      title: 'Performance Gallery Heading',
      type: 'string',
      description: 'Heading for the performance photos section',    }),
    defineField({
      name: 'performanceGallerySubheading',
      title: 'Performance Gallery Subheading',
      type: 'string',
      description: 'Subtitle for the performance photos section',
    }),
    defineField({
      name: 'performanceImages',
      title: 'Performance Gallery Images',
      type: 'array',
      description: 'Grid of performance photos (recommended: 6 images)',      of: [
        defineArrayMember({
          type: 'object',
          name: 'performanceImage',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for accessibility',            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Short caption displayed on the image',
            }),
            ...imagePositionFields,
          ],
          preview: {
            select: {
              title: 'caption',
              subtitle: 'alt',
              media: 'image',
            },
          },
        }),
      ],
    }),

    // Upcoming Shows Section
    defineField({
      name: 'upcomingShowsHeading',
      title: 'Upcoming Shows Heading',
      type: 'string',
      description: 'Heading for upcoming shows list',    }),
    defineField({
      name: 'emptyStateHeading',
      title: 'No Shows - Heading',
      type: 'string',
      description: 'Heading when no upcoming shows exist',    }),
    defineField({
      name: 'emptyStateText',
      title: 'No Shows - Message',
      type: 'text',
      description: 'Message displayed when no upcoming shows are scheduled',    }),

    // Dynamic Count Text
    defineField({
      name: 'showCountPrefix',
      title: 'Show Count Prefix',
      type: 'string',
      description: 'Text prefix before show count (e.g., " upcoming")',
      initialValue: ' upcoming',
    }),
    defineField({
      name: 'showSingular',
      title: 'Show: Singular Form',
      type: 'string',
      description: 'Singular form (e.g., "show")',
      initialValue: 'show',    }),
    defineField({
      name: 'showPlural',
      title: 'Show: Plural Form',
      type: 'string',
      description: 'Plural form (e.g., "shows")',
      initialValue: 'shows',    }),

    // Stats Banner Labels
    defineField({
      name: 'statsLabel1',
      title: 'Stats Label 1',
      type: 'string',
      description: 'Label for first stat (default: "Upcoming Shows")',
      initialValue: 'Upcoming Shows',
    }),
    defineField({
      name: 'statsLabel2',
      title: 'Stats Label 2',
      type: 'string',
      description: 'Label for second stat (default: "Live Blues")',
      initialValue: 'Live Blues',
    }),
    defineField({
      name: 'statsLabel3',
      title: 'Stats Label 3',
      type: 'string',
      description: 'Label for third stat (default: "Pacific Northwest")',
      initialValue: 'Pacific Northwest',
    }),

    // Event Detail Page Labels
    defineField({
      name: 'eventDetailsLabel',
      title: 'Event Details Label',
      type: 'string',
      initialValue: 'Event Details',
    }),
    defineField({
      name: 'dateTimeLabel',
      title: 'Date & Time Label',
      type: 'string',
      initialValue: 'Date & Time',
    }),
    defineField({
      name: 'venueLabel',
      title: 'Venue Label',
      type: 'string',
      initialValue: 'Venue',
    }),
    defineField({
      name: 'viewOnMapText',
      title: 'View on Map Text',
      type: 'string',
      initialValue: 'View on Map',
    }),
    defineField({
      name: 'getTicketsText',
      title: 'Get Tickets Text',
      type: 'string',
      initialValue: 'Get Tickets',
    }),
    defineField({
      name: 'soldOutText',
      title: 'Sold Out Text',
      type: 'string',
      initialValue: 'Sold Out',
    }),
    defineField({
      name: 'backToShowsText',
      title: 'Back to Shows Text',
      type: 'string',
      initialValue: 'Back to All Shows',
    }),
    defineField({
      name: 'shareEventText',
      title: 'Share Event Text',
      type: 'string',
      initialValue: 'Share Event',
    }),
    defineField({
      name: 'importantInfoText',
      title: 'Important Information Label',
      type: 'string',
      initialValue: 'Important Information',
    }),
    defineField({
      name: 'canceledBadgeText',
      title: 'Canceled Badge Text',
      type: 'string',
      initialValue: 'CANCELED',
    }),
    defineField({
      name: 'soldOutBadgeText',
      title: 'Sold Out Badge Text',
      type: 'string',
      initialValue: 'SOLD OUT',
    }),
    defineField({
      name: 'canceledMessageText',
      title: 'Canceled Event Message',
      type: 'string',
      initialValue: 'This event has been canceled',
    }),
    ...seoFields,
    defineField({
      name: 'defaultEventImage',
      title: 'Default Event Image',
      type: 'image',
      description: 'Fallback image for events without their own hero image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Shows Page',
        subtitle: 'Live shows and events content',
      }
    },
  },
})
