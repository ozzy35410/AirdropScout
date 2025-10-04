import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import type { Language } from "@/state/useGlobal";

type Dictionaries = typeof en;

const dictionaries: Record<Language, Dictionaries> = {
  en,
  tr
};

export function getDictionary(language: Language): Dictionaries {
  return dictionaries[language] ?? en;
}

type Translator = (key: keyof Dictionaries) => string;

export function createTranslator(language: Language): Translator {
  const dict = getDictionary(language);
  return (key) => dict[key] ?? key;
}

export type TranslationKey = keyof Dictionaries;
