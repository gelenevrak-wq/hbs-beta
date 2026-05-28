"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  shelves?: string[];
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
  { product: "Ford Escape Fren Balatası", sku: "FR-BALATA-ESCAPE-001", qty: 18, warehouse: "Ana Depo", address: "A-03-R12-G04", storefronts: ["OBDTR Vitrini", "Fren Sistemi Kampanyası"], lastMove: "21.05.2026", user: "Depo Personeli" },
  { product: "PVC Boru Bağlantı Seti", sku: "YH-PVC-FITTING-SET-002", qty: 64, warehouse: "Showroom Alanı", address: "S-01-R02-G01", storefronts: ["Yıldız Batum Vitrini", "Tesisat Ürünleri"], lastMove: "20.05.2026", user: "OZGUR" },
];

function pct(used: number, capacity: number) {
  return Math.round((used / capacity) * 100);
}

export default function WarehousesPage() {
  const [query, setQuery] = useState("");
  const [warehousesList, setWarehousesList] = useState<Warehouse[]>([]);
  
  // Form fields
  const [newWhName, setNewWhName] = useState("");
  const [newWhPurpose, setNewWhPurpose] = useState("");
  const [newWhCity, setNewWhCity] = useState("Batumi");
  const [newWhCapacity, setNewWhCapacity] = useState(500);
  const [newWhZones, setNewWhZones] = useState("A, B");
  const [newWhVisible, setNewWhVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const storeSlug = currentUser?.storeSlugs?.[0] || "obdtr";
      
      const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      let myStore = registeredStores.find((s: any) => s.code === storeSlug);
      
      if (!myStore && storeSlug === "obdtr") {
        myStore = {
          code: "obdtr",
          name: "OBDTR Diagnostics",
          city: "İstanbul",
          operatingModel: "virtual_delivery",
          serviceCountries: ["TR", "GE"],
          warehouses: warehouses
        };
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify([myStore, ...registeredStores]));
      }

      if (myStore && myStore.warehouses && myStore.warehouses.length > 0) {
        setWarehousesList(myStore.warehouses);
      } else {
        setWarehousesList(warehouses);
        if (myStore) {
          myStore.warehouses = warehouses.map(w => ({
            ...w,
            shelves: w.zones.map(z => `${z}-01`)
          }));
          const updatedStores = registeredStores.map((s: any) => s.code === storeSlug ? myStore : s);
          window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
        }
      }
    } catch (e) {
      console.error(e);
      setWarehousesList(warehouses);
    }
  }, []);

  function createWarehouse(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newWhName.trim() || !newWhPurpose.trim()) {
      setErrorMsg("Depo adı ve kullanım amacı alanları zorunludur.");
      return;
    }

    const zonesArray = newWhZones.split(",").map(z => z.trim().toUpperCase()).filter(z => z !== "");
    if (zonesArray.length === 0) {
      setErrorMsg("Lütfen en az bir adet bölge tanımlayın (Örn: A, B).");
      return;
    }

    const newWh: Warehouse = {
      id: `wh-${Date.now()}`,
      name: newWhName.trim(),
      purpose: newWhPurpose.trim(),
      customerVisible: newWhVisible,
      city: newWhCity.trim(),
      zones: zonesArray,
      capacity: Number(newWhCapacity) || 100,
      used: 0
    };

    const updatedList = [...warehousesList, newWh];
    setWarehousesList(updatedList);

    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const storeSlug = currentUser?.storeSlugs?.[0] || "obdtr";
      
      const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      let myStore = registeredStores.find((s: any) => s.code === storeSlug);
      
      if (myStore) {
        myStore.warehouses = updatedList.map(w => ({
          ...w,
          shelves: w.shelves || w.zones.map(z => `${z}-01`)
        }));

        const updatedStores = registeredStores.map((s: any) => s.code === storeSlug ? myStore : s);
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      }
    } catch (err) {
      console.error("Error saving new warehouse:", err);
    }

    setNewWhName("");
    setNewWhPurpose("");
    setNewWhZones("A, B");
    setNewWhCapacity(500);
    setNewWhVisible(false);
    setSuccessMsg(`"${newWh.name}" başarıyla oluşturuldu! Artık ürün yüklerken bu depoyu seçebilirsiniz.`);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locationRows;
    return locationRows.filter((row) => [row.product, row.sku, row.warehouse, row.address, row.user, ...row.storefronts].some((v) => v.toLowerCase().includes(q)));
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1850px]">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">HBS Depo</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard/stock-movements" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">Stok Hareketleri</Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">Paneli Aç</Link>
          </div>
        </header>

        {errorMsg && (
          <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-black text-red-950">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black text-emerald-950">
            ✓ {successMsg}
          </div>
        )}

        <section className="mb-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Depo haritalandırma</p>
              <h1 className="mt-1 text-xl font-black sm:text-3xl">Ürünün depoda tam yerini göster</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">HBS’de depo ve vitrin ayrı kavramdır. Depo ürünün fiziksel yerini tutar; vitrin müşteriye nerede gösterildiğini belirler. Bir ürün birden fazla depoda durabilir ve birden fazla vitrinde görünebilir.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-50 p-3"><b>Depo</b><p className="mt-1 text-xs text-slate-600">Ana depo, iade, showroom vb.</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><b>Adres</b><p className="mt-1 text-xs text-slate-600">Bölge-koridor-raf kodu.</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><b>Vitrin</b><p className="mt-1 text-xs text-slate-600">Online veya şehir vitrini.</p></div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <h2 className="text-lg font-black text-emerald-900">Müşteriye anlatım</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-900/90">“Ürününüzü HBS’ye girerken hangi depoda, hangi rafta durduğunu seçin. İsterseniz müşteriye gösterin, isterseniz sadece iç stokta tutun. Çalışan barkodu okuttuğunda ürünün tam adresini görür.”</p>
              <div className="mt-2.5 rounded-xl border border-emerald-200 bg-white p-3 text-xs font-bold text-emerald-900">Örnek adres: Ana Depo / A-03-R12-G04-K08</div>
            </div>
          </div>

          <form onSubmit={createWarehouse} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3.5 flex flex-col justify-between">
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700 border border-blue-100 uppercase">
                ➕ YENİ DEPO EKLE
              </span>
              <h2 className="text-lg font-black text-slate-800">Depo Tanımlama Kartı</h2>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Depo Adı *</span>
                <input
                  required
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  placeholder="Örn: Kuzey Şubesi Deposu"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Kullanım Amacı *</span>
                <input
                  required
                  value={newWhPurpose}
                  onChange={(e) => setNewWhPurpose(e.target.value)}
                  placeholder="Örn: Ağır vasıta parça stoğu"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Bulunduğu Şehir</span>
                <input
                  value={newWhCity}
                  onChange={(e) => setNewWhCity(e.target.value)}
                  placeholder="Örn: İstanbul"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Kapasite (Alan Miktarı)</span>
                <input
                  type="number"
                  value={newWhCapacity}
                  onChange={(e) => setNewWhCapacity(Number(e.target.value))}
                  placeholder="Örn: 500"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Bölgeler / Koridorlar *</span>
                <input
                  value={newWhZones}
                  onChange={(e) => setNewWhZones(e.target.value)}
                  placeholder="A, B, C (virgülle ayırın)"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="whVisible"
                checked={newWhVisible}
                onChange={(e) => setNewWhVisible(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="whVisible" className="text-xs font-black text-slate-700 cursor-pointer select-none">
                Müşteriler vitrinde görsün (Vitrine Açık)
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              Yeni Depoyu Oluştur
            </button>
          </form>
        </section>

        <section className="mb-3 grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
          {warehousesList.map((wh) => (
            <article key={wh.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-850 text-sm">{wh.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500 font-bold">{wh.city} · {wh.purpose}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${wh.customerVisible ? "bg-blue-100 text-blue-850 border border-blue-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                  {wh.customerVisible ? "Vitrine açık" : "İç depo"}
                </span>
              </div>
              <div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct(wh.used, wh.capacity)}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-black mt-2">
                  <span>{wh.used} / {wh.capacity} alan</span>
                  <span>%{pct(wh.used, wh.capacity)} Dolu</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-bold">Tanımlı Bölgeler: {wh.zones.join(", ")}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black">Ürün konum sorgusu</h2>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün, SKU, depo, raf, kullanıcı veya vitrin ara" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 sm:max-w-md" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr><th className="p-3">Ürün</th><th className="p-3">Stok</th><th className="p-3">Depo adresi</th><th className="p-3">Vitrin</th><th className="p-3">Son işlem</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.sku} className="align-top font-semibold text-slate-700">
                    <td className="p-3"><b>{row.product}</b><p className="text-[10px] text-slate-400 mt-0.5">{row.sku}</p></td>
                    <td className="p-3 font-black text-slate-900">{row.qty}</td>
                    <td className="p-3"><b>{row.warehouse}</b><p className="text-[10px] text-blue-700 mt-0.5 font-black">{row.address}</p></td>
                    <td className="p-3 text-[10px] text-slate-500">{row.storefronts.join(" · ")}</td>
                    <td className="p-3 text-[10px] text-slate-500 leading-normal">{row.lastMove}<br />{row.user}</td>
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
