"use client";

import { C, display, font } from "@/lib/tokens";
import { IconX } from "./Icons";
import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17,17,17,0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: font,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          width: "100%",
          maxWidth: width,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: display,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h3>
          <button onClick={onClose} style={{ color: C.textSec, display: "flex", padding: 4 }}>
            <IconX size={16} />
          </button>
        </div>
        <div style={{ overflow: "auto", padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
