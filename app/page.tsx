// app/page.tsx
import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/landing-page";

export const metadata: Metadata = {
  title: "ho.ko AI.nalytics",
  description:
    "Plataforma de inteligência de marca e comunicação que conecta performance, percepção e valor para decisões mais rápidas, embasadas e estratégicas.",
};

export default function HomePage() {
  return <LandingPage />;
}