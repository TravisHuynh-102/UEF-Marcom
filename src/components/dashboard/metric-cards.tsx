'use client';

import { TrendingUp, FolderKanban, AlertCircle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockMetrics, productivityData } from '@/lib/mock-data';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const metrics = [
  {
    label: 'Team Health Score',
    value: `${mockMetrics.healthScore}%`,
    trend: '↑ 3% from last week',
    trendPositive: true,
    icon: Activity,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    accentColor: 'emerald',
    type: 'circular' as const,
  },
  {
    label: 'Active Projects',
    value: mockMetrics.activeProjects.toString(),
    trend: '2 new this week',
    trendPositive: true,
    icon: FolderKanban,
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    accentColor: 'indigo',
    type: 'default' as const,
  },
  {
    label: 'Overdue Tasks',
    value: mockMetrics.overdueTasks.toString(),
    trend: 'Needs attention',
    trendPositive: false,
    icon: AlertCircle,
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    iconColor: 'text-rose-600 dark:text-rose-400',
    accentColor: 'rose',
    type: 'default' as const,
  },
  {
    label: 'Productivity Trend',
    value: '',
    trend: '↑ 12% this month',
    trendPositive: true,
    icon: TrendingUp,
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/15',
    iconColor: 'text-violet-600 dark:text-violet-400',
    accentColor: 'violet',
    type: 'sparkline' as const,
  },
];

function CircularProgress({
  value,
  size = 56,
  strokeWidth = 5,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-100 dark:text-white/5"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#healthGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
      <defs>
        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className={cn(
              'relative p-6 glass-panel hover-lift group cursor-pointer'
            )}
          >
            {/* Top row: label + icon */}
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
                <Icon className={cn('w-4.5 h-4.5', metric.iconColor)} />
              </div>
            </div>

            {/* Value area */}
            {metric.type === 'circular' ? (
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <CircularProgress value={mockMetrics.healthScore} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white rotate-0">
                    {mockMetrics.healthScore}
                  </span>
                </div>
              </div>
            ) : metric.type === 'sparkline' ? (
              <div className="mb-3 -mx-1">
                <div className="h-[50px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={productivityData}>
                      <defs>
                        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="url(#sparkGradient)"
                        dot={false}
                        isAnimationActive={true}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <span
                  className={cn(
                    'text-3xl font-bold tracking-tight',
                    metric.accentColor === 'rose'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-gray-900 dark:text-white'
                  )}
                >
                  {metric.value}
                </span>
              </div>
            )}

            {/* Trend */}
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'text-xs font-medium',
                  metric.trendPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {metric.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
