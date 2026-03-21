import {NextResponse} from 'next/server'
import {getGelatoStatus, isGelatoEnabled} from '@/lib/gelato'

export const runtime = 'nodejs'

/**
 * GET /api/gelato/status
 * Check Gelato API configuration and connectivity
 * Useful for debugging integration issues
 */
export async function GET() {
  try {
    const status = await getGelatoStatus()

    return NextResponse.json({
      ...status,
      timestamp: new Date().toISOString(),
      message: !status.enabled
        ? 'Gelato API is not configured. Add GELATO_API_KEY to environment variables.'
        : status.apiReachable
        ? 'Gelato API is configured and reachable.'
        : 'Gelato API is configured but not reachable. Check your API key and network connection.',
    })
  } catch (error: unknown) {
    console.error('Gelato status check error:', error)
    return NextResponse.json(
      {
        enabled: false,
        apiKeyConfigured: false,
        error: 'Status check failed',
        message: 'Failed to check Gelato API status',
      },
      {status: 500}
    )
  }
}
