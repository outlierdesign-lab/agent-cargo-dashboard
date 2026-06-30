"use client";

import { useId } from "react";

export default function Logo({
  size = 28,
  monochrome = false,
}: {
  size?: number;
  monochrome?: boolean;
}) {
  const gradId = useId();
  const baseColor = monochrome ? "currentColor" : "#0F1729";
  const innerColor = monochrome ? "#FFFFFF" : "#FFFFFF";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Agent Cargo"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>
      <path d="M32 4 L60 60 L54.4 60 L45.2 43.6 L18.8 43.6 L9.6 60 L4 60 L32 4Z" fill={baseColor} />
      <path d="M32 18 L41.6 36 L22.4 36 L32 18Z" fill={innerColor} />
      <rect x="24" y="46" width="16" height="2.4" rx="1.2" fill={`url(#${gradId})`} />
      <rect x="21" y="50" width="22" height="2.4" rx="1.2" fill={`url(#${gradId})`} opacity="0.7" />
      <rect x="18" y="54" width="28" height="2.4" rx="1.2" fill={`url(#${gradId})`} opacity="0.4" />
    </svg>
  );
}
