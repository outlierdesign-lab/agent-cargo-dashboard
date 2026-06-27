"use client";

import { C, display, font, mono, accentTopEdge } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import LangBadge from "@/components/dashboard/LangBadge";
import { IconArrowUp, IconArrowDown, IconInfo } from "@/components/dashboard/Icons";
import {
  topIssues,
  knowledgeGaps,
  costIntelligence,
  costBreakdown,
  escalationPatterns,
  escalationStats,
  langPerformance,
  peakHoursHeatmap,
  peakStats,
} from "@/data/insights-seed-data";
import { useState } from "react";
import Link from "next/link";

const tips = [
  { title: "Top issues drive your roadmap", body: "Rank shows what drivers contact you about most. Watch the trend column — that's where to look for emerging problems." },
  { title: "Knowledge gaps are your highest ROI", body: "Each unanswered topic represents conversations you could automate. Creating SOPs for top gaps is the fastest path to AI lift." },
  { title: "Insight callouts are recommendations", body: "Look for the accent-bordered callouts under each section. They translate the data into action." },
];

const RANGES = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
];

export default function InsightsPage() {
  const [range, setRange] = useState("30d");

  return (
    <div>
      <PageHeader
        title="Insights"
        subtitle="Patterns and opportunities across your support operations"
        tips={tips}
        right={
          <div style={{ display: "flex", gap: 0, border: `1px solid ${C.border}` }}>
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                style={{
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: range === r.key ? 600 : 500,
                  color: range === r.key ? C.text : C.textTer,
                  background: range === r.key ? C.surfaceAlt : "transparent",
                  fontFamily: font,
                  borderLeft: r.key !== RANGES[0].key ? `1px solid ${C.border}` : "none",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <TopIssues />
      <KnowledgeGaps />
      <CostIntelligence />
      <EscalationPatterns />
      <LangPerformance />
      <PeakHours />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        background: C.surface,
        border: `1px solid ${C.border}`,
        marginBottom: 14,
      }}
    >
      <div style={accentTopEdge} />
      <div
        style={{
          padding: "16px 22px",
          borderBottom: `1px solid ${C.borderLight}`,
          fontFamily: display,
          fontSize: 13,
          fontWeight: 600,
          color: C.text,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Callout({ text }: { text: string }) {
  return (
    <div
      style={{
        margin: "0 22px 18px 22px",
        padding: "11px 14px",
        background: C.surface,
        border: `1px solid ${C.borderLight}`,
        borderLeft: `3px solid ${C.accent}`,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        fontFamily: font,
        fontSize: 12,
        color: C.textSec,
        lineHeight: 1.55,
      }}
    >
      <IconInfo size={14} color={C.accent} />
      <span>{text}</span>
    </div>
  );
}

function TopIssues() {
  return (
    <Section title="Top Issues This Period">
      <div>
        {topIssues.map((iss, i) => {
          const isTop = i === 0;
          const total = iss.resolution.ai + iss.resolution.human + iss.resolution.escalated || 1;
          return (
            <div
              key={iss.rank}
              style={{
                display: "grid",
                gridTemplateColumns: "30px 1fr auto 90px auto 70px",
                gap: 16,
                alignItems: "center",
                padding: "12px 22px",
                borderBottom: `1px solid ${C.borderLight}`,
                borderLeft: isTop ? `3px solid ${C.accent}` : "3px solid transparent",
                fontFamily: font,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  color: C.textTer,
                  fontWeight: 600,
                }}
              >
                #{iss.rank}
              </div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{iss.issue}</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.textSec }}>{iss.volume} convs</div>
              <Trend value={iss.trend} />
              <div
                style={{
                  display: "flex",
                  width: 80,
                  height: 6,
                  background: C.surfaceAlt,
                  gap: 1,
                }}
                title={`AI ${iss.resolution.ai} · Human ${iss.resolution.human} · Escalated ${iss.resolution.escalated}`}
              >
                <div style={{ flex: iss.resolution.ai / total, background: C.green }} />
                <div style={{ flex: iss.resolution.human / total, background: C.accent }} />
                <div style={{ flex: iss.resolution.escalated / total, background: C.red }} />
              </div>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.textTer, textAlign: "right" }}>
                {iss.avgTimeMin}m avg
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 18 }} />
      <Callout text="Keys-related issues increased 23% this period. 68% required a dealer call. Consider pre-positioning spare keys at high-volume locations to reduce call volume." />
    </Section>
  );
}

function Trend({ value }: { value: number }) {
  const positive = value >= 0;
  const color = positive ? C.red : C.green; // higher volume trend is bad
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontFamily: mono,
        fontSize: 11,
        fontWeight: 600,
        color,
      }}
    >
      {positive ? <IconArrowUp size={11} color={color} /> : <IconArrowDown size={11} color={color} />}
      {Math.abs(value)}%
    </span>
  );
}

