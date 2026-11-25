# Agent Rules & Architecture Reference

This file serves as a root reference for agent instructions. Detailed architecture instructions and rules are documented in [AGENTS.md](file:///h:/On-going%20Projects/TaxCaclculator/AGENTS.md) and [MEMORY.md](file:///h:/On-going%20Projects/TaxCaclculator/MEMORY.md).

## Footer Architecture
The site footer (`app/components/layout/Footer.tsx`) uses a 4-column arrangement on brand forest green:
1. Column 1: Logo, brand description, "Subscribe to Tax Updates" newsletter form, and tax disclaimer.
2. Column 2: TAX GUIDES with green bullet links (`/tax-guides/income-tax-slabs`, `/tax-guides/tax-deductions-and-credits`, `/tax-guides/filing-your-tax-return`, FBR, IRIS).
3. Column 3: USEFUL LINKS with green bullet links (`/about`, `/contact`, `/#faqs`, `/blog`, `/terms-of-use`, `/privacy-policy`, `/#tax-slabs`).
4. Column 4: CONTACT US (Location: Pakistan, Email: `contact@findtaxcalculator.com`, Service Area: All Pakistan Provinces, Support link).
Bottom bar: Dynamic current year copyright and "Designed with ❤️ in Pakistan". All routes are working, functional, and statically prerendered.
