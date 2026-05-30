"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

function money(value: number) {
  return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} GEL`;
}

export default function ReportsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Tümü");
  const [group, setGroup] = useState("Tümü");
  const [movementsList, setMovementsList] = useState<StockMovement[]>([]);
  
  // Date Range Filters
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");

  useEffect(() => {
    const saved = window.localStorage.getItem("hbs-store-stock-movements");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMovementsList(parsed);
        }
      } catch (e) {
        console.error("Error loading stock movements in reports:", e);
      }
    }
  }, []);

  const groups = useMemo(() => ["Tümü", ...Array.from(new Set(movementsList.map((m) => m.group)))], [movementsList]);
  const types = ["Tümü", "Giriş", "Satış", "İade", "Transfer", "Fire"];

  // Filtered dataset incorporating dates
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movementsList.filter((m) => {
      const matchesQ = !q || [m.product, m.group, m.customer, m.user, m.warehouse, m.address].some((v) => v.toLowerCase().includes(q));
      const matchesType = type === "Tümü" || m.type === type;
      const matchesGroup = group === "Tümü" || m.group === group;
      
      const inDateRange = (!startDate || m.date >= startDate) && (!endDate || m.date <= endDate);
      
      return matchesQ && matchesType && matchesGroup && inDateRange;
    });
  }, [query, type, group, startDate, endDate, movementsList]);

  // General Metrics
  const sales = filtered.filter((m) => m.type === "Satış");
  const returns = filtered.filter((m) => m.type === "İade");
  const cost = sales.reduce((sum, m) => sum + m.qty * m.unitCost, 0);
  const revenue = sales.reduce((sum, m) => sum + m.qty * m.unitSale, 0);
  const profit = revenue - cost;
  const returnedQty = returns.reduce((sum, m) => sum + m.qty, 0);

  // Dynamic Product Summaries
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

  // CRM Customer-Specific Purchase Analyzer as requested:
  // "hangi müşteri hangi aralıklarda ne kadar hangi üründen toplam kaç paralık alıyor..."
  const customerStats = useMemo(() => {
    const map = new Map<string, {
      customer: string;
      totalSpent: number;
      totalItems: number;
      minDate: string;
      maxDate: string;
      purchases: Record<string, { qty: number; totalCost: number }>;
    }>();

    for (const m of filtered) {
      if (m.type !== "Satış") continue;
      
      const row = map.get(m.customer) || {
        customer: m.customer,
        totalSpent: 0,
        totalItems: 0,
        minDate: m.date,
        maxDate: m.date,
        purchases: {}
      };

      row.totalSpent += m.qty * m.unitSale;
      row.totalItems += m.qty;
      if (m.date < row.minDate) row.minDate = m.date;
      if (m.date > row.maxDate) row.maxDate = m.date;

      const pRow = row.purchases[m.product] || { qty: 0, totalCost: 0 };
      pRow.qty += m.qty;
      pRow.totalCost += m.qty * m.unitSale;
      row.purchases[m.product] = pRow;

      map.set(m.customer, row);
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filtered]);

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">HBS Raporlama Merkezî</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Paneli Aç</Link>
          </div>
        </header>

        {/* Info card */}
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Yönetim Analizleri</p>
          <h1 className="mt-1 text-xl font-black sm:text-3xl">Gelişmiş Depo, Satış & Cari Davranış Raporu</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Hangi ürün ne kadar satıldı, hangi tarihler arası ne kadar iade geldi ve hangi müşteri hangi zaman aralığında hangi üründen toplam ne kadarlık alım yaptı sorularının tamamını bu panelden filtreleyin.
          </p>
        </section>

        {/* Date Range selectors */}
        <section className="mb-3 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4 items-end">
          <label className="grid gap-1">
            <span className="text-xs font-bold text-slate-500">Arama Kelimesi</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün, müşteri, kullanıcı, konum ara..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-bold text-slate-500">Başlangıç Tarihi</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-bold text-slate-500">Bitiş Tarihi</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"
            >
              {groups.map((g) => <option key={g}>{g}</option>)}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"
            >
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </section>

        {/* Finance summaries */}
        <section className="mb-3 grid gap-2 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">Filtrelenmiş Satış Bedeli</p>
            <p className="mt-1 text-xl font-black">{money(revenue)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">Maliyet Bedeli</p>
            <p className="mt-1 text-xl font-black">{money(cost)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm">
            <p className="text-xs text-emerald-700">Tahmini Brüt Kâr</p>
            <p className="mt-1 text-xl font-black text-emerald-950">{money(profit)}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 shadow-sm">
            <p className="text-xs text-amber-700">Toplam İade Adedi</p>
            <p className="mt-1 text-xl font-black text-amber-950">{returnedQty} adet</p>
          </div>
        </section>

        {/* Advanced CRM stats as requested */}
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-black text-blue-900 mb-1">🎯 Müşteri Bazlı CRM Satın Alım & Trend Analizi</h2>
          <p className="text-xs text-slate-500 mb-4">Hangi müşteri hangi zaman aralığında ne kadar hangi üründen toplam kaç liralık alıyor sorusunun detaylı dökümü:</p>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customerStats.map((c) => (
              <div key={c.customer} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-slate-800">👤 {c.customer}</h3>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">{money(c.totalSpent)}</span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>📅 <b>Etkinlik Aralığı:</b> {c.minDate} ➔ {c.maxDate}</p>
                  <p>📦 <b>Toplam Alınan Adet:</b> {c.totalItems} ürün</p>
                </div>

                <div className="border-t border-slate-100 pt-2 space-y-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Satın Alınan Ürünler</span>
                  {Object.entries(c.purchases).map(([prodName, prodInfo]) => (
                    <div key={prodName} className="flex justify-between items-center text-xs text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-100">
                      <span className="truncate max-w-[140px] font-semibold">{prodName}</span>
                      <span className="font-bold text-slate-900">{prodInfo.qty} ad · {money(prodInfo.totalCost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {customerStats.length === 0 && (
              <p className="text-xs text-slate-400 italic py-4">Bu filtre veya tarih aralığında satış bulunamadı.</p>
            )}
          </div>
        </section>

        {/* Detailed logs */}
        <section className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-lg font-black">Depo Hareket Kayıtları ({filtered.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-black">
                  <tr>
                    <th className="p-2">Tarih</th>
                    <th className="p-2">Ürün / Grup</th>
                    <th className="p-2">Müşteri</th>
                    <th className="p-2">Tür</th>
                    <th className="p-2">Adet</th>
                    <th className="p-2">Maliyet/Satış</th>
                    <th className="p-2">Depo Konumu</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-2 whitespace-nowrap text-slate-500 font-bold">{m.date}</td>
                      <td className="p-2">
                        <span className="font-bold text-slate-800 block">{m.product}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{m.group}</span>
                      </td>
                      <td className="p-2 text-slate-600 font-medium">{m.customer}</td>
                      <td className="p-2">
                        <span className={`rounded-full px-2 py-0.5 font-bold ${m.type === "Satış" ? "bg-emerald-100 text-emerald-800" : m.type === "İade" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>{m.type}</span>
                      </td>
                      <td className="p-2 font-black text-slate-900">{m.qty}</td>
                      <td className="p-2 text-slate-500 font-medium">{money(m.unitCost)} / {money(m.unitSale)}</td>
                      <td className="p-2">
                        <span className="font-bold block">{m.warehouse}</span>
                        <span className="text-blue-700 text-[10px] font-black">{m.address}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-lg font-black">Hızlı Ürün Satış Hacimleri</h2>
            <div className="space-y-2">
              {productStats.map((p) => (
                <div key={p.product} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
                  <p className="font-black text-slate-800 text-xs">{p.product}</p>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Satılan: <b>{p.qty} ad</b></span>
                    <span>İade: <b>{p.returns} ad</b></span>
                    <span className="text-emerald-700 font-bold">Kâr: {money(p.profit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
