// next.config.mjs
let userConfig = {}

try {
  // First try with .js extension
  try {
    const imported = await import('./v0-user-next.config.js')
    userConfig = imported.default || imported
  } catch (jsError) {
    // If that fails, try without extension (letting Node.js resolve)
    try {
      const imported = await import('./v0-user-next.config')
      userConfig = imported.default || imported
    } catch (noExtError) {
      // If both fail, initialize as empty object
      userConfig = {}
    }
  }
} catch (e) {
  console.warn('User config import failed:', e.message)
  userConfig = {}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizeFonts: false
  },
}

// Merge the configs properly
function mergeConfig(baseConfig, userConfig) {
  if (!userConfig || Object.keys(userConfig).length === 0) {
    return baseConfig
  }

  const mergedConfig = { ...baseConfig }

  for (const key in userConfig) {
    if (
      typeof baseConfig[key] === 'object' &&
      !Array.isArray(baseConfig[key]) &&
      baseConfig[key] !== null
    ) {
      mergedConfig[key] = {
        ...baseConfig[key],
        ...userConfig[key],
      }
    } else {
      mergedConfig[key] = userConfig[key]
    }
  }

  return mergedConfig
}

// Use the merged config for the export
export default mergeConfig(nextConfig, userConfig)