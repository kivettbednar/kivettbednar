import {CalendarIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFieldsInGroup} from '@/sanity/lib/schema-fields'

/**
 * Shows Page singleton — content for the /shows route and shared labels
 * used by individual event pages.
 */
export const showsPage = defineType({
  name: 'showsPage',
  title: 'Shows Page',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'gallery', title: 'Performance Gallery'},
    {name: 'upcoming', title: 'Upcoming Shows'},
    {name: 'eventDetail', title: 'Event Detail Labels'},
    {name: 'fallback', title: 'Fallbacks'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // === HERO ===
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Big headline at the top of the page (e.g., "Live Shows").',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      description: 'Short tagline below the headline.',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image (Desktop)',
      type: 'image',
      description: 'Background image used on desktop. Recommended: 1920×1080 or larger.',
      group: 'hero',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers.',
        }),
        ...imagePositionFields,
      ],
    }),
    defineField({
      name: 'heroMobileImage',
      title: 'Hero Background Image (Mobile, optional)',
      type: 'image',
      description: 'A separate mobile-friendly image. If empty, the desktop image is used.',
      group: 'hero',
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

    // === PERFORMANCE GALLERY ===
    defineField({
      name: 'performanceGalleryHeading',
      title: 'Gallery Heading',
      type: 'string',
      description: 'Heading above the performance photo grid.',
      group: 'gallery',
    }),
    defineField({
      name: 'performanceGallerySubheading',
      title: 'Gallery Subheading',
      type: 'string',
      description: 'Optional one-line subheading.',
      group: 'gallery',
    }),
    defineField({
      name: 'performanceImages',
      title: 'Gallery Images',
      type: 'array',
      description: 'Photos shown in the gallery grid. Recommended: 6 images.',
      group: 'gallery',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'performanceImage',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for screen readers.',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Short caption shown over the image.',
            }),
            ...imagePositionFields,
          ],
          preview: {
            select: {title: 'caption', subtitle: 'alt', media: 'image'},
          },
        }),
      ],
    }),

    // === UPCOMING SHOWS ===
    defineField({
      name: 'upcomingShowsHeading',
      title: 'Upcoming Shows Heading',
      type: 'string',
      description: 'Heading above the list of upcoming shows.',
      group: 'upcoming',
    }),
    defineField({
      name: 'pastShowsHeading',
      title: 'Past Shows Heading',
      type: 'string',
      description: 'Heading above the list of past shows.',
      initialValue: 'Past Shows',
      group: 'upcoming',
    }),
    defineField({
      name: 'emptyStateHeading',
      title: 'Empty State — Heading',
      type: 'string',
      description: 'Shown when there are no upcoming shows.',
      group: 'upcoming',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Empty State — Message',
      type: 'text',
      description: 'Friendly note shown when no shows are scheduled.',
      group: 'upcoming',
    }),
    defineField({
      name: 'showCountPrefix',
      title: 'Show Count Prefix',
      type: 'string',
      description: 'Text before the count (e.g., " upcoming"). Note the leading space.',
      initialValue: ' upcoming',
      group: 'upcoming',
    }),
    defineField({
      name: 'showSingular',
      title: 'Show — Singular',
      type: 'string',
      description: 'Used when count is 1 (e.g., "show").',
      initialValue: 'show',
      group: 'upcoming',
    }),
    defineField({
      name: 'showPlural',
      title: 'Show — Plural',
      type: 'string',
      description: 'Used when count is 2+ (e.g., "shows").',
      initialValue: 'shows',
      group: 'upcoming',
    }),
    defineField({
      name: 'statsLabel1',
      title: 'Stats Label — 1',
      type: 'string',
      initialValue: 'Upcoming Shows',
      group: 'upcoming',
    }),
    defineField({
      name: 'statsLabel2',
      title: 'Stats Label — 2',
      type: 'string',
      initialValue: 'Live Blues',
      group: 'upcoming',
    }),
    defineField({
      name: 'statsLabel3',
      title: 'Stats Label — 3',
      type: 'string',
      initialValue: 'Pacific Northwest',
      group: 'upcoming',
    }),

    // === EVENT DETAIL LABELS ===
    defineField({
      name: 'eventDetailsLabel',
      title: 'Event Details Label',
      type: 'string',
      initialValue: 'Event Details',
      group: 'eventDetail',
    }),
    defineField({
      name: 'lineupHeading',
      title: 'Lineup Heading',
      type: 'string',
      description: 'Heading on the event detail page when an event has a lineup of performers.',
      initialValue: 'Lineup',
      group: 'eventDetail',
    }),
    defineField({
      name: 'dateTimeLabel',
      title: 'Date & Time Label',
      type: 'string',
      initialValue: 'Date & Time',
      group: 'eventDetail',
    }),
    defineField({
      name: 'venueLabel',
      title: 'Venue Label',
      type: 'string',
      initialValue: 'Venue',
      group: 'eventDetail',
    }),
    defineField({
      name: 'viewOnMapText',
      title: 'View on Map Link Text',
      type: 'string',
      initialValue: 'View on Map',
      group: 'eventDetail',
    }),
    defineField({
      name: 'getTicketsText',
      title: 'Get Tickets Button Text',
      type: 'string',
      initialValue: 'Get Tickets',
      group: 'eventDetail',
    }),
    defineField({
      name: 'soldOutText',
      title: 'Sold Out Button Text',
      type: 'string',
      initialValue: 'Sold Out',
      group: 'eventDetail',
    }),
    defineField({
      name: 'backToShowsText',
      title: 'Back-to-Shows Link Text',
      type: 'string',
      initialValue: 'Back to All Shows',
      group: 'eventDetail',
    }),
    defineField({
      name: 'shareEventText',
      title: 'Share Event Text',
      type: 'string',
      initialValue: 'Share Event',
      group: 'eventDetail',
    }),
    defineField({
      name: 'importantInfoText',
      title: 'Important Info Heading',
      type: 'string',
      initialValue: 'Important Information',
      group: 'eventDetail',
    }),
    defineField({
      name: 'canceledBadgeText',
      title: 'Canceled Badge Text',
      type: 'string',
      initialValue: 'CANCELED',
      group: 'eventDetail',
    }),
    defineField({
      name: 'soldOutBadgeText',
      title: 'Sold Out Badge Text',
      type: 'string',
      initialValue: 'SOLD OUT',
      group: 'eventDetail',
    }),
    defineField({
      name: 'canceledMessageText',
      title: 'Canceled Event Message',
      type: 'string',
      initialValue: 'This event has been canceled',
      group: 'eventDetail',
    }),

    // === FALLBACKS ===
    defineField({
      name: 'defaultEventImage',
      title: 'Default Event Image',
      type: 'image',
      description: 'Used as the cover image for events that don\'t have their own.',
      group: 'fallback',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),

    ...seoFieldsInGroup('seo'),
  ],
  preview: {
    prepare() {
      return {title: 'Shows Page', subtitle: 'Live shows and events'}
    },
  },
})
