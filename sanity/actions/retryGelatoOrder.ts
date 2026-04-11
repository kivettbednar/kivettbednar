import {type DocumentActionComponent, useClient} from 'sanity'
import {useState} from 'react'
import {ResetIcon} from '@sanity/icons'

const studioToken = process.env.NEXT_PUBLIC_STUDIO_API_TOKEN

export const retryGelatoOrderAction: DocumentActionComponent = (props) => {
  const {id, draft, published} = props
  const doc = draft || published
  const client = useClient({apiVersion: '2024-01-01'})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const status = (doc as any)?.status as string | undefined
  const gelatoError = (doc as any)?.gelatoError as string | undefined

  if (status !== 'gelato_failed') {
    return null
  }

  return {
    label: 'Retry Gelato Submission',
    icon: ResetIcon,
    tone: 'primary' as const,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen
      ? {
          type: 'confirm' as const,
          message: `Retry submitting this order to Gelato?\n\nPrevious error: ${gelatoError || 'Unknown'}`,
          onCancel: () => setDialogOpen(false),
          onConfirm: async () => {
            setIsRunning(true)
            try {
              if (!studioToken) {
                throw new Error('NEXT_PUBLIC_STUDIO_API_TOKEN is not configured.')
              }
              const res = await fetch('/api/gelato/retry', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-studio-token': studioToken,
                },
                body: JSON.stringify({orderId: id}),
              })
              const data = await res.json()
              if (!res.ok) {
                throw new Error(data.error || 'Retry failed')
              }
              await client.fetch(`*[_type == "order" && _id == $id][0]`, {id})
            } catch (e) {
              console.error('Retry order failed:', e)
            } finally {
              setIsRunning(false)
              setDialogOpen(false)
            }
          },
        }
      : null,
    disabled: isRunning,
  }
}
