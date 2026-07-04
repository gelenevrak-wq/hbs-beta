"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Types
type StoreOwner = {
  code: string;
  name: string;
  representative: string;
  email: string;
  password?: string;
  address?: string;
  phone?: string;
  operatingModel?: string;
  warehouses?: any[];
  isActive?: boolean;
};

type StoreStaff = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  storeSlugs: string[];
  password?: string;
};

type CustomerUser = {
  username: string;
  displayName: string;
  phone: string;
  address: string;
  password?: string;
  role: string;
  signedInAt?: string;
};

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "warehouses" | "raw">("users");

  // Success / Error messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Data States
  const [stores, setStores] = useState<StoreOwner[]>([]);
  const [staff, setStaff] = useState<StoreStaff[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);

  // Filters & Sub-tabs
  const [userSubTab, setUserSubTab] = useState<"stores" | "staff" | "customers">("stores");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit States
  const [editingUserType, setEditingUserType] = useState<"store" | "staff" | "customer" | null>(null);
  const [editingUserObj, setEditingUserObj] = useState<any>(null);

  // Warehouse Edit States
  const [editingWhStoreCode, setEditingWhStoreCode] = useState<string | null>(null);
  const [editingWhObj, setEditingWhObj] = useState<any>(null);
  const [isAddingWarehouse, setIsAddingWarehouse] = useState<string | null>(null); // storeCode
  
  // New Warehouse form fields
  const [newWhName, setNewWhName] = useState("");
  const [newWhPurpose, setNewWhPurpose] = useState("");
  const [newWhCity, setNewWhCity] = useState("Batumi");
  const [newWhCapacity, setNewWhCapacity] = useState(500);
  const [newWhZones, setNewWhZones] = useState("A, B");
  const [newWhShelves, setNewWhShelves] = useState("A-01, B-01");
  const [newWhVisible, setNewWhVisible] = useState(false);

  useEffect(() => {
    // 1. Auth check
    const userStr = window.localStorage.getItem("hbs-current-user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Auth check error:", e);
      }
    }
    setLoading(false);

    // 2. Load lists
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      // Load Stores
      const storesStr = window.localStorage.getItem("hbs-registered-stores");
      const loadedStores = storesStr ? JSON.parse(storesStr) : [];
      // Ensure Altan Cancı is present if empty
      if (loadedStores.length === 0) {
        const defaultStores = [
          {
            code: "obdtr",
            name: "OBDTR Diagnostics",
            representative: "Altan Cancı",
            email: "altancanci@obdtr.com",
            password: "CANCI35",
            address: "Batumi, Georgia",
            phone: "+995 555 123 456",
            operatingModel: "hybrid",
            warehouses: [
              { id: "main", name: "Ana Depo", purpose: "Satışa hazır ürün stoğu", customerVisible: false, city: "Batumi", zones: ["A", "B", "C", "D"], shelves: ["A-01", "A-02", "B-01"], capacity: 1000, used: 120 },
              { id: "return", name: "İade / Kontrol Deposu", purpose: "İade, arızalı ürünler", customerVisible: false, city: "Batumi", zones: ["R"], shelves: ["R-01"], capacity: 200, used: 10 }
            ]
          }
        ];
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify(defaultStores));
        setStores(defaultStores);
      } else {
        setStores(loadedStores);
      }

      // Load Staff
      const staffStr = window.localStorage.getItem("hbs-store-users");
      const loadedStaff = staffStr ? JSON.parse(staffStr) : [];
      if (loadedStaff.length === 0) {
        const defaultStaff = [
          { id: "staff-1", username: "ALTANCANCI", displayName: "Altan Cancı", role: "owner", storeSlugs: ["obdtr"], password: "CANCI35" },
          { id: "staff-2", username: "ALIMAN", displayName: "Ali Man", role: "manager", storeSlugs: ["obdtr"], password: "ALIMAN99" },
          { id: "staff-3", username: "GIO", displayName: "Giorgi", role: "sales", storeSlugs: ["obdtr"], password: "GIO88" }
        ];
        window.localStorage.setItem("hbs-store-users", JSON.stringify(defaultStaff));
        setStaff(defaultStaff);
      } else {
        setStaff(loadedStaff);
      }

      // Load Customers
      const customersStr = window.localStorage.getItem("hbs-customers-list");
      const loadedCustomers = customersStr ? JSON.parse(customersStr) : [];
      if (loadedCustomers.length === 0) {
        const defaultCustomers = [
          { username: "demo-musteri@email.com", displayName: "Demo Müşteri", phone: "+90 555 123 4567", address: "Kadıköy, İstanbul", password: "MUSTERI123", role: "customer" }
        ];
        window.localStorage.setItem("hbs-customers-list", JSON.stringify(defaultCustomers));
        setCustomers(defaultCustomers);
      } else {
        setCustomers(loadedCustomers);
      }
    } catch (e) {
      console.error("Data loading error", e);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  // User Actions
  const handleEditUser = (type: "store" | "staff" | "customer", obj: any) => {
    setEditingUserType(type);
    setEditingUserObj({ ...obj });
  };

  const handleSaveUser = () => {
    if (!editingUserObj) return;

    try {
      if (editingUserType === "store") {
        const updatedStores = stores.map((s) =>
          s.code === editingUserObj.code
            ? {
                ...s,
                representative: editingUserObj.representative,
                email: editingUserObj.email,
                password: editingUserObj.password,
                address: editingUserObj.address,
                phone: editingUserObj.phone,
                name: editingUserObj.name,
              }
            : s
        );
        window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
        setStores(updatedStores);
        showSuccess("Mağaza Sahibi bilgileri başarıyla güncellendi.");
      } else if (editingUserType === "staff") {
        const updatedStaff = staff.map((st) =>
          st.id === editingUserObj.id
            ? {
                ...st,
                displayName: editingUserObj.displayName,
                username: editingUserObj.username,
                password: editingUserObj.password,
                role: editingUserObj.role,
              }
            : st
        );
        window.localStorage.setItem("hbs-store-users", JSON.stringify(updatedStaff));
        setStaff(updatedStaff);
        showSuccess("Personel bilgileri ve şifresi güncellendi.");
      } else if (editingUserType === "customer") {
        const updatedCustomers = customers.map((c) =>
          c.username === editingUserObj.username
            ? {
                ...c,
                displayName: editingUserObj.displayName,
                phone: editingUserObj.phone,
                address: editingUserObj.address,
                password: editingUserObj.password,
              }
            : c
        );
        window.localStorage.setItem("hbs-customers-list", JSON.stringify(updatedCustomers));
        setCustomers(updatedCustomers);
        showSuccess("Müşteri bilgileri, şifre ve adres detayları güncellendi.");
      }
      setEditingUserType(null);
      setEditingUserObj(null);
    } catch (e: any) {
      showError(`Kayıt sırasında hata oluştu: ${e.message || e}`);
    }
  };

  const handleToggleStoreActive = (storeCode: string) => {
    try {
      const updatedStores = stores.map((s) =>
        s.code === storeCode ? { ...s, isActive: s.isActive === false ? true : false } : s
      );
      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      setStores(updatedStores);
      const targetStore = updatedStores.find((s) => s.code === storeCode);
      showSuccess(`Mağaza durumu güncellendi: ${targetStore?.isActive !== false ? "Aktif" : "Pasif"}`);
    } catch (e: any) {
      showError(`Mağaza durumu güncellenirken hata oluştu: ${e.message || e}`);
    }
  };

  const handleDeleteStore = (storeCode: string) => {
    if (!confirm(`Bu mağazayı (${storeCode}) ve tüm ilişkili verilerini platformdan tamamen silmek istediğinize emin misiniz?`)) return;

    try {
      // Remove the store
      const updatedStores = stores.filter((s) => s.code !== storeCode);
      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      setStores(updatedStores);

      // Clean up staff associated with this store only
      const updatedStaff = staff.map((st) => ({
        ...st,
        storeSlugs: st.storeSlugs.filter((slug) => slug !== storeCode)
      })).filter((st) => st.storeSlugs.length > 0);
      window.localStorage.setItem("hbs-store-users", JSON.stringify(updatedStaff));
      setStaff(updatedStaff);

      showSuccess(`Mağaza (${storeCode}) platformdan tamamen silindi.`);
    } catch (e: any) {
      showError(`Mağaza silinirken hata oluştu: ${e.message || e}`);
    }
  };

  // Warehouse Actions
  const handleEditWarehouse = (storeCode: string, wh: any) => {
    setEditingWhStoreCode(storeCode);
    setEditingWhObj({
      ...wh,
      zonesStr: Array.isArray(wh.zones) ? wh.zones.join(", ") : wh.zones || "",
      shelvesStr: Array.isArray(wh.shelves) ? wh.shelves.join(", ") : wh.shelves || ""
    });
  };

  const handleSaveWarehouse = () => {
    if (!editingWhStoreCode || !editingWhObj) return;

    try {
      const parsedZones = editingWhObj.zonesStr
        .split(",")
        .map((z: string) => z.trim().toUpperCase())
        .filter((z: string) => z !== "");
      
      const parsedShelves = editingWhObj.shelvesStr
        .split(",")
        .map((s: string) => s.trim().toUpperCase())
        .filter((s: string) => s !== "");

      const updatedStores = stores.map((s) => {
        if (s.code === editingWhStoreCode) {
          const updatedWhList = (s.warehouses || []).map((w) =>
            w.id === editingWhObj.id
              ? {
                  ...w,
                  name: editingWhObj.name,
                  purpose: editingWhObj.purpose,
                  city: editingWhObj.city,
                  capacity: Number(editingWhObj.capacity),
                  customerVisible: editingWhObj.customerVisible,
                  zones: parsedZones,
                  shelves: parsedShelves
                }
              : w
          );
          return { ...s, warehouses: updatedWhList };
        }
        return s;
      });

      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      setStores(updatedStores);
      setEditingWhStoreCode(null);
      setEditingWhObj(null);
      showSuccess("Depo düzeni ve raf konfigürasyonları başarıyla güncellendi.");
    } catch (e: any) {
      showError(`Depo güncellenirken hata oluştu: ${e.message || e}`);
    }
  };

  const handleDeleteWarehouse = (storeCode: string, whId: string) => {
    if (!confirm("Bu depoyu silmek istediğinize emin misiniz?")) return;

    try {
      const updatedStores = stores.map((s) => {
        if (s.code === storeCode) {
          const updatedWhList = (s.warehouses || []).filter((w) => w.id !== whId);
          return { ...s, warehouses: updatedWhList };
        }
        return s;
      });

      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      setStores(updatedStores);
      showSuccess("Depo platformdan kaldırıldı.");
    } catch (e: any) {
      showError(`Depo silinirken hata oluştu: ${e.message || e}`);
    }
  };

  const handleAddWarehouse = (storeCode: string) => {
    setIsAddingWarehouse(storeCode);
    setNewWhName("");
    setNewWhPurpose("");
    setNewWhCity("Batumi");
    setNewWhCapacity(500);
    setNewWhZones("A, B");
    setNewWhShelves("A-01, B-01");
    setNewWhVisible(false);
  };

  const handleSaveNewWarehouse = () => {
    if (!isAddingWarehouse) return;

    if (!newWhName.trim() || !newWhPurpose.trim()) {
      showError("Depo adı ve kullanım amacı alanları zorunludur.");
      return;
    }

    try {
      const parsedZones = newWhZones
        .split(",")
        .map((z) => z.trim().toUpperCase())
        .filter((z) => z !== "");
      
      const parsedShelves = newWhShelves
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s !== "");

      const newWh = {
        id: `wh-${Date.now()}`,
        name: newWhName.trim(),
        purpose: newWhPurpose.trim(),
        city: newWhCity,
        capacity: Number(newWhCapacity),
        customerVisible: newWhVisible,
        zones: parsedZones,
        shelves: parsedShelves,
        used: 0
      };

      const updatedStores = stores.map((s) => {
        if (s.code === isAddingWarehouse) {
          return { ...s, warehouses: [...(s.warehouses || []), newWh] };
        }
        return s;
      });

      window.localStorage.setItem("hbs-registered-stores", JSON.stringify(updatedStores));
      setStores(updatedStores);
      setIsAddingWarehouse(null);
      showSuccess("Yeni depo başarıyla eklendi.");
    } catch (e: any) {
      showError(`Depo eklenirken hata oluştu: ${e.message || e}`);
    }
  };

  // Factory reset
  const handleFactoryReset = () => {
    if (!confirm("Tüm platform verilerini sıfırlayarak varsayılan demo ayarlarına geri dönmek istediğinize emin misiniz?")) return;

    try {
      window.localStorage.removeItem("hbs-registered-stores");
      window.localStorage.removeItem("hbs-store-users");
      window.localStorage.removeItem("hbs-customers-list");
      loadAllData();
      showSuccess("Platform verileri varsayılan demo değerlerine sıfırlandı!");
    } catch (e: any) {
      showError(`Sıfırlama hatası: ${e.message || e}`);
    }
  };

  // Filter Logic
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.representative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staff.filter(
    (st) =>
      st.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">HBS Admin Paneli Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Access control
  if (currentUser?.role !== "superadmin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-955 p-6 text-slate-800">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-red-50 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-650 text-3xl">⚠️</div>
          <h1 className="text-xl font-black uppercase tracking-wider text-red-800">Erişim Engellendi</h1>
          <p className="mt-3 text-xs leading-relaxed text-red-600">
            Bu panel yalnızca platform sahiplerine (`superadmin`) yöneliktir. Giriş yaptığınız hesap yetersizdir.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-55">
              Ana Sayfa
            </Link>
            <Link href="/login" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500">
              Yönetici Girişi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <DashboardLayout activeMenu="Platform Yönetimi">
      <div className="space-y-4">
        
        {/* Header Block */}
        <header className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-900 to-indigo-955 p-6 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600/30 text-blue-200 border-l border-b border-white/10 px-4 py-1 text-[10px] font-black rounded-bl-2xl uppercase tracking-wider">
            ★ Platform Sahibi Modu ★
          </div>
          <div className="space-y-2">
            <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">
              SÜPER YÖNETİCİ PANELİ
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white">
              HBS Platform Kontrol Merkezi
            </h1>
            <p className="mt-2 max-w-4xl text-xs sm:text-sm leading-relaxed text-blue-200/80">
              Platformdaki tüm mağaza sahiplerinin, çalışanların ve ziyaretçilerin hesaplarını, adreslerini, şifrelerini ve mağaza depo yerleşimlerini bu panelden kontrol edebilirsiniz.
            </p>
          </div>
        </header>

        {/* Action Feedbacks */}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-black text-emerald-800 shadow-sm animate-fadeIn">
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-2xl border border-red-500/20 bg-red-50 p-4 text-xs font-black text-red-800 shadow-sm animate-fadeIn">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Global Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${
              activeTab === "users"
                ? "bg-blue-650 text-white shadow-md"
                : "text-slate-650 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            👤 Kullanıcı & Hesap Yönetimi
          </button>
          <button
            onClick={() => setActiveTab("warehouses")}
            className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${
              activeTab === "warehouses"
                ? "bg-blue-650 text-white shadow-md"
                : "text-slate-650 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            📦 Mağaza Depo Düzenleri
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${
              activeTab === "raw"
                ? "bg-blue-650 text-white shadow-md"
                : "text-slate-650 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            ⚙️ Sistem Sağlığı & Veri Konsolu
          </button>
        </div>

        {/* Tab content 1: Users */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl shadow-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => setUserSubTab("stores")}
                  className={`px-4 py-2 text-[11px] font-black rounded-xl transition ${
                    userSubTab === "stores"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🏪 Mağaza Sahipleri ({stores.length})
                </button>
                <button
                  onClick={() => setUserSubTab("staff")}
                  className={`px-4 py-2 text-[11px] font-black rounded-xl transition ${
                    userSubTab === "staff"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-650 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  👥 Mağaza Personeli ({staff.length})
                </button>
                <button
                  onClick={() => setUserSubTab("customers")}
                  className={`px-4 py-2 text-[11px] font-black rounded-xl transition ${
                    userSubTab === "customers"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  👤 Ziyaretçiler ({customers.length})
                </button>
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Kullanıcı veya bilgi ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {userSubTab === "stores" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-4">Kod</th>
                      <th className="p-4">Durum</th>
                      <th className="p-4">Firma Adı</th>
                      <th className="p-4">Temsilci</th>
                      <th className="p-4">E-posta</th>
                      <th className="p-4">Şifre</th>
                      <th className="p-4">Adres</th>
                      <th className="p-4">Telefon</th>
                      <th className="p-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredStores.map((s) => (
                      <tr key={s.code} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-blue-600">{s.code}</td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            s.isActive !== false
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {s.isActive !== false ? "Aktif" : "Pasif"}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{s.name}</td>
                        <td className="p-4">{s.representative}</td>
                        <td className="p-4 font-mono text-slate-500">{s.email}</td>
                        <td className="p-4 font-mono font-bold text-slate-800 bg-amber-50/40">{s.password || "—"}</td>
                        <td className="p-4 max-w-xs truncate">{s.address || "—"}</td>
                        <td className="p-4 font-mono">{s.phone || "—"}</td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleToggleStoreActive(s.code)}
                            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-black border transition ${
                              s.isActive !== false
                                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/50"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50"
                            }`}
                          >
                            {s.isActive !== false ? "Pasifleştir ⏸️" : "Aktifleştir ▶️"}
                          </button>
                          <button
                            onClick={() => handleEditUser("store", s)}
                            className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-black text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                          >
                            Düzenle 📝
                          </button>
                          <button
                            onClick={() => handleDeleteStore(s.code)}
                            className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-black text-red-700 border border-red-200 hover:bg-red-100 transition"
                          >
                            Sil 🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredStores.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400">Eşleşen mağaza sahibi bulunamadı.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {userSubTab === "staff" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-4">Kullanıcı Adı</th>
                      <th className="p-4">İsim Soyisim</th>
                      <th className="p-4">Sistem Rolü</th>
                      <th className="p-4">Mağaza Yetkisi</th>
                      <th className="p-4">Giriş Şifresi</th>
                      <th className="p-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredStaff.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-900">{st.username}</td>
                        <td className="p-4 font-bold">{st.displayName}</td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            st.role === "owner" ? "bg-red-50 text-red-700 border border-red-200" :
                            st.role === "manager" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            st.role === "sales" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            "bg-slate-50 text-slate-650 border border-slate-200"
                          }`}>
                            {st.role}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-500">{st.storeSlugs.join(", ")}</td>
                        <td className="p-4 font-mono font-bold text-slate-800 bg-amber-50/40">{st.password || "—"}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleEditUser("staff", st)}
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 hover:bg-blue-100 transition"
                          >
                            Düzenle 📝
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredStaff.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">Eşleşen personel kaydı bulunamadı.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {userSubTab === "customers" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-4">Kullanıcı (E-posta)</th>
                      <th className="p-4">İsim Soyisim</th>
                      <th className="p-4">Telefon</th>
                      <th className="p-4">Şifre</th>
                      <th className="p-4">Teslimat Adresi</th>
                      <th className="p-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredCustomers.map((c) => (
                      <tr key={c.username} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-900">{c.username}</td>
                        <td className="p-4 font-bold">{c.displayName}</td>
                        <td className="p-4 font-mono">{c.phone || "—"}</td>
                        <td className="p-4 font-mono font-bold text-slate-800 bg-amber-50/40">{c.password || "MUSTERI123"}</td>
                        <td className="p-4 max-w-sm truncate">{c.address || "—"}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleEditUser("customer", c)}
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 hover:bg-blue-100 transition"
                          >
                            Düzenle 📝
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">Eşleşen ziyaretçi bulunamadı.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Edit User Modal */}
            {editingUserObj && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-scaleUp">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">
                      {editingUserType === "store" ? "🏪 Mağaza Sahibi Düzenle" :
                       editingUserType === "staff" ? "👥 Personel Hesabı Düzenle" :
                       "👤 Ziyaretçi/Müşteri Düzenle"}
                    </h3>
                    <button
                      onClick={() => { setEditingUserType(null); setEditingUserObj(null); }}
                      className="text-slate-450 hover:text-slate-700 text-lg font-black"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Display name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {editingUserType === "store" ? "Firma Temsilcisi" : "Görünen İsim / Ad Soyad"}
                      </label>
                      <input
                        type="text"
                        value={editingUserObj.displayName || editingUserObj.representative || ""}
                        onChange={(e) =>
                          setEditingUserObj(
                            editingUserType === "store"
                              ? { ...editingUserObj, representative: e.target.value }
                              : { ...editingUserObj, displayName: e.target.value }
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Email / Username */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {editingUserType === "staff" ? "Kullanıcı Adı" : "E-posta / Kullanıcı Adı"}
                      </label>
                      <input
                        type="text"
                        disabled={editingUserType === "store"} // code/store slugs lock
                        value={editingUserObj.username || editingUserObj.email || ""}
                        onChange={(e) =>
                          setEditingUserObj(
                            editingUserType === "store"
                              ? { ...editingUserObj, email: e.target.value }
                              : { ...editingUserObj, username: e.target.value }
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Giriş Şifresi (Değiştirilebilir)
                      </label>
                      <input
                        type="text"
                        placeholder="Yeni şifre girin"
                        value={editingUserObj.password || ""}
                        onChange={(e) => setEditingUserObj({ ...editingUserObj, password: e.target.value })}
                        className="w-full rounded-xl border border-amber-300 bg-amber-50/20 px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Phone */}
                    {(editingUserType === "store" || editingUserType === "customer") && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Telefon Numarası
                        </label>
                        <input
                          type="text"
                          value={editingUserObj.phone || ""}
                          onChange={(e) => setEditingUserObj({ ...editingUserObj, phone: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Address */}
                    {(editingUserType === "store" || editingUserType === "customer") && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Fiziksel Mağaza veya Teslimat Adresi
                        </label>
                        <textarea
                          rows={3}
                          value={editingUserObj.address || ""}
                          onChange={(e) => setEditingUserObj({ ...editingUserObj, address: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Role for staff */}
                    {editingUserType === "staff" && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Erişim Rolü
                        </label>
                        <select
                          value={editingUserObj.role || "viewer"}
                          onChange={(e) => setEditingUserObj({ ...editingUserObj, role: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="owner">Owner (Mağaza Sahibi)</option>
                          <option value="manager">Manager (Yönetici)</option>
                          <option value="sales">Sales (Satış)</option>
                          <option value="warehouse">Warehouse (Depo Sorumlusu)</option>
                          <option value="viewer">Viewer (İzleyici)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => { setEditingUserType(null); setEditingUserObj(null); }}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSaveUser}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-500"
                    >
                      Değişiklikleri Kaydet 💾
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab content 2: Warehouses */}
        {activeTab === "warehouses" && (
          <div className="space-y-6">
            
            {/* Store Selection Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {stores.map((s) => (
                <div key={s.code} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">MAĞAZA DETAYI</span>
                      <h2 className="text-lg font-black text-slate-900">{s.name}</h2>
                      <p className="text-[11px] text-slate-500">Temsilci: <strong className="text-slate-700">{s.representative}</strong> ({s.code})</p>
                    </div>
                    <button
                      onClick={() => handleAddWarehouse(s.code)}
                      className="rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition"
                    >
                      + Depo Ekle
                    </button>
                  </div>

                  {/* Warehouse list inside store */}
                  <div className="space-y-3">
                    {s.warehouses && s.warehouses.length > 0 ? (
                      s.warehouses.map((w: any) => (
                        <div key={w.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 hover:border-blue-200 transition">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 text-sm">{w.name}</h3>
                                {w.customerVisible && (
                                  <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[8px] font-black text-blue-600 uppercase tracking-wider">
                                    VİTRİNE AÇIK
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 italic mt-0.5">{w.purpose}</p>
                              
                              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600 font-semibold">
                                <div>📍 Şehir: <span className="text-slate-950 font-bold">{w.city}</span></div>
                                <div>📦 Kapasite: <span className="text-slate-950 font-bold">{w.capacity}</span></div>
                                <div className="col-span-2 mt-1">
                                  🏷️ Bölgeler (Zones):{" "}
                                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                                    {Array.isArray(w.zones) ? w.zones.join(", ") : w.zones || "—"}
                                  </span>
                                </div>
                                <div className="col-span-2 mt-1.5">
                                  🗄️ Raf Düzenleri (Shelves):{" "}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {w.shelves && w.shelves.length > 0 ? (
                                      w.shelves.map((sh: string) => (
                                        <span key={sh} className="font-mono text-[9px] font-black bg-slate-200/80 border border-slate-300 text-slate-800 px-1 rounded">
                                          {sh}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">Raf tanımlanmamış.</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => handleEditWarehouse(s.code, w)}
                                className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[10px] font-black text-blue-700 hover:bg-blue-50 shadow-sm"
                              >
                                Düzenle 📝
                              </button>
                              <button
                                onClick={() => handleDeleteWarehouse(s.code, w.id)}
                                className="rounded-lg bg-white border border-red-200 px-2.5 py-1 text-[10px] font-black text-red-650 hover:bg-red-50 shadow-sm"
                              >
                                Sil 🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-405 italic p-4 text-center">Mağazaya bağlı etkin depo kaydı yok.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Warehouse Modal */}
            {editingWhObj && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-scaleUp">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">📦 Depo Düzeni ve Rafları Düzenle</h3>
                    <button
                      onClick={() => { setEditingWhStoreCode(null); setEditingWhObj(null); }}
                      className="text-slate-450 hover:text-slate-700 text-lg font-black"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Depo Adı</label>
                        <input
                          type="text"
                          value={editingWhObj.name || ""}
                          onChange={(e) => setEditingWhObj({ ...editingWhObj, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bulunduğu Şehir</label>
                        <input
                          type="text"
                          value={editingWhObj.city || ""}
                          onChange={(e) => setEditingWhObj({ ...editingWhObj, city: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kullanım Amacı</label>
                      <input
                        type="text"
                        value={editingWhObj.purpose || ""}
                        onChange={(e) => setEditingWhObj({ ...editingWhObj, purpose: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Maksimum Kapasite (Koli/Ürün)</label>
                        <input
                          type="number"
                          value={editingWhObj.capacity || 0}
                          onChange={(e) => setEditingWhObj({ ...editingWhObj, capacity: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingWhObj.customerVisible || false}
                            onChange={(e) => setEditingWhObj({ ...editingWhObj, customerVisible: e.target.checked })}
                            className="rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                          />
                          Müşteri Portalında Görünsün (Showroom)
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Depo Bölgeleri (Bölünmüş Harf Kodları)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: A, B, C, D"
                        value={editingWhObj.zonesStr || ""}
                        onChange={(e) => setEditingWhObj({ ...editingWhObj, zonesStr: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Virgülle ayırarak girin.</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Raf Kodları (Depo İçi Lokasyonlar)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Örn: A-01, A-02, B-01, B-02"
                        value={editingWhObj.shelvesStr || ""}
                        onChange={(e) => setEditingWhObj({ ...editingWhObj, shelvesStr: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Virgülle ayırarak lokasyon kodlarını girin. Depo Scanner cihazlarında raf seçerken bu listenin güncelliği sorgulanır.</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => { setEditingWhStoreCode(null); setEditingWhObj(null); }}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSaveWarehouse}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-500"
                    >
                      Depo Düzenini Kaydet 💾
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Warehouse Modal */}
            {isAddingWarehouse && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-scaleUp">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">➕ Yeni Depo Ekle</h3>
                    <button
                      onClick={() => setIsAddingWarehouse(null)}
                      className="text-slate-450 hover:text-slate-700 text-lg font-black"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Depo Adı</label>
                        <input
                          type="text"
                          placeholder="Örn: Gürcistan Sınır Deposu"
                          value={newWhName}
                          onChange={(e) => setNewWhName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Şehir</label>
                        <input
                          type="text"
                          placeholder="Örn: Batumi"
                          value={newWhCity}
                          onChange={(e) => setNewWhCity(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kullanım Amacı</label>
                      <input
                        type="text"
                        placeholder="Örn: Gümrük ve transit geçiş yedek parça depolaması"
                        value={newWhPurpose}
                        onChange={(e) => setNewWhPurpose(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kapasite</label>
                        <input
                          type="number"
                          value={newWhCapacity}
                          onChange={(e) => setNewWhCapacity(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newWhVisible}
                            onChange={(e) => setNewWhVisible(e.target.checked)}
                            className="rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                          />
                          Müşteri Portalında Görünsün
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bölgeler (Bölge Kodları)</label>
                      <input
                        type="text"
                        placeholder="Örn: A, B, C"
                        value={newWhZones}
                        onChange={(e) => setNewWhZones(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Raflar (Raf Konumları)</label>
                      <input
                        type="text"
                        placeholder="Örn: A-01, A-02, B-01"
                        value={newWhShelves}
                        onChange={(e) => setNewWhShelves(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setIsAddingWarehouse(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSaveNewWarehouse}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-500"
                    >
                      Depoyu Ekle ➕
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab content 3: System Health & JSON editor */}
        {activeTab === "raw" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900">Sistem Veri Konsolu</h2>
                <p className="text-xs text-slate-500 mt-1">Platformdaki yerel veritabanı (LocalStorage) değişkenlerini kontrol edin, yedekleyin veya demo sürümüne sıfırlayın.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">Veri Sıfırlama ve Kurtarma</h3>
                  <p className="text-xs text-slate-600">Herhangi bir veri bozulması veya test karmaşası durumunda tüm platform ayarlarını ve hesapları fabrika ayarlarına sıfırlayabilirsiniz.</p>
                  <button
                    onClick={handleFactoryReset}
                    className="w-full rounded-xl bg-amber-50 border border-amber-200 py-3 text-xs font-black text-amber-700 hover:bg-amber-100 transition"
                  >
                    ⚠️ Platformu Demo Verilerine Sıfırla
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">Yerel Kayıt İstatistikleri</h3>
                  <div className="space-y-1.5 text-xs text-slate-600 font-semibold">
                    <div className="flex justify-between"><span>Kayıtlı Mağazalar (Stores):</span> <span className="font-mono text-slate-950 font-bold">{stores.length} adet</span></div>
                    <div className="flex justify-between"><span>Personel Hesapları (Staff):</span> <span className="font-mono text-slate-950 font-bold">{staff.length} adet</span></div>
                    <div className="flex justify-between"><span>Kayıtlı Ziyaretçiler (Customers):</span> <span className="font-mono text-slate-950 font-bold">{customers.length} adet</span></div>
                  </div>
                </div>
              </div>

              {/* JSON Previews */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Ham Veritabanı Görüntüleyici</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">hbs-registered-stores (Mağaza ve Depolar)</span>
                    <pre className="mt-1 h-44 overflow-y-auto rounded-xl bg-slate-900 p-3 text-[10px] font-mono text-emerald-400 select-all">
                      {JSON.stringify(stores, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">hbs-store-users (Personeller & Rol Şifreleri)</span>
                    <pre className="mt-1 h-44 overflow-y-auto rounded-xl bg-slate-900 p-3 text-[10px] font-mono text-emerald-400 select-all">
                      {JSON.stringify(staff, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">hbs-customers-list (Ziyaretçiler & Şifreleri)</span>
                    <pre className="mt-1 h-44 overflow-y-auto rounded-xl bg-slate-900 p-3 text-[10px] font-mono text-emerald-400 select-all">
                      {JSON.stringify(customers, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
