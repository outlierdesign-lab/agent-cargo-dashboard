# Agent Cargo — Ops Dashboard

AI-powered driver support operations dashboard for Agent Cargo. Built with Next.js 15, TypeScript, and App Router. Inline-styled with strict design tokens — no Tailwind, no component libraries, zero border-radius everywhere except the few semantic exceptions.

## Routes

- `/overview` — health-check dashboard (metrics, ROI card, volume chart, workflows summary, recent conversations)
- `/conversations` — list with status filters + search; `/conversations/[id]` — chat with takeover/handback/resolve
- `/insights` — top issues, knowledge gaps, cost intelligence, escalation patterns, language perf, peak hours heatmap
- `/knowledge` — KB documents + URLs with drag-drop upload and live indexing simulation
- `/workflows` — workflow cards with mini flow previews; detail view + builder
- `/audit` — searchable conversation log + breakdown tab + CSV export
- `/config` — six tabs: When to Escalate, Escalation Workflows, Teams & Channels, Behavior, Languages, AI Instructions
- `/integrations` — connected services with masked keys, env badges, edit modal
- `/chat` — driver-facing chat with inline CSAT survey

## Design language

- **Fonts**: Geist (display), Inter (body), IBM Plex Mono (data/timestamps)
- **Colors**: teal accent `#0E9AA7`, neutral surfaces, semantic green/red/blue/yellow/purple
- **0-radius rule**: borders are sharp everywhere except avatars (50%), toggle tracks (10px), StatusPill (20px), bar chart top corners (2px)
- **Containers**: unified line-framed panels with internal `borderRight`/`borderTop` dividers, accent 3px top-edge gradient

Full specs in `agent-cargo-full-build.md` and `DESIGN_PRINCIPLES.md` (committed alongside).

## Run

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /overview
npm run build        # production build
```

## Seed data only

All data is hardcoded in `src/data/seed.ts` and `src/data/insights-seed-data.ts`. No backend, no API calls — wire `src/lib/uploadSOP.ts` and `src/lib/csat.ts` to real endpoints when ready.

## Structure

```
src/
  app/
    (dashboard)/            # sidebar-wrapped routes
      layout.tsx            # Sidebar + main + ToastProvider
      overview/
      conversations/
        [id]/
      insights/
      knowledge/
      workflows/
        [id]/
        [id]/edit/
        new/
      audit/
      config/
      integrations/
    chat/                   # driver-facing widget
    page.tsx                # redirects to /overview
    layout.tsx              # root layout + fonts
    globals.css
  components/dashboard/
    Sidebar.tsx
    PageHeader.tsx
    Dot.tsx                 # contextual AI assistant button
    Icons.tsx               # all SVG stroke icons
    Card.tsx, Btn.tsx, Modal.tsx, Toggle.tsx, TabBar.tsx
    StatusPill.tsx, IntentTag.tsx, LangBadge.tsx
    MetricCard.tsx, Sparkline.tsx
    ConvRow.tsx
    WorkflowNode.tsx
    Toast.tsx               # provider + useToast() hook
  data/
    seed.ts                 # conversations, workflows, KB, integrations, metrics
    insights-seed-data.ts   # insights-only data
  lib/
    tokens.ts               # C palette, fonts, accent top-edge
    types.ts                # all shared types
    csat.ts                 # submit/get/metrics stubs
    uploadSOP.ts            # simulated upload pipeline
```
