import type { NextConfig } from "next";

// p5's default entry (lib/p5.min.js) is a heavily minified UMD bundle that
// Turbopack's dev-mode module wrapping mis-scopes (duplicate top-level var
// declarations). Aliasing to the unminified build avoids that collision.
const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      p5: "p5/lib/p5.js",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      p5: require.resolve("p5/lib/p5.js"),
    };
    return config;
  },
};

export default nextConfig;
