import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Ödeme Hatırlatmaları"
      eyebrow="İhtar / Reminder / Mahnung"
      title="Ödeme Hatırlatmaları"
      description="Geciken ödemeler için sistem taslak hazırlar; patron veya üst yönetici onayı olmadan gönderilmez."
      actionLabel="Yeni Hatırlatma Oluştur"
      stats={[
        { label: "Taslak", value: "5", tone: "normal" },
        { label: "Onay Bekliyor", value: "3", tone: "warn" },
        { label: "Gönderildi", value: "12", tone: "normal" },
        { label: "Ödendi", value: "8", tone: "good" }
      ]}
      sectionTitle="Bekleyen Hatırlatmalar"
      sectionDescription="Hatırlatma seviyeleri gecikme gününe göre oluşturulur."
      items={[
        { title: "Giorgi Auto Service", subtitle: "850 ₾", meta1: "15 gün", meta2: "2. Uyarı", meta3: "Onay Bekliyor" },
        { title: "Batumi Garage", subtitle: "320 USD", meta1: "6 gün", meta2: "1. Hatırlatma", meta3: "Taslak" },
        { title: "AutoLine Service", subtitle: "1.450 ₾", meta1: "30 gün", meta2: "3. Mahnung", meta3: "Düzenleme" }
      ]}
      sideTitle="Hatırlatma Seviyeleri"
      sideItems={["7 gün: nazik hatırlatma", "15 gün: resmi uyarı", "30 gün: ciddi ihtar", "45 gün: son bildirim", "Çok dilli Mahnung"]}
      note="Sistem taslak hazırlar; gönderim yalnızca patron veya üst yönetici onayıyla yapılır."
    />
  );
}
