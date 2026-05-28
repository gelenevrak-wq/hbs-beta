"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";

export default function LicensePage() {
  // Current Active User
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    displayName: string;
    role: string;
    storeSlugs: string[];
  } | null>(null);

  // Store Information State
  const [storeInfo, setStoreInfo] = useState<{
    id?: string;
    name: string;
    code: string;
    trialEndsAt: string | null;
    licenseEndsAt: string | null;
    licenseType: "trial" | "lifetime" | "active" | "suspended";
    isSuspended: boolean;
    maxUsers: number;
    maxWarehouses: number;
    maxProducts: number;
  }>({
    name: "HBS Demo Mağaza",
    code: "obdtr",
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    licenseEndsAt: null,
    licenseType: "trial",
    isSuspended: false,
    maxUsers: 5,
    maxWarehouses: 2,
    maxProducts: 500,
  });

  // Dynamic Calculator Sliders
  const [users, setUsers] = useState(5);
  const [warehouses, setWarehouses] = useState(2);
  const [products, setProducts] = useState(500);
  const [months, setMonths] = useState(12); // 3, 6, 12

  // Activation & Generator Panel states
  const [activationKey, setActivationKey] = useState("");
  const [activationError, setActivationError] = useState("");
  const [activationSuccess, setActivationSuccess] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Superadmin Generator States
  const [genPreset, setGenPreset] = useState<"Bronze" | "Silver" | "Gold" | "Custom">("Bronze");
  const [genDuration, setGenDuration] = useState<1 | 3 | 6 | 12>(1);
  const [genCount, setGenCount] = useState<number>(500);
  const [genMaxUsers, setGenMaxUsers] = useState(3);
  const [genMaxWarehouses, setGenMaxWarehouses] = useState(1);
  const [genMaxProducts, setGenMaxProducts] = useState(250);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeysList, setGeneratedKeysList] = useState<any[]>([]);
  const [generationMsg, setGenerationMsg] = useState("");

  const [hasLicenseLoaded, setHasLicenseLoaded] = useState(false);

  // Sync limits automatically when preset changes
  useEffect(() => {
    if (genPreset === "Bronze") {
      setGenMaxUsers(3);
      setGenMaxWarehouses(1);
      setGenMaxProducts(250);
    } else if (genPreset === "Silver") {
      setGenMaxUsers(10);
      setGenMaxWarehouses(3);
      setGenMaxProducts(1000);
    } else if (genPreset === "Gold") {
      setGenMaxUsers(30);
      setGenMaxWarehouses(10);
      setGenMaxProducts(5000);
    }
  }, [genPreset]);

  // Load user data and sync with Supabase
  const loadData = async () => {
    try {
      const activeUser = JSON.parse(window.localStorage.getItem("hbs-current-user") || "null");
      setCurrentUser(activeUser);

      const storeSlug = activeUser?.storeSlugs?.[0] || "obdtr";
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      if (isSupabaseConfigured) {
        // Fetch from live database
        const { data: comp, error } = await supabase
          .from("companies")
          .select("*")
          .eq("code", storeSlug)
          .single();

        if (comp && !error) {
          let type: "trial" | "lifetime" | "active" | "suspended" = "trial";
          if (comp.code === "obdtr" || comp.code === "yildiz-hirdavat") {
            type = "lifetime";
          } else if (comp.is_suspended) {
            type = "suspended";
          } else if (comp.license_ends_at && new Date(comp.license_ends_at).getTime() > Date.now()) {
            type = "active";
          } else if (comp.trial_ends_at && new Date(comp.trial_ends_at).getTime() > Date.now()) {
            type = "trial";
          } else {
            type = "suspended";
          }

          setStoreInfo({
            id: comp.id,
            name: comp.name,
            code: comp.code,
            trialEndsAt: comp.trial_ends_at,
            licenseEndsAt: comp.license_ends_at,
            licenseType: type,
            isSuspended: comp.is_suspended || false,
            maxUsers: comp.max_users || 5,
            maxWarehouses: comp.max_warehouses || 2,
            maxProducts: comp.max_products || 500,
          });
          setHasLicenseLoaded(true);
          return;
        }
      }

      // Offline / LocalStorage registry fallback
      const localStores = window.localStorage.getItem("hbs-registered-stores");
      if (localStores) {
        const parsed = JSON.parse(localStores);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const store = parsed.find((s: any) => s.code === storeSlug) || parsed[parsed.length - 1];
          let type: "trial" | "lifetime" | "active" | "suspended" = "trial";
          if (store.code === "obdtr" || store.licenseType === "lifetime") {
            type = "lifetime";
          } else if (store.isSuspended) {
            type = "suspended";
          } else if (store.trialEndsAt && new Date(store.trialEndsAt).getTime() > Date.now()) {
            type = "trial";
          } else {
            type = "active";
          }

          setStoreInfo({
            name: store.name,
            code: store.code,
            trialEndsAt: store.trialEndsAt || null,
            licenseEndsAt: store.warningEndsAt || null,
            licenseType: type,
            isSuspended: store.isSuspended || false,
            maxUsers: store.maxUsers || 10,
            maxWarehouses: store.warehouses?.length || 2,
            maxProducts: store.maxProducts || 500,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    setHasLicenseLoaded(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate pricing based on users, warehouses, products, and months
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

  // Activate license using key
  const handleActivateKey = async () => {
    setActivationError("");
    setActivationSuccess("");
    if (!activationKey.trim()) return;

    setIsActivating(true);
    try {
      const codeClean = activationKey.trim().toUpperCase();

      // 1. Query the license key from Supabase
      const { data: keyRow, error: fetchErr } = await supabase
        .from("license_keys")
        .select("*")
        .eq("key_code", codeClean)
        .eq("is_used", false)
        .single();

      if (fetchErr || !keyRow) {
        setActivationError("Geçersiz, süresi dolmuş veya daha önce kullanılmış lisans anahtarı. Lütfen kontrol edip tekrar deneyin.");
        setIsActivating(false);
        return;
      }

      // 2. Determine expiration offset: start from today or extend existing license_ends_at
      let currentExpiry = Date.now();
      if (storeInfo.licenseEndsAt && new Date(storeInfo.licenseEndsAt).getTime() > Date.now()) {
        currentExpiry = new Date(storeInfo.licenseEndsAt).getTime();
      }
      const extendedExpiry = new Date(currentExpiry + keyRow.duration_months * 30 * 24 * 60 * 60 * 1000);

      // 3. Mark key as used
      const { error: keyUpdateErr } = await supabase
        .from("license_keys")
        .update({
          is_used: true,
          used_by_company_id: storeInfo.id || null,
          used_at: new Date().toISOString(),
        })
        .eq("id", keyRow.id);

      if (keyUpdateErr) {
        setActivationError(`Anahtar güncellenemedi: ${keyUpdateErr.message}`);
        setIsActivating(false);
        return;
      }

      // 4. Update company limits and expiration in Supabase
      if (storeInfo.id) {
        const { error: compUpdateErr } = await supabase
          .from("companies")
          .update({
            trial_ends_at: null,
            license_ends_at: extendedExpiry.toISOString(),
            is_suspended: false,
            max_users: keyRow.max_users,
            max_warehouses: keyRow.max_warehouses,
            max_products: keyRow.max_products,
          })
          .eq("id", storeInfo.id);

        if (compUpdateErr) {
          setActivationError(`Firma veritabanı güncellenemedi: ${compUpdateErr.message}`);
          setIsActivating(false);
          return;
        }
      }

      // 5. Update local copies
      const localStores = window.localStorage.getItem("hbs-registered-stores");
      if (localStores) {
        try {
          const parsed = JSON.parse(localStores);
          const idx = parsed.findIndex((s: any) => s.code === storeInfo.code);
          if (idx !== -1) {
            parsed[idx] = {
              ...parsed[idx],
              licenseType: "active",
              trialEndsAt: null,
              warningEndsAt: extendedExpiry.toISOString(),
              isSuspended: false,
              maxUsers: keyRow.max_users,
              maxProducts: keyRow.max_products,
            };
            window.localStorage.setItem("hbs-registered-stores", JSON.stringify(parsed));
          }
        } catch {}
      }

      // 6. Trigger success celebration animation
      setIsCelebrating(true);
      setActivationSuccess(`✓ Tebrikler! ${keyRow.tier_name} Paket Lisansı Başarıyla Aktif Edildi. Yeni sınırlarınız: ${keyRow.max_users} Kullanıcı, ${keyRow.max_warehouses} Depo, ${keyRow.max_products} Ürün. Lisans Bitiş Tarihi: ${extendedExpiry.toLocaleDateString("tr-TR")}`);
      setActivationKey("");
      
      // Reload store details
      await loadData();
      
      setTimeout(() => {
        setIsCelebrating(false);
      }, 7000);

    } catch (e: any) {
      setActivationError(`Sistem Hatası: ${e.message || e}`);
    } finally {
      setIsActivating(false);
    }
  };

  // Superadmin Batch Key Generator Flow
  const handleGenerateBatch = async () => {
    setGenerationMsg("");
    setGeneratedKeysList([]);
    setIsGenerating(true);

    try {
      const generated: any[] = [];
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous letters (I, O, 0, 1)
      
      const genRandom = (len = 4) => {
        let text = "";
        for (let i = 0; i < len; i++) {
          text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return text;
      };

      const tierLetter = genPreset.charAt(0).toUpperCase();
      const durationLabel = String(genDuration);

      // Assemble batch rows
      for (let i = 0; i < genCount; i++) {
        // Code format: HBS-[TierLetter][DurationMonths]-[Rand]-[Rand]
        const keyString = `HBS-${tierLetter}${durationLabel}-${genRandom()}-${genRandom()}`;
        generated.push({
          key_code: keyString,
          duration_months: genDuration,
          tier_name: genPreset,
          max_users: genMaxUsers,
          max_warehouses: genMaxWarehouses,
          max_products: genMaxProducts,
          is_used: false,
        });
      }

      // Bulk insert keys to Supabase
      const { data, error } = await supabase
        .from("license_keys")
        .insert(generated);

      if (error) {
        setGenerationMsg(`Lisanslar veritabanına eklenirken hata oluştu: ${error.message}`);
        setIsGenerating(false);
        return;
      }

      setGeneratedKeysList(generated);
      setGenerationMsg(`✓ Başarıyla ${genCount} adet (${genPreset} Paket, ${genDuration} Aylık) HBS lisans anahtarı üretildi ve veritabanına kaydedildi!`);

    } catch (e: any) {
      setGenerationMsg(`Hata: ${e.message || e}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Generated Keys in CSV format
  const handleDownloadCSV = () => {
    if (generatedKeysList.length === 0) return;

    const csvRows = [
      ["Lisans Anahtarı", "Paket Tipi", "Süre (Ay)", "Maks Kullanıcı", "Maks Depo", "Maks Ürün"].join(","),
      ...generatedKeysList.map(k => [
        k.key_code,
        k.tier_name,
        k.duration_months,
        k.max_users,
        k.max_warehouses,
        k.max_products
      ].join(","))
    ];

    const csvContent = "\uFEFF" + csvRows.join("\n"); // Add BOM for Excel UTF-8 compliance
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hbs_lisans_anahtarlari_${genPreset.toLowerCase()}_${genDuration}ay_${generatedKeysList.length}adet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Days left helper
  const daysLeft = useMemo(() => {
    const target = storeInfo.licenseType === "active" ? storeInfo.licenseEndsAt : storeInfo.trialEndsAt;
    if (!target) return 0;
    const diff = new Date(target).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  }, [storeInfo.trialEndsAt, storeInfo.licenseEndsAt, storeInfo.licenseType]);

  const showWarning = daysLeft <= 3 && storeInfo.licenseType === "trial";

  if (!hasLicenseLoaded) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-xs text-slate-500 font-black">HBS Lisans Paneli Yükleniyor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-3 py-3 text-slate-950 sm:px-6 sm:py-6 relative overflow-hidden">
      
      {/* Celebration Confetti Overlay */}
      {isCelebrating && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-white/20 backdrop-blur-xs transition animate-fadeIn">
          <div className="text-center bg-white/95 rounded-3xl p-8 border border-amber-300 shadow-2xl space-y-4 scale-up-center select-none max-w-md">
            <span className="text-6xl animate-bounce block">🏆</span>
            <h2 className="text-2xl font-black text-amber-600">LİSANS AKTİFLEŞTİRİLDİ!</h2>
            <p className="text-xs font-semibold text-slate-600">Mağazanız premium statüye yükseltildi. Tüm sınırlamalarınız ve yeni modülleriniz başarıyla aktif edildi.</p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 15 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block animate-ping text-xl"
                  style={{ animationDelay: `${i * 150}ms`, animationDuration: "2s" }}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1850px]">
        
        {/* Header navigation bar */}
        <header className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">
            HBS Lisans Yönetimi
          </Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black shadow-sm hover:bg-slate-50 transition">
              Paneli Aç
            </Link>
          </div>
        </header>

        {/* Global info banner */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Abonelik & Lisanslama</span>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">HBS Multi-Tenant Lisans İstasyonu</h1>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
            HBS bulut tabanlı bir SaaS platformudur. Yüzlerce bağımsız mağaza kendi limitleri doğrultusunda sistemimizi kullanır. Alt limitleri dolan mağazalar lisans anahtarı alarak limitlerini (kullanıcı sayısı, şube depoları, ürün sınırı) dinamik olarak yükseltebilir ve hizmet sürelerini uzatabilirler.
          </p>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          
          <div className="space-y-4">
            
            {/* Store subscription status overview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2">🛡️ Mevcut Mağaza Lisans Durumu</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Şirket / Mağaza</p>
                  <p className="text-lg font-black text-slate-800">🏢 {storeInfo.name}</p>
                  <p className="text-xs text-slate-500 font-bold">Mağaza Kodu: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">{storeInfo.code}</code></p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lisans Türü & Durumu</p>
                  <div>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-black uppercase shadow-xs ${
                      storeInfo.licenseType === "lifetime" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                        : storeInfo.licenseType === "active" 
                        ? "bg-blue-100 text-blue-800 border border-blue-300" 
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {storeInfo.licenseType === "lifetime" ? "🛡️ Sınırsız / Ortak" : storeInfo.licenseType === "active" ? "✓ Aktif Üye" : "🎁 14 Günlük Demo"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    {storeInfo.licenseType === "lifetime" 
                      ? "Süre veya limit kısıtlaması bulunmuyor." 
                      : `Sona Ermesine: ${daysLeft} Gün Kaldı`}
                  </p>
                </div>
              </div>

              {/* Dynamic Limit Progress Bars */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Mevcut Yetkili Kaynak Sınırları</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Maksimum Kullanıcı Tanımlama</span>
                    <span className="font-black text-slate-900">{storeInfo.maxUsers} Kullanıcı</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (3 / storeInfo.maxUsers) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Maksimum Depo / Şube</span>
                    <span className="font-black text-slate-900">{storeInfo.maxWarehouses} Şube</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (1 / storeInfo.maxWarehouses) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Maksimum Ürün Yükleme Sınırı</span>
                    <span className="font-black text-slate-900">{storeInfo.maxProducts} Ürün</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (10 / storeInfo.maxProducts) * 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {showWarning && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 font-bold leading-relaxed animate-pulse">
                  ⚠️ <b>Kritik Hatırlatma:</b> Deneme sürenizin dolmasına 3 gün veya daha az süre kaldı. Lisans almadığınız takdirde mağazanız askıya alınacak ve ürünleriniz aramalarda gösterilmeyecektir.
                </div>
              )}
            </section>

            {/* License Activation Form */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-blue-900">🔑 Lisans Anahtarı ile Aktifleştir</h2>
              <p className="text-xs text-slate-500">Satın aldığınız lisans aktivasyon kodunu aşağıdaki kutuya girerek anında paket limitlerinizi yükseltin:</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activationKey}
                  onChange={(e) => setActivationKey(e.target.value)}
                  placeholder="Örn: HBS-B1-DF3A-8K91"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none focus:border-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={handleActivateKey}
                  disabled={isActivating || !activationKey}
                  className="rounded-xl bg-slate-900 px-6 text-sm font-black text-white hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                >
                  {isActivating ? "Doğrulanıyor..." : "Aktifleştir"}
                </button>
              </div>

              {activationError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-bold">
                  ⚠️ {activationError}
                </div>
              )}

              {activationSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-950 font-bold">
                  {activationSuccess}
                </div>
              )}
            </section>

            {/* Dynamic Interactive Pricing Calculator */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-800">🎚️ Dinamik Lisans Ücret Hesaplayıcı</h2>
              <p className="text-xs text-slate-500 font-bold">Kullanıcı sayısı, depo şubeleri ve ürün limitini kaydırarak tahmini maliyetlerinizi hesaplayın:</p>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Maksimum Kullanıcı Sayısı</span>
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

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Lisans Süresi</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 6, 12].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMonths(m)}
                        className={`rounded-xl py-2 text-xs font-black transition border ${
                          months === m 
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {m} Ay {m === 6 ? "(%10 İndirim)" : m === 12 ? "(%20 İndirim)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex justify-between items-center mt-4">
                  <div>
                    <span className="text-xs font-black text-blue-900 block">HESAPLANAN TOPLAM BEDEL</span>
                    <span className="text-[10px] text-blue-600">Net fiyat olup, ödemeler bayiler kanalıyla yapılır.</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-950">{calculatedPrice} GEL</span>
                    <span className="block text-[10px] text-slate-500">Ayda ~{Math.round(calculatedPrice/months)} GEL</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            
            {/* Superadmin batch licensing control panel */}
            {currentUser?.role === "superadmin" && (
              <section className="rounded-2xl border-2 border-amber-300 bg-white p-5 shadow-xl space-y-4 relative overflow-hidden">
                
                {/* Visual indicator corner badge */}
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 px-4 py-1 text-[10px] font-black rounded-bl-xl uppercase tracking-widest shadow-xs">
                  ★ Platform Sahibi Özel Erişim Paneli ★
                </div>

                <div>
                  <h2 className="text-xl font-black text-amber-800 flex items-center gap-2">⭐ HBS Lisans Üretim İstasyonu</h2>
                  <p className="text-xs text-slate-600 mt-1">Özgür Bey, bu kısımdan dilediğiniz paket limitlerine uygun binlerce lisans anahtarını tek tıkla üretebilir ve Excel'e indirebilirsiniz.</p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  
                  {/* Preset Packages selection grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700 block uppercase tracking-wider">1. Paket Şablonunu Seçin</span>
                    <div className="grid grid-cols-4 gap-2">
                      {(["Bronze", "Silver", "Gold", "Custom"] as const).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setGenPreset(preset)}
                          className={`rounded-xl py-2 text-xs font-black transition border text-center ${
                            genPreset === preset
                              ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Limit customization sliders (Only active when Custom is chosen) */}
                  <div className={`rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 transition-opacity duration-300 ${
                    genPreset !== "Custom" ? "opacity-60 pointer-events-none" : "opacity-100"
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">Paket Limitlerini Ayarla (Custom)</span>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Kullanıcı Sınırı</span>
                        <span>{genMaxUsers} Kullanıcı</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={genMaxUsers}
                        onChange={(e) => setGenMaxUsers(Number(e.target.value))}
                        className="h-1 w-full cursor-pointer appearance-none bg-slate-200 accent-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Depo Şubesi Sınırı</span>
                        <span>{genMaxWarehouses} Depo</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={genMaxWarehouses}
                        onChange={(e) => setGenMaxWarehouses(Number(e.target.value))}
                        className="h-1 w-full cursor-pointer appearance-none bg-slate-200 accent-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Ürün Yükleme Sınırı</span>
                        <span>{genMaxProducts} Ürün</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={genMaxProducts}
                        onChange={(e) => setGenMaxProducts(Number(e.target.value))}
                        className="h-1 w-full cursor-pointer appearance-none bg-slate-200 accent-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Expiration term selection */}
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700 block uppercase tracking-wider">2. Lisans Süresi Seçin</span>
                    <div className="grid grid-cols-4 gap-2">
                      {([1, 3, 6, 12] as const).map((monthsCount) => (
                        <button
                          key={monthsCount}
                          type="button"
                          onClick={() => setGenDuration(monthsCount)}
                          className={`rounded-xl py-2 text-xs font-black transition border text-center ${
                            genDuration === monthsCount
                              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {monthsCount} Ay
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and Action Button */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">3. Üretilecek Key Adeti</span>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={genCount}
                        onChange={(e) => setGenCount(Number(e.target.value))}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-black outline-none focus:border-amber-500 focus:bg-white transition"
                      />
                    </label>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleGenerateBatch}
                        disabled={isGenerating || genCount <= 0}
                        className="w-full rounded-xl bg-amber-500 py-3 text-xs font-black text-slate-950 hover:bg-amber-400 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md"
                      >
                        {isGenerating ? "Anahtarlar Üretiliyor..." : "⚡ Toplu Lisans Anahtarı Üret"}
                      </button>
                    </div>
                  </div>

                  {/* Generation outcomes */}
                  {generationMsg && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                      <p className="text-xs font-black text-amber-950">{generationMsg}</p>
                      
                      {generatedKeysList.length > 0 && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleDownloadCSV}
                            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs px-4 py-2.5 transition active:scale-95 flex items-center gap-1.5 shadow-sm"
                          >
                            📥 Excel / CSV Olarak İndir
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setGeneratedKeysList([]);
                              setGenerationMsg("");
                            }}
                            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-black text-xs px-4 py-2.5 transition active:scale-95"
                          >
                            Ekranı Temizle
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Table review of generated batch keys */}
                  {generatedKeysList.length > 0 && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Üretilen Anahtarlar (İlk 10 Adet Listelenmektedir)</span>
                      <div className="max-h-[160px] overflow-y-auto text-[11px] font-mono font-bold text-slate-700 space-y-1 divide-y divide-slate-100 pr-1.5">
                        {generatedKeysList.slice(0, 10).map((k, idx) => (
                          <div key={idx} className="flex justify-between py-1">
                            <span>🔑 {k.key_code}</span>
                            <span className="text-amber-700 font-black font-sans uppercase text-[9px]">{k.tier_name} ({k.duration_months} Ay)</span>
                          </div>
                        ))}
                        {generatedKeysList.length > 10 && (
                          <div className="text-center text-[10px] text-slate-400 italic font-sans pt-1">...ve {generatedKeysList.length - 10} adet daha lisans kodu CSV indirme dosyasında bulunmaktadır.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* General policies info card */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-700">📌 SaaS Askıya Alma Kuralları ve Politikaları</h3>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-2 leading-relaxed">
                <li>Yeni açılan mağazalara varsayılan <b>14 Günlük Demo</b> süresi tanımlanır.</li>
                <li>Deneme süresi bitimine <b>3 gün kala</b> satıcı panelinde büyük lisans uyarı kutusu gösterilir.</li>
                <li>Süre bittiğinde, mağaza lisans kodunu girene kadar <b>arama sonuçlarında gizlenir</b> (`is_visible_in_public_search = false`) ve satış işlemleri duraklatılır.</li>
                <li>Sınırsız Partner muafiyeti yalnızca özel anlaşmalı büyük bayiler (OBDTR) için geçerlidir.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
