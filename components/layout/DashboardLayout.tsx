"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const translations: Record<string, Record<string, string>> = {
  tr: {
    admin: "★ Platform Yönetimi",
    dashboard: "Ana Panel",
    businessModels: "İş Modelleri",
    products: "Ürünler",
    services: "Hizmet / Takvim",
    rentals: "Kiralama",
    tours: "Tur / Deneyim",
    stock: "Stok",
    warehouses: "Depo Haritası",
    stockMovements: "Stok Hareketleri",
    orders: "Siparişler",
    customers: "Müşteriler",
    users: "Mağaza Kullanıcıları",
    requests: "Talep Panosu",
    quotes: "Teklif / Proforma",
    reservations: "Randevu / Rezervasyon",
    campaigns: "Reklam / Kampanyalar",
    reviews: "Yorumlar",
    balances: "Müşteri Bakiyeleri",
    reminders: "Ödeme Hatırlatmaları",
    currency: "Kur Ayarları",
    reports: "Raporlar",
    settings: "Firma Ayarları",
    license: "Lisans",
    help: "Yardım Merkezi",
    activeStore: "Aktif Mağaza",
    features: "Ürün + Hizmet + Kiralama",
    hybridStore: "Karma mağaza"
  },
  en: {
    admin: "★ Platform Administration",
    dashboard: "Main Dashboard",
    businessModels: "Business Models",
    products: "Products",
    services: "Service / Calendar",
    rentals: "Rentals",
    tours: "Tour / Experience",
    stock: "Stock",
    warehouses: "Warehouse Map",
    stockMovements: "Stock Movements",
    orders: "Orders",
    customers: "Customers",
    users: "Store Users",
    requests: "Request Board",
    quotes: "Quotes / Invoices",
    reservations: "Appointments / Booking",
    campaigns: "Ads / Campaigns",
    reviews: "Reviews",
    balances: "Customer Balances",
    reminders: "Payment Reminders",
    currency: "Currency Rates",
    reports: "Reports",
    settings: "Company Settings",
    license: "License",
    help: "Help Center",
    activeStore: "Active Store",
    features: "Product + Service + Rental",
    hybridStore: "Hybrid store"
  },
  ru: {
    admin: "★ Управление платформой",
    dashboard: "Главная панель",
    businessModels: "Бизнес-модели",
    products: "Товары",
    services: "Услуги / Календарь",
    rentals: "Аренда",
    tours: "Туры / Экскурсии",
    stock: "Склад",
    warehouses: "Карта склада",
    stockMovements: "Движение запасов",
    orders: "Заказы",
    customers: "Клиенты",
    users: "Пользователи магазина",
    requests: "Панель запросов",
    quotes: "Цены / Счета",
    reservations: "Записи / Бронь",
    campaigns: "Реклама / Акции",
    reviews: "Отзывы",
    balances: "Баланс клиентов",
    reminders: "Напоминания о платежах",
    currency: "Настройки валют",
    reports: "Отчеты",
    settings: "Настройки компании",
    license: "Лицензия",
    help: "Справка",
    activeStore: "Активный магазин",
    features: "Товар + Услуга + Аренда",
    hybridStore: "Гибридный магазин"
  },
  ka: {
    admin: "★ პლატფორმის ადმინისტრირება",
    dashboard: "მთავარი პანელი",
    businessModels: "ბიზნეს მოდელები",
    products: "პროდუქტები",
    services: "სერვისი / კალენდარი",
    rentals: "გაქირავება",
    tours: "ტური / გამოცდილება",
    stock: "მარაგი",
    warehouses: "საწყობის რუკა",
    stockMovements: "მარაგის მოძრაობა",
    orders: "შეკვეთები",
    customers: "კლიენტები",
    users: "მაღაზიის მომხმარებლები",
    requests: "მოთხოვნების დაფა",
    quotes: "ფასები / პროფორმა",
    reservations: "ჩაწერა / ჯავშანი",
    campaigns: "რეკლამა / კამპანიები",
    reviews: "შეფასებები",
    balances: "კლიენტების ბალანსი",
    reminders: "გადახდის შეხსენებები",
    currency: "ვალუტის კურსი",
    reports: "ანგარიშები",
    settings: "კომპანიის პარამეტრები",
    license: "ლიცენზია",
    help: "დახმარების ცენტრი",
    activeStore: "აქტიური მაღაზია",
    features: "პროდუქტი + სერვისი + გაქირავება",
    hybridStore: "ჰიბრიდული მაღაზია"
  },
  de: {
    admin: "★ Plattformverwaltung",
    dashboard: "Haupt-Dashboard",
    businessModels: "Geschäftsmodelle",
    products: "Produkte",
    services: "Service / Kalender",
    rentals: "Vermietung",
    tours: "Touren / Erlebnisse",
    stock: "Lagerbestand",
    warehouses: "Lagerplan",
    stockMovements: "Lagerbewegungen",
    orders: "Bestellungen",
    customers: "Kunden",
    users: "Shop-Benutzer",
    requests: "Anfrage-Board",
    quotes: "Angebote / Proforma",
    reservations: "Termine / Buchungen",
    campaigns: "Werbung / Kampagnen",
    reviews: "Bewertungen",
    balances: "Kundenbilanzen",
    reminders: "Zahlungserinnerungen",
    currency: "Währungsraten",
    reports: "Berichte",
    settings: "Firmeneinstellungen",
    license: "Lizenz",
    help: "Hilfezentrum",
    activeStore: "Aktiver Shop",
    features: "Produkt + Service + Miete",
    hybridStore: "Hybrid-Shop"
  }
};

