"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

type StockMovement = {
  id: string;
  date: string;
  product: string;
  group: string;
  customer: string;
  user: string;
  type: "Giriş" | "Satış" | "İade" | "Transfer" | "Fire";
  qty: number;
  unitCost: number;
  unitSale: number;
  warehouse: string;
  address: string;
};

const movements: StockMovement[] = [
  { id: "m1", date: "2026-05-23", product: "Autel Diagnostics Ürün Grubu", group: "Diagnostik", customer: "Servis müşterisi", user: "ALTANCANCI", type: "Giriş", qty: 6, unitCost: 420, unitSale: 620, warehouse: "OBDTR Ana Depo", address: "D-01-R03-G02" },
  { id: "m2", date: "2026-05-22", product: "Ford Escape Fren Balatası", group: "Fren Sistemi", customer: "Batumi Auto Service", user: "Depo Personeli", type: "Satış", qty: 2, unitCost: 45, unitSale: 75, warehouse: "Ana Depo", address: "A-03-R12-G04" },
  { id: "m3", date: "2026-05-21", product: "Krom Mutfak Bataryası", group: "Tesisat", customer: "Nakit müşteri", user: "OZGUR", type: "Satış", qty: 4, unitCost: 35, unitSale: 58, warehouse: "Ana Depo", address: "T-02-R04-G01" },
  { id: "m4", date: "2026-05-20", product: "PVC Boru Bağlantı Seti", group: "Tesisat", customer: "İade müşterisi", user: "OZGUR", type: "İade", qty: 3, unitCost: 8, unitSale: 13, warehouse: "İade / Kontrol Deposu", address: "R-01-R01-G03" },
  { id: "m5", date: "2026-05-19", product: "Toyota Corolla Yağ Filtresi", group: "Filtre", customer: "Tiflis Servis", user: "Depo Personeli", type: "Satış", qty: 8, unitCost: 12, unitSale: 22, warehouse: "Ana Depo", address: "B-04-R02-G01" },
  { id: "m6", date: "2026-05-18", product: "Universal Buji Seti", group: "Ateşleme", customer: "Kutaisi Auto", user: "Depo Personeli", type: "Satış", qty: 5, unitCost: 20, unitSale: 38, warehouse: "Ana Depo", address: "C-02-R01-G05" },
];

function money(value: number) {
  return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} GEL`;
}

export default function ReportsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Tümü");
  const [group, setGroup] = useState("Tümü");

  const groups = useMemo(() => ["Tümü", ...Array.from(new Set(movements.map((m) => m.group)))], []);
  const types = ["Tümü", "Giriş", "Satış", "İade", "Transfer", "Fire"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movements.filter((m) => {
      const matchesQ = !q || [m.product, m.group, m.customer, m.user, m.warehouse, m.address].some((v) => v.toLowerCase().includes(q));
      const matchesType = type === "Tümü" || m.type === type;
      const matchesGroup = group === "Tümü" || m.group === group;
      return matchesQ && matchesType && matchesGroup;
    });
  }, [query, type, group]);

  const sales = filtered.filter((m) => m.type === "Satış");
  const returns = filtered.filter((m) => m.type === "İade");
  const cost = sales.reduce((sum, m) => sum + m.qty * m.unitCost, 0);
  const revenue = sales.reduce((sum, m) => sum + m.qty * m.unitSale, 0);
  const profit = revenue - cost;
  const returnedQty = returns.reduce((sum, m) => sum + m.qty, 0);

  const productStats = useMemo(() => {
    const map = new Map<string, { product: string; qty: number; profit: number; returns: number }>();
    for (const m of filtered) {
      const row = map.get(m.product) || { product: m.product, qty: 0, profit: 0, returns: 0 };
      if (m.type === "Satış") {
        row.qty += m.qty;
        row.profit += m.qty * (m.unitSale - m.unitCost);
      }
      if (m.type === "İade") row.returns += m.qty;
      map.set(m.product, row);
    }
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, [filtered]);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl">HBS Rapor</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard/warehouses" className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold hover:bg-slate-50">Depo Haritası</Link>
            <Link href="/dashboard/stock-movements" className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold hover:bg-slate-50">Hareketler</Link>
          </div>
        </header>

        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Stok / satış / iade analizi</p>
          <h1 className="mt-1 text-xl font-black sm:text-3xl">Hangi ürün ne zaman, kim tarafından, kaça girdi ve kaça çıktı?</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">Raporlar ürün, ürün grubu, müşteri, kullanıcı, depo, raf adresi ve tarih aralığına göre sorgulanabilir. Amaç yalnızca stok saymak değil; maliyet, satış, kâr, iade ve operasyon sorumluluğunu aynı ekranda görmektir.</p>
        </section>

        <section className="mb-3 grid gap-2 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-xs text-slate-500">Satış bedeli</p><p className="mt-1 text-xl font-black">{money(revenue)}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-xs text-slate-500">Toplam maliyet</p><p className="mt-1 text-xl font-black">{money(cost)}</p></div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm"><p className="text-xs text-emerald-700">Brüt kâr</p><p className="mt-1 text-xl font-black text-emerald-900">{money(profit)}</p></div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 shadow-sm"><p className="text-xs text-amber-700">İade adedi</p><p className="mt-1 text-xl font-black text-amber-900">{returnedQty}</p></div>
        </section>

        <section className="mb-3 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[1fr_180px_180px]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün, grup, müşteri, kullanıcı, depo veya raf ara" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          <select value={group} onChange={(e) => setGroup(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">{groups.map((g) => <option key={g}>{g}</option>)}</select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">{types.map((t) => <option key={t}>{t}</option>)}</select>
        </section>

        <section className="grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-lg font-black">Stok hareket dökümü</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-2">Tarih</th><th className="p-2">Ürün</th><th className="p-2">İşlem</th><th className="p-2">Adet</th><th className="p-2">Maliyet/Satış</th><th className="p-2">Depo</th><th className="p-2">Kullanıcı</th></tr></thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} className="border-t border-slate-100 align-top">
                      <td className="p-2 text-xs text-slate-500">{m.date}</td>
                      <td className="p-2"><b>{m.product}</b><p className="text-xs text-slate-500">{m.group} · {m.customer}</p></td>
                      <td className="p-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black">{m.type}</span></td>
                      <td className="p-2 font-black">{m.qty}</td>
                      <td className="p-2 text-xs">{money(m.unitCost)} / {money(m.unitSale)}</td>
                      <td className="p-2 text-xs"><b>{m.warehouse}</b><br /><span className="text-blue-700">{m.address}</span></td>
                      <td className="p-2 text-xs text-slate-600">{m.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-lg font-black">Ürün bazlı özet</h2>
            <div className="space-y-2">
              {productStats.map((p) => (
                <div key={p.product} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="font-black">{p.product}</p>
                  <p className="mt-1 text-xs text-slate-600">Satış: {p.qty} · Kâr: {money(p.profit)} · İade: {p.returns}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
