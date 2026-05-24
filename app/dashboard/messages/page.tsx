"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MessageStatus = "unread" | "open" | "answered" | "closed";
type MessageChannel = "HBS Mesaj" | "WhatsApp" | "E-posta";

type MessageThread = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  channel: MessageChannel;
  subject: string;
  productName?: string;
  productCode?: string;
  city: string;
  status: MessageStatus;
  lastMessageAt: string;
  messages: {
    id: string;
    sender: "customer" | "store";
    text: string;
    time: string;
  }[];
};

const initialThreads: MessageThread[] = [
  {
    id: "msg-001",
    customerName: "Demo Auto Service",
    customerPhone: "+995 555 111 222",
    customerEmail: "demo@hbs.ge",
    channel: "HBS Mesaj",
    subject: "Ford Escape fren balatası uyumu",
    productName: "Ford Escape Fren Balatası",
    productCode: "FR-BALATA-ESCAPE-001",
    city: "Batumi",
    status: "unread",
    lastMessageAt: "Bugün 10:24",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Merhaba, bu fren balatası 2018 Ford Escape için uyumlu mu?",
        time: "Bugün 10:24",
      },
    ],
  },
  {
    id: "msg-002",
    customerName: "Batumi Garage",
    customerPhone: "+995 555 333 444",
    customerEmail: "garage@hbs.ge",
    channel: "WhatsApp",
    subject: "Toyota Corolla yağ filtresi",
    productName: "Toyota Corolla Yağ Filtresi",
    productCode: "FR-FILTRE-COROLLA-002",
    city: "Batumi",
    status: "open",
    lastMessageAt: "Bugün 11:05",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "2016 Toyota Corolla 1.6 benzinli için filtre uygun mu?",
        time: "Bugün 11:05",
      },
      {
        id: "m2",
        sender: "store",
        text: "Araç motor kodunu gönderirseniz uyumluluğu net kontrol edebiliriz.",
        time: "Bugün 11:12",
      },
    ],
  },
  {
    id: "msg-003",
    customerName: "Giorgi Parts",
    customerPhone: "+995 555 777 888",
    customerEmail: "giorgi@hbs.ge",
    channel: "E-posta",
    subject: "Toplu ürün teklifi",
    productName: "Universal Buji Seti",
    productCode: "FR-BUJI-SET-004",
    city: "Tbilisi",
    status: "answered",
    lastMessageAt: "Dün 17:40",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "4 adet buji seti için fiyat ve teslimat süresi öğrenmek istiyorum.",
        time: "Dün 17:40",
      },
      {
        id: "m2",
        sender: "store",
        text: "Stok kontrolü sonrası size teklif dönüşü yapılacaktır.",
        time: "Dün 18:05",
      },
    ],
  },
];

function statusText(status: MessageStatus) {
  switch (status) {
    case "unread":
      return "Okunmadı";
    case "open":
      return "Açık";
    case "answered":
      return "Cevaplandı";
    case "closed":
      return "Kapandı";
  }
}

function statusClass(status: MessageStatus) {
  switch (status) {
    case "unread":
      return "bg-blue-950 text-blue-200";
    case "open":
      return "bg-yellow-950 text-yellow-200";
    case "answered":
      return "bg-emerald-950 text-emerald-200";
    case "closed":
      return "bg-slate-800 text-slate-300";
  }
}

