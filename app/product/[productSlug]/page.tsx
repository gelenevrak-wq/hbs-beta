"use client";

import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LocalizedText, dynamicUi, pickLocalizedText } from "@/lib/i18n/dynamicContent";
import { HbsLanguageCode } from "@/lib/i18n/translations";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";

type StockKey = "inStock" | "limited" | "quote";

type ProductData = {
  slug: string;
  name: LocalizedText;
  brand: string;
  model: LocalizedText;
  category: LocalizedText;
  storeName: string;
  storeSlug: string;
  country: string;
  city: string;
  description: LocalizedText;
  priceText: LocalizedText;
  imageUrl: string;
  gallery: string[];
  priceValue?: number;
  currency: string;
  stockStatus: StockKey;
  barcode?: string;
  sku?: string;
  oemCode?: string;
  manufacturerCode?: string;
};

const stockText: Record<StockKey, LocalizedText> = {
  inStock: { tr: "Stokta var", en: "In stock", de: "Verfügbar", ru: "В наличии", ka: "მარაგშია" },
  limited: { tr: "Sınırlı stok", en: "Limited stock", de: "Begrenzter Bestand", ru: "Ограниченный запас", ka: "შეზღუდული მარაგი" },
  quote: { tr: "Teklif gerekli", en: "Quote required", de: "Anfrage erforderlich", ru: "Цена по запросу", ka: "ფასი მოთხოვნით" },
};

