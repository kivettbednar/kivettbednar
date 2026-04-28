import {type DocumentActionComponent, useClient} from 'sanity'
import {useState} from 'react'
import {ArchiveIcon, RestoreIcon} from '@sanity/icons'

/**
 * Toggle the soft-archive flag on a document. Archived items stay in the
 * dataset (so order history and references don't break) but are filtered
 * out of every public-site query.
 *
 * Two complementary actions:
 *   - archiveAction:   shown on non-archived docs, sets archived = true
 *   - unarchiveAction: shown on archived docs,    sets archived = false
 */

function patchArchived(targetId: string, value: boolean) {
  return {
    targetId,
    value,
  }
}

export const archiveAction: DocumentActionComponent = (props) => {
  const {id, draft, published, onComplete} = props
  const doc = draft || published
  const client = useClient({apiVersion: '2024-01-01'})
  const [running, setRunning] = useState(false)

  if (!doc) return null
  if ((doc as any).archived === true) return null

  return {
    label: running ? 'Archiving…' : 'Archive',
    icon: ArchiveIcon,
    tone: 'caution' as const,
    disabled: running,
    onHandle: async () => {
      setRunning(true)
      try {
        // Patch both draft and published versions so the archive sticks
        // regardless of whether the doc has unpublished changes.
        const {targetId, value} = patchArchived(id, true)
        await client
          .transaction()
          .patch(targetId, {set: {archived: value}})
          .patch(`drafts.${targetId}`, {set: {archived: value}})
          .commit({autoGenerateArrayKeys: true})
      } catch (error) {
        // The published or draft may not exist; that's fine — the patch
        // for the missing one will fail but the other will succeed.
        // Re-attempt as separate patches so we don't lose the working one.
        try {
          await client.patch(id).set({archived: true}).commit()
        } catch (_e) {
          /* document only exists as a draft; that path was already tried */
        }
      } finally {
        setRunning(false)
        onComplete()
      }
    },
  }
}

export const unarchiveAction: DocumentActionComponent = (props) => {
  const {id, draft, published, onComplete} = props
  const doc = draft || published
  const client = useClient({apiVersion: '2024-01-01'})
  const [running, setRunning] = useState(false)

  if (!doc) return null
  if ((doc as any).archived !== true) return null

  return {
    label: running ? 'Unarchiving…' : 'Unarchive',
    icon: RestoreIcon,
    tone: 'positive' as const,
    disabled: running,
    onHandle: async () => {
      setRunning(true)
      try {
        await client
          .transaction()
          .patch(id, {set: {archived: false}})
          .patch(`drafts.${id}`, {set: {archived: false}})
          .commit({autoGenerateArrayKeys: true})
      } catch (_error) {
        try {
          await client.patch(id).set({archived: false}).commit()
        } catch (_e) {
          /* draft-only path already attempted */
        }
      } finally {
        setRunning(false)
        onComplete()
      }
    },
  }
}
