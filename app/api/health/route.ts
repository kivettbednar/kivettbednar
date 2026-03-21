import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {settingsQuery} from '@/sanity/lib/queries'

export async function GET() {
  let sanity: {ok: boolean; error?: string} = {ok: true}
  try {
    // Small, safe query; perspective defaults to published
    await client.fetch(settingsQuery, {}, {next: {revalidate: 1}})
  } catch (err: unknown) {
    sanity = {ok: false, error: err instanceof Error ? err.message : 'Sanity fetch failed'}
  }

  return NextResponse.json({
    status: 'ok',
    sanity,
    time: Date.now(),
  })
}

