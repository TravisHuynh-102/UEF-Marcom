'use client';

export default function DashboardPage() {
  return (
    <>
      {/* Welcome/Status Hero Block */}
      <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-6 relative overflow-hidden group hover:bg-[#252525] transition-colors block-container">
        <span className="material-symbols-outlined drag-handle">drag_indicator</span>
        {/* Decorative AI background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#9D5DFF] rounded-full mix-blend-screen filter blur-[100px] opacity-5 pointer-events-none"></div>
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#9D5DFF]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">System Status: Optimal</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-white">Good morning. Here is your daily intelligence briefing.</h3>
            <p className="font-body-md text-body-md text-[#A4A4A4] max-w-2xl">I've analyzed yesterday's sprint metrics and team communications. We have 3 blocking issues that require your attention today, and team sentiment is currently trending positive.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="bg-transparent border border-[#2C2C2C] text-[#A4A4A4] hover:text-white hover:bg-[#2A2A2A] px-4 py-2 rounded-lg transition-colors font-label-md text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Refresh Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Left Column: Priority Actions & Delegation */}
        <div className="md:col-span-2 space-y-gutter">
          {/* AI Suggested Delegations Block */}
          <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-6 block-container hover:bg-[#252525] transition-colors">
            <span className="material-symbols-outlined drag-handle">drag_indicator</span>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-headline-md text-headline-md text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9D5DFF]">robot_2</span>
                Suggested Delegations
              </h4>
              <span className="font-label-md text-label-md px-2 py-1 rounded-lg bg-[#121212] text-[#A4A4A4] border border-[#2C2C2C]">4 Actions Pending</span>
            </div>
            <div className="space-y-3">
              {/* Task Item */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#191919] border-l-2 border-[#9D5DFF] hover:bg-[#252525] transition-colors group/task">
                <div className="w-8 h-8 rounded-lg bg-[#9D5DFF]/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[#9D5DFF] text-[18px]">design_services</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-body-md text-body-md font-semibold text-white">Review Q3 Marketing Assets</h5>
                  <p className="font-body-sm text-body-sm text-[#A4A4A4] mt-1">Sarah has high availability today. Historic data shows she completes similar reviews 30% faster than average.</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover/task:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg bg-[#9D5DFF] text-white hover:opacity-90" title="Delegate to Sarah">
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                  <button className="p-1.5 rounded-lg border border-[#2C2C2C] text-[#A4A4A4] hover:text-white hover:bg-[#2A2A2A]" title="Dismiss">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
              
              {/* Task Item */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#191919] border-l-2 border-[#2C2C2C] hover:bg-[#252525] transition-colors group/task">
                <div className="w-8 h-8 rounded-lg bg-[#121212] flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[#A4A4A4] text-[18px]">code</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-body-md text-body-md font-semibold text-white">Update API Documentation</h5>
                  <p className="font-body-sm text-body-sm text-[#A4A4A4] mt-1">I can draft the initial update based on recent commit logs for David to review.</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover/task:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg bg-[#9D5DFF] text-white hover:opacity-90" title="Auto-Draft">
                    <span className="material-symbols-outlined text-[16px]">magic_button</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface Block */}
          <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-6 flex flex-col h-[400px] block-container relative hover:bg-[#252525] transition-colors">
            <span className="material-symbols-outlined drag-handle">drag_indicator</span>
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <span className="material-symbols-outlined text-white">chat_bubble</span>
              <h4 className="font-headline-md text-headline-md text-white">Strategic Assistant</h4>
            </div>
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-[#2A2A2A] rounded-xl rounded-tr-none p-3 max-w-[80%]">
                  <p className="font-body-sm text-body-sm text-white">Can you summarize the blocker on the Genesis Project?</p>
                </div>
              </div>
              {/* AI Message */}
              <div className="flex justify-start">
                <div className="bg-[#191919] rounded-xl rounded-tl-none p-4 max-w-[85%] border-l-2 border-[#9D5DFF]">
                  <p className="font-body-sm text-body-sm text-white mb-2">The primary blocker is awaiting client sign-off on the revised data schema. </p>
                  <div className="bg-[#121212] p-3 rounded-xl border border-[#2C2C2C] mt-2">
                    <div className="flex items-center gap-2 text-[#A4A4A4] mb-1">
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      <span className="font-label-md text-label-md">Proposed Action</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-white">Draft a follow-up email to the client highlighting the impact on the timeline?</p>
                    <button className="mt-2 bg-transparent border border-[#2C2C2C] text-[#A4A4A4] hover:text-white hover:bg-[#2A2A2A] px-3 py-1 rounded-lg text-xs transition-colors">Generate Draft</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Chat Input */}
            <div className="shrink-0 relative">
              <input className="w-full bg-[#121212] border border-[#2C2C2C] text-white rounded-lg p-3 pr-12 focus:outline-none focus:border-[#9D5DFF] focus:ring-1 focus:ring-[#9D5DFF] transition-all font-body-sm text-body-sm placeholder:text-[#A4A4A4]" placeholder="Type a command or ask a question..." type="text" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#A4A4A4] hover:text-[#9D5DFF] transition-colors">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Sentiment */}
        <div className="space-y-gutter">
          {/* AI Insights / Performance Block */}
          <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-6 block-container hover:bg-[#252525] transition-colors">
            <span className="material-symbols-outlined drag-handle">drag_indicator</span>
            <h4 className="font-headline-md text-headline-md text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">insights</span>
              Velocity Insights
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-label-md text-label-md text-[#A4A4A4] mb-1">TEAM VELOCITY</p>
                  <p className="text-3xl font-bold text-white">94<span className="text-lg font-normal text-[#A4A4A4]"> pts</span></p>
                </div>
                <div className="flex items-center text-emerald-400 gap-1 font-label-md text-label-md bg-emerald-400/10 px-2 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  12%
                </div>
              </div>
              {/* Decorative Chart Area */}
              <div className="h-24 w-full flex items-end gap-1 pt-4">
                <div className="w-full bg-[#2C2C2C] rounded-t-lg h-[40%] hover:bg-[#9D5DFF] transition-colors cursor-pointer"></div>
                <div className="w-full bg-[#2C2C2C] rounded-t-lg h-[60%] hover:bg-[#9D5DFF] transition-colors cursor-pointer"></div>
                <div className="w-full bg-[#2C2C2C] rounded-t-lg h-[30%] hover:bg-[#9D5DFF] transition-colors cursor-pointer"></div>
                <div className="w-full bg-[#2C2C2C] rounded-t-lg h-[80%] hover:bg-[#9D5DFF] transition-colors cursor-pointer"></div>
                <div className="w-full bg-[#9D5DFF] rounded-t-lg h-[100%] shadow-[0_0_10px_rgba(157,93,255,0.4)] cursor-pointer"></div>
                <div className="w-full bg-[#2C2C2C] rounded-t-lg h-[70%] hover:bg-[#9D5DFF] transition-colors cursor-pointer"></div>
              </div>
              <p className="font-body-sm text-body-sm text-[#A4A4A4] text-center mt-2">Current Sprint vs Average</p>
            </div>
          </div>

          {/* Voice of the Team / Sentiment Block */}
          <div className="bg-[#202020] border border-[#2C2C2C] rounded-xl p-6 block-container hover:bg-[#252525] transition-colors">
            <span className="material-symbols-outlined drag-handle">drag_indicator</span>
            <h4 className="font-headline-md text-headline-md text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#9D5DFF]">record_voice_over</span>
              Voice of the Team
            </h4>
            <p className="font-body-sm text-body-sm text-[#A4A4A4] mb-4">Analyzed from Slack, PR comments, and standup notes.</p>
            <div className="space-y-4">
              {/* Sentiment Meter */}
              <div>
                <div className="flex justify-between font-label-md text-label-md mb-2">
                  <span className="text-white">Overall Morale</span>
                  <span className="text-[#9D5DFF]">Positive (78%)</span>
                </div>
                <div className="h-2 w-full bg-[#2C2C2C] rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-error via-tertiary to-[#9D5DFF]" style={{ width: '78%' }}></div>
                </div>
              </div>
              {/* Key Themes */}
              <div className="space-y-2 mt-4 pt-4 border-t border-[#2C2C2C]">
                <p className="font-label-md text-label-md text-[#A4A4A4] mb-2">KEY THEMES DETECTED</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-lg bg-[#121212] border border-[#2C2C2C] text-white font-body-sm text-body-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> "Design System"
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#121212] border border-[#2C2C2C] text-white font-body-sm text-body-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span> "Deploy Pipeline"
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#121212] border border-[#2C2C2C] text-white font-body-sm text-body-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#9D5DFF]"></span> "Hackathon"
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
