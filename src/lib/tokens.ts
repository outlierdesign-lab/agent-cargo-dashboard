export const C = {
  bg: "#F7F7F7",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F0F0",
  border: "#E5E5E5",
  borderLight: "#EFEFEF",
  text: "#111111",
  textSec: "#555555",
  textTer: "#999999",
  accent: "#0E9AA7",
  accentSoft: "#0E9AA710",
  accentBorder: "#0E9AA730",
  green: "#18864B",
  greenSoft: "#18864B10",
  greenBorder: "#18864B30",
  red: "#DC3545",
  redSoft: "#DC354510",
  redBorder: "#DC354530",
  blue: "#2563EB",
  blueSoft: "#2563EB10",
  blueBorder: "#2563EB30",
  yellow: "#CA8A04",
  yellowSoft: "#CA8A0410",
  yellowBorder: "#CA8A0430",
  purple: "#7C3AED",
  purpleSoft: "#7C3AED10",
  purpleBorder: "#7C3AED30",
} as const;

export const font = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
export const mono = "'IBM Plex Mono', 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace";
export const display = "'Geist', 'Inter', -apple-system, sans-serif";

export const borderBase = `1px solid ${C.border}`;

export const accentTopEdge: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 3,
  background: `linear-gradient(90deg, ${C.accent}, ${C.accent}40)`,
};
