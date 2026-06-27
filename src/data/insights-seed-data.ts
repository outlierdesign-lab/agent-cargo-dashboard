import type { InsightTopIssue, InsightKnowledgeGap, InsightLangPerf } from "@/lib/types";

export const topIssues: InsightTopIssue[] = [
  { rank: 1, issue: "Lost or locked-in keys", volume: 47, trend: 23, resolution: { ai: 22, human: 17, escalated: 8 }, avgTimeMin: 14 },
  { rank: 2, issue: "Mileage reporting questions", volume: 38, trend: -8, resolution: { ai: 34, human: 3, escalated: 1 }, avgTimeMin: 2 },
  { rank: 3, issue: "Payment status inquiries", volume: 31, trend: 4, resolution: { ai: 28, human: 2, escalated: 1 }, avgTimeMin: 3 },
  { rank: 4, issue: "End of shift procedures", volume: 24, trend: -2, resolution: { ai: 22, human: 2, escalated: 0 }, avgTimeMin: 2 },
  { rank: 5, issue: "Vehicle damage / collision", volume: 11, trend: 12, resolution: { ai: 0, human: 4, escalated: 7 }, avgTimeMin: 22 },
  { rank: 6, issue: "Insurance claim help", volume: 9, trend: -5, resolution: { ai: 5, human: 3, escalated: 1 }, avgTimeMin: 8 },
  { rank: 7, issue: "Schedule / route changes", volume: 8, trend: 16, resolution: { ai: 6, human: 1, escalated: 1 }, avgTimeMin: 4 },
];

export const knowledgeGaps: InsightKnowledgeGap[] = [
  { topic: "Overtime pay calculation rules", frequency: 12, outcome: "Escalated" },
  { topic: "Cross-border trip procedures (NO→SE)", frequency: 9, outcome: "Escalated" },
  { topic: "Vehicle inspection schedule lookup", frequency: 7, outcome: "Partial answer" },
  { topic: "Parking ticket reimbursement", frequency: 6, outcome: "Escalated" },
  { topic: "Sick leave reporting flow", frequency: 5, outcome: "Partial answer" },
  { topic: "Charging EV at non-partner stations", frequency: 4, outcome: "Escalated" },
];

export const costIntelligence = {
  perResolution: 3.2,
  perResolutionTrend: -8,
  aiCost: 0.8,
  humanCost: 12.5,
  speedMultiplier: 15.6,
  dealerCalls: 31,
  dealerCallTotal: 186,
  savings: 2840,
};

export const costBreakdown = [
  { category: "Lost Keys", volume: 47, aiPct: 47, humanPct: 53, avgCost: 8.2, totalCost: 385 },
  { category: "SOP questions", volume: 62, aiPct: 91, humanPct: 9, avgCost: 1.4, totalCost: 87 },
  { category: "Data lookup", volume: 34, aiPct: 85, humanPct: 15, avgCost: 1.8, totalCost: 61 },
  { category: "Crash / safety", volume: 11, aiPct: 0, humanPct: 100, avgCost: 18.5, totalCost: 204 },
  { category: "Other", volume: 16, aiPct: 56, humanPct: 44, avgCost: 4.1, totalCost: 66 },
];

export const escalationPatterns = [
  { reason: "Low AI confidence", pct: 34 },
  { reason: "Driver frustration", pct: 22 },
  { reason: "Keyword trigger", pct: 18 },
  { reason: "Dealer unreachable", pct: 14 },
  { reason: "Multi-issue conversation", pct: 12 },
];

export const escalationStats = {
  avgTimeToEscalateMin: 4.2,
  medianTimeToEscalateMin: 3.1,
  repeatEscalations: 4,
};

export const langPerformance: InsightLangPerf[] = [
  { market: "NO", volume: 78, aiPct: 71, csat: 4.7, avgResponseS: 2.1, trend: 6 },
  { market: "SE", volume: 42, aiPct: 68, csat: 4.6, avgResponseS: 2.2, trend: 3 },
  { market: "DK", volume: 28, aiPct: 64, csat: 4.5, avgResponseS: 2.4, trend: 1 },
  { market: "NL", volume: 18, aiPct: 58, csat: 4.1, avgResponseS: 2.8, trend: -4 },
  { market: "EN", volume: 4, aiPct: 75, csat: 4.5, avgResponseS: 2.3, trend: 8 },
];

// Heatmap: 7 days × 24 hours, value 0-12
export const peakHoursHeatmap: number[][] = [
  // Mon
  [1, 0, 0, 0, 1, 2, 5, 11, 14, 13, 10, 9, 8, 10, 12, 11, 10, 7, 5, 4, 3, 2, 2, 1],
  // Tue
  [1, 0, 0, 0, 1, 2, 5, 12, 14, 12, 9, 8, 8, 11, 12, 11, 9, 7, 5, 3, 3, 2, 2, 1],
  // Wed
  [1, 0, 0, 0, 1, 2, 4, 10, 13, 11, 8, 8, 7, 9, 11, 10, 8, 6, 4, 3, 2, 2, 1, 1],
  // Thu
  [1, 0, 0, 0, 1, 2, 5, 11, 13, 12, 9, 9, 7, 10, 11, 10, 9, 7, 5, 3, 3, 2, 2, 1],
  // Fri
  [1, 0, 0, 0, 1, 2, 5, 11, 14, 13, 11, 10, 9, 11, 12, 11, 10, 8, 6, 4, 3, 2, 2, 1],
  // Sat
  [0, 0, 0, 0, 0, 1, 2, 4, 6, 7, 8, 8, 7, 6, 6, 5, 4, 4, 3, 2, 2, 1, 1, 0],
  // Sun
  [0, 0, 0, 0, 0, 1, 1, 3, 5, 6, 7, 7, 6, 6, 5, 5, 4, 3, 3, 2, 1, 1, 1, 0],
];

export const peakStats = {
  peakDay: "Tuesday",
  peakHour: "14:00",
  peakVolume: 12,
  quietestHour: "03:00",
  offHoursCoverage: "100% AI",
};
