'use client';

import { FolderKanban, Shield, AlertTriangle, XCircle, ChevronRight, Filter } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';
import type { ProjectStatus, RiskLevel } from '@/types';

const statusConfig: Record<ProjectStatus, { class: string; label: string }> = {
  'In Progress': {
    class: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    label: 'In Progress',
  },
  Planned: {
    class: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    label: 'Planned',
  },
  Blocked: {
    class: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    label: 'Blocked',
  },
  Review: {
    class: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    label: 'Review',
  },
  Completed: {
    class: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    label: 'Completed',
  },
  Backlog: {
    class: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
    label: 'Backlog',
  },
};

const riskConfig: Record<RiskLevel, { icon: typeof Shield; class: string; iconClass: string }> = {
  Safe: {
    icon: Shield,
    class: 'text-emerald-600 dark:text-emerald-400',
    iconClass: 'text-emerald-500',
  },
  'At Risk': {
    icon: AlertTriangle,
    class: 'text-amber-600 dark:text-amber-400',
    iconClass: 'text-amber-500',
  },
  Blocked: {
    icon: XCircle,
    class: 'text-rose-600 dark:text-rose-400',
    iconClass: 'text-rose-500',
  },
};

function getProgressColor(progress: number): string {
  if (progress >= 80) return 'from-emerald-500 to-emerald-400';
  if (progress >= 50) return 'from-indigo-500 to-violet-500';
  if (progress >= 30) return 'from-amber-500 to-yellow-500';
  return 'from-rose-500 to-orange-500';
}

export default function ProjectsList() {
  const { projects } = useAppState();
  return (
    <div
      className={cn(
        'glass-panel overflow-hidden'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <FolderKanban className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Projects</h3>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
            {projects.length}
          </span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {/* Project rows */}
      <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
        {projects.map((project) => {
          const status = statusConfig[project.status];
          const risk = riskConfig[project.risk];
          const RiskIcon = risk.icon;

          return (
            <div
              key={project.id}
              className={cn(
                'group flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors duration-150',
                'hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
              )}
            >
              {/* Project info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {project.name}
                  </h4>
                  <span
                    className={cn(
                      'shrink-0 inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md border',
                      status.class
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden max-w-[180px]">
                    <div
                      className={cn(
                        'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                        getProgressColor(project.progress)
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Risk badge */}
              <div className={cn('hidden sm:flex items-center gap-1.5 shrink-0', risk.class)}>
                <RiskIcon className={cn('w-3.5 h-3.5', risk.iconClass)} />
                <span className="text-xs font-medium">{project.risk}</span>
              </div>

              {/* Lead */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-bold">
                  {getInitials(project.lead.name)}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[80px] truncate">
                  {project.lead.name}
                </span>
              </div>

              {/* Due date */}
              <span className="hidden lg:block text-xs text-gray-400 dark:text-gray-500 shrink-0 tabular-nums">
                {new Date(project.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>

              {/* Chevron */}
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
