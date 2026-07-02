'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Flag, Trash2, Plus } from 'lucide-react';

const tabs = [
  { id: "today", label: "Today", count: 6 },
  { id: "scheduled", label: "Scheduled", count: 14 },
  { id: "all", label: "All", count: 42 },
  { id: "done", label: "Completed", count: 128 },
];

const initialTodos = [
  { id: 1, text: "Final review on brand book v3", due: "Today, 4:00 PM", flagged: true },
  { id: 2, text: "1:1 with Linh — career growth plan", due: "Today, 5:30 PM", flagged: false },
  { id: 3, text: "Approve Atlas landing copy", due: "Tomorrow", flagged: false },
  { id: 4, text: "Draft response to investor questions", due: "Wed, Jun 11", flagged: false },
  { id: 5, text: "Reschedule offsite venue tour", due: "Fri, Jun 13", flagged: false },
  { id: 6, text: "Review hiring scorecards", due: "Next Mon", flagged: false },
];

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [todos, setTodos] = useState(initialTodos);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleCheck = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setChecked((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="My Tasks"
        subtitle="Your day, in focus"
        actions={
          <button className="flex items-center gap-1.5 bg-[var(--color-apple-blue)] text-white text-[13px] font-medium px-4 py-[7px] rounded-full hover:opacity-90 transition-opacity">
            <Plus size={14} strokeWidth={2.5} />
            New task
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-10 py-8">
        {/* Segmented Control Tabs */}
        <div className="inline-flex items-center bg-black/[0.05] dark:bg-white/[0.08] rounded-[10px] p-[3px] mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-[6px] rounded-[8px] text-[13px] font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-white/[0.15] text-[var(--color-apple-text)] shadow-sm'
                  : 'text-[var(--color-apple-subtle)] hover:text-[var(--color-apple-text)]'
                }
              `}
            >
              {tab.label}
              <span className={`ml-1.5 text-[12.5px] ${activeTab === tab.id ? 'text-[var(--color-apple-subtle)]' : 'text-[var(--color-apple-subtle)] opacity-70'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Task List Card */}
        <div className="apple-card divide-y divide-black/[0.05] dark:divide-white/[0.06]">
          {todos.map((todo) => {
            const isChecked = checked.has(todo.id);
            return (
              <div
                key={todo.id}
                className="group flex items-center gap-3.5 px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-default"
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleCheck(todo.id)}
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  {isChecked ? (
                    <div className="w-[18px] h-[18px] rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-black/[0.2] dark:border-white/[0.25] transition-colors hover:border-[var(--color-apple-blue)]" />
                  )}
                </button>

                {/* Text + Due */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[15px] leading-snug ${
                      isChecked
                        ? 'line-through text-[var(--color-apple-subtle)]'
                        : 'text-[var(--color-apple-text)]'
                    }`}
                  >
                    {todo.text}
                  </div>
                  <div className="text-[12px] text-[var(--color-apple-subtle)] mt-0.5">
                    {todo.due}
                  </div>
                </div>

                {/* Flag Icon */}
                {todo.flagged && (
                  <Flag
                    size={14}
                    className="flex-shrink-0 fill-[var(--color-apple-orange)] text-[var(--color-apple-orange)]"
                  />
                )}

                {/* Delete Button (visible on hover) */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  <Trash2 size={14} className="text-[var(--color-apple-subtle)]" />
                </button>
              </div>
            );
          })}

          {/* Empty state if all deleted */}
          {todos.length === 0 && (
            <div className="px-5 py-12 text-center text-[13.5px] text-[var(--color-apple-subtle)]">
              No tasks yet. Click &quot;+ New task&quot; to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
