'use client';

export default function TasksPage() {
  return (
    <>
      {/* Header Actions */}
      <div className="flex items-center justify-between shrink-0 mb-6 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#121212] rounded-lg p-1 border border-[#2C2C2C]">
            <button className="px-3 py-1.5 rounded-md bg-[#202020] text-white font-label-md text-label-md shadow-sm">Board</button>
            <button className="px-3 py-1.5 rounded-md text-[#A4A4A4] hover:text-white font-label-md text-label-md transition-colors">List</button>
            <button className="px-3 py-1.5 rounded-md text-[#A4A4A4] hover:text-white font-label-md text-label-md transition-colors">Timeline</button>
          </div>
          <div className="h-6 w-px bg-[#2C2C2C]"></div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2C2C2C] text-[#A4A4A4] hover:text-white hover:bg-[#202020] transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2C2C2C] text-[#A4A4A4] hover:text-white hover:bg-[#202020] transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">group</span> Assignee
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#9D5DFF] text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">add</span> New Task
        </button>
      </div>

      {/* Main Content Area: Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar flex gap-gutter pb-4">
        {/* Column: TO DO */}
        <div className="min-w-[320px] max-w-[320px] bg-[#191919] rounded-xl flex flex-col h-[calc(100vh-160px)] border border-[#2C2C2C]">
          <div className="p-4 border-b border-[#2C2C2C] flex items-center justify-between sticky top-0 bg-[#191919] z-10 rounded-t-xl">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md text-white">To Do</h3>
              <span className="bg-[#202020] text-[#A4A4A4] font-label-sm px-2 py-0.5 rounded-full border border-[#2C2C2C]">4</span>
            </div>
            <button className="text-[#A4A4A4] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {/* Card 1 */}
            <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-4 hover:border-[#9D5DFF] transition-colors cursor-grab block-container">
              <span className="material-symbols-outlined drag-handle">drag_indicator</span>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-red-500/10 text-red-400 font-label-sm px-2 py-1 rounded border border-red-500/20">High Priority</span>
                <button className="text-[#A4A4A4] hover:text-white"><span className="material-symbols-outlined text-[16px]">more_horiz</span></button>
              </div>
              <h4 className="font-body-md text-body-md font-semibold text-white mb-2">Design Genesis Landing Page</h4>
              <p className="font-body-sm text-body-sm text-[#A4A4A4] mb-4 line-clamp-2">Create the initial wireframes and high-fidelity mockups for the Genesis project.</p>
              <div className="flex justify-between items-center mt-auto border-t border-[#2C2C2C] pt-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#121212] border border-[#202020] flex items-center justify-center text-[10px] font-bold text-white">JD</div>
                </div>
                <div className="flex items-center gap-3 text-[#A4A4A4] font-label-md">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">chat_bubble</span> 3</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">attach_file</span> 1</span>
                </div>
              </div>
            </div>
            {/* Add Card Button inside column */}
            <button className="w-full py-2 border border-dashed border-[#2C2C2C] rounded-xl text-[#A4A4A4] hover:text-white hover:border-[#A4A4A4] transition-colors font-body-sm text-body-sm flex items-center justify-center gap-1 mt-2">
              <span className="material-symbols-outlined text-[16px]">add</span> Add Task
            </button>
          </div>
        </div>

        {/* Column: IN PROGRESS */}
        <div className="min-w-[320px] max-w-[320px] bg-[#191919] rounded-xl flex flex-col h-[calc(100vh-160px)] border border-[#2C2C2C]">
          <div className="p-4 border-b border-[#2C2C2C] flex items-center justify-between sticky top-0 bg-[#191919] z-10 rounded-t-xl border-t-[3px] border-t-[#9D5DFF]">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md text-white">In Progress</h3>
              <span className="bg-[#9D5DFF]/10 text-[#9D5DFF] font-label-sm px-2 py-0.5 rounded-full border border-[#9D5DFF]/20">2</span>
            </div>
            <button className="text-[#A4A4A4] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {/* Card 2 */}
            <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-4 hover:border-[#9D5DFF] transition-colors cursor-grab block-container">
              <span className="material-symbols-outlined drag-handle">drag_indicator</span>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-amber-500/10 text-amber-400 font-label-sm px-2 py-1 rounded border border-amber-500/20">Medium Priority</span>
              </div>
              <h4 className="font-body-md text-body-md font-semibold text-white mb-2">Develop Auth Flow</h4>
              <div className="w-full bg-[#121212] rounded-full h-1.5 mb-3 border border-[#2C2C2C]">
                <div className="bg-[#9D5DFF] h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-auto border-t border-[#2C2C2C] pt-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#121212] border border-[#202020] flex items-center justify-center text-[10px] font-bold text-white">MR</div>
                  <div className="w-6 h-6 rounded-full bg-[#9D5DFF] border border-[#202020] flex items-center justify-center text-[10px] font-bold text-white">AK</div>
                </div>
                <span className="text-[#A4A4A4] font-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column: IN REVIEW */}
        <div className="min-w-[320px] max-w-[320px] bg-[#191919] rounded-xl flex flex-col h-[calc(100vh-160px)] border border-[#2C2C2C]">
          <div className="p-4 border-b border-[#2C2C2C] flex items-center justify-between sticky top-0 bg-[#191919] z-10 rounded-t-xl border-t-[3px] border-t-emerald-400">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md text-white">In Review</h3>
              <span className="bg-emerald-400/10 text-emerald-400 font-label-sm px-2 py-0.5 rounded-full border border-emerald-400/20">1</span>
            </div>
            <button className="text-[#A4A4A4] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {/* Card 3 */}
            <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-4 hover:border-[#9D5DFF] transition-colors cursor-grab block-container">
              <span className="material-symbols-outlined drag-handle">drag_indicator</span>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-[#121212] text-[#A4A4A4] font-label-sm px-2 py-1 rounded border border-[#2C2C2C]">Low Priority</span>
              </div>
              <h4 className="font-body-md text-body-md font-semibold text-white mb-2">Update Brand Guidelines</h4>
              <p className="font-body-sm text-body-sm text-[#A4A4A4] mb-4 line-clamp-2">Incorporate the new logo variations into the core brand documentation.</p>
              <div className="flex justify-between items-center mt-auto border-t border-[#2C2C2C] pt-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#121212] border border-[#202020] flex items-center justify-center text-[10px] font-bold text-white">TS</div>
                </div>
                <div className="flex items-center gap-3 text-[#A4A4A4] font-label-md">
                  <span className="flex items-center gap-1 text-emerald-400"><span className="material-symbols-outlined text-[14px]">check_circle</span> Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column: DONE */}
        <div className="min-w-[320px] max-w-[320px] bg-[#191919] rounded-xl flex flex-col h-[calc(100vh-160px)] border border-[#2C2C2C]">
          <div className="p-4 border-b border-[#2C2C2C] flex items-center justify-between sticky top-0 bg-[#191919] z-10 rounded-t-xl opacity-60">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md text-white">Done</h3>
              <span className="bg-[#121212] text-[#A4A4A4] font-label-sm px-2 py-0.5 rounded-full border border-[#2C2C2C]">12</span>
            </div>
            <button className="text-[#A4A4A4] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar opacity-60">
            {/* Card 4 */}
            <div className="bg-[#121212] border border-[#2C2C2C] rounded-xl p-4 hover:border-[#9D5DFF] transition-colors cursor-grab block-container">
              <span className="material-symbols-outlined drag-handle">drag_indicator</span>
              <h4 className="font-body-md text-body-md font-semibold text-[#A4A4A4] line-through mb-2">Q2 KPI Review Report</h4>
              <div className="flex justify-between items-center mt-auto border-t border-[#2C2C2C] pt-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#202020] border border-[#2C2C2C] flex items-center justify-center text-[10px] font-bold text-[#A4A4A4]">JD</div>
                </div>
                <span className="text-[#A4A4A4] font-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">done_all</span> Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
