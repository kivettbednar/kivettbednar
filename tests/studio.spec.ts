import { test, expect, Page } from '@playwright/test';

async function waitForStudio(page: Page) {
  await page.goto('/studio', { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Wait for Studio to hydrate
  await page.waitForTimeout(5000);

  // Handle CORS origin dialog if it appears
  const continueBtn = page.getByRole('button', { name: /continue/i });
  if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueBtn.click();
    await page.waitForTimeout(3000);
  }

  // Wait for the structure pane to load
  await page.waitForTimeout(3000);
}

test.describe('Sanity Studio', () => {
  test('studio loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await waitForStudio(page);

    // Studio rendered something
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(50);

    // No critical JS errors (ignore ResizeObserver which is benign)
    const criticalErrors = errors.filter(e => !e.includes('ResizeObserver'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('studio sidebar has all expected sections', async ({ page }) => {
    await waitForStudio(page);

    // These sections should be visible in the structure sidebar
    for (const section of ['Site Pages', 'Store Management', 'Orders', 'Events & Content', 'Settings']) {
      await expect(page.getByText(section).first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('can navigate to products list', async ({ page }) => {
    await waitForStudio(page);

    // Click Store Management
    await page.getByText('Store Management').first().click();
    await page.waitForTimeout(2000);

    // Click All Products
    await page.getByText('All Products').first().click();
    await page.waitForTimeout(5000);

    // Should see product titles in the list
    await expect(page.getByText('Blues Legend T-Shirt').first()).toBeVisible({ timeout: 15000 });
  });

  test('can navigate to events', async ({ page }) => {
    await waitForStudio(page);

    // Click Events & Content
    await page.getByText('Events & Content').first().click();
    await page.waitForTimeout(2000);

    // Events option should be visible
    await expect(page.getByText('Events').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to settings and see store settings', async ({ page }) => {
    await waitForStudio(page);

    // Click Settings (use last match to avoid hitting "Checkout Settings" first)
    const settingsItems = page.getByText('Settings');
    // Find the one in the top-level sidebar
    await settingsItems.last().click();
    await page.waitForTimeout(2000);

    // Should see Store Settings and Site Settings
    await expect(page.getByText('Store Settings').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Site Settings').first()).toBeVisible({ timeout: 10000 });
  });

  test('product document shows key fields', async ({ page }) => {
    await waitForStudio(page);

    // Navigate: Store Management → All Products → first product
    await page.getByText('Store Management').first().click();
    await page.waitForTimeout(2000);
    await page.getByText('All Products').first().click();
    await page.waitForTimeout(5000);
    await page.getByText('Blues Legend T-Shirt').first().click();
    await page.waitForTimeout(5000);

    // Product form should show key field labels
    const body = await page.textContent('body');
    expect(body).toMatch(/Title/);
    expect(body).toMatch(/Price/i);
  });
});
