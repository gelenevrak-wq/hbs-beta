"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

const demoProducts: Product[] = [
  {
    id: "product-001",
    name: "Ford Escape Fren Balatası",
    barcode: "8690000000011",
    sku: "FR-BALATA-ESCAPE-001",
    oemCode: "FORD-OEM-ESC-BR-001",
    currentStock: 12,
    warehouse: "Ana Depo",
    shelf: "A-01",
  },
  {
    id: "product-002",
    name: "Toyota Corolla Yağ Filtresi",
    barcode: "8690000000028",
    sku: "FR-FILTRE-COROLLA-002",
    oemCode: "TOYOTA-OEM-COR-FLT-002",
    currentStock: 30,
    warehouse: "Ana Depo",
    shelf: "B-04",
  },
  {
    id: "product-003",
    name: "Universal Buji Seti",
    barcode: "8690000000042",
    sku: "FR-BUJI-SET-004",
    oemCode: "",
    currentStock: 6,
    warehouse: "Ana Depo",
    shelf: "C-02",
  },
];

const initialMovements: StockMovement[] = [
  {
    id: "mov-001",
    productName: "Ford Escape Fren Balatası",
    productCode: "FR-BALATA-ESCAPE-001",
    movementType: "stock_in",
    quantity: 5,
    warehouse: "Ana Depo",
    shelf: "A-01",
    note: "Tedarikçiden gelen ürün girişi.",
    createdAt: "Bugün 09:30",
  },
  {
    id: "mov-002",
    productName: "Toyota Corolla Yağ Filtresi",
    productCode: "FR-FILTRE-COROLLA-002",
    movementType: "sale",
    quantity: 2,
    warehouse: "Ana Depo",
    shelf: "B-04",
    note: "Müşteri siparişi için stok çıkışı.",
    createdAt: "Bugün 11:10",
  },
];

