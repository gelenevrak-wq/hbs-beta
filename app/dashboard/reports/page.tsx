"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher, { LanguageCode } from "@/components/language/CompactLanguageSwitcher";

type StockMovement = {
  id: string;
  date: string;
  product: string;
  group: string;
  customer: string;
  user: string;
  type: "Giriş" | "Satış" | "İade" | "Transfer" | "Fire";
  qty: number;
  unitCost: number;
  unitSale: number;
  warehouse: string;
  address: string;
};

const translations = {
  tr: {
    header: "HBS Raporlama Merkezî",
    backButton: "Paneli Aç",
    eyebrow: "Yönetim Analizleri",
    title: "Gelişmiş Depo, Satış & Cari Davranış Raporu",
    desc: "Hangi ürün ne kadar satıldı, hangi tarihler arası ne kadar iade geldi ve hangi müşteri hangi zaman aralığında hangi üründen toplam ne kadarlık alım yaptı sorularının tamamını bu panelden filtreleyin.",
    tabSales: "📊 Finans & Satış Analizleri",
    tabExpiry: "🕒 Son Kullanım Tarihi (SKT) Raporu",
    search: "Arama Kelimesi",
    searchPlaceholder: "Ürün, müşteri, kullanıcı, konum ara...",
    txType: "İşlem Türü",
    prodGroup: "Ürün Grubu",
    start: "Başlangıç Tarihi",
    end: "Bitiş Tarihi",
    cardSalesVal: "Filtrelenmiş Satış Bedeli",
    cardCostVal: "Maliyet Bedeli",
    cardProfitVal: "Tahmini Brüt Kâr",
    cardReturnVal: "Toplam İade Adedi",
    cardUnit: "adet",
    crmTitle: "🎯 Müşteri Bazlı CRM Satın Alım & Trend Analizi",
    crmDesc: "Hangi müşteri hangi zaman aralığında ne kadar hangi üründen toplam kaç liralık alıyor sorusunun detaylı dökümü:",
    crmActivity: "Etkinlik Aralığı:",
    crmTotalQty: "Toplam Alınan Adet:",
    crmItems: "ürün",
    crmBoughtProducts: "Satın Alınan Ürünler",
    crmNoSales: "Bu filtre veya tarih aralığında satış bulunamadı.",
    tableHeaderMovements: "Depo Hareket Kayıtları",
    colDate: "Tarih",
    colProductGroup: "Ürün / Grup",
    colCustomer: "Müşteri",
    colType: "Tür",
    colQty: "Adet",
    colCostSale: "Maliyet/Satış",
    colLocation: "Depo Konumu",
    sideProductTitle: "Hızlı Ürün Satış Hacimleri",
    sideSold: "Satılan:",
    sideReturn: "İade:",
    sideProfit: "Kâr:",
    sideUnit: "ad",
    expiryReportTitle: "Son Kullanım Tarihi (SKT) Analiz Tablosu",
    expiryAlarmTotal: "Takip Edilen Toplam Ürün",
    expiryAlarmExpired: "⚠️ Tarihi Geçmiş (Expired)",
    expiryAlarmCritical: "⏳ Kritik Durum (Son 30 Gün)",
    expiryAlarmWarning: "🔔 Yaklaşan (Son 90 Gün)",
    expiryUnitKey: "kalem",
    expirySearch: "Ürün veya Konum Arama",
    expirySearchPlaceholder: "Ürün adı, SKU, depo veya raf ara...",
    expiryFilterTitle: "Raporlama Kriteri (SKT Durumu)",
    expiryFilterAll: "Tümü",
    expiryFilterExpired: "Tarihi Geçenler",
    expiryFilter30: "Son 30 Gün",
    expiryFilter90: "Son 90 Gün",
    expiryColProduct: "Ürün Adı / SKU",
    expiryColLocation: "Bulunduğu Konum",
    expiryColStock: "Mevcut Stok",
    expiryColDate: "Son Kullanım Tarihi",
    expiryColRemaining: "Kalan Süre",
    expiryColBadge: "Durum Rozeti",
    badgeSafe: "Güvenli",
    badgeCritical: "KRİTİK (30 GÜN)",
    badgeWarning: "YAKLAŞAN (90 GÜN)",
    badgeExpired: "SÜRESİ GEÇMİŞ",
    badgeExpiredDays: "gün önce geçti",
    badgeRemainingDays: "gün kaldı",
    noExpiryRecords: "Arama kriterlerine veya seçilen filtreye uyan SKT takipli ürün bulunamadı.",
    critical: "Kritik",
    all: "Tümü"
  },
  en: {
    header: "HBS Reporting Center",
    backButton: "Open Dashboard",
    eyebrow: "Management Analytics",
    title: "Advanced Warehouse, Sales & Account Report",
    desc: "Filter and analyze product sales volume, return rates, customer transaction histories, and specific warehouse movement details.",
    tabSales: "📊 Finance & Sales Analysis",
    tabExpiry: "🕒 Expiration Date (SKT) Report",
    search: "Search Keyword",
    searchPlaceholder: "Search product, customer, user, location...",
    txType: "Transaction Type",
    prodGroup: "Product Group",
    start: "Start Date",
    end: "End Date",
    cardSalesVal: "Filtered Sales Value",
    cardCostVal: "Cost Value",
    cardProfitVal: "Estimated Gross Profit",
    cardReturnVal: "Total Return Quantity",
    cardUnit: "pcs",
    crmTitle: "🎯 Customer CRM Purchase & Trend Analysis",
    crmDesc: "Detailed breakdown of which customer is buying what product, when, and for how much:",
    crmActivity: "Activity Period:",
    crmTotalQty: "Total Purchased Qty:",
    crmItems: "products",
    crmBoughtProducts: "Purchased Products",
    crmNoSales: "No sales found for this filter or date range.",
    tableHeaderMovements: "Warehouse Movement Records",
    colDate: "Date",
    colProductGroup: "Product / Group",
    colCustomer: "Customer",
    colType: "Type",
    colQty: "Qty",
    colCostSale: "Cost / Sale",
    colLocation: "Warehouse Location",
    sideProductTitle: "Quick Product Sales Volume",
    sideSold: "Sold:",
    sideReturn: "Return:",
    sideProfit: "Profit:",
    sideUnit: "pcs",
    expiryReportTitle: "Expiration Date (SKT) Analysis Table",
    expiryAlarmTotal: "Total Products Tracked",
    expiryAlarmExpired: "⚠️ Expired",
    expiryAlarmCritical: "⏳ Critical Status (Last 30 Days)",
    expiryAlarmWarning: "🔔 Warning Status (Last 90 Days)",
    expiryUnitKey: "items",
    expirySearch: "Product or Location Search",
    expirySearchPlaceholder: "Search product name, SKU, warehouse or shelf...",
    expiryFilterTitle: "Reporting Criteria (SKT Status)",
    expiryFilterAll: "All",
    expiryFilterExpired: "Expired",
    expiryFilter30: "Last 30 Days",
    expiryFilter90: "Last 90 Days",
    expiryColProduct: "Product Name / SKU",
    expiryColLocation: "Location",
    expiryColStock: "Current Stock",
    expiryColDate: "Expiration Date",
    expiryColRemaining: "Remaining Time",
    expiryColBadge: "Status Badge",
    badgeSafe: "SAFE",
    badgeCritical: "CRITICAL (30 DAYS)",
    badgeWarning: "WARNING (90 DAYS)",
    badgeExpired: "EXPIRED",
    badgeExpiredDays: "days ago",
    badgeRemainingDays: "days remaining",
    noExpiryRecords: "No expiration tracked products found matching search criteria.",
    critical: "Critical",
    all: "All"
  },
  ru: {
    header: "Центр отчетности HBS",
    backButton: "Панель управления",
    eyebrow: "Анализ управления",
    title: "Отчет по складу, продажам и счетам",
    desc: "Фильтруйте и анализируйте продажи товаров, объем возвратов, историю транзакций клиентов и детали движения запасов.",
    tabSales: "📊 Финансы и продажи",
    tabExpiry: "🕒 Отчет по срокам годности (SKT)",
    search: "Поисковый запрос",
    searchPlaceholder: "Искать товар, клиента, пользователя...",
    txType: "Тип операции",
    prodGroup: "Группа товаров",
    start: "Начало",
    end: "Конец",
    cardSalesVal: "Фильтрованная стоимость продаж",
    cardCostVal: "Себестоимость",
    cardProfitVal: "Валовая прибыль",
    cardReturnVal: "Кол-во возвратов",
    cardUnit: "шт",
    crmTitle: "🎯 Анализ закупок клиентов по счетам (CRM)",
    crmDesc: "Детальный анализ того, какой клиент покупает какой товар, когда и на какую сумму:",
    crmActivity: "Период активности:",
    crmTotalQty: "Всего куплено шт:",
    crmItems: "товаров",
    crmBoughtProducts: "Купленные товары",
    crmNoSales: "Продажи по этим фильтрам не найдены.",
    tableHeaderMovements: "Движение запасов",
    colDate: "Дата",
    colProductGroup: "Товар / Группа",
    colCustomer: "Клиент",
    colType: "Тип",
    colQty: "Кол-во",
    colCostSale: "Себест. / Продажа",
    colLocation: "Место на складе",
    sideProductTitle: "Объемы продаж товаров",
    sideSold: "Продано:",
    sideReturn: "Возврат:",
    sideProfit: "Прибыль:",
    sideUnit: "шт",
    expiryReportTitle: "Таблица анализа сроков годности (SKT)",
    expiryAlarmTotal: "Всего отслеживаемых товаров",
    expiryAlarmExpired: "⚠️ Просрочено",
    expiryAlarmCritical: "⏳ Критически (Последние 30 дней)",
    expiryAlarmWarning: "🔔 Внимание (Последние 90 дней)",
    expiryUnitKey: "шт",
    expirySearch: "Поиск товара или места",
    expirySearchPlaceholder: "Искать товар, SKU, склад или полку...",
    expiryFilterTitle: "Критерий отчета (Статус SKT)",
    expiryFilterAll: "Все",
    expiryFilterExpired: "Просроченные",
    expiryFilter30: "Последние 30 дней",
    expiryFilter90: "Последние 90 дней",
    expiryColProduct: "Название товара / SKU",
    expiryColLocation: "Местоположение",
    expiryColStock: "Текущий остаток",
    expiryColDate: "Срок годности",
    expiryColRemaining: "Осталось времени",
    expiryColBadge: "Статус",
    badgeSafe: "БЕЗОПАСНО",
    badgeCritical: "КРИТИЧЕСКИ (30 ДНЕЙ)",
    badgeWarning: "ВНИМАНИЕ (90 ДНЕЙ)",
    badgeExpired: "ПРОСРОЧЕНО",
    badgeExpiredDays: "дн. назад",
    badgeRemainingDays: "дн. осталось",
    noExpiryRecords: "Товары с отслеживаемым сроком годности не найдены.",
    critical: "Крит.",
    all: "Все"
  },
  ka: {
    header: "HBS ანგარიშგების ცენტრი",
    backButton: "პანელის გახსნა",
    eyebrow: "მართვის ანალიტიკა",
    title: "საწყობის, გაყიდვებისა და ანგარიშების ანგარიში",
    desc: "გაფილტრეთ და გააანალიზეთ პროდუქტის გაყიდვები, დაბრუნებები, კლიენტის ტრანზაქციები და საწყობის მოძრაობები.",
    tabSales: "📊 ფინანსები და გაყიდვები",
    tabExpiry: "🕒 ვადის გასვლის თარიღის ანგარიში (SKT)",
    search: "საძიებო სიტყვა",
    searchPlaceholder: "მოძებნეთ პროდუქტი, კლიენტი, მომხმარებელი...",
    txType: "ოპერაციის ტიპი",
    prodGroup: "პროდუქტის ჯგუფი",
    start: "დასაწყისი",
    end: "დასასრული",
    cardSalesVal: "გაფილტრული გაყიდვები",
    cardCostVal: "თვითღირებულება",
    cardProfitVal: "საორიენტაციო მოგება",
    cardReturnVal: "დაბრუნებული რაოდენობა",
    cardUnit: "ცალი",
    crmTitle: "🎯 კლიენტების შესყიდვების ანალიზი (CRM)",
    crmDesc: "დეტალური ინფორმაცია იმის შესახებ, თუ რომელი კლიენტი რა პროდუქტს ყიდულობს, როდის და რა ფასად:",
    crmActivity: "აქტივობის პერიოდი:",
    crmTotalQty: "ჯამური რაოდენობა:",
    crmItems: "პროდუქტი",
    crmBoughtProducts: "შესყიდული პროდუქტები",
    crmNoSales: "გაყიდვები ამ ფილტრით ვერ მოიძებნა.",
    tableHeaderMovements: "საწყობის მოძრაობა",
    colDate: "თარიღი",
    colProductGroup: "პროდუქტი / ჯგუფი",
    colCustomer: "კლიენტი",
    colType: "ტიპი",
    colQty: "რაოდ.",
    colCostSale: "თვითღირ./გაყიდვა",
    colLocation: "მდებარეობა საწყობში",
    sideProductTitle: "პროდუქტის გაყიდვების მოცულობა",
    sideSold: "გაყიდული:",
    sideReturn: "დაბრუნებული:",
    sideProfit: "მოგება:",
    sideUnit: "ცალი",
    expiryReportTitle: "ვადების კონტროლის ცხრილი (SKT)",
    expiryAlarmTotal: "სულ კონტროლირებადი",
    expiryAlarmExpired: "⚠️ ვადაგასული",
    expiryAlarmCritical: "⏳ კრიტიკული (ბოლო 30 დღე)",
    expiryAlarmWarning: "🔔 ყურადღება (ბოლო 90 დღე)",
    expiryUnitKey: "ცალი",
    expirySearch: "ძებნა",
    expirySearchPlaceholder: "მოძებნეთ სახელით, SKU, საწყობით ან თაროთი...",
    expiryFilterTitle: "ფილტრის კრიტერიუმი (SKT)",
    expiryFilterAll: "ყველა",
    expiryFilterExpired: "ვადაგასული",
    expiryFilter30: "ბოლო 30 დღე",
    expiryFilter90: "ბოლო 90 დღე",
    expiryColProduct: "პროდუქტის სახელი / SKU",
    expiryColLocation: "მდებარეობა",
    expiryColStock: "მარაგი",
    expiryColDate: "ვადის გასვლა",
    expiryColRemaining: "დარჩენილი დრო",
    expiryColBadge: "სტატუსი",
    badgeSafe: "უსაფრთხო",
    badgeCritical: "კრიტიკული (30 დღე)",
    badgeWarning: "ყურადღება (90 დღე)",
    badgeExpired: "ვადაგასული",
    badgeExpiredDays: "დღის წინ",
    badgeRemainingDays: "დღე დარჩა",
    noExpiryRecords: "ვადაგასული პროდუქტები ვერ მოიძებნა.",
    critical: "კრიტიკული",
    all: "ყველა"
  },
  de: {
    header: "HBS Berichtszentrum",
    backButton: "Panel öffnen",
    eyebrow: "Management-Analysen",
    title: "Erweiterter Lager-, Verkaufs- & Kontenbericht",
    desc: "Filtern und analysieren Sie Produktverkaufsvolumen, Rückgabequoten, Kundentransaktionshistorien und Lagerbewegungsdetails.",
    tabSales: "📊 Finanz- & Verkaufsanalysen",
    tabExpiry: "🕒 Mindesthaltbarkeitsdatum (MHD) Bericht",
    search: "Suchbegriff",
    searchPlaceholder: "Suche nach Produkt, Kunde, Benutzer...",
    txType: "Transaktionsart",
    prodGroup: "Produktgruppe",
    start: "Startdatum",
    end: "Enddatum",
    cardSalesVal: "Gefilterter Verkaufswert",
    cardCostVal: "Massen-Kostenwert",
    cardProfitVal: "Geschätzter Bruttogewinn",
    cardReturnVal: "Gesamt-Rückgabemenge",
    cardUnit: "Stk",
    crmTitle: "🎯 Kundenbasierte CRM Einkaufs- & Trendanalyse",
    crmDesc: "Detaillierte Aufschlüsselung, welcher Kunde wann welche Produkte für wie viel kauft:",
    crmActivity: "Aktivitätszeitraum:",
    crmTotalQty: "Gesamte Abnahmemenge:",
    crmItems: "Produkte",
    crmBoughtProducts: "Gekaufte Produkte",
    crmNoSales: "Für diesen Filter oder Zeitraum wurden keine Verkäufe gefunden.",
    tableHeaderMovements: "Lagerbewegungsprotokolle",
    colDate: "Datum",
    colProductGroup: "Produkt / Gruppe",
    colCustomer: "Kunde",
    colType: "Typ",
    colQty: "Menge",
    colCostSale: "Kosten / Verkauf",
    colLocation: "Lagerplatz",
    sideProductTitle: "Schnelle Produktverkaufsvolumina",
    sideSold: "Verkauft:",
    sideReturn: "Retoure:",
    sideProfit: "Gewinn:",
    sideUnit: "Stk",
    expiryReportTitle: "Mindesthaltbarkeitsdatum (MHD) Analysetabelle",
    expiryAlarmTotal: "Gesamte überwachte Produkte",
    expiryAlarmExpired: "⚠️ Abgelaufen",
    expiryAlarmCritical: "⏳ Kritischer Zustand (Letzte 30 Tage)",
    expiryAlarmWarning: "🔔 Warnzustand (Letzte 90 Tage)",
    expiryUnitKey: "Stk",
    expirySearch: "Produkt- oder Ortssuche",
    expirySearchPlaceholder: "Suche nach Produktname, SKU, Lager oder Regal...",
    expiryFilterTitle: "Berichtskriterium (MHD-Status)",
    expiryFilterAll: "Alle",
    expiryFilterExpired: "Abgelaufen",
    expiryFilter30: "Letzte 30 Tage",
    expiryFilter90: "Letzte 90 Tage",
    expiryColProduct: "Produktname / SKU",
    expiryColLocation: "Standort",
    expiryColStock: "Aktueller Bestand",
    expiryColDate: "Mindesthaltbarkeitsdatum",
    expiryColRemaining: "Verbleibende Zeit",
    expiryColBadge: "Status-Plakette",
    badgeSafe: "SICHER",
    badgeCritical: "KRITISCH (30 TAGE)",
    badgeWarning: "WARNUNG (90 TAGE)",
    badgeExpired: "ABGELAUFEN",
    badgeExpiredDays: "Tagen abgelaufen",
    badgeRemainingDays: "Tage übrig",
    noExpiryRecords: "Es wurden keine MHD-verfolgten Produkte gefunden, die den Suchkriterien entsprechen.",
    critical: "Kritisch",
    all: "Alle"
  }
};

