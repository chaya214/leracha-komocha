import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* מחקנו את output: 'export' כדי לאפשר API וחיבור לדי-בי */
  
  images: {
    unoptimized: true,
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;