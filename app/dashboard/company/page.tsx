import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Firma Ayarları"
      eyebrow="Mağaza Kimliği"
      title="Firma Ayarları"
      description="Mağaza adı, logo, varsayılan dil, ana para birimi, müşteri erişim modu ve dijital vitrin ayarlarını yönetin."
      actionLabel="Ayarları Kaydet"
      stats={[
        { label: "Firma", value: "OBDTR", tone: "normal" },
        { label: "Varsayılan Dil", value: "TR", tone: "normal" },
        { label: "Ana Para", value: "GEL", tone: "normal" },
        { label: "Portal", value: "Aktif", tone: "good" }
      ]}
      sectionTitle="Temel Firma Ayarları"
      sectionDescription="Firma ayarları ileride gerçek veritabanına bağlanacak."
      items={[
        { title: "Firma Adı", subtitle: "OBDTR Diagnostics", meta1: "Firma kodu", meta2: "OBDTR", meta3: "Aktif" },
        { title: "Müşteri Portalı", subtitle: "Herkese açık / onaylı seçilebilir", meta1: "Fiyat gösterimi", meta2: "Yetkiye bağlı", meta3: "Aktif" },
        { title: "Dijital Vitrin", subtitle: "Ürün ve hizmet görünürlüğü", meta1: "Kampanya", meta2: "Reklam destekli", meta3: "Aktif" }
      ]}
      sideTitle="Müşteri Erişim Modları"
      sideItems={["Herkese açık", "Onaylı müşteriler", "Davet kodu ile giriş", "Tamamen kapalı", "Sadece teklif ile satış"]}
      note="HBS mağazayı müşteri bulmaya zorlamaz; mağaza isterse vitrinini açar, isterse kapalı tutar."
    />
  );
}
