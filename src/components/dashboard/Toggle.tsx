"use client";

import { C } from "@/lib/tokens";

export default function Toggle({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange?.(!on)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: on ? C.text : C.border,
        border: "none",
        padding: 2,
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s",
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
      }}
      aria-pressed={on}
    >
      <span
        style={{
          display: "block",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#FFFFFF",
          transform: on ? "translateX(16px)" : "translateX(0)",
          transition: "transform 0.15s",
        }}
      />
    </button>
  );
}
