export const PLANNING_PLATFORM_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "facebook", label: "Meta / Facebook" },
  { value: "instagram", label: "Meta / Instagram" },
  { value: "google_analytics", label: "Google Analytics" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
];

export function platformLabel(value: string | undefined): string {
  if (!value) return "—";
  const f = PLANNING_PLATFORM_OPTIONS.find(
    (p) => p.value.toLowerCase() === value.toLowerCase(),
  );
  return f?.label ?? value;
}
