"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";
import CountrySelect, { CountryCode } from "@/components/common/CountrySelect";

const texts = {
  tr: {
    home: "Ana Sayfa",
    dashboard: "Panel",
    storeFront: "Mağaza Vitrini",
    eyebrow: "FİRMA AYARLARI",
    title: "Firma, Şube ve Portal Ayarları",
    description:
      "Mağazanızın temel bilgilerini, iletişim kanallarını, konum bilgilerini ve HBS müşteri portalında nasıl görüneceğini buradan yönetin.",
    cleanTitle: "Gerçek firma bilgileri bekleniyor",
    cleanText:
      "Bu ekranda sahte firma, sahte adres, sahte telefon veya gerçek olmayan ayar gösterilmez. Bilgiler mağaza tarafından girildiğinde kaydedilecektir.",
    companyTitle: "Firma Bilgileri",
    companyName: "Firma Adı",
    companyNamePlaceholder: "Firma adınızı yazın",
    officialTitle: "Resmî Firma Ünvanı",
    officialTitlePlaceholder: "Varsa resmî firma ünvanı",
    taxNumber: "Vergi / Kayıt Numarası",
    taxNumberPlaceholder: "Varsa kayıt numarası",
    sector: "Sektör",
    sectorPlaceholder: "Örn: oto yedek parça, servis, güzellik, kiralama",
    descriptionLabel: "Firma Açıklaması",
    descriptionPlaceholder: "Müşterilerin göreceği kısa firma açıklaması",
    contactTitle: "İletişim ve Konum",
    country: "Ülke",
    phone: "Telefon",
    phonePlaceholder: "+995...",
    whatsapp: "WhatsApp Hattı",
    whatsappPlaceholder: "+995...",
    email: "E-posta",
    emailPlaceholder: "ornek@firma.com",
    city: "Şehir",
    cityPlaceholder: "Şehir yazın",
    address: "Adres / Bölge",
    addressPlaceholder: "Adres veya bölge bilgisi",
    googleMap: "Google Maps Konumu",
    googleMapPlaceholder: "Google Maps bağlantısı",
    portalTitle: "Müşteri Portalı Ayarları",
    portalVisibility: "Portal Görünürlüğü",
    visible: "Müşteri portalında görünür",
    hidden: "Şimdilik gizli",
    priceVisibility: "Fiyat Görünürlüğü",
    showPrices: "Fiyatları göster",
    requestOnly: "Sadece teklif isteği al",
    allowOrders: "Müşteri sipariş verebilsin",
    blockOrders: "Sipariş kapalı, sadece talep alınsın",
    allowMessages: "HBS mesajlaşma açık",
    blockMessages: "HBS mesajlaşma kapalı",
    allowWhatsapp: "WhatsApp butonu açık",
    blockWhatsapp: "WhatsApp butonu kapalı",
    documentTitle: "Dil, Para Birimi ve Belge Ayarları",
    defaultLanguage: "Varsayılan Dil",
    defaultCurrency: "Varsayılan Para Birimi",
    documentLanguage: "Belge Dili",
    customerLanguage: "Müşterinin tercih ettiği dil",
    storeLanguage: "Mağazanın varsayılan dili",
    save: "Ayarları Kaydet",
    saved:
      "Ayarlar demo olarak kaydedildi. Gerçek sistemde bu bilgiler veritabanına yazılacak ve mağaza vitrini otomatik güncellenecek.",
    emptyTitle: "Ayarlar henüz gerçek sisteme bağlanmadı",
    emptyText:
      "Bu form şu anda arayüz hazırlığıdır. Veritabanı bağlandığında firma bilgileri, portal görünürlüğü ve belge ayarları kalıcı olarak kaydedilecektir.",
    nextTitle: "Sonraki aşama",
    nextText:
      "Logo yükleme, çoklu şube yönetimi, çalışma saatleri, teslimat bölgeleri, kullanıcı rolleri ve bildirim ayarları ilerleyen adımlarda bağlanacaktır.",
  },
  en: {
    home: "Home",
    dashboard: "Panel",
    storeFront: "Storefront",
    eyebrow: "COMPANY SETTINGS",
    title: "Company, Branch and Portal Settings",
    description:
      "Manage your store information, contact channels, location details and how your business appears in the HBS customer portal.",
    cleanTitle: "Waiting for real company data",
    cleanText:
      "No fake company, fake address, fake phone or non-real setting is shown on this screen. Information will be saved when entered by the store.",
    companyTitle: "Company Information",
    companyName: "Company Name",
    companyNamePlaceholder: "Enter company name",
    officialTitle: "Official Company Title",
    officialTitlePlaceholder: "Official registered name if available",
    taxNumber: "Tax / Registration Number",
    taxNumberPlaceholder: "Registration number if available",
    sector: "Sector",
    sectorPlaceholder: "Example: auto parts, service, beauty, rental",
    descriptionLabel: "Company Description",
    descriptionPlaceholder: "Short company description customers will see",
    contactTitle: "Contact and Location",
    country: "Country",
    phone: "Phone",
    phonePlaceholder: "+995...",
    whatsapp: "WhatsApp Line",
    whatsappPlaceholder: "+995...",
    email: "Email",
    emailPlaceholder: "example@company.com",
    city: "City",
    cityPlaceholder: "Enter city",
    address: "Address / Area",
    addressPlaceholder: "Address or area information",
    googleMap: "Google Maps Location",
    googleMapPlaceholder: "Google Maps link",
    portalTitle: "Customer Portal Settings",
    portalVisibility: "Portal Visibility",
    visible: "Visible in customer portal",
    hidden: "Hidden for now",
    priceVisibility: "Price Visibility",
    showPrices: "Show prices",
    requestOnly: "Only receive quote requests",
    allowOrders: "Allow customer orders",
    blockOrders: "Orders closed, requests only",
    allowMessages: "HBS messaging enabled",
    blockMessages: "HBS messaging disabled",
    allowWhatsapp: "WhatsApp button enabled",
    blockWhatsapp: "WhatsApp button disabled",
    documentTitle: "Language, Currency and Document Settings",
    defaultLanguage: "Default Language",
    defaultCurrency: "Default Currency",
    documentLanguage: "Document Language",
    customerLanguage: "Customer preferred language",
    storeLanguage: "Store default language",
    save: "Save Settings",
    saved:
      "Settings were saved in demo mode. In the real system, these details will be written to the database and reflected in the storefront.",
    emptyTitle: "Settings are not connected to the real system yet",
    emptyText:
      "This form is currently interface preparation. Company information, portal visibility and document settings will be saved permanently when the database is connected.",
    nextTitle: "Next stage",
    nextText:
      "Logo upload, multi-branch management, working hours, delivery zones, user roles and notification settings will be connected later.",
  },
  ru: {
    home: "Главная",
    dashboard: "Панель",
    storeFront: "Витрина магазина",
    eyebrow: "НАСТРОЙКИ КОМПАНИИ",
    title: "Настройки компании, филиалов и портала",
    description:
      "Управляйте данными магазина, каналами связи, местоположением и отображением в клиентском портале HBS.",
    cleanTitle: "Ожидание реальных данных компании",
    cleanText:
      "На этом экране не отображаются фиктивная компания, адрес, телефон или нереальные настройки. Информация будет сохранена после ввода магазином.",
    companyTitle: "Информация о компании",
    companyName: "Название компании",
    companyNamePlaceholder: "Введите название компании",
    officialTitle: "Официальное название компании",
    officialTitlePlaceholder: "Официальное название, если есть",
    taxNumber: "Налоговый / регистрационный номер",
    taxNumberPlaceholder: "Регистрационный номер, если есть",
    sector: "Сектор",
    sectorPlaceholder: "Напр.: автозапчасти, сервис, красота, аренда",
    descriptionLabel: "Описание компании",
    descriptionPlaceholder: "Краткое описание, которое увидят клиенты",
    contactTitle: "Контакты и местоположение",
    country: "Страна",
    phone: "Телефон",
    phonePlaceholder: "+995...",
    whatsapp: "WhatsApp линия",
    whatsappPlaceholder: "+995...",
    email: "E-mail",
    emailPlaceholder: "example@company.com",
    city: "Город",
    cityPlaceholder: "Введите город",
    address: "Адрес / район",
    addressPlaceholder: "Адрес или район",
    googleMap: "Местоположение Google Maps",
    googleMapPlaceholder: "Ссылка Google Maps",
    portalTitle: "Настройки клиентского портала",
    portalVisibility: "Видимость в портале",
    visible: "Видно в клиентском портале",
    hidden: "Пока скрыто",
    priceVisibility: "Видимость цен",
    showPrices: "Показывать цены",
    requestOnly: "Только получать запросы предложений",
    allowOrders: "Клиент может делать заказ",
    blockOrders: "Заказы закрыты, только запросы",
    allowMessages: "Сообщения HBS включены",
    blockMessages: "Сообщения HBS выключены",
    allowWhatsapp: "Кнопка WhatsApp включена",
    blockWhatsapp: "Кнопка WhatsApp выключена",
    documentTitle: "Язык, валюта и документы",
    defaultLanguage: "Язык по умолчанию",
    defaultCurrency: "Валюта по умолчанию",
    documentLanguage: "Язык документа",
    customerLanguage: "Предпочтительный язык клиента",
    storeLanguage: "Язык магазина по умолчанию",
    save: "Сохранить настройки",
    saved:
      "Настройки сохранены в демо-режиме. В реальной системе данные будут записаны в базу и отражены на витрине.",
    emptyTitle: "Настройки пока не подключены к реальной системе",
    emptyText:
      "Эта форма сейчас является подготовкой интерфейса. Данные компании, видимость портала и настройки документов будут сохраняться после подключения базы данных.",
    nextTitle: "Следующий этап",
    nextText:
      "Загрузка логотипа, управление филиалами, рабочие часы, зоны доставки, роли пользователей и уведомления будут подключены позже.",
  },
  ka: {
    home: "მთავარი",
    dashboard: "პანელი",
    storeFront: "მაღაზიის ვიტრინა",
    eyebrow: "კომპანიის პარამეტრები",
    title: "კომპანიის, ფილიალისა და პორტალის პარამეტრები",
    description:
      "მართეთ მაღაზიის ინფორმაცია, საკონტაქტო არხები, მდებარეობა და HBS კლიენტის პორტალში გამოჩენა.",
    cleanTitle: "რეალური კომპანიის მონაცემების მოლოდინი",
    cleanText:
      "ამ ეკრანზე არ ჩანს ყალბი კომპანია, მისამართი, ტელეფონი ან არარეალური პარამეტრი. ინფორმაცია მაღაზიის მიერ შეყვანის შემდეგ შეინახება.",
    companyTitle: "კომპანიის ინფორმაცია",
    companyName: "კომპანიის სახელი",
    companyNamePlaceholder: "შეიყვანეთ კომპანიის სახელი",
    officialTitle: "ოფიციალური კომპანიის სახელი",
    officialTitlePlaceholder: "ოფიციალური რეგისტრირებული სახელი",
    taxNumber: "საგადასახადო / რეგისტრაციის ნომერი",
    taxNumberPlaceholder: "რეგისტრაციის ნომერი თუ არსებობს",
    sector: "სექტორი",
    sectorPlaceholder: "მაგ: ავტონაწილები, სერვისი, სილამაზე, ქირაობა",
    descriptionLabel: "კომპანიის აღწერა",
    descriptionPlaceholder: "მოკლე აღწერა, რომელსაც კლიენტები ნახავენ",
    contactTitle: "კონტაქტი და მდებარეობა",
    country: "ქვეყანა",
    phone: "ტელეფონი",
    phonePlaceholder: "+995...",
    whatsapp: "WhatsApp ხაზი",
    whatsappPlaceholder: "+995...",
    email: "ელფოსტა",
    emailPlaceholder: "example@company.com",
    city: "ქალაქი",
    cityPlaceholder: "შეიყვანეთ ქალაქი",
    address: "მისამართი / უბანი",
    addressPlaceholder: "მისამართი ან უბანი",
    googleMap: "Google Maps მდებარეობა",
    googleMapPlaceholder: "Google Maps ბმული",
    portalTitle: "კლიენტის პორტალის პარამეტრები",
    portalVisibility: "პორტალში ხილვადობა",
    visible: "კლიენტის პორტალში ხილული",
    hidden: "ჯერ დამალული",
    priceVisibility: "ფასის ხილვადობა",
    showPrices: "ფასების ჩვენება",
    requestOnly: "მხოლოდ შეთავაზების მოთხოვნები",
    allowOrders: "კლიენტს შეუძლია შეკვეთა",
    blockOrders: "შეკვეთები დახურულია, მხოლოდ მოთხოვნები",
    allowMessages: "HBS შეტყობინებები ჩართულია",
    blockMessages: "HBS შეტყობინებები გამორთულია",
    allowWhatsapp: "WhatsApp ღილაკი ჩართულია",
    blockWhatsapp: "WhatsApp ღილაკი გამორთულია",
    documentTitle: "ენა, ვალუტა და დოკუმენტები",
    defaultLanguage: "ნაგულისხმევი ენა",
    defaultCurrency: "ნაგულისხმევი ვალუტა",
    documentLanguage: "დოკუმენტის ენა",
    customerLanguage: "კლიენტის სასურველი ენა",
    storeLanguage: "მაღაზიის ნაგულისხმევი ენა",
    save: "პარამეტრების შენახვა",
    saved:
      "პარამეტრები დემო რეჟიმში შეინახა. რეალურ სისტემაში მონაცემები ბაზაში ჩაიწერება და ვიტრინაში აისახება.",
    emptyTitle: "პარამეტრები რეალურ სისტემას ჯერ არ უკავშირდება",
    emptyText:
      "ეს ფორმა ამჟამად ინტერფეისის მომზადებაა. კომპანიის ინფორმაცია, პორტალის ხილვადობა და დოკუმენტის პარამეტრები ბაზის ჩართვის შემდეგ შეინახება.",
    nextTitle: "შემდეგი ეტაპი",
    nextText:
      "ლოგოს ატვირთვა, ფილიალების მართვა, სამუშაო საათები, მიწოდების ზონები, მომხმარებლის როლები და შეტყობინებები მოგვიანებით დაემატება.",
  },
  de: {
    home: "Startseite",
    dashboard: "Panel",
    storeFront: "Shop-Schaufenster",
    eyebrow: "FIRMENEINSTELLUNGEN",
    title: "Firma, Filiale und Portal einstellen",
    description:
      "Verwalten Sie Geschäftsdaten, Kontaktkanäle, Standortdetails und die Anzeige im HBS-Kundenportal.",
    cleanTitle: "Warten auf echte Firmendaten",
    cleanText:
      "Auf diesem Bildschirm werden keine fiktive Firma, Adresse, Telefonnummer oder unrealistische Einstellungen angezeigt. Informationen werden gespeichert, wenn sie vom Geschäft eingegeben werden.",
    companyTitle: "Firmeninformationen",
    companyName: "Firmenname",
    companyNamePlaceholder: "Firmennamen eingeben",
    officialTitle: "Offizieller Firmenname",
    officialTitlePlaceholder: "Offizieller registrierter Name",
    taxNumber: "Steuer- / Registrierungsnummer",
    taxNumberPlaceholder: "Registrierungsnummer, falls vorhanden",
    sector: "Branche",
    sectorPlaceholder: "Beispiel: Autoteile, Service, Schönheit, Vermietung",
    descriptionLabel: "Firmenbeschreibung",
    descriptionPlaceholder: "Kurze Beschreibung, die Kunden sehen werden",
    contactTitle: "Kontakt und Standort",
    country: "Land",
    phone: "Telefon",
    phonePlaceholder: "+995...",
    whatsapp: "WhatsApp-Leitung",
    whatsappPlaceholder: "+995...",
    email: "E-Mail",
    emailPlaceholder: "example@company.com",
    city: "Stadt",
    cityPlaceholder: "Stadt eingeben",
    address: "Adresse / Gebiet",
    addressPlaceholder: "Adresse oder Gebiet",
    googleMap: "Google-Maps-Standort",
    googleMapPlaceholder: "Google-Maps-Link",
    portalTitle: "Kundenportal-Einstellungen",
    portalVisibility: "Portal-Sichtbarkeit",
    visible: "Im Kundenportal sichtbar",
    hidden: "Vorerst verborgen",
    priceVisibility: "Preissichtbarkeit",
    showPrices: "Preise anzeigen",
    requestOnly: "Nur Angebotsanfragen erhalten",
    allowOrders: "Kundenbestellungen erlauben",
    blockOrders: "Bestellungen aus, nur Anfragen",
    allowMessages: "HBS-Nachrichten aktiv",
    blockMessages: "HBS-Nachrichten aus",
    allowWhatsapp: "WhatsApp-Button aktiv",
    blockWhatsapp: "WhatsApp-Button aus",
    documentTitle: "Sprache, Währung und Dokumente",
    defaultLanguage: "Standardsprache",
    defaultCurrency: "Standardwährung",
    documentLanguage: "Dokumentsprache",
    customerLanguage: "Bevorzugte Kundensprache",
    storeLanguage: "Standardsprache des Geschäfts",
    save: "Einstellungen speichern",
    saved:
      "Einstellungen wurden im Demo-Modus gespeichert. Im echten System werden diese Daten in die Datenbank geschrieben und im Schaufenster angezeigt.",
    emptyTitle: "Einstellungen sind noch nicht mit dem echten System verbunden",
    emptyText:
      "Dieses Formular ist derzeit Interface-Vorbereitung. Firmendaten, Portalsichtbarkeit und Dokumenteinstellungen werden nach Datenbankanbindung dauerhaft gespeichert.",
    nextTitle: "Nächste Stufe",
    nextText:
      "Logo-Upload, Filialverwaltung, Arbeitszeiten, Lieferzonen, Benutzerrollen und Benachrichtigungen werden später verbunden.",
  },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return (
    value === "tr" ||
    value === "en" ||
    value === "ru" ||
    value === "ka" ||
    value === "de"
  );
}

