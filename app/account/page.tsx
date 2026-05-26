"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

const stores = [
  { id: "obdtr", name: "OBDTR", channel: "WhatsApp + E-posta", allowed: true },
  { id: "yildiz", name: "Yıldız Hırdavat", channel: "WhatsApp", allowed: true },
];

export default function AccountPage() {
  const [suspensionOpen, setSuspensionOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [suspended, setSuspended] = useState(false);
  const [storeConsents, setStoreConsents] = useState(stores);

  function toggleConsent(id: string) {
    setStoreConsents((items) => items.map((item) => item.id === id ? { ...item, allowed: !item.allowed } : item));
  }

  function suspendAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!approved) return;
    setSuspended(true);
    setSuspensionOpen(false);
  }

  return (
    <main className="hbs-market-page min-h-screen px-3 py-3 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-lg font-black tracking-wide sm:text-2xl">HBS</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black">Ana sayfa</Link>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
          <div className="hbs-market-card rounded-[1.5rem] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700">HESAP VE RIZA MERKEZİ</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Profil, bildirim ve üyelik kontrolü</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Müşteri veya mağaza hesabı askıya alınabilir. Ancak HBS üzerinde oluşan ticari kayıtlar işlem güvenliği, uyuşmazlık çözümü ve geçmiş kayıt bütünlüğü için saklanır.
            </p>
            {suspended && (
              <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm font-black text-amber-900">
                Demo durum: hesap askıya alındı. Canlı sistemde görünürlük durur, işlem geçmişi korunur.
              </div>
            )}
            <button onClick={() => setSuspensionOpen(true)} className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700">
              Üyeliği askıya alma sürecini aç
            </button>
          </div>

          <div className="hbs-market-card rounded-[1.5rem] p-4">
            <h2 className="text-lg font-black">Kampanya mesaj izinleri</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              HBS genel spam izni vermez. Müşteri, sadece ziyaret ettiği veya takip etmeyi kabul ettiği mağazalardan kampanya mesajı alır. Onay vermediği mağaza mesaj gönderemez.
            </p>
            <div className="mt-3 grid gap-2">
              {storeConsents.map((store) => (
                <div key={store.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <div className="text-sm font-black">{store.name}</div>
                    <div className="text-xs font-semibold text-slate-500">{store.channel}</div>
                  </div>
                  <button
                    onClick={() => toggleConsent(store.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${store.allowed ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}
                  >
                    {store.allowed ? "İzin açık" : "Kapalı"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-xs font-semibold leading-5 text-blue-900">
              Mağaza kendi sayfasında “kampanyalarımızı almak ister misiniz?” diye sorabilir. Müşteri onaylamazsa WhatsApp/e-posta kampanya gönderimi yapılamaz.
            </div>
          </div>
        </section>

        <section className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-base font-black">Teslimat adresi kuralı</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Müşteri kayıt olurken adres girmek zorunda değildir. Teslimat isteyen sipariş anında profil adresi istenir ve kaydedilir.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-base font-black">Mağaza adresi kuralı</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Mağaza kaydında adres zorunludur. Bu bilgi mağaza güveni, Google Maps yol tarifi, yerel arama ve mağaza doğrulaması için kullanılır.
            </p>
          </div>
        </section>
      </div>

      {suspensionOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/35 p-3">
          <form onSubmit={suspendAccount} className="max-w-2xl rounded-[1.5rem] border-4 border-amber-400 bg-white p-5 shadow-2xl">
            <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-center text-xl font-black leading-8 text-red-800 sm:text-2xl">
              Hesabınızı askıya alabilirsiniz; ancak HBS üzerinde yapılan alışverişler, rezervasyonlar, teklifler, stok hareketleri ve gönderilen tüm mesajlar kayıtlarda kalır.
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
              Bu kayıtlar işlem bütünlüğü, mağaza/müşteri güvenliği, uyuşmazlık çözümü ve ticari geçmiş takibi için korunur. Askıya alma işlemi yeni görünürlük ve yeni işlem akışını durdurur; geçmiş kayıtları silmez.
            </p>
            <label className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800">
              <input type="checkbox" checked={approved} onChange={(event) => setApproved(event.target.checked)} className="mt-1 h-4 w-4" />
              <span>Bu açıklamaları okudum, anladım ve üyeliğimi askıya alırken geçmiş ticari kayıtların saklanacağını kabul ediyorum.</span>
            </label>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setSuspensionOpen(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black">Vazgeç</button>
              <button disabled={!approved} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Üyeliği askıya al</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
