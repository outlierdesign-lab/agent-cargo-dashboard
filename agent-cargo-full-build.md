# Agent Cargo Ops Dashboard — Complete Build

Read DESIGN_PRINCIPLES.md before touching any code. It is the visual law — 0-radius borders, Geist + Inter + IBM Plex Mono fonts, teal accent (#0E9AA7), line-framed containers, stroke SVG icons, no emoji, no shadows, no rounded corners.

This prompt builds the entire product. Do it page by page, in order. After each page, verify it renders and navigates correctly before moving on.

---

## ARCHITECTURE

Next.js app with App Router. Pages live under `src/app/(dashboard)/`. Shared components in `src/components/dashboard/`. Design tokens in `src/lib/tokens.ts`. Seed data in `src/lib/seed-data.ts`.

### Design Tokens (`src/lib/tokens.ts`)

```ts
export const C = {
  bg: "#F7F7F7",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F0F0",
  border: "#E5E5E5",
  borderLight: "#EFEFEF",
  text: "#111111",
  textSec: "#555555",
  textTer: "#999999",
  accent: "#0E9AA7",
  green: "#18864B",
  red: "#DC3545",
  blue: "#2563EB",
  yellow: "#CA8A04",
  purple: "#7C3AED",
};

export const font = "'Inter', -apple-system, sans-serif";
export const mono = "'IBM Plex Mono', 'JetBrains Mono', monospace";
export const display = "'Geist', 'Inter', sans-serif";
```

Load fonts in the root layout:
- Geist: `https://cdn.jsdelivr.net/npm/geist@1.2.2/dist/fonts/geist-sans/style.min.css`
- Inter: Google Fonts
- IBM Plex Mono: Google Fonts

### Shell Layout

- **Sidebar** (220px, fixed left, full height): Logo block ("Agent Cargo" + "ops dashboard" subtitle) at top, navigation items with stroke SVG icons, footer ("Agent Cargo · v1.0" in 10px tertiary).
- Active nav item: `borderLeft: 3px solid accent` + accent-tinted background + accent text + fontWeight 600.
- Inactive: `borderLeft: 3px solid transparent`. Hover: `surfaceAlt` background.
- **Content area**: flex 1, scrollable, max-width 1100px, 28-32px padding.
- Page transitions: opacity 0→1, 200ms ease on route change.

### Navigation Items (in order)

1. Overview (house icon)
2. Conversations (chat bubble icon, badge showing active count)
3. Insights (lightbulb icon)
4. Knowledge Base (book icon)
5. Workflows (branch/merge icon)
6. Audit Log (clipboard icon)
7. Agent Config (settings gear icon)
8. Integrations (plug icon)

---

## SHARED COMPONENTS

Build these first. Every page uses them.

### StatusPill
Tag with colored dot + label. 0-radius (exception: 20px borderRadius for the pill shape). Colors: green = Resolved, blue = Active, red = Escalated, yellow = Waiting. Active status dot pulses with CSS animation.

### IntentTag
Mono-font tag with light background and 1px border. Neutral styling. Shows intent: "Keys", "Crash", "SOP", "Data", "Other".

### LangBadge
Two-letter country code (NO, SE, DK, NL, EN) in mono font, fixed 38px width. No emoji flags.

### MetricCard
Label (uppercase, 10-10.5px, tertiary, mono) → Value (28-38px, Geist, colored) → Subtitle with optional trend arrow (green ↑ or red ↓). Optional sparkline (48×16px SVG, 1.5px stroke, 7 data points, 10% opacity area fill).

### Card
White surface, 1px border (#E5E5E5), 0-radius. Optional 3px accent gradient top-edge (`linear-gradient(90deg, accent, accent40)`).

### Button (Btn)
Four variants: `default` (grey border), `primary` (teal fill, white text), `danger` (red fill), `success` (green fill). 12px Inter, 8px 18px padding, 0-radius.

### TabBar
Horizontal tabs. Active tab gets accent underline + bold text. Inactive tabs are tertiary text.

### Toggle
36×20px switch. Off: light grey track, white knob left. On: dark track (#111111), white knob slides right. 150ms transition.

### Modal
Centered overlay with backdrop blur. 1px border, 0-radius. Fixed header with title + × close button. Max 80vh height, scrollable body.

### Toast
Fixed bottom-right notification. Green (success), red (error), dark (info). Auto-dismiss after 2.8s. 0-radius. Slide in from right.

### ConvRow
Clickable table row for conversations. Shows: avatar initials circle (50% radius) → name + summary → language badge → intent tag → status pill → timestamp (mono). Hover: `borderLeft: 3px solid accent` + `surfaceAlt` background (150ms transition). Account for 3px in padding-left so content doesn't shift.

### Dot (AI Assistant)
Pill button in every page header: `[● Dot Explains ›]`. Pulsing teal orb (20px), "Dot" in 12px semibold, "Explains" in 10.5px tertiary. Dropdown: 320px wide, right-aligned. 3 contextual tips per page that explain what the user is looking at. NOT a chatbot — it's a contextual guide.

### SVG Icons
Create as functions accepting `{ size, color }` props. Default size 16px. viewBox 0 0 24 24, strokeWidth 1.8px, strokeLinecap round, strokeLinejoin round, fill none, color currentColor. Build icons for: house, chat, lightbulb, book, branch, clipboard, settings, plug, search, filter, plus, x, check, chevron-down, chevron-right, arrow-up, arrow-down, phone, upload, file, globe, user, clock, star, menu-dots, edit, trash, copy, download, alert-triangle, info.

---

## PAGE 1: OVERVIEW (`/overview`)

Single-screen health check. User should know in 5 seconds if things are fine.

**Layout (top to bottom):**

### 1.1 Header
"Overview" in Geist 22px weight 600. Dot button right-aligned.

### 1.2 Top Metrics Row (4 cards, equal width, line-framed)
Inside one container with vertical borderRight dividers between cells:

- **AI Resolved**: percentage (e.g. "63.9%") in Geist 30px + trend arrow + "of all conversations this week" in tertiary. Sparkline.
- **Sent to Human**: percentage + trend + "escalated this week". Sparkline.
- **Avg Response**: time value (e.g. "2.3s") + "target under 3s". Sparkline.
- **Driver Satisfaction**: X/5 (e.g. "4.6/5") + trend + "from N ratings". Sparkline.

### 1.3 ROI Card (full width, two panels side by side)
Line-framed container with accent top-edge gradient. Two panels separated by vertical borderRight divider:

**Left — FTE Equivalent:**
- "2.4" in Geist 36px weight 700 + "agents" label
- Trend: "↑ 0.3 vs last month" in green
- Context: "Based on 204 conversations resolved at 8.2 min avg human handle time"

**Right — Hours Saved This Month:**
- "127" in Geist 36px weight 700 + "hrs" label
- Trend: "↑ 14% vs last month"
- Comparison strip: three inline metrics — "Human: 8.2 min" | "AI: 1.6 min" | "5.1× faster"

### 1.4 Volume + Workflows Row (2:1 flex ratio)
Line-framed container split into two areas by vertical borderRight:

**Volume (flex 2):**
- Section header + date picker (Today / Yesterday / Last 7 days / Last month / Custom)
- 4 small inline metrics: Total, AI Resolved, Escalated, In Progress
- Bar chart: vertical bars per hour, accent gradient fill (solid top → 15% bottom), current hour full accent, past 60% opacity, future 20%. Top corners only "2px 2px 0 0". Dashed horizontal grid lines. Hour labels every 4th hour. Hover tooltip with count.

**Workflows (flex 1):**
- List of workflows with icon, name, run count
- Stacked breakdown bar per workflow (7px height, green/blue/red for resolved/active/escalated, 1px gap between segments). Hover tooltip: "Resolved: 18 (78%) · In progress: 2 (9%) · Escalated: 3 (13%)"
- Live/Draft status pill
- "Manage →" link to workflows page

### 1.5 Recent Conversations (table in container)
- Section header: "Recent Conversations" + "View all →" link
- Table of 5 most recent conversations using ConvRow component
- Sorted: active first, then escalated, waiting, resolved
- Empty state: "All clear — no active conversations right now"

---

## PAGE 2: CONVERSATIONS (`/conversations`)

### 2.1 Header + Dot

### 2.2 Filter Bar
Status tabs: All (count), Active, Resolved, Escalated, Waiting — with counts in tertiary. Active tab gets accent underline. Search input on the right (0-radius, border, search icon).

### 2.3 Conversation Table
Full-width table using ConvRow. Click any row → navigates to conversation detail.

### 2.4 Conversation Detail (`/conversations/:id`)
Two-column layout (2:1):

**Left — Chat:**
- Header bar: avatar, driver name, language, intent, status, vehicle + start time + duration
- Action buttons: "✓ Resolve" + "Take Over" / "Hand Back"
- Takeover warning banner (yellow border-left, yellow-tinted bg): "You are controlling this conversation. AI agent is paused."
- Chat transcript: driver messages left (grey bg, border), AI messages right (accent-tinted bg), human messages right (blue-tinted bg), system messages centered italic grey
- Message input (only when taken over): text input + Send button

**Right — Context Sidebar:**
- AI Confidence: score/100 with thin progress bar (green >70, yellow >45, red <45)
- CSAT Score: X/5 with color coding (4-5 green, 3 yellow, 1-2 red). Only for resolved conversations.
- Knowledge Sources: list of KB docs the AI referenced
- Escalation Reason: red-bordered box (only if escalated)
- Outcome: resolved by AI/human/in progress + duration

**Action cycles:**
- Take Over → system message → AI stops → input appears → human types. Toast: "You're in control now — the driver sees your name"
- Hand Back → system message → input disappears → AI resumes. Toast: "AI agent resumed — you can jump back in anytime"
- Resolve → status changes → toast: "Conversation resolved"

---

## PAGE 3: INSIGHTS (`/insights`) — Demo Data Only

Strategic intelligence page. All hardcoded seed data, no API calls. Data stored in `src/lib/insights-seed-data.ts`.

### 3.1 Header
"Insights" in Geist 22px. Subtitle: "Patterns and opportunities across your support operations". Time range selector top-right: "Last 7 days" / "Last 30 days" / "Last 90 days".

### 3.2 Top Issues This Period
Ranked list of 5-7 most frequent driver issues. Each row: rank number (mono), issue name, volume ("47 conversations"), trend arrow (↑ 12% red or ↓ 8% green), tiny resolution method bar (80px, green=AI/teal=human/red=escalated), avg resolution time. Highest volume row gets accent left-border.

Actionable insight callout below (3px accent left-border): "Keys-related issues increased 23% this period. 68% required a dealer call. Consider pre-positioning spare keys at high-volume locations to reduce call volume."

### 3.3 Knowledge Gaps
Questions the KB can't answer. 5-8 items: topic name, frequency ("12 unanswered queries"), outcome pill (red "Escalated" or yellow "Partial answer"), "Create SOP →" action button linking to KB page.

Insight: "6 topics had no KB coverage this period. Creating SOPs for the top 3 could resolve an estimated 34 conversations without human intervention — saving ~8.5 hours of agent time."

### 3.4 Cost Intelligence
4 metric cards in a row:
1. Cost per resolution: "€3.20" + trend
2. AI vs Human cost: "€0.80" AI / "€12.50" human + "15.6× cheaper"
3. Dealer call costs: "€186" total + "31 calls"
4. Savings this period: "€2,840" in green + "vs fully human ops"

Cost breakdown table below: Category | Volume | AI Resolved % | Human Resolved % | Avg Cost | Total Cost. Green text for high AI rates, red for low.

Insight: "Keys remain the most expensive category at €8.20/resolution — 74% still require human + dealer call."

### 3.5 Escalation Patterns
Horizontal bar chart of top escalation reasons (accent bars, 0-radius): "Low AI confidence" 34%, "Driver frustration" 22%, "Keyword trigger" 18%, "Dealer unreachable" 14%, "Multi-issue" 12%.

Time-to-escalation metric. Repeat escalation drivers mini-list.

Insight: "34% of escalations are from low AI confidence — expanding KB coverage on the 6 gap topics could reduce escalations by ~20%."

### 3.6 Language & Regional Performance
Table: Market (2-letter code, not emoji) | Volume | AI Resolution % | Avg CSAT | Avg Response Time | Trend. Red highlight on worst performer (Netherlands: 58% AI resolution, declining).

Insight: "Netherlands has the lowest AI resolution rate (58%) and declining CSAT. Review Dutch-language KB coverage."

### 3.7 Peak Hours & Capacity
Heatmap grid: 7 rows (Mon-Sun) × 24 columns (hours). Small squares (16×16px), 0-radius. Color intensity: transparent → light accent → dark accent. Hover tooltip: "Tuesday 14:00 — 12 conversations (9 AI, 3 human)".

Peak/quiet metrics below. Insight about staffing recommendations.

**All insight callout boxes:** 1px border, 3px solid accent left-border, surface background, Inter 12px, secondary text, small info stroke icon in accent.

---

## PAGE 4: KNOWLEDGE BASE (`/knowledge`)

### 4.1 Header + Dot

### 4.2 Metrics Row
4 metrics: Total documents, Total URLs, Total chunks indexed, Sources active.

### 4.3 Tab Bar: Documents | URLs

### 4.4 SOP Upload Drop Zone
When documents exist: compact bar (56px height) with upload icon + "Upload SOP" + "Browse" link. Accepts drag and drop.

When empty: larger dashed-border zone (140px height), "Drop SOP files here", "PDF, DOCX, TXT, or Markdown — up to 25MB", "Browse files" link in accent.

**Drag hover:** border dashed→solid accent, subtle accent tint (5% opacity), icon scales up slightly (150ms).

**Upload processing:** File immediately appears at top of list with slide-down animation (opacity 0→1, translateY -8→0, 200ms). 3px progress bar fills across the bottom of the row. Status cycles: "Uploading..." → "Processing document..." → "Extracting content..." → "Indexing for search..." → "Ready" (3-4 seconds total, simulated with timeouts).

**Completion:** progress bar fades out, green checkmark + "Indexed" status, left-border accent flash (1 second), toast: "SOP uploaded — AI agent can now reference this document".

**Multi-file:** staggered by 100ms. Summary toast: "3 SOPs uploaded and indexed".

**Error:** progress bar turns red, "Upload failed" + retry icon. Click to retry.

**Backend-ready:** All upload logic in a single `uploadSOP(file)` function returning a Promise. Currently simulated. Swap internals to POST /api/knowledge/upload later.

### 4.5 Documents Table
Rows: file type icon (per format) + filename (Inter 13px weight 500) + metadata line ("PDF · 24 pages · 2.4 MB · Added 2 hours ago" in tertiary mono) + green "Indexed" status pill + three-dot menu (Preview, Re-index, Delete). Standard row hover.

### 4.6 URLs Tab
Table: globe icon + URL + title + status (indexed/indexing) + last crawled + pages + chunks. Delete and Resync actions. "Add URL" button → modal. Indexing simulation.

---

## PAGE 5: WORKFLOWS (`/workflows`)

### 5.1 List View
Header + "+ Create workflow" button + Dot. Metrics: Total, Active, Draft, Avg success rate.

Workflow cards with: icon (mapped to intent), name, description, status badge (Active/Draft), platform badge. Mini flow preview: first 6 steps as connected node pills. Stats: step count, branches, run count, success rate, last edited. Context menu (⋯): Edit, Duplicate, Delete.

### 5.2 Detail View (`/workflows/:id`)
Back button + name + status. Action buttons: Edit, Activate/Deactivate, Dot. Metrics: times used, success rate, trigger intent, last edited.

Full flow visualization: trigger node + steps as typed/colored nodes connected by arrows. Step types with distinct colors:
- Trigger (teal outline)
- Collect info (blue)
- Lookup (yellow)
- Send message (green)
- Take action (accent)
- Condition (yellow diamond with Yes/No branches)
- Escalate (red)
- End (green, dashed border)

### 5.3 Builder (`/workflows/new` or `/workflows/:id/edit`)
Full-screen split: Editor (440px left) | Live Preview (right).

Editor: name, description, trigger inputs. Step list with add buttons between steps. Per step: type selector (6 types), label + detail inputs. Condition builder with yes/no branches. Step actions: edit, move, delete.

Preview: real-time flow visualization updating as steps are added.

Save creates/updates workflow. Editing preserves run stats.

---

## PAGE 6: AUDIT LOG (`/audit`)

### 6.1 Header + Export CSV button + Dot

### 6.2 Metrics
Total conversations, avg AI confidence, escalated count, driver satisfaction.

### 6.3 Tab Bar: Conversation Log | Breakdown

### 6.4 Conversation Log
Filter bar: language dropdown, outcome filter, intent filter, date range.
Expandable table: driver name, language, intent, status, confidence, resolved by, duration, summary. Expanded row: transcript preview, KB sources, escalation reason, confidence score.

### 6.5 Breakdown Tab
Resolution breakdown bar (AI vs Human vs Pending with counts). Top escalation reasons. Top KB sources. Reactive to filters.

### 6.6 Export
CSV download with columns: ID, Driver, Language, Intent, Status, Confidence, Resolved By, Duration, Summary.

---

## PAGE 7: AGENT CONFIG (`/config`)

### Tab Bar: When to Escalate | Escalation Workflows | Teams & Channels | Behavior | Languages | AI Instructions

### 7.1 When to Escalate
Rules table: type icon, rule value, destination queue, priority pill, active toggle. Rule types: keyword, confidence threshold, sentiment, timeout. Add rule modal: multi-step (select type → enter value → choose action → destination → priority → notifications → review → save). Each rule toggleable.

### 7.2 Escalation Workflows
Expandable path cards showing lifecycle: pre-handoff actions, routing, notifications, SLA, post-handoff. Add new path wizard.

### 7.3 Teams & Channels
Queue cards: name, icon, members (avatar circles), SLA, priority. Notification channels: Slack, email, SMS with connected status.

### 7.4 Behavior
Calling toggles (auto-call dealers, retry on busy, log calls, auto-transcribe). Response toggles (clarifying questions, confirm before acting, KB citations, auto-resolve simple, offer callback). Tone selector: Friendly / Professional / Concise. Agent display name input. Handoff message template with {agent_name} variable.

### 7.5 Languages
Toggle per language: Norwegian, Swedish, Danish, Dutch, English. Each shows two-letter code + language name + enabled status.

### 7.6 AI Instructions
Large textarea with system prompt. "This is what the AI reads before every conversation" explainer. Save button (highlighted when changed).

---

## PAGE 8: INTEGRATIONS (`/integrations`)

### 8.1 Header + Dot

### 8.2 Metrics: Connected, Not connected, Live, Testing

### 8.3 Connected Services
Cards: icon, name, description, status badge, environment badge (Production/Staging), masked API key with show/hide toggle, Edit button.

Services: Intercom (chat), Vapi (voice), OpenAI (LLM), Pinecone (vector DB), Gire TMS, Avis Dealer API, Supabase (database), Slack (notifications), Sentry (error monitoring).

### 8.4 Available Integrations
Cards with Connect button.

### 8.5 Edit Modal
API key input, Save / Cancel / Disconnect buttons.

---

## CSAT SURVEY SYSTEM

### In Driver Chat (when conversation resolves):
Inline survey card in the chat flow: "How was your support experience?" + 5 rating buttons (1-5, 44×44px, 0-radius) with labels (Poor/Fair/OK/Good/Great) + optional feedback input + Submit button.

Selected button fills accent. Submit → fade out buttons → "Thanks for your feedback!" with checkmark. Card height shrinks smoothly.

### On Dashboard:
- **Conversation detail**: CSAT score next to status pill (star icon + "4.0/5" in mono, color coded)
- **Conversations table**: CSAT column (60px, colored number or "—")
- **Overview metrics**: "AVG CSAT" metric card (Geist 30px, sparkline, distribution bar)
- **Seed data**: resolved conversations have scores 3-5 (skew positive), ~15% no response, ~30% have feedback text

Abstract into `submitCSAT()` / `getCSAT()` / `getCSATMetrics()` for future backend.

---

## SEED DATA

Generate comprehensive, realistic, interconnected seed data. Never show empty states.

### Conversations (12-15)
Mix of statuses (4 active, 3 resolved by AI, 3 resolved by human, 2 escalated, 1 waiting). All 5 languages represented. All intent types. Realistic Norwegian/Swedish/Danish/Dutch driver names. Each has 3-8 messages. Confidence scores ranging 0.4-0.95. Realistic summaries.

### Workflows (4-5)
- Lost Keys (active, 47 runs, 72% success)
- Vehicle Crash (active, 11 runs, 100% escalation rate)
- SOP / Knowledge Base (active, 89 runs, 91% success)
- Data Lookup (active, 34 runs, 85% success)
- Driver Onboarding (draft, 0 runs)

Each with 4-8 steps using different step types including conditions.

### Knowledge Base
- 6-8 documents (PDF/DOCX/MD mix): "Driver Onboarding Guide", "Lost Keys Procedure", "Crash Response Protocol", "Mileage Reporting SOP", "End of Shift Checklist", "Insurance Claims Process"
- 3-4 URLs: Gire help center, Avis dealer portal, insurance provider FAQ

### Integrations
9 services as listed above. 7 connected, 2 not connected.

### Escalation Rules (6-8)
Keywords: "crash", "accident", "injury", "ulykke". Confidence threshold: <0.45. Sentiment: negative. Timeout: 5 min no response.

### Metrics
~170 total conversations, 63.9% AI resolved, 2.3s avg response, 4.6/5 CSAT, 2.4 FTE equivalent, 127 hours saved. Hourly volume array with realistic weekday patterns.

### Insights Seed Data
Coherent story: keys most expensive but declining, SOP best automated, Netherlands underperforming, 6 knowledge gaps, off-hours fully covered by AI, overall trend positive.

---

## ACTION CYCLES

Every interactive element completes its cycle with toast feedback:

- Take over → system msg → input appears → toast
- Hand back → system msg → input hides → toast
- Resolve → status changes → toast
- Upload SOP → progress animation → indexed → toast
- Add URL → indexing state → indexed → toast
- Delete KB item → removed → toast
- Create/edit/duplicate/delete workflow → toast
- Toggle escalation rule → immediate
- Add escalation rule/path → multi-step modal → toast
- Connect/disconnect integration → toast
- Export audit CSV → file download → toast
- Save AI instructions → toast
- Submit CSAT → animation → thank you

---

## WHAT THIS PRODUCT IS NOT

- Not dark mode. Light background, white surfaces.
- Not decorative. No gradients (except accent top-edge), no illustrations.
- Not rounded. 0-radius everywhere (see exceptions in design principles).
- Not generic. Opinionated micro-copy, teal accent, data-dense.
- Not a chatbot UI. This is an ops control center.

Follow DESIGN_PRINCIPLES.md for all styling decisions. When in doubt, refer to that document.
