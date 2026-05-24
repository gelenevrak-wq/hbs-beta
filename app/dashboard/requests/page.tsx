import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Talep Panosu"
      eyebrow="Müşteri İlanları"
      title="Talep Panosu"
      description="Müşteriler ürün veya hizmet talebi bırakır; mağazalar gerçek ihtiyaçlara teklif verebilir."
      actionLabel="Talebe Teklif Ver"
      stats={[
        { label: "Aktif Talep", value: "38", tone: "normal" },
        { label: "Acil Talep", value: "9", tone: "warn" },
        { label: "Verilen Teklif", value: "14", tone: "normal" },
        { label: "Kazanılan Talep", value: "5", tone: "good" }
      ]}
      sectionTitle="Açık Müşteri Talepleri"
      sectionDescription="Talep panosu HBS’i aktif ticari talep ağına dönüştürür."
      items={[
        { title: "BMW E90 sağ far aranıyor", subtitle: "Giorgi Auto Service", meta1: "Batumi", meta2: "1 adet", meta3: "Teklif Bekliyor" },
        { title: "Toyota Corolla filtre seti", subtitle: "Batumi Garage", meta1: "Batumi", meta2: "20 set", meta3: "Toplu Alım" },
        { title: "Mercedes W204 ön tampon", subtitle: "Private Customer", meta1: "Tbilisi", meta2: "1 adet", meta3: "Acil Talep" }
      ]}
      sideTitle="Talep Türleri"
      sideItems={["Ürün arıyorum", "Hizmet arıyorum", "Toplu alım istiyorum", "Acil parça lazım", "Kiralama talebi"]}
      note="HBS mağazalara yalnızca vitrin vermez; hazır müşteri taleplerini de mağazaların önüne getirir."
    />
  );
}
