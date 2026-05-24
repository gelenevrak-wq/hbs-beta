"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";

type ItemType = "product" | "service" | "rental" | "appointment";
type Visibility = "visible" | "hidden";

type ProductRecord = {
  id: string;
  itemType: ItemType;
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
  visibility: Visibility;
};

const texts = {
  tr: {
    home: "Ana Sayfa",
    dashboard: "Panel",
    storefront: "Mağaza Vitrini",
    eyebrow: "ÜRÜN / HİZMET YÖNETİMİ",
    title: "Ürün, Hizmet ve Stok Yönetimi",
    description:
      "Mağazanızda satılan fiziksel ürünleri, hizmetleri, kiralama seçeneklerini ve randevulu işlemleri HBS üzerinden yönetin.",
    cleanTitle: "Gerçek veri prensibi",
    cleanText:
      "Bu ekranda sahte satış veya gerçek olmayan finansal veri gösterilmez. Demo kayıtlar yalnızca ekran akışını göstermek içindir.",
    formTitle: "Yeni Kayıt",
    listTitle: "Kayıtlı Ürün / Hizmetler",
    search: "Ürün, barkod, SKU, OEM veya kategori ara",
    itemType: "Kayıt Türü",
    product: "Fiziksel Ürün",
    service: "Hizmet",
    rental: "Kiralama / Rezervasyon",
    appointment: "Randevulu Hizmet",
    name: "Ürün / Hizmet Adı",
    namePlaceholder: "Örn: Ford Escape Fren Balatası",
    category: "Kategori",
    categoryPlaceholder: "Örn: Oto yedek parça",
    brand: "Marka",
    brandPlaceholder: "Örn: Ford, Toyota, Bosch",
    model: "Model / Uyum",
    modelPlaceholder: "Örn: Escape 2017-2020",
    descriptionLabel: "Açıklama",
    descriptionPlaceholder:
      "Müşterinin göreceği kısa açıklamayı yazın",
    salePrice: "Satış Fiyatı",
    purchasePrice: "Alış Fiyatı",
    pricePlaceholder: "Fiyat girin",
    currency: "Para Birimi",
    barcode: "Barkod",
    barcodePlaceholder: "Ürün barkodu",
    qrCode: "QR Kod",
    qrCodePlaceholder: "Varsa QR kod içeriği",
    sku: "SKU / Stok Kodu",
    skuPlaceholder: "Örn: FR-BALATA-ESCAPE-001",
    oemCode: "OEM Kodu",
    oemPlaceholder: "Örn: FORD-OEM-ESC-BR-001",
    manufacturerCode: "Üretici Parça Kodu",
    manufacturerPlaceholder: "Üretici kodu / alternatif parça kodu",
    stockTracking: "Stok Takibi",
    stockTrackingText:
      "Fiziksel ürünlerde stok takibi yapılır. Hizmetlerde stok yerine kapasite, süre veya randevu takibi kullanılabilir.",
    stockOn: "Stok takibi açık",
    stockOff: "Stok takibi kapalı",
    quantity: "Stok Miktarı",
    quantityPlaceholder: "Örn: 10",
    warehouse: "Depo",
    warehousePlaceholder: "Örn: Ana Depo",
    shelf: "Raf / Konum",
    shelfPlaceholder: "Örn: A-01",
    visibility: "Müşteri Portalında Görünürlük",
    visible: "Görünür",
    hidden: "Gizli",
    submit: "Kaydı Oluştur",
    media: "Fotoğraf / Video",
    mediaText:
      "Ürün veya hizmet için çoklu fotoğraf ve video yükleme alanı burada olacak. Gerçek dosya yükleme sistemi sonraki aşamada bağlanacaktır.",
    barcodeDeviceNoteTitle: "Barkod okuyucu uyumu",
    barcodeDeviceNote:
      "Bu alanlar telefon kamerası, USB barkod okuyucu, Bluetooth barkod okuyucu ve manuel kod girişiyle uyumlu tasarlanacaktır. Harici okuyucular barkod alanına kodu yazıp Enter gönderebilir.",
    emptyTitle: "Henüz kayıt yok",
    emptyText:
      "İlk gerçek ürün veya hizmet kaydı oluşturulduğunda burada listelenecek.",
    noteTitle: "Sonraki aşama",
    noteText:
      "Gerçek veritabanı, fotoğraf/video yükleme, ürün varyantları, depo haritası, stok hareketleri ve müşteri vitrin bağlantısı sırayla bağlanacaktır.",
    saveMessage: "Kayıt demo olarak listeye eklendi. Gerçek veritabanı bağlantısı sonraki aşamada yapılacak.",
  },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return (
    value === "tr" ||
    value === "en" ||
    value === "ru" ||
    value === "ka" ||
    value === "de"
  );
}

