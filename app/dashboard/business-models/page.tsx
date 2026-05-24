import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { businessModels } from "@/lib/businessModels";

const selectedModels = ["products", "services", "rental", "tour"];

export default function BusinessModelsPage() {
  return (
    <DashboardLayout activeMenu="İş Modelleri">
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Mağaza kurulum çekirdeği</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950">İş modeli seçimi</h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                HBS’de mağaza yalnızca “ürün satan yer” değildir. Aynı mağaza ürün satabilir, hizmet verebilir, ekipman kiralayabilir, tur düzenleyebilir veya araç/emlak için teklif/açık artırma çalıştırabilir. Seçilen iş modelleri mağaza panelinde aktif modülleri belirler.
              </p>
            </div>
            <Link href="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700">
              Kayıt akışını gör
            </Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {businessModels.map((model) => {
            const active = selectedModels.includes(model.key);
            return (
              <article key={model.key} className={`rounded-2xl border p-4 shadow-sm ${active ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">{model.title}</h2>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{model.description}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {active ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {model.dashboardModules.map((module) => (
                    <span key={module} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700">
                      {module}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <b>Kural:</b> Ürün satan mağazada stok/depo zorunlu olur. Hizmet/tur/kiralama yapan mağazada takvim, kapasite, personel ve zaman slotu zorunlu olur. Karma mağazada iki omurga birlikte çalışır; kullanıcı karmaşaya düşmesin diye panel yalnızca seçilen modülleri öne çıkarır.
        </div>
      </section>
    </DashboardLayout>
  );
}
