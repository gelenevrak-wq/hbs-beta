const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const OZGUR_MOTOR_STORE = {
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
    { id: "wh-istanbul", name: "İstanbul Şubesi", purpose: "İstanbul Merkez Yedek Parça Dağıtım", customerVisible: true, city: "İstanbul", zones: ["A", "B", "C"], shelves: ["A0101", "A0102", "A0201", "B0101", "B0102", "C0101"], capacity: 5000, used: 800 },
    { id: "wh-izmir", name: "İzmir Şubesi", purpose: "Ege Bölgesi Yedek Parça Deposu", customerVisible: true, city: "İzmir", zones: ["A", "B", "C"], shelves: ["A0101", "A0102", "A0201", "B0101", "B0102", "C0101"], capacity: 4000, used: 600 },
    { id: "wh-batum", name: "Batum Şubesi", purpose: "Gürcistan Batum Ana Depo", customerVisible: true, city: "Batumi", zones: ["A", "B", "C"], shelves: ["A0101", "A0102", "A0201", "B0101", "B0102", "C0101"], capacity: 3000, used: 500 },
    { id: "wh-tiflis", name: "Tiflis Şubesi", purpose: "Tiflis Bölge Dağıtım Deposu", customerVisible: true, city: "Tbilisi", zones: ["A", "B", "C"], shelves: ["A0101", "A0102", "A0201", "B0101", "B0102", "C0101"], capacity: 3000, used: 400 },
    { id: "wh-ankara", name: "Ankara Şubesi", purpose: "İç Anadolu Bölge Deposu", customerVisible: true, city: "Ankara", zones: ["A", "B", "C"], shelves: ["A0101", "A0102", "A0201", "B0101", "B0102", "C0101"], capacity: 4000, used: 700 }
  ]
};

