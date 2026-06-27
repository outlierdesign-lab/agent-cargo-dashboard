"use client";

import { C, display, font, mono, accentTopEdge } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import Btn from "@/components/dashboard/Btn";
import WorkflowNode from "@/components/dashboard/WorkflowNode";
import { useToast } from "@/components/dashboard/Toast";
import { IconPlus, IconBranch, IconMenuDots, IconChevronRight, IconEdit, IconCopy, IconTrash } from "@/components/dashboard/Icons";
import { workflows as seedWorkflows } from "@/data/seed";
import type { Workflow } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const tips = [
  { title: "Workflows = pre-defined logic", body: "When a driver matches a trigger, this is the flow the AI follows. Higher success rate = better automation." },
  { title: "Live vs Draft", body: "Live workflows handle real conversations. Drafts are safe to iterate on without affecting production." },
  { title: "Crash = always escalate", body: "Safety-critical intents skip AI resolution by design. Don't optimize for closing them — optimize for response time." },
];

export default function WorkflowsPage() {
  const router = useRouter();
  const toast = useToast();
  const [workflows, setWorkflows] = useState(seedWorkflows);

  const total = workflows.length;
  const active = workflows.filter((w) => w.status === "live").length;
  const draft = workflows.filter((w) => w.status === "draft").length;
  const avgSuccess = Math.round(
    workflows.filter((w) => w.runs > 0).reduce((a, w) => a + w.successRate, 0) / Math.max(1, workflows.filter((w) => w.runs > 0).length)
  );

  return (
    <div>
      <PageHeader
        title="Workflows"
        tips={tips}
        right={
          <Btn variant="primary" size="sm" onClick={() => router.push("/workflows/new")}>
            <IconPlus size={12} color="#FFFFFF" />
            Create workflow
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
            { label: "Total", value: String(total) },
            { label: "Live", value: String(active) },
            { label: "Draft", value: String(draft) },
            { label: "Avg success rate", value: `${avgSuccess}%` },
          ].map((m, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
              <MetricCard label={m.label} value={m.value} valueSize={24} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {workflows.map((w) => (
          <WorkflowCard
            key={w.id}
            wf={w}
            onDuplicate={() => {
              setWorkflows([...workflows, { ...w, id: `${w.id}-copy-${Date.now()}`, name: `${w.name} (copy)`, status: "draft" }]);
              toast.show(`Duplicated "${w.name}"`, "success");
            }}
            onDelete={() => {
              setWorkflows(workflows.filter((x) => x.id !== w.id));
              toast.show(`Deleted "${w.name}"`, "info");
            }}
          />
        ))}
      </div>
    </div>
  );
}

function WorkflowCard({
  wf,
  onDuplicate,
  onDelete,
}: {
  wf: Workflow;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [menu, setMenu] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => router.push(`/workflows/${wf.id}`)}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${hover ? C.accent : C.border}`,
        padding: "18px 22px",
        cursor: "pointer",
        transition: "all 0.15s",
        position: "relative",
        fontFamily: font,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: C.accentSoft,
              border: `1px solid ${C.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconBranch size={14} color={C.accent} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: display, fontSize: 14, fontWeight: 600, color: C.text, letterSpacing: "-0.01em" }}>
                {wf.name}
              </span>
              <StatusBadge status={wf.status} />
              <PlatformBadge platform={wf.platform} />
            </div>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 12 }}>{wf.description}</div>
            {/* Mini flow preview */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {wf.steps.slice(0, 6).map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <WorkflowNode type={s.type} label={s.label} compact />
                  {i < Math.min(5, wf.steps.length - 1) && (
                    <IconChevronRight size={12} color={C.textTer} />
                  )}
                </div>
              ))}
              {wf.steps.length > 6 && (
                <span style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer }}>
                  +{wf.steps.length - 6} more
                </span>
              )}
            </div>
            {/* Stats */}
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 24,
                fontFamily: mono,
                fontSize: 11,
                color: C.textSec,
              }}
            >
              <span>
                <span style={{ color: C.textTer }}>Steps:</span> <span style={{ color: C.text, fontWeight: 600 }}>{wf.steps.length}</span>
              </span>
              <span>
                <span style={{ color: C.textTer }}>Runs:</span> <span style={{ color: C.text, fontWeight: 600 }}>{wf.runs}</span>
              </span>
              <span>
                <span style={{ color: C.textTer }}>Success:</span>{" "}
                <span style={{ color: wf.successRate >= 80 ? C.green : wf.successRate >= 50 ? C.text : C.red, fontWeight: 600 }}>
                  {wf.successRate}%
                </span>
              </span>
              <span>
                <span style={{ color: C.textTer }}>Last edited:</span> <span style={{ color: C.text }}>{wf.lastEdited}</span>
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenu(!menu);
          }}
          style={{ padding: 6, color: C.textSec, display: "flex" }}
        >
          <IconMenuDots size={14} />
        </button>
        {menu && (
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setMenu(false)}
            style={{
              position: "absolute",
              right: 22,
              top: 50,
              background: C.surface,
              border: `1px solid ${C.border}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              minWidth: 160,
              zIndex: 5,
            }}
          >
            {[
              { label: "Edit", Icon: IconEdit, action: () => router.push(`/workflows/${wf.id}/edit`) },
              { label: "Duplicate", Icon: IconCopy, action: onDuplicate },
              { label: "Delete", Icon: IconTrash, action: onDelete, danger: true },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  setMenu(false);
                  opt.action();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 12,
                  color: opt.danger ? C.red : C.text,
                  background: "transparent",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceAlt)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <opt.Icon size={12} color={opt.danger ? C.red : C.textSec} />
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "live" | "draft" }) {
  const isLive = status === "live";
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
      {isLive ? "Live" : "Draft"}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: "intercom" | "vapi" | "web" }) {
  return (
    <span
      style={{
        padding: "2px 8px",
        background: C.purpleSoft,
        border: `1px solid ${C.purpleBorder}`,
        color: C.purple,
        fontFamily: mono,
        fontSize: 9.5,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {platform}
    </span>
  );
}
