"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

type OrderStatus =
  | "new"
  | "quoted"
  | "waiting_customer"
  | "approved"
  | "preparing"
  | "completed"
  | "cancelled";

type OrderType = "Teklif Talebi" | "Sipariş Talebi" | "Sepet Talebi" | "Kiralama Talebi";

type OrderItem = {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: string;
  stockStatus: "Stokta var" | "Sınırlı stok" | "Kontrol gerekli";
};

type CustomerOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderType: OrderType;
  status: OrderStatus;
  createdAt: string;
  city: string;
  note: string;
  items: OrderItem[];
};

const initialOrders: CustomerOrder[] = [
  {
    id: "ord-001",
    customerName: "Demo Auto Service",
    customerPhone: "+995 555 111 222",
    customerEmail: "demo@hbs.ge",
    orderType: "Teklif Talebi",
    status: "new",
    createdAt: "Bugün 10:24",
    city: "Batumi",
    note: "Ford Escape için uyumlu fren balatası fiyatı ve teslimat süresi isteniyor.",
    items: [
      {
        id: "item-001",
        productName: "Ford Escape Fren Balatası",
        productCode: "FR-BALATA-ESCAPE-001",
        quantity: 2,
        unitPrice: "",
        stockStatus: "Stokta var",
      },
    ],
  },
  {
    id: "ord-002",
    customerName: "Batumi Garage",
    customerPhone: "+995 555 333 444",
    customerEmail: "garage@hbs.ge",
    orderType: "Sipariş Talebi",
    status: "quoted",
    createdAt: "Bugün 11:05",
    city: "Batumi",
    note: "Toyota Corolla yağ filtresi için sipariş onayı bekleniyor.",
    items: [
      {
        id: "item-002",
        productName: "Toyota Corolla Yağ Filtresi",
        productCode: "FR-FILTRE-COROLLA-002",
        quantity: 5,
        unitPrice: "22 GEL",
        stockStatus: "Stokta var",
      },
    ],
  },
  {
    id: "ord-003",
    customerName: "Giorgi Parts",
    customerPhone: "+995 555 777 888",
    customerEmail: "giorgi@hbs.ge",
    orderType: "Sepet Talebi",
    status: "waiting_customer",
    createdAt: "Dün 17:40",
    city: "Tbilisi",
    note: "Sepetteki ürünler için toplu teklif istendi.",
    items: [
      {
        id: "item-003",
        productName: "Universal Buji Seti",
        productCode: "FR-BUJI-SET-004",
        quantity: 4,
        unitPrice: "Teklif verilecek",
        stockStatus: "Sınırlı stok",
      },
      {
        id: "item-004",
        productName: "Toyota Corolla Yağ Filtresi",
        productCode: "FR-FILTRE-COROLLA-002",
        quantity: 2,
        unitPrice: "22 GEL",
        stockStatus: "Stokta var",
      },
    ],
  },
  {
    id: "ord-004",
    customerName: "Kutaisi Auto Hub",
    customerPhone: "+995 555 999 888",
    customerEmail: "kutaisi@hbs.ge",
    orderType: "Kiralama Talebi",
    status: "new",
    createdAt: "Bugün 12:00",
    city: "Kutaisi",
    note: "Autel MaxiSys Ultra arıza tespit cihazını 1 haftalık kiralama talebi. Depozito bedeli bloke edilmelidir.",
    items: [
      {
        id: "item-005",
        productName: "Autel MaxiSys Ultra Arıza Tespit Cihazı",
        productCode: "SKU-AUTEL-001",
        quantity: 1,
        unitPrice: "450 GEL",
        stockStatus: "Stokta var",
      },
    ],
  },
];

