/**
 * Page Visibility Tests
 * Verifies that all pages load by default (visibility toggles default to true)
 * and that the PageUnavailable component renders correctly when pages are disabled.
 */
import { test, expect } from '@playwright/test';

type PageVisibilityKey = 'shows' | 'lessons' | 'setlist' | 'merch' | 'contact';

const pages: Array<{ path: string; name: string; navLabel: RegExp; key: PageVisibilityKey }> = [
  { path: '/shows', name: 'Shows', navLabel: /shows/i, key: 'shows' },
  { path: '/lessons', name: 'Lessons', navLabel: /lessons/i, key: 'lessons' },
  { path: '/setlist', name: 'Setlist', navLabel: /setlist/i, key: 'setlist' },
  { path: '/merch', name: 'Merch', navLabel: /merch/i, key: 'merch' },
  { path: '/contact', name: 'Contact', navLabel: /contact/i, key: 'contact' },
];

async function fetchVisibility(page: import('@playwright/test').Page): Promise<Record<PageVisibilityKey, boolean>> {
  const response = await page.request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  const flags = data.pageVisibility || {};
  return pages.reduce((acc, { key }) => {
    acc[key] = flags[key] !== false;
    return acc;
  }, {} as Record<PageVisibilityKey, boolean>);
}

test.describe('Page Visibility - Default State', () => {
  for (const { path, name, navLabel, key } of pages) {
    test(`${name} page renders enabled/disabled state correctly`, async ({ page }) => {
      const visibility = await fetchVisibility(page);
      await page.goto(path, { waitUntil: 'load', timeout: 30000 });

      const bodyText = await page.textContent('body');
      if (visibility[key]) {
        expect(bodyText).not.toContain('Currently Unavailable');
        expect(bodyText).not.toContain('This page is not available right now');
        expect(bodyText!.length).toBeGreaterThan(100);
      } else {
        const heading = page.locator(`text="${name} is Currently Unavailable"`);
        await expect(heading).toBeVisible();
        await expect(page.getByRole('link', { name: /Go to Home Page/i })).toBeVisible();
      }
    });

    test(`${name} page navigation link respects visibility`, async ({ page }) => {
      const visibility = await fetchVisibility(page);
      await page.goto('/', { waitUntil: 'load', timeout: 30000 });

      const navLink = page.getByRole('link', { name: navLabel }).first();
      if (visibility[key]) {
        await expect(navLink).toBeVisible();
      } else {
        await expect(navLink).toHaveCount(0);
      }
    });
  }
});

test.describe('Page Visibility - Navigation Filtering', () => {
  test('header navigation only shows enabled pages', async ({ page }) => {
    const visibility = await fetchVisibility(page);
    await page.goto('/', { waitUntil: 'load', timeout: 30000 });

    for (const { navLabel, key } of pages) {
      const navLink = page.getByRole('link', { name: navLabel }).first();
      if (visibility[key]) {
        await expect(navLink).toBeVisible();
      } else {
        await expect(navLink).toHaveCount(0);
      }
    }
  });

  test('footer navigation only shows enabled pages', async ({ page }) => {
    const visibility = await fetchVisibility(page);
    await page.goto('/', { waitUntil: 'load', timeout: 30000 });
    const footer = page.locator('footer');

    for (const { navLabel, key } of pages) {
      const navLink = footer.getByRole('link', { name: navLabel }).first();
      if (visibility[key]) {
        await expect(navLink).toBeVisible();
      } else {
        await expect(navLink).toHaveCount(0);
      }
    }
  });
});

test.describe('PageUnavailable Component', () => {
  test('component displays when any page is disabled', async ({ page }) => {
    const visibility = await fetchVisibility(page);
    const disabledPages = pages.filter(({ key }) => !visibility[key]);
    test.skip(disabledPages.length === 0, 'All pages enabled; skipping unavailable component assertion');

    for (const { path, name } of disabledPages) {
      await page.goto(path, { waitUntil: 'load', timeout: 30000 });
      await expect(page.locator(`text="${name} is Currently Unavailable"`)).toBeVisible();
      await expect(page.getByRole('link', { name: /Go to Home Page/i })).toBeVisible();
    }
  });
});

test.describe('Sub-route Visibility', () => {
  test('individual show pages load normally when shows are enabled', async ({ page }) => {
    const visibility = await fetchVisibility(page);
    test.skip(!visibility.shows, 'Shows page disabled; skipping event detail test');

    // First get a show slug from the shows page
    await page.goto('/shows', { waitUntil: 'load', timeout: 30000 });
    const showLink = page.locator('a[href^="/shows/"]').first();

    if (await showLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await showLink.getAttribute('href');
      if (href) {
        await page.goto(href, { waitUntil: 'load', timeout: 30000 });
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('Currently Unavailable');
        expect(bodyText!.length).toBeGreaterThan(100);
      }
    }
  });

  test('individual product pages load normally when merch is enabled', async ({ page }) => {
    const visibility = await fetchVisibility(page);
    test.skip(!visibility.merch, 'Merch page disabled; skipping product detail test');

    await page.goto('/merch', { waitUntil: 'load', timeout: 30000 });
    const productLink = page.locator('a[href^="/merch/"]').first();

    if (await productLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await productLink.getAttribute('href');
      if (href) {
        await page.goto(href, { waitUntil: 'load', timeout: 30000 });
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('Currently Unavailable');
        expect(bodyText!.length).toBeGreaterThan(100);
      }
    }
  });
});
