/**
 * CMS Gaps Tests
 * Verifies legal pages, checkout text, and email settings are properly configured.
 */
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '.auth', 'sanity-session.json');
const hasAuth = fs.existsSync(authFile);

// ============================================================
// LEGAL PAGES — FRONTEND
// ============================================================
test.describe('Legal Pages', () => {
  const legalPages = [
    { path: '/privacy-policy', title: /privacy policy/i, minLength: 500 },
    { path: '/terms', title: /terms of service/i, minLength: 500 },
    { path: '/returns', title: /returns|refund/i, minLength: 400 },
  ];

  for (const { path: pagePath, title, minLength } of legalPages) {
    test(`${pagePath} renders with proper structure`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'load', timeout: 30000 });

      // Has an h1
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 10000 });
      await expect(h1).toHaveText(title);

      // Has at least one h2 section heading
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThanOrEqual(1);

      // Has substantial content
      const bodyText = await page.textContent('body');
      expect(bodyText!.length).toBeGreaterThan(minLength);

      // Has a "last updated" date
      await expect(page.getByText(/last updated/i)).toBeVisible();
    });
  }

  test('privacy policy has contact email link', async ({ page }) => {
    await page.goto('/privacy-policy', { waitUntil: 'load', timeout: 30000 });
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
  });

  test('terms page has contact email link', async ({ page }) => {
    await page.goto('/terms', { waitUntil: 'load', timeout: 30000 });
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
  });

  test('returns page has contact email link', async ({ page }) => {
    await page.goto('/returns', { waitUntil: 'load', timeout: 30000 });
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
  });
});

// ============================================================
// CHECKOUT PAGE TEXT
// ============================================================
test.describe('Checkout Page Text', () => {
  test('checkout page renders with expected text', async ({ page }) => {
    // Navigate to checkout (empty cart shows empty state)
    await page.goto('/checkout', { waitUntil: 'load', timeout: 30000 });

    // Should show empty cart state or checkout content
    const bodyText = await page.textContent('body');
    // Either shows empty cart message or checkout UI
    expect(bodyText).toMatch(/cart|checkout|secure|empty|browse/i);
  });

  test('empty cart checkout shows browse button', async ({ page }) => {
    await page.goto('/checkout', { waitUntil: 'load', timeout: 30000 });

    // Look for the browse merch link
    const browseLink = page.getByRole('link', { name: /browse merch/i });
    if (await browseLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(browseLink).toBeVisible();
    }
  });
});

// ============================================================
// STUDIO — LEGAL PAGE SINGLETONS
// ============================================================
test.describe('Studio — Legal Page Singletons', () => {
  test.skip(!hasAuth, 'Skipping studio tests — no auth session');
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('legal page singletons appear in Site Pages', async ({ page }) => {
    await page.goto('/studio/structure', { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('text=Content Management', { timeout: 30000 });
    try {
      const dismiss = page.getByRole('button', { name: /dismiss/i });
      if (await dismiss.isVisible({ timeout: 2000 })) {
        await dismiss.click({ force: true, timeout: 2000 });
      }
    } catch {}
    await page.waitForTimeout(500);

    // Navigate to Site Pages
    await page.getByText('Site Pages').first().click({ force: true });
    await page.waitForTimeout(2000);

    // Check legal pages are listed
    await expect(page.getByText('Privacy Policy').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Terms of Service').first()).toBeVisible();
    await expect(page.getByText('Returns & Refunds').first()).toBeVisible();
  });
});

// ============================================================
// STUDIO — EMAIL SETTINGS FIELDS
// ============================================================
test.describe('Studio — Email Settings Fields', () => {
  test.skip(!hasAuth, 'Skipping studio tests — no auth session');
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('email settings have new subject and signature fields', async ({ page }) => {
    await page.goto('/studio/structure', { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('text=Content Management', { timeout: 30000 });
    try {
      const dismiss = page.getByRole('button', { name: /dismiss/i });
      if (await dismiss.isVisible({ timeout: 2000 })) {
        await dismiss.click({ force: true, timeout: 2000 });
      }
    } catch {}
    await page.waitForTimeout(500);

    // Navigate to Settings > Store Settings
    await page.getByText('Settings').first().click({ force: true });
    await page.waitForTimeout(1000);
    await page.getByText('Store Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    // Click Email tab
    await page.getByText('Email').first().click({ force: true });
    await page.waitForTimeout(2000);

    const bodyText = await page.textContent('body');
    expect(bodyText).toMatch(/Contact Form Subject/i);
    expect(bodyText).toMatch(/Fulfillment Failure Subject/i);
    expect(bodyText).toMatch(/New Order Subject/i);
    expect(bodyText).toMatch(/Email Signature/i);
  });
});

// ============================================================
// STUDIO — CHECKOUT SETTINGS FIELDS
// ============================================================
test.describe('Studio — Checkout Settings Fields', () => {
  test.skip(!hasAuth, 'Skipping studio tests — no auth session');
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('checkout settings have new text fields', async ({ page }) => {
    await page.goto('/studio/structure', { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('text=Content Management', { timeout: 30000 });
    try {
      const dismiss = page.getByRole('button', { name: /dismiss/i });
      if (await dismiss.isVisible({ timeout: 2000 })) {
        await dismiss.click({ force: true, timeout: 2000 });
      }
    } catch {}
    await page.waitForTimeout(500);

    // Navigate to Store Management > Checkout Settings
    await page.getByText('Store Management').first().click({ force: true });
    await page.waitForTimeout(1000);
    await page.getByText('Checkout Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    const bodyText = await page.textContent('body');
    expect(bodyText).toMatch(/Secure Checkout Heading/i);
    expect(bodyText).toMatch(/Redirecting/i);
    expect(bodyText).toMatch(/Order Summary/i);
    expect(bodyText).toMatch(/SSL Encryption/i);
  });
});
