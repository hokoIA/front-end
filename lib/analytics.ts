type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
    if (typeof window === "undefined") return;

    window.gtag?.("event", eventName, {
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...params,
    });
}