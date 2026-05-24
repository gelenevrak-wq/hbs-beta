import ModulePage from "@/components/layout/ModulePage";

export default function Page() {
  return (
    <ModulePage
      activeMenu="Stok"
      eyebrow="Stok Hareketleri"
      title="Stok Yönetimi"
      description="Giriş, çıkış, sayım, rezerve, transferde, sevkiyatta ve iade sürecindeki stokları takip edin."
      actionLabel="Stok Girişi"
      stats={[
        { label: "Toplam Stok Kalemi", value: "1.248", tone: "normal" },
        { label: "Bugünkü Giriş", value: "+84", tone: "good" },
        { label: "Bugünkü Çıkış", value: "-37", tone: "warn" },
        { label: "Düşük Stok", value: "23", tone: "bad" }
      ]}
      sectionTitle="Son Stok Hareketleri"
      sectionDescription="Ürün fiziksel depoda olmasa bile transferde veya sevkiyatta stok olarak izlenir."
      items={[
        { title: "NGK Buji Seti", subtitle: "Stok Girişi", meta1: "Admin", meta2: "Ana Depo > Raf A3", meta3: "+20" },
        { title: "Toyota Yağ Filtresi", subtitle: "Sipariş Çıkışı", meta1: "Depo Personeli", meta2: "Ana Depo > Raf B1", meta3: "-5" },
        { title: "BMW Fren Balatası", subtitle: "Sayım Düzeltmesi", meta1: "Admin", meta2: "Ana Depo > Raf C2", meta3: "-1" }
      ]}
      sideTitle="Stok Durumları"
      sideItems={["Satışa hazır stok", "Rezerve stok", "Transferde stok", "Sevkiyatta stok", "İade / karantina stok"]}
      note="Ürün yoldaysa kayıp değildir; HBS’te transferde veya sevkiyatta stok olarak görünür."
    />
  );
}
