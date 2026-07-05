"use client";

import { translations } from "@/lib/translations";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import CompactLanguageSwitcher, { LanguageCode } from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";

type DemoUser = {
  username: string;
  password: string;
  role: "superadmin" | "storeOwner" | "customer";
  storeSlugs: string[];
  displayName: string;
  redirectTo: string;
};

const demoUsers: DemoUser[] = [
  { username: "OZGUR", password: "OZDEMIR", role: "superadmin", storeSlugs: ["obdtr", "yildiz-hirdavat"], displayName: "Özgür Özdemir", redirectTo: "/dashboard" },
  { username: "ALTANCANCI", password: "CANCI35", role: "storeOwner", storeSlugs: ["obdtr"], displayName: "Altan Cancı", redirectTo: "/dashboard" },
  { username: "MUSTERI", password: "MUSTERI123", role: "customer", storeSlugs: [], displayName: "Demo Müşteri", redirectTo: "/customer" },
];

const texts = {
  tr: { home: "Ana sayfa", title: "HBS hesabına giriş yap", description: "Alışveriş, rezervasyon ve hesabına ait işlemler için giriş yap.", username: "Kullanıcı adı veya E-posta", password: "Şifre", login: "Giriş yap", forgot: "Şifremi unuttum", register: "Kayıt ol", error: "Giriş bilgileri hatalı veya kullanıcı bulunamadı." },
  en: { home: "Home", title: "Sign in to HBS", description: "Sign in for shopping, bookings and account actions.", username: "Username or Email", password: "Password", login: "Sign in", forgot: "Forgot password", register: "Register", error: "Invalid credentials or user not found." },
  de: { home: "Startseite", title: "Bei HBS anmelden", description: "Für Einkauf, Reservierung und Kontoaktionen anmelden.", username: "Benutzername oder E-Mail", password: "Passwort", login: "Anmelden", forgot: "Passwort vergessen", register: "Registrieren", error: "Ungültige Anmeldedaten." },
  ru: { home: "Главная", title: "Войти в HBS", description: "Войдите для покупок, бронирований и действий в аккаунте.", username: "Пользователь или Email", password: "Пароль", login: "Войти", forgot: "Забыли пароль", register: "Регистрация", error: "Неверный логин, email или пароль." },
  ka: { home: "მთავარი", title: "HBS-ში შესვლა", description: "შედით შესყიდვების, ჯავშნების და ანგარიშის მოქმედებებისთვის.", username: "მომხმარებელი ან ელფოსტა", password: "პაროლი", login: "შესვლა", forgot: "პაროლი დამავიწყდა", register: "რეგისტრაცია", error: "მომხმარებელი, ელფოსტა ან პაროლი არასწორია." },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "tr" || value === "en" || value === "ru" || value === "ka" || value === "de";
}

