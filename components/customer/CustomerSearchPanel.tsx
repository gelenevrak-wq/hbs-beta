"use client";

import { useState } from "react";
import type { LanguageCode } from "@/components/language/CompactLanguageSwitcher";

type CountryCode = "all" | "ge" | "tr" | "de" | "ru" | "gb";

const countryOptions: Record<CountryCode, Record<LanguageCode, string>> = {
  all: {
    tr: "Tüm Ülkeler",
    en: "All Countries",
    ru: "Все страны",
    ka: "ყველა ქვეყანა",
    de: "Alle Länder",
  },
  ge: {
    tr: "Gürcistan",
    en: "Georgia",
    ru: "Грузия",
    ka: "საქართველო",
    de: "Georgien",
  },
  tr: {
    tr: "Türkiye",
    en: "Turkey",
    ru: "Турция",
    ka: "თურქეთი",
    de: "Türkei",
  },
  de: {
    tr: "Almanya",
    en: "Germany",
    ru: "Германия",
    ka: "გერმანია",
    de: "Deutschland",
  },
  ru: {
    tr: "Rusya",
    en: "Russia",
    ru: "Россия",
    ka: "რუსეთი",
    de: "Russland",
  },
  gb: {
    tr: "İngiltere",
    en: "United Kingdom",
    ru: "Великобритания",
    ka: "დიდი ბრიტანეთი",
    de: "Vereinigtes Königreich",
  },
};

const texts = {
  tr: {
    eyebrow: "HBS ARAMA",
    title: "Ürün, hizmet ve mağaza arayın",
    description:
      "Ürün, hizmet, mağaza, kampanya ve randevu seçeneklerini ülke, şehir ve mesafe bilgisine göre keşfedin.",
    searchLabel: "Ne arıyorsunuz?",
    searchPlaceholder: "Ürün, hizmet, mağaza veya kategori yazın",
    country: "Ülke",
    city: "Şehir",
    cityPlaceholder: "Şehir yazın veya boş bırakın",
    nearMe: "Yakınımdakiler",
    nearMeText:
      "Konum izni verildiğinde HBS size yakın mağaza ve hizmetleri gösterebilir.",
    distance: "Mesafe Çemberi",
    searchButton: "Ara",
    requestButton: "Talep Bırak",
    resultsTitle: "Arama Sonuçları",
    emptyTitle: "Henüz gerçek mağaza verisi bağlı değil",
    emptyText:
      "Gerçek mağazalar, stoklar, hizmetler ve mesafe bilgileri veritabanı bağlandığında burada listelenecek.",
  },
  en: {
    eyebrow: "HBS SEARCH",
    title: "Search products, services and stores",
    description:
      "Discover products, services, stores, campaigns and reservations by country, city and distance.",
    searchLabel: "What are you looking for?",
    searchPlaceholder: "Enter product, service, store or category",
    country: "Country",
    city: "City",
    cityPlaceholder: "Enter city or leave empty",
    nearMe: "Near me",
    nearMeText:
      "When location permission is granted, HBS can show nearby stores and services.",
    distance: "Distance Radius",
    searchButton: "Search",
    requestButton: "Create Request",
    resultsTitle: "Search Results",
    emptyTitle: "No real store data is connected yet",
    emptyText:
      "Real stores, stock, services and distance information will be listed here when the database is connected.",
  },
  ru: {
    eyebrow: "ПОИСК HBS",
    title: "Ищите товары, услуги и магазины",
    description:
      "Находите товары, услуги, магазины, кампании и бронирования по стране, городу и расстоянию.",
    searchLabel: "Что вы ищете?",
    searchPlaceholder: "Введите товар, услугу, магазин или категорию",
    country: "Страна",
    city: "Город",
    cityPlaceholder: "Введите город или оставьте пустым",
    nearMe: "Рядом со мной",
    nearMeText:
      "Если разрешить доступ к местоположению, HBS сможет показывать ближайшие магазины и услуги.",
    distance: "Радиус поиска",
    searchButton: "Искать",
    requestButton: "Оставить запрос",
    resultsTitle: "Результаты поиска",
    emptyTitle: "Реальные данные магазинов пока не подключены",
    emptyText:
      "Реальные магазины, склад, услуги и расстояния будут отображаться здесь после подключения базы данных.",
  },
  ka: {
    eyebrow: "HBS ძებნა",
    title: "მოძებნეთ პროდუქტი, სერვისი და მაღაზია",
    description:
      "აღმოაჩინეთ პროდუქტები, სერვისები, მაღაზიები, კამპანიები და ჯავშნები ქვეყნის, ქალაქისა და მანძილის მიხედვით.",
    searchLabel: "რას ეძებთ?",
    searchPlaceholder: "შეიყვანეთ პროდუქტი, სერვისი, მაღაზია ან კატეგორია",
    country: "ქვეყანა",
    city: "ქალაქი",
    cityPlaceholder: "შეიყვანეთ ქალაქი ან დატოვეთ ცარიელი",
    nearMe: "ჩემთან ახლოს",
    nearMeText:
      "მდებარეობის ნებართვის შემთხვევაში HBS გაჩვენებთ ახლომდებარე მაღაზიებსა და სერვისებს.",
    distance: "ძიების რადიუსი",
    searchButton: "ძებნა",
    requestButton: "მოთხოვნის დატოვება",
    resultsTitle: "ძიების შედეგები",
    emptyTitle: "რეალური მაღაზიის მონაცემები ჯერ არ არის დაკავშირებული",
    emptyText:
      "რეალური მაღაზიები, მარაგი, სერვისები და მანძილები ბაზის ჩართვის შემდეგ აქ გამოჩნდება.",
  },
  de: {
    eyebrow: "HBS SUCHE",
    title: "Produkte, Dienstleistungen und Geschäfte suchen",
    description:
      "Entdecken Sie Produkte, Dienstleistungen, Geschäfte, Kampagnen und Reservierungen nach Land, Stadt und Entfernung.",
    searchLabel: "Was suchen Sie?",
    searchPlaceholder: "Produkt, Dienstleistung, Geschäft oder Kategorie eingeben",
    country: "Land",
    city: "Stadt",
    cityPlaceholder: "Stadt eingeben oder leer lassen",
    nearMe: "In meiner Nähe",
    nearMeText:
      "Wenn die Standortfreigabe erteilt wird, kann HBS nahegelegene Geschäfte und Dienstleistungen anzeigen.",
    distance: "Suchradius",
    searchButton: "Suchen",
    requestButton: "Anfrage erstellen",
    resultsTitle: "Suchergebnisse",
    emptyTitle: "Noch keine echten Geschäftsdaten verbunden",
    emptyText:
      "Reale Geschäfte, Bestände, Services und Entfernungen werden hier angezeigt, sobald die Datenbank verbunden ist.",
  },
};

