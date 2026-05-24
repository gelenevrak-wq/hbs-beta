"use client";

import { useState } from "react";

export type LanguageCode = "tr" | "en" | "ru" | "ka" | "de";

export type Language = {
  code: LanguageCode;
  label: string;
  flagUrl: string;
};

const languages: Language[] = [
  { code: "tr", label: "Türkçe", flagUrl: "https://flagcdn.com/w40/tr.png" },
  { code: "en", label: "English", flagUrl: "https://flagcdn.com/w40/gb.png" },
  { code: "ru", label: "Русский", flagUrl: "https://flagcdn.com/w40/ru.png" },
  { code: "ka", label: "ქართული", flagUrl: "https://flagcdn.com/w40/ge.png" },
  { code: "de", label: "Deutsch", flagUrl: "https://flagcdn.com/w40/de.png" },
];

type LanguageSelectorProps = {
  selectedCode: LanguageCode;
  onChange: (languageCode: LanguageCode) => void;
};

export default function LanguageSelector({
  selectedCode,
  onChange,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedLanguage =
    languages.find((language) => language.code === selectedCode) ?? languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800"
      >
        <img
          src={selectedLanguage.flagUrl}
          alt={selectedLanguage.label}
          className="h-4 w-6 rounded-sm object-cover"
        />
        <span>{selectedLanguage.label}</span>
        <span className="text-slate-400">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
          <div className="px-3 py-2 text-xs uppercase tracking-widest text-slate-500">
            Dil Seçiniz
          </div>

          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => {
                onChange(language.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white hover:bg-slate-800"
            >
              <img
                src={language.flagUrl}
                alt={language.label}
                className="h-5 w-7 rounded-sm object-cover"
              />
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
