"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

type MessageStatus = "unread" | "open" | "answered" | "closed";
type MessageChannel = "HBS Mesaj" | "WhatsApp" | "E-posta";

type MessageItem = {
  id: string;
  sender: "customer" | "store";
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  targetLanguage: string;
  time: string;
};

type MessageThread = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerLang: string; // e.g. Georgian, Russian, German
  channel: MessageChannel;
  subject: string;
  productName?: string;
  productCode?: string;
  city: string;
  status: MessageStatus;
  lastMessageAt: string;
  messages: MessageItem[];
};

const INITIAL_THREADS: MessageThread[] = [
  {
    id: "msg-001",
    customerName: "Giorgi Kalandadze (Batumi)",
    customerPhone: "+995 555 111 222",
    customerEmail: "giorgi@autoservice.ge",
    customerLang: "ka", // Georgian
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
        originalText: "გამარჯობა, ეს სამუხრუჭე ხუნდები თავსებადია 2018 წლის Ford Escape-თან?",
        translatedText: "Merhaba, bu fren balatası 2018 Ford Escape için uyumlu mu?",
        originalLanguage: "ka",
        targetLanguage: "tr",
        time: "Bugün 10:24",
      },
    ],
  },
  {
    id: "msg-002",
    customerName: "Dmitry Ivanov (Tbilisi)",
    customerPhone: "+995 555 333 444",
    customerEmail: "dmitry@tbilisigarage.ge",
    customerLang: "ru", // Russian
    channel: "WhatsApp",
    subject: "Toyota Corolla yağ filtresi fiyat",
    productName: "Toyota Corolla Yağ Filtresi",
    productCode: "FR-FILTRE-COROLLA-002",
    city: "Tbilisi",
    status: "open",
    lastMessageAt: "Bugün 11:05",
    messages: [
      {
        id: "m1",
        sender: "customer",
        originalText: "Здравствуйте, подходит ли этот фильтр для Toyota Corolla 1.6 бензин 2016 года?",
        translatedText: "Merhaba, bu filtre 2016 model Toyota Corolla 1.6 benzinli araç için uygun mu?",
        originalLanguage: "ru",
        targetLanguage: "tr",
        time: "Bugün 11:05",
      },
      {
        id: "m2",
        sender: "store",
        originalText: "Lütfen aracın şasi numarasını gönderirseniz uyumluluğu net kontrol edebiliriz.",
        translatedText: "Пожалуйста, отправьте серийный номер автомобиля, чтобы мы могли точно проверить совместимость.",
        originalLanguage: "tr",
        targetLanguage: "ru",
        time: "Bugün 11:12",
      },
    ],
  },
  {
    id: "msg-003",
    customerName: "Hans Weber (Munich)",
    customerPhone: "+49 89 123456",
    customerEmail: "hans.weber@auto-parts.de",
    customerLang: "de", // German
    channel: "E-posta",
    subject: "Toplu ürün siparişi hakkında",
    productName: "Universal Buji Seti",
    productCode: "FR-BUJI-SET-004",
    city: "Munich",
    status: "answered",
    lastMessageAt: "Dün 17:40",
    messages: [
      {
        id: "m1",
        sender: "customer",
        originalText: "Hallo, ich würde gerne den Preis und die Lieferzeit für 20 Sätze Zündkerzen erfahren.",
        translatedText: "Merhaba, 20 set buji için fiyat ve teslimat süresini öğrenmek istiyorum.",
        originalLanguage: "de",
        targetLanguage: "tr",
        time: "Dün 17:40",
      },
      {
        id: "m2",
        sender: "store",
        originalText: "Stok adetlerimiz yeterlidir. Proforma fatura hazırlayıp teklif paneline yükledik.",
        translatedText: "Unsere Lagerbestände reichen aus. Wir haben eine Proforma-Rechnung vorbereitet und in das Angebots-Panel hochgeladen.",
        originalLanguage: "tr",
        targetLanguage: "de",
        time: "Dün 18:05",
      },
    ],
  },
];

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");
  const [search, setSearch] = useState("");
  
  // Interactive translation states
  const [replyText, setReplyText] = useState("");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [message, setMessage] = useState("");

  const activeThread = threads[selectedIdx] ?? null;

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((thread) => {
      const matchesStatus = statusFilter === "all" || thread.status === statusFilter;
      const matchesSearch =
        !q ||
        thread.customerName.toLowerCase().includes(q) ||
        thread.subject.toLowerCase().includes(q) ||
        thread.productName?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [threads, statusFilter, search]);

  // Mock translation preview generator based on selected client language!
  const simulatedTranslationPreview = useMemo(() => {
    if (!replyText.trim() || !activeThread) return "";
    const lang = activeThread.customerLang;
    if (lang === "ka") {
      return `[გურჯული თარგმანი] გამარჯობა, მადლობა შეკითხვისთვის. ${replyText}`;
    }
    if (lang === "ru") {
      return `[Русский перевод] Здравствуйте, спасибо за обращение. ${replyText}`;
    }
    if (lang === "de") {
      return `[Deutscher Übersetzung] Hallo, danke für Ihre Anfrage. ${replyText}`;
    }
    return `[English Translation] Hello, thanks for writing. ${replyText}`;
  }, [replyText, activeThread]);

  function sendReply() {
    if (!activeThread) return;
    if (!replyText.trim()) {
      setMessage("Cevap göndermek için mesaj alanını doldurun.");
      return;
    }

    const newMsg: MessageItem = {
      id: `reply-${Date.now()}`,
      sender: "store",
      originalText: replyText,
      translatedText: autoTranslate ? simulatedTranslationPreview : replyText,
      originalLanguage: "tr",
      targetLanguage: activeThread.customerLang,
      time: "Şimdi",
    };

    const updated = [...threads];
    updated[selectedIdx] = {
      ...activeThread,
      status: "answered",
      lastMessageAt: "Şimdi",
      messages: [...activeThread.messages, newMsg],
    };

    setThreads(updated);
    setReplyText("");
    setMessage("Yapay zeka çevirisiyle mesajınız alıcının diline dönüştürülerek gönderildi!");
  }

  function handleCloseThread() {
    if (!activeThread) return;
    const updated = [...threads];
    updated[selectedIdx] = { ...activeThread, status: "closed" };
    setThreads(updated);
    setMessage("Konuşma başarıyla kapatıldı.");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950 px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">HBS İletişim Merkezî</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Paneli Aç</Link>
          </div>
        </header>

        {/* AI translation alert info */}
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="inline-flex rounded-full bg-blue-100 border border-blue-500/20 px-3 py-1 text-xs text-blue-800 font-extrabold mb-2">🤖 YAPAY ZEKA ÇEVİRİ KÖPRÜSÜ (TRANSLATION HUB)</div>
          <h1 className="mt-1 text-xl font-black sm:text-3xl">Çok Dilli Akıllı Mesajlaşma Paneli</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Dil engeli olmadan küresel ticaret yapın! Müşteriler kendi dillerinde yazar (Gürcüce, Rusça, Almanca) ➔ Mağaza sahiplerine otomatik olarak Türkçe çevrilir. Mağazanın Türkçe yazdığı cevaplar ise alıcının tarayıcı diline otomatik yerelleştirilerek ulaştırılır.
          </p>
        </section>

        {message && (
          <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black text-emerald-950">
            ✓ {message}
          </div>
        )}

        <section className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          
          {/* Thread List */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-black uppercase text-slate-500 tracking-wider">Konuşmalar</h2>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="İsim, ürün veya kelime ara..."
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as MessageStatus | "all")}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="unread">Okunmadı</option>
                  <option value="open">Açık</option>
                  <option value="answered">Cevaplandı</option>
                  <option value="closed">Kapandı</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {filteredThreads.map((t, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedIdx(idx);
                      setMessage("");
                    }}
                    className={`w-full text-left rounded-xl p-3 border transition ${isSelected ? "bg-blue-50 border-blue-300 shadow-sm" : "bg-slate-50/50 hover:bg-slate-50 border-slate-100"}`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="font-black text-xs text-slate-800">{t.customerName}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${t.status === "unread" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"}`}>
                        {t.status === "unread" ? "Yeni" : t.status === "open" ? "Açık" : t.status === "answered" ? "Cevaplandı" : "Kapandı"}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate mt-1">📬 {t.subject}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                      <span>{t.channel}</span>
                      <span>🌍 DİL: {t.customerLang.toUpperCase()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Chat Window with translation bubbles */}
          {activeThread ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 flex flex-col justify-between min-h-[550px]">
              
              {/* Header details */}
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Yazışılan Müşteri</span>
                  <h3 className="font-black text-slate-800">{activeThread.customerName}</h3>
                  <p className="text-xs text-slate-500 font-bold">📧 {activeThread.customerEmail} · 📞 {activeThread.customerPhone}</p>
                  {activeThread.productName && (
                    <span className="inline-block rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 mt-2">
                      📦 İlgilenilen Ürün: {activeThread.productName} ({activeThread.productCode})
                    </span>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleCloseThread}
                  className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700"
                >
                  Konuşmayı Kapat
                </button>
              </div>

              {/* Chat bubbles container */}
              <div className="flex-1 overflow-y-auto p-2 space-y-3 bg-slate-50/50 rounded-2xl border border-slate-100 max-h-[300px] min-h-[250px]">
                {activeThread.messages.map((m) => {
                  const isStore = m.sender === "store";
                  return (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-2xl p-3 text-xs space-y-1.5 shadow-sm border ${isStore ? "ml-auto bg-blue-600 text-white border-blue-600" : "bg-white text-slate-900 border-slate-100"}`}
                    >
                      <div className="flex justify-between items-center gap-4 text-[9px] font-black uppercase opacity-75">
                        <span>{isStore ? "Siz (Mağaza)" : activeThread.customerName}</span>
                        <span>{m.time}</span>
                      </div>

                      {/* Original customer language */}
                      <p className="leading-relaxed font-semibold">
                        {m.originalText}
                      </p>

                      {/* Translated subtext bridge */}
                      <div className={`border-t pt-1.5 mt-1.5 flex flex-col gap-1 ${isStore ? "border-blue-500 text-blue-100" : "border-slate-100 text-blue-700 font-medium"}`}>
                        <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                          🤖 YAPAY ZEKA OTOMATİK ÇEVİRİ ({m.originalLanguage.toUpperCase()} ➔ {m.targetLanguage.toUpperCase()})
                        </span>
                        <p className="italic leading-relaxed">
                          {m.translatedText}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply box and translate preview */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <label className="flex items-center gap-1.5 font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTranslate}
                      onChange={(e) => setAutoTranslate(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    Yapay Zeka Çeviriyi Aktif Tut ({activeThread.customerLang.toUpperCase()} Diline)
                  </label>

                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hedef Ülke Dili: {activeThread.customerLang.toUpperCase()}</span>
                </div>

                {autoTranslate && replyText.trim() && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-xs text-blue-900 leading-relaxed font-medium animate-fadeIn">
                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 block mb-1">🤖 ÇEVİRİ ÖNİZLEME (ALICININ EKRANINDA GÖRÜNECEK HİZMET)</span>
                    {simulatedTranslationPreview}
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Türkçe cevap yazın, Yapay Zeka otomatik çevirip iletecektir..."
                    rows={2}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white resize-none"
                  />
                  <button
                    type="button"
                    onClick={sendReply}
                    className="rounded-xl bg-slate-900 px-5 text-xs font-black text-white hover:bg-slate-800 transition shadow-sm active:scale-95 shrink-0 flex items-center justify-center"
                  >
                    Gönder
                  </button>
                </div>
              </div>

            </section>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center italic text-slate-400">
              Yazışma detaylarını açmak için soldan bir konuşma seçin.
            </div>
          )}

        </section>
      </div>
    </main>
  );
}