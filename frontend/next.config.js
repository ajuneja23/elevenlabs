/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    KALSHI_API_KEY: process.env.KALSHI_API_KEY,
  },
  images: {
    domains: [
      // ... your existing domains
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 