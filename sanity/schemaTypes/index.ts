import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {event} from './documents/event'
import {product} from './documents/product'
import {promoCode} from './documents/promoCode'
import {productCollection} from './documents/productCollection'
import {order} from './documents/order'
import {testimonialsSet} from './documents/testimonialsSet'
import {faqSet} from './documents/faqSet'
import {newsletterSubscriber} from './documents/newsletterSubscriber'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {navigation} from './singletons/navigation'
import {homePage} from './singletons/homePage'
import {showsPage} from './singletons/showsPage'
import {lessonsPage} from './singletons/lessonsPage'
import {contactPage} from './singletons/contactPage'
import {setlistPage} from './singletons/setlistPage'
import {merchPage} from './singletons/merchPage'
import {uiText} from './singletons/uiText'
import {checkoutSettings} from './singletons/checkoutSettings'
import {orderConfirmationPage} from './singletons/orderConfirmationPage'
import {song} from './documents/song'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'

// Module objects
import {hero} from './objects/modules/hero'
import {richText} from './objects/modules/richText'
import {imageGallery} from './objects/modules/imageGallery'
import {featureGrid} from './objects/modules/featureGrid'
import {ctaBanner} from './objects/modules/ctaBanner'
import {videoEmbed} from './objects/modules/videoEmbed'
import {musicEmbed} from './objects/modules/musicEmbed'
import {testimonials} from './objects/modules/testimonials'
import {faq} from './objects/modules/faq'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  navigation,
  uiText,
  homePage,
  showsPage,
  lessonsPage,
  contactPage,
  setlistPage,
  merchPage,
  checkoutSettings,
  orderConfirmationPage,
  // Documents
  page,
  post,
  person,
  event,
  product,
  promoCode,
  productCollection,
  order,
  testimonialsSet,
  faqSet,
  song,
  newsletterSubscriber,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
  // Module objects
  hero,
  richText,
  imageGallery,
  featureGrid,
  ctaBanner,
  videoEmbed,
  musicEmbed,
  testimonials,
  faq,
]
