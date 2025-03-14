/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'i.imgur.com', 'photos.zillowstatic.com'],
  },
}

module.exports = nextConfig
