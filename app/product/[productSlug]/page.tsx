"use client";

import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LocalizedText, dynamicUi, pickLocalizedText, translateProductField, parseLocalizedField } from "@/lib/i18n/dynamicContent";
import { HbsLanguageCode } from "@/lib/i18n/translations";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";
import { sanitizeWhatsAppNumber } from "@/lib/phoneUtils";
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

function txt(
  value: LocalizedText | string,
  language: HbsLanguageCode,
  fieldType: 'name' | 'category' | 'description' = 'name'
) {
  return translateProductField(value, fieldType, language);
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
    virtualDelivery: "Merkez Depo / Adrese Teslimat",
    openStorefront: "Müşteriye açık vitrin",
    rule: "Kural",
    virtualRuleDesc: "Merkez depodaki ürünler kargo ile gönderilir veya adreste kurulum & eğitim verilir.",
    internalWarehouse: "İç depo adresi",
    physicalRuleDesc: "Depo ürünün nerede durduğunu, vitrin müşteriye nerede göründüğünü anlatır.",
    liveB2bNegotiation: "Canlı B2B Pazarlık Odası",
    requestQuote: "Özel Teklif İste & Kilitle",
    askRepresentative: "Temsilciye Soru Sor",
    exchangeHedged: "🛡️ HBS Kur Korumalı Fiyat",
    originalBasePrice: "Orijinal Taban Fiyat",
    rawRate: "Ham Çevrim",
    exchangeHedging: "Döviz Koruma Kalkanı",
    rateLockedGuarantee: "* Sınır ötesi kur riskine karşı 24 saat boyunca HBS garantisiyle kilitlenmiştir.",
    viewFullScreen: "Tam Ekran Gör",
    clickToViewFull: "Resmi tam ekran görmek için tıklayın",
    productNotFound: "Ürün Bulunamadı",
    productNotFoundText: "Aradığınız ürün sistemde kayıtlı değil veya yayından kaldırılmış."
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
    virtualDelivery: "Central Warehouse / Address Delivery",
    openStorefront: "Customer-facing storefront",
    rule: "Rule",
    virtualRuleDesc: "Products in central warehouse are shipped or installed & trained on-site.",
    internalWarehouse: "Internal warehouse address",
    physicalRuleDesc: "Warehouse shows where the product is kept; storefront shows where it is visible to customers.",
    liveB2bNegotiation: "B2B Live Negotiation",
    requestQuote: "Request Custom Quote",
    askRepresentative: "Ask Representative",
    exchangeHedged: "🛡️ HBS Exchange Hedged",
    originalBasePrice: "Original Base Price",
    rawRate: "Raw Rate",
    exchangeHedging: "Exchange Hedging",
    rateLockedGuarantee: "* Locked with HBS cross-border exchange rate protection guarantee for 24h.",
    viewFullScreen: "View Full Screen",
    clickToViewFull: "Click to view full screen",
    productNotFound: "Product Not Found",
    productNotFoundText: "The product you are looking for is not registered or has been removed."
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
    virtualDelivery: "Zentrallager / Hauslieferung",
    openStorefront: "Kundenschaufenster",
    rule: "Regel",
    virtualRuleDesc: "Produkte im Zentrallager werden per Fracht versandt oder vor Ort installiert & geschult.",
    internalWarehouse: "Interne Lageradresse",
    physicalRuleDesc: "Lager zeigt den Lagerort; Schaufenster zeigt, wo der Kunde das Produkt online sieht.",
    liveB2bNegotiation: "B2B Live-Verhandlung",
    requestQuote: "Spezifisches Angebot anfragen",
    askRepresentative: "Vertreter fragen",
    exchangeHedged: "🛡️ HBS Wechselkurs-gesichert",
    originalBasePrice: "Original-Basispreis",
    rawRate: "Roh-Kurs",
    exchangeHedging: "Wechselkurssicherung",
    rateLockedGuarantee: "* Für 24 Stunden mit der HBS-Garantie gegen grenzüberschreitende Wechselkursrisiken gesichert.",
    viewFullScreen: "Vollbild anzeigen",
    clickToViewFull: "Klicken Sie hier, um das Bild im Vollbildmodus anzuzeigen",
    productNotFound: "Produkt nicht gefunden",
    productNotFoundText: "Das gesuchte Produkt ist nicht registriert oder wurde entfernt."
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
    virtualDelivery: "Центральный склад / Доставка на адрес",
    openStorefront: "Публичная витрина",
    rule: "Правило",
    virtualRuleDesc: "Товары с центрального склада отправляются почтой или доставляются с установкой и обучением на месте.",
    internalWarehouse: "Внутренний адрес склада",
    physicalRuleDesc: "Склад показывает физическое место хранения; витрина показывает, где товар виден клиенту.",
    liveB2bNegotiation: "Онлайн B2B торги",
    requestQuote: "Запросить цену",
    askRepresentative: "Спросить представителя",
    exchangeHedged: "🛡️ HBS Защищенный курс",
    originalBasePrice: "Оригинальная базовая цена",
    rawRate: "Чистый курс",
    exchangeHedging: "Защита от колебаний курса",
    rateLockedGuarantee: "* Заблокировано на 24 часа с гарантией защиты от колебаний курса HBS.",
    viewFullScreen: "На весь экран",
    clickToViewFull: "Нажмите, чтобы просмотреть во весь экран",
    productNotFound: "Товар не найден",
    productNotFoundText: "Товар не найден или удален."
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
    virtualDelivery: "ცენტრალური საწყობი / ადგილზე მიწოდება",
    openStorefront: "საჯარო ვიტრინა",
    rule: "წესი",
    virtualRuleDesc: "ცენტრალური საწყობის პროდუქტები იგზავნება ფოსტით ან ხდება ადგილზე მონტაჟი და ტრენინგი.",
    internalWarehouse: "საწყობის შიდა მისამართი",
    physicalRuleDesc: "საწყობი აჩვენებს სად ინახება პროდუქტი; ვიტრინა აჩვენებს სად ხედავს მას კლიენტი.",
    liveB2bNegotiation: "B2B ცოცხალი მოლაპარაკება",
    requestQuote: "მოითხოვეთ ფასი",
    askRepresentative: "კითხვის დასმა წარმომადგენელთან",
    exchangeHedged: "🛡️ HBS კურსით დაცული",
    originalBasePrice: "ორიგინალი საბაზისო ფასი",
    rawRate: "სუფთა კურსი",
    exchangeHedging: "ვალუტის კურსის დაცვა",
    rateLockedGuarantee: "* დაბლოკილია 24 საათით HBS-ის კურსის დაცვის გარანტიით.",
    viewFullScreen: "სრულ ეკრანზე ნახვა",
    clickToViewFull: "დააწკაპუნეთ სრულ ეკრანზე სანახავად",
    productNotFound: "პროდუქტი ვერ მოიძებნა",
    productNotFoundText: "პროდუქტი არ არის რეგისტრირებული ან წაშლილია."
  }
};

function pageTxt(key: string, lang: HbsLanguageCode): string {
  const translationsForLang = pageTranslations[lang] || pageTranslations.en || pageTranslations.tr;
  return translationsForLang[key] || pageTranslations.tr[key] || key;
}

