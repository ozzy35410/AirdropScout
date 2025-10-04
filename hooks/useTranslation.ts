"use client";

import { useMemo } from "react";
import { createTranslator, type TranslationKey } from "@/lib/i18n";
import { useGlobal, type GlobalState } from "@/state/useGlobal";

export function useTranslation() {
  const language = useGlobal((state: GlobalState) => state.language);

  const t = useMemo(() => {
    const translator = createTranslator(language);
    return (key: TranslationKey) => translator(key) ?? key;
  }, [language]);

  return { t, language };
}
