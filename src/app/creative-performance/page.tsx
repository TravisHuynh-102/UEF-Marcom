'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { useRole } from '@/context/role-context';
import { mockCreativeTasks } from '@/lib/mock-data';
import { CreativeTaskType } from '@/types';
import {
  Palette,
  Film,
  Package,
  Clock,
  RefreshCw,
  Star,
  TrendingUp,
  TrendingDown,
  Download,
  Sparkles,
  Trophy,
  Users,
  BarChart3,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ─── Helpers ─────────────────────────────────────────────── */

function StarRating({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'w-3.5 h-3.5',
            i < score
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-300 dark:text-gray-600'
          )}
        />
      ))}
    </div>
  );
}

const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    bg: 'bg-gray-100 dark:bg-gray-500/15',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-400',
  },
  InProgress: {
    label: 'In Progress',
    bg: 'bg-blue-100 dark:bg-blue-500/15',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  Review: {
    label: 'Review',
    bg: 'bg-amber-100 dark:bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  Completed: {
    label: 'Completed',
    bg: 'bg-emerald-100 dark:bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  Revision: {
    label: 'Revision',
    bg: 'bg-rose-100 dark:bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
} as const;

const DESIGN_COLORS = ['#8b5cf6', '#6366f1', '#a78bfa', '#818cf8', '#c4b5fd'];
const VIDEO_COLORS = ['#f59e0b', '#f97316', '#fbbf24', '#fb923c', '#fcd34d'];
const PIE_COLORS_DESIGN = ['#94a3b8', '#6366f1', '#f59e0b', '#10b981', '#f43f5e'];
const PIE_COLORS_VIDEO = ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981', '#f43f5e'];

const avatarGradients = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-sky-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
];

