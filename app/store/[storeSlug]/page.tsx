"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useParams } from "next/navigation";

type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  purchasePrice: string;
  salePrice: string;
  quantity: string;
  warehouse: string;
  shelf: string;
};

type ItemType = "product" | "service" | "rental" | "appointment";
type Visibility = "visible" | "hidden";
type PricingMode = "fixed" | "quote" | "bidding";

type ProductRecord = {
  id: string;
  itemType: ItemType;
  name: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  salePrice: string;
  purchasePrice: string;
  currency: string;
  barcode: string;
  qrCode: string;
  sku: string;
  oemCode: string;
  manufacturerCode: string;
  stockTracking: boolean;
  quantity: string;
  warehouse: string;
  shelf: string;
  entryDate: string;
  exitDate: string;
  pricingMode: PricingMode;
  visibility: Visibility;
  imageUrl: string;
  videoUrl: string;
  variants?: ProductVariant[];
};

type StoreType = "products" | "realEstate" | "salon" | "autoRepair";

export default function StorePage() {
  const params = useParams<{ storeSlug: string }>();
  
  // Dynamic UI morphing simulator trigger
  const [storeType, setStoreType] = useState<StoreType>(
    params.storeSlug === "obdtr" || params.storeSlug === "ferro-motors" ? "products" : "autoRepair"
  );
  
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("hbs-store-products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Store products loading error:", e);
    }
    
    // Fallback to initial diagnostics-focused store list for OBDTR
    const defaultProducts: ProductRecord[] = [
      {
        id: "default-autel-001",
        itemType: "product",
        name: "Autel Diagnostik Cihazı",
        category: "Oto Diagnostik",
        brand: "Autel",
        model: "MaxiSys Serisi",
        description: "Profesyonel otomotiv arıza tespit ve beyin programlama cihazları.",
        salePrice: "1600",
        purchasePrice: "1000",
        currency: "GEL",
        barcode: "8690000000042",
        qrCode: "QR-AUTEL-MAXISYS",
        sku: "AT-MAXISYS",
        oemCode: "",
        manufacturerCode: "",
        stockTracking: true,
        quantity: "5",
        warehouse: "Ana Depo",
        shelf: "A-02",
        entryDate: "2026-05-15",
        exitDate: "",
        pricingMode: "fixed",
        visibility: "visible",
        imageUrl: "/product-images/diagnostic-scanner.svg",
        videoUrl: "https://www.youtube.com/watch?v=demo",
        variants: [
          {
            id: "var-autel-elite",
            name: "Autel MaxiSys Elite II",
            sku: "AT-ELITE-II",
            barcode: "8690000000042",
            purchasePrice: "1000",
            salePrice: "1600",
            quantity: "3",
            warehouse: "Ana Depo",
            shelf: "A-02"
          },
          {
            id: "var-autel-ultra",
            name: "Autel MaxiSys Ultra Tablet",
            sku: "AT-ULTRA-TAB",
            barcode: "8690000000059",
            purchasePrice: "2400",
            salePrice: "3800",
            quantity: "2",
            warehouse: "Ana Depo",
            shelf: "A-03"
          }
        ]
      },
      {
        id: "default-thinktool-002",
        itemType: "product",
        name: "Thinktool Akıllı Arıza Tespit Cihazı",
        category: "Oto Diagnostik",
        brand: "Thinktool",
        model: "Master Serisi",
        description: "Yüksek performanslı, çevrimiçi kodlama destekli yeni nesil diagnostik cihazları.",
        salePrice: "450",
        purchasePrice: "300",
        currency: "GEL",
        barcode: "8690000000066",
        qrCode: "QR-THINKTOOL",
        sku: "TT-MASTER",
        oemCode: "",
        manufacturerCode: "",
        stockTracking: true,
        quantity: "11",
        warehouse: "Ana Depo",
        shelf: "B-01",
        entryDate: "2026-05-18",
        exitDate: "",
        pricingMode: "fixed",
        visibility: "visible",
        imageUrl: "/product-images/diagnostic-scanner.svg",
        videoUrl: "",
        variants: [
          {
            id: "var-tt-reader",
            name: "Thinktool Reader",
            sku: "TT-READER",
            barcode: "8690000000066",
            purchasePrice: "300",
            salePrice: "450",
            quantity: "8",
            warehouse: "Ana Depo",
            shelf: "B-01"
          },
          {
            id: "var-tt-masterx",
            name: "Thinktool Master X",
            sku: "TT-MASTER-X",
            barcode: "8690000000073",
            purchasePrice: "1500",
            salePrice: "2200",
            quantity: "3",
            warehouse: "Ana Depo",
            shelf: "B-02"
          }
        ]
      },
      {
        id: "default-003",
        itemType: "product",
        name: "Ford Escape Fren Balatası",
        category: "Fren Sistemi",
        brand: "Ford",
        model: "Escape",
        description: "Ford Escape uyumlu ön fren balatası.",
        salePrice: "75",
        purchasePrice: "45",
        currency: "GEL",
        barcode: "8690000000011",
        qrCode: "HBS-FERRO-BALATA-001",
        sku: "FR-BALATA-ESCAPE-001",
        oemCode: "FORD-OEM-ESC-BR-001",
        manufacturerCode: "MFG-BR-001",
        stockTracking: true,
        quantity: "12",
        warehouse: "Ana Depo",
        shelf: "A-03",
        entryDate: "2026-05-01",
        exitDate: "",
        pricingMode: "fixed",
        visibility: "visible",
        imageUrl: "/product-images/brake-pad.svg",
        videoUrl: "",
      },
      {
        id: "default-004",
        itemType: "product",
        name: "Toyota Corolla Yağ Filtresi",
        category: "Filtre",
        brand: "Toyota",
        model: "Corolla",
        description: "Toyota Corolla uyumlu yağ filtresi.",
        salePrice: "22",
        purchasePrice: "12",
        currency: "GEL",
        barcode: "8690000000028",
        qrCode: "HBS-FERRO-FILTRE-002",
        sku: "FR-FILTRE-COROLLA-002",
        oemCode: "TOYOTA-OEM-COR-FLT-002",
        manufacturerCode: "MFG-FLT-002",
        stockTracking: true,
        quantity: "30",
        warehouse: "Ana Depo",
        shelf: "B-04",
        entryDate: "2026-05-10",
        exitDate: "",
        pricingMode: "fixed",
        visibility: "visible",
        imageUrl: "/product-images/oil-filter.svg",
        videoUrl: "",
      },
      {
        id: "default-005",
        itemType: "product",
        name: "Universal Buji Seti",
        category: "Ateşleme",
        brand: "Universal",
        model: "Tüm Modeller",
        description: "Evrensel yüksek performanslı buji takımı.",
        salePrice: "",
        purchasePrice: "50",
        currency: "GEL",
        barcode: "8690000000035",
        qrCode: "",
        sku: "FR-BUJI-004",
        oemCode: "",
        manufacturerCode: "",
        stockTracking: true,
        quantity: "15",
        warehouse: "Ana Depo",
        shelf: "C-01",
        entryDate: "2026-05-12",
        exitDate: "",
        pricingMode: "quote",
        visibility: "visible",
        imageUrl: "/product-images/diagnostic-scanner.svg",
        videoUrl: "",
      }
    ];
    setProducts(defaultProducts);
  }, []);

  function saveCustomerOffer(productName: string, type: "quote" | "bid", offerVal = "") {
    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const customerEmail = currentUser?.username || "Ziyaretçi";
      
      const newOffer = {
        id: `offer-${Date.now()}`,
        customerEmail,
        productName,
        type,
        offerValue: type === "bid" ? offerVal : "Fiyat Teklifi İstendi",
        status: "Beklemede (Satıcı Değerlendiriyor)",
        date: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", {hour: "2-digit", minute: "2-digit"})
      };
      
      const currentOffers = JSON.parse(window.localStorage.getItem("hbs-store-customer-offers") || "[]");
      currentOffers.push(newOffer);
      window.localStorage.setItem("hbs-store-customer-offers", JSON.stringify(currentOffers));
    } catch (e) {
      console.error("Error saving customer offer:", e);
    }
  }

  // Time-slot booking states for Salon
  const [selectedStaff, setSelectedStaff] = useState("Ahmet Usta (Baş Stilist)");
  const [selectedService, setSelectedService] = useState("Saç Kesim & Şekillendirme");
  const [selectedSlot, setSelectedSlot] = useState("");

  // Auto repair license plate check state
  const [plateNumber, setPlateNumber] = useState("34-OBD-34");
  const [showRepairTracker, setShowRepairTracker] = useState(true);

  // Offers state
  const [offerValue, setOfferValue] = useState("");
  const [offerProduct, setOfferProduct] = useState("");

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900 px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/" className="text-base font-black sm:text-xl text-blue-600">HBS Vitrin</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/customer" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Müşteri Portalı</Link>
            <Link href="/login" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Mağaza Paneli</Link>
          </div>
        </header>

        {/* Dynamic Sector Showcase Simulator Bar - Wow Factor! */}
        <section className="mb-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest block">Sektörel Vitrin Arayüz Simülatörü</span>
            <p className="text-xs text-blue-900 leading-relaxed font-bold">HBS, tek tip pazar yeri değildir. İşletmenin türüne göre vitrin arayüzü saniyeler içinde şekillenir:</p>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <button
              onClick={() => { setStoreType("products"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "products" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              🧰 Ürün & Parça
            </button>
            <button
              onClick={() => { setStoreType("realEstate"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "realEstate" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              🏢 Emlak / Portföy
            </button>
            <button
              onClick={() => { setStoreType("salon"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "salon" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              💈 Kuaför / Hizmet
            </button>
            <button
              onClick={() => { setStoreType("autoRepair"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "autoRepair" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              🛠️ Oto Servis / Canlı Tamir
            </button>
          </div>
        </section>

        {message && (
          <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs font-black text-blue-950">
            ✓ {message}
          </div>
        )}

        {/* -------------------- 1. PRODUCTS & SPARE PARTS STOREFRONT -------------------- */}
        {storeType === "products" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">HBS PARÇA MAĞAZASI</span>
              <h1 className="text-3xl font-black">Ferro Motors / OBDTR Diagnostics</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                Oto yedek parça, diagnos cihazları, motor yağları ve filtre gruplarının sergilendiği fiziksel depo ve raf entegrasyonlu katalog vitrinidir.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const hasVariants = p.variants && p.variants.length > 0;
                const selectedVarId = selectedVariants[p.id];
                const activeVariant = hasVariants ? p.variants?.find(v => v.id === selectedVarId) || p.variants?.[0] : null;

                const displayPrice = activeVariant 
                  ? (activeVariant.salePrice ? `${activeVariant.salePrice} ${p.currency}` : "Teklif Alın") 
                  : (p.pricingMode === "fixed" && p.salePrice ? `${p.salePrice} ${p.currency}` : "Teklif Alın");

                const displaySku = activeVariant ? activeVariant.sku : p.sku;
                const displayBarcode = activeVariant ? activeVariant.barcode : p.barcode;
                const displayShelf = activeVariant ? activeVariant.shelf : p.shelf;
                const displayWarehouse = activeVariant ? activeVariant.warehouse : p.warehouse;
                const displayQuantity = activeVariant ? activeVariant.quantity : p.quantity;
                const isPricingFixed = activeVariant ? !!activeVariant.salePrice : p.pricingMode === "fixed" && !!p.salePrice;

                return (
                  <article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="object-contain h-full w-full p-2" />
                        ) : (
                          <span className="text-3xl">⚙️</span>
                        )}
                      </div>
                      
                      <div>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-black text-blue-800 uppercase">
                          {p.category}
                        </span>
                        <h3 className="font-black text-sm text-slate-800 mt-1">{p.name}</h3>
                        {p.description && (
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                        )}
                        
                        <div className="text-[10px] text-slate-400 mt-2 space-y-0.5 border-t border-slate-50 pt-2 font-medium">
                          <p>Stok SKU: <b className="text-slate-700">{displaySku || "-"}</b></p>
                          <p>Barkod: <span className="text-slate-700">{displayBarcode || "-"}</span></p>
                          <p>Raf Adresi: <span className="text-blue-700 font-bold">{displayWarehouse} · {displayShelf || "-"}</span></p>
                          {displayQuantity && (
                            <p>Stok Durumu: <span className="text-emerald-700 font-extrabold">{displayQuantity} Adet</span></p>
                          )}
                        </div>

                        {/* Variants Select Box */}
                        {hasVariants && (
                          <div className="mt-2.5 space-y-1">
                            <label className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">
                              ⚙️ Model / Varyant Seçin:
                            </label>
                            <select
                              value={selectedVarId || p.variants?.[0]?.id}
                              onChange={(e) => {
                                setSelectedVariants({
                                  ...selectedVariants,
                                  [p.id]: e.target.value
                                });
                              }}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-black outline-none focus:border-blue-500 transition"
                            >
                              {p.variants?.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.name} {v.salePrice ? `(${v.salePrice} ${p.currency})` : "(Teklif Alın)"}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 mt-2">
                      <span className="font-black text-xs text-slate-900">{displayPrice}</span>
                      <div className="flex gap-1.5">
                        {isPricingFixed ? (
                          <button
                            type="button"
                            onClick={() => {
                              const variantName = activeVariant ? ` (${activeVariant.name})` : "";
                              setMessage(`${p.name}${variantName} sepetinize eklendi.`);
                            }}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-black text-white hover:bg-slate-800 transition"
                          >
                            Sepete Ekle
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const variantName = activeVariant ? ` (${activeVariant.name})` : "";
                              const finalProductName = `${p.name}${variantName}`;
                              saveCustomerOffer(finalProductName, "quote");
                              setMessage(`${finalProductName} için fiyat teklif talebi satıcıya iletildi. 'Tekliflerim' sekmesinden takip edebilirsiniz.`);
                            }}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-blue-700 transition"
                          >
                            Teklif İste
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* -------------------- 2. REAL ESTATE PORTFOLIO STOREFRONT -------------------- */}
        {storeType === "realEstate" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">HBS EMLAK & PORTFÖY VİTRİNİ</span>
              <h1 className="text-3xl font-black">Batumi Premium Real Estate</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                Depo mantığı olmayan emlak sektöründe, m² (alan), oda sayısı, kat, ısıtma ve kiralık/satılık filtreleri gibi sektörel özelliklerin yer aldığı emlak portföy vitrinidir.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: "Batumi Hills Sea View Apartment", type: "Kiralık", area: "85m²", rooms: "2+1", floor: "12", price: "800 USD / Ay", features: "Deniz Manzaralı, Doğalgaz Kombi" },
                { name: "Orbi City Luxury Studio", type: "Satılık", area: "38m²", rooms: "1+0", floor: "24", price: "45.000 USD", features: "Eşyalı, Klima" }
              ].map((estate) => (
                <article key={estate.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="aspect-[16/9] rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center text-4xl">🏢</div>
                  
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${estate.type === "Satılık" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                        {estate.type}
                      </span>
                      <h3 className="font-black text-sm text-slate-800 mt-1">{estate.name}</h3>
                    </div>
                    <span className="font-black text-sm text-slate-900 shrink-0">{estate.price}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100 font-bold text-slate-600">
                    <div>📏 {estate.area}</div>
                    <div>🛏️ {estate.rooms}</div>
                    <div>🏢 Kat: {estate.floor}</div>
                    <div>🔥 {estate.features.split(",")[1] || "Klima"}</div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">{estate.features} özellikleriyle kaçırılmayacak fırsat.</p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setMessage(`${estate.name} için inceleme randevu talebi emlak danışmanına iletildi.`)}
                      className="rounded-xl bg-slate-900 py-2 text-xs font-black text-white hover:bg-slate-800 transition"
                    >
                      📅 İnceleme Randevusu Al
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOfferProduct(estate.name);
                        setOfferValue("");
                      }}
                      className="rounded-xl border border-slate-200 bg-white py-2 text-xs font-black hover:bg-slate-50 transition"
                    >
                      💸 Teklif Sun (İskonto Talebi)
                    </button>
                  </div>

                  {offerProduct === estate.name && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 mt-3 space-y-2 animate-fadeIn">
                      <span className="text-[10px] font-black text-blue-900 block">Teklif Fiyatı İletin</span>
                      <div className="flex gap-2">
                        <input
                          value={offerValue}
                          onChange={(e) => setOfferValue(e.target.value)}
                          placeholder="Örn: 42.000 USD"
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            saveCustomerOffer(estate.name, "bid", offerValue);
                            setMessage(`${estate.name} için ${offerValue} teklifiniz emlak danışmanına başarıyla iletildi. 'Tekliflerim' sekmesinden takip edebilirsiniz.`);
                            setOfferProduct("");
                          }}
                          className="rounded-lg bg-blue-600 px-3 text-xs font-black text-white hover:bg-blue-700"
                        >
                          Gönder
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* -------------------- 3. HAIR SALON & APPOINTMENT STOREFRONT -------------------- */}
        {storeType === "salon" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">HBS ZAMAN SLOTLU RANDEVU VİTRİNİ</span>
              <h1 className="text-3xl font-black">Trend Kuaför & Güzellik Merkezi</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                Stok tutmayan hizmet odaklı kuaför, danışmanlık, yaşlı bakım gibi işletmeler için; hizmet tipi, süresi, işlemi uygulayacak uzmanı (staff) seçmeye yönelik takvim ve randevu vitrinidir.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Service list catalog */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Hizmet Kataloğu & İşlemler</h2>
                
                {[
                  { name: "Saç Kesim & Şekillendirme", duration: "45 dk", price: "40 GEL", staff: "Ahmet Usta, Giorgi" },
                  { name: "Saç Boyama & Balyaj", duration: "120 dk", price: "120 GEL", staff: "Ahmet Usta, Elena" },
                  { name: "Manikür & Pedikür Özel İşlem", duration: "60 dk", price: "50 GEL", staff: "Elena" }
                ].map((serv) => (
                  <div
                    key={serv.name}
                    className={`rounded-xl border p-3.5 transition text-xs flex justify-between items-start gap-2 cursor-pointer ${selectedService === serv.name ? "border-blue-500 bg-blue-50/50" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"}`}
                    onClick={() => setSelectedService(serv.name)}
                  >
                    <div>
                      <h3 className="font-black text-slate-800">{serv.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">🕒 Süre: {serv.duration} | Uzmanlar: {serv.staff}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900 block">{serv.price}</span>
                      <span className={`text-[9px] font-black uppercase mt-1 inline-block ${selectedService === serv.name ? "text-blue-600" : "text-slate-400"}`}>
                        {selectedService === serv.name ? "Seçildi" : "Seç"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic slot booking panel */}
              <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Rezervasyon Yapın</h2>
                
                <div className="space-y-3">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-500">İşlemi Yapan Uzman (Staff)</span>
                    <select
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none"
                    >
                      <option>Ahmet Usta (Baş Stilist)</option>
                      <option>Elena (Güzellik Uzmanı)</option>
                      <option>Giorgi (Berber & Tıraş)</option>
                    </select>
                  </label>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">Bugün İçin Uygun Zaman Slotları</span>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black text-blue-900">
                      {["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg py-2 border transition ${selectedSlot === slot ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-100 hover:bg-blue-50"}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedSlot}
                    onClick={() => {
                      setMessage(`${selectedService} işlemi için ${selectedStaff} ile bugün saat ${selectedSlot} randevunuz başarıyla oluşturuldu!`);
                      setSelectedSlot("");
                    }}
                    className="w-full rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    📅 Randevuyu Onayla ({selectedService})
                  </button>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* -------------------- 4. AUTO REPAIR & PROGRESS TRACKER -------------------- */}
        {storeType === "autoRepair" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">HBS OTO SERVİS & CANLI İLERLEME TAKİBİ</span>
              <h1 className="text-3xl font-black">Ferro Auto Repair & Service</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                Oto servis ve tamirhanelerde müşterilerin arabalarının tamir sürecini (başlayan, biten ve bekleyen tüm görevleri) şeffaf şekilde izleyebildikleri canlı ilerleme takip vitrinidir.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Plate enter search */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 flex flex-col justify-center">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">🚗 Plaka İle Canlı Takip</h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">Servisteki aracınızın güncel durumunu izlemek için plaka numaranızı girin:</p>
                
                <div className="flex gap-2">
                  <input
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="Örn: 34-OBD-34"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowRepairTracker(true);
                      setMessage(`${plateNumber} plakalı aracın tamir süreci döküldü.`);
                    }}
                    className="rounded-xl bg-slate-900 px-4 text-xs font-black text-white hover:bg-slate-800 transition"
                  >
                    Sorgula
                  </button>
                </div>
              </div>

              {/* Dynamic visual tracker as requested! */}
              {showRepairTracker ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-600 block">ONARIM DEVAM EDİYOR ⚙️</span>
                      <h3 className="font-black text-slate-800">Toyota Corolla · {plateNumber.toUpperCase()}</h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Sorumlu Usta: Giorgi Shavadze | Giriş: Dün 14:30</p>
                    </div>

                    <div className="text-right">
                      <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-black text-amber-800">
                        Montaj & Onarım Aşaması
                      </span>
                    </div>
                  </div>

                  {/* Gorgeous Multi-Stage Progress Track */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Servis İlerleme Aşaması</span>
                      <span className="text-blue-700">60% Tamamlandı</span>
                    </div>
                    
                    <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: "60%" }}></div>
                    </div>

                    <div className="grid grid-cols-5 text-center text-[8px] font-black text-slate-400 gap-1 pt-1.5 uppercase tracking-wider">
                      <div className="text-emerald-600">✓ Arıza Tespit</div>
                      <div className="text-emerald-600">✓ Parça Tedariği</div>
                      <div className="text-blue-700 font-extrabold animate-pulse">⚙️ Onarım</div>
                      <div>⏳ Test Sürüşü</div>
                      <div>⏳ Teslimat</div>
                    </div>
                  </div>

                  {/* Checklist of specific repair tasks as requested! */}
                  <div className="border-t border-slate-100 pt-3 space-y-2.5">
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Onarım Kontrol Listesi (Checklist)</h4>
                    
                    {[
                      { name: "Bilgisayarlı OBD Arıza Teşhisi", status: "completed", note: "OBDTR Autel cihazıyla test edildi, arızalar silindi." },
                      { name: "Yağ ve Yağ Filtresi Değişimi", status: "completed", note: "10W-40 tam sentetik yağ kullanıldı." },
                      { name: "Ön Fren Balatası Montajı", status: "active", note: "Balatalar söküldü, yeni disk yatakları takılıyor." },
                      { name: "Amortisör ve Ön Düzen Kontrolü", status: "pending", note: "Onarım sonrası rot-balans ayarına geçilecek." }
                    ].map((task) => (
                      <div key={task.name} className="flex gap-3 text-xs leading-relaxed items-start">
                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${task.status === "completed" ? "bg-emerald-100 text-emerald-700" : task.status === "active" ? "bg-blue-100 text-blue-700 animate-spin" : "bg-slate-100 text-slate-400"}`}>
                          {task.status === "completed" ? "✓" : task.status === "active" ? "⚙️" : "○"}
                        </div>
                        <div>
                          <span className={`font-black ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.name}</span>
                          <p className="text-[10px] text-slate-400 font-bold">{task.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center italic text-slate-400 flex items-center justify-center">
                  Lütfen sol taraftan plaka sorgulaması yapın.
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
