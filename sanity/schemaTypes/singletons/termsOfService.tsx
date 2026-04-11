import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const termsOfService = defineType({
  name: 'termsOfService',
  title: 'Terms of Service',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Terms of Service',
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
      description: 'The full terms of service content. Use headings (H2) for sections.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'string',
      description: 'Meta description for search engines',
      initialValue: 'Terms of service for purchasing from our store.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Terms of Service'}
    },
  },
})
