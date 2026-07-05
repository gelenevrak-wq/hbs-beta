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
  { code: "de", title: "Deutsch", short: "DE" },
  { code: "ru", title: "Русский", short: "RU" },
  { code: "ka", title: "ქართული", short: "KA" },
];

export function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "tr" || value === "en" || value === "ru" || value === "ka" || value === "de";
}

function detectInitialLanguage(): LanguageCode {
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem("hbs-language");
  } catch (e) {
    console.error("localStorage is disabled or secure:", e);
  }
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
    try {
      window.localStorage.setItem("hbs-language", initialLanguage);
    } catch (e) {
      console.error("localStorage is disabled or secure:", e);
    }
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = "ltr";
  }, []);

  if (!language) return <div className="h-8 w-40 shrink-0" />;

  const changeLanguage = (languageCode: LanguageCode) => {
    setLanguage(languageCode);
    try {
      window.localStorage.setItem("hbs-language", languageCode);
    } catch (e) {
      console.error("localStorage is disabled or secure:", e);
    }
    document.documentElement.lang = languageCode;
    document.documentElement.dir = "ltr";
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 shrink-0 py-1" aria-label="Language Selector">
      {languages.map((item) => {
        const isSelected = item.code === language;
        const flagCode = item.code === "en" ? "gb" : item.code === "ka" ? "ge" : item.code;
        
        return (
          <a
            key={item.code}
            href={`?lang=${item.code}`}
            onClick={(e) => {
              e.preventDefault();
              changeLanguage(item.code);
            }}
            title={item.title}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm select-none ${
              isSelected
                ? "border-blue-300 bg-blue-50 text-blue-800 shadow-[0_2px_8px_rgba(59,130,246,0.15)] scale-102"
                : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-350 hover:bg-slate-50/50 backdrop-blur-sm"
            }`}
          >
            <img
              src={`https://flagcdn.com/w40/${flagCode}.png`}
              alt={item.title}
              className="h-3 w-4.5 rounded-sm object-cover shadow-sm shrink-0"
            />
            <span className="font-extrabold uppercase">{item.short}</span>
          </a>
        );
      })}
    </div>
  );
}
