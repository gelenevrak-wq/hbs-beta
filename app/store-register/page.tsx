"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher, { LanguageCode } from "@/components/language/CompactLanguageSwitcher";

type BusinessModel = "products" | "services" | "onSiteService" | "transport" | "food" | "consulting" | "rental" | "tours" | "realEstate" | "vehicles" | "auction";

type PricingModel = "fixed" | "hourly" | "daily" | "perPerson" | "staffBased" | "package" | "quote";

const businessModels: Array<{ id: BusinessModel; icon: string; label: string; description: string }> = [
  { id: "products", icon: "🧰", label: "Ürün satışı", description: "Stok, depo, raf, barkod, SKU, OEM ve vitrin görünürlüğü." },
  { id: "services", icon: "🛠️", label: "Hizmet satışı", description: "Kuaför, pedikür, oto servis, sağlık, bakım ve randevulu hizmetler." },
  { id: "onSiteService", icon: "🏠", label: "Yerinde hizmet", description: "Elektrikçi, tesisatçı, marangoz, klima servisi ve özel ders." },
  { id: "transport", icon: "🚐", label: "Nakliye / ulaşım", description: "Evden eve nakliye, VIP taksi, minibüs, midibüs, otobüs ve transfer." },
  { id: "food", icon: "🍽️", label: "Lokanta / menü", description: "Menü, paket servis fiyatı, lokanta fiyatı ve masa rezervasyonu." },
  { id: "consulting", icon: "⚖️", label: "Danışmanlık", description: "Hukuk, yaşam koçu, aile danışmanı, diyetisyen ve uzman randevusu." },
  { id: "rental", icon: "🔑", label: "Kiralama", description: "Araç, ekipman, alan, ofis, depo, tekne veya süre bazlı kiralama." },
  { id: "tours", icon: "🧭", label: "Tur / deneyim", description: "Kontenjan, tarih, kişi sayısı, rehber dili ve rezervasyon." },
  { id: "realEstate", icon: "🏠", label: "Emlak", description: "Satılık, kiralık, randevu, teklif ve opsiyonel açık artırma." },
  { id: "vehicles", icon: "🚗", label: "Araç", description: "Satış, kiralama, ekspertiz, teklif ve teminatlı açık artırma." },
  { id: "auction", icon: "🔨", label: "Açık artırma", description: "Teminat, teklif geçmişi, ciddiyet skoru ve süreli satış." },
];

const pricingModels: Array<{ id: PricingModel; label: string }> = [
  { id: "fixed", label: "Sabit fiyat" },
  { id: "hourly", label: "Saatlik" },
  { id: "daily", label: "Günlük" },
  { id: "perPerson", label: "Kişi başı" },
  { id: "staffBased", label: "Personel sayısına göre" },
  { id: "package", label: "Paket fiyat" },
  { id: "quote", label: "Teklif usulü" },
];

