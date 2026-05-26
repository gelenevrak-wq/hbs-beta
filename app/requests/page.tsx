"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

type Bid = {
  id: string;
  tenderId: string;
  storeName: string;
  storeSlug: string;
  amount: string;
  duration: string;
  message: string;
  date: string;
};

type Tender = {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  city: string;
  country: string;
  ownerName: string;
  ownerEmail: string;
  date: string;
};

const initialTenders: Tender[] = [
  {
    id: "tender-1",
    title: "30 Katlı Plaza Dış Cephe Sıva İhalesi",
    category: "İnşaat / Hizmet",
    description: "Batumi merkezdeki 30 katlı rezidans projemizin dış cephe kaba sıva ve dekoratif sıva işleri için tüm iskele ve malzemeler dahil olacak şekilde ihale açılmıştır. Yalnızca profesyonel ekiplerin kapalı zarf tekliflerini bekliyoruz.",
    budget: "45,000 GEL",
    city: "Batumi",
    country: "Gürcistan",
    ownerName: "Altan Cancı (Gökdelen Proje A.Ş.)",
    ownerEmail: "altan@gokdelen.ge",
    date: "26.05.2026 14:15"
  },
  {
    id: "tender-2",
    title: "Özel İngilizce & Almanca Dil Eğitimi Hizmeti",
    category: "Eğitim / Hizmet",
    description: "Şirket içi çalışanlarımızın teknik İngilizce ve temel Almanca dil becerilerini geliştirmek amacıyla, haftada 3 gün ofisimizde yüz yüze eğitim verebilecek kurum veya bireysel eğitmenlerden teklif alacağız.",
    budget: "Anlaşmaya Bağlı",
    city: "İstanbul",
    country: "Türkiye",
    ownerName: "Deniz Yıldız (İK Müdürü)",
    ownerEmail: "deniz@ikgrup.com",
    date: "25.05.2026 11:20"
  },
  {
    id: "tender-3",
    title: "Katalog Fotoğraf Çekimi & Reklam Filmi",
    category: "Fotoğrafçılık / Hizmet",
    description: "Yeni sezon araç diagnostik ve oto yedek parça kataloglarımız için stüdyo ortamında ürün fotoğraf çekimi ve 60 saniyelik sosyal medya tanıtım filmi montaj hizmeti alınacaktır.",
    budget: "3,500 GEL",
    city: "Tbilisi",
    country: "Gürcistan",
    ownerName: "Giorgi Auto Service",
    ownerEmail: "giorgi@auto.ge",
    date: "24.05.2026 09:40"
  }
];

const initialBids: Bid[] = [
  {
    id: "bid-1",
    tenderId: "tender-1",
    storeName: "Yıldız Batum Vitrini",
    storeSlug: "yildiz-hirdavat",
    amount: "42,000 GEL",
    duration: "25 Gün",
    message: "Tüm iskele ekipmanları, dış cephe koruyucu fileler ve çimento/kum dahil olacak şekilde Batum şubemizdeki uzman kadromuzla projeyi teslim etmeye hazırız.",
    date: "26.05.2026 15:30"
  }
];

