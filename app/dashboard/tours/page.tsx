"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const translations = {
  tr: {
    activeMenu: "Tur / Deneyim",
    eyebrow: "Tur / deneyim",
    title: "Tur, kontenjan ve katılımcı yönetimi",
    description: "Tur satan işletmelerde ürün stoğu yerine tarih, saat, kalkış noktası, rehber dili, kontenjan, çocuk/yetişkin fiyatı ve iptal şartları önemlidir.",
    dateLabel: "Tarih",
    capacityLabel: "Kontenjan",
    startLabel: "Kalkış",
    guideLangLabel: "Rehber dili",
  },
  en: {
    activeMenu: "Tour / Experience",
    eyebrow: "Tour / Experience",
    title: "Tour, Capacity & Participant Management",
    description: "In businesses selling tours, instead of product stock, date, time, departure point, guide language, capacity, child/adult pricing, and cancellation terms are important.",
    dateLabel: "Date",
    capacityLabel: "Capacity",
    startLabel: "Departure",
    guideLangLabel: "Guide language",
  },
  de: {
    activeMenu: "Touren / Erlebnisse",
    eyebrow: "Touren / Erlebnisse",
    title: "Touren-, Kapazitäts- & Teilnehmerverwaltung",
    description: "Bei Unternehmen, die Touren verkaufen, sind anstelle des Produktbestands Datum, Uhrzeit, Abfahrtsort, Reiseleitersprache, Kapazität, Kinder-/Erwachsenenpreise und Stornierungsbedingungen wichtig.",
    dateLabel: "Datum",
    capacityLabel: "Kapazität",
    startLabel: "Abfahrtsort",
    guideLangLabel: "Reiseleitersprache",
  },
  ru: {
    activeMenu: "Туры / Экскурсии",
    eyebrow: "Туры / Экскурсии",
    title: "Управление турами, свободными местами и участниками",
    description: "В бизнесе по продаже туров вместо товарного запаса важны дата, время, место отправления, язык гида, вместимость, детские/взрослые цены и условия отмены.",
    dateLabel: "Дата",
    capacityLabel: "Вместимость",
    startLabel: "Отправление",
    guideLangLabel: "Язык гида",
  },
  ka: {
    activeMenu: "ტური / გამოცდილება",
    eyebrow: "ტური / გამოცდილება",
    title: "ტურის, ადგილებისა და მონაწილეების მართვა",
    description: "ტურების გამყიდველ ბიზნესში, პროდუქტის მარაგის ნაცვლად, მნიშვნელოვანია თარიღი, დრო, გამგზავრების ადგილი, გიდის ენა, ტევადობა, ბავშვის/დიდის ფასები და გაუქმების წესები.",
    dateLabel: "თარიღი",
    capacityLabel: "ადგილები",
    startLabel: "გამგზავრება",
    guideLangLabel: "გიდის ენა",
  }
};

const tours = [
  { name: "Batumi şehir turu", date: "Her gün", capacity: "18 kişi", start: "Avrupa Meydanı", language: "TR / RU / EN" },
  { name: "Tekne turu", date: "Hafta sonu", capacity: "12 kişi", start: "Marina", language: "TR / KA / RU" },
  { name: "Sağlık turu", date: "Teklif usulü", capacity: "Kişiye özel", start: "Klinik transferi", language: "TR / EN / AR" },
];

export default function ToursPage() {
  const [language, setLanguage] = useState("tr");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language as keyof typeof translations] || translations.tr;

  function translateTourText(text: string) {
    if (language === "tr") return text;
    if (text === "Batumi şehir turu") return language === "en" ? "Batumi City Tour" : language === "de" ? "Batumi Stadtrundfahrt" : language === "ru" ? "Обзорная экскурсия по Батуми" : "ბათუმის საქალაქო ტური";
    if (text === "Tekne turu") return language === "en" ? "Boat Tour" : language === "de" ? "Bootstour" : language === "ru" ? "Лодочный тур" : "ნავით ტური";
    if (text === "Sağlık turu") return language === "en" ? "Medical Tour" : language === "de" ? "Gesundheitstour" : language === "ru" ? "Медицинский тур" : "სამედიცინო ტური";
    if (text === "Her gün") return language === "en" ? "Every day" : language === "de" ? "Täglich" : language === "ru" ? "Каждый день" : "ყოველ დღე";
    if (text === "Hafta sonu") return language === "en" ? "Weekend" : language === "de" ? "Wochenende" : language === "ru" ? "Выходные" : "შაბათ-კვირას";
    if (text === "Teklif usulü") return language === "en" ? "Quote-based" : language === "de" ? "Angebotsbasiert" : language === "ru" ? "На основе предложения" : "შეთავაზებით";
    if (text === "18 kişi") return language === "en" ? "18 people" : language === "de" ? "18 Personen" : language === "ru" ? "18 человек" : "18 ადამიანი";
    if (text === "12 kişi") return language === "en" ? "12 people" : language === "de" ? "12 Personen" : language === "ru" ? "12 человек" : "12 ადამიანი";
    if (text === "Kişiye özel") return language === "en" ? "Customized" : language === "de" ? "Individuell" : language === "ru" ? "Индивидуально" : "პერსონალური";
    if (text === "Avrupa Meydanı") return language === "en" ? "Europe Square" : language === "de" ? "Europa-Platz" : language === "ru" ? "Площадь Европы" : "ევროპის მოედანი";
    if (text === "Marina") return language === "en" ? "Marina" : language === "de" ? "Yachthafen" : language === "ru" ? "Марина" : "მარინა";
    if (text === "Klinik transferi") return language === "en" ? "Clinic transfer" : language === "de" ? "Klinik-Transfer" : language === "ru" ? "Трансфер в клинику" : "კლინიკის ტრანსფერი";
    return text;
  }

  return (
    <DashboardLayout activeMenu={t.activeMenu}>
      <section className="space-y-4 text-slate-900">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">{t.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-800">{t.title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-650">
            {t.description}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {tours.map((tour) => (
            <article key={tour.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-lg font-black text-slate-800">{translateTourText(tour.name)}</div>
              <div className="mt-3 space-y-2 text-xs text-slate-650 font-bold">
                <div><b>{t.dateLabel}:</b> {translateTourText(tour.date)}</div>
                <div><b>{t.capacityLabel}:</b> {translateTourText(tour.capacity)}</div>
                <div><b>{t.startLabel}:</b> {translateTourText(tour.start)}</div>
                <div><b>{t.guideLangLabel}:</b> {tour.language}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
