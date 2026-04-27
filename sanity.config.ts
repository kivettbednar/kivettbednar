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

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() resolves the URL path for different document types — used
// by the Presentation tool to deep-link into the live site.
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'product':
      return slug ? `/merch/${slug}` : undefined
    case 'event':
      return slug ? `/shows/${slug}` : undefined
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
          {
            route: '/',
            filter: `_type == "homePage" || _type == "settings" && _id == "settings"`,
          },
          {
            route: '/merch/:slug',
            filter: `_type == "product" && slug.current == $slug`,
          },
          {
            route: '/shows/:slug',
            filter: `_type == "event" && slug.current == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          homePage: defineLocations({
            locations: [homeLocation],
            message: 'This is the home page content',
            tone: 'positive',
          }),
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
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
