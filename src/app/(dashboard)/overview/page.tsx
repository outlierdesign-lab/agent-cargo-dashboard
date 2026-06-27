"use client";

import { C, display, font, mono, accentTopEdge } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import ConvRow from "@/components/dashboard/ConvRow";
import StatusPill from "@/components/dashboard/StatusPill";
import { IconArrowUp, IconChevronRight, IconBranch } from "@/components/dashboard/Icons";
import {
  conversations,
  hourlyVolume,
  metrics,
  sparklineData,
  workflowSummary,
} from "@/data/seed";
import Link from "next/link";
import { useState } from "react";

const tips = [
  {
    title: "AI Resolved is your headline metric",
    body: "What share of conversations the AI closed without human help. 60%+ is healthy. Trend tells you if you're improving.",
  },
  {
    title: "ROI is the proof",
    body: "FTE equivalent and hours saved show the dollar impact. Use these numbers when reporting to leadership.",
  },
  {
    title: "Volume + Workflows together",
    body: "Volume tells you when drivers contact you. Workflows tell you what they're contacting about. Cross-reference to spot patterns.",
  },
];

export default function OverviewPage() {
  const currentHour = new Date().getHours();
  const recent = [...conversations]
    .sort((a, b) => {
      const order = { active: 0, escalated: 1, waiting: 2, resolved: 3 };
      return order[a.status] - order[b.status];
    })
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Overview" tips={tips} />

      {/* Top metrics row */}
      <div
        style={{
          position: "relative",
          background: C.surface,
          border: `1px solid ${C.border}`,
          marginBottom: 14,
        }}
      >
        <div style={accentTopEdge} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          <div style={{ borderRight: `1px solid ${C.borderLight}` }}>
            <MetricCard
              label="AI Resolved"
              value="63.9%"
              trend={metrics.aiResolvedTrend}
              subtitle="of all conversations this week"
              sparkData={sparklineData.aiResolved}
              sparkColor={C.green}
            />
          </div>
          <div style={{ borderRight: `1px solid ${C.borderLight}` }}>
            <MetricCard
              label="Sent to Human"
              value="14.7%"
              trend={metrics.sentToHumanTrend}
              subtitle="escalated this week"
              sparkData={sparklineData.sentToHuman}
              sparkColor={C.red}
            />
          </div>
          <div style={{ borderRight: `1px solid ${C.borderLight}` }}>
            <MetricCard
              label="Avg Response"
              value="2.3s"
              subtitle="target under 3s"
              sparkData={sparklineData.avgResponse}
              sparkColor={C.accent}
            />
          </div>
          <MetricCard
            label="Driver Satisfaction"
            value="4.6/5"
            trend={5}
            subtitle="from 142 ratings"
            sparkData={sparklineData.csat}
            sparkColor={C.green}
          />
        </div>
      </div>

      {/* ROI */}
      <div
        style={{
          position: "relative",
          background: C.surface,
          border: `1px solid ${C.border}`,
          marginBottom: 14,
          padding: 0,
        }}
      >
        <div style={accentTopEdge} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ padding: "22px 26px", borderRight: `1px solid ${C.borderLight}` }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 10,
                color: C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              FTE Equivalent
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: display,
                  fontSize: 36,
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {metrics.fteEquivalent}
              </span>
              <span style={{ fontSize: 13, color: C.textSec, fontWeight: 500 }}>agents</span>
            </div>
            <div
              style={{
                marginTop: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: C.green,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <IconArrowUp size={11} color={C.green} />
              {metrics.fteTrend} vs last month
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 11.5,
                color: C.textSec,
                lineHeight: 1.55,
                maxWidth: 360,
              }}
            >
              Based on 204 conversations resolved at 8.2 min avg human handle time
            </div>
          </div>
          <div style={{ padding: "22px 26px" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 10,
                color: C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Hours Saved This Month
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: display,
                  fontSize: 36,
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {metrics.hoursSaved}
              </span>
              <span style={{ fontSize: 13, color: C.textSec, fontWeight: 500 }}>hrs</span>
            </div>
            <div
              style={{
                marginTop: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: C.green,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <IconArrowUp size={11} color={C.green} />
              {metrics.hoursSavedTrend}% vs last month
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 18,
                fontFamily: mono,
                fontSize: 11,
                color: C.textSec,
              }}
            >
              <span>
                Human: <span style={{ color: C.text, fontWeight: 600 }}>{metrics.humanHandleMin} min</span>
              </span>
              <span style={{ color: C.borderLight }}>·</span>
              <span>
                AI: <span style={{ color: C.text, fontWeight: 600 }}>{metrics.aiHandleMin} min</span>
              </span>
              <span style={{ color: C.borderLight }}>·</span>
              <span style={{ color: C.accent, fontWeight: 600 }}>{metrics.speedMultiplier}× faster</span>
            </div>
          </div>
        </div>
      </div>

      {/* Volume + Workflows */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          marginBottom: 14,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
        }}
      >
        <VolumePanel hourly={hourlyVolume} currentHour={currentHour} />
        <WorkflowsPanel />
      </div>

      {/* Recent conversations */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${C.borderLight}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: display,
              fontSize: 13,
              fontWeight: 600,
              color: C.text,
              letterSpacing: "-0.01em",
            }}
          >
            Recent Conversations
          </h3>
          <Link
            href="/conversations"
            style={{
              fontSize: 11.5,
              color: C.accent,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            View all
            <IconChevronRight size={10} color={C.accent} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: C.textTer,
              fontSize: 13,
              fontFamily: font,
            }}
          >
            All clear — no active conversations right now
          </div>
        ) : (
          <div>
            {recent.map((c) => (
              <ConvRow key={c.id} conv={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VolumePanel({ hourly, currentHour }: { hourly: number[]; currentHour: number }) {
  const [range, setRange] = useState("today");
  const ranges = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "Last 7 days" },
    { key: "month", label: "Last month" },
  ];
  const max = Math.max(...hourly);
  const total = hourly.reduce((a, b) => a + b, 0);
  const inline = [
    { label: "Total", value: total, color: C.text },
    { label: "AI Resolved", value: Math.round(total * 0.64), color: C.green },
    { label: "Escalated", value: Math.round(total * 0.15), color: C.red },
    { label: "In Progress", value: Math.round(total * 0.07), color: C.blue },
  ];

  return (
    <div style={{ padding: "18px 22px", borderRight: `1px solid ${C.borderLight}` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: display,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          Conversation Volume
        </h3>
        <div style={{ display: "flex", gap: 0, border: `1px solid ${C.border}` }}>
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              style={{
                padding: "4px 10px",
                fontSize: 10.5,
                fontWeight: range === r.key ? 600 : 500,
                color: range === r.key ? C.text : C.textTer,
                background: range === r.key ? C.surfaceAlt : "transparent",
                fontFamily: font,
                borderLeft: r.key !== ranges[0].key ? `1px solid ${C.border}` : "none",
                transition: "all 0.15s",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, marginBottom: 16, fontSize: 11, fontFamily: font }}>
        {inline.map((m) => (
          <div key={m.label}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 9.5,
                color: C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 2,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontFamily: display,
                fontSize: 16,
                fontWeight: 600,
                color: m.color,
                letterSpacing: "-0.02em",
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <BarChart hourly={hourly} max={max} currentHour={currentHour} />
    </div>
  );
}

function BarChart({ hourly, max, currentHour }: { hourly: number[]; max: number; currentHour: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const height = 140;
  return (
    <div style={{ position: "relative", height: height + 24 }}>
      {/* grid lines */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[0.25, 0.5, 0.75].map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: height * p,
              borderTop: `1px dashed ${C.borderLight}`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${hourly.length}, 1fr)`,
          gap: 2,
          height,
          alignItems: "end",
          position: "relative",
        }}
      >
        {hourly.map((v, i) => {
          const isCurrent = i === currentHour;
          const isPast = i < currentHour;
          const opacity = isCurrent ? 1 : isPast ? 0.6 : 0.2;
          const h = (v / max) * height;
          return (
            <div
              key={i}
              style={{ height: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div
                style={{
                  width: "100%",
                  height: h,
                  background: `linear-gradient(180deg, ${C.accent} 0%, ${C.accent}26 100%)`,
                  opacity,
                  borderRadius: "2px 2px 0 0",
                  transition: "opacity 0.15s",
                }}
              />
              {hover === i && (
                <div
                  style={{
                    position: "absolute",
                    bottom: h + 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: C.text,
                    color: "#FFFFFF",
                    padding: "4px 8px",
                    fontSize: 10.5,
                    fontFamily: mono,
                    whiteSpace: "nowrap",
                    zIndex: 5,
                  }}
                >
                  {String(i).padStart(2, "0")}:00 — {v}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${hourly.length}, 1fr)`,
          marginTop: 6,
          fontFamily: mono,
          fontSize: 9.5,
          color: C.textTer,
        }}
      >
        {hourly.map((_, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            {i % 4 === 0 ? `${String(i).padStart(2, "0")}` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowsPanel() {
  return (
    <div style={{ padding: "18px 22px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: display,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          Workflows
        </h3>
        <Link
          href="/workflows"
          style={{
            fontSize: 11,
            color: C.accent,
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          Manage
          <IconChevronRight size={10} color={C.accent} />
        </Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {workflowSummary.map((w) => {
          const total = w.runs || 1;
          const resolvedPct = (w.resolved / total) * 100;
          const activePct = (w.active / total) * 100;
          const escalatedPct = (w.escalated / total) * 100;
          return (
            <div key={w.id} style={{ fontSize: 12, fontFamily: font }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <IconBranch size={13} color={C.textSec} />
                  <span style={{ fontWeight: 500, color: C.text }}>{w.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer }}>{w.runs} runs</span>
                  <StatusPillStatic label={w.status === "live" ? "Live" : "Draft"} kind={w.status} />
                </div>
              </div>
              <div
                title={`Resolved: ${w.resolved} · In progress: ${w.active} · Escalated: ${w.escalated}`}
                style={{
                  display: "flex",
                  height: 7,
                  background: C.surfaceAlt,
                  overflow: "hidden",
                  gap: 1,
                }}
              >
                <div style={{ width: `${resolvedPct}%`, background: C.green }} />
                <div style={{ width: `${activePct}%`, background: C.blue }} />
                <div style={{ width: `${escalatedPct}%`, background: C.red }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusPillStatic({ label, kind }: { label: string; kind: "live" | "draft" }) {
  const isLive = kind === "live";
  return (
    <span
      style={{
        padding: "2px 8px",
        background: isLive ? C.greenSoft : C.surfaceAlt,
        border: `1px solid ${isLive ? C.greenBorder : C.border}`,
        color: isLive ? C.green : C.textSec,
        fontFamily: mono,
        fontSize: 9.5,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}
