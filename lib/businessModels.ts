export type BusinessModelKey =
  | "products"
  | "services"
  | "onSiteService"
  | "transport"
  | "food"
  | "consulting"
  | "rental"
  | "tour"
  | "realEstate"
  | "vehicles"
  | "auction";

export type PricingMode =
  | "fixed"
  | "hourly"
  | "daily"
  | "perPerson"
  | "staffBased"
  | "equipmentBased"
  | "quoteOnly";

export const businessModels: Array<{
  key: BusinessModelKey;
  title: string;
  shortTitle: string;
  description: string;
  dashboardModules: string[];
}> = [
  {
    key: "products",
    title: "Ürün satışı",
    shortTitle: "Ürün",
    description: "Stok, depo, raf adresleme, ürün görseli ve vitrin görünürlüğüyle fiziksel ürün satışı.",
    dashboardModules: ["Ürün yönetimi", "Depo haritası", "Stok hareketleri", "Vitrin"],
  },
  {
    key: "services",
    title: "Hizmet satışı",
    shortTitle: "Hizmet",
    description: "Kuaför, pedikür, oto servis, danışmanlık, özel ders, sağlık ve randevulu hizmet yönetimi.",
    dashboardModules: ["Hizmet kataloğu", "Personel", "Takvim", "Rezervasyon"],
  },
  {
    key: "onSiteService",
    title: "Yerinde hizmet",
    shortTitle: "Yerinde hizmet",
    description: "Elektrikçi, tesisatçı, marangoz, klima servisi, özel ders ve ev/iş yeri teknik servisleri.",
    dashboardModules: ["Servis bölgesi", "Adres/konum", "Usta/personel", "Randevu"],
  },
  {
    key: "transport",
    title: "Nakliye / ulaşım",
    shortTitle: "Nakliye",
    description: "Evden eve nakliye, VIP taksi, minibüs, midibüs, otobüs ve özel transfer hizmetleri.",
    dashboardModules: ["Araç filosu", "Güzergah", "Kapasite", "Teklif"],
  },
  {
    key: "food",
    title: "Lokanta / menü",
    shortTitle: "Yeme içme",
    description: "Menü fotoğrafları, restoran/paket fiyatları, masa rezervasyonu ve eve teslim seçenekleri.",
    dashboardModules: ["Menü", "Paket servis", "Masa rezervasyonu", "Kampanya"],
  },
  {
    key: "consulting",
    title: "Danışmanlık",
    shortTitle: "Danışmanlık",
    description: "Hukuk, yaşam koçu, aile danışmanı, diyetisyen, eğitim ve profesyonel danışmanlık randevuları.",
    dashboardModules: ["Uzman profili", "Online/yüz yüze", "Takvim", "Gizli notlar"],
  },
  {
    key: "rental",
    title: "Kiralama",
    shortTitle: "Kiralık",
    description: "Ekipman, araç, oda, depo, ofis veya zaman bazlı kiralanabilir kaynak yönetimi.",
    dashboardModules: ["Kiralık varlıklar", "Uygunluk", "Depozito", "Teslim/iade"],
  },
  {
    key: "tour",
    title: "Tur / deneyim",
    shortTitle: "Tur",
    description: "Tekne turu, şehir turu, dağcılık, sağlık turu ve kontenjan bazlı rezervasyon.",
    dashboardModules: ["Tur programı", "Kontenjan", "Kalkış noktası", "Katılımcı listesi"],
  },
  {
    key: "realEstate",
    title: "Emlak",
    shortTitle: "Emlak",
    description: "Satılık/kiralık ilan, randevu, teklif, başvuru ve opsiyonel açık artırma.",
    dashboardModules: ["İlanlar", "Randevular", "Başvurular", "Açık artırma"],
  },
  {
    key: "vehicles",
    title: "Araç",
    shortTitle: "Araç",
    description: "Araç satış/kiralama, ekspertiz bilgisi, teklif ve teminatlı açık artırma.",
    dashboardModules: ["Araç ilanları", "Ekspertiz", "Teklif", "Açık artırma"],
  },
  {
    key: "auction",
    title: "Açık artırma",
    shortTitle: "İhale",
    description: "Teminat, güven skoru, teklif geçmişi ve ciddi alıcı kontrolüyle teklif toplama.",
    dashboardModules: ["İhale listesi", "Teminat", "Teklif geçmişi", "Güven skoru"],
  },
];

