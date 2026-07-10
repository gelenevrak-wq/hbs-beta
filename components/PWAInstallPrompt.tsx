"use client";

import { useEffect, useState } from "react";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";

const pwaTranslations: Record<string, Record<string, string>> = {
  tr: {
    store: "HBS MAĞAZA",
    titleAndroid: "HBS'yi Telefonunuza Yükleyin",
    descAndroid: "Uygulamayı hızlıca ana ekranınıza kısayol olarak ekleyin. Google Play Store ile uğraşmadan anında kullanmaya başlayın.",
    later: "Daha Sonra",
    installNow: "📥 Şimdi Yükle",
    setupIos: "IPHONE KURULUMU",
    titleIos: "iPhone Ana Ekranına Kısayol Ekle",
    descIos: "HBS'yi iPhone'unuza uygulama olarak eklemek için tarayıcınızın altındaki paylaş butonunu kullanabilirsiniz:",
    step1: "Tarayıcı çubuğundaki Paylaş (Share) 📤 düğmesine dokunun.",
    step2: "Aşağı kaydırıp Ana Ekrana Ekle (Add to Home Screen) ➕ seçeneğini seçin.",
    gotIt: "Anladım"
  },
  en: {
    store: "HBS STORE",
    titleAndroid: "Install HBS on Your Phone",
    descAndroid: "Quickly add the app as a shortcut to your home screen. Start using it instantly without Google Play Store.",
    later: "Later",
    installNow: "📥 Install Now",
    setupIos: "IPHONE SETUP",
    titleIos: "Add Shortcut to iPhone Home Screen",
    descIos: "You can use the share button at the bottom of your browser to add HBS to your iPhone as an app:",
    step1: "Tap the Share 📤 button in the browser bar.",
    step2: "Scroll down and select Add to Home Screen ➕.",
    gotIt: "Got It"
  },
  de: {
    store: "HBS SHOP",
    titleAndroid: "HBS auf Ihrem Telefon installieren",
    descAndroid: "Fügen Sie die App schnell als Verknüpfung zu Ihrem Startbildschirm hinzu. Starten Sie sofort ohne Google Play Store.",
    later: "Später",
    installNow: "📥 Jetzt installieren",
    setupIos: "IPHONE-EINRICHTUNG",
    titleIos: "Verknüpfung zum iPhone-Startbildschirm hinzufügen",
    descIos: "Sie können die Teilen-Schaltfläche unten in Ihrem Browser verwenden, um HBS als App auf Ihrem iPhone hinzuzufügen:",
    step1: "Tippen Sie auf die Teilen 📤 Schaltfläche in der Browserleiste.",
    step2: "Scrollen Sie nach unten und wählen Sie Zum Home-Bildschirm hinzufügen ➕.",
    gotIt: "Verstanden"
  },
  ru: {
    store: "HBS МАГАЗИН",
    titleAndroid: "Установить HBS на ваш телефон",
    descAndroid: "Быстро добавьте приложение как ярлык на домашний экран. Начните использовать его мгновенно в обход Google Play Store.",
    later: "Позже",
    installNow: "📥 Установить сейчас",
    setupIos: "НАСТРОЙКА IPHONE",
    titleIos: "Добавить ярлык на экран iPhone",
    descIos: "Вы можете использовать кнопку «Поделиться» внизу браузера, чтобы добавить HBS на свой iPhone в качестве приложения:",
    step1: "Нажмите кнопку Поделиться 📤 на панели браузера.",
    step2: "Прокрутите вниз и выберите Добавить на экран «Домой» ➕.",
    gotIt: "Понятно"
  },
  ka: {
    store: "HBS მაღაზია",
    titleAndroid: "დააინსტალირეთ HBS თქვენს ტელეფონზე",
    descAndroid: "სწრაფად დაამატეთ აპლიკაცია თქვენი მთავარ ეკრანზე. დაიწყეთ მყისიერად გამოყენება Google Play Store-ის გარეშე.",
    later: "მოგვიანებით",
    installNow: "📥 დააინსტალირე ახლა",
    setupIos: "IPHONE-ის დაყენება",
    titleIos: "დაამატეთ მალსახმობი iPhone-ის ეკრანზე",
    descIos: "შეგიძლიათ გამოიყენოთ გაზიარების ღილაკი თქვენი ბრაუზერის ბოლოში, რათა დაამატოთ HBS თქვენს iPhone-ზე აპლიკაციად:",
    step1: "შეეხეთ გაზიარების 📤 ღილაკს ბრაუზერის ზოლში.",
    step2: "ჩამოწიეთ და აირჩიეთ მთავარ ეკრანზე დამატება ➕.",
    gotIt: "გავიგე"
  }
};

