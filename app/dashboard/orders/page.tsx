"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

function statusText(status: OrderStatus) {
  switch (status) {
    case "new":
      return "Yeni";
    case "quoted":
      return "Teklif Verildi";
    case "waiting_customer":
      return "Müşteri Onayı Bekliyor";
    case "approved":
      return "Onaylandı";
    case "preparing":
      return "Hazırlanıyor / Sevkiyat";
    case "completed":
      return "Tamamlandı / Kiralama İade";
    case "cancelled":
      return "İptal";
  }
}

function statusClass(status: OrderStatus) {
  switch (status) {
    case "new":
      return "bg-blue-950 text-blue-200";
    case "quoted":
      return "bg-purple-950 text-purple-200";
    case "waiting_customer":
      return "bg-yellow-950 text-yellow-200";
    case "approved":
      return "bg-emerald-950 text-emerald-200";
    case "preparing":
      return "bg-cyan-950 text-cyan-200";
    case "completed":
      return "bg-green-950 text-green-200";
    case "cancelled":
      return "bg-red-950 text-red-200";
  }
}

function orderTotalText(order: CustomerOrder) {
  const total = order.items.reduce((sum, item) => {
    const numericPrice = Number(item.unitPrice.replace(/[^\d.]/g, ""));
    if (!numericPrice) return sum;
    return sum + numericPrice * item.quantity;
  }, 0);

  if (!total) return "Teklif gerekli";

  return `${total.toFixed(2)} GEL`;
}

