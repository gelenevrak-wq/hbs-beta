"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useParams } from "next/navigation";
import { LocalizedText, dynamicUi, pickLocalizedText } from "@/lib/i18n/dynamicContent";
import { HbsLanguageCode } from "@/lib/i18n/translations";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";

type StockKey = "inStock" | "limited" | "quote";

type StoreProduct = {
  id: string;
  slug: string;
  name: LocalizedText;
  category: LocalizedText;
  brand: string;
  model: LocalizedText;
  description: LocalizedText;
  stockStatus: StockKey;
  priceText: LocalizedText;
  imageUrl: string;
  barcode?: string;
  sku?: string;
  oemCode?: string;
};

type StoreData = {
  slug: string;
  name: string;
  category: LocalizedText;
  country: string;
  city: string;
  address: LocalizedText;
  phone: string;
  whatsapp: string;
  email: string;
  description: LocalizedText;
  rating: number;
  reviewCount: number;
  products: StoreProduct[];
};

const stockText: Record<StockKey, LocalizedText> = {
  inStock: { tr: "Stokta var", en: "In stock", de: "Verfügbar", ru: "В наличии", ka: "მარაგშია" },
  limited: { tr: "Sınırlı stok", en: "Limited stock", de: "Begrenzter Bestand", ru: "Ограниченный запас", ka: "შეზღუდული მარაგი" },
  quote: { tr: "Teklif gerekli", en: "Quote required", de: "Anfrage erforderlich", ru: "Цена по запросу", ka: "ფასი მოთხოვნით" },
};

