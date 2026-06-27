import { conversations } from "@/data/seed";

export const CSAT_LABELS = ["Poor", "Fair", "OK", "Good", "Great"] as const;

export function submitCSAT(convId: string, score: number, feedback?: string) {
  // backend-ready stub — would POST /api/v1/conversations/{id}/csat
  return Promise.resolve({ ok: true, convId, score, feedback });
}

export function getCSAT(convId: string): number | undefined {
  return conversations.find((c) => c.id === convId)?.csat;
}

export function getCSATMetrics() {
  const scored = conversations.filter((c) => c.csat != null);
  const avg = scored.length
    ? scored.reduce((a, c) => a + (c.csat || 0), 0) / scored.length
    : 0;
  const distribution = [1, 2, 3, 4, 5].map(
    (n) => scored.filter((c) => c.csat === n).length
  );
  return {
    avg: Number(avg.toFixed(1)),
    count: scored.length,
    distribution,
    responseRate: scored.length / conversations.filter((c) => c.status === "resolved").length,
  };
}
