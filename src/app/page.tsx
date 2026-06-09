'use client';

import { useState } from 'react';
import { Play, Sparkles, MoreHorizontal, ArrowUpRight, Flag } from 'lucide-react';

const velocity = [
  { d: "Mon", v: 12 }, { d: "Tue", v: 18 }, { d: "Wed", v: 15 },
  { d: "Thu", v: 22 }, { d: "Fri", v: 28 }, { d: "Sat", v: 24 }, { d: "Sun", v: 31 },
];

const initialTasks = [
  { id: 1, text: "Review Q4 brand strategy deck", project: "Brand", done: false },
  { id: 2, text: "Approve creative for Tet campaign", project: "Marketing", done: false },
  { id: 3, text: "Sync with engineering on AI pipeline", project: "Product", done: true },
  { id: 4, text: "Sign off on partnership MOU", project: "BD", done: false },
  { id: 5, text: "Send weekly investor update", project: "Ops", done: false },
];

function Rings() {
  const rings = [
    { c: "#34c759", pct: 82, r: 38 },
    { c: "#ff9f0a", pct: 67, r: 28 },
    { c: "#ff375f", pct: 74, r: 18 },
  ];
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {rings.map((r) => {
        const circ = 2 * Math.PI * r.r;
        return (
          <g key={r.r} transform="rotate(-90 50 50)">
            <circle cx="50" cy="50" r={r.r} stroke={r.c} strokeOpacity="0.15" strokeWidth="6" fill="none" />
            <circle cx="50" cy="50" r={r.r} stroke={r.c} strokeWidth="6" fill="none"
              strokeDasharray={`${(circ * r.pct) / 100} ${circ}`} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

/* Simple sparkline chart rendered with SVG (no recharts dependency needed) */
function VelocityChart() {
  const maxV = Math.max(...velocity.map(d => d.v));
  const height = 120;
  const width = 300;
  const padding = { top: 10, right: 10, bottom: 24, left: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = velocity.map((d, i) => ({
    x: padding.left + (i / (velocity.length - 1)) * chartW,
    y: padding.top + chartH - (d.v / maxV) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="velGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5ac8fa" />
          <stop offset="100%" stopColor="#0a84ff" />
        </linearGradient>
        <linearGradient id="velFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a84ff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0a84ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#velFill)" />
      <path d={linePath} fill="none" stroke="url(#velGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke="url(#velGrad)" strokeWidth="1.5" opacity="0" className="hover:opacity-100 transition-opacity" />
      ))}
      {/* X-axis labels */}
      {velocity.map((d, i) => (
        <text key={d.d} x={points[i].x} y={height - 4} textAnchor="middle" fill="#86868b" fontSize="10" fontFamily="inherit">
          {d.d}
        </text>
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const toggle = (id: number) => setTasks((t) => t.map((x) => x.id === id ? { ...x, done: !x.done } : x));

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="relative px-10 py-8 pb-24">
      {/* Header */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wider text-[var(--color-apple-subtle)]">{dayName}, {dateStr}</p>
          <h1 className="mt-1 text-[32px] font-semibold tracking-tight text-[var(--color-apple-text)]">Good morning</h1>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[var(--color-apple-subtle)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-apple-green)]" />
          All systems calm
        </div>
      </div>

      {/* AI Daily Briefing */}
      <div className="apple-card relative overflow-hidden p-7"
        style={{ background: "linear-gradient(135deg, #f4ecff 0%, #ffe9f3 60%, #ffeede 100%)" }}>
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/60 px-2.5 py-1 text-[11.5px] font-medium text-[#6b46c1] backdrop-blur">
              <Sparkles className="h-3 w-3" /> AI Daily Briefing
            </div>
            <h2 className="text-[22px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">
              Good morning. You have <span className="text-[#6b46c1]">3 projects</span> that need attention today, and team velocity is up 14% vs last week.
            </h2>
          </div>
          <button className="flex shrink-0 items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[13px] font-medium text-[#1d1d1f] shadow-sm backdrop-blur transition hover:bg-white">
            <Play className="h-3.5 w-3.5 fill-current" /> Listen to briefing
          </button>
        </div>
      </div>

      {/* Bento grid */}
      <div className="mt-6 grid grid-cols-12 gap-5">
        {/* Priority actions */}
        <section className="apple-card col-span-12 p-6 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold tracking-tight text-[var(--color-apple-text)]">Priority actions</h3>
              <p className="text-[12.5px] text-[var(--color-apple-subtle)]">Curated by your Chief of Staff</p>
            </div>
            <button className="text-[12.5px] font-medium text-[var(--color-apple-blue)]">View all</button>
          </div>
          <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
            {tasks.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 py-3 transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.015] -mx-2 px-2 rounded-[8px]">
                <button
                  onClick={() => toggle(t.id)}
                  className={[
                    "h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] transition-all flex items-center justify-center",
                    t.done ? "border-[var(--color-apple-blue)] bg-[var(--color-apple-blue)]" : "border-[#c7c7cc] hover:border-[var(--color-apple-blue)]",
                  ].join(" ")}
                >
                  {t.done && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={["text-[13.5px] transition-all", t.done ? "text-[var(--color-apple-subtle)] line-through decoration-[1px]" : "text-[var(--color-apple-text)]"].join(" ")}>
                    {t.text}
                  </p>
                </div>
                <span className="rounded-full bg-black/[0.05] dark:bg-white/[0.05] px-2 py-0.5 text-[11px] text-[var(--color-apple-subtle)]">{t.project}</span>
                <Flag className="h-3.5 w-3.5 text-[var(--color-apple-orange)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            ))}
          </ul>
        </section>

        {/* Right column */}
        <div className="col-span-12 grid gap-5 lg:col-span-5">
          {/* Velocity */}
          <section className="apple-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[14px] font-medium text-[var(--color-apple-subtle)]">Team velocity</h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[26px] font-semibold tracking-tight text-[var(--color-apple-text)]">31</span>
                  <span className="flex items-center text-[12.5px] font-medium text-[var(--color-apple-green)]"><ArrowUpRight className="h-3 w-3" /> 14%</span>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-[var(--color-apple-subtle)]" />
            </div>
            <div className="mt-3 h-[120px]">
              <VelocityChart />
            </div>
          </section>

          {/* Morale rings */}
          <section className="apple-card p-6">
            <h3 className="text-[14px] font-medium text-[var(--color-apple-subtle)]">Overall morale</h3>
            <div className="mt-3 flex items-center gap-5">
              <Rings />
              <div className="space-y-2 text-[12.5px] text-[var(--color-apple-text)]">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#34c759]"/>Energy <span className="ml-auto font-medium">82%</span></div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ff9f0a]"/>Focus <span className="ml-auto font-medium">67%</span></div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ff375f]"/>Mood <span className="ml-auto font-medium">74%</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Strategic assistant floating button */}
      <button className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8e7cff] to-[#ff8ab8] shadow-lg shadow-purple-500/30 transition hover:scale-105">
        <Sparkles className="h-5 w-5 text-white" />
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8e7cff] to-[#ff8ab8] opacity-50 blur-xl -z-10" />
      </button>
    </div>
  );
}
