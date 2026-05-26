"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type LanguageCode = "tr" | "en" | "de" | "ru" | "ka";

type LocalizedText = Record<LanguageCode, string>;

type Scene = {
  id: number;
  start: number;
  end: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  voiceover: LocalizedText;
  icon: string;
  color: string;
  badge: LocalizedText;
};

const scenes: Scene[] = [
  {
    id: 1,
    start: 0,
    end: 10,
    title: {
      tr: "Ticaretin Acı Gerçeği: Komisyon Tuzağı",
      en: "The Bitter Reality of Trade: The Commission Trap",
      de: "Die bittere Realität des Handels: Die Provisionsfalle",
      ru: "Горькая реальность торговли: Комиссионная ловушка",
      ka: "ვაჭრობის მწარე რეალობა: საკომისიო ხაფანგი"
    },
    subtitle: {
      tr: "Yüksek komisyon oranları ve eriyen esnaf kârları",
      en: "High commission rates and melting merchant profits",
      de: "Hohe Provisionssätze und schmelzende Händlergewinne",
      ru: "Высокие комиссии и тающая прибыль продавцов",
      ka: "მაღალი საკომისიო განაკვეთები და გამლღვალი მოგება"
    },
    voiceover: {
      tr: "Emeğinizin %30'unu dev pazar yerlerine komisyon olarak kaptırmaktan yorulmadınız mı? Yüksek kesintiler kârınızı eritirken, satıcıyı çaresizliğe, müşterileri ise yüksek fiyatlara mahkum ediyor. Artık bu adaletsizliğe son verme zamanı geldi.",
      en: "Aren't you tired of giving 30% of your hard-earned labor to giant marketplaces as commission? High deductions melt your profits, condemning sellers to helplessness and customers to high prices. It is time to end this injustice.",
      de: "Haben Sie es nicht satt, 30 % Ihrer hart erarbeiteten Arbeit als Provision an riesige Marktplätze abzugeben? Hohe Abzüge lassen Ihre Gewinne schmelzen und verdammen Verkäufer zur Hilflosigkeit und Kunden zu hohen Preisen. Es ist Zeit, diese Ungerechtigkeit zu beenden.",
      ru: "Не устали ли вы отдавать 30% своего нелегкого труда гигантским маркетплейсам в виде комиссии? Высокие вычеты съедают вашу прибыль, обрекая продавцов на бессилие, а покупателей — на завышенные цены. Пора положить конец этой несправедливости.",
      ka: "არ დაიღალეთ თქვენი შრომის 30%-ის გიგანტური პლატფორმებისთვის საკომისიოდ მიცემით? მაღალი გადასახადები ადნობს თქვენს მოგებას, გამყიდველებს უმწეოდ ტოვებს, ხოლო მომხმარებლებს მაღალ ფასებს სთავაზობს. დროა დასრულდეს ეს უსამართლობა."
    },
    icon: "💸",
    color: "from-red-950 via-slate-900 to-slate-900",
    badge: {
      tr: "Komisyon Kaybı",
      en: "Commission Loss",
      de: "Provisionsverlust",
      ru: "Потеря комиссии",
      ka: "საკომისიოს დაკარგვა"
    }
  },
  {
    id: 2,
    start: 10,
    end: 25,
    title: {
      tr: "HBS ile Tanışın: %0 Komisyon Devrimi",
      en: "Meet HBS: 0% Commission Revolution",
      de: "Treffen Sie HBS: 0% Provisions-Revolution",
      ru: "Встречайте HBS: Революция 0% комиссии",
      ka: "გაიცანით HBS: 0% საკომისიო რევოლუცია"
    },
    subtitle: {
      tr: "Emeğinizin %100'ü cebinizde kalsın!",
      en: "Keep 100% of your earnings in your pocket!",
      de: "Behalten Sie 100% Ihres Verdienstes in Ihrer Tasche!",
      ru: "Оставляйте 100% заработка в своем кармане!",
      ka: "შეინარჩუნეთ თქვენი შემოსავლის 100% ჯიბეში!"
    },
    voiceover: {
      tr: "HBS Market ile tanışın! Komisyonların sıfırlandığı, kârınızın %100'ünün cebinizde kaldığı yepyeni bir SaaS dünyası. Sadece sabit ve uygun bir lisans bedeli ödeyin, ürünlerinizi doğrudan internetteki en rekabetçi fiyatlarla sergileyin.",
      en: "Meet HBS Market! A brand new SaaS world where commissions are zeroed and 100% of your profits stay in your pocket. Just pay a fixed and affordable license fee, and display your products directly at the most competitive prices on the internet.",
      de: "Lernen Sie HBS Market kennen! Eine völlig neue SaaS-Welt, in der Provisionen auf Null gesetzt werden und 100 % Ihrer Gewinne in Ihrer Tasche bleiben. Zahlen Sie einfach eine feste und erschwingliche Lizenzgebühr und präsentieren Sie Ihre Produkte direkt zu den wettbewerbsfähigsten Preisen im Internet.",
      ru: "Встречайте HBS Market! Совершенно новый мир SaaS, где комиссии сведены к нулю, а 100% прибыли остается у вас. Просто платите фиксированную доступную лицензионную плату и выставляйте товары по самым конкурентным ценам в интернете.",
      ka: "გაიცანით HBS Market! სრულიად ახალი SaaS სამყარო, სადაც საკომისიოები ნულოვანია და თქვენი მოგების 100% ჯიბეში გრჩებათ. უბრალოდ გადაიხადეთ ფიქსირებული და ხელმისაწვდომი სალიცენზიო გადასახადი და განათავსეთ პროდუქტები ინტერნეტში ყველაზე კონკურენტულ ფასებში."
    },
    icon: "🛡️",
    color: "from-blue-950 via-slate-900 to-slate-900",
    badge: {
      tr: "Sabit Lisans",
      en: "Fixed License",
      de: "Feste Lizenz",
      ru: "Фикс. Лицензия",
      ka: "ფიქსირებული ლიცენზია"
    }
  },
  {
    id: 3,
    start: 25,
    end: 40,
    title: {
      tr: "Depodan Google Arama Sonuçlarına (SEO)",
      en: "From Warehouse to Google Search (SEO)",
      de: "Vom Lager zur Google-Suche (SEO)",
      ru: "Из склада в результаты поиска Google (SEO)",
      ka: "საწყობიდან Google-ის ძიებაში (SEO)"
    },
    subtitle: {
      tr: "Fiziksel depoya giriş anında Google aramalarında bulunabilirlik",
      en: "Instant Google search visibility the moment it enters the physical shelf",
      de: "Sofortige Google-Sichtbarkeit bei Ablage im physischen Regal",
      ru: "Мгновенная видимость в Google с момента выкладки на физическую полку",
      ka: "მყისიერი ხილვადობა Google-ში ფიზიკურ თაროზე განთავსებისთანავე"
    },
    voiceover: {
      tr: "HBS'te sınır yoktur! Ürününüzü fiziksel deponuzdaki rafa koyup sisteme girdiğiniz ilk saniyeden itibaren; HBS'in güçlü entegre SEO altyapısı sayesinde ürünleriniz Google aramalarında doğrudan bulunabilir olur. Ekstra reklam bütçesi harcamadan küresel müşterilere ulaşın.",
      en: "There are no limits in HBS! From the very first second you place your product on your physical warehouse shelf and enter it into the system; thanks to HBS's powerful integrated SEO engine, your products become directly findable in Google searches. Reach global customers without spending advertising budget.",
      de: "Bei HBS gibt es keine Grenzen! Ab der ersten Sekunde, in der Sie Ihr Produkt in Ihr physisches Lagerregal legen und im System erfassen; Dank der leistungsstarken integrierten SEO-Engine von HBS sind Ihre Produkte bei Google-Suchen direkt auffindbar. Erreichen Sie globale Kunden, ohne Werbebudget auszugeben.",
      ru: "В HBS нет границ! С первой же секунды, как вы кладете товар на полку своего склада и заносите его в систему; благодаря мощному встроенному SEO-движку HBS ваши товары мгновенно становятся доступны в поиске Google. Находите клиентов по всему миру без рекламного бюджета.",
      ka: "HBS-ში საზღვრები არ არსებობს! პირველივე წამიდან, როდესაც პროდუქტს ფიზიკურ საწყობში თაროზე განათავსებთ და სისტემაში შეიყვანთ; HBS-ის ძლიერი ინტეგრირებული SEO ძრავის წყალობით, თქვენი პროდუქტები Google-ის ძიებაში პირდაპირ იპოვება. მიაღწიეთ გლობალურ კლიენტებს სარეკლამო ბიუჯეტის გარეშე."
    },
    icon: "⚡",
    color: "from-emerald-950 via-slate-900 to-slate-900",
    badge: {
      tr: "Anında Google SEO",
      en: "Instant Google SEO",
      de: "Sofortiges Google SEO",
      ru: "Мгновенное SEO",
      ka: "მყისიერი Google SEO"
    }
  },
  {
    id: 4,
    start: 40,
    end: 50,
    title: {
      tr: "Sektörel Vitrinler ve Yapay Zeka Çevirisi",
      en: "Sector Storefronts & AI Translation",
      de: "Branchen-Schaufenster & KI-Übersetzung",
      ru: "Отраслевые витрины и перевод ИИ",
      ka: "სექტორული ვიტრინები და AI თარგმანი"
    },
    subtitle: {
      tr: "Dinamik sektör modülleri ve küresel ticaret köprüsü",
      en: "Dynamic sector modules and global trade bridge",
      de: "Dynamische Branchenmodule und globale Handelsbrücke",
      ru: "Динамические модули отраслей и мост глобальной торговли",
      ka: "დინამიკური დარგობრივი მოდულები და გლობალური სავაჭრო ხიდი"
    },
    voiceover: {
      tr: "İster yedek parça satışı, ister emlak portföyü, ister kuaför randevusu... HBS, işinize göre saniyeler içinde şekillenir. Yapay zeka destekli anlık çeviri köprüsüyle alıcı ve satıcıyı kendi dillerinde sınır ötesi ticarette zahmetsizce buluşturur.",
      en: "Whether it is spare parts sales, real estate portfolio, or hairdresser appointments... HBS morphs in seconds according to your business. With its AI-powered instant translation bridge, it effortlessly brings buyer and seller together in cross-border trade in their own languages.",
      de: "Ob Ersatzteilverkauf, Immobilienportfolio oder Friseurtermine... HBS passt sich sekundenschnell Ihrem Unternehmen an. Mit der KI-gestützten Sofortübersetzungsbrücke bringt es Käufer und Verkäufer im grenzüberschreitenden Handel mühelos in ihrer eigenen Sprache zusammen.",
      ru: "Будь то автозапчасти, портфель недвижимости или запись в парикмахерскую... HBS за секунды перестраивается под ваш бизнес. А встроенный мост перевода на базе искусственного интеллекта мгновенно объединяет покупателя и продавца на их родных языках.",
      ka: "იქნება ეს სათადარიგო ნაწილების გაყიდვა, უძრავი ქონების პორტფელი თუ პარიკმახერის დაჯავშნა... HBS წამებში იცვლის ფორმას თქვენი ბიზნესის შესაბამისად. ხელოვნური ინტელექტის მყისიერი თარგმანის წყალობით, ის მყიდველსა და გამყიდველს თავიანთ ენებზე აკავშირებს."
    },
    icon: "🎯",
    color: "from-indigo-950 via-slate-900 to-slate-900",
    badge: {
      tr: "Dinamik Vitrinler",
      en: "Modular Storefronts",
      de: "Modulare Schaufenster",
      ru: "Витрины и ИИ-перевод",
      ka: "მოდულური ვიტრინები"
    }
  },
  {
    id: 5,
    start: 50,
    end: 60,
    title: {
      tr: "Geleceğin Ticaretine Bugün Katılın",
      en: "Join the Future of Commerce Today",
      de: "Treffen Sie der Zukunft des Handels bei",
      ru: "Присоединяйтесь к будущему торговли сегодня",
      ka: "შემოუერთდით ვაჭრობის მომავალს დღესვე"
    },
    subtitle: {
      tr: "HBS ile erken kalkan yol alır!",
      en: "Early bird catches the worm with HBS!",
      de: "Der frühe Vogel fängt den Wurm mit HBS!",
      ru: "Кто рано встает, тот с HBS больше берет!",
      ka: "HBS-ით ვინც ადრე იწყებს, ის მეტს იგებს!"
    },
    voiceover: {
      tr: "HBS, sizin için kendini sürekli yenileyen dinamik bir ekosistemdir. Bu devrimsel altyapıya ne kadar erken girerseniz, arama motorlarında o kadar kıdem kazanır ve rekabette öne geçersiniz. Geleceğin ticaretine bugün adım atın. HBS Market.",
      en: "HBS is a dynamic ecosystem that constantly renews itself for you. The earlier you enter this revolutionary infrastructure, the more authority you build in search engines and stand out in competition. Step into the future of commerce today. HBS Market.",
      de: "HBS ist ein dynamisches Ökosystem, das sich ständig für Sie erneuert. Je früher Sie in diese revolutionäre Infrastruktur einsteigen, desto mehr Autorität bauen Sie in Suchmaschinen auf und heben sich vom Wettbewerb ab. Treten Sie noch heute in die Zukunft des Handels ein. HBS Market.",
      ru: "HBS — это динамичная экосистема, которая постоянно обновляется ради вас. Чем раньше вы войдете в эту революционную инфраструктуру, тем больший авторитет в поисковых системах вы заработаете и опередите конкурентов. Шагните в будущее торговли сегодня. HBS Market.",
      ka: "HBS არის დინამიკური ეკოსისტემა, რომელიც მუდმივად ახლდება თქვენთვის. რაც უფრო ადრე შემოუერთდებით ამ რევოლუციურ ინფრასტრუქტურას, მით მეტ ავტორიტეტს მოიპოვებთ საძიებო სისტემებში და გაუსწრებთ კონკურენტებს. გადადგით ნაბიჯი მომავალში დღესვე. HBS Market."
    },
    icon: "🚀",
    color: "from-violet-950 via-slate-900 to-slate-900",
    badge: {
      tr: "Erken Giriş",
      en: "Early Bird",
      de: "Frühbucher-Chance",
      ru: "Ранний старт",
      ka: "ადრეული შესვლა"
    }
  }
];

