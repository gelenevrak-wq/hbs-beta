import { HbsLanguageCode } from "./translations";

export type LocalizedText = Partial<Record<HbsLanguageCode, string>> & {
  tr: string;
  en?: string;
};

export function pickLocalizedText(
  text: LocalizedText | string,
  language: HbsLanguageCode
): string {
  if (typeof text === "string") return text;
  return text[language] || text.en || text.tr;
}

// -------------------------------------------------------------
// HBS EVRENSEL ÇEVİRİ SÖZLÜĞÜ (UNIVERSAL DICTIONARY)
// -------------------------------------------------------------
// HBS (Her Bok Satılır) platformundaki tüm sektörleri (oto, hırdavat,
// yerinde hizmet, nakliye, gıda, emlak, kiralama) kapsayan 5 dilli sözlük.
// -------------------------------------------------------------

export const globalTranslationDictionary: Record<string, Partial<Record<HbsLanguageCode, string>> & { tr: string }> = {
  // --- SEED EDİLEN B2B OBDTR ÜRÜNLERİ ---
  "obdtr obd platformu": {
    tr: "OBDTR OBD Platformu",
    en: "OBDTR OBD Platform",
    de: "OBDTR OBD-Plattform",
    ru: "OBD-платформа OBDTR",
    ka: "OBDTR OBD პლატფორმა"
  },
  "autel diagnostics ürün grubu": {
    tr: "Autel Diagnostics Ürün Grubu",
    en: "Autel Diagnostics Product Group",
    de: "Autel Diagnostics Produktgruppe",
    ru: "Группа продуктов Autel Diagnostics",
    ka: "Autel Diagnostics პროდუქტის ჯგუფი"
  },
  "launch diagnostic ürün grubu": {
    tr: "Launch Diagnostic Ürün Grubu",
    en: "Launch Diagnostic Product Group",
    de: "Launch Diagnostics Produktgruppe",
    ru: "Группа продуктов Launch Diagnostics",
    ka: "Launch Diagnostic პროდუქტის ჯგუფი"
  },
  "thinktool professional ürün grubu": {
    tr: "Thinktool Professional Ürün Grubu",
    en: "Thinktool Professional Product Group",
    de: "Thinktool Professional Produktgruppe",
    ru: "Группа продуктов Thinktool Professional",
    ka: "Thinktool Professional პროდუქტის ჯგუფი"
  },
  "zenith diagnostic systems": {
    tr: "Zenith Diagnostic Systems",
    en: "Zenith Diagnostic Systems",
    de: "Zenith Diagnosesysteme",
    ru: "Диагностические системы Zenith",
    ka: "Zenith სადიაგნოსტიკო სისტემები"
  },
  "araç grupları uyumluluk bilgisi": {
    tr: "Araç Grupları Uyumluluk Bilgisi",
    en: "Vehicle Groups Compatibility Information",
    de: "Fahrzeuggruppen-Kompatibilitätsinformationen",
    ru: "Информация о совместимости групп автомобилей",
    ka: "ავტომობილის ჯგუფების თავსებადობის ინფორმაცია"
  },
  "obd uzatma kablosu": {
    tr: "OBD Uzatma Kablosu",
    en: "OBD Extension Cable",
    de: "OBD-Verlängerungskabel",
    ru: "Удлинительный кабель OBD",
    ka: "OBD დამაგრძელებელი კაბელი"
  },
  "vci arayüz modülü": {
    tr: "VCI Arayüz Modülü",
    en: "VCI Interface Module",
    de: "VCI-Schnittstellenmodul",
    ru: "Интерфейсный модуль VCI",
    ka: "VCI ინტერფეისის მოდული"
  },
  "akü / batarya test cihazı": {
    tr: "Akü / Batarya Test Cihazı",
    en: "Battery Tester",
    de: "Batterietester",
    ru: "Тестер аккумуляторов",
    ka: "აკუმულატორის ტესტერი"
  },
  "diagnostik yazılım ve güncelleme desteği": {
    tr: "Diagnostik Yazılım ve Güncelleme Desteği",
    en: "Diagnostic Software & Update Support",
    de: "Diagnose-Software & Update-Unterstützung",
    ru: "Поддержка диагностического ПО и обновлений",
    ka: "სადიაგნოსტიკო პროგრამული უზრუნველყოფა და განახლების მხარდაჭერა"
  },
  "autel mx808s arıza tespit cihazı": {
    tr: "Autel MX808S Arıza Tespit Cihazı",
    en: "Autel MX808S Diagnostic Scanner",
    de: "Autel MX808S Diagnosegerät",
    ru: "Диагностический автосканер Autel MX808S",
    ka: "Autel MX808S სადიაგნოსტიკო აპარატი"
  },

  // --- HİZMET / KİRALAMA & DİĞER SEKTÖR DEMOLARI ---
  "yerinde elektrikçi / tesisatçı çağır": {
    tr: "Yerinde elektrikçi / tesisatçı çağır",
    en: "Call electrician / plumber on-site",
    de: "Elektriker / Klempner vor Ort rufen",
    ru: "Вызвать электрика / сантехника на дом",
    ka: "ადგილზე ელექტრიკოსის / სანტექნიკოსის გამოძახება"
  },
  "özel ders - evde veya online": {
    tr: "Özel ders - evde veya online",
    en: "Private lesson - at home or online",
    de: "Privatunterricht - zu Hause oder online",
    ru: "Частный урок - на дому или онлайн",
    ka: "კერძო გაკვეთილი - სახლში ან ონლაინ"
  },
  "evden eve nakliye keşfi": {
    tr: "Evden eve nakliye keşfi",
    en: "Moving survey - home to home",
    de: "Umzugsbesichtigung - Haus zu Haus",
    ru: "Оценка квартирного переезда",
    ka: "ბინის გადაზიდვის შეფასება"
  },
  "vip taksi / minibüs transfer": {
    tr: "VIP taksi / minibüs transfer",
    en: "VIP taxi / minibus transfer",
    de: "VIP-Taxi / Minibus-Transfer",
    ru: "VIP такси / трансфер на микроавтобусе",
    ka: "VIP ტაქსი / მიკროავტობუსის ტრანსფერი"
  },
  "lokanta masa rezervasyonu": {
    tr: "Lokanta masa rezervasyonu",
    en: "Restaurant table booking",
    de: "Restaurant-Tischreservierung",
    ru: "Бронирование столика в ресторане",
    ka: "რესტორნის მაგიდის დაჯავშნა"
  },
  "hukuk / diyetisyen / yaşam koçu görüşmesi": {
    tr: "Hukuk / diyetisyen / yaşam koçu görüşmesi",
    en: "Lawyer / dietitian / life coach session",
    de: "Gespräch mit Anwalt / Ernährungsberater / Life Coach",
    ru: "Консультация юриста / диетолога / лайф-коуча",
    ka: "იურისტის / დიეტოლოგის / ლაიფ-ქოუჩის კონსულტაცია"
  },
  "oto servis arıza tespit": {
    tr: "Oto servis arıza tespit",
    en: "Auto service diagnostics",
    de: "Autoservice-Fehlerdiagnose",
    ru: "Диагностика неисправностей автосервиса",
    ka: "ავტოსერვისის ხარვეზების დიაგნოსტიკა"
  },
  "tekne turu - batumi kıyı rotası": {
    tr: "Tekne turu - Batumi kıyı rotası",
    en: "Boat tour - Batumi coastal route",
    de: "Bootstour - Küstenroute Batumi",
    ru: "Прогулка на лодке - побережье Батуми",
    ka: "ნავით ტური - ბათუმის სანაპირო მარშრუტი"
  },
  "hırdavat ekipman kiralama": {
    tr: "Hırdavat ekipman kiralama",
    en: "Hardware equipment rental",
    de: "Miete von Werkzeug & Ausrüstung",
    ru: "Аренда строительного инструмента",
    ka: "სამშენებლო ინსტრუმენტების ქირაობა"
  },
  "yerinde elektrikçi çağır": {
    tr: "Yerinde elektrikçi çağır",
    en: "Call electrician on-site",
    de: "Elektriker vor Ort rufen",
    ru: "Вызвать elektrikçi na mesto", // mapped safely
    ka: "ელექტრიკოსის ადგილზე გამოძახება"
  },
  "tesisatçı çağır": {
    tr: "Tesisatçı çağır",
    en: "Call plumber on-site",
    de: "Klempner rufen",
    ru: "Вызвать сантехника",
    ka: "სანტექნიკოსის გამოძახება"
  },

  // --- KATEGORİLER VE SEKTÖRLER ---
  "obd cihazları vitrini": {
    tr: "OBD cihazları vitrini",
    en: "OBD Devices Storefront",
    de: "OBD-Geräte-Schaufenster",
    ru: "Витрина OBD устройств",
    ka: "OBD მოწყობილობების ვიტრინა"
  },
  "profesyonel diagnostik": {
    tr: "Profesyonel diagnostik",
    en: "Professional Diagnostics",
    de: "Professionelle Diagnose",
    ru: "Профессиональная диагностика",
    ka: "პროფესიონალური დიაგნოსტიკა"
  },
  "obd tarayıcı ve servis": {
    tr: "OBD tarayıcı ve servis",
    en: "OBD Scanner & Service",
    de: "OBD-Scanner & Service",
    ru: "OBD сканер и сервис",
    ka: "OBD სკანერი და სერვისი"
  },
  "diagnostik sistemler": {
    tr: "Diagnostik sistemler",
    en: "Diagnostic Systems",
    de: "Diagnosesysteme",
    ru: "Диагностические системы",
    ka: "სადიაგნოსტიკო სისტემები"
  },
  "tüm markalar uyumluluk": {
    tr: "Tüm markalar uyumluluk",
    en: "All Brands Compatibility",
    de: "Kompatibilität aller Marken",
    ru: "Совместимость всех марок",
    ka: "ყველა ბრენდის თავსებადობა"
  },
  "diagnostik aksesuar": {
    tr: "Diagnostik aksesuar",
    en: "Diagnostic Accessory",
    de: "Diagnosezubehör",
    ru: "Диагностический аксессуар",
    ka: "სადიაგნოსტიკo აქსესუარი"
  },
  "servis ekipmanı": {
    tr: "Servis ekipmanı",
    en: "Service Equipment",
    de: "Werkstattausrüstung",
    ru: "Сервисное оборудование",
    ka: "სერვისის აღჭურვილობა"
  },
  "servis desteği": {
    tr: "Servis desteği",
    en: "Service Support",
    de: "Service-Unterstützung",
    ru: "Сервисная поддержка",
    ka: "სერვისის მხარდაჭერა"
  },
  "oto teşhis cihazları": {
    tr: "Oto Teşhis Cihazları",
    en: "Car Diagnostic Devices",
    de: "Kfz-Diagnosegeräte",
    ru: "Автомобильные диагностические приборы",
    ka: "ავტომობილის სადიაგნოსტიკო აპარატები"
  },
  "oto yedek parçası": {
    tr: "Oto yedek parçası",
    en: "Auto Spare Parts",
    de: "Auto-Ersatzteile",
    ru: "Автозапчасти",
    ka: "ავტონაწილები"
  },
  "yerinde hizmet": {
    tr: "Yerinde hizmet",
    en: "On-Site Service",
    de: "Vor-Ort-Service",
    ru: "Услуги на месте",
    ka: "ადგილზე მომსახურება"
  },
  "eğitim / yerinde hizmet": {
    tr: "Eğitim / yerinde hizmet",
    en: "Education / On-Site",
    de: "Schulung / Vor-Ort",
    ru: "Обучение / На месте",
    ka: "განათლება / ადგილზე"
  },
  "nakliye": {
    tr: "Nakliye",
    en: "Transport & Shipping",
    de: "Transport & Umzug",
    ru: "Транспортировка и переезд",
    ka: "ტრანსპორტირება და გადაზიდვა"
  },
  "yeme içme": {
    tr: "Yeme içme",
    en: "Food & Dining",
    de: "Essen & Trinken",
    ru: "Еда и напитки",
    ka: "კვება და სასმელები"
  },
  "danışmanlık": {
    tr: "Danışmanlık",
    en: "Consulting",
    de: "Beratung",
    ru: "Консультирование",
    ka: "კონსულტაცია"
  },
  "tur / deneyim": {
    tr: "Tur / deneyim",
    en: "Tour & Experience",
    de: "Tour & Erlebnis",
    ru: "Тур и экскурсия",
    ka: "ტური და გამოცდილება"
  },
  "kiralama": {
    tr: "Kiralama",
    en: "Rental",
    de: "Vermietung",
    ru: "Аренда",
    ka: "ქირაობა"
  },
  "emlak": {
    tr: "Emlak",
    en: "Real Estate",
    de: "Immobilien",
    ru: "Недвижимость",
    ka: "უძრავი ქონება"
  },
  "araç": {
    tr: "Araç",
    en: "Vehicle",
    de: "Fahrzeug",
    ru: "Транспортное средство",
    ka: "ტრანსპორტი"
  },
  "açık artırma": {
    tr: "Açık artırma",
    en: "Auction",
    de: "Auktion",
    ru: "Аукцион",
    ka: "აუქციონი"
  },
  "genel": {
    tr: "Genel",
    en: "General",
    de: "Allgemein",
    ru: "Общий",
    ka: "საერთო"
  },

  // --- SEED EDİLEN AÇIKLAMALAR ---
  "obdtr profesyonel obd arıza tespit ve bulut yönetim platformu. tüm marka ve cihazlarla uyumlu entegrasyon altyapısı.": {
    tr: "OBDTR Profesyonel OBD arıza tespit ve bulut yönetim platformu. Tüm marka ve cihazlarla uyumlu entegrasyon altyapısı.",
    en: "OBDTR Professional OBD diagnostics and cloud management platform. Integrated infrastructure compatible with all brands and devices.",
    de: "OBDTR Professionelle OBD-Diagnose- und Cloud-Management-Plattform. Integrierte Infrastruktur, kompatibel mit allen Marken und Geräten.",
    ru: "Профессиональная платформа диагностики OBD и облачного управления OBDTR. Совместимая интеграционная инфраструктура со всеми марками и приборами.",
    ka: "OBDTR პროფესიონალური OBD დიაგნოსტიკა და ღრუბლოვანი მართვის პლატფორმა. ინტეგრირებული ინფრასტრუქტურა თავსებადი ყველა ბრენდთან და მოწყობილობასთან."
  },
  "autel profesyonel diagnostik tabletler, adas kalibrasyon cihazları ve tpms servis ekipmanları ürün grubu.": {
    tr: "Autel profesyonel diagnostik tabletler, ADAS kalibrasyon cihazları ve TPMS servis ekipmanları ürün grubu.",
    en: "Autel professional diagnostic tablets, ADAS calibration devices, and TPMS service equipment product group.",
    de: "Autel professionelle Diagnosetablets, ADAS-Kalibrierungsgeräte und TPMS-Servicegeräte.",
    ru: "Группа профессиональных диагностических планшетов Autel, приборов калибровки ADAS и оборудования TPMS.",
    ka: "Autel პროფესიონალური სადიაგნოსტიკო ტაბლეტები, ADAS კალიბრაციის მოწყობილობები და TPMS სერვისის აღჭურვილობის პროდუქტის ჯგუფი."
  },
  "launch x431 serisi akıllı arıza tespit cihazları, vci arayüzleri ve ağır vasıta arıza tespit donanımları.": {
    tr: "Launch X431 serisi akıllı arıza tespit cihazları, VCI arayüzleri ve ağır vasıta arıza tespit donanımları.",
    en: "Launch X431 series smart diagnostic scanners, VCI interfaces, and heavy-duty vehicle diagnostic hardware.",
    de: "Smarte Diagnosegeräte der Launch X431-Serie, VCI-Schnittstellen und Lkw-Diagnosehardware.",
    ru: "Интеллектуальные автосканеры серии Launch X431, интерфейсы VCI и оборудование для диагностики грузового транспорта.",
    ka: "Launch X431 სერიის ჭკვიანი სადიაგნოსტიკო აპარატები, VCI ინტერფეისები და მძიმე ტექნიკის სადიაგნოსტიკო მოწყობილობები."
  },
  "thinkcar thinktool profesyonel binek ve ağır vasıta arıza tespit tabletleri, osiloskop ve endoskop modülleri.": {
    tr: "Thinkcar Thinktool profesyonel binek ve ağır vasıta arıza tespit tabletleri, osiloskop ve endoskop modülleri.",
    en: "Thinkcar Thinktool professional passenger and heavy vehicle diagnostic tablets, oscilloscope and endoscope modules.",
    de: "Thinkcar Thinktool professionelle Pkw- und Lkw-Diagnosetablets, Oszilloskop- und Endoskopmodule.",
    ru: "Профессиональные планшеты диагностики легковых и грузовых автомобилей Thinkcar Thinktool, модули осциллографа и эндоскопа.",
    ka: "Thinkcar Thinktool პროფესიონალური სამგზავრო და მძიმე ტექნიკის სადიაგნოსტიკო ტაბლეტები, ოსცილოსკოპი და ენდოსკოპის მოდულები."
  },
  "zenith 5 profesyonel arıza tespit and servis tableti. uzak asya ve yerli araçlarda lider diagnostik çözümler.": {
    tr: "Zenith 5 profesyonel arıza tespit and servis tableti. Uzak Asya ve yerli araçlarda lider diagnostik çözümler.",
    en: "Zenith 5 professional diagnostic and service tablet. Leading diagnostic solutions for East Asian and domestic vehicles.",
    de: "Zenith 5 professionelles Diagnose- und Servicetablett. Führende Diagnoselösungen für ostasiatische und inländische Fahrzeuge.",
    ru: "Профессиональный планшет диагностики и сервиса Zenith 5. Ведущие решения для азиатских и отечественных автомобилей.",
    ka: "Zenith 5 პროფესიონალური სადიაგნოსტიკო და სერვისის ტაბლეტი. წამყვანი სადიაგნოსტიკო გადაწყვეტილებები აღმოსავლეთ აზიური და ადგილობრივი ავტომობილებისთვის."
  },
  "binek, hafif ticari, ağır vasıta, motosiklet ve deniz araçları marka/model diagnostik protokol uyumluluk bilgileri.": {
    tr: "Binek, hafif ticari, ağır vasıta, motosiklet ve deniz araçları marka/model diagnostik protokol uyumluluk bilgileri.",
    en: "Passenger car, light commercial, heavy vehicle, motorcycle, and marine vessel brand/model diagnostic protocol compatibility information.",
    de: "Informationen zur Kompatibilität von Diagnoseprotokollen für Pkw, leichte Nutzfahrzeuge, Lkw, Motorräder und Boote.",
    ru: "Информация о совместимости диагностических протоколов легковых, легких коммерческих, грузовых автомобилей, мотоциклов и судов.",
    ka: "სამგზავრო, მსუბუქი კომერციული, მძიმე ტექნიკის, მოტოციკლეტის და საზღვაო ტრანსპორტის დიაგნოსტიკური პროტოკოლის თავსებადობის ინფორმაცია."
  },
  "1.5 metre, kalın korumalı, 16-pin erkek-dişi esnek obd uzatma kablosu donanımı.": {
    tr: "1.5 metre, kalın korumalı, 16-pin erkek-dişi esnek OBD uzatma kablosu donanımı.",
    en: "1.5 meters, heavily shielded, 16-pin male-to-female flexible OBD extension cable hardware.",
    de: "1,5 Meter, stark abgeschirmtes, flexibles 16-Pin OBD-Verlängerungskabel (Stecker/Buchse).",
    ru: "Гибкий удлинительный кабель OBD длиной 1,5 метра с плотным экранированием, 16-контактный разъем папа-мама.",
    ka: "1.5 მეტრიანი, სქელი დამცავიანი, 16-პინიანი მამალი-დედალი მოქნილი OBD დამაგრდელებელი კაბელი."
  },
  "tüm obd2 protokollerini ve can-fd bağlantısını destekleyen yüksek hızlı bluetooth arayüz modülü.": {
    tr: "Tüm OBD2 protokollerini ve CAN-FD bağlantısını destekleyen yüksek hızlı bluetooth arayüz modülü.",
    en: "High-speed bluetooth interface module supporting all OBD2 protocols and CAN-FD connection.",
    de: "Highspeed-Bluetooth-Schnittstellenmodul, das alle OBD2-Protokolle und CAN-FD-Verbindungen unterstützt.",
    ru: "Высокоскоростной интерфейсный модуль Bluetooth с поддержкой всех протоколов OBD2 и соединения CAN-FD.",
    ka: "მაღალი სიჩქარის bluetooth ინტერფეისის მოდული, რომელიც მხარს უჭერს ყველა OBD2 პროტოკოლს და CAN-FD კავშირს."
  },
  "12v/24v kurşun-asit, agm, gel ve lityum aküler için şarj durumu ve sağlık analizi (soh/soc) cihazı.": {
    tr: "12V/24V kurşun-asit, AGM, Gel ve lityum aküler için şarj durumu ve sağlık analizi (SOH/SOC) cihazı.",
    en: "Battery state of charge and state of health analyzer (SOH/SOC) for 12V/24V lead-acid, AGM, Gel, and lithium batteries.",
    de: "Batterieladezustands- und Gesundheitsanalysator (SOH/SOC) für 12V/24V Blei-Säure-, AGM-, Gel- und Lithium-Batterien.",
    ru: "Прибор для проверки уровня заряда и состояния здоровья (SOH/SOC) свинцово-кислотных, AGM, гелевых и литиевых аккумуляторов 12В/24В.",
    ka: "12V/24V ტყვიის-მჟავა, AGM, Gel და ლითიუმის აკუმულატორების დამუხტვის დონის და ჯანმრთელობის ანალიზატორი (SOH/SOC)."
  },
  "autel, launch, thinkcar ve zenith cihazları için lisans güncelleme, yazılım aktivasyonu ve uzaktan kurulum hizmeti.": {
    tr: "Autel, Launch, Thinkcar ve Zenith cihazları için lisans güncelleme, yazılım aktivasyonu ve uzaktan kurulum hizmeti.",
    en: "License renewal, software activation, and remote setup service for Autel, Launch, Thinkcar, and Zenith devices.",
    de: "Lizenzverlängerung, Softwareaktivierung und Remote-Setup-Service für Autel-, Launch-, Thinkcar- und Zenith-Geräte.",
    ru: "Лицензионное обновление, активация ПО и услуга удаленной установки для устройств Autel, Launch, Thinkcar и Zenith.",
    ka: "ლიცენზიის განახლება, პროგრამული უზრუნველყოფის აქტივაცია და დისტანციური მონტაჟის სერვისი Autel, Launch, Thinkcar და Zenith მოწყობილობებისთვის."
  },
  "autel ms919 gelişmiş teşhis ve ölçüm platformu": {
    "tr": "Autel MS919 Gelişmiş Teşhis ve Ölçüm Platformu",
    "en": "Autel MS919 Advanced Diagnostics and Measurement Platform",
    "de": "Autel MS919 Fortgeschrittene Diagnose- und Messplattform",
    "ru": "Передовая диагностическая и измерительная платформа Autel MS919",
    "ka": "Autel MS919 დიაგნოსტიკისა და გაზომვის მოწინავე პლატფორმა"
},
  "autel maxisys ms919 gelişmiş teşhis ve ölçüm platformu autel maxisys ms919, profesyonel servisler, oto ekspertiz merkezleri, filo bakım işletmeleri ve ileri seviye arıza tespit ihtiyaçları için geliştirilmiş üst segment bir teşhis ve ölçüm platformudur. klasik obd arıza okuma cihazlarının ötesine geçen ms919; gelişmiş sistem tarama, canlı veri analizi, aktif testler, servis fonksiyonları, ecu kodlama/programlama desteği ve entegre ölçüm kabiliyetleriyle atölyelerde kapsamlı bir teşhis altyapısı sunar. 9.7 inç yüksek çözünürlüklü dokunmatik ekranı, güçlü sekiz çekirdekli işlemcisi ve 128 gb dahili hafızası ile hızlı, kararlı ve profesyonel kullanım için tasarlanan ms919; autel’in maxiflash vcmi ünitesiyle birlikte gelir. bu vcmi ünitesi yalnızca araçla kablosuz iletişim kuran bir arayüz değildir; aynı zamanda 4 kanallı osiloskop, multimetre, sinyal jeneratörü ve can bus test cihazı olarak da görev yapar. bu sayede arıza tespit süreci yalnızca hata kodu okumakla sınırlı kalmaz; sensör, aktöatör, haberleşme hattı ve elektriksel sinyal analizleri de aynı platform üzerinden yapılabilir. ([autel][1]) profesyonel servisler i̇çin üst düzey teşhis yeteneği autel ms919, araçtaki elektronik kontrol ünitelerine kapsamlı erişim sağlayarak motor, şanzıman, abs, srs, esp, klima, gövde kontrol modülü, direksiyon, fren, yakıt sistemi, adas bağlantılı sistemler ve desteklenen diğer modüller üzerinde detaylı teşhis imkânı sunar. cihaz; arıza kodlarını okuma ve silme, canlı veri görüntüleme, donmuş kare verisi inceleme, aktif testler yapma, adaptasyon ve kalibrasyon işlemlerini destekler. destek kapsamı araç markasına, modeline, üretim yılına ve ilgili kontrol ünitesinin yazılım altyapısına göre değişebilir. maxiflash vcmi: 5’i 1 arada profesyonel ölçüm ve i̇letişim ünitesi ms919’un en önemli farklarından biri, kutu içeriğinde yer alan maxiflash vcmi ünitesidir. bu gelişmiş modül, cihazı sıradan bir arıza tespit tabletinden çok daha ileri bir teknik ölçüm platformuna dönüştürür. maxiflash vcmi şu görevleri üstlenir: araç ile tablet arasında kablosuz teşhis iletişimi 4 kanallı osiloskop ölçümü multimetre fonksiyonu dalga formu / sinyal jeneratörü can bus hattı kontrolü modern araç iletişim protokolleriyle uyumlu bağlantı vcmi; doip, d-pdu, can fd ve mega can gibi güncel araç iletişim protokollerini destekler. bu özellik, özellikle yeni nesil araçlarda daha hızlı ve daha kapsamlı teşhis yapılmasına yardımcı olur. ([autel][1]) topology mapping ile sistemleri tek ekranda görün autel maxisys ms919, desteklenen araçlarda topology module mapping özelliğiyle araçtaki elektronik kontrol ünitelerini renk kodlu bir ağ yapısı üzerinde gösterebilir. bu yapı, hangi modüllerin sağlıklı çalıştığını, hangilerinde hata bulunduğunu ve modüller arasındaki iletişim ilişkilerini daha anlaşılır hale getirir. bu özellik özellikle modern araçlarda büyük zaman kazandırır. servis teknisyeni her modülü tek tek kontrol etmek yerine, sistemin genel durumunu görsel bir harita üzerinden hızlıca değerlendirebilir. ([autel][1]) kodlama, programlama ve gelişmiş servis i̇şlemleri ms919, desteklenen araçlarda gelişmiş kodlama, adaptasyon ve programlama işlemlerine imkân sağlar. bu özellikler özellikle parça değişimi sonrası tanıtma, kontrol ünitesi yapılandırması, servis sıfırlama, sistem kalibrasyonu ve üretici seviyesine yakın işlemler için önemlidir. desteklenen fonksiyonlar araç markasına ve modele göre değişir. bu nedenle ecu kodlama ve programlama işlemleri için işlem yapılacak araç özelinde uyumluluk kontrolü önerilir. osiloskop destekli gerçek arıza analizi birçok arıza yalnızca hata kodu okuyarak kesin şekilde teşhis edilemez. sensör sinyalleri, ateşleme sistemi, enjektör kontrolü, krank/kam mili sinyalleri, voltaj dalgalanmaları ve haberleşme hattı problemleri çoğu zaman ölçüm gerektirir. autel ms919’un entegre osiloskop özelliği, bu noktada servis profesyonellerine büyük avantaj sağlar. hazır test kılavuzları, bileşen bazlı ölçüm desteği ve dalga formu kütüphanesi sayesinde kullanıcı; yalnızca arızayı görmekle kalmaz, arızanın kaynağını daha doğru analiz edebilir. ([autel.eu][2]) hızlı, güçlü ve kullanıcı dostu tablet yapısı autel ms919, profesyonel atölye ortamına uygun güçlü bir donanım altyapısına sahiptir. cihazda 9.7 inç tft-lcd kapasitif dokunmatik ekran, 1536 × 2048 çözünürlük, sekiz çekirdekli işlemci, 4 gb ram ve 128 gb dahili hafıza bulunur. ayrıca wi-fi, bluetooth, gps, hdmi, usb bağlantıları ve 256 gb’a kadar sd kart desteği sunar. ([autel][1]) arka kamerası sayesinde plaka okuma, barkod veya metin tanıma gibi pratik işlemler desteklenir. scanvin özelliği, araç bilgilerini manuel girmeden daha hızlı tanımlamaya yardımcı olur. ([autel][1]) kimler i̇çin uygundur? autel maxisys ms919 özellikle şu kullanıcılar için ideal bir çözümdür: profesyonel oto servisleri elektrik-elektronik arıza uzmanları oto ekspertiz merkezleri filo bakım işletmeleri premium araçlara hizmet veren teknik servisler i̇leri seviye teşhis, kodlama ve ölçüm ihtiyacı olan atölyeler sadece hata kodu okumak değil, arızanın teknik kaynağını analiz etmek isteyen kullanıcılar öne çıkan avantajlar autel ms919, servislerde teşhis sürecini hızlandırır, ölçüm cihazı ihtiyacını azaltır ve teknisyenin daha doğru karar vermesine yardımcı olur. arıza kodu, canlı veri, aktif test, osiloskop ölçümü, multimetre kontrolü ve haberleşme hattı analizi aynı platformda birleştirildiği için servis operasyonlarında ciddi verimlilik sağlar. bu cihaz; özellikle “arıza kodu yok ama araçta problem var” durumlarında, klasik cihazlara göre çok daha güçlü bir analiz imkânı sunar. sensör sinyalleri, voltaj problemleri, modül haberleşme sorunları ve elektriksel arızalar daha net değerlendirilebilir. teknik özellikler açıklama ---------------------- ---------------------------------------------------- model autel maxisys ms919 ekran 9.7 inç tft-lcd dokunmatik ekran çözünürlük 1536 × 2048 işlemci sekiz çekirdekli işlemci hafıza 4 gb ram / 128 gb dahili hafıza işletim sistemi android tabanlı sistem vcmi maxiflash vcmi 5’i 1 arada arayüz osiloskop 4 kanallı osiloskop ek ölçüm fonksiyonları multimetre, sinyal jeneratörü, can bus test protokol desteği doip, d-pdu, can fd, mega can desteği bağlantılar wi-fi, bluetooth, usb, hdmi, gps kamera arka kamera ve ön kamera vin tanıma scanvin, barkod/metin tanıma desteği kullanım alanı profesyonel teşhis, ölçüm, kodlama, servis işlemleri sonuç: autel maxisys ms919, sadece bir arıza tespit cihazı değil; profesyonel servisler için geliştirilmiş kapsamlı bir teşhis, ölçüm ve analiz platformudur. gelişmiş vcmi ünitesi, osiloskop desteği, modern araç protokolleri, topoloji haritası ve geniş servis fonksiyonları sayesinde ms919; atölyelerin daha hızlı, daha doğru ve daha profesyonel hizmet vermesine yardımcı olur. elektronik sistemlerin giderek daha karmaşık hale geldiği günümüz araçlarında, doğru teşhis cihazı servis kalitesini doğrudan etkiler. autel ms919, bu ihtiyaca güçlü donanımı, kapsamlı yazılım desteği ve ölçüm kabiliyetleriyle profesyonel bir çözüm sunar.": {
    "tr": "Autel MaxiSys MS919 Gelişmiş Teşhis ve Ölçüm Platformu\n\nAutel MaxiSys MS919, profesyonel servisler, oto ekspertiz merkezleri, filo bakım işletmeleri ve ileri seviye arıza tespit ihtiyaçları için geliştirilmiş üst segment bir teşhis ve ölçüm platformudur. Klasik OBD arıza okuma cihazlarının ötesine geçen MS919; gelişmiş sistem tarama, canlı veri analizi, aktif testler, servis fonksiyonları, ECU kodlama/programlama desteği ve entegre ölçüm kabiliyetleriyle atölyelerde kapsamlı bir teşhis altyapısı sunar.\n\n9.7 inç yüksek çözünürlüklü dokunmatik ekranı, güçlü sekiz çekirdekli işlemcisi ve 128 GB dahili hafızası ile hızlı, kararlı ve profesyonel kullanım için tasarlanan MS919; Autel’in MaxiFlash VCMI ünitesiyle birlikte gelir. Bu VCMI ünitesi yalnızca araçla kablosuz iletişim kuran bir arayüz değildir; aynı zamanda 4 kanallı osiloskop, multimetre, sinyal jeneratörü ve can bus test cihazı olarak da görev yapar. Bu sayede arıza tespit süreci yalnızca hata kodu okumakla sınırlı kalmaz; sensör, aktöatör, haberleşme hattı ve elektriksel sinyal analizleri de aynı platform üzerinden yapılabilir. ([Autel][1])\n\nProfesyonel Servisler İçin Üst Düzey Teşhis Yeteneği\n\nAutel MS919, araçtaki elektronik kontrol ünitelerine kapsamlı erişim sağlayarak motor, şanzıman, abs, srs, esp, klima, gövde kontrol modülü, direksiyon, fren, yakıt sistemi, adas bağlantılı sistemler ve desteklenen diğer modüller üzerinde detaylı teşhis imkânı sunar.\n\ncihaz; arıza kodlarını okuma ve silme, canlı veri görüntüleme, donmuş kare verisi inceleme, aktif testler yapma, adaptasyon ve kalibrasyon işlemlerini destekler. destek kapsamı araç markasına, modeline, üretim yılına ve ilgili kontrol ünitesinin yazılım altyapısına göre değişebilir.\n\n MaxiFlash VCMI: 5’i 1 Arada Profesyonel Ölçüm ve İletişim Ünitesi\n\nms919’un en önemli farklarından biri, kutu içeriğinde yer alan maxiflash vcmi ünitesidir. bu gelişmiş modül, cihazı sıradan bir arıza tespit tabletinden çok daha ileri bir teknik ölçüm platformuna dönüştürür.\n\nmaxiflash vcmi şu görevleri üstlenir:\n\n araç ile tablet arasında kablosuz teşhis iletişimi\n 4 kanallı osiloskop ölçümü\n multimetre fonksiyonu\n dalga formu / sinyal jeneratörü\n can bus hattı kontrolü\n modern araç iletişim protokolleriyle uyumlu bağlantı\n\nvcmi; doip, d-pdu, can fd ve mega can gibi güncel araç iletişim protokollerini destekler. bu özellik, özellikle yeni nesil araçlarda daha hızlı ve daha kapsamlı teşhis yapılmasına yardımcı olur. ([autel][1])\n\ntopology mapping ile sistemleri tek ekranda görün\n\nautel maxisys ms919, desteklenen araçlarda topology module mapping özelliğiyle araçtaki elektronik kontrol ünitelerini renk kodlu bir ağ yapısı üzerinde gösterebilir. bu yapı, hangi modüllerin sağlıklı çalıştığını, hangilerinde hata bulunduğunu ve modüller arasındaki iletişim ilişkilerini daha anlaşılır hale getirir.\n\nbu özellik özellikle modern araçlarda büyük zaman kazandırır. servis teknisyeni her modülü tek tek kontrol etmek yerine, sistemin genel durumunu görsel bir harita üzerinden hızlıca değerlendirebilir. ([autel][1])\n\nkodlama, programlama ve gelişmiş servis i̇şlemleri\n\nms919, desteklenen araçlarda gelişmiş kodlama, adaptasyon ve programlama işlemlerine imkân sağlar. bu özellikler özellikle parça değişimi sonrası tanıtma, kontrol ünitesi yapılandırması, servis sıfırlama, sistem kalibrasyonu ve üretici seviyesine yakın işlemler için önemlidir.\n\ndesteklenen fonksiyonlar araç markasına ve modele göre değişir. bu nedenle ecu kodlama ve programlama işlemleri için işlem yapılacak araç özelinde uyumluluk kontrolü önerilir.\n\nosiloskop destekli gerçek arıza analizi\n\nbirçok arıza yalnızca hata kodu okuyarak kesin şekilde teşhis edilemez. sensör sinyalleri, ateşleme sistemi, enjektör kontrolü, krank/kam mili sinyalleri, voltaj dalgalanmaları ve haberleşme hattı problemleri çoğu zaman ölçüm gerektirir.\n\nautel ms919’un entegre osiloskop özelliği, bu noktada servis profesyonellerine büyük avantaj sağlar. hazır test kılavuzları, bileşen bazlı ölçüm desteği ve dalga formu kütüphanesi sayesinde kullanıcı; yalnızca arızayı görmekle kalmaz, arızanın kaynağını daha doğru analiz edebilir. ([autel.eu][2])\n\nhızlı, güçlü ve kullanıcı dostu tablet yapısı\n\nautel ms919, profesyonel atölye ortamına uygun güçlü bir donanım altyapısına sahiptir. cihazda 9.7 inç tft-lcd kapasitif dokunmatik ekran, 1536 × 2048 çözünürlük, sekiz çekirdekli işlemci, 4 gb ram ve 128 gb dahili hafıza bulunur. ayrıca wi-fi, bluetooth, gps, hdmi, usb bağlantıları ve 256 gb’a kadar sd kart desteği sunar. ([autel][1])\n\narka kamerası sayesinde plaka okuma, barkod veya metin tanıma gibi pratik işlemler desteklenir. scanvin özelliği, araç bilgilerini manuel girmeden daha hızlı tanımlamaya yardımcı olur. ([autel][1])\n\n kimler i̇çin uygundur?\n\nautel maxisys ms919 özellikle şu kullanıcılar için ideal bir çözümdür:\n\n profesyonel oto servisleri\n elektrik-elektronik arıza uzmanları\n oto ekspertiz merkezleri\n filo bakım işletmeleri\n premium araçlara hizmet veren teknik servisler\n i̇leri seviye teşhis, kodlama ve ölçüm ihtiyacı olan atölyeler\n sadece hata kodu okumak değil, arızanın teknik kaynağını analiz etmek isteyen kullanıcılar\n\nöne çıkan avantajlar\n\nautel ms919, servislerde teşhis sürecini hızlandırır, ölçüm cihazı ihtiyacını azaltır ve teknisyenin daha doğru karar vermesine yardımcı olur. arıza kodu, canlı veri, aktif test, osiloskop ölçümü, multimetre kontrolü ve haberleşme hattı analizi aynı platformda birleştirildiği için servis operasyonlarında ciddi verimlilik sağlar.\n\nbu cihaz; özellikle “arıza kodu yok ama araçta problem var” durumlarında, klasik cihazlara göre çok daha güçlü bir analiz imkânı sunar. sensör sinyalleri, voltaj problemleri, modül haberleşme sorunları ve elektriksel arızalar daha net değerlendirilebilir.\n\n teknik özellikler açıklama \n ---------------------- ---------------------------------------------------- \n model autel maxisys ms919 \n ekran 9.7 inç tft-lcd dokunmatik ekran \n çözünürlük 1536 × 2048 \n işlemci sekiz çekirdekli işlemci \n hafıza 4 gb ram / 128 gb dahili hafıza \n işletim sistemi android tabanlı sistem \n vcmi maxiflash vcmi 5’i 1 arada arayüz \n osiloskop 4 kanallı osiloskop \n ek ölçüm fonksiyonları multimetre, sinyal jeneratörü, can bus test \n protokol desteği doip, d-pdu, can fd, mega can desteği \n bağlantılar wi-fi, bluetooth, usb, hdmi, gps \n kamera arka kamera ve ön kamera \n vin tanıma scanvin, barkod/metin tanıma desteği \n kullanım alanı profesyonel teşhis, ölçüm, kodlama, servis işlemleri \n\n\nsonuç: \n\nautel maxisys ms919, sadece bir arıza tespit cihazı değil; profesyonel servisler için geliştirilmiş kapsamlı bir teşhis, ölçüm ve analiz platformudur. gelişmiş vcmi ünitesi, osiloskop desteği, modern araç protokolleri, topoloji haritası ve geniş servis fonksiyonları sayesinde ms919; atölyelerin daha hızlı, daha doğru ve daha profesyonel hizmet vermesine yardımcı olur. \n\nelektronik sistemlerin giderek daha karmaşık hale geldiği günümüz araçlarında, doğru teşhis cihazı servis kalitesini doğrudan etkiler. autel ms919, bu ihtiyaca güçlü donanımı, kapsamlı yazılım desteği ve ölçüm kabiliyetleriyle profesyonel bir çözüm sunar.",
    "en": "Autel MaxiSys MS919 Advanced Diagnostics and Measurement Platform\n\nAutel MaxiSys MS919 is a top-tier diagnostic and measurement platform developed for professional workshops, auto appraisal centers, fleet maintenance businesses, and advanced diagnostic needs. Going beyond classic OBD fault reading devices, the MS919 offers a comprehensive diagnostic infrastructure in workshops with advanced system scanning, live data analysis, active tests, service functions, ECU coding/programming support, and integrated measurement capabilities.\n\nDesigned for fast, stable, and professional use with its 9.7-inch high-resolution touchscreen, powerful octa-core processor, and 128 GB internal memory, the MS919 comes with Autel’s MaxiFlash VCMI unit. This VCMI unit is not just a wireless communication interface; it also functions as a 4-channel oscilloscope, multimeter, waveform generator, and CAN BUS tester. In this way, the diagnostic process is not limited to just reading error codes; sensor, actuator, communication line, and electrical signal analysis can also be done via the same platform. ([Autel][1])\n\nHigh-Level Diagnostic Capability for Professional Services\n\nAutel MS919 provides detailed diagnostic opportunities on engine, transmission, ABS, SRS, ESP, air conditioner, body control module, steering, brakes, fuel system, ADAS-related systems, and other supported modules by providing comprehensive access to the electronic control units in the vehicle.\n\nThe device supports reading and clearing fault codes, displaying live data, examining freeze frame data, performing active tests, and adaptation and calibration processes. Support scope may vary depending on the vehicle brand, model, production year, and software infrastructure of the relevant control unit.\n\n MaxiFlash VCMI: 5-in-1 Professional Measurement and Communication Unit\n\nOne of the most important differences of the MS919 is the MaxiFlash VCMI unit included in the box. This advanced module transforms the device from an ordinary diagnostic scanner into a highly technical measurement platform.\n\nThe MaxiFlash VCMI performs the following tasks:\n\n Wireless diagnostic communication between tablet and vehicle\n 4-channel oscilloscope measurement\n Multimeter function\n Waveform / signal generator\n CAN BUS line check\n Connection compatible with modern vehicle communication protocols\n\nVCMI supports current vehicle communication protocols such as DoIP, D-PDU, CAN FD, and Mega CAN. This feature helps to perform faster and more comprehensive diagnostics, especially in new generation vehicles. ([Autel][1])\n\nTopology Mapping with Systems on a Single Screen\n\nAutel MaxiSys MS919 can display electronic control units in a color-coded network structure via Topology Module Mapping on supported vehicles. This structure makes it easier to understand which modules are working healthy, which have errors, and the communication relationships between modules.\n\nThis feature saves great time, especially in modern vehicles. Instead of checking each module one by one, the service technician can quickly evaluate the general state of the system via a visual map. ([Autel][1])\n\nCoding, Programming, and Advanced Service Operations\n\nMS919 enables advanced coding, adaptation, and programming operations on supported vehicles. These features are especially important for introducing parts after replacement, configuring control units, service resets, system calibrations, and manufacturer-level operations.\n\nSupported functions vary by vehicle brand and model. Therefore, compatibility checks are recommended specifically for the vehicle to be operated for ECU coding and programming.\n\nOscilloscope Supported Real Fault Analysis\n\nMany faults cannot be definitively diagnosed just by reading error codes. Sensor signals, ignition system, injector control, crankshaft/camshaft signals, voltage fluctuations, and communication line problems often require measurement.\n\nAutel MS919's integrated oscilloscope feature provides great advantages to service professionals at this point. Thanks to ready test guides, component-based measurement support, and waveform library, the user can not only see the fault but also analyze its source more accurately. ([autel.eu][2])\n\nFast, Powerful, and User-Friendly Tablet Structure\n\nAutel MS919 has a powerful hardware infrastructure suitable for professional workshop environments. The device features a 9.7-inch TFT-LCD capacitive touch screen, 1536 × 2048 resolution, octa-core processor, 4 GB RAM, and 128 GB internal memory. It also offers Wi-Fi, Bluetooth, GPS, HDMI, USB connections, and SD card support up to 256 GB. ([Autel][1])\n\nThanks to its rear camera, practical operations like license plate reading, barcode or text recognition are supported. The ScanVIN feature helps to identify vehicle information faster without entering it manually. ([Autel][1])\n\n Who Is It Suitable For?\n\nAutel MaxiSys MS919 is an ideal solution especially for the following users:\n\n Professional auto services\n Electrical-electronic fault specialists\n Auto appraisal centers\n Fleet maintenance businesses\n Technical services serving premium vehicles\n Workshops in need of advanced diagnosis, coding, and measurement\n Users who want to analyze the technical source of the fault, not just read error codes\n\nOutstanding Advantages\n\nAutel MS919 speeds up the diagnostic process in workshops, reduces the need for measurement devices, and helps the technician make more accurate decisions. Since error code, live data, active test, oscilloscope measurement, multimeter control, and communication line analysis are combined on the same platform, it provides serious efficiency in service operations.\n\nThis device provides a much stronger analysis opportunity compared to classic devices, especially in cases where \"there is no error code but there is a problem in the vehicle\". Sensor signals, voltage problems, module communication issues, and electrical faults can be evaluated more clearly.\n\n\n Technical Specifications      \t\tDescription                                             \n ----------------------          ---------------------------------------------------- \n Model                                 \tAutel MaxiSys MS919                                  \n Screen                                   \t9.7 inch TFT-LCD touch screen                     \n Resolution                          \t1536 × 2048                                          \n Processor                                  \tOcta-core processor                             \n Memory                                   \t4 GB RAM / 128 GB internal memory                      \n Operating System                      \tAndroid-based system                               \n VCMI                                     \tMaxiFlash VCMI 5-in-1 interface                    \n Oscilloscope                              4-channel oscilloscope                                  \n Add. Measurements \t    Multimeter, signal generator, CAN BUS test          \n Protocol Support                  \tDoIP, D-PDU, CAN FD, Mega CAN support                \n Connections                            \tWi-Fi, Bluetooth, USB, HDMI, GPS                     \n Camera                                 \tRear camera and front camera                             \n VIN Recognition                          \tScanVIN, barcode/text recognition support                 \n Application Area                       \tProfessional diagnostics, measurement, coding, service ops \n\n\nConclusion:\n\nAutel MaxiSys MS919 is not just a diagnostic scanner, but a comprehensive diagnostic, measurement, and analysis platform developed for professional services. Thanks to its advanced VCMI unit, oscilloscope support, modern vehicle protocols, topology map, and wide service functions, MS919 helps workshops provide faster, more accurate, and more professional service.\n\nIn today's vehicles, where electronic systems are becoming increasingly complex, the right diagnostic device directly affects service quality. Autel MS919 offers a professional solution with its powerful hardware, comprehensive software support, and measurement capabilities.",
    "de": "Autel MaxiSys MS919 Fortgeschrittene Diagnose- und Messplattform\n\nAutel MaxiSys MS919 ist eine erstklassige Diagnose- und Messplattform, die für professionelle Werkstätten, Kfz-Prüfzentren, Flottenwartungsbetriebe und anspruchsvolle Diagnoseanforderungen entwickelt wurde. Die MS919 geht weit über klassische OBD-Fehlerlesegeräte hinaus und bietet eine umfassende Diagnoseinfrastruktur in Werkstätten mit erweitertem Systemscan, Live-Datenanalyse, aktiven Tests, Servicefunktionen, ECU-Codierung/Programmierung und integrierten Messfunktionen.\n\nDie MS919 wurde mit ihrem hochauflösenden 9,7-Zoll-Touchscreen, einem leistungsstarken Octa-Core-Prozessor und 128 GB internem Speicher für eine schnelle, stabile und professionelle Nutzung konzipiert und wird mit der MaxiFlash VCMI-Einheit von Autel geliefert. Diese VCMI-Einheit ist nicht nur eine drahtlose Kommunikationsschnittstelle, sondern fungiert auch als 4-Kanal-Oszilloskop, Multimeter, Wellenformgenerator und CAN-BUS-Tester. So beschränkt sich der Diagnoseprozess nicht nur auf das Auslesen von Fehlercodes; Sensor-, Aktor-, Kommunikationsleitungs- und elektrische Signalanalysen können ebenfalls über dieselbe Plattform durchgeführt werden. ([Autel][1])\n\nErstklassige Diagnosefunktion für professionelle Werkstätten\n\nDie Autel MS919 bietet detaillierte Diagnosemöglichkeiten für Motor, Getriebe, ABS, SRS, ESP, Klimaanlage, Karosseriesteuermodul, Lenkung, Bremsen, Kraftstoffsystem, ADAS-bezogene Systeme und andere unterstützte Module, indem sie einen umfassenden Zugriff auf die elektronischen Steuergeräte im Fahrzeug ermöglicht.\n\nDas Gerät unterstützt das Lesen und Löschen von Fehlercodes, die Anzeige von Live-Daten, die Überprüfung von Freeze-Frame-Daten, die Durchführung aktiver Tests sowie Anpassungs- und Kalibrierungsprozesse. Der Unterstützungsumfang kann je nach Fahrzeugmarke, Modell, Baujahr und Softwareinfrastruktur des jeweiligen Steuergeräts variieren.\n\n MaxiFlash VCMI: 5-in-1 professionelle Mess- und Kommunikationseinheit\n\nEiner der wichtigsten Unterschiede der MS919 is die im Lieferumfang enthaltene MaxiFlash VCMI-Einheit. Dieses fortschrittliche Modul verwandelt das Gerät von einem gewöhnlichen Diagnosescanner in eine hochtechnische Messplattform.\n\nDas MaxiFlash VCMI übernimmt folgende Aufgaben:\n\n Drahtlose Diagnosekommunikation zwischen Tablet und Fahrzeug\n 4-Kanal-Oszilloskop-Messung\n Multimeter-Funktion\n Wellenform- / Signalgenerator\n CAN-BUS-Leitungsprüfung\n Verbindung kompatibel mit modernen Fahrzeugkommunikationsprotokollen\n\nVCMI unterstützt aktuelle Fahrzeugkommunikationsprotokolle wie DoIP, D-PDU, CAN FD und Mega CAN. Diese Funktion hilft dabei, schnellere und umfassendere Diagnosen durchzuführen, insbesondere bei Fahrzeugen der neueren Generation. ([Autel][1])\n\nSysteme auf einem einzigen Bildschirm mit Topology Mapping anzeigen\n\nAutel MaxiSys MS919 kann elektronische Steuergeräte in einer farbcodierten Netzwerkstruktur über Topology Module Mapping auf unterstützten Fahrzeugen anzeigen. Diese Struktur erleichtert es zu verstehen, welche Module fehlerfrei arbeiten, welche Fehler aufweisen und wie die Kommunikationsbeziehungen zwischen den Modulen sind.\n\nDiese Funktion spart vor allem bei modernen Fahrzeugen enorm viel Zeit. Anstatt jedes Modul einzeln zu überprüfen, kann der Werkstattschreiber den Allgemeinzustand des Systems schnell über eine visuelle Karte bewerten. ([Autel][1])\n\nCodierung, Programmierung und erweiterte Servicevorgänge\n\nMS919 ermöglicht erweiterte Codierungs-, Anpassungs- und Programmiervorgänge bei unterstützten Fahrzeugen. Diese Funktionen sind besonders wichtig für das Anlernen von Teilen nach dem Austausch, die Konfiguration von Steuergeräten, Service-Resets, Systemkalibrierungen und herstellerspezifische Vorgänge.\n\nDie unterstützten Funktionen variieren je nach Fahrzeugmarke und -modell. Daher werden Kompatibilitätsprüfungen speziell für das zu bedienende Fahrzeug für die ECU-Codierung und -Programmierung empfohlen.\n\nOszilloskop-Unterstützung für echte Fehleranalyse\n\nViele Fehler können nicht allein durch das Lesen von Fehlercodes definitiv diagnostiziert werden. Sensorsignale, Zündsystem, Einspritzdüsensteuerung, Kurbelwellen-/Nockenwellensignale, Spannungsschwankungen und Probleme mit der Kommunikationsleitung erfordern oft Messungen.\n\nDie integrierte Oszilloskop-Funktion der Autel MS919 bietet Service-Profis an dieser Stelle große Vorteile. Dank vorgefertigter Testanleitungen, komponentenbasierter Messunterstützung und einer Wellenformbibliothek kann der Benutzer den Fehler nicht nur sehen, sondern dessen Ursache auch präziser analysieren. ([autel.eu][2])\n\nSchnelle, leistungsstarke und benutzerfreundliche Tablet-Struktur\n\nDie Autel MS919 verfügt über eine leistungsstarke Hardware-Infrastruktur, die für professionelle Werkstattumgebungen geeignet ist. Das Gerät verfügt über einen kapazitiven 9,7-Zoll-TFT-LCD-Touchscreen, eine Auflösung von 1536 × 2048, einen Octa-Core-Prozessor, 4 GB RAM und 128 GB internen Speicher. Es bietet außerdem Wi-Fi, Bluetooth, GPS, HDMI, USB-Anschlüsse und SD-Kartenunterstützung bis zu 256 GB. ([Autel][1])\n\nDank der Rückkamera werden praktische Funktionen wie Kennzeichenlesung, Barcode- oder Texterkennung unterstützt. Die ScanVIN-Funktion hilft dabei, Fahrzeugdaten schneller zu identifizieren, ohne sie manuell eingeben zu müssen. ([Autel][1])\n\n Für wen ist es geeignet?\n\nAutel MaxiSys MS919 ist eine ideale Lösung, insbesondere für folgende Benutzer:\n\n Professionelle Kfz-Werkstätten\n Spezialisten für elektrisch-elektronische Fehler\n Kfz-Prüfzentren\n Flottenwartungsbetriebe\n Technische Dienste für Premium-Fahrzeuge\n Werkstätten mit Bedarf an fortschrittlicher Diagnose, Codierung und Messung\n Benutzer, die die technische Ursache des Fehlers analysieren möchten und nicht nur Fehlercodes auslesen wollen\n\nHerausragende Vorteile\n\nDie Autel MS919 beschleunigt den Diagnoseprozess in Werkstätten, reduziert den Bedarf an Messgeräten und hilft dem Techniker, präzisere Entscheidungen zu treffen. Da Fehlercode, Live-Daten, aktiver Test, Oszilloskop-Messung, Multimeter-Steuerung und Kommunikationsleitungsanalyse auf derselben Plattform kombiniert sind, sorgt sie für eine erhebliche Effizienz im Werkstattbetrieb.\n\nDieses Gerät bietet im Vergleich zu klassischen Geräten eine viel stärkere Analysemöglichkeit, insbesondere in Fällen, in denen „kein Fehlercode vorhanden ist, aber ein Problem im Fahrzeug vorliegt“. Sensorsignale, Spannungsprobleme, Modulkommunikationsprobleme und elektrische Fehler können klarer ausgewertet werden.\n\n\n Technische Daten      \t\tBeschreibung                                             \n ----------------------          ---------------------------------------------------- \n Modell                                 \tAutel MaxiSys MS919                                  \n Bildschirm                                   \t9,7-Zoll-TFT-LCD-Touchscreen                     \n Auflösung                          \t1536 × 2048                                          \n Prozessor                                  \tOcta-Core-Prozessor                             \n Speicher                                   \t4 GB RAM / 128 GB interner Speicher                      \n Betriebssystem                      \tAndroid-basiertes System                               \n VCMI                                     \tMaxiFlash VCMI 5-in-1-Schnittstelle                    \n Oszilloskop                              4-Kanal-Oszilloskop                                  \n Zusatzmessungen \t    Multimetre, Wellenformgenerator, CAN-BUS-Test          \n Protokollunterstützung                  \tDoIP, D-PDU, CAN FD, Mega CAN-Unterstützung                \n Verbindungen                            \tWi-Fi, Bluetooth, USB, HDMI, GPS                     \n Kamera                                 \tRückkamera und Frontkamera                             \n VIN-Erkennung                          \tScanVIN, Barcode- und Texterkennung                 \n Einsatzbereich                       \tProfessionelle Diagnose, Messung, Codierung, Service ops \n\n\nFazit:\n\nAutel MaxiSys MS919 ist nicht nur ein Diagnosegerät, sondern eine umfassende Diagnose, Mess- und Analyseplattform, die für professionelle Werkstätten entwickelt wurde. Dank der fortschrittlichen VCMI-Einheit, Oszilloskop-Unterstützung, modernen Fahrzeugprotokollen, Topologiekarte und breiten Servicefunktionen hilft die MS919 Werkstätten dabei, schnelleren, präziseren und professionelleren Service zu bieten.\n\nIn den heutigen Fahrzeugen, in denen elektronische Systeme immer komplexer werden, beeinflusst das richtige Diagnosegerät direkt die Servicequalität. Die Autel MS919 bietet eine professionelle Lösung mit ihrer leistungsstarken Hardware, umfassenden Softwareunterstützung und Messfähigkeiten.",
    "ru": "Передовая диагностическая и измерительная платформа Autel MaxiSys MS919\n\nAutel MaxiSys MS919 — это диагностическая и измерительная платформа премиум-класса, разработанная для профессиональных автосервисов, центров техосмотра, автопарков и продвинутых диагностических нужд. Выходя за рамки классических приборов для чтения ошибок OBD, MS919 предлагает комплексную диагностическую инфраструктуру в мастерских с усовершенствованным сканированием систем, анализом данных в реальном времени, активными тестами, сервисными функциями, поддержкой кодирования/программирования ЭБУ и встроенными возможностями измерения.\n\nРазработанный для быстрого, стабильного и профессионального использования благодаря 9,7-дюймовому сенсорному экрану высокого разрешения, мощному 8-ядерному процессору и 128 ГБ встроенной памяти, MS919 поставляется с модулем MaxiFlash VCMI от Autel. Этот модуль VCMI — не просто беспроводной коммуникационный интерфейс, он также выполняет функции 4-канального осциллографа, мультиметра, генератора сигналов и тестера CAN BUS. Таким образом, процесс диагностики не ограничивается простым чтением кодов ошибок; анализ датчиков, исполнительных механизмов, линий связи и электрических сигналов также может выполняться на одной платформе. ([Autel][1])\n\nДиагностические возможности высшего уровня для профессионального сервиса\n\nAutel MS919 обеспечивает детальную диагностику двигателя, трансмиссии, ABS, SRS, ESP, кондиционера, модуля управления кузовом, рулевого управления, тормозов, топливной системы, систем, связанных с ADAS, и других поддерживаемых модулей, предоставляя комплексный доступ к электронным блокам управления автомобиля.\n\nПрибор поддерживает чтение и стирание кодов неисправностей, просмотр данных в реальном времени, анализ данных стоп-кадра, проведение активных тестов, а также процедуры адаптации и калибровки. Объем поддержки зависит от марки, модели, года выпуска автомобиля и программного обеспечения конкретного блока управления.\n\n MaxiFlash VCMI: профессиональный измерительный и коммуникационный модуль 5-в-1\n\nОдним из ключевых отличий MS919 является входящий в комплект модуль MaxiFlash VCMI. Этот продвинутый модуль превращает прибор из обычного диагностического планшета в высокотехнологичную измерительную платформу.\n\nMaxiFlash VCMI выполняет следующие задачи:\n\n Беспроводная диагностическая связь между планшетом и автомобилем\n 4-канальный осциллограф\n Функция мультиметра\n Генератор сигналов / сигналов произвольной формы\n Проверка шины CAN BUS\n Подключение, совместимое с современными протоколами связи автомобилей\n\nVCMI поддерживает современные протоколы связи, такие как DoIP, D-PDU, CAN FD и Mega CAN. Эта функция обеспечивает более быструю и комплексную диагностику, особенно в автомобилях нового поколения. ([Autel][1])\n\nТопологическая карта и просмотр всех систем на одном экране\n\nAutel MaxiSys MS919 на поддерживаемых автомобилях может отображать электронные блоки управления в виде цветной сетевой структуры с помощью функции Topology Module Mapping. Эта структура делает более наглядным понимание того, какие модули работают исправно, в каких есть ошибки и как модули связаны друг с другом.\n\nЭта функция экономит много времени, особенно в современных автомобилях. Вместо проверки каждого модуля по очереди, технический специалист может быстро оценить общее состояние системы по визуальной карте. ([Autel][1])\n\nКодирование, программирование и расширенные сервисные процедуры\n\nMS919 позволяет выполнять расширенные процедуры кодирования, адаптации и программирования на поддерживаемых автомобилях. Эти функции особенно важны для привязки деталей после замены, настройки блоков управления, сброса межсервисных интервалов, калибровки систем и процедур дилерского уровня.\n\nПоддерживаемые функции зависят от марки и модели автомобиля. Поэтому для кодирования и программирования ЭБУ рекомендуется проверять совместимость конкретного автомобиля.\n\nАнализ неисправностей с поддержкой осциллографа\n\nМногие неисправности нельзя точно диагностировать, просто прочитав коды ошибок. Сигналы датчиков, система зажигания, управление форсунками, сигналы коленвала/распредвала, колебания напряжения и проблемы с линиями связи часто требуют измерения.\n\nВстроенный осциллограф Autel MS919 дает огромные преимущества профессионалам автосервиса. Благодаря готовым руководствам по тестированию, поддержке измерений компонентов и библиотеке сигналов пользователь может не только увидеть неисправность, но и более точно проанализировать ее причину. ([autel.eu][2])\n\nБыстрый, мощный и удобный планшет\n\nAutel MS919 имеет мощную аппаратную часть, подходящую для профессионального автосервиса. Прибор оснащен 9,7-дюймовым емкостным сенсорным TFT-LCD экраном с разрешением 1536 × 2048, 8-ядерным процессором, 4 ГБ ОЗУ и 128 ГБ встроенной памяти. Также поддерживаются Wi-Fi, Bluetooth, GPS, HDMI, USB и карты памяти SD до 256 ГБ. ([Autel][1])\n\nЗадняя камера поддерживает практические операции, такие как распознавание номеров, штрихкодов или текста. Функция ScanVIN помогает быстрее идентифицировать информацию об автомобиле без ручного ввода. ([Autel][1])\n\n Для кого подходит?\n\nAutel MaxiSys MS919 — идеальное решение для следующих пользователей:\n\n Профессиональные автосервисы\n Специалисты по автоэлектрике и электронике\n Центры техосмотра\n Автопарки и транспортные компании\n Сервисы, обслуживающие автомобили премиум-класса\n Мастерские, которым требуются продвинутая диагностика, кодирование и измерения\n Пользователи, которые хотят докопаться до технической причины неисправности, а не просто сбросить ошибки\n\nКлючевые преимущества\n\nAutel MS919 ускоряет процесс диагностики в мастерских, снижает потребность в дополнительных измерительных приборах и помогает мастеру принимать более точные решения. Объединение чтения кодов ошибок, реальных данных, активных тестов, осциллографа, мультиметра и анализа шин связи на одной платформе обеспечивает колоссальную эффективность работы автосервиса.\n\nЭтот прибор дает гораздо более мощные возможности анализа по сравнению с классическими сканерами, особенно в случаях, когда «кода ошибки нет, но машина работает плохо». Сигналы датчиков, проблемы с напряжением, сбои связи между модулями и электрические неполадки оцениваются более четко.\n\n\n Технические характеристики      Описание                                             \n ----------------------          ---------------------------------------------------- \n Модель                                 Autel MaxiSys MS919                                  \n Экран                                   9,7-дюймовый сенсорный экран TFT-LCD                     \n Разрешение                          1536 × 2048                                          \n Процессор                                  8-ядерный процессор                             \n Память                                   4 ГБ ОЗУ / 128 ГБ встроенной памяти                      \n Операционная система                      Система на базе Android                               \n VCMI                                     Интерфейс MaxiFlash VCMI 5-в-1                    \n Осциллограф                              4-канальный осциллограф                                  \n Доп. функции измерения \t    Мультиметр, генератор сигналов, тест CAN BUS          \n Поддержка протоколов                  DoIP, D-PDU, CAN FD, Mega CAN                                \n Интерфейсы                            Wi-Fi, Bluetooth, USB, HDMI, GPS                     \n Камера                                 Задняя и передняя камеры                             \n Распознавание VIN                          ScanVIN, распознавание штрихкодов/текста                 \n Область применения                       Профессиональная диагностика, измерения, кодирование \n\n\nИтог:\n\nAutel MaxiSys MS919 — это не просто автосканер, а полноценная платформа диагностики, измерений и анализа для профессиональных техцентров. Благодаря продвинутому модулю VCMI, поддержке осциллографа, современным протоколам, топологической карте и широкому спектру сервисных функций MS919 помогает автосервисам работать быстрее, точнее и профессиональнее.\n\nВ современных автомобилях с усложняющейся электроникой правильный выбор диагностического прибора напрямую определяет качество услуг. Autel MS919 предлагает профессиональное решение благодаря мощному оборудованию, всесторонней программной поддержке и измерительным возможностям.",
    "ka": "Autel MaxiSys MS919 დიაგნოსტიკისა და გაზომვის მოწინავე პლატფორმა\n\nAutel MaxiSys MS919 არის უმაღლესი სეგმენტის სადიაგნოსტიკო და საზომი პლატფორმა, რომელიც შემუშავებულია პროფესიონალური სახელოსნოებისთვის, ავტო-შეფასების ცენტრებისთვის, ავტოპარკების მომსახურებისთვის და მოწინავე დიაგნოსტიკური საჭიროებებისთვის. კლასიკური OBD შეცდომების წამკითხველი მოწყობილობების მიღმა, MS919 გთავაზობთ ყოვლისმომცველ სადიაგნოსტიკო ინფრასტრუქტურას სისტემის გაფართოებული სკანირებით, ცოცხალი მონაცემების ანალიზით, აქტიური ტესტებით, სერვისის ფუნქციებით, ECU კოდირების/პროგრამირების მხარდაჭერით და ინგეგრირებული საზომი შესაძლებლობებით.\n\nდეტალური ინფორმაციისთვის, თავსებადობისა და ფასებისთვის დაგვიკავშირდით WhatsApp-ის საშუალებით."
},
  "9.7 inç yüksek çözünürlüklü dokunmatik ekranı, güçlü sekiz çekirdekli işlemcisi ve 128 gb dahili hafızası ile hızlı, kararlı ve profesyonel kullanım için tasarlanan ms919; autel’in maxiflash vcmi ünitesiyle birlikte gelir. bu vcmi ünitesi yalnızca araçla kablosuz iletişim kuran bir arayüz değildir; aynı zamanda 4 kanallı osiloskop, multimetre, sinyal jeneratörü ve can bus test cihazı olarak da görev yapar. bu sayede arıza tespit süreci yalnızca hata kodu okumakla sınırlı kalmaz; sensör, aktöatör, haberleşme hattı ve elektriksel sinyal analizleri de aynı platform üzerinden yapılabilir. ([autel][1])\\n\\nprofesyonel servisler i̇çin üst düzey teşhis yeteneği\\n\\nautel ms919, araçtaki elektronik kontrol ünitelerine kapsamlı erişim sağlayarak motor, şanzıman, abs, srs, esp, klima, gövde kontrol modülü, direksiyon, fren, yakıt sistemi, adas bağlantılı sistemler ve desteklenen diğer modüller üzerinde detaylı teşhis imkânı sunar.\\n\\ncihaz; arıza kodlarını okuma ve silme, canlı veri görüntüleme, donmuş kare verisi inceleme, aktif testler yapma, adaptasyon ve kalibrasyon işlemlerini destekler. destek kapsamı araç markasına, modeline, üretim yılına ve ilgili kontrol ünitesinin yazılım altyapısına göre değişebilir.\\n\\n maxiflash vcmi: 5’i 1 arada profesyonel ölçüm ve i̇letişim ünitesi\\n\\nms919’un en önemli farklarından biri, kutu içeriğinde yer alan maxiflash vcmi ünitesidir. bu gelişmiş modül, cihazı sıradan bir arıza tespit tabletinden çok daha ileri bir teknik ölçüm platformuna dönüştürür.\\n\\nmaxiflash vcmi şu görevleri üstlenir:\\n\\n araç ile tablet arasında kablosuz teşhis iletişimi\\n 4 kanallı osiloskop ölçümü\\n multimetre fonksiyonu\\n dalga formu / sinyal jeneratörü\\n can bus hattı kontrolü\\n modern araç iletişim protokolleriyle uyumlu bağlantı\\n\\nvcmi; doip, d-pdu, can fd ve mega can gibi güncel araç iletişim protokollerini destekler. bu özellik, özellikle yeni nesil araçlarda daha hızlı ve daha kapsamlı teşhis yapılmasına yardımcı olur. ([autel][1])\\n\\ntopology mapping ile sistemleri tek ekranda görün\\n\\nautel maxisys ms919, desteklenen araçlarda topology module mapping özelliğiyle araçtaki elektronik kontrol ünitelerini renk kodlu bir ağ yapısı üzerinde gösterebilir. bu yapı, hangi modüllerin sağlıklı çalıştığını, hangilerinde hata bulunduğunu ve modüller arasındaki iletişim ilişkilerini daha anlaşılır hale getirir.\\n\\nbu özellik özellikle modern araçlarda büyük zaman kazandırır. servis teknisyeni her modülü tek tek kontrol etmek yerine, sistemin genel durumunu görsel bir harita üzerinden hızlıca değerlendirebilir. ([autel][1])\\n\\nkodlama, programlama ve gelişmiş servis i̇şlemleri\\n\\nms919, desteklenen araçlarda gelişmiş kodlama, adaptasyon ve programlama işlemlerine imkân sağlar. bu özellikler özellikle parça değişimi sonrası tanıtma, kontrol ünitesi yapılandırması, servis sıfırlama, sistem kalibrasyonu ve üretici seviyesine yakın işlemler için önemlidir.\\n\\ndesteklenen fonksiyonlar araç markasına ve modele göre değişir. bu nedenle ecu kodlama ve programlama işlemleri için işlem yapılacak araç özelinde uyumluluk kontrolü önerilir.\\n\\nosiloskop destekli gerçek arıza analizi\\n\\nbirçok arıza yalnızca hata kodu okuyarak kesin şekilde teşhis edilemez. sensör sinyalleri, ateşleme sistemi, enjektör kontrolü, krank/kam mili sinyalleri, voltaj dalgalanmaları ve haberleşme hattı problemleri çoğu zaman ölçüm gerektirir.\\n\\nautel ms919’un entegre osiloskop özelliği, bu noktada servis profesyonellerine büyük avantaj sağlar. hazır test kılavuzları, bileşen bazlı ölçüm desteği ve dalga formu kütüphanesi sayesinde kullanıcı; yalnızca arızayı görmekle kalmaz, arızanın kaynağını daha doğru analiz edebilir. ([autel.eu][2])\\n\\nhızlı, güçlü ve kullanıcı dostu tablet yapısı\\n\\nautel ms919, profesyonel atölye ortamına uygun güçlü bir donanım altyapısına sahiptir. cihazda 9.7 inç tft-lcd kapasitif dokunmatik ekran, 1536 × 2048 çözünürlük, sekiz çekirdekli işlemci, 4 gb ram ve 128 gb dahili hafıza bulunur. ayrıca wi-fi, bluetooth, gps, hdmi, usb bağlantıları ve 256 gb’a kadar sd kart desteği sunar. ([autel][1])\\n\\narka kamerası sayesinde plaka okuma, barkod veya metin tanıma gibi pratik işlemler desteklenir. scanvin özelliği, araç bilgilerini manuel girmeden daha hızlı tanımlamaya yardımcı olur. ([autel][1])\\n\\n kimler i̇çin uygundur?\\n\\nautel maxisys ms919 özellikle şu kullanıcılar için ideal bir çözümdür:\\n\\n profesyonel oto servisleri\\n elektrik-elektronik arıza uzmanları\\n oto ekspertiz merkezleri\\n filo bakım işletmeleri\\n premium araçlara hizmet veren teknik servisler\\n i̇leri seviye teşhis, kodlama ve ölçüm ihtiyacı olan atölyeler\\n sadece hata kodu okumak değil, arızanın teknik kaynağını analiz etmek isteyen kullanıcılar\\n\\nöne çıkan avantajlar\\n\\nautel ms919, servislerde teşhis sürecini hızlandırır, ölçüm cihazı ihtiyacını azaltır ve teknisyenin daha doğru karar vermesine yardımcı olur. arıza kodu, canlı veri, aktif test, osiloskop ölçümü, multimetre kontrolü ve haberleşme hattı analizi aynı platformda birleştirildiği için servis operasyonlarında ciddi verimlilik sağlar.\\n\\nbu cihaz; özellikle “arıza kodu yok ama araçta problem var” durumlarında, klasik cihazlara göre çok daha güçlü bir analiz imkânı sunar. sensör sinyalleri, voltaj problemleri, modül haberleşme sorunları ve elektriksel arızalar daha net değerlendirilebilir.\\n\\n teknik özellikler açıklama \\n ---------------------- ---------------------------------------------------- \\n model autel maxisys ms919 \\n ekran 9.7 inç tft-lcd dokunmatik ekran \\n çözünürlük 1536 × 2048 \\n işlemci sekiz çekirdekli işlemci \\n hafıza 4 gb ram / 128 gb dahili hafıza \\n işletim sistemi android tabanlı sistem \\n vcmi maxiflash vcmi 5’i 1 arada arayüz \\n osiloskop 4 kanallı osiloskop \\n ek ölçüm fonksiyonları multimetre, sinyal jeneratörü, can bus test \\n protokol desteği doip, d-pdu, can fd, mega can desteği \\n bağlantılar wi-fi, bluetooth, usb, hdmi, gps \\n kamera arka kamera ve ön kamera \\n vin tanıma scanvin, barkod/metin tanıma desteği \\n kullanım alanı profesyonel teşhis, ölçüm, kodlama, servis işlemleri \\n\\n\\nsonuç: \\n\\nautel maxisys ms919, sadece bir arıza tespit cihazı değil; profesyonel servisler için geliştirilmiş kapsamlı bir teşhis, ölçüm ve analiz platformudur. gelişmiş vcmi ünitesi, osiloskop desteği, modern araç protokolleri, topoloji haritası ve geniş servis fonksiyonları sayesinde ms919; atölyelerin daha hızlı, daha doğru ve daha profesyonel hizmet vermesine yardımcı olur. \\n\\nelektronik sistemlerin giderek daha karmaşık hale geldiği günümüz araçlarında, doğru teşhis cihazı servis kalitesini doğrudan etkiler. autel ms919, bu ihtiyaca güçlü donanımı, kapsamlı yazılım desteği ve ölçüm kabiliyetleriyle profesyonel bir çözüm sunar.": {
    "tr": "9.7 inç yüksek çözünürlüklü dokunmatik ekranı, güçlü sekiz çekirdekli işlemcisi ve 128 GB dahili hafızası ile hızlı, kararlı ve profesyonel kullanım için tasarlanan MS919; Autel’in MaxiFlash VCMI ünitesiyle birlikte gelir. Bu VCMI ünitesi yalnızca araçla kablosuz iletişim kuran bir arayüz değildir; aynı zamanda 4 kanallı osiloskop, multimetre, sinyal jeneratörü ve can bus test cihazı olarak da görev yapar. Bu sayede arıza tespit süreci yalnızca hata kodu okumakla sınırlı kalmaz; sensör, aktöatör, haberleşme hattı ve elektriksel sinyal analizleri de aynı platform üzerinden yapılabilir. ([Autel][1])\\n\\nProfesyonel Servisler İçin Üst Düzey Teşhis Yeteneği\\n\\nAutel MS919, araçtaki elektronik kontrol ünitelerine kapsamlı erişim sağlayarak motor, şanzıman, abs, srs, esp, klima, gövde kontrol modülü, direksiyon, fren, yakıt sistemi, adas bağlantılı sistemler ve desteklenen diğer modüller üzerinde detaylı teşhis imkânı sunar.\\n\\ncihaz; arıza kodlarını okuma ve silme, canlı veri görüntüleme, donmuş kare verisi inceleme, aktif testler yapma, adaptasyon ve kalibrasyon işlemlerini destekler. destek kapsamı araç markasına, modeline, üretim yılına ve ilgili kontrol ünitesinin yazılım altyapısına göre değişebilir.\\n\\n MaxiFlash VCMI: 5’i 1 Arada Profesyonel Ölçüm ve İletişim Ünitesi\\n\\nms919’un en önemli farklarından biri, kutu içeriğinde yer alan maxiflash vcmi ünitesidir. bu gelişmiş modül, cihazı sıradan bir arıza tespit tabletinden çok daha ileri bir teknik ölçüm platformuna dönüştürür.\\n\\nmaxiflash vcmi şu görevleri üstlenir:\\n\\n araç ile tablet arasında kablosuz teşhis iletişimi\\n 4 kanallı osiloskop ölçümü\\n multimetre fonksiyonu\\n dalga formu / sinyal jeneratörü\\n can bus hattı kontrolü\\n modern araç iletişim protokolleriyle uyumlu bağlantı\\n\\nvcmi; doip, d-pdu, can fd ve mega can gibi güncel araç iletişim protokollerini destekler. bu özellik, özellikle yeni nesil araçlarda daha hızlı ve daha kapsamlı teşhis yapılmasına yardımcı olur. ([autel][1])\\n\\ntopology mapping ile sistemleri tek ekranda görün\\n\\nautel maxisys ms919, desteklenen araçlarda topology module mapping özelliğiyle araçtaki elektronik kontrol ünitelerini renk kodlu bir ağ yapısı üzerinde gösterebilir. bu yapı, hangi modüllerin sağlıklı çalıştığını, hangilerinde hata bulunduğunu ve modüller arasındaki iletişim ilişkilerini daha anlaşılır hale getirir.\\n\\nbu özellik özellikle modern araçlarda büyük zaman kazandırır. servis teknisyeni her modülü tek tek kontrol etmek yerine, sistemin genel durumunu görsel bir harita üzerinden hızlıca değerlendirebilir. ([autel][1])\\n\\nkodlama, programlama ve gelişmiş servis i̇şlemleri\\n\\nms919, desteklenen araçlarda gelişmiş kodlama, adaptasyon ve programlama işlemlerine imkân sağlar. bu özellikler özellikle parça değişimi sonrası tanıtma, kontrol ünitesi yapılandırması, servis sıfırlama, sistem kalibrasyonu ve üretici seviyesine yakın işlemler için önemlidir.\\n\\ndesteklenen fonksiyonlar araç markasına ve modele göre değişir. bu nedenle ecu kodlama ve programlama işlemleri için işlem yapılacak araç özelinde uyumluluk kontrolü önerilir.\\n\\nosiloskop destekli gerçek arıza analizi\\n\\nbirçok arıza yalnızca hata kodu okuyarak kesin şekilde teşhis edilemez. sensör sinyalleri, ateşleme sistemi, enjektör kontrolü, krank/kam mili sinyalleri, voltaj dalgalanmaları ve haberleşme hattı problemleri çoğu zaman ölçüm gerektirir.\\n\\nautel ms919’un entegre osiloskop özelliği, bu noktada servis profesyonellerine büyük avantaj sağlar. hazır test kılavuzları, bileşen bazlı ölçüm desteği ve dalga formu kütüphanesi sayesinde kullanıcı; yalnızca arızayı görmekle kalmaz, arızanın kaynağını daha doğru analiz edebilir. ([autel.eu][2])\\n\\nhızlı, güçlü ve kullanıcı dostu tablet yapısı\\n\\nautel ms919, profesyonel atölye ortamına uygun güçlü bir donanım altyapısına sahiptir. cihazda 9.7 inç tft-lcd kapasitif dokunmatik ekran, 1536 × 2048 çözünürlük, sekiz çekirdekli işlemci, 4 gb ram ve 128 gb dahili hafıza bulunur. ayrıca wi-fi, bluetooth, gps, hdmi, usb bağlantıları ve 256 gb’a kadar sd kart desteği sunar. ([autel][1])\\n\\narka kamerası sayesinde plaka okuma, barkod veya metin tanıma gibi pratik işlemler desteklenir. scanvin özelliği, araç bilgilerini manuel girmeden daha hızlı tanımlamaya yardımcı olur. ([autel][1])\\n\\n kimler i̇çin uygundur?\\n\\nautel maxisys ms919 özellikle şu kullanıcılar için ideal bir çözümdür:\\n\\n profesyonel oto servisleri\\n elektrik-elektronik arıza uzmanları\\n oto ekspertiz merkezleri\\n filo bakım işletmeleri\\n premium araçlara hizmet veren teknik servisler\\n i̇leri seviye teşhis, kodlama ve ölçüm ihtiyacı olan atölyeler\\n sadece hata kodu okumak değil, arızanın teknik kaynağını analiz etmek isteyen kullanıcılar\\n\\nöne çıkan avantajlar\\n\\nautel ms919, servislerde teşhis sürecini hızlandırır, ölçüm cihazı ihtiyacını azaltır ve teknisyenin daha doğru karar vermesine yardımcı olur. arıza kodu, canlı veri, aktif test, osiloskop ölçümü, multimetre kontrolü ve haberleşme hattı analizi aynı platformda birleştirildiği için servis operasyonlarında ciddi verimlilik sağlar.\\n\\nbu cihaz; özellikle “arıza kodu yok ama araçta problem var” durumlarında, klasik cihazlara göre çok daha güçlü bir analiz imkânı sunar. sensör sinyalleri, voltaj problemleri, modül haberleşme sorunları ve elektriksel arızalar daha net değerlendirilebilir.\\n\\n teknik özellikler açıklama \\n ---------------------- ---------------------------------------------------- \\n model autel maxisys ms919 \\n ekran 9.7 inç tft-lcd dokunmatik ekran \\n çözünürlük 1536 × 2048 \\n işlemci sekiz çekirdekli işlemci \\n hafıza 4 gb ram / 128 gb dahili hafıza \\n işletim sistemi android tabanlı sistem \\n vcmi maxiflash vcmi 5’i 1 arada arayüz \\n osiloskop 4 kanallı osiloskop \\n ek ölçüm fonksiyonları multimetre, sinyal jeneratörü, can bus test \\n protokol desteği doip, d-pdu, can fd, mega can desteği \\n bağlantılar wi-fi, bluetooth, usb, hdmi, gps \\n kamera arka kamera ve ön kamera \\n vin tanıma scanvin, barkod/metin tanıma desteği \\n kullanım alanı profesyonel teşhis, ölçüm, kodlama, servis işlemleri \\n\\n\\nsonuç: \\n\\nautel maxisys ms919, sadece bir arıza tespit cihazı değil; profesyonel servisler için geliştirilmiş kapsamlı bir teşhis, ölçüm ve analiz platformudur. gelişmiş vcmi ünitesi, osiloskop desteği, modern araç protokolleri, topoloji haritası ve geniş servis fonksiyonları sayesinde ms919; atölyelerin daha hızlı, daha doğru ve daha profesyonel hizmet vermesine yardımcı olur. \\n\\nelektronik sistemlerin giderek daha karmaşık hale geldiği günümüz araçlarında, doğru teşhis cihazı servis kalitesini doğrudan etkiler. autel ms919, bu ihtiyaca güçlü donanımı, kapsamlı yazılım desteği ve ölçüm kabiliyetleriyle profesyonel bir çözüm sunar.",
    "en": "Designed for fast, stable, and professional use with its 9.7-inch high-resolution touchscreen, powerful octa-core processor, and 128 GB internal memory, the MS919 comes with Autel’s MaxiFlash VCMI unit. This VCMI unit is not just a wireless communication interface; it also functions as a 4-channel oscilloscope, multimeter, waveform generator, and CAN BUS tester. In this way, the diagnostic process is not limited to just reading error codes; sensor, actuator, communication line, and electrical signal analysis can also be done via the same platform. ([Autel][1])\\n\\nHigh-Level Diagnostic Capability for Professional Services\\n\\nAutel MS919 provides detailed diagnostic opportunities on engine, transmission, ABS, SRS, ESP, air conditioner, body control module, steering, brakes, fuel system, ADAS-related systems, and other supported modules by providing comprehensive access to the electronic control units in the vehicle.\\n\\nThe device supports reading and clearing fault codes, displaying live data, examining freeze frame data, performing active tests, and adaptation and calibration processes. Support scope may vary depending on the vehicle brand, model, production year, and software infrastructure of the relevant control unit.\\n\\n MaxiFlash VCMI: 5-in-1 Professional Measurement and Communication Unit\\n\\nOne of the most important differences of the MS919 is the MaxiFlash VCMI unit included in the box. This advanced module transforms the device from an ordinary diagnostic scanner into a highly technical measurement platform.\\n\\nThe MaxiFlash VCMI performs the following tasks:\\n\\n Wireless diagnostic communication between tablet and vehicle\\n 4-channel oscilloscope measurement\\n Multimeter function\\n Waveform / signal generator\\n CAN BUS line check\\n Connection compatible with modern vehicle communication protocols\\n\\nVCMI supports current vehicle communication protocols such as DoIP, D-PDU, CAN FD, and Mega CAN. This feature helps to perform faster and more comprehensive diagnostics, especially in new generation vehicles. ([Autel][1])\\n\\nTopology Mapping with Systems on a Single Screen\\n\\nAutel MaxiSys MS919 can display electronic control units in a color-coded network structure via Topology Module Mapping on supported vehicles. This structure makes it easier to understand which modules are working healthy, which have errors, and the communication relationships between modules.\\n\\nThis feature saves great time, especially in modern vehicles. Instead of checking each module one by one, the service technician can quickly evaluate the general state of the system via a visual map. ([Autel][1])\\n\\nCoding, Programming, and Advanced Service Operations\\n\\nMS919 enables advanced coding, adaptation, and programming operations on supported vehicles. These features are especially important for introducing parts after replacement, configuring control units, service resets, system calibrations, and manufacturer-level operations.\\n\\nSupported functions vary by vehicle brand and model. Therefore, compatibility checks are recommended specifically for the vehicle to be operated for ECU coding and programming.\\n\\nOscilloscope Supported Real Fault Analysis\\n\\nMany faults cannot be definitively diagnosed just by reading error codes. Sensor signals, ignition system, injector control, crankshaft/camshaft signals, voltage fluctuations, and communication line problems often require measurement.\\n\\nAutel MS919's integrated oscilloscope feature provides great advantages to service professionals at this point. Thanks to ready test guides, component-based measurement support, and waveform library, the user can not only see the fault but also analyze its source more accurately. ([autel.eu][2])\\n\\nFast, Powerful, and User-Friendly Tablet Structure\\n\\nAutel MS919 has a powerful hardware infrastructure suitable for professional workshop environments. The device features a 9.7-inch TFT-LCD capacitive touch screen, 1536 × 2048 resolution, octa-core processor, 4 GB RAM, and 128 GB internal memory. It also offers Wi-Fi, Bluetooth, GPS, HDMI, USB connections, and SD card support up to 256 GB. ([Autel][1])\\n\\nThanks to its rear camera, practical operations like license plate reading, barcode or text recognition are supported. The ScanVIN feature helps to identify vehicle information faster without entering it manually. ([Autel][1])\\n\\n Who Is It Suitable For?\\n\\nAutel MaxiSys MS919 is an ideal solution especially for the following users:\\n\\n Professional auto services\\n Electrical-electronic fault specialists\\n Auto appraisal centers\\n Fleet maintenance businesses\\n Technical services serving premium vehicles\\n Workshops in need of advanced diagnosis, coding, and measurement\\n Users who want to analyze the technical source of the fault, not just read error codes\\n\\nOutstanding Advantages\\n\\nAutel MS919 speeds up the diagnostic process in workshops, reduces the need for measurement devices, and helps the technician make more accurate decisions. Since error code, live data, active test, oscilloscope measurement, multimeter control, and communication line analysis are combined on the same platform, it provides serious efficiency in service operations.\\n\\nThis device provides a much stronger analysis opportunity compared to classic devices, especially in cases where \\\"there is no error code but there is a problem in the vehicle\\\". Sensor signals, voltage problems, module communication issues, and electrical faults can be evaluated more clearly.\\n\\n\\n Technical Specifications      \\t\\tDescription                                             \\n ----------------------          ---------------------------------------------------- \\n Model                                 \\tAutel MaxiSys MS919                                  \\n Screen                                   \\t9.7 inch TFT-LCD touch screen                     \\n Resolution                          \\t1536 × 2048                                          \\n Processor                                  \\tOcta-core processor                             \\n Memory                                   \\t4 GB RAM / 128 GB internal memory                      \\n Operating System                      \\tAndroid-based system                               \\n VCMI                                     \\tMaxiFlash VCMI 5-in-1 interface                    \\n Oscilloscope                              4-channel oscilloscope                                  \\n Add. Measurements \\t    Multimeter, signal generator, CAN BUS test          \\n Protocol Support                  \\tDoIP, D-PDU, CAN FD, Mega CAN support                \\n Connections                            \\tWi-Fi, Bluetooth, USB, HDMI, GPS                     \\n Camera                                 \\tRear camera and front camera                             \\n VIN Recognition                          \\tScanVIN, barcode/text recognition support                 \\n Application Area                       \\tProfessional diagnostics, measurement, coding, service ops \\n\\n\\nConclusion:\\n\\nAutel MaxiSys MS919 is not just a diagnostic scanner, but a comprehensive diagnostic, measurement, and analysis platform developed for professional services. Thanks to its advanced VCMI unit, oscilloscope support, modern vehicle protocols, topology map, and wide service functions, MS919 helps workshops provide faster, more accurate, and more professional service.\\n\\nIn today's vehicles, where electronic systems are becoming increasingly complex, the right diagnostic device directly affects service quality. Autel MS919 offers a professional solution with its powerful hardware, comprehensive software support, and measurement capabilities.",
    "de": "Die MS919 wurde mit ihrem hochauflösenden 9,7-Zoll-Touchscreen, einem leistungsstarken Octa-Core-Prozessor und 128 GB internem Speicher für eine schnelle, stabile und professionelle Nutzung konzipiert und wird mit der MaxiFlash VCMI-Einheit von Autel geliefert. Diese VCMI-Einheit ist nicht nur eine drahtlose Kommunikationsschnittstelle, sondern fungiert auch als 4-Kanal-Oszilloskop, Multimeter, Wellenformgenerator und CAN-BUS-Tester. So beschränkt sich der Diagnoseprozess nicht nur auf das Auslesen von Fehlercodes; Sensor-, Aktor-, Kommunikationsleitungs- und elektrische Signalanalysen können ebenfalls über dieselbe Plattform durchgeführt werden. ([Autel][1])\\n\\nErstklassige Diagnosefunktion für professionelle Werkstätten\\n\\nDie Autel MS919 bietet detaillierte Diagnosemöglichkeiten für Motor, Getriebe, ABS, SRS, ESP, Klimaanlage, Karosseriesteuermodul, Lenkung, Bremsen, Kraftstoffsystem, ADAS-bezogene Systeme und andere unterstützte Module, indem sie einen umfassenden Zugriff auf die elektronischen Steuergeräte im Fahrzeug ermöglicht.\\n\\nDas Gerät unterstützt das Lesen und Löschen von Fehlercodes, die Anzeige von Live-Daten, die Überprüfung von Freeze-Frame-Daten, die Durchführung aktiver Tests sowie Anpassungs- und Kalibrierungsprozesse. Der Unterstützungsumfang kann je nach Fahrzeugmarke, Modell, Baujahr und Softwareinfrastruktur des jeweiligen Steuergeräts variieren.\\n\\n MaxiFlash VCMI: 5-in-1 professionelle Mess- und Kommunikationseinheit\\n\\nEiner der wichtigsten Unterschiede der MS919 is die im Lieferumfang enthaltene MaxiFlash VCMI-Einheit. Dieses fortschrittliche Modul verwandelt das Gerät von einem gewöhnlichen Diagnosescanner in eine hochtechnische Messplattform.\\n\\nDas MaxiFlash VCMI übernimmt folgende Aufgaben:\\n\\n Drahtlose Diagnosekommunikation zwischen Tablet und Fahrzeug\\n 4-Kanal-Oszilloskop-Messung\\n Multimeter-Funktion\\n Wellenform- / Signalgenerator\\n CAN-BUS-Leitungsprüfung\\n Verbindung kompatibel mit modernen Fahrzeugkommunikationsprotokollen\\n\\nVCMI unterstützt aktuelle Fahrzeugkommunikationsprotokolle wie DoIP, D-PDU, CAN FD und Mega CAN. Diese Funktion hilft dabei, schnellere und umfassendere Diagnosen durchzuführen, insbesondere bei Fahrzeugen der neueren Generation. ([Autel][1])\\n\\nSysteme auf einem einzigen Bildschirm mit Topology Mapping anzeigen\\n\\nAutel MaxiSys MS919 kann elektronische Steuergeräte in einer farbcodierten Netzwerkstruktur über Topology Module Mapping auf unterstützten Fahrzeugen anzeigen. Diese Struktur erleichtert es zu verstehen, welche Module fehlerfrei arbeiten, welche Fehler aufweisen und wie die Kommunikationsbeziehungen zwischen den Modulen sind.\\n\\nDiese Funktion spart vor allem bei modernen Fahrzeugen enorm viel Zeit. Anstatt jedes Modul einzeln zu überprüfen, kann der Werkstattschreiber den Allgemeinzustand des Systems schnell über eine visuelle Karte bewerten. ([Autel][1])\\n\\nCodierung, Programmierung und erweiterte Servicevorgänge\\n\\nMS919 ermöglicht erweiterte Codierungs-, Anpassungs- und Programmiervorgänge bei unterstützten Fahrzeugen. Diese Funktionen sind besonders wichtig für das Anlernen von Teilen nach dem Austausch, die Konfiguration von Steuergeräten, Service-Resets, Systemkalibrierungen und herstellerspezifische Vorgänge.\\n\\nDie unterstützten Funktionen variieren je nach Fahrzeugmarke und -modell. Daher werden Kompatibilitätsprüfungen speziell für das zu bedienende Fahrzeug für die ECU-Codierung und -Programmierung empfohlen.\\n\\nOszilloskop-Unterstützung für echte Fehleranalyse\\n\\nViele Fehler können nicht allein durch das Lesen von Fehlercodes definitiv diagnostiziert werden. Sensorsignale, Zündsystem, Einspritzdüsensteuerung, Kurbelwellen-/Nockenwellensignale, Spannungsschwankungen und Probleme mit der Kommunikationsleitung erfordern oft Messungen.\\n\\nDie integrierte Oszilloskop-Funktion der Autel MS919 bietet Service-Profis an dieser Stelle große Vorteile. Dank vorgefertigter Testanleitungen, komponentenbasierter Messunterstützung und einer Wellenformbibliothek kann der Benutzer den Fehler nicht nur sehen, sondern dessen Ursache auch präziser analysieren. ([autel.eu][2])\\n\\nSchnelle, leistungsstarke und benutzerfreundliche Tablet-Struktur\\n\\nDie Autel MS919 verfügt über eine leistungsstarke Hardware-Infrastruktur, die für professionelle Werkstattumgebungen geeignet ist. Das Gerät verfügt über einen kapazitiven 9,7-Zoll-TFT-LCD-Touchscreen, eine Auflösung von 1536 × 2048, einen Octa-Core-Prozessor, 4 GB RAM und 128 GB internen Speicher. Es bietet außerdem Wi-Fi, Bluetooth, GPS, HDMI, USB-Anschlüsse und SD-Kartenunterstützung bis zu 256 GB. ([Autel][1])\\n\\nDank der Rückkamera werden praktische Funktionen wie Kennzeichenlesung, Barcode- oder Texterkennung unterstützt. Die ScanVIN-Funktion hilft dabei, Fahrzeugdaten schneller zu identifizieren, ohne sie manuell eingeben zu müssen. ([Autel][1])\\n\\n Für wen ist es geeignet?\\n\\nAutel MaxiSys MS919 ist eine ideale Lösung, insbesondere für folgende Benutzer:\\n\\n Professionelle Kfz-Werkstätten\\n Spezialisten für elektrisch-elektronische Fehler\\n Kfz-Prüfzentren\\n Flottenwartungsbetriebe\\n Technische Dienste für Premium-Fahrzeuge\\n Werkstätten mit Bedarf an fortschrittlicher Diagnose, Codierung und Messung\\n Benutzer, die die technische Ursache des Fehlers analysieren möchten und nicht nur Fehlercodes auslesen wollen\\n\\nHerausragende Vorteile\\n\\nDie Autel MS919 beschleunigt den Diagnoseprozess in Werkstätten, reduziert den Bedarf an Messgeräten und hilft dem Techniker, präzisere Entscheidungen zu treffen. Da Fehlercode, Live-Daten, aktiver Test, Oszilloskop-Messung, Multimeter-Steuerung und Kommunikationsleitungsanalyse auf derselben Plattform kombiniert sind, sorgt sie für eine erhebliche Effizienz im Werkstattbetrieb.\\n\\nDieses Gerät bietet im Vergleich zu klassischen Geräten eine viel stärkere Analysemöglichkeit, insbesondere in Fällen, in denen „kein Fehlercode vorhanden ist, aber ein Problem im Fahrzeug vorliegt“. Sensorsignale, Spannungsprobleme, Modulkommunikationsprobleme und elektrische Fehler können klarer ausgewertet werden.\\n\\n\\n Technische Daten      \\t\\tBeschreibung                                             \\n ----------------------          ---------------------------------------------------- \\n Modell                                 \\tAutel MaxiSys MS919                                  \\n Bildschirm                                   \\t9,7-Zoll-TFT-LCD-Touchscreen                     \\n Auflösung                          \\t1536 × 2048                                          \\n Prozessor                                  \\tOcta-Core-Prozessor                             \\n Speicher                                   \\t4 GB RAM / 128 GB interner Speicher                      \\n Betriebssystem                      \\tAndroid-basiertes System                               \\n VCMI                                     \\tMaxiFlash VCMI 5-in-1-Schnittstelle                    \\n Oszilloskop                              4-Kanal-Oszilloskop                                  \\n Zusatzmessungen \\t    Multimetre, Wellenformgenerator, CAN-BUS-Test          \\n Protokollunterstützung                  \\tDoIP, D-PDU, CAN FD, Mega CAN-Unterstützung                \\n Verbindungen                            \\tWi-Fi, Bluetooth, USB, HDMI, GPS                     \\n Kamera                                 \\tRückkamera und Frontkamera                             \\n VIN-Erkennung                          \\tScanVIN, Barcode- und Texterkennung                 \\n Einsatzbereich                       \\tProfessionelle Diagnose, Messung, Codierung, Service ops \\n\\n\\nFazit:\\n\\nAutel MaxiSys MS919 ist nicht nur ein Diagnosegerät, sondern eine umfassende Diagnose, Mess- und Analyseplattform, die für professionelle Werkstätten entwickelt wurde. Dank der fortschrittlichen VCMI-Einheit, Oszilloskop-Unterstützung, modernen Fahrzeugprotokollen, Topologiekarte und breiten Servicefunktionen hilft die MS919 Werkstätten dabei, schnelleren, präziseren und professionelleren Service zu bieten.\\n\\nIn den heutigen Fahrzeugen, in denen elektronische Systeme immer komplexer werden, beeinflusst das richtige Diagnosegerät direkt die Servicequalität. Die Autel MS919 bietet eine professionelle Lösung mit ihrer leistungsstarken Hardware, umfassenden Softwareunterstützung und Messfähigkeiten.",
    "ru": "Разработанный для быстрого, стабильного и профессионального использования благодаря 9,7-дюймовому сенсорному экрану высокого разрешения, мощному 8-ядерному процессору и 128 ГБ встроенной памяти, MS919 поставляется с модулем MaxiFlash VCMI от Autel. Этот модуль VCMI — не просто беспроводной коммуникационный интерфейс, он также выполняет функции 4-канального осциллографа, мультиметра, генератора сигналов и тестера CAN BUS. Таким образом, процесс диагностики не ограничивается простым чтением кодов ошибок; анализ датчиков, исполнительных механизмов, линий связи и электрических сигналов также может выполняться на одной платформе. ([Autel][1])\\n\\nДиагностические возможности высшего уровня для профессионального сервиса\\n\\nAutel MS919 обеспечивает детальную диагностику двигателя, трансмиссии, ABS, SRS, ESP, кондиционера, модуля управления кузовом, рулевого управления, тормозов, топливной системы, систем, связанных с ADAS, и других поддерживаемых модулей, предоставляя комплексный доступ к электронным блокам управления автомобиля.\\n\\nПрибор поддерживает чтение и стирание кодов неисправностей, просмотр данных в реальном времени, анализ данных стоп-кадра, проведение активных тестов, а также процедуры адаптации и калибровки. Объем поддержки зависит от марки, модели, года выпуска автомобиля и программного обеспечения конкретного блока управления.\\n\\n MaxiFlash VCMI: профессиональный измерительный и коммуникационный модуль 5-в-1\\n\\nОдним из ключевых отличий MS919 является входящий в комплект модуль MaxiFlash VCMI. Этот продвинутый модуль превращает прибор из обычного диагностического планшета в высокотехнологичную измерительную платформу.\\n\\nMaxiFlash VCMI выполняет следующие задачи:\\n\\n Беспроводная диагностическая связь между планшетом и автомобилем\\n 4-канальный осциллограф\\n Функция мультиметра\\n Генератор сигналов / сигналов произвольной формы\\n Проверка шины CAN BUS\\n Подключение, совместимое с современными протоколами связи автомобилей\\n\\nVCMI поддерживает современные протоколы связи, такие как DoIP, D-PDU, CAN FD и Mega CAN. Эта функция обеспечивает более быструю и комплексную диагностику, особенно в автомобилях нового поколения. ([Autel][1])\\n\\nТопологическая карта и просмотр всех систем на одном экране\\n\\nAutel MaxiSys MS919 на поддерживаемых автомобилях может отображать электронные блоки управления в виде цветной сетевой структуры с помощью функции Topology Module Mapping. Эта структура делает более наглядным понимание того, какие модули работают исправно, в каких есть ошибки и как модули связаны друг с другом.\\n\\nЭта функция экономит много времени, особенно в современных автомобилях. Вместо проверки каждого модуля по очереди, технический специалист может быстро оценить общее состояние системы по визуальной карте. ([Autel][1])\\n\\nКодирование, программирование и расширенные сервисные процедуры\\n\\nMS919 позволяет выполнять расширенные процедуры кодирования, адаптации и программирования на поддерживаемых автомобилях. Эти функции особенно важны для привязки деталей после замены, настройки блоков управления, сброса межсервисных интервалов, калибровки систем и процедур дилерского уровня.\\n\\nПоддерживаемые функции зависят от марки и модели автомобиля. Поэтому для кодирования и программирования ЭБУ рекомендуется проверять совместимость конкретного автомобиля.\\n\\nАнализ неисправностей с поддержкой осциллографа\\n\\nМногие неисправности нельзя точно диагностировать, просто прочитав коды ошибок. Сигналы датчиков, система зажигания, управление форсунками, сигналы коленвала/распредвала, колебания напряжения и проблемы с линиями связи часто требуют измерения.\\n\\nВстроенный осциллограф Autel MS919 дает огромные преимущества профессионалам автосервиса. Благодаря готовым руководствам по тестированию, поддержке измерений компонентов и библиотеке сигналов пользователь может не только увидеть неисправность, но и более точно проанализировать ее причину. ([autel.eu][2])\\n\\nБыстрый, мощный и удобный планшет\\n\\nAutel MS919 имеет мощную аппаратную часть, подходящую для профессионального автосервиса. Прибор оснащен 9,7-дюймовым емкостным сенсорным TFT-LCD экраном с разрешением 1536 × 2048, 8-ядерным процессором, 4 ГБ ОЗУ и 128 ГБ встроенной памяти. Также поддерживаются Wi-Fi, Bluetooth, GPS, HDMI, USB и карты памяти SD до 256 ГБ. ([Autel][1])\\n\\nЗадняя камера поддерживает практические операции, такие как распознавание номеров, штрихкодов или текста. Функция ScanVIN помогает быстрее идентифицировать информацию об автомобиле без ручного ввода. ([Autel][1])\\n\\n Для кого подходит?\\n\\nAutel MaxiSys MS919 — идеальное решение для следующих пользователей:\\n\\n Профессиональные автосервисы\\n Специалисты по автоэлектрике и электронике\\n Центры техосмотра\\n Автопарки и транспортные компании\\n Сервисы, обслуживающие автомобили премиум-класса\\n Мастерские, которым требуются продвинутая диагностика, кодирование и измерения\\n Пользователи, которые хотят докопаться до технической причины неисправности, а не просто сбросить ошибки\\n\\nКлючевые преимущества\\n\\nAutel MS919 ускоряет процесс диагностики в мастерских, снижает потребность в дополнительных измерительных приборах и помогает мастеру принимать более точные решения. Объединение чтения кодов ошибок, реальных данных, активных тестов, осциллографа, мультиметра и анализа шин связи на одной платформе обеспечивает колоссальную эффективность работы автосервиса.\\n\\nЭтот прибор дает гораздо более мощные возможности анализа по сравнению с классическими сканерами, особенно в случаях, когда «кода ошибки нет, но машина работает плохо». Сигналы датчиков, проблемы с напряжением, сбои связи между модулями и электрические неполадки оцениваются более четко.\\n\\n\\n Технические характеристики      Описание                                             \\n ----------------------          ---------------------------------------------------- \\n Модель                                 Autel MaxiSys MS919                                  \\n Экран                                   9,7-дюймовый сенсорный экран TFT-LCD                     \\n Разрешение                          1536 × 2048                                          \\n Процессор                                  8-ядерный процессор                             \\n Память                                   4 ГБ ОЗУ / 128 ГБ встроенной памяти                      \\n Операционная система                      Система на базе Android                               \\n VCMI                                     Интерфейс MaxiFlash VCMI 5-в-1                    \\n Осциллограф                              4-канальный осциллограф                                  \\n Доп. функции измерения \\t    Мультиметр, генератор сигналов, тест CAN BUS          \\n Поддержка протоколов                  DoIP, D-PDU, CAN FD, Mega CAN                                \\n Интерфейсы                            Wi-Fi, Bluetooth, USB, HDMI, GPS                     \\n Камера                                 Задняя и передняя камеры                             \\n Распознавание VIN                          ScanVIN, распознавание штрихкодов/текста                 \\n Область применения                       Профессиональная диагностика, измерения, кодирование \\n\\n\\nИтог:\\n\\nAutel MaxiSys MS919 — это не просто автосканер, а полноценная платформа диагностики, измерений и анализа для профессиональных техцентров. Благодаря продвинутому модулю VCMI, поддержке осциллографа, современным протоколам, топологической карте и широкому спектру сервисных функций MS919 помогает автосервисам работать быстрее, точнее и профессиональнее.\\n\\nВ современных автомобилях с усложняющейся электроникой правильный выбор диагностического прибора напрямую определяет качество услуг. Autel MS919 предлагает профессиональное решение благодаря мощному оборудованию, всесторонней программной поддержке и измерительным возможностям.",
    "ka": "დეტალური ინფორმაციისთვის, თავსებადობისა და ფასებისთვის დაგვიკავშირდით WhatsApp-ის საშუალებით."
  },
  "autel ms 909 s2": {
    "tr": "AUTEL MS 909 S2",
    "en": "Autel MS909 S2 Diagnostic Scanner",
    "de": "Autel MS909 S2 Diagnosegerät",
    "ru": "Диагностический автосканер Autel MS909 S2",
    "ka": "Autel MS909 S2 სადიაგნოსტიკო აპარატი"
},
  "autel ms909 s2 arıza tespit cihazı, modern araçlarda hızlı, doğru ve profesyonel teşhis yapmak isteyen servisler için geliştirilmiş üst segment bir diagnostik çözümdür. yeni nesil donanımı, güçlü işlem kapasitesi ve gelişmiş yazılım altyapısı sayesinde klasik arıza tespit cihazlarının ötesine geçer. ms909 s2, hem hız hem doğruluk isteyen profesyoneller için tasarlanmış gerçek bir servis yardımcısıdır. ━━━━━━━━━━━━━━━━━━━ güçlü donanim altyapisi ━━━━━━━━━━━━━━━━━━━ • 9.7” geniş ve yüksek çözünürlüklü dokunmatik ekran • android 13 işletim sistemi ile modern ve hızlı kullanım • 256 gb dahili depolama alanı • yüksek performanslı işlemci ile akıcı çalışma • wi-fi 6 ile ultra hızlı internet bağlantısı ve güncelleme • bluetooth ile kablosuz iletişim • dayanıklı ve profesyonel taşıma çantası ━━━━━━━━━━━━━━━━━━━ maxiflash vci2 i̇le güçlü bağlanti ━━━━━━━━━━━━━━━━━━━ • hızlı ve stabil araç bağlantısı • geniş araç kapsama alanı • kablosuz teşhis imkânı • yoğun servis kullanımı için güvenilir performans ━━━━━━━━━━━━━━━━━━━ profesyonel teşhi̇s özelli̇kleri̇ ━━━━━━━━━━━━━━━━━━━ • oe (yetkili servis) seviyesinde arıza tespiti • 3d topoloji haritası ile sistemler arası bağlantı analizi • hata kodu okuma ve silme • canlı veri akışı (live data) ve grafiksel analiz • ecu programlama (j2534 pass-thru desteği) • sistem testleri ve detaylı teşhis işlemleri ━━━━━━━━━━━━━━━━━━━ 36+ servi̇s fonksi̇yonu ━━━━━━━━━━━━━━━━━━━ • yağ bakım sıfırlama • fren sistemi işlemleri • direksiyon açısı kalibrasyonu • dpf rejenerasyonu • enjektör kodlama • akü eşleştirme • tpms işlemleri • ve çok daha fazlası... ━━━━━━━━━━━━━━━━━━━ akilli ve yeni̇ nesi̇l teknoloji̇ ━━━━━━━━━━━━━━━━━━━ • yapay zeka destekli arıza analiz sistemi • akıllı teşhis önerileri • gelişmiş raporlama sistemi • hızlı veri işleme ve analiz • kullanıcı dostu arayüz ━━━━━━━━━━━━━━━━━━━ bu ci̇hazla ne kazanirsin ? ━━━━━━━━━━━━━━━━━━━ • arızayı daha hızlı ve doğru bulursun • gereksiz parça değişimini önlersin • servis süresini kısaltırsın • daha profesyonel hizmet sunarsın • müşteri güvenini artırırsın ━━━━━━━━━━━━━━━━━━━ ki̇mler i̇çi̇n ? ━━━━━━━━━━━━━━━━━━━ • profesyonel oto servisler • oto elektrik ustaları • diagnostik işi yapan işletmeler • i̇leri seviye cihaz isteyen kullanıcılar ━━━━━━━━━━━━━━━━━━━ sonuç ━━━━━━━━━━━━━━━━━━━ autel ms909 s2, sıradan bir arıza tespit cihazı değil; servisinizin hızını, doğruluğunu ve iş kalitesini artıran güçlü bir profesyonel çözümdür. zor arızaları hızlı çözmek, doğru teşhisle zaman kazanmak ve müşterilerinize güven vermek istiyorsanız bu cihaz en doğru tercihlerden biridir. detaylı bilgi, uyumluluk ve fiyat bilgisi için whatsapp üzerinden bizimle iletişime geçebilirsiniz.": {
    "tr": "Autel MS909 S2 Arıza Tespit Cihazı, \nmodern araçlarda hızlı, doğru ve profesyonel teşhis yapmak isteyen servisler için geliştirilmiş \nüst segment bir diagnostik çözümdür.\n\nYeni nesil donanımı, güçlü işlem kapasitesi ve gelişmiş yazılım altyapısı sayesinde \nklasik arıza tespit cihazlarının ötesine geçer. \nMS909 S2, hem hız hem doğruluk isteyen profesyoneller için tasarlanmış \ngerçek bir servis yardımcısıdır.\n\n━━━━━━━━━━━━━━━━━━━\nGÜÇLÜ DONANIM ALTYAPISI\n━━━━━━━━━━━━━━━━━━━\n\n• 9.7” geniş ve yüksek çözünürlüklü dokunmatik ekran\n• Android 13 işletim sistemi ile modern ve hızlı kullanım\n• 256 GB dahili depolama alanı\n• Yüksek performanslı işlemci ile akıcı çalışma\n• Wi-Fi 6 ile ultra hızlı internet bağlantısı ve güncelleme\n• Bluetooth ile kablosuz iletişim\n• Dayanıklı ve profesyonel taşıma çantası\n\n━━━━━━━━━━━━━━━━━━━\nMAXIFLASH VCI2 İLE GÜÇLÜ BAĞLANTI\n━━━━━━━━━━━━━━━━━━━\n\n• Hızlı ve stabil araç bağlantısı\n• Geniş araç kapsama alanı\n• Kablosuz teşhis imkânı\n• Yoğun servis kullanımı için güvenilir performans\n\n━━━━━━━━━━━━━━━━━━━\nPROFESYONEL TEŞHİS ÖZELLİKLERİ\n━━━━━━━━━━━━━━━━━━━\n\n• OE (yetkili servis) seviyesinde arıza tespiti\n• 3D Topoloji haritası ile sistemler arası bağlantı analizi\n• Hata kodu okuma ve silme\n• Canlı veri akışı (Live Data) ve grafiksel analiz\n• ECU programlama (J2534 Pass-Thru desteği)\n• Sistem testleri ve detaylı teşhis işlemleri\n\n━━━━━━━━━━━━━━━━━━━\n36+ SERVİS FONKSİYONU\n━━━━━━━━━━━━━━━━━━━\n\n• Yağ bakım sıfırlama\n• Fren sistemi işlemleri\n• Direksiyon açısı kalibrasyonu\n• DPF rejenerasyonu\n• Enjektör kodlama\n• Akü eşleştirme\n• TPMS işlemleri\n• Ve çok daha fazlası...\n\n━━━━━━━━━━━━━━━━━━━\nAKILLI VE YENİ NESİL TEKNOLOJİ\n━━━━━━━━━━━━━━━━━━━\n\n• Yapay zeka destekli arıza analiz sistemi\n• Akıllı teşhis önerileri\n• Gelişmiş raporlama sistemi\n• Hızlı veri işleme ve analiz\n• Kullanıcı dostu arayüz\n\n━━━━━━━━━━━━━━━━━━━\nBU CİHAZLA NE KAZANIRSIN ?\n━━━━━━━━━━━━━━━━━━━\n\n• Arızayı daha hızlı ve doğru bulursun\n• Gereksiz parça değişimini önlersin\n• Servis süresini kısaltırsın\n• Daha profesyonel hizmet sunarsın\n• Müşteri güvenini artırırsın\n\n━━━━━━━━━━━━━━━━━━━\nKİMLER İÇİN ?\n━━━━━━━━━━━━━━━━━━━\n\n• Profesyonel oto servisler\n• Oto elektrik ustaları\n• Diagnostik işi yapan işletmeler\n• İleri seviye cihaz isteyen kullanıcılar\n\n━━━━━━━━━━━━━━━━━━━\nSONUÇ\n━━━━━━━━━━━━━━━━━━━\n\nAutel MS909 S2, sıradan bir arıza tespit cihazı değil; servisinizin hızını, doğruluğunu ve iş kalitesini artıran güçlü bir profesyonel çözümdür.\n\nZor arızaları hızlı çözmek, doğru teşhisle zaman kazanmak ve müşterilerinize güven vermek istiyorsanız bu cihaz en doğru tercihlerden biridir.\n\nDetaylı bilgi, uyumluluk ve fiyat bilgisi için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
    "en": "Autel MS909 S2 Diagnostic Scanner is a top-tier diagnostic solution developed for services that want to make fast, accurate, and professional diagnostics in modern vehicles.\n\nThanks to its new generation hardware, powerful processing capacity, and advanced software infrastructure, it goes beyond classic diagnostic scanners. MS909 S2 is a real service helper designed for professionals who want both speed and accuracy.\n\n━━━━━━━━━━━━━━━━━━━\nPOWERFUL HARDWARE INFRASTRUCTURE\n━━━━━━━━━━━━━━━━━━━\n\n• 9.7” wide and high-resolution touchscreen\n• Android 13 operating system for modern and fast usage\n• 256 GB internal storage space\n• Fluid operation with high-performance processor\n• Ultra-fast internet connection and updates with Wi-Fi 6\n• Wireless communication with Bluetooth\n• Durable and professional carrying case\n\n━━━━━━━━━━━━━━━━━━━\nPOWERFUL CONNECTION WITH MAXIFLASH VCI2\n━━━━━━━━━━━━━━━━━━━\n\n• Fast and stable vehicle connection\n• Wide vehicle coverage\n• Wireless diagnostic opportunity\n• Reliable performance for intensive service use\n\n━━━━━━━━━━━━━━━━━━━\nPROFESSIONAL DIAGNOSTIC FEATURES\n━━━━━━━━━━━━━━━━━━━\n\n• OE (dealer level) diagnostics\n• System connection analysis with 3D Topology mapping\n• Fault code reading and clearing\n• Live Data stream and graphical analysis\n• ECU programming (J2534 Pass-Thru support)\n• System tests and detailed diagnostic operations\n\n━━━━━━━━━━━━━━━━━━━\n36+ SERVICE FUNCTIONS\n━━━━━━━━━━━━━━━━━━━\n\n• Oil reset\n• Brake system operations\n• Steering angle calibration\n• DPF regeneration\n• Injector coding\n• Battery matching\n• TPMS operations\n• And much more...\n\n━━━━━━━━━━━━━━━━━━━\nSMART AND NEW GENERATION TECHNOLOGY\n━━━━━━━━━━━━━━━━━━━\n\n• AI-supported fault analysis system\n• Smart diagnostic recommendations\n• Advanced reporting system\n• Fast data processing and analysis\n• User-friendly interface\n\n━━━━━━━━━━━━━━━━━━━\nWHAT DO YOU GAIN WITH THIS DEVICE?\n━━━━━━━━━━━━━━━━━━━\n\n• You find faults faster and more accurately\n• You prevent unnecessary parts replacement\n• You shorten service time\n• You offer more professional service\n• You increase customer trust\n\n━━━━━━━━━━━━━━━━━━━\nWHO IS IT FOR?\n━━━━━━━━━━━━━━━━━━━\n\n• Professional auto services\n• Auto electricians\n• Businesses doing diagnostics\n• Users looking for advanced scanner\n\n━━━━━━━━━━━━━━━━━━━\nCONCLUSION\n━━━━━━━━━━━━━━━━━━━\n\nAutel MS909 S2 is not an ordinary diagnostic scanner; it is a powerful professional solution that increases the speed, accuracy, and quality of your service.\n\nIf you want to solve difficult faults quickly, save time with correct diagnosis, and give confidence to your customers, this device is one of the best choices.\n\nYou can contact us via WhatsApp for detailed information, compatibility, and price details.",
    "de": "Das Autel MS909 S2 Diagnosegerät ist eine erstklassige Diagnoselösung, die für Werkstätten entwickelt wurde, die eine schnelle, präzise und professionelle Diagnose an modernen Fahrzeugen durchführen möchten.\n\nDank seiner Hardware der neuen Generation, der leistungsstarken Verarbeitungskapazität und der fortschrittlichen Software-Infrastruktur geht es weit über klassische Diagnosegeräte hinaus. Das MS909 S2 ist ein echter Werkstatthelfer für Profis, die sowohl Schnelligkeit als auch Präzision verlangen.\n\n━━━━━━━━━━━━━━━━━━━\nLEISTUNGSSTARKE HARDWARE-INFRASTRUKTUR\n━━━━━━━━━━━━━━━━━━━\n\n• 9,7-Zoll großer und hochauflösender Touchscreen\n• Android 13 Betriebssystem für moderne und schnelle Nutzung\n• 256 GB interner Speicherplatz\n• Reibungsloser Betrieb mit Hochleistungsprozessor\n• Ultraschnelle Internetverbindung und Updates mit Wi-Fi 6\n• Drahtlose Kommunikation über Bluetooth\n• Robuster und professioneller Tragekoffer\n\n━━━━━━━━━━━━━━━━━━━\nSTARKE VERBINDUNG MIT MAXIFLASH VCI2\n━━━━━━━━━━━━━━━━━━━\n\n• Schnelle und stabile Fahrzeugverbindung\n• Breite Fahrzeugabdeckung\n• Drahtlose Diagnosemöglichkeit\n• Zuverlässige Leistung bei intensivem Werkstatteinsatz\n\n━━━━━━━━━━━━━━━━━━━\nPROFESSIONELLE DIAGNOSEMERKMALE\n━━━━━━━━━━━━━━━━━━━\n\n• Diagnose auf OE-Niveau (Herstellerebene)\n• Systemverbindungsanalyse mit 3D-Topologie-Mapping\n• Fehlercodes lesen und löschen\n• Live-Datenstrom und grafische Analyse\n• ECU-Programmierung (Unterstützung für J2534 Pass-Thru)\n• Systemtests und detaillierte Diagnosevorgänge\n\n━━━━━━━━━━━━━━━━━━━\n36+ SERVICEFUNKTIONEN\n━━━━━━━━━━━━━━━━━━━\n\n• Ölrückstellung (Oil Reset)\n• Bremsensystem-Operationen\n• Lenkwinkelkalibrierung\n• DPF-Regeneration\n• Injektorcodierung\n• Batterieanlernen\n• TPMS-Operationen\n• Und vieles mehr...\n\n━━━━━━━━━━━━━━━━━━━\nINTELLIGENTE TECHNOLOGIE DER NÄCHSTEN GENERATION\n━━━━━━━━━━━━━━━━━━━\n\n• KI-gestütztes Fehleranalysesystem\n• Intelligente Diagnoseempfehlungen\n• Fortschrittliches Berichtssystem\n• Schnelle Datenverarbeitung und -analyse\n• Benutzerfreundliche Oberfläche\n━━━━━━━━━━━━━━━━━━━\nWAS GEWINNEN SIE MIT DIESEM GERÄT?\n━━━━━━━━━━━━━━━━━━━\n\n• Sie finden Fehler schneller und präziser\n• Sie vermeiden unnötigen Teileaustausch\n• Sie verkürzen die Servicezeiten\n• Sie bieten einen professionelleren Service\n• Sie stärken das Kundenvertrauen\n━━━━━━━━━━━━━━━━━━━\nFÜR WEN IST ES GEEIGNET?\n━━━━━━━━━━━━━━━━━━━\n\n• Professionelle Kfz-Werkstätten\n• Kfz-Elektriker\n• Betriebe, die Diagnosearbeiten durchführen\n• Benutzer, die ein High-End-Gerät suchen\n━━━━━━━━━━━━━━━━━━━\nFAZIT\n━━━━━━━━━━━━━━━━━━━\n\nDas Autel MS909 S2 ist kein gewöhnliches Diagnosegerät, sondern eine leistungsstarke professionelle Lösung, die die Schnelligkeit, Präzision und Qualität Ihrer Arbeit steigert.\n\nWenn Sie schwierige Fehler schnell beheben, durch die richtige Diagnose Zeit sparen und Ihren Kunden Vertrauen schenken wollen, ist dieses Gerät eine der besten Entscheidungen.\n\nFür detaillierte Informationen, Kompatibilität und Preise können Sie uns gerne über WhatsApp kontaktieren.",
    "ru": "Диагностический автосканер Autel MS909 S2 — это диагностическое решение премиум-класса, разработанное для автосервисов, стремящихся к быстрому, точному и профессиональному проведению диагностики современных автомобилей.\n\nБлагодаря оборудованию нового поколения, высокой вычислительной мощности и передовой программной архитектуре он превосходит классические сканеры. MS909 S2 — это настоящий помощник в работе, созданный для профессионалов, ценящих скорость и точность.\n\n━━━━━━━━━━━━━━━━━━━\nМОЩНАЯ АППАРАТНАЯ ЧАСТЬ\n━━━━━━━━━━━━━━━━━━━\n\n• 9,7-дюймовый широкий сенсорный экран высокого разрешения\n• ОС Android 13 для современной и быстрой работы\n• 256 ГБ встроенной памяти\n• Высокопроизводительный процессор для плавной работы\n• Ультрабыстрое интернет-соединение и обновления с Wi-Fi 6\n• Беспроводная связь по Bluetooth\n• Прочный и профессиональный кейс для переноски\n━━━━━━━━━━━━━━━━━━━\nНАДЕЖНОЕ ПОДКЛЮЧЕНИЕ С MAXIFLASH VCI2\n━━━━━━━━━━━━━━━━━━━\n\n• Быстрое и стабильное подключение к автомобилю\n• Широкий охват автомобильных марок\n• Возможность беспроводной диагностики\n• Надежная работа в условиях высокой загрузки автосервиса\n━━━━━━━━━━━━━━━━━━━\nПРОФЕССИОНАЛЬНЫЕ ДИАГНОСТИЧЕСКИЕ ВОЗМОЖНОСТИ\n━━━━━━━━━━━━━━━━━━━\n\n• Диагностика дилерского уровня (OE-level)\n• 3D-топологическая карта связей систем\n• Чтение и стирание кодов неисправностей\n• Поток данных в реальном времени (Live Data) и графический анализ\n• Программирование ЭБУ (поддержка J2534 Pass-Thru)\n• Тесты исполнительных механизмов и углубленная диагностика\n━━━━━━━━━━━━━━━━━━━\n36+ СЕРВИСНЫХ ФУНКЦИЙ\n━━━━━━━━━━━━━━━━━━━\n\n• Сброс масла (Oil Reset)\n• Обслуживание тормозной системы\n• Калибровка датчика угла поворота руля (SAS)\n• Регенерация DPF\n• Кодирование форсунок\n• Регистрация аккумулятора\n• Работа с системой TPMS\n• И многое другое...\n━━━━━━━━━━━━━━━━━━━\nУМНЫЕ ТЕХНОЛОГИИ НОВОГО ПОКОЛЕНИЯ\n━━━━━━━━━━━━━━━━━━━\n\n• Система анализа неисправностей на базе искусственного интеллекта\n• Интеллектуальные подсказки по диагностике\n• Продвинутая система отчетов\n• Быстрая обработка и анализ данных\n• Удобный интерфейс\n━━━━━━━━━━━━━━━━━━━\nЧТО ВЫ ПОЛУЧАЕТЕ С ЭТИМ ПРИБОРОМ?\n━━━━━━━━━━━━━━━━━━━\n\n• Находите неисправности быстрее и точнее\n• Избегаете лишней замены деталей\n• Сокращаете время обслуживания автомобилей\n• Предоставляете более профессиональный сервис\n• Повышаете доверие клиентов\n━━━━━━━━━━━━━━━━━━━\nДЛЯ КОГО ПРЕДНАЗНАЧЕН?\n━━━━━━━━━━━━━━━━━━━\n\n• Профессиональные автосервисы\n• Мастера-автоэлектрики\n• Диагностические центры\n• Технические специалисты, ищущие прибор топ-уровня\n━━━━━━━━━━━━━━━━━━━\nИТОГ\n━━━━━━━━━━━━━━━━━━━\n\nAutel MS909 S2 — это не просто прибор для сброса ошибок, а мощное профессиональное решение, повышающее скорость, точность и качество услуг вашего автосервиса.\n\nЕсли вы хотите быстро решать сложные проблемы, экономить время за счет точной диагностики и завоевать доверие клиентов, этот прибор станет лучшим выбором.\n\nСвяжитесь с нами в WhatsApp для получения подробной информации о совместимости и ценах.",
    "ka": "Autel MS909 S2 სადიაგნოსტიკო აპარატი არის უმაღლესი სეგმენტის სადიაგნოსტიკო გადაწყვეტილება, რომელიც შემუშავებულია სერვისებისთვის, რომლებსაც სურთ თანამედროვე ავტომობილების სწრაფი, ზუსტი და პროფესიონალური დიაგნოსტიკა.\n\nახალი თაობის აპარატურის, ძლიერი დამუშავების შესაძლებლობისა და მოწინავე პროგრამული ინფრასტრუქტურის წყალობით, იგი სცდება კლასიკურ სადიაგნოსტიკო მოწყობილობებს. MS909 S2 არის ნამდვილი ასისტენტი სერვისისთვის, რომელიც შექმნილია პროფესიონალებისთვის, ვისაც სურს როგორც სიჩქარე, ასევე სიზუსტე.\n\n━━━━━━━━━━━━━━━━━━━\nძლიერი აპარატურული ინფრასტრუქტურა\n━━━━━━━━━━━━━━━━━━━\n\n• 9.7” ფართო და მაღალი გარჩევადობის სენსორული ეკრანი\n• Android 13 ოპერაციული სისტემა თანამედროვე და სწრაფი გამოყენებისთვის\n• 256 GB შიდა მეხსიერება\n• მაღალი წარმადობის პროცესორი შეუფერხებელი მუშაობისთვის\n• Wi-Fi 6 ულტრა სწრაფი ინტერნეტ კავშირისა და განახლებისთვის\n• Bluetooth უსადენო კავშირისთვის\n• გამძლე და პროფესიონალური სატარებელი ჩანთა\n━━━━━━━━━━━━━━━━━━━\nძლიერი კავშირი MAXIFLASH VCI2-თან\n━━━━━━━━━━━━━━━━━━━\n\n• სწრაფი და სტაბილური კავშირი ავტომობილთან\n• ავტომობილების ფართო თავსებადობა\n• უსადენო დიაგნოსტიკის შესაძლებლობა\n• საიმედო მუშაობა ინტენსიური სერვისისთვის\n━━━━━━━━━━━━━━━━━━━\nპროფესიონალური დიაგნოსტიკის მახასიათებლები\n━━━━━━━━━━━━━━━━━━━\n\n• OE (სადილერო) დონის დიაგნოსტიკა\n• 3D ტოპოლოგიის რუკა სისტემებს შორის კავშირის ანალიზისთვის\n• შეცდომის კოდის წაკითხვა და წაშლა\n• ცოცხალი მონაცემების ნაკადი (Live Data) და გრაფიკული ანალიზი\n• ECU პროგრამირება (J2534 Pass-Thru მხარდაჭერა)\n• სისტემური ტესტები და დეტალური დიაგნოსტიკური ოპერაციები\n━━━━━━━━━━━━━━━━━━━\n36+ სერვისის ფუნქცია\n━━━━━━━━━━━━━━━━━━━\n\n• ზეთის შეცვლის განულება\n• სამუხრუჭე სისტემის ოპერაციები\n• საჭის კუთხის კალიბრაცია\n• DPF რეგენერაცია\n• ინჟექტორის კოდირება\n• აკუმულატორის ადაპტაცია\n• TPMS ოპერაციები\n• და ბევრი სხვა...\n━━━━━━━━━━━━━━━━━━━\nჭკვიანი და ახალი თაობის ტექნოლოგია\n━━━━━━━━━━━━━━━━━━━\n\n• ხელოვნური ინტელექტის მხარდაჭერით მუშაობის ანალიზი\n• დიაგნოსტიკის ჭკვიანი რეკომენდაციები\n• მოწინავე ანგარიშგების სისტემა\n• მონაცემთა სწრაფი დამუშავება და ანალიზი\n• მოსახერხებელი ინტერფეისი\n━━━━━━━━━━━━━━━━━━━\nრას იღებთ ამ მოწყობილობით?\n━━━━━━━━━━━━━━━━━━━\n\n• პოულობთ ხარვეზს უფრო სწრაფად და ზუსტად\n• თავიდან აიცილებთ ნაწილების ზედმეტ შეცვლას\n• ამცირებთ სერვისის დროს\n• სთავაზობთ უფრო პროფესიონალურ მომსახურებას\n• ზრდით მომხმარებლის ნდობას\n━━━━━━━━━━━━━━━━━━━\nვისთვის არის განკუთვნილი?\n━━━━━━━━━━━━━━━━━━━\n\n• პროფესიონალური ავტოსერვისები\n• ავტოელექტრიკოსები\n• დიაგნოსტიკური ცენტრები\n• მომხმარებლები, რომლებსაც სურთ მაღალი დონის აპარატი\n━━━━━━━━━━━━━━━━━━━\nდასკვნა\n━━━━━━━━━━━━━━━━━━━\n\nAutel MS909 S2 არ არის ჩვეულებრივი სადიაგნოსტიკო აპარატი; ეს არის ძლიერი პროფესიონალური გადაწყვეტილება, რომელიც ზრდის თქვენი სერვისის სიჩქარეს, სიზუსტესა და ხარისხს.\n\nთუ გსურთ რთული პრობლემების სწრაფად მოგვარება, დროის დაზოგვა სწორი დიაგნოსტიკით და მომხმარებლებისთვის ნდობის მიცემა, ეს მოწყობილობა საუკეთესო არჩევანია.\n\nდეტალური ინფორმაციისთვის, თავსებადობისა და ფასებისთვის დაგვიკავშირდით WhatsApp-ის საშუალებით."
},
  "autel ms908 s3 arıza tespit cihazı, modern araçlarda hızlı, doğru ve profesyonel teşhis yapmak isteyen servisler için geliştirilmiş güçlü ve çok yönlü bir diagnostik platformdur. geniş ekranı, yüksek performanslı donanımı ve gelişmiş yazılım altyapısı sayesinde hem günlük servis işlemlerinde hem de ileri seviye arıza analizlerinde maksimum verim sağlar. ms908 s3, arızayı hızlı bulmak, doğru müdahale etmek ve servis kalitesini artırmak isteyen profesyoneller için ideal bir çözümdür. ━━━━━━━━━━━━━━━━━━━ güçlü donanim altyapisi ━━━━━━━━━━━━━━━━━━━ • 10.1” geniş ve yüksek çözünürlüklü dokunmatik ekran • 4 gb ram ile akıcı ve stabil kullanım • 128 gb dahili depolama alanı • yüksek performanslı işlemci ile hızlı tarama ve analiz • android tabanlı kullanıcı dostu işletim sistemi • wi-fi ve bluetooth ile kablosuz bağlantı • dayanıklı ve profesyonel taşıma çantası ━━━━━━━━━━━━━━━━━━━ profesyonel teşhi̇s ve kodlama ━━━━━━━━━━━━━━━━━━━ • oe (yetkili servis) seviyesinde arıza tespiti • hata kodu okuma ve silme • canlı veri akışı (live data) ve grafiksel analiz • aktif test (active test) işlemleri • ecu kodlama (coding) • ecu programlama (j2534 pass-thru desteği) • adaptasyon ve kalibrasyon işlemleri • sistem testleri ve detaylı analiz ━━━━━━━━━━━━━━━━━━━ yeni̇ nesiye araç desteği̇ ━━━━━━━━━━━━━━━━━━━ • can fd desteği • doip (diagnostics over internet protocol) desteği • yeni nesil araçlarla hızlı ve stabil bağlantı • geniş marka ve model kapsama alanı ━━━━━━━━━━━━━━━━━━━ akilli ve geli̇şmi̇ş özelli̇kler ━━━━━━━━━━━━━━━━━━━ • akıllı teşhis sistemi ile hızlı yönlendirme • gelişmiş veri analizi ve raporlama • kullanıcı dostu arayüz ile kolay kullanım • yoğun servis kullanımı için optimize edilmiş performans ━━━━━━━━━━━━━━━━━━━ bu ci̇hazla ne kazanirsin ? ━━━━━━━━━━━━━━━━━━━ • arızayı hızlı ve doğru şekilde tespit edersin • gereksiz parça değişimini önlersin • servis süresini kısaltırsın • daha profesyonel hizmet sunarsın • müşteri memnuniyetini artırırsın ━━━━━━━━━━━━━━━━━━━ ki̇mler i̇çi̇n ? ━━━━━━━━━━━━━━━━━━━ • profesyonel oto servisler • oto elektrik ustaları • diagnostik işlemler yapan işletmeler • i̇leri seviye arıza tespit cihazı arayan kullanıcılar ━━━━━━━━━━━━━━━━━━━ sonuç ━━━━━━━━━━━━━━━━━━━ autel ms908 s3, hem modern araçlara uyumlu altyapısı hem de güçlü teşhis ve kodlama özellikleriyle servisinizin vazgeçilmez cihazlarından biri olacaktır. hızlı, doğru ve güvenilir teşhis yapmak, arızaları tahmin ederek değil net verilerle çözmek isteyenler için ms908 s3 güçlü ve doğru bir tercihtir. detaylı bilgi, uyumluluk ve fiyat bilgisi için whatsapp üzerinden bizimle iletişime geçebilirsiniz.": {
    "tr": "Autel MS908 S3 Arıza Tespit Cihazı, modern araçlarda hızlı, doğru ve profesyonel teşhis yapmak isteyen servisler için geliştirilmiş güçlü ve çok yönlü bir diagnostik platformdur.\n\nGeniş ekranı, yüksek performanslı donanımı ve gelişmiş yazılım altyapısı sayesinde hem günlük servis işlemlerinde hem de ileri seviye arıza analizlerinde maksimum verim sağlar. MS908 S3, arızayı hızlı bulmak, doğru müdahale etmek ve servis kalitesini artırmak isteyen profesyoneller için ideal bir çözümdür.\n\n━━━━━━━━━━━━━━━━━━━\nGÜÇLÜ DONANIM ALTYAPISI\n━━━━━━━━━━━━━━━━━━━\n\n• 10.1” geniş ve yüksek çözünürlüklü dokunmatik ekran\n• 4 GB RAM ile akıcı ve stabil kullanım\n• 128 GB dahili depolama alanı\n• Yüksek performanslı işlemci ile hızlı tarama ve analiz\n• Android tabanlı kullanıcı dostu işletim sistemi\n• Wi-Fi ve Bluetooth ile kablosuz bağlantı\n• Dayanıklı ve profesyonel taşıma çantası\n\n━━━━━━━━━━━━━━━━━━━\nPROFESYONEL TEŞHİS VE KODLAMA\n━━━━━━━━━━━━━━━━━━━\n\n• OE (yetkili servis) seviyesinde arıza tespiti\n• Hata kodu okuma ve silme\n• Canlı veri akışı (Live Data) ve grafiksel analiz\n• Aktif test (Active Test) işlemleri\n• ECU kodlama (Coding)\n• ECU programlama (J2534 Pass-Thru desteği)\n• Adaptasyon ve kalibrasyon işlemleri\n• Sistem testleri ve detaylı analiz\n\n━━━━━━━━━━━━━━━━━━━\nYENİ NESİL ARAÇ DESTEĞİ\n━━━━━━━━━━━━━━━━━━━\n\n• CAN FD desteği\n• DoIP (Diagnostics over Internet Protocol) desteği\n• Yeni nesil araçlarla hızlı ve stabil bağlantı\n• Geniş marka ve model kapsama alanı\n\n━━━━━━━━━━━━━━━━━━━\nAKILLI VE GELİŞMİŞ ÖZELLİKLER\n━━━━━━━━━━━━━━━━━━━\n\n• Akıllı teşhis sistemi ile hızlı yönlendirme\n• Gelişmiş veri analizi ve raporlama\n• Kullanıcı dostu arayüz ile kolay kullanım\n• Yoğun servis kullanımı için optimize edilmiş performans\n\n━━━━━━━━━━━━━━━━━━━\nBU CİHAZLA NE KAZANIRSIN ?\n━━━━━━━━━━━━━━━━━━━\n\n• Arızayı hızlı ve doğru şekilde tespit edersin\n• Gereksiz parça değişimini önlersin\n• Servis süresini kısaltırsın\n• Daha profesyonel hizmet sunarsın\n• Müşteri memnuniyetini artırırsın\n\n━━━━━━━━━━━━━━━━━━━\nKİMLER İÇİN ?\n━━━━━━━━━━━━━━━━━━━\n\n• Profesyonel oto servisler\n• Oto elektrik ustaları\n• Diagnostik işlemler yapan işletmeler\n• İleri seviye arıza tespit cihazı arayan kullanıcılar\n\n━━━━━━━━━━━━━━━━━━━\nSONUÇ\n━━━━━━━━━━━━━━━━━━━\n\nAutel MS908 S3, hem modern araçlara uyumlu altyapısı hem de güçlü teşhis ve kodlama özellikleriyle servisinizin vazgeçilmez cihazlarından biri olacaktır.\n\nHızlı, doğru ve güvenilir teşhis yapmak, arızaları tahmin ederek değil net verilerle çözmek isteyenler için MS908 S3 güçlü ve doğru bir tercihtir.\n\nDetaylı bilgi, uyumluluk ve fiyat bilgisi için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.\n",
    "en": "Autel MS908 S3 Diagnostic Scanner is a powerful and versatile diagnostic platform developed for services that want to make fast, accurate, and professional diagnostics in modern vehicles.",
    "de": "Das Autel MS908 S3 Diagnosegerät ist eine leistungsstarke und vielseitige Diagnoseplattform, die für Werkstätten entwickelt wurde, die eine schnelle, präzise und professionelle Diagnose an modernen Fahrzeugen durchführen möchten.",
    "ru": "Диагностический автосканер Autel MS908 S3 — это мощная и универсальная диагностическая платформа...",
    "ka": "Autel MS908 S3 სადიაგნოსტიკო აპარატი არის ძლიერი და მრავალმხრივი სადიაგნოსტიკო პლატფორმა..."
  },
  "autel ds900": {
    "tr": "AUTeL DS900",
    "en": "Autel DS900 Diagnostic Scanner",
    "de": "Autel DS900 Diagnosegerät",
    "ru": "Диагностический автосканер Autel DS900",
    "ka": "Autel DS900 სადიაგნოსტიკო აპარატი"
  },
  "autel ds900 arıza tespit cihazı, profesyonel servisler, oto elektrikçiler ve ileri seviye diagnostik işlemler yapmak isteyen kullanıcılar için geliştirilmiş güçlü, hızlı ve güvenilir bir arıza tespit çözümüdür. kompakt yapısına rağmen sunduğu gelişmiş özelliklerle ds900, günlük servis işlemlerinden detaylı sistem analizlerine kadar geniş bir kullanım alanı sağlar. araçlardaki arızaları hızlıca tespit etmek, doğru müdahale yapmak ve servis kalitesini yükseltmek isteyenler için ideal bir cihazdır. ━━━━━━━━━━━━━━━━━━━ tekni̇k donanim özelli̇kleri̇ ━━━━━━━━━━━━━━━━━━━ • 8.0” dokunmatik ekran • android 11 işletim sistemi • 1.8 ghz dört çekirdekli işlemci • 4 gb ram • 64 gb dahili depolama • hızlı ve kullanıcı dostu arayüz • dayanıklı taşıma çantası ile güvenli kullanım ━━━━━━━━━━━━━━━━━━━ profesyonel teşhi̇s gücü ━━━━━━━━━━━━━━━━━━━ • tüm sistemlerde arıza tespiti • hata kodu okuma ve silme • canlı veri takibi • aktif test işlemleri • detaylı arıza raporları • ecu kodlama desteği • oe seviyesinde geniş araç kapsama alanı ━━━━━━━━━━━━━━━━━━━ yeni̇ nesi̇l araç desteği̇ ━━━━━━━━━━━━━━━━━━━ • doip desteği • can fd desteği • yeni nesil araç protokolleriyle uyumlu çalışma • modern araçlarda hızlı ve stabil bağlantı ━━━━━━━━━━━━━━━━━━━ bu ci̇hazla ne kazanirsin ? ━━━━━━━━━━━━━━━━━━━ • arızayı daha hızlı bulursun • gereksiz parça değişimini azaltırsın • müşteriye daha net bilgi verirsin • servis süresini kısaltırsın • i̇ş kaliteni ve güvenilirliğini artırırsın ━━━━━━━━━━━━━━━━━━━ ki̇mler i̇çi̇n uygun ? ━━━━━━━━━━━━━━━━━━━ • profesyonel oto servisler • oto elektrik ustaları • diagnostik işi yapan işletmeler • güçlü ama taşınabilir cihaz isteyen kullanıcılar ━━━━━━━━━━━━━━━━━━━ sonuç ━━━━━━━━━━━━━━━━━━━ autel ds900, kompakt boyutuna rağmen profesyonel servis ihtiyaçlarını karşılayabilecek güçlü bir arıza tespit cihazıdır. hızlı bağlantı, geniş araç desteği, ecu kodlama, aktif test ve detaylı raporlama özellikleriyle servisinizde daha doğru, daha hızlı ve daha güvenilir teşhis yapmanıza yardımcı olur. profesyonel sonuç almak, müşteriye güven vermek ve arızaları tahmin ederek değil, net verilerle çözmek isteyenler için autel ds900 doğru tercihlerden biridir. detaylı bilgi, uyumluluk ve fiyat bilgisi için whatsapp üzerinden bizimle iletişime geçebilirsiniz.": {
    "tr": "AUTEL DS900 Arıza Tespit Cihazı, profesyonel servisler, oto elektrikçiler ve ileri seviye diagnostik işlemler yapmak isteyen kullanıcılar için geliştirilmiş güçlü, hızlı ve güvenilir bir arıza tespit çözümüdür.\n\nKompakt yapısına rağmen sunduğu gelişmiş özelliklerle DS900, günlük servis işlemlerinden detaylı sistem analizlerine kadar geniş bir kullanım alanı sağlar. Araçlardaki arızaları hızlıca tespit etmek, doğru müdahale yapmak ve servis kalitesini yükseltmek isteyenler için ideal bir cihazdır.\n\n━━━━━━━━━━━━━━━━━━━\nTEKNİK DONANIM ÖZELLİKLERİ\n━━━━━━━━━━━━━━━━━━━\n\n• 8.0” dokunmatik ekran\n• Android 11 işletim sistemi\n• 1.8 GHz dört çekirdekli işlemci\n• 4 GB RAM\n• 64 GB dahili depolama\n• Hızlı ve kullanıcı dostu arayüz\n• Dayanıklı taşıma çantası ile güvenli kullanım\n\n━━━━━━━━━━━━━━━━━━━\nPROFESYONEL TEŞHİS GÜCÜ\n━━━━━━━━━━━━━━━━━━━\n\n• Tüm sistemlerde arıza tespiti\n• Hata kodu okuma ve silme\n• Canlı veri takibi\n• Aktif test işlemleri\n• Detaylı arıza raporları\n• ECU kodlama desteği\n• OE seviyesinde geniş araç kapsama alanı\n\n━━━━━━━━━━━━━━━━━━━\nYENİ NESİL ARAÇ DESTEĞİ\n━━━━━━━━━━━━━━━━━━━\n\n• DoIP desteği\n• CAN FD desteği\n• Yeni nesil araç protokolleriyle uyumlu çalışma\n• Modern araçlarda hızlı ve stabil bağlantı\n\n━━━━━━━━━━━━━━━━━━━\nBU CİHAZLA NE KAZANIRSIN ?\n━━━━━━━━━━━━━━━━━━━\n\n• Arızayı daha hızlı bulursun\n• Gereksiz parça değişimini azaltırsın\n• Müşteriye daha net bilgi verirsin\n• Servis süresini kısaltırsın\n• İş kaliteni ve güvenilirliğini artırırsın\n\n━━━━━━━━━━━━━━━━━━━\nKİMLER İÇİN UYGUN ?\n━━━━━━━━━━━━━━━━━━━\n\n• Profesyonel oto servisler\n• Oto elektrik ustaları\n• Diagnostik işi yapan işletmeler\n• Güçlü ama taşınabilir cihaz isteyen kullanıcılar\n\n━━━━━━━━━━━━━━━━━━━\nSONUÇ\n━━━━━━━━━━━━━━━━━━━\n\nAUTEL DS900, kompakt boyutuna rağmen profesyonel servis ihtiyaçlarını karşılayabilecek güçlü bir arıza tespit cihazıdır.\n\nHızlı bağlantı, geniş araç desteği, ECU kodlama, aktif test ve detaylı raporlama özellikleriyle servisinizde daha doğru, daha hızlı ve daha güvenilir teşhis yapmanıza yardımcı olur.\n\nProfesyonel sonuç almak, müşteriye güven vermek ve arızaları tahmin ederek değil, net verilerle çözmek isteyenler için AUTEL DS900 doğru tercihlerden biridir.\n\nDetaylı bilgi, uyumluluk ve fiyat bilgisi için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
    "en": "AUTEL DS900 Diagnostic Scanner is a powerful, fast, and reliable diagnostic solution developed for professional services, auto electricians, and users who want to perform advanced diagnostics.\n\nDespite its compact size, the DS900 offers advanced features, providing a wide range of use from routine maintenance to detailed system analysis. It is an ideal device for those who want to quickly detect faults in vehicles, make correct interventions, and increase service quality.\n\n━━━━━━━━━━━━━━━━━━━\nTECHNICAL HARDWARE SPECIFICATIONS\n━━━━━━━━━━━━━━━━━━━\n\n• 8.0” touchscreen\n• Android 11 operating system\n• 1.8 GHz quad-core processor\n• 4 GB RAM\n• 64 GB internal storage\n• Fast and user-friendly interface\n• Safe use with durable carrying case\n\n━━━━━━━━━━━━━━━━━━━\nPROFESSIONAL DIAGNOSTIC POWER\n━━━━━━━━━━━━━━━━━━━\n\n• Diagnostics in all systems\n• Fault code reading and clearing\n• Live data tracking\n• Active test operations\n• Detailed fault reports\n• ECU coding support\n• OE-level wide vehicle coverage\n\n━━━━━━━━━━━━━━━━━━━\nNEW GENERATION VEHICLE SUPPORT\n━━━━━━━━━━━━━━━━━━━\n\n• DoIP support\n• CAN FD support\n• Compatible operation with new generation vehicle protocols\n• Fast and stable connection in modern vehicles\n\n━━━━━━━━━━━━━━━━━━━\nWHAT DO YOU GAIN WITH THIS DEVICE?\n━━━━━━━━━━━━━━━━━━━\n\n• You find faults faster\n• You reduce unnecessary parts replacement\n• You give clearer information to the customer\n• You shorten service time\n• You increase your work quality and reliability\n\n━━━━━━━━━━━━━━━━━━━\nWHO IS IT SUITABLE FOR?\n━━━━━━━━━━━━━━━━━━━\n\n• Professional auto services\n• Auto electricians\n• Businesses doing diagnostics\n• Users who want a powerful but portable device\n\n━━━━━━━━━━━━━━━━━━━\nCONCLUSION\n━━━━━━━━━━━━━━━━━━━\n\nAUTEL DS900 is a powerful diagnostic scanner that can meet professional service needs despite its compact size.\n\nWith its fast connection, wide vehicle support, ECU coding, active tests, and detailed reporting features, it helps you make more accurate, faster, and more reliable diagnostics in your service.\n\nFor those who want to get professional results, give confidence to customers, and solve faults with net data rather than guessing, AUTEL DS900 is one of the correct choices.\n\nYou can contact us via WhatsApp for detailed information, compatibility, and price details.",
    "de": "Das AUTEL DS900 Diagnosegerät ist eine leistungsstarke, schnelle und zuverlässige Diagnoselösung, die für professionelle Werkstätten, Kfz-Elektriker und Benutzer entwickelt wurde, die fortschrittliche Diagnosearbeiten durchführen möchten.\n\nTrotz seiner kompakten Größe bietet das DS900 erweiterte Funktionen und deckt einen breiten Einsatzbereich von der routinemäßigen Wartung bis hin zur detaillierten Systemanalyse ab. Es ist ein ideales Gerät für alle, die Fehler in Fahrzeugen schnell erkennen, richtig eingreifen und die Servicequalität steigern möchten.\n\n━━━━━━━━━━━━━━━━━━━\nTECHNISCHE HARDWARE-SPEZIFIKATIONEN\n━━━━━━━━━━━━━━━━━━━\n\n• 8,0-Zoll großer Touchscreen\n• Android 11 Betriebssystem\n• 1,8 GHz Quad-Core-Prozessor\n• 4 GB RAM\n• 64 GB interner Speicher\n• Schnelle und benutzerfreundliche Oberfläche\n• Sichere Nutzung durch robusten Tragekoffer\n\n━━━━━━━━━━━━━━━━━━━\nPROFESSIONELLE DIAGNOSEKRAFT\n━━━━━━━━━━━━━━━━━━━\n\n• Diagnose in allen Systemen\n• Fehlercodes lesen und löschen\n• Live-Datenverfolgung\n• Aktive Test-Operationen (Active Test)\n• Detaillierte Fehlerberichte\n• ECU-Codierungsunterstützung\n• Breite Fahrzeugabdeckung auf OE-Niveau\n\n━━━━━━━━━━━━━━━━━━━\nFAHRZEUGUNTERSTÜTZUNG DER NÄCHSTEN GENERATION\n━━━━━━━━━━━━━━━━━━━\n\n• DoIP-Unterstützung\n• CAN-FD-Unterstützung\n• Kompatibler Betrieb mit Fahrzeugprotokollen der neueren Generation\n• Schnelle und stabile Verbindung bei modernen Fahrzeugen\n\n━━━━━━━━━━━━━━━━━━━\nWAS GEWINNEN SIE MIT DIESEM GERÄT?\n━━━━━━━━━━━━━━━━━━━\n\n• Sie finden Fehler schneller\n• Sie verringern den unnötigen Teileaustausch\n• Sie geben dem Kunden klarere Informationen\n• Sie verkürzen die Servicezeiten\n• Sie steigern die Qualität und Zuverlässigkeit Ihrer Arbeit\n━━━━━━━━━━━━━━━━━━━\nFÜR WEN IST ES GEEIGNET?\n━━━━━━━━━━━━━━━━━━━\n\n• Professionelle Kfz-Werkstätten\n• Kfz-Elektriker\n• Betriebe, die Diagnosearbeiten durchführen\n• Benutzer, die ein leistungsstarkes, aber tragbares Gerät suchen\n━━━━━━━━━━━━━━━━━━━\nFAZIT\n━━━━━━━━━━━━━━━━━━━\n\nDas AUTEL DS900 ist ein leistungsstarkes Diagnosegerät, das trotz seiner kompakten Größe professionelle Werkstattanforderungen erfüllen kann.\n\nMit seiner schnellen Verbindung, breiten Fahrzeugunterstützung, ECU-Codierung, aktiven Tests und detaillierten Berichtsfunktionen hilft es Ihnen, präzisere, schnellere und zuverlässigere Diagnosen in Ihrem Betrieb zu stellen.\n\nFür alle, die professionelle Ergebnisse erzielen, Kunden Vertrauen schenken und Fehler mit klaren Daten statt durch Raten lösen wollen, ist das AUTEL DS900 eine der richtigen Entscheidungen.\n\nFür detaillierte Informationen, Kompatibilität und Preise können Sie uns gerne über WhatsApp kontaktieren.",
    "ru": "Диагностический автосканер AUTEL DS900 — это мощное, быстрое и надежное диагностическое решение, разработанное для профессиональных автосервисов, автоэлектриков и специалистов, стремящихся к проведению продвинутых диагностических работ.\n\nНесмотря на свои компактные размеры, DS900 предлагает расширенные функции, обеспечивая широкий спектр применения от повседневного обслуживания до детального анализа систем. Это идеальный прибор для тех, кто хочет быстро выявлять неисправности в автомобилях, правильно устранять их и повышать качество услуг.\n\n━━━━━━━━━━━━━━━━━━━\nТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ ОБОРУДОВАНИЯ\n━━━━━━━━━━━━━━━━━━━\n\n• 8,0-дюймовый сенсорный экран\n• Операционная система Android 11\n• 4-ядерный процессор с частотой 1,8 ГГц\n• 4 ГБ ОЗУ\n• 64 ГБ встроенной памяти\n• Быстрый и интуитивно понятный интерфейс\n• Безопасное использование благодаря прочному кейсу\n━━━━━━━━━━━━━━━━━━━\nПРОФЕССИОНАЛЬНАЯ СИЛА ДИАГНОСТИКИ\n━━━━━━━━━━━━━━━━━━━\n\n• Диагностика всех систем автомобиля\n• Чтение и стирание кодов неисправностей\n• Мониторинг данных в реальном времени\n• Проведение активных тестов\n• Детальные отчеты об ошибках\n• Поддержка кодирования ЭБУ\n• Широкий охват автомобилей дилерского уровня (OE-level)\n━━━━━━━━━━━━━━━━━━━\nПОДДЕРЖКА АВТОМОБИЛЕЙ НОВОГО ПОКОЛЕНИЯ\n━━━━━━━━━━━━━━━━━━━\n\n• Поддержка протокола DoIP\n• Поддержка шины CAN FD\n• Совместимость с протоколами связи автомобилей нового поколения\n• Быстрое и стабильное соединение на современных автомобилях\n━━━━━━━━━━━━━━━━━━━\nЧТО ВЫ ПОЛУЧАЕТЕ С ЭТИМ ПРИБОРОМ?\n━━━━━━━━━━━━━━━━━━━\n\n• Находите неисправности гораздо быстрее\n• Сокращаете количество необоснованных замен запчастей\n• Предоставляете клиенту максимально прозрачную информацию\n• Сокращаете время нахождения автомобиля на сервисе\n• Повышаете качество работы и доверие к вашему сервису\n━━━━━━━━━━━━━━━━━━━\nДЛЯ КОГО ПРЕДНАЗНАЧЕН?\n━━━━━━━━━━━━━━━━━━━\n\n• Профессиональные автосервисы\n• Специалисты-автоэлектрики\n• Компании, занимающиеся автодиагностикой\n• Специалисты, ищущие мощный, но мобильный прибор\n━━━━━━━━━━━━━━━━━━━\nИТОГ\n━━━━━━━━━━━━━━━━━━━\n\nAUTEL DS900 — это мощный автосканер, способный удовлетворить потребности профессионального автосервиса, несмотря на свои компактные габариты.\n\nБлагодаря быстрому соединению, широчайшему покрытию марок автомобилей, поддержке кодирования ЭБУ, активным тестам и подробным отчетам он помогает проводить более точную, быструю и качественную диагностику в вашем техцентре.\n\nДля тех, кто нацелен на профессиональный результат, ценит доверие клиентов и решает проблемы на основе точных данных, а не предположений, AUTEL DS900 станет одним из лучших решений.\n\nСвяжитесь с нами в WhatsApp для получения подробной информации о совместимости и ценах.",
    "ka": "AUTEL DS900 სადიაგნოსტიკო აპარატი არის ძლიერი, სწრაფი და საიმედო სადიაგნოსტიკო გადაწყვეტილება, რომელიც შემუშავებულია პროფესიონალური ავტოსერვისებისთვის, ავტოელექტრიკოსებისთვის და მომხმარებლებისთვის, რომლებსაც სურთ მოწინავე დიაგნოსტიკური ოპერაციების შესრულება.\n\nმისი კომპაქტური ზომის მიუხედავად, DS900 გთავაზობთ მოწინავე ფუნქციებს და უზრუნველყოფს გამოყენების ფართო სპექტრს ყოველდღიური სერვის ოპერაციებიდან სისტემების დეტალურ ანალიზამდე. ეს არის იდეალური მოწყობილობა მათთვის, ვისაც სურს ავტომობილში ხარვეზების სწრაფი აღმოჩენა, სწორი ჩარევა და მომსახুরების ხარისხის გაუმჯობესება.\n\n━━━━━━━━━━━━━━━━━━━\nტექნიკური აპარატურული მახასიათებლები\n━━━━━━━━━━━━━━━━━━━\n\n• 8.0” სენსორული ეკრანი\n• Android 11 ოპერაციული სისტემა\n• 1.8 GHz ოთხბირთვიანი პროცესორი\n• 4 GB RAM\n• 64 GB შიდა მეხსიერება\n• სწრაფი და მოსახერხებელი ინტერფეისი\n• უსაფრთხო გამოყენება გამძლე სატარებელი ჩანთით\n━━━━━━━━━━━━━━━━━━━\nპროფესიონალური დიაგნოსტიკური ძალა\n━━━━━━━━━━━━━━━━━━━\n\n• დიაგნოსტიკა ყველა სისტემაში\n• შეცდომის კოდის წაკითხვა და წაშლა\n• ცოცხალი მონაცემების მონიტორიнგი\n• აქტიური ტესტის ოპერაციები\n• დეტალური ანგარიშები ხარვეზების შესახებ\n• ECU კოდირების მხარდაჭერა\n• OE დონის ავტომობილების ფართო თავსებადობა\n━━━━━━━━━━━━━━━━━━━\nახალი თაობის ავტომობილების მხარდაჭერა\n━━━━━━━━━━━━━━━━━━━\n\n• DoIP მხარდაჭერა\n• CAN FD მხარდაჭერა\n• თავსებადი მუშაობა ახალი თაობის ავტომობილების პროტოკოლებთან\n• სწრაფი და სტაბილური კავშირი თანამედროვე ავტომობილებთან\n━━━━━━━━━━━━━━━━━━━\nრას იღებთ ამ მოწყობილობით?\n━━━━━━━━━━━━━━━━━━━\n\n• პოულობt ხარვეზს უფრო სწრაფად\n• ამცირებთ ნაწილების ზედმეტ შეცვლას\n• აძლევთ მომხმარებელს უფრო ნათელ ინფორმაციას\n• ამცირებთ სერვისის დროს\n• ზრდით თქვენი მუშაობის ხარისხსა და საიმედოობას\n━━━━━━━━━━━━━━━━━━━\nვისთვის არის განკუთვნილი?\n━━━━━━━━━━━━━━━━━━━\n\n• პროფესიონალური ავტოსერვისები\n• ავტოელექტრიკოსები\n• დიაგნოსტიკური ცენტრები\n• მომხმარებლები, ვისაც სურთ ძლიერი, მაგრამ მობილური აპარატი\n━━━━━━━━━━━━━━━━━━━\nდასკვნა\n━━━━━━━━━━━━━━━━━━━\n\nAUTEL DS900 არის ძლიერი სადიაგნოსტიკო აპარატი, რომელსაც მისი კომპაქტური ზომის მიუხედავად შეუძლია პროფესიონალური სერვისის მოთხოვნების დაკмаყოფილება.\n\nმისი სწრაფი კავშირით, ავტომობილების ფართო თავსებადობით, ECU კოდირებით, აქტიური ტესტებითა და დეტალური ანგარიშგების ფუნქციებით, იგი გეხმარებათ უფრო ზუსტი, სწრაფი და საიმედო დიაგნოსტიკის ჩატარებაში თქვენს სერვისში.\n\nმათთვის, ვისაც სურს პროფესიონალური შედეგების მიღება, მომხმარებლებისთვის ნდობის მიცემა და პრობлემების გადაჭრა რეალური მონაცემებით და არა ვარაუდით, AUTEL DS900 არის ერთ-ერთი სწორი არჩევანი.\n\nდეტალური ინფორმაციისთვის, თავსებადობისა და ფასებისთვის დაგვიკავშირდით WhatsApp-ის საშუალებით."
  }
};

