import {BookIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFields} from '@/sanity/lib/schema-fields'

/**
 * Lessons Page singleton schema
 */

export const lessonsPage = defineType({
  name: 'lessonsPage',
  title: 'Lessons Page',
  type: 'document',
  icon: BookIcon,
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
              initialValue: 'Kivett Bednar teaching guitar',        }),
        ...imagePositionFields,
      ],
    }),

    // Stats Banner (editable counters)
    defineField({
      name: 'stats',
      title: 'Stats Banner',
      type: 'array',
      description: 'Editable stats shown in the credentials banner (e.g., "20+ Years Experience")',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Years Experience", "Students Taught"',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g., "20", "500", "All"',
            }),
            defineField({
              name: 'suffix',
              title: 'Suffix',
              type: 'string',
              description: 'e.g., "+" (appears after the number)',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              value: 'value',
              suffix: 'suffix',
            },
            prepare({title, value, suffix}) {
              return {
                title: title || 'Stat',
                subtitle: `${value || ''}${suffix || ''}`,
              }
            },
          },
        }),
      ],
    }),

    // Teaching Philosophy Section
    defineField({
      name: 'philosophyHeading',
      title: 'Philosophy/Approach Heading',
      type: 'string',
      description: 'Heading for the teaching philosophy section',    }),
    defineField({
      name: 'philosophyText',
      title: 'Philosophy/Approach Text',
      type: 'text',
      rows: 4,
      description: 'Description of teaching approach',    }),
    defineField({
      name: 'philosophyImage',
      title: 'Philosophy Section Image',
      type: 'image',
      description: 'Image for teaching philosophy section',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
              initialValue: 'Kivett Bednar teaching guitar',        }),
        ...imagePositionFields,
      ],
    }),

    // Learning Items Section
    defineField({
      name: 'learningItemsHeading',
      title: 'Learning Items Section Heading',
      type: 'string',
      description: 'Heading for the "What You\'ll Learn" section',    }),
    defineField({
      name: 'learningItems',
      title: 'What You\'ll Learn',
      type: 'array',
      description: 'Grid of learning topics/skills',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'learningItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ctaBoxHeading',
      title: 'CTA Box Heading',
      type: 'string',
      description: 'Heading for the call-to-action box',    }),
    defineField({
      name: 'ctaBoxText',
      title: 'CTA Box Text',
      type: 'text',
      rows: 2,
      description: 'Text in the CTA box',    }),
    defineField({
      name: 'credentials',
      title: 'Credentials/Experience',
      type: 'text',
      rows: 2,
      description: 'Teaching credentials (e.g., "Twenty years teaching experience. Berklee graduate.")',
    }),

    // Performance/Teaching Images
    defineField({
      name: 'teachingImage',
      title: 'Teaching Image',
      type: 'image',
      description: 'Image showing teaching or playing',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
              initialValue: 'Kivett Bednar teaching guitar',        }),
        ...imagePositionFields,
      ],
    }),
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
              initialValue: 'Kivett Bednar teaching guitar',        }),
        ...imagePositionFields,
      ],
    }),

    // Button Labels
    defineField({
      name: 'emailButtonText',
      title: 'Email Button Text',
      type: 'string',
      description: 'Text for email button in CTA box',
      initialValue: 'Email Me',
    }),
    defineField({
      name: 'scheduleButtonText',
      title: 'Schedule Button Text',
      type: 'string',
      description: 'Text for schedule button in CTA box',
      initialValue: 'Schedule a Lesson',
    }),

    // Testimonial Quote Section
    defineField({
      name: 'testimonialQuote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 3,
      description: 'Quote displayed at the bottom of the lessons page',
      initialValue: "Music isn't just about the notes you play — it's about the story you tell and the feeling you share.",
    }),
    defineField({
      name: 'testimonialAttribution',
      title: 'Quote Attribution',
      type: 'string',
      description: 'Who the quote is attributed to',
      initialValue: 'Kivett Bednar',
    }),
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {
        title: 'Lessons Page',
      }
    },
  },
})
