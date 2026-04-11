import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * UI Text singleton schema
 * Contains all global UI text elements (buttons, labels, messages, etc.)
 */

export const uiText = defineType({
  name: 'uiText',
  title: 'UI Text & Labels',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    // Site Branding
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Site logo text in header',
      initialValue: 'KIVETT BEDNAR',    }),
    defineField({
      name: 'siteTagline',
      title: 'Site Tagline',
      type: 'string',
      description: 'Used in footer and various places',
      initialValue: 'Gritty Texas Blues meets the heart of the Pacific Northwest',    }),

    // Navigation
    defineField({
      name: 'navShows',
      title: 'Navigation: Shows',
      type: 'string',
      initialValue: 'Shows',    }),
    defineField({
      name: 'navLessons',
      title: 'Navigation: Lessons',
      type: 'string',
      initialValue: 'Lessons',    }),
    defineField({
      name: 'navSetlist',
      title: 'Navigation: Setlist',
      type: 'string',
      initialValue: 'Setlist',    }),
    defineField({
      name: 'navMerch',
      title: 'Navigation: Merch',
      type: 'string',
      initialValue: 'Merch',    }),
    defineField({
      name: 'navContact',
      title: 'Navigation: Contact',
      type: 'string',
      initialValue: 'Contact',    }),

    // Footer
    defineField({
      name: 'footerNavigationHeading',
      title: 'Footer: Navigation Heading',
      type: 'string',
      initialValue: 'Navigation',    }),
    defineField({
      name: 'footerConnectHeading',
      title: 'Footer: Connect Heading',
      type: 'string',
      initialValue: 'Connect',    }),
    defineField({
      name: 'footerCopyrightText',
      title: 'Footer: Copyright Text',
      type: 'string',
      description: 'Use {year} placeholder for current year',
      initialValue: '© {year} Kivett Bednar. All rights reserved.',    }),

    // Contact Form Labels
    defineField({
      name: 'formLabelName',
      title: 'Form Label: Name',
      type: 'string',
      initialValue: 'Name',    }),
    defineField({
      name: 'formLabelEmail',
      title: 'Form Label: Email',
      type: 'string',
      initialValue: 'Email',    }),
    defineField({
      name: 'formLabelSubject',
      title: 'Form Label: Subject',
      type: 'string',
      initialValue: 'Subject',    }),
    defineField({
      name: 'formLabelMessage',
      title: 'Form Label: Message',
      type: 'string',
      initialValue: 'Message',    }),
    defineField({
      name: 'formButtonSubmit',
      title: 'Form Button: Submit',
      type: 'string',
      initialValue: 'Send Message',    }),
    defineField({
      name: 'formButtonSending',
      title: 'Form Button: Sending State',
      type: 'string',
      initialValue: 'Sending...',    }),
    defineField({
      name: 'formSuccessHeading',
      title: 'Form: Success Heading',
      type: 'string',
      initialValue: 'Message Sent',    }),
    defineField({
      name: 'formSuccessMessage',
      title: 'Form: Success Message',
      type: 'text',
      rows: 2,
      initialValue: "Thanks for reaching out! I'll get back to you as soon as possible.",    }),
    defineField({
      name: 'formSendAnotherText',
      title: 'Form: Send Another Button',
      type: 'string',
      initialValue: 'Send Another Message',    }),
    defineField({
      name: 'formPlaceholderName',
      title: 'Form Placeholder: Name',
      type: 'string',
      initialValue: 'Your name',    }),
    defineField({
      name: 'formPlaceholderEmail',
      title: 'Form Placeholder: Email',
      type: 'string',
      initialValue: 'your@email.com',    }),
    defineField({
      name: 'formPlaceholderSubject',
      title: 'Form Placeholder: Subject',
      type: 'string',
      initialValue: "What's this about?",    }),
    defineField({
      name: 'formPlaceholderMessage',
      title: 'Form Placeholder: Message',
      type: 'string',
      initialValue: 'Your message...',    }),

    // Newsletter
    defineField({
      name: 'newsletterButtonText',
      title: 'Newsletter: Button Text',
      type: 'string',
      initialValue: 'Join the List',    }),
    defineField({
      name: 'newsletterSuccessText',
      title: 'Newsletter: Success Text',
      type: 'string',
      initialValue: 'Subscribed',    }),
    defineField({
      name: 'newsletterPlaceholder',
      title: 'Newsletter: Placeholder',
      type: 'string',
      initialValue: 'Enter your email',    }),
    defineField({
      name: 'newsletterDisclaimer',
      title: 'Newsletter: Privacy Disclaimer',
      type: 'string',
      initialValue: 'We respect your privacy. Unsubscribe at any time.',    }),

    // Footer
    defineField({
      name: 'footerBookingText',
      title: 'Footer: Booking/Contact Text',
      type: 'string',
      description: 'Short text above the contact link in the footer',
      initialValue: 'For booking inquiries, lessons, or just to say hello.',    }),

    // Common Button Labels
    defineField({
      name: 'buttonViewSetlist',
      title: 'Button: View Setlist',
      type: 'string',
      initialValue: 'View Setlist',    }),
    defineField({
      name: 'buttonScheduleLesson',
      title: 'Button: Schedule Lesson',
      type: 'string',
      initialValue: 'Schedule Your First Lesson',    }),
    defineField({
      name: 'buttonBookLesson',
      title: 'Button: Book a Lesson',
      type: 'string',
      initialValue: 'Book a Lesson',    }),
    defineField({
      name: 'buttonEmailMe',
      title: 'Button: Email Me',
      type: 'string',
      initialValue: 'Email Me',    }),
    defineField({
      name: 'buttonGetInTouch',
      title: 'Button: Get in Touch',
      type: 'string',
      initialValue: 'Get in Touch',    }),

    // Common Link Text
    defineField({
      name: 'linkSeeAllShows',
      title: 'Link: See All Shows',
      type: 'string',
      initialValue: 'See all shows →',    }),
    defineField({
      name: 'linkUpcomingShows',
      title: 'Link: Upcoming Shows',
      type: 'string',
      initialValue: 'Upcoming Shows',    }),
    defineField({
      name: 'linkGuitarLessons',
      title: 'Link: Guitar Lessons',
      type: 'string',
      initialValue: 'Guitar Lessons',    }),
    defineField({
      name: 'linkBluesSetlist',
      title: 'Link: Blues Setlist',
      type: 'string',
      initialValue: 'Blues Setlist',    }),

    // Dynamic Text Patterns
    defineField({
      name: 'showsCountSingular',
      title: 'Shows Count: Singular',
      type: 'string',
      description: 'Text for one show (e.g., "1 upcoming show")',
      initialValue: 'show',    }),
    defineField({
      name: 'showsCountPlural',
      title: 'Shows Count: Plural',
      type: 'string',
      description: 'Text for multiple shows (e.g., "5 upcoming shows")',
      initialValue: 'shows',    }),
    defineField({
      name: 'upcomingPrefix',
      title: 'Text: "upcoming" prefix',
      type: 'string',
      initialValue: ' upcoming',    }),
    defineField({
      name: 'setlistSubtitleSuffix',
      title: 'Setlist: Subtitle Suffix',
      type: 'string',
      description: 'Text appended to song count (e.g., "32 timeless classics...")',
      initialValue: ' timeless classics from the great American songbook',    }),

    // Social Media Platform Names
    defineField({
      name: 'socialFacebook',
      title: 'Social: Facebook Label',
      type: 'string',
      initialValue: 'Facebook',    }),
    defineField({
      name: 'socialInstagram',
      title: 'Social: Instagram Label',
      type: 'string',
      initialValue: 'Instagram',    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'UI Text & Labels',
      }
    },
  },
})