const virtualDeliveryTranslations: Record<string, Record<string, string>> = {
  tr: {
    bulletinBoard: "İlan Panosu",
    findWhatYouWantPrompt: "Aradığınızı bulamadıysanız, ilan bırakın, insanlar ve işletmeler size ulaşsın",
    directContact: "📞 DOĞRUDAN MAĞAZA İLE İLETİŞİM",
    quickCall: "Telefon",
    visibleNationwide: "Ülke Genelinde Görünür",
    location: "Türkiye 🇹🇷 & Gürcistan 🇬🇪 Geneli",
    salesMethod: "Kargolu Gönderim, Elden Teslim, Yerinde Kurulum & Teknik Eğitim",
    note: "Bu ürün fiziksel bir yerel mağazada raf stoğunda tutulmamaktadır; sipariş üzerine temin edilip doğrudan müşterinin adresinde elden kurulur.",
    obdtrSalesMethod: "Türkiye'nin ve Gürcistan'ın her yerine ödeme gerçekleştikten sonra aynı gün kargoda...",
    afterSalesService: "Satış Sonrası Hizmet",
    obdtrAfterSales: "Uzaktan güncelleme, Cihaz hatalarına karşı 2 yıl garanti, Tamir ve 2. el satış."
  },
  en: {
    bulletinBoard: "Bulletin Board",
    findWhatYouWantPrompt: "Didn't find what you were looking for? Post an ad, and let people and businesses reach you",
    directContact: "📞 DIRECT CONTACT WITH STORE",
    quickCall: "Phone",
    visibleNationwide: "Visible nationwide",
    location: "Turkey 🇹🇷 & Georgia 🇬🇪 Nationwide",
    salesMethod: "Shipping, Hand Delivery, On-site Installation & Technical Training",
    note: "This product is not kept in physical stock in a local store; it is procured upon order and installed directly at the customer's address.",
    obdtrSalesMethod: "Same-day shipping to anywhere in Turkey and Georgia after payment is completed...",
    afterSalesService: "After-Sales Service",
    obdtrAfterSales: "Remote update, 2-year warranty against device faults, repair and second-hand sales.",
  },
  de: {
    bulletinBoard: "Ausschreibungen",
    findWhatYouWantPrompt: "Haben Sie nicht gefunden, was Sie suchen? Schalten Sie eine Anzeige, damit Menschen und Unternehmen Sie erreichen",
    directContact: "📞 DIREKTER KONTAKT MIT SHOP",
    quickCall: "Telefon",
    visibleNationwide: "Landesweit sichtbar",
    location: "Türkei 🇹🇷 & Georgien 🇬🇪 Landesweit",
    salesMethod: "Frachtversand, Handlieferung, Vor-Ort-Installation & Technisches Training",
    note: "Dieses Produkt wird nicht in einer physischen Filiale gelagert; es wird auf Bestellung beschafft und direkt an der Adresse des Kunden installiert.",
    obdtrSalesMethod: "Versand am selben Tag überall in die Türkei und nach Georgien nach Zahlungseingang...",
    afterSalesService: "After-Sales-Service",
    obdtrAfterSales: "Fern-Update, 2 Jahre Garantie auf Gerätefehler, Reparatur und Gebrauchtverkauf.",
  },
  ru: {
    bulletinBoard: "Доска объявлений",
    findWhatYouWantPrompt: "Не нашли то, что искали? Разместите объявление, чтобы люди и компании могли связаться с вами",
    directContact: "📞 ПРЯМАЯ СВЯЗЬ С МАГАЗИНОМ",
    quickCall: "Телефон",
    visibleNationwide: "Видно по всей стране",
    location: "Турция 🇹🇷 и Грузия 🇬🇪 по всей стране",
    salesMethod: "Доставка почтой, ручная доставка, установка на месте и обучение",
    note: "Этот товар не хранится на физическом складе в местном магазине; он поставляется под заказ и устанавливается прямо по адресу клиента.",
    obdtrSalesMethod: "Отправка в тот же день в любую точку Турции и Грузии после оплаты...",
    afterSalesService: "Послепродажное обслуживание",
    obdtrAfterSales: "Удаленное обновление, 2 года гарантии на дефекты устройства, ремонт и продажа б/у.",
  },
  ka: {
    bulletinBoard: "განცხადებების დაფა",
    findWhatYouWantPrompt: "ვერ იპოვეთ ის, რაც ეძებდით? განათავსეთ განცხადება და ხალხი და ბიზნესი დაგიკავშირდებათ",
    directContact: "📞 პირდაპირი კავშირი მაღაზიასთან",
    quickCall: "ტელეფონი",
    visibleNationwide: "ხილვადია მთელ ქვეყანაში",
    location: "თურქეთი 🇹🇷 და საქართველო 🇬🇪 მთელ ქვეყანაში",
    salesMethod: "მიწოდება ფოსტით, ადგილზე ჩაბარება, მონტაჟი და ტექნიკური ტრენინგი",
    note: "ეს პროდუქტი არ ინახება ადგილობრივი მაღაზიის ფიზიკურ საწყობში; იგი მოეწოდება შეკვეთით და მონტაჟდება პირდაპირ კლიენტის მისამართზე.",
    obdtrSalesMethod: "იგივე დღეს გაგზავნა თურქეთსა და საქართველოში გადახდის დასრულებისთანავე...",
    afterSalesService: "გაყიდვის შემდგომი მომსახურება",
    obdtrAfterSales: "დისტანციური განახლება, 2 წლიანი გარანტია მოწყობილობის ხარვეზებზე, შეკეთება და მეორადი გაყიდვა."
  }
};

function getLocalText(key: string, lang: HbsLanguageCode): string {
  const translationsForLang = virtualDeliveryTranslations[lang] || virtualDeliveryTranslations.en || virtualDeliveryTranslations.tr;
  return translationsForLang[key] || virtualDeliveryTranslations.tr[key] || key;
}

