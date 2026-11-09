// app/layout.tsx
import { AppProviders } from "@/components/providers/app-providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const montserrat = localFont({
  src: "./fonts/montserrat-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
  style: "normal",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "ho.ko AI.nalytics",
    template: "%s · ho.ko AI.nalytics",
  },
  description:
    "Plataforma SaaS B2B para agências e equipes de marketing: clientes, integrações, métricas e IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full font-sans">
        <AppProviders>{children}</AppProviders>
      </body>

      <GoogleAnalytics gaId="G-L3EZ3QE0GY" />
    </html>
  );
}
