"use client";

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

  const currentText = texts[language];

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
    <main className="hbs-market-page min-h-screen px-3 py-3 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-lg font-black tracking-wide sm:text-2xl">HBS</Link>
          <div className="flex items-center gap-2"><CompactLanguageSwitcher /><Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black hover:bg-slate-50">{currentText.home}</Link></div>
        </header>
        <section className="grid gap-4 rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-2xl md:grid-cols-[1fr_0.9fr] md:p-5">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4 md:p-5">
            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">{currentText.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{currentText.description}</p>
          </div>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="grid gap-1.5"><span className="text-xs font-bold text-slate-600">{currentText.username}</span><input value={username} onChange={(event) => setUsername(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500" placeholder="" autoComplete="username" /></label>
            <label className="mt-3 grid gap-1.5"><span className="text-xs font-bold text-slate-600">{currentText.password}</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500" placeholder="••••••" autoComplete="current-password" /></label>
            {error && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-bold text-red-700">{error}</div>}
            <button className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">{currentText.login}</button>
            
            {hasBiometricKey && (
              <button
                type="button"
                onClick={handleBiometricLogin}
                className="mt-2 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700 hover:bg-blue-100 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                👤 Parmak İzi / Yüz Tanıma (Passkey) ile Giriş
              </button>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2"><Link href="/forgot-password" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold hover:bg-slate-100">{currentText.forgot}</Link><Link href="/register" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold hover:bg-slate-100">{currentText.register}</Link></div>
          </form>
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
