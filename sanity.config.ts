/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {cancelGelatoOrderAction} from './sanity/actions/cancelGelatoOrder'
import {retryGelatoOrderAction} from './sanity/actions/retryGelatoOrder'
import {adminGuideTool} from './sanity/tools/adminGuide'

// Environment variables for project configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-projectID'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// resolveHref() resolves the URL path for different document types — used
// by the Presentation tool to deep-link into the live site.
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'product':
      return slug ? `/merch/${slug}` : undefined
    case 'event':
      return slug ? `/shows/${slug}` : undefined
    case 'lessonPackage':
      return slug ? `/lessons/${slug}` : undefined
    default:
      return undefined
  }
}

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Kivett Bednar',
  basePath: '/studio',

  projectId,
  dataset,

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          // Singletons — when the iframe is on /, /shows, /lessons, etc.
          // Presentation surfaces the matching singleton in the right pane
          // so every page is editable in context.
          {route: '/', filter: `_type == "homePage"`},
          {route: '/shows', filter: `_type == "showsPage"`},
          {route: '/lessons', filter: `_type == "lessonsPage"`},
          {route: '/setlist', filter: `_type == "setlistPage"`},
          {route: '/amps', filter: `_type == "ampsPage"`},
          {route: '/merch', filter: `_type == "merchPage"`},
          {route: '/contact', filter: `_type == "contactPage"`},
          {route: '/bio', filter: `_type == "bio"`},
          {route: '/epk', filter: `_type == "epkPage"`},
          {route: '/cart', filter: `_type == "checkoutSettings"`},
          {route: '/checkout', filter: `_type == "checkoutSettings"`},
          {route: '/order-confirmation', filter: `_type == "orderConfirmationPage"`},
          {route: '/privacy-policy', filter: `_type == "privacyPolicy"`},
          {route: '/terms', filter: `_type == "termsOfService"`},
          {route: '/returns', filter: `_type == "returnsPolicy"`},
          // Detail pages
          {route: '/merch/:slug', filter: `_type == "product" && slug.current == $slug`},
          {route: '/shows/:slug', filter: `_type == "event" && slug.current == $slug`},
          {route: '/lessons/:slug', filter: `_type == "lessonPackage" && slug.current == $slug`},
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          homePage: defineLocations({
            locations: [{title: 'Home', href: '/'}],
            message: 'This is the home page content',
            tone: 'positive',
          }),
          settings: defineLocations({
            locations: [{title: 'Site-wide', href: '/'}],
            message: 'This document is used on every page (header, footer, SEO, page visibility).',
            tone: 'positive',
          }),
          uiText: defineLocations({
            locations: [{title: 'Site-wide', href: '/'}],
            message: 'These labels are used across every page (nav, footer, buttons).',
            tone: 'positive',
          }),
          showsPage: defineLocations({
            locations: [{title: 'Shows page', href: '/shows'}],
            message: 'Content for the Shows page.',
            tone: 'positive',
          }),
          lessonsPage: defineLocations({
            locations: [{title: 'Lessons page', href: '/lessons'}],
            message: 'Content for the Lessons page.',
            tone: 'positive',
          }),
          setlistPage: defineLocations({
            locations: [{title: 'Setlist page', href: '/setlist'}],
            message: 'Content for the Setlist page.',
            tone: 'positive',
          }),
          ampsPage: defineLocations({
            locations: [{title: 'Amps page', href: '/amps'}],
            message: 'Content for the Amps page.',
            tone: 'positive',
          }),
          merchPage: defineLocations({
            locations: [{title: 'Merch page', href: '/merch'}],
            message: 'Content for the Merch page.',
            tone: 'positive',
          }),
          contactPage: defineLocations({
            locations: [{title: 'Contact page', href: '/contact'}],
            message: 'Content for the Contact page.',
            tone: 'positive',
          }),
          bio: defineLocations({
            locations: [{title: 'Bio page', href: '/bio'}],
            message: 'Content for the Bio page.',
            tone: 'positive',
          }),
          epkPage: defineLocations({
            locations: [{title: 'Press Kit page', href: '/epk'}],
            message: 'Content for the EPK / Press Kit page.',
            tone: 'positive',
          }),
          orderConfirmationPage: defineLocations({
            locations: [{title: 'Order Confirmation', href: '/order-confirmation'}],
            message: 'Shown to customers after a successful Stripe checkout.',
            tone: 'positive',
          }),
          checkoutSettings: defineLocations({
            locations: [
              {title: 'Cart', href: '/cart'},
              {title: 'Checkout', href: '/checkout'},
            ],
            message: 'Trust badges and checkout copy used on the Cart and Checkout pages.',
            tone: 'positive',
          }),
          storeSettings: defineLocations({
            locations: [{title: 'Store-wide', href: '/merch'}],
            message: 'Operational settings used by checkout, emails, and order fulfillment.',
            tone: 'positive',
          }),
          privacyPolicy: defineLocations({
            locations: [{title: 'Privacy Policy', href: '/privacy-policy'}],
            tone: 'positive',
          }),
          termsOfService: defineLocations({
            locations: [{title: 'Terms of Service', href: '/terms'}],
            tone: 'positive',
          }),
          returnsPolicy: defineLocations({
            locations: [{title: 'Returns & Refunds', href: '/returns'}],
            tone: 'positive',
          }),
          lessonPackage: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {title: doc?.title || 'Lesson Package', href: doc?.slug ? `/lessons/${doc.slug}` : '/lessons'},
                {title: 'Lessons', href: '/lessons'},
              ],
            }),
          }),
          product: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('product', doc?.slug)!,
                },
                {
                  title: 'Merch',
                  href: '/merch',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
          event: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('event', doc?.slug)!,
                },
                {
                  title: 'Shows',
                  href: '/shows',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    visionTool(),
    adminGuideTool(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'order') {
        return [...prev, cancelGelatoOrderAction, retryGelatoOrderAction]
      }
      return prev
    },
  },
})
