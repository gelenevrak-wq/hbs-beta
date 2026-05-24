import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Randevu / Rezervasyon"
      eyebrow="Zaman Slotu & Kapasite"
      title="Randevu / Rezervasyon"
      description="Hizmet satan işletmeler zaman slotu; kiralama yapan işletmeler müsait varlıklarını müşterilere açabilir."
      actionLabel="Yeni Rezervasyon"
      stats={[
        { label: "Bugünkü Randevu", value: "12", tone: "normal" },
        { label: "Kiradaki Varlık", value: "5", tone: "warn" },
        { label: "Onay Bekleyen", value: "4", tone: "warn" },
        { label: "Müsait Kaynak", value: "18", tone: "good" }
      ]}
      sectionTitle="Rezervasyonlar"
      sectionDescription="Araç, saha, masaj, güzellik salonu, servis ve diğer hizmet randevuları için ortak takvim yapısı."
      items={[
        { title: "Toyota Prius Kiralama", subtitle: "Araç kiralama", meta1: "20.05 - 23.05", meta2: "1 araç", meta3: "Onaylandı" },
        { title: "Halı Saha 1", subtitle: "Saha kiralama", meta1: "22.05 20:00", meta2: "14 kişi", meta3: "Kapora Bekliyor" },
        { title: "Klasik Masaj", subtitle: "Hizmet randevusu", meta1: "23.05 14:00", meta2: "1 kişi", meta3: "Onay Bekliyor" }
      ]}
      sideTitle="Kapasite Mantığı"
      sideItems={["Tek kişilik hizmet", "Grup hizmeti", "Mekân kiralama", "Personel bazlı hizmet", "Ekipman / araç kiralama"]}
      note="HBS’te ürün stoktur; hizmet zaman slotudur; kiralanabilir varlık ise takvimle yönetilen envanterdir."
    />
  );
}
