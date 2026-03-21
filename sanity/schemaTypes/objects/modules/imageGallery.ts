import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'
import {imagePositionFields} from '@/sanity/lib/image-fields'

export const imageGallery = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'backgroundVariant',
      title: 'Background Variant',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Surface', value: 'surface'},
          {title: 'Surface Elevated', value: 'surface-elevated'},
          {title: 'Dark Gradient', value: 'dark-gradient'},
        ],
      },
    }),
    defineField({
      name: 'sectionPadding',
      title: 'Section Vertical Padding',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'XL', value: 'xl'},
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            ...imagePositionFields,
          ],
        }),
      ],    }),
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare({images}) {
      const count = images?.length || 0
      return {
        title: `Image Gallery (${count} ${count === 1 ? 'image' : 'images'})`,
        subtitle: 'Image Gallery Module',
        media: images?.[0],
      }
    },
  },
})
