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
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.sagitariodigital.com.ar",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.apple.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "m3.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m3.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "w.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "w.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
