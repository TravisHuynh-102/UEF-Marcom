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
        "fixed left-0 top-0 h-screen w-[260px] bg-[#121212] border-r border-[#2C2C2C] flex flex-col py-lg z-50 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="px-6 mb-8 flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#9D5DFF]/20 flex items-center justify-center text-[#9D5DFF]">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>hub</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-white">TeamOS AI</h1>
          </div>
          <p className="font-label-md text-label-md text-[#A4A4A4] uppercase tracking-wider">Productivity Engine</p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {mainNavItems.filter(item => canAccessRoute(currentRole, item.href)).map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <React.Fragment key={item.href}>
                {item.separatorBefore && (
                  <div className="my-2 border-t border-[#2C2C2C]"></div>
                )}
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 transition-colors",
                    isActive 
                      ? "bg-[#202020] border-l-2 border-[#9D5DFF] text-white font-bold rounded-r-lg -ml-2 pl-6" 
                      : "text-[#A4A4A4] hover:bg-[#202020] hover:text-white rounded-lg"
                  )}
                >
                  <span className={cn(
                    "material-symbols-outlined",
                    isActive ? "text-[#9D5DFF]" : ""
                  )} style={{ fontSize: '20px', fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                    {item.icon}
                  </span>
                  <span className="font-body-sm text-body-sm">{item.dictKey ? t(item.dictKey) : item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        {/* CTA & Footer Actions */}
        <div className="px-4 mt-auto pt-6 flex flex-col gap-4 border-t border-[#2C2C2C] mx-2">
          <button className="w-full flex items-center justify-center gap-2 bg-[#9D5DFF] text-white py-2 rounded-xl font-body-sm text-body-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_awesome</span>
            AI Generate Content
          </button>
          
          <div className="flex flex-col gap-1">
            {bottomNavItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 transition-colors rounded-lg",
                    isActive 
                      ? "bg-[#202020] text-white" 
                      : "text-[#A4A4A4] hover:bg-[#202020] hover:text-white"
                  )}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {item.icon}
                  </span>
                  <span className="font-body-sm text-body-sm">{item.dictKey ? t(item.dictKey) : item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
