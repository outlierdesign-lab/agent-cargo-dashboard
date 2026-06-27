"use client";

import { C, display, font, mono } from "@/lib/tokens";
import { CSAT_LABELS, submitCSAT } from "@/lib/csat";
import { useState } from "react";
import Link from "next/link";

type ChatMsg = { id: string; from: "driver" | "ai"; text: string; ts: string };

const initial: ChatMsg[] = [
  { id: "m1", from: "ai", text: "Hi! I'm the Agent Cargo support agent. What can I help with?", ts: "10:24" },
];

export default function DriverChat() {
  const [msgs, setMsgs] = useState<ChatMsg[]>(initial);
  const [draft, setDraft] = useState("");
  const [resolved, setResolved] = useState(false);
  const [csat, setCsat] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMsgs((m) => [...m, { id: `m${m.length + 1}`, from: "driver", text: draft, ts: now }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: `m${m.length + 1}`,
          from: "ai",
          text:
            "Got it — checking the knowledge base now. Your end-of-shift checklist requires: full tank, returned keys, mileage submitted in the driver app.",
          ts: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setTimeout(() => setResolved(true), 600);
    }, 1200);
  };

  const submit = async () => {
    if (csat == null) return;
    await submitCSAT("c-demo", csat, feedback);
    setSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: font,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: C.surface,
          border: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 80px)",
          maxHeight: 720,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontFamily: display, fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em" }}>
              Agent Cargo Support
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
              AI agent · responds in seconds
            </div>
          </div>
          <Link href="/overview" style={{ fontSize: 11, color: C.accent }}>
            Dashboard →
          </Link>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, overflow: "auto" }}>
          {msgs.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.from === "driver" ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "78%",
                  background: m.from === "ai" ? C.accentSoft : C.surfaceAlt,
                  border: `1px solid ${m.from === "ai" ? C.accentBorder : C.border}`,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: C.text,
                }}
              >
                <div>{m.text}</div>
                <div style={{ marginTop: 4, fontFamily: mono, fontSize: 9.5, color: C.textTer }}>{m.ts}</div>
              </div>
            </div>
          ))}

          {/* Inline CSAT survey */}
          {resolved && (
            <div
              style={{
                marginTop: 12,
                padding: "16px",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderTop: `3px solid ${C.accent}`,
                animation: "slideDown 0.3s ease-out",
              }}
            >
              {!submitted ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12, textAlign: "center" }}>
                    How was your support experience?
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
                    {[1, 2, 3, 4, 5].map((n) => {
                      const isSelected = csat === n;
                      return (
                        <button
                          key={n}
                          onClick={() => setCsat(n)}
                          style={{
                            width: 44,
                            height: 44,
                            border: `1px solid ${isSelected ? C.accent : C.border}`,
                            background: isSelected ? C.accent : C.surface,
                            color: isSelected ? "#FFFFFF" : C.text,
                            fontFamily: display,
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12, fontFamily: mono, fontSize: 10, color: C.textTer, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {CSAT_LABELS.map((lbl, i) => (
                      <span key={lbl} style={{ width: 44, textAlign: "center", color: csat === i + 1 ? C.accent : C.textTer }}>
                        {lbl}
                      </span>
                    ))}
                  </div>
                  {csat != null && (
                    <>
                      <input
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tell us more (optional)"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: `1px solid ${C.border}`,
                          fontSize: 12,
                          outline: "none",
                          marginBottom: 12,
                          fontFamily: font,
                        }}
                      />
                      <button
                        onClick={submit}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          background: C.accent,
                          color: "#FFFFFF",
                          fontSize: 12,
                          fontWeight: 600,
                          border: "none",
                          cursor: "pointer",
                          fontFamily: font,
                        }}
                      >
                        Submit
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "10px 0", animation: "pageIn 0.3s ease-out" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: C.greenSoft,
                      border: `1px solid ${C.greenBorder}`,
                      color: C.green,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      marginBottom: 8,
                    }}
                  >
                    ✓
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Thanks for your feedback!</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        {!resolved && (
          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${C.border}` }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{ flex: 1, border: `1px solid ${C.border}`, padding: "8px 12px", fontSize: 13, outline: "none", fontFamily: font }}
            />
            <button
              onClick={send}
              style={{
                padding: "8px 16px",
                background: C.accent,
                color: "#FFFFFF",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
