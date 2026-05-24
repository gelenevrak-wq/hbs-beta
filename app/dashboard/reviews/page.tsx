import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Yorumlar"
      eyebrow="İki Yönlü Güven Sistemi"
      title="Yorumlar / Değerlendirmeler"
      description="Müşteriler mağazaları; mağazalar da gerçek işlem sonrası müşterileri değerlendirebilir."
      actionLabel="Yorumları Denetle"
      stats={[
        { label: "Mağaza Puanı", value: "4.7", tone: "good" },
        { label: "Toplam Yorum", value: "128", tone: "normal" },
        { label: "Yanıt Bekleyen", value: "6", tone: "warn" },
        { label: "Şikayetli Yorum", value: "1", tone: "bad" }
      ]}
      sectionTitle="Son Değerlendirmeler"
      sectionDescription="Yorum hakkı yalnızca tamamlanmış işlem sonrası açılır."
      items={[
        { title: "Giorgi Auto Service", subtitle: "Müşteriden mağazaya", meta1: "Ürün doğru geldi", meta2: "5.0 yıldız", meta3: "Yayınlandı" },
        { title: "Batumi Garage", subtitle: "Müşteriden mağazaya", meta1: "Teslimat biraz gecikti", meta2: "4.0 yıldız", meta3: "Yanıt Bekliyor" },
        { title: "Private Customer", subtitle: "Mağazadan müşteriye", meta1: "Randevuya geç geldi", meta2: "3.2 yıldız", meta3: "İç not" }
      ]}
      sideTitle="Değerlendirme Ölçütleri"
      sideItems={["Ürün / hizmet doğruluğu", "Teslimat hızı", "İletişim kalitesi", "Ödeme disiplini", "Randevuya uyum"]}
      note="Müşteri hakkında yapılan değerlendirmeler hassastır; genel platformda ayrıntı yerine güven skoru gösterilmesi daha güvenlidir."
    />
  );
}