function KnowledgeGaps() {
  return (
    <Section title="Knowledge Gaps">
      <div>
        {knowledgeGaps.map((g) => (
          <div
            key={g.topic}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              gap: 16,
              alignItems: "center",
              padding: "12px 22px",
              borderBottom: `1px solid ${C.borderLight}`,
              fontFamily: font,
            }}
          >
            <div style={{ fontSize: 12.5, color: C.text, fontWeight: 500 }}>{g.topic}</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.textSec }}>
              {g.frequency} unanswered queries
            </div>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 20,
                background: g.outcome === "Escalated" ? C.redSoft : C.yellowSoft,
                border: `1px solid ${g.outcome === "Escalated" ? C.redBorder : C.yellowBorder}`,
                color: g.outcome === "Escalated" ? C.red : C.yellow,
                fontFamily: mono,
                fontSize: 9.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {g.outcome}
            </span>
            <Link href="/knowledge" style={{ color: C.accent, fontSize: 11.5, fontWeight: 500 }}>
              Create SOP →
            </Link>
          </div>
        ))}
      </div>
      <div style={{ height: 18 }} />
      <Callout text="6 topics had no KB coverage this period. Creating SOPs for the top 3 could resolve an estimated 34 conversations without human intervention — saving ~8.5 hours of agent time." />
    </Section>
  );
}

function CostIntelligence() {
  const cards = [
    { label: "Cost per resolution", value: `€${costIntelligence.perResolution}`, trend: costIntelligence.perResolutionTrend, sub: "across all" },
    { label: "AI vs Human cost", value: `€${costIntelligence.aiCost}`, sub: `vs €${costIntelligence.humanCost} · ${costIntelligence.speedMultiplier}× cheaper`, accent: true },
    { label: "Dealer call costs", value: `€${costIntelligence.dealerCallTotal}`, sub: `${costIntelligence.dealerCalls} calls this period` },
    { label: "Savings this period", value: `€${costIntelligence.savings.toLocaleString("en-US")}`, sub: "vs fully human ops", valueColor: C.green },
  ];
  return (
    <Section title="Cost Intelligence">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {cards.map((c, i) => (
          <div
            key={c.label}
            style={{
              padding: "16px 20px",
              borderRight: i < 3 ? `1px solid ${C.borderLight}` : "none",
              fontFamily: font,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 9.5,
                color: C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontFamily: display,
                fontSize: 24,
                fontWeight: 600,
                color: c.valueColor || (c.accent ? C.accent : C.text),
                letterSpacing: "-0.03em",
              }}
            >
              {c.value}
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: C.textTer }}>
              {c.trend != null && (
                <span style={{ color: C.green, fontWeight: 600, marginRight: 6 }}>
                  ↓ {Math.abs(c.trend)}%
                </span>
              )}
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown table */}
      <div
        style={{
          margin: "0 22px 18px 22px",
          marginTop: 18,
          border: `1px solid ${C.borderLight}`,
          fontFamily: font,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 0.7fr 0.8fr 0.8fr 0.7fr 0.8fr",
            padding: "8px 14px",
            background: C.surfaceAlt,
            fontFamily: mono,
            fontSize: 10,
            color: C.textTer,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          <div>Category</div>
          <div>Volume</div>
          <div>AI %</div>
          <div>Human %</div>
          <div>Avg Cost</div>
          <div>Total</div>
        </div>
        {costBreakdown.map((row) => (
          <div
            key={row.category}
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 0.7fr 0.8fr 0.8fr 0.7fr 0.8fr",
              padding: "9px 14px",
              borderTop: `1px solid ${C.borderLight}`,
              fontSize: 12,
            }}
          >
            <div style={{ color: C.text, fontWeight: 500 }}>{row.category}</div>
            <div style={{ fontFamily: mono, color: C.textSec }}>{row.volume}</div>
            <div style={{ fontFamily: mono, color: row.aiPct >= 70 ? C.green : row.aiPct >= 40 ? C.text : C.red, fontWeight: 600 }}>{row.aiPct}%</div>
            <div style={{ fontFamily: mono, color: C.textSec }}>{row.humanPct}%</div>
            <div style={{ fontFamily: mono, color: C.text }}>€{row.avgCost}</div>
            <div style={{ fontFamily: mono, color: C.text, fontWeight: 600 }}>€{row.totalCost}</div>
          </div>
        ))}
      </div>

      <Callout text="Keys remain the most expensive category at €8.20/resolution — 74% still require human + dealer call." />
    </Section>
  );
}

