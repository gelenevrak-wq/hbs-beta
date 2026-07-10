"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { getLocalizedField } from "@/lib/translations";
import { supabase } from "@/lib/supabaseClient";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

type MovementType =
  | "stock_in"
  | "stock_out"
  | "sale"
  | "return"
  | "waste"
  | "transfer"
  | "manual_adjustment";

type Product = {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  oemCode: string;
  currentStock: number;
  warehouse: string;
  shelf: string;
};

type StockMovement = {
  id: string;
  productName: string;
  productCode: string;
  movementType: MovementType;
  quantity: number;
  warehouse: string;
  shelf: string;
  note: string;
  createdAt: string;
};

const demoProducts: Product[] = [];
const initialMovements: StockMovement[] = [];

function movementTypeText(type: MovementType, lang: string) {
  const dictionary = {
    tr: {
      stock_in: "Stok Girişi",
      stock_out: "Stok Çıkışı",
      sale: "Satış",
      return: "İade",
      waste: "Fire / Hatalı Ürün",
      transfer: "Depo Transferi",
      manual_adjustment: "Manuel Düzeltme"
    },
    en: {
      stock_in: "Stock In",
      stock_out: "Stock Out",
      sale: "Sale",
      return: "Return",
      waste: "Waste / Defective",
      transfer: "Warehouse Transfer",
      manual_adjustment: "Manual Adjustment"
    },
    de: {
      stock_in: "Wareneingang",
      stock_out: "Warenausgang",
      sale: "Verkauf",
      return: "Retoure",
      waste: "Ausschuss / Defekt",
      transfer: "Lagerübertrag",
      manual_adjustment: "Manuelle Anpassung"
    },
    ru: {
      stock_in: "Поступление товара",
      stock_out: "Расход товара",
      sale: "Продажа",
      return: "Возврат",
      waste: "Брак / Дефект",
      transfer: "Перевод склада",
      manual_adjustment: "Ручная корректировка"
    },
    ka: {
      stock_in: "მარაგის მიღება",
      stock_out: "მარაგის გაცემა",
      sale: "გაყიდვა",
      return: "დაბრუნება",
      waste: "წუნი / დეფექტი",
      transfer: "საწყობის გადაცემა",
      manual_adjustment: "მანუალური კორექტირება"
    }
  };

  const l = (dictionary[lang as keyof typeof dictionary] ? lang : "tr") as keyof typeof dictionary;
  return dictionary[l][type as keyof typeof dictionary["tr"]] || type;
}

function movementBadgeClass(type: MovementType) {
  switch (type) {
    case "stock_in":
    case "return":
      return "bg-emerald-50 text-emerald-700 border border-emerald-250";
    case "sale":
    case "stock_out":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "waste":
      return "bg-red-50 text-red-700 border border-red-200";
    case "transfer":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    case "manual_adjustment":
      return "bg-amber-50 text-amber-805 border border-amber-200";
  }
}

