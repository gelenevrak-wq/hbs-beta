"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher, { LanguageCode } from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";
import { translateProductField, parseLocalizedField } from "@/lib/i18n/dynamicContent";

type Localized = Partial<Record<LanguageCode, string>> & { tr: string };

type Product = {
  slug: string;
  name: Localized;
  category: Localized;
  store: string;
  storeSlug: string;
  city: string;
  country: string;
  image: string;
  price: Localized;
  tag: Localized;
  sku: string;
};

type Store = {
  slug: string;
  name: string;
  city: string;
  category: Localized;
  productCount: number;
  image: string;
};

const ui = {
  tr: {
    login: "Giriş",
    register: "Kayıt",
    discover: "Keşfet",
    hero: "Ürün, hizmet ve mağaza keşif platformu",
    sub: "Giriş yapmadan ürünleri gez. İşlem yapmak istediğinde tek HBS hesabı ile devam et.",
    search: "Ürün, hizmet, mağaza, barkod, SKU veya OEM ara",
    searchButton: "Ara",
    photo: "Fotoğraf",
    qr: "QR",
    barcode: "Barkod",
    categories: "Kategoriler",
    featured: "Öne çıkan ürünler",
    stores: "Mağazalar",
    products: "Ürünler",
    view: "İncele",
    all: "Tümü",
    auto: "Oto / Diagnostik",
    hardware: "Hırdavat / Tesisat",
    spare: "Yedek Parça",
    message: "Stok yaparken malını müşterilerine de göster.",
    region: "Arama bölgesi",
    regionPlaceholder: "Şehir / bölge seç",
    radius: "Çap",
    mapPick: "Haritadan seç",
    allWorld: "Tüm dünya",
    customerPanel: "MÜŞTERİ PANELİ",
    myOffers: "Tekliflerim & B2B Pazarlıklarım",
    offersSub: "Satıcılardan talep ettiğiniz fiyat tekliflerini, iskontolu pazarlık taleplerinizi ve güncel onay durumlarını buradan canlı takip edebilirsiniz.",
    tableProduct: "Ürün / Portföy",
    tableType: "Pazarlık Türü",
    tablePrice: "Sunulan Fiyat",
    tableDate: "Talep Tarihi",
    tableStatus: "Durum",
    discountOffer: "İskonto Teklifi",
    quoteRequest: "Fiyat Teklifi İstemi",
    pending: "Bekliyor",
    approved: "Onaylandı",
    rejected: "Reddedildi",
    locateMe: "Konumu Bul",
    findMyLocation: "Konumumu Bul",
    searchRadius: "Arama Yarıçapı",
    searchCityPlaceholder: "Şehir ara... (Örn: Antalya)",
    scanCameraTitle: "Kamera ile Fotoğraf, Barkod veya QR Kod Tara",
    tendersBoard: "İlan Panosu",
    aiAnalyzing: "🔍 Fotoğraf yüklendi. HBS Yapay Zeka analiz ediyor...",
    aiCompleted: "✓ Yapay Zeka Barkod/Görsel Analizi Tamamlandı!\nEşleşen Parça Kodu: ",
    heroTitle: "Ürün Satın. Hizmet Sunun. Kiralayın. Açık Artırma Yapın.",
    heroSubTitle: "Hepsini Tek Platformda Yönetin.",
    heroDesc: "Shopify sadece mağaza açtırır, Amazon ürün sattırır, Airbnb ev kiralatır, eBay açık artırma yaptırır. HBS ise esnafa tüm bu iş modellerini tek bir çatı altında birleştirme gücü verir.",
    openStoreBtn: "🏪 Kendi Mağazanı Aç (Ücretsiz)",
    exploreMarketplaceBtn: "🛍️ Pazaryerini Keşfet",
    activeStores: "Aktif Mağaza",
    listedItems: "Kayıtlı Ürün & Hizmet",
    countries: "Sınır Ötesi Ticaret Ülkesi",
    completedOrders: "Tamamlanan Sipariş & Kiralama",
    footerBranding: "HBS, esnaf için yeni nesil hibrit e-ticaret altyapısını inşa ediyor."
  },
  en: {
    login: "Login",
    register: "Register",
    discover: "Discover",
    hero: "Product, service and store discovery platform",
    sub: "Browse products without signing in. Continue with one HBS account when you want to act.",
    search: "Search product, service, store, barcode, SKU or OEM",
    searchButton: "Search",
    photo: "Photo",
    qr: "QR",
    barcode: "Barcode",
    categories: "Categories",
    featured: "Featured products",
    stores: "Stores",
    products: "Products",
    view: "View",
    all: "All",
    auto: "Auto / Diagnostics",
    hardware: "Hardware / Plumbing",
    spare: "Spare Parts",
    message: "Enter stock once; show it to customers too.",
    region: "Search region",
    regionPlaceholder: "Choose city / region",
    radius: "Radius",
    mapPick: "Pick on map",
    allWorld: "Worldwide",
    customerPanel: "CUSTOMER PANEL",
    myOffers: "My Offers & B2B Negotiations",
    offersSub: "You can track your price quotes, discounted negotiation requests, and real-time approval status from sellers here.",
    tableProduct: "Product / Portfolio",
    tableType: "Negotiation Type",
    tablePrice: "Offered Price",
    tableDate: "Request Date",
    tableStatus: "Status",
    discountOffer: "Discount Offer",
    quoteRequest: "Quote Request",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    locateMe: "Locate Me",
    findMyLocation: "Find My Location",
    searchRadius: "Search Radius",
    searchCityPlaceholder: "Search city... (e.g. Batumi)",
    scanCameraTitle: "Scan Photo, Barcode or QR Code with Camera",
    tendersBoard: "Tenders Board",
    aiAnalyzing: "🔍 Photo uploaded. HBS AI is analyzing...",
    aiCompleted: "✓ AI Barcode/Image Analysis Completed!\nMatching Part Code: ",
    heroTitle: "Sell Products. Offer Services. Rent. Auction.",
    heroSubTitle: "Manage Everything in One Platform.",
    heroDesc: "Shopify builds stores, Amazon sells products, Airbnb rents homes, eBay runs auctions. HBS combines all of these models under one unified storefront for local merchants.",
    openStoreBtn: "🏪 Open Your Store (Free)",
    exploreMarketplaceBtn: "🛍️ Explore Marketplace",
    activeStores: "Active Stores",
    listedItems: "Listed Products & Services",
    countries: "Cross-Border Trade Countries",
    completedOrders: "Completed Orders & Rentals",
    footerBranding: "HBS is building the next generation hybrid commerce platform for local merchants."
  },
  de: {
    login: "Login",
    register: "Registrieren",
    discover: "Entdecken",
    hero: "Plattform zum Entdecken von Produkten, Services und Shops",
    sub: "Produkte ohne Login ansehen. Für Aktionen mit einem HBS-Konto fortfahren.",
    search: "Produkt, Service, Shop, Barcode, SKU oder OEM suchen",
    searchButton: "Suchen",
    photo: "Foto",
    qr: "QR",
    barcode: "Barcode",
    categories: "Kategorien",
    featured: "Top-Produkte",
    stores: "Shops",
    products: "Produkte",
    view: "Ansehen",
    all: "Alle",
    auto: "Auto / Diagnose",
    hardware: "Werkzeug / Sanitär",
    spare: "Ersatzteile",
    message: "Bestand einmal erfassen; Kunden direkt zeigen.",
    region: "Suchgebiet",
    regionPlaceholder: "Stadt / Region wählen",
    radius: "Radius",
    mapPick: "Auf Karte wählen",
    allWorld: "Weltweit",
    customerPanel: "KUNDENPANEL",
    myOffers: "Meine Angebote & B2B-Verhandlungen",
    offersSub: "Hier können Sie Ihre Preisangebote, Rabattanfragen und den Echtzeit-Genehmigungsstatus der Verkäufer verfolgen.",
    tableProduct: "Produkt / Portfolio",
    tableType: "Verhandlungsart",
    tablePrice: "Angebotener Preis",
    tableDate: "Anfragedatum",
    tableStatus: "Status",
    discountOffer: "Rabattangebot",
    quoteRequest: "Preisanfrage",
    pending: "Ausstehend",
    approved: "Genehmigt",
    rejected: "Abgelehnt",
    locateMe: "Standort ermitteln",
    findMyLocation: "Meinen Standort finden",
    searchRadius: "Suchradius",
    searchCityPlaceholder: "Stadt suchen... (z. B. Berlin)",
    scanCameraTitle: "Foto, Barcode oder QR-Code mit der Kamera scannen",
    tendersBoard: "Ausschreibungen",
    aiAnalyzing: "🔍 Foto hochgeladen. HBS KI analysiert...",
    aiCompleted: "✓ KI Barcode/Bildanalyse abgeschlossen!\nPassender Teilecode: ",
    heroTitle: "Verkaufen. Dienstleistungen anbieten. Mieten. Versteigerungen.",
    heroSubTitle: "Alles auf einer Plattform verwalten.",
    heroDesc: "Shopify lässt Sie Shops erstellen, Amazon lässt Sie Produkte verkaufen, Airbnb vermietet Unterkünfte, eBay betreibt Auktionen. HBS vereint all diese Modelle unter einem Dach für lokale Händler.",
    openStoreBtn: "🏪 Eigener Shop eröffnen (Kostenlos)",
    exploreMarketplaceBtn: "🛍️ Marktplatz erkunden",
    activeStores: "Aktive Shops",
    listedItems: "Gelistete Produkte & Services",
    countries: "Grenzüberschreitende Handelsländer",
    completedOrders: "Abgeschlossene Bestellungen & Vermietungen",
    footerBranding: "HBS baut die Hybrid-E-Commerce-Infrastruktur der nächsten Generation für Händler."
  },
  ru: {
    login: "Вход",
    register: "Регистрация",
    discover: "Смотреть",
    hero: "Платформа для поиска товаров, услуг и магазинов",
    sub: "Просматривайте товары без входа. Для действий войдите в единый аккаунт HBS.",
    search: "Товар, услуга, магазин, штрихкод, SKU или OEM",
    searchButton: "Поиск",
    photo: "Фото",
    qr: "QR",
    barcode: "Штрихкод",
    categories: "Категории",
    featured: "Популярные товары",
    stores: "Магазины",
    products: "Товары",
    view: "Открыть",
    all: "Все",
    auto: "Авто / Диагностика",
    hardware: "Инструменты / Сантехника",
    spare: "Запчасти",
    message: "Внеси склад один раз; покажи товар клиентам.",
    region: "Регион поиска",
    regionPlaceholder: "Выберите город / регион",
    radius: "Радиус",
    mapPick: "Выбрать на карте",
    allWorld: "Весь мир",
    customerPanel: "ПАНЕЛЬ КЛИЕНТА",
    myOffers: "Мои предложения и B2B переговоры",
    offersSub: "Здесь вы можете отслеживать свои ценовые предложения, запросы на скидки и статус согласования продавцами в реальном времени.",
    tableProduct: "Товар / Портфолио",
    tableType: "Тип переговоров",
    tablePrice: "Предложенная цена",
    tableDate: "Дата запроса",
    tableStatus: "Статус",
    discountOffer: "Предложение скидки",
    quoteRequest: "Запрос цены",
    pending: "В ожидании",
    approved: "Одобрено",
    rejected: "Отклонено",
    locateMe: "Найти меня",
    findMyLocation: "Найти мое положение",
    searchRadius: "Радиус поиска",
    searchCityPlaceholder: "Поиск города... (напр.: Батуми)",
    scanCameraTitle: "Сканировать фото, штрихкод или QR-код камерой",
    tendersBoard: "Доска тендеров",
    aiAnalyzing: "🔍 Фотография загружена. ИИ HBS анализирует...",
    aiCompleted: "✓ Анализ штрихкода/изображения ИИ завершен!\nСоответствующий код детали: ",
    heroTitle: "Продавайте. Предоставляйте услуги. Арендуйте. Аукционы.",
    heroSubTitle: "Управляйте всем на одной платформе.",
    heroDesc: "Shopify создает магазины, Amazon продает товары, Airbnb сдает жилье, eBay проводит аукционы. HBS объединяет все эти бизнес-модели под одной крышей для местных предпринимателей.",
    openStoreBtn: "🏪 Открыть свой магазин (Бесплатно)",
    exploreMarketplaceBtn: "🛍️ Исследовать маркетплейс",
    activeStores: "Активные магазины",
    listedItems: "Зарегистрировано товаров и услуг",
    countries: "Страны трансграничной торговли",
    completedOrders: "Выполнено заказов и аренды",
    footerBranding: "HBS строит гибридную инфраструктуру электронной коммерции нового поколения для бизнеса."
  },
  ka: {
    login: "შესვლა",
    register: "რეგისტრაცია",
    discover: "ნახვა",
    hero: "პროდუქტების, სერვისებისა და მაღაზიების პლატფორმა",
    sub: "დაათვალიერეთ შესვლის გარეშე. მოქმედებისთვის გამოიყენეთ ერთი HBS ანგარიში.",
    search: "პროდუქტი, სერვისი, მაღაზია, ბარკოდი, SKU ან OEM",
    searchButton: "ძებნა",
    photo: "ფოტო",
    qr: "QR",
    barcode: "ბარკოდი",
    categories: "კატეგორიები",
    featured: "რჩეული პროდუქტები",
    stores: "მაღაზიები",
    products: "პროდუქტები",
    view: "ნახვა",
    all: "ყველა",
    auto: "ავტო / დიაგნოსტიკა",
    hardware: "ინსტრუმენტი / სანტექნიკა",
    spare: "ნაწილები",
    message: "მარაგი ერთხელ შეიყვანე; მომხმარებელსაც აჩვენე.",
    region: "ძებნის ზონა",
    regionPlaceholder: "აირჩიეთ ქალაქი / რეგიონი",
    radius: "რადიუსი",
    mapPick: "რუკაზე არჩევა",
    allWorld: "მთელი მსოფლიო",
    customerPanel: "მომხმარებლის პანელი",
    myOffers: "ჩემი შეთავაზებები და B2B მოლაპარაკებები",
    offersSub: "აქ შეგიძლიათ თვალი ადევნოთ ფასის შეთავაზებებს, ფასდაკლების მოთხოვნებს და გამყიდველების რეალურ დროში დამტკიცების სტატუსს.",
    tableProduct: "პროდუქტი / პორტფოლიო",
    tableType: "მოლაპარაკების ტიპი",
    tablePrice: "შემოთავაზებული ფასი",
    tableDate: "მოთხოვნის თარიღი",
    tableStatus: "სტატუსი",
    discountOffer: "ფასდაკლების შეთავაზება",
    quoteRequest: "ფასის მოთხოვნა",
    pending: "მოლოდინშია",
    approved: "დამტკიცებულია",
    rejected: "უარყოფილია",
    locateMe: "ჩემი მდებარეობა",
    findMyLocation: "ჩემი მდებარეობის პოვნა",
    searchRadius: "ძებნის რადიუსი",
    searchCityPlaceholder: "მოძებნე ქალაქი... (მაგ: ბათუმი)",
    scanCameraTitle: "სკანირება ფოტოთი, ბარკოდით ან QR კოდით კამერით",
    tendersBoard: "ტენდერების დაფა",
    aiAnalyzing: "🔍 ფოტო აიტვირთა. HBS AI აანალიზებს...",
    aiCompleted: "✓ AI ბარკოდის/გამოსახულების ანალიზი დასრულდა!\nშესაბამისი ნაწილის კოდი: ",
    heroTitle: "ყიდვა. სერვისების შეთავაზება. გაქირავება. აუქციონები.",
    heroSubTitle: "მართეთ ყველაფერი ერთ პლატფორმაზე.",
    heroDesc: "Shopify ქმნის მაღაზიებს, Amazon ყიდის პროდუქტებს, Airbnb აქირავებს სახლებს, eBay ატარებს აუქციონებს. HBS აერთიანებს ყველა ამ მოდელს ერთ ჭერქვეშ ადგილობრივი მეწარმეებისთვის.",
    openStoreBtn: "🏪 გახსენით თქვენი მაღაზია (უფასოდ)",
    exploreMarketplaceBtn: "🛍️ ბაზრის შესწავლა",
    activeStores: "აქტიური მაღაზიები",
    listedItems: "რეგისტრირებული პროდუქტი და სერვისი",
    countries: "ტრანსსასაზღვრო ვაჭრობის ქვეყნები",
    completedOrders: "დასრულებული შეკვეთა და გაქირავება",
    footerBranding: "HBS აშენებს შემდეგი თაობის ჰიბრიდულ ელექტრონულ კომერციას მეწარმეებისთვის."
  },
};

