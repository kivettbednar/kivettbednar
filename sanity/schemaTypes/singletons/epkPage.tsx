import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const epkPage = defineType({
  name: 'epkPage',
  title: 'EPK (Press Kit)',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'display', title: 'Display', default: true},
    {name: 'bio', title: 'Bio'},
    {name: 'contact', title: 'Booking Contact'},
    {name: 'photos', title: 'Press Photos'},
    {name: 'videos', title: 'Videos'},
    {name: 'quotes', title: 'Press Quotes'},
    {name: 'shows', title: 'Notable Shows'},
    {name: 'tech', title: 'Tech (PDFs)'},
    {name: 'downloads', title: 'Downloads'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // === DISPLAY ===
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
      group: 'display',
    }),
    defineField({
      name: 'pageIntro',
      title: 'Page Intro',
      type: 'text',
      rows: 3,
      description: 'Brief intro paragraph at the top of the EPK',
      group: 'display',
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{type: 'string'}],
      description: 'e.g., Blues, Rock, Soul',
      options: {layout: 'tags'},
      group: 'display',
    }),
    defineField({
      name: 'influencedBy',
      title: 'Influenced By',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Artists that influenced this work',
      options: {layout: 'tags'},
      group: 'display',
    }),

    // === BIO ===
    defineField({
      name: 'shortBio',
      title: 'Short Bio (50 words)',
      type: 'text',
      rows: 4,
      description: 'One-paragraph version for quick use in press releases',
      group: 'bio',
    }),
    defineField({
      name: 'longBio',
      title: 'Long Bio',
      type: 'blockContent',
      description: 'Full bio for publication',
      group: 'bio',
    }),

    // === CONTACT ===
    defineField({
      name: 'bookingContactName',
      title: 'Booking Contact Name',
      type: 'string',
      description: 'Agent or manager name (or artist name for self-booking)',
      group: 'contact',
    }),
    defineField({
      name: 'bookingContactEmail',
      title: 'Booking Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
      group: 'contact',
    }),
    defineField({
      name: 'bookingContactPhone',
      title: 'Booking Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'bookingNotes',
      title: 'Booking Notes',
      type: 'text',
      rows: 3,
      description: 'Availability, travel radius, special requirements, etc.',
      group: 'contact',
    }),

    // === PHOTOS ===
    defineField({
      name: 'pressPhotos',
      title: 'Press Photos',
      type: 'array',
      description: 'High-resolution photos for press use. Each gets a download button automatically.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
            defineField({name: 'credit', title: 'Photo Credit', type: 'string'}),
          ],
        }),
      ],
      group: 'photos',
    }),

    // === VIDEOS ===
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'epkVideo',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'YouTube or Vimeo URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'url'},
          },
        }),
      ],
      group: 'videos',
    }),

    // === PRESS QUOTES ===
    defineField({
      name: 'pressQuotes',
      title: 'Press Quotes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pressQuote',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'source',
              title: 'Source',
              type: 'string',
              description: 'Publication or person (e.g., "Rolling Stone", "John Smith, Venue Owner")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sourceUrl',
              title: 'Source URL',
              type: 'url',
              description: 'Optional link to the original article/review',
            }),
            defineField({
              name: 'logo',
              title: 'Publication Logo',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
            }),
          ],
          preview: {
            select: {title: 'source', subtitle: 'quote'},
          },
        }),
      ],
      group: 'quotes',
    }),

    // === NOTABLE SHOWS ===
    defineField({
      name: 'notableShows',
      title: 'Notable Performances',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'notableShow',
          fields: [
            defineField({name: 'venue', title: 'Venue', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'city', title: 'City', type: 'string'}),
            defineField({name: 'date', title: 'Date', type: 'date'}),
            defineField({name: 'event', title: 'Event/Festival Name', type: 'string', description: 'Optional festival or special event name'}),
          ],
          preview: {
            select: {title: 'venue', subtitle: 'city'},
          },
        }),
      ],
      group: 'shows',
    }),

    // === TECH ===
    defineField({
      name: 'stagePlotPdf',
      title: 'Stage Plot (PDF)',
      type: 'file',
      options: {accept: 'application/pdf'},
      group: 'tech',
    }),
    defineField({
      name: 'techRiderPdf',
      title: 'Tech Rider (PDF)',
      type: 'file',
      options: {accept: 'application/pdf'},
      group: 'tech',
    }),

    // === DOWNLOADS ===
    defineField({
      name: 'fullPressKitPdf',
      title: 'Full Press Kit (PDF)',
      type: 'file',
      description: 'All-in-one downloadable press kit PDF',
      options: {accept: 'application/pdf'},
      group: 'downloads',
    }),
    defineField({
      name: 'onesheet',
      title: 'One-Sheet (PDF)',
      type: 'file',
      description: 'Optional single-page summary',
      options: {accept: 'application/pdf'},
      group: 'downloads',
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
      return {title: 'EPK (Press Kit)'}
    },
  },
})
