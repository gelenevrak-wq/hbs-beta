"use client";

import { useEffect, useState } from "react";
import { LanguageCode, isLanguageCode } from "@/components/language/CompactLanguageSwitcher";

const messages = {
  tr: {
    warning: "⚠️ HBS Çevrimdışı/Demo modunda çalışıyor. Kayıt ve giriş verileriniz yalnızca bu tarayıcıda (LocalStorage) saklanır. Tarayıcı geçmişini silmeniz durumunda verileriniz kaybolacaktır.",
  },
  en: {
    warning: "⚠️ HBS is running in Offline/Demo mode. Your registration and login data are stored only in this browser (LocalStorage). If you clear your browser history, your data will be lost.",
  },
  de: {
    warning: "⚠️ HBS läuft im Offline-/Demo-Modus. Ihre Registrierungs- und Anmeldedaten werden nur in diesem Browser (LocalStorage) gespeichert. Wenn Sie den Browserverlauf löschen, gehen Ihre Daten verloren.",
  },
  ru: {
    warning: "⚠️ HBS работает в автономном/демо-режиме. Данные вашей регистрации и входа хранятся только в этом браузере (LocalStorage). Если вы очистите историю браузера, ваши данные будут утеряны.",
  },
  ka: {
    warning: "⚠️ HBS მუშაობს ოფლაინ/დემო რეჟიმში. თქვენი რეგისტრაციის და შესვლის მონაცემები ინახება მხოლოდ ამ ბრაუზერში (LocalStorage). ბრაუზერის ისტორიის წაშლის შემთხვევაში თქვენი მონაცემები დაიკარგება.",
  }
};

export default function DemoModeBanner() {
  const [isDemo, setIsDemo] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isUnconfigured = !supabaseUrl || supabaseUrl === "https://placeholder.supabase.co" || supabaseUrl.includes("placeholder");
    setIsDemo(isUnconfigured);

    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (isLanguageCode(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  if (!isDemo || dismissed) return null;

  const t = messages[language] || messages.tr;

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 text-amber-800 text-[10px] sm:text-xs font-semibold px-3 py-2 flex items-center justify-between gap-3 select-none backdrop-blur-md animate-fadeIn">
      <div className="flex items-center gap-1.5 leading-normal max-w-[90%]">
        <span>{t.warning}</span>
      </div>
      <button 
        type="button" 
        onClick={() => setDismissed(true)} 
        className="text-amber-800 hover:text-amber-950 font-black text-xs px-1 hover:scale-110 active:scale-95 transition cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
