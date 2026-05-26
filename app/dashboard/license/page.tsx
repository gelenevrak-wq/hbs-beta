"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

export default function LicensePage() {
  // Current License Info State
  const [storeInfo, setStoreInfo] = useState<{
    name: string;
    trialEndsAt: string;
    warningEndsAt: string;
    licenseType: "trial" | "lifetime" | "active";
    isSuspended: boolean;
    licenseMonthsLeft?: number;
  }>({
    name: "OBDTR Diagnostics",
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days left in demo
    warningEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    licenseType: "trial",
    isSuspended: false
  });

  // Dynamic pricing calculator state
  const [users, setUsers] = useState(5);
  const [warehouses, setWarehouses] = useState(2);
  const [products, setProducts] = useState(500);
  const [months, setMonths] = useState(12); // 3, 6, 12

  const [message, setMessage] = useState("");
  const [hasLicenseLoaded, setHasLicenseLoaded] = useState(false);

  useEffect(() => {
    // Check if store registered details are present
    const localStores = window.localStorage.getItem("hbs-registered-stores");
    if (localStores) {
      try {
        const parsed = JSON.parse(localStores);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const lastStore = parsed[parsed.length - 1];
          setStoreInfo({
            name: lastStore.name,
            trialEndsAt: lastStore.trialEndsAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            warningEndsAt: lastStore.warningEndsAt || new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
            licenseType: lastStore.licenseType || "trial",
            isSuspended: lastStore.isSuspended || false
          });
        }
      } catch {
        // Fallback to default
      }
    }
    setHasLicenseLoaded(true);
  }, []);

  // Calculate pricing based on users, warehouses, product limits, and months!
  const calculatedPrice = useMemo(() => {
    const baseRate = 10; // 10 GEL base monthly
    const userRate = (users - 1) * 2; // 2 GEL per extra user
    const whRate = (warehouses - 1) * 5; // 5 GEL per extra depot
    const prodRate = Math.floor(products / 100) * 1.5; // 1.5 GEL per 100 products
    
    const monthlyTotal = baseRate + userRate + whRate + prodRate;
    let finalTotal = monthlyTotal * months;

    // Apply duration discounts
    if (months === 6) finalTotal *= 0.9; // 10% discount
    if (months === 12) finalTotal *= 0.8; // 20% discount

    return Math.round(finalTotal);
  }, [users, warehouses, products, months]);

  // Simulate payment and license key activation
  function handleSimulatePayment() {
    const updatedStore = {
      ...storeInfo,
      licenseType: "active" as const,
      isSuspended: false,
      trialEndsAt: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString(), // Extend license
      warningEndsAt: new Date(Date.now() + (months * 30 + 3) * 24 * 60 * 60 * 1000).toISOString(),
      licenseMonthsLeft: months
    };

    setStoreInfo(updatedStore);
    
    // Save back to local registry
    const localStores = window.localStorage.getItem("hbs-registered-stores");
    if (localStores) {
      try {
        const parsed = JSON.parse(localStores);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed[parsed.length - 1] = {
            ...parsed[parsed.length - 1],
            licenseType: "active",
            trialEndsAt: updatedStore.trialEndsAt,
            warningEndsAt: updatedStore.warningEndsAt,
            isSuspended: false
          };
          window.localStorage.setItem("hbs-registered-stores", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error(e);
      }
    }

    setMessage(`Tebrikler! ${months} aylık lisans ödemesi alındı ve lisansınız başarıyla aktif edildi. Limitleriniz: ${users} kullanıcı, ${warehouses} depo, ${products} ürün.`);
  }

  // Days left calculation
  const daysLeft = useMemo(() => {
    const diff = new Date(storeInfo.trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  }, [storeInfo.trialEndsAt]);

  const showWarning = daysLeft <= 3 && storeInfo.licenseType !== "lifetime";

  if (!hasLicenseLoaded) return <main className="min-h-screen bg-slate-950" />;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">HBS Lisans Yönetimi</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Paneli Aç</Link>
          </div>
        </header>

        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Abonelik & Lisanslama</p>
          <h1 className="mt-1 text-xl font-black sm:text-3xl">Esnek SaaS Paket ve Ücret Hesaplayıcı</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            HBS tek bir yazılımdır; ek lisans ücretleri yalnızca sistemdeki kullanıcı (Müdür, Depo Sorumlusu, Muhasebeci), depo şubeleri ve maksimum ürün yükleme hacimlerinize bağlı olarak dinamik hesaplanır.
          </p>
        </section>

        {message && (
          <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black text-emerald-950">
            ✓ {message}
          </div>
        )}

        <section className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          
          {/* Current License Card */}
          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h2 className="text-lg font-black">Mevcut Lisans Durumu</h2>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <p className="text-xs text-slate-500">Kayıtlı Şirket</p>
                <p className="text-lg font-black text-slate-800">🏢 {storeInfo.name}</p>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500">Lisans Tipi</span>
                  <span className={`rounded-full px-3 py-0.5 text-xs font-black uppercase ${storeInfo.licenseType === "lifetime" ? "bg-emerald-100 text-emerald-800" : storeInfo.licenseType === "active" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
                    {storeInfo.licenseType === "lifetime" ? "🛡️ Sınırsız / Ortak" : storeInfo.licenseType === "active" ? "✓ Aktif Üye" : "🎁 14 Günlük Demo"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Kalan Süre</span>
                  <span className="text-sm font-black text-slate-900">
                    {storeInfo.licenseType === "lifetime" ? "Süre Sınırı Yok" : `${daysLeft} Gün`}
                  </span>
                </div>
              </div>

              {showWarning && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed font-bold animate-pulse">
                  ⚠️ <b>Kritik Hatırlatma:</b> Deneme sürenizin bitmesine 3 gün veya daha az süre kaldı. Lisans almadığınız takdirde mağazanız askıya alınacak ve ürünler arama listelerinde görünmeyecektir!
                </div>
              )}

              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-500 leading-relaxed">
                ℹ️ <b>SaaS Askıya Alma Kuralları:</b> 14 günlük trial biter ➔ 3 gün boyunca panelde büyük lisans anahtarı uyarısı gösterilir ➔ 3. gün sonunda ödeme yoksa pazar yerinde tüm ürünleriniz otomatik askıya alınır (`is_visible_in_public_search = false`).
              </div>
            </div>
          </aside>

          {/* Pricing Calculator Slider & renew trigger */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-blue-900">🎚️ Dinamik Lisans Ücret Hesaplayıcı</h2>
            <p className="text-xs text-slate-500">Kullanıcı sayısı, depo şubeleri ve ürün hacminizi seçerek anlık fiyatı görün:</p>

            <div className="space-y-4 pt-2">
              
              {/* Max Users */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Maksimum Kullanıcı Sayısı (Patron, müdür, personel vb.)</span>
                  <span className="text-blue-700 font-black">{users} Kullanıcı</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={users}
                  onChange={(e) => setUsers(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600 focus:outline-none"
                />
              </div>

              {/* Max Warehouses */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Maksimum Depo / Şube Sayısı</span>
                  <span className="text-blue-700 font-black">{warehouses} Depo</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={warehouses}
                  onChange={(e) => setWarehouses(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600 focus:outline-none"
                />
              </div>

              {/* Max Products */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Maksimum Yüklenebilir Ürün Limiti</span>
                  <span className="text-blue-700 font-black">{products} Ürün</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={products}
                  onChange={(e) => setProducts(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600 focus:outline-none"
                />
              </div>

              {/* Renewal Duration selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">Lisans Dönemi / Süresi</span>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      className={`rounded-xl py-2 text-xs font-black transition border ${months === m ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`}
                    >
                      {m} Ay {m === 6 ? "(%10 İndirim)" : m === 12 ? "(%20 İndirim)" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant price result */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 flex justify-between items-center mt-6">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">HESAPLANAN TOPLAM HİZMET BEDELİ</span>
                  <span className="text-[10px] text-blue-700">Tüm vergiler dahil net fiyattır.</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-950">{calculatedPrice} GEL</span>
                  <span className="block text-[10px] text-slate-500">Ayda ~{Math.round(calculatedPrice/months)} GEL</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-black text-white hover:bg-slate-800 transition active:scale-95 shadow-md mt-3"
              >
                💳 Ödemeyi Yap ve Lisansı Uzat (Simülatör)
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
