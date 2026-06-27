"use client";

import { C, display, font, mono, accentTopEdge } from "@/lib/tokens";
import { workflows } from "@/data/seed";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/dashboard/Toast";
import Btn from "@/components/dashboard/Btn";
import Dot from "@/components/dashboard/Dot";
import WorkflowNode from "@/components/dashboard/WorkflowNode";
import { IconChevronRight, IconEdit } from "@/components/dashboard/Icons";
import { useMemo, useState } from "react";
import Link from "next/link";

const tips = [
  { title: "Each node is a step", body: "Different colors mean different step types — Send is green, Lookup is yellow, Escalate is red." },
  { title: "Conditions branch the flow", body: "Yellow diamond nodes route conversations down different paths based on data or driver responses." },
  { title: "Activate when you're ready", body: "Drafts don't handle real conversations. Click Activate when you've reviewed and want the AI to use this workflow." },
];

export default function WorkflowDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const wf = useMemo(() => workflows.find((w) => w.id === id), [id]);
  const [active, setActive] = useState(wf?.status === "live");

  if (!wf) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: font }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Workflow not found</div>
        <Link href="/workflows" style={{ color: C.accent, fontSize: 12 }}>
          Back to workflows
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/workflows"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: C.textSec,
          fontSize: 11.5,
          marginBottom: 14,
          fontFamily: font,
        }}
      >
        <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
          <IconChevronRight size={11} color={C.textSec} />
        </span>
        Workflows
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 18,
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: display,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: C.text,
              }}
            >
              {wf.name}
            </h1>
            <span
              style={{
                padding: "2px 8px",
                background: active ? C.greenSoft : C.surfaceAlt,
                border: `1px solid ${active ? C.greenBorder : C.border}`,
                color: active ? C.green : C.textSec,
                fontFamily: mono,
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {active ? "Live" : "Draft"}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: C.textSec, maxWidth: 600 }}>{wf.description}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="default" size="sm" onClick={() => router.push(`/workflows/${wf.id}/edit`)}>
            <IconEdit size={12} color={C.textSec} />
            Edit
          </Btn>
          <Btn
            variant={active ? "default" : "primary"}
            size="sm"
            onClick={() => {
              setActive(!active);
              toast.show(
                active ? `"${wf.name}" deactivated` : `"${wf.name}" is now live — handling new conversations`,
                active ? "info" : "success"
              );
            }}
          >
            {active ? "Deactivate" : "Activate"}
          </Btn>
          <Dot tips={tips} />
        </div>
      </div>

      {/* Metrics */}
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
            { label: "Times used", value: String(wf.runs) },
            { label: "Success rate", value: `${wf.successRate}%` },
            { label: "Trigger intent", value: wf.intent },
            { label: "Last edited", value: wf.lastEdited },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                padding: "14px 18px",
                borderRight: i < 3 ? `1px solid ${C.borderLight}` : "none",
                fontFamily: font,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: C.textTer,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {m.label}
              </div>
              <div style={{ fontFamily: display, fontSize: 22, fontWeight: 600, color: C.text, letterSpacing: "-0.02em" }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flow visualization */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          padding: "26px 22px",
          fontFamily: font,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: C.textTer,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 14,
          }}
        >
          Trigger
        </div>
        <div
          style={{
            padding: "10px 14px",
            border: `1px solid ${C.accentBorder}`,
            background: C.accentSoft,
            color: C.text,
            fontSize: 12,
            display: "inline-block",
            marginBottom: 20,
            fontFamily: mono,
          }}
        >
          {wf.trigger}
        </div>

        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: C.textTer,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 14,
          }}
        >
          Flow
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {wf.steps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <WorkflowNode type={s.type} label={s.label} detail={s.detail} />
              {i < wf.steps.length - 1 && (
                <div
                  style={{
                    height: 18,
                    width: 1,
                    background: C.border,
                    marginLeft: 70,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