const getMenuItems = (lang: string) => {
  const t = translations[lang] || translations.tr;
  return [
    { label: t.dashboard, trLabel: "Ana Panel", href: "/dashboard" },
    { label: t.businessModels, trLabel: "İş Modelleri", href: "/dashboard/business-models" },
    { label: t.products, trLabel: "Ürünler", href: "/dashboard/products" },
    { label: t.services, trLabel: "Hizmet / Takvim", href: "/dashboard/services" },
    { label: t.rentals, trLabel: "Kiralama", href: "/dashboard/rentals" },
    { label: t.tours, trLabel: "Tur / Deneyim", href: "/dashboard/tours" },
    { label: t.stock, trLabel: "Stok", href: "/dashboard/stock" },
    { label: t.warehouses, trLabel: "Depo Haritası", href: "/dashboard/warehouses" },
    { label: t.stockMovements, trLabel: "Stok Hareketleri", href: "/dashboard/stock-movements" },
    { label: t.orders, trLabel: "Siparişler", href: "/dashboard/orders" },
    { label: t.customers, trLabel: "Müşteriler", href: "/dashboard/customers" },
    { label: t.users, trLabel: "Mağaza Kullanıcıları", href: "/dashboard/users" },
    { label: t.requests, trLabel: "Talep Panosu", href: "/dashboard/requests" },
    { label: t.quotes, trLabel: "Teklif / Proforma", href: "/dashboard/quotes" },
    { label: t.reservations, trLabel: "Randevu / Rezervasyon", href: "/dashboard/reservations" },
    { label: t.campaigns, trLabel: "Reklam / Kampanyalar", href: "/dashboard/campaigns" },
    { label: t.reviews, trLabel: "Yorumlar", href: "/dashboard/reviews" },
    { label: t.balances, trLabel: "Müşteri Bakiyeleri", href: "/dashboard/balances" },
    { label: t.reminders, trLabel: "Ödeme Hatırlatmaları", href: "/dashboard/reminders" },
    { label: t.currency, trLabel: "Kur Ayarları", href: "/dashboard/currency" },
    { label: t.reports, trLabel: "Raporlar", href: "/dashboard/reports" },
    { label: t.settings, trLabel: "Firma Ayarları", href: "/dashboard/settings" },
    { label: t.license, trLabel: "Lisans", href: "/dashboard/license" },
    { label: t.help, trLabel: "Yardım Merkezi", href: "/dashboard/help" },
  ];
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  activeMenu: string;
};

export default function DashboardLayout({ children, activeMenu }: DashboardLayoutProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState("tr");
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(window.localStorage.getItem("hbs-current-user") || "null");
      if (user) {
        if (user.role === "superadmin") {
          setIsAdmin(true);
        } else {
          const storeCode = user.storeSlugs?.[0];
          if (storeCode) {
            const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
            const matchingStore = localStores.find((s: any) => s.code === storeCode);
            if (matchingStore && matchingStore.isActive === false) {
              window.localStorage.removeItem("hbs-current-user");
              window.localStorage.removeItem("hbs-demo-user");
              alert("Bağlı olduğunuz mağaza pasife alınmıştır. Oturumunuz kapatılıyor.");
              window.location.replace("/login");
              return;
            }
          }
        }
      }
      const savedLanguage = window.localStorage.getItem("hbs-language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      if (typeof window !== "undefined") {
        setCurrentPath(window.location.pathname);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const t = translations[language] || translations.tr;
  const menuItems = getMenuItems(language);
  const activeMenuItems = isAdmin 
    ? [{ label: t.admin, trLabel: "★ Platform Yönetimi", href: "/dashboard/admin" }, ...menuItems]
    : menuItems;

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-3 lg:sticky lg:top-0 lg:block">
          <div className="flex h-full flex-col">
            <Link href="/" className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="text-xl font-black tracking-tight">HBS</div>
              <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">Hybrid Business System</div>
            </Link>

            <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-700">{t.activeStore}</div>
              <div className="mt-1 text-base font-black">OBDTR / Demo</div>
              <div className="mt-2 inline-flex rounded-full border border-emerald-300 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-900">{t.features}</div>
            </div>

            <nav className="hbs-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {activeMenuItems.map((item) => {
                const isActive = item.href === currentPath || item.trLabel === activeMenu || item.label === activeMenu;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                      isActive ? "bg-blue-50 text-blue-900 ring-1 ring-blue-200" : "text-slate-700 hover:bg-slate-100 hover:text-slate-955"
                    }`}
                  >
                    <span className="font-semibold">{item.label}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-black">HBS</Link>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900">{t.hybridStore}</span>
            </div>
            <div className="hbs-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
              {activeMenuItems.map((item) => {
                const isActive = item.href === currentPath || item.trLabel === activeMenu || item.label === activeMenu;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                      isActive ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1850px] p-3 sm:p-4 lg:p-5">{children}</div>
        </section>
      </div>
    </main>
  );
}
