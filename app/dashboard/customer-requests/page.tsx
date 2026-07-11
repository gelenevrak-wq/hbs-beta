"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const translations = {
  tr: {
    activeMenu: "Müşteri Talepleri",
    eyebrow: "Mağaza Paneli",
    title: "Müşteri Talepleri",
    description: "Mağaza vitrini üzerinden gelen ürün soruları, teklif talepleri, sipariş istekleri ve genel müşteri mesajları burada takip edilir.",
    requestsHeader: "Gelen Talepler",
    searchLabel: "Arama",
    searchPlaceholder: "Müşteri, telefon, ürün veya kod ara",
    statusLabel: "Durum",
    allRequests: "Tüm Talepler",
    new: "Yeni",
    inReview: "İnceleniyor",
    answered: "Cevaplandı",
    completed: "Tamamlandı",
    cancelled: "İptal",
    noRequestsFound: "Bu filtreye uygun talep bulunamadı.",
    selectRequestTip: "Detay görmek için soldan bir talep seçin.",
    requestDetailHeader: "Talep Detayı",
    customerInfoTitle: "Müşteri Bilgileri",
    customerName: "Ad/Firma",
    customerPhone: "Telefon",
    customerEmail: "E-posta",
    customerRequestType: "Talep Tipi",
    productInfoTitle: "Ürün / Talep Bilgisi",
    productLabel: "Ürün",
    codeLabel: "Kod",
    messageLabel: "Mesaj",
    statusManagementTitle: "Durum Yönetimi",
    takeInReviewBtn: "İncelemeye Al",
    setAnsweredBtn: "Cevaplandı",
    setCompletedBtn: "Tamamlandı",
    setCancelledBtn: "İptal",
    replyTitle: "Müşteriye Cevap Yaz",
    replyPlaceholder: "Ürün uyumluluğu, fiyat, teslimat süresi veya sipariş bilgisi yazın",
    sendReplyBtn: "Cevabı Gönder",
    statusUpdatedMsg: 'Talep durumu "{status}" olarak güncellendi.',
    replyEmptyErr: "Cevap göndermek için mesaj alanını doldurun.",
    replySentMsg: '"{name}" müşterisine demo cevap gönderildi. Gerçek sistemde bu cevap HBS mesajlaşma, e-posta veya WhatsApp entegrasyonu ile iletilecek.',
    storefrontLink: "Mağaza Vitrini",
    dashboardLink: "Dashboard",
    recordCount: "{count} kayıt",
  },
  en: {
    activeMenu: "Customer Inquiries",
    eyebrow: "Store Panel",
    title: "Customer Inquiries",
    description: "Track product inquiries, quote requests, order requests, and general messages submitted through the storefront.",
    requestsHeader: "Incoming Inquiries",
    searchLabel: "Search",
    searchPlaceholder: "Search customer, phone, product, or code",
    statusLabel: "Status",
    allRequests: "All Requests",
    new: "New",
    inReview: "In Review",
    answered: "Answered",
    completed: "Completed",
    cancelled: "Cancelled",
    noRequestsFound: "No requests found matching this filter.",
    selectRequestTip: "Select a request from the left to view details.",
    requestDetailHeader: "Request Details",
    customerInfoTitle: "Customer Information",
    customerName: "Name/Company",
    customerPhone: "Phone",
    customerEmail: "Email",
    customerRequestType: "Inquiry Type",
    productInfoTitle: "Product / Request Info",
    productLabel: "Product",
    codeLabel: "Code",
    messageLabel: "Message",
    statusManagementTitle: "Status Management",
    takeInReviewBtn: "Mark In Review",
    setAnsweredBtn: "Mark Answered",
    setCompletedBtn: "Mark Completed",
    setCancelledBtn: "Cancel",
    replyTitle: "Write Reply to Customer",
    replyPlaceholder: "Type product compatibility, pricing, delivery time, or order details",
    sendReplyBtn: "Send Reply",
    statusUpdatedMsg: 'Request status updated to "{status}".',
    replyEmptyErr: "Please enter a message to send a reply.",
    replySentMsg: 'Demo reply sent to "{name}". In the live system, this reply will be delivered via HBS messaging, email, or WhatsApp integration.',
    storefrontLink: "Storefront",
    dashboardLink: "Dashboard",
    recordCount: "{count} records",
  },
  de: {
    activeMenu: "Kundenanfragen",
    eyebrow: "Shop-Panel",
    title: "Kundenanfragen",
    description: "Verfolgen Sie Produktfragen, Angebotsanfragen, Bestellwünsche und allgemeine Nachrichten aus dem Schaufenster.",
    requestsHeader: "Eingehende Anfragen",
    searchLabel: "Suche",
    searchPlaceholder: "Kunde, Telefon, Produkt oder Code suchen",
    statusLabel: "Status",
    allRequests: "Alle Anfragen",
    new: "Neu",
    inReview: "In Prüfung",
    answered: "Beantwortet",
    completed: "Abgeschlossen",
    cancelled: "Storniert",
    noRequestsFound: "Keine Anfragen gefunden, die diesem Filter entsprechen.",
    selectRequestTip: "Wählen Sie links eine Anfrage aus, um Details anzuzeigen.",
    requestDetailHeader: "Anfragedetails",
    customerInfoTitle: "Kundeninformationen",
    customerName: "Name/Firma",
    customerPhone: "Telefon",
    customerEmail: "E-Mail",
    customerRequestType: "Anfragetyp",
    productInfoTitle: "Produkt- / Anfrageinfo",
    productLabel: "Produkt",
    codeLabel: "Code",
    messageLabel: "Nachricht",
    statusManagementTitle: "Statusverwaltung",
    takeInReviewBtn: "In Prüfung nehmen",
    setAnsweredBtn: "Als beantwortet markieren",
    setCompletedBtn: "Als abgeschlossen markieren",
    setCancelledBtn: "Stornieren",
    replyTitle: "Antwort an Kunden schreiben",
    replyPlaceholder: "Produktkompatibilität, Preise, Lieferzeit oder Bestelldetails eingeben",
    sendReplyBtn: "Antwort senden",
    statusUpdatedMsg: 'Anfragestatus auf "{status}" aktualisiert.',
    replyEmptyErr: "Bitte geben Sie eine Nachricht ein, um zu antworten.",
    replySentMsg: 'Demo-Antwort an "{name}" gesendet. Im Live-System wird diese Antwort über HBS-Messaging, E-Mail oder WhatsApp-Integration zugestellt.',
    storefrontLink: "Schaufenster",
    dashboardLink: "Dashboard",
    recordCount: "{count} Einträge",
  },
  ru: {
    activeMenu: "Запросы клиентов",
    eyebrow: "Панель магазина",
    title: "Запросы клиентов",
    description: "Отслеживайте вопросы по товарам, запросы цен, заказы и общие сообщения, отправленные через витрину магазина.",
    requestsHeader: "Входящие запросы",
    searchLabel: "Поиск",
    searchPlaceholder: "Поиск клиента, телефона, товара или кода",
    statusLabel: "Статус",
    allRequests: "Все запросы",
    new: "Новый",
    inReview: "В обработке",
    answered: "Отвечено",
    completed: "Выполнено",
    cancelled: "Отменено",
    noRequestsFound: "Запросы, соответствующие фильтру, не найдены.",
    selectRequestTip: "Выберите запрос слева для просмотра деталей.",
    requestDetailHeader: "Детали запроса",
    customerInfoTitle: "Информация о клиенте",
    customerName: "Имя/Компания",
    customerPhone: "Телефон",
    customerEmail: "E-mail",
    customerRequestType: "Тип запроса",
    productInfoTitle: "Информация о товаре / запросе",
    productLabel: "Товар",
    codeLabel: "Код",
    messageLabel: "Сообщение",
    statusManagementTitle: "Управление статусом",
    takeInReviewBtn: "В обработку",
    setAnsweredBtn: "Отвечено",
    setCompletedBtn: "Выполнено",
    setCancelledBtn: "Отменить",
    replyTitle: "Написать ответ клиенту",
    replyPlaceholder: "Напишите о совместимости товара, цене, сроках доставки или деталях заказа",
    sendReplyBtn: "Отправить ответ",
    statusUpdatedMsg: 'Статус запроса обновлен на "{status}".',
    replyEmptyErr: "Пожалуйста, введите сообщение для ответа.",
    replySentMsg: 'Демо-ответ отправлен клиенту "{name}". В реальной системе этот ответ будет доставлен через сообщения HBS, электронную почту или интеграцию с WhatsApp.',
    storefrontLink: "Витрина",
    dashboardLink: "Панель управления",
    recordCount: "Записей: {count}",
  },
  ka: {
    activeMenu: "კლიენტის მოთხოვნები",
    eyebrow: "მაღაზიის პანელი",
    title: "კლიენტის მოთხოვნები",
    description: "აქ მუშავდება პროდუქტის კითხვები, ფასის მოთხოვნები, შეკვეთები და ზოგადი შეტყობინებები მაღაზიის ვიტრინიდან.",
    requestsHeader: "შემოსული მოთხოვნები",
    searchLabel: "ძებნა",
    searchPlaceholder: "ძებნა კლიენტის, ტელეფონის, პროდუქტის ან კოდის მიხედვით",
    statusLabel: "სტატუსი",
    allRequests: "ყველა მოთხოვნა",
    new: "ახალი",
    inReview: "მიმდინარე",
    answered: "პასუხგაცემული",
    completed: "დასრულებული",
    cancelled: "გაუქმებული",
    noRequestsFound: "მოთხოვნები ამ ფილტრით ვერ მოიძებნა.",
    selectRequestTip: "დეტალების სანახავად აირჩიეთ მოთხოვნა მარცხნივ.",
    requestDetailHeader: "მოთხოვნის დეტალები",
    customerInfoTitle: "კლიენტის ინფორმაცია",
    customerName: "სახელი/კომპანია",
    customerPhone: "ტელეფონი",
    customerEmail: "ელფოსტა",
    customerRequestType: "მოთხოვნის ტიპი",
    productInfoTitle: "პროდუქტის / მოთხოვნის ინფორმაცია",
    productLabel: "პროდუქტი",
    codeLabel: "კოდი",
    messageLabel: "შეტყობინება",
    statusManagementTitle: "სტატუსის მართვა",
    takeInReviewBtn: "განსახილველად მიღება",
    setAnsweredBtn: "პასუხგაცემული",
    setCompletedBtn: "დასრულებული",
    setCancelledBtn: "გაუქმება",
    replyTitle: "კლიენტისთვის პასუხის მიწერა",
    replyPlaceholder: "მიუთითეთ პროდუქტის თავსებადობა, ფასი, მიწოდების დრო ან შეკვეთის დეტალები",
    sendReplyBtn: "პასუხის გაგზავნა",
    statusUpdatedMsg: 'მოთხოვნის სტატუსი განახლდა როგორც "{status}".',
    replyEmptyErr: "გთხოვთ შეიყვანოთ შეტყობინება პასუხის გასაგზავნად.",
    replySentMsg: 'დემო პასუხი გაეგზავნა კლიენტს "{name}". რეალურ სისტემაში ეს პასუხი გაიგზავნება HBS შეტყობინებით, ელფოსტით ან WhatsApp-ით.',
    storefrontLink: "ვიტრინა",
    dashboardLink: "პანელი",
    recordCount: "{count} ჩანაწერი",
  }
};

