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

/**
 * SEO fields scoped to a Studio group. Use this when a schema uses
 * `groups` so that the SEO Title / Description fields render under the
 * "SEO" tab instead of in the default group.
 */
export const seoFieldsInGroup = (group: string) => [
  defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    description: 'Override the page title in search results',
    group,
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 2,
    description: 'Override the meta description for search engines',
    group,
  }),
]