function itemTypeLabel(itemType: ItemType, currentText: typeof texts.tr) {
  switch (itemType) {
    case "product":
      return currentText.product;
    case "service":
      return currentText.service;
    case "rental":
      return currentText.rental;
    case "appointment":
      return currentText.appointment;
  }
}

const initialProducts: ProductRecord[] = [
  {
    id: "product-001",
    itemType: "product",
    name: "Ford Escape Fren Balatası",
    category: "Oto Yedek Parça",
    brand: "Ford",
    model: "Escape",
    description: "Ford Escape uyumlu ön fren balatası.",
    salePrice: "75",
    purchasePrice: "45",
    currency: "GEL",
    barcode: "8690000000011",
    qrCode: "HBS-FERRO-BALATA-001",
    sku: "FR-BALATA-ESCAPE-001",
    oemCode: "FORD-OEM-ESC-BR-001",
    manufacturerCode: "MFG-BR-001",
    stockTracking: true,
    quantity: "12",
    warehouse: "Ana Depo",
    shelf: "A-01",
    visibility: "visible",
  },
  {
    id: "product-002",
    itemType: "product",
    name: "Toyota Corolla Yağ Filtresi",
    category: "Filtre",
    brand: "Toyota",
    model: "Corolla",
    description: "Toyota Corolla uyumlu yağ filtresi.",
    salePrice: "22",
    purchasePrice: "12",
    currency: "GEL",
    barcode: "8690000000028",
    qrCode: "HBS-FERRO-FILTRE-002",
    sku: "FR-FILTRE-COROLLA-002",
    oemCode: "TOYOTA-OEM-COR-FLT-002",
    manufacturerCode: "MFG-FLT-002",
    stockTracking: true,
    quantity: "30",
    warehouse: "Ana Depo",
    shelf: "B-04",
    visibility: "visible",
  },
];

