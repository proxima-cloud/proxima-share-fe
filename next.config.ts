import type { NextConfig } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "NO_API_URL_PROVIDED";
const apiUrl = new URL(API_BASE_URL);


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as 'http' | 'https',
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/api/files/download/**",
      }
    ],
  },
};

export default nextConfig;
