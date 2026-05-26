"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";

type Step = "details" | "sector" | "warehouse" | "license" | "done";

const INITIAL_INDUSTRIES = [
  "Oto yedek parçası",
  "Oto elektroniği",
  "Araba satışı",
  "Cep telefonu",
  "Elektronik ev aletleri",
  "Beyaz eşya",
  "Tekstil",
  "Oto lastik grubu",
  "Oto ve sanayi yağları",
  "Araç arıza tespit cihazları",
];

type WarehouseMap = {
  name: string;
  shelves: string[];
};

export default function StoreRegisterPage() {
  const [step, setStep] = useState<Step>("details");
  const [companyName, setCompanyName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState(""); // If empty -> "Sanal Mağaza, Türkiye çapında kargolama"
  
  // Sector Selection
  const [industries, setIndustries] = useState<string[]>(INITIAL_INDUSTRIES);
  const [selectedIndustry, setSelectedIndustry] = useState("Oto yedek parçası");
  const [customIndustry, setCustomIndustry] = useState("");

  // Warehouse Mapping
  const [warehouses, setWarehouses] = useState<WarehouseMap[]>([
    { name: "Ana Depo", shelves: ["A-01", "A-02", "B-01", "B-02"] }
  ]);
  const [newWhName, setNewWhName] = useState("");
  const [newShelf, setNewShelf] = useState("");
  const [activeWhIndex, setActiveWhIndex] = useState(0);

  // License & Partner Exemption
  const [isPartner, setIsPartner] = useState(false);
  const [licenseType, setLicenseType] = useState<"trial" | "lifetime">("trial");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load custom industries from local storage
    const storedCustom = window.localStorage.getItem("hbs-custom-industries");
    if (storedCustom) {
      try {
        const parsed = JSON.parse(storedCustom) as string[];
        setIndustries([...INITIAL_INDUSTRIES, ...parsed]);
      } catch {
        setIndustries(INITIAL_INDUSTRIES);
      }
    }
  }, []);

  // Partner Exemption Check
  useEffect(() => {
    const isObdtr = companyName.toUpperCase().includes("OBDTR") || email.toLowerCase().includes("obdtr.com");
    setIsPartner(isObdtr);
    setLicenseType(isObdtr ? "lifetime" : "trial");
  }, [companyName, email]);

  function handleAddWarehouse() {
    if (!newWhName.trim()) return;
    setWarehouses([...warehouses, { name: newWhName, shelves: [] }]);
    setNewWhName("");
    setActiveWhIndex(warehouses.length);
  }

  function handleAddShelf() {
    if (!newShelf.trim()) return;
    const updated = [...warehouses];
    if (!updated[activeWhIndex].shelves.includes(newShelf.toUpperCase())) {
      updated[activeWhIndex].shelves.push(newShelf.toUpperCase());
    }
    setWarehouses(updated);
    setNewShelf("");
  }
  function handleRemoveShelf(shelfIndex: number) {
    const updated = [...warehouses];
    updated[activeWhIndex].shelves.splice(shelfIndex, 1);
    setWarehouses(updated);
  }

  async function handleRegisterStore() {
    setError("");
    setLoading(true);

    const emailCheck = email.trim().toLowerCase();
    try {
      const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      const isEmailTaken = localStores.some((store: any) => store.email.toLowerCase() === emailCheck);
      if (isEmailTaken) {
        setError("Bu e-posta adresiyle kayıtlı bir mağaza zaten mevcut. Lütfen başka bir e-posta kullanın.");
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    const finalAddress = address.trim() || "Sanal Mağaza, Türkiye çapında kargolama";
    let finalIndustry = selectedIndustry;
    if (selectedIndustry === "other" && customIndustry.trim()) {
      finalIndustry = customIndustry.trim();
      // Add custom industry to local list
      const storedCustom = JSON.parse(window.localStorage.getItem("hbs-custom-industries") || "[]");
      if (!storedCustom.includes(finalIndustry)) {
        storedCustom.push(finalIndustry);
        window.localStorage.setItem("hbs-custom-industries", JSON.stringify(storedCustom));
      }
    }

    const companyCode = companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      if (isSupabaseConfigured) {
        // 1. Register User in Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: representative,
              phone,
              role: "owner",
            }
          }
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          // 2. Insert Company into Supabase companies table
          const trialEnds = isPartner ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
          const { data: companyData, error: compError } = await supabase
            .from("companies")
            .insert({
              name: companyName,
              code: companyCode,
              industry_category: finalIndustry,
              default_language: "tr",
              main_currency: "GEL",
              phone,
              whatsapp: phone,
              address: finalAddress,
              city,
              trial_ends_at: trialEnds,
              license_ends_at: isPartner ? null : new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(), // trial + 3 days warning
              is_suspended: false,
              max_users: 10,
              max_warehouses: warehouses.length || 2,
              max_products: 500,
            })
            .select("id")
            .single();

          if (compError) {
            setError(`Firma tablosu hatası: ${compError.message}`);
            setLoading(false);
            return;
          }

          if (companyData) {
            // Update user profile role and company
            await supabase
              .from("profiles")
              .update({
                company_id: companyData.id,
                role: "owner",
              })
              .eq("id", data.user.id);

            // Store initial warehouses
            for (const wh of warehouses) {
              const { data: whData } = await supabase.from("warehouses").insert({
                company_id: companyData.id,
                name: wh.name,
                type: "store",
                address: finalAddress,
                is_sales_enabled: true,
                is_transfer_enabled: true,
              }).select("id").single();

              if (whData) {
                for (const shelf of wh.shelves) {
                  await supabase.from("warehouse_locations").insert({
                    warehouse_id: whData.id,
                    name: shelf,
                    sort_order: 10,
                  });
                }
              }
            }
          }
        }
      }

      // Offline / LocalStorage registry
      const trialDays = isPartner ? 99999 : 14;
      const trialEnds = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();
      const warningEnds = new Date(Date.now() + (trialDays + 3) * 24 * 60 * 60 * 1000).toISOString();

      const newCompanyObj = {
        name: companyName,
        code: companyCode,
        representative,
        email,
        phone,
        city,
        address: finalAddress,
        industry: finalIndustry,
        trialEndsAt: trialEnds,
        warningEndsAt: warningEnds,
        licenseType: isPartner ? "lifetime" : "trial",
        isSuspended: false,
        warehouses: warehouses,
        createdAt: new Date().toISOString(),
      };

      // Save company in local registry
      const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      localStores.push(newCompanyObj);
      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(localStores));

      // Log in user as owner
      window.localStorage.setItem(
        "hbs-current-user",
        JSON.stringify({
          username: email,
          displayName: representative,
          role: "owner",
          storeSlugs: [companyCode],
          signedInAt: new Date().toISOString(),
        })
      );

      setStep("done");
    } catch (err: any) {
      setError(`Sistem hatası: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur px-6 py-4 shadow-sm flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight text-blue-600">HBS</Link>
        <div className="flex items-center gap-3">
          <CompactLanguageSwitcher />
          <Link href="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black shadow-sm">Ana Sayfa</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl w-full px-6 py-10 flex-1">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          
          {/* Steps Progress Indicator */}
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-black text-slate-400">
            <span className={step === "details" ? "text-blue-600 font-extrabold" : "text-slate-600"}>1. Firma Bilgileri</span>
            <span>➔</span>
            <span className={step === "sector" ? "text-blue-600 font-extrabold" : ""}>2. Sektör & Model</span>
            <span>➔</span>
            <span className={step === "warehouse" ? "text-blue-600 font-extrabold" : ""}>3. Depo Yapısı</span>
            <span>➔</span>
            <span className={step === "license" ? "text-blue-600 font-extrabold" : ""}>4. Lisans Bilgisi</span>
          </div>

          {step === "details" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black tracking-tight">HBS İşletme Kaydı</h1>
                <p className="mt-1 text-sm text-slate-500">Şirketinize ait genel bilgileri tanımlayın.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Mağaza / Firma Adı *</span>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Örn: OBDTR Yedek Parça"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Yetkili Ad Soyad *</span>
                  <input
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    required
                    placeholder="Örn: Özgür Yıldız"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Telefon / WhatsApp *</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+90 555 123 45 67"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-600">E-posta Adresi *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="firma@email.com"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Şehir *</span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Örn: İzmir, İstanbul, Batumi"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Şifre *</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Güçlü bir şifre girin"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-xs font-bold text-slate-600">Mağaza Adresi (Opsiyonel)</span>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Mağaza adresi verilmez ise sistem 'Sanal Mağaza, Türkiye çapında kargolama' olarak işaretleyecektir."
                  rows={2}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </label>

              <button
                type="button"
                disabled={!companyName || !representative || !phone || !email || !city || !password}
                onClick={() => setStep("sector")}
                className="w-full mt-4 rounded-xl bg-blue-600 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition"
              >
                İleri: Sektör Seçimi
              </button>
            </div>
          )}

          {step === "sector" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black tracking-tight">Sektör & Kategori Yönetimi</h1>
                <p className="mt-1 text-sm text-slate-500">Mağazanızın faaliyet gösterdiği ana sektörü belirleyin.</p>
              </div>

              <div className="space-y-3">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Sektör Listesi</span>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                    <option value="other">Diğer (Listede yoksa elle yazın...)</option>
                  </select>
                </label>

                {selectedIndustry === "other" && (
                  <label className="grid gap-1.5 animate-fadeIn">
                    <span className="text-xs font-bold text-blue-600">Yeni Sektör İsmi *</span>
                    <input
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      required
                      placeholder="Yeni sektör ismini girin"
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                    <p className="text-[10px] text-slate-500">Bu sektörü eklediğinizde sistem bir sonraki mağaza açılışlarında sektörü otomatik listeye dahil edecektir.</p>
                  </label>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-xs font-black uppercase text-slate-500">Hizmet / Ürün Tipi Uyarı</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">HBS sadece ürün satan mağazalar değil, randevu veya teklif usulü çalışan hizmet ve kiralama mağazaları için de tasarlanmıştır. Paneliniz bu seçime göre otomatik optimize edilir.</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-black hover:bg-slate-50 transition"
                >
                  Geri
                </button>
                <button
                  type="button"
                  disabled={selectedIndustry === "other" && !customIndustry.trim()}
                  onClick={() => setStep("warehouse")}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-black text-white hover:bg-blue-700 transition"
                >
                  İleri: Depo Haritalandırma
                </button>
              </div>
            </div>
          )}

          {step === "warehouse" && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex rounded-full bg-emerald-100 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-800 font-extrabold mb-2">🎁 KAYIT YARDIMCISI</div>
                <h1 className="text-2xl font-black tracking-tight">Depo Haritalandırma Sihirbazı</h1>
                <p className="mt-1 text-sm text-slate-500">Fiziksel veya sanal depolarınızı ve raflarınızı şimdiden eşleştirerek zaman kazanın.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <aside className="border-r border-slate-100 pr-2 space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Depo Seçimi</span>
                  {warehouses.map((wh, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveWhIndex(idx)}
                      className={`w-full text-left rounded-xl px-3 py-2 text-xs font-black transition ${activeWhIndex === idx ? "bg-blue-50 text-blue-700 border border-blue-200" : "hover:bg-slate-50 border border-transparent"}`}
                    >
                      🏢 {wh.name}
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{wh.shelves.length} raf konumu</span>
                    </button>
                  ))}
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 grid gap-2">
                    <input
                      value={newWhName}
                      onChange={(e) => setNewWhName(e.target.value)}
                      placeholder="Yeni Depo..."
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddWarehouse}
                      className="rounded-lg bg-slate-900 py-1 text-xs font-black text-white hover:bg-slate-800 transition"
                    >
                      + Depo Ekle
                    </button>
                  </div>
                </aside>

                <section className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                  <h3 className="font-black text-sm text-slate-700">🏢 {warehouses[activeWhIndex]?.name} - Raf Konumları</h3>
                  
                  <div className="mt-3 flex gap-2">
                    <input
                      value={newShelf}
                      onChange={(e) => setNewShelf(e.target.value)}
                      placeholder="Örn: A-01 veya GRID-B"
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddShelf}
                      className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-black text-white hover:bg-blue-700 transition"
                    >
                      Raf Ekle
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {warehouses[activeWhIndex]?.shelves.map((shelf, shelfIdx) => (
                      <span
                        key={shelfIdx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700"
                      >
                        🗄️ {shelf}
                        <button
                          type="button"
                          onClick={() => handleRemoveShelf(shelfIdx)}
                          className="text-red-500 hover:text-red-700 font-extrabold text-[10px]"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {warehouses[activeWhIndex]?.shelves.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Bu depoya henüz raf konumu eklenmedi.</p>
                    )}
                  </div>
                </section>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep("sector")}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-black hover:bg-slate-50 transition"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep("license")}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-black text-white hover:bg-blue-700 transition"
                >
                  İleri: Lisanslama
                </button>
              </div>
            </div>
          )}

          {step === "license" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black tracking-tight">Lisans & SaaS Politikası</h1>
                <p className="mt-1 text-sm text-slate-500">HBS mağaza lisans yapısı ve deneme süresi kuralları.</p>
              </div>

              {isPartner ? (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
                  <h3 className="font-black text-emerald-950 flex items-center gap-2">
                    🛡️ Ortak / Partner Muafiyeti Aktif
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                    Sistem <b>OBDTR</b> ortağınızın mağaza kaydını başarıyla algıladı! OBDTR mağazasına süre sınırı ve lisans kısıtlaması konulmayacak, süresiz tam lisanslı ücretsiz tanımlanacaktır.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <h3 className="font-black text-blue-950">🎁 14 Günlük Ücretsiz Deneme Süresi</h3>
                    <p className="mt-2 text-sm leading-relaxed text-blue-800">
                      HBS sistemimizi 2 hafta boyunca ücretsiz deneyebilirsiniz. Deneme süresinin bitimine <b>3 gün kala</b> sistem satıcı paneline lisans hatırlatma bildirimleri yollar. Süre sonunda lisans anahtarı girilmezse mağaza otomatik askıya alınır.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-500">Esnek SaaS Paketleri</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Ödeme yapıldıktan sonra aldığınız pakete bağlı olarak 3 ay, 6 ay veya 1 yıllık lisans anahtarları aktif edilir. Lisans ücretleri;</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                      <li>Kullanıcı sayısına (Patron, Müdür, Depo Sorumlusu, Muhasebeci vb.)</li>
                      <li>Depo / Şube sayısına</li>
                      <li>Maksimum stok ürün limitine göre değişir.</li>
                    </ul>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep("warehouse")}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-black hover:bg-slate-50 transition"
                >
                  Geri
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRegisterStore}
                  className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-black text-white hover:bg-slate-800 transition"
                >
                  {loading ? "Kuruluyor..." : isPartner ? "Sınırsız Mağazayı Oluştur" : "14 Günlük Denemeyi Başlat"}
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-6 space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border border-emerald-500/20 text-emerald-600 text-3xl">
                ✓
              </div>
              <h2 className="text-3xl font-black tracking-tight">HBS Mağazanız Kuruldu!</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
                Mağaza altyapısı ve {warehouses.length} adet depo/raf haritalandırması başarıyla tamamlandı. İş modelinize uygun yönetim modülleri panelinizde hazır hale getirilmiştir.
              </p>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 max-w-md mx-auto text-xs text-blue-900 leading-relaxed">
                ℹ️ <b>Kullanım Bilgisi:</b> Giriş yaptıktan sonra ürün eklerken {warehouses[activeWhIndex]?.name || "Ana Depo"} için belirlediğiniz raf konumlarını doğrudan seçebilirsiniz.
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-black text-white hover:bg-slate-800 transition shadow-lg active:scale-95"
                >
                  Mağaza Yönetim Paneline Git
                </Link>
                <Link
                  href="/"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black hover:bg-slate-50 transition"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          )}

        </section>
      </div>

      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200">
        HBS Cloud SaaS Platform © 2026. All rights reserved.
      </footer>
    </main>
  );
}
