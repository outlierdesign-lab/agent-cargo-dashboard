# Agent Cargo — Design Principles

> This document is the design law for Agent Cargo. Feed it to Claude Code before any UI work. Every decision here was made deliberately. Do not deviate.

---

## Philosophy

Agent Cargo is a professional operations tool, not a consumer app. It should feel like software built by engineers for operators — precise, structured, and confident. The aesthetic is inspired by Firecrawl, Linear, and n8n: sharp edges, clean lines, data-dense layouts that respect the user's intelligence.

Three words define the visual identity: **sharp, warm, structured.**

- **Sharp**: Zero border-radius on structural elements. Line-framed containers instead of floating cards. Grid-based layouts with visible structure.
- **Warm**: Teal accent color adds personality without being playful. Human-written micro-copy. Subtle hover states that make the UI feel alive.
- **Structured**: Information has clear hierarchy. Data lives in monospace. Labels are uppercase and small. Big numbers command attention. White space is intentional, not decorative.

---

## The 0-Radius Rule

Every structural element has `borderRadius: 0`. This is the single most defining visual decision in the product. It gives the interface a precise, engineered quality that separates it from generic SaaS dashboards.

**Zero radius applies to**: cards, containers, buttons, inputs, textareas, modals, dropdowns, menus, tabs, tags, tooltips, progress bars, table cells, chat bubbles, notification toasts.

**Exceptions (these keep their natural radius)**:
- Avatars and dots: `borderRadius: "50%"` — they are geometric circles
- Toggle switch tracks: `borderRadius: 10px` — inherently round
- Toggle switch knobs: `borderRadius: "50%"` — inherently round
- StatusPill: `borderRadius: 20px` — pill shape is semantic (signals "status badge")
- Badge counts in sidebar: `borderRadius: 10px` — small numeric indicators

If you're unsure whether something should be rounded, it shouldn't be. Default to 0.

---

## Typography

Three font families, each with a specific role. Never mix them.

| Font | Variable | Role | Where it appears |
|------|----------|------|-----------------|
| **Geist** | `display` | Display headlines, big numbers | Page titles, metric values (30px+), ROI numbers, section headers |
| **Inter** | `font` | Body text, UI labels, buttons | Everything that isn't a headline or data value |
| **IBM Plex Mono** | `mono` | Data, timestamps, tags, code | Metric values, conversation timestamps, intent tags, API keys, KB filenames |

**Geist** is the display font loaded from Vercel's CDN (`https://cdn.jsdelivr.net/npm/geist@1.2.2/dist/fonts/geist-sans/style.min.css`). It's used exclusively for large visual elements — never for body text. Its purpose is to make numbers and headlines feel engineered and premium.

### Font sizing hierarchy

| Element | Size | Weight | Font | Line-height |
|---------|------|--------|------|-------------|
| Page title | 22px | 600 | Geist | 1.2 |
| Big metric number | 30-38px | 600-700 | Geist | 1.15 |
| Section header | 13-14px | 600 | Geist | 1.3 |
| Body text | 12-13px | 400-500 | Inter | 1.5 |
| Label (uppercase) | 10-10.5px | 500 | Inter | — |
| Data value | 11-13px | 500-600 | IBM Plex Mono | 1 |
| Timestamp | 11px | 400 | IBM Plex Mono | — |
| Tag/badge | 10-11px | 600 | IBM Plex Mono | — |

### Letter-spacing

- Page titles and Geist elements: `-0.02em` to `-0.04em` (tighter for larger sizes)
- Uppercase labels: `0.03em` (slightly spaced for readability at small sizes)
- Body text: default
- Monospace data: `-0.03em` on large numbers

---

## Color System

### Core palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#F7F7F7` | Page background |
| `surface` | `#FFFFFF` | Card/container fills |
| `surfaceAlt` | `#F0F0F0` | Hover states, muted fills, alternative backgrounds |
| `border` | `#E5E5E5` | Primary borders — cards, dividers |
| `borderLight` | `#EFEFEF` | Internal dividers, subtle separators |
| `text` | `#111111` | Primary text — headings, names, values |
| `textSec` | `#555555` | Secondary text — descriptions, body |
| `textTer` | `#999999` | Tertiary text — labels, timestamps, metadata |
| `accent` | `#0E9AA7` | Interactive teal — links, active states, primary actions |

### Semantic colors

Each semantic color has three variants: base, soft (10% opacity for backgrounds), and border (30% opacity for borders).

