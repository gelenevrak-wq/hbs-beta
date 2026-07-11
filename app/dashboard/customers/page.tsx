"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const translations = {
  tr: {
    activeMenu: "Müşteriler",
    eyebrow: "MÜŞTERİ İLİŞKİLERİ",
    title: "Mağaza Müşteri Yönetimi",
    description: "HBS müşterileri genel platform kullanıcısıdır. Bu ekran yalnızca müşterinin bu mağaza ile olan ilişki, sipariş, teklif ve yetki durumunu yönetir.",
    authTitle: "Mağaza bazlı yetki",
    authDesc: "Müşteri HBS’ye genel kayıt olur. Mağaza fiyat görme, sipariş verme veya cari hesap yetkisini sadece kendi mağazası için ayrıca tanımlar.",
    customerListTitle: "Müşteri Listesi",
    searchPlaceholder: "Müşteri, telefon, e-posta, şehir veya not ara",
    searchLabel: "Arama",
    statusLabel: "Durum",
    allCustomers: "Tüm Müşteriler",
    active: "Aktif",
    limited: "Sınırlı",
    blocked: "Engelli",
    pending: "Bekliyor",
    noCustomersFound: "Bu filtreye uygun müşteri bulunamadı.",
    selectCustomerTip: "Detay görmek için soldan bir müşteri seçin.",
    customerDetailHeader: "Müşteri Detayı",
    contactTitle: "İletişim ve Konum",
    phoneLabel: "Telefon",
    emailLabel: "E-posta",
    countryLabel: "Üle",
    cityRegionLabel: "Şehir/Bölge",
    summaryTitle: "Mağaza İlişki Özeti",
    totalRequestsLabel: "Toplam Talep",
    totalOrdersLabel: "Toplam Sipariş",
    lastActivityLabel: "Son Aktivite",
    noteLabel: "Not",
    permissionsTitle: "Yetkiler",
    canSeePricesLabel: "Fiyat Görebilir",
    canOrderLabel: "Sipariş Verebilir",
    canUseCurrentAccountLabel: "Cari Hesap",
    statusManagementTitle: "Durum Yönetimi",
    activateBtn: "Aktif Yap",
    limitBtn: "Sınırlı Yetki",
    blockBtn: "Engelle",
    viewOrdersBtn: "Siparişlerini Gör",
    customerRequestsBtn: "Müşteri Talepleri",
    ordersLink: "Siparişler",
    dashboardLink: "Panel",
    recordCount: "{count} kayıt",
    actionActiveMsg: "{name} aktif müşteri olarak ayarlandı.",
    actionLimitedMsg: "{name} için sınırlı yetki tanımlandı.",
    actionBlockedMsg: "{name} engellendi.",
    actionPermMsg: "{name} için yetki güncellendi.",
  },
  en: {
    activeMenu: "Customers",
    eyebrow: "CUSTOMER RELATIONSHIP",
    title: "Store Customer Management",
    description: "HBS customers are global platform users. This screen manages their specific relationship, orders, quotes, and authorization settings with your store.",
    authTitle: "Store-specific authorization",
    authDesc: "Customers register globally on HBS. The store separately configures permissions for viewing prices, placing orders, or open-account transactions specifically for their shop.",
    customerListTitle: "Customer List",
    searchPlaceholder: "Search customer, phone, email, city, or note",
    searchLabel: "Search",
    statusLabel: "Status",
    allCustomers: "All Customers",
    active: "Active",
    limited: "Limited",
    blocked: "Blocked",
    pending: "Pending",
    noCustomersFound: "No customers found matching this filter.",
    selectCustomerTip: "Select a customer from the left to view details.",
    customerDetailHeader: "Customer Details",
    contactTitle: "Contact & Location",
    phoneLabel: "Phone",
    emailLabel: "Email",
    countryLabel: "Country",
    cityRegionLabel: "City/Region",
    summaryTitle: "Store Relationship Summary",
    totalRequestsLabel: "Total Requests",
    totalOrdersLabel: "Total Orders",
    lastActivityLabel: "Last Activity",
    noteLabel: "Note",
    permissionsTitle: "Authorizations",
    canSeePricesLabel: "Can See Prices",
    canOrderLabel: "Can Place Orders",
    canUseCurrentAccountLabel: "Open Account",
    statusManagementTitle: "Status Management",
    activateBtn: "Make Active",
    limitBtn: "Limit Access",
    blockBtn: "Block Customer",
    viewOrdersBtn: "View Orders",
    customerRequestsBtn: "Customer Inquiries",
    ordersLink: "Orders",
    dashboardLink: "Dashboard",
    recordCount: "{count} records",
    actionActiveMsg: "{name} set as active customer.",
    actionLimitedMsg: "Limited permissions set for {name}.",
    actionBlockedMsg: "{name} has been blocked.",
    actionPermMsg: "Permissions updated for {name}.",
  },
  de: {
    activeMenu: "Kunden",
    eyebrow: "KUNDENBEZIEHUNG",
    title: "Shop-Kundenverwaltung",
    description: "HBS-Kunden sind globale Plattformbenutzer. Dieser Bildschirm verwaltet deren Beziehung, Bestellungen, Angebote und Berechtigungen speziell für Ihren Shop.",
    authTitle: "Shopspezifische Berechtigung",
    authDesc: "Kunden registrieren sich global auf HBS. Der Shop legt Berechtigungen für Preisansicht, Bestellungen oder Kontokorrent separat für sein Geschäft fest.",
    customerListTitle: "Kundenliste",
    searchPlaceholder: "Kunde, Telefon, E-Mail, Stadt oder Notiz suchen",
    searchLabel: "Suche",
    statusLabel: "Status",
    allCustomers: "Alle Kunden",
    active: "Aktiv",
    limited: "Eingeschränkt",
    blocked: "Gesperrt",
    pending: "Wartend",
    noCustomersFound: "Keine Kunden gefunden, die diesem Filter entsprechen.",
    selectCustomerTip: "Wählen Sie links einen Kunden aus, um Details anzuzeigen.",
    customerDetailHeader: "Kundendetails",
    contactTitle: "Kontakt & Standort",
    phoneLabel: "Telefon",
    emailLabel: "E-Mail",
    countryLabel: "Land",
    cityRegionLabel: "Stadt/Region",
    summaryTitle: "Beziehungszusammenfassung",
    totalRequestsLabel: "Anfragen gesamt",
    totalOrdersLabel: "Bestellungen gesamt",
    lastActivityLabel: "Letzte Aktivität",
    noteLabel: "Notiz",
    permissionsTitle: "Berechtigungen",
    canSeePricesLabel: "Kann Preise sehen",
    canOrderLabel: "Kann bestellen",
    canUseCurrentAccountLabel: "Kontokorrent",
    statusManagementTitle: "Statusverwaltung",
    activateBtn: "Aktivieren",
    limitBtn: "Einschränken",
    blockBtn: "Sperren",
    viewOrdersBtn: "Bestellungen anzeigen",
    customerRequestsBtn: "Kundenanfragen",
    ordersLink: "Bestellungen",
    dashboardLink: "Dashboard",
    recordCount: "{count} Einträge",
    actionActiveMsg: "{name} wurde als aktiver Kunde festgelegt.",
    actionLimitedMsg: "Eingeschränkte Berechtigungen für {name} festgelegt.",
    actionBlockedMsg: "{name} wurde gesperrt.",
    actionPermMsg: "Berechtigungen für {name} wurden aktualisiert.",
  },
  ru: {
    activeMenu: "Клиенты",
    eyebrow: "ОТНОШЕНИЯ С КЛИЕНТАМИ",
    title: "Управление клиентами магазина",
    description: "Клиенты HBS являются пользователями платформы. Этот экран управляет их связью, заказами, предложениями и правами доступа только для вашего магазина.",
    authTitle: "Права на уровне магазина",
    authDesc: "Клиент регистрируется глобально в HBS. Магазин отдельно настраивает права на просмотр цен, заказы или ведение счета именно для своего магазина.",
    customerListTitle: "Список клиентов",
    searchPlaceholder: "Поиск клиента, телефона, e-mail, города или заметки",
    searchLabel: "Поиск",
    statusLabel: "Статус",
    allCustomers: "Все клиенты",
    active: "Активен",
    limited: "Ограничен",
    blocked: "Заблокирован",
    pending: "Ожидает",
    noCustomersFound: "Клиенты по этому фильтру не найдены.",
    selectCustomerTip: "Выберите клиента слева для просмотра деталей.",
    customerDetailHeader: "Детали клиента",
    contactTitle: "Контакты и местоположение",
    phoneLabel: "Телефон",
    emailLabel: "E-mail",
    countryLabel: "Страна",
    cityRegionLabel: "Город/Район",
    summaryTitle: "Сводка отношений с магазином",
    totalRequestsLabel: "Всего запросов",
    totalOrdersLabel: "Всего заказов",
    lastActivityLabel: "Последняя активность",
    noteLabel: "Заметка",
    permissionsTitle: "Разрешения",
    canSeePricesLabel: "Видит цены",
    canOrderLabel: "Может заказывать",
    canUseCurrentAccountLabel: "Взаиморасчеты",
    statusManagementTitle: "Управление статусом",
    activateBtn: "Активировать",
    limitBtn: "Ограничить доступ",
    blockBtn: "Заблокировать",
    viewOrdersBtn: "Посмотреть заказы",
    customerRequestsBtn: "Запросы клиентов",
    ordersLink: "Заказы",
    dashboardLink: "Панель управления",
    recordCount: "Записей: {count}",
    actionActiveMsg: "{name} установлен как активный клиент.",
    actionLimitedMsg: "Для {name} установлены ограниченные права.",
    actionBlockedMsg: "{name} заблокирован.",
    actionPermMsg: "Права доступа для {name} обновлены.",
  },
  ka: {
    activeMenu: "კლიენტები",
    eyebrow: "კლიენტებთან ურთიერთობა",
    title: "მაღაზიის კლიენტების მართვა",
    description: "HBS-ის კლიენტები პლატფორმის მომხმარებლები არიან. ეს ეკრანი მართავს მათ კავშირს, შეკვეთებს, ფასებსა და უფლებებს კონკრეტულად თქვენს მაღაზიასთან.",
    authTitle: "მაღაზიაზე დაფუძნებული უფლებები",
    authDesc: "კლიენტი რეგისტრირდება გლობალურად HBS-ში. მაღაზია ცალკე ადგენს ფასის ნახვის, შეკვეთის გაკეთების ან მიმდინარე ანგარიშის უფლებებს მხოლოდ თავისი მაღაზიისთვის.",
    customerListTitle: "კლიენტების სია",
    searchPlaceholder: "ძებნა კლიენტის, ტელეფონის, ფოსტის, ქალაქის ან შენიშვნის მიხედვით",
    searchLabel: "ძებნა",
    statusLabel: "სტატუსი",
    allCustomers: "ყველა კლიენტი",
    active: "აქტიური",
    limited: "შეზღუდული",
    blocked: "დაბლოკილი",
    pending: "ელოდება",
    noCustomersFound: "კლიენტები ამ ფილტრით ვერ მოიძებნა.",
    selectCustomerTip: "დეტალების სანახავად აირჩიეთ კლიენტი მარცხნივ.",
    customerDetailHeader: "კლიენტის დეტალები",
    contactTitle: "კონტაქტი და მდებარეობა",
    phoneLabel: "ტელეფონი",
    emailLabel: "ფოსტა",
    countryLabel: "ქვეყანა",
    cityRegionLabel: "ქალაქი/უბანი",
    summaryTitle: "მაღაზიასთან ურთიერთობის რეზიუმე",
    totalRequestsLabel: "სულ მოთხოვნა",
    totalOrdersLabel: "სულ შეკვეთა",
    lastActivityLabel: "ბოლო აქტივობა",
    noteLabel: "შენიშვნა",
    permissionsTitle: "უფლებები",
    canSeePricesLabel: "ფასის ნახვა",
    canOrderLabel: "შეკვეთის გაკეთება",
    canUseCurrentAccountLabel: "მიმდინარე ანგარიში",
    statusManagementTitle: "სტატუსის მართვა",
    activateBtn: "აქტიურად ქცევა",
    limitBtn: "შეზღუდული უფლება",
    blockBtn: "დაბლოკვა",
    viewOrdersBtn: "შეკვეთების ნახვა",
    customerRequestsBtn: "კლიენტის მოთხოვნები",
    ordersLink: "შეკვეთები",
    dashboardLink: "პანელი",
    recordCount: "{count} ჩანაწერი",
    actionActiveMsg: "{name} დაყენდა როგორც აქტიური კლიენტი.",
    actionLimitedMsg: "შეზღუდული უფლებები დაუწესდა {name}-ს.",
    actionBlockedMsg: "{name} დაიბლოკა.",
    actionPermMsg: "უფლებები განახლდა {name}-სთვის.",
  }
};