const uiTexts = {
  tr: {
    previewBadge: "HBS TANITIM VİDEOSU ÖNİZLEME",
    interactiveTitle: "🎬 Etkileşimli Tanıtım Filmi & Seslendirme Simülatörü",
    pageDesc: "HBS Market'in komisyonsuz SaaS yapısını, anlık Google arama indekslemesini, çok dilli yapay zeka çeviri sistemini ve her sektöre uyum sağlayan akıllı vitrinlerini 60 saniyelik senkronize storyboard oynatıcımızla deneyimleyin.",
    subtitleLabel: "Seslendirme / Alt Yazı",
    timelineLabel: "🧭 SAHNE PANELİ (TIKLA & ATLA)",
    scriptLabel: "📖 REKLAM SENARYOSU & DETAYLI AKIŞ",
    advantagesLabel: "⭐ HBS ÜSTÜNLÜKLERİ",
    ctaTitle: "HBS Sistemine Ne Kadar Erken Girerseniz O Kadar Kazanırsınız!",
    ctaDesc: "HBS'in akıllı SEO motorları, arama motorlarında ne kadar uzun süredir yayında kalırsanız sizi o kadar ödüllendirir. Şimdiden deponuzu kaydedin, mağazanızı oluşturun ve geleceğin e-ticaret devriminde en ön sırada yerinizi alın.",
    ctaButton: "Mağaza Kaydınızı Hemen Yapın (14 Gün Ücretsiz) 🚀",
    exploreButton: "Platformu Keşfet",
    homeLabel: "🏠 Ana Sayfa",
    freeTrialButton: "14 Gün Ücretsiz Başlat 🚀",
    repeatLabel: "Tekrarla",
    commissionLossText: "%30 Dev Komisyon Kesintisi!",
    totalSales: "Toplam Satış:",
    commissionCut: "Pazar Yeri Komisyonu (%30):",
    netLeft: "Cebinize Kalan Net:",
    lossQuote: "\"Devler sizin emeğinizle besleniyor...\"",
    hbsModel: "HBS %0 KOMİSYON MODELİ",
    salesCommission: "Satış Komisyonu",
    yourProfits: "Kazancınız Sizde",
    fixedLicenseQuote: "Sadece Sabit Lisans, Sınırsız Kazanç!",
    physicalShelf: "🏢 FİZİKSEL DEPO RAFI",
    barcodeSaved: "[ Barkod Kaydedildi! ]",
    googleResults: "Google Arama Sonuçları",
    googleQuote: "Depoya Girdiği Saniye Google Aramalarında En Üstte!",
    liveAutoRepair: "🚗 CANLI OTO TAMİR TAKİBİ",
    frenChange: "🔧 Fren Balata Montajı",
    oilChange: "🛢️ Motor Yağı Değişimi",
    aiTranslation: "💬 YAPAY ZEKA ÇEVİRİSİ",
    modularQuote: "Hizmet, Emlak, Oto Tamir Vitrini & AI Çeviri Köprüsü!",
    hbsHandover: "HBS MARKET DEVİR TESLİM",
    earlyBirdQuote: "Erken Kalkan Yol Alır · SEO Kıdemi Başlar",
    freeTrialGift: "14 Gün Tamamen Ücretsiz",
    noCardNeeded: "Taahhüt yok, kredi kartı gerekmez",
    lossBadge: "Kayıp",
    sec1AdvTitle: "Sıfır Komisyon SaaS Model",
    sec1AdvDesc: "Rakipler %30 alırken HBS sadece sabit bir üyelik bedeli ister. Kârınızın hepsi sizde kalır.",
    sec2AdvTitle: "Depodan Google'a Hızlı SEO",
    sec2AdvDesc: "Ürünlerinizi barkod ile rafa girdiğiniz andan itibaren anında taranabilir meta kodları üretilir.",
    sec3AdvTitle: "Her Sektöre Özel Vitrin",
    sec3AdvDesc: "Sadece ürün satıcıları için değil, emlakçılar, oto tamirciler ve zaman slotu satan kuaförler için mükemmel modüller.",
    autoParts: "Oto Yedek Parça",
    addressLabel: "Adres: RAF-A01-B",
    searchBoxLabel: "Oto Yedek Parça Satın Al",
    seoStoreTitle: "HBS Ferdi Motors - Oto Yedek Parçaları",
    seoStoreDesc: "Rafımızdaki orijinal parçalar anında Google SEO kalitesiyle karşınızda.",
    selectLang: "Anlatım Dili (Voiceover Language):",
    mainTitleText: "Ticaretin Yeni Çağı: Sıfır Komisyon, Sınırsız Özgürlük"
  },
  en: {
    previewBadge: "HBS PROMO VIDEO PREVIEW",
    interactiveTitle: "🎬 Interactive Promo Movie & Voiceover Simulator",
    pageDesc: "Experience HBS Market's commission-free SaaS structure, instant Google search indexing, multi-lingual artificial intelligence translation bridge, and smart storefronts with our 60-second synchronized storyboard player.",
    subtitleLabel: "Voiceover / Subtitle",
    timelineLabel: "🧭 SCENE CONTROLLER (CLICK TO JUMP)",
    scriptLabel: "📖 AD SCRIPT & DETAILED FLOW",
    advantagesLabel: "⭐ HBS ADVANTAGES",
    ctaTitle: "The Earlier You Enter the HBS System, the More You Profit!",
    ctaDesc: "HBS's smart SEO engines reward you the longer you are live in search engines. Register your warehouse now, create your store and take your place at the front of the future e-commerce revolution.",
    ctaButton: "Register Your Store Now (14 Days Free) 🚀",
    exploreButton: "Explore Platform",
    homeLabel: "🏠 Home",
    freeTrialButton: "Start 14 Days Free 🚀",
    repeatLabel: "Replay",
    commissionLossText: "30% Giant Commission Cut!",
    totalSales: "Total Sales:",
    commissionCut: "Marketplace Commission (30%):",
    netLeft: "Net Left in Pocket:",
    lossQuote: "\"Giants feed on your hard work...\"",
    hbsModel: "HBS 0% COMMISSION MODEL",
    salesCommission: "Sales Commission",
    yourProfits: "Your Earnings in Pocket",
    fixedLicenseQuote: "Only Fixed License, Unlimited Profits!",
    physicalShelf: "🏢 PHYSICAL WAREHOUSE SHELF",
    barcodeSaved: "[ Barcode Saved! ]",
    googleResults: "Google Search Results",
    googleQuote: "On Top of Google Search the Second It Enters the Shelf!",
    liveAutoRepair: "🚗 LIVE AUTO REPAIR TRACKING",
    frenChange: "🔧 Brake Pad Fitting",
    oilChange: "🛢️ Motor Oil Replacement",
    aiTranslation: "💬 ARTIFICIAL INTELLIGENCE TRANSLATION",
    modularQuote: "Service, Real Estate, Auto Repair Storefront & AI Translation Bridge!",
    hbsHandover: "HBS MARKET HANDOVER",
    earlyBirdQuote: "Early Bird Catches the Worm · SEO Authority Starts",
    freeTrialGift: "14 Days Completely Free",
    noCardNeeded: "No commitment, no credit card required",
    lossBadge: "Loss",
    sec1AdvTitle: "Zero Commission SaaS Model",
    sec1AdvDesc: "While competitors take 30%, HBS only asks a fixed membership fee. All your profits stay with you.",
    sec2AdvTitle: "Fast SEO from Shelf to Google",
    sec2AdvDesc: "From the moment you enter your products to shelves with barcodes, search-engine friendly meta codes are generated instantly.",
    sec3AdvTitle: "Industry-Specific Storefronts",
    sec3AdvDesc: "Not only for product sellers, but also perfect modules for real estate agents, auto mechanics, and hairdressers.",
    autoParts: "Auto Spare Parts",
    addressLabel: "Address: SHELF-A01-B",
    searchBoxLabel: "Buy Auto Spare Parts",
    seoStoreTitle: "HBS Ferdi Motors - Auto Spare Parts",
    seoStoreDesc: "Original parts on our shelves are instantly in front of you with Google SEO quality.",
    selectLang: "Voiceover Language:",
    mainTitleText: "The New Era of Commerce: Zero Commission, Unlimited Freedom"
  },
  de: {
    previewBadge: "HBS PROMO VIDEO VORSCHAU",
    interactiveTitle: "🎬 Interaktiver Werbefilm- & Synchronisations-Simulator",
    pageDesc: "Erleben Sie die kommissionsfreie SaaS-Struktur von HBS Market, die sofortige Google-Suchindizierung, die mehrsprachige KI-Übersetzung und intelligente Schaufenster mit unserem 60-Sekunden-Synchron-Storyboard-Player.",
    subtitleLabel: "Synchronisation / Untertitel",
    timelineLabel: "🧭 SCENEN-PANEL (ANKLICKEN & SPRINGEN)",
    scriptLabel: "📖 WERBESKRIPT & DETAILFLUSS",
    advantagesLabel: "⭐ HBS VORTEILE",
    ctaTitle: "Je früher Sie in das HBS-System einsteigen, desto mehr profitieren Sie!",
    ctaDesc: "Die intelligenten SEO-Engines von HBS belohnen Sie, je länger Sie in Suchmaschinen aktiv sind. Registrieren Sie jetzt Ihr Lager, erstellen Sie Ihren Shop und sichern Sie sich Ihren Platz an der Spitze der zukünftigen E-Commerce-Revolution.",
    ctaButton: "Registrieren Sie Ihren Shop jetzt (14 Tage kostenlos) 🚀",
    exploreButton: "Plattform erkunden",
    homeLabel: "🏠 Startseite",
    freeTrialButton: "14 Tage kostenlos starten 🚀",
    repeatLabel: "Wiederholen",
    commissionLossText: "30% Riesenprovisionsabzug!",
    totalSales: "Gesamtumsatz:",
    commissionCut: "Marktplatz-Provision (30%):",
    netLeft: "Nettogewinn in der Tasche:",
    lossQuote: "\"Die Giganten ernähren sich von Ihrer harten Arbeit...\"",
    hbsModel: "HBS 0% PROVISIONS-MODELL",
    salesCommission: "Verkaufsprovision",
    yourProfits: "Ihre Gewinne bleiben bei Ihnen",
    fixedLicenseQuote: "Nur feste Lizenz, unbegrenzte Gewinne!",
    physicalShelf: "🏢 PHYSISCHES LAGERREGAL",
    barcodeSaved: "[ Barcode gespeichert! ]",
    googleResults: "Google Suchergebnisse",
    googleQuote: "Ganz oben bei Google in der Sekunde, in der es ins Regal kommt!",
    liveAutoRepair: "🚗 LIVE-VERFOLGUNG DER AUTOREPARATUR",
    frenChange: "🔧 Bremsbelagmontage",
    oilChange: "🛢️ Motorölwechsel",
    aiTranslation: "💬 KÜNSTLICHE INTELLIGENZ ÜBERSETZUNG",
    modularQuote: "Service-, Immobilien-, Autoreparatur-Schaufenster & KI-Übersetzungsbrücke!",
    hbsHandover: "HBS MARKTÜBERGABE",
    earlyBirdQuote: "Der frühe Vogel fängt den Wurm · SEO-Autorität beginnt",
    freeTrialGift: "14 Tage völlig kostenlos",
    noCardNeeded: "Keine Verpflichtung, keine Kreditkarte erforderlich",
    lossBadge: "Verlust",
    sec1AdvTitle: "Null Provision SaaS-Modell",
    sec1AdvDesc: "Während Mitbewerber 30% verlangen, fordert HBS nur einen festen Mitgliedsbeitrag. Alle Ihre Gewinne bleiben bei Ihnen.",
    sec2AdvTitle: "Schnelles SEO vom Regal zu Google",
    sec2AdvDesc: "Ab dem Moment, in dem Sie Ihre Produkte mit Barcodes ins Regal eintragen, werden sofort suchmaschinenfreundliche Metacodes generiert.",
    sec3AdvTitle: "Branchenspezifische Schaufenster",
    sec3AdvDesc: "Nicht nur für Produktverkäufer, sondern auch perfekte Module für Immobilienmakler, Automechaniker und Friseure.",
    autoParts: "Autoersatzteile",
    addressLabel: "Adresse: REGAL-A01-B",
    searchBoxLabel: "Autoersatzteile kaufen",
    seoStoreTitle: "HBS Ferdi Motors - Autoersatzteile",
    seoStoreDesc: "Originalteile in unseren Regalen sind mit Google SEO-Qualität sofort vor Ihnen.",
    selectLang: "Sprache der Sprachausgabe:",
    mainTitleText: "Die neue Ära des Handels: Null Provision, unbegrenzte Freiheit"
  },
  ru: {
    previewBadge: "HBS ПРОМО-ВИДЕО ПРЕВЬЮ",
    interactiveTitle: "🎬 Интерактивный симулятор промо-ролика и озвучки",
    pageDesc: "Оцените бескомпромиссную SaaS-модель HBS Market без комиссии, мгновенную индексацию в Google, многоязычный переводчик с ИИ и интеллектуальные витрины с нашим синхронным плеером.",
    subtitleLabel: "Озвучка / Субтитры",
    timelineLabel: "🧭 ПАНЕЛЬ СЦЕН (НАЖМИ И ПЕРЕЙДИ)",
    scriptLabel: "📖 РЕКЛАМНЫЙ СЦЕНАРИЙ И ПОДРОБНЫЙ ХОД",
    advantagesLabel: "⭐ ПРЕИМУЩЕСТВА HBS",
    ctaTitle: "Чем раньше вы войдете в систему HBS, тем больше получите прибыли!",
    ctaDesc: "Умные SEO-движки HBS вознаждают вас за то, насколько дольше вы присутствуете в поисковых системах. Зарегистрируйте свой склад сейчас, создайте магазин и займите первое место в будущей революции электронной коммерции.",
    ctaButton: "Зарегистрировать магазин сейчас (14 дней бесплатно) 🚀",
    exploreButton: "Исследовать платформу",
    homeLabel: "🏠 Главная",
    freeTrialButton: "Начать 14 дней бесплатно 🚀",
    repeatLabel: "Повторить",
    commissionLossText: "Гигантская комиссия 30%!",
    totalSales: "Всего продаж:",
    commissionCut: "Комиссия маркетплейса (30%):",
    netLeft: "Чистая прибыль в кармане:",
    lossQuote: "\"Гиганты питаются вашим тяжелым трудом...\"",
    hbsModel: "МОДЕЛЬ 0% КОМИССИИ HBS",
    salesCommission: "Комиссия с продаж",
    yourProfits: "Ваш заработок у вас",
    fixedLicenseQuote: "Только фиксированная лицензия, безграничная прибыль!",
    physicalShelf: "🏢 ФИЗИЧЕСКАЯ ПОЛКА НА СКЛАДЕ",
    barcodeSaved: "[ Штрихкод сохранен! ]",
    googleResults: "Результаты поиска Google",
    googleQuote: "В топе Google в ту же секунду, когда товар выкладывается на полку!",
    liveAutoRepair: "🚗 ЖИВОЙ ТРЕКИНГ АВТОРЕМОНТА",
    frenChange: "🔧 Замена тормозных колодок",
    oilChange: "🛢️ Замена моторного масла",
    aiTranslation: "💬 ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТУАЛЬНЫЙ ПЕРЕВОД",
    modularQuote: "Витрины для услуг, недвижимости, авторемонта и AI-переводческий мост!",
    hbsHandover: "ПЕРЕДАЧА HBS MARKET",
    earlyBirdQuote: "Кто рано встает · SEO-авторитет растет",
    freeTrialGift: "14 дней абсолютно бесплатно",
    noCardNeeded: "Без обязательств, кредитная карта не требуется",
    lossBadge: "Убыток",
    sec1AdvTitle: "Модель SaaS с нулевой комиссией",
    sec1AdvDesc: "В то время как конкуренты берут 30%, HBS просит лишь фиксированную плату за подписку. Вся прибыль остается у вас.",
    sec2AdvTitle: "Быстрое SEO от полки до Google",
    sec2AdvDesc: "С момента ввода товаров на полки со штрихкодами мгновенно создаются дружественные к поисковикам метакоды.",
    sec3AdvTitle: "Отраслевые модули витрин",
    sec3AdvDesc: "Не только для продавцов товаров, но и отличные решения для риелторов, автосервисов и салонов красоты.",
    autoParts: "Автозапчасти",
    addressLabel: "Адрес: ПОЛКА-A01-B",
    searchBoxLabel: "Купить автозапчасти",
    seoStoreTitle: "HBS Ferdi Motors - Автозапчасти",
    seoStoreDesc: "Оригинальные детали на наших полках сразу перед вами с качеством Google SEO.",
    selectLang: "Язык озвучки:",
    mainTitleText: "Новая эра торговли: Ноль комиссии, безграничная свобода"
  },
  ka: {
    previewBadge: "HBS პრომო ვიდეოს წინასწარი ნახვა",
    interactiveTitle: "🎬 პრომო ფილმისა და გახმოვანების ინტერაქტიული სიმულატორი",
    pageDesc: "გამოსცადეთ HBS Market-ის უსაკომისიო SaaS სტრუქტურა, მყისიერი Google-ის ძიების ინდექსაცია, ხელოვნური ინტელექტის მრავალენოვანი თარგმანის ხიდი და ჭკვიანი ვიტრინები ჩვენს 60-წამიან სინქრონულ ფლეიერში.",
    subtitleLabel: "გახმოვანება / სუბტიტრები",
    timelineLabel: "🧭 სცენების პანელი (დააჭირე & გადადი)",
    scriptLabel: "📖 სარეკლამო სცენარი და დეტალური მსვლელობა",
    advantagesLabel: "⭐ HBS-ის უპირატესობები",
    ctaTitle: "რაც უფრო ადრე შეხვალთ HBS სისტემაში, მით მეტ მოგებას მიიღებთ!",
    ctaDesc: "HBS-ის ჭკვიანი SEO ძრავები გაჯილდოებთ იმის მიხედვით, თუ რამდენად დიდხანს ხართ საძიებო სისტემებში. დაარეგისტრირეთ თქვენი საწყობი ახლავე, შექმენით მაღაზია და დაიკავეთ წამყვანი ადგილი მომავლის ელექტრონულ კომერციაში.",
    ctaButton: "დაარეგისტრირეთ მაღაზია ახლავე (14 დღე უფასო) 🚀",
    exploreButton: "პლატფორმის შესწავლა",
    homeLabel: "🏠 მთავარი",
    freeTrialButton: "დაიწყე 14 დღე უფასოდ 🚀",
    repeatLabel: "გამეორება",
    commissionLossText: "30%-იანი გიგანტური საკომისიო გადასახადი!",
    totalSales: "მთლიანი გაყიდვები:",
    commissionCut: "პლატფორმის საკომისიო (30%):",
    netLeft: "ჯიბეში დარჩენილი წმინდა მოგება:",
    lossQuote: "\"გიგანტები თქვენი შრომით იკვებებიან...\"",
    hbsModel: "HBS-ის 0%-იანი საკომისიო მოდელი",
    salesCommission: "გაყიდვების საკომისიო",
    yourProfits: "თქვენი მოგება თქვენთან რჩება",
    fixedLicenseQuote: "მხოლოდ ფიქსირებული ლიცენზია, შეუზღუდავი მოგება!",
    physicalShelf: "🏢 ფიზიკური თარო საწყობში",
    barcodeSaved: "[ ბარკოდი შენახულია! ]",
    googleResults: "Google-ის ძიების შედეგები",
    googleQuote: "Google-ის ძიების სათავეში თაროზე განთავსებისთანავე!",
    liveAutoRepair: "🚗 ავტოშეკეთების ცოცხალი მონიტორინგი",
    frenChange: "🔧 სამუხრუჭე ხუნდების შეცვლა",
    oilChange: "🛢️ ძრავის ზეთის შეცვლა",
    aiTranslation: "💬 ხელოვნური ინტელექტის თარგმანი",
    modularQuote: "მომსახურების, უძრავი ქონების, ავტოშეკეთების ვიტრინა და AI სავაჭრო ხიდი!",
    hbsHandover: "HBS ბაზრის გადაცემა",
    earlyBirdQuote: "ვინც ადრე იწყებს · SEO ავტორიტეტი იზრდება",
    freeTrialGift: "14 დღე სრულიად უფასოდ",
    noCardNeeded: "ვალდებულებების გარეშე, საკრედიტო ბარათი არ არის საჭირო",
    lossBadge: "დანაკარგი",
    sec1AdvTitle: "ნულოვანი საკომისიო SaaS მოდელი",
    sec1AdvDesc: "სანამ კონკურენტები 30%-ს ითხოვენ, HBS მხოლოდ ფიქსირებულ საწევროს ითხოვს. მთელი მოგება თქვენთან რჩება.",
    sec2AdvTitle: "სწრაფი SEO თაროდან Google-ში",
    sec2AdvDesc: "პროდუქტების თაროებზე ბარკოდით შეყვანისთანავე, საძიებო სისტემებისთვის ხელსაყრელი მეტა კოდები მყისიერად გენერირდება.",
    sec3AdvTitle: "დარგობრივი სპეციფიკური ვიტრინები",
    sec3AdvDesc: "არა მხოლოდ ნივთების გამყიდველთათვის, არამედ იდეალური მოდულები რიელტორებისთვის, ავტომექანიკოსებისა და სალონებისთვის.",
    autoParts: "ავტონაწილები",
    addressLabel: "მისამართი: თარო-A01-B",
    searchBoxLabel: "ავტონაწილების ყიდვა",
    seoStoreTitle: "HBS Ferdi Motors - ავტონაწილები",
    seoStoreDesc: "ორიგინალი ნაწილები ჩვენს თაროებზე მყისიერად თქვენს წინაშეა Google SEO ხარისხით.",
    selectLang: "გახმოვანების ენა:",
    mainTitleText: "ვაჭრობის ახალი ეპოქა: ნულოვანი საკომისიო, შეუზღუდავი თავისუფლება"
  }
};

