"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CustomerStatus = "active" | "limited" | "blocked" | "pending";
type CustomerType = "Bireysel" | "Kurumsal";

type StoreCustomer = {
  id: string;
  name: string;
  type: CustomerType;
  phone: string;
  email: string;
  country: string;
  city: string;
  addressRegion: string;
  status: CustomerStatus;
  totalOrders: number;
  totalRequestCount: number;
  lastActivity: string;
  canSeePrices: boolean;
  canOrder: boolean;
  canUseCurrentAccount: boolean;
  note: string;
};

const initialCustomers: StoreCustomer[] = [
  {
    id: "cust-001",
    name: "Demo Auto Service",
    type: "Kurumsal",
    phone: "+995 555 111 222",
    email: "demo@hbs.ge",
    country: "Georgia",
    city: "Batumi",
    addressRegion: "Batumi Merkez",
    status: "active",
    totalOrders: 4,
    totalRequestCount: 9,
    lastActivity: "Bugün 10:24",
    canSeePrices: true,
    canOrder: true,
    canUseCurrentAccount: true,
    note: "Düzenli oto servis müşterisi. Ford ve Toyota parçalarıyla ilgileniyor.",
  },
  {
    id: "cust-002",
    name: "Batumi Garage",
    type: "Kurumsal",
    phone: "+995 555 333 444",
    email: "garage@hbs.ge",
    country: "Georgia",
    city: "Batumi",
    addressRegion: "Yeni Bulvar",
    status: "limited",
    totalOrders: 1,
    totalRequestCount: 3,
    lastActivity: "Bugün 11:05",
    canSeePrices: true,
    canOrder: false,
    canUseCurrentAccount: false,
    note: "Fiyat görebilir ancak sipariş yetkisi mağaza onayına bağlı.",
  },
  {
    id: "cust-003",
    name: "Giorgi Parts",
    type: "Kurumsal",
    phone: "+995 555 777 888",
    email: "giorgi@hbs.ge",
    country: "Georgia",
    city: "Tbilisi",
    addressRegion: "Tbilisi Merkez",
    status: "pending",
    totalOrders: 0,
    totalRequestCount: 2,
    lastActivity: "Dün 17:40",
    canSeePrices: false,
    canOrder: false,
    canUseCurrentAccount: false,
    note: "Yeni ilişki talebi. Mağaza onayı bekliyor.",
  },
];

function statusText(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "Aktif";
    case "limited":
      return "Sınırlı";
    case "blocked":
      return "Engelli";
    case "pending":
      return "Bekliyor";
  }
}

