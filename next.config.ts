import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {},
    },
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
