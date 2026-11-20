# TaxCalculato.com — Design System (design.md)

Pakistan Salary & Income Tax Calculator. Tone: calm, trustworthy, plain-spoken. "Clarity. Confidence. Peace of mind."

## Pages
1. **Single Year** — one fiscal year, one monthly salary.
2. **Multi-Year** — salary history as dated periods across fiscal years (Jul–Jun).
Both share: header, hero, calculator card with a Single Year / Multi-Year tab switcher, quote card, guides, FAQ, official resources, consultation CTA, footer.

## Color
| Token | Hex | Use |
|---|---|---|
| forest | #0F3D2E | page ground, hero, result hero card |
| forest-deep | #0A2E22 | footer |
| cream | #F6F4EE | cards, quote, CTA |
| white | #FFFFFF | header, calculator body, tiles |
| ink | #14261D | text on light |
| muted | #4F5D55 | secondary text on light |
| muted-dark | #A9C7B8 | secondary text on forest |
| accent | #08794D | primary button, links, "kept" bars (white text passes 4.5:1) |
| accent-text | #065F3D | eyebrows/labels on mint |
| mint | #E3F5EC / border #B7E2CC | breakdown cards, badges, savings |
| tax | #C4705A (text #A3452E) | tax amounts and tax bars |
| eyebrow-on-dark | #8FD5B3 | section eyebrows |
| line | #DDE3DF / #AEB9B2 | dividers / input borders |

## Typography
DM Sans (400/500/600/700). H1 52px/1.08, -0.02em, bold. H2 32–40px (cards 20px). Body 15–16px/1.6. Eyebrow 11px, uppercase, +0.14em, bold. Numbers: 44px hero figure, 20px tile values.

## Layout & spacing
Container max 1040px, 24px side padding. Section gap 56px. Card radius 20px, inner cards 12–16px, buttons/inputs 10px. Grids use auto-fit/minmax so everything stacks on phones. Calculator body: 2 columns (inputs | results), stacks under ~700px.

## Components
- **Header:** white bar, logo left, 5 links (About, Disputes, International, Rates & Fees, Contact), black pill "Consultation ↗".
- **Hero:** eyebrow with dash, bold centered H1, one-line subcopy.
- **Tab switcher:** pill group on a beige track; active tab white with green text.
- **Inputs:** 48px high, 1px border, visible label above, 2px green focus ring. Date inputs for periods.
- **Additional fields (optional):** expandable; annual bonus, monthly deductions, tax already withheld.
- **Primary / ghost buttons:** 46px; primary green, ghost outlined; dashed ghost for "Add another period".
- **Result hero card:** forest, big tax figure, effective + marginal rate line.
- **Mint breakdown cards:** Monthly and Annual (gross, tax in terracotta, net).
- **Savings strip:** outlined mint, "Tax saving" eyebrow, per-month and per-year difference vs a chosen fiscal year.
- **Stat tiles:** effective rate, take-home share, net/month, tax withheld gap.
- **Insights tabs:** Overview, Fiscal year comparison, Tax bands. Overview holds the cash-flow bars and the "For every Rs. 100 earned" split bar.
- **Multi-Year period card:** numbered, start/end date, monthly salary, optional fields, Remove.
- **Multi-Year results:** total tax hero, gross/net cards, fiscal-year table with total row, tax vs take-home bar per year.
- **Actions:** Download PDF, Copy shareable link, Hide insights.
- **Quote card, article cards (3), FAQ accordion (6 questions), resource cards (FBR, Iris, Pakistan Code), CTA card, footer with disclaimer.**

## Content rules
- Currency is "Rs." with thousands separators; show example figures with an "Example figures" badge.
- Never present estimates as advice; keep the disclaimer next to results and in the footer.
- Calculations are private and browser-only.

## Accessibility
Real labels, buttons and links; 44px+ touch targets on actions; text contrast ≥4.5:1; chart bars carry aria-labels and never rely on color alone (values are printed beside them).

## States to build
Empty (zero salary), invalid/overlapping dates (inline error under the period), loading-free instant calculation, results hidden ("Hide insights"), tab changes without page reload.
