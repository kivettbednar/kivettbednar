/**
 * Bio + EPK page tests
 * Verifies new pages load, footer links work, and home page About button routes to bio.
 */
import {test, expect} from '@playwright/test'

test.describe('Bio Page', () => {
  test('bio page loads with title', async ({page}) => {
    await page.goto('/bio', {waitUntil: 'load', timeout: 30000})
    const bodyText = await page.textContent('body')
    expect(bodyText).not.toContain('Currently Unavailable')
    expect(bodyText!.length).toBeGreaterThan(100)
    await expect(page.locator('h1').first()).toBeVisible({timeout: 10000})
  })

  test('bio page shows fallback when no CMS content', async ({page}) => {
    await page.goto('/bio', {waitUntil: 'load', timeout: 30000})
    // Should have either CMS content or the "Bio coming soon" fallback
    const bodyText = await page.textContent('body')
    expect(bodyText).toMatch(/bio|story|coming soon/i)
  })
})

test.describe('EPK Page', () => {
  test('epk page loads', async ({page}) => {
    await page.goto('/epk', {waitUntil: 'load', timeout: 30000})
    const bodyText = await page.textContent('body')
    expect(bodyText).not.toContain('Currently Unavailable')
    expect(bodyText!.length).toBeGreaterThan(100)
  })

  test('epk page shows press kit heading', async ({page}) => {
    await page.goto('/epk', {waitUntil: 'load', timeout: 30000})
    await expect(page.getByText(/press kit|electronic press kit/i).first()).toBeVisible({timeout: 10000})
  })
})

test.describe('Footer Links', () => {
  test('footer shows Bio link', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    const footer = page.locator('footer')
    await expect(footer).toBeVisible({timeout: 10000})
    await expect(footer.getByRole('link', {name: /^bio$/i}).first()).toBeVisible()
  })

  test('footer shows Press Kit link', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    const footer = page.locator('footer')
    await expect(footer).toBeVisible({timeout: 10000})
    await expect(footer.getByRole('link', {name: /press kit/i}).first()).toBeVisible()
  })

  test('Bio footer link goes to /bio', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    const footer = page.locator('footer')
    const bioLink = footer.getByRole('link', {name: /^bio$/i}).first()
    await expect(bioLink).toHaveAttribute('href', '/bio')
  })

  test('Press Kit footer link goes to /epk', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    const footer = page.locator('footer')
    const epkLink = footer.getByRole('link', {name: /press kit/i}).first()
    await expect(epkLink).toHaveAttribute('href', '/epk')
  })
})

test.describe('Home Page About Button', () => {
  test('About section CTA links to /bio', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    // Find a link with href="/bio" (the About button)
    const bioLink = page.locator('a[href="/bio"]').first()
    await expect(bioLink).toBeVisible({timeout: 10000})
  })
})

test.describe('Bio + EPK not in main navigation', () => {
  test('Bio is not in header navigation', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    const header = page.locator('header').first()
    // Should NOT have a /bio link in the header (only in footer)
    const headerBioLinks = await header.locator('a[href="/bio"]').count()
    expect(headerBioLinks).toBe(0)
  })

  test('EPK is not in header navigation', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    const header = page.locator('header').first()
    const headerEpkLinks = await header.locator('a[href="/epk"]').count()
    expect(headerEpkLinks).toBe(0)
  })
})
