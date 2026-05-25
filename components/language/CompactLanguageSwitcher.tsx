"use client";

import { useEffect, useState } from "react";

export type LanguageCode = "tr" | "en" | "ru" | "ka" | "de";

type Language = {
  code: LanguageCode;
  title: string;
  short: string;
};

const languages: Language[] = [
  { code: "tr", title: "Türkçe", short: "TR" },
  { code: "en", title: "English", short: "EN" },
  { code: "ru", title: "Русский", short: "RU" },
  { code: "ka", title: "ქართული", short: "KA" },
  { code: "de", title: "Deutsch", short: "DE" },
];

export function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "tr" || value === "en" || value === "ru" || value === "ka" || value === "de";
}

function detectInitialLanguage(): LanguageCode {
  const saved = window.localStorage.getItem("hbs-language");
  if (isLanguageCode(saved)) return saved;

  const browserLanguage = window.navigator.language.slice(0, 2).toLowerCase();
  if (isLanguageCode(browserLanguage)) return browserLanguage;

  return "tr";
}

export default function CompactLanguageSwitcher() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);

  useEffect(() => {
    const initialLanguage = detectInitialLanguage();
    setLanguage(initialLanguage);
    window.localStorage.setItem("hbs-language", initialLanguage);
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = "ltr";
  }, []);

  if (!language) return <div className="h-8 w-[74px] shrink-0" />;

  const changeLanguage = (languageCode: LanguageCode) => {
    setLanguage(languageCode);
    window.localStorage.setItem("hbs-language", languageCode);
    document.documentElement.lang = languageCode;
    document.documentElement.dir = "ltr";
    window.location.reload();
  };

  return (
    <label className="relative shrink-0">
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(event) => changeLanguage(event.target.value as LanguageCode)}
        className="h-8 max-w-[82px] rounded-full border border-slate-200 bg-white px-2 pr-6 text-[11px] font-black text-slate-900 shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:h-9 sm:max-w-[126px] sm:px-3 sm:text-xs"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.short} {item.title}
          </option>
        ))}
      </select>
    </label>
  );
}
