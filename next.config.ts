import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  deploymentId: process.env.NEXT_DEPLOYMENT_ID || "nk-wedding-dev-v2",
  outputHashSalt: process.env.NEXT_HASH_SALT || "nk-wedding-dev-v2",
  allowedDevOrigins: [
    "nk-wedding.japs.dev",
    "wedding.japs.dev",
    "*.japs.dev",
    "localhost:3040",
    "127.0.0.1:3040",
  ],
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
