"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";

const texts = {
  tr: {
    home: "Ana Sayfa",
    customerPortal: "Müşteri Portalı",
    storeFront: "Mağaza Vitrini",
    eyebrow: "MAĞAZA PANELİ",
    title: "HBS Mağaza Yönetim Merkezi",
    description:
      "Bu panel mağazanızın ürünlerini, stoklarını, müşteri taleplerini, siparişlerini, mesajlarını ve mağaza vitrinini yönetmek için kullanılır.",
    cleanNoticeTitle: "Gerçek veri bekleniyor",
    cleanNotice:
      "Bu ekranda sahte satış, sahte stok, sahte müşteri veya gerçek olmayan finansal veri gösterilmez. Veriler mağaza kurulumu ve veritabanı bağlantısından sonra oluşacaktır.",
    todayRequests: "Bugünkü Talepler",
    activeProducts: "Aktif Ürün",
    waitingMessages: "Bekleyen Mesaj",
    stockAlerts: "Stok Uyarısı",
    setupTitle: "İlk Kurulum Adımları",
    step1: "Firma bilgilerini tamamla",
    step2: "Şube ve konum bilgilerini gir",
    step3: "İlk depoyu oluştur",
    step4: "Depo haritasını hazırla",
    step5: "İlk ürün veya hizmeti ekle",
    step6: "Müşteri portalı görünürlüğünü ayarla",
    statusWaiting: "Bekliyor",
    actionStart: "Başla",
    modulesTitle: "Mağaza Modülleri",
    tagNew: "Yeni",
    tagNext: "Sıradaki",
    tagLive: "Canlı Vitrin",
    tagPlanned: "Planlandı",
    moduleRequests: "Müşteri Talepleri",
    moduleRequestsDesc:
      "Mağaza vitrini üzerinden gelen ürün soruları, teklif talepleri ve sipariş isteklerini yönetin.",
    moduleProducts: "Ürün / Hizmet Yönetimi",
    moduleProductsDesc:
      "Ürün ekleme, barkod, SKU, OEM kodu, fiyat, stok miktarı ve vitrin görünürlüğünü yönetin.",
    moduleServices: "Hizmet / Randevu / Tur Yönetimi",
    moduleServicesDesc:
      "Hizmet süresi, personel, kapasite, boş zaman dilimleri, tur kontenjanı, kiralama süresi ve rezervasyon fiyatlarını yönetin.",
    moduleWarehouse: "Depo ve Stok Yönetimi",
    moduleWarehouseDesc:
      "Stok giriş/çıkış, depo, raf, transfer, fire, iade ve manuel düzeltme işlemlerini yönetin.",
    moduleStorefront: "Mağaza Vitrini",
    moduleStorefrontDesc:
      "Müşterilerin gördüğü mağaza sayfasını, ürün görünürlüğünü ve iletişim bilgilerini kontrol edin.",
    moduleCustomers: "Müşteri İlişkileri",
    moduleCustomersDesc:
      "Müşteri kayıtları, müşteri mesajları, firma bağlantıları ve işlem geçmişini takip edin.",
    moduleUsers: "Mağaza Kullanıcıları",
    moduleUsersDesc:
      "İlk mağaza sahibi yönetici olur; yeni personel, rol ve erişim yetkileri bu bölümden tanımlanır.",
    moduleOrders: "Sipariş ve Teklifler",
    moduleOrdersDesc:
      "Sepet talepleri, teklif dönüşleri, sipariş durumları ve mağaza cevaplarını yönetin.",
    moduleReports: "Raporlar",
    moduleReportsDesc:
      "Stok değeri, arama talebi, eksik stok, ürün performansı ve mağaza raporlarını takip edin.",
    moduleSettings: "Firma Ayarları",
    moduleSettingsDesc:
      "Firma bilgileri, kullanıcılar, şube ayarları, dil ve vitrin tercihlerini yönetin.",
    footer:
      "Depo, ürün, müşteri ve sipariş verileri gerçek kayıtlar oluştuğunda burada raporlanacaktır.",
  },
  en: {
    home: "Home",
    customerPortal: "Customer Portal",
    storeFront: "Storefront",
    eyebrow: "STORE PANEL",
    title: "HBS Store Management Center",
    description:
      "This panel is used to manage your store products, stock, customer requests, orders, messages and customer-facing storefront.",
    cleanNoticeTitle: "Waiting for real data",
    cleanNotice:
      "No fake sales, fake stock, fake customers or non-real financial data is shown on this screen. Data will appear after store setup and database connection.",
    todayRequests: "Today's Requests",
    activeProducts: "Active Products",
    waitingMessages: "Waiting Messages",
    stockAlerts: "Stock Alerts",
    setupTitle: "Initial Setup Steps",
    step1: "Complete company information",
    step2: "Enter branch and location information",
    step3: "Create the first warehouse",
    step4: "Prepare the warehouse map",
    step5: "Add the first product or service",
    step6: "Set customer portal visibility",
    statusWaiting: "Waiting",
    actionStart: "Start",
    modulesTitle: "Store Modules",
    tagNew: "New",
    tagNext: "Next",
    tagLive: "Live Storefront",
    tagPlanned: "Planned",
    moduleRequests: "Customer Requests",
    moduleRequestsDesc:
      "Manage product questions, quotation requests and order requests coming from the storefront.",
    moduleProducts: "Product / Service Management",
    moduleProductsDesc:
      "Manage product creation, barcode, SKU, OEM code, price, stock quantity and storefront visibility.",
    moduleServices: "Service / Appointment / Tour Management",
    moduleServicesDesc:
      "Manage service duration, staff, capacity, available slots, tour capacity, rental period and reservation pricing.",
    moduleWarehouse: "Warehouse and Stock Management",
    moduleWarehouseDesc:
      "Manage stock in/out, warehouse, shelf, transfer, waste, return and manual adjustment operations.",
    moduleStorefront: "Storefront",
    moduleStorefrontDesc:
      "Control the customer-facing store page, product visibility and contact information.",
    moduleCustomers: "Customer Relations",
    moduleCustomersDesc:
      "Track customer records, messages, company connections and transaction history.",
    moduleUsers: "Store Users",
    moduleUsersDesc:
      "The first store owner becomes admin; new staff, roles and access permissions are managed here.",
    moduleOrders: "Orders and Quotations",
    moduleOrdersDesc:
      "Manage cart requests, quotation replies, order statuses and store responses.",
    moduleReports: "Reports",
    moduleReportsDesc:
      "Track stock value, search demand, missing stock, product performance and store reports.",
    moduleSettings: "Company Settings",
    moduleSettingsDesc:
      "Manage company information, users, branch settings, language and storefront preferences.",
    footer:
      "Warehouse, product, customer and order data will be reported here when real records are created.",
  },
  ru: {
    home: "Главная",
    customerPortal: "Портал клиента",
    storeFront: "Витрина магазина",
    eyebrow: "ПАНЕЛЬ МАГАЗИНА",
    title: "Центр управления магазином HBS",
    description:
      "Эта панель используется для управления товарами, складом, запросами клиентов, заказами, сообщениями и витриной магазина.",
    cleanNoticeTitle: "Ожидание реальных данных",
    cleanNotice:
      "На этом экране не отображаются фиктивные продажи, склад, клиенты или нереальные финансовые данные. Данные появятся после настройки магазина и подключения базы данных.",
    todayRequests: "Запросы сегодня",
    activeProducts: "Активные товары",
    waitingMessages: "Ожидающие сообщения",
    stockAlerts: "Складские предупреждения",
    setupTitle: "Первые шаги настройки",
    step1: "Заполнить данные компании",
    step2: "Добавить филиалы и местоположение",
    step3: "Создать первый склад",
    step4: "Подготовить карту склада",
    step5: "Добавить первый товар или услугу",
    step6: "Настроить видимость в клиентском портале",
    statusWaiting: "Ожидает",
    actionStart: "Начать",
    modulesTitle: "Модули магазина",
    tagNew: "Новое",
    tagNext: "Следующее",
    tagLive: "Витрина",
    tagPlanned: "Планируется",
    moduleRequests: "Запросы клиентов",
    moduleRequestsDesc:
      "Управление вопросами по товарам, запросами цен и заказами из витрины магазина.",
    moduleProducts: "Управление товарами / услугами",
    moduleProductsDesc:
      "Управление товарами, штрихкодами, SKU, OEM-кодами, ценами, остатками и видимостью.",
    moduleServices: "Услуги / запись / туры",
    moduleServicesDesc:
      "Управление длительностью услуги, персоналом, вместимостью, свободными слотами, турами, арендой и ценами.",
    moduleWarehouse: "Склад и остатки",
    moduleWarehouseDesc:
      "Управление приходом/расходом, складом, полками, переносами, браком, возвратами и корректировками.",
    moduleStorefront: "Витрина магазина",
    moduleStorefrontDesc:
      "Управление страницей магазина для клиентов, видимостью товаров и контактной информацией.",
    moduleCustomers: "Отношения с клиентами",
    moduleCustomersDesc:
      "Клиентские записи, сообщения, связи с компаниями и история операций.",
    moduleUsers: "Пользователи магазина",
    moduleUsersDesc:
      "Первый владелец магазина становится администратором; сотрудники, роли и доступ управляются здесь.",
    moduleOrders: "Заказы и предложения",
    moduleOrdersDesc:
      "Управление запросами корзины, ответами на предложения, статусами заказов и ответами магазина.",
    moduleReports: "Отчеты",
    moduleReportsDesc:
      "Остаточная стоимость, спрос, отсутствующие товары, эффективность товаров и отчеты магазина.",
    moduleSettings: "Настройки компании",
    moduleSettingsDesc:
      "Данные компании, пользователи, филиалы, язык и настройки витрины.",
    footer:
      "Данные склада, товаров, клиентов и заказов будут отображаться здесь после создания реальных записей.",
  },
  ka: {
    home: "მთავარი",
    customerPortal: "კლიენტის პორტალი",
    storeFront: "მაღაზიის ვიტრინა",
    eyebrow: "მაღაზიის პანელი",
    title: "HBS მაღაზიის მართვის ცენტრი",
    description:
      "ეს პანელი გამოიყენება მაღაზიის პროდუქტების, მარაგის, კლიენტის მოთხოვნების, შეკვეთების, შეტყობინებებისა და ვიტრინის სამართავად.",
    cleanNoticeTitle: "რეალური მონაცემების მოლოდინი",
    cleanNotice:
      "ამ ეკრანზე არ ჩანს ყალბი გაყიდვები, ყალბი მარაგი, ყალბი კლიენტები ან არარეალური ფინანსური მონაცემები. მონაცემები გამოჩნდება მაღაზიის დაყენებისა და ბაზის დაკავშირების შემდეგ.",
    todayRequests: "დღევანდელი მოთხოვნები",
    activeProducts: "აქტიური პროდუქტები",
    waitingMessages: "მომლოდინე შეტყობინებები",
    stockAlerts: "მარაგის გაფრთხილება",
    setupTitle: "პირველი დაყენების ნაბიჯები",
    step1: "კომპანიის ინფორმაციის დასრულება",
    step2: "ფილიალისა და მდებარეობის შეყვანა",
    step3: "პირველი საწყობის შექმნა",
    step4: "საწყობის რუკის მომზადება",
    step5: "პირველი პროდუქტის ან სერვისის დამატება",
    step6: "კლიენტის პორტალის ხილვადობის დაყენება",
    statusWaiting: "ელოდება",
    actionStart: "დაწყება",
    modulesTitle: "მაღაზიის მოდულები",
    tagNew: "ახალი",
    tagNext: "შემდეგი",
    tagLive: "ვიტრინა",
    tagPlanned: "დაგეგმილია",
    moduleRequests: "კლიენტის მოთხოვნები",
    moduleRequestsDesc:
      "მართეთ ვიტრინიდან შემოსული პროდუქტის კითხვები, შეთავაზებები და შეკვეთის მოთხოვნები.",
    moduleProducts: "პროდუქტის / სერვისის მართვა",
    moduleProductsDesc:
      "მართეთ პროდუქტი, შტრიხკოდი, SKU, OEM კოდი, ფასი, მარაგი და ვიტრინის ხილვადობა.",
    moduleServices: "Hizmet / Randevu / Tur Yönetimi",
    moduleServicesDesc:
      "Hizmet süresi, personel, kapasite, boş zaman dilimleri, tur kontenjanı, kiralama süresi ve rezervasyon fiyatlarını yönetin.",
    moduleWarehouse: "საწყობი და მარაგი",
    moduleWarehouseDesc:
      "მართეთ მარაგის მიღება/გასვლა, საწყობი, თარო, გადატანა, დანაკარგი, დაბრუნება და კორექცია.",
    moduleStorefront: "მაღაზიის ვიტრინა",
    moduleStorefrontDesc:
      "მართეთ კლიენტებისთვის ხილული მაღაზიის გვერდი, პროდუქტის ხილვადობა და საკონტაქტო ინფორმაცია.",
    moduleCustomers: "კლიენტებთან ურთიერთობა",
    moduleCustomersDesc:
      "კლიენტების ჩანაწერები, შეტყობინებები, კომპანიებთან კავშირები და ოპერაციების ისტორია.",
    moduleUsers: "მაღაზიის მომხმარებლები",
    moduleUsersDesc:
      "პირველი მფლობელი ხდება ადმინისტრატორი; თანამშრომლები, როლები და წვდომა აქ იმართება.",
    moduleOrders: "შეკვეთები და შეთავაზებები",
    moduleOrdersDesc:
      "მართეთ კალათის მოთხოვნები, შეთავაზების პასუხები, შეკვეთის სტატუსები და მაღაზიის პასუხები.",
    moduleReports: "რეპორტები",
    moduleReportsDesc:
      "მარაგის ღირებულება, მოთხოვნა, ნაკლული მარაგი, პროდუქტის ეფექტიანობა და მაღაზიის ანგარიშები.",
    moduleSettings: "კომპანიის პარამეტრები",
    moduleSettingsDesc:
      "კომპანიის ინფორმაცია, მომხმარებლები, ფილიალები, ენა და ვიტრინის პარამეტრები.",
    footer:
      "საწყობის, პროდუქტის, კლიენტისა და შეკვეთის მონაცემები აქ გამოჩნდება რეალური ჩანაწერების შექმნის შემდეგ.",
  },
  de: {
    home: "Startseite",
    customerPortal: "Kundenportal",
    storeFront: "Shop-Schaufenster",
    eyebrow: "SHOP-PANEL",
    title: "HBS Shop-Verwaltungszentrum",
    description:
      "Dieses Panel dient zur Verwaltung Ihrer Produkte, Bestände, Kundenanfragen, Bestellungen, Nachrichten und Ihres Shop-Schaufensters.",
    cleanNoticeTitle: "Warten auf echte Daten",
    cleanNotice:
      "Auf diesem Bildschirm werden keine fiktiven Verkäufe, Lagerbestände, Kunden oder unrealistischen Finanzdaten angezeigt. Daten erscheinen nach Einrichtung des Shops und Datenbankanbindung.",
    todayRequests: "Heutige Anfragen",
    activeProducts: "Aktive Produkte",
    waitingMessages: "Wartende Nachrichten",
    stockAlerts: "Bestandswarnung",
    setupTitle: "Erste Einrichtungsschritte",
    step1: "Firmendaten vervollständigen",
    step2: "Filial- und Standortdaten eingeben",
    step3: "Erstes Lager erstellen",
    step4: "Lagerplan vorbereiten",
    step5: "Erstes Produkt oder Service hinzufügen",
    step6: "Sichtbarkeit im Kundenportal einstellen",
    statusWaiting: "Wartet",
    actionStart: "Starten",
    modulesTitle: "Shop-Module",
    tagNew: "Neu",
    tagNext: "Nächster Schritt",
    tagLive: "Live-Schaufenster",
    tagPlanned: "Geplant",
    moduleRequests: "Kundenanfragen",
    moduleRequestsDesc:
      "Verwalten Sie Produktfragen, Angebotsanfragen und Bestellwünsche aus dem Shop-Schaufenster.",
    moduleProducts: "Produkt- / Serviceverwaltung",
    moduleProductsDesc:
      "Verwalten Sie Produkte, Barcode, SKU, OEM-Code, Preise, Bestand und Sichtbarkeit.",
    moduleServices: "Hizmet / Randevu / Tur Yönetimi",
    moduleServicesDesc:
      "Hizmet süresi, personel, kapasite, boş zaman dilimleri, tur kontenjanı, kiralama süresi ve rezervasyon fiyatlarını yönetin.",
    moduleWarehouse: "Lager- und Bestandsverwaltung",
    moduleWarehouseDesc:
      "Verwalten Sie Wareneingang/-ausgang, Lager, Regal, Transfer, Ausschuss, Rückgabe und Korrekturen.",
    moduleStorefront: "Shop-Schaufenster",
    moduleStorefrontDesc:
      "Kontrollieren Sie die Kundenseite des Shops, Produktsichtbarkeit und Kontaktinformationen.",
    moduleCustomers: "Kundenbeziehungen",
    moduleCustomersDesc:
      "Verfolgen Sie Kundendaten, Nachrichten, Firmenbeziehungen und Transaktionshistorie.",
    moduleUsers: "Shop-Benutzer",
    moduleUsersDesc:
      "Der erste Shop-Inhaber wird Administrator; Mitarbeiter, Rollen und Zugriffsrechte werden hier verwaltet.",
    moduleOrders: "Bestellungen und Angebote",
    moduleOrdersDesc:
      "Verwalten Sie Warenkorbanfragen, Angebotsantworten, Bestellstatus und Shop-Antworten.",
    moduleReports: "Berichte",
    moduleReportsDesc:
      "Verfolgen Sie Lagerwert, Suchnachfrage, fehlende Bestände, Produktleistung und Shopberichte.",
    moduleSettings: "Firmeneinstellungen",
    moduleSettingsDesc:
      "Verwalten Sie Firmendaten, Benutzer, Filialen, Sprache und Schaufenster-Einstellungen.",
    footer:
      "Lager-, Produkt-, Kunden- und Bestelldaten werden hier angezeigt, sobald echte Datensätze erstellt wurden.",
  },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return (
    value === "tr" ||
    value === "en" ||
    value === "ru" ||
    value === "ka" ||
    value === "de"
  );
}

