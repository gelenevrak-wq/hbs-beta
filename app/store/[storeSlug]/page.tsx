"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { HbsLanguageCode } from "@/lib/i18n/translations";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";
import { translateProductField } from "@/lib/i18n/dynamicContent";
import { sanitizeWhatsAppNumber } from "@/lib/phoneUtils";

type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  purchasePrice: string;
  salePrice: string;
  quantity: string;
  warehouse: string;
  shelf: string;
};

type ItemType = "product" | "service" | "rental" | "appointment";
type Visibility = "visible" | "hidden";
type PricingMode = "fixed" | "quote" | "bidding";

type ProductRecord = {
  id: string;
  itemType: ItemType;
  name: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  salePrice: string;
  purchasePrice: string;
  currency: string;
  barcode: string;
  qrCode: string;
  sku: string;
  oemCode: string;
  manufacturerCode: string;
  stockTracking: boolean;
  quantity: string;
  warehouse: string;
  shelf: string;
  entryDate: string;
  exitDate: string;
  pricingMode: PricingMode;
  visibility: Visibility;
  imageUrl: string;
  videoUrl: string;
  variants?: ProductVariant[];
};

type StoreType = "products" | "realEstate" | "salon" | "autoRepair";

// --- 5-LANGUAGE PREMIUM STOREFRONT DICTIONARY ---
const pageTranslations: Record<string, Record<string, string>> = {
  tr: {
    callStore: "Mağazayı Ara:",
    whatsappContact: "WhatsApp ile Ulaş",
    fillAllFields: "Lütfen tüm alanları doldurun.",
    simulatorTitle: "Sektörel Vitrin Arayüz Simülatörü",
    simulatorSubtitle: "HBS, tek tip pazar yeri değildir. İşletmenin türüne göre vitrin arayüzü saniyeler içinde şekillenir:",
    sectorProducts: "🧰 Ürün & Parça",
    sectorRealEstate: "🏢 Emlak / Portföy",
    sectorSalon: "💈 Kuaför / Hizmet",
    sectorAutoRepair: "🛠️ Oto Servis / Canlı Tamir",
    partsStorefrontTitle: "HBS PARÇA MAĞAZASI",
    virtualStoreDesc: "Fiziksel raf stoğu barındırmayan, sipariş üzerine ülke genelinde adrese kargo veya yerinde elden teslim, uzman ekiplerce yerinde kurulum ve teknik eğitim destekli dijital vitrindir.",
    physicalStoreDesc: "Oto yedek parça, diagnostik cihazları, motor yağları ve filtre gruplarının sergilendiği fiziksel depo ve raf entegrasyonlu katalog vitrinidir.",
    shippingLabel: "🚚 Ülke Çapında Kargo & Elden Teslim",
    trainingLabel: "🔧 Yerinde Kurulum & Teknik Eğitim Dahil",
    turkey: "Türkiye",
    georgia: "Gürcistan",
    catalogEmpty: "Mağaza Kataloğu Boş",
    catalogEmptySub: "Bu mağazada henüz sergilenen bir ürün bulunmamaktadır.",
    catalogEmptyAdminHint: "Mağaza yöneticisi olarak yönetim panelinizden ilk ürünlerinizi veya Excel şablonunuzu yükleyerek kataloğunuzu anında doldurabilirsiniz!",
    skuLabel: "Stok SKU:",
    barcodeLabel: "Barkod:",
    deliveryTypeLabel: "Teslimat Türü:",
    deliveryTypeValue: "Adrese Kargo / Elden Teslim",
    extraServiceLabel: "Ekstra Hizmet:",
    extraServiceValue: "Yerinde Kurulum & Eğitim",
    shelfAddressLabel: "Raf Adresi:",
    stockStatusLabel: "Stok Durumu:",
    pieces: "Adet",
    selectVariant: "⚙️ Model / Varyant Seçin:",
    addToCart: "Sepete Ekle",
    requestQuote: "Teklif İste",
    quoteOption: "(Teklif Alın)",
    addedToCartMsg: "sepetinize eklendi.",
    quoteSentMsg: "için fiyat teklif talebi satıcıya iletildi. 'Tekliflerim' sekmesinden takip edebilirsiniz.",
    quoteRequested: "Fiyat Teklifi İstendi",
    pendingSellerReview: "Beklemede (Satıcı Değerlendiriyor)",
    estateStorefrontTitle: "HBS EMLAK & PORTFÖY VİTRİNİ",
    estateStoreDesc: "Depo mantığı olmayan emlak sektöründe, m² (alan), oda sayısı, kat, ısıtma ve kiralık/satılık filtreleri gibi sektörel özelliklerin yer aldığı emlak portföy vitrinidir.",
    forRent: "Kiralık",
    forSale: "Satılık",
    month: "Ay",
    floorLabel: "Kat:",
    acLabel: "Klima",
    estateDescSuffix: "özellikleriyle kaçırılmayacak fırsat.",
    scheduleViewing: "📅 İnceleme Randevusu Al",
    makeOffer: "💸 Teklif Sun (İskonto Talebi)",
    offerPriceLabel: "Teklif Fiyatı İletin",
    offerPricePlaceholder: "Örn: 42.000 USD",
    sendBtn: "Gönder",
    viewingRequestSent: "için inceleme randevu talebi emlak danışmanına iletildi.",
    offerSentMsg: "için {value} teklifiniz emlak danışmanına başarıyla iletildi. 'Tekliflerim' sekmesinden takip edebilirsiniz.",
    salonStorefrontTitle: "HBS ZAMAN SLOTLU RANDEVU VİTRİNİ",
    salonStoreDesc: "Stok tutmayan hizmet odaklı kuaför, danışmanlık, yaşlı bakım gibi işletmeler için; hizmet tipi, süresi, işlemi uygulayacak uzmanı (staff) seçmeye yönelik takvim ve randevu vitrinidir.",
    serviceCatalog: "Hizmet Kataloğu & İşlemler",
    durationLabel: "🕒 Süre:",
    minutes: "dk",
    specialistsLabel: "Uzmanlar:",
    selectedLabel: "Seçildi",
    selectLabel: "Seç",
    bookNowTitle: "Rezervasyon Yapın",
    specialistSelectLabel: "İşlemi Yapan Uzman (Staff)",
    availableSlotsToday: "Bugün İçin Uygun Zaman Slotları",
    confirmAppointment: "📅 Randevuyu Onayla",
    forAppointmentProcess: "işlemi için",
    withSpecialistTodayAt: "ile bugün saat",
    appointmentSuccessMsg: "randevunuz başarıyla oluşturuldu!",
    repairStorefrontTitle: "HBS OTO SERVİS & CANLI İLERLEME TAKİBİ",
    repairStoreDesc: "Oto servis ve tamirhanelerde müşterilerin arabalarının tamir sürecini (başlayan, biten ve bekleyen tüm görevleri) şeffaf şekilde izleyebildikleri canlı ilerleme takip vitrinidir.",
    plateTrackerTitle: "🚗 Plaka İle Canlı Takip",
    plateTrackerSub: "Servisteki aracınızın güncel durumunu izlemek için plaka numaranızı girin:",
    platePlaceholder: "Örn: 34-OBD-34",
    queryBtn: "Sorgula",
    plateQueriedMsg: "plakalı aracın tamir süreci döküldü.",
    repairInProgress: "ONARIM DEVAM EDİYOR ⚙️",
    responsibleMechanic: "Sorumlu Usta:",
    checkInTime: "Giriş:",
    yesterday: "Dün",
    repairPhaseLabel: "Montaj & Onarım Aşaması",
    serviceProgressLabel: "Servis İlerleme Aşaması",
    completedLabel: "Tamamlandı",
    stageDiagnostics: "✓ Arıza Tespit",
    stagePartsSupply: "✓ Parça Tedariği",
    stageRepair: "⚙️ Onarım",
    stageTestDrive: "⏳ Test Sürüşü",
    stageDelivery: "⏳ Teslimat",
    checklistTitle: "Onarım Kontrol Listesi (Checklist)",
    queryPlatePrompt: "Lütfen sol taraftan plaka sorgulaması yapın.",
    completeProfileTitle: "Profil Bilgilerinizi Tamamlayın",
    completeProfileSub: "Alışverişe devam edebilmek için lütfen ad-soyad, telefon ve şehir bilgilerinizi girin. Bu bilgiler fatura ve lojistik aşamalarında kullanılacaktır.",
    fullNameLabel: "Adınız Soyadınız *",
    phoneLabel: "Telefon Numaranız *",
    cityLabel: "Bulunduğunuz Şehir *",
    cancelBtn: "İptal",
    saveContinueBtn: "Kaydet & Devam Et",
    verificationTitle: "🔒 PROFİL DOĞRULAMA",
    alertFillAll: "Lütfen tüm alanları doldurun.",
    tendersBoard: "İlan Panosu",
    findWhatYouWantPrompt: "Aradığınızı bulamadıysanız, ilan bırakın, insanlar ve işletmeler size ulaşsın",
    customerPortal: "Müşteri Portalı",
    storePanel: "Mağaza Paneli",
    hbsVitrin: "HBS Vitrin",
    virtualStorefront: "🌍 Sanal Mağaza"
  },
  en: {
    callStore: "Call Store:",
    whatsappContact: "Contact via WhatsApp",
    fillAllFields: "Please fill in all fields.",
    simulatorTitle: "Sectoral Storefront Interface Simulator",
    simulatorSubtitle: "HBS is not a one-size-fits-all marketplace. The storefront interface morphs in seconds based on business type:",
    sectorProducts: "🧰 Products & Parts",
    sectorRealEstate: "🏢 Real Estate / Portfolio",
    sectorSalon: "💈 Hair Salon / Service",
    sectorAutoRepair: "🛠️ Auto Service / Live Repair",
    partsStorefrontTitle: "HBS PARTS STOREFRONT",
    virtualStoreDesc: "A digital storefront with no physical shelf stock, featuring nationwide shipping or hand delivery on order, with on-site installation and technical training supported by expert teams.",
    physicalStoreDesc: "A catalog storefront integrated with physical warehouse and shelves, displaying auto spare parts, diagnostic scanners, motor oils, and filter groups.",
    shippingLabel: "🚚 Nationwide Shipping & Hand Delivery",
    trainingLabel: "🔧 On-site Installation & Technical Training Included",
    turkey: "Turkey",
    georgia: "Georgia",
    catalogEmpty: "Store Catalog is Empty",
    catalogEmptySub: "There are no products displayed in this store yet.",
    catalogEmptyAdminHint: "As a store manager, you can instantly fill your catalog by uploading your first products or Excel template from your admin panel!",
    skuLabel: "Stock SKU:",
    barcodeLabel: "Barcode:",
    deliveryTypeLabel: "Delivery Type:",
    deliveryTypeValue: "Address Shipping / Hand Delivery",
    extraServiceLabel: "Extra Service:",
    extraServiceValue: "On-site Installation & Training",
    shelfAddressLabel: "Shelf Address:",
    stockStatusLabel: "Stock Status:",
    pieces: "Pcs",
    selectVariant: "⚙️ Select Model / Variant:",
    addToCart: "Add to Cart",
    requestQuote: "Request Quote",
    quoteOption: "(Get Quote)",
    addedToCartMsg: "added to your cart.",
    quoteSentMsg: "quote request for this item was successfully sent to the seller. You can track it under 'My Offers'.",
    quoteRequested: "Quote Requested",
    pendingSellerReview: "Pending (Seller Reviewing)",
    estateStorefrontTitle: "HBS REAL ESTATE & PORTFOLIO SHOWCASE",
    estateStoreDesc: "A real estate portfolio storefront featuring sectoral properties such as area (m²), room count, floor, heating, and rent/sale status instead of traditional warehouse logistics.",
    forRent: "For Rent",
    forSale: "For Sale",
    month: "Month",
    floorLabel: "Floor:",
    acLabel: "Air Conditioning",
    estateDescSuffix: "with these features, a not-to-miss opportunity.",
    scheduleViewing: "📅 Book a Viewing Appointment",
    makeOffer: "💸 Submit Offer (Discount Request)",
    offerPriceLabel: "Enter Offer Price",
    offerPricePlaceholder: "e.g. 42,000 USD",
    sendBtn: "Send",
    viewingRequestSent: "viewing appointment request for this property has been sent to the agent.",
    offerSentMsg: "your offer of {value} has been successfully sent to the agent. You can track it under 'My Offers'.",
    salonStorefrontTitle: "HBS TIME-SLOT BOOKING SHOWCASE",
    salonStoreDesc: "A calendar and appointment storefront designed for non-stock, service-oriented businesses like hair salons, consulting, or elder care, allowing users to choose the service type, duration, and specialist (staff).",
    serviceCatalog: "Service Catalog & Procedures",
    durationLabel: "🕒 Duration:",
    minutes: "min",
    specialistsLabel: "Specialists:",
    selectedLabel: "Selected",
    selectLabel: "Select",
    bookNowTitle: "Make a Reservation",
    specialistSelectLabel: "Performing Specialist (Staff)",
    availableSlotsToday: "Available Time Slots for Today",
    confirmAppointment: "📅 Confirm Appointment",
    forAppointmentProcess: "service for",
    withSpecialistTodayAt: "with today at",
    appointmentSuccessMsg: "your appointment has been successfully created!",
    repairStorefrontTitle: "HBS AUTO SERVICE & LIVE PROGRESS TRACKER",
    repairStoreDesc: "A live progress tracker storefront where auto repair shop customers can transparently monitor their vehicle's repair process, including starting, completed, and pending tasks.",
    plateTrackerTitle: "🚗 Live Tracking by License Plate",
    plateTrackerSub: "Enter your license plate number to monitor the current status of your vehicle in service:",
    platePlaceholder: "e.g. 34-OBD-34",
    queryBtn: "Search",
    plateQueriedMsg: "repair process details for this license plate retrieved.",
    repairInProgress: "REPAIR IN PROGRESS ⚙️",
    responsibleMechanic: "Responsible Mechanic:",
    checkInTime: "Check-in:",
    yesterday: "Yesterday",
    repairPhaseLabel: "Assembly & Repair Phase",
    serviceProgressLabel: "Service Progress Stage",
    completedLabel: "Completed",
    stageDiagnostics: "✓ Diagnostics",
    stagePartsSupply: "✓ Parts Supply",
    stageRepair: "⚙️ Repair",
    stageTestDrive: "⏳ Test Drive",
    stageDelivery: "⏳ Delivery",
    checklistTitle: "Repair Checklist",
    queryPlatePrompt: "Please search your license plate on the left.",
    completeProfileTitle: "Complete Your Profile Details",
    completeProfileSub: "To continue shopping, please enter your full name, phone number, and city. This information will be used for billing and logistics.",
    fullNameLabel: "Your Full Name *",
    phoneLabel: "Your Phone Number *",
    cityLabel: "Your Current City *",
    cancelBtn: "Cancel",
    saveContinueBtn: "Save & Continue",
    verificationTitle: "🔒 PROFILE VERIFICATION",
    alertFillAll: "Please fill in all fields.",
    tendersBoard: "Tenders Board",
    findWhatYouWantPrompt: "Didn't find what you were looking for? Post an ad, and let people and businesses reach you",
    customerPortal: "Customer Portal",
    storePanel: "Store Panel",
    hbsVitrin: "HBS Showcase",
    virtualStorefront: "🌍 Virtual Store"
  },
  de: {
    callStore: "Shop anrufen:",
    whatsappContact: "Per WhatsApp kontaktieren",
    fillAllFields: "Bitte füllen Sie alle Felder aus.",
    simulatorTitle: "Branchenspezifischer Schaufenster-Interface-Simulator",
    simulatorSubtitle: "HBS ist kein Einheitsmarktplatz. Die Schaufensteroberfläche passt sich in Sekundenschnelle an den Geschäftstyp an:",
    sectorProducts: "🧰 Produkte & Teile",
    sectorRealEstate: "🏢 Immobilien / Portfolio",
    sectorSalon: "💈 Friseursalon / Service",
    sectorAutoRepair: "🛠️ Autoservice / Live-Reparatur",
    partsStorefrontTitle: "HBS TEILE-SCHAUFENSTER",
    virtualStoreDesc: "Ein digitales Schaufenster ohne physischen Lagerbestand vor Ort, mit landesweitem Versand oder persönlicher Übergabe auf Bestellung, inklusive Vor-Ort-Installation und technischer Schulung durch Expertenteams.",
    physicalStoreDesc: "Ein in physische Lager und Regale integriertes Katalog-Schaufenster zur Präsentation von Autoersatzteilen, Diagnosegeräten, Motorölen und Filtergruppen.",
    shippingLabel: "🚚 Landesweiter Versand & Persönliche Übergabe",
    trainingLabel: "🔧 Inklusive Vor-Ort-Installation & Technische Schulung",
    turkey: "Türkei",
    georgia: "Georgien",
    catalogEmpty: "Shop-Katalog ist leer",
    catalogEmptySub: "In diesem Shop werden noch keine Produkte angezeigt.",
    catalogEmptyAdminHint: "Als Shop-Manager können Sie Ihren Katalog sofort füllen, indem Sie Ihre ersten Produkte oder eine Excel-Vorlage über Ihr Admin-Panel hochladen!",
    skuLabel: "Lager-SKU:",
    barcodeLabel: "Barcode:",
    deliveryTypeLabel: "Lieferart:",
    deliveryTypeValue: "Versand an Adresse / Handlieferung",
    extraServiceLabel: "Zusatzservice:",
    extraServiceValue: "Vor-Ort-Installation & Schulung",
    shelfAddressLabel: "Regaladresse:",
    stockStatusLabel: "Lagerstatus:",
    pieces: "Stk",
    selectVariant: "⚙️ Modell / Variante wählen:",
    addToCart: "In den Warenkorb",
    requestQuote: "Angebot anfordern",
    quoteOption: "(Angebot anfordern)",
    addedToCartMsg: "wurde Ihrem Warenkorb hinzugefügt.",
    quoteSentMsg: "Angebot für diesen Artikel wurde erfolgreich an den Verkäufer gesendet. Sie können es unter 'Meine Angebote' einsehen.",
    quoteRequested: "Angebot angefordert",
    pendingSellerReview: "Ausstehend (Verkäufer prüft)",
    estateStorefrontTitle: "HBS IMMOBILIEN & PORTFOLIO SCHAUFENSTER",
    estateStoreDesc: "Ein Immobilienportfolio-Schaufenster mit branchenspezifischen Merkmalen wie Fläche (m²), Zimmeranzahl, Etage, Heizung und Miet-/Verkaufsstatus anstelle klassischer Lagerlogistik.",
    forRent: "Miete",
    forSale: "Kauf",
    month: "Monat",
    floorLabel: "Etage:",
    acLabel: "Klimaanlage",
    estateDescSuffix: "mit diesen Eigenschaften eine einmalige Gelegenheit.",
    scheduleViewing: "📅 Besichtigungstermin buchen",
    makeOffer: "💸 Angebot abgeben (Rabattanfrage)",
    offerPriceLabel: "Gebotspreis eingeben",
    offerPricePlaceholder: "z.B. 42.000 USD",
    sendBtn: "Senden",
    viewingRequestSent: "Besichtigungsanfrage für diese Immobilie wurde an den Makler gesendet.",
    offerSentMsg: "Ihr Angebot über {value} wurde erfolgreich an den Makler gesendet. Sie können es unter 'Meine Angebote' verfolgen.",
    salonStorefrontTitle: "HBS TERMINBUCHUNG SCHAUFENSTER",
    salonStoreDesc: "Ein Kalender- und Terminschaufenster für nicht lagerhaltige, dienstleistungsorientierte Unternehmen wie Friseursalons, Beratungen oder Altenpflege, bei dem Benutzer die Art der Dienstleistung, die Dauer und den Spezialisten (Personal) auswählen können.",
    serviceCatalog: "Dienstleistungskatalog & Behandlungen",
    durationLabel: "🕒 Dauer:",
    minutes: "Min",
    specialistsLabel: "Spezialisten:",
    selectedLabel: "Ausgewählt",
    selectLabel: "Wählen",
    bookNowTitle: "Eine Reservierung machen",
    specialistSelectLabel: "Ausführender Spezialist (Personal)",
    availableSlotsToday: "Verfügbare Zeitfenster für heute",
    confirmAppointment: "📅 Termin bestätigen",
    forAppointmentProcess: "Dienstleistung für",
    withSpecialistTodayAt: "mit heute um",
    appointmentSuccessMsg: "Ihr Termin wurde erfolgreich vereinbart!",
    repairStorefrontTitle: "HBS AUTOSERVICE & LIVE-FORTSCHRITTSANZEIGE",
    repairStoreDesc: "Eine Live-Fortschrittsanzeige, bei der Kunden von Kfz-Werkstätten den Reparaturprozess ihres Fahrzeugs transparent überwachen können, einschließlich begonnener, abgeschlossener und ausstehender Aufgaben.",
    plateTrackerTitle: "🚗 Live-Verfolgung per Kennzeichen",
    plateTrackerSub: "Geben Sie Ihr Kennzeichen ein, um den aktuellen Status Ihres Fahrzeugs im Service zu überwachen:",
    platePlaceholder: "z.B. 34-OBD-34",
    queryBtn: "Suchen",
    plateQueriedMsg: "Details zum Reparaturprozess für dieses Kennzeichen abgerufen.",
    repairInProgress: "REPARATUR LÄUFT ⚙️",
    responsibleMechanic: "Verantwortlicher Mechaniker:",
    checkInTime: "Check-in:",
    yesterday: "Gestern",
    repairPhaseLabel: "Montage- und Reparaturphase",
    serviceProgressLabel: "Servicefortschrittsphase",
    completedLabel: "Abgeschlossen",
    stageDiagnostics: "✓ Diagnose",
    stagePartsSupply: "✓ Teilebeschaffung",
    stageRepair: "⚙️ Reparatur",
    stageTestDrive: "⏳ Testfahrt",
    stageDelivery: "⏳ Übergabe",
    checklistTitle: "Reparatur-Checkliste",
    queryPlatePrompt: "Bitte suchen Sie links nach Ihrem Kennzeichen.",
    completeProfileTitle: "Profil vervollständigen",
    completeProfileSub: "Um mit dem Einkaufen fortzufahren, geben Sie bitte Ihren vollständigen Namen, Ihre Telefonnummer und Ihre Stadt ein. Diese Informationen werden für die Rechnungsstellung und Logistik verwendet.",
    fullNameLabel: "Ihr vollständiger Name *",
    phoneLabel: "Ihre Telefonnummer *",
    cityLabel: "Ihre aktuelle Stadt *",
    cancelBtn: "Abbrechen",
    saveContinueBtn: "Speichern & Fortfahren",
    verificationTitle: "🔒 PROFILVERIFIZIERUNG",
    alertFillAll: "Bitte füllen Sie alle Felder aus.",
    tendersBoard: "Ausschreibungen",
    findWhatYouWantPrompt: "Haben Sie nicht gefunden, was Sie suchen? Schalten Sie eine Anzeige, damit Menschen und Unternehmen Sie erreichen",
    customerPortal: "Kundenportal",
    storePanel: "Shop-Panel",
    hbsVitrin: "HBS Schaufenster",
    virtualStorefront: "🌍 Virtueller Shop"
  },
  ru: {
    callStore: "Позвонить в магазин:",
    whatsappContact: "Связаться через WhatsApp",
    fillAllFields: "Пожалуйста, заполните все поля.",
    simulatorTitle: "Симулятор отраслевого витринного интерфейса",
    simulatorSubtitle: "HBS — это не универсальный маркетплейс. Витрина адаптируется за секунды в зависимости от типа бизнеса:",
    sectorProducts: "🧰 Товары и Запчасти",
    sectorRealEstate: "🏢 Недвижимость / Портфолио",
    sectorSalon: "💈 Салон красоты / Услуги",
    sectorAutoRepair: "🛠️ Автосервис / Живой ремонт",
    partsStorefrontTitle: "МАГАЗИН ЗАПЧАСТЕЙ HBS",
    virtualStoreDesc: "Цифровая витрина без физического наличия на полках, с доставкой по стране или самовывозом на заказ, установкой на месте и техподдержкой от команд экспертов.",
    physicalStoreDesc: "Каталог витрины интегрирован с физическим складом и полками, представляет автозапчасти, диагностические автосканеры, моторные масла и фильтры.",
    shippingLabel: "🚚 Доставка по всей стране и передача из рук в руки",
    trainingLabel: "🔧 Установка на месте и техподдержка включены",
    turkey: "Турция",
    georgia: "Грузия",
    catalogEmpty: "Каталог магазина пуст",
    catalogEmptySub: "В этом магазине пока нет представленных товаров.",
    catalogEmptyAdminHint: "Как администратор магазина, вы можете мгновенно наполнить каталог, загрузив первые товары или Excel-шаблон из панели управления!",
    skuLabel: "Артикул SKU:",
    barcodeLabel: "Штрихкод:",
    deliveryTypeLabel: "Тип доставки:",
    deliveryTypeValue: "Доставка на адрес / Самовывоз",
    extraServiceLabel: "Доп. услуга:",
    extraServiceValue: "Установка на месте и обучение",
    shelfAddressLabel: "Адрес полки:",
    stockStatusLabel: "Наличие на складе:",
    pieces: "шт.",
    selectVariant: "⚙️ Выберите модель / вариант:",
    addToCart: "В корзину",
    requestQuote: "Запросить цену",
    quoteOption: "(Запросить цену)",
    addedToCartMsg: "добавлено в вашу корзину.",
    quoteSentMsg: "запрос цены успешно отправлен продавцу. Отслеживать его можно в разделе 'Мои предложения'.",
    quoteRequested: "Запрошена цена",
    pendingSellerReview: "Ожидание (Продавец оценивает)",
    estateStorefrontTitle: "ВИТРИНА НЕДВИЖИМОСТИ HBS",
    estateStoreDesc: "Портфолио недвижимости, содержащее отраслевые характеристики, такие как площадь (м²), количество комнат, этаж, отопление и статус аренды/продажи вместо классической логистики.",
    forRent: "Аренда",
    forSale: "Продажа",
    month: "Месяц",
    floorLabel: "Этаж:",
    acLabel: "Кондиционер",
    estateDescSuffix: "уникальное предложение с этими характеристиками.",
    scheduleViewing: "📅 Запланировать осмотр",
    makeOffer: "💸 Сделать предложение (Запрос скидки)",
    offerPriceLabel: "Укажите цену предложения",
    offerPricePlaceholder: "Пример: 42 000 USD",
    sendBtn: "Отправить",
    viewingRequestSent: "запрос на осмотр этой недвижимости успешно направлен агенту.",
    offerSentMsg: "ваше предложение на сумму {value} успешно отправлено агенту. Вы можете отслеживать его в разделе 'Мои предложения'.",
    salonStorefrontTitle: "ВИТРИНА ЗАПИСИ НА ПРИЕМ HBS",
    salonStoreDesc: "Календарь и запись для услуг без физических запасов, таких как салоны красоты, консалтинг или уход; позволяет выбирать тип услуги, длительность и специалиста (персонал).",
    serviceCatalog: "Каталог услуг и процедуры",
    durationLabel: "🕒 Длительность:",
    minutes: "мин",
    specialistsLabel: "Специалисты:",
    selectedLabel: "Выбрано",
    selectLabel: "Выбрать",
    bookNowTitle: "Сделать бронирование",
    specialistSelectLabel: "Специалист (Персонал)",
    availableSlotsToday: "Доступные временные слоты на сегодня",
    confirmAppointment: "📅 Подтвердить запись",
    forAppointmentProcess: "услуга для",
    withSpecialistTodayAt: "с сегодня в",
    appointmentSuccessMsg: "ваша запись успешно создана!",
    repairStorefrontTitle: "АВТОСЕРВИС HBS & ОТСЛЕЖИВАНИЕ РЕМОНТА",
    repairStoreDesc: "Живой трекер процесса ремонта автосервиса, где клиенты могут прозрачно отслеживать статус работ (начатые, завершенные и ожидающие задачи).",
    plateTrackerTitle: "🚗 Живое отслеживание по номеру",
    plateTrackerSub: "Введите госномер вашего автомобиля для отслеживания текущего статуса ремонта в сервисе:",
    platePlaceholder: "Пример: 34-OBD-34",
    queryBtn: "Поиск",
    plateQueriedMsg: "детали процесса ремонта для этого госномера успешно получены.",
    repairInProgress: "РЕМОНТ В ПРОЦЕССЕ ⚙️",
    responsibleMechanic: "Ответственный мастер:",
    checkInTime: "Приемка:",
    yesterday: "Вчера",
    repairPhaseLabel: "Этап сборки и ремонта",
    serviceProgressLabel: "Этап прогресса обслуживания",
    completedLabel: "Завершено",
    stageDiagnostics: "✓ Диагностика",
    stagePartsSupply: "✓ Поставка запчастей",
    stageRepair: "⚙️ Ремонт",
    stageTestDrive: "⏳ Тест-драйв",
    stageDelivery: "⏳ Выдача",
    checklistTitle: "Контрольный список ремонта",
    queryPlatePrompt: "Пожалуйста, выполните поиск по номеру слева.",
    completeProfileTitle: "Заполните профиль",
    completeProfileSub: "Чтобы продолжить покупки, укажите ФИО, номер телефона и ваш город. Эти данные будут использованы для выставления счетов и логистики.",
    fullNameLabel: "Ваше имя и фамилия *",
    phoneLabel: "Номер телефона *",
    cityLabel: "Ваш город *",
    cancelBtn: "Отмена",
    saveContinueBtn: "Сохранить и продолжить",
    verificationTitle: "🔒 ВЕРИФИКАЦИЯ ПРОФИЛЯ",
    alertFillAll: "Пожалуйста, заполните все поля.",
    tendersBoard: "Доска тендеров",
    findWhatYouWantPrompt: "Не нашли то, что искали? Разместите объявление, чтобы люди и компании могли связаться с вами",
    customerPortal: "Портал клиента",
    storePanel: "Панель магазина",
    hbsVitrin: "Витрина HBS",
    virtualStorefront: "🌍 Виртуальный магазин"
  },
  ka: {
    callStore: "მაღაზიაში დარეკვა:",
    whatsappContact: "WhatsApp-ით დაკავშირება",
    fillAllFields: "გთხოვთ შეავსოთ ყველა ველი.",
    simulatorTitle: "სექტორული მაღაზიის ვიტრინის სიმულატორი",
    simulatorSubtitle: "HBS არ არის ერთგვაროვანი ბაზარი. მაღაზიის ვიტრინა წამებში იცვლება ბიზნესის ტიპის მიხედვით:",
    sectorProducts: "🧰 პროდუქტი & ნაწილები",
    sectorRealEstate: "🏢 უძრავი ქონება / პორტფოლიო",
    sectorSalon: "💈 სალონი / მომსახურება",
    sectorAutoRepair: "🛠️ ავტოსერვისი / ცოცხალი რემონტი",
    partsStorefrontTitle: "HBS ნაწილების მაღაზია",
    virtualStoreDesc: "ციფრული ვიტრინა ფიზიკური მარაგის გარეშე, ქვეყნის მასშტაბით მიმიწოდებით, ადგილზე მონტაჟითა და ექსპერტთა გუნდების ტექნიკური მომზადების მხარდაჭერით.",
    physicalStoreDesc: "ფიზიკურ საწყობთან და თაროებთან ინტეგრირებული კატალოგი, სადაც ნაჩვენებია ავტონაწილები, სადიაგნოსტიკო სკანერები, ძრავის ზეთები და ფილტრები.",
    shippingLabel: "🚚 ქვეყნის მასშტაბით მიწოდება & ხელში გადაცემა",
    trainingLabel: "🔧 ადგილზე მონტაژی & ტექნიკური სწავლება შედის",
    turkey: "თურქეთი",
    georgia: "საქართველო",
    catalogEmpty: "მაღაზიის კატალოგი ცარიელია",
    catalogEmptySub: "ამ მაღაზიაში ჯერ არ არის წარმოდგენილი პროდუქტები.",
    catalogEmptyAdminHint: "როგორც მაღაზიის ადმინისტრატორს, შეგიძლიათ მომენტალურად შეავსოთ კატალოგი პირველი პროდუქტების ან Excel შაბლონის ატვირთვით!",
    skuLabel: "სასაქონლო SKU:",
    barcodeLabel: "ბარკოდი:",
    deliveryTypeLabel: "მიწოდების ტიპი:",
    deliveryTypeValue: "მისამართზე მიწოდება / ხელში გადაცემა",
    extraServiceLabel: "დამატებითი სერვისი:",
    extraServiceValue: "ადგილზე მონტაჟი & სწავლება",
    shelfAddressLabel: "თაროს მისამართი:",
    stockStatusLabel: "მარაგის სტატუსი:",
    pieces: "ცალი",
    selectVariant: "⚙️ აირჩიეთ მოდელი / ვარიანტი:",
    addToCart: "კალათაში დამატება",
    requestQuote: "ფასის მოთხოვნა",
    quoteOption: "(ფასის მოთხოვნა)",
    addedToCartMsg: "დაემატა თქვენს კალათაში.",
    quoteSentMsg: "ფასის მოთხოვნა წარმატებით გაეგზავნა გამყიდველს. თვალი ადევნეთ მას 'ჩემი შეთავაზებების' განყოფილებაში.",
    quoteRequested: "მოთხოვნილია ფასი",
    pendingSellerReview: "მოლოდინი (გამყიდველი განიხილავს)",
    estateStorefrontTitle: "HBS უძრავი ქონების ვიტრინა",
    estateStoreDesc: "უძრავი ქონების პორტფოლიო, რომელიც მოიცავს ისეთ მახასიათებლებს, როგორიცაა ფართობი (მ²), ოთახების რაოდენობა, სართული, გათბობა და ქირაობა/ყიდვა ტრადიციული ლოგისტიკის ნაცვლად.",
    forRent: "ქირავდება",
    forSale: "იყიდება",
    month: "თვე",
    floorLabel: "სართული:",
    acLabel: "კონდიციონერი",
    estateDescSuffix: "უნიკალური შემოთავაზება ამ მახასიათებლებით.",
    scheduleViewing: "📅 ვიზიტის დაგეგმვა",
    makeOffer: "💸 შეთავაზების წარდგენა (ფასდაკლების მოთხოვნა)",
    offerPriceLabel: "შეიყვანეთ შემოთავაზებული ფასი",
    offerPricePlaceholder: "მაგ: 42.000 USD",
    sendBtn: "გაგზავნა",
    viewingRequestSent: "ამ ქონების დათვალიერების მოთხოვნა წარმატებით გაეგზავნა აგენტს.",
    offerSentMsg: "თქვენი შემოთავაზება {value}-ზე წარმატებით გაეგზავნა აგენტს. თვალი ადევნეთ მას 'ჩემი შეთავაზებების' განყოფილებაში.",
    salonStorefrontTitle: "HBS დროის სლოტების დაჯავშნის ვიტრინა",
    salonStoreDesc: "კალენდარი და შეხვედრების ვიტriნა არამატერიალური, მომსახურებაზე ორიენტირებული ბიზნესისთვის (სალონები, კონსულტაცია და სხვა), მომხმარებელს შეუძლია აირჩიოს სერვისის ტიპი, ხანგრძლივობა და სპეციალისტი.",
    serviceCatalog: "მომსახურების კატალოგი & პროცედურები",
    durationLabel: "🕒 ხანგრძლივობა:",
    minutes: "წთ",
    specialistsLabel: "სპეციალისტები:",
    selectedLabel: "არჩეულია",
    selectLabel: "არჩევა",
    bookNowTitle: "გააკეთეთ დაჯავშნა",
    specialistSelectLabel: "სპეციალისტი (პერსონალი)",
    availableSlotsToday: "დღევანდელი ხელმისაწვდომი დროის სლოტები",
    confirmAppointment: "📅 დაადასტურეთ შეხვედრა",
    forAppointmentProcess: "მომსახურება",
    withSpecialistTodayAt: "სპეციალისტთან დღეს",
    appointmentSuccessMsg: "თქვენი შეხვედრა წარმატებით შეიქმნა!",
    repairStorefrontTitle: "HBS ავტოსერვისი & ცოცხალი პროგრესი",
    repairStoreDesc: "ავტოსერვისების ცოცხალი ტრეკერი, სადაც მომხმარებლებს შეუძლიათ გამჭვირვალედ აკონტროლონ თავიანთი მანქანის შეკეთების პროცესი (დაწყებული, დასრულებული და მოლოდინის რეჟიმში მყოფი დავალებები).",
    plateTrackerTitle: "🚗 ცოცხალი თვალყურის დევნება ნომრით",
    plateTrackerSub: "შეიყვანეთ თქვენი მანქანის სახელმწიფო ნომერი სერვისში მიმდინარე სტატუსის სანახავად:",
    platePlaceholder: "მაგ: 34-OBD-34",
    queryBtn: "ძებნა",
    plateQueriedMsg: "შეკეთების პროცესის დეტალები ამ სახელმწიფო ნომრისთვის მიღებულია.",
    repairInProgress: "რემონტი მიმდინარეობს ⚙️",
    responsibleMechanic: "პასუხისმგებელი ხელოსანი:",
    checkInTime: "მიღება:",
    yesterday: "გუშინ",
    repairPhaseLabel: "მონტაჟისა და შეკეთების ეტაპი",
    serviceProgressLabel: "მომსახურების პროგრესის ეტაპი",
    completedLabel: "დასრულდა",
    stageDiagnostics: "✓ დიაგნოსტიკა",
    stagePartsSupply: "✓ ნაწილების მიწოდება",
    stageRepair: "⚙️ რემონტი",
    stageTestDrive: "⏳ ტესტ-დრაივი",
    stageDelivery: "⏳ ჩაბარება",
    checklistTitle: "შეკეთების საკონტროლო სია",
    queryPlatePrompt: "გთხოვთ, მოძებნოთ თქვენი სახელმწიფო ნომერი მარცხნივ.",
    completeProfileTitle: "შეავსეთ პროფილი",
    completeProfileSub: "შესყიდვების გასაგრძელებლად, გთხოვთ მიუთითოთ სახელი, ტელეფონის ნომერი და ქალაქი. ეს მონაცემები გამოყენებული იქნება ინვოისებისა და ლოგისტიკისთვის.",
    fullNameLabel: "თქვენი სახელი და გვარი *",
    phoneLabel: "ტელეფონის ნომერი *",
    cityLabel: "თქვენი ქალაქი *",
    cancelBtn: "გაუქმება",
    saveContinueBtn: "შენახვა & გაგრძელება",
    verificationTitle: "🔒 პროფილის ვერიფიკაცია",
    alertFillAll: "გთხოვთ შეავსოთ ყველა ველი.",
    tendersBoard: "ტენდერების დაფა",
    findWhatYouWantPrompt: "ვერ იპოვეთ ის, რასაც ეძებდით? განათავსეთ განცხადება და ხალხი და ბიზნესი დაგიკავშირდებათ",
    customerPortal: "კლიენტის პორტალი",
    storePanel: "მაღაზიის პანელი",
    hbsVitrin: "HBS ვიტრინა",
    virtualStorefront: "🌍 ვირტუალური მაღაზია"
  }
};

