import { chartTheme } from "@/components/charts/chart-theme";
import type { ComparisonLineDef } from "@/components/charts/multi-series-line-chart";

const pl = chartTheme.platformLine;

export function reachComparisonLines(
  hasGoogle: boolean,
  hasLinkedin: boolean,
  hasYoutube: boolean,
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
  if (hasYoutube) {
    base.push({
      id: "youtube",
      dataKey: "youtube",
      name: "YouTube",
      stroke: pl.youtube.stroke,
      strokeWidth: pl.youtube.strokeWidth,
      strokeDasharray: pl.youtube.strokeDasharray,
    });
  }
  return base;
}

export function impressionsComparisonLines(
  hasGoogle: boolean,
  hasLinkedin: boolean,
  hasYoutube: boolean,
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
  if (hasYoutube) {
    base.push({
      id: "youtube",
      dataKey: "youtube",
      name: "YouTube",
      stroke: pl.youtube.stroke,
      strokeWidth: pl.youtube.strokeWidth,
      strokeDasharray: pl.youtube.strokeDasharray,
    });
  }
  return base;
}
