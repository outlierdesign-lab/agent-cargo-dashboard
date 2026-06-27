"use client";

import { C, display, font, mono, accentTopEdge } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import Btn from "@/components/dashboard/Btn";
import Modal from "@/components/dashboard/Modal";
import { useToast } from "@/components/dashboard/Toast";
import { IconPlug, IconEye, IconEyeOff } from "@/components/dashboard/Icons";
import { integrations as seed, availableIntegrations } from "@/data/seed";
import type { Integration } from "@/lib/types";
import { useState } from "react";

const tips = [
  { title: "Each integration is a capability", value: "" },
  { title: "Production vs Staging", body: "Run staging keys here while testing new providers — switch to production once verified." },
  { title: "Disconnect is reversible", body: "Disconnecting an integration pauses calls to it but keeps the credentials. Reconnect anytime." },
] as { title: string; body?: string; value?: string }[];

const dotTips = [
  { title: "Each integration is a capability", body: "Disconnect Vapi → outbound dealer calls stop. Disconnect Pinecone → KB search degrades to keywords." },
  { title: "Production vs Staging", body: "Run staging keys here while testing new providers — switch to production once verified." },
  { title: "Disconnect is reversible", body: "Disconnecting an integration pauses calls to it but keeps the credentials. Reconnect anytime." },
];

export default function IntegrationsPage() {
  const [list, setList] = useState<Integration[]>(seed);
  const [editing, setEditing] = useState<Integration | null>(null);

  const connected = list.filter((i) => i.status === "connected").length;
  const notConnected = list.filter((i) => i.status === "not-connected").length;
  const testing = list.filter((i) => i.status === "testing").length;
  const live = list.filter((i) => i.status === "connected" && i.env === "production").length;

  return (
    <div>
      <PageHeader title="Integrations" tips={dotTips} />

      <div
        style={{
          position: "relative",
          background: C.surface,
          border: `1px solid ${C.border}`,
          marginBottom: 14,
        }}
      >
        <div style={accentTopEdge} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { label: "Connected", value: String(connected), color: C.green },
            { label: "Not connected", value: String(notConnected), color: C.textSec },
            { label: "Live", value: String(live), color: C.text },
            { label: "Testing", value: String(testing), color: C.yellow },
          ].map((m, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
              <MetricCard label={m.label} value={m.value} valueSize={24} valueColor={m.color} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionHeader>Connected services</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {list.filter((i) => i.status === "connected").map((i) => (
            <ServiceCard key={i.id} svc={i} onEdit={() => setEditing(i)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionHeader>Not connected</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {list.filter((i) => i.status === "not-connected").map((i) => (
            <ServiceCard key={i.id} svc={i} onEdit={() => setEditing(i)} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader>Available integrations</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {availableIntegrations.map((a) => (
            <AvailableCard key={a.id} name={a.name} description={a.description} />
          ))}
        </div>
      </div>

      {editing && (
        <EditModal
          svc={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setList(list.map((x) => (x.id === updated.id ? updated : x)));
            setEditing(null);
          }}
          onDisconnect={(id) => {
            setList(list.map((x) => (x.id === id ? { ...x, status: "not-connected", env: "—" } : x)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 10,
        color: C.textTer,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 10,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function ServiceCard({ svc, onEdit }: { svc: Integration; onEdit: () => void }) {
  const [show, setShow] = useState(false);
  const connected = svc.status === "connected";
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        padding: "16px 18px",
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: connected ? C.accentSoft : C.surfaceAlt,
              border: `1px solid ${connected ? C.accentBorder : C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconPlug size={14} color={connected ? C.accent : C.textSec} />
          </div>
          <div>
            <div style={{ fontFamily: display, fontSize: 14, fontWeight: 600, color: C.text, letterSpacing: "-0.01em" }}>
              {svc.name}
            </div>
            <div style={{ fontSize: 11.5, color: C.textSec, marginTop: 2 }}>{svc.description}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 20,
              background: connected ? C.greenSoft : C.surfaceAlt,
              border: `1px solid ${connected ? C.greenBorder : C.border}`,
              color: connected ? C.green : C.textTer,
              fontFamily: mono,
              fontSize: 9.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {connected ? "Connected" : "Not connected"}
          </span>
          {connected && (
            <span
              style={{
                fontFamily: mono,
                fontSize: 9.5,
                color: svc.env === "production" ? C.text : C.yellow,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                fontWeight: 600,
              }}
            >
              {svc.env}
            </span>
          )}
        </div>
      </div>
      {connected && svc.apiKey && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.surfaceAlt,
            border: `1px solid ${C.borderLight}`,
            padding: "6px 10px",
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 11, color: C.text, flex: 1, wordBreak: "break-all" }}>
            {show ? svc.apiKey : "•".repeat(Math.min(svc.apiKey.length, 28))}
          </span>
          <button onClick={() => setShow(!show)} style={{ color: C.textSec, display: "flex", padding: 2 }}>
            {show ? <IconEyeOff size={12} /> : <IconEye size={12} />}
          </button>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn variant="default" size="sm" onClick={onEdit}>
          {connected ? "Edit" : "Connect"}
        </Btn>
      </div>
    </div>
  );
}

function AvailableCard({ name, description }: { name: string; description: string }) {
  const toast = useToast();
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        padding: "14px 16px",
        fontFamily: font,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{name}</div>
        <div style={{ fontSize: 11.5, color: C.textSec, marginTop: 2 }}>{description}</div>
      </div>
      <Btn variant="default" size="sm" onClick={() => toast.show(`${name} setup started`, "info")}>
        Connect
      </Btn>
    </div>
  );
}

function EditModal({
  svc,
  onClose,
  onSave,
  onDisconnect,
}: {
  svc: Integration;
  onClose: () => void;
  onSave: (s: Integration) => void;
  onDisconnect: (id: string) => void;
}) {
  const toast = useToast();
  const [apiKey, setApiKey] = useState(svc.apiKey || "");
  const [env, setEnv] = useState<Integration["env"]>(svc.env);

  return (
    <Modal open onClose={onClose} title={`${svc.name} integration`} width={480}>
      <div style={{ fontFamily: font }}>
        <div style={{ fontSize: 12, color: C.textSec, marginBottom: 16 }}>{svc.description}</div>
        <label style={{ display: "block", fontSize: 11, color: C.textSec, marginBottom: 6 }}>API key</label>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste your API key"
          style={{
            width: "100%",
            padding: "8px 12px",
            border: `1px solid ${C.border}`,
            fontSize: 12.5,
            fontFamily: mono,
            outline: "none",
            marginBottom: 16,
          }}
        />
        <label style={{ display: "block", fontSize: 11, color: C.textSec, marginBottom: 6 }}>Environment</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {(["production", "staging"] as const).map((e) => (
            <button
              key={e}
              onClick={() => setEnv(e)}
              style={{
                padding: "6px 14px",
                border: `1px solid ${env === e ? C.accent : C.border}`,
                background: env === e ? C.accentSoft : C.surface,
                fontSize: 12,
                fontFamily: font,
                color: C.text,
                textTransform: "capitalize",
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          {svc.status === "connected" && (
            <Btn
              variant="danger"
              size="sm"
              onClick={() => {
                onDisconnect(svc.id);
                toast.show(`${svc.name} disconnected`, "info");
              }}
            >
              Disconnect
            </Btn>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <Btn variant="default" size="sm" onClick={onClose}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              onClick={() => {
                onSave({ ...svc, apiKey, env, status: "connected" });
                toast.show(`${svc.name} ${svc.status === "connected" ? "updated" : "connected"}`, "success");
              }}
            >
              Save
            </Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
}
