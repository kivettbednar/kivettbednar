import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {allProductsQuery} from '@/sanity/lib/queries'

export async function GET() {
  try {
    const products = await client.fetch(allProductsQuery)
    return NextResponse.json(products || [])
  } catch (error: unknown) {
    console.error('Error fetching products from Sanity:', error)
    return NextResponse.json([], {status: 500})
  }
}