// --- MULTI-LANGUAGE PRE-MAPPED DATASETS FOR SHOWCASES ---
const estateItems = [
  {
    trName: "Batumi Hills Sea View Apartment",
    name: {
      tr: "Batumi Hills Sea View Apartment",
      en: "Batumi Hills Sea View Apartment",
      de: "Batumi Hills Apartment mit Meerblick",
      ru: "Апартаменты Batumi Hills с видом на море",
      ka: "Batumi Hills Sea View Apartment"
    },
    type: {
      tr: "Kiralık",
      en: "For Rent",
      de: "Miete",
      ru: "Аренда",
      ka: "ქირავდება"
    },
    area: "85m²",
    rooms: "2+1",
    floor: "12",
    price: {
      tr: "800 USD / Ay",
      en: "800 USD / Month",
      de: "800 USD / Monat",
      ru: "800 USD / Месяц",
      ka: "800 USD / თვე"
    },
    features: {
      tr: "Deniz Manzaralı, Doğalgaz Kombi",
      en: "Sea View, Natural Gas Heating",
      de: "Meerblick, Erdgas-Zentralheizung",
      ru: "Вид на море, индивидуальное газовое отопление",
      ka: "ზღვის ხედი, ბუნებრივი აირის გათბობა"
    }
  },
  {
    trName: "Orbi City Luxury Studio",
    name: {
      tr: "Orbi City Luxury Studio",
      en: "Orbi City Luxury Studio",
      de: "Orbi City Luxus-Studio",
      ru: "Роскошная студия в Orbi City",
      ka: "Orbi City Luxury Studio"
    },
    type: {
      tr: "Satılık",
      en: "For Sale",
      de: "Kauf",
      ru: "Продажа",
      ka: "იყიდება"
    },
    area: "38m²",
    rooms: "1+0",
    floor: "24",
    price: {
      tr: "45.000 USD",
      en: "45,000 USD",
      de: "45.000 USD",
      ru: "45 000 USD",
      ka: "45 000 USD"
    },
    features: {
      tr: "Eşyalı, Klima",
      en: "Furnished, Air Conditioning",
      de: "Möbliert, Klimaanlage",
      ru: "Меблированная, кондиционер",
      ka: "ავეჯით, კონდიციონერი"
    }
  }
];