const translations = {
  tr: {
    createMovementHeader: "Stok Giriş & Çıkışları",
    scanPlaceholder: "Okuyucu ile okutun veya elle yazın",
    movementTypeLabel: "İşlem Türü",
    stockIn: "Stok Girişi",
    stockOut: "Stok Çıkışı",
    sale: "Satış",
    return: "İade",
    waste: "Fire / Hatalı Ürün",
    transfer: "Depo Transferi",
    manualAdjustment: "Manuel Düzeltme",
    qtyPlaceholder: "Örn: 5",
    descPlaceholder: "İşlem açıklaması, tedarikçi veya müşteri",
    searchPlaceholder: "Ürün, kod, depo, raf veya not ara",
    title: "Depo ve Stok Hareketleri",
    desc: "Ürünlerin stok girişi, satış çıkışı, iade, fire, depo transferi ve manuel düzeltme işlemlerini yönetin.",
    barcodeCompatibilityTitle: "Barkod Uyumu",
    barcodeCompatibility: "Barkod alanında kodu yazar ve enter gönderir. Bu ekran bu mantığa uygun tasarlanmıştır.",
    findProductBtn: "Ürünü Bul",
    barcodeLabel: "Barkod",
    skuLabel: "SKU",
    oemLabel: "OEM",
    currentStockLabel: "Mevcut Stok",
    warehouseShelfLabel: "Depo / Raf",
    qtyLabel: "Miktar",
    warehouseLabel: "Depo",
    shelfLabel: "Raf / Konum",
    noteLabel: "Not",
    saveBtn: "Stok İşlemini Kaydet",
    movementsHeader: "Stok Hareketleri",
    noMovementFound: "Uygun stok hareketi bulunamadı.",
    biometricAuth: "Biyometrik Yetkilendirme",
    barcodePlaceholder: "Barkod / QR / SKU / OEM / Ürün Adı",
    errEmptyCode: "Lütfen barkod, SKU, OEM kodu veya ürün adı girin.",
    errProductNotFound: "Bu kodla eşleşen ürün bulunamadı.",
    msgProductFound: "{name} bulundu. Stok işlemi yapılabilir.",
    errEmptyProduct: "Önce ürün seçin veya barkod/SKU/OEM kodu ile ürün bulun.",
    errInvalidQty: "Geçerli bir miktar girin.",
    errNegStock: "Stok miktarı eksiye düşemez. İşlem iptal edildi.",
    msgSaveSuccess: "{name} için stok işlemi kaydedildi. Yeni stok: {stock}",
    biometricRequired: "Mağaza sahibi tarafından çalışanlar için biyometrik stok doğrulama şart koşulmuştur. Lütfen Touch ID / Face ID doğrulayın.",
    biometricSuccess: "Biyometrik doğrulama başarılı! İşlem kaydediliyor...",
    codeLabel: "Kod",
    navProducts: "Ürün Yönetimi",
    navDashboard: "Panel",
    navHome: "Ana Sayfa"
  },
  en: {
    createMovementHeader: "Stock In & Out Transactions",
    scanPlaceholder: "Scan with reader or type manually",
    movementTypeLabel: "Transaction Type",
    stockIn: "Stock In",
    stockOut: "Stock Out",
    sale: "Sale",
    return: "Return",
    waste: "Waste / Defective",
    transfer: "Warehouse Transfer",
    manualAdjustment: "Manual Adjustment",
    qtyPlaceholder: "E.g., 5",
    descPlaceholder: "Transaction description, supplier, customer or reason",
    searchPlaceholder: "Search product, code, warehouse, shelf or note",
    title: "Warehouse & Stock Movements",
    desc: "Manage stock in, sales out, returns, waste, warehouse transfer and manual adjustments on store products.",
    barcodeCompatibilityTitle: "Barcode Scanner Compatibility",
    barcodeCompatibility: "External scanners act like keyboards, typing the code and sending Enter. This page supports this sequence.",
    findProductBtn: "Find Product",
    barcodeLabel: "Barcode",
    skuLabel: "SKU",
    oemLabel: "OEM",
    currentStockLabel: "Current Stock",
    warehouseShelfLabel: "Warehouse / Shelf",
    qtyLabel: "Quantity",
    warehouseLabel: "Warehouse",
    shelfLabel: "Shelf / Location",
    noteLabel: "Note",
    saveBtn: "Save Stock Transaction",
    movementsHeader: "Stock Movements",
    noMovementFound: "No stock movements found matching this search.",
    biometricAuth: "Biometric Authorization",
    barcodePlaceholder: "Barcode / QR / SKU / OEM / Product Name",
    errEmptyCode: "Please enter barcode, SKU, OEM code or product name.",
    errProductNotFound: "No product matching this code found.",
    msgProductFound: "{name} found. Stock operation can be performed.",
    errEmptyProduct: "Select a product first or search using barcode/SKU/OEM.",
    errInvalidQty: "Please enter a valid quantity.",
    errNegStock: "Stock quantity cannot drop below zero. Transaction cancelled.",
    msgSaveSuccess: "Stock operation saved for {name}. New stock: {stock}",
    biometricRequired: "Biometric authorization is required for employees by the store owner. Please authenticate using Touch ID / Face ID.",
    biometricSuccess: "Biometric authentication successful! Saving transaction...",
    codeLabel: "Code",
    navProducts: "Product Management",
    navDashboard: "Dashboard",
    navHome: "Homepage"
  },
  de: {
    createMovementHeader: "Bestandsein- & Ausgänge",
    scanPlaceholder: "Mit Lesegerät scannen oder manuell eingeben",
    movementTypeLabel: "Transaktionsart",
    stockIn: "Wareneingang",
    stockOut: "Warenausgang",
    sale: "Verkauf",
    return: "Retoure",
    waste: "Ausschuss / Defekt",
    transfer: "Lagerübertrag",
    manualAdjustment: "Manuelle Anpassung",
    qtyPlaceholder: "Z.B., 5",
    descPlaceholder: "Transaktionsbeschreibung, Lieferant, Kunde oder Grund",
    searchPlaceholder: "Produkt, Code, Lager, Regal oder Notiz suchen",
    title: "Lager- & Bestandsbewegungen",
    desc: "Verwalten Sie Wareneingände, Verkäufe, Retouren, Ausschuss, Lagerübertragungen und manuelle Anpassungen.",
    barcodeCompatibilityTitle: "Barcodescanner-Kompatibilität",
    barcodeCompatibility: "Scanner schreiben den Code und senden Enter, wenn das Feld aktiv ist.",
    findProductBtn: "Produkt finden",
    barcodeLabel: "Barcode",
    skuLabel: "SKU",
    oemLabel: "OEM",
    currentStockLabel: "Aktueller Bestand",
    warehouseShelfLabel: "Lager / Regal",
    qtyLabel: "Menge",
    warehouseLabel: "Lager",
    shelfLabel: "Regal / Standort",
    noteLabel: "Notiz",
    saveBtn: "Lagerbewegung speichern",
    movementsHeader: "Lagerbewegungen",
    noMovementFound: "Keine Lagerbewegungen gefunden.",
    biometricAuth: "Biometrische Autorisierung",
    barcodePlaceholder: "Barcode / QR / SKU / OEM / Produktname",
    errEmptyCode: "Bitte geben Sie einen Barcode, eine SKU, einen OEM-Code oder einen Produktnamen ein.",
    errProductNotFound: "Kein Produkt mit diesem Code gefunden.",
    msgProductFound: "{name} gefunden. Bestandsbuchung möglich.",
    errEmptyProduct: "Wählen Sie zuerst ein Produkt aus oder suchen Sie per Barcode/SKU/OEM.",
    errInvalidQty: "Bitte geben Sie eine gültige Menge ein.",
    errNegStock: "Lagerbestand darf nicht negativ werden. Vorgang abgebrochen.",
    msgSaveSuccess: "Lagerbewegung für {name} gespeichert. Neuer Bestand: {stock}",
    biometricRequired: "Vom Ladenbesitzer ist eine biometrische Bestandsverifizierung für Mitarbeiter vorgeschrieben. Bitte authentifizieren Sie sich mit Touch ID / Face ID.",
    biometricSuccess: "Biometrische Authentifizierung erfolgreich! Speichere Transaktion...",
    codeLabel: "Code",
    navProducts: "Produktverwaltung",
    navDashboard: "Dashboard",
    navHome: "Startseite"
  },
  ru: {
    createMovementHeader: "Приход & Расход Запасов",
    scanPlaceholder: "Отсканируйте сканером или введите вручную",
    movementTypeLabel: "Тип операции",
    stockIn: "Поступление товара",
    stockOut: "Расход товара",
    sale: "Продажа",
    return: "Возврат",
    waste: "Брак / Дефект",
    transfer: "Перевод склада",
    manualAdjustment: "Ручная корректировка",
    qtyPlaceholder: "Напр., 5",
    descPlaceholder: "Описание операции, поставщик, клиент или причина",
    searchPlaceholder: "Поиск товара, кода, склада, полки или примечания",
    title: "Движение запасов",
    desc: "Управляйте приходами, расходами, продажами, возвратами, браком, межскладскими переводами и ручными корректировками.",
    barcodeCompatibilityTitle: "Совместимость со сканером",
    barcodeCompatibility: "Сканеры вводят код и отправляют Enter в активном поле.",
    findProductBtn: "Найти товар",
    barcodeLabel: "Штрихкод",
    skuLabel: "SKU",
    oemLabel: "OEM",
    currentStockLabel: "Текущий остаток",
    warehouseShelfLabel: "Склад / Полка",
    qtyLabel: "Количество",
    warehouseLabel: "Склад",
    shelfLabel: "Полка / Ячейка",
    noteLabel: "Примечание",
    saveBtn: "Сохранить операцию",
    movementsHeader: "Складские операции",
    noMovementFound: "Складских операций не найдено.",
    biometricAuth: "Биометрическая авторизация",
    barcodePlaceholder: "Штрихкод / QR / SKU / OEM / Название товара",
    errEmptyCode: "Пожалуйста, введите штрихкод, SKU, OEM-код или название товара.",
    errProductNotFound: "Товар с таким кодом не найден.",
    msgProductFound: "Товар {name} найден. Можно выполнить операцию.",
    errEmptyProduct: "Сначала выберите товар или найдите по штрихкоду/SKU/OEM.",
    errInvalidQty: "Пожалуйста, введите корректное количество.",
    errNegStock: "Количество запаса не может быть отрицательным. Операция отменена.",
    msgSaveSuccess: "Складская операция для {name} сохранена. Новый остаток: {stock}",
    biometricRequired: "Владелец магазина требует биометрическое подтверждение для сотрудников. Пожалуйста, пройдите проверку Touch ID / Face ID.",
    biometricSuccess: "Биометрическая проверка успешна! Запись операции...",
    codeLabel: "Код",
    navProducts: "Управление товарами",
    navDashboard: "Панель управления",
    navHome: "Главная страница"
  },
  ka: {
    createMovementHeader: "მარაგის მიღება & გაცემა",
    scanPlaceholder: "დაასკანირეთ მკითხველით ან შეიყვანეთ ხელით",
    movementTypeLabel: "ოპერაციის ტიპი",
    stockIn: "მარაგის მიღება",
    stockOut: "მარაგის გაცემა",
    sale: "გაყიდვა",
    return: "დაბრუნება",
    waste: "წუნი / დეფექტი",
    transfer: "საწყობის გადაცემა",
    manualAdjustment: "მანუალური კორექტირება",
    qtyPlaceholder: "მაგ: 5",
    descPlaceholder: "ოპერაციის აღწერა, მომწოდებელი, კლიენტი ან მიზეზი",
    searchPlaceholder: "ძებნა პროდუქტის, კოდის, საწყობის, თაროს ან შენიშვნის მიხედვით",
    title: "საწყობისა და მარაგების მოძრაობები",
    desc: "მართეთ მარაგის მიღება, გაყიდვა, დაბრუნება, წუნი, შიდა გადაცემა და მანუალური კორექტირება.",
    barcodeCompatibilityTitle: "შტრიხკოდების სკანერი",
    barcodeCompatibility: "სკანერები წერენ კოდს და აგზავნიან Enter-ს, როდესაც კოდის ველი აქტიურია.",
    findProductBtn: "პროდუქტის მოძებნა",
    barcodeLabel: "შტრიხკოდი",
    skuLabel: "SKU",
    oemLabel: "OEM",
    currentStockLabel: "მიმდინარე მარაგი",
    warehouseShelfLabel: "საწყობი / თარო",
    qtyLabel: "რაოდენობა",
    warehouseLabel: "საწყობი",
    shelfLabel: "თარო / მდებარეობა",
    noteLabel: "შენიშვნა",
    saveBtn: "მარაგის ოპერაციის შენახვა",
    movementsHeader: "მარაგის მოძრაობები",
    noMovementFound: "მარაგის მოძრაობა ვერ მოიძებნა.",
    biometricAuth: "ბიომეტრიული ავტორიზაცია",
    barcodePlaceholder: "შტრიხკოდი / QR / SKU / OEM / პროდუქტი",
    errEmptyCode: "გთხოვთ შეიყვანოთ შტრიხკოდი, SKU, OEM კოდი ან პროდუქტის სახელი.",
    errProductNotFound: "პროდუქტი ამ კოდით ვერ მოიძებნა.",
    msgProductFound: "{name} მოიძებნა. ოპერაცია შესაძლებელია.",
    errEmptyProduct: "ჯერ აირჩიეთ პროდუქტი ან მოძებნეთ შტრიხკოდით/SKU/OEM კოდით.",
    errInvalidQty: "გთხოვთ შეიყვანოთ რაოდენობის ვალიდური მნიშვნელობა.",
    errNegStock: "მარაგის რაოდენობა ვერ გახდება უარყოფითი. ოპერაცია გაუქმდა.",
    msgSaveSuccess: "მარაგის ოპერაცია შენახულია {name}-ისთვის. ახალი მარაგი: {stock}",
    biometricRequired: "საწყობის მფლობელის მიერ მოთხოვნილია ბიომეტრიული დადასტურება. გთხოვთ გაიაროთ Touch ID / Face ID ავტორიზაცია.",
    biometricSuccess: "ბიომეტრიული ავტორიზაცია წარმატებულია! ოპერაცია ინახება...",
    codeLabel: "კოდი",
    navProducts: "პროდუქტების მართვა",
    navDashboard: "მართვის პანელი",
    navHome: "მთავარი"
  }
};

