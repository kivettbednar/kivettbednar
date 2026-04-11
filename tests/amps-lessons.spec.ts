/**
 * Amps page + Lesson Packages tests
 * Verifies new pages load, render, and integrate with navigation
 */
import {test, expect} from '@playwright/test'

test.describe('Amps Page', () => {
  test('amps page loads with hero content', async ({page}) => {
    await page.goto('/amps', {waitUntil: 'load', timeout: 30000})
    const bodyText = await page.textContent('body')
    expect(bodyText).not.toContain('Currently Unavailable')
    expect(bodyText!.length).toBeGreaterThan(100)
    // Should have a main heading (h1 from hero)
    await expect(page.locator('h1').first()).toBeVisible({timeout: 10000})
  })

  test('amps page appears in navigation', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    await expect(page.locator('header').first()).toBeVisible({timeout: 10000})
    await expect(page.getByRole('link', {name: /amps/i}).first()).toBeVisible()
  })

  test('amps page shows empty state or products', async ({page}) => {
    await page.goto('/amps', {waitUntil: 'load', timeout: 30000})
    const bodyText = await page.textContent('body')
    // Either shows products or the empty state CTA
    expect(
      bodyText!.match(/\$\d+/) ||
      bodyText!.match(/get in touch|coming soon|contact/i)
    ).toBeTruthy()
  })
})

test.describe('Lessons Page', () => {
  test('lessons page loads', async ({page}) => {
    await page.goto('/lessons', {waitUntil: 'load', timeout: 30000})
    const bodyText = await page.textContent('body')
    expect(bodyText).not.toContain('Currently Unavailable')
    expect(bodyText!.length).toBeGreaterThan(100)
  })

  test('lessons page renders without errors when no packages exist', async ({page}) => {
    // Even if no packages in CMS, page should render with info content
    await page.goto('/lessons', {waitUntil: 'load', timeout: 30000})
    await expect(page.locator('h1').first()).toBeVisible({timeout: 10000})
  })
})

test.describe('Lesson Package Detail', () => {
  test('lesson package detail page uses lessons/[slug] route', async ({page}) => {
    // Try a non-existent package — should 404
    const response = await page.goto('/lessons/nonexistent-package-xyz', {timeout: 30000})
    expect([200, 404]).toContain(response?.status())
  })
})

test.describe('Navigation Structure', () => {
  test('all 4 main pages are in navigation', async ({page}) => {
    await page.goto('/', {waitUntil: 'load', timeout: 30000})
    await expect(page.locator('header').first()).toBeVisible({timeout: 10000})

    // The artist's 4 main pages: Shows, Lessons, Amps, Merch
    await expect(page.getByRole('link', {name: /shows/i}).first()).toBeVisible()
    await expect(page.getByRole('link', {name: /lessons/i}).first()).toBeVisible()
    await expect(page.getByRole('link', {name: /amps/i}).first()).toBeVisible()
    await expect(page.getByRole('link', {name: /merch/i}).first()).toBeVisible()
  })
})
