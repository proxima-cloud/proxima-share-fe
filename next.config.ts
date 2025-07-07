import type { NextConfig } from "next";

const apiUrlString = process.env.NEXT_PUBLIC_API_BASE_URL || "https://proximacloud.ddns.net:8080";
const apiUrl = new URL(apiUrlString);


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
        protocol: apiUrl.protocol.replace(":", ""),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/api/files/download/**",
      }
    ],
  },
};

export default nextConfig;
