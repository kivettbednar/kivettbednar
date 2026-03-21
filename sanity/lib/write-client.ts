import 'server-only'
import {createClient} from 'next-sanity'
import {projectId, dataset, apiVersion} from './api'
import {token} from './token'

if (!token) {
  console.error(
    '[SANITY] SANITY_API_READ_TOKEN or SANITY_VIEWER_TOKEN is required for write operations. ' +
    'Order creation, inventory updates, and email notifications will fail at runtime.'
  )
}

export const writeClient = createClient({projectId, dataset, apiVersion, token, useCdn: false})
