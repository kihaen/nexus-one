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
    ],
  },
};

module.exports = nextConfig;
