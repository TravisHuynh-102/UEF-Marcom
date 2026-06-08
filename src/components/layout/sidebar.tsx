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
  { label: 'Dashboard', dictKey: 'sidebar.dashboard', icon: 'dashboard', href: '/' },
  { label: 'Projects', icon: 'folder', href: '/projects' },
  { label: 'My Tasks', icon: 'assignment', href: '/tasks' },
  { label: 'Content Calendar', dictKey: 'sidebar.contentCalendar', icon: 'calendar_today', href: '/content-calendar' },
  { label: 'Work Calendar', dictKey: 'sidebar.workCalendar', icon: 'event', href: '/work-calendar' },
  { label: 'Creative Performance', dictKey: 'sidebar.creativePerformance', icon: 'trending_up', href: '/creative-performance', separatorBefore: true },
  { label: 'Team Performance', icon: 'group', href: '/performance' },
  { label: 'AI Chief of Staff', icon: 'smart_toy', href: '/ai-assistant', isAI: true, separatorBefore: true },
  { label: 'Knowledge Hub', dictKey: 'sidebar.knowledgeHub', icon: 'book', href: '/knowledge' },
  { label: 'Notes', dictKey: 'sidebar.notes', icon: 'edit_document', href: '/notes' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', dictKey: 'sidebar.settings', icon: 'settings', href: '/settings' },
  { label: 'Support', icon: 'help', href: '/support' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole } = useRole();
  const { t } = useLanguage();

  return (
    <>
      <nav className={cn(
        "fixed left-0 top-0 h-screen w-sidebar_width glass border-r border-outline-variant flex flex-col py-lg z-20 transition-transform duration-300 md:translate-x-0 shadow-lg",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="px-gutter mb-lg">
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
            </div>
            TeamOS AI
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Productivity Engine</p>
        </div>

        {/* AI Action */}
        <div className="px-4 mb-lg">
          <button className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover-lift shadow-glow">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            AI Generate Content
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-3">
          {mainNavItems.filter(item => canAccessRoute(currentRole, item.href)).map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <React.Fragment key={item.href}>
                {item.separatorBefore && (
                  <div className="my-2 border-t border-outline-variant/30"></div>
                )}
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl font-label-md text-label-md group transition-smooth",
                    isActive 
                      ? "bg-primary-container text-primary shadow-sm" 
                      : item.isAI
                        ? "text-primary hover:bg-surface-container hover:shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:shadow-sm"
                  )}
                >
                  <span className={cn(
                    "material-symbols-outlined text-[20px] transition-colors",
                    isActive ? "text-primary" : item.isAI ? "" : "group-hover:text-on-surface"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.dictKey ? t(item.dictKey) : item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto px-3 flex flex-col gap-1 pt-4 border-t border-outline-variant/50">
          {bottomNavItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md font-label-md text-label-md group transition-colors",
                  isActive 
                    ? "bg-surface-container text-on-surface border-l-2 border-primary rounded-l-none" 
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )}
              >
                <span className={cn(
                  "material-symbols-outlined text-[20px] transition-colors",
                  isActive ? "text-primary" : "group-hover:text-on-surface"
                )}>
                  {item.icon}
                </span>
                <span>{item.dictKey ? t(item.dictKey) : item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  );
}
