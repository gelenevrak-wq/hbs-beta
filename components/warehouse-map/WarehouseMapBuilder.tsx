"use client";

import { useMemo, useState } from "react";
import {
  Warehouse as WarehouseIcon,
  LayoutGrid,
  Rows3,
  Layers,
  ArrowDown,
  Boxes,
  MapPin,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Warehouse = { id: string; name: string };
type Reyon = { id: string; warehouseId: string; code: string };
type Sira = { id: string; reyonId: string; number: number };
type Kat = { id: string; siraId: string; number: number };

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const letterFor = (index: number) =>
  index < 26 ? String.fromCharCode(65 + index) : `R${index + 1}`;

export default function WarehouseMapBuilder() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [reyons, setReyons] = useState<Reyon[]>([]);
  const [siras, setSiras] = useState<Sira[]>([]);
  const [kats, setKats] = useState<Kat[]>([]);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [selectedReyonId, setSelectedReyonId] = useState<string | null>(null);
  const [selectedSiraId, setSelectedSiraId] = useState<string | null>(null);
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null);

  const selectedWarehouse = warehouses.find((w) => w.id === selectedWarehouseId) || null;
  const reyonsOfWarehouse = useMemo(
    () => reyons.filter((r) => r.warehouseId === selectedWarehouseId),
    [reyons, selectedWarehouseId]
  );
  const selectedReyon = reyons.find((r) => r.id === selectedReyonId) || null;
  const sirasOfReyon = useMemo(
    () => siras.filter((s) => s.reyonId === selectedReyonId),
    [siras, selectedReyonId]
  );
  const selectedSira = siras.find((s) => s.id === selectedSiraId) || null;
  const katsOfSira = useMemo(
    () => kats.filter((k) => k.siraId === selectedSiraId),
    [kats, selectedSiraId]
  );

  const canReyon = !!selectedWarehouseId;
  const canSira = !!selectedReyonId;
  const canKat = !!selectedSiraId;

  const addWarehouse = () => {
    const id = uid();
    setWarehouses((prev) => [...prev, { id, name: "" }]);
    setSelectedWarehouseId(id);
    setSelectedReyonId(null);
    setSelectedSiraId(null);
    setEditingWarehouseId(id);
  };

  const selectWarehouse = (id: string) => {
    setSelectedWarehouseId(id);
    setSelectedReyonId(null);
    setSelectedSiraId(null);
  };

  const addReyon = () => {
    if (!selectedWarehouseId) return;
    const id = uid();
    const code = letterFor(reyonsOfWarehouse.length);
    setReyons((prev) => [...prev, { id, warehouseId: selectedWarehouseId, code }]);
    setSelectedReyonId(id);
    setSelectedSiraId(null);
  };

  const selectReyon = (id: string) => {
    setSelectedReyonId(id);
    setSelectedSiraId(null);
  };

  const addSira = () => {
    if (!selectedReyonId) return;
    const id = uid();
    const number = sirasOfReyon.length + 1;
    setSiras((prev) => [...prev, { id, reyonId: selectedReyonId, number }]);
    setSelectedSiraId(id);
  };

  const selectSira = (id: string) => setSelectedSiraId(id);

  const addKat = () => {
    if (!selectedSiraId) return;
    const id = uid();
    const number = katsOfSira.length + 1;
    setKats((prev) => [...prev, { id, siraId: selectedSiraId, number }]);
  };

  const renameWarehouse = (id: string, name: string) =>
    setWarehouses((prev) => prev.map((w) => (w.id === id ? { ...w, name } : w)));

  const StepButton = ({
    active,
    onClick,
    icon: Icon,
    label,
  }: {
    active: boolean;
    onClick: () => void;
    icon: typeof WarehouseIcon;
    label: string;
  }) => (
    <button
      type="button"
      disabled={!active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-black transition-all duration-200",
        active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95"
          : "cursor-not-allowed bg-slate-100 text-slate-400"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Dijital Depo İkizi
        </h1>
        <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
          Depo &rarr; Reyon &rarr; Sıra &rarr; Kat ilişkisini tamamen görsel olarak inşa edin. Hiçbir form doldurmanıza gerek yok.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Sol Sidebar */}
        <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:w-72">
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5">
            <Boxes className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Oluştur</span>
          </div>

          <div className="grid gap-2">
            <StepButton active icon={WarehouseIcon} label="Depo Oluştur" onClick={addWarehouse} />
            <StepButton active={canReyon} icon={LayoutGrid} label="Reyon Oluştur" onClick={addReyon} />
            <StepButton active={canSira} icon={Rows3} label="Sıra Ekle" onClick={addSira} />
            <StepButton active={canKat} icon={Layers} label="Kat Ekle" onClick={addKat} />
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-bold leading-relaxed text-slate-600">
            <div className="mb-1.5 flex items-center gap-1.5 text-slate-800">
              <MapPin className="h-3.5 w-3.5 text-blue-600" /> Seçili Konum
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Seçili Depo</span>
              <span className="text-slate-900">{selectedWarehouse?.name || "—"}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Seçili Reyon</span>
              <span className="text-slate-900">{selectedReyon?.code || "—"}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Seçili Sıra</span>
              <span className="text-slate-900">{selectedSira ? selectedSira.number : "—"}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Seçili Kat</span>
              <span className="text-slate-900">{katsOfSira.length || "—"}</span>
            </div>
          </div>
        </aside>

        {/* Ana Alan */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Depo Kartları */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-700">Depolar</h2>
              <button
                type="button"
                onClick={addWarehouse}
                className="flex items-center gap-1 rounded-full border border-dashed border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 transition hover:bg-blue-100 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" /> Yeni Depo
              </button>
            </div>

            {warehouses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm font-semibold text-slate-400">
                Henüz depo yok. Soldan <span className="font-black text-blue-600">Depo Oluştur</span> ile başlayın.
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {warehouses.map((w) => {
                  const isSelected = w.id === selectedWarehouseId;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => selectWarehouse(w.id)}
                      className={cn(
                        "group flex w-36 flex-col items-center gap-2 rounded-2xl border-2 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl transition",
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                        )}
                      >
                        <WarehouseIcon className="h-6 w-6" />
                      </span>
                      {editingWarehouseId === w.id ? (
                        <input
                          autoFocus
                          value={w.name}
                          onChange={(e) => renameWarehouse(w.id, e.target.value)}
                          onBlur={() => setEditingWarehouseId(null)}
                          placeholder="İsim yaz"
                          className="w-full rounded-md border border-blue-300 px-1.5 py-1 text-center text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      ) : (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingWarehouseId(w.id);
                          }}
                          className={cn(
                            "w-full truncate rounded-md px-1 py-1 text-xs font-black",
                            w.name ? "text-slate-900" : "text-slate-400"
                          )}
                        >
                          {w.name || "İsim yaz"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Reyonlar */}
          {selectedWarehouse && (
            <section>
              <h2 className="mb-2 text-sm font-black uppercase tracking-wide text-slate-700">
                Reyonlar
                <span className="ml-2 font-normal normal-case text-slate-400">
                  ({reyonsOfWarehouse.length})
                </span>
              </h2>
              {reyonsOfWarehouse.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-center text-xs font-semibold text-slate-400">
                  Bu depoda henüz reyon yok. <span className="font-black text-blue-600">Reyon Oluştur</span> ile ekleyin.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {reyonsOfWarehouse.map((r) => {
                    const isSelected = r.id === selectedReyonId;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => selectReyon(r.id)}
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl border-2 text-lg font-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow",
                          isSelected
                            ? "border-blue-500 bg-blue-600 text-white ring-2 ring-blue-200"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                        )}
                      >
                        {r.code}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Görsel Haritalandırma */}
          {(selectedReyon || selectedSira) && (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Reyon Perspektif */}
              {selectedReyon && (
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-black text-white">
                      {selectedReyon.code} Reyonu
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      Perspektif
                    </span>
                  </div>
                  <div className="relative" style={{ perspective: "1100px" }}>
                    <div
                      className="flex origin-bottom flex-col gap-2"
                      style={{ transform: "rotateX(58deg)", transformStyle: "preserve-3d" }}
                    >
                      {sirasOfReyon.length === 0 ? (
                        <div className="rounded-md bg-white/10 px-3 py-4 text-center text-[11px] font-semibold text-slate-400">
                          Sıra ekleyin
                        </div>
                      ) : (
                        sirasOfReyon.map((s) => {
                          const isSel = s.id === selectedSiraId;
                          return (
                            <div key={s.id} className="flex items-center gap-2">
                              <span className="w-5 shrink-0 text-right text-[10px] font-black text-blue-300">
                                {s.number}
                              </span>
                              <button
                                type="button"
                                onClick={() => selectSira(s.id)}
                                className={cn(
                                  "h-9 flex-1 rounded-md text-center text-[11px] font-black text-white shadow-md transition",
                                  isSel
                                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 ring-2 ring-emerald-200"
                                    : "bg-gradient-to-r from-sky-400 to-blue-500 hover:brightness-110"
                                )}
                              >
                                Sıra {s.number}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400">
                    <span>Ön</span>
                    <ArrowDown className="h-3.5 w-3.5" />
                    <span>Arka</span>
                  </div>
                </div>
              )}

              {/* Sıra Yakın Görünümü */}
              {selectedSira && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">
                      Sıra {selectedSira.number} — Raf Katları
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {katsOfSira.length} Kat
                    </span>
                  </div>

                  {katsOfSira.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-xs font-semibold text-slate-400">
                      Bu sıraya henüz kat eklenmedi. <span className="font-black text-blue-600">Kat Ekle</span> ile rafı büyütün.
                    </div>
                  ) : (
                    <div className="flex flex-col-reverse gap-2">
                      {katsOfSira.map((k) => (
                        <div
                          key={k.id}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-3 py-2.5 shadow-sm transition hover:border-blue-300 hover:shadow"
                        >
                          <Layers className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-black text-slate-800">{k.number}. Kat</span>
                          <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
