'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRole } from '@/context/role-context';
import { canAccessRoute } from '@/lib/permissions';
import { useLanguage } from '@/context/language-context';
import { Dictionary } from '@/locales/en';
import {
  LayoutGrid,
  FolderClosed,
  CheckCircle2,
  CalendarDays,
  Calendar,
  LineChart,
  BarChart3,
  Sparkles,
  BookOpen,
  StickyNote,
  Settings,
  HelpCircle,
  Search
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  dictKey?: keyof Dictionary;
  icon: React.ElementType;
  href: string;
  isAI?: boolean;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', dictKey: 'sidebar.dashboard', icon: LayoutGrid, href: '/' },
      { label: 'Projects', icon: FolderClosed, href: '/projects' },
      { label: 'My Tasks', icon: CheckCircle2, href: '/tasks' },
      { label: 'Content Calendar', dictKey: 'sidebar.contentCalendar', icon: CalendarDays, href: '/content-calendar' },
      { label: 'Work Calendar', dictKey: 'sidebar.workCalendar', icon: Calendar, href: '/work-calendar' },
      { label: 'Creative Performance', dictKey: 'sidebar.creativePerformance', icon: LineChart, href: '/creative-performance' },
      { label: 'Team Performance', icon: BarChart3, href: '/performance' },
    ],
  },
  {
    title: 'AI Assistants',
    items: [
      { label: 'AI Chief of Staff', icon: Sparkles, href: '/ai-assistant', isAI: true },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { label: 'Knowledge Hub', dictKey: 'sidebar.knowledgeHub', icon: BookOpen, href: '/knowledge' },
      { label: 'Notes', dictKey: 'sidebar.notes', icon: StickyNote, href: '/notes' },
      { label: 'Settings', dictKey: 'sidebar.settings', icon: Settings, href: '/settings' },
      { label: 'Support', icon: HelpCircle, href: '/support' },
    ],
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole, currentUser } = useRole();
  const { t } = useLanguage();

  return (
    <>
      <aside className={cn(
        "glass-sidebar fixed inset-y-0 left-0 z-50 w-[260px] flex-col border-r border-black/[0.06] dark:border-white/[0.06] transition-transform duration-300 md:translate-x-0 md:flex flex",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header / Logo */}
        <div className="flex h-14 items-center gap-2 px-5 mt-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#8e7cff] to-[#ff8ab8] shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--color-apple-text)]">
            TeamOS <span className="text-[var(--color-apple-subtle)] font-medium">AI</span>
          </span>
          <button onClick={onClose} className="ml-auto md:hidden text-[var(--color-apple-subtle)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 rounded-[10px] bg-black/[0.05] dark:bg-white/[0.05] px-2.5 py-1.5 text-[13px] text-[var(--color-apple-subtle)]">
            <Search className="h-3.5 w-3.5" />
            <input
              placeholder="Search"
              className="w-full bg-transparent outline-none placeholder:text-[var(--color-apple-subtle)]"
            />
            <kbd className="hidden rounded bg-black/[0.06] dark:bg-white/[0.06] px-1 text-[10px] sm:inline">⌘K</kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mt-4">
              {group.title && (
                <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--color-apple-subtle)]">
                  {group.title}
                </div>
              )}
              <ul className="space-y-0.5">
                {group.items.filter(item => canAccessRoute(currentRole, item.href)).map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[8px] px-3 py-1.5 text-[13.5px] transition-colors",
                          isActive
                            ? "bg-[var(--color-apple-lilac)]/35 text-[var(--accent-purple)] font-medium dark:bg-[var(--color-apple-lilac)]/20"
                            : "text-[var(--color-apple-text)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                        )}
                      >
                        <Icon className={cn(
                          "h-[16px] w-[16px]",
                          isActive ? "text-[var(--accent-primary)]" : "text-[var(--color-apple-subtle)]"
                        )} />
                        <span>{item.dictKey ? t(item.dictKey) : item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-black/[0.05] dark:border-white/[0.05] p-3">
          <div className="flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] cursor-pointer">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-[11px] font-semibold text-white">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="flex-1 leading-tight min-w-0">
              <div className="text-[12.5px] font-medium text-[var(--color-apple-text)] truncate">{currentUser?.name || 'User'}</div>
              <div className="text-[11px] text-[var(--color-apple-subtle)] truncate">{currentRole || 'Member'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