export default function ProductDetailPage() {
  const params = useParams<{ productSlug: string }>() || { productSlug: "" };
  const { t, language, isReady } = useHbsLanguage();
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState<ProductData | null>(null);
  const handleWhatsAppCheckout = () => {
    const activeLang = language || "tr";
    const nameText = activeProduct ? (activeProduct.name[activeLang] || activeProduct.name.tr) : "";
    const priceText = activeProduct && activeProduct.priceValue 
      ? `${activeProduct.priceValue} ${activeProduct.currency}` 
      : (activeProduct ? txt(activeProduct.priceText, activeLang) : "");

    const helloMsg = activeLang === "tr" ? "Merhaba! HBS üzerinden sipariş vermek istiyorum:" :
                     activeLang === "de" ? "Hallo! Ich möchte über HBS bestellen:" :
                     activeLang === "ru" ? "Здравствуйте! Я хочу сделать заказ через HBS:" :
                     activeLang === "ka" ? "გამარჯობა! მსურს შეკვეთის გაფორმება HBS-ის საშუალებით:" :
                     "Hello! I would like to place an order via HBS:";

    const itemLabel = activeLang === "tr" ? "Ürün" :
                      activeLang === "de" ? "Produkt" :
                      activeLang === "ru" ? "Товар" :
                      activeLang === "ka" ? "პროდუქტი" :
                      "Product";

    const modelLabel = activeLang === "tr" ? "Model" :
                       activeLang === "de" ? "Modell" :
                       activeLang === "ru" ? "Модель" :
                       activeLang === "ka" ? "მოდელი" :
                       "Model";

    const brandLabel = activeLang === "tr" ? "Marka" :
                       activeLang === "de" ? "Marke" :
                       activeLang === "ru" ? "Бренд" :
                       activeLang === "ka" ? "ბრენდი" :
                       "Brand";

    const priceLabel = activeLang === "tr" ? "Fiyat" :
                       activeLang === "de" ? "Preis" :
                       activeLang === "ru" ? "Цена" :
                       activeLang === "ka" ? "ფასი" :
                       "Price";

    const locationLabelText = activeLang === "tr" ? "Konum" :
                              activeLang === "de" ? "Standort" :
                              activeLang === "ru" ? "Местоположение" :
                              activeLang === "ka" ? "მდებარეობა" :
                              "Location";

    const closingMsg = activeLang === "tr" ? "Bu ürün için sevkiyat ve ödeme detaylarını görüşebilir miyiz?" :
                       activeLang === "de" ? "Können wir die Versand- und Zahlungsdetails für dieses Produkt besprechen?" :
                       activeLang === "ru" ? "Можем ли мы обсудить детали доставки и оплаты этого товара?" :
                       activeLang === "ka" ? "შეგვიძლია განვიხილოთ ამ პროდუქტის მიწოდებისა და გადახდის დეტალები?" :
                       "Can we discuss the shipping and payment details for this product?";

    const messageText = encodeURIComponent(
      `${helloMsg}\n\n` +
      `📦 ${itemLabel}: ${nameText}\n` +
      `🏷️ ${modelLabel}: ${activeProduct ? txt(activeProduct.model, activeLang) : ""} / ${brandLabel}: ${activeProduct ? activeProduct.brand : ""}\n` +
      `💰 ${priceLabel}: ${priceText}\n` +
      `📍 ${locationLabelText}: ${activeProduct ? activeProduct.city : ""}, ${activeProduct ? activeProduct.country : ""}\n\n` +
      `${closingMsg}`
    );

    const targetNumber = (activeProduct && activeProduct.storeWhatsapp) || "+905320000000";
    const cleanNumber = targetNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}?text=${messageText}`, "_blank");
  };
  const [customLoaded, setCustomLoaded] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<ProductData[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  console.log("HBS_DEBUG: ProductDetailPage rendering", {
    productSlug: params.productSlug,
    isReady,
    customLoaded,
    productSlugState: product?.slug
  });

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // B2B Canlı Pazarlık & Teklif Kilitleme Odası (Negotiation Sandbox) States
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "rep" | "customer"; text: string; time: string }>>([]);
  const [isDealLocked, setIsDealLocked] = useState(false);
  const [lockedOfferCode, setLockedOfferCode] = useState("");
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);
  const [inputText, setInputText] = useState("");

  const isVirtualDelivery = useMemo(() => {
    if (typeof window === "undefined" || !product) return false;
    try {
      const localStoresStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
      const localStores = JSON.parse(localStoresStr);
      const storeObj = localStores.find((st: any) => st.code === product.storeSlug) || (product.storeSlug === "obdtr" ? {
        operatingModel: "virtual_delivery"
      } : null);
      const isAllCities = (product.city || "").toLowerCase().includes("tüm şehirler") || (product.city || "").toLowerCase().includes("all cities") || (product.city || "").toLowerCase().includes("her yer");
      return isAllCities || storeObj?.operatingModel === "virtual_delivery";
    } catch (e) {
      console.error("Error parsing local stores for virtual delivery check", e);
      return false;
    }
  }, [product]);

  const localSettings = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem("hbs-company-settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing hbs-company-settings", e);
    }
    return null;
  }, []);



  const storeInfo = useMemo(() => {
    if (typeof window === "undefined" || !product) return null;
    try {
      const localStoresStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
      const localStores = JSON.parse(localStoresStr);
      return localStores.find((st: any) => st.code === product.storeSlug) || (product.storeSlug === "obdtr" ? {
        name: "OBDTR Diagnostics",
        operatingModel: "virtual_delivery",
        serviceCountries: ["TR", "GE"]
      } : null);
    } catch (e) {
      console.error("Error parsing local stores", e);
      return null;
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

  const storePhoneVal = useMemo(() => {
    if (!memoizedActiveProduct) return undefined;
    const baseVal = memoizedActiveProduct.storePhone;
    const isPlaceholder = baseVal === "+905320000000" || baseVal === "905320000000" || !baseVal;
    if (isPlaceholder) {
      let activeUser = null;
      try {
        if (typeof window !== "undefined") {
          activeUser = JSON.parse(window.localStorage.getItem("hbs-current-user") || "null");
        }
      } catch (e) {
        console.error("Error reading hbs-current-user in storePhoneVal:", e);
      }
      const loggedInStoreSlug = activeUser?.storeSlugs?.[0] || "obdtr";
      if (memoizedActiveProduct.storeSlug === loggedInStoreSlug && localSettings?.phone) {
        return localSettings.phone;
      }
      return storeInfo?.phone || "+905320000000";
    }
    return baseVal;
  }, [memoizedActiveProduct, localSettings, storeInfo]);

  const storeWhatsappVal = useMemo(() => {
    if (!memoizedActiveProduct) return undefined;
    const baseVal = memoizedActiveProduct.storeWhatsapp;
    const isPlaceholder = baseVal === "905320000000" || baseVal === "+905320000000" || !baseVal;
    if (isPlaceholder) {
      let activeUser = null;
      try {
        if (typeof window !== "undefined") {
          activeUser = JSON.parse(window.localStorage.getItem("hbs-current-user") || "null");
        }
      } catch (e) {
        console.error("Error reading hbs-current-user in storeWhatsappVal:", e);
      }
      const loggedInStoreSlug = activeUser?.storeSlugs?.[0] || "obdtr";
      if (memoizedActiveProduct.storeSlug === loggedInStoreSlug && localSettings?.whatsapp) {
        return sanitizeWhatsAppNumber(localSettings.whatsapp);
      }
      return sanitizeWhatsAppNumber(storeInfo?.whatsapp || "905320000000");
    }
    return sanitizeWhatsAppNumber(baseVal);
  }, [memoizedActiveProduct, localSettings, storeInfo]);

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

      Promise.resolve(query)
        .then(({ data, error }) => {
          console.log("HBS_DEBUG: Supabase query resolved:", { data, error });
          if (data && data.length > 0 && !error && data[0].brand !== "DELETED" && data[0].category !== "DELETED") {
            const item = data[0];
            const mapped: ProductData = {
              slug: item.id,
              name: parseLocalizedField(item.name),
              brand: item.brand || "Genel",
              model: { tr: item.code || "Genel", en: item.code || "General" },
              category: parseLocalizedField(item.category || "Diğer"),
              storeName: item.companies?.name || "HBS Mağaza",
              storeSlug: item.companies?.code || "unknown",
              country: item.companies?.country || "Türkiye",
              city: item.companies?.city || "İstanbul",
              description: parseLocalizedField(item.description || ""),
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
            Promise.resolve(
              supabase
                .from("offerable_items")
                .select("*, companies(*)")
                .eq("company_id", item.company_id)
                .neq("id", item.id)
                .eq("is_visible_in_storefront", true)
                .limit(3)
            )
              .then(({ data: similarData, error: similarErr }) => {
                if (similarData && !similarErr) {
                  const mappedSimilar: ProductData[] = similarData
                    .filter((sim: any) => sim.brand !== "DELETED" && sim.category !== "DELETED")
                    .map((sim: any) => ({
                    slug: sim.id,
                    name: parseLocalizedField(sim.name),
                    brand: sim.brand || "Genel",
                    model: { tr: sim.code || "Genel", en: sim.code || "General" },
                    category: parseLocalizedField(sim.category || "Diğer"),
                    storeName: sim.companies?.name || "HBS Mağaza",
                    storeSlug: sim.companies?.code || "unknown",
                    country: sim.companies?.country || "Türkiye",
                    city: sim.companies?.city || "İstanbul",
                    description: parseLocalizedField(sim.description || ""),
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
              })
              .catch((err) => {
                console.error("Supabase similar products query rejected:", err);
              });

            setCustomLoaded(true);
          } else {
            if (error) console.error("Supabase product load error:", error);
            loadFromLocalStorage();
          }
        })
        .catch((err) => {
          console.error("Supabase product query rejected:", err);
          loadFromLocalStorage();
        });
    } else {
      loadFromLocalStorage();
    }

    // 2. Custom local storage products check
    function loadFromLocalStorage() {
      console.log("HBS_DEBUG: loadFromLocalStorage triggered", params.productSlug);
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
              name: parseLocalizedField(found.name),
              brand: found.brand || "Genel",
              model: { tr: found.model || "Genel", en: found.model || "General" },
              category: parseLocalizedField(found.category || "Diğer"),
              storeName: matchingStore.name,
              storeSlug: matchingStore.code,
              country: matchingStore.city.toLowerCase().includes("batum") ? "Georgia" : "Türkiye",
              city: matchingStore.city || "İstanbul",
              description: parseLocalizedField(found.description || ""),
              priceText: {
                tr: found.pricingMode === "quote" ? "Teklif isteyin" : found.pricingMode === "bidding" ? "Teklif verin" : `${found.salePrice || "0"} ${found.currency || "GEL"}`,
                en: found.pricingMode === "quote" ? "Request quote" : found.pricingMode === "bidding" ? "Make an offer" : `${found.salePrice || "0"} ${found.currency || "GEL"}`,
                de: found.pricingMode === "quote" ? "Anfrage erforderlich" : found.pricingMode === "bidding" ? "Angebot machen" : `${found.salePrice || "0"} ${found.currency || "GEL"}`,
                ru: found.pricingMode === "quote" ? "Цена по запросу" : found.pricingMode === "bidding" ? "Сделать предложение" : `${found.salePrice || "0"} ${found.currency || "GEL"}`,
                ka: found.pricingMode === "quote" ? "ფასი მოთხოვნით" : found.pricingMode === "bidding" ? "ფასის შეთავაზება" : `${found.salePrice || "0"} ${found.currency || "GEL"}`
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
                name: parseLocalizedField(sim.name),
                brand: sim.brand || "Genel",
                model: { tr: sim.model || "Genel", en: sim.model || "General" },
                category: parseLocalizedField(sim.category || "Diğer"),
                storeName: matchingStore.name,
                storeSlug: matchingStore.code,
                country: matchingStore.city.toLowerCase().includes("batum") ? "Georgia" : "Türkiye",
                city: matchingStore.city || "İstanbul",
                description: parseLocalizedField(sim.description || ""),
                priceText: {
                  tr: sim.pricingMode === "quote" ? "Teklif isteyin" : `${sim.salePrice || "0"} ${sim.currency || "GEL"}`,
                  en: sim.pricingMode === "quote" ? "Request quote" : `${sim.salePrice || "0"} ${sim.currency || "GEL"}`,
                  de: sim.pricingMode === "quote" ? "Anfrage erforderlich" : `${sim.salePrice || "0"} ${sim.currency || "GEL"}`,
                  ru: sim.pricingMode === "quote" ? "Цена по запросу" : `${sim.salePrice || "0"} ${sim.currency || "GEL"}`,
                  ka: sim.pricingMode === "quote" ? "ფასი მოთხოვნით" : `${sim.salePrice || "0"} ${sim.currency || "GEL"}`
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

  useEffect(() => {
    setSelectedGalleryImage(null);
  }, [params.productSlug]);

  if (!isReady || !customLoaded) return <main className="min-h-screen bg-slate-50" />;

  if (!product) {
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    return (
      <main className="min-h-screen hbs-market-page px-6 py-8 text-slate-950">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-black">{pageTxt("productNotFound", language)}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{pageTxt("productNotFoundText", language)}</p>
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
    const currentMainImage = selectedGalleryImage || activeProduct.imageUrl;

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
    let user = null;
    try {
      user = window.localStorage.getItem("hbs-current-user");
    } catch (e) {
      console.error("Error reading hbs-current-user in requireLogin:", e);
    }
    if (!user) {
      window.location.href = "/login";
      return false;
    }
    return true;
  }

  function checkProfileAndExecute(action: () => void) {
    if (!requireLogin()) return;
    let userStr = null;
    try {
      userStr = window.localStorage.getItem("hbs-current-user");
    } catch (e) {
      console.error("Error reading hbs-current-user in checkProfileAndExecute:", e);
    }
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

    let userStr = null;
    try {
      userStr = window.localStorage.getItem("hbs-current-user");
    } catch (e) {
      console.error("Error reading hbs-current-user in handleSaveProfile:", e);
    }
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.displayName = profileName;
        userObj.phone = profilePhone;
        userObj.city = profileCity;
        try {
          window.localStorage.setItem("hbs-current-user", JSON.stringify(userObj));
        } catch (e) {
          console.error("Error saving hbs-current-user:", e);
        }

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

  // B2B Live Negotiation Sandbox Handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const msg = {
      sender: "customer" as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    };
    setChatMessages(prev => [...prev, msg]);
    const customerMsg = inputText.trim();
    setInputText("");
    
    // Simulate smart representative answer based on input text
    setTimeout(() => {
      let replyText = `Mesajınızı aldım. Teklifinizi sürgü üzerinden ${negotiatedPrice.toLocaleString()} ${activeProduct.currency || "GEL"} seviyesinde tuttunuz.`;
      const txtLower = customerMsg.toLowerCase();
      if (txtLower.includes("indirim") || txtLower.includes("fiyat") || txtLower.includes("ucuz")) {
        replyText = `Müşteri temsilcimiz olarak sizi kazanmak istiyoruz. Sürgü üzerinden bütçenize en uygun fiyatı belirleyip hemen 'Teklifi Kabul Et & Kilitle 🔒' butonuna tıklayarak proforma oluşturabilirsiniz!`;
      } else if (txtLower.includes("kargo") || txtLower.includes("teslim") || txtLower.includes("batum")) {
        replyText = `Sınır ötesi lojistiğimiz Gürcistan ve Türkiye genelinde 48 saat içinde teslimat güvencesi sunmaktadır. Gümrük masrafları fiyat teklifine dahildir.`;
      } else if (txtLower.includes("garanti") || txtLower.includes("bozuk") || txtLower.includes("arıza")) {
        replyText = `Autel diagnostik ürünlerimize karşı 2 yıl resmi HBS ve üretici garantisi vermekteyiz. Herhangi bir arızada birebir değişim imkanı sunuyoruz.`;
      }
      setChatMessages(prev => [...prev, {
        sender: "rep",
        text: replyText,
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      }]);
    }, 1000);
  };

  const handleSuggestPrice = () => {
    const msg = {
      sender: "customer" as const,
      text: `Önerdiğim B2B Özel Fiyat: ${negotiatedPrice.toLocaleString()} ${activeProduct.currency || "GEL"}`,
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    };
    setChatMessages(prev => [...prev, msg]);
    
    setTimeout(() => {
      const discountRatio = negotiatedPrice / (activeProduct.priceValue || 3500);
      let replyText = "";
      if (discountRatio >= 0.94) {
        replyText = `Mükemmel bir teklif! Uzun vadeli iş ortaklığımıza dayanarak bu fiyatı anında kabul ediyoruz. Anlaşmayı resmiyete dökmek için lütfen aşağıdaki 'Teklifi Kabul Et & Kilitle 🔒' butonuna tıklayın.`;
      } else if (discountRatio >= 0.88) {
        replyText = `Teklifiniz makul görünüyor. Lojistik departmanımızla görüştüm; bu fiyatı onaylayabiliriz. Resmi B2B Proforma İrsaliyesini oluşturup stoğu adınıza rezerve etmek için teklifi kilitleyebilirsiniz!`;
      } else {
        const midPoint = Math.round((activeProduct.priceValue || 3500) * 0.92);
        replyText = `Bu teklif maalesef gümrük ve ithalat masraflarımızı karşılamıyor. Ancak, sizi memnun etmek adına ${midPoint.toLocaleString()} ${activeProduct.currency || "GEL"} fiyatına inebiliriz. Sürgüyü bu fiyata çekip kilitleyebilirsiniz!`;
      }
      setChatMessages(prev => [...prev, {
        sender: "rep",
        text: replyText,
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      }]);
    }, 1000);
  };

  const handleLockDeal = () => {
    const offerCode = `HBS-OFFER-${Math.floor(100000 + Math.random() * 900000)}`;
    setLockedOfferCode(offerCode);
    setIsDealLocked(true);
    setIsCelebrationActive(true);

    // 1. Deduct stock from hbs-store-products local storage reactively
    try {
      const savedProducts = window.localStorage.getItem("hbs-store-products");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        const updated = parsed.map((p: any) => {
          if (p.id === activeProduct.slug || p.sku === activeProduct.sku) {
            const currentQty = parseInt(p.quantity || "10");
            const nextQty = Math.max(0, currentQty - 1);
            return { ...p, quantity: String(nextQty) };
          }
          return p;
        });
        window.localStorage.setItem("hbs-store-products", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Error deducting stock in deal lock", e);
    }

    // 2. Register finalised offer in hbs-store-customer-offers
    try {
      const savedOffers = window.localStorage.getItem("hbs-store-customer-offers") || "[]";
      const parsedOffers = JSON.parse(savedOffers);
      const newOffer = {
        offerCode,
        productName: txt(activeProduct.name, language),
        productSku: activeProduct.sku || "-",
        negotiatedPrice,
        currency: activeProduct.currency || "GEL",
        customerName: profileName || "B2B Customer",
        customerPhone: profilePhone || "-",
        storeName: activeProduct.storeName,
        date: new Date().toLocaleString("tr-TR")
      };
      parsedOffers.push(newOffer);
      window.localStorage.setItem("hbs-store-customer-offers", JSON.stringify(parsedOffers));
    } catch (e) {
      console.error("Error registering offer", e);
    }

    // 3. Play success double beep sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
      
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.15);
      }, 150);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDownloadProforma = () => {
    const activeLang = language || "tr";
    const proformaTitle = activeLang === "tr" ? "RESMİ B2B ANLAŞMA PROFORMA FATURASI" :
                          activeLang === "de" ? "OFFIZIELLE B2B-ANBAHNUNG PROFORMA-RECHNUNG" :
                          activeLang === "ru" ? "ОФИЦИАЛЬНЫЙ B2B ПРОФОРМА-СЧЕТ" :
                          activeLang === "ka" ? "ოფიციალური B2B პროფორმა ინვოისი" :
                          "OFFICIAL B2B DEAL PROFORMA INVOICE";

    const refLabel = activeLang === "tr" ? "Referans No" :
                     activeLang === "de" ? "Referenz-Nr" :
                     activeLang === "ru" ? "Регистрационный номер" :
                     activeLang === "ka" ? "რეფერენსის ნომერი" :
                     "Reference No";

    const dateLabel = activeLang === "tr" ? "Tarih" :
                      activeLang === "de" ? "Datum" :
                      activeLang === "ru" ? "Дата" :
                      activeLang === "ka" ? "თარიღი" :
                      "Date";

    const sellerInfoLabel = activeLang === "tr" ? "SATICI BİLGİLERİ" :
                            activeLang === "de" ? "VERKÄUFERINFORMATIONEN" :
                            activeLang === "ru" ? "ИНФОРМАЦИЯ О ПРОДАВЦЕ" :
                            activeLang === "ka" ? "გამყიდველის ინფორმაცია" :
                            "SELLER INFORMATION";

    const buyerInfoLabel = activeLang === "tr" ? "ALICI BİLGİLERİ" :
                           activeLang === "de" ? "KÄUFERINFORMATIONEN" :
                           activeLang === "ru" ? "ИНФОРМАЦИЯ О ПОКУПАТЕЛЕ" :
                           activeLang === "ka" ? "მყიდველის ინფორმაცია" :
                           "BUYER INFORMATION";

    const companyLabel = activeLang === "tr" ? "Şirket" :
                         activeLang === "de" ? "Unternehmen" :
                         activeLang === "ru" ? "Компания" :
                         activeLang === "ka" ? "კომპანია" :
                         "Company";

    const cityCountryLabel = activeLang === "tr" ? "Şehir/Ülke" :
                             activeLang === "de" ? "Stadt/Land" :
                             activeLang === "ru" ? "Город/Страна" :
                             activeLang === "ka" ? "ქალაქი/ქვეყანა" :
                             "City/Country";

    const logisticsLabel = activeLang === "tr" ? "Lojistik Durumu" :
                           activeLang === "de" ? "Logistikstatus" :
                           activeLang === "ru" ? "Статус логистики" :
                           activeLang === "ka" ? "ლოგისტიკის სტატუსი" :
                           "Logistics Status";

    const logisticsVal = activeLang === "tr" ? "Sınır Ötesi Teslimat Hazır" :
                         activeLang === "de" ? "Grenzüberschreitende Lieferung bereit" :
                         activeLang === "ru" ? "Готово к международной доставке" :
                         activeLang === "ka" ? "მზად არის საერთაშორისო მიწოდებისთვის" :
                         "Cross-Border Delivery Ready";

    const customerLabel = activeLang === "tr" ? "Müşteri" :
                          activeLang === "de" ? "Kunde" :
                          activeLang === "ru" ? "Клиент" :
                          activeLang === "ka" ? "კლიენტი" :
                          "Customer";

    const phoneLabel = activeLang === "tr" ? "Telefon" :
                       activeLang === "de" ? "Telefon" :
                       activeLang === "ru" ? "Телефон" :
                       activeLang === "ka" ? "ტელეფონი" :
                       "Phone";

    const locationLabelText = activeLang === "tr" ? "Konum" :
                              activeLang === "de" ? "Standort" :
                              activeLang === "ru" ? "Местоположение" :
                              activeLang === "ka" ? "მდებარეობა" :
                              "Location";

    const descLabel = activeLang === "tr" ? "Ürün Açıklaması / SKU" :
                      activeLang === "de" ? "Produktbeschreibung / SKU" :
                      activeLang === "ru" ? "Описание товара / SKU" :
                      activeLang === "ka" ? "პროდუქტის აღწერა / SKU" :
                      "Product Description / SKU";

    const qtyLabel = activeLang === "tr" ? "Miktar" :
                     activeLang === "de" ? "Menge" :
                     activeLang === "ru" ? "Количество" :
                     activeLang === "ka" ? "რაოდენობა" :
                     "Quantity";

    const unitPriceLabel = activeLang === "tr" ? "Birim Fiyat" :
                           activeLang === "de" ? "Einzelpreis" :
                           activeLang === "ru" ? "Цена за единицу" :
                           activeLang === "ka" ? "ერთეულის ფასი" :
                           "Unit Price";

    const totalLabel = activeLang === "tr" ? "Toplam Tutar" :
                       activeLang === "de" ? "Gesamtbetrag" :
                       activeLang === "ru" ? "Итоговая сумма" :
                       activeLang === "ka" ? "ჯამური ღირებულება" :
                       "Total Amount";

    const qtyUnitVal = activeLang === "tr" ? "1 Adet" :
                       activeLang === "de" ? "1 Stück" :
                       activeLang === "ru" ? "1 шт." :
                       activeLang === "ka" ? "1 ცალი" :
                       "1 Unit";

    const lockedTotalLabel = activeLang === "tr" ? "KİLİTLENEN ANLAŞMA TOPLAMI:" :
                             activeLang === "de" ? "GESPERRTE VEREINBARUNGSSUMME:" :
                             activeLang === "ru" ? "ИТОГО ФИКСИРОВАННАЯ СДЕЛКА:" :
                             activeLang === "ka" ? "შეთანხმებული ჯამი:" :
                             "LOCKED DEAL TOTAL:";

    const disclaimerHeader = activeLang === "tr" ? "Yasal Uyarı ve Koşullar:" :
                             activeLang === "de" ? "Rechtliche Hinweise und Bedingungen:" :
                             activeLang === "ru" ? "Юридическое предупреждение и условия:" :
                             activeLang === "ka" ? "სამართლებრივი გაფრთხილება და პირობები:" :
                             "Legal Notice & Terms:";

    const disclaimerVal = activeLang === "tr" ? "Bu proforma fatura HBS B2B Canlı Pazarlık Odasında iki tarafın rızası ve teklif kilitleme mührüyle dijital olarak üretilmiştir. Tutar üzerine HBS Sınır Ötesi Gümrük ve Döviz Kalkanı garantisi eklenmiştir. Fiyat 24 saat boyunca döviz dalgalanmalarına karşı sabitlenmiştir." :
                          activeLang === "de" ? "Diese Proforma-Rechnung wurde im HBS-B2B-Live-Verhandlungsraum mit Zustimmung beider Parteien und dem Angebots-Sperrsiegel digital erstellt. HBS Cross-Border Zoll- und Währungsschutzgarantie wurde dem Betrag hinzugefügt. Der Preis ist für 24 Stunden gegen Währungsschwankungen gesichert." :
                          activeLang === "ru" ? "Этот счет-проформа был создан в цифровом формате в живой комнате B2B-переговоров HBS с согласия обеих сторон и с печатью блокировки предложения. К сумме добавлена гарантия трансграничной таможни и валютной защиты HBS. Цена зафиксирована на 24 часа против колебаний валютных курсов." :
                          activeLang === "ka" ? "ეს პროფორმა ინვოისი ციფრულად შეიქმნა HBS B2B მოლაპარაკებების ოთახში ორივე მხარის თანხმობითა და შეთავაზების ბლოკირების ბეჭდით. თანხას დაემატა HBS-ის ტრანსსასაზღვრო საბაჟო და ვალუტის დაცვის გარანტია. ფასი დაფიქსირებულია 24 საათით ვალუტის მერყეობის წინააღმდეგ." :
                          "This proforma invoice was digitally generated in the HBS B2B Live Negotiation Room with the consent of both parties and the deal lock seal. HBS Cross-Border Customs and Exchange Hedging guarantee has been added to the amount. The price is locked for 24 hours against currency fluctuations.";

    const buyerSigLabel = activeLang === "tr" ? "Alıcı Yetkili İmza" :
                           activeLang === "de" ? "Autorisierte Unterschrift des Käufers" :
                           activeLang === "ru" ? "Уполномоченная подпись покупателя" :
                           activeLang === "ka" ? "მყიდველის უფლებამოსილი ხელმოწერა" :
                           "Buyer Authorized Signature";

    const sellerSigLabel = activeLang === "tr" ? "Satıcı Yetkili İmza" :
                            activeLang === "de" ? "Autorisierte Unterschrift des Verkäufers" :
                            activeLang === "ru" ? "Уполномоченная подпись продавца" :
                            activeLang === "ka" ? "გამყიდველის უფლებამოსილი ხელმოწერა" :
                            "Seller Authorized Signature";

    const repLabel = activeLang === "tr" ? "Temsilcisi" :
                     activeLang === "de" ? "Vertreter" :
                     activeLang === "ru" ? "Представитель" :
                     activeLang === "ka" ? "წარმომადგენელი" :
                     "Representative";

    const footerText = activeLang === "tr" ? "HBS Sınır Ötesi Güvenli Ticaret Altyapısı © 2026. Tüm hakları saklıdır." :
                       activeLang === "de" ? "HBS Grenzüberschreitende Sichere Handelsinfrastruktur © 2026. Alle Rechte vorbehalten." :
                       activeLang === "ru" ? "Инфраструктура безопасной трансграничной торговли HBS © 2026. Все права защищены." :
                       activeLang === "ka" ? "HBS-ის ტრანსსასაზღვრო უსაფრთხო ვაჭრობის ინფრასტრუქტურა © 2026. ყველა უფლება დაცულია." :
                       "HBS Cross-Border Secure Trade Infrastructure © 2026. All rights reserved.";

    const htmlInvoice = `
      <html>
      <head>
        <title>HBS B2B Proforma Invoice - ${lockedOfferCode}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .title { font-size: 20px; font-weight: bold; margin-top: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .section-title { font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f3f4f6; border: 1px solid #ddd; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 10px; }
          .total { font-weight: bold; font-size: 16px; background: #eff6ff; }
          .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }
          .signature-box { display: flex; justify-content: space-between; margin-top: 50px; }
          .sig { border-top: 1px dashed #999; width: 200px; text-align: center; padding-top: 5px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">HYBRID BUSINESS SYSTEM (HBS)</div>
          <div class="title">${proformaTitle}</div>
          <div>${refLabel}: <b>${lockedOfferCode}</b></div>
          <div>${dateLabel}: ${new Date().toLocaleDateString("tr-TR")}</div>
        </div>

        <div class="grid">
          <div>
            <div class="section-title">${sellerInfoLabel}</div>
            <div><b>${companyLabel}:</b> ${activeProduct.storeName}</div>
            <div><b>${cityCountryLabel}:</b> ${activeProduct.city}, ${activeProduct.country}</div>
            <div><b>${logisticsLabel}:</b> ${logisticsVal}</div>
          </div>
          <div>
            <div class="section-title">${buyerInfoLabel}</div>
            <div><b>${customerLabel}:</b> ${profileName || "B2B"}</div>
            <div><b>${phoneLabel}:</b> ${profilePhone || "-"}</div>
            <div><b>${locationLabelText}:</b> ${profileCity || "-"}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${descLabel}</th>
              <th>${qtyLabel}</th>
              <th>${unitPriceLabel}</th>
              <th>${totalLabel}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>${txt(activeProduct.name, language)}</b><br/>
                SKU: ${activeProduct.sku || "-"}<br/>
                Brand: ${activeProduct.brand}
              </td>
              <td>${qtyUnitVal}</td>
              <td>${negotiatedPrice.toLocaleString()} ${activeProduct.currency || "GEL"}</td>
              <td>${negotiatedPrice.toLocaleString()} ${activeProduct.currency || "GEL"}</td>
            </tr>
            <tr class="total">
              <td colspan="3" style="text-align: right;">${lockedTotalLabel}</td>
              <td>${negotiatedPrice.toLocaleString()} ${activeProduct.currency || "GEL"}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 11px; background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 10px;">
          ⚠️ <b>${disclaimerHeader}</b> ${disclaimerVal}
        </div>

        <div class="signature-box">
          <div class="sig">
            ${buyerSigLabel}<br/>
            <b>${profileName || "B2B"}</b>
          </div>
          <div class="sig">
            ${sellerSigLabel}<br/>
            <b>${activeProduct.storeName} ${repLabel}</b>
          </div>
        </div>

        <div class="footer">
          ${footerText}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlInvoice], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hbs_proforma_${lockedOfferCode}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  function addToCart() {
    checkProfileAndExecute(() => {
      setIsNegotiationOpen(true);
      const initialPrice = activeProduct.priceValue || 3500;
      setNegotiatedPrice(initialPrice);
      const activeLang = language || "tr";
      const repWelcomeText = activeLang === "tr" ? `Merhaba! Ben ${activeProduct.storeName} Satış Temsilcisiyim. "${txt(activeProduct.name, activeLang)}" ürünümüz için canlı B2B pazarlık odamıza hoş geldiniz. HBS platformu üzerinden teklifinizi doğrudan müzakere edebilir ve anlaşmayı resmi proforma fatura ile anında kilitleyebiliriz. Sürgüyü kullanarak teklifinizi belirleyin!` :
                             activeLang === "de" ? `Hallo! Ich bin der Vertriebsmitarbeiter von ${activeProduct.storeName}. Willkommen in unserem B2B-Live-Verhandlungsraum für "${txt(activeProduct.name, activeLang)}". Sie können Ihr Angebot direkt über die HBS-Plattform verhandeln und den Deal sofort mit einer offiziellen Proforma-Rechnung sichern. Verwenden Sie den Schieberegler, um Ihr Angebot festzulegen!` :
                             activeLang === "ru" ? `Здравствуйте! Я торговый представитель ${activeProduct.storeName}. Добро пожаловать в наш живой зал B2B-переговоров по товару "${txt(activeProduct.name, activeLang)}". Вы можете обсудить цену напрямую через платформу HBS и зафиксировать сделку с официальным счетом-проформой. Используйте ползунок, чтобы указать ваше предложение!` :
                             activeLang === "ka" ? `გამარჯობა! მე ვარ ${activeProduct.storeName}-ის გაყიდვების წარმომადგენელი. კეთილი იყოს თქვენი მობრძანება B2B ცოცხალ მოლაპარაკებების ოთახში პროდუქტზე "${txt(activeProduct.name, activeLang)}". შეგიძლიათ აწარმოოთ მოლაპარაკება პირდაპირ HBS პლატფორმის საშუალებით და გააფორმოთ გარიგება პროფორმა ინვოისით. გამოიყენეთ სლაიდერი!` :
                             `Hello! I am the sales representative for ${activeProduct.storeName}. Welcome to our live B2B negotiation room for "${txt(activeProduct.name, activeLang)}". You can negotiate your offer directly through the HBS platform and instantly lock the deal with an official proforma invoice. Adjust the slider to set your offer!`;
      setChatMessages([
        {
          sender: "rep",
          text: repWelcomeText,
          time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    });
  }
  
  function askQuestion() {
    checkProfileAndExecute(() => {
      setIsNegotiationOpen(true);
      const initialPrice = activeProduct.priceValue || 3500;
      setNegotiatedPrice(initialPrice);
      const activeLang = language || "tr";
      const repQuestionText = activeLang === "tr" ? `Merhaba! Cihaz özellikleri, sınır ötesi lojistik veya gümrük süreçleri hakkında sormak istediğiniz soruları yanıtlamaya hazırım. Eğer fiyatta anlaşmak isterseniz teklif sürgüsünü kullanarak bir teklif de iletebilirsiniz.` :
                              activeLang === "de" ? `Hallo! Ich stehe bereit, um Ihre Fragen zu Gerätespezifikationen, grenzüberschreitender Logistik oder Zollprozessen zu beantworten. Wenn Sie sich auf einen Preis einigen möchten, können Sie auch ein Angebot über den Preisregler abgeben.` :
                              activeLang === "ru" ? `Здравствуйте! Я готов ответить на любые вопросы о характеристиках устройства, трансграничной логистике или таможенных процедурах. Если вы хотите договориться о цене, вы также можете отправить предложение с помощью ползунка.` :
                              activeLang === "ka" ? `გამარჯობა! მზად ვარ ვუპასუხო თქვენს კითხვებს მოწყობილობის მახასიათებლებზე, ტრანსსასაზღვრო ლოგისტიკაზე ან საბაჟო პროცესებზე. თუ გსურთ ფასზე შეთანხმება, შეგიძლიათ შემოგვთავაზოთ ფასი სლაიდერის საშუალებით.` :
                              `Hello! I am ready to answer any questions you have about device specifications, cross-border logistics, or customs processes. If you want to negotiate the price, you can also submit an offer using the price slider.`;
      setChatMessages([
        {
          sender: "rep",
          text: repQuestionText,
          time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    });
  }
  
  function requestOffer() {
    checkProfileAndExecute(() => {
      setIsNegotiationOpen(true);
      const initialPrice = activeProduct.priceValue || 3500;
      setNegotiatedPrice(initialPrice);
      const activeLang = language || "tr";
      const repOfferText = activeLang === "tr" ? `Değerli iş ortağımız, toplu alım veya özel döviz korumalı teklif talebiniz için pazarlık odamız aktif edildi! Fiyat sürgüsünü ayarlayarak teklif sunabilir ve anlaşmayı onayladığınızda dijital proforma belgenizi anında indirebilirsiniz.` :
                           activeLang === "de" ? `Sehr geehrter Geschäftspartner, unser Verhandlungsraum wurde für Ihre Großbestellung oder Ihre spezielle währungsgesicherte Angebotsanfrage aktiviert! Reichen Sie Ihr Angebot über den Schieberegler ein. Nach der Freigabe können Sie Ihre digitale Proforma-Rechnung sofort herunterladen.` :
                           activeLang === "ru" ? `Уважаемый партнер, комната переговоров активирована для вашего оптового заказа или специального запроса цены с защитой от колебаний курса! Укажите ваше предложение с помощью ползунка, и после одобрения вы сможете мгновенно скачать электронный счет-проформу.` :
                           activeLang === "ka" ? `ძვირფასო პარტნიორო, მოლაპარაკებების ოთახი გააქტიურდა თქვენი საბითუმო შესყიდვის ან სპეციალური კურსით დაცული ფასის მოთხოვნისთვის! წარადგინეთ შეთავაზება სლაიდერის საშუალებით და დამტკიცების შემდეგ მომენტალურად ჩამოტვირთეთ ციფრული პროფორმა დოკუმენტი.` :
                           `Dear business partner, our negotiation room has been activated for your bulk purchase or special currency-hedged quote request! Submit your offer using the slider, and once you approve, you can instantly download your digital proforma document.`;
      setChatMessages([
        {
          sender: "rep",
          text: repOfferText,
          time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
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
            <Link href="/requests" className="hidden rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-750 px-3 py-2 text-xs font-bold hover:bg-indigo-105 sm:inline-flex sm:px-4 sm:text-sm transition">{getLocalText("bulletinBoard", language)}</Link>
            <Link href={`/store/${activeProduct.storeSlug}`} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.storefront}</Link>
            <Link href="/customer" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.customerPortal}</Link>
            <Link href="/" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:block sm:px-4 sm:text-sm">{t.common.home}</Link>
          </div>
        </header>

        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:mb-6 sm:rounded-[2rem] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr_0.74fr] sm:gap-5">
            <div>
              <div 
                className="hbs-product-image cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all duration-300 relative group shadow-sm"
                onClick={() => setLightboxImage(currentMainImage)}
                title={pageTxt("clickToViewFull", language)}
              >
                <img src={currentMainImage} alt={txt(activeProduct.name, language)} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-md">
                    🔍 {pageTxt("viewFullScreen", language)}
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {displayGallery.map((image) => {
                  const isActive = currentMainImage === image;
                  return (
                    <div 
                      key={image} 
                      className={`hbs-product-image rounded-xl cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 ${isActive ? "ring-2 ring-blue-600 shadow-md" : "opacity-80 hover:opacity-100"}`}
                      onClick={() => setSelectedGalleryImage(image)}
                    >
                      <img src={image} alt={txt(activeProduct.name, language)} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800/80 sm:text-sm">{t.product.eyebrow}</p>
              <h1 className="mt-2 text-2xl font-black leading-tight sm:mt-3 sm:text-4xl">{txt(activeProduct.name, language)}</h1>
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                <span className="rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-800 sm:px-4 sm:text-sm">{txt(activeProduct.category, language)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600 sm:px-4 sm:text-sm">{activeProduct.country} / {activeProduct.city}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 sm:px-4 sm:text-sm">{txt(stockText[activeProduct.stockStatus], language)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:rounded-3xl shadow-sm relative overflow-hidden">
              {/* Price Container */}
              <div className="space-y-1.5 relative z-10">
                {activeProduct.priceValue ? (
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {activeProduct.priceValue.toLocaleString(language === "tr" ? "tr-TR" : "en-US", {minimumFractionDigits: 2})} {activeProduct.currency || "GEL"}
                  </h2>
                ) : (
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    {txt(activeProduct.priceText, language)}
                  </h2>
                )}
              </div>

              <div className="mt-4 grid gap-2 text-xs leading-5 text-slate-700 sm:mt-5 sm:gap-2.5 relative z-10 font-bold">
                <p><span className="text-slate-400 font-black uppercase text-[9px] tracking-wider block">{t.common.store}</span> {activeProduct.storeName}</p>
                <p><span className="text-slate-400 font-black uppercase text-[9px] tracking-wider block">{t.common.brand}</span> {activeProduct.brand} / {txt(activeProduct.model, language)}</p>
                <p><span className="text-slate-400 font-black uppercase text-[9px] tracking-wider block">{t.common.city}</span> 📍 {activeProduct.city}, {activeProduct.country}</p>
              </div>

              <div className="mt-5 grid gap-2 sm:mt-6 sm:gap-2.5 relative z-10">
                <button 
                  type="button" 
                  onClick={handleWhatsAppCheckout} 
                  className="w-full rounded-xl bg-[#25D366] hover:bg-[#20ba5a] py-3 text-xs font-black text-white shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer font-extrabold"
                >
                  🟢 WhatsApp ile Hızlı Sipariş
                </button>
                <button 
                  type="button" 
                  onClick={addToCart} 
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-xs font-black text-white shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  🤝 {pageTxt("liveB2bNegotiation", language)}
                </button>
                <button 
                  type="button" 
                  onClick={requestOffer} 
                  className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-3 text-xs font-black text-slate-800 active:scale-[0.98] transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  🔒 {pageTxt("requestQuote", language)}
                </button>
                <button 
                  type="button" 
                  onClick={askQuestion} 
                  className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-3 text-xs font-black text-slate-800 active:scale-[0.98] transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  💬 {pageTxt("askRepresentative", language)}
                </button>
              </div>

              {(storePhoneVal || storeWhatsappVal) && (
                <div className="mt-4 border-t border-blue-200/50 pt-3 space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">
                    {getLocalText("directContact", language)}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {storePhoneVal && (
                      <a
                        href={`tel:${storePhoneVal}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span>{getLocalText("quickCall", language)}</span>
                      </a>
                    )}
                    {storeWhatsappVal && (
                      <a
                        href={`https://wa.me/${storeWhatsappVal.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-xs font-bold text-green-800 hover:bg-green-100 transition shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="w-3.5 h-3.5" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.907h.004c4.368 0 7.926-3.559 7.93-7.93a7.9 7.9 0 0 0-2.327-5.645ZM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.98c-.202-.1-.374-.195-.614-.307-.24-.113-.28-.09-.386.033-.11.121-.422.534-.517.64-.095.105-.19.117-.39.017-.2-.1-.843-.312-1.606-.992-.593-.53-1.002-1.185-1.119-1.39-.117-.2-.013-.31.087-.41.09-.09.2-.23.3-.35.1-.117.135-.19.2-.317.065-.13.033-.245-.015-.345-.047-.1-.422-1.02-.579-1.396-.153-.371-.322-.32-.44-.326-.113-.005-.243-.006-.374-.006-.13 0-.34.049-.517.243-.177.194-.677.662-.677 1.617 0 .955.697 1.878.795 2.01.1.13 1.369 2.091 3.316 2.93.464.2.825.32 1.107.41.467.15.893.129 1.23.078.374-.056 1.15-.47 1.31-1.026.16-.556.16-1.034.113-1.134-.047-.1-.17-.195-.37-.307Z"/></svg>
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {message && <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 sm:mb-6 sm:rounded-3xl sm:p-5">{message}</div>}

        <section className="mb-4 sm:mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black sm:text-xl">{pageTxt("descTitle", language)}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{pageTxt("detail", language)}</span>
            </div>
            <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">{txt(activeProduct.description, language)}</p>
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

          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <h2 className="text-xl font-black sm:text-2xl">{t.product.storeDeliveryTitle}</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 sm:mt-5 sm:gap-4">
              <p><span className="font-bold text-slate-950">{t.common.store}:</span> {activeProduct.storeName}</p>
              {isVirtualDelivery ? (
                <>
                  <p><span className="font-bold text-slate-950">{t.common.location}:</span> {getLocalText("location", language)}</p>
                  <p>
                    <span className="font-bold text-slate-950">{txt(dynamicUi.salesMethodLabel, language)}:</span>{" "}
                    {activeProduct.storeSlug === "obdtr"
                      ? getLocalText("obdtrSalesMethod", language)
                      : getLocalText("salesMethod", language)}
                  </p>
                  {activeProduct.storeSlug === "obdtr" ? (
                    <p>
                      <span className="font-bold text-slate-950">{getLocalText("afterSalesService", language)}:</span>{" "}
                      {getLocalText("obdtrAfterSales", language)}
                    </p>
                  ) : (
                    <p><span className="font-bold text-slate-950">{txt(dynamicUi.note, language)}:</span> {getLocalText("note", language)}</p>
                  )}
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
                  placeholder="Ahmet Yılmaz" id="id-page-w-full-rounded-xl-border-border-slate-200-dark-border-slate-800-bg-white-50-dark-bg-slate-950-50-px-4-py-3-text-sm-outline-none-focus-border-blue-500-dark-focus-border-blue-400-transition-479" aria-label="W full rounded xl border border slate 200 dark border slate 800 bg white 50 dark bg slate 950 50 px 4 py 3 text sm outline none focus border blue 500 dark focus border blue 400 transition" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Telefon Numaranız *</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="+90 532 000 00 00" id="id-page-w-full-rounded-xl-border-border-slate-200-dark-border-slate-800-bg-white-50-dark-bg-slate-950-50-px-4-py-3-text-sm-outline-none-focus-border-blue-500-dark-focus-border-blue-400-transition-23" aria-label="W full rounded xl border border slate 200 dark border slate 800 bg white 50 dark bg slate 950 50 px 4 py 3 text sm outline none focus border blue 500 dark focus border blue 400 transition" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Bulunduğunuz Şehir *</label>
                <input
                  type="text"
                  required
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="İstanbul" id="id-page-w-full-rounded-xl-border-border-slate-200-dark-border-slate-800-bg-white-50-dark-bg-slate-950-50-px-4-py-3-text-sm-outline-none-focus-border-blue-500-dark-focus-border-blue-400-transition-629" aria-label="W full rounded xl border border slate 200 dark border slate 800 bg white 50 dark bg slate 950 50 px 4 py 3 text sm outline none focus border blue 500 dark focus border blue 400 transition" />
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

      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 sm:p-8 backdrop-blur-md animate-fadeIn cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button */}
          <button 
            type="button"
            className="absolute top-4 right-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            aria-label="Kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image Container with scale-up animation */}
          <div 
            className="relative max-w-full max-h-[90vh] flex items-center justify-center scale-up-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage} 
              alt={txt(activeProduct.name, language)} 
              className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 cursor-default"
            />
          </div>
        </div>
      )}

      {/* B2B Live Negotiation Sandbox Drawer */}
      {isNegotiationOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-end bg-slate-950/60 p-0 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={() => setIsNegotiationOpen(false)} />

          {/* Drawer Container (Right Slideover) */}
          <div className="relative w-full max-w-md bg-[#0d1627] text-slate-100 shadow-2xl h-full flex flex-col animate-slideLeft border-l border-slate-800 z-10">
            
            {/* Header contact card */}
            <div className="p-4 bg-[#141f36] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-lg shadow-inner">
                  👨‍💼
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                    Altan Cancı
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{activeProduct.storeName} Satış Temsilcisi</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                  B2B Canlı
                </span>
                <button
                  type="button"
                  onClick={() => setIsNegotiationOpen(false)}
                  className="text-slate-400 hover:text-white font-bold p-1 hover:scale-105 active:scale-95 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0f1d] scrollbar-thin">
              {chatMessages.map((msg, idx) => {
                const isRep = msg.sender === "rep";
                return (
                  <div key={idx} className={`flex ${isRep ? "justify-start" : "justify-end"} animate-fadeIn`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow ${isRep ? "bg-[#142038] text-slate-200 rounded-tl-none border border-slate-800" : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-tr-none"}`}>
                      <p className="font-medium whitespace-pre-line">{msg.text}</p>
                      <span className="text-[8px] text-slate-400 font-semibold block text-right select-none">{msg.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Panel controls */}
            <div className="p-4 bg-[#141f36] border-t border-slate-800 space-y-4">
              {!isDealLocked ? (
                <>
                  {/* Fiyat Sürgüsü Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Müzakere Edilen Teklif</span>
                      <span className="text-orange-400 font-extrabold text-xs">
                        {negotiatedPrice.toLocaleString()} {activeProduct.currency || "GEL"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={Math.round((activeProduct.priceValue || 3500) * 0.80)}
                        max={Math.round((activeProduct.priceValue || 3500) * 1.05)}
                        step={10}
                        value={negotiatedPrice}
                        onChange={(e) => setNegotiatedPrice(parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500" id="id-page-flex-1-h-1-5-bg-slate-700-rounded-lg-appearance-none-cursor-pointer-accent-orange-500-807" aria-label="Flex 1 h 1 5 bg slate 700 rounded lg appearance none cursor pointer accent orange 500" />
                      <button
                        type="button"
                        onClick={handleSuggestPrice}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] rounded-lg shadow transition-all duration-150 active:scale-95 shrink-0"
                      >
                        Teklifi Sun ⚡
                      </button>
                    </div>
                    
                    <div className="flex justify-between text-[8px] text-slate-500 font-bold select-none">
                      <span>Min: {Math.round((activeProduct.priceValue || 3500) * 0.80).toLocaleString()} {activeProduct.currency || "GEL"} (-20%)</span>
                      <span>Maks: {Math.round((activeProduct.priceValue || 3500) * 1.05).toLocaleString()} {activeProduct.currency || "GEL"} (+5%)</span>
                    </div>
                  </div>

                  {/* Lock deal trigger button */}
                  <div className="pt-2 border-t border-slate-800/60 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleLockDeal}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-700/20 tracking-wider uppercase active:scale-[0.98] transition border border-emerald-500/20 flex items-center justify-center gap-1.5"
                    >
                      🤝 Teklifi Kabul Et & Kilitle 🔒
                    </button>
                    <p className="text-[8px] text-slate-500 text-center font-semibold">
                      Teklifi kilitlediğinizde HBS platformunda resmi B2B anlaşması tescil edilir ve stok rezerve edilir.
                    </p>
                  </div>
                </>
              ) : (
                /* Locked deal screen */
                <div className="bg-[#122822] border border-emerald-500/30 rounded-2xl p-3.5 text-center space-y-3 shadow-inner animate-fadeIn relative overflow-hidden">
                  
                  {/* Subtle success sparkles in background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                  
                  <div className="space-y-1 relative z-10">
                    <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full tracking-widest uppercase block w-max mx-auto">
                      🎉 B2B ANLAŞMA KİLİTLENDİ
                    </span>
                    <h4 className="text-xs font-black text-emerald-400 mt-2">
                      Teklif Resmiyet Kazandı!
                    </h4>
                    <p className="text-[10px] text-slate-300 font-bold leading-normal">
                      Anlaşma Referans Kodu: <strong className="text-white font-extrabold">{lockedOfferCode}</strong><br/>
                      Final Fiyat: <strong className="text-white font-extrabold">{negotiatedPrice.toLocaleString()} {activeProduct.currency || "GEL"}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-800/40 flex flex-col gap-2 relative z-10">
                    <button
                      type="button"
                      onClick={handleDownloadProforma}
                      className="w-full py-3 bg-[#1e4e3b] hover:bg-[#256348] text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 border border-emerald-600/30 cursor-pointer active:scale-95"
                    >
                      📄 Resmi Proforma Faturayı İndir
                    </button>
                    <p className="text-[8px] text-emerald-400/70 font-semibold leading-relaxed">
                      Proforma fatura sınır ötesi gümrük ve HBS döviz koruması mühürlerini içermektedir.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Slideover Animation style helper */}
            <style>{`
              @keyframes slideLeft {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .animate-slideLeft {
                animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>

          </div>
        </div>
      )}

    </main>
  );
}
