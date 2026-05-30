"use client";

import { useEffect, useState } from "react";

type Explanation = {
  title: string;
  desc: string;
  tip: string;
};

const EXPLANATIONS: Record<string, Record<string, Explanation>> = {
  itemType: {
    tr: {
      title: "Kayıt Türü Nedir?",
      desc: "Bu alan sistemin ürünü nasıl ele alacağını belirler. 'Fiziksel Ürün' stok, depo ve raf takibi gerektirirken; 'Hizmet', 'Kiralama' veya 'Randevu' gibi kayıtlar ise adet yerine zaman planı, personel kapasitesi veya takvim rezervasyonuna göre çalışır.",
      tip: "Yedek parçalar için 'Fiziksel Ürün', işçilik veya arıza tespiti için 'Hizmet satışı' seçin."
    },
    en: {
      title: "What is Record Type?",
      desc: "This field determines how the system manages the item. 'Physical Product' requires stock, warehouse, and shelf tracking; while 'Service', 'Rental', or 'Appointment' records rely on time schedules, staff capacity, or calendar bookings.",
      tip: "Select 'Physical Product' for spare parts, and 'Service' for labor or diagnostics."
    },
    ka: {
      title: "რა არის ჩანაწერის ტიპი?",
      desc: "ეს ველი განსაზღვრავს, როგორ მართავს სისტემა ელემენტს. 'ფიზიკური პროდუქტი' მოითხოვს მარაგის, საწყობისა და თაროს კონტროლს; ხოლო 'სერვისი', 'ქირაობა' ან 'შეხვედრა' ეყრდნობა სამუშაო საათებსა და პერსონალის ხელმისაწვდომობას.",
      tip: "აირჩიეთ 'ფიზიკური პროდუქტი' სათადარიგო ნაწილებისთვის, ხოლო 'სერვისი' სამუშაოს ან დიაგნოსტიკისთვის."
    },
    ru: {
      title: "Что такое тип записи?",
      desc: "Это поле определяет, как система будет обрабатывать позицию. 'Физический товар' требует учета склада и полок; 'Услуга', 'Аренда' или 'Запись' работают на основе графиков, загруженности персонала и календаря.",
      tip: "Выбирайте 'Физический товар' для автозапчалей, а 'Услуга' для ремонтных работ или диагностики."
    },
    de: {
      title: "Was ist der Eintragstyp?",
      desc: "Dieses Feld bestimmt, wie das System den Artikel verwaltet. 'Physisches Produkt' erfordert Lager- und Regalkontrolle; während 'Dienstleistung', 'Vermietung' oder 'Termin' auf Zeitplänen, Personalkapazität oder Kalenderbuchungen basieren.",
      tip: "Wählen Sie 'Physisches Produkt' für Ersatzteile und 'Dienstleistung' für Arbeitszeit oder Diagnose."
    }
  },
  pricingMode: {
    tr: {
      title: "Fiyat & Teklif Politikası",
      desc: "Ürünlerinizi satarken uygulayacağınız modeli seçin. 'Fiyat Göster' ile sabit fiyat belirlersiniz ve müşteri doğrudan satın alır. 'Teklif Alın' seçeneğinde fiyat gizlenir ve müşteri sizden fiyat teklifi ister. 'Teklif Verin' seçeneğinde ise alıcı kendi bütçe/iskonto teklifini sunabilir.",
      tip: "Piyasası değişken veya nadir parçalar için 'Teklif Alın' modelini seçmek satışlarınızı artırabilir."
    },
    en: {
      title: "Pricing & Quote Policy",
      desc: "Choose the pricing model. 'Show Price' sets a fixed amount for direct purchases. 'Get a Quote' hides the price, prompting customers to request price lists. 'Submit Bid' allows buyers to pitch their own discount and budget targets.",
      tip: "For high-value or rare items, choosing 'Get a Quote' helps initiate direct sales discussions."
    },
    ka: {
      title: "ფასისა და შემოთავაზების პოლიტიკა",
      desc: "აირჩიეთ ფასწარმოქმნის მოდელი. 'ფასის ჩვენება' ადგენს ფიქსირებულ ფასს პირდაპირი ყიდვისთვის. 'ფასის მოთხოვნა' მალავს ფასს და სთხოვს მომხმარებელს მოთხოვნის გაგზავნას. 'ფასის შეთავაზება' კლიენტს აძლევს საშუალებას შესთავაზოს საკუთარი ბიუჯეტი.",
      tip: "ძვირადღირებული ან იშვიათი ნაწილებისთვის 'ფასის მოთხოვნა' იდეალური არჩევანია."
    },
    ru: {
      title: "Политика цен и предложений",
      desc: "Выберите ценовую модель. 'Показать цену' устанавливает фиксированную цену. 'Запросить цену' скрывает стоимость, предлагая клиенту сделать запрос. 'Предложить сделку' позволяет клиентам предлагать свои скидки и бюджетные цели.",
      tip: "Для редких или дорогих автокомпонентов модель 'Запросить цену' помогает начать диалог с покупателем."
    },
    de: {
      title: "Preis- und Angebotsrichtlinie",
      desc: "Wählen Sie das Preismodell. 'Preis anzeigen' legt einen Festpreis fest. 'Angebot anfordern' blendet den Preis aus, sodass Kunden Anfragen senden müssen. 'Gebot abgeben' erlaubt es Käufern, eigene Rabatte oder Budgetziele vorzuschlagen.",
      tip: "Für seltene oder teure Teile kann die Option 'Angebot anfordern' den direkten Kundenkontakt fördern."
    }
  },
  variants: {
    tr: {
      title: "Ürün Varyantları Neden Kullanılır?",
      desc: "Aynı temel ürünün alt modellerini, renklerini veya boyutlarını gruplamak için kullanılır. Örneğin bir teşhis cihazının 'Ultra' ve 'Elite' modellerini ayrı ürünler olarak açmak yerine tek ürün altında varyant olarak tanımlayabilirsiniz.",
      tip: "Her varyantın kendine ait barkodu, fiyatı, stok adedi ve depo konumu (rafı) bağımsız olarak yönetilir."
    },
    en: {
      title: "Why Use Product Variants?",
      desc: "Variants group different versions (e.g., different specs, models, or colors) under a single master item. For instance, rather than creating separate pages for Autel 'Ultra' and 'Elite' tools, keep them on one page as variants.",
      tip: "Each variant manages its own barcode, pricing, stock count, and warehouse location independently."
    },
    ka: {
      title: "რატომ გამოვიყენოთ პროდუქტის ვარიანტები?",
      desc: "ვარიანტები აერთიანებს სხვადასხვა მოდელებს ან ფერებს ერთი ძირითადი პროდუქტის ქვეშ. მაგალითად, Autel-ის 'Ultra' და 'Elite' ცალ-ცალკე შექმნის ნაცვლად, შეგიძლიათ შეინახოთ ისინი ერთ გვერდზე ვარიანტებად.",
      tip: "თითოეულ ვარიანტს აქვს საკუთარი შტრიხკოდი, ფასი, მარაგი და თარო საწყობში."
    },
    ru: {
      title: "Зачем нужны варианты товара?",
      desc: "Варианты группируют разные комплектации, размеры или цвета под одной карточкой. Например, вместо создания отдельных страниц для приборов Autel 'Ultra' и 'Elite', добавьте их как варианты одного товара.",
      tip: "Каждая модификация имеет собственный штрихкод, цену, остаток и конкретную полку на складе."
    },
    de: {
      title: "Warum Produktvarianten nutzen?",
      desc: "Varianten gruppieren verschiedene Versionen (z.B. unterschiedliche Modelle oder Farben) unter einem einzigen Hauptartikel. Statt separate Seiten für Autel 'Ultra' und 'Elite' anzulegen, führen Sie diese als Varianten.",
      tip: "Jede Variante verwaltet ihren eigenen Barcode, Preis, Bestand und Lagerort völlig eigenständig."
    }
  },
  warehouse: {
    tr: {
      title: "Depo ve Raf Konumlandırma",
      desc: "Ürünün fiziki olarak nerede durduğunu adresler. Özellikle binlerce yedek parçaya sahip işletmelerde arama zahmetini ortadan kaldırır. Satış yapıldığında veya stok sayımında sistem personelini doğrudan bu rafa yönlendirir.",
      tip: "Örn: 'Ana Depo' - 'A-04-R2' (A Koridoru, 4. Raf, 2. Bölme) gibi detaylı adresleme yapabilirsiniz."
    },
    en: {
      title: "Warehouse & Shelf Positioning",
      desc: "Specifies where the item is physically stored. Extremely useful for parts centers to eliminate searching efforts. When a sale occurs, the system points technicians directly to this specific shelf.",
      tip: "Example: You can use precise addresses like 'Central' - 'A-04-R2' (Aisle A, Shelf 4, Section 2)."
    },
    ka: {
      title: "საწყობი და თაროს მდებარეობა",
      desc: "განსაზღვრავს ნივთის ფიზიკურ ადგილს. ძალიან სასარგებლოა ავტონაწილების ცენტრებისთვის ძებნის დროის შესამცირებლად. გაყიდვისას სისტემა პირდაპირ მიუთითებს შესაბამის თაროზე.",
      tip: "მაგალითად, გამოიყენეთ ზუსტი მისამართი: 'მთავარი საწყობი' - 'A-04-R2' (A დერეფანი, მე-4 თარო)."
    },
    ru: {
      title: "Адресация складов и полок",
      desc: "Указывает точное физическое расположение товара. Позволяет мгновенно находить нужные детали среди тысяч наименований. При продаже или инвентаризации система покажет конкретное место хранения.",
      tip: "Пример: 'Главный склад' - 'A-04-R2' (Ряд A, Полка 4, Ячейка 2) для быстрого поиска."
    },
    de: {
      title: "Lager- und Regalpositionierung",
      desc: "Gibt an, wo das Produkt physisch gelagert wird. Beseitigt mühsames Suchen in großen Teilelagern. Bei einem Verkauf leitet das System Ihre Mitarbeiter direkt zu diesem spezifischen Regal.",
      tip: "Beispiel: Nutzen Sie präzise Angaben wie 'Hauptlager' - 'A-04-R2' (Gang A, Regal 4, Fach 2)."
    }
  },
  batchImport: {
    tr: {
      title: "Toplu Ürün Aktarımı (Excel)",
      desc: "Mağazanıza tek tıkla yüzlerce ürün eklemenin en hızlı yoludur. Sağlanan şablon dosyasında başlıklar sabittir ve Excel'de açıldığında hata yapmanızı önleyen açılır seçim kutuları (Kayıt Türü, Para Birimi vb.) otomatik olarak aktif olur.",
      tip: "Barkodların ve SKU kodlarının başındaki sıfırların kaybolmasını önlemek için sistem hücreleri otomatik olarak metin biçiminde kilitler."
    },
    en: {
      title: "Batch Product Import (Excel)",
      desc: "The fastest way to upload hundreds of products at once. The downloaded template features built-in Excel validation lists (dropdowns for Record Type, Currency, etc.) to completely eliminate data entry mistakes.",
      tip: "To prevent barcode zeroes from disappearing, the system strictly locks cells in Text format."
    },
    ka: {
      title: "პროდუქტების იმპორტი Excel-ით",
      desc: "ერთდროულად ასობით პროდუქტის ატვირთვის ყველაზე სწრაფი გზა. ჩამოტვირთულ შაბლონს აქვს ჩაშენებული Excel-ის სიები (ჩანაწერის ტიპი, ვალუტა) შეცდომების თავიდან ასაცილებლად.",
      tip: "შტრიხკოდების ნულების დაკარგვის თავიდან ასაცილებლად, სისტემა ავტომატურად ბლოკავს უჯრებს ტექსტის ფორმატში."
    },
    ru: {
      title: "Импорт товаров через Excel",
      desc: "Самый быстрый способ загрузить сотни товаров. Скачиваемый файл содержит встроенные в Excel выпадающие списки выбора (тип записи, валюта и т.д.), чтобы полностью исключить ошибки ввода данных.",
      tip: "Чтобы первые нули в штрихкодах не пропадали, система жестко блокирует ячейки в текстовом формате."
    },
    de: {
      title: "Massenimport via Excel",
      desc: "Der schnellste Weg, Hunderte von Produkten auf einmal hochzuladen. Die heruntergeladene Vorlage verfügt über integrierte Excel-Dropdowns (für Eintragstyp, Währung usw.), um Eingabefehler auszuschließen.",
      tip: "Damit führende Nullen bei Barcodes nicht verschwinden, sperrt das System die Zellen im Textformat."
    }
  },
  barcode: {
    tr: {
      title: "Barkod ve Karekod (QR)",
      desc: "Ürünlerinizi el terminalleri, barkod okuyucu tabancalar veya akıllı telefon kameraları ile anında okutarak saniyeler içinde sepet teklifine eklemenizi sağlar. Barkod hatasız takip için kritik bir benzersiz kimliktir.",
      tip: "Excel şablonuna yazarken uzun barkodların '8.69E+11' şeklinde bozulmaması için hücreler metin formatındadır."
    },
    en: {
      title: "Barcode & QR Code",
      desc: "Allows reading items instantly with hand terminals, scanning guns, or smartphone cameras. A barcode is a critical unique identifier for accurate inventory and quick quote additions.",
      tip: "Cells are locked in text format so long barcodes don't distort into '8.69E+11' scientific formats in Excel."
    },
    ka: {
      title: "შტრიხკოდი და QR კოდი",
      desc: "საშუალებას გაძლევთ წამებში დაასკანიროთ ნივთები სკანერით ან ტელეფონით. შტრიხკოდი არის უნიკალური იდენტიფიკატორი ზუსტი აღრიცხვისთვის.",
      tip: "უჯრები ჩაკეტილია ტექსტის ფორმატში, რათა Excel-ში შტრიხკოდები არ გარდაიქმნას სამეცნიერო '8.69E+11' ფორმატში."
    },
    ru: {
      title: "Штрихкоды и QR-коды",
      desc: "Позволяет мгновенно считывать товары терминалами, сканерами или камерой смартфона для быстрого добавления в корзину/предложение. Штрихкод — ключевой уникальный идентификатор.",
      tip: "В Excel-шаблоне ячейки заблокированы в текстовом формате, чтобы длинные штрихкоды не превращались в '8.69E+11'."
    },
    de: {
      title: "Barcode & QR-Code",
      desc: "Ermöglicht das sofortige Scannen von Artikeln mit Handterminals, Scannern oder Smartphones für schnelle Angebote. Der Barcode ist ein kritischer Identifikator für fehlerfreie Bestände.",
      tip: "Die Zellen sind als Text formatiert, damit lange Barcodes in Excel nicht in wissenschaftliche Formate wie '8.69E+11' umgewandelt werden."
    }
  }
};

