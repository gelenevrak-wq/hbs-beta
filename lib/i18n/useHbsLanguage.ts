"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInitialLanguage,
  getLanguageDirection,
  getTranslations,
  HbsLanguageCode,
  isHbsLanguageCode,
  supportedLanguages,
} from "./translations";

export function useHbsLanguage() {
  const [language, setLanguageState] = useState<HbsLanguageCode>("tr");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialLanguage = getInitialLanguage();

    setLanguageState(initialLanguage);
    setIsReady(true);

    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = getLanguageDirection(initialLanguage);
  }, []);

  function setLanguage(nextLanguage: HbsLanguageCode) {
    if (!isHbsLanguageCode(nextLanguage)) return;

    setLanguageState(nextLanguage);

    try {
      window.localStorage.setItem("hbs-language", nextLanguage);
    } catch (e) {
      console.error("localStorage is disabled or secure:", e);
    }

    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = getLanguageDirection(nextLanguage);
  }

  const t = useMemo(() => {
    return getTranslations(language);
  }, [language]);

  const direction = getLanguageDirection(language);

  return {
    language,
    setLanguage,
    t,
    direction,
    isReady,
    supportedLanguages,
  };
}