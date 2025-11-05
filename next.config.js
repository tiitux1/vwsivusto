/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static export
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
