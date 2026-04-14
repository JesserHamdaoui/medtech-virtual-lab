import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["react-p5", "p5"],
  turbopack: {
    root: process.cwd(),
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      p5$: path.resolve(process.cwd(), "node_modules/p5/lib/p5.js"),
    };

    return config;
  },
};

export default nextConfig;
