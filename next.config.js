/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['finance.yahoo.com', 'www.sec.gov'],
  },
};

module.exports = nextConfig;