function statusClass(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-950 text-emerald-200";
    case "limited":
      return "bg-yellow-950 text-yellow-200";
    case "blocked":
      return "bg-red-950 text-red-200";
    case "pending":
      return "bg-blue-950 text-blue-200";
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<StoreCustomer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<StoreCustomer | null>(
    initialCustomers[0] ?? null
  );
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      const matchesSearch =
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.country.toLowerCase().includes(q) ||
        customer.city.toLowerCase().includes(q) ||
        customer.addressRegion.toLowerCase().includes(q) ||
        customer.note.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [customers, statusFilter, search]);

  function updateCustomer(
    customerId: string,
    updates: Partial<StoreCustomer>,
    successMessage: string
  ) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === customerId ? { ...customer, ...updates } : customer
      )
    );

    setSelectedCustomer((currentCustomer) =>
      currentCustomer && currentCustomer.id === customerId
        ? { ...currentCustomer, ...updates }
        : currentCustomer
    );

    setMessage(successMessage);
  }

  function activateCustomer(customer: StoreCustomer) {
    updateCustomer(
      customer.id,
      {
        status: "active",
        canSeePrices: true,
        canOrder: true,
        canUseCurrentAccount: false,
      },
      `${customer.name} aktif müşteri olarak ayarlandı.`
    );
  }

  function limitCustomer(customer: StoreCustomer) {
    updateCustomer(
      customer.id,
      {
        status: "limited",
        canSeePrices: true,
        canOrder: false,
        canUseCurrentAccount: false,
      },
      `${customer.name} için sınırlı yetki tanımlandı.`
    );
  }

  function blockCustomer(customer: StoreCustomer) {
    updateCustomer(
      customer.id,
      {
        status: "blocked",
        canSeePrices: false,
        canOrder: false,
        canUseCurrentAccount: false,
      },
      `${customer.name} engellendi.`
    );
  }

  function togglePermission(
    customer: StoreCustomer,
    permission:
      | "canSeePrices"
      | "canOrder"
      | "canUseCurrentAccount"
  ) {
    updateCustomer(
      customer.id,
      {
        [permission]: !customer[permission],
      },
      `${customer.name} için yetki güncellendi.`
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
              href="/dashboard/customer-requests"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Müşteri Talepleri
            </Link>

            <Link
              href="/dashboard/orders"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Siparişler
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Panel
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                MÜŞTERİ İLİŞKİLERİ
              </p>

              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                Mağaza Müşteri Yönetimi
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                HBS müşterileri genel platform kullanıcısıdır. Bu ekran yalnızca
                müşterinin bu mağaza ile olan ilişki, sipariş, teklif ve yetki
                durumunu yönetir.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
              <h2 className="text-lg font-black text-blue-100">
                Mağaza bazlı yetki
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100/90">
                Müşteri HBS’ye genel kayıt olur. Mağaza fiyat görme, sipariş
                verme veya cari hesap yetkisini sadece kendi mağazası için
                ayrıca tanımlar.
              </p>
            </div>
          </div>
        </section>

        {message && (
          <div className="mb-6 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5 text-sm leading-6 text-blue-100">
            {message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                Müşteri Listesi
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {filteredCustomers.length} kayıt
              </h2>
            </div>

            <div className="mb-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Arama</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
                  placeholder="Müşteri, telefon, e-posta, şehir veya not ara"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Durum</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as CustomerStatus | "all")
                  }
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                >
                  <option value="all">Tüm Müşteriler</option>
                  <option value="active">Aktif</option>
                  <option value="limited">Sınırlı</option>
                  <option value="pending">Bekliyor</option>
                  <option value="blocked">Engelli</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => setSelectedCustomer(customer)}
                  className={`rounded-3xl border p-5 text-left transition hover:bg-slate-900 ${
                    selectedCustomer?.id === customer.id
                      ? "border-blue-500 bg-blue-950/30"
                      : "border-white/10 bg-slate-950/70"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        customer.status
                      )}`}
                    >
                      {statusText(customer.status)}
                    </span>

                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                      {customer.type}
                    </span>
                  </div>

                  <h3 className="font-black">{customer.name}</h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {customer.city} · {customer.totalRequestCount} talep ·{" "}
                    {customer.totalOrders} sipariş
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Son işlem: {customer.lastActivity}
                  </p>
                </button>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                  Bu filtreye uygun müşteri bulunamadı.
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            {!selectedCustomer ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
                Detay görmek için soldan bir müşteri seçin.
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                      Müşteri Detayı
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {selectedCustomer.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {selectedCustomer.type} · {selectedCustomer.country} /{" "}
                      {selectedCustomer.city}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                      selectedCustomer.status
                    )}`}
                  >
                    {statusText(selectedCustomer.status)}
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">İletişim ve Konum</h3>

                    <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                      <p>
                        <span className="font-bold text-white">Telefon:</span>{" "}
                        {selectedCustomer.phone}
                      </p>

                      <p>
                        <span className="font-bold text-white">E-posta:</span>{" "}
                        {selectedCustomer.email}
                      </p>

                      <p>
                        <span className="font-bold text-white">Ülke:</span>{" "}
                        {selectedCustomer.country}
                      </p>

                      <p>
                        <span className="font-bold text-white">Şehir/Bölge:</span>{" "}
                        {selectedCustomer.city} / {selectedCustomer.addressRegion}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">Mağaza İlişki Özeti</h3>

                    <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-3">
                      <p>
                        <span className="font-bold text-white">Toplam Talep:</span>{" "}
                        {selectedCustomer.totalRequestCount}
                      </p>

                      <p>
                        <span className="font-bold text-white">Toplam Sipariş:</span>{" "}
                        {selectedCustomer.totalOrders}
                      </p>

                      <p>
                        <span className="font-bold text-white">Son Aktivite:</span>{" "}
                        {selectedCustomer.lastActivity}
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      <span className="font-bold text-white">Not:</span>{" "}
                      {selectedCustomer.note}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">Yetkiler</h3>

                    <div className="grid gap-3 md:grid-cols-3">
                      <button
                        type="button"
                        onClick={() =>
                          togglePermission(selectedCustomer, "canSeePrices")
                        }
                        className={`rounded-2xl px-5 py-3 font-black transition ${
                          selectedCustomer.canSeePrices
                            ? "bg-emerald-400 text-slate-950"
                            : "border border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        Fiyat Görebilir
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          togglePermission(selectedCustomer, "canOrder")
                        }
                        className={`rounded-2xl px-5 py-3 font-black transition ${
                          selectedCustomer.canOrder
                            ? "bg-emerald-400 text-slate-950"
                            : "border border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        Sipariş Verebilir
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          togglePermission(
                            selectedCustomer,
                            "canUseCurrentAccount"
                          )
                        }
                        className={`rounded-2xl px-5 py-3 font-black transition ${
                          selectedCustomer.canUseCurrentAccount
                            ? "bg-emerald-400 text-slate-950"
                            : "border border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        Cari Hesap
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="mb-3 font-black">Durum Yönetimi</h3>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => activateCustomer(selectedCustomer)}
                        className="rounded-2xl bg-white px-4 py-3 font-black text-slate-950 hover:bg-slate-200"
                      >
                        Aktif Yap
                      </button>

                      <button
                        type="button"
                        onClick={() => limitCustomer(selectedCustomer)}
                        className="rounded-2xl border border-white/10 px-4 py-3 font-black hover:bg-white/10"
                      >
                        Sınırlı Yetki
                      </button>

                      <button
                        type="button"
                        onClick={() => blockCustomer(selectedCustomer)}
                        className="rounded-2xl border border-red-800 px-4 py-3 font-black text-red-200 hover:bg-red-950"
                      >
                        Engelle
                      </button>

                      <Link
                        href="/dashboard/orders"
                        className="rounded-2xl border border-white/10 px-4 py-3 text-center font-black hover:bg-white/10"
                      >
                        Siparişlerini Gör
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}