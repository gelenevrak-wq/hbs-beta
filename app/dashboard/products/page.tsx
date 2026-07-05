"use client";

import { getLocalizedField, translateAllFields } from "@/lib/translations";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";
import AICopilotTooltip from "@/components/common/AICopilotTooltip";


// Helper to compress base64 images to prevent localStorage/Supabase payload overflow
function compressBase64Image(base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !base64Str.startsWith("data:image")) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

// Safe wrapper for localStorage writes to catch QuotaExceededError
function safeSetLocalStorage(key: string, value: string) {
  try {
    if (typeof window !== "undefined") {
      safeSetLocalStorage(key, value);
    }
  } catch (e) {
    console.error("Local storage write failed (likely quota exceeded):", e);
  }
}

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
  galleryUrls?: string[];
  trackExpirationDate?: boolean;
  expirationDate?: string;
  dynamicPricingEnabled?: boolean;
};

const INITIAL_PRODUCTS: ProductRecord[] = [];

const CODE39_PATTERNS: { [key: string]: string } = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101'
};

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

function generateCode39Svg(text: string) {
  const clean = (text || "HBS-BAR").toUpperCase().replace(/[^0-9A-Z\-\. \*]/g, "");
  const formatted = clean.startsWith("*") && clean.endsWith("*") ? clean : `*${clean}*`;
  let bits = "";
  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS[' '];
    bits += pattern + "0";
  }
  const barWidth = 2.5;
  const height = 75;
  const width = bits.length * barWidth + 40;
  const rects: any[] = [];
  let x = 20;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      rects.push(
        <rect key={i} x={x} y={10} width={barWidth} height={height} fill="#000000" />
      );
    }
    x += barWidth;
  }
  return (
    <svg viewBox={`0 0 ${width} 110`} width="100%" height="100%" className="mx-auto select-none">
      <rect x={0} y={0} width={width} height={110} fill="#ffffff" />
      {rects}
      <text x={width / 2} y={98} textAnchor="middle" style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', fill: '#000000', letterSpacing: '3px' }}>
        {clean}
      </text>
    </svg>
  );
}

