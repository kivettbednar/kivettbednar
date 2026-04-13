import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = [
      {key: 'X-Content-Type-Options', value: 'nosniff'},
      {key: 'X-Frame-Options', value: 'DENY'},
      {key: 'X-XSS-Protection', value: '1; mode=block'},
      {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
      {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ]

    return [
      {
        // Sanity Studio needs unsafe-eval for its JS runtime
        source: '/studio/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.sanity.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self' data:; connect-src 'self' https://cdn.sanity.io https://*.sanity.io; frame-src 'self'",
          },
        ],
      },
      {
        // Tighter CSP for the public site — no unsafe-eval
        source: '/((?!studio).*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.sanity.io https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://i.scdn.co; font-src 'self' data:; connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://*.stripe.com; frame-src 'self' https://*.stripe.com https://checkout.stripe.com https://www.youtube.com https://open.spotify.com https://bandcamp.com https://*.bandcamp.com",
          },
        ],
      },
    ]
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
