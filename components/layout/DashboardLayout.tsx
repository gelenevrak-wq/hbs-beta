import Link from "next/link";

const menuItems = [
  { label: "Ana Panel", href: "/dashboard" },
  { label: "İş Modelleri", href: "/dashboard/business-models" },
  { label: "Ürünler", href: "/dashboard/products" },
  { label: "Hizmet / Takvim", href: "/dashboard/services" },
  { label: "Kiralama", href: "/dashboard/rentals" },
  { label: "Tur / Deneyim", href: "/dashboard/tours" },
  { label: "Stok", href: "/dashboard/stock" },
  { label: "Depo Haritası", href: "/dashboard/warehouses" },
  { label: "Stok Hareketleri", href: "/dashboard/stock-movements" },
  { label: "Siparişler", href: "/dashboard/orders" },
  { label: "Müşteriler", href: "/dashboard/customers" },
  { label: "Mağaza Kullanıcıları", href: "/dashboard/users" },
  { label: "Talep Panosu", href: "/dashboard/requests" },
  { label: "Teklif / Proforma", href: "/dashboard/quotes" },
  { label: "Randevu / Rezervasyon", href: "/dashboard/reservations" },
  { label: "Reklam / Kampanyalar", href: "/dashboard/campaigns" },
  { label: "Yorumlar", href: "/dashboard/reviews" },
  { label: "Müşteri Bakiyeleri", href: "/dashboard/balances" },
  { label: "Ödeme Hatırlatmaları", href: "/dashboard/reminders" },
  { label: "Kur Ayarları", href: "/dashboard/currency" },
  { label: "Raporlar", href: "/dashboard/reports" },
  { label: "Firma Ayarları", href: "/dashboard/company" },
  { label: "Lisans", href: "/dashboard/license" },
];

type DashboardLayoutProps = {
  children: React.ReactNode;
  activeMenu: string;
};

export default function DashboardLayout({ children, activeMenu }: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-3 lg:sticky lg:top-0 lg:block">
          <div className="flex h-full flex-col">
            <Link href="/" className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="text-xl font-black tracking-tight">HBS</div>
              <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">Hybrid Business System</div>
            </Link>

            <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-700">Aktif Mağaza</div>
              <div className="mt-1 text-base font-black">OBDTR / Demo</div>
              <div className="mt-2 inline-flex rounded-full border border-emerald-300 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-900">Ürün + Hizmet + Kiralama</div>
            </div>

            <nav className="hbs-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const isActive = item.label === activeMenu;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                      isActive ? "bg-blue-50 text-blue-900 ring-1 ring-blue-200" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <span className="font-semibold">{item.label}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-black">HBS</Link>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900">Karma mağaza</span>
            </div>
            <div className="hbs-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
              {menuItems.map((item) => {
                const isActive = item.label === activeMenu;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                      isActive ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1850px] p-3 sm:p-4 lg:p-5">{children}</div>
        </section>
      </div>
    </main>
  );
}