export default function ProductsPage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);

  const [itemType, setItemType] = useState<ItemType>("product");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currency, setCurrency] = useState("GEL");
  const [barcode, setBarcode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [sku, setSku] = useState("");
  const [oemCode, setOemCode] = useState("");
  const [manufacturerCode, setManufacturerCode] = useState("");
  const [stockTracking, setStockTracking] = useState(true);
  const [quantity, setQuantity] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [shelf, setShelf] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("visible");
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
  }, []);

  const currentText = texts.tr;

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((product) => {
      return (
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.model.toLowerCase().includes(q) ||
        product.barcode.toLowerCase().includes(q) ||
        product.qrCode.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.oemCode.toLowerCase().includes(q) ||
        product.manufacturerCode.toLowerCase().includes(q)
      );
    });
  }, [products, search]);

  if (!language) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  function resetForm() {
    setItemType("product");
    setName("");
    setCategory("");
    setBrand("");
    setModel("");
    setDescription("");
    setSalePrice("");
    setPurchasePrice("");
    setCurrency("GEL");
    setBarcode("");
    setQrCode("");
    setSku("");
    setOemCode("");
    setManufacturerCode("");
    setStockTracking(true);
    setQuantity("");
    setWarehouse("");
    setShelf("");
    setVisibility("visible");
  }

  function createProduct() {
    if (!name.trim() || !category.trim()) {
      setMessage("Ürün/hizmet adı ve kategori zorunludur.");
      return;
    }

    const newProduct: ProductRecord = {
      id: `product-${Date.now()}`,
      itemType,
      name,
      category,
      brand,
      model,
      description,
      salePrice,
      purchasePrice,
      currency,
      barcode,
      qrCode,
      sku,
      oemCode,
      manufacturerCode,
      stockTracking,
      quantity: stockTracking ? quantity : "",
      warehouse,
      shelf,
      visibility,
    };

    setProducts((currentProducts) => [newProduct, ...currentProducts]);
    setMessage(currentText.saveMessage);
    resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-black tracking-wide">
            HBS
          </Link>

          <div className="flex items-center gap-3">
            <CompactLanguageSwitcher />

            <Link
              href="/store/ferro-motors"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {currentText.storefront}
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {currentText.dashboard}
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {currentText.home}
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                {currentText.eyebrow}
              </p>

              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                {currentText.title}
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                {currentText.description}
              </p>
            </div>

            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
              <h2 className="text-lg font-black text-amber-100">
                {currentText.cleanTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-amber-100/90">
                {currentText.cleanText}
              </p>
            </div>
          </div>
        </section>

        {message && (
          <div className="mb-6 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5 text-sm leading-6 text-blue-100">
            {message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <h2 className="text-2xl font-black">{currentText.formTitle}</h2>

            <form className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  {currentText.itemType}
                </label>
                <select
                  value={itemType}
                  onChange={(event) => setItemType(event.target.value as ItemType)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                >
                  <option value="product">{currentText.product}</option>
                  <option value="service">{currentText.service}</option>
                  <option value="rental">{currentText.rental}</option>
                  <option value="appointment">{currentText.appointment}</option>
                </select>
              </div>

              <InputBlock
                label={currentText.name}
                value={name}
                onChange={setName}
                placeholder={currentText.namePlaceholder}
              />

              <InputBlock
                label={currentText.category}
                value={category}
                onChange={setCategory}
                placeholder={currentText.categoryPlaceholder}
              />

              <InputBlock
                label={currentText.brand}
                value={brand}
                onChange={setBrand}
                placeholder={currentText.brandPlaceholder}
              />

              <InputBlock
                label={currentText.model}
                value={model}
                onChange={setModel}
                placeholder={currentText.modelPlaceholder}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  {currentText.descriptionLabel}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={currentText.descriptionPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                />
              </div>

              <InputBlock
                label={currentText.salePrice}
                value={salePrice}
                onChange={setSalePrice}
                placeholder={currentText.pricePlaceholder}
              />

              <InputBlock
                label={currentText.purchasePrice}
                value={purchasePrice}
                onChange={setPurchasePrice}
                placeholder={currentText.pricePlaceholder}
              />

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  {currentText.currency}
                </label>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                >
                  <option>GEL</option>
                  <option>TRY</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>RUB</option>
                </select>
              </div>

              <InputBlock
                label={currentText.barcode}
                value={barcode}
                onChange={setBarcode}
                placeholder={currentText.barcodePlaceholder}
              />

              <InputBlock
                label={currentText.qrCode}
                value={qrCode}
                onChange={setQrCode}
                placeholder={currentText.qrCodePlaceholder}
              />

              <InputBlock
                label={currentText.sku}
                value={sku}
                onChange={setSku}
                placeholder={currentText.skuPlaceholder}
              />

              <InputBlock
                label={currentText.oemCode}
                value={oemCode}
                onChange={setOemCode}
                placeholder={currentText.oemPlaceholder}
              />

              <InputBlock
                label={currentText.manufacturerCode}
                value={manufacturerCode}
                onChange={setManufacturerCode}
                placeholder={currentText.manufacturerPlaceholder}
              />

              <div className="md:col-span-2 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <h3 className="font-black">{currentText.stockTracking}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {currentText.stockTrackingText}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setStockTracking(true)}
                    className={`rounded-2xl px-5 py-3 font-black transition ${
                      stockTracking
                        ? "bg-emerald-400 text-slate-950"
                        : "border border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    {currentText.stockOn}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStockTracking(false)}
                    className={`rounded-2xl px-5 py-3 font-black transition ${
                      !stockTracking
                        ? "bg-emerald-400 text-slate-950"
                        : "border border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    {currentText.stockOff}
                  </button>
                </div>

                {stockTracking && (
                  <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <InputBlock
                      label={currentText.quantity}
                      value={quantity}
                      onChange={setQuantity}
                      placeholder={currentText.quantityPlaceholder}
                    />

                    <InputBlock
                      label={currentText.warehouse}
                      value={warehouse}
                      onChange={setWarehouse}
                      placeholder={currentText.warehousePlaceholder}
                    />

                    <InputBlock
                      label={currentText.shelf}
                      value={shelf}
                      onChange={setShelf}
                      placeholder={currentText.shelfPlaceholder}
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <h3 className="font-black">{currentText.media}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {currentText.mediaText}
                </p>
              </div>

              <div className="md:col-span-2 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                <h3 className="font-black text-blue-100">
                  {currentText.barcodeDeviceNoteTitle}
                </h3>
                <p className="mt-2 text-sm leading-6 text-blue-100/90">
                  {currentText.barcodeDeviceNote}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  {currentText.visibility}
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setVisibility("visible")}
                    className={`rounded-2xl px-5 py-3 font-black transition ${
                      visibility === "visible"
                        ? "bg-white text-slate-950"
                        : "border border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    {currentText.visible}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility("hidden")}
                    className={`rounded-2xl px-5 py-3 font-black transition ${
                      visibility === "hidden"
                        ? "bg-white text-slate-950"
                        : "border border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    {currentText.hidden}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={createProduct}
                  className="w-full rounded-2xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-200"
                >
                  {currentText.submit}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
              <h2 className="text-2xl font-black">{currentText.listTitle}</h2>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={currentText.search}
                className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
              />

              <div className="mt-5 grid gap-4">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                  >
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-200">
                        {itemTypeLabel(product.itemType, currentText)}
                      </span>

                      <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-bold text-blue-200">
                        {product.visibility === "visible"
                          ? currentText.visible
                          : currentText.hidden}
                      </span>
                    </div>

                    <h3 className="text-lg font-black">{product.name}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {product.description || product.category}
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-300">
                      <p>
                        <span className="font-bold text-white">Kategori:</span>{" "}
                        {product.category}
                      </p>
                      <p>
                        <span className="font-bold text-white">Marka/Model:</span>{" "}
                        {product.brand || "-"} / {product.model || "-"}
                      </p>
                      <p>
                        <span className="font-bold text-white">Satış:</span>{" "}
                        {product.salePrice || "-"} {product.currency}
                      </p>
                      <p>
                        <span className="font-bold text-white">Stok:</span>{" "}
                        {product.stockTracking ? product.quantity || "0" : "Kapalı"}
                      </p>
                      <p>
                        <span className="font-bold text-white">Depo/Raf:</span>{" "}
                        {product.warehouse || "-"} / {product.shelf || "-"}
                      </p>
                      <p>
                        <span className="font-bold text-white">Barkod:</span>{" "}
                        {product.barcode || "-"}
                      </p>
                      <p>
                        <span className="font-bold text-white">SKU:</span>{" "}
                        {product.sku || "-"}
                      </p>
                      <p>
                        <span className="font-bold text-white">OEM:</span>{" "}
                        {product.oemCode || "-"}
                      </p>
                    </div>
                  </article>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="font-black">{currentText.emptyTitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {currentText.emptyText}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-400/20 bg-blue-400/10 p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-blue-100">
                {currentText.noteTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-blue-100/90">
                {currentText.noteText}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputBlock({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
      />
    </div>
  );
}