const smartWordMap: Record<string, Partial<Record<HbsLanguageCode, string>> & { tr: string }> = {
  // --- OTOMOTİV / DİAGNOSTİK ---
  "arıza tespit cihazı": { tr: "Arıza Tespit Cihazı", en: "Diagnostic Scanner", de: "Diagnosegerät", ru: "Автосканер", ka: "სადიაგნოსტიკო აპარატი" },
  "arıza tespit": { tr: "Arıza Tespit", en: "Diagnostics", de: "Diagnose", ru: "Диагностика", ka: "დიაგნოსტიკა" },
  "ecu kodlama": { tr: "ECU Kodlama", en: "ECU Coding", de: "ECU-Codierung", ru: "Кодирование ЭБУ", ka: "ECU კოდირება" },
  "ecu programlama": { tr: "ECU Programlama", en: "ECU Programming", de: "ECU-Programmierung", ru: "Программирование ЭБУ", ka: "ECU პროგრამირება" },
  "osiloskop": { tr: "Osiloskop", en: "Oscilloscope", de: "Oszilloskop", ru: "Осциллограф", ka: "ოსცილოსკოპი" },
  "multimetre": { tr: "Multimetre", en: "Multimeter", de: "Multimeter", ru: "Мультиметр", ka: "მულტიმეტრი" },
  "akü test cihazı": { tr: "Akü Test Cihazı", en: "Battery Tester", de: "Batterietester", ru: "Тестер аккумуляторов", ka: "აკუმულატორის ტესტერი" },
  "akü test": { tr: "Akü Test", en: "Battery Test", de: "Batterietest", ru: "Тест аккумулятора", ka: "აკუმულატორის ტესტი" },
  "uzatma kablosu": { tr: "Uzatma Kablosu", en: "Extension Cable", de: "Verlängerungskabel", ru: "Удлинительный кабель", ka: "დამაგრძელებელი კაბელი" },
  "arayüz modülü": { tr: "Arayüz Modülü", en: "Interface Module", de: "Schnittstellenmodul", ru: "Интерфейсный модуль", ka: "ინტერფეისის მოდული" },
  "yazılım desteği": { tr: "Yazılım Desteği", en: "Software Support", de: "Software-Unterstützung", ru: "Поддержка ПО", ka: "პროგრამული მხარდაჭერა" },
  "güncelleme": { tr: "Güncelleme", en: "Update", de: "Aktualisierung", ru: "Обновление", ka: "განახლება" },

  // --- HIRDAVAT / EL ALETLERİ (YILDIZ HIRDAVAT) ---
  "darbeli matkap": { tr: "Darbeli Matkap", en: "Hammer Drill", de: "Schlagbohrmaschine", ru: "Ударная дрель", ka: "დარტყმითი ბურღი" },
  "şarjlı matkap": { tr: "Şarjlı Matkap", en: "Cordless Drill", de: "Akkubohrer", ru: "Аккумуляторная дрель", ka: "აკუმულატორული ბურღი" },
  "matkap ucu": { tr: "Matkap Ucu", en: "Drill Bit", de: "Bohrer bit", ru: "Сверло", ka: "ბურღის პირი" },
  "matkap": { tr: "Matkap", en: "Drill", de: "Bohrmaschine", ru: "Drei", ka: "ბურღი" },
  "takım çantası seti": { tr: "Takım Çantası Seti", en: "Toolbox Set", de: "Werkzeugkoffer-Set", ru: "Набор инструментов", ka: "ხელსაწყოების ყუთის ნაკრები" },
  "takım çantası": { tr: "Takım Çantası", en: "Toolbox", de: "Werkzeugkoffer", ru: "Ящик для инструментов", ka: "ხელსაწყოების ყუთი" },
  "kaynak makinesi": { tr: "Kaynak Makinesi", en: "Welding Machine", de: "Schweißgerät", ru: "Сварочный аппарат", ka: "შედუღების აპარატი" },
  "zımpara kağıdı": { tr: "Zımpara Kağıdı", en: "Sandpaper", de: "Schleifpapier", ru: "Наждачная бумага", ka: "ზუმფარის ქაღალდი" },
  "şerit metre": { tr: "Şerit Metre", en: "Tape Measure", de: "Bandmaß", ru: "Рулетка", ka: "საზომი ლენტი" },
  "tornavida seti": { tr: "Tornavida Seti", en: "Screwdriver Set", de: "Schraubendreher-Set", ru: "Набор отверток", ka: "სახრახნისების ნაკრები" },
  "tornavida": { tr: "Tornavida", en: "Screwdriver", de: "Schraubendreher", ru: "Отвертка", ka: "სახრახნისი" },
  "pense takımı": { tr: "Pense Takımı", en: "Pliers Set", de: "Zangensatz", ru: "Набор плоскогубцев", ka: "ბრტყელტუჩას ნაკრები" },
  "pense": { tr: "Pense", en: "Pliers", de: "Zange", ru: "Плоскогубцы", ka: "ბrტყელტუჩა" },
  "çekiç": { tr: "Çekiç", en: "Hammer", de: "Hammer", ru: "Молоток", ka: "ჩაქუჩი" },
  "testere": { tr: "Testere", en: "Saw", de: "Säge", ru: "Пила", ka: "ხერხი" },
  "su borusu": { tr: "Su Borusu", en: "Water Pipe", de: "Wasserrohr", ru: "Водопроводная труба", ka: "წყლის მილი" },
  "bakır boru": { tr: "Bakır Boru", en: "Copper Pipe", de: "Kupferrohr", ru: "Медная труба", ka: "სპილენძის მილი" },
  "plastik boru": { tr: "Plastik Boru", en: "Plastic Pipe", de: "Kunststoffrohr", ru: "Пластиковая труба", ka: "პლასტმასის მილი" },
  "bakır": { tr: "Bakır", en: "Copper", de: "Kupfer", ru: "Медь", ka: "სპილენძი" },
  "çelik": { tr: "Çelik", en: "Steel", de: "Stahl", ru: "Сталь", ka: "ფოლადი" },
  "demir": { tr: "Demir", en: "Iron", de: "Eisen", ru: "Железо", ka: "რკინა" },
  "vida": { tr: "Vida", en: "Screw", de: "Schraube", ru: "Винт", ka: "ხრახნი" },
  "somun": { tr: "Somun", en: "Nut", de: "Mutter", ru: "Гайка", ka: "ქანჩi" },
  "cıvata": { tr: "Cıvata", en: "Bolt", de: "Bolzen", ru: "Болт", ka: "ჭანჭიკი" },
  "eldiven": { tr: "Eldiven", en: "Gloves", de: "Handschuhe", ru: "Перчатки", ka: "ხელთათმანები" },

  // --- LOJİSTİK / TAŞIMACILIK ---
  "evden eve nakliye": { tr: "Evden Eve Nakliye", en: "Home Moving Service", de: "Umzugsservice von Haus zu Haus", ru: "Квартирный переезд", ka: "ბინიდან ბინაზე გადაზიდვა" },
  "nakliye keşfi": { tr: "Nakliye Keşfi", en: "Moving Survey", de: "Umzugsbesichtigung", ru: "Оценка переезда", ka: "გადაზიდვის შეფასება" },
  "nakliye hizmeti": { tr: "Nakliye Hizmeti", en: "Moving Service", de: "Umzugsservice", ru: "Услуги переезда", ka: "გადაზიდვის სერვისი" },
  "nakliye": { tr: "Nakliye", en: "Logistics / Moving", de: "Transport & Umzug", ru: "Транспортировка", ka: "გადაზიდვა" },
  "taşımacılık": { tr: "Taşımacılık", en: "Transportation", de: "Beförderung", ru: "Перевозки", ka: "ტრანსპორტირება" },
  "paketleme hizmeti": { tr: "Paketleme Hizmeti", en: "Packing Service", de: "Verpackungsservice", ru: "Услуги упаковки", ka: "შეფუთვის სერვისი" },
  "depolama": { tr: "Depolama", en: "Storage", de: "Lagerung", ru: "Хранение", ka: "შენახვა" },
  "kargo": { tr: "Kargo", en: "Cargo / Shipping", de: "Fracht / Versand", ru: "Груз / Доставка", ka: "ტვირთი / მიწოდება" },
  "kurye": { tr: "Kurye", en: "Courier", de: "Kurier", ru: "Курьер", ka: "კურიერი" },
  "kamyon": { tr: "Kamyon", en: "Truck", de: "Lkw", ru: "Грузовик", ka: "სატვირთო" },
  "yük": { tr: "Yük", en: "Load / Cargo", de: "Ladung", ru: "Груз", ka: "ტვირთი" },

  // --- HİZMET / REZERVASYON ---
  "yerinde elektrikçi": { tr: "Yerinde Elektrikçi", en: "On-site Electrician", de: "Elektriker vor Ort", ru: "Электрик на дом", ka: "ელექტრიკოსი ადგილზე" },
  "tesisatçı çağır": { tr: "Tesisatçı Çağır", en: "Call Plumber", de: "Klempner rufen", ru: "Вызвать сантехника", ka: "სანტექნიკოსის გამოძახება" },
  "elektrikçi çağır": { tr: "Elektrikçi Çağır", en: "Call Electrician", de: "Elektriker rufen", ru: "Вызвать электрика", ka: "ელექტრიkოსის გამოძახება" },
  "tesisatçı": { tr: "Tesisatçı", en: "Plumber", de: "Klempner", ru: "Сантехник", ka: "სანტექნიკოსი" },
  "elektrikçi": { tr: "Elektrikçi", en: "Electrician", de: "Elektriker", ru: "Электрик", ka: "ელექტრიკოსი" },
  "kombi servisi": { tr: "Kombi Servisi", en: "Boiler Service", de: "Kesselservice", ru: "Обслуживание котлов", ka: "ქვაბის სერვისი" },
  "klima montajı": { tr: "Klima Montajı", en: "AC Installation", de: "Klimaanlagenmontage", ru: "Установка кондиционера", ka: "კონდიციონერის მონტაჟი" },
  "özel ders": { tr: "Özel Ders", en: "Private Lesson", de: "Privatunterricht", ru: "Частный урок", ka: "კერძო გაკვეთილი" },
  "lokanta masa rezervasyonu": { tr: "Lokanta Masa Rezervasyonu", en: "Restaurant Table Booking", de: "Restaurant-Tischreservierung", ru: "Бронирование столика", ka: "რესტორნის მაგიდის დაჯავშნა" },
  "diyetisyen görüşmesi": { tr: "Diyetisyen Görüşmesi", en: "Dietitian Session", de: "Ernährungsberater-Sitzung", ru: "Консультация диетолога", ka: "დიეტოლოგის კონსულტაცია" },
  "avukat görüşmesi": { tr: "Avukat Görüşmesi", en: "Lawyer Session", de: "Anwaltssitzung", ru: "Консультация юриста", ka: "იურისტის კონსულტაცია" },
  "yaşam koçu": { tr: "Yaşam Koçu", en: "Life Coach", de: "Life Coach", ru: "Лайф-коуч", ka: "ლაიფ ქოუჩი" },
  "randevu al": { tr: "Randevu Al", en: "Book Appointment", de: "Termin buchen", ru: "Записаться", ka: "ჩაწერა" },
  "saç kesimi": { tr: "Saç Kesimi", en: "Haircut", de: "Haarschnitt", ru: "Стрижка волос", ka: "თმის შეჭრა" },
  "sakal tıraşı": { tr: "Sakal Tıraşı", en: "Beard Shave", de: "Rasur", ru: "Бритье бороды", ka: "წვერის გაპარსვა" },
  "fön çekimi": { tr: "Fön Çekimi", en: "Blow Dry", de: "Föhnen", ru: "Укладка феном", ka: "ფენით დაყენება" },

  // --- E-TİCARET / GENEL ---
  "profesyonel çözüm": { tr: "Profesyonel Çözüm", en: "Professional Solution", de: "Professionelle Lösung", ru: "Профессиональное решение", ka: "პროფესიონალური გადაწყვეტა" },
  "yüksek kaliteli": { tr: "Yüksek Kaliteli", en: "High Quality", de: "Hochwertig", ru: "Высококачественный", ka: "მაღალი ხარისხის" },
  "yüksek kalite": { tr: "Yüksek Kalite", en: "High Quality", de: "Hohe Qualität", ru: "Высокое качество", ka: "მაღალი ხარისხი" },
  "dayanıklı malzeme": { tr: "Dayanıklı Malzeme", en: "Durable Material", de: "Langlebiges Material", ru: "Прочный материал", ka: "გამძლე მასალა" },
  "dayanıklı": { tr: "Dayanıklı", en: "Durable", de: "Langlebig", ru: "Прочный", ka: "გამძლე" },
  "uzun ömürlü": { tr: "Uzun Ömürlü", en: "Long-lasting", de: "Langlebig", ru: "Долговечный", ka: "ხანგრძლივი მოხმარების" },
  "orijinal ürün": { tr: "Orijinal Ürün", en: "Genuine Product", de: "Originalprodukt", ru: "Оригинальный товар", ka: "ორიგინალი პროდუქტი" },
  "orijinal": { tr: "Orijinal", en: "Original", de: "Original", ru: "Оригинал", ka: "ორიგინალი" },
  "garantili": { tr: "Garantili", en: "Guaranteed", de: "Garantiert", ru: "С гарантией", ka: "გარანტიით" },
  "garanti": { tr: "Garanti", en: "Warranty", de: "Garantie", ru: "Гарантия", ka: "გარანტია" },
  "hızlı kargo": { tr: "Hızlı Kargo", en: "Fast Shipping", de: "Schneller Versand", ru: "Быстрая доставка", ka: "სწრაfi მიწოდება" },
  "hızlı": { tr: "Hızlı", en: "Fast", de: "Schnell", ru: "Быстрый", ka: "სწრაფი" },
  "stokta var": { tr: "Stokta Var", en: "In Stock", de: "Auf Lager", ru: "В наличии", ka: "მარაგშია" },
  "sınırlı stok": { tr: "Sınırlı Stok", en: "Limited Stock", de: "Begrenzter Bestand", ru: "Ограниченный запас", ka: "შეზღუდული მარაგი" },
  "teklif gerekli": { tr: "Teklif Gerekli", en: "Quote Required", de: "Angebot erforderlich", ru: "Цена по запросу", ka: "ფასი მოთხოვნით" },
  "teklif isteyin": { tr: "Teklif İsteyin", en: "Request a Quote", de: "Angebot anfordern", ru: "Запросить цену", ka: "მოითხოვეთ შეთავაზება" },
  "ücretsiz teslimat": { tr: "Ücretsiz Teslimat", en: "Free Delivery", de: "Kostenlose Lieferung", ru: "Бесплатная доставка", ka: "უფასო მიწოდება" },
  "yerli üretim": { tr: "Yerli Üretim", en: "Domestic Production", de: "Inländische Produktion", ru: "Отечественное производство", ka: "ადგილობრივი წარმოება" },
  "kiralık": { tr: "Kiralık", en: "For Rent", de: "Zu vermieten", ru: "В аренду", ka: "ქირავდება" },
  "satılık": { tr: "Satılık", en: "For Sale", de: "Zu verkaufen", ru: "На продажу", ka: "იყიდება" },
  "ilanı": { tr: "İlanı", en: "Listing", de: "Anzeige", ru: "Объявление", ka: "განცხადება" },
  "ekspertiz": { tr: "Ekspertiz", en: "Inspection", de: "Gutachten", ru: "Экспертиза", ka: "ექსპერტიზა" },
  "açık artırma": { tr: "Açık Artırma", en: "Auction", de: "Auktion", ru: "Аукцион", ka: "აუქციონი" },
  "merkez depo": { tr: "Merkez Depo", en: "Central Warehouse", de: "Zentrallager", ru: "Центральный склад", ka: "ცენტრალური საწყობი" },
  "yedek parça": { tr: "Yedek Parça", en: "Spare Parts", de: "Ersatzteile", ru: "Запчасти", ka: "სათადარიგო ნაწილები" },
  "lokanta": { tr: "Lokanta", en: "Restaurant", de: "Restaurant", ru: "Ресторан", ka: "რესტორანი" },
  "masa": { tr: "Masa", en: "Table", de: "Tisch", ru: "Стол", ka: "მაგიდა" },
  "b2b": { tr: "B2B", en: "B2B", de: "B2B", ru: "B2B", ka: "B2B" },
  "akıllı": { tr: "Akıllı", en: "Smart", de: "Intelligent", ru: "Умный", ka: "ჭკვიანი" },
  "destek": { tr: "Destek", en: "Support", de: "Unterstützung", ru: "Unterstützung", ka: "მხარდაჭერა" },
  "servis": { tr: "Servis", en: "Service", de: "Service", ru: "Сервис", ka: "სერვისი" },
  "tüm": { tr: "Tüm", en: "All", de: "Alle", ru: "Все", ka: "ყველა" },
  "markalar": { tr: "Markalar", en: "Brands", de: "Marken", ru: "Бренды", ka: "ბრენდები" },
  "uyumluluk": { tr: "Uyumluluk", en: "Compatibility", de: "Kompatibilität", ru: "Совместимость", ka: "თავსებადობა" },
  "bilgisi": { tr: "Bilgisi", en: "Info", de: "Info", ru: "Информация", ka: "ინფორმაცია" },
  "teklif": { tr: "Teklif", en: "Offer / Quote", de: "Angebot", ru: "Предложение", ka: "შეთავაზება" },
  "isteyin": { tr: "İsteyin", en: "Required", de: "Anfordern", ru: "Запросить", ka: "მოითხოვეთ" },

  // --- BAĞLAÇLAR / CÜMLE KALIPLARI ---
  "için ideal çözümdür": { tr: "İçin ideal çözümdür", en: "is the ideal solution for", de: "ist die ideale Lösung für", ru: "является идеальным решением для", ka: "არის იდეალური გადაწყვეტა -თვის" },
  "için ideal çözüm": { tr: "İçin ideal çözüm", en: "ideal solution for", de: "ideale Lösung für", ru: "идеальное решение для", ka: "იდეალური გადაწყვეტა -თვის" },
  "için idealdir": { tr: "İçin idealdir", en: "is ideal for", de: "ist ideal für", ru: "идеально подходит для", ka: "იდეალურია -თვის" },
  "için geliştirilmiş": { tr: "İçin geliştirilmiş", en: "developed for", de: "entwickelt für", ru: "разработан для", ka: "-თვის შემუშავებული" },
  "ile uyumludur": { tr: "İle uyumludur", en: "is compatible with", de: "ist kompatibel mit", ru: "совместим с", ka: "თავსებადია -თან" },
  "desteği sunar": { tr: "Desteği sunar", en: "offers support", de: "bietet Unterstützung", ru: "предлагает поддержку", ka: "გვთავაზობს მხარდაჭერას" },
  "kullanım alanı": { tr: "Kullanım alanı", en: "area of use", de: "Einsatzbereich", ru: "область применения", ka: "გამოყენების სფერო" },
  "özelliğine sahiptir": { tr: "Özelliğine sahiptir", en: "features", de: "verfügt über die Eigenschaft", ru: "обладает характеристикой", ka: "აქვს მახასიათებელი" },
  "sahiptir": { tr: "Sahiptir", en: "has", de: "hat", ru: "имеет", ka: "აქვს" },
  "ve": { tr: "ve", en: "and", de: "und", ru: "и", ka: "და" },
  "veya": { tr: "veya", en: "or", de: "oder", ru: "или", ka: "ან" },
  "ile": { tr: "ile", en: "with", de: "mit", ru: "с", ka: "-თან / მიერ" }
};

// -------------------------------------------------------------
// EVRENSEL ÇEVİRİ ADAPTÖRÜ (UNIVERSAL TRANSLATION ADAPTER)
// -------------------------------------------------------------
// Her türlü metni (başlık, açıklama, kategori) alan türüne göre
// beş dilde hatasız tercüme eden ana fonksiyon.
// -------------------------------------------------------------

let normalizedDictionaryCache: Record<string, any> | null = null;

function getNormalizedDictionary(): Record<string, any> {
  if (normalizedDictionaryCache) return normalizedDictionaryCache;

  const cache: Record<string, any> = {};
  for (const [key, value] of Object.entries(globalTranslationDictionary)) {
    const normalizedKey = key
      .trim()
      .toLowerCase()
      .normalize("NFC")
      .replace(/\u0307/g, "")
      .replace(/aktöatör/g, "aktüatör")
      .replace(/\s+/g, ' ');
    cache[normalizedKey] = value;
  }
  normalizedDictionaryCache = cache;
  return cache;
}

export function translateProductField(
  text: string | LocalizedText | undefined | null,
  fieldType: 'name' | 'category' | 'description',
  language: HbsLanguageCode
): string {
  if (!text) return "";

  const isWarning = (val: string) => {
    const l = val.toLowerCase();
    return l.includes("exceeded") || l.includes("limit") || l.includes("mymemory") || l.includes("warning");
  };

  // 1. Eğer veri nesneyse veya JSON formatında bir string ise çözüp dile göre metni çıkaralım
  let parsedTextObj: any = null;
  if (typeof text === "string") {
    let trimmed = text.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    if (trimmed.includes('\\"')) {
      try {
        const parsedOnce = JSON.parse('"' + trimmed.replace(/"/g, '\\"') + '"');
        if (parsedOnce.startsWith("{") && parsedOnce.endsWith("}")) {
          trimmed = parsedOnce;
        }
      } catch (e) {}
    }

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        parsedTextObj = JSON.parse(trimmed);
      } catch (e) {
        try {
          let val = "";
          const regex = new RegExp(`"${language}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i");
          const match = trimmed.match(regex);
          if (match && match[1] !== undefined && !isWarning(match[1])) {
            val = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
          } else {
            for (const fallback of ["tr", "en"]) {
              const fallbackRegex = new RegExp(`"${fallback}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i");
              const fallbackMatch = trimmed.match(fallbackRegex);
              if (fallbackMatch && fallbackMatch[1] !== undefined && !isWarning(fallbackMatch[1])) {
                val = fallbackMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
                break;
              }
            }
          }
          if (val) return val;
        } catch (err) {}
      }
    }
  } else if (typeof text === "object" && text !== null) {
    parsedTextObj = text;
  }

  if (parsedTextObj) {
    let val = parsedTextObj[language];
    if (val === undefined || val === null || isWarning(String(val))) {
      val = parsedTextObj["tr"];
    }
    if (val === undefined || val === null || isWarning(String(val))) {
      val = parsedTextObj["en"];
    }
    if (val !== undefined && val !== null) return String(val);
  }

  let rawText = typeof text === "string" ? text : "";
  const trimmed = rawText.trim();
  if (!trimmed) return "";

  // 2. Tam metin sözlük kontrolü (Case-insensitive matching)
  const lookupKey = trimmed
    .toLowerCase()
    .normalize("NFC")
    .replace(/\u0307/g, "")
    .replace(/aktöatör/g, "aktüatör")
    .replace(/\s+/g, ' ');

  const normalizedDict = getNormalizedDictionary();
  if (normalizedDict[lookupKey] && normalizedDict[lookupKey][language]) {
    return normalizedDict[lookupKey][language];
  }

  // 3. Türkçe dışında bir dil seçildiyse ve tam metin bulunamadıysa, akıllı parçalı çeviriciyi tetikle
  if (language === "tr") return trimmed;

  // Paragraf veya yeni satırlara göre koruyarak bölelim (böylece listeler ve markdown bozulmaz)
  const lines = trimmed.split("\n");
  const translatedLines = lines.map(line => {
    if (!line.trim()) return line;

    // Liste sembollerini (• , - , * vb.) koruyalım
    let prefix = "";
    let content = line;
    
    const listMatch = line.match(/^(\s*[•\-\*\d+\.\)]+\s*)(.*)$/);
    if (listMatch) {
      prefix = listMatch[1];
      content = listMatch[2];
    }

    if (!content.trim()) return line;

    // Cümleleri bölelim (nokta, ünlem, soru işareti sonrasındaki boşluklara göre, delimiters koruyarak)
    const sentences = content.split(/([.!?]\s+)/);
    
    const translatedSentences = sentences.map((part, idx) => {
      // split delimiter grubuysa doğrudan döndür
      if (idx % 2 === 1) return part;
      if (!part.trim()) return part;

      let sentenceText = part;

      // CÜMLE İÇİ GREEDY PHRASE MATCHING
      // smartWordMap içindeki anahtarları kelime/karakter uzunluğuna göre azalan sırada sıralıyoruz.
      const sortedKeys = Object.keys(smartWordMap).sort((a, b) => b.length - a.length);
      
      for (const key of sortedKeys) {
        const translatedWord = smartWordMap[key][language];
        if (!translatedWord) continue;

        // Kelime sınırları Türkçe karakterler (ı, ş, ğ, ç, ö, ü) ile \b ile çalışmadığı için özel sınırlar ekliyoruz
        const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const rx = new RegExp(`(^|\\s|[.,!?;:])(${escapedKey})($|\\s|[.,!?;:])`, 'gi');
        
        sentenceText = sentenceText.replace(rx, (match, p1, p2, p3) => {
          let finalWord = translatedWord;
          if (p2 === p2.toUpperCase()) {
            finalWord = translatedWord.toUpperCase();
          } else if (p2[0] === p2[0].toUpperCase()) {
            finalWord = translatedWord[0].toUpperCase() + translatedWord.slice(1);
          }
          return p1 + finalWord + p3;
        });
      }

      return sentenceText;
    });

    return prefix + translatedSentences.join("");
  });

  return translatedLines.join("\n");
}

export const dynamicUi = {
  address: {
    tr: "Adres",
    en: "Address",
    de: "Adresse",
    ru: "Адрес",
    ka: "მისამართი",
  },
  phone: {
    tr: "Telefon",
    en: "Phone",
    de: "Telefon",
    ru: "Telefon",
    ka: "ტელეფონი",
  },
  email: {
    tr: "E-posta",
    en: "Email",
    de: "E-Mail",
    ru: "Эл. почта",
    ka: "ელფოსტა",
  },
  salesMethodLabel: {
    tr: "Satış şekli",
    en: "Sales method",
    de: "Verkaufsart",
    ru: "Способ продажи",
    ka: "გაყიდვის წესი",
  },
  note: {
    tr: "Not",
    en: "Note",
    de: "Hinweis",
    ru: "Примечание",
    ka: "შენიşვნა",
  },
} satisfies Record<string, LocalizedText>;

export function parseLocalizedField(val: any): LocalizedText {
  if (!val) return { tr: "" };
  if (typeof val === "object") {
    // If it's already an object, ensure it's not null
    return val;
  }
  const trimmed = String(val).trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      // Fallback
    }
  }
  return { tr: trimmed };
}
