// Dedicated module to handle Özgür Motor demo data generation and store states
// Prevents race conditions by providing a single source of truth for initialization

export type ProductRecord = {
  id: string;
  itemType: string;
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
  pricingMode: string;
  visibility: string;
  imageUrl: string;
  videoUrl: string;
  variants: any[];
  galleryUrls: string[];
};

export const generateShelves = (zones: string[], depth: number, tiers: number) => {
  const list: string[] = [];
  zones.forEach(z => {
    for (let d = 1; d <= depth; d++) {
      for (let t = 1; t <= tiers; t++) {
        const dStr = d < 10 ? `0${d}` : `${d}`;
        const tStr = t < 10 ? `0${t}` : `${t}`;
        list.push(`${z}${dStr}${tStr}`);
      }
    }
  });
  return list;
};

export const OZGUR_MOTOR_STORE = {
  code: "ozgur-motor",
  name: "Özgür Motor",
  representative: "Özgür Özdemir",
  email: "info@ozgurmotor.com",
  password: "MOTOR61",
  address: "Kutaisi Caddesi No: 45, Batumi, Gürcistan",
  phone: "+995 599 88 77 66",
  operatingModel: "hybrid",
  isActive: true,
  warehouses: [
    { id: "wh-ana", name: "Ana Depo", purpose: "Merkez Dağıtım Deposu", customerVisible: true, city: "Batumi", zones: ["A", "B", "C", "D"], shelves: generateShelves(["A", "B", "C", "D"], 10, 8), capacity: 10000, used: 0 },
    { id: "wh-istanbul", name: "İstanbul Deposu", purpose: "Yedek Parça Dağıtım Deposu", customerVisible: true, city: "İstanbul", zones: ["A", "B", "C", "D"], shelves: generateShelves(["A", "B", "C", "D"], 10, 8), capacity: 5000, used: 0 },
    { id: "wh-ankara", name: "Ankara Deposu", purpose: "Yedek Parça Dağıtım Deposu", customerVisible: true, city: "Ankara", zones: ["A", "B", "C", "D"], shelves: generateShelves(["A", "B", "C", "D"], 10, 8), capacity: 5000, used: 0 },
    { id: "wh-trabzon", name: "Trabzon Deposu", purpose: "Karadeniz Dağıtım Deposu", customerVisible: true, city: "Trabzon", zones: ["A", "B", "C", "D"], shelves: generateShelves(["A", "B", "C", "D"], 10, 8), capacity: 5000, used: 0 },
    { id: "wh-batum", name: "Batum Deposu", purpose: "Gürcistan Ana Depo", customerVisible: true, city: "Batumi", zones: ["A", "B", "C", "D"], shelves: generateShelves(["A", "B", "C", "D"], 10, 8), capacity: 5000, used: 0 },
    { id: "wh-tiflis", name: "Tiflis Deposu", purpose: "Gürcistan Bölge Depo", customerVisible: true, city: "Tbilisi", zones: ["A", "B", "C", "D"], shelves: generateShelves(["A", "B", "C", "D"], 10, 8), capacity: 5000, used: 0 }
  ]
};

export const OZGUR_MOTOR_STAFF = {
  id: "staff-ozgurmotor",
  username: "OZGURMOTOR",
  displayName: "Özgür Motor",
  role: "owner",
  storeSlugs: ["ozgur-motor"],
  password: "MOTOR61"
};

