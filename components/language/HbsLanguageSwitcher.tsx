"use client";

import { HbsLanguageCode } from "@/lib/i18n/translations";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";

export default function HbsLanguageSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { language, setLanguage, supportedLanguages, isReady } =
    useHbsLanguage();

  if (!isReady) {
    return null;
  }

  return (
    <label className="grid gap-1">
      {!compact && (
        <span className="text-xs font-semibold text-slate-300">Language</span>
      )}

      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value as HbsLanguageCode)
        }
        className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none hover:bg-slate-900 focus:border-blue-400"
      >
        {supportedLanguages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}