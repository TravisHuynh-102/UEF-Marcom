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
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="ml-0 md:ml-[260px] flex-1 flex flex-col h-screen overflow-hidden bg-transparent">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-gutter lg:p-xl scroll-smooth">
          <div className="max-w-max_content_width mx-auto w-full flex flex-col gap-lg">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