export default function PWAInstallPrompt() {
  const { language } = useHbsLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidBanner, setShowAndroidBanner] = useState(false);
  const [showiOSBanner, setShowiOSBanner] = useState(false);
  const s = pwaTranslations[language || "tr"] || pwaTranslations.tr;

  useEffect(() => {
    // 1. Detect if the app is already running in standalone mode (installed PWA)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;
    
    if (isStandalone) return;

    // 2. Check if the user previously dismissed the prompt during this session
    const isDismissed = sessionStorage.getItem("hbs-pwa-dismissed") === "true";
    if (isDismissed) return;

    // 3. Listen for browser PWA install trigger (Chrome / Android / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Detect iOS devices (Safari does not support beforeinstallprompt)
    const ua = window.navigator.userAgent;
    const isiOS = /iphone|ipad|ipod/.test(ua.toLowerCase());
    const isSafari = /safari/.test(ua.toLowerCase()) && !/crios|fxios|opr|mercury/.test(ua.toLowerCase());

    if (isiOS && isSafari) {
      // Show iOS PWA guide after 4 seconds (so they have time to look at the page)
      const timer = setTimeout(() => {
        setShowiOSBanner(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowAndroidBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowAndroidBanner(false);
    setShowiOSBanner(false);
    sessionStorage.setItem("hbs-pwa-dismissed", "true");
  };

  if (!showAndroidBanner && !showiOSBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] max-w-md mx-auto md:left-auto md:right-4 animate-slideUp">
      {/* Android & Desktop Chrome / Edge Install Banner */}
      {showAndroidBanner && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white space-y-3 relative overflow-hidden backdrop-blur-md bg-opacity-95">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xs"
          >
            ✕
          </button>
          
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">📱</span>
            <div className="space-y-1">
              <span className="inline-block bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">{s.store}</span>
              <h4 className="text-sm font-black">{s.titleAndroid}</h4>
              <p className="text-xs text-slate-400 leading-normal">
                {s.descAndroid}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-xl border border-slate-700 hover:bg-slate-800 transition text-xs font-black px-4 py-2"
            >
              {s.later}
            </button>
            <button
              type="button"
              onClick={handleInstallClick}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 transition text-xs font-black px-5 py-2 text-white shadow"
            >
              {s.installNow}
            </button>
          </div>
        </div>
      )}

      {/* iOS (iPhone/iPad) Safari Guide Tooltip */}
      {showiOSBanner && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white space-y-3.5 relative overflow-hidden backdrop-blur-md bg-opacity-95">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xs"
          >
            ✕
          </button>

          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">🍏</span>
            <div className="space-y-1">
              <span className="inline-block bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">{s.setupIos}</span>
              <h4 className="text-sm font-black">{s.titleIos}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {s.descIos}
              </p>
            </div>
          </div>

          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-850 text-xs space-y-2 font-semibold text-slate-350">
            <p className="flex items-center gap-2">
              <span className="bg-slate-800 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">1</span>
              <span>{s.step1}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="bg-slate-800 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">2</span>
              <span>{s.step2}</span>
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-xl bg-slate-800 hover:bg-slate-750 transition text-xs font-black px-5 py-2"
            >
              {s.gotIt}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
