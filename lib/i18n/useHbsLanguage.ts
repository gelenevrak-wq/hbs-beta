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
  const [translationVersion, setTranslationVersion] = useState(0);

  useEffect(() => {
    const initialLanguage = getInitialLanguage();

    setLanguageState(initialLanguage);
    setIsReady(true);

    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = getLanguageDirection(initialLanguage);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleTranslationUpdate = () => {
      setTranslationVersion((v) => v + 1);
    };
    window.addEventListener("hbs-translation-updated", handleTranslationUpdate);
    return () => {
      window.removeEventListener("hbs-translation-updated", handleTranslationUpdate);
    };
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