export default function RequestsBoardPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  
  // Current user & Store owner states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [currentStore, setCurrentStore] = useState<any>(null);

  // Form States - Posting a new Tender
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("İnşaat / Hizmet");
  const [newDescription, setNewDescription] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("Türkiye");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");

  // Bidding form states
  const [activeTenderId, setActiveTenderId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDuration, setBidDuration] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Load currentUser
    const userStr = window.localStorage.getItem("hbs-current-user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        if (user.role === "owner" || user.role === "superadmin" || user.role === "storeOwner") {
          setIsStoreOwner(true);
          // Look up active store
          const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
          const store = localStores.find((st: any) => user.storeSlugs?.includes(st.code)) || {
            name: "OBDTR Diagnostics",
            code: "obdtr"
          };
          setCurrentStore(store);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Load Tenders
    const localTenders = window.localStorage.getItem("hbs-tender-requests");
    if (localTenders) {
      setTenders(JSON.parse(localTenders));
    } else {
      window.localStorage.setItem("hbs-tender-requests", JSON.stringify(initialTenders));
      setTenders(initialTenders);
    }

    // Load Bids
    const localBids = window.localStorage.getItem("hbs-tender-bids");
    if (localBids) {
      setBids(JSON.parse(localBids));
    } else {
      window.localStorage.setItem("hbs-tender-bids", JSON.stringify(initialBids));
      setBids(initialBids);
    }
  }, []);

  function handleCreateTender(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newTitle.trim() || !newDescription.trim() || !newOwnerEmail.trim() || !newOwnerName.trim()) {
      setError("Lütfen gerekli tüm alanları doldurun.");
      return;
    }

    const newTenderObj: Tender = {
      id: `tender-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      budget: newBudget.trim() || "Anlaşmaya Bağlı",
      city: newCity.trim() || "İstanbul",
      country: newCountry,
      ownerName: newOwnerName.trim(),
      ownerEmail: newOwnerEmail.trim().toLowerCase(),
      date: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", {hour: "2-digit", minute: "2-digit"})
    };

    const updatedTenders = [newTenderObj, ...tenders];
    window.localStorage.setItem("hbs-tender-requests", JSON.stringify(updatedTenders));
    setTenders(updatedTenders);

    // Clear form
    setNewTitle("");
    setNewDescription("");
    setNewBudget("");
    setNewCity("");
    setNewOwnerName("");
    setNewOwnerEmail("");

    setMessage("İlanınız başarıyla yayınlandı! Mağazalar kapalı-zarf tekliflerini ilettikçe bu sayfada görebileceksiniz.");
  }

  function handleSubmitBid(tenderId: string) {
    if (!bidAmount.trim() || !bidMessage.trim()) {
      alert("Lütfen teklif tutarı ve açıklamasını yazın.");
      return;
    }

    const newBidObj: Bid = {
      id: `bid-${Date.now()}`,
      tenderId,
      storeName: currentStore?.name || "OBDTR Diagnostics",
      storeSlug: currentStore?.code || "obdtr",
      amount: bidAmount.trim(),
      duration: bidDuration.trim() || "Belirtilmedi",
      message: bidMessage.trim(),
      date: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", {hour: "2-digit", minute: "2-digit"})
    };

    const updatedBids = [newBidObj, ...bids];
    window.localStorage.setItem("hbs-tender-bids", JSON.stringify(updatedBids));
    setBids(updatedBids);

    // Reset bidding states
    setBidAmount("");
    setBidDuration("");
    setBidMessage("");
    setActiveTenderId(null);

    alert("İhale katılım teklifiniz gizli olarak başarıyla iletildi!");
  }

  return (
    <main className="min-h-screen bg-[#f3f6fc] text-slate-950 px-3 py-3 sm:px-6 sm:py-8 selection:bg-blue-600 selection:text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Link href="/" className="text-base font-black sm:text-xl text-blue-700">HBS Market</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Ana Sayfa</Link>
            <Link href="/customer" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Müşteri Portalı</Link>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="mb-6 rounded-[2rem] border border-indigo-150 bg-gradient-to-r from-blue-500 via-indigo-600 to-indigo-700 p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-100 mb-3 animate-pulse">
            📢 HBS B2B Açık İlan & İhale Panosu
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Aradığınız Ürünü veya Hizmeti Bulamadınız mı?
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-blue-100/90 max-w-4xl leading-relaxed font-semibold">
            B2B ihale ve ilan panomuzda kural tanımaz özgürlük! İster 30 katlı plaza sıvası yaptırmak isteyin, ister özel dil eğitimi, fotoğraf çekimi veya nadir bir diagnostik soketi arayın... İlanınızı hemen bırakın, kayıtlı HBS mağazaları kapalı-zarf usulüyle size özel gizli tekliflerini sunsun. Teklifleri yalnızca siz görebilirsiniz.
          </p>
        </section>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-black text-emerald-850 shadow-sm animate-fadeIn">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-250 bg-red-50 p-4 text-xs font-black text-red-850 shadow-sm animate-fadeIn">
            ⚠ {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          
          {/* Active Tenders Listing Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Açık İlanlar & Aktif İhaleler</h2>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">Mağazaların kapalı-zarf teklif verebileceği aktif talepler.</p>
              </div>
              <span className="rounded-full bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 text-[11px] font-black">{tenders.length} Açık Talep</span>
            </div>

            <div className="space-y-4">
              {tenders.map((t) => {
                const tenderBids = bids.filter(b => b.tenderId === t.id);
                // Security check: Only render bids detail if user is logged in AND is the owner of the tender
                const isTenderOwner = currentUser && currentUser.username?.toLowerCase() === t.ownerEmail?.toLowerCase();

                return (
                  <article key={t.id} className="hbs-glow-card rounded-3xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <span className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[9px] font-black text-blue-800 uppercase tracking-wider">
                          {t.category}
                        </span>
                        <h3 className="text-lg font-black text-slate-800 mt-2">{t.title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">İlan Tarihi: {t.date} · 📍 {t.city}, {t.country}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Hedef Bütçe</span>
                        <span className="text-base font-black text-blue-700">{t.budget}</span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-700 font-medium">{t.description}</p>

                    <div className="rounded-2xl border border-slate-200/50 bg-slate-50/50 p-3 text-[11px] leading-relaxed text-slate-600 font-bold flex justify-between items-center">
                      <div>
                        <p>👤 <span className="text-slate-800">İlan Sahibi:</span> {t.ownerName}</p>
                        <p>✉ <span className="text-slate-800">İletişim Yetki E-postası:</span> {t.ownerEmail}</p>
                      </div>
                      <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-black uppercase text-slate-500">Legal İlan</span>
                    </div>

                    {/* Bids Panel for the Tender */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kapalı Zarf Teklifleri ({tenderBids.length})</span>
                      </div>

                      {/* Display Secret Bids only to Tender Owner */}
                      {isTenderOwner ? (
                        <div className="space-y-2">
                          {tenderBids.map((b) => (
                            <div key={b.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2 animate-fadeIn shadow-sm">
                              <div className="flex justify-between items-center text-xs font-black border-b border-emerald-100 pb-1.5">
                                <span className="text-emerald-800">🏢 Mağaza: {b.storeName} ({b.storeSlug})</span>
                                <span className="text-blue-700 text-sm">{b.amount} (Kargolama: {b.duration})</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-semibold">"{b.message}"</p>
                              <div className="flex justify-between items-center pt-1.5 text-[10px] text-slate-400 font-bold">
                                <span>Teklif Tarihi: {b.date}</span>
                                <a 
                                  href={`https://wa.me/905550000000?text=${encodeURIComponent(`${t.title} ilanınız için Yıldız Hırdavat olarak ilettiğimiz ${b.amount} tutarındaki teklifimiz hakkında görüşmek isteriz.`)}`}
                                  target="_blank"
                                  className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 font-bold hover:bg-emerald-700 transition"
                                >
                                  💬 Mağazaya WhatsApp'tan Ulaş
                                </a>
                              </div>
                            </div>
                          ))}
                          {tenderBids.length === 0 && (
                            <p className="text-xs text-slate-500 italic font-bold">Henüz bu ilana bir mağaza teklif vermedi. Teklif iletildiğinde anında burada listelenecektir.</p>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-3 text-center text-xs font-black text-blue-800 flex items-center justify-center gap-2">
                          <span>🔒</span>
                          <span>Kapalı Zarf Teklifi ({tenderBids.length} Adet) - Sadece İlan Sahibi ({t.ownerEmail}) Tarafından İnceleyebilir</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Submit Bid Actions for Registered Stores */}
                    {isStoreOwner && activeTenderId !== t.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTenderId(t.id);
                          setBidAmount(t.budget !== "Anlaşmaya Bağlı" ? t.budget : "1000 GEL");
                        }}
                        className="w-full mt-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-xs font-black text-white shadow-md active:scale-95 transition-all duration-300"
                      >
                        ✍ Bu İlana Gizli Teklif Sun (HBS Mağaza İştiraki)
                      </button>
                    )}

                    {/* Secret Bidding Form Box */}
                    {activeTenderId === t.id && (
                      <div className="rounded-3xl border border-indigo-200 bg-indigo-50/20 p-4 space-y-3 animate-fadeIn shadow-inner">
                        <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider border-b border-indigo-100 pb-1.5 flex justify-between">
                          <span>✍ Gizli İhale Teklif Formu</span>
                          <button onClick={() => setActiveTenderId(null)} className="text-red-500 hover:text-red-700 font-extrabold">İptal Et</button>
                        </h4>
                        
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-1">
                            <span className="text-[10px] font-bold text-slate-600">Teklif Tutarı (Para Birimi Dahil) *</span>
                            <input
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder="Örn: 38,000 GEL"
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 transition"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-[10px] font-bold text-slate-600">Süre / Teslimat Zarfı</span>
                            <input
                              value={bidDuration}
                              onChange={(e) => setBidDuration(e.target.value)}
                              placeholder="Örn: 15 İş Günü"
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 transition"
                            />
                          </label>
                        </div>

                        <label className="grid gap-1">
                          <span className="text-[10px] font-bold text-slate-600">Müşteriye İletilecek Gizli Zarf Mesajı *</span>
                          <textarea
                            value={bidMessage}
                            onChange={(e) => setBidMessage(e.target.value)}
                            placeholder="Uzmanlık referanslarınız, iskele ve malzeme kullanım detaylarınız vb..."
                            rows={3}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 transition"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleSubmitBid(t.id)}
                          className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-black text-white transition active:scale-95"
                        >
                          Kapalı Teklifi Güvenli Gönder
                        </button>
                      </div>
                    )}

                  </article>
                );
              })}
            </div>
          </section>

          {/* Posting a new B2B Request/Tender Section */}
          <aside className="space-y-4">
            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider">Hemen İlan / İhale Açın</h3>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">İstediğiniz legal ürün veya hizmet için anında ilan verin.</p>
              </div>

              <form onSubmit={handleCreateTender} className="space-y-4">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">İlan Başlığı *</span>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="Örn: NGK Buji Seti Toplu Alım İhalesi"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">Sektör / Kategori *</span>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    <option value="İnşaat / Hizmet">İnşaat / Hizmet</option>
                    <option value="Eğitim / Hizmet">Eğitim / Hizmet</option>
                    <option value="Fotoğrafçılık / Hizmet">Fotoğrafçılık / Hizmet</option>
                    <option value="Oto Yedek Parça">Oto Yedek Parça</option>
                    <option value="Danışmanlık / Hizmet">Danışmanlık / Hizmet</option>
                    <option value="Diğer Sektörler">Diğer Sektörler</option>
                  </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-600">Bütçe / Karşılık</span>
                    <input
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      placeholder="Örn: 5,000 GEL"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-600">Şehir *</span>
                    <input
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      required
                      placeholder="Örn: Batumi, İzmir"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </label>
                </div>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">İlan Detayı & Özel Talepleriniz *</span>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    placeholder="İhtiyacınızı detaylandırın. Örneğin sıva kalınlığı, malzeme kalitesi, özel ders süreleri vb..."
                    rows={4}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>

                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">İletişim ve Güvenlik Bilgileri</span>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-bold text-slate-600">Adınız Soyadınız *</span>
                      <input
                        value={newOwnerName}
                        onChange={(e) => setNewOwnerName(e.target.value)}
                        required
                        placeholder="Örn: Altan Cancı"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-bold text-slate-600">Yetki E-postanız *</span>
                      <input
                        type="email"
                        value={newOwnerEmail}
                        onChange={(e) => setNewOwnerEmail(e.target.value)}
                        required
                        placeholder="altan@gokdelen.ge"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold leading-normal">
                    * Yetki e-postanız önemlidir. Bu sayfada teklifleri görüntülemek için bu e-posta adresiyle HBS müşteri portali hesabınız açık olmalıdır. Diğer ziyaretçilerden teklif tutarlarınız tamamen gizlenir.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3.5 text-xs font-black text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300"
                >
                  🚀 Açık İlanı & İhaleyi Canlıya Al
                </button>
              </form>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
