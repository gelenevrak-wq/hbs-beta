"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

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

type LocationRow = {
  product: string;
  sku: string;
  qty: number;
  warehouse: string;
  address: string;
  storefronts: string[];
  lastMove: string;
  user: string;
};

const DEFAULT_WAREHOUSES: Warehouse[] = [
  { id: "main", name: "Ana Depo", purpose: "Satışa hazır ürün stoğu", customerVisible: false, city: "Batumi", zones: ["A", "B", "C", "D"], capacity: 1000, used: 0 },
  { id: "return", name: "İade / Kontrol Deposu", purpose: "İade, arızalı veya kontrol bekleyen ürünler", customerVisible: false, city: "Batumi", zones: ["R", "Q"], capacity: 200, used: 0 },
  { id: "showroom", name: "Showroom Alanı", purpose: "Müşterinin görebileceği örnek ürünler", customerVisible: true, city: "Batumi", zones: ["S"], capacity: 150, used: 0 },
  { id: "obdtr", name: "OBDTR Ana Depo", purpose: "Diagnostik cihaz ve aksesuar stoğu", customerVisible: false, city: "İstanbul", zones: ["D", "L", "A"], capacity: 500, used: 0 },
];

function pct(used: number, capacity: number) {
  return Math.round((used / (capacity || 1)) * 100);
}

