"use client";

import { C, display, font, mono } from "@/lib/tokens";
import { conversations } from "@/data/seed";
import { useParams, useRouter } from "next/navigation";
import StatusPill from "@/components/dashboard/StatusPill";
import IntentTag from "@/components/dashboard/IntentTag";
import LangBadge from "@/components/dashboard/LangBadge";
import Btn from "@/components/dashboard/Btn";
import { useToast } from "@/components/dashboard/Toast";
import { IconAlert, IconChevronRight, IconStar, IconUser, IconClock, IconFile } from "@/components/dashboard/Icons";
import { useState, useMemo, useRef, useEffect } from "react";
import type { Msg } from "@/lib/types";
import Link from "next/link";

export default function ConvDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const initial = useMemo(() => conversations.find((c) => c.id === id), [id]);
  const [conv, setConv] = useState(initial);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conv?.messages.length]);

  if (!conv) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: font }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Conversation not found</div>
        <Link href="/conversations" style={{ color: C.accent, fontSize: 12 }}>
          Back to conversations
        </Link>
      </div>
    );
  }

  const addMsg = (m: Omit<Msg, "id" | "ts">) => {
    setConv((prev) =>
      prev
        ? {
            ...prev,
            messages: [
              ...prev.messages,
              {
                ...m,
                id: `m${prev.messages.length + 1}`,
                ts: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
              } as Msg,
            ],
          }
        : prev
    );
  };

  const takeOver = () => {
    setConv((prev) => prev && { ...prev, takenOver: true, humanAgent: "You" });
    addMsg({ from: "system", text: "Human takeover started — AI agent paused" });
    toast.show("You're in control now — the driver sees your name", "info");
  };

  const handBack = () => {
    setConv((prev) => prev && { ...prev, takenOver: false });
    addMsg({ from: "system", text: "AI agent resumed" });
    toast.show("AI agent resumed — you can jump back in anytime", "info");
  };

  const resolve = () => {
    setConv((prev) => prev && { ...prev, status: "resolved", resolvedBy: prev.takenOver ? "human" : "ai" });
    toast.show("Conversation resolved", "success");
  };

  const send = () => {
    if (!draft.trim()) return;
    addMsg({ from: "human", text: draft });
    setDraft("");
  };

  return (
    <div>
      <Link
        href="/conversations"
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
        Conversations
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 14,
          height: "calc(100vh - 130px)",
          minHeight: 500,
        }}
      >
        {/* Chat panel */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* Header bar */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontFamily: display,
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.text,
                  }}
                >
                  {conv.driver}
                </span>
                <LangBadge lang={conv.lang} />
                <IntentTag intent={conv.intent} />
                <StatusPill status={conv.status} />
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: C.textTer,
                  display: "flex",
                  gap: 12,
                }}
              >
                <span>{conv.vehicle}</span>
                <span>Started {new Date(conv.startedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                <span>{conv.durationMin}m duration</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {conv.status !== "resolved" && (
                <Btn variant="success" size="sm" onClick={resolve}>
                  ✓ Resolve
                </Btn>
              )}
              {conv.takenOver ? (
                <Btn variant="default" size="sm" onClick={handBack}>
                  Hand Back
                </Btn>
              ) : (
                <Btn variant="primary" size="sm" onClick={takeOver}>
                  Take Over
                </Btn>
              )}
            </div>
          </div>

          {/* Takeover banner */}
          {conv.takenOver && (
            <div
              style={{
                padding: "10px 20px",
                background: C.yellowSoft,
                borderLeft: `3px solid ${C.yellow}`,
                color: C.text,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <IconAlert size={13} color={C.yellow} />
              You are controlling this conversation. AI agent is paused.
            </div>
          )}

          {/* Transcript */}
          <div
            ref={scrollRef}
            style={{ flex: 1, overflow: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}
          >
            {conv.messages.map((m) => (
              <MsgBubble key={m.id} msg={m} />
            ))}
          </div>

          {/* Input */}
          {conv.takenOver && (
            <div
              style={{
                padding: "12px 16px",
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                gap: 8,
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your message…"
                style={{
                  flex: 1,
                  border: `1px solid ${C.border}`,
                  padding: "8px 12px",
                  fontSize: 12.5,
                  outline: "none",
                  fontFamily: font,
                }}
              />
              <Btn variant="primary" onClick={send} size="sm">
                Send
              </Btn>
            </div>
          )}
        </div>

        {/* Context sidebar */}
        <ContextSidebar conv={conv} />
      </div>
    </div>
  );
}

function MsgBubble({ msg }: { msg: Msg }) {
  if (msg.from === "system") {
    return (
      <div
        style={{
          textAlign: "center",
          color: C.textTer,
          fontSize: 11,
          fontStyle: "italic",
          padding: "4px 0",
          fontFamily: font,
        }}
      >
        {msg.text}
      </div>
    );
  }
  const isDriver = msg.from === "driver";
  const bg = isDriver ? C.surfaceAlt : msg.from === "ai" ? C.accentSoft : C.blueSoft;
  const border = isDriver ? C.border : msg.from === "ai" ? C.accentBorder : C.blueBorder;
  return (
    <div style={{ display: "flex", justifyContent: isDriver ? "flex-start" : "flex-end" }}>
      <div
        style={{
          maxWidth: "76%",
          background: bg,
          border: `1px solid ${border}`,
          padding: "8px 12px",
          fontSize: 12.5,
          color: C.text,
          fontFamily: font,
        }}
      >
        <div>{msg.text}</div>
        <div style={{ marginTop: 4, fontFamily: mono, fontSize: 9.5, color: C.textTer }}>{msg.ts}</div>
      </div>
    </div>
  );
}

function ContextSidebar({ conv }: { conv: NonNullable<ReturnType<typeof conversations.find>> }) {
  const confBarColor = conv.confidence > 0.7 ? C.green : conv.confidence > 0.45 ? C.yellow : C.red;
  const csatColor = (s: number) => (s >= 4 ? C.green : s === 3 ? C.yellow : C.red);

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        overflow: "auto",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily: font,
      }}
    >
      <Section title="AI Confidence">
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
          <span style={{ fontFamily: display, fontSize: 22, fontWeight: 600, color: C.text }}>
            {Math.round(conv.confidence * 100)}
          </span>
          <span style={{ color: C.textTer, fontSize: 12 }}>/100</span>
        </div>
        <div style={{ height: 4, background: C.surfaceAlt, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${conv.confidence * 100}%`,
              background: confBarColor,
            }}
          />
        </div>
      </Section>

      {conv.status === "resolved" && conv.csat != null && (
        <Section title="CSAT">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: mono,
              fontSize: 14,
              fontWeight: 600,
              color: csatColor(conv.csat),
            }}
          >
            <IconStar size={14} color={csatColor(conv.csat)} />
            {conv.csat}.0 / 5
          </div>
          {conv.csatFeedback && (
            <div
              style={{
                marginTop: 6,
                padding: "8px 10px",
                background: C.surfaceAlt,
                border: `1px solid ${C.borderLight}`,
                fontSize: 11.5,
                color: C.textSec,
                fontStyle: "italic",
              }}
            >
              "{conv.csatFeedback}"
            </div>
          )}
        </Section>
      )}

      <Section title="Knowledge Sources">
        {conv.kbSources.length === 0 ? (
          <div style={{ fontSize: 11.5, color: C.textTer }}>No KB sources referenced</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {conv.kbSources.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  background: C.surfaceAlt,
                  border: `1px solid ${C.borderLight}`,
                  fontSize: 11.5,
                  color: C.text,
                }}
              >
                <IconFile size={12} color={C.textSec} />
                {s}
              </div>
            ))}
          </div>
        )}
      </Section>

      {conv.escalationReason && (
        <Section title="Escalation Reason">
          <div
            style={{
              padding: "10px 12px",
              background: C.redSoft,
              borderLeft: `3px solid ${C.red}`,
              fontSize: 11.5,
              color: C.text,
            }}
          >
            {conv.escalationReason}
          </div>
        </Section>
      )}

      <Section title="Outcome">
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11.5, color: C.textSec }}>
          <div>
            <span style={{ color: C.textTer }}>Resolved by:</span>{" "}
            <span style={{ color: C.text, fontWeight: 500 }}>
              {conv.resolvedBy === "ai" ? "AI Agent" : conv.resolvedBy === "human" ? `Human (${conv.humanAgent || "agent"})` : "In progress"}
            </span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <IconClock size={11} color={C.textTer} />
            <span style={{ color: C.textTer }}>Duration:</span>{" "}
            <span style={{ color: C.text }}>{conv.durationMin} min</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <IconUser size={11} color={C.textTer} />
            <span style={{ color: C.textTer }}>Driver:</span>{" "}
            <span style={{ color: C.text }}>{conv.driver}</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 10,
          color: C.textTer,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