const salonServices = [
  {
    trName: "Saç Kesim & Şekillendirme",
    name: {
      tr: "Saç Kesim & Şekillendirme",
      en: "Hair Cut & Styling",
      de: "Haarschnitt & Styling",
      ru: "Стрижка и укладка волос",
      ka: "თმის შეჭრა & დაყენება"
    },
    duration: {
      tr: "45 dk",
      en: "45 min",
      de: "45 Min",
      ru: "45 мин",
      ka: "45 წთ"
    },
    price: "40 GEL",
    staff: {
      tr: "Ahmet Usta, Giorgi",
      en: "Ahmet Usta, Giorgi",
      de: "Ahmet Usta, Giorgi",
      ru: "Ахмет Уста, Георгий",
      ka: "ახმეტ უსტა, გიორგი"
    }
  },
  {
    trName: "Saç Boyama & Balyaj",
    name: {
      tr: "Saç Boyama & Balyaj",
      en: "Hair Coloring & Balayage",
      de: "Haarfärbung & Balayage",
      ru: "Окрашивание волос и балаяж",
      ka: "თმის შეღებვა & ბალაიაჟი"
    },
    duration: {
      tr: "120 dk",
      en: "120 min",
      de: "120 Min",
      ru: "120 мин",
      ka: "120 წთ"
    },
    price: "120 GEL",
    staff: {
      tr: "Ahmet Usta, Elena",
      en: "Ahmet Usta, Elena",
      de: "Ahmet Usta, Elena",
      ru: "Ахмет Уста, Елена",
      ka: "ახმეტ უსტა, ელენა"
    }
  },
  {
    trName: "Manikür & Pedikür Özel İşlem",
    name: {
      tr: "Manikür & Pedikür Özel İşlem",
      en: "Manicure & Pedicure Special Treatment",
      de: "Maniküre & Pediküre Spezialbehandlung",
      ru: "Специальный уход для маникюра и педикюра",
      ka: "მანიკური & პედიკური სპეციალური პროცედურა"
    },
    duration: {
      tr: "60 dk",
      en: "60 min",
      de: "60 Min",
      ru: "60 мин",
      ka: "60 წთ"
    },
    price: "50 GEL",
    staff: {
      tr: "Elena",
      en: "Elena",
      de: "Elena",
      ru: "Елена",
      ka: "ელენა"
    }
  }
];

