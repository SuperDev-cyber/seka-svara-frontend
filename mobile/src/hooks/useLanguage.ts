import { useState, useEffect } from 'react';
import { Language } from '../lib/i18n';

const STORAGE_KEY = 'seka_svara_language';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['uz', 'ru', 'en'].includes(stored)) {
      return stored as Language;
    }
    return 'uz';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  return { language, setLanguage };
}
