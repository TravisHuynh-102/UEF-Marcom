'use client';
/* eslint-disable */

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
    <div className="flex h-[calc(100vh-88px)] w-full overflow-hidden gap-6 text-black dark:text-white transition-colors duration-500">
      
      {/* Folders Sidebar */}
      <aside className="hidden w-64 shrink-0 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 md:flex flex-col h-full z-10 relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12.5px] font-bold tracking-wider text-black/70 dark:text-white/70">FOLDERS</span>
          <button className="rounded-full p-1.5 hover:bg-white/20 dark:hover:bg-white/10 transition-all border border-black/10 dark:border-white/10 shadow-sm"><Plus className="h-4 w-4 text-black dark:text-white" /></button>
        </div>
        <ul className="space-y-2">
          {folders.map((f) => (
            <li key={f.name}>
              <button 
                onClick={() => setActiveFolder(f.name)}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-[14px] transition-colors font-medium",
                  activeFolder === f.name 
                    ? "bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/5 shadow-sm text-black dark:text-white" 
                    : "hover:bg-white/20 dark:hover:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                ].join(" ")}
              >
                <Folder className="h-4 w-4" />
                <span className="flex-1 text-left">{f.name}</span>
                {f.count > 0 && <span className="text-[12.5px] font-medium opacity-60">{f.count}</span>}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Note list */}
      <div className="hidden w-80 shrink-0 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-4 md:flex flex-col h-full z-0 overflow-hidden">
        <div className="border-b border-black/10 dark:border-white/10 px-2 pb-4 mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">{activeFolder}</h2>
          <p className="text-[13px] text-black/70 dark:text-white/70 mt-1">{notesList.length} notes</p>
        </div>
        <ul className="no-scrollbar overflow-y-auto flex-1 space-y-4">
          {notesList.map((n) => (
            <li key={n.id}>
              <button 
                onClick={() => setActiveNote(n.id)} 
                className={[
                  "w-full px-4 py-4 text-left transition-all rounded-xl border cursor-pointer",
                  activeNote === n.id 
                    ? "bg-white/60 dark:bg-white/20 backdrop-blur-md border-white/60 dark:border-white/20 shadow-md scale-[1.02]" 
                    : "bg-white/30 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-md border-white/40 dark:border-white/10 shadow-sm"
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="truncate text-base font-medium text-black dark:text-white">{n.title}</span>
                </div>
                <div className="flex flex-col gap-1 text-[13px]">
                  <span className="text-black/80 dark:text-white/80 font-medium">{n.date}</span>
                  <span className="truncate text-black/70 dark:text-white/70 line-clamp-2">{n.preview}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <main className="flex-1 overflow-y-auto rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative h-full">
        <div className="mx-auto max-w-[900px] px-8 md:px-12 py-16 lg:px-20 lg:py-20">
          <div className="mb-6 inline-flex items-center rounded-xl bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 px-4 py-1.5 text-[12px] font-medium text-black dark:text-white shadow-sm">
            Last edited: {activeNoteData.date}
          </div>
          <input 
            className="text-[40px] md:text-[48px] font-semibold tracking-tight text-black dark:text-white mb-8 bg-transparent outline-none w-full placeholder:text-black/30 dark:placeholder:text-white/30 font-inter"
            defaultValue={activeNoteData.title}
            key={activeNoteData.id}
            placeholder="Untitled"
          />
          
          <div className="text-black dark:text-white text-[16px] leading-relaxed">
            <Editor />
          </div>
        </div>
      </main>
    </div>
  );
}
