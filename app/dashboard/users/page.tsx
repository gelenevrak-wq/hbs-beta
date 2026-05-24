import DashboardLayout from "@/components/layout/DashboardLayout";

const users = [
  {
    name: "Mağaza Sahibi",
    role: "Owner / Yönetici",
    access: "Tüm yetkiler",
    status: "Aktif",
  },
  {
    name: "Satış Personeli",
    role: "Sales",
    access: "Ürün, teklif, mesaj",
    status: "Hazır",
  },
  {
    name: "Depo Personeli",
    role: "Warehouse",
    access: "Stok giriş/çıkış, barkod",
    status: "Hazır",
  },
];

const roles = [
  "Owner: mağazayı oluşturan ilk kullanıcı; kullanıcı ekleme ve rol verme yetkisi onda olur.",
  "Manager: ürün, stok, sipariş, müşteri ve raporları yönetebilir.",
  "Sales: teklif, sipariş, mesaj ve müşteri ilişkileri tarafında çalışır.",
  "Warehouse: ürün kodu, barkod, depo, raf ve stok hareketlerini işler.",
  "Viewer: sadece kendisine açılan verileri görüntüler; değişiklik yapamaz.",
];

export default function StoreUsersPage() {
  return (
    <DashboardLayout activeMenu="Mağaza Kullanıcıları">
      <div className="space-y-4">
        <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                MAĞAZA KULLANICILARI
              </div>
              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Personel, Rol ve Erişim Yönetimi
              </h1>
              <p className="mt-2 max-w-4xl text-sm leading-5 text-slate-300">
                Mağazayı ilk oluşturan kişi owner/yönetici kabul edilir. Yeni kullanıcı tanımlama, rol verme ve erişim sınırlandırma yetkisi bu ana kullanıcıda başlar.
              </p>
            </div>

            <button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-200">
              Yeni Kullanıcı Ekle
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="text-xs text-slate-400">Aktif kullanıcı</div>
            <div className="mt-1 text-2xl font-black">3</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="text-xs text-slate-400">Ücretsiz çekirdek ekip</div>
            <div className="mt-1 text-2xl font-black">Owner + 1</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="text-xs text-slate-400">Ücretlendirme</div>
            <div className="mt-1 text-2xl font-black">Sonra</div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-xl font-black">Kullanıcı Listesi</h2>
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[11px] text-slate-400">
                Demo yetki modeli
              </span>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <article
                  key={user.name}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 md:grid-cols-[1fr_0.8fr_1fr_0.45fr] md:items-center"
                >
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      Kullanıcı
                    </div>
                    <div className="mt-1 font-black">{user.name}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      Rol
                    </div>
                    <div className="mt-1 text-sm font-semibold">{user.role}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      Erişim
                    </div>
                    <div className="mt-1 text-sm text-slate-300">{user.access}</div>
                  </div>
                  <div className="md:text-right">
                    <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-200">
                      {user.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl">
            <h2 className="text-xl font-black">Yetki Prensibi</h2>
            <div className="mt-3 space-y-2">
              {roles.map((role) => (
                <div key={role} className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-xs leading-5 text-slate-300">
                  {role}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-blue-400/20 bg-blue-400/10 p-3 text-xs leading-5 text-blue-100">
              İlk satış mesajı ücret değil değer olacak: stok yaparken ürünlerini müşterilerine ve Google bulunabilirliğine de aç.
            </div>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  );
}
