'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        'flex h-screen overflow-hidden',
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#0a0a0f] to-[#0d0d1a]'
          : 'bg-gray-50'
      )}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative z-10 h-full w-[260px] animate-in slide-in-from-left duration-300">
            <Sidebar />
          </div>
          {/* Close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Hamburger + Header */}
        <div className="relative">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={cn(
              'absolute left-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg md:hidden transition-colors',
              theme === 'dark'
                ? 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Header />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
