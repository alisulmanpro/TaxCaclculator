# design-ref

Reference designs for the green redesign of the Pakistan Salary & Income Tax Calculator.
Nothing in this folder is imported by the app (it is excluded from `tsconfig.json`);
it only documents what the UI should look like.

```
design-ref/
├── logo-original.png      Full-size logo (transparent PNG). Optimised copy: public/logo.png
├── source/                Design canvas sources (4 artboards)
│   ├── canvas.json            Board positions / titles
│   ├── Main.dc.html           1 · Single year (empty state)
│   ├── Single-year-result.dc.html   2 · Single year · result + insights
│   ├── Multi-year.dc.html           3 · Multi-year (empty state)
│   └── Multi-year-result.dc.html    4 · Multi-year · result + insights
└── README.md
```

> The `.dc.html` files are design-canvas boards. Open them in the design canvas tool to
> see them rendered; they are also readable as plain HTML/CSS if you need an exact value
> (every colour, size and spacing is written inline).

## Design tokens

| Token | Value | Use |
|---|---|---|
| Primary green | `#0F6B4C` | buttons, links, active tab, "take-home" bars |
| Primary hover | `#0B5139` | hover / pressed |
| Forest | `#0B3D2E` | result panel, footer |
| Forest card | `#12503E` | cards inside the result panel |
| Mint | `#E1F0E8` / `#EAF1EC` | pills, tab track, field prefix |
| Page background | `#F3F6F3` | page |
| Border | `#DDE7E0` (cards) · `#7F978B` (inputs) | |
| Ink / muted | `#10201A` / `#4B5C54` | text |
| Tax amber | `#B7791F` (on dark: `#F0B84B`) | every tax amount and tax bar |
| Light green on dark | `#8FDDBB` | labels and highlights on forest |
| Focus ring | 3px `#0F6B4C` (on forest: `#8FDDBB`) | `:focus-visible` |

**Fonts:** Space Grotesk (headings, big numbers) and Inter (everything else).
**Radius:** card 24px · inner cards 14–18px · inputs/buttons 12px.
**Sizes:** inputs 56–60px high, buttons 56px, minimum 16px body text, big salary input 22px.
**Layout:** max width 1200px, 24px side padding. The calculator is a form column (left) and a
forest result column (right) that stack on narrow screens; Insights is a full-width section below.

## Behaviour that must not change (see `AGENTS.md`)

- Salary fields start empty; results stay hidden (empty-state panel) until there is a valid salary.
- Single year: insights hidden by default; the toggle lives in the Insights header.
- Multi-year: needs "Calculate taxes"; editing inputs afterwards hides the stale result.
- The tax numbers come only from `lib/tax.ts` and `lib/salary-history.ts`.

## Sample numbers used in the boards

Rs. 200,000 / month: FY 2025–26 tax = Rs. 162,000 (6.75 %), FY 2024–25 tax = Rs. 230,000.
These match the real engine, so they are safe to use in tests and screenshots.
