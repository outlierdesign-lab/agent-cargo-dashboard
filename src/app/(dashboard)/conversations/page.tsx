"use client";

import { C, font } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import ConvRow from "@/components/dashboard/ConvRow";
import { IconSearch } from "@/components/dashboard/Icons";
import { conversations } from "@/data/seed";
import { useMemo, useState } from "react";
import type { ConvStatus } from "@/lib/types";

const tabs: { key: "all" | ConvStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "resolved", label: "Resolved" },
  { key: "escalated", label: "Escalated" },
  { key: "waiting", label: "Waiting" },
];

const tips = [
  { title: "Click any row", body: "Opens the full conversation with chat, AI confidence, KB sources, and takeover controls." },
  { title: "Filter by status", body: "Active = AI is still handling. Waiting = expecting driver response. Escalated = with a human agent." },
  { title: "CSAT column", body: "Star rating from the driver after the conversation resolves. Green ≥4, yellow 3, red ≤2." },
];

export default function ConversationsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    return {
      all: conversations.length,
      active: conversations.filter((c) => c.status === "active").length,
      resolved: conversations.filter((c) => c.status === "resolved").length,
      escalated: conversations.filter((c) => c.status === "escalated").length,
      waiting: conversations.filter((c) => c.status === "waiting").length,
    };
  }, []);

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (q && !`${c.driver} ${c.summary} ${c.vehicle}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [tab, q]);

  return (
    <div>
      <PageHeader title="Conversations" tips={tips} />

      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", gap: 0 }}>
            {tabs.map((t) => {
              const isActive = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: "13px 16px",
                    border: "none",
                    borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
                    color: isActive ? C.text : C.textTer,
                    fontFamily: font,
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    marginBottom: -1,
                    transition: "all 0.15s",
                  }}
                >
                  {t.label}{" "}
                  <span style={{ color: C.textTer, marginLeft: 4, fontWeight: 500 }}>
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              border: `1px solid ${C.border}`,
              background: C.surface,
              minWidth: 220,
            }}
          >
            <IconSearch size={13} color={C.textTer} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search driver, summary, vehicle"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 12,
                color: C.text,
              }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              fontFamily: font,
            }}
          >
            <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>Nothing here</div>
            <div style={{ color: C.textSec, fontSize: 12 }}>
              No conversations match your filters. Try adjusting or clearing them.
            </div>
          </div>
        ) : (
          <div>
            {filtered.map((c) => (
              <ConvRow key={c.id} conv={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