const staffOptions = [
  {
    tr: "Ahmet Usta (Baş Stilist)",
    en: "Ahmet Usta (Chief Stylist)",
    de: "Ahmet Usta (Chef-Stylist)",
    ru: "Ахмет Уста (Главный стилист)",
    ka: "ახმეტ უსტა (მთავარი სტილისტი)"
  },
  {
    tr: "Elena (Güzellik Uzmanı)",
    en: "Elena (Beauty Specialist)",
    de: "Elena (Kosmetikerin)",
    ru: "Елена (Косметолог)",
    ka: "ელენა (სილამაზის სპეციალისტი)"
  },
  {
    tr: "Giorgi (Berber & Tıraş)",
    en: "Giorgi (Barber & Shaving)",
    de: "Giorgi (Barbier & Rasur)",
    ru: "Георгий (Барбер и бритье)",
    ka: "გიორგი (დალაქი & პარსვა)"
  }
];

const autoRepairTasks = [
  {
    name: {
      tr: "Bilgisayarlı OBD Arıza Teşhisi",
      en: "Computerized OBD Diagnostics",
      de: "Computergestützte OBD-Diagnose",
      ru: "Компьютерная диагностика OBD",
      ka: "კომპიუტერული OBD დიაგნოსტიკა"
    },
    status: "completed",
    note: {
      tr: "OBDTR Autel cihazıyla test edildi, arızalar silindi.",
      en: "Tested with OBDTR Autel scanner, fault codes cleared.",
      de: "Mit OBDTR Autel-Scanner getestet, Fehlercodes gelöscht.",
      ru: "Протестировано автосканером OBDTR Autel, ошибки стерты.",
      ka: "ტესტირებულია OBDTR Autel აპარატით, ხარვეზები წაშლილია."
    }
  },
  {
    name: {
      tr: "Yağ ve Yağ Filtresi Değişimi",
      en: "Engine Oil & Oil Filter Replacement",
      de: "Motoröl- und Ölfilterwechsel",
      ru: "Замена моторного масла и масляного фильтра",
      ka: "ზეთის და ზეთის ფილტრის შეცვლა"
    },
    status: "completed",
    note: {
      tr: "10W-40 tam sentetik yağ kullanıldı.",
      en: "10W-40 fully synthetic engine oil was used.",
      de: "10W-40 vollsynthetisches Motoröl wurde verwendet.",
      ru: "Использовано полностью синтетическое масло 10W-40.",
      ka: "გამოყენებულია 10W-40 სინთეტიკური ზეთი."
    }
  },
  {
    name: {
      tr: "Ön Fren Balatası Montajı",
      en: "Front Brake Pad Assembly",
      de: "Vorderer Bremsbelageinbau",
      ru: "Установка передних тормозных колодок",
      ka: "წინა სამუხრუჭე ხუნდების მონტაჟი"
    },
    status: "active",
    note: {
      tr: "Balatalar söküldü, yeni disk yatakları takılıyor.",
      en: "Pads dismantled, new disc beds being installed.",
      de: "Beläge demontiert, neue Bremsscheibenaufnahmen werden montiert.",
      ru: "Колодки демонтированы, устанавливаются новые направляющие.",
      ka: "ხუნდები მოხსნილია, ახალი დისკის ბუდეები მონტაჟდება."
    }
  },
  {
    name: {
      tr: "Amortisör ve Ön Düzen Kontrolü",
      en: "Shock Absorber & Front Suspension Control",
      de: "Stoßdämpfer- & Vorderradaufhängungskontrolle",
      ru: "Проверка амортизаторов и передней подвески",
      ka: "ამორტიზატორის და წინა დაკიდების კონტроლი"
    },
    status: "pending",
    note: {
      tr: "Onarım sonrası rot-balans ayarına geçilecek.",
      en: "Wheel alignment alignment will be started after repair.",
      de: "Achsvermessung wird nach der Reparatur durchgeführt.",
      ru: "Регулировка схода-развала начнется после ремонта.",
      ka: "რემონტის შემდეგ დაიწყება თვლების გასწორება."
    }
  }
];

