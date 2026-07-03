'use client';

import { useState } from 'react';
import { Play, Sparkles, MoreHorizontal, ArrowUpRight, Flag } from 'lucide-react';

const velocity = [
  { d: "Mon", v: 12 }, { d: "Tue", v: 18 }, { d: "Wed", v: 15 },
  { d: "Thu", v: 22 }, { d: "Fri", v: 28 }, { d: "Sat", v: 24 }, { d: "Sun", v: 31 },
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

import { useAppState } from '@/context/app-state-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { tasks, updateTask } = useAppState();
  const toggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) updateTask(id, { completed: !task.completed });
  };
  const router = useRouter();

  // Pick top 5 priority tasks for the dashboard
  const priorityTasks = tasks.filter(t => !t.completed).slice(0, 5);
  // Fallback to recent tasks if no pending priority tasks
  const displayTasks = priorityTasks.length > 0 ? priorityTasks : tasks.slice(0, 5);

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="relative px-10 py-8 pb-24">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-widest text-[var(--accent-purple)]">{dayName}, {dateStr}</p>
          <h1 className="mt-2 text-[36px] font-outfit font-bold tracking-tight text-[var(--color-apple-text)]">Good morning</h1>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium px-3 py-1.5 rounded-full bg-[var(--color-apple-green)]/10 text-[var(--color-apple-green)] border border-[var(--color-apple-green)]/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-apple-green)] animate-pulse" />
          All systems calm
        </div>
      </div>

      {/* AI Daily Briefing */}
      <div className="apple-card relative overflow-hidden p-8 animated-gradient-bg border-0">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[2px]"></div>
        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 dark:bg-black/20 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md border border-white/20 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> AI Daily Briefing
            </div>
            <h2 className="text-[26px] font-outfit font-semibold leading-snug tracking-tight text-white text-glow">
              Good morning. You have <span className="text-yellow-300 font-bold">{priorityTasks.length} projects</span> that need attention today, and team velocity is up 14% vs last week.
            </h2>
          </div>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(`Good morning. You have ${priorityTasks.length} projects that need attention today, and team velocity is up 14% versus last week.`);
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
              }
            }}
            className="flex shrink-0 items-center gap-2 rounded-full bg-white text-[var(--accent-purple)] px-5 py-2.5 text-[14px] font-semibold shadow-lg shadow-white/20 transition-all hover:scale-105 hover:bg-opacity-90"
          >
            <Play className="h-4 w-4 fill-current" /> Listen to briefing
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
            <Link href="/tasks" className="text-[12.5px] font-medium text-[var(--color-apple-blue)] hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
            {displayTasks.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 py-3.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03] -mx-2 px-2 rounded-xl">
                <button
                  onClick={() => toggle(t.id)}
                  className={[
                    "h-[20px] w-[20px] shrink-0 rounded-full border-[1.5px] transition-all flex items-center justify-center",
                    t.completed ? "border-[var(--accent-purple)] bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] shadow-md shadow-[var(--accent-purple)]/20" : "border-[var(--border-main)] hover:border-[var(--accent-purple)]",
                  ].join(" ")}
                >
                  {t.completed && <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={["text-[14px] transition-all", t.completed ? "text-[var(--color-apple-subtle)] line-through decoration-[1px] opacity-70" : "text-[var(--color-apple-text)] font-medium"].join(" ")}>
                    {t.title}
                  </p>
                </div>
                <span className="rounded-md bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.02] dark:border-white/[0.05] px-2.5 py-1 text-[12.5px] font-medium text-[var(--color-apple-subtle)]">{t.projectName}</span>
                <Flag className="h-4 w-4 text-[var(--accent-pink)] opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110" />
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
      <Link href="/ai-assistant" className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8e7cff] to-[#ff8ab8] shadow-lg shadow-purple-500/30 transition hover:scale-105">
        <Sparkles className="h-5 w-5 text-white" />
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8e7cff] to-[#ff8ab8] opacity-50 blur-xl -z-10" />
      </Link>
    </div>
  );
}
