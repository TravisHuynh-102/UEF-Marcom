'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Overlay/Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-[260px] flex flex-col h-screen bg-[var(--color-apple-bg)]">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        
        {/* Scrollable Content Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="w-full flex flex-col pb-24">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
