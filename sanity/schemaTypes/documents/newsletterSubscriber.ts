import {defineType, defineField} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const newsletterSubscriber = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscribers',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .email()
          .error('A valid email address is required'),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Unsubscribed', value: 'unsubscribed'},
        ],
      },
      initialValue: 'active',    }),
    defineField({
      name: 'source',
      title: 'Subscription Source',
      type: 'string',
      description: 'Where the subscriber signed up from',
      initialValue: 'website',
    }),
  ],
  preview: {
    select: {
      email: 'email',
      status: 'status',
      subscribedAt: 'subscribedAt',
    },
    prepare({email, status, subscribedAt}) {
      return {
        title: email,
        subtitle: `${status} - ${subscribedAt ? new Date(subscribedAt).toLocaleDateString() : 'Unknown'}`,
      }
    },
  },
})
