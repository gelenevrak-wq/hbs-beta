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
  note: string;
};

function toneClass(tone: Stat["tone"]) {
  if (tone === "good") return "text-emerald-300";
  if (tone === "warn") return "text-amber-300";
  if (tone === "bad") return "text-red-300";
  return "text-white";
}

function badgeClass(tone: Stat["tone"]) {
  if (tone === "good") return "border-emerald-400/25 bg-emerald-400/10";
  if (tone === "warn") return "border-amber-400/25 bg-amber-400/10";
  if (tone === "bad") return "border-red-400/25 bg-red-400/10";
  return "border-white/10 bg-white/[0.035]";
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
      <div className="space-y-4">
        <header className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl">
          <div className="relative p-4 sm:p-5">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                  {eyebrow}
                </div>

                <h1 className="mt-3 text-xl font-black tracking-tight sm:text-3xl">
                  {title}
                </h1>

                <p className="mt-2 max-w-4xl text-sm leading-5 text-slate-300">
                  {description}
                </p>
              </div>

              <button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-xl shadow-white/10 transition hover:bg-slate-200">
                {actionLabel}
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border p-3 shadow-xl ${badgeClass(
                stat.tone
              )}`}
            >
              <div className="text-xs font-medium text-slate-400">
                {stat.label}
              </div>
              <div className={`mt-1 text-xl font-black ${toneClass(stat.tone)}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl sm:p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black">{sectionTitle}</h2>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400">
                  {sectionDescription}
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-[11px] font-semibold text-slate-400">
                {items.length} kayıt
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={`${item.title}-${item.subtitle}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 transition hover:border-white/20 hover:bg-slate-900"
                >
                  <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr] lg:items-center">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Kayıt
                      </div>
                      <div className="mt-1 text-base font-bold">{item.title}</div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {item.subtitle}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Bilgi 1
                      </div>
                      <div className="mt-1 text-sm font-semibold">{item.meta1}</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Bilgi 2
                      </div>
                      <div className="mt-1 text-sm font-semibold">{item.meta2}</div>
                    </div>

                    <div className="lg:text-right">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Durum
                      </div>
                      <div className="mt-2 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-200">
                        {item.meta3}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl sm:p-4">
            <h2 className="text-xl font-black">{sideTitle}</h2>

            <div className="mt-5 space-y-3">
              {sideItems.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-slate-950/70 p-3"
                >
                  <div className="font-semibold text-slate-100">{item}</div>
                </div>
              ))}

              <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-100">
                {note}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  );
}
