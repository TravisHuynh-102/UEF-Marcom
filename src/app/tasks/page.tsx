'use client';

export default function TasksPage() {
  return (
    <div className="flex flex-col h-full mt-4">
      {/* Notion Database Header (Title & Views) */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-[var(--text-main)] mb-6 tracking-tight flex items-center gap-2">
          <span className="text-[32px] select-none">✅</span> My Tasks
        </h1>
        
        {/* View Tabs */}
        <div className="flex items-center border-b border-[var(--border-light)] gap-4 px-2">
          <div className="text-[14px] font-medium border-b-2 border-[var(--text-main)] pb-2 text-[var(--text-main)] cursor-pointer">
            Board View
          </div>
          <div className="text-[14px] pb-2 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-main)] transition-colors">
            Table View
          </div>
          <div className="text-[14px] pb-2 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-main)] transition-colors">
            Timeline
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 text-[14px]">
        <div className="flex gap-3 text-[var(--text-muted)]">
          <button className="hover:bg-[var(--bg-hover)] px-2 py-1 rounded transition-colors flex items-center gap-1">Filter</button>
          <button className="hover:bg-[var(--bg-hover)] px-2 py-1 rounded transition-colors flex items-center gap-1">Sort</button>
          <button className="hover:bg-[var(--bg-hover)] px-2 py-1 rounded transition-colors flex items-center gap-1">Search</button>
        </div>
        <button className="bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
          New
        </button>
      </div>

      {/* Notion Board Columns */}
      <div className="flex-1 overflow-x-auto flex gap-6 pb-4">
        
        {/* Column: To Do */}
        <div className="w-[260px] shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-3 px-1 text-[14px] font-medium text-[var(--text-main)]">
            <span className="w-4 h-4 rounded-[3px] bg-red-100 text-red-600 flex items-center justify-center text-[10px]">•</span>
            To Do
            <span className="text-[var(--text-muted)] font-normal text-[12px] ml-1">4</span>
            <span className="ml-auto text-[var(--text-muted)] hover:bg-[var(--bg-hover)] w-6 h-6 flex items-center justify-center rounded cursor-pointer">+</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {/* Card 1 */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-light)] rounded-[4px] shadow-sm p-3 group hover:bg-[var(--bg-hover)] cursor-pointer transition-colors text-[14px]">
              <div className="font-medium text-[var(--text-main)] mb-1 leading-snug">Design Genesis Landing Page</div>
              <div className="text-[var(--text-muted)] text-[12px] mb-3 line-clamp-2 leading-relaxed">Create the initial wireframes and high-fidelity mockups for the Genesis project.</div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">High Priority</span>
                <div className="w-5 h-5 rounded-full bg-[var(--border-light)] flex items-center justify-center text-[9px] font-medium">JD</div>
              </div>
            </div>

            {/* Empty Drop Zone */}
            <div className="h-8 hover:bg-[var(--bg-hover)] rounded-[4px] border border-transparent transition-colors flex items-center px-3 cursor-pointer text-[14px] text-[var(--text-muted)] opacity-0 group-hover:opacity-100">+ New</div>
          </div>
        </div>

        {/* Column: In Progress */}
        <div className="w-[260px] shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-3 px-1 text-[14px] font-medium text-[var(--text-main)]">
            <span className="w-4 h-4 rounded-[3px] bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">•</span>
            In Progress
            <span className="text-[var(--text-muted)] font-normal text-[12px] ml-1">2</span>
            <span className="ml-auto text-[var(--text-muted)] hover:bg-[var(--bg-hover)] w-6 h-6 flex items-center justify-center rounded cursor-pointer">+</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {/* Card 2 */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-light)] rounded-[4px] shadow-sm p-3 group hover:bg-[var(--bg-hover)] cursor-pointer transition-colors text-[14px]">
              <div className="font-medium text-[var(--text-main)] mb-3 leading-snug">Develop Auth Flow</div>
              <div className="w-full bg-[var(--border-light)] h-1 rounded-full mb-3">
                <div className="bg-blue-500 h-1 rounded-full w-[65%]"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Medium</span>
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-[var(--border-light)] flex items-center justify-center text-[9px] font-medium border border-[var(--bg-main)]">MR</div>
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-[9px] font-medium border border-[var(--bg-main)]">AK</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column: In Review */}
        <div className="w-[260px] shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-3 px-1 text-[14px] font-medium text-[var(--text-main)]">
            <span className="w-4 h-4 rounded-[3px] bg-purple-100 text-purple-600 flex items-center justify-center text-[10px]">•</span>
            In Review
            <span className="text-[var(--text-muted)] font-normal text-[12px] ml-1">1</span>
            <span className="ml-auto text-[var(--text-muted)] hover:bg-[var(--bg-hover)] w-6 h-6 flex items-center justify-center rounded cursor-pointer">+</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {/* Card 3 */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-light)] rounded-[4px] shadow-sm p-3 group hover:bg-[var(--bg-hover)] cursor-pointer transition-colors text-[14px]">
              <div className="font-medium text-[var(--text-main)] mb-1 leading-snug">Update Brand Guidelines</div>
              <div className="text-[var(--text-muted)] text-[12px] mb-3 line-clamp-2 leading-relaxed">Incorporate the new logo variations into the core brand documentation.</div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] px-1.5 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-main)]">Low Priority</span>
                <div className="w-5 h-5 rounded-full bg-[var(--border-light)] flex items-center justify-center text-[9px] font-medium">TS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Column: Done */}
        <div className="w-[260px] shrink-0 flex flex-col opacity-60">
          <div className="flex items-center gap-2 mb-3 px-1 text-[14px] font-medium text-[var(--text-main)]">
            <span className="w-4 h-4 rounded-[3px] bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">•</span>
            Done
            <span className="text-[var(--text-muted)] font-normal text-[12px] ml-1">12</span>
            <span className="ml-auto text-[var(--text-muted)] hover:bg-[var(--bg-hover)] w-6 h-6 flex items-center justify-center rounded cursor-pointer">+</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {/* Card 4 */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-light)] rounded-[4px] shadow-sm p-3 group hover:bg-[var(--bg-hover)] cursor-pointer transition-colors text-[14px]">
              <div className="font-medium text-[var(--text-muted)] line-through mb-3 leading-snug">Q2 KPI Review Report</div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--text-muted)]">Yesterday</span>
                <div className="w-5 h-5 rounded-full bg-[var(--border-light)] flex items-center justify-center text-[9px] font-medium text-[var(--text-muted)]">JD</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Column */}
        <div className="w-[260px] shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-3 px-1 text-[14px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer transition-colors">
            + Add a group
          </div>
        </div>
      </div>
    </div>
  );
}
