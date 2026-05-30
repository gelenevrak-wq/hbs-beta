"use client";

import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LocalizedText, dynamicUi, pickLocalizedText } from "@/lib/i18n/dynamicContent";
import { HbsLanguageCode } from "@/lib/i18n/translations";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";

type StockKey = "inStock" | "limited" | "quote";

type ProductData = {
  slug: string;
  name: LocalizedText;
  brand: string;
  model: LocalizedText;
  category: LocalizedText;
  storeName: string;
  storeSlug: string;
  country: string;
  city: string;
  description: LocalizedText;
  priceText: LocalizedText;
  imageUrl: string;
  gallery: string[];
  priceValue?: number;
  currency: string;
  stockStatus: StockKey;
  barcode?: string;
  sku?: string;
  oemCode?: string;
  manufacturerCode?: string;
};

const stockText: Record<StockKey, LocalizedText> = {
  inStock: { tr: "Stokta var", en: "In stock", de: "Verfügbar", ru: "В наличии", ka: "მარაგშია" },
  limited: { tr: "Sınırlı stok", en: "Limited stock", de: "Begrenzter Bestand", ru: "Ограниченный запас", ka: "შეზღუდული მარაგი" },
  quote: { tr: "Teklif gerekli", en: "Quote required", de: "Anfrage erforderlich", ru: "Цена по запросу", ka: "ფასი მოთხოვნით" },
};

const demoProducts: ProductData[] = [];

function txt(value: LocalizedText | string, language: HbsLanguageCode) {
  return pickLocalizedText(value, language);
}

function availabilityUrl(stockStatus: StockKey) {
  if (stockStatus === "inStock") return "https://schema.org/InStock";
  if (stockStatus === "limited") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/PreOrder";
}

