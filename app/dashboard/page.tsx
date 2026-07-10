"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
    step3: "Depo yönetimi, depo haritalandırılması ve depoya ürün yükleme",
    step6: "Müşteri portalı görünürlüğünü ayarla",
    stepCalendar: "Hizmet/kiralama/tur çalışıyorsanız takvim ve kapasiteyi ayarla",
    statusWaiting: "Bekliyor",
    statusCompleted: "TAMAMLANDI",
    actionStart: "Başla",
    actionEdit: "Düzenle",
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
    step3: "Warehouse management, mapping & product uploading",
    step6: "Set customer portal visibility",
    stepCalendar: "If you work with service/rental/tours, set up calendar & capacity",
    statusWaiting: "Waiting",
    statusCompleted: "COMPLETED",
    actionStart: "Start",
    actionEdit: "Edit",
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
    step3: "Управление складом, разметка и загрузка товаров",
    step6: "Настроить видимость в клиентском портале",
    stepCalendar: "Если вы работаете с услугами/арендой/турами, настройте календарь и вместимость",
    statusWaiting: "Ожидает",
    statusCompleted: "ЗАВЕРШЕНО",
    actionStart: "Начать",
    actionEdit: "Редактировать",
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
    step3: "საწყობის მართვა, რუკა და პროდუქტის ჩატვირთვა",
    step6: "კლიენტის პორტალის ხილვადობის დაყენება",
    stepCalendar: "თუ მუშაობთ სერვისებთან/იჯარასთან/ტურებთან, დააყენეთ კალენდარი და ტევადობა",
    statusWaiting: "ელოდება",
    statusCompleted: "დასრულებული",
    actionStart: "დაწყება",
    actionEdit: "რედაქტირება",
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
    moduleServices: "სერვისების / შეხვედრების / ტურების მართვა",
    moduleServicesDesc:
      "მართეთ მომსახურების ხანგრძლივობა, პერსონალი, ტევადობა, თავისუფალი სლოტები, ტურის ადგილები, ქირავნობის პერიოდი და ჯავშნის ფასები.",
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
    step3: "Lagerverwaltung, Kartierung und Produktupload",
    step6: "Sichtbarkeit im Kundenportal einstellen",
    stepCalendar: "Wenn Sie mit Dienstleistungen/Vermietung/Touren arbeiten, richten Sie Kalender & Kapazität ein",
    statusWaiting: "Wartet",
    statusCompleted: "ABGESCHLOSSEN",
    actionStart: "Starten",
    actionEdit: "Bearbeiten",
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
    moduleServices: "Service- / Termin- / Tourverwaltung",
    moduleServicesDesc:
      "Verwalten Sie Servicezeiträume, Mitarbeiter, Kapazitäten, freie Zeiten, Tourplätze, Mietdauer und Buchungspreise.",
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

  // Stateful completions
  const [isCompanyDone, setIsCompanyDone] = useState(false);
  const [isWarehouseDone, setIsWarehouseDone] = useState(false);
  const [isProductsDone, setIsProductsDone] = useState(false);
  const [isCalendarDone, setIsCalendarDone] = useState(false);

  // Dynamic statistics
  const [todayRequests, setTodayRequests] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [waitingMessages, setWaitingMessages] = useState(0);
  const [stockAlerts, setStockAlerts] = useState(0);

  const [storeName, setStoreName] = useState("HBS");
  const [storeLogo, setStoreLogo] = useState("");
  const [storeSlug, setStoreSlug] = useState("obdtr");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
    
    try {
      const activeUser = JSON.parse(window.localStorage.getItem("hbs-current-user") || "null");
      setCurrentUser(activeUser);

      const currentStoreSlug = activeUser?.storeSlugs?.[0] || "obdtr";
      setStoreSlug(currentStoreSlug);

      // Resolve store name & logo from registered stores
      const storesStr = window.localStorage.getItem("hbs-registered-stores");
      if (storesStr) {
        const stores = JSON.parse(storesStr);
        const activeStore = stores.find((s: any) => s.code === currentStoreSlug);
        if (activeStore) {
          setStoreName(activeStore.name);
          if (activeStore.logoUrl) {
            setStoreLogo(activeStore.logoUrl);
          }
        }
      }

      // 1 & 2 & 7: Check if company settings saved
      const savedSettings = window.localStorage.getItem("hbs-company-settings");
      if (savedSettings) {
        setIsCompanyDone(true);
        const s = JSON.parse(savedSettings);
        if (s.companyName) setStoreName(s.companyName);
        if (s.logoUrl) setStoreLogo(s.logoUrl);
      }

      // 3 & 4: Check if any custom warehouse is created for active store slug
      if (storesStr) {
        const stores = JSON.parse(storesStr);
        const activeStore = stores.find((s: any) => s.code === currentStoreSlug);
        if (activeStore && activeStore.warehouses && activeStore.warehouses.length > 0) {
          setIsWarehouseDone(true);
        }
      }

      // 5: Check if products exist in local storage
      const productsStr = window.localStorage.getItem("hbs-store-products");
      let customProductsCount = 0;
      let lowStockCount = 0;
      if (productsStr) {
        const parsed = JSON.parse(productsStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setIsProductsDone(true);
          customProductsCount = parsed.length;
          lowStockCount = parsed.filter((p: any) => p.stockTracking && Number(p.quantity) <= 2).length;
        }
      }
      setActiveProducts(customProductsCount);
      setStockAlerts(lowStockCount);

      // 6: Check if calendar and capacity setup is completed
      setIsCalendarDone(window.localStorage.getItem("hbs-calendar-configured") === "true");

      // Load dynamic offers count
      const offersStr = window.localStorage.getItem("hbs-store-customer-offers");
      if (offersStr) {
        const offers = JSON.parse(offersStr);
        setTodayRequests(offers.length);
      } else {
        setTodayRequests(0);
      }

      // Load dynamic messages count (set to 0 initially)
      setWaitingMessages(0);

      // ----------------------------------------------------
      // SELF-HEALING / DATABASE-DRIVEN RECOVERY SYSTEM
      // ----------------------------------------------------
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      if (isSupabaseConfigured) {
        // A) Recover/Sync Company Settings from Supabase
        supabase
          .from("companies")
          .select("*")
          .eq("code", storeSlug)
          .single()
          .then(({ data: companyData, error: companyError }) => {
            if (companyData && !companyError) {
              setIsCompanyDone(true);
              const cachedSettingsStr = window.localStorage.getItem("hbs-company-settings");
              if (!cachedSettingsStr) {
                const settingsData = {
                  companyName: companyData.name || "OBDTR Diagnostics",
                  officialTitle: companyData.name ? `${companyData.name} LLC` : "OBDTR Diagnostics LLC",
                  taxNumber: "",
                  sector: "Oto Yedek Parça",
                  description: companyData.address || "Oto yedek parça, filtre, buji, fren ve motor parçaları satışı.",
                  country: "GE",
                  phone: companyData.phone || "+995 555 000 001",
                  whatsapp: companyData.whatsapp || "905331112233",
                  email: companyData.email || "info@obdtr.ge",
                  city: companyData.city || "Batumi",
                  address: companyData.address || "Batumi Merkez",
                  googleMap: "",
                  portalVisible: true,
                  showPrices: false,
                  allowOrders: true,
                  allowMessages: true,
                  allowWhatsapp: true,
                  requireEmployeeBiometrics: false,
                };
                window.localStorage.setItem("hbs-company-settings", JSON.stringify(settingsData));
              }

              // B) Recover/Sync Warehouses from Supabase
              supabase
                .from("warehouses")
                .select("id, name, address, is_visible_to_customers")
                .eq("company_id", companyData.id)
                .then(async ({ data: dbWhs, error: whErr }) => {
                  if (dbWhs && dbWhs.length > 0 && !whErr) {
                    const whIds = dbWhs.map(w => w.id);
                    const { data: dbLocs } = await supabase
                      .from("warehouse_locations")
                      .select("*")
                      .in("warehouse_id", whIds);

                    const mapped = dbWhs.map(w => {
                      const shelves = dbLocs
                        ? dbLocs.filter(l => l.warehouse_id === w.id).map(l => l.name)
                        : [];
                      return {
                        id: w.id,
                        name: w.name,
                        purpose: w.address || "Depo Açıklaması",
                        customerVisible: w.is_visible_to_customers || false,
                        city: w.address || "Türkiye",
                        zones: Array.from(new Set(shelves.map(s => s.includes("-") ? s.split("-")[0] : s.charAt(0)))).filter(Boolean),
                        shelves: shelves,
                        capacity: 1000,
                        used: 0
                      };
                    });

                    let stores = [];
                    try {
                      stores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
                    } catch (e) {}

                    const updatedStores = stores.map((s: any) => {
                      if (s.code === storeSlug) {
                        return { ...s, name: companyData.name, warehouses: mapped };
                      }
                      return s;
                    });

                    if (!stores.some((s: any) => s.code === storeSlug)) {
                      updatedStores.push({ code: storeSlug, name: companyData.name, warehouses: mapped });
                    }

                    window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
                    setIsWarehouseDone(true);
                  }
                });

              // C) Recover/Sync Products from Supabase
              supabase
                .from("offerable_items")
                .select(`
                  *,
                  companies!inner(code),
                  product_stocks(
                    quantity,
                    warehouses(name),
                    warehouse_locations(name)
                  )
                `)
                .eq("companies.code", storeSlug)
                .then(({ data: itemsData, error: itemsError }) => {
                  if (itemsData && !itemsError) {
                    if (itemsData.length > 0) {
                      setIsProductsDone(true);
                      
                      const mappedProducts = itemsData
                        .filter((item: any) => item.brand !== "DELETED" && item.category !== "DELETED")
                        .map((item: any) => {
                          const stockRecord = item.product_stocks?.[0];
                          return {
                            id: item.id,
                            itemType: item.type === "product" ? "product" : item.type === "service" ? "service" : "rental",
                            name: item.name,
                            category: item.category || "Genel",
                            brand: item.brand || "",
                            model: "",
                            description: item.description || "",
                            salePrice: item.sale_price ? String(item.sale_price) : "",
                            purchasePrice: item.purchase_price ? String(item.purchase_price) : "",
                            currency: item.currency || "GEL",
                            barcode: item.barcode || "",
                            qrCode: item.qr_code || "",
                            sku: item.code || "",
                            oemCode: "",
                            manufacturerCode: "",
                            stockTracking: true,
                            quantity: stockRecord ? String(stockRecord.quantity) : "0",
                            warehouse: (stockRecord && stockRecord.warehouses) ? stockRecord.warehouses.name : "Ana Depo",
                            shelf: (stockRecord && stockRecord.warehouse_locations) ? stockRecord.warehouse_locations.name : "",
                            entryDate: "",
                            exitDate: "",
                            pricingMode: item.sale_price ? "fixed" : "quote",
                            visibility: item.is_visible_in_storefront ? "visible" : "hidden",
                            imageUrl: item.photo_urls?.[0] || "/product-images/diagnostic-scanner.svg",
                            videoUrl: item.video_urls?.[0] || "",
                            variants: [],
                            galleryUrls: item.photo_urls || []
                          };
                        });

                      // Update state
                      setActiveProducts(mappedProducts.length);
                      const lowStock = mappedProducts.filter((p: any) => p.stockTracking && Number(p.quantity) <= 2).length;
                      setStockAlerts(lowStock);
                      
                      // Save cache
                      window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(mappedProducts));
                    }
                  }
                });
            }
          });
      }

    } catch (e) {
      console.error("Dashboard states fetch error:", e);
    }
  }, []);

  if (!language) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  const currentText = texts[language];

  // Map onboarding checklist to dynamic routes and states
  const stepsConfig = [
    {
      label: currentText.step1,
      completed: isCompanyDone,
      href: "/dashboard/settings",
    },
    {
      label: currentText.step2,
      completed: isCompanyDone,
      href: "/dashboard/settings",
    },
    {
      label: currentText.step3,
      completed: isWarehouseDone && isProductsDone,
      href: "/dashboard/warehouses",
    },
    {
      label: currentText.stepCalendar,
      completed: isCalendarDone,
      href: "/dashboard/services",
    },
    {
      label: currentText.step6,
      completed: isCompanyDone,
      href: "/dashboard/settings",
    },
  ];

  const stats = [
    {
      label: currentText.todayRequests,
      value: String(todayRequests),
    },
    {
      label: currentText.activeProducts,
      value: String(activeProducts),
    },
    {
      label: currentText.waitingMessages,
      value: String(waitingMessages),
    },
    {
      label: currentText.stockAlerts,
      value: String(stockAlerts),
    },
  ];

  const modules = [
    {
      title: currentText.moduleWarehouse,
      description: currentText.moduleWarehouseDesc,
      href: "/dashboard/stock-movements",
      tag: currentText.tagPlanned,
      bgClass: "bg-sky-50/60 border-sky-200 hover:border-sky-400 hover:bg-sky-100/80",
      titleClass: "text-sky-950",
      descClass: "text-sky-900/80",
      tagClass: "bg-sky-100 text-sky-800 border border-sky-200/60",
    },
    {
      title: currentText.moduleRequests,
      description: currentText.moduleRequestsDesc,
      href: "/dashboard/customer-requests",
      tag: currentText.tagNew,
      bgClass: "bg-violet-50/60 border-violet-200 hover:border-violet-400 hover:bg-violet-100/80",
      titleClass: "text-violet-950",
      descClass: "text-violet-900/80",
      tagClass: "bg-violet-100 text-violet-800 border border-violet-200/60",
    },
    {
      title: currentText.moduleProducts,
      description: currentText.moduleProductsDesc,
      href: "/dashboard/products",
      tag: currentText.tagNext,
      bgClass: "bg-amber-50/60 border-amber-200 hover:border-amber-400 hover:bg-amber-100/80",
      titleClass: "text-amber-950",
      descClass: "text-amber-900/80",
      tagClass: "bg-amber-100 text-amber-800 border border-amber-200/60",
    },
    {
      title: currentText.moduleServices,
      description: currentText.moduleServicesDesc,
      href: "/dashboard/services",
      tag: currentText.tagNew,
      bgClass: "bg-emerald-50/60 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/80",
      titleClass: "text-emerald-950",
      descClass: "text-emerald-900/80",
      tagClass: "bg-emerald-100 text-emerald-850 border border-emerald-200/60",
    },
    {
      title: currentText.moduleStorefront,
      description: currentText.moduleStorefrontDesc,
      href: `/store/${currentUser?.storeSlugs?.[0] || "obdtr"}`,
      tag: currentText.tagLive,
      bgClass: "bg-indigo-50/60 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100/80",
      titleClass: "text-indigo-950",
      descClass: "text-indigo-900/80",
      tagClass: "bg-indigo-100 text-indigo-800 border border-indigo-200/60",
    },
    {
      title: currentText.moduleCustomers,
      description: currentText.moduleCustomersDesc,
      href: "/dashboard/customers",
      tag: currentText.tagPlanned,
      bgClass: "bg-teal-50/60 border-teal-200 hover:border-teal-400 hover:bg-teal-100/80",
      titleClass: "text-teal-950",
      descClass: "text-teal-900/80",
      tagClass: "bg-teal-100 text-teal-800 border border-teal-200/60",
    },
    {
      title: currentText.moduleUsers,
      description: currentText.moduleUsersDesc,
      href: "/dashboard/users",
      tag: currentText.tagNew,
      bgClass: "bg-rose-50/60 border-rose-200 hover:border-rose-400 hover:bg-rose-100/80",
      titleClass: "text-rose-950",
      descClass: "text-rose-900/80",
      tagClass: "bg-rose-100 text-rose-800 border border-rose-200/60",
    },
    {
      title: currentText.moduleOrders,
      description: currentText.moduleOrdersDesc,
      href: "/dashboard/orders",
      tag: currentText.tagPlanned,
      bgClass: "bg-fuchsia-50/60 border-fuchsia-200 hover:border-fuchsia-400 hover:bg-fuchsia-100/80",
      titleClass: "text-fuchsia-950",
      descClass: "text-fuchsia-900/80",
      tagClass: "bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200/60",
    },
    {
      title: currentText.moduleReports,
      description: currentText.moduleReportsDesc,
      href: "/dashboard/reports",
      tag: currentText.tagPlanned,
      bgClass: "bg-lime-50/60 border-lime-200 hover:border-lime-400 hover:bg-lime-100/80",
      titleClass: "text-lime-950",
      descClass: "text-lime-900/80",
      tagClass: "bg-lime-100 text-lime-800 border border-lime-200/60",
    },
    {
      title: currentText.moduleSettings,
      description: currentText.moduleSettingsDesc,
      href: "/dashboard/settings",
      tag: currentText.tagLive,
      bgClass: "bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100/80",
      titleClass: "text-slate-900",
      descClass: "text-slate-700/80",
      tagClass: "bg-slate-250 text-slate-700 border border-slate-300/60",
    },
  ];

  const adminLinks = [
    ["★ Süper Yönetici Paneli", "/dashboard/admin"], ["Ana marketplace", "/"], ["OBDTR vitrini", "/store/obdtr"], ["Yıldız Hırdavat", "/store/yildiz-hirdavat"], ["Ürün yönetimi", "/dashboard/products"], ["Hizmet/Randevu", "/dashboard/services"], ["Stok hareketleri", "/dashboard/stock-movements"], ["Siparişler", "/dashboard/orders"], ["Müşteriler", "/dashboard/customers"], ["Mağaza kullanıcıları", "/dashboard/users"], ["Raporlar", "/dashboard/reports"], ["Mesajlar", "/dashboard/messages"], ["Ayarlar", "/dashboard/settings"],
  ];

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-3 py-3 text-slate-950 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[1850px]">
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
        
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5 relative mt-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Left side: Logo & Title Info */}
            <div className="flex items-center gap-4 min-w-0">
              <Link 
                href="/dashboard/settings" 
                className="group relative w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 shrink-0 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer shadow-sm overflow-hidden"
                title={language === "tr" ? "Logo Ekle / Düzenle" : "Add / Edit Logo"}
              >
                {storeLogo ? (
                  <>
                    <img src={storeLogo} alt={storeName} className="w-full h-full object-cover group-hover:opacity-75 transition" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-[9px] font-black uppercase tracking-wider">
                      ✏️ {language === "tr" ? "Değiştir" : "Change"}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-xl">📷</span>
                    <span className="text-[8px] font-black uppercase tracking-wider mt-0.5 text-slate-500 group-hover:text-blue-600">
                      {language === "tr" ? "Logo Ekle" : "Add Logo"}
                    </span>
                  </>
                )}
              </Link>
              
              <div className="min-w-0">
                <h1 className="text-2xl font-black sm:text-4xl tracking-tight text-slate-800 leading-none">
                  {language === "tr" && `${storeName} Mağaza Paneli`}
                  {language === "en" && `${storeName} Store Panel`}
                  {language === "de" && `${storeName} Shop-Panel`}
                  {language === "ru" && `${storeName} Панель Магазина`}
                  {language === "ka" && `${storeName} მაღაზიის პანელი`}
                  {!language && `${storeName} Mağaza Paneli`}
                </h1>
              </div>
            </div>

            {/* Right side: Navigation buttons (Larger and inside the card) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
              <div className="flex items-center gap-2">
                <CompactLanguageSwitcher />

                <Link
                  href="/customer"
                  className="rounded-xl border border-slate-250 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 transition shadow-sm active:scale-95"
                >
                  {currentText.customerPortal}
                </Link>

                <Link
                  href={`/store/${storeSlug}`}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-black text-blue-700 hover:bg-blue-100 transition shadow-sm active:scale-95"
                >
                  {storeName} {currentText.storeFront}
                </Link>

                <Link
                  href="/"
                  className="rounded-xl border border-slate-250 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 transition shadow-sm active:scale-95"
                >
                  {currentText.home}
                </Link>
              </div>
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
          {/* 1. Onboarding Checklist Side */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <h2 className="text-xl font-black">{currentText.setupTitle}</h2>

            <div className="mt-4 grid gap-3">
              {stepsConfig.map((step, index) => (
                <div
                  key={step.label + index}
                  className={`flex flex-col gap-3 rounded-2xl border p-3.5 sm:flex-row sm:items-center sm:justify-between transition-all duration-305 ${
                    step.completed
                      ? "border-emerald-200 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-black text-xs transition ${
                      step.completed
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : "border border-slate-300 bg-white text-slate-500 shadow-sm"
                    }`}>
                      {step.completed ? "✓" : index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`text-xs font-black transition-all ${
                          step.completed ? "text-slate-400 font-bold" : "text-slate-800"
                        }`}>{step.label}</div>
                        {step.completed && (
                          <span className="text-emerald-700 font-black text-xs shrink-0 select-none">✓</span>
                        )}
                      </div>
                      {!step.completed && (
                        <div className="mt-1 text-[10px] font-black uppercase tracking-wider">
                          <span className="text-amber-600">⏳ {currentText.statusWaiting}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href={step.href}
                    className={`rounded-xl px-4 py-2 text-xs font-extrabold text-center transition active:scale-95 whitespace-nowrap ${
                      step.completed
                        ? "border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-950/15"
                    }`}
                  >
                    {step.completed ? currentText.actionEdit : currentText.actionStart}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Modules Directory Side */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <h2 className="text-xl font-black">{currentText.modulesTitle}</h2>

            <div className="mt-4 grid gap-3">
              {modules.map((moduleItem) => (
                <Link
                  key={moduleItem.title}
                  href={moduleItem.href}
                  className={`rounded-2xl border p-3.5 transition shadow-sm hover:shadow-md ${moduleItem.bgClass || "border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"}`}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className={`font-black text-sm ${moduleItem.titleClass || "text-slate-800"}`}>{moduleItem.title}</div>

                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${moduleItem.tagClass || "bg-blue-50 text-blue-700 border border-blue-200/50"}`}>
                      {moduleItem.tag}
                    </span>
                  </div>

                  <p className={`text-xs leading-5 ${moduleItem.descClass || "text-slate-500"}`}>
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