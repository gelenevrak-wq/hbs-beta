"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";
import AICopilotTooltip from "@/components/common/AICopilotTooltip";

type ItemType = "product" | "service" | "rental" | "appointment";
type Visibility = "visible" | "hidden";
type PricingMode = "fixed" | "quote" | "bidding";

type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  purchasePrice: string;
  salePrice: string;
  quantity: string;
  warehouse: string;
  shelf: string;
};

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
  entryDate: string;
  exitDate: string;
  pricingMode: PricingMode;
  visibility: Visibility;
  imageUrl: string;
  videoUrl: string;
  variants?: ProductVariant[];
};

const INITIAL_PRODUCTS: ProductRecord[] = [];

export default function ProductsPage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);

  // Form Fields
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
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [pricingMode, setPricingMode] = useState<PricingMode>("fixed");
  const [visibility, setVisibility] = useState<Visibility>("visible");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [productsLoaded, setProductsLoaded] = useState(false);
  const [products, setProducts] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [availableWarehouses, setAvailableWarehouses] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage((savedLanguage as LanguageCode) || "tr");

    const savedProducts = window.localStorage.getItem("hbs-store-products");
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts) as ProductRecord[];
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
        }
      } catch {
        setProducts(INITIAL_PRODUCTS);
      }
    }
    setProductsLoaded(true);

    // Load logged in store warehouses
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
            // Default select the first warehouse and its first shelf
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
      console.error("Error loading warehouse maps:", e);
    }
  }, []);

  useEffect(() => {
    if (!productsLoaded) return;
    window.localStorage.setItem("hbs-store-products", JSON.stringify(products));
  }, [products, productsLoaded]);

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
        product.oemCode.toLowerCase().includes(q)
      );
    });
  }, [products, search]);

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
    setEntryDate("");
    setExitDate("");
    setPricingMode("fixed");
    setVisibility("visible");
    setImageUrl("");
    setVideoUrl("");
    setVariants([]);
  }

  function handleProductImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Robust CSV Parser that handles nested double-quotes, quotes within fields, and line breaks safely.
  function parseCSV(text: string): string[][] {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentField = "";
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentField.trim());
        currentField = "";
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentField.trim());
        if (row.length > 0 && row.some(f => f !== "")) {
          lines.push(row);
        }
        row = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
    if (currentField || row.length > 0) {
      row.push(currentField.trim());
      if (row.some(f => f !== "")) {
        lines.push(row);
      }
    }
    return lines;
  }

  function downloadCSVTemplate() {
    const headers = [
      "Kayıt Türü", "Ürün Adı", "Kategori", "Marka", "Model", "Açıklama",
      "Satış Fiyatı", "Maliyet Fiyatı", "Para Birimi", "Barkod", "Karekod (QR)", "SKU",
      "OEM Kodu", "Stok Miktarı", "Depo Adı", "Raf Konumu", "Resim URL", "Video URL",
      "Varyantlar"
    ];
    const sampleRow = [
      "ürün", "Autel Diagnostik Cihazı", "Oto Diagnostik", "Autel", "MaxiSys Ultra",
      "Profesyonel arıza tespit cihazı", "3500", "2000", "GEL", "869000000100", "QR-AUTEL-001",
      "SKU-AUTEL-001", "OEM-AT-01", "5", "Ana Depo", "A-02",
      "/product-images/diagnostic-scanner.svg", "https://youtube.com/watch?v=demo",
      "Elite Model|SKU-AT-ELITE|869000000101|1200|2000|3|Ana Depo|A-12; Ultra Model|SKU-AT-ULTRA|869000000102|2000|3500|2|Ana Depo|A-13"
    ];

    // Premium Column widths for Excel
    const widths = [100, 220, 140, 100, 120, 260, 100, 100, 100, 140, 140, 140, 110, 100, 110, 100, 250, 250, 350];

    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>HBS Ürün Şablonu</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
                <x:DataValidation>
                  <x:Range>R2C1:R1000C1</x:Range>
                  <x:Type>List</x:Type>
                  <x:Value>&quot;ürün,hizmet,kiralık,randevu&quot;</x:Value>
                  <x:ErrorMessage>Lütfen listedeki geçerli kayıt türlerinden birini seçin (ürün, hizmet, kiralık, randevu).</x:ErrorMessage>
                  <x:ErrorTitle>Geçersiz Kayıt Türü</x:ErrorTitle>
                  <x:InputMessage>Geçerli bir kayıt türü seçin: ürün, hizmet, kiralık veya randevu.</x:InputMessage>
                  <x:InputTitle>Kayıt Türü</x:InputTitle>
                </x:DataValidation>
                <x:DataValidation>
                  <x:Range>R2C9:R1000C9</x:Range>
                  <x:Type>List</x:Type>
                  <x:Value>&quot;GEL,TRY,USD,EUR&quot;</x:Value>
                  <x:ErrorMessage>Lütfen listedeki geçerli para birimlerinden birini seçin (GEL, TRY, USD, EUR).</x:ErrorMessage>
                  <x:ErrorTitle>Geçersiz Para Birimi</x:ErrorTitle>
                  <x:InputMessage>Geçerli bir para birimi seçin: GEL, TRY, USD veya EUR.</x:InputMessage>
                  <x:InputTitle>Para Birimi</x:InputTitle>
                </x:DataValidation>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; }
          th { 
            background-color: #2563eb; 
            color: #ffffff; 
            font-weight: bold; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: left;
          }
          td { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 10pt;
            border: 1px solid #cbd5e1;
            padding: 6px;
            mso-number-format:"\\@"; /* Force Text Format to prevent scientific notation on barcodes */
          }
          .sample-row {
            background-color: #f8fafc;
            color: #475569;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map((h, i) => `<th style="width: ${widths[i]}px;">${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            <tr class="sample-row">
              ${sampleRow.map(cell => `<td>${cell}</td>`).join("")}
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create binary Blob of the Excel file
    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "hbs_urun_sablonu.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage("Excel ürün şablonu (.xls) geniş sütunlar, renkli başlıklar, açılır seçim listeleri (dropdown) ve özel biçimlendirmelerle indirildi.");
  }

  function handleCSVImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      try {
        let rows: string[][] = [];
        if (text.trim().startsWith("<") || text.includes("<table")) {
          // Parse HTML-based Excel spreadsheet natively using DOMParser
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          const trs = Array.from(doc.querySelectorAll("tr"));
          rows = trs.map(tr => 
            Array.from(tr.querySelectorAll("th, td")).map(cell => cell.textContent?.trim() || "")
          );
        } else {
          // Fallback to standard CSV parser
          rows = parseCSV(text);
        }

        if (rows.length > 0 && rows[0][0] && rows[0][0].toLowerCase().startsWith("sep=")) {
          rows.shift(); // Remove the Excel helper separator line
        }
        if (rows.length < 2) {
          setMessage("Hata: Dosya boş veya başlık satırı dışında veri içermiyor.");
          return;
        }
        
        const newProducts: ProductRecord[] = [];
        const headers = rows[0].map(h => h.toLowerCase().trim());
        
        const getIdx = (candidates: string[]) => {
          for (const cand of candidates) {
            const idx = headers.indexOf(cand.toLowerCase());
            if (idx !== -1) return idx;
          }
          return -1;
        };
        
        const typeIdx = getIdx(["kayıt türü", "kayitturu"]);
        const nameIdx = getIdx(["ürün adı", "urunadi"]);
        const catIdx = getIdx(["kategori"]);
        const brandIdx = getIdx(["marka"]);
        const modelIdx = getIdx(["model"]);
        const descIdx = getIdx(["açıklama", "aciklama"]);
        const salePriceIdx = getIdx(["satış fiyatı", "satisfiyati"]);
        const purchasePriceIdx = getIdx(["maliyet fiyatı", "maliyetfiyati"]);
        const curIdx = getIdx(["para birimi", "parabirimi"]);
        const barIdx = getIdx(["barkod"]);
        const qrIdx = getIdx(["karekod (qr)", "qrcode"]);
        const skuIdx = getIdx(["sku"]);
        const oemIdx = getIdx(["oem kodu", "oemkodu"]);
        const qtyIdx = getIdx(["stok miktarı", "stokmiktari"]);
        const whIdx = getIdx(["depo adı", "depoadi"]);
        const shelfIdx = getIdx(["raf konumu", "rafkonumu"]);
        const imgIdx = getIdx(["resim url", "resimurl"]);
        const vidIdx = getIdx(["video url", "videourl"]);
        const varIdx = getIdx(["varyantlar"]);
        
        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          if (row.length === 0 || !row[nameIdx]) continue;
          
          const pName = row[nameIdx] || "";
          const pCat = row[catIdx] || "Diğer";
          
          const varStr = varIdx !== -1 ? row[varIdx] : "";
          const parsedVariants: ProductVariant[] = [];
          
          if (varStr) {
            const variantParts = varStr.split(";");
            variantParts.forEach((part, vIdx) => {
              const tokens = part.split("|").map(t => t.trim());
              if (tokens[0]) {
                parsedVariants.push({
                  id: `var-${Date.now()}-${r}-${vIdx}`,
                  name: tokens[0],
                  sku: tokens[1] || "",
                  barcode: tokens[2] || "",
                  purchasePrice: tokens[3] || "",
                  salePrice: tokens[4] || "",
                  quantity: tokens[5] || "",
                  warehouse: tokens[6] || "",
                  shelf: tokens[7] || ""
                });
              }
            });
          }
          
          const rawType = (row[typeIdx] || "").trim().toLowerCase();
          let parsedType: ItemType = "product";
          if (rawType.includes("hizmet") || rawType === "service") {
            parsedType = "service";
          } else if (rawType.includes("kiral") || rawType === "rental") {
            parsedType = "rental";
          } else if (rawType.includes("randevu") || rawType === "appointment") {
            parsedType = "appointment";
          }

          const newP: ProductRecord = {
            id: `product-${Date.now()}-${r}`,
            itemType: parsedType,
            name: pName,
            category: pCat,
            brand: row[brandIdx] || "",
            model: row[modelIdx] || "",
            description: row[descIdx] || "",
            salePrice: row[salePriceIdx] || "",
            purchasePrice: row[purchasePriceIdx] || "",
            currency: row[curIdx] || "GEL",
            barcode: row[barIdx] || "",
            qrCode: row[qrIdx] || "",
            sku: row[skuIdx] || "",
            oemCode: row[oemIdx] || "",
            manufacturerCode: "",
            stockTracking: true,
            quantity: row[qtyIdx] || "",
            warehouse: row[whIdx] || "Ana Depo",
            shelf: row[shelfIdx] || "",
            entryDate: new Date().toISOString().split("T")[0],
            exitDate: "",
            pricingMode: row[salePriceIdx] ? "fixed" : "quote",
            visibility: "visible",
            imageUrl: row[imgIdx] || "/product-images/diagnostic-scanner.svg",
            videoUrl: row[vidIdx] || "",
            variants: parsedVariants.length > 0 ? parsedVariants : undefined
          };
          
          newProducts.push(newP);
        }
        
        if (newProducts.length > 0) {
          setProducts((current) => [...newProducts, ...current]);
          setMessage(`Başarılı! ${newProducts.length} adet ürün/varyant kataloğa toplu olarak aktarıldı.`);
        } else {
          setMessage("Hata: Dosyada eklenecek geçerli bir ürün satırı bulunamadı.");
        }
      } catch (e) {
        console.error("CSV import error:", e);
        setMessage("CSV dosyası okunurken hata oluştu. Lütfen formatı kontrol edin.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function addVariant() {
    setVariants([
      ...variants,
      {
        id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: "",
        sku: "",
        barcode: "",
        purchasePrice: "",
        salePrice: "",
        quantity: "",
        warehouse: warehouse || "Ana Depo",
        shelf: shelf || ""
      }
    ]);
  }

  function removeVariant(id: string) {
    setVariants(variants.filter(v => v.id !== id));
  }

  function updateVariantField(id: string, field: keyof ProductVariant, value: string) {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  }

  function startEditProduct(p: ProductRecord) {
    setEditingProductId(p.id);
    setItemType(p.itemType);
    setName(p.name);
    setCategory(p.category);
    setBrand(p.brand || "");
    setModel(p.model || "");
    setDescription(p.description || "");
    setSalePrice(p.salePrice || "");
    setPurchasePrice(p.purchasePrice || "");
    setCurrency(p.currency || "GEL");
    setBarcode(p.barcode || "");
    setQrCode(p.qrCode || "");
    setSku(p.sku || "");
    setOemCode(p.oemCode || "");
    setManufacturerCode(p.manufacturerCode || "");
    setStockTracking(p.stockTracking ?? true);
    setQuantity(p.quantity || "");
    setWarehouse(p.warehouse || "");
    setShelf(p.shelf || "");
    setEntryDate(p.entryDate || "");
    setExitDate(p.exitDate || "");
    setPricingMode(p.pricingMode || "fixed");
    setVisibility(p.visibility || "visible");
    setImageUrl(p.imageUrl || "");
    setVideoUrl(p.videoUrl || "");
    setVariants(p.variants || []);
    setMessage(`"${p.name}" düzenleme için forma yüklendi. Değişiklikleri yaptıktan sonra sayfanın altındaki butona basarak kaydedebilirsiniz.`);
  }

  async function deleteProduct(id: string, productName: string, productSku: string) {
    if (!window.confirm(`"${productName}" isimli ürünü silmek istediğinize emin misiniz?`)) {
      return;
    }

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("offerable_items")
          .delete()
          .or(`code.eq.${productSku},name.eq.${productName}`);
      } catch (err) {
        console.error("Supabase delete error:", err);
      }
    }

    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    setMessage(`"${productName}" başarıyla silindi.`);
    if (editingProductId === id) {
      setEditingProductId(null);
      resetForm();
    }
  }

  async function toggleVisibility(id: string) {
    const updatedProducts = products.map((p) => {
      if (p.id === id) {
        const nextVisibility: Visibility = p.visibility === "visible" ? "hidden" : "visible";
        
        const isSupabaseConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

        if (isSupabaseConfigured) {
          supabase
            .from("offerable_items")
            .update({
              is_visible_in_storefront: nextVisibility === "visible",
              is_visible_in_public_search: nextVisibility === "visible",
            })
            .or(`code.eq.${p.sku},name.eq.${p.name}`)
            .then(({ error }) => {
              if (error) console.error("Supabase toggle error:", error);
            });
        }

        return { ...p, visibility: nextVisibility };
      }
      return p;
    });

    setProducts(updatedProducts);
    const targetProduct = products.find(p => p.id === id);
    const isNowVisible = targetProduct?.visibility !== "visible";
    setMessage(`"${targetProduct?.name}" vitrin görünürlüğü "${isNowVisible ? "Vitrin ve Pazar Yerinde Açık" : "Gizli"}" olarak güncellendi.`);
  }

  async function saveProduct() {
    if (!name.trim() || !category.trim()) {
      setMessage("Ürün/hizmet adı ve kategori zorunludur.");
      return;
    }

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (editingProductId) {
      // EDIT MODE
      const updatedProducts = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            itemType,
            name,
            category,
            brand,
            model,
            description,
            salePrice: pricingMode === "fixed" ? salePrice : "",
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
            entryDate,
            exitDate,
            pricingMode,
            visibility,
            imageUrl: imageUrl.trim() || "/product-images/diagnostic-scanner.svg",
            videoUrl,
            variants: variants.length > 0 ? variants : undefined,
          };
        }
        return p;
      });

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from("offerable_items")
            .update({
              name,
              type: itemType === "product" ? "product" : itemType === "service" ? "service" : "rentable_asset",
              category,
              brand,
              code: sku || `SKU-${Date.now()}`,
              barcode,
              qr_code: qrCode,
              sale_price: pricingMode === "fixed" ? parseFloat(salePrice) || null : null,
              purchase_price: parseFloat(purchasePrice) || null,
              currency,
              description,
              photo_urls: [imageUrl.trim() || "/product-images/diagnostic-scanner.svg"],
              video_urls: [videoUrl],
              is_visible_in_storefront: visibility === "visible",
              is_visible_in_public_search: visibility === "visible",
            })
            .or(`code.eq.${sku},name.eq.${name}`);
        } catch (err) {
          console.error("Supabase update error:", err);
        }
      }

      setProducts(updatedProducts);
      setMessage("Kayıt başarıyla güncellendi! Veritabanı ve yerel hafıza senkronize edildi.");
      setEditingProductId(null);
      resetForm();
    } else {
      // CREATE MODE
      const newProduct: ProductRecord = {
        id: `product-${Date.now()}`,
        itemType,
        name,
        category,
        brand,
        model,
        description,
        salePrice: pricingMode === "fixed" ? salePrice : "",
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
        entryDate,
        exitDate,
        pricingMode,
        visibility,
        imageUrl: imageUrl.trim() || "/product-images/diagnostic-scanner.svg",
        videoUrl,
        variants: variants.length > 0 ? variants : undefined,
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from("offerable_items").insert({
            name,
            type: itemType === "product" ? "product" : itemType === "service" ? "service" : "rentable_asset",
            category,
            brand,
            code: sku || `SKU-${Date.now()}`,
            barcode,
            qr_code: qrCode,
            sale_price: pricingMode === "fixed" ? parseFloat(salePrice) || null : null,
            purchase_price: parseFloat(purchasePrice) || null,
            currency,
            description,
            photo_urls: [newProduct.imageUrl],
            video_urls: [videoUrl],
            is_visible_in_storefront: visibility === "visible",
            is_visible_in_public_search: visibility === "visible",
          });
        } catch (err) {
          console.error("Supabase saving error:", err);
        }
      }

      setProducts((currentProducts) => [newProduct, ...currentProducts]);
      setMessage("Kayıt başarıyla oluşturuldu! Veritabanı ve yerel hafıza güncellendi.");
      resetForm();
    }
  }

  if (!language) return <main className="min-h-screen bg-slate-950" />;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900 px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1850px]">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">HBS Ürün</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black"
            >
              Paneli Aç
            </Link>
          </div>
        </header>

        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Ürün & Hizmet Kataloğu</p>
          <h1 className="mt-1 text-xl font-black sm:text-3xl">Premium Ürün Ekleme ve Depo Konumlandırma</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Fotoğraf, tanıtım videoları, barkod/QR kodları ve depo raf adreslerini içeren zengin ürün profilleri oluşturun. Teklif/fiyat politikalarınızı belirleyin.
          </p>
        </section>

        {message && (
          <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black text-emerald-950">
            ✓ {message}
          </div>
        )}

        {/* Toplu Ürün İşlemleri (Excel / CSV) - Premium Panel */}
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-black text-blue-700 uppercase border border-blue-100">
                ⚡ HIZLI YÜKLEME SİSTEMİ
              </span>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                Toplu Ürün Aktarımı (Excel / CSV)
                <AICopilotTooltip fieldKey="batchImport" position="right" />
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Mağazanıza yüzlerce ürünü ve bunlara ait varyantları (örneğin OBDTR Autel cihazları veya tekstil bedenleri) tek bir hamlede ekleyin. Hazırladığımız şablonu indirin, doldurup geri yükleyin!
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 items-center shrink-0">
              <button
                type="button"
                onClick={downloadCSVTemplate}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5 animate-pulse"
              >
                <span>📥</span> Şablon İndir (Excel / CSV)
              </button>
              
              <label className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition shadow-sm cursor-pointer flex items-center gap-1.5">
                <span>📤</span> Dosyayı Geri Yükle
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <div className="mt-3.5 border-t border-slate-100 pt-3 flex gap-2 text-[10px] text-slate-400 font-bold leading-relaxed">
            <span className="text-blue-600 font-black">ℹ Varyant İpucu:</span>
            <span>Şablondaki en son "Varyantlar" sütununu kullanarak aynı ürüne ait birden fazla çeşidi (örneğin <code>Model|SKU|Barkod|AlışFiyatı|SatışFiyatı|Adet|Depo|Raf</code> formatında ve <code>;</code> ile ayırarak) tek satırda yükleyebilirsiniz.</span>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProduct();
            }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-black border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>{editingProductId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</span>
              {editingProductId && (
                <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  DÜZENLEME MODU
                </span>
              )}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  Kayıt Türü
                  <AICopilotTooltip fieldKey="itemType" position="right" />
                </span>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as ItemType)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                >
                  <option value="product">Fiziksel Ürün</option>
                  <option value="service">Hizmet satışı</option>
                  <option value="rental">Kiralama</option>
                  <option value="appointment">Randevulu İşlem</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Görünürlük</span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                >
                  <option value="visible">Vitrin ve Pazar Yerinde Açık</option>
                  <option value="hidden">Gizli</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Ürün / Hizmet Adı *</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: NGK Buji Seti"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Kategori / Sektör *</span>
                <input
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Örn: Oto yedek parçası"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Marka</span>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Örn: Bosch"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Uyumlu Model</span>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Örn: A4 / Golf 7"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-bold text-slate-500">Ürün Açıklaması</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Özellikler, uyumluluk bilgileri..."
                rows={2}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </label>

            {/* Price policy selector as requested */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                Fiyat & Teklif Politikası
                <AICopilotTooltip fieldKey="pricingMode" position="right" />
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPricingMode("fixed")}
                  className={`rounded-lg py-2 text-xs font-bold transition border ${pricingMode === "fixed" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                >
                  Fiyat Göster
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMode("quote")}
                  className={`rounded-lg py-2 text-xs font-bold transition border ${pricingMode === "quote" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                >
                  Teklif Alın
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMode("bidding")}
                  className={`rounded-lg py-2 text-xs font-bold transition border ${pricingMode === "bidding" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                >
                  Teklif Verin
                </button>
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                {pricingMode === "fixed" && "Müşteriler ürünü belirlediğiniz fiyattan sepete ekler."}
                {pricingMode === "quote" && "Fiyat gizlenir. Müşteriler 'Fiyat Teklifi İste' butonu ile sizden teklif toplar."}
                {pricingMode === "bidding" && "Müşteriler ürüne kendi iskonto ve adet bütçe hedeflerini teklif edebilir."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {pricingMode === "fixed" && (
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-500">Satış Fiyatı</span>
                  <input
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Fiyat"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                  />
                </label>
              )}

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Maliyet Fiyatı</span>
                <input
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Maliyet"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Para Birimi</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                >
                  <option>GEL</option>
                  <option>TRY</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </label>
            </div>

            {/* Media Upload & URLs */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Ürün Görseli (Dosya Yükle veya URL Gir)</span>
                {imageUrl ? (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-white">
                      <img src={imageUrl} alt="Önizleme" className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <input
                        value={imageUrl.startsWith("data:") ? "Görsel Dosyası Yüklendi (Base64)" : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Görsel bağlantısı"
                        className="w-full bg-transparent text-xs font-semibold outline-none text-slate-700 truncate"
                        title={imageUrl}
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="text-[10px] font-black text-rose-600 hover:text-rose-700 hover:underline transition active:scale-95 cursor-pointer block"
                      >
                        Görseli Kaldır
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 rounded-xl py-3 px-4 cursor-pointer transition text-center group">
                    <div className="text-xl mb-1 group-hover:scale-110 transition duration-200">📷</div>
                    <div className="text-[11px] font-black text-slate-700">Resim Seçin veya Sürükleyin</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">PNG, JPG veya SVG desteklenir</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImage}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Tanıtım Video URL</span>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Video bağlantısı (Youtube vb.)"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>
            </div>

            {/* Barcodes & SKU */}
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  Barkod
                  <AICopilotTooltip fieldKey="barcode" position="right" />
                </span>
                <input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="EAN/UPC Barkod"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">Karekod (QR Code)</span>
                <input
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="QR veri veya linki"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-500">SKU Stok Kodu</span>
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Örn: SKU-1002"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                />
              </label>
            </div>

            {/* Stock tracking, entry dates, exit dates as requested */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-3">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                Depo Konumlandırma & Giriş Çıkış
                <AICopilotTooltip fieldKey="warehouse" position="right" />
              </span>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-500">Stok Adedi</span>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Adet"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-500">Depo Adı</span>
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
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
                    >
                      {availableWarehouses.map((wh) => (
                        <option key={wh.name} value={wh.name}>{wh.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={warehouse}
                      onChange={(e) => setWarehouse(e.target.value)}
                      placeholder="Örn: Ana Depo"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
                    />
                  )}
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-500">Raf / Bölge</span>
                  {availableWarehouses.length > 0 ? (
                    <select
                      value={shelf}
                      onChange={(e) => setShelf(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
                    >
                      {(availableWarehouses.find(wh => wh.name === warehouse)?.shelves || []).map((sh: string) => (
                        <option key={sh} value={sh}>{sh}</option>
                      ))}
                      {(!availableWarehouses.find(wh => wh.name === warehouse)?.shelves || 
                        availableWarehouses.find(wh => wh.name === warehouse)?.shelves.length === 0) && (
                        <option value="">Raf Konumu Yok</option>
                      )}
                    </select>
                  ) : (
                    <input
                      value={shelf}
                      onChange={(e) => setShelf(e.target.value)}
                      placeholder="Örn: A-01-R02"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
                    />
                  )}
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-500">Depoya Giriş Tarihi</span>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-500">Depodan Çıkış Tarihi</span>
                  <input
                    type="date"
                    value={exitDate}
                    onChange={(e) => setExitDate(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
                  />
                </label>
              </div>
            </div>

            {/* Ürün Varyantları (İsteğe Bağlı) - B2B/B2C Modeli */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    📦 Ürün Varyantları (İsteğe Bağlı)
                    <AICopilotTooltip fieldKey="variants" position="right" />
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                    Modeller (örn: Autel Ultra/Elite), aksesuarlar veya beden/renk ekleyin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-blue-700 transition shadow-sm"
                >
                  + Varyant Ekle
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
                  <p className="text-[11px] text-slate-400 font-bold italic">
                    Henüz varyant eklenmedi. (Tek modelli ürünler için bu alanı boş bırakabilirsiniz)
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                  {variants.map((v, index) => (
                    <div
                      key={v.id}
                      className="relative rounded-xl border border-slate-200 bg-white p-3 space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-[10px] font-black text-blue-600">
                          #{index + 1} Varyant Detayları
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVariant(v.id)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-700 transition"
                        >
                          Sil
                        </button>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">Varyant Adı *</span>
                          <input
                            required
                            value={v.name}
                            onChange={(e) => updateVariantField(v.id, "name", e.target.value)}
                            placeholder="Örn: Autel Ultra"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">SKU Stok Kodu</span>
                          <input
                            value={v.sku}
                            onChange={(e) => updateVariantField(v.id, "sku", e.target.value)}
                            placeholder="SKU-VAR-001"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">Barkod</span>
                          <input
                            value={v.barcode}
                            onChange={(e) => updateVariantField(v.id, "barcode", e.target.value)}
                            placeholder="Barkod"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </label>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">Alış Fiyatı (Maliyet)</span>
                          <input
                            value={v.purchasePrice}
                            onChange={(e) => updateVariantField(v.id, "purchasePrice", e.target.value)}
                            placeholder="Maliyet"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">Satış Fiyatı</span>
                          <input
                            value={v.salePrice}
                            onChange={(e) => updateVariantField(v.id, "salePrice", e.target.value)}
                            placeholder="Fiyat"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </label>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">Stok Adedi</span>
                          <input
                            value={v.quantity}
                            onChange={(e) => updateVariantField(v.id, "quantity", e.target.value)}
                            placeholder="Adet"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">Depo Adı</span>
                          {availableWarehouses.length > 0 ? (
                            <select
                              value={v.warehouse}
                              onChange={(e) => {
                                const nextWh = e.target.value;
                                updateVariantField(v.id, "warehouse", nextWh);
                                const nextWhObj = availableWarehouses.find(wh => wh.name === nextWh);
                                if (nextWhObj && nextWhObj.shelves && nextWhObj.shelves.length > 0) {
                                  updateVariantField(v.id, "shelf", nextWhObj.shelves[0]);
                                } else {
                                  updateVariantField(v.id, "shelf", "");
                                }
                              }}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none"
                            >
                              {availableWarehouses.map((wh) => (
                                <option key={wh.name} value={wh.name}>
                                  {wh.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              value={v.warehouse}
                              onChange={(e) => updateVariantField(v.id, "warehouse", e.target.value)}
                              placeholder="Ana Depo"
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                            />
                          )}
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500">Raf / Bölge</span>
                          {availableWarehouses.length > 0 ? (
                            <select
                              value={v.shelf}
                              onChange={(e) => updateVariantField(v.id, "shelf", e.target.value)}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none"
                            >
                              {(
                                availableWarehouses.find((wh) => wh.name === v.warehouse)?.shelves || []
                              ).map((sh: string) => (
                                <option key={sh} value={sh}>
                                  {sh}
                                </option>
                              ))}
                              {(!availableWarehouses.find((wh) => wh.name === v.warehouse)?.shelves ||
                                availableWarehouses.find((wh) => wh.name === v.warehouse)?.shelves
                                  .length === 0) && <option value="">Raf Yok</option>}
                            </select>
                          ) : (
                            <input
                              value={v.shelf}
                              onChange={(e) => updateVariantField(v.id, "shelf", e.target.value)}
                              placeholder="Örn: A-01"
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:bg-white"
                            />
                          )}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2.5">
              {editingProductId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    resetForm();
                    setMessage("Düzenleme iptal edildi.");
                  }}
                  className="w-1/3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Vazgeç
                </button>
              )}
              <button
                type="submit"
                className={`flex-1 rounded-xl py-3 text-sm font-black text-white transition cursor-pointer ${editingProductId ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"}`}
              >
                {editingProductId ? "Değişiklikleri Kaydet" : "Kaydı Tamamla"}
              </button>
            </div>
          </form>

          {/* Product list preview */}
          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-black">Mevcut Ürünler ({filteredProducts.length})</h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kod, marka veya isimle filtrele..."
                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
              />

              <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredProducts.map((p) => (
                  <article key={p.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-slate-800">{p.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${p.pricingMode === "fixed" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : p.pricingMode === "quote" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-purple-100 text-purple-800 border border-purple-200"}`}>
                        {p.pricingMode === "fixed" ? "Fiyat Göster" : p.pricingMode === "quote" ? "Teklif Alın" : "Teklif Verin"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
                      <p><b>Kategori:</b> {p.category}</p>
                      <p><b>Stok SKU:</b> {p.sku || "-"}</p>
                      <p><b>Barkod:</b> {p.barcode || "-"}</p>
                      <p><b>Fiyat:</b> {p.pricingMode === "fixed" ? `${p.salePrice} ${p.currency}` : "Gizli"}</p>
                      <p><b>Konum:</b> {p.warehouse} · {p.shelf}</p>
                      <p><b>Giriş:</b> {p.entryDate || "-"}</p>
                    </div>

                    {p.videoUrl && (
                      <div className="text-[10px] text-blue-600 font-bold">
                        🎥 Video tanıtım linki eklendi
                      </div>
                    )}

                    {p.variants && p.variants.length > 0 && (
                      <div className="mt-2 border-t border-slate-200/60 pt-1.5 space-y-1">
                        <span className="font-black text-[9px] text-blue-600 uppercase tracking-wide">
                          📦 Tanımlı Varyantlar ({p.variants.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {p.variants.map((v) => (
                            <span key={v.id} className="rounded bg-white border border-slate-200 px-1 py-0.5 text-[8px] font-bold text-slate-600">
                              {v.name} ({v.salePrice ? `${v.salePrice} ${p.currency}` : "Teklif"}) - Stok: {v.quantity || "0"}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons with rich premium styling */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between gap-1.5">
                      {/* Left: Quick Visibility Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleVisibility(p.id)}
                        className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black border transition flex items-center gap-1 cursor-pointer select-none active:scale-95 ${p.visibility === "visible" ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"}`}
                        title="Vitrinde Gösterimi Aç/Kapat"
                      >
                        <span>{p.visibility === "visible" ? "👁️ Vitrinde Açık" : "🙈 Vitrinde Gizli"}</span>
                      </button>

                      {/* Right: Edit & Delete actions */}
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditProduct(p)}
                          className="rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition px-2.5 py-1.5 text-[10px] font-black cursor-pointer active:scale-95 flex items-center gap-0.5"
                          title="Ürünü Düzenle"
                        >
                          <span>✏️ Düzenle</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id, p.name, p.sku)}
                          className="rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition px-2.5 py-1.5 text-[10px] font-black cursor-pointer active:scale-95 flex items-center gap-0.5"
                          title="Ürünü Sil"
                        >
                          <span>🗑️ Sil</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {filteredProducts.length === 0 && (
                  <p className="text-slate-400 italic text-center py-4">Filtreye uygun ürün bulunamadı.</p>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}