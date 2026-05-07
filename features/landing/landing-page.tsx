import dynamic from "next/dynamic";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

const LazyFeatures = dynamic(() => import("./components/Features"), {
    loading: () => (
        <div className="mx-auto my-12 h-96 w-full max-w-7xl animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
    ),
});

const LazyPricing = dynamic(() => import("./components/Pricing"), {
    loading: () => (
        <div className="mx-auto my-12 h-96 w-full max-w-7xl animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
    ),
});

const LazyComparison = dynamic(() => import("./components/Comparison"), {
    loading: () => (
        <div className="mx-auto my-12 h-96 w-full max-w-7xl animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
    ),
});

export function LandingPage() {
    return (
        <div className="landing-page min-h-screen">
            <Header />
            <main>
                <Hero />
                <LazyFeatures />
                <FinalCTA />
                <LazyPricing />
                <LazyComparison />
            </main>
            <Footer />
        </div>
    );
}