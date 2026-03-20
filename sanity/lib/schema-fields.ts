import {defineField} from 'sanity'

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    description: 'Override the page title in search results',
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 2,
    description: 'Override the meta description for search engines',
  }),
]
