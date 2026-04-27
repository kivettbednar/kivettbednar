import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * UI Text & Labels — global, reusable text for buttons, navigation,
 * forms, and labels. Edit here once and the change reflects across the
 * site. Organized into tabs so it's easy to find what you need.
 */
export const uiText = defineType({
  name: 'uiText',
  title: 'UI Text & Labels',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'branding', title: 'Branding', default: true},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'forms', title: 'Contact Form'},
    {name: 'newsletter', title: 'Newsletter'},
    {name: 'buttonsLinks', title: 'Buttons & Links'},
    {name: 'shows', title: 'Shows Counts'},
    {name: 'social', title: 'Social Labels'},
  ],
  fields: [
    // === BRANDING ===
    defineField({
      name: 'siteName',
      title: 'Site Name (header logo)',
      type: 'string',
      description: 'The wordmark in the site header.',
      initialValue: 'KIVETT BEDNAR',
      group: 'branding',
    }),
    defineField({
      name: 'siteTagline',
      title: 'Site Tagline',
      type: 'string',
      description: 'Short tagline shown in the footer and a few other places.',
      initialValue: 'Gritty Texas Blues meets the heart of the Pacific Northwest',
      group: 'branding',
    }),

    // === NAVIGATION ===
    defineField({name: 'navShows', title: 'Nav — Shows', type: 'string', initialValue: 'Shows', group: 'navigation'}),
    defineField({name: 'navLessons', title: 'Nav — Lessons', type: 'string', initialValue: 'Lessons', group: 'navigation'}),
    defineField({name: 'navSetlist', title: 'Nav — Setlist', type: 'string', initialValue: 'Setlist', group: 'navigation'}),
    defineField({name: 'navAmps', title: 'Nav — Amps', type: 'string', initialValue: 'Amps', group: 'navigation'}),
    defineField({name: 'navMerch', title: 'Nav — Merch', type: 'string', initialValue: 'Merch', group: 'navigation'}),
    defineField({name: 'navContact', title: 'Nav — Contact', type: 'string', initialValue: 'Contact', group: 'navigation'}),
    defineField({name: 'navBio', title: 'Nav — Bio', type: 'string', initialValue: 'Bio', group: 'navigation'}),
    defineField({name: 'navEpk', title: 'Nav — Press Kit', type: 'string', initialValue: 'Press Kit', group: 'navigation'}),

    // === FOOTER ===
    defineField({
      name: 'footerNavigationHeading',
      title: 'Footer — Navigation Heading',
      type: 'string',
      initialValue: 'Navigation',
      group: 'footer',
    }),
    defineField({
      name: 'footerConnectHeading',
      title: 'Footer — Connect Heading',
      type: 'string',
      initialValue: 'Connect',
      group: 'footer',
    }),
    defineField({
      name: 'footerBioLabel',
      title: 'Footer — Bio Link Label',
      type: 'string',
      initialValue: 'Bio',
      group: 'footer',
    }),
    defineField({
      name: 'footerEpkLabel',
      title: 'Footer — Press Kit Link Label',
      type: 'string',
      initialValue: 'Press Kit',
      group: 'footer',
    }),
    defineField({
      name: 'footerCopyrightText',
      title: 'Footer — Copyright Text',
      type: 'string',
      description: 'Use {year} as a placeholder for the current year.',
      initialValue: '© {year} Kivett Bednar. All rights reserved.',
      group: 'footer',
    }),
    defineField({
      name: 'footerBookingText',
      title: 'Footer — Booking Blurb',
      type: 'string',
      description: 'Short line above the contact link in the footer.',
      initialValue: 'For booking inquiries, lessons, or just to say hello.',
      group: 'footer',
    }),

    // === FORMS ===
    defineField({name: 'formLabelName', title: 'Form Label — Name', type: 'string', initialValue: 'Name', group: 'forms'}),
    defineField({name: 'formLabelEmail', title: 'Form Label — Email', type: 'string', initialValue: 'Email', group: 'forms'}),
    defineField({name: 'formLabelSubject', title: 'Form Label — Subject', type: 'string', initialValue: 'Subject', group: 'forms'}),
    defineField({name: 'formLabelMessage', title: 'Form Label — Message', type: 'string', initialValue: 'Message', group: 'forms'}),
    defineField({name: 'formButtonSubmit', title: 'Submit Button', type: 'string', initialValue: 'Send Message', group: 'forms'}),
    defineField({name: 'formButtonSending', title: 'Submit Button — Sending State', type: 'string', initialValue: 'Sending...', group: 'forms'}),
    defineField({name: 'formSuccessHeading', title: 'Success Heading', type: 'string', initialValue: 'Message Sent', group: 'forms'}),
    defineField({
      name: 'formSuccessMessage',
      title: 'Success Message',
      type: 'text',
      rows: 2,
      initialValue: "Thanks for reaching out! I'll get back to you as soon as possible.",
      group: 'forms',
    }),
    defineField({name: 'formSendAnotherText', title: 'Send Another Button', type: 'string', initialValue: 'Send Another Message', group: 'forms'}),
    defineField({name: 'formPlaceholderName', title: 'Placeholder — Name', type: 'string', initialValue: 'Your name', group: 'forms'}),
    defineField({name: 'formPlaceholderEmail', title: 'Placeholder — Email', type: 'string', initialValue: 'your@email.com', group: 'forms'}),
    defineField({name: 'formPlaceholderSubject', title: 'Placeholder — Subject', type: 'string', initialValue: "What's this about?", group: 'forms'}),
    defineField({name: 'formPlaceholderMessage', title: 'Placeholder — Message', type: 'string', initialValue: 'Your message...', group: 'forms'}),

    // === NEWSLETTER ===
    defineField({name: 'newsletterButtonText', title: 'Newsletter — Button', type: 'string', initialValue: 'Join the List', group: 'newsletter'}),
    defineField({name: 'newsletterSuccessText', title: 'Newsletter — Success', type: 'string', initialValue: 'Subscribed', group: 'newsletter'}),
    defineField({name: 'newsletterPlaceholder', title: 'Newsletter — Placeholder', type: 'string', initialValue: 'Enter your email', group: 'newsletter'}),
    defineField({
      name: 'newsletterDisclaimer',
      title: 'Newsletter — Privacy Disclaimer',
      type: 'string',
      initialValue: 'We respect your privacy. Unsubscribe at any time.',
      group: 'newsletter',
    }),

    // === BUTTONS & LINKS ===
    defineField({name: 'buttonViewSetlist', title: 'Button — View Setlist', type: 'string', initialValue: 'View Setlist', group: 'buttonsLinks'}),
    defineField({name: 'buttonScheduleLesson', title: 'Button — Schedule Lesson', type: 'string', initialValue: 'Schedule Your First Lesson', group: 'buttonsLinks'}),
    defineField({name: 'buttonBookLesson', title: 'Button — Book a Lesson', type: 'string', initialValue: 'Book a Lesson', group: 'buttonsLinks'}),
    defineField({name: 'buttonEmailMe', title: 'Button — Email Me', type: 'string', initialValue: 'Email Me', group: 'buttonsLinks'}),
    defineField({name: 'buttonGetInTouch', title: 'Button — Get in Touch', type: 'string', initialValue: 'Get in Touch', group: 'buttonsLinks'}),
    defineField({name: 'linkSeeAllShows', title: 'Link — See All Shows', type: 'string', initialValue: 'See all shows →', group: 'buttonsLinks'}),
    defineField({name: 'linkUpcomingShows', title: 'Link — Upcoming Shows', type: 'string', initialValue: 'Upcoming Shows', group: 'buttonsLinks'}),
    defineField({name: 'linkGuitarLessons', title: 'Link — Guitar Lessons', type: 'string', initialValue: 'Guitar Lessons', group: 'buttonsLinks'}),
    defineField({name: 'linkBluesSetlist', title: 'Link — Blues Setlist', type: 'string', initialValue: 'Blues Setlist', group: 'buttonsLinks'}),

    // === SHOWS COUNTS ===
    defineField({
      name: 'showsCountSingular',
      title: 'Shows Count — Singular',
      type: 'string',
      description: 'Used when there is exactly one show (e.g., "show").',
      initialValue: 'show',
      group: 'shows',
    }),
    defineField({
      name: 'showsCountPlural',
      title: 'Shows Count — Plural',
      type: 'string',
      description: 'Used when there are two or more shows (e.g., "shows").',
      initialValue: 'shows',
      group: 'shows',
    }),
    defineField({
      name: 'upcomingPrefix',
      title: '"upcoming" Prefix',
      type: 'string',
      description: 'Text before the count. Note the leading space.',
      initialValue: ' upcoming',
      group: 'shows',
    }),
    defineField({
      name: 'setlistSubtitleSuffix',
      title: 'Setlist Subtitle Suffix',
      type: 'string',
      description: 'Tail text appended to the setlist song count (e.g., " timeless classics from the great American songbook").',
      initialValue: ' timeless classics from the great American songbook',
      group: 'shows',
    }),

    // === SOCIAL LABELS ===
    defineField({name: 'socialFacebook', title: 'Social — Facebook Label', type: 'string', initialValue: 'Facebook', group: 'social'}),
    defineField({name: 'socialInstagram', title: 'Social — Instagram Label', type: 'string', initialValue: 'Instagram', group: 'social'}),
  ],
  preview: {
    prepare() {
      return {title: 'UI Text & Labels'}
    },
  },
})
