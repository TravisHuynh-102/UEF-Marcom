'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { useLanguage } from '@/context/language-context';
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

const roleConfig: Record<UserRole, { label: string; icon: string; color: string; bg: string }> = {
  Manager: { label: 'Manager', icon: 'shield', color: 'text-primary', bg: 'bg-primary/10' },
  Leader: { label: 'Leader', icon: 'star', color: 'text-tertiary-container', bg: 'bg-tertiary-container/10' },
  Staff: { label: 'Staff', icon: 'person', color: 'text-sky-400', bg: 'bg-sky-500/10' },
};

interface SearchResult {
  id: string;
  title: string;
  category: 'Projects' | 'Tasks' | 'Content' | 'People';
  subtitle?: string;
  link: string;
  icon: string;
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentRole, currentUser, setCurrentRole } = useRole();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
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

  // ─── Search Results ─────────────────────────────────────────────────────
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    projects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(p => results.push({ id: p.id, title: p.name, category: 'Projects', subtitle: p.status, link: '/projects', icon: 'folder' }));

    tasks.filter(t => t.title.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(t => results.push({ id: t.id, title: t.title, category: 'Tasks', subtitle: t.projectName, link: '/tasks', icon: 'description' }));

    contentItems.filter(c => c.title.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(c => results.push({ id: c.id, title: c.title, category: 'Content', subtitle: `${c.platform} • ${c.type}`, link: '/content-calendar', icon: 'calendar_today' }));

    users.filter(u => u.name.toLowerCase().includes(q) || u.department.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(u => results.push({ id: u.id, title: u.name, category: 'People', subtitle: `${u.role} • ${u.department}`, link: '/settings', icon: 'group' }));

    return results;
  }, [searchQuery, projects, tasks, contentItems, users]);

  const showSearchResults = searchFocused && searchQuery.length >= 2;

  // Click outside to close Search
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Click outside to close Notifications
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

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    searchResults.forEach(r => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [searchResults]);

  return (
    <header className="h-16 flex justify-between items-center px-gutter shrink-0 bg-surface/80 backdrop-blur-md z-10 sticky top-0 border-b border-outline-variant/30">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuClick}
        className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Title */}
      <div className="font-headline-md text-headline-md font-bold text-on-surface hidden md:block">
        {pageInfo.title}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Search Bar */}
        <div ref={searchRef} className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="bg-surface-container border border-outline-variant rounded-lg py-1.5 pl-10 pr-4 w-64 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-sm placeholder:text-on-surface-variant/50" 
            placeholder={t('header.search')} 
          />
          {/* Search Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-outline-variant bg-surface-container shadow-xl overflow-hidden z-50">
              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">search_off</span>
                  <p className="text-body-sm text-on-surface-variant">No results for &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto py-2">
                  {Object.entries(groupedResults).map(([category, results]) => (
                    <div key={category}>
                      <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                        {category}
                      </p>
                      {results.map(result => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-surface transition-colors"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">{result.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-body-sm font-medium text-on-surface truncate">{result.title}</p>
                            {result.subtitle && <p className="text-[11px] text-on-surface-variant truncate">{result.subtitle}</p>}
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

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-surface-container transition-colors"
          >
            <span className={cn('flex items-center gap-1.5 rounded text-[11px] font-semibold px-2 py-0.5', currentRoleConfig.bg, currentRoleConfig.color)}>
              <span className="material-symbols-outlined text-[14px]">{currentRoleConfig.icon}</span>
              {currentRoleConfig.label}
            </span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
          </button>

          {roleDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRoleDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1.5 w-48 rounded-xl border border-outline-variant bg-surface-container shadow-xl p-1.5">
                <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
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
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-body-sm transition-colors',
                        isActive ? 'bg-surface text-on-surface' : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
                      )}
                    >
                      <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', config.bg, config.color)}>
                        <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
                      </span>
                      {config.label}
                      {isActive && <span className="ml-auto text-[10px] text-primary">●</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
          className="text-on-surface-variant hover:text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-[11px] font-bold uppercase border border-outline-variant/50"
          title="Toggle Language"
        >
          {locale}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-on-surface-variant hover:text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container border border-outline-variant/50"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="text-on-surface-variant hover:text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-outline-variant bg-surface-container shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30">
                <h3 className="text-body-sm font-bold text-on-surface">{t('header.notifications')}</h3>
                {unreadNotificationCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-[11px] font-medium text-primary hover:text-primary-fixed transition-colors">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[32px] mb-2">notifications_off</span>
                    <p className="text-body-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 8).map(notif => {
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
                          !notif.read ? 'bg-primary/5' : 'hover:bg-surface'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn('text-body-sm font-medium truncate', notif.read ? 'text-on-surface-variant' : 'text-on-surface')}>
                              {notif.title}
                            </p>
                            {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-[12px] mt-0.5 line-clamp-2 text-on-surface-variant">{notif.message}</p>
                          <p className="text-[10px] mt-1 text-on-surface-variant/70">{timeAgo}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <button className="w-8 h-8 rounded-lg overflow-hidden border border-outline-variant hover:border-primary transition-colors flex items-center justify-center bg-gradient-to-br from-primary to-inverse-primary text-[11px] font-bold text-white">
          {currentUser.name.split(' ').map(n => n[0]).join('')}
        </button>
      </div>
    </header>
  );
}

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
