import { C, font, mono } from "@/lib/tokens";
import type { StepType } from "@/lib/types";

const cfg: Record<
  StepType,
  { label: string; color: string; bg: string; border: string; dashed?: boolean; diamond?: boolean }
> = {
  trigger: { label: "Trigger", color: C.accent, bg: C.surface, border: C.accent },
  collect: { label: "Collect", color: C.blue, bg: C.blueSoft, border: C.blueBorder },
  lookup: { label: "Lookup", color: C.yellow, bg: C.yellowSoft, border: C.yellowBorder },
  send: { label: "Send", color: C.green, bg: C.greenSoft, border: C.greenBorder },
  action: { label: "Action", color: C.accent, bg: C.accentSoft, border: C.accentBorder },
  condition: { label: "Condition", color: C.yellow, bg: C.yellowSoft, border: C.yellowBorder, diamond: true },
  escalate: { label: "Escalate", color: C.red, bg: C.redSoft, border: C.redBorder },
  end: { label: "End", color: C.green, bg: C.surface, border: C.green, dashed: true },
};

export default function WorkflowNode({
  type,
  label,
  detail,
  compact = false,
}: {
  type: StepType;
  label: string;
  detail?: string;
  compact?: boolean;
}) {
  const c = cfg[type];
  return (
    <div
      style={{
        background: c.bg,
        border: c.dashed ? `1px dashed ${c.border}` : `1px solid ${c.border}`,
        padding: compact ? "6px 10px" : "10px 14px",
        minWidth: compact ? 80 : 140,
        maxWidth: 220,
        fontFamily: font,
        transform: c.diamond ? "rotate(0deg)" : undefined,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 9,
          fontWeight: 700,
          color: c.color,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {c.label}
      </div>
      <div style={{ fontSize: compact ? 11 : 12, color: C.text, fontWeight: 500, marginTop: 2 }}>
        {label}
      </div>
      {detail && !compact && (
        <div style={{ marginTop: 4, fontSize: 10.5, color: C.textSec, fontFamily: mono }}>
          {detail}
        </div>
      )}
    </div>
  );
}
