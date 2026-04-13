import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'

/**
 * Event schema for concerts and performances
 * Includes timezone handling for accurate display across regions
 * Supports individual event pages with hero images and rich content
 */
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Event Details', default: true},
    {name: 'location', title: 'Location'},
    {name: 'images', title: 'Images'},
    {name: 'content', title: 'Page Content'},
    {name: 'status', title: 'Status'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required().error('Event title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for the event page (auto-generated from title)',
      group: 'details',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required().error('Slug is required for event URLs'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'details',
      description: 'Brief summary for event cards and previews',
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      group: 'details',
      validation: (rule) => rule.required().error('Start date & time is required'),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
      group: 'details',
      description: 'Optional end time if different from start',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (Rule) =>
        Rule.custom((endDateTime, context) => {
          const start = context.document?.startDateTime as string | undefined
          if (!endDateTime || !start) return true
          return new Date(endDateTime) > new Date(start)
            ? true
            : 'End date must be after start date'
        }),
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      group: 'details',
      description: 'Used to display correct show times across regions.',
      initialValue: 'America/Los_Angeles',
      options: {
        list: [
          {title: 'Pacific (Los Angeles, Portland, Seattle)', value: 'America/Los_Angeles'},
          {title: 'Mountain (Denver, Salt Lake City)', value: 'America/Denver'},
          {title: 'Mountain — Phoenix (no DST)', value: 'America/Phoenix'},
          {title: 'Central (Austin, Chicago, Nashville)', value: 'America/Chicago'},
          {title: 'Eastern (New York, Atlanta, Miami)', value: 'America/New_York'},
          {title: 'Alaska (Anchorage)', value: 'America/Anchorage'},
          {title: 'Hawaii (Honolulu)', value: 'Pacific/Honolulu'},
          {title: 'UK (London)', value: 'Europe/London'},
          {title: 'Central European (Paris, Berlin, Madrid)', value: 'Europe/Paris'},
          {title: 'UTC', value: 'UTC'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'venue',
      title: 'Venue Name',
      type: 'string',
      group: 'location',
      validation: (rule) => rule.required().error('Venue name is required'),
    }),
    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'location',
      validation: (rule) => rule.required().error('City is required'),
    }),
    defineField({
      name: 'state',
      title: 'State/Province',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'location',
      initialValue: 'USA',    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      group: 'details',
      description: 'Link to purchase tickets',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'images',
      description: 'Image used for event cards and listings',
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
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Desktop)',
      type: 'image',
      group: 'images',
      description: 'Large hero image for the event detail page (desktop)',
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
    defineField({
      name: 'heroImageMobile',
      title: 'Hero Image (Mobile)',
      type: 'image',
      group: 'images',
      description: 'Optional separate hero image for mobile devices',
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
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      group: 'content',
      description: 'Rich content for the event detail page',
    }),
    defineField({
      name: 'lineup',
      title: 'Lineup / Special Guests',
      type: 'array',
      group: 'content',
      description: 'Featured performers and special guests',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'e.g., "Headliner", "Support", "Special Guest"',
            }),
            defineField({
              name: 'bio',
              title: 'Bio',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              name: 'name',
              role: 'role',
            },
            prepare({name, role}) {
              return {
                title: name,
                subtitle: role,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'specialNotes',
      title: 'Special Notes',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Important information about the event (age restrictions, parking, etc.)',
    }),
    defineField({
      name: 'isCanceled',
      title: 'Event Canceled',
      type: 'boolean',
      group: 'status',
      description: 'Shows a "CANCELED" badge and greys out the event.',
      initialValue: false,
    }),
    defineField({
      name: 'isSoldOut',
      title: 'Sold Out',
      type: 'boolean',
      group: 'status',
      description: 'Shows a "SOLD OUT" badge on the event card.',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides the page title. Falls back to Event Title + venue.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Overrides the meta description. Falls back to the event excerpt.',
    }),
  ],
  orderings: [
    {
      title: 'Event Date, Newest',
      name: 'startDateTimeDesc',
      by: [{field: 'startDateTime', direction: 'desc'}],
    },
    {
      title: 'Event Date, Oldest',
      name: 'startDateTimeAsc',
      by: [{field: 'startDateTime', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue',
      city: 'city',
      startDateTime: 'startDateTime',
      isCanceled: 'isCanceled',
      isSoldOut: 'isSoldOut',
      media: 'coverImage',
    },
    prepare({title, venue, city, startDateTime, isCanceled, isSoldOut, media}) {
      const date = startDateTime ? new Date(startDateTime).toLocaleDateString() : ''
      const status = isCanceled ? '[CANCELED] ' : isSoldOut ? '[SOLD OUT] ' : ''
      return {
        title: `${status}${title}`,
        subtitle: `${venue}, ${city} • ${date}`,
        media,
      }
    },
  },
})
