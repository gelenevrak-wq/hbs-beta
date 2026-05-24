import DashboardLayout from "@/components/layout/DashboardLayout";

const rentals = [
  { name: "Kırıcı delici matkap", type: "Ekipman", price: "Günlük + depozito", availability: "Bugün uygun", rule: "Teslim/iade fotoğrafı zorunlu" },
  { name: "Oto servis lift zamanı", type: "Zaman slotu", price: "Saatlik", availability: "Yarın 09:00", rule: "Personel onayı gerekir" },
  { name: "Tekne özel tur", type: "Araç/deneyim", price: "Saatlik veya paket", availability: "Hafta sonu sınırlı", rule: "Kapora ile kesinleşir" },
];

export default function RentalsPage() {
  return (
    <DashboardLayout activeMenu="Kiralama">
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-purple-700">Kiralama modeli</p>
          <h1 className="mt-1 text-2xl font-black">Kiralık varlık ve uygunluk yönetimi</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Kiralama modülünde ürün adedi tek başına yetmez. Teslim tarihi, iade tarihi, depozito, hasar notu, uygunluk takvimi ve teslim alan kişi kayıt altına alınır.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {rentals.map((item) => (
            <article key={item.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-lg font-black">{item.name}</div>
              <div className="mt-1 text-xs font-bold text-purple-700">{item.type}</div>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <div><b>Fiyat:</b> {item.price}</div>
                <div><b>Uygunluk:</b> {item.availability}</div>
                <div><b>Kural:</b> {item.rule}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
