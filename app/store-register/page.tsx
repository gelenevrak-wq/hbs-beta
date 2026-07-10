"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import CompactLanguageSwitcher, { LanguageCode, isLanguageCode } from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";
import { sanitizeWhatsAppNumber } from "@/lib/phoneUtils";

type Step = "details" | "sector" | "warehouse" | "license" | "done";

const INITIAL_INDUSTRIES_MAP: Record<LanguageCode, string[]> = {
  tr: [
    "Oto yedek parçası",
    "Oto elektroniği",
    "Araba satışı",
    "Cep telefonu",
    "Elektronik ev aletleri",
    "Beyaz eşya",
    "Tekstil",
    "Oto lastik grubu",
    "Oto ve sanayi yağları",
    "Araç arıza tespit cihazları"
  ],
  en: [
    "Auto spare parts",
    "Auto electronics",
    "Car sales",
    "Mobile phones",
    "Home electronics",
    "White goods",
    "Textile",
    "Tires group",
    "Auto & industrial lubricants",
    "Vehicle diagnostic scanners"
  ],
  de: [
    "Kfz-Ersatzteile",
    "Kfz-Elektronik",
    "Autoverkauf",
    "Mobiltelefone",
    "Haushaltsgeräte",
    "Weiße Ware",
    "Textilien",
    "Reifengruppe",
    "Motoren- & Industrieöle",
    "Kfz-Diagnosegeräte"
  ],
  ru: [
    "Автозапчасти",
    "Автоэлектроника",
    "Продажа автомобилей",
    "Мобильные телефоны",
    "Бытовая электроника",
    "Бытовая техника",
    "Текстиль",
    "Автомобильные шины",
    "Автомобильные и промышленные масла",
    "Автосканеры и диагностика"
  ],
  ka: [
    "ავტონაწილები",
    "ავტო ელექტრონიკა",
    "ავტომობილების გაყიდვა",
    "მობილური ტელეფონები",
    "საოჯახო ელექტრონიკა",
    "საყოფაცხოვრებო ტექნიკა",
    "ტექსტილი",
    "საბურავები",
    "ავტო და ინდუსტრიული ზეთები",
    "დიაგნოსტიკური აპარატურა"
  ]
};

type WarehouseMap = {
  name: string;
  shelves: string[];
};

