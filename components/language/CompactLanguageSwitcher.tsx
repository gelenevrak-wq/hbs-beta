"use client";

import { useEffect, useState, useRef } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!language) return <div className="h-8 w-24 shrink-0" />;

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

  const currentLang = languages.find((l) => l.code === language) || languages[0];
  const currentFlag = currentLang.code === "en" ? "gb" : currentLang.code === "ka" ? "ge" : currentLang.code;

  return (
    <div ref={containerRef} className="relative shrink-0 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-black text-slate-700 tracking-wider shadow-sm transition active:scale-95 cursor-pointer"
        aria-label="Toggle language menu"
      >
        <img
          src={`https://flagcdn.com/w40/${currentFlag}.png`}
          alt={currentLang.title}
          className="h-3 w-4.5 rounded-sm object-cover shadow-sm shrink-0"
        />
        <span className="font-extrabold uppercase">{currentLang.short}</span>
        <span className="text-[8px] text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-32 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md p-1 shadow-lg animate-fadeIn">
          {languages.map((item) => {
            const isSelected = item.code === language;
            const flagCode = item.code === "en" ? "gb" : item.code === "ka" ? "ge" : item.code;

            return (
              <button
                key={item.code}
                onClick={() => {
                  changeLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-bold transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <img
                  src={`https://flagcdn.com/w40/${flagCode}.png`}
                  alt={item.title}
                  className="h-3 w-4.5 rounded-sm object-cover shadow-sm shrink-0"
                />
                <span className="font-extrabold uppercase">{item.short}</span>
                <span className="text-[10px] text-slate-400 font-normal truncate">{item.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