type CustomerSearchPanelProps = {
  language: LanguageCode;
};

export default function CustomerSearchPanel({
  language,
}: CustomerSearchPanelProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("all");
  const [nearMe, setNearMe] = useState(false);
  const [distance, setDistance] = useState(10);

  const currentText = texts[language];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm tracking-[0.35em] text-blue-200/70">
            {currentText.eyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            {currentText.title}
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-slate-300">
            {currentText.description}
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                {currentText.searchLabel}
              </label>
              <input
                type="text"
                placeholder={currentText.searchPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {currentText.country}
              </label>
              <select
                value={selectedCountry}
                onChange={(event) =>
                  setSelectedCountry(event.target.value as CountryCode)
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-white"
              >
                {(Object.keys(countryOptions) as CountryCode[]).map(
                  (countryCode) => (
                    <option key={countryCode} value={countryCode}>
                      {countryOptions[countryCode][language]}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {currentText.city}
              </label>
              <input
                type="text"
                placeholder={currentText.cityPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-white"
              />
            </div>

            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-bold">{currentText.nearMe}</div>
                  <p className="mt-1 text-sm text-slate-400">
                    {currentText.nearMeText}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNearMe((value) => !value)}
                  className={`rounded-2xl px-5 py-3 font-black transition ${
                    nearMe
                      ? "bg-emerald-400 text-slate-950"
                      : "border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  {currentText.nearMe}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                {currentText.distance}: {distance} km
              </label>

              <input
                type="range"
                min="1"
                max="100"
                value={distance}
                onChange={(event) => setDistance(Number(event.target.value))}
                className="w-full"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>1 km</span>
                <span>25 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>

            <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-2xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-200"
              >
                {currentText.searchButton}
              </button>

              <button
                type="button"
                className="rounded-2xl border border-white/10 px-6 py-4 font-black text-white hover:bg-white/10"
              >
                {currentText.requestButton}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black">{currentText.resultsTitle}</h2>

        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
          <h3 className="text-lg font-black text-slate-200">
            {currentText.emptyTitle}
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {currentText.emptyText}
          </p>
        </div>
      </div>
    </section>
  );
}