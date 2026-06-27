"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { C, display, font, mono } from "@/lib/tokens";
import {
  IconHouse,
  IconChat,
  IconLightbulb,
  IconBook,
  IconBranch,
  IconClipboard,
  IconSettings,
  IconPlug,
} from "./Icons";
import { conversations } from "@/data/seed";

const navItems = [
  { href: "/overview", label: "Overview", Icon: IconHouse },
  { href: "/conversations", label: "Conversations", Icon: IconChat, badge: true },
  { href: "/insights", label: "Insights", Icon: IconLightbulb },
  { href: "/knowledge", label: "Knowledge Base", Icon: IconBook },
  { href: "/workflows", label: "Workflows", Icon: IconBranch },
  { href: "/audit", label: "Audit Log", Icon: IconClipboard },
  { href: "/config", label: "Agent Config", Icon: IconSettings },
  { href: "/integrations", label: "Integrations", Icon: IconPlug },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const activeCount = conversations.filter((c) => c.status === "active").length;

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 220,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <div style={{ padding: "20px 18px 14px 18px", borderBottom: `1px solid ${C.borderLight}` }}>
        <div
          style={{
            fontFamily: display,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: C.text,
          }}
        >
          Agent Cargo
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: C.textTer,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginTop: 2,
          }}
        >
          ops dashboard
        </div>
      </div>

      <nav style={{ flex: 1, padding: "10px 0", overflow: "auto" }}>
        {navItems.map(({ href, label, Icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 18px",
                borderLeft: `3px solid ${isActive ? C.accent : "transparent"}`,
                background: isActive ? C.accentSoft : "transparent",
                color: isActive ? C.accent : C.textSec,
                fontFamily: font,
                fontSize: 12.5,
                fontWeight: isActive ? 600 : 500,
                transition: "background 0.15s, color 0.15s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = C.surfaceAlt;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={16} color={isActive ? C.accent : C.textSec} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && activeCount > 0 && (
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "1px 6px",
                    background: isActive ? C.accent : C.surfaceAlt,
                    color: isActive ? "#FFFFFF" : C.textSec,
                    borderRadius: 10,
                  }}
                >
                  {activeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "12px 18px",
          borderTop: `1px solid ${C.borderLight}`,
          fontSize: 10,
          color: C.textTer,
          fontFamily: mono,
        }}
      >
        Agent Cargo · v1.0
      </div>
    </aside>
  );
}