type AICopilotTooltipProps = {
  fieldKey: keyof typeof EXPLANATIONS;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export default function AICopilotTooltip({ fieldKey, position = "top", className = "" }: AICopilotTooltipProps) {
  const [lang, setLang] = useState<string>("tr");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedLang = window.localStorage.getItem("hbs-language") || "tr";
    setLang(savedLang);
  }, []);

  const data = EXPLANATIONS[fieldKey]?.[lang] || EXPLANATIONS[fieldKey]?.["tr"];

  if (!data) return null;

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-2.5"
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-white/95 border-x-transparent border-b-transparent -mb-1",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-white/95 border-x-transparent border-t-transparent -mt-1",
    left: "left-full top-1/2 -translate-y-1/2 border-l-white/95 border-y-transparent border-r-transparent -mr-1",
    right: "right-full top-1/2 -translate-y-1/2 border-r-white/95 border-y-transparent border-l-transparent -ml-1"
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Sparkles glowing AI badge icon */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-tr from-purple-600 via-indigo-600 to-blue-500 text-[10px] font-black text-white shadow-xs transition hover:scale-110 active:scale-95 animate-pulse select-none cursor-pointer focus:outline-hidden"
        title="✨ AI Yardımcı"
      >
        ✨
      </button>

      {/* Futuristic Glassmorphic Explainer Popup */}
      {isOpen && (
        <div className={`absolute z-50 w-72 rounded-2xl border border-white/40 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-200 animate-fadeIn ${positionClasses[position]}`}>
          {/* Arrow */}
          <div className={`absolute h-0 w-0 border-4 ${arrowClasses[position]}`} />
          
          <div className="space-y-2 text-slate-900">
            {/* Header */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <span className="text-xs">✨</span>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-700 font-sans">
                AI REHBER: {data.title}
              </h4>
            </div>

            {/* Main Desc */}
            <p className="text-xs leading-relaxed font-medium text-slate-600 font-sans">
              {data.desc}
            </p>

            {/* Pro Tip section */}
            <div className="rounded-lg bg-indigo-50/70 p-2 border border-indigo-100">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-800 block">💡 AI Pratik İpucu:</span>
              <p className="text-[10px] leading-relaxed text-indigo-950 font-bold mt-0.5">
                {data.tip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
