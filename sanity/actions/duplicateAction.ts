import {type DocumentActionComponent, useClient} from 'sanity'
import {useRouter} from 'sanity/router'
import {useState} from 'react'
import {CopyIcon} from '@sanity/icons'
import {uuid} from '@sanity/uuid'

/**
 * Duplicate a document into a new draft. Strips system fields, resets the
 * slug, prefixes the title with "Copy of …", and navigates the editor to
 * the new draft so the user can adjust details immediately.
 *
 * Wired in `sanity.config.ts` for product, event, and lessonPackage.
 */
export const duplicateAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published, onComplete} = props
  const source = draft || published
  const client = useClient({apiVersion: '2024-01-01'})
  const router = useRouter()
  const [running, setRunning] = useState(false)

  if (!source) return null

  return {
    label: running ? 'Duplicating…' : 'Duplicate',
    icon: CopyIcon,
    tone: 'primary' as const,
    disabled: running,
    onHandle: async () => {
      setRunning(true)
      try {
        // Strip the document's identity + slug + freshness fields. Title
        // gets a "Copy of" prefix so the duplicate stands out in lists.
        const {
          _id: _stripId,
          _rev: _stripRev,
          _createdAt: _stripCreatedAt,
          _updatedAt: _stripUpdatedAt,
          slug: _stripSlug,
          ...rest
        } = source as Record<string, any>

        const title =
          typeof rest.title === 'string' && rest.title
            ? `Copy of ${rest.title}`
            : 'Copy'

        const newId = `drafts.${uuid()}`
        await client.create({
          ...rest,
          _id: newId,
          _type: type,
          title,
          // Force user to set a fresh slug so URLs don't collide.
          slug: undefined,
          // Soft-archive flags shouldn't carry over.
          archived: false,
        })

        // Navigate the Studio to the new draft.
        router.navigateIntent('edit', {id: newId.replace(/^drafts\./, ''), type})
      } catch (error) {
        console.error('Duplicate failed', error)
        // eslint-disable-next-line no-alert
        if (typeof window !== 'undefined') alert('Failed to duplicate document. Check the console.')
      } finally {
        setRunning(false)
        onComplete()
      }
    },
  }
}
