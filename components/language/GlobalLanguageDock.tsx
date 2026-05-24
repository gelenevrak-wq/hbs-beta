"use client";

import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

export default function GlobalLanguageDock() {
  return (
    <div className="fixed right-2 top-2 z-[9999] sm:right-4 sm:top-4 print:hidden">
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <CompactLanguageSwitcher />
      </div>
    </div>
  );
}
