export { };

declare global {
    interface Window {
        gtag?: (
            command: "event" | "config" | "js",
            eventNameOrTargetId: string | Date,
            params?: Record<string, unknown>
        ) => void;
    }
}