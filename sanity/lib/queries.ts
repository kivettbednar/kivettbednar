import {defineQuery} from 'next-sanity'

/**
 * GROQ queries for Kivett Bednar site
 */

// Settings & Navigation
export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  _id,
  title,
  description,
  ogImage{
    asset->,
    alt
  },
  contactEmail,
  bookingUrl,
  socialLinks[]{
    platform,
    url
  },
  showShowsPage,
  showLessonsPage,
  showSetlistPage,
  showAmpsPage,
  showMerchPage,
  showBioPage,
  showEpkPage,
  showContactPage
}`)

// Store Settings (admin-controlled operational config)
export const storeSettingsQuery = defineQuery(`*[_type == "storeSettings"][0]{
  storeEnabled,
  storeName,
  siteUrl,
  currency,
  adminEmail,
  emailFromName,
  emailFromAddress,
  orderConfirmationSubject,
  shippingUpdateSubject,
  shippingCountries,
  processingTime,
  returnPolicyDays,
  returnPolicyNotes,
  contactFormSubject,
  fulfillmentFailureSubject,
  newOrderSubject,
  emailSignature
}`)

// UI Text & Labels
export const uiTextQuery = defineQuery(`*[_type == "uiText"][0]{
  _id,
  siteName,
  siteTagline,
  navShows,
  navLessons,
  navSetlist,
  navAmps,
  navMerch,
  navContact,
  navBio,
  navEpk,
  footerBioLabel,
  footerEpkLabel,
  footerNavigationHeading,
  footerConnectHeading,
  footerCopyrightText,
  formLabelName,
  formLabelEmail,
  formLabelSubject,
  formLabelMessage,
  formButtonSubmit,
  formButtonSending,
  formSuccessHeading,
  formSuccessMessage,
  formSendAnotherText,
  formPlaceholderName,
  formPlaceholderEmail,
  formPlaceholderSubject,
  formPlaceholderMessage,
  newsletterButtonText,
  newsletterSuccessText,
  newsletterPlaceholder,
  newsletterDisclaimer,
  footerBookingText,
  buttonViewSetlist,
  buttonScheduleLesson,
  buttonBookLesson,
  buttonEmailMe,
  buttonGetInTouch,
  linkSeeAllShows,
  linkUpcomingShows,
  linkGuitarLessons,
  linkBluesSetlist,
  showsCountSingular,
  showsCountPlural,
  upcomingPrefix,
  setlistSubtitleSuffix,
  socialFacebook,
  socialInstagram
}`)

// Home Page
export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  heroSlides[]{
    _key,
    image{
      asset->{_id, url},
      hotspot,
      crop,
      alt
    },
    mobileImage{
      asset->{_id, url},
      hotspot,
      crop,
      alt
    },
    alt,
    desktopPosition,
    mobilePosition
  },
  heroHeading,
  heroHeadingDesktopSize,
  heroHeadingMobileSize,
  heroHeadingTracking,
  heroHeadingLineHeight,
  heroSubheadingTracking,
  heroSubheadingLineHeight,
  heroSubheading,
  heroTagline,
  heroButtonText,
  marqueeTopItems[]{text, style},
  marqueeBottomItems[]{text, style},
  aboutHeading,
  aboutText,
  aboutVerticalLabel,
  aboutImage{
    asset->{_id, url},
    hotspot,
    crop,
    desktopPosition,
    mobilePosition,
    alt
  },
  aboutButtonText,
  gallerySectionHeading,
  gallerySectionSubheading,
  galleryImages[]{
    _key,
    image{
      asset->{_id, url},
      hotspot,
      crop,
      desktopPosition,
      mobilePosition,
      alt
    },
    alt,
    width,
    height
  },
  upcomingShowsHeading,
  seeAllShowsLinkText,
  featuredVideoHeading,
  featuredVideoSubheading,
  liveVideos[]{url, title, subtitle},
  "legacyFeaturedVideoUrl": featuredVideoUrl,
  "legacyFeaturedVideoTitle": featuredVideoTitle,
  "legacyStudioVideo1Url": studioVideo1Url,
  "legacyStudioVideo1Title": studioVideo1Title,
  "legacyStudioVideo2Url": studioVideo2Url,
  "legacyStudioVideo2Title": studioVideo2Title,
  bookingSectionHeading,
  bookingSectionIntro,
  bookingInquiriesHeading,
  bookingInquiriesText,
  bookingInquiryListHeading,
  bookingInquiryItems,
  bookingTestimonialQuote,
  bookingTestimonialAttribution,
  newsletterHeading,
  newsletterText,
  showAboutSection,
  showUpcomingShows,
  showBookingSection,
  showGallerySection,
  showNewsletterSection,
  showMusicSection,
  musicSectionHeading,
  musicSectionSubheading,
  spotifyArtistId,
  spotifyPlaylistId,
  spotifyEmbedType,
  appleMusicUrl,
  bandcampUrl,
  seoTitle,
  seoDescription
}`)

