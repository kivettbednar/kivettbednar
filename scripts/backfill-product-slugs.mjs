#!/usr/bin/env node
/**
 * Backfill missing slugs on existing product documents.
 * Generates slugs from the title and patches any product where
 * slug.current is empty or missing.
 *
 * Usage:
 *   node scripts/backfill-product-slugs.mjs            # dry run (prints what would change)
 *   node scripts/backfill-product-slugs.mjs --write    # actually patch Sanity
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

function slugify(input, maxLength = 96) {
  return String(input)
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')     // strip accents
    .replace(/['"]/g, '')                 // strip quotes
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')          // non-alphanum → dash
    .replace(/^-+|-+$/g, '')              // trim leading/trailing dashes
    .slice(0, maxLength)
    .replace(/-+$/g, '')                  // trim trailing dash after slice
}

async function main() {
  console.log(`Project: ${projectId} · Dataset: ${dataset} · ${dryRun ? 'DRY RUN' : 'WRITE MODE'}`)
  console.log('')

  // Grab every product (published + drafts) and compute missing-slug set client-side
  const products = await client.fetch(
    `*[_type == "product"]{_id, title, "slug": slug.current}`,
  )

  const needsBackfill = products.filter(
    (p) => !p.slug || typeof p.slug !== 'string' || p.slug.trim() === '',
  )

  console.log(`Found ${products.length} products total, ${needsBackfill.length} missing a slug.`)
  if (needsBackfill.length === 0) {
    console.log('Nothing to do.')
    return
  }

  // Avoid collisions: collect all existing slugs and suffix duplicates with -2, -3, etc.
  const existingSlugs = new Set(
    products
      .map((p) => p.slug)
      .filter((s) => typeof s === 'string' && s.trim() !== ''),
  )

  const plan = []
  for (const p of needsBackfill) {
    const base = slugify(p.title || 'product')
    if (!base) {
      console.warn(`  ⚠ Skipping ${p._id}: empty title, cannot derive slug`)
      continue
    }
    let candidate = base
    let n = 2
    while (existingSlugs.has(candidate)) {
      candidate = `${base}-${n++}`
    }
    existingSlugs.add(candidate)
    plan.push({_id: p._id, title: p.title, slug: candidate})
  }

  for (const item of plan) {
    console.log(`  ${item._id}  "${item.title}"  →  ${item.slug}`)
  }
  console.log('')

  if (dryRun) {
    console.log('Dry run only. Re-run with --write to apply these changes.')
    return
  }

  // Apply as one transaction so partial failures roll back
  const tx = client.transaction()
  for (const item of plan) {
    tx.patch(item._id, {set: {slug: {_type: 'slug', current: item.slug}}})
  }
  const result = await tx.commit()
  console.log(`Patched ${result.results.length} document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