// Translations Dictionary
const translations = {
  tr: {
    activeMenu: "Siparişler",
    eyebrow: "SİPARİŞ VE TEKLİFLER",
    title: "Sipariş / Teklif Yönetimi",
    description: "Mağaza vitrini ve müşteri portalından gelen sepet taleplerini, sipariş isteklerini, fiyat tekliflerini ve müşteri onay süreçlerini buradan yönetin.",
    customerInfo: "Müşteri Bilgileri",
    city: "Şehir",
    escrowTitle: "Kiralama Güvence Bedeli (Escrow Deposit)",
    escrowDesc: "Airbnb tarzı otomatik hasar ve iade güvence sistemi aktiftir.",
    products: "Ürünler",
    statusManagement: "Durum Yönetimi",
    messageToCustomer: "Müşteriye Mesaj",
    messagePlaceholder: "Fiyat, teslimat süresi, stok durumu veya ek açıklama yazın",
    allRecords: "Tüm Kayıtlar",
    waitingCustomer: "Müşteri Onayı Bekliyor",
    approved: "Onaylandı",
    preparing: "Hazırlanıyor",
    completed: "Tamamlandı",
    cancelled: "İptal",
    searchPlaceholder: "Müşteri, telefon, ürün, kod veya şehir ara",
    transactionId: "İşlem ID",
    ordersHeader: "Gelen Siparişler",
    new: "Yeni",
    noRecordsFound: "Bu filtreye uygun sipariş veya teklif kaydı bulunamadı.",
    selectRecordTip: "Detay görmek için soldan bir kayıt seçin.",
    orderDetailHeader: "Sipariş Detayı",
    customerNameLabel: "Ad/Firma",
    customerPhoneLabel: "Telefon",
    customerEmailLabel: "E-posta",
    noteLabel: "Not",
    sendOfferBtn: "Teklif Gönder",
    sendMessageBtn: "Mesaj Gönder",
    quantityLabel: "Miktar",
    unitLabel: "Birim",
    totalLabel: "Toplam",
    requiresOffer: "Teklif gerekli",
    stockStatusLabel: "Durum",
    recordCount: "{count} kayıt",
    customerRequestsBtn: "Müşteri Talepleri",
  },
  en: {
    activeMenu: "Orders",
    eyebrow: "ORDERS & OFFERS",
    title: "Order & Quote Management",
    description: "Manage cart inquiries, order requests, price quotes, and customer confirmation flows arriving from the storefront and customer portal.",
    customerInfo: "Customer Information",
    city: "City",
    escrowTitle: "Rental Escrow Deposit",
    escrowDesc: "Airbnb-style automatic damage and refund assurance system is active.",
    products: "Products",
    statusManagement: "Status Management",
    messageToCustomer: "Message to Customer",
    messagePlaceholder: "Write price, delivery time, stock status or additional notes",
    allRecords: "All Records",
    waitingCustomer: "Waiting for Customer Approval",
    approved: "Approved",
    preparing: "Preparing",
    completed: "Completed",
    cancelled: "Cancelled",
    searchPlaceholder: "Search customer, phone, product, code or city",
    transactionId: "Transaction ID",
    ordersHeader: "Incoming Orders",
    new: "New",
    noRecordsFound: "No orders or quotes found matching this filter.",
    selectRecordTip: "Select a record from the left to view details.",
    orderDetailHeader: "Order Details",
    customerNameLabel: "Name/Company",
    customerPhoneLabel: "Phone",
    customerEmailLabel: "Email",
    noteLabel: "Note",
    sendOfferBtn: "Send Offer",
    sendMessageBtn: "Send Message",
    quantityLabel: "Qty",
    unitLabel: "Unit",
    totalLabel: "Total",
    requiresOffer: "Quote required",
    stockStatusLabel: "Status",
    recordCount: "{count} records",
    customerRequestsBtn: "Customer Inquiries",
  },
  de: {
    activeMenu: "Bestellungen",
    eyebrow: "BESTELLUNGEN & ANGEBOTE",
    title: "Bestell- & Angebotsverwaltung",
    description: "Verwalten Sie Warenkorbanfragen, Bestellungen, Preisangebote und Kundenbestätigungen aus dem Schaufenster und Kundenportal.",
    customerInfo: "Kundeninformationen",
    city: "Stadt",
    escrowTitle: "Mietkautionshinterlegung (Treuhand)",
    escrowDesc: "Automatische Kautions- und Rückerstattungsgarantie nach Airbnb-Art ist aktiv.",
    products: "Produkte",
    statusManagement: "Statusverwaltung",
    messageToCustomer: "Nachricht an den Kunden",
    messagePlaceholder: "Preis, Lieferzeit, Lagerstatus oder zusätzliche Notizen schreiben",
    allRecords: "Alle Einträge",
    waitingCustomer: "Wartet auf Kundenfreigabe",
    approved: "Freigegeben",
    preparing: "In Vorbereitung",
    completed: "Abgeschlossen",
    cancelled: "Storniert",
    searchPlaceholder: "Kunde, Telefon, Produkt, Code oder Stadt suchen",
    transactionId: "Transaktions-ID",
    ordersHeader: "Eingehende Bestellungen",
    new: "Neu",
    noRecordsFound: "Keine Bestellungen oder Angebote gefunden, die diesem Filter entsprechen.",
    selectRecordTip: "Wählen Sie links einen Eintrag aus, um Details anzuzeigen.",
    orderDetailHeader: "Bestelldetails",
    customerNameLabel: "Name/Firma",
    customerPhoneLabel: "Telefon",
    customerEmailLabel: "E-Mail",
    noteLabel: "Notiz",
    sendOfferBtn: "Angebot senden",
    sendMessageBtn: "Nachricht senden",
    quantityLabel: "Menge",
    unitLabel: "Einheit",
    totalLabel: "Gesamt",
    requiresOffer: "Angebot erforderlich",
    stockStatusLabel: "Status",
    recordCount: "{count} Einträge",
    customerRequestsBtn: "Kundenanfragen",
  },
  ru: {
    activeMenu: "Заказы",
    eyebrow: "ЗАКАЗЫ И ПРЕДЛОЖЕНИЯ",
    title: "Управление заказами и предложениями",
    description: "Управляйте запросами корзины, заказами, ценовыми предложениями и подтверждениями от клиентов, поступающими с витрины и личного кабинета.",
    customerInfo: "Информация о клиенте",
    city: "Город",
    escrowTitle: "Залог при аренде (Эскроу)",
    escrowDesc: "Активна автоматическая система обеспечения сохранности оборудования и возврата залога в стиле Airbnb.",
    products: "Товары",
    statusManagement: "Управление статусом",
    messageToCustomer: "Сообщение клиенту",
    messagePlaceholder: "Напишите цену, срок поставки, наличие на складе или примечания",
    allRecords: "Все записи",
    waitingCustomer: "Ожидает подтверждения клиента",
    approved: "Одобрено",
    preparing: "Готовится к отправке",
    completed: "Выполнено",
    cancelled: "Отменено",
    searchPlaceholder: "Поиск клиента, телефона, товара, кода или города",
    transactionId: "ID транзакции",
    ordersHeader: "Поступившие заказы",
    new: "Новый",
    noRecordsFound: "Заказы или предложения, соответствующие фильтру, не найдены.",
    selectRecordTip: "Выберите запись слева для просмотра деталей.",
    orderDetailHeader: "Детали заказа",
    customerNameLabel: "Имя/Компания",
    customerPhoneLabel: "Телефон",
    customerEmailLabel: "E-mail",
    noteLabel: "Примечание",
    sendOfferBtn: "Отправить предложение",
    sendMessageBtn: "Отправить сообщение",
    quantityLabel: "Кол-во",
    unitLabel: "Цена",
    totalLabel: "Итого",
    requiresOffer: "Требуется оценка",
    stockStatusLabel: "Статус",
    recordCount: "Записей: {count}",
    customerRequestsBtn: "Запросы клиентов",
  },
  ka: {
    activeMenu: "შეკვეთები",
    eyebrow: "შეკვეთები და შეთავაზებები",
    title: "შეკვეთებისა და ფასების მართვა",
    description: "მართეთ კალათის მოთხოვნები, შეკვეთები, ფასების შეთავაზებები და კლიენტის დადასტურების ეტაპები ვიტრინიდან და კლიენტის პორტალიდან.",
    customerInfo: "კლიენტის ინფორმაცია",
    city: "ქალაქი",
    escrowTitle: "ქირაობის საგარანტიო დეპოზიტი",
    escrowDesc: "აქტიურია Airbnb-ის ტიპის ზარალის დაზღვევისა და დაბრუნების ავტომატური სისტემა.",
    products: "პროდუქტები",
    statusManagement: "სტატუსის მართვა",
    messageToCustomer: "შეტყობინება კლიენტს",
    messagePlaceholder: "მიუთითეთ ფასი, მიწოდების დრო, მარაგის სტატუსი ან დამატებითი ინფორმაცია",
    allRecords: "ყველა ჩანაწერი",
    waitingCustomer: "ელოდება კლიენტის დადასტურებას",
    approved: "დადასტურებული",
    preparing: "მზადდება",
    completed: "დასრულებული",
    cancelled: "გაუქმებული",
    searchPlaceholder: "ძებნა კლიენტის, ტელეფონის, პროდუქტის, კოდის ან ქალაქის მიხედვით",
    transactionId: "ტრანზაქციის ID",
    ordersHeader: "შემოსული შეკვეთები",
    new: "ახალი",
    noRecordsFound: "შეკვეთები ამ ფილტრით ვერ მოიძებნა.",
    selectRecordTip: "დეტალების სანახავად აირჩიეთ ჩანაწერი მარცხნივ.",
    orderDetailHeader: "შეკვეთის დეტალები",
    customerNameLabel: "სახელი/კომპანია",
    customerPhoneLabel: "ტელეფონი",
    customerEmailLabel: "ფოსტა",
    noteLabel: "შენიშვნა",
    sendOfferBtn: "შეთავაზების გაგზავნა",
    sendMessageBtn: "შეტყობინების გაგზავნა",
    quantityLabel: "რაოდ",
    unitLabel: "ფასი",
    totalLabel: "ჯამი",
    requiresOffer: "საჭიროებს შეფასებას",
    stockStatusLabel: "სტატუსი",
    recordCount: "{count} ჩანაწერი",
    customerRequestsBtn: "კლიენტის მოთხოვნები",
  }
};