const texts = {
  tr: {
    home: "Ana Sayfa",
    step1: "1. Firma Bilgileri",
    step2: "2. Sektör & Model",
    step3: "3. Depo Yapısı",
    step4: "4. Lisans Bilgisi",
    title: "HBS İşletme Kaydı",
    subtitle: "Şirketinize ait genel bilgileri tanımlayın.",
    useCaseLabel: "Platform Kullanım Amacı *",
    useCaseStock: "📦 Sadece Stok Kontrolü",
    useCaseSales: "💰 Ürün Satışı & Teklif",
    companyLabel: "Mağaza / Firma Adı *",
    representativeLabel: "Yetkili Ad Soyad *",
    phoneLabel: "Telefon / WhatsApp *",
    emailLabel: "E-posta Adresi *",
    cityLabel: "Şehir *",
    passwordLabel: "Şifre *",
    taxLabel: "Vergi Numarası *",
    addressLabel: "Mağaza / Depo Adresi *",
    nextSectorBtn: "İleri: Sektör Seçimi",
    
    sectorTitle: "Sektör & Kategori Yönetimi",
    sectorSubtitle: "Mağazanızın faaliyet gösterdiği ana sektörü belirleyin.",
    sectorListLabel: "Sektör Listesi",
    otherOption: "Diğer (Listede yoksa elle yazın...)",
    customSectorLabel: "Yeni Sektör İsmi *",
    customSectorHint: "Bu sektörü eklediğinizde sistem bir sonraki mağaza açılışlarında sektörü otomatik listeye dahil edecektir.",
    operatingModelLabel: "🏢 Mağaza İşletim Modeli *",
    modelPhysical: "🏪 Fiziksel Mağaza / Sabit Depo",
    modelPhysicalDesc: "Müşterilerin arama yaptıklarında belirledikleri yarıçap içindeki fiziksel konumuma göre listelenirim.",
    modelVirtual: "🌍 Sanal Mağaza (Adrese Teslim & Yerinde Kurulum)",
    modelVirtualDesc: "Fiziksel raf/stoğu tek bir lokal dükkanda tutmayan, ülke çapında teslimat veya yerinde elden kurulum ve eğitim hizmeti sunan mağazalar.",
    countriesLabel: "🌍 Hizmet Verilecek Ülkeler:",
    countriesHint: "✓ Bu seçenekteki ürünler, seçtiğiniz ülkelerin tamamında müşterinin arama yarıçapından bağımsız olarak her zaman en üstte görünür olacaktır.",
    serviceWarningTitle: "Hizmet / Ürün Tipi Uyarı",
    serviceWarningDesc: "HBS sadece ürün satan mağazalar değil, randevu veya teklif usulü çalışan hizmet ve kiralama mağazaları için de tasarlanmıştır. Paneliniz bu seçime göre otomatik optimize edilir.",
    backBtn: "Geri",
    nextWarehouseBtn: "İleri: Depo Haritalandırma",
    
    whTitle: "Depo Haritalandırma Sihirbazı",
    whSubtitle: "Fiziksel veya sanal depolarınızı ve raflarınızı şimdiden eşleştirerek zaman kazanın.",
    whSelectionLabel: "Depo Seçimi",
    whShelfCount: "raf konumu",
    whAddPlaceholder: "Yeni Depo...",
    whAddBtn: "+ Depo Ekle",
    whShelvesTitle: "Raf Konumları",
    whShelfPlaceholder: "Örn: A-01 veya GRID-B",
    whShelfAddBtn: "Raf Ekle",
    whNoShelves: "Bu depoya henüz raf konumu eklenmedi.",
    nextLicenseBtn: "İleri: Lisanslama",
    
    licenseTitle: "Lisans & SaaS Politikası",
    licenseSubtitle: "HBS mağaza lisans yapısı ve deneme süresi kuralları.",
    partnerTitle: "🛡️ Ortak / Partner Muafiyeti Aktif",
    partnerDesc: "Sistem OBDTR ortağınızın mağaza kaydını başarıyla algıladı! OBDTR mağazasına süre sınırı ve lisans kısıtlaması konulmayacak, süresiz tam lisanslı ücretsiz tanımlanacaktır.",
    trialTitle: "🎁 30 Günlük Ücretsiz Deneme Süresi",
    trialDesc: "HBS sistemimizi 1 ay boyunca ücretsiz deneyebilirsiniz. Deneme süresinin bitimine 3 gün kala sistem satıcı paneline lisans hatırlatma bildirimleri yollar. Süre sonunda lisans anahtarı girilmezse mağaza otomatik askıya alınır.",
    saasPackagesTitle: "Esnek SaaS Paketleri",
    saasPackagesDesc: "Ödeme yapıldıktan sonra aldığınız pakete bağlı olarak 3 ay, 6 ay veya 1 yıllık lisans anahtarları aktif edilir. Lisans ücretleri;",
    saasPackageUser: "Kullanıcı sayısına (Patron, Müdür, Depo Sorumlusu, Muhasebeci vb.)",
    saasPackageWarehouse: "Depo / Şube sayısına",
    saasPackageProduct: "Maksimum stok ürün limitine göre değişir.",
    registeringBtn: "Kuruluyor...",
    registerPartnerBtn: "Sınırsız Mağazayı Oluştur",
    registerTrialBtn: "30 Günlük Denemeyi Başlat",
    
    doneTitle: "HBS Mağazanız Kuruldu!",
    doneDesc: "Mağaza altyapısı ve {count} adet depo/raf haritalandırması başarıyla tamamlandı. İş modelinize uygun yönetim modülleri panelinizde hazır hale getirilmiştir.",
    doneInfoTitle: "Kullanım Bilgisi:",
    doneInfoDesc: "Giriş yaptıktan sonra ürün eklerken {name} için belirlediğiniz raf konumlarını doğrudan seçebilirsiniz.",
    doneDashboardBtn: "Mağaza Yönetim Paneline Git",
    doneHomeBtn: "Ana Sayfaya Dön",
    
    emailTakenError: "Bu e-posta adresiyle kayıtlı bir mağaza zaten mevcut. Lütfen başka bir e-posta kullanın.",
    tableError: "Firma tablosu hatası: ",
    systemError: "Sistem hatası: ",
    defaultAddress: "Sanal Mağaza, Türkiye çapında kargolama",
    defaultWhName: "Ana Depo"
  },
  en: {
    home: "Home",
    step1: "1. Store Info",
    step2: "2. Sector & Model",
    step3: "3. Warehouses",
    step4: "4. License Info",
    title: "HBS Business Registration",
    subtitle: "Define general information about your company.",
    useCaseLabel: "Platform Purpose *",
    useCaseStock: "📦 Stock Control Only",
    useCaseSales: "💰 Product Sales & Bidding",
    companyLabel: "Store / Company Name *",
    representativeLabel: "Authorized Person *",
    phoneLabel: "Phone / WhatsApp *",
    emailLabel: "Email Address *",
    cityLabel: "City *",
    passwordLabel: "Password *",
    taxLabel: "Tax / VAT ID *",
    addressLabel: "Store / Warehouse Address *",
    nextSectorBtn: "Next: Sector Selection",
    
    sectorTitle: "Sector & Category Management",
    sectorSubtitle: "Determine the main sector your store operates in.",
    sectorListLabel: "Sector List",
    otherOption: "Other (Type manually if not in list...)",
    customSectorLabel: "New Sector Name *",
    customSectorHint: "When you add this sector, the system will automatically include it in the list for future store setups.",
    operatingModelLabel: "🏢 Store Operating Model *",
    modelPhysical: "🏪 Physical Store / Fixed Warehouse",
    modelPhysicalDesc: "I will be listed according to my physical location within the search radius specified by the customers.",
    modelVirtual: "🌍 Virtual Store (Delivery & On-site Setup)",
    modelVirtualDesc: "Stores that do not keep physical stock in a single local shop, offering nationwide delivery or on-site setup and training services.",
    countriesLabel: "🌍 Service Countries:",
    countriesHint: "✓ Products in this model will always appear at the top in all selected countries, regardless of search radius.",
    serviceWarningTitle: "Service / Product Type Notice",
    serviceWarningDesc: "HBS is designed not only for product stores but also for service and rental stores operating by appointment or quotation. Your dashboard will be optimized accordingly.",
    backBtn: "Back",
    nextWarehouseBtn: "Next: Warehouse Mapping",
    
    whTitle: "Warehouse Mapping Wizard",
    whSubtitle: "Save time by mapping your physical or virtual warehouses and shelves now.",
    whSelectionLabel: "Warehouse Selection",
    whShelfCount: "shelves",
    whAddPlaceholder: "New Warehouse...",
    whAddBtn: "+ Add Warehouse",
    whShelvesTitle: "Shelf Locations",
    whShelfPlaceholder: "e.g., A-01 or GRID-B",
    whShelfAddBtn: "Add Shelf",
    whNoShelves: "No shelf locations have been added to this warehouse yet.",
    nextLicenseBtn: "Next: Licensing",
    
    licenseTitle: "License & SaaS Policy",
    licenseSubtitle: "HBS store license structure and trial rules.",
    partnerTitle: "🛡️ Partner Exemption Active",
    partnerDesc: "System detected your OBDTR partner store registration! OBDTR store will have no time limit or license restrictions, with lifetime full license.",
    trialTitle: "🎁 30-Day Free Trial",
    trialDesc: "You can try HBS free for 1 month. The system sends alerts to the panel 3 days before the trial ends. If no license key is entered, the store is suspended.",
    saasPackagesTitle: "Flexible SaaS Packages",
    saasPackagesDesc: "After payment, 3-month, 6-month, or 1-year license keys are activated. License fees depend on:",
    saasPackageUser: "Number of users (Owner, Manager, Staff, Accountant, etc.)",
    saasPackageWarehouse: "Number of Warehouses / Branches",
    saasPackageProduct: "Maximum stock product limits.",
    registeringBtn: "Setting up...",
    registerPartnerBtn: "Create Unlimited Store",
    registerTrialBtn: "Start 30-Day Trial",
    
    doneTitle: "Your HBS Store is Set Up!",
    doneDesc: "Store infrastructure and {count} warehouse/shelf mappings successfully completed. Management modules optimized for your model are ready.",
    doneInfoTitle: "Usage Information:",
    doneInfoDesc: "When adding products, you can directly select the shelf locations you defined for {name}.",
    doneDashboardBtn: "Go to Store Dashboard",
    doneHomeBtn: "Return to Homepage",
    
    emailTakenError: "A store registered with this email already exists. Please use another email.",
    tableError: "Company table error: ",
    systemError: "System error: ",
    defaultAddress: "Virtual Store, Shipping Nationwide",
    defaultWhName: "Main Warehouse"
  },
  de: {
    home: "Startseite",
    step1: "1. Shop-Info",
    step2: "2. Sektor & Modell",
    step3: "3. Lagerstruktur",
    step4: "4. Lizenz-Info",
    title: "HBS Geschäftsregistrierung",
    subtitle: "Definieren Sie allgemeine Informationen über Ihr Unternehmen.",
    useCaseLabel: "Plattform-Zweck *",
    useCaseStock: "📦 Nur Bestandskontrolle",
    useCaseSales: "💰 Produktverkauf & Angebote",
    companyLabel: "Shop- / Firmenname *",
    representativeLabel: "Bevollmächtigte Person *",
    phoneLabel: "Telefon / WhatsApp *",
    emailLabel: "E-Mail-Adresse *",
    cityLabel: "Stadt *",
    passwordLabel: "Passwort *",
    taxLabel: "Steuernummer *",
    addressLabel: "Shop- / Lageradresse *",
    nextSectorBtn: "Weiter: Sektorauswahl",
    
    sectorTitle: "Sektor- & Kategorieverwaltung",
    sectorSubtitle: "Bestimmen Sie den Hauptsektor, in dem Ihr Shop tätig ist.",
    sectorListLabel: "Sektorenliste",
    otherOption: "Andere (Manuell eingeben, wenn nicht in der Liste...)",
    customSectorLabel: "Neuer Sektorname *",
    customSectorHint: "Wenn Sie diesen Sektor hinzufügen, wird das System ihn automatisch in die Liste für zukünftige Einrichtungen aufnehmen.",
    operatingModelLabel: "🏢 Shop-Betriebsmodell *",
    modelPhysical: "🏪 Physischer Shop / Festes Lager",
    modelPhysicalDesc: "Ich werde basierend auf meinem physischen Standort innerhalb des von den Kunden angegebenen Suchradius gelistet.",
    modelVirtual: "🌍 Virtueller Shop (Lieferung & Vor-Ort-Einrichtung)",
    modelVirtualDesc: "Shops, die keinen physischen Bestand in einem einzigen lokalen Geschäft führen, sondern landesweiten Versand oder Vor-Ort-Installation anbieten.",
    countriesLabel: "🌍 Serviceländer:",
    countriesHint: "✓ Produkte in diesem Modell erscheinen immer ganz oben in allen ausgewählten Ländern, unabhängig vom Suchradius.",
    serviceWarningTitle: "Service- / Produkttyp-Hinweis",
    serviceWarningDesc: "HBS ist nicht nur für Produktshops, sondern auch für Dienstleistungs- und Mietshops nach Terminvereinbarung konzipiert. Ihr Dashboard wird entsprechend optimiert.",
    backBtn: "Zurück",
    nextWarehouseBtn: "Weiter: Lagerzuordnung",
    
    whTitle: "Lagerzuordnungs-Assistent",
    whSubtitle: "Sparen Sie Zeit, indem Sie Ihre physischen oder virtuellen Lager und Regale jetzt zuordnen.",
    whSelectionLabel: "Lagerauswahl",
    whShelfCount: "Regale",
    whAddPlaceholder: "Neues Lager...",
    whAddBtn: "+ Lager hinzufügen",
    whShelvesTitle: "Regalstandorte",
    whShelfPlaceholder: "z.B. A-01 oder GRID-B",
    whShelfAddBtn: "Regal hinzufügen",
    whNoShelves: "Diesem Lager wurden noch keine Regalstandorte hinzugefügt.",
    nextLicenseBtn: "Weiter: Lizenzierung",
    
    licenseTitle: "Lizenz & SaaS-Richtlinie",
    licenseSubtitle: "HBS Shoplizenzstruktur und Testregeln.",
    partnerTitle: "🛡️ Partner-Freistellung aktiv",
    partnerDesc: "System hat Ihre OBDTR Partner-Shop-Registrierung erkannt! Der OBDTR-Shop hat kein Zeitlimit oder Lizenzbeschränkungen und erhält eine lebenslange Volllizenz.",
    trialTitle: "🎁 30-tägige kostenlose Testversion",
    trialDesc: "Sie können HBS 1 Monat kostenlos testen. Das System sendet 3 Tage vor Ablauf Warnungen an das Panel. Wenn kein Lizenzschlüssel eingegeben wird, wird der Shop gesperrt.",
    saasPackagesTitle: "Flexible SaaS-Pakete",
    saasPackagesDesc: "Nach Zahlung werden 3-Monats-, 6-Monats- oder 1-Jahres-Lizenzschlüssel aktiviert. Lizenzgebühren hängen ab von:",
    saasPackageUser: "Anzahl der Benutzer (Inhaber, Manager, Mitarbeiter, Buchhalter usw.)",
    saasPackageWarehouse: "Anzahl der Lager / Filialen",
    saasPackageProduct: "Maximale Bestandsgrenzen.",
    registeringBtn: "Einrichtung läuft...",
    registerPartnerBtn: "Unbegrenzten Shop erstellen",
    registerTrialBtn: "30-Tage-Testversion starten",
    
    doneTitle: "Ihr HBS-Shop ist eingerichtet!",
    doneDesc: "Shop-Infrastruktur und {count} Lager-/Regalzuordnungen erfolgreich abgeschlossen. Die für Ihr Modell optimierten Verwaltungsmodule sind bereit.",
    doneInfoTitle: "Nutzungsinformationen:",
    doneInfoDesc: "Beim Hinzufügen von Produkten können Sie die für {name} definierten Regalstandorte direkt auswählen.",
    doneDashboardBtn: "Zum Shop-Dashboard",
    doneHomeBtn: "Zur Startseite zurückkehren",
    
    emailTakenError: "Ein mit dieser E-Mail registrierter Shop existiert bereits. Bitte verwenden Sie eine andere E-Mail.",
    tableError: "Firmentabellen-Fehler: ",
    systemError: "Systemfehler: ",
    defaultAddress: "Virtueller Shop, landesweiter Versand",
    defaultWhName: "Hauptlager"
  },
  ru: {
    home: "Главная",
    step1: "1. Информация о магазине",
    step2: "2. Сектор и модель",
    step3: "3. Складская структура",
    step4: "4. Лицензия",
    title: "Регистрация бизнеса HBS",
    subtitle: "Определите общую информацию о вашей компании.",
    useCaseLabel: "Цель платформы *",
    useCaseStock: "📦 Только контроль запасов",
    useCaseSales: "💰 Продажа товаров и предложения",
    companyLabel: "Название магазина / компании *",
    representativeLabel: "Уполномоченное лицо *",
    phoneLabel: "Телефон / WhatsApp *",
    emailLabel: "Email *",
    cityLabel: "Город *",
    passwordLabel: "Пароль *",
    taxLabel: "ИНН / Налоговый код *",
    addressLabel: "Адрес магазина / склада *",
    nextSectorBtn: "Далее: Выбор сектора",
    
    sectorTitle: "Управление секторами и категориями",
    sectorSubtitle: "Определите основной сектор, в котором работает ваш магазин.",
    sectorListLabel: "Список секторов",
    otherOption: "Другое (введите вручную, если нет в списке...)",
    customSectorLabel: "Название нового сектора *",
    customSectorHint: "При добавлении нового сектора система автоматически сохранит его в списке для будущих регистраций.",
    operatingModelLabel: "🏢 Модель работы магазина *",
    modelPhysical: "🏪 Физический магазин / Фиксированный склад",
    modelPhysicalDesc: "Мой магазин будет отображаться в результатах поиска на основе его физического местоположения в радиусе поиска клиента.",
    modelVirtual: "🌍 Виртуальный магазин (Доставка и настройка на месте)",
    modelVirtualDesc: "Магазины без фиксированного склада в одном месте, предлагающие доставку по стране или установку на месте.",
    countriesLabel: "🌍 Страны обслуживания:",
    countriesHint: "✓ Товары этой модели всегда будут отображаться вверху в выбранных странах, независимо от радиуса поиска.",
    serviceWarningTitle: "Обратите внимание",
    serviceWarningDesc: "HBS разработан не только для товарных магазинов, но и для сферы услуг и аренды. Ваша панель будет оптимизирована под выбранную модель.",
    backBtn: "Назад",
    nextWarehouseBtn: "Далее: Структура склада",
    
    whTitle: "Мастер настройки склада",
    whSubtitle: "Сэкономьте время, настроив свои физические или виртуальные склады и полки прямо сейчас.",
    whSelectionLabel: "Выбор склада",
    whShelfCount: "полок",
    whAddPlaceholder: "Новый склад...",
    whAddBtn: "+ Добавить склад",
    whShelvesTitle: "Расположение полок",
    whShelfPlaceholder: "например, A-01 или GRID-B",
    whShelfAddBtn: "Добавить полку",
    whNoShelves: "В этот склад еще не добавлены полки.",
    nextLicenseBtn: "Далее: Лицензирование",
    
    licenseTitle: "Лицензирование и SaaS политика",
    licenseSubtitle: "Лицензионная структура HBS и правила пробного периода.",
    partnerTitle: "🛡️ Партнерское освобождение активно",
    partnerDesc: "Система определила регистрацию партнерского магазина OBDTR! Магазин OBDTR получит пожизненную бесплатную лицензию без ограничений по времени.",
    trialTitle: "🎁 Пробный период 30 дней",
    trialDesc: "Вы можете тестировать HBS бесплатно в течение 1 месяца. За 3 дня до окончания пробного периода система отправит предупреждение. Если ключ не будет введен, магазин будет заблокирован.",
    saasPackagesTitle: "Гибкие SaaS тарифы",
    saasPackagesDesc: "После оплаты активируются ключи на 3, 6 месяцев или 1 год. Стоимость лицензии зависит от:",
    saasPackageUser: "Количества пользователей (Владелец, Менеджер, Персонал, Бухгалтер и т.д.)",
    saasPackageWarehouse: "Количества складов / филиалов",
    saasPackageProduct: "Максимального лимита товаров.",
    registeringBtn: "Настройка...",
    registerPartnerBtn: "Создать партнерский магазин",
    registerTrialBtn: "Начать пробный период",
    
    doneTitle: "Ваш магазин HBS настроен!",
    doneDesc: "Инфраструктура магазина и {count} склада/полки успешно настроены. Модули управления готовы к использованию.",
    doneInfoTitle: "Информация об использовании:",
    doneInfoDesc: "При добавлении товаров вы сможете напрямую выбирать полки, настроенные для {name}.",
    doneDashboardBtn: "Перейти в панель управления",
    doneHomeBtn: "Вернуться на главную",
    
    emailTakenError: "Магазин с таким адресом электронной почты уже зарегистрирован. Пожалуйста, используйте другой email.",
    tableError: "Ошибка таблицы компании: ",
    systemError: "Системная ошибка: ",
    defaultAddress: "Виртуальный магазин, доставка по всей стране",
    defaultWhName: "Основной склад"
  },
  ka: {
    home: "მთავარი",
    step1: "1. მაღაზიის ინფო",
    step2: "2. სექტორი და მოდელი",
    step3: "3. საწყობის სტრუქტურა",
    step4: "4. ლიცენზია",
    title: "HBS ბიზნეს რეგისტრაცია",
    subtitle: "განსაზღვრეთ ზოგადი ინფორმაცია თქვენი კომპანიის შესახებ.",
    useCaseLabel: "პლატფორმის მიზანი *",
    useCaseStock: "📦 მხოლოდ მარაგების კონტროლი",
    useCaseSales: "💰 პროდუქტის გაყიდვა და შეთავაზება",
    companyLabel: "მაღაზიის / კომპანიის სახელი *",
    representativeLabel: "უფლებამოსილი პირი *",
    phoneLabel: "ტელეფონი / WhatsApp *",
    emailLabel: "ელფოსტის მისამართი *",
    cityLabel: "ქალაქი *",
    passwordLabel: "პაროლი *",
    taxLabel: "საიდენტიფიკაციო კოდი *",
    addressLabel: "მაღაზიის / საწყობის მისამართი *",
    nextSectorBtn: "შემდეგი: სექტორის არჩევა",
    
    sectorTitle: "სექტორისა და კატეგორიების მართვა",
    sectorSubtitle: "განსაზღვრეთ ძირითადი სექტორი, რომელშიც თქვენი მაღაზია საქმიანობს.",
    sectorListLabel: "სექტორების სია",
    otherOption: "სხვა (ჩაწერეთ ხელით, თუ სიაში არ არის...)",
    customSectorLabel: "ახალი სექტორის სახელი *",
    customSectorHint: "ამ სექტორის დამატებისას, სისტემა მას ავტომატურად შეიყვანს სიაში მომავალი რეგისტრაციებისთვის.",
    operatingModelLabel: "🏢 მაღაზიის საოპერაციო მოდელი *",
    modelPhysical: "🏪 ფიზიკური მაღაზია / ფიქსირებული საწყობი",
    modelPhysicalDesc: "მე ვიქნები ნაჩვენები მომხმარებლის ძიების რადიუსის შესაბამისად.",
    modelVirtual: "🌍 ვირტუალური მაღაზია (მიწოდება და ადგილზე მონტაჟი)",
    modelVirtualDesc: "მაღაზიები, რომლებსაც არ აქვთ ფიზიკური მარაგი ერთ კონკრეტულ ადგილას, და სთავაზობენ მიწოდებას ქვეყნის მასშტაბით.",
    countriesLabel: "🌍 მომსახურების ქვეყნები:",
    countriesHint: "✓ ამ მოდელის პროდუქტები ყოველთვის გამოჩნდება სიის სათავეში არჩეულ ქვეყნებში, ძიების რადიუსის მიუხედავად.",
    serviceWarningTitle: "მნიშვნელოვანი შეტყობინება",
    serviceWarningDesc: "HBS შექმნილია როგორც პროდუქტების, ასევე მომსახურებისა და ქირაობის მაღაზიებისთვის. თქვენი მართვის პანელი ოპტიმიზირებული იქნება არჩეული მოდელის შესაბამისად.",
    backBtn: "უკან",
    nextWarehouseBtn: "შემდეგი: საწყობის რუკა",
    
    whTitle: "საწყობის რუკის ასისტენტი",
    whSubtitle: "დაზოგეთ დრო საწყობებისა და თაროების წინასწარ კონფიგურაციით.",
    whSelectionLabel: "საწყობის არჩევა",
    whShelfCount: "თარო",
    whAddPlaceholder: "ახალი საწყობი...",
    whAddBtn: "+ საწყობის დამატება",
    whShelvesTitle: "თაროების მდებარეობა",
    whShelfPlaceholder: "მაგ: A-01 ან GRID-B",
    whShelfAddBtn: "თაროს დამატება",
    whNoShelves: "ამ საწყობში თაროები ჯერ არ არის დამატებული.",
    nextLicenseBtn: "შემდეგი: ლიცენზია",
    
    licenseTitle: "ლიცენზია და SaaS პოლიტიკა",
    licenseSubtitle: "HBS მაღაზიის ლიცენზიის სტრუქტურა და საცდელი ვადის წესები.",
    partnerTitle: "🛡️ პარტნიორის შეღავათი აქტიურია",
    partnerDesc: "სისტემამ ამოიცნო OBDTR პარტნიორი მაღაზიის რეგისტრაცია! OBDTR მაღაზიას არ ექნება დროის ლიმიტი ან ლიცენზიის შეზღუდვები და მიიღებს უვადო უფასო ლიცენზიას.",
    trialTitle: "🎁 30-დღიანი უფასო საცდელი პერიოდი",
    trialDesc: "HBS-ის ტესტირება შეგიძლიათ უფასოდ 1 თვის განმავლობაში. საცდელი პერიოდის დასრულებამდე 3 დღით ადრე სისტემა გამოგიგზავნით შეტყობინებას. ლიცენზიის კოდის არშეყვანის შემთხვევაში მაღაზია დაიბლოკება.",
    saasPackagesTitle: "მოქნილი SaaS პაკეტები",
    saasPackagesDesc: "გადახდის შემდეგ აქტიურდება 3, 6-თვიანი ან 1-წლიანი ლიცენზიის კოდები. ლიცენზიის ფასი დამოკიდებულია:",
    saasPackageUser: "მომხმარებლების რაოდენობაზე (მფლობელი, მენეჯერი, პერსონალი, ბუღალტერი და ა.შ.)",
    saasPackageWarehouse: "საწყობების / ფილიალების რაოდენობაზე",
    saasPackageProduct: "პროდუქტების მაქსიმალურ ლიმიტზე.",
    registeringBtn: "მიმდინარეობს კონფიგურაცია...",
    registerPartnerBtn: "პარტნიორი მაღაზიის შექმნა",
    registerTrialBtn: "საცდელი პერიოდის დაწყება",
    
    doneTitle: "თქვენი HBS მაღაზია შეიქმნა!",
    doneDesc: "მაღაზიის ინფრასტრუქტურა და {count} საწყობი/თარო წარმატებით დარეგისტრირდა. მართვის მოდულები მზადაა გამოსაყენებლად.",
    doneInfoTitle: "გამოყენების ინფორმაცია:",
    doneInfoDesc: "პროდუქტების დამატებისას შეგიძლიათ პირდაპირ აირჩიოთ თაროები, რომლებიც დააყენეთ {name}-სთვის.",
    doneDashboardBtn: "მაღაზიის მართვის პანელზე გადასვლა",
    doneHomeBtn: "მთავარ გვერდზე დაბრუნება",
    
    emailTakenError: "ამ ელფოსტით რეგისტრირებული მაღაზია უკვე არსებობს. გთხოვთ გამოიყენოთ სხვა ელფოსტა.",
    tableError: "კომპანიის ცხრილის შეცდომა: ",
    systemError: "სისტემური შეცდომა: ",
    defaultAddress: "ვირტუალური მაღაზია, მიწოდება მთელი ქვეყნის მასშტაბით",
    defaultWhName: "მთავარი საწყობი"
  }
};