function channelClass(channel: MessageChannel) {
  switch (channel) {
    case "HBS Mesaj":
      return "bg-purple-950 text-purple-200";
    case "WhatsApp":
      return "bg-emerald-950 text-emerald-200";
    case "E-posta":
      return "bg-cyan-950 text-cyan-200";
  }
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>(initialThreads);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(
    initialThreads[0] ?? null
  );
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState("");

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return threads.filter((thread) => {
      const matchesStatus =
        statusFilter === "all" || thread.status === statusFilter;

      const matchesSearch =
        !q ||
        thread.customerName.toLowerCase().includes(q) ||
        thread.customerPhone.toLowerCase().includes(q) ||
        thread.customerEmail.toLowerCase().includes(q) ||
        thread.subject.toLowerCase().includes(q) ||
        thread.productName?.toLowerCase().includes(q) ||
        thread.productCode?.toLowerCase().includes(q) ||
        thread.city.toLowerCase().includes(q) ||
        thread.messages.some((item) => item.text.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [threads, statusFilter, search]);

  function updateThreadStatus(threadId: string, status: MessageStatus) {
    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === threadId ? { ...thread, status } : thread
      )
    );

    setSelectedThread((currentThread) =>
      currentThread && currentThread.id === threadId
        ? { ...currentThread, status }
        : currentThread
    );

    setMessage(`Mesaj durumu "${statusText(status)}" olarak güncellendi.`);
  }

  function sendReply() {
    if (!selectedThread) return;

    if (!replyText.trim()) {
      setMessage("Cevap göndermek için mesaj alanını doldurun.");
      return;
    }

    const newMessage = {
      id: `reply-${Date.now()}`,
      sender: "store" as const,
      text: replyText,
      time: "Şimdi",
    };

    const updatedThread: MessageThread = {
      ...selectedThread,
      status: "answered",
      lastMessageAt: "Şimdi",
      messages: [...selectedThread.messages, newMessage],
    };

    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === selectedThread.id ? updatedThread : thread
      )
    );

    setSelectedThread(updatedThread);
    setReplyText("");
    setMessage(
      `${selectedThread.customerName} müşterisine demo cevap gönderildi. Gerçek sistemde cevap HBS mesajlaşma, WhatsApp veya e-posta kanalına bağlanacak.`
    );
  }

  function markAsOpen(thread: MessageThread) {
    updateThreadStatus(thread.id, "open");
  }

  function closeThread(thread: MessageThread) {
    updateThreadStatus(thread.id, "closed");
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
              href="/dashboard/orders"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Siparişler
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Panel
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                MÜŞTERİ MESAJLARI
              </p>

              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                Mağaza Yazışmaları
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                Ürün soruları, teklif görüşmeleri, sipariş mesajları ve müşteri
                iletişimlerini tek ekrandan takip edin. HBS mesajlaşma,
                WhatsApp ve e-posta kanalları bu yapı altında birleşir.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
              <h2 className="text-lg font-black text-blue-100">
                Kanal bağımsız takip
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100/90">
                Gerçek sistemde müşteri mesajları HBS içi mesajlaşma, WhatsApp
                Business API veya e-posta üzerinden gelebilir. Bu ekran tüm
                yazışmaları tek mağaza hafızasında toplamak için tasarlanır.
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
                Gelen Mesajlar
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {filteredThreads.length} konuşma
              </h2>
            </div>

            <div className="mb-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Arama</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                  placeholder="Müşteri, telefon, ürün, kod veya mesaj ara"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Durum</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as MessageStatus | "all")
                  }
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                >
                  <option value="all">Tüm Mesajlar</option>
                  <option value="unread">Okunmadı</option>
                  <option value="open">Açık</option>
                  <option value="answered">Cevaplandı</option>
                  <option value="closed">Kapandı</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelectedThread(thread)}
                  className={`rounded-3xl border p-5 text-left transition hover:bg-slate-900 ${
                    selectedThread?.id === thread.id
                      ? "border-blue-500 bg-blue-950/30"
                      : "border-white/10 bg-slate-950/70"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        thread.status
                      )}`}
                    >
                      {statusText(thread.status)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${channelClass(
                        thread.channel
                      )}`}
                    >
                      {thread.channel}
                    </span>
                  </div>

                  <h3 className="font-black">{thread.subject}</h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {thread.customerName} · {thread.city}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Son mesaj: {thread.lastMessageAt}
                  </p>
                </button>
              ))}

              {filteredThreads.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                  Bu filtreye uygun mesaj bulunamadı.
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            {!selectedThread ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
                Detay görmek için soldan bir konuşma seçin.
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                      Konuşma Detayı
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {selectedThread.subject}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {selectedThread.customerName} · {selectedThread.channel} ·{" "}
                      {selectedThread.lastMessageAt}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                      selectedThread.status
                    )}`}
                  >
                    {statusText(selectedThread.status)}
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">Müşteri Bilgileri</h3>

                    <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                      <p>
                        <span className="font-bold text-white">Ad/Firma:</span>{" "}
                        {selectedThread.customerName}
                      </p>

                      <p>
                        <span className="font-bold text-white">Telefon:</span>{" "}
                        {selectedThread.customerPhone}
                      </p>

                      <p>
                        <span className="font-bold text-white">E-posta:</span>{" "}
                        {selectedThread.customerEmail}
                      </p>

                      <p>
                        <span className="font-bold text-white">Şehir:</span>{" "}
                        {selectedThread.city}
                      </p>

                      {selectedThread.productName && (
                        <p>
                          <span className="font-bold text-white">Ürün:</span>{" "}
                          {selectedThread.productName}
                        </p>
                      )}

                      {selectedThread.productCode && (
                        <p>
                          <span className="font-bold text-white">Kod:</span>{" "}
                          {selectedThread.productCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-4 font-black">Yazışma</h3>

                    <div className="grid gap-3">
                      {selectedThread.messages.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-3xl border p-4 ${
                            item.sender === "store"
                              ? "border-emerald-400/20 bg-emerald-400/10"
                              : "border-white/10 bg-slate-950"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-black">
                              {item.sender === "store" ? "Mağaza" : "Müşteri"}
                            </span>

                            <span className="text-xs text-slate-500">
                              {item.time}
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-slate-300">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">Müşteriye Cevap Yaz</h3>

                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      rows={5}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                      placeholder="Ürün uyumluluğu, fiyat, teslimat, stok veya sipariş bilgisi yazın"
                    />

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <button
                        type="button"
                        onClick={sendReply}
                        className="rounded-2xl bg-white px-5 py-3 font-black text-slate-950 hover:bg-slate-200"
                      >
                        Cevap Gönder
                      </button>

                      <button
                        type="button"
                        onClick={() => markAsOpen(selectedThread)}
                        className="rounded-2xl border border-white/10 px-5 py-3 font-black hover:bg-white/10"
                      >
                        Açık Olarak İşaretle
                      </button>

                      <button
                        type="button"
                        onClick={() => closeThread(selectedThread)}
                        className="rounded-2xl border border-white/10 px-5 py-3 font-black hover:bg-white/10"
                      >
                        Konuşmayı Kapat
                      </button>

                      <Link
                        href="/dashboard/orders"
                        className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black hover:bg-white/10"
                      >
                        Siparişe Dönüştür
                      </Link>
                    </div>
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