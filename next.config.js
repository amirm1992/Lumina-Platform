/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,

    async redirects() {
        return [
            {
                source: '/signup',
                destination: '/apply',
                permanent: true,
            },
        ]
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.com",
                            "font-src 'self' https://fonts.gstatic.com data:",
                            "img-src 'self' data: blob: https: http:",
                            "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://api.stlouisfed.org https://*.rapidapi.com https://*.digitaloceanspaces.com",
                            "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
                            "worker-src 'self' blob:",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self' https://*.clerk.com",
                        ].join('; '),
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
