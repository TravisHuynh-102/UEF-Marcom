'use client';

export default function DashboardPage() {
  return (
    <div className="max-w-[800px] mx-auto w-full pt-12 pb-24">
      {/* Icon */}
      <div className="text-[78px] mb-4 leading-none select-none">🏠</div>
      
      {/* Title */}
      <h1 className="text-[40px] font-bold text-[var(--text-main)] mb-8 tracking-tight">Dashboard</h1>

      {/* Content Blocks */}
      <div className="space-y-6 text-[var(--text-main)] text-[16px] leading-relaxed">
        
        {/* Callout */}
        <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded px-4 py-3 flex gap-3 items-start">
          <div className="text-[20px] select-none">✨</div>
          <div>
            <p className="font-medium mb-1">Good morning. Here is your daily intelligence briefing.</p>
            <p className="text-[var(--text-muted)] text-[14px]">I've analyzed yesterday's sprint metrics and team communications. We have 3 blocking issues that require your attention today, and team sentiment is currently trending positive.</p>
          </div>
        </div>

        <h2 className="text-[24px] font-semibold mt-12 mb-4 border-b border-[var(--border-light)] pb-2 flex items-center gap-2">
          <span className="text-[24px]">🔥</span> Priority Actions
        </h2>
        
        {/* To-Do List Style */}
        <div className="space-y-3">
          <div className="flex gap-3 items-start group">
            <input type="checkbox" className="mt-1.5 w-4 h-4 rounded border-[var(--border-main)] text-blue-500 cursor-pointer" />
            <div className="flex-1">
              <span className="font-medium">Review Q3 Marketing Assets</span>
              <p className="text-[14px] text-[var(--text-muted)] mt-0.5">Suggested delegation: Sarah. She completes similar reviews 30% faster.</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-[12px] bg-[var(--bg-hover)] px-2 py-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-opacity border border-[var(--border-light)]">Delegate</button>
          </div>
          
          <div className="flex gap-3 items-start group">
            <input type="checkbox" className="mt-1.5 w-4 h-4 rounded border-[var(--border-main)] text-blue-500 cursor-pointer" />
            <div className="flex-1">
              <span className="font-medium">Update API Documentation</span>
              <p className="text-[14px] text-[var(--text-muted)] mt-0.5">I can draft the initial update based on recent commit logs for David to review.</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-[12px] bg-[var(--bg-hover)] px-2 py-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-opacity border border-[var(--border-light)]">Auto-Draft</button>
          </div>
        </div>

        <h2 className="text-[24px] font-semibold mt-12 mb-4 border-b border-[var(--border-light)] pb-2 flex items-center gap-2">
          <span className="text-[24px]">📈</span> Insights & Morale
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <div className="text-[12px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-semibold">Team Velocity</div>
            <div className="text-[36px] font-semibold flex items-center gap-3 leading-none">
              94 <span className="text-[16px] text-[var(--text-muted)] font-normal mt-2">pts</span>
              <span className="text-[12px] text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 px-2 py-1 rounded font-medium mt-2">↑ 12%</span>
            </div>
          </div>
          
          <div>
            <div className="text-[12px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-semibold">Overall Morale</div>
            <div className="text-[36px] font-semibold flex items-center gap-3 leading-none">
              78% 
              <span className="text-[12px] text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 px-2 py-1 rounded font-medium mt-2">Positive</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-[12px] px-2 py-1 bg-[var(--bg-hover)] rounded border border-[var(--border-light)] text-[var(--text-muted)] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Design System
              </span>
              <span className="text-[12px] px-2 py-1 bg-[var(--bg-hover)] rounded border border-[var(--border-light)] text-[var(--text-muted)] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Deploy Pipeline
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-[24px] font-semibold mt-12 mb-4 border-b border-[var(--border-light)] pb-2 flex items-center gap-2">
          <span className="text-[24px]">🤖</span> Chat with AI
        </h2>
        
        {/* Embedded Chat Block */}
        <div className="border border-[var(--border-light)] rounded bg-[var(--bg-sidebar)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[20px]">💬</span>
            <span className="font-medium">Strategic Assistant</span>
          </div>
          
          <div className="space-y-4 mb-4 text-[14px]">
            <div className="flex justify-end">
              <div className="bg-[var(--border-light)] px-3 py-2 rounded-lg rounded-tr-sm max-w-[80%]">
                Can you summarize the blocker on the Genesis Project?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-[var(--bg-main)] border border-[var(--border-light)] px-3 py-2 rounded-lg rounded-tl-sm max-w-[80%]">
                <p className="mb-2">The primary blocker is awaiting client sign-off on the revised data schema.</p>
                <div className="bg-[var(--bg-sidebar)] p-3 rounded border border-[var(--border-light)]">
                  <div className="font-medium text-[12px] text-[var(--text-muted)] mb-1 uppercase tracking-wider">Proposed Action</div>
                  <p>Draft a follow-up email to the client highlighting the impact on the timeline?</p>
                  <button className="mt-2 text-[12px] bg-[var(--bg-main)] border border-[var(--border-light)] px-2 py-1 rounded hover:bg-[var(--bg-hover)] transition-colors">Generate Draft</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <input type="text" className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded px-3 py-2 text-[14px] focus:outline-none focus:border-[var(--border-main)]" placeholder="Type a command or ask a question..." />
          </div>
        </div>
      </div>
    </div>
  );
}