type LocationSuggestion = {
  label: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
};

// Statik şehir listesi yerine dinamik OpenStreetMap coğrafi kodlama API'si kullanılmaktadır.

const productCoordinates: Record<string, { lat: number; lng: number }> = {
  Batumi: { lat: 41.6168, lng: 41.6367 },
  Batum: { lat: 41.6168, lng: 41.6367 },
  Tbilisi: { lat: 41.7151, lng: 44.8271 },
  Tiflis: { lat: 41.7151, lng: 44.8271 },
  Kutaisi: { lat: 42.2679, lng: 42.6946 },
  Rustavi: { lat: 41.5394, lng: 45.0008 },
  İstanbul: { lat: 41.0082, lng: 28.9784 },
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  İzmir: { lat: 38.4237, lng: 27.1428 },
  Izmir: { lat: 38.4237, lng: 27.1428 },
  Ankara: { lat: 39.9334, lng: 32.8597 },
  Bursa: { lat: 40.1885, lng: 29.0610 },
  Antalya: { lat: 36.8969, lng: 30.7133 },
  Adana: { lat: 37.0017, lng: 35.3289 },
  Gaziantep: { lat: 37.0662, lng: 37.3833 },
  Konya: { lat: 37.8714, lng: 32.4846 },
  Trabzon: { lat: 41.0027, lng: 39.7168 },
  Samsun: { lat: 41.2867, lng: 36.3333 }
};

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

