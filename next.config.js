/** @type {import('next').NextConfig} */
const nextConfig = {
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
