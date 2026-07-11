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
  note?: string;
};

function toneClass(tone: Stat["tone"]) {
  if (tone === "good") return "text-emerald-800";
  if (tone === "warn") return "text-amber-800";
  if (tone === "bad") return "text-red-800";
  return "text-slate-850";
}

function badgeClass(tone: Stat["tone"]) {
  if (tone === "good") return "border-emerald-200 bg-emerald-50/50";
  if (tone === "warn") return "border-amber-250 bg-amber-50/50";
  if (tone === "bad") return "border-red-200 bg-red-50/50";
  return "border-slate-200 bg-white";
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
      <div className="space-y-4 text-slate-900">
        <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 relative">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
                {eyebrow}
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-800">
                {title}
              </h1>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>

            <button className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 py-2.5 shadow-md transition active:scale-95 whitespace-nowrap">
              {actionLabel}
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border p-3.5 shadow-sm ${badgeClass(
                stat.tone
              )}`}
            >
              <div className="text-xs font-bold text-slate-500">
                {stat.label}
              </div>
              <div className={`mt-1 text-xl font-black ${toneClass(stat.tone)}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-800">{sectionTitle}</h2>
                <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-500 font-semibold">
                  {sectionDescription}
                </p>
              </div>

              <div className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                {items.length} kayıt
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={`${item.title}-${item.subtitle}`}
                  className="rounded-2xl border border-slate-150 bg-slate-50/50 p-3.5 transition hover:border-slate-300 hover:bg-slate-100/50"
                >
                  <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr] lg:items-center">
                    <div>
                      <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                        Kayıt
                      </div>
                      <div className="mt-1 text-sm font-black text-slate-850">{item.title}</div>
                      <div className="mt-0.5 text-xs font-bold text-slate-500">
                        {item.subtitle}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                        Bilgi 1
                      </div>
                      <div className="mt-1 text-xs font-bold text-slate-600">{item.meta1}</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                        Bilgi 2
                      </div>
                      <div className="mt-1 text-xs font-bold text-slate-600">{item.meta2}</div>
                    </div>

                    <div className="lg:text-right">
                      <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 lg:hidden">
                        Durum
                      </div>
                      <div className="mt-2 lg:mt-0 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-800">
                        {item.meta3}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-4 space-y-4">
            <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2">{sideTitle}</h2>

            <div className="mt-2 space-y-2">
              {sideItems.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-150 bg-slate-50/50 p-3"
                >
                  <div className="text-xs font-bold text-slate-700">{item}</div>
                </div>
              ))}

              {note && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-950 font-bold shadow-sm mt-3">
                  {note}
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  );
}
