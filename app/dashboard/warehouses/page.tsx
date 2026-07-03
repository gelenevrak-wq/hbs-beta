"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import CompactLanguageSwitcher, { LanguageCode, isLanguageCode } from "@/components/language/CompactLanguageSwitcher";

type CorridorConfig = {
  zone: string;
  depth: number;
  tiers: number;
};

type Warehouse = {
  id: string;
  name: string;
  purpose: string;
  customerVisible: boolean;
  city: string;
  zones: string[];
  capacity: number;
  used: number;
  shelves?: string[];
};

type ProductRecord = {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  salePrice: string;
  purchasePrice: string;
  barcode: string;
  sku: string;
  oemCode: string;
  quantity: string;
  warehouse: string;
  shelf: string;
  variants?: any[];
};

type StockMovement = {
  id: string;
  productName: string;
  productCode: string;
  movementType: string;
  quantity: number;
  warehouse: string;
  shelf: string;
  note: string;
  createdAt: string;
};

const translations = {
  tr: {
    header: "📦 HBS Akıllı Depo Yönetimi",
    runWizard: "🧙 Sihirbazı Çalıştır",
    stockMovements: "Stok Hareketleri",
    dashboard: "Kontrol Paneli",
    wizardTitle: "Depolarınızı Hızla Oluşturun",
    wizardTitleSmall: "KOLAY DEPO SİHİRBAZI 🧙",
    wizardDesc: "Kaç adet deponuz olduğunu belirtin. Depoları isimlendirmek ve numaralandırmak çok basittir.",
    wizardCountLabel: "Kaç Adet Deponuz Var?",
    wizardPlaceholder: "Depo {num} İsmi (Örn: Merkez Depo)",
    cancel: "İptal",
    saveDepots: "Depoları Kaydet & Kur",
    setupZones: "Bölgeleri & Rafları Şekillendir",
    setupZonesDesc: "Seçili depoya bölgeleri (A, B, C...) girin ve her bölgedeki raf derinliğini seçin. Karekod barkodları otomatik üretilecektir.",
    zones: "Depo Bölgeleri (Virgülle Ayırın)",
    shelfDepth: "Bölge Başına Raf Derinliği",
    shelvesUnit: "raf",
    generateLayout: "Yerleşimi Oluştur & Kaydet",
    placementTitle: "Hızlı Ürün Konumlandırma (Form)",
    placementDesc: "Barkod tarayıcı ile veya elle seçtiğiniz ürünü bir rafa yerleştirip miktarını güncelleyin.",
    selectProduct: "Ürün Seçin",
    targetShelf: "Hedef Raf Konumu",
    qty: "Miktar",
    placementNote: "Yerleşim Notu",
    activeWarehousesLabel: "Aktif Depolarınız (Tıklayarak Seçin)",
    badgeSelected: "SEÇİLİ",
    badgePassive: "PASİF",
    definedProducts: "tanımlı ürün",
    shelfPositions: "raf konumu",
    layoutShaperTitle: "KORİDOR & RAF ŞEKİLLENDİRİCİ 📐",
    layoutShaperHeader: "Yerleşimini Şekillendir",
    layoutShaperDesc: "Deponuzun bölgelerini (koridor) ve her bölgedeki dikey raf adetlerini görsel olarak belirleyin. Sistem tüm raf etiket kodlarını otomatik oluşturur.",
    zonesCorridors: "Bölgeler / Koridor Harfleri",
    zonesExample: "Örn: A, B, C, D",
    zonesHelp: "Virgülle ayırın. Her harf bir koridoru temsil eder.",
    verticalDepth: "Dikey Raf Derinliği",
    verticalDepthHelp: "Her koridordaki kat/raf sayısı (Örn: A-01'den A-04'e).",
    generateLayoutBtn: "⚡ Raf Düzenini ve Etiketlerini Otomatik Oluştur",
    lockLocationTitle: "ÜRÜN LOKASYON KİLİTLEME 🔒",
    lockLocationHeader: "Ürünü Rafa Yerleştir",
    lockLocationDesc: "Katalogdaki ürünü seçin ve deponuzda kayıtlı olan raf adresine miktar belirterek güvenle kilitleyin.",
    selectFromCatalog: "Katalogdan Ürün Seçin",
    selectProductOption: "-- Ürün seçin --",
    onlyDefinedShelves: "Sadece Tanımlı Raflar",
    selectShelfOption: "-- Raf seçin --",
    placeQtyLabel: "Yerleştirilecek Adet (Miktar)",
    purchaseCost: "Maliyet (Alış)",
    salePrice: "Satış Fiyatı",
    processNote: "Depo İşlem Notu",
    processNotePlaceholder: "Örn: Koridor A yerleşimi tamamlandı",
    lockProductBtn: "🔒 Ürünü Rafa Kilitle & Stok Güncelle",
    liveScannerTitle: "RAF GEZİNTİSİ & MOBİL OKUTUCU 📷",
    scanShelfLabel: "Raf Etiketi Okut",
    openCameraBtn: "📷 Kamerayı Aç (Tara)",
    manualCodePlaceholder: "Lokasyon kodu girin veya simüle edin (Örn: A-01)",
    simulateBtn: "Simüle Et",
    scannedStatus: "TARANAN RAFTAKİ DURUM",
    printShelfLabelBtn: "🖨️ Raf Etiketi Yazdır",
    closeBtn: "Kapat",
    currentProducts: "Mevcut Ürünler",
    noProductsOnShelf: "Bu rafta ürün bulunmamaktadır.",
    movementsHistory: "Raf Hareket Kayıtları (Tarihçe)",
    noMovements: "Bu konuma ait geçmiş depo hareketi yok.",
    printCenterTitle: "RAF ETİKET SORGULAMA VE BASIM MERKEZİ 🖨️",
    matrixHeader: "Depo Raf Matrisi",
    matrixDesc: "Depoda tanımlı tüm raf kodlarını inceleyin ve yazdırmak istediğiniz rafın etiketini tek tıkla A4/Barkod boyutlarında hazırlayın.",
    searchInventoryPlaceholder: "İçerideki envanteri ara (Ürün adı, SKU veya Raf)",
    badgeFull: "dolu",
    badgeEmpty: "boş",
    inspectBtn: "İncele",
    printBtn: "Bas 🖨️",
    noShelvesDefined: "Raf tanımlanmamış. Lütfen yukarıdaki şekillendiriciyi kullanın.",
    warehouseInventory: "Depo Envanteri",
    itemsUnit: "Kalem",
    colProductSku: "Ürün / SKU",
    colShelf: "Raf",
    colQty: "Adet",
    colSalePrice: "Fiyat (Satış)",
    colLabel: "Etiket",
    printClose: "Kapat",
    liveReaderPlaceholder: "Manuel raf girin (Örn: A-01, B-02)",
    scannerTitle: "DEPO BARKOD / KAREKOD TARAYICI",
    liveShelfScan: "Canlı Raf Tarama"
  },
  en: {
    header: "📦 HBS Smart Warehouse Management",
    runWizard: "🧙 Run Setup Wizard",
    stockMovements: "Stock Movements",
    dashboard: "Dashboard",
    wizardTitle: "Create Your Warehouses Quickly",
    wizardTitleSmall: "EASY WAREHOUSE WIZARD 🧙",
    wizardDesc: "Specify how many warehouses you have. Naming and numbering warehouses is very simple.",
    wizardCountLabel: "How Many Warehouses Do You Have?",
    wizardPlaceholder: "Warehouse {num} Name (e.g., Central Warehouse)",
    cancel: "Cancel",
    saveDepots: "Save & Setup Warehouses",
    setupZones: "Shaping Zones & Shelves",
    setupZonesDesc: "Enter zones (A, B, C...) for the selected warehouse and choose shelf depth. Barcode/QR labels will be automatically generated.",
    zones: "Warehouse Zones (Comma Separated)",
    shelfDepth: "Shelf Depth Per Zone",
    shelvesUnit: "shelves",
    generateLayout: "Create & Save Layout",
    placementTitle: "Quick Product Placement (Form)",
    placementDesc: "Place selected product on a shelf and update its quantity using barcode scanner or manually.",
    selectProduct: "Select Product",
    targetShelf: "Target Shelf Location",
    qty: "Quantity",
    placementNote: "Placement Note",
    activeWarehousesLabel: "Your Active Warehouses (Click to Select)",
    badgeSelected: "SELECTED",
    badgePassive: "INACTIVE",
    definedProducts: "defined items",
    shelfPositions: "shelf positions",
    layoutShaperTitle: "CORRIDOR & SHELF SHAPER 📐",
    layoutShaperHeader: "Configure Layout",
    layoutShaperDesc: "Visually specify zones (corridors) and vertical shelf counts. The system generates all shelf label codes automatically.",
    zonesCorridors: "Zones / Corridor Letters",
    zonesExample: "e.g., A, B, C, D",
    zonesHelp: "Separate with commas. Each letter represents a corridor.",
    verticalDepth: "Vertical Shelf Depth",
    verticalDepthHelp: "Number of tiers/shelves per corridor (e.g., A-01 to A-04).",
    generateLayoutBtn: "⚡ Generate Shelf Layout & Labels",
    lockLocationTitle: "PRODUCT LOCATION LOCKING 🔒",
    lockLocationHeader: "Place Product on Shelf",
    lockLocationDesc: "Select a product from catalog and lock it onto a shelf position with quantity.",
    selectFromCatalog: "Select Product from Catalog",
    selectProductOption: "-- Select product --",
    onlyDefinedShelves: "Only Defined Shelves",
    selectShelfOption: "-- Select shelf --",
    placeQtyLabel: "Quantity to Place",
    purchaseCost: "Cost (Purchase)",
    salePrice: "Sale Price",
    processNote: "Warehouse Log Note",
    processNotePlaceholder: "e.g., Corridor A placement completed",
    lockProductBtn: "🔒 Lock Product on Shelf & Update Stock",
    liveScannerTitle: "SHELF NAVIGATION & MOBILE SCANNER 📷",
    scanShelfLabel: "Scan Shelf Label",
    openCameraBtn: "📷 Open Camera (Scan)",
    manualCodePlaceholder: "Enter location code or simulate (e.g., A-01)",
    simulateBtn: "Simulate",
    scannedStatus: "SCANNED SHELF STATUS",
    printShelfLabelBtn: "🖨️ Print Shelf Label",
    closeBtn: "Close",
    currentProducts: "Current Products",
    noProductsOnShelf: "No products found on this shelf.",
    movementsHistory: "Shelf Movements History Log",
    noMovements: "No historical stock movement log for this location.",
    printCenterTitle: "SHELF LABEL SEARCH & PRINTING CENTER 🖨️",
    matrixHeader: "Warehouse Shelf Matrix",
    matrixDesc: "Inspect all defined shelf codes and prepare tags in A4/Barcode sizes with one click.",
    searchInventoryPlaceholder: "Search active inventory (Product name, SKU or Shelf)",
    badgeFull: "occupied",
    badgeEmpty: "empty",
    inspectBtn: "Inspect",
    printBtn: "Print 🖨️",
    noShelvesDefined: "No shelves defined. Please use the shaper above.",
    warehouseInventory: "Warehouse Inventory",
    itemsUnit: "Items",
    colProductSku: "Product / SKU",
    colShelf: "Shelf",
    colQty: "Qty",
    colSalePrice: "Price (Sale)",
    colLabel: "Label",
    printClose: "Close",
    liveReaderPlaceholder: "Enter manual shelf code (e.g., A-01, B-02)",
    scannerTitle: "WAREHOUSE BARCODE / QR SCANNER",
    liveShelfScan: "Live Shelf Scan"
  },
  de: {
    header: "📦 HBS Intelligentes Lagerverwaltungs-System",
    runWizard: "🧙 Einrichtungsassistenten ausführen",
    stockMovements: "Lagerbewegungen",
    dashboard: "Dashboard",
    wizardTitle: "Erstellen Sie Ihre Lager schnell",
    wizardTitleSmall: "EINFACHER LAGER-ASSISTENT 🧙",
    wizardDesc: "Geben Sie an, wie viele Lager Sie haben. Das Benennen und Nummerieren von Lagern ist sehr einfach.",
    wizardCountLabel: "Wie viele Lager haben Sie?",
    wizardPlaceholder: "Lager {num} Name (z. B. Zentrallager)",
    cancel: "Abbrechen",
    saveDepots: "Lager Speichern & Einrichten",
    setupZones: "Zonen & Regale gestalten",
    setupZonesDesc: "Geben Sie Zonen (A, B, C...) für das ausgewählte Lager ein und wählen Sie die Regaltiefe.",
    zones: "Lagerzonen (kommagetrennt)",
    shelfDepth: "Regaltiefe pro Zone",
    shelvesUnit: "Regale",
    generateLayout: "Layout erstellen & speichern",
    placementTitle: "Schnelle Produktplatzierung",
    placementDesc: "Platzieren Sie das ausgewählte Produkt in ein Regal und aktualisieren Sie die Menge.",
    selectProduct: "Produkt auswählen",
    targetShelf: "Zielregal-Position",
    qty: "Menge",
    placementNote: "Platzierungshinweis",
    activeWarehousesLabel: "Ihre aktiven Lager (Zum Auswählen klicken)",
    badgeSelected: "AUSGEWÄHLT",
    badgePassive: "INAKTIV",
    definedProducts: "definierte Produkte",
    shelfPositions: "Regalpositionen",
    layoutShaperTitle: "KORİDOR & REGAL-GESTALTER 📐",
    layoutShaperHeader: "Layout konfigurieren",
    layoutShaperDesc: "Geben Sie Zonen und Regaltiefen an. Das System generiert alle Regaletiketten-Codes automatisch.",
    zonesCorridors: "Zonen / Korridorbuchstaben",
    zonesExample: "z.B. A, B, C, D",
    zonesHelp: "Mit Kommas trennen. Jeder Buchstabe steht für einen Korridor.",
    verticalDepth: "Vertikale Regaltiefe",
    verticalDepthHelp: "Anzahl der Regalebene pro Korridor (z. B. A-01 bis A-04).",
    generateLayoutBtn: "⚡ Regallayout & Etiketten generieren",
    lockLocationTitle: "PRODUKTLOKALISIERUNG SPERREN 🔒",
    lockLocationHeader: "Produkt auf Regal platzieren",
    lockLocationDesc: "Wählen Sie ein Produkt aus dem Katalog und sperren Sie es mit Menge auf einer Regalposition.",
    selectFromCatalog: "Produkt aus Katalog wählen",
    selectProductOption: "-- Produkt wählen --",
    onlyDefinedShelves: "Nur definierte Regale",
    selectShelfOption: "-- Regal wählen --",
    placeQtyLabel: "Menge zum Platzieren",
    purchaseCost: "Kosten (Einkauf)",
    salePrice: "Verkaufspreis",
    processNote: "Lagereintrag-Notiz",
    processNotePlaceholder: "z.B. Korridor A Platzierung abgeschlossen",
    lockProductBtn: "🔒 Produkt im Regal sperren & Lager aktualisieren",
    liveScannerTitle: "REGALNAVIGATION & MOBILER SCANNER 📷",
    scanShelfLabel: "Regaletikett scannen",
    openCameraBtn: "📷 Kamera öffnen (Scannen)",
    manualCodePlaceholder: "Regalcode eingeben oder simulieren (z.B. A-01)",
    simulateBtn: "Simulieren",
    scannedStatus: "GESCANNTER REGALSTATUS",
    printShelfLabelBtn: "🖨️ Regaletikett drucken",
    closeBtn: "Schließen",
    currentProducts: "Aktuelle Produkte",
    noProductsOnShelf: "Keine Produkte auf diesem Regal gefunden.",
    movementsHistory: "Regalbewegungen Historie",
    noMovements: "Keine Lagerbewegungshistorie für diesen Standort.",
    printCenterTitle: "REGALETIKETTEN-SUCHE & DRUCKZENTRUM 🖨️",
    matrixHeader: "Lagerregal-Matrix",
    matrixDesc: "Prüfen Sie alle definierten Regal-Codes und erstellen Sie Etiketten.",
    searchInventoryPlaceholder: "Inventar durchsuchen (Produktname, SKU oder Regal)",
    badgeFull: "belegt",
    badgeEmpty: "leer",
    inspectBtn: "Prüfen",
    printBtn: "Drucken 🖨️",
    noShelvesDefined: "Keine Regale definiert. Bitte verwenden Sie den Gestalter oben.",
    warehouseInventory: "Lagerbestand",
    itemsUnit: "Artikel",
    colProductSku: "Produkt / SKU",
    colShelf: "Regal",
    colQty: "Menge",
    colSalePrice: "Preis (Verkauf)",
    colLabel: "Etikett",
    printClose: "Schließen",
    liveReaderPlaceholder: "Regalcode manuell eingeben (z. B. A-01, B-02)",
    scannerTitle: "LAGER BARKOD / QR SCANNER",
    liveShelfScan: "Live Regal Scan"
  },
  ru: {
    header: "📦 Умное управление складом HBS",
    runWizard: "🧙 Запустить мастер настройки",
    stockMovements: "Движение запасов",
    dashboard: "Панель управления",
    wizardTitle: "Быстрое создание складов",
    wizardTitleSmall: "ПРОСТОЙ МАСТЕР СКЛАДА 🧙",
    wizardDesc: "Укажите количество складов. Называть и нумеровать склады очень просто.",
    wizardCountLabel: "Сколько у вас складов?",
    wizardPlaceholder: "Название склада {num} (напр., Центральный склад)",
    cancel: "Отмена",
    saveDepots: "Сохранить и настроить склады",
    setupZones: "Настройка зон и полок",
    setupZonesDesc: "Введите зоны (A, B, C...) для выбранного склада и выберите глубину полок.",
    zones: "Зоны склада (через запятую)",
    shelfDepth: "Глубина полок в зоне",
    shelvesUnit: "полок",
    generateLayout: "Создать и сохранить планировку",
    placementTitle: "Быстрое размещение товара",
    placementDesc: "Разместите выбранный товар на полке и обновите количество.",
    selectProduct: "Выбрать товар",
    targetShelf: "Целевая полка",
    qty: "Количество",
    placementNote: "Примечание к размещению",
    activeWarehousesLabel: "Активные склады (кликните для выбора)",
    badgeSelected: "ВЫБРАН",
    badgePassive: "НЕАКТИВЕН",
    definedProducts: "описанных товаров",
    shelfPositions: "полки",
    layoutShaperTitle: "КОНФИГУРАТОР ПРОХОДОВ И ПОЛОК 📐",
    layoutShaperHeader: "Настроить планировку",
    layoutShaperDesc: "Определите проходы и вертикальные полки. Система автоматически создаст коды этикеток.",
    zonesCorridors: "Зоны / Буквы проходов",
    zonesExample: "напр., A, B, C, D",
    zonesHelp: "Разделяйте запятыми. Каждая буква представляет собой проход.",
    verticalDepth: "Вертикальная глубина полок",
    verticalDepthHelp: "Количество уровней/полок в проходе (напр., от A-01 до A-04).",
    generateLayoutBtn: "⚡ Создать планировку и этикетки полок",
    lockLocationTitle: "БЛОКИРОВКА МЕСТОПОЛОЖЕНИЯ ТОВАРА 🔒",
    lockLocationHeader: "Разместить товар на полке",
    lockLocationDesc: "Выберите товар из каталога и закрепите его на полке с указанием количества.",
    selectFromCatalog: "Выбрать товар из каталога",
    selectProductOption: "-- Выберите товар --",
    onlyDefinedShelves: "Только определенные полки",
    selectShelfOption: "-- Выберите полку --",
    placeQtyLabel: "Размещаемое количество",
    purchaseCost: "Себестоимость (закупка)",
    salePrice: "Цена продажи",
    processNote: "Примечание к операции",
    processNotePlaceholder: "напр., Размещение в проходе А завершено",
    lockProductBtn: "🔒 Закрепить товар на полке и обновить склад",
    liveScannerTitle: "НАВИГАЦИЯ ПО ПОЛКАМ И МОБИЛЬНЫЙ СКАНЕР 📷",
    scanShelfLabel: "Сканировать этикетку полки",
    openCameraBtn: "📷 Открыть камеру (Сканировать)",
    manualCodePlaceholder: "Введите код ячейки или симулируйте (напр., A-01)",
    simulateBtn: "Симулировать",
    scannedStatus: "СТАТУС ОТСКАНИРОВАННОЙ ПОЛКИ",
    printShelfLabelBtn: "🖨️ Печать этикетки полки",
    closeBtn: "Закрыть",
    currentProducts: "Товары на полке",
    noProductsOnShelf: "На этой полке нет товаров.",
    movementsHistory: "История движений по полке",
    noMovements: "История движений для этой ячейки отсутствует.",
    printCenterTitle: "ПОИСК И ПЕЧАТЬ ЭТИКЕТОК ПОЛОК 🖨️",
    matrixHeader: "Матрица полок склада",
    matrixDesc: "Просматривайте все коды полок и печатайте этикетки в один клик.",
    searchInventoryPlaceholder: "Поиск по товару, артикулу или полке",
    badgeFull: "занято",
    badgeEmpty: "пусто",
    inspectBtn: "Осмотреть",
    printBtn: "Печать 🖨️",
    noShelvesDefined: "Полки не настроены. Пожалуйста, используйте конфигуратор выше.",
    warehouseInventory: "Инвентарь склада",
    itemsUnit: "Позиций",
    colProductSku: "Товар / SKU",
    colShelf: "Полка",
    colQty: "Кол-во",
    colSalePrice: "Цена продажи",
    colLabel: "Этикетка",
    printClose: "Закрыть",
    liveReaderPlaceholder: "Введите код вручную (напр., A-01, B-02)",
    scannerTitle: "СКАНЕР ШТРИХКОДОВ / QR-КОДОВ",
    liveShelfScan: "Сканирование полки"
  },
  ka: {
    header: "📦 HBS საწყობის ჭკვიანი მართვა",
    runWizard: "🧙 ოსტატის გაშვება",
    stockMovements: "მარაგების მოძრაობა",
    dashboard: "მართვის პანელი",
    wizardTitle: "საწყობების სწრაფი შექმნა",
    wizardTitleSmall: "საწყობის მარტივი ოსტატი 🧙",
    wizardDesc: "მიუთითეთ რამდენი საწყობი გაქვთ. საწყობების სახელდება და ნუმერაცია ძალიან მარტივია.",
    wizardCountLabel: "რამდენი საწყობი გაქვთ?",
    wizardPlaceholder: "საწყობის სახელი {num} (მაგ: ცენტრალური საწყობი)",
    cancel: "გაუქმება",
    saveDepots: "საწყობების შენახვა და ინსტალაცია",
    setupZones: "ზონებისა და თაროების ფორმირება",
    setupZonesDesc: "შეიყვანეთ ზონები (A, B, C...) არჩეული საწყობისთვის და აირჩიეთ თაროს სიღრმე.",
    zones: "საწყობის ზონები (მძიმით გამოყოფილი)",
    shelfDepth: "თაროს სიღრმე ზონაში",
    shelvesUnit: "თარო",
    generateLayout: "განლაგების შექმნა და შენახვა",
    placementTitle: "პროდუქტის სწრაფი განთავსება",
    placementDesc: "განათავსეთ არჩეული პროდუქტი თაროზე და განაახლეთ რაოდენობა.",
    selectProduct: "აირჩიეთ პროდუქტი",
    targetShelf: "სამიზნე თაროს მდებარეობა",
    qty: "რაოდენობა",
    placementNote: "განთავსების შენიშვნა",
    activeWarehousesLabel: "აქტიური საწყობები (დააჭირეთ ასარჩევად)",
    badgeSelected: "არჩეული",
    badgePassive: "პასიური",
    definedProducts: "განსაზღვრული პროდუქტი",
    shelfPositions: "თაროს პოზიცია",
    layoutShaperTitle: "დერეფნისა და თაროს დამგეგმავი 📐",
    layoutShaperHeader: "განლაგების ფორმირება",
    layoutShaperDesc: "განსაზღვრეთ დერეფნები და თაროების რაოდენობა. სისტემა ავტომატურად შექმნას ეტიკეტის კოდებს.",
    zonesCorridors: "ზონები / დერეფნის ასოები",
    zonesExample: "მაგ: A, B, C, D",
    zonesHelp: "გამოყავით მძიმით. თითოეული ასო წარმოადგენს დერეფანს.",
    verticalDepth: "თაროების სიმაღლე",
    verticalDepthHelp: "თაროების რაოდენობა თითოეულ დერეფანში (მაგ: A-01-დან A-04-მდე).",
    generateLayoutBtn: "⚡ თაროების განლაგებისა და ეტიკეტების შექმნა",
    lockLocationTitle: "პროდუქტის ლოკაციის ჩაკეტვა 🔒",
    lockLocationHeader: "პროდუქტის თაროზე განთავსება",
    lockLocationDesc: "აირჩიეთ პროდუქტი კატალოგიდან და განათავსეთ თაროზე რაოდენობის მითითებით.",
    selectFromCatalog: "პროდუქტის არჩევა კატალოგიდან",
    selectProductOption: "-- აირჩიეთ პროდუქტი --",
    onlyDefinedShelves: "მხოლოდ განსაზღვრული თაროები",
    selectShelfOption: "-- აირჩიეთ თარო --",
    placeQtyLabel: "განსათავსებელი რაოდენობა",
    purchaseCost: "თვითღირებულება (შესყიდვა)",
    salePrice: "გასაყიდი ფასი",
    processNote: "ოპერაციის შენიშვნა",
    processNotePlaceholder: "მაგ: დერეფანი A განთავსება დასრულდა",
    lockProductBtn: "🔒 პროდუქტის თაროზე ჩაკეტვა და მარაგის განახლება",
    liveScannerTitle: "თაროების ნავიგაცია და მობილური სკანერი 📷",
    scanShelfLabel: "თაროს ეტიკეტის სკანირება",
    openCameraBtn: "📷 კამერის გახსნა (სკანირება)",
    manualCodePlaceholder: "შეიყვანეთ კოდი ან მოახდინეთ სიმულაცია (მაგ: A-01)",
    simulateBtn: "სიმულაცია",
    scannedStatus: "სკანირებული თაროს სტატუსი",
    printShelfLabelBtn: "🖨️ თაროს ეტიკეტის ბეჭდვა",
    closeBtn: "დახურვა",
    currentProducts: "პროდუქტები თაროზე",
    noProductsOnShelf: "ამ თაროზე პროდუქტები არ არის.",
    movementsHistory: "თაროს მოძრაობის ისტორია",
    noMovements: "ამ ლოკაციისთვის მოძრაობის ისტორია არ არსებობს.",
    printCenterTitle: "თაროს ეტიკეტის ძებნა და ბეჭდვა 🖨️",
    matrixHeader: "საწყობის თაროების მატრიცა",
    matrixDesc: "შეამოწმეთ თაროს კოდები და დაბეჭდეთ ეტიკეტები.",
    searchInventoryPlaceholder: "პროდუქტის, SKU-ს ან თაროს ძებნა",
    badgeFull: "სავსე",
    badgeEmpty: "ცარიელი",
    inspectBtn: "ინსპექტირება",
    printBtn: "ბეჭდვა 🖨️",
    noShelvesDefined: "თაროები არ არის განსაზღვრული. გამოიყენეთ დამგეგმავი ზემოთ.",
    warehouseInventory: "საწყობის ინვენტარი",
    itemsUnit: "ელემენტი",
    colProductSku: "პროდუქტი / SKU",
    colShelf: "თარო",
    colQty: "რაოდენობა",
    colSalePrice: "ფასი (გაყიდვა)",
    colLabel: "ეტიკეტი",
    printClose: "დახურვა",
    liveReaderPlaceholder: "შეიყვანეთ თაროს კოდი (მაგ: A-01, B-02)",
    scannerTitle: "საწყობის შტრიხკოდის / QR სკანერი",
    liveShelfScan: "თაროს ცოცხალი სკანირება"
  }
};


