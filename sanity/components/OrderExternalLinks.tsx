'use client'

import {type StringInputProps} from 'sanity'
import {Stack, Text, Inline, Button} from '@sanity/ui'
import {LaunchIcon} from '@sanity/icons'

export function TrackingUrlInput(props: StringInputProps) {
  const value = props.value

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {value && (
        <Inline space={2}>
          <Button
            as="a"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            mode="ghost"
            tone="primary"
            icon={LaunchIcon}
            text="Track Shipment"
            fontSize={1}
            padding={2}
          />
        </Inline>
      )}
    </Stack>
  )
}

export function StripeSessionIdInput(props: StringInputProps) {
  const value = props.value

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {value && (
        <Inline space={2}>
          <Button
            as="a"
            href={`https://dashboard.stripe.com/checkout/sessions/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            mode="ghost"
            tone="primary"
            icon={LaunchIcon}
            text="Open in Stripe Dashboard"
            fontSize={1}
            padding={2}
          />
        </Inline>
      )}
    </Stack>
  )
}
