import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.16", "192.168.100.16:3001", "localhost:3001"]
};

export default nextConfig;
