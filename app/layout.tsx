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
import {SanityLive} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from './client-utils'
import {getSiteSettings} from '@/lib/site-settings'

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
  const settings = await getSiteSettings()
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
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} ${anton.variable}`}
      style={{backgroundColor: '#0a0a0a'}}
    >
      <body className="overflow-x-hidden">
        <GrainOverlay />
        <section className="min-h-screen">
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
          {children}
        </section>
        <SanityLive onError={handleError} />
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  )
}
