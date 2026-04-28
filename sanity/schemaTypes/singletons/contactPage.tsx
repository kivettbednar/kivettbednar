import {EnvelopeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFieldsInGroup} from '@/sanity/lib/schema-fields'

/**
 * Contact Page singleton — content for the /contact route.
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'portraits', title: 'Portraits'},
    {name: 'cards', title: 'Connect Cards'},
    {name: 'sections', title: 'Section Headings'},
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
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
      description: 'Short tagline below the headline.',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Large background image behind the hero text.',
      group: 'hero',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers.',
          initialValue: 'Kivett Bednar',
        }),
        ...imagePositionFields,
      ],
    }),

    // === PORTRAITS ===
    defineField({
      name: 'portraitImage',
      title: 'Main Portrait Image',
      type: 'image',
      description: 'The primary portrait shown on the Contact page.',
      group: 'portraits',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Kivett Bednar',
        }),
        ...imagePositionFields,
      ],
    }),
    defineField({
      name: 'portraitGallery',
      title: 'Portrait Gallery',
      type: 'array',
      description: 'Optional secondary photos shown alongside the main portrait.',
      group: 'portraits',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'portraitGalleryImage',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  initialValue: 'Kivett Bednar',
                }),
                ...imagePositionFields,
              ],
            }),
          ],
          preview: {
            select: {title: 'image.alt', media: 'image'},
          },
        }),
      ],
    }),

    // === CARDS ===
    defineField({
      name: 'connectHeading',
      title: 'Connect Section Heading',
      type: 'string',
      description: 'Heading above the three connect cards.',
      initialValue: "Let's Connect",
      group: 'cards',
    }),
    defineField({
      name: 'bookingCardTitle',
      title: 'Booking Card — Title',
      type: 'string',
      initialValue: 'Book a Show',
      group: 'cards',
    }),
    defineField({
      name: 'bookingCardDescription',
      title: 'Booking Card — Description',
      type: 'text',
      rows: 2,
      initialValue: 'Looking for live blues at your venue or private event? Check out upcoming shows or reach out to discuss booking.',
      group: 'cards',
    }),
    defineField({
      name: 'bookingCardLinkText',
      title: 'Booking Card — Link Text',
      type: 'string',
      initialValue: 'View Shows →',
      group: 'cards',
    }),
    defineField({
      name: 'lessonsCardTitle',
      title: 'Lessons Card — Title',
      type: 'string',
      initialValue: 'Guitar Lessons',
      group: 'cards',
    }),
    defineField({
      name: 'lessonsCardDescription',
      title: 'Lessons Card — Description',
      type: 'text',
      rows: 2,
      initialValue: 'Learn blues guitar from decades of experience. All skill levels welcome — from beginners to advanced players.',
      group: 'cards',
    }),
    defineField({
      name: 'lessonsCardLinkText',
      title: 'Lessons Card — Link Text',
      type: 'string',
      initialValue: 'Learn More →',
      group: 'cards',
    }),
    defineField({
      name: 'locationCardTitle',
      title: 'Location Card — Title',
      type: 'string',
      initialValue: 'Based In',
      group: 'cards',
    }),
    defineField({
      name: 'locationCardRegion',
      title: 'Location Card — Region',
      type: 'string',
      description: 'The region name shown prominently on the card.',
      initialValue: 'Pacific Northwest',
      group: 'cards',
    }),
    defineField({
      name: 'locationCardDescription',
      title: 'Location Card — Description',
      type: 'text',
      rows: 2,
      initialValue: 'Gritty Texas Blues meets the heart of the Pacific Northwest. Available for shows and events throughout the region.',
      group: 'cards',
    }),
    defineField({
      name: 'locationCardLinkText',
      title: 'Location Card — Link Text',
      type: 'string',
      initialValue: 'View on Map →',
      group: 'cards',
    }),
    defineField({
      name: 'locationMapQuery',
      title: 'Location Map Search',
      type: 'string',
      description: 'Google Maps search term used by the "View on Map" link (e.g., "Portland Oregon").',
      initialValue: 'Portland Oregon',
      group: 'cards',
    }),

    // === SECTION HEADINGS ===
    defineField({
      name: 'formHeading',
      title: 'Contact Form Heading',
      type: 'string',
      description: 'Big heading above the contact form (e.g., "Send a Message").',
      initialValue: 'Send a Message',
      group: 'sections',
    }),
    defineField({
      name: 'formSubheading',
      title: 'Contact Form Subheading',
      type: 'string',
      description: 'Short line below the form heading.',
      initialValue: 'Have a question or want to get in touch? Fill out the form below.',
      group: 'sections',
    }),
    defineField({
      name: 'directContactHeading',
      title: 'Direct Contact Heading',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'directContactDescription',
      title: 'Direct Contact Description',
      type: 'text',
      rows: 2,
      initialValue: 'For booking inquiries, press questions, or guitar lessons, reach out directly:',
      group: 'sections',
    }),
    defineField({
      name: 'socialHeading',
      title: 'Social Links Heading',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'socialSubheading',
      title: 'Social Links Subheading',
      type: 'string',
      initialValue: 'Stay connected for show updates, behind-the-scenes content, and more',
      group: 'sections',
    }),
    defineField({
      name: 'quickLinksHeading',
      title: 'Quick Links Heading',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'quickLinkShowsText',
      title: 'Quick Link — Shows',
      type: 'string',
      initialValue: 'Upcoming Shows',
      group: 'sections',
    }),
    defineField({
      name: 'quickLinkLessonsText',
      title: 'Quick Link — Lessons',
      type: 'string',
      initialValue: 'Guitar Lessons',
      group: 'sections',
    }),
    defineField({
      name: 'quickLinkSetlistText',
      title: 'Quick Link — Setlist',
      type: 'string',
      initialValue: 'Blues Setlist',
      group: 'sections',
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Section Heading',
      type: 'string',
      group: 'sections',
    }),

    // === CTA ===
    defineField({
      name: 'ctaSectionHeading',
      title: 'CTA Heading',
      type: 'string',
      initialValue: 'Looking for Live Blues?',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSectionText',
      title: 'CTA Body Text',
      type: 'text',
      rows: 2,
      initialValue: 'Check out upcoming performances and get your tickets before they sell out.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSectionButtonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'See Upcoming Shows',
      group: 'cta',
    }),

    ...seoFieldsInGroup('seo'),
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
