"use client";

import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LocalizedText, dynamicUi, pickLocalizedText } from "@/lib/i18n/dynamicContent";
import { HbsLanguageCode } from "@/lib/i18n/translations";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";
import { supabase } from "@/lib/supabaseClient";


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
  storePhone?: string;
  storeWhatsapp?: string;
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

const pageTranslations: Record<string, Record<string, string>> = {
  tr: {
    descTitle: "Ürün açıklaması ve kullanım bilgisi",
    detail: "Detay",
    compatibility: "Uyumluluk / kullanım",
    compatibilityDesc: "Mağaza onayıyla kesinleştirilir; araç, cihaz veya tesisat ölçüsü kontrol edilir.",
    visualStatus: "Görsel durumu",
    visualDesc: "Gerçek görsel yoksa kategoriye uygun temsili görsel kullanılır; canlı sistemde mağaza kendi fotoğrafını yükler.",
    warehouseConn: "Depo / vitrin bağlantısı",
    serviceModel: "Hizmet Modeli",
    virtualDelivery: "Sanal Mağaza / Adrese Teslimat",
    openStorefront: "Müşteriye açık vitrin",
    rule: "Kural",
    virtualRuleDesc: "Sanal depodaki ürünler kargo ile gönderilir veya adreste kurulum & eğitim verilir.",
    internalWarehouse: "İç depo adresi",
    physicalRuleDesc: "Depo ürünün nerede durduğunu, vitrin müşteriye nerede göründüğünü anlatır."
  },
  en: {
    descTitle: "Product description and usage",
    detail: "Detail",
    compatibility: "Compatibility / usage",
    compatibilityDesc: "Confirmed upon store approval; vehicle, device, or installation size is checked.",
    visualStatus: "Visual status",
    visualDesc: "If there is no actual image, a representative image matching the category is used; in the live system, the store uploads its own photo.",
    warehouseConn: "Warehouse / storefront connection",
    serviceModel: "Service Model",
    virtualDelivery: "Virtual Store / Address Delivery",
    openStorefront: "Customer-facing storefront",
    rule: "Rule",
    virtualRuleDesc: "Products in virtual warehouse are shipped or installed & trained on-site.",
    internalWarehouse: "Internal warehouse address",
    physicalRuleDesc: "Warehouse shows where the product is kept; storefront shows where it is visible to customers."
  },
  de: {
    descTitle: "Produktbeschreibung und Verwendung",
    detail: "Detail",
    compatibility: "Kompatibilität / Verwendung",
    compatibilityDesc: "Wird nach Shop-Freigabe bestätigt; Fahrzeug-, Geräte- oder Installationsmaß wird geprüft.",
    visualStatus: "Bildstatus",
    visualDesc: "Falls kein echtes Bild vorhanden ist, wird ein passendes Symbolbild verwendet; im Live-System lädt der Shop eigene Fotos hoch.",
    warehouseConn: "Lager- / Schaufensterverbindung",
    serviceModel: "Servicemodell",
    virtualDelivery: "Virtueller Shop / Hauslieferung",
    openStorefront: "Kundenschaufenster",
    rule: "Regel",
    virtualRuleDesc: "Produkte im virtuellen Lager werden per Fracht versandt oder vor Ort installiert & geschult.",
    internalWarehouse: "Interne Lageradresse",
    physicalRuleDesc: "Lager zeigt den Lagerort; Schaufenster zeigt, wo der Kunde das Produkt online sieht."
  },
  ru: {
    descTitle: "Описание товара и использование",
    detail: "Детали",
    compatibility: "Совместимость / использование",
    compatibilityDesc: "Подтверждается магазином; проверяются размеры автомобиля, устройства или установки.",
    visualStatus: "Статус изображения",
    visualDesc: "Если реального фото нет, используется подходящее изображение категории; в живой системе магазин загружает свои фото.",
    warehouseConn: "Связь склада и витрины",
    serviceModel: "Модель обслуживания",
    virtualDelivery: "Виртуальный магазин / Доставка на адрес",
    openStorefront: "Публичная витрина",
    rule: "Правило",
    virtualRuleDesc: "Товары с виртуального склада отправляются почтой или доставляются с установкой и обучением на месте.",
    internalWarehouse: "Внутренний адрес склада",
    physicalRuleDesc: "Склад показывает физическое место хранения; витрина показывает, где товар виден клиенту."
  },
  ka: {
    descTitle: "პროდუქტის აღწერა და გამოყენება",
    detail: "დეტალი",
    compatibility: "თავსებადობა / გამოყენება",
    compatibilityDesc: "დასტურდება მაღაზიის მიერ; მოწმდება ავტომობილის, მოწყობილობის ან მონტაჟის ზომები.",
    visualStatus: "გამოსახულების სტატუსი",
    visualDesc: "თუ რეალური ფოტო არ არის, გამოიყენება კატეგორიის შესაბამისი ფოტო; ცოცხალ სისტემაში მაღაზია თავად ტვირთავს ფოტოს.",
    warehouseConn: "საწყობის / ვიტრინის კავშირი",
    serviceModel: "მომსახურების მოდელი",
    virtualDelivery: "ვირტუალური მაღაზია / ადგილზე მიწოდება",
    openStorefront: "საჯარო ვიტრინა",
    rule: "წესი",
    virtualRuleDesc: "ვირტუალური საწყობის პროდუქტები იგზავნება ფოსტით ან ხდება ადგილზე მონტაჟი და ტრენინგი.",
    internalWarehouse: "საწყობის შიდა მისამართი",
    physicalRuleDesc: "საწყობი აჩვენებს სად ინახება პროდუქტი; ვიტრინა აჩვენებს სად ხედავს მას კლიენტი."
  }
};

