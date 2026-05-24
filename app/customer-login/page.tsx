"use client";

import { useEffect } from "react";

export default function RedirectToUnifiedLogin() {
  useEffect(() => { window.location.replace("/login"); }, []);
  return (
    <main className="hbs-market-page flex min-h-screen items-center justify-center px-4 text-slate-950">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold shadow-xl">Tek giriş ekranına yönlendiriliyorsunuz...</div>
    </main>
  );
}
