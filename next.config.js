/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'better-sqlite3'],
  },
  async redirects() {
    return [
      { source: '/comedie-musicale', destination: '/scene', permanent: true },
      { source: '/theatre', destination: '/scene', permanent: true },
    ]
  },
}

module.exports = nextConfig
