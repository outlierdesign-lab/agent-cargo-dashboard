import { C, display } from "@/lib/tokens";
import Dot, { type DotTip } from "./Dot";

export default function PageHeader({
  title,
  subtitle,
  tips,
  right,
}: {
  title: string;
  subtitle?: string;
  tips?: DotTip[];
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 22,
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontFamily: display,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <div style={{ marginTop: 4, fontSize: 12.5, color: C.textSec }}>{subtitle}</div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {right}
        {tips && <Dot tips={tips} />}
      </div>
    </div>
  );
}
