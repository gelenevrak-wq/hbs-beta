"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useMemo, useState, useRef } from "react";
import { getLocalizedField } from "@/lib/translations";
import VoiceAssistant from "@/components/VoiceAssistant";
import CompactLanguageSwitcher, { LanguageCode, isLanguageCode } from "@/components/language/CompactLanguageSwitcher";

const safeLower = (val: any) => String(val || "").toLowerCase();

type CorridorConfig = {
  zone: string;
  name?: string; // Custom descriptive name
  depth: number; // Slot count
  tiers: number; // Level count
  isDoubleRow?: boolean; // Back-to-back depth row indicator
  binsConfig?: { [shelfCode: string]: number }; // Compartment subdivision bins count per shelf (e.g., 2, 4 bins)
};

type ShelfCapacity = {
  maxWeight: number; // in kg
  maxVolume: number; // in m^3
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
  corridorConfigs?: CorridorConfig[];
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
  weight?: string;
  volume?: string;
  imageUrl?: string;
  galleryUrls?: string[];
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

type StockTransfer = {
  id: string;
  sourceWh: string;
  destWh: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  sourceShelf: string;
  destShelf: string;
  status: 'draft' | 'in_transit' | 'completed';
  createdAt: string;
  note: string;
};

const translations = {
  tr: {
    header: "📦 HBS Akıllı Depo Yönetimi",
    backToProducts: "← Ürün & Stok Yönetimi",
    addNewWarehouse: "Yeni Depo Ekle",
    addNewWarehouseDesc: "Sisteme yeni bir depo şubesi ekleyin",
    newWhNameLabel: "Depo İsmi",
    newWhCityLabel: "Deponun Bulunduğu Şehir",
    newWhPurposeLabel: "Depo Kullanım Amacı (Açıklama)",
    createWhBtn: "⚡ Depoyu Oluştur",
    unplacedProductsHeader: "Rafsız / Ortalıktaki Ürünler",
    unplacedProductsDesc: "Bu depoda kayıtlı olan ama henüz raflara dizilmemiş ürünler.",
    autoPlaceBtn: "⚡ Boş Raflara Otomatik Dağıt",
    placeBtn: "Yerleştir",
    layoutShaperNav: "Yerleşim & Raf Şekillendirici",
    interWarehouseTransfer: "Depolar Arası Transfer",
    blindStockCount: "Kör Stok Sayımı",
    zplBarcodeLab: "ZPL Barkod Laboratuvarı",
    smartOrderPicking: "Akıllı Sipariş Toplama",
    designOptions: "Depo Tasarım Seçenekleri",
    designOptionsDesc: "Tasarım stüdyosu veya basit liste görünümü arasında geçiş yapın.",
    simpleListView: "Basit Liste Görünümü",
    designStudio: "Depo Tasarım Beyaz Tahtası (Studio)",
    newAisleCode: "Yeni Reyon Kodu (Örn: D, E, F)",
    addAisle: "+ Reyon Ekle",
    aisle: "Reyon",
    totalShelves: "Toplam Raf",
    remove: "Kaldır",
    corridorDepth: "Reyon Derinliği (Slot / Genişlik)",
    tierCount: "Raf Kat Sayısı (Yükseklik)",
    aislePreviewMap: "REYON ÖNİZLEME HARİTASI",
    level: "Kat",
    runWizard: "⚙️ Depoları Düzenle / Ekle",
    stockMovements: "Stok Hareketleri",
    dashboard: "Kontrol Paneli",
    wizardTitle: "Depo Yapılandırması ve Düzenleme",
    wizardTitleSmall: "DEPO YÖNETİM PANELİ ⚙️",
    wizardDesc: "Buradan depolarınızın sayısını artırıp azaltabilir veya adlarını güncelleyebilirsiniz. Mevcut depolarınızın ayarları korunur.",
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
    liveShelfScan: "Canlı Raf Tarama",
    shelfTransferHeader: "Raftan Hızlı Sevk / Transfer",
    sourceShelf: "Kaynak Raf",
    currentQty: "Mevcut Miktar",
    dispatchWarehouse: "Sevk Edilecek Depo",
    dispatchShelf: "Sevk Edilecek Raf / Hücre",
    dispatchQty: "Sevk Miktarı",
    noShelfOption: "-- Rafsız (Ortalıkta Dursun) --",
    shelfSuffix: "Rafı",
    dispatchBtn: "⚡ Sevk Et ve Güncelle",
    cancelBtn: "Vazgeç"
  },
  en: {
    header: "📦 HBS Smart Warehouse Management",
    backToProducts: "← Product & Stock Management",
    addNewWarehouse: "Add New Warehouse",
    addNewWarehouseDesc: "Add a new warehouse branch to the system",
    newWhNameLabel: "Warehouse Name",
    newWhCityLabel: "Warehouse City",
    newWhPurposeLabel: "Warehouse Purpose (Description)",
    createWhBtn: "⚡ Create Warehouse",
    unplacedProductsHeader: "Unplaced / Scattered Products",
    unplacedProductsDesc: "Products registered in this warehouse but not assigned to shelves.",
    autoPlaceBtn: "⚡ Auto Distribute to Empty Shelves",
    placeBtn: "Place",
    layoutShaperNav: "Layout & Shelf Configurator",
    interWarehouseTransfer: "Inter-Warehouse Transfer",
    blindStockCount: "Blind Stock Count",
    zplBarcodeLab: "ZPL Barcode Lab",
    smartOrderPicking: "Smart Order Picking",
    designOptions: "Warehouse Design Options",
    designOptionsDesc: "Switch between design studio or simple list view.",
    simpleListView: "Simple List View",
    designStudio: "Warehouse Design Whiteboard (Studio)",
    newAisleCode: "New Aisle Code (e.g. D, E, F)",
    addAisle: "+ Add Aisle",
    aisle: "Aisle",
    totalShelves: "Total Shelves",
    remove: "Remove",
    corridorDepth: "Aisle Depth (Slot / Width)",
    tierCount: "Shelf Tier Count (Height)",
    aislePreviewMap: "AISLE PREVIEW MAP",
    level: "Level",
    runWizard: "⚙️ Edit / Add Warehouses",
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
    liveShelfScan: "Live Shelf Scan",
    shelfTransferHeader: "Quick Shelf Dispatch / Transfer",
    sourceShelf: "Source Shelf",
    currentQty: "Current Quantity",
    dispatchWarehouse: "Destination Warehouse",
    dispatchShelf: "Destination Shelf / Slot",
    dispatchQty: "Transfer Quantity",
    noShelfOption: "-- No Shelf (Keep Unplaced) --",
    shelfSuffix: "Shelf",
    dispatchBtn: "⚡ Dispatch & Update",
    cancelBtn: "Cancel"
  },
  de: {
    header: "📦 HBS Intelligentes Lagerverwaltungs-System",
    backToProducts: "← Produkt- & Lagerverwaltung",
    addNewWarehouse: "Neues Lager hinzufügen",
    addNewWarehouseDesc: "Fügen Sie dem System eine neue Filiale hinzu",
    newWhNameLabel: "Lagername",
    newWhCityLabel: "Lagerstadt",
    newWhPurposeLabel: "Lagerzweck (Beschreibung)",
    createWhBtn: "⚡ Lager erstellen",
    unplacedProductsHeader: "Unplatzierte / Verstreute Produkte",
    unplacedProductsDesc: "In diesem Lager registrierte, aber nicht den Regalen zugewiesene Produkte.",
    autoPlaceBtn: "⚡ Automatisch in leere Regale verteilen",
    placeBtn: "Platzieren",
    layoutShaperNav: "Layout & Regal-Konfigurator",
    interWarehouseTransfer: "Lagerübergreifender Transfer",
    blindStockCount: "Blinde Lagerzählung",
    zplBarcodeLab: "ZPL-Barcode-Labor",
    smartOrderPicking: "Intelligente Auftragskommissionierung",
    designOptions: "Lager-Designoptionen",
    designOptionsDesc: "Wechseln Sie zwischen dem Design-Studio oder einer einfachen Listenansicht.",
    simpleListView: "Einfache Listenansicht",
    designStudio: "Lager-Design-Whiteboard (Studio)",
    newAisleCode: "Neuer Gang-Code (z.B. D, E, F)",
    addAisle: "+ Gang hinzufügen",
    aisle: "Gang",
    totalShelves: "Regale insgesamt",
    remove: "Entfernen",
    corridorDepth: "Gang-Tiefe (Slot / Breite)",
    tierCount: "Regalebenen (Höhe)",
    aislePreviewMap: "GANG-VORSCHAU-KARTE",
    level: "Ebene",
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
    liveShelfScan: "Live Regal Scan",
    shelfTransferHeader: "Schneller Regalkommissionierung / Transfer",
    sourceShelf: "Quellregal",
    currentQty: "Aktuelle Menge",
    dispatchWarehouse: "Ziel-Lager",
    dispatchShelf: "Ziel-Regal / Fach",
    dispatchQty: "Transfermenge",
    noShelfOption: "-- Kein Regal (Unplatziert lassen) --",
    shelfSuffix: "Regal",
    dispatchBtn: "⚡ Buchen & Aktualisieren",
    cancelBtn: "Abbrechen"
  },
  ru: {
    header: "📦 Умное управление складом HBS",
    backToProducts: "← Управление товарами и запасами",
    addNewWarehouse: "Добавить новый склад",
    addNewWarehouseDesc: "Добавить новый филиал склада в систему",
    newWhNameLabel: "Название склада",
    newWhCityLabel: "Город склада",
    newWhPurposeLabel: "Назначение склада (Описание)",
    createWhBtn: "⚡ Создать склад",
    unplacedProductsHeader: "Неразмещенные / Рассеянные товары",
    unplacedProductsDesc: "Товары, зарегистрированные на этом складе, но не привязанные к полкам.",
    autoPlaceBtn: "⚡ Автораспределение на пустые полки",
    placeBtn: "Разместить",
    layoutShaperNav: "Планировка и конфигуратор полок",
    interWarehouseTransfer: "Межскладской перевод",
    blindStockCount: "Слепой подсчет запасов",
    zplBarcodeLab: "ZPL лаборатория штрихкодов",
    smartOrderPicking: "Умный подбор заказов",
    designOptions: "Параметры дизайна склада",
    designOptionsDesc: "Переключение между дизайн-студией или простым списком.",
    simpleListView: "Простой список",
    designStudio: "Дизайн-студия склада (Доска)",
    newAisleCode: "Код нового прохода (напр. D, E, F)",
    addAisle: "+ Добавить проход",
    aisle: "Проход",
    totalShelves: "Всего полок",
    remove: "Удалить",
    corridorDepth: "Глубина прохода (Ячейка / Ширина)",
    tierCount: "Количество уровней полок (Высота)",
    aislePreviewMap: "КАРТА ПРОХОДОВ СКЛАДА",
    level: "Уровень",
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
    liveShelfScan: "Сканирование полки",
    shelfTransferHeader: "Быстрая отгрузка / перемещение с полки",
    sourceShelf: "Исходная полка",
    currentQty: "Текущее количество",
    dispatchWarehouse: "Склад назначения",
    dispatchShelf: "Полка / ячейка назначения",
    dispatchQty: "Количество для перемещения",
    noShelfOption: "-- Без полки (Оставить неразмещенным) --",
    shelfSuffix: "Полка",
    dispatchBtn: "⚡ Отгрузить и обновить",
    cancelBtn: "Отмена"
  },
  ka: {
    header: "📦 HBS საწყობის ჭკვიანი მართვა",
    backToProducts: "← პროდუქტები და მარაგების მართვა",
    addNewWarehouse: "ახალი საწყობის დამატება",
    addNewWarehouseDesc: "სისტემაში ახალი საწყობის ფილიალის დამატება",
    newWhNameLabel: "საწყობის სახელი",
    newWhCityLabel: "საწყობის ქალაქი",
    newWhPurposeLabel: "საწყობის დანიშნულება (აღწერა)",
    createWhBtn: "⚡ საწყობის შექმნა",
    unplacedProductsHeader: "განუთავსებელი პროდუქტები",
    unplacedProductsDesc: "პროდუქტები, რომლებიც რეგისტრირებულია ამ საწყობში, მაგრამ არ არის მინიჭებული თაროებზე.",
    autoPlaceBtn: "⚡ ცარიელ თაროებზე ავტომატური განაწილება",
    placeBtn: "განთავსება",
    layoutShaperNav: "განლაგების და თაროების დამგეგმავი",
    interWarehouseTransfer: "შიდა გადაცემა საწყობებს შორის",
    blindStockCount: "ინვენტარიზაცია",
    zplBarcodeLab: "ZPL ეტიკეტების ლაბორატორია",
    smartOrderPicking: "შეკვეთის ჭკვიანი აკრეფა",
    designOptions: "საწყობის დიზაინის პარამეტრები",
    designOptionsDesc: "გადართეთ დიზაინ სტუდიასა და მარტივ სიას შორის.",
    simpleListView: "მარტივი სიის ხედი",
    designStudio: "საწყობის დიზაინის დაფა (სტუდია)",
    newAisleCode: "ახალი დერეფნის კოდი (მაგ: D, E, F)",
    addAisle: "+ დერეფნის დამატება",
    aisle: "დერეფანი",
    totalShelves: "სულ თარო",
    remove: "წაშლა",
    corridorDepth: "დერეფნის სიღრმე (სლოტი / სიგანე)",
    tierCount: "თაროების სიმაღლე (რაოდენობა)",
    aislePreviewMap: "დერეფნის წინასწარი ხედი",
    level: "დონე",
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
    liveShelfScan: "თაროს ცოცხალი სკანირება",
    shelfTransferHeader: "თაროდან სწრაფი გაგზავნა / გადატანა",
    sourceShelf: "წყარო თარო",
    currentQty: "მიმდინარე რაოდენობა",
    dispatchWarehouse: "დანიშნულების საწყობი",
    dispatchShelf: "დანიშნულების თარო / სლოტი",
    dispatchQty: "გადატანის რაოდენობა",
    noShelfOption: "-- თაროს გარეშე (დატოვეთ განუთავსებელი) --",
    shelfSuffix: "თარო",
    dispatchBtn: "⚡ გაგზავნა და განახლება",
    cancelBtn: "გაუქმება"
  }
};

const whMessages = {
  tr: {
    transferOutNote: "Transfer Çıkışı -> {dest} ({shelf})",
    transferInNote: "Transfer Girişi <- {source} ({shelf})",
    countCorrectionNote: "Sayım Düzeltmesi (Sistem: {system} -> Sayılan: {counted})",
    autoPlacementNote: "Otomatik Raf Dağıtımı",
    errHasInventory: "Bu depoda hala {count} adet envanter kaydı bulunuyor! Depoyu silmeden önce lütfen tüm ürünleri diğer depolara transfer edin.",
    confirmDeleteWh: "\"{name}\" deposunu tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
    deleteWhSuccess: "\"{name}\" deposu başarıyla silindi.",
    errNoShelvesForAuto: "Otomatik yerleştirme için önce reyon/raf tanımlanmış olmalıdır.",
    errNoFreeShelf: "Otomatik dağıtılacak boş raf hücresi bulunamadı!",
    autoPlaceSuccess: "Toplam {count} adet rafsız ürün boş raflara otomatik olarak dağıtıldı.",
    alertValidQty: "Geçerli bir miktar giriniz.",
    alertStockLimitExceeded: "Mevcut stok sınırını aştınız! (Maksimum: {max})",
    dispatchSuccess: "\"{name}\" başarıyla sevk edildi.",
    alertValidWhName: "Lütfen geçerli bir depo ismi girin.",
    createWhSuccess: "\"{name}\" deposu başarıyla oluşturuldu.",
    errUnauthorizedCreate: "Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler yeni depolar oluşturabilir.",
    errEmptyWhName: "Lütfen tüm depolar için isim tanımlayın.",
    mainWhPurpose: "Ana Satış Deposu",
    backupWhPurpose: "Yedek / Depolama Sahası {num}",
    optChooseOption: "Seçiniz",
    optDeleteOnlyShelf: "1 - Sadece Rafı Sil (Ürünler depoda rafsız/ortalıkta kalır)",
    optDeleteFull: "2 - Tamamen Sil (Ürün tamamen silinir)",
    promptDeleteOption: "Lütfen seçiminizi yazın (1 veya 2):",
    confirmLockProduct: "[{shelf}] konumunda {qty} adet \"{name}\" kaydedildi."
  },
  en: {
    transferOutNote: "Transfer Out -> {dest} ({shelf})",
    transferInNote: "Transfer In <- {source} ({shelf})",
    countCorrectionNote: "Count Adjustment (System: {system} -> Counted: {counted})",
    autoPlacementNote: "Auto Shelf Placement",
    errHasInventory: "There are still {count} inventory records in this warehouse! Please transfer all products to other warehouses before deleting this one.",
    confirmDeleteWh: "Are you sure you want to completely delete the warehouse \"{name}\"? This action cannot be undone.",
    deleteWhSuccess: "Warehouse \"{name}\" successfully deleted.",
    errNoShelvesForAuto: "Aisle/shelf configurations must be defined first for auto placement.",
    errNoFreeShelf: "No empty shelf compartment found for auto distribution!",
    autoPlaceSuccess: "A total of {count} unplaced products were automatically distributed to empty shelves.",
    alertValidQty: "Please enter a valid quantity.",
    alertStockLimitExceeded: "Stock limit exceeded! (Maximum: {max})",
    dispatchSuccess: "\"{name}\" successfully dispatched.",
    alertValidWhName: "Please enter a valid warehouse name.",
    createWhSuccess: "Warehouse \"{name}\" successfully created.",
    errUnauthorizedCreate: "Insufficient Permissions! Only Store Owner or Managers can create new warehouses.",
    errEmptyWhName: "Please define a name for all warehouses.",
    mainWhPurpose: "Main Sales Warehouse",
    backupWhPurpose: "Backup / Storage Area {num}",
    optChooseOption: "Choose",
    optDeleteOnlyShelf: "1 - Delete Shelf Only (Products remain scattered in warehouse)",
    optDeleteFull: "2 - Delete Completely (Product is deleted completely)",
    promptDeleteOption: "Please enter your choice (1 or 2):",
    confirmLockProduct: "Saved {qty} units of \"{name}\" at location [{shelf}]."
  },
  de: {
    transferOutNote: "Transfer-Ausgang -> {dest} ({shelf})",
    transferInNote: "Transfer-Eingang <- {source} ({shelf})",
    countCorrectionNote: "Bestandskorrektur (System: {system} -> Gezählt: {counted})",
    autoPlacementNote: "Automatische Regalplatzierung",
    errHasInventory: "In diesem Lager befinden sich noch {count} Bestandsdatensätze! Bitte übertragen Sie alle Produkte in andere Lager, bevor Sie dieses löschen.",
    confirmDeleteWh: "Sind Sie sicher, dass Sie das Lager \"{name}\" vollständig löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.",
    deleteWhSuccess: "Lager \"{name}\" erfolgreich gelöscht.",
    errNoShelvesForAuto: "Für die automatische Platzierung müssen zuerst Gang-/Regalkonfigurationen definiert werden.",
    errNoFreeShelf: "Kein freies Regalfach für die automatische Verteilung gefunden!",
    autoPlaceSuccess: "Insgesamt {count} unplatzierte Produkte wurden automatisch auf freie Regale verteilt.",
    alertValidQty: "Bitte geben Sie eine gültige Menge ein.",
    alertStockLimitExceeded: "Lagergrenze überschritten! (Maximum: {max})",
    dispatchSuccess: "\"{name}\" erfolgreich versandt.",
    alertValidWhName: "Bitte geben Sie einen gültigen Lagernamen ein.",
    createWhSuccess: "Lager \"{name}\" erfolgreich erstellt.",
    errUnauthorizedCreate: "Unzureichende Berechtigungen! Nur der Ladenbesitzer oder Manager können neue Lager erstellen.",
    errEmptyWhName: "Bitte definieren Sie einen Namen für alle Lager.",
    mainWhPurpose: "Hauptverkaufslager",
    backupWhPurpose: "Backup- / Lagerbereich {num}",
    optChooseOption: "Wählen",
    optDeleteOnlyShelf: "1 - Nur Regal löschen (Produkte bleiben unplatziert im Lager)",
    optDeleteFull: "2 - Vollständig löschen (Produkt wird vollständig gelöscht)",
    promptDeleteOption: "Bitte geben Sie Ihre Wahl ein (1 oder 2):",
    confirmLockProduct: "{qty} Einheiten von \"{name}\" wurden an der Position [{shelf}] gespeichert."
  },
  ru: {
    transferOutNote: "Расход перевода -> {dest} ({shelf})",
    transferInNote: "Приход перевода <- {source} ({shelf})",
    countCorrectionNote: "Корректировка остатков (Система: {system} -> Фактически: {counted})",
    autoPlacementNote: "Автоматическое размещение на полках",
    errHasInventory: "На этом складе все еще находится {count} записей о запасах! Пожалуйста, перенесите все товары на другие склады перед его удалением.",
    confirmDeleteWh: "Вы уверены, что хотите полностью удалить склад \"{name}\"? Это действие нельзя отменить.",
    deleteWhSuccess: "Склад \"{name}\" успешно удален.",
    errNoShelvesForAuto: "Сначала необходимо настроить проходы/полки для авторазмещения.",
    errNoFreeShelf: "Свободная полка для автораспределения не найдена!",
    autoPlaceSuccess: "Всего {count} неразмещенных товаров были автоматически распределены по пустым полкам.",
    alertValidQty: "Пожалуйста, введите корректное количество.",
    alertStockLimitExceeded: "Лимит запасов превышен! (Максимум: {max})",
    dispatchSuccess: "\"{name}\" успешно отгружен.",
    alertValidWhName: "Пожалуйста, введите корректное название склада.",
    createWhSuccess: "Склад \"{name}\" успешно создан.",
    errUnauthorizedCreate: "Недостаточно прав! Только владелец магазина или управляющие могут создавать новые склады.",
    errEmptyWhName: "Пожалуйста, укажите названия для всех складов.",
    mainWhPurpose: "Основной склад продаж",
    backupWhPurpose: "Резервная / Зона хранения {num}",
    optChooseOption: "Выбрать",
    optDeleteOnlyShelf: "1 - Удалить только полку (Товары останутся неразмещенными на складе)",
    optDeleteFull: "2 - Удалить полностью (Товар будет полностью удален)",
    promptDeleteOption: "Пожалуйста, введите ваш выбор (1 или 2):",
    confirmLockProduct: "Сохранено {qty} шт. \"{name}\" в ячейке [{shelf}]."
  },
  ka: {
    transferOutNote: "გადაცემის გასავალი -> {dest} ({shelf})",
    transferInNote: "გადაცემის შემოსავალი <- {source} ({shelf})",
    countCorrectionNote: "ინვენტარიზაციის კორექტირება (სისტემა: {system} -> დათვლილი: {counted})",
    autoPlacementNote: "ავტომატური განაწილება თაროებზე",
    errHasInventory: "ამ საწყობში ჯერ კიდევ არის {count} ინვენტარის ჩანაწერი! გთხოვთ, წაშლამდე გადაიტანოთ ყველა პროდუქტი სხვა საწყობში.",
    confirmDeleteWh: "დარწმუნებული ხართ, რომ გსურთ საწყობის \"{name}\" სრულიად წაშლა? ეს ქმედება შეუქცევადია.",
    deleteWhSuccess: "საწყობი \"{name}\" წარმატებით წაიშალა.",
    errNoShelvesForAuto: "ავტომატური განთავსებისთვის ჯერ უნდა იყოს განსაზღვრული დერეფნები/თაროები.",
    errNoFreeShelf: "ცარიელი თარო ავტომატური განაწილებისთვის ვერ მოიძებნა!",
    autoPlaceSuccess: "სულ {count} განუთავსებელი პროდუქტი ავტომატურად განაწილდა ცარიელ თაროებზე.",
    alertValidQty: "გთხოვთ შეიყვანოთ რაოდენობის ვალიდური მნიშვნელობა.",
    alertStockLimitExceeded: "მარაგის ლიმიტი გადაჭარბებულია! (მაქსიმუმი: {max})",
    dispatchSuccess: "\"{name}\" წარმატებით გაიგზავნა.",
    alertValidWhName: "გთხოვთ შეიყვანოთ საწყობის ვალიდური სახელი.",
    createWhSuccess: "საწყობი \"{name}\" წარმატებით შეიქმნა.",
    errUnauthorizedCreate: "არასაკმარისი უფლებები! საწყობის შექმნა შეუძლია მხოლოდ მაღაზიის მფლობელს ან მენეჯერებს.",
    errEmptyWhName: "გთხოვთ მიუთითოთ საწყობების სახელები.",
    mainWhPurpose: "ძირითადი გაყიდვების საწყობი",
    backupWhPurpose: "სარეზერვო / შესანახი ზონა {num}",
    optChooseOption: "არჩევა",
    optDeleteOnlyShelf: "1 - მხოლოდ თაროს წაშლა (პროდუქტები დარჩება საწყობში განუთავსებლად)",
    optDeleteFull: "2 - სრულიად წაშლა (პროდუქტი სრულიად წაიშლება)",
    promptDeleteOption: "გთხოვთ შეიყვანოთ თქვენი არჩევანი (1 ან 2):",
    confirmLockProduct: "შენახულია {qty} ერთეული \"{name}\" თაროზე [{shelf}]."
  }
};



const translateWarehouseName = (name: string, lang: string) => {
  if (!name) return "";
  const lower = name.toLowerCase().trim();
  if (lower === "ana depo") {
    if (lang === "de") return "Hauptlager";
    if (lang === "en") return "Main Warehouse";
    if (lang === "ru") return "Главный склад";
    if (lang === "ka") return "ცენტრალური საწყობი";
  }
  if (lower === "showroom alanı" || lower === "showroom alani") {
    if (lang === "de") return "Showroom-Bereich";
    if (lang === "en") return "Showroom Area";
    if (lang === "ru") return "Выставочный зал";
    if (lang === "ka") return "შოურუმის ზონა";
  }
  if (lower === "i̇ade / kontrol deposu" || lower === "iade / kontrol deposu" || lower === "iade deposu") {
    if (lang === "de") return "Retouren- & Kontrolllager";
    if (lang === "en") return "Returns & Inspection Warehouse";
    if (lang === "ru") return "Склад возврата и контроля";
    if (lang === "ka") return "დაბრუნებისა და კონტროლის საწყობი";
  }
  return name;
};

const translateWarehousePurpose = (purpose: string, lang: string) => {
  if (!purpose) return "";
  const lower = purpose.toLowerCase().trim();
  if (lower.includes("satışa hazır") || lower.includes("verkaufsfertig") || lower.includes("ready to sell") || lower.includes("ready-to-sell") || lower.includes("satisa hazir")) {
    if (lang === "de") return "Verkaufsfertiger Produktbestand";
    if (lang === "en") return "Ready-to-sell product stock";
    if (lang === "ru") return "Готовый к продаже запас продукции";
    if (lang === "ka") return "გასაყიდად გამზადებული პროდუქციის მარაგი";
  }
  if (lower.includes("iade") || lower.includes("retouren") || lower.includes("returned") || lower.includes("inspection-pending") || lower.includes("arızak")) {
    if (lang === "de") return "Retouren, defekte oder auf Prüfung wartende Produkte";
    if (lang === "en") return "Returned, damaged or inspection-pending items";
    if (lang === "ru") return "Возвращенные, поврежденные или ожидающие контроля товары";
    if (lang === "ka") return "დაბრუნებული, დაზიანებული ან შემოწმების მოლოდინში მყოფი საქონელი";
  }
  if (lower.includes("müşteri") || lower.includes("sample") || lower.includes("musteri") || lower.includes("kunden zur ansicht")) {
    if (lang === "de") return "Musterprodukte für Kunden zur Ansicht";
    if (lang === "en") return "Sample products visible to customers";
    if (lang === "ru") return "Образцы товаров, видимые клиентам";
    if (lang === "ka") return "მომხმარებლისთვის ხილვადი ნიმუშები";
  }
  if (lower.includes("yedek") || lower.includes("depolama") || lower.includes("reserve") || lower.includes("backup") || lower.includes("storage")) {
    const match = purpose.match(/\d+/);
    const num = match ? match[0] : "";
    if (lang === "de") return `Reserve- / Lagerbereich ${num}`;
    if (lang === "en") return `Backup / Storage Area ${num}`;
    if (lang === "ru") return `Резервная / Складская зона ${num}`;
    if (lang === "ka") return `სარეზერვო / შესანახი ფართი ${num}`;
  }
  return purpose;
};

export default function WarehousesRevampPage() {

  // Pick-to-Light & AR Camera overlay states
  const [pickToLightActiveShelf, setPickToLightActiveShelf] = useState<string | null>(null);
  const [isArActive, setIsArActive] = useState(false);
  const [arVideoStream, setArVideoStream] = useState<MediaStream | null>(null);

  // Periodic audible beep guidance for Pick-to-Light guide
  useEffect(() => {
    if (!pickToLightActiveShelf) return;
    const interval = setInterval(() => {
      // Gentle audible tone
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800Hz gentle guided beep
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
      } catch (e) {
        console.warn("Audio Context blocked or unavailable:", e);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [pickToLightActiveShelf]);

  const handleStartAR = () => {
    setIsArActive(true);
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          setArVideoStream(stream);
          const videoEl = document.getElementById("ar-video-feed") as HTMLVideoElement;
          if (videoEl) videoEl.srcObject = stream;
        })
        .catch(err => {
          console.warn("Camera access denied or unavailable, showing simulated AR overlay.", err);
        });
    }
  };

  const handleStopAR = () => {
    if (arVideoStream) {
      arVideoStream.getTracks().forEach(track => track.stop());
      setArVideoStream(null);
    }
    setIsArActive(false);
  };

  // Direct quantity adjustments inside the visual shelf matrix (for child-proof ease of use!)
  const handleAdjustQuantity = (productId: string, delta: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const currentQty = parseInt(p.quantity) || 0;
        const newQty = Math.max(0, currentQty + delta);
        
        // Also update Supabase in the background if configured
        const isSupabaseConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";
        if (isSupabaseConfigured) {
          supabase
            .from("offerable_items")
            .update({ quantity: String(newQty) })
            .eq("id", productId)
            .then(({ error }) => {
              if (error) console.error("Supabase qty adjust error", error);
            });
        }

        return { ...p, quantity: String(newQty) };
      }
      return p;
    });

    saveProductsStateAndSync(updated);
    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
    showSuccess("Stok seviyesi güncellendi.");
  };

  const handleVoiceAdjustQuantity = (delta: number) => {
    if (!placeProductId) {
      showError(language === "tr" ? "Önce formdan bir ürün seçmelisiniz." : "Select a product from the form first.");
      return;
    }
    handleAdjustQuantity(placeProductId, delta);
  };

  const executeDirectPlacement = (productId: string, shelfCode: string, qtyVal: number) => {
    const activeWh = warehouses.find(w => w.id === activeWarehouseId);
    if (!activeWh) return;

    try {
      const targetProd = products.find((p) => String(p.id) === String(productId));
      if (!targetProd) {
        showError(activeLang === "en" ? "Product not found!" : "Yerleştirilmek istenen ürün bulunamadı!");
        return;
      }

      // Calculate current occupied weight & volume on shelfCode
      const currentProductsOnShelf = products.filter(
        (p) =>
          safeLower(p.warehouse) === safeLower(activeWh.name) &&
          safeLower(p.shelf) === safeLower(shelfCode) &&
          String(p.id) !== String(productId)
      );

      let occupiedWeight = 0;
      let occupiedVolume = 0;

      currentProductsOnShelf.forEach((p) => {
        const prodQty = parseFloat(p.quantity) || 0;
        const prodWeight = parseFloat(p.weight || "1.0") || 1.0;
        const prodVolume = parseFloat(p.volume || "0.01") || 0.01;
        occupiedWeight += prodQty * prodWeight;
        occupiedVolume += prodQty * prodVolume;
      });

      const newProdWeight = parseFloat(targetProd.weight || "1.0") || 1.0;
      const newProdVolume = parseFloat(targetProd.volume || "0.01") || 0.01;
      const newPlacementWeight = qtyVal * newProdWeight;
      const newPlacementVolume = qtyVal * newProdVolume;

      const totalWeightAfter = occupiedWeight + newPlacementWeight;
      const totalVolumeAfter = occupiedVolume + newPlacementVolume;

      const shelfCap = shelfCapacities[shelfCode] || { maxWeight: 100, maxVolume: 1.0 };

      if (totalWeightAfter > shelfCap.maxWeight) {
        showError(activeLang === "en" ? `Capacity Exceeded! Shelf Weight Limit: ${shelfCap.maxWeight} kg. Requested load: ${totalWeightAfter.toFixed(1)} kg.` : `Kapasite Aşımı! Raf Ağırlık Limiti: ${shelfCap.maxWeight} kg. Yerleştirilmek istenen toplam yük: ${totalWeightAfter.toFixed(1)} kg.`);
        return;
      }

      if (totalVolumeAfter > shelfCap.maxVolume) {
        showError(activeLang === "en" ? `Capacity Exceeded! Shelf Volume Limit: ${shelfCap.maxVolume} m³. Requested volume: ${totalVolumeAfter.toFixed(3)} m³.` : `Kapasite Aşımı! Raf Hacim Limiti: ${shelfCap.maxVolume} m³. Yerleştirilmek istenen toplam hacim: ${totalVolumeAfter.toFixed(3)} m³.`);
        return;
      }

      // Update quantity and warehouse/shelf on product
      const updatedProducts = products.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            warehouse: activeWh.name,
            shelf: shelfCode,
            quantity: qtyVal.toString(),
          };
        }
        return p;
      });

      // Save products to localStorage
      window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
      saveProductsStateAndSync(updatedProducts);

      // Create stock movement
      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productName: getLocalizedField(targetProd.name, activeLang),
        productCode: targetProd.sku || targetProd.barcode,
        movementType: "manual_adjustment",
        quantity: qtyVal,
        warehouse: activeWh.name,
        shelf: shelfCode,
        note: activeLang === "en" ? "Shelf Placement" : "Raf Konum Yerleşimi",
        createdAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + " (Bugün)",
      };

      const updatedMovements = [newMovement, ...movements];
      window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(updatedMovements));
      setMovements(updatedMovements);

      // Reset selection
      setPlaceProductId("");
      setPlaceQty(1);

      playSuccessClick();
      setShowAiThumbsUp(true);
      setTimeout(() => setShowAiThumbsUp(false), 1500);
      
      showSuccess(
        activeLang === "en" 
          ? `"${getLocalizedField(targetProd.name, activeLang)}" successfully placed at [${activeWh.name} - ${shelfCode}].` 
          : `"${getLocalizedField(targetProd.name, "tr")}" başarıyla [${activeWh.name} - ${shelfCode}] konumuna yerleştirildi.`
      );
    } catch (e: any) {
      showError(`Yerleşim sırasında hata: ${e.message || e}`);
    }
  };

  const handleShelfCardClick = (shelfCode: string) => {
    if (placeProductId) {
      executeDirectPlacement(placeProductId, shelfCode, placeQty || 1);
    } else {
      setPlaceShelf(shelfCode);
      const formEl = document.getElementById("product-placement-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
        formEl.classList.add("ring-4", "ring-emerald-400/50");
        setTimeout(() => {
          formEl.classList.remove("ring-4", "ring-emerald-400/50");
        }, 1500);
      }
    }
  };





  // Resizable Panel layout states
  const [leftWidth, setLeftWidth] = useState(50); // 50% default width
  const [isResizing, setIsResizing] = useState(false);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const container = document.getElementById("warehouse-resizable-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftWidth(Math.max(25, Math.min(75, percent)));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Language Selection
  const [language, setLanguage] = useState<LanguageCode>("tr");

  // Authentication & Store slugs
  const [currentUser, setCurrentUser] = useState<any>(null);
  const isAuthorized = !currentUser || ["owner", "storeOwner", "manager", "superadmin", "top_manager", "store_manager"].includes(currentUser?.role || "");
  const [storeSlug, setStoreSlug] = useState("obdtr");
  const [storeName, setStoreName] = useState("OBDTR Diagnostics");

  // Core Data States
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Active / Selected UI states
  const [activeWarehouseId, setActiveWarehouseId] = useState<string>("");
  const [productSearch, setProductSearch] = useState("");
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null);
  const [editingWarehouseName, setEditingWarehouseName] = useState("");
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editingZoneName, setEditingZoneName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'placement' | 'transfer' | 'audit' | 'zpl' | 'picking'>('placement');

  // Shelf transfer and deletion states
  const [isShelfTransferOpen, setIsShelfTransferOpen] = useState(false);
  const [shelfTransferProductId, setShelfTransferProductId] = useState<string | null>(null);
  const [shelfTransferFromShelf, setShelfTransferFromShelf] = useState<string>("");
  const [shelfTransferToWarehouse, setShelfTransferToWarehouse] = useState<string>("");
  const [shelfTransferToShelf, setShelfTransferToShelf] = useState<string>("");
  const [shelfTransferQty, setShelfTransferQty] = useState<string>("1");

  // Drag scroll whiteboard states
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Feedback Alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAiThumbsUp, setShowAiThumbsUp] = useState(false);

  // Add Warehouse States
  const [isNewWarehouseModalOpen, setIsNewWarehouseModalOpen] = useState(false);
  const [newWhName, setNewWhName] = useState("");
  const [newWhCity, setNewWhCity] = useState("Batumi");
  const [newWhPurpose, setNewWhPurpose] = useState("Satışa hazır ürün stoğu");

  // Unified state and Supabase synchronizer function
  const saveProductsStateAndSync = async (updatedList: ProductRecord[]) => {
    // 1. Update React state immediately for snappy UX
    setProducts(updatedList);

    // 2. Save to local storage
    if (storeSlug) {
      window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedList));
    }

    // 3. Compare with previous products state and push dirty rows to database
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      let targetCompanyId = "a123bc45-6789-abcd-ef01-234567890123";
      try {
        const { data: compData } = await supabase
          .from("companies")
          .select("id")
          .eq("code", storeSlug || "obdtr")
          .single();
        if (compData && compData.id) {
          targetCompanyId = compData.id;
        }
      } catch (e) {
        console.error("Failed to look up company ID in saveProductsStateAndSync:", e);
      }

      const finalList = [...updatedList];
      let stateChanged = false;

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const updatesPayload: any[] = [];
      const insertsPayload: any[] = [];

      for (let i = 0; i < finalList.length; i++) {
        const prod = finalList[i];
        const oldProd = products.find(p => p.id === prod.id);
        const hasChanged = !oldProd || 
          oldProd.quantity !== prod.quantity || 
          oldProd.warehouse !== prod.warehouse || 
          oldProd.shelf !== prod.shelf;

        if (hasChanged) {
          const isUuid = uuidRegex.test(prod.id);
          if (isUuid && oldProd) {
            updatesPayload.push({
              id: prod.id,
              quantity: parseInt(prod.quantity) || 0,
              warehouse: prod.warehouse || null,
              shelf: prod.shelf || null
            });
          } else if (!oldProd) {
            insertsPayload.push({ index: i, prod });
          }
        }
      }

      // Execute bulk updates in parallel/single upsert call
      if (updatesPayload.length > 0) {
        try {
          const { error } = await supabase
            .from("offerable_items")
            .upsert(updatesPayload);
          if (error) {
            console.error("Bulk Supabase update failed:", error.message);
          }
        } catch (e) {
          console.error("Bulk Supabase request failed:", e);
        }
      }

      // Execute sequential inserts for new products (usually just 1 item)
      for (const item of insertsPayload) {
        const { prod, index } = item;
        try {
          const { data, error } = await supabase
            .from("offerable_items")
            .insert({
              company_id: targetCompanyId,
              type: "product",
              name: prod.name,
              category: prod.category || "Genel",
              brand: prod.brand || "",
              code: prod.sku || `SKU-${Date.now()}`,
              barcode: prod.barcode || "",
              quantity: parseInt(prod.quantity) || 0,
              warehouse: prod.warehouse || null,
              shelf: prod.shelf || null,
              sale_price: parseFloat(prod.salePrice) || null,
              purchase_price: parseFloat(prod.purchasePrice) || null,
              description: prod.description || "",
              photo_urls: prod.imageUrl ? [prod.imageUrl] : []
            })
            .select()
            .single();

          if (error) {
            console.error("Database insert failed for new product transfer:", error.message);
          } else if (data) {
            finalList[index] = {
              ...prod,
              id: data.id
            };
            stateChanged = true;
          }
        } catch (e) {
          console.error("Supabase insert request failed:", e);
        }
      }

      if (stateChanged) {
        setProducts(finalList);
        if (storeSlug) {
          window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(finalList));
        }
      }
    }
  };

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
  const [shelfCapacities, setShelfCapacities] = useState<{ [shelfCode: string]: ShelfCapacity }>({});
  const [shelfAliases, setShelfAliases] = useState<Record<string, string>>({});
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);

  // Product Placement States
  const [placeProductId, setPlaceProductId] = useState("");
  const [placeShelf, setPlaceShelf] = useState("");
  const [placeQty, setPlaceQty] = useState(1);
  const [placeNote, setPlaceNote] = useState("Raf Konum Yerleşimi");

  // Transfer Form States
  const [transferProductId, setTransferProductId] = useState("");
  const [transferDestWhId, setTransferDestWhId] = useState("");
  const [transferDestShelf, setTransferDestShelf] = useState("");
  const [transferQty, setTransferQty] = useState(1);
  const [transferNote, setTransferNote] = useState("Depolar Arası Sevkiyat");

  // Audit (Stok Sayım) States
  const [isAuditActive, setIsAuditActive] = useState(false);
  const [auditShelfSelections, setAuditShelfSelections] = useState<string[]>([]);
  const [auditCurrentShelf, setAuditCurrentShelf] = useState("");
  const [auditCounts, setAuditCounts] = useState<{ [shelfAndSku: string]: number }>({});
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // ZPL Barkod Laboratuvarı States
  const [zplText, setZplText] = useState("");
  const [zplLabelSize, setZplLabelSize] = useState<"2x1" | "3x2">("3x2");
  const [zplProductId, setZplProductId] = useState("");

  // Picking (Sipariş Toplama) States
  const [pickingItems, setPickingItems] = useState<{ productId: string, sku: string, name: string, quantityNeeded: number }[]>([]);
  const [pickingRouteSteps, setPickingRouteSteps] = useState<{ shelf: string, sku: string, name: string, quantityToPick: number, picked: boolean }[]>([]);
  const [isPickingSessionActive, setIsPickingSessionActive] = useState(false);
  const [pickingAddProductId, setPickingAddProductId] = useState("");
  const [pickingAddQty, setPickingAddQty] = useState(1);

  // Warehouse Whiteboard Studio States
  const [isWhiteboardMode, setIsWhiteboardMode] = useState(false);
  const [selectedWhiteboardCorridorZone, setSelectedWhiteboardCorridorZone] = useState("");
  const [selectedWhiteboardShelfCode, setSelectedWhiteboardShelfCode] = useState<string | null>(null);
  const [draggedZone, setDraggedZone] = useState<string | null>(null);
  const [resizingCorridorZone, setResizingCorridorZone] = useState<string | null>(null);
  const [resizeType, setResizeType] = useState<"depth" | "tiers" | null>(null);
  const [resizeStartCoord, setResizeStartCoord] = useState(0);
  const [resizeStartValue, setResizeStartValue] = useState(0);

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

  const saveShelfCapacities = (updated: { [shelfCode: string]: ShelfCapacity }) => {
    window.localStorage.setItem("hbs-shelf-capacities", JSON.stringify(updated));
    setShelfCapacities(updated);
  };

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

  const handleSaveWarehouseName = (whId: string) => {
    if (!editingWarehouseName.trim()) {
      setEditingWarehouseId(null);
      return;
    }
    const updated = warehouses.map(w => 
      w.id === whId ? { ...w, name: editingWarehouseName.trim() } : w
    );
    setWarehouses(updated);
    
    // Save to local storage registeredStores
    const storesStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
    const registeredStores = JSON.parse(storesStr);
    const updatedStores = registeredStores.map((s: any) => {
      if (s.code === storeSlug) {
        return { ...s, warehouses: updated };
      }
      return s;
    });
    window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
    setEditingWarehouseId(null);
  };

  const handleSaveZoneName = (oldZone: string) => {
    if (!editingZoneName.trim() || editingZoneName.trim() === oldZone) {
      setEditingZoneId(null);
      return;
    }
    if (corridors.some(c => c.zone === editingZoneName.trim())) {
      showError("Bu reyon adı zaten kullanılıyor.");
      setEditingZoneId(null);
      return;
    }
    const updated = corridors.map(c => 
      c.zone === oldZone ? { ...c, zone: editingZoneName.trim() } : c
    );
    setCorridors(updated);
    setEditingZoneId(null);
  };

  const loadDatabase = () => {
    try {
      const userStr = window.localStorage.getItem("hbs-current-user");
      const activeUser = userStr ? JSON.parse(userStr) : null;
      const slug = activeUser?.storeSlugs?.[0] || "obdtr";

      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      const loadLocalFallback = () => {
        const prodStr = window.localStorage.getItem(`hbs-store-products-${slug}`);
        let parsedProducts: ProductRecord[] = [];
        if (prodStr) {
          try {
            parsedProducts = JSON.parse(prodStr);
            parsedProducts = parsedProducts.filter((p: any) => p.brand !== "DELETED" && p.category !== "DELETED");
          } catch (e) {}
        }

        if (slug === "ozgur-motor") {
          const ozgurCount = parsedProducts.filter((p: any) => 
            p.id.startsWith("prod-toyota-") || 
            p.id.startsWith("prod-mercedes-") || 
            p.id.startsWith("prod-bmw-")
          ).length;

          if (ozgurCount < 400) {
            const { generateOzgurMotorProducts } = require("@/lib/demoData");
            const ozgurProducts = generateOzgurMotorProducts();
            const filtered = parsedProducts.filter((p: any) => 
              !p.id.startsWith("prod-toyota-") && 
              !p.id.startsWith("prod-mercedes-") && 
              !p.id.startsWith("prod-bmw-") && 
              !p.id.startsWith("prod-opel-") && 
              !p.id.startsWith("prod-ford-") && 
              !p.id.startsWith("prod-subaru-") && 
              !p.id.startsWith("prod-honda-") && 
              !p.id.startsWith("prod-hyundai-")
            );
            parsedProducts = [...filtered, ...ozgurProducts];
            window.localStorage.setItem(`hbs-store-products-${slug}`, JSON.stringify(parsedProducts));
          }
        }
        setProducts(parsedProducts);
      };

      if (isSupabaseConfigured && slug) {
        supabase
          .from("offerable_items")
          .select("*, companies!inner(code)")
          .eq("companies.code", slug)
          .then(({ data, error }) => {
            if (data && !error) {
              const mapped: ProductRecord[] = data
                .filter((item: any) => item.brand !== "DELETED" && item.category !== "DELETED")
                .map((item: any) => ({
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
                  quantity: item.quantity ? String(item.quantity) : "10",
                  warehouse: item.warehouse || "Ana Depo",
                  shelf: item.shelf || "",
                  entryDate: "",
                  exitDate: "",
                  pricingMode: item.sale_price ? "fixed" : "quote",
                  visibility: item.is_visible_in_storefront ? "visible" : "hidden",
                  imageUrl: item.photo_urls?.[0] || "/product-images/diagnostic-scanner.svg",
                  videoUrl: item.video_urls?.[0] || "",
                  variants: [],
                  galleryUrls: item.photo_urls || (item.photo_urls?.[0] ? [item.photo_urls[0]] : ["/product-images/diagnostic-scanner.svg"])
                }));
              setProducts(mapped);
              window.localStorage.setItem(`hbs-store-products-${slug}`, JSON.stringify(mapped));
            } else {
              loadLocalFallback();
            }
          });
      } else {
        loadLocalFallback();
      }

      // B) Load Stock Movements
      const movStr = window.localStorage.getItem("hbs-store-stock-movements");
      if (movStr) {
        setMovements(JSON.parse(movStr));
      }

      // C) Load Shelf Capacities
      const capStr = window.localStorage.getItem("hbs-shelf-capacities");
      if (capStr) {
        setShelfCapacities(JSON.parse(capStr));
      }

      // E) Load Shelf Aliases
      const aliasStr = window.localStorage.getItem("hbs-shelf-aliases");
      if (aliasStr) {
        setShelfAliases(JSON.parse(aliasStr));
      }

      // D) Load Stock Transfers
      const transStr = window.localStorage.getItem("hbs-stock-transfers");
      if (transStr) {
        setStockTransfers(JSON.parse(transStr));
      }

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
          setCorridors(activeWh.corridorConfigs || parseShelvesToConfig(activeWh.shelves || []));
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

    const handleDeleteProductFromShelf = async (productId: string, productName: string) => {
    const answer = window.prompt(
      `"${productName}" ${activeLang === "en" ? "choose action:" : activeLang === "de" ? "Aktion wählen:" : activeLang === "ru" ? "выберите действие:" : activeLang === "ka" ? "აირჩიეთ ქმედება:" : "için yapmak istediğiniz işlemi seçin:"}\n\n` +
      wm.optDeleteOnlyShelf + "\n" +
      wm.optDeleteFull + "\n\n" +
      wm.promptDeleteOption
    );

    if (answer === "1") {
      // Remove from shelf
      const updated = products.map(p => p.id === productId ? { ...p, shelf: "" } : p);
      saveProductsStateAndSync(updated);
      window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
      alert(activeLang === "en" ? `"${productName}" shelf location cleared.` : activeLang === "de" ? `"${productName}" Regalposition gelöscht.` : activeLang === "ru" ? `Для товар "${productName}" очищено местоположение на полке.` : activeLang === "ka" ? `"${productName}" თაროს მდებარეობა გასუფთავდა.` : `"${productName}" raf konumu temizlendi.`);

      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from("offerable_items")
            .update({ shelf: "" })
            .eq("id", productId);
        } catch (e) {
          console.error("Supabase remove shelf error", e);
        }
      }
    } else if (answer === "2") {
      // Delete completely
      const updatedProducts = products.filter((p) => p.id !== productId);
      saveProductsStateAndSync(updatedProducts);
      window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
      alert(activeLang === "en" ? `"${productName}" deleted from inventory.` : activeLang === "de" ? `"${productName}" aus dem Inventar gelöscht.` : activeLang === "ru" ? `"${productName}" удален из инвентаря.` : activeLang === "ka" ? `"${productName}" წაიშალა ინვენტარიდან.` : `"${productName}" envanterden silindi.`);

      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      if (isSupabaseConfigured) {
        try {
          const { error, count } = await supabase
            .from("offerable_items")
            .delete({ count: "exact" })
            .eq("id", productId);
          if (error || count === 0) {
            await supabase
              .from("offerable_items")
              .update({ brand: "DELETED", category: "DELETED", is_visible_in_storefront: false })
              .eq("id", productId);
          }
        } catch (err) {
          console.error("Supabase delete error:", err);
        }
      }
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

  const playSuccessClick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio Context blocked:", e);
    }
  };

  // Wizard Generation Flow
  // Pointer drag-scroll handlers for whiteboard
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!whiteboardRef.current) return;
    if ((e.target as HTMLElement).closest('button, input, select, a')) return;
    setIsDragging(true);
    setStartX(e.pageX - whiteboardRef.current.offsetLeft);
    setStartY(e.pageY - whiteboardRef.current.offsetTop);
    setScrollLeft(whiteboardRef.current.scrollLeft);
    setScrollTop(whiteboardRef.current.scrollTop);
    whiteboardRef.current.style.cursor = "grabbing";
    whiteboardRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !whiteboardRef.current) return;
    e.preventDefault();
    const x = e.pageX - whiteboardRef.current.offsetLeft;
    const y = e.pageY - whiteboardRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    whiteboardRef.current.scrollLeft = scrollLeft - walkX;
    whiteboardRef.current.scrollTop = scrollTop - walkY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (whiteboardRef.current) {
      whiteboardRef.current.style.cursor = "grab";
      whiteboardRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Drag and Drop reordering for corridors in Whiteboard
  const handleCorridorDragStart = (e: React.DragEvent, zone: string) => {
    if (!isAuthorized) return;
    setDraggedZone(zone);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCorridorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCorridorDrop = (e: React.DragEvent, targetZone: string) => {
    e.preventDefault();
    if (!isAuthorized || !draggedZone || draggedZone === targetZone) return;

    const sourceIdx = corridors.findIndex(c => c.zone === draggedZone);
    const targetIdx = corridors.findIndex(c => c.zone === targetZone);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const updated = [...corridors];
    const [removed] = updated.splice(sourceIdx, 1);
    updated.splice(targetIdx, 0, removed);
    setCorridors(updated);
    setDraggedZone(null);

    // Persist layout automatically
    handleSaveLayout(updated);
  };

  const handleResizeStart = (e: React.PointerEvent, zone: string, type: "depth" | "tiers", initialVal: number) => {
    if (!isAuthorized) return;
    e.preventDefault();
    e.stopPropagation();
    setResizingCorridorZone(zone);
    setResizeType(type);
    setResizeStartCoord(type === "depth" ? e.clientX : e.clientY);
    setResizeStartValue(initialVal);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent, zone: string) => {
    if (resizingCorridorZone !== zone || !resizeType) return;
    e.preventDefault();
    e.stopPropagation();

    const corrIdx = corridors.findIndex(c => c.zone === zone);
    if (corrIdx === -1) return;
    const corr = corridors[corrIdx];

    if (resizeType === "depth") {
      const diffX = e.clientX - resizeStartCoord;
      const step = 90; // approx slot width in whiteboard grid
      const newVal = Math.max(1, Math.min(20, resizeStartValue + Math.round(diffX / step)));
      if (newVal !== corr.depth) {
        const updated = corridors.map((item, i) => i === corrIdx ? { ...item, depth: newVal } : item);
        setCorridors(updated);
      }
    } else if (resizeType === "tiers") {
      const diffY = e.clientY - resizeStartCoord;
      const step = 50; // approx tier height in whiteboard grid
      const newVal = Math.max(1, Math.min(10, resizeStartValue + Math.round(diffY / step)));
      if (newVal !== corr.tiers) {
        const updated = corridors.map((item, i) => i === corrIdx ? { ...item, tiers: newVal } : item);
        setCorridors(updated);
      }
    }
  };

  const handleResizeEnd = (e: React.PointerEvent, zone: string) => {
    if (resizingCorridorZone !== zone) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setResizingCorridorZone(null);
    setResizeType(null);

    // Save final layout to local storage using functional update to avoid stale closures
    setCorridors((prevCorridors) => {
      handleSaveLayout(prevCorridors);
      return prevCorridors;
    });
  };

  const handleDeleteWarehouse = (warehouseId: string, warehouseName: string) => {
    const itemsCount = products.filter((p) => p.warehouse.toLowerCase() === warehouseName.toLowerCase()).length;
    if (itemsCount > 0) {
      alert(wm.errHasInventory.replace("{count}", itemsCount.toString()));
      return;
    }

    if (!window.confirm(wm.confirmDeleteWh.replace("{name}", warehouseName))) {
      return;
    }

    const updatedWarehouses = warehouses.filter(w => w.id !== warehouseId);
    setWarehouses(updatedWarehouses);
    if (activeWarehouseId === warehouseId && updatedWarehouses.length > 0) {
      setActiveWarehouseId(updatedWarehouses[0].id);
    }

    try {
      const storesStr = window.localStorage.getItem("hbs-registered-stores");
      if (storesStr) {
        const registeredStores = JSON.parse(storesStr);
        const updatedStores = registeredStores.map((s: any) => {
          if (s.code === storeSlug) {
            return { ...s, warehouses: updatedWarehouses };
          }
          return s;
        });
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      }
    } catch (e) {
      console.error("Delete warehouse failed:", e);
    }

    showSuccess(wm.deleteWhSuccess.replace("{name}", warehouseName));
  };

  const handleAutoPlaceProducts = () => {
    const activeWh = warehouses.find(w => w.id === activeWarehouseId);
    if (!activeWh || !activeWh.shelves || activeWh.shelves.length === 0) {
      showError(wm.errNoShelvesForAuto);
      return;
    }

    const emptyShelves = activeWh.shelves.filter(sh => 
      !products.some(p => 
        p.warehouse.toLowerCase() === activeWh.name.toLowerCase() && 
        p.shelf.toLowerCase() === sh.toLowerCase()
      )
    );

    if (emptyShelves.length === 0) {
      showError(wm.errNoFreeShelf);
      return;
    }

    let shelfIndex = 0;
    const updatedProducts = products.map(p => {
      if (p.warehouse.toLowerCase() === activeWh.name.toLowerCase() && (!p.shelf || p.shelf.trim() === "")) {
        const targetShelf = emptyShelves[shelfIndex % emptyShelves.length];
        shelfIndex++;
        return { ...p, shelf: targetShelf };
      }
      return p;
    });

    saveProductsStateAndSync(updatedProducts);
    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
    showSuccess(wm.autoPlaceSuccess.replace("{count}", shelfIndex.toString()));
  };

  const handleShelfTransfer = () => {
    if (!shelfTransferProductId) return;
    const targetProd = products.find(p => p.id === shelfTransferProductId);
    if (!targetProd) return;

    const qtyVal = parseInt(shelfTransferQty) || 0;
    const currentQty = parseInt(targetProd.quantity) || 0;

    if (qtyVal <= 0) {
      alert(wm.alertValidQty);
      return;
    }

    if (qtyVal > currentQty) {
      alert(wm.alertStockLimitExceeded.replace("{max}", currentQty.toString()));
      return;
    }

    let updatedProducts = [...products];

    if (qtyVal === currentQty) {
      updatedProducts = products.map(p => 
        p.id === shelfTransferProductId 
          ? { ...p, warehouse: shelfTransferToWarehouse, shelf: shelfTransferToShelf } 
          : p
      );
    } else {
      updatedProducts = products.map(p => 
        p.id === shelfTransferProductId 
          ? { ...p, quantity: String(currentQty - qtyVal) } 
          : p
      );
      const existingAtDest = products.find(p => 
        p.name === targetProd.name && 
        p.sku === targetProd.sku && 
        p.warehouse.toLowerCase() === shelfTransferToWarehouse.toLowerCase() && 
        p.shelf.toLowerCase() === shelfTransferToShelf.toLowerCase()
      );

      if (existingAtDest) {
        updatedProducts = updatedProducts.map(p => 
          p.id === existingAtDest.id 
            ? { ...p, quantity: String((parseInt(p.quantity) || 0) + qtyVal) } 
            : p
        );
      } else {
        const copy: ProductRecord = {
          ...targetProd,
          id: typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : `prod-copy-${Date.now()}`,
          quantity: String(qtyVal),
          warehouse: shelfTransferToWarehouse,
          shelf: shelfTransferToShelf
        };
        updatedProducts.push(copy);
      }
    }

    saveProductsStateAndSync(updatedProducts);
    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
    setIsShelfTransferOpen(false);
    showSuccess(wm.dispatchSuccess.replace("{name}", getLocalizedField(targetProd.name, activeLang)));
  };

  const handleAddNewWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhName.trim()) {
      alert(wm.alertValidWhName);
      return;
    }

    const id = `wh-${Date.now()}`;
    const newWh: Warehouse = {
      id,
      name: newWhName.trim(),
      city: newWhCity.trim(),
      purpose: newWhPurpose.trim(),
      customerVisible: false,
      zones: ["A", "B", "C"],
      shelves: [
        "A-01", "A-02", "A-03",
        "B-01", "B-02", "B-03",
        "C-01", "C-02", "C-03"
      ],
      corridorConfigs: [
        { zone: "A", depth: 3, tiers: 3 },
        { zone: "B", depth: 3, tiers: 3 },
        { zone: "C", depth: 3, tiers: 3 }
      ],
      capacity: 1000,
      used: 0
    };

    const updatedWarehouses = [...warehouses, newWh];
    setWarehouses(updatedWarehouses);
    setActiveWarehouseId(id);
    setShaperZones("A, B, C");
    setCorridors(newWh.corridorConfigs || []);

    // Save to registered stores
    try {
      const storesStr = window.localStorage.getItem("hbs-registered-stores") || "[]";
      const registeredStores = JSON.parse(storesStr);
      const updatedStores = registeredStores.map((s: any) => {
        if (s.code === storeSlug) {
          return { ...s, warehouses: updatedWarehouses };
        }
        return s;
      });
      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
    } catch (e) {
      console.error("Save new warehouse failed:", e);
    }

    setIsNewWarehouseModalOpen(false);
    setNewWhName("");
    showSuccess(wm.createWhSuccess.replace("{name}", newWh.name));
  };

  const handleWizardCountChange = (count: number) => {
    const val = Math.max(1, Math.min(10, count));
    setWizardCount(val);
    const names = Array.from({ length: val }, (_, i) => wizardNames[i] || `Depo ${i + 1}`);
    setWizardNames(names);
  };

  const handleSaveWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      showError(wm.errUnauthorizedCreate);
      return;
    }
    if (wizardNames.some((n) => !n.trim())) {
      showError(wm.errEmptyWhName);
      return;
    }

    try {
      const existingWhs = warehouses || [];
      const initialWarehouses: Warehouse[] = wizardNames.map((name, i) => {
        const existing = existingWhs[i];
        if (existing) {
          return {
            ...existing,
            name: name.trim(),
          };
        }
        const id = `wh-${Date.now()}-${i}`;
        const zones = ["A", "B"];
        const shelves = ["A-01", "A-02", "B-01", "B-02"];
        return {
          id,
          name: name.trim(),
          purpose: i === 0 ? wm.mainWhPurpose : wm.backupWhPurpose.replace("{num}", String(i + 1)),
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
      setCorridors(initialWarehouses[0].corridorConfigs || parseShelvesToConfig(initialWarehouses[0].shelves || []));
      setShowWizard(false);
      showSuccess(activeLang === "en" ? `Wizard completed! ${initialWarehouses.length} warehouses successfully created.` : activeLang === "de" ? `Assistent abgeschlossen! ${initialWarehouses.length} Lager erfolgreich erstellt.` : activeLang === "ru" ? `Мастер настройки успешно завершен! Создано складов: ${initialWarehouses.length}.` : activeLang === "ka" ? `ოსტატი დასრულდა! წარმატებით შეიქმნა ${initialWarehouses.length} საწყობი.` : `Sihirbaz tamamlandı! ${initialWarehouses.length} adet depo başarıyla oluşturuldu.`);
    } catch (e: any) {
      showError(activeLang === "en" ? `Error saving wizard: ${e.message || e}` : activeLang === "de" ? `Fehler beim Speichern des Assistenten: ${e.message || e}` : activeLang === "ru" ? `Ошибка при сохранении мастера: ${e.message || e}` : activeLang === "ka" ? `შეცდომა ოსტატის შენახვისას: ${e.message || e}` : `Sihirbaz kaydedilirken hata: ${e.message || e}`);
    }
  };

  // Active Warehouse details
  const activeWh = useMemo(() => {
    return warehouses.find((w) => w.id === activeWarehouseId) || null;
  }, [warehouses, activeWarehouseId]);

  const activeLang = language || "tr";
  const t = translations[activeLang] || translations.tr;
  const wm = whMessages[activeLang] || whMessages.tr;

  // Layout Shaper logic
  const handleSaveLayout = (customCorridors?: CorridorConfig[]) => {
    if (!activeWh) return;
    if (!isAuthorized) {
      showError(activeLang === "en" ? "Insufficient Permissions! Only Store Owner and Managers can change warehouse shelf layouts." : activeLang === "de" ? "Unzureichende Berechtigungen! Nur der Ladenbesitzer und Manager können die Regallayouts des Lagers ändern." : activeLang === "ru" ? "Недостаточно прав! Только владелец магазина и управляющие могут изменять планировку полок склада." : activeLang === "ka" ? "არასაკმარისი უფლებები! საწყობის თაროების განლაგების შეცვლა შეუძლიათ მხოლოდ მაღაზიის მფლობელს და მენეჯერებს." : "Yetersiz Yetki! Sadece Mağaza Sahibi (Owner) ve Yöneticiler (Manager) depo raf yerleşimlerini değiştirebilir.");
      return;
    }

    const currentCorridors = customCorridors || corridors;

    try {
      const generatedShelves: string[] = [];
      const parsedZones: string[] = [];
      const updatedCapacities = { ...shelfCapacities };

      currentCorridors.forEach((corr) => {
        const zone = corr.zone.trim().toUpperCase();
        if (zone) {
          if (!parsedZones.includes(zone)) {
            parsedZones.push(zone);
          }
          for (let d = 1; d <= corr.depth; d++) {
            const slotStr = d < 10 ? `0${d}` : `${d}`;
            for (let t = 1; t <= corr.tiers; t++) {
              const tierStr = t < 10 ? `0${t}` : `${t}`;
              const baseCode = `${zone}-${slotStr}-${tierStr}`;

              const sides = corr.isDoubleRow ? ["S1", "S2"] : [""];
              sides.forEach((side) => {
                const sideSuffix = side ? `-${side}` : "";
                const sideCode = `${baseCode}${sideSuffix}`;

                const binsCount = corr.binsConfig?.[sideCode] || 1;
                if (binsCount > 1) {
                  for (let b = 1; b <= binsCount; b++) {
                    const binCode = `${sideCode}-B${b}`;
                    generatedShelves.push(binCode);
                    if (!updatedCapacities[binCode]) {
                      updatedCapacities[binCode] = {
                        maxWeight: Math.round(100 / binsCount),
                        maxVolume: Number((1.0 / binsCount).toFixed(3)),
                      };
                    }
                  }
                } else {
                  generatedShelves.push(sideCode);
                  if (!updatedCapacities[sideCode]) {
                    updatedCapacities[sideCode] = { maxWeight: 100, maxVolume: 1.0 };
                  }
                }
              });
            }
          }
        }
      });

      window.localStorage.setItem("hbs-shelf-capacities", JSON.stringify(updatedCapacities));
      setShelfCapacities(updatedCapacities);

      if (parsedZones.length === 0) {
        showError(activeLang === "en" ? "Please define at least one zone." : activeLang === "de" ? "Bitte definieren Sie mindestens eine Zone." : activeLang === "ru" ? "Пожалуйста, определите хотя бы одну зону." : activeLang === "ka" ? "გთხოვთ განსაზღვროთ მინიმუმ ერთი ზონა." : "Lütfen en az bir adet bölge tanımlayın.");
        return;
      }

      const updatedWarehouses = warehouses.map((w) =>
        w.id === activeWarehouseId
          ? { ...w, zones: parsedZones, shelves: generatedShelves, corridorConfigs: currentCorridors }
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
      showSuccess(activeLang === "en" ? `"${activeWh.name}" shelf layout (${generatedShelves.length} slots) successfully shapered!` : activeLang === "de" ? `"${activeWh.name}" Regallayout (${generatedShelves.length} Fächer) erfolgreich gestaltet!` : activeLang === "ru" ? `Планировка полок склада "${activeWh.name}" (${generatedShelves.length} ячеек) успешно сформирована!` : activeLang === "ka" ? `"${activeWh.name}" თაროების განლაგება (${generatedShelves.length} სლოტი) წარმატებით ჩამოყალიბდა!` : `"${activeWh.name}" raf düzeni (${generatedShelves.length} raf konumu) başarıyla şekillendirildi!`);
    } catch (e: any) {
      showError(activeLang === "en" ? `Error saving layout: ${e.message || e}` : activeLang === "de" ? `Fehler beim Speichern des Layouts: ${e.message || e}` : activeLang === "ru" ? `Ошибка при сохранении планировки: ${e.message || e}` : activeLang === "ka" ? `შეცდომა განლაგების შენახვისას: ${e.message || e}` : `Düzen kaydedilirken hata: ${e.message || e}`);
    }
  };

  // Product placement
  const handlePlaceProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeProductId) {
      showError(activeLang === "en" ? "Please select a product to place." : activeLang === "de" ? "Bitte wählen Sie ein Produkt zum Platzieren aus." : activeLang === "ru" ? "Пожалуйста, выберите товар для размещения." : activeLang === "ka" ? "გთხოვთ აირჩიოთ პროდუქტი განსათავსებლად." : "Lütfen yerleştirmek için bir ürün seçin.");
      return;
    }
    if (!placeShelf) {
      showError(activeLang === "en" ? "Please select a shelf location." : activeLang === "de" ? "Bitte wählen Sie eine Regalposition aus." : activeLang === "ru" ? "Пожалуйста, выберите положение полки." : activeLang === "ka" ? "გთხოვთ აირჩიოთ თაროს მდებარეობა." : "Lütfen raf konumu seçin.");
      return;
    }
    if (!activeWh) return;

    const qty = Number(placeQty);
    if (!qty || qty <= 0) {
      showError(activeLang === "en" ? "Quantity must be greater than zero." : activeLang === "de" ? "Menge muss größer als Null sein." : activeLang === "ru" ? "Количество должно быть больше нуля." : activeLang === "ka" ? "რაოდენობა უნდა იყოს ნულზე მეტი." : "Miktar sıfırdan büyük olmalıdır.");
      return;
    }

    try {
      const targetProd = products.find((p) => String(p.id) === String(placeProductId));
      if (!targetProd) {
        showError(activeLang === "en" ? "Product not found!" : "Yerleştirilmek istenen ürün bulunamadı!");
        return;
      }

      // Calculate current occupied weight & volume on placeShelf
      const currentProductsOnShelf = products.filter(
        (p) =>
          safeLower(p.warehouse) === safeLower(activeWh.name) &&
          safeLower(p.shelf) === safeLower(placeShelf) &&
          String(p.id) !== String(placeProductId)
      );

      let occupiedWeight = 0;
      let occupiedVolume = 0;

      currentProductsOnShelf.forEach((p) => {
        const prodQty = parseFloat(p.quantity) || 0;
        const prodWeight = parseFloat(p.weight || "1.0") || 1.0;
        const prodVolume = parseFloat(p.volume || "0.01") || 0.01;
        occupiedWeight += prodQty * prodWeight;
        occupiedVolume += prodQty * prodVolume;
      });

      const newProdWeight = parseFloat(targetProd.weight || "1.0") || 1.0;
      const newProdVolume = parseFloat(targetProd.volume || "0.01") || 0.01;
      const newPlacementWeight = qty * newProdWeight;
      const newPlacementVolume = qty * newProdVolume;

      const totalWeightAfter = occupiedWeight + newPlacementWeight;
      const totalVolumeAfter = occupiedVolume + newPlacementVolume;

      const shelfCap = shelfCapacities[placeShelf] || { maxWeight: 100, maxVolume: 1.0 };

      if (totalWeightAfter > shelfCap.maxWeight) {
        showError(activeLang === "en" ? `Capacity Exceeded! Shelf Weight Limit: ${shelfCap.maxWeight} kg. Requested load: ${totalWeightAfter.toFixed(1)} kg.` : activeLang === "de" ? `Kapazitätsüberschreitung! Regalgewichtslimit: ${shelfCap.maxWeight} kg. Angeforderte Last: ${totalWeightAfter.toFixed(1)} kg.` : activeLang === "ru" ? `Превышение емкости! Лимит веса полки: ${shelfCap.maxWeight} кг. Запрашиваемый вес: ${totalWeightAfter.toFixed(1)} кг.` : activeLang === "ka" ? `ტევადობის გადაჭარბება! თაროს წონის ლიმიტი: ${shelfCap.maxWeight} კგ. მოთხოვნილი წონა: ${totalWeightAfter.toFixed(1)} კგ.` : `Kapasite Aşımı! Raf Ağırlık Limiti: ${shelfCap.maxWeight} kg. Yerleştirilmek istenen toplam yük: ${totalWeightAfter.toFixed(1)} kg.`);
        return;
      }

      if (totalVolumeAfter > shelfCap.maxVolume) {
        showError(activeLang === "en" ? `Capacity Exceeded! Shelf Volume Limit: ${shelfCap.maxVolume} m³. Requested volume: ${totalVolumeAfter.toFixed(3)} m³.` : activeLang === "de" ? `Kapazitätsüberschreitung! Regalgewichtslimit: ${shelfCap.maxVolume} m³. Angeforderte Last: ${totalVolumeAfter.toFixed(3)} m³.` : activeLang === "ru" ? `Превышение емкости! Лимит объема полки: ${shelfCap.maxVolume} м³. Запрашиваемый объем: ${totalVolumeAfter.toFixed(3)} м³.` : activeLang === "ka" ? `ტევადობის გადაჭარბება! თაროს მოცულობის ლიმიტი: ${shelfCap.maxVolume} მ³. მოთხოვნილი მოცულობა: ${totalVolumeAfter.toFixed(3)} მ³.` : `Kapasite Aşımı! Raf Hacim Limiti: ${shelfCap.maxVolume} m³. Yerleştirilmek istenen toplam hacim: ${totalVolumeAfter.toFixed(3)} m³.`);
        return;
      }

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
      window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
      saveProductsStateAndSync(updatedProducts);

      // Create stock movement
      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productName: getLocalizedField(targetProd.name, activeLang),
        productCode: targetProd.sku || targetProd.barcode,
        movementType: "manual_adjustment",
        quantity: qty,
        warehouse: activeWh.name,
        shelf: placeShelf,
        note: placeNote || (activeLang === "en" ? "Shelf Placement" : activeLang === "de" ? "Regalplatzierung" : activeLang === "ru" ? "Размещение на полке" : activeLang === "ka" ? "თაროზე განთავსება" : "Raf Konum Yerleşimi"),
        createdAt: new Date().toLocaleTimeString(activeLang === "ka" ? "ka-GE" : activeLang === "ru" ? "ru-RU" : activeLang === "de" ? "de-DE" : activeLang === "en" ? "en-US" : "tr-TR", { hour: "2-digit", minute: "2-digit" }) + (activeLang === "en" ? " (Today)" : activeLang === "de" ? " (Heute)" : activeLang === "ru" ? " (Сегодня)" : activeLang === "ka" ? " (დღეს)" : " (Bugün)"),
      };

      const updatedMovements = [newMovement, ...movements];
      window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(updatedMovements));
      setMovements(updatedMovements);

      setPlaceProductId("");
      setPlaceQty(1);
      setPlaceNote(activeLang === "en" ? "Shelf Placement" : activeLang === "de" ? "Regalplatzierung" : activeLang === "ru" ? "Размещение на полке" : activeLang === "ka" ? "თაროზე განთავსება" : "Raf Konum Yerleşimi");
      
      playSuccessClick();
      setShowAiThumbsUp(true);
      setTimeout(() => setShowAiThumbsUp(false), 1500);

      showSuccess(activeLang === "en" ? `"${getLocalizedField(targetProd.name, activeLang)}" successfully placed at [${activeWh.name} - ${placeShelf}].` : activeLang === "de" ? `"${getLocalizedField(targetProd.name, activeLang)}" erfolgreich am Standort [${activeWh.name} - ${placeShelf}] platziert.` : activeLang === "ru" ? `"${getLocalizedField(targetProd.name, activeLang)}" успешно размещен по адресу [${activeWh.name} - ${placeShelf}].` : activeLang === "ka" ? `"${getLocalizedField(targetProd.name, activeLang)}" წარმატებით განთავსდა ლოკაციაზე [${activeWh.name} - ${placeShelf}].` : `"${getLocalizedField(targetProd.name, "tr")}" başarıyla [${activeWh.name} - ${placeShelf}] konumuna yerleştirildi.`);
    } catch (e: any) {
      showError(activeLang === "en" ? `Error during placement: ${e.message || e}` : activeLang === "de" ? `Fehler bei der Regalplatzierung: ${e.message || e}` : activeLang === "ru" ? `Ошибка при размещении: ${e.message || e}` : activeLang === "ka" ? `შეცდომა განთავსებისას: ${e.message || e}` : `Yerleşim sırasında hata: ${e.message || e}`);
    }
  };

  const saveStockTransfers = (updated: StockTransfer[]) => {
    window.localStorage.setItem("hbs-stock-transfers", JSON.stringify(updated));
    setStockTransfers(updated);
  };

  const handleInitiateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferProductId) {
      showError("Lütfen transfer edilecek ürünü seçin.");
      return;
    }
    if (!transferDestWhId) {
      showError("Lütfen hedef depoyu seçin.");
      return;
    }
    if (!transferDestShelf) {
      showError("Lütfen hedef raf konumunu seçin.");
      return;
    }

    const qty = Number(transferQty);
    if (!qty || qty <= 0) {
      showError("Miktar sıfırdan büyük olmalıdır.");
      return;
    }

    const prod = products.find(p => p.id === transferProductId);
    if (!prod) return;

    const sourceQty = Number(prod.quantity) || 0;
    if (qty > sourceQty) {
      showError(`Yetersiz stok! Raftaki mevcut stok: ${sourceQty} adet.`);
      return;
    }

    const destWh = warehouses.find(w => w.id === transferDestWhId);
    if (!destWh) return;

    // Check shelf capacities on the destination shelf
    const destShelfCap = shelfCapacities[transferDestShelf] || { maxWeight: 100, maxVolume: 1.0 };
    const currentProductsOnDestShelf = products.filter(
      (p) =>
        p.warehouse.toLowerCase() === destWh.name.toLowerCase() &&
        p.shelf.toLowerCase() === transferDestShelf.toLowerCase()
    );

    let occupiedWeight = 0;
    let occupiedVolume = 0;
    currentProductsOnDestShelf.forEach((p) => {
      const pQty = parseFloat(p.quantity) || 0;
      const pW = parseFloat(p.weight || "1.0") || 1.0;
      const pV = parseFloat(p.volume || "0.01") || 0.01;
      occupiedWeight += pQty * pW;
      occupiedVolume += pQty * pV;
    });

    const newProdWeight = parseFloat(prod.weight || "1.0") || 1.0;
    const newProdVolume = parseFloat(prod.volume || "0.01") || 0.01;
    const incomingWeight = qty * newProdWeight;
    const incomingVolume = qty * newProdVolume;

    if (occupiedWeight + incomingWeight > destShelfCap.maxWeight) {
      showError(`Kapasite Aşımı! Hedef raf ağırlık limiti (${destShelfCap.maxWeight} kg) aşılıyor.`);
      return;
    }
    if (occupiedVolume + incomingVolume > destShelfCap.maxVolume) {
      showError(`Kapasite Aşımı! Hedef raf hacim limiti (${destShelfCap.maxVolume} m³) aşılıyor.`);
      return;
    }

    // Deduct immediately from source product (in-transit state)
    const updatedProducts = products.map(p => {
      if (p.id === transferProductId) {
        return {
          ...p,
          quantity: (sourceQty - qty).toString()
        };
      }
      return p;
    });

    // Create the transfer record
    const newTransfer: StockTransfer = {
      id: `trans-${Date.now()}`,
      sourceWh: prod.warehouse,
      destWh: destWh.name,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku || prod.barcode,
      quantity: qty,
      sourceShelf: prod.shelf,
      destShelf: transferDestShelf,
      status: 'in_transit',
      createdAt: new Date().toLocaleString(activeLang === "ka" ? "ka-GE" : activeLang === "ru" ? "ru-RU" : activeLang === "de" ? "de-DE" : activeLang === "en" ? "en-US" : "tr-TR"),
      note: transferNote || wm.autoPlacementNote
    };

    // Save
    const updatedTransfers = [newTransfer, ...stockTransfers];
    saveStockTransfers(updatedTransfers);

    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
    saveProductsStateAndSync(updatedProducts);

    // Create stock movement for source deduction
    const deductMovement: StockMovement = {
      id: `mov-${Date.now()}-out`,
      productName: getLocalizedField(prod.name, activeLang),
      productCode: prod.sku || prod.barcode,
      movementType: "stock_out",
      quantity: qty,
      warehouse: prod.warehouse,
      shelf: prod.shelf,
      note: wm.transferOutNote.replace("{dest}", destWh.name).replace("{shelf}", transferDestShelf),
      createdAt: new Date().toLocaleTimeString(activeLang === "ka" ? "ka-GE" : activeLang === "ru" ? "ru-RU" : activeLang === "de" ? "de-DE" : activeLang === "en" ? "en-US" : "tr-TR", { hour: "2-digit", minute: "2-digit" }) + (activeLang === "en" ? " (Today)" : activeLang === "de" ? " (Heute)" : activeLang === "ru" ? " (Сегодня)" : activeLang === "ka" ? " (დღეს)" : " (Bugün)")
    };
    const updatedMovements = [deductMovement, ...movements];
    window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(updatedMovements));
    setMovements(updatedMovements);

    // Reset fields
    setTransferProductId("");
    setTransferDestWhId("");
    setTransferDestShelf("");
    setTransferQty(1);
    setTransferNote(wm.autoPlacementNote);

    showSuccess(activeLang === "en" ? `Transfer initiated! Products on their way to "${destWh.name}".` : activeLang === "de" ? `Transfer gestartet! Produkte auf dem Weg zu "${destWh.name}".` : activeLang === "ru" ? `Перевод инициирован! Товары на пути к "${destWh.name}".` : activeLang === "ka" ? `გადაცემა დაიწყო! პროდუქტები გზაშია "${destWh.name}"-ისკენ.` : `Transfer işlemi başlatıldı! Ürünler "${destWh.name}" yolunda.`);
  };

  const handleConfirmTransfer = (transferId: string) => {
    const trans = stockTransfers.find(t => t.id === transferId);
    if (!trans) return;

    let productExistsInTarget = false;
    const updatedProducts = products.map(p => {
      if (
        p.sku === trans.sku &&
        p.warehouse.toLowerCase() === trans.destWh.toLowerCase() &&
        p.shelf.toLowerCase() === trans.destShelf.toLowerCase()
      ) {
        productExistsInTarget = true;
        return {
          ...p,
          quantity: (Number(p.quantity) + trans.quantity).toString()
        };
      }
      return p;
    });

    if (!productExistsInTarget) {
      const original = products.find(p => p.id === trans.productId);
      const newProductRecord: ProductRecord = {
        id: `prod-${Date.now()}`,
        name: trans.productName,
        category: original?.category || "Genel",
        brand: original?.brand || "Belirtilmemiş",
        model: original?.model || "",
        description: original?.description || "",
        salePrice: original?.salePrice || "0.00",
        purchasePrice: original?.purchasePrice || "0.00",
        barcode: original?.barcode || "",
        sku: trans.sku,
        oemCode: original?.oemCode || "",
        quantity: trans.quantity.toString(),
        warehouse: trans.destWh,
        shelf: trans.destShelf,
        weight: original?.weight,
        volume: original?.volume
      };
      updatedProducts.push(newProductRecord);
    }

    const updatedTransfers = stockTransfers.map(t => {
      if (t.id === transferId) {
        return { ...t, status: 'completed' as const };
      }
      return t;
    });

    saveStockTransfers(updatedTransfers);
    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
    saveProductsStateAndSync(updatedProducts);

    const addMovement: StockMovement = {
      id: `mov-${Date.now()}-in`,
      productName: trans.productName,
      productCode: trans.sku,
      movementType: "stock_in",
      quantity: trans.quantity,
      warehouse: trans.destWh,
      shelf: trans.destShelf,
      note: wm.transferInNote.replace("{source}", trans.sourceWh).replace("{shelf}", trans.sourceShelf),
      createdAt: new Date().toLocaleTimeString(activeLang === "ka" ? "ka-GE" : activeLang === "ru" ? "ru-RU" : activeLang === "de" ? "de-DE" : activeLang === "en" ? "en-US" : "tr-TR", { hour: "2-digit", minute: "2-digit" }) + (activeLang === "en" ? " (Today)" : activeLang === "de" ? " (Heute)" : activeLang === "ru" ? " (Сегодня)" : activeLang === "ka" ? " (დღეს)" : " (Bugün)")
    };
    const updatedMovements = [addMovement, ...movements];
    window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(updatedMovements));
    setMovements(updatedMovements);

    showSuccess(activeLang === "en" ? `Shipment successfully received and added to location [${trans.destWh} - ${trans.destShelf}].` : activeLang === "de" ? `Lieferung erfolgreich empfangen und dem Standort [${trans.destWh} - ${trans.destShelf}] hinzugefügt.` : activeLang === "ru" ? `Посылка успешно получена и добавлена в ячейку [${trans.destWh} - ${trans.destShelf}].` : activeLang === "ka" ? `გზავნილი წარმატებით მიღებულია და დაემატა ლოკაციაზე [${trans.destWh} - ${trans.destShelf}].` : `Sevkiyat başarıyla teslim alındı ve [${trans.destWh} - ${trans.destShelf}] konumuna eklendi.`);
  };

  const handleCancelTransfer = (transferId: string) => {
    const trans = stockTransfers.find(t => t.id === transferId);
    if (!trans || trans.status !== 'in_transit') return;

    // Refund stock to original
    const updatedProducts = products.map(p => {
      if (p.id === trans.productId) {
        return {
          ...p,
          quantity: (Number(p.quantity) + trans.quantity).toString()
        };
      }
      return p;
    });

    const updatedTransfers = stockTransfers.filter(t => t.id !== transferId);

    saveStockTransfers(updatedTransfers);
    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
    saveProductsStateAndSync(updatedProducts);

    // Create stock movement for refund
    const refundMovement: StockMovement = {
      id: `mov-${Date.now()}-refund`,
      productName: trans.productName,
      productCode: trans.sku,
      movementType: "stock_in",
      quantity: trans.quantity,
      warehouse: trans.sourceWh,
      shelf: trans.sourceShelf,
      note: `İptal Edilen Transfer İadesi`,
      createdAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + " (Bugün)"
    };
    const updatedMovements = [refundMovement, ...movements];
    window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(updatedMovements));
    setMovements(updatedMovements);

  };

  // ZPL Generator
  const generateZPL = (type: "product" | "shelf", data: any) => {
    if (type === "product") {
      const p = data as ProductRecord;
      const sizeStr = zplLabelSize === "3x2" ? "^PW600\n^LL400" : "^PW400\n^LL200";
      const zpl = `^XA
${sizeStr}
^LH30,30
^FO20,20^A0N,36,36^FD${p.name.substring(0, 24)}^FS
^FO20,65^A0N,24,24^FDSKU: ${p.sku || p.barcode}^FS
^FO20,95^A0N,24,24^FDFiyat: ${p.salePrice || "0.00"} EUR^FS
^FO20,125^A0N,24,24^FDDepo/Raf: ${p.warehouse} / ${p.shelf}^FS
^FO20,170^BY2,2.0,70^BCN,N,N,Y,N^FD${p.barcode || p.sku}^FS
^XZ`;
      setZplText(zpl);
    } else {
      const sh = data as string;
      const sizeStr = zplLabelSize === "3x2" ? "^PW600\n^LL400" : "^PW400\n^LL200";
      const zpl = `^XA
${sizeStr}
^LH30,30
^FO100,30^A0N,40,40^FDRAF ETIKETI^FS
^FO100,90^A0N,90,90^FD${sh}^FS
^FO100,210^BY3,3.0,100^BCN,N,N,Y,N^FD${sh}^FS
^XZ`;
      setZplText(zpl);
    }
  };

  // Audit Handlers
  const handleStartAudit = (shelves: string[]) => {
    if (shelves.length === 0) {
      showError("Lütfen sayılacak en az bir raf seçin.");
      return;
    }
    setIsAuditActive(true);
    setAuditShelfSelections(shelves);
    setAuditCurrentShelf(shelves[0]);
    setAuditCounts({});
    setAuditLogs([]);
    showSuccess("Kör sayım denetim oturumu başarıyla başlatıldı. Sistem adetleri gizlendi.");
  };

  const handleRecordAuditCount = (sku: string, qty: number) => {
    if (!auditCurrentShelf) {
      showError("Lütfen sayım yapılan rafı seçin.");
      return;
    }
    if (!sku.trim()) {
      showError("Lütfen ürün SKU veya barkodunu okutun.");
      return;
    }
    if (qty < 0) {
      showError("Sayılan miktar sıfırdan küçük olamaz.");
      return;
    }

    const prod = products.find(p => p.sku === sku || p.barcode === sku);
    if (!prod) {
      showError("Okutulan ürün envanter kataloğunda bulunamadı.");
      return;
    }

    const key = `${auditCurrentShelf}_${prod.sku}`;
    const newCounts = {
      ...auditCounts,
      [key]: (auditCounts[key] || 0) + qty
    };
    setAuditCounts(newCounts);

    const logMsg = {
      id: Date.now(),
      shelf: auditCurrentShelf,
      productName: getLocalizedField(prod.name, activeLang),
      sku: prod.sku,
      quantity: qty,
      time: new Date().toLocaleTimeString(activeLang === "ka" ? "ka-GE" : activeLang === "ru" ? "ru-RU" : activeLang === "de" ? "de-DE" : activeLang === "en" ? "en-US" : "tr-TR")
    };
    setAuditLogs([logMsg, ...auditLogs]);
    showSuccess(wm.confirmLockProduct.replace("{shelf}", auditCurrentShelf).replace("{qty}", qty.toString()).replace("{name}", getLocalizedField(prod.name, activeLang)));
  };

  const handleApplyAuditAdjustments = () => {
    if (!activeWh) return;
    let updatedProducts = [...products];
    const newMovements = [...movements];

    const auditedProducts = products.filter(
      p =>
        p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
        auditShelfSelections.some(sh => sh.toLowerCase() === p.shelf.toLowerCase())
    );

    let correctionsCount = 0;

    auditedProducts.forEach(p => {
      const key = `${p.shelf}_${p.sku}`;
      const counted = auditCounts[key] ?? 0;
      const systemQty = Number(p.quantity) || 0;

      if (counted !== systemQty) {
        correctionsCount++;
        updatedProducts = updatedProducts.map(item => {
          if (item.id === p.id) {
            return { ...item, quantity: counted.toString() };
          }
          return item;
        });

        const diff = counted - systemQty;
        const movementType = diff > 0 ? "stock_in" : "stock_out";
        const adjMovement: StockMovement = {
          id: `mov-audit-${Date.now()}-${p.id}`,
          productName: getLocalizedField(p.name, activeLang),
          productCode: p.sku || p.barcode,
          movementType: movementType,
          quantity: Math.abs(diff),
          warehouse: p.warehouse,
          shelf: p.shelf,
          note: wm.countCorrectionNote.replace("{system}", systemQty.toString()).replace("{counted}", counted.toString()),
          createdAt: new Date().toLocaleTimeString(activeLang === "ka" ? "ka-GE" : activeLang === "ru" ? "ru-RU" : activeLang === "de" ? "de-DE" : activeLang === "en" ? "en-US" : "tr-TR", { hour: "2-digit", minute: "2-digit" }) + (activeLang === "en" ? " (Today)" : activeLang === "de" ? " (Heute)" : activeLang === "ru" ? " (Сегодня)" : activeLang === "ka" ? " (დღეს)" : " (Bugün)")
        };
        newMovements.push(adjMovement);
      }
    });

    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
    saveProductsStateAndSync(updatedProducts);
    window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(newMovements));
    setMovements(newMovements);

    setIsAuditActive(false);
    setAuditCounts({});
    setAuditLogs([]);
    showSuccess(activeLang === "en" ? `Count session approved. Stock levels adjusted for a total of ${correctionsCount} products.` : activeLang === "de" ? `Zählsitzung genehmigt. Lagerbestände für insgesamt ${correctionsCount} Produkte angepasst.` : activeLang === "ru" ? `Сессия подсчета подтверждена. Корректировка запасов выполнена для ${correctionsCount} товаров.` : activeLang === "ka" ? `ინვენტარიზაციის სესია დადასტურდა. სულ ${correctionsCount} პროდუქტზე გასწორდა მარაგი.` : `Sayım oturumu onaylandı. Toplam ${correctionsCount} adet üründe stok seviyesi düzeltildi.`);
  };

  // Picking (Sipariş Toplama) Handlers
  const handleGeneratePickingRoute = () => {
    if (pickingItems.length === 0) {
      showError(activeLang === "en" ? "Please add at least one product to collect." : activeLang === "de" ? "Bitte fügen Sie mindestens ein Produkt zum Sammeln hinzu." : activeLang === "ru" ? "Пожалуйста, добавьте хотя бы один товар для сбора." : activeLang === "ka" ? "გთხოვთ დაამატოთ მინიმუმ ერთი პროდუქტი ასაკრეფად." : "Lütfen toplanacak en az bir ürün ekleyin.");
      return;
    }
    if (!activeWh) return;

    const steps: { shelf: string, sku: string, name: string, quantityToPick: number, picked: boolean }[] = [];

    for (const item of pickingItems) {
      let needed = item.quantityNeeded;

      const availableStocks = products
        .filter(
          p =>
            p.sku === item.sku &&
            p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
            Number(p.quantity) > 0
        )
        .sort((a, b) => {
          const timeA = parseInt(a.id.split("-")[1]) || 0;
          const timeB = parseInt(b.id.split("-")[1]) || 0;
          return timeA - timeB; // FIFO (Oldest first)
        });

      const totalAvailable = availableStocks.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
      if (totalAvailable < needed) {
        showError(`Yetersiz Stok! "${item.name}" için gereken: ${needed}, mevcut toplam stok: ${totalAvailable}`);
        return;
      }

      for (const stock of availableStocks) {
        if (needed <= 0) break;
        const qtyOnShelf = Number(stock.quantity) || 0;
        const pickQty = Math.min(qtyOnShelf, needed);
        needed -= pickQty;

        steps.push({
          shelf: stock.shelf,
          sku: stock.sku,
          name: stock.name,
          quantityToPick: pickQty,
          picked: false
        });
      }
    }

    // Sort walking path by zone letter, slot number, and level number
    steps.sort((a, b) => {
      const partsA = a.shelf.split("-");
      const partsB = b.shelf.split("-");

      const zoneA = partsA[0] || "";
      const zoneB = partsB[0] || "";
      if (zoneA !== zoneB) {
        return zoneA.localeCompare(zoneB);
      }

      const slotA = parseInt(partsA[1]) || 0;
      const slotB = parseInt(partsB[1]) || 0;
      if (slotA !== slotB) {
        return slotA - slotB;
      }

      const levelA = parseInt(partsA[2]) || 0;
      const levelB = parseInt(partsB[2]) || 0;
      return levelA - levelB;
    });

    setPickingRouteSteps(steps);
    setIsPickingSessionActive(true);
    showSuccess("Optimum toplama rotası başarıyla hesaplandı. Toplayıcı yönlendiriliyor.");
  };

  const handleFinishPicking = () => {
    if (!activeWh) return;

    let updatedProducts = [...products];
    const newMovements = [...movements];

    pickingRouteSteps.forEach(step => {
      if (step.picked) {
        updatedProducts = updatedProducts.map(p => {
          if (
            p.sku === step.sku &&
            p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
            p.shelf.toLowerCase() === step.shelf.toLowerCase()
          ) {
            const currentQty = Number(p.quantity) || 0;
            return {
              ...p,
              quantity: Math.max(0, currentQty - step.quantityToPick).toString()
            };
          }
          return p;
        });

        const pickMovement: StockMovement = {
          id: `mov-pick-${Date.now()}-${step.sku}-${step.shelf}`,
          productName: step.name,
          productCode: step.sku,
          movementType: "stock_out",
          quantity: step.quantityToPick,
          warehouse: activeWh.name,
          shelf: step.shelf,
          note: `Sipariş Toplama (Akıllı Rota)`,
          createdAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + " (Bugün)"
        };
        newMovements.push(pickMovement);
      }
    });

    window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(newMovements));
    setMovements(newMovements);

    setIsPickingSessionActive(false);
    setPickingRouteSteps([]);
    setPickingItems([]);
    showSuccess("Toplama iş emri başarıyla tamamlandı. Stoklar güncellendi.");
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
                if (warehouses && warehouses.length > 0) {
                  setWizardCount(warehouses.length);
                  setWizardNames(warehouses.map(w => w.name));
                } else {
                  setWizardCount(3);
                  setWizardNames(Array.from({ length: 3 }, (_, i) => `Depo ${i + 1}`));
                }
                setShowWizard(true);
              }}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-750 hover:bg-blue-100 transition"
            >
              {t.runWizard}
            </button>
            <Link href="/dashboard/stock-movements" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50 transition">
              {t.stockMovements}
            </Link>
            <Link 
              href="/dashboard/products" 
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-750 hover:bg-indigo-100 transition"
            >
              {t.backToProducts || "← Ürün & Stok Yönetimi"}
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

        {/* 🔄 RAF / GÖZ DETAYINDAN SEVK VE TRANSFER ETME MODALI */}
        {isShelfTransferOpen && shelfTransferProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl space-y-4 animate-scaleIn">
              <div className="flex items-center justify-between">
                <span className="text-xl">🔄</span>
                <h3 className="text-base font-black text-slate-900">{t.shelfTransferHeader || "Raftan Hızlı Sevk / Transfer"}</h3>
                <button
                  onClick={() => setIsShelfTransferOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition font-black text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-slate-800">📦 {products.find(p => p.id === shelfTransferProductId)?.name}</p>
                <p className="text-slate-500 font-semibold">{t.sourceShelf || "Kaynak Raf"}: {shelfTransferFromShelf}</p>
                <p className="text-slate-500 font-semibold">{t.currentQty || "Mevcut Miktar"}: {products.find(p => p.id === shelfTransferProductId)?.quantity} {t.itemsUnit || "Adet"}</p>
              </div>

              <div className="space-y-3">
                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-700">{t.dispatchWarehouse || "Sevk Edilecek Depo"}</span>
                  <select
                    value={shelfTransferToWarehouse}
                    onChange={(e) => {
                      setShelfTransferToWarehouse(e.target.value);
                      const matched = warehouses.find(w => w.name === e.target.value);
                      if (matched && matched.shelves && matched.shelves.length > 0) {
                        setShelfTransferToShelf(matched.shelves[0]);
                      } else {
                        setShelfTransferToShelf("");
                      }
                    }}
                    className="rounded-xl border border-slate-350 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-700">{t.dispatchShelf || "Sevk Edilecek Raf / Hücre"}</span>
                  <select
                    value={shelfTransferToShelf}
                    onChange={(e) => setShelfTransferToShelf(e.target.value)}
                    className="rounded-xl border border-slate-355 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800"
                  >
                    <option value="">{t.noShelfOption || "-- Rafsız (Ortalıkta Dursun) --"}</option>
                    {warehouses.find(w => w.name === shelfTransferToWarehouse)?.shelves?.map((sh: any) => (
                      <option key={sh} value={sh}>{sh} {t.shelfSuffix || "Rafı"}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-700">{t.dispatchQty || "Sevk Miktarı"}</span>
                  <input
                    type="number"
                    id="shelf-transfer-qty-input"
                    aria-label="Raf sevk miktarı"
                    value={shelfTransferQty}
                    onChange={(e) => setShelfTransferQty(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800"
                    min="1"
                    max={products.find(p => p.id === shelfTransferProductId)?.quantity || "1"}
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShelfTransfer}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-black text-white transition active:scale-95 shadow-md"
                >
                  ⚡ Sevk Et ve Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => setIsShelfTransferOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition active:scale-95"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ➕ YENİ DEPO EKLEME MODALI */}
        {isNewWarehouseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl space-y-4 animate-scaleIn">
              <div className="flex items-center justify-between">
                <span className="text-xl">🏪</span>
                <h3 className="text-base font-black text-slate-900">{t.addNewWarehouse || "Yeni Depo Ekle"}</h3>
                <button
                  onClick={() => setIsNewWarehouseModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition font-black text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewWarehouse} className="space-y-4">
                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-750">{t.newWhNameLabel || "Depo İsmi"}</span>
                  <input
                    type="text"
                    id="new-wh-name-input"
                    aria-label="Yeni depo ismi"
                    required
                    value={newWhName}
                    onChange={(e) => setNewWhName(e.target.value)}
                    placeholder="Örn: Trabzon Deposu, Yedek Parça Şubesi"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800 focus:border-blue-500"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-750">{t.newWhCityLabel || "Deponun Bulunduğu Şehir"}</span>
                  <input
                    type="text"
                    id="new-wh-city-input"
                    aria-label="Depo şehri"
                    required
                    value={newWhCity}
                    onChange={(e) => setNewWhCity(e.target.value)}
                    placeholder="Örn: Trabzon, Batumi, Rize"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800 focus:border-blue-500"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-750">{t.newWhPurposeLabel || "Depo Kullanım Amacı (Açıklama)"}</span>
                  <input
                    type="text"
                    id="new-wh-purpose-input"
                    aria-label="Depo kullanım amacı"
                    required
                    value={newWhPurpose}
                    onChange={(e) => setNewWhPurpose(e.target.value)}
                    placeholder="Örn: Batumi - Yedek / Depolama Sahası 5"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800 focus:border-blue-500"
                  />
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-black text-white transition active:scale-95 shadow-md"
                  >
                    ⚡ Depoyu Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewWarehouseModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition active:scale-95"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SETUP WIZARD (Wizard Mode overlay) */}
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <form onSubmit={handleSaveWizard} className="w-full max-w-lg rounded-3xl border border-slate-250 bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.wizardTitleSmall}</span>
                <h2 className="text-xl font-black text-slate-900">{t.wizardTitle}</h2>
                <p className="text-xs text-slate-600">{t.wizardDesc}</p>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-500/20 bg-red-50 p-3 text-xs font-black text-red-800 shadow-sm animate-fadeIn">
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-55 p-3 text-xs font-black text-emerald-800 shadow-sm animate-fadeIn">
                  ✓ {successMsg}
                </div>
              )}

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
                    className="w-12 h-8 text-center rounded-lg border border-slate-250 font-black text-xs" id="id-page-w-12-h-8-text-center-rounded-lg-border-border-slate-250-font-black-text-xs-185" aria-label="W 12 h 8 text center rounded lg border border slate 250 font black text xs" />
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
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-blue-500 font-semibold" id="id-page-flex-1-bg-white-border-border-slate-200-rounded-lg-px-2-5-py-1-text-xs-outline-none-focus-border-blue-500-font-semibold-775" aria-label="Flex 1 bg white border border slate 200 rounded lg px 2 5 py 1 text xs outline none focus border blue 500 font semibold" />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWizard(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
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
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">{t.activeWarehousesLabel}</span>
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
                    setCorridors(w.corridorConfigs || parseShelvesToConfig(w.shelves || []));
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
                        {editingWarehouseId === w.id ? (
                          <input
                            type="text"
                            value={editingWarehouseName}
                            onChange={(e) => setEditingWarehouseName(e.target.value)}
                            onBlur={() => handleSaveWarehouseName(w.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveWarehouseName(w.id);
                              if (e.key === "Escape") setEditingWarehouseId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border border-blue-500 px-2 py-0.5 text-xs font-black text-slate-900 bg-white"
                            autoFocus id="id-page-rounded-border-border-blue-500-px-2-py-0-5-text-xs-font-black-text-slate-900-bg-white-422" aria-label="Rounded border border blue 500 px 2 py 0 5 text xs font black text slate 900 bg white" />
                        ) : (
                          <span
                            className="hover:text-blue-600 transition flex items-center gap-1"
                            title="Yeniden adlandırmak için çift tıklayın ağam"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingWarehouseId(w.id);
                              setEditingWarehouseName(w.name);
                            }}
                          >
                            🏪 {translateWarehouseName(w.name, language)} <span className="text-[10px] text-slate-400 font-normal">✏️</span>
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-600 font-bold mt-0.5">{w.city} · {translateWarehousePurpose(w.purpose, language)}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${
                      isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}>
                      {isActive ? t.badgeSelected : t.badgePassive}
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-600 font-black">
                    <span>📦 {itemsCount} {t.definedProducts}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-600">{w.shelves?.length || 0} {t.shelfPositions}</span>
                      {isAuthorized && warehouses.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWarehouse(w.id, w.name);
                          }}
                          className="text-rose-600 hover:text-rose-700 font-bold w-11 h-11 flex items-center justify-center rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition active:scale-90 shrink-0"
                          title="Depoyu Tamamen Sil"
                          aria-label={`${w.name} deposunu sil`}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {isAuthorized && (
              <article
                onClick={() => setIsNewWarehouseModalOpen(true)}
                className="rounded-2xl border border-dashed border-slate-350 bg-slate-50 hover:bg-slate-100/70 p-4 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[120px] text-slate-700 hover:border-blue-500 hover:shadow-md"
              >
                <span className="text-2xl mb-1">➕</span>
                <h4 className="text-xs font-black text-slate-800">{t.addNewWarehouse || "Yeni Depo Ekle"}</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{t.addNewWarehouseDesc || "Sisteme yeni bir depo şubesi ekleyin"}</p>
              </article>
            )}
          </div>
        </section>

        {/* Workspace Operations Tabs */}
        {activeWh && (
          <nav className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit max-w-full overflow-x-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('placement')}
              className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'placement'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              📐 {t.layoutShaperNav || "Yerleşim & Raf Şekillendirici"}
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('transfer')}
              className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'transfer'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              🔄 {t.interWarehouseTransfer || "Depolar Arası Transfer"}
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('audit')}
              className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'audit'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              📋 {t.blindStockCount || "Kör Stok Sayımı"}
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('zpl')}
              className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'zpl'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              🏷️ {t.zplBarcodeLab || "ZPL Barkod Laboratuvarı"}
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('picking')}
              className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'picking'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              ⚡ {t.smartOrderPicking || "Akıllı Sipariş Toplama"}
            </button>
          </nav>
        )}

        {/* Whiteboard Toggle Toolbar */}
        {activeWh && activeWorkspaceTab === 'placement' && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800">{t.designOptions || "Depo Tasarım Seçenekleri"}</h3>
              <p className="text-[10px] text-slate-700 font-semibold">{t.designOptionsDesc || "Tasarım stüdyosu veya basit liste görünümü arasında geçiş yapın."}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsWhiteboardMode(false)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                  !isWhiteboardMode
                    ? "bg-slate-900 text-white shadow-sm animate-scaleUp"
                    : "bg-slate-100 text-slate-700 hover:text-slate-800"
                }`}
              >
                🗂️ {t.simpleListView || "Basit Liste Görünümü"}
              </button>
              <button
                type="button"
                onClick={() => setIsWhiteboardMode(true)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                  isWhiteboardMode
                    ? "bg-blue-600 text-white shadow-sm animate-scaleUp"
                    : "bg-slate-100 text-slate-700 hover:text-slate-800"
                }`}
              >
                🎨 {t.designStudio || "Depo Tasarım Beyaz Tahtası (Studio)"}
              </button>
            </div>
          </div>
        )}

        {/* MAIN Revamped Workspace */}
        {activeWh && activeWorkspaceTab === 'placement' && !isWhiteboardMode && (
          <div 
            id="warehouse-resizable-container" 
            className="flex flex-col lg:flex-row gap-0 items-start w-full relative"
          >
            {/* Left Column: Layout Shaper and Placement Board */}
            <div 
              style={{ width: typeof window !== "undefined" && window.innerWidth >= 1024 ? `${leftWidth}%` : '100%' }}
              className="space-y-4 lg:pr-3 w-full transition-all duration-75"
            >
              
              {/* 1. Depo Şekillendirici (Layout Shaper) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.layoutShaperTitle}</span>
                  <h2 className="text-base font-black text-slate-900 mt-1">"{activeWh.name}" {t.layoutShaperHeader}</h2>
                  <p className="text-xs text-slate-600">{t.layoutShaperDesc}</p>
                </div>

                <div className="space-y-4">
                  {/* Quick Add Corridor */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-corridor-input"
                      placeholder={t.newAisleCode || "Yeni Reyon Kodu (Örn: D, E, F)"}
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
                            {editingZoneId === c.zone ? (
                              <input
                                type="text"
                                value={editingZoneName}
                                onChange={(e) => setEditingZoneName(e.target.value)}
                                onBlur={() => handleSaveZoneName(c.zone)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveZoneName(c.zone);
                                  if (e.key === "Escape") setEditingZoneId(null);
                                }}
                                className="rounded border border-blue-500 px-2 py-0.5 text-xs font-black text-slate-900 bg-white"
                                autoFocus id="id-page-rounded-border-border-blue-500-px-2-py-0-5-text-xs-font-black-text-slate-900-bg-white-553" aria-label="Rounded border border blue 500 px 2 py 0 5 text xs font black text slate 900 bg white" />
                            ) : (
                              <span
                                className="text-sm font-black text-slate-800 hover:text-blue-600 transition cursor-pointer flex items-center gap-1"
                                title="Yeniden adlandırmak için çift tıklayın"
                                onDoubleClick={() => {
                                  setEditingZoneId(c.zone);
                                  setEditingZoneName(c.zone);
                                }}
                              >
                                📍 Reyon {c.zone} <span className="text-[9px] text-slate-400 font-normal">✏️</span>
                              </span>
                            )}
                            <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-full">
                              {c.depth * c.tiers} {t.totalShelves || "Toplam Raf"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCorridors(corridors.filter(item => item.zone !== c.zone))}
                            className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                          >
                            {t.remove || "Kaldır"} ✕
                          </button>
                        </div>

                        {/* Dimensions Editor Controls */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-700 block">↔ Reyon Derinliği (Slot / Genişlik)</span>
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
                            <span className="text-[11px] font-bold text-slate-700 block">↕ Raf Kat Sayısı (Yükseklik)</span>
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
                          <span className="text-[10px] font-black text-slate-550 uppercase tracking-wider block">🏢 Reyon Önizleme Haritası</span>
                          <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 overflow-x-auto">
                            <div className="flex flex-col gap-1.5 min-w-[280px]">
                              {Array.from({ length: c.tiers }, (_, tIdx) => {
                                const level = c.tiers - tIdx; // Render highest level at the top
                                return (
                                  <div key={level} className="flex items-center gap-1.5">
                                    <span className="w-8 text-[9px] font-black text-slate-550 text-right shrink-0">Kat {level}</span>
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
                                                : "bg-slate-50 border-slate-200 border-dashed text-slate-700 hover:bg-slate-100"
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
                  onClick={() => handleSaveLayout()}
                  className="w-full rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition active:scale-98 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span> {t.generateLayoutBtn}
                </button>
              </div>

              {/* 2. Ürün Rafa Yerleştirme İstasyonu (Product Placement Board) */}
              <form id="product-placement-form" onSubmit={handlePlaceProduct} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.lockLocationTitle}</span>
                  <h2 className="text-base font-black text-slate-900 mt-1">{t.lockLocationHeader}</h2>
                  <p className="text-xs text-slate-600">{t.lockLocationDesc}</p>
                </div>

                {/* 🎙️ Voice Assistant Entegrasyonu */}
                <VoiceAssistant 
                  onAdjustQuantity={handleVoiceAdjustQuantity}
                  onSetShelf={setPlaceShelf}
                  activeShelf={placeShelf}
                />

                <div className="space-y-3">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">{t.selectFromCatalog}</span>
                    <input
                      type="text"
                      placeholder="🔍 Ürün adı veya kodu ile hızlı ara..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full mb-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50" id="id-page-w-full-mb-1-5-rounded-xl-border-border-slate-200-px-3-py-1-5-text-xs-font-semibold-focus-outline-none-focus-border-blue-500-bg-slate-50-111" aria-label="W full mb 1 5 rounded xl border border slate 200 px 3 py 1 5 text xs font semibold focus outline none focus border blue 500 bg slate 50" />
                    <select
                      value={placeProductId}
                      onChange={(e) => setPlaceProductId(e.target.value)}
                      className="w-full rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="">{t.selectProductOption}</option>
                      {products
                        .filter(p => {
                          const query = productSearch.trim().toLowerCase();
                          if (!query) return true;
                          return (
                            p.name.toLowerCase().includes(query) ||
                            (p.sku && p.sku.toLowerCase().includes(query)) ||
                            (p.barcode && p.barcode.toLowerCase().includes(query))
                          );
                        })
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {getLocalizedField(p.name, activeLang)} ({p.sku || p.barcode || (activeLang === "en" ? "No Code" : activeLang === "de" ? "Kein Code" : activeLang === "ru" ? "Нет кода" : activeLang === "ka" ? "კოდის გარეშე" : "Kodu Yok")}) - {activeLang === "en" ? "Stock" : activeLang === "de" ? "Bestand" : activeLang === "ru" ? "Запас" : activeLang === "ka" ? "მარაგი" : "Stok"}: {p.quantity || "0"} {activeLang === "en" ? "pcs" : activeLang === "de" ? "Stk" : activeLang === "ru" ? "шт" : activeLang === "ka" ? "ცალი" : "adet"}
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
                        className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-bold-focus-outline-none-focus-border-blue-500-371" aria-label="Rounded xl border border slate 250 px 3 py 2 text xs font bold focus outline none focus border blue 500" />
                    </label>
                  </div>

                  {/* Show price warnings / preview for sanity check */}
                  {placeProductId && (
                    <div className="space-y-2">
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

                      {/* Weight & Volume overrides */}
                      <div className="grid gap-2 grid-cols-2 p-3 bg-blue-50/40 border border-blue-100 rounded-2xl">
                        <label className="grid gap-1">
                          <span className="text-[10px] font-black text-slate-700">Birim Ağırlık (kg)</span>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={products.find(p => p.id === placeProductId)?.weight || "1.0"}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = products.map(p => p.id === placeProductId ? { ...p, weight: val } : p);
                              window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                              saveProductsStateAndSync(updated);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold outline-none" id="id-page-rounded-lg-border-border-slate-200-bg-white-px-2-py-1-text-xs-font-bold-outline-none-234" aria-label="Rounded lg border border slate 200 bg white px 2 py 1 text xs font bold outline none" />
                        </label>
                        <label className="grid gap-1">
                          <span className="text-[10px] font-black text-slate-700">Birim Hacim (m³)</span>
                          <input
                            type="number"
                            step="0.001"
                            min="0.001"
                            value={products.find(p => p.id === placeProductId)?.volume || "0.01"}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = products.map(p => p.id === placeProductId ? { ...p, volume: val } : p);
                              window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                              setProducts(updated);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold outline-none" id="id-page-rounded-lg-border-border-slate-200-bg-white-px-2-py-1-text-xs-font-bold-outline-none-813" aria-label="Rounded lg border border slate 200 bg white px 2 py 1 text xs font bold outline none" />
                        </label>
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
                      className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-semibold-focus-outline-none-focus-border-blue-500-319" aria-label="Rounded xl border border slate 250 px 3 py 2 text xs font semibold focus outline none focus border blue 500" />
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

            {/* Draggable Divider Handle */}
            <div
              onMouseDown={startResize}
              className="hidden lg:flex w-2 bg-slate-200 hover:bg-blue-500 cursor-col-resize self-stretch transition-all duration-150 relative items-center justify-center select-none z-20"
              title="Sürükleyerek Genişletin / Daraltın"
            >
              <div className="w-0.5 h-12 rounded-full bg-slate-400"></div>
            </div>

            {/* Right Column: Visual Layout Map & Live Barcode Scan */}
            <div 
              style={{ width: typeof window !== "undefined" && window.innerWidth >= 1024 ? `${100 - leftWidth}%` : '100%' }}
              className="space-y-4 lg:pl-3 w-full transition-all duration-75"
            >
              
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
                    className="flex-1 rounded-xl border border-slate-250 px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-blue-500" id="id-page-flex-1-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-mono-font-bold-focus-outline-none-focus-border-blue-500-183" aria-label="Flex 1 rounded xl border border slate 250 px 3 py 2 text xs font mono font bold focus outline none focus border blue 500" />
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

                    {/* Shelf Capacities Editor */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-white/70 border border-blue-150 rounded-xl text-xs font-semibold">
                      <label className="grid gap-1">
                        <span className="text-[10px] text-slate-700 font-black">Maksimum Yük (kg)</span>
                        <input
                          type="number"
                          min="1"
                          value={shelfCapacities[scannedShelfCode]?.maxWeight ?? 100}
                          onChange={(e) => {
                            const updated = {
                              ...shelfCapacities,
                              [scannedShelfCode]: {
                                maxWeight: Number(e.target.value) || 100,
                                maxVolume: shelfCapacities[scannedShelfCode]?.maxVolume ?? 1.0,
                              }
                            };
                            saveShelfCapacities(updated);
                          }}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 font-bold outline-none" id="id-page-w-full-rounded-md-border-border-slate-200-bg-white-px-2-py-1-font-bold-outline-none-322" aria-label="W full rounded md border border slate 200 bg white px 2 py 1 font bold outline none" />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-[10px] text-slate-700 font-black">Maksimum Hacim (m³)</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={shelfCapacities[scannedShelfCode]?.maxVolume ?? 1.0}
                          onChange={(e) => {
                            const updated = {
                              ...shelfCapacities,
                              [scannedShelfCode]: {
                                maxWeight: shelfCapacities[scannedShelfCode]?.maxWeight ?? 100,
                                maxVolume: Number(e.target.value) || 1.0,
                              }
                            };
                            saveShelfCapacities(updated);
                          }}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 font-bold outline-none" id="id-page-w-full-rounded-md-border-border-slate-200-bg-white-px-2-py-1-font-bold-outline-none-537" aria-label="W full rounded md border border slate 200 bg white px 2 py 1 font bold outline none" />
                      </label>
                    </div>

                    {/* Shelf Products list */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{t.currentProducts}</h4>
                      {shelfProducts.length > 0 ? (
                        shelfProducts.map((p) => (
                          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-850 text-xs">{getLocalizedField(p.name, activeLang)}</h5>
                                <p className="text-[9px] text-slate-550 font-mono mt-0.5">SKU: {p.sku || "—"} | OEM: {p.oemCode || "—"}</p>
                              </div>
                              <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {p.quantity} {activeLang === "en" ? "pcs" : activeLang === "de" ? "Stk" : activeLang === "ru" ? "шт" : activeLang === "ka" ? "ცალი" : "Adet"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-650 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <div>💰 {activeLang === "en" ? "Purchase" : activeLang === "de" ? "Einkauf" : activeLang === "ru" ? "Закупка" : activeLang === "ka" ? "შესყიდვა" : "Alış"}: <strong className="text-rose-700 font-mono">{p.purchasePrice || "0"} EUR</strong></div>
                              <div>💵 {activeLang === "en" ? "Sale" : activeLang === "de" ? "Verkauf" : activeLang === "ru" ? "Продажа" : activeLang === "ka" ? "გაყიდვა" : "Satış"}: <strong className="text-emerald-700 font-mono">{p.salePrice || "0"} EUR</strong></div>
                              <div className="col-span-2">🏷️ {activeLang === "en" ? "Category/Brand" : activeLang === "de" ? "Kategorie/Marke" : activeLang === "ru" ? "Категория/Бренд" : activeLang === "ka" ? "კატეგორია/ბრენდი" : "Kategori/Marka"}: <span className="text-slate-900 font-bold">{getLocalizedField(p.category, activeLang)} · {p.brand} ({p.model})</span></div>
                              <div className="col-span-2 text-slate-600 leading-normal italic">{activeLang === "en" ? "Description" : activeLang === "de" ? "Beschreibung" : activeLang === "ru" ? "Описание" : activeLang === "ka" ? "აღწერა" : "Açıklama"}: {getLocalizedField(p.description || "", activeLang) || "—"}</div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setShelfTransferProductId(p.id);
                                  setShelfTransferFromShelf(scannedShelfCode);
                                  setShelfTransferToWarehouse(activeWh.name);
                                  setShelfTransferToShelf("");
                                  setShelfTransferQty(p.quantity);
                                  setIsShelfTransferOpen(true);
                                }}
                                className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[9px] font-black text-indigo-700 hover:bg-indigo-100 flex items-center gap-0.5"
                                title="Raftan Başka Depoya veya Rafa Transfer Et"
                              >
                                🔄 {language === "en" ? "Transfer" : "Sevk/Transfer Et"}
                              </button>
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
                        <p className="text-xs text-slate-550 italic p-3 text-center bg-white rounded-xl border border-slate-200">
                          {t.noProductsOnShelf}
                        </p>
                      )}
                    </div>

                    {/* Shelf Movements log */}
                    <div className="space-y-2 border-t border-blue-200/50 pt-3">
                      <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{t.movementsHistory}</h4>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {shelfMovements.length > 0 ? (
                          shelfMovements.map((m) => (
                            <div key={m.id} className="text-[10px] leading-relaxed text-slate-600 border-b border-slate-100 pb-1 flex justify-between">
                              <div>
                                <strong className="text-slate-800">{m.productName}</strong>
                                <span className="text-slate-550"> ({m.note})</span>
                              </div>
                              <div className="text-right font-mono shrink-0 ml-2">
                                <span className={m.movementType === "stock_in" ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                                  {m.movementType === "stock_in" ? "+" : ""}{m.quantity} Adet
                                </span>
                                <span className="text-slate-550"> | {m.createdAt}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-550 italic text-center py-2">
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
                        <div className="col-span-2 text-slate-700 leading-normal italic">{language === "en" ? "Description" : "Açıklama"}: {scannedProduct.description || "—"}</div>
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
                      <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        {language === "en" ? "Product Stock Movements" : "Ürün Stok Hareketleri"}
                      </h4>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {movements.filter(m => m.productCode && m.productCode.toUpperCase() === (scannedProduct.sku || scannedProduct.barcode || "").toUpperCase()).length > 0 ? (
                          movements.filter(m => m.productCode && m.productCode.toUpperCase() === (scannedProduct.sku || scannedProduct.barcode || "").toUpperCase()).map((m) => (
                            <div key={m.id} className="text-[10px] leading-relaxed text-slate-700 border-b border-slate-100 pb-1 flex justify-between">
                              <div>
                                <strong className="text-slate-800">{m.warehouse} - Raf: {m.shelf || "—"}</strong>
                                <span className="text-slate-550"> ({m.note})</span>
                              </div>
                              <div className="text-right font-mono shrink-0 ml-2">
                                <span className={m.movementType === "stock_in" ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                                  {m.movementType === "stock_in" ? "+" : ""}{m.quantity} Adet
                                </span>
                                <span className="text-slate-550"> | {m.createdAt}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-550 italic text-center py-2">
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
                {placeProductId && (
                  <div className="bg-blue-600 text-white rounded-2xl p-3 text-xs font-black flex justify-between items-center shadow-lg animate-pulse mb-2">
                    <span className="flex items-center gap-1.5 text-[11px]">🎯 {language === "tr" ? `Yerleşim Modu: Haritadan hedef rafa tıklayın, ardından yerleştirmek için rafa bir kez daha basarak onaylayın` : `Placement Mode: Click a target shelf on the map, then click it again to confirm`}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{t.printCenterTitle}</span>
                  <h2 className="text-base font-black text-slate-900 mt-1">{t.matrixHeader}</h2>
                  <p className="text-xs text-slate-600">{t.matrixDesc}</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t.searchInventoryPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white" id="id-page-w-full-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-semibold-focus-outline-none-focus-border-blue-500-bg-slate-50-focus-bg-white-301" aria-label="W full rounded xl border border slate 250 px 3 py 2 text xs font semibold focus outline none focus border blue 500 bg slate 50 focus bg white" />
                </div>

                {/* 📦 Rafsız / Ortalıktaki Ürünler Paneli */}
                {(() => {
                  const unplacedProducts = products.filter(p => 
                    p.warehouse.toLowerCase() === activeWh.name.toLowerCase() && 
                    (!p.shelf || p.shelf.trim() === "")
                  );
                  if (unplacedProducts.length === 0) return null;

                  return (
                    <div className="rounded-2xl border border-amber-250 bg-amber-50/20 p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">📦 {t.unplacedProductsHeader || "Rafsız / Ortalıktaki Ürünler"} ({unplacedProducts.length})</h3>
                          <p className="text-[9px] text-amber-700 font-semibold leading-relaxed">{t.unplacedProductsDesc || "Bu depoda kayıtlı olan ama henüz raflara dizilmemiş ürünler."}</p>
                        </div>
                        {activeWh.shelves && activeWh.shelves.length > 0 && (
                          <button
                            type="button"
                            onClick={handleAutoPlaceProducts}
                            className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] h-8 px-3 transition active:scale-95 shadow flex items-center gap-1"
                          >
                            {t.autoPlaceBtn || "⚡ Boş Raflara Otomatik Dağıt"}
                          </button>
                        )}
                      </div>

                      <div className="grid gap-2 max-h-32 overflow-y-auto pr-1 text-xs">
                        {unplacedProducts.map(up => {
                          const isSelected = up.id === placeProductId;
                          return (
                            <div 
                              key={up.id} 
                              className={`flex justify-between items-center border p-2 rounded-xl transition-all hover:border-blue-300 hover:bg-slate-50 ${
                                isSelected 
                                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300 shadow-md animate-pulse" 
                                  : "bg-white border-amber-200/50"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">📦 {getLocalizedField(up.name, language || "tr")} ({up.quantity} {t.qty || "Adet"})</span>
                                {isSelected ? (
                                  <span className="text-[9px] text-blue-650 font-black mt-0.5 animate-pulse">
                                    👈 Seçildi! Yukarıdaki haritada hedef rafa tıklayın (seçildiğinde ONAY yazacaktır).
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-slate-500 mt-0.5 font-bold">
                                    🎯 Rafa yerleştirmek için "Yerleştir" butonuna basın.
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setPlaceProductId("");
                                    setPlaceQty(1);
                                  } else {
                                    setPlaceProductId(up.id);
                                    setPlaceQty(parseInt(up.quantity) || 1);
                                  }
                                }}
                                className={`text-[9px] font-black px-2.5 py-1 rounded-lg border transition ${
                                  isSelected 
                                    ? "bg-red-50 border-red-200 text-red-650 hover:bg-red-100" 
                                    : "bg-blue-50 text-blue-650 border-blue-100 hover:bg-blue-100"
                                }`}
                              >
                                {isSelected ? "İptal Et" : (t.placeBtn || "Yerleştir")}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Sürüklenebilir Beyaz Tahta Canvas ve Raflar */}
                <div 
                  ref={whiteboardRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  style={{
                    backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
                    backgroundSize: "16px 16px",
                    cursor: "grab"
                  }}
                  className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 max-h-[35rem] overflow-auto select-none active:cursor-grabbing"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-w-[1000px]">
                  {activeWh.shelves && activeWh.shelves.length > 0 ? (
                    activeWh.shelves.map((sh) => {
                      const shelfProducts = products.filter(
                        (p) =>
                          p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
                          p.shelf.toLowerCase() === sh.toLowerCase()
                      );
                      const containsProduct = shelfProducts.length > 0;
                      return (
                        <div
                          key={sh}
                          onClick={() => handleShelfCardClick(sh)}
                          className={`group rounded-2xl border p-3 flex flex-col justify-between items-stretch transition cursor-pointer hover:shadow-md ${sh === pickToLightActiveShelf ? "ring-4 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.7)] border-emerald-400 bg-emerald-50/30 scale-[1.02] animate-pulse" : 
                            containsProduct
                              ? "bg-indigo-50/40 border-indigo-300/80 ring-1 ring-indigo-100"
                              : "bg-slate-50/40 border-slate-200 hover:border-slate-350 border-dashed"
                          }`}
                        >
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                            <span className="font-mono text-xs font-black text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded-lg group-hover:bg-blue-650 group-hover:text-white transition flex items-center gap-1">
                              {sh}
                              {sh === pickToLightActiveShelf && (
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                              )}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              containsProduct ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-500"
                            }`}>
                              {containsProduct ? `${shelfProducts.length} ${t.badgeFull || "dolu"}` : t.badgeEmpty || "boş"}
                            </span>
                          </div>

                          {/* Occupied Shelf Details / Interactive steppers */}
                          {containsProduct ? (
                            <div className="py-2.5 space-y-2 flex-1" onClick={(e) => e.stopPropagation()}>
                              {shelfProducts.map(sp => (
                                <div key={sp.id} className="flex flex-col p-1.5 bg-white border border-slate-200/60 rounded-xl shadow-sm">
                                  <span className="text-[10px] font-black text-slate-900 line-clamp-1">📦 {sp.name}</span>
                                  <span className="text-[8px] font-bold text-slate-650">SKU: {sp.sku || "Kodu Yok"}</span>
                                  
                                  {/* Stepper with click prevent propagation */}
                                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                                    <span className="text-[10px] font-black text-slate-800">{t.qty || "Adet"}: <span className="font-mono text-blue-600">{sp.quantity}</span></span>
                                    <div className="flex gap-1">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShelfTransferProductId(sp.id);
                                          setShelfTransferFromShelf(sh);
                                          setShelfTransferToWarehouse(activeWh.name);
                                          setShelfTransferToShelf("");
                                          setShelfTransferQty(sp.quantity);
                                          setIsShelfTransferOpen(true);
                                        }}
                                        className="w-5 h-5 rounded-lg border border-indigo-200 bg-indigo-50 text-[10px] font-black text-indigo-700 hover:bg-indigo-100 flex items-center justify-center transition active:scale-90"
                                        title="Rafı veya Depoyu Değiştir (Sevk Et)"
                                      >
                                        🔄
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAdjustQuantity(sp.id, -1);
                                        }}
                                        className="w-5 h-5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-black hover:bg-slate-100 flex items-center justify-center transition active:scale-90"
                                        title="Stok Azalt"
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAdjustQuantity(sp.id, 1);
                                        }}
                                        className="w-5 h-5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-black hover:bg-slate-100 flex items-center justify-center transition active:scale-90"
                                        title="Stok Artır"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex-1 py-4 flex items-center justify-center text-[10px] text-slate-400 font-semibold italic">
                              -- {language === "tr" ? "Raf Boş" : language === "de" ? "Regal leer" : "Shelf Empty"} --
                            </div>
                          )}
                          
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleScanSuccess(sh)}
                              className="flex-1 rounded-xl bg-white border border-slate-200 py-1.5 text-[8px] font-bold text-slate-650 hover:bg-slate-50 transition active:scale-95"
                            >
                              🔍 {t.inspectBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerPrintLabel("shelf", sh, `RAF: ${sh}`)}
                              className="flex-1 rounded-xl bg-blue-50 border border-blue-200 py-1.5 text-[8px] font-black text-blue-700 hover:bg-blue-100 transition active:scale-95"
                            >
                              🖨️ {t.printBtn}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center py-6 text-xs text-slate-550 italic">
                      {t.noShelvesDefined}
                    </div>
                  )}
                </div>
                </div>

                {/* Filtered Inventory list table inside warehouse */}
                {activeWhInventory.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <h3 className="text-xs font-black text-slate-800">{t.warehouseInventory} ({filteredInventory.length} {t.itemsUnit})</h3>
                    <div className="overflow-x-auto max-h-56">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[9px] font-black text-slate-700 uppercase">
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
                                <span className="font-bold text-slate-900 truncate block max-w-xs">{getLocalizedField(p.name, activeLang)}</span>
                                <span className="text-[9px] text-slate-550 font-mono">{p.sku}</span>
                              </td>
                              <td className="p-2 text-center font-mono font-bold text-blue-600">{p.shelf}</td>
                              <td className="p-2 text-center font-black text-slate-900">{p.quantity}</td>
                              <td className="p-2 text-right font-mono text-slate-800">{p.salePrice} EUR</td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => triggerPrintLabel("product", p.sku || p.barcode, getLocalizedField(p.name, activeLang), `${activeLang === "en" ? "Purchase" : activeLang === "de" ? "Einkauf" : activeLang === "ru" ? "Закупка" : activeLang === "ka" ? "შესყიდვა" : "Alış"}: ${p.purchasePrice} EUR | ${activeLang === "en" ? "Sale" : activeLang === "de" ? "Verkauf" : activeLang === "ru" ? "Продажа" : activeLang === "ka" ? "გაყიდვა" : "Satış"}: ${p.salePrice} EUR`, `${activeLang === "en" ? "SHELF" : activeLang === "de" ? "REGAL" : activeLang === "ru" ? "ПОЛКА" : activeLang === "ka" ? "თარო" : "RAF"}: ${p.shelf}`)}
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

          </div>
        )}

        {/* INTERACTIVE WHITEBOARD DESIGN STUDIO */}
        {activeWh && activeWorkspaceTab === 'placement' && isWhiteboardMode && (
          <section className="space-y-4 animate-fadeIn">
            {/* Whiteboard Header info */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">TASARIM STÜDYOSU</span>
              <h2 className="text-base font-black text-slate-900">İnteraktif Depo Yerleşim Planı & Beyaz Tahta</h2>
              <p className="text-xs text-slate-600">
                Reyonları sürükleyin, yan yana hizalayın, özel reyon adları verin. Herhangi bir raf hücresini tıklatarak bölmelere ayırabilir ve limitlerini güncelleyebilirsiniz.
              </p>
            </div>

            {!isAuthorized && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-xs font-black flex items-center gap-2">
                <span>⚠️ Salt Okunur Mod:</span> Depo yerleşim planını, reyonları, raf sayılarını ve limitlerini değiştirme yetkiniz bulunmamaktadır. Bu değişiklikleri yalnızca Mağaza Sahibi (Owner) ve Mağaza Yöneticisi (Manager) yapabilir.
              </div>
            )}

            {/* Studio Navigation & Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">📍 Reyonlar Arası Gez:</span>
                <button
                  type="button"
                  onClick={() => setSelectedWhiteboardCorridorZone("")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                    selectedWhiteboardCorridorZone === ""
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Tüm Depo Görünümü
                </button>
                {corridors.map(c => (
                  <button
                    key={c.zone}
                    type="button"
                    onClick={() => setSelectedWhiteboardCorridorZone(c.zone)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                      selectedWhiteboardCorridorZone === c.zone
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Reyon {c.zone} ({c.name || "İsimsiz"})
                  </button>
                ))}
              </div>

              {/* Add New Corridor */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Yeni Reyon (Örn: D)"
                  maxLength={3}
                  id="wb-new-corridor-input"
                  disabled={!isAuthorized}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase focus:outline-none w-28 disabled:opacity-50 disabled:bg-slate-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!isAuthorized) {
                        showError("Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo yerleşim düzenini değiştirebilir.");
                        return;
                      }
                      const val = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      if (val && !corridors.some(c => c.zone === val)) {
                        setCorridors([...corridors, { zone: val, depth: 4, tiers: 3, isDoubleRow: false }]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={!isAuthorized}
                  onClick={() => {
                    if (!isAuthorized) {
                      showError("Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo yerleşim düzenini değiştirebilir.");
                      return;
                    }
                    const el = document.getElementById("wb-new-corridor-input") as HTMLInputElement;
                    const val = el?.value.trim().toUpperCase();
                    if (val && !corridors.some(c => c.zone === val)) {
                      setCorridors([...corridors, { zone: val, depth: 4, tiers: 3, isDoubleRow: false }]);
                      el.value = "";
                    }
                  }}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3 py-1.5 transition active:scale-95 disabled:opacity-50"
                >
                  Reyon Ekle +
                </button>
              </div>
            </div>

            {/* Whiteboard Canvas */}
            <div
              style={{
                backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
                backgroundSize: "20px 20px"
              }}
              className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-3xl p-6 min-h-[500px] flex flex-wrap gap-6 items-start justify-center shadow-inner relative overflow-x-auto"
            >
              {corridors
                .filter(c => selectedWhiteboardCorridorZone === "" || c.zone === selectedWhiteboardCorridorZone)
                .map((c, corrIdx) => (
                  <div
                    key={c.zone}
                    draggable={isAuthorized}
                    onDragStart={(e) => handleCorridorDragStart(e, c.zone)}
                    onDragOver={handleCorridorDragOver}
                    onDrop={(e) => handleCorridorDrop(e, c.zone)}
                    style={{
                      opacity: draggedZone === c.zone ? 0.4 : 1,
                      cursor: isAuthorized ? 'grab' : 'default'
                    }}
                    className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-sm p-4 space-y-4 shrink-0 transition hover:shadow-md"
                  >
                    {/* Corridor Title / Header Panel */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Reyon {c.zone}</span>
                          <span className="text-[10px] font-bold text-slate-550 font-mono">Kod: {c.zone}</span>
                        </div>
                        <input
                          type="text"
                          value={c.name || ""}
                          disabled={!isAuthorized}
                          onChange={(e) => {
                            if (!isAuthorized) {
                              showError("Yetersiz Yetki! Reyon isimlerini değiştiremezsiniz.");
                              return;
                            }
                            setCorridors(corridors.map((item, i) => i === corrIdx ? { ...item, name: e.target.value } : item));
                          }}
                          placeholder="Özel reyon adı (Örn: Yedek Parça)"
                          className="w-full text-xs font-bold text-slate-700 outline-none border-b border-dashed border-slate-200 hover:border-slate-350 focus:border-blue-500 py-0.5 font-semibold disabled:opacity-75 disabled:bg-transparent" id="id-page-w-full-text-xs-font-bold-text-slate-700-outline-none-border-b-border-dashed-border-slate-200-hover-border-slate-350-focus-border-blue-500-py-0-5-font-semibold-disabled-opacity-75-disabled-bg-transparent-683" aria-label="W full text xs font bold text slate 700 outline none border b border dashed border slate 200 hover border slate 350 focus border blue 500 py 0 5 font semibold disabled opacity 75 disabled bg transparent" />
                      </div>
                      {isAuthorized && (
                        <button
                          type="button"
                          onClick={() => setCorridors(corridors.filter(item => item.zone !== c.zone))}
                          className="text-xs text-rose-600 hover:text-rose-700 font-black pl-2 cursor-pointer active:scale-95"
                        >
                          ✕ Kaldır
                        </button>
                      )}
                    </div>

                    {/* Dimensions & Rows Controls */}
                    <div className="grid gap-2 grid-cols-3 text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
                      {/* Depth / Slots */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-700 block">↔ GENİŞLİK (SLOT)</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={!isAuthorized}
                            onClick={() => {
                              if (!isAuthorized) {
                                showError("Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo yerleşimini değiştirebilir.");
                                return;
                              }
                              setCorridors(corridors.map((item, i) => i === corrIdx ? { ...item, depth: Math.max(1, item.depth - 1) } : item));
                            }}
                            className="h-6 w-6 rounded bg-white border border-slate-200 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center active:scale-90 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-black text-[10px]">{c.depth} Slot</span>
                          <button
                            type="button"
                            disabled={!isAuthorized}
                            onClick={() => {
                              if (!isAuthorized) {
                                showError("Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo yerleşimini değiştirebilir.");
                                return;
                              }
                              setCorridors(corridors.map((item, i) => i === corrIdx ? { ...item, depth: Math.min(20, item.depth + 1) } : item));
                            }}
                            className="h-6 w-6 rounded bg-white border border-slate-200 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center active:scale-90 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tiers / Heights */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-700 block">↕ YÜKSEKLİK (KAT)</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={!isAuthorized}
                            onClick={() => {
                              if (!isAuthorized) {
                                showError("Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo yerleşimini değiştirebilir.");
                                return;
                              }
                              setCorridors(corridors.map((item, i) => i === corrIdx ? { ...item, tiers: Math.max(1, item.tiers - 1) } : item));
                            }}
                            className="h-6 w-6 rounded bg-white border border-slate-200 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center active:scale-90 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-black text-[10px]">{c.tiers} Kat</span>
                          <button
                            type="button"
                            disabled={!isAuthorized}
                            onClick={() => {
                              if (!isAuthorized) {
                                showError("Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo yerleşimini değiştirebilir.");
                                return;
                              }
                              setCorridors(corridors.map((item, i) => i === corrIdx ? { ...item, tiers: Math.min(10, item.tiers + 1) } : item));
                            }}
                            className="h-6 w-6 rounded bg-white border border-slate-200 font-bold hover:bg-slate-100 shadow-sm flex items-center justify-center active:scale-90 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Double row toggle */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-700 block">↔ ARKA ARKAYA SATIR</span>
                        <button
                          type="button"
                          disabled={!isAuthorized}
                          onClick={() => {
                            if (!isAuthorized) {
                              showError("Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo yerleşimini değiştirebilir.");
                              return;
                            }
                            setCorridors(corridors.map((item, i) => i === corrIdx ? { ...item, isDoubleRow: !item.isDoubleRow } : item));
                          }}
                          className={`w-full rounded-xl py-1 px-2 font-black text-[9px] border transition disabled:opacity-50 ${
                            c.isDoubleRow
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {c.isDoubleRow ? "Çift Sıra (Back)" : "Tek Sıra"}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Grid representing shelves layout */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] font-black text-slate-550 uppercase tracking-wider block">🏢 Reyon Şematik Görünümü</span>
                      <div className="rounded-2xl border border-slate-150 p-1.5 pb-4 pr-4 overflow-x-auto bg-slate-50/50 relative select-none">
                        <div className="flex flex-col gap-1 min-w-[280px]">
                          {/* Column Headers (Slot 1, Slot 2, ...) */}
                          <div className="flex items-center gap-1 border-b border-slate-100 pb-1 mb-1">
                            <span className="w-8 text-[9px] font-black text-slate-700 text-right shrink-0">Konum</span>
                            <div className="flex gap-1">
                              {Array.from({ length: c.depth }, (_, dIdx) => {
                                const slot = dIdx + 1;
                                const sideWidthClass = c.isDoubleRow ? "w-[88px]" : "w-[60px]";
                                return (
                                  <div key={slot} className={`${sideWidthClass} shrink-0 text-center text-[9px] font-black text-slate-800`}>
                                    S{slot}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {Array.from({ length: c.tiers }, (_, tIdx) => {
                            const level = c.tiers - tIdx; // Top levels first
                            return (
                              <div key={level} className="flex items-center gap-1">
                                <span className="w-8 text-[9px] font-black text-slate-700 text-right shrink-0">K{level}</span>
                                <div className="flex gap-1">
                                  {Array.from({ length: c.depth }, (_, dIdx) => {
                                    const slot = dIdx + 1;
                                    const baseCode = `${c.zone}-${slot < 10 ? `0${slot}` : `${slot}`}-${level < 10 ? `0${level}` : `${level}`}`;

                                    const sides = c.isDoubleRow ? ["S1", "S2"] : [""];
                                    const sideWidthClass = c.isDoubleRow ? "w-10" : "w-14";
                                    return (
                                      <div key={baseCode} className="shrink-0 flex gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-inner">
                                        {sides.map((side) => {
                                          const sideSuffix = side ? `-${side}` : "";
                                          const sideCode = `${baseCode}${sideSuffix}`;

                                          // Sub-bins divisions count
                                          const binsCount = c.binsConfig?.[sideCode] || 1;
                                          return (
                                            <div key={sideCode} className={`${sideWidthClass} flex flex-col gap-0.5 shrink-0`}>
                                              {/* Row label if double row */}
                                              {c.isDoubleRow && (
                                                <span className="text-[7px] text-slate-700 font-extrabold text-center block leading-none mb-0.5">{side}</span>
                                              )}

                                              {/* Bins render */}
                                              <div className="flex gap-0.5 h-9">
                                                {Array.from({ length: binsCount }).map((_, bIdx) => {
                                                  const binCode = binsCount > 1 ? `${sideCode}-B${bIdx + 1}` : sideCode;
                                                  const hasProduct = products.some(
                                                    (p) =>
                                                      safeLower(p.warehouse) === safeLower(activeWh.name) &&
                                                      safeLower(p.shelf) === safeLower(binCode)
                                                  );

                                                  return (
                                                    <div
                                                      key={binCode}
                                                      data-shelf-code={binCode}
                                                      onClick={() => {
                                                        if (placeProductId) {
                                                          if (placeShelf === binCode) {
                                                            executeDirectPlacement(placeProductId, binCode, placeQty || 1);
                                                          } else {
                                                            setPlaceShelf(binCode);
                                                          }
                                                        } else {
                                                          setSelectedWhiteboardShelfCode(binCode);
                                                        }
                                                      }}
                                                      title={`${binCode} (${hasProduct ? "Dolu" : "Boş"}) - Bölmeleri ve Limitleri Düzenlemek İçin Tıklayın`}
                                                      className={`flex-1 h-9 rounded-lg border text-center flex flex-col justify-center items-center transition cursor-pointer select-none active:scale-95 ${
                                                        placeShelf === binCode
                                                          ? "bg-yellow-100 border-yellow-500 border-2 text-yellow-950 ring-2 ring-yellow-300 animate-pulse font-black"
                                                          : hasProduct
                                                            ? "bg-indigo-50 border-indigo-300 text-indigo-750 hover:bg-indigo-100"
                                                            : "bg-emerald-50 border-emerald-300 border-dashed text-emerald-700 hover:bg-emerald-100/50"
                                                      }`}
                                                    >
                                                      <span className="text-[9px] font-mono font-bold leading-none">
                                                        {placeShelf === binCode 
                                                          ? (activeLang === "en" ? "CONFIRM 👍" : "ONAY 👍") 
                                                          : binsCount > 1 
                                                            ? `B${bIdx + 1}` 
                                                            : `${slot}-${level}`}
                                                      </span>
                                                      {hasProduct && placeShelf !== binCode && <span className="text-[7px] font-black leading-none block mt-0.5">📦</span>}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {isAuthorized && (
                          <>
                            {/* Right resize handle for Depth (Slots/Genişlik) */}
                            <div
                              onPointerDown={(e) => handleResizeStart(e, c.zone, "depth", c.depth)}
                              onPointerMove={(e) => handleResizeMove(e, c.zone)}
                              onPointerUp={(e) => handleResizeEnd(e, c.zone)}
                              className="absolute right-0 top-0 bottom-0 w-4 hover:bg-indigo-500/10 active:bg-indigo-600/25 cursor-col-resize flex flex-col justify-center items-center select-none"
                              title="Sürükleyerek Genişliği (Slot Sayısı) Ayarlayın"
                            >
                              <div className="w-1.5 h-10 bg-slate-350 rounded-full hover:bg-indigo-600 transition"></div>
                            </div>

                            {/* Bottom resize handle for Tiers (Kat/Yükseklik) */}
                            <div
                              onPointerDown={(e) => handleResizeStart(e, c.zone, "tiers", c.tiers)}
                              onPointerMove={(e) => handleResizeMove(e, c.zone)}
                              onPointerUp={(e) => handleResizeEnd(e, c.zone)}
                              className="absolute bottom-0 left-0 right-0 h-4 hover:bg-indigo-500/10 active:bg-indigo-600/25 cursor-row-resize flex justify-center items-center select-none"
                              title="Sürükleyerek Yüksekliği (Kat Sayısı) Ayarlayın"
                            >
                              <div className="h-1.5 w-10 bg-slate-350 rounded-full hover:bg-indigo-600 transition"></div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Out-of-layout or Unassigned Products Section */}
            {activeWh && (
              (() => {
                const isShelfCodeValidInLayout = (shelfCode: string) => {
                  if (!shelfCode) return false;
                  const parts = shelfCode.split("-");
                  if (parts.length < 3) return false;
                  const zone = parts[0];
                  const slot = parseInt(parts[1], 10);
                  const level = parseInt(parts[2], 10);
                  
                  const corr = corridors.find(c => c.zone === zone);
                  if (!corr) return false;
                  if (isNaN(slot) || slot < 1 || slot > corr.depth) return false;
                  if (isNaN(level) || level < 1 || level > corr.tiers) return false;
                  
                  const sideSuffix = parts[3] ? parts[3].split("-")[0] : "";
                  if (sideSuffix && !corr.isDoubleRow) return false;
                  
                  return true;
                };

                const unassignedProducts = products.filter(
                  (p) => p.warehouse.toLowerCase() === activeWh.name.toLowerCase() && 
                         (!p.shelf || !isShelfCodeValidInLayout(p.shelf))
                );

                if (unassignedProducts.length === 0) return null;

                return (
                  <div className="rounded-3xl border border-rose-150 bg-rose-50/30 p-5 space-y-3 shadow-inner select-none">
                    <div className="flex items-center gap-2 text-rose-800">
                      <span className="text-base">⚠️</span>
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        {activeLang === "en" ? "Unassigned or Out-of-Layout Products" : activeLang === "de" ? "Nicht zugeordnete oder Layout-fremde Produkte" : activeLang === "ru" ? "Товары вне планировки или без ячейки" : activeLang === "ka" ? "მიუწერილი ან განლაგების გარეთ მყოფი პროდუქტები" : "Raf Atanmamış veya Düzen Dışı Ürünler"} ({unassignedProducts.length})
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {activeLang === "en" ? "These products are physically in the warehouse but their shelf codes do not correspond to any valid slot/tier in the current visual layout config. They are hidden from the grid view above." : activeLang === "de" ? "Diese Produkte befinden sich im Lager, aber ihre Regal-Codes entsprechen keinem gültigen Fach im Layout. Sie sind oben im Raster nicht sichtbar." : activeLang === "ru" ? "Эти товары физически находятся на складе, но коды их ячеек не соответствуют ни одному слоту в текущей планировке. Они скрыты с сетки выше." : activeLang === "ka" ? "ეს პროდუქტები ფიზიკურად საწყობშია, მაგრამ მათი თაროს კოდები არ შეესაბამება არცერთ აქტიურ სლოტს. ისინი ზედა ბადეზე არ ჩანან." : "Bu ürünler fiziki olarak depoda bulunuyor ancak raf kodları mevcut görsel yerleşim planında (reyon/slot/kat) tanımlı bir hücreye uymuyor. Yukarıdaki şematik görünümde listelenmezler."}
                    </p>

                    <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {unassignedProducts.map((p) => (
                        <div key={p.id} className="bg-white border border-rose-100 rounded-2xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0 w-72 shadow-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            {p.imageUrl && (
                              <img src={p.imageUrl} alt={getLocalizedField(p.name, activeLang)} className="h-7 w-7 rounded-lg object-cover border border-slate-200 shrink-0" />
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-slate-900 truncate block">{getLocalizedField(p.name, activeLang)}</span>
                              <span className="text-[9px] text-slate-550 font-mono">SKU: {p.sku}</span>
                              <span className="text-[9px] font-extrabold text-rose-600 font-mono mt-0.5">
                                {activeLang === "en" ? "Current Shelf:" : activeLang === "de" ? "Aktuelles Regal:" : activeLang === "ru" ? "Текущая полка:" : activeLang === "ka" ? "არსებული თარო:" : "Mevcut Konum:"} {p.shelf || (activeLang === "en" ? "None" : "Yok")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-black text-slate-900 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                              {p.quantity} {activeLang === "en" ? "pcs" : "Adet"}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedWhiteboardShelfCode(p.shelf || "A-01-01")}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] px-2 py-1 rounded-xl transition cursor-pointer"
                              title={activeLang === "en" ? "Assign to a shelf location" : "Yeni raf konumu atamak için tıklayın"}
                            >
                              {activeLang === "en" ? "Assign" : "Konumlandır"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}

            {/* Bottom Controls */}
            <div className="flex justify-end gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <button
                type="button"
                disabled={!isAuthorized}
                onClick={() => {
                  if (!isAuthorized) {
                    showError("Yetersiz Yetki! Sıfırlama yapamazsınız.");
                    return;
                  }
                  setCorridors(activeWh.corridorConfigs || parseShelvesToConfig(activeWh.shelves || []));
                  showSuccess("Tüm değişiklikler sıfırlandı.");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Vazgeç / Sıfırla
              </button>
              <button
                type="button"
                disabled={!isAuthorized}
                onClick={() => {
                  if (!isAuthorized) {
                    showError(activeLang === "en" ? "Insufficient Permissions! Only Store Owner and Managers can change warehouse layouts." : activeLang === "de" ? "Unzureichende Berechtigungen! Nur der Ladenbesitzer und Manager können das Lager-Layout ändern." : activeLang === "ru" ? "Недостаточно прав! Только владелец магазина и управляющие могут изменять планировку." : activeLang === "ka" ? "არასაკმარისი უფლებები! განლაგების შეცვლა შეუძლიათ მხოლოდ მაღაზიის მფლობელს და მენეჯერებს." : "Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo raf yerleşimlerini değiştirebilir.");
                    return;
                  }
                  handleSaveLayout();
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-6 py-3 transition shadow-sm active:scale-95 disabled:opacity-50"
              >
                {activeLang === "en" ? "⚡ Save & Apply Warehouse Template" : activeLang === "de" ? "⚡ Lagervorlage speichern & anwenden" : activeLang === "ru" ? "⚡ Сохранить и применить шаблон склада" : activeLang === "ka" ? "⚡ საწყობის შაბლონის შენახვა და გამოყენება" : "⚡ Depo Şablonunu Kaydet ve Uygula"}
              </button>
            </div>
          </section>
        )}

        {/* SHELF BINS & COMPARTMENTS CONFIGURATOR POPUP */}
        {activeWh && selectedWhiteboardShelfCode && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedWhiteboardShelfCode(null)}>
            <div className="bg-white border-l border-slate-200 h-full w-96 p-6 shadow-2xl space-y-4 relative animate-slideIn flex flex-col justify-between overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setSelectedWhiteboardShelfCode(null)}
                className="absolute top-4 right-4 text-slate-550 hover:text-slate-600 font-bold text-sm"
              >
                {activeLang === "en" ? "✕ Close" : activeLang === "de" ? "✕ Schließen" : activeLang === "ru" ? "✕ Закрыть" : activeLang === "ka" ? "✕ დახურვა" : "✕ Kapat"}
              </button>

              <div>
                <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  {activeLang === "en" ? "SHELF SETTINGS" : activeLang === "de" ? "REGALEINSTELLUNGEN" : activeLang === "ru" ? "НАСТРОЙКИ ПОЛКИ" : activeLang === "ka" ? "თაროს პარამეტრები" : "RAF AYARLARI"}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {activeLang === "en" ? "Location" : activeLang === "de" ? "Standort" : activeLang === "ru" ? "Расположение" : activeLang === "ka" ? "მდებარეობა" : "Konum"}: {selectedWhiteboardShelfCode}
                </h3>
                <p className="text-xs text-slate-600">
                  {activeLang === "en" ? "Configure the weight limits and subdivide this shelf cell." : activeLang === "de" ? "Tragfähigkeit konfigurieren und das Regal unterteilen." : activeLang === "ru" ? "Настройте лимиты веса и разделите ячейку полки." : activeLang === "ka" ? "თაროს წონის ლიმიტების კონფიგურაცია და დაყოფა." : "Hücrenin taşıma limitlerini ve alt bölme/bölüm (bin) durumunu ayarlayın."}
                </p>
              </div>

              {/* Shelf Nickname / Alias */}
              <label className="grid gap-1">
                <span className="text-xs font-extrabold text-slate-900">
                  {activeLang === "en" ? "Shelf Name / Alias (e.g., Heavy Parts)" : activeLang === "de" ? "Regalname / Alias (z. B. Schwere Teile)" : activeLang === "ru" ? "Название / псевдоним полки (напр., Тяжелые детали)" : activeLang === "ka" ? "თაროს სახელი / მეტსახელი (მაგ., მძიმე ნაწილები)" : "Raf İsim / Lakap (Örn: Ağır Parçalar)"}
                </span>
                <input
                  type="text"
                  placeholder={activeLang === "en" ? "Give this shelf a custom name..." : activeLang === "de" ? "Geben Sie diesem Regal einen benutzerdefinierten Namen..." : activeLang === "ru" ? "Дайте этой полке особое название..." : activeLang === "ka" ? "მიეცით ამ თაროს სახელი..." : "Bu rafa özel bir isim verin..."}
                  value={shelfAliases[`${activeWh.id}::${selectedWhiteboardShelfCode}`] || ""}
                  onChange={(e) => {
                    const updated = {
                      ...shelfAliases,
                      [`${activeWh.id}::${selectedWhiteboardShelfCode}`]: e.target.value
                    };
                    setShelfAliases(updated);
                    window.localStorage.setItem("hbs-shelf-aliases", JSON.stringify(updated));
                  }}
                  className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 bg-white" id="id-page-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-bold-focus-outline-none-focus-border-blue-500-bg-white-224" aria-label="Rounded xl border border slate 250 px 3 py 2 text xs font bold focus outline none focus border blue 500 bg white" />
              </label>

              {/* Capacity settings */}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-700">
                    {activeLang === "en" ? "Max Weight Limit (kg)" : activeLang === "de" ? "Max. Gewichtslimit (kg)" : activeLang === "ru" ? "Макс. лимит веса (кг)" : activeLang === "ka" ? "მაქს. წონის ლიმიტი (კგ)" : "Maks Ağırlık Limiti (kg)"}
                  </span>
                  <input
                    type="number"
                    value={shelfCapacities[selectedWhiteboardShelfCode]?.maxWeight ?? 100}
                    disabled={!isAuthorized}
                    onChange={(e) => {
                      if (!isAuthorized) {
                        showError(activeLang === "en" ? "Insufficient Permissions! Only Store Owner and Managers can change shelf limits." : activeLang === "de" ? "Unzureichende Berechtigungen! Nur der Ladenbesitzer und Manager können die Regallimits ändern." : activeLang === "ru" ? "Недостаточно прав! Только владелец магазина и управляющие могут изменять лимиты." : activeLang === "ka" ? "არასაკმარისი უფლებები! თაროს ლიმიტების შეცვლა შეუძლიათ მხოლოდ მფლობელს და მენეჯერებს." : "Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo raf limitlerini değiştirebilir.");
                        return;
                      }
                      setShelfCapacities({
                        ...shelfCapacities,
                        [selectedWhiteboardShelfCode]: {
                          maxWeight: Number(e.target.value) || 100,
                          maxVolume: shelfCapacities[selectedWhiteboardShelfCode]?.maxVolume ?? 1.0
                        }
                      });
                    }}
                    className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 disabled:opacity-50" id="id-page-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-bold-focus-outline-none-focus-border-blue-500-disabled-opacity-50-816" aria-label="Rounded xl border border slate 250 px 3 py 2 text xs font bold focus outline none focus border blue 500 disabled opacity 50" />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-700">
                    {activeLang === "en" ? "Max Volume Limit (m³)" : activeLang === "de" ? "Max. Volumenlimit (m³)" : activeLang === "ru" ? "Макс. лимит объема (м³)" : activeLang === "ka" ? "მაქს. მოცულობის ლიმიტი (მ³)" : "Maks Hacim Limiti (m³)"}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={shelfCapacities[selectedWhiteboardShelfCode]?.maxVolume ?? 1.0}
                    disabled={!isAuthorized}
                    onChange={(e) => {
                      if (!isAuthorized) {
                        showError(activeLang === "en" ? "Insufficient Permissions! Only Store Owner and Managers can change shelf limits." : activeLang === "de" ? "Unzureichende Berechtigungen! Nur der Ladenbesitzer und Manager können die Regallimits ändern." : activeLang === "ru" ? "Недостаточно прав! Только владелец магазина и управляющие могут изменять лимиты." : activeLang === "ka" ? "არასაკმარისი უფლებები! თაროს ლიმიტების შეცვლა შეუძლიათ მხოლოდ მფლობელს და მენეჯერებს." : "Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo raf limitlerini değiştirebilir.");
                        return;
                      }
                      setShelfCapacities({
                        ...shelfCapacities,
                        [selectedWhiteboardShelfCode]: {
                          maxWeight: shelfCapacities[selectedWhiteboardShelfCode]?.maxWeight ?? 100,
                          maxVolume: Number(e.target.value) || 1.0
                        }
                      });
                    }}
                    className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 disabled:opacity-50" id="id-page-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-bold-focus-outline-none-focus-border-blue-500-disabled-opacity-50-584" aria-label="Rounded xl border border slate 250 px 3 py 2 text xs font bold focus outline none focus border blue 500 disabled opacity 50" />
                </label>
              </div>

              {/* Compartments subdivisions count */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  {activeLang === "en" ? "Subdivide Shelf (Bins)" : activeLang === "de" ? "Regal unterteilen (Fächer)" : activeLang === "ru" ? "Разделить полку (ячейки)" : activeLang === "ka" ? "თაროს დაყოფა (უჯრები)" : "Rafı Hücrelere Böl (Subdivisions)"}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((count) => {
                    // Extract zone prefix and code to find corridor config
                    const parts = selectedWhiteboardShelfCode.split("-");
                    const zone = parts[0];
                    const slot = parts[1];
                    const level = parts[2];
                    const side = parts[3] ? parts[3].split("-")[0] : "";
                    const baseSideCode = `${zone}-${slot}-${level}${side ? `-${side}` : ""}`;
                    
                    const corr = corridors.find(c => c.zone === zone);
                    const currentBinsCount = corr?.binsConfig?.[baseSideCode] || 1;

                    return (
                      <button
                        key={count}
                        type="button"
                        disabled={!isAuthorized}
                        onClick={() => {
                          if (!isAuthorized) {
                            showError(activeLang === "en" ? "Insufficient Permissions! Only Store Owner and Managers can change shelf subdivisions." : activeLang === "de" ? "Unzureichende Berechtigungen! Nur der Ladenbesitzer und Manager können die Regalunterteilung ändern." : activeLang === "ru" ? "Недостаточно прав! Только владелец магазина и управляющие могут изменять ячейки." : activeLang === "ka" ? "არასაკმარისი უფლებები! თაროს დაყოფის შეცვლა შეუძლიათ მხოლოდ მფლობელს და მენეჯერებს." : "Yetersiz Yetki! Sadece Mağaza Sahibi veya Yöneticiler depo raf bölmelerini değiştirebilir.");
                            return;
                          }
                          if (corr) {
                            const updatedBinsConfig = { ...(corr.binsConfig || {}) };
                            updatedBinsConfig[baseSideCode] = count;
                            setCorridors(corridors.map(item => item.zone === zone ? { ...item, binsConfig: updatedBinsConfig } : item));
                            
                            const successAlert = activeLang === "en" ? `Shelf ${baseSideCode} configured with ${count} compartments.` : activeLang === "de" ? `Fach ${baseSideCode} mit ${count} Unterteilungen konfiguriert.` : activeLang === "ru" ? `Ячейка ${baseSideCode} настроена с ${count} отделениями.` : activeLang === "ka" ? `თარო ${baseSideCode} კონფიგურირებულია ${count} განყოფილებით.` : `${baseSideCode} hücresi ${count} bölmeli olarak ayarlandı.`;
                            showSuccess(successAlert);
                          }
                        }}
                        className={`rounded-xl py-2 px-1 text-xs font-black border transition disabled:opacity-50 ${
                          currentBinsCount === count
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {count} {activeLang === "en" ? "Bins" : activeLang === "de" ? "Fächer" : activeLang === "ru" ? "Ячеек" : activeLang === "ka" ? "უჯრა" : "Bölme"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products in this shelf */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  {activeLang === "en" ? "Current Products in Slot" : activeLang === "de" ? "Aktuelle Produkte im Fach" : activeLang === "ru" ? "Товары в ячейке" : activeLang === "ka" ? "პროდუქტები სლოტში" : "Hücredeki Mevcut Ürünler"}
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 pr-1">
                  {products.filter(p => p.warehouse.toLowerCase() === activeWh.name.toLowerCase() && p.shelf.toLowerCase() === selectedWhiteboardShelfCode.toLowerCase()).length > 0 ? (
                    products
                      .filter(p => p.warehouse.toLowerCase() === activeWh.name.toLowerCase() && p.shelf.toLowerCase() === selectedWhiteboardShelfCode.toLowerCase())
                      .map(p => (
                        <div key={p.id} className="text-[10px] leading-relaxed text-slate-600 border-b border-slate-100 pb-1.5 flex items-center justify-between gap-2">
                           <div className="flex items-center gap-2 min-w-0">
                            {p.imageUrl && (
                              <img src={p.imageUrl} alt={getLocalizedField(p.name, activeLang)} className="h-7 w-7 rounded-lg object-cover border border-slate-200 shrink-0" />
                            )}
                            <div className="flex flex-col min-w-0">
                              <strong className="text-slate-900 font-bold truncate">{getLocalizedField(p.name, activeLang)}</strong>
                              <span className="text-[9px] text-slate-550 font-mono">{p.sku}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono font-black text-blue-650 bg-blue-50 px-2 py-0.5 rounded text-[9px]">{p.quantity} {activeLang === "en" ? "pcs" : activeLang === "de" ? "Stk" : activeLang === "ru" ? "шт" : activeLang === "ka" ? "ცალი" : "Adet"}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteProductFromShelf(p.id, getLocalizedField(p.name, activeLang))}
                              className="text-[10px] font-black text-rose-600 hover:text-rose-700 transition cursor-pointer p-1"
                              title={activeLang === "en" ? "Manage / Delete Product" : activeLang === "de" ? "Produkt verwalten / löschen" : activeLang === "ru" ? "Управление / Удаление товара" : activeLang === "ka" ? "პროდუქტის მართვა / წაშლა" : "Ürünü Yönet / Sil"}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-[10px] text-slate-550 italic text-center py-4">
                      {activeLang === "en" ? "This slot is currently empty." : activeLang === "de" ? "Dieses Fach ist derzeit leer." : activeLang === "ru" ? "Эта ячейка пуста." : activeLang === "ka" ? "ეს სლოტი ამჟამად ცარიელია." : "Bu hücre şu an boş."}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWhiteboardShelfCode(null)}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white hover:bg-blue-500 transition active:scale-95 shadow-sm"
              >
                {activeLang === "en" ? "Apply & Close" : activeLang === "de" ? "Anwenden & Schließen" : activeLang === "ru" ? "Применить и закрыть" : activeLang === "ka" ? "გამოყენება და დახურვა" : "Uygula ve Kapat"}
              </button>
            </div>
          </div>
        )}

        {/* TRANSFER STATION TAB */}
        {activeWh && activeWorkspaceTab === 'transfer' && (
          <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr] animate-fadeIn">
            {/* Left: Transfer Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  {activeLang === "en" ? "TRANSFER STATION" : activeLang === "de" ? "TRANSFERSTATION" : activeLang === "ru" ? "СТАНЦИЯ ПЕРЕВОДА" : activeLang === "ka" ? "გადაცემის სადგური" : "TRANSFER İSTASYONU"}
                </span>
                <h2 className="text-base font-black text-slate-900 mt-1">
                  {activeLang === "en" ? "Dispatch Stock Inter-Warehouse" : activeLang === "de" ? "Lagerübergreifender Bestandsversand" : activeLang === "ru" ? "Перевести запасы между складами" : activeLang === "ka" ? "საქონლის გადაზიდვა საწყობებს შორის" : "Depolar Arası Stok Sevk Et"}
                </h2>
                <p className="text-xs text-slate-600">
                  {activeLang === "en" ? "Securely transfer stock between different warehouses and shelves." : activeLang === "de" ? "Bestände sicher zwischen verschiedenen Lagern und Regalen übertragen." : activeLang === "ru" ? "Надежно переводите запасы между складами и полками." : activeLang === "ka" ? "უსაფრთხოდ გადაიტანეთ საქონელი სხვა საწყობებსა და თაროებზე." : "Stokları başka depolara ve raflara güvenli bir şekilde aktarın."}
                </p>
              </div>

              <form onSubmit={handleInitiateTransfer} className="space-y-4">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-700">
                    {activeLang === "en" ? "Product to Dispatch" : activeLang === "de" ? "Produkt zum Versenden" : activeLang === "ru" ? "Товар для отправки" : activeLang === "ka" ? "პროდუქტი გასაგზავნად" : "Sevk Edilecek Ürün"}
                  </span>
                  <select
                    value={transferProductId}
                    onChange={(e) => {
                      setTransferProductId(e.target.value);
                      const prod = products.find(p => p.id === e.target.value);
                      if (prod) {
                        setTransferQty(1);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-250 px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="">
                      {activeLang === "en" ? "Select Product..." : activeLang === "de" ? "Produkt auswählen..." : activeLang === "ru" ? "Выберите товар..." : activeLang === "ka" ? "აირჩიეთ პროდუქტი..." : "Ürün Seçin..."}
                    </option>
                    {activeWhInventory.map((p) => (
                      <option key={p.id} value={p.id}>
                        {getLocalizedField(p.name, activeLang)} ({p.sku}) - {activeLang === "en" ? "On Shelf" : activeLang === "de" ? "Auf Regal" : activeLang === "ru" ? "На полке" : activeLang === "ka" ? "თაროზე" : "Raftaki Mevcut"}: {p.quantity} {activeLang === "en" ? "pcs" : activeLang === "de" ? "Stk" : activeLang === "ru" ? "шт" : activeLang === "ka" ? "ცალი" : "Adet"} ({activeLang === "en" ? "Shelf" : activeLang === "de" ? "Regal" : activeLang === "ru" ? "Полка" : activeLang === "ka" ? "თარო" : "Konum"}: {p.shelf})
                      </option>
                    ))}
                  </select>
                </label>

                {transferProductId && (
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-xs space-y-1 font-semibold text-slate-700">
                    <div>
                      {activeLang === "en" ? "📍 Source Shelf:" : activeLang === "de" ? "📍 Quellregal:" : activeLang === "ru" ? "📍 Исходная полка:" : activeLang === "ka" ? "📍 წყარო თარო:" : "📍 Kaynak Raf Konumu:"} <span className="font-mono text-blue-600 font-bold">{products.find(p => p.id === transferProductId)?.shelf}</span>
                    </div>
                    <div>
                      {activeLang === "en" ? "📦 Current Stock:" : activeLang === "de" ? "📦 Aktueller Bestand:" : activeLang === "ru" ? "📦 Текущий запас:" : activeLang === "ka" ? "📦 არსებული მარაგი:" : "📦 Mevcut Stok Adedi:"} <span className="text-slate-900 font-bold">{products.find(p => p.id === transferProductId)?.quantity} {activeLang === "en" ? "pcs" : activeLang === "de" ? "Stk" : activeLang === "ru" ? "шт" : activeLang === "ka" ? "ცალი" : "Adet"}</span>
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">
                      {activeLang === "en" ? "Target Warehouse" : activeLang === "de" ? "Ziellager" : activeLang === "ru" ? "Целевой склад" : activeLang === "ka" ? "სამიზნე საწყობი" : "Hedef Depo"}
                    </span>
                    <select
                      value={transferDestWhId}
                      onChange={(e) => {
                        setTransferDestWhId(e.target.value);
                        setTransferDestShelf("");
                      }}
                      className="w-full rounded-xl border border-slate-250 px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="">
                        {activeLang === "en" ? "Select Target..." : activeLang === "de" ? "Ziel auswählen..." : activeLang === "ru" ? "Выберите цель..." : activeLang === "ka" ? "აირჩიეთ სამიზნე..." : "Hedef Seçin..."}
                      </option>
                      {warehouses.filter(w => w.id !== activeWarehouseId).map((w) => (
                        <option key={w.id} value={w.id}>
                          🏪 {w.name} ({w.city})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">
                      {activeLang === "en" ? "Target Shelf Location" : activeLang === "de" ? "Zielregalstandort" : activeLang === "ru" ? "Целевая ячейка" : activeLang === "ka" ? "სამიზნე თაროს მდებარეობა" : "Hedef Raf Konumu"}
                    </span>
                    <select
                      value={transferDestShelf}
                      onChange={(e) => setTransferDestShelf(e.target.value)}
                      disabled={!transferDestWhId}
                      className="w-full rounded-xl border border-slate-250 px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-550"
                    >
                      <option value="">
                        {activeLang === "en" ? "Select Shelf Location..." : activeLang === "de" ? "Regalstandort auswählen..." : activeLang === "ru" ? "Выберите ячейку..." : activeLang === "ka" ? "აირჩიეთ თაროს მდებარეობა..." : "Raf Konumu Seçin..."}
                      </option>
                      {warehouses.find(w => w.id === transferDestWhId)?.shelves?.map((sh) => (
                        <option key={sh} value={sh}>
                          {activeLang === "en" ? "Shelf" : activeLang === "de" ? "Regal" : activeLang === "ru" ? "Полка" : activeLang === "ka" ? "თარო" : "Raf"}: {sh}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">
                      {activeLang === "en" ? "Quantity to Dispatch" : activeLang === "de" ? "Versandmenge" : activeLang === "ru" ? "Количество для отправки" : activeLang === "ka" ? "გასაგზავნი რაოდენობა" : "Sevk Edilecek Adet"}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={transferProductId ? Number(products.find(p => p.id === transferProductId)?.quantity || 1) : 9999}
                      value={transferQty}
                      onChange={(e) => setTransferQty(Number(e.target.value))}
                      className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-bold-focus-outline-none-focus-border-blue-500-323" aria-label="Rounded xl border border slate 250 px 3 py 2 text xs font bold focus outline none focus border blue 500" />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">
                      {activeLang === "en" ? "Dispatch Note" : activeLang === "de" ? "Versandhinweis" : activeLang === "ru" ? "Примечание к отправке" : activeLang === "ka" ? "გაგზავნის შენიშვნა" : "Sevk Notu"}
                    </span>
                    <input
                      type="text"
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      placeholder={activeLang === "en" ? "e.g., Moving to aisle B" : activeLang === "de" ? "z. B. Verschiebung in Gang B" : activeLang === "ru" ? "напр., Перемещение на стеллаж B" : activeLang === "ka" ? "მაგ., გადატანა B სექტორში" : "Örn: B reyonuna kaydırma"}
                      className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500" id="id-page-rounded-xl-border-border-slate-250-px-3-py-2-text-xs-font-semibold-focus-outline-none-focus-border-blue-500-655" aria-label="Rounded xl border border slate 250 px 3 py 2 text xs font semibold focus outline none focus border blue 500" />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3 text-xs font-black text-white hover:bg-blue-500 transition active:scale-95 shadow-sm"
                >
                  {activeLang === "en" ? "⚡ Start Shipping Transfer" : activeLang === "de" ? "⚡ Transferversand starten" : activeLang === "ru" ? "⚡ Начать перевозку" : activeLang === "ka" ? "⚡ გადაზიდვის დაწყება" : "⚡ Transfer Sevkiyatını Başlat"}
                </button>
              </form>
            </div>

            {/* Right: Active/Pending Transfers */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {activeLang === "en" ? "Transfer Movements & Job Orders" : activeLang === "de" ? "Transferbewegungen & Arbeitsaufträge" : activeLang === "ru" ? "Переводы и заказ-наряды" : activeLang === "ka" ? "შიდა გადაცემის მოძრაობები და სამუშაო ორდერები" : "Transfer Hareketleri ve İş Emirleri"}
                </h3>
                <p className="text-xs text-slate-600">
                  {activeLang === "en" ? "Tracking list of products in the inter-warehouse shipping phase." : activeLang === "de" ? "Verfolgungsliste der Produkte im lagerübergreifenden Versand." : activeLang === "ru" ? "Список отслеживания товаров на этапе межскладской перевозки." : activeLang === "ka" ? "საწყობებს შორის გადაზიდვის პროცესში მყოფი პროდუქტების სია." : "Depolar arası sevk aşamasındaki ürünlerin takip listesi."}
                </p>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {stockTransfers.length > 0 ? (
                  stockTransfers.map((t) => (
                    <article key={t.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 transition hover:border-slate-300 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-850 text-xs">{t.productName}</h4>
                          <span className="text-[9px] font-mono text-slate-450 block mt-0.5">SKU: {t.sku} | ID: {t.id}</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase ${
                          t.status === 'in_transit' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.status === 'in_transit' 
                            ? (activeLang === "en" ? "✈ In Transit (Pending)" : activeLang === "de" ? "✈ Unterwegs (Ausstehend)" : activeLang === "ru" ? "✈ В пути (Ожидание)" : activeLang === "ka" ? "✈ გზაშია (მოლოდინი)" : "✈ Yolda (Beklemede)") 
                            : (activeLang === "en" ? "✓ Received" : activeLang === "de" ? "✓ Geliefert" : activeLang === "ru" ? "✓ Получено" : activeLang === "ka" ? "✓ მიღებულია" : "✓ Teslim Alındı")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 bg-white border border-slate-100 p-2 rounded-xl">
                        <div>
                          {activeLang === "en" ? "🏪 Origin:" : activeLang === "de" ? "🏪 Abgang:" : activeLang === "ru" ? "🏪 Выход:" : activeLang === "ka" ? "🏪 გასავალი:" : "🏪 Çıkış:"} <strong className="text-slate-800">{t.sourceWh} ({t.sourceShelf})</strong>
                        </div>
                        <div>
                          {activeLang === "en" ? "🏪 Target:" : activeLang === "de" ? "🏪 Ziel:" : activeLang === "ru" ? "🏪 Цель:" : activeLang === "ka" ? "🏪 სამიზნე:" : "🏪 Hedef:"} <strong className="text-slate-800">{t.destWh} ({t.destShelf})</strong>
                        </div>
                        <div>
                          {activeLang === "en" ? "📦 Qty:" : activeLang === "de" ? "📦 Menge:" : activeLang === "ru" ? "📦 Кол-во:" : activeLang === "ka" ? "📦 რაოდ:" : "📦 Adet:"} <strong className="text-blue-600 font-mono">{t.quantity} {activeLang === "en" ? "pcs" : activeLang === "de" ? "Stk" : activeLang === "ru" ? "шт" : activeLang === "ka" ? "ცალი" : "Adet"}</strong>
                        </div>
                        <div>
                          {activeLang === "en" ? "📅 Date:" : activeLang === "de" ? "📅 Datum:" : activeLang === "ru" ? "📅 Дата:" : activeLang === "ka" ? "📅 თარიღი:" : "📅 Tarih:"} <span className="text-slate-700 font-mono">{t.createdAt}</span>
                        </div>
                        <div className="col-span-2 italic text-slate-450 mt-1">
                          {activeLang === "en" ? "Note:" : activeLang === "de" ? "Hinweis:" : activeLang === "ru" ? "Прим.:" : activeLang === "ka" ? "შენიშვნა:" : "Not:"} {t.note}
                        </div>
                      </div>

                      {t.status === 'in_transit' && (
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleCancelTransfer(t.id)}
                            className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-[10px] font-black text-rose-700 hover:bg-rose-100 transition active:scale-95"
                          >
                            {activeLang === "en" ? "Cancel & Return" : activeLang === "de" ? "Stornieren & Zurückgeben" : activeLang === "ru" ? "Отмена и возврат" : activeLang === "ka" ? "გაუქმება და დაბრუნება" : "İptal Et & İade Et"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmTransfer(t.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-emerald-500 transition active:scale-95 shadow-sm"
                          >
                            {activeLang === "en" ? "⚡ Receive & Confirm Shipment" : activeLang === "de" ? "⚡ Lieferung empfangen & bestätigen" : activeLang === "ru" ? "⚡ Принять и подтвердить поставку" : activeLang === "ka" ? "⚡ მიღება და დადასტურება" : "⚡ Sevkiyatı Teslim Al ve Onayla"}
                          </button>
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="text-xs text-slate-550 italic py-8 text-center bg-slate-50/50 rounded-2xl border border-slate-200">
                    {activeLang === "en" ? "No active inter-warehouse transfers or job orders found." : activeLang === "de" ? "Keine aktiven lagerübergreifenden Transfers oder Arbeitsaufträge gefunden." : activeLang === "ru" ? "Нет активных межскладских переводов или заказ-нарядов." : activeLang === "ka" ? "აქტიური გადაცემები ან სამუშაო ორდერები არ მოიძებნა." : "Aktif depolar arası transfer veya iş emri bulunmuyor."}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* AUDIT (Sayım) TAB */}
        {activeWh && activeWorkspaceTab === 'audit' && (
          <section className="space-y-4 animate-fadeIn">
            {!isAuditActive ? (
              // Start Session Panel
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl mx-auto space-y-4 text-center">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  {activeLang === "en" ? "STOCK AUDIT" : activeLang === "de" ? "BESTANDSPRÜFUNG" : activeLang === "ru" ? "АУДИТ ЗАПАСОВ" : activeLang === "ka" ? "მარაგების აუდიტი" : "STOK DENETİMİ"}
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  {activeLang === "en" ? "Blind Inventory Count Session" : activeLang === "de" ? "Blinde Inventurzählung" : activeLang === "ru" ? "Сессия слепой инвентаризации" : activeLang === "ka" ? "ბრმა ინვენტარიზაციის სესია" : "Kör Envanter Sayım Oturumu"}
                </h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {activeLang === "en" ? "Hide system stock quantities to allow staff to perform a blind count of physical inventory. A discrepancy report is generated automatically." : activeLang === "de" ? "Systembestände ausblenden, damit das Personal eine blinde Zählung durchführen kann. Ein Differenzbericht wird automatisch erstellt." : activeLang === "ru" ? "Скройте системные количества, чтобы сотрудники могли провести инвентаризацию вслепую. Отчет о расхождениях создается автоматически." : activeLang === "ka" ? "დამალეთ სისტემური რაოდენობა, რათა პერსონალმა ჩაატაროს ბრმა ინვენტარიზაცია. სხვაობის ანგარიში გენერირდება ავტომატურად." : "Sistemdeki stok adetlerini gizleyerek personelin fiziki envanteri körleme saymasını sağlayın. Sayım bittiğinde otomatik fark raporu çıkarılır."}
                </p>

                <div className="border-t border-slate-100 pt-4 text-left space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    {activeLang === "en" ? "Corridors / Shelves to Include in Audit" : activeLang === "de" ? "In die Prüfung einzubeziehende Regale" : activeLang === "ru" ? "Полки, включаемые в аудит" : activeLang === "ka" ? "აუდიტში ჩასართავი თაროები" : "Sayıma Dahil Edilecek Reyonlar / Raflar"}
                  </span>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {activeWh.shelves && activeWh.shelves.length > 0 ? (
                      activeWh.shelves.map((sh) => (
                        <label key={sh} className="flex items-center gap-2 text-xs font-bold text-slate-700 p-1 hover:bg-white rounded cursor-pointer transition">
                          <input
                            type="checkbox"
                            defaultChecked
                            id={`audit-sh-${sh}`}
                            className="accent-blue-600 rounded"
                          />
                          <span>{sh}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-xs text-slate-550 col-span-3 italic text-center py-4">
                        {activeLang === "en" ? "No shelves defined in this warehouse." : activeLang === "de" ? "Keine Regale in diesem Lager definiert." : activeLang === "ru" ? "В этом складе нет определенных полок." : activeLang === "ka" ? "საწყობში თაროები არ არის განსაზღვრული." : "Depoda tanımlanmış raf yok."}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const checked: string[] = [];
                    activeWh.shelves?.forEach((sh) => {
                      const el = document.getElementById(`audit-sh-${sh}`) as HTMLInputElement;
                      if (el && el.checked) {
                        checked.push(sh);
                      }
                    });
                    handleStartAudit(checked);
                  }}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-6 py-3 transition shadow-sm active:scale-95"
                >
                  {activeLang === "en" ? "⚡ Start Blind Count Session (Locked Mode)" : activeLang === "de" ? "⚡ Blinde Zählung starten (Sperrmodus)" : activeLang === "ru" ? "⚡ Начать слепую инвентаризацию (заблокированный режим)" : activeLang === "ka" ? "⚡ ბრმა ინვენტარიზაციის დაწყება (ჩაკეტილი რეჟიმი)" : "⚡ Kör Sayım Oturumunu Başlat (Kilitli Mod)"}
                </button>
              </div>
            ) : (
              // Active Session Panel
              <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                {/* Left: Input station */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider bg-amber-50 px-2 py-0.5 rounded-full">
                        {activeLang === "en" ? "COUNT ACTIVE" : activeLang === "de" ? "ZÄHLUNG AKTIV" : activeLang === "ru" ? "ИНВЕНТАРИЗАЦИЯ АКТИВНА" : activeLang === "ka" ? "ინვენტარიზაცია აქტიურია" : "SAYIM AKTİF"}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">
                        {activeLang === "en" ? "Barcode / Location Scan Station" : activeLang === "de" ? "Barcode- / Standort-Scanstation" : activeLang === "ru" ? "Станция сканирования штрихкодов / ячеек" : activeLang === "ka" ? "შტრიხკოდის / მდებარეობის სკანირების სადგური" : "Barkod / Konum Okutma İstasyonu"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAuditActive(false)}
                      className="text-xs text-slate-550 hover:text-slate-600 font-bold"
                    >
                      {activeLang === "en" ? "Close Session ✕" : activeLang === "de" ? "Sitzung schließen ✕" : activeLang === "ru" ? "Закрыть сессию ✕" : activeLang === "ka" ? "სესიის დახურვა ✕" : "Oturumu Kapat ✕"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <label className="grid gap-1">
                      <span className="text-xs font-bold text-slate-700">
                        {activeLang === "en" ? "Audited Shelf Location" : activeLang === "de" ? "Geprüfter Regalstandort" : activeLang === "ru" ? "Проверяемая ячейка" : activeLang === "ka" ? "შემოწმებული თაროს მდებარეობა" : "Sayım Yapılan Raf Konumu"}
                      </span>
                      <select
                        value={auditCurrentShelf}
                        onChange={(e) => setAuditCurrentShelf(e.target.value)}
                        className="w-full rounded-xl border border-slate-250 px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 bg-slate-50"
                      >
                        {auditShelfSelections.map((sh) => (
                          <option key={sh} value={sh}>
                            {activeLang === "en" ? "Shelf" : activeLang === "de" ? "Regal" : activeLang === "ru" ? "Полка" : activeLang === "ka" ? "თარო" : "Raf"}: {sh}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid gap-3 sm:grid-cols-[1fr_100px]">
                      <label className="grid gap-1">
                        <span className="text-xs font-bold text-slate-700">
                          {activeLang === "en" ? "Scan Product SKU / Barcode" : activeLang === "de" ? "Produkt-SKU / Barcode scannen" : activeLang === "ru" ? "Отсканируйте SKU / штрихкод товара" : activeLang === "ka" ? "დაასკანირეთ პროდუქტის SKU / შტრიხკოდი" : "Ürün SKU / Barkod Okutun"}
                        </span>
                        <input
                          type="text"
                          id="audit-barcode-input"
                          placeholder={activeLang === "en" ? "Scan barcode or type SKU" : activeLang === "de" ? "Barcode scannen oder SKU eingeben" : activeLang === "ru" ? "Сканируйте штрихкод или введите SKU" : activeLang === "ka" ? "დაასკანირეთ შტრიხკოდი ან ჩაწერეთ SKU" : "Barkod Okutun veya SKU Yazın"}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const barcodeInput = document.getElementById("audit-barcode-input") as HTMLInputElement;
                              const qtyInput = document.getElementById("audit-qty-input") as HTMLInputElement;
                              if (barcodeInput.value.trim()) {
                                handleRecordAuditCount(barcodeInput.value.trim().toUpperCase(), Number(qtyInput.value) || 1);
                                barcodeInput.value = "";
                                barcodeInput.focus();
                              }
                            }
                          }}
                          className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="grid gap-1">
                        <span className="text-xs font-bold text-slate-700">
                          {activeLang === "en" ? "Quantity" : activeLang === "de" ? "Menge" : activeLang === "ru" ? "Количество" : activeLang === "ka" ? "რაოდენობა" : "Miktar"}
                        </span>
                        <input
                          type="number"
                          id="audit-qty-input"
                          defaultValue={1}
                          min={1}
                          className="rounded-xl border border-slate-250 px-3 py-2 text-xs font-bold text-center focus:outline-none focus:border-blue-500"
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const barcodeInput = document.getElementById("audit-barcode-input") as HTMLInputElement;
                        const qtyInput = document.getElementById("audit-qty-input") as HTMLInputElement;
                        if (barcodeInput.value.trim()) {
                          handleRecordAuditCount(barcodeInput.value.trim().toUpperCase(), Number(qtyInput.value) || 1);
                          barcodeInput.value = "";
                          barcodeInput.focus();
                        } else {
                          showError(activeLang === "en" ? "Please enter a product barcode." : activeLang === "de" ? "Bitte geben Sie einen Produkt-Barcode ein." : activeLang === "ru" ? "Пожалуйста, введите штрихкод товара." : activeLang === "ka" ? "გთხოვთ შეიყვანოთ პროდუქტის შტრიხკოდი." : "Lütfen bir ürün barkodu girin.");
                        }
                      }}
                      className="w-full rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition active:scale-95"
                    >
                      {activeLang === "en" ? "Save Count (Confirm Cell)" : activeLang === "de" ? "Zählung speichern (Fach bestätigen)" : activeLang === "ru" ? "Сохранить подсчет (Подтвердить ячейку)" : activeLang === "ka" ? "მარაგის შენახვა (უჯრის დადასტურება)" : "Sayımı Kaydet (Hücreyi Onayla)"}
                    </button>
                  </div>

                  {/* Audit logs timeline */}
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      {activeLang === "en" ? "Count History (Last Scanned)" : activeLang === "de" ? "Zählverlauf (Zuletzt gescannt)" : activeLang === "ru" ? "История подсчета (Последние сканирования)" : activeLang === "ka" ? "ინვენტარიზაციის ისტორია (ბოლო სკანირებული)" : "Sayım Akışı (Son Okutulanlar)"}
                    </span>
                    <div className="max-h-56 overflow-y-auto space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 pr-1">
                      {auditLogs.length > 0 ? (
                        auditLogs.map((l) => (
                          <div key={l.id} className="text-[10px] leading-relaxed text-slate-600 border-b border-slate-100 pb-1 flex justify-between">
                            <div>
                              <strong className="text-slate-800">{l.productName}</strong>
                              <span className="text-blue-600 font-mono font-bold ml-1">({l.shelf})</span>
                            </div>
                            <div className="font-mono text-right shrink-0 ml-2 font-black text-slate-900">
                              {l.quantity} {activeLang === "en" ? "pcs" : activeLang === "de" ? "Stk" : activeLang === "ru" ? "шт" : activeLang === "ka" ? "ცალი" : "Adet"} | <span className="text-slate-550 font-normal">{l.time}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-550 italic text-center py-6">
                          {activeLang === "en" ? "Scan a barcode to start the blind count." : activeLang === "de" ? "Scannen Sie einen Barcode, um die blinde Zählung zu starten." : activeLang === "ru" ? "Отсканируйте штрихкод для начала слепой инвентаризации." : activeLang === "ka" ? "დაასკანირეთ შტრიხკოდი ბრმა ინვენტარიზაციის დასაწყებად." : "Kör sayıma başlamak için barkod okutun."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Live Discrepancies report */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        {activeLang === "en" ? "Live Reconciliation & Discrepancy Report" : activeLang === "de" ? "Live-Abgleich & Differenzbericht" : activeLang === "ru" ? "Живой отчет о сверке и расхождениях" : activeLang === "ka" ? "სინქრონიზაციისა და სხვაობის ცოცხალი ანგარიში" : "Canlı Mutabakat & Fark Raporu"}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {activeLang === "en" ? "Deviations between system stock levels and physical counts." : activeLang === "de" ? "Abweichungen zwischen Systembestand und physischer Zählung." : activeLang === "ru" ? "Отклонения между уровнями запасов в системе и физическим подсчетом." : activeLang === "ka" ? "სხვაობა სისტემურ რაოდენობასა და ფიზიკურ ინვენტარიზაციას შორის." : "Sistemdeki stok seviyeleri ile fiziki sayımlar arasındaki sapmalar."}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[380px] border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[9px] font-black text-slate-700 uppercase">
                          <th className="p-2.5">
                            {activeLang === "en" ? "Shelf" : activeLang === "de" ? "Regal" : activeLang === "ru" ? "Полка" : activeLang === "ka" ? "თარო" : "Raf"}
                          </th>
                          <th className="p-2.5">
                            {activeLang === "en" ? "Product" : activeLang === "de" ? "Produkt" : activeLang === "ru" ? "Товар" : activeLang === "ka" ? "პროდუქტი" : "Ürün"}
                          </th>
                          <th className="p-2.5 text-center">
                            {activeLang === "en" ? "System" : activeLang === "de" ? "System" : activeLang === "ru" ? "Система" : activeLang === "ka" ? "სისტემა" : "Sistem"}
                          </th>
                          <th className="p-2.5 text-center">
                            {activeLang === "en" ? "Counted" : activeLang === "de" ? "Gezählt" : activeLang === "ru" ? "Подсчитано" : activeLang === "ka" ? "დათვლილი" : "Sayılan"}
                          </th>
                          <th className="p-2.5 text-center">
                            {activeLang === "en" ? "Diff" : activeLang === "de" ? "Diff" : activeLang === "ru" ? "Разн." : activeLang === "ka" ? "სხვაობა" : "Fark"}
                          </th>
                          <th className="p-2.5 text-right">
                            {activeLang === "en" ? "Status" : activeLang === "de" ? "Status" : activeLang === "ru" ? "Статус" : activeLang === "ka" ? "სტატუსი" : "Durum"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {products
                          .filter(
                            p =>
                              p.warehouse.toLowerCase() === activeWh.name.toLowerCase() &&
                              auditShelfSelections.some(sh => sh.toLowerCase() === p.shelf.toLowerCase())
                          )
                          .map((p) => {
                            const key = `${p.shelf}_${p.sku}`;
                            const counted = auditCounts[key] ?? 0;
                            const systemQty = Number(p.quantity) || 0;
                            const diff = counted - systemQty;
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/50">
                                <td className="p-2.5 font-mono text-blue-600 font-bold">{p.shelf}</td>
                                <td className="p-2.5">
                                  <span className="font-bold text-slate-900 truncate block max-w-xs">{getLocalizedField(p.name, activeLang)}</span>
                                  <span className="text-[9px] text-slate-550 font-mono">{p.sku}</span>
                                </td>
                                <td className="p-2.5 text-center font-mono">{systemQty}</td>
                                <td className="p-2.5 text-center font-mono font-black text-slate-800">{counted}</td>
                                <td className={`p-2.5 text-center font-mono font-black ${
                                  diff === 0 ? 'text-slate-700' : diff > 0 ? 'text-emerald-600' : 'text-rose-600'
                                }`}>
                                  {diff > 0 ? `+${diff}` : diff}
                                </td>
                                <td className="p-2.5 text-right font-black uppercase text-[8px]">
                                  {diff === 0 ? (
                                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                      {activeLang === "en" ? "MATCHED" : activeLang === "de" ? "ABGESTIMMT" : activeLang === "ru" ? "СОВПАДАЕТ" : activeLang === "ka" ? "ემთხვევა" : "MUTABIK"}
                                    </span>
                                  ) : diff > 0 ? (
                                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                                      {activeLang === "en" ? "SURPLUS" : activeLang === "de" ? "ÜBERSCHUSS" : activeLang === "ru" ? "ИЗЛИШЕК" : activeLang === "ka" ? "ზედმეტი" : "FAZLA STOK"}
                                    </span>
                                  ) : (
                                    <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                                      {activeLang === "en" ? "DEFICIT" : activeLang === "de" ? "FEHLBETRAG" : activeLang === "ru" ? "НЕДОСТАЧА" : activeLang === "ka" ? "დეკლარირებული" : "EKSİK STOK"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAuditActive(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      {activeLang === "en" ? "Close Without Saving" : activeLang === "de" ? "Schließen ohne Speichern" : activeLang === "ru" ? "Закрыть без сохранения" : activeLang === "ka" ? "დახურვა შენახვის გარეშე" : "Kaydetmeden Kapat"}
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyAuditAdjustments}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-500 transition active:scale-95 shadow-sm"
                    >
                      {activeLang === "en" ? "⚡ Approve Count & Adjust Stocks" : activeLang === "de" ? "⚡ Zählung bestätigen & Bestände korrigieren" : activeLang === "ru" ? "⚡ Подтвердить и скорректировать запасы" : activeLang === "ka" ? "⚡ დადასტურება და მარაგის კორექტირება" : "⚡ Sayımı Onayla & Stokları Düzelt"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ZPL BARKOD LAB TAB */}
        {activeWh && activeWorkspaceTab === 'zpl' && (
          <section className="grid gap-4 lg:grid-cols-[1fr_1.1fr] animate-fadeIn">
            {/* Left: ZPL Generator Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  {activeLang === "en" ? "ZPL LABEL LABORATORY" : activeLang === "de" ? "ZPL-ETIKETTENLABOR" : activeLang === "ru" ? "ЛАБОРАТОРИЯ ЭТИКЕТОК ZPL" : activeLang === "ka" ? "ZPL ეტიკეტების ლაბორატორია" : "ZPL ETİKET LABORATUVARI"}
                </span>
                <h2 className="text-base font-black text-slate-900 mt-1">
                  {activeLang === "en" ? "Zebra Thermal Barcode Template" : activeLang === "de" ? "Zebra Thermo-Barcode-Vorlage" : activeLang === "ru" ? "Шаблон термоштрихкода Zebra" : activeLang === "ka" ? "Zebra თერმული შტრიხკოდის შაბლონი" : "Zebra Termal Barkod Şablonu"}
                </h2>
                <p className="text-xs text-slate-600">
                  {activeLang === "en" ? "Generate ZPL II code instantly for industrial Zebra label printers." : activeLang === "de" ? "Erzeugen Sie sofort ZPL II-Code für industrielle Zebra-Etikettendrucker." : activeLang === "ru" ? "Мгновенно создавайте код ZPL II для промышленных принтеров этикеток Zebra." : activeLang === "ka" ? "მყისიერად დააგენერირეთ ZPL II კოდი ინდუსტრიული Zebra პრინტერებისთვის." : "Endüstriyel Zebra etiket yazıcıları için anında ZPL II kodu üretin."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">
                      {activeLang === "en" ? "Label Size" : activeLang === "de" ? "Etikettengröße" : activeLang === "ru" ? "Размер этикетки" : activeLang === "ka" ? "ეტიკეტის ზომა" : "Etiket Boyutu"}
                    </span>
                    <select
                      value={zplLabelSize}
                      onChange={(e) => setZplLabelSize(e.target.value as "2x1" | "3x2")}
                      className="w-full rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="3x2">{activeLang === "en" ? "3\" x 2\" (Large Shelf/Product Label)" : activeLang === "de" ? "3\" x 2\" (Großes Regal-/Produktetikett)" : activeLang === "ru" ? "3\" x 2\" (Большая этикетка полки/товара)" : activeLang === "ka" ? "3\" x 2\" (დიდი თაროს/პროდუქტის ეტიკეტი)" : "3\" x 2\" (Büyük Raf/Ürün Etiketi)"}</option>
                      <option value="2x1">{activeLang === "en" ? "2\" x 1\" (Small Part Label)" : activeLang === "de" ? "2\" x 1\" (Kleines Teileetikett)" : activeLang === "ru" ? "2\" x 1\" (Маленькая этикетка детали)" : activeLang === "ka" ? "2\" x 1\" (მცირე ნაწილის ეტიკეტი)" : "2\" x 1\" (Küçük Parça Etiketi)"}</option>
                    </select>
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-700">
                      {activeLang === "en" ? "Template Target" : activeLang === "de" ? "Vorlagenziel" : activeLang === "ru" ? "Цель шаблона" : activeLang === "ka" ? "შაბლონის სამიზნე" : "Şablon Hedefi"}
                    </span>
                    <select
                      value={zplProductId}
                      onChange={(e) => {
                        setZplProductId(e.target.value);
                        if (e.target.value.startsWith("shelf_")) {
                          generateZPL("shelf", e.target.value.replace("shelf_", ""));
                        } else if (e.target.value) {
                          const p = products.find(prod => prod.id === e.target.value);
                          if (p) generateZPL("product", p);
                        } else {
                          setZplText("");
                        }
                      }}
                      className="w-full rounded-xl border border-slate-250 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="">
                        {activeLang === "en" ? "Select Target..." : activeLang === "de" ? "Ziel auswählen..." : activeLang === "ru" ? "Выберите цель..." : activeLang === "ka" ? "აირჩიეთ სამიზნე..." : "Hedef Seçin..."}
                      </option>
                      <optgroup label={activeLang === "en" ? "Products" : activeLang === "de" ? "Produkte" : activeLang === "ru" ? "Товары" : activeLang === "ka" ? "პროდუქტები" : "Ürünler"}>
                        {activeWhInventory.map(p => (
                          <option key={p.id} value={p.id}>📦 {getLocalizedField(p.name, activeLang)} ({p.sku})</option>
                        ))}
                      </optgroup>
                      <optgroup label={activeLang === "en" ? "Warehouse Shelves" : activeLang === "de" ? "Lagerregale" : activeLang === "ru" ? "Полки склада" : activeLang === "ka" ? "საწყობის თაროები" : "Depo Rafları"}>
                        {activeWh.shelves?.map(sh => (
                          <option key={sh} value={`shelf_${sh}`}>📍 {activeLang === "en" ? "Shelf Position" : activeLang === "de" ? "Regalposition" : activeLang === "ru" ? "Положение полки" : activeLang === "ka" ? "თაროს მდებარეობა" : "Raf Konumu"}: {sh}</option>
                        ))}
                      </optgroup>
                    </select>
                  </label>
                </div>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-700">
                    {activeLang === "en" ? "ZPL II Raw Code Output (Code to send to printer)" : activeLang === "de" ? "ZPL II Raw-Code-Ausgabe (Code für den Drucker)" : activeLang === "ru" ? "ZPL II Исходный код (Код для отправки на принтер)" : activeLang === "ka" ? "ZPL II ნედლი კოდის გამოსავალი (კოდი პრინტერისთვის)" : "ZPL II Ham Kod Çıktısı (Yazıcıya Gönderilecek Kod)"}
                  </span>
                  <textarea
                    rows={8}
                    value={zplText}
                    onChange={(e) => setZplText(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 p-3 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 bg-slate-50"
                    placeholder="^XA\n^FO50,50^A0N,30,30^FDBarkod Yazıcı^FS\n^XZ"
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!zplText.trim()) {
                        showError(activeLang === "en" ? "Please generate or write a ZPL code first." : activeLang === "de" ? "Bitte generieren oder schreiben Sie zuerst einen ZPL-Code." : activeLang === "ru" ? "Пожалуйста, сначала создайте или напишите код ZPL." : activeLang === "ka" ? "გთხოვთ ჯერ დააგენერიროთ ან ჩაწეროთ ZPL კოდი." : "Lütfen önce bir ZPL kodu oluşturun veya yazın.");
                        return;
                      }
                      navigator.clipboard.writeText(zplText);
                      showSuccess(activeLang === "en" ? "ZPL code copied to clipboard! You can paste it directly to printer software." : activeLang === "de" ? "ZPL-Code in die Zwischenablage kopiert! Sie können ihn direkt in die Druckersoftware einfügen." : activeLang === "ru" ? "Код ZPL скопирован в буфер обмена! Вы можете вставить его непосредственно в ПО принтера." : activeLang === "ka" ? "ZPL კოდი კოპირებულია! შეგიძლიათ პირდაპირ ჩასვათ პრინტერის პროგრამაში." : "ZPL kodu panoya kopyalandı! Termal yazıcı gönderme yazılımlarına doğrudan yapıştırabilirsiniz.");
                    }}
                    className="flex-1 rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition text-center shadow-sm"
                  >
                    {activeLang === "en" ? "Copy Code to Clipboard 📋" : activeLang === "de" ? "Code in Zwischenablage kopieren 📋" : activeLang === "ru" ? "Копировать код 📋" : activeLang === "ka" ? "კოდის ბუფერში კოპირება 📋" : "Kodu Panoya Kopyala 📋"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!zplText.trim()) {
                        showError(activeLang === "en" ? "Please generate a ZPL code first." : activeLang === "de" ? "Bitte generieren Sie zuerst einen ZPL-Code." : activeLang === "ru" ? "Пожалуйста, сначала создайте код ZPL." : activeLang === "ka" ? "გთხოვთ ჯერ დააგენერიროთ ZPL კოდი." : "Lütfen önce bir ZPL kodu oluşturun.");
                        return;
                      }
                      // Simulate direct network socket printing
                      showSuccess(activeLang === "en" ? "Sent to Thermal Printer (Simulated: RAW Port 9100)." : activeLang === "de" ? "An Thermodrucker gesendet (Simuliert: RAW Port 9100)." : activeLang === "ru" ? "Отправлено на термопринтер (Симуляция: порт RAW 9100)." : activeLang === "ka" ? "გაგზავნილია თერმულ პრინტერთან (სიმულირებული: RAW Port 9100)." : "Termal Yazıcıya Gönderildi (Simüle edildi: RAW Port 9100).");
                    }}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-black text-white hover:bg-blue-500 transition text-center shadow-sm active:scale-95"
                  >
                    {activeLang === "en" ? "Send to Printer 🖨️" : activeLang === "de" ? "An Drucker senden 🖨️" : activeLang === "ru" ? "Отправить на принтер 🖨️" : activeLang === "ka" ? "პრინტერთან გაგზავნა 🖨️" : "Yazıcıya Gönder 🖨️"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Thermal Sticker Preview Simulator */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {activeLang === "en" ? "Thermal Label Simulation" : activeLang === "de" ? "Thermoetikett-Simulation" : activeLang === "ru" ? "Симуляция термоэтикетки" : activeLang === "ka" ? "თერმული ეტიკეტის სიმულაცია" : "Termal Etiket Simülasyonu"}
                </h3>
                <p className="text-xs text-slate-600">
                  {activeLang === "en" ? "Visual simulation of the physical label printing from the thermal head." : activeLang === "de" ? "Visuelle Simulation des physikalischen Etikettendrucks vom Thermokopf." : activeLang === "ru" ? "Визуальная симуляция печати физической этикетки с термоголовки." : activeLang === "ka" ? "თერმული თავიდან ფიზიკური ეტიკეტის ბეჭდვის ვიზუალური სიმულაცია." : "Yazıcının termal kafasından çıkacak fiziksel etiketin görsel simülasyonu."}
                </p>
              </div>

              {/* Simulated Sticker Box */}
              <div className="flex-1 flex items-center justify-center p-6 bg-slate-100 rounded-3xl min-h-[300px]">
                {zplText ? (
                  <div className={`bg-white border-2 border-slate-800 border-dashed rounded-xl shadow-md p-6 flex flex-col justify-between text-black relative font-mono select-none ${
                    zplLabelSize === "3x2" ? "w-[360px] h-[240px]" : "w-[280px] h-[160px]"
                  }`}>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-1.5">
                      <span className="text-[10px] font-black tracking-widest">{storeName.toUpperCase()}</span>
                      <span className="text-[7px] font-bold bg-black text-white px-1.5 py-0.5 rounded">TERMAL KAFA</span>
                    </div>

                    {/* Content parser simulation */}
                    <div className="space-y-1.5 py-2">
                      {zplProductId ? (
                        zplProductId.startsWith("shelf_") ? (
                          <div className="text-center space-y-1">
                            <span className="text-[9px] font-black uppercase text-slate-700">
                              {activeLang === "en" ? "SHELF BARCODE" : activeLang === "de" ? "REGALBARCODE" : activeLang === "ru" ? "ШТРИХКОД ПОЛКИ" : activeLang === "ka" ? "თაროს შტრიხკოდი" : "RAF YERLEŞİM BARKODU"}
                            </span>
                            <div className="text-4xl font-black tracking-wider text-slate-900 font-mono mt-1">
                              {zplProductId.replace("shelf_", "")}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs">
                            <h4 className="font-black text-sm uppercase truncate text-slate-900">
                              {products.find(p => p.id === zplProductId)?.name}
                            </h4>
                            <div className="flex justify-between font-bold text-[10px] text-slate-600">
                              <span>SKU: {products.find(p => p.id === zplProductId)?.sku}</span>
                              <span>{activeLang === "en" ? "Shelf" : activeLang === "de" ? "Regal" : activeLang === "ru" ? "Полка" : activeLang === "ka" ? "თარო" : "Raf"}: {products.find(p => p.id === zplProductId)?.shelf}</span>
                            </div>
                            <div className="text-xs font-black text-slate-800">
                              {activeLang === "en" ? "Price" : activeLang === "de" ? "Preis" : activeLang === "ru" ? "Цена" : activeLang === "ka" ? "ფასი" : "Fiyat"}: {products.find(p => p.id === zplProductId)?.salePrice} EUR
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="text-center text-xs text-slate-550 italic">
                          {activeLang === "en" ? "Custom Raw Code" : activeLang === "de" ? "Benutzerdefinierter Code" : activeLang === "ru" ? "Пользовательский исходный код" : activeLang === "ka" ? "მორგებული ნედლი კოდი" : "Özelleştirilmiş Ham Kod"}
                        </div>
                      )}
                    </div>

                    {/* Barcode line graphics */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end justify-center w-full h-11">
                        {Array.from({ length: 30 }).map((_, idx) => (
                          <div
                            key={idx}
                            style={{
                              width: idx % 3 === 0 ? "3px" : idx % 5 === 0 ? "4px" : "1px",
                              height: "40px",
                              backgroundColor: "#000",
                              marginRight: "2px"
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-slate-850">
                        {zplProductId ? (
                          zplProductId.startsWith("shelf_")
                            ? zplProductId.replace("shelf_", "")
                            : (products.find(p => p.id === zplProductId)?.barcode || products.find(p => p.id === zplProductId)?.sku)
                        ) : "SIMULATED-BARCODE"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-550 italic">
                    {activeLang === "en" ? "Select a target template on the left or enter ZPL code to see the visual label simulation." : activeLang === "de" ? "Wählen Sie links eine Zielvorlage aus oder geben Sie einen ZPL-Code ein, um die visuelle Etikettensimulation anzuzeigen." : activeLang === "ru" ? "Выберите целевой шаблон слева или введите код ZPL, чтобы увидеть визуальную симуляцию этикетки." : activeLang === "ka" ? "აირჩიეთ სამიზნე შაბლონი მარცხნივ ან შეიყვანეთ ZPL კოდი ეტიკეტის ვიზუალური სიმულაციის სანახავად." : "Etiket görsel simülasyonunu görmek için sol taraftan bir hedef şablon seçin veya ZPL kodu girin."}
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
              <button type="button" onClick={stopCamera} className="text-slate-550 hover:text-white transition font-black">
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
                  className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500" id="id-page-flex-1-rounded-xl-bg-slate-800-border-border-slate-700-px-3-py-1-5-text-xs-text-white-outline-none-focus-border-blue-500-708" aria-label="Flex 1 rounded xl bg slate 800 border border slate 700 px 3 py 1 5 text xs text white outline none focus border blue 500" />
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


      {/* AI Thumbs Up Feedback Overlay */}
      {showAiThumbsUp && (
        <div className="fixed bottom-10 right-10 z-50 flex items-center gap-3 rounded-2xl border-2 border-emerald-300 bg-white/95 backdrop-blur p-4 shadow-2xl animate-bounce transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            🤖
          </div>
          <div>
            <p className="text-xs font-black text-slate-800">
              {language === "tr" ? "Harika! Yerleştirildi." : "Awesome! Placed."}
            </p>
            <p className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
              {language === "tr" ? "Stok Güncellendi" : "Stock Updated"} 👍
            </p>
          </div>
        </div>
      )}

    </main>
  );
}
