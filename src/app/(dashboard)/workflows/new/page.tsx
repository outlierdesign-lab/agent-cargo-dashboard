"use client";

import { C, display, font, mono } from "@/lib/tokens";
import Btn from "@/components/dashboard/Btn";
import WorkflowNode from "@/components/dashboard/WorkflowNode";
import { IconChevronRight, IconPlus, IconTrash } from "@/components/dashboard/Icons";
import { useToast } from "@/components/dashboard/Toast";
import { useState } from "react";
import type { Step, StepType } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const stepTypes: { key: StepType; label: string }[] = [
  { key: "collect", label: "Collect info" },
  { key: "lookup", label: "Lookup data" },
  { key: "send", label: "Send message" },
  { key: "action", label: "Take action" },
  { key: "condition", label: "Condition (if/else)" },
  { key: "escalate", label: "Escalate to human" },
];

export default function NewWorkflow() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);

  const addStep = (type: StepType) => {
    setSteps([
      ...steps,
      {
        id: `s${Date.now()}`,
        type,
        label: stepTypes.find((t) => t.key === type)?.label || type,
        detail: "",
      },
    ]);
  };

  const updateStep = (i: number, patch: Partial<Step>) => {
    setSteps(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));

  const save = () => {
    if (!name.trim()) {
      toast.show("Give your workflow a name", "error");
      return;
    }
    toast.show(`Workflow "${name}" saved as draft`, "success");
    router.push("/workflows");
  };

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

      <div style={{ display: "grid", gridTemplateColumns: "440px 1fr", gap: 14, fontFamily: font }}>
        {/* Editor */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "20px 22px", maxHeight: "calc(100vh - 130px)", overflow: "auto" }}>
          <h2 style={{ margin: 0, fontFamily: display, fontSize: 16, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.02em" }}>
            New workflow
          </h2>

          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late pickup"
              style={fieldStyle}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this workflow do?"
              rows={2}
              style={{ ...fieldStyle, fontFamily: font, resize: "vertical" }}
            />
          </Field>
          <Field label="Trigger">
            <input
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g. Intent: Keys OR keyword: 'lost'"
              style={fieldStyle}
            />
          </Field>

          <div
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: C.textTer,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
              marginTop: 8,
            }}
          >
            Steps
          </div>

          {steps.map((s, i) => (
            <div
              key={s.id}
              style={{
                marginBottom: 10,
                padding: "10px 12px",
                border: `1px solid ${C.borderLight}`,
                background: C.bg,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: C.textTer, fontWeight: 600 }}>
                  STEP {i + 1} · {s.type.toUpperCase()}
                </span>
                <button onClick={() => removeStep(i)} style={{ color: C.red, display: "flex" }}>
                  <IconTrash size={12} />
                </button>
              </div>
              <input
                value={s.label}
                onChange={(e) => updateStep(i, { label: e.target.value })}
                placeholder="Label"
                style={{ ...fieldStyle, marginBottom: 6 }}
              />
              <input
                value={s.detail || ""}
                onChange={(e) => updateStep(i, { detail: e.target.value })}
                placeholder="Detail (optional)"
                style={fieldStyle}
              />
            </div>
          ))}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {stepTypes.map((t) => (
              <Btn key={t.key} variant="default" size="sm" onClick={() => addStep(t.key)}>
                <IconPlus size={11} color={C.textSec} />
                {t.label}
              </Btn>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <Btn variant="primary" onClick={save}>
              Save as draft
            </Btn>
            <Btn variant="default" onClick={() => router.push("/workflows")}>
              Cancel
            </Btn>
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: C.textTer,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Live Preview
          </div>
          {trigger && (
            <div
              style={{
                padding: "10px 14px",
                border: `1px solid ${C.accentBorder}`,
                background: C.accentSoft,
                color: C.text,
                fontSize: 12,
                fontFamily: mono,
                marginBottom: 18,
                display: "inline-block",
              }}
            >
              {trigger}
            </div>
          )}
          {steps.length === 0 ? (
            <div style={{ color: C.textTer, fontSize: 12.5 }}>
              Add steps on the left to see the workflow visualization here.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {steps.map((s, i) => (
                <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <WorkflowNode type={s.type} label={s.label} detail={s.detail} />
                  {i < steps.length - 1 && (
                    <div style={{ height: 14, width: 1, background: C.border, marginLeft: 70 }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, color: C.textSec, marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  border: `1px solid ${C.border}`,
  fontSize: 12.5,
  outline: "none",
  background: C.surface,
  fontFamily: font,
};
