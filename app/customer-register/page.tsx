"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function CustomerRegisterPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (!phone || !email || !password) {
      setMessage("Lütfen tüm zorunlu alanları doldurun.");
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
            }
          }
        });

        if (authError) {
          setMessage(`Hata: ${authError.message}`);
          setLoading(false);
          return;
        }

        if (data.user) {
          // Save customer data in customers table
          const { error: dbError } = await supabase.from("customers").insert({
            id: data.user.id,
            full_name: email.split("@")[0], // Default username
            phone,
            email,
            trust_score: 100,
          });

          if (dbError) {
            console.error("Müşteri tablosuna kaydedilirken hata oluştu:", dbError);
          }
        }
      }

      // Offline / LocalStorage fallback
      const customerUser = {
        username: email,
        displayName: email.split("@")[0],
        phone,
        role: "customer",
        signedInAt: new Date().toISOString(),
      };
      
      window.localStorage.setItem("hbs-current-user", JSON.stringify(customerUser));
      
      // Update registration draft list
      const customersList = JSON.parse(window.localStorage.getItem("hbs-customers-list") || "[]");
      customersList.push(customerUser);
      window.localStorage.setItem("hbs-customers-list", JSON.stringify(customersList));

      setIsSuccess(true);
      setMessage("Ziyaretçi hesabınız başarıyla oluşturuldu! Artık ürünleri gezebilir ve sipariş aşamasında adresinizi girebilirsiniz.");
    } catch (err: any) {
      setMessage(`Sistem hatası: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 py-12 justify-center flex-1">
        <header className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500"
          >
            HBS
          </Link>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">MÜŞTERİ KAYIT MERKEZİ</p>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
          {isSuccess ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-3xl">
                ✓
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Harika! Kayıt Tamamlandı</h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {message}
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href="/"
                  className="block w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  Ürünleri Keşfet
                </Link>
                <Link
                  href="/customer"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold hover:bg-slate-900 transition"
                >
                  Müşteri Portalı
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">HBS Ziyaretçi Kaydı</h1>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Alışveriş yapmaya başlamak için sadece e-posta ve telefon yeterlidir. Sipariş verirken adresiniz zorunlu kılınacaktır.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">E-posta Adresi *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                    placeholder="+90 555 123 45 67"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Şifre *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                    placeholder="••••••••"
                  />
                </div>

                {message && (
                  <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-400">
                    ⚠️ {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 hover:bg-slate-200 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-2"
                >
                  {loading ? "Kaydediliyor..." : "Ziyaretçi Kaydını Tamamla"}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-800/80 pt-4 flex justify-between items-center">
                <span>Zaten hesabınız var mı?</span>
                <Link href="/login" className="font-bold text-blue-400 hover:underline">Giriş Yap</Link>
              </div>
            </>
          )}
        </section>
      </div>
      
      <footer className="text-center py-6 text-xs text-slate-600 border-t border-slate-900/50">
        HBS Cloud Discovery Platform © 2026. All rights reserved.
      </footer>
    </main>
  );
}