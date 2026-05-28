"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { demoServiceCatalog, pricingRules } from "@/lib/businessModels";

const initialStaff = [
  { name: "Altan Cancı", role: "OBD uzmanı", status: "Bugün 14:30 sonrası uygun" },
  { name: "Teknisyen 2", role: "Montaj / servis", status: "Yarın uygun" },
  { name: "Rehber / kaptan", role: "Tur operasyonu", status: "Hafta sonu yoğun" },
];

type CustomService = {
  name: string;
  category: string;
  duration: string;
  capacity: string;
  staff: string;
  pricing: string;
  nextSlots: string[];
};

export default function ServicesPage() {
  const [services, setServices] = useState<CustomService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [calendarConfigured, setCalendarConfigured] = useState(false);

  // Form states for new service
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Yerinde hizmet");
  const [duration, setDuration] = useState("60 dk");
  const [capacity, setCapacity] = useState("1 adres");
  const [staffName, setStaffName] = useState("Altan Cancı");
  const [pricing, setPricing] = useState("Servis Ücreti");
  const [slotsStr, setSlotsStr] = useState("Yarın 10:00, Yarın 14:00, Pazar 11:00");

  useEffect(() => {
    try {
      const savedServices = window.localStorage.getItem("hbs-services");
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
      setCalendarConfigured(window.localStorage.getItem("hbs-calendar-configured") === "true");
    } catch (e) {
      console.error(e);
    }
  }, []);

  const allServices = [...services, ...demoServiceCatalog];

  function handleSaveCalendar() {
    try {
      window.localStorage.setItem("hbs-calendar-configured", "true");
      setCalendarConfigured(true);
      setSuccessMsg("Zaman planı, takvim kuralları ve personel kapasitesi başarıyla kaydedildi! Kurulum adımlarınız güncellendi.");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (e) {
      console.error(e);
    }
  }

  function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const newService: CustomService = {
      name: name.trim(),
      category,
      duration,
      capacity,
      staff: staffName,
      pricing,
      nextSlots: slotsStr.split(",").map(s => s.trim()).filter(Boolean)
    };

    const updated = [newService, ...services];
    setServices(updated);
    try {
      window.localStorage.setItem("hbs-services", JSON.stringify(updated));
      setSuccessMsg(`"${name}" isimli yeni hizmet kataloğa başarıyla eklendi!`);
      setIsModalOpen(false);
      // Reset form
      setName("");
      setSlotsStr("Yarın 10:00, Yarın 14:00");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <DashboardLayout activeMenu="Hizmet / Takvim">
      <section className="space-y-4 text-slate-900">
        {/* Main Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Hizmet satışı & takvim</p>
          <h1 className="mt-1 text-2xl font-black text-slate-800">Hizmet, yerinde servis, randevu ve zaman slotu yönetimi</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Hizmet satan işletmelerde stok adedi yerine süre, personel, servis bölgesi, kapasite, ekipman ve boş takvim önemlidir. Elektrikçi, tesisatçı, özel ders, nakliye, VIP transfer, kuaför, lokanta ve danışmanlık gibi işletmeler müşteri karşısına uygun zaman, lokasyon ve fiyat kuralı ile çıkar.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-black text-emerald-800 shadow-sm animate-fadeIn">
            ✓ {successMsg}
          </div>
        )}

        {/* Calendar and Capacity Configuration Action */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-800">📅 Zaman Planı ve Takvim Kuralları</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bold mt-1">Personel çalışma saatleri ve hizmet slotu kurallarını onaylayarak 6. adımı tamamlayın.</p>
          </div>
          <button
            onClick={handleSaveCalendar}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-md transition active:scale-95 whitespace-nowrap ${
              calendarConfigured 
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800 cursor-default"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {calendarConfigured ? "✓ Takvim Yapılandırıldı" : "Zaman Planını & Kapasiteyi Kaydet"}
          </button>
        </div>

        {/* Industry Chips */}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          {[
            "Yerinde teknik servis: elektrikçi, tesisatçı, klima",
            "Eğitim: özel ders, kurs, online eğitimler",
            "Nakliye/ulaşım: evden eve, VIP transfer",
            "Yeme içme: menü, masa rezervasyonu",
            "Kişisel bakım: kuaför, berber, masaj",
            "Oto servis: marka bazlı randevu ve parça",
            "Danışmanlık: hukuk, koçluk, diyetisyen",
            "Tur/deneyim: tekne turu, dağcılık"
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-extrabold text-slate-600 shadow-sm">{item}</div>
          ))}
        </div>

        {/* Dynamic Split */}
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Services Catalog */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-800">🛠️ Hizmet Kataloğu & İşlemler</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-black text-white active:scale-95 transition"
              >
                + Yeni Hizmet Ekle
              </button>
            </div>
            
            <div className="grid gap-3">
              {allServices.map((service, idx) => (
                <article key={service.name + idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-800">{service.name}</div>
                      <div className="mt-1 text-[10px] font-black uppercase text-blue-700">{service.category}</div>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-black text-emerald-800">Vitrinde Gösteriliyor</span>
                  </div>
                  
                  <div className="mt-3.5 grid gap-2 text-xs text-slate-600 sm:grid-cols-4 bg-white p-2.5 rounded-lg border border-slate-100 font-bold">
                    <div>⏱️ <b>Süre:</b> {service.duration}</div>
                    <div>👥 <b>Kapasite:</b> {service.capacity}</div>
                    <div>👤 <b>Uzman:</b> {service.staff}</div>
                    <div className="text-blue-700">💰 <b>Fiyat:</b> {service.pricing}</div>
                  </div>
                  
                  {service.nextSlots && service.nextSlots.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {service.nextSlots.map((slot) => (
                        <span key={slot} className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">{slot}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* Right Side Rules and Staff */}
          <div className="space-y-4">
            
            {/* Pricing Rules */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-800 pb-2 border-b border-slate-100 mb-3">🏷️ Fiyatlandırma Kuralları</h2>
              <div className="grid gap-2">
                {pricingRules.map((rule) => (
                  <div key={rule} className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-600">{rule}</div>
                ))}
              </div>
            </div>

            {/* Staff Availability */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-800 pb-2 border-b border-slate-100 mb-3">👥 Personel Uygunluğu</h2>
              <div className="grid gap-3">
                {initialStaff.map((person) => (
                  <div key={person.name} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="text-xs font-black text-slate-800">{person.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{person.role}</div>
                    <div className="mt-2 text-[10px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      {person.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer info banner */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-6 text-blue-950 font-bold shadow-sm">
          📢 Müşteriye gösterilecek takvimde yalnızca müsait slotlar görünür. Mağaza panelinde ise personel, ekipman, kapasite, lokasyon ve hizmet süresine göre çakışma kontrolü yapılır.
        </div>
      </section>

      {/* New Service Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-slate-800">➕ Yeni Hizmet / İşlem Ekle</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5">
              <label className="grid gap-1">
                <span className="text-xs font-bold text-slate-600">Hizmet / İşlem Adı</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Toyota Corolla 10.000 KM Bakımı"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">Kategori</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option>Yerinde hizmet</option>
                    <option>Servis / Tamir</option>
                    <option>Eğitim</option>
                    <option>Danışmanlık</option>
                    <option>Yeme içme</option>
                    <option>Tur / Deneyim</option>
                    <option>Kiralama</option>
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">Süre</span>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Örn: 45 dk"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">Kapasite</span>
                  <input
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Örn: 1 Araç / Seans"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">Sorumlu Personel / Ekip</span>
                  <input
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="Örn: Altan Cancı"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">Fiyat / Ücret Kuralı</span>
                  <input
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    placeholder="Örn: 150 GEL veya Teklif usulü"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">Müsait Zaman Slotları (Virgülle ayırın)</span>
                  <input
                    value={slotsStr}
                    onChange={(e) => setSlotsStr(e.target.value)}
                    placeholder="Örn: Bugün 14:00, Yarın 11:30"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-black text-white"
                >
                  Hizmeti Kataloğa Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