const radiusSteps = [5, 10, 20, 50, 100, 150, 200, 300, 500, 1000, 1500];

const products: Product[] = [];

const stores: Store[] = [];

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "tr" || value === "en" || value === "ru" || value === "ka" || value === "de";
}

function l(
  value: Localized,
  language: LanguageCode,
  fieldType: 'name' | 'category' | 'description' = 'name'
) {
  return translateProductField(value, fieldType, language as any);
}

export default function HomePage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [aiTranslations, setAiTranslations] = useState<Record<string, { name: string; category: string }>>({});
  const [translatingSlug, setTranslatingSlug] = useState<string | null>(null);
  const [translationVersion, setTranslationVersion] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleTranslationUpdate = () => {
      setTranslationVersion((v) => v + 1);
    };
    window.addEventListener("hbs-translation-updated", handleTranslationUpdate);
    return () => {
      window.removeEventListener("hbs-translation-updated", handleTranslationUpdate);
    };
  }, []);

  const handleAiTranslate = (itemSlug: string, originalName: any, originalCategory: any) => {
    setTranslatingSlug(itemSlug);
    setTimeout(() => {
      const activeLang = language || "tr";
      const mockTranslations: Record<string, Record<string, { name: string; category: string }>> = {
        en: {
          "autel-maxisys-ultra": { name: "Autel MaxiSys Ultra Diagnostic Scanner", category: "Auto Diagnostics" },
          "launch-x431-pro5": { name: "Launch X431 Pro5 Diagnostic Tablet", category: "Auto Diagnostics" },
          "autoboss-v30-scanner": { name: "Autoboss V30 Diagnostics Device", category: "Auto Diagnostics" },
          "bosch-gws-18v-angle-grinder": { name: "Bosch GWS 18V Angle Grinder", category: "Hardware & Tools" }
        },
        de: {
          "autel-maxisys-ultra": { name: "Autel MaxiSys Ultra Diagnosegerät", category: "Auto-Diagnose" },
          "launch-x431-pro5": { name: "Launch X431 Pro5 Diagnosetablet", category: "Auto-Diagnose" },
          "autoboss-v30-scanner": { name: "Autoboss V30 Diagnosegerät", category: "Auto-Diagnose" },
          "bosch-gws-18v-angle-grinder": { name: "Bosch GWS 18V Winkelschleifer", category: "Werkzeuge" }
        },
        ru: {
          "autel-maxisys-ultra": { name: "Диагностический сканер Autel MaxiSys Ultra", category: "Автодиагностика" },
          "launch-x431-pro5": { name: "Диагностический планшет Launch X431 Pro5", category: "Автодиагностика" },
          "autoboss-v30-scanner": { name: "Диагностический сканер Autoboss V30", category: "Автодиагностика" },
          "bosch-gws-18v-angle-grinder": { name: "Угловая шлифмашина Bosch GWS 18V", category: "Инструменты" }
        },
        ka: {
          "autel-maxisys-ultra": { name: "Autel MaxiSys Ultra დიაგნოსტიკური სკანერი", category: "ავტო დიაგნოსტიკა" },
          "launch-x431-pro5": { name: "Launch X431 Pro5 დიაგნოსტიკური ტაბლეტი", category: "ავტო დიაგნოსტიკა" },
          "autoboss-v30-scanner": { name: "Autoboss V30 დიაგნოსტიკური მოწყობილობა", category: "ავტო დიაგნოსტიკა" },
          "bosch-gws-18v-angle-grinder": { name: "Bosch GWS 18V კუთხსახეხი", category: "ხელსაწყოები" }
        }
      };

      const trans = mockTranslations[activeLang]?.[itemSlug] || {
        name: (originalName.tr || originalName) + " (" + activeLang.toUpperCase() + ")",
        category: (originalCategory.tr || originalCategory) + " (" + activeLang.toUpperCase() + ")"
      };

      setAiTranslations(prev => ({ ...prev, [itemSlug]: trans }));
      setTranslatingSlug(null);
    }, 800); // 800ms loading effect
  };
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [locationInput, setLocationInput] = useState("");

  const loadZXing = () => {
    return new Promise((resolve) => {
      if ((window as any).ZXing) {
        resolve((window as any).ZXing);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js";
      script.async = true;
      script.onload = () => {
        resolve((window as any).ZXing);
      };
      script.onerror = () => {
        resolve(null);
      };
      document.head.appendChild(script);
    });
  };

  const handleMobileCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Load ZXing dynamically
    const ZXingClass = await loadZXing();
    if (!ZXingClass) {
      alert(language === "en" ? "Failed to load scanner helper." : "Tarama yardımcısı yüklenemedi.");
      return;
    }

    const reader = new (window as any).ZXing.BrowserMultiFormatReader();
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      try {
        const result = await reader.decodeFromImageElement(img);
        if (result && result.text) {
          setQuery(result.text);
          alert(`${t.aiCompleted}${result.text}`);
        } else {
          alert(language === "en" ? "No readable barcode found in the image." : "Görselde okunabilir barkod bulunamadı.");
        }
      } catch (e) {
        alert(language === "en" ? "No readable barcode found in the image." : "Görselde okunabilir barkod bulunamadı.");
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
  };
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number }>({ lat: 38.4237, lng: 27.1428 }); // İzmir varsayılan
  const [locationLabel, setLocationLabel] = useState("İzmir, Türkiye");
  const [radiusKm, setRadiusKm] = useState(50);
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [customerOffers, setCustomerOffers] = useState<any[]>([]);
  const [registeredStores, setRegisteredStores] = useState<any[]>([]);
  const router = useRouter();

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const matchingStore = registeredStores.find((store: any) => 
      (store.name || "").toLowerCase().trim() === q || 
      (store.code || "").toLowerCase().trim() === q
    ) || (q === "obdtr" ? { code: "obdtr" } : null) || (q === "özgür motor" || q === "ozgur motor" || q === "ozgurmotor" ? { code: "ozgur-motor" } : null);

    if (matchingStore) {
      router.push(`/store/${matchingStore.code}`);
    } else {
      router.push(`/customer?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const [filteredSuggestions, setFilteredSuggestions] = useState<LocationSuggestion[]>([]);

  useEffect(() => {
    const input = locationInput.trim();
    if (input.length < 3) {
      setFilteredSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const activeLanguage = language || "tr";
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&addressdetails=1`, {
        headers: {
          "Accept-Language": activeLanguage,
          "User-Agent": "hbs-marketplace-app"
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const mapped = data.map((item: any) => {
              const addr = item.address || {};
              const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || item.name || "Bilinmeyen Konum";
              const country = addr.country || "";
              const label = item.display_name;
              return {
                label: label,
                city: city,
                country: country,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
              };
            });
            setFilteredSuggestions(mapped);
          }
        })
        .catch((err) => {
          console.error("Nominatim API error, using local fallback:", err);
          const fallbackCities = [
            { label: "Batum, Gürcistan (Batumi)", city: "Batumi", country: "Gürcistan", lat: 41.6168, lng: 41.6367 },
            { label: "Tiflis, Gürcistan (Tbilisi)", city: "Tbilisi", country: "Gürcistan", lat: 41.7151, lng: 44.8271 },
            { label: "İstanbul, Türkiye (Istanbul)", city: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784 },
            { label: "İzmir, Türkiye (Izmir)", city: "Izmir", country: "Türkiye", lat: 38.4237, lng: 27.1428 },
            { label: "Ankara, Türkiye (Ankara)", city: "Ankara", country: "Türkiye", lat: 39.9334, lng: 32.8597 },
            { label: "Antalya, Türkiye (Antalya)", city: "Antalya", country: "Türkiye", lat: 36.8969, lng: 30.7133 },
            { label: "Bakü, Azerbaycan (Baku)", city: "Baku", country: "Azerbaycan", lat: 40.4093, lng: 49.8671 },
            { label: "Berlin, Almanya (Berlin)", city: "Berlin", country: "Almanya", lat: 52.5200, lng: 13.4050 }
          ];
          const cleanQuery = input.toLowerCase();
          const matches = fallbackCities.filter(
            c => c.label.toLowerCase().includes(cleanQuery) || c.city.toLowerCase().includes(cleanQuery)
          );
          setFilteredSuggestions(matches);
        });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [locationInput, language]);

  const detectLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCustomCoords({ lat: latitude, lng: longitude });
          let activeLang = "tr";
          try {
            activeLang = window.localStorage.getItem("hbs-language") || "tr";
          } catch (e) {
            console.error(e);
          }
          setLocationLabel(activeLang === "tr" ? "📍 Mevcut Konumunuz" : "📍 Current Location");
        },
        (error) => {
          console.log("GPS Location Access Denied or Failed", error);
        }
      );
    }
  };

  useEffect(() => {
    detectLocation();
    let saved = null;
    try {
      saved = window.localStorage.getItem("hbs-language");
    } catch (e) {
      console.error(e);
    }
    setLanguage(isLanguageCode(saved) ? saved : "tr");

    // Load current user session
    try {
      const userStr = window.localStorage.getItem("hbs-current-user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error(e);
    }

    // Load registered stores and ensure obdtr is present
    try {
      const storesStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
      let storesList = JSON.parse(storesStr);
      const hasObdtr = storesList.some((st: any) => st.code === "obdtr");
      if (!hasObdtr) {
        storesList = [
          {
            code: "obdtr",
            name: "OBDTR Diagnostics",
            city: "İstanbul",
            address: "Sanal Mağaza, Türkiye çapında kargolama",
            industry: "Oto yedek parçası",
            licenseType: "lifetime",
            isSuspended: false,
            operatingModel: "virtual_delivery",
            serviceCountries: ["TR", "GE"]
          },
          ...storesList
        ];
      }
      setRegisteredStores(storesList);
    } catch (e) {
      console.error(e);
    }

    // Load customer submitted offers
    try {
      const offersStr = window.localStorage.getItem("hbs-store-customer-offers");
      if (offersStr) {
        setCustomerOffers(JSON.parse(offersStr));
      }
    } catch (e) {
      console.error(e);
    }

    const loadFromLocalStorage = () => {
      try {
        const savedProducts = window.localStorage.getItem("hbs-store-products");
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts) as Array<{
            id: string;
            name: string;
            category: string;
            salePrice: string;
            currency: string;
            sku: string;
            imageUrl?: string;
            visibility?: string;
          }>;

          const localStoresStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
          const localStores = JSON.parse(localStoresStr) as Array<{
            code: string;
            name: string;
            city: string;
            address: string;
            operatingModel?: string;
            serviceCountries?: string[];
          }>;

          const mappedProducts: Product[] = parsedProducts
            .filter((item) => item.visibility !== "hidden")
            .map((item) => {
              const matchingStore = localStores.find(st => st.code === "obdtr") || {
                code: "obdtr",
                name: "OBDTR Diagnostics",
                city: "İstanbul",
                operatingModel: "virtual_delivery",
                serviceCountries: ["TR", "GE"]
              };

              return {
                slug: item.id,
                name: parseLocalizedField(item.name),
                category: parseLocalizedField(item.category),
                store: matchingStore.name,
                storeSlug: matchingStore.code,
                city: matchingStore.city,
                country: matchingStore.city.toLowerCase().includes("batum") ? "Gürcistan" : "Türkiye",
                image: item.imageUrl || "/product-images/diagnostic-scanner.svg",
                price: {
                  tr: item.salePrice ? `${item.salePrice} ${item.currency || "GEL"}` : "Teklif isteyin",
                  en: item.salePrice ? `${item.salePrice} ${item.currency || "GEL"}` : "Request quote",
                  de: item.salePrice ? `${item.salePrice} ${item.currency || "GEL"}` : "Angebot anfragen",
                  ru: item.salePrice ? `${item.salePrice} ${item.currency || "GEL"}` : "Запросить цену",
                  ka: item.salePrice ? `${item.salePrice} ${item.currency || "GEL"}` : "ფასის მოთხოვნა"
                },
                tag: {
                  tr: "Mağaza ürünü",
                  en: "Store product",
                  de: "Shop-Produkt",
                  ru: "Тоvar магазина",
                  ka: "მაღაზიის პროდუქტი"
                },
                sku: item.sku || item.id,
              };
            });

          setUploadedProducts(mappedProducts);
        }
      } catch (e) {
        console.error("Error loading products from local storage fallback:", e);
        setUploadedProducts([]);
      }
    };

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      Promise.resolve(
        supabase
          .from("offerable_items")
          .select("*, companies(*)")
          .eq("is_visible_in_public_search", true)
      )
        .then(({ data: items, error }) => {
          if (items && !error) {
            const mappedProducts: Product[] = items
              .filter((item) => item.brand !== "DELETED" && item.category !== "DELETED")
              .map((item) => ({
              slug: item.id,
              name: parseLocalizedField(item.name),
              category: parseLocalizedField(item.category || "Genel"),
              store: item.companies?.name || "HBS Mağaza",
              storeSlug: item.companies?.code || "unknown",
              city: item.companies?.city || "İstanbul",
              country: item.companies?.country || "Türkiye",
              image: item.photo_urls?.[0] || "/product-images/diagnostic-scanner.svg",
              price: {
                tr: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Bilgi / teklif alın",
                en: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Information / request offer",
                de: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Information / Angebot anfragen",
                ru: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "Информация / запросить цену",
                ka: item.sale_price ? `${item.sale_price} ${item.currency || "GEL"}` : "ინფორმაცია / ფასის მოთხოვნა"
              },
              tag: {
                tr: item.type === "product" ? "Ürün" : item.type === "service" ? "Hizmet" : "Kiralık",
                en: item.type === "product" ? "Product" : item.type === "service" ? "Service" : "Rental",
                de: item.type === "product" ? "Produkt" : item.type === "service" ? "Dienstleistung" : "Miete",
                ru: item.type === "product" ? "Товар" : item.type === "service" ? "Услуга" : "Аренда",
                ka: item.type === "product" ? "პროდუქტი" : item.type === "service" ? "სერვისი" : "ქირავდება"
              },
              sku: item.code || item.id,
            }));
            setUploadedProducts(mappedProducts);
          } else {
            if (error) console.error("Supabase items query error:", error);
            loadFromLocalStorage();
          }
        })
        .catch((err) => {
          console.error("Supabase homepage query failed:", err);
          loadFromLocalStorage();
        });
    } else {
      loadFromLocalStorage();
    }
  }, []);

  const allProducts = useMemo(() => [...uploadedProducts, ...products], [uploadedProducts]);

  const activeUiLanguage = (language && language in ui ? language : "tr") as keyof typeof ui;
  const t = ui[activeUiLanguage];

  const quickCategories = useMemo(() => {
    const unique = new Set<string>();
    
    // Sadece aktif (askıya alınmamış) mağazaların sektör adları
    const activeStoreIndustries = new Set(
      registeredStores
        .filter((st: any) => !st.isSuspended)
        .map((st: any) => (st.industry || "").toLowerCase().trim())
    );

    // Aktif mağaza slug listesi
    const activeStoreSlugs = new Set(
      registeredStores
        .filter((st: any) => !st.isSuspended)
        .map((st: any) => st.code.toLowerCase().trim())
    );

    allProducts.forEach((item) => {
      const cat = l(item.category, language ?? "tr");
      if (cat) {
        const catLower = cat.toLowerCase().trim();
        // Bu sektöre ait aktif bir mağaza var mı veya bu ürün aktif bir mağazaya mı ait?
        const isAssociatedWithActiveStore = 
          activeStoreIndustries.has(catLower) || 
          activeStoreSlugs.has(item.storeSlug.toLowerCase().trim());

        if (isAssociatedWithActiveStore) {
          unique.add(cat);
        }
      }
    });

    const list = Array.from(unique).map((catName) => ({
      key: catName.toLowerCase(),
      label: catName,
    }));

    return [{ key: "all", label: t.all }, ...list];
  }, [allProducts, registeredStores, language, t.all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const center = customCoords;

    const activeStoreSlugs = new Set(
      registeredStores
        .filter((st: any) => !st.isSuspended)
        .map((st: any) => st.code.toLowerCase().trim())
    );

    return allProducts.filter((item) => {
      // Sadece aktif mağazaların ürünlerini göster
      const storeSlugLower = item.storeSlug.toLowerCase().trim();
      if (!activeStoreSlugs.has(storeSlugLower)) {
        return false;
      }

      const itemCat = l(item.category, language ?? "tr").toLowerCase();
      const categoryOk =
        category === "all" ||
        itemCat === category;
      const haystack = [l(item.name, language ?? "tr"), l(item.category, language ?? "tr"), item.store, item.city, item.country, item.sku]
        .join(" ")
        .toLowerCase();
      
      const storeObj = registeredStores.find((st: any) => st.code === item.storeSlug) || (item.storeSlug === "obdtr" ? {
        operatingModel: "virtual_delivery",
        serviceCountries: ["TR", "GE"]
      } : null);

      let distanceOk = false;
      const isAllCities = (item.city || "").toLowerCase().includes("tüm şehirler") || (item.city || "").toLowerCase().includes("all cities") || (item.city || "").toLowerCase().includes("her yer");
      if (isAllCities || (storeObj && storeObj.operatingModel === "virtual_delivery")) {
        const activeCountryCode = locationLabel.toLowerCase().includes("gürcistan") || locationLabel.toLowerCase().includes("georgia") || locationLabel.toLowerCase().includes("batum") || locationLabel.toLowerCase().includes("tbilisi") ? "GE" : "TR";
        distanceOk = storeObj?.serviceCountries?.includes(activeCountryCode) || true;
      } else {
        const coords = productCoordinates[item.city] || productCoordinates["Ankara"];
        distanceOk = radiusKm >= 10000 || distanceKm(center, coords) <= radiusKm;
      }

      return categoryOk && distanceOk && (!q || haystack.includes(q));
    });
  }, [query, category, language, allProducts, customCoords, radiusKm, locationLabel, registeredStores]);

  if (!language) return <main className="min-h-screen bg-white" />;

  const radiusLabel = radiusKm >= 10000 ? t.allWorld : `${radiusKm} km`;
  const searchHref = query.trim() ? `/customer?q=${encodeURIComponent(query.trim())}` : "/customer";
  const countLabel = language === "tr" ? "kayıt" : language === "de" ? "Eintrag" : language === "ru" ? "позиция" : language === "ka" ? "ჩანაწერი" : "items";
  const label = (tr: string, en: string, de = en, ru = en, ka = en) =>
    language === "tr" ? tr : language === "de" ? de : language === "ru" ? ru : language === "ka" ? ka : en;



  return (
    <main className="min-h-screen bg-[#f3f6fc] text-slate-950">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-[-10%] w-[40rem] h-[40rem] rounded-full bg-blue-400/5 blur-[130px] pointer-events-none select-none" />
      <div className="absolute top-[25%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-300/5 blur-[120px] pointer-events-none select-none" />

      {/* Slim Elegant Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-4 py-2.5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 text-xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              HBS
            </Link>
            <CompactLanguageSwitcher />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black text-slate-700 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap shrink-0">
                  👤 {currentUser.displayName}
                </span>
                {(currentUser.role === "owner" || currentUser.role === "superadmin" || currentUser.role === "storeOwner") && (
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-1.5 text-[10px] font-black text-white hover:shadow-md transition active:scale-95 sm:px-4 sm:text-xs"
                  >
                    {label("Panelim", "Dashboard", "Mein Panel", "Мой кабинет", "ჩემი პანელი")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    document.cookie = "hbs-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    document.cookie = "hbs-user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    window.localStorage.removeItem("hbs-current-user");
                    window.localStorage.removeItem("hbs-demo-user");
                    window.location.reload();
                  }}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-700 hover:bg-red-100 sm:px-3.5 sm:text-xs cursor-pointer active:scale-95 transition"
                >
                  {label("Çıkış", "Logout", "Abmelden", "Выход", "გასვლა")}
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black text-slate-800 hover:bg-slate-50 flex items-center justify-center sm:px-4 sm:py-2 sm:text-xs">{t.login}</Link>
                <Link 
                  href="/register" 
                  className="rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 px-3.5 py-1.5 text-[10px] font-black text-white hover:shadow-md hover:shadow-indigo-500/10 transition active:scale-95 sm:px-5 sm:py-2 sm:text-xs flex items-center justify-center cursor-pointer shadow-sm relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {t.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 🚀 Premium HBS 2.0 Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 bg-gradient-to-b from-white/70 via-slate-50/30 to-transparent">
        <div className="mx-auto max-w-4xl text-center space-y-6 select-none relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold px-3 py-1 text-[9px] uppercase tracking-wider shadow-sm animate-bounce">
            {label("🌟 YENİ NESİL TİCARET PLATFORMU", "🌟 NEXT-GENERATION COMMERCE PLATFORM", "🌟 HANDELSPLATFORM DER NÄCHSTEN GENERATION", "🌟 ТОРГОВАЯ ПЛАТФОРМА НОВОГО ПОКОЛЕНИЯ", "🌟 ახალი თაობის სავაჭრო პლატფორმა")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5.5xl font-black tracking-tight text-slate-900 leading-none space-y-2">
            <span>{t.heroTitle}</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t.heroSubTitle}
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto font-semibold leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link 
              href="/register" 
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-650 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 px-6 py-4 text-xs sm:text-sm font-black text-white hover:shadow-xl hover:shadow-indigo-500/20 active:scale-[0.97] transition-all duration-300 cursor-pointer text-center"
            >
              {t.openStoreBtn}
            </Link>
            <button 
              onClick={() => {
                document.getElementById("search-panel-anchor")?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-6 py-4 text-xs sm:text-sm font-black text-slate-800 hover:shadow-md active:scale-[0.97] transition-all duration-300 cursor-pointer text-center"
            >
              {t.exploreMarketplaceBtn}
            </button>
          </div>
        </div>

        {/* Brand visual grid representation */}
        <div className="absolute top-10 right-5 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl pointer-events-none select-none"></div>
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl pointer-events-none select-none"></div>
      </section>

      {/* 🟢 Live Activity Ticker (Akış Şeridi) */}
      <section className="bg-slate-900 border-y border-slate-850 py-2.5 overflow-hidden relative select-none z-10 flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex gap-16 animate-marquee whitespace-nowrap text-[10px] sm:text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {label("Yeni Mağaza Açıldı: Özgür Motor (Batum, Gürcistan)", "New Store Opened: Ozgur Motor (Batumi, Georgia)", "Neuer Shop geöffnet: Ozgur Motor (Batumi, Georgien)", "Открыт новый магазин: Ozgur Motor (Батуми, Грузия)", "ახალი მაღაზია გაიხსნა: Ozgur Motor (ბათუმი, საქართველო)")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {label("Son Stok Hareketi: OBDTR Diagnostics Autel MX808S yerleşimi tamamlandı", "Recent Stock Movement: OBDTR Diagnostics Autel MX808S placement completed", "Letzte Lagerbewegung: OBDTR Diagnostics Autel MX808S Platzierung abgeschlossen", "Движение запасов: Размещение OBDTR Diagnostics Autel MX808S выполнено", "მარაგის მოძრაობა: OBDTR Diagnostics Autel MX808S განთავსება დასრულდა")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {label("Canlı B2B Pazarlık: Launch X431 ürünü için %15 iskonto teklifi verildi", "Live B2B Negotiation: 15% discount offered for Launch X431", "Live-B2B-Verhandlung: 15% Rabatt für Launch X431 angeboten", "B2B переговоры: Предложена скидка 15% на Launch X431", "ცოცხალი B2B მოლაპარაკება: Launch X431-ზე შემოთავაზებულია 15% ფასდაკლება")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {label("Yeni Kiralama İlanı: Autoboss V30 Arıza Tespit Cihazı (Haftalık Kiralık)", "New Rental Listing: Autoboss V30 Scanner (Weekly Rental)", "Neues Mietangebot: Autoboss V30 Diagnosegerät (Wöchentliche Miete)", "Новое объявление аренды: Сканер Autoboss V30 (Недельная аренда)", "ახალი გაქირავება: Autoboss V30 სკანერი (ყოველკვირეული ქირაობა)")}
          </span>
        </div>
      </section>


      {/* 🔍 Consolidated Glassmorphic Search & Filters Panel */}
      <section id="search-panel-anchor" className="mx-auto max-w-[1800px] px-4 py-4 sm:px-8 scroll-mt-20">
        <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-lg border border-white/60 p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            {/* Search Input */}
            <form className="flex w-full items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white" onSubmit={handleSearchSubmit}>
              <span className="text-slate-400 text-xs sm:text-sm select-none mr-2">🔍</span>
              <input
                id="global-search-input"
                aria-label={t.search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search}
                className="min-w-0 flex-1 bg-transparent px-1 text-[12px] font-semibold outline-none placeholder:text-slate-400 sm:text-sm text-slate-850"
              />
              
              {/* Camera search */}
              <label
                className="mx-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition active:scale-90 cursor-pointer shadow-sm select-none shrink-0"
                title={t.scanCameraTitle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <input
                  id="camera-capture-input"
                  aria-label="Camera Capture Input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleMobileCapture}
                  className="hidden"
                />
              </label>

              <button type="submit" className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-black text-white hover:bg-blue-700 active:scale-95 transition shadow-sm">{t.searchButton}</button>
            </form>

            {/* City Location Select */}
            <div className="relative grid grid-cols-[1fr_auto] gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={locationLabel || t.searchCityPlaceholder}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-800 outline-none focus:border-blue-500 placeholder:text-slate-400" id="id-page-h-11-w-full-rounded-2xl-border-border-slate-200-bg-white-px-4-text-xs-font-black-text-slate-800-outline-none-focus-border-blue-500-placeholder-text-slate-400-419" aria-label="H 11 w full rounded 2xl border border slate 200 bg white px 4 text xs font black text slate 800 outline none focus border blue 500 placeholder text slate 400" />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-12 z-50 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-lg">
                    {filteredSuggestions.map((item) => (
                      <li key={item.label}>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCoords({ lat: item.lat, lng: item.lng });
                            setLocationLabel(item.label);
                            setLocationInput("");
                            setShowSuggestions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-blue-50 transition"
                        >
                          📍 {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={detectLocation}
                className="h-11 rounded-2xl border border-blue-200 bg-blue-50 px-4 text-xs font-black text-blue-750 flex items-center gap-1.5 hover:bg-blue-100 transition active:scale-95 shrink-0"
                title={t.findMyLocation}
              >
                🎯 {t.locateMe}
              </button>
            </div>
          </div>

          {/* Search Radius Slider */}
          <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0">📍 {t.searchRadius}:</span>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={radiusSteps.indexOf(radiusKm) !== -1 ? radiusSteps.indexOf(radiusKm) : 3}
              onChange={(e) => setRadiusKm(radiusSteps[Number(e.target.value)])}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 focus:outline-none" id="id-page-h-1-5-flex-1-cursor-pointer-appearance-none-rounded-lg-bg-slate-200-accent-blue-600-focus-outline-none-559" aria-label="H 1 5 flex 1 cursor pointer appearance none rounded lg bg slate 200 accent blue 600 focus outline none" />
            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 font-black text-[10px] shadow-sm shrink-0">{radiusLabel}</span>
          </div>

          {/* Categories Selector */}
          <div className="pt-2">
            <div className="sm:hidden">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-800 shadow-sm outline-none focus:border-blue-500"
                aria-label={t.categories}
              >
                {quickCategories.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex gap-1.5 overflow-x-auto pb-1">
              {quickCategories.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCategory(item.key)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition cursor-pointer hover:shadow-sm ${category === item.key ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ Product Listing Section */}
      <div className="mx-auto max-w-[1800px] px-4 py-2 sm:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-md sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">HBS Marketplace</p>
              <h2 className="truncate text-base font-black sm:text-xl">{t.featured}</h2>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{filtered.length} {countLabel}</span>
          </div>
          
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-semibold text-sm">
              📭 Bu bölgede veya kategoride ürün bulunamadı. Yarıçapı artırarak tekrar deneyin.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((item) => (
                <article key={item.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-100 group flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`} className="block bg-white p-2 relative overflow-hidden">
                      <div className="aspect-[1/1] overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                        <img src={item.image} alt={l(item.name, language)} className="max-h-full max-w-full object-contain" />
                      </div>
                    </Link>
                    <div className="px-3 pt-2">
                      <div className="flex justify-between items-start gap-1">
                        <Link href={`/product/${item.slug}`} className="line-clamp-2 min-h-[2.2rem] text-xs font-black leading-4 hover:text-blue-700 sm:text-[13px] text-slate-800 flex-1">
                          {aiTranslations[item.slug] ? aiTranslations[item.slug].name : l(item.name, language)}
                        </Link>
                        
                        {/* 🤖 Interactive AI translation trigger */}
                        {language !== "tr" && language !== null && (
                          <button
                            type="button"
                            disabled={translatingSlug === item.slug}
                            onClick={() => handleAiTranslate(item.slug, item.name, item.category)}
                            className="text-[9px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg px-1.5 py-0.5 border border-blue-200 transition shrink-0 active:scale-95 disabled:opacity-50 select-none"
                            title={label("Yapay Zeka ile Kendi Diline Çevir", "Translate to your language with AI", "Mit KI in Ihre Sprache übersetzen", "Перевести на ваш язык с помощью ИИ", "თარგმნეთ თქვენს ენაზე ხელოვნური ინტელექტით")}
                          >
                            {translatingSlug === item.slug ? "⏳..." : aiTranslations[item.slug] ? "✨ AI" : "🤖"}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <p className="truncate text-[10px] font-bold text-indigo-500 bg-indigo-50/50 inline-block px-2 py-0.5 rounded-full">
                          {aiTranslations[item.slug] ? aiTranslations[item.slug].category : l(item.category, language)}
                        </p>
                        {aiTranslations[item.slug] && (
                          <span className="text-[8px] font-black text-blue-600 uppercase tracking-wider">{label("✓ Çevrildi", "✓ Translated", "✓ Übersetzt", "✓ Переведено", "✓ თარგმნილია")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 pb-3 pt-2 border-t border-slate-50 mt-2 flex items-center justify-between gap-1.5">
                    <span className="truncate text-xs font-black text-blue-700">{l(item.price, language)}</span>
                    <Link href={`/product/${item.slug}`} className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black hover:bg-slate-50 hover:border-slate-300 transition shrink-0">{t.view}</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Dynamic B2B Offers and Bids Tracking Section - Wow Factor! */}
      {currentUser && customerOffers.length > 0 && (
        <div className="mx-auto max-w-[1800px] px-2 pb-6 sm:px-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">{t.customerPanel}</p>
              <h2 className="text-sm font-black sm:text-lg">{t.myOffers}</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.offersSub}
              </p>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/50 p-1">
              <table className="min-w-full text-left text-xs font-semibold">
                <thead className="bg-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3">{t.tableProduct}</th>
                    <th className="p-3">{t.tableType}</th>
                    <th className="p-3">{t.tablePrice}</th>
                    <th className="p-3">{t.tableDate}</th>
                    <th className="p-3 text-right">{t.tableStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerOffers
                    .filter(o => o.customerEmail === currentUser.username)
                    .map((o) => {
                      const translatedName = translateProductField(o.productName, 'name', language as any);
                      
                      const getStatusLabel = (statusStr: string) => {
                        const norm = (statusStr || "").toLowerCase().trim();
                        if (norm === "bekliyor" || norm === "pending") return t.pending;
                        if (norm === "onaylandı" || norm === "onaylandi" || norm === "approved") return t.approved;
                        if (norm === "reddedildi" || norm === "rejected") return t.rejected;
                        return statusStr;
                      };

                      return (
                        <tr key={o.id} className="align-middle">
                          <td className="p-3 font-black text-slate-900">{translatedName}</td>
                          <td className="p-3">
                            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black ${o.type === "bid" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                              {o.type === "bid" ? t.discountOffer : t.quoteRequest}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-700">{o.offerValue}</td>
                          <td className="p-3 text-slate-500 font-bold">{o.date}</td>
                          <td className="p-3 text-right">
                            <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-[10px] font-black border border-amber-200">
                              {getStatusLabel(o.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* 🏢 Premium Footer with brand story and comparison table */}
      <footer className="bg-slate-900 border-t border-slate-850 text-slate-400 py-12 px-4 mt-8 select-none z-10 relative pb-24">
        <div className="mx-auto max-w-[1800px] grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-4 sm:px-8">
          <div className="space-y-3">
            <h3 className="text-white font-black text-lg tracking-tighter">HBS</h3>
            <p className="text-xs font-bold leading-relaxed text-slate-450">
              {t.footerBranding}
            </p>
            <p className="text-[10px] text-slate-500 font-semibold">
              {label("© 2026 HBS Inc. Tüm hakları saklıdır.", "© 2026 HBS Inc. All rights reserved.", "© 2026 HBS Inc. Alle Rechte vorbehalten.", "© 2026 HBS Inc. Все права защищены.", "© 2026 HBS Inc. ყველა უფლება დაცულია.")}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-black text-xs uppercase tracking-wider">
              {label("HBS vs Diğerleri", "HBS vs Others", "HBS vs Andere", "HBS против других", "HBS სხვების წინააღმდეგ")}
            </h4>
            <div className="grid grid-cols-[2fr_1fr] gap-1.5 text-[10px] font-bold">
              <span className="text-slate-400 border-b border-slate-800 pb-1">Shopify</span>
              <span className="text-slate-500 border-b border-slate-800 pb-1 text-right">
                {label("Mağaza Açma", "Store Setup", "Shop-Erstellung", "Создание магазина", "მაღაზიის გახსნა")}
              </span>
              <span className="text-slate-400 border-b border-slate-800 pb-1">Amazon / Trendyol</span>
              <span className="text-slate-500 border-b border-slate-800 pb-1 text-right">
                {label("Ürün Satış", "Product Sales", "Produktverkauf", "Продажа товаров", "პროდუქციის გაყიდვა")}
              </span>
              <span className="text-slate-400 border-b border-slate-800 pb-1">Airbnb / Booking</span>
              <span className="text-slate-500 border-b border-slate-800 pb-1 text-right">
                {label("Kiralama", "Rental", "Vermietung", "Аренда", "ქირაობა")}
              </span>
              <span className="text-slate-400 border-b border-slate-800 pb-1">eBay</span>
              <span className="text-slate-500 border-b border-slate-800 pb-1 text-right">
                {label("Açık Artırma", "Auction", "Auktion", "Аукцион", "აუქციონი")}
              </span>
              <span className="text-blue-400 font-extrabold">HBS Platform</span>
              <span className="text-emerald-400 font-black text-right">
                {label("✓ HEPSİ BİR ARADA", "✓ ALL IN ONE", "✓ ALLES IN EINEM", "✓ ВСЕ В ОДНОМ", "✓ ყველაფერი ერთში")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-black text-xs uppercase tracking-wider">
              {label("Modüllerimiz", "Our Modules", "Unsere Module", "Наши moduli", "ჩვენი მოდულები")}
            </h4>
            <ul className="space-y-1.5 text-xs font-bold">
              <li>• {label("Ürün Kataloğu & Satış", "Product Catalog & Sales", "Produktkatalog & Verkauf", "Каталог товаров и продажи", "პროდუქციის კატალოგი და გაყიდვები")}</li>
              <li>• {label("Randevulu Yerinde Hizmetler", "On-site Services by Appointment", "Vor-Ort-Services nach Termin", "Услуги на месте по записи", "ადგილზე მომსახურება დაჯავშნით")}</li>
              <li>• {label("Günlük / Haftalık Kiralama", "Daily / Weekly Rental", "Tägliche / Wöchentliche Vermietung", "Ежедневная / еженедельная аренда", "დღიური / ყოველკვირეული ქირაობა")}</li>
              <li>• {label("B2B Canlı İskonto Pazarlığı", "B2B Live Discount Negotiation", "B2B Live-Rabattverhandlung", "Живые B2B-переговоры о скидках", "B2B ცოცხალი ფასდაკლების მოლაპარაკება")}</li>
              <li>• {label("Zaman Ayarlı Açık Artırmalar", "Timed Auctions", "Zeitgesteuerte Auktionen", "Временные аукционы", "დროითი აუქციონები")}</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-black text-xs uppercase tracking-wider">
              {label("Geliştirici Notu", "Developer Note", "Entwickler-Hinweis", "Заметка разработчика", "დეველოპერის შენიშვნა")}
            </h4>
            <p className="text-[10px] font-semibold leading-relaxed text-slate-500">
              {label(
                "HBS 2.0, esnafın karmaşık sınır ötesi e-ticaret süreçlerini, yapay zeka entegrasyonu ve sıfır bürokrasi ile yönetmesi için tasarlanmıştır.",
                "HBS 2.0 is designed for merchants to manage complex cross-border e-commerce processes with AI integration and zero bureaucracy.",
                "HBS 2.0 wurde entwickelt, damit Händler komplexe grenzüberschreitende E-Commerce-Prozesse mit KI-Integration und ohne Bürokratie verwalten können.",
                "HBS 2.0 разработан для того, чтобы предприниматели могли управлять сложными трансграничными процессами электронной коммерции с интеграцией ИИ и нулевой бюрократией.",
                "HBS 2.0 შექმნილია იმისთვის, რომ მეწარმეებმა მართონ რთული ტრანსსასაზღვრო ელექტრონული კომერციის პროცესები ხელოვნური ინტელექტის ინტეგრაციითა dan ნულოვანი ბიუროკრატიით."
              )}
            </p>
          </div>
        </div>
      </footer>

      {/* Premium B2B Open Bulletin / Requests Board Call-To-Action Floating Bar */}
      <Link
        href="/requests"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t-2 border-indigo-500/50 bg-[#070c18]/90 py-4 px-5 sm:px-8 shadow-[0_-15px_40px_rgba(99,102,241,0.25)] backdrop-blur-lg transition-all duration-300 hover:bg-[#0b1328] group cursor-pointer ring-1 ring-indigo-500/20"
      >
        <span className="text-[11px] sm:text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-blue-200 uppercase flex items-center gap-2 group-hover:text-blue-100 transition-colors">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          💡 {label(
            "Aradığınızı bulamadıysanız, ilan bırakın, insanlar ve işletmeler size ulaşsın",
            "Didn't find what you were looking for? Post an ad, and let people and businesses reach you",
            "Haben Sie nicht gefunden, was Sie suchen? Schalten Sie eine Anzeige, damit Menschen und Unternehmen Sie erreichen",
            "Не нашли то, что искали? Разместите объявление, чтобы люди и компании могли связаться с вами",
            "ვერ იპოვეთ ის, რასაც ეძებდით? განათავსეთ განცხადება და ხალხი და ბიზნესი დაგიკავშირდებათ"
          )}
        </span>
        <span className="text-xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-bounce transform group-hover:scale-125 transition-all duration-300 flex items-center shrink-0 text-white bg-indigo-600/30 p-2.5 rounded-full ring-2 ring-indigo-405 animate-pulse">
          📢
        </span>
      </Link>

    </main>
  );
}