const scanMessages = {
  tr: {
    loading: "Tarayıcı yükleniyor... Lütfen bekleyin.",
    libFail: "Tarayıcı kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.",
    ready: "Kamera hazır. Barkodu veya karekodu hizalayın...",
    fail: "Kamera başlatılamadı. İzinlerinizi kontrol edin veya manuel giriş yapın.",
    detectedBarcode: "✓ Algılandı: {code} (Barkod)",
    detectedQr: "✓ Algılandı: {code} (Karekod)"
  },
  en: {
    loading: "Scanner loading... Please wait.",
    libFail: "Scanner library failed to load. Check your internet connection.",
    ready: "Camera ready. Align barcode or QR code...",
    fail: "Camera failed to start. Check permissions or input manually.",
    detectedBarcode: "✓ Detected: {code} (Barcode)",
    detectedQr: "✓ Detected: {code} (QR Code)"
  },
  de: {
    loading: "Scanner lädt... Bitte warten.",
    libFail: "Scanner-Bibliothek konnte nicht geladen werden. Prüfen Sie Ihre Internetverbindung.",
    ready: "Kamera bereit. Barcode oder QR-Code ausrichten...",
    fail: "Kamera konnte nicht gestartet werden. Berechtigungen prüfen oder manuell eingeben.",
    detectedBarcode: "✓ Erkannt: {code} (Barcode)",
    detectedQr: "✓ Erkannt: {code} (QR-Code)"
  },
  ru: {
    loading: "Сканер загружается... Пожалуйста, подождите.",
    libFail: "Не удалось загрузить библиотеку сканера. Проверьте интернет-соединение.",
    ready: "Камера готова. Выровняйте штрихкод или QR-код...",
    fail: "Не удалось запустить камеру. Проверьте разрешения или введите вручную.",
    detectedBarcode: "✓ Обнаружено: {code} (Штрихкод)",
    detectedQr: "✓ Обнаружено: {code} (QR-код)"
  },
  ka: {
    loading: "სკანერი იტვირთება... გთხოვთ დაელოდოთ.",
    libFail: "სკანერის ბიბლიოთეკა ვერ ჩაიტვირთა. შეამოწმეთ ინტერნეტ კავშირი.",
    ready: "კამერა მზადაა. გაასწორეთ შტრიხკოდი ან QR კოდი...",
    fail: "კამერა ვერ ჩაირთო. შეამოწმეთ ნებართვები ან შეიყვანეთ ხელით.",
    detectedBarcode: "✓ აღმოჩენილია: {code} (შტრიხკოდი)",
    detectedQr: "✓ აღმოჩენილია: {code} (QR კოდი)"
  }
};

