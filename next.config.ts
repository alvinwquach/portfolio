import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sanity/client", "@sanity/visual-editing"],
};

export default nextConfig;
