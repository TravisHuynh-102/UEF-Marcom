'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRole } from '@/context/role-context';
import { canAccessRoute } from '@/lib/permissions';
import { useLanguage } from '@/context/language-context';
import { Dictionary } from '@/locales/en';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  dictKey?: keyof Dictionary;
  icon: string;
  href: string;
  isAI?: boolean;
  separatorBefore?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', dictKey: 'sidebar.dashboard', icon: '🏠', href: '/' },
  { label: 'Projects', icon: '📁', href: '/projects' },
  { label: 'My Tasks', icon: '✅', href: '/tasks' },
  { label: 'Content Calendar', dictKey: 'sidebar.contentCalendar', icon: '📅', href: '/content-calendar' },
  { label: 'Work Calendar', dictKey: 'sidebar.workCalendar', icon: '📆', href: '/work-calendar' },
  { label: 'Creative Performance', dictKey: 'sidebar.creativePerformance', icon: '📈', href: '/creative-performance', separatorBefore: true },
  { label: 'Team Performance', icon: '👥', href: '/performance' },
  { label: 'AI Chief of Staff', icon: '🤖', href: '/ai-assistant', isAI: true, separatorBefore: true },
  { label: 'Knowledge Hub', dictKey: 'sidebar.knowledgeHub', icon: '📚', href: '/knowledge' },
  { label: 'Notes', dictKey: 'sidebar.notes', icon: '📝', href: '/notes' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', dictKey: 'sidebar.settings', icon: '⚙️', href: '/settings' },
  { label: 'Support', icon: '❓', href: '/support' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole, currentUser } = useRole();
  const { t } = useLanguage();

  return (
    <>
      <nav className={cn(
        "fixed left-0 top-0 h-screen w-[240px] bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] flex flex-col py-3 z-50 transition-transform duration-300 md:translate-x-0 group",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Workspace Switcher / Header */}
        <div className="px-3 mb-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[var(--bg-hover)] rounded cursor-pointer transition-colors">
            <div className="w-5 h-5 rounded-[4px] bg-[var(--text-main)] flex items-center justify-center text-[var(--bg-main)] font-bold text-[10px]">
              T
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-[14px] text-[var(--text-main)] truncate">TeamOS Workspace</h1>
            </div>
            <span className="text-[12px] text-[var(--text-muted)]">▼</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 space-y-[2px]">
          {mainNavItems.filter(item => canAccessRoute(currentRole, item.href)).map((item) => {
            const isActive = pathname === item.href;
            return (
              <React.Fragment key={item.href}>
                {item.separatorBefore && (
                  <div className="my-3 border-t border-[var(--border-light)] mx-2"></div>
                )}
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-2 py-1 transition-colors rounded",
                    isActive 
                      ? "bg-[var(--bg-active)] text-[var(--text-main)] font-medium" 
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  <span className="text-[16px] flex items-center justify-center w-5">
                    {item.icon}
                  </span>
                  <span className="text-[14px]">{item.dictKey ? t(item.dictKey) : item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="px-3 mt-auto pt-4 flex flex-col gap-[2px]">
          {bottomNavItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-2 py-1 transition-colors rounded",
                  isActive 
                    ? "bg-[var(--bg-active)] text-[var(--text-main)] font-medium" 
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                )}
              >
                <span className="text-[16px] flex items-center justify-center w-5">
                  {item.icon}
                </span>
                <span className="text-[14px]">{item.dictKey ? t(item.dictKey) : item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  );
}