function movementTypeText(type: MovementType) {
  switch (type) {
    case "stock_in":
      return "Stok Girişi";
    case "stock_out":
      return "Stok Çıkışı";
    case "sale":
      return "Satış";
    case "return":
      return "İade";
    case "waste":
      return "Fire / Hatalı Ürün";
    case "transfer":
      return "Depo Transferi";
    case "manual_adjustment":
      return "Manuel Düzeltme";
  }
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
  const [availableWarehouses, setAvailableWarehouses] = useState<any[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    // 1. Load products
    const savedProducts = window.localStorage.getItem("hbs-store-products");
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map((p: any) => ({
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

    // 2. Load movements
    const savedMovements = window.localStorage.getItem("hbs-store-stock-movements");
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

    // 3. Load warehouses map
    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const storeSlug = currentUser.storeSlugs?.[0];
        if (storeSlug) {
          const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
          const myStore = registeredStores.find((s: any) => s.code === storeSlug);
          if (myStore && myStore.warehouses) {
            setAvailableWarehouses(myStore.warehouses);
            if (myStore.warehouses.length > 0) {
              setWarehouse(myStore.warehouses[0].name);
              if (myStore.warehouses[0].shelves && myStore.warehouses[0].shelves.length > 0) {
                setShelf(myStore.warehouses[0].shelves[0]);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Error loading warehouse maps for stock movements", e);
    }
    setProductsLoaded(true);
  }, []);

  useEffect(() => {
    if (!productsLoaded) return;
    window.localStorage.setItem("hbs-store-stock-movements", JSON.stringify(movements));
  }, [movements, productsLoaded]);

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
      setMessage("Lütfen barkod, SKU, OEM kodu veya ürün adı girin.");
      return;
    }

    const foundProduct = findProductByCode(codeInput);

    if (!foundProduct) {
      setSelectedProduct(null);
      setMessage(
        "Bu kodla eşleşen ürün bulunamadı. Gerçek sistemde buradan yeni ürün kaydı başlatılabilir."
      );
      return;
    }

    setSelectedProduct(foundProduct);
    setWarehouse(foundProduct.warehouse);
    setShelf(foundProduct.shelf);
    setMessage(`${foundProduct.name} bulundu. Stok işlemi yapılabilir.`);
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
      setMessage("Önce ürün seçin veya barkod/SKU/OEM kodu ile ürün bulun.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!parsedQuantity || parsedQuantity <= 0) {
      setMessage("Geçerli bir miktar girin.");
      return;
    }

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
      setMessage("Stok miktarı eksiye düşemez. İşlem iptal edildi.");
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
      productName: selectedProduct.name,
      productCode: selectedProduct.sku || selectedProduct.barcode,
      movementType,
      quantity: parsedQuantity,
      warehouse,
      shelf,
      note,
      createdAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + " (Bugün)",
    };

    setMovements((currentMovements) => [movement, ...currentMovements]);

    // Update quantity in hbs-store-products local storage
    try {
      const savedProducts = window.localStorage.getItem("hbs-store-products");
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
          window.localStorage.setItem("hbs-store-products", JSON.stringify(updatedRecords));
        }
      }
    } catch (e) {
      console.error("Error updating product quantity in localStorage", e);
    }

    setQuantity("");
    setNote("");
    setMessage(
      `${selectedProduct.name} için stok işlemi kaydedildi. Yeni stok: ${newStock}`
    );
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
              Ürün Yönetimi
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Panel
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Ana Sayfa
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                STOK GİRİŞ / ÇIKIŞ
              </p>

              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                Depo ve Stok Hareketleri
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                Mağaza ürünlerinde stok girişi, satış çıkışı, iade, fire, depo
                transferi ve manuel düzeltme işlemlerini yönetin. Barkod,
                QR, SKU veya OEM kodu ile ürün hızlıca bulunabilir.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
              <h2 className="text-lg font-black text-blue-100">
                Barkod okuyucu uyumu
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100/90">
                Harici USB/Bluetooth barkod okuyucular genellikle klavye gibi
                çalışır. Barkod alanı aktifken kodu yazar ve Enter gönderir.
                Bu ekran bu mantığa uygun tasarlanmıştır.
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
            <h2 className="text-2xl font-black">Stok İşlemi Oluştur</h2>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">
                  Barkod / QR / SKU / OEM / Ürün Adı
                </span>
                <input
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value)}
                  onKeyDown={handleCodeKeyDown}
                  placeholder="Okuyucu ile okutun veya elle yazın"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                />
              </label>

              <button
                type="button"
                onClick={handleCodeSearch}
                className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-200"
              >
                Ürünü Bul
              </button>

              {selectedProduct && (
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <h3 className="text-lg font-black text-emerald-100">
                    {selectedProduct.name}
                  </h3>

                  <div className="mt-3 grid gap-2 text-sm text-emerald-100/90">
                    <p>
                      <span className="font-bold text-white">Barkod:</span>{" "}
                      {selectedProduct.barcode}
                    </p>
                    <p>
                      <span className="font-bold text-white">SKU:</span>{" "}
                      {selectedProduct.sku}
                    </p>
                    <p>
                      <span className="font-bold text-white">OEM:</span>{" "}
                      {selectedProduct.oemCode || "-"}
                    </p>
                    <p>
                      <span className="font-bold text-white">Mevcut Stok:</span>{" "}
                      {selectedProduct.currentStock}
                    </p>
                    <p>
                      <span className="font-bold text-white">Depo / Raf:</span>{" "}
                      {selectedProduct.warehouse} / {selectedProduct.shelf}
                    </p>
                  </div>
                </div>
              )}

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">İşlem Türü</span>
                <select
                  value={movementType}
                  onChange={(event) =>
                    setMovementType(event.target.value as MovementType)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                >
                  <option value="stock_in">Stok Girişi</option>
                  <option value="stock_out">Stok Çıkışı</option>
                  <option value="sale">Satış</option>
                  <option value="return">İade</option>
                  <option value="waste">Fire / Hatalı Ürün</option>
                  <option value="transfer">Depo Transferi</option>
                  <option value="manual_adjustment">Manuel Düzeltme</option>
                </select>
              </label>

              <div className="grid gap-5 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Miktar</span>
                  <input
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    type="number"
                    placeholder="Örn: 5"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Depo</span>
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
                      placeholder="Ana Depo"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                    />
                  )}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Raf / Konum</span>
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
                        <option value="" className="bg-slate-950 text-white">Raf Konumu Yok</option>
                      )}
                    </select>
                  ) : (
                    <input
                      value={shelf}
                      onChange={(event) => setShelf(event.target.value)}
                      placeholder="A-01"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                    />
                  )}
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Not</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={4}
                  placeholder="İşlem açıklaması, tedarikçi, müşteri veya düzeltme nedeni"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                />
              </label>

              <button
                type="button"
                onClick={createMovement}
                className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-200"
              >
                Stok İşlemini Kaydet
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
              <h2 className="text-2xl font-black">Stok Hareketleri</h2>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ürün, kod, depo, raf veya not ara"
                className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
              />

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
                        {movementTypeText(movement.movementType)}
                      </span>

                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                        {movement.createdAt}
                      </span>
                    </div>

                    <h3 className="text-lg font-black">
                      {movement.productName}
                    </h3>

                    <div className="mt-4 grid gap-2 text-sm text-slate-300">
                      <p>
                        <span className="font-bold text-white">Kod:</span>{" "}
                        {movement.productCode}
                      </p>

                      <p>
                        <span className="font-bold text-white">Miktar:</span>{" "}
                        {movement.quantity}
                      </p>

                      <p>
                        <span className="font-bold text-white">Depo/Raf:</span>{" "}
                        {movement.warehouse} / {movement.shelf}
                      </p>

                      <p>
                        <span className="font-bold text-white">Not:</span>{" "}
                        {movement.note || "-"}
                      </p>
                    </div>
                  </article>
                ))}

                {filteredMovements.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                    Bu aramaya uygun stok hareketi bulunamadı.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-amber-100">
                Gerçek veri bağlantısı
              </h2>

              <p className="mt-3 text-sm leading-6 text-amber-100/90">
                Bu ekran şimdilik demo ürünlerle çalışır. Veritabanı
                bağlandığında stok hareketleri ürün kaydına, depo konumuna,
                kullanıcıya, siparişe ve cari hesaba bağlanacaktır.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}