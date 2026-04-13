/**
 * Comprehensive Sanity Studio field tests.
 * Verifies every document type's fields are accessible and editable.
 *
 * Requires auth: npx playwright test tests/studio-auth-setup.spec.ts --headed
 */
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '.auth', 'sanity-session.json');
const hasAuth = fs.existsSync(authFile);

async function openStructure(page: Page) {
  await page.goto('/studio/structure', { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('text=Content Management', { timeout: 30000 });
  try {
    const dismiss = page.getByRole('button', { name: /dismiss/i });
    if (await dismiss.isVisible({ timeout: 2000 })) {
      await dismiss.click({ force: true, timeout: 2000 });
    }
  } catch { /* banner may have auto-dismissed */ }
  await page.waitForTimeout(500);
}

async function nav(page: Page, text: string) {
  await page.getByText(text).first().click({ force: true });
  await page.waitForTimeout(2000);
}

async function openList(page: Page, ...navPath: string[]) {
  await openStructure(page);
  for (const item of navPath) { await nav(page, item); }
  await page.waitForTimeout(3000);
}

async function openProduct(page: Page) {
  await openList(page, 'Store Management', 'All Products');
  await page.getByText('Blues Legend T-Shirt').first().click({ force: true });
  await page.waitForTimeout(5000);
}

/**
 * Best-effort cleanup of the draft currently open in Studio.
 * Tests that create documents via `/studio/intent/create/...` leave
 * `drafts.*` documents behind unless we discard them. We try keyboard
 * shortcuts and the document actions menu; failures are swallowed so
 * the teardown never flakes the test.
 *
 * If drafts still accumulate, run: `node scripts/cleanup-test-drafts.mjs --write`
 */
async function discardCurrentDraft(page: Page): Promise<void> {
  try {
    // Try the Studio keyboard shortcut (Cmd/Ctrl+Alt+D in recent versions)
    await page.keyboard.press('Control+Alt+D');
    await page.waitForTimeout(500);
    const confirm = page.getByRole('button', { name: /^discard/i });
    if (await confirm.isVisible({ timeout: 1500 }).catch(() => false)) {
      await confirm.click({ force: true });
      await page.waitForTimeout(500);
      return;
    }
  } catch { /* fall through */ }

  try {
    // Fallback: open the document actions menu and click Discard
    const menu = page.getByRole('button', { name: /document actions|more|menu/i }).first();
    if (await menu.isVisible({ timeout: 1500 }).catch(() => false)) {
      await menu.click({ force: true });
      await page.waitForTimeout(300);
      const item = page.getByRole('menuitem', { name: /discard/i });
      if (await item.isVisible({ timeout: 1500 }).catch(() => false)) {
        await item.click({ force: true });
        await page.waitForTimeout(300);
        const confirm = page.getByRole('button', { name: /^discard/i });
        if (await confirm.isVisible({ timeout: 1500 }).catch(() => false)) {
          await confirm.click({ force: true });
        }
      }
    }
  } catch { /* best effort only — cleanup script picks up stragglers */ }
}

/** Check body text matches all patterns */
async function expectFields(page: Page, ...patterns: (string | RegExp)[]) {
  const body = await page.textContent('body');
  for (const p of patterns) {
    if (typeof p === 'string') {
      expect(body).toContain(p);
    } else {
      expect(body).toMatch(p);
    }
  }
}

// ============================================================
// SKIP ALL IF NO AUTH
// ============================================================
if (!hasAuth) {
  test('SETUP REQUIRED — run: npx playwright test tests/studio-auth-setup.spec.ts --headed', () => {
    test.skip();
  });
} else {

// Best-effort draft cleanup after every Studio test. Tests that navigate
// to `/studio/intent/create/...` create draft documents in Sanity;
// without this teardown, each run leaves orphans (e.g.
// "PLAYWRIGHT TEST PRODUCT") piling up in the dataset.
test.afterEach(async ({ page }) => {
  try {
    const url = page.url();
    if (!url.includes('/studio')) return;
    await discardCurrentDraft(page);
  } catch { /* best effort only */ }
});

// ============================================================
// PRODUCT FIELDS
// ============================================================
test.describe('Product Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('title, slug, price, and currency fields', async ({ page }) => {
    await openProduct(page);
    const title = page.getByRole('textbox', { name: 'Product Title' });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Edit and revert title
    await title.fill('Blues Legend T-Shirt');
    await title.fill('Blues Legend T-Shirt TEST');
    await expect(title).toHaveValue('Blues Legend T-Shirt TEST');
    await title.fill('Blues Legend T-Shirt');

    await expectFields(page, 'Slug', 'Price (cents)', 'Currency');
  });

  test('sale, category, stock, featured, badges, and tags fields', async ({ page }) => {
    await openProduct(page);
    await expectFields(page,
      'On Sale', 'Category',
      /Apparel|Music|Accessories|Posters/,
      'Stock Status', 'Featured',
      'Badges', 'Tags',
    );
  });

  test('images, description, and product options', async ({ page }) => {
    await openProduct(page);
    await expectFields(page,
      'Product Images', 'Description',
      'Product Options', 'Variants',
    );
  });

  test('gelato integration fields', async ({ page }) => {
    await openProduct(page);
    await expectFields(page,
      'Gelato Product UID',
      'Gelato Cost',
      'Print Areas',
    );
  });

  test('inventory tracking fields', async ({ page }) => {
    await openProduct(page);
    await expectFields(page,
      'Track Inventory',
      'Inventory Quantity',
      'Low Stock Threshold',
    );
  });

  test('materials, care, shipping, dimensions fields', async ({ page }) => {
    await openProduct(page);
    await expectFields(page,
      'Materials', 'Care Instructions',
      'Shipping Notes', 'Dimensions',
    );
  });

  test('related products and SEO fields', async ({ page }) => {
    await openProduct(page);
    await expectFields(page,
      'Related Products', 'SEO',
    );
  });

  test('can create new product with all sections', async ({ page }) => {
    await page.goto('/studio/intent/create/template=product;type=product/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    const title = page.getByRole('textbox', { name: 'Product Title' });
    await expect(title).toBeVisible({ timeout: 15000 });
    await title.fill('PLAYWRIGHT TEST PRODUCT');
    await expect(title).toHaveValue('PLAYWRIGHT TEST PRODUCT');

    await expectFields(page, 'Price', 'Category', 'Product Images');
  });
});

// ============================================================
// EVENT FIELDS
// ============================================================
test.describe('Event Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('can create event with all field sections', async ({ page }) => {
    await page.goto('/studio/intent/create/template=event;type=event/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    const title = page.locator('input[type="text"]').first();
    await expect(title).toBeVisible({ timeout: 15000 });
    await title.fill('PLAYWRIGHT TEST EVENT');
    await expect(title).toHaveValue('PLAYWRIGHT TEST EVENT');

    await expectFields(page,
      'Event Details', 'Page Content', 'Images', 'Location',
    );
  });

  test('event has date, venue, location, and status fields', async ({ page }) => {
    await page.goto('/studio/intent/create/template=event;type=event/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    await expectFields(page,
      /Start Date|Start Time/i,
      'Venue', 'City',
      'Ticket URL',
      /Cancel|Sold Out/i,
    );
  });
});

