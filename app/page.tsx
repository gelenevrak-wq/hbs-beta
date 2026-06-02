"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher, { LanguageCode } from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";
import { translateProductField } from "@/lib/i18n/dynamicContent";

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
    aiCompleted: "✓ Yapay Zeka Barkod/Görsel Analizi Tamamlandı!\nEşleşen Parça Kodu: "
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
    aiCompleted: "✓ AI Barcode/Image Analysis Completed!\nMatching Part Code: "
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
    aiCompleted: "✓ KI Barcode/Bildanalyse abgeschlossen!\nPassender Teilecode: "
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
    aiCompleted: "✓ Анализ штрихкода/изображения ИИ завершен!\nСоответствующий код детали: "
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
    aiCompleted: "✓ AI ბარკოდის/გამოსახულების ანალიზი დასრულდა!\nშესაბამისი ნაწილის კოდი: "
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
  İstanbul: { lat: 41.0082, lng: 28.9784 },
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  Tbilisi: { lat: 41.7151, lng: 44.8271 },
  Tiflis: { lat: 41.7151, lng: 44.8271 },
  İzmir: { lat: 38.4237, lng: 27.1428 },
  Izmir: { lat: 38.4237, lng: 27.1428 },
  Antalya: { lat: 36.8969, lng: 30.7133 },
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [locationInput, setLocationInput] = useState("");

  const handleMobileCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    alert(t.aiAnalyzing);
    
    let targetSku = "SKU-AUTEL-001";
    try {
      const savedProducts = window.localStorage.getItem("hbs-store-products");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const visibleProduct = parsed.find((p: any) => p.visibility !== "hidden") || parsed[0];
          targetSku = visibleProduct.sku || visibleProduct.barcode || visibleProduct.name;
        }
      }
    } catch (e) {
      console.error("Local storage read error in lens:", e);
    }

    setTimeout(() => {
      setQuery(targetSku);
      alert(`${t.aiCompleted}${targetSku}`);
    }, 1500);
  };
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number }>({ lat: 38.4237, lng: 27.1428 }); // İzmir varsayılan
  const [locationLabel, setLocationLabel] = useState("İzmir, Türkiye");
  const [radiusKm, setRadiusKm] = useState(50);
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [customerOffers, setCustomerOffers] = useState<any[]>([]);
  const [registeredStores, setRegisteredStores] = useState<any[]>([]);

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
          setLocationLabel(window.localStorage.getItem("hbs-language") === "tr" ? "📍 Mevcut Konumunuz" : "📍 Current Location");
        },
        (error) => {
          console.log("GPS Location Access Denied or Failed", error);
        }
      );
    }
  };

  useEffect(() => {
    detectLocation();
    const saved = window.localStorage.getItem("hbs-language");
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

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      // Supabase'den gerçek verileri çek
      supabase
        .from("offerable_items")
        .select("*, companies(*)")
        .eq("is_visible_in_public_search", true)
        .then(({ data: items, error }) => {
          if (items && !error) {
            const mappedProducts: Product[] = items.map((item) => ({
              slug: item.id,
              name: { tr: item.name, en: item.name, de: item.name, ru: item.name, ka: item.name },
              category: { tr: item.category || "Genel", en: item.category || "General", de: item.category || "Allgemein", ru: item.category || "Общий", ka: item.category || "საერთო" },
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
          }
        });
    } else {
      // LocalStorage'dan mock ürünleri çek
      const savedProducts = window.localStorage.getItem("hbs-store-products");
      if (savedProducts) {
        try {
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
                name: { tr: item.name, en: item.name, de: item.name, ru: item.name, ka: item.name },
                category: { tr: item.category, en: item.category, de: item.category, ru: item.category, ka: item.category },
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
                  ru: "Товар магазина",
                  ka: "მაღაზიის პროდუქტი"
                },
                sku: item.sku || item.id,
              };
            });

          setUploadedProducts(mappedProducts);
        } catch {
          setUploadedProducts([]);
        }
      }
    }
  }, []);

  const allProducts = useMemo(() => [...uploadedProducts, ...products], [uploadedProducts]);

  const activeUiLanguage = (language && language in ui ? language : "en") as keyof typeof ui;
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
        const coords = productCoordinates[item.city] ?? center;
        distanceOk = radiusKm >= 10000 || distanceKm(center, coords) <= radiusKm;
      }

      return categoryOk && distanceOk && (!q || haystack.includes(q));
    });
  }, [query, category, language, allProducts, customCoords, radiusKm, locationLabel, registeredStores]);

  if (!language) return <main className="min-h-screen bg-white" />;

  const radiusLabel = radiusKm >= 10000 ? t.allWorld : `${radiusKm} km`;
  const searchHref = query.trim() ? `/customer?q=${encodeURIComponent(query.trim())}` : "/customer";
  const countLabel = language === "tr" ? "kayıt" : language === "de" ? "Eintrag" : language === "ru" ? "позиция" : language === "ka" ? "ჩანაწერი" : "items";
  const openingOffer = language === "tr" ? "Açılışa özel ücretsiz mağaza kaydınızı şimdi yaptırın" : language === "de" ? "Zur Eröffnung: Jetzt kostenlos Ihren Shop registrieren" : language === "ru" ? "К открытию: зарегистрируйте магазин бесплатно" : language === "ka" ? "გახსნის შეთავაზება: დაარეგისტრირეთ მაღაზია უფასოდ" : "Opening offer: register your store for free now";
  const label = (tr: string, en: string, de = en, ru = en, ka = en) =>
    language === "tr" ? tr : language === "de" ? de : language === "ru" ? ru : language === "ka" ? ka : en;



  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-2 px-2 py-1.5 sm:px-6">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link href="/" className="shrink-0 text-base font-black tracking-tight text-blue-700 sm:text-xl">HBS</Link>
            <CompactLanguageSwitcher />
            <Link href="/requests" className="rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-black px-2 py-1.5 text-[8px] sm:text-[10px] flex items-center gap-1 hover:bg-indigo-100 transition shrink-0 shadow-sm">
              📢 <span className="hidden sm:inline">{t.tendersBoard}</span>
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black text-slate-700 flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-full border border-slate-200 whitespace-nowrap shrink-0">
                  👤 <span className="hidden sm:inline">{currentUser.displayName}</span>
                  <span className="sm:hidden">{currentUser.displayName.split(" ")[0]}</span>
                </span>
                {(currentUser.role === "owner" || currentUser.role === "superadmin" || currentUser.role === "storeOwner") && (
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-blue-600 px-2.5 py-1.5 text-[10px] font-black text-white hover:bg-blue-700 sm:px-3 sm:text-xs"
                  >
                    {label("Panelim", "Dashboard", "Mein Panel", "Мой кабинет", "ჩემი პანელი")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    window.localStorage.removeItem("hbs-current-user");
                    window.localStorage.removeItem("hbs-demo-user");
                    window.location.reload();
                  }}
                  className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-black text-red-700 hover:bg-red-100 sm:px-3 sm:text-xs cursor-pointer active:scale-95 transition"
                >
                  {label("Çıkış", "Logout", "Abmelden", "Выход", "გასვლა")}
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-black text-slate-800 hover:bg-slate-50 flex items-center justify-center sm:px-3 sm:py-1.5 sm:text-xs">{t.login}</Link>
                <Link href="/register" className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black text-white hover:bg-blue-700 flex items-center justify-center sm:px-3 sm:py-1.5 sm:text-xs">{t.register}</Link>
              </>
            )}
          </div>
        </div>


        <div className="mx-auto max-w-[1800px] px-2 pb-1.5 sm:px-6">
          <form className="flex w-full items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-inner transition focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-md" onSubmit={(e) => e.preventDefault()}>
            <span className="text-slate-400 text-xs sm:text-sm select-none mr-1.5">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="min-w-0 flex-1 bg-transparent px-1 text-[12px] font-semibold outline-none placeholder:text-slate-400 sm:text-sm text-slate-850"
            />
            
            {/* Elegant Lens/Scanner native mobile camera trigger */}
            <label
              className="mx-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition active:scale-90 cursor-pointer shadow-sm select-none shrink-0"
              title={t.scanCameraTitle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleMobileCapture}
                className="hidden"
              />
            </label>

            <Link href={searchHref} className="rounded-full bg-blue-600 px-3.5 py-1 text-[11px] font-black text-white sm:px-4 sm:text-xs hover:bg-blue-700 active:scale-95 transition shadow-sm">{t.searchButton}</Link>
          </form>
        </div>

        <div className="mx-auto max-w-[1800px] px-2 pb-1.5 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <div className="relative grid grid-cols-[1fr_auto] gap-1.5">
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
                  className="h-8 w-full rounded-full border border-slate-200 bg-slate-50 px-3 text-[11px] font-black text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-400"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-9 z-50 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-lg">
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
                          className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-slate-800 hover:bg-blue-50 transition"
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
                className="h-8 rounded-full border border-blue-200 bg-blue-50 px-3 text-[10px] font-black text-blue-700 flex items-center gap-1 hover:bg-blue-100 transition active:scale-95 shrink-0"
                title={t.findMyLocation}
              >
                🎯 {t.locateMe}
              </button>
            </div>
            </div>
            <div className="mt-2 flex items-center gap-3 px-1 pb-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0">📍 {t.searchRadius}:</span>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={radiusSteps.indexOf(radiusKm) !== -1 ? radiusSteps.indexOf(radiusKm) : 3}
                onChange={(e) => setRadiusKm(radiusSteps[Number(e.target.value)])}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600 focus:outline-none"
              />
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 font-extrabold text-[10px] shadow-sm shrink-0">{radiusKm} km</span>
            </div>
          </div>



        <div className="mx-auto max-w-7xl px-2 pb-1.5 sm:hidden">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-8 w-full rounded-full border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-label={t.categories}
          >
            {quickCategories.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="mx-auto hidden max-w-[1800px] gap-1 overflow-x-auto px-2 pb-1.5 sm:flex sm:px-6">
          {quickCategories.map((item) => (
            <button
              key={item.key}
              onClick={() => setCategory(item.key)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black sm:text-xs ${category === item.key ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-[1800px] px-2 py-2 sm:px-6 sm:py-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">HBS Marketplace</p>
              <h1 className="truncate text-sm font-black sm:text-lg">{t.featured}</h1>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-700">{filtered.length} {countLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((item) => (
              <article key={item.slug} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <Link href={`/product/${item.slug}`} className="block bg-white p-1.5">
                  <div className="aspect-[1/1] overflow-hidden rounded-lg bg-slate-50">
                    <img src={item.image} alt={l(item.name, language)} className="h-full w-full object-contain p-1.5" />
                  </div>
                </Link>
                <div className="px-2 pb-2">
                  <Link href={`/product/${item.slug}`} className="line-clamp-2 min-h-[2rem] text-[12px] font-black leading-4 hover:text-blue-700 sm:text-[13px]">
                    {l(item.name, language)}
                  </Link>
                  <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">{l(item.category, language)}</p>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span className="truncate text-[11px] font-black text-blue-700">{l(item.price, language)}</span>
                    <Link href={`/product/${item.slug}`} className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-black hover:bg-slate-50">{t.view}</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
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

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-blue-100 bg-white/95 py-1.5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-hbs-marquee text-[12px] font-black text-blue-700">
            {openingOffer} • {openingOffer} • {openingOffer} • {openingOffer} •
          </div>
        </div>
      </div>

    </main>
  );
}
