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
    {name: 'cart', title: 'Cart Labels'},
    {name: 'errorPage', title: 'Error Page'},
    {name: 'emptyStates', title: 'Empty State Fallbacks'},
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

    // === CART LABELS ===
    defineField({name: 'cartQuantityLabel', title: 'Cart — "Quantity" Label', type: 'string', initialValue: 'Quantity', group: 'cart'}),
    defineField({name: 'cartRemoveLabel', title: 'Cart — "Remove" Button', type: 'string', initialValue: 'Remove', group: 'cart'}),
    defineField({name: 'cartSubtotalLabel', title: 'Cart — "Subtotal" Label', type: 'string', initialValue: 'Subtotal', group: 'cart'}),
    defineField({name: 'cartDiscountLabel', title: 'Cart — "Discount" Label', type: 'string', initialValue: 'Discount', group: 'cart'}),
    defineField({name: 'cartShippingLabel', title: 'Cart — "Shipping" Label', type: 'string', initialValue: 'Shipping', group: 'cart'}),
    defineField({name: 'cartTaxLabel', title: 'Cart — "Tax" Label', type: 'string', initialValue: 'Tax', group: 'cart'}),
    defineField({name: 'cartTotalLabel', title: 'Cart — "Total" Label', type: 'string', initialValue: 'Total', group: 'cart'}),
    defineField({
      name: 'cartCalculatedAtCheckoutText',
      title: 'Cart — "Calculated at checkout" Text',
      type: 'string',
      description: 'Shown next to Shipping and Tax before checkout',
      initialValue: 'Calculated at checkout',
      group: 'cart',
    }),
    defineField({name: 'cartProceedButtonText', title: 'Cart — "Proceed to Checkout" Button', type: 'string', initialValue: 'Proceed to Checkout', group: 'cart'}),
    defineField({name: 'cartProcessingText', title: 'Cart — "Processing..." Text', type: 'string', initialValue: 'Processing...', group: 'cart'}),
    defineField({name: 'cartClearButtonText', title: 'Cart — "Clear Cart" Button', type: 'string', initialValue: 'Clear Cart', group: 'cart'}),
    defineField({
      name: 'cartClearConfirmText',
      title: 'Cart — Clear Cart Confirm Dialog',
      type: 'string',
      description: 'Text in the browser confirm dialog when "Clear Cart" is pressed',
      initialValue: 'Remove all items from your cart?',
      group: 'cart',
    }),
    defineField({
      name: 'cartItemEachText',
      title: 'Cart — "each" Suffix',
      type: 'string',
      description: 'Suffix shown after the per-unit price (e.g. "$25 each")',
      initialValue: 'each',
      group: 'cart',
    }),
    defineField({
      name: 'cartItemSingular',
      title: 'Cart — "item" (singular)',
      type: 'string',
      description: 'Used in the count badge (e.g. "1 item ready for checkout")',
      initialValue: 'item',
      group: 'cart',
    }),
    defineField({
      name: 'cartItemPlural',
      title: 'Cart — "items" (plural)',
      type: 'string',
      description: 'Used in the count badge (e.g. "5 items ready for checkout")',
      initialValue: 'items',
      group: 'cart',
    }),
    defineField({
      name: 'cartReadyForCheckoutSuffix',
      title: 'Cart — "ready for checkout" Suffix',
      type: 'string',
      description: 'Tail of the count line — e.g. count + item/items + this',
      initialValue: 'ready for checkout',
      group: 'cart',
    }),

    // === ERROR PAGE ===
    defineField({
      name: 'errorPageHeading',
      title: 'Error — Heading',
      type: 'string',
      description: 'Shown when the site hits an unexpected error.',
      initialValue: 'Something Went Wrong',
      group: 'errorPage',
    }),
    defineField({
      name: 'errorPageBody',
      title: 'Error — Body Text',
      type: 'text',
      rows: 2,
      initialValue: "We encountered an unexpected error. Don't worry, it's not your fault.",
      group: 'errorPage',
    }),
    defineField({name: 'errorPageRetryButton', title: 'Error — "Try Again" Button', type: 'string', initialValue: 'Try Again', group: 'errorPage'}),
    defineField({name: 'errorPageHomeButton', title: 'Error — "Go Home" Button', type: 'string', initialValue: 'Go Home', group: 'errorPage'}),

    // === EMPTY STATE FALLBACKS ===
    defineField({
      name: 'productImageFallbackText',
      title: 'Product — "Image Coming Soon" Placeholder',
      type: 'string',
      description: 'Shown on product cards when no image is uploaded yet.',
      initialValue: 'Image Coming Soon',
      group: 'emptyStates',
    }),
    defineField({
      name: 'lessonsEmptyHeading',
      title: 'Lessons — Empty State Heading',
      type: 'string',
      description: 'Shown if the Lessons Page document hasn\'t been created yet.',
      initialValue: 'Lessons Coming Soon',
      group: 'emptyStates',
    }),
    defineField({
      name: 'lessonsEmptyText',
      title: 'Lessons — Empty State Text',
      type: 'text',
      rows: 2,
      initialValue: 'Guitar and blues lessons information will be available shortly. Check back soon.',
      group: 'emptyStates',
    }),
    defineField({
      name: 'epkEmptyHeading',
      title: 'EPK — Empty State Heading',
      type: 'string',
      description: 'Shown if the Press Kit document hasn\'t been created yet.',
      initialValue: 'Press Kit Coming Soon',
      group: 'emptyStates',
    }),
    defineField({
      name: 'epkEmptyText',
      title: 'EPK — Empty State Text',
      type: 'text',
      rows: 2,
      initialValue: 'The press kit is being prepared. Please check back soon or contact directly for press inquiries.',
      group: 'emptyStates',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'UI Text & Labels'}
    },
  },
})