export default function LoginPage() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [hasBiometricKey, setHasBiometricKey] = useState(false);
  const [biometricUser, setBiometricUser] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [activeDemoGlow, setActiveDemoGlow] = useState<string | null>(null);

  const fillDemoUser = (demo: DemoUser) => {
    setActiveDemoGlow(demo.username);
    setUsername(demo.username);
    setPassword(demo.password);
    setTimeout(() => {
      setActiveDemoGlow(null);
    }, 1000);
  };

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
    
    // Check for local biometric registration
    const biometricUserStr = window.localStorage.getItem("hbs-biometric-user");
    if (biometricUserStr) {
      try {
        const parsed = JSON.parse(biometricUserStr);
        if (parsed && parsed.username) {
          setHasBiometricKey(true);
          setBiometricUser(parsed);
        }
      } catch (e) {
        console.error("Biometric user parsing error", e);
      }
    }
  }, []);

  const currentText = {
    home: translations[language].common.home,
    title: translations[language].auth.signIntoHbs,
    description: translations[language].auth.pleaseAuthenticate,
    username: translations[language].auth.usernameOrEmail,
    password: translations[language].auth.password,
    login: translations[language].auth.loginBtn,
    forgot: translations[language].auth.forgotPassword,
    register: translations[language].auth.registerLink,
    error: translations[language].auth.invalidCredentials
  };

  async function handleBiometricLogin() {
    setIsScanning(true);
    setScanMessage("Cihazınız taranıyor... (Parmak İzi / Yüz Tanıma)");
    
    setTimeout(() => {
      if (biometricUser) {
        setScanMessage("Doğrulama Başarılı! Oturum Açılıyor...");
        
        setTimeout(() => {
          // Log in the biometric user
          window.localStorage.setItem(
            "hbs-current-user",
            JSON.stringify(biometricUser)
          );
          window.localStorage.setItem(
            "hbs-demo-user",
            JSON.stringify({
              username: biometricUser.username,
              role: biometricUser.role,
              store: "ALL",
              note: biometricUser.displayName,
            })
          );
          
          setIsScanning(false);
          // Redirect
          window.location.href = "/customer";
        }, 850);
      } else {
        setIsScanning(false);
        setError("Biyometrik giriş bilgisi bulunamadı.");
      }
    }, 1500);
  }
  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    const inputVal = username.trim();
    const isEmail = inputVal.includes("@");

    if (isSupabaseConfigured && isEmail) {
      // Supabase ile gerçek giriş yap
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: inputVal,
        password: password.trim(),
      });

      if (authError) {
        setError(authError.message || currentText.error);
        return;
      }

      if (data.user) {
        // Kullanıcı profilini çek
        const { data: profile } = await supabase
          .from("profiles")
          .select("*, companies(*)")
          .eq("id", data.user.id)
          .single();

        const role = profile?.role ?? "viewer";
        const displayName = profile?.full_name ?? data.user.email?.split("@")[0] ?? "Kullanıcı";
        
        // Şirket kodu / store slug mapping
        const companyCode = profile?.companies?.code;
        const storeSlugs = companyCode ? [companyCode] : [];
        
        let redirectTo = "/customer";
        if (role === "owner" || role === "top_manager" || role === "store_manager" || role === "superadmin") {
          redirectTo = "/dashboard";
        }

        window.localStorage.setItem(
          "hbs-current-user",
          JSON.stringify({
            username: data.user.email,
            displayName,
            role,
            storeSlugs,
            signedInAt: new Date().toISOString(),
          })
        );
        window.localStorage.setItem(
          "hbs-demo-user",
          JSON.stringify({
            username: data.user.email,
            role,
            store: storeSlugs[0] ?? "ALL",
            note: displayName,
          })
        );
        window.location.href = redirectTo;
      }
    } else {
      // Demo kullanıcı ve local tescilli mağaza fall-back
      const normalizedUsername = inputVal.toUpperCase();
      let user = demoUsers.find(
        (item) => item.username === normalizedUsername && item.password === password.trim()
      );

      // If user is a demo user, also check if their store is deactivated
      if (user && user.role !== "superadmin") {
        const storeCode = user.storeSlugs?.[0];
        if (storeCode) {
          try {
            const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
            const matchingStore = localStores.find((s: any) => s.code === storeCode);
            if (matchingStore && matchingStore.isActive === false) {
              setError(language === "tr"
                ? "Bağlı olduğunuz mağaza pasife alınmıştır. Lütfen platform sahibi ile iletişime geçin."
                : "Your store has been deactivated. Please contact the platform administrator."
              );
              return;
            }
          } catch (e) {
            console.error("Check active store error for demo user", e);
          }
        }
      }

      let isLocalRegisteredStore = false;
      let localStoreUser: any = null;

      if (!user) {
        // Local tescilli mağaza sahiplerini kontrol et
        try {
          const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
          const foundStore = localStores.find(
            (store: any) =>
              store.email.toLowerCase() === inputVal.toLowerCase() &&
              store.password === password.trim()
          );
          if (foundStore) {
            // Check active status
            if (foundStore.isActive === false) {
              setError(language === "tr" 
                ? "Bağlı olduğunuz mağaza pasife alınmıştır. Lütfen platform sahibi ile iletişime geçin."
                : "Your store has been deactivated. Please contact the platform administrator."
              );
              return;
            }

            isLocalRegisteredStore = true;
            localStoreUser = {
              username: foundStore.email,
              displayName: foundStore.representative,
              role: "owner",
              storeSlugs: [foundStore.code],
              redirectTo: "/dashboard"
            };
          }
        } catch (e) {
          console.error("Local stores parse error", e);
        }
      }

      // Check local registered store staff users (from hbs-store-users)
      if (!user && !localStoreUser) {
        try {
          const localStaff = JSON.parse(window.localStorage.getItem("hbs-store-users") || "[]");
          const foundStaff = localStaff.find(
            (st: any) =>
              st.username.toLowerCase() === inputVal.toLowerCase() &&
              st.password === password.trim()
          );
          if (foundStaff) {
            // Verify if the staff member's store is active
            const storeCode = foundStaff.storeSlugs?.[0];
            if (storeCode) {
              const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
              const matchingStore = localStores.find((s: any) => s.code === storeCode);
              if (matchingStore && matchingStore.isActive === false) {
                setError(language === "tr"
                  ? "Bağlı olduğunuz mağaza pasife alınmıştır. Lütfen platform sahibi ile iletişime geçin."
                  : "Your store has been deactivated. Please contact the platform administrator."
                );
                return;
              }
            }

            localStoreUser = {
              username: foundStaff.username,
              displayName: foundStaff.displayName,
              role: foundStaff.role,
              storeSlugs: foundStaff.storeSlugs,
              redirectTo: "/dashboard"
            };
          }
        } catch (e) {
          console.error("Local staff parse error", e);
        }
      }

      const activeUser = user || localStoreUser;

      if (!activeUser) {
        setError(currentText.error);
        return;
      }

      window.localStorage.setItem(
        "hbs-current-user",
        JSON.stringify({
          username: activeUser.username,
          displayName: activeUser.displayName,
          role: activeUser.role,
          storeSlugs: activeUser.storeSlugs,
          signedInAt: new Date().toISOString(),
        })
      );
      window.localStorage.setItem(
        "hbs-demo-user",
        JSON.stringify({
          username: activeUser.username,
          role: activeUser.role,
          store: activeUser.storeSlugs[0] ?? "ALL",
          note: activeUser.displayName,
        })
      );
      window.location.href = activeUser.redirectTo;
    }
  }
  return (
    <main className="hbs-market-page relative min-h-screen flex flex-col justify-center items-center px-4 py-8 overflow-hidden">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] sm:w-[45rem] sm:h-[45rem] rounded-full bg-blue-400/20 blur-[130px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] rounded-full bg-purple-300/15 blur-[120px] pointer-events-none select-none" />
      <div className="absolute top-[35%] right-[15%] w-[25rem] h-[25rem] rounded-full bg-emerald-300/10 blur-[110px] pointer-events-none select-none" />

      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#f3f6fc_100%)] opacity-30 pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="relative w-full max-w-5xl z-10 space-y-4">
        {/* Sleek Minimalist Header */}
        <header className="flex items-center justify-between gap-4 px-2 sm:px-6">
          <Link href="/" className="group flex items-center gap-2 select-none">
            <span className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              HBS
            </span>
            <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold px-2 py-0.5 text-[8px] sm:text-[9px] uppercase tracking-wider shadow-sm">
              Connected
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <CompactLanguageSwitcher />
            <Link 
              href="/" 
              className="rounded-full border border-slate-200 bg-white/80 hover:bg-white px-4 py-2 text-xs font-black text-slate-700 hover:text-blue-700 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>🏠</span> {currentText.home}
            </Link>
          </div>
        </header>

        {/* Main Split Screen Container */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/70 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(99,102,241,0.12)] grid gap-0 md:grid-cols-[1.1fr_0.9fr] p-2 sm:p-3 animate-fadeIn">
          
          {/* Left Column: Brand Powers & Value Prop Showcase */}
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-50/50 via-indigo-50/20 to-purple-50/40 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden border border-white/40">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-[60px] pointer-events-none" />

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black tracking-tight leading-none text-slate-900">
                {translations[language].auth.oneAccountCompleteControl}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-md">
                {currentText.description}
              </p>
            </div>

            {/* Premium Feature Showcase Grid */}
            <div className="grid gap-4 py-2">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  ),
                  title: language === "tr" ? "Merkez Depo & Akıllı Raf" : "Central Warehouse & Smart Shelf",
                  text: language === "tr" ? "Sanal mağaza kalıplarını geride bırakın; ürünlerinizi fiziksel konum ve raf bazlı entegre edin." : "Leave placeholders behind; integrate your goods with physical locations and shelves."
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  ),
                  title: language === "tr" ? "B2B Canlı Pazarlık & Teklif" : "Live B2B Offer & Bidding",
                  text: language === "tr" ? "Müşterilerinizin iskontolu fiyat ve pazarlık taleplerini tek ekrandan onaylayın." : "Approve custom discount requests and negotiation offers in real time."
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a3 3 0 116 0v4c0 .879.222 1.705.616 2.427M12 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  ),
                  title: language === "tr" ? "Gelişmiş Touch ID & Passkey" : "Advanced Touch ID & Passkey",
                  text: language === "tr" ? "Dünya standartlarında biyometrik güvenlik ile şifresiz, tek dokunuşla hızlı giriş." : "World-class biometric security for passwordless, single-touch logins."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group flex gap-4 p-3.5 rounded-2xl bg-white/60 hover:bg-white border border-white/20 hover:border-blue-100 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 select-none"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-blue-50/50 transition-all duration-300 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-black text-slate-800 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-[11px] font-semibold text-slate-450 leading-normal">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom mini teaser */}
            <div className="text-[11px] font-black tracking-wide text-indigo-500/80 uppercase select-none border-t border-slate-200/50 pt-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {translations[language].auth.noAnnualFee}
            </div>
          </div>

          {/* Right Column: Interactive Login Form */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white/50 backdrop-blur rounded-[2rem] border border-white/30">
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{currentText.title}</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">{translations[language].auth.pleaseAuthenticate}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input Wrapper */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block pl-1">{currentText.username}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input 
                      value={username} 
                      onChange={(event) => setUsername(event.target.value)} 
                      className={`w-full rounded-2xl border ${activeDemoGlow ? 'border-blue-500 ring-4 ring-blue-500/20 bg-blue-50/10' : 'border-slate-200 bg-white'} pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm`}
                      placeholder={translations[language].auth.placeholderUsername} 
                      autoComplete="username" 
                    />
                  </div>
                </div>

                {/* Password Input Wrapper */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-600 block">{currentText.password}</label>
                    <Link href="/forgot-password" className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 transition">
                      {currentText.forgot}
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(event) => setPassword(event.target.value)} 
                      className={`w-full rounded-2xl border ${activeDemoGlow ? 'border-blue-500 ring-4 ring-blue-500/20 bg-blue-50/10' : 'border-slate-200 bg-white'} pl-11 pr-11 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm`}
                      placeholder="••••••" 
                      autoComplete="current-password" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition active:scale-90"
                      title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                    >
                      {showPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-black text-red-700 leading-normal flex items-start gap-2 shadow-sm">
                    <span className="text-base select-none">⚠️</span>
                    <div>{error}</div>
                  </div>
                )}

                {/* Primary login button */}
                <button 
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3.5 text-sm font-black text-white hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.4)] hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300 select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-md text-center"
                >
                  <span>🔑</span> {currentText.login}
                </button>
                
                {/* Biometric flow triggers */}
                {hasBiometricKey && (
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    className="w-full rounded-2xl border border-blue-200 bg-blue-50/80 hover:bg-blue-50 px-4 py-3.5 text-xs font-black text-blue-700 transition flex items-center justify-center gap-2 hover:shadow-md hover:shadow-blue-500/5 active:scale-[0.98] cursor-pointer"
                  >
                    <span className="text-sm select-none">👤</span>
                    {language === "tr" ? "Parmak İzi / Yüz Tanıma (Passkey) ile Giriş" : "Sign in with Fingerprint / Face ID (Passkey)"}
                  </button>
                )}
              </form>

              {/* Call to action for registration */}
              <div className="text-center pt-2 select-none">
                <span className="text-xs font-semibold text-slate-400">
                  {language === "tr" ? "Hâlâ HBS hesabınız yok mu?" : "Don't have an HBS account yet?"}{" "}
                </span>
                <Link href="/register" className="text-xs font-black text-blue-600 hover:text-blue-700 hover:underline transition">
                  {currentText.register}
                </Link>
              </div>

            </div>
          </div>
        </section>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-2xl transition-all text-white">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-400 relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping opacity-75"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="w-10 h-10 animate-pulse text-blue-400" viewBox="0 0 16 16">
                <path d="M4.828 8.9A.5.5 0 0 1 5 8.5c0-.18.064-.324.152-.424.089-.1.202-.154.348-.154.146 0 .26.054.348.154.088.1.152.244.152.424a.5.5 0 1 1-1 0c0-.07-.024-.12-.042-.14-.017-.02-.044-.03-.058-.03-.014 0-.04.01-.058.03-.018.02-.042.07-.042.14a.5.5 0 0 1-.5.5M7 6.5C7 5.672 7.672 5 8.5 5s1.5.672 1.5 1.5c0 .313-.083.56-.217.74-.132.18-.3.26-.483.26-.183 0-.35-.08-.483-.26-.134-.18-.217-.427-.217-.74a.5.5 0 0 0-1 0c0 .687.217 1.14.517 1.543.3.4.717.657 1.183.657.466 0 .883-.257 1.183-.657.3-.404.517-.856.517-1.543 0-1.38-1.12-2.5-2.5-2.5S6 5.12 6 6.5a.5.5 0 0 0 1 0"/>
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0"/>
              </svg>
            </div>
            <h3 className="text-xl font-black tracking-tight">Biyometrik Doğrulama</h3>
            <p className="mt-3 text-sm text-slate-300 font-semibold leading-relaxed">
              {scanMessage}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
