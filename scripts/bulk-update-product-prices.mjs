#!/usr/bin/env node
/**
 * Apply a percent change to product prices, optionally scoped to a category.
 * Always runs as a dry-run first; pass --write to commit.
 *
 * Usage:
 *   # Show what a 10% sale across all apparel would do:
 *   node scripts/bulk-update-product-prices.mjs --pct -10 --category apparel
 *
 *   # Apply a 5% markup across every active product:
 *   node scripts/bulk-update-product-prices.mjs --pct 5 --write
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

const pctIdx = args.indexOf('--pct')
const pct = pctIdx !== -1 ? parseFloat(args[pctIdx + 1]) : NaN
if (!Number.isFinite(pct) || pct === 0) {
  console.error('Pass --pct <number>. Negative for discount, positive for markup.')
  process.exit(1)
}

const catIdx = args.indexOf('--category')
const category = catIdx !== -1 ? args[catIdx + 1] : null

const filter = category
  ? `_type == "product" && !archived && category == $category`
  : `_type == "product" && !archived`

const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

const products = await client.fetch(
  `*[${filter}]{_id, title, priceCents, category}`,
  category ? {category} : {},
)

console.log(
  `Found ${products.length} active product(s)${category ? ` in "${category}"` : ''}. ` +
    `Applying ${pct > 0 ? '+' : ''}${pct}%.`,
)

if (products.length === 0) process.exit(0)

const previews = products.map((p) => {
  const newCents = Math.max(0, Math.round((p.priceCents || 0) * (1 + pct / 100)))
  return {...p, newCents}
})

for (const p of previews) {
  console.log(
    `  ${p.title.padEnd(40, ' ')}  $${(p.priceCents / 100).toFixed(2)}  →  $${(p.newCents / 100).toFixed(2)}`,
  )
}

if (!writeMode) {
  console.log('\nDry run. Re-run with --write to apply.')
  process.exit(0)
}

const tx = client.transaction()
for (const p of previews) {
  tx.patch(p._id, {set: {priceCents: p.newCents}})
}
await tx.commit({autoGenerateArrayKeys: true})
console.log(`\n✓ Updated ${previews.length} prices.`)
