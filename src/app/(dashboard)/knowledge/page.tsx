"use client";

import { C, display, font, mono, accentTopEdge } from "@/lib/tokens";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import Btn from "@/components/dashboard/Btn";
import Modal from "@/components/dashboard/Modal";
import { useToast } from "@/components/dashboard/Toast";
import { IconUpload, IconFile, IconGlobe, IconMenuDots, IconCheck, IconRefresh, IconTrash, IconPlus, IconEye } from "@/components/dashboard/Icons";
import { kbDocs, kbUrls } from "@/data/seed";
import { uploadSOP } from "@/lib/uploadSOP";
import type { KBDoc, KBUrl } from "@/lib/types";
import { useRef, useState } from "react";

const tips = [
  { title: "Documents power the AI's answers", body: "When a driver asks something, the AI searches indexed docs first. Better KB coverage = higher AI resolution rate." },
  { title: "Drag & drop to add", body: "PDF, DOCX, TXT, or Markdown — up to 25MB. Files index in a few seconds; you'll see status update live." },
  { title: "URLs for living content", body: "Crawl help centers, dealer portals, or policy pages. They refresh on a schedule so updates flow through automatically." },
];

export default function KnowledgePage() {
  const [tab, setTab] = useState<"docs" | "urls">("docs");
  const [docs, setDocs] = useState<KBDoc[]>(kbDocs);
  const [urls, setUrls] = useState<KBUrl[]>(kbUrls);

  const totalChunks = docs.reduce((a, d) => a + d.chunks, 0) + urls.reduce((a, u) => a + u.chunks, 0);

  return (
    <div>
      <PageHeader title="Knowledge Base" tips={tips} />

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
            { label: "Total documents", value: String(docs.length) },
            { label: "Total URLs", value: String(urls.length) },
            { label: "Chunks indexed", value: totalChunks.toLocaleString("en-US") },
            { label: "Sources active", value: String(docs.length + urls.filter((u) => u.status === "indexed").length) },
          ].map((m, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
              <MetricCard label={m.label} value={m.value} valueSize={24} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 20px" }}>
          {[
            { key: "docs", label: "Documents" },
            { key: "urls", label: "URLs" },
          ].map((t) => {
            const isActive = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as "docs" | "urls")}
                style={{
                  padding: "13px 16px",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
                  color: isActive ? C.text : C.textTer,
                  fontFamily: font,
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "docs" ? (
          <DocsTab docs={docs} setDocs={setDocs} />
        ) : (
          <UrlsTab urls={urls} setUrls={setUrls} />
        )}
      </div>
    </div>
  );
}

function DocsTab({ docs, setDocs }: { docs: KBDoc[]; setDocs: (d: KBDoc[]) => void }) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState<{ name: string; stage: string; pct: number }[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    arr.forEach((f, i) => {
      setTimeout(async () => {
        setUploading((u) => [...u, { name: f.name, stage: "Uploading...", pct: 0 }]);
        const newDoc = await uploadSOP(f, (stage, pct) => {
          setUploading((u) => u.map((x) => (x.name === f.name ? { ...x, stage, pct } : x)));
        });
        setUploading((u) => u.filter((x) => x.name !== f.name));
        setDocs([newDoc, ...docs]);
      }, i * 100);
    });
    if (arr.length > 1) {
      setTimeout(
        () => toast.show(`${arr.length} SOPs uploaded and indexed`, "success"),
        4500 + arr.length * 100
      );
    } else {
      setTimeout(
        () => toast.show("SOP uploaded — AI agent can now reference this document", "success"),
        4200
      );
    }
  };

  const empty = docs.length === 0 && uploading.length === 0;

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          margin: 20,
          padding: empty ? "32px 20px" : "14px 20px",
          minHeight: empty ? 140 : 56,
          background: drag ? `${C.accent}0D` : C.surfaceAlt,
          border: drag ? `1px solid ${C.accent}` : `1px dashed ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: empty ? "center" : "flex-start",
          flexDirection: empty ? "column" : "row",
          gap: empty ? 8 : 12,
          cursor: "pointer",
          transition: "all 0.15s",
          fontFamily: font,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: "none" }}
        />
        <IconUpload size={empty ? 22 : 16} color={drag ? C.accent : C.textSec} />
        <div style={{ flex: empty ? "unset" : 1, textAlign: empty ? "center" : "left" }}>
          <div style={{ fontSize: empty ? 13 : 12.5, fontWeight: 500, color: C.text }}>
            {empty ? "Drop SOP files here" : "Upload SOP"}
          </div>
          {empty && (
            <div style={{ fontSize: 11.5, color: C.textTer, marginTop: 2 }}>
              PDF, DOCX, TXT, or Markdown — up to 25MB
            </div>
          )}
        </div>
        <span style={{ color: C.accent, fontSize: 12, fontWeight: 500 }}>{empty ? "Browse files" : "Browse"}</span>
      </div>

      {/* Uploading rows */}
      {uploading.map((u) => (
        <div
          key={u.name}
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto",
            gap: 14,
            alignItems: "center",
            padding: "14px 20px",
            borderTop: `1px solid ${C.borderLight}`,
            fontFamily: font,
            animation: "slideDown 0.2s ease-out",
          }}
        >
          <IconFile size={18} color={C.textSec} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{u.name}</div>
            <div style={{ fontSize: 11, color: C.textTer, fontFamily: mono, marginTop: 2 }}>{u.stage}</div>
          </div>
          <div style={{ width: 60, fontFamily: mono, fontSize: 10.5, color: C.textTer, textAlign: "right" }}>
            {Math.round(u.pct)}%
          </div>
          <div style={{ width: 80 }}>
            <div style={{ height: 4, background: C.surfaceAlt }}>
              <div style={{ height: "100%", width: `${u.pct}%`, background: C.accent, transition: "width 0.3s" }} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              right: 0,
              height: 3,
              background: C.surfaceAlt,
            }}
          >
            <div style={{ height: "100%", width: `${u.pct}%`, background: C.accent, transition: "width 0.3s" }} />
          </div>
        </div>
      ))}

      {/* Documents list */}
      {docs.map((d) => (
        <DocRow key={d.id} doc={d} onDelete={() => setDocs(docs.filter((x) => x.id !== d.id))} />
      ))}
    </div>
  );
}

function DocRow({ doc, onDelete }: { doc: KBDoc; onDelete: () => void }) {
  const toast = useToast();
  const [menu, setMenu] = useState(false);
  const formatColors: Record<KBDoc["format"], string> = {
    PDF: C.red,
    DOCX: C.blue,
    MD: C.purple,
    TXT: C.textSec,
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto",
        gap: 14,
        alignItems: "center",
        padding: "12px 20px",
        borderTop: `1px solid ${C.borderLight}`,
        fontFamily: font,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          background: formatColors[doc.format] + "15",
          color: formatColors[doc.format],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: mono,
          fontSize: 9,
          fontWeight: 700,
        }}
      >
        {doc.format}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{doc.title}</div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer, marginTop: 2 }}>
          {doc.format} · {doc.pages} pages · {(doc.sizeKB / 1024).toFixed(1)} MB · Added {doc.addedAt} · {doc.chunks} chunks
        </div>
      </div>
      <span
        style={{
          padding: "2px 8px",
          borderRadius: 20,
          background: C.greenSoft,
          border: `1px solid ${C.greenBorder}`,
          color: C.green,
          fontFamily: mono,
          fontSize: 9.5,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <IconCheck size={10} color={C.green} />
        Indexed
      </span>
      <button
        onClick={() => setMenu(!menu)}
        style={{ padding: 6, color: C.textSec, display: "flex" }}
      >
        <IconMenuDots size={14} />
      </button>
      {menu && (
        <div
          onMouseLeave={() => setMenu(false)}
          style={{
            position: "absolute",
            right: 16,
            top: "100%",
            zIndex: 10,
            background: C.surface,
            border: `1px solid ${C.border}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            minWidth: 140,
          }}
        >
          {[
            { label: "Preview", Icon: IconEye, action: () => toast.show("Preview opened", "info") },
            { label: "Re-index", Icon: IconRefresh, action: () => toast.show("Re-indexing started", "info") },
            { label: "Delete", Icon: IconTrash, action: onDelete, danger: true },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                setMenu(false);
                opt.action();
                if (opt.label === "Delete") toast.show("Document removed", "info");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                fontSize: 12,
                color: opt.danger ? C.red : C.text,
                background: "transparent",
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceAlt)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <opt.Icon size={12} color={opt.danger ? C.red : C.textSec} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UrlsTab({ urls, setUrls }: { urls: KBUrl[]; setUrls: (u: KBUrl[]) => void }) {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const add = () => {
    if (!newUrl.trim()) return;
    const next: KBUrl = {
      id: `u-${Date.now()}`,
      url: newUrl,
      title: newUrl,
      status: "indexing",
      lastCrawled: "Just now",
      pages: 0,
      chunks: 0,
    };
    setUrls([next, ...urls]);
    setNewUrl("");
    setModal(false);
    toast.show("URL added — crawling will start shortly", "info");
    setTimeout(() => {
      setUrls(
        urls.map((u) => u).concat({
          ...next,
          status: "indexed",
          pages: Math.floor(Math.random() * 30 + 5),
          chunks: Math.floor(Math.random() * 100 + 20),
        })
      );
      toast.show("URL indexed — ready for search", "success");
    }, 3000);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 20px",
          borderBottom: `1px solid ${C.borderLight}`,
        }}
      >
        <Btn variant="primary" size="sm" onClick={() => setModal(true)}>
          <IconPlus size={12} color="#FFFFFF" />
          Add URL
        </Btn>
      </div>
      {urls.map((u) => (
        <div
          key={u.id}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto auto auto auto",
            gap: 14,
            alignItems: "center",
            padding: "12px 20px",
            borderBottom: `1px solid ${C.borderLight}`,
            fontFamily: font,
          }}
        >
          <IconGlobe size={16} color={C.textSec} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{u.title}</div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer, marginTop: 2 }}>
              {u.url}
            </div>
          </div>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 20,
              background: u.status === "indexed" ? C.greenSoft : C.yellowSoft,
              border: `1px solid ${u.status === "indexed" ? C.greenBorder : C.yellowBorder}`,
              color: u.status === "indexed" ? C.green : C.yellow,
              fontFamily: mono,
              fontSize: 9.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {u.status}
          </span>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: C.textTer }}>{u.lastCrawled}</div>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: C.textSec }}>{u.pages} pages</div>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: C.textSec }}>{u.chunks} chunks</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => toast.show("Resync started", "info")}
              style={{ padding: 5, color: C.textSec, display: "flex" }}
              title="Resync"
            >
              <IconRefresh size={13} />
            </button>
            <button
              onClick={() => {
                setUrls(urls.filter((x) => x.id !== u.id));
                toast.show("URL removed", "info");
              }}
              style={{ padding: 5, color: C.red, display: "flex" }}
              title="Delete"
            >
              <IconTrash size={13} />
            </button>
          </div>
        </div>
      ))}

      <Modal open={modal} onClose={() => setModal(false)} title="Add a URL">
        <div style={{ fontFamily: font }}>
          <label style={{ display: "block", fontSize: 11, color: C.textSec, marginBottom: 6 }}>
            URL to crawl
          </label>
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://help.example.com"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: `1px solid ${C.border}`,
              fontSize: 12.5,
              outline: "none",
              fontFamily: font,
            }}
          />
          <div style={{ marginTop: 12, fontSize: 11.5, color: C.textTer }}>
            We'll crawl pages from this domain and index their content for the AI.
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
            <Btn variant="default" size="sm" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn variant="primary" size="sm" onClick={add}>
              Add URL
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