type CustomerStatus = "active" | "limited" | "blocked" | "pending";
type CustomerType = "Bireysel" | "Kurumsal";

type StoreCustomer = {
  id: string;
  name: string;
  type: CustomerType;
  phone: string;
  email: string;
  country: string;
  city: string;
  addressRegion: string;
  status: CustomerStatus;
  totalOrders: number;
  totalRequestCount: number;
  lastActivity: string;
  canSeePrices: boolean;
  canOrder: boolean;
  canUseCurrentAccount: boolean;
  note: string;
};

const initialCustomers: StoreCustomer[] = [
  {
    id: "cust-001",
    name: "Demo Auto Service",
    type: "Kurumsal",
    phone: "+995 555 111 222",
    email: "demo@hbs.ge",
    country: "Georgia",
    city: "Batumi",
    addressRegion: "Batumi Merkez",
    status: "active",
    totalOrders: 4,
    totalRequestCount: 9,
    lastActivity: "Bugün 10:24",
    canSeePrices: true,
    canOrder: true,
    canUseCurrentAccount: true,
    note: "Düzenli oto servis müşterisi. Ford ve Toyota parçalarıyla ilgileniyor.",
  },
  {
    id: "cust-002",
    name: "Batumi Garage",
    type: "Kurumsal",
    phone: "+995 555 333 444",
    email: "garage@hbs.ge",
    country: "Georgia",
    city: "Batumi",
    addressRegion: "Yeni Bulvar",
    status: "limited",
    totalOrders: 1,
    totalRequestCount: 3,
    lastActivity: "Bugün 11:05",
    canSeePrices: true,
    canOrder: false,
    canUseCurrentAccount: false,
    note: "Fiyat görebilir ancak sipariş yetkisi mağaza onayına bağlı.",
  },
  {
    id: "cust-003",
    name: "Giorgi Parts",
    type: "Kurumsal",
    phone: "+995 555 777 888",
    email: "giorgi@hbs.ge",
    country: "Georgia",
    city: "Tbilisi",
    addressRegion: "Tbilisi Merkez",
    status: "pending",
    totalOrders: 0,
    totalRequestCount: 2,
    lastActivity: "Dün 17:40",
    canSeePrices: false,
    canOrder: false,
    canUseCurrentAccount: false,
    note: "Yeni ilişki talebi. Mağaza onayı bekliyor.",
  },
];

