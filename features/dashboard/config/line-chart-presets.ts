import { chartTheme } from "@/components/charts/chart-theme";
import type { ComparisonLineDef } from "@/components/charts/multi-series-line-chart";

const pl = chartTheme.platformLine;

export function reachComparisonLines(): ComparisonLineDef[] {
  return [
    {
      id: "facebook",
      dataKey: "facebook",
      name: "Facebook",
      stroke: pl.facebook.stroke,
      strokeWidth: pl.facebook.strokeWidth,
    },
    {
      id: "instagram",
      dataKey: "instagram",
      name: "Instagram",
      stroke: pl.instagram.stroke,
      strokeWidth: pl.instagram.strokeWidth,
      strokeOpacity: pl.instagram.strokeOpacity,
    },
  ];
}

export function impressionsComparisonLines(
  hasGoogle: boolean,
  hasLinkedin: boolean,
): ComparisonLineDef[] {
  const base: ComparisonLineDef[] = [
    {
      id: "facebook",
      dataKey: "facebook",
      name: "Facebook",
      stroke: pl.facebook.stroke,
      strokeWidth: pl.facebook.strokeWidth,
    },
    {
      id: "instagram",
      dataKey: "instagram",
      name: "Instagram",
      stroke: pl.instagram.stroke,
      strokeWidth: pl.instagram.strokeWidth,
      strokeOpacity: pl.instagram.strokeOpacity,
    },
  ];
  if (hasGoogle) {
    base.push({
      id: "google",
      dataKey: "google",
      name: "Google Analytics",
      stroke: pl.google.stroke,
      strokeWidth: pl.google.strokeWidth,
      strokeDasharray: pl.google.strokeDasharray,
    });
  }
  if (hasLinkedin) {
    base.push({
      id: "linkedin",
      dataKey: "linkedin",
      name: "LinkedIn",
      stroke: pl.linkedin.stroke,
      strokeWidth: pl.linkedin.strokeWidth,
      strokeOpacity: pl.linkedin.strokeOpacity,
    });
  }
  return base;
}
