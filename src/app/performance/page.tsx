'use client';
/* eslint-disable */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { productivityData } from '@/lib/mock-data';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/ui/page-header';
import {
  Zap,
  Target,
  Clock,
  Heart,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

/* ─── Static Data ─────────────────────────────────────────── */

const topMetrics = [
  {
    label: 'Team Velocity',
    value: '94%',
    trend: '+5.2%',
    trendUp: true,
    icon: Zap,
    gradient: 'from-indigo-500 to-violet-500',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    label: 'Sprint Completion Rate',
    value: '87%',
    trend: '+2.8%',
    trendUp: true,
    icon: Target,
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Average Task Time',
    value: '2.3 days',
    trend: '-0.4 days',
    trendUp: true,
    icon: Clock,
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Team Satisfaction',
    value: '4.2/5',
    trend: '+0.3',
    trendUp: true,
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

const taskDistribution = [
  { name: 'Critical', value: 4, color: '#ef4444' },
  { name: 'High', value: 8, color: '#f97316' },
  { name: 'Medium', value: 12, color: '#6366f1' },
  { name: 'Low', value: 6, color: '#94a3b8' },
];

const departmentPerformance = [
  { name: 'Engineering', performance: 92, fill: '#6366f1' },
  { name: 'Design', performance: 88, fill: '#8b5cf6' },
  { name: 'Marketing', performance: 85, fill: '#f59e0b' },
  { name: 'Executive', performance: 78, fill: '#10b981' },
];

const sprintBurndown = [
  { day: 'Day 1', ideal: 50, actual: 50 },
  { day: 'Day 2', ideal: 44.4, actual: 47 },
  { day: 'Day 3', ideal: 38.9, actual: 44 },
  { day: 'Day 4', ideal: 33.3, actual: 42 },
  { day: 'Day 5', ideal: 27.8, actual: 38 },
  { day: 'Day 6', ideal: 22.2, actual: 36 },
  { day: 'Day 7', ideal: 16.7, actual: 30 },
  { day: 'Day 8', ideal: 11.1, actual: 25 },
  { day: 'Day 9', ideal: 5.6, actual: 18 },
  { day: 'Day 10', ideal: 0, actual: 8 },
];

/* Simulated per-user performance metrics */
const memberPerformance: Record<
  string,
  { tasksCompleted: number; onTime: number; status: 'available' | 'busy' | 'overloaded' }
> = {
  u1: { tasksCompleted: 24, onTime: 92, status: 'busy' },
  u2: { tasksCompleted: 38, onTime: 96, status: 'available' },
  u3: { tasksCompleted: 31, onTime: 88, status: 'overloaded' },
  u4: { tasksCompleted: 19, onTime: 94, status: 'available' },
  u5: { tasksCompleted: 27, onTime: 85, status: 'busy' },
  u6: { tasksCompleted: 33, onTime: 91, status: 'available' },
  u7: { tasksCompleted: 14, onTime: 79, status: 'overloaded' },
  u8: { tasksCompleted: 22, onTime: 90, status: 'available' },
};

const avatarGradients = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-sky-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
  'from-lime-500 to-green-500',
  'from-cyan-500 to-teal-500',
];

const statusConfig = {
  available: { color: 'bg-emerald-500', label: 'Available', ring: 'ring-emerald-500/20' },
  busy: { color: 'bg-amber-500', label: 'Busy', ring: 'ring-amber-500/20' },
  overloaded: { color: 'bg-rose-500', label: 'Overloaded', ring: 'ring-rose-500/20' },
};

const deptColors: Record<string, string> = {
  Engineering: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  Design: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  Marketing: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Executive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
};

/* ─── Custom Tooltip Components ───────────────────────────── */

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a28] px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-[var(--color-apple-subtle)] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
          {entry.name === 'Productivity' ? '%' : ''}
        </p>
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export default function PerformancePage() {
  const { users } = useAppState();
  const { addToast } = useToast();
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState('Last 30 days');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const totalTasks = taskDistribution.reduce((sum, d) => sum + d.value, 0);

  const handleExport = () => {
    addToast({
      title: 'Exporting Report',
      message: `Generating CSV for ${timePeriod}...`,
      type: 'info'
    });
    setTimeout(() => {
      addToast({
        title: 'Export Complete',
        message: 'Report has been downloaded successfully.',
        type: 'success'
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-8 px-10">
      {/* ── Page Header ──────────────────────────────────── */}
      <PageHeader 
        title="Performance" 
        subtitle="Creative & team — last 30 days" 
        actions={
          <>
            <div className="relative">
              <button 
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="px-4 py-1.5 text-[13px] font-medium rounded-[12px] border border-black/[0.06] bg-[var(--color-apple-card)] text-[var(--color-apple-text)] hover:bg-black/[0.02] transition-colors"
              >
                {timePeriod}
              </button>
              {showPeriodDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPeriodDropdown(false)} />
                  <div className="absolute top-full mt-2 left-0 w-40 rounded-[12px] border border-black/[0.06] bg-[var(--color-apple-card)] shadow-xl z-50 overflow-hidden">
                    {['Last 7 days', 'Last 30 days', 'This Quarter', 'This Year'].map(period => (
                      <button
                        key={period}
                        onClick={() => { setTimePeriod(period); setShowPeriodDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-[13px] hover:bg-black/[0.04] text-[var(--color-apple-text)]"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={handleExport}
              className="px-4 py-1.5 text-[13px] font-medium rounded-full bg-[var(--color-apple-blue)] text-white hover:opacity-90 transition-opacity ml-2"
            >
              Export Report
            </button>
          </>
        }
      />

      {/* ── Top Metrics Row ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {topMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={cn(
                'apple-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-[var(--color-apple-subtle)]">
                  {metric.label}
                </span>
                <div
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
                    metric.iconBg
                  )}
                >
                  <Icon className={cn('w-[18px] h-[18px]', metric.iconColor)} />
                </div>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold tracking-tight text-[var(--color-apple-text)]">
                  {metric.value}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {metric.trendUp ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    metric.trendUp
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  )}
                >
                  {metric.trend}
                </span>
                <span className="text-xs text-[var(--color-apple-subtle)]">vs last sprint</span>
              </div>

              {/* Subtle top accent line */}
              <div
                className={cn(
                  'absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity',
                  metric.gradient
                )}
              />
            </div>
          );
        })}
      </div>

      {/* ── Main Charts Section (2 columns) ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left Column ────────────────────────────────── */}
        <div className="space-y-6">
          {/* Productivity Over Time */}
          <div
            className={cn(
              'apple-card p-6'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-apple-text)]">
                  Team Productivity Over Time
                </h3>
                <p className="text-xs text-[var(--color-apple-subtle)] mt-0.5">
                  Weekly average across all teams
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  +12% overall
                </span>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[60, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Productivity"
                    stroke="url(#lineGradient)"
                    strokeWidth={2.5}
                    fill="url(#productivityGradient)"
                    dot={{ r: 3, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Distribution Donut */}
          <div
            className={cn(
              'apple-card p-6'
            )}
          >
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[var(--color-apple-text)]">
                Task Distribution by Priority
              </h3>
              <p className="text-xs text-[var(--color-apple-subtle)] mt-0.5">
                Current sprint breakdown
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative h-[200px] w-[200px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {taskDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-[var(--color-apple-text)]">{totalTasks}</span>
                  <span className="text-xs text-[var(--color-apple-subtle)]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {taskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-[var(--color-apple-text)]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--color-apple-text)]">
                        {item.value}
                      </span>
                      <span className="text-xs text-[var(--color-apple-subtle)]">
                        ({Math.round((item.value / totalTasks) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column ───────────────────────────────── */}
        <div className="space-y-6">
          {/* Department Performance */}
          <div
            className={cn(
              'apple-card p-6'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-apple-text)]">
                  Department Performance
                </h3>
                <p className="text-xs text-[var(--color-apple-subtle)] mt-0.5">
                  Target: 85% completion rate
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 border-t-2 border-dashed border-rose-400" />
                <span className="text-xs text-[var(--color-apple-subtle)]">Target</span>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentPerformance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  barSize={24}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as (typeof departmentPerformance)[0];
                      return (
                        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a28] px-3 py-2 shadow-xl">
                          <p className="text-sm font-semibold text-[var(--color-apple-text)]">{d.name}</p>
                          <p className="text-xs text-[var(--color-apple-subtle)]">{d.performance}% completion</p>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine x={85} stroke="#f43f5e" strokeDasharray="6 4" strokeWidth={1.5} />
                  <Bar dataKey="performance" radius={[0, 6, 6, 0]}>
                    {departmentPerformance.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sprint Burndown */}
          <div
            className={cn(
              'apple-card p-6'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-apple-text)]">
                  Sprint Burndown
                </h3>
                <p className="text-xs text-[var(--color-apple-subtle)] mt-0.5">
                  Story points remaining — Sprint 14
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 border-t-2 border-dashed border-gray-400 dark:border-gray-500" />
                  <span className="text-xs text-[var(--color-apple-subtle)]">Ideal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 border-t-2 border-indigo-500" />
                  <span className="text-xs text-[var(--color-apple-subtle)]">Actual</span>
                </div>
              </div>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sprintBurndown} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="burndownFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 55]}
                    tickFormatter={(v) => `${v} pts`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="ideal"
                    name="Ideal"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#burndownFill)"
                    dot={{ r: 3, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── Team Members Performance Section ─────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-apple-text)] flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Team Members Performance
            </h3>
            <p className="text-sm text-[var(--color-apple-subtle)] mt-0.5">
              Individual contributions & capacity this sprint
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {users.map((user, idx) => {
            const perf = memberPerformance[user.id] || { tasksCompleted: 0, onTime: 100, status: 'available' };
            const statusCfg = statusConfig[perf.status as keyof typeof statusConfig];
            return (
              <div
                key={user.id}
                onMouseEnter={() => setHoveredMember(user.id)}
                onMouseLeave={() => setHoveredMember(null)}
                className={cn(
                  'apple-card p-5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5'
                )}
              >
                {/* Header: Avatar + Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative">
                    <div
                      className={cn(
                        'flex items-center justify-center w-11 h-11 rounded-full text-white text-sm font-semibold bg-gradient-to-br shadow-md',
                        avatarGradients[idx % avatarGradients.length]
                      )}
                    >
                      {getInitials(user.name)}
                    </div>
                    {/* Status dot */}
                    <div
                      className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#12121a]',
                        statusCfg.color
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-apple-text)] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--color-apple-subtle)] truncate">{user.role}</p>
                  </div>
                </div>

                {/* Department Badge */}
                <div className="mb-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
                      deptColors[user.department] || 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'
                    )}
                  >
                    {user.department}
                  </span>
                </div>

                {/* Personal Metrics */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-apple-subtle)]">Tasks completed</span>
                    <span className="text-xs font-semibold text-[var(--color-apple-text)]">
                      {perf.tasksCompleted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-apple-subtle)]">On-time delivery</span>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        perf.onTime >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : perf.onTime >= 80
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                      )}
                    >
                      {perf.onTime}%
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--color-apple-subtle)]">Capacity</span>
                      <span className="text-xs font-semibold text-[var(--color-apple-text)]">
                        {user.capacity}%
                      </span>
                    </div>
                    {/* Capacity bar */}
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          user.capacity >= 90
                            ? 'bg-rose-500'
                            : user.capacity >= 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        )}
                        style={{ width: `${user.capacity}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-white/5">
                  <div className={cn('w-2 h-2 rounded-full', statusCfg.color, perf.status === 'available' && 'pulse-dot')} />
                  <span className="text-xs text-[var(--color-apple-subtle)]">{statusCfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
