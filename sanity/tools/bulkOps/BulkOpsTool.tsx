import {useState, useEffect, useMemo, useCallback} from 'react'
import {useClient, definePlugin} from 'sanity'
import {ToolIcon} from './ToolIcon'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Grid,
  Heading,
  Inline,
  Label,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
  useToast,
} from '@sanity/ui'
import {
  ArchiveIcon,
  RestoreIcon,
  StarIcon,
  StarFilledIcon,
  TagIcon,
  PackageIcon,
  CalendarIcon,
  BookIcon,
  RefreshIcon,
} from '@sanity/icons'

/**
 * Sanity Studio tool: Bulk Operations.
 *
 * A grid view that lets the owner multi-select products / events / lesson
 * packages and apply common changes in one batch — archive, unarchive,
 * toggle featured, toggle on-sale, percent price change, set inventory.
 *
 * Live data: each visible row is fetched fresh on entry / type / filter
 * change. Mutations go through a single `client.transaction()` so a batch
 * of 50 patches is one network call and atomic across the dataset.
 */

type DocType = 'product' | 'event' | 'lessonPackage'

type Row = {
  _id: string
  _type: string
  title?: string | null
  archived?: boolean | null
  featured?: boolean | null
  onSale?: boolean | null
  category?: string | null
  priceCents?: number | null
  inventoryQuantity?: number | null
  startDateTime?: string | null
  isCanceled?: boolean | null
}

type Filter = 'active' | 'archived' | 'all'

const TYPE_LABELS: Record<DocType, string> = {
  product: 'Products',
  event: 'Events',
  lessonPackage: 'Lesson Packages',
}

const TYPE_ICONS: Record<DocType, React.ComponentType> = {
  product: PackageIcon,
  event: CalendarIcon,
  lessonPackage: BookIcon,
}

