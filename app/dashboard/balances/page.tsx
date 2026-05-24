import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Müşteri Bakiyeleri"
      eyebrow="Finans & Tahsilat"
      title="Müşteri Bakiyeleri"
      description="Müşterilerin borç, alacak, vade ve gecikme durumlarını takip edin."
      actionLabel="Yeni Tahsilat Gir"
      stats={[
        { label: "Toplam Alacak", value: "8.420 ₾", tone: "normal" },
        { label: "Gecikmiş", value: "850 ₾", tone: "warn" },
        { label: "Riskli Müşteri", value: "2", tone: "bad" },
        { label: "Bekleyen Hatırlatma", value: "3", tone: "warn" }
      ]}
      sectionTitle="Bakiye Listesi"
      sectionDescription="Geciken ödemeler hatırlatma / Mahnung modülüne bağlanır."
      items={[
        { title: "Giorgi Auto Service", subtitle: "Vade: 01.06.2026", meta1: "850 ₾", meta2: "15 gün gecikme", meta3: "Gecikmiş" },
        { title: "Batumi Garage", subtitle: "Vade: 10.06.2026", meta1: "320 USD", meta2: "6 gün", meta3: "Riskli" },
        { title: "AutoLine Service", subtitle: "Vade: 25.06.2026", meta1: "1.450 ₾", meta2: "Vadesi gelmedi", meta3: "Normal" }
      ]}
      sideTitle="Bakiye Özellikleri"
      sideItems={["Cari hesap", "Vade takibi", "Gecikme hesabı", "Çoklu para birimi", "Tahsilat kaydı"]}
      note="Aylık hizmet bedelinin en güçlü gerekçelerinden biri müşteri bakiyesi, tahsilat ve rapor takibidir."
    />
  );
}
