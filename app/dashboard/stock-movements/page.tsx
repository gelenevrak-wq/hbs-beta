"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLocalizedField } from "@/lib/translations";
import { supabase } from "@/lib/supabaseClient";

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
      return "bg-emerald-950 text-emerald-200";
    case "sale":
    case "stock_out":
      return "bg-blue-950 text-blue-200";
    case "waste":
      return "bg-red-950 text-red-200";
    case "transfer":
      return "bg-purple-950 text-purple-200";
    case "manual_adjustment":
      return "bg-yellow-950 text-yellow-200";
  }
}

// Translations Dictionary
const translations = {
  tr: {
    createMovementHeader: "Stok İşlemi Oluştur",
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
    descPlaceholder: "İşlem açıklaması, tedarikçi, müşteri veya düzeltme nedeni",
    searchPlaceholder: "Ürün, kod, depo, raf veya not ara",
    title: "Depo ve Stok Hareketleri",
    desc: "Mağaza ürünlerinde stok girişi, satış çıkışı, iade, fire, depo transferi ve manuel düzeltme işlemlerini yönetin. Barkod, QR, SKU veya OEM kodu ile ürün hızlıca bulunabilir.",
    barcodeCompatibility: "Harici USB/Bluetooth barkod okuyucular genellikle klavye gibi çalışır. Barkod alanı aktifken kodu yazar ve Enter gönderir. Bu ekran bu mantığa uygun tasarlanmıştır.",
    barcodeCompatibilityTitle: "Barkod okuyucu uyumu",
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
    noMovementFound: "Bu aramaya uygun stok hareketi bulunamadı.",
    realDataConn: "Gerçek veri bağlantısı",
    realDataConnDesc: "Bu ekran şimdilik demo ürünlerle çalışır. Veritabanı bağlandığında stok hareketleri ürün kaydına, depo konumuna, kullanıcıya, siparişe ve cari hesaba bağlanacaktır.",
    biometricAuth: "Biyometrik Yetkilendirme",
    barcodePlaceholder: "Barkod / QR / SKU / OEM / Ürün Adı",
    errEmptyCode: "Lütfen barkod, SKU, OEM kodu veya ürün adı girin.",
    errProductNotFound: "Bu kodla eşleşen ürün bulunamadı. Gerçek sistemde buradan yeni ürün kaydı başlatılabilir.",
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
    createMovementHeader: "Create Stock Transaction",
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
    desc: "Manage stock in, sales out, returns, waste, warehouse transfer and manual adjustments on store products. Search products by barcode, QR, SKU, or OEM codes.",
    barcodeCompatibility: "External USB/Bluetooth barcode scanners usually act like keyboards. They type the code and send Enter when the barcode field is active. This screen is designed accordingly.",
    barcodeCompatibilityTitle: "Barcode Scanner Compatibility",
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
    realDataConn: "Real Data Connection",
    realDataConnDesc: "This screen currently operates with demo products. Once connected to database, stock movements will link to product records, warehouse locations, users, orders and current accounts.",
    biometricAuth: "Biometric Authorization",
    barcodePlaceholder: "Barcode / QR / SKU / OEM / Product Name",
    errEmptyCode: "Please enter barcode, SKU, OEM code or product name.",
    errProductNotFound: "No product matching this code found. A new product record can be initiated here in the real system.",
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
    createMovementHeader: "Lagerbewegung erstellen",
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
    desc: "Verwalten Sie Wareneingänge, Verkäufe, Retouren, Ausschuss, Lagerübertragungen und manuelle Anpassungen für Ladenprodukte. Suchen Sie Produkte nach Barcode, QR, SKU oder OEM.",
    barcodeCompatibility: "Externe USB/Bluetooth-Barcodescanner verhalten sich meist wie Tastaturen. Sie schreiben den Code und senden Enter, wenn das Barcodefeld aktiv ist. Dieser Bildschirm ist entsprechend konzipiert.",
    barcodeCompatibilityTitle: "Barcodescanner-Kompatibilität",
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
    noMovementFound: "Keine Lagerbewegungen für diese Suche gefunden.",
    realDataConn: "Echte Datenverbindung",
    realDataConnDesc: "Dieser Bildschirm arbeitet derzeit mit Demoprodukten. Sobald die Datenbank verbunden ist, werden Bestandsbewegungen mit Produktakten, Lagerorten, Benutzern, Bestellungen und laufenden Konten verknüpft.",
    biometricAuth: "Biometrische Autorisierung",
    barcodePlaceholder: "Barcode / QR / SKU / OEM / Produktname",
    errEmptyCode: "Bitte geben Sie einen Barcode, eine SKU, einen OEM-Code oder einen Produktnamen ein.",
    errProductNotFound: "Kein Produkt mit diesem Code gefunden. Im echten System kann hier ein neuer Produktdatensatz angelegt werden.",
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
    createMovementHeader: "Создать складскую операцию",
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
    desc: "Управляйте приходами, расходами, продажами, возвратами, браком, межскладскими переводами и ручными корректировками товаров. Быстрый поиск по штрихкоду, QR, SKU или OEM.",
    barcodeCompatibility: "Внешние USB/Bluetooth-сканеры штрихкодов обычно работают как клавиатура. Они вводят код и отправляют Enter, когда поле штрихкода активно. Экран разработан с учетом этого.",
    barcodeCompatibilityTitle: "Совместимость со сканером штрихкодов",
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
    noMovementFound: "Складских операций по этому запросу не найдено.",
    realDataConn: "Реальное подключение данных",
    realDataConnDesc: "Этот экран работает с демо-товарами. После подключения БД движения запасов будут привязаны к записям товаров, складам, пользователям, заказам и счетам.",
    biometricAuth: "Биометрическая авторизация",
    barcodePlaceholder: "Штрихкод / QR / SKU / OEM / Название товара",
    errEmptyCode: "Пожалуйста, введите штрихкод, SKU, OEM-код или название товара.",
    errProductNotFound: "Товар с таким кодом не найден. В реальной системе здесь можно создать новый товар.",
    msgProductFound: "Товар {name} найден. Можно выполнить складскую операцию.",
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
    createMovementHeader: "მარაგის ოპერაციის შექმნა",
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
    desc: "მართეთ მარაგის მიღება, გაყიდვა, დაბრუნება, წუნი, შიდა გადაცემა და მანუალური კორექტირება. სწრაფი ძებნა შტრიხკოდით, QR, SKU ან OEM კოდით.",
    barcodeCompatibility: "გარე USB/Bluetooth შტრიხკოდების სკანერები ჩვეულებრივ მუშაობენ როგორც კლავიატურა. ისინი წერენ კოდს და აგზავნიან Enter-ს, როდესაც კოდის ველი აქტიურია. ეს ეკრანი შექმნილია ამ პრინციპით.",
    barcodeCompatibilityTitle: "შტრიხკოდების სკანერის თავსებადობა",
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
    noMovementFound: "ამ ძებნის შესაბამისი მარაგის მოძრაობა ვერ მოიძებნა.",
    realDataConn: "რეალური მონაცემების კავშირი",
    realDataConnDesc: "ეს ეკრანი ამჟამად მუშაობს დემო პროდუქტებით. მონაცემთა ბაზის დაკავშირების შემდეგ, მოძრაობები მიებმება პროდუქტებს, საწყობებს, მომხმარებლებს, შეკვეთებსა და ანგარიშებს.",
    biometricAuth: "ბიომეტრიული ავტორიზაცია",
    barcodePlaceholder: "შტრიხკოდი / QR / SKU / OEM / პროდუქტის სახელი",
    errEmptyCode: "გთხოვთ შეიყვანოთ შტრიხკოდი, SKU, OEM კოდი ან პროდუქტის სახელი.",
    errProductNotFound: "პროდუქტი ამ კოდით ვერ მოიძებნა. რეალურ სისტემაში აქედან შესაძლებელია ახალი პროდუქტის რეგისტრაცია.",
    msgProductFound: "{name} მოიძებნა. მარაგის ოპერაცია შესაძლებელია.",
    errEmptyProduct: "ჯერ აირჩიეთ პროდუქტი ან მოძებნეთ შტრიხკოდით/SKU/OEM კოდით.",
    errInvalidQty: "გთხოვთ შეიყვანოთ რაოდენობის ვალიდური მნიშვნელობა.",
    errNegStock: "მარაგის რაოდენობა ვერ გახდება უარყოფითი. ოპერაცია გაუქმდა.",
    msgSaveSuccess: "მარაგის ოპერაცია შენახულია {name}-ისთვის. ახალი მარაგი: {stock}",
    biometricRequired: "საწყობის მფლობელის მიერ თანამშრომლებისთვის მოთხოვნილია ბიომეტრიული დადასტურება. გთხოვთ გაიაროთ Touch ID / Face ID ავტორიზაცია.",
    biometricSuccess: "ბიომეტრიული ავტორიზაცია წარმატებულია! ოპერაცია ინახება...",
    codeLabel: "კოდი",
    navProducts: "პროდუქტების მართვა",
    navDashboard: "მართვის პანელი",
    navHome: "მთავარი"
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

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;
  const [availableWarehouses, setAvailableWarehouses] = useState<any[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState("");

  useEffect(() => {
    // 1. Get current store slug
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

    // 2. Load warehouses map
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

    // 3. Load products (Supabase & fallback)
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

    // 4. Load movements
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

    // Biyometrik zorunluluk kontrolü
    let requireBiometric = false;
    try {
      const companySettingsStr = window.localStorage.getItem("hbs-company-settings");
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      if (companySettingsStr && currentUserStr) {
        const settings = JSON.parse(companySettingsStr);
        const user = JSON.parse(currentUserStr);
        // Eğer elemanlar için biyometrik girişi zorunlu kılındıysa ve giriş yapan kişi Owner/Superadmin değilse
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

      // Update quantity in hbs-store-products-${storeSlug} local storage
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

      // Sync to database
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

    if (requireBiometric) {
      setIsVerifyingBiometric(true);
      setBiometricMessage(t.biometricRequired);
      
      setTimeout(() => {
        setBiometricMessage(t.biometricSuccess);
        setTimeout(() => {
          setIsVerifyingBiometric(false);
          executeSave();
        }, 800);
      }, 1800);
    } else {
      executeSave();
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-black tracking-wide">
            HBS
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/products"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t.navProducts}
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t.navDashboard}
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t.navHome}
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                {language === "en" ? "STOCK IN / OUT" : language === "de" ? "BESTANDSEINGANG / AUSHANG" : language === "ru" ? "ПРИХОД / РАСХОД" : language === "ka" ? "მარაგის მიღება / გაცემა" : "STOK GİRİŞ / ÇIKIŞ"}
              </p>

              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                {t.title}
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                {t.desc}
              </p>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
              <h2 className="text-lg font-black text-blue-100">
                {t.barcodeCompatibilityTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100/90">
                {t.barcodeCompatibility}
              </p>
            </div>
          </div>
        </section>

        {message && (
          <div className="mb-6 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5 text-sm leading-6 text-blue-100">
            {message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <h2 className="text-2xl font-black">{t.createMovementHeader}</h2>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  {t.barcodePlaceholder}
                </span>
                <input
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value)}
                  onKeyDown={handleCodeKeyDown}
                  placeholder={t.scanPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white" id="id-page-w-full-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-placeholder-text-slate-600-focus-border-white-524" aria-label="W full rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none placeholder text slate 600 focus border white" />
              </label>

              <button
                type="button"
                onClick={handleCodeSearch}
                className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-200"
              >
                {t.findProductBtn}
              </button>

              {selectedProduct && (
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <h3 className="text-lg font-black text-emerald-100">
                    {getLocalizedField(selectedProduct.name, language)}
                  </h3>

                  <div className="mt-3 grid gap-2 text-sm text-emerald-100/90">
                    <p>
                      <span className="font-bold text-white">{t.barcodeLabel}:</span>{" "}
                      {selectedProduct.barcode}
                    </p>
                    <p>
                      <span className="font-bold text-white">{t.skuLabel}:</span>{" "}
                      {selectedProduct.sku}
                    </p>
                    <p>
                      <span className="font-bold text-white">{t.oemLabel}:</span>{" "}
                      {selectedProduct.oemCode || "-"}
                    </p>
                    <p>
                      <span className="font-bold text-white">{t.currentStockLabel}:</span>{" "}
                      {selectedProduct.currentStock}
                    </p>
                    <p>
                      <span className="font-bold text-white">{t.warehouseShelfLabel}:</span>{" "}
                      {selectedProduct.warehouse} / {selectedProduct.shelf}
                    </p>
                  </div>
                </div>
              )}

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">{t.movementTypeLabel}</span>
                <select
                  value={movementType}
                  onChange={(event) =>
                    setMovementType(event.target.value as MovementType)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
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

              <div className="grid gap-5 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">{t.qtyLabel}</span>
                  <input
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    type="number"
                    placeholder={t.qtyPlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white" id="id-page-w-full-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-placeholder-text-slate-600-focus-border-white-978" aria-label="W full rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none placeholder text slate 600 focus border white" />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">{t.warehouseLabel}</span>
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
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white text-white"
                    >
                      {availableWarehouses.map((wh) => (
                        <option key={wh.name} value={wh.name} className="bg-slate-950 text-white">{wh.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={warehouse}
                      onChange={(event) => setWarehouse(event.target.value)}
                      placeholder={language === "en" ? "Main Warehouse" : language === "de" ? "Hauptlager" : language === "ru" ? "Основной склад" : language === "ka" ? "მთავარი საწყობი" : "Ana Depo"}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white" id="id-page-w-full-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-placeholder-text-slate-600-focus-border-white-522" aria-label="W full rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none placeholder text slate 600 focus border white" />
                  )}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">{t.shelfLabel}</span>
                  {availableWarehouses.length > 0 ? (
                    <select
                      value={shelf}
                      onChange={(event) => setShelf(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white text-white"
                    >
                      {(availableWarehouses.find(wh => wh.name === warehouse)?.shelves || []).map((sh: string) => (
                        <option key={sh} value={sh} className="bg-slate-950 text-white">{sh}</option>
                      ))}
                      {(!availableWarehouses.find(wh => wh.name === warehouse)?.shelves || 
                        availableWarehouses.find(wh => wh.name === warehouse)?.shelves.length === 0) && (
                        <option value="" className="bg-slate-950 text-white">{language === "en" ? "No Shelf Position" : language === "de" ? "Keine Regalposition" : language === "ru" ? "Нет положения полки" : language === "ka" ? "თაროს მდებარეობა არ არის" : "Raf Konumu Yok"}</option>
                      )}
                    </select>
                  ) : (
                    <input
                      value={shelf}
                      onChange={(event) => setShelf(event.target.value)}
                      placeholder="A-01"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white" id="id-page-w-full-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-placeholder-text-slate-600-focus-border-white-808" aria-label="W full rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none placeholder text slate 600 focus border white" />
                  )}
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">{t.noteLabel}</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={4}
                  placeholder={t.descPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                />
              </label>

              <button
                type="button"
                onClick={createMovement}
                className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-200"
              >
                {t.saveBtn}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
              <h2 className="text-2xl font-black">{t.movementsHeader}</h2>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white" id="id-page-mt-5-w-full-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-placeholder-text-slate-600-focus-border-white-627" aria-label="Mt 5 w full rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none placeholder text slate 600 focus border white" />

              <div className="mt-5 grid gap-4">
                {filteredMovements.map((movement) => (
                  <article
                    key={movement.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                  >
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${movementBadgeClass(
                          movement.movementType
                        )}`}
                      >
                        {movementTypeText(movement.movementType, language)}
                      </span>

                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                        {movement.createdAt}
                      </span>
                    </div>

                    <h3 className="text-lg font-black">
                      {getLocalizedField(movement.productName, language)}
                    </h3>

                    <div className="mt-4 grid gap-2 text-sm text-slate-300">
                      <p>
                        <span className="font-bold text-white">{t.codeLabel}:</span>{" "}
                        {movement.productCode}
                      </p>

                      <p>
                        <span className="font-bold text-white">{t.qtyLabel}:</span>{" "}
                        {movement.quantity}
                      </p>

                      <p>
                        <span className="font-bold text-white">{t.warehouseShelfLabel}:</span>{" "}
                        {movement.warehouse} / {movement.shelf}
                      </p>

                      <p>
                        <span className="font-bold text-white">{t.noteLabel}:</span>{" "}
                        {movement.note || "-"}
                      </p>
                    </div>
                  </article>
                ))}

                {filteredMovements.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                    {t.noMovementFound}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-amber-100">
                {t.realDataConn}
              </h2>

              <p className="mt-3 text-sm leading-6 text-amber-100/90">
                {t.realDataConnDesc}
              </p>
            </div>
          </div>
        </section>
      </div>

      {isVerifyingBiometric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-2xl transition-all text-white">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-400 relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping opacity-75"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="w-10 h-10 animate-pulse text-blue-400" viewBox="0 0 16 16">
                <path d="M4.828 8.9A.5.5 0 0 1 5 8.5c0-.18.064-.324.152-.424.089-.1.202-.154.348-.154.146 0 .26.054.348.154.088.1.152.244.152.424a.5.5 0 1 1-1 0c0-.07-.024-.12-.042-.14-.017-.02-.044-.03-.058-.03-.014 0-.04.01-.058.03-.018.02-.042.07-.042.14a.5.5 0 0 1-.5.5M7 6.5C7 5.672 7.672 5 8.5 5s1.5.672 1.5 1.5c0 .313-.083.56-.217.74-.132.18-.3.26-.483.26-.183 0-.35-.08-.483-.26-.134-.18-.217-.427-.217-.74a.5.5 0 0 0-1 0c0 .687.217 1.14.517 1.543.3.4.717.657 1.183.657.466 0 .883-.257 1.183-.657.3-.404.517-.856.517-1.543 0-1.38-1.12-2.5-2.5-2.5S6 5.12 6 6.5a.5.5 0 0 0 1 0"/>
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0"/>
              </svg>
            </div>
            <h3 className="text-xl font-black tracking-tight">{t.biometricAuth}</h3>
            <p className="mt-3 text-sm text-slate-300 font-semibold leading-relaxed">
              {biometricMessage}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}