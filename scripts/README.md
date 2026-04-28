# Sanity migration & bulk-ops scripts

These scripts run against the live Sanity dataset. They're for **operations
that don't make sense inside the Studio UI** — bulk migrations, scheduled
archive sweeps, one-off data fixes.

For most day-to-day bulk work (archive 30 products, mark a category on
sale, set inventory), use the **Bulk** tab inside the Studio instead. It
ships with the same features, runs in your browser session, and doesn't
require a terminal.

## Setup

Every script reads `.env.local`. Add a write-capable token:

```bash
SANITY_WRITE_TOKEN=<a token with editor or admin permissions>
# (or, if your read token already has write perms, the script will use that)
```

Generate a token in the Sanity dashboard → API → Tokens → Add API token →
"Editor" role.

## Running

All scripts are **dry-run by default** and print what they *would* do
without committing. Add `--write` to apply.

## Available scripts

### `bulk-archive-old-events.mjs`
Archive every event older than N days. Useful as an annual cleanup so
the past-events list stays a manageable size.

```bash
node scripts/bulk-archive-old-events.mjs --days 365            # dry run, 1 year
node scripts/bulk-archive-old-events.mjs --days 365 --write    # commit
```

### `bulk-update-product-prices.mjs`
Apply a percent change to product prices, optionally scoped to one
category. Always shows a before/after diff before committing.

```bash
# Preview a 10% sale across apparel:
node scripts/bulk-update-product-prices.mjs --pct -10 --category apparel

# Apply a 5% markup across every active product:
node scripts/bulk-update-product-prices.mjs --pct 5 --write
```

Categories: `apparel`, `music`, `accessories`, `prints`, `amps`.

### `backfill-product-slugs.mjs`
Generates URL slugs for any product missing one (legacy data fix).

```bash
node scripts/backfill-product-slugs.mjs --write
```

## Tips

- **Always dry-run first.** Every script prints what it would change.
- **Re-run safely.** Scripts are idempotent — running twice produces the
  same result as running once.
- **Snapshots.** Sanity keeps document history automatically — if a bulk
  operation goes sideways you can revert individual docs from the
  History tab in the Studio.
