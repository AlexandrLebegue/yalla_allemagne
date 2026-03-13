import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Optional: Add other production optimizations
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
