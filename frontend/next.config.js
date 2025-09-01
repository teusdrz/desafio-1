/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost'],
    },
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key',
        KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || 'hypesoft-frontend',
        KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET || 'client-secret',
        KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/hypesoft',
        API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ]
    },
}

module.exports = nextConfig
