/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker builds
  // This creates a minimal build with only necessary files
  // output: 'standalone', // Temporarily disabled due to MIME type issues

  // Disable TypeScript type checking during builds (optional)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Set turbopack root to avoid lockfile warnings
  turbopack: {
    root: __dirname,
  },

  // In Next.js 15+, serverComponentsExternalPackages moved from experimental
  serverExternalPackages: ['knex', '@mastra/core', '@copilotkit/runtime', 'antlr4ng', 'better-sqlite3'],

  // Security headers required for SharedArrayBuffer (DuckDB-Wasm)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // COOP/COEP for SharedArrayBuffer (required for DuckDB-Wasm multi-threading)
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          // Standard security headers
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },

  // Webpack configuration for better-sqlite3 and native modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Externalize better-sqlite3 for server components
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
      });
    }

    return config;
  },
};

module.exports = nextConfig;
