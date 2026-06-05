'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Command,
  Shield,
  Star,
  UserIcon,
  X,
  FileText,
  FolderKanban,
  CalendarDays,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { useRole } from '@/context/role-context';
import { useAppState } from '@/context/app-state-context';
import { UserRole } from '@/types';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard' },
  '/projects': { title: 'Projects', subtitle: 'Manage your team projects' },
  '/tasks': { title: 'My Tasks', subtitle: 'Track your assignments' },
  '/ai-assistant': { title: 'AI Chief of Staff', subtitle: 'Your AI-powered operations partner' },
  '/performance': { title: 'Team Performance', subtitle: 'Analytics & insights' },
  '/knowledge': { title: 'Knowledge Hub', subtitle: 'Team wiki & documents' },
  '/chat': { title: 'Chat', subtitle: 'Team communication' },
  '/settings': { title: 'Settings', subtitle: 'Manage your workspace' },
  '/content-calendar': { title: 'Content Calendar', subtitle: 'Plan & schedule content' },
  '/work-calendar': { title: 'Work Calendar', subtitle: 'Team schedules & trips' },
  '/creative-performance': { title: 'Creative Performance', subtitle: 'Design & Video metrics' },
};

const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  Manager: { label: 'Manager', icon: Shield, color: 'text-violet-400', bg: 'bg-violet-500/15' },
  Leader: { label: 'Leader', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  Staff: { label: 'Staff', icon: UserIcon, color: 'text-sky-400', bg: 'bg-sky-500/15' },
};