function money(value: number) {
  return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} GEL`;
}

export default function ReportsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Tümü");
  const [group, setGroup] = useState("Tümü");
  const [movementsList, setMovementsList] = useState<StockMovement[]>([]);
  const [activeTab, setActiveTab] = useState<"sales" | "expiry">("sales");
  const [productList, setProductList] = useState<any[]>([]);
  const [expiryFilter, setExpiryFilter] = useState<"all" | "expired" | "30days" | "90days">("all");
  
  // Date Range Filters
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");
  const [language, setLanguage] = useState<LanguageCode | null>(null);

  useEffect(() => {
    // 0. Language Check
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage((savedLanguage as LanguageCode) || "tr");

    // 1. Load movements
    const saved = window.localStorage.getItem("hbs-store-stock-movements");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMovementsList(parsed);
        }
      } catch (e) {
        console.error("Error loading stock movements in reports:", e);
      }
    }

    // 2. Load products
    const savedProducts = window.localStorage.getItem("hbs-store-products");
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          setProductList(parsed);
        }
      } catch (e) {
        console.error("Error loading products in reports:", e);
      }
    }
  }, []);

  const t = translations[language || "tr"];

  const getTypeText = (txType: string) => {
    switch(txType) {
      case "Giriş": return language === "en" ? "Stock In" : language === "ru" ? "Приход" : language === "ka" ? "მიღება" : language === "de" ? "Zugang" : "Giriş";
      case "Satış": return language === "en" ? "Sales" : language === "ru" ? "Продажа" : language === "ka" ? "გაყიდვა" : language === "de" ? "Verkauf" : "Satış";
      case "İade": return language === "en" ? "Return" : language === "ru" ? "Возврат" : language === "ka" ? "დაბრუნება" : language === "de" ? "Retoure" : "İade";
      case "Transfer": return language === "en" ? "Transfer" : language === "ru" ? "Перенос" : language === "ka" ? "გადატანა" : language === "de" ? "Transfer" : "Transfer";
      case "Fire": return language === "en" ? "Waste" : language === "ru" ? "Брак" : language === "ka" ? "დანაკარგი" : language === "de" ? "Ausschuss" : "Fire";
      default: return language === "en" ? "All" : language === "ru" ? "Все" : language === "ka" ? "ყველა" : language === "de" ? "Alle" : "Tümü";
    }
  };

  const groups = useMemo(() => [t.all, ...Array.from(new Set(movementsList.map((m) => m.group)))], [movementsList, t.all]);
  const types = ["Tümü", "Giriş", "Satış", "İade", "Transfer", "Fire"];

  // Filtered dataset incorporating dates
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movementsList.filter((m) => {
      const matchesQ = !q || [m.product, m.group, m.customer, m.user, m.warehouse, m.address].some((v) => v.toLowerCase().includes(q));
      const matchesType = type === "Tümü" || m.type === type;
      const matchesGroup = group === "Tümü" || group === t.all || m.group === group;
      
      const inDateRange = (!startDate || m.date >= startDate) && (!endDate || m.date <= endDate);
      
      return matchesQ && matchesType && matchesGroup && inDateRange;
    });
  }, [query, type, group, startDate, endDate, movementsList]);

  // General Metrics
  const sales = filtered.filter((m) => m.type === "Satış");
  const returns = filtered.filter((m) => m.type === "İade");
  const cost = sales.reduce((sum, m) => sum + m.qty * m.unitCost, 0);
  const revenue = sales.reduce((sum, m) => sum + m.qty * m.unitSale, 0);
  const profit = revenue - cost;
  const returnedQty = returns.reduce((sum, m) => sum + m.qty, 0);

  // Dynamic Product Summaries
  const productStats = useMemo(() => {
    const map = new Map<string, { product: string; qty: number; profit: number; returns: number }>();
    for (const m of filtered) {
      const row = map.get(m.product) || { product: m.product, qty: 0, profit: 0, returns: 0 };
      if (m.type === "Satış") {
        row.qty += m.qty;
        row.profit += m.qty * (m.unitSale - m.unitCost);
      }
      if (m.type === "İade") row.returns += m.qty;
      map.set(m.product, row);
    }
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, [filtered]);

  // CRM Customer-Specific Purchase Analyzer as requested:
  // "hangi müşteri hangi aralıklarda ne kadar hangi üründen toplam kaç paralık alıyor..."
  const customerStats = useMemo(() => {
    const map = new Map<string, {
      customer: string;
      totalSpent: number;
      totalItems: number;
      minDate: string;
      maxDate: string;
      purchases: Record<string, { qty: number; totalCost: number }>;
    }>();

    for (const m of filtered) {
      if (m.type !== "Satış") continue;
      
      const row = map.get(m.customer) || {
        customer: m.customer,
        totalSpent: 0,
        totalItems: 0,
        minDate: m.date,
        maxDate: m.date,
        purchases: {}
      };

      row.totalSpent += m.qty * m.unitSale;
      row.totalItems += m.qty;
      if (m.date < row.minDate) row.minDate = m.date;
      if (m.date > row.maxDate) row.maxDate = m.date;

      const pRow = row.purchases[m.product] || { qty: 0, totalCost: 0 };
      pRow.qty += m.qty;
      pRow.totalCost += m.qty * m.unitSale;
      row.purchases[m.product] = pRow;

      map.set(m.customer, row);
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filtered]);

  // Expiration Date (SKT) analysis calculations
  const expiryData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trackedProducts = productList
      .filter((p) => p.trackExpirationDate && p.expirationDate)
      .map((p) => {
        const expDate = new Date(p.expirationDate);
        expDate.setHours(0, 0, 0, 0);
        
        // Calculate difference in days
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let status: "expired" | "critical" | "warning" | "safe" = "safe";
        if (diffDays < 0) {
          status = "expired";
        } else if (diffDays <= 30) {
          status = "critical";
        } else if (diffDays <= 90) {
          status = "warning";
        }

        return {
          ...p,
          daysRemaining: diffDays,
          status,
        };
      });

    // Sort: expired and closest first
    const sorted = [...trackedProducts].sort((a, b) => a.daysRemaining - b.daysRemaining);

    // Calculate Summary counts
    const summary = {
      expired: trackedProducts.filter((p) => p.status === "expired").length,
      critical: trackedProducts.filter((p) => p.status === "critical").length,
      warning: trackedProducts.filter((p) => p.status === "warning").length,
      safe: trackedProducts.filter((p) => p.status === "safe").length,
    };

    // Filter by active selection
    const filteredByStatus = sorted.filter((p) => {
      if (expiryFilter === "expired") return p.status === "expired";
      if (expiryFilter === "30days") return p.status === "critical" || p.status === "expired";
      if (expiryFilter === "90days") return p.status === "critical" || p.status === "warning" || p.status === "expired";
      return true; // "all"
    });

    // Apply text query search on top
    const q = query.trim().toLowerCase();
    const finalFiltered = filteredByStatus.filter((p) => {
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.warehouse && p.warehouse.toLowerCase().includes(q)) ||
        (p.shelf && p.shelf.toLowerCase().includes(q))
      );
    });

    return {
      items: finalFiltered,
      summary,
    };
  }, [productList, expiryFilter, query]);

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">{t.header}</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">{t.backButton}</Link>
          </div>
        </header>

        {/* Info card */}
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">{t.eyebrow}</p>
          <h1 className="mt-1 text-xl font-black sm:text-3xl">{t.title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{t.desc}</p>
        </section>

        {/* Tab Selector */}
        <nav className="mb-4 flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("sales")}
            className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "sales"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.tabSales}
          </button>
          <button
            onClick={() => setActiveTab("expiry")}
            className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "expiry"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.tabExpiry}
            {expiryData.summary.expired > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-rose-700 animate-pulse">
                {expiryData.summary.expired} {t.critical}
              </span>
            )}
          </button>
        </nav>

        {activeTab === "sales" ? (
          <>
            {/* Date Range selectors */}
            <section className="mb-3 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4 items-end">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">{t.search}</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-200-px-3-py-2-text-xs-outline-none-focus-border-blue-500-90" aria-label="Rounded xl border border slate 200 px 3 py 2 text xs outline none focus border blue 500" />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">{t.start}</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-200-px-3-py-2-text-xs-outline-none-focus-border-blue-500-57" aria-label="Rounded xl border border slate 200 px 3 py 2 text xs outline none focus border blue 500" />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">{t.end}</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-200-px-3-py-2-text-xs-outline-none-focus-border-blue-500-553" aria-label="Rounded xl border border slate 200 px 3 py 2 text xs outline none focus border blue 500" />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"
                >
                  {groups.map((g) => <option key={g}>{g}</option>)}
                </select>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"
                >
                  {types.map((typeVal) => (
                    <option key={typeVal} value={typeVal}>
                      {getTypeText(typeVal)}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Finance summaries */}
            <section className="mb-3 grid gap-2 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs text-slate-500">{t.cardSalesVal}</p>
                <p className="mt-1 text-xl font-black">{money(revenue)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs text-slate-500">{t.cardCostVal}</p>
                <p className="mt-1 text-xl font-black">{money(cost)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm">
                <p className="text-xs text-emerald-700">{t.cardProfitVal}</p>
                <p className="mt-1 text-xl font-black text-emerald-950">{money(profit)}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 shadow-sm">
                <p className="text-xs text-amber-700">{t.cardReturnVal}</p>
                <p className="mt-1 text-xl font-black text-amber-950">{returnedQty} {t.cardUnit}</p>
              </div>
            </section>

            {/* Advanced CRM stats */}
            <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-black text-blue-900 mb-1">{t.crmTitle}</h2>
              <p className="text-xs text-slate-500 mb-4">{t.crmDesc}</p>
              
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {customerStats.map((c) => (
                  <div key={c.customer} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-slate-800">👤 {c.customer}</h3>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">{money(c.totalSpent)}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p>📅 <b>{t.crmActivity}</b> {c.minDate} ➔ {c.maxDate}</p>
                      <p>📦 <b>{t.crmTotalQty}</b> {c.totalItems} {t.crmItems}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-2 space-y-1.5">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">{t.crmBoughtProducts}</span>
                      {Object.entries(c.purchases).map(([prodName, prodInfo]) => (
                        <div key={prodName} className="flex justify-between items-center text-xs text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-100">
                          <span className="truncate max-w-[140px] font-semibold">{prodName}</span>
                          <span className="font-bold text-slate-900">{prodInfo.qty} {t.sideUnit} · {money(prodInfo.totalCost)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {customerStats.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-4">{t.crmNoSales}</p>
                )}
              </div>
            </section>

            {/* Detailed logs */}
            <section className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <h2 className="text-lg font-black">{t.tableHeaderMovements} ({filtered.length})</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black">
                      <tr>
                        <th className="p-2">{t.colDate}</th>
                        <th className="p-2">{t.colProductGroup}</th>
                        <th className="p-2">{t.colCustomer}</th>
                        <th className="p-2">{t.colType}</th>
                        <th className="p-2">{t.colQty}</th>
                        <th className="p-2">{t.colCostSale}</th>
                        <th className="p-2">{t.colLocation}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((m) => (
                        <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                          <td className="p-2 whitespace-nowrap text-slate-500 font-bold">{m.date}</td>
                          <td className="p-2">
                            <span className="font-bold text-slate-800 block">{m.product}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{m.group}</span>
                          </td>
                          <td className="p-2 text-slate-600 font-medium">{m.customer}</td>
                          <td className="p-2">
                            <span className={`rounded-full px-2 py-0.5 font-bold ${m.type === "Satış" ? "bg-emerald-100 text-emerald-800" : m.type === "İade" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>{getTypeText(m.type)}</span>
                          </td>
                          <td className="p-2 font-black text-slate-900">{m.qty}</td>
                          <td className="p-2 text-slate-500 font-medium">{money(m.unitCost)} / {money(m.unitSale)}</td>
                          <td className="p-2">
                            <span className="font-bold block">{m.warehouse}</span>
                            <span className="text-blue-700 text-[10px] font-black">{m.address}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <h2 className="text-lg font-black">{t.sideProductTitle}</h2>
                <div className="space-y-2">
                  {productStats.map((p) => (
                    <div key={p.product} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
                      <p className="font-black text-slate-800 text-xs">{p.product}</p>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>{t.sideSold} <b>{p.qty} {t.sideUnit}</b></span>
                        <span>{t.sideReturn} <b>{p.returns} {t.sideUnit}</b></span>
                        <span className="text-emerald-700 font-bold">{t.sideProfit} {money(p.profit)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Expiration date report panel */}
            <div className="space-y-4 animate-fadeIn">
              
              {/* Expiry Alarm summary metrics */}
              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500">{t.expiryAlarmTotal}</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-950">
                      {productList.filter((p) => p.trackExpirationDate && p.expirationDate).length}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{t.expiryUnitKey}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-semibold text-red-700">{t.expiryAlarmExpired}</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-red-950">
                      {expiryData.summary.expired}
                    </span>
                    <span className="text-xs text-red-650 font-bold">{t.expiryUnitKey}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-semibold text-orange-700">{t.expiryAlarmCritical}</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-orange-950">
                      {expiryData.summary.critical}
                    </span>
                    <span className="text-xs text-orange-650 font-bold">{t.expiryUnitKey}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-semibold text-amber-700">{t.expiryAlarmWarning}</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-950">
                      {expiryData.summary.warning}
                    </span>
                    <span className="text-xs text-amber-650 font-bold">{t.expiryUnitKey}</span>
                  </div>
                </div>
              </section>

              {/* Expiry filtering panel */}
              <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3 items-end">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-500">{t.expirySearch}</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.expirySearchPlaceholder}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-200-px-3-py-2-text-xs-outline-none-focus-border-blue-500-283" aria-label="Rounded xl border border slate 200 px 3 py 2 text xs outline none focus border blue 500" />
                </label>

                <label className="grid gap-1 col-span-2">
                  <span className="text-xs font-bold text-slate-500">{t.expiryFilterTitle}</span>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setExpiryFilter("all")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-black transition-all ${
                        expiryFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {t.expiryFilterAll} ({expiryData.summary.expired + expiryData.summary.critical + expiryData.summary.warning + expiryData.summary.safe})
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpiryFilter("expired")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-black transition-all ${
                        expiryFilter === "expired" ? "bg-red-650 text-white shadow-sm" : "text-red-750 hover:bg-red-50/50"
                      }`}
                    >
                      {t.expiryFilterExpired} ({expiryData.summary.expired})
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpiryFilter("30days")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-black transition-all ${
                        expiryFilter === "30days" ? "bg-orange-600 text-white shadow-sm" : "text-orange-750 hover:bg-orange-50/50"
                      }`}
                    >
                      {t.expiryFilter30} ({expiryData.summary.expired + expiryData.summary.critical})
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpiryFilter("90days")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-black transition-all ${
                        expiryFilter === "90days" ? "bg-amber-500 text-white shadow-sm" : "text-amber-700 hover:bg-amber-50/50"
                      }`}
                    >
                      {t.expiryFilter90} ({expiryData.summary.expired + expiryData.summary.critical + expiryData.summary.warning})
                    </button>
                  </div>
                </label>
              </section>

              {/* Expiry Report main table */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-black text-slate-800 text-sm">{t.expiryReportTitle}</h3>
                  <span className="text-[10px] font-mono text-slate-400">Total {expiryData.items.length} records</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                        <th className="p-3">{t.expiryColProduct}</th>
                        <th className="p-3">{t.expiryColLocation}</th>
                        <th className="p-3 text-center">{t.expiryColStock}</th>
                        <th className="p-3">{t.expiryColDate}</th>
                        <th className="p-3">{t.expiryColRemaining}</th>
                        <th className="p-3 text-right">{t.expiryColBadge}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {expiryData.items.map((p) => {
                        let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                        let statusText = t.badgeSafe;
                        let remainingText = `${p.daysRemaining} ${t.badgeRemainingDays}`;

                        if (p.status === "expired") {
                          badgeColor = "bg-red-100 text-red-800 border-red-200 font-bold";
                          statusText = t.badgeExpired;
                          remainingText = `${Math.abs(p.daysRemaining)} ${t.badgeExpiredDays}`;
                        } else if (p.status === "critical") {
                          badgeColor = "bg-orange-100 text-orange-850 border-orange-200 font-bold animate-pulse";
                          statusText = t.badgeCritical;
                        } else if (p.status === "warning") {
                          badgeColor = "bg-amber-100 text-amber-850 border-amber-200 font-bold";
                          statusText = t.badgeWarning;
                        }

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.sku || "Barkod: " + p.barcode}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold block text-slate-800">{p.warehouse || "Belirtilmemiş"}</span>
                              <span className="text-[10px] text-blue-700 font-black font-mono">Raf: {p.shelf || "—"}</span>
                            </td>
                            <td className="p-3 text-center font-black text-slate-900">
                              {p.quantity || "0"} {t.cardUnit}
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-800">
                              {p.expirationDate}
                            </td>
                            <td className="p-3 font-medium text-slate-500">
                              {remainingText}
                            </td>
                            <td className="p-3 text-right">
                              <span className={`inline-block rounded-full border px-3 py-1 text-[10px] uppercase font-black tracking-wider ${badgeColor}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                      {expiryData.items.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                            {t.noExpiryRecords}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          </>
        )}
      </div>
    </main>
  );
}