export default function ProductDetailPage() {
  const params = useParams<{ productSlug: string }>();
  const { t, language, isReady } = useHbsLanguage();
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [customLoaded, setCustomLoaded] = useState(false);

  useEffect(() => {
    if (!isReady || !params.productSlug) return;
    
    // 1. Static demo products check
    const staticProd = demoProducts.find((item) => item.slug === params.productSlug);
    if (staticProd) {
      setProduct(staticProd);
      setCustomLoaded(true);
      return;
    }

    // 2. Custom local storage products check
    try {
      const savedProducts = window.localStorage.getItem("hbs-store-products");
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts) as Array<{
          id: string;
          name: string;
          category: string;
          brand: string;
          model: string;
          description: string;
          salePrice: string;
          currency: string;
          sku: string;
          imageUrl?: string;
          visibility?: string;
          pricingMode?: string;
          barcode?: string;
          qrCode?: string;
          oemCode?: string;
          warehouse?: string;
          shelf?: string;
        }>;

        const found = parsedProducts.find(p => p.id === params.productSlug || p.sku === params.productSlug);
        if (found) {
          const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
          const matchingStore = localStores.find((st: any) => st.code === "obdtr") || {
            code: "obdtr",
            name: "OBDTR Diagnostics",
            city: "İstanbul",
            operatingModel: "virtual_delivery",
            serviceCountries: ["TR", "GE"]
          };

          const mapped: ProductData = {
            slug: found.id,
            name: { tr: found.name, en: found.name, de: found.name, ru: found.name, ka: found.name },
            brand: found.brand || "Genel",
            model: { tr: found.model || "Genel", en: found.model || "General" },
            category: { tr: found.category || "Diğer", en: found.category || "Other" },
            storeName: matchingStore.name,
            storeSlug: matchingStore.code,
            country: matchingStore.city.toLowerCase().includes("batum") ? "Georgia" : "Türkiye",
            city: matchingStore.city || "İstanbul",
            description: { tr: found.description || "", en: found.description || "" },
            priceText: {
              tr: found.pricingMode === "quote" ? "Teklif isteyin" : found.pricingMode === "bidding" ? "Teklif verin" : `${found.salePrice || "0"} ${found.currency || "GEL"}`,
              en: found.pricingMode === "quote" ? "Request quote" : found.pricingMode === "bidding" ? "Make an offer" : `${found.salePrice || "0"} ${found.currency || "GEL"}`
            },
            imageUrl: found.imageUrl || "/product-images/diagnostic-scanner.svg",
            gallery: [found.imageUrl || "/product-images/diagnostic-scanner.svg"],
            priceValue: found.salePrice ? parseFloat(found.salePrice) : undefined,
            currency: found.currency || "GEL",
            stockStatus: found.pricingMode === "quote" ? "quote" : "inStock",
            barcode: found.barcode,
            sku: found.sku,
            oemCode: found.oemCode
          };
          setProduct(mapped);
        }
      }
    } catch (e) {
      console.error("Error loading product detail from localStorage", e);
    }
    setCustomLoaded(true);
  }, [params.productSlug, isReady]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return demoProducts.filter((item) => item.slug !== product.slug && item.storeSlug === product.storeSlug);
  }, [product]);

  if (!isReady || !customLoaded) return <main className="min-h-screen bg-slate-50" />;

  if (!product) {
    return (
      <main className="min-h-screen hbs-market-page px-6 py-8 text-slate-950">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-black">{t.product.productNotFound}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{t.product.productNotFoundText}</p>
          <Link href="/customer" className="mt-6 rounded-2xl bg-white px-6 py-3 font-black text-slate-950 hover:bg-slate-200">{t.product.goToCustomerPortal}</Link>
        </div>
      </main>
    );
  }

  const activeProduct: ProductData = product;
  const isVirtualDelivery = useMemo(() => {
    if (typeof window === "undefined") return false;
    const localStoresStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
    const localStores = JSON.parse(localStoresStr);
    const storeObj = localStores.find((st: any) => st.code === activeProduct.storeSlug) || (activeProduct.storeSlug === "obdtr" ? {
      operatingModel: "virtual_delivery"
    } : null);
    return storeObj?.operatingModel === "virtual_delivery";
  }, [activeProduct]);
  const displayGallery = Array.from(new Set([activeProduct.imageUrl, ...activeProduct.gallery])).slice(0, 4);
  const internalWarehouseCode = activeProduct.storeSlug === "obdtr" ? "OBDTR / Ana Depo / D-01-R03-G02" : activeProduct.storeSlug === "yildiz-hirdavat" ? "Yıldız / Ana Depo / T-02-R04-G01" : "Depo / A-03-R12-G04";
  const storefrontNames = activeProduct.storeSlug === "obdtr" ? "OBDTR Online Vitrin, Diagnostik Vitrini" : activeProduct.storeSlug === "yildiz-hirdavat" ? "Yıldız Batum Vitrini, Tesisat Ürünleri" : "OBDTR Online Vitrin";
  const canonicalUrl = `https://hbs.example.com/product/${activeProduct.slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: txt(activeProduct.name, language),
    description: txt(activeProduct.description, language),
    brand: { "@type": "Brand", name: activeProduct.brand },
    sku: activeProduct.sku,
    mpn: activeProduct.manufacturerCode || activeProduct.oemCode,
    gtin13: activeProduct.barcode,
    category: txt(activeProduct.category, language),
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: activeProduct.currency,
      price: activeProduct.priceValue ?? undefined,
      availability: availabilityUrl(activeProduct.stockStatus),
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: activeProduct.storeName },
      areaServed: { "@type": "City", name: activeProduct.city },
    },
  };

  function requireLogin() {
    const user = window.localStorage.getItem("hbs-current-user");
    if (!user) {
      window.location.href = "/login";
      return false;
    }
    return true;
  }

  function addToCart() { if (!requireLogin()) return; setMessage(`${txt(activeProduct.name, language)} ${t.product.addedToCart}`); }
  function askQuestion() { if (!requireLogin()) return; setMessage(`${txt(activeProduct.name, language)} ${t.product.questionDemo}`); }
  function requestOffer() { if (!requireLogin()) return; setMessage(`${txt(activeProduct.name, language)} ${t.product.offerDemo}`); }

  return (
    <main className="min-h-screen hbs-market-page px-3 py-3 text-slate-950 sm:px-6 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="mx-auto max-w-[1800px]">
        <header className="mb-4 flex items-center justify-between gap-2 sm:mb-8">
          <Link href="/" className="shrink-0 text-sm font-black tracking-wide sm:text-2xl">HBS</Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <CompactLanguageSwitcher />
            <Link href="/requests" className="hidden rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-750 px-3 py-2 text-xs font-bold hover:bg-indigo-105 sm:inline-flex sm:px-4 sm:text-sm transition">📢 İlan Panosu</Link>
            <Link href={`/store/${activeProduct.storeSlug}`} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.storefront}</Link>
            <Link href="/customer" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.customerPortal}</Link>
            <Link href="/" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:block sm:px-4 sm:text-sm">{t.common.home}</Link>
          </div>
        </header>

        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:mb-6 sm:rounded-[2rem] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr_0.74fr] sm:gap-5">
            <div>
              <div className="hbs-product-image">
                <img src={activeProduct.imageUrl} alt={txt(activeProduct.name, language)} />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {displayGallery.map((image) => (
                  <div key={image} className="hbs-product-image rounded-xl">
                    <img src={image} alt={txt(activeProduct.name, language)} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800/80 sm:text-sm">{t.product.eyebrow}</p>
              <h1 className="mt-2 text-2xl font-black leading-tight sm:mt-3 sm:text-4xl">{txt(activeProduct.name, language)}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">{txt(activeProduct.description, language)}</p>
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                <span className="rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-800 sm:px-4 sm:text-sm">{txt(activeProduct.category, language)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600 sm:px-4 sm:text-sm">{activeProduct.country} / {activeProduct.city}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 sm:px-4 sm:text-sm">{txt(stockText[activeProduct.stockStatus], language)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 sm:rounded-3xl sm:p-4">
              <h2 className="text-lg font-black text-blue-800 sm:text-xl">{txt(activeProduct.priceText, language)}</h2>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-blue-800/90 sm:mt-5 sm:gap-3">
                <p><span className="font-bold text-slate-950">{t.common.store}:</span> {activeProduct.storeName}</p>
                <p><span className="font-bold text-slate-950">{t.common.brand}:</span> {activeProduct.brand}</p>
                <p><span className="font-bold text-slate-950">{t.common.model}:</span> {txt(activeProduct.model, language)}</p>
                <p><span className="font-bold text-slate-950">{t.common.city}:</span> {activeProduct.city}</p>
              </div>
              <div className="mt-5 grid gap-2 sm:mt-6 sm:gap-3">
                <button type="button" onClick={addToCart} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white hover:bg-slate-200 sm:rounded-2xl sm:px-6 sm:py-4">{t.common.addToCart}</button>
                <button type="button" onClick={requestOffer} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black hover:bg-slate-100 sm:rounded-2xl sm:px-6 sm:py-4">{t.common.requestOffer}</button>
                <button type="button" onClick={askQuestion} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black hover:bg-slate-100 sm:rounded-2xl sm:px-6 sm:py-4">{t.common.askStore}</button>
              </div>
            </div>
          </div>
        </section>

        {message && <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 sm:mb-6 sm:rounded-3xl sm:p-5">{message}</div>}

        <section className="mb-4 grid gap-3 sm:mb-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black sm:text-xl">Ürün açıklaması ve kullanım bilgisi</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">Detay</span>
            </div>
            <p className="text-sm leading-6 text-slate-700">{txt(activeProduct.description, language)}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Uyumluluk / kullanım</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">Mağaza onayıyla kesinleştirilir; araç, cihaz veya tesisat ölçüsü kontrol edilir.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Görsel durumu</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">Gerçek görsel yoksa kategoriye uygun temsili görsel kullanılır; canlı sistemde mağaza kendi fotoğrafını yükler.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
            <h2 className="text-lg font-black text-emerald-900 sm:text-xl">Depo / vitrin bağlantısı</h2>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-emerald-900/90">
              {isVirtualDelivery ? (
                <>
                  <p><span className="font-black">Hizmet Modeli:</span> Sanal Mağaza / Adrese Teslimat</p>
                  <p><span className="font-black">Müşteriye açık vitrin:</span> {storefrontNames} (Ülke Genelinde Görünür)</p>
                  <p><span className="font-black">Kural:</span> Sanal depodaki ürünler kargo ile gönderilir veya adreste kurulum & eğitim verilir.</p>
                </>
              ) : (
                <>
                  <p><span className="font-black">İç depo adresi:</span> {internalWarehouseCode}</p>
                  <p><span className="font-black">Müşteriye açık vitrin:</span> {storefrontNames}</p>
                  <p><span className="font-black">Kural:</span> Depo ürünün nerede durduğunu, vitrin müşteriye nerede göründüğünü anlatır.</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] sm:gap-6">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <h2 className="text-xl font-black sm:text-2xl">{t.product.codesTitle}</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:mt-5 sm:gap-3">
              <p><span className="font-bold text-slate-950">{t.common.barcode}:</span> {activeProduct.barcode || "-"}</p>
              <p><span className="font-bold text-slate-950">{t.common.sku}:</span> {activeProduct.sku || "-"}</p>
              <p><span className="font-bold text-slate-950">{t.common.oem}:</span> {activeProduct.oemCode || "-"}</p>
              <p><span className="font-bold text-slate-950">{t.common.manufacturerCode}:</span> {activeProduct.manufacturerCode || "-"}</p>
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:mt-6 sm:rounded-3xl sm:p-5">
              <h3 className="font-black text-amber-800">{t.product.googleVisibility}</h3>
              <p className="mt-2 text-sm leading-6 text-amber-800/90 sm:mt-3">{t.common.seoNotice}</p>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <h2 className="text-xl font-black sm:text-2xl">{t.product.storeDeliveryTitle}</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 sm:mt-5 sm:gap-4">
              <p><span className="font-bold text-slate-950">{t.common.store}:</span> {activeProduct.storeName}</p>
              {isVirtualDelivery ? (
                <>
                  <p><span className="font-bold text-slate-950">{t.common.location}:</span> Türkiye 🇹🇷 & Gürcistan 🇬🇪 Geneli</p>
                  <p><span className="font-bold text-slate-950">{txt(dynamicUi.salesMethodLabel, language)}:</span> Kargolu Gönderim, Elden Teslim, Yerinde Kurulum & Teknik Eğitim</p>
                  <p><span className="font-bold text-slate-950">{txt(dynamicUi.note, language)}:</span> Bu ürün fiziksel bir yerel mağazada raf stoğunda tutulmamaktadır; sipariş üzerine temin edilip doğrudan müşterinin adresinde elden kurulur.</p>
                </>
              ) : (
                <>
                  <p><span className="font-bold text-slate-950">{t.common.location}:</span> {activeProduct.country} / {activeProduct.city}</p>
                  <p><span className="font-bold text-slate-950">{txt(dynamicUi.salesMethodLabel, language)}:</span> {t.product.salesMethod}</p>
                  <p><span className="font-bold text-slate-950">{txt(dynamicUi.note, language)}:</span> {t.product.realSystemNote}</p>
                </>
              )}
            </div>
            <div className="mt-5 sm:mt-6">
              <Link href={`/store/${activeProduct.storeSlug}`} className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-200 sm:rounded-2xl sm:px-6 sm:py-4">{activeProduct.storeName} {t.product.goToStorePage}</Link>
            </div>
          </section>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:mt-6 sm:rounded-[2rem] sm:p-6">
          <h2 className="text-xl font-black sm:text-2xl">{t.product.similarProducts}</h2>
          <div className="mt-4 grid gap-3 sm:mt-6 md:grid-cols-3">
            {similarProducts.map((item) => (
              <Link key={item.slug} href={`/product/${item.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-500 hover:bg-slate-100 sm:rounded-3xl sm:p-5">
                <p className="text-xs text-blue-300 sm:text-sm">{txt(item.category, language)}</p>
                <h3 className="mt-1 font-black sm:mt-2">{txt(item.name, language)}</h3>
                <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">{item.storeName} · {item.city}</p>
                <p className="mt-1 text-sm font-bold text-slate-950 sm:mt-2">{txt(item.priceText, language)}</p>
              </Link>
            ))}
            {similarProducts.length === 0 && <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500 sm:rounded-3xl sm:p-5">{t.product.noSimilarProducts}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
