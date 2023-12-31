/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/fetchGameCode",
        destination: process.env.NEXT_PUBLIC_GAME_CODE_API,
      },
    ]
  },
}

module.exports = nextConfig
