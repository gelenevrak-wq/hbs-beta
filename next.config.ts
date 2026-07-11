import type { NextConfig } from "next";
import os from "os";

// Dynamically determine all local IPv4 network interfaces to prevent HMR blocks on mobile
const getLocalNetworkOrigins = () => {
  const origins = ["localhost:3000", "localhost:3001", "localhost:3002", "localhost"];
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (netInterface) {
      for (const net of netInterface) {
        if (net.family === "IPv4" && !net.internal) {
          origins.push(net.address);
          origins.push(`${net.address}:3000`);
          origins.push(`${net.address}:3001`);
          origins.push(`${net.address}:3002`);
        }
      }
    }
  }
  return origins;
};

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(self), camera=(self), microphone=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: getLocalNetworkOrigins(),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
