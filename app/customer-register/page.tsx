"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import CompactLanguageSwitcher, { LanguageCode, isLanguageCode } from "@/components/language/CompactLanguageSwitcher";

const texts = {
  tr: {
    home: "Ana Sayfa",
    subtitle: "MÜŞTERİ KAYIT MERKEZİ",
    title: "HBS Ziyaretçi Kaydı",
    description: "Alışveriş yapmaya başlamak için sadece e-posta ve telefon yeterlidir.",
    emailLabel: "E-posta Adresi *",
    phoneLabel: "Telefon Numarası *",
    passwordLabel: "Şifre *",
    fullNameLabel: "Ad Soyad (Opsiyonel)",
    addressLabel: "Mağaza / Sevk Adresi (Opsiyonel)",
    passkeyTitle: "👤 Parmak İzi / Yüz Tanıma (Passkey)",
    passkeyDesc: "Şifresiz hızlı giriş için cihaz doğrulaması bağlayın.",
    passkeyRegistering: "Cihaz taranıyor...",
    passkeySuccess: "✓ Biyometrik Kimlik Tanımlandı (Passkey)",
    passkeyConnect: "👤 Cihaz Biyometrisini Bağla",
    successTitle: "Harika! Kayıt Tamamlandı",
    exploreBtn: "Ürünleri Keşfet",
    portalBtn: "Müşteri Portalı",
    submitBtn: "Ziyaretçi Kaydını Tamamla",
    savingBtn: "Kaydediliyor...",
    alreadyHaveAccount: "Zaten hesabınız var mı?",
    loginBtn: "Giriş Yap",
    successMsg: "Ziyaretçi hesabınız başarıyla oluşturuldu! Artık ürünleri gezebilir ve sipariş aşamasında adresinizi değiştirebilirsiniz.",
    systemError: "Sistem hatası: ",
    requiredFieldsError: "Lütfen tüm zorunlu alanları doldurun."
  },
  en: {
    home: "Home",
    subtitle: "CUSTOMER REGISTRATION CENTER",
    title: "HBS Visitor Registration",
    description: "Only email and phone number are required to start shopping.",
    emailLabel: "Email Address *",
    phoneLabel: "Phone Number *",
    passwordLabel: "Password *",
    fullNameLabel: "Full Name (Optional)",
    addressLabel: "Store / Delivery Address (Optional)",
    passkeyTitle: "👤 Fingerprint / Face ID (Passkey)",
    passkeyDesc: "Connect device authentication for quick passwordless sign-in.",
    passkeyRegistering: "Scanning device...",
    passkeySuccess: "✓ Biometric Identity Registered (Passkey)",
    passkeyConnect: "👤 Connect Device Biometrics",
    successTitle: "Awesome! Registration Completed",
    exploreBtn: "Explore Products",
    portalBtn: "Customer Portal",
    submitBtn: "Complete Visitor Registration",
    savingBtn: "Saving...",
    alreadyHaveAccount: "Already have an account?",
    loginBtn: "Sign In",
    successMsg: "Your visitor account has been successfully created! You can now explore products and change your address at checkout.",
    systemError: "System error: ",
    requiredFieldsError: "Please fill in all required fields."
  },
  de: {
    home: "Startseite",
    subtitle: "KUNDEN-REGISTRIERUNGSZENTRUM",
    title: "HBS Besucherregistrierung",
    description: "Nur E-Mail und Telefonnummer sind erforderlich, um mit dem Einkaufen zu beginnen.",
    emailLabel: "E-Mail-Adresse *",
    phoneLabel: "Telefonnummer *",
    passwordLabel: "Passwort *",
    fullNameLabel: "Vollständiger Name (Optional)",
    addressLabel: "Lieferadresse (Optional)",
    passkeyTitle: "👤 Fingerabdruck / Face ID (Passkey)",
    passkeyDesc: "Geräte-Authentifizierung für schnelles passwortloses Anmelden verbinden.",
    passkeyRegistering: "Gerät wird gescannt...",
    passkeySuccess: "✓ Biometrische Identität registriert (Passkey)",
    passkeyConnect: "👤 Biometrie verbinden",
    successTitle: "Großartig! Registrierung abgeschlossen",
    exploreBtn: "Produkte entdecken",
    portalBtn: "Kundenportal",
    submitBtn: "Besucherregistrierung abschließen",
    savingBtn: "Wird gespeichert...",
    alreadyHaveAccount: "Haben Sie bereits ein Konto?",
    loginBtn: "Anmelden",
    successMsg: "Ihr Besucherkonto wurde erfolgreich erstellt! Sie können jetzt Produkte durchsuchen und Ihre Adresse an der Kasse ändern.",
    systemError: "Systemfehler: ",
    requiredFieldsError: "Bitte füllen Sie alle Pflichtfelder aus."
  },
  ru: {
    home: "Главная",
    subtitle: "ЦЕНТР РЕГИСТРАЦИИ КЛИЕНТОВ",
    title: "Регистрация посетителя HBS",
    description: "Для начала покупок требуются только электронная почта и номер телефона.",
    emailLabel: "Email *",
    phoneLabel: "Номер телефона *",
    passwordLabel: "Пароль *",
    fullNameLabel: "Имя и фамилия (необязательно)",
    addressLabel: "Адрес доставки (необязательно)",
    passkeyTitle: "👤 Отпечаток пальца / Face ID (Passkey)",
    passkeyDesc: "Подключите устройство для быстрого входа без пароля.",
    passkeyRegistering: "Сканирование устройства...",
    passkeySuccess: "✓ Биометрия настроена (Passkey)",
    passkeyConnect: "👤 Подключить биометрию",
    successTitle: "Отлично! Регистрация завершена",
    exploreBtn: "Смотреть товары",
    portalBtn: "Портал покупателя",
    submitBtn: "Завершить регистрацию",
    savingBtn: "Сохранение...",
    alreadyHaveAccount: "Уже есть аккаунт?",
    loginBtn: "Войти",
    successMsg: "Ваш аккаунт посетителя успешно создан! Теперь вы можете просматривать товары и менять адрес при оформлении заказа.",
    systemError: "Системная ошибка: ",
    requiredFieldsError: "Пожалуйста, заполните все обязательные поля."
  },
  ka: {
    home: "მთავარი",
    subtitle: "მომხმარებელთა რეგისტრაციის ცენტრი",
    title: "HBS ვიზიტორის რეგისტრაცია",
    description: "შესყიდვების დასაწყებად საჭიროა მხოლოდ ელფოსტა და ტელეფონის ნომერი.",
    emailLabel: "ელფოსტის მისამართი *",
    phoneLabel: "ტელეფონის ნომერი *",
    passwordLabel: "პაროლი *",
    fullNameLabel: "სახელი და გვარი (არასავალდებულო)",
    addressLabel: "მიწოდების მისამართი (არასავალდებულო)",
    passkeyTitle: "👤 თითის ანაბეჭდი / სახის ID (Passkey)",
    passkeyDesc: "დაუკავშირეთ მოწყობილობის ავტორიზაცია სწრაფი შესვლისთვის.",
    passkeyRegistering: "მოწყობილობა სკანირდება...",
    passkeySuccess: "✓ ბიომეტრიული იდენტობა რეგისტრირებულია (Passkey)",
    passkeyConnect: "👤 ბიომეტრიის დაკავშირება",
    successTitle: "შესანიშნავია! რეგისტრაცია დასრულდა",
    exploreBtn: "პროდუქტების დათვალიერება",
    portalBtn: "მომხმარებლის პორტალი",
    submitBtn: "რეგისტრაციის დასრულება",
    savingBtn: "ინახება...",
    alreadyHaveAccount: "უკვე გაქვთ ანგარიში?",
    loginBtn: "შესვლა",
    successMsg: "ვიზიტორის ანგარიში წარმატებით შეიქმნა! ახლა შეგიძლიათ დაათვალიეროთ პროდუქტები და შეცვალოთ მისამართი შეკვეთისას.",
    systemError: "სისტემური შეცდომა: ",
    requiredFieldsError: "გთხოვთ შეავსოთ ყველა სავალდებულო ველი."
  }
};