function generateOzgurMotorProducts() {
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

  const warehouses = [
    "İstanbul Şubesi",
    "İzmir Şubesi",
    "Batum Şubesi",
    "Tiflis Şubesi",
    "Ankara Şubesi"
  ];

  const partPool = [
    { category: "Fren Sistemi", tr: "Ön Fren Balatası", en: "Front Brake Pads", de: "Bremsbeläge vorne", ru: "Передние тормозные колодки", ka: "წინა სამუხრუჭე ხუნდები", prefix: "BAL-ON" },
    { category: "Fren Sistemi", tr: "Arka Fren Balatası", en: "Rear Brake Pads", de: "Bremsbeläge hinten", ru: "Задние тормозные колодки", ka: "უკანა სამუხრუჭე ხუნდები", prefix: "BAL-ARK" },
    { category: "Fren Sistemi", tr: "Fren Diski Takımı", en: "Brake Disc Set", de: "Bremsscheiben-Satz", ru: "Комплект тормозных дисков", ka: "სამუხრუჭე დისკების კომპლექტი", prefix: "DISK" },
    { category: "Motor Parçaları", tr: "Silindir Kapak Contası", en: "Cylinder Head Gasket", de: "Zylinderkopfdichtung", ru: "Прокладка головки блока цилиндров", ka: "ცილინდრის თავის შუასადები", prefix: "CONTA" },
    { category: "Motor Parçaları", tr: "Triger Kayış Seti", prefix: "TRIGER", en: "Timing Belt Set", de: "Zahnriemensatz", ru: "Комплект ремня ГРМ", ka: "კბილანა ღვედის კომპლექტი" },
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

  const shelves = ["A0101", "A0102", "A0201", "B0101", "B0102", "C0101"];

  const products = [];

  brands.forEach(b => {
    // Generate exactly 4 products per brand
    for (let i = 1; i <= 4; i++) {
      const part = partPool[(i - 1) % partPool.length];
      const model = b.models[(i - 1) % b.models.length];
      
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
      const quantityVal = 10;

      const warehouse = warehouses[(i - 1) % warehouses.length];
      const shelf = ""; // All unplaced
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
        warehouse,
        shelf,
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

  return products;
}

async function run() {
  console.log("=== STARTING SUPABASE SEED FOR OZGUR MOTOR ===");

  // 1. Ensure Company 'ozgur-motor' exists
  let { data: company, error: compErr } = await supabase
    .from('companies')
    .select('id')
    .eq('code', 'ozgur-motor')
    .single();

  if (compErr || !company) {
    console.log("Company 'ozgur-motor' not found. Creating it...");
    const { data: newComp, error: createCompErr } = await supabase
      .from('companies')
      .insert({
        name: OZGUR_MOTOR_STORE.name,
        code: OZGUR_MOTOR_STORE.code,
        default_language: 'tr',
        main_currency: 'GEL',
        phone: OZGUR_MOTOR_STORE.phone,
        whatsapp: OZGUR_MOTOR_STORE.phone,
        email: OZGUR_MOTOR_STORE.email,
        address: OZGUR_MOTOR_STORE.address,
        is_customer_portal_active: true,
        is_public_search_enabled: true
      })
      .select('id')
      .single();

    if (createCompErr || !newComp) {
      console.error("Failed to create company without city:", createCompErr);
      return;
    }
    company = newComp;
    console.log("Company 'ozgur-motor' created successfully with ID:", company.id);
  } else {
    console.log("Company 'ozgur-motor' already exists with ID:", company.id);
  }

  // 2. Clear old warehouses & locations & stocks for this company to prevent duplicates
  const { data: existingWhs } = await supabase
    .from('warehouses')
    .select('id')
    .eq('company_id', company.id);

  if (existingWhs && existingWhs.length > 0) {
    const whIds = existingWhs.map(w => w.id);
    console.log(`Clearing warehouse locations for existing warehouses: ${whIds.join(', ')}`);
    await supabase.from('warehouse_locations').delete().in('warehouse_id', whIds);
    await supabase.from('warehouses').delete().eq('company_id', company.id);
  }

  // 3. Create Warehouses & Locations
  console.log("Creating warehouses & shelves...");
  const whMap = {}; // mapping from warehouse name to DB id
  const shelfMap = {}; // mapping from "warehouseName|shelfName" to DB id
  for (const wh of OZGUR_MOTOR_STORE.warehouses) {
    const { data: whData, error: whCreateErr } = await supabase
      .from('warehouses')
      .insert({
        company_id: company.id,
        name: wh.name,
        type: 'store',
        address: wh.city,
        is_sales_enabled: true,
        is_transfer_enabled: true
      })
      .select('id')
      .single();

    if (whCreateErr || !whData) {
      console.error(`Failed to create warehouse ${wh.name}:`, whCreateErr);
      continue;
    }

    whMap[wh.name] = whData.id;
    console.log(`Created warehouse: ${wh.name} -> ID: ${whData.id}`);

    // Insert shelves
    const locationsToInsert = wh.shelves.map(sh => ({
      warehouse_id: whData.id,
      name: sh,
      sort_order: 10
    }));

    const { data: locData, error: locErr } = await supabase
      .from('warehouse_locations')
      .insert(locationsToInsert)
      .select('id, name');

    if (locErr || !locData) {
      console.error(`Failed to create shelves for ${wh.name}:`, locErr);
    } else {
      console.log(`Created ${locData.length} shelves for ${wh.name}`);
      locData.forEach(loc => {
        shelfMap[`${wh.name}|${loc.name}`] = loc.id;
      });
    }
  }

  // 4. Delete existing products for this company
  // Find products to delete them and their stocks first
  const { data: existingProds } = await supabase
    .from('offerable_items')
    .select('id')
    .eq('company_id', company.id);

  if (existingProds && existingProds.length > 0) {
    const prodIds = existingProds.map(p => p.id);
    console.log(`Clearing product stocks for existing products...`);
    await supabase.from('product_stocks').delete().in('product_id', prodIds);
    await supabase.from('offerable_items').delete().eq('company_id', company.id);
  }

  // 5. Seed 800 products and their stocks
  console.log("Generating products...");
  const rawProducts = generateOzgurMotorProducts();
  console.log(`Generating ${rawProducts.length} products to seed...`);

  const batchSize = 50;
  for (let i = 0; i < rawProducts.length; i += batchSize) {
    const batch = rawProducts.slice(i, i + batchSize);
    const dbPayload = batch.map(p => ({
      company_id: company.id,
      type: 'product',
      name: p.name,
      category: p.category,
      brand: p.brand,
      description: p.description,
      sale_price: parseFloat(p.salePrice) || 0,
      purchase_price: parseFloat(p.purchasePrice) || 0,
      currency: p.currency,
      barcode: p.barcode,
      qr_code: p.qrCode,
      code: p.sku,
      photo_urls: [p.imageUrl],
      is_visible_in_storefront: true
    }));

    const { data: insertedProds, error: insertErr } = await supabase
      .from('offerable_items')
      .insert(dbPayload)
      .select('id, code');

    if (insertErr || !insertedProds) {
      console.error(`Error seeding batch ${i / batchSize + 1}:`, insertErr);
    } else {
      console.log(`Seeded batch ${i / batchSize + 1} (${dbPayload.length} products)`);
      
      // Insert product_stocks for the inserted products
      const stockPayload = [];
      insertedProds.forEach(dbProd => {
        const rawProd = batch.find(p => p.sku === dbProd.code);
        if (rawProd) {
          const whId = whMap[rawProd.warehouse];
          const shelfId = shelfMap[`${rawProd.warehouse}|${rawProd.shelf}`];
          if (whId) {
            stockPayload.push({
              product_id: dbProd.id,
              warehouse_id: whId,
              location_id: shelfId || null,
              status: 'available',
              quantity: parseFloat(rawProd.quantity) || 0
            });
          }
        }
      });

      if (stockPayload.length > 0) {
        const { error: stockErr } = await supabase
          .from('product_stocks')
          .insert(stockPayload);
        if (stockErr) {
          console.error("Error seeding stock levels:", stockErr);
        } else {
          console.log(`Seeded ${stockPayload.length} stock levels`);
        }
      }
    }
  }

  console.log("=== SUPABASE SEED COMPLETED SUCCESSFULLY ===");
}

run();
