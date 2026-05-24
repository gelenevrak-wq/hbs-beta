import DashboardLayout from "@/components/layout/DashboardLayout";

const tours = [
  { name: "Batumi şehir turu", date: "Her gün", capacity: "18 kişi", start: "Avrupa Meydanı", language: "TR / RU / EN" },
  { name: "Tekne turu", date: "Hafta sonu", capacity: "12 kişi", start: "Marina", language: "TR / KA / RU" },
  { name: "Sağlık turu", date: "Teklif usulü", capacity: "Kişiye özel", start: "Klinik transferi", language: "TR / EN / AR" },
];

export default function ToursPage() {
  return (
    <DashboardLayout activeMenu="Tur / Deneyim">
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">Tur / deneyim</p>
          <h1 className="mt-1 text-2xl font-black">Tur, kontenjan ve katılımcı yönetimi</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Tur satan işletmelerde ürün stoğu yerine tarih, saat, kalkış noktası, rehber dili, kontenjan, çocuk/yetişkin fiyatı ve iptal şartları önemlidir.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {tours.map((tour) => (
            <article key={tour.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-lg font-black">{tour.name}</div>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <div><b>Tarih:</b> {tour.date}</div>
                <div><b>Kontenjan:</b> {tour.capacity}</div>
                <div><b>Kalkış:</b> {tour.start}</div>
                <div><b>Rehber dili:</b> {tour.language}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