// ─── Search Result Types ────────────────────────────────────────────────────
interface SearchResult {
  id: string;
  title: string;
  category: 'Projects' | 'Tasks' | 'Content' | 'People';
  subtitle?: string;
  link: string;
  icon: React.ElementType;
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentRole, currentUser, setCurrentRole } = useRole();
  const { projects, tasks, contentItems, users, notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useAppState();
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: 'TeamOS AI' };
  const currentRoleConfig = roleConfig[currentRole];
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // ─── Search Results ─────────────────────────────────────────────────────
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search projects
    projects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(p => results.push({ id: p.id, title: p.name, category: 'Projects', subtitle: p.status, link: '/projects', icon: FolderKanban }));

    // Search tasks
    tasks.filter(t => t.title.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(t => results.push({ id: t.id, title: t.title, category: 'Tasks', subtitle: t.projectName, link: '/tasks', icon: FileText }));

    // Search content
    contentItems.filter(c => c.title.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(c => results.push({ id: c.id, title: c.title, category: 'Content', subtitle: `${c.platform} • ${c.type}`, link: '/content-calendar', icon: CalendarDays }));

    // Search people
    users.filter(u => u.name.toLowerCase().includes(q) || u.department.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(u => results.push({ id: u.id, title: u.name, category: 'People', subtitle: `${u.role} • ${u.department}`, link: '/settings', icon: Users }));

    return results;
  }, [searchQuery, projects, tasks, contentItems, users]);

  const showSearchResults = searchFocused && searchQuery.length >= 2;

  // Close search on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close notifications on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchResultClick = (result: SearchResult) => {
    router.push(result.link);
    setSearchQuery('');
    setSearchFocused(false);
  };

  // Group search results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    searchResults.forEach(r => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [searchResults]);

  // Notification type colors
  const notifTypeConfig = {
    success: { icon: '✅', color: 'text-emerald-400' },
    info: { icon: 'ℹ️', color: 'text-blue-400' },
    warning: { icon: '⚠️', color: 'text-amber-400' },
    error: { icon: '❌', color: 'text-red-400' },
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b px-6 transition-colors',
        theme === 'dark'
          ? 'bg-[#0d0d14]/80 backdrop-blur-xl border-white/[0.05]'
          : 'bg-white/80 backdrop-blur-xl border-gray-200'
      )}
    >
      {/* Left: Page Title & Greeting */}
      <div className="flex min-w-0 flex-col">
        <h1
          className={cn(
            'text-lg font-bold tracking-tight',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}
        >
          {pageInfo.title}
        </h1>
        <p
          className={cn(
            'text-xs',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}
        >
          {pathname === '/' ? `${greeting}, ${currentUser.name.split(' ')[0]}` : pageInfo.subtitle}
        </p>
      </div>

      {/* Center: Global Search */}
      <div
        ref={searchRef}
        className={cn(
          'relative hidden md:flex items-center transition-all duration-300 ease-out',
          searchFocused ? 'w-[420px]' : 'w-[340px]'
        )}
      >
        <Search
          className={cn(
            'absolute left-3.5 h-4 w-4 pointer-events-none transition-colors z-10',
            searchFocused
              ? theme === 'dark'
                ? 'text-violet-400'
                : 'text-violet-500'
              : theme === 'dark'
                ? 'text-gray-500'
                : 'text-gray-400'
          )}
        />
        <input
          type="text"
          placeholder="Search anything…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          className={cn(
            'h-9 w-full rounded-xl border pl-10 pr-20 text-sm outline-none transition-all duration-200 placeholder:text-gray-500',
            theme === 'dark'
              ? 'bg-white/[0.04] border-white/[0.08] text-white focus:border-violet-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20'
              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-300 focus:bg-white focus:ring-1 focus:ring-violet-200'
          )}
        />
        {searchQuery ? (
          <button
            onClick={() => { setSearchQuery(''); }}
            className={cn(
              'absolute right-3 flex items-center justify-center rounded-md p-1 transition-colors',
              theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div
            className={cn(
              'absolute right-3 flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
              theme === 'dark'
                ? 'border-white/10 bg-white/[0.05] text-gray-500'
                : 'border-gray-200 bg-gray-100 text-gray-400'
            )}
          >
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div
            className={cn(
              'absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl overflow-hidden',
              theme === 'dark'
                ? 'bg-[#16161f] border-white/[0.08]'
                : 'bg-white border-gray-200'
            )}
          >
            {searchResults.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Search className={cn('h-8 w-8 mx-auto mb-2', theme === 'dark' ? 'text-gray-600' : 'text-gray-300')} />
                <p className={cn('text-sm', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                  No results for &quot;{searchQuery}&quot;
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto py-1.5">
                {Object.entries(groupedResults).map(([category, results]) => (
                  <div key={category}>
                    <p className={cn(
                      'px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {category}
                    </p>
                    {results.map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          theme === 'dark'
                            ? 'hover:bg-white/[0.04]'
                            : 'hover:bg-gray-50'
                        )}
                      >
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg',
                          theme === 'dark' ? 'bg-white/[0.06]' : 'bg-gray-100'
                        )}>
                          <result.icon className={cn('h-4 w-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-sm font-medium truncate', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                            {result.title}
                          </p>
                          {result.subtitle && (
                            <p className={cn('text-xs truncate', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Quick Add */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 hover:scale-105 active:scale-95"
          title="Quick Add"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95',
            theme === 'dark'
              ? 'text-gray-400 hover:bg-white/[0.06] hover:text-yellow-400'
              : 'text-gray-500 hover:bg-gray-100 hover:text-amber-500'
          )}
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={cn(
              'relative flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95',
              theme === 'dark'
                ? 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            )}
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {/* Unread badge */}
            {unreadNotificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div
              className={cn(
                'absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border shadow-2xl overflow-hidden',
                theme === 'dark'
                  ? 'bg-[#16161f] border-white/[0.08]'
                  : 'bg-white border-gray-200'
              )}
            >
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between px-4 py-3 border-b',
                theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'
              )}>
                <h3 className={cn('text-sm font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  Notifications
                </h3>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className={cn('h-8 w-8 mx-auto mb-2', theme === 'dark' ? 'text-gray-600' : 'text-gray-300')} />
                    <p className={cn('text-sm', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                      No notifications
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 8).map(notif => {
                    const config = notifTypeConfig[notif.type];
                    const timeAgo = getTimeAgo(notif.timestamp);
                    return (
                      <button
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) router.push(notif.link);
                          setNotifOpen(false);
                        }}
                        className={cn(
                          'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                          !notif.read
                            ? theme === 'dark'
                              ? 'bg-violet-500/[0.04]'
                              : 'bg-violet-50/50'
                            : '',
                          theme === 'dark'
                            ? 'hover:bg-white/[0.04]'
                            : 'hover:bg-gray-50'
                        )}
                      >
                        <span className="text-base mt-0.5 shrink-0">{config.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              'text-sm font-medium truncate',
                              theme === 'dark' ? 'text-white' : 'text-gray-900',
                              notif.read && 'opacity-60'
                            )}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                            )}
                          </div>
                          <p className={cn(
                            'text-xs mt-0.5 line-clamp-2',
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          )}>
                            {notif.message}
                          </p>
                          <p className={cn(
                            'text-[10px] mt-1',
                            theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                          )}>
                            {timeAgo}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className={cn(
            'mx-1.5 h-6 w-px',
            theme === 'dark' ? 'bg-white/[0.08]' : 'bg-gray-200'
          )}
        />

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all',
              theme === 'dark'
                ? 'hover:bg-white/[0.06]'
                : 'hover:bg-gray-100'
            )}
          >
            <span className={cn('flex h-6 items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] font-semibold', currentRoleConfig.bg, currentRoleConfig.color)}>
              <currentRoleConfig.icon className="h-3 w-3" />
              {currentRoleConfig.label}
            </span>
            <ChevronDown className={cn('h-3 w-3', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')} />
          </button>

          {roleDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRoleDropdownOpen(false)} />
              <div
                className={cn(
                  'absolute right-0 top-full z-50 mt-1.5 w-48 rounded-xl border p-1.5 shadow-xl',
                  theme === 'dark'
                    ? 'bg-[#16161f] border-white/[0.08]'
                    : 'bg-white border-gray-200'
                )}
              >
                <p className={cn('px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                  Switch Role (Demo)
                </p>
                {(['Manager', 'Leader', 'Staff'] as UserRole[]).map((role) => {
                  const config = roleConfig[role];
                  const isActive = currentRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => { setCurrentRole(role); setRoleDropdownOpen(false); }}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all',
                        isActive
                          ? theme === 'dark'
                            ? 'bg-white/[0.08] text-white'
                            : 'bg-gray-100 text-gray-900'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', config.bg)}>
                        <config.icon className={cn('h-3.5 w-3.5', config.color)} />
                      </span>
                      {config.label}
                      {isActive && <span className="ml-auto text-[10px] text-emerald-400">●</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <button
          className={cn(
            'flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all',
            theme === 'dark'
              ? 'hover:bg-white/[0.04]'
              : 'hover:bg-gray-50'
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-bold text-white shadow-md shadow-violet-600/20">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden lg:flex flex-col items-start">
            <span
              className={cn(
                'text-sm font-semibold leading-tight',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}
            >
              {currentUser.name}
            </span>
            <span
              className={cn(
                'text-[11px] leading-tight',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}
            >
              {currentUser.department}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}

// ─── Helper: relative time ──────────────────────────────────────────────────
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