type RequestStatus = "new" | "in_review" | "answered" | "completed" | "cancelled";

type CustomerRequest = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requestType: "Ürün Sorusu" | "Teklif Talebi" | "Sipariş Talebi" | "Genel Talep";
  productName: string;
  productCode?: string;
  message: string;
  createdAt: string;
  status: RequestStatus;
  priority: "Normal" | "Yüksek";
};

const initialRequests: CustomerRequest[] = [
  {
    id: "req-001",
    customerName: "Demo Auto Service",
    customerPhone: "+995 555 111 222",
    customerEmail: "demo@hbs.ge",
    requestType: "Teklif Talebi",
    productName: "Ford Escape Fren Balatası",
    productCode: "FR-BALATA-ESCAPE-001",
    message:
      "Ford Escape için uyumlu fren balatası fiyatı ve teslimat süresi hakkında bilgi istiyorum.",
    createdAt: "Bugün 10:24",
    status: "new",
    priority: "Yüksek",
  },
  {
    id: "req-002",
    customerName: "Batumi Garage",
    customerPhone: "+995 555 333 444",
    customerEmail: "garage@hbs.ge",
    requestType: "Ürün Sorusu",
    productName: "Toyota Corolla Yağ Filtresi",
    productCode: "FR-FILTRE-COROLLA-002",
    message:
      "Bu filtre 2016 Toyota Corolla 1.6 benzinli modele uyumlu mu?",
    createdAt: "Bugün 11:05",
    status: "in_review",
    priority: "Normal",
  },
  {
    id: "req-003",
    customerName: "Giorgi Parts",
    customerPhone: "+995 555 777 888",
    customerEmail: "giorgi@hbs.ge",
    requestType: "Sipariş Talebi",
    productName: "Universal Buji Seti",
    productCode: "FR-BUJI-SET-004",
    message:
      "4 adet buji seti için sipariş oluşturmak istiyorum. Uyumlu modelleri teyit eder misiniz?",
    createdAt: "Dün 17:40",
    status: "answered",
    priority: "Normal",
  },
];