export default function StoreRegisterPage() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [step, setStep] = useState<Step>("details");
  const [companyName, setCompanyName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState(""); 
  const [useCase, setUseCase] = useState<"stock_only" | "sales">("sales");
  const [taxNumber, setTaxNumber] = useState("");
  
  // Sector list from local storage + initial
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");

  const t = texts[language];

  // Load custom industries
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    const activeLanguage = isLanguageCode(savedLanguage) ? savedLanguage : "tr";
    setLanguage(activeLanguage);

    const initialList = INITIAL_INDUSTRIES_MAP[activeLanguage];
    setSelectedIndustry(initialList[0]);

    const storedCustom = window.localStorage.getItem("hbs-custom-industries");
    if (storedCustom) {
      try {
        const parsed = JSON.parse(storedCustom) as string[];
        setIndustries([...initialList, ...parsed]);
      } catch {
        setIndustries(initialList);
      }
    } else {
      setIndustries(initialList);
    }
  }, []);

  // Warehouse Map Initial state
  const [warehouses, setWarehouses] = useState<WarehouseMap[]>([
    { name: t.defaultWhName, shelves: ["A-01", "A-02", "B-01", "B-02"] }
  ]);
  const [newWhName, setNewWhName] = useState("");
  const [newShelf, setNewShelf] = useState("");
  const [activeWhIndex, setActiveWhIndex] = useState(0);

  // Sync warehouse name language changes on startup
  useEffect(() => {
    setWarehouses([
      { name: t.defaultWhName, shelves: ["A-01", "A-02", "B-01", "B-02"] }
    ]);
  }, [language]);

  // License & Partner Exemption
  const [isPartner, setIsPartner] = useState(false);
  const [licenseType, setLicenseType] = useState<"trial" | "lifetime">("trial");
  
  // Store Operating Model & Countries Served
  const [operatingModel, setOperatingModel] = useState<"physical" | "virtual_delivery">("physical");
  const [serviceCountries, setServiceCountries] = useState<string[]>(["TR", "GE"]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Partner Exemption Check
  useEffect(() => {
    const isObdtr = companyName.toUpperCase().includes("OBDTR") || email.toLowerCase().includes("obdtr.com");
    setIsPartner(isObdtr);
    setLicenseType(isObdtr ? "lifetime" : "trial");
    if (isObdtr) {
      setOperatingModel("virtual_delivery");
    }
  }, [companyName, email]);

  function handleAddWarehouse() {
    if (!newWhName.trim()) return;
    setWarehouses([...warehouses, { name: newWhName, shelves: [] }]);
    setNewWhName("");
    setActiveWhIndex(warehouses.length);
  }

  function handleAddShelf() {
    if (!newShelf.trim()) return;
    const updated = [...warehouses];
    if (!updated[activeWhIndex].shelves.includes(newShelf.toUpperCase())) {
      updated[activeWhIndex].shelves.push(newShelf.toUpperCase());
    }
    setWarehouses(updated);
    setNewShelf("");
  }

  function handleRemoveShelf(shelfIndex: number) {
    const updated = [...warehouses];
    updated[activeWhIndex].shelves.splice(shelfIndex, 1);
    setWarehouses(updated);
  }

  async function handleRegisterStore() {
    setError("");
    setLoading(true);

    const emailCheck = email.trim().toLowerCase();
    try {
      const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      const isEmailTaken = localStores.some((store: any) => store.email.toLowerCase() === emailCheck);
      if (isEmailTaken) {
        setError(t.emailTakenError);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    const finalAddress = address.trim() || t.defaultAddress;
    let finalIndustry = selectedIndustry;
    if (selectedIndustry === "other" && customIndustry.trim()) {
      finalIndustry = customIndustry.trim();
      const storedCustom = JSON.parse(window.localStorage.getItem("hbs-custom-industries") || "[]");
      if (!storedCustom.includes(finalIndustry)) {
        storedCustom.push(finalIndustry);
        window.localStorage.setItem("hbs-custom-industries", JSON.stringify(storedCustom));
      }
    }

    const companyCode = companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      if (isSupabaseConfigured) {
        // Supabase Auth signup
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: representative,
              phone,
              role: "owner",
            }
          }
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          const trialEnds = isPartner ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          const { data: companyData, error: compError } = await supabase
            .from("companies")
            .insert({
              name: companyName,
              code: companyCode,
              industry_category: finalIndustry,
              default_language: language,
              main_currency: "GEL",
              phone: sanitizeWhatsAppNumber(phone),
              whatsapp: sanitizeWhatsAppNumber(phone),
              address: finalAddress,
              city,
              trial_ends_at: trialEnds,
              license_ends_at: isPartner ? null : new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(),
              is_suspended: false,
              max_users: isPartner ? 99999 : 3,
              max_warehouses: isPartner ? 99999 : 1,
              max_products: isPartner ? 99999 : 250,
            })
            .select("id")
            .single();

          if (compError) {
            setError(`${t.tableError}${compError.message}`);
            setLoading(false);
            return;
          }

          if (companyData) {
            // Update user profile
            await supabase
              .from("profiles")
              .update({
                company_id: companyData.id,
                role: "owner",
              })
              .eq("id", data.user.id);

            // Store initial warehouses
            for (const wh of warehouses) {
              const { data: whData } = await supabase.from("warehouses").insert({
                company_id: companyData.id,
                name: wh.name,
                type: "store",
                address: finalAddress,
                is_sales_enabled: true,
                is_transfer_enabled: true,
              }).select("id").single();

              if (whData) {
                for (const shelf of wh.shelves) {
                  await supabase.from("warehouse_locations").insert({
                    warehouse_id: whData.id,
                    name: shelf,
                    sort_order: 10,
                  });
                }
              }
            }
          }
        }
      }

      // Offline / LocalStorage registry
      const trialDays = isPartner ? 99999 : 30;
      const trialEnds = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();
      const warningEnds = new Date(Date.now() + (trialDays + 3) * 24 * 60 * 60 * 1000).toISOString();

      const newCompanyObj = {
        name: companyName,
        code: companyCode,
        representative,
        email,
        phone,
        city,
        address: finalAddress,
        industry: finalIndustry,
        trialEndsAt: trialEnds,
        warningEndsAt: warningEnds,
        licenseType: isPartner ? "lifetime" : "trial",
        isSuspended: false,
        maxUsers: isPartner ? 99999 : 3,
        maxWarehouses: isPartner ? 99999 : 1,
        maxProducts: isPartner ? 99999 : 250,
        warehouses: warehouses,
        createdAt: new Date().toISOString(),
        operatingModel: operatingModel,
        serviceCountries: serviceCountries,
        useCase: useCase,
        taxNumber: useCase === "sales" ? taxNumber : "",
      };

      const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      localStores.push(newCompanyObj);
      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(localStores));

      // Log in user as owner
      window.localStorage.setItem(
        "hbs-current-user",
        JSON.stringify({
          username: email,
          displayName: representative,
          role: "owner",
          storeSlugs: [companyCode],
          signedInAt: new Date().toISOString(),
        })
      );

      setStep("done");
    } catch (err: any) {
      setError(`${t.systemError}${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur px-3 py-3 shadow-sm flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight text-blue-600">HBS</Link>
        <div className="flex items-center gap-2">
          <CompactLanguageSwitcher />
          <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black shadow-sm">{t.home}</Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl w-full px-2 py-4 flex-1">
        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-md sm:p-6">
          
          {/* Steps Progress Indicator */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3 text-[10px] font-black text-slate-450 uppercase tracking-wider">
            <span className={step === "details" ? "text-blue-600" : ""}>{t.step1}</span>
            <span>➔</span>
            <span className={step === "sector" ? "text-blue-600" : ""}>{t.step2}</span>
            <span>➔</span>
            <span className={step === "warehouse" ? "text-blue-600" : ""}>{t.step3}</span>
            <span>➔</span>
            <span className={step === "license" ? "text-blue-600" : ""}>{t.step4}</span>
          </div>

          {step === "details" && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-black tracking-tight">{t.title}</h1>
                <p className="mt-0.5 text-xs text-slate-500">{t.subtitle}</p>
              </div>

              {/* Purpose Selection */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-650">{t.useCaseLabel}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUseCase("stock_only");
                      setTaxNumber("");
                    }}
                    className={`rounded-xl border p-2.5 text-center transition text-xs ${useCase === "stock_only" ? "border-blue-600 bg-blue-50/50 font-black text-blue-750" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"}`}
                  >
                    {t.useCaseStock}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseCase("sales")}
                    className={`rounded-xl border p-2.5 text-center transition text-xs ${useCase === "sales" ? "border-blue-600 bg-blue-50/50 font-black text-blue-750" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"}`}
                  >
                    {t.useCaseSales}
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-[11px] font-bold text-slate-650">{t.companyLabel}</span>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="e.g. Hirdavat Market"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                </label>

                <label className="grid gap-1">
                  <span className="text-[11px] font-bold text-slate-650">{t.representativeLabel}</span>
                  <input
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-[11px] font-bold text-slate-650">{t.phoneLabel}</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+90 555..."
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                </label>

                <label className="grid gap-1">
                  <span className="text-[11px] font-bold text-slate-650">{t.emailLabel}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-[11px] font-bold text-slate-650">{t.cityLabel}</span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="İzmir, Berlin..."
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                </label>

                <label className="grid gap-1">
                  <span className="text-[11px] font-bold text-slate-650">{t.passwordLabel}</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                </label>
              </div>

              {useCase === "sales" && (
                <label className="grid gap-1.5 animate-fadeIn">
                  <span className="text-[11px] font-bold text-slate-650">{t.taxLabel}</span>
                  <input
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    required
                    placeholder="1234567890"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                </label>
              )}

              <label className="grid gap-1">
                <span className="text-[11px] font-bold text-slate-650">{t.addressLabel}</span>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address details..."
                  required
                  rows={2}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </label>

              <button
                type="button"
                disabled={
                  !companyName ||
                  !representative ||
                  !phone ||
                  !email ||
                  !city ||
                  !password ||
                  !address.trim() ||
                  (useCase === "sales" && !taxNumber.trim())
                }
                onClick={() => setStep("sector")}
                className="w-full mt-2 rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white hover:bg-blue-750 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                {t.nextSectorBtn}
              </button>
            </div>
          )}

          {step === "sector" && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-black tracking-tight">{t.sectorTitle}</h1>
                <p className="mt-0.5 text-xs text-slate-500">{t.sectorSubtitle}</p>
              </div>

              <div className="space-y-2">
                <label className="grid gap-1">
                  <span className="text-[11px] font-bold text-slate-650">{t.sectorListLabel}</span>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                    <option value="other">{t.otherOption}</option>
                  </select>
                </label>

                {selectedIndustry === "other" && (
                  <label className="grid gap-1 animate-fadeIn">
                    <span className="text-[11px] font-bold text-blue-600">{t.customSectorLabel}</span>
                    <input
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      required
                      placeholder="Category name..."
                      className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition" />
                    <p className="text-[9px] text-slate-500">{t.customSectorHint}</p>
                  </label>
                )}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-3">
                <label className="grid gap-1">
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">{t.operatingModelLabel}</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setOperatingModel("physical")}
                      className={`rounded-2xl border p-3 text-left transition active:scale-[0.98] ${operatingModel === "physical" ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-200" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                    >
                      <p className="text-xs font-black text-slate-800">{t.modelPhysical}</p>
                      <p className="text-[9px] text-slate-500 mt-1 leading-normal font-semibold">{t.modelPhysicalDesc}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOperatingModel("virtual_delivery")}
                      className={`rounded-2xl border p-3 text-left transition active:scale-[0.98] ${operatingModel === "virtual_delivery" ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-200" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                    >
                      <p className="text-xs font-black text-slate-800">{t.modelVirtual}</p>
                      <p className="text-[9px] text-slate-500 mt-1 leading-normal font-semibold">{t.modelVirtualDesc}</p>
                    </button>
                  </div>
                </label>

                {operatingModel === "virtual_delivery" && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-3 animate-fadeIn space-y-2">
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block">{t.countriesLabel}</span>
                    <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-700">
                      {[
                        { code: "TR", label: "Türkiye 🇹🇷" },
                        { code: "GE", label: "Gürcistan 🇬🇪" },
                        { code: "AZ", label: "Azerbaycan 🇦🇿" },
                        { code: "DE", label: "Almanya 🇩🇪" }
                      ].map((c) => {
                        const checked = serviceCountries.includes(c.code);
                        return (
                          <label key={c.code} className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                if (checked) {
                                  setServiceCountries(serviceCountries.filter(v => v !== c.code));
                                } else {
                                  setServiceCountries([...serviceCountries, c.code]);
                                }
                              }}
                              className="rounded border-slate-350 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5" />
                            <span>{c.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-[9px] text-blue-600 font-bold leading-normal">
                      {t.countriesHint}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <h3 className="text-[10px] font-black uppercase text-slate-550">{t.serviceWarningTitle}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{t.serviceWarningDesc}</p>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-black hover:bg-slate-50 transition"
                >
                  {t.backBtn}
                </button>
                <button
                  type="button"
                  disabled={selectedIndustry === "other" && !customIndustry.trim()}
                  onClick={() => setStep("warehouse")}
                  className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-black text-white hover:bg-blue-750 transition cursor-pointer"
                >
                  {t.nextWarehouseBtn}
                </button>
              </div>
            </div>
          )}

          {step === "warehouse" && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-black tracking-tight">{t.whTitle}</h1>
                <p className="mt-0.5 text-xs text-slate-500">{t.whSubtitle}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                <aside className="border-r border-slate-100 pr-1.5 space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">{t.whSelectionLabel}</span>
                  {warehouses.map((wh, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveWhIndex(idx)}
                      className={`w-full text-left rounded-xl px-2.5 py-1.5 text-xs font-black transition ${activeWhIndex === idx ? "bg-blue-50 text-blue-700 border border-blue-200" : "hover:bg-slate-50 border border-transparent"}`}
                    >
                      🏢 {wh.name}
                      <span className="block text-[9px] text-slate-400 font-medium mt-0.5">{wh.shelves.length} {t.whShelfCount}</span>
                    </button>
                  ))}
                  
                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid gap-1.5">
                    <input
                      value={newWhName}
                      onChange={(e) => setNewWhName(e.target.value)}
                      placeholder={t.whAddPlaceholder}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-900 outline-none focus:border-blue-500" />
                    <button
                      type="button"
                      onClick={handleAddWarehouse}
                      className="rounded-lg bg-slate-900 py-1 text-xs font-black text-white hover:bg-slate-800 transition"
                    >
                      {t.whAddBtn}
                    </button>
                  </div>
                </aside>

                <section className="bg-slate-50/50 rounded-2xl p-3.5 border border-slate-100">
                  <h3 className="font-black text-xs text-slate-700">🏢 {warehouses[activeWhIndex]?.name} - {t.whShelvesTitle}</h3>
                  
                  <div className="mt-2 flex gap-1.5">
                    <input
                      value={newShelf}
                      onChange={(e) => setNewShelf(e.target.value)}
                      placeholder={t.whShelfPlaceholder}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-900 outline-none focus:border-blue-500" />
                    <button
                      type="button"
                      onClick={handleAddShelf}
                      className="rounded-xl bg-blue-600 px-3 py-1 text-xs font-black text-white hover:bg-blue-750 transition"
                    >
                      {t.whShelfAddBtn}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {warehouses[activeWhIndex]?.shelves.map((shelf, shelfIdx) => (
                      <span
                        key={shelfIdx}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-750 shadow-sm"
                      >
                        🗄️ {shelf}
                        <button
                          type="button"
                          onClick={() => handleRemoveShelf(shelfIdx)}
                          className="text-red-500 hover:text-red-700 font-extrabold text-[9px]"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {warehouses[activeWhIndex]?.shelves.length === 0 && (
                      <p className="text-xs text-slate-400 italic">{t.whNoShelves}</p>
                    )}
                  </div>
                </section>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setStep("sector")}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-black hover:bg-slate-50 transition"
                >
                  {t.backBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("license")}
                  className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-black text-white hover:bg-blue-750 transition cursor-pointer"
                >
                  {t.nextLicenseBtn}
                </button>
              </div>
            </div>
          )}

          {step === "license" && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-black tracking-tight">{t.licenseTitle}</h1>
                <p className="mt-0.5 text-xs text-slate-500">{t.licenseSubtitle}</p>
              </div>

              {isPartner ? (
                <div className="rounded-2xl border border-emerald-350 bg-emerald-50/50 p-4 shadow-sm">
                  <h3 className="font-black text-emerald-950 flex items-center gap-1.5 text-xs">
                    {t.partnerTitle}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                    {t.partnerDesc}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
                    <h3 className="font-black text-blue-950 text-xs">{t.trialTitle}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-blue-800">
                      {t.trialDesc}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-slate-500">{t.saasPackagesTitle}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{t.saasPackagesDesc}</p>
                    <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5 pl-1">
                      <li>{t.saasPackageUser}</li>
                      <li>{t.saasPackageWarehouse}</li>
                      <li>{t.saasPackageProduct}</li>
                    </ul>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 shadow-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep("warehouse")}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-black hover:bg-slate-50 transition"
                >
                  {t.backBtn}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRegisterStore}
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  {loading ? t.registeringBtn : isPartner ? t.registerPartnerBtn : t.registerTrialBtn}
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 border border-emerald-500/20 text-emerald-600 text-2xl shadow-sm">
                ✓
              </div>
              <h2 className="text-2xl font-black tracking-tight">{t.doneTitle}</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
                {t.doneDesc.replace("{count}", String(warehouses.length))}
              </p>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-3 max-w-md mx-auto text-xs text-blue-900 leading-relaxed shadow-sm">
                ℹ️ <b>{t.doneInfoTitle}</b> {t.doneInfoDesc.replace("{name}", warehouses[0]?.name || t.defaultWhName)}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition shadow-sm active:scale-95 text-center"
                >
                  {t.doneDashboardBtn}
                </Link>
                <Link
                  href="/"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black hover:bg-slate-50 transition text-center"
                >
                  {t.doneHomeBtn}
                </Link>
              </div>
            </div>
          )}

        </section>
      </div>

      <footer className="text-center py-4 text-[10px] text-slate-400 border-t border-slate-200 select-none">
        HBS Cloud SaaS Platform © 2026. All rights reserved.
      </footer>
    </main>
  );
}