export default function WarehousesRevampPage() {

  // Language Selection
  const [language, setLanguage] = useState<LanguageCode>("tr");

  // Authentication & Store slugs
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [storeSlug, setStoreSlug] = useState("obdtr");
  const [storeName, setStoreName] = useState("OBDTR Diagnostics");

  // Core Data States
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Active / Selected UI states
  const [activeWarehouseId, setActiveWarehouseId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Feedback Alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Setup Wizard States
  const [showWizard, setShowWizard] = useState(false);
  const [wizardCount, setWizardCount] = useState(3);
  const [wizardNames, setWizardNames] = useState<string[]>([]);

  // Layout Shaper States
  const [shaperZones, setShaperZones] = useState("A, B, C");
  const [shaperShelfDepth, setShaperShelfDepth] = useState(4); // 4 shelves per zone (01, 02, 03, 04)
  const [corridors, setCorridors] = useState<CorridorConfig[]>([
    { zone: "A", depth: 4, tiers: 3 },
    { zone: "B", depth: 4, tiers: 3 },
    { zone: "C", depth: 4, tiers: 3 }
  ]);

  // Product Placement States
  const [placeProductId, setPlaceProductId] = useState("");
  const [placeShelf, setPlaceShelf] = useState("");
  const [placeQty, setPlaceQty] = useState(1);
  const [placeNote, setPlaceNote] = useState("Raf Konum Yerleşimi");

  // Scanner & Live Inspector states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [manualScanInput, setManualScanInput] = useState("");
  const [scannedShelfCode, setScannedShelfCode] = useState<string | null>(null);

  const [scannedProduct, setScannedProduct] = useState<ProductRecord | null>(null);
  const zxingReaderRef = useRef<any>(null);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Printing Area State
  const [printLabelData, setPrintLabelData] = useState<{
    type: "shelf" | "product";
    title: string;
    subTitle?: string;
    code: string;
    details?: string;
    extra?: string;
  } | null>(null);


  const loadZXing = () => {
    return new Promise((resolve) => {
      if ((window as any).ZXing) {
        resolve((window as any).ZXing);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js";
      script.async = true;
      script.onload = () => {
        resolve((window as any).ZXing);
      };
      script.onerror = () => {
        resolve(null);
      };
      document.head.appendChild(script);
    });
  };

  useEffect(() => {

    // 0. Load language preference
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (isLanguageCode(savedLanguage)) {
      setLanguage(savedLanguage);
    }

    // 1. Get current user & store info
    try {
      const userStr = window.localStorage.getItem("hbs-current-user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        const slug = user.storeSlugs?.[0] || "obdtr";
        setStoreSlug(slug);
      }
    } catch (e) {
      console.error("Auth load error", e);
    }

    // 2. Load all databases
    loadDatabase();
  }, []);

  const parseShelvesToConfig = (shelves: string[]): CorridorConfig[] => {
    if (!shelves || shelves.length === 0) {
      return [
        { zone: "A", depth: 4, tiers: 3 },
        { zone: "B", depth: 4, tiers: 3 },
        { zone: "C", depth: 4, tiers: 3 }
      ];
    }
    const map: { [key: string]: { slots: Set<number>, levels: Set<number> } } = {};
    shelves.forEach(sh => {
      const parts = sh.split("-");
      if (parts.length >= 2) {
        const zone = parts[0];
        const slot = parseInt(parts[1]) || 1;
        const level = parts[2] ? (parseInt(parts[2]) || 1) : 1;
        if (!map[zone]) {
          map[zone] = { slots: new Set<number>(), levels: new Set<number>() };
        }
        map[zone].slots.add(slot);
        map[zone].levels.add(level);
      }
    });
    return Object.keys(map).sort().map(zone => {
      const depth = map[zone].slots.size > 0 ? Math.max(...Array.from(map[zone].slots)) : 1;
      const tiers = map[zone].levels.size > 0 ? Math.max(...Array.from(map[zone].levels)) : 1;
      return { zone, depth, tiers };
    });
  };

  const loadDatabase = () => {
    try {
      // A) Load Products Catalog
      const prodStr = window.localStorage.getItem("hbs-store-products");
      if (prodStr) {
        setProducts(JSON.parse(prodStr));
      }

      // B) Load Stock Movements
      const movStr = window.localStorage.getItem("hbs-store-stock-movements");
      if (movStr) {
        setMovements(JSON.parse(movStr));
      }

      // C) Load Warehouses
      const userStr = window.localStorage.getItem("hbs-current-user");
      const activeUser = userStr ? JSON.parse(userStr) : null;
      const slug = activeUser?.storeSlugs?.[0] || "obdtr";
      
      const storesStr = window.localStorage.getItem("hbs-registered-stores");
      const registeredStores = storesStr ? JSON.parse(storesStr) : [];
      let myStore = registeredStores.find((s: any) => s.code === slug);

      if (myStore) {
        setStoreName(myStore.name || "OBDTR Diagnostics");
        if (myStore.warehouses && myStore.warehouses.length > 0) {
          setWarehouses(myStore.warehouses);
          setActiveWarehouseId(myStore.warehouses[0].id);
          // Set layout shaper defaults from active warehouse
          const activeWh = myStore.warehouses[0];
          setShaperZones(activeWh.zones ? activeWh.zones.join(", ") : "A, B, C");
          setCorridors(parseShelvesToConfig(activeWh.shelves || []));
        } else {
          // Open setup wizard if no warehouses exist
          setShowWizard(true);
        }
      } else {
        // Fallback store setup
        setShowWizard(true);
      }
    } catch (e) {
      console.error("DB Load error", e);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  // Play Beep sound helper for scanner simulation
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio Context blocked:", e);
    }
  };

  // Wizard Generation Flow
  const handleWizardCountChange = (count: number) => {
    const val = Math.max(1, Math.min(10, count));
    setWizardCount(val);
    const names = Array.from({ length: val }, (_, i) => wizardNames[i] || `Depo ${i + 1}`);
    setWizardNames(names);
  };

  const handleSaveWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardNames.some((n) => !n.trim())) {
      showError("Lütfen tüm depolar için isim tanımlayın.");
      return;
    }

    try {
      const initialWarehouses: Warehouse[] = wizardNames.map((name, i) => {
        const id = `wh-${Date.now()}-${i}`;
        const zones = ["A", "B"];
        const shelves = ["A-01", "A-02", "B-01", "B-02"];
        return {
          id,
          name: name.trim(),
          purpose: i === 0 ? "Ana Satış Deposu" : `Yedek / Depolama Sahası ${i + 1}`,
          customerVisible: false,
          city: "Batumi",
          zones,
          shelves,
          capacity: 1000,
          used: 0,
        };
      });

      // Save to registered stores
      const storesStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
      const registeredStores = JSON.parse(storesStr);
      let myStore = registeredStores.find((s: any) => s.code === storeSlug);

      if (!myStore) {
        myStore = {
          code: storeSlug,
          name: storeName,
          city: "Batumi",
          operatingModel: "hybrid",
          serviceCountries: ["TR", "GE"],
          warehouses: initialWarehouses,
        };
        registeredStores.push(myStore);
      } else {
        myStore.warehouses = initialWarehouses;
      }

      const updatedStores = registeredStores.map((s: any) =>
        s.code === storeSlug ? myStore : s
      );
      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));

      setWarehouses(initialWarehouses);
      setActiveWarehouseId(initialWarehouses[0].id);
      setShowWizard(false);
      showSuccess(`Sihirbaz tamamlandı! ${initialWarehouses.length} adet depo başarıyla oluşturuldu.`);
    } catch (e: any) {
      showError(`Sihirbaz kaydedilirken hata: ${e.message || e}`);
    }
  };

  // Active Warehouse details
  const activeWh = useMemo(() => {
    return warehouses.find((w) => w.id === activeWarehouseId) || null;
  }, [warehouses, activeWarehouseId]);

  const t = translations[language];

  // Layout Shaper logic
  const handleSaveLayout = () => {
    if (!activeWh) return;

    try {
      const generatedShelves: string[] = [];
      const parsedZones: string[] = [];

      corridors.forEach((corr) => {
        const zone = corr.zone.trim().toUpperCase();
        if (zone) {
          if (!parsedZones.includes(zone)) {
            parsedZones.push(zone);
          }
          for (let d = 1; d <= corr.depth; d++) {
            const slotStr = d < 10 ? `0${d}` : `${d}`;
            for (let t = 1; t <= corr.tiers; t++) {
              const tierStr = t < 10 ? `0${t}` : `${t}`;
              generatedShelves.push(`${zone}-${slotStr}-${tierStr}`);
            }
          }
        }
      });

      if (parsedZones.length === 0) {
        showError("Lütfen en az bir adet bölge tanımlayın.");
        return;
      }

      const updatedWarehouses = warehouses.map((w) =>
        w.id === activeWarehouseId
          ? { ...w, zones: parsedZones, shelves: generatedShelves }
          : w
      );

      const storesStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
      const registeredStores = JSON.parse(storesStr);
      const updatedStores = registeredStores.map((s: any) => {
        if (s.code === storeSlug) {
          return { ...s, warehouses: updatedWarehouses };
        }
        return s;
      });

      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      setWarehouses(updatedWarehouses);
      showSuccess(`"${activeWh.name}" raf düzeni (${generatedShelves.length} raf konumu) başarıyla şekillendirildi!`);
    } catch (e: any) {
      showError(`Düzen kaydedilirken hata: ${e.message || e}`);
    }
  };

  // Product placement
  const handlePlaceProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeProductId) {
      showError("Lütfen yerleştirmek için bir ürün seçin.");
      return;
    }
    if (!placeShelf) {
      showError("Lütfen raf konumu seçin.");
      return;
    }
    if (!activeWh) return;

    const qty = Number(placeQty);
    if (!qty || qty <= 0) {
      showError("Miktar sıfırdan büyük olmalıdır.");
      return;
    }

    try {
      const targetProd = products.find((p) => p.id === placeProductId);
      if (!targetProd) return;

      // Update quantity and warehouse/shelf on product
      const updatedProducts = products.map((p) => {
        if (p.id === placeProductId) {
          return {
            ...p,
            warehouse: activeWh.name,
            shelf: placeShelf,
            quantity: qty.toString(),
          };
        }
        return p;
      });

      // Save products to localStorage
      window.localStorage.setItem("hbs-store-products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);

      // Create stock movement
      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productName: targetProd.name,
        productCode: targetProd.sku || targetProd.barcode,
        movementType: "manual_adjustment",
        quantity: qty,
        warehouse: activeWh.name,
        shelf: placeShelf,
        note: placeNote || "Raf Konum Yerleşimi",
        createdAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + " (Bugün)",
      };

      const updatedMovements = [newMovement, ...movements];
      window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(updatedMovements));
      setMovements(updatedMovements);

      setPlaceProductId("");
      setPlaceQty(1);
      setPlaceNote("Raf Konum Yerleşimi");
      showSuccess(`"${targetProd.name}" başarıyla [${activeWh.name} - ${placeShelf}] konumuna yerleştirildi.`);
    } catch (e: any) {
      showError(`Yerleşim sırasında hata: ${e.message || e}`);
    }
  };

  // Camera Scanner using ZXing library
  const startCamera = async () => {
    setIsScannerOpen(true);
    setScanMessage("Tarayıcı yükleniyor... Lütfen bekleyin.");
    setManualScanInput("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.setAttribute("playsinline", "true");

        const ZXingClass = await loadZXing();
        if (!ZXingClass) {
          setScanMessage("Tarayıcı kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.");
          return;
        }

        if (!zxingReaderRef.current) {
          zxingReaderRef.current = new (window as any).ZXing.BrowserMultiFormatReader();
        }

        setScanMessage("Kamera hazır. Barkodu veya karekodu hizalayın...");
        zxingReaderRef.current.decodeFromVideoElement(videoEl, (result: any, err: any) => {
          if (result && result.text) {
            handleScanSuccess(result.text);
          }
        });
      }
    } catch (err) {
      console.warn("Camera scan access denied, fallback to manual input", err);
      setScanMessage("Kameraya erişim engellendi. Simülatörü kullanabilirsiniz.");
    }
  };

  const stopCamera = () => {
    if (zxingReaderRef.current) {
      try {
        zxingReaderRef.current.reset();
      } catch (e) {}
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsScannerOpen(false);
  };

  const handleScanSuccess = (code: string) => {
    playBeep();
    stopCamera();

    const uppercaseCode = code.trim().toUpperCase();

    // Check if it's a product
    const matchedProduct = products.find(
      (p) =>
        (p.sku && p.sku.toUpperCase() === uppercaseCode) ||
        (p.barcode && p.barcode.toUpperCase() === uppercaseCode)
    );

    if (matchedProduct) {
      setScannedProduct(matchedProduct);
      setScannedShelfCode(null); // Close shelf inspector if open
      showSuccess(language === "en" ? `Product scanned: ${matchedProduct.name}` : `Ürün okundu: ${matchedProduct.name}`);
    } else {
      // Treat as shelf code
      setScannedShelfCode(uppercaseCode);
      setScannedProduct(null); // Close product inspector if open
      showSuccess(language === "en" ? `Shelf scanned: ${uppercaseCode}` : `Raf okundu: ${uppercaseCode}`);
    }
  };

  // Print command
  const triggerPrintLabel = (type: "shelf" | "product", code: string, title: string, details?: string, extra?: string) => {
    setPrintLabelData({
      type,
      code,
      title,
      subTitle: storeName,
      details,
      extra
    });
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Live shelf contents
  const shelfProducts = useMemo(() => {
    if (!scannedShelfCode || !activeWh) return [];
    return products.filter(
      (p) =>
        p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
        p.shelf.toLowerCase() === scannedShelfCode.toLowerCase()
    );
  }, [products, scannedShelfCode, activeWh]);

  // Live shelf stock movements
  const shelfMovements = useMemo(() => {
    if (!scannedShelfCode || !activeWh) return [];
    return movements.filter(
      (m) =>
        m.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
        m.shelf.toLowerCase() === scannedShelfCode.toLowerCase()
    );
  }, [movements, scannedShelfCode, activeWh]);

  // General inventory lists for the active warehouse
  const activeWhInventory = useMemo(() => {
    if (!activeWh) return [];
    return products.filter((p) => p.warehouse.toLowerCase() === activeWh.name.toLowerCase());
  }, [products, activeWh]);

  const filteredInventory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activeWhInventory;
    return activeWhInventory.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shelf.toLowerCase().includes(q)
    );
  }, [activeWhInventory, searchQuery]);

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      
      {/* CSS Print Stylesheet & Scanner Animation Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scanLine {
          position: absolute;
          animation: scanLine 3s infinite linear;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area-target, #print-area-target * {
            visibility: visible !important;
          }
          #print-area-target {
            position: absolute !important;
            left: 50% !important;
            top: 40% !important;
            transform: translate(-50%, -50%) !important;
            width: 320px !important;
            height: auto !important;
            border: 2px dashed #000 !important;
            border-radius: 12px !important;
            background: #fff !important;
            color: #000 !important;
            padding: 20px !important;
            text-align: center !important;
            font-family: monospace !important;
            box-shadow: none !important;
          }
        }
      `}} />

      <div className="mx-auto max-w-[1850px] space-y-4">
        
        {/* Header navigation bar */}
        <header className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-650 flex items-center gap-1.5">
            {t.header}
          </Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <button
              type="button"
              onClick={() => {
                setWizardNames(Array.from({ length: 3 }, (_, i) => `Depo ${i + 1}`));
                setShowWizard(true);
              }}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-750 hover:bg-blue-100 transition"
            >
              {t.runWizard}
            </button>
            <Link href="/dashboard/stock-movements" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50 transition">
              {t.stockMovements}
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50 transition">
              {t.dashboard}
            </Link>
          </div>
        </header>

        {/* Global Feedback Notifications */}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-black text-emerald-800 shadow-sm animate-fadeIn">
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-2xl border border-red-500/20 bg-red-50 p-4 text-xs font-black text-red-800 shadow-sm animate-fadeIn">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* SETUP WIZARD (Wizard Mode overlay) */}
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <form onSubmit={handleSaveWizard} className="w-full max-w-lg rounded-3xl border border-slate-250 bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.wizardTitleSmall}</span>
                <h2 className="text-xl font-black text-slate-900">{t.wizardTitle}</h2>
                <p className="text-xs text-slate-550">{t.wizardDesc}</p>
              </div>

              {/* Number of warehouses input */}
              <div className="flex items-center justify-between border-y border-slate-100 py-3">
                <label className="text-xs font-bold text-slate-700">{t.wizardCountLabel}</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleWizardCountChange(wizardCount - 1)}
                    className="h-8 w-8 rounded-lg bg-slate-150 text-slate-800 font-bold hover:bg-slate-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={wizardCount}
                    onChange={(e) => handleWizardCountChange(Number(e.target.value))}
                    className="w-12 h-8 text-center rounded-lg border border-slate-250 font-black text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleWizardCountChange(wizardCount + 1)}
                    className="h-8 w-8 rounded-lg bg-slate-150 text-slate-800 font-bold hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {wizardNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-xs font-black text-blue-650 bg-white border border-blue-200 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={t.wizardPlaceholder.replace("{num}", String(i + 1))}
                      value={name}
                      onChange={(e) => {
                        const updated = [...wizardNames];
                        updated[i] = e.target.value;
                        setWizardNames(updated);
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                {warehouses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowWizard(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    {t.cancel}
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-500 transition active:scale-95"
                >
                  ⚡ {t.saveDepots}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* WAREHOUSE SELECTOR (Tabs as large cards) */}
        <section className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t.activeWarehousesLabel}</span>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {warehouses.map((w) => {
              const isActive = w.id === activeWarehouseId;
              const itemsCount = products.filter((p) => p.warehouse.toLowerCase() === w.name.toLowerCase()).length;
              return (
                <article
                  key={w.id}
                  onClick={() => {
                    setActiveWarehouseId(w.id);
                    setShaperZones(w.zones ? w.zones.join(", ") : "A, B, C");
                    setCorridors(parseShelvesToConfig(w.shelves || []));
                  }}
                  className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between cursor-pointer transition-all active:scale-98 ${
                    isActive
                      ? "border-blue-600 bg-white ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-350"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm flex items-center gap-1">
                        🏪 {w.name}
                      </h3>
                      <p className="text-[10px] text-slate-550 font-bold mt-0.5">{w.city} · {w.purpose}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${
                      isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {isActive ? t.badgeSelected : t.badgePassive}
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-550 font-black">
                    <span>📦 {itemsCount} {t.definedProducts}</span>
                    <span className="font-mono text-blue-600">{w.shelves?.length || 0} {t.shelfPositions}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* MAIN Revamped Workspace */}
        {activeWh && (
          <section className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            
            {/* Left Column: Layout Shaper and Placement Board */}
            <div className="space-y-4">
              
              {/* 1. Depo Şekillendirici (Layout Shaper) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.layoutShaperTitle}</span>
                  <h2 className="text-base font-black text-slate-900 mt-1">"{activeWh.name}" {t.layoutShaperHeader}</h2>
                  <p className="text-xs text-slate-550">{t.layoutShaperDesc}</p>
                </div>

                <div className="space-y-4">
                  {/* Quick Add Corridor */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-corridor-input"
                      placeholder="Yeni Reyon Kodu (Örn: D, E, F)"
                      maxLength={3}
                      className="flex-1 rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim().toUpperCase();
                          if (val && !corridors.some(c => c.zone === val)) {
                            setCorridors([...corridors, { zone: val, depth: 4, tiers: 3 }]);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("new-corridor-input") as HTMLInputElement;
                        const val = input?.value.trim().toUpperCase();
                        if (val && !corridors.some(c => c.zone === val)) {
                          setCorridors([...corridors, { zone: val, depth: 4, tiers: 3 }]);
                          input.value = "";
                        } else if (!val) {
                          showError("Lütfen bir reyon kodu girin.");
                        } else {
                          showError("Bu reyon zaten mevcut.");
                        }
                      }}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2 transition shadow-sm active:scale-95"
                    >
                      + Reyon Ekle
                    </button>
                  </div>

                  {/* Corridors Editor List */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {corridors.map((c, idx) => (
                      <div key={c.zone} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3.5 shadow-sm relative group hover:border-slate-300 transition">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-800">📍 Reyon {c.zone}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-full">
                              {c.depth * c.tiers} Toplam Raf
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCorridors(corridors.filter(item => item.zone !== c.zone))}
                            className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                          >
                            Kaldır ✕
                          </button>
                        </div>

                        {/* Dimensions Editor Controls */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-500 block">↔ Reyon Derinliği (Slot / Genişlik)</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setCorridors(corridors.map((item, i) => i === idx ? { ...item, depth: Math.max(1, item.depth - 1) } : item));
                                }}
                                className="h-7 w-7 rounded bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center text-xs active:scale-90"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-black text-xs bg-white border border-slate-200 py-1 rounded-md shadow-sm">
                                {c.depth} Slot
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setCorridors(corridors.map((item, i) => i === idx ? { ...item, depth: Math.min(20, item.depth + 1) } : item));
                                }}
                                className="h-7 w-7 rounded bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center text-xs active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-500 block">↕ Raf Kat Sayısı (Yükseklik)</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setCorridors(corridors.map((item, i) => i === idx ? { ...item, tiers: Math.max(1, item.tiers - 1) } : item));
                                }}
                                className="h-7 w-7 rounded bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center text-xs active:scale-90"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-black text-xs bg-white border border-slate-200 py-1 rounded-md shadow-sm">
                                {c.tiers} Kat
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setCorridors(corridors.map((item, i) => i === idx ? { ...item, tiers: Math.min(10, item.tiers + 1) } : item));
                                }}
                                className="h-7 w-7 rounded bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center text-xs active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Visual Grid Preview */}
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">🏢 Reyon Önizleme Haritası</span>
                          <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 overflow-x-auto">
                            <div className="flex flex-col gap-1.5 min-w-[280px]">
                              {Array.from({ length: c.tiers }, (_, tIdx) => {
                                const level = c.tiers - tIdx; // Render highest level at the top
                                return (
                                  <div key={level} className="flex items-center gap-1.5">
                                    <span className="w-8 text-[9px] font-black text-slate-400 text-right shrink-0">Kat {level}</span>
                                    <div className="flex-1 flex gap-1.5">
                                      {Array.from({ length: c.depth }, (_, dIdx) => {
                                        const slot = dIdx + 1;
                                        const code = `${c.zone}-${slot < 10 ? `0${slot}` : `${slot}`}-${level < 10 ? `0${level}` : `${level}`}`;
                                        const hasProduct = products.some(
                                          (p) =>
                                            p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
                                            p.shelf === code
                                        );
                                        return (
                                          <div
                                            key={code}
                                            onClick={() => {
                                              setScannedShelfCode(code);
                                              setScannedProduct(null);
                                              showSuccess(language === "en" ? `Selected shelf: ${code}` : `Seçilen raf konumu: ${code}`);
                                            }}
                                            title={`${code} (${hasProduct ? "Dolu / Ürün Var" : "Boş Raf"}) - İncelemek için tıklayın`}
                                            className={`flex-1 h-9 rounded-lg border text-center flex flex-col justify-center items-center transition cursor-pointer select-none active:scale-95 ${
                                              hasProduct
                                                ? "bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                                                : "bg-slate-50 border-slate-200 border-dashed text-slate-500 hover:bg-slate-100"
                                            }`}
                                          >
                                            <span className="text-[8px] font-mono font-bold block">{slot < 10 ? `0${slot}` : slot}-{level < 10 ? `0${level}` : level}</span>
                                            {hasProduct && <span className="text-[7px] font-black mt-0.5">📦 Dolu</span>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveLayout}
                  className="w-full rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition active:scale-98 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span> {t.generateLayoutBtn}
                </button>
              </div>

              {/* 2. Ürün Rafa Yerleştirme İstasyonu (Product Placement Board) */}
              <form onSubmit={handlePlaceProduct} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.lockLocationTitle}</span>
                  <h2 className="text-base font-black text-slate-900 mt-1">{t.lockLocationHeader}</h2>
                  <p className="text-xs text-slate-550">{t.lockLocationDesc}</p>
                </div>

                <div className="space-y-3">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">{t.selectFromCatalog}</span>
                    <select
                      value={placeProductId}
                      onChange={(e) => setPlaceProductId(e.target.value)}
                      className="w-full rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="">{t.selectProductOption}</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku || p.barcode || "Kodu Yok"}) - Stok: {p.quantity || "0"} adet
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-bold text-slate-700">{t.onlyDefinedShelves}</span>
                      <select
                        value={placeShelf}
                        onChange={(e) => setPlaceShelf(e.target.value)}
                        className="w-full rounded-xl border border-slate-250 px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                      >
                        <option value="">{t.selectShelfOption}</option>
                        {activeWh.shelves?.map((sh) => (
                          <option key={sh} value={sh}>
                            Raf: {sh}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs font-bold text-slate-700">{t.placeQtyLabel}</span>
                      <input
                        type="number"
                        min="1"
                        value={placeQty}
                        onChange={(e) => setPlaceQty(Number(e.target.value))}
                        className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>

                  {/* Show price warnings / preview for sanity check */}
                  {placeProductId && (
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center text-xs font-semibold">
                      <div>
                        💰 {t.purchaseCost}:{" "}
                        <span className="text-rose-700 font-bold">
                          {products.find((p) => p.id === placeProductId)?.purchasePrice || "0.00"} EUR
                        </span>
                      </div>
                      <div>
                        💵 {t.salePrice}:{" "}
                        <span className="text-emerald-700 font-bold">
                          {products.find((p) => p.id === placeProductId)?.salePrice || "0.00"} EUR
                        </span>
                      </div>
                    </div>
                  )}

                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">{t.processNote}</span>
                    <input
                      type="text"
                      value={placeNote}
                      onChange={(e) => setPlaceNote(e.target.value)}
                      placeholder={t.processNotePlaceholder}
                      className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white hover:bg-blue-500 transition active:scale-95"
                >
                  {t.lockProductBtn}
                </button>
              </form>
            </div>

            {/* Right Column: Visual Layout Map & Live Barcode Scan */}
            <div className="space-y-4">
              
              {/* 1. Barkod Okut & Canlı Sorgu (Live Scanner Box) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.liveScannerTitle}</span>
                    <h2 className="text-base font-black text-slate-900 mt-1">{t.scanShelfLabel}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="rounded-xl bg-blue-650 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    {t.openCameraBtn}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualScanInput}
                    onChange={(e) => setManualScanInput(e.target.value)}
                    placeholder={t.manualCodePlaceholder}
                    className="flex-1 rounded-xl border border-slate-250 px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (manualScanInput.trim()) {
                        handleScanSuccess(manualScanInput.trim().toUpperCase());
                      } else {
                        showError(language === "en" ? "Please enter a shelf/product code to simulate." : "Lütfen simüle edilecek bir raf veya ürün kodu girin.");
                      }
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition"
                  >
                    {t.simulateBtn}
                  </button>
                </div>

                {/* Live Shelf Inspector Screen (Okutulan Raf Müfettişi) */}
                {scannedShelfCode && (
                  <div className="rounded-2xl border-2 border-blue-400 bg-blue-50/40 p-4 space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start border-b border-blue-200 pb-2">
                      <div>
                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{t.scannedStatus}</span>
                        <h3 className="text-base font-black text-slate-900">📍 Raf: {scannedShelfCode}</h3>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => triggerPrintLabel("shelf", scannedShelfCode, `RAF: ${scannedShelfCode}`)}
                          className="rounded-lg bg-white border border-blue-200 px-2 py-1 text-[10px] font-black text-blue-700 hover:bg-blue-100 shadow-sm"
                        >
                          {t.printShelfLabelBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setScannedShelfCode(null)}
                          className="text-slate-450 hover:text-slate-700 text-xs font-black px-1.5"
                        >
                          {t.closeBtn}
                        </button>
                      </div>
                    </div>

                    {/* Shelf Products list */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-550 uppercase tracking-wider">{t.currentProducts}</h4>
                      {shelfProducts.length > 0 ? (
                        shelfProducts.map((p) => (
                          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-850 text-xs">{p.name}</h5>
                                <p className="text-[9px] text-slate-400 font-mono mt-0.5">SKU: {p.sku || "—"} | OEM: {p.oemCode || "—"}</p>
                              </div>
                              <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {p.quantity} Adet
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-650 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <div>💰 {language === "en" ? "Purchase" : "Alış"}: <strong className="text-rose-700 font-mono">{p.purchasePrice || "0"} EUR</strong></div>
                              <div>💵 {language === "en" ? "Sale" : "Satış"}: <strong className="text-emerald-700 font-mono">{p.salePrice || "0"} EUR</strong></div>
                              <div className="col-span-2">🏷️ {language === "en" ? "Category/Brand" : "Kategori/Marka"}: <span className="text-slate-900 font-bold">{p.category} · {p.brand} ({p.model})</span></div>
                              <div className="col-span-2 text-slate-550 leading-normal italic">{language === "en" ? "Description" : "Açıklama"}: {p.description || "—"}</div>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => triggerPrintLabel("product", p.sku || p.barcode, p.name, `Alış: ${p.purchasePrice} EUR | Satış: ${p.salePrice} EUR`, `RAF: ${scannedShelfCode}`)}
                                className="rounded-lg bg-blue-50 px-2.5 py-1 text-[9px] font-black text-blue-700 hover:bg-blue-100"
                              >
                                🖨️ {language === "en" ? "Print Product Label" : "Ürün Barkodu Yazdır"}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic p-3 text-center bg-white rounded-xl border border-slate-200">
                          {t.noProductsOnShelf}
                        </p>
                      )}
                    </div>

                    {/* Shelf Movements log */}
                    <div className="space-y-2 border-t border-blue-200/50 pt-3">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.movementsHistory}</h4>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {shelfMovements.length > 0 ? (
                          shelfMovements.map((m) => (
                            <div key={m.id} className="text-[10px] leading-relaxed text-slate-600 border-b border-slate-100 pb-1 flex justify-between">
                              <div>
                                <strong className="text-slate-800">{m.productName}</strong>
                                <span className="text-slate-400"> ({m.note})</span>
                              </div>
                              <div className="text-right font-mono shrink-0 ml-2">
                                <span className={m.movementType === "stock_in" ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                                  {m.movementType === "stock_in" ? "+" : ""}{m.quantity} Adet
                                </span>
                                <span className="text-slate-400"> | {m.createdAt}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-400 italic text-center py-2">
                            {t.noMovements}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Product Inspector Screen */}
                {scannedProduct && (
                  <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 p-4 space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start border-b border-emerald-200 pb-2">
                      <div>
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                          {language === "en" ? "SCANNED PRODUCT DETAIL" : "TARANAN ÜRÜN DETAYI"}
                        </span>
                        <h3 className="text-base font-black text-slate-900">📦 {scannedProduct.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScannedProduct(null)}
                        className="text-slate-450 hover:text-slate-700 text-xs font-black px-1.5"
                      >
                        {t.closeBtn}
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-650 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div>SKU: <strong className="text-slate-800 font-mono">{scannedProduct.sku || "—"}</strong></div>
                        <div>Barcode: <strong className="text-slate-800 font-mono">{scannedProduct.barcode || "—"}</strong></div>
                        <div>💰 {language === "en" ? "Purchase" : "Alış"}: <strong className="text-rose-700 font-mono">{scannedProduct.purchasePrice || "0"} EUR</strong></div>
                        <div>💵 {language === "en" ? "Sale" : "Satış"}: <strong className="text-emerald-700 font-mono">{scannedProduct.salePrice || "0"} EUR</strong></div>
                        <div>🏪 {language === "en" ? "Warehouse" : "Depo"}: <span className="text-slate-900 font-bold">{scannedProduct.warehouse || "—"}</span></div>
                        <div>📍 {language === "en" ? "Shelf" : "Raf"}: <span className="text-blue-600 font-bold font-mono">{scannedProduct.shelf || "—"}</span></div>
                        <div className="col-span-2">{language === "en" ? "Stock" : "Mevcut Stok"}: <strong className="text-slate-900">{scannedProduct.quantity || "0"} Adet</strong></div>
                        <div className="col-span-2 text-slate-500 leading-normal italic">{language === "en" ? "Description" : "Açıklama"}: {scannedProduct.description || "—"}</div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => triggerPrintLabel("product", scannedProduct.sku || scannedProduct.barcode, scannedProduct.name, `Alış: ${scannedProduct.purchasePrice} EUR | Satış: ${scannedProduct.salePrice} EUR`, `RAF: ${scannedProduct.shelf || "—"}`)}
                          className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-[10px] font-black text-blue-700 hover:bg-blue-100"
                        >
                          🖨️ {language === "en" ? "Print Label" : "Ürün Etiketi Yazdır"}
                        </button>
                      </div>
                    </div>

                    {/* Product Movements log */}
                    <div className="space-y-2 border-t border-emerald-200/50 pt-3">
                      <h4 className="text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                        {language === "en" ? "Product Stock Movements" : "Ürün Stok Hareketleri"}
                      </h4>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {movements.filter(m => m.productCode && m.productCode.toUpperCase() === (scannedProduct.sku || scannedProduct.barcode || "").toUpperCase()).length > 0 ? (
                          movements.filter(m => m.productCode && m.productCode.toUpperCase() === (scannedProduct.sku || scannedProduct.barcode || "").toUpperCase()).map((m) => (
                            <div key={m.id} className="text-[10px] leading-relaxed text-slate-655 border-b border-slate-100 pb-1 flex justify-between">
                              <div>
                                <strong className="text-slate-800">{m.warehouse} - Raf: {m.shelf || "—"}</strong>
                                <span className="text-slate-400"> ({m.note})</span>
                              </div>
                              <div className="text-right font-mono shrink-0 ml-2">
                                <span className={m.movementType === "stock_in" ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                                  {m.movementType === "stock_in" ? "+" : ""}{m.quantity} Adet
                                </span>
                                <span className="text-slate-400"> | {m.createdAt}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-400 italic text-center py-2">
                            {language === "en" ? "No movement history for this product." : "Bu ürüne ait geçmiş stok hareketi yok."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Görsel Depo Haritası ve Raf Listesi (Layout Map) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.printCenterTitle}</span>
                  <h2 className="text-base font-black text-slate-900 mt-1">{t.matrixHeader}</h2>
                  <p className="text-xs text-slate-550">{t.matrixDesc}</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t.searchInventoryPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Shelves Grid */}
                <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                  {activeWh.shelves && activeWh.shelves.length > 0 ? (
                    activeWh.shelves.map((sh) => {
                      const containsProduct = products.some(
                        (p) =>
                          p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
                          p.shelf.toLowerCase() === sh.toLowerCase()
                      );
                      return (
                        <div
                          key={sh}
                          className={`rounded-xl border p-2.5 text-center flex flex-col justify-between items-center transition ${
                            containsProduct
                              ? "bg-indigo-50/50 border-indigo-200"
                              : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="font-mono text-xs font-black text-slate-800">{sh}</div>
                          <div className="text-[9px] font-bold text-slate-400 mt-1">
                            {containsProduct ? t.badgeFull : t.badgeEmpty}
                          </div>
                          
                          <div className="mt-2 flex gap-1 w-full">
                            <button
                              type="button"
                              onClick={() => handleScanSuccess(sh)}
                              className="flex-1 rounded bg-white border border-slate-200 py-0.5 text-[8px] font-bold text-slate-600 hover:bg-slate-100"
                            >
                              {t.inspectBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerPrintLabel("shelf", sh, `RAF: ${sh}`)}
                              className="flex-1 rounded bg-blue-50 border border-blue-200 py-0.5 text-[8px] font-black text-blue-700 hover:bg-blue-100"
                            >
                              {t.printBtn}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center py-6 text-xs text-slate-400 italic">
                      {t.noShelvesDefined}
                    </div>
                  )}
                </div>

                {/* Filtered Inventory list table inside warehouse */}
                {activeWhInventory.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <h3 className="text-xs font-black text-slate-800">{t.warehouseInventory} ({filteredInventory.length} {t.itemsUnit})</h3>
                    <div className="overflow-x-auto max-h-56">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[9px] font-black text-slate-500 uppercase">
                            <th className="p-2">{t.colProductSku}</th>
                            <th className="p-2 text-center">{t.colShelf}</th>
                            <th className="p-2 text-center">{t.colQty}</th>
                            <th className="p-2 text-right">{t.colSalePrice}</th>
                            <th className="p-2 text-right">{t.colLabel}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {filteredInventory.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50">
                              <td className="p-2">
                                <span className="font-bold text-slate-900 truncate block max-w-xs">{p.name}</span>
                                <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                              </td>
                              <td className="p-2 text-center font-mono font-bold text-blue-600">{p.shelf}</td>
                              <td className="p-2 text-center font-black text-slate-900">{p.quantity}</td>
                              <td className="p-2 text-right font-mono text-slate-800">{p.salePrice} EUR</td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => triggerPrintLabel("product", p.sku || p.barcode, p.name, `Alış: ${p.purchasePrice} EUR | Satış: ${p.salePrice} EUR`, `RAF: ${p.shelf}`)}
                                  className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[8px] font-black text-blue-700 hover:bg-blue-100"
                                >
                                  {t.printBtn}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </section>
        )}

        {/* PRINT TARGET CONTAINER (Strict CSS targeted block, invisible in screen view) */}
        {printLabelData && (
          <div id="print-area-target" className="hidden">
            <div style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px", marginBottom: "8px" }}>
              {printLabelData.subTitle || "HBS SYSTEMS"}
            </div>
            
            {/* Main large tag code */}
            <div style={{ fontSize: "28px", fontWeight: "900", margin: "10px 0", borderBottom: "2px solid #000", borderTop: "2px solid #000", padding: "8px 0" }}>
              {printLabelData.code}
            </div>

            {/* Title / Description */}
            <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {printLabelData.title}
            </div>

            {/* Extra details (like prices) */}
            {printLabelData.details && (
              <div style={{ fontSize: "11px", fontWeight: "700", margin: "5px 0", color: "#333" }}>
                {printLabelData.details}
              </div>
            )}

            {/* Shelf context */}
            {printLabelData.extra && (
              <div style={{ fontSize: "12px", fontWeight: "bold", background: "#eee", padding: "3px", display: "inline-block", marginTop: "4px" }}>
                {printLabelData.extra}
              </div>
            )}

            {/* Simulated QR & Barcode SVGs */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "15px" }}>
              {/* QR Simulation */}
              <svg width="60" height="60" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="1" width="6" height="6" fill="#000" />
                <rect x="13" y="1" width="6" height="6" fill="#000" />
                <rect x="1" y="13" width="6" height="6" fill="#000" />
                <rect x="13" y="13" width="3" height="3" fill="#000" />
                <rect x="9" y="9" width="3" height="3" fill="#000" />
                <rect x="9" y="1" width="2" height="6" fill="#000" />
                <rect x="1" y="9" width="6" height="2" fill="#000" />
              </svg>

              {/* Barcode Simulation */}
              <div style={{ display: "flex", alignItems: "flex-end", height: "40px" }}>
                <div style={{ width: "3px", height: "40px", backgroundColor: "#000", marginRight: "2px" }} />
                <div style={{ width: "1px", height: "40px", backgroundColor: "#000", marginRight: "3px" }} />
                <div style={{ width: "4px", height: "40px", backgroundColor: "#000", marginRight: "1px" }} />
                <div style={{ width: "2px", height: "40px", backgroundColor: "#000", marginRight: "2px" }} />
                <div style={{ width: "1px", height: "40px", backgroundColor: "#000", marginRight: "3px" }} />
                <div style={{ width: "3px", height: "40px", backgroundColor: "#000", marginRight: "1px" }} />
                <div style={{ width: "4px", height: "40px", backgroundColor: "#000", marginRight: "2px" }} />
                <div style={{ width: "2px", height: "40px", backgroundColor: "#000", marginRight: "1px" }} />
                <div style={{ width: "1px", height: "40px", backgroundColor: "#000" }} />
              </div>
            </div>

            <div style={{ fontSize: "8px", color: "#666", marginTop: "12px", borderTop: "1px solid #ddd", paddingTop: "5px" }}>
              HBS Connected · Georgia - Turkey Trade Network
            </div>
          </div>
        )}

      </div>

      {/* SCANNER SIMULATOR CAM OVERLAY */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center text-white">
              <div>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                  {t.scannerTitle}
                </span>
                <h3 className="text-sm font-black">{t.liveShelfScan}</h3>
              </div>
              <button type="button" onClick={stopCamera} className="text-slate-400 hover:text-white transition font-black">
                {t.printClose}
              </button>
            </div>

            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden border-b border-slate-800">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-scanLine" />
                <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-500" />
                <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-500" />
                <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-500" />
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-500" />
              </div>
            </div>

            <div className="p-5 bg-slate-950/40 space-y-4 text-white">
              {scanMessage && (
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-300">{scanMessage}</p>
                </div>
              )}

              <div className="border-t border-slate-800 pt-3 flex gap-2">
                <input
                  type="text"
                  value={manualScanInput}
                  onChange={(e) => setManualScanInput(e.target.value)}
                  placeholder={t.liveReaderPlaceholder}
                  className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualScanInput.trim()) {
                      handleScanSuccess(manualScanInput.trim().toUpperCase());
                    }
                  }}
                  className="rounded-xl bg-blue-650 hover:bg-blue-700 text-white font-black text-xs px-3.5 py-1.5 transition"
                >
                  {t.simulateBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