/* ─── Custom Tooltip ──────────────────────────────────────── */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a28] px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export default function CreativePerformancePage() {
  const { theme } = useTheme();
  const { currentRole, currentUser, hasPermission } = useRole();
  const [activeTab, setActiveTab] = useState<CreativeTaskType>('Design');
  const [ratingTask, setRatingTask] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const isVideo = activeTab === 'VideoEdit';

  /* ── Filter tasks based on role & tab ─────────────────── */
  const filteredTasks = useMemo(() => {
    let tasks = mockCreativeTasks.filter((t) => t.type === activeTab);

    if (currentRole === 'Staff') {
      tasks = tasks.filter((t) => t.assignee.id === currentUser.id);
    } else if (currentRole === 'Leader') {
      tasks = tasks.filter(
        (t) => t.assignee.teamId === currentUser.teamId || t.assignee.id === currentUser.id
      );
    }
    // Manager sees all
    return tasks;
  }, [activeTab, currentRole, currentUser]);

  /* ── Computed Metrics ─────────────────────────────────── */
  const metrics = useMemo(() => {
    const completed = filteredTasks.filter((t) => t.status === 'Completed');
    const totalDeliverables = completed.length;

    const turnarounds = completed
      .filter((t) => t.turnaroundDays != null)
      .map((t) => t.turnaroundDays!);
    const avgTurnaround =
      turnarounds.length > 0
        ? (turnarounds.reduce((a, b) => a + b, 0) / turnarounds.length).toFixed(1)
        : '—';

    const allRevisions = filteredTasks.map((t) => t.revisions);
    const avgRevisions =
      allRevisions.length > 0
        ? (allRevisions.reduce((a, b) => a + b, 0) / allRevisions.length).toFixed(1)
        : '—';

    const qualityScores = filteredTasks
      .filter((t) => t.qualityScore != null)
      .map((t) => t.qualityScore!);
    const avgQuality =
      qualityScores.length > 0
        ? (qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length).toFixed(1)
        : '—';

    return { totalDeliverables, avgTurnaround, avgRevisions, avgQuality };
  }, [filteredTasks]);

  /* ── Chart Data: Deliverables by Project ──────────────── */
  const projectBarData = useMemo(() => {
    const completed = filteredTasks.filter((t) => t.status === 'Completed');
    const grouped: Record<string, number> = {};
    completed.forEach((t) => {
      grouped[t.projectName] = (grouped[t.projectName] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  }, [filteredTasks]);

  /* ── Chart Data: Status Distribution ──────────────────── */
  const statusPieData = useMemo(() => {
    const counts: Record<string, number> = {
      Pending: 0,
      InProgress: 0,
      Review: 0,
      Completed: 0,
      Revision: 0,
    };
    filteredTasks.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [filteredTasks]);

  const totalStatusTasks = statusPieData.reduce((s, d) => s + d.value, 0);

  /* ── Team Member Stats ────────────────────────────────── */
  const memberStats = useMemo(() => {
    const map = new Map<
      string,
      {
        user: (typeof mockCreativeTasks)[0]['assignee'];
        total: number;
        completed: number;
        turnarounds: number[];
        qualities: number[];
      }
    >();

    filteredTasks.forEach((t) => {
      const key = t.assignee.id;
      if (!map.has(key)) {
        map.set(key, { user: t.assignee, total: 0, completed: 0, turnarounds: [], qualities: [] });
      }
      const entry = map.get(key)!;
      entry.total++;
      if (t.status === 'Completed') {
        entry.completed++;
        if (t.turnaroundDays != null) entry.turnarounds.push(t.turnaroundDays);
      }
      if (t.qualityScore != null) entry.qualities.push(t.qualityScore);
    });

    const stats = Array.from(map.values()).map((m) => ({
      ...m,
      avgTurnaround:
        m.turnarounds.length > 0
          ? (m.turnarounds.reduce((a, b) => a + b, 0) / m.turnarounds.length).toFixed(1)
          : '—',
      avgQuality:
        m.qualities.length > 0
          ? (m.qualities.reduce((a, b) => a + b, 0) / m.qualities.length).toFixed(1)
          : '—',
      completionRate: m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0,
    }));

    // Determine top performer (highest completion rate, then quality)
    let topId = '';
    let topScore = -1;
    stats.forEach((s) => {
      const score = s.completionRate * 10 + (parseFloat(s.avgQuality) || 0);
      if (score > topScore) {
        topScore = score;
        topId = s.user.id;
      }
    });

    return { stats, topId };
  }, [filteredTasks]);

  /* ── AI Insights ──────────────────────────────────────── */
  const aiInsights = useMemo(() => {
    if (currentRole === 'Manager') {
      return [
        {
          icon: '📊',
          text: 'Design team has 30% faster turnaround than Video — consider cross-training to balance workload.',
        },
        {
          icon: '⚡',
          text: 'Minh Tran handles 80% of video edits alone. High bus-factor risk — suggest onboarding a second editor.',
        },
        {
          icon: '🎯',
          text: 'Brand Refresh Q3 tasks have the highest quality scores (avg 4.0★). Replicate that workflow.',
        },
      ];
    }
    if (currentRole === 'Leader') {
      return [
        {
          icon: '📋',
          text: 'Minh Tran has 5 pending tasks — consider redistributing to balance the team.',
        },
        {
          icon: '✅',
          text: '2 completed tasks are missing quality scores. Rate them to keep analytics accurate.',
        },
        {
          icon: '📈',
          text: 'Your team\u2019s revision rate decreased 20% this sprint \u2014 process improvements are paying off!',
        },
      ];
    }
    return [
      {
        icon: '🎉',
        text: 'Your revision rate dropped 15% this month — great job keeping quality high!',
      },
      {
        icon: '💡',
        text: 'Tip: Tasks delivered 1+ day early get 0.3 higher average quality scores.',
      },
      {
        icon: '🏆',
        text: 'You completed 3 tasks this sprint. Keep up the momentum!',
      },
    ];
  }, [currentRole]);

  /* ── Accent colors per tab ────────────────────────────── */
  const accent = isVideo
    ? {
        gradient: 'from-amber-500 to-orange-500',
        shadow: 'shadow-amber-500/25',
        hoverShadow: 'shadow-amber-500/40',
        iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
        iconColor: 'text-amber-600 dark:text-amber-400',
        pillActive: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25',
      }
    : {
        gradient: 'from-violet-500 to-indigo-600',
        shadow: 'shadow-indigo-500/25',
        hoverShadow: 'shadow-indigo-500/40',
        iconBg: 'bg-violet-500/10 dark:bg-violet-500/15',
        iconColor: 'text-violet-600 dark:text-violet-400',
        pillActive: 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25',
      };

  const metricCards = [
    {
      label: 'Total Deliverables',
      value: String(metrics.totalDeliverables),
      trend: '+3 this week',
      trendUp: true,
      icon: Package,
      gradient: isVideo ? 'from-amber-500 to-orange-500' : 'from-violet-500 to-indigo-500',
      iconBg: isVideo ? 'bg-amber-500/10 dark:bg-amber-500/15' : 'bg-violet-500/10 dark:bg-violet-500/15',
      iconColor: isVideo ? 'text-amber-600 dark:text-amber-400' : 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Avg Turnaround',
      value: metrics.avgTurnaround === '—' ? '—' : `${metrics.avgTurnaround}d`,
      trend: '-0.5 days',
      trendUp: true,
      icon: Clock,
      gradient: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Revision Rate',
      value: metrics.avgRevisions === '—' ? '—' : `${metrics.avgRevisions}/task`,
      trend: '-12%',
      trendUp: true,
      icon: RefreshCw,
      gradient: isVideo ? 'from-orange-500 to-red-500' : 'from-indigo-500 to-blue-500',
      iconBg: isVideo ? 'bg-orange-500/10 dark:bg-orange-500/15' : 'bg-indigo-500/10 dark:bg-indigo-500/15',
      iconColor: isVideo ? 'text-orange-600 dark:text-orange-400' : 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Avg Quality Score',
      value: metrics.avgQuality === '—' ? '—' : `${metrics.avgQuality}★`,
      trend: '+0.2',
      trendUp: true,
      icon: Star,
      gradient: 'from-rose-500 to-pink-500',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  /* ─── Render ────────────────────────────────────────────── */

  return (
    <div className="space-y-8 pb-8">
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br shadow-lg',
                accent.gradient,
                accent.shadow
              )}
            >
              {isVideo ? (
                <Film className="w-5 h-5 text-white" />
              ) : (
                <Palette className="w-5 h-5 text-white" />
              )}
            </div>
            Creative Performance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-[52px]">
            {isVideo ? 'Video Editing' : 'Design'} team analytics &amp; deliverables
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Toggle */}
          <div
            className={cn(
              'flex items-center p-1 rounded-xl',
              isDark ? 'bg-[#16161f]' : 'bg-gray-100'
            )}
          >
            <button
              onClick={() => setActiveTab('Design')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === 'Design'
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <Palette className="w-4 h-4" />
              Design
            </button>
            <button
              onClick={() => setActiveTab('VideoEdit')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === 'VideoEdit'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                  : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <Film className="w-4 h-4" />
              Video Editing
            </button>
          </div>

          {/* Export (Manager only) */}
          {hasPermission('performance.export') && (
            <button
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r text-white transition-all',
                accent.gradient,
                accent.shadow,
                `hover:${accent.hoverShadow}`
              )}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* ── Overview Metric Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={cn(
                'relative rounded-xl p-6 transition-all duration-200 group cursor-pointer',
                isDark
                  ? 'bg-[#12121a] border border-white/5 hover:border-white/10'
                  : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
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
                <span className="text-xs text-gray-400 dark:text-gray-500">vs last sprint</span>
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

      {/* ── Charts Section ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Deliverables by Project */}
        <div
          className={cn(
            'rounded-xl p-6',
            isDark ? 'bg-[#12121a] border border-white/5' : 'bg-white border border-gray-100 shadow-sm'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className={cn('w-4 h-4', isVideo ? 'text-amber-500' : 'text-violet-500')} />
                Deliverables by Project
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Completed tasks grouped by project
              </p>
            </div>
          </div>
          <div className="h-[280px]">
            {projectBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectBarData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isVideo ? '#f59e0b' : '#8b5cf6'}
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor={isVideo ? '#f97316' : '#6366f1'}
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: isDark ? '#6b7280' : '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: isDark ? '#6b7280' : '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name="Deliverables" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40}>
                    {projectBarData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          isVideo
                            ? VIDEO_COLORS[i % VIDEO_COLORS.length]
                            : DESIGN_COLORS[i % DESIGN_COLORS.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                No completed deliverables yet
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart: Task Status Distribution */}
        <div
          className={cn(
            'rounded-xl p-6',
            isDark ? 'bg-[#12121a] border border-white/5' : 'bg-white border border-gray-100 shadow-sm'
          )}
        >
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className={cn('w-4 h-4', isVideo ? 'text-amber-500' : 'text-violet-500')} />
              Task Status Distribution
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Current {isVideo ? 'video editing' : 'design'} pipeline
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative h-[220px] w-[220px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusPieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          isVideo
                            ? PIE_COLORS_VIDEO[i % PIE_COLORS_VIDEO.length]
                            : PIE_COLORS_DESIGN[i % PIE_COLORS_DESIGN.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalStatusTasks}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {statusPieData.map((item, i) => {
                const cfg = STATUS_CONFIG[item.name as keyof typeof STATUS_CONFIG];
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: isVideo
                            ? PIE_COLORS_VIDEO[i % PIE_COLORS_VIDEO.length]
                            : PIE_COLORS_DESIGN[i % PIE_COLORS_DESIGN.length],
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {cfg?.label || item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.value}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({Math.round((item.value / totalStatusTasks) * 100)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Task Table ────────────────────────────────────── */}
      <div
        className={cn(
          'rounded-xl overflow-hidden',
          isDark ? 'bg-[#12121a] border border-white/5' : 'bg-white border border-gray-100 shadow-sm'
        )}
      >
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {isVideo ? '🎬' : '🎨'} {isVideo ? 'Video Editing' : 'Design'} Tasks
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {filteredTasks.length} tasks total
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Task
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Project
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Assignee
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Received
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Due
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Delivered
                </th>
                {isVideo && (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Length
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Type
                    </th>
                  </>
                )}
                <th className="text-center px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Rev.
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Quality
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredTasks.map((task) => {
                const statusCfg = STATUS_CONFIG[task.status];
                const showRateButton =
                  hasPermission('performance.rate_quality') &&
                  task.status === 'Completed' &&
                  !task.qualityScore;

                return (
                  <tr
                    key={task.id}
                    className={cn(
                      'transition-colors',
                      isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'
                    )}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
                          isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {task.projectName}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex items-center justify-center w-7 h-7 rounded-full text-white text-[10px] font-semibold bg-gradient-to-br',
                            avatarGradients[
                              parseInt(task.assignee.id.replace('u', '')) %
                                avatarGradients.length
                            ]
                          )}
                        >
                          {getInitials(task.assignee.name)}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {task.assignee.name.split(' ')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.receivedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {task.deliveredDate
                        ? new Date(task.deliveredDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    {isVideo && (
                      <>
                        <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {task.videoLength || '—'}
                        </td>
                        <td className="px-4 py-4">
                          {task.videoType ? (
                            <span
                              className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
                                task.videoType === 'Reels'
                                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300'
                                  : task.videoType === 'LongForm'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                                    : 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
                              )}
                            >
                              {task.videoType === 'LivestreamReplay'
                                ? 'Replay'
                                : task.videoType}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold',
                          task.revisions > 2
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                            : task.revisions > 0
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                              : isDark
                                ? 'bg-white/5 text-gray-400'
                                : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {task.revisions}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {task.qualityScore ? (
                        <StarRating score={task.qualityScore} />
                      ) : showRateButton ? (
                        <button
                          onClick={() => setRatingTask(task.id)}
                          className={cn(
                            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all',
                            isVideo
                              ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                              : 'bg-violet-500/10 text-violet-500 hover:bg-violet-500/20'
                          )}
                        >
                          <Star className="w-3 h-3" />
                          Rate
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                          statusCfg.bg,
                          statusCfg.text
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                        {statusCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
            No {isVideo ? 'video editing' : 'design'} tasks found for your scope.
          </div>
        )}
      </div>

      {/* ── Team Member Cards ─────────────────────────────── */}
      {memberStats.stats.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className={cn('w-5 h-5', isVideo ? 'text-amber-500' : 'text-violet-500')} />
                Team Members
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Individual {isVideo ? 'video' : 'design'} performance breakdown
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {memberStats.stats.map((member, idx) => {
              const isTop = member.user.id === memberStats.topId && memberStats.stats.length > 1;
              return (
                <div
                  key={member.user.id}
                  className={cn(
                    'relative rounded-xl p-5 transition-all duration-200',
                    isDark
                      ? 'bg-[#12121a] border hover:border-white/10'
                      : 'bg-white border shadow-sm hover:shadow-md',
                    isTop
                      ? 'border-amber-500/40 dark:border-amber-500/30'
                      : isDark
                        ? 'border-white/5'
                        : 'border-gray-100'
                  )}
                >
                  {/* Top performer badge */}
                  {isTop && (
                    <div className="absolute -top-2.5 right-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                        <Trophy className="w-3 h-3" />
                        Top Performer
                      </span>
                    </div>
                  )}

                  {/* Header: Avatar + Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={cn(
                        'flex items-center justify-center w-11 h-11 rounded-full text-white text-sm font-semibold bg-gradient-to-br shadow-md',
                        avatarGradients[idx % avatarGradients.length]
                      )}
                    >
                      {getInitials(member.user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {member.user.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {member.user.department} · {member.user.role}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Tasks completed
                      </span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {member.completed} / {member.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Avg turnaround
                      </span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {member.avgTurnaround === '—' ? '—' : `${member.avgTurnaround} days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Avg quality
                      </span>
                      <div className="flex items-center gap-1.5">
                        {member.avgQuality !== '—' ? (
                          <>
                            <StarRating score={Math.round(parseFloat(member.avgQuality))} />
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                              {member.avgQuality}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </div>
                    </div>

                    {/* Completion progress bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Completion rate
                        </span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {member.completionRate}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            member.completionRate >= 75
                              ? isVideo
                                ? 'bg-amber-500'
                                : 'bg-violet-500'
                              : member.completionRate >= 50
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                          )}
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AI Insights Panel (Glassmorphism) ─────────────── */}
      <div
        className={cn(
          'rounded-2xl p-6 relative overflow-hidden',
          'backdrop-blur-xl',
          'bg-gradient-to-r',
          isVideo
            ? 'from-amber-500/[0.06] to-orange-500/[0.06] border border-amber-500/20'
            : 'from-violet-500/[0.06] to-indigo-500/[0.06] border border-violet-500/20'
        )}
      >
        {/* Background glow */}
        <div
          className={cn(
            'absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20',
            isVideo ? 'bg-amber-500' : 'bg-violet-500'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-10',
            isVideo ? 'bg-orange-500' : 'bg-indigo-500'
          )}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br',
                isVideo ? 'from-amber-500 to-orange-500' : 'from-violet-500 to-indigo-500'
              )}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {currentRole === 'Manager'
                  ? 'Organization-level analysis'
                  : currentRole === 'Leader'
                    ? 'Team-level recommendations'
                    : 'Personal performance tips'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]',
                  isDark
                    ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/10'
                    : 'bg-white/60 border border-gray-200/50 hover:border-gray-300'
                )}
              >
                <span className="text-lg mb-2 block">{insight.icon}</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Rating Modal (simple inline) ──────────────────── */}
      {ratingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={cn(
              'rounded-2xl p-6 w-full max-w-sm',
              isDark ? 'bg-[#16161f] border border-white/10' : 'bg-white border border-gray-200 shadow-2xl'
            )}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Rate Quality
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              How would you rate this deliverable?
            </p>
            <div className="flex items-center gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => setRatingTask(null)}
                  className="p-1 rounded-lg hover:bg-amber-500/10 transition-colors"
                >
                  <Star className="w-8 h-8 text-amber-400 hover:fill-amber-400 transition-colors" />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRatingTask(null)}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isDark
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                Cancel
              </button>
              <button
                onClick={() => setRatingTask(null)}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r transition-all',
                  accent.gradient,
                  accent.shadow
                )}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
