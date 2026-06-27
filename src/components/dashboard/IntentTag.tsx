import { C, mono } from "@/lib/tokens";
import type { Intent } from "@/lib/types";

export default function IntentTag({ intent }: { intent: Intent }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: C.surfaceAlt,
        border: `1px solid ${C.border}`,
        color: C.textSec,
        fontFamily: mono,
        fontSize: 10.5,
        fontWeight: 500,
        letterSpacing: "0.02em",
      }}
    >
      {intent}
    </span>
  );
}
