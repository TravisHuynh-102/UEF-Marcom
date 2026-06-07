'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import { useTheme } from '@/context/theme-context';

export default function NoteEditor() {
  const { theme } = useTheme();
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  return (
    <BlockNoteView
      editor={editor}
      theme={theme === 'dark' ? 'dark' : 'light'}
      className="min-h-[500px]"
    />
  );
}
