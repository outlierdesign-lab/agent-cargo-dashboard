"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  IconUser,
  IconChevronDown,
} from "./Icons";
import { conversations } from "@/data/seed";
import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";

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

const USER = {
  name: "Adam Wills",
  email: "adam@gire.no",
  initials: "AW",
  company: "Gire Mobility",
};

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

      <ProfileFooter />
    </aside>
  );
}

function ProfileFooter() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", borderTop: `1px solid ${C.borderLight}` }}>
      {open && (
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            bottom: "calc(100% + 6px)",
            background: C.surface,
            border: `1px solid ${C.border}`,
            boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
            zIndex: 20,
            padding: "4px 0",
          }}
        >
          <MenuItem
            label="Profile"
            Icon={IconUser}
            onClick={() => {
              setOpen(false);
              toast.show("Profile view coming soon", "info");
            }}
          />
          <MenuItem
            label="Settings"
            Icon={IconSettings}
            href="/config"
            onClick={() => setOpen(false)}
          />
          <div style={{ borderTop: `1px solid ${C.borderLight}`, margin: "4px 0" }} />
          <MenuItem
            label="Log out"
            Icon={IconLogout}
            danger
            onClick={() => {
              setOpen(false);
              toast.show("Signed out — see you soon", "info");
              router.push("/login");
            }}
          />
          <div
            style={{
              padding: "6px 14px 4px",
              fontFamily: mono,
              fontSize: 9.5,
              color: C.textTer,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderTop: `1px solid ${C.borderLight}`,
            }}
          >
            Agent Cargo · v1.0
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "12px 14px",
          background: open ? C.surfaceAlt : "transparent",
          textAlign: "left",
          transition: "background 0.15s",
          fontFamily: font,
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.background = C.surfaceAlt;
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = "transparent";
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: C.accentSoft,
            color: C.accent,
            border: `1px solid ${C.accentBorder}`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: mono,
            fontSize: 10.5,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {USER.initials}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: C.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {USER.name}
          </span>
          <span
            style={{
              display: "block",
              fontFamily: mono,
              fontSize: 9.5,
              color: C.textTer,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: 1,
            }}
          >
            {USER.email}
          </span>
        </span>
        <IconChevronDown
          size={11}
          color={open ? C.accent : C.textTer}
        />
      </button>
    </div>
  );
}

function MenuItem({
  label,
  Icon,
  onClick,
  href,
  danger,
}: {
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.ReactElement;
  onClick: () => void;
  href?: string;
  danger?: boolean;
}) {
  const inner = (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 14px",
        fontSize: 12.5,
        color: danger ? C.red : C.text,
        cursor: "pointer",
        transition: "background 0.1s",
        fontFamily: font,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceAlt)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon size={13} color={danger ? C.red : C.textSec} />
      {label}
    </span>
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick} style={{ display: "block" }}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} style={{ display: "block", width: "100%", textAlign: "left" }}>
      {inner}
    </button>
  );
}

function IconLogout({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