const demoProducts: ProductData[] = [
  {
    slug: "ford-escape-fren-balatasi",
    name: { tr: "Ford Escape Fren Balatası", en: "Ford Escape Brake Pad", de: "Ford Escape Bremsbelag", ru: "Тормозные колодки Ford Escape", ka: "Ford Escape-ის სამუხრუჭე ხუნდი" },
    brand: "Ford",
    model: { tr: "Escape", en: "Escape" },
    category: { tr: "Oto Yedek Parça / Fren Sistemi", en: "Auto Spare Parts / Brake System", de: "Autoersatzteile / Bremssystem", ru: "Автозапчасти / Тормозная система", ka: "ავტონაწილები / მუხრუჭის სისტემა" },
    storeName: "OBDTR Diagnostics",
    storeSlug: "obdtr",
    country: "Georgia",
    city: "Batumi",
    description: {
      tr: "Ford Escape uyumlu ön fren balatası. Ürün uyumluluğu için mağaza yetkilisine soru sorabilir, teklif veya sipariş talebi oluşturabilirsiniz.",
      en: "Front brake pad compatible with Ford Escape. You can ask the store to confirm compatibility or create a quote/order request.",
      de: "Vorderer Bremsbelag passend für Ford Escape. Sie können die Kompatibilität beim Shop bestätigen lassen oder eine Anfrage/Bestellung erstellen.",
      ru: "Передние тормозные колодки, совместимые с Ford Escape. Можно уточнить совместимость у магазина или создать запрос/заказ.",
      ka: "Ford Escape-თან თავსებადი წინა სამუხრუჭე ხუნდი. შეგიძლიათ გადაამოწმოთ თავსებადობა ან შექმნათ შეთავაზება/შეკვეთის მოთხოვნა.",
    },
    priceText: { tr: "Fiyat mağaza tarafından belirlenir", en: "Price set by store", de: "Preis wird vom Shop festgelegt", ru: "Цена устанавливается магазином", ka: "ფასი განისაზღვრება მაღაზიის მიერ" },
    imageUrl: "/product-images/brake-pad.svg",
    gallery: ["/product-images/brake-pad.svg", "/product-images/oil-filter.svg", "/product-images/spark-plugs.svg"],
    currency: "GEL",
    stockStatus: "inStock",
    barcode: "8690000000011",
    sku: "FR-BALATA-ESCAPE-001",
    oemCode: "FORD-OEM-ESC-BR-001",
    manufacturerCode: "MFG-BR-001",
  },
  {
    slug: "toyota-corolla-yag-filtresi",
    name: { tr: "Toyota Corolla Yağ Filtresi", en: "Toyota Corolla Oil Filter", de: "Toyota Corolla Ölfilter", ru: "Масляный фильтр Toyota Corolla", ka: "Toyota Corolla-ის ზეთის ფილტრი" },
    brand: "Toyota",
    model: { tr: "Corolla", en: "Corolla" },
    category: { tr: "Oto Yedek Parça / Filtre", en: "Auto Spare Parts / Filter", de: "Autoersatzteile / Filter", ru: "Автозапчасти / Фильтр", ka: "ავტონაწილები / ფილტრი" },
    storeName: "OBDTR Diagnostics",
    storeSlug: "obdtr",
    country: "Georgia",
    city: "Batumi",
    description: {
      tr: "Toyota Corolla uyumlu yağ filtresi. Stok, teslimat ve araç uyumluluğu bilgisi mağaza tarafından teyit edilir.",
      en: "Oil filter compatible with Toyota Corolla. Stock, delivery and vehicle compatibility are confirmed by the store.",
      de: "Ölfilter passend für Toyota Corolla. Bestand, Lieferung und Fahrzeugkompatibilität werden vom Shop bestätigt.",
      ru: "Масляный фильтр, совместимый с Toyota Corolla. Наличие, доставка и совместимость подтверждаются магазином.",
      ka: "Toyota Corolla-თან თავსებადი ზეთის ფილტრი. მარაგი, მიწოდება და თავსებადობა დასტურდება მაღაზიის მიერ.",
    },
    priceText: { tr: "22 GEL", en: "22 GEL" },
    imageUrl: "/product-images/oil-filter.svg",
    gallery: ["/product-images/oil-filter.svg", "/product-images/brake-pad.svg", "/product-images/spark-plugs.svg"],
    priceValue: 22,
    currency: "GEL",
    stockStatus: "inStock",
    barcode: "8690000000028",
    sku: "FR-FILTRE-COROLLA-002",
    oemCode: "TOYOTA-OEM-COR-FLT-002",
    manufacturerCode: "MFG-FLT-002",
  },
  {
    slug: "universal-buji-seti",
    name: { tr: "Universal Buji Seti", en: "Universal Spark Plug Set", de: "Universelles Zündkerzen-Set", ru: "Универсальный комплект свечей", ka: "უნივერსალური სანთლების ნაკრები" },
    brand: "Universal",
    model: { tr: "Çeşitli Modeller", en: "Various Models", de: "Verschiedene Modelle", ru: "Разные модели", ka: "სხვადასხვა მოდელი" },
    category: { tr: "Oto Yedek Parça / Ateşleme Sistemi", en: "Auto Spare Parts / Ignition System", de: "Autoersatzteile / Zündsystem", ru: "Автозапчасти / Система зажигания", ka: "ავტონაწილები / ანთების სისტემა" },
    storeName: "OBDTR Diagnostics",
    storeSlug: "obdtr",
    country: "Georgia",
    city: "Batumi",
    description: {
      tr: "Farklı araç modelleri için buji seti. Araç marka, model ve yıl bilgisiyle uyumluluk kontrolü gerekir.",
      en: "Spark plug set for various vehicle models. Compatibility should be checked with make, model and year.",
      de: "Zündkerzen-Set für verschiedene Fahrzeugmodelle. Kompatibilität nach Marke, Modell und Baujahr prüfen.",
      ru: "Комплект свечей для разных моделей автомобилей. Совместимость проверяется по марке, модели и году.",
      ka: "სანთლების ნაკრები სხვადასხვა ავტომობილისთვის. თავსებადობა უნდა შემოწმდეს მარკით, მოდელითა და წლით.",
    },
    priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Angebot anfragen", ru: "Запросить цену", ka: "მოითხოვეთ შეთავაზება" },
    imageUrl: "/product-images/spark-plugs.svg",
    gallery: ["/product-images/spark-plugs.svg", "/product-images/brake-pad.svg", "/product-images/oil-filter.svg"],
    currency: "GEL",
    stockStatus: "limited",
    barcode: "8690000000042",
    sku: "FR-BUJI-SET-004",
    manufacturerCode: "MFG-SPARK-004",
  },

  {
    slug: "obdtr-obd-platformu",
    name: { tr: "OBDTR OBD Platformu", en: "OBDTR OBD Platformu", de: "OBDTR OBD Platformu", ru: "OBDTR OBD Platformu", ka: "OBDTR OBD Platformu" },
    brand: "OBDTR",
    model: { tr: "Public Vitrin", en: "Public Vitrin", de: "Public Vitrin", ru: "Public Vitrin", ka: "Public Vitrin" },
    category: { tr: "OBD cihazları vitrini", en: "OBD cihazları vitrini", de: "OBD cihazları vitrini", ru: "OBD cihazları vitrini", ka: "OBD cihazları vitrini" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", en: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", de: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", ru: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir.", ka: "OBDTR sitesinde açık şekilde görünen OBD cihazları vitrini ve marka grupları HBS içine taşındı. Satış değil, bilgi/teklif odaklı gösterilir." },
    priceText: { tr: "Bilgi / teklif alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png",
    gallery: ["https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/autel-logo-y7s1WToBRtNK6JFO.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/launch-logo-QyUWRWFwUubpqEtK.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/thinktool-logo-CJSQAeVES6sh4t4N.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/zena--th-logo-C6Su7QKqVp3QS5wa.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0000",
    sku: "OBDTR-PLATFORM"
  },
  {
    slug: "autel-diagnostics-grubu",
    name: { tr: "Autel Diagnostics Ürün Grubu", en: "Autel Diagnostics Ürün Grubu", de: "Autel Diagnostics Ürün Grubu", ru: "Autel Diagnostics Ürün Grubu", ka: "Autel Diagnostics Ürün Grubu" },
    brand: "Autel",
    model: { tr: "Diagnostic Group", en: "Diagnostic Group", de: "Diagnostic Group", ru: "Diagnostic Group", ka: "Diagnostic Group" },
    category: { tr: "Profesyonel diagnostik", en: "Profesyonel diagnostik", de: "Profesyonel diagnostik", ru: "Profesyonel diagnostik", ka: "Profesyonel diagnostik" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model, stok ve fiyat mağaza tarafından teyit edilir.", en: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model, stok ve fiyat mağaza tarafından teyit edilir.", de: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model, stok ve fiyat mağaza tarafından teyit edilir.", ru: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model, stok ve fiyat mağaza tarafından teyit edilir.", ka: "OBDTR sitesindeki Autel kategori görseliyle gösterilen profesyonel diagnostik ürün grubu. Model, stok ve fiyat mağaza tarafından teyit edilir." },
    priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/autel-logo-y7s1WToBRtNK6JFO.png",
    gallery: ["https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/autel-logo-y7s1WToBRtNK6JFO.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0001",
    sku: "OBDTR-AUTEL-GRUP",
    oemCode: "AUTEL",
    manufacturerCode: "AUTEL",
  },
  {
    slug: "launch-diagnostic-grubu",
    name: { tr: "Launch Diagnostic Ürün Grubu", en: "Launch Diagnostic Ürün Grubu", de: "Launch Diagnostic Ürün Grubu", ru: "Launch Diagnostic Ürün Grubu", ka: "Launch Diagnostic Ürün Grubu" },
    brand: "Launch",
    model: { tr: "Diagnostic Group", en: "Diagnostic Group", de: "Diagnostic Group", ru: "Diagnostic Group", ka: "Diagnostic Group" },
    category: { tr: "OBD tarayıcı ve servis", en: "OBD tarayıcı ve servis", de: "OBD tarayıcı ve servis", ru: "OBD tarayıcı ve servis", ka: "OBD tarayıcı ve servis" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", en: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", de: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", ru: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir.", ka: "OBDTR sitesindeki Launch kategori görseliyle gösterilen diagnostik ürün grubu. Uygun model mağazaya sorularak netleştirilir." },
    priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/launch-logo-QyUWRWFwUubpqEtK.png",
    gallery: ["https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/launch-logo-QyUWRWFwUubpqEtK.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0002",
    sku: "OBDTR-LAUNCH-GRUP",
    oemCode: "LAUNCH",
    manufacturerCode: "LAUNCH",
  },
  {
    slug: "thinktool-professional-grubu",
    name: { tr: "Thinktool Professional Ürün Grubu", en: "Thinktool Professional Ürün Grubu", de: "Thinktool Professional Ürün Grubu", ru: "Thinktool Professional Ürün Grubu", ka: "Thinktool Professional Ürün Grubu" },
    brand: "Thinktool",
    model: { tr: "Professional Group", en: "Professional Group", de: "Professional Group", ru: "Professional Group", ka: "Professional Group" },
    category: { tr: "Diagnostik sistemler", en: "Diagnostik sistemler", de: "Diagnostik sistemler", ru: "Diagnostik sistemler", ka: "Diagnostik sistemler" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", en: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", de: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", ru: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır.", ka: "OBDTR sitesindeki Thinktool Professional görseliyle gösterilen diagnostik ürün grubu. Stok/fiyat canlı mağaza verisiyle doğrulanmalıdır." },
    priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/thinktool-logo-CJSQAeVES6sh4t4N.png",
    gallery: ["https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/thinktool-logo-CJSQAeVES6sh4t4N.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0003",
    sku: "OBDTR-THINKTOOL-GRUP",
    oemCode: "THINKTOOL",
    manufacturerCode: "THINKTOOL",
  },
  {
    slug: "zenith-diagnostic-systems",
    name: { tr: "Zenith Diagnostic Systems", en: "Zenith Diagnostic Systems", de: "Zenith Diagnostic Systems", ru: "Zenith Diagnostic Systems", ka: "Zenith Diagnostic Systems" },
    brand: "Zenith",
    model: { tr: "Diagnostic Systems", en: "Diagnostic Systems", de: "Diagnostic Systems", ru: "Diagnostic Systems", ka: "Diagnostic Systems" },
    category: { tr: "Diagnostik sistemler", en: "Diagnostik sistemler", de: "Diagnostik sistemler", ru: "Diagnostik sistemler", ka: "Diagnostik sistemler" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", en: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", de: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", ru: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır.", ka: "OBDTR sitesindeki Zenith Diagnostic Systems görseliyle gösterilen ürün grubu. Detay ve temin durumu mağaza tarafından onaylanır." },
    priceText: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/zena--th-logo-C6Su7QKqVp3QS5wa.png",
    gallery: ["https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/zena--th-logo-C6Su7QKqVp3QS5wa.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0004",
    sku: "OBDTR-ZENITH-GRUP",
    oemCode: "ZENITH",
    manufacturerCode: "ZENITH",
  },
  {
    slug: "arac-gruplari-uyumluluk",
    name: { tr: "Araç Grupları Uyumluluk Bilgisi", en: "Araç Grupları Uyumluluk Bilgisi", de: "Araç Grupları Uyumluluk Bilgisi", ru: "Araç Grupları Uyumluluk Bilgisi", ka: "Araç Grupları Uyumluluk Bilgisi" },
    brand: "OBDTR",
    model: { tr: "Araç Grupları", en: "Araç Grupları", de: "Araç Grupları", ru: "Araç Grupları", ka: "Araç Grupları" },
    category: { tr: "Tüm markalar uyumluluk", en: "Tüm markalar uyumluluk", de: "Tüm markalar uyumluluk", ru: "Tüm markalar uyumluluk", ka: "Tüm markalar uyumluluk" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", en: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", de: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", ru: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak.", ka: "OBDTR sitesindeki araç grupları bölümü. HBS içinde ürün uyumluluğu ve marka/model arama altyapısına bağlanacak." },
    priceText: { tr: "Uyumluluk sor", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png",
    gallery: ["https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0005",
    sku: "OBDTR-ARAC-GRUPLARI"
  },
  {
    slug: "obd-uzatma-kablosu",
    name: { tr: "OBD Uzatma Kablosu", en: "OBD Uzatma Kablosu", de: "OBD Uzatma Kablosu", ru: "OBD Uzatma Kablosu", ka: "OBD Uzatma Kablosu" },
    brand: "Genel",
    model: { tr: "OBD-II", en: "OBD-II", de: "OBD-II", ru: "OBD-II", ka: "OBD-II" },
    category: { tr: "Diagnostik aksesuar", en: "Diagnostik aksesuar", de: "Diagnostik aksesuar", ru: "Diagnostik aksesuar", ka: "Diagnostik aksesuar" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", en: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", de: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", ru: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir.", ka: "Kolay temin edilebilir katalog aksesuarı olarak işaretlendi. Stokta varmış gibi değil, tedarik edilebilir ürün olarak gösterilir." },
    priceText: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "/product-images/diagnostic-scanner.svg",
    gallery: ["/product-images/diagnostic-scanner.svg", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0101",
    sku: "OBDTR-ACC-OBD-CABLE"
  },
  {
    slug: "vci-arayuz-modulu",
    name: { tr: "VCI Arayüz Modülü", en: "VCI Arayüz Modülü", de: "VCI Arayüz Modülü", ru: "VCI Arayüz Modülü", ka: "VCI Arayüz Modülü" },
    brand: "Genel",
    model: { tr: "VCI", en: "VCI", de: "VCI", ru: "VCI", ka: "VCI" },
    category: { tr: "Diagnostik aksesuar", en: "Diagnostik aksesuar", de: "Diagnostik aksesuar", ru: "Diagnostik aksesuar", ka: "Diagnostik aksesuar" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", en: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", de: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", ru: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır.", ka: "Diagnostik tablet ve yazılımlar için VCI arayüz modülü. Canlı sistemde stok ve uyumluluk mağaza tarafından onaylanır." },
    priceText: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "/product-images/diagnostic-tablet.svg",
    gallery: ["/product-images/diagnostic-tablet.svg", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0102",
    sku: "OBDTR-ACC-VCI"
  },
  {
    slug: "aku-batarya-test-cihazi",
    name: { tr: "Akü / Batarya Test Cihazı", en: "Akü / Batarya Test Cihazı", de: "Akü / Batarya Test Cihazı", ru: "Akü / Batarya Test Cihazı", ka: "Akü / Batarya Test Cihazı" },
    brand: "Genel",
    model: { tr: "Battery Tester", en: "Battery Tester", de: "Battery Tester", ru: "Battery Tester", ka: "Battery Tester" },
    category: { tr: "Servis ekipmanı", en: "Servis ekipmanı", de: "Servis ekipmanı", ru: "Servis ekipmanı", ka: "Servis ekipmanı" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", en: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", de: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", ru: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır.", ka: "Oto servisleri için ilgili katalog ürünü. Stokta gibi gösterilmez; teklif ve temin bilgisi mağaza onayına bağlıdır." },
    priceText: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "/product-images/diagnostic-scanner.svg",
    gallery: ["/product-images/diagnostic-scanner.svg", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0103",
    sku: "OBDTR-BATTERY-TESTER"
  },
  {
    slug: "diagnostik-yazilim-destegi",
    name: { tr: "Diagnostik Yazılım ve Güncelleme Desteği", en: "Diagnostik Yazılım ve Güncelleme Desteği", de: "Diagnostik Yazılım ve Güncelleme Desteği", ru: "Diagnostik Yazılım ve Güncelleme Desteği", ka: "Diagnostik Yazılım ve Güncelleme Desteği" },
    brand: "OBDTR",
    model: { tr: "Software Support", en: "Software Support", de: "Software Support", ru: "Software Support", ka: "Software Support" },
    category: { tr: "Servis desteği", en: "Servis desteği", de: "Servis desteği", ru: "Servis desteği", ka: "Servis desteği" },
    storeName: "OBDTR",
    storeSlug: "obdtr",
    country: "Türkiye",
    city: "İstanbul",
    description: { tr: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", en: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", de: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", ru: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır.", ka: "Diagnostik cihazlar için yazılım/güncelleme destek hizmeti. Canlı sistemde hizmet koşulları mağaza tarafından tanımlanır." },
    priceText: { tr: "Hizmet bilgisi alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" },
    imageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png",
    gallery: ["https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/autel-logo-y7s1WToBRtNK6JFO.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/launch-logo-QyUWRWFwUubpqEtK.png", "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/thinktool-logo-CJSQAeVES6sh4t4N.png"],
    currency: "TRY",
    stockStatus: "quote",
    barcode: "868OBDTR0104",
    sku: "OBDTR-SOFTWARE-SUPPORT"
  },
  {
    slug: "krom-mutfak-bataryasi",
    name: { tr: "Krom Mutfak Bataryası", en: "Chrome Kitchen Faucet", de: "Chrom-Küchenarmatur", ru: "Хромированный кухонный смеситель", ka: "ქრომის სამზარეულოს ონკანი" },
    brand: "Yıldız",
    model: { tr: "Standart", en: "Standard", de: "Standard", ru: "Стандарт", ka: "სტანდარტი" },
    category: { tr: "Hırdavat / Tesisat", en: "Hardware / Plumbing", de: "Werkzeug / Sanitär", ru: "Инструменты / Сантехника", ka: "ინსტრუმენტები / სანტექნიკა" },
    storeName: "Yıldız Hırdavat",
    storeSlug: "yildiz-hirdavat",
    country: "Georgia",
    city: "Batumi",
    description: { tr: "Mutfak ve lavabo kullanımı için krom kaplama, dayanıklı batarya modeli.", en: "Durable chrome faucet model for kitchen and sink use.", de: "Robuste Chromarmatur für Küche und Waschbecken.", ru: "Прочный хромированный смеситель для кухни и раковины.", ka: "გამძლე ქრომირებული ონკანი სამზარეულოსა და ნიჟარისთვის." },
    priceText: { tr: "Mağazadan fiyat alın", en: "Ask store for price", de: "Preis anfragen", ru: "Уточнить цену", ka: "ფასი მაღაზიაში" },
    imageUrl: "/product-images/tap-set.svg",
    gallery: ["/product-images/tap-set.svg", "/product-images/pipe-fittings.svg"],
    currency: "GEL",
    stockStatus: "inStock",
    barcode: "995YH0001",
    sku: "YH-TESISAT-BATARYA-001",
  },
  {
    slug: "pvc-boru-baglanti-seti",
    name: { tr: "PVC Boru Bağlantı Seti", en: "PVC Pipe Fitting Set", de: "PVC-Rohrfitting-Set", ru: "Комплект PVC фитингов", ka: "PVC მილის ფიტინგების ნაკრები" },
    brand: "Yıldız",
    model: { tr: "Çeşitli Ölçüler", en: "Various Sizes", de: "Verschiedene Größen", ru: "Разные размеры", ka: "სხვადასხვა ზომა" },
    category: { tr: "Hırdavat / Boru Bağlantı", en: "Hardware / Pipe Fittings", de: "Werkzeug / Rohrfittings", ru: "Инструменты / Фитинги", ka: "ინსტრუმენტები / ფიტინგები" },
    storeName: "Yıldız Hırdavat",
    storeSlug: "yildiz-hirdavat",
    country: "Georgia",
    city: "Batumi",
    description: { tr: "Su tesisatı ve tamirat işleri için farklı ölçülerde PVC bağlantı parçaları.", en: "PVC fittings in various sizes for plumbing and repair work.", de: "PVC-Fittings in verschiedenen Größen für Sanitär- und Reparaturarbeiten.", ru: "PVC фитинги разных размеров для сантехнических и ремонтных работ.", ka: "PVC ფიტინგები სხვადასხვა ზომით სანტექნიკისა და რემონტისთვის." },
    priceText: { tr: "Stoktan teslim", en: "Available from stock", de: "Ab Lager verfügbar", ru: "В наличии", ka: "მარაგშია" },
    imageUrl: "/product-images/pipe-fittings.svg",
    gallery: ["/product-images/pipe-fittings.svg", "/product-images/tap-set.svg"],
    currency: "GEL",
    stockStatus: "inStock",
    barcode: "995YH0002",
    sku: "YH-PVC-FITTING-SET-002",
  },
];

function txt(value: LocalizedText | string, language: HbsLanguageCode) {
  return pickLocalizedText(value, language);
}

function availabilityUrl(stockStatus: StockKey) {
  if (stockStatus === "inStock") return "https://schema.org/InStock";
  if (stockStatus === "limited") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/PreOrder";
}

export default function ProductDetailPage() {
  const params = useParams<{ productSlug: string }>();
  const { t, language, isReady } = useHbsLanguage();
  const [message, setMessage] = useState("");
  const product = demoProducts.find((item) => item.slug === params.productSlug);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return demoProducts.filter((item) => item.slug !== product.slug && item.storeSlug === product.storeSlug);
  }, [product]);

  if (!isReady) return <main className="min-h-screen bg-slate-50" />;

  if (!product) {
    return (
      <main className="min-h-screen hbs-market-page px-6 py-8 text-slate-950">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-black">{t.product.productNotFound}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{t.product.productNotFoundText}</p>
          <Link href="/customer" className="mt-6 rounded-2xl bg-white px-6 py-3 font-black text-slate-950 hover:bg-slate-200">{t.product.goToCustomerPortal}</Link>
        </div>
      </main>
    );
  }

  const activeProduct: ProductData = product;
  const displayGallery = Array.from(new Set([activeProduct.imageUrl, ...activeProduct.gallery])).slice(0, 4);
  const internalWarehouseCode = activeProduct.storeSlug === "obdtr" ? "OBDTR / Ana Depo / D-01-R03-G02" : activeProduct.storeSlug === "yildiz-hirdavat" ? "Yıldız / Ana Depo / T-02-R04-G01" : "Depo / A-03-R12-G04";
  const storefrontNames = activeProduct.storeSlug === "obdtr" ? "OBDTR Online Vitrin, Diagnostik Vitrini" : activeProduct.storeSlug === "yildiz-hirdavat" ? "Yıldız Batum Vitrini, Tesisat Ürünleri" : "OBDTR Online Vitrin";
  const canonicalUrl = `https://hbs.example.com/product/${activeProduct.slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: txt(activeProduct.name, language),
    description: txt(activeProduct.description, language),
    brand: { "@type": "Brand", name: activeProduct.brand },
    sku: activeProduct.sku,
    mpn: activeProduct.manufacturerCode || activeProduct.oemCode,
    gtin13: activeProduct.barcode,
    category: txt(activeProduct.category, language),
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: activeProduct.currency,
      price: activeProduct.priceValue ?? undefined,
      availability: availabilityUrl(activeProduct.stockStatus),
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: activeProduct.storeName },
      areaServed: { "@type": "City", name: activeProduct.city },
    },
  };

  function requireLogin() {
    const user = window.localStorage.getItem("hbs-current-user");
    if (!user) {
      window.location.href = "/login";
      return false;
    }
    return true;
  }

  function addToCart() { if (!requireLogin()) return; setMessage(`${txt(activeProduct.name, language)} ${t.product.addedToCart}`); }
  function askQuestion() { if (!requireLogin()) return; setMessage(`${txt(activeProduct.name, language)} ${t.product.questionDemo}`); }
  function requestOffer() { if (!requireLogin()) return; setMessage(`${txt(activeProduct.name, language)} ${t.product.offerDemo}`); }

  return (
    <main className="min-h-screen hbs-market-page px-3 py-3 text-slate-950 sm:px-6 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex items-center justify-between gap-2 sm:mb-8">
          <Link href="/" className="shrink-0 text-sm font-black tracking-wide sm:text-2xl">HBS</Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <CompactLanguageSwitcher />
            <Link href={`/store/${activeProduct.storeSlug}`} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.storefront}</Link>
            <Link href="/customer" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:inline-flex sm:px-4 sm:text-sm">{t.common.customerPortal}</Link>
            <Link href="/" className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100 sm:block sm:px-4 sm:text-sm">{t.common.home}</Link>
          </div>
        </header>

        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:mb-6 sm:rounded-[2rem] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr_0.74fr] sm:gap-5">
            <div>
              <div className="hbs-product-image">
                <img src={activeProduct.imageUrl} alt={txt(activeProduct.name, language)} />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {displayGallery.map((image) => (
                  <div key={image} className="hbs-product-image rounded-xl">
                    <img src={image} alt={txt(activeProduct.name, language)} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800/80 sm:text-sm">{t.product.eyebrow}</p>
              <h1 className="mt-2 text-2xl font-black leading-tight sm:mt-3 sm:text-4xl">{txt(activeProduct.name, language)}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">{txt(activeProduct.description, language)}</p>
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                <span className="rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-800 sm:px-4 sm:text-sm">{txt(activeProduct.category, language)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600 sm:px-4 sm:text-sm">{activeProduct.country} / {activeProduct.city}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 sm:px-4 sm:text-sm">{txt(stockText[activeProduct.stockStatus], language)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 sm:rounded-3xl sm:p-4">
              <h2 className="text-lg font-black text-blue-800 sm:text-xl">{txt(activeProduct.priceText, language)}</h2>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-blue-800/90 sm:mt-5 sm:gap-3">
                <p><span className="font-bold text-slate-950">{t.common.store}:</span> {activeProduct.storeName}</p>
                <p><span className="font-bold text-slate-950">{t.common.brand}:</span> {activeProduct.brand}</p>
                <p><span className="font-bold text-slate-950">{t.common.model}:</span> {txt(activeProduct.model, language)}</p>
                <p><span className="font-bold text-slate-950">{t.common.city}:</span> {activeProduct.city}</p>
              </div>
              <div className="mt-5 grid gap-2 sm:mt-6 sm:gap-3">
                <button type="button" onClick={addToCart} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white hover:bg-slate-200 sm:rounded-2xl sm:px-6 sm:py-4">{t.common.addToCart}</button>
                <button type="button" onClick={requestOffer} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black hover:bg-slate-100 sm:rounded-2xl sm:px-6 sm:py-4">{t.common.requestOffer}</button>
                <button type="button" onClick={askQuestion} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black hover:bg-slate-100 sm:rounded-2xl sm:px-6 sm:py-4">{t.common.askStore}</button>
              </div>
            </div>
          </div>
        </section>

        {message && <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 sm:mb-6 sm:rounded-3xl sm:p-5">{message}</div>}

        <section className="mb-4 grid gap-3 sm:mb-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black sm:text-xl">Ürün açıklaması ve kullanım bilgisi</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">Detay</span>
            </div>
            <p className="text-sm leading-6 text-slate-700">{txt(activeProduct.description, language)}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Uyumluluk / kullanım</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">Mağaza onayıyla kesinleştirilir; araç, cihaz veya tesisat ölçüsü kontrol edilir.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Görsel durumu</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">Gerçek görsel yoksa kategoriye uygun temsili görsel kullanılır; canlı sistemde mağaza kendi fotoğrafını yükler.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:rounded-[2rem] sm:p-5">
            <h2 className="text-lg font-black text-emerald-900 sm:text-xl">Depo / vitrin bağlantısı</h2>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-emerald-900/90">
              <p><span className="font-black">İç depo adresi:</span> {internalWarehouseCode}</p>
              <p><span className="font-black">Müşteriye açık vitrin:</span> {storefrontNames}</p>
              <p><span className="font-black">Kural:</span> Depo ürünün nerede durduğunu, vitrin müşteriye nerede göründüğünü anlatır.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] sm:gap-6">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <h2 className="text-xl font-black sm:text-2xl">{t.product.codesTitle}</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:mt-5 sm:gap-3">
              <p><span className="font-bold text-slate-950">{t.common.barcode}:</span> {activeProduct.barcode || "-"}</p>
              <p><span className="font-bold text-slate-950">{t.common.sku}:</span> {activeProduct.sku || "-"}</p>
              <p><span className="font-bold text-slate-950">{t.common.oem}:</span> {activeProduct.oemCode || "-"}</p>
              <p><span className="font-bold text-slate-950">{t.common.manufacturerCode}:</span> {activeProduct.manufacturerCode || "-"}</p>
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:mt-6 sm:rounded-3xl sm:p-5">
              <h3 className="font-black text-amber-800">{t.product.googleVisibility}</h3>
              <p className="mt-2 text-sm leading-6 text-amber-800/90 sm:mt-3">{t.common.seoNotice}</p>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <h2 className="text-xl font-black sm:text-2xl">{t.product.storeDeliveryTitle}</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 sm:mt-5 sm:gap-4">
              <p><span className="font-bold text-slate-950">{t.common.store}:</span> {activeProduct.storeName}</p>
              <p><span className="font-bold text-slate-950">{t.common.location}:</span> {activeProduct.country} / {activeProduct.city}</p>
              <p><span className="font-bold text-slate-950">{txt(dynamicUi.salesMethodLabel, language)}:</span> {t.product.salesMethod}</p>
              <p><span className="font-bold text-slate-950">{txt(dynamicUi.note, language)}:</span> {t.product.realSystemNote}</p>
            </div>
            <div className="mt-5 sm:mt-6">
              <Link href={`/store/${activeProduct.storeSlug}`} className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-200 sm:rounded-2xl sm:px-6 sm:py-4">{activeProduct.storeName} {t.product.goToStorePage}</Link>
            </div>
          </section>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:mt-6 sm:rounded-[2rem] sm:p-6">
          <h2 className="text-xl font-black sm:text-2xl">{t.product.similarProducts}</h2>
          <div className="mt-4 grid gap-3 sm:mt-6 md:grid-cols-3">
            {similarProducts.map((item) => (
              <Link key={item.slug} href={`/product/${item.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-500 hover:bg-slate-100 sm:rounded-3xl sm:p-5">
                <p className="text-xs text-blue-300 sm:text-sm">{txt(item.category, language)}</p>
                <h3 className="mt-1 font-black sm:mt-2">{txt(item.name, language)}</h3>
                <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">{item.storeName} · {item.city}</p>
                <p className="mt-1 text-sm font-bold text-slate-950 sm:mt-2">{txt(item.priceText, language)}</p>
              </Link>
            ))}
            {similarProducts.length === 0 && <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500 sm:rounded-3xl sm:p-5">{t.product.noSimilarProducts}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
