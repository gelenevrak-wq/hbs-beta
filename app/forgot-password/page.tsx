"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  return (
    <main className="hbs-market-page min-h-screen px-3 py-3 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-lg rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-2xl">
        <Link href="/" className="text-lg font-black">HBS</Link><h1 className="mt-4 text-2xl font-black">Şifremi unuttum</h1><p className="mt-2 text-sm leading-6 text-slate-600">E-posta veya telefon bilgini gir. Canlı sistemde doğrulama kodu burada gönderilecek.</p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3"><input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none" placeholder="E-posta veya telefon" /><button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">Kurtarma bağlantısı gönder</button></form>
        {sent && <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-900">Demo kurtarma akışı oluşturuldu.</div>}<Link href="/login" className="mt-3 inline-flex text-sm font-bold text-blue-700">Giriş ekranına dön</Link>
      </div>
    </main>
  );
}
