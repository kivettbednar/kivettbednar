import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Page Name',
      type: 'string',
      description: 'Internal name used in navigation and the browser tab (e.g., "About")',
      validation: (Rule) => Rule.required().min(2),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      description: 'The large heading displayed on the page itself (can differ from the page name)',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'modules',
      title: 'Page Modules',
      type: 'array',
      of: [
        {type: 'hero'},
        {type: 'richText'},
        {type: 'imageGallery'},
        {type: 'featureGrid'},
        {type: 'ctaBanner'},
        {type: 'videoEmbed'},
        {type: 'musicEmbed'},
        {type: 'callToAction'},
        {type: 'infoSection'},
        {type: 'testimonials'},
        {type: 'faq'},
      ],
      // Insert menu with dynamic SVG thumbnails to work in embedded Studio
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName: string) => {
                const label = (schemaTypeName || '').toUpperCase()
                const base = `<rect width='100%' height='100%' rx='8' fill='%23f4f4f5'/>`
                const text = `<text x='50%' y='90%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2337373d'>${label}</text>`
                let graphic = ''
                switch (schemaTypeName) {
                  case 'hero':
                    graphic = `<rect x='16' y='16' width='208' height='72' rx='6' fill='%23e7e7ea'/><rect x='28' y='28' width='120' height='10' rx='4' fill='%2337373d'/><rect x='28' y='46' width='160' height='8' rx='4' fill='%235b5b62'/>`
                    break
                  case 'richText':
                    graphic = `<rect x='28' y='24' width='184' height='8' rx='4' fill='%2337373d'/><rect x='28' y='40' width='160' height='8' rx='4' fill='%235b5b62'/><rect x='28' y='56' width='172' height='8' rx='4' fill='%235b5b62'/>`
                    break
                  case 'imageGallery':
                    graphic = `<rect x='24' y='24' width='60' height='40' rx='4' fill='%23e7e7ea'/><rect x='92' y='24' width='60' height='40' rx='4' fill='%23e7e7ea'/><rect x='160' y='24' width='60' height='40' rx='4' fill='%23e7e7ea'/>`
                    break
                  case 'featureGrid':
                    graphic = `<circle cx='48' cy='42' r='14' fill='%23e7e7ea'/><circle cx='120' cy='42' r='14' fill='%23e7e7ea'/><circle cx='192' cy='42' r='14' fill='%23e7e7ea'/>`
                    break
                  case 'ctaBanner':
                    graphic = `<rect x='40' y='34' width='160' height='20' rx='10' fill='%2337373d'/>`
                    break
                  case 'videoEmbed':
                    graphic = `<rect x='24' y='24' width='192' height='72' rx='6' fill='%23e7e7ea'/><polygon points='120,36 120,84 160,60' fill='%2337373d'/>`
                    break
                  case 'musicEmbed':
                    graphic = `<rect x='24' y='24' width='192' height='72' rx='6' fill='%23e7e7ea'/><path d='M80 36 v40 a12 12 0 1 0 8 -12 v-28 h24' stroke='%2337373d' fill='none' stroke-width='3'/>`
                    break
                  case 'testimonials':
                    graphic = `<rect x='24' y='24' width='80' height='60' rx='6' fill='%23e7e7ea'/><rect x='136' y='24' width='80' height='60' rx='6' fill='%23e7e7ea'/>`
                    break
                  case 'faq':
                    graphic = `<rect x='28' y='28' width='184' height='12' rx='6' fill='%23e7e7ea'/><rect x='28' y='48' width='160' height='8' rx='4' fill='%235b5b62'/>`
                    break
                  default:
                    graphic = `<rect x='30' y='30' width='180' height='60' rx='6' fill='%23e7e7ea'/>`
                }
                const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='240' height='135'>${base}${graphic}${text}</svg>`
                return `data:image/svg+xml;utf8,${svg}`
              },
            },
          ],
        },
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          description: 'If empty, defaults to page name',
        }),
        defineField({
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],
  initialValue: {
    modules: [
      {
        _type: 'hero',
        headline: 'New Page',
        mediaType: 'image',
      },
      {
        _type: 'richText',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [{_type: 'span', text: 'Start writing your content...'}],
          },
        ],
      },
    ],
  },
  preview: {
    select: {
      title: 'name',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title,
        subtitle: `/${slug || ''}`,
      }
    },
  },
})
