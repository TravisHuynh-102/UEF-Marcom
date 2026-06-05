'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { en, Dictionary } from '@/locales/en';
import { vi } from '@/locales/vi';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: keyof Dictionary) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
  en,
  vi,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null;
    if (stored && (stored === 'en' || stored === 'vi')) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem('language', lang);
  };

  const t = useCallback((key: keyof Dictionary) => {
    return dictionaries[locale][key] || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
