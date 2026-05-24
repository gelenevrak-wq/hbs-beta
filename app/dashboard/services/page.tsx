import DashboardLayout from "@/components/layout/DashboardLayout";
import { demoServiceCatalog, pricingRules } from "@/lib/businessModels";

const staff = [
  { name: "Altan Cancı", role: "OBD uzmanı", status: "Bugün 14:30 sonrası uygun" },
  { name: "Teknisyen 2", role: "Montaj / servis", status: "Yarın uygun" },
  { name: "Rehber / kaptan", role: "Tur operasyonu", status: "Hafta sonu yoğun" },
];

export default function ServicesPage() {
  return (
    <DashboardLayout activeMenu="Hizmet / Takvim">
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Hizmet satışı</p>
          <h1 className="mt-1 text-2xl font-black">Hizmet, yerinde servis, randevu ve zaman slotu yönetimi</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Hizmet satan işletmelerde stok adedi yerine süre, personel, servis bölgesi, kapasite, ekipman ve boş takvim önemlidir. Elektrikçi, tesisatçı, özel ders, nakliye, VIP transfer, kuaför, lokanta ve danışmanlık gibi işletmeler müşteri karşısına uygun zaman, lokasyon ve fiyat kuralı ile çıkar.
          </p>
        </div>


        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[
            "Yerinde teknik servis: elektrikçi, tesisatçı, marangoz, klima, beyaz eşya",
            "Eğitim: özel ders, online ders, kurs, sınav hazırlığı",
            "Nakliye/ulaşım: evden eve, VIP taksi, minibüs, midibüs, otobüs",
            "Yeme içme: menü, paket servis, masa rezervasyonu",
            "Kişisel bakım: kuaför, pedikür, güzellik, masaj",
            "Oto servis: marka bazlı servis randevusu ve parça satışı",
            "Danışmanlık: hukuk, yaşam koçu, aile danışmanı, diyetisyen",
            "Tur/deneyim: tekne, şehir, dağcılık, sağlık turu"
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">{item}</div>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black">Hizmet kataloğu</h2>
              <button className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">Yeni hizmet</button>
            </div>
            <div className="grid gap-3">
              {demoServiceCatalog.map((service) => (
                <article key={service.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-base font-black">{service.name}</div>
                      <div className="mt-1 text-xs font-bold text-blue-700">{service.category}</div>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-800">Vitrinde gösterilebilir</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-4">
                    <div><b>Süre:</b> {service.duration}</div>
                    <div><b>Kapasite:</b> {service.capacity}</div>
                    <div><b>Personel:</b> {service.staff}</div>
                    <div><b>Fiyat:</b> {service.pricing}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {service.nextSlots.map((slot) => (
                      <span key={slot} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">{slot}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-black">Fiyatlandırma kuralları</h2>
              <div className="mt-3 grid gap-2">
                {pricingRules.map((rule) => (
                  <div key={rule} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">{rule}</div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-black">Personel uygunluğu</h2>
              <div className="mt-3 grid gap-2">
                {staff.map((person) => (
                  <div key={person.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm font-black">{person.name}</div>
                    <div className="text-xs text-slate-600">{person.role}</div>
                    <div className="mt-1 text-xs font-bold text-emerald-700">{person.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          Müşteriye gösterilecek takvimde yalnızca müsait slotlar görünür. Mağaza panelinde ise personel, ekipman, kapasite, lokasyon ve hizmet süresine göre çakışma kontrolü yapılır.
        </div>
      </section>
    </DashboardLayout>
  );
}
