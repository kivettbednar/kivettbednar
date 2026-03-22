'use client'

import {type StringInputProps} from 'sanity'
import {Stack, Inline, Button, Text, Card} from '@sanity/ui'
import {CheckmarkCircleIcon, CloseCircleIcon} from '@sanity/icons'
import {useCallback, useState} from 'react'

type VerifyState = 'idle' | 'loading' | 'found' | 'not_found' | 'error'

export function GelatoProductUidInput(props: StringInputProps) {
  const [state, setState] = useState<VerifyState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleVerify = useCallback(async () => {
    const uid = props.value
    if (!uid) return

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/gelato/catalog?productUid=${encodeURIComponent(uid)}`)
      if (res.ok) {
        setState('found')
      } else if (res.status === 404) {
        setState('not_found')
        setErrorMsg('Product not found in Gelato catalog')
      } else {
        const data = await res.json().catch(() => ({}))
        setState('error')
        setErrorMsg(data.error || `HTTP ${res.status}`)
      }
    } catch (e) {
      setState('error')
      setErrorMsg(e instanceof Error ? e.message : 'Network error')
    }
  }, [props.value])

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Inline space={2}>
        <Button
          text={state === 'loading' ? 'Verifying...' : 'Verify in Gelato'}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          disabled={!props.value || state === 'loading'}
          onClick={handleVerify}
        />
        {state === 'found' && (
          <Card tone="positive" padding={2} radius={2}>
            <Inline space={2}>
              <Text size={1}>
                <CheckmarkCircleIcon />
              </Text>
              <Text size={1} weight="bold">
                Valid product UID
              </Text>
            </Inline>
          </Card>
        )}
        {(state === 'not_found' || state === 'error') && (
          <Card tone="critical" padding={2} radius={2}>
            <Inline space={2}>
              <Text size={1}>
                <CloseCircleIcon />
              </Text>
              <Text size={1} weight="bold">
                {errorMsg}
              </Text>
            </Inline>
          </Card>
        )}
      </Inline>
    </Stack>
  )
}