export const generateOzgurMotorProducts = (): ProductRecord[] => {
  const brands = [
    { name: "Toyota", zone: "T", models: ["Prius 1.8", "Land Cruiser Prado", "Yaris 1.33", "Corolla 1.6", "Camry 2.5", "RAV4 2.0"] },
    { name: "Mercedes-Benz", zone: "M", models: ["E-Class W213", "C-Class W205", "A-Class W177", "Sprinter 906", "GLE Coupe", "CLA 200"] },
    { name: "BMW", zone: "B", models: ["5 Series G30", "3 Series F30", "X5 G05", "1 Series F20", "7 Series G11", "3 Series E90"] },
    { name: "Opel", zone: "O", models: ["Astra J 1.4T", "Vectra C 1.6", "Corsa D 1.3", "Insignia A 2.0", "Mokka 1.6", "Astra H 1.6"] },
    { name: "Ford", zone: "F", models: ["Transit 2.2", "Focus 1.6", "Mondeo Mk5", "Fiesta 1.4", "Kuga 1.5", "Ranger 2.2"] },
    { name: "Subaru", zone: "S", models: ["Forester 2.0 EJ20", "Outback 2.5", "Impreza WRX 2.5", "XV 1.6", "Legacy 2.0", "Tribeca 3.6"] },
    { name: "Honda", zone: "H", models: ["Civic 1.6 VTEC", "CR-V 2.0", "Fit 1.4 i-DSI", "Accord 2.0", "HR-V 1.5", "Jazz 1.2"] },
    { name: "Hyundai", zone: "Y", models: ["Elantra 1.6", "Accent Era 1.5", "Santa Fe 2.2", "i30 1.6 CRDi", "Tucson 1.6 T-GDI", "Getz 1.4"] }
  ];

  const partPool = [
    { category: "Fren Sistemi", tr: "Ön Fren Balatası", en: "Front Brake Pads", de: "Bremsbeläge vorne", ru: "Передние тормозные колодки", ka: "წინა სამუხრუჭე ხუნდები", prefix: "BAL-ON" },
    { category: "Fren Sistemi", tr: "Arka Fren Balatası", en: "Rear Brake Pads", de: "Bremsbeläge hinten", ru: "Задние тормозные колодки", ka: "უკანა სამუხრუჭე ხუნდები", prefix: "BAL-ARK" },
    { category: "Fren Sistemi", tr: "Fren Diski Takımı", en: "Brake Disc Set", de: "Bremsscheiben-Satz", ru: "Комплект тормозных дисков", ka: "სამუხრუჭე დისკების კომპლექტი", prefix: "DISK" },
    { category: "Motor Parçaları", tr: "Silindir Kapak Contası", en: "Cylinder Head Gasket", de: "Zylinderkopfdichtung", ru: "Прокладка головки блока цилиндров", ka: "ცილინდრის თავის შუასადები", prefix: "CONTA" },
    { category: "Motor Parçaları", tr: "Triger Kayış Seti", prefix: "TRIGER", en: "Timing Belt Set", de: "Zahnriemensatz", ru: "Комплект реμня ГРМ", ka: "კბილანა ღვედის კომპლექტი" },
    { category: "Ateşleme Sistemi", tr: "Ateşleme Bobini", prefix: "BOBIN", en: "Ignition Coil", de: "Zündspule", ru: "Катушка зажигания", ka: "აალების კოჭა" },
    { category: "Ateşleme Sistemi", tr: "Buji Seti", prefix: "BUJI", en: "Spark Plug Set", de: "Zündkerzen-Set", ru: "Комплект свечей зажигания", ka: "სანთლების კომპლექტი" },
    { category: "Bakım Malzemeleri", tr: "Yağ Filtresi", prefix: "FILT-YAG", en: "Oil Filter", de: "Ölfilter", ru: "Масляный фильтр", ka: "ზეთის ფილტრი" },
    { category: "Bakım Malzemeleri", tr: "Hava Filtresi", prefix: "FILT-HAV", en: "Air Filter", de: "Luftfilter", ru: "Воздушный фильтр", ka: "ჰაერის ფილტრი" },
    { category: "Bakım Malzemeleri", tr: "Polen Filtresi", prefix: "FILT-POL", en: "Cabin Filter", de: "Innenraumfilter", ru: "Салонный фильтр", ka: "სალონის ფილტრი" }
  ];

  const images = [
    "/product-images/autel-mx808s.png",
    "/product-images/autel-ds900.png",
    "/product-images/autel-ms909-s2.png",
    "/product-images/brake-pad.svg",
    "/product-images/oil-filter.svg",
    "/product-images/spark-plugs.svg",
    "/product-images/diagnostic-scanner.svg",
    "/product-images/diagnostic-tablet.svg"
  ];

  const products: ProductRecord[] = [];

  brands.forEach(b => {
    // Generate exactly 4 products per brand
    for (let i = 1; i <= 4; i++) {
      const part = partPool[(i - 1) % partPool.length];
      const model = b.models[(i - 1) % b.models.length];
      
      // Build clean JSON string names & descriptions for all 5 languages to prevent translation leaks
      const nameJson = JSON.stringify({
        tr: `${b.name} ${model} ${part.tr}`,
        en: `${b.name} ${model} ${part.en}`,
        de: `${b.name} ${model} ${part.de}`,
        ru: `${b.name} ${model} ${part.ru}`,
        ka: `${b.name} ${model} ${part.ka}`
      });

      const descJson = JSON.stringify({
        tr: `${b.name} ${model} araçları için yüksek dayanıklılığa ve uzun kullanım ömrüne sahip OEM onaylı yedek parça.`,
        en: `OEM approved spare part with high durability and long service life for ${b.name} ${model} vehicles.`,
        de: `OEM-zugelassenes Ersatzteil mit hoher Haltbarkeit und langer Lebensdauer für ${b.name} ${model} Fahrzeuge.`,
        ru: `Одобренная OEM запасная часть с высокой прочностью и длительным сроком службы для автомобилей ${b.name} ${model}.`,
        ka: `OEM დამტკიცებული სათადარიგო ნაწილი მაღალი გამძლეობით და ხანგრძლივი მუშაობის ვადით ${b.name} ${model} ავტომობილებისთვის.`
      });

      const sku = `${b.zone}-${part.prefix}-${i}`;
      const barcode = `8691${b.zone.charCodeAt(0)}${10000 + i}`;
      const qrCode = `QR-${sku}`;
      const oemCode = `${Math.floor(10000 + i * 23)}-${b.zone}${i}`;
      const mfrCode = `MFR-${sku}`;

      const purchaseVal = Math.floor(20 + ((i * 7) % 300));
      const saleVal = Math.floor(purchaseVal * 1.8);
      const quantityVal = 10; // clean default stock level

      const imageUrl = images[(i - 1) % images.length];

      products.push({
        id: `prod-${b.name.toLowerCase()}-${i}`,
        itemType: "product",
        name: nameJson,
        category: part.category,
        brand: b.name,
        model,
        description: descJson,
        purchasePrice: purchaseVal.toFixed(2),
        salePrice: saleVal.toFixed(2),
        currency: "GEL",
        barcode,
        qrCode,
        sku,
        oemCode,
        manufacturerCode: mfrCode,
        stockTracking: true,
        quantity: String(quantityVal),
        warehouse: "Ana Depo",
        shelf: "",
        entryDate: `2026-06-${(i % 28) + 1 < 10 ? `0${(i % 28) + 1}` : (i % 28) + 1}`,
        exitDate: "",
        pricingMode: "fixed",
        visibility: "visible",
        imageUrl,
        videoUrl: "",
        variants: [],
        galleryUrls: [imageUrl]
      });
    }
  });

  return products.slice(0, 27);
};