const texts = {
  tr: {
    home: "Ana sayfa",
    login: "Giriş yap",
    eyebrow: "MAĞAZA KAYDI",
    title: "HBS iş modelinizi seçsin, paneliniz ona göre şekillensin",
    description: "Her işletme aynı şekilde çalışmaz. Ürün satan mağazanın stok/depo paneli gerekir; hizmet veren işletmenin takvim, personel ve zaman slotu gerekir. Karma çalışan işletmeler birden fazla modeli birlikte seçebilir.",
    company: "Firma / mağaza adı",
    owner: "Yetkili kişi",
    phone: "Telefon / WhatsApp",
    city: "Şehir",
    modelsTitle: "Ne satıyorsunuz?",
    modelsNote: "Birden fazla seçenek işaretlenebilir. HBS paneli seçilen iş modeline göre modülleri açar.",
    selectedTitle: "Seçime göre açılacak modüller",
    productPanel: "Ürün + stok + depo + raf adresleme + vitrin",
    servicePanel: "Hizmet + personel + süre + kapasite + takvim + randevu",
    rentalPanel: "Kiralama + süre + teslim/alım noktası + depozito",
    tourPanel: "Tur + tarih + kontenjan + kişi sayısı + kalkış noktası",
    auctionPanel: "Açık artırma + teminat + teklif geçmişi + güven skoru",
    realEstatePanel: "Emlak + konum + randevu + teklif + satılık/kiralık ayrımı",
    pricingTitle: "Fiyatlandırma nasıl çalışacak?",
    calendarTitle: "Hizmet / tur / kiralama takvimi",
    calendarText: "Müşteri boş zaman dilimlerini görür. Mağaza personel, ekipman, hizmet süresi ve kapasiteye göre uygun saatleri açar.",
    submit: "Mağaza kayıt taslağını oluştur",
    done: "Demo kayıt taslağı hazırlandı. Canlı sistemde bu seçimlere göre mağaza paneli otomatik şekillenecek.",
  },
  en: {
    home: "Home", login: "Login", eyebrow: "STORE REGISTRATION", title: "HBS shapes the panel around your business model", description: "Every business works differently. Product sellers need stock and warehouse tools; service businesses need calendar, staff and time slots. Hybrid businesses can select multiple models.", company: "Company / store name", owner: "Authorized person", phone: "Phone / WhatsApp", city: "City", modelsTitle: "What do you sell?", modelsNote: "Multiple options can be selected. HBS enables modules based on the selected business model.", selectedTitle: "Modules opened by your selection", productPanel: "Products + stock + warehouse + shelf addressing + storefront", servicePanel: "Services + staff + duration + capacity + calendar + appointments", rentalPanel: "Rental + period + pickup/return point + deposit", tourPanel: "Tours + dates + capacity + headcount + departure point", auctionPanel: "Auction + deposit + bid history + trust score", realEstatePanel: "Real estate + location + appointment + offer + sale/rent split", pricingTitle: "How will pricing work?", calendarTitle: "Service / tour / rental calendar", calendarText: "Customers see available slots. The store opens availability based on staff, equipment, service duration and capacity.", submit: "Create store registration draft", done: "Demo registration draft created. In production, the store panel will be shaped by these selections." },
  de: {
    home: "Startseite", login: "Einloggen", eyebrow: "SHOP-REGISTRIERUNG", title: "HBS passt das Panel an Ihr Geschäftsmodell an", description: "Nicht jedes Unternehmen arbeitet gleich. Produktverkäufer brauchen Lager und Bestand; Dienstleister brauchen Kalender, Personal und Zeitfenster. Hybrid-Unternehmen können mehrere Modelle wählen.", company: "Firma / Shopname", owner: "Verantwortliche Person", phone: "Telefon / WhatsApp", city: "Stadt", modelsTitle: "Was verkaufen Sie?", modelsNote: "Mehrere Optionen können ausgewählt werden. HBS öffnet die passenden Module je nach Geschäftsmodell.", selectedTitle: "Module nach Auswahl", productPanel: "Produkte + Bestand + Lager + Regaladresse + Schaufenster", servicePanel: "Service + Personal + Dauer + Kapazität + Kalender + Termine", rentalPanel: "Vermietung + Zeitraum + Abholung/Rückgabe + Kaution", tourPanel: "Tour + Datum + Kapazität + Personenanzahl + Startpunkt", auctionPanel: "Auktion + Kaution + Gebotshistorie + Vertrauensscore", realEstatePanel: "Immobilien + Standort + Termin + Angebot + Kauf/Miete", pricingTitle: "Wie funktioniert die Preisbildung?", calendarTitle: "Service-/Tour-/Mietkalender", calendarText: "Kunden sehen freie Zeitfenster. Der Shop öffnet Verfügbarkeit nach Personal, Ausrüstung, Dauer und Kapazität.", submit: "Shop-Registrierungsentwurf erstellen", done: "Demo-Entwurf erstellt. Im Live-System wird das Panel nach diesen Auswahlpunkten geformt." },
  ru: {
    home: "Главная", login: "Вход", eyebrow: "РЕГИСТРАЦИЯ МАГАЗИНА", title: "HBS формирует панель под модель бизнеса", description: "Бизнесы работают по-разному. Продавцам нужны склад и остатки; сервисам нужны календарь, персонал и временные слоты. Гибридный бизнес может выбрать несколько моделей.", company: "Компания / магазин", owner: "Ответственное лицо", phone: "Телефон / WhatsApp", city: "Город", modelsTitle: "Что вы продаёте?", modelsNote: "Можно выбрать несколько вариантов. HBS включает модули по выбранной бизнес-модели.", selectedTitle: "Модули по выбору", productPanel: "Товары + склад + адресация полок + витрина", servicePanel: "Услуги + персонал + длительность + вместимость + календарь", rentalPanel: "Аренда + срок + место выдачи/возврата + депозит", tourPanel: "Туры + даты + места + количество людей + точка отправления", auctionPanel: "Аукцион + депозит + история ставок + рейтинг доверия", realEstatePanel: "Недвижимость + локация + запись + предложение + продажа/аренда", pricingTitle: "Как будет работать цена?", calendarTitle: "Календарь услуг / туров / аренды", calendarText: "Клиент видит свободные слоты. Магазин открывает время по персоналу, оборудованию, длительности и вместимости.", submit: "Создать черновик регистрации", done: "Демо-черновик создан. В живой системе панель будет формироваться по этим выборам." },
  ka: {
    home: "მთავარი", login: "შესვლა", eyebrow: "მაღაზიის რეგისტრაცია", title: "HBS პანელს ბიზნეს მოდელის მიხედვით აყალიბებს", description: "ყველა ბიზნესი ერთნაირად არ მუშაობს. პროდუქტის გამყიდველს სჭირდება მარაგი და საწყობი; სერვისს სჭირდება კალენდარი, პერსონალი და დროის სლოტები. შერეულ ბიზნესს რამდენიმე მოდელის არჩევა შეუძლია.", company: "კომპანია / მაღაზია", owner: "პასუხისმგებელი პირი", phone: "ტელეფონი / WhatsApp", city: "ქალაქი", modelsTitle: "რას ყიდით?", modelsNote: "შესაძლებელია რამდენიმე არჩევანი. HBS მოდულებს არჩეული ბიზნეს მოდელის მიხედვით ხსნის.", selectedTitle: "არჩევის მიხედვით გახსნილი მოდულები", productPanel: "პროდუქტი + მარაგი + საწყობი + თაროს მისამართი + ვიტრინა", servicePanel: "სერვისი + პერსონალი + ხანგრძლივობა + ტევადობა + კალენდარი", rentalPanel: "ქირაობა + ვადა + აღება/დაბრუნება + დეპოზიტი", tourPanel: "ტური + თარიღი + ადგილები + ადამიანების რაოდენობა + გასვლის ადგილი", auctionPanel: "აუქციონი + დეპოზიტი + შეთავაზებების ისტორია + ნდობის ქულა", realEstatePanel: "უძრავი ქონება + მდებარეობა + შეხვედრა + შეთავაზება + გაყიდვა/ქირა", pricingTitle: "როგორ იმუშავებს ფასი?", calendarTitle: "სერვისის / ტურის / ქირაობის კალენდარი", calendarText: "კლიენტი ხედავს თავისუფალ სლოტებს. მაღაზია ხელმისაწვდომობას პერსონალის, აღჭურვილობის, ხანგრძლივობისა და ტევადობის მიხედვით ხსნის.", submit: "მაღაზიის რეგისტრაციის მონახაზის შექმნა", done: "Demo მონახაზი შეიქმნა. Live სისტემაში პანელი ამ არჩევანებით ჩამოყალიბდება." },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "tr" || value === "en" || value === "ru" || value === "ka" || value === "de";
}

