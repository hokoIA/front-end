import type { NextConfig } from "next";

const backendTarget =
  process.env.BACKEND_PROXY_TARGET || "https://www.hokoainalytics.com.br";

console.log("[next.config] BACKEND_PROXY_TARGET =", backendTarget);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_PROXY_TARGET: backendTarget,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendTarget}/api/:path*`,
      },
      {
        source: "/customer/:path*",
        destination: `${backendTarget}/customer/:path*`,
      },
    ];
  },
};

export default nextConfig;