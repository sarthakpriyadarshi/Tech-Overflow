import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "syd.cloud.appwrite.io",
        pathname: "**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