export default function CustomerRegisterPage() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [biometricsRegistered, setBiometricsRegistered] = useState(false);
  const [isRegisteringBiometrics, setIsRegisteringBiometrics] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (isLanguageCode(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = texts[language];

  async function handleRegisterBiometrics() {
    setIsRegisteringBiometrics(true);
    setTimeout(() => {
      const customerUser = {
        username: email || "demo-musteri@email.com",
        displayName: fullName || email.split("@")[0] || "Demo",
        phone: phone || "+90 555 123 45 67",
        address: address || "",
        role: "customer",
        signedInAt: new Date().toISOString(),
      };
      window.localStorage.setItem("hbs-biometric-user", JSON.stringify(customerUser));
      setBiometricsRegistered(true);
      setIsRegisteringBiometrics(false);
    }, 1200);
  }
 
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
 
    if (!phone || !email || !password) {
      setMessage(t.requiredFieldsError);
      setLoading(false);
      return;
    }
 
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";
  
    try {
      if (isSupabaseConfigured) {
        // Supabase Auth signup
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              phone,
              role: "customer",
              full_name: fullName || email.split("@")[0],
              address: address || "",
            }
          }
        });
 
        if (authError) {
          setMessage(`${t.systemError}${authError.message}`);
          setLoading(false);
          return;
        }
 
        if (data.user) {
          // Save customer data in customers table
          const { error: dbError } = await supabase.from("customers").insert({
            id: data.user.id,
            full_name: fullName || email.split("@")[0],
            phone,
            email,
            address: address || "",
            trust_score: 100,
          });
 
          if (dbError) {
            console.error("Database save error:", dbError);
          }
        }
      }
 
      // Offline / LocalStorage fallback
      const customerUser = {
        username: email,
        displayName: fullName || email.split("@")[0],
        phone,
        address: address || "",
        role: "customer",
        signedInAt: new Date().toISOString(),
      };
      
      window.localStorage.setItem("hbs-current-user", JSON.stringify(customerUser));
      
      // Update registration list
      const customersList = JSON.parse(window.localStorage.getItem("hbs-customers-list") || "[]");
      customersList.push(customerUser);
      window.localStorage.setItem("hbs-customers-list", JSON.stringify(customersList));
 
      // Save biometric credentials if registered
      if (biometricsRegistered) {
        window.localStorage.setItem("hbs-biometric-user", JSON.stringify(customerUser));
      }
 
      setIsSuccess(true);
      setMessage(t.successMsg);
    } catch (err: any) {
      setMessage(`${t.systemError}${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-955 text-white flex flex-col justify-between">
      <div className="mx-auto flex w-full max-w-md flex-col px-3 py-6 justify-center flex-1">
        <header className="mb-4 flex flex-col items-center">
          <Link
            href="/"
            className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500"
          >
            HBS
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">{t.subtitle}</p>
          <div className="mt-3">
            <CompactLanguageSwitcher />
          </div>
        </header>

        <section className="rounded-xl bg-slate-900/40 p-4 shadow-sm border border-white/5">
          {isSuccess ? (
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 text-2xl">
                ✓
              </div>
              <h2 className="text-xl font-bold tracking-tight">{t.successTitle}</h2>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {message}
              </p>
              <div className="mt-4 space-y-2">
                <Link
                  href="/"
                  className="block w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-2 text-xs font-bold hover:from-blue-650 hover:to-indigo-650 transition active:scale-95 shadow-sm"
                >
                  {t.exploreBtn}
                </Link>
                <Link
                  href="/customer"
                  className="block w-full rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold hover:bg-slate-750 transition"
                >
                  {t.portalBtn}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h1 className="text-lg font-bold tracking-tight">{t.title}</h1>
                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 block">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition border border-white/5"
                    placeholder="ornek@email.com" id="id-page-email" aria-label="Email" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 block">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition border border-white/5"
                    placeholder="+90 555 123 45 67" id="id-page-phone" aria-label="Phone" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 block">{t.passwordLabel}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition border border-white/5"
                    placeholder="••••••••" id="id-page-password" aria-label="Password" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 block">{t.fullNameLabel}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition border border-white/5"
                    placeholder="John Doe" id="id-page-fullName" aria-label="Full Name" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 block">{t.addressLabel}</label>
                  <textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    rows={2}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition border border-white/5"
                    placeholder="Delivery address"
                  />
                </div>

                {/* WebAuthn Passkey */}
                <div className="mt-1.5 rounded-lg bg-slate-950/40 p-2.5 space-y-2 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-black text-slate-350">{t.passkeyTitle}</h4>
                      <p className="text-[9px] text-slate-500">{t.passkeyDesc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegisterBiometrics}
                    disabled={isRegisteringBiometrics || biometricsRegistered}
                    className={`w-full rounded-lg py-2 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${biometricsRegistered ? "bg-emerald-950/40 text-emerald-400" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}
                  >
                    {isRegisteringBiometrics ? (
                      <span>{t.passkeyRegistering}</span>
                    ) : biometricsRegistered ? (
                      <span>{t.passkeySuccess}</span>
                    ) : (
                      <span>{t.passkeyConnect}</span>
                    )}
                  </button>
                </div>

                {message && (
                  <div className="rounded-lg bg-red-950/20 p-2.5 text-xs text-red-400">
                    ⚠️ {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-white px-3 py-2.5 text-xs font-black text-slate-950 hover:bg-slate-200 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-1 shadow-md cursor-pointer"
                >
                  {loading ? t.savingBtn : t.submitBtn}
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-slate-550 border-t border-slate-800/40 pt-3 flex justify-between items-center select-none">
                <span>{t.alreadyHaveAccount}</span>
                <Link href="/login" className="font-bold text-blue-400 hover:underline">{t.loginBtn}</Link>
              </div>
            </>
          )}
        </section>
      </div>
      
      <footer className="text-center py-4 text-[10px] text-slate-600 border-t border-slate-950/30">
        HBS Cloud Discovery Platform © 2026. All rights reserved.
      </footer>
    </main>
  );
}