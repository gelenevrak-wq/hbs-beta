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
  { username: "OZGUR", password: "OZDEMIR", role: "superadmin", storeSlugs: ["obdtr", "yildiz-hirdavat", "ferro-motors"], displayName: "Özgür Özdemir", redirectTo: "/dashboard" },
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
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
  }, []);
  const currentText = texts[language];
  
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
        // @ts-expect-error profiles table joined schema typing
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
      // Demo kullanıcı fall-back
      const normalizedUsername = inputVal.toUpperCase();
      const user = demoUsers.find(
        (item) => item.username === normalizedUsername && item.password === password.trim()
      );
      if (!user) {
        setError(currentText.error);
        return;
      }
      window.localStorage.setItem(
        "hbs-current-user",
        JSON.stringify({
          username: user.username,
          displayName: user.displayName,
          role: user.role,
          storeSlugs: user.storeSlugs,
          signedInAt: new Date().toISOString(),
        })
      );
      window.localStorage.setItem(
        "hbs-demo-user",
        JSON.stringify({
          username: user.username,
          role: user.role,
          store: user.storeSlugs[0] ?? "ALL",
          note: user.displayName,
        })
      );
      window.location.href = user.redirectTo;
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
            <label className="grid gap-1.5"><span className="text-xs font-bold text-slate-600">{currentText.username}</span><input value={username} onChange={(event) => setUsername(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500" placeholder="" autoComplete="username" /></label>
            <label className="mt-3 grid gap-1.5"><span className="text-xs font-bold text-slate-600">{currentText.password}</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500" placeholder="••••••" autoComplete="current-password" /></label>
            {error && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-bold text-red-700">{error}</div>}
            <button className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">{currentText.login}</button>
            <div className="mt-3 grid grid-cols-2 gap-2"><Link href="/forgot-password" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold hover:bg-slate-100">{currentText.forgot}</Link><Link href="/register" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold hover:bg-slate-100">{currentText.register}</Link></div>
          </form>
        </section>
      </div>
    </main>
  );
}
