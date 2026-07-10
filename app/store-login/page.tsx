"use client";

import { useEffect, useState } from "react";
import { LanguageCode, isLanguageCode } from "@/components/language/CompactLanguageSwitcher";

const texts = {
  tr: "Tek giriş ekranına yönlendiriliyorsunuz...",
  en: "Redirecting you to the unified login screen...",
  de: "Sie werden zum einheitlichen Login-Bildschirm weitergeleitet...",
  ru: "Вы перенаправляетесь на единый экран входа...",
  ka: "თქვენ გადამისამართდებით შესვლის ერთიან ეკრანზე..."
};

export default function RedirectToUnifiedLogin() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (isLanguageCode(savedLanguage)) {
      setLanguage(savedLanguage);
    }
    const timer = setTimeout(() => {
      window.location.replace("/login");
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <main className="hbs-market-page flex min-h-screen items-center justify-center px-4 text-slate-950">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold shadow-xl">
        {texts[language]}
      </div>
    </main>
  );
}
