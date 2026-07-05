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
    hybridStore: "Karma mağaza",
    asistanTitle: "HBS Akıllı Asistan",
    asistanSub: "Ağamın Akıllı Çırağı",
    sectorModeTitle: "🎭 Dükkan Sektör Modu",
    sectorModeDesc: "{t.sectorModeDesc}",
    sectorAuto: "🚗 Oto Yedek Parça",
    sectorFootwear: "👞 Ayakkabı & Giyim",
    sectorGrocery: "🛒 Market & Perakende",
    pageGuideTitle: "📖 Sayfa Kılavuzu",
    whatsappBtn: "{t.whatsappBtn}",
    guideProductsTitle: "🛍️ Ürünler Sayfası",
    guideProductsLi1: "Uyumlu markaları altındaki çiplerle tek tıkla seçebilirsiniz.",
    guideProductsLi2: "Sanayi Modu düğmesine basarak yazıları büyütebilirsiniz.",
    guideProductsLi3: "Yanlışlıkla ürün sildiğinizde tepedeki Geri Al şeridine basın.",
    guideProductsLi4: "Barkod okutmak için Kamera simgesine dokunun.",
    guideWarehousesTitle: "🗺️ Akıllı Depo Şeması",
    guideWarehousesLi1: "Depoları Düzenle / Ekle butonu ile depolarınızı çoğaltıp adlarını değiştirebilirsiniz.",
    guideWarehousesLi2: "Şemadaki reyon ve depo isimlerine tıklayarak doğrudan yeniden adlandırın.",
    guideWarehousesLi3: "Rafların üzerine tıklayarak içindeki ürünleri resimleriyle görebilir veya özel isim/takma ad tanımlayabilirsiniz.",
    guideHomeTitle: "🏠 HBS Ana Kontrol Paneli",
    guideHomeLi1: "Sol menüden dükkanınızın tüm süreçlerini yönetebilirsiniz.",
    guideHomeLi2: "Müşteri taleplerini görmek için Talep Panosuna göz atın.",
    guideHomeLi3: "Şu an aktif olan sektör modunuza göre ekranınız en uygun dile kavuşur."
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
    hybridStore: "Hybrid store",
    asistanTitle: "HBS Smart Assistant",
    asistanSub: "Smart Assistant Tool",
    sectorModeTitle: "🎭 Shop Sector Mode",
    sectorModeDesc: "Depending on your selected sector, your product lists, brand recommendations, and warehouse templates adapt automatically.",
    sectorAuto: "🚗 Auto Spare Parts",
    sectorFootwear: "👞 Shoes & Apparel",
    sectorGrocery: "🛒 Grocery & Retail",
    pageGuideTitle: "📖 Page Guide",
    whatsappBtn: "Ask Özgür Bey on WhatsApp",
    guideProductsTitle: "🛍️ Products Page",
    guideProductsLi1: "You can select compatible brands with a single click using the chips.",
    guideProductsLi2: "You can enlarge text size by pressing the Industrial Mode button.",
    guideProductsLi3: "If you delete a product by mistake, click the Undo banner at the top.",
    guideProductsLi4: "Tap the Camera icon to scan a barcode.",
    guideWarehousesTitle: "🗺️ Smart Warehouse Layout",
    guideWarehousesLi1: "You can multiply or rename your warehouses using the Edit / Add Warehouses button.",
    guideWarehousesLi2: "Click directly on aisle and warehouse names in the diagram to rename them.",
    guideWarehousesLi3: "Click on shelves to view their contents with pictures, or assign custom names/aliases.",
    guideHomeTitle: "🏠 HBS Main Control Panel",
    guideHomeLi1: "You can manage all processes of your store from the left menu.",
    guideHomeLi2: "Check the Request Board to see customer inquiries.",
    guideHomeLi3: "According to your currently active sector mode, your screen adapts to the most suitable terms."
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
    hybridStore: "Гибридный магазин",
    asistanTitle: "Умный помощник HBS",
    asistanSub: "Умный инструмент помощника",
    sectorModeTitle: "🎭 Секторный режим магазина",
    sectorModeDesc: "В зависимости от выбранного сектора ваши списки товаров, рекомендации брендов и шаблоны складов адаптируются автоматически.",
    sectorAuto: "🚗 Автозапчасти",
    sectorFootwear: "👞 Обувь и одежда",
    sectorGrocery: "🛒 Продукты и розница",
    pageGuideTitle: "📖 Руководство по странице",
    whatsappBtn: "Спросить Озгюр Бея в WhatsApp",
    guideProductsTitle: "🛍️ Страница товаров",
    guideProductsLi1: "Вы можете выбрать совместимые бренды одним кликом с помощью фишек.",
    guideProductsLi2: "Вы можете увеличить размер шрифта, нажав кнопку Промышленного режима.",
    guideProductsLi3: "Если вы допустили ошибку при удалении товара, нажмите на баннер Отмена вверху.",
    guideProductsLi4: "Нажмите на значок камеры, чтобы отсканировать штрихкод.",
    guideWarehousesTitle: "🗺️ Умная карта склада",
    guideWarehousesLi1: "Вы можете дублировать или переименовывать свои склады с помощью кнопки Редактировать / Добавить склады.",
    guideWarehousesLi2: "Нажимайте прямо на названия проходов и складов на схеме, чтобы переименовать их.",
    guideWarehousesLi3: "Нажимайте на полки, чтобы просматривать их содержимое с изображениями или назначать им имена/псевдонимы.",
    guideHomeTitle: "🏠 Главная панель управления HBS",
    guideHomeLi1: "Вы можете управлять всеми процессами вашего магазина из левого меню.",
    guideHomeLi2: "Проверьте Панель запросов, чтобы просмотреть запросы клиентов.",
    guideHomeLi3: "В соответствии с вашим текущим активным режимом сектора ваш экран адаптируется к наиболее подходящим терминам."
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
    hybridStore: "ჰიბრიდული მაღაზია",
    asistanTitle: "HBS ჭკვიანი ასისტენტი",
    asistanSub: "ჭკვიანი ასისტენტის ინსტრუმენტი",
    sectorModeTitle: "🎭 მაღაზიის სექტორული რეჟიმი",
    sectorModeDesc: "არჩეული სექტორის მიხედვით, თქვენი პროდუქტების სიები, ბრენდის რეკომენდაციები და საწყობის შაბლონები ავტომატურად ადაპტირდება.",
    sectorAuto: "🚗 ავტონაწილები",
    sectorFootwear: "👞 ფეხსაცმელი და ტანსაცმელი",
    sectorGrocery: "🛒 სუპერმარკეტი და საცალო ვაჭრობა",
    pageGuideTitle: "📖 გვერდის სახელმძღვანელო",
    whatsappBtn: "ჰკითხეთ ოზგურ ბეის WhatsApp-ზე",
    guideProductsTitle: "🛍️ პროდუქტების გვერდი",
    guideProductsLi1: "შეგიძლიათ აირჩიოთ თავსებადი ბრენდები ერთი დაწკაპუნებით ჩიპების გამოყენებით.",
    guideProductsLi2: "შეგიძლიათ გაზარდოთ ტექსტის ზომა სამრეწველო რეჟიმის ღილაკზე დაჭერით.",
    guideProductsLi3: "თუ შეცდომით წაშალეთ პროდუქტი, დააჭირეთ გაუქმების ბანერს ზემოთ.",
    guideProductsLi4: "დააჭირეთ კამერის ხატულას შტრიხკოდის დასასკანირებლად.",
    guideWarehousesTitle: "🗺️ საწყობის ჭკვიანი რუკა",
    guideWarehousesLi1: "შეგიძლიათ გაამრავლოთ ან გადაარქვათ სახელი თქვენს საწყობებს საწყობების რედაქტირება / დამატება ღილაკით.",
    guideWarehousesLi2: "დააწკაპუნეთ პირდაპირ დერეფნისა და საწყობის სახელებზე სქემაში მათი სახელის გადასარქმევად.",
    guideWarehousesLi3: "დააწკაპუნეთ თაროებზე მათი შინაარსის სურათებით სანახავად, ან მიანიჭეთ მორგებული სახელები/ფსევდონიმები.",
    guideHomeTitle: "🏠 HBS მთავარი მართვის პანელი",
    guideHomeLi1: "შეგიძლიათ მართოთ თქვენი მაღაზიის ყველა პროცესი მარცხენა მენიუდან.",
    guideHomeLi2: "შეამოწმეთ მოთხოვნების დაფა კლიენტების მოთხოვნების სანახავად.",
    guideHomeLi3: "თქვენი ამჟამად აქტიური სექტორის რეჟიმის მიხედვით, თქვენი ეკრანი ადაპტირდება ყველაზე შესაფერის ტერმინებზე."
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
    hybridStore: "Hybrid-Shop",
    asistanTitle: "HBS Intelligenter Assistent",
    asistanSub: "Intelligenter Assistent-Tool",
    sectorModeTitle: "🎭 Shop-Branchenmodus",
    sectorModeDesc: "Abhängig von Ihrer gewählten Branche passen sich Ihre Produktlisten, Markenempfehlungen und Lagervorlagen automatisch an.",
    sectorAuto: "🚗 Autoersatzteile",
    sectorFootwear: "👞 Schuhe & Bekleidung",
    sectorGrocery: "🛒 Lebensmittel & Einzelhandel",
    pageGuideTitle: "📖 Seitenhandbuch",
    whatsappBtn: "Fragen Sie Özgür Bey auf WhatsApp",
    guideProductsTitle: "🛍️ Produkte-Seite",
    guideProductsLi1: "Sie können kompatible Marken mit einem Klick über die Chips auswählen.",
    guideProductsLi2: "Sie können die Schriftgröße vergrößern, indem Sie den Industriemodus-Button drücken.",
    guideProductsLi3: "Wenn Sie versehentlich ein Produkt löschen, klicken Sie oben auf das Banner Rückgängig.",
    guideProductsLi4: "Tippen Sie auf das Kamerasymbol, um einen Barcode zu scannen.",
    guideWarehousesTitle: "🗺️ Smart-Lagerplan",
    guideWarehousesLi1: "Sie können Ihre Lager über die Schaltfläche Lager bearbeiten / hinzufügen duplizieren oder umbenennen.",
    guideWarehousesLi2: "Klicken Sie im Diagramm direkt auf Gang- und Lagernamen, um sie umzudenennen.",
    guideWarehousesLi3: "Klicken Sie auf Regale, um deren Inhalt mit Bildern anzuzeigen, oder weisen Sie benutzerdefinierte Namen/Aliase zu.",
    guideHomeTitle: "🏠 HBS-Haupt-Dashboard",
    guideHomeLi1: "Sie können alle Prozesse Ihres Shops über das linke Menü verwalten.",
    guideHomeLi2: "Überprüfen Sie das Anfrage-Board, um Kundenanfragen anzuzeigen.",
    guideHomeLi3: "Entsprechend Ihrem aktuell aktiven Branchenmodus passt sich Ihr Bildschirm an die am besten geeigneten Begriffe an."
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
  const [isAsistanOpen, setIsAsistanOpen] = useState(false);
  const [sector, setSector] = useState("automotive");

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
      const savedSector = window.localStorage.getItem("hbs-business-sector") || "automotive";
      setSector(savedSector);
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
      {/* Floating Animated Asistan Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Breathing, winking smiley button */}
        <button
          type="button"
          onClick={() => setIsAsistanOpen(!isAsistanOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-indigo-600 to-blue-500 text-white shadow-2xl transition hover:scale-110 active:scale-95 animate-bounce select-none cursor-pointer focus:outline-none relative group ring-4 ring-indigo-200"
          title={t.asistanTitle}
        >
          {/* Animated cute face SVG */}
          <svg className="h-8 w-8 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
            <circle cx="8" cy="10" r="1.5" fill="#312e81" className="group-hover:scale-y-25 origin-center transition-transform" />
            <circle cx="16" cy="10" r="1.5" fill="#312e81" className="group-hover:scale-y-25 origin-center transition-transform" />
            <path d="M8 15C8.5 16.5 10 17.5 12 17.5C14 17.5 15.5 16.5 16 15" stroke="#312e81" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 2C10.5 4 13.5 4 12 2Z" fill="currentColor" />
          </svg>
          {/* Pulsing notification badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-black text-white items-center justify-center">1</span>
          </span>
        </button>

        {/* Sliding Asistan Drawer */}
        {isAsistanOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-slate-200 shadow-2xl p-5 flex flex-col justify-between animate-slideIn">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-none">{t.asistanTitle}</h3>
                    <span className="text-[10px] text-indigo-600 font-bold">{t.asistanSub}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAsistanOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition font-black text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Business Sector Mode Selector */}
              <div className="space-y-1.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 p-3.5 shadow-sm">
                <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider block">{t.sectorModeTitle}</span>
                <p className="text-[10px] text-slate-650 font-bold leading-relaxed mb-2.5">
                  Seçtiğiniz sektöre göre ürün listeleriniz, marka önerileriniz ve depo şablonlarınız otomatik adapte olur.
                </p>
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSector("automotive");
                      window.localStorage.setItem("hbs-business-sector", "automotive");
                      window.dispatchEvent(new Event("hbs-sector-changed"));
                    }}
                    className={"w-full rounded-xl py-2 px-3 text-xs font-black transition text-left flex items-center justify-between border " + (
                      sector === "automotive"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{t.sectorAuto}</span>
                    {sector === "automotive" && <span>✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSector("footwear");
                      window.localStorage.setItem("hbs-business-sector", "footwear");
                      window.dispatchEvent(new Event("hbs-sector-changed"));
                    }}
                    className={"w-full rounded-xl py-2 px-3 text-xs font-black transition text-left flex items-center justify-between border " + (
                      sector === "footwear"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{t.sectorFootwear}</span>
                    {sector === "footwear" && <span>✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSector("grocery");
                      window.localStorage.setItem("hbs-business-sector", "grocery");
                      window.dispatchEvent(new Event("hbs-sector-changed"));
                    }}
                    className={"w-full rounded-xl py-2 px-3 text-xs font-black transition text-left flex items-center justify-between border " + (
                      sector === "grocery"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{t.sectorGrocery}</span>
                    {sector === "grocery" && <span>✓</span>}
                  </button>
                </div>
              </div>

              {/* Contextual Page Help Guide */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">{t.pageGuideTitle}</span>
                
                {currentPath.includes("/dashboard/products") ? (
                  <div className="space-y-2.5 bg-slate-50 rounded-2xl p-3 border border-slate-150">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">{t.guideProductsTitle}</h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-650 font-bold leading-normal list-disc pl-3.5">
                      <li>{t.guideProductsLi1}</li>
                      <li>{t.guideProductsLi2}</li>
                      <li>{t.guideProductsLi3}</li>
                      <li>{t.guideProductsLi4}</li>
                    </ul>
                  </div>
                ) : currentPath.includes("/dashboard/warehouses") ? (
                  <div className="space-y-2.5 bg-slate-50 rounded-2xl p-3 border border-slate-150">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">{t.guideWarehousesTitle}</h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-650 font-bold leading-normal list-disc pl-3.5">
                      <li>{t.guideWarehousesLi1}</li>
                      <li>{t.guideWarehousesLi2}</li>
                      <li>{t.guideWarehousesLi3}</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-2.5 bg-slate-50 rounded-2xl p-3 border border-slate-150">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">{t.guideHomeTitle}</h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-650 font-bold leading-normal list-disc pl-3.5">
                      <li>{t.guideHomeLi1}</li>
                      <li>{t.guideHomeLi2}</li>
                      <li>{t.guideHomeLi3}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Support Call Action */}
            <div className="border-t border-slate-150 pt-3">
              <a
                href="https://wa.me/905300000000?text=Merhaba%20Ozgur%20Bey,%20HBS%20paneli%20kullaniminda%20takildim,%20yardimci%20olabilir%20misiniz?"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 text-center flex items-center justify-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>💬</span> {t.whatsappBtn}
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </main>
  );
}

