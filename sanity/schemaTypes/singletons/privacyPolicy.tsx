import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const privacyPolicy = defineType({
  name: 'privacyPolicy',
  title: 'Privacy Policy',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Privacy Policy',
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
      description: 'The full privacy policy content. Use headings (H2) for sections.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'string',
      description: 'Meta description for search engines',
      initialValue: 'How we collect, use, and protect your personal information.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Privacy Policy'}
    },
  },
})
