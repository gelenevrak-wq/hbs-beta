"use client";

import { useEffect, useState } from "react";

export type LanguageCode = "tr" | "en" | "ru" | "ka" | "de";

type Language = {
  code: LanguageCode;
  title: string;
  flagSrc: string;
};

const languages: Language[] = [
  { code: "tr", title: "Türkçe", flagSrc: "/flags/tr.svg" },
  { code: "ka", title: "ქართული", flagSrc: "/flags/ge.svg" },
  { code: "en", title: "English", flagSrc: "/flags/gb.svg" },
  { code: "ru", title: "Русский", flagSrc: "/flags/ru.svg" },
  { code: "de", title: "Deutsch", flagSrc: "/flags/de.svg" },
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

  if (!language) {
    return <div className="h-8 w-[132px] shrink-0" aria-hidden="true" />;
  }

  const changeLanguage = (languageCode: LanguageCode) => {
    setLanguage(languageCode);
    window.localStorage.setItem("hbs-language", languageCode);
    document.documentElement.lang = languageCode;
    document.documentElement.dir = "ltr";
    window.location.reload();
  };

  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-1 py-1 shadow-sm"
      aria-label="Language selection"
    >
      {languages.map((item) => {
        const selected = item.code === language;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => changeLanguage(item.code)}
            title={item.title}
            aria-label={item.title}
            aria-pressed={selected}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
              selected
                ? "bg-blue-50 ring-2 ring-blue-500 ring-offset-1"
                : "hover:bg-slate-100"
            }`}
          >
            <img
              src={item.flagSrc}
              alt={item.title}
              className="h-[18px] w-[18px] rounded-full border border-slate-200 object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.9)]"
            />
          </button>
        );
      })}
    </div>
  );
}
