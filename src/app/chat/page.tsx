'use client';

import { useState } from 'react';
import {
  Hash,
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  Bold,
  Italic,
  Code,
  Link,
  ListOrdered,
  AtSign,
  MoreHorizontal,
  Reply,
  ChevronDown,
  FileIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface Channel {
  name: string;
  unread?: number;
}

interface DirectMessage {
  name: string;
  online: boolean;
}

interface Reaction {
  emoji: string;
  count: number;
}

interface ChatMsg {
  id: string;
  author: string;
  avatarColor: string;
  timestamp: string;
  content: string;
  codeBlock?: string;
  attachment?: { name: string; size: string };
  reactions?: Reaction[];
  threadReplies?: number;
}

const channels: Channel[] = [
  { name: 'general', unread: 3 },
  { name: 'engineering', unread: 1 },
  { name: 'design' },
  { name: 'marketing' },
  { name: 'random' },
];

const directMessages: DirectMessage[] = [
  { name: 'Marcus Rodriguez', online: true },
  { name: 'Aisha Patel', online: true },
  { name: 'David Kim', online: false },
  { name: 'Elena Vasquez', online: true },
];

const messages: ChatMsg[] = [
  {
    id: 'c1',
    author: 'Marcus Rodriguez',
    avatarColor: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    timestamp: '9:12 AM',
    content:
      'Good morning team! Quick update — the auth module refactor is now merged into main. All tests are passing. 🎉',
    reactions: [
      { emoji: '👍', count: 3 },
      { emoji: '🎉', count: 2 },
    ],
  },
  {
    id: 'c2',
    author: 'Aisha Patel',
    avatarColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    timestamp: '9:15 AM',
    content: 'Nice work! I noticed a small issue with the token refresh logic. Here\'s a quick fix:',
    codeBlock: `// Fix: ensure refresh token is validated before use
async function refreshAuth(token: string) {
  if (!isValidToken(token)) {
    throw new AuthError('Invalid refresh token');
  }
  return await authService.refresh(token);
}`,
  },
  {
    id: 'c3',
    author: 'David Kim',
    avatarColor: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    timestamp: '9:22 AM',
    content:
      'Standup reminder — please post your updates in the thread. Today\'s focus: sprint review prep and clearing the blocked items on the data pipeline.',
    threadReplies: 3,
  },
  {
    id: 'c4',
    author: 'Elena Vasquez',
    avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-500',
    timestamp: '9:30 AM',
    content: 'Shared the updated Q3 campaign brief. Please review and leave comments by EOD.',
    attachment: { name: 'Q3_Campaign_Brief_v2.pdf', size: '2.4 MB' },
  },
  {
    id: 'c5',
    author: 'Marcus Rodriguez',
    avatarColor: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    timestamp: '9:35 AM',
    content:
      'Also — who\'s down for lunch at the new ramen place on 5th? Thinking 12:30.',
    reactions: [{ emoji: '👍', count: 3 }],
  },
  {
    id: 'c6',
    author: 'Aisha Patel',
    avatarColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    timestamp: '9:38 AM',
    content: 'Count me in! 🍜',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [inputValue, setInputValue] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');

  return (
    <div
      className="flex h-[calc(100vh-8rem)] min-h-0 rounded-2xl border overflow-hidden"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      {/* ---------------------------------------------------------------- */}
      {/*  Sidebar                                                         */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="hidden md:flex flex-col w-[250px] shrink-0 border-r"
        style={{ borderColor: 'var(--card-border)', background: 'var(--bg-secondary)' }}
      >
        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 border"
            style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--card-border)' }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search messages"
              className="flex-1 bg-transparent outline-none text-xs placeholder:text-[var(--text-muted)]"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Channels */}
        <div className="px-2 pt-3">
          <div className="flex items-center justify-between px-2 mb-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Channels
            </span>
            <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="space-y-0.5">
            {channels.map((ch) => {
              const isActive = activeChannel === ch.name;
              return (
                <button
                  key={ch.name}
                  onClick={() => setActiveChannel(ch.name)}
                  className={cn(
                    'flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-xs transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500'
                      : 'hover:bg-white/[0.04]'
                  )}
                  style={{
                    color: isActive ? '#818cf8' : 'var(--text-secondary)',
                  }}
                >
                  <Hash className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  <span className={cn('flex-1 text-left', ch.unread && 'font-semibold')}>
                    {ch.name}
                  </span>
                  {ch.unread && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-indigo-500 text-white text-[10px] font-bold px-1">
                      {ch.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add channel */}
          <button
            className="flex items-center gap-2 w-full rounded-lg px-2 py-1.5 mt-1 text-xs transition-colors hover:bg-white/[0.04]"
            style={{ color: 'var(--text-muted)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Channel</span>
          </button>
        </div>

        {/* Direct Messages */}
        <div className="px-2 pt-5">
          <div className="flex items-center justify-between px-2 mb-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Direct Messages
            </span>
            <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="space-y-0.5">
            {directMessages.map((dm) => (
              <button
                key={dm.name}
                className="flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-white/[0.04]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="relative shrink-0">
                  <span
                    className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                  >
                    {getInitials(dm.name)}
                  </span>
                  <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-[var(--bg-secondary)]',
                      dm.online ? 'bg-emerald-400' : 'bg-gray-500'
                    )}
                  />
                </span>
                <span className="truncate">{dm.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Chat Area                                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Channel Header */}
        <div
          className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Hash className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
            <h2 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {activeChannel}
            </h2>
          </div>
          <div
            className="hidden sm:block h-4 w-px mx-1"
            style={{ background: 'var(--card-border)' }}
          />
          <span className="hidden sm:block text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            8 members · Company-wide announcements and updates
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
              style={{ color: 'var(--text-muted)' }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className="group/msg flex gap-3">
              {/* Avatar */}
              <div
                className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 text-xs font-bold text-white mt-0.5',
                  msg.avatarColor
                )}
              >
                {getInitials(msg.author)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Author + time */}
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {msg.author}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Text */}
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {msg.content}
                </p>

                {/* Code block */}
                {msg.codeBlock && (
                  <pre
                    className="mt-2 rounded-lg p-3 text-xs leading-relaxed overflow-x-auto border"
                    style={{
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--card-border)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <code>{msg.codeBlock}</code>
                  </pre>
                )}

                {/* File attachment */}
                {msg.attachment && (
                  <div
                    className="mt-2 inline-flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors"
                    style={{
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--card-border)',
                    }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10">
                      <FileIcon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {msg.attachment.name}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {msg.attachment.size}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    {msg.reactions.map((r) => (
                      <button
                        key={r.emoji}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 border text-xs transition-colors hover:bg-white/[0.06]"
                        style={{
                          background: 'var(--bg-tertiary)',
                          borderColor: 'var(--card-border)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] font-medium">{r.count}</span>
                      </button>
                    ))}
                    <button
                      className="flex items-center justify-center w-6 h-6 rounded-md border opacity-0 group-hover/msg:opacity-100 transition-opacity"
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--card-border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Smile className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Thread replies */}
                {msg.threadReplies && (
                  <button className="flex items-center gap-1.5 mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    <Reply className="w-3 h-3" />
                    <span>
                      {msg.threadReplies} {msg.threadReplies === 1 ? 'reply' : 'replies'}
                    </span>
                  </button>
                )}
              </div>

              {/* Hover actions */}
              <div className="hidden group-hover/msg:flex items-start gap-0.5 shrink-0 mt-0.5">
                <button
                  className="p-1 rounded transition-colors hover:bg-white/[0.06]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1 rounded transition-colors hover:bg-white/[0.06]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1 rounded transition-colors hover:bg-white/[0.06]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="shrink-0 px-4 py-3" style={{ borderTop: '1px solid var(--card-border)' }}>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--card-border)',
            }}
          >
            {/* Toolbar */}
            <div
              className="flex items-center gap-0.5 px-3 py-1.5 border-b"
              style={{ borderColor: 'var(--card-border)' }}
            >
              {[Bold, Italic, Code, Link, ListOrdered].map((Icon, i) => (
                <button
                  key={i}
                  className="p-1.5 rounded transition-colors hover:bg-white/[0.06]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
              <div className="h-4 w-px mx-1" style={{ background: 'var(--card-border)' }} />
              <button
                className="p-1.5 rounded transition-colors hover:bg-white/[0.06]"
                style={{ color: 'var(--text-muted)' }}
              >
                <AtSign className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1.5 rounded transition-colors hover:bg-white/[0.06]"
                style={{ color: 'var(--text-muted)' }}
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Text input + send */}
            <div className="flex items-center gap-2 px-3 py-2.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Message #${activeChannel}`}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)]"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
                style={{ color: 'var(--text-muted)' }}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
