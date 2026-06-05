'use client';

import { BarChart3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workloadData } from '@/lib/mock-data';

function getCapacityColor(capacity: number): {
  bar: string;
  text: string;
  bg: string;
} {
  if (capacity > 85)
    return {
      bar: 'from-rose-500 to-red-500',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    };
  if (capacity >= 70)
    return {
      bar: 'from-amber-500 to-yellow-500',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    };
  return {
    bar: 'from-emerald-500 to-green-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
  };
}

export default function WorkloadChart() {
  const maxCapacity = 100;

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-white dark:bg-[#12121a]',
        'border border-gray-100 dark:border-white/5',
        'shadow-sm dark:shadow-none'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Team Workload</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-medium text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>&lt;70%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>70-85%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span>&gt;85%</span>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div className="p-6 space-y-5">
        {workloadData.map((dept) => {
          const colors = getCapacityColor(dept.capacity);
          const widthPercent = (dept.capacity / maxCapacity) * 100;

          return (
            <div key={dept.name} className="group">
              {/* Label row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dept.name}
                </span>
                <div className="flex items-center gap-2">
                  {dept.capacity > 85 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  )}
                  <span className={cn('text-sm font-semibold tabular-nums', colors.text)}>
                    {dept.capacity}%
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="relative h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
                    colors.bar
                  )}
                  style={{ width: `${widthPercent}%` }}
                >
                  {/* Shimmer effect on high capacity */}
                  {dept.capacity > 85 && (
                    <div className="absolute inset-0 shimmer rounded-full" />
                  )}
                </div>

                {/* Threshold markers */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-gray-300/50 dark:bg-white/10"
                  style={{ left: '70%' }}
                />
                <div
                  className="absolute top-0 bottom-0 w-px bg-gray-300/50 dark:bg-white/10"
                  style={{ left: '85%' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="px-6 py-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          <span className="font-medium text-rose-500">
            {workloadData.filter((d) => d.capacity > 85).length} teams
          </span>{' '}
          above recommended capacity threshold
        </p>
      </div>
    </div>
  );
}
