'use client';

import { Sparkles, CheckCircle2, TrendingUp, MessageSquare, Briefcase, Zap } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-[800px] mx-auto w-full pt-8 pb-24 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[32px] font-semibold text-[var(--color-apple-text)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--color-apple-subtle)] mt-1">Overview of your team's pulse and tasks.</p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-6 text-[var(--color-apple-text)] text-[15px] leading-relaxed">
        
        {/* Callout / Briefing */}
        <div className="apple-card bg-gradient-to-br from-white to-blue-50/30 dark:from-[var(--color-apple-card)] dark:to-blue-900/10 p-5 flex gap-4 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8e7cff] to-[#ff8ab8] shadow-sm mt-0.5">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[16px] mb-1">Good morning. Here is your daily intelligence briefing.</p>
            <p className="text-[var(--color-apple-subtle)] text-[14px]">I've analyzed yesterday's sprint metrics and team communications. We have 3 blocking issues that require your attention today, and team sentiment is currently trending positive.</p>
          </div>
        </div>

        <h2 className="text-[20px] font-semibold mt-10 mb-4 pb-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" /> Priority Actions
        </h2>
        
        {/* To-Do List Style */}
        <div className="space-y-3">
          <div className="apple-card p-4 flex gap-3 items-start group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
            <CheckCircle2 className="mt-0.5 w-5 h-5 text-blue-500 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer" />
            <div className="flex-1">
              <span className="font-medium">Review Q3 Marketing Assets</span>
              <p className="text-[13px] text-[var(--color-apple-subtle)] mt-1">Suggested delegation: Sarah. She completes similar reviews 30% faster.</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-[12px] bg-white dark:bg-[#2c2c2e] px-3 py-1.5 rounded-full text-[var(--color-apple-text)] hover:shadow-sm transition-all border border-black/[0.06] dark:border-white/[0.06] font-medium">Delegate</button>
          </div>
          
          <div className="apple-card p-4 flex gap-3 items-start group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
            <CheckCircle2 className="mt-0.5 w-5 h-5 text-blue-500 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer" />
            <div className="flex-1">
              <span className="font-medium">Update API Documentation</span>
              <p className="text-[13px] text-[var(--color-apple-subtle)] mt-1">I can draft the initial update based on recent commit logs for David to review.</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-[12px] bg-white dark:bg-[#2c2c2e] px-3 py-1.5 rounded-full text-[var(--color-apple-text)] hover:shadow-sm transition-all border border-black/[0.06] dark:border-white/[0.06] font-medium">Auto-Draft</button>
          </div>
        </div>

        <h2 className="text-[20px] font-semibold mt-10 mb-4 pb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" /> Insights & Morale
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="apple-card p-5">
            <div className="text-[12px] text-[var(--color-apple-subtle)] uppercase tracking-wider mb-2 font-semibold">Team Velocity</div>
            <div className="text-[36px] font-semibold flex items-baseline gap-2 leading-none">
              94 <span className="text-[16px] text-[var(--color-apple-subtle)] font-normal">pts</span>
            </div>
            <div className="mt-3 flex">
              <span className="text-[12px] text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full font-medium">↑ 12% from last week</span>
            </div>
          </div>
          
          <div className="apple-card p-5">
            <div className="text-[12px] text-[var(--color-apple-subtle)] uppercase tracking-wider mb-2 font-semibold">Overall Morale</div>
            <div className="text-[36px] font-semibold flex items-baseline gap-2 leading-none">
              78%
            </div>
            <div className="mt-3 flex">
              <span className="text-[12px] text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40 px-2.5 py-1 rounded-full font-medium">Positive Trending</span>
            </div>
          </div>
        </div>

        <h2 className="text-[20px] font-semibold mt-10 mb-4 pb-2 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-500" /> Strategic Assistant
        </h2>
        
        {/* Embedded Chat Block */}
        <div className="apple-card p-5 bg-gradient-to-b from-white to-gray-50/50 dark:from-[var(--color-apple-card)] dark:to-black/20">
          <div className="space-y-5 mb-5 text-[14px]">
            <div className="flex justify-end">
              <div className="bg-[var(--color-apple-blue)] text-white px-4 py-2.5 rounded-[18px] rounded-tr-[4px] max-w-[80%] shadow-sm">
                Can you summarize the blocker on the Genesis Project?
              </div>
            </div>
            <div className="flex justify-start items-end gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e7cff] to-[#ff8ab8] shadow-sm mb-1">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <div className="bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-apple-text)] px-4 py-3 rounded-[18px] rounded-tl-[4px] max-w-[80%]">
                <p className="mb-3">The primary blocker is awaiting client sign-off on the revised data schema.</p>
                <div className="bg-white dark:bg-[#2c2c2e] p-3.5 rounded-[12px] border border-black/[0.05] dark:border-white/[0.05] shadow-sm">
                  <div className="font-semibold text-[11px] text-[var(--color-apple-subtle)] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3" /> Proposed Action
                  </div>
                  <p className="text-[13px] mb-3">Draft a follow-up email to the client highlighting the impact on the timeline?</p>
                  <button className="w-full text-[13px] font-medium bg-black text-white dark:bg-white dark:text-black px-3 py-2 rounded-[8px] hover:opacity-90 transition-opacity">Generate Draft</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative mt-2">
            <input type="text" className="w-full bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.1] rounded-full px-5 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]/50 shadow-sm transition-all" placeholder="Ask the Strategic Assistant..." />
            <button className="absolute right-2 top-2 bottom-2 bg-[var(--color-apple-blue)] text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

