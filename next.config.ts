import type { NextConfig } from "next";

function normalizeBase(raw: string): string {
  return raw.replace(/\/$/, "");
}

const backendProxyTarget = process.env.BACKEND_PROXY_TARGET?.trim();
const fallbackApiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

if (!backendProxyTarget && process.env.NODE_ENV === "production") {
  throw new Error(
    "[next.config] BACKEND_PROXY_TARGET é obrigatório em produção para o proxy /api e /customer.",
  );
}

const backendTarget = normalizeBase(
  backendProxyTarget || fallbackApiBase || "http://localhost:4000",
);

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "hokoainalytics.com.br",
          },
        ],
        destination: "https://www.hokoainalytics.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.hokoainalytics.com.br",
          },
        ],
        destination: "https://www.hokoainalytics.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "hokoainalytics.com",
          },
        ],
        destination: "https://www.hokoainalytics.com/:path*",
        permanent: true,
      },
    ];
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