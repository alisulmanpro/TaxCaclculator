'use client';

/**
 * All charts use Recharts, fed with numbers that the calculators computed with
 * lib/tax.ts / lib/salary-history.ts. Charts redraw immediately when inputs change.
 * Each chart has a text summary (aria-label) and the same numbers are always shown
 * in a table or legend next to it, so nothing depends on seeing the chart.
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currency } from "@/lib/tax";
import { ChartTooltip, chartColors, compactAxis, pct } from "./ui";

type Part = { key: string; label: string; value: number; color: string };

/* ─────────────────────────────── "Where your salary goes" (one stacked bar) ─────────────────────────────── */

export function SplitBarChart({ parts, total, summary }: { parts: Part[]; total: number; summary: string }) {
  const row: Record<string, number | string> = { name: "split" };
  for (const p of parts) row[p.key] = p.value;
  return (
    <div className="chart-frame" role="img" aria-label={summary}>
      <ResponsiveContainer width="100%" height={52}>
        <BarChart data={[row]} layout="vertical" margin={{ top: 4, right: 0, bottom: 4, left: 0 }} barCategoryGap={0}>
          <XAxis type="number" hide domain={[0, Math.max(total, 1)]} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            cursor={false}
            wrapperStyle={{ outline: "none", zIndex: 5 }}
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                rows={(payload ?? []).map((item) => {
                  const part = parts.find((p) => p.key === item.dataKey);
                  const value = Number(item.value ?? 0);
                  return {
                    name: part?.label ?? String(item.name),
                    value: `${currency(value)} · ${pct(total > 0 ? (value / total) * 100 : 0)}`,
                    color: part?.color ?? chartColors.keep,
                  };
                })}
              />
            )}
          />
          {parts.map((p) => (
            <Bar
              animationDuration={450}
              key={p.key}
              dataKey={p.key}
              stackId="a"
              fill={p.color}
              barSize={44}
              radius={8}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────────────────────── Two fiscal years side by side ─────────────────────────────── */

export function ComparePairChart({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="chart-block">
      <h4>{title}</h4>
      <div
        className="chart-frame"
        role="img"
        aria-label={`${title}: ${rows.map((r) => `${r.label} ${currency(r.value)}`).join(", ")}`}
      >
        <ResponsiveContainer width="100%" height={rows.length * 56 + 8}>
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 0 }} barCategoryGap={10}>
            <XAxis type="number" hide domain={[0, max * 1.0]} />
            <YAxis
              type="category"
              dataKey="label"
              width={128}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13.5, fill: chartColors.axis }}
            />
            <Tooltip
              cursor={{ fill: "rgba(15,107,76,0.06)" }}
              wrapperStyle={{ outline: "none", zIndex: 5 }}
              content={({ active, payload }) => {
                const item = payload?.[0];
                return (
                  <ChartTooltip
                    active={active}
                    label={item ? String(item.payload.label) : undefined}
                    rows={item ? [{ name: title, value: currency(Number(item.value)), color: item.payload.color }] : []}
                  />
                );
              }}
            />
            <Bar animationDuration={450} dataKey="value" barSize={28} radius={[0, 8, 8, 0]} background={{ fill: "#EAF1EC", radius: 8 }}>
              {rows.map((r) => (
                <Cell key={r.label} fill={r.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="legend" style={{ marginTop: 4 }}>
        {rows.map((r) => (
          <li key={r.label} className="legend-item" style={{ listStyle: "none" }}>
            <span className="dot" style={{ background: r.color }} />
            <span style={{ fontWeight: 600 }}>{r.label}</span>
            <span className="val">{currency(r.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────── Tax in every fiscal year ─────────────────────────────── */

export type YearBar = { label: string; tax: number; effective: number; role: "selected" | "compare" | "other" };

const roleColor = { selected: chartColors.keep, compare: chartColors.old, other: "#C5D6CB" } as const;

export function YearsColumnChart({ data }: { data: YearBar[] }) {
  return (
    <div
      className="chart-frame"
      role="img"
      aria-label={`Tax on the same income in each fiscal year: ${data.map((d) => `${d.label} ${currency(d.tax)}`).join(", ")}`}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={chartColors.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#9DB3A6" }} tick={{ fontSize: 12.5, fill: chartColors.axis }} interval={0} />
          <YAxis tickLine={false} axisLine={false} width={52} tickFormatter={compactAxis} tick={{ fontSize: 12.5, fill: chartColors.axis }} />
          <Tooltip
            cursor={{ fill: "rgba(15,107,76,0.06)" }}
            wrapperStyle={{ outline: "none", zIndex: 5 }}
            content={({ active, payload }) => {
              const item = payload?.[0];
              if (!item) return null;
              const d = item.payload as YearBar;
              return (
                <ChartTooltip
                  active={active}
                  label={`FY ${d.label}`}
                  rows={[
                    { name: "Tax", value: currency(d.tax), color: roleColor[d.role] },
                    { name: "Effective rate", value: pct(d.effective), color: roleColor[d.role] },
                  ]}
                />
              );
            }}
          />
          <Bar animationDuration={450} dataKey="tax" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((d) => (
              <Cell key={d.label} fill={roleColor[d.role]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────────────────────── Tax from each band ─────────────────────────────── */

export type BandBar = { rate: string; range: string; income: number; tax: number; top: boolean };

export function BandTaxChart({ data }: { data: BandBar[] }) {
  return (
    <div
      className="chart-frame"
      role="img"
      aria-label={`Tax from each band: ${data.map((d) => `${d.rate} band ${currency(d.tax)}`).join(", ")}`}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 22, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={chartColors.grid} />
          <XAxis dataKey="rate" tickLine={false} axisLine={{ stroke: "#9DB3A6" }} tick={{ fontSize: 13, fill: chartColors.axis }} />
          <YAxis tickLine={false} axisLine={false} width={52} tickFormatter={compactAxis} tick={{ fontSize: 12.5, fill: chartColors.axis }} />
          <Tooltip
            cursor={{ fill: "rgba(15,107,76,0.06)" }}
            wrapperStyle={{ outline: "none", zIndex: 5 }}
            content={({ active, payload }) => {
              const item = payload?.[0];
              if (!item) return null;
              const d = item.payload as BandBar;
              return (
                <ChartTooltip
                  active={active}
                  label={`${d.rate} band · ${d.range}`}
                  rows={[
                    { name: "Your income here", value: currency(d.income), color: chartColors.old },
                    { name: "Tax", value: currency(d.tax), color: chartColors.tax },
                  ]}
                />
              );
            }}
          />
          <Bar animationDuration={450} dataKey="tax" radius={[6, 6, 0, 0]} maxBarSize={72}>
            {data.map((d) => (
              <Cell key={d.rate + d.range} fill={d.top ? chartColors.keep : chartColors.tax} />
            ))}
            <LabelList dataKey="tax" position="top" formatter={(v) => compactAxis(Number(v))} style={{ fontSize: 12.5, fill: chartColors.axis }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────────────────────── Multi-year: net + tax per fiscal year ─────────────────────────────── */

export type FyStack = { label: string; gross: number; tax: number; net: number };

export function FyStackChart({ data }: { data: FyStack[] }) {
  return (
    <div
      className="chart-frame"
      role="img"
      aria-label={`Gross income split into net and tax for each fiscal year: ${data
        .map((d) => `FY ${d.label} gross ${currency(d.gross)}, tax ${currency(d.tax)}, net ${currency(d.net)}`)
        .join("; ")}`}
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={chartColors.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#9DB3A6" }} tick={{ fontSize: 13.5, fill: "#10201A", fontWeight: 600 }} tickFormatter={(v) => `FY ${v}`} interval={0} />
          <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={compactAxis} tick={{ fontSize: 12.5, fill: chartColors.axis }} />
          <Tooltip
            cursor={{ fill: "rgba(15,107,76,0.06)" }}
            wrapperStyle={{ outline: "none", zIndex: 5 }}
            content={({ active, payload }) => {
              const item = payload?.[0];
              if (!item) return null;
              const d = item.payload as FyStack;
              return (
                <ChartTooltip
                  active={active}
                  label={`FY ${d.label}`}
                  rows={[
                    { name: "Gross", value: currency(d.gross), color: "#9DB3A6" },
                    { name: "You keep", value: `${currency(d.net)} · ${pct(d.gross > 0 ? (d.net / d.gross) * 100 : 0)}`, color: chartColors.keep },
                    { name: "Tax", value: `${currency(d.tax)} · ${pct(d.gross > 0 ? (d.tax / d.gross) * 100 : 0)}`, color: chartColors.tax },
                  ]}
                />
              );
            }}
          />
          <Bar animationDuration={450} dataKey="net" name="You keep" stackId="fy" fill={chartColors.keep} maxBarSize={110} stroke="#fff" strokeWidth={1} />
          <Bar animationDuration={450} dataKey="tax" name="Tax" stackId="fy" fill={chartColors.tax} radius={[6, 6, 0, 0]} maxBarSize={110} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