function generateQrCodeSvg(text: string) {
  const size = 25;
  const grid = Array(size).fill(null).map(() => Array(size).fill(false));
  const drawFinder = (x: number, y: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[y + r][x + c] = isBorder || isCenter;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(18, 0);
  drawFinder(0, 18);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
      const isCenter = r === 2 && c === 2;
      grid[16 + r][16 + c] = isBorder || isCenter;
    }
  }
  for (let i = 7; i < 18; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }
  const dataStr = text || "HBS-QR-STOCK";
  let hash = 5381;
  for (let i = 0; i < dataStr.length; i++) {
    hash = (hash * 33) ^ dataStr.charCodeAt(i);
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 9 && c < 9;
      const inTopRight = r < 9 && c > 16;
      const inBottomLeft = r > 16 && c < 9;
      const inAlignment = r >= 15 && r <= 21 && c >= 15 && c <= 21;
      const inTiming = r === 6 || c === 6;
      if (!inTopLeft && !inTopRight && !inBottomLeft && !inAlignment && !inTiming) {
        const cellHash = Math.abs((hash ^ (r * 12345) ^ (c * 67890)) % 100);
        grid[r][c] = cellHash < 46;
      }
    }
  }
  const cellSize = 10;
  const padding = 15;
  const totalSize = size * cellSize + padding * 2;
  const rects: any[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) {
        rects.push(
          <rect key={`${r}-${c}`} x={padding + c * cellSize} y={padding + r * cellSize} width={cellSize} height={cellSize} fill="#000000" />
        );
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${totalSize} ${totalSize}`} width="100%" height="100%" className="mx-auto select-none">
      <rect x={0} y={0} width={totalSize} height={totalSize} fill="#ffffff" />
      {rects}
    </svg>
  );
}

export default function ProductsPage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  // Esnaf-friendly states
  const [sanayiMode, setSanayiMode] = useState(false);
  const [lastDeletedProduct, setLastDeletedProduct] = useState<ProductRecord | null>(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalTitle, setSuccessModalTitle] = useState("");
  const [successModalDesc, setSuccessModalDesc] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [sector, setSector] = useState("automotive");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserStr = window.localStorage.getItem("hbs-current-user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        setStoreSlug(currentUser.storeSlugs?.[0] || "");
      }
    }
  }, []);

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
  const [trackExpirationDate, setTrackExpirationDate] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [pricingMode, setPricingMode] = useState<PricingMode>("fixed");
  const [visibility, setVisibility] = useState<Visibility>("visible");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [productsLoaded, setProductsLoaded] = useState(false);
  const [products, setProducts] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState<string>("all");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferProductId, setTransferProductId] = useState<string | null>(null);
  const [transferToWarehouse, setTransferToWarehouse] = useState<string>("");
  const [transferToShelf, setTransferToShelf] = useState<string>("");
  const [transferQty, setTransferQty] = useState<string>("1");

  // Custom date picker refs and helpers
  const entryDateInputRef = useRef<HTMLInputElement>(null);
  const exitDateInputRef = useRef<HTMLInputElement>(null);

  const formatToTurkishDate = (isoString: string) => {
    if (!isoString) return "";
    const parts = isoString.split("-");
    if (parts.length !== 3) return isoString;
    return parts[2] + "." + parts[1] + "." + parts[0];
  };

  const getDynamicPrice = (p: ProductRecord) => {
    const basePrice = parseFloat(p.salePrice) || 0;
    if (!p.dynamicPricingEnabled) return `${basePrice} ${p.currency}`;
    
    const qty = parseInt(p.quantity) || 0;
    let adjusted = basePrice;
    let reason = "";
    
    if (qty <= 3 && qty > 0) {
      adjusted = Math.round(basePrice * 1.15);
      reason = " (+%15 Az Stok)";
    } else if (qty === 0) {
      adjusted = Math.round(basePrice * 1.25);
      reason = " (+%25 Yok)";
    } else if (qty > 15) {
      adjusted = Math.round(basePrice * 0.90);
      reason = " (-%10 Stok Eritme)";
    }
    
    return `${adjusted} ${p.currency} 🤖${reason}`;
  };

  const uniqueCategories = useMemo(() => {
    const cats = products
      .map(p => p.category?.trim())
      .filter(Boolean);
    return Array.from(new Set(cats));
  }, [products]);

  const filteredCategorySuggestions = useMemo(() => {
    const val = category.trim().toLowerCase();
    if (!val) return uniqueCategories;
    return uniqueCategories.filter(cat => cat.toLowerCase().includes(val));
  }, [category, uniqueCategories]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [availableWarehouses, setAvailableWarehouses] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Pre-fill edit from URL query parameter
  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");
      if (editId) {
        const prod = products.find(p => p.id === editId);
        if (prod) {
          setEditingProductId(prod.id);
          const activeLang = language || "tr";
          setName(getLocalizedField(prod.name, activeLang));
          setCategory(prod.category);
          setBrand(prod.brand || "");
          setModel(prod.model || "");
          setDescription(getLocalizedField(prod.description, activeLang));
          setSalePrice(prod.salePrice || "");
          setPurchasePrice(prod.purchasePrice || "");
          setCurrency(prod.currency || "GEL");
          setBarcode(prod.barcode || "");
          setQrCode(prod.qrCode || "");
          setWarehouse(prod.warehouse || "");
          setShelf(prod.shelf || "");
          setQuantity(prod.quantity || "");
          setItemType(prod.itemType || "product");
          setPricingMode(prod.pricingMode || "fixed");
          setVideoUrl(prod.videoUrl || "");
          setDynamicPricingEnabled(prod.dynamicPricingEnabled || false);
          setStockTracking(prod.stockTracking ?? true);
        }
      }
    }
  }, [products]);
  const [dynamicPricingEnabled, setDynamicPricingEnabled] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Search Filter Options
  const [filterVisibility, setFilterVisibility] = useState<"all" | "visible" | "hidden">("all");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterMinQty, setFilterMinQty] = useState("");
  const [filterMaxQty, setFilterMaxQty] = useState("");

  // Gallery and Media Integration
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  // Camera Capture & Scanner States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraActiveMode, setCameraActiveMode] = useState<'photo' | 'video' | 'scan'>('photo');
  const [cameraTargetField, setCameraTargetField] = useState<'photo' | 'video' | 'barcode' | 'qrCode'>('photo');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [manualScanInput, setManualScanInput] = useState("");
  const [scanMessage, setScanMessage] = useState("");

  // Print Center States
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintProduct, setSelectedPrintProduct] = useState<ProductRecord | null>(null);
  const [activePrintTab, setActivePrintTab] = useState<'card' | 'barcode' | 'shelf' | 'zpl'>('card');

  // Interactive Mobile QR/Barcode Warehousing Assistant States
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalScannedProduct, setTerminalScannedProduct] = useState<ProductRecord | null>(null);
  const [terminalMessage, setTerminalMessage] = useState("");
  const [terminalScannedShelf, setTerminalScannedShelf] = useState<string | null>(null);
  const [terminalInputVal, setTerminalInputVal] = useState("");

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
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

  // Start Camera Function
  const startCamera = async (mode: 'photo' | 'video' | 'scan', target: 'photo' | 'video' | 'barcode' | 'qrCode') => {
    setCameraActiveMode(mode);
    setCameraTargetField(target);
    setIsCameraModalOpen(true);
    setScanMessage("");
    setManualScanInput("");
    setRecordedChunks([]);
    setIsRecording(false);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(videoDevs);
      
      const constraints: MediaStreamConstraints = {
        video: videoDevs.length > 0 
          ? { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined } 
          : true,
        audio: mode === 'video'
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.setAttribute("playsinline", "true");
        
        if (mode === 'scan') {
          setScanMessage("Tarayıcı yükleniyor... Lütfen bekleyin.");
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
              handleCodeDetected(result.text);
            }
          });
        }
      }
    } catch (e) {
      console.error("Camera access failed:", e);
      setScanMessage("Kamera başlatılamadı. İzinlerinizi kontrol edin veya manuel giriş yapın.");
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
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
        audio: cameraActiveMode === 'video'
      });
      setCameraStream(stream);
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.setAttribute("playsinline", "true");
        if (cameraActiveMode === 'scan') {
          const ZXingClass = await loadZXing();
          if (ZXingClass) {
            if (!zxingReaderRef.current) {
              zxingReaderRef.current = new (window as any).ZXing.BrowserMultiFormatReader();
            }
            zxingReaderRef.current.decodeFromVideoElement(videoEl, (result: any, err: any) => {
              if (result && result.text) {
                handleCodeDetected(result.text);
              }
            });
          }
        }
      }
    } catch (e) {
      console.error("Failed to switch camera device:", e);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    // Scale down and compress camera photos to prevent quota/payload errors
    let width = videoRef.current.videoWidth || 640;
    let height = videoRef.current.videoHeight || 480;
    const maxWidth = 800;
    const maxHeight = 800;
    
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 quality compression
      setGalleryUrls(prev => {
        const next = [...prev, dataUrl];
        if (next.length === 1) setImageUrl(dataUrl);
        return next;
      });
      playBeep();
      stopCamera();
    }
  };

  const startRecording = () => {
    if (!cameraStream) return;
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' });
    } catch (e) {
      recorder = new MediaRecorder(cameraStream);
    }
    mediaRecorderRef.current = recorder;
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrlStr = URL.createObjectURL(blob);
      setVideoUrl(videoUrlStr);
      setMessage("Kamera kaydı başarıyla eklendi!");
    };
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopCamera();
      playBeep();
    }
  };

  const handleCodeDetected = (code: string) => {
    playBeep();
    if (cameraTargetField === 'barcode') {
      setBarcode(code);
      setScanMessage(`✓ Algılandı: ${code} (Barkod)`);
    } else if (cameraTargetField === 'qrCode') {
      setQrCode(code);
      setScanMessage(`✓ Algılandı: ${code} (Karekod)`);
    }
    setTimeout(() => {
      stopCamera();
    }, 1000);
  };

  useEffect(() => {
    const updateSector = () => {
      const savedSector = window.localStorage.getItem("hbs-business-sector") || "automotive";
      setSector(savedSector);
    };
    updateSector();
    window.addEventListener("hbs-sector-changed", updateSector);
    return () => {
      window.removeEventListener("hbs-sector-changed", updateSector);
    };
  }, []);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage((savedLanguage as LanguageCode) || "tr");

    const updateSector = () => {
      const savedSector = window.localStorage.getItem("hbs-business-sector") || "automotive";
      setSector(savedSector);
    };
    updateSector();
    window.addEventListener("hbs-sector-changed", updateSector);

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      try {
        const currentUserStr = window.localStorage.getItem("hbs-current-user");
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          const storeSlug = currentUser.storeSlugs?.[0];
          if (storeSlug) {
            supabase
              .from("offerable_items")
              .select("*, companies!inner(code)")
              .eq("companies.code", storeSlug)
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
                    quantity: "10",
                    warehouse: "Ana Depo",
                    shelf: "",
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
                  setProductsLoaded(true);
                } else {
                  if (error) console.error("Error loading products from Supabase:", error);
                  loadLocalFallback();
                }
              });
          } else {
            loadLocalFallback();
          }
        } else {
          loadLocalFallback();
        }
      } catch (e) {
        console.error("Error loading products from Supabase:", e);
        loadLocalFallback();
      }
    } else {
      loadLocalFallback();
    }

    function loadLocalFallback() {
      let savedProducts = window.localStorage.getItem(`hbs-store-products-${storeSlug}`);
      
      // Auto-recovery: If local cache is bloated (>1.5MB) due to raw phone photos, clean it!
      if (savedProducts && savedProducts.length > 1.5 * 1024 * 1024) {
        console.warn("Local storage cache is too large, purging large images to prevent quota errors...");
        try {
          const parsed = JSON.parse(savedProducts);
          const cleaned = parsed.map((p: any) => {
            if (p.imageUrl && p.imageUrl.startsWith("data:image")) {
              p.imageUrl = "/product-images/diagnostic-scanner.svg";
            }
            if (p.galleryUrls) {
              p.galleryUrls = p.galleryUrls.map((url: string) => 
                url.startsWith("data:image") ? "/product-images/diagnostic-scanner.svg" : url
              );
            }
            return p;
          });
          safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(cleaned));
          savedProducts = JSON.stringify(cleaned);
        } catch (e) {
          try { window.localStorage.removeItem(`hbs-store-products-${storeSlug}`); } catch(ex){}
          savedProducts = null;
        }
      }

      let parsedProducts: ProductRecord[] = [];
      if (savedProducts) {
        try {
          parsedProducts = JSON.parse(savedProducts) as ProductRecord[];
        } catch (e) {}
      }

      try {
        const currentUserStr = window.localStorage.getItem("hbs-current-user");
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          const storeSlug = currentUser.storeSlugs?.[0];
          if (storeSlug === "ozgur-motor") {
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
              safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(parsedProducts));
            }
          }
        }
      } catch (e) {
        console.error("Local load check error", e);
      }

      if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
        setProducts(parsedProducts);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
      setProductsLoaded(true);
    }

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
    safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(products));
  }, [products, productsLoaded]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      // 1. Text Search Query
      const matchesText = !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.model.toLowerCase().includes(q) ||
        product.barcode.toLowerCase().includes(q) ||
        product.qrCode.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.oemCode.toLowerCase().includes(q);

      // Warehouse filtering
      const matchesWarehouse = selectedWarehouseFilter === "all" || product.warehouse === selectedWarehouseFilter;

      // 2. Showcase Visibility Filter
      let matchesVisibility = true;
      if (filterVisibility === "visible") {
        matchesVisibility = product.visibility === "visible";
      } else if (filterVisibility === "hidden") {
        matchesVisibility = product.visibility === "hidden";
      }

      // 3. Price Filter
      const priceVal = parseFloat(product.salePrice) || 0;
      const minPriceVal = parseFloat(filterMinPrice);
      const maxPriceVal = parseFloat(filterMaxPrice);
      const matchesMinPrice = isNaN(minPriceVal) || priceVal >= minPriceVal;
      const matchesMaxPrice = isNaN(maxPriceVal) || priceVal <= maxPriceVal;

      // 4. Quantity Filter
      const qtyVal = parseFloat(product.quantity) || 0;
      const minQtyVal = parseFloat(filterMinQty);
      const maxQtyVal = parseFloat(filterMaxQty);
      const matchesMinQty = isNaN(minQtyVal) || qtyVal >= minQtyVal;
      const matchesMaxQty = isNaN(maxQtyVal) || qtyVal <= maxQtyVal;

      return matchesWarehouse && matchesText && matchesVisibility && matchesMinPrice && matchesMaxPrice && matchesMinQty && matchesMaxQty;
    });
  }, [products, search, filterVisibility, filterMinPrice, filterMaxPrice, filterMinQty, filterMaxQty, selectedWarehouseFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterVisibility, filterMinPrice, filterMaxPrice, filterMinQty, filterMaxQty, selectedWarehouseFilter]);

  const itemsPerPage = 15;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleProductTransfer = () => {
    if (!transferProductId) return;
    const targetProd = products.find(p => p.id === transferProductId);
    if (!targetProd) return;

    const qtyToTransfer = parseInt(transferQty) || 0;
    const currentQty = parseInt(targetProd.quantity) || 0;

    if (qtyToTransfer <= 0) {
      alert("Lütfen geçerli bir sevk miktarı girin.");
      return;
    }

    if (qtyToTransfer > currentQty) {
      alert(`Yetersiz stok! En fazla ${currentQty} adet transfer edebilirsiniz.`);
      return;
    }

    let updatedProducts = [...products];

    if (qtyToTransfer === currentQty) {
      updatedProducts = products.map(p => 
        p.id === transferProductId 
          ? { ...p, warehouse: transferToWarehouse, shelf: transferToShelf } 
          : p
      );
    } else {
      // Deduct from source
      updatedProducts = products.map(p => 
        p.id === transferProductId 
          ? { ...p, quantity: String(currentQty - qtyToTransfer) } 
          : p
      );
      // Try to find same product in destination
      const existingAtDest = products.find(p => 
        p.name === targetProd.name && 
        p.sku === targetProd.sku && 
        p.warehouse === transferToWarehouse && 
        p.shelf === transferToShelf
      );

      if (existingAtDest) {
        updatedProducts = updatedProducts.map(p => 
          p.id === existingAtDest.id 
            ? { ...p, quantity: String((parseInt(p.quantity) || 0) + qtyToTransfer) } 
            : p
        );
      } else {
        const newProductCopy: ProductRecord = {
          ...targetProd,
          id: `prod-${Date.now()}`,
          quantity: String(qtyToTransfer),
          warehouse: transferToWarehouse,
          shelf: transferToShelf
        };
        updatedProducts.push(newProductCopy);
      }
    }

    setProducts(updatedProducts);
    setIsTransferModalOpen(false);
    setMessage(`"${targetProd.name}" başarıyla ${transferToWarehouse} (${transferToShelf || "Rafsız"}) konumuna sevk edildi.`);
  };

  function handleTerminalScan(code: string) {
    const cleanCode = code.trim().toLowerCase();
    if (!cleanCode) return;

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
      } catch (e) {}
    };

    // 1. Check if it matches a shelf code
    const allShelves = availableWarehouses.flatMap(wh => wh.shelves || []);
    const matchedShelf = allShelves.find(sh => sh.toLowerCase() === cleanCode);

    if (matchedShelf) {
      setTerminalScannedShelf(matchedShelf);
      setTerminalScannedProduct(null);
      setTerminalMessage(`✓ Lokasyon okundu: Raf ${matchedShelf}`);
      playBeep();
      return;
    }

    // 2. Check if it matches a product SKU, barcode, oem code, or name
    const matchedProd = products.find(p => 
      (p.barcode && p.barcode.toLowerCase() === cleanCode) ||
      (p.sku && p.sku.toLowerCase() === cleanCode) ||
      (p.oemCode && p.oemCode.toLowerCase() === cleanCode) ||
      p.name.toLowerCase().includes(cleanCode)
    );

    if (matchedProd) {
      setTerminalScannedProduct(matchedProd);
      setTerminalScannedShelf(null);
      setTerminalMessage(`✓ Ürün okundu: ${matchedProd.name}`);
      playBeep();
      return;
    }

    // 3. Fallback
    setTerminalScannedProduct(null);
    setTerminalScannedShelf(null);
    setTerminalMessage(`⚠️ "${code}" ile eşleşen raf veya ürün bulunamadı!`);
    playBeep();
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
    setEntryDate("");
    setExitDate("");
    setTrackExpirationDate(false);
    setExpirationDate("");
    setPricingMode("fixed");
    setVisibility("visible");
    setImageUrl("");
    setVideoUrl("");
    setDynamicPricingEnabled(false);
    setVariants([]);
    setGalleryUrls([]);
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
    const activeLang = language || "tr";
    setName(getLocalizedField(p.name, activeLang));
    setCategory(p.category);
    setBrand(p.brand || "");
    setModel(p.model || "");
    setDescription(getLocalizedField(p.description, activeLang));
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
    setTrackExpirationDate(p.trackExpirationDate || false);
    setExpirationDate(p.expirationDate || "");
    setPricingMode(p.pricingMode || "fixed");
    setVisibility(p.visibility || "visible");
    setImageUrl(p.imageUrl || "");
    setVideoUrl(p.videoUrl || "");
    setVariants(p.variants || []);
    setGalleryUrls(p.galleryUrls || (p.imageUrl ? [p.imageUrl] : []));
    setMessage(`"${p.name}" düzenleme için forma yüklendi. Değişiklikleri yaptıktan sonra sayfanın altındaki butona basarak kaydedebilirsiniz.`);
  }

  const handleUndoDelete = async () => {
    if (!lastDeletedProduct) return;
    try {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      if (isSupabaseConfigured) {
        const isUuid = lastDeletedProduct.id.length === 36;
        if (isUuid) {
          await supabase
            .from("offerable_items")
            .update({
              brand: lastDeletedProduct.brand,
              category: lastDeletedProduct.category,
              is_visible_in_storefront: lastDeletedProduct.visibility === "visible",
              is_visible_in_public_search: lastDeletedProduct.visibility === "visible"
            })
            .eq("id", lastDeletedProduct.id);
        }
      }
      setProducts((prev) => [lastDeletedProduct, ...prev]);
      setLastDeletedProduct(null);
      setShowUndoBanner(false);
      setSuccessModalTitle("Geri Alındı!");
      setSuccessModalDesc("Silinen ürün başarıyla geri yüklendi.");
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  async function deleteProduct(id: string, productName: string, productSku: string) {
    // Esnaf-friendly immediate delete & undo
    const prodToDelete = products.find((p) => p.id === id);
    if (prodToDelete) {
      setLastDeletedProduct(prodToDelete);
      setShowUndoBanner(true);
      setTimeout(() => {
        setLastDeletedProduct((curr) => {
          if (curr && curr.id === id) {
            return null;
          }
          return curr;
        });
        setShowUndoBanner(false);
      }, 10000);
    }

    // 1. Update UI state immediately
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    setMessage(`"${productName}" silindi. Geri almak için yukarıdaki butonu kullanabilirsiniz.`);
    if (editingProductId === id) {
      setEditingProductId(null);
      resetForm();
    }

    // 2. Perform async DB delete in the background
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      try {
        if (id.length === 36) {
          const { error, count } = await supabase
            .from("offerable_items")
            .delete({ count: "exact" })
            .eq("id", id);
          if (error || count === 0) {
            // RLS blocked delete, fall back to soft-delete
            await supabase
              .from("offerable_items")
              .update({ brand: "DELETED", category: "DELETED", is_visible_in_storefront: false })
              .eq("id", id);
          }
        } else {
          const { error, count } = await supabase
            .from("offerable_items")
            .delete({ count: "exact" })
            .eq("code", productSku);
          if (error || count === 0) {
            // RLS blocked delete, fall back to soft-delete
            await supabase
              .from("offerable_items")
              .update({ brand: "DELETED", category: "DELETED", is_visible_in_storefront: false })
              .eq("code", productSku);
          }
        }
      } catch (err) {
        console.error("Supabase delete error:", err);
      }
    }
  }

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllProducts = () => {
    const allFilteredIds = filteredProducts.map((p) => p.id);
    const allSelected = allFilteredIds.every((id) => selectedProductIds.includes(id));
    if (allSelected) {
      setSelectedProductIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedProductIds((prev) => {
        const union = new Set([...prev, ...allFilteredIds]);
        return Array.from(union);
      });
    }
  };

  const deleteSelectedProducts = async () => {
    const count = selectedProductIds.length;
    if (count === 0) return;
    if (!window.confirm(language === "en" 
      ? `Are you sure you want to delete the ${count} selected products?` 
      : `Seçilen ${count} ürünü silmek istediğinize emin misiniz?`
    )) {
      return;
    }

    const productsToDelete = products.filter((p) => selectedProductIds.includes(p.id));

    // 1. Update UI state immediately so the user sees them disappear instantly!
    const remainingProducts = products.filter((p) => !selectedProductIds.includes(p.id));
    setProducts(remainingProducts);
    setSelectedProductIds([]);
    setMessage(language === "en" 
      ? `Successfully deleted ${count} products.` 
      : `${count} adet ürün başarıyla silindi.`
    );

    // 2. Perform async batch DB delete
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    if (isSupabaseConfigured) {
      try {
        const uuidIds = productsToDelete.filter(p => p.id.length === 36).map(p => p.id);
        const nonUuidSkus = productsToDelete.filter(p => p.id.length !== 36 && p.sku).map(p => p.sku);

        // Execute batch deletes via single requests rather than sequential loops
        if (uuidIds.length > 0) {
          const { error, count } = await supabase
            .from("offerable_items")
            .delete({ count: "exact" })
            .in("id", uuidIds);
          if (error || count === 0) {
            // Fall back to soft-delete
            await supabase
              .from("offerable_items")
              .update({ brand: "DELETED", category: "DELETED", is_visible_in_storefront: false })
              .in("id", uuidIds);
          }
        }

        if (nonUuidSkus.length > 0) {
          const { error, count } = await supabase
            .from("offerable_items")
            .delete({ count: "exact" })
            .in("code", nonUuidSkus);
          if (error || count === 0) {
            // Fall back to soft-delete
            await supabase
              .from("offerable_items")
              .update({ brand: "DELETED", category: "DELETED", is_visible_in_storefront: false })
              .in("code", nonUuidSkus);
          }
        }
      } catch (err) {
        console.error("Supabase bulk delete error:", err);
      }
    }
  };

  async function duplicateProduct(p: ProductRecord) {
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    const newId = `product-${Date.now()}`;
    const newSku = p.sku ? `${p.sku}-KOPYA` : "";
    const newBarcode = p.barcode ? `${p.barcode}99` : "";
    const newQrCode = p.qrCode ? `${p.qrCode}-KOPYA` : "";
    const newName = `${p.name} (Kopya)`;

    const duplicated: ProductRecord = {
      ...p,
      id: newId,
      name: newName,
      sku: newSku,
      barcode: newBarcode,
      qrCode: newQrCode,
      entryDate: new Date().toISOString().split("T")[0],
    };

    if (isSupabaseConfigured) {
      try {
        const currentUserStr = window.localStorage.getItem("hbs-current-user");
        let targetCompanyId = "a123bc45-6789-abcd-ef01-234567890123"; // Default for OBDTR
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          const storeSlug = currentUser.storeSlugs?.[0];
          if (storeSlug) {
            const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
            const myStore = registeredStores.find((s: any) => s.code === storeSlug);
            if (myStore && myStore.id) {
              targetCompanyId = myStore.id;
            }
          }
        }

        const supabasePayload = {
          company_id: targetCompanyId,
          type: p.itemType,
          name: newName,
          code: newSku,
          category: p.category,
          brand: p.brand || "",
          description: p.description || "",
          photo_urls: p.imageUrl ? [p.imageUrl] : [],
          video_urls: p.videoUrl ? [p.videoUrl] : [],
          currency: p.currency || "GEL",
          sale_price: p.pricingMode === "fixed" && p.salePrice ? parseFloat(p.salePrice) : null,
          is_visible_in_storefront: p.visibility === "visible",
          is_visible_in_public_search: p.visibility === "visible",
          barcode: newBarcode
        };

        const { error } = await supabase.from("offerable_items").insert(supabasePayload);
        if (error) console.error("Supabase duplicate error:", error);
      } catch (err) {
        console.error("Supabase duplicate insert error:", err);
      }
    }

    setProducts((current) => [duplicated, ...current]);
    setMessage(`"${p.name}" başarıyla kopyalandı! Yeni kopyalanan ürün listede en başa yerleştirildi.`);
  }

  async function toggleVisibility(id: string) {
    const updatedProducts = products.map((p) => {
      if (p.id === id) {
        const nextVisibility: Visibility = p.visibility === "visible" ? "hidden" : "visible";
        
        const isSupabaseConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

        if (isSupabaseConfigured) {
          const isUuid = id.length === 36;
          const query = supabase.from("offerable_items").update({
            is_visible_in_storefront: nextVisibility === "visible",
            is_visible_in_public_search: nextVisibility === "visible",
          });

          if (isUuid) {
            query.eq("id", id).then(({ error }) => {
              if (error) console.error("Supabase toggle error by ID:", error);
            });
          } else {
            // Fallback for non-UUID temporary items
            query.or(`code.eq.${p.sku},name.eq.${p.name}`).then(({ error }) => {
              if (error) console.error("Supabase toggle error by fallback:", error);
            });
          }
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
    if (isSaving) return;
    if (!name.trim() || !category.trim()) {
      setMessage("Ürün/hizmet adı ve kategori zorunludur.");
      return;
    }
    setIsSaving(true);

    const activeLang = language || "tr";
    const [translatedName, translatedDesc] = await Promise.all([
      translateAllFields(name, activeLang),
      translateAllFields(description, activeLang)
    ]);

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    let targetCompanyId = "a123bc45-6789-abcd-ef01-234567890123"; // Default for OBDTR
    try {
      if (isSupabaseConfigured) {
        try {
          const currentUserStr = window.localStorage.getItem("hbs-current-user");
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const storeSlug = currentUser.storeSlugs?.[0];
            if (storeSlug) {
              const { data: compData } = await supabase
                .from("companies")
                .select("id")
                .eq("code", storeSlug)
                .single();
              if (compData && compData.id) {
                targetCompanyId = compData.id;
              }
            }
          }
        } catch (err) {
          console.error("Error looking up company ID for product save:", err);
        }
      }

      if (editingProductId) {
        // EDIT MODE
        const updatedProducts = products.map((p) => {
          if (p.id === editingProductId) {
            return {
              ...p,
              itemType,
              name: translatedName,
              category,
              brand,
              model,
              description: translatedDesc,
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
              trackExpirationDate,
              expirationDate: trackExpirationDate ? expirationDate : "",
              pricingMode,
              visibility,
              dynamicPricingEnabled,
              imageUrl: imageUrl.trim() || "/product-images/diagnostic-scanner.svg",
              videoUrl,
              variants: variants.length > 0 ? variants : undefined,
              galleryUrls: galleryUrls.length > 0 ? galleryUrls : [imageUrl.trim() || "/product-images/diagnostic-scanner.svg"]
            };
          }
          return p;
        });

        if (isSupabaseConfigured) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(editingProductId);
          if (isUuid) {
            await supabase
              .from("offerable_items")
              .update({
                name: translatedName,
                type: itemType === "product" ? "product" : itemType === "service" ? "service" : "rentable_asset",
                category,
                brand,
                code: sku || `SKU-${Date.now()}`,
                barcode,
                qr_code: qrCode,
                oem_codes: model.trim() ? model.split(",").map(m => m.trim()).filter(Boolean) : null,
                sale_price: pricingMode === "fixed" ? parseFloat(salePrice) || null : null,
                purchase_price: parseFloat(purchasePrice) || null,
                currency,
                description: translatedDesc,
                photo_urls: galleryUrls.length > 0 ? galleryUrls : [imageUrl.trim() || "/product-images/diagnostic-scanner.svg"],
                video_urls: [videoUrl],
                is_visible_in_storefront: visibility === "visible",
                is_visible_in_public_search: visibility === "visible",
                company_id: targetCompanyId
              })
              .eq("id", editingProductId);
          } else {
            await supabase.from("offerable_items").insert({
              name: translatedName,
              type: itemType === "product" ? "product" : itemType === "service" ? "service" : "rentable_asset",
              category,
              brand,
              code: sku || `SKU-${Date.now()}`,
              barcode,
              qr_code: qrCode,
              oem_codes: model.trim() ? model.split(",").map(m => m.trim()).filter(Boolean) : null,
              sale_price: pricingMode === "fixed" ? parseFloat(salePrice) || null : null,
              purchase_price: parseFloat(purchasePrice) || null,
              currency,
              description: translatedDesc,
              photo_urls: galleryUrls.length > 0 ? galleryUrls : [imageUrl.trim() || "/product-images/diagnostic-scanner.svg"],
              video_urls: [videoUrl],
              is_visible_in_storefront: visibility === "visible",
              is_visible_in_public_search: visibility === "visible",
              company_id: targetCompanyId
            });
          }
        }

        setProducts(updatedProducts);
        setMessage("Kayıt başarıyla güncellendi! Veritabanı ve yerel hafıza senkronize edildi.");
        setEditingProductId(null);
        resetForm();
        setSuccessModalTitle("Değişiklikler Kaydedildi!");
        setSuccessModalDesc(`"${name}" isimli ürün güncellemeleri kaydedildi.`);
        setShowSuccessModal(true);
      } else {
        // CREATE MODE
        const newProduct: ProductRecord = {
          id: `product-${Date.now()}`,
          itemType,
          name: translatedName,
          category,
          brand,
          model,
          description: translatedDesc,
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
          trackExpirationDate,
          expirationDate: trackExpirationDate ? expirationDate : "",
          pricingMode,
          visibility,
          dynamicPricingEnabled,
          imageUrl: imageUrl.trim() || "/product-images/diagnostic-scanner.svg",
          videoUrl,
          variants: variants.length > 0 ? variants : undefined,
          galleryUrls: galleryUrls.length > 0 ? galleryUrls : [imageUrl.trim() || "/product-images/diagnostic-scanner.svg"]
        };

        if (isSupabaseConfigured) {
          await supabase.from("offerable_items").insert({
            name: translatedName,
            type: itemType === "product" ? "product" : itemType === "service" ? "service" : "rentable_asset",
            category,
            brand,
            code: sku || `SKU-${Date.now()}`,
            barcode,
            qr_code: qrCode,
            oem_codes: model.trim() ? model.split(",").map(m => m.trim()).filter(Boolean) : null,
            sale_price: pricingMode === "fixed" ? parseFloat(salePrice) || null : null,
            purchase_price: parseFloat(purchasePrice) || null,
            currency,
            description: translatedDesc,
            photo_urls: galleryUrls.length > 0 ? galleryUrls : [newProduct.imageUrl],
            video_urls: [videoUrl],
            is_visible_in_storefront: visibility === "visible",
            is_visible_in_public_search: visibility === "visible",
            company_id: targetCompanyId
          });
        }

        setProducts((currentProducts) => [newProduct, ...currentProducts]);
        setMessage("Kayıt başarıyla oluşturuldu! Veritabanı ve yerel hafıza güncellendi.");
        resetForm();
        setSuccessModalTitle("Ürün Kaydedildi!");
        setSuccessModalDesc(`"${name}" isimli ürün envantere eklendi.`);
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error("Error saving product:", e);
      setMessage("Ürün kaydedilirken veritabanı veya yerel sunucu hatası oluştu.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!language) return <main className="min-h-screen bg-slate-950" />;

  return (
    <main className={"min-h-screen bg-[#f5f7fb] text-slate-900 px-3 py-3 sm:px-6 sm:py-6 " + (sanayiMode ? "sanayi-mode-active" : "")}>
      {sanayiMode && (
        <style dangerouslySetInnerHTML={{ __html: `
          .sanayi-mode-active .text-xs, .sanayi-mode-active span.text-xs { font-size: 0.95rem !important; font-weight: 800 !important; }
          .sanayi-mode-active .text-sm, .sanayi-mode-active span.text-sm { font-size: 1.15rem !important; font-weight: 900 !important; }
          .sanayi-mode-active input, .sanayi-mode-active select, .sanayi-mode-active textarea { font-size: 1.1rem !important; padding: 0.75rem 1rem !important; height: auto !important; }
          .sanayi-mode-active label span { font-size: 1rem !important; font-weight: 900 !important; }
          .sanayi-mode-active button { font-size: 1rem !important; padding: 0.75rem 1.25rem !important; }
        `}} />
      )}
{showUndoBanner && lastDeletedProduct && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white font-black px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce border-2 border-white">
          <span className="text-xs">⚠️ "{lastDeletedProduct.name}" silindi. Geri yüklemek ister misiniz?</span>
          <div className="flex gap-2">
            <button
              onClick={handleUndoDelete}
              className="bg-white text-slate-900 px-3 py-1 rounded-xl text-[11px] font-black cursor-pointer hover:bg-slate-100 transition active:scale-95"
            >
              🔄 Geri Al
            </button>
            <button
              onClick={() => setShowUndoBanner(false)}
              className="bg-amber-600 text-white px-2 py-1 rounded-xl text-[11px] font-black cursor-pointer hover:bg-amber-700 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl space-y-4 animate-scaleUp">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 text-3xl">
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-950">{successModalTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-bold">{successModalDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-md active:scale-95"
            >
              Harika, Devam Et
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-[1850px]">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Link href="/dashboard" className="text-lg font-black sm:text-2xl text-blue-600">HBS Ürün</Link>
            <span className="text-slate-400 font-extrabold text-xs hidden sm:inline">| Premium Ürün ve Depo Konumlandırma</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Sanayi Modu (Büyük Yazı) Toggle */}
            <button
              type="button"
              onClick={() => setSanayiMode(!sanayiMode)}
              className={"rounded-lg border px-3 py-2 text-xs font-black transition cursor-pointer select-none active:scale-95 " + (sanayiMode ? "bg-orange-600 border-orange-700 text-white shadow-md font-extrabold" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50")}
            >
              ⚙️ {sanayiMode ? "Sanayi Modu: AÇIK" : "Sanayi Modu (Büyük Yazı)"}
            </button>
            {storeSlug && (
              <a
                href={"https://wa.me/?text=D%C3%BCkkan%C4%B1m%C4%B1n%20katalo%C4%9Funu%20buradan%20inceleyebilirsiniz%3A%20" + encodeURIComponent(typeof window !== "undefined" ? window.location.origin + "/store/" + storeSlug : "")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700 transition cursor-pointer select-none active:scale-95 flex items-center gap-1 shadow-sm font-extrabold"
              >
                💬 Vitrini Paylaş
              </a>
            )}
            <CompactLanguageSwitcher />
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black"
            >
              Paneli Aç
            </Link>
          </div>
        </header>

        {/* 🏪 Depo Durum Kartları ve Hızlı Filtreleme */}
        <section className="mb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div
            onClick={() => setSelectedWarehouseFilter("all")}
            className={`p-4 rounded-2xl border cursor-pointer transition select-none flex flex-col justify-between h-24 ${
              selectedWarehouseFilter === "all"
                ? "border-blue-400 bg-blue-50/50 shadow-sm"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">GENEL ENVANTER</span>
              <span className="text-sm font-black text-slate-800 mt-1 block">Tüm Depolar</span>
            </div>
            <span className="text-xs font-bold text-slate-500 font-semibold">{products.length} Çeşit Ürün</span>
          </div>

          {availableWarehouses.map((wh) => {
            const whProducts = products.filter(p => p.warehouse === wh.name);
            const totalQty = whProducts.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0);
            const isSelected = selectedWarehouseFilter === wh.name;

            return (
              <div
                key={wh.id}
                onClick={() => setSelectedWarehouseFilter(wh.name)}
                className={`p-4 rounded-2xl border cursor-pointer transition select-none flex flex-col justify-between h-24 ${
                  isSelected
                    ? "border-blue-400 bg-blue-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">DEPO HESABI</span>
                  <span className="text-sm font-black text-slate-800 mt-0.5 block truncate">{wh.name}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>{whProducts.length} Çeşit</span>
                  <span>{totalQty} Adet Stok</span>
                </div>
              </div>
            );
          })}

          <Link
            href="/dashboard/warehouses"
            className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/70 transition flex flex-col items-center justify-center text-center h-24 text-slate-700 cursor-pointer"
          >
            <span className="text-xl">🏪</span>
            <span className="text-xs font-black mt-1">Depoları Yönet & Düzenle</span>
          </Link>
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
              <p className="text-xs text-slate-900 font-extrabold max-w-2xl leading-relaxed">
                Mağazanıza yüzlerce ürünü ve bunlara ait varyantları (örneğin OBDTR Autel cihazları veya tekstil bedenleri) tek bir hamlede ekleyin. Hazırladığımız şablonu indirin, doldurup geri yükleyin!
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 items-center shrink-0">
              <button
                type="button"
                onClick={downloadCSVTemplate}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-900 font-extrabold hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5 animate-pulse"
              >
                <span>📥</span> Şablon İndir (Excel / CSV)
              </button>
              
              <label className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition shadow-sm cursor-pointer flex items-center gap-1.5">
                <span>📤</span> Dosyayı Geri Yükle
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden" id="id-page-hidden-838" aria-label="Hidden" />
              </label>
            </div>
          </div>
          
          <div className="mt-3.5 border-t border-slate-100 pt-3 flex gap-2 text-[10px] text-slate-700 font-bold font-bold leading-relaxed">
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
                <span className="text-xs font-bold text-slate-900 font-extrabold flex items-center gap-1.5">
                  Kayıt Türü
                  <AICopilotTooltip fieldKey="itemType" position="right" />
                </span>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as ItemType)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
                >
                  <option value="product">Fiziksel Ürün</option>
                  <option value="service">Hizmet satışı</option>
                  <option value="rental">Kiralama</option>
                  <option value="appointment">Randevulu İşlem</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Görünürlük</span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
                >
                  <option value="visible">Vitrin ve Pazar Yerinde Açık</option>
                  <option value="hidden">Gizli</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Ürün / Hizmet Adı *</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: NGK Buji Seti"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-89" aria-label="Rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
              </label>

              <label className="grid gap-1 relative">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Kategori / Sektör *</span>
                <input
                  required
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setShowCategorySuggestions(true);
                  }}
                  onFocus={() => setShowCategorySuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowCategorySuggestions(false), 200);
                  }}
                  placeholder="Örn: Oto yedek parçası"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-946" aria-label="Rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                {showCategorySuggestions && filteredCategorySuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[100%] mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-250 bg-white py-1 shadow-lg z-50">
                    {filteredCategorySuggestions.map((cat, idx) => (
                      <li
                        key={idx}
                        onMouseDown={() => {
                          setCategory(cat);
                          setShowCategorySuggestions(false);
                        }}
                        className="px-3 py-2 text-xs text-slate-950 font-bold hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition"
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Marka</span>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={sector === "footwear" ? "Örn: Nike, Adidas" : sector === "grocery" ? "Örn: Ülker, Eti" : "Örn: Bosch"}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-65" aria-label="Rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                <div className="flex flex-wrap gap-1 mt-1 select-none">
                  {(sector === "footwear"
                    ? ['Nike', 'Adidas', 'Puma', 'Flo', 'Derimod', 'Skechers', 'Vans', 'Converse']
                    : sector === "grocery"
                    ? ['Ülker', 'Eti', 'Coca-Cola', 'Pınar', 'Sütaş', 'Lipton', 'Torku']
                    : ['Mercedes', 'BMW', 'Audi', 'Toyota', 'Opel', 'Ford', 'Honda', 'Fiat', 'Renault']
                  ).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setBrand(chip)}
                      className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">
                  {sector === "footwear" ? "Seri / Koleksiyon" : sector === "grocery" ? "Özellik / Çeşit" : "Uyumlu Model"}
                </span>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={sector === "footwear" ? "Örn: Air Max, Stan Smith" : sector === "grocery" ? "Örn: Kakaolu, Diyet" : "Örn: A4 / Golf 7"}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-387" aria-label="Rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-bold text-slate-900 font-extrabold">Ürün Açıklaması</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Özellikler, uyumluluk bilgileri..."
                rows={2}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
              />
            </label>

            {/* Esnaf-Dostu Fiyat & Teklif Ayarları */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4 space-y-3 shadow-sm">
              <span className="text-xs font-black text-slate-900 font-extrabold flex items-center gap-1.5">
                Fiyat & Teklif Ayarları
                <AICopilotTooltip fieldKey="pricingMode" position="right" />
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-900 font-extrabold">Satış Fiyatı</span>
                  <input
                    value={salePrice}
                    onChange={(e) => {
                      setSalePrice(e.target.value);
                      if (e.target.value.trim() !== "") {
                        setPricingMode("fixed");
                      }
                    }}
                    placeholder="Örn: 1500 (Boş bırakırsanız Teklif Alın olur)"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-159" aria-label="Rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                </label>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 select-none col-span-2">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="hide-price-checkbox"
                      checked={pricingMode === "quote"}
                      onChange={(e) => {
                        setPricingMode(e.target.checked ? "quote" : "fixed");
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                    <label htmlFor="hide-price-checkbox" className="text-xs font-black text-slate-800 cursor-pointer">
                      Fiyatı Gizle (Ziyaretçiden Teklif İste)
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2 cursor-pointer bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100">
                    <input
                      type="checkbox"
                      id="ai-pricing-checkbox"
                      checked={dynamicPricingEnabled}
                      onChange={(e) => {
                        setDynamicPricingEnabled(e.target.checked);
                      }}
                      className="h-4 w-4 rounded border-blue-300 text-blue-600 cursor-pointer"
                    />
                    <label htmlFor="ai-pricing-checkbox" className="text-xs font-black text-blue-900 cursor-pointer flex items-center gap-1.5">
                      🤖 AI Dinamik Fiyatlandırma Aktif
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Maliyet Fiyatı</span>
                <input
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Maliyet"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-968" aria-label="Rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Para Birimi</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
                >
                  <option>GEL</option>
                  <option>TRY</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </label>
            </div>

            {/* Media Gallery & Videos */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Çoklu Fotoğraf Galerisi</span>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4 space-y-3 shadow-sm">
                  {galleryUrls.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {galleryUrls.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                          <img src={url} alt={`Galeri ${idx + 1}`} className="h-full w-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow">
                              Vitrin
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = galleryUrls.filter((_, i) => i !== idx);
                              setGalleryUrls(updated);
                              if (updated.length > 0) {
                                setImageUrl(updated[0]);
                              } else {
                                setImageUrl("");
                              }
                            }}
                            className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow hover:scale-110 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center w-5 h-5 text-[10px] font-black cursor-pointer"
                            title="Fotoğrafı Kaldır"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center">
                      <p className="text-xs text-slate-700 font-bold font-bold">Henüz ürün fotoğrafı eklenmedi.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 font-extrabold hover:bg-slate-50 transition cursor-pointer shadow-sm">
                      📥 Fotoğraf Yükle
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = async () => {
                              if (typeof reader.result === "string") {
                                const compressed = await compressBase64Image(reader.result);
                                setGalleryUrls(prev => {
                                  const next = [...prev, compressed];
                                  if (next.length === 1) setImageUrl(compressed);
                                  return next;
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="hidden" id="id-page-hidden-399" aria-label="Hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => startCamera('photo', 'photo')}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 font-extrabold hover:bg-slate-50 transition shadow-sm"
                    >
                      📷 Kamera ile Çek
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Tanıtım Videosu</span>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4 space-y-2.5 flex flex-col justify-between h-full shadow-sm">
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Video bağlantısı (Youtube, mp4 bağlantısı)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none" id="id-page-w-full-rounded-xl-border-border-slate-200-bg-white-px-3-py-2-text-xs-outline-none-264" aria-label="W full rounded xl border border slate 200 bg white px 3 py 2 text xs outline none" />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startCamera('video', 'video')}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 font-extrabold hover:bg-slate-50 transition shadow-sm"
                    >
                      🎥 Kamera ile Video Çek
                    </button>
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setVideoUrl("")}
                        className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-2 text-xs font-black text-rose-600 hover:bg-rose-100 transition"
                      >
                        Kaldır
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Barcodes & SKU */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold flex items-center gap-1.5">
                  Barkod
                  <AICopilotTooltip fieldKey="barcode" position="right" />
                </span>
                <div className="flex gap-1.5">
                  <input
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Barkod numarası"
                    className="flex-1 min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-flex-1-min-w-0-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-489" aria-label="Flex 1 min w 0 rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                  <button
                    type="button"
                    onClick={() => startCamera('scan', 'barcode')}
                    className="px-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center shrink-0"
                    title="Kamerayla Tara"
                  >
                    📷
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const randBarcode = "869" + Math.floor(1000000000 + Math.random() * 9000000000);
                      setBarcode(randBarcode);
                      playBeep();
                      setMessage(`Benzersiz barkod kodu (${randBarcode}) otomatik olarak üretildi.`);
                    }}
                    className="px-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-100 text-[10px] font-black transition shrink-0"
                    title="Otomatik Benzersiz Barkod Üret"
                  >
                    Üret
                  </button>
                </div>
              </div>

              <div className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">Karekod (QR Code)</span>
                <div className="flex gap-1.5">
                  <input
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder="QR Verisi veya URL"
                    className="flex-1 min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-flex-1-min-w-0-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-782" aria-label="Flex 1 min w 0 rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                  <button
                    type="button"
                    onClick={() => startCamera('scan', 'qrCode')}
                    className="px-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center shrink-0"
                    title="Kamerayla Tara"
                  >
                    📷
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const randQr = "QR-" + (sku || "STOCK") + "-" + Math.floor(Math.random() * 9000 + 1000);
                      setQrCode(randQr);
                      playBeep();
                      setMessage(`Benzersiz karekod verisi (${randQr}) otomatik olarak üretildi.`);
                    }}
                    className="px-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-100 text-[10px] font-black transition shrink-0"
                    title="Otomatik Benzersiz QR Üret"
                  >
                    Üret
                  </button>
                </div>
              </div>

              <div className="grid gap-1">
                <span className="text-xs font-bold text-slate-900 font-extrabold">SKU Stok Kodu</span>
                <div className="flex gap-1.5">
                  <input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Örn: SKU-1002"
                    className="flex-1 min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-flex-1-min-w-0-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-text-sm-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-375" aria-label="Flex 1 min w 0 rounded xl border border slate 300 bg white px 3 py 2 text sm text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                  <button
                    type="button"
                    onClick={() => {
                      const randSku = "SKU-" + Math.floor(Math.random() * 90000 + 10000);
                      setSku(randSku);
                      playBeep();
                    }}
                    className="px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-[10px] font-black transition"
                    title="SKU Oluştur"
                  >
                    Üret
                  </button>
                </div>
              </div>
            </div>

            {/* Stock tracking, entry dates, exit dates as requested */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4 space-y-3 shadow-sm">
              <span className="text-xs font-black text-slate-900 font-extrabold flex items-center gap-1.5">
                Depo Konumlandırma & Giriş Çıkış
                <AICopilotTooltip fieldKey="warehouse" position="right" />
              </span>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-900 font-extrabold">Stok Adedi</span>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Adet"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-691" aria-label="Rounded xl border border slate 300 bg white px 3 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-900 font-extrabold">Depo Adı</span>
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
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
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
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-535" aria-label="Rounded xl border border slate 300 bg white px 3 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                  )}
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-900 font-extrabold">Raf / Bölge</span>
                  {availableWarehouses.length > 0 ? (
                    <select
                      value={shelf}
                      onChange={(e) => setShelf(e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
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
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-186" aria-label="Rounded xl border border slate 300 bg white px 3 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                  )}
                </label>
              </div>



              <div className="border-t border-slate-200/60 pt-3 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-900 font-extrabold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={trackExpirationDate}
                    onChange={(e) => setTrackExpirationDate(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-650 focus:ring-blue-500 cursor-pointer" id="id-page-h-4-w-4-rounded-border-slate-300-text-blue-650-focus-ring-blue-500-cursor-pointer-63" aria-label="H 4 w 4 rounded border slate 300 text blue 650 focus ring blue 500 cursor pointer" />
                  Son Kullanım Tarihi (SKT) Takibi Yapılsın
                </label>

                {trackExpirationDate && (
                  <label className="grid gap-1 animate-fadeIn">
                    <span className="text-xs font-bold text-slate-900 font-extrabold">Son Kullanım Tarihi</span>
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-xl-border-border-slate-300-bg-white-px-3-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-396" aria-label="Rounded xl border border slate 300 bg white px 3 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                  </label>
                )}
              </div>
            </div>

            {/* Ürün Varyantları (İsteğe Bağlı) - B2B/B2C Modeli */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    📦 {sector === "footwear" ? "Renk & Beden Ayarları" : "Ürün Seçenekleri / Varyantlar"}
                    <AICopilotTooltip fieldKey="variants" position="right" />
                  </h3>
                  <p className="text-[10px] text-slate-900 font-extrabold leading-normal mt-0.5">
                    {sector === "footwear" 
                      ? "Ayakkabı numaralarını ve renklerini işaretleyerek toplu beden varyantı oluşturun."
                      : "Ürüne ait farklı çeşitler, aksesuarlar veya beden/renk varyasyonları tanımlayın."}
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

              {/* Shoe/Size Quick Matrix Generator */}
              {sector === "footwear" && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 space-y-3 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1">
                    ⚡ Hızlı Renk & Beden Oluşturucu (Esnaf Modu)
                  </span>
                  
                  {/* Sizes */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-650 block">Ayakkabı Numaraları:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'].map(sz => {
                        const checked = selectedSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              setSelectedSizes(prev => 
                                prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
                              );
                            }}
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                              checked 
                                ? "bg-indigo-600 border-indigo-650 text-white shadow-xs" 
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-650 block">Renkler:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Siyah', 'Beyaz', 'Kahverengi', 'Lacivert', 'Gri', 'Kırmızı', 'Mavi'].map(col => {
                        const checked = selectedColors.includes(col);
                        return (
                          <button
                            key={col}
                            type="button"
                            onClick={() => {
                              setSelectedColors(prev => 
                                prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
                              );
                            }}
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                              checked 
                                ? "bg-indigo-600 border-indigo-650 text-white shadow-xs" 
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedSizes.length === 0 || selectedColors.length === 0) {
                        alert("Lütfen en az bir beden ve bir renk seçin ağam!");
                        return;
                      }
                      const newVars: ProductVariant[] = [];
                      selectedColors.forEach(color => {
                        selectedSizes.forEach(size => {
                          const id = `var-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                          const nameVal = `${color} - ${size}`;
                          const skuVal = barcode ? `${barcode}-${color}-${size}` : `SKU-${Date.now()}-${color}-${size}`;
                          newVars.push({
                            id,
                            name: nameVal,
                            sku: skuVal,
                            barcode: skuVal,
                            purchasePrice: purchasePrice || "0",
                            salePrice: salePrice || "0",
                            quantity: "10",
                            warehouse: "Ana Depo",
                            shelf: ""
                          });
                        });
                      });
                      setVariants(prev => [...prev, ...newVars]);
                      setSelectedSizes([]);
                      setSelectedColors([]);
                    }}
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black py-2 shadow-sm transition active:scale-98 cursor-pointer"
                  >
                    ⚡ Seçilen Beden & Renk Kombinasyonlarını Listeye Ekle
                  </button>
                </div>
              )}

              {variants.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
                  <p className="text-[11px] text-slate-700 font-bold font-bold italic">
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
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">Varyant Adı *</span>
                          <input
                            required
                            value={v.name}
                            onChange={(e) => updateVariantField(v.id, "name", e.target.value)}
                            placeholder="Örn: Autel Ultra"
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-770" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">SKU Stok Kodu</span>
                          <input
                            value={v.sku}
                            onChange={(e) => updateVariantField(v.id, "sku", e.target.value)}
                            placeholder="SKU-VAR-001"
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-603" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">Barkod</span>
                          <input
                            value={v.barcode}
                            onChange={(e) => updateVariantField(v.id, "barcode", e.target.value)}
                            placeholder="Barkod"
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-506" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                        </label>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">Alış Fiyatı (Maliyet)</span>
                          <input
                            value={v.purchasePrice}
                            onChange={(e) => updateVariantField(v.id, "purchasePrice", e.target.value)}
                            placeholder="Maliyet"
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-564" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">Satış Fiyatı</span>
                          <input
                            value={v.salePrice}
                            onChange={(e) => updateVariantField(v.id, "salePrice", e.target.value)}
                            placeholder="Fiyat"
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-922" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                        </label>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">Stok Adedi</span>
                          <input
                            value={v.quantity}
                            onChange={(e) => updateVariantField(v.id, "quantity", e.target.value)}
                            placeholder="Adet"
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-809" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">Depo Adı</span>
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
                              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
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
                              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-586" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
                          )}
                        </label>

                        <label className="grid gap-0.5">
                          <span className="text-[9px] font-bold text-slate-900 font-extrabold">Raf / Bölge</span>
                          {availableWarehouses.length > 0 ? (
                            <select
                              value={v.shelf}
                              onChange={(e) => updateVariantField(v.id, "shelf", e.target.value)}
                              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium"
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
                              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-medium" id="id-page-rounded-lg-border-border-slate-300-bg-white-px-2-py-1-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-medium-83" aria-label="Rounded lg border border slate 300 bg white px 2 py 1 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font medium" />
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
                  className="w-1/3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-black text-slate-900 font-extrabold hover:bg-slate-50 transition cursor-pointer"
                >
                  Vazgeç
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-xl py-3 text-sm font-black text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? "Kaydediliyor..." : (editingProductId ? "Değişiklikleri Kaydet" : "Kaydı Tamamla")}
              </button>
            </div>
          </form>

          {/* Product list preview */}
          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
                <h2 className="text-lg font-black">{language === "en" ? "Available Products" : "Mevcut Ürünler"} ({filteredProducts.length})</h2>
                {filteredProducts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs font-black text-slate-900 font-extrabold cursor-pointer select-none bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.includes(p.id))}
                        onChange={toggleSelectAllProducts}
                        className="h-3.5 w-3.5 rounded border-slate-350 text-blue-650 cursor-pointer" id="id-page-h-3-5-w-3-5-rounded-border-slate-350-text-blue-650-cursor-pointer-397" aria-label="H 3 5 w 3 5 rounded border slate 350 text blue 650 cursor pointer" />
                      {language === "en" ? "Select All" : "Tümünü Seç"}
                    </label>
                    {selectedProductIds.length > 0 && (
                      <button
                        type="button"
                        onClick={deleteSelectedProducts}
                        className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-3 py-1.5 shadow transition active:scale-95 flex items-center gap-1"
                      >
                        🗑️ {language === "en" ? `Delete Selected (${selectedProductIds.length})` : `Seçilenleri Sil (${selectedProductIds.length})`}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kod, marka veya isimle filtrele..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm font-semibold" id="id-page-w-full-rounded-xl-border-border-slate-300-bg-white-px-3-py-2-5-text-xs-text-slate-900-placeholder-slate-400-outline-none-focus-border-blue-600-focus-ring-1-focus-ring-blue-600-shadow-sm-font-semibold-67" aria-label="W full rounded xl border border slate 300 bg white px 3 py 2 5 text xs text slate 900 placeholder slate 400 outline none focus border blue 600 focus ring 1 focus ring blue 600 shadow sm font semibold" />
                
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 bg-slate-50/40 border border-slate-350 p-4 rounded-2xl shadow-sm">
                  {/* Showcase Visibility */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-900 font-extrabold">Vitrin Durumu</span>
                    <select
                      value={filterVisibility}
                      onChange={(e) => setFilterVisibility(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-slate-900 font-extrabold"
                    >
                      <option value="all">Tümü (Vitrin & Gizli)</option>
                      <option value="visible">👁️ Sadece Vitrinde Görünür</option>
                      <option value="hidden">🙈 Sadece Vitrinde Gizli</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-900 font-extrabold">Satış Fiyatı Aralığı</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filterMinPrice}
                        onChange={(e) => setFilterMinPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-center" id="id-page-w-full-rounded-xl-border-border-slate-200-bg-white-px-2-py-1-5-text-xs-outline-none-focus-border-blue-500-font-semibold-text-center-291" aria-label="W full rounded xl border border slate 200 bg white px 2 py 1 5 text xs outline none focus border blue 500 font semibold text center" />
                      <span className="text-slate-700 font-bold font-bold">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filterMaxPrice}
                        onChange={(e) => setFilterMaxPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-center" id="id-page-w-full-rounded-xl-border-border-slate-200-bg-white-px-2-py-1-5-text-xs-outline-none-focus-border-blue-500-font-semibold-text-center-40" aria-label="W full rounded xl border border slate 200 bg white px 2 py 1 5 text xs outline none focus border blue 500 font semibold text center" />
                    </div>
                  </div>

                  {/* Stock Qty Range */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-900 font-extrabold">Stok Miktarı Aralığı</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filterMinQty}
                        onChange={(e) => setFilterMinQty(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-center" id="id-page-w-full-rounded-xl-border-border-slate-200-bg-white-px-2-py-1-5-text-xs-outline-none-focus-border-blue-500-font-semibold-text-center-169" aria-label="W full rounded xl border border slate 200 bg white px 2 py 1 5 text xs outline none focus border blue 500 font semibold text center" />
                      <span className="text-slate-700 font-bold font-bold">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filterMaxQty}
                        onChange={(e) => setFilterMaxQty(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-center" id="id-page-w-full-rounded-xl-border-border-slate-200-bg-white-px-2-py-1-5-text-xs-outline-none-focus-border-blue-500-font-semibold-text-center-133" aria-label="W full rounded xl border border slate 200 bg white px 2 py 1 5 text xs outline none focus border blue 500 font semibold text center" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {paginatedProducts.map((p) => (
                  <article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-xs space-y-2.5 relative group hover:border-blue-500 hover:shadow-md transition duration-200 shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(p.id)}
                          onChange={() => toggleSelectProduct(p.id)}
                          className="h-4 w-4 rounded border-slate-350 text-blue-650 cursor-pointer shrink-0" id="id-page-h-4-w-4-rounded-border-slate-350-text-blue-650-cursor-pointer-shrink-0-478" aria-label="H 4 w 4 rounded border slate 350 text blue 650 cursor pointer shrink 0" />
                        <h3 className="font-black text-slate-800 truncate">{getLocalizedField(p.name, language || "tr")}</h3>
                      </div>
                      {p.dynamicPricingEnabled && (
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-extrabold bg-blue-600 text-white animate-pulse shrink-0 border border-blue-700">🤖 AI Fiyatı</span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold shrink-0 ${p.pricingMode === "fixed" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : p.pricingMode === "quote" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-purple-100 text-purple-800 border border-purple-200"}`}>

                        {p.pricingMode === "fixed" ? "Fiyat Göster" : p.pricingMode === "quote" ? "Teklif Alın" : "Teklif Verin"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
                        <p><b>Kategori:</b> {p.category}</p>
                        <p><b>Stok SKU:</b> {p.sku || "-"}</p>
                        <p><b>Barkod:</b> {p.barcode || "-"}</p>
                        <p><b>Fiyat:</b> {p.pricingMode === "fixed" ? getDynamicPrice(p) : "Gizli"}</p>
                        <p><b>Konum:</b> {p.warehouse} · {p.shelf}</p>
                        <p><b>Giriş:</b> {p.entryDate || "-"}</p>
                      </div>

                      <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl text-slate-400">📦</span>
                        )}
                      </div>
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
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrintProduct(p);
                            setIsPrintModalOpen(true);
                            setActivePrintTab('card');
                          }}
                          className="rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-extrabold hover:bg-slate-100 transition px-2.5 py-1.5 text-[10px] font-black cursor-pointer active:scale-95 flex items-center gap-0.5"
                          title="Etiket & Barkod Yazdır"
                        >
                          <span>🖨️ Yazdır</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTransferProductId(p.id);
                            setTransferToWarehouse(p.warehouse || "");
                            setTransferToShelf(p.shelf || "");
                            setTransferQty("1");
                            setIsTransferModalOpen(true);
                          }}
                          className="rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition px-2.5 py-1.5 text-[10px] font-black cursor-pointer active:scale-95 flex items-center gap-0.5"
                          title="Depolar Arası Stok Sevk/Transfer Et"
                        >
                          <span>🔄 Sevk Et</span>
                        </button>
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
                          onClick={() => duplicateProduct(p)}
                          className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition px-2.5 py-1.5 text-[10px] font-black cursor-pointer active:scale-95 flex items-center gap-0.5"
                          title="Ürünün Kopyasını Üret (Çoğalt)"
                        >
                          <span>👯 Kopya Üret</span>
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
                  <p className="text-slate-700 font-bold italic text-center py-4">Filtreye uygun ürün bulunamadı.</p>
                )}
              </div>

              {/* Pagination Controls */}
              {filteredProducts.length > itemsPerPage && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-900 font-extrabold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {language === "en" ? "← Previous" : "← Önceki"}
                  </button>
                  <span className="font-extrabold text-slate-600">
                    {language === "en" 
                      ? `Page ${currentPage} of ${Math.ceil(filteredProducts.length / itemsPerPage)}`
                      : `${Math.ceil(filteredProducts.length / itemsPerPage)} Sayfa arasından ${currentPage}. Sayfa`
                    }
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-900 font-extrabold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {language === "en" ? "Next →" : "Sonraki →"}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </section>

        {/* 🔄 DEPOLAR ARASI TRANSFER MODALI */}
        {isTransferModalOpen && transferProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl space-y-4 animate-scaleIn">
              <div className="flex items-center justify-between">
                <span className="text-xl">🔄</span>
                <h3 className="text-base font-black text-slate-900">Depolar Arası Stok Sevkiyatı</h3>
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition font-black text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-slate-800">📦 {products.find(p => p.id === transferProductId)?.name}</p>
                <p className="text-slate-500 font-semibold">Mevcut Depo: {products.find(p => p.id === transferProductId)?.warehouse} · {products.find(p => p.id === transferProductId)?.shelf || "Rafsız"}</p>
                <p className="text-slate-500 font-semibold">Toplam Mevcut Stok: {products.find(p => p.id === transferProductId)?.quantity} Adet</p>
              </div>

              <div className="space-y-3">
                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-700">Sevk Edilecek Hedef Depo</span>
                  <select
                    value={transferToWarehouse}
                    onChange={(e) => {
                      setTransferToWarehouse(e.target.value);
                      const matchedWh = availableWarehouses.find(w => w.name === e.target.value);
                      if (matchedWh && matchedWh.shelves && matchedWh.shelves.length > 0) {
                        setTransferToShelf(matchedWh.shelves[0]);
                      } else {
                        setTransferToShelf("");
                      }
                    }}
                    className="rounded-xl border border-slate-350 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800"
                  >
                    {availableWarehouses.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-700">Sevk Edilecek Raf / Hücre</span>
                  <select
                    value={transferToShelf}
                    onChange={(e) => setTransferToShelf(e.target.value)}
                    className="rounded-xl border border-slate-355 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800"
                  >
                    <option value="">-- Rafsız (Ortalıkta Dursun) --</option>
                    {availableWarehouses.find(w => w.name === transferToWarehouse)?.shelves?.map((sh: any) => (
                      <option key={sh} value={sh}>{sh} Rafı</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-700">Sevk Edilecek Adet</span>
                  <input
                    type="number"
                    id="transfer-qty-input"
                    aria-label="Sevk miktarı"
                    value={transferQty}
                    onChange={(e) => setTransferQty(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none text-slate-800"
                    min="1"
                    max={products.find(p => p.id === transferProductId)?.quantity || "1"}
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleProductTransfer}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-black text-white transition active:scale-95 shadow-md"
                >
                  ⚡ Sevkiyatı Tamamla (Stok Aktar)
                </button>
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition active:scale-95"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRINT CENTER MODAL */}
        {isPrintModalOpen && selectedPrintProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">HBS BASKI MERKEZİ</span>
                  <h3 className="text-base font-black text-slate-900">{selectedPrintProduct.name}</h3>
                </div>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="text-slate-700 font-bold hover:text-slate-600 transition font-black text-lg p-1"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setActivePrintTab('card')}
                  className={`py-3 text-xs font-black text-center border-b-2 transition ${activePrintTab === 'card' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-900 font-extrabold hover:text-slate-950'}`}
                >
                  📇 Tanıtım Kartı
                </button>
                <button
                  onClick={() => setActivePrintTab('barcode')}
                  className={`py-3 text-xs font-black text-center border-b-2 transition ${activePrintTab === 'barcode' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-900 font-extrabold hover:text-slate-950'}`}
                >
                  🏷️ Barkod (50x30)
                </button>
                <button
                  onClick={() => setActivePrintTab('shelf')}
                  className={`py-3 text-xs font-black text-center border-b-2 transition ${activePrintTab === 'shelf' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-900 font-extrabold hover:text-slate-950'}`}
                >
                  📌 Raf Etiketi
                </button>
                <button
                  onClick={() => setActivePrintTab('zpl')}
                  className={`py-3 text-xs font-black text-center border-b-2 transition ${activePrintTab === 'zpl' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-900 font-extrabold hover:text-slate-950'}`}
                >
                  ⚡ ZPL (Termal)
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-6 flex-1 overflow-y-auto bg-slate-100 flex items-center justify-center">
                {/* Printable Area Wrapper */}
                <div
                  id="hbs-print-area"
                  className={`bg-white text-black p-6 shadow-md border border-slate-200 mx-auto transition-all ${
                    activePrintTab === 'card' ? 'w-[400px] rounded-xl' :
                    activePrintTab === 'barcode' ? 'w-[320px] h-[192px] flex flex-col justify-between items-center p-4' :
                    activePrintTab === 'zpl' ? 'w-[450px] rounded-xl p-5' :
                    'w-[350px] rounded-lg border-2 border-dashed border-slate-400'
                  }`}
                >
                  {activePrintTab === 'card' && (
                    <div className="space-y-4 text-left">
                      <div className="border-b border-slate-200 pb-2 flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">HBS TEKNİK KART</h4>
                          <p className="text-[10px] text-slate-900 font-extrabold font-bold">{selectedPrintProduct.category}</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-800 font-black px-2 py-0.5 rounded">
                          {selectedPrintProduct.sku}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-800">
                        <p><b>Ürün Adı:</b> {selectedPrintProduct.name}</p>
                        {selectedPrintProduct.brand && <p><b>Marka:</b> {selectedPrintProduct.brand}</p>}
                        {selectedPrintProduct.model && <p><b>Uyumlu Model:</b> {selectedPrintProduct.model}</p>}
                        <p><b>Depo Konumu:</b> {selectedPrintProduct.warehouse} · {selectedPrintProduct.shelf || 'Belirtilmedi'}</p>
                        {selectedPrintProduct.salePrice && (
                          <p className="text-sm font-black mt-2 pt-1 border-t border-slate-100 text-blue-700">
                            Fiyat: {selectedPrintProduct.salePrice} {selectedPrintProduct.currency}
                          </p>
                        )}
                      </div>
                      {/* Double Vector Render */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 items-center">
                        <div className="h-16 flex items-center justify-center border border-slate-100 rounded p-1 bg-white">
                          {selectedPrintProduct.barcode ? generateCode39Svg(selectedPrintProduct.barcode) : <p className="text-[9px] text-slate-700 font-bold italic">Barkod yok</p>}
                        </div>
                        <div className="h-16 flex items-center justify-center border border-slate-100 rounded p-1 bg-white">
                          {selectedPrintProduct.qrCode ? generateQrCodeSvg(selectedPrintProduct.qrCode) : <p className="text-[9px] text-slate-700 font-bold italic">QR yok</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {activePrintTab === 'barcode' && (
                    <div className="w-full h-full flex flex-col justify-between items-center text-center">
                      <div className="text-[10px] font-black text-slate-800 truncate w-full max-w-[280px]">
                        {selectedPrintProduct.name}
                      </div>
                      <div className="w-full flex-1 max-h-[85px] flex items-center justify-center py-1">
                        {selectedPrintProduct.barcode ? generateCode39Svg(selectedPrintProduct.barcode) : <p className="text-xs text-slate-700 font-bold italic">Barkod Yok</p>}
                      </div>
                      <div className="flex justify-between items-center w-full text-[9px] font-black text-slate-600 mt-1 border-t border-slate-100 pt-1">
                        <span>SKU: {selectedPrintProduct.sku}</span>
                        <span>Fiyat: {selectedPrintProduct.salePrice ? `${selectedPrintProduct.salePrice} ${selectedPrintProduct.currency}` : 'Teklif'}</span>
                      </div>
                    </div>
                  )}

                  {activePrintTab === 'shelf' && (
                    <div className="p-2 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="bg-slate-900 text-white font-black text-[13px] px-2.5 py-1 rounded">
                          {selectedPrintProduct.shelf || 'RAF-01'}
                        </div>
                        <span className="text-[9px] font-black text-slate-900 font-extrabold uppercase tracking-widest">RAF ETİKETİ</span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900 truncate">{selectedPrintProduct.name}</h4>
                        <p className="text-[8px] text-slate-700 font-bold font-bold uppercase">{selectedPrintProduct.warehouse} / {selectedPrintProduct.brand || 'HBS'}</p>
                      </div>
                      <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
                        <div className="text-left">
                          <span className="text-[9px] text-slate-700 font-bold font-bold block">SATIŞ FİYATI</span>
                          <span className="text-base font-black text-slate-900">
                            {selectedPrintProduct.salePrice ? `${selectedPrintProduct.salePrice} ${selectedPrintProduct.currency}` : 'TEKLİF ALIN'}
                          </span>
                        </div>
                        <div className="h-12 w-12 border border-slate-200 rounded p-0.5 bg-white shrink-0">
                          {selectedPrintProduct.qrCode ? generateQrCodeSvg(selectedPrintProduct.qrCode) : generateQrCodeSvg(selectedPrintProduct.sku)}
                        </div>
                      </div>
                    </div>
                  )}

                  {activePrintTab === 'zpl' && (
                    <div className="space-y-4 text-left w-full">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">RAW ZPL TERMAL KODU</h4>
                        <p className="text-[10px] text-slate-700 font-bold">Zebra ve uyumlu termal etiket yazıcıları için direkt komutlar</p>
                      </div>
                      
                      <div className="relative">
                        <textarea
                          readOnly
                          value={`^XA
^FO50,50^A0N,28,20^FDURUN: ${selectedPrintProduct.name.substring(0, 22).toUpperCase()}^FS
^FO50,90^A0N,20,15^FDKONUM: ${selectedPrintProduct.warehouse.substring(0, 15).toUpperCase()} / ${selectedPrintProduct.shelf || 'RAFSIZ'}^FS
^FO50,130^BY2
^BCN,50,Y,N,N
^FD${selectedPrintProduct.barcode || selectedPrintProduct.sku || '123456789'}^FS
^XZ`}
                          rows={7}
                          className="w-full rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 outline-none border border-slate-800 shadow-inner"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const code = `^XA\n^FO50,50^A0N,28,20^FDURUN: ${selectedPrintProduct.name.substring(0, 22).toUpperCase()}^FS\n^FO50,90^A0N,20,15^FDKONUM: ${selectedPrintProduct.warehouse.substring(0, 15).toUpperCase()} / ${selectedPrintProduct.shelf || 'RAFSIZ'}^FS\n^FO50,130^BY2\n^BCN,50,Y,N,N\n^FD${selectedPrintProduct.barcode || selectedPrintProduct.sku || '123456789'}^FS\n^XZ`;
                            navigator.clipboard.writeText(code);
                            alert("ZPL kodu panoya kopyalandı!");
                          }}
                          className="rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition px-3 py-1.5 text-xs font-black cursor-pointer"
                        >
                          📋 ZPL Kodunu Kopyala
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playBeep();
                            alert("Etiket başarıyla RAW Port 9100 üzerinden barkod yazıcıya gönderildi! (Simüle Edildi)");
                          }}
                          className="rounded-lg bg-slate-900 border border-slate-800 text-white hover:bg-slate-850 transition px-3 py-1.5 text-xs font-black cursor-pointer"
                        >
                          ⚡ Simüle Et (RAW Yazdır)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer controls */}
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <p className="text-[10px] text-slate-900 font-extrabold leading-normal max-w-sm">
                  💡 Yazdır butonuna bastığınızda tarayıcının yazdırma arayüzü açılacak ve <b>@media print</b> kuralı sayesinde sadece yukarıdaki etiket yazdırılacaktır.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPrintModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-900 font-extrabold hover:bg-slate-50 transition"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => {
                      playBeep();
                      window.print();
                    }}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-md"
                  >
                    🖨️ Etiketi Yazdır
                  </button>
                </div>
              </div>
            </div>

            {/* Inject Print Stylesheet */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #hbs-print-area, #hbs-print-area * {
                  visibility: visible !important;
                }
                #hbs-print-area {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  border: none !important;
                  box-shadow: none !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  color: black !important;
                }
                @page {
                  size: auto;
                  margin: 0mm;
                }
              }
            `}} />
          </div>
        )}

        {/* CAMERA / SCANNER MODAL */}
        {isCameraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    {cameraActiveMode === 'photo' ? 'FOTOĞRAF ÇEKİMİ' : cameraActiveMode === 'video' ? 'VİDEO KAYDI' : 'BARKOD / QR TARAYICI'}
                  </span>
                  <h3 className="text-sm font-black text-white">Canlı Cihaz Kamerası</h3>
                </div>
                <button
                  onClick={stopCamera}
                  className="text-slate-700 font-bold hover:text-white transition font-black"
                >
                  Kapat
                </button>
              </div>

              {/* Video stream box */}
              <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden border-b border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={cameraActiveMode !== 'video'}
                  className="w-full h-full object-cover"
                />

                {/* Pulsing Cashier Scan Laser Laser Line Overlay */}
                {cameraActiveMode === 'scan' && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                    <div className="absolute top-[48%] left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                    <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-500" />
                    <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-500" />
                    <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-500" />
                    <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-500" />
                  </div>
                )}
              </div>

              {/* Camera switcher and controls */}
              <div className="p-5 bg-slate-950/40 space-y-4">
                {videoDevices.length > 1 && (
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <span className="text-xs text-slate-700 font-bold font-bold">Kamera Seçimi:</span>
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

                {/* Scan Message & Developer Scan Simulator Fallback Input */}
                {scanMessage && (
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-300">{scanMessage}</p>
                  </div>
                )}

                {cameraActiveMode === 'scan' && (
                  <div className="border-t border-slate-800 pt-3 flex gap-2">
                    <input
                      type="text"
                      value={manualScanInput}
                      onChange={(e) => setManualScanInput(e.target.value)}
                      placeholder="Kod numarası (Simülasyon test)"
                      className="flex-1 rounded-xl bg-slate-800 border border-slate-750 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500" id="id-page-flex-1-rounded-xl-bg-slate-800-border-border-slate-750-px-3-py-1-5-text-xs-text-white-outline-none-focus-border-blue-500-9" aria-label="Flex 1 rounded xl bg slate 800 border border slate 750 px 3 py 1 5 text xs text white outline none focus border blue 500" />
                    <button
                      onClick={() => {
                        if (manualScanInput.trim()) {
                          handleCodeDetected(manualScanInput.trim());
                        }
                      }}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3.5 py-1.5 transition"
                    >
                      Simüle Et
                    </button>
                  </div>
                )}

                {/* Main Capture Buttons */}
                <div className="flex justify-center items-center py-2">
                  {cameraActiveMode === 'photo' && (
                    <button
                      onClick={capturePhoto}
                      className="rounded-full bg-white hover:bg-slate-100 text-slate-900 font-black text-sm px-6 py-3.5 shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
                    >
                      📷 Fotoğraf Çek
                    </button>
                  )}

                  {cameraActiveMode === 'video' && (
                    <div className="flex items-center gap-2">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm px-6 py-3.5 shadow-lg active:scale-95 transition flex items-center gap-1.5"
                        >
                          🔴 Kaydı Başlat
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm px-6 py-3.5 shadow-lg active:scale-95 transition flex items-center gap-1.5 animate-pulse"
                        >
                          ⬜ Kaydı Durdur ve Ekle
                        </button>
                      )}
                    </div>
                  )}

                  {cameraActiveMode === 'scan' && (
                    <button
                      onClick={stopCamera}
                      className="rounded-xl border border-slate-800 text-slate-700 font-bold hover:text-white px-5 py-2 text-xs font-bold transition"
                    >
                      Kapat
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile QR & Barcode Warehousing Assistant (El Terminali) Drawer/Overlay */}
        {isTerminalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
            {/* Terminal Body Container */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border-[10px] border-slate-800 bg-[#0d1527] shadow-2xl flex flex-col h-[640px] max-h-[90vh] text-slate-100 ring-4 ring-orange-500/20">
              
              {/* Phone Speaker & Sensor Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center gap-1.5">
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
                <div className="w-2 h-2 bg-slate-900 rounded-full" />
              </div>

              {/* Honeywell / Zebra Brand Header */}
              <div className="pt-8 pb-2 px-6 flex justify-between items-center bg-[#152342] border-b border-slate-800 text-[10px] font-black tracking-widest text-slate-700 font-bold select-none">
                <span>⚡ HBS SCANNER-9000</span>
                <span className="flex items-center gap-1 text-orange-400">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping" />
                  ONLINE (🔋 98%)
                </span>
              </div>

              {/* Terminal Screen Contents */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col justify-between">
                
                <div className="space-y-4">
                  {/* Title & Close */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                        <span>📱</span> Mobil Depo El Terminali
                      </h3>
                      <p className="text-[9px] text-slate-700 font-bold font-bold uppercase tracking-widest">HBS Mobile OS v4.2</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsTerminalOpen(false);
                        setTerminalScannedProduct(null);
                        setTerminalScannedShelf(null);
                        setTerminalMessage("");
                      }}
                      className="rounded-full bg-slate-800 hover:bg-slate-700 p-1.5 text-xs text-slate-700 font-bold hover:text-white transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Laser Sweeper Simulator (Visual Scan Window) */}
                  <div className="relative h-32 rounded-2xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
                    {/* Laser lines */}
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)] z-10 animate-scanLine" />
                    
                    {/* Glowing corner brackets */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-orange-500 rounded-tl" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-orange-500 rounded-tr" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-orange-500 rounded-bl" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-orange-500 rounded-br" />

                    {/* Scan indicator overlay */}
                    <div className="text-center space-y-1.5 z-10 px-4">
                      <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full tracking-wider block animate-pulse uppercase">
                        Sistem Barkod Tarayıcı Hazır
                      </span>
                      <p className="text-[9px] text-slate-600 font-bold">Barkod simüle etmek için aşağıdaki listeden seçin veya okutun.</p>
                    </div>
                  </div>

                  {/* Unified Barcode / Shelf Scanner Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-700 font-bold block uppercase tracking-wider">
                      Barkod, SKU veya Raf Kodu Girişi
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={terminalInputVal}
                        onChange={(e) => setTerminalInputVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleTerminalScan(terminalInputVal);
                            setTerminalInputVal("");
                          }
                        }}
                        placeholder="Kod girin (Örn: A-01, TT-MASTER...)"
                        className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 outline-none focus:border-orange-500 font-mono" id="id-page-flex-1-rounded-xl-bg-slate-800-border-border-slate-700-px-3-py-2-text-xs-font-semibold-text-slate-100-outline-none-focus-border-orange-500-font-mono-697" aria-label="Flex 1 rounded xl bg slate 800 border border slate 700 px 3 py 2 text xs font semibold text slate 100 outline none focus border orange 500 font mono" />
                      <button
                        type="button"
                        onClick={() => {
                          handleTerminalScan(terminalInputVal);
                          setTerminalInputVal("");
                        }}
                        className="rounded-xl bg-orange-600 hover:bg-orange-500 px-3 py-2 text-xs font-black text-white transition active:scale-95"
                      >
                        OKUT
                      </button>
                    </div>
                  </div>

                  {/* Simulator Scan Trigger - Dropdown Select Product to "Scan" */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 font-bold block uppercase tracking-wider">
                      Simüle Ürün Seçimi (Hızlı Test)
                    </label>
                    <select
                      onChange={(e) => {
                        const prodId = e.target.value;
                        if (prodId) {
                          const matched = products.find(p => p.id === prodId);
                          if (matched) {
                            setTerminalScannedProduct(matched);
                            setTerminalScannedShelf(null);
                            setTerminalMessage(`✓ ${matched.name} başarıyla tarandı!`);
                            
                            // Trigger beep sound
                            try {
                              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                              const osc = audioCtx.createOscillator();
                              const gain = audioCtx.createGain();
                              osc.connect(gain);
                              gain.connect(audioCtx.destination);
                              osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
                              gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                              osc.start();
                              osc.stop(audioCtx.currentTime + 0.1);
                            } catch (e) {}
                          }
                        } else {
                          setTerminalScannedProduct(null);
                        }
                      }}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 outline-none focus:border-orange-500"
                    >
                      <option value="">-- Lütfen bir ürün barkodu seçin --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {getLocalizedField(p.name, language || "tr")} ({p.sku || p.barcode || "KODSUZ"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Scanned Card Results (Product, Shelf or Placeholder) */}
                  {terminalScannedProduct ? (
                    <div className="rounded-2xl border border-slate-800 bg-[#121c35] p-3.5 space-y-3 shadow-inner animate-fadeIn">
                      <div>
                        <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
                          Ürün Tarandı: {terminalScannedProduct.sku || terminalScannedProduct.barcode || "Mevcut"}
                        </span>
                        <h4 className="text-xs font-black text-slate-100 mt-1.5 leading-snug">
                          {terminalScannedProduct.name}
                        </h4>
                        <p className="text-[9px] text-slate-700 font-bold font-bold">Marka: {terminalScannedProduct.brand || "Belirtilmedi"} | Konum: {terminalScannedProduct.warehouse || "—"} - {terminalScannedProduct.shelf || "—"}</p>
                      </div>

                      {/* Stock Adjuster Row */}
                      <div className="flex items-center justify-between gap-3 bg-[#0c1224] p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-[8px] font-black text-slate-900 font-extrabold block uppercase tracking-wider">Depo Stoğu</span>
                          <span className="text-sm font-black text-orange-400">{terminalScannedProduct.quantity || "0"} Adet</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const currentQty = parseInt(terminalScannedProduct.quantity || "0");
                              const nextQty = Math.max(0, currentQty - 1);
                              
                              // Mutate global products state
                              const updated = products.map(p => {
                                if (p.id === terminalScannedProduct.id) {
                                  const updatedProd = { ...p, quantity: String(nextQty) };
                                  setTerminalScannedProduct(updatedProd);
                                  return updatedProd;
                                }
                                return p;
                              });
                              setProducts(updated);
                              safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                              setTerminalMessage("Stok miktarı -1 azaltıldı.");
                            }}
                            className="w-8 h-8 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-black border border-rose-600/30 flex items-center justify-center transition active:scale-95 text-sm"
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentQty = parseInt(terminalScannedProduct.quantity || "0");
                              const nextQty = currentQty + 1;
                              
                              // Mutate global products state
                              const updated = products.map(p => {
                                if (p.id === terminalScannedProduct.id) {
                                  const updatedProd = { ...p, quantity: String(nextQty) };
                                  setTerminalScannedProduct(updatedProd);
                                  return updatedProd;
                                }
                                return p;
                              });
                              setProducts(updated);
                              safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                              setTerminalMessage("Stok miktarı +1 artırıldı.");
                            }}
                            className="w-8 h-8 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-black border border-emerald-600/30 flex items-center justify-center transition active:scale-95 text-sm"
                          >
                            +1
                          </button>
                        </div>
                      </div>

                      {/* Shelf Relocate Input */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-900 font-extrabold block uppercase tracking-wider">
                          Depo Raf Konumu / Adresi
                        </label>
                        <input
                          type="text"
                          value={terminalScannedProduct.shelf || ""}
                          onChange={(e) => {
                            const newShelf = e.target.value;
                            const updated = products.map(p => {
                              if (p.id === terminalScannedProduct.id) {
                                const updatedProd = { ...p, shelf: newShelf };
                                setTerminalScannedProduct(updatedProd);
                                return updatedProd;
                              }
                              return p;
                            });
                            setProducts(updated);
                            safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                          }}
                          placeholder="Raf Konumu örn: A-01, B-12"
                          className="w-full rounded-lg bg-[#0c1224] border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 outline-none focus:border-blue-500 font-mono" id="id-page-w-full-rounded-lg-bg---0c1224--border-border-slate-800-px-3-py-1-5-text-xs-font-semibold-text-slate-100-outline-none-focus-border-blue-500-font-mono-265" aria-label="W full rounded lg bg   0c1224  border border slate 800 px 3 py 1 5 text xs font semibold text slate 100 outline none focus border blue 500 font mono" />
                      </div>
                    </div>
                  ) : terminalScannedShelf ? (
                    <div className="rounded-2xl border border-slate-800 bg-[#121c35] p-3.5 space-y-3 shadow-inner animate-fadeIn">
                      <div className="flex justify-between items-start border-b border-slate-850 pb-2">
                        <div>
                          <span className="text-[8px] font-black bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
                            Raf Tarandı
                          </span>
                          <h4 className="text-xs font-black text-slate-100 mt-1.5">
                            📍 Raf: {terminalScannedShelf}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`${terminalScannedShelf} konumundaki tüm ürün bağlarını kaldırmak istediğinize emin misiniz?`)) {
                              const updated = products.map(p => {
                                if (p.shelf && p.shelf.toLowerCase() === terminalScannedShelf.toLowerCase()) {
                                  return { ...p, shelf: "" };
                                }
                                return p;
                              });
                              setProducts(updated);
                              safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                              setTerminalMessage(`✓ Raf ${terminalScannedShelf} boşaltıldı.`);
                            }
                          }}
                          className="text-[9px] font-bold text-rose-450 hover:text-rose-400 bg-rose-500/5 px-2 py-1 rounded border border-rose-500/10"
                        >
                          Tümünü Boşalt
                        </button>
                      </div>

                      {/* Products list on this shelf */}
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {products.filter(p => p.shelf && p.shelf.toLowerCase() === terminalScannedShelf.toLowerCase()).length > 0 ? (
                          products.filter(p => p.shelf && p.shelf.toLowerCase() === terminalScannedShelf.toLowerCase()).map(p => (
                            <div key={p.id} className="bg-[#0b1122] border border-slate-800/80 rounded-xl p-2 flex justify-between items-center text-xs">
                              <div className="truncate pr-2">
                                <span className="font-bold text-slate-200 block truncate">{getLocalizedField(p.name, language || "tr")}</span>
                                <span className="text-[9px] text-slate-900 font-extrabold font-mono">SKU: {p.sku || "—"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-orange-400 font-black text-[11px] font-mono mr-1">{p.quantity || "0"} ad</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextQty = Math.max(0, parseInt(p.quantity || "0") - 1);
                                    const updated = products.map(prod => prod.id === p.id ? { ...prod, quantity: String(nextQty) } : prod);
                                    setProducts(updated);
                                    safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                                  }}
                                  className="w-5 h-5 rounded bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextQty = parseInt(p.quantity || "0") + 1;
                                    const updated = products.map(prod => prod.id === p.id ? { ...prod, quantity: String(nextQty) } : prod);
                                    setProducts(updated);
                                    safeSetLocalStorage(`hbs-store-products-${storeSlug}`, JSON.stringify(updated));
                                  }}
                                  className="w-5 h-5 rounded bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-900 font-extrabold italic py-2 text-center">Bu rafa kayıtlı envanter yok.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center space-y-1 select-none">
                      <p className="text-xs font-bold text-slate-700 font-bold font-sans">Giriş Bekleniyor</p>
                      <p className="text-[9px] text-slate-900 font-extrabold font-bold leading-normal">
                        Barkod okuyucuyla okutun, üstteki kutudan seçin ya da manuel kod yazıp OKUT'a basın. (Örn: A-01, TT-MASTER-01)
                      </p>
                    </div>
                  )}

                  {/* Terminal Console Feedback Message */}
                  {terminalMessage && (
                    <div className="rounded-xl bg-orange-500/5 border border-orange-500/10 p-2 text-center text-[9px] font-black text-orange-400 tracking-wide animate-fadeIn">
                      💡 {terminalMessage}
                    </div>
                  )}
                </div>

                {/* Industrial Hardware Orange Trigger Button */}
                <div className="pt-3 border-t border-slate-800/60 flex flex-col gap-1.5 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
                        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                        osc.start();
                        osc.stop(audioCtx.currentTime + 0.15);
                      } catch (e) {}

                      if (terminalScannedProduct) {
                        setTerminalMessage(`[SAYIM BAŞARILI] ${terminalScannedProduct.name} depo konumu (${terminalScannedProduct.shelf || "Belirtilmedi"}) ve ${terminalScannedProduct.quantity} adet stok başarıyla doğrulandı.`);
                      } else if (terminalScannedShelf) {
                        setTerminalMessage(`[SAYIM BAŞARILI] Raf ${terminalScannedShelf} üzerindeki tüm ürünlerin sayımları onaylandı.`);
                      } else {
                        alert("Lütfen önce bir ürün barkodu veya raf kodu seçerek tarama yapın.");
                      }
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-black text-xs shadow-lg tracking-widest uppercase active:scale-[0.98] transition border border-orange-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🎯</span> SAYIMI ONAYLA & KİLİTLE
                  </button>
                  <span className="text-[8px] text-slate-900 font-extrabold text-center font-bold">
                    HBS WAREHOUSE SYSTEM INDEPENDENT CONTROLLER
                  </span>
                </div>

              </div>

              {/* Local Keyframe Animation block */}
              <style>{`
                @keyframes scanLine {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }
                .animate-scanLine {
                  position: absolute;
                  animation: scanLine 3s infinite linear;
                }
              `}</style>

            </div>
          </div>
        )}

        {/* Floating Scanner Activation Widget (FAB) */}
        <button
          type="button"
          onClick={() => {
            setIsTerminalOpen(true);
            playBeep();
          }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border border-orange-400/40 ring-4 ring-orange-500/10 cursor-pointer"
          title="Depo Barkod El Terminali"
        >
          <span className="text-xl animate-pulse">📱</span>
        </button>
      </div>
    </main>
  );
}