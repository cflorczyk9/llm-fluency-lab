// Dashboard charts and shared visual helpers.
//
// recharts RadarChart (per-category fluency) and LineChart (overall fluency over
// time). Colors are resolved to literal hex from the "Briefly light" tokens so
// they render reliably as SVG attributes (CSS var() is not dependable inside
// SVG presentation attributes across browsers).

import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Palette ported from src/styles/tokens.css (literal hex for SVG).
export const C = {
  bg: '#f7f3ea',
  panel: '#ffffff',
  panel2: '#efe9da',
  ink: '#1c1d1f',
  muted: '#6b7280',
  line: '#e6dfce',
  accent: '#2f8cff',
  accentDeep: '#0b5394',
  green: '#1f7a50',
  gold: '#d97706',
  gap: '#dc2626',
} as const;

// ---- shared fluency vocabulary (ported from the original single-file app) ----

export function fluLabel(v: number): string {
  if (v >= 80) return 'fluent';
  if (v >= 60) return 'solid';
  if (v >= 40) return 'developing';
  if (v >= 20) return 'early';
  return 'just getting started';
}

// Color a 0..100 fluency: red where low, gold mid, blue building, green fluent.
export function fluColor(v: number): string {
  if (v >= 70) return C.green;
  if (v >= 45) return C.accent;
  if (v >= 25) return C.gold;
  return C.gap;
}

// 'YYYY-MM-DD' -> 'M/D' for compact axis labels.
export function fmtDate(ds: string): string {
  const p = ds.split('-');
  if (p.length < 3) return ds;
  return `${Number(p[1])}/${Number(p[2])}`;
}

// ---------------------------------------------------------------------------

export interface RadarDatum {
  key: string;
  label: string; // short name for the spoke
  full: string; // full category name (tooltip)
  value: number; // 0..100
}

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: RadarDatum;
}

// Each radar vertex is colored by that category's fluency.
function FluencyDot({ cx, cy, payload }: DotProps) {
  if (cx == null || cy == null || !payload) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={fluColor(payload.value)}
      stroke="#ffffff"
      strokeWidth={1.5}
    />
  );
}

const tooltipStyle: React.CSSProperties = {
  background: C.panel,
  border: `1px solid ${C.line}`,
  borderRadius: 10,
  fontSize: 12,
  color: C.ink,
  boxShadow: '0 1px 2px rgba(28,29,31,.08)',
};

export function FluencyRadar({ data }: { data: RadarDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} outerRadius="72%" margin={{ top: 8, right: 28, bottom: 8, left: 28 }}>
        <PolarGrid stroke={C.line} />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: C.muted }}
          tickLine={false}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Fluency"
          dataKey="value"
          stroke={C.accentDeep}
          strokeWidth={2}
          fill={C.accent}
          fillOpacity={0.14}
          dot={<FluencyDot />}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${Math.round(Number(value))}/100`, 'Fluency']}
          labelFormatter={(_label, p) => {
            const first = Array.isArray(p) ? p[0] : undefined;
            const d = first?.payload as RadarDatum | undefined;
            return d ? d.full : '';
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export interface TrendDatum {
  date: string; // YYYY-MM-DD
  fluency: number; // 0..100
}

export function FluencyTrend({ data }: { data: TrendDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 14, bottom: 4, left: -16 }}>
        <CartesianGrid stroke={C.line} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={fmtDate}
          tick={{ fontSize: 10, fill: C.muted }}
          tickLine={false}
          axisLine={{ stroke: C.line }}
          minTickGap={24}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tick={{ fontSize: 10, fill: C.muted }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${Math.round(Number(value))}/100`, 'Fluency']}
          labelFormatter={(label) => fmtDate(String(label))}
        />
        <Line
          type="monotone"
          dataKey="fluency"
          stroke={C.green}
          strokeWidth={2}
          dot={{ r: 2.5, fill: C.green, strokeWidth: 0 }}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
