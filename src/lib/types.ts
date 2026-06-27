export type Lang = "NO" | "SE" | "DK" | "NL" | "EN";
export type Intent = "Keys" | "Crash" | "SOP" | "Data" | "Other";
export type ConvStatus = "active" | "resolved" | "escalated" | "waiting";
export type ResolvedBy = "ai" | "human" | "pending";

export interface Msg {
  id: string;
  from: "driver" | "ai" | "human" | "system";
  text: string;
  ts: string;
}

export interface Conv {
  id: string;
  driver: string;
  lang: Lang;
  intent: Intent;
  status: ConvStatus;
  summary: string;
  vehicle: string;
  startedAt: string;
  durationMin: number;
  confidence: number;
  resolvedBy: ResolvedBy;
  kbSources: string[];
  escalationReason?: string;
  messages: Msg[];
  csat?: number;
  csatFeedback?: string;
  takenOver?: boolean;
  humanAgent?: string;
}

export type StepType =
  | "trigger"
  | "collect"
  | "lookup"
  | "send"
  | "action"
  | "condition"
  | "escalate"
  | "end";

export interface Step {
  id: string;
  type: StepType;
  label: string;
  detail?: string;
  yes?: string;
  no?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  intent: Intent;
  status: "live" | "draft";
  platform: "intercom" | "vapi" | "web";
  runs: number;
  resolved: number;
  active: number;
  escalated: number;
  successRate: number;
  lastEdited: string;
  trigger: string;
  steps: Step[];
}

export interface KBDoc {
  id: string;
  title: string;
  format: "PDF" | "DOCX" | "MD" | "TXT";
  pages: number;
  sizeKB: number;
  addedAt: string;
  chunks: number;
  status: "indexed" | "indexing" | "failed";
}

export interface KBUrl {
  id: string;
  url: string;
  title: string;
  status: "indexed" | "indexing" | "failed";
  lastCrawled: string;
  pages: number;
  chunks: number;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "connected" | "not-connected" | "testing";
  env: "production" | "staging" | "—";
  apiKey?: string;
}

export interface EscalationRule {
  id: string;
  type: "keyword" | "confidence" | "sentiment" | "timeout";
  value: string;
  queue: string;
  priority: "low" | "medium" | "high" | "critical";
  active: boolean;
}

export interface InsightTopIssue {
  rank: number;
  issue: string;
  volume: number;
  trend: number; // +/- percent
  resolution: { ai: number; human: number; escalated: number };
  avgTimeMin: number;
}

export interface InsightKnowledgeGap {
  topic: string;
  frequency: number;
  outcome: "Escalated" | "Partial answer";
}

export interface InsightLangPerf {
  market: Lang;
  volume: number;
  aiPct: number;
  csat: number;
  avgResponseS: number;
  trend: number;
}
