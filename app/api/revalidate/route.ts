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

    // Revalidate based on document type
    switch (body._type) {
      case 'homePage':
        revalidatePath('/')
        break
      case 'event':
        revalidatePath('/shows')
        revalidatePath('/')
        if (body.slug?.current) {
          revalidatePath(`/shows/${body.slug.current}`)
        }
        break
      case 'settings':
      case 'uiText':
        // These affect all pages
        revalidatePath('/', 'layout')
        break
      case 'contactPage':
        revalidatePath('/contact')
        break
      case 'showsPage':
        revalidatePath('/shows')
        break
      case 'setlistPage':
        revalidatePath('/setlist')
        break
      case 'lessonsPage':
        revalidatePath('/lessons')
        break
      case 'merchPage':
        revalidatePath('/merch')
        break
      case 'product':
        revalidatePath('/merch')
        if (body.slug?.current) {
          revalidatePath(`/merch/${body.slug.current}`)
        }
        break
      case 'song':
        revalidatePath('/setlist')
        break
      default:
        // For any other content type, revalidate all pages
        revalidatePath('/', 'layout')
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