export default function WarehousesPage() {
  const [query, setQuery] = useState("");
  const [warehousesList, setWarehousesList] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Scanner states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [manualScanInput, setManualScanInput] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Play Beep sound helper
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio Context scan sound blocked or unavailable:", e);
    }
  };

  const startScanner = async () => {
    setIsScannerOpen(true);
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanMessage("Depo raf kodunu algılamak için kamerayı barkoda yaklaştırın...");
      // Auto simulation
      setTimeout(() => {
        const mockCodes = ["main", "return", "showroom", "A-01", "A-02", "B-01", "R-01", "S-01", "D-01"];
        const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
        handleScanSuccess(randomCode);
      }, 2500);
    } catch (e) {
      console.error("Camera scanner failed to load:", e);
      setScanMessage("Kameraya erişilemedi. Lütfen manuel kod girin veya izin verin.");
    }
  };

  const stopScanner = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsScannerOpen(false);
  };

  const switchDevice = async (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.error("Failed to switch scanner camera:", e);
    }
  };

  const handleScanSuccess = (code: string) => {
    playBeep();
    setQuery(code);
    setScanMessage(`✓ Algılandı: ${code}. Konum sorgusu filtrelendi!`);
    setTimeout(() => {
      stopScanner();
    }, 1000);
  };
  
  // Form fields
  const [newWhName, setNewWhName] = useState("");
  const [newWhPurpose, setNewWhPurpose] = useState("");
  const [newWhCity, setNewWhCity] = useState("Batumi");
  const [newWhCapacity, setNewWhCapacity] = useState(500);
  const [newWhZones, setNewWhZones] = useState("A, B");
  const [newWhVisible, setNewWhVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Load products catalog
    const savedProducts = window.localStorage.getItem("hbs-store-products");
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        }
      } catch (e) {
        console.error("Error loading products:", e);
      }
    }

    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const storeSlug = currentUser?.storeSlugs?.[0] || "obdtr";
      
      const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      let myStore = registeredStores.find((s: any) => s.code === storeSlug);
      
      if (!myStore && storeSlug === "obdtr") {
        myStore = {
          code: "obdtr",
          name: "OBDTR Diagnostics",
          city: "İstanbul",
          operatingModel: "virtual_delivery",
          serviceCountries: ["TR", "GE"],
          warehouses: DEFAULT_WAREHOUSES
        };
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify([myStore, ...registeredStores]));
      }

      if (myStore && myStore.warehouses && myStore.warehouses.length > 0) {
        setWarehousesList(myStore.warehouses);
      } else {
        setWarehousesList(DEFAULT_WAREHOUSES);
        if (myStore) {
          myStore.warehouses = DEFAULT_WAREHOUSES.map(w => ({
            ...w,
            shelves: w.zones.map(z => `${z}-01`)
          }));
          const updatedStores = registeredStores.map((s: any) => s.code === storeSlug ? myStore : s);
          window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
        }
      }
    } catch (e) {
      console.error(e);
      setWarehousesList(DEFAULT_WAREHOUSES);
    }
  }, []);

  function createWarehouse(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newWhName.trim() || !newWhPurpose.trim()) {
      setErrorMsg("Depo adı ve kullanım amacı alanları zorunludur.");
      return;
    }

    const zonesArray = newWhZones.split(",").map(z => z.trim().toUpperCase()).filter(z => z !== "");
    if (zonesArray.length === 0) {
      setErrorMsg("Lütfen en az bir adet bölge tanımlayın (Örn: A, B).");
      return;
    }

    const newWh: Warehouse = {
      id: `wh-${Date.now()}`,
      name: newWhName.trim(),
      purpose: newWhPurpose.trim(),
      customerVisible: newWhVisible,
      city: newWhCity.trim(),
      zones: zonesArray,
      capacity: Number(newWhCapacity) || 100,
      used: 0
    };

    const updatedList = [...warehousesList, newWh];
    setWarehousesList(updatedList);

    try {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const storeSlug = currentUser?.storeSlugs?.[0] || "obdtr";
      
      const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
      let myStore = registeredStores.find((s: any) => s.code === storeSlug);
      
      if (myStore) {
        myStore.warehouses = updatedList.map(w => ({
          ...w,
          shelves: w.shelves || w.zones.map(z => `${z}-01`)
        }));

        const updatedStores = registeredStores.map((s: any) => s.code === storeSlug ? myStore : s);
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      }
    } catch (err) {
      console.error("Error saving new warehouse:", err);
    }

    setNewWhName("");
    setNewWhPurpose("");
    setNewWhZones("A, B");
    setNewWhCapacity(500);
    setNewWhVisible(false);
    setSuccessMsg(`"${newWh.name}" başarıyla oluşturuldu! Artık ürün yüklerken bu depoyu seçebilirsiniz.`);
  }

  const locationRows = useMemo<LocationRow[]>(() => {
    const rows: LocationRow[] = [];
    products.forEach((p) => {
      if (p.warehouse || p.shelf || p.quantity) {
        rows.push({
          product: p.name,
          sku: p.sku || "SKU-YOK",
          qty: parseInt(p.quantity) || 0,
          warehouse: p.warehouse || "Ana Depo",
          address: p.shelf || "A-01",
          storefronts: p.visibility === "visible" ? ["Online Mağaza Vitrini"] : ["Gizli Stok"],
          lastMove: p.entryDate || new Date().toISOString().split("T")[0],
          user: "Yönetici"
        });
      }
      
      if (p.variants && Array.isArray(p.variants)) {
        p.variants.forEach((v: any) => {
          rows.push({
            product: `${p.name} (${v.name})`,
            sku: v.sku || `SKU-${v.id}`,
            qty: parseInt(v.quantity) || 0,
            warehouse: v.warehouse || p.warehouse || "Ana Depo",
            address: v.shelf || "A-01",
            storefronts: p.visibility === "visible" ? ["Online Mağaza Vitrini"] : ["Gizli Stok"],
            lastMove: p.entryDate || new Date().toISOString().split("T")[0],
            user: "Yönetici"
          });
        });
      }
    });
    return rows;
  }, [products]);

  const dynamicWarehousesList = useMemo(() => {
    return warehousesList.map((wh) => {
      const usedInWh = locationRows
        .filter((row) => row.warehouse.toLowerCase() === wh.name.toLowerCase())
        .reduce((sum, row) => sum + row.qty, 0);
      return {
        ...wh,
        used: usedInWh
      };
    });
  }, [warehousesList, locationRows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locationRows;
    return locationRows.filter((row) => [row.product, row.sku, row.warehouse, row.address, row.user, ...row.storefronts].some((v) => v.toLowerCase().includes(q)));
  }, [query, locationRows]);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1850px]">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">HBS Depo</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard/stock-movements" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">Stok Hareketleri</Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">Paneli Aç</Link>
          </div>
        </header>

        {errorMsg && (
          <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-black text-red-950">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black text-emerald-950">
            ✓ {successMsg}
          </div>
        )}

        <section className="mb-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Depo haritalandırma</p>
              <h1 className="mt-1 text-xl font-black sm:text-3xl">Ürünün depoda tam yerini göster</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">HBS’de depo ve vitrin ayrı kavramdır. Depo ürünün fiziksel yerini tutar; vitrin müşteriye nerede gösterildiğini belirler. Bir ürün birden fazla depoda durabilir ve birden fazla vitrinde görünebilir.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-50 p-3"><b>Depo</b><p className="mt-1 text-xs text-slate-600">Ana depo, iade, showroom vb.</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><b>Adres</b><p className="mt-1 text-xs text-slate-600">Bölge-koridor-raf kodu.</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><b>Vitrin</b><p className="mt-1 text-xs text-slate-600">Online veya şehir vitrini.</p></div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <h2 className="text-lg font-black text-emerald-900">Müşteriye anlatım</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-900/90">“Ürününüzü HBS’ye girerken hangi depoda, hangi rafta durduğunu seçin. İsterseniz müşteriye gösterin, isterseniz sadece iç stokta tutun. Çalışan barkodu okuttuğunda ürünün tam adresini görür.”</p>
              <div className="mt-2.5 rounded-xl border border-emerald-200 bg-white p-3 text-xs font-bold text-emerald-900">Örnek adres: Ana Depo / A-03-R12-G04-K08</div>
            </div>
          </div>

          <form onSubmit={createWarehouse} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3.5 flex flex-col justify-between">
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700 border border-blue-100 uppercase">
                ➕ YENİ DEPO EKLE
              </span>
              <h2 className="text-lg font-black text-slate-800">Depo Tanımlama Kartı</h2>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Depo Adı *</span>
                <input
                  required
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  placeholder="Örn: Kuzey Şubesi Deposu"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Kullanım Amacı *</span>
                <input
                  required
                  value={newWhPurpose}
                  onChange={(e) => setNewWhPurpose(e.target.value)}
                  placeholder="Örn: Ağır vasıta parça stoğu"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Bulunduğu Şehir</span>
                <input
                  value={newWhCity}
                  onChange={(e) => setNewWhCity(e.target.value)}
                  placeholder="Örn: İstanbul"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Kapasite (Alan Miktarı)</span>
                <input
                  type="number"
                  value={newWhCapacity}
                  onChange={(e) => setNewWhCapacity(Number(e.target.value))}
                  placeholder="Örn: 500"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="grid gap-0.5">
                <span className="text-xs font-bold text-slate-500">Bölgeler / Koridorlar *</span>
                <input
                  value={newWhZones}
                  onChange={(e) => setNewWhZones(e.target.value)}
                  placeholder="A, B, C (virgülle ayırın)"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="whVisible"
                checked={newWhVisible}
                onChange={(e) => setNewWhVisible(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="whVisible" className="text-xs font-black text-slate-700 cursor-pointer select-none">
                Müşteriler vitrinde görsün (Vitrine Açık)
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              Yeni Depoyu Oluştur
            </button>
          </form>
        </section>

        <section className="mb-3 grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
          {dynamicWarehousesList.map((wh) => (
            <article key={wh.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-850 text-sm">{wh.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500 font-bold">{wh.city} · {wh.purpose}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${wh.customerVisible ? "bg-blue-100 text-blue-850 border border-blue-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                  {wh.customerVisible ? "Vitrine açık" : "İç depo"}
                </span>
              </div>
              <div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct(wh.used, wh.capacity)}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-black mt-2">
                  <span>{wh.used} / {wh.capacity} alan</span>
                  <span>%{pct(wh.used, wh.capacity)} Dolu</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-bold">Tanımlı Bölgeler: {wh.zones.join(", ")}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black">Ürün konum sorgusu</h2>
            <div className="flex gap-2 items-center w-full sm:max-w-md">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün, SKU, depo, raf, kullanıcı veya vitrin ara" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500" />
              <button
                type="button"
                onClick={startScanner}
                className="shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white hover:bg-blue-700 transition flex items-center gap-1 shadow-sm active:scale-95"
              >
                📷 Tara
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr><th className="p-3">Ürün</th><th className="p-3">Stok</th><th className="p-3">Depo adresi</th><th className="p-3">Vitrin</th><th className="p-3">Son işlem</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.sku} className="align-top font-semibold text-slate-700">
                    <td className="p-3"><b>{row.product}</b><p className="text-[10px] text-slate-400 mt-0.5">{row.sku}</p></td>
                    <td className="p-3 font-black text-slate-900">{row.qty}</td>
                    <td className="p-3"><b>{row.warehouse}</b><p className="text-[10px] text-blue-700 mt-0.5 font-black">{row.address}</p></td>
                    <td className="p-3 text-[10px] text-slate-500">{row.storefronts.join(" · ")}</td>
                    <td className="p-3 text-[10px] text-slate-500 leading-normal">{row.lastMove}<br />{row.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SCANNER MODAL */}
        {isScannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-955/80 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    DEPO BARKOD TARAYICI
                  </span>
                  <h3 className="text-sm font-black text-white">Canlı Konum Arama</h3>
                </div>
                <button
                  onClick={stopScanner}
                  className="text-slate-400 hover:text-white transition font-black"
                >
                  Kapat
                </button>
              </div>

              <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden border-b border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                  <div className="absolute top-[48%] left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                  <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-500" />
                  <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-500" />
                  <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-500" />
                  <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-500" />
                </div>
              </div>

              <div className="p-5 bg-slate-955/40 space-y-4">
                {videoDevices.length > 1 && (
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <span className="text-xs text-slate-400 font-bold">Kamera Seçimi:</span>
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => switchDevice(e.target.value)}
                      className="bg-slate-850 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
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

                <div className="border-t border-slate-800 pt-3 flex gap-2">
                  <input
                    type="text"
                    value={manualScanInput}
                    onChange={(e) => setManualScanInput(e.target.value)}
                    placeholder="Kod numarası veya Raf (Örn: A-01)"
                    className="flex-1 rounded-xl bg-slate-800 border border-slate-750 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (manualScanInput.trim()) {
                        handleScanSuccess(manualScanInput.trim());
                      }
                    }}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3.5 py-1.5 transition"
                  >
                    Simüle Et
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
