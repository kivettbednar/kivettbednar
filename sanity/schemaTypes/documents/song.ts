import {ComposeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Song document schema for setlist
 */

export const song = defineType({
  name: 'song',
  title: 'Song',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Song Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Musical key (e.g., "C", "Am", "G7")',    }),
    defineField({
      name: 'artist',
      title: 'Artist/Composer',
      type: 'string',
      description: 'Original artist or composer (optional)',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Optional notes about the song',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order in setlist',
      validation: (rule) => rule.required().positive().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'key',
      order: 'order',
    },
    prepare({title, subtitle, order}) {
      return {
        title: `${order}. ${title}`,
        subtitle: subtitle ? `Key: ${subtitle}` : 'No key set',
      }
    },
  },
})
