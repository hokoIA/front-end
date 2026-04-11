import type { NextConfig } from "next";

const backendTarget =
  process.env.BACKEND_PROXY_TARGET || "https://www.hokoainalytics.com.br";

const nextConfig: NextConfig = {
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