function pageTxt(key: string, lang: HbsLanguageCode): string {
  const translationsForLang = pageTranslations[lang] || pageTranslations.en || pageTranslations.tr;
  return translationsForLang[key] || pageTranslations.tr[key] || key;
}

export default function ProductDetailPage() {
  const params = useParams<{ productSlug: string }>();
  const { t, language, isReady } = useHbsLanguage();
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [customLoaded, setCustomLoaded] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<ProductData[]>([]);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isVirtualDelivery = useMemo(() => {
    if (typeof window === "undefined" || !product) return false;
    try {
      const localStoresStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
      const localStores = JSON.parse(localStoresStr);
      const storeObj = localStores.find((st: any) => st.code === product.storeSlug) || (product.storeSlug === "obdtr" ? {
        operatingModel: "virtual_delivery"
      } : null);
      return storeObj?.operatingModel === "virtual_delivery";
    } catch (e) {
      console.error("Error parsing local stores for virtual delivery check", e);
      return false;
    }
  }, [product]);

const memoizedActiveProduct = useMemo<ProductData | null>(() => {
    if (!product) return null;
    
    const names: Record<string, string> = {
      tr: "Autel MX808S Arıza Tespit Cihazı",
      en: "Autel MX808S Diagnostic Scanner",
      de: "Autel MX808S Diagnosegerät",
      ru: "Диагностический автосканер Autel MX808S",
      ka: "Autel MX808S სადიაგნოსტიკო აპარატი"
    };

    const descriptions: Record<string, string> = {
      tr: `Autel MX808S Arıza Tespit Cihazı, günlük servis işlemlerini hızlandırmak, arızaları doğru ve net şekilde tespit etmek isteyen ustalar ve servisler için geliştirilmiş pratik, güçlü ve ekonomik bir diagnostik çözümdür. Kompat yapısı, hızlı arayüzü ve geniş servis fonksiyonları sayesinde MX808S; hem rutin bakım işlemlerinde hem de detaylı sistem kontrollerinde yüksek verim sağlar. "Hızlı bağlan, hızlı teşhis et, doğru çöz" mantığıyla çalışan bu cihaz, servisinizde zaman kaybını minimuma indirir. TEKNİK DONANIM & ÖZELLİKLER:\n• 7.0" dokunmatik ekran (net ve hızlı kullanım)\n• Gelişmiş Servis & Günlük Kullanım özellikleri\n• Yağ sıfırlama, EPB, SAS, DPF, BMS ve diğer 30+ servis sıfırlama işlevi\n• Aktif testler ve tüm sistem teşhisleri\n• Android 11 işletim sistemi\n• Autel MX808S, karmaşık cihazlara ihtiyaç duymadan hızlı ve doğru teşhis yapmak isteyenler için ideal bir çözümdür.`,
      en: `The Autel MX808S Diagnostic Scanner is a practical, powerful, and economical diagnostic solution developed for technicians and workshops wanting to speed up daily service operations and detect faults accurately and clearly. Thanks to its compact structure, fast interface, and wide service functions, the MX808S ensures high efficiency in both routine maintenance and detailed system checks. Operating with the logic of "connect fast, diagnose fast, solve right," this device minimizes time loss in your workshop. TECHNICAL EQUIPMENT & FEATURES:\n• 7.0" touch screen (clear and fast operation)\n• Advanced Service & Daily Use features\n• Oil reset, EPB, SAS, DPF, BMS, and 30+ other service reset functions\n• Active tests and all-system diagnostics\n• Android 11 operating system\n• The Autel MX808S is an ideal solution for those who want fast and accurate diagnosis without needing complex equipment.`,
      de: `Das Autel MX808S Diagnosegerät ist eine praktische, leistungsstarke und wirtschaftliche Diagnoselösung für Techniker und Werkstätten, die alltägliche Servicearbeiten beschleunigen und Fehler präzise erkennen möchten. Dank seines kompakten Designs, der schnellen Benutzeroberfläche und der umfangreichen Servicefunktionen bietet das MX808S eine hohe Effizienz sowohl bei routinemäßigen Wartungsarbeiten als auch bei detaillierten Systemprüfungen. Getreu dem Motto "Schnell verbinden, schnell diagnostizieren, richtig lösen" minimiert dieses Gerät Zeitverluste in Ihrer Werkstatt. TECHNISCHE AUSSTATTUNG & MERKMALE:\n• 7,0" Touchscreen (klare und schnelle Bedienung)\n• Fortschrittliche Service- und Alltagsfunktionen\n• Ölrückstellung, EPB, SAS, DPF, BMS und über 30 weitere Servicefunktionen\n• Aktive Tests und vollständige Systemdiagnose\n• Android 11 Betriebssystem\n• Das Autel MX808S ist die ideale Lösung für alle, die eine schnelle und präzise Diagnose wünschen, ohne auf komplizierte Geräte angewiesen zu sein.`,
      ru: `Автомобильный диагностический сканер Autel MX808S — это практичное, мощное и экономичное диагностическое решение, разработанное для мастеров и автосервисов, стремящихся ускорить ежедневные сервисные операции и точно определять неисправности. Благодаря компактной конструкции, быстрому интерфейсу и широким сервисным функциям MX808S обеспечивает высокую эффективность как при регламентном обслуживании, так и при детальной проверке систем. Устройство работает по принципу «быстрое подключение, быстрая диагностика, правильное решение», сводя к минимуму потери времени. ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ И ОСОБЕННОСТИ:\n• 7,0-дюймовый сенсорный экран (четкое и быстрое управление)\n• Расширенные сервисные функции\n• Сброс масла, EPB, SAS, DPF, BMS и более 30 других сервисных функций\n• Активные тесты и диагностика всех систем\n• Операционная система Android 11\n• Autel MX808S — идеальное решение для быстрого и точного поиска неисправностей.`,
      ka: `Autel MX808S სადიაგნოსტიკო აპარატი არის პრაქტიკული, ძლიერი და ეკონომიური სადიაგნოსტიკო გადაწყვეტა, რომელიც შემუშავებულია ხელოსნებისა და ავტოსერვისებისთვის, რომლებსაც სურთ ყოველდღიური სერვისის ოპერაციების დაჩქარება და ხარვეზების ზუსტად დადგენა. კომპაქტური დიზაინის, სწრაფი ინტერფეისისა და ფართო სერვისული ფუნქციების წყალობით, MX808S უზრუნველყოფს მაღალ ეფექტურობას როგორც რუტინული ტექნიკური მომსახურების, ასევე სისტემის დეტალური შემოწმებისას. მოწყობილობა მუშაობს პრინციპით „სწრაფი კავშირი, სწრაფი დიაგნოსტიკა, სწორი გადაწყვეტა“, რაც მინიმუმამდე ამცირებს დროის კარგვას. ტექნიკური მახასიათებლები და ფუნქციები:\n• 7.0" სენსორული ეკრანი (ნათელი და სწრაფი გამოყენება)\n• გაფართოებული სერვისის ფუნქციები\n• ზეთის ჩამოყრა, EPB, SAS, DPF, BMS და 30-ზე მეტი სხვა სერვისული ფუნქცია\n• აქტიური ტესტები და ყველა სისტემის დიაგნოსტიკა\n• Android 11 ოპერაციული სისტემა\n• Autel MX808S არის იდეალური გადაწყვეტა ყველასთვის, ვისაც სურს სწრაფი და ზუსტი დიაგნოსტიკა.`
    };

    const isAutel = product.sku === "AUTEL-MX808S" || product.slug === "obdtr-autel-mx808s" || product.name.tr?.includes("Autel MX808S");
    
    if (isAutel) {
      return {
        ...product,
        name: {
          ...product.name,
          [language]: names[language] || names.en || product.name.en || product.name.tr
        },
        description: {
          ...product.description,
          [language]: descriptions[language] || descriptions.en || product.description.en || product.description.tr
        }
      };
    }
    return product;
  }, [product, language]);

  useEffect(() => {
    console.log("HBS_DEBUG: Product detail useEffect triggered", { productSlug: params.productSlug, isReady });
    if (!isReady || !params.productSlug) return;
    
    // 1. Static demo products check
    const staticProd = demoProducts.find((item) => item.slug === params.productSlug);
    if (staticProd) {
      setProduct(staticProd);
      setCustomLoaded(true);
      return;
    }

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    console.log("HBS_DEBUG: Supabase configuration status:", { isSupabaseConfigured, url: process.env.NEXT_PUBLIC_SUPABASE_URL });

    if (isSupabaseConfigured) {
      // Safely check if the slug is a valid UUID to prevent PostgREST 400 error on type cast
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.productSlug);
      
      let query = supabase.from("offerable_items").select("*, companies(*)");
      
      if (isUuid) {
        query = query.or(`id.eq.${params.productSlug},code.eq.${params.productSlug}`);
      } else {
        query = query.eq("code", params.productSlug);
      }

      console.log("HBS_DEBUG: Querying Supabase...", { isUuid });

      query.then(({ data, error }) => {
        console.log("HBS_DEBUG: Supabase query resolved:", { data, error });
        if (data && data.length > 0 && !error) {
          const item = data[0];
          const mapped: ProductData = {
            slug: item.id,
            name: { tr: item.name, en: item.name, de: item.name, ru: item.name, ka: item.name },
            brand: item.brand || "Genel",
            model: { tr: item.code || "Genel", en: item.code || "General" },
            category: { tr: item.category || "Diğer", en: item.category || "Other" },
            storeName: item.companies?.name || "HBS Mağaza",
            storeSlug: item.companies?.code || "unknown",
            country: item.companies?.country || "Türkiye",
            city: item.companies?.city || "İstanbul",
            description: { tr: item.description || "", en: item.description || "", de: item.description || "", ru: item.description || "", ka: item.description || "" },
            priceText: {
              tr: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Teklif isteyin",
              en: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Request quote",
              de: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Anfrage erforderlich",
              ru: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Цена по запросу",
              ka: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "ფასი მოთხოვნით"
            },
            imageUrl: item.photo_urls?.[0] || "/product-images/diagnostic-scanner.svg",
            gallery: item.photo_urls || ["/product-images/diagnostic-scanner.svg"],
            priceValue: item.sale_price ? parseFloat(item.sale_price) : undefined,
            currency: item.currency || "GEL",
            stockStatus: item.sale_price ? "inStock" : "quote",
            sku: item.code,
            barcode: item.barcode || item.code || "",
            storePhone: item.companies?.phone || undefined,
            storeWhatsapp: item.companies?.whatsapp || undefined
          };
          setProduct(mapped);

          // Fetch similar products from same store
          supabase
            .from("offerable_items")
            .select("*, companies(*)")
            .eq("company_id", item.company_id)
            .neq("id", item.id)
            .eq("is_visible_in_storefront", true)
            .limit(3)
            .then(({ data: similarData, error: similarErr }) => {
              if (similarData && !similarErr) {
                const mappedSimilar: ProductData[] = similarData.map((sim: any) => ({
                  slug: sim.id,
                  name: { tr: sim.name, en: sim.name, de: sim.name, ru: sim.name, ka: sim.name },
                  brand: sim.brand || "Genel",
                  model: { tr: sim.code || "Genel", en: sim.code || "General" },
                  category: { tr: sim.category || "Diğer", en: sim.category || "Other" },
                  storeName: sim.companies?.name || "HBS Mağaza",
                  storeSlug: sim.companies?.code || "unknown",
                  country: sim.companies?.country || "Türkiye",
                  city: sim.companies?.city || "İstanbul",
                  description: { tr: sim.description || "", en: sim.description || "", de: sim.description || "", ru: sim.description || "", ka: sim.description || "" },
                  priceText: {
                    tr: sim.sale_price ? `${sim.sale_price} ${sim.currency || "GEL"}` : "Teklif isteyin",
                    en: sim.sale_price ? `${sim.sale_price} ${sim.currency || "GEL"}` : "Request quote",
                    de: sim.sale_price ? `${sim.sale_price} ${sim.currency || "GEL"}` : "Anfrage erforderlich",
                    ru: sim.sale_price ? `${sim.sale_price} ${sim.currency || "GEL"}` : "Цена по запросу",
                    ka: sim.sale_price ? `${sim.sale_price} ${sim.currency || "GEL"}` : "ფასი მოთხოვნით"
                  },
                  imageUrl: sim.photo_urls?.[0] || "/product-images/diagnostic-scanner.svg",
                  gallery: sim.photo_urls || ["/product-images/diagnostic-scanner.svg"],
                  priceValue: sim.sale_price ? parseFloat(sim.sale_price) : undefined,
                  currency: sim.currency || "GEL",
                  stockStatus: sim.sale_price ? "inStock" : "quote",
                  sku: sim.code,
                  barcode: sim.barcode || sim.code || "",
                  storePhone: sim.companies?.phone || undefined,
                  storeWhatsapp: sim.companies?.whatsapp || undefined
                }));
                setSimilarProducts(mappedSimilar);
              }
            });

          setCustomLoaded(true);
        } else {
          if (error) console.error("Supabase product load error:", error);
          loadFromLocalStorage();
        }
      });
    } else {
      loadFromLocalStorage();
    }

    // 2. Custom local storage products check
    function loadFromLocalStorage() {
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

            // Set similar local storage products
            const localSimilars = parsedProducts
              .filter(p => p.id !== found.id)
              .slice(0, 3)
              .map(sim => ({
                slug: sim.id,
                name: { tr: sim.name, en: sim.name, de: sim.name, ru: sim.name, ka: sim.name },
                brand: sim.brand || "Genel",
                model: { tr: sim.model || "Genel", en: sim.model || "General" },
                category: { tr: sim.category || "Diğer", en: sim.category || "Other" },
                storeName: matchingStore.name,
                storeSlug: matchingStore.code,
                country: matchingStore.city.toLowerCase().includes("batum") ? "Georgia" : "Türkiye",
                city: matchingStore.city || "İstanbul",
                description: { tr: sim.description || "", en: sim.description || "" },
                priceText: {
                  tr: sim.pricingMode === "quote" ? "Teklif isteyin" : `${sim.salePrice || "0"} ${sim.currency || "GEL"}`,
                  en: sim.pricingMode === "quote" ? "Request quote" : `${sim.salePrice || "0"} ${sim.currency || "GEL"}`
                },
                imageUrl: sim.imageUrl || "/product-images/diagnostic-scanner.svg",
                gallery: [sim.imageUrl || "/product-images/diagnostic-scanner.svg"],
                priceValue: sim.salePrice ? parseFloat(sim.salePrice) : undefined,
                currency: sim.currency || "GEL",
                stockStatus: sim.pricingMode === "quote" ? "quote" : ("inStock" as StockKey),
                barcode: sim.barcode,
                sku: sim.sku,
                oemCode: sim.oemCode
              }));
            setSimilarProducts(localSimilars);
          }
        }
      } catch (e) {
        console.error("Error loading product detail from localStorage", e);
      }
      setCustomLoaded(true);
    }
  }, [params.productSlug, isReady]);

  if (!isReady || !customLoaded) return <main className="min-h-screen bg-slate-50" />;

  if (!product) {
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    return (
      <main className="min-h-screen hbs-market-page px-6 py-8 text-slate-950">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-black">{t.product.productNotFound}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{t.product.productNotFoundText}</p>
          <Link href="/customer" className="mt-6 rounded-2xl bg-white px-6 py-3 font-black text-slate-950 hover:bg-slate-200">{t.product.goToCustomerPortal}</Link>
          
          {/* HBS Teknik Teşhis Paneli - Premium DX */}
          <div className="mt-12 mx-auto w-full max-w-xl rounded-[1.5rem] border border-red-200 bg-red-50/40 p-5 text-left shadow-lg backdrop-blur">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-800 block mb-3">⚙️ HBS TEKNİK TEŞHİS & ENTEGRASYON PANELİ</span>
            <div className="text-xs leading-relaxed text-slate-800 font-bold space-y-2">
              <p>• <b>Aranan Ürün SKU/ID (slug):</b> <code className="bg-white px-2 py-0.5 rounded border border-red-200 text-red-750 font-black">{params.productSlug || "Parametre Boş"}</code></p>
              <p>• <b>Supabase Bağlantı Durumu:</b> <span className={isSupabaseConfigured ? "text-emerald-700 font-extrabold" : "text-rose-700 font-extrabold"}>{isSupabaseConfigured ? "✓ AKTİF (Bağlantı Başarılı)" : "✗ PASİF (LocalStorage Modu)"}</span></p>
              <p>• <b>Aktif Dil Seçimi:</b> <code className="bg-white px-2 py-0.5 rounded border border-red-200">{language}</code> (Kullanıma Hazır: {isReady ? "Evet" : "Hayır"})</p>
            </div>
            <div className="mt-4 border-t border-red-200 pt-3 text-[11px] leading-5 text-slate-600 font-semibold">
              💡 <b>Hata Giderme Adımı:</b> Eğer yukarıdaki bağlantı durumu <span className="text-rose-700 font-extrabold">PASİF</span> görünüyorsa veya yeni tanımlamalarınız yansımadıysa, lütfen terminaldeki yerel Next.js geliştirici sunucunuzu durdurup <b>npm run dev</b> komutuyla yeniden başlatın. <code>.env.local</code> dosyasındaki yeni tanımlamalar ancak sunucu yeniden başlatıldığında geçerli olur.
            </div>
          </div>
        </div>
      </main>
    );
  }

    const activeProduct = memoizedActiveProduct!;
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

  function checkProfileAndExecute(action: () => void) {
    if (!requireLogin()) return;
    const userStr = window.localStorage.getItem("hbs-current-user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        const name = userObj.displayName || "";
        const phone = userObj.phone || "";
        const city = userObj.city || "";
        
        if (!name.trim() || !phone.trim() || !city.trim()) {
          setProfileName(name);
          setProfilePhone(phone);
          setProfileCity(city);
          setPendingAction(() => action);
          setProfileModalOpen(true);
          return;
        }
      } catch (e) {
        console.error("Error parsing current user", e);
      }
    }
    action();
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim() || !profileCity.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const userStr = window.localStorage.getItem("hbs-current-user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.displayName = profileName;
        userObj.phone = profilePhone;
        userObj.city = profileCity;
        window.localStorage.setItem("hbs-current-user", JSON.stringify(userObj));

        const isSupabaseConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";
        
        if (isSupabaseConfigured) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("customers").upsert({
              id: user.id,
              full_name: profileName,
              phone: profilePhone,
              city: profileCity,
              email: user.email
            });
          }
        }
      } catch (err) {
        console.error("Error saving complete profile:", err);
      }
    }

    setProfileModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }

  function addToCart() {
    checkProfileAndExecute(() => {
      setMessage(`${txt(activeProduct.name, language)} ${t.product.addedToCart}`);
    });
  }
  
  function askQuestion() {
    checkProfileAndExecute(() => {
      setMessage(`${txt(activeProduct.name, language)} ${t.product.questionDemo}`);
    });
  }
  
  function requestOffer() {
    checkProfileAndExecute(() => {
      setMessage(`${txt(activeProduct.name, language)} ${t.product.offerDemo}`);
    });
  }

  return (
    <main className="min-h-screen hbs-market-page px-3 py-3 text-slate-950 sm:px-6 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="mx-auto max-w-[1800px]">
        <header className="mb-4 flex items-center justify-between gap-2 sm:mb-8">
          <Link href="/" className="shrink-0 text-sm font-black tracking-wide sm:text-2xl">HBS</Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <CompactLanguageSwitcher />
            <Link href="/requests" className="hidden rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-750 px-3 py-2 text-xs font-bold hover:bg-indigo-105 sm:inline-flex sm:px-4 sm:text-sm transition">📢 {language === "tr" ? "İlan Panosu" : language === "de" ? "Ausschreibungen" : "Bulletin Board"}</Link>
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

              {(activeProduct.storePhone || activeProduct.storeWhatsapp) && (
                <div className="mt-4 border-t border-blue-200/50 pt-3 space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">
                    📞 DOĞRUDAN MAĞAZA İLE İLETİŞİM
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {activeProduct.storePhone && (
                      <a
                        href={`tel:${activeProduct.storePhone}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
                      >
                        📞 Hızlı Ara
                      </a>
                    )}
                    {activeProduct.storeWhatsapp && (
                      <a
                        href={`https://wa.me/${activeProduct.storeWhatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-bold text-green-800 hover:bg-green-100 transition shadow-sm"
                      >
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {message && <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 sm:mb-6 sm:rounded-3xl sm:p-5">{message}</div>}

        <section className="mb-4 grid gap-3 sm:mb-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black sm:text-xl">{pageTxt("descTitle", language)}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{pageTxt("detail", language)}</span>
            </div>
            <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">{txt(activeProduct.description, language)}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{pageTxt("compatibility", language)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{pageTxt("compatibilityDesc", language)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{pageTxt("visualStatus", language)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{pageTxt("visualDesc", language)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
            <h2 className="text-lg font-black text-emerald-900 sm:text-xl">{pageTxt("warehouseConn", language)}</h2>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-emerald-900/90">
              {isVirtualDelivery ? (
                <>
                  <p><span className="font-black">{pageTxt("serviceModel", language)}:</span> {pageTxt("virtualDelivery", language)}</p>
                  <p><span className="font-black">{pageTxt("openStorefront", language)}:</span> {storefrontNames} ({language === "tr" ? "Ülke Genelinde Görünür" : language === "de" ? "Landesweit sichtbar" : "Visible nationwide"})</p>
                  <p><span className="font-black">{pageTxt("rule", language)}:</span> {pageTxt("virtualRuleDesc", language)}</p>
                </>
              ) : (
                <>
                  <p><span className="font-black">{pageTxt("internalWarehouse", language)}:</span> {internalWarehouseCode}</p>
                  <p><span className="font-black">{pageTxt("openStorefront", language)}:</span> {storefrontNames}</p>
                  <p><span className="font-black">{pageTxt("rule", language)}:</span> {pageTxt("physicalRuleDesc", language)}</p>
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

      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/80 p-7 shadow-2xl backdrop-blur-2xl transition-all dark:border-slate-800 dark:bg-slate-900/90 text-slate-950 dark:text-white">
            {/* Header */}
            <div className="mb-5 text-center">
              <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-800 dark:text-blue-300">
                🔒 PROFİL DOĞRULAMA
              </span>
              <h3 className="mt-3 text-xl font-black">Profil Bilgilerinizi Tamamlayın</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Alışverişe devam edebilmek için lütfen ad-soyad, telefon ve şehir bilgilerinizi girin. Bu bilgiler fatura ve lojistik aşamalarında kullanılacaktır.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Adınız Soyadınız *</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Telefon Numaranız *</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="+90 532 000 00 00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Bulunduğunuz Şehir *</label>
                <input
                  type="text"
                  required
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="İstanbul"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-3 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 py-3 text-sm font-black text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition duration-300"
                >
                  Kaydet & Devam Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
