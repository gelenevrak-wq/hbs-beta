$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Write-HbsFile {
  param (
    [string]$Path,
    [string]$Content
  )

  $fullPath = Join-Path $root $Path
  $folder = Split-Path $fullPath -Parent

  if (!(Test-Path $folder)) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
  }

  Set-Content -Path $fullPath -Value $Content -Encoding UTF8
}

Write-HbsFile "app/globals.css" @'
@import "tailwindcss";

:root {
  --background: #020617;
  --foreground: #f8fafc;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 32rem),
    radial-gradient(circle at top right, rgba(16, 185, 129, 0.10), transparent 30rem),
    #020617;
  color: var(--foreground);
}

button,
a,
input,
select,
textarea {
  font: inherit;
}

::selection {
  background: rgba(255, 255, 255, 0.22);
}

.hbs-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
}

.hbs-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.hbs-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
}
'@

Write-HbsFile "components/layout/DashboardLayout.tsx" @'
import Link from "next/link";

const menuItems = [
  { label: "Ana Panel", href: "/dashboard" },
  { label: "Ürünler", href: "/dashboard/products" },
  { label: "Stok", href: "/dashboard/stock" },
  { label: "Depo Haritası", href: "/dashboard/warehouse" },
  { label: "Siparişler", href: "/dashboard/orders" },
  { label: "Müşteriler", href: "/dashboard/customers" },
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

export default function DashboardLayout({
  children,
  activeMenu,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-80 shrink-0 border-r border-white/10 bg-slate-950/95 p-5 lg:sticky lg:top-0 lg:block">
          <div className="flex h-full flex-col">
            <Link
              href="/"
              className="mb-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl"
            >
              <div className="text-3xl font-black tracking-tight">HBS</div>
              <div className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-500">
                Hybrid Business System
              </div>
            </Link>

            <div className="mb-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                Aktif Mağaza
              </div>
              <div className="mt-2 text-lg font-bold">Ferro Motors</div>
              <div className="mt-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                7 Günlük Demo
              </div>
            </div>

            <nav className="hbs-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const isActive = item.label === activeMenu;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-white text-slate-950 shadow-lg shadow-white/10"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="font-semibold">{item.label}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-black">
                HBS
              </Link>

              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                Ferro Motors
              </span>
            </div>

            <div className="hbs-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">
              {menuItems.map((item) => {
                const isActive = item.label === activeMenu;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ${
                      isActive
                        ? "bg-white text-slate-950"
                        : "border border-white/10 text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
'@

Write-HbsFile "components/layout/ModulePage.tsx" @'
import DashboardLayout from "@/components/layout/DashboardLayout";

type Stat = {
  label: string;
  value: string;
  tone?: "normal" | "good" | "warn" | "bad";
};

type Item = {
  title: string;
  subtitle: string;
  meta1: string;
  meta2: string;
  meta3: string;
};

type ModulePageProps = {
  activeMenu: string;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  stats: Stat[];
  sectionTitle: string;
  sectionDescription: string;
  items: Item[];
  sideTitle: string;
  sideItems: string[];
  note: string;
};

function toneClass(tone: Stat["tone"]) {
  if (tone === "good") return "text-emerald-300";
  if (tone === "warn") return "text-amber-300";
  if (tone === "bad") return "text-red-300";
  return "text-white";
}

function badgeClass(tone: Stat["tone"]) {
  if (tone === "good") return "border-emerald-400/25 bg-emerald-400/10";
  if (tone === "warn") return "border-amber-400/25 bg-amber-400/10";
  if (tone === "bad") return "border-red-400/25 bg-red-400/10";
  return "border-white/10 bg-white/[0.035]";
}

export default function ModulePage({
  activeMenu,
  eyebrow,
  title,
  description,
  actionLabel,
  stats,
  sectionTitle,
  sectionDescription,
  items,
  sideTitle,
  sideItems,
  note,
}: ModulePageProps) {
  return (
    <DashboardLayout activeMenu={activeMenu}>
      <div className="space-y-6">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">
          <div className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                  {eyebrow}
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  {title}
                </h1>

                <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
                  {description}
                </p>
              </div>

              <button className="rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 shadow-xl shadow-white/10 transition hover:bg-slate-200">
                {actionLabel}
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-3xl border p-5 shadow-xl ${badgeClass(
                stat.tone
              )}`}
            >
              <div className="text-sm font-medium text-slate-400">
                {stat.label}
              </div>
              <div className={`mt-3 text-4xl font-black ${toneClass(stat.tone)}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">{sectionTitle}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  {sectionDescription}
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-400">
                {items.length} kayıt
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={`${item.title}-${item.subtitle}`}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-white/20 hover:bg-slate-900"
                >
                  <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr] lg:items-center">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Kayıt
                      </div>
                      <div className="mt-2 text-lg font-bold">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-400">
                        {item.subtitle}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Bilgi 1
                      </div>
                      <div className="mt-2 font-semibold">{item.meta1}</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Bilgi 2
                      </div>
                      <div className="mt-2 font-semibold">{item.meta2}</div>
                    </div>

                    <div className="lg:text-right">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Durum
                      </div>
                      <div className="mt-2 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">
                        {item.meta3}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-6">
            <h2 className="text-2xl font-black">{sideTitle}</h2>

            <div className="mt-5 space-y-3">
              {sideItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <div className="font-semibold text-slate-100">{item}</div>
                </div>
              ))}

              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
                {note}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  );
}
'@

Write-HbsFile "app/page.tsx" @'
"use client";

import Link from "next/link";
import { useState } from "react";
import LanguageSelector, {
  LanguageCode,
} from "@/components/language/LanguageSelector";

const texts = {
  tr: {
    subtitle: "Hybrid Business System",
    description:
      "Bulut tabanlı stok, depo, müşteri, teklif, sipariş, randevu ve ticari vitrin platformu.",
    storeLogin: "Mağaza Girişi",
    customerLogin: "Müşteri Girişi",
    slogan: "Deponuz, hizmetiniz ve vitrininiz artık dünyaya açık.",
  },
  en: {
    subtitle: "Hybrid Business System",
    description:
      "Cloud-based inventory, warehouse, customer, quotation, order, reservation and digital storefront platform.",
    storeLogin: "Store Login",
    customerLogin: "Customer Login",
    slogan: "Your warehouse, services and storefront are now open to the world.",
  },
  ru: {
    subtitle: "Hybrid Business System",
    description:
      "Облачная платформа для склада, клиентов, предложений, заказов, бронирования и цифровой витрины.",
    storeLogin: "Вход для магазина",
    customerLogin: "Вход для клиента",
    slogan: "Ваш склад, услуги и витрина теперь открыты миру.",
  },
  ka: {
    subtitle: "Hybrid Business System",
    description:
      "ღრუბლოვანი პლატფორმა მარაგის, საწყობის, მომხმარებლების, შეთავაზებების, შეკვეთებისა და დაჯავშნისთვის.",
    storeLogin: "მაღაზიის შესვლა",
    customerLogin: "კლიენტის შესვლა",
    slogan: "თქვენი საწყობი, სერვისები და ვიტრინა ახლა მსოფლიოსთვის ღიაა.",
  },
  de: {
    subtitle: "Hybrid Business System",
    description:
      "Cloudbasierte Plattform für Lager, Kunden, Angebote, Aufträge, Reservierungen und digitale Schaufenster.",
    storeLogin: "Shop-Anmeldung",
    customerLogin: "Kunden-Anmeldung",
    slogan: "Ihr Lager, Ihre Dienstleistungen und Ihr Schaufenster sind jetzt weltweit sichtbar.",
  },
};

export default function Home() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const currentText = texts[language];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-[-10rem] top-20 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="text-2xl font-black tracking-tight">HBS</div>
          <LanguageSelector selectedCode={language} onChange={setLanguage} />
        </header>

        <section className="flex flex-1 items-center justify-center px-5 py-12">
          <div className="w-full max-w-5xl rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl backdrop-blur sm:p-10">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.55em] text-blue-200/70">
              {currentText.subtitle}
            </p>

            <h1 className="text-7xl font-black tracking-tight sm:text-8xl">
              HBS
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {currentText.description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Link
                href="/store-login"
                className="rounded-3xl bg-white px-6 py-5 text-lg font-black text-slate-950 shadow-xl shadow-white/10 transition hover:bg-slate-200"
              >
                {currentText.storeLogin}
              </Link>

              <Link
                href="/customer-login"
                className="rounded-3xl border border-white/15 bg-slate-950/60 px-6 py-5 text-lg font-black text-white transition hover:bg-white/10"
              >
                {currentText.customerLogin}
              </Link>
            </div>

            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
              {currentText.slogan}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
'@

Write-HbsFile "app/dashboard/page.tsx" @'
import DashboardLayout from "@/components/layout/DashboardLayout";

const stats = [
  { label: "Toplam Ürün", value: "1.248", note: "Demo veri" },
  { label: "Aktif Sipariş", value: "18", note: "Hazırlanıyor" },
  { label: "Bekleyen Teklif", value: "7", note: "Müşteri onayı bekliyor" },
  { label: "Düşük Stok", value: "23", note: "Kontrol gerekli" },
];

const recentOrders = [
  {
    customer: "Giorgi Auto Service",
    product: "NGK Buji Seti",
    status: "Hazırlanıyor",
    total: "216 ₾",
  },
  {
    customer: "Batumi Garage",
    product: "Toyota Yağ Filtresi",
    status: "Yeni Sipariş",
    total: "85 ₾",
  },
  {
    customer: "AutoLine Service",
    product: "BMW Fren Balatası",
    status: "Teklif Bekliyor",
    total: "120 USD",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout activeMenu="Ana Panel">
      <div className="space-y-6">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">
          <div className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                  Mağaza Yönetim Paneli
                </div>

                <h1 className="mt-5 text-5xl font-black tracking-tight">
                  Ferro Motors
                </h1>

                <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
                  Stok, depo, müşteri, teklif, sipariş, kur, randevu ve dijital
                  vitrin süreçlerinizi tek merkezden yönetin.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 shadow-xl shadow-white/10 hover:bg-slate-200">
                  Yeni Ürün Ekle
                </button>
                <button className="rounded-2xl border border-white/15 px-5 py-3 font-bold hover:bg-white/10">
                  Teklif Oluştur
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl"
            >
              <div className="text-sm font-medium text-slate-400">
                {stat.label}
              </div>
              <div className="mt-3 text-4xl font-black">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-500">{stat.note}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <h2 className="text-2xl font-black">Son Hareketler</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sipariş, teklif ve stok hareketlerinden özet görünüm.
            </p>

            <div className="mt-6 space-y-3">
              {recentOrders.map((order) => (
                <article
                  key={`${order.customer}-${order.product}`}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Müşteri
                      </div>
                      <div className="mt-2 font-bold">{order.customer}</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Ürün
                      </div>
                      <div className="mt-2 font-bold">{order.product}</div>
                    </div>

                    <div className="md:text-right">
                      <div className="text-sm text-slate-500">
                        {order.status}
                      </div>
                      <div className="mt-1 text-lg font-black">
                        {order.total}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <h2 className="text-2xl font-black">HBS Vizyonu</h2>

            <div className="mt-5 space-y-4 text-slate-300">
              <p className="leading-7">
                HBS yalnızca stok takibi yapmaz. Deponuzdaki ürünleri,
                hizmetlerinizi ve kampanyalarınızı müşterilerinizin ulaşabildiği
                canlı bir dijital vitrine dönüştürür.
              </p>

              <p className="leading-7">
                Müşteriler program indirmeden mağazanıza ulaşabilir, ürün
                bulabilir, talep bırakabilir, teklif alabilir ve sipariş
                verebilir.
              </p>

              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                Bugün HBS’te yer almak, yarının dijital ticaret ağında yerinizi
                şimdiden ayırmaktır.
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
'@

Write-Host ""
Write-Host "HBS arayuzu toparlandi." -ForegroundColor Green
Write-Host "Sonraki komut: npm run dev" -ForegroundColor Cyan