export default function StockMovementsPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);
  const [codeInput, setCodeInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<MovementType>("stock_in");
  const [quantity, setQuantity] = useState("");
  const [warehouse, setWarehouse] = useState("Ana Depo");
  const [shelf, setShelf] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("tr");
  const [storeSlug, setStoreSlug] = useState("obdtr");
  const [availableWarehouses, setAvailableWarehouses] = useState<any[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState("");
  const [showTransferAnim, setShowTransferAnim] = useState(false);
  const [transferDetails, setTransferDetails] = useState({
    productName: "",
    sourceWh: "",
    targetWh: "",
    qty: 0
  });

  // Camera / Scan States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [manualScanInput, setManualScanInput] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const zxingReaderRef = useRef<any>(null);

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

  const startCamera = async () => {
    setIsCameraModalOpen(true);
    setScanMessage("");
    setManualScanInput("");
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(videoDevs);
      
      const constraints: MediaStreamConstraints = {
        video: videoDevs.length > 0 
          ? { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined } 
          : true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.setAttribute("playsinline", "true");
        
        const sm = scanMessages[language as keyof typeof scanMessages] || scanMessages.tr;
        setScanMessage(sm.loading);
        const ZXingClass = await loadZXing();
        if (!ZXingClass) {
          setScanMessage(sm.libFail);
          return;
        }

        if (!zxingReaderRef.current) {
          zxingReaderRef.current = new (window as any).ZXing.BrowserMultiFormatReader();
        }

        setScanMessage(sm.ready);
        zxingReaderRef.current.decodeFromVideoElement(videoEl, (result: any, err: any) => {
          if (result && result.text) {
            handleCodeDetected(result.text);
          }
        });
      }
    } catch (e) {
      console.error("Camera access failed:", e);
      const sm = scanMessages[language as keyof typeof scanMessages] || scanMessages.tr;
      setScanMessage(sm.fail);
    }
  };

  const stopCamera = () => {
    if (zxingReaderRef.current) {
      try {
        zxingReaderRef.current.reset();
      } catch (e) {}
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const switchDevice = async (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (zxingReaderRef.current) {
      try {
        zxingReaderRef.current.reset();
      } catch (e) {}
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    try {
      const constraints = {
        video: { deviceId: { exact: deviceId } }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.setAttribute("playsinline", "true");
        
        const sm = scanMessages[language as keyof typeof scanMessages] || scanMessages.tr;
        setScanMessage(sm.ready);
        
        if (zxingReaderRef.current) {
          zxingReaderRef.current.decodeFromVideoElement(videoEl, (result: any, err: any) => {
            if (result && result.text) {
              handleCodeDetected(result.text);
            }
          });
        }
      }
    } catch (e) {
      console.error("Switch camera failed:", e);
    }
  };

  const handleCodeDetected = (code: string) => {
    setCodeInput(code);
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime); 
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn("Could not play scan beep sound:", e);
    }

    stopCamera();
    
    const foundProduct = findProductByCode(code);
    if (!foundProduct) {
      setSelectedProduct(null);
      setMessage(t.errProductNotFound);
      return;
    }

    setSelectedProduct(foundProduct);
    setWarehouse(foundProduct.warehouse);
    setShelf(foundProduct.shelf);
    setMessage(t.msgProductFound.replace("{name}", getLocalizedField(foundProduct.name, language)));
  };

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;

  useEffect(() => {
    let activeSlug = "obdtr";
    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.storeSlugs?.[0]) {
          activeSlug = currentUser.storeSlugs[0];
          setStoreSlug(activeSlug);
        }
      }
    } catch (e) {}

    try {
      const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      const myStore = registeredStores.find((s: any) => s.code === activeSlug);
      if (myStore && myStore.warehouses) {
        setAvailableWarehouses(myStore.warehouses);
        if (myStore.warehouses.length > 0) {
          setWarehouse(myStore.warehouses[0].name);
          if (myStore.warehouses[0].shelves && myStore.warehouses[0].shelves.length > 0) {
            setShelf(myStore.warehouses[0].shelves[0]);
          }
        }
      }
    } catch (e) {
      console.error("Error loading warehouse maps for stock movements", e);
    }

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    const loadLocalFallback = () => {
      const savedProducts = window.localStorage.getItem(`hbs-store-products-${activeSlug}`);
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped = parsed
              .filter((p: any) => p.brand !== "DELETED" && p.category !== "DELETED")
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                barcode: p.barcode || "",
                sku: p.sku || "",
                oemCode: p.oemCode || "",
                currentStock: Number(p.quantity) || 0,
                warehouse: p.warehouse || "",
                shelf: p.shelf || ""
              }));
            setProducts(mapped);
          }
        } catch (e) {
          console.error("Error loading products for stock movements", e);
        }
      }
    };

    if (isSupabaseConfigured && activeSlug) {
      supabase
        .from("offerable_items")
        .select("*, companies!inner(code)")
        .eq("companies.code", activeSlug)
        .then(({ data, error }) => {
          if (data && !error) {
            const mapped = data
              .filter((item: any) => item.brand !== "DELETED" && item.category !== "DELETED")
              .map((item: any) => ({
                id: item.id,
                name: item.name,
                barcode: item.barcode || "",
                sku: item.code || "",
                oemCode: "",
                currentStock: Number(item.quantity) || 0,
                warehouse: item.warehouse || "Ana Depo",
                shelf: item.shelf || ""
              }));
            setProducts(mapped);

            const fullMapped = data
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
                quantity: item.quantity ? String(item.quantity) : "0",
                warehouse: item.warehouse || "Ana Depo",
                shelf: item.shelf || "",
                imageUrl: item.photo_urls?.[0] || "/product-images/diagnostic-scanner.svg",
                variants: [],
                galleryUrls: item.photo_urls || []
              }));
            window.localStorage.setItem(`hbs-store-products-${activeSlug}`, JSON.stringify(fullMapped));
          } else {
            loadLocalFallback();
          }
        });
    } else {
      loadLocalFallback();
    }

    const savedMovements = window.localStorage.getItem(`hbs-store-stock-movements-${activeSlug}`);
    if (savedMovements) {
      try {
        const parsed = JSON.parse(savedMovements);
        if (Array.isArray(parsed)) {
          setMovements(parsed);
        }
      } catch (e) {
        console.error("Error loading movements history", e);
      }
    }

    setProductsLoaded(true);
  }, []);

  useEffect(() => {
    if (!productsLoaded) return;
    window.localStorage.setItem(`hbs-store-stock-movements-${storeSlug}`, JSON.stringify(movements));
  }, [movements, productsLoaded, storeSlug]);

  const filteredMovements = useMemo(() => {
    const q = search.trim().toLowerCase();

    return movements.filter((movement) => {
      return (
        !q ||
        movement.productName.toLowerCase().includes(q) ||
        movement.productCode.toLowerCase().includes(q) ||
        movement.warehouse.toLowerCase().includes(q) ||
        movement.shelf.toLowerCase().includes(q) ||
        movement.note.toLowerCase().includes(q)
      );
    });
  }, [movements, search]);

  function findProductByCode(code: string) {
    const cleanCode = code.trim().toLowerCase();

    return products.find((product) => {
      return (
        product.barcode.toLowerCase() === cleanCode ||
        product.sku.toLowerCase() === cleanCode ||
        product.oemCode.toLowerCase() === cleanCode ||
        product.name.toLowerCase().includes(cleanCode)
      );
    });
  }

  function handleCodeSearch() {
    if (!codeInput.trim()) {
      setMessage(t.errEmptyCode);
      return;
    }

    const foundProduct = findProductByCode(codeInput);

    if (!foundProduct) {
      setSelectedProduct(null);
      setMessage(t.errProductNotFound);
      return;
    }

    setSelectedProduct(foundProduct);
    setWarehouse(foundProduct.warehouse);
    setShelf(foundProduct.shelf);
    setMessage(t.msgProductFound.replace("{name}", getLocalizedField(foundProduct.name, language)));
  }

  function handleCodeKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCodeSearch();
    }
  }

  function isStockIncreasing(type: MovementType) {
    return type === "stock_in" || type === "return";
  }

  function isStockDecreasing(type: MovementType) {
    return type === "stock_out" || type === "sale" || type === "waste";
  }

  function createMovement() {
    if (!selectedProduct) {
      setMessage(t.errEmptyProduct);
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!parsedQuantity || parsedQuantity <= 0) {
      setMessage(t.errInvalidQty);
      return;
    }

    let requireBiometric = false;
    try {
      const companySettingsStr = window.localStorage.getItem("hbs-company-settings");
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      if (companySettingsStr && currentUserStr) {
        const settings = JSON.parse(companySettingsStr);
        const user = JSON.parse(currentUserStr);
        if (settings.requireEmployeeBiometrics && user.role !== "owner" && user.role !== "superadmin") {
          requireBiometric = true;
        }
      }
    } catch (e) {
      console.error("Biyometrik kontrol hatası:", e);
    }

    const executeSave = () => {
      let newStock = selectedProduct.currentStock;

      if (isStockIncreasing(movementType)) {
        newStock += parsedQuantity;
      }

      if (isStockDecreasing(movementType)) {
        newStock -= parsedQuantity;
      }

      if (movementType === "manual_adjustment") {
        newStock = parsedQuantity;
      }

      if (movementType === "transfer") {
        newStock -= parsedQuantity;
      }

      if (newStock < 0) {
        setMessage(t.errNegStock);
        return;
      }

      const updatedProduct: Product = {
        ...selectedProduct,
        currentStock: newStock,
        warehouse,
        shelf,
      };

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );

      setSelectedProduct(updatedProduct);

      const movement: StockMovement = {
        id: `mov-${Date.now()}`,
        productName: getLocalizedField(selectedProduct.name, language),
        productCode: selectedProduct.sku || selectedProduct.barcode,
        movementType,
        quantity: parsedQuantity,
        warehouse,
        shelf,
        note,
        createdAt: new Date().toLocaleTimeString(language === "ka" ? "ka-GE" : language === "ru" ? "ru-RU" : language === "de" ? "de-DE" : language === "en" ? "en-US" : "tr-TR", { hour: "2-digit", minute: "2-digit" }) + (language === "en" ? " (Today)" : language === "de" ? " (Heute)" : language === "ru" ? " (Сегодня)" : language === "ka" ? " (დღეს)" : " (Bugün)"),
      };

      setMovements((currentMovements) => [movement, ...currentMovements]);

      try {
        const savedProducts = window.localStorage.getItem(`hbs-store-products-${storeSlug}`);
        if (savedProducts) {
          const fullRecords = JSON.parse(savedProducts);
          if (Array.isArray(fullRecords)) {
            const updatedRecords = fullRecords.map((r: any) => {
              if (r.id === selectedProduct.id) {
                return {
                  ...r,
                  quantity: newStock.toString(),
                  warehouse: warehouse,
                  shelf: shelf
                };
              }
              return r;
            });
            window.localStorage.setItem(`hbs-store-products-${storeSlug}`, JSON.stringify(updatedRecords));
          }
        }
      } catch (e) {
        console.error("Error updating product quantity in localStorage", e);
      }

      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      if (isSupabaseConfigured) {
        supabase
          .from("offerable_items")
          .update({
            quantity: newStock,
            warehouse: warehouse || null,
            shelf: shelf || null
          })
          .eq("id", selectedProduct.id)
          .then(({ error }) => {
            if (error) console.error("Supabase stock movement sync error:", error.message);
          });
      }

      setQuantity("");
      setNote("");
      setMessage(
        t.msgSaveSuccess.replace("{name}", getLocalizedField(selectedProduct.name, language)).replace("{stock}", newStock.toString())
      );
    };

    const startSavingProcess = () => {
      if (movementType === "transfer") {
        setTransferDetails({
          productName: getLocalizedField(selectedProduct.name, language),
          sourceWh: selectedProduct.warehouse || (language === "en" ? "Source" : "Kaynak"),
          targetWh: warehouse || (language === "en" ? "Destination" : "Hedef"),
          qty: parsedQuantity
        });
        setShowTransferAnim(true);
        setTimeout(() => {
          setShowTransferAnim(false);
          executeSave();
        }, 2800);
      } else {
        executeSave();
      }
    };

    if (requireBiometric) {
      setIsVerifyingBiometric(true);
      setBiometricMessage(t.biometricRequired);
      
      const triggerRealBiometric = async () => {
        try {
          if (window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);
            
            await navigator.credentials.get({
              publicKey: {
                challenge,
                timeout: 60000,
                userVerification: "required"
              }
            });
            
            setBiometricMessage(t.biometricSuccess);
            setTimeout(() => {
              setIsVerifyingBiometric(false);
              startSavingProcess();
            }, 800);
          } else {
            const password = prompt(language === "en" ? "Enter employee PIN or password to authorize stock movement:" : "Stok hareketini onaylamak için personel PIN kodunu veya şifresini girin:");
            if (password !== null && password.trim().length > 0) {
              setBiometricMessage(t.biometricSuccess);
              setTimeout(() => {
                setIsVerifyingBiometric(false);
                startSavingProcess();
              }, 800);
            } else {
              setIsVerifyingBiometric(false);
              setMessage(language === "en" ? "❌ Authentication cancelled." : "❌ Yetkilendirme iptal edildi.");
            }
          }
        } catch (err) {
          console.warn("Biometric authorization failed, falling back to passcode prompt:", err);
          const password = prompt(language === "en" ? "Enter employee PIN or password to authorize stock movement:" : "Stok hareketini onaylamak için personel PIN kodunu veya şifresini girin:");
          if (password !== null && password.trim().length > 0) {
            setBiometricMessage(t.biometricSuccess);
            setTimeout(() => {
              setIsVerifyingBiometric(false);
              startSavingProcess();
            }, 800);
          } else {
            setIsVerifyingBiometric(false);
            setMessage(language === "en" ? "❌ Authentication cancelled." : "❌ Yetkilendirme iptal edildi.");
          }
        }
      };

      triggerRealBiometric();
    } else {
      startSavingProcess();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/50 p-2 sm:p-4 text-slate-850">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-black tracking-wide text-slate-900">
            HBS
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/products"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50 shadow-sm transition active:scale-95"
            >
              {t.navProducts}
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50 shadow-sm transition active:scale-95"
            >
              {t.navDashboard}
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50 shadow-sm transition active:scale-95"
            >
              {t.navHome}
            </Link>

            <CompactLanguageSwitcher />
          </div>
        </header>

        {message && (
          <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 text-xs leading-relaxed text-blue-800 font-semibold shadow-sm">
            {message}
          </div>
        )}

        <section className="grid gap-4 grid-cols-1">
          <div className="rounded-3xl border border-indigo-150 bg-gradient-to-br from-indigo-50/30 via-indigo-50/20 to-indigo-100/10 p-5 shadow-md space-y-4">
            <div className="pb-3 border-b border-indigo-100/50">
              <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                <span>🔄</span> {t.createMovementHeader}
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                {t.desc}
              </p>
            </div>

            <div className="grid gap-3.5">
              <label className="grid gap-1.5">
                <span className="text-[10px] font-black text-indigo-900/80 uppercase tracking-wider">
                  {t.barcodePlaceholder}
                </span>
                <div className="flex gap-2">
                  <input
                    value={codeInput}
                    onChange={(event) => setCodeInput(event.target.value)}
                    onKeyDown={handleCodeKeyDown}
                    placeholder={t.scanPlaceholder}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 transition shadow-inner" 
                    aria-label="Product Scan Code Input" 
                  />
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
                    title={language === "tr" ? "Kamera ile Tara" : "Scan with Camera"}
                  >
                    <span>📷</span>
                    <span>{language === "tr" ? "Kamera ile Okut" : "Scan with Camera"}</span>
                  </button>
                </div>
              </label>

              <button
                type="button"
                onClick={handleCodeSearch}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3.5 font-black text-xs transition shadow-sm active:scale-98 cursor-pointer"
              >
                {t.findProductBtn}
              </button>

              {selectedProduct && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5">
                  <h3 className="text-sm font-black text-emerald-900">
                    {getLocalizedField(selectedProduct.name, language)}
                  </h3>

                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-emerald-800 font-semibold">
                    <p>
                      <span className="font-extrabold text-emerald-950">{t.barcodeLabel}:</span>{" "}
                      {selectedProduct.barcode}
                    </p>
                    <p>
                      <span className="font-extrabold text-emerald-950">{t.skuLabel}:</span>{" "}
                      {selectedProduct.sku}
                    </p>
                    <p>
                      <span className="font-extrabold text-emerald-950">{t.oemLabel}:</span>{" "}
                      {selectedProduct.oemCode || "-"}
                    </p>
                    <p>
                      <span className="font-extrabold text-emerald-950">{t.currentStockLabel}:</span>{" "}
                      {selectedProduct.currentStock}
                    </p>
                    <p className="col-span-2">
                      <span className="font-extrabold text-emerald-950">{t.warehouseShelfLabel}:</span>{" "}
                      {selectedProduct.warehouse} / {selectedProduct.shelf}
                    </p>
                  </div>
                </div>
              )}

              <label className="grid gap-1.5">
                <span className="text-[10px] font-black text-slate-650 uppercase tracking-wider">{t.movementTypeLabel}</span>
                <select
                  value={movementType}
                  onChange={(event) =>
                    setMovementType(event.target.value as MovementType)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 focus:bg-white focus:border-indigo-500 transition shadow-inner"
                >
                  <option value="stock_in">{t.stockIn}</option>
                  <option value="stock_out">{t.stockOut}</option>
                  <option value="sale">{t.sale}</option>
                  <option value="return">{t.return}</option>
                  <option value="waste">{t.waste}</option>
                  <option value="transfer">{t.transfer}</option>
                  <option value="manual_adjustment">{t.manualAdjustment}</option>
                </select>
              </label>

              <div className="grid gap-3 grid-cols-3">
                <label className="grid gap-1.5">
                  <span className="text-[10px] font-black text-slate-650 uppercase tracking-wider">{t.qtyLabel}</span>
                  <input
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    type="number"
                    placeholder={t.qtyPlaceholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition shadow-inner" 
                    aria-label="Stock Movement Quantity" 
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[10px] font-black text-slate-650 uppercase tracking-wider">{t.warehouseLabel}</span>
                  {availableWarehouses.length > 0 ? (
                    <select
                      value={warehouse}
                      onChange={(e) => {
                        const nextWh = e.target.value;
                        setWarehouse(nextWh);
                        const nextWhObj = availableWarehouses.find(wh => wh.name === nextWh);
                        if (nextWhObj && nextWhObj.shelves && nextWhObj.shelves.length > 0) {
                          setShelf(nextWhObj.shelves[0]);
                        } else {
                          setShelf("");
                        }
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 focus:bg-white focus:border-indigo-500 transition shadow-inner"
                    >
                      {availableWarehouses.map((wh) => (
                        <option key={wh.name} value={wh.name}>{wh.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={warehouse}
                      onChange={(event) => setWarehouse(event.target.value)}
                      placeholder={language === "en" ? "Main Warehouse" : language === "de" ? "Hauptlager" : language === "ru" ? "Основной склад" : language === "ka" ? "მთავარი საწყობი" : "Ana Depo"}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition shadow-inner" 
                      aria-label="Warehouse Location" 
                    />
                  )}
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[10px] font-black text-slate-650 uppercase tracking-wider">{t.shelfLabel}</span>
                  {availableWarehouses.length > 0 ? (
                    <select
                      value={shelf}
                      onChange={(event) => setShelf(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 focus:bg-white focus:border-indigo-500 transition shadow-inner"
                    >
                      {(availableWarehouses.find(wh => wh.name === warehouse)?.shelves || []).map((sh: string) => (
                        <option key={sh} value={sh}>{sh}</option>
                      ))}
                      {(!availableWarehouses.find(wh => wh.name === warehouse)?.shelves || 
                        availableWarehouses.find(wh => wh.name === warehouse)?.shelves.length === 0) && (
                        <option value="">{language === "en" ? "No Shelf" : language === "de" ? "Kein Regal" : language === "ru" ? "Нет полки" : language === "ka" ? "თარო არ არის" : "Raf Yok"}</option>
                      )}
                    </select>
                  ) : (
                    <input
                      value={shelf}
                      onChange={(event) => setShelf(event.target.value)}
                      placeholder="A-01"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition shadow-inner" 
                      aria-label="Shelf Location" 
                    />
                  )}
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-[10px] font-black text-slate-650 uppercase tracking-wider">{t.noteLabel}</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={2}
                  placeholder={t.descPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition shadow-inner resize-none animate-fadeIn"
                />
              </label>

              <button
                type="button"
                onClick={createMovement}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 font-black text-xs transition shadow-sm active:scale-98 cursor-pointer"
              >
                {t.saveBtn}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">{t.movementsHeader}</h2>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="mt-3.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition shadow-inner" 
                aria-label="Search Movements Input" 
              />

              <div className="mt-3.5 grid gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredMovements.map((movement) => (
                  <article
                    key={movement.id}
                    className="rounded-2xl border border-slate-100 bg-slate-500/[0.02] p-3.5 shadow-sm hover:bg-slate-50 transition"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${movementBadgeClass(
                          movement.movementType
                        )}`}
                      >
                        {movementTypeText(movement.movementType, language)}
                      </span>

                      <span className="text-[10px] text-slate-450 font-extrabold font-mono">
                        {movement.createdAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900">
                      {getLocalizedField(movement.productName, language)}
                    </h3>

                    <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-650 font-semibold border-t border-slate-100/60 pt-2">
                      <p>
                        <span className="font-extrabold text-slate-700">{t.codeLabel}:</span>{" "}
                        {movement.productCode}
                      </p>

                      <p>
                        <span className="font-extrabold text-slate-700">{t.qtyLabel}:</span>{" "}
                        {movement.quantity}
                      </p>

                      <p className="col-span-2">
                        <span className="font-extrabold text-slate-700">{t.warehouseShelfLabel}:</span>{" "}
                        {movement.warehouse} / {movement.shelf}
                      </p>

                      {movement.note && (
                        <p className="col-span-2 text-slate-550 italic mt-0.5 font-normal">
                          💬 {movement.note}
                        </p>
                      )}
                    </div>
                  </article>
                ))}

                {filteredMovements.length === 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-xs text-slate-500 text-center">
                    {t.noMovementFound}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* GORGEOUS WAREHOUSE TRANSFER ANIMATION OVERLAY */}
      {showTransferAnim && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md select-none text-white animate-fadeIn">
          <style>{`
            @keyframes transferLine {
              0% { stroke-dashoffset: 24; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes glideBox {
              0% { left: 15%; transform: translateX(-50%) scale(1); }
              10% { transform: translateX(-50%) scale(1.3) translateY(-10px); }
              90% { transform: translateX(-50%) scale(1.3) translateY(-10px); }
              100% { left: 85%; transform: translateX(-50%) scale(1); }
            }
            @keyframes ripple {
              0% { transform: scale(0.8); opacity: 0.8; }
              100% { transform: scale(2.5); opacity: 0; }
            }
            .animate-transferLine {
              stroke-dasharray: 8, 4;
              animation: transferLine 1.5s linear infinite;
            }
            .animate-glideBox {
              animation: glideBox 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .animate-ripple {
              animation: ripple 1.6s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            }
          `}</style>

          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative text-center">
            <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-950/50 border border-indigo-500/20 px-3 py-1 rounded-full">
              {language === "en" ? "Live Stock Transfer" : language === "de" ? "Live-Lagerübertragung" : language === "ru" ? "Перевод запасов" : language === "ka" ? "მარაგის გადაცემა" : "Canlı Depo Transferi"}
            </span>
            <h3 className="text-base font-black mt-4 tracking-tight leading-snug">
              {transferDetails.qty} x {transferDetails.productName}
            </h3>
            
            <div className="relative h-28 my-5 flex items-center justify-between px-6">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-12 pointer-events-none">
                <svg className="w-full h-2" fill="none">
                  <line x1="0" y1="1" x2="100%" y2="1" stroke="#4f46e5" strokeWidth="2.5" className="animate-transferLine" />
                </svg>
              </div>

              <div className="z-10 flex flex-col items-center gap-1 relative w-16">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-lg shadow-lg">
                  🏪
                </div>
                <span className="text-[9px] font-bold text-slate-400 truncate max-w-full text-center">
                  {transferDetails.sourceWh}
                </span>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 z-20 animate-glideBox flex flex-col items-center justify-center w-10 h-10">
                <div className="text-2xl animate-bounce duration-700">
                  📦
                </div>
              </div>

              <div className="z-10 flex flex-col items-center gap-1 relative w-16">
                <div className="absolute w-10 h-10 rounded-xl border border-indigo-500/30 animate-ripple pointer-events-none"></div>
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg shadow-lg">
                  🏬
                </div>
                <span className="text-[9px] font-bold text-slate-400 truncate max-w-full text-center">
                  {transferDetails.targetWh}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              {language === "en" ? "Moving cargo and updating ledger entries..." : language === "de" ? "Fracht wird bewegt und Buchungen aktualisiert..." : language === "ru" ? "Перемещение груза и обновление данных..." : language === "ka" ? "ტვირთის გადატანა და მონაცემების განახლება..." : "Kargo taşınıyor ve kayıtlar işleniyor..."}
            </p>
          </div>
        </div>
      )}

      {isVerifyingBiometric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-2xl transition-all text-slate-900">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-600 relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping opacity-75"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="w-10 h-10 animate-pulse text-blue-600" viewBox="0 0 16 16">
                <path d="M4.828 8.9A.5.5 0 0 1 5 8.5c0-.18.064-.324.152-.424.089-.1.202-.154.348-.154.146 0 .26.054.348.154.088.1.152.244.152.424a.5.5 0 1 1-1 0c0-.07-.024-.12-.042-.14-.017-.02-.044-.03-.058-.03-.014 0-.04.01-.058.03-.018.02-.042.07-.042.14a.5.5 0 0 1-.5.5M7 6.5C7 5.672 7.672 5 8.5 5s1.5.672 1.5 1.5c0 .313-.083.56-.217.74-.132.18-.3.26-.483.26-.183 0-.35-.08-.483-.26-.134-.18-.217-.427-.217-.74a.5.5 0 0 0-1 0c0 .687.217 1.14.517 1.543.3.4.717.657 1.183.657.466 0 .883-.257 1.183-.657.3-.404.517-.856.517-1.543 0-1.38-1.12-2.5-2.5-2.5S6 5.12 6 6.5a.5.5 0 0 0 1 0"/>
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0"/>
              </svg>
            </div>
            <h3 className="text-xl font-black tracking-tight">{t.biometricAuth}</h3>
            <p className="mt-3 text-sm text-slate-600 font-semibold leading-relaxed">
              {biometricMessage}
            </p>
          </div>
        </div>
      )}

      {/* CAMERA / SCANNER MODAL */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                  {language === "en" ? "BARCODE / QR SCANNER" : "BARKOD / QR TARAYICI"}
                </span>
                <h3 className="text-sm font-black text-white">
                  {language === "en" ? "Live Device Camera" : "Canlı Cihaz Kamerası"}
                </h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="text-slate-500 hover:text-white transition font-black text-xs"
              >
                {language === "en" ? "Close" : "Kapat"}
              </button>
            </div>

            {/* Video stream box */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden border-b border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Pulsing Scan Laser overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                <div className="absolute top-[48%] left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-500" />
                <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-500" />
                <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-500" />
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-500" />
              </div>
            </div>

            {/* Controls */}
            <div className="p-5 bg-slate-950/40 space-y-4">
              {videoDevices.length > 1 && (
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400 font-bold">
                    {language === "en" ? "Camera Selection:" : "Kamera Seçimi:"}
                  </span>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => switchDevice(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                  >
                    {videoDevices.map((d, i) => (
                      <option key={d.deviceId} value={d.deviceId}>{d.label || `Kamera ${i + 1}`}</option>
                    ))}
                  </select>
                </div>
              )}

              {scanMessage && (
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-300">{scanMessage}</p>
                </div>
              )}

              {/* Simulation input in case camera is physically not present/denied */}
              <div className="border-t border-slate-800 pt-3 flex gap-2">
                <input
                  type="text"
                  value={manualScanInput}
                  onChange={(e) => setManualScanInput(e.target.value)}
                  placeholder={language === "en" ? "Simulate code (e.g. 869000000001)" : "Kod simülasyonu (Örn: 869000000001)"}
                  className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualScanInput.trim()) {
                      handleCodeDetected(manualScanInput.trim());
                    }
                  }}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3.5 py-1.5 transition"
                >
                  {language === "en" ? "Simulate" : "Simüle Et"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}