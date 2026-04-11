import {type DocumentActionComponent, useClient} from 'sanity'
import {useState} from 'react'
import {CloseIcon} from '@sanity/icons'

const TERMINAL_STATUSES = ['canceled', 'delivered', 'shipped']

const studioToken = process.env.NEXT_PUBLIC_STUDIO_API_TOKEN

export const cancelGelatoOrderAction: DocumentActionComponent = (props) => {
  const {id, draft, published} = props
  const doc = draft || published
  const client = useClient({apiVersion: '2024-01-01'})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const status = (doc as any)?.status as string | undefined

  if (!doc || TERMINAL_STATUSES.includes(status || '')) {
    return null
  }

  return {
    label: 'Cancel Order',
    icon: CloseIcon,
    tone: 'critical' as const,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen
      ? {
          type: 'confirm' as const,
          message:
            'Cancel this order? Orders already in production may not be cancelable in Gelato.',
          onCancel: () => setDialogOpen(false),
          onConfirm: async () => {
            setIsRunning(true)
            try {
              if (!studioToken) {
                throw new Error('NEXT_PUBLIC_STUDIO_API_TOKEN is not configured.')
              }
              const res = await fetch('/api/gelato/cancel', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-studio-token': studioToken,
                },
                body: JSON.stringify({orderId: id}),
              })
              const data = await res.json()
              if (!res.ok && res.status !== 409) {
                throw new Error(data.error || 'Cancel failed')
              }
              // Refresh document to show updated status
              await client.fetch(`*[_type == "order" && _id == $id][0]`, {id})
            } catch (e) {
              console.error('Cancel order failed:', e)
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