// ============================================================
// ORDER FIELDS
// ============================================================
test.describe('Order Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('order list is accessible with status filters', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Orders');
    await expectFields(page,
      'All Orders', 'Pending', 'Submitted', 'Shipped', 'Delivered',
      'Canceled', 'Refunded', 'Disputed',
    );
  });

  test('order form has all expected fields', async ({ page }) => {
    await page.goto('/studio/intent/create/template=order;type=order/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    await expectFields(page,
      /Email|Customer/i,
      'Status',
      /Stripe|Session/i,
      /Gelato|Fulfillment/i,
      /Tracking|Shipping/i,
      'Notes',
    );
  });
});

// ============================================================
// PROMO CODE FIELDS
// ============================================================
test.describe('Promo Code Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('promo code form has all fields', async ({ page }) => {
    await page.goto('/studio/intent/create/template=promoCode;type=promoCode/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    const codeInput = page.locator('input[type="text"]').first();
    await codeInput.fill('TESTCODE99');
    await expect(codeInput).toHaveValue('TESTCODE99');

    await expectFields(page,
      'Discount Type', 'Discount Value',
      /Minimum Purchase/i,
      'Maximum Uses', 'Active',
      'Valid From', 'Valid Until',
      'Applicable Products', 'Applicable Categories',
    );
  });
});

// ============================================================
// PRODUCT COLLECTION FIELDS
// ============================================================
test.describe('Product Collection Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('collection form has all fields', async ({ page }) => {
    await page.goto('/studio/intent/create/template=productCollection;type=productCollection/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    const title = page.locator('input[type="text"]').first();
    await title.fill('PLAYWRIGHT TEST COLLECTION');
    await expect(title).toHaveValue('PLAYWRIGHT TEST COLLECTION');

    await expectFields(page,
      'Slug', 'Description',
      'Products', 'Featured', 'Display Order',
    );
  });
});

