import {defineField} from 'sanity'

const positionOptions = [
  {title: 'Top Left', value: 'top-left'},
  {title: 'Top Center', value: 'top-center'},
  {title: 'Top Right', value: 'top-right'},
  {title: 'Center Left', value: 'center-left'},
  {title: 'Center', value: 'center'},
  {title: 'Center Right', value: 'center-right'},
  {title: 'Bottom Left', value: 'bottom-left'},
  {title: 'Bottom Center', value: 'bottom-center'},
  {title: 'Bottom Right', value: 'bottom-right'},
]

export const imagePositionFields = [
  defineField({
    name: 'desktopPosition',
    title: 'Desktop Position (Optional)',
    type: 'string',
    description: 'Override image position on desktop screens',
    options: {
      list: positionOptions,
      layout: 'dropdown',
    },
  }),
  defineField({
    name: 'mobilePosition',
    title: 'Mobile Position (Optional)',
    type: 'string',
    description: 'Override image position on mobile screens',
    options: {
      list: positionOptions,
      layout: 'dropdown',
    },
  }),
]