// Lessons Page
export const lessonsPageQuery = defineQuery(`*[_type == "lessonsPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  stats[]{
    _key,
    label,
    value,
    suffix
  },
  philosophyHeading,
  philosophyText,
  philosophyImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  learningItemsHeading,
  learningItems[]{
    _key,
    title,
    description
  },
  ctaBoxHeading,
  ctaBoxText,
  credentials,
  teachingImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  performanceImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  emailButtonText,
  scheduleButtonText,
  testimonialQuote,
  testimonialAttribution,
  packagesHeading,
  packagesSubheading,
  packagesCtaText,
  seoTitle,
  seoDescription
}`)

// Contact Page
export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  portraitImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  portraitGallery[]{
    _key,
    image{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt}
  },
  formHeading,
  directContactHeading,
  directContactDescription,
  socialHeading,
  quickLinksHeading,
  aboutHeading,
  quickLinkShowsText,
  quickLinkLessonsText,
  quickLinkSetlistText,
  ctaSectionHeading,
  ctaSectionText,
  ctaSectionButtonText,
  locationMapQuery,
  connectHeading,
  bookingCardTitle,
  bookingCardDescription,
  bookingCardLinkText,
  lessonsCardTitle,
  lessonsCardDescription,
  lessonsCardLinkText,
  locationCardTitle,
  locationCardRegion,
  locationCardDescription,
  locationCardLinkText,
  socialSubheading,
  seoTitle,
  seoDescription
}`)

// Setlist Page
export const setlistPageQuery = defineQuery(`*[_type == "setlistPage"][0]{
  _id,
  heroHeading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  introText,
  performanceImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  guitarImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  ctaHeading,
  ctaText,
  ctaBookLessonButtonText,
  ctaContactButtonText,
  subtitleSuffix,
  repertoireHeading,
  songCountSummaryText,
  requestHeading,
  requestText,
  requestButtonText,
  statsLabel1,
  statsLabel2,
  statsLabel3,
  statsValue3,
  seoTitle,
  seoDescription
}`)

// Shows Page
export const showsPageQuery = defineQuery(`*[_type == "showsPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  heroMobileImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  performanceGalleryHeading,
  performanceGallerySubheading,
  performanceImages[]{
    _key,
    image{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
    alt,
    caption
  },
  upcomingShowsHeading,
  emptyStateHeading,
  emptyStateText,
  showCountPrefix,
  showSingular,
  showPlural,
  statsLabel1,
  statsLabel2,
  statsLabel3,
  eventDetailsLabel,
  dateTimeLabel,
  venueLabel,
  viewOnMapText,
  getTicketsText,
  soldOutText,
  backToShowsText,
  shareEventText,
  importantInfoText,
  canceledBadgeText,
  soldOutBadgeText,
  canceledMessageText,
  seoTitle,
  seoDescription,
  defaultEventImage{asset->{_id, url}, hotspot, crop, alt}
}`)

// Merch Page
export const merchPageQuery = defineQuery(`*[_type == "merchPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  emptyStateHeading,
  emptyStateText,
  emptyStateButton1Text,
  emptyStateButton1Link,
  emptyStateButton2Text,
  emptyStateButton2Link,
  contentHeading,
  contentSubheading,
  trustBadges[]{
    _key,
    title,
    description,
    icon
  },
  seoTitle,
  seoDescription
}`)

// Amps Page
export const ampsPageQuery = defineQuery(`*[_type == "ampsPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{
    asset->,
    alt
  },
  showcaseHeading,
  showcaseText,
  craftsmanshipHeading,
  craftsmanshipText,
  craftsmanshipImage{
    asset->,
    alt
  },
  shopHeading,
  shopSubheading,
  emptyStateHeading,
  emptyStateText,
  seoTitle,
  seoDescription
}`)

// Amps products (category filter) — same slim shape as allProductsQuery
export const ampsProductsQuery = defineQuery(`*[_type == "product" && category == "amps" && !archived] | order(featured desc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "image": images[0]{
    "asset": asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    hotspot,
    crop,
    desktopPosition,
    mobilePosition,
    alt
  },
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  featured,
  badges,
  tags,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold,
  "hasOptions": count(options) > 0
}`)

// Lesson Packages
export const allLessonPackagesQuery = defineQuery(`*[_type == "lessonPackage" && active == true && !archived] | order(order asc, priceCents asc) {
  _id,
  title,
  "slug": slug.current,
  tagline,
  image{
    asset->,
    alt
  },
  priceCents,
  currency,
  compareAtPriceCents,
  duration,
  sessionsCount,
  sessionLength,
  level,
  format,
  features,
  includes,
  featured,
  badge,
  active
}`)

export const lessonPackageBySlugQuery = defineQuery(`*[_type == "lessonPackage" && slug.current == $slug && !archived][0]{
  _id,
  title,
  "slug": slug.current,
  tagline,
  image{
    asset->,
    alt
  },
  description,
  priceCents,
  currency,
  compareAtPriceCents,
  duration,
  sessionsCount,
  sessionLength,
  level,
  format,
  features,
  includes,
  featured,
  badge,
  active,
  seoTitle,
  seoDescription
}`)

// Legal Pages
export const privacyPolicyQuery = defineQuery(`*[_type == "privacyPolicy"][0]{
  _id,
  pageTitle,
  lastUpdated,
  seoDescription,
  content
}`)

export const termsOfServiceQuery = defineQuery(`*[_type == "termsOfService"][0]{
  _id,
  pageTitle,
  lastUpdated,
  seoDescription,
  content
}`)

export const returnsPolicyQuery = defineQuery(`*[_type == "returnsPolicy"][0]{
  _id,
  pageTitle,
  lastUpdated,
  seoDescription,
  content
}`)

// Bio Page
export const bioQuery = defineQuery(`*[_type == "bio"][0]{
  _id,
  pageTitle,
  tagline,
  lastUpdated,
  seoDescription,
  heroImage{asset->, hotspot, crop, alt},
  content
}`)

// EPK (Electronic Press Kit) Page
export const epkPageQuery = defineQuery(`*[_type == "epkPage"][0]{
  _id,
  heroImage{asset->, hotspot, crop, alt},
  pageIntro,
  genres,
  influencedBy,
  shortBio,
  longBio,
  bookingContactName,
  bookingContactEmail,
  bookingContactPhone,
  bookingNotes,
  pressPhotos[]{
    _key,
    asset->,
    alt,
    caption,
    credit
  },
  videos[]{
    _key,
    title,
    url,
    description
  },
  pressQuotes[]{
    _key,
    quote,
    source,
    sourceUrl,
    logo{asset->, alt}
  },
  notableShows[]{
    _key,
    venue,
    city,
    date,
    event
  },
  stagePlotPdf{asset->{url, originalFilename}},
  techRiderPdf{asset->{url, originalFilename}},
  fullPressKitPdf{asset->{url, originalFilename}},
  onesheet{asset->{url, originalFilename}},
  seoTitle,
  seoDescription
}`)

// Checkout Settings
export const checkoutSettingsQuery = defineQuery(`*[_type == "checkoutSettings"][0]{
  _id,
  trustBadges[]{
    _key,
    title,
    description,
    icon
  },
  deliveryEstimateText,
  secureCheckoutText,
  cartHeading,
  cartEmptyHeading,
  cartEmptyText,
  cartEmptyButtonText,
  secureCheckoutHeading,
  redirectingHeading,
  redirectingText,
  redirectingSubtext,
  orderSummaryHeading,
  returnToCartText,
  sslEncryptionText,
  checkoutUnavailableHeading
}`)

// Order Confirmation Page
export const orderConfirmationPageQuery = defineQuery(`*[_type == "orderConfirmationPage"][0]{
  _id,
  thankYouHeading,
  orderConfirmedLabel,
  orderReceivedText,
  whatsNextHeading,
  nextStepEmail,
  nextStepShipping,
  nextStepTracking,
  continueShoppingText,
  viewShowsText,
  noOrderHeading,
  noOrderText
}`)

// Songs
export const allSongsQuery = defineQuery(`*[_type == "song"] | order(order asc){
  _id,
  title,
  key,
  artist,
  notes,
  order
}`)


// Events
export const upcomingEventsQuery = defineQuery(`*[_type == "event" && startDateTime >= $now && !isCanceled && !archived] | order(startDateTime asc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  startDateTime,
  endDateTime,
  timezone,
  venue,
  address,
  city,
  state,
  country,
  ticketUrl,
  description,
  coverImage{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  isCanceled,
  isSoldOut
}`)

export const pastEventsQuery = defineQuery(`*[_type == "event" && startDateTime < $now && !archived] | order(startDateTime desc)[$offset...$limit]{
  _id,
  title,
  startDateTime,
  timezone,
  venue,
  city,
  state,
  country,
  coverImage{asset->, hotspot, crop, desktopPosition, mobilePosition, alt}
}`)

export const eventsByMonthQuery = defineQuery(`*[_type == "event" && dateTime(startDateTime) >= dateTime($startOfMonth) && dateTime(startDateTime) < dateTime($endOfMonth) && !archived] | order(startDateTime asc){
  _id,
  title,
  startDateTime,
  timezone,
  venue,
  city,
  ticketUrl,
  isCanceled,
  isSoldOut
}`)

// Event detail pages
// Note: This query handles both slugs and IDs as fallback for events without slugs
export const eventBySlugQuery = defineQuery(`*[_type == "event" && (slug.current == $slug || _id == $slug) && !archived][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  startDateTime,
  endDateTime,
  timezone,
  venue,
  address,
  city,
  state,
  country,
  ticketUrl,
  description,
  coverImage{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  heroImage{asset->, hotspot, crop, desktopPosition, alt},
  heroImageMobile{asset->, hotspot, crop, mobilePosition, alt},
  lineup[]{name, role, bio},
  specialNotes,
  isCanceled,
  isSoldOut
}`)

// Returns slugs for events that have them, and _id as fallback for events without slugs
export const eventsSlugs = defineQuery(`*[_type == "event" && !archived]{
  "slug": coalesce(slug.current, _id)
}`)

// Products
// Slim query for product grid cards — only fetches the first image with LQIP blur data
// and a precomputed hasOptions flag. Full images[] + variants fetched via productBySlugQuery on detail pages.
export const allProductsQuery = defineQuery(`*[_type == "product" && !archived] | order(featured desc, _createdAt desc){
  _id,
  title,
  "slug": slug.current,
  "image": images[0]{
    "asset": asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    hotspot,
    crop,
    desktopPosition,
    mobilePosition,
    alt
  },
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  featured,
  badges,
  tags,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold,
  "hasOptions": count(options) > 0
}`)

export const productBySlugQuery = defineQuery(`*[_type == "product" && slug.current == $slug && !archived][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  images[]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  featured,
  badges,
  tags,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold,
  availableDate,
  materials,
  careInstructions,
  dimensions,
  options[]{name, values},
  variants[]{optionValues, priceCents, sku},
  gelatoProductUid,
  printAreas[]{areaName, artwork{asset->}},
  shippingNotes,
  relatedProducts[]->{
    _id,
    title,
    "slug": slug.current,
    images[0]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
    priceCents,
    compareAtPriceCents,
    onSale,
    currency,
    category,
    badges
  },
  seo{title, description, ogImage{asset->}}
}`)

export const productSlugsQuery = defineQuery(`*[_type == "product" && defined(slug.current) && !archived]{
  "slug": slug.current
}`)

export const relatedProductsByCategoryQuery = defineQuery(`*[_type == "product" && category == $category && _id != $excludeId && !archived] | order(_createdAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  "image": images[0]{
    "asset": asset->{_id, url, metadata{lqip, dimensions}},
    hotspot, crop, desktopPosition, mobilePosition, alt
  },
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  stockStatus,
  badges,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold,
  "hasOptions": count(options) > 0
}`)

export const featuredProductsQuery = defineQuery(`*[_type == "product" && featured == true && !archived] | order(_createdAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  "image": images[0]{
    "asset": asset->{_id, url, metadata{lqip, dimensions}},
    hotspot, crop, desktopPosition, mobilePosition, alt
  },
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  featured,
  badges,
  tags,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold,
  "hasOptions": count(options) > 0
}`)

// Product search
export const productSearchQuery = defineQuery(`*[_type == "product" && !archived && (
  title match $searchTerm
  || category match $searchTerm
  || tags[] match $searchTerm
)] | order(_score desc, _createdAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  images[0]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  badges,
  tags
}`)

// Collections
export const allCollectionsQuery = defineQuery(`*[_type == "productCollection"] | order(displayOrder asc, _createdAt desc){
  _id,
  title,
  "slug": slug.current,
  description,
  image{asset->, alt},
  featured,
  displayOrder,
  "productSlugs": products[]->slug.current
}`)

export const collectionBySlugQuery = defineQuery(`*[_type == "productCollection" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  image{asset->, alt},
  "products": products[]->{
    _id,
    title,
    "slug": slug.current,
    images[]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
    priceCents,
    compareAtPriceCents,
    onSale,
    currency,
    category,
    stockStatus,
    featured,
    badges,
    tags,
    inventoryQuantity,
    trackInventory,
    lowStockThreshold
  }
}`)

// Promo codes
export const promoCodeByCodeQuery = defineQuery(`*[_type == "promoCode" && code == $code && active == true][0]{
  _id,
  code,
  description,
  discountType,
  discountValue,
  minimumPurchaseCents,
  maxUses,
  currentUses,
  validFrom,
  validUntil,
  applicableProducts[]->{_id, title},
  applicableCategories
}`)

// Sitemap
export const sitemapQuery = defineQuery(`*[_type in ["product", "event"] && defined(slug.current) && !archived] | order(_type asc){
  "slug": slug.current,
  _type,
  _updatedAt,
  _type == "event" => {
    startDateTime,
    isCanceled
  }
}`)
