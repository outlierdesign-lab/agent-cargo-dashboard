"use client";

import { C, font, mono } from "@/lib/tokens";
import type { Conv } from "@/lib/types";
import StatusPill from "./StatusPill";
import IntentTag from "./IntentTag";
import LangBadge from "./LangBadge";
import { IconStar } from "./Icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function csatColor(score: number) {
  if (score >= 4) return C.green;
  if (score === 3) return C.yellow;
  return C.red;
}

export default function ConvRow({ conv, showCsat = true }: { conv: Conv; showCsat?: boolean }) {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => router.push(`/conversations/${conv.id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto auto auto auto",
        alignItems: "center",
        gap: 14,
        padding: "13px 20px 13px 17px",
        borderLeft: `3px solid ${hover ? C.accent : "transparent"}`,
        background: hover ? C.surfaceAlt : "transparent",
        borderBottom: `1px solid ${C.borderLight}`,
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
        fontFamily: font,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: C.surfaceAlt,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10.5,
          fontWeight: 600,
          color: C.textSec,
          fontFamily: mono,
          flexShrink: 0,
        }}
      >
        {initials(conv.driver)}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 2 }}>
          {conv.driver}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: C.textSec,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {conv.summary}
        </div>
      </div>
      <LangBadge lang={conv.lang} />
      <IntentTag intent={conv.intent} />
      <StatusPill status={conv.status} />
      {showCsat && (
        <div style={{ width: 50, textAlign: "right" }}>
          {conv.csat != null ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 600,
                color: csatColor(conv.csat),
              }}
            >
              <IconStar size={10} color={csatColor(conv.csat)} />
              {conv.csat}.0
            </span>
          ) : (
            <span style={{ color: C.textTer, fontFamily: mono, fontSize: 11 }}>—</span>
          )}
        </div>
      )}
      <div style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer, minWidth: 64, textAlign: "right" }}>
        {timeAgo(conv.startedAt)}
      </div>
    </div>
  );
}