export default function DashboardPage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
    try { setCurrentUser(JSON.parse(window.localStorage.getItem("hbs-current-user") || "null")); } catch { setCurrentUser(null); }
  }, []);

  if (!language) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  const currentText = texts[language];

  const setupSteps = [
    currentText.step1,
    currentText.step2,
    currentText.step3,
    currentText.step4,
    currentText.step5,
    "Hizmet/kiralama/tur çalışıyorsanız takvim ve kapasiteyi ayarla",
    currentText.step6,
  ];

  const stats = [
    {
      label: currentText.todayRequests,
      value: "3",
    },
    {
      label: currentText.activeProducts,
      value: "3",
    },
    {
      label: currentText.waitingMessages,
      value: "2",
    },
    {
      label: currentText.stockAlerts,
      value: "1",
    },
  ];

  const modules = [
    {
      title: currentText.moduleRequests,
      description: currentText.moduleRequestsDesc,
      href: "/dashboard/customer-requests",
      tag: currentText.tagNew,
    },
    {
      title: currentText.moduleProducts,
      description: currentText.moduleProductsDesc,
      href: "/dashboard/products",
      tag: currentText.tagNext,
    },
    {
      title: currentText.moduleServices,
      description: currentText.moduleServicesDesc,
      href: "/dashboard/services",
      tag: currentText.tagNew,
    },
    {
      title: currentText.moduleWarehouse,
      description: currentText.moduleWarehouseDesc,
      href: "/dashboard/stock-movements",
      tag: currentText.tagPlanned,
    },
    {
      title: currentText.moduleStorefront,
      description: currentText.moduleStorefrontDesc,
      href: "/store/obdtr",
      tag: currentText.tagLive,
    },
    {
      title: currentText.moduleCustomers,
      description: currentText.moduleCustomersDesc,
      href: "/dashboard/customers",
      tag: currentText.tagPlanned,
    },
    {
      title: currentText.moduleUsers,
      description: currentText.moduleUsersDesc,
      href: "/dashboard/users",
      tag: currentText.tagNew,
    },
    {
      title: currentText.moduleOrders,
      description: currentText.moduleOrdersDesc,
      href: "/dashboard/orders",
      tag: currentText.tagPlanned,
    },
    {
      title: currentText.moduleReports,
      description: currentText.moduleReportsDesc,
      href: "/dashboard/reports",
      tag: currentText.tagPlanned,
    },
    {
      title: currentText.moduleSettings,
      description: currentText.moduleSettingsDesc,
      href: "/dashboard/settings",
      tag: currentText.tagPlanned,
    },
  ];

  const adminLinks = [
    ["Ana marketplace", "/"], ["OBDTR vitrini", "/store/obdtr"], ["Yıldız Hırdavat", "/store/yildiz-hirdavat"], ["Ürün yönetimi", "/dashboard/products"], ["Hizmet/Randevu", "/dashboard/services"], ["Stok hareketleri", "/dashboard/stock-movements"], ["Siparişler", "/dashboard/orders"], ["Müşteriler", "/dashboard/customers"], ["Mağaza kullanıcıları", "/dashboard/users"], ["Raporlar", "/dashboard/reports"], ["Mesajlar", "/dashboard/messages"], ["Ayarlar", "/dashboard/settings"],
  ];

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-3 py-3 text-slate-950 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-7xl">
        {currentUser?.role === "superadmin" && (
          <section className="mb-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Platform sahibi erişimi</div>
                <div className="text-sm font-bold text-slate-700">Bu liste yalnızca OZGUR hesabına gösterilir; mağaza yöneticisi raporlarına kullanıcı hareketi olarak düşmez.</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {adminLinks.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-black text-blue-900 hover:bg-blue-100">{label}</Link>
              ))}
            </div>
          </section>
        )}
        <header className="mb-4 flex items-center justify-between gap-2">
          <Link href="/" className="text-xl font-black tracking-wide">
            HBS
          </Link>

          <div className="flex min-w-0 items-center gap-2">
            <CompactLanguageSwitcher />

            <Link
              href="/customer"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-slate-100"
            >
              {currentText.customerPortal}
            </Link>

            <Link
              href="/store/obdtr"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-slate-100"
            >
              OBDTR Vitrini
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-slate-100"
            >
              {currentText.home}
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                {currentText.eyebrow}
              </p>

              <h1 className="mt-2 text-xl font-black sm:text-3xl">
                {currentText.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-600">
                {currentText.description}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
              <h2 className="text-base font-black text-amber-900">
                {currentText.cleanNoticeTitle}
              </h2>

              <p className="mt-2 text-xs leading-5 text-amber-900/90">
                {currentText.cleanNotice}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-3"
            >
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="mt-1 text-xl font-black">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <h2 className="text-xl font-black">{currentText.setupTitle}</h2>

            <div className="mt-4 grid gap-3">
              {setupSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 font-black text-emerald-100">
                      {index + 1}
                    </div>

                    <div>
                      <div className="font-black">{step}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {currentText.statusWaiting}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-100"
                  >
                    {currentText.actionStart}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <h2 className="text-xl font-black">{currentText.modulesTitle}</h2>

            <div className="mt-4 grid gap-3">
              {modules.map((moduleItem) => (
                <Link
                  key={moduleItem.title}
                  href={moduleItem.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-400 hover:bg-slate-100"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="font-black">{moduleItem.title}</div>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      {moduleItem.tag}
                    </span>
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    {moduleItem.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-900">
              {currentText.footer}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}