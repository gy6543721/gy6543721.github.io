// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/gy6543721.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '/',
};

module.exports = nextConfig;
