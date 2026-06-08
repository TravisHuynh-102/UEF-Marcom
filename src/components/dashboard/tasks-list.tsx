'use client';

import { CheckCircle2, Circle, Flag, Calendar } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';
import type { Task, TaskPriority } from '@/types';

const priorityConfig: Record<TaskPriority, { color: string; dotColor: string; label: string }> = {
  Critical: {
    color: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-500',
    label: 'Critical',
  },
  High: {
    color: 'text-orange-600 dark:text-orange-400',
    dotColor: 'bg-orange-500',
    label: 'High',
  },
  Medium: {
    color: 'text-blue-600 dark:text-blue-400',
    dotColor: 'bg-blue-500',
    label: 'Medium',
  },
  Low: {
    color: 'text-gray-500 dark:text-gray-400',
    dotColor: 'bg-gray-400 dark:bg-gray-500',
    label: 'Low',
  },
};

export default function TasksList() {
  const { tasks } = useAppState();
  const today = '2026-06-04';

  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const upcomingTasks = tasks.filter((t) => t.dueDate > today);
  const overdueTasks = tasks.filter((t) => t.dueDate < today && !t.completed);

  const allDisplayTasks = [...overdueTasks, ...todayTasks, ...upcomingTasks];
  const totalCount = allDisplayTasks.length;

  return (
    <div
      className={cn(
        'glass-panel overflow-hidden'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Tasks — Today & Upcoming
          </h3>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            {totalCount}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
        {/* Overdue section */}
        {overdueTasks.length > 0 && (
          <>
            <div className="px-6 py-2.5 bg-rose-50/50 dark:bg-rose-500/[0.04]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Overdue
              </span>
            </div>
            {overdueTasks.map((task) => (
              <TaskRow key={task.id} task={task} isOverdue />
            ))}
          </>
        )}

        {/* Today section */}
        {todayTasks.length > 0 && (
          <>
            <div className="px-6 py-2.5 bg-gray-50/50 dark:bg-white/[0.01]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Today — Jun 4
              </span>
            </div>
            {todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </>
        )}

        {/* Upcoming section */}
        {upcomingTasks.length > 0 && (
          <>
            <div className="px-6 py-2.5 bg-gray-50/50 dark:bg-white/[0.01]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Upcoming
              </span>
            </div>
            {upcomingTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  isOverdue = false,
}: {
  task: Task;
  isOverdue?: boolean;
}) {
  const priority = priorityConfig[task.priority];

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-colors duration-150',
        'hover:bg-gray-50/80 dark:hover:bg-white/[0.02]',
        task.completed && 'opacity-50'
      )}
    >
      {/* Checkbox */}
      <button className="shrink-0 transition-colors">
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500" />
        )}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-medium text-gray-900 dark:text-white truncate',
              task.completed && 'line-through text-gray-400 dark:text-gray-500'
            )}
          >
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
            {task.projectName}
          </span>
        </div>
      </div>

      {/* Priority */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <div className={cn('w-2 h-2 rounded-full', priority.dotColor)} />
        <span className={cn('text-[11px] font-medium', priority.color)}>{priority.label}</span>
      </div>

      {/* Priority flag (mobile) */}
      <Flag className={cn('w-3.5 h-3.5 sm:hidden shrink-0', priority.color)} />

      {/* Assignee */}
      <div className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 text-white text-[10px] font-bold shrink-0">
        {getInitials(task.assignee.name)}
      </div>

      {/* Due date */}
      <span
        className={cn(
          'text-xs tabular-nums shrink-0',
          isOverdue
            ? 'text-rose-600 dark:text-rose-400 font-medium'
            : 'text-gray-400 dark:text-gray-500'
        )}
      >
        {new Date(task.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </span>
    </div>
  );
}
