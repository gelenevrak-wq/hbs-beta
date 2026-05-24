import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Kur Ayarları"
      eyebrow="Çoklu Para Birimi"
      title="Kur Ayarları"
      description="Patron referans kuru, alış/maliyet kurunu ve satışta kullanılacak ticari kuru ayrı ayrı belirleyebilir."
      actionLabel="Kur Güncelle"
      stats={[
        { label: "Ana Para Birimi", value: "GEL", tone: "normal" },
        { label: "USD Satış", value: "2.75", tone: "good" },
        { label: "EUR Satış", value: "3.18", tone: "warn" },
        { label: "TRY Satış", value: "0.090", tone: "normal" }
      ]}
      sectionTitle="Aktif Kur Tablosu"
      sectionDescription="Otomatik kur öneri verir; satışta patronun ticari kuru esas alınır."
      items={[
        { title: "USD $", subtitle: "Referans 2.70", meta1: "Alış 2.68", meta2: "Satış 2.75", meta3: "Bugün 10:15" },
        { title: "EUR €", subtitle: "Referans 3.16", meta1: "Alış 3.14", meta2: "Satış 3.18", meta3: "Bugün 10:15" },
        { title: "TRY ₺", subtitle: "Referans 0.085", meta1: "Alış 0.083", meta2: "Satış 0.090", meta3: "Bugün 10:15" }
      ]}
      sideTitle="Kur Yönetimi"
      sideItems={["Referans kur", "Alış / maliyet kuru", "Satış kuru", "Ürün bazlı özel kur", "Kur değişiklik geçmişi"]}
      note="Sipariş ve teklif anındaki kur sabitlenir; eski belgeler sonradan değişen kurla bozulmaz."
    />
  );
}
