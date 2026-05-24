import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Lisans"
      eyebrow="Lisans & Paket Yönetimi"
      title="Lisans"
      description="HBS tek sistemdir. Paketlere göre kullanılacak modüller, kullanıcı sayısı, ürün limiti ve destek seviyesi değişir."
      actionLabel="Lisans Anahtarı Gir"
      stats={[
        { label: "Durum", value: "Demo", tone: "warn" },
        { label: "Demo Bitiş", value: "7 Gün", tone: "warn" },
        { label: "Aktif Modül", value: "12", tone: "good" },
        { label: "Pro Modül", value: "5", tone: "normal" }
      ]}
      sectionTitle="Aktif Modüller"
      sectionDescription="Modül erişimleri lisans paketine göre açılır/kapanır."
      items={[
        { title: "Stok Yönetimi", subtitle: "Temel modül", meta1: "Açık", meta2: "Başlangıç+", meta3: "Aktif" },
        { title: "Teklif / Proforma", subtitle: "Ticari modül", meta1: "Açık", meta2: "Standart+", meta3: "Aktif" },
        { title: "Randevu / Rezervasyon", subtitle: "Hizmet modülü", meta1: "Pro", meta2: "Pro+", meta3: "Kilitli" }
      ]}
      sideTitle="Lisans Seçenekleri"
      sideItems={["Aylık kullanım", "Yıllık lisans", "3 yıllık lisans", "5/10 yıllık özel teklif", "Ömürlük + yıllık bakım"]}
      note="Ömürlük lisans yazılım kullanım hakkıdır; bulut, yedekleme, bakım ve destek yıllık hizmet bedeline bağlıdır."
    />
  );
}
