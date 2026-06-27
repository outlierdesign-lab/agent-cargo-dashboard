"use client";

import { C, font } from "@/lib/tokens";
import { IconChevronDown, IconInfo } from "./Icons";
import { useState, useRef, useEffect } from "react";

export type DotTip = { title: string; body: string };

export default function Dot({ tips }: { tips: DotTip[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", fontFamily: font }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 12px 5px 8px",
          background: C.surface,
          border: `1px solid ${C.border}`,
          color: C.text,
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${C.accent}, #0A7780)`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "dotPulse 2.2s ease-in-out infinite",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFFFFF" }} />
        </span>
        <span style={{ fontWeight: 600 }}>Dot</span>
        <span style={{ color: C.textTer, fontSize: 10.5 }}>Explains</span>
        <IconChevronDown size={10} color={open ? C.accent : C.textTer} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: 320,
            background: C.surface,
            border: `1px solid ${C.border}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            zIndex: 50,
            padding: "4px 0",
          }}
        >
          {tips.map((tip, i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderBottom: i < tips.length - 1 ? `1px solid ${C.borderLight}` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <IconInfo size={12} color={C.accent} />
                <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text }}>{tip.title}</div>
              </div>
              <div style={{ fontSize: 11.5, color: C.textSec, lineHeight: 1.45 }}>{tip.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
