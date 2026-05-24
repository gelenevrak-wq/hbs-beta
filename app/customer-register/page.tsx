"use client";

import { useState } from "react";
import Link from "next/link";
import CountrySelect, {
  CountryCode,
  getCountryNameByCode,
} from "@/components/common/CountrySelect";

type CustomerType = "individual" | "corporate";

export default function CustomerRegisterPage() {
  const [customerType, setCustomerType] = useState<CustomerType>("individual");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<CountryCode>("GE");
  const [city, setCity] = useState("Batumi");
  const [addressRegion, setAddressRegion] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName || !phone || !email || !country || !city || !password) {
      setMessage("Lütfen zorunlu alanları doldurun.");
      return;
    }

    const customerData = {
      customerType,
      fullName,
      phone,
      email,
      countryCode: country,
      countryName: getCountryNameByCode(country),
      city,
      addressRegion,
      createdAt: new Date().toISOString(),
    };

    console.log("HBS müşteri kaydı:", customerData);

    setMessage(
      "Müşteri kaydı demo olarak oluşturuldu. Veritabanı bağlantısı sonraki aşamada eklenecek."
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-white"
          >
            HBS
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
          >
            Ana Sayfa
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
              HBS Müşteri Kaydı
            </p>

            <h1 className="text-4xl font-black tracking-tight">
              Genel HBS müşteri hesabı oluşturun
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Bu kayıt herhangi bir mağazaya bağlı değildir. HBS müşterisi olarak
              ürün, hizmet, mağaza, kampanya, teklif ve sipariş seçeneklerini tek
              merkezden arayabilirsiniz. Mağaza bazlı özel fiyat, sipariş ve cari
              hesap ilişkileri işlem aşamasında ayrıca oluşur.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Müşteri Tipi</span>
                <select
                  value={customerType}
                  onChange={(event) =>
                    setCustomerType(event.target.value as CustomerType)
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                >
                  <option value="individual">Bireysel</option>
                  <option value="corporate">Kurumsal</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Ad Soyad / Firma Adı *
                </span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                  placeholder="Örn: Giorgi Motors"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Telefon / WhatsApp *
                </span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                  placeholder="+995 555 000 000"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">E-posta *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                  placeholder="ornek@email.com"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <CountrySelect
                value={country}
                onChange={setCountry}
                label="Ülke"
                required
              />

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Şehir *</span>
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                  placeholder="Şehrinizi yazın"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Adres / Bölge</span>
                <input
                  value={addressRegion}
                  onChange={(event) => setAddressRegion(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                  placeholder="Örn: Batumi Merkez"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Şifre *</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                placeholder="Güvenli bir şifre girin"
              />
            </label>

            <div className="rounded-2xl border border-blue-900/70 bg-blue-950/40 p-4 text-sm leading-6 text-blue-100">
              HBS müşteri kaydında ilgi alanı sorulmaz. Müşteri bugün araba
              parçası, yarın kitap, ertesi gün ev veya başka bir hizmet
              arayabilir. HBS müşterisi genel platform kullanıcısıdır.
            </div>

            {message && (
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-3 font-bold text-slate-950 hover:bg-slate-200"
              >
                Müşteri Kaydı Oluştur
              </button>

              <Link
                href="/customer"
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-bold hover:bg-slate-800"
              >
                Müşteri Portalına Git
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}