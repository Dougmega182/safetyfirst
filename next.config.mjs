// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for improved error handling
  reactStrictMode: true,

  // Disable static exports, forcing server-side rendering
  output: 'standalone',

  // Optionally enable image optimization
  images: {
    domains: ['your-domain.com'],
  },

  // Keep ESLint and TypeScript checking enabled for better code quality
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'utils']
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Add custom webpack configuration if needed
  webpack: (config, { isServer }) => {
    // Add your custom webpack configs here
    return config;
  },

  // Enable automatic static optimization where applicable
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

export default nextConfig;
