import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import * as demo from '../../lib/demo'

/**
 * Site Settings — global, site-wide configuration.
 * One singleton document at _id: "settings".
 */
export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identity & SEO', default: true},
    {name: 'contact', title: 'Contact & Booking'},
    {name: 'social', title: 'Social Links'},
    {name: 'pageVisibility', title: 'Page Visibility'},
  ],
  fields: [
    // === IDENTITY & SEO ===
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description:
        'Used in the browser tab and as the default site title in search results and social shares.',
      initialValue: demo.title,
      group: 'identity',
      validation: (Rule) => Rule.required().max(70).warning('Keep under 70 characters for search results'),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'array',
      description:
        'One-to-two sentence description of the site. Used as the default meta description for SEO and social cards. Keep under ~160 characters.',
      initialValue: [
        {
          _key: 'descBlock',
          _type: 'block',
          children: [{_key: 'descSpan', _type: 'span', text: demo.descriptionPlain}],
          markDefs: [],
          style: 'normal',
        },
      ],
      group: 'identity',
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          // Plain text only — no headings, no rich-text formatting.
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {decorators: [], annotations: []},
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'identity',
      description:
        'Image shown when the site is shared on Facebook, Twitter, iMessage, etc. Recommended size: 1200×630.',
      options: {
        hotspot: true,
        aiAssist: {imageDescriptionField: 'alt'},
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Short description of the image for accessibility and SEO.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required when an image is set'
              }
              return true
            }),
        }),
      ],
    }),

    // === CONTACT & BOOKING ===
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description:
        'Public-facing contact email. Shown on the Contact and Lessons pages, and used as the default mailto link in the footer.',
      group: 'contact',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Lesson Booking URL',
      type: 'url',
      description:
        'Optional. If you use a scheduling service (e.g., Calendly), paste the link here to add a "Book a Lesson" button on the Lessons page. Leave blank to hide.',
      group: 'contact',
    }),

    // === SOCIAL ===
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description:
        'Add a row for each social profile. These appear in the footer and as social meta tags.',
      group: 'social',
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
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Twitter / X', value: 'twitter'},
                  {title: 'Threads', value: 'threads'},
                  {title: 'Spotify', value: 'spotify'},
                  {title: 'Apple Music', value: 'applemusic'},
                  {title: 'Bandcamp', value: 'bandcamp'},
                  {title: 'SoundCloud', value: 'soundcloud'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {platform: 'platform', url: 'url'},
            prepare({platform, url}) {
              return {title: platform || 'Untitled', subtitle: url}
            },
          },
        }),
      ],
    }),

    // === PAGE VISIBILITY ===
    defineField({
      name: 'showShowsPage',
      title: 'Shows page',
      type: 'boolean',
      description: 'Show the Shows page in the navigation and footer.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showLessonsPage',
      title: 'Lessons page',
      type: 'boolean',
      description: 'Show the Lessons page in the navigation and footer.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showSetlistPage',
      title: 'Setlist page',
      type: 'boolean',
      description: 'Show the Setlist page in the navigation and footer.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showAmpsPage',
      title: 'Amps page',
      type: 'boolean',
      description: 'Show the Amps page in the navigation and footer.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showMerchPage',
      title: 'Merch page',
      type: 'boolean',
      description:
        'Show the Merch page in the navigation. Note: this is separate from "Store Enabled" in Store Settings, which controls whether checkout is allowed.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showBioPage',
      title: 'Bio page',
      type: 'boolean',
      description: 'Show the Bio page in the navigation and footer.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showEpkPage',
      title: 'Press Kit (EPK) page',
      type: 'boolean',
      description: 'Show the EPK / Press Kit page in the navigation and footer.',
      initialValue: true,
      group: 'pageVisibility',
    }),
    defineField({
      name: 'showContactPage',
      title: 'Contact page',
      type: 'boolean',
      description: 'Show the Contact page in the navigation and footer.',
      initialValue: true,
      group: 'pageVisibility',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
