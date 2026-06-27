"use client";

import { C, display, font, mono } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import Btn from "@/components/dashboard/Btn";
import Toggle from "@/components/dashboard/Toggle";
import Modal from "@/components/dashboard/Modal";
import LangBadge from "@/components/dashboard/LangBadge";
import { useToast } from "@/components/dashboard/Toast";
import { IconPlus, IconAlert, IconClock, IconChat, IconUser } from "@/components/dashboard/Icons";
import { escalationRules as seedRules } from "@/data/seed";
import { useState } from "react";
import type { EscalationRule, Lang } from "@/lib/types";

const tips = [
  { title: "Rules fire instantly", body: "Toggling a rule on/off updates the live agent immediately. No deploy required." },
  { title: "Crash rules are sacred", body: "Don't disable safety-critical keyword rules. They guarantee a human gets eyes on an incident within seconds." },
  { title: "Tone shapes everything", body: "Friendly vs Professional vs Concise changes word choice across every response. Pilot a new tone with a draft AI Instructions revision first." },
];

const TABS = [
  { key: "escalate", label: "When to Escalate" },
  { key: "workflows", label: "Escalation Workflows" },
  { key: "teams", label: "Teams & Channels" },
  { key: "behavior", label: "Behavior" },
  { key: "languages", label: "Languages" },
  { key: "instructions", label: "AI Instructions" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function ConfigPage() {
  const [tab, setTab] = useState<TabKey>("escalate");
  return (
    <div>
      <PageHeader title="Agent Config" tips={tips} />
      <div style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 12px", overflow: "auto" }}>
          {TABS.map((t) => {
            const isActive = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "13px 14px",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
                  color: isActive ? C.text : C.textTer,
                  fontFamily: font,
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding: 22 }}>
          {tab === "escalate" && <EscalateTab />}
          {tab === "workflows" && <WorkflowsTab />}
          {tab === "teams" && <TeamsTab />}
          {tab === "behavior" && <BehaviorTab />}
          {tab === "languages" && <LanguagesTab />}
          {tab === "instructions" && <InstructionsTab />}
        </div>
      </div>
    </div>
  );
}

function EscalateTab() {
  const toast = useToast();
  const [rules, setRules] = useState<EscalationRule[]>(seedRules);
  const [modal, setModal] = useState(false);

  return (
    <div style={{ fontFamily: font }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 12, color: C.textSec }}>
          When any of these conditions match, the AI hands off the conversation to a human agent.
        </p>
        <Btn variant="primary" size="sm" onClick={() => setModal(true)}>
          <IconPlus size={12} color="#FFFFFF" />
          Add rule
        </Btn>
      </div>

      <div style={{ border: `1px solid ${C.border}` }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 140px 110px 80px",
            padding: "8px 14px",
            background: C.surfaceAlt,
            fontFamily: mono,
            fontSize: 9.5,
            color: C.textTer,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          <div>Type</div>
          <div>Rule</div>
          <div>Queue</div>
          <div>Priority</div>
          <div>Active</div>
        </div>
        {rules.map((r) => (
          <div
            key={r.id}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 140px 110px 80px",
              gap: 12,
              padding: "11px 14px",
              borderTop: `1px solid ${C.borderLight}`,
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 10, color: C.textSec, textTransform: "uppercase", fontWeight: 600 }}>
              {r.type}
            </span>
            <span style={{ color: C.text, fontFamily: r.type === "keyword" ? mono : font, fontSize: 12 }}>{r.value}</span>
            <span style={{ color: C.textSec }}>{r.queue}</span>
            <PriorityPill priority={r.priority} />
            <Toggle
              on={r.active}
              onChange={(v) => {
                setRules(rules.map((x) => (x.id === r.id ? { ...x, active: v } : x)));
                toast.show(`Rule ${v ? "enabled" : "disabled"} — AI will ${v ? "start" : "stop"} using it immediately`, "info");
              }}
            />
          </div>
        ))}
      </div>

      <AddRuleModal open={modal} onClose={() => setModal(false)} onCreate={(r) => setRules([r, ...rules])} />
    </div>
  );
}

function PriorityPill({ priority }: { priority: "low" | "medium" | "high" | "critical" }) {
  const cfg = {
    low: { color: C.textSec, bg: C.surfaceAlt, border: C.border },
    medium: { color: C.blue, bg: C.blueSoft, border: C.blueBorder },
    high: { color: C.yellow, bg: C.yellowSoft, border: C.yellowBorder },
    critical: { color: C.red, bg: C.redSoft, border: C.redBorder },
  }[priority];
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 20,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontFamily: mono,
        fontSize: 9.5,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        display: "inline-block",
        width: "fit-content",
      }}
    >
      {priority}
    </span>
  );
}

function AddRuleModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (r: EscalationRule) => void;
}) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<EscalationRule["type"]>("keyword");
  const [value, setValue] = useState("");
  const [queue, setQueue] = useState("General Support");
  const [priority, setPriority] = useState<EscalationRule["priority"]>("medium");

  const reset = () => {
    setStep(0);
    setType("keyword");
    setValue("");
    setQueue("General Support");
    setPriority("medium");
  };

  const save = () => {
    const rule: EscalationRule = {
      id: `r-${Date.now()}`,
      type,
      value,
      queue,
      priority,
      active: true,
    };
    onCreate(rule);
    toast.show("New rule is now active — AI will start using it immediately", "success");
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add escalation rule" width={520}>
      <div style={{ fontFamily: font }}>
        {step === 0 && (
          <Step title="Rule type">
            {(["keyword", "confidence", "sentiment", "timeout"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setStep(1);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "11px 14px",
                  border: `1px solid ${type === t ? C.accent : C.border}`,
                  background: type === t ? C.accentSoft : C.surface,
                  fontSize: 12.5,
                  marginBottom: 8,
                  textAlign: "left",
                  fontFamily: font,
                  color: C.text,
                }}
              >
                <span style={{ fontWeight: 600 }}>{t[0].toUpperCase() + t.slice(1)}</span>
                <div style={{ color: C.textSec, fontSize: 11.5, marginTop: 2 }}>
                  {t === "keyword" && "Specific words or phrases in driver messages"}
                  {t === "confidence" && "AI confidence falls below a threshold"}
                  {t === "sentiment" && "Driver expressing negative emotion"}
                  {t === "timeout" && "No response from driver after a duration"}
                </div>
              </button>
            ))}
          </Step>
        )}
        {step === 1 && (
          <Step title="Trigger value">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                type === "keyword"
                  ? "comma-separated, e.g. crash, accident"
                  : type === "confidence"
                  ? "e.g. < 0.45"
                  : type === "sentiment"
                  ? "e.g. Strongly negative"
                  : "e.g. 5 min no response"
              }
              style={fieldStyle}
            />
            <NavButtons onBack={() => setStep(0)} onNext={() => setStep(2)} disabled={!value} />
          </Step>
        )}
        {step === 2 && (
          <Step title="Destination queue">
            <select value={queue} onChange={(e) => setQueue(e.target.value)} style={fieldStyle as React.CSSProperties}>
              {["General Support", "Safety", "Billing", "Customer Success", "Legal"].map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
            <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </Step>
        )}
        {step === 3 && (
          <Step title="Priority">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["low", "medium", "high", "critical"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  style={{
                    padding: "8px 14px",
                    border: `1px solid ${priority === p ? C.accent : C.border}`,
                    background: priority === p ? C.accentSoft : C.surface,
                    fontSize: 12,
                    fontFamily: font,
                    color: C.text,
                    textTransform: "capitalize",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <NavButtons onBack={() => setStep(2)} onNext={save} nextLabel="Create rule" />
          </Step>
        )}
      </div>
    </Modal>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 10,
          color: C.textTer,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function NavButtons({ onBack, onNext, disabled, nextLabel = "Next" }: { onBack: () => void; onNext: () => void; disabled?: boolean; nextLabel?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
      <Btn variant="default" size="sm" onClick={onBack}>
        Back
      </Btn>
      <Btn variant="primary" size="sm" onClick={onNext} disabled={disabled}>
        {nextLabel}
      </Btn>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: `1px solid ${C.border}`,
  fontSize: 12.5,
  outline: "none",
  fontFamily: font,
};

function WorkflowsTab() {
  const paths = [
    {
      name: "Safety incident path",
      description: "Crash, injury, or emergency keywords",
      slaMin: 2,
      preHandoff: ["Pause AI agent", "Snapshot context", "Tag conversation as safety"],
      routing: "Page on-call lead → fallback to Safety queue",
      notifications: ["Slack #safety-incidents", "SMS to on-call"],
      postHandoff: ["Require human resolution", "Mandatory incident report"],
    },
    {
      name: "Low confidence path",
      description: "AI confidence below threshold",
      slaMin: 10,
      preHandoff: ["Summarize conversation", "Include KB sources reviewed"],
      routing: "General Support queue",
      notifications: ["Slack #ops-handoffs"],
      postHandoff: ["Optional human resolution", "Flag for KB review"],
    },
    {
      name: "Frustration path",
      description: "Negative sentiment detected",
      slaMin: 5,
      preHandoff: ["Acknowledge frustration", "Pause AI agent"],
      routing: "Customer Success queue",
      notifications: ["Slack #customer-success"],
      postHandoff: ["Optional follow-up CSAT"],
    },
  ];
  const [expanded, setExpanded] = useState<string | null>(paths[0].name);
  return (
    <div style={{ fontFamily: font }}>
      <p style={{ margin: 0, marginBottom: 16, fontSize: 12, color: C.textSec }}>
        Each path defines the full lifecycle of an escalation — from trigger to handoff to follow-up.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {paths.map((p) => {
          const isOpen = expanded === p.name;
          return (
            <div key={p.name} style={{ border: `1px solid ${C.border}` }}>
              <div
                onClick={() => setExpanded(isOpen ? null : p.name)}
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  background: isOpen ? C.surfaceAlt : C.surface,
                  transition: "background 0.15s",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: C.textSec, marginTop: 2 }}>{p.description}</div>
                </div>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer }}>
                  SLA {p.slaMin}m
                </span>
              </div>
              {isOpen && (
                <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.borderLight}`, fontSize: 12, color: C.textSec, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Lifecycle title="Pre-handoff" items={p.preHandoff} />
                  <div>
                    <PhaseLabel label="Routing" />
                    {p.routing}
                  </div>
                  <Lifecycle title="Notifications" items={p.notifications} />
                  <Lifecycle title="Post-handoff" items={p.postHandoff} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16 }}>
        <Btn variant="default" size="sm">
          <IconPlus size={12} color={C.textSec} />
          Add escalation path
        </Btn>
      </div>
    </div>
  );
}

function PhaseLabel({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 9.5,
        color: C.textTer,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginRight: 8,
        fontWeight: 600,
      }}
    >
      {label}:
    </span>
  );
}

function Lifecycle({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <PhaseLabel label={title} />
      {items.join(" · ")}
    </div>
  );
}

function TeamsTab() {
  const queues = [
    { name: "Safety", icon: IconAlert, members: ["AB", "CD", "EF"], sla: "2 min", priority: "critical" },
    { name: "General Support", icon: IconChat, members: ["GH", "IJ", "KL", "MN"], sla: "10 min", priority: "medium" },
    { name: "Customer Success", icon: IconUser, members: ["OP", "QR"], sla: "5 min", priority: "high" },
    { name: "Billing", icon: IconClock, members: ["ST"], sla: "30 min", priority: "low" },
  ];
  const channels = [
    { name: "Slack", connected: true, kind: "Workspace: agent-cargo.slack.com" },
    { name: "Email", connected: true, kind: "ops-alerts@agentcargo.io" },
    { name: "SMS", connected: false, kind: "Not configured" },
  ];
  return (
    <div style={{ fontFamily: font, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div>
        <SectionTitle>Queues</SectionTitle>
        {queues.map((q) => (
          <div
            key={q.name}
            style={{
              border: `1px solid ${C.border}`,
              padding: "12px 14px",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <q.icon size={14} color={C.textSec} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{q.name}</span>
              <PriorityPill priority={q.priority as never} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: -4 }}>
                {q.members.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: C.accentSoft,
                      color: C.accent,
                      border: `2px solid ${C.surface}`,
                      marginLeft: i > 0 ? -8 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: mono,
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
              <span style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer }}>SLA {q.sla}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <SectionTitle>Notification channels</SectionTitle>
        {channels.map((c) => (
          <div
            key={c.name}
            style={{
              border: `1px solid ${C.border}`,
              padding: "12px 14px",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.name}</div>
              <div style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer, marginTop: 2 }}>{c.kind}</div>
            </div>
            <span
              style={{
                fontFamily: mono,
                fontSize: 9.5,
                fontWeight: 600,
                color: c.connected ? C.green : C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {c.connected ? "Connected" : "Not connected"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 10,
        color: C.textTer,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 10,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function BehaviorTab() {
  const [calling, setCalling] = useState({ autoCall: true, retryBusy: true, log: true, transcribe: true });
  const [response, setResponse] = useState({ clarify: true, confirm: false, citeKB: true, autoResolve: true, callback: false });
  const [tone, setTone] = useState<"Friendly" | "Professional" | "Concise">("Professional");
  const [name, setName] = useState("Dot");
  const [template, setTemplate] = useState("Hi {agent_name} here — I'm taking over to help you sort this out.");
  const toast = useToast();

  return (
    <div style={{ fontFamily: font, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
      <div>
        <SectionTitle>Calling behavior</SectionTitle>
        {Object.entries(calling).map(([k, v]) => (
          <ToggleRow
            key={k}
            label={
              k === "autoCall"
                ? "Auto-call dealers"
                : k === "retryBusy"
                ? "Retry on busy"
                : k === "log"
                ? "Log calls"
                : "Auto-transcribe"
            }
            on={v}
            onChange={(val) => {
              setCalling({ ...calling, [k]: val });
              toast.show(`Setting updated`, "info");
            }}
          />
        ))}
        <div style={{ marginTop: 22 }}>
          <SectionTitle>Tone</SectionTitle>
          <div style={{ display: "flex", gap: 8 }}>
            {(["Friendly", "Professional", "Concise"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTone(t);
                  toast.show(`Tone set to ${t}`, "info");
                }}
                style={{
                  padding: "8px 14px",
                  border: `1px solid ${tone === t ? C.accent : C.border}`,
                  background: tone === t ? C.accentSoft : C.surface,
                  color: C.text,
                  fontSize: 12,
                  fontFamily: font,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <SectionTitle>Response behavior</SectionTitle>
        {Object.entries(response).map(([k, v]) => (
          <ToggleRow
            key={k}
            label={
              k === "clarify"
                ? "Ask clarifying questions"
                : k === "confirm"
                ? "Confirm before taking actions"
                : k === "citeKB"
                ? "Cite KB sources in answers"
                : k === "autoResolve"
                ? "Auto-resolve simple queries"
                : "Offer callback when busy"
            }
            on={v}
            onChange={(val) => {
              setResponse({ ...response, [k]: val });
              toast.show(`Setting updated`, "info");
            }}
          />
        ))}
        <div style={{ marginTop: 22 }}>
          <SectionTitle>Agent display name</SectionTitle>
          <input value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} />
          <div style={{ marginTop: 16 }}>
            <SectionTitle>Handoff message template</SectionTitle>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={3}
              style={{ ...fieldStyle, fontFamily: font, resize: "vertical" }}
            />
            <div style={{ fontSize: 11, color: C.textTer, marginTop: 4 }}>
              Use <code style={{ fontFamily: mono }}>{"{agent_name}"}</code> for the human agent's name.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 0",
        borderBottom: `1px solid ${C.borderLight}`,
        fontSize: 12.5,
        color: C.text,
      }}
    >
      <span>{label}</span>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function LanguagesTab() {
  const [enabled, setEnabled] = useState<Record<Lang, boolean>>({ NO: true, SE: true, DK: true, NL: true, EN: true });
  const toast = useToast();
  const names: Record<Lang, string> = {
    NO: "Norwegian",
    SE: "Swedish",
    DK: "Danish",
    NL: "Dutch",
    EN: "English",
  };
  return (
    <div style={{ fontFamily: font }}>
      <p style={{ margin: 0, marginBottom: 16, fontSize: 12, color: C.textSec }}>
        Toggle which languages the AI agent responds in. Disabled languages route directly to a human agent.
      </p>
      <div style={{ border: `1px solid ${C.border}` }}>
        {(Object.keys(names) as Lang[]).map((l) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderTop: l !== "NO" ? `1px solid ${C.borderLight}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <LangBadge lang={l} />
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{names[l]}</span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: enabled[l] ? C.green : C.textTer,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {enabled[l] ? "Enabled" : "Disabled"}
              </span>
            </div>
            <Toggle
              on={enabled[l]}
              onChange={(v) => {
                setEnabled({ ...enabled, [l]: v });
                toast.show(`${names[l]} ${v ? "enabled" : "disabled"}`, "info");
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InstructionsTab() {
  const initial = `You are the Agent Cargo AI driver support agent. Your job is to help drivers with operational questions — keys, mileage, payments, end-of-shift procedures, and similar routine queries.

Always:
- Respond in the driver's language (detected automatically)
- Cite the KB document you used when answering operational questions
- Acknowledge the driver by name when you have it
- Keep responses concise — drivers are often on the road

Never:
- Share customer or vehicle data outside this driver
- Modify pricing or invoices
- Promise specific outcomes that depend on a dealer
- Make jokes about safety incidents

For crashes, injuries, or emergencies: respond with an immediate safety check and escalate to a human within seconds.`;
  const [val, setVal] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const toast = useToast();

  return (
    <div style={{ fontFamily: font }}>
      <p style={{ margin: 0, marginBottom: 12, fontSize: 12, color: C.textSec }}>
        This is what the AI reads before every conversation. Edits take effect on the next message.
      </p>
      <textarea
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          setDirty(e.target.value !== initial);
        }}
        rows={18}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: `1px solid ${C.border}`,
          background: C.surface,
          fontFamily: mono,
          fontSize: 12,
          lineHeight: 1.55,
          outline: "none",
          resize: "vertical",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <Btn
          variant={dirty ? "primary" : "default"}
          size="sm"
          onClick={() => {
            setDirty(false);
            toast.show("AI instructions saved — applies to next conversation", "success");
          }}
        >
          Save instructions
        </Btn>
      </div>
    </div>
  );
}
