import { createRequire } from "module";

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "**"
      }
    ]
  }
};

export default nextConfig;
