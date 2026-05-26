"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";

type Transaction = {
  id: string;
  date: string;
  type: "Satış" | "Tahsilat" | "İade" | "Devir";
  docNo: string;
  debit: number; // Borç (Store is owed this)
  credit: number; // Alacak (Client paid this)
  note: string;
};

type CustomerLedger = {
  id: string;
  name: string;
  representative: string;
  phone: string;
  email: string;
  city: string;
  currency: string;
  balance: number; // Debit - Credit
  transactions: Transaction[];
};

const INITIAL_LEDGERS: CustomerLedger[] = [
  {
    id: "c-001",
    name: "Giorgi Auto Service",
    representative: "Giorgi Kalandadze",
    phone: "+995555111222",
    email: "giorgi@autoservice.ge",
    city: "Batumi",
    currency: "GEL",
    balance: 850,
    transactions: [
      { id: "t1", date: "2026-05-01", type: "Devir", docNo: "D-2026-01", debit: 500, credit: 0, note: "Önceki dönemden devir borç" },
      { id: "t2", date: "2026-05-10", type: "Satış", docNo: "FT-99482", debit: 450, credit: 0, note: "Toyota Corolla filtreler ve yağ değişimi" },
      { id: "t3", date: "2026-05-15", type: "Tahsilat", docNo: "MAK-001", debit: 0, credit: 300, note: "Elden yapılan kısmi ödeme" },
      { id: "t4", date: "2026-05-23", type: "Satış", docNo: "FT-99510", debit: 200, credit: 0, note: "Buji setleri satışı" }
    ]
  },
  {
    id: "c-002",
    name: "Batumi Garage",
    representative: "Amiran Shavadze",
    phone: "+995555333444",
    email: "amiran@batumigarage.ge",
    city: "Batumi",
    currency: "GEL",
    balance: 320,
    transactions: [
      { id: "t1", date: "2026-05-05", type: "Satış", docNo: "FT-99489", debit: 620, credit: 0, note: "Autel arıza tespit cihazı kiralama" },
      { id: "t2", date: "2026-05-12", type: "Tahsilat", docNo: "MAK-002", debit: 0, credit: 300, note: "Banka havalesi" }
    ]
  },
  {
    id: "c-003",
    name: "AutoLine Service",
    representative: "Zaza Papashvili",
    phone: "+995555777888",
    email: "zaza@autoline.ge",
    city: "Tbilisi",
    currency: "GEL",
    balance: -140, // We owe them (overpaid)
    transactions: [
      { id: "t1", date: "2026-05-02", type: "Satış", docNo: "FT-99478", debit: 160, credit: 0, note: "Universal bujiler ve kablolar" },
      { id: "t2", date: "2026-05-08", type: "Tahsilat", docNo: "MAK-003", debit: 0, credit: 300, note: "Nakit tahsilat avans ödemesi" }
    ]
  }
];

