'use client';

import { Sparkles, AlertTriangle, Zap, FileText, Award, ArrowRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { mockInsights } from '@/lib/mock-data';
import type { InsightType } from '@/types';

const typeConfig: Record<
  InsightType,
  { icon: typeof AlertTriangle; iconBg: string; iconColor: string; dotColor: string }
> = {
  Risk: {
    icon: AlertTriangle,
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    iconColor: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-500',
  },
  Optimization: {
    icon: Zap,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  Summary: {
    icon: FileText,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    iconColor: 'text-blue-600 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  Kudos: {
    icon: Award,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
};

const severityDot: Record<string, string> = {
  critical: 'bg-rose-500 pulse-dot',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  success: 'bg-emerald-500',
};

export default function AISummaryFeed() {
  // Sort by timestamp descending
  const sortedInsights = [...mockInsights].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden flex flex-col',
        'bg-white dark:bg-[#12121a]',
        'border border-gray-100 dark:border-white/5',
        'shadow-sm dark:shadow-none'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            AI Activity Feed
          </h3>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {sortedInsights.length} insights
        </span>
      </div>

      {/* Feed items — scrollable */}
      <div className="flex-1 max-h-[420px] overflow-y-auto">
        <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
          {sortedInsights.map((insight) => {
            const config = typeConfig[insight.type];
            const TypeIcon = config.icon;

            return (
              <div
                key={insight.id}
                className={cn(
                  'group flex gap-3.5 px-6 py-4 cursor-pointer transition-colors duration-150',
                  'hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'shrink-0 flex items-center justify-center w-9 h-9 rounded-lg mt-0.5',
                    config.iconBg
                  )}
                >
                  <TypeIcon className={cn('w-4 h-4', config.iconColor)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white leading-tight flex-1 min-w-0">
                      {insight.title}
                    </h4>
                    {/* Severity dot */}
                    <div
                      className={cn(
                        'shrink-0 w-2 h-2 rounded-full mt-1.5',
                        severityDot[insight.severity]
                      )}
                    />
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                    {insight.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {formatDate(insight.timestamp)}
                    </span>

                    {insight.actionRequired && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Action Required
                      </span>
                    )}

                    {insight.relatedProject && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                        {insight.relatedProject}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
