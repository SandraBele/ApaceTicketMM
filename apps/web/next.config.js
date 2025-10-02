/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:4000/:path*',
      },
      {
        source: '/health',
        destination: 'http://api:4000/health',
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.test\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader'
    });
    return config;
  },
}

module.exports = nextConfig