export default function BalancesPage() {
  const [ledgers, setLedgers] = useState<CustomerLedger[]>(INITIAL_LEDGERS);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const activeLedger = ledgers[selectedIdx] ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ledgers.filter((l) => {
      return (
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.representative.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    });
  }, [ledgers, search]);

  // Recalculate balances dynamically based on transactions list
  const activeTransactionsWithRunningBalance = useMemo(() => {
    if (!activeLedger) return [];
    let running = 0;
    return activeLedger.transactions.map((t) => {
      running = running + t.debit - t.credit;
      return { ...t, runningBalance: running };
    });
  }, [activeLedger]);

  function money(val: number, cur = "GEL") {
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    const formatted = `${absVal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`;
    return isNeg ? `(${formatted})` : formatted;
  }

  // PDF statement print flow using native printing with high-fidelity styles!
  // Opens in a new print-friendly popup window.
  function handleExportPDF() {
    if (!activeLedger) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setMessage("Pop-up engelleyiciyi kaldırarak PDF dökümünü yazdırabilirsiniz.");
      return;
    }

    const rowsHtml = activeTransactionsWithRunningBalance.map((t) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
        <td style="padding: 8px;">${t.date}</td>
        <td style="padding: 8px;">${t.docNo}</td>
        <td style="padding: 8px;"><b>${t.type}</b><br/><span style="color:#64748b; font-size:10px">${t.note}</span></td>
        <td style="padding: 8px; text-align:right;">${t.debit > 0 ? money(t.debit, activeLedger.currency) : "-"}</td>
        <td style="padding: 8px; text-align:right;">${t.credit > 0 ? money(t.credit, activeLedger.currency) : "-"}</td>
        <td style="padding: 8px; text-align:right; font-weight:bold;">${money(t.runningBalance, activeLedger.currency)}</td>
      </tr>
    `).join("");

    const totalDebit = activeLedger.transactions.reduce((s, t) => s + t.debit, 0);
    const totalCredit = activeLedger.transactions.reduce((s, t) => s + t.credit, 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Cari Hesap Ekstresi - ${activeLedger.name}</title>
          <style>
            body { font-family: 'Inter', sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .company { font-size: 24px; font-weight: 900; color: #1d4ed8; }
            .client-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 30px; display: grid; grid-template-cols: 1fr 1fr; gap: 15px; }
            .client-title { font-size: 12px; text-transform: uppercase; font-weight: bold; color: #64748b; }
            .client-val { font-size: 14px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #3b82f6; color: white; padding: 10px; font-size: 12px; text-transform: uppercase; text-align: left; }
            .summary { display: flex; justify-content: flex-end; gap: 40px; font-size: 13px; font-weight: bold; }
            .print-btn { background: #0f172a; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <button class="print-btn" onclick="window.print()">🖨️ PDF Kaydet veya Yazdır</button>
          
          <div class="header">
            <div>
              <div class="company">HBS MARKETPLACE</div>
              <div style="font-size: 12px; color: #64748b; font-weight: bold;">CARI HESAP EKSTRESI / STATEMENT</div>
            </div>
            <div style="text-align: right; font-size: 12px; font-weight: bold;">
              Tarih: ${new Date().toLocaleDateString("tr-TR")}<br/>
              Ekstre No: Ledger-${activeLedger.id}
            </div>
          </div>

          <div class="client-card">
            <div>
              <div class="client-title">Borçlu Firma / Client</div>
              <div class="client-val">${activeLedger.name}</div>
              <div style="font-size: 12px; color: #64748b;">${activeLedger.representative} · ${activeLedger.city}</div>
            </div>
            <div style="text-align: right;">
              <div class="client-title">Mevcut Hesap Bakiyesi</div>
              <div style="font-size: 20px; font-weight: 900; color: #1e3a8a;">${money(activeLedger.balance, activeLedger.currency)}</div>
              <div style="font-size: 11px; color: #ef4444;">${activeLedger.balance > 0 ? "⚠️ Ödeme Bekleniyor" : "✓ Bakiye Dengede / Alacaklı"}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="padding: 10px;">Tarih</th>
                <th style="padding: 10px;">Evrak No</th>
                <th style="padding: 10px;">Açıklama</th>
                <th style="padding: 10px; text-align:right;">Borç (Debit)</th>
                <th style="padding: 10px; text-align:right;">Alacak (Credit)</th>
                <th style="padding: 10px; text-align:right;">Bakiye (Balance)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="summary">
            <div>Toplam Borç: <span style="color:#0f172a">${money(totalDebit, activeLedger.currency)}</span></div>
            <div>Toplam Ödeme: <span style="color:#10b981">${money(totalCredit, activeLedger.currency)}</span></div>
            <div style="border-left: 2px solid #cbd5e1; padding-left: 20px;">Net Bakiye: <span style="color:#1e3a8a">${money(activeLedger.balance, activeLedger.currency)}</span></div>
          </div>

          <div style="margin-top: 80px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 15px;">
            HBS Cloud Cari Muhasebe Altyapısı ile oluşturulmuştur. Bu belge resmi fatura yerine geçmez, mutabakat amaçlıdır.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Share Statement via WhatsApp click-to-chat API as requested!
  function handleShareWhatsApp() {
    if (!activeLedger) return;
    const text = encodeURIComponent(
      `Sayın Yetkili, *${activeLedger.name}* cari hesap ekstreniz güncellenmiştir.\n\n` +
      `*Net Hesap Bakiyesi:* ${money(activeLedger.balance, activeLedger.currency)}\n` +
      `*Detaylar:* Toplam Borç: ${money(activeLedger.transactions.reduce((s,t)=>s+t.debit,0), activeLedger.currency)} | Toplam Ödeme: ${money(activeLedger.transactions.reduce((s,t)=>s+t.credit,0), activeLedger.currency)}\n\n` +
      `Mutabakat belgenizi PDF olarak indirmek veya kontrol etmek için HBS portalınıza giriş yapabilirsiniz. Teşekkür eder, iyi çalışmalar dileriz.`
    );
    const url = `https://api.whatsapp.com/send?phone=${activeLedger.phone}&text=${text}`;
    window.open(url, "_blank");
    setMessage("WhatsApp paylaşım mesajı yeni sekmede tetiklendi!");
  }

  // Share Statement via Email client
  function handleShareEmail() {
    if (!activeLedger) return;
    const subject = encodeURIComponent(`Cari Hesap Ekstresi Mutabakat Formu - ${activeLedger.name}`);
    const body = encodeURIComponent(
      `Sayın Yetkili,\n\n` +
      `${activeLedger.name} cari hesap mutabakat dökümünüz aşağıda özetlenmiştir:\n\n` +
      `- Cari Hesap Adı: ${activeLedger.name}\n` +
      `- Güncel Bakiye: ${money(activeLedger.balance, activeLedger.currency)}\n` +
      `- Telefon/WhatsApp: ${activeLedger.phone}\n\n` +
      `Ekstre detaylarınızı PDF olarak yazdırmak için ekteki linki veya HBS muhasebe panelinizi ziyaret edebilirsiniz.\n\n` +
      `İyi çalışmalar dileriz,\n` +
      `HBS Cari Muhasebe Yönetimi`
    );
    const url = `mailto:${activeLedger.email}?subject=${subject}&body=${body}`;
    window.open(url, "_blank");
    setMessage("E-posta mutabakat taslağı e-posta istemcinizde açıldı!");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Link href="/dashboard" className="text-base font-black sm:text-xl text-blue-600">HBS Cari Mutabakat</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">Paneli Aç</Link>
          </div>
        </header>

        <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Cari Hesap & Borç Takip</p>
          <h1 className="mt-1 text-xl font-black sm:text-3xl">Müşteri Cari Hesap Ledger Ekstreleri</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Cari hesapla çalışan müşterilerinizin borç, tahsilat, alacak hareketlerini izleyin. Ekstreleri anında <b>PDF olarak yazdırın</b> veya tek tıkla <b>WhatsApp ya da E-posta</b> aracılığıyla müşterilerinize mutabakat taslağı olarak gönderin.
          </p>
        </section>

        {message && (
          <div className="mb-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-xs font-black text-blue-950">
            ℹ️ {message}
          </div>
        )}

        <section className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          
          {/* Client List */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-black uppercase text-slate-500 tracking-wider">Cari Hesap Listesi</h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Firma veya yetkili ara..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {filtered.map((l, idx) => {
                const isSelected = activeLedger?.id === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setSelectedIdx(ledgers.findIndex((ledger) => ledger.id === l.id));
                      setMessage("");
                    }}
                    className={`w-full text-left rounded-xl p-3 border transition flex justify-between items-start gap-2 ${isSelected ? "bg-blue-50 border-blue-300 shadow-sm" : "bg-slate-50/50 hover:bg-slate-50 border-slate-100"}`}
                  >
                    <div>
                      <h3 className="font-black text-xs text-slate-800">{l.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{l.representative} · {l.city}</p>
                    </div>
                    <span className={`text-xs font-black ${l.balance > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                      {money(l.balance, l.currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Ledger detail with statement print & share controls */}
          {activeLedger ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">Aktif Cari Görünüm</span>
                  <h2 className="text-lg font-black text-slate-800">{activeLedger.name}</h2>
                  <p className="text-xs text-slate-400 font-bold">{activeLedger.representative} · {activeLedger.email}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block">NET BAKİYE</span>
                  <span className={`text-xl font-black ${activeLedger.balance > 0 ? "text-amber-600" : "text-emerald-700"}`}>
                    {money(activeLedger.balance, activeLedger.currency)}
                  </span>
                </div>
              </div>

              {/* Action Toolbar for PDF & WhatsApp Sharing */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="rounded-lg bg-slate-900 py-2 text-xs font-black text-white hover:bg-slate-800 transition shadow-sm"
                >
                  🖨️ PDF Olarak İndir
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="rounded-lg bg-emerald-600 py-2 text-xs font-black text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  💬 WhatsApp Gönder
                </button>
                <button
                  type="button"
                  onClick={handleShareEmail}
                  className="rounded-lg bg-blue-600 py-2 text-xs font-black text-white hover:bg-blue-700 transition shadow-sm"
                >
                  📧 E-posta Mutabakat
                </button>
              </div>

              {/* Transaction history ledger table */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Hesap Hareket Detayı</h3>
                
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-black">
                      <tr>
                        <th className="p-2.5">Tarih</th>
                        <th className="p-2.5">Evrak No</th>
                        <th className="p-2.5">Açıklama</th>
                        <th className="p-2.5 text-right">Borç (Debit)</th>
                        <th className="p-2.5 text-right">Alacak (Credit)</th>
                        <th className="p-2.5 text-right">Bakiye</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTransactionsWithRunningBalance.map((t) => (
                        <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                          <td className="p-2.5 font-bold text-slate-500">{t.date}</td>
                          <td className="p-2.5 font-mono text-[10px] text-slate-500">{t.docNo}</td>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-800 block">{t.type}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{t.note}</span>
                          </td>
                          <td className="p-2.5 text-right font-medium text-slate-700">{t.debit > 0 ? money(t.debit, activeLedger.currency) : "-"}</td>
                          <td className="p-2.5 text-right font-medium text-emerald-700">{t.credit > 0 ? money(t.credit, activeLedger.currency) : "-"}</td>
                          <td className="p-2.5 text-right font-black text-slate-800">{money(t.runningBalance, activeLedger.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </section>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center italic text-slate-400">
              Detayları görmek için soldan bir cari hesap seçin.
            </div>
          )}

        </section>
      </div>
    </main>
  );
}
