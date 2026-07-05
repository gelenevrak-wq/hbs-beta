"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";
import { translations } from "@/lib/translations";

export default function ForgotPasswordPage() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage === "tr" || savedLanguage === "en" || savedLanguage === "de" || savedLanguage === "ru" || savedLanguage === "ka") {
      setLanguage(savedLanguage);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  const t = translations[language].forgotPassword;

  return (
    <main className="hbs-market-page min-h-screen px-4 py-8 text-slate-950 flex flex-col justify-center items-center relative overflow-hidden bg-[#f3f6fc]">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-purple-300/10 blur-[120px] pointer-events-none select-none" />

      <div className="relative w-full max-w-lg z-10 space-y-4">
        {/* Header & Language Switcher */}
        <header className="flex items-center justify-between gap-4 px-2 select-none">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              HBS
            </span>
          </Link>
          <CompactLanguageSwitcher />
        </header>

        {/* Form Container */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
              {translations[language].common.home}
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-650">{t.desc}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="grid gap-1">
              <span className="text-xs font-bold text-slate-600 pl-1">{t.placeholder}</span>
              <input
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm"
                placeholder={t.placeholder} id="id-page-w-full-rounded-2xl-border-border-slate-200-bg-slate-50-px-4-py-3-text-sm-font-semibold-text-slate-800-outline-none-focus-border-blue-500-focus-ring-4-focus-ring-blue-500-10-transition-all-duration-300-shadow-sm-946" aria-label="W full rounded 2xl border border slate 200 bg slate 50 px 4 py 3 text sm font semibold text slate 800 outline none focus border blue 500 focus ring 4 focus ring blue 500 10 transition all duration 300 shadow sm" />
            </label>
            
            <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3.5 text-sm font-black text-white hover:shadow-lg transition-all duration-300 select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
              {t.submitBtn}
            </button>
          </form>

          {sent && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black text-emerald-800 shadow-sm animate-fadeIn">
              ✓ {t.successMsg}
            </div>
          )}

          <div className="text-center pt-2 border-t border-slate-100">
            <Link href="/login" className="inline-flex text-xs font-black text-blue-600 hover:text-blue-700 transition">
              ← {t.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
