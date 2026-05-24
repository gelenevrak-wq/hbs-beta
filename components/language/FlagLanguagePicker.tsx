"use client";

export type LanguageCode = "tr" | "en" | "ru" | "ka" | "de";

type Language = {
  code: LanguageCode;
  title: string;
  flagUrl: string;
};

const languages: Language[] = [
  { code: "tr", title: "Türkçe", flagUrl: "/flags/tr.svg" },
  { code: "en", title: "English", flagUrl: "/flags/gb.svg" },
  { code: "ru", title: "Русский", flagUrl: "/flags/ru.svg" },
  { code: "ka", title: "ქართული", flagUrl: "/flags/ge.svg" },
  { code: "de", title: "Deutsch", flagUrl: "/flags/de.svg" },
];

type FlagLanguagePickerProps = {
  selectedCode: LanguageCode;
  onChange: (languageCode: LanguageCode) => void;
};

export default function FlagLanguagePicker({
  selectedCode,
  onChange,
}: FlagLanguagePickerProps) {
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      {languages.map((language) => {
        const isSelected = language.code === selectedCode;

        return (
          <button
            key={language.code}
            type="button"
            title={language.title}
            aria-label={language.title}
            onClick={() => onChange(language.code)}
            className={`flex h-10 w-12 items-center justify-center rounded-xl border transition hover:-translate-y-0.5 hover:bg-white/10 ${
              isSelected
                ? "border-white/40 bg-white/10"
                : "border-white/10 bg-slate-950/40"
            }`}
          >
            <img
              src={language.flagUrl}
              alt={language.title}
              className="h-5 w-8 rounded-sm object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}