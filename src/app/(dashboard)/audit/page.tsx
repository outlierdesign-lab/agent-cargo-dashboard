"use client";

import { C, display, font, mono, accentTopEdge } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import StatusPill from "@/components/dashboard/StatusPill";
import IntentTag from "@/components/dashboard/IntentTag";
import LangBadge from "@/components/dashboard/LangBadge";
import Btn from "@/components/dashboard/Btn";
import { useToast } from "@/components/dashboard/Toast";
import { IconDownload, IconChevronDown, IconChevronRight } from "@/components/dashboard/Icons";
import { conversations, auditMetrics, escalationReasons, topKBSources } from "@/data/seed";
import { useMemo, useState } from "react";
import type { Lang, Intent, ConvStatus } from "@/lib/types";

const tips = [
  { title: "Every conversation is here", body: "Filter by language, intent, outcome, or date range. Click any row to expand for transcript preview and confidence detail." },
  { title: "Breakdown surfaces patterns", body: "The Breakdown tab gives you visual rollups — which reasons drive escalations, which KB docs the AI relies on most." },
  { title: "Export for compliance", body: "CSV export includes all key fields (ID, driver, language, confidence, resolved by). GDPR-friendly format." },
];

export default function AuditPage() {
  const [tab, setTab] = useState<"log" | "breakdown">("log");
  const toast = useToast();

  const exportCSV = () => {
    const headers = ["ID", "Driver", "Language", "Intent", "Status", "Confidence", "Resolved By", "Duration", "Summary"];
    const rows = conversations.map((c) =>
      [c.id, c.driver, c.lang, c.intent, c.status, c.confidence, c.resolvedBy, c.durationMin, `"${c.summary.replace(/"/g, '""')}"`].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show("Audit log exported", "success");
  };

  return (
    <div>
      <PageHeader
        title="Audit Log"
        tips={tips}
        right={
          <Btn variant="default" size="sm" onClick={exportCSV}>
            <IconDownload size={12} color={C.textSec} />
            Export CSV
          </Btn>
        }
      />

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
          {[
            { label: "Total conversations", value: String(auditMetrics.total) },
            { label: "Avg AI confidence", value: auditMetrics.avgConfidence.toFixed(2) },
            { label: "Escalated", value: String(auditMetrics.escalated), color: C.red },
            { label: "Driver satisfaction", value: `${auditMetrics.csat}/5`, color: C.green },
          ].map((m, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
              <MetricCard label={m.label} value={m.value} valueSize={24} valueColor={m.color} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 20px" }}>
          {[
            { key: "log", label: "Conversation Log" },
            { key: "breakdown", label: "Breakdown" },
          ].map((t) => {
            const isActive = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as "log" | "breakdown")}
                style={{
                  padding: "13px 16px",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
                  color: isActive ? C.text : C.textTer,
                  fontFamily: font,
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {tab === "log" ? <LogTab /> : <BreakdownTab />}
      </div>
    </div>
  );
}

function LogTab() {
  const [lang, setLang] = useState<Lang | "all">("all");
  const [intent, setIntent] = useState<Intent | "all">("all");
  const [outcome, setOutcome] = useState<ConvStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (lang !== "all" && c.lang !== lang) return false;
      if (intent !== "all" && c.intent !== intent) return false;
      if (outcome !== "all" && c.status !== outcome) return false;
      return true;
    });
  }, [lang, intent, outcome]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 20px",
          borderBottom: `1px solid ${C.borderLight}`,
          fontFamily: font,
        }}
      >
        <Select value={lang} onChange={(v) => setLang(v as Lang | "all")} options={["all", "NO", "SE", "DK", "NL", "EN"]} label="Language" />
        <Select value={intent} onChange={(v) => setIntent(v as Intent | "all")} options={["all", "Keys", "Crash", "SOP", "Data", "Other"]} label="Intent" />
        <Select value={outcome} onChange={(v) => setOutcome(v as ConvStatus | "all")} options={["all", "active", "resolved", "escalated", "waiting"]} label="Outcome" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 50px 60px 100px 70px 90px 70px",
          gap: 14,
          padding: "8px 20px",
          background: C.surfaceAlt,
          fontFamily: mono,
          fontSize: 9.5,
          color: C.textTer,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 600,
        }}
      >
        <div>Driver / Summary</div>
        <div>Lang</div>
        <div>Intent</div>
        <div>Status</div>
        <div>Conf.</div>
        <div>Resolved By</div>
        <div>Duration</div>
      </div>
      {filtered.map((c) => {
        const isOpen = expanded === c.id;
        return (
          <div key={c.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
            <div
              onClick={() => setExpanded(isOpen ? null : c.id)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 50px 60px 100px 70px 90px 70px",
                gap: 14,
                padding: "10px 20px",
                fontFamily: font,
                cursor: "pointer",
                alignItems: "center",
                background: isOpen ? C.surfaceAlt : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {isOpen ? <IconChevronDown size={11} color={C.textTer} /> : <IconChevronRight size={11} color={C.textTer} />}
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: C.text }}>{c.driver}</span>
                </div>
                <div style={{ fontSize: 11, color: C.textSec, marginTop: 2, marginLeft: 17 }}>{c.summary}</div>
              </div>
              <LangBadge lang={c.lang} />
              <IntentTag intent={c.intent} />
              <StatusPill status={c.status} />
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: c.confidence > 0.7 ? C.green : c.confidence > 0.45 ? C.yellow : C.red,
                  fontWeight: 600,
                }}
              >
                {c.confidence.toFixed(2)}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.textSec }}>
                {c.resolvedBy === "ai" ? "AI" : c.resolvedBy === "human" ? "Human" : "—"}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>{c.durationMin}m</span>
            </div>
            {isOpen && (
              <div
                style={{
                  padding: "14px 20px 18px 38px",
                  background: C.surfaceAlt,
                  fontFamily: font,
                }}
              >
                <div style={{ fontFamily: mono, fontSize: 10, color: C.textTer, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                  Transcript preview
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                  {c.messages.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      style={{
                        fontSize: 11.5,
                        color: m.from === "system" ? C.textTer : C.text,
                        fontStyle: m.from === "system" ? "italic" : undefined,
                      }}
                    >
                      <span style={{ color: C.textTer, fontFamily: mono, marginRight: 6 }}>{m.from.toUpperCase()}:</span>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 24, fontSize: 11.5 }}>
                  <div>
                    <span style={{ color: C.textTer }}>KB sources: </span>
                    <span style={{ color: C.text }}>{c.kbSources.join(", ") || "none"}</span>
                  </div>
                  {c.escalationReason && (
                    <div>
                      <span style={{ color: C.textTer }}>Escalation: </span>
                      <span style={{ color: C.red }}>{c.escalationReason}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T | "all";
  onChange: (v: T | "all") => void;
  options: string[];
  label: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 11, color: C.textTer, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "all")}
        style={{
          padding: "5px 8px",
          border: `1px solid ${C.border}`,
          background: C.surface,
          fontSize: 12,
          outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "all" ? "All" : o[0].toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function BreakdownTab() {
  const ai = conversations.filter((c) => c.resolvedBy === "ai").length;
  const human = conversations.filter((c) => c.resolvedBy === "human").length;
  const pending = conversations.filter((c) => c.resolvedBy === "pending").length;
  const total = ai + human + pending;

  return (
    <div style={{ padding: "22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, fontFamily: font }}>
      <div>
        <SectionHead title="Resolution breakdown" />
        <div style={{ display: "flex", height: 18, marginBottom: 10 }}>
          <div style={{ flex: ai, background: C.green }} title={`AI: ${ai}`} />
          <div style={{ flex: human, background: C.accent, marginLeft: 1 }} title={`Human: ${human}`} />
          <div style={{ flex: pending, background: C.yellow, marginLeft: 1 }} title={`Pending: ${pending}`} />
        </div>
        <div style={{ display: "flex", gap: 16, fontFamily: mono, fontSize: 11 }}>
          <LegendItem color={C.green} label={`AI · ${ai}`} pct={Math.round((ai / total) * 100)} />
          <LegendItem color={C.accent} label={`Human · ${human}`} pct={Math.round((human / total) * 100)} />
          <LegendItem color={C.yellow} label={`Pending · ${pending}`} pct={Math.round((pending / total) * 100)} />
        </div>

        <div style={{ marginTop: 28 }}>
          <SectionHead title="Top escalation reasons" />
          {escalationReasons.map((r) => (
            <div key={r.reason} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: C.text }}>{r.reason}</span>
                <span style={{ fontFamily: mono, color: C.textSec, fontWeight: 600 }}>{r.pct}%</span>
              </div>
              <div style={{ height: 6, background: C.surfaceAlt }}>
                <div style={{ width: `${r.pct}%`, height: "100%", background: C.red }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHead title="Top KB sources referenced" />
        {topKBSources.map((s) => (
          <div key={s.source} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: C.text }}>{s.source}</span>
              <span style={{ fontFamily: mono, color: C.textSec, fontWeight: 600 }}>{s.refs} refs</span>
            </div>
            <div style={{ height: 6, background: C.surfaceAlt }}>
              <div style={{ width: `${(s.refs / topKBSources[0].refs) * 100}%`, height: "100%", background: C.accent }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 10,
        color: C.textTer,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 600,
        marginBottom: 12,
      }}
    >
      {title}
    </div>
  );
}

function LegendItem({ color, label, pct }: { color: string; label: string; pct: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.textSec }}>
      <span style={{ width: 8, height: 8, background: color }} />
      {label} <span style={{ color: C.textTer }}>({pct}%)</span>
    </span>
  );
}
