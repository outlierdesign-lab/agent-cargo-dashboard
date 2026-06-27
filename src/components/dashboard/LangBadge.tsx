import { C, mono } from "@/lib/tokens";
import type { Lang } from "@/lib/types";

export default function LangBadge({ lang }: { lang: Lang }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 38,
        textAlign: "center",
        padding: "2px 0",
        background: C.surface,
        border: `1px solid ${C.border}`,
        color: C.text,
        fontFamily: mono,
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.03em",
      }}
    >
      {lang}
    </span>
  );
}