export default function StoreRegisterPage() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [selectedModels, setSelectedModels] = useState<BusinessModel[]>(["products"]);
  const [selectedPricing, setSelectedPricing] = useState<PricingModel[]>(["fixed"]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
  }, []);

  const t = texts[language];

  const selectedModuleNotes = useMemo(() => {
    const notes: string[] = [];
    if (selectedModels.includes("products")) notes.push(t.productPanel);
    if (selectedModels.includes("services")) notes.push(t.servicePanel);
    if (selectedModels.includes("onSiteService")) notes.push("Yerinde hizmet + servis bölgesi + adres/konum + usta takvimi");
    if (selectedModels.includes("transport")) notes.push("Nakliye/ulaşım + araç filosu + güzergah + mesafe bazlı teklif");
    if (selectedModels.includes("food")) notes.push("Lokanta + menü fotoğrafı + paket/lokanta fiyatı + masa rezervasyonu");
    if (selectedModels.includes("consulting")) notes.push("Danışmanlık + uzman profili + online/yüz yüze randevu + seans fiyatı");
    if (selectedModels.includes("rental")) notes.push(t.rentalPanel);
    if (selectedModels.includes("tours")) notes.push(t.tourPanel);
    if (selectedModels.includes("auction") || selectedModels.includes("vehicles")) notes.push(t.auctionPanel);
    if (selectedModels.includes("realEstate")) notes.push(t.realEstatePanel);
    return notes;
  }, [selectedModels, t]);

  function toggleModel(model: BusinessModel) {
    setSelectedModels((current) =>
      current.includes(model) ? current.filter((item) => item !== model) : [...current, model]
    );
  }

  function togglePricing(model: PricingModel) {
    setSelectedPricing((current) =>
      current.includes(model) ? current.filter((item) => item !== model) : [...current, model]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-xl font-black tracking-tight">HBS</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/login" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">{t.login}</Link>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">{t.home}</Link>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">{t.eyebrow}</p>
          <h1 className="mt-2 max-w-4xl text-2xl font-black tracking-tight sm:text-3xl">{t.title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{t.description}</p>
        </section>

        <form onSubmit={handleSubmit} className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.82fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none" placeholder={t.company} />
              <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none" placeholder={t.owner} />
              <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none" placeholder={t.phone} />
              <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none" placeholder={t.city} />
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">{t.modelsTitle}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.modelsNote}</p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {businessModels.map((model) => {
                const active = selectedModels.includes(model.id);
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => toggleModel(model.id)}
                    className={`rounded-2xl border p-3 text-left transition ${active ? "border-blue-500 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg">{model.icon}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{active ? "Aktif" : "+"}</span>
                    </div>
                    <div className="mt-2 text-sm font-black">{model.label}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{model.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-black">{t.pricingTitle}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {pricingModels.map((model) => {
                  const active = selectedPricing.includes(model.id);
                  return (
                    <button
                      type="button"
                      key={model.id}
                      onClick={() => togglePricing(model.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-black ${active ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600"}`}
                    >
                      {model.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="grid gap-3">
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <h2 className="text-lg font-black">{t.selectedTitle}</h2>
              <div className="mt-3 grid gap-2">
                {selectedModuleNotes.map((note) => (
                  <div key={note} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">{note}</div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-blue-200 bg-blue-50 p-4 shadow-xl">
              <h2 className="text-lg font-black text-blue-950">{t.calendarTitle}</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-blue-900">{t.calendarText}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-black text-blue-900">
                {["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"].map((slot) => (
                  <div key={slot} className="rounded-xl border border-blue-200 bg-white px-2 py-2">{slot}</div>
                ))}
              </div>
            </section>

            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-xl hover:bg-slate-800">{t.submit}</button>
            {done && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black leading-5 text-emerald-900">{t.done}</div>}
          </aside>
        </form>
      </div>
    </main>
  );
}