export default function StorePage() {
  const params = useParams<{ storeSlug: string }>() || { storeSlug: "" };
  const { language, isReady } = useHbsLanguage();
  
  // Safe helper to pick language translation value
  function pickVal(obj: any, lang: HbsLanguageCode): string {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.en || obj.tr || "";
  }

  // Hook translation dictionary getter
  function getTxt(key: string): string {
    const translationsForLang = pageTranslations[language];
    if (translationsForLang && translationsForLang[key]) {
      return translationsForLang[key];
    }
    const defaultTranslations = pageTranslations.en;
    if (defaultTranslations && defaultTranslations[key]) {
      return defaultTranslations[key];
    }
    return key;
  }

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [storePhone, setStorePhone] = useState<string | undefined>(undefined);
  const [storeWhatsapp, setStoreWhatsapp] = useState<string | undefined>(undefined);
  
  const storeInfo = useMemo(() => {
    if (typeof window === "undefined") return null;
    const localStoresStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
    const localStores = JSON.parse(localStoresStr);
    return localStores.find((st: any) => st.code === params.storeSlug) || (params.storeSlug === "obdtr" ? {
      name: "OBDTR Diagnostics",
      operatingModel: "virtual_delivery",
      serviceCountries: ["TR", "GE"]
    } : null);
  }, [params.storeSlug]);

  const isVirtualDelivery = storeInfo?.operatingModel === "virtual_delivery";

  const localSettings = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem("hbs-company-settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing hbs-company-settings", e);
    }
    return null;
  }, []);

  const storePhoneVal = useMemo(() => {
    const baseVal = storePhone || storeInfo?.phone;
    const isPlaceholder = baseVal === "+905320000000" || baseVal === "905320000000" || !baseVal;
    if (isPlaceholder) {
      const activeUser = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem("hbs-current-user") || "null") : null;
      const loggedInStoreSlug = activeUser?.storeSlugs?.[0] || "obdtr";
      if (params.storeSlug === loggedInStoreSlug && localSettings?.phone) {
        return localSettings.phone;
      }
      return storeInfo?.phone || "+905320000000";
    }
    return baseVal || (params.storeSlug === "obdtr" ? "+905320000000" : undefined);
  }, [storePhone, storeInfo, localSettings, params.storeSlug]);

  const storeWhatsappVal = useMemo(() => {
    const baseVal = storeWhatsapp || storeInfo?.whatsapp;
    const isPlaceholder = baseVal === "905320000000" || baseVal === "+905320000000" || !baseVal;
    if (isPlaceholder) {
      const activeUser = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem("hbs-current-user") || "null") : null;
      const loggedInStoreSlug = activeUser?.storeSlugs?.[0] || "obdtr";
      if (params.storeSlug === loggedInStoreSlug && localSettings?.whatsapp) {
        return sanitizeWhatsAppNumber(localSettings.whatsapp);
      }
      return sanitizeWhatsAppNumber(storeInfo?.whatsapp || "905320000000");
    }
    return sanitizeWhatsAppNumber(baseVal || (params.storeSlug === "obdtr" ? "905320000000" : undefined));
  }, [storeWhatsapp, storeInfo, localSettings, params.storeSlug]);

  const contactButtons = useMemo(() => {
    if (!storePhoneVal && !storeWhatsappVal) return null;
    return (
      <div className="mt-4 flex flex-wrap gap-2 pt-1 border-t border-slate-100">
        {storePhoneVal && (
          <a
            href={`tel:${storePhoneVal}`}
            className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 font-extrabold text-[11px] px-4 py-2 flex items-center gap-1.5 shadow-sm hover:bg-emerald-100 transition duration-300"
          >
            {getTxt("callStore")} {storePhoneVal}
          </a>
        )}
        {storeWhatsappVal && (
          <a
            href={`https://wa.me/${storeWhatsappVal.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-green-200 bg-green-50 text-green-800 font-extrabold text-[11px] px-4 py-2 flex items-center gap-1.5 shadow-sm hover:bg-green-100 transition duration-300"
          >
            {getTxt("whatsappContact")}
          </a>
        )}
      </div>
    );
  }, [storePhoneVal, storeWhatsappVal, language]);

  function requireLogin() {
    const user = window.localStorage.getItem("hbs-current-user");
    if (!user) {
      window.location.href = "/login";
      return false;
    }
    return true;
  }

  function checkProfileAndExecute(action: () => void) {
    if (!requireLogin()) return;
    const userStr = window.localStorage.getItem("hbs-current-user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        const name = userObj.displayName || "";
        const phone = userObj.phone || "";
        const city = userObj.city || "";
        
        if (!name.trim() || !phone.trim() || !city.trim()) {
          setProfileName(name);
          setProfilePhone(phone);
          setProfileCity(city);
          setPendingAction(() => action);
          setProfileModalOpen(true);
          return;
        }
      } catch (e) {
        console.error("Error parsing current user", e);
      }
    }
    action();
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim() || !profileCity.trim()) {
      alert(getTxt("fillAllFields"));
      return;
    }

    const userStr = window.localStorage.getItem("hbs-current-user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.displayName = profileName;
        userObj.phone = profilePhone;
        userObj.city = profileCity;
        window.localStorage.setItem("hbs-current-user", JSON.stringify(userObj));

        const isSupabaseConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";
        
        if (isSupabaseConfigured) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("customers").upsert({
              id: user.id,
              full_name: profileName,
              phone: profilePhone,
              city: profileCity,
              email: user.email
            });
          }
        }
      } catch (err) {
        console.error("Error saving complete profile:", err);
      }
    }

    setProfileModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }
  
  // Dynamic UI morphing simulator trigger
  const [storeType, setStoreType] = useState<StoreType>(
    params.storeSlug === "obdtr" ? "products" : "autoRepair"
  );
  
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      // 1. Fetch store contact details directly from companies table to ensure multi-tenant robustness even with zero products
      supabase
        .from("companies")
        .select("phone, whatsapp")
        .eq("code", params.storeSlug)
        .single()
        .then(({ data: compData, error: compErr }) => {
          if (compData && !compErr) {
            setStorePhone(compData.phone || undefined);
            setStoreWhatsapp(compData.whatsapp || undefined);
          }
        });

      // 2. Load products
      supabase
        .from("offerable_items")
        .select("*, companies!inner(*)")
        .eq("companies.code", params.storeSlug)
        .then(({ data, error }) => {
          if (data && !error) {
            if (data.length > 0 && data[0].companies && !storePhone && !storeWhatsapp) {
              setStorePhone(data[0].companies.phone || undefined);
              setStoreWhatsapp(data[0].companies.whatsapp || undefined);
            }
            const mapped: ProductRecord[] = data.map((item: any) => ({
              id: item.id,
              itemType: item.type === "product" ? "product" : item.type === "service" ? "service" : "rental",
              name: item.name,
              category: item.category || "Genel",
              brand: item.brand || "",
              model: "",
              description: item.description || "",
              salePrice: item.sale_price ? String(item.sale_price) : "",
              purchasePrice: item.purchase_price ? String(item.purchase_price) : "",
              currency: item.currency || "GEL",
              barcode: item.barcode || "",
              qrCode: item.qr_code || "",
              sku: item.code || "",
              oemCode: "",
              manufacturerCode: "",
              stockTracking: true,
              quantity: "10",
              warehouse: "Ana Depo",
              shelf: "",
              entryDate: "",
              exitDate: "",
              pricingMode: item.sale_price ? "fixed" : "quote",
              visibility: item.is_visible_in_storefront ? "visible" : "hidden",
              imageUrl: item.photo_urls?.[0] || "/product-images/diagnostic-scanner.svg",
              videoUrl: item.video_urls?.[0] || "",
              variants: []
            }));
            setProducts(mapped);
          } else {
            if (error) console.error("Supabase storefront loading error:", error);
            loadFromLocalStorage();
          }
        });
    } else {
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
      try {
        const saved = window.localStorage.getItem("hbs-store-products");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
            return;
          }
        }
      } catch (e) {
        console.error("Store products loading error:", e);
      }
      setProducts([]);
    }
  }, [params.storeSlug]);

  function saveCustomerOffer(productName: string, type: "quote" | "bid", offerVal = "") {
    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const customerEmail = currentUser?.username || "Ziyaretçi";
      
      const newOffer = {
        id: `offer-${Date.now()}`,
        customerEmail,
        productName,
        type,
        offerValue: type === "bid" ? offerVal : getTxt("quoteRequested"),
        status: getTxt("pendingSellerReview"),
        date: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", {hour: "2-digit", minute: "2-digit"})
      };
      
      const currentOffers = JSON.parse(window.localStorage.getItem("hbs-store-customer-offers") || "[]");
      currentOffers.push(newOffer);
      window.localStorage.setItem("hbs-store-customer-offers", JSON.stringify(currentOffers));
    } catch (e) {
      console.error("Error saving customer offer:", e);
    }
  }

  // Time-slot booking states for Salon
  const [selectedStaff, setSelectedStaff] = useState("Ahmet Usta (Baş Stilist)");
  const [selectedService, setSelectedService] = useState("Saç Kesim & Şekillendirme");
  const [selectedSlot, setSelectedSlot] = useState("");

  // Auto repair license plate check state
  const [plateNumber, setPlateNumber] = useState("34-OBD-34");
  const [showRepairTracker, setShowRepairTracker] = useState(true);

  // Offers state
  const [offerValue, setOfferValue] = useState("");
  const [offerProduct, setOfferProduct] = useState("");

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900 px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/" className="text-base font-black sm:text-xl text-blue-600">
            {getTxt("hbsVitrin")}
          </Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/requests" className="rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-750 px-3 py-2 text-xs font-black shadow-sm hover:bg-indigo-100 transition">
              {getTxt("tendersBoard")}
            </Link>
            <Link href="/customer" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">
              {getTxt("customerPortal")}
            </Link>
            <Link href="/login" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">
              {getTxt("storePanel")}
            </Link>
          </div>
        </header>

        {/* Dynamic Sector Showcase Simulator Bar - Wow Factor! */}
        <section className="mb-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest block">{getTxt("simulatorTitle")}</span>
            <p className="text-xs text-blue-900 leading-relaxed font-bold">{getTxt("simulatorSubtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <button
              onClick={() => { setStoreType("products"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "products" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              {getTxt("sectorProducts")}
            </button>
            <button
              onClick={() => { setStoreType("realEstate"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "realEstate" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              {getTxt("sectorRealEstate")}
            </button>
            <button
              onClick={() => { setStoreType("salon"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "salon" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              {getTxt("sectorSalon")}
            </button>
            <button
              onClick={() => { setStoreType("autoRepair"); setMessage(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${storeType === "autoRepair" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-100"}`}
            >
              {getTxt("sectorAutoRepair")}
            </button>
          </div>
        </section>

        {message && (
          <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs font-black text-blue-950">
            ✓ {message}
          </div>
        )}

        {/* -------------------- 1. PRODUCTS & SPARE PARTS STOREFRONT -------------------- */}
        {storeType === "products" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden">
              {isVirtualDelivery && (
                <div className="absolute right-0 top-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-md">
                  {getTxt("virtualStorefront")}
                </div>
              )}
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">{getTxt("partsStorefrontTitle")}</span>
              <h1 className="text-3xl font-black">{storeInfo?.name || "OBDTR Diagnostics"}</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                {isVirtualDelivery 
                  ? getTxt("virtualStoreDesc")
                  : getTxt("physicalStoreDesc")
                }
              </p>
              {isVirtualDelivery && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[10px] px-3 py-1 flex items-center gap-1 shadow-sm">
                    {getTxt("shippingLabel")}
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[10px] px-3 py-1 flex items-center gap-1 shadow-sm">
                    {getTxt("trainingLabel")}
                  </span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[10px] px-3 py-1 flex items-center gap-1 shadow-sm">
                    🇹🇷 {getTxt("turkey")}
                  </span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[10px] px-3 py-1 flex items-center gap-1 shadow-sm">
                    🇬🇪 {getTxt("georgia")}
                  </span>
                </div>
              )}
              {contactButtons}
            </div>

            {products.filter(p => p.visibility !== "hidden").length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center max-w-lg mx-auto shadow-sm my-6">
                <div className="text-4xl">🛍️</div>
                <h3 className="font-black text-slate-800 mt-3 text-sm uppercase tracking-wider">{getTxt("catalogEmpty")}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-bold">
                  {getTxt("catalogEmptySub")}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {getTxt("catalogEmptyAdminHint")}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.filter(p => p.visibility !== "hidden").map((p) => {
                  const hasVariants = p.variants && p.variants.length > 0;
                  const selectedVarId = selectedVariants[p.id];
                  const activeVariant = hasVariants ? p.variants?.find(v => v.id === selectedVarId) || p.variants?.[0] : null;

                  const displayPrice = activeVariant 
                    ? (activeVariant.salePrice ? `${activeVariant.salePrice} ${p.currency}` : getTxt("quoteOption")) 
                    : (p.pricingMode === "fixed" && p.salePrice ? `${p.salePrice} ${p.currency}` : getTxt("quoteOption"));

                  const displaySku = activeVariant ? activeVariant.sku : p.sku;
                  const displayBarcode = activeVariant ? activeVariant.barcode : p.barcode;
                  const displayShelf = activeVariant ? activeVariant.shelf : p.shelf;
                  const displayWarehouse = activeVariant ? activeVariant.warehouse : p.warehouse;
                  const displayQuantity = activeVariant ? activeVariant.quantity : p.quantity;
                  const isPricingFixed = activeVariant ? !!activeVariant.salePrice : p.pricingMode === "fixed" && !!p.salePrice;

                  // Fully translate dynamic data attributes (category, product name, description)
                  const finalCategory = translateProductField(p.category, "category", language);
                  const finalName = translateProductField(p.name, "name", language);
                  const finalDescription = translateProductField(p.description, "description", language);

                  return (
                    <article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <Link href={`/product/${p.id}`} className="block aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 overflow-hidden hover:opacity-90 transition">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={finalName} className="object-contain h-full w-full p-2" />
                          ) : (
                            <span className="text-3xl">⚙️</span>
                          )}
                        </Link>
                        
                        <div>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-black text-blue-800 uppercase">
                            {finalCategory}
                          </span>
                          <h3 className="font-black text-sm text-slate-800 mt-1 hover:text-blue-600 transition">
                            <Link href={`/product/${p.id}`}>{finalName}</Link>
                          </h3>
                          {p.description && (
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{finalDescription}</p>
                          )}
                          
                          <div className="text-[10px] text-slate-400 mt-2 space-y-0.5 border-t border-slate-50 pt-2 font-medium">
                            <p>{getTxt("skuLabel")} <b className="text-slate-700">{displaySku || "-"}</b></p>
                            <p>{getTxt("barcodeLabel")} <span className="text-slate-700">{displayBarcode || "-"}</span></p>
                            {isVirtualDelivery ? (
                              <>
                                <p>{getTxt("deliveryTypeLabel")} <span className="text-blue-700 font-bold">{getTxt("deliveryTypeValue")}</span></p>
                                <p>{getTxt("extraServiceLabel")} <span className="text-emerald-700 font-bold">{getTxt("extraServiceValue")}</span></p>
                              </>
                            ) : (
                              <>
                                <p>{getTxt("shelfAddressLabel")} <span className="text-blue-700 font-bold">{displayWarehouse} · {displayShelf || "-"}</span></p>
                                {displayQuantity && (
                                  <p>{getTxt("stockStatusLabel")} <span className="text-emerald-700 font-extrabold">{displayQuantity} {getTxt("pieces")}</span></p>
                                )}
                              </>
                            )}
                          </div>

                          {/* Variants Select Box */}
                          {hasVariants && (
                            <div className="mt-2.5 space-y-1">
                              <label className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">
                                {getTxt("selectVariant")}
                              </label>
                              <select
                                value={selectedVarId || p.variants?.[0]?.id}
                                onChange={(e) => {
                                  setSelectedVariants({
                                    ...selectedVariants,
                                    [p.id]: e.target.value
                                  });
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-black outline-none focus:border-blue-500 transition"
                              >
                                {p.variants?.map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.name} {v.salePrice ? `(${v.salePrice} ${p.currency})` : getTxt("quoteOption")}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 mt-2">
                        <span className="font-black text-xs text-slate-900">{displayPrice}</span>
                        <div className="flex gap-1.5">
                          {isPricingFixed ? (
                            <button
                              type="button"
                              onClick={() => {
                                checkProfileAndExecute(() => {
                                  const variantName = activeVariant ? ` (${activeVariant.name})` : "";
                                  setMessage(`${finalName}${variantName} ${getTxt("addedToCartMsg")}`);
                                });
                              }}
                              className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-black text-white hover:bg-slate-800 transition"
                            >
                              {getTxt("addToCart")}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                checkProfileAndExecute(() => {
                                  const variantName = activeVariant ? ` (${activeVariant.name})` : "";
                                  const finalProductName = `${finalName}${variantName}`;
                                  saveCustomerOffer(finalProductName, "quote");
                                  setMessage(`${finalProductName} ${getTxt("quoteSentMsg")}`);
                                });
                              }}
                              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-[10px] font-black text-white shadow-md shadow-blue-500/10 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg active:scale-95 transition-all duration-300"
                            >
                              {getTxt("requestQuote")}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* -------------------- 2. REAL ESTATE PORTFOLIO STOREFRONT -------------------- */}
        {storeType === "realEstate" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">{getTxt("estateStorefrontTitle")}</span>
              <h1 className="text-3xl font-black">Batumi Premium Real Estate</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                {getTxt("estateStoreDesc")}
              </p>
              {contactButtons}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {estateItems.map((estate) => (
                <article key={estate.trName} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="aspect-[16/9] rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center text-4xl">🏢</div>
                  
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${estate.type.tr === "Satılık" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                        {pickVal(estate.type, language)}
                      </span>
                      <h3 className="font-black text-sm text-slate-800 mt-1">{pickVal(estate.name, language)}</h3>
                    </div>
                    <span className="font-black text-sm text-slate-900 shrink-0">{pickVal(estate.price, language)}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100 font-bold text-slate-600">
                    <div>📏 {estate.area}</div>
                    <div>🛏️ {estate.rooms}</div>
                    <div>🏢 {getTxt("floorLabel")} {estate.floor}</div>
                    <div>🔥 {pickVal(estate.features, language) ? pickVal(estate.features, language).split(",")[1]?.trim() || getTxt("acLabel") : getTxt("acLabel")}</div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {pickVal(estate.features, language)} {getTxt("estateDescSuffix")}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        checkProfileAndExecute(() => {
                          const displayEstateName = pickVal(estate.name, language);
                          setMessage(`${displayEstateName} ${getTxt("viewingRequestSent")}`);
                        });
                      }}
                      className="rounded-xl bg-slate-900 py-2 text-xs font-black text-white hover:bg-slate-800 transition"
                    >
                      {getTxt("scheduleViewing")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOfferProduct(estate.trName);
                        setOfferValue("");
                      }}
                      className="rounded-xl border border-slate-200 bg-white py-2 text-xs font-black hover:bg-slate-50 transition"
                    >
                      {getTxt("makeOffer")}
                    </button>
                  </div>

                  {offerProduct === estate.trName && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 mt-3 space-y-2 animate-fadeIn">
                      <span className="text-[10px] font-black text-blue-900 block">{getTxt("offerPriceLabel")}</span>
                      <div className="flex gap-2">
                        <input
                          value={offerValue}
                          onChange={(e) => setOfferValue(e.target.value)}
                          placeholder={getTxt("offerPricePlaceholder")}
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            checkProfileAndExecute(() => {
                              saveCustomerOffer(estate.trName, "bid", offerValue);
                              const displayEstateName = pickVal(estate.name, language);
                              setMessage(`${displayEstateName} ${getTxt("offerSentMsg").replace("{value}", offerValue)}`);
                              setOfferProduct("");
                            });
                          }}
                          className="rounded-lg bg-blue-600 px-3 text-xs font-black text-white hover:bg-blue-700"
                        >
                          {getTxt("sendBtn")}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* -------------------- 3. HAIR SALON & APPOINTMENT STOREFRONT -------------------- */}
        {storeType === "salon" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">{getTxt("salonStorefrontTitle")}</span>
              <h1 className="text-3xl font-black">Trend Kuaför & Güzellik Merkezi</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                {getTxt("salonStoreDesc")}
              </p>
              {contactButtons}
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Service list catalog */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">{getTxt("serviceCatalog")}</h2>
                
                {salonServices.map((serv) => (
                  <div
                    key={serv.trName}
                    className={`rounded-xl border p-3.5 transition text-xs flex justify-between items-start gap-2 cursor-pointer ${selectedService === serv.trName ? "border-blue-500 bg-blue-50/50" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"}`}
                    onClick={() => setSelectedService(serv.trName)}
                  >
                    <div>
                      <h3 className="font-black text-slate-800">{pickVal(serv.name, language)}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">
                        🕒 {getTxt("durationLabel")} {pickVal(serv.duration, language)} | {getTxt("specialistsLabel")} {pickVal(serv.staff, language)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900 block">{serv.price}</span>
                      <span className={`text-[9px] font-black uppercase mt-1 inline-block ${selectedService === serv.trName ? "text-blue-600" : "text-slate-400"}`}>
                        {selectedService === serv.trName ? getTxt("selectedLabel") : getTxt("selectLabel")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic slot booking panel */}
              <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">{getTxt("bookNowTitle")}</h2>
                
                <div className="space-y-3">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-500">{getTxt("specialistSelectLabel")}</span>
                    <select
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none"
                    >
                      {staffOptions.map(opt => (
                        <option key={opt.tr} value={opt.tr}>
                          {pickVal(opt, language)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">{getTxt("availableSlotsToday")}</span>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black text-blue-900">
                      {["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg py-2 border transition ${selectedSlot === slot ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-100 hover:bg-blue-50"}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedSlot}
                    onClick={() => {
                      checkProfileAndExecute(() => {
                        const serviceObj = salonServices.find(s => s.trName === selectedService);
                        const displayService = serviceObj ? pickVal(serviceObj.name, language) : selectedService;
                        
                        const staffObj = staffOptions.find(s => s.tr === selectedStaff);
                        const displayStaff = staffObj ? pickVal(staffObj, language) : selectedStaff;

                        const appointmentMsg = `${displayService} ${getTxt("forAppointmentProcess")} ${displayStaff} ${getTxt("withSpecialistTodayAt")} ${selectedSlot} ${getTxt("appointmentSuccessMsg")}`;
                        setMessage(appointmentMsg);
                        setSelectedSlot("");
                      });
                    }}
                    className="w-full rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    {getTxt("confirmAppointment")} ({pickVal(salonServices.find(s => s.trName === selectedService)?.name, language) || selectedService})
                  </button>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* -------------------- 4. AUTO REPAIR & PROGRESS TRACKER -------------------- */}
        {storeType === "autoRepair" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">{getTxt("repairStorefrontTitle")}</span>
              <h1 className="text-3xl font-black">OBDTR Auto Repair & Service</h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                {getTxt("repairStoreDesc")}
              </p>
              {contactButtons}
            </div>

            <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Plate enter search */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 flex flex-col justify-center">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">{getTxt("plateTrackerTitle")}</h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{getTxt("plateTrackerSub")}</p>
                
                <div className="flex gap-2">
                  <input
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder={getTxt("platePlaceholder")}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowRepairTracker(true);
                      setMessage(`${plateNumber.toUpperCase()} ${getTxt("plateQueriedMsg")}`);
                    }}
                    className="rounded-xl bg-slate-900 px-4 text-xs font-black text-white hover:bg-slate-800 transition"
                  >
                    {getTxt("queryBtn")}
                  </button>
                </div>
              </div>

              {/* Dynamic visual tracker */}
              {showRepairTracker ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-600 block">{getTxt("repairInProgress")}</span>
                      <h3 className="font-black text-slate-800">Toyota Corolla · {plateNumber.toUpperCase()}</h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{getTxt("responsibleMechanic")} Giorgi Shavadze | {getTxt("checkInTime")} {getTxt("yesterday")} 14:30</p>
                    </div>

                    <div className="text-right">
                      <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-black text-amber-800">
                        {getTxt("repairPhaseLabel")}
                      </span>
                    </div>
                  </div>

                  {/* Gorgeous Multi-Stage Progress Track */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{getTxt("serviceProgressLabel")}</span>
                      <span className="text-blue-700">60% {getTxt("completedLabel")}</span>
                    </div>
                    
                    <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: "60%" }}></div>
                    </div>

                    <div className="grid grid-cols-5 text-center text-[8px] font-black text-slate-400 gap-1 pt-1.5 uppercase tracking-wider">
                      <div className="text-emerald-600">{getTxt("stageDiagnostics")}</div>
                      <div className="text-emerald-600">{getTxt("stagePartsSupply")}</div>
                      <div className="text-blue-700 font-extrabold animate-pulse">{getTxt("stageRepair")}</div>
                      <div>{getTxt("stageTestDrive")}</div>
                      <div>{getTxt("stageDelivery")}</div>
                    </div>
                  </div>

                  {/* Checklist of specific repair tasks */}
                  <div className="border-t border-slate-100 pt-3 space-y-2.5">
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">{getTxt("checklistTitle")}</h4>
                    
                    {autoRepairTasks.map((task) => (
                      <div key={task.name.tr} className="flex gap-3 text-xs leading-relaxed items-start">
                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${task.status === "completed" ? "bg-emerald-100 text-emerald-700" : task.status === "active" ? "bg-blue-100 text-blue-700 animate-spin" : "bg-slate-100 text-slate-400"}`}>
                          {task.status === "completed" ? "✓" : task.status === "active" ? "⚙️" : "○"}
                        </div>
                        <div>
                          <span className={`font-black ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-800"}`}>
                            {pickVal(task.name, language)}
                          </span>
                          <p className="text-[10px] text-slate-400 font-bold">{pickVal(task.note, language)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center italic text-slate-400 flex items-center justify-center">
                  {getTxt("queryPlatePrompt")}
                </div>
              )}
            </div>
          </section>
        )}

      </div>

      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/80 p-7 shadow-2xl backdrop-blur-2xl transition-all dark:border-slate-800 dark:bg-slate-900/90 text-slate-950 dark:text-white">
            {/* Header */}
            <div className="mb-5 text-center">
              <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-800 dark:text-blue-300">
                {getTxt("verificationTitle")}
              </span>
              <h3 className="mt-3 text-xl font-black">{getTxt("completeProfileTitle")}</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {getTxt("completeProfileSub")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">{getTxt("fullNameLabel")}</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">{getTxt("phoneLabel")}</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="+90 532 000 00 00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">{getTxt("cityLabel")}</label>
                <input
                  type="text"
                  required
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  placeholder="İstanbul"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-3 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {getTxt("cancelBtn")}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 py-3 text-sm font-black text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition duration-300"
                >
                  {getTxt("saveContinueBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium B2B Open Bulletin / Requests Board Call-To-Action Floating Bar */}
      <Link
        href="/requests"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t-2 border-indigo-500/50 bg-[#070c18]/90 py-4 px-5 sm:px-8 shadow-[0_-15px_40px_rgba(99,102,241,0.25)] backdrop-blur-lg transition-all duration-300 hover:bg-[#0b1328] group cursor-pointer ring-1 ring-indigo-500/20"
      >
        <span className="text-[11px] sm:text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-blue-200 uppercase flex items-center gap-2 group-hover:text-blue-100 transition-colors">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          💡 {getTxt("findWhatYouWantPrompt")}
        </span>
        <span className="text-xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-bounce transform group-hover:scale-125 transition-all duration-300 flex items-center shrink-0 text-white bg-indigo-600/30 p-2.5 rounded-full ring-2 ring-indigo-405 animate-pulse">
          📢
        </span>
      </Link>
    </main>
  );
}