| Meaning | Base | Soft | Border |
|---------|------|------|--------|
| Success/Resolved | `#18864B` | `#18864B10` | `#18864B30` |
| Error/Escalated | `#DC3545` | `#DC354510` | `#DC354530` |
| Active/Info | `#2563EB` | `#2563EB10` | `#2563EB30` |
| Warning/Waiting | `#CA8A04` | `#CA8A0410` | `#CA8A0430` |
| Special/Platform | `#7C3AED` | `#7C3AED10` | `#7C3AED30` |

### Color usage rules

- **Accent (teal)** is used sparingly — active nav items, primary buttons, links, interactive highlights. Never as a large background fill.
- **Semantic colors** are for status indicators, trends, and badges only. Don't color text with semantic colors unless it represents status.
- **Green means resolved or positive. Red means escalated or negative. Blue means active or in-progress. Yellow means waiting or warning.** This mapping is consistent everywhere.
- **Never use color alone** to convey meaning. Always pair with text labels or icons.

---

## Layout Architecture

### Unified containers

Pages use **single line-framed containers** rather than multiple floating cards. Sections within a container are separated by `borderTop` or `borderBottom` dividers — not by gaps between cards.

This creates a structured, form-like layout where related information flows as one unit instead of fragmenting into isolated cards.

**Pattern**:
```
┌─────────────────────────────────────────┐
│ Top metrics (cells with vertical dividers) │
├─────────────────────────────────────────┤
│ ROI section (two panels, vertical divider) │
├═════════════════════════════════════════┤  ← 8px bg strip separator
│ Volume chart    │  Workflows sidebar    │
├─────────────────────────────────────────┤
│ Recent conversations table              │
└─────────────────────────────────────────┘
```

**Internal dividers** use `borderTop: 1px solid borderLight` or `borderRight: 1px solid borderLight` for vertical splits.

**Section separators** (between major content blocks) use an 8px tall strip with the page `bg` color to create visual breathing room without breaking the container.

### Spacing scale

| Context | Value |
|---------|-------|
| Page padding | 28-32px |
| Card internal padding | 18-24px |
| Gap between cards (when multiple exist) | 12px |
| Section header margin-bottom | 14-16px |
| Metric row gap | 12px |
| Table row padding | 13px 20px |
| Compact table row padding | 10px 16px |

### Content max-width

All page content constrains to `maxWidth: 1100px`. The sidebar is fixed at 220px. Main content scrolls independently.

---

## Interaction Design

### Hover states

Every interactive element has a hover state. This is non-negotiable — it's what makes the UI feel responsive and alive.

