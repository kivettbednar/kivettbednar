'use client'

import {useEffect, useRef} from 'react'
import {set, SlugInput, useFormValue, type SlugInputProps} from 'sanity'
import type {SlugValue} from '@sanity/types'

/**
 * Drop-in replacement for Sanity's built-in slug input that auto-fills
 * the slug from the source field whenever the source changes and the
 * slug hasn't been manually set. Editors can still overwrite it; once
 * they do, auto-fill stops tracking. Clearing the slug re-enables tracking.
 */
export function AutoSlugInput(props: SlugInputProps) {
  const {schemaType, value, onChange, readOnly} = props
  const sourcePath = (schemaType.options as {source?: string | string[]} | undefined)?.source
  const maxLength = (schemaType.options as {maxLength?: number} | undefined)?.maxLength ?? 96

  const sourceValue = useFormValue(
    Array.isArray(sourcePath) ? sourcePath : sourcePath ? [sourcePath] : [],
  ) as string | undefined

  const hasBeenManuallyEditedRef = useRef<boolean>(
    Boolean(value?.current && value.current.trim() !== ''),
  )

  useEffect(() => {
    if (value?.current && value.current.trim() !== '') {
      hasBeenManuallyEditedRef.current = true
    } else {
      hasBeenManuallyEditedRef.current = false
    }
  }, [value?.current])

  useEffect(() => {
    if (readOnly) return
    if (hasBeenManuallyEditedRef.current) return
    if (!sourceValue || typeof sourceValue !== 'string' || sourceValue.trim() === '') return

    const next = slugify(sourceValue, maxLength)
    if (!next) return
    if (value?.current === next) return

    const nextValue: SlugValue = {_type: 'slug', current: next}
    onChange(set(nextValue))
  }, [sourceValue, maxLength, readOnly, value?.current, onChange])

  return <SlugInput {...props} />
}

function slugify(input: string, maxLength: number): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}
