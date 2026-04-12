const ADMIN_HEADER = 'x-admin-token'
const STUDIO_HEADER = 'x-studio-token'

function readBearerToken(authorizationHeader) {
  if (!authorizationHeader) return null
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}

const tokensConfigured = () => Boolean(process.env.ADMIN_API_TOKEN || process.env.NEXT_PUBLIC_STUDIO_API_TOKEN)

const jsonResponse = (body, init) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {'content-type': 'application/json'},
  })

/**
 * @param {Request | import('next/server').NextRequest} req
 * @returns {NextResponse | null}
 */
export function ensureAdminRequest(req) {
  const adminToken = process.env.ADMIN_API_TOKEN
  const studioToken = process.env.NEXT_PUBLIC_STUDIO_API_TOKEN

  const bearer = readBearerToken(req.headers.get('authorization'))
  const adminHeaderToken = req.headers.get(ADMIN_HEADER)
  const studioHeaderToken = req.headers.get(STUDIO_HEADER)

  const adminMatch = adminToken && (adminHeaderToken === adminToken || bearer === adminToken)
  const studioMatch = studioToken && studioHeaderToken === studioToken

  if (adminMatch || studioMatch) {
    return null
  }

  if (!tokensConfigured()) {
    console.error('[SECURITY] ADMIN_API_TOKEN or NEXT_PUBLIC_STUDIO_API_TOKEN must be configured to access internal Gelato routes.')
    return jsonResponse({error: 'Admin API token not configured'}, {status: 500})
  }

  return jsonResponse({error: 'Unauthorized'}, {status: 401})
}
