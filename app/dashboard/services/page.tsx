"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { demoServiceCatalog, pricingRules } from "@/lib/businessModels";

const translations = {
  tr: {
    activeMenu: "Hizmet / Takvim",
    eyebrow: "Hizmet satışı & takvim",
    title: "Hizmet, yerinde servis, randevu ve zaman slotu yönetimi",
    description: "Hizmet satan işletmelerde stok adedi yerine süre, personel, servis bölgesi, kapasite, ekipman ve boş takvim önemlidir. Elektrikçi, tesisatçı, özel ders, nakliye, VIP transfer, kuaför, lokanta ve danışmanlık gibi işletmeler müşteri karşısına uygun zaman, lokasyon ve fiyat kuralı ile çıkar.",
    saveCalendarBtn: "Zaman Planını & Kapasiteyi Kaydet",
    calendarConfigured: "✓ Takvim Yapılandırıldı",
    calendarTitle: "📅 Zaman Planı ve Takvim Kuralları",
    calendarDesc: "Personel çalışma saatleri ve hizmet slotu kurallarını onaylayarak 6. adımı tamamlayın.",
    successCalendar: "Zaman planı, takvim kuralları ve personel kapasitesi başarıyla kaydedildi! Kurulum adımlarınız güncellendi.",
    successServiceAdded: '"{name}" isimli yeni hizmet kataloğa başarıyla eklendi!',
    catalogTitle: "🛠️ Hizmet Kataloğu & İşlemler",
    addNewServiceBtn: "+ Yeni Hizmet Ekle",
    visibleInStorefront: "Vitrinde Gösteriliyor",
    durationLabel: "Süre",
    capacityLabel: "Kapasite",
    staffLabel: "Uzman",
    priceLabel: "Fiyat",
    pricingRulesTitle: "🏷️ Fiyatlandırma Kuralları",
    staffAvailabilityTitle: "👥 Personel Uygunluğu",
    footerAlert: "📢 Müşteriye gösterilecek takvimde yalnızca müsait slotlar görünür. Mağaza panelinde ise personel, ekipman, kapasite, lokasyon ve hizmet süresine göre çakışma kontrolü yapılır.",
    modalTitle: "➕ Yeni Hizmet / İşlem Ekle",
    modalServiceName: "Hizmet / İşlem Adı",
    modalServiceNamePlaceholder: "Örn: Toyota Corolla 10.000 KM Bakımı",
    modalCategory: "Kategori",
    modalDuration: "Süre",
    modalDurationPlaceholder: "Örn: 45 dk",
    modalCapacity: "Kapasite",
    modalCapacityPlaceholder: "Örn: 1 Araç / Seans",
    modalStaff: "Sorumlu Personel / Ekip",
    modalStaffPlaceholder: "Örn: Altan Cancı",
    modalPriceRule: "Fiyat / Ücret Kuralı",
    modalPriceRulePlaceholder: "Örn: 150 GEL veya Teklif usulü",
    modalSlots: "Müsait Zaman Slotları (Virgülle ayırın)",
    modalSlotsPlaceholder: "Örn: Bugün 14:00, Yarın 11:30",
    cancelBtn: "İptal",
    submitBtn: "Hizmeti Kataloğa Ekle",
  },
  en: {
    activeMenu: "Service / Calendar",
    eyebrow: "Service Sale & Calendar",
    title: "Service, On-Site Service, Appointment & Time Slot Management",
    description: "In service-based businesses, instead of stock quantity, duration, personnel, service region, capacity, equipment, and free calendar are important. Businesses like electricians, plumbers, private tutoring, logistics, VIP transfers, hairdressers, restaurants, and consulting serve clients with suitable time, location, and pricing rules.",
    saveCalendarBtn: "Save Schedule & Capacity",
    calendarConfigured: "✓ Calendar Configured",
    calendarTitle: "📅 Schedule & Calendar Rules",
    calendarDesc: "Approve staff working hours and service slot rules to complete step 6.",
    successCalendar: "Schedule, calendar rules, and staff capacity saved successfully! Your setup steps have been updated.",
    successServiceAdded: 'New service "{name}" has been successfully added to the catalog!',
    catalogTitle: "🛠️ Service Catalog & Actions",
    addNewServiceBtn: "+ Add New Service",
    visibleInStorefront: "Visible in Storefront",
    durationLabel: "Duration",
    capacityLabel: "Capacity",
    staffLabel: "Specialist",
    priceLabel: "Price",
    pricingRulesTitle: "🏷️ Pricing Rules",
    staffAvailabilityTitle: "👥 Staff Availability",
    footerAlert: "📢 In the calendar shown to the customer, only available slots are visible. In the store panel, conflict checks are performed based on personnel, equipment, capacity, location, and service duration.",
    modalTitle: "➕ Add New Service / Action",
    modalServiceName: "Service / Action Name",
    modalServiceNamePlaceholder: "E.g., Toyota Corolla 10,000 KM Maintenance",
    modalCategory: "Category",
    modalDuration: "Duration",
    modalDurationPlaceholder: "E.g., 45 min",
    modalCapacity: "Capacity",
    modalCapacityPlaceholder: "E.g., 1 Vehicle / Session",
    modalStaff: "Responsible Staff / Team",
    modalStaffPlaceholder: "E.g., Altan Canci",
    modalPriceRule: "Price / Fee Rule",
    modalPriceRulePlaceholder: "E.g., 150 GEL or Quote-based",
    modalSlots: "Available Time Slots (Comma-separated)",
    modalSlotsPlaceholder: "E.g., Today 14:00, Tomorrow 11:30",
    cancelBtn: "Cancel",
    submitBtn: "Add Service to Catalog",
  },
  de: {
    activeMenu: "Service / Kalender",
    eyebrow: "Dienstleistungsverkauf & Kalender",
    title: "Dienstleistung, Vor-Ort-Service, Termin- & Zeitfenster-Verwaltung",
    description: "Bei dienstleistungsorientierten Unternehmen sind anstelle des Lagerbestands Dauer, Personal, Servicebereich, Kapazität, Ausrüstung und freie Kalender wichtig. Branchen wie Elektriker, Klempner, Nachhilfe, Logistik, VIP-Transfers, Friseure, Restaurants und Beratung bedienen Kunden mit passenden Zeit-, Standort- und Preisregeln.",
    saveCalendarBtn: "Zeitplan & Kapazität speichern",
    calendarConfigured: "✓ Kalender konfiguriert",
    calendarTitle: "📅 Zeitplan & Kalenderregeln",
    calendarDesc: "Genehmigen Sie Mitarbeiterarbeitszeiten und Dienstleistungszeitfensterregeln, um Schritt 6 abzuschließen.",
    successCalendar: "Zeitplan, Kalenderregeln und Personalkapazität erfolgreich gespeichert! Ihre Einrichtungsschritte wurden aktualisiert.",
    successServiceAdded: 'Neue Dienstleistung "{name}" wurde erfolgreich zum Katalog hinzugefügt!',
    catalogTitle: "🛠️ Dienstleistungskatalog & Aktionen",
    addNewServiceBtn: "+ Neue Dienstleistung hinzufügen",
    visibleInStorefront: "Im Schaufenster sichtbar",
    durationLabel: "Dauer",
    capacityLabel: "Kapazität",
    staffLabel: "Spezialist",
    priceLabel: "Preis",
    pricingRulesTitle: "🏷️ Preisregeln",
    staffAvailabilityTitle: "👥 Verfügbarkeit des Personals",
    footerAlert: "📢 Im dem Kunden angezeigten Kalender sind nur freie Zeitfenster sichtbar. Im Shop-Panel werden Konfliktprüfungen basierend auf Personal, Ausrüstung, Kapazität, Standort und Service-Dauer durchgeführt.",
    modalTitle: "➕ Neue Dienstleistung / Aktion hinzufügen",
    modalServiceName: "Name der Dienstleistung / Aktion",
    modalServiceNamePlaceholder: "Z.B. Toyota Corolla 10.000 KM Wartung",
    modalCategory: "Kategorie",
    modalDuration: "Dauer",
    modalDurationPlaceholder: "Z.B. 45 Min.",
    modalCapacity: "Kapazität",
    modalCapacityPlaceholder: "Z.B. 1 Fahrzeug / Sitzung",
    modalStaff: "Verantwortliches Personal / Team",
    modalStaffPlaceholder: "Z.B. Altan Canci",
    modalPriceRule: "Preis / Gebührenregel",
    modalPriceRulePlaceholder: "Z.B. 150 GEL oder Angebotsbasiert",
    modalSlots: "Verfügbare Zeitfenster (durch Komma getrennt)",
    modalSlotsPlaceholder: "Z.B. Heute 14:00, Morgen 11:30",
    cancelBtn: "Abbrechen",
    submitBtn: "Dienstleistung zum Katalog hinzufügen",
  },
  ru: {
    activeMenu: "Услуги / Календарь",
    eyebrow: "Продажа услуг и календарь",
    title: "Управление услугами, выездным сервисом, записями и временными слотами",
    description: "В бизнесе, связанном с услугами, вместо количества товара важны продолжительность, персонал, зона обслуживания, вместимость, оборудование и свободный календарь. Такие предприятия, как электрики, сантехники, репетиторы, логистика, VIP-трансферы, парикмахеры, рестораны и консалтинг, обслуживают клиентов с подходящими правилами времени, места и цены.",
    saveCalendarBtn: "Сохранить расписание и вместимость",
    calendarConfigured: "✓ Календарь настроен",
    calendarTitle: "📅 Расписание и правила календаря",
    calendarDesc: "Утвердите рабочее время сотрудников и правила слотов услуг, чтобы завершить шаг 6.",
    successCalendar: "Расписание, правила календаря и вместимость персонала успешно сохранены! Шаги настройки обновлены.",
    successServiceAdded: 'Новая услуга "{name}" успешно добавлена в каталог!',
    catalogTitle: "🛠️ Каталог услуг и действия",
    addNewServiceBtn: "+ Добавить новую услугу",
    visibleInStorefront: "Отображается на витрине",
    durationLabel: "Длительность",
    capacityLabel: "Вместимость",
    staffLabel: "Специалист",
    priceLabel: "Цена",
    pricingRulesTitle: "🏷️ Правила ценообразования",
    staffAvailabilityTitle: "👥 Доступность персонала",
    footerAlert: "📢 В календаре, показываемом клиенту, видны только свободные слоты. В панели магазина проверка конфликтов выполняется на основе персонала, оборудования, вместимости, места и длительности услуги.",
    modalTitle: "➕ Добавить новую услугу / операцию",
    modalServiceName: "Название услуги / операции",
    modalServiceNamePlaceholder: "Напр.: Техническое обслуживание Toyota Corolla 10 000 км",
    modalCategory: "Категория",
    modalDuration: "Длительность",
    modalDurationPlaceholder: "Напр.: 45 мин",
    modalCapacity: "Вместимость",
    modalCapacityPlaceholder: "Напр.: 1 автомобиль / сеанс",
    modalStaff: "Ответственный сотрудник / команда",
    modalStaffPlaceholder: "Напр.: Алтан Джанджи",
    modalPriceRule: "Цена / тарифное правило",
    modalPriceRulePlaceholder: "Напр.: 150 GEL или на основе предложения",
    modalSlots: "Свободные временные слоты (через запятую)",
    modalSlotsPlaceholder: "Напр.: Сегодня 14:00, Завтра 11:30",
    cancelBtn: "Отмена",
    submitBtn: "Добавить услугу в каталог",
  },
  ka: {
    activeMenu: "სერვისი / კალენდარი",
    eyebrow: "სერვისის გაყიდვა და კალენდარი",
    title: "სერვისის, ადგილზე მომსახურების, შეხვედრებისა და დროის სლოტების მართვა",
    description: "სერვისზე ორიენტირებულ ბიზნესში, პროდუქტის მარაგის ნაცვლად, მნიშვნელოვანია ხანგრძლივობა, პერსონალი, მომსახურების რეგიონი, ტევადობა, აღჭურვილობა და თავისუფალი კალენდარი. ბიზნესები, როგორიცაა ელექტრიკოსი, სანტექნიკოსი, კერძო გაკვეთილები, ლოგისტიკა, VIP ტრანსფერები, პარიკმახერები, რესტორნები და კონსულტაცია, ემსახურებიან კლიენტებს შესაბამისი დროის, ადგილმდებარეობისა და ფასების წესებით.",
    saveCalendarBtn: "დროის გეგმისა და ტევადობის შენახვა",
    calendarConfigured: "✓ კალენდარი კონფიგურირებულია",
    calendarTitle: "📅 დროის გეგმა და კალენდრის წესები",
    calendarDesc: "დაადასტურეთ პერსონალის სამუშაო საათები და სერვისის სლოტის წესები მე-6 ნაბიჯის დასასრულებლად.",
    successCalendar: "დროის გეგმა, კალენდრის წესები და პერსონალის ტევადობა წარმატებით შეინახა! დაყენების ნაბიჯები განახლდა.",
    successServiceAdded: 'ახალი სერვისი "{name}" წარმატებით დაემატა კატალოგში!',
    catalogTitle: "🛠️ სერვისების კატალოგი და ოპერაციები",
    addNewServiceBtn: "+ ახალი სერვისის დამატება",
    visibleInStorefront: "ნაჩვენებია ვიტრინაზე",
    durationLabel: "ხანგრძლივობა",
    capacityLabel: "ტევადობა",
    staffLabel: "სპეციალისტი",
    priceLabel: "ფასი",
    pricingRulesTitle: "🏷️ ფასების წესები",
    staffAvailabilityTitle: "👥 პერსონალის ხელმისაწვდომობა",
    footerAlert: "📢 კლიენტისთვის ნაჩვენებ კალენდარში მხოლოდ ხელმისაწვდომი სლოტები გამოჩნდება. მაღაზიის პანელში კი კონფლიქტის შემოწმება ხდება პერსონალის, აღჭურვილობის, ტევადობის, ადგილმდებარეობისა და სერვისის ხანგრძლივობის მიხედვით.",
    modalTitle: "➕ ახალი სერვისის / ოპერაციის დამატება",
    modalServiceName: "სერვისის / ოპერაციის სახელი",
    modalServiceNamePlaceholder: "მაგ: Toyota Corolla 10 000 კმ ტექნიკური მომსახურება",
    modalCategory: "კატეგორია",
    modalDuration: "ხანგრძლივობა",
    modalDurationPlaceholder: "მაგ: 45 წთ",
    modalCapacity: "ტევადობა",
    modalCapacityPlaceholder: "მაგ: 1 მანქანა / სესია",
    modalStaff: "პასუხისმგებელი პერსონალი / გუნდი",
    modalStaffPlaceholder: "მაგ: ალტან ჯანჯი",
    modalPriceRule: "ფასის / ტარიფის წესი",
    modalPriceRulePlaceholder: "მაგ: 150 GEL ან შეთავაზებით",
    modalSlots: "ხელმისაწვდომი დროის სლოტები (გამოყავით მძიმით)",
    modalSlotsPlaceholder: "მაგ: დღეს 14:00, ხვალ 11:30",
    cancelBtn: "გაუქმება",
    submitBtn: "სერვისის კატალოგში დამატება",
  }
};

