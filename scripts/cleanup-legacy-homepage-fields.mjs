#!/usr/bin/env node
/**
 * Strip legacy fields from the homePage document. The home-page schema
 * was pruned in commit 927e038 (album, parallax, performance, studio,
 * lessons-CTA, perfect-for sections were removed) but the data was left
 * in place to avoid risk. Sanity Studio now shows these as "Unknown
 * fields" warnings, which is alarming for a non-technical owner. This
 * script unsets them so the warnings disappear.
 *
 * Usage:
 *   node scripts/cleanup-legacy-homepage-fields.mjs           # dry run
 *   node scripts/cleanup-legacy-homepage-fields.mjs --write   # apply
 */
import {createClient} from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25'
const token =
  process.env.SANITY_WRITE_TOKEN ||
  process.env.ADMIN_API_TOKEN ||
  process.env.SANITY_VIEWER_TOKEN ||
  process.env.SANITY_API_READ_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or write-capable token in .env.local')
  process.exit(1)
}

// Fields removed from the homePage schema in commit 927e038. Listed
// explicitly so this script never accidentally unsets a current field.
const LEGACY_FIELDS = [
  'albumDescription',
  'albumFeatures',
  'albumFormat',
  'albumTitle',
  'albumYear',
  'bookingEventTypes',
  'bookingPerfectForHeading',
  'ctaLessonsButtonText',
  'ctaLessonsHeading',
  'ctaLessonsText',
  'parallaxHeading',
  'parallaxImages',
  'parallaxSubheading',
  'performanceImage',
  'performanceSectionHeading',
  'showAlbumSection',
  'showLessonsSection',
  'showStudioVideos',
  'studioSectionHeading',
  'studioSectionSubheading',
]

const args = process.argv.slice(2)
const writeMode = args.includes('--write')
const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

const doc = await client.fetch(`*[_id == "homePage"][0]`)
if (!doc) {
  console.log('No homePage document found.')
  process.exit(0)
}

const present = LEGACY_FIELDS.filter((f) => f in doc)
const draft = await client.fetch(`*[_id == "drafts.homePage"][0]`)
const presentInDraft = draft ? LEGACY_FIELDS.filter((f) => f in draft) : []

console.log(`Published homePage has ${present.length} legacy field(s):`)
present.forEach((f) => console.log(`  - ${f}`))
if (draft) {
  console.log(`Draft homePage has ${presentInDraft.length} legacy field(s):`)
  presentInDraft.forEach((f) => console.log(`  - ${f}`))
}

if (present.length === 0 && presentInDraft.length === 0) {
  console.log('Nothing to clean up.')
  process.exit(0)
}

if (!writeMode) {
  console.log('\nDry run. Re-run with --write to unset these fields.')
  process.exit(0)
}

if (present.length > 0) {
  await client.patch('homePage').unset(present).commit()
  console.log(`✓ Unset ${present.length} fields on published homePage.`)
}
if (presentInDraft.length > 0) {
  await client.patch('drafts.homePage').unset(presentInDraft).commit()
  console.log(`✓ Unset ${presentInDraft.length} fields on draft homePage.`)
}

console.log('\nDone. Reload Sanity Studio — the "Unknown fields" warning should be gone.')
