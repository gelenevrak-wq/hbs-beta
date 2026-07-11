import { supabase } from "@/lib/supabaseClient";

export type RegisteredStoreView = {
  code: string;
  name: string;
  city: string;
  address?: string;
  industry?: string;
  licenseType?: string;
  isSuspended?: boolean;
  isActive?: boolean;
  operatingModel?: "physical" | "virtual_delivery" | "hybrid";
  serviceCountries?: string[];
  email?: string;
  representative?: string;
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

function readLocalStores(): RegisteredStoreView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("hbs-registered-stores");
    return raw ? (JSON.parse(raw) as RegisteredStoreView[]) : [];
  } catch {
    return [];
  }
}

/**
 * Single source of truth for the visible store list.
 * Merges Supabase `companies` (when configured) with the local demo store
 * registry, de-duplicated by store `code`. Local demo stores still work
 * offline; real registrations surface from Supabase.
 */
export async function loadRegisteredStores(): Promise<RegisteredStoreView[]> {
  const local = readLocalStores();
  const byCode = new Map<string, RegisteredStoreView>();
  for (const s of local) byCode.set(s.code, s);

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("companies")
      .select("code, name, city, country, address, operating_model, service_countries, category, is_public_search_enabled")
      .order("created_at", { ascending: true });

    if (!error && data) {
      for (const c of data as any[]) {
        if (!c.code) continue;
        const existing = byCode.get(c.code);
        byCode.set(c.code, {
          code: c.code,
          name: c.name ?? existing?.name ?? c.code,
          city: c.city ?? existing?.city ?? "İstanbul",
          address: c.address ?? existing?.address ?? "",
          industry: c.category ?? existing?.industry ?? "",
          isSuspended: existing?.isSuspended ?? false,
          isActive: existing?.isActive ?? Boolean(c.is_public_search_enabled),
          operatingModel: c.operating_model ?? existing?.operatingModel ?? "physical",
          serviceCountries: c.service_countries ?? existing?.serviceCountries ?? ["TR"],
          email: existing?.email,
          representative: existing?.representative,
        });
      }
    }
  }

  return Array.from(byCode.values());
}

/**
 * Persist a store into the local demo registry (keeps demo mode consistent
 * with Supabase-backed stores). Safe no-op outside the browser.
 */
export function upsertLocalStore(store: RegisteredStoreView): void {
  if (typeof window === "undefined") return;
  const list = readLocalStores();
  const idx = list.findIndex((s) => s.code === store.code);
  if (idx >= 0) list[idx] = { ...list[idx], ...store };
  else list.push(store);
  window.localStorage.setItem("hbs-registered-stores", JSON.stringify(list));
}