// Translations Dictionary
const translations = {
  tr: {
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
    transactionId: "İşlem ID"
  },
  en: {
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
    transactionId: "Transaction ID"
  },
  de: {
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
    transactionId: "Transaktions-ID"
  },
  ru: {
    customerInfo: "Информация о клиенте",
    city: "Город",
    escrowTitle: "Гарантийный депозит аренды (Escrow)",
    escrowDesc: "Активна система автоматического страхования ущерба и возврата средств в стиле Airbnb.",
    products: "Товары",
    statusManagement: "Управление статусом",
    messageToCustomer: "Сообщение клиенту",
    messagePlaceholder: "Напишите цену, срок поставки, наличие на складе или примечания",
    allRecords: "Все записи",
    waitingCustomer: "Ожидает одобрения клиента",
    approved: "Одобрено",
    preparing: "Подготовка",
    completed: "Выполнено",
    cancelled: "Отменено",
    searchPlaceholder: "Поиск клиента, телефона, товара, кода или города",
    transactionId: "ID транзакции"
  },
  ka: {
    customerInfo: "კლიენტის ინფორმაცია",
    city: "ქალაქი",
    escrowTitle: "საიჯარო დეპოზიტი (Escrow)",
    escrowDesc: "აქტიურია Airbnb-ის სტილის ავტომატური დაზიანებისა და თანხის დაბრუნების გარანტიის სისტემა.",
    products: "პროდუქტები",
    statusManagement: "სტატუსის მართვა",
    messageToCustomer: "შეტყობინება კლიენტისთვის",
    messagePlaceholder: "მიუთითეთ ფასი, მიწოდების დრო, მარაგის სტატუსი ან დამატებითი შენიშვნა",
    allRecords: "ყველა ჩანაწერი",
    waitingCustomer: "მომხმარებლის დასტურის მოლოდინში",
    approved: "დადასტურებული",
    preparing: "მზადდება",
    completed: "დასრულებული",
    cancelled: "გაუქმებული",
    searchPlaceholder: "ძებნა კლიენტის, ტელეფონის, პროდუქტის, კოდის ან ქალაქის მიხედვით",
    transactionId: "ტრანზაქციის ID"
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(
    initialOrders[0] ?? null
  );
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState("");
  const [escrowStates, setEscrowStates] = useState<Record<string, "pending" | "locked" | "released" | "charged">>({});
  const [language, setLanguage] = useState("tr");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;

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
        order.note.toLowerCase().includes(q) ||
        order.items.some(
          (item) =>
            item.productName.toLowerCase().includes(q) ||
            item.productCode.toLowerCase().includes(q)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    setSelectedOrder((currentOrder) =>
      currentOrder && currentOrder.id === orderId
        ? { ...currentOrder, status }
        : currentOrder
    );

    setMessage(`Sipariş durumu "${statusText(status)}" olarak güncellendi.`);
  }

  function sendOffer() {
    if (!selectedOrder) return;

    setReplyText("");
    updateOrderStatus(selectedOrder.id, "quoted");
    setMessage(
      `${selectedOrder.customerName} müşterisine demo teklif gönderildi. Gerçek sistemde teklif HBS mesajlaşma, e-posta veya WhatsApp üzerinden iletilecek.`
    );
  }

  function sendMessage() {
    if (!selectedOrder) return;

    if (!replyText.trim()) {
      setMessage("Müşteriye mesaj göndermek için cevap alanını doldurun.");
      return;
    }

    setReplyText("");
    setMessage(
      `${selectedOrder.customerName} müşterisine demo mesaj gönderildi. Gerçek sistemde bu mesaj sipariş kaydına bağlanacak.`
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-black tracking-wide">
            HBS
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/customer-requests"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Müşteri Talepleri
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Panel
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Ana Sayfa
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                SİPARİŞ VE TEKLİFLER
              </p>

              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                Sipariş / Teklif Yönetimi
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                Mağaza vitrini ve müşteri portalından gelen sepet taleplerini,
                sipariş isteklerini, fiyat tekliflerini ve müşteri onay
                süreçlerini buradan yönetin.
              </p>
            </div>


          </div>
        </section>

        {message && (
          <div className="mb-6 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5 text-sm leading-6 text-blue-100">
            {message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                Gelen Siparişler
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {filteredOrders.length} kayıt
              </h2>
            </div>

            <div className="mb-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Arama</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                  placeholder={t.searchPlaceholder} id="id-page-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-placeholder-text-slate-600-focus-border-white-862" aria-label="Rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none placeholder text slate 600 focus border white" />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Durum</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as OrderStatus | "all")
                  }
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                >
                  <option value="all">{t.allRecords}</option>
                  <option value="new">Yeni</option>
                  <option value="quoted">Teklif Verildi</option>
                  <option value="waiting_customer">{t.waitingCustomer}</option>
                  <option value="approved">{t.approved}</option>
                  <option value="preparing">{t.preparing}</option>
                  <option value="completed">{t.completed}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className={`rounded-3xl border p-5 text-left transition hover:bg-slate-900 ${
                    selectedOrder?.id === order.id
                      ? "border-blue-500 bg-blue-950/30"
                      : "border-white/10 bg-slate-950/70"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        order.status
                      )}`}
                    >
                      {statusText(order.status)}
                    </span>

                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                      {order.orderType}
                    </span>
                  </div>

                  <h3 className="font-black">{order.customerName}</h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {order.items.length} ürün / {orderTotalText(order)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {order.createdAt} · {order.city}
                  </p>
                </button>
              ))}

              {filteredOrders.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                  Bu filtreye uygun sipariş veya teklif kaydı bulunamadı.
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            {!selectedOrder ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
                Detay görmek için soldan bir kayıt seçin.
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                      Sipariş Detayı
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {selectedOrder.customerName}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {selectedOrder.orderType} · {selectedOrder.createdAt}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                      selectedOrder.status
                    )}`}
                  >
                    {statusText(selectedOrder.status)}
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">{t.customerInfo}</h3>

                    <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                      <p>
                        <span className="font-bold text-white">Ad/Firma:</span>{" "}
                        {selectedOrder.customerName}
                      </p>

                      <p>
                        <span className="font-bold text-white">Telefon:</span>{" "}
                        {selectedOrder.customerPhone}
                      </p>

                      <p>
                        <span className="font-bold text-white">E-posta:</span>{" "}
                        {selectedOrder.customerEmail}
                      </p>

                      <p>
                        <span className="font-bold text-white">{t.city}:</span>{" "}
                        {selectedOrder.city}
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      <span className="font-bold text-white">Not:</span>{" "}
                      {selectedOrder.note}
                    </p>
                  </div>

                  {/* 🔒 Escrow Deposit Panel (Rental Protection) */}
                  {selectedOrder.orderType === "Kiralama Talebi" && (
                    <div className="rounded-3xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔒</span>
                          <div>
                            <h4 className="text-sm font-black text-blue-200">{t.escrowTitle}</h4>
                            <p className="text-[10px] text-blue-400 font-bold leading-relaxed">{t.escrowDesc}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
                          (escrowStates[selectedOrder.id] || "pending") === "locked"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                            : (escrowStates[selectedOrder.id] || "pending") === "released"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : (escrowStates[selectedOrder.id] || "pending") === "charged"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}>
                          {(escrowStates[selectedOrder.id] || "pending") === "locked"
                            ? "Bloke Edildi 🔒"
                            : (escrowStates[selectedOrder.id] || "pending") === "released"
                            ? "Serbest Bırakıldı ✓"
                            : (escrowStates[selectedOrder.id] || "pending") === "charged"
                            ? "Tazmin Edildi ⚠️"
                            : "Blokaj Bekleniyor"}
                        </span>
                      </div>

                      <div className="grid gap-2 bg-slate-950/50 p-3.5 rounded-2xl border border-white/5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bloke Edilecek Depozito:</span>
                          <span className="font-mono font-black text-white">900.00 GEL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Kart Sahibi:</span>
                          <span className="font-bold text-white">{selectedOrder.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t.transactionId}:</span>
                          <span className="font-mono text-slate-500">ESC-LOCK-{selectedOrder.id.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {(escrowStates[selectedOrder.id] || "pending") === "pending" && (
                          <button
                            type="button"
                            onClick={() => {
                              setEscrowStates(prev => ({ ...prev, [selectedOrder.id]: "locked" }));
                              setMessage("Güvence bedeli başarıyla müşterinin kartından bloke edildi.");
                            }}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-2 text-xs font-black text-white transition active:scale-95 shadow-lg select-none"
                          >
                            🔒 Kartı Yetkilendir ve 900 GEL Bloke Et
                          </button>
                        )}
                        {(escrowStates[selectedOrder.id] || "pending") === "locked" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEscrowStates(prev => ({ ...prev, [selectedOrder.id]: "released" }));
                                updateOrderStatus(selectedOrder.id, "completed");
                                setMessage("Hasarsız iade onaylandı. Depozito blokesi kaldırıldı.");
                              }}
                              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-black text-white transition active:scale-95 shadow-lg select-none"
                            >
                              ✓ Hasarsız İade Alındı (Blokajı Çöz)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEscrowStates(prev => ({ ...prev, [selectedOrder.id]: "charged" }));
                                updateOrderStatus(selectedOrder.id, "cancelled");
                                setMessage("Hasarlı ürün raporlandı. 900 GEL depozito tahsil edildi.");
                              }}
                              className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-2 text-xs font-black text-white transition active:scale-95 shadow-lg select-none"
                            >
                              ⚠️ Hasarlı / Eksik İade (Depozitoyu Çek)
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-4 font-black">{t.products}</h3>

                    <div className="grid gap-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h4 className="font-black">{item.productName}</h4>
                              <p className="mt-1 text-sm text-slate-400">
                                Kod: {item.productCode}
                              </p>
                            </div>

                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                              {item.stockStatus}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-3">
                            <p>
                              <span className="font-bold text-white">Miktar:</span>{" "}
                              {item.quantity}
                            </p>

                            <p>
                              <span className="font-bold text-white">Birim:</span>{" "}
                              {item.unitPrice || "Teklif gerekli"}
                            </p>

                            <p>
                              <span className="font-bold text-white">Toplam:</span>{" "}
                              {item.unitPrice
                                ? `${(
                                    Number(item.unitPrice.replace(/[^\d.]/g, "")) *
                                    item.quantity
                                  ).toFixed(2)} GEL`
                                : "Teklif gerekli"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">{t.statusManagement}</h3>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <button
                        type="button"
                        onClick={sendOffer}
                        className="rounded-2xl border border-white/10 px-4 py-3 font-black hover:bg-white/10"
                      >
                        Teklif Gönder
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "approved")
                        }
                        className="rounded-2xl border border-white/10 px-4 py-3 font-black hover:bg-white/10"
                      >
                        Onaylandı
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "preparing")
                        }
                        className="rounded-2xl border border-white/10 px-4 py-3 font-black hover:bg-white/10"
                      >
                        Hazırlanıyor
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "completed")
                        }
                        className="rounded-2xl bg-white px-4 py-3 font-black text-slate-950 hover:bg-slate-200"
                      >
                        Tamamlandı
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "cancelled")
                        }
                        className="rounded-2xl border border-red-800 px-4 py-3 font-black text-red-200 hover:bg-red-950"
                      >
                        İptal
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">{t.messageToCustomer}</h3>

                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      rows={5}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                      placeholder={t.messagePlaceholder}
                    />

                    <button
                      type="button"
                      onClick={sendMessage}
                      className="mt-4 rounded-2xl bg-white px-6 py-3 font-black text-slate-950 hover:bg-slate-200"
                    >
                      Mesaj Gönder
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}