const languages: { code: LanguageCode; label: string; flag: string }[] = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ka", label: "ქართული", flag: "🇬🇪" }
];

export default function PromoVideoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [presentationLang, setPresentationLang] = useState<LanguageCode>("tr");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load language preference from local storage if available
  useEffect(() => {
    const saved = window.localStorage.getItem("hbs-language");
    if (saved && (saved === "tr" || saved === "en" || saved === "de" || saved === "ru" || saved === "ka")) {
      setPresentationLang(saved as LanguageCode);
    }
  }, []);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 60;
          }
          return Math.min(60, prev + 0.25 * speed);
        });
      }, 250);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed]);

  const activeScene = scenes.find((s) => time >= s.start && time < s.end) || scenes[scenes.length - 1];

  const handlePlayPause = () => {
    if (time >= 60) {
      setTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSceneClick = (startTime: number) => {
    setTime(startTime);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPercent = (time / 60) * 100;
  const t = uiTexts[presentationLang];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Cinematic Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-black tracking-tight text-blue-500 hover:text-blue-400 transition">
              HBS <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-blue-950 border border-blue-800 ml-1">SaaS PRO</span>
            </Link>
          </div>
          
          {/* Quick Lang Switcher for Presentation */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden lg:inline text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">{t.selectLang}</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-full">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setPresentationLang(lang.code)}
                  className={`px-2.5 py-1 text-[11px] font-black rounded-full transition-all flex items-center gap-1 ${presentationLang === lang.code ? "bg-blue-600 text-white shadow-md scale-105" : "text-slate-400 hover:text-slate-200"}`}
                  title={lang.label}
                >
                  <span>{lang.flag}</span>
                  <span className="hidden md:inline">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:inline-flex text-xs font-semibold text-slate-400 hover:text-slate-200 transition">
              {t.homeLabel}
            </Link>
            <Link
              href="/store-register"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg transition active:scale-95 shrink-0"
            >
              {t.freeTrialButton}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Intro */}
      <section className="relative px-4 py-8 max-w-7xl mx-auto w-full text-center">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black tracking-wider uppercase bg-blue-950/60 border border-blue-800/50 text-blue-400 mb-3 animate-pulse">
          {t.interactiveTitle}
        </span>
        <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight leading-tight">
          {t.mainTitleText}
        </h1>
        <p className="mt-3 text-xs md:text-sm text-slate-400 max-w-3xl mx-auto font-medium">
          {t.pageDesc}
        </p>
      </section>

      {/* Main Interactive Stage */}
      <section className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        
        {/* Left 2 Columns: Video Player */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative rounded-3xl border border-slate-800 bg-slate-950 shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-hidden aspect-video flex flex-col justify-between group">
            
            {/* Visual Screen based on Active Scene */}
            <div className={`absolute inset-0 bg-gradient-to-b ${activeScene.color} transition-all duration-700 -z-10`} />

            {/* Video Watermark */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              <span>{t.previewBadge}</span>
            </div>

            {/* Dynamic Stage Graphics based on Active Scene */}
            <div className="flex-1 flex items-center justify-center p-6 select-none relative overflow-hidden">
              
              {/* Scene 1 Visuals */}
              {activeScene.id === 1 && (
                <div className="text-center animate-fade-in flex flex-col items-center max-w-md w-full">
                  <div className="text-6xl mb-3 animate-bounce">💸</div>
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl text-xs font-black mb-2 tracking-wide uppercase">
                    {t.commissionLossText}
                  </div>
                  <div className="w-full bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 relative">
                    <div className="absolute top-2 right-2 bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase">{t.lossBadge}</div>
                    <div className="text-left space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400"><span>{t.totalSales}</span> <span className="text-slate-200">10,000 GEL</span></div>
                      <div className="flex justify-between text-[11px] font-bold text-red-400"><span>{t.commissionCut}</span> <span>-3,000 GEL</span></div>
                      <div className="border-t border-slate-800 my-1"></div>
                      <div className="flex justify-between text-xs font-black text-slate-200"><span>{t.netLeft}</span> <span className="text-red-500">7,000 GEL</span></div>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-400 font-bold italic">{t.lossQuote}</p>
                </div>
              )}

              {/* Scene 2 Visuals */}
              {activeScene.id === 2 && (
                <div className="text-center animate-fade-in flex flex-col items-center max-w-md w-full">
                  <div className="text-6xl mb-3">🛡️</div>
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-black mb-3 tracking-wide uppercase">
                    {t.hbsModel}
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-slate-900/80 rounded-2xl p-3 border border-blue-800/40 relative">
                      <div className="absolute -top-2 left-2 bg-blue-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase">HBS</div>
                      <div className="text-2xl font-black text-blue-400">%0</div>
                      <p className="text-[10px] text-slate-400 font-bold">{t.salesCommission}</p>
                    </div>
                    <div className="bg-slate-900/80 rounded-2xl p-3 border border-emerald-800/40 relative">
                      <div className="absolute -top-2 left-2 bg-emerald-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase">Kâr</div>
                      <div className="text-2xl font-black text-emerald-400">%100</div>
                      <p className="text-[10px] text-slate-400 font-bold">{t.yourProfits}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] text-slate-300 font-black">{t.fixedLicenseQuote}</p>
                </div>
              )}

              {/* Scene 3 Visuals */}
              {activeScene.id === 3 && (
                <div className="text-center animate-fade-in flex flex-col items-center w-full max-w-lg">
                  <div className="text-6xl mb-3">⚡</div>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Shelf to Scan */}
                    <div className="bg-slate-900/85 p-3 rounded-2xl border border-slate-800 text-left">
                      <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">{t.physicalShelf}</div>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="text-lg">📦</span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-300 truncate">{t.autoParts}</p>
                          <p className="text-[8px] text-slate-500 font-extrabold">{t.addressLabel}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-[8px] text-slate-400 bg-slate-950 p-1.5 rounded-lg text-center font-bold font-mono">
                        {t.barcodeSaved}
                      </div>
                    </div>
                    {/* Instant Google Results */}
                    <div className="bg-white p-3 rounded-2xl text-left text-slate-900 shadow-xl relative overflow-hidden">
                      <div className="text-[8px] font-black text-slate-400 mb-1">{t.googleResults}</div>
                      <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-0.5 text-[8px] font-semibold text-slate-700 bg-slate-50">
                        <span>🔍</span>
                        <span>{t.searchBoxLabel}</span>
                      </div>
                      <div className="mt-2 border-t border-slate-100 pt-2 space-y-1.5">
                        <div className="min-w-0">
                          <span className="text-[9px] font-black text-blue-700 hover:underline block leading-tight">{t.seoStoreTitle}</span>
                          <span className="text-[8px] text-emerald-700 block">https://hbsmarket.com/store/obdtr</span>
                          <span className="text-[8px] text-slate-500 block leading-tight">{t.seoStoreDesc}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3.5 text-[11px] text-slate-300 font-black">{t.googleQuote}</p>
                </div>
              )}

              {/* Scene 4 Visuals */}
              {activeScene.id === 4 && (
                <div className="text-center animate-fade-in flex flex-col items-center w-full max-w-lg">
                  <div className="text-5xl mb-2">🎯</div>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Sector switcher preview */}
                    <div className="bg-slate-900/85 p-3 rounded-2xl border border-slate-800 text-left">
                      <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">{t.liveAutoRepair}</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-300 bg-slate-950 p-1 px-2 rounded">
                          <span>{t.frenChange}</span>
                          <span className="text-yellow-500 font-black">%60</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-300 bg-slate-950 p-1 px-2 rounded">
                          <span>{t.oilChange}</span>
                          <span className="text-emerald-500 font-black">%100</span>
                        </div>
                      </div>
                    </div>
                    {/* Multilingual translation preview */}
                    <div className="bg-slate-900/85 p-3 rounded-2xl border border-slate-800 text-left">
                      <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">{t.aiTranslation}</div>
                      <div className="space-y-2">
                        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                          <span className="text-[8px] bg-slate-800 text-slate-300 px-1 rounded font-extrabold mr-1">KA</span>
                          <span className="text-[9px] text-slate-300 italic">ამ პროდუქტის ფასი რა არის?</span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-xl border border-blue-900/40">
                          <span className="text-[8px] bg-blue-900 text-blue-200 px-1 rounded font-extrabold mr-1">TR</span>
                          <span className="text-[9px] text-blue-300 font-bold">Bu ürünün fiyatı nedir?</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-300 font-black">{t.modularQuote}</p>
                </div>
              )}

              {/* Scene 5 Visuals */}
              {activeScene.id === 5 && (
                <div className="text-center animate-fade-in flex flex-col items-center max-w-md w-full">
                  <div className="text-6xl mb-3 animate-pulse">🚀</div>
                  <div className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">{t.hbsHandover}</div>
                  <p className="text-[11px] text-slate-400 mt-1 font-bold">{t.earlyBirdQuote}</p>
                  <div className="mt-4 bg-slate-900/80 rounded-2xl p-3 px-6 border border-violet-800/40 flex items-center gap-3 w-full justify-center">
                    <span className="text-xl">🎁</span>
                    <div className="text-left">
                      <p className="text-xs font-black text-slate-100">{t.freeTrialGift}</p>
                      <p className="text-[9px] text-slate-500 font-bold">{t.noCardNeeded}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Video Controls & Subtitle Deck */}
            <div className="bg-slate-950/90 border-t border-slate-900 p-4 space-y-3 z-20">
              
              {/* Dynamic Animated Subtitle Track */}
              <div className="bg-black/60 border border-slate-900 rounded-2xl p-3 text-center min-h-[4.5rem] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-1 left-2 text-[8px] text-slate-500 font-black uppercase tracking-wider">{t.subtitleLabel}</div>
                {/* Rhythmic Soundwave Visualizer if Playing */}
                {isPlaying && (
                  <div className="absolute right-3 top-2.5 flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-blue-500 rounded-full animate-bounce h-2" style={{ animationDelay: "0.1s" }} />
                    <span className="w-0.5 bg-blue-500 rounded-full animate-bounce h-3" style={{ animationDelay: "0.3s" }} />
                    <span className="w-0.5 bg-blue-500 rounded-full animate-bounce h-1" style={{ animationDelay: "0.2s" }} />
                    <span className="w-0.5 bg-blue-500 rounded-full animate-bounce h-2" style={{ animationDelay: "0.4s" }} />
                  </div>
                )}
                <p className="text-xs md:text-sm font-semibold text-slate-200 leading-relaxed px-4">
                  "{activeScene.voiceover[presentationLang]}"
                </p>
              </div>

              {/* Progress Bar & Slider */}
              <div className="space-y-1.5">
                <div className="relative flex items-center h-2 group/slider">
                  {/* Track Background */}
                  <div className="absolute inset-0 bg-slate-800 rounded-full" />
                  {/* Active Highlight Track */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {/* Invisible Actual Input Slider for Scrubbing */}
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="0.5"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-30"
                  />
                  {/* Custom Glow Thumb */}
                  <div
                    className="absolute w-3.5 h-3.5 bg-white border border-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] -translate-x-1/2 pointer-events-none z-20 transition-all group-hover/slider:scale-125"
                    style={{ left: `${progressPercent}%` }}
                  />
                </div>

                {/* Counter & Media Controls Row */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-1">
                  
                  {/* Play/Pause & Scrub Info */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-2 h-8 w-8 flex items-center justify-center transition active:scale-90"
                      title={isPlaying ? "Durdur" : "Oynat"}
                    >
                      {isPlaying ? "⏸" : "▶"}
                    </button>
                    <button
                      onClick={() => setTime(0)}
                      className="hover:text-slate-200 transition text-[11px] flex items-center gap-1"
                      title={t.repeatLabel}
                    >
                      🔄 <span>{t.repeatLabel}</span>
                    </button>
                    <span className="font-mono text-[11px]">
                      {formatTime(time)} / 01:00
                    </span>
                  </div>

                  {/* Scene Title in Controls */}
                  <div className="hidden md:inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                    <span>{activeScene.icon}</span>
                    <span className="text-slate-200">{activeScene.badge[presentationLang]}</span>
                  </div>

                  {/* Playback Speed & Sound Mute Toggle */}
                  <div className="flex items-center gap-2.5">
                    {/* Mute Simulation */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`hover:text-slate-200 transition p-1.5 rounded-lg border ${isMuted ? "border-red-800/40 text-red-400 bg-red-950/20" : "border-slate-800 text-slate-400"}`}
                      title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
                    >
                      {isMuted ? "🔇" : "🔊"}
                    </button>

                    {/* Speed Switcher */}
                    <div className="flex border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
                      {[1, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSpeed(s)}
                          className={`px-2 py-1 text-[10px] font-black transition ${speed === s ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"}`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Quick Scene Jumper Grid */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-3xl space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              {t.timelineLabel}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {scenes.map((s) => {
                const isSelected = activeScene.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSceneClick(s.start)}
                    className={`p-2 rounded-2xl border text-left flex flex-col justify-between transition-all ${isSelected ? "border-blue-500 bg-blue-950/40 shadow-[0_0_12px_rgba(59,130,246,0.15)] text-blue-200" : "border-slate-800/80 bg-slate-900/30 text-slate-400 hover:border-slate-700 hover:text-slate-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-[8px] font-mono text-slate-500">{formatTime(s.start)}</span>
                    </div>
                    <span className="text-[10px] font-extrabold mt-1 truncate block leading-tight">{s.badge[presentationLang]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Interactive Script & USPs */}
        <div className="flex flex-col gap-6">
          
          {/* Active Scene Cards Checklist */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-3xl space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              {t.scriptLabel}
            </h3>
            
            <div className="space-y-2.5 max-h-[26rem] overflow-y-auto pr-1">
              {scenes.map((s) => {
                const isActive = activeScene.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSceneClick(s.start)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all duration-300 ${isActive ? "border-blue-500 bg-gradient-to-r from-blue-950/50 to-slate-950/50 text-slate-100 shadow-md" : "border-slate-850 bg-slate-900/10 text-slate-400 hover:border-slate-700 hover:bg-slate-900/20"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                        SAHNE {s.id} ({formatTime(s.start)} - {formatTime(s.end)})
                      </span>
                    </div>
                    <h4 className="text-[11px] font-black text-slate-200 mt-1 leading-snug">
                      {s.title[presentationLang]}
                    </h4>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">
                      {s.subtitle[presentationLang]}
                    </p>
                    {isActive && (
                      <p className="text-[10px] font-bold text-blue-400 mt-2 bg-blue-950/80 p-2 rounded-xl border border-blue-900/30">
                        🗣️ {s.voiceover[presentationLang]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Advantages / USPs */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-3xl space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              {t.advantagesLabel}
            </h3>
            <ul className="space-y-2 text-[10px] md:text-[11px]">
              <li className="flex gap-2 p-2 bg-slate-900/35 border border-slate-850 rounded-xl">
                <span className="text-blue-500 font-extrabold text-sm">✓</span>
                <div>
                  <strong className="text-slate-200 block">{t.sec1AdvTitle}</strong>
                  {t.sec1AdvDesc}
                </div>
              </li>
              <li className="flex gap-2 p-2 bg-slate-900/35 border border-slate-850 rounded-xl">
                <span className="text-blue-500 font-extrabold text-sm">✓</span>
                <div>
                  <strong className="text-slate-200 block">{t.sec2AdvTitle}</strong>
                  {t.sec2AdvDesc}
                </div>
              </li>
              <li className="flex gap-2 p-2 bg-slate-900/35 border border-slate-850 rounded-xl">
                <span className="text-blue-500 font-extrabold text-sm">✓</span>
                <div>
                  <strong className="text-slate-200 block">{t.sec3AdvTitle}</strong>
                  {t.sec3AdvDesc}
                </div>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* Global Call To Action (Early Bird) */}
      <section className="bg-gradient-to-b from-[#0b0f19] to-slate-950 border-t border-slate-850 px-4 py-12 text-center w-full">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
            {t.ctaTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.ctaDesc}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/store-register"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition duration-200 active:scale-95 text-center"
            >
              {t.ctaButton}
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-xs font-bold text-slate-300 transition text-center"
            >
              {t.exploreButton}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
