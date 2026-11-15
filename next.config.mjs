/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // The interpreter binary is spawned at runtime via a computed path, so
  // Next.js file tracing can't see it — include it explicitly in the
  // serverless bundle for /api/execute (Linux binary: interpreter/bin/bornocode).
  outputFileTracingIncludes: {
    "/api/execute": ["./interpreter/bin/**"],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
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
