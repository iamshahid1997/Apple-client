/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      // 'rb.gy',
      // 'cdn.sanity.io',
      'lh3.googleusercontent.com',
      'i.postimg.cc',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
