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
  '/notes': { title: 'Notes', subtitle: 'Personal and team documents' },
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
    <header className="flex justify-between items-center w-full px-4 h-12 shrink-0 bg-[var(--bg-main)] z-40 relative flex-none">
      {/* Mobile Menu Toggle & Breadcrumb */}
      <div className="flex items-center gap-1 overflow-hidden">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-1 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        
        {/* Breadcrumb */}
        <div className="flex items-center text-[14px] text-[var(--text-muted)] whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="hover:bg-[var(--bg-hover)] px-2 py-1 rounded cursor-pointer transition-colors truncate hidden sm:inline-block">TeamOS Workspace</span>
          <span className="text-[var(--border-main)] mx-0.5 hidden sm:inline-block">/</span>
          <span className="hover:bg-[var(--bg-hover)] px-2 py-1 rounded cursor-pointer transition-colors text-[var(--text-main)] truncate font-medium flex items-center gap-1.5">
            {pageInfo.title === 'AI Chief of Staff' && <span className="text-[14px]">🤖</span>}
            {pageInfo.title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div ref={searchRef} className="relative hidden sm:block w-48">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[16px]">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full bg-[var(--bg-sidebar)] border border-transparent text-[var(--text-main)] rounded py-1 pl-8 pr-2 focus:outline-none focus:border-[var(--border-main)] focus:bg-[var(--bg-main)] transition-all text-[14px] placeholder:text-[var(--text-muted)]" 
            placeholder="Search..." 
          />
          {/* Search Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full right-0 mt-2 w-80 rounded border border-[var(--border-light)] bg-[var(--bg-main)] shadow-lg overflow-hidden z-50">
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-[14px] text-[var(--text-muted)]">No results for &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto py-2">
                  {Object.entries(groupedResults).map(([category, results]) => (
                    <div key={category}>
                      <p className="px-3 py-1 text-[11px] font-medium text-[var(--text-muted)]">
                        {category}
                      </p>
                      {results.map(result => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] transition-colors"
                        >
                          <span className="text-[16px]">{result.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] text-[var(--text-main)] truncate">{result.title}</p>
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

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded border border-[var(--border-light)] bg-[var(--bg-main)] shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-light)]">
                <h3 className="text-[14px] font-medium text-[var(--text-main)]">Updates</h3>
                {unreadNotificationCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[var(--text-muted)]">
                    <p className="text-[14px]">You&apos;re all caught up.</p>
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
                          'flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors',
                          !notif.read ? 'bg-[var(--bg-sidebar)]' : 'hover:bg-[var(--bg-hover)]'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn('text-[14px] truncate', !notif.read ? 'font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]')}>
                              {notif.title}
                            </p>
                          </div>
                          <p className="text-[13px] mt-0.5 line-clamp-2 text-[var(--text-muted)]">{notif.message}</p>
                          <p className="text-[12px] mt-1 text-[var(--text-muted)]">{timeAgo}</p>
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
        <div className="w-7 h-7 rounded bg-[var(--bg-hover)] flex items-center justify-center cursor-pointer ml-1" onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}>
          <span className="text-[12px] font-medium text-[var(--text-main)]">{currentUser.name.split(' ').map(n => n[0]).join('')}</span>

          {/* Role Switcher Dropdown (Demo) */}
          {roleDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setRoleDropdownOpen(false); }} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded border border-[var(--border-light)] bg-[var(--bg-main)] shadow-lg p-1 cursor-default">
                <p className="px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] uppercase">
                  Switch Role
                </p>
                {(['Manager', 'Leader', 'Staff'] as UserRole[]).map((role) => {
                  const isActive = currentRole === role;
                  return (
                    <button
                      key={role}
                      onClick={(e) => { e.stopPropagation(); setCurrentRole(role); setRoleDropdownOpen(false); }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded px-2 py-1.5 text-[14px] transition-colors',
                        isActive ? 'bg-[var(--bg-hover)] text-[var(--text-main)] font-medium' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                      )}
                    >
                      {role}
                      {isActive && <span className="ml-auto text-[12px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
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