export const demoServiceCatalog = [
  {
    name: "Yerinde elektrikçi / tesisatçı çağır",
    category: "Yerinde hizmet",
    duration: "60-120 dk",
    capacity: "1 adres",
    staff: "Usta / ekip",
    pricing: "Servis ücreti + işçilik + malzeme",
    nextSlots: ["Bugün 18:00", "Yarın 09:30", "Yarın 14:00"],
  },
  {
    name: "Özel ders - evde veya online",
    category: "Eğitim / yerinde hizmet",
    duration: "50 dk",
    capacity: "1-4 öğrenci",
    staff: "Öğretmen",
    pricing: "Saatlik / paket ders",
    nextSlots: ["Bugün 20:00", "Yarın 17:00", "Cumartesi 11:00"],
  },
  {
    name: "Evden eve nakliye keşfi",
    category: "Nakliye",
    duration: "Randevulu keşif",
    capacity: "Araç ve ekip seçilir",
    staff: "Nakliye ekibi",
    pricing: "Mesafe + kat + eşya hacmi",
    nextSlots: ["Yarın 10:00", "Yarın 16:00", "Pazar 13:00"],
  },
  {
    name: "VIP taksi / minibüs transfer",
    category: "Ulaşım",
    duration: "Saatlik / mesafe",
    capacity: "1-18 yolcu",
    staff: "Şoför",
    pricing: "Mesafe + araç tipi",
    nextSlots: ["Bugün müsait", "Gece transfer", "Haftalık kiralama"],
  },
  {
    name: "Lokanta masa rezervasyonu",
    category: "Yeme içme",
    duration: "Rezervasyon",
    capacity: "Kişi sayısı",
    staff: "Salon ekibi",
    pricing: "Menü / masa / paket servis",
    nextSlots: ["Bugün 19:00", "Bugün 21:00", "Yarın 20:00"],
  },
  {
    name: "Hukuk / diyetisyen / yaşam koçu görüşmesi",
    category: "Danışmanlık",
    duration: "30-60 dk",
    capacity: "1 kişi / aile",
    staff: "Uzman",
    pricing: "Seans / paket",
    nextSlots: ["Online bugün", "Yarın 12:00", "Cuma 15:30"],
  },
  {
    name: "Oto servis arıza tespit",
    category: "Servis",
    duration: "45 dk",
    capacity: "1 araç",
    staff: "1 teknisyen",
    pricing: "Başlangıç ücreti + ek işlem",
    nextSlots: ["Bugün 14:30", "Bugün 16:00", "Yarın 10:00"],
  },
  {
    name: "Tekne turu - Batumi kıyı rotası",
    category: "Tur / deneyim",
    duration: "2 saat",
    capacity: "12 kişi",
    staff: "Kaptan + rehber",
    pricing: "Kişi başı / özel tur",
    nextSlots: ["Yarın 11:00", "Yarın 15:00", "Pazar 12:00"],
  },
  {
    name: "Hırdavat ekipman kiralama",
    category: "Kiralama",
    duration: "Günlük",
    capacity: "Stok adedi kadar",
    staff: "Teslim personeli",
    pricing: "Günlük + depozito",
    nextSlots: ["Bugün teslim", "Yarın teslim", "Haftalık kiralama"],
  },
];

export const pricingRules = [
  "Sabit fiyat",
  "Saatlik ücret",
  "Günlük kiralama",
  "Kişi başı fiyat",
  "Personel sayısına göre fiyat",
  "Ekipman kullanımına göre fiyat",
  "Başlangıç ücreti + süre",
  "Menü fiyatı / paket servis fiyatı",
  "Güzergah ve mesafeye göre fiyat",
  "Servis bölgesi + yol ücreti",
  "Online / yerinde seans fiyatı",
  "Teklif usulü",
];
