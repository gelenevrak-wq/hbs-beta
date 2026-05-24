import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Teklif / Proforma"
      eyebrow="Teklif & Proforma"
      title="Teklif / Proforma"
      description="Müşterilere çok dilli teklif/proforma hazırlayın; toplu alım indirimi, kur sabitleme ve PDF çıktısı kullanın."
      actionLabel="Yeni Teklif Oluştur"
      stats={[
        { label: "Taslak", value: "4", tone: "normal" },
        { label: "Gönderildi", value: "11", tone: "normal" },
        { label: "Görüntülendi", value: "6", tone: "warn" },
        { label: "Kabul Edildi", value: "3", tone: "good" }
      ]}
      sectionTitle="Demo Teklif Kalemleri"
      sectionDescription="Teklif anındaki kur ve indirim bilgileri belgeye sabitlenir."
      items={[
        { title: "NGK Buji Seti", subtitle: "10 adet", meta1: "18 ₾ birim fiyat", meta2: "%10 toplu alım", meta3: "162 ₾" },
        { title: "Toyota Yağ Filtresi", subtitle: "5 adet", meta1: "35 ₾ birim fiyat", meta2: "%5 indirim", meta3: "166.25 ₾" },
        { title: "BMW Fren Balatası", subtitle: "2 set", meta1: "120 USD", meta2: "Kur sabitlendi", meta3: "240 USD" }
      ]}
      sideTitle="Teklif Özellikleri"
      sideItems={["Çok dilli belge", "Toplu alım indirimi", "Kur sabitleme", "PDF / WhatsApp / e-posta", "Tekliften siparişe dönüşüm"]}
      note="Toplu alım indirimi, ürün bazlı indirim ve teklif toplam indirimi PDF/proforma belgesine ayrı satır olarak yansıtılır."
    />
  );
}
