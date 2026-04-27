import {BookIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'
import {seoFieldsInGroup} from '@/sanity/lib/schema-fields'

/**
 * Lessons Page singleton — content for the /lessons route.
 */
export const lessonsPage = defineType({
  name: 'lessonsPage',
  title: 'Lessons Page',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'stats', title: 'Stats Banner'},
    {name: 'philosophy', title: 'Teaching Philosophy'},
    {name: 'curriculum', title: "What You'll Learn"},
    {name: 'cta', title: 'Call to Action'},
    {name: 'imagery', title: 'Photos'},
    {name: 'testimonial', title: 'Testimonial'},
    {name: 'packages', title: 'Packages'},
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
      description: 'Background image used behind the hero.',
      group: 'hero',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Kivett Bednar teaching guitar',
        }),
        ...imagePositionFields,
      ],
    }),

    // === STATS ===
    defineField({
      name: 'stats',
      title: 'Stats Banner',
      type: 'array',
      description: 'Editable counters in the credentials banner. Each item shows as: VALUE+SUFFIX over LABEL (e.g., "20+ Years Experience").',
      group: 'stats',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Text shown below the number (e.g., "Years Experience").',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The big text (e.g., "20", "500", "All").',
            }),
            defineField({
              name: 'suffix',
              title: 'Suffix',
              type: 'string',
              description: 'Optional character appended to the value (e.g., "+").',
            }),
          ],
          preview: {
            select: {title: 'label', value: 'value', suffix: 'suffix'},
            prepare({title, value, suffix}) {
              return {title: title || 'Stat', subtitle: `${value || ''}${suffix || ''}`}
            },
          },
        }),
      ],
    }),

    // === PHILOSOPHY ===
    defineField({
      name: 'philosophyHeading',
      title: 'Section Heading',
      type: 'string',
      description: 'Heading above the philosophy paragraph.',
      group: 'philosophy',
    }),
    defineField({
      name: 'philosophyText',
      title: 'Philosophy Text',
      type: 'text',
      rows: 4,
      description: 'A paragraph or two on your teaching approach.',
      group: 'philosophy',
    }),
    defineField({
      name: 'philosophyImage',
      title: 'Section Image',
      type: 'image',
      description: 'Photo shown alongside the philosophy text.',
      group: 'philosophy',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Kivett Bednar teaching guitar',
        }),
        ...imagePositionFields,
      ],
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'text',
      rows: 2,
      description: 'Short list of teaching credentials (e.g., "Twenty years teaching experience. Berklee graduate.").',
      group: 'philosophy',
    }),

    // === CURRICULUM ===
    defineField({
      name: 'learningItemsHeading',
      title: 'Section Heading',
      type: 'string',
      description: 'Heading above the curriculum grid (e.g., "What You\'ll Learn").',
      group: 'curriculum',
    }),
    defineField({
      name: 'learningItems',
      title: 'Learning Items',
      type: 'array',
      description: 'Topics or skills covered. Each item shows as a card.',
      group: 'curriculum',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'learningItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
    }),

    // === CTA ===
    defineField({
      name: 'ctaBoxHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'Heading on the call-to-action box.',
      group: 'cta',
    }),
    defineField({
      name: 'ctaBoxText',
      title: 'CTA Text',
      type: 'text',
      rows: 2,
      description: 'Body text on the call-to-action box.',
      group: 'cta',
    }),
    defineField({
      name: 'emailButtonText',
      title: 'Email Button Text',
      type: 'string',
      initialValue: 'Email Me',
      group: 'cta',
    }),
    defineField({
      name: 'scheduleButtonText',
      title: 'Schedule Button Text',
      type: 'string',
      initialValue: 'Schedule a Lesson',
      group: 'cta',
    }),

    // === IMAGERY ===
    defineField({
      name: 'teachingImage',
      title: 'Teaching Image',
      type: 'image',
      description: 'A teaching or playing photo for visual interest.',
      group: 'imagery',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Kivett Bednar teaching guitar',
        }),
        ...imagePositionFields,
      ],
    }),
    defineField({
      name: 'performanceImage',
      title: 'Performance Image',
      type: 'image',
      description: 'A performance photo for visual interest.',
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

    // === TESTIMONIAL ===
    defineField({
      name: 'testimonialQuote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      description: 'A short quote shown near the bottom of the page.',
      initialValue: "Music isn't just about the notes you play — it's about the story you tell and the feeling you share.",
      group: 'testimonial',
    }),
    defineField({
      name: 'testimonialAttribution',
      title: 'Attribution',
      type: 'string',
      description: 'Who the quote is from.',
      initialValue: 'Kivett Bednar',
      group: 'testimonial',
    }),

    // === PACKAGES ===
    defineField({
      name: 'packagesHeading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Lesson Packages',
      group: 'packages',
    }),
    defineField({
      name: 'packagesSubheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Choose the package that fits your goals and schedule.',
      group: 'packages',
    }),
    defineField({
      name: 'packagesCtaText',
      title: 'Package CTA Button Text',
      type: 'string',
      description: 'Text on each package\'s booking button.',
      initialValue: 'Book This Package',
      group: 'packages',
    }),

    ...seoFieldsInGroup('seo'),
  ],
  preview: {
    prepare() {
      return {title: 'Lessons Page'}
    },
  },
})
