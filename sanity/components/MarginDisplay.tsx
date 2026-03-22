'use client'

import {useFormValue, type NumberInputProps} from 'sanity'
import {Stack, Text, Card} from '@sanity/ui'
import {useCallback} from 'react'

export function MarginDisplay(props: NumberInputProps) {
  const priceCents = useFormValue(['priceCents']) as number | undefined
  const costCents = props.value as number | undefined

  const renderMargin = useCallback(() => {
    if (!priceCents || !costCents) return null

    const marginCents = priceCents - costCents
    const marginPercent = (marginCents / priceCents) * 100
    const isNegative = marginCents < 0
    const isLow = marginPercent < 20

    const color = isNegative ? 'red' : isLow ? 'yellow' : 'green'
    const tone = isNegative ? 'critical' : isLow ? 'caution' : 'positive'

    return (
      <Card padding={3} radius={2} tone={tone} marginTop={2}>
        <Text size={1} weight="bold" style={{color}}>
          Margin: ${(marginCents / 100).toFixed(2)} ({marginPercent.toFixed(1)}%)
          {isNegative && ' — LOSING MONEY'}
          {!isNegative && isLow && ' — Low margin'}
        </Text>
      </Card>
    )
  }, [priceCents, costCents])

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {renderMargin()}
    </Stack>
  )
}
