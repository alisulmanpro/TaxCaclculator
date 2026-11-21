/**
 * PDF reports. This file is only ever loaded with `import()` after the user clicks
 * "Download PDF", so the PDF library is not part of the normal page bundle.
 *
 * It only formats numbers that the calculators already computed with lib/tax.ts and
 * lib/salary-history.ts. It never calculates tax itself.
 */
import {
  type DocumentProps,
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { currency, type TaxBand } from "@/lib/tax";

const C = {
  green: "#0F6B4C",
  forest: "#0B3D2E",
  forestCard: "#12503E",
  mint: "#E1F0E8",
  ink: "#10201A",
  muted: "#4B5C54",
  line: "#DDE7E0",
  amber: "#B7791F",
  amberOnDark: "#F0B84B",
  onDark: "#BBD6C8",
};

const s = StyleSheet.create({
  page: { padding: 36, fontFamily: "Helvetica", fontSize: 10, color: C.ink, lineHeight: 1.4 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  logo: { height: 38, width: 111 },
  brand: { fontSize: 15, fontFamily: "Helvetica-Bold", color: C.green },
  generated: { fontSize: 9, color: C.muted, textAlign: "right" },
  title: { fontSize: 19, lineHeight: 1.2, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  subtitle: { fontSize: 10.5, lineHeight: 1.4, color: C.muted, marginBottom: 14 },
  hero: { backgroundColor: C.forest, borderRadius: 10, padding: 16, marginBottom: 12 },
  heroLabel: { color: C.onDark, fontSize: 10 },
  heroNum: { color: "#FFFFFF", fontSize: 28, lineHeight: 1.2, fontFamily: "Helvetica-Bold", marginTop: 4, marginBottom: 6 },
  heroSub: { color: C.onDark, fontSize: 10 },
  statRow: { flexDirection: "row", marginBottom: 12 },
  stat: { flex: 1, backgroundColor: C.mint, borderRadius: 8, padding: 10, marginRight: 8 },
  statLast: { marginRight: 0 },
  statLabel: { fontSize: 8.5, color: C.muted },
  statValue: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 2 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 6 },
  tHead: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.ink, paddingBottom: 4 },
  tRow: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: C.line },
  tTotal: { flexDirection: "row", paddingVertical: 6, borderTopWidth: 1, borderTopColor: C.ink },
  th: { fontSize: 8.5, color: C.muted, fontFamily: "Helvetica-Bold" },
  td: { fontSize: 9.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  tax: { color: C.amber },
  barWrap: { flexDirection: "row", height: 14, borderRadius: 4, overflow: "hidden", marginTop: 4, marginBottom: 6 },
  legendRow: { flexDirection: "row", marginBottom: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  dot: { width: 8, height: 8, borderRadius: 2, marginRight: 5 },
  note: { marginTop: 14, fontSize: 8.5, color: C.muted, lineHeight: 1.5 },
  linkBox: { marginTop: 10, padding: 8, backgroundColor: "#F3F6F3", borderRadius: 6 },
  linkLabel: { fontSize: 8, color: C.muted, marginBottom: 2 },
  linkText: { fontSize: 7.5, color: C.green },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: C.muted },
});

/* ──────────────────────────────────────── shared blocks ──────────────────────────────────────── */

type Cell = { text: string; w: number; align?: "left" | "right"; bold?: boolean; tax?: boolean };

function Row({ cells, style }: { cells: Cell[]; style?: typeof s.tRow | typeof s.tTotal }) {
  return (
    <View style={style ?? s.tRow} wrap={false}>
      {cells.map((c, i) => (
        <Text
          key={i}
          style={[
            s.td,
            { width: `${c.w}%`, textAlign: c.align ?? "left" },
            c.bold ? s.bold : {},
            c.tax ? s.tax : {},
          ]}
        >
          {c.text}
        </Text>
      ))}
    </View>
  );
}

function HeadRow({ cells }: { cells: Cell[] }) {
  return (
    <View style={s.tHead} wrap={false}>
      {cells.map((c, i) => (
        <Text key={i} style={[s.th, { width: `${c.w}%`, textAlign: c.align ?? "left" }]}>
          {c.text}
        </Text>
      ))}
    </View>
  );
}

function Header({ logoUrl, generated }: { logoUrl: string | null; generated: string }) {
  return (
    <View style={s.header}>
      {/* react-pdf Image (not an HTML img): it has no alt attribute */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      {logoUrl ? <Image src={logoUrl} style={s.logo} /> : <Text style={s.brand}>Tax Calculator</Text>}
      <Text style={s.generated}>Generated {generated}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text>General estimate only. Not tax advice.</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function SplitBar({ parts }: { parts: { label: string; value: number; color: string; text: string }[] }) {
  const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;
  return (
    <View>
      <View style={s.barWrap}>
        {parts.map((p) => (
          <View key={p.label} style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }} />
        ))}
      </View>
      <View style={s.legendRow}>
        {parts.map((p) => (
          <View key={p.label} style={s.legendItem}>
            <View style={[s.dot, { backgroundColor: p.color }]} />
            <Text style={{ fontSize: 9 }}>
              {p.label}: {p.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ShareLink({ url }: { url: string }) {
  return (
    <View style={s.linkBox}>
      <Text style={s.linkLabel}>Open these exact numbers again (shareable link)</Text>
      <Text style={s.linkText}>{url}</Text>
    </View>
  );
}

const NOTE =
  "Estimates apply the salaried-person income tax schedule of each fiscal year to the figures you entered. " +
  "They exclude special reliefs, tax credits, other income and super tax. Monthly figures are the annual " +
  "figure divided by 12. This report is not tax advice; confirm your liability with FBR or a tax professional.";

const pctText = (n: number) => `${+n.toFixed(2)}%`;
const bandLabel = (b: TaxBand, isLast: boolean) =>
  b.lower === 0
    ? `Up to ${currency(b.upper)}`
    : isLast || !Number.isFinite(b.upper)
      ? `Above ${currency(b.lower)}`
      : `${currency(b.lower + 1)} - ${currency(b.upper)}`;

/* ───────────────────────────────────────── single year ───────────────────────────────────────── */

export type SingleReport = {
  generated: string;
  shareUrl: string;
  yearLabel: string;
  monthlySalary: number;
  annualBonus: number;
  monthlyDeductions: number;
  taxWithheld: number;
  annualGross: number;
  monthlyGross: number;
  annualTax: number;
  monthlyTax: number;
  annualNet: number;
  monthlyNet: number;
  effective: number;
  marginal: number;
  taxStillDue: number;
  baseTax: number;
  surcharge: number;
  bands: TaxBand[];
  comparison: { label: string; tax: number; diff: number } | null;
  allYears: { label: string; tax: number; effective: number; selected: boolean }[];
};

function SingleDoc({ r, logoUrl }: { r: SingleReport; logoUrl: string | null }) {
  const deductionsYear = r.monthlyDeductions * 12;
  const activeBands = r.bands.filter((b) => b.income > 0);
  return (
    <Document title={`Salary tax report FY ${r.yearLabel}`} author="Tax Calculator" language="en">
      <Page size="A4" style={s.page}>
        <Header logoUrl={logoUrl} generated={r.generated} />
        <Text style={s.title}>Salary tax report</Text>
        <Text style={s.subtitle}>
          Pakistan salaried-person income tax, FY {r.yearLabel}. Monthly salary {currency(r.monthlySalary)}.
        </Text>

        <View style={s.hero}>
          <Text style={s.heroLabel}>Annual tax due - FY {r.yearLabel}</Text>
          <Text style={s.heroNum}>{currency(r.annualTax)}</Text>
          <Text style={s.heroSub}>
            Effective rate {pctText(r.effective)} | Marginal rate {pctText(r.marginal)}
          </Text>
        </View>

        <View style={s.statRow}>
          <View style={s.stat}>
            <Text style={s.statLabel}>Net per month</Text>
            <Text style={s.statValue}>{currency(r.monthlyNet)}</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statLabel}>Net per year</Text>
            <Text style={s.statValue}>{currency(r.annualNet)}</Text>
          </View>
          <View style={[s.stat, s.statLast]}>
            <Text style={s.statLabel}>Tax still due</Text>
            <Text style={s.statValue}>{currency(r.taxStillDue)}</Text>
          </View>
        </View>

        <Text style={s.h2}>Where your salary goes</Text>
        <SplitBar
          parts={[
            { label: "Take-home", value: r.annualNet, color: C.green, text: currency(r.annualNet) },
            { label: "Tax", value: r.annualTax, color: C.amber, text: currency(r.annualTax) },
            ...(deductionsYear > 0
              ? [{ label: "Deductions", value: Math.max(0, r.annualGross - r.annualTax - r.annualNet), color: "#6F8B7D", text: currency(Math.max(0, r.annualGross - r.annualTax - r.annualNet)) }]
              : []),
          ]}
        />

        <Text style={s.h2}>Monthly and annual breakdown</Text>
        <HeadRow cells={[{ text: "Rs.", w: 40 }, { text: "Monthly", w: 30, align: "right" }, { text: "Annual", w: 30, align: "right" }]} />
        <Row cells={[{ text: "Gross income", w: 40 }, { text: currency(r.monthlyGross), w: 30, align: "right" }, { text: currency(r.annualGross), w: 30, align: "right" }]} />
        {r.annualBonus > 0 && (
          <Row cells={[{ text: "  of which annual bonus", w: 40 }, { text: "-", w: 30, align: "right" }, { text: currency(r.annualBonus), w: 30, align: "right" }]} />
        )}
        <Row cells={[{ text: "Income tax", w: 40 }, { text: currency(r.monthlyTax), w: 30, align: "right", tax: true }, { text: currency(r.annualTax), w: 30, align: "right", tax: true }]} />
        {r.monthlyDeductions > 0 && (
          <Row cells={[{ text: "Deductions", w: 40 }, { text: currency(r.monthlyDeductions), w: 30, align: "right" }, { text: currency(deductionsYear), w: 30, align: "right" }]} />
        )}
        {r.taxWithheld > 0 && (
          <Row cells={[{ text: "Tax already withheld", w: 40 }, { text: "-", w: 30, align: "right" }, { text: currency(r.taxWithheld), w: 30, align: "right" }]} />
        )}
        <Row
          style={s.tTotal}
          cells={[{ text: "Net income", w: 40, bold: true }, { text: currency(r.monthlyNet), w: 30, align: "right", bold: true }, { text: currency(r.annualNet), w: 30, align: "right", bold: true }]}
        />

        {r.comparison && (
          <>
            <Text style={s.h2}>Compared with FY {r.comparison.label}</Text>
            <Text style={{ fontSize: 10 }}>
              {Math.abs(r.comparison.diff) < 0.005
                ? `Same tax in both years (${currency(r.annualTax)}).`
                : r.comparison.diff > 0
                  ? `FY ${r.yearLabel} has ${currency(r.comparison.diff)} less tax per year than FY ${r.comparison.label} (${currency(r.comparison.tax)}).`
                  : `FY ${r.yearLabel} has ${currency(-r.comparison.diff)} more tax per year than FY ${r.comparison.label} (${currency(r.comparison.tax)}).`}
            </Text>
          </>
        )}

        <ShareLink url={r.shareUrl} />
        <Footer />
      </Page>

      <Page size="A4" style={s.page}>
        <Header logoUrl={logoUrl} generated={r.generated} />
        <Text style={s.h2}>Your tax, band by band - FY {r.yearLabel}</Text>
        <Text style={{ fontSize: 9.5, color: C.muted, marginBottom: 6 }}>
          Yearly income of {currency(r.annualGross)}. Each part of your income is taxed at its own rate.
        </Text>
        <HeadRow cells={[{ text: "Yearly income band", w: 44 }, { text: "Rate", w: 12, align: "right" }, { text: "Your income here", w: 24, align: "right" }, { text: "Tax", w: 20, align: "right" }]} />
        {activeBands.map((b, i) => (
          <Row
            key={`${b.lower}-${i}`}
            cells={[
              { text: bandLabel(b, !Number.isFinite(b.upper)), w: 44 },
              { text: pctText(b.rate), w: 12, align: "right" },
              { text: currency(b.income), w: 24, align: "right" },
              { text: currency(b.tax), w: 20, align: "right", tax: true },
            ]}
          />
        ))}
        {r.surcharge > 0 && (
          <Row cells={[{ text: "Surcharge on income above Rs. 10,000,000", w: 80 }, { text: currency(r.surcharge), w: 20, align: "right", tax: true }]} />
        )}
        <Row
          style={s.tTotal}
          cells={[{ text: "Total tax for the year", w: 80, bold: true }, { text: currency(r.annualTax), w: 20, align: "right", bold: true }]}
        />

        <Text style={s.h2}>The same income in every fiscal year</Text>
        <HeadRow cells={[{ text: "Fiscal year", w: 40 }, { text: "Annual tax", w: 30, align: "right" }, { text: "Effective rate", w: 30, align: "right" }]} />
        {r.allYears.map((y) => (
          <Row
            key={y.label}
            cells={[
              { text: `FY ${y.label}${y.selected ? "  (selected)" : ""}`, w: 40, bold: y.selected },
              { text: currency(y.tax), w: 30, align: "right", bold: y.selected },
              { text: pctText(y.effective), w: 30, align: "right", bold: y.selected },
            ]}
          />
        ))}

        <Text style={s.note}>{NOTE}</Text>
        <Footer />
      </Page>
    </Document>
  );
}

/* ───────────────────────────────────────── multi year ───────────────────────────────────────── */

export type MultiReport = {
  generated: string;
  shareUrl: string;
  totalTax: number;
  totalGross: number;
  totalNet: number;
  totalMonths: number;
  avgRate: number;
  years: { label: string; gross: number; tax: number; net: number }[];
  periods: {
    n: number;
    dates: string;
    salary: number;
    bonus: number;
    deductions: number;
    fiscalYears: string;
  }[];
};

function MultiDoc({ r, logoUrl }: { r: MultiReport; logoUrl: string | null }) {
  return (
    <Document title="Multi-year salary tax report" author="Tax Calculator" language="en">
      <Page size="A4" style={s.page}>
        <Header logoUrl={logoUrl} generated={r.generated} />
        <Text style={s.title}>Multi-year salary tax report</Text>
        <Text style={s.subtitle}>
          Pakistan salaried-person income tax across {r.periods.length} salary {r.periods.length === 1 ? "period" : "periods"}.
        </Text>

        <View style={s.hero}>
          <Text style={s.heroLabel}>
            Total tax across {r.periods.length} {r.periods.length === 1 ? "period" : "periods"}
          </Text>
          <Text style={s.heroNum}>{currency(r.totalTax)}</Text>
          <Text style={s.heroSub}>
            {r.totalMonths} months | Average effective rate {r.avgRate.toFixed(1)}%
          </Text>
        </View>

        <View style={s.statRow}>
          <View style={s.stat}>
            <Text style={s.statLabel}>Total gross income</Text>
            <Text style={s.statValue}>{currency(r.totalGross)}</Text>
          </View>
          <View style={[s.stat, s.statLast]}>
            <Text style={s.statLabel}>Total net income</Text>
            <Text style={s.statValue}>{currency(r.totalNet)}</Text>
          </View>
        </View>

        <Text style={s.h2}>Tax vs take-home by fiscal year</Text>
        {r.years.map((y) => (
          <View key={y.label} wrap={false} style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 9, marginBottom: 1 }}>
              FY {y.label} - {y.gross > 0 ? pctText((y.tax / y.gross) * 100) : "0%"} tax
            </Text>
            <SplitBar
              parts={[
                { label: "Net", value: y.net, color: C.green, text: currency(y.net) },
                { label: "Tax", value: y.tax, color: C.amber, text: currency(y.tax) },
              ]}
            />
          </View>
        ))}

        <Text style={s.h2}>Fiscal year breakdown</Text>
        <HeadRow cells={[{ text: "Fiscal year", w: 25 }, { text: "Gross", w: 25, align: "right" }, { text: "Tax", w: 25, align: "right" }, { text: "Net", w: 25, align: "right" }]} />
        {r.years.map((y) => (
          <Row
            key={y.label}
            cells={[
              { text: `FY ${y.label}`, w: 25, bold: true },
              { text: currency(y.gross), w: 25, align: "right" },
              { text: currency(y.tax), w: 25, align: "right", tax: true },
              { text: currency(y.net), w: 25, align: "right" },
            ]}
          />
        ))}
        <Row
          style={s.tTotal}
          cells={[
            { text: "Total", w: 25, bold: true },
            { text: currency(r.totalGross), w: 25, align: "right", bold: true },
            { text: currency(r.totalTax), w: 25, align: "right", bold: true },
            { text: currency(r.totalNet), w: 25, align: "right", bold: true },
          ]}
        />

        <Text style={s.h2}>Your salary periods</Text>
        <HeadRow cells={[{ text: "Period", w: 12 }, { text: "Dates", w: 36 }, { text: "Monthly salary", w: 20, align: "right" }, { text: "Bonus / deductions", w: 20, align: "right" }, { text: "FY", w: 12, align: "right" }]} />
        {r.periods.map((p) => (
          <Row
            key={p.n}
            cells={[
              { text: String(p.n), w: 12, bold: true },
              { text: p.dates, w: 36 },
              { text: currency(p.salary), w: 20, align: "right" },
              { text: `${currency(p.bonus)} / ${currency(p.deductions)}`, w: 20, align: "right" },
              { text: p.fiscalYears, w: 12, align: "right" },
            ]}
          />
        ))}

        <ShareLink url={r.shareUrl} />
        <Text style={s.note}>{NOTE}</Text>
        <Footer />
      </Page>
    </Document>
  );
}

/* ──────────────────────────────────────────── entry points ──────────────────────────────────────────── */

async function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** The logo is optional: if it cannot be loaded the report still renders with a text brand. */
async function render(make: (logoUrl: string | null) => React.ReactElement<DocumentProps>, origin: string) {
  try {
    return await pdf(make(`${origin}/logo.png`)).toBlob();
  } catch {
    return await pdf(make(null)).toBlob();
  }
}

export async function downloadSingleReport(report: SingleReport) {
  const blob = await render(
    (logoUrl) => <SingleDoc r={report} logoUrl={logoUrl} />,
    window.location.origin
  );
  await saveBlob(blob, `salary-tax-fy-${report.yearLabel.replace(/\D+/g, "-")}.pdf`);
}

export async function downloadMultiReport(report: MultiReport) {
  const blob = await render(
    (logoUrl) => <MultiDoc r={report} logoUrl={logoUrl} />,
    window.location.origin
  );
  await saveBlob(blob, "multi-year-salary-tax.pdf");
}
