/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/gy6543721.github.io' : '',
};

module.exports = nextConfig;