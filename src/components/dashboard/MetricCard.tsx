import { C, display, font, mono } from "@/lib/tokens";
import Sparkline from "./Sparkline";
import { IconArrowUp, IconArrowDown } from "./Icons";

export default function MetricCard({
  label,
  value,
  trend,
  subtitle,
  sparkData,
  sparkColor,
  valueColor,
  valueSize = 30,
}: {
  label: string;
  value: string;
  trend?: number;
  subtitle?: string;
  sparkData?: number[];
  sparkColor?: string;
  valueColor?: string;
  valueSize?: number;
}) {
  const trendPositive = (trend || 0) >= 0;
  const trendColor = trendPositive ? C.green : C.red;

  return (
    <div style={{ padding: "16px 18px", fontFamily: font }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 10,
          fontWeight: 500,
          color: C.textTer,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: display,
            fontSize: valueSize,
            fontWeight: 600,
            color: valueColor || C.text,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        {sparkData && <Sparkline data={sparkData} color={sparkColor || C.accent} />}
      </div>
      {(subtitle || trend != null) && (
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: C.textSec,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {trend != null && (
            <span style={{ color: trendColor, display: "inline-flex", alignItems: "center", gap: 2, fontWeight: 600 }}>
              {trendPositive ? <IconArrowUp size={11} /> : <IconArrowDown size={11} />}
              {Math.abs(trend)}%
            </span>
          )}
          {subtitle && <span style={{ color: C.textTer }}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
