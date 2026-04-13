#!/usr/bin/env node
/**
 * Delete stale test drafts left behind by the studio-editing Playwright spec.
 * These are draft documents (drafts.*) with titles matching the fixtures the
 * e2e tests type into Studio. Safe to run repeatedly.
 *
 * Usage:
 *   node scripts/cleanup-test-drafts.mjs            # dry run
 *   node scripts/cleanup-test-drafts.mjs --write    # actually delete
 */
import {createClient} from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN (or SANITY_API_READ_TOKEN) in .env.local')
  process.exit(1)
}

const dryRun = !process.argv.includes('--write')
const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

// Titles the e2e tests fill into Studio. Add more here if new tests are added.
const TEST_TITLES = ['PLAYWRIGHT TEST PRODUCT', 'PLAYWRIGHT TEST EVENT']

async function main() {
  console.log(`Project: ${projectId} · Dataset: ${dataset} · ${dryRun ? 'DRY RUN' : 'WRITE MODE'}`)
  console.log('')

  const query = `*[
    (_id in path("drafts.**") || _id in path("drafts.*")) &&
    title in $titles
  ]{_id, _type, title}`
  const drafts = await client.fetch(query, {titles: TEST_TITLES})

  if (drafts.length === 0) {
    console.log('No test drafts found. Nothing to do.')
    return
  }

  console.log(`Found ${drafts.length} test draft(s):`)
  for (const d of drafts) {
    console.log(`  ${d._id}  (${d._type})  "${d.title}"`)
  }
  console.log('')

  if (dryRun) {
    console.log('Dry run only. Re-run with --write to delete these documents.')
    return
  }

  const tx = client.transaction()
  for (const d of drafts) {
    tx.delete(d._id)
  }
  const result = await tx.commit()
  console.log(`Deleted ${result.results.length} document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