function EscalationPatterns() {
  const max = Math.max(...escalationPatterns.map((p) => p.pct));
  return (
    <Section title="Escalation Patterns">
      <div style={{ padding: "16px 22px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }}>
        <div>
          {escalationPatterns.map((p) => (
            <div key={p.reason} style={{ marginBottom: 10, fontFamily: font }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: C.text }}>{p.reason}</span>
                <span style={{ fontFamily: mono, color: C.textSec, fontWeight: 600 }}>{p.pct}%</span>
              </div>
              <div style={{ height: 7, background: C.surfaceAlt }}>
                <div style={{ width: `${(p.pct / max) * 100}%`, height: "100%", background: C.accent }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: font, fontSize: 12, color: C.textSec, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.textTer, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
              Avg time to escalate
            </div>
            <div style={{ fontFamily: display, fontSize: 22, fontWeight: 600, color: C.text, letterSpacing: "-0.03em" }}>
              {escalationStats.avgTimeToEscalateMin} min
            </div>
            <div style={{ fontSize: 11, color: C.textTer, marginTop: 2 }}>
              Median {escalationStats.medianTimeToEscalateMin} min
            </div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.textTer, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
              Repeat escalation drivers
            </div>
            <div style={{ fontFamily: display, fontSize: 22, fontWeight: 600, color: C.text }}>
              {escalationStats.repeatEscalations}
            </div>
            <div style={{ fontSize: 11, color: C.textTer, marginTop: 2 }}>drivers escalated 2× or more</div>
          </div>
        </div>
      </div>
      <Callout text="34% of escalations are from low AI confidence — expanding KB coverage on the 6 gap topics could reduce escalations by ~20%." />
    </Section>
  );
}

function LangPerformance() {
  const worst = langPerformance.reduce((a, b) => (a.aiPct < b.aiPct ? a : b));
  return (
    <Section title="Language & Regional Performance">
      <div
        style={{
          margin: "0 22px 18px 22px",
          border: `1px solid ${C.borderLight}`,
          fontFamily: font,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.8fr 0.8fr 1fr 0.9fr 1.1fr 0.8fr",
            padding: "8px 14px",
            background: C.surfaceAlt,
            fontFamily: mono,
            fontSize: 10,
            color: C.textTer,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          <div>Market</div>
          <div>Volume</div>
          <div>AI Resolution</div>
          <div>Avg CSAT</div>
          <div>Avg Response</div>
          <div>Trend</div>
        </div>
        {langPerformance.map((p) => {
          const isWorst = p.market === worst.market;
          return (
            <div
              key={p.market}
              style={{
                display: "grid",
                gridTemplateColumns: "0.8fr 0.8fr 1fr 0.9fr 1.1fr 0.8fr",
                padding: "11px 14px",
                borderTop: `1px solid ${C.borderLight}`,
                fontSize: 12,
                background: isWorst ? C.redSoft : "transparent",
              }}
            >
              <div>
                <LangBadge lang={p.market} />
              </div>
              <div style={{ fontFamily: mono, color: C.textSec }}>{p.volume}</div>
              <div style={{ fontFamily: mono, color: p.aiPct >= 65 ? C.green : C.red, fontWeight: 600 }}>{p.aiPct}%</div>
              <div style={{ fontFamily: mono, color: p.csat >= 4.5 ? C.green : p.csat >= 4 ? C.text : C.red, fontWeight: 600 }}>
                {p.csat.toFixed(1)}
              </div>
              <div style={{ fontFamily: mono, color: C.textSec }}>{p.avgResponseS}s</div>
              <div>
                <Trend value={-p.trend} />
              </div>
            </div>
          );
        })}
      </div>
      <Callout text="Netherlands has the lowest AI resolution rate (58%) and declining CSAT. Review Dutch-language KB coverage." />
    </Section>
  );
}

function PeakHours() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const max = Math.max(...peakHoursHeatmap.flat());
  const [hover, setHover] = useState<{ d: number; h: number; v: number } | null>(null);
  return (
    <Section title="Peak Hours & Capacity">
      <div style={{ padding: "16px 22px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", fontFamily: font }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 18 }}>
            {days.map((d) => (
              <div
                key={d}
                style={{
                  height: 16,
                  width: 26,
                  fontFamily: mono,
                  fontSize: 10,
                  color: C.textTer,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {d}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(24, 1fr)",
                marginBottom: 4,
                fontFamily: mono,
                fontSize: 9,
                color: C.textTer,
              }}
            >
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} style={{ textAlign: "center" }}>
                  {h % 4 === 0 ? String(h).padStart(2, "0") : ""}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateRows: "repeat(7, 16px)", gap: 2 }}>
              {peakHoursHeatmap.map((row, d) => (
                <div key={d} style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 2 }}>
                  {row.map((v, h) => {
                    const intensity = v / max;
                    const bg =
                      v === 0
                        ? C.surfaceAlt
                        : `rgba(14, 154, 167, ${0.2 + intensity * 0.8})`;
                    return (
                      <div
                        key={h}
                        onMouseEnter={() => setHover({ d, h, v })}
                        onMouseLeave={() => setHover(null)}
                        style={{
                          height: 16,
                          background: bg,
                          cursor: "default",
                          transition: "transform 0.1s",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            {hover && (
              <div
                style={{
                  marginTop: 8,
                  fontFamily: mono,
                  fontSize: 11,
                  color: C.text,
                }}
              >
                {days[hover.d]} {String(hover.h).padStart(2, "0")}:00 — {hover.v} conversations
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 18, fontFamily: font }}>
          <Stat label="Peak day" value={peakStats.peakDay} />
          <Stat label="Peak hour" value={peakStats.peakHour} />
          <Stat label="Peak volume" value={`${peakStats.peakVolume}/hr`} />
          <Stat label="Off-hours coverage" value={peakStats.offHoursCoverage} color={C.green} />
        </div>
      </div>
      <Callout text="100% of off-hours volume is handled by the AI agent. Reduce night-shift staffing without coverage risk." />
    </Section>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 10,
          color: C.textTer,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: display, fontSize: 16, fontWeight: 600, color: color || C.text, letterSpacing: "-0.02em" }}>
        {value}
      </div>
    </div>
  );
}
