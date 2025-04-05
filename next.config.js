/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "localhost",
      "i.imgur.com",
      "photos.zillowstatic.com",
      "my-nexus-images.s3.amazonaws.com",
      "avatars.githubusercontent.com",
    ],
  },
  // Suppress hydration warnings from development overlay
  suppressHydrationWarning: true,
};

module.exports = nextConfig;
