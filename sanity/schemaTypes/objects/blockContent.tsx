import {defineArrayMember, defineType, defineField} from 'sanity'

/**
 * Rich-text "block content" used by Bio, EPK, policy pages, and other
 * long-form fields. Supports a Link annotation (URL or Product) and a
 * Button annotation. Plain paragraphs by default.
 */
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
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
                    {title: 'Product', value: 'product'},
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
                name: 'product',
                title: 'Product',
                type: 'reference',
                to: [{type: 'product'}],
                hidden: ({parent}) => parent?.linkType !== 'product',
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'product' && !value) {
                      return 'Product reference is required when Link Type is Product'
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
          {
            name: 'button',
            type: 'object',
            title: 'Button',
            fields: [
              defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
              defineField({
                name: 'variant',
                title: 'Variant',
                type: 'string',
                initialValue: 'primary',
                options: {list: ['primary', 'secondary', 'outline']},
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) => Rule.uri({allowRelative: true, scheme: ['http', 'https']}).required(),
              }),
            ],
          },
        ],
      },
    }),
  ],
})
