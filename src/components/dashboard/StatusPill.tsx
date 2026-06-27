import { C, mono } from "@/lib/tokens";
import type { ConvStatus } from "@/lib/types";

const cfg: Record<ConvStatus, { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: C.blue, bg: C.blueSoft, border: C.blueBorder },
  resolved: { label: "Resolved", color: C.green, bg: C.greenSoft, border: C.greenBorder },
  escalated: { label: "Escalated", color: C.red, bg: C.redSoft, border: C.redBorder },
  waiting: { label: "Waiting", color: C.yellow, bg: C.yellowSoft, border: C.yellowBorder },
};

export default function StatusPill({ status }: { status: ConvStatus }) {
  const s = cfg[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        borderRadius: 20,
        fontFamily: mono,
        fontSize: 10.5,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.color,
          animation: status === "active" ? "activePulse 1.6s ease-in-out infinite" : undefined,
        }}
      />
      {s.label}
    </span>
  );
}
