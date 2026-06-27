import { C, accentTopEdge, borderBase } from "@/lib/tokens";

export default function Card({
  children,
  accent = false,
  style,
  className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: C.surface,
        border: borderBase,
        ...style,
      }}
    >
      {accent && <div style={accentTopEdge} />}
      {children}
    </div>
  );
}
