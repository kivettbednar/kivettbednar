#!/usr/bin/env node
/**
 * Archive every event whose start date is more than N days in the past.
 * Default N = 90. Useful as an annual cleanup so the past-events list
 * doesn't grow forever.
 *
 * Usage:
 *   node scripts/bulk-archive-old-events.mjs                  # dry run, default 90 days
 *   node scripts/bulk-archive-old-events.mjs --days 365       # dry run, 1 year
 *   node scripts/bulk-archive-old-events.mjs --days 365 --write
 */
import {createClient} from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or write-capable token in .env.local')
  process.exit(1)
}

const args = process.argv.slice(2)
const writeMode = args.includes('--write')
const daysIdx = args.indexOf('--days')
const days = daysIdx !== -1 ? parseInt(args[daysIdx + 1], 10) : 90
if (!Number.isFinite(days) || days < 0) {
  console.error('--days must be a non-negative integer')
  process.exit(1)
}

const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

const candidates = await client.fetch(
  `*[_type == "event" && startDateTime < $cutoff && !archived]{_id, title, startDateTime}`,
  {cutoff},
)

console.log(`Found ${candidates.length} events older than ${days} days (cutoff ${cutoff}).`)
if (candidates.length === 0) process.exit(0)

for (const e of candidates) {
  console.log(`  ${writeMode ? 'archiving' : 'would archive'}: ${e.title} (${e.startDateTime})`)
}

if (!writeMode) {
  console.log('\nDry run. Re-run with --write to apply.')
  process.exit(0)
}

const tx = client.transaction()
for (const e of candidates) {
  tx.patch(e._id, {set: {archived: true}})
}
await tx.commit({autoGenerateArrayKeys: true})
console.log(`✓ Archived ${candidates.length} events.`)
