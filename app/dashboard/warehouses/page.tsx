"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

type Warehouse = {
  id: string;
  name: string;
  purpose: string;
  customerVisible: boolean;
  city: string;
  zones: string[];
  capacity: number;
  used: number;
};

type LocationRow = {
  product: string;
  sku: string;
  qty: number;
  warehouse: string;
  address: string;
  storefronts: string[];
  lastMove: string;
  user: string;
};

const warehouses: Warehouse[] = [
  { id: "main", name: "Ana Depo", purpose: "Satışa hazır ürün stoğu", customerVisible: false, city: "Batumi", zones: ["A", "B", "C", "D"], capacity: 720, used: 486 },
  { id: "return", name: "İade / Kontrol Deposu", purpose: "İade, arızalı veya kontrol bekleyen ürünler", customerVisible: false, city: "Batumi", zones: ["R", "Q"], capacity: 160, used: 38 },
  { id: "showroom", name: "Showroom Alanı", purpose: "Müşterinin görebileceği örnek ürünler", customerVisible: true, city: "Batumi", zones: ["S"], capacity: 90, used: 52 },
  { id: "obdtr", name: "OBDTR Ana Depo", purpose: "Diagnostik cihaz ve aksesuar stoğu", customerVisible: false, city: "İstanbul", zones: ["D", "L", "A"], capacity: 420, used: 288 },
];

const locationRows: LocationRow[] = [
  { product: "Autel Diagnostics Ürün Grubu", sku: "OBDTR-AUTEL-GRUP", qty: 14, warehouse: "OBDTR Ana Depo", address: "D-01-R03-G02", storefronts: ["OBDTR Online Vitrin", "Diagnostik Vitrini"], lastMove: "23.05.2026", user: "ALTANCANCI" },
  { product: "Krom Mutfak Bataryası", sku: "YH-TESISAT-BATARYA-001", qty: 38, warehouse: "Ana Depo", address: "T-02-R04-G01", storefronts: ["Yıldız Batum Vitrini"], lastMove: "22.05.2026", user: "OZGUR" },
  { product: "Ford Escape Fren Balatası", sku: "FR-BALATA-ESCAPE-001", qty: 18, warehouse: "Ana Depo", address: "A-03-R12-G04", storefronts: ["Ferro Motors Vitrini", "Fren Sistemi Kampanyası"], lastMove: "21.05.2026", user: "Depo Personeli" },
  { product: "PVC Boru Bağlantı Seti", sku: "YH-PVC-FITTING-SET-002", qty: 64, warehouse: "Showroom Alanı", address: "S-01-R02-G01", storefronts: ["Yıldız Batum Vitrini", "Tesisat Ürünleri"], lastMove: "20.05.2026", user: "OZGUR" },
];

function pct(used: number, capacity: number) {
  return Math.round((used / capacity) * 100);
}

export default function WarehousesPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locationRows;
    return locationRows.filter((row) => [row.product, row.sku, row.warehouse, row.address, row.user, ...row.storefronts].some((v) => v.toLowerCase().includes(q)));
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl">HBS Depo</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard/stock-movements" className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold hover:bg-slate-50">Stok Hareketleri</Link>
            <Link href="/dashboard/reports" className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold hover:bg-slate-50">Raporlar</Link>
          </div>
        </header>

        <section className="mb-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Depo haritalandırma</p>
            <h1 className="mt-1 text-xl font-black sm:text-3xl">Ürünün depoda tam yerini göster</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">HBS’de depo ve vitrin ayrı kavramdır. Depo ürünün fiziksel yerini tutar; vitrin müşteriye nerede gösterildiğini belirler. Bir ürün birden fazla depoda durabilir ve birden fazla vitrinde görünebilir.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3"><b>Depo</b><p className="mt-1 text-xs text-slate-600">Ana depo, iade deposu, showroom, şube deposu.</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><b>Adres</b><p className="mt-1 text-xs text-slate-600">Bölge-koridor-raf-göz-kutu kodu.</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><b>Vitrin</b><p className="mt-1 text-xs text-slate-600">Online mağaza, kampanya vitrini, şehir vitrini.</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <h2 className="text-lg font-black text-emerald-900">Müşteriye anlatım</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-900/90">“Ürününüzü HBS’ye girerken hangi depoda, hangi rafta, hangi gözde durduğunu seçin. İsterseniz müşteriye gösterin, isterseniz sadece iç stokta tutun. Çalışan barkodu okuttuğunda ürünün tam adresini görür.”</p>
            <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3 text-sm font-bold text-emerald-900">Örnek adres: Ana Depo / A-03-R12-G04-K08</div>
          </div>
        </section>

        <section className="mb-3 grid gap-2 md:grid-cols-4">
          {warehouses.map((wh) => (
            <article key={wh.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div><h3 className="font-black">{wh.name}</h3><p className="mt-0.5 text-xs text-slate-500">{wh.city} · {wh.purpose}</p></div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-black ${wh.customerVisible ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"}`}>{wh.customerVisible ? "Vitrine açık" : "İç depo"}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${pct(wh.used, wh.capacity)}%` }} /></div>
              <p className="mt-2 text-xs font-bold text-slate-600">{wh.used}/{wh.capacity} alan · %{pct(wh.used, wh.capacity)} dolu</p>
              <p className="mt-2 text-xs text-slate-500">Bölgeler: {wh.zones.join(", ")}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black">Ürün konum sorgusu</h2>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün, SKU, depo, raf, kullanıcı veya vitrin ara" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:max-w-md" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-2">Ürün</th><th className="p-2">Stok</th><th className="p-2">Depo adresi</th><th className="p-2">Vitrin</th><th className="p-2">Son işlem</th></tr></thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.sku} className="border-t border-slate-100 align-top">
                    <td className="p-2"><b>{row.product}</b><p className="text-xs text-slate-500">{row.sku}</p></td>
                    <td className="p-2 font-black">{row.qty}</td>
                    <td className="p-2"><b>{row.warehouse}</b><p className="text-xs text-blue-700">{row.address}</p></td>
                    <td className="p-2 text-xs text-slate-600">{row.storefronts.join(" · ")}</td>
                    <td className="p-2 text-xs text-slate-600">{row.lastMove}<br />{row.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
