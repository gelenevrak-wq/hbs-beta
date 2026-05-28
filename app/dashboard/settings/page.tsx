"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
    cleanTitle: "Gerçek veri yönetimi",
    cleanText:
      "Bu sayfadaki ayarlar LocalStorage üzerinde kalıcı olarak kaydedilir ve HBS Mağaza Vitrini ile dinamik olarak senkronize edilir.",
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
    saved: "Firma ayarlarınız LocalStorage üzerine başarıyla kaydedildi! Kurulum adımları güncellendi.",
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
    cleanTitle: "Real data management",
    cleanText:
      "Settings on this page are saved permanently in LocalStorage and dynamically synchronized with the HBS storefront.",
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
    saved: "Company settings have been saved to LocalStorage! Onboarding steps updated.",
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
    cleanTitle: "Управление реальными данными",
    cleanText:
      "Настройки на этой странице сохраняются в LocalStorage и динамически синхронизируются с витриной HBS.",
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
    saved: "Настройки компании успешно сохранены в LocalStorage!",
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
    cleanTitle: "რეალური მონაცემების მართვა",
    cleanText:
      "პარამეტრები ამ გვერდზე სამუდამოდ ინახება LocalStorage-ში და დინამიურად სინქრონიზდება HBS ვიტრინასთან.",
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
    customerLanguage: "კლიენტისთვის სასურველი ენა",
    storeLanguage: "მაღაზიის ნაგულისხმევი ენა",
    save: "პარამეტრების შენახვა",
    saved: "კომპანიის პარამეტრები წარმატებით შეინახა LocalStorage-ში!",
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
    cleanTitle: "Echte Datenverwaltung",
    cleanText:
      "Einstellungen auf dieser Seite werden dauerhaft in LocalStorage gespeichert und dynamisch mit dem HBS-Schaufenster synchronisiert.",
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
    saved: "Firmeneinstellungen wurden in LocalStorage gespeichert!",
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
  const [companyName, setCompanyName] = useState("OBDTR Diagnostics");
  const [officialTitle, setOfficialTitle] = useState("OBDTR Diagnostics LLC");
  const [taxNumber, setTaxNumber] = useState("");
  const [sector, setSector] = useState("Oto Yedek Parça");
  const [description, setDescription] = useState(
    "Oto yedek parça, filtre, buji, fren ve motor parçaları satışı."
  );
  const [country, setCountry] = useState<CountryCode>("GE");
  const [phone, setPhone] = useState("+995 555 000 001");
  const [whatsapp, setWhatsapp] = useState("+995 555 000 001");
  const [email, setEmail] = useState("info@obdtr.ge");
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

    try {
      const savedSettingsStr = window.localStorage.getItem("hbs-company-settings");
      if (savedSettingsStr) {
        const s = JSON.parse(savedSettingsStr);
        if (s.companyName) setCompanyName(s.companyName);
        if (s.officialTitle) setOfficialTitle(s.officialTitle);
        if (s.taxNumber) setTaxNumber(s.taxNumber);
        if (s.sector) setSector(s.sector);
        if (s.description) setDescription(s.description);
        if (s.country) setCountry(s.country);
        if (s.city) setCity(s.city);
        if (s.phone) setPhone(s.phone);
        if (s.whatsapp) setWhatsapp(s.whatsapp);
        if (s.email) setEmail(s.email);
        if (s.googleMap) setGoogleMap(s.googleMap);
        if (s.address) setAddress(s.address);
        if (s.portalVisible !== undefined) setPortalVisible(s.portalVisible);
        if (s.showPrices !== undefined) setShowPrices(s.showPrices);
        if (s.allowOrders !== undefined) setAllowOrders(s.allowOrders);
        if (s.allowMessages !== undefined) setAllowMessages(s.allowMessages);
        if (s.allowWhatsapp !== undefined) setAllowWhatsapp(s.allowWhatsapp);
      } else {
        const storesStr = window.localStorage.getItem("hbs-registered-stores");
        if (storesStr) {
          const stores = JSON.parse(storesStr);
          const obdtr = stores.find((st: any) => st.code === "obdtr");
          if (obdtr) {
            setCompanyName(obdtr.name);
            setOfficialTitle(obdtr.name + " LLC");
            setEmail(obdtr.email);
            setPhone(obdtr.phone || "+995 555 000 001");
            setWhatsapp(obdtr.phone || "+995 555 000 001");
          }
        }
      }
    } catch (e) {
      console.error("Load settings error:", e);
    }
  }, []);

  if (!language) {
    return <main className="min-h-screen bg-slate-900" />;
  }

  const currentText = texts[language];

  function saveSettings() {
    const settingsData = {
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
    };

    try {
      window.localStorage.setItem("hbs-company-settings", JSON.stringify(settingsData));

      // Sync settings to active stores
      const storesStr = window.localStorage.getItem("hbs-registered-stores");
      if (storesStr) {
        const stores = JSON.parse(storesStr);
        const updatedStores = stores.map((s: any) => {
          if (s.code === "obdtr") {
            return {
              ...s,
              name: companyName,
              email: email,
              phone: phone,
              representative: officialTitle,
            };
          }
          return s;
        });
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      }

      setMessage(currentText.saved);
      // Auto clear alert
      setTimeout(() => setMessage(""), 5000);
    } catch (e) {
      console.error("Save settings error:", e);
      setMessage("Ayarlar kaydedilirken bir hata oluştu.");
    }
  }

  return (
    <DashboardLayout activeMenu="Firma Ayarları">
      <section className="space-y-4">
        {/* Main Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
            {currentText.eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-800">
            {currentText.title}
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            {currentText.description}
          </p>
        </div>

        {/* Banners */}
        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-black text-emerald-800 shadow-sm animate-fadeIn">
            ✓ {message}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Form Side */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-black text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                🏢 {currentText.companyTitle}
              </h2>

              <div className="grid gap-3.5 sm:grid-cols-2">
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

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    {currentText.descriptionLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={currentText.descriptionPlaceholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-black text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                📍 {currentText.contactTitle}
              </h2>

              <div className="grid gap-3.5 sm:grid-cols-2">
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

                <div className="sm:col-span-2">
                  <InputBlock
                    label={currentText.address}
                    value={address}
                    onChange={setAddress}
                    placeholder={currentText.addressPlaceholder}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Options & Actions */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                ⚙️ {currentText.portalTitle}
              </h2>

              <div className="grid gap-2">
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

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                🌐 {currentText.documentTitle}
              </h2>

              <div className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {currentText.defaultLanguage}
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition">
                    <option>Türkçe</option>
                    <option>English</option>
                    <option>Русский</option>
                    <option>ქართული</option>
                    <option>Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {currentText.defaultCurrency}
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition">
                    <option>GEL</option>
                    <option>TRY</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>RUB</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {currentText.documentLanguage}
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition">
                    <option>{currentText.customerLanguage}</option>
                    <option>{currentText.storeLanguage}</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={saveSettings}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-750 text-white font-extrabold text-xs py-3 px-4 shadow-md shadow-blue-500/10 active:scale-95 transition"
                >
                  💾 {currentText.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
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
      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition"
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
      className={`rounded-xl px-4 py-2.5 text-left text-xs font-bold transition flex items-center justify-between ${
        active
          ? "bg-emerald-50 border border-emerald-300 text-emerald-950 font-black"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span>{label}</span>
      {active && <span className="text-emerald-600 text-xs">✓</span>}
    </button>
  );
}