| Element | Hover behavior |
|---------|---------------|
| Table rows | `borderLeft: 3px solid accent` + `background: surfaceAlt` (transition 0.15s) |
| Sidebar nav items | `background: surfaceAlt` |
| Buttons | Slight opacity change or border-color shift |
| Workflow cards | `borderLeft: 3px solid accent` + subtle `box-shadow: inset 0 0 0 1px accent15` |
| Metric cells (overview) | `background: surfaceAlt` transition |
| Cards/containers | No hover effect (they're structural, not interactive) |

### Active states

| Element | Active indicator |
|---------|-----------------|
| Sidebar nav item | `borderLeft: 3px solid accent` + accent background + accent text + fontWeight 600 |
| Tab bar tab | Accent color underline + bold text |
| Filter button | Accent border + accent soft background + accent text |
| Toggle (on) | Dark track (`#111111`), white knob slides right |

### Transitions

All state changes use `transition: all 0.15s` or `transition: background 0.1s`. Nothing should feel instantaneous — but nothing should feel slow. 150ms is the sweet spot.

### Table row left-border pattern

This is a signature interaction: clickable table rows get a 3px transparent left border that turns accent-colored on hover. It creates a directional guide that says "click here to go deeper."

```
Default:  borderLeft: "3px solid transparent"
Hover:    borderLeft: "3px solid #0E9AA7"
```

Account for the 3px in padding-left so content doesn't shift.

---

## Component Patterns

### Accent top-edge gradient

Every page's main container gets a subtle accent gradient at the very top — a 3px tall element with `linear-gradient(90deg, accent, accent40)`. This is barely visible but it frames the container and adds warmth. Inspired by Stripe and Linear's container treatments.

### Sparklines next to metrics

Top-level metrics on the Overview page include a tiny 48×16px SVG sparkline next to the trend text. No axes, no labels — just a 1.5px stroke line showing the last 7 data points. The line color matches the metric's semantic color. An area fill at 10% opacity sits below the line.

### Bar charts (not line charts)

The conversation volume chart uses vertical bars, not a line. Each bar = one hour. Bars have a vertical gradient fill (accent at top → accent at 15% opacity at bottom). The current hour is full accent; past hours are 60% opacity; future hours are 20%. Only the top corners round slightly (`borderRadius: "2px 2px 0 0"`) — this is the only exception to the 0-radius rule.

Horizontal dashed grid lines (`strokeDasharray: "4 4"`) provide reference. Hour labels show every 4th hour. Hover highlights the bar and shows a tooltip with the exact count.

### Workflow breakdown bars

Stacked horizontal progress bars showing resolved/active/escalated distribution per workflow. Height: 7px. A 1px transparent gap between segments. Each segment gets a subtle inner highlight: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)`.

Hover the parent row to see a tooltip: "Resolved: 18 (78%) · In progress: 2 (9%) · Escalated: 3 (13%)"

### Empty states

Never show a blank page. Every empty state has:
- A short, human title (not "No data")
- A helpful subtitle explaining what goes here and how to fill it
- No sad-face icons or decorative illustrations

Examples:
- No conversations match: "Nothing here — No conversations match your filters. Try adjusting or clearing them."
- No KB documents: "No documents yet — Upload SOPs, guides, or operational docs for the AI to reference."
- No escalations: "All clear — the AI handled everything without escalating."

---

## Iconography

SVG stroke icons only. **No emoji anywhere in the UI.** Every icon uses consistent parameters:

- ViewBox: `0 0 24 24`
- Stroke width: 1.8px
- Stroke linecap: round
- Stroke linejoin: round
- Fill: none
- Color: `currentColor` (inherits from parent)

Icons are created as functions that accept `{ size, color }` props. Default size is 16px. The icon system is self-contained — no external icon libraries.

---

## Micro-copy Voice

The dashboard speaks in concise, human language. Not marketing copy. Not developer jargon. Like a competent colleague explaining what's happening.

### Principles

- **Specific over generic**: "127 hours your team didn't have to work this month" beats "Hours saved: 127"
- **Active voice**: "The AI handled everything without escalating" not "No escalations were recorded"
- **Contextual numbers**: "312 drivers rated their experience" not "from 312 ratings"
- **Action-oriented toasts**: "Rule is now active — AI will start using it immediately" not "Rule enabled successfully"

### Toast messages

Toasts confirm actions and explain their effect:
- Rule enabled: "Rule is now active — AI will start using it immediately"
- Takeover: "You're in control now — the driver sees your name"
- Handback: "AI agent resumed — you can jump back in anytime"
- Document uploaded: "Document received — indexing will take a few seconds"

---

## Sidebar

Fixed left, full height. Contains:
1. Logo block: "Agent Cargo" + "ops dashboard" subtitle
2. Navigation items with SVG icons and optional badge counts
3. Footer: "Agent Cargo" + "v1.0" in 10px tertiary text

Active nav item: `borderLeft: 3px solid accent` + accent background + text weight 600.
Inactive: `borderLeft: 3px solid transparent`.
Hover: `surfaceAlt` background.

---

## Page transitions

When navigating between pages, the main content area fades in: `opacity: 0 → 1`, 200ms ease. This is subtle but prevents the jarring "page snap" that makes SPAs feel cheap.

---

## Dot — AI Assistant

Dot is the in-product contextual guide. It appears on every page as a pill-shaped button in the page header: `[● Dot Explains ›]`.

- Pulsing teal orb (20px) with white center dot
- "Dot" in 12px semibold, "Explains" in 10.5px tertiary
- Small chevron arrow after text (10×10, opacity 0.45, turns accent when open)
- Dropdown: 320px wide, right-aligned below button
- 3 contextual tips per page that explain what the user is looking at
- Tips update as the user navigates

Dot is NOT a chatbot. It's a contextual guide. Keep its content practical and page-specific.

---

## What This Product Is NOT

- **Not dark mode.** Light background, white surfaces, subtle borders. This is for ops managers, not developers.
- **Not decorative.** No gradients (except the subtle accent top-edge), no illustrations, no animations beyond hover states and page transitions.
- **Not rounded.** The 0-radius rule exists for a reason. Don't soften edges to "look friendly."
- **Not generic.** This product has personality — in its micro-copy, in its teal accent, in its data-dense layout. It should feel opinionated, not templated.
- **Not a chatbot UI.** The dashboard is about oversight, control, and ROI proof. Chat is one feature, not the product.
