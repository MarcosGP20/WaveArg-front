import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "store.storeimages.cdn-apple.com",
        port: "",
        pathname: "/**",
      },
      // Si tienes otros dominios como los de SQL Server o Firebase, agregalos igual:
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "www.sagitariodigital.com.ar",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.apple.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.sagitariodigital.com.ar",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