export default function OrdersPage() {
  const [language, setLanguage] = useState("tr");
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(
    initialOrders[0] ?? null
  );
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [escrowStates, setEscrowStates] = useState<Record<string, "pending" | "locked" | "released" | "charged">>({});

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;

  function statusText(status: OrderStatus) {
    switch (status) {
      case "new":
        return t.new;
      case "quoted":
        return language === "en" ? "Offer Sent" : language === "de" ? "Angebot gesendet" : language === "ru" ? "Предложение отправлено" : language === "ka" ? "შემოთავაზება გაგზავნილია" : "Teklif Verildi";
      case "waiting_customer":
        return t.waitingCustomer;
      case "approved":
        return t.approved;
      case "preparing":
        return t.preparing;
      case "completed":
        return t.completed;
      case "cancelled":
        return t.cancelled;
    }
  }

  function statusClass(status: OrderStatus) {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border border-blue-200/50";
      case "quoted":
        return "bg-purple-100 text-purple-800 border border-purple-200/50";
      case "waiting_customer":
        return "bg-amber-100 text-amber-800 border border-amber-200/50";
      case "approved":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200/50";
      case "preparing":
        return "bg-cyan-100 text-cyan-800 border border-cyan-200/50";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200/50";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200/50";
    }
  }

  function translateOrderType(type: string) {
    if (language === "tr") return type;
    if (type === "Teklif Talebi") return language === "en" ? "Quote Request" : language === "de" ? "Angebotsanfrage" : language === "ru" ? "Запрос предложения" : "ფასის მოთხოვნა";
    if (type === "Sipariş Talebi") return language === "en" ? "Order Request" : language === "de" ? "Bestellanfrage" : language === "ru" ? "Запрос заказа" : "შეკვეთის მოთხოვნა";
    if (type === "Sepet Talebi") return language === "en" ? "Cart Request" : language === "de" ? "Warenkorb-Anfrage" : language === "ru" ? "Запрос корзины" : "კალათის მოთხოვნა";
    if (type === "Kiralama Talebi") return language === "en" ? "Rental Request" : language === "de" ? "Mietanfrage" : language === "ru" ? "Запрос аренды" : "ქირაობის მოთხოვნა";
    return type;
  }

  function translateStockStatus(status: string) {
    if (language === "tr") return status;
    if (status === "Stokta var") return language === "en" ? "In Stock" : language === "de" ? "Auf Lager" : language === "ru" ? "В наличии" : "მარაგშია";
    if (status === "Sınırlı stok") return language === "en" ? "Limited Stock" : language === "de" ? "Begrenzter Lagerbestand" : language === "ru" ? "Ограниченный запас" : "მცირე მარაგი";
    if (status === "Kontrol gerekli") return language === "en" ? "Requires Check" : language === "de" ? "Prüfung erforderlich" : language === "ru" ? "Требуется проверка" : "საჭიროებს შემოწმებას";
    return status;
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

  function orderTotalText(order: CustomerOrder) {
    const total = order.items.reduce((sum, item) => {
      const numericPrice = Number(item.unitPrice.replace(/[^\d.]/g, ""));
      if (!numericPrice) return sum;
      return sum + numericPrice * item.quantity;
    }, 0);

    if (!total) return t.requiresOffer;

    return `${total.toFixed(2)} GEL`;
  }

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesSearch =
        !q ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q) ||
        order.items.some(
          (item) =>
            item.productName.toLowerCase().includes(q) ||
            item.productCode.toLowerCase().includes(q)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    setSelectedOrder((current) =>
      current && current.id === orderId ? { ...current, status } : current
    );

    setMessage(
      language === "tr"
        ? `Kayıt durumu "${statusText(status)}" olarak güncellendi.`
        : `Status updated to "${statusText(status)}".`
    );
  }

  function sendOffer() {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, "quoted");
  }

  function sendMessage() {
    if (!selectedOrder) return;

    if (!replyText.trim()) {
      setMessage(language === "tr" ? "Mesaj göndermek için metin yazın." : "Please enter a message to send.");
      return;
    }

    setReplyText("");
    setMessage(
      language === "tr"
        ? `"${selectedOrder.customerName}" müşterisine demo mesaj gönderildi. Gerçek sistemde bu mesaj sipariş kaydına bağlanacak.`
        : `Demo message sent to "${selectedOrder.customerName}".`
    );
  }

  function translateEscrowState(state: string) {
    if (state === "locked") return language === "en" ? "Deposited 🔒" : language === "de" ? "Hinterlegt 🔒" : language === "ru" ? "Заблокировано 🔒" : language === "ka" ? "ბლოკირებულია 🔒" : "Bloke Edildi 🔒";
    if (state === "released") return language === "en" ? "Released ✓" : language === "de" ? "Freigegeben ✓" : language === "ru" ? "Разблокировано ✓" : language === "ka" ? "განბლოკილია ✓" : "Serbest Bırakıldı ✓";
    if (state === "charged") return language === "en" ? "Charged ⚠️" : language === "de" ? "Belastet ⚠️" : language === "ru" ? "Списано ⚠️" : language === "ka" ? "ჩამოჭრილია ⚠️" : "Tazmin Edildi ⚠️";
    return language === "en" ? "Pending Deposit" : language === "de" ? "Kaution ausstehend" : language === "ru" ? "Ожидание залога" : language === "ka" ? "დეპოზიტის მოლოდინში" : "Blokaj Bekleniyor";
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
                {t.customerRequestsBtn || "Müşteri Talepleri"}
              </Link>
            </div>
          </div>
        </header>

        {message && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-sm animate-fadeIn">
            ✓ {message}
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-800">
                {t.ordersHeader}
              </h2>
              <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                {t.recordCount.replace("{count}", String(filteredOrders.length))}
              </span>
            </div>

            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-650">{language === "tr" ? "Arama" : "Search"}</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                  placeholder={t.searchPlaceholder} />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-650">{language === "tr" ? "Durum" : "Status"}</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as OrderStatus | "all")
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-850 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="all">{t.allRecords}</option>
                  <option value="new">{t.new}</option>
                  <option value="quoted">{language === "tr" ? "Teklif Verildi" : "Offer Sent"}</option>
                  <option value="waiting_customer">{t.waitingCustomer}</option>
                  <option value="approved">{t.approved}</option>
                  <option value="preparing">{t.preparing}</option>
                  <option value="completed">{t.completed}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 border-t border-slate-100 pt-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrder(order);
                    setMessage("");
                  }}
                  className={`rounded-2xl border p-4 text-left transition select-none ${
                    selectedOrder?.id === order.id
                      ? "border-blue-500 bg-blue-50/50 text-slate-800"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusClass(
                        order.status
                      )}`}
                    >
                      {statusText(order.status)}
                    </span>

                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {translateOrderType(order.orderType)}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-800 text-xs sm:text-sm">{order.customerName}</h3>

                  <p className="mt-1 text-xs text-slate-500 font-bold leading-normal">
                    {order.items.length} {language === "tr" ? "ürün" : "items"} · {orderTotalText(order)}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400 font-bold">
                    {translateTime(order.createdAt)} · {order.city}
                  </p>
                </button>
              ))}

              {filteredOrders.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs font-semibold text-slate-500 text-center">
                  {t.noRecordsFound}
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {!selectedOrder ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-xs font-bold text-slate-500 text-center">
                {t.selectRecordTip}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                      {t.orderDetailHeader}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-800">
                      {selectedOrder.customerName}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 font-bold">
                      {translateOrderType(selectedOrder.orderType)} · {translateTime(selectedOrder.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusClass(
                      selectedOrder.status
                    )}`}
                  >
                    {statusText(selectedOrder.status)}
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.customerInfo}</h3>

                    <div className="grid gap-3 text-xs text-slate-600 font-bold sm:grid-cols-2">
                      <p>
                        <span className="text-slate-400 font-bold block">{t.customerNameLabel}:</span>{" "}
                        {selectedOrder.customerName}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.customerPhoneLabel}:</span>{" "}
                        {selectedOrder.customerPhone}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.customerEmailLabel}:</span>{" "}
                        {selectedOrder.customerEmail}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.city}:</span>{" "}
                        {selectedOrder.city}
                      </p>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-650 font-semibold border-t border-slate-100 pt-2.5">
                      <span className="text-slate-400 font-black block mb-1">{t.noteLabel}:</span>{" "}
                      {selectedOrder.note}
                    </p>
                  </div>

                  {/* 🔒 Escrow Deposit Panel (Rental Protection) */}
                  {selectedOrder.orderType === "Kiralama Talebi" && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🔒</span>
                          <div>
                            <h4 className="text-xs font-black text-blue-900">{t.escrowTitle}</h4>
                            <p className="text-[10px] text-blue-800 font-bold leading-relaxed">{t.escrowDesc}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                          (escrowStates[selectedOrder.id] || "pending") === "locked"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : (escrowStates[selectedOrder.id] || "pending") === "released"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : (escrowStates[selectedOrder.id] || "pending") === "charged"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }`}>
                          {translateEscrowState(escrowStates[selectedOrder.id] || "pending")}
                        </span>
                      </div>

                      <div className="grid gap-2 bg-white/70 p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-650">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{language === "tr" ? "Bloke Edilecek Depozito:" : "Deposit to Escrow:"}</span>
                          <span className="font-black text-slate-800">900.00 GEL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{language === "tr" ? "Kart Sahibi:" : "Cardholder:"}</span>
                          <span className="text-slate-800">{selectedOrder.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t.transactionId}:</span>
                          <span className="font-mono text-slate-500">ESC-LOCK-{selectedOrder.id.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap pt-1">
                        {(escrowStates[selectedOrder.id] || "pending") === "pending" && (
                          <button
                            type="button"
                            onClick={() => {
                              setEscrowStates(prev => ({ ...prev, [selectedOrder.id]: "locked" }));
                              setMessage(language === "tr" ? "Güvence bedeli başarıyla müşterinin kartından bloke edildi." : "Rental security deposit authorized and locked.");
                            }}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-2 text-xs font-black text-white transition active:scale-95 shadow-sm"
                          >
                            🔒 {language === "tr" ? "Kartı Yetkilendir ve 900 GEL Bloke Et" : "Authorize Card & Lock 900 GEL"}
                          </button>
                        )}
                        {(escrowStates[selectedOrder.id] || "pending") === "locked" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEscrowStates(prev => ({ ...prev, [selectedOrder.id]: "released" }));
                                updateOrderStatus(selectedOrder.id, "completed");
                                setMessage(language === "tr" ? "Hasarsız iade onaylandı. Depozito blokesi kaldırıldı." : "Inspection approved. Escrow deposit released to client.");
                              }}
                              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-black text-white transition active:scale-95 shadow-sm"
                            >
                              ✓ {language === "tr" ? "Hasarsız İade Alındı (Blokajı Çöz)" : "Return Accepted (Release Escrow)"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEscrowStates(prev => ({ ...prev, [selectedOrder.id]: "charged" }));
                                updateOrderStatus(selectedOrder.id, "cancelled");
                                setMessage(language === "tr" ? "Hasarlı ürün raporlandı. 900 GEL depozito tahsil edildi." : "Damage reported. Charged 900 GEL to client card.");
                              }}
                              className="rounded-xl bg-rose-650 hover:bg-rose-700 px-3 py-2 text-xs font-black text-white transition active:scale-95 shadow-sm"
                            >
                              ⚠️ {language === "tr" ? "Hasarlı / Eksik İade (Depozitoyu Çek)" : "Damaged Return (Charge Escrow)"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.products}</h3>

                    <div className="grid gap-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 space-y-2"
                        >
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h4 className="font-black text-slate-800 text-xs sm:text-sm">{item.productName}</h4>
                              <p className="text-[10px] text-slate-400 font-bold">
                                {language === "tr" ? "Kod" : "Code"}: {item.productCode}
                              </p>
                            </div>

                            <span className="w-fit rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-650">
                              {translateStockStatus(item.stockStatus)}
                            </span>
                          </div>

                          <div className="grid gap-2 text-xs text-slate-650 font-bold sm:grid-cols-3 border-t border-slate-100 pt-2.5">
                            <p>
                              <span className="text-slate-400 font-bold block">{t.quantityLabel}:</span>{" "}
                              {item.quantity}
                            </p>

                            <p>
                              <span className="text-slate-400 font-bold block">{t.unitLabel}:</span>{" "}
                              {item.unitPrice ? item.unitPrice : t.requiresOffer}
                            </p>

                            <p>
                              <span className="text-slate-400 font-bold block">{t.totalLabel}:</span>{" "}
                              {item.unitPrice
                                ? `${(
                                    Number(item.unitPrice.replace(/[^\d.]/g, "")) *
                                    item.quantity
                                  ).toFixed(2)} GEL`
                                : t.requiresOffer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.statusManagement}</h3>

                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-5">
                      <button
                        type="button"
                        onClick={sendOffer}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                      >
                        {t.sendOfferBtn}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "approved")
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                      >
                        {t.approved}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "preparing")
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                      >
                        {t.preparing}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "completed")
                        }
                        className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white hover:bg-slate-800 active:scale-95 transition"
                      >
                        {t.completed}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "cancelled")
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-800 hover:bg-red-100 active:scale-95 transition"
                      >
                        {t.cancelled}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.messageToCustomer}</h3>

                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                      placeholder={t.messagePlaceholder}
                    />

                    <button
                      type="button"
                      onClick={sendMessage}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-black text-white active:scale-95 transition"
                    >
                      {t.sendMessageBtn}
                    </button>
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