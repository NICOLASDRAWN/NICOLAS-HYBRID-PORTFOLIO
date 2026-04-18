import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/NICOLAS-HYBRID-PORTFOLIO',
  images: {
    unoptimized: true,
  },
  // Fix for resolution issues when there are lockfiles in parent directories (like C:\Users\nicol\)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
