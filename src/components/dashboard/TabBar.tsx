"use client";

import { C, font } from "@/lib/tokens";

export type Tab = { key: string; label: string; count?: number };

export default function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        borderBottom: `1px solid ${C.border}`,
        fontFamily: font,
      }}
    >
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              padding: "10px 18px",
              border: "none",
              borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
              background: "transparent",
              color: isActive ? C.text : C.textTer,
              fontSize: 12,
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
              marginBottom: -1,
            }}
          >
            {t.label}
            {t.count != null && (
              <span style={{ marginLeft: 6, color: C.textTer, fontWeight: 500 }}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
