import {defineField} from 'sanity'

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    description:
      'Override the page title used in search results and the browser tab. Keep under ~70 characters.',
    validation: (Rule) =>
      Rule.max(70).warning('Search engines typically truncate titles over 70 characters'),
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 2,
    description:
      'Override the meta description used in search results and social shares. Keep under ~160 characters.',
    validation: (Rule) =>
      Rule.max(160).warning('Search engines typically truncate descriptions over 160 characters'),
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
    description:
      'Override the page title used in search results and the browser tab. Keep under ~70 characters.',
    group,
    validation: (Rule) =>
      Rule.max(70).warning('Search engines typically truncate titles over 70 characters'),
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 2,
    description:
      'Override the meta description used in search results and social shares. Keep under ~160 characters.',
    group,
    validation: (Rule) =>
      Rule.max(160).warning('Search engines typically truncate descriptions over 160 characters'),
  }),
]
