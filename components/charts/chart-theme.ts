/** Cores alinhadas à marca ho.ko — uso em Recharts e tooltips */
export const chartTheme = {
  primary: "#192BC2",
  primaryMuted: "#150578",
  accent: "#70E9FD",
  grid: "#e8eef6",
  axis: "#A6A6B3",
  ink: "#191716",
  positive: "#15803d",
  barPalette: ["#192BC2", "#150578", "#0E0E52", "#70E9FD", "#A6A6B3"],
  /** Linhas multi-plataforma: diferenciação por tom da paleta (sem cores de marca gritantes). */
  platformLine: {
    facebook: { stroke: "#192BC2", strokeWidth: 2 },
    instagram: { stroke: "#0891b2", strokeWidth: 2, strokeOpacity: 0.92 },
    google: { stroke: "#64748b", strokeWidth: 2, strokeDasharray: "4 3" },
    linkedin: { stroke: "#0f172a", strokeWidth: 2, strokeOpacity: 0.88 },
    youtube: { stroke: "#475569", strokeWidth: 2, strokeDasharray: "2 2" },
    sessions: { stroke: "#192BC2", strokeWidth: 2 },
    organic: { stroke: "#150578", strokeWidth: 2 },
    leads: { stroke: "#70E9FD", strokeWidth: 1.5 },
  },
  donut: ["#192BC2", "#150578", "#64748b", "#0891b2", "#94a3b8", "#cbd5e1"],
} as const;
