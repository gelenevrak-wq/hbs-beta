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

Write-HbsFile "components/language/LanguageSelector.tsx" @'
"use client";

import { useState } from "react";

export type LanguageCode = "tr" | "en" | "ru" | "ka" | "de";

export type Language = {
  code: LanguageCode;
  label: string;
  flagUrl: string;
};

const languages: Language[] = [
  { code: "tr", label: "Türkçe", flagUrl: "https://flagcdn.com/w40/tr.png" },
  { code: "en", label: "English", flagUrl: "https://flagcdn.com/w40/gb.png" },
  { code: "ru", label: "Русский", flagUrl: "https://flagcdn.com/w40/ru.png" },
  { code: "ka", label: "ქართული", flagUrl: "https://flagcdn.com/w40/ge.png" },
  { code: "de", label: "Deutsch", flagUrl: "https://flagcdn.com/w40/de.png" },
];

type LanguageSelectorProps = {
  selectedCode: LanguageCode;
  onChange: (languageCode: LanguageCode) => void;
};

export default function LanguageSelector({
  selectedCode,
  onChange,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedLanguage =
    languages.find((language) => language.code === selectedCode) ?? languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800"
      >
        <img
          src={selectedLanguage.flagUrl}
          alt={selectedLanguage.label}
          className="h-4 w-6 rounded-sm object-cover"
        />
        <span>{selectedLanguage.label}</span>
        <span className="text-slate-400">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
          <div className="px-3 py-2 text-xs uppercase tracking-widest text-slate-500">
            Dil Seçiniz
          </div>

          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => {
                onChange(language.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white hover:bg-slate-800"
            >
              <img
                src={language.flagUrl}
                alt={language.label}
                className="h-5 w-7 rounded-sm object-cover"
              />
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-900/90 p-6 lg:block">
          <Link href="/" className="mb-8 block">
            <div className="text-3xl font-bold tracking-wide">HBS</div>
            <div className="mt-1 text-sm text-slate-400">
              Hybrid Business System
            </div>
          </Link>

          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="text-sm text-slate-400">Aktif Mağaza</div>
            <div className="mt-1 text-lg font-semibold">OBDTR Diagnostics</div>
            <div className="mt-3 inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              7 Günlük Demo
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = item.label === activeMenu;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-white font-semibold text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-800 bg-slate-900/70 px-5 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                HBS
              </Link>

              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                OBDTR Diagnostics
              </span>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {menuItems.map((item) => {
                const isActive = item.label === activeMenu;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${
                      isActive
                        ? "bg-white font-semibold text-slate-950"
                        : "border border-slate-700 text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className="p-5 lg:p-8">{children}</div>
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
        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.35em] text-slate-500">
                {eyebrow}
              </div>

              <h1 className="mt-3 text-4xl font-bold">{title}</h1>

              <p className="mt-3 max-w-3xl text-slate-300">{description}</p>
            </div>

            <button className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 hover:bg-slate-200">
              {actionLabel}
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <div className="text-sm text-slate-400">{stat.label}</div>
              <div className={`mt-3 text-4xl font-bold ${toneClass(stat.tone)}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-bold">{sectionTitle}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {sectionDescription}
            </p>

            <div className="mt-6 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.title}-${item.subtitle}`}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr] lg:items-center">
                    <div>
                      <div className="text-sm text-slate-500">Kayıt</div>
                      <div className="mt-1 text-lg font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-400">{item.subtitle}</div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">Bilgi 1</div>
                      <div className="mt-1 font-semibold">{item.meta1}</div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">Bilgi 2</div>
                      <div className="mt-1 font-semibold">{item.meta2}</div>
                    </div>

                    <div className="lg:text-right">
                      <div className="text-sm text-slate-500">Durum</div>
                      <div className="mt-1 font-semibold text-emerald-300">
                        {item.meta3}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                      Detay
                    </button>
                    <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800">
                      Düzenle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-bold">{sideTitle}</h2>

            <div className="mt-5 space-y-4">
              {sideItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="font-semibold">{item}</div>
                </div>
              ))}

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                {note}
              </div>
            </div>
          </div>
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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold tracking-wide">HBS</div>
          <LanguageSelector selectedCode={language} onChange={setLanguage} />
        </header>

        <section className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-slate-400">
              {currentText.subtitle}
            </p>

            <h1 className="mb-4 text-6xl font-bold">HBS</h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
              {currentText.description}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/store-login"
                className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 hover:bg-slate-200"
              >
                {currentText.storeLogin}
              </Link>

              <Link
                href="/customer-login"
                className="rounded-2xl border border-slate-700 px-6 py-4 font-semibold hover:bg-slate-800"
              >
                {currentText.customerLogin}
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-500">{currentText.slogan}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
'@

Write-HbsFile "app/store-login/page.tsx" @'
import Link from "next/link";

export default function StoreLoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-wide">HBS</Link>
          <Link href="/" className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
            Ana Sayfa
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-slate-400">
              Mağaza Girişi
            </p>

            <h1 className="mb-3 text-4xl font-bold">İşletme Paneli</h1>

            <p className="mb-8 text-slate-300">
              Firma kodunuz, kullanıcı bilgileriniz ve şifreniz ile HBS mağaza yönetim paneline giriş yapın.
            </p>

            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Firma Kodu</label>
                <input
                  type="text"
                  defaultValue="OBDTR"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">E-posta / Kullanıcı Adı</label>
                <input
                  type="text"
                  defaultValue="admin"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Şifre</label>
                <input
                  type="password"
                  defaultValue="1234"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                />
              </div>

              <Link
                href="/dashboard"
                className="block w-full rounded-2xl bg-white px-6 py-4 text-center font-semibold text-slate-950 hover:bg-slate-200"
              >
                Mağaza Paneline Giriş Yap
              </Link>
            </form>

            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              Bu sistem 7 günlük deneme süresiyle kullanılabilir. Deneme süresi sonunda lisans aktivasyonu gerekir.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
'@

Write-HbsFile "app/customer-login/page.tsx" @'
import Link from "next/link";

export default function CustomerLoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-wide">HBS</Link>
          <Link href="/" className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
            Ana Sayfa
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-slate-400">
              Müşteri Girişi
            </p>

            <h1 className="mb-3 text-4xl font-bold">Mağaza Seç, Ürün Bul</h1>

            <p className="mb-8 text-slate-300">
              HBS üzerinden bağlı mağazalara ulaşın, ürünleri inceleyin, teklif alın ve siparişlerinizi takip edin.
            </p>

            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Telefon / E-posta</label>
                <input
                  type="text"
                  defaultValue="+995 555 000 000"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Şifre</label>
                <input
                  type="password"
                  defaultValue="1234"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                />
              </div>

              <Link
                href="/customer"
                className="block w-full rounded-2xl bg-white px-6 py-4 text-center font-semibold text-slate-950 hover:bg-slate-200"
              >
                Müşteri Portalına Giriş Yap
              </Link>
            </form>

            <div className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-100">
              Program indirmenize gerek yok. HBS web portalı telefon, tablet ve bilgisayardan çalışır.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
'@

Write-HbsFile "app/customer/page.tsx" @'
import Link from "next/link";

const stores = [
  {
    name: "OBDTR Diagnostics",
    code: "OBDTR",
    city: "Batumi",
    status: "Onaylı Erişim",
    description: "Oto yedek parça, filtre, buji, fren ve motor parçaları.",
    products: "1.248 ürün",
    currency: "GEL / USD / EUR",
  },
  {
    name: "Batumi Auto Parts",
    code: "BATUMI-PARTS",
    city: "Batumi",
    status: "Herkese Açık",
    description: "Servisler ve tamirciler için hızlı parça tedariki.",
    products: "860 ürün",
    currency: "GEL / USD",
  },
  {
    name: "Tbilisi Spare Center",
    code: "TBILISI-SPARE",
    city: "Tbilisi",
    status: "Teklif ile Satış",
    description: "Geniş ürün grubu ve teklif bazlı satış desteği.",
    products: "2.420 ürün",
    currency: "GEL / EUR",
  },
];

const productResults = [
  {
    product: "NGK BKR6E Buji",
    store: "OBDTR Diagnostics",
    stock: "Stokta var",
    price: "18 ₾",
    delivery: "Bugün teslim",
  },
  {
    product: "NGK BKR6E Buji",
    store: "Batumi Auto Parts",
    stock: "12 adet",
    price: "17.50 ₾",
    delivery: "Yarın teslim",
  },
  {
    product: "NGK BKR6E Buji",
    store: "Tbilisi Spare Center",
    stock: "Var",
    price: "Teklif iste",
    delivery: "2-3 gün",
  },
];

export default function CustomerPortalPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="text-3xl font-bold tracking-wide">
              HBS
            </Link>

            <div className="mt-3 text-sm uppercase tracking-[0.35em] text-slate-500">
              Müşteri Portalı
            </div>

            <h1 className="mt-3 text-4xl font-bold">
              Ürün Ara, Mağaza Bul, Teklif Al
            </h1>

            <p className="mt-3 max-w-3xl text-slate-300">
              HBS üzerinden mağaza seçebilir veya aradığınız ürün/hizmeti yazarak hangi mağazalarda bulunduğunu görebilirsiniz.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl border border-slate-700 px-5 py-3 text-center font-semibold hover:bg-slate-800"
          >
            Ana Sayfa
          </Link>
        </header>

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <input
              type="text"
              defaultValue="NGK BKR6E buji"
              placeholder="Ürün, hizmet, OEM kodu, marka, model ara..."
              className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none placeholder:text-slate-600 focus:border-white"
            />
            <button className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 hover:bg-slate-200">
              Tüm HBS’te Ara
            </button>
            <button className="rounded-2xl border border-slate-700 px-6 py-4 font-semibold hover:bg-slate-800">
              İlan Bırak
            </button>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400">Bağlı Mağaza</div>
            <div className="mt-3 text-4xl font-bold">3</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400">Ürün Sonucu</div>
            <div className="mt-3 text-4xl font-bold">24</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400">Aktif Sipariş</div>
            <div className="mt-3 text-4xl font-bold">4</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400">Bekleyen Teklif</div>
            <div className="mt-3 text-4xl font-bold">2</div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-bold">Mağazalar</h2>
            <p className="mt-1 text-sm text-slate-400">
              Erişiminiz olan veya herkese açık mağazalar.
            </p>

            <div className="mt-6 space-y-3">
              {stores.map((store, index) => (
                <div
                  key={store.code}
                  className={`rounded-2xl border p-5 ${
                    index === 0
                      ? "border-white bg-white text-slate-950"
                      : "border-slate-800 bg-slate-950 text-white"
                  }`}
                >
                  <div className="text-xl font-bold">{store.name}</div>
                  <div className={`mt-1 text-sm ${index === 0 ? "text-slate-600" : "text-slate-400"}`}>
                    {store.city} · {store.code}
                  </div>
                  <p className={`mt-3 text-sm ${index === 0 ? "text-slate-700" : "text-slate-300"}`}>
                    {store.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className={`rounded-full px-3 py-1 ${index === 0 ? "bg-slate-950 text-white" : "border border-slate-700 text-slate-300"}`}>
                      {store.products}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${index === 0 ? "bg-slate-950 text-white" : "border border-slate-700 text-slate-300"}`}>
                      {store.currency}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${index === 0 ? "bg-emerald-100 text-emerald-900" : "border border-emerald-500/40 text-emerald-200"}`}>
                      {store.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-bold">Ürün Arama Sonuçları</h2>
            <p className="mt-1 text-sm text-slate-400">
              Müşteri önce mağaza seçmek zorunda değildir. Aradığı ürünü yazar, hangi mağazada bulunduğunu görür.
            </p>

            <div className="mt-6 space-y-3">
              {productResults.map((result) => (
                <div
                  key={`${result.store}-${result.price}`}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.7fr_0.7fr_auto] lg:items-center">
                    <div>
                      <div className="text-sm text-slate-500">Ürün</div>
                      <div className="mt-1 text-lg font-semibold">{result.product}</div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">Mağaza</div>
                      <div className="mt-1 font-semibold">{result.store}</div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">Stok</div>
                      <div className="mt-1 font-semibold text-emerald-300">{result.stock}</div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">Fiyat</div>
                      <div className="mt-1 font-bold">{result.price}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                        Sipariş
                      </button>
                      <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800">
                        Teklif
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-500">
                    Teslimat: {result.delivery}
                  </div>
                </div>
              ))}
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
  { customer: "Giorgi Auto Service", product: "NGK Buji Seti", status: "Hazırlanıyor", total: "216 ₾" },
  { customer: "Batumi Garage", product: "Toyota Yağ Filtresi", status: "Yeni Sipariş", total: "85 ₾" },
  { customer: "AutoLine Service", product: "BMW Fren Balatası", status: "Teklif Bekliyor", total: "120 USD" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout activeMenu="Ana Panel">
      <div className="space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.35em] text-slate-500">
              Mağaza Yönetim Paneli
            </div>
            <h1 className="mt-3 text-4xl font-bold">OBDTR Diagnostics</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Stok, depo, müşteri, teklif, sipariş, kur, randevu ve dijital vitrin süreçlerinizi tek merkezden yönetin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200">
              Yeni Ürün Ekle
            </button>
            <button className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800">
              Teklif Oluştur
            </button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="text-sm text-slate-400">{stat.label}</div>
              <div className="mt-3 text-4xl font-bold">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-500">{stat.note}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-bold">Son Hareketler</h2>
            <p className="mt-1 text-sm text-slate-400">
              Sipariş, teklif ve stok hareketlerinden özet görünüm.
            </p>

            <div className="mt-6 space-y-3">
              {recentOrders.map((order) => (
                <div key={`${order.customer}-${order.product}`} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <div className="text-sm text-slate-500">Müşteri</div>
                    <div className="font-semibold">{order.customer}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Ürün</div>
                    <div className="font-semibold">{order.product}</div>
                  </div>
                  <div className="md:text-right">
                    <div className="text-sm text-slate-500">{order.status}</div>
                    <div className="font-bold">{order.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-bold">HBS Vizyonu</h2>
            <div className="mt-5 space-y-4 text-slate-300">
              <p>
                HBS yalnızca stok takibi yapmaz. Deponuzdaki ürünleri, hizmetlerinizi ve kampanyalarınızı müşterilerinizin ulaşabildiği canlı bir dijital vitrine dönüştürür.
              </p>
              <p>
                Müşteriler program indirmeden mağazanıza ulaşabilir, ürün bulabilir, talep bırakabilir, teklif alabilir ve sipariş verebilir.
              </p>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                Bugün HBS’te yer almak, yarının dijital ticaret ağında yerinizi şimdiden ayırmaktır.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
'@

$modulePages = @(
  @{
    path="app/dashboard/products/page.tsx"; active="Ürünler"; eyebrow="Ürün Yönetimi"; title="Ürünler"; action="Yeni Ürün Ekle";
    desc="Ürünlerinizi fotoğraf, video, stok miktarı, depo konumu, fiyat, para birimi, OEM kodu ve dijital vitrin görünürlüğüyle yönetin.";
    section="Demo Ürün Listesi"; sectionDesc="Ürünler ileride gerçek veritabanına bağlanacak.";
    note="Ürünler yalnızca stok kalemi değil; HBS içinde müşterilere açılan dijital vitrinin parçalarıdır.";
    side="Ürün Özellikleri"; sideItems=@("Fotoğraf / video desteği","OEM ve alternatif kodlar","Depo bazlı stok","Vitrine açık / kapalı ürün","Çoklu para birimi");
    stats=@(@("Toplam Ürün","1.248","normal"),@("Vitrine Açık","842","good"),@("Düşük Stok","23","warn"),@("Pasif Ürün","41","normal"));
    items=@(
      @("NGK Buji Seti","Kod: NGK-BKR6E","24 adet","Ana Depo > Raf A3","18 ₾"),
      @("Toyota Yağ Filtresi","Kod: TYT-OIL-90915","8 adet","Raf B1 > Göz 04","35 ₾"),
      @("BMW Fren Balatası","Kod: BMW-BRK-E90","3 set","Raf C2 > Göz 09","120 USD")
    )
  },
  @{
    path="app/dashboard/stock/page.tsx"; active="Stok"; eyebrow="Stok Hareketleri"; title="Stok Yönetimi"; action="Stok Girişi";
    desc="Giriş, çıkış, sayım, rezerve, transferde, sevkiyatta ve iade sürecindeki stokları takip edin.";
    section="Son Stok Hareketleri"; sectionDesc="Ürün fiziksel depoda olmasa bile transferde veya sevkiyatta stok olarak izlenir.";
    note="Ürün yoldaysa kayıp değildir; HBS’te transferde veya sevkiyatta stok olarak görünür.";
    side="Stok Durumları"; sideItems=@("Satışa hazır stok","Rezerve stok","Transferde stok","Sevkiyatta stok","İade / karantina stok");
    stats=@(@("Toplam Stok Kalemi","1.248","normal"),@("Bugünkü Giriş","+84","good"),@("Bugünkü Çıkış","-37","warn"),@("Düşük Stok","23","bad"));
    items=@(
      @("NGK Buji Seti","Stok Girişi","Admin","Ana Depo > Raf A3","+20"),
      @("Toyota Yağ Filtresi","Sipariş Çıkışı","Depo Personeli","Ana Depo > Raf B1","-5"),
      @("BMW Fren Balatası","Sayım Düzeltmesi","Admin","Ana Depo > Raf C2","-1")
    )
  },
  @{
    path="app/dashboard/warehouse/page.tsx"; active="Depo Haritası"; eyebrow="Çoklu Depo"; title="Depo Haritası"; action="Yeni Konum Ekle";
    desc="Hammadde, yarı mamul, mamul, mağaza, sevkiyat ve iade depolarını ayrı yönetin; müşteriye hangi depoların görüneceğini seçin.";
    section="Depo ve Konum Ağacı"; sectionDesc="Depo, koridor, raf, bölme ve göz yapınızı oluşturun.";
    note="Her depo sizin iç operasyonunuzdur; vitrine hangi depoyu açacağınızı siz seçersiniz.";
    side="Depo Tipleri"; sideItems=@("Hammadde deposu","Yarı mamul deposu","Mamul deposu","Mağaza / satış deposu","Sevkiyat / iade deposu");
    stats=@(@("Depo","6","normal"),@("Vitrine Açık","2","good"),@("Transferde Ürün","48","warn"),@("Konum Sayısı","312","normal"));
    items=@(
      @("Ana Depo","Mamul + satış hazırlık","842 ürün","Batum lokasyon","Aktif"),
      @("Mağaza Deposu","Müşteri vitrinine açık","126 ürün","Satış deposu","Aktif"),
      @("İade Kontrol","Müşteriye kapalı","18 ürün","Kontrol bekliyor","Kapalı")
    )
  },
  @{
    path="app/dashboard/orders/page.tsx"; active="Siparişler"; eyebrow="Sipariş Yönetimi"; title="Siparişler"; action="Manuel Sipariş Oluştur";
    desc="Müşteri siparişlerini, tekliften siparişe dönüşen talepleri ve teslimat durumlarını takip edin.";
    section="Son Siparişler"; sectionDesc="Siparişler stok, sevkiyat ve müşteri bakiye modülleriyle birlikte çalışır.";
    note="Teslim edilene kadar ürün sevkiyatta stok sayılır; müşteriye teslim edildiğinde satış kesinleşir.";
    side="Sipariş Durumları"; sideItems=@("Yeni sipariş","Hazırlanıyor","Sevkiyatta","Teslim edildi","İptal / iade");
    stats=@(@("Aktif Sipariş","18","normal"),@("Sevkiyatta","5","warn"),@("Tamamlanan","214","good"),@("İade Süreci","3","bad"));
    items=@(
      @("ORD-2026-001","Giorgi Auto Service","16.05.2026","216 ₾","Hazırlanıyor"),
      @("ORD-2026-002","Batumi Garage","16.05.2026","85 ₾","Yeni Sipariş"),
      @("ORD-2026-003","AutoLine Service","15.05.2026","120 USD","Tekliften Siparişe")
    )
  },
  @{
    path="app/dashboard/customers/page.tsx"; active="Müşteriler"; eyebrow="Müşteri Yönetimi"; title="Müşteriler"; action="Yeni Müşteri Ekle";
    desc="Müşterileri, erişim izinlerini, fiyat gruplarını, bakiye durumlarını ve güven skorlarını yönetin.";
    section="Müşteri Listesi"; sectionDesc="Her müşteri farklı fiyat grubu ve erişim yetkisiyle yönetilebilir.";
    note="Mağaza isterse müşteri erişimini herkese açık, onaylı müşteri, davet kodu veya kapalı modda kullanabilir.";
    side="Erişim Modları"; sideItems=@("Herkese açık","Onaylı müşteriler","Davet kodu ile giriş","Tamamen kapalı");
    stats=@(@("Toplam Müşteri","186","normal"),@("Onaylı","142","good"),@("Onay Bekleyen","9","warn"),@("Pasif","35","normal"));
    items=@(
      @("Giorgi Auto Service","Oto Servis","Toptan fiyat grubu","850 ₾ bakiye","Onaylı"),
      @("Batumi Garage","Tamirhane","Standart fiyat grubu","320 USD bakiye","Onaylı"),
      @("AutoLine Service","Mağaza müşterisi","Bayi grubu","0 ₾","Onay Bekliyor")
    )
  },
  @{
    path="app/dashboard/requests/page.tsx"; active="Talep Panosu"; eyebrow="Müşteri İlanları"; title="Talep Panosu"; action="Talebe Teklif Ver";
    desc="Müşteriler ürün veya hizmet talebi bırakır; mağazalar gerçek ihtiyaçlara teklif verebilir.";
    section="Açık Müşteri Talepleri"; sectionDesc="Talep panosu HBS’i aktif ticari talep ağına dönüştürür.";
    note="HBS mağazalara yalnızca vitrin vermez; hazır müşteri taleplerini de mağazaların önüne getirir.";
    side="Talep Türleri"; sideItems=@("Ürün arıyorum","Hizmet arıyorum","Toplu alım istiyorum","Acil parça lazım","Kiralama talebi");
    stats=@(@("Aktif Talep","38","normal"),@("Acil Talep","9","warn"),@("Verilen Teklif","14","normal"),@("Kazanılan Talep","5","good"));
    items=@(
      @("BMW E90 sağ far aranıyor","Giorgi Auto Service","Batumi","1 adet","Teklif Bekliyor"),
      @("Toyota Corolla filtre seti","Batumi Garage","Batumi","20 set","Toplu Alım"),
      @("Mercedes W204 ön tampon","Private Customer","Tbilisi","1 adet","Acil Talep")
    )
  },
  @{
    path="app/dashboard/quotes/page.tsx"; active="Teklif / Proforma"; eyebrow="Teklif & Proforma"; title="Teklif / Proforma"; action="Yeni Teklif Oluştur";
    desc="Müşterilere çok dilli teklif/proforma hazırlayın; toplu alım indirimi, kur sabitleme ve PDF çıktısı kullanın.";
    section="Demo Teklif Kalemleri"; sectionDesc="Teklif anındaki kur ve indirim bilgileri belgeye sabitlenir.";
    note="Toplu alım indirimi, ürün bazlı indirim ve teklif toplam indirimi PDF/proforma belgesine ayrı satır olarak yansıtılır.";
    side="Teklif Özellikleri"; sideItems=@("Çok dilli belge","Toplu alım indirimi","Kur sabitleme","PDF / WhatsApp / e-posta","Tekliften siparişe dönüşüm");
    stats=@(@("Taslak","4","normal"),@("Gönderildi","11","normal"),@("Görüntülendi","6","warn"),@("Kabul Edildi","3","good"));
    items=@(
      @("NGK Buji Seti","10 adet","18 ₾ birim fiyat","%10 toplu alım","162 ₾"),
      @("Toyota Yağ Filtresi","5 adet","35 ₾ birim fiyat","%5 indirim","166.25 ₾"),
      @("BMW Fren Balatası","2 set","120 USD","Kur sabitlendi","240 USD")
    )
  },
  @{
    path="app/dashboard/reservations/page.tsx"; active="Randevu / Rezervasyon"; eyebrow="Zaman Slotu & Kapasite"; title="Randevu / Rezervasyon"; action="Yeni Rezervasyon";
    desc="Hizmet satan işletmeler zaman slotu; kiralama yapan işletmeler müsait varlıklarını müşterilere açabilir.";
    section="Rezervasyonlar"; sectionDesc="Araç, saha, masaj, güzellik salonu, servis ve diğer hizmet randevuları için ortak takvim yapısı.";
    note="HBS’te ürün stoktur; hizmet zaman slotudur; kiralanabilir varlık ise takvimle yönetilen envanterdir.";
    side="Kapasite Mantığı"; sideItems=@("Tek kişilik hizmet","Grup hizmeti","Mekân kiralama","Personel bazlı hizmet","Ekipman / araç kiralama");
    stats=@(@("Bugünkü Randevu","12","normal"),@("Kiradaki Varlık","5","warn"),@("Onay Bekleyen","4","warn"),@("Müsait Kaynak","18","good"));
    items=@(
      @("Toyota Prius Kiralama","Araç kiralama","20.05 - 23.05","1 araç","Onaylandı"),
      @("Halı Saha 1","Saha kiralama","22.05 20:00","14 kişi","Kapora Bekliyor"),
      @("Klasik Masaj","Hizmet randevusu","23.05 14:00","1 kişi","Onay Bekliyor")
    )
  },
  @{
    path="app/dashboard/campaigns/page.tsx"; active="Reklam / Kampanyalar"; eyebrow="Dijital Vitrin & Reklam"; title="Reklam / Kampanyalar"; action="Yeni Kampanya Oluştur";
    desc="Mağazanızı HBS ana sayfasında, kategori aramalarında, şehir bazlı sonuçlarda ve kampanya/story alanlarında öne çıkarın.";
    section="Kampanya Listesi"; sectionDesc="Reklamlar HBS onayından geçmeden yayınlanmaz.";
    note="Sahte stok, yanıltıcı fiyat, gerçek olmayan indirim ve rakibi kötüleyen reklam yayınlanmaz.";
    side="Reklam Alanları"; sideItems=@("Ana sayfa öne çıkarma","Kategori reklamı","Şehir / bölge bazlı reklam","Sponsorlu arama sonucu","Story / kısa kampanya");
    stats=@(@("Yayındaki Kampanya","4","good"),@("Onay Bekleyen","2","warn"),@("Görüntülenme","1.920","normal"),@("Talep / Tıklama","146","normal"));
    items=@(
      @("NGK bujilerde toplu alım indirimi","Kategori reklamı","7 gün","Oto yedek parça","Yayında"),
      @("OBDTR Diagnostics öne çıkan mağaza","Ana sayfa","30 gün","Tüm kullanıcılar","Onay Bekliyor"),
      @("Yağ filtrelerinde kampanya","Story","48 saat","Favori müşteriler","Taslak")
    )
  },
  @{
    path="app/dashboard/reviews/page.tsx"; active="Yorumlar"; eyebrow="İki Yönlü Güven Sistemi"; title="Yorumlar / Değerlendirmeler"; action="Yorumları Denetle";
    desc="Müşteriler mağazaları; mağazalar da gerçek işlem sonrası müşterileri değerlendirebilir.";
    section="Son Değerlendirmeler"; sectionDesc="Yorum hakkı yalnızca tamamlanmış işlem sonrası açılır.";
    note="Müşteri hakkında yapılan değerlendirmeler hassastır; genel platformda ayrıntı yerine güven skoru gösterilmesi daha güvenlidir.";
    side="Değerlendirme Ölçütleri"; sideItems=@("Ürün / hizmet doğruluğu","Teslimat hızı","İletişim kalitesi","Ödeme disiplini","Randevuya uyum");
    stats=@(@("Mağaza Puanı","4.7","good"),@("Toplam Yorum","128","normal"),@("Yanıt Bekleyen","6","warn"),@("Şikayetli Yorum","1","bad"));
    items=@(
      @("Giorgi Auto Service","Müşteriden mağazaya","Ürün doğru geldi","5.0 yıldız","Yayınlandı"),
      @("Batumi Garage","Müşteriden mağazaya","Teslimat biraz gecikti","4.0 yıldız","Yanıt Bekliyor"),
      @("Private Customer","Mağazadan müşteriye","Randevuya geç geldi","3.2 yıldız","İç not")
    )
  },
  @{
    path="app/dashboard/balances/page.tsx"; active="Müşteri Bakiyeleri"; eyebrow="Finans & Tahsilat"; title="Müşteri Bakiyeleri"; action="Yeni Tahsilat Gir";
    desc="Müşterilerin borç, alacak, vade ve gecikme durumlarını takip edin.";
    section="Bakiye Listesi"; sectionDesc="Geciken ödemeler hatırlatma / Mahnung modülüne bağlanır.";
    note="Aylık hizmet bedelinin en güçlü gerekçelerinden biri müşteri bakiyesi, tahsilat ve rapor takibidir.";
    side="Bakiye Özellikleri"; sideItems=@("Cari hesap","Vade takibi","Gecikme hesabı","Çoklu para birimi","Tahsilat kaydı");
    stats=@(@("Toplam Alacak","8.420 ₾","normal"),@("Gecikmiş","850 ₾","warn"),@("Riskli Müşteri","2","bad"),@("Bekleyen Hatırlatma","3","warn"));
    items=@(
      @("Giorgi Auto Service","Vade: 01.06.2026","850 ₾","15 gün gecikme","Gecikmiş"),
      @("Batumi Garage","Vade: 10.06.2026","320 USD","6 gün","Riskli"),
      @("AutoLine Service","Vade: 25.06.2026","1.450 ₾","Vadesi gelmedi","Normal")
    )
  },
  @{
    path="app/dashboard/reminders/page.tsx"; active="Ödeme Hatırlatmaları"; eyebrow="İhtar / Reminder / Mahnung"; title="Ödeme Hatırlatmaları"; action="Yeni Hatırlatma Oluştur";
    desc="Geciken ödemeler için sistem taslak hazırlar; patron veya üst yönetici onayı olmadan gönderilmez.";
    section="Bekleyen Hatırlatmalar"; sectionDesc="Hatırlatma seviyeleri gecikme gününe göre oluşturulur.";
    note="Sistem taslak hazırlar; gönderim yalnızca patron veya üst yönetici onayıyla yapılır.";
    side="Hatırlatma Seviyeleri"; sideItems=@("7 gün: nazik hatırlatma","15 gün: resmi uyarı","30 gün: ciddi ihtar","45 gün: son bildirim","Çok dilli Mahnung");
    stats=@(@("Taslak","5","normal"),@("Onay Bekliyor","3","warn"),@("Gönderildi","12","normal"),@("Ödendi","8","good"));
    items=@(
      @("Giorgi Auto Service","850 ₾","15 gün","2. Uyarı","Onay Bekliyor"),
      @("Batumi Garage","320 USD","6 gün","1. Hatırlatma","Taslak"),
      @("AutoLine Service","1.450 ₾","30 gün","3. Mahnung","Düzenleme")
    )
  },
  @{
    path="app/dashboard/currency/page.tsx"; active="Kur Ayarları"; eyebrow="Çoklu Para Birimi"; title="Kur Ayarları"; action="Kur Güncelle";
    desc="Patron referans kuru, alış/maliyet kurunu ve satışta kullanılacak ticari kuru ayrı ayrı belirleyebilir.";
    section="Aktif Kur Tablosu"; sectionDesc="Otomatik kur öneri verir; satışta patronun ticari kuru esas alınır.";
    note="Sipariş ve teklif anındaki kur sabitlenir; eski belgeler sonradan değişen kurla bozulmaz.";
    side="Kur Yönetimi"; sideItems=@("Referans kur","Alış / maliyet kuru","Satış kuru","Ürün bazlı özel kur","Kur değişiklik geçmişi");
    stats=@(@("Ana Para Birimi","GEL","normal"),@("USD Satış","2.75","good"),@("EUR Satış","3.18","warn"),@("TRY Satış","0.090","normal"));
    items=@(
      @("USD $","Referans 2.70","Alış 2.68","Satış 2.75","Bugün 10:15"),
      @("EUR €","Referans 3.16","Alış 3.14","Satış 3.18","Bugün 10:15"),
      @("TRY ₺","Referans 0.085","Alış 0.083","Satış 0.090","Bugün 10:15")
    )
  },
  @{
    path="app/dashboard/reports/page.tsx"; active="Raporlar"; eyebrow="İşletme Analitiği"; title="Raporlar"; action="Rapor Dışa Aktar";
    desc="Satış, stok, teklif, müşteri bakiyesi, kur farkı, düşük stok ve randevu raporlarını tek merkezden izleyin.";
    section="Rapor Kategorileri"; sectionDesc="Raporlar ileride PDF ve Excel çıktılarıyla çalışacak.";
    note="Raporlar HBS’in aylık hizmet değerini artırır: müşteri yalnızca stok görmez, işletmesinin gidişatını da izler.";
    side="Rapor Tipleri"; sideItems=@("Satış raporu","Stok hareket raporu","Müşteri bakiye raporu","Kur farkı raporu","Teklif performansı");
    stats=@(@("Aylık Sipariş","214","normal"),@("Aylık Teklif","87","normal"),@("Kabul Edilen","31","good"),@("Tahsilat Bekleyen","8.420 ₾","warn"));
    items=@(
      @("Satış Raporu","Tarih aralığına göre","Siparişler","Ciro","Açılabilir"),
      @("Stok Hareket Raporu","Ürün bazlı","Giriş/çıkış","Depo konumu","Açılabilir"),
      @("Kur Farkı Raporu","Döviz bazlı","Alış/satış kuru","Sipariş kuru","Açılabilir")
    )
  },
  @{
    path="app/dashboard/company/page.tsx"; active="Firma Ayarları"; eyebrow="Mağaza Kimliği"; title="Firma Ayarları"; action="Ayarları Kaydet";
    desc="Mağaza adı, logo, varsayılan dil, ana para birimi, müşteri erişim modu ve dijital vitrin ayarlarını yönetin.";
    section="Temel Firma Ayarları"; sectionDesc="Firma ayarları ileride gerçek veritabanına bağlanacak.";
    note="HBS mağazayı müşteri bulmaya zorlamaz; mağaza isterse vitrinini açar, isterse kapalı tutar.";
    side="Müşteri Erişim Modları"; sideItems=@("Herkese açık","Onaylı müşteriler","Davet kodu ile giriş","Tamamen kapalı","Sadece teklif ile satış");
    stats=@(@("Firma","OBDTR","normal"),@("Varsayılan Dil","TR","normal"),@("Ana Para","GEL","normal"),@("Portal","Aktif","good"));
    items=@(
      @("Firma Adı","OBDTR Diagnostics","Firma kodu","OBDTR","Aktif"),
      @("Müşteri Portalı","Herkese açık / onaylı seçilebilir","Fiyat gösterimi","Yetkiye bağlı","Aktif"),
      @("Dijital Vitrin","Ürün ve hizmet görünürlüğü","Kampanya","Reklam destekli","Aktif")
    )
  },
  @{
    path="app/dashboard/license/page.tsx"; active="Lisans"; eyebrow="Lisans & Paket Yönetimi"; title="Lisans"; action="Lisans Anahtarı Gir";
    desc="HBS tek sistemdir. Paketlere göre kullanılacak modüller, kullanıcı sayısı, ürün limiti ve destek seviyesi değişir.";
    section="Aktif Modüller"; sectionDesc="Modül erişimleri lisans paketine göre açılır/kapanır.";
    note="Ömürlük lisans yazılım kullanım hakkıdır; bulut, yedekleme, bakım ve destek yıllık hizmet bedeline bağlıdır.";
    side="Lisans Seçenekleri"; sideItems=@("Aylık kullanım","Yıllık lisans","3 yıllık lisans","5/10 yıllık özel teklif","Ömürlük + yıllık bakım");
    stats=@(@("Durum","Demo","warn"),@("Demo Bitiş","7 Gün","warn"),@("Aktif Modül","12","good"),@("Pro Modül","5","normal"));
    items=@(
      @("Stok Yönetimi","Temel modül","Açık","Başlangıç+","Aktif"),
      @("Teklif / Proforma","Ticari modül","Açık","Standart+","Aktif"),
      @("Randevu / Rezervasyon","Hizmet modülü","Pro","Pro+","Kilitli")
    )
  }
)

function Convert-StatsTs {
  param($stats)
  $parts = @()
  foreach ($s in $stats) {
    $parts += "{ label: `"$($s[0])`", value: `"$($s[1])`", tone: `"$($s[2])`" }"
  }
  return ($parts -join ",`n        ")
}

function Convert-ItemsTs {
  param($items)
  $parts = @()
  foreach ($i in $items) {
    $parts += "{ title: `"$($i[0])`", subtitle: `"$($i[1])`", meta1: `"$($i[2])`", meta2: `"$($i[3])`", meta3: `"$($i[4])`" }"
  }
  return ($parts -join ",`n        ")
}

function Convert-SideTs {
  param($items)
  $parts = @()
  foreach ($i in $items) {
    $parts += "`"$i`""
  }
  return ($parts -join ", ")
}

foreach ($m in $modulePages) {
  $statsTs = Convert-StatsTs $m.stats
  $itemsTs = Convert-ItemsTs $m.items
  $sideTs = Convert-SideTs $m.sideItems

  $content = @"
import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="$($m.active)"
      eyebrow="$($m.eyebrow)"
      title="$($m.title)"
      description="$($m.desc)"
      actionLabel="$($m.action)"
      stats={[
        $statsTs
      ]}
      sectionTitle="$($m.section)"
      sectionDescription="$($m.sectionDesc)"
      items={[
        $itemsTs
      ]}
      sideTitle="$($m.side)"
      sideItems={[$sideTs]}
      note="$($m.note)"
    />
  );
}
"@

  Write-HbsFile $m.path $content
}

Write-Host ""
Write-Host "HBS dosyalari basariyla olusturuldu/guncellendi." -ForegroundColor Green
Write-Host "Sonraki komut: npm run dev" -ForegroundColor Cyan