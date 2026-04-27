import {revalidatePath, revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const {body, isValidSignature} = await parseBody<{
      _type: string
      slug?: {current: string}
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    // Require secret in production — reject all requests if not configured
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Revalidation secret not configured', {status: 501})
    }
    if (!isValidSignature) {
      return new Response('Invalid signature', {status: 401})
    }

    if (!body?._type) {
      return new Response('Bad Request', {status: 400})
    }

    // Revalidate based on document type. Each branch invalidates the
    // most-specific affected route(s) to keep things fast; site-wide
    // edits fall through to the layout-level invalidation.
    switch (body._type) {
      // Home
      case 'homePage':
        revalidatePath('/')
        break

      // Single-page singletons
      case 'showsPage':
        revalidatePath('/shows')
        break
      case 'lessonsPage':
        revalidatePath('/lessons')
        break
      case 'setlistPage':
        revalidatePath('/setlist')
        break
      case 'merchPage':
        revalidatePath('/merch')
        break
      case 'contactPage':
        revalidatePath('/contact')
        break
      case 'ampsPage':
        revalidatePath('/amps')
        break
      case 'bio':
        revalidatePath('/bio')
        break
      case 'epkPage':
        revalidatePath('/epk')
        break
      case 'orderConfirmationPage':
        revalidatePath('/order-confirmation')
        break
      case 'privacyPolicy':
        revalidatePath('/privacy-policy')
        break
      case 'termsOfService':
        revalidatePath('/terms')
        break
      case 'returnsPolicy':
        revalidatePath('/returns')
        break

      // Documents that affect a list view + a detail view
      case 'event':
        revalidatePath('/shows')
        revalidatePath('/')
        if (body.slug?.current) {
          revalidatePath(`/shows/${body.slug.current}`)
        }
        break
      case 'product':
        revalidatePath('/merch')
        if (body.slug?.current) {
          revalidatePath(`/merch/${body.slug.current}`)
        }
        break
      case 'lessonPackage':
        revalidatePath('/lessons')
        if (body.slug?.current) {
          revalidatePath(`/lessons/${body.slug.current}`)
        }
        break
      case 'song':
        revalidatePath('/setlist')
        break
      case 'productCollection':
        revalidatePath('/merch')
        break

      // Site-wide types — header/footer labels, page-visibility flags,
      // store-level config, cart/checkout copy, legal-page references.
      case 'settings':
      case 'uiText':
      case 'storeSettings':
      case 'checkoutSettings':
        revalidatePath('/', 'layout')
        break

      default:
        // Anything else (orders, subscribers, promo codes) doesn't render.
        // No revalidation needed — short-circuit so we don't churn the cache.
        break
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: unknown) {
    console.error(err)
    return new Response('Internal server error', {status: 500})
  }
}
