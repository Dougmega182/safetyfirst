// next.config.mjs
let userConfig = {};

try {
  try {
    const imported = await import('./v0-user-next.config.js');
    userConfig = imported.default || imported;
  } catch (jsError) {
    try {
      const imported = await import('./v0-user-next.config');
      userConfig = imported.default || imported;
    } catch (noExtError) {
      userConfig = {};
    }
  }
} catch (e) {
  console.warn('User config import failed:', e.message);
  userConfig = {};
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
    optimizeCss: true, // ✅ Keeps CSS handling optimized
  },
};

// Merge the configs properly
function mergeConfig(baseConfig, userConfig) {
  if (!userConfig || Object.keys(userConfig).length === 0) {
    return baseConfig;
  }

  const mergedConfig = { ...baseConfig };

  for (const key in userConfig) {
    if (
      typeof baseConfig[key] === 'object' &&
      !Array.isArray(baseConfig[key]) &&
      baseConfig[key] !== null
    ) {
      mergedConfig[key] = {
        ...baseConfig[key],
        ...userConfig[key],
      };
    } else {
      mergedConfig[key] = userConfig[key];
    }
  }

  return mergedConfig;
}

export default mergeConfig(nextConfig, userConfig);
