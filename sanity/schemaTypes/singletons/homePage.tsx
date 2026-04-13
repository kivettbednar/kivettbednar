import React from 'react'
import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {imagePositionFields} from '@/sanity/lib/image-fields'

/**
 * Home Page singleton schema.
 * Groups are ordered to match the page render order.
 */

const hasLegacyVideo = (document: unknown): boolean => {
  const d = document as Record<string, unknown> | undefined
  return Boolean(
    d?.featuredVideoUrl ||
      d?.featuredVideoTitle ||
      d?.studioVideo1Url ||
      d?.studioVideo1Title ||
      d?.studioVideo2Url ||
      d?.studioVideo2Title,
  )
}

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    // ────────── HERO ──────────
    defineField({
      name: 'heroSlides',
      title: 'Hero Slider Images',
      type: 'array',
      description: 'Images for the hero slider (recommended: 4–6 high-quality images)',
      validation: (Rule) => Rule.min(1).error('At least one hero slide is required'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'slide',
          fields: [
            defineField({
              name: 'image',
              title: 'Desktop Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'mobileImage',
              title: 'Mobile Image (Optional)',
              type: 'image',
              description: 'Different image for mobile devices. If not set, desktop image will be used.',
              options: {hotspot: true},
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for accessibility (optional)',
              initialValue: 'Kivett Bednar blues musician',
            }),
            ...imagePositionFields,
          ],
          preview: {select: {title: 'alt', media: 'image'}},
        }),
      ],
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Main heading text (e.g., "Kivett Bednar")',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingDesktopSize',
      title: 'Hero Heading Size (Desktop)',
      type: 'string',
      description: 'Text size for hero heading on desktop screens',
      initialValue: 'text-8xl',
      options: {
        list: [
          {title: 'Extra Small (4xl)', value: 'text-4xl'},
          {title: 'Small (5xl)', value: 'text-5xl'},
          {title: 'Medium (6xl)', value: 'text-6xl'},
          {title: 'Large (7xl)', value: 'text-7xl'},
          {title: 'Extra Large (8xl)', value: 'text-8xl'},
          {title: 'Huge (9xl)', value: 'text-9xl'},
        ],
        layout: 'dropdown',
      },
      components: {
        input: (props) => {
          const value = (props.value as string) || 'text-8xl'
          const pxMap: Record<string, number> = {
            'text-4xl': 36,
            'text-5xl': 48,
            'text-6xl': 60,
            'text-7xl': 72,
            'text-8xl': 96,
            'text-9xl': 128,
          }
          const fontSize = pxMap[value] || 96
          return (
            <div>
              {props.renderDefault(props)}
              <div style={{marginTop: 8, padding: 8, background: '#f7f7f7', borderRadius: 6}}>
                <div style={{fontSize, lineHeight: 1.1, fontWeight: 700}}>Desktop preview size</div>
              </div>
            </div>
          )
        },
      },
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingMobileSize',
      title: 'Hero Heading Size (Mobile)',
      type: 'string',
      description: 'Text size for hero heading on mobile screens',
      initialValue: 'text-5xl',
      options: {
        list: [
          {title: 'Extra Small (2xl)', value: 'text-2xl'},
          {title: 'Small (3xl)', value: 'text-3xl'},
          {title: 'Medium (4xl)', value: 'text-4xl'},
          {title: 'Large (5xl)', value: 'text-5xl'},
          {title: 'Extra Large (6xl)', value: 'text-6xl'},
          {title: 'Huge (7xl)', value: 'text-7xl'},
        ],
        layout: 'dropdown',
      },
      components: {
        input: (props) => {
          const value = (props.value as string) || 'text-5xl'
          const pxMap: Record<string, number> = {
            'text-2xl': 24,
            'text-3xl': 30,
            'text-4xl': 36,
            'text-5xl': 48,
            'text-6xl': 60,
            'text-7xl': 72,
          }
          const fontSize = pxMap[value] || 48
          return (
            <div>
              {props.renderDefault(props)}
              <div style={{marginTop: 8, padding: 8, background: '#f7f7f7', borderRadius: 6}}>
                <div style={{fontSize, lineHeight: 1.1, fontWeight: 700}}>Mobile preview size</div>
              </div>
            </div>
          )
        },
      },
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingTracking',
      title: 'Hero Heading Letter Spacing',
      type: 'string',
      initialValue: 'tracking-tight',
      options: {
        list: [
          {title: 'Tighter', value: 'tracking-tighter'},
          {title: 'Tight', value: 'tracking-tight'},
          {title: 'Normal', value: 'tracking-normal'},
          {title: 'Wide', value: 'tracking-wide'},
          {title: 'Wider', value: 'tracking-wider'},
          {title: 'Widest', value: 'tracking-widest'},
        ],
        layout: 'dropdown',
      },
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingLineHeight',
      title: 'Hero Heading Line Height',
      type: 'string',
      initialValue: 'leading-none',
      options: {
        list: [
          {title: 'None', value: 'leading-none'},
          {title: 'Tight', value: 'leading-tight'},
          {title: 'Snug', value: 'leading-snug'},
          {title: 'Normal', value: 'leading-normal'},
          {title: 'Relaxed', value: 'leading-relaxed'},
        ],
        layout: 'dropdown',
      },
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'string',
      description: 'Subheading text (e.g., "Blues • Guitar • Portland")',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadingTracking',
      title: 'Hero Subheading Letter Spacing',
      type: 'string',
      initialValue: 'tracking-normal',
      options: {
        list: [
          {title: 'Tighter', value: 'tracking-tighter'},
          {title: 'Tight', value: 'tracking-tight'},
          {title: 'Normal', value: 'tracking-normal'},
          {title: 'Wide', value: 'tracking-wide'},
          {title: 'Wider', value: 'tracking-wider'},
          {title: 'Widest', value: 'tracking-widest'},
        ],
        layout: 'dropdown',
      },
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadingLineHeight',
      title: 'Hero Subheading Line Height',
      type: 'string',
      initialValue: 'leading-normal',
      options: {
        list: [
          {title: 'None', value: 'leading-none'},
          {title: 'Tight', value: 'leading-tight'},
          {title: 'Snug', value: 'leading-snug'},
          {title: 'Normal', value: 'leading-normal'},
          {title: 'Relaxed', value: 'leading-relaxed'},
        ],
        layout: 'dropdown',
      },
      group: 'hero',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'text',
      rows: 2,
      description: 'Short tagline below subheading',
      group: 'hero',
    }),
    defineField({
      name: 'heroButtonText',
      title: 'Hero Button Text',
      type: 'string',
      description: 'Button text in hero slider (links to shows page)',
      initialValue: 'See Live Shows',
      group: 'hero',
    }),
    defineField({
      name: 'marqueeTopItems',
      title: 'Marquee Ticker — Top Row',
      type: 'array',
      description: 'Scrolling text items in the top row (left-scrolling).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'marqueeItem',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Bold Display (Anton)', value: 'anton'},
                  {title: 'Elegant Italic (Playfair)', value: 'playfair'},
                ],
                layout: 'radio',
              },
              initialValue: 'anton',
            }),
          ],
          preview: {select: {title: 'text', subtitle: 'style'}},
        }),
      ],
      group: 'hero',
    }),
    defineField({
      name: 'marqueeBottomItems',
      title: 'Marquee Ticker — Bottom Row',
      type: 'array',
      description: 'Scrolling text items in the bottom row (right-scrolling).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'marqueeItem',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Bold Display (Anton)', value: 'anton'},
                  {title: 'Elegant Italic (Playfair)', value: 'playfair'},
                ],
                layout: 'radio',
              },
              initialValue: 'anton',
            }),
          ],
          preview: {select: {title: 'text', subtitle: 'style'}},
        }),
      ],
      group: 'hero',
    }),

    // ────────── LISTEN (MUSIC) ──────────
    defineField({
      name: 'musicSectionHeading',
      title: 'Listen: Section Heading',
      type: 'string',
      description: 'e.g. "Listen" or "On Spotify"',
      initialValue: 'Listen',
      group: 'music',
    }),
    defineField({
      name: 'musicSectionSubheading',
      title: 'Listen: Subheading',
      type: 'string',
      description: 'Optional short line below the heading',
      initialValue: 'Stream the catalog',
      group: 'music',
    }),
    defineField({
      name: 'spotifyArtistId',
      title: 'Spotify Artist ID',
      type: 'string',
      description: 'Just the ID from open.spotify.com/artist/{ID}. Leave blank to hide the Spotify embed.',
      group: 'music',
    }),
    defineField({
      name: 'spotifyPlaylistId',
      title: 'Spotify Playlist or Album ID (optional)',
      type: 'string',
      description: 'If set, embeds a playlist or album instead of the artist profile.',
      group: 'music',
    }),
    defineField({
      name: 'spotifyEmbedType',
      title: 'Spotify Embed Type',
      type: 'string',
      options: {
        list: [
          {title: 'Artist', value: 'artist'},
          {title: 'Album', value: 'album'},
          {title: 'Playlist', value: 'playlist'},
        ],
        layout: 'radio',
      },
      initialValue: 'artist',
      group: 'music',
    }),
    defineField({
      name: 'appleMusicUrl',
      title: 'Apple Music URL',
      type: 'url',
      description: 'Link to Apple Music artist or album page',
      group: 'music',
    }),
    defineField({
      name: 'bandcampUrl',
      title: 'Bandcamp URL',
      type: 'url',
      description: 'Link to Bandcamp page',
      group: 'music',
    }),

    // ────────── ABOUT ──────────
    defineField({
      name: 'aboutHeading',
      title: 'About Section Heading',
      type: 'string',
      description: 'Heading for the about section',
      group: 'about',
    }),
    defineField({
      name: 'aboutText',
      title: 'About Section Text',
      type: 'text',
      rows: 4,
      description: 'Bio/description text',
      group: 'about',
    }),
    defineField({
      name: 'aboutVerticalLabel',
      title: 'About Vertical Label',
      type: 'string',
      description: 'Small vertical text label along the about image edge (e.g., "ABOUT THE ARTIST")',
      initialValue: 'ABOUT THE ARTIST',
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Optional — defaults to "Kivett Bednar with guitar"',
          initialValue: 'Kivett Bednar with guitar',
        }),
        ...imagePositionFields,
      ],
      group: 'about',
    }),
    defineField({
      name: 'aboutButtonText',
      title: 'About Button Text',
      type: 'string',
      description: 'Button text in about section',
      initialValue: 'Read Full Bio',
      group: 'about',
    }),

    // ────────── UPCOMING SHOWS ──────────
    defineField({
      name: 'upcomingShowsHeading',
      title: 'Upcoming Shows Heading',
      type: 'string',
      description: 'Heading for upcoming shows section',
      group: 'upcomingShows',
    }),
    defineField({
      name: 'seeAllShowsLinkText',
      title: 'See All Shows Link Text',
      type: 'string',
      description: 'Link text for viewing all shows',
      initialValue: 'See all shows →',
      group: 'upcomingShows',
    }),

    // ────────── LIVE VIDEOS ──────────
    defineField({
      name: 'featuredVideoHeading',
      title: 'Live Videos: Section Heading',
      type: 'string',
      description: 'Heading for the live video slider section',
      initialValue: 'Live Performance',
      group: 'liveVideos',
    }),
    defineField({
      name: 'featuredVideoSubheading',
      title: 'Live Videos: Subheading',
      type: 'string',
      description: 'Optional short line below the heading',
      initialValue: 'Experience the authentic blues sound',
      group: 'liveVideos',
    }),
    defineField({
      name: 'liveVideos',
      title: 'Live Videos',
      type: 'array',
      description: 'Videos shown in the slider. Order here sets slider order. YouTube URL or bare 11-char ID both work.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'liveVideo',
          fields: [
            defineField({
              name: 'url',
              title: 'YouTube URL or ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Shown as caption under the video',
            }),
            defineField({
              name: 'subtitle',
              title: 'Caption (Optional)',
              type: 'string',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'url'}},
        }),
      ],
      group: 'liveVideos',
    }),

    // ────────── BOOKING ──────────
    defineField({
      name: 'bookingSectionHeading',
      title: 'Booking Section Heading',
      type: 'string',
      description: 'Main heading for booking section',
      initialValue: 'Book Kivett for Your Event',
      group: 'booking',
    }),
    defineField({
      name: 'bookingSectionIntro',
      title: 'Booking Section Introduction',
      type: 'text',
      rows: 2,
      description: 'Introduction text for booking section',
      initialValue:
        'Available for festivals, private events, and venue bookings. Professional blues performance with authentic Texas style meets Pacific Northwest soul.',
      group: 'booking',
    }),
    defineField({
      name: 'bookingInquiryListHeading',
      title: 'Inquiry Checklist Heading',
      type: 'string',
      description: 'Heading above the numbered inquiry list',
      initialValue: 'Include in Your Inquiry',
      group: 'booking',
    }),
    defineField({
      name: 'bookingInquiryItems',
      title: 'Inquiry Checklist Items',
      type: 'array',
      description: 'Numbered list of items to include in a booking inquiry',
      of: [defineArrayMember({type: 'string'})],
      initialValue: [
        'Event date and location',
        'Type of event (festival, private party, venue, etc.)',
        'Expected audience size',
        'Performance duration needed',
      ],
      group: 'booking',
    }),
    defineField({
      name: 'bookingInquiriesHeading',
      title: 'Contact Card Heading',
      type: 'string',
      description: 'Heading inside the contact rail',
      initialValue: 'Direct Inquiries',
      group: 'booking',
    }),
    defineField({
      name: 'bookingInquiriesText',
      title: 'Contact Card Text',
      type: 'text',
      rows: 2,
      description: 'Short intro line shown above the email link',
      initialValue: 'Reach out directly — responses within 48 hours.',
      group: 'booking',
    }),
    defineField({
      name: 'bookingTestimonialQuote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 3,
      description: 'Featured testimonial displayed at the bottom of the booking section',
      initialValue:
        'Kivett brings authentic blues energy that connects with every audience. His performance at our festival was unforgettable.',
      group: 'booking',
    }),
    defineField({
      name: 'bookingTestimonialAttribution',
      title: 'Testimonial Attribution',
      type: 'string',
      description: 'Attribution line below the testimonial',
      initialValue: '— Festival Organizer',
      group: 'booking',
    }),

    // ────────── GALLERY ──────────
    defineField({
      name: 'gallerySectionHeading',
      title: 'Gallery Section Heading',
      type: 'string',
      description: 'Main heading for gallery section',
      group: 'gallery',
    }),
    defineField({
      name: 'gallerySectionSubheading',
      title: 'Gallery Section Subheading',
      type: 'string',
      description: 'Subtitle for gallery section',
      group: 'gallery',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      description: 'Floating gallery images (recommended: 6–8 images)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryImage',
          fields: [
            defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
            defineField({
              name: 'alt',
              title: 'Alt Text (Optional)',
              type: 'string',
              description: 'Defaults to "Kivett Bednar — gallery image"',
              initialValue: 'Kivett Bednar — gallery image',
            }),
            defineField({
              name: 'width',
              title: 'Image Width (Optional)',
              type: 'number',
              description: 'Defaults to 1200',
              initialValue: 1200,
            }),
            defineField({
              name: 'height',
              title: 'Image Height (Optional)',
              type: 'number',
              description: 'Defaults to 800',
              initialValue: 800,
            }),
          ],
          preview: {
            select: {title: 'alt', subtitle: 'width', media: 'image'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle ? `${subtitle}px wide` : 'No dimensions'}
            },
          },
        }),
      ],
      group: 'gallery',
    }),

    // ────────── NEWSLETTER ──────────
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter Section Heading',
      type: 'string',
      description: 'Heading for newsletter signup section',
      initialValue: 'Stay Connected',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterText',
      title: 'Newsletter Section Text',
      type: 'text',
      rows: 2,
      description: 'Description text for newsletter signup',
      initialValue:
        'Get the latest show announcements, new music releases, and exclusive content delivered to your inbox.',
      group: 'newsletter',
    }),

    // ────────── SECTION VISIBILITY ──────────
    defineField({
      name: 'showMusicSection',
      title: 'Show Listen / Music Section',
      type: 'boolean',
      initialValue: true,
      group: 'visibility',
    }),
    defineField({
      name: 'showAboutSection',
      title: 'Show About Section',
      type: 'boolean',
      initialValue: true,
      group: 'visibility',
    }),
    defineField({
      name: 'showUpcomingShows',
      title: 'Show Upcoming Shows Section',
      type: 'boolean',
      initialValue: true,
      group: 'visibility',
    }),
    defineField({
      name: 'showBookingSection',
      title: 'Show Booking Section',
      type: 'boolean',
      initialValue: true,
      group: 'visibility',
    }),
    defineField({
      name: 'showGallerySection',
      title: 'Show Gallery Section',
      type: 'boolean',
      initialValue: true,
      group: 'visibility',
    }),
    defineField({
      name: 'showNewsletterSection',
      title: 'Show Newsletter Section',
      type: 'boolean',
      initialValue: true,
      group: 'visibility',
    }),

    // ────────── LEGACY VIDEOS (migration only — hidden unless data exists) ──────────
    defineField({
      name: 'featuredVideoUrl',
      title: 'Legacy: Featured Video URL',
      type: 'string',
      description: 'Old field — copy value into the Live Videos list, then clear.',
      hidden: ({document}) => !hasLegacyVideo(document),
      group: 'legacyVideos',
    }),
    defineField({
      name: 'featuredVideoTitle',
      title: 'Legacy: Featured Video Title',
      type: 'string',
      hidden: ({document}) => !hasLegacyVideo(document),
      group: 'legacyVideos',
    }),
    defineField({
      name: 'studioVideo1Url',
      title: 'Legacy: Studio Video 1 URL',
      type: 'url',
      hidden: ({document}) => !hasLegacyVideo(document),
      group: 'legacyVideos',
    }),
    defineField({
      name: 'studioVideo1Title',
      title: 'Legacy: Studio Video 1 Title',
      type: 'string',
      hidden: ({document}) => !hasLegacyVideo(document),
      group: 'legacyVideos',
    }),
    defineField({
      name: 'studioVideo2Url',
      title: 'Legacy: Studio Video 2 URL',
      type: 'url',
      hidden: ({document}) => !hasLegacyVideo(document),
      group: 'legacyVideos',
    }),
    defineField({
      name: 'studioVideo2Title',
      title: 'Legacy: Studio Video 2 Title',
      type: 'string',
      hidden: ({document}) => !hasLegacyVideo(document),
      group: 'legacyVideos',
    }),

    // ────────── SEO ──────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description:
        'Override the page title in search results (defaults to "Kivett Bednar | Blues Guitarist & Musician")',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Override the meta description for search engines',
      group: 'seo',
    }),
  ],
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'music', title: 'Listen'},
    {name: 'about', title: 'About'},
    {name: 'upcomingShows', title: 'Upcoming Shows'},
    {name: 'liveVideos', title: 'Live Videos'},
    {name: 'booking', title: 'Booking'},
    {name: 'gallery', title: 'Gallery'},
    {name: 'newsletter', title: 'Newsletter'},
    {name: 'visibility', title: 'Section Visibility'},
    {name: 'legacyVideos', title: 'Legacy Videos'},
    {name: 'seo', title: 'SEO'},
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