export default function SettingsPage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [companyName, setCompanyName] = useState("Ferro Motors");
  const [officialTitle, setOfficialTitle] = useState("Ferro Motors LLC");
  const [taxNumber, setTaxNumber] = useState("");
  const [sector, setSector] = useState("Oto Yedek Parça");
  const [description, setDescription] = useState(
    "Oto yedek parça, filtre, buji, fren ve motor parçaları satışı."
  );
  const [country, setCountry] = useState<CountryCode>("GE");
  const [phone, setPhone] = useState("+995 555 000 001");
  const [whatsapp, setWhatsapp] = useState("+995 555 000 001");
  const [email, setEmail] = useState("info@ferromotors.ge");
  const [city, setCity] = useState("Batumi");
  const [address, setAddress] = useState("Batumi Merkez");
  const [googleMap, setGoogleMap] = useState("");
  const [portalVisible, setPortalVisible] = useState(true);
  const [showPrices, setShowPrices] = useState(false);
  const [allowOrders, setAllowOrders] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [allowWhatsapp, setAllowWhatsapp] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
  }, []);

  if (!language) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  const currentText = texts[language];

  function saveSettings() {
    console.log("HBS mağaza ayarları:", {
      companyName,
      officialTitle,
      taxNumber,
      sector,
      description,
      country,
      phone,
      whatsapp,
      email,
      city,
      address,
      googleMap,
      portalVisible,
      showPrices,
      allowOrders,
      allowMessages,
      allowWhatsapp,
    });

    setMessage(currentText.saved);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-black tracking-wide">
            HBS
          </Link>

          <div className="flex items-center gap-3">
            <CompactLanguageSwitcher />

            <Link
              href="/store/ferro-motors"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {currentText.storeFront}
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {currentText.dashboard}
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {currentText.home}
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                {currentText.eyebrow}
              </p>

              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                {currentText.title}
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                {currentText.description}
              </p>
            </div>

            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
              <h2 className="text-lg font-black text-amber-100">
                {currentText.cleanTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-amber-100/90">
                {currentText.cleanText}
              </p>
            </div>
          </div>
        </section>

        {message && (
          <div className="mb-6 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5 text-sm leading-6 text-blue-100">
            {message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <h2 className="text-2xl font-black">{currentText.companyTitle}</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <InputBlock
                label={currentText.companyName}
                value={companyName}
                onChange={setCompanyName}
                placeholder={currentText.companyNamePlaceholder}
              />

              <InputBlock
                label={currentText.officialTitle}
                value={officialTitle}
                onChange={setOfficialTitle}
                placeholder={currentText.officialTitlePlaceholder}
              />

              <InputBlock
                label={currentText.taxNumber}
                value={taxNumber}
                onChange={setTaxNumber}
                placeholder={currentText.taxNumberPlaceholder}
              />

              <InputBlock
                label={currentText.sector}
                value={sector}
                onChange={setSector}
                placeholder={currentText.sectorPlaceholder}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  {currentText.descriptionLabel}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={currentText.descriptionPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                />
              </div>
            </div>

            <h2 className="mt-8 text-2xl font-black">
              {currentText.contactTitle}
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <CountrySelect
                value={country}
                onChange={setCountry}
                label={currentText.country}
                required
              />

              <InputBlock
                label={currentText.city}
                value={city}
                onChange={setCity}
                placeholder={currentText.cityPlaceholder}
              />

              <InputBlock
                label={currentText.phone}
                value={phone}
                onChange={setPhone}
                placeholder={currentText.phonePlaceholder}
              />

              <InputBlock
                label={currentText.whatsapp}
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder={currentText.whatsappPlaceholder}
              />

              <InputBlock
                label={currentText.email}
                value={email}
                onChange={setEmail}
                placeholder={currentText.emailPlaceholder}
              />

              <InputBlock
                label={currentText.googleMap}
                value={googleMap}
                onChange={setGoogleMap}
                placeholder={currentText.googleMapPlaceholder}
              />

              <div className="md:col-span-2">
                <InputBlock
                  label={currentText.address}
                  value={address}
                  onChange={setAddress}
                  placeholder={currentText.addressPlaceholder}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
              <h2 className="text-2xl font-black">{currentText.portalTitle}</h2>

              <div className="mt-6 grid gap-3">
                <ToggleButton
                  active={portalVisible}
                  onClick={() => setPortalVisible(true)}
                  label={currentText.visible}
                />

                <ToggleButton
                  active={!portalVisible}
                  onClick={() => setPortalVisible(false)}
                  label={currentText.hidden}
                />

                <ToggleButton
                  active={showPrices}
                  onClick={() => setShowPrices(true)}
                  label={currentText.showPrices}
                />

                <ToggleButton
                  active={!showPrices}
                  onClick={() => setShowPrices(false)}
                  label={currentText.requestOnly}
                />

                <ToggleButton
                  active={allowOrders}
                  onClick={() => setAllowOrders(!allowOrders)}
                  label={
                    allowOrders ? currentText.allowOrders : currentText.blockOrders
                  }
                />

                <ToggleButton
                  active={allowMessages}
                  onClick={() => setAllowMessages(!allowMessages)}
                  label={
                    allowMessages
                      ? currentText.allowMessages
                      : currentText.blockMessages
                  }
                />

                <ToggleButton
                  active={allowWhatsapp}
                  onClick={() => setAllowWhatsapp(!allowWhatsapp)}
                  label={
                    allowWhatsapp
                      ? currentText.allowWhatsapp
                      : currentText.blockWhatsapp
                  }
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
              <h2 className="text-2xl font-black">{currentText.documentTitle}</h2>

              <div className="mt-6 space-y-5">
                <select className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white">
                  <option>Türkçe</option>
                  <option>English</option>
                  <option>Русский</option>
                  <option>ქართული</option>
                  <option>Deutsch</option>
                </select>

                <select className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white">
                  <option>GEL</option>
                  <option>TRY</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>RUB</option>
                </select>

                <select className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white">
                  <option>{currentText.customerLanguage}</option>
                  <option>{currentText.storeLanguage}</option>
                </select>

                <button
                  type="button"
                  onClick={saveSettings}
                  className="w-full rounded-2xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-200"
                >
                  {currentText.save}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-400/20 bg-blue-400/10 p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-blue-100">
                {currentText.nextTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100/90">
                {currentText.nextText}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputBlock({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-5 py-3 text-left font-black transition ${
        active
          ? "bg-emerald-400 text-slate-950"
          : "border border-white/10 text-white hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}