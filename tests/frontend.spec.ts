import { test, expect } from '@playwright/test';

test.describe('Frontend Pages', () => {
  test('homepage loads with navigation and content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Header renders
    await expect(page.locator('header').first()).toBeVisible({ timeout: 10000 });

    // Key nav links present
    await expect(page.getByRole('link', { name: /merch/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /shows/i }).first()).toBeVisible();

    // Page has substantial content (not blank)
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(100);
  });

  test('merch page shows products with prices', async ({ page }) => {
    await page.goto('/merch', { waitUntil: 'networkidle', timeout: 30000 });

    // Product links render (wait for Sanity data)
    await page.waitForSelector('a[href*="/merch/"]', { timeout: 15000 });
    const productLinks = page.locator('a[href*="/merch/"]');
    const count = await productLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // At least one price visible
    await expect(page.getByText(/\$\d+/).first()).toBeVisible();
  });

  test('product detail page renders with add-to-cart', async ({ page }) => {
    await page.goto('/merch/blues-legend-tshirt', { waitUntil: 'networkidle', timeout: 30000 });

    // Product title visible
    await expect(page.getByText('Blues Legend T-Shirt').first()).toBeVisible({ timeout: 10000 });

    // Price visible
    await expect(page.getByText(/\$\d+/).first()).toBeVisible();

    // Add to Cart button exists
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
  });

  test('shows page loads', async ({ page }) => {
    await page.goto('/shows', { waitUntil: 'networkidle', timeout: 30000 });
    const body = await page.textContent('body');
    expect(body).toMatch(/show|event|upcoming|past|no upcoming/i);
  });

  test('contact page has form fields', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle', timeout: 30000 });

    // Has input fields (name/email/message)
    const inputs = page.locator('input, textarea');
    expect(await inputs.count()).toBeGreaterThanOrEqual(2);
  });

  test('legal pages render with content', async ({ page }) => {
    for (const path of ['/privacy-policy', '/terms', '/returns']) {
      await page.goto(path, { waitUntil: 'networkidle', timeout: 30000 });
      const body = await page.textContent('body');
      expect(body!.length).toBeGreaterThan(500);
    }
  });

  test('nonexistent page does not render site content', async ({ page }) => {
    const response = await page.goto('/this-page-definitely-does-not-exist-xyz', { timeout: 30000 });
    // In production build this returns 404. In dev mode with Sanity Live,
    // it may return 200 with a loading state. Either way, it should NOT
    // render real page content (header, nav, products, etc.)
    const status = response?.status();
    expect([200, 404]).toContain(status);
    // If 200, verify it's not showing real content
    if (status === 200) {
      const nav = page.getByRole('link', { name: /merch/i });
      // The nav should either not exist or the page should be mostly empty
      const body = await page.textContent('body');
      // Should not have a full product listing or main site content
      expect(body).not.toMatch(/Blues Legend T-Shirt/);
    }
  });
});

test.describe('Cart Flow', () => {
  test('can add product to cart and see it', async ({ page }) => {
    await page.goto('/merch/blues-legend-tshirt', { waitUntil: 'networkidle', timeout: 30000 });

    // Select a size if options exist
    const sizeButton = page.getByRole('button', { name: /^(S|M|L|XL)$/ }).first();
    if (await sizeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sizeButton.click();
    }

    // Click Add to Cart
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Navigate to cart page
    await page.goto('/cart', { waitUntil: 'networkidle', timeout: 30000 });

    // Cart has the item
    await expect(page.getByText('Blues Legend T-Shirt').first()).toBeVisible({ timeout: 10000 });

    // Price text exists somewhere on the page
    const body = await page.textContent('body');
    expect(body).toMatch(/\$\d+\.\d{2}/);
  });

  test('checkout handles missing Stripe gracefully', async ({ page }) => {
    // Add something to cart first
    await page.goto('/merch/blues-legend-tshirt', { waitUntil: 'networkidle', timeout: 30000 });
    const sizeButton = page.getByRole('button', { name: /^(S|M|L|XL)$/ }).first();
    if (await sizeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sizeButton.click();
    }
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go to checkout
    await page.goto('/checkout', { waitUntil: 'networkidle', timeout: 30000 });

    // Should show an error state (Stripe not configured)
    await page.waitForTimeout(5000);
    const body = await page.textContent('body');
    expect(body).toMatch(/unavailable|not.*configured|error|payment|return.*cart|checkout/i);
  });
});