// ============================================================
// SONG FIELDS
// ============================================================
test.describe('Song Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('song form has all fields', async ({ page }) => {
    await page.goto('/studio/intent/create/template=song;type=song/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    const title = page.locator('input[type="text"]').first();
    await title.fill('PLAYWRIGHT TEST SONG');
    await expect(title).toHaveValue('PLAYWRIGHT TEST SONG');

    await expectFields(page,
      /Key|Musical/i, 'Artist', 'Notes', 'Order',
    );
  });
});

// ============================================================
// PAGE FIELDS
// ============================================================
test.describe('Page Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('page form has heading, modules, and SEO', async ({ page }) => {
    await page.goto('/studio/intent/create/template=page;type=page/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    const name = page.locator('input[type="text"]').first();
    await name.fill('PLAYWRIGHT TEST PAGE');
    await expect(name).toHaveValue('PLAYWRIGHT TEST PAGE');

    await expectFields(page,
      /Heading|Name/i, 'Slug',
      /Modules|Content/i,
      'SEO',
    );
  });
});

// ============================================================
// POST FIELDS
// ============================================================
test.describe('Post Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('post form has all fields', async ({ page }) => {
    await page.goto('/studio/intent/create/template=post;type=post/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Title', 'Slug', 'Content', 'Excerpt',
      'Cover Image', 'Date', 'Author',
    );
  });
});

// ============================================================
// STORE SETTINGS FIELDS
// ============================================================
test.describe('Store Settings Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('general settings group', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Settings');
    await page.getByText('Store Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Store Enabled', 'Store Name', 'Site URL', 'Currency',
    );
  });

  test('email settings group', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Settings');
    await page.getByText('Store Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Admin Email', 'Email', 'From',
      /Order Confirmation|Subject/i,
      /Shipping.*Subject|Update/i,
    );
  });

  test('shipping and returns group', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Settings');
    await page.getByText('Store Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Shipping Countries', 'Processing Time',
      'Return', /days|Days/i,
    );
  });
});

// ============================================================
// CHECKOUT SETTINGS FIELDS
// ============================================================
test.describe('Checkout Settings Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('all checkout fields present', async ({ page }) => {
    await openList(page, 'Store Management');
    await page.getByText('Checkout Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Trust Badge', 'Delivery Estimate',
      'Secure Checkout', 'Cart',
    );
  });
});

// ============================================================
// NAVIGATION FIELDS
// ============================================================
test.describe('Navigation Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('main and footer navigation arrays', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Settings');
    await page.getByText('Navigation').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page, 'Main Navigation', 'Footer');
  });
});

// ============================================================
// UI TEXT FIELDS
// ============================================================
test.describe('UI Text Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('all UI text field groups present', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Settings');
    await page.getByText('UI Text').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Site Name', 'Site Tagline',
      /Form.*Name|Label/i,
      /Button|Submit/i,
    );
  });
});

// ============================================================
// SITE SETTINGS FIELDS
// ============================================================
test.describe('Site Settings Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('contact, booking, social links fields', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Settings');
    await page.getByText('Site Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Contact Email', 'Booking',
      'Social Media', 'Open Graph',
    );
  });

  test('page visibility toggle fields', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Settings');
    await page.getByText('Site Settings').first().click({ force: true });
    await page.waitForTimeout(5000);

    // Click on the Page Visibility tab/group
    await page.getByText('Page Visibility').first().click({ force: true });
    await page.waitForTimeout(2000);

    await expectFields(page,
      'Show "Shows" Page',
      'Show "Lessons" Page',
      'Show "Setlist" Page',
      'Show "Merch" Page',
      'Show "Contact" Page',
    );
  });
});

// ============================================================
// HOME PAGE FIELDS
// ============================================================
test.describe('Home Page Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('all section groups are visible', async ({ page }) => {
    await openStructure(page);
    await nav(page, 'Site Pages');
    await page.getByText('Home Page').first().click({ force: true });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Hero', 'About', 'Featured Album',
      /Lesson|CTA/i,
      'Gallery', 'Upcoming Shows',
      'Newsletter', 'Section Visibility', 'SEO',
    );
  });
});

// ============================================================
// NEWSLETTER SUBSCRIBER FIELDS
// ============================================================
test.describe('Newsletter Subscriber Fields', () => {
  test.use({ storageState: authFile });
  test.setTimeout(90000);

  test('subscriber form has all fields', async ({ page }) => {
    await page.goto('/studio/intent/create/template=newsletterSubscriber;type=newsletterSubscriber/', {
      waitUntil: 'load', timeout: 30000,
    });
    await page.waitForTimeout(5000);

    await expectFields(page,
      'Email', 'Status', /Source|Subscribed/i,
    );
  });
});

} // end hasAuth