export default function StoreCustomerRequestsPage() {
  const [language, setLanguage] = useState("tr");
  const [requests, setRequests] = useState<CustomerRequest[]>(initialRequests);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(
    initialRequests[0] ?? null
  );
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;

  function statusText(status: RequestStatus) {
    switch (status) {
      case "new":
        return t.new;
      case "in_review":
        return t.inReview;
      case "answered":
        return t.answered;
      case "completed":
        return t.completed;
      case "cancelled":
        return t.cancelled;
    }
  }

  function statusClass(status: RequestStatus) {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border border-blue-200/50";
      case "in_review":
        return "bg-amber-100 text-amber-800 border border-amber-200/50";
      case "answered":
        return "bg-purple-100 text-purple-800 border border-purple-200/50";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200/50";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200/50";
    }
  }

  function translateRequestType(type: string) {
    if (language === "tr") return type;
    if (type === "Ürün Sorusu") {
      return language === "en" ? "Product Question" : language === "de" ? "Produktfrage" : language === "ru" ? "Вопрос по товару" : "პროდუქტის კითხვა";
    }
    if (type === "Teklif Talebi") {
      return language === "en" ? "Quote Request" : language === "de" ? "Angebotsanfrage" : language === "ru" ? "Запрос цены" : "ფასის მოთხოვნა";
    }
    if (type === "Sipariş Talebi") {
      return language === "en" ? "Order Request" : language === "de" ? "Bestellanfrage" : language === "ru" ? "Запрос заказа" : "შეკვეთის მოთხოვნა";
    }
    if (type === "Genel Talep") {
      return language === "en" ? "General Inquiry" : language === "de" ? "Allgemeine Anfrage" : language === "ru" ? "Общий запрос" : "ზოგადი მოთხოვნა";
    }
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

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      const matchesSearch =
        !q ||
        request.customerName.toLowerCase().includes(q) ||
        request.customerPhone.toLowerCase().includes(q) ||
        request.customerEmail.toLowerCase().includes(q) ||
        request.productName.toLowerCase().includes(q) ||
        request.productCode?.toLowerCase().includes(q) ||
        request.message.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, search]);

  function updateStatus(requestId: string, status: RequestStatus) {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );

    setSelectedRequest((current) =>
      current && current.id === requestId ? { ...current, status } : current
    );

    setMessage(t.statusUpdatedMsg.replace("{status}", statusText(status)));
  }

  function sendReply() {
    if (!selectedRequest) return;

    if (!replyText.trim()) {
      setMessage(t.replyEmptyErr);
      return;
    }

    updateStatus(selectedRequest.id, "answered");
    setReplyText("");
    setMessage(
      t.replySentMsg.replace("{name}", selectedRequest.customerName)
    );
  }

  return (
    <DashboardLayout activeMenu={t.activeMenu}>
      <div className="space-y-4 text-slate-900">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
            {t.eyebrow}
          </p>

          <h1 className="mt-1 text-2xl font-black text-slate-800">
            {t.title}
          </h1>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-650">
            {t.description}
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-800">
                {t.requestsHeader}
              </h2>

              <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                {t.recordCount.replace("{count}", String(filteredRequests.length))}
              </span>
            </div>

            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-650">{t.searchLabel}</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                  placeholder={t.searchPlaceholder} />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-650">{t.statusLabel}</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as RequestStatus | "all")
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-850 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="all">{t.allRequests}</option>
                  <option value="new">{t.new}</option>
                  <option value="in_review">{t.inReview}</option>
                  <option value="answered">{t.answered}</option>
                  <option value="completed">{t.completed}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 border-t border-slate-100 pt-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => {
                    setSelectedRequest(request);
                    setMessage("");
                  }}
                  className={`rounded-2xl border p-4 text-left transition select-none ${
                    selectedRequest?.id === request.id
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusClass(
                        request.status
                      )}`}
                    >
                      {statusText(request.status)}
                    </span>

                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {translateRequestType(request.requestType)}
                    </span>

                    {request.priority === "Yüksek" && (
                      <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-black text-red-800">
                        {language === "en" ? "High" : language === "de" ? "Hoch" : language === "ru" ? "Высокий" : language === "ka" ? "მაღალი" : "Yüksek"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-slate-800 text-xs sm:text-sm">{request.productName}</h3>

                  <p className="mt-1 text-xs text-slate-500 font-bold">
                    {request.customerName}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400 font-bold">
                    {translateTime(request.createdAt)}
                  </p>
                </button>
              ))}

              {filteredRequests.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs font-semibold text-slate-500 text-center">
                  {t.noRequestsFound}
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {!selectedRequest ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-xs font-bold text-slate-500 text-center">
                {t.selectRequestTip}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                      {t.requestDetailHeader}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-800">
                      {selectedRequest.productName}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusClass(
                      selectedRequest.status
                    )}`}
                  >
                    {statusText(selectedRequest.status)}
                  </span>
                </div>

                {message && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-sm animate-fadeIn">
                    ✓ {message}
                  </div>
                )}

                <div className="grid gap-4">
                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.customerInfoTitle}</h3>

                    <div className="grid gap-3 text-xs text-slate-600 font-bold sm:grid-cols-2">
                      <p>
                        <span className="text-slate-400 font-bold block">{t.customerName}:</span>{" "}
                        {selectedRequest.customerName}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.customerPhone}:</span>{" "}
                        {selectedRequest.customerPhone}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.customerEmail}:</span>{" "}
                        {selectedRequest.customerEmail}
                      </p>

                      <p>
                        <span className="text-slate-400 font-bold block">{t.customerRequestType}:</span>{" "}
                        {translateRequestType(selectedRequest.requestType)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.productInfoTitle}</h3>

                    <div className="grid gap-3 text-xs text-slate-650 font-bold">
                      <p>
                        <span className="text-slate-400 font-bold block">{t.productLabel}:</span>{" "}
                        {selectedRequest.productName}
                      </p>

                      {selectedRequest.productCode && (
                        <p>
                          <span className="text-slate-400 font-bold block">{t.codeLabel}:</span>{" "}
                          {selectedRequest.productCode}
                        </p>
                      )}

                      <p>
                        <span className="text-slate-400 font-bold block">{t.messageLabel}:</span>{" "}
                        <span className="text-slate-800 block mt-1 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed font-semibold">
                          {selectedRequest.message}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.statusManagementTitle}</h3>

                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "in_review")
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                      >
                        {t.takeInReviewBtn}
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "answered")
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                      >
                        {t.setAnsweredBtn}
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "completed")
                        }
                        className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white hover:bg-slate-800 active:scale-95 transition"
                      >
                        {t.setCompletedBtn}
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "cancelled")
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-800 hover:bg-red-100 active:scale-95 transition"
                      >
                        {t.setCancelledBtn}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-250 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="font-black text-slate-800 text-xs border-b border-slate-200 pb-2">{t.replyTitle}</h3>

                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                      placeholder={t.replyPlaceholder}
                    />

                    <button
                      onClick={sendReply}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-black text-white active:scale-95 transition"
                    >
                      {t.sendReplyBtn}
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