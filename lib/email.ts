const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') return url.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  } catch {}
  return '#';
}

function getApiKey(): string | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("your_") || key === "placeholder" || key.startsWith("re_placeholder")) {
    return null;
  }
  return key;
}

let _cachedFrom: string | null = null;
let _cachedAdmin: string | null = null;
let _settingsFetchedAt = 0;

async function loadEmailSettings() {
  const now = Date.now();
  if (_cachedFrom && _cachedAdmin && now - _settingsFetchedAt < 60_000) return;
  try {
    const {getEmailFrom, getAdminEmail: getAdmin} = await import('@/lib/store-settings');
    _cachedFrom = await getEmailFrom();
    _cachedAdmin = await getAdmin();
    _settingsFetchedAt = now;
  } catch {
    // Fall through to env var defaults
  }
}

async function getFromAddress(): Promise<string> {
  await loadEmailSettings();
  if (_cachedFrom && !_cachedFrom.includes('your-domain.com')) return _cachedFrom;
  const from = process.env.EMAIL_FROM || "Kivett Bednar Music <orders@your-domain.com>";
  if (from.includes('your-domain.com')) {
    console.error('[EMAIL] Email "from" address not configured in Store Settings or EMAIL_FROM env var.');
  }
  return from;
}

async function getAdminEmail(): Promise<string> {
  await loadEmailSettings();
  if (_cachedAdmin && !_cachedAdmin.includes('your-domain.com')) return _cachedAdmin;
  return process.env.ADMIN_EMAIL || "admin@your-domain.com";
}

import {formatPrice} from '@/lib/format'

function formatCents(cents: number): string {
  return `$${formatPrice(cents)}`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return { success: false, error: 'Email not configured (no API key)' };
  }

  const from = await getFromAddress();
  if (from.includes('your-domain.com') || to.includes('your-domain.com')) {
    console.error('[EMAIL ERROR] Placeholder email domain detected — configure Store Settings in Sanity or EMAIL_FROM/ADMIN_EMAIL env vars');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[EMAIL ERROR] ${res.status} sending to ${to}: ${body}`);
      return { success: false, error: body };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[EMAIL ERROR] Failed to send to ${to}: ${message}`);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function sendOrderConfirmation(order: {
  orderId: string;
  email: string;
  name?: string;
  items: Array<{ title: string; quantity: number; priceCents: number }>;
  totalCents: number;
}) {
  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(i.title)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatCents(i.priceCents * i.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2>Order Confirmation</h2>
      <p>Hi ${escapeHtml(order.name || "there")},</p>
      <p>Thank you for your order! Here are the details:</p>
      <p><strong>Order ID:</strong> ${escapeHtml(order.orderId)}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:8px;text-align:right;font-weight:bold">Total</td>
            <td style="padding:8px;text-align:right;font-weight:bold">${formatCents(order.totalCents)}</td>
          </tr>
        </tfoot>
      </table>
      <p>We'll let you know when your order ships.</p>
      <p>Thanks,<br/>Kivett Bednar Music</p>
    </div>`;

  return sendEmail(order.email, `Order Confirmation - ${order.orderId}`, html);
}

export async function sendShippingUpdate(order: {
  orderId: string;
  email: string;
  name?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
}) {
  const trackingInfo = order.trackingNumber
    ? `<p><strong>Tracking Number:</strong> ${
        order.trackingUrl
          ? `<a href="${sanitizeUrl(order.trackingUrl)}">${escapeHtml(order.trackingNumber)}</a>`
          : escapeHtml(order.trackingNumber)
      }</p>${order.carrier ? `<p><strong>Carrier:</strong> ${escapeHtml(order.carrier)}</p>` : ""}`
    : `<p>Tracking information will be updated shortly.</p>`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2>Your Order Has Shipped!</h2>
      <p>Hi ${escapeHtml(order.name || "there")},</p>
      <p>Great news — your order <strong>${escapeHtml(order.orderId)}</strong> is on its way!</p>
      ${trackingInfo}
      <p>Thanks,<br/>Kivett Bednar Music</p>
    </div>`;

  return sendEmail(order.email, `Shipping Update - ${order.orderId}`, html);
}

export async function sendContactFormSubmission(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p>
      ${data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ""}
      <div style="background:#f9f9f9;padding:16px;border-radius:4px;margin:16px 0;white-space:pre-wrap">${escapeHtml(data.message)}</div>
      <p style="color:#888;font-size:12px">Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
    </div>`;

  return sendEmail(
    await getAdminEmail(),
    data.subject ? `Contact: ${data.subject}` : `Contact Form — ${data.name}`,
    html
  );
}

export async function sendFulfillmentFailureAlert(order: {
  orderId: string;
  email: string;
  name?: string;
  error?: string;
}) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#d32f2f">Fulfillment Failed</h2>
      <p>A Gelato fulfillment has failed and requires attention.</p>
      <p><strong>Order ID:</strong> ${escapeHtml(order.orderId)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(order.name || 'N/A')} (${escapeHtml(order.email)})</p>
      ${order.error ? `<p><strong>Error:</strong> ${escapeHtml(order.error)}</p>` : ''}
      <p>Please check the order in Sanity Studio and use the "Retry Gelato Order" action if appropriate.</p>
    </div>`;

  return sendEmail(await getAdminEmail(), `ALERT: Fulfillment Failed — ${order.orderId}`, html);
}

export async function sendNewOrderNotification(order: {
  orderId: string;
  email: string;
  name?: string;
  items: Array<{ title: string; quantity: number; priceCents: number }>;
  totalCents: number;
}) {
  const itemList = order.items
    .map((i) => `<li>${escapeHtml(i.title)} x${i.quantity} — ${formatCents(i.priceCents * i.quantity)}</li>`)
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2>New Order Received</h2>
      <p><strong>Order ID:</strong> ${escapeHtml(order.orderId)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(order.name || "N/A")} (${escapeHtml(order.email)})</p>
      <ul>${itemList}</ul>
      <p><strong>Total:</strong> ${formatCents(order.totalCents)}</p>
    </div>`;

  return sendEmail(await getAdminEmail(), `New Order — ${order.orderId}`, html);
}
