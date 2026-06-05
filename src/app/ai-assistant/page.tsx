'use client';

import { useState } from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  FileText,
  Heart,
  BarChart3,
  Calendar,
  Clock,
  MessageSquare,
  ArrowRight,
  Bot,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock chat data                                                     */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  name: string;
  timestamp: string;
  content: string;
  /** If true the content string is treated as raw HTML-like rich text */
  rich?: boolean;
}

const chatMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'ai',
    name: 'AI Chief of Staff',
    timestamp: '9:00 AM',
    content: 'Good morning, Sarah. Here\'s your operational briefing for today.',
  },
  {
    id: 'm2',
    role: 'ai',
    name: 'AI Chief of Staff',
    timestamp: '9:01 AM',
    rich: true,
    content: `I've analyzed your team's current status across all active projects. Here's what needs your attention:

• **Project Alpha** is at 68% completion but flagged **At Risk** — the design team is stretched across 3 projects simultaneously.
• **Data Pipeline Migration** has been **blocked for 48 hours** due to an AWS credential rotation issue. Marcus needs DevOps support.
• **Client Portal Beta** is ahead of schedule at 89% — great momentum from Aisha and Priya.
• Aisha Patel is operating at **95% capacity** — highest on the team. Burnout risk is elevated.`,
  },
  {
    id: 'm3',
    role: 'user',
    name: 'Sarah Chen',
    timestamp: '9:03 AM',
    content: 'What\'s the status of Project Alpha?',
  },
  {
    id: 'm4',
    role: 'ai',
    name: 'AI Chief of Staff',
    timestamp: '9:03 AM',
    rich: true,
    content: `**Project Alpha — Platform Redesign**

**Progress:** 68% complete · Due Jun 20
**Risk Level:** ⚠️ At Risk
**Lead:** Marcus Rodriguez

**Key Issues:**
• Design resources are over-allocated — Aisha Patel is assigned to Alpha, Client Portal, and AI Integration simultaneously.
• 3 high-priority tasks remain unfinished, including dashboard wireframes (due today).
• Sprint velocity has dropped 12% over the last two sprints.

**Risk Factors:**
1. Resource bottleneck on the design team
2. Dependency on the Data Pipeline migration (currently blocked)
3. Two critical bugs in the auth flow still open

**Recommendations:**
• Reassign 1–2 of Aisha's lower-priority tasks to free up bandwidth.
• Escalate the AWS credential issue to DevOps immediately.
• Consider extending the deadline by 3 days to reduce pressure without impacting Q3 goals.`,
  },
  {
    id: 'm5',
    role: 'user',
    name: 'Sarah Chen',
    timestamp: '9:05 AM',
    content: 'Can you reassign some tasks from Aisha to reduce her workload?',
  },
  {
    id: 'm6',
    role: 'ai',
    name: 'AI Chief of Staff',
    timestamp: '9:05 AM',
    rich: true,
    content: `Absolutely. I've analyzed Aisha's current workload and suggest the following reassignments:

**Task Reassignment Plan:**

1. **"Design onboarding flow"** (Client Portal · Low priority)
   → Move to **Priya Sharma** (currently at 42% capacity)
   _Reasoning: Priya is already on the Client Portal team and has bandwidth._

2. **"Update brand guidelines document"** (Q3 Marketing · Low priority)
   → Move to **Alex Thompson** (currently at 85% capacity)
   _Reasoning: Alex is in Marketing and familiar with brand assets._

**Impact:**
• Aisha's capacity drops from **95% → ~72%** (safe zone)
• No task changes on her critical Project Alpha work
• Both recipients have relevant context for these tasks

Shall I proceed with these reassignments?`,
  },
];

