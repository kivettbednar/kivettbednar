// Singletons
import {settings} from './singletons/settings'
import {homePage} from './singletons/homePage'
import {showsPage} from './singletons/showsPage'
import {lessonsPage} from './singletons/lessonsPage'
import {contactPage} from './singletons/contactPage'
import {setlistPage} from './singletons/setlistPage'
import {merchPage} from './singletons/merchPage'
import {uiText} from './singletons/uiText'
import {checkoutSettings} from './singletons/checkoutSettings'
import {storeSettings} from './singletons/storeSettings'
import {orderConfirmationPage} from './singletons/orderConfirmationPage'
import {ampsPage} from './singletons/ampsPage'
import {bio} from './singletons/bio'
import {epkPage} from './singletons/epkPage'
import {privacyPolicy} from './singletons/privacyPolicy'
import {termsOfService} from './singletons/termsOfService'
import {returnsPolicy} from './singletons/returnsPolicy'

// Documents
import {event} from './documents/event'
import {product} from './documents/product'
import {promoCode} from './documents/promoCode'
import {productCollection} from './documents/productCollection'
import {order} from './documents/order'
import {newsletterSubscriber} from './documents/newsletterSubscriber'
import {song} from './documents/song'
import {lessonPackage} from './documents/lessonPackage'

// Objects
import {blockContent} from './objects/blockContent'

export const schemaTypes = [
  // Singletons
  settings,
  uiText,
  homePage,
  showsPage,
  lessonsPage,
  contactPage,
  setlistPage,
  merchPage,
  checkoutSettings,
  storeSettings,
  orderConfirmationPage,
  privacyPolicy,
  termsOfService,
  returnsPolicy,
  ampsPage,
  bio,
  epkPage,
  // Documents
  event,
  product,
  promoCode,
  productCollection,
  order,
  song,
  lessonPackage,
  newsletterSubscriber,
  // Objects
  blockContent,
]
