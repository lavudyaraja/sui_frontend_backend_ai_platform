import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Configure server actions body size limit to 50MB
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // Configure image optimization
  images: {
    unoptimized: true, // Required for static exports to work properly
  },
};

export default nextConfig;