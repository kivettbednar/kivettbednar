/**
 * PriceInput — wraps Sanity's default number input so editors type DOLLARS
 * (e.g. "24.99") but the stored value is CENTS (e.g. 2499).
 *
 * Used for product.priceCents, product.compareAtPriceCents, variant.priceCents,
 * and product.gelatoCostCents.
 */
'use client'

import React, {useEffect, useState} from 'react'
import {TextInput} from '@sanity/ui'
import {set, unset, type NumberInputProps} from 'sanity'

function centsToDollars(cents: number | undefined | null): string {
  if (cents == null) return ''
  return (cents / 100).toFixed(2)
}

function dollarsToCents(input: string): number | null {
  const trimmed = input.trim().replace(/[$,]/g, '')
  if (trimmed === '') return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}

export function PriceInput(props: NumberInputProps) {
  const {value, onChange, readOnly, elementProps} = props
  const [draft, setDraft] = useState<string>(centsToDollars(value as number | undefined))

  // Keep local display in sync if the stored cents value changes externally
  useEffect(() => {
    setDraft(centsToDollars(value as number | undefined))
  }, [value])

  const commit = (next: string) => {
    if (next.trim() === '') {
      onChange(unset())
      return
    }
    const cents = dollarsToCents(next)
    if (cents == null) return // invalid; keep previous stored value
    onChange(set(cents))
  }

  return (
    <TextInput
      {...elementProps}
      inputMode="decimal"
      placeholder="0.00"
      value={draft}
      readOnly={readOnly}
      onChange={(e) => setDraft(e.currentTarget.value)}
      onBlur={(e) => commit(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit(e.currentTarget.value)
      }}
      style={{fontVariantNumeric: 'tabular-nums'}}
    />
  )
}
