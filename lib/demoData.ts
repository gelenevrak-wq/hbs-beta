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
    { id: "wh-toyota", name: "Toyota Deposu", purpose: "Toyota yedek parça ve sarf malzemeleri", customerVisible: true, city: "Batumi", zones: ["T"], shelves: ["T-01-01", "T-01-02", "T-01-03", "T-02-01", "T-02-02", "T-02-03", "T-03-01", "T-03-02", "T-03-03"], capacity: 2000, used: 450 },
    { id: "wh-mercedes", name: "Mercedes-Benz Deposu", purpose: "Mercedes yedek parça ve sarf malzemeleri", customerVisible: true, city: "Batumi", zones: ["M"], shelves: ["M-01-01", "M-01-02", "M-01-03", "M-02-01", "M-02-02", "M-02-03"], capacity: 1500, used: 320 },
    { id: "wh-bmw", name: "BMW Deposu", purpose: "BMW yedek parça ve sarf malzemeleri", customerVisible: true, city: "Batumi", zones: ["B"], shelves: ["B-01-01", "B-01-02", "B-01-03", "B-02-01", "B-02-02", "B-02-03"], capacity: 1500, used: 280 },
    { id: "wh-opel", name: "Opel Deposu", purpose: "Opel yedek parça ve aksesuarları", customerVisible: true, city: "Batumi", zones: ["O"], shelves: ["O-01-01", "O-01-02", "O-02-01", "O-02-02"], capacity: 1000, used: 150 },
    { id: "wh-ford", name: "Ford Deposu", purpose: "Ford yedek parça ve sarf malzemeleri", customerVisible: true, city: "Batumi", zones: ["F"], shelves: ["F-01-01", "F-01-02", "F-02-01", "F-02-02"], capacity: 1200, used: 200 },
    { id: "wh-subaru", name: "Subaru Deposu", purpose: "Subaru yedek parçaları (Boxer Motor & AWD)", customerVisible: true, city: "Batumi", zones: ["S"], shelves: ["S-01-01", "S-01-02", "S-02-01", "S-02-02"], capacity: 800, used: 90 },
    { id: "wh-honda", name: "Honda Deposu", purpose: "Honda motor, şanzıman ve kaporta parçaları", customerVisible: true, city: "Batumi", zones: ["H"], shelves: ["H-01-01", "H-01-02", "H-02-01", "H-02-02"], capacity: 1000, used: 130 },
    { id: "wh-hyundai", name: "Hyundai Deposu", purpose: "Hyundai yedek parça ve bakım filtreleri", customerVisible: true, city: "Batumi", zones: ["Y"], shelves: ["Y-01-01", "Y-01-02", "Y-02-01", "Y-02-02"], capacity: 1000, used: 110 }
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
    { name: "Toyota", whName: "Toyota Deposu", zone: "T", shelves: ["T-01-01", "T-01-02", "T-01-03", "T-02-01", "T-02-02", "T-02-03", "T-03-01", "T-03-02", "T-03-03"], models: ["Prius 1.8", "Land Cruiser Prado", "Yaris 1.33", "Corolla 1.6", "Camry 2.5", "RAV4 2.0"] },
    { name: "Mercedes-Benz", whName: "Mercedes-Benz Deposu", zone: "M", shelves: ["M-01-01", "M-01-02", "M-01-03", "M-02-01", "M-02-02", "M-02-03"], models: ["E-Class W213", "C-Class W205", "A-Class W177", "Sprinter 906", "GLE Coupe", "CLA 200"] },
    { name: "BMW", whName: "BMW Deposu", zone: "B", shelves: ["B-01-01", "B-01-02", "B-01-03", "B-02-01", "B-02-02", "B-02-03"], models: ["5 Series G30", "3 Series F30", "X5 G05", "1 Series F20", "7 Series G11", "3 Series E90"] },
    { name: "Opel", whName: "Opel Deposu", zone: "O", shelves: ["O-01-01", "O-01-02", "O-02-01", "O-02-02"], models: ["Astra J 1.4T", "Vectra C 1.6", "Corsa D 1.3", "Insignia A 2.0", "Mokka 1.6", "Astra H 1.6"] },
    { name: "Ford", whName: "Ford Deposu", zone: "F", shelves: ["F-01-01", "F-01-02", "F-02-01", "F-02-02"], models: ["Transit 2.2", "Focus 1.6", "Mondeo Mk5", "Fiesta 1.4", "Kuga 1.5", "Ranger 2.2"] },
    { name: "Subaru", whName: "Subaru Deposu", zone: "S", shelves: ["S-01-01", "S-01-02", "S-02-01", "S-02-02"], models: ["Forester 2.0 EJ20", "Outback 2.5", "Impreza WRX 2.5", "XV 1.6", "Legacy 2.0", "Tribeca 3.6"] },
    { name: "Honda", whName: "Honda Deposu", zone: "H", shelves: ["H-01-01", "H-01-02", "H-02-01", "H-02-02"], models: ["Civic 1.6 VTEC", "CR-V 2.0", "Fit 1.4 i-DSI", "Accord 2.0", "HR-V 1.5", "Jazz 1.2"] },
    { name: "Hyundai", whName: "Hyundai Deposu", zone: "Y", shelves: ["Y-01-01", "Y-01-02", "Y-02-01", "Y-02-02"], models: ["Elantra 1.6", "Accent Era 1.5", "Santa Fe 2.2", "i30 1.6 CRDi", "Tucson 1.6 T-GDI", "Getz 1.4"] }
  ];

  const partPool = [
    { category: "Fren Sistemi", name: "Ön Fren Balatası", prefix: "BAL-ON" },
    { category: "Fren Sistemi", name: "Arka Fren Balatası", prefix: "BAL-ARK" },
    { category: "Fren Sistemi", name: "Fren Diski Takımı", prefix: "DISK" },
    { category: "Fren Sistemi", name: "Fren Kaliperi", prefix: "KALIPER" },
    { category: "Motor Parçaları", name: "Silindir Kapak Contası", prefix: "CONTA" },
    { category: "Motor Parçaları", name: "Triger Kayış Seti", prefix: "TRIGER" },
    { category: "Motor Parçaları", name: "Krank Kasnağı", prefix: "KASNAK" },
    { category: "Ateşleme Sistemi", name: "Ateşleme Bobini", prefix: "BOBIN" },
    { category: "Ateşleme Sistemi", name: "Buji Seti", prefix: "BUJI" },
    { category: "Soğutma Sistemi", name: "Devirdaim Su Pompası", prefix: "POMPA" },
    { category: "Soğutma Sistemi", name: "Termostat Müşürü", prefix: "TERMOSTAT" },
    { category: "Bakım Malzemeleri", name: "Yağ Filtresi", prefix: "FILT-YAG" },
    { category: "Bakım Malzemeleri", name: "Hava Filtresi", prefix: "FILT-HAV" },
    { category: "Bakım Malzemeleri", name: "Aktif Karbonlu Polen Filtresi", prefix: "FILT-POL" },
    { category: "Süspansiyon", name: "Z-Link Rot Mili", prefix: "ZLINK" },
    { category: "Süspansiyon", name: "Ön Amortisör", prefix: "AMORTISOR" },
    { category: "Süspansiyon", name: "Rot Başı Dış", prefix: "ROT-BASI" },
    { category: "Süspansiyon", name: "Alt Rotil", prefix: "ROTIL" },
    { category: "Sıvılar & Yağlar", name: "Motor Yağı 5W30 (4 Litre)", prefix: "OIL-5W30" },
    { category: "Sıvılar & Yağlar", name: "Antifriz Kırmızı (1.5 Litre)", prefix: "OIL-ANTIFRIZ" }
  ];

  const products: ProductRecord[] = [];

  brands.forEach(b => {
    for (let i = 1; i <= 50; i++) {
      const part = partPool[(i - 1) % partPool.length];
      const model = b.models[(i - 1) % b.models.length];
      const name = `${b.name} ${model} ${part.name}`;
      const sku = `${b.zone}-${part.prefix}-${i}`;
      const barcode = `8691${b.zone.charCodeAt(0)}${10000 + i}`;
      const qrCode = `QR-${sku}`;
      const oemCode = `${Math.floor(10000 + i * 23)}-${b.zone}${i}`;
      const mfrCode = `MFR-${sku}`;

      const purchaseVal = Math.floor(20 + ((i * 7) % 300));
      const saleVal = Math.floor(purchaseVal * 1.8);
      const quantityVal = Math.floor(3 + ((i * 3) % 45));

      const shelf = b.shelves[(i - 1) % b.shelves.length];

      products.push({
        id: `prod-${b.name.toLowerCase()}-${i}`,
        itemType: "product",
        name,
        category: part.category,
        brand: b.name,
        model,
        description: `${name} - ${model} araçları için yüksek dayanıklılığa ve uzun kullanım ömrüne sahip OEM onaylı yedek parça.`,
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
        warehouse: b.whName,
        shelf,
        entryDate: `2026-06-${(i % 28) + 1 < 10 ? `0${(i % 28) + 1}` : (i % 28) + 1}`,
        exitDate: "",
        pricingMode: "fixed",
        visibility: "visible",
        imageUrl: "/product-images/part.svg",
        videoUrl: "",
        variants: [],
        galleryUrls: ["/product-images/part.svg"]
      });
    }
  });

  return products;
};