function formatDollars(cents: number | null | undefined): string {
  if (cents == null || isNaN(cents)) return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

function buildQuery(type: DocType, filter: Filter, search: string): {query: string; params: Record<string, unknown>} {
  const archiveClause =
    filter === 'active' ? '&& !archived' : filter === 'archived' ? '&& archived == true' : ''
  const searchClause = search.trim() ? '&& title match $search' : ''

  const projection = `
    _id,
    _type,
    title,
    archived,
    featured,
    onSale,
    priceCents,
    inventoryQuantity,
    category,
    startDateTime,
    isCanceled
  `
  const ordering =
    type === 'event' ? '| order(startDateTime desc)' : '| order(_createdAt desc)'

  return {
    query: `*[_type == $type ${archiveClause} ${searchClause}] ${ordering}[0...500]{${projection}}`,
    params: {
      type,
      ...(search.trim() ? {search: `${search.trim()}*`} : {}),
    },
  }
}

export function BulkOpsTool() {
  const client = useClient({apiVersion: '2024-01-01'})
  const toast = useToast()

  const [docType, setDocType] = useState<DocType>('product')
  const [filter, setFilter] = useState<Filter>('active')
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)

  // Pricing & inventory inputs
  const [pricePercent, setPricePercent] = useState<string>('')
  const [inventoryValue, setInventoryValue] = useState<string>('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setSelected(new Set())
    try {
      const {query, params} = buildQuery(docType, filter, search)
      const result = await client.fetch<Row[]>(query, params)
      setRows(result || [])
    } catch (err) {
      console.error('BulkOps fetch failed', err)
      toast.push({status: 'error', title: 'Failed to load documents'})
    } finally {
      setLoading(false)
    }
  }, [client, docType, filter, search, toast])

  useEffect(() => {
    refresh()
  }, [refresh])

  const allVisibleSelected = useMemo(
    () => rows.length > 0 && rows.every((r) => selected.has(r._id)),
    [rows, selected],
  )

  const selectedCount = selected.size

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected((prev) =>
      allVisibleSelected ? new Set() : new Set(rows.map((r) => r._id)),
    )
  }

  /**
   * Apply a single-field "set" patch across every selected document.
   * Patches both the published id and the draft id so changes stick
   * regardless of which version exists.
   */
  const applySet = async (patch: Record<string, unknown>, label: string) => {
    if (selectedCount === 0) {
      toast.push({status: 'warning', title: 'Select at least one row first'})
      return
    }
    setBusy(true)
    try {
      const tx = client.transaction()
      for (const id of selected) {
        tx.patch(id, {set: patch})
        tx.patch(`drafts.${id}`, {set: patch})
      }
      await tx.commit({autoGenerateArrayKeys: true})
      toast.push({
        status: 'success',
        title: `${label} applied to ${selectedCount} ${
          selectedCount === 1 ? 'item' : 'items'
        }`,
      })
      await refresh()
    } catch (err: any) {
      // Some ids may only have a draft and not a published version (or vice
      // versa) — Sanity will fail the transaction for the missing one.
      // Fall back to per-doc best-effort patches.
      try {
        for (const id of selected) {
          try {
            await client.patch(id).set(patch).commit()
          } catch {
            try {
              await client.patch(`drafts.${id}`).set(patch).commit()
            } catch {
              /* skip — doc no longer exists */
            }
          }
        }
        toast.push({
          status: 'success',
          title: `${label} applied (with fallback) to ${selectedCount} items`,
        })
        await refresh()
      } catch (e) {
        console.error('BulkOps patch failed', e)
        toast.push({status: 'error', title: `Could not apply ${label}`})
      }
    } finally {
      setBusy(false)
    }
  }

  /**
   * Apply a percent change to priceCents on every selected product.
   * Reads the current value, computes the new integer cents, patches.
   */
  const applyPricePercent = async () => {
    const pct = parseFloat(pricePercent)
    if (!pct || isNaN(pct)) {
      toast.push({status: 'warning', title: 'Enter a percent (e.g., -10 or 15)'})
      return
    }
    if (selectedCount === 0) {
      toast.push({status: 'warning', title: 'Select at least one row first'})
      return
    }
    setBusy(true)
    try {
      const tx = client.transaction()
      for (const id of selected) {
        const row = rows.find((r) => r._id === id)
        if (!row || row.priceCents == null) continue
        const newCents = Math.max(0, Math.round(row.priceCents * (1 + pct / 100)))
        tx.patch(id, {set: {priceCents: newCents}})
        tx.patch(`drafts.${id}`, {set: {priceCents: newCents}})
      }
      await tx.commit({autoGenerateArrayKeys: true}).catch(async (err) => {
        // Fall back to per-doc patches if a draft/published is missing.
        for (const id of selected) {
          const row = rows.find((r) => r._id === id)
          if (!row || row.priceCents == null) continue
          const newCents = Math.max(0, Math.round(row.priceCents * (1 + pct / 100)))
          try {
            await client.patch(id).set({priceCents: newCents}).commit()
          } catch {
            try {
              await client.patch(`drafts.${id}`).set({priceCents: newCents}).commit()
            } catch {
              /* skip */
            }
          }
        }
      })
      toast.push({
        status: 'success',
        title: `Adjusted price by ${pct > 0 ? '+' : ''}${pct}% on ${selectedCount} items`,
      })
      setPricePercent('')
      await refresh()
    } catch (err) {
      console.error('Price adjust failed', err)
      toast.push({status: 'error', title: 'Could not adjust prices'})
    } finally {
      setBusy(false)
    }
  }

  const applyInventory = async () => {
    const n = parseInt(inventoryValue, 10)
    if (isNaN(n) || n < 0) {
      toast.push({status: 'warning', title: 'Enter a non-negative number'})
      return
    }
    await applySet({inventoryQuantity: n, trackInventory: true}, `Inventory set to ${n}`)
    setInventoryValue('')
  }

  const TypeIcon = TYPE_ICONS[docType]

  return (
    <Container width={3} padding={4}>
      <Stack space={4}>
        {/* Header */}
        <Flex align="center" gap={3}>
          <Text size={3}>
            <TypeIcon />
          </Text>
          <Heading size={2}>Bulk Operations</Heading>
        </Flex>
        <Text size={2} muted>
          Multi-select rows to apply a change across many items at once. Changes
          apply to both published documents and drafts.
        </Text>

        {/* Controls */}
        <Card padding={3} border radius={2} tone="transparent">
          <Stack space={3}>
            <Grid columns={[1, 2, 4]} gap={3}>
              <Stack space={2}>
                <Label muted>Type</Label>
                <Select
                  value={docType}
                  onChange={(e) => setDocType((e.target as HTMLSelectElement).value as DocType)}
                  disabled={busy}
                >
                  <option value="product">Products</option>
                  <option value="event">Events</option>
                  <option value="lessonPackage">Lesson Packages</option>
                </Select>
              </Stack>
              <Stack space={2}>
                <Label muted>Status</Label>
                <Select
                  value={filter}
                  onChange={(e) => setFilter((e.target as HTMLSelectElement).value as Filter)}
                  disabled={busy}
                >
                  <option value="active">Active (not archived)</option>
                  <option value="archived">Archived</option>
                  <option value="all">All</option>
                </Select>
              </Stack>
              <Stack space={2}>
                <Label muted>Search by title</Label>
                <TextInput
                  value={search}
                  onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
                  placeholder="e.g., tour, denim"
                  disabled={busy}
                />
              </Stack>
              <Stack space={2}>
                <Label muted>&nbsp;</Label>
                <Button
                  text={loading ? 'Loading…' : 'Refresh'}
                  icon={RefreshIcon}
                  onClick={refresh}
                  disabled={loading || busy}
                  mode="ghost"
                />
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Action bar */}
        <Card padding={3} border radius={2} tone="primary">
          <Stack space={3}>
            <Flex align="center" justify="space-between">
              <Text weight="semibold" size={1}>
                {selectedCount > 0
                  ? `${selectedCount} selected`
                  : 'Select rows below to apply actions'}
              </Text>
              {selectedCount > 0 && (
                <Button
                  text="Clear selection"
                  mode="bleed"
                  onClick={() => setSelected(new Set())}
                  disabled={busy}
                />
              )}
            </Flex>

            <Inline space={2}>
              <Button
                text="Archive"
                icon={ArchiveIcon}
                tone="caution"
                disabled={busy || selectedCount === 0}
                onClick={() => applySet({archived: true}, 'Archive')}
              />
              <Button
                text="Unarchive"
                icon={RestoreIcon}
                tone="positive"
                disabled={busy || selectedCount === 0}
                onClick={() => applySet({archived: false}, 'Unarchive')}
              />
              {docType === 'product' && (
                <>
                  <Button
                    text="Mark Featured"
                    icon={StarFilledIcon}
                    disabled={busy || selectedCount === 0}
                    onClick={() => applySet({featured: true}, 'Mark featured')}
                  />
                  <Button
                    text="Unfeature"
                    icon={StarIcon}
                    mode="ghost"
                    disabled={busy || selectedCount === 0}
                    onClick={() => applySet({featured: false}, 'Unfeature')}
                  />
                  <Button
                    text="Mark On Sale"
                    icon={TagIcon}
                    disabled={busy || selectedCount === 0}
                    onClick={() => applySet({onSale: true}, 'Mark on sale')}
                  />
                  <Button
                    text="End Sale"
                    icon={TagIcon}
                    mode="ghost"
                    disabled={busy || selectedCount === 0}
                    onClick={() => applySet({onSale: false}, 'End sale')}
                  />
                </>
              )}
            </Inline>

            {docType === 'product' && (
              <Grid columns={[1, 2]} gap={3}>
                <Card padding={3} radius={2} tone="transparent" border>
                  <Stack space={2}>
                    <Label muted>Adjust price by %</Label>
                    <Flex gap={2}>
                      <Box flex={1}>
                        <TextInput
                          value={pricePercent}
                          onChange={(e) =>
                            setPricePercent((e.target as HTMLInputElement).value)
                          }
                          placeholder="e.g., -10 or 15"
                          disabled={busy}
                        />
                      </Box>
                      <Button
                        text="Apply"
                        tone="primary"
                        disabled={busy || selectedCount === 0 || !pricePercent}
                        onClick={applyPricePercent}
                      />
                    </Flex>
                    <Text size={1} muted>
                      Negative for a discount, positive for a markup. Applies to
                      the base price of each selected product.
                    </Text>
                  </Stack>
                </Card>
                <Card padding={3} radius={2} tone="transparent" border>
                  <Stack space={2}>
                    <Label muted>Set inventory quantity</Label>
                    <Flex gap={2}>
                      <Box flex={1}>
                        <TextInput
                          value={inventoryValue}
                          onChange={(e) =>
                            setInventoryValue((e.target as HTMLInputElement).value)
                          }
                          placeholder="e.g., 50"
                          disabled={busy}
                        />
                      </Box>
                      <Button
                        text="Apply"
                        tone="primary"
                        disabled={busy || selectedCount === 0 || !inventoryValue}
                        onClick={applyInventory}
                      />
                    </Flex>
                    <Text size={1} muted>
                      Sets the same quantity on every selected product and turns
                      "Track Inventory" on.
                    </Text>
                  </Stack>
                </Card>
              </Grid>
            )}
          </Stack>
        </Card>

        {/* Table */}
        <Card border radius={2}>
          {loading ? (
            <Box padding={6}>
              <Flex justify="center">
                <Spinner muted />
              </Flex>
            </Box>
          ) : rows.length === 0 ? (
            <Box padding={6}>
              <Text align="center" muted>
                No {TYPE_LABELS[docType].toLowerCase()} match this filter.
              </Text>
            </Box>
          ) : (
            <Stack>
              {/* Header row */}
              <Card padding={3} tone="transparent" borderBottom>
                <Flex align="center" gap={3}>
                  <Box style={{width: 24}}>
                    <Checkbox
                      checked={allVisibleSelected}
                      onChange={toggleAll}
                      indeterminate={!allVisibleSelected && selectedCount > 0}
                    />
                  </Box>
                  <Box flex={3}>
                    <Label muted>Title</Label>
                  </Box>
                  {docType === 'product' && (
                    <>
                      <Box flex={1}>
                        <Label muted>Category</Label>
                      </Box>
                      <Box style={{width: 90}}>
                        <Label muted>Price</Label>
                      </Box>
                      <Box style={{width: 70}}>
                        <Label muted>Stock</Label>
                      </Box>
                    </>
                  )}
                  {docType === 'event' && (
                    <Box flex={1}>
                      <Label muted>Date</Label>
                    </Box>
                  )}
                  {docType === 'lessonPackage' && (
                    <Box style={{width: 90}}>
                      <Label muted>Price</Label>
                    </Box>
                  )}
                  <Box style={{width: 110}}>
                    <Label muted>Status</Label>
                  </Box>
                </Flex>
              </Card>

              {/* Data rows */}
              {rows.map((row) => {
                const isChecked = selected.has(row._id)
                const statusBits: string[] = []
                if (row.archived) statusBits.push('Archived')
                if (row.featured) statusBits.push('Featured')
                if (row.onSale) statusBits.push('On Sale')
                if (row.isCanceled) statusBits.push('Canceled')
                return (
                  <Card
                    key={row._id}
                    padding={3}
                    borderBottom
                    tone={isChecked ? 'primary' : 'default'}
                  >
                    <Flex align="center" gap={3}>
                      <Box style={{width: 24}}>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => toggleOne(row._id)}
                        />
                      </Box>
                      <Box flex={3}>
                        <Text weight="medium" textOverflow="ellipsis">
                          {row.title || <em>Untitled</em>}
                        </Text>
                      </Box>
                      {docType === 'product' && (
                        <>
                          <Box flex={1}>
                            <Text size={1} muted>
                              {row.category || '—'}
                            </Text>
                          </Box>
                          <Box style={{width: 90}}>
                            <Text size={1}>{formatDollars(row.priceCents)}</Text>
                          </Box>
                          <Box style={{width: 70}}>
                            <Text size={1} muted>
                              {row.inventoryQuantity ?? '—'}
                            </Text>
                          </Box>
                        </>
                      )}
                      {docType === 'event' && (
                        <Box flex={1}>
                          <Text size={1} muted>
                            {formatDate(row.startDateTime)}
                          </Text>
                        </Box>
                      )}
                      {docType === 'lessonPackage' && (
                        <Box style={{width: 90}}>
                          <Text size={1}>{formatDollars(row.priceCents)}</Text>
                        </Box>
                      )}
                      <Box style={{width: 110}}>
                        <Text size={1} muted>
                          {statusBits.length ? statusBits.join(', ') : 'Active'}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                )
              })}

              <Card padding={3} tone="transparent">
                <Text size={1} muted align="center">
                  Showing {rows.length} {TYPE_LABELS[docType].toLowerCase()}
                  {rows.length === 500 && ' (capped at 500 — use search to narrow)'}
                </Text>
              </Card>
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
  )
}

/**
 * Tool plugin registration. Loaded by sanity.config.ts plugins array.
 */
export const bulkOpsTool = definePlugin({
  name: 'bulk-ops',
  tools: (prev) => [
    ...prev,
    {
      name: 'bulk-ops',
      title: 'Bulk',
      icon: ToolIcon,
      component: BulkOpsTool,
    },
  ],
})
