import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'pageVisibility', title: 'Page Visibility'},
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your blog.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      group: 'general',
    }),
    defineField({
      name: 'description',
      description: 'Used on the Homepage',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      group: 'general',
      of: [
        // Define a minified block content field for the description. https://www.sanity.io/docs/block-content
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'linkType',
                    title: 'Link Type',
                    type: 'string',
                    initialValue: 'href',
                    options: {
                      list: [
                        {title: 'URL', value: 'href'},
                        {title: 'Page', value: 'page'},
                        {title: 'Post', value: 'post'},
                      ],
                      layout: 'radio',
                    },
                  }),
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                    validation: (Rule) =>
                      Rule.custom((value, context: any) => {
                        if (context.parent?.linkType === 'href' && !value) {
                          return 'URL is required when Link Type is URL'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'page',
                    title: 'Page',
                    type: 'reference',
                    to: [{type: 'page'}],
                    hidden: ({parent}) => parent?.linkType !== 'page',
                    validation: (Rule) =>
                      Rule.custom((value, context: any) => {
                        if (context.parent?.linkType === 'page' && !value) {
                          return 'Page reference is required when Link Type is Page'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'post',
                    title: 'Post',
                    type: 'reference',
                    to: [{type: 'post'}],
                    hidden: ({parent}) => parent?.linkType !== 'post',
                    validation: (Rule) =>
                      Rule.custom((value, context: any) => {
                        if (context.parent?.linkType === 'post' && !value) {
                          return 'Post reference is required when Link Type is Post'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'general',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Primary contact email address',
      group: 'general',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking/Scheduling URL',
      type: 'url',
      description: 'Optional URL for lesson booking or scheduling',
      group: 'general',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description: 'Add social media links for the site',
      group: 'general',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Twitter/X', value: 'twitter'},
                  {title: 'Spotify', value: 'spotify'},
                  {title: 'SoundCloud', value: 'soundcloud'},
                  {title: 'Bandcamp', value: 'bandcamp'},
                ],
                layout: 'dropdown',
              },            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare({platform, url}) {
              return {
                title: platform,
                subtitle: url,
              }
            },
          },
        }),
      ],
    }),
    // === PAGE VISIBILITY ===
    defineField({
      name: 'showShowsPage',
      title: 'Show "Shows" Page',
      type: 'boolean',
      description: 'Toggle to show/hide the Shows page and its navigation link',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showLessonsPage',
      title: 'Show "Lessons" Page',
      type: 'boolean',
      description: 'Toggle to show/hide the Lessons page and its navigation link',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showSetlistPage',
      title: 'Show "Setlist" Page',
      type: 'boolean',
      description: 'Toggle to show/hide the Setlist page and its navigation link',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showMerchPage',
      title: 'Show "Merch" Page',
      type: 'boolean',
      description: 'Toggle to show/hide the Merch page and its navigation link. This is separate from Store Enabled in Store Settings, which controls checkout only.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showContactPage',
      title: 'Show "Contact" Page',
      type: 'boolean',
      description: 'Toggle to show/hide the Contact page and its navigation link',
      initialValue: true,
      group: 'pageVisibility',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