type CustomService = {
  name: string;
  category: string;
  duration: string;
  capacity: string;
  staff: string;
  pricing: string;
  nextSlots: string[];
};

export default function ServicesPage() {
  const [language, setLanguage] = useState("tr");
  const [services, setServices] = useState<CustomService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [calendarConfigured, setCalendarConfigured] = useState(false);

  // Form states for new service
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Yerinde hizmet");
  const [duration, setDuration] = useState("60 dk");
  const [capacity, setCapacity] = useState("1 adres");
  const [staffName, setStaffName] = useState("Altan Cancı");
  const [pricing, setPricing] = useState("Servis Ücreti");
  const [slotsStr, setSlotsStr] = useState("Yarın 10:00, Yarın 14:00, Pazar 11:00");

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem("hbs-language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      const savedServices = window.localStorage.getItem("hbs-services");
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
      setCalendarConfigured(window.localStorage.getItem("hbs-calendar-configured") === "true");
    } catch (e) {
      console.error(e);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;

  const staffList = [
    { 
      name: "Altan Cancı", 
      role: language === "en" ? "OBD specialist" : language === "de" ? "OBD-Spezialist" : language === "ru" ? "Специалист OBD" : language === "ka" ? "OBD სპეციალისტი" : "OBD uzmanı", 
      status: language === "en" ? "Available after 14:30 today" : language === "de" ? "Heute nach 14:30 Uhr verfügbar" : language === "ru" ? "Доступен сегодня после 14:30" : language === "ka" ? "ხელმისაწვდომია დღეს 14:30-ის შემდეგ" : "Bugün 14:30 sonrası uygun" 
    },
    { 
      name: "Teknisyen 2", 
      role: language === "en" ? "Assembly / service" : language === "de" ? "Montage / Service" : language === "ru" ? "Монтаж / сервис" : language === "ka" ? "მონტაჟი / სერვისი" : "Montaj / servis", 
      status: language === "en" ? "Available tomorrow" : language === "de" ? "Morgen verfügbar" : language === "ru" ? "Доступен завтра" : language === "ka" ? "ხელმისაწვდომია ხვალ" : "Yarın uygun" 
    },
    { 
      name: "Rehber / kaptan", 
      role: language === "en" ? "Tour operations" : language === "de" ? "Tour-Operationen" : language === "ru" ? "Туроператор" : language === "ka" ? "ტურის ოპერატორი" : "Tur operasyonu", 
      status: language === "en" ? "Busy on weekend" : language === "de" ? "Am Wochenende beschäftigt" : language === "ru" ? "Занят в выходные" : language === "ka" ? "დაკავებულია შაბათ-კვირას" : "Hafta sonu yoğun" 
    },
  ];

  const localizedPricingRules = [
    language === "en" ? "Fixed price" : language === "de" ? "Festpreis" : language === "ru" ? "Фиксированная цена" : language === "ka" ? "ფიქსირებული ფასი" : "Sabit fiyat",
    language === "en" ? "Hourly fee" : language === "de" ? "Stundensatz" : language === "ru" ? "Почасовая оплата" : language === "ka" ? "საათობრივი საფასური" : "Saatlik ücret",
    language === "en" ? "Daily rental" : language === "de" ? "Tagesmiete" : language === "ru" ? "Посуточная аренда" : language === "ka" ? "დღიური გაქირავება" : "Günlük kiralama",
    language === "en" ? "Price per person" : language === "de" ? "Preis pro Person" : language === "ru" ? "Цена за человека" : language === "ka" ? "ფასი ადამიანზე" : "Kişi başı fiyat",
    language === "en" ? "Price based on staff count" : language === "de" ? "Preis basierend auf Mitarbeiteranzahl" : language === "ru" ? "Цена на основе количества персонала" : language === "ka" ? "ფასი პერსონალის რაოდენობის მიხედვით" : "Personel sayısına göre fiyat",
    language === "en" ? "Price based on equipment use" : language === "de" ? "Preis basierend auf Gerätenutzung" : language === "ru" ? "Цена на основе использования оборудования" : language === "ka" ? "ფასი აღჭურვილობის გამოყენების მიხედვით" : "Ekipman kullanımına göre fiyat",
    language === "en" ? "Base fee + duration" : language === "de" ? "Grundgebühr + Dauer" : language === "ru" ? "Базовый тариф + длительность" : language === "ka" ? "საბაზისო საფასური + ხანგრძლივობა" : "Başlangıç ücreti + süre",
    language === "en" ? "Menu price / delivery price" : language === "de" ? "Menüpreis / Lieferpreis" : language === "ru" ? "Цена меню / цена доставки" : language === "ka" ? "მენიუს ფასი / მიტანის ფასი" : "Menü fiyatı / paket servis fiyatı",
    language === "en" ? "Price based on route and distance" : language === "de" ? "Preis basierend auf Route und Entfernung" : language === "ru" ? "Цена на основе маршрута и расстояния" : language === "ka" ? "ფასი მარშრუტისა და მანძილის მიხედვით" : "Güzergah ve mesafeye göre fiyat",
    language === "en" ? "Service zone + travel fee" : language === "de" ? "Servicebereich + Fahrtkosten" : language === "ru" ? "Зона обслуживания + дорожные расходы" : language === "ka" ? "მომსახურების ზონა + მგზავრობის საფასური" : "Servis bölgesi + yol ücreti",
    language === "en" ? "Online / on-site session price" : language === "de" ? "Online- / Vor-Ort-Sitzungspreis" : language === "ru" ? "Цена онлайн / очного сеанса" : language === "ka" ? "ონლაინ / ადგილზე სესიის ფასი" : "Online / yerinde seans fiyatı",
    language === "en" ? "Quote-based" : language === "de" ? "Angebotsbasiert" : language === "ru" ? "На основе предложения" : language === "ka" ? "შეთავაზებით" : "Teklif usulü",
  ];

  const industryChips = [
    language === "en" ? "On-site technical service: electrician, plumber, AC" : language === "de" ? "Technischer Vor-Ort-Service: Elektriker, Klempner, Klima" : language === "ru" ? "Техническое обслуживание на выезде: электрик, сантехник, кондиционер" : language === "ka" ? "ადგილზე ტექნიკური მომსახურება: ელექტრიკოსი, სანტექნიკოსი, კონდიციონერი" : "Yerinde teknik servis: elektrikçi, tesisatçı, klima",
    language === "en" ? "Education: private lessons, course, online classes" : language === "de" ? "Bildung: Nachhilfe, Kurs, Online-Unterricht" : language === "ru" ? "Обучение: частные уроки, курсы, онлайн-занятия" : language === "ka" ? "განათლება: კერძო გაკვეთილები, კურსი, ონლაინ გაკვეთილები" : "Eğitim: özel ders, kurs, online eğitimler",
    language === "en" ? "Logistics/transport: moving, VIP transfer" : language === "de" ? "Logistik/Transport: Umzug, VIP-Transfer" : language === "ru" ? "Логистика/транспорт: переезды, VIP-трансфер" : language === "ka" ? "ლოგისტიკა/ტრანსპორტირება: გადაზიდვა, VIP ტრანსფერი" : "Nakliye/ulaşım: evden eve, VIP transfer",
    language === "en" ? "F&B: menu, table reservation" : language === "de" ? "Gastronomie: Menü, Tischreservierung" : language === "ru" ? "Общепит: menu, table reservation" : language === "ka" ? "კვება: მენიუ, მაგიდის დაჯავშნა" : "Yeme içme: menü, masa rezervasyonu",
    language === "en" ? "Personal care: hairdresser, barber, massage" : language === "de" ? "Körperpflege: Friseur, Barbier, Massage" : language === "ru" ? "Личный уход: парикмахер, барбер, массаж" : language === "ka" ? "პირადი მოვლა: პარიკმახერი, ბარბერი, მასაჟი" : "Kişisel bakım: kuaför, berber, masaj",
    language === "en" ? "Auto service: brand-based appointment and parts" : language === "de" ? "Autoservice: markenbasierte Termine und Teile" : language === "ru" ? "Автосервис: запись на основе марки и запчастей" : language === "ka" ? "ავტოსერვისი: ბრენდზე დაფუძნებული შეხვედრები და ნაწილები" : "Oto servis: marka bazlı randevu ve parça",
    language === "en" ? "Consulting: legal, coaching, dietician" : language === "de" ? "Beratung: Recht, Coaching, Ernährungsberater" : language === "ru" ? "Консалтинг: юридический, коучинг, диетолог" : language === "ka" ? "კონსულტაცია: იურიდიული, ქოუჩინგი, დიეტოლოგი" : "Danışmanlık: hukuk, koçluk, diyetisyen",
    language === "en" ? "Tour/experience: boat tour, mountaineering" : language === "de" ? "Tour/Erlebnis: Bootstour, Bergsteigen" : language === "ru" ? "Тур/опыт: лодочный тур, альпинизм" : language === "ka" ? "ტური/გამოცდილება: ნავით ტური, ალპინიზმი" : "Tur/deneyim: tekne turu, dağcılık"
  ];

  function translateText(text: string) {
    if (language === "tr") return text;
    // Simple demo catalog mapper
    if (text.includes("Yerinde elektrikçi")) {
      return language === "en" ? "Call electrician / plumber on-site" : language === "de" ? "Elektriker / Klempner vor Ort rufen" : language === "ru" ? "Вызвать электрика / сантехника на дом" : "ადგილზე ელექტრიკოსის / სანტექნიკოსის გამოძახება";
    }
    if (text.includes("Özel ders")) {
      return language === "en" ? "Private tutoring - home or online" : language === "de" ? "Nachhilfe - zu Hause oder online" : language === "ru" ? "Частные уроки - дома или онлайн" : "კერძო გაკვეთილები - სახლში ან ონლაინ";
    }
    if (text.includes("Evden eve nakliye keşfi")) {
      return language === "en" ? "Home logistics inspection" : language === "de" ? "Umzugsinspektion" : language === "ru" ? "Оценка переезда" : "გადაზიდვის შეფასება";
    }
    if (text.includes("VIP taksi")) {
      return language === "en" ? "VIP taxi / minibus transfer" : language === "de" ? "VIP-Taxi / Minibus-Transfer" : language === "ru" ? "VIP такси / трансфер на минивэне" : "VIP ტაქსი / მიკროავტობუსით ტრანსფერი";
    }
    if (text.includes("Lokanta masa rezervasyonu")) {
      return language === "en" ? "Restaurant table reservation" : language === "de" ? "Restaurant-Tischreservierung" : language === "ru" ? "Бронирование столика в ресторане" : "რესტორნის მაგიდის დაჯავშნა";
    }
    if (text.includes("Hukuk / diyetisyen")) {
      return language === "en" ? "Legal / dietician / coaching consultation" : language === "de" ? "Rechts- / Ernährungs- / Coachingberatung" : language === "ru" ? "Юридическая / диетологическая консультация" : "იურიდიული / დიეტოლოგის კონსულტაცია";
    }
    if (text.includes("Oto servis arıza tespit")) {
      return language === "en" ? "Auto service diagnostics" : language === "de" ? "Autoservice-Fehlerdiagnose" : language === "ru" ? "Диагностика автосервиса" : "ავტოსერვისის დიაგნოსტიკა";
    }
    if (text.includes("Tekne turu")) {
      return language === "en" ? "Boat tour - Batumi coast route" : language === "de" ? "Bootstour - Batumi Küstenroute" : language === "ru" ? "Лодочный тур - побережье Батуми" : "ნავით ტური - ბათუმის სანაპირო";
    }
    if (text.includes("Hırdavat ekipman kiralama")) {
      return language === "en" ? "Hardware equipment rental" : language === "de" ? "Miete von Werkzeugen" : language === "ru" ? "Аренда строительного оборудования" : "სამშენებლო ინსტრუმენტების ქირაობა";
    }

    // Categories
    if (text === "Yerinde hizmet") return language === "en" ? "On-site service" : language === "de" ? "Vor-Ort-Service" : language === "ru" ? "Обслуживание на дому" : "ადგილზე მომსახურება";
    if (text === "Eğitim / yerinde hizmet") return language === "en" ? "Education / On-site" : language === "de" ? "Bildung / Vor-Ort" : language === "ru" ? "Обучение / На дому" : "განათლება / ადგილზე";
    if (text === "Nakliye") return language === "en" ? "Logistics" : language === "de" ? "Logistik" : language === "ru" ? "Логистика" : "ტრანსპორტირება";
    if (text === "Ulaşım") return language === "en" ? "Transportation" : language === "de" ? "Transport" : language === "ru" ? "Транспорт" : "ტრანსპორტი";
    if (text === "Yeme içme") return language === "en" ? "F&B" : language === "de" ? "Gastronomie" : language === "ru" ? "Общепит" : "კვება";
    if (text === "Danışmanlık") return language === "en" ? "Consulting" : language === "de" ? "Beratung" : language === "ru" ? "Консалтинг" : "კონსულტაცია";
    if (text === "Servis") return language === "en" ? "Service" : language === "de" ? "Service" : language === "ru" ? "Сервис" : "სერვისი";
    if (text === "Tur / deneyim") return language === "en" ? "Tour / Experience" : language === "de" ? "Tour / Erlebnis" : language === "ru" ? "Тур / Опыт" : "ტური / გამოცდილება";
    if (text === "Kiralama") return language === "en" ? "Rental" : language === "de" ? "Vermietung" : language === "ru" ? "Аренда" : "გაქირავება";

    // Staff
    if (text === "Usta / ekip") return language === "en" ? "Craftsman / Team" : language === "de" ? "Handwerker / Team" : language === "ru" ? "Мастер / Команда" : "ხელოსანი / გუნდი";
    if (text === "Öğretmen") return language === "en" ? "Tutor" : language === "de" ? "Lehrer" : language === "ru" ? "Преподаватель" : "მასწავლებელი";
    if (text === "Nakliye ekibi") return language === "en" ? "Logistics Crew" : language === "de" ? "Umzugsteam" : language === "ru" ? "Команда грузчиков" : "გადაზიდვის ჯგუფი";
    if (text === "Şoför") return language === "en" ? "Driver" : language === "de" ? "Fahrer" : language === "ru" ? "Водитель" : "მძღოლი";
    if (text === "Salon ekibi") return language === "en" ? "Waitstaff" : language === "de" ? "Servicepersonal" : language === "ru" ? "Персонал зала" : "დარბაზის გუნდი";
    if (text === "Uzman") return language === "en" ? "Specialist" : language === "de" ? "Experte" : language === "ru" ? "Специалист" : "სპეციალისტი";
    if (text === "1 teknisyen") return language === "en" ? "1 Technician" : language === "de" ? "1 Techniker" : language === "ru" ? "1 техник" : "1 ტექნიკოსი";
    if (text === "Kaptan + rehber") return language === "en" ? "Captain + Guide" : language === "de" ? "Kapitän + Guide" : language === "ru" ? "Капитан + гид" : "კაპიტანი + გიდი";
    if (text === "Teslim personeli") return language === "en" ? "Delivery Staff" : language === "de" ? "Lieferpersonal" : language === "ru" ? "Персонал выдачи" : "გადაცემის პერსონალი";

    // Pricing
    if (text === "Servis ücreti + işçilik + malzeme") return language === "en" ? "Service fee + labor + materials" : language === "de" ? "Servicegebühr + Arbeitszeit + Material" : language === "ru" ? "Плата за обслуживание + работа + материалы" : "მომსახursun საფასური + სამუშაო + მასალები";
    if (text === "Saatlik / paket ders") return language === "en" ? "Hourly / package lessons" : language === "de" ? "Stündlich / Paket" : language === "ru" ? "Почасово / пакет занятий" : "საათობრივი / პაკეტი";
    if (text === "Mesafe + kat + eşya hacmi") return language === "en" ? "Distance + floor + volume" : language === "de" ? "Entfernung + Etage + Volumen" : language === "ru" ? "Расстояние + этаж + объем" : "მანძილი + სართული + მოცულობა";
    if (text === "Mesafe + araç tipi") return language === "en" ? "Distance + vehicle type" : language === "de" ? "Entfernung + Fahrzeugtyp" : language === "ru" ? "Расстояние + тип транспорта" : "მანძილი + მანქანის ტიპი";
    if (text === "Menü / masa / paket servis") return language === "en" ? "Menu / table / takeaway" : language === "de" ? "Menü / Tisch / Lieferung" : language === "ru" ? "Меню / столик / доставка" : "მენიუ / მაგიდა / მიტანა";
    if (text === "Seans / paket") return language === "en" ? "Session / package" : language === "de" ? "Sitzung / Paket" : language === "ru" ? "Сеанс / пакет" : "სესია / პაკეტი";
    if (text === "Başlangıç ücreti + ek işlem") return language === "en" ? "Base fee + extra operations" : language === "de" ? "Grundgebühr + Zusatzarbeiten" : language === "ru" ? "Базовый тариф + доп. работы" : "საწყისი საფასური + დამატებითი ოპერაცია";
    if (text === "Kişi başı / özel tur") return language === "en" ? "Per person / private tour" : language === "de" ? "Pro Person / Privattour" : language === "ru" ? "С человека / частный тур" : "ადამიანზე / კერძო ტური";
    if (text === "Günlük + depozito") return language === "en" ? "Daily + deposit" : language === "de" ? "Täglich + Kaution" : language === "ru" ? "В день + депозит" : "დღიური + დეპოზიტი";

    // Duration / Slots
    if (text === "60-120 dk") return language === "en" ? "60-120 min" : language === "de" ? "60-120 Min." : language === "ru" ? "60-120 мин" : "60-120 წთ";
    if (text === "50 dk") return language === "en" ? "50 min" : language === "de" ? "50 Min." : language === "ru" ? "50 мин" : "50 წთ";
    if (text === "Randevulu keşif") return language === "en" ? "By appointment" : language === "de" ? "Mit Termin" : language === "ru" ? "Осмотр по записи" : "შეფასება შეხვედრით";
    if (text === "Saatlik / mesafe") return language === "en" ? "Hourly / distance" : language === "de" ? "Stündlich / Entfernung" : language === "ru" ? "Почасово / расстояние" : "საათობრივი / მანძილი";
    if (text === "Rezervasyon") return language === "en" ? "Reservation" : language === "de" ? "Reservierung" : language === "ru" ? "Бронирование" : "ჯავშანი";
    if (text === "30-60 dk") return language === "en" ? "30-60 min" : language === "de" ? "30-60 Min." : language === "ru" ? "30-60 мин" : "30-60 წთ";
    if (text === "45 dk") return language === "en" ? "45 min" : language === "de" ? "45 Min." : language === "ru" ? "45 мин" : "45 წთ";
    if (text === "2 saat") return language === "en" ? "2 hours" : language === "de" ? "2 Std." : language === "ru" ? "2 часа" : "2 საათი";
    if (text === "Günlük") return language === "en" ? "Daily" : language === "de" ? "Täglich" : language === "ru" ? "Посуточно" : "დღიური";

    if (text === "1 adres") return language === "en" ? "1 address" : language === "de" ? "1 Adresse" : language === "ru" ? "1 адрес" : "1 მისამართი";
    if (text === "1-4 öğrenci") return language === "en" ? "1-4 students" : language === "de" ? "1-4 Schüler" : language === "ru" ? "1-4 ученика" : "1-4 სტუდენტი";
    if (text === "Araç ve ekip seçilir") return language === "en" ? "Vehicle & crew selection" : language === "de" ? "Fahrzeug- & Teamauswahl" : language === "ru" ? "Выбор машины и команды" : "მანქანისა და ჯგუფის შერჩევა";
    if (text === "1-18 yolcu") return language === "en" ? "1-18 passengers" : language === "de" ? "1-18 Passagiere" : language === "ru" ? "1-18 пассажиров" : "1-18 მგზავრი";
    if (text === "Kişi sayısı") return language === "en" ? "Number of guests" : language === "de" ? "Gästeanzahl" : language === "ru" ? "Количество гостей" : "სტუმრების რაოდენობა";
    if (text === "1 kişi / aile") return language === "en" ? "1 person / family" : language === "de" ? "1 Person / Familie" : language === "ru" ? "1 человек / семья" : "1 ადამიანი / ოჯახი";
    if (text === "1 araç") return language === "en" ? "1 vehicle" : language === "de" ? "1 Fahrzeug" : language === "ru" ? "1 автомобиль" : "1 მანქანა";
    if (text === "12 kişi") return language === "en" ? "12 people" : language === "de" ? "12 Personen" : language === "ru" ? "12 человек" : "12 ადამიანი";
    if (text === "Stok adedi kadar") return language === "en" ? "Up to stock limit" : language === "de" ? "Bis zum Bestandsgrenze" : language === "ru" ? "В пределах остатков" : "მარაგის ლიმიტამდე";

    if (text.startsWith("Bugün")) {
      return text.replace("Bugün", language === "en" ? "Today" : language === "de" ? "Heute" : language === "ru" ? "Сегодня" : "დღეს");
    }
    if (text.startsWith("Yarın")) {
      return text.replace("Yarın", language === "en" ? "Tomorrow" : language === "de" ? "Morgen" : language === "ru" ? "Завтра" : "ხვალ");
    }
    if (text.startsWith("Pazar")) {
      return text.replace("Pazar", language === "en" ? "Sunday" : language === "de" ? "Sonntag" : language === "ru" ? "Воскресенье" : "კვირა");
    }
    if (text.startsWith("Cumartesi")) {
      return text.replace("Cumartesi", language === "en" ? "Saturday" : language === "de" ? "Samstag" : language === "ru" ? "Суббота" : "შაბათი");
    }
    if (text.startsWith("Cuma")) {
      return text.replace("Cuma", language === "en" ? "Friday" : language === "de" ? "Freitag" : language === "ru" ? "Пятница" : "პარასკევი");
    }
    if (text === "Bugün müsait") return language === "en" ? "Available today" : language === "de" ? "Heute verfügbar" : language === "ru" ? "Доступно сегодня" : "დღეს ხელმისაწვდომია";
    if (text === "Gece transfer") return language === "en" ? "Night transfer" : language === "de" ? "Nachttransfer" : language === "ru" ? "Ночной трансфер" : "ღამის ტრანსფერი";
    if (text === "Haftalık kiralama") return language === "en" ? "Weekly rental" : language === "de" ? "Wöchentliche Miete" : language === "ru" ? "Недельная аренда" : "ყოველკვირეული ქირაობა";
    if (text === "Online bugün") return language === "en" ? "Online today" : language === "de" ? "Online heute" : language === "ru" ? "Онлайн сегодня" : "ონლაინ დღეს";
    if (text === "Bugün teslim") return language === "en" ? "Delivery today" : language === "de" ? "Lieferung heute" : language === "ru" ? "Выдача сегодня" : "დღes gadacema";
    if (text === "Yarın teslim") return language === "en" ? "Delivery tomorrow" : language === "de" ? "Lieferung morgen" : language === "ru" ? "Выдача завтра" : "ხვal gadacema";

    return text;
  }

  const allServices = [...services, ...demoServiceCatalog];

  function handleSaveCalendar() {
    try {
      window.localStorage.setItem("hbs-calendar-configured", "true");
      setCalendarConfigured(true);
      setSuccessMsg(t.successCalendar);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (e) {
      console.error(e);
    }
  }

  function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const newService: CustomService = {
      name: name.trim(),
      category,
      duration,
      capacity,
      staff: staffName,
      pricing,
      nextSlots: slotsStr.split(",").map(s => s.trim()).filter(Boolean)
    };

    const updated = [newService, ...services];
    setServices(updated);
    try {
      window.localStorage.setItem("hbs-services", JSON.stringify(updated));
      setSuccessMsg(t.successServiceAdded.replace("{name}", name));
      setIsModalOpen(false);
      // Reset form
      setName("");
      setSlotsStr("Yarın 10:00, Yarın 14:00");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <DashboardLayout activeMenu={t.activeMenu}>
      <section className="space-y-4 text-slate-900">
        {/* Main Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{t.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-800">{t.title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            {t.description}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-black text-emerald-800 shadow-sm animate-fadeIn">
            ✓ {successMsg}
          </div>
        )}

        {/* Calendar and Capacity Configuration Action */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-800">{t.calendarTitle}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bold mt-1">{t.calendarDesc}</p>
          </div>
          <button
            onClick={handleSaveCalendar}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-md transition active:scale-95 whitespace-nowrap ${
              calendarConfigured 
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800 cursor-default"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {calendarConfigured ? t.calendarConfigured : t.saveCalendarBtn}
          </button>
        </div>

        {/* Industry Chips */}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          {industryChips.map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-extrabold text-slate-600 shadow-sm">{item}</div>
          ))}
        </div>

        {/* Dynamic Split */}
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Services Catalog */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-800">{t.catalogTitle}</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-black text-white active:scale-95 transition"
              >
                {t.addNewServiceBtn}
              </button>
            </div>
            
            <div className="grid gap-3">
              {allServices.map((service, idx) => (
                <article key={service.name + idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-800">{translateText(service.name)}</div>
                      <div className="mt-1 text-[10px] font-black uppercase text-blue-700">{translateText(service.category)}</div>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-black text-emerald-800">{t.visibleInStorefront}</span>
                  </div>
                  
                  <div className="mt-3.5 grid gap-2 text-xs text-slate-600 sm:grid-cols-4 bg-white p-2.5 rounded-lg border border-slate-100 font-bold">
                    <div>⏱️ <b>{t.durationLabel}:</b> {translateText(service.duration)}</div>
                    <div>👥 <b>{t.capacityLabel}:</b> {translateText(service.capacity)}</div>
                    <div>👤 <b>{t.staffLabel}:</b> {translateText(service.staff)}</div>
                    <div className="text-blue-700">💰 <b>{t.priceLabel}:</b> {translateText(service.pricing)}</div>
                  </div>
                  
                  {service.nextSlots && service.nextSlots.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {service.nextSlots.map((slot) => (
                        <span key={slot} className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">{translateText(slot)}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* Right Side Rules and Staff */}
          <div className="space-y-4">
            
            {/* Pricing Rules */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-800 pb-2 border-b border-slate-100 mb-3">{t.pricingRulesTitle}</h2>
              <div className="grid gap-2">
                {localizedPricingRules.map((rule) => (
                  <div key={rule} className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-600">{rule}</div>
                ))}
              </div>
            </div>

            {/* Staff Availability */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-800 pb-2 border-b border-slate-100 mb-3">{t.staffAvailabilityTitle}</h2>
              <div className="grid gap-3">
                {staffList.map((person) => (
                  <div key={person.name} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="text-xs font-black text-slate-800">{person.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{person.role}</div>
                    <div className="mt-2 text-[10px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      {person.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer info banner */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-6 text-blue-950 font-bold shadow-sm">
          {t.footerAlert}
        </div>
      </section>

      {/* New Service Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-slate-800">{t.modalTitle}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-600">{t.modalServiceName}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.modalServiceNamePlaceholder}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                  required />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.modalCategory}</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Yerinde hizmet">{language === "en" ? "On-site service" : language === "de" ? "Vor-Ort-Service" : language === "ru" ? "Обслуживание на дому" : "Yerinde hizmet"}</option>
                    <option value="Servis Tamir">{language === "en" ? "Service / Repair" : language === "de" ? "Service / Reparatur" : language === "ru" ? "Сервис / Ремонт" : "Servis / Tamir"}</option>
                    <option value="Eğitim">{language === "en" ? "Education" : language === "de" ? "Bildung" : language === "ru" ? "Обучение" : "Eğitim"}</option>
                    <option value="Danışmanlık">{language === "en" ? "Consulting" : language === "de" ? "Beratung" : language === "ru" ? "Консалтинг" : "Danışmanlık"}</option>
                    <option value="Yeme içme">{language === "en" ? "F&B" : language === "de" ? "Gastronomie" : language === "ru" ? "Общепит" : "Yeme içme"}</option>
                    <option value="Tur / Deneyim">{language === "en" ? "Tour / Experience" : language === "de" ? "Tour / Erlebnis" : language === "ru" ? "Tur / Deneyim" : "Tur / Deneyim"}</option>
                    <option value="Kiralama">{language === "en" ? "Rental" : language === "de" ? "Vermietung" : language === "ru" ? "Arenada" : "Kiralama"}</option>
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.modalDuration}</span>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder={t.modalDurationPlaceholder}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.modalCapacity}</span>
                  <input
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder={t.modalCapacityPlaceholder}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.modalStaff}</span>
                  <input
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder={t.modalStaffPlaceholder}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.modalPriceRule}</span>
                  <input
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    placeholder={t.modalPriceRulePlaceholder}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.modalSlots}</span>
                  <input
                    value={slotsStr}
                    onChange={(e) => setSlotsStr(e.target.value)}
                    placeholder={t.modalSlotsPlaceholder}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black hover:bg-slate-50"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-black text-white"
                >
                  {t.submitBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
