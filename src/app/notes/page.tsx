'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useLanguage } from '@/context/language-context';

// Disable SSR for BlockNote since it relies on window/document
const Editor = dynamic(() => import('@/components/ui/note-editor'), { ssr: false });

export default function NotesPage() {
  const { t } = useLanguage();
  const [activeNote, setActiveNote] = useState('1');

  const notesList = [
    { id: '1', title: 'Product Launch Q3', preview: 'Key messaging and positioning...', date: 'Today' },
    { id: '2', title: 'Team Retrospective', preview: 'What went well this sprint...', date: 'Yesterday' },
    { id: '3', title: 'Design System Guidelines', preview: 'Color palette and typography...', date: 'Jun 1' },
  ];

  const activeNoteData = notesList.find((n) => n.id === activeNote) || notesList[0];

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      {/* Sidebar / Note List */}
      <div className="w-72 shrink-0 border-r border-outline-variant/30 bg-surface-container flex flex-col h-full">
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
          <h2 className="font-semibold text-on-surface">Team Notes</h2>
          <button className="p-1.5 hover:bg-surface-variant rounded-md text-on-surface-variant transition-colors" title="New Note">
            <span className="material-symbols-outlined text-[20px]">edit_square</span>
          </button>
        </div>
        
        <div className="p-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full bg-surface border border-outline-variant/50 rounded-md py-1.5 pl-8 pr-3 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notesList.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                activeNote === note.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-surface-variant text-on-surface-variant'
              }`}
            >
              <span className={`material-symbols-outlined mt-0.5 shrink-0 text-[18px] ${activeNote === note.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                description
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-body-sm font-medium truncate ${activeNote === note.id ? 'text-primary' : 'text-on-surface'}`}>
                  {note.title}
                </p>
                <p className="text-[11px] truncate opacity-70 mt-0.5">
                  {note.preview}
                </p>
                <p className="text-[10px] mt-2 opacity-50 font-medium">
                  {note.date}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
        {/* Editor Top Bar */}
        <div className="h-14 border-b border-outline-variant/30 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <span className="hover:text-on-surface cursor-pointer transition-colors">Workspace</span>
            <span className="text-[12px]">/</span>
            <span className="text-on-surface font-medium">{activeNoteData.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-body-sm font-medium px-3 py-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-md transition-colors">
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share
            </button>
            <button className="p-1.5 hover:bg-surface-variant rounded-md text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto px-8 md:px-16 py-12">
          <div className="max-w-4xl mx-auto w-full">
            <input 
              className="text-4xl font-bold text-on-surface mb-8 px-12 bg-transparent outline-none w-full placeholder:text-on-surface-variant/30"
              value={activeNoteData.title}
              readOnly
            />
            <div className="text-on-surface">
              <Editor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
