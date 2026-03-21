import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'
import {imagePositionFields} from '@/sanity/lib/image-fields'

export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'backgroundVariant',
      title: 'Background Variant',
      type: 'string',
      initialValue: 'default',
      options: {list: [
        {title: 'Default', value: 'default'},
        {title: 'Surface', value: 'surface'},
        {title: 'Surface Elevated', value: 'surface-elevated'},
        {title: 'Dark Gradient', value: 'dark-gradient'},
      ]},
    }),
    defineField({
      name: 'sectionPadding',
      title: 'Section Vertical Padding',
      type: 'string',
      initialValue: 'md',
      options: {list: [
        {title: 'None', value: 'none'},
        {title: 'Small', value: 'sm'},
        {title: 'Medium', value: 'md'},
        {title: 'Large', value: 'lg'},
        {title: 'XL', value: 'xl'},
      ]},
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'iconType',
              title: 'Icon/Image Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Image', value: 'image'},
                  {title: 'Icon Name', value: 'icon'},
                ],
              },
              initialValue: 'icon',
            }),
            defineField({
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Lucide icon name (e.g., "Music", "Calendar", "ShoppingCart")',
              hidden: ({parent}) => parent?.iconType !== 'icon',
            }),
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
                  description: 'Describe the image for accessibility',                }),
                ...imagePositionFields,
              ],
              hidden: ({parent}) => parent?.iconType !== 'image',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              body: 'body',
              media: 'image',
            },
            prepare({title, body}) {
              return {
                title,
                subtitle: body,
              }
            },
          },
        }),
      ],    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      const count = items?.length || 0
      return {
        title: `Feature Grid (${count} ${count === 1 ? 'item' : 'items'})`,
        subtitle: 'Feature Grid Module',
      }
    },
  },
})
