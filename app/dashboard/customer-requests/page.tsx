"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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

function statusText(status: RequestStatus) {
  switch (status) {
    case "new":
      return "Yeni";
    case "in_review":
      return "İnceleniyor";
    case "answered":
      return "Cevaplandı";
    case "completed":
      return "Tamamlandı";
    case "cancelled":
      return "İptal";
  }
}

function statusClass(status: RequestStatus) {
  switch (status) {
    case "new":
      return "bg-blue-950 text-blue-200";
    case "in_review":
      return "bg-yellow-950 text-yellow-200";
    case "answered":
      return "bg-purple-950 text-purple-200";
    case "completed":
      return "bg-green-950 text-green-200";
    case "cancelled":
      return "bg-red-950 text-red-200";
  }
}

export default function StoreCustomerRequestsPage() {
  const [requests, setRequests] = useState<CustomerRequest[]>(initialRequests);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(
    requests[0] ?? null
  );
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState("");

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

    setMessage(`Talep durumu "${statusText(status)}" olarak güncellendi.`);
  }

  function sendReply() {
    if (!selectedRequest) return;

    if (!replyText.trim()) {
      setMessage("Cevap göndermek için mesaj alanını doldurun.");
      return;
    }

    updateStatus(selectedRequest.id, "answered");
    setReplyText("");
    setMessage(
      `${selectedRequest.customerName} müşterisine demo cevap gönderildi. Gerçek sistemde bu cevap HBS mesajlaşma, e-posta veya WhatsApp entegrasyonu ile iletilecek.`
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-wide text-white">
            HBS
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/store/ferro-motors"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
            >
              Mağaza Vitrini
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl">
          <p className="mb-3 text-base font-bold uppercase tracking-[0.18em] text-blue-300">
            Mağaza Paneli
          </p>

          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Müşteri Talepleri
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Mağaza vitrini üzerinden gelen ürün soruları, teklif talepleri,
            sipariş istekleri ve genel müşteri mesajları burada takip edilir.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                Gelen Talepler
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {filteredRequests.length} kayıt
              </h2>
            </div>

            <div className="mb-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Arama</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                  placeholder="Müşteri, telefon, ürün veya kod ara"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Durum</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as RequestStatus | "all")
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                >
                  <option value="all">Tüm Talepler</option>
                  <option value="new">Yeni</option>
                  <option value="in_review">İnceleniyor</option>
                  <option value="answered">Cevaplandı</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3">
              {filteredRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`rounded-2xl border p-4 text-left transition hover:bg-slate-800 ${
                    selectedRequest?.id === request.id
                      ? "border-blue-500 bg-blue-950/30"
                      : "border-slate-800 bg-slate-950/70"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        request.status
                      )}`}
                    >
                      {statusText(request.status)}
                    </span>

                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                      {request.requestType}
                    </span>

                    {request.priority === "Yüksek" && (
                      <span className="rounded-full bg-red-950 px-3 py-1 text-xs font-bold text-red-200">
                        Yüksek
                      </span>
                    )}
                  </div>

                  <h3 className="font-black">{request.productName}</h3>

                  <p className="mt-1 text-sm text-slate-300">
                    {request.customerName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {request.createdAt}
                  </p>
                </button>
              ))}

              {filteredRequests.length === 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
                  Bu filtreye uygun talep bulunamadı.
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            {!selectedRequest ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-300">
                Detay görmek için soldan bir talep seçin.
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                      Talep Detayı
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {selectedRequest.productName}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                      selectedRequest.status
                    )}`}
                  >
                    {statusText(selectedRequest.status)}
                  </span>
                </div>

                {message && (
                  <div className="mb-5 rounded-2xl border border-blue-900/70 bg-blue-950/40 p-4 text-sm text-blue-100">
                    {message}
                  </div>
                )}

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-bold">Müşteri Bilgileri</h3>

                    <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                      <p>
                        <span className="font-bold text-white">Ad/Firma:</span>{" "}
                        {selectedRequest.customerName}
                      </p>

                      <p>
                        <span className="font-bold text-white">Telefon:</span>{" "}
                        {selectedRequest.customerPhone}
                      </p>

                      <p>
                        <span className="font-bold text-white">E-posta:</span>{" "}
                        {selectedRequest.customerEmail}
                      </p>

                      <p>
                        <span className="font-bold text-white">Talep Tipi:</span>{" "}
                        {selectedRequest.requestType}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-bold">Ürün / Talep Bilgisi</h3>

                    <div className="grid gap-2 text-sm text-slate-300">
                      <p>
                        <span className="font-bold text-white">Ürün:</span>{" "}
                        {selectedRequest.productName}
                      </p>

                      {selectedRequest.productCode && (
                        <p>
                          <span className="font-bold text-white">Kod:</span>{" "}
                          {selectedRequest.productCode}
                        </p>
                      )}

                      <p>
                        <span className="font-bold text-white">Mesaj:</span>{" "}
                        {selectedRequest.message}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-bold">Durum Yönetimi</h3>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "in_review")
                        }
                        className="rounded-xl border border-slate-700 px-4 py-3 font-bold hover:bg-slate-800"
                      >
                        İncelemeye Al
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "answered")
                        }
                        className="rounded-xl border border-slate-700 px-4 py-3 font-bold hover:bg-slate-800"
                      >
                        Cevaplandı
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "completed")
                        }
                        className="rounded-xl bg-white px-4 py-3 font-bold text-slate-950 hover:bg-slate-200"
                      >
                        Tamamlandı
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(selectedRequest.id, "cancelled")
                        }
                        className="rounded-xl border border-red-800 px-4 py-3 font-bold text-red-200 hover:bg-red-950"
                      >
                        İptal
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-bold">Müşteriye Cevap Yaz</h3>

                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                      placeholder="Ürün uyumluluğu, fiyat, teslimat süresi veya sipariş bilgisi yazın"
                    />

                    <button
                      onClick={sendReply}
                      className="mt-4 rounded-xl bg-white px-6 py-3 font-bold text-slate-950 hover:bg-slate-200"
                    >
                      Cevabı Gönder
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