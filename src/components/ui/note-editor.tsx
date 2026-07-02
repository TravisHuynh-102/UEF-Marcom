'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import { useTheme } from '@/context/theme-context';

import { useEffect, useState } from 'react';

export default function NoteEditor() {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains('dark');
    setIsDark(checkDark());
    
    // Optional: observer for class changes on html tag if needed
    const observer = new MutationObserver(() => setIsDark(checkDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [theme]);

  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  return (
    <div className="w-full">
      <BlockNoteView
        editor={editor}
        theme={isDark ? 'dark' : 'light'}
        className="min-h-[500px]"
      />
    </div>
  );
}
