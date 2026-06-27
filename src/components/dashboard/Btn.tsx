"use client";

import { C, font } from "@/lib/tokens";
import { useState } from "react";

type Variant = "default" | "primary" | "danger" | "success" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, { bg: string; color: string; border: string; hoverBg: string }> = {
  default: { bg: C.surface, color: C.text, border: C.border, hoverBg: C.surfaceAlt },
  primary: { bg: C.accent, color: "#FFFFFF", border: C.accent, hoverBg: "#0A8995" },
  danger: { bg: C.red, color: "#FFFFFF", border: C.red, hoverBg: "#C82E3B" },
  success: { bg: C.green, color: "#FFFFFF", border: C.green, hoverBg: "#13703F" },
  ghost: { bg: "transparent", color: C.textSec, border: "transparent", hoverBg: C.surfaceAlt },
};

export default function Btn({
  children,
  variant = "default",
  size = "md",
  onClick,
  disabled,
  style,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit";
}) {
  const v = variants[variant];
  const [hover, setHover] = useState(false);
  const padding = size === "sm" ? "5px 12px" : "8px 18px";
  const fontSize = size === "sm" ? 11 : 12;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding,
        background: hover && !disabled ? v.hoverBg : v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        fontFamily: font,
        fontSize,
        fontWeight: 500,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s, border-color 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
