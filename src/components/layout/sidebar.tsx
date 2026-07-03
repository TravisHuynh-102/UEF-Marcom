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
  Search,
  Megaphone,
  Users,
  Shield
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
  },
  {
    title: 'Admin Panel',
    items: [
      { label: 'User Management', icon: Users, href: '/admin/users' },
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
        "fixed inset-y-0 left-0 z-50 w-64 flex-col transition-transform duration-300 md:translate-x-0 md:flex flex",
        "md:m-6 md:h-[calc(100vh-48px)] md:rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] text-black dark:text-white transition-colors duration-500",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header / Logo */}
        <div className="flex h-14 items-center gap-3 px-5 mt-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-red-600 to-blue-700 text-white shadow-lg shadow-red-500/20 dark:shadow-blue-500/10">
            <Megaphone className="h-4 w-4" />
          </div>
          <span className="text-[17px] font-outfit font-semibold tracking-tight text-black dark:text-white">
            UEF Marcom
          </span>
          <button onClick={onClose} className="ml-auto md:hidden text-black/60 dark:text-white/60">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 rounded-xl bg-white/50 dark:bg-black/40 border border-white/40 dark:border-white/10 px-3 py-2 text-[13px] text-black/60 dark:text-white/60 shadow-sm backdrop-blur-md">
            <Search className="h-3.5 w-3.5" />
            <input
              placeholder="Search"
              className="w-full bg-transparent outline-none placeholder:text-black/50 dark:placeholder:text-white/50 text-black dark:text-white font-medium"
            />
            <kbd className="hidden rounded bg-black/5 dark:bg-white/10 px-1 text-[10px] sm:inline font-bold">⌘K</kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-4 pb-6">
          {navGroups.map((group, idx) => {
            const visibleItems = group.items.filter(item => canAccessRoute(currentRole, item.href));
            if (visibleItems.length === 0) return null;
            return (
              <div key={idx} className="mt-5">
                {group.title && (
                  <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/50">
                    {group.title}
                  </div>
                )}
                <ul className="space-y-1">
                  {visibleItems.map((item) => {
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
                            "group flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] transition-all duration-200 font-medium",
                            isActive
                              ? "bg-white/40 dark:bg-white/10 shadow-sm border border-white/30 dark:border-white/5 text-black dark:text-white translate-x-1"
                              : "text-black/70 dark:text-white/70 hover:bg-white/20 dark:hover:bg-white/5 hover:text-black dark:hover:text-white hover:translate-x-1 border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center rounded-lg p-1.5 transition-colors",
                            isActive ? "bg-white/50 dark:bg-white/20 border border-white/40 dark:border-white/10 shadow-sm text-black dark:text-white" : "text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white"
                          )}>
                            <Icon className="h-[16px] w-[16px]" />
                          </div>
                          <span>{item.dictKey ? t(item.dictKey) : item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-auto px-4 pb-4">
          <div className="flex items-center gap-3 rounded-xl p-3 bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/5 hover:bg-white/30 dark:hover:bg-white/10 cursor-pointer transition-colors shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black dark:bg-white/20 text-[12px] font-bold text-white shadow-md">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="flex-1 leading-tight min-w-0">
              <div className="text-[13.5px] font-semibold text-black dark:text-white truncate">{currentUser?.name || 'User'}</div>
              <div className="text-[11.5px] text-black/60 dark:text-white/60 truncate font-medium mt-0.5">{currentRole || 'Member'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

