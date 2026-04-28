import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const bio = defineType({
  name: 'bio',
  title: 'Bio',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Bio',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short one-liner shown under the title (e.g., "Blues guitarist based in the Pacific Northwest")',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description: 'Full long-form bio. Use H2 headings for sections (e.g., "Origins", "Influences", "Career").',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Empty State Text',
      type: 'text',
      rows: 2,
      description:
        'Fallback text shown if the bio Content above is empty. Useful when the page is freshly published but content is still being written.',
      initialValue:
        'Bio coming soon. Edit the Bio page in Sanity Studio to add your story, influences, and career highlights.',
    }),
    defineField({
      name: 'lastUpdatedPrefix',
      title: '"Last Updated" Prefix',
      type: 'string',
      description: 'Shown before the last-updated date (e.g., "Last updated: November 2024").',
      initialValue: 'Last updated:',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'string',
      description: 'Meta description for search engines',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Bio'}
    },
  },
})
