import type { KBDoc } from "@/lib/types";

type Stage = "Uploading..." | "Processing document..." | "Extracting content..." | "Indexing for search..." | "Ready";

export type ProgressCb = (stage: Stage, pct: number) => void;

export async function uploadSOP(
  file: File,
  onProgress?: ProgressCb
): Promise<KBDoc> {
  const stages: Stage[] = [
    "Uploading...",
    "Processing document...",
    "Extracting content...",
    "Indexing for search...",
    "Ready",
  ];
  for (let i = 0; i < stages.length; i++) {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 300));
    onProgress?.(stages[i], ((i + 1) / stages.length) * 100);
  }
  const ext = file.name.split(".").pop()?.toUpperCase() || "TXT";
  return {
    id: `d-${Date.now()}`,
    title: file.name.replace(/\.[^.]+$/, ""),
    format: (["PDF", "DOCX", "MD", "TXT"].includes(ext) ? ext : "TXT") as KBDoc["format"],
    pages: Math.max(1, Math.round(file.size / 8000)),
    sizeKB: Math.round(file.size / 1024),
    addedAt: "Just now",
    chunks: Math.max(1, Math.round(file.size / 2000)),
    status: "indexed",
  };
}
