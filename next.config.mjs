// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporarily disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable TypeScript checking during builds
    ignoreBuildErrors: true,
  }
};

export default nextConfig;