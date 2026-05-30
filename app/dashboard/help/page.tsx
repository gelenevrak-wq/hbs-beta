"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";
import DashboardLayout from "@/components/layout/DashboardLayout";

type HelpArticle = {
  id: string;
  category: string;
  question: Record<string, string>;
  answer: Record<string, string>;
  tip: Record<string, string>;
};

const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "item-type",
    category: "catalog",
    question: {
      tr: "Fiziksel Ürün ile Hizmet arasındaki fark nedir? Hangisini seçmeliyim?",
      en: "What is the difference between a Physical Product and a Service? Which one should I choose?",
      ka: "რა განსხვავებაა ფიზიკურ პროდუქტსა და სერვისს შორის? რომელი უნდა ავირჩიო?",
      ru: "В чем разница между Физическим товаром и Услугой? Что выбрать?",
      de: "Was ist der Unterschied zwischen physischem Produkt und Dienstleistung?"
    },
    answer: {
      tr: "Fiziksel ürünler (örneğin oto yedek parçaları, diagnostik cihazlar vb.) gerçek bir depoda saklanır, adet (stok) takibi gerektirir ve raf/koridor adresiyle yönetilir. Hizmetler, kiralamalar veya randevular ise stok adedi yerine zaman planı, sorumlu uzman kapasitesi veya takvim slotuna göre çalışır.",
      en: "Physical products (like spare parts, scanning devices) are stored in actual warehouses, require stock tracking, and have shelf addresses. Services, rentals, or appointments rely on time schedules, employee availability, or calendar bookings rather than inventory units.",
      ka: "ფიზიკური პროდუქტები (როგორიცაა სათადარიგო ნაწილები, დიაგნოსტიკის ხელსაწყოები) ინახება რეალურ საწყობში, საჭიროებს მარაგის კონტროლს და თაროს მისამართს. სერვისები, ქირაობა ან შეხვედრები ეყრდნობა სამუშაო გრაფიკს და პერსონალს.",
      ru: "Физические товары (например, автозапчасти, приборы диагностики) хранятся на реальных складах, требуют учета количества и имеют адрес хранения. Услуги, аренда или записи зависят от расписания, доступности сотрудников или календарной сетки, а не от остатков на складе.",
      de: "Physische Produkte (wie Ersatzteile oder Diagnosegeräte) werden in einem physischen Lager aufbewahrt, erfordern eine Bestandsverfolgung und haben Regaladressen. Dienstleistungen, Vermietungen oder Termine basieren auf Zeitplänen und Mitarbeiterverfügbarkeit."
    },
    tip: {
      tr: "Buji, kablo, diagnostik cihazı için 'Fiziksel Ürün'; arıza tespiti, montaj işçiliği veya danışmanlık seansları için 'Hizmet' veya 'Randevu' seçin.",
      en: "Select 'Physical Product' for spark plugs or cables; select 'Service' or 'Appointment' for diagnostic labor, installations, or consultations.",
      ka: "აირჩიეთ 'ფიზიკური პროდუქტი' სანთლებისთვის ან კაბელებისთვის; აირჩიეთ 'სერვისი' ან 'შეხვედრა' მონტაჟისთვის ან დიაგნოსტიკისთვის.",
      ru: "Выбирайте 'Физический товар' для свечей зажигания или кабелей; выбирайте 'Услугу' или 'Запись' для диагностики, монтажных работ или консультаций.",
      de: "Wählen Sie 'Physisches Produkt' für Zündkerzen oder Kabel; wählen Sie 'Dienstleistung' oder 'Termin' für Diagnosearbeiten, Montage oder Beratung."
    }
  },
  {
    id: "excel-errors",
    category: "excel",
    question: {
      tr: "Excel'de barkodların '8.69E+11' şeklinde bozulmasını ve sıfırların kaybolmasını nasıl önlerim?",
      en: "How do I prevent barcodes from showing as '8.69E+11' and losing leading zeroes in Excel?",
      ka: "როგორ ავიცილოთ თავიდან შტრიხკოდების '8.69E+11' სახით ჩვენება და ნულების დაკარგვა Excel-ში?",
      ru: "Как предотвратить превращение штрихкодов в '8.69E+11' и исчезновение нулей в Excel?",
      de: "Wie verhindere ich, dass Barcodes als '8.69E+11' angezeigt werden und führende Nullen in Excel verloren gehen?"
    },
    answer: {
      tr: "HBS'den indirdiğiniz yeni premium Excel (.xls) şablonunda barkod, SKU ve OEM kodu gibi uzun sayı içeren hücreler otomatik olarak 'Metin' formatında kilitlenmiştir. Bu sayede Excel sayıları bilimsel gösterime dönüştüremez ve başlarındaki sıfırları (Örn: 0023) silemez.",
      en: "In the new premium Excel (.xls) template provided by HBS, columns containing long numerical sequences (Barcode, SKU, OEM Code) are strictly pre-formatted as 'Text'. This stops Excel from applying scientific notation or stripping leading zeroes.",
      ka: "HBS-დან ჩამოტვირთულ ახალ პრემიუმ Excel (.xls) შაბლონში, შტრიხკოდის, SKU-ს და OEM კოდის სვეტები ავტომატურად ფორმატირებულია როგორც 'ტექსტი'. ეს ხელს უშლის Excel-ს რიცხვების დამახინჯებაში.",
      ru: "В новом премиум-шаблоне Excel (.xls), предоставляемом HBS, столбцы для длинных числовых кодов (штрихкод, SKU, OEM) жестко переведены в текстовый формат. Это не дает Excel округлять их до экспоненциального вида или удалять первые нули.",
      de: "In der neuen Premium-Excel-Vorlage (.xls) von HBS sind Spalten mit langen Zahlenreihen (Barcode, SKU, OEM-Code) als 'Text' vorformatiert. Dies verhindert, dass Excel die Ziffern verzerrt oder führende Nullen löscht."
    },
    tip: {
      tr: "Kendi Excel dosyanızı oluşturuyorsanız, barkod yazmadan önce o sütunun hücre biçimlendirmesini mutlaka 'Metin' (Text) olarak ayarlayın.",
      en: "If creating your own Excel file, make sure to format the barcode column as 'Text' before entering any barcode numbers.",
      ka: "თუ საკუთარ ფაილს ქმნით, შტრიხკოდის ჩაწერამდე აუცილებლად დააყენეთ სვეტის ფორმატი როგორც 'ტექსტი' (Text).",
      ru: "Если вы создаете свой файл Excel, обязательно настройте формат столбца штрихкодов как 'Текстовый' перед вводом цифр.",
      de: "Wenn Sie eine eigene Excel-Datei erstellen, formatieren Sie die Barcode-Spalte unbedingt als 'Text', bevor Sie Zahlen eingeben."
    }
  },
  {
    id: "excel-dropdowns",
    category: "excel",
    question: {
      tr: "İndirilen Excel şablonundaki açılır listeler (seçim pencereleri) nasıl çalışır?",
      en: "How do the built-in dropdowns (validation lists) in the downloaded Excel template work?",
      ka: "როგორ მუშაობს ჩამოტვირთული Excel შაბლონის ჩაშენებული სიები (dropdowns)?",
      ru: "Как работают встроенные выпадающие списки (dropdowns) в скачанном шаблоне Excel?",
      de: "Wie funktionieren die integrierten Dropdowns (Validierungslisten) in der heruntergeladenen Excel-Vorlage?"
    },
    answer: {
      tr: "Kullanıcıların geçersiz kelimeler yazarak sistemi bozmasını önlemek amacıyla, Excel şablonumuzda 'Kayıt Türü' (ürün, hizmet, kiralık, randevu) ve 'Para Birimi' (GEL, TRY, USD, EUR) sütunlarına yerel veri doğrulaması ekledik. Hücreye tıkladığınızda çıkan küçük oka basarak geçerli değeri seçebilirsiniz.",
      en: "To prevent users from entering invalid text that could break the system, we embedded native Excel validation lists in the 'Record Type' and 'Currency' columns. Simply click on a cell in these columns and select the desired value from the small arrow icon.",
      ka: "რათა თავიდან ავიცილოთ შეცდომები, შაბლონში 'ჩანაწერის ტიპისა' და 'ვალუტის' სვეტებში ჩავაშენეთ Excel-ის ვალიდაციის სიები. უჯრაზე დაწკაპუნებისას გამოჩნდება პატარა ისარი, საიდანაც ირჩევთ სასურველ მნიშვნელობას.",
      ru: "Чтобы пользователи не вводили некорректный текст, мы встроили списки выбора прямо в шаблон Excel для столбцов 'Тип записи' и 'Валюта'. При клике на ячейку в этих столбцах появляется стрелочка для выбора правильного значения.",
      de: "Um Fehleingaben zu vermeiden, haben wir Excel-Validierungslisten in die Spalten 'Eintragstyp' und 'Währung' integriert. Klicken Sie einfach auf eine Zelle in diesen Spalten, um den gewünschten Wert über den kleinen Pfeil auszuwählen."
    },
    tip: {
      tr: "Bu sistem 'fool proof' tasarlanmıştır. Başka bir şey yazmaya çalışırsanız Excel uyarı verecek ve kaydetmenize izin vermeyecektir.",
      en: "This layout is fully 'fool proof'. Trying to type anything else will trigger an Excel error and block you from saving.",
      ka: "ეს სისტემა სრულად 'fool proof' არის. სხვა რამის ჩაწერის მცდელობისას Excel გამოგიგდებთ შეცდომას და არ შეგინახავთ.",
      ru: "Эта система полностью защищена от ошибок. Попытка ввести другое значение вызовет предупреждение Excel и заблокирует ввод.",
      de: "Dieses System ist vollständig 'fool-proof'. Wenn Sie versuchen, etwas anderes einzugeben, blockiert Excel die Speicherung."
    }
  },
  {
    id: "pricing-modes",
    category: "pricing",
    question: {
      tr: "Fiyat & Teklif Politikaları (Fiyat Göster, Teklif Alın, Teklif Verin) ne anlama gelir?",
      en: "What do Pricing & Quote Policies (Show Price, Get a Quote, Submit Bid) mean?",
      ka: "რას ნიშნავს ფასისა და შემოთავაზების პოლიტიკა (ფასის ჩვენება, ფასის მოთხოვნა, შემოთავაზება)?",
      ru: "Что означают политики цен (Показать цену, Запросить цену, Предложить сделку)?",
      de: "Was bedeuten die Preisrichtlinien (Preis anzeigen, Angebot anfordern, Gebot abgeben)?"
    },
    answer: {
      tr: "1. 'Fiyat Göster' (Fixed): Ürün belirlenen sabit fiyattan doğrudan sepete eklenir. 2. 'Teklif Alın' (Quote): Fiyat gizlenir. Müşteri 'Fiyat Teklifi İste' butonu ile sizden proforma teklif talep eder. 3. 'Teklif Verin' (Bidding): Müşteriler ürüne kendi hedef iskonto veya bütçelerini teklif edebilir.",
      en: "1. 'Show Price' (Fixed): The item is sold at a fixed price. 2. 'Get a Quote' (Quote): The price is hidden. Clients request a custom proforma quote. 3. 'Submit Bid' (Bidding): Allows clients to submit their target pricing or volume discounts directly.",
      ka: "1. 'ფასის ჩვენება': პროდუქტი იყიდება ფიქსირებული ფასით. 2. 'ფასის მოთხოვნა': ფასი დამალულია, მომხმარებელი ითხოვს ინდივიდუალურ შეთავაზებას. 3. 'შემოთავაზება': კლიენტებს შეუძლიათ შემოგთავაზონ თავიანთი ფასი.",
      ru: "1. 'Показать цену': товар продается по фиксированной цене. 2. 'Запросить цену': цена скрыта, клиент просит выслать проформу. 3. 'Предложить сделку': позволяет покупателям предлагать свою целевую цену или скидку на объем.",
      de: "1. 'Preis anzeigen': Der Artikel wird zum Festpreis verkauft. 2. 'Angebot anfordern': Der Preis ist ausgeblendet. Kunden fordern ein individuelles Angebot an. 3. 'Gebot abgeben': Ermöglicht es Kunden, eigene Preis- oder Rabattangebote einzureichen."
    },
    tip: {
      tr: "Toptan parça satışları veya değişken kurla satılan pahalı diagnostik tabletler için 'Teklif Alın' politikasını kullanmak idealdir.",
      en: "For wholesale auto parts or expensive diagnostics with fluctuating exchange rates, 'Get a Quote' is highly recommended.",
      ka: "საბითუმო ნაწილებისთვის ან ძვირადღირებული დიაგნოსტიკისთვის, სადაც კურსი იცვლება, რეკომენდებულია 'ფასის მოთხოვნა'.",
      ru: "Для оптовых партий или дорогого диагностического оборудования с колеблющимся курсом идеален вариант 'Запросить цену'.",
      de: "Für den Großhandel mit Autoteilen oder teuren Diagnosegeräten mit schwankenden Kursen wird 'Angebot anfordern' empfohlen."
    }
  },
  {
    id: "warehouse-shelves",
    category: "warehouse",
    question: {
      tr: "Depo raf ve bölge adreslemesi neden önemlidir?",
      en: "Why is warehouse shelf and zone addressing important?",
      ka: "რატომ არის მნიშვნელოვანი საწყობში თაროებისა და ზონების მისამართების მითითება?",
      ru: "Почему важна адресация полок и зон на складе?",
      de: "Warum ist die Lagerplatz- und Regaladressierung wichtig?"
    },
    answer: {
      tr: "Binlerce yedek parçanın yer aldığı depolarda aradığınız ürünü saniyeler içinde bulmanızı sağlar. Bir ürün sisteme girerken hangi depo, hangi koridor ve rafta durduğu adreslenir. Teklif onaylanıp sipariş hazırlandığında, depo personelinin elindeki listede tam konum yazar.",
      en: "It ensures you locate any product in seconds in warehouses with thousands of auto parts. When adding items, specify the aisle, shelf, and section. When an order is generated, the packing list points staff directly to the exact spot.",
      ka: "ეს გაძლევთ საშუალებას წამებში იპოვოთ ნებისმიერი პროდუქტი საწყობში, სადაც ათასობით ნაწილია. შეკვეთის მომზადებისას, პერსონალი პირდაპირ ხედავს ზუსტ ადგილს.",
      ru: "Это позволяет за секунды находить детали на складах с тысячами автозапчастей. При добавлении товара укажите ряд, полку и ячейку. При сборке заказа упаковочный лист направит сотрудника точно к нужному месту.",
      de: "Es stellt sicher, dass Sie jedes Produkt in Lagern mit Tausenden von Autoteilen in Sekundenschnelle finden. Beim Hinzufügen geben Sie Gang, Regal und Fach an. Bei der Kommissionierung führt die Packliste direkt zum Platz."
    },
    tip: {
      tr: "Adreslemeyi 'A-02-B3' (A Koridoru, 2. Raf, 3. Bölme) şeklinde standart bir kodlama ile yapmanız işinizi kolaylaştırır.",
      en: "Using a standard format like 'A-02-B3' (Aisle A, Shelf 2, Section 3) keeps warehouse operations exceptionally clean.",
      ka: "გამოიყენეთ სტანდარტული მისამართი: 'A-02-B3' (დერეფანი A, თარო 2, სექცია 3) საწყობის ოპერაციების გამარტივებისთვის.",
      ru: "Использование стандартного формата вроде 'A-02-B3' (Ряд А, Полка 2, Ячейка 3) делает работу склада безупречно быстрой.",
      de: "Die Verwendung eines Standardformats wie 'A-02-B3' (Gang A, Regal 2, Fach 3) macht die Lagerprozesse extrem effizient."
    }
  },
  {
    id: "license-limits",
    category: "license",
    question: {
      tr: "Süre aşımı veya lisans limitlerine ulaşıldığında ne olur?",
      en: "What happens when subscription terms expire or license limits are reached?",
      ka: "რა ხდება, როდესაც სააბონენტო ვადა იწურება ან ლიცენზიის ლიმიტები ივსება?",
      ru: "Что происходит при истечении срока подписки или достижении лимитов лицензии?",
      de: "Was passiert, wenn die Abolaufzeit endet oder die Lizenzlimits erreicht werden?"
    },
    answer: {
      tr: "HBS çok mağazalı bir SaaS sistemidir. Deneme sürenizin dolmasına 3 gün kala sistem büyük bir uyarı kutusu gösterir. Süre dolduğunda, limitlerinizi aşmamak için mağazanız genel aramalarda askıya alınır (`is_visible_in_public_search = false`) ve lisans girilene kadar satışlar duraklatılır.",
      en: "HBS is a multi-tenant SaaS platform. 3 days before trial expiration, the panel displays a prominent alert. Upon expiration, to ensure system limits are respected, the store is hidden from public search until a new license is activated.",
      ka: "HBS არის მულტი-ტენანტური SaaS პლატფორმა. ვადის გასვლამდე 3 დღით ადრე პანელზე გამოჩნდება გაფრთხილება. ვადის გასვლის შემდეგ, მაღაზია დაიმალება ძებნიდან ლიცენზიის გააქტიურებამდე.",
      ru: "HBS — это облачная SaaS-платформа. За 3 дня до окончания демо-периода в панели появляется предупреждение. По истечении срока магазин скрывается из публичного поиска до ввода нового лицензионного ключа.",
      de: "HBS ist eine Multi-Tenant-SaaS-Plattform. 3 Tage vor Ablauf der Testphase zeigt das Panel eine Warnung an. Nach Ablauf wird der Shop aus der öffentlichen Suche ausgeblendet, bis eine neue Lizenz aktiviert wird."
    },
    tip: {
      tr: "Lisans limitlerinizi (kullanıcı sayısı, şube depoları, ürün sınırı) anlık olarak yükseltmek için HBS Lisans Paneli'nden kodunuzu girin.",
      en: "To instantly upgrade limits (user counts, warehouses, products), activate your key in the HBS Licensing Panel.",
      ka: "ლიმიტების გასაზრდელად (მომხმარებლები, საწყობები, პროდუქტები) გააქტიურეთ თქვენი კოდი HBS ლიცენზიის პანელში.",
      ru: "Чтобы мгновенно увеличить лимиты (пользователи, склады, товары), активируйте ключ в панели лицензирования HBS.",
      de: "Um Limits (Benutzer, Lager, Produkte) sofort zu erhöhen, aktivieren Sie Ihren Schlüssel im HBS-Lizenzbereich."
    }
  }
];

export default function HelpCenterPage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage((savedLanguage as LanguageCode) || "tr");
  }, []);

  const activeLang = language || "tr";

  const categories = useMemo(() => {
    return {
      all: { tr: "Tümü", en: "All", ka: "ყველა", ru: "Все", de: "Alle" },
      catalog: { tr: "Ürün & Katalog", en: "Catalog & Item", ka: "კატალოგი", ru: "Каталог", de: "Katalog" },
      excel: { tr: "Excel / Toplu İşlemler", en: "Excel & Batch", ka: "Excel / იმპორტი", ru: "Excel и импорт", de: "Excel & Massen" },
      pricing: { tr: "Fiyat & Teklif", en: "Pricing & Bids", ka: "ფასი და შეთავაზება", ru: "Цены и сделки", de: "Preise & Gebote" },
      warehouse: { tr: "Depo & Raf", en: "Warehouse & Shelf", ka: "საწყობი და თარო", ru: "Склад и полки", de: "Lager & Regale" },
      license: { tr: "Abonelik & Lisans", en: "Subscription & License", ka: "ლიცენზია", ru: "Лицензия", de: "Lizenz" }
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return HELP_ARTICLES.filter((article) => {
      const matchCategory = selectedCategory === "all" || article.category === selectedCategory;
      
      const qText = article.question[activeLang]?.toLowerCase() || "";
      const aText = article.answer[activeLang]?.toLowerCase() || "";
      const tText = article.tip[activeLang]?.toLowerCase() || "";

      const matchQuery = !q || qText.includes(q) || aText.includes(q) || tText.includes(q);

      return matchCategory && matchQuery;
    });
  }, [searchQuery, selectedCategory, activeLang]);

  if (!language) return <main className="min-h-screen bg-slate-950" />;

  return (
    <DashboardLayout activeMenu="Yardım Merkezi">
      <main className="space-y-4 text-slate-900">
        
        {/* Modern Interactive Header Block */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          {/* Subtle glowing color accents */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-black text-indigo-700 uppercase border border-indigo-100">
                ✨ HBS AKILLI REHBER
              </span>
              <h1 className="text-2xl font-black sm:text-3xl text-slate-800">
                {activeLang === "tr" ? "Yardım ve Bilgi Merkezi" : 
                 activeLang === "en" ? "Help & Knowledge Center" :
                 activeLang === "ka" ? "დახმარებისა და ცოდნის ცენტრი" :
                 activeLang === "ru" ? "Центр поддержки и знаний" : "Hilfe- & Wissenszentrum"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
                {activeLang === "tr" ? "Sistemi en hatasız (fool-proof) şekilde kullanabilmeniz ve müşterilerinizle mükemmel bir iletişim kurabilmeniz için hazırladığımız adım adım rehber. Arama çubuğunu kullanarak anında cevap bulun." :
                 activeLang === "en" ? "Step-by-step guide designed to keep your workflows fool-proof and communication flawless. Use the search bar to locate answers instantly." :
                 activeLang === "ka" ? "ეტაპობრივი გზამკვლევი შეცდომების თავიდან ასაცილებლად და კომუნიკაციის გასაუმჯობესებლად. გამოიყენეთ ძებნა პასუხების საპოვნელად." :
                 activeLang === "ru" ? "Пошаговое руководство для безошибочной работы и идеального общения с клиентами. Используйте строку поиска для мгновенных ответов." :
                 "Schritt-für-Schritt-Anleitung, um Ihre Arbeitsabläufe fehlerfrei und Ihre Kommunikation fehlerfrei zu halten. Nutzen Sie die Suchleiste, um Antworten sofort zu finden."}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <CompactLanguageSwitcher />
            </div>
          </div>
        </section>

        {/* Global Live Search Bar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-base pointer-events-none text-slate-400 select-none">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeLang === "tr" ? "Yardım konularında veya sütun adlarında arayın... (Örn: barkod, teklif, excel)" : 
                activeLang === "en" ? "Search help topics or columns... (e.g. barcode, quote, excel)" :
                activeLang === "ka" ? "მოძებნეთ დახმარების თემები... (მაგ: შტრიხკოდი, შემოთავაზება)" :
                activeLang === "ru" ? "Ищите по темам поддержки... (например: штрихкод, предложение, excel)" :
                "Hilfethemen oder Spalten durchsuchen... (z.B. Barcode, Angebot, Excel)"
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Dynamic Category Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
            {Object.entries(categories).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`rounded-lg px-3 py-2 text-[10px] sm:text-xs font-black transition border ${
                  selectedCategory === key 
                    ? "bg-slate-900 border-slate-900 text-white" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {val[activeLang] || val["tr"]}
              </button>
            ))}
          </div>
        </section>

        {/* Search Results / FAQ Cards */}
        <section className="grid gap-3.5">
          {filteredArticles.map((article) => (
            <article 
              key={article.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-300 space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {categories[article.category as keyof typeof categories]?.[activeLang] || categories[article.category as keyof typeof categories]?.["tr"]}
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-slate-800 mt-1">
                    ❓ {article.question[activeLang] || article.question["tr"]}
                  </h2>
                </div>
              </div>

              {/* Answer Content */}
              <p className="text-xs leading-relaxed font-medium text-slate-600">
                {article.answer[activeLang] || article.answer["tr"]}
              </p>

              {/* Magical AI Guided Tip block */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/65 p-3 flex gap-2.5">
                <span className="text-lg shrink-0 select-none">✨</span>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-900">
                    {activeLang === "tr" ? "AI Akıllı Tavsiye" : 
                     activeLang === "en" ? "AI Smart Tip" :
                     activeLang === "ka" ? "AI ჭკვიანი რჩევა" :
                     activeLang === "ru" ? "AI Умный совет" : "AI Intelligenter Tipp"}
                  </span>
                  <p className="text-[10px] sm:text-[11px] leading-relaxed font-bold text-indigo-950">
                    {article.tip[activeLang] || article.tip["tr"]}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {filteredArticles.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <span className="text-3xl block animate-bounce mb-2">🔍</span>
              <h3 className="text-xs sm:text-sm font-black text-slate-700">
                {activeLang === "tr" ? "Filtreye uygun arama sonucu bulunamadı" : 
                 activeLang === "en" ? "No search results match your criteria" :
                 activeLang === "ka" ? "შედეგი არ მოიძებნა" :
                 activeLang === "ru" ? "Ничего не найдено по вашему запросу" : "Keine Suchergebnisse gefunden"}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                {activeLang === "tr" ? "Lütfen farklı anahtar kelimeler kullanarak tekrar arayın." : 
                 activeLang === "en" ? "Please try searching with different keywords." :
                 activeLang === "ka" ? "გთხოვთ სცადოთ სხვა სიტყვებით ძებნა." :
                 activeLang === "ru" ? "Пожалуйста, попробуйте поискать с другими ключевыми словами." :
                 "Bitte versuchen Sie es mit anderen Begriffen erneut."}
              </p>
            </div>
          )}
        </section>
        
        {/* Support Help Contact block */}
        <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-black text-blue-900">
              {activeLang === "tr" ? "Sorunuzun cevabını bulamadınız mı?" : 
               activeLang === "en" ? "Still need assistance?" :
               activeLang === "ka" ? "პასუხი ვერ იპოვეთ?" :
               activeLang === "ru" ? "Не нашли ответ на ваш вопрос?" : "Haben Sie keine Antwort gefunden?"}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-600 font-bold leading-normal">
              {activeLang === "tr" ? "Müşterilerinizden veya bayilerinizden sık gelen yeni soruları bize iletin, anında buraya çok dilli olarak ekleyelim." : 
               activeLang === "en" ? "Send us recurring questions from your clients and we'll add them here in all languages immediately." :
               activeLang === "ka" ? "მოგვწერეთ ხშირი კითხვები და ჩვენ მაშინვე დავამატებთ მათ აქ ყველა ენაზე." :
               activeLang === "ru" ? "Присылайте частые вопросы от ваших клиентов, и мы сразу же добавим их сюда на всех языках." :
               "Senden Sie uns wiederkehrende Fragen Ihrer Kunden, und wir werden sie hier sofort in allen Sprachen hinzufügen."}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] sm:text-xs px-4 py-2.5 shadow-sm active:scale-95 transition whitespace-nowrap"
          >
            {activeLang === "tr" ? "Ana Panele Dön" : 
             activeLang === "en" ? "Back to Dashboard" :
             activeLang === "ka" ? "პანელზე დაბრუნება" :
             activeLang === "ru" ? "На главную панель" : "Zurück zum Dashboard"}
          </Link>
        </section>

      </main>
    </DashboardLayout>
  );
}
