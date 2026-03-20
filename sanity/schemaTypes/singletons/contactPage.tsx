import {EnvelopeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFields} from '@/sanity/lib/schema-fields'

/**
 * Contact Page singleton schema
 */

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    // Hero Section
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
    }),
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
          initialValue: 'Kivett Bednar',
        }),
        ...imagePositionFields,
      ],
    }),

    // Portrait Section
    defineField({
      name: 'portraitImage',
      title: 'Main Portrait Image',
      type: 'image',
      description: 'Primary portrait photo',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
              initialValue: 'Kivett Bednar',        }),
        ...imagePositionFields,
      ],
    }),
    defineField({
      name: 'portraitGallery',
      title: 'Portrait Gallery',
      type: 'array',
      description: 'Additional portrait/performance images',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'portraitGalleryImage',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
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
            select: {
              title: 'image.alt',
              media: 'image',
            },
          },
        }),
      ],
    }),

    // Connect Section
    defineField({
      name: 'connectHeading',
      title: 'Connect Section Heading',
      type: 'string',
      description: 'Heading for the contact cards section (e.g., "Let\'s Connect")',
      initialValue: "Let's Connect",
    }),

    // Booking Card
    defineField({
      name: 'bookingCardTitle',
      title: 'Booking Card Title',
      type: 'string',
      description: 'Title for the booking card',
      initialValue: 'Book a Show',
    }),
    defineField({
      name: 'bookingCardDescription',
      title: 'Booking Card Description',
      type: 'text',
      rows: 2,
      description: 'Description text for booking card',
      initialValue: 'Looking for live blues at your venue or private event? Check out upcoming shows or reach out to discuss booking.',
    }),
    defineField({
      name: 'bookingCardLinkText',
      title: 'Booking Card Link Text',
      type: 'string',
      description: 'Link text for booking card',
      initialValue: 'View Shows →',
    }),

    // Lessons Card
    defineField({
      name: 'lessonsCardTitle',
      title: 'Lessons Card Title',
      type: 'string',
      description: 'Title for the lessons card',
      initialValue: 'Guitar Lessons',
    }),
    defineField({
      name: 'lessonsCardDescription',
      title: 'Lessons Card Description',
      type: 'text',
      rows: 2,
      description: 'Description text for lessons card',
      initialValue: 'Learn blues guitar from decades of experience. All skill levels welcome — from beginners to advanced players.',
    }),
    defineField({
      name: 'lessonsCardLinkText',
      title: 'Lessons Card Link Text',
      type: 'string',
      description: 'Link text for lessons card',
      initialValue: 'Learn More →',
    }),

    // Location Card
    defineField({
      name: 'locationCardTitle',
      title: 'Location Card Title',
      type: 'string',
      description: 'Title for the location card',
      initialValue: 'Based In',
    }),
    defineField({
      name: 'locationCardRegion',
      title: 'Location Card Region',
      type: 'string',
      description: 'Region name displayed prominently',
      initialValue: 'Pacific Northwest',
    }),
    defineField({
      name: 'locationCardDescription',
      title: 'Location Card Description',
      type: 'text',
      rows: 2,
      description: 'Description text for location card',
      initialValue: 'Gritty Texas Blues meets the heart of the Pacific Northwest. Available for shows and events throughout the region.',
    }),
    defineField({
      name: 'locationCardLinkText',
      title: 'Location Card Link Text',
      type: 'string',
      description: 'Link text for location card',
      initialValue: 'View on Map →',
    }),

    // Social Section
    defineField({
      name: 'socialSubheading',
      title: 'Social Section Subheading',
      type: 'string',
      description: 'Subtitle under social section heading',
      initialValue: 'Stay connected for show updates, behind-the-scenes content, and more',
    }),

    // Section Headings
    defineField({
      name: 'formHeading',
      title: 'Contact Form Heading',
      type: 'string',
      description: 'Heading for the contact form section',
    }),
    defineField({
      name: 'directContactHeading',
      title: 'Direct Contact Heading',
      type: 'string',
      description: 'Heading for direct contact info section',
    }),
    defineField({
      name: 'directContactDescription',
      title: 'Direct Contact Description',
      type: 'text',
      rows: 2,
      description: 'Description text for direct contact section',
      initialValue: 'For booking inquiries, press questions, or guitar lessons, reach out directly:',
    }),
    defineField({
      name: 'socialHeading',
      title: 'Social Links Heading',
      type: 'string',
      description: 'Heading for social media links',
    }),
    defineField({
      name: 'quickLinksHeading',
      title: 'Quick Links Heading',
      type: 'string',
      description: 'Heading for quick navigation links',
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Section Heading',
      type: 'string',
      description: 'Heading for about/bio section',
    }),

    // Quick Links Labels
    defineField({
      name: 'quickLinkShowsText',
      title: 'Quick Link: Shows Text',
      type: 'string',
      description: 'Text for "Upcoming Shows" quick link',
      initialValue: 'Upcoming Shows',
    }),
    defineField({
      name: 'quickLinkLessonsText',
      title: 'Quick Link: Lessons Text',
      type: 'string',
      description: 'Text for "Guitar Lessons" quick link',
      initialValue: 'Guitar Lessons',
    }),
    defineField({
      name: 'quickLinkSetlistText',
      title: 'Quick Link: Setlist Text',
      type: 'string',
      description: 'Text for "Blues Setlist" quick link',
      initialValue: 'Blues Setlist',
    }),

    // CTA Section
    defineField({
      name: 'ctaSectionHeading',
      title: 'CTA Section Heading',
      type: 'string',
      description: 'Heading for "Looking for Live Blues?" CTA section',
      initialValue: 'Looking for Live Blues?',
    }),
    defineField({
      name: 'ctaSectionText',
      title: 'CTA Section Text',
      type: 'text',
      rows: 2,
      description: 'Description text for shows CTA section',
      initialValue: 'Check out upcoming performances and get your tickets before they sell out.',
    }),
    defineField({
      name: 'ctaSectionButtonText',
      title: 'CTA Section Button Text',
      type: 'string',
      description: 'Button text for shows CTA',
      initialValue: 'See Upcoming Shows',
    }),
    defineField({
      name: 'locationMapQuery',
      title: 'Location Map Query',
      type: 'string',
      description: 'Google Maps search query for "Based In" card (e.g., "Portland Oregon")',
      initialValue: 'Portland Oregon',
    }),
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
      }
    },
  },
})
