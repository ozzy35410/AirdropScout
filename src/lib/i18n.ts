import { useState, useEffect } from 'react';

// ✅ Çeviri dosyalarını bundle'a dahil et (senkron yükleme)
import enTranslations from '../../locales/en.json';
import trTranslations from '../../locales/tr.json';

type Language = 'en' | 'tr';
type Translations = Record<string, string>;

// ✅ İlk render'da hazır olması için senkron import
const translations: Record<Language, Translations> = {
  en: enTranslations as Translations,
  tr: trTranslations as Translations
};

export function useTranslation(language: Language) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Force re-render when language changes
    forceUpdate({});
  }, [language]);

  const t = (key: string): string => {
    // ✅ Çeviriler artık her zaman hazır, key yerine çeviri döner
    return translations[language]?.[key] || key;
  };

  return { t };
}