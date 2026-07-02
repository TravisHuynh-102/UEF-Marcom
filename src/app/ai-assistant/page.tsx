'use client';
/* eslint-disable */

import { useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

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
  'Đội ngũ của tôi ai đang bị quá tải trong tuần này?',
  'Top 3 rủi ro dự án hiện tại là gì?',
  'Tóm tắt các cuộc họp ngày hôm qua',
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Very simple markdown-like renderer for bold + bullets */
function RichText({ content }: { content?: string }) {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed">
      {lines.map((line, i) => {
        if (!line || typeof line !== 'string') return <div key={i} className="h-1.5" />;
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
              <span>{isBullet ? parts.slice(0).map((p, i_dx) => (typeof p === 'string' ? p.replace(/^[•\-]\s*/, '') : p)) : parts}</span>
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
  const { messages, input, handleInputChange, handleSubmit, setInput, append, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: 'Chào buổi sáng. Tôi là **AI Chief of Staff**. Bạn cần tôi báo cáo và tối ưu hóa công việc gì hôm nay?',
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (label: string) => {
    append({ role: 'user', content: label });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const event = e as unknown as React.FormEvent<HTMLFormElement>;
      handleSubmit(event);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ---- Left Column: Chat ---- */}
      <div
        className="flex flex-col flex-[3] rounded-2xl border overflow-hidden shadow-2xl"
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
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[var(--card-bg)] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                AI Chief of Staff
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11.5px] font-medium border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Online
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Your AI operations partner
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto flex flex-col px-6 py-4 space-y-5">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={cn('flex gap-3', !isAI && 'flex-row-reverse')}
              >
                {/* Avatar */}
                {isAI ? (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0 mt-0.5 shadow-sm border border-white/10">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 text-xs font-bold border border-white/5"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    ME
                  </div>
                )}

                {/* Bubble */}
                <div className={cn('max-w-[80%] min-w-0', !isAI && 'text-right')}>
                  {/* Name + time */}
                  <div
                    className={cn(
                      'flex items-center gap-2 mb-1 text-xs',
                      !isAI && 'justify-end'
                    )}
                  >
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {isAI ? 'AI Chief of Staff' : 'You'}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'rounded-2xl px-5 py-3.5 text-[14px] leading-relaxed break-words',
                      isAI
                        ? 'rounded-tl-md backdrop-blur-md border border-white/5 shadow-sm'
                        : 'rounded-tr-md shadow-md'
                    )}
                    style={
                      isAI
                        ? {
                            background: 'rgba(255,255,255,0.03)',
                            color: 'var(--text-secondary)',
                          }
                        : {
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: '#fff',
                          }
                    }
                  >
                    {isAI ? (
                       <RichText content={msg.content} />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0 mt-0.5 shadow-sm border border-white/10">
                <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
              </div>
              <div className="flex gap-1.5 items-center h-8 px-4 rounded-2xl rounded-tl-md bg-white/[0.03] border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          className="shrink-0 px-4 py-3 border-t"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 border transition-colors focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--card-border)',
            }}
          >
            <button
              type="button"
              className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Hỏi AI Chief of Staff..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)] disabled:opacity-50"
              style={{ color: 'var(--text-primary)' }}
            />
            <span className="hidden sm:block text-[11px] font-medium mr-1 px-1.5 py-0.5 rounded border opacity-40 uppercase" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              Enter
            </span>
            <button 
              type="submit"
              disabled={isLoading || !(input || '').trim()}
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ---- Right Column: Context Panel ---- */}
      <div className="hidden lg:flex flex-col flex-1 gap-5 min-w-0">
        {/* Quick Actions */}
        <div
          className="rounded-2xl border p-5 bg-[var(--card-bg)] border-[var(--card-border)]"
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
                  onClick={() => handleQuickAction(action.label)}
                  disabled={isLoading}
                  className="group/qa flex flex-col items-center gap-2 rounded-xl p-3 border transition-all duration-200 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
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
                    className="text-[12.5px] font-medium text-center leading-tight"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Questions */}
        <div
          className="rounded-2xl border p-5 bg-[var(--card-bg)] border-[var(--card-border)]"
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Gợi ý câu hỏi
          </h3>
          <div className="space-y-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickAction(q)}
                disabled={isLoading}
                className="flex items-center gap-2 w-full text-left text-xs rounded-lg px-3 py-2.5 border transition-all duration-200 hover:scale-[1.01] hover:bg-white/[0.02] disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <ArrowRight className="w-3 h-3 shrink-0 opacity-40 text-indigo-400" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Topics */}
        <div
          className="rounded-2xl border p-5 bg-[var(--card-bg)] border-[var(--card-border)] opacity-80"
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
                <span className="text-[11.5px] shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {topic.time}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
