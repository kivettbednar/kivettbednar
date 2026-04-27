import {type ReactNode} from 'react'
import {stegaClean} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'
import {uiTextQuery} from '@/sanity/lib/queries'
import {Header} from '@/components/ui/Header'
import {CartProvider} from '@/components/ui/CartContext'
import {ToastProvider} from '@/components/ui/Toast'
import {Footer} from '@/components/ui/Footer'
import {getSiteSettings, isPageEnabled, type PageVisibilityKey} from '@/lib/site-settings'

export default async function SiteLayout({
  children,
}: {
  children: ReactNode
}) {
  let siteSettings = null
  let uiText = null

  try {
    ;[siteSettings, uiText] = await Promise.all([
      getSiteSettings(),
      sanityFetch({query: uiTextQuery}).then((r) => r.data),
    ])
  } catch (error) {
    console.warn('Failed to fetch layout data, using fallback content:', error)
  }

  // Strip stega encoding from short, layout-sensitive strings (nav, footer
  // labels, copyright). Stega adds invisible Unicode variation selectors
  // for click-to-edit, but they bloat the rendered text width and cause
  // single-word nav links to wrap mid-row in narrow viewports (notably the
  // Studio Presentation iframe). Long-form content (PortableText, body
  // copy, page hero text) keeps stega so the click-to-edit overlay still
  // works there.
  const navConfig: Array<{key: PageVisibilityKey; title: string; href: string}> = [
    {key: 'shows', title: stegaClean(uiText?.navShows) || 'Shows', href: '/shows'},
    {key: 'lessons', title: stegaClean(uiText?.navLessons) || 'Lessons', href: '/lessons'},
    {key: 'setlist', title: stegaClean(uiText?.navSetlist) || 'Setlist', href: '/setlist'},
    {key: 'amps', title: stegaClean(uiText?.navAmps) || 'Amps', href: '/amps'},
    {key: 'merch', title: stegaClean(uiText?.navMerch) || 'Merch', href: '/merch'},
    {key: 'bio', title: stegaClean(uiText?.navBio) || 'Bio', href: '/bio'},
    {key: 'epk', title: stegaClean(uiText?.navEpk) || 'Press Kit', href: '/epk'},
    {key: 'contact', title: stegaClean(uiText?.navContact) || 'Contact', href: '/contact'},
  ]

  const navigation = navConfig
    .filter(({key}) => isPageEnabled(siteSettings, key))
    .map(({key: _key, ...rest}) => rest)

  return (
    <ToastProvider>
      <CartProvider>
        <Header siteName={stegaClean(uiText?.siteName) || undefined} navigation={navigation} />
        <main id="main-content">{children}</main>
        <Footer
          navigation={navigation}
          siteName={stegaClean(uiText?.siteName) || undefined}
          siteTagline={uiText?.siteTagline || undefined}
          navigationHeading={stegaClean(uiText?.footerNavigationHeading) || undefined}
          connectHeading={stegaClean(uiText?.footerConnectHeading) || undefined}
          socialLinks={(siteSettings?.socialLinks?.filter((link) =>
            link.platform !== null && link.url !== null
          ) as Array<{platform: string; url: string}> | undefined) || undefined}
          socialFacebookLabel={stegaClean(uiText?.socialFacebook) || undefined}
          socialInstagramLabel={stegaClean(uiText?.socialInstagram) || undefined}
          copyrightText={stegaClean(uiText?.footerCopyrightText) || undefined}
          bookingText={uiText?.footerBookingText || undefined}
          bioLabel={stegaClean(uiText?.footerBioLabel) || undefined}
          epkLabel={stegaClean(uiText?.footerEpkLabel) || undefined}
          showBio={isPageEnabled(siteSettings, 'bio')}
          showEpk={isPageEnabled(siteSettings, 'epk')}
        />
      </CartProvider>
    </ToastProvider>
  )
}
