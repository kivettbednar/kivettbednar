import './globals.css'

import {Inter, Playfair_Display, Anton} from 'next/font/google'
import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing, toPlainText} from 'next-sanity'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import {GrainOverlay} from '@/components/ui/GrainOverlay'
import * as demo from '@/sanity/lib/demo'
import {client} from '@/sanity/lib/client'
import {SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from './client-utils'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter-nf',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-nf',
})

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-anton-nf',
})

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  let settings: import('@/sanity.types').SettingsQueryResult | null
  try {
    settings = await client.fetch(
      settingsQuery,
      {},
      {
        // Metadata should never contain stega
        next: {revalidate: 60},
      },
    )
  } catch {
    // Fallback to demo content if Sanity is unavailable during build
    settings = null
  }
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`bg-white text-black ${inter.variable} ${playfairDisplay.variable} ${anton.variable}`}>
      <body className="overflow-x-hidden">
        <GrainOverlay />
        <section className="min-h-screen">
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster />
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          {children}
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}
