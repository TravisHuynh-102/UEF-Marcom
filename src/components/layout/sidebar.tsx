'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Sparkles,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Briefcase,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { useRole } from '@/context/role-context';
import { canAccessRoute } from '@/lib/permissions';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  isAI?: boolean;
  section?: string; // Section label before this item
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Projects', icon: FolderKanban, href: '/projects' },
  { label: 'My Tasks', icon: CheckSquare, href: '/tasks' },
  { label: 'Content Calendar', icon: CalendarDays, href: '/content-calendar', section: 'CONTENT' },
  { label: 'Work Calendar', icon: Briefcase, href: '/work-calendar' },
  { label: 'Creative Performance', icon: Palette, href: '/creative-performance', section: 'ANALYTICS' },
  { label: 'Team Performance', icon: Users, href: '/performance' },
  { label: 'AI Chief of Staff', icon: Sparkles, href: '/ai-assistant', isAI: true, section: 'TOOLS' },
  { label: 'Knowledge Hub', icon: BookOpen, href: '/knowledge' },
  { label: 'Chat', icon: MessageSquare, href: '/chat' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { currentRole } = useRole();
  const { theme } = useTheme();

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen border-r transition-all duration-300 ease-in-out select-none',
        collapsed ? 'w-[72px]' : 'w-[260px]',
        theme === 'dark'
          ? 'bg-[#0d0d14] border-white/[0.06]'
          : 'bg-white border-gray-200'
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-7 z-50 flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-colors',
          theme === 'dark'
            ? 'bg-[#1a1a2e] border-white/10 text-gray-400 hover:text-white hover:bg-[#252540]'
            : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        )}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Logo / Brand */}
      <div
        className={cn(
          'flex items-center gap-3 px-5 pt-6 pb-6 transition-all duration-300',
          collapsed && 'justify-center px-0'
        )}
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
          <Brain className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex items-baseline gap-1.5 overflow-hidden">
            <span
              className={cn(
                'text-lg font-bold tracking-tight',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}
            >
              TeamOS
            </span>
            <span className="rounded-md bg-gradient-to-r from-violet-600/20 to-indigo-600/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-violet-400">
              AI
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        className={cn(
          'mx-4 mb-2 border-b',
          theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'
        )}
      />

      {/* Main Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {!collapsed && (
          <p
            className={cn(
              'mb-2 px-3 text-[11px] font-medium uppercase tracking-wider',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}
          >
            Menu
          </p>
        )}
        {mainNavItems.filter(item => canAccessRoute(currentRole, item.href)).map((item, idx, arr) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? theme === 'dark'
                    ? 'bg-white/[0.06] text-white'
                    : 'bg-violet-50 text-violet-700'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {/* Active gradient border */}
              {isActive && (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-500 to-indigo-500" />
              )}

              <div className="relative shrink-0">
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] transition-colors',
                    isActive
                      ? item.isAI
                        ? 'text-violet-400'
                        : theme === 'dark'
                          ? 'text-white'
                          : 'text-violet-600'
                      : theme === 'dark'
                        ? 'text-gray-500 group-hover:text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-600'
                  )}
                />
                {/* AI pulsing dot */}
                {item.isAI && (
                  <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                  </span>
                )}
              </div>

              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div
                  className={cn(
                    'pointer-events-none absolute left-full ml-3 rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 shadow-xl transition-opacity group-hover:opacity-100',
                    theme === 'dark'
                      ? 'bg-[#1e1e30] text-white border border-white/10'
                      : 'bg-gray-900 text-white'
                  )}
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-1 px-3 pb-2">
        {/* Divider */}
        <div
          className={cn(
            'mx-1 mb-2 border-b',
            theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'
          )}
        />

        {/* Settings */}
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? theme === 'dark'
                    ? 'bg-white/[0.06] text-white'
                    : 'bg-violet-50 text-violet-700'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-500 to-indigo-500" />
              )}
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0 transition-colors',
                  isActive
                    ? theme === 'dark'
                      ? 'text-white'
                      : 'text-violet-600'
                    : theme === 'dark'
                      ? 'text-gray-500 group-hover:text-gray-300'
                      : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {collapsed && (
                <div
                  className={cn(
                    'pointer-events-none absolute left-full ml-3 rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 shadow-xl transition-opacity group-hover:opacity-100',
                    theme === 'dark'
                      ? 'bg-[#1e1e30] text-white border border-white/10'
                      : 'bg-gray-900 text-white'
                  )}
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* User Profile Card */}
        <div
          className={cn(
            'mt-2 flex items-center gap-3 rounded-xl p-3 transition-all duration-300',
            collapsed && 'justify-center p-2',
            theme === 'dark'
              ? 'bg-white/[0.03] border border-white/[0.04]'
              : 'bg-gray-50 border border-gray-100'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white shadow-md shadow-violet-600/20">
            SC
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'truncate text-sm font-semibold leading-tight',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}
              >
                Sarah Chen
              </p>
              <p
                className={cn(
                  'truncate text-xs leading-tight',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}
              >
                Product Lead
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
