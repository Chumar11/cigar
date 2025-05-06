/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  eslint: {
    ignoreDuringBuilds: true // ✅ This disables ESLint during build
  }
}

export default nextConfig
