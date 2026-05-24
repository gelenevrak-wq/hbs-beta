import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Reklam / Kampanyalar"
      eyebrow="Dijital Vitrin & Reklam"
      title="Reklam / Kampanyalar"
      description="Mağazanızı HBS ana sayfasında, kategori aramalarında, şehir bazlı sonuçlarda ve kampanya/story alanlarında öne çıkarın."
      actionLabel="Yeni Kampanya Oluştur"
      stats={[
        { label: "Yayındaki Kampanya", value: "4", tone: "good" },
        { label: "Onay Bekleyen", value: "2", tone: "warn" },
        { label: "Görüntülenme", value: "1.920", tone: "normal" },
        { label: "Talep / Tıklama", value: "146", tone: "normal" }
      ]}
      sectionTitle="Kampanya Listesi"
      sectionDescription="Reklamlar HBS onayından geçmeden yayınlanmaz."
      items={[
        { title: "NGK bujilerde toplu alım indirimi", subtitle: "Kategori reklamı", meta1: "7 gün", meta2: "Oto yedek parça", meta3: "Yayında" },
        { title: "Ferro Motors öne çıkan mağaza", subtitle: "Ana sayfa", meta1: "30 gün", meta2: "Tüm kullanıcılar", meta3: "Onay Bekliyor" },
        { title: "Yağ filtrelerinde kampanya", subtitle: "Story", meta1: "48 saat", meta2: "Favori müşteriler", meta3: "Taslak" }
      ]}
      sideTitle="Reklam Alanları"
      sideItems={["Ana sayfa öne çıkarma", "Kategori reklamı", "Şehir / bölge bazlı reklam", "Sponsorlu arama sonucu", "Story / kısa kampanya"]}
      note="Sahte stok, yanıltıcı fiyat, gerçek olmayan indirim ve rakibi kötüleyen reklam yayınlanmaz."
    />
  );
}