export default function CustomersPage() {
  const [language, setLanguage] = useState("tr");
  const [customers, setCustomers] = useState<StoreCustomer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<StoreCustomer | null>(
    initialCustomers[0] ?? null
  );
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;

  function statusText(status: CustomerStatus) {
    switch (status) {
      case "active":
        return t.active;
      case "limited":
        return t.limited;
      case "blocked":
        return t.blocked;
      case "pending":
        return t.pending;
    }
  }

  function statusClass(status: CustomerStatus) {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200/50";
      case "limited":
        return "bg-amber-100 text-amber-800 border border-amber-200/50";
      case "blocked":
        return "bg-red-100 text-red-800 border border-red-200/50";
      case "pending":
        return "bg-blue-100 text-blue-800 border border-blue-200/50";
    }
  }

  function translateCustomerType(type: string) {
    if (language === "tr") return type;
    if (type === "Kurumsal") return language === "en" ? "Corporate" : language === "de" ? "Unternehmen" : language === "ru" ? "Корпоративный" : "კორპორატიული";
    if (type === "Bireysel") return language === "en" ? "Individual" : language === "de" ? "Privatkunde" : language === "ru" ? "Индивидуальный" : "ინდივიდუალური";
    return type;
  }

  function translateTime(time: string) {
    if (language === "tr") return time;
    if (time.startsWith("Bugün")) {
      return time.replace("Bugün", language === "en" ? "Today" : language === "de" ? "Heute" : language === "ru" ? "Сегодня" : "დღეს");
    }
    if (time.startsWith("Yarın")) {
      return time.replace("Yarın", language === "en" ? "Tomorrow" : language === "de" ? "Morgen" : language === "ru" ? "Завтра" : "ხვალ");
    }
    if (time.startsWith("Dün")) {
      return time.replace("Dün", language === "en" ? "Yesterday" : language === "de" ? "Gestern" : language === "ru" ? "Вчера" : "გუშინ");
    }
    return time;
  }

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      const matchesSearch =
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.country.toLowerCase().includes(q) ||
        customer.city.toLowerCase().includes(q) ||
        customer.addressRegion.toLowerCase().includes(q) ||
        customer.note.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [customers, statusFilter, search]);

  function updateCustomer(
    customerId: string,
    updates: Partial<StoreCustomer>,
    successMessage: string
  ) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === customerId ? { ...customer, ...updates } : customer
      )
    );

    setSelectedCustomer((currentCustomer) =>
      currentCustomer && currentCustomer.id === customerId
        ? { ...currentCustomer, ...updates }
        : currentCustomer
    );

    setMessage(successMessage);
  }

  function activateCustomer(customer: StoreCustomer) {
    updateCustomer(
      customer.id,
      {
        status: "active",
        canSeePrices: true,
        canOrder: true,
        canUseCurrentAccount: false,
      },
      t.actionActiveMsg.replace("{name}", customer.name)
    );
  }

  function limitCustomer(customer: StoreCustomer) {
    updateCustomer(
      customer.id,
      {
        status: "limited",
        canSeePrices: true,
        canOrder: false,
        canUseCurrentAccount: false,
      },
      t.actionLimitedMsg.replace("{name}", customer.name)
    );
  }

  function blockCustomer(customer: StoreCustomer) {
    updateCustomer(
      customer.id,
      {
        status: "blocked",
        canSeePrices: false,
        canOrder: false,
        canUseCurrentAccount: false,
      },
      t.actionBlockedMsg.replace("{name}", customer.name)
    );
  }

  function togglePermission(
    customer: StoreCustomer,
    permission:
      | "canSeePrices"
      | "canOrder"
      | "canUseCurrentAccount"
  ) {
    updateCustomer(
      customer.id,
      {
        [permission]: !customer[permission],
      },
      t.actionPermMsg.replace("{name}", customer.name)
    );
  }

  return (
    <DashboardLayout activeMenu={t.activeMenu}>
      <div className="space-y-4 text-slate-900">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                {t.eyebrow}
              </p>
              <h1 className="text-2xl font-black text-slate-800">
                {t.title}
              </h1>
              <p className="text-sm leading-relaxed text-slate-500 max-w-3xl">
                {t.description}
              </p>
            </div>
            <div className="shrink-0 flex gap-2">
              <Link
                href="/dashboard/customer-requests"
                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-2.5 shadow-sm active:scale-95 transition whitespace-nowrap"
              >
                {t.customerRequestsBtn}
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-250 bg-blue-50/50 p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-sm font-black text-blue-900">
            {t.authTitle}
          </h2>
          <p className="mt-1.5 text-xs text-blue-800/90 leading-relaxed font-bold max-w-5xl">
            {t.authDesc}
          </p>
        </section>

        {message && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-black text-blue-850 shadow-sm animate-fadeIn">
            ✓ {message}
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <p className="text-base font-black text-slate-800">
                {t.customerListTitle}
              </p>
              <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                {t.recordCount.replace("{count}", String(filteredCustomers.length))}
              </span>
            </div>

            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-650">{t.searchLabel}</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                  placeholder={t.searchPlaceholder} />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-650">{t.statusLabel}</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as CustomerStatus | "all")
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-850 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="all">{t.allCustomers}</option>
                  <option value="active">{t.active}</option>
                  <option value="limited">{t.limited}</option>
                  <option value="pending">{t.pending}</option>
                  <option value="blocked">{t.blocked}</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 border-t border-slate-100 pt-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => setSelectedCustomer(customer)}
                  className={`rounded-2xl border p-4 text-left transition select-none ${
                    selectedCustomer?.id === customer.id
                      ? "border-blue-500 bg-blue-50/50 text-slate-800"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusClass(
                        customer.status
                      )}`}
                    >
                      {statusText(customer.status)}
                    </span>

                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {translateCustomerType(customer.type)}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-800 text-xs sm:text-sm">{customer.name}</h3>

                  <p className="mt-1 text-xs text-slate-500 font-bold leading-normal">
                    {customer.city} · {customer.totalRequestCount} {language === "tr" ? "talep" : "requests"} ·{" "}
                    {customer.totalOrders} {language === "tr" ? "sipariş" : "orders"}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400 font-bold">
                    {language === "tr" ? "Son işlem:" : "Last active:"} {translateTime(customer.lastActivity)}
                  </p>
                </button>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs font-semibold text-slate-500 text-center">
                  {t.noCustomersFound}
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {!selectedCustomer ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-xs font-bold text-slate-500 text-center">
                {t.selectCustomerTip}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                      {t.customerDetailHeader}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-800">
                      {selectedCustomer.name}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 font-bold">
                      {translateCustomerType(selectedCustomer.type)} · {selectedCustomer.country} / {selectedCustomer.city}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusClass(
                      selectedCustomer.status
                    )}`}
                  >
                    {statusText(selectedCustomer.status)}
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.contactTitle}</h3>

                    <div className="grid gap-3 text-xs text-slate-600 font-bold sm:grid-cols-2">
                      <p>
                        <span className="text-slate-400 font-bold block">{t.phoneLabel}:</span>{" "}
                        {selectedCustomer.phone}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.emailLabel}:</span>{" "}
                        {selectedCustomer.email}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.countryLabel}:</span>{" "}
                        {selectedCustomer.country}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.cityRegionLabel}:</span>{" "}
                        {selectedCustomer.city} / {selectedCustomer.addressRegion}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.summaryTitle}</h3>

                    <div className="grid gap-3 text-xs text-slate-600 font-bold sm:grid-cols-3">
                      <p>
                        <span className="text-slate-400 font-bold block">{t.totalRequestsLabel}:</span>{" "}
                        {selectedCustomer.totalRequestCount}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.totalOrdersLabel}:</span>{" "}
                        {selectedCustomer.totalOrders}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.lastActivityLabel}:</span>{" "}
                        {translateTime(selectedCustomer.lastActivity)}
                      </p>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-650 font-semibold border-t border-slate-100 pt-2.5">
                      <span className="text-slate-400 font-black block mb-1">{t.noteLabel}:</span>{" "}
                      {selectedCustomer.note}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.permissionsTitle}</h3>

                    <div className="grid gap-3 md:grid-cols-3">
                      <button
                        type="button"
                        onClick={() =>
                          togglePermission(selectedCustomer, "canSeePrices")
                        }
                        className={`rounded-xl px-4 py-2.5 text-xs font-black transition border ${
                          selectedCustomer.canSeePrices
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {t.canSeePricesLabel}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          togglePermission(selectedCustomer, "canOrder")
                        }
                        className={`rounded-xl px-4 py-2.5 text-xs font-black transition border ${
                          selectedCustomer.canOrder
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {t.canOrderLabel}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          togglePermission(
                            selectedCustomer,
                            "canUseCurrentAccount"
                          )
                        }
                        className={`rounded-xl px-4 py-2.5 text-xs font-black transition border ${
                          selectedCustomer.canUseCurrentAccount
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {t.canUseCurrentAccountLabel}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.statusManagementTitle}</h3>

                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => activateCustomer(selectedCustomer)}
                        className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white hover:bg-slate-800 active:scale-95 transition"
                      >
                        {t.activateBtn}
                      </button>

                      <button
                        type="button"
                        onClick={() => limitCustomer(selectedCustomer)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                      >
                        {t.limitBtn}
                      </button>

                      <button
                        type="button"
                        onClick={() => blockCustomer(selectedCustomer)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-800 hover:bg-red-100 active:scale-95 transition"
                      >
                        {t.blockBtn}
                      </button>

                      <Link
                        href="/dashboard/orders"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center"
                      >
                        {t.viewOrdersBtn}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </DashboardLayout>
  );
}