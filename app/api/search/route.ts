import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {productSearchQuery} from '@/sanity/lib/queries'

export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url)
    const query = searchParams.get('q')
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)))

    if (!query || query.trim().length < 2) {
      return NextResponse.json({error: 'Search query must be at least 2 characters'}, {status: 400})
    }
    if (query.trim().length > 200) {
      return NextResponse.json({error: 'Search query must be at most 200 characters'}, {status: 400})
    }

    // Use wildcard search for better results
    const searchTerm = `*${query}*`

    const products = await client.fetch(productSearchQuery, {
      searchTerm,
      limit,
    })

    return NextResponse.json(products || [])
  } catch (error: unknown) {
    console.error('Search error:', error)
    return NextResponse.json({error: 'Search failed'}, {status: 500})
  }
}
