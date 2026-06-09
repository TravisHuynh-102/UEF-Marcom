'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { Folder, Plus } from 'lucide-react';

const Editor = dynamic(() => import('@/components/ui/note-editor'), { ssr: false });

const folders = [
  { name: 'Personal', count: 12, active: false },
  { name: 'Team', count: 8, active: true },
  { name: 'Meetings', count: 24, active: false },
  { name: 'Ideas', count: 6, active: false },
];

export default function NotesPage() {
  const { t } = useLanguage();
  const [activeNote, setActiveNote] = useState('1');
  const [activeFolder, setActiveFolder] = useState('Team');

  const notesList = [
    { id: '1', title: 'Product Launch Q3', preview: 'Key messaging and positioning...', date: 'Today, 10:42 AM', active: true },
    { id: '2', title: 'Team Retrospective', preview: 'What went well this sprint...', date: 'Yesterday' },
    { id: '3', title: 'Design System Guidelines', preview: 'Color palette and typography...', date: 'Mon' },
  ];

  const activeNoteData = notesList.find((n) => n.id === activeNote) || notesList[0];

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Folders Sidebar */}
      <aside className="hidden w-[200px] shrink-0 border-r border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-[var(--color-apple-card)]/60 p-3 backdrop-blur-xl md:block">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-apple-subtle)]">Folders</span>
          <button className="rounded p-0.5 hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"><Plus className="h-3.5 w-3.5 text-[var(--color-apple-subtle)]" /></button>
        </div>
        <ul className="space-y-0.5">
          {folders.map((f) => (
            <li key={f.name}>
              <button 
                onClick={() => setActiveFolder(f.name)}
                className={[
                  "flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-[13px] transition",
                  activeFolder === f.name 
                    ? "bg-[var(--color-apple-lilac)]/30 text-[var(--accent-purple)] font-medium dark:bg-[var(--color-apple-lilac)]/20" 
                    : "hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-[var(--color-apple-text)]"
                ].join(" ")}
              >
                <Folder className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">{f.name}</span>
                <span className="text-[11px] text-[var(--color-apple-subtle)]">{f.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Note list */}
      <div className="hidden w-[320px] shrink-0 border-r border-black/[0.06] dark:border-white/[0.06] bg-[var(--color-apple-card)] md:block">
        <div className="border-b border-black/[0.06] dark:border-white/[0.06] px-5 py-4">
          <h2 className="text-[15px] font-semibold tracking-tight text-[var(--color-apple-text)]">{activeFolder}</h2>
          <p className="text-[11.5px] text-[var(--color-apple-subtle)]">{notesList.length} notes</p>
        </div>
        <ul className="no-scrollbar overflow-y-auto">
          {notesList.map((n) => (
            <li key={n.id}>
              <button 
                onClick={() => setActiveNote(n.id)} 
                className={[
                  "w-full border-b border-black/[0.04] dark:border-white/[0.04] px-5 py-3.5 text-left transition",
                  activeNote === n.id ? "bg-[var(--color-apple-lilac)]/20 dark:bg-[var(--color-apple-lilac)]/10" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between">
                  <span className="truncate text-[13.5px] font-semibold text-[var(--color-apple-text)]">{n.title}</span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-2 text-[11.5px]">
                  <span className="text-[var(--color-apple-subtle)]">{n.date}</span>
                  <span className="truncate text-[var(--color-apple-subtle)]">· {n.preview}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <main className="flex-1 overflow-y-auto bg-[var(--color-apple-card)]">
        <div className="mx-auto max-w-2xl px-10 py-12">
          <div className="mb-2 text-[11.5px] text-[var(--color-apple-subtle)]">{activeNoteData.date}</div>
          <input 
            className="text-[28px] font-semibold tracking-tight text-[var(--color-apple-text)] mb-6 bg-transparent outline-none w-full placeholder:text-[var(--color-apple-subtle)]/30"
            value={activeNoteData.title}
            readOnly
          />
          <div className="text-[var(--color-apple-text)]">
            <Editor />
          </div>
        </div>
      </main>
    </div>
  );
}
