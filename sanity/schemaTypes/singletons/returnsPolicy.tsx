import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const returnsPolicy = defineType({
  name: 'returnsPolicy',
  title: 'Returns & Refunds',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Returns & Refunds',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description: 'Displayed at the top of the page',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description: 'The full returns and refunds policy content. Use headings (H2) for sections.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'string',
      description: 'Meta description for search engines',
      initialValue: 'Our return and refund policy for merchandise purchases.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Returns & Refunds'}
    },
  },
})