const demoStores: StoreData[] = [
  {
    slug: "ferro-motors",
    name: "Ferro Motors",
    category: {
      tr: "Oto Yedek Parça",
      en: "Auto Spare Parts",
      de: "Autoersatzteile",
      ru: "Автозапчасти",
      ka: "ავტონაწილები",
    },
    country: "Georgia",
    city: "Batumi",
    address: {
      tr: "Batumi Merkez",
      en: "Batumi Center",
      de: "Batumi Zentrum",
      ru: "Центр Батуми",
      ka: "ბათუმის ცენტრი",
    },
    phone: "+995 555 000 001",
    whatsapp: "+995 555 000 001",
    email: "info@ferromotors.ge",
    description: {
      tr: "Ferro Motors; oto yedek parça, filtre, buji, fren ve motor parçaları için HBS üzerinde demo mağaza vitrini olarak gösterilmektedir.",
      en: "Ferro Motors is shown on HBS as a demo storefront for auto spare parts, filters, spark plugs, brake and engine parts.",
      de: "Ferro Motors wird auf HBS als Demo-Schaufenster für Autoersatzteile, Filter, Zündkerzen, Brems- und Motorteile angezeigt.",
      ru: "Ferro Motors показан в HBS как демонстрационная витрина для автозапчастей, фильтров, свечей зажигания, тормозных и моторных деталей.",
      ka: "Ferro Motors HBS-ზე ნაჩვენებია როგორც demo მაღაზიის ვიტრინა ავტონაწილებისთვის, ფილტრებისთვის, სანთლებისთვის, მუხრუჭისა და ძრავის ნაწილებისთვის.",
    },
    rating: 4.8,
    reviewCount: 126,
    products: [
      {
        id: "p1",
        slug: "ford-escape-fren-balatasi",
        name: { tr: "Ford Escape Fren Balatası", en: "Ford Escape Brake Pad", de: "Ford Escape Bremsbelag", ru: "Тормозные колодки Ford Escape", ka: "Ford Escape-ის სამუხრუჭე ხუნდი" },
        category: { tr: "Fren Sistemi", en: "Brake System", de: "Bremssystem", ru: "Тормозная система", ka: "მუხრუჭის სისტემა" },
        brand: "Ford",
        model: { tr: "Escape", en: "Escape" },
        description: {
          tr: "Ford Escape uyumlu ön fren balatası. Ürün uyumluluğu için mağaza yetkilisine soru sorulabilir.",
          en: "Front brake pad compatible with Ford Escape. You can ask the store to confirm compatibility.",
          de: "Vorderer Bremsbelag passend für Ford Escape. Die Kompatibilität kann beim Shop bestätigt werden.",
          ru: "Передние тормозные колодки, совместимые с Ford Escape. Совместимость можно уточнить у магазина.",
          ka: "Ford Escape-თან თავსებადი წინა სამუხრუჭე ხუნდი. თავსებადობა შეგიძლიათ მაღაზიასთან გადაამოწმოთ.",
        },
        stockStatus: "inStock",
        priceText: { tr: "Fiyat mağaza tarafından belirlenir", en: "Price set by store", de: "Preis wird vom Shop festgelegt", ru: "Цена устанавливается магазином", ka: "ფასი განისაზღვრება მაღაზიის მიერ" },
        imageUrl: "/product-images/brake-pad.svg",
        barcode: "8690000000011",
        sku: "FR-BALATA-ESCAPE-001",
        oemCode: "FORD-OEM-ESC-BR-001",
      },
      {
        id: "p2",
        slug: "toyota-corolla-yag-filtresi",
        name: { tr: "Toyota Corolla Yağ Filtresi", en: "Toyota Corolla Oil Filter", de: "Toyota Corolla Ölfilter", ru: "Масляный фильтр Toyota Corolla", ka: "Toyota Corolla-ის ზეთის ფილტრი" },
        category: { tr: "Filtre", en: "Filter", de: "Filter", ru: "Фильтр", ka: "ფილტრი" },
        brand: "Toyota",
        model: { tr: "Corolla", en: "Corolla" },
        description: {
          tr: "Toyota Corolla uyumlu yağ filtresi. Stok ve teslimat bilgisi mağaza tarafından yönetilir.",
          en: "Oil filter compatible with Toyota Corolla. Stock and delivery information is managed by the store.",
          de: "Ölfilter passend für Toyota Corolla. Bestand und Lieferung werden vom Shop verwaltet.",
          ru: "Масляный фильтр, совместимый с Toyota Corolla. Запасы и доставка управляются магазином.",
          ka: "Toyota Corolla-თან თავსებადი ზეთის ფილტრი. მარაგისა და მიწოდების ინფორმაცია იმართება მაღაზიის მიერ.",
        },
        stockStatus: "inStock",
        priceText: { tr: "22 GEL", en: "22 GEL" },
        imageUrl: "/product-images/oil-filter.svg",
        barcode: "8690000000028",
        sku: "FR-FILTRE-COROLLA-002",
        oemCode: "TOYOTA-OEM-COR-FLT-002",
      },
      {
        id: "p3",
        slug: "universal-buji-seti",
        name: { tr: "Universal Buji Seti", en: "Universal Spark Plug Set", de: "Universelles Zündkerzen-Set", ru: "Универсальный комплект свечей", ka: "უნივერსალური სანთლების ნაკრები" },
        category: { tr: "Ateşleme Sistemi", en: "Ignition System", de: "Zündsystem", ru: "Система зажигания", ka: "ანთების სისტემა" },
        brand: "Universal",
        model: { tr: "Çeşitli Modeller", en: "Various Models", de: "Verschiedene Modelle", ru: "Разные модели", ka: "სხვადასხვა მოდელი" },
        description: {
          tr: "Farklı araç modelleri için buji seti. Araç marka/model/yıl bilgisiyle uyumluluk kontrolü gerekir.",
          en: "Spark plug set for various vehicle models. Compatibility should be checked with make, model and year.",
          de: "Zündkerzen-Set für verschiedene Fahrzeugmodelle. Kompatibilität nach Marke, Modell und Baujahr prüfen.",
          ru: "Комплект свечей для разных моделей автомобилей. Совместимость проверяется по марке, модели и году.",
          ka: "სანთლების ნაკრები სხვადასხვა ავტომობილისთვის. თავსებადობა უნდა შემოწმდეს მარკით, მოდელითა და წლით.",
        },
        stockStatus: "limited",
        priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Angebot anfragen", ru: "Запросить цену", ka: "მოითხოვეთ შეთავაზება" },
        imageUrl: "/product-images/spark-plugs.svg",
        barcode: "8690000000042",
        sku: "FR-BUJI-SET-004",
      },
    ],
  },

  {
    slug: "obdtr",
    name: "OBDTR",
    category: { tr: "Oto Diagnostik ve Test Cihazları", en: "Auto Diagnostics and Test Tools", de: "Auto-Diagnose und Testgeräte", ru: "Автодиагностика и тестеры", ka: "ავტოდიაგნოსტიკა და ტესტერები" },
    country: "Türkiye",
    city: "İstanbul",
    address: { tr: "OBDTR Online Mağaza", en: "OBDTR Online Store", de: "OBDTR Online-Shop", ru: "Интернет-магазин OBDTR", ka: "OBDTR ონლაინ მაღაზია" },
    phone: "+90 551 854 06 22",
    whatsapp: "+90 551 854 06 22",
    email: "info@obdtr.com",
    description: {
      tr: "OBDTR; obdtr.com üzerindeki açık marka/kategori görselleriyle HBS üzerinde özel mağaza vitrini olarak gösterilmektedir. Katalog ürünlerinde stok/fiyat mağaza tarafından doğrulanır.",
      en: "OBDTR is shown on HBS as a dedicated storefront for Autel, Launch, Thinktool and professional vehicle diagnostic devices.",
      de: "OBDTR wird auf HBS als spezielles Schaufenster für Autel, Launch, Thinktool und professionelle Fahrzeugdiagnosegeräte angezeigt.",
      ru: "OBDTR показан в HBS как специализированная витрина для Autel, Launch, Thinktool и профессиональных диагностических устройств.",
      ka: "OBDTR HBS-ზე ნაჩვენებია როგორც Autel, Launch, Thinktool და პროფესიული დიაგნოსტიკური მოწყობილობების სპეციალური ვიტრინა.",
    },
    rating: 4.9,
    reviewCount: 218,
    products: [
      {
        id: "obd1",
        slug: "obdtr-obd-platformu",
        name: { tr: "OBDTR OBD Platformu", en: "OBDTR OBD Platformu", de: "OBDTR OBD Platformu", ru: "OBDTR OBD Platformu", ka: "OBDTR OBD Platformu" },
        category: { tr: "OBD cihazları vitrini", en: "OBD cihazları vitrini", de: "OBD cihazları vitrini", ru: "OBD cihazları vitrini", ka: "OBD cihazları vitrini" },
        brand: "OBDTR",
        model: { tr: "Public Vitrin", en: "Public Vitrin", de: "Public Vitrin", ru: "Public Vitrin", ka: "Public Vitrin" },
        description: { tr: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", en: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", de: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", ru: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", ka: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir." },
        stockStatus: "quote",
        priceText: { tr: "Bilgi / teklif alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png",
        barcode: "868OBDTR0000",
        sku: "OBDTR-PLATFORM",
      },
      {
        id: "obd2",
        slug: "autel-diagnostics-grubu",
        name: { tr: "Autel Diagnostics Ürün Grubu", en: "Autel Diagnostics Ürün Grubu", de: "Autel Diagnostics Ürün Grubu", ru: "Autel Diagnostics Ürün Grubu", ka: "Autel Diagnostics Ürün Grubu" },
        category: { tr: "Profesyonel diagnostik", en: "Profesyonel diagnostik", de: "Profesyonel diagnostik", ru: "Profesyonel diagnostik", ka: "Profesyonel diagnostik" },
        brand: "Autel",
        model: { tr: "Diagnostic Group", en: "Diagnostic Group", de: "Diagnostic Group", ru: "Diagnostic Group", ka: "Diagnostic Group" },
        description: { tr: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model ve fiyat mağaza tarafından teyit edilir.", en: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model ve fiyat mağaza tarafından teyit edilir.", de: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model ve fiyat mağaza tarafından teyit edilir.", ru: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model ve fiyat mağaza tarafından teyit edilir.", ka: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model ve fiyat mağaza tarafından teyit edilir." },
        stockStatus: "quote",
        priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/autel-logo-y7s1WToBRtNK6JFO.png",
        barcode: "868OBDTR0001",
        sku: "OBDTR-AUTEL-GRUP",
        oemCode: "AUTEL",
      },
      {
        id: "obd3",
        slug: "launch-diagnostic-grubu",
        name: { tr: "Launch Diagnostic Ürün Grubu", en: "Launch Diagnostic Ürün Grubu", de: "Launch Diagnostic Ürün Grubu", ru: "Launch Diagnostic Ürün Grubu", ka: "Launch Diagnostic Ürün Grubu" },
        category: { tr: "OBD tarayıcı ve servis", en: "OBD tarayıcı ve servis", de: "OBD tarayıcı ve servis", ru: "OBD tarayıcı ve servis", ka: "OBD tarayıcı ve servis" },
        brand: "Launch",
        model: { tr: "Diagnostic Group", en: "Diagnostic Group", de: "Diagnostic Group", ru: "Diagnostic Group", ka: "Diagnostic Group" },
        description: { tr: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", en: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", de: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", ru: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", ka: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir." },
        stockStatus: "quote",
        priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/launch-logo-QyUWRWFwUubpqEtK.png",
        barcode: "868OBDTR0002",
        sku: "OBDTR-LAUNCH-GRUP",
        oemCode: "LAUNCH",
      },
      {
        id: "obd4",
        slug: "thinktool-professional-grubu",
        name: { tr: "Thinktool Professional Ürün Grubu", en: "Thinktool Professional Ürün Grubu", de: "Thinktool Professional Ürün Grubu", ru: "Thinktool Professional Ürün Grubu", ka: "Thinktool Professional Ürün Grubu" },
        category: { tr: "Diagnostik sistemler", en: "Diagnostik sistemler", de: "Diagnostik sistemler", ru: "Diagnostik sistemler", ka: "Diagnostik sistemler" },
        brand: "Thinktool",
        model: { tr: "Professional Group", en: "Professional Group", de: "Professional Group", ru: "Professional Group", ka: "Professional Group" },
        description: { tr: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", en: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", de: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", ru: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", ka: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır." },
        stockStatus: "quote",
        priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/thinktool-logo-CJSQAeVES6sh4t4N.png",
        barcode: "868OBDTR0003",
        sku: "OBDTR-THINKTOOL-GRUP",
        oemCode: "THINKTOOL",
      },
      {
        id: "obd5",
        slug: "zenith-diagnostic-systems",
        name: { tr: "Zenith Diagnostic Systems", en: "Zenith Diagnostic Systems", de: "Zenith Diagnostic Systems", ru: "Zenith Diagnostic Systems", ka: "Zenith Diagnostic Systems" },
        category: { tr: "Diagnostik sistemler", en: "Diagnostik sistemler", de: "Diagnostik sistemler", ru: "Diagnostik sistemler", ka: "Diagnostik sistemler" },
        brand: "Zenith",
        model: { tr: "Diagnostic Systems", en: "Diagnostic Systems", de: "Diagnostic Systems", ru: "Diagnostic Systems", ka: "Diagnostic Systems" },
        description: { tr: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", en: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", de: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", ru: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", ka: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır." },
        stockStatus: "quote",
        priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/zena--th-logo-C6Su7QKqVp3QS5wa.png",
        barcode: "868OBDTR0004",
        sku: "OBDTR-ZENITH-GRUP",
        oemCode: "ZENITH",
      },
      {
        id: "obd6",
        slug: "arac-gruplari-uyumluluk",
        name: { tr: "Araç Grupları Uyumluluk Bilgisi", en: "Araç Grupları Uyumluluk Bilgisi", de: "Araç Grupları Uyumluluk Bilgisi", ru: "Araç Grupları Uyumluluk Bilgisi", ka: "Araç Grupları Uyumluluk Bilgisi" },
        category: { tr: "Tüm markalar uyumluluk", en: "Tüm markalar uyumluluk", de: "Tüm markalar uyumluluk", ru: "Tüm markalar uyumluluk", ka: "Tüm markalar uyumluluk" },
        brand: "OBDTR",
        model: { tr: "Araç Grupları", en: "Araç Grupları", de: "Araç Grupları", ru: "Araç Grupları", ka: "Araç Grupları" },
        description: { tr: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", en: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", de: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", ru: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", ka: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak." },
        stockStatus: "quote",
        priceText: { tr: "Uyumluluk sor", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png",
        barcode: "868OBDTR0005",
        sku: "OBDTR-ARAC-GRUPLARI",
      },
      {
        id: "obd7",
        slug: "obd-uzatma-kablosu",
        name: { tr: "OBD Uzatma Kablosu", en: "OBD Uzatma Kablosu", de: "OBD Uzatma Kablosu", ru: "OBD Uzatma Kablosu", ka: "OBD Uzatma Kablosu" },
        category: { tr: "Diagnostik aksesuar", en: "Diagnostik aksesuar", de: "Diagnostik aksesuar", ru: "Diagnostik aksesuar", ka: "Diagnostik aksesuar" },
        brand: "Genel",
        model: { tr: "OBD-II", en: "OBD-II", de: "OBD-II", ru: "OBD-II", ka: "OBD-II" },
        description: { tr: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", en: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", de: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", ru: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", ka: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir." },
        stockStatus: "quote",
        priceText: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "/product-images/diagnostic-scanner.svg",
        barcode: "868OBDTR0101",
        sku: "OBDTR-ACC-OBD-CABLE",
      },
      {
        id: "obd8",
        slug: "vci-arayuz-modulu",
        name: { tr: "VCI Arayüz Modülü", en: "VCI Arayüz Modülü", de: "VCI Arayüz Modülü", ru: "VCI Arayüz Modülü", ka: "VCI Arayüz Modülü" },
        category: { tr: "Diagnostik aksesuar", en: "Diagnostik aksesuar", de: "Diagnostik aksesuar", ru: "Diagnostik aksesuar", ka: "Diagnostik aksesuar" },
        brand: "Genel",
        model: { tr: "VCI", en: "VCI", de: "VCI", ru: "VCI", ka: "VCI" },
        description: { tr: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", en: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", de: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", ru: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", ka: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır." },
        stockStatus: "quote",
        priceText: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "/product-images/diagnostic-tablet.svg",
        barcode: "868OBDTR0102",
        sku: "OBDTR-ACC-VCI",
      },
      {
        id: "obd9",
        slug: "aku-batarya-test-cihazi",
        name: { tr: "Akü / Batarya Test Cihazı", en: "Akü / Batarya Test Cihazı", de: "Akü / Batarya Test Cihazı", ru: "Akü / Batarya Test Cihazı", ka: "Akü / Batarya Test Cihazı" },
        category: { tr: "Servis ekipmanı", en: "Servis ekipmanı", de: "Servis ekipmanı", ru: "Servis ekipmanı", ka: "Servis ekipmanı" },
        brand: "Genel",
        model: { tr: "Battery Tester", en: "Battery Tester", de: "Battery Tester", ru: "Battery Tester", ka: "Battery Tester" },
        description: { tr: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", en: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", de: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", ru: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", ka: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır." },
        stockStatus: "quote",
        priceText: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "/product-images/diagnostic-scanner.svg",
        barcode: "868OBDTR0103",
        sku: "OBDTR-BATTERY-TESTER",
      },
      {
        id: "obd10",
        slug: "diagnostik-yazilim-destegi",
        name: { tr: "Diagnostik Yazılım ve Güncelleme Desteği", en: "Diagnostik Yazılım ve Güncelleme Desteği", de: "Diagnostik Yazılım ve Güncelleme Desteği", ru: "Diagnostik Yazılım ve Güncelleme Desteği", ka: "Diagnostik Yazılım ve Güncelleme Desteği" },
        category: { tr: "Servis desteği", en: "Servis desteği", de: "Servis desteği", ru: "Servis desteği", ka: "Servis desteği" },
        brand: "OBDTR",
        model: { tr: "Software Support", en: "Software Support", de: "Software Support", ru: "Software Support", ka: "Software Support" },
        description: { tr: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", en: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", de: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", ru: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", ka: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır." },
        stockStatus: "quote",
        priceText: { tr: "Hizmet bilgisi alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
        imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png",
        barcode: "868OBDTR0104",
        sku: "OBDTR-SOFTWARE-SUPPORT",
      }
    ],
  },
  {
    slug: "yildiz-hirdavat",
    name: "Yıldız Hırdavat",
    category: { tr: "Hırdavat ve Tesisat", en: "Hardware and Plumbing", de: "Werkzeug und Sanitär", ru: "Инструменты и сантехника", ka: "ინსტრუმენტები და სანტექნიკა" },
    country: "Georgia",
    city: "Batumi",
    address: { tr: "Batumi Merkez", en: "Batumi Center", de: "Batumi Zentrum", ru: "Центр Батуми", ka: "ბათუმის ცენტრი" },
    phone: "+995 593 18 31 52",
    whatsapp: "+995 593 18 31 52",
    email: "yildiz@hbs.local",
    description: { tr: "Yıldız Hırdavat; Batum’da tesisat, bağlantı parçaları, el aletleri ve hırdavat ürünleri için örnek HBS mağaza vitrinidir.", en: "Yıldız Hırdavat is a sample HBS storefront in Batumi for plumbing, fittings, hand tools and hardware products.", de: "Yıldız Hırdavat ist ein Beispiel-Shop in Batumi für Sanitär, Fittings, Handwerkzeuge und Eisenwaren.", ru: "Yıldız Hırdavat — демо-витрина HBS в Батуми для сантехники, фитингов, ручного инструмента и хозтоваров.", ka: "Yıldız Hırdavat არის HBS-ის demo ვიტრინა ბათუმში სანტექნიკის, ფიტინგებისა და ინსტრუმენტებისთვის." },
    rating: 4.7,
    reviewCount: 92,
    products: [
      {
        id: "yh1",
        slug: "krom-mutfak-bataryasi",
        name: { tr: "Krom Mutfak Bataryası", en: "Chrome Kitchen Faucet", de: "Chrom-Küchenarmatur", ru: "Хромированный кухонный смеситель", ka: "ქრომის სამზარეულოს ონკანი" },
        category: { tr: "Tesisat", en: "Plumbing", de: "Sanitär", ru: "Сантехника", ka: "სანტექნიკა" },
        brand: "Yıldız",
        model: { tr: "Standart", en: "Standard", de: "Standard", ru: "Стандарт", ka: "სტანდარტი" },
        description: { tr: "Mutfak ve lavabo kullanımı için krom kaplama, dayanıklı batarya modeli.", en: "Durable chrome faucet model for kitchen and sink use.", de: "Robuste Chromarmatur für Küche und Waschbecken.", ru: "Прочный хромированный смеситель для кухни и раковины.", ka: "გამძლე ქრომირებული ონკანი სამზარეულოსა და ნიჟარისთვის." },
        stockStatus: "inStock",
        priceText: { tr: "Mağazadan fiyat alın", en: "Ask store for price", de: "Preis anfragen", ru: "Уточнить цену", ka: "ფასი მაღაზიაში" },
        imageUrl: "/product-images/tap-set.svg",
        barcode: "995YH0001",
        sku: "YH-TESISAT-BATARYA-001",
      },
      {
        id: "yh2",
        slug: "pvc-boru-baglanti-seti",
        name: { tr: "PVC Boru Bağlantı Seti", en: "PVC Pipe Fitting Set", de: "PVC-Rohrfitting-Set", ru: "Комплект PVC фитингов", ka: "PVC მილის ფიტინგების ნაკრები" },
        category: { tr: "Boru ve Bağlantı", en: "Pipe and Fittings", de: "Rohr und Fittings", ru: "Трубы и фитинги", ka: "მილები და ფიტინგები" },
        brand: "Yıldız",
        model: { tr: "Çeşitli Ölçüler", en: "Various Sizes", de: "Verschiedene Größen", ru: "Разные размеры", ka: "სხვადასხვა ზომა" },
        description: { tr: "Su tesisatı ve tamirat işleri için farklı ölçülerde PVC bağlantı parçaları.", en: "PVC fittings in various sizes for plumbing and repair work.", de: "PVC-Fittings in verschiedenen Größen für Sanitär- und Reparaturarbeiten.", ru: "PVC фитинги разных размеров для сантехнических и ремонтных работ.", ka: "PVC ფიტინგები სხვადასხვა ზომით სანტექნიკისა და რემონტისთვის." },
        stockStatus: "inStock",
        priceText: { tr: "Stoktan teslim", en: "Available from stock", de: "Ab Lager verfügbar", ru: "В наличии", ka: "მარაგშია" },
        imageUrl: "/product-images/pipe-fittings.svg",
        barcode: "995YH0002",
        sku: "YH-PVC-FITTING-SET-002",
      },
    ],
  },
];

function txt(value: LocalizedText | string, language: HbsLanguageCode) {
  return pickLocalizedText(value, language);
}

export default function StorePage() {
  const params = useParams<{ storeSlug: string }>();
  const { t, language, isReady } = useHbsLanguage();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<StoreProduct[]>([]);
  const [message, setMessage] = useState("");

  const store = demoStores.find((item) => item.slug === params.storeSlug);

  const filteredProducts = useMemo(() => {
    if (!store) return [];
    const q = search.trim().toLowerCase();
    return store.products.filter((product) => {
      const searchable = [product.name, product.category, product.model, product.description, product.priceText]
        .map((value) => txt(value, language).toLowerCase())
        .join(" ");
      return (
        !q ||
        searchable.includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.barcode?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q) ||
        product.oemCode?.toLowerCase().includes(q)
      );
    });
  }, [search, store, language]);

  if (!isReady) return <main className="min-h-screen bg-slate-50" />;

  if (!store) {
    return (
      <main className="min-h-screen hbs-market-page text-slate-950">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-black">{t.store.storeNotFound}</h1>
          <p className="mt-4 text-slate-600">{t.store.storeNotFoundText}</p>
          <Link href="/customer" className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-slate-950 hover:bg-slate-200">
            {t.product.goToCustomerPortal}
          </Link>
        </div>
      </main>
    );
  }

  function requireLogin() {
    const user = window.localStorage.getItem("hbs-current-user");
    if (!user) {
      window.location.href = "/login";
      return false;
    }
    return true;
  }

  function addToCart(product: StoreProduct) {
    if (!requireLogin()) return;
    setCart((currentCart) => [...currentCart, product]);
    setMessage(`${txt(product.name, language)} ${t.product.addedToCart}`);
  }
  function askQuestion(product: StoreProduct) {
    if (!requireLogin()) return;
    setMessage(`${txt(product.name, language)} ${t.product.questionDemo}`);
  }
  function requestOffer(product: StoreProduct) {
    if (!requireLogin()) return;
    setMessage(`${txt(product.name, language)} ${t.product.offerDemo}`);
  }
  function sendCartRequest() {
    if (!requireLogin()) return;
    setMessage(cart.length === 0 ? t.store.emptyCart : `${cart.length} ${t.store.cartItemsAdded}`);
  }

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.name,
    description: txt(store.description, language),
    address: {
      "@type": "PostalAddress",
      addressCountry: store.country,
      addressLocality: store.city,
      streetAddress: txt(store.address, language),
    },
    telephone: store.phone,
    email: store.email,
    url: `https://hbs.example.com/store/${store.slug}`,
    aggregateRating: { "@type": "AggregateRating", ratingValue: store.rating, reviewCount: store.reviewCount },
  };

  return (
    <main className="min-h-screen hbs-market-page text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }} />
      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-8">
        <header className="mb-4 flex items-center justify-between gap-2 sm:mb-8">
          <Link href="/" className="shrink-0 text-sm font-semibold tracking-wide text-slate-950">HBS</Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <CompactLanguageSwitcher />
            <Link href="/customer" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.customerPortal}</Link>
            <Link href="/login" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.storePanel}</Link>
            <Link href="/" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:block sm:px-4 sm:text-sm">{t.common.home}</Link>
          </div>
        </header>

        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:mb-6 sm:rounded-3xl sm:p-7">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] sm:gap-6">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-base">{t.store.eyebrow}</p>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{store.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-4 sm:leading-7">{txt(store.description, language)}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs sm:mt-5 sm:text-sm">
                <span className="rounded-full bg-blue-100 px-3 py-2 text-blue-800">{txt(store.category, language)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">{store.country} / {store.city}</span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">⭐ {store.rating} / {store.reviewCount}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-blue-800/70 bg-blue-100/40 p-4 sm:rounded-3xl sm:p-5">
              <h2 className="mb-3 font-bold">{t.store.contactInfo}</h2>
              <div className="grid gap-2 text-sm leading-6 text-blue-800">
                <p><span className="font-bold text-slate-950">{txt(dynamicUi.address, language)}:</span> {txt(store.address, language)}</p>
                <p><span className="font-bold text-slate-950">{txt(dynamicUi.phone, language)}:</span> {store.phone}</p>
                <p><span className="font-bold text-slate-950">WhatsApp:</span> {store.whatsapp}</p>
                <p><span className="font-bold text-slate-950">{txt(dynamicUi.email, language)}:</span> {store.email}</p>
              </div>
            </div>
          </div>
        </section>

        {message && <div className="mb-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 text-sm leading-6 text-blue-800 sm:mb-6 sm:rounded-3xl">{message}</div>}

        <section className="mb-6 grid gap-4 xl:grid-cols-[260px_1fr] sm:gap-5">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 sm:text-xs">{t.store.storeProducts}</p>
                <h2 className="mt-1 text-lg font-black sm:text-xl">{t.store.productSearch}</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">{filteredProducts.length}</span>
            </div>
            <label className="mt-3 grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">{t.common.search}</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-950 outline-none focus:border-blue-400 sm:text-sm" placeholder={`${t.common.brand}, ${t.common.model}, ${t.common.barcode}, ${t.common.sku}, ${t.common.oem}`} />
            </label>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black">{t.store.cartRequestList}</h3>
                <span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-slate-700">{cart.length}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-600">{cart.length === 0 ? t.store.emptyCart : `${cart.length} ${t.store.cartItemsAdded}`}</p>
              {cart.length > 0 && <div className="mt-2 grid gap-1 text-xs text-slate-600">{cart.slice(0, 4).map((product, index) => <p key={`${product.id}-${index}`} className="truncate">• {txt(product.name, language)}</p>)}</div>}
              <button type="button" onClick={sendCartRequest} className="mt-3 w-full rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white hover:bg-slate-800">{t.store.sendCartRequest}</button>
            </div>
            <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-900">{t.store.storefrontPrivacy}</div>
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">{t.store.storeSeoNotice}</div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 sm:text-xs">{t.store.productShowcase}</p>
                <h2 className="mt-1 text-lg font-black sm:text-xl">{filteredProducts.length} {t.store.productsListed}</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Marketplace görünümü</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Ferah grid</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                  <Link href={`/product/${product.slug}`} className="block bg-slate-50 p-2">
                    <div className="hbs-product-image rounded-xl">
                      <img src={product.imageUrl} alt={txt(product.name, language)} />
                    </div>
                  </Link>
                  <div className="p-2.5">
                    <div className="mb-1.5 flex flex-wrap gap-1">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">{txt(product.category, language)}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">{txt(stockText[product.stockStatus], language)}</span>
                    </div>
                    <h3 className="line-clamp-2 min-h-[2.35rem] text-sm font-black leading-5 text-slate-950">{txt(product.name, language)}</h3>
                    <p className="mt-1 line-clamp-2 min-h-[2rem] text-[11px] leading-4 text-slate-600">{txt(product.description, language)}</p>
                    <div className="mt-2 grid gap-1 text-[11px] text-slate-600">
                      <p className="truncate"><span className="font-black text-slate-950">{t.common.brand}:</span> {product.brand}</p>
                      <p className="truncate"><span className="font-black text-slate-950">{t.common.price}:</span> {txt(product.priceText, language)}</p>
                      {product.sku && <p className="truncate"><span className="font-black text-slate-950">{t.common.sku}:</span> {product.sku}</p>}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <Link href={`/product/${product.slug}`} className="rounded-lg bg-slate-950 px-2 py-1.5 text-center text-[11px] font-black text-white hover:bg-slate-800">{t.common.productDetail}</Link>
                      <button type="button" onClick={() => addToCart(product)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-black text-slate-950 hover:bg-slate-100">{t.common.addToCart}</button>
                      <button type="button" onClick={() => askQuestion(product)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-black text-slate-950 hover:bg-slate-100">{t.common.askProduct}</button>
                      <button type="button" onClick={() => requestOffer(product)} className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-[11px] font-black text-blue-700 hover:bg-blue-100">{t.common.requestOffer}</button>
                    </div>
                  </div>
                </article>
              ))}
              {filteredProducts.length === 0 && <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{t.store.productNotFoundInStore}</div>}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
