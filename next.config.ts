import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {},
    },
  },
  transpilePackages: ["@sanity/client", "@sanity/visual-editing"],
};

export default nextConfig;
