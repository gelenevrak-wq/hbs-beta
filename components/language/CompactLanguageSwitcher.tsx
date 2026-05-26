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

  if (!language) return <div className="h-8 w-40 shrink-0" />;

  const changeLanguage = (languageCode: LanguageCode) => {
    setLanguage(languageCode);
    window.localStorage.setItem("hbs-language", languageCode);
    document.documentElement.lang = languageCode;
    document.documentElement.dir = "ltr";
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" aria-label="Language Selector">
      {languages.map((item) => {
        const isSelected = item.code === language;
        const flagCode = item.code === "en" ? "gb" : item.code === "ka" ? "ge" : item.code;
        
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => changeLanguage(item.code)}
            title={item.title}
            className={`flex items-center justify-center p-0.5 rounded-lg border transition duration-200 hover:scale-110 active:scale-95 ${
              isSelected
                ? "border-blue-600 bg-blue-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <img
              src={`https://flagcdn.com/w40/${flagCode}.png`}
              alt={item.title}
              className="h-4 w-6 rounded-sm object-cover sm:h-5 sm:w-8"
            />
          </button>
        );
      })}
    </div>
  );
}