const quickActions = [
  { label: 'Generate Weekly Report', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { label: 'Team Health Check', icon: Heart, color: 'from-rose-500 to-pink-500' },
  { label: 'Optimize Workload', icon: BarChart3, color: 'from-amber-500 to-orange-500' },
  { label: 'Schedule 1:1s', icon: Calendar, color: 'from-emerald-500 to-teal-500' },
];

const recentTopics = [
  { text: 'Project Alpha risk analysis', time: '9:05 AM' },
  { text: 'Marketing team burnout', time: 'Yesterday' },
  { text: 'Q3 budget review', time: 'Mon' },
  { text: 'Sprint velocity report', time: 'Last Fri' },
];

const suggestedQuestions = [
  'Who needs support this week?',
  'What are the top 3 risks?',
  'Summarize yesterday\'s meetings',
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Very simple markdown-like renderer for bold + bullets */
function RichText({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed">
      {lines.map((line, i) => {
        if (line.trim() === '') return <div key={i} className="h-1.5" />;

        // Replace **bold** fragments
        const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          // Replace _italic_ fragments
          if (part.startsWith('_') && part.endsWith('_')) {
            return (
              <em key={j} className="opacity-70">
                {part.slice(1, -1)}
              </em>
            );
          }
          return part;
        });

        const isBullet = line.trimStart().startsWith('•') || line.trimStart().startsWith('-');
        const isNumbered = /^\d+\./.test(line.trimStart());

        if (isBullet || isNumbered) {
          return (
            <div key={i} className={cn('flex gap-2', isBullet ? 'pl-1' : 'pl-1')}>
              <span className="shrink-0 opacity-50">{isBullet ? '•' : ''}</span>
              <span>{isBullet ? parts.slice(0).map((p, idx) => (typeof p === 'string' ? p.replace(/^[•\-]\s*/, '') : p)) : parts}</span>
            </div>
          );
        }

        return <p key={i}>{parts}</p>;
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AIAssistantPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] min-h-0">
      {/* ---- Left Column: Chat ---- */}
      <div
        className="flex flex-col flex-[3] rounded-2xl border overflow-hidden"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[var(--card-bg)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                AI Chief of Staff
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Your AI operations partner
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto flex flex-col-reverse px-6 py-4">
          <div className="space-y-5">
            {chatMessages.map((msg) => {
              const isAI = msg.role === 'ai';
              return (
                <div
                  key={msg.id}
                  className={cn('flex gap-3', !isAI && 'flex-row-reverse')}
                >
                  {/* Avatar */}
                  {isAI ? (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 text-xs font-bold"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      SC
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={cn('max-w-[75%] min-w-0', !isAI && 'text-right')}>
                    {/* Name + time */}
                    <div
                      className={cn(
                        'flex items-center gap-2 mb-1 text-xs',
                        !isAI && 'justify-end'
                      )}
                    >
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {msg.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                    </div>

                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 text-[13px] leading-relaxed',
                        isAI
                          ? 'rounded-tl-md backdrop-blur-md border'
                          : 'rounded-tr-md'
                      )}
                      style={
                        isAI
                          ? {
                              background: 'rgba(255,255,255,0.03)',
                              borderColor: 'rgba(255,255,255,0.06)',
                              color: 'var(--text-secondary)',
                            }
                          : {
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              color: '#fff',
                            }
                      }
                    >
                      {msg.rich ? (
                        <RichText content={msg.content} />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div
          className="shrink-0 px-4 py-3 border-t"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 border"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--card-border)',
            }}
          >
            <button
              className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your AI Chief of Staff..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)]"
              style={{ color: 'var(--text-primary)' }}
            />
            <span className="hidden sm:block text-[10px] mr-1 px-1.5 py-0.5 rounded border opacity-40" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              ⏎ Enter
            </span>
            <button className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ---- Right Column: Context Panel ---- */}
      <div className="hidden lg:flex flex-col flex-1 gap-5 min-w-0">
        {/* Quick Actions */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="group/qa flex flex-col items-center gap-2 rounded-xl p-3 border transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: 'var(--card-border)',
                  }}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br shadow-lg',
                      action.color
                    )}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span
                    className="text-[11px] font-medium text-center leading-tight"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Topics */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Recent Topics
          </h3>
          <div className="space-y-2.5">
            {recentTopics.map((topic) => (
              <button
                key={topic.text}
                className="flex items-start gap-2.5 w-full group/topic text-left rounded-lg p-2 -mx-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <MessageSquare
                  className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-40"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate group-hover/topic:underline">{topic.text}</p>
                </div>
                <span className="text-[10px] shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {topic.time}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Questions */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Suggested Questions
          </h3>
          <div className="space-y-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setInputValue(q)}
                className="flex items-center gap-2 w-full text-left text-xs rounded-lg px-3 py-2.5 border transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <ArrowRight className="w-3 h-3 shrink-0 opacity-40" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
