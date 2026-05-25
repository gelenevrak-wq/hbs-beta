"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CompactLanguageSwitcher, { LanguageCode } from "@/components/language/CompactLanguageSwitcher";

type Localized = Partial<Record<LanguageCode, string>> & { tr: string };

type Product = {
  slug: string;
  name: Localized;
  category: Localized;
  store: string;
  storeSlug: string;
  city: string;
  country: string;
  image: string;
  price: Localized;
  tag: Localized;
  sku: string;
};

type Store = {
  slug: string;
  name: string;
  city: string;
  category: Localized;
  productCount: number;
  image: string;
};

const ui = {
  tr: {
    login: "Giriş",
    register: "Kayıt",
    discover: "Keşfet",
    hero: "Ürün, hizmet ve mağaza keşif platformu",
    sub: "Giriş yapmadan ürünleri gez. İşlem yapmak istediğinde tek HBS hesabı ile devam et.",
    search: "Ürün, hizmet, mağaza, barkod, SKU veya OEM ara",
    searchButton: "Ara",
    photo: "Fotoğraf",
    qr: "QR",
    barcode: "Barkod",
    categories: "Kategoriler",
    featured: "Öne çıkan ürünler",
    stores: "Mağazalar",
    products: "Ürünler",
    view: "İncele",
    all: "Tümü",
    auto: "Oto / Diagnostik",
    hardware: "Hırdavat / Tesisat",
    spare: "Yedek Parça",
    message: "Stok yaparken malını müşterilerine de göster.",
    region: "Arama bölgesi",
    regionPlaceholder: "Şehir / bölge seç",
    radius: "Çap",
    mapPick: "Haritadan seç",
    allWorld: "Tüm dünya",
  },
  en: {
    login: "Login",
    register: "Register",
    discover: "Discover",
    hero: "Product, service and store discovery platform",
    sub: "Browse products without signing in. Continue with one HBS account when you want to act.",
    search: "Search product, service, store, barcode, SKU or OEM",
    searchButton: "Search",
    photo: "Photo",
    qr: "QR",
    barcode: "Barcode",
    categories: "Categories",
    featured: "Featured products",
    stores: "Stores",
    products: "Products",
    view: "View",
    all: "All",
    auto: "Auto / Diagnostics",
    hardware: "Hardware / Plumbing",
    spare: "Spare Parts",
    message: "Enter stock once; show it to customers too.",
    region: "Search region",
    regionPlaceholder: "Choose city / region",
    radius: "Radius",
    mapPick: "Pick on map",
    allWorld: "Worldwide",
  },
  de: {
    login: "Login",
    register: "Registrieren",
    discover: "Entdecken",
    hero: "Plattform zum Entdecken von Produkten, Services und Shops",
    sub: "Produkte ohne Login ansehen. Für Aktionen mit einem HBS-Konto fortfahren.",
    search: "Produkt, Service, Shop, Barcode, SKU oder OEM suchen",
    searchButton: "Suchen",
    photo: "Foto",
    qr: "QR",
    barcode: "Barcode",
    categories: "Kategorien",
    featured: "Top-Produkte",
    stores: "Shops",
    products: "Produkte",
    view: "Ansehen",
    all: "Alle",
    auto: "Auto / Diagnose",
    hardware: "Werkzeug / Sanitär",
    spare: "Ersatzteile",
    message: "Bestand einmal erfassen; Kunden direkt zeigen.",
    region: "Suchgebiet",
    regionPlaceholder: "Stadt / Region wählen",
    radius: "Radius",
    mapPick: "Auf Karte wählen",
    allWorld: "Weltweit",
  },
  ru: {
    login: "Вход",
    register: "Регистрация",
    discover: "Смотреть",
    hero: "Платформа для поиска товаров, услуг и магазинов",
    sub: "Просматривайте товары без входа. Для действий войдите в единый аккаунт HBS.",
    search: "Товар, услуга, магазин, штрихкод, SKU или OEM",
    searchButton: "Поиск",
    photo: "Фото",
    qr: "QR",
    barcode: "Штрихкод",
    categories: "Категории",
    featured: "Популярные товары",
    stores: "Магазины",
    products: "Товары",
    view: "Открыть",
    all: "Все",
    auto: "Авто / Диагностика",
    hardware: "Инструменты / Сантехника",
    spare: "Запчасти",
    message: "Внеси склад один раз; покажи товар клиентам.",
    region: "Регион поиска",
    regionPlaceholder: "Выберите город / регион",
    radius: "Радиус",
    mapPick: "Выбрать на карте",
    allWorld: "Весь мир",
  },
  ka: {
    login: "შესვლა",
    register: "რეგისტრაცია",
    discover: "ნახვა",
    hero: "პროდუქტების, სერვისებისა და მაღაზიების პლატფორმა",
    sub: "დაათვალიერეთ შესვლის გარეშე. მოქმედებისთვის გამოიყენეთ ერთი HBS ანგარიში.",
    search: "პროდუქტი, სერვისი, მაღაზია, ბარკოდი, SKU ან OEM",
    searchButton: "ძებნა",
    photo: "ფოტო",
    qr: "QR",
    barcode: "ბარკოდი",
    categories: "კატეგორიები",
    featured: "რჩეული პროდუქტები",
    stores: "მაღაზიები",
    products: "პროდუქტები",
    view: "ნახვა",
    all: "ყველა",
    auto: "ავტო / დიაგნოსტიკა",
    hardware: "ინსტრუმენტი / სანტექნიკა",
    spare: "ნაწილები",
    message: "მარაგი ერთხელ შეიყვანე; მომხმარებელსაც აჩვენე.",
    region: "ძებნის ზონა",
    regionPlaceholder: "აირჩიეთ ქალაქი / რეგიონი",
    radius: "რადიუსი",
    mapPick: "რუკაზე არჩევა",
    allWorld: "მთელი მსოფლიო",
  },
};

const searchCenters = [
  { key: "batumi", label: "Batumi, Georgia", city: "Batumi", country: "Georgia", lat: 41.6168, lng: 41.6367 },
  { key: "tbilisi", label: "Tbilisi, Georgia", city: "Tbilisi", country: "Georgia", lat: 41.7151, lng: 44.8271 },
  { key: "istanbul", label: "İstanbul, Türkiye", city: "İstanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784 },
  { key: "izmir", label: "İzmir, Türkiye", city: "İzmir", country: "Türkiye", lat: 38.4237, lng: 27.1428 },
  { key: "antalya", label: "Antalya, Türkiye", city: "Antalya", country: "Türkiye", lat: 36.8969, lng: 30.7133 },
  { key: "stpetersburg", label: "St. Petersburg, Russia", city: "St. Petersburg", country: "Russia", lat: 59.9311, lng: 30.3609 },
] as const;

type SearchCenterKey = (typeof searchCenters)[number]["key"];

const productCoordinates: Record<string, { lat: number; lng: number }> = {
  Batumi: { lat: 41.6168, lng: 41.6367 },
  İstanbul: { lat: 41.0082, lng: 28.9784 },
  Tbilisi: { lat: 41.7151, lng: 44.8271 },
};

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

const products: Product[] = [
  { slug: "obdtr-obd-platformu", name: { tr: "OBDTR OBD Platformu", en: "OBDTR OBD Platformu", de: "OBDTR OBD Platformu", ru: "OBDTR OBD Platformu", ka: "OBDTR OBD Platformu" }, category: { tr: "OBD cihazları vitrini", en: "OBD cihazları vitrini", de: "OBD cihazları vitrini", ru: "OBD cihazları vitrini", ka: "OBD cihazları vitrini" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", price: { tr: "Bilgi / teklif alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "OBDTR gerçek görsel", en: "OBDTR gerçek görsel", de: "OBDTR gerçek görsel", ru: "OBDTR gerçek görsel", ka: "OBDTR gerçek görsel" }, sku: "OBDTR-PLATFORM" },
  { slug: "autel-diagnostics-grubu", name: { tr: "Autel Diagnostics Ürün Grubu", en: "Autel Diagnostics Ürün Grubu", de: "Autel Diagnostics Ürün Grubu", ru: "Autel Diagnostics Ürün Grubu", ka: "Autel Diagnostics Ürün Grubu" }, category: { tr: "Profesyonel diagnostik", en: "Profesyonel diagnostik", de: "Profesyonel diagnostik", ru: "Profesyonel diagnostik", ka: "Profesyonel diagnostik" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/autel-logo-y7s1WToBRtNK6JFO.png", price: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "OBDTR public kategori", en: "OBDTR public kategori", de: "OBDTR public kategori", ru: "OBDTR public kategori", ka: "OBDTR public kategori" }, sku: "OBDTR-AUTEL-GRUP" },
  { slug: "launch-diagnostic-grubu", name: { tr: "Launch Diagnostic Ürün Grubu", en: "Launch Diagnostic Ürün Grubu", de: "Launch Diagnostic Ürün Grubu", ru: "Launch Diagnostic Ürün Grubu", ka: "Launch Diagnostic Ürün Grubu" }, category: { tr: "OBD tarayıcı ve servis", en: "OBD tarayıcı ve servis", de: "OBD tarayıcı ve servis", ru: "OBD tarayıcı ve servis", ka: "OBD tarayıcı ve servis" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/launch-logo-QyUWRWFwUubpqEtK.png", price: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "OBDTR public kategori", en: "OBDTR public kategori", de: "OBDTR public kategori", ru: "OBDTR public kategori", ka: "OBDTR public kategori" }, sku: "OBDTR-LAUNCH-GRUP" },
  { slug: "thinktool-professional-grubu", name: { tr: "Thinktool Professional Ürün Grubu", en: "Thinktool Professional Ürün Grubu", de: "Thinktool Professional Ürün Grubu", ru: "Thinktool Professional Ürün Grubu", ka: "Thinktool Professional Ürün Grubu" }, category: { tr: "Diagnostik sistemler", en: "Diagnostik sistemler", de: "Diagnostik sistemler", ru: "Diagnostik sistemler", ka: "Diagnostik sistemler" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/thinktool-logo-CJSQAeVES6sh4t4N.png", price: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "OBDTR public kategori", en: "OBDTR public kategori", de: "OBDTR public kategori", ru: "OBDTR public kategori", ka: "OBDTR public kategori" }, sku: "OBDTR-THINKTOOL-GRUP" },
  { slug: "zenith-diagnostic-systems", name: { tr: "Zenith Diagnostic Systems", en: "Zenith Diagnostic Systems", de: "Zenith Diagnostic Systems", ru: "Zenith Diagnostic Systems", ka: "Zenith Diagnostic Systems" }, category: { tr: "Diagnostik sistemler", en: "Diagnostik sistemler", de: "Diagnostik sistemler", ru: "Diagnostik sistemler", ka: "Diagnostik sistemler" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/zena--th-logo-C6Su7QKqVp3QS5wa.png", price: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "OBDTR public kategori", en: "OBDTR public kategori", de: "OBDTR public kategori", ru: "OBDTR public kategori", ka: "OBDTR public kategori" }, sku: "OBDTR-ZENITH-GRUP" },
  { slug: "arac-gruplari-uyumluluk", name: { tr: "Araç Grupları Uyumluluk Bilgisi", en: "Araç Grupları Uyumluluk Bilgisi", de: "Araç Grupları Uyumluluk Bilgisi", ru: "Araç Grupları Uyumluluk Bilgisi", ka: "Araç Grupları Uyumluluk Bilgisi" }, category: { tr: "Tüm markalar uyumluluk", en: "Tüm markalar uyumluluk", de: "Tüm markalar uyumluluk", ru: "Tüm markalar uyumluluk", ka: "Tüm markalar uyumluluk" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/araba-grubu-DeqjKhTL6VzLa1Dm.png", price: { tr: "Bilgi alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "OBDTR public kategori", en: "OBDTR public kategori", de: "OBDTR public kategori", ru: "OBDTR public kategori", ka: "OBDTR public kategori" }, sku: "OBDTR-ARAC-GRUPLARI" },
  { slug: "obd-uzatma-kablosu", name: { tr: "OBD Uzatma Kablosu", en: "OBD Uzatma Kablosu", de: "OBD Uzatma Kablosu", ru: "OBD Uzatma Kablosu", ka: "OBD Uzatma Kablosu" }, category: { tr: "Diagnostik aksesuar", en: "Diagnostik aksesuar", de: "Diagnostik aksesuar", ru: "Diagnostik aksesuar", ka: "Diagnostik aksesuar" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "/product-images/diagnostic-scanner.svg", price: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Katalog ürünü", en: "Katalog ürünü", de: "Katalog ürünü", ru: "Katalog ürünü", ka: "Katalog ürünü" }, sku: "OBDTR-ACC-OBD-CABLE" },
  { slug: "vci-arayuz-modulu", name: { tr: "VCI Arayüz Modülü", en: "VCI Arayüz Modülü", de: "VCI Arayüz Modülü", ru: "VCI Arayüz Modülü", ka: "VCI Arayüz Modülü" }, category: { tr: "Diagnostik aksesuar", en: "Diagnostik aksesuar", de: "Diagnostik aksesuar", ru: "Diagnostik aksesuar", ka: "Diagnostik aksesuar" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "/product-images/diagnostic-tablet.svg", price: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Katalog ürünü", en: "Katalog ürünü", de: "Katalog ürünü", ru: "Katalog ürünü", ka: "Katalog ürünü" }, sku: "OBDTR-ACC-VCI" },
  { slug: "aku-batarya-test-cihazi", name: { tr: "Akü / Batarya Test Cihazı", en: "Akü / Batarya Test Cihazı", de: "Akü / Batarya Test Cihazı", ru: "Akü / Batarya Test Cihazı", ka: "Akü / Batarya Test Cihazı" }, category: { tr: "Servis ekipmanı", en: "Servis ekipmanı", de: "Servis ekipmanı", ru: "Servis ekipmanı", ka: "Servis ekipmanı" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "/product-images/diagnostic-scanner.svg", price: { tr: "Tedarik edilebilir", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Katalog ürünü", en: "Katalog ürünü", de: "Katalog ürünü", ru: "Katalog ürünü", ka: "Katalog ürünü" }, sku: "OBDTR-BATTERY-TESTER" },
  { slug: "diagnostik-yazilim-destegi", name: { tr: "Diagnostik Yazılım ve Güncelleme Desteği", en: "Diagnostik Yazılım ve Güncelleme Desteği", de: "Diagnostik Yazılım ve Güncelleme Desteği", ru: "Diagnostik Yazılım ve Güncelleme Desteği", ka: "Diagnostik Yazılım ve Güncelleme Desteği" }, category: { tr: "Servis desteği", en: "Servis desteği", de: "Servis desteği", ru: "Servis desteği", ka: "Servis desteği" }, store: "OBDTR", storeSlug: "obdtr", city: "İstanbul", country: "Türkiye", image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png", price: { tr: "Hizmet bilgisi alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Hizmet", en: "Hizmet", de: "Hizmet", ru: "Hizmet", ka: "Hizmet" }, sku: "OBDTR-SOFTWARE-SUPPORT" },
  { slug: "krom-mutfak-bataryasi", name: { tr: "Krom Mutfak Bataryası", en: "Krom Mutfak Bataryası", de: "Krom Mutfak Bataryası", ru: "Krom Mutfak Bataryası", ka: "Krom Mutfak Bataryası" }, category: { tr: "Tesisat", en: "Tesisat", de: "Tesisat", ru: "Tesisat", ka: "Tesisat" }, store: "Yıldız Hırdavat", storeSlug: "yildiz-hirdavat", city: "Batumi", country: "Georgia", image: "/product-images/tap-set.svg", price: { tr: "Mağazadan fiyat alın", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Stokta", en: "Stokta", de: "Stokta", ru: "Stokta", ka: "Stokta" }, sku: "YH-TESISAT-BATARYA-001" },
  { slug: "pvc-boru-baglanti-seti", name: { tr: "PVC Boru Bağlantı Seti", en: "PVC Boru Bağlantı Seti", de: "PVC Boru Bağlantı Seti", ru: "PVC Boru Bağlantı Seti", ka: "PVC Boru Bağlantı Seti" }, category: { tr: "Boru / Bağlantı", en: "Boru / Bağlantı", de: "Boru / Bağlantı", ru: "Boru / Bağlantı", ka: "Boru / Bağlantı" }, store: "Yıldız Hırdavat", storeSlug: "yildiz-hirdavat", city: "Batumi", country: "Georgia", image: "/product-images/pipe-fittings.svg", price: { tr: "Stoktan teslim", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "500 çeşit depo", en: "500 çeşit depo", de: "500 çeşit depo", ru: "500 çeşit depo", ka: "500 çeşit depo" }, sku: "YH-PVC-FITTING-SET-002" },
  { slug: "ford-escape-fren-balatasi", name: { tr: "Ford Escape Fren Balatası", en: "Ford Escape Fren Balatası", de: "Ford Escape Fren Balatası", ru: "Ford Escape Fren Balatası", ka: "Ford Escape Fren Balatası" }, category: { tr: "Fren Sistemi", en: "Fren Sistemi", de: "Fren Sistemi", ru: "Fren Sistemi", ka: "Fren Sistemi" }, store: "Ferro Motors", storeSlug: "ferro-motors", city: "Batumi", country: "Georgia", image: "/product-images/brake-pad.svg", price: { tr: "Teklif gerekli", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Oto yedek", en: "Oto yedek", de: "Oto yedek", ru: "Oto yedek", ka: "Oto yedek" }, sku: "FR-BALATA-ESCAPE-001" },
  { slug: "toyota-corolla-yag-filtresi", name: { tr: "Toyota Corolla Yağ Filtresi", en: "Toyota Corolla Yağ Filtresi", de: "Toyota Corolla Yağ Filtresi", ru: "Toyota Corolla Yağ Filtresi", ka: "Toyota Corolla Yağ Filtresi" }, category: { tr: "Filtre", en: "Filtre", de: "Filtre", ru: "Filtre", ka: "Filtre" }, store: "Ferro Motors", storeSlug: "ferro-motors", city: "Batumi", country: "Georgia", image: "/product-images/oil-filter.svg", price: { tr: "22 GEL", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Stokta", en: "Stokta", de: "Stokta", ru: "Stokta", ka: "Stokta" }, sku: "FR-FILTRE-COROLLA-002" },
  { slug: "universal-buji-seti", name: { tr: "Universal Buji Seti", en: "Universal Buji Seti", de: "Universal Buji Seti", ru: "Universal Buji Seti", ka: "Universal Buji Seti" }, category: { tr: "Ateşleme", en: "Ateşleme", de: "Ateşleme", ru: "Ateşleme", ka: "Ateşleme" }, store: "Ferro Motors", storeSlug: "ferro-motors", city: "Batumi", country: "Georgia", image: "/product-images/spark-plugs.svg", price: { tr: "Teklif isteyin", en: "Request quote", de: "Anfrage", ru: "Request quote", ka: "Request quote" }, tag: { tr: "Sınırlı stok", en: "Sınırlı stok", de: "Sınırlı stok", ru: "Sınırlı stok", ka: "Sınırlı stok" }, sku: "FR-BUJI-SET-004" }
];

const stores: Store[] = [
  { slug: "obdtr", name: "OBDTR", city: "İstanbul", category: { tr: "Oto diagnostik", en: "Auto diagnostics", de: "Auto-Diagnose" }, productCount: 10, image: "https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D512%2Cfit%3Dcrop/UQiqWaZEFBvz3IaI/ana-sayfa-son-1pEM1pE6JGsoxwuu.png" },
  { slug: "yildiz-hirdavat", name: "Yıldız Hırdavat", city: "Batumi", category: { tr: "Hırdavat ve tesisat", en: "Hardware and plumbing", de: "Werkzeug und Sanitär" }, productCount: 2, image: "/product-images/tap-set.svg" },
  { slug: "ferro-motors", name: "Ferro Motors", city: "Batumi", category: { tr: "Oto yedek parça", en: "Auto spare parts", de: "Autoersatzteile" }, productCount: 3, image: "/product-images/brake-pad.svg" },
];

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "tr" || value === "en" || value === "ru" || value === "ka" || value === "de";
}

function l(value: Localized, language: LanguageCode) {
  return value[language] ?? value.en ?? value.tr;
}

export default function HomePage() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [searchCenter, setSearchCenter] = useState<SearchCenterKey>("batumi");
  const [radiusKm, setRadiusKm] = useState(50);
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(saved) ? saved : "tr");

    const savedProducts = window.localStorage.getItem("hbs-store-products");
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts) as Array<{
          id: string;
          name: string;
          category: string;
          salePrice: string;
          currency: string;
          sku: string;
          imageUrl?: string;
          visibility?: string;
        }>;

        const mappedProducts: Product[] = parsedProducts
          .filter((item) => item.visibility !== "hidden")
          .map((item) => ({
            slug: item.id,
            name: { tr: item.name },
            category: { tr: item.category },
            store: "OBDTR",
            storeSlug: "obdtr",
            city: "İstanbul",
            country: "Türkiye",
            image: item.imageUrl || "/product-images/diagnostic-scanner.svg",
            price: { tr: item.salePrice ? `${item.salePrice} ${item.currency || "GEL"}` : "Teklif isteyin" },
            tag: { tr: "Mağaza ürünü" },
            sku: item.sku || item.id,
          }));

        setUploadedProducts(mappedProducts);
      } catch {
        setUploadedProducts([]);
      }
    }
  }, []);

  const allProducts = useMemo(() => [...uploadedProducts, ...products], [uploadedProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const center = searchCenters.find((item) => item.key === searchCenter) ?? searchCenters[0];
    return allProducts.filter((item) => {
      const categoryOk =
        category === "all" ||
        ["service", "rental", "realestate", "tour"].includes(category) ||
        (category === "auto" && item.storeSlug !== "yildiz-hirdavat") ||
        (category === "hardware" && item.storeSlug === "yildiz-hirdavat") ||
        (category === "spare" && item.storeSlug === "ferro-motors");
      const haystack = [l(item.name, language ?? "tr"), l(item.category, language ?? "tr"), item.store, item.city, item.country, item.sku]
        .join(" ")
        .toLowerCase();
      const coords = productCoordinates[item.city] ?? productCoordinates[center.city];
      const distanceOk = radiusKm >= 10000 || distanceKm(center, coords) <= radiusKm;
      return categoryOk && distanceOk && (!q || haystack.includes(q));
    });
  }, [query, category, language, allProducts, searchCenter, radiusKm]);

  if (!language) return <main className="min-h-screen bg-white" />;

  const activeUiLanguage = (language in ui ? language : "en") as keyof typeof ui;
  const t = ui[activeUiLanguage];
  const selectedCenter = searchCenters.find((item) => item.key === searchCenter) ?? searchCenters[0];
  const radiusLabel = radiusKm >= 10000 ? t.allWorld : `${radiusKm} km`;
  const searchHref = query.trim() ? `/customer?q=${encodeURIComponent(query.trim())}` : "/customer";
  const countLabel = language === "tr" ? "kayıt" : language === "de" ? "Eintrag" : language === "ru" ? "позиция" : language === "ka" ? "ჩანაწერი" : "items";
  const openingOffer = language === "tr" ? "Açılışa özel ücretsiz mağaza kaydınızı şimdi yaptırın" : language === "de" ? "Zur Eröffnung: Jetzt kostenlos Ihren Shop registrieren" : language === "ru" ? "К открытию: зарегистрируйте магазин бесплатно" : language === "ka" ? "გახსნის შეთავაზება: დაარეგისტრირეთ მაღაზია უფასოდ" : "Opening offer: register your store for free now";
  const label = (tr: string, en: string, de = en, ru = en, ka = en) =>
    language === "tr" ? tr : language === "de" ? de : language === "ru" ? ru : language === "ka" ? ka : en;

  const quickCategories = [
    { key: "all", label: t.all },
    { key: "auto", label: t.auto },
    { key: "hardware", label: t.hardware },
    { key: "spare", label: t.spare },
    { key: "service", label: label("Hizmet", "Service", "Service", "Услуги", "სერვისი") },
    { key: "rental", label: label("Kiralık", "Rental", "Miete", "Аренда", "ქირა") },
    { key: "realestate", label: label("Emlak", "Real Estate", "Immobilien", "Недвижимость", "უძრავი") },
    { key: "tour", label: label("Tur", "Tours", "Touren", "Туры", "ტურები") },
  ];

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:px-4">
          <Link href="/" className="shrink-0 text-base font-black tracking-tight text-blue-700 sm:text-xl">HBS</Link>
          <div className="flex items-center gap-1.5">
            <CompactLanguageSwitcher />
            <Link href="/login" className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-800 hover:bg-slate-50 sm:inline-flex">{t.login}</Link>
            <Link href="/register" className="hidden rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black text-white hover:bg-blue-700 sm:inline-flex">{t.register}</Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-2 pb-1.5 sm:px-4">
          <form className="flex w-full items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 shadow-inner" onSubmit={(e) => e.preventDefault()}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="min-w-0 flex-1 bg-transparent px-1 text-[12px] font-semibold outline-none placeholder:text-slate-400 sm:text-sm"
            />
            <Link href={searchHref} className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black text-white sm:px-4 sm:text-xs">{t.searchButton}</Link>
          </form>
        </div>

        <div className="mx-auto max-w-7xl px-2 pb-1.5 sm:px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <div className="mb-1 flex items-center justify-between gap-2 px-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <span>📍 {t.region}</span>
              <span className="text-blue-700">{selectedCenter.label} · {radiusLabel}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-1 sm:grid-cols-[1.3fr_1fr_auto]">
              <select
                value={searchCenter}
                onChange={(event) => setSearchCenter(event.target.value as SearchCenterKey)}
                className="h-8 min-w-0 rounded-full border border-slate-200 bg-slate-50 px-2 text-[11px] font-black text-slate-800 outline-none focus:border-blue-500"
                aria-label={t.regionPlaceholder}
              >
                {searchCenters.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
              <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 sm:flex">
                <span className="text-[10px] font-black text-slate-500">{t.radius}</span>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={Math.min(radiusKm, 200)}
                  onChange={(event) => setRadiusKm(Number(event.target.value))}
                  className="w-24 accent-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setRadiusKm(radiusKm >= 10000 ? 50 : 10000)}
                  className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-blue-700"
                >
                  {radiusLabel}
                </button>
              </div>
              <button
                type="button"
                className="h-8 rounded-full border border-blue-100 bg-blue-50 px-2 text-[10px] font-black text-blue-700"
                title={t.mapPick}
              >
                🗺️ {t.mapPick}
              </button>
            </div>
            <div className="mt-1 flex items-center gap-1 sm:hidden">
              {[10, 25, 50, 100].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRadiusKm(value)}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${radiusKm === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  {value} km
                </button>
              ))}
              <button
                type="button"
                onClick={() => setRadiusKm(10000)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${radiusKm >= 10000 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {t.allWorld}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-1 px-2 pb-1.5 sm:hidden">
          <button className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-black shadow-sm">📷 {t.photo}</button>
          <button className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-black shadow-sm">QR</button>
          <button className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-black shadow-sm">▥ {t.barcode}</button>
        </div>

        <div className="mx-auto max-w-7xl px-2 pb-1.5 sm:hidden">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-8 w-full rounded-full border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-label={t.categories}
          >
            {quickCategories.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="mx-auto hidden max-w-7xl gap-1 overflow-x-auto px-2 pb-1.5 sm:flex sm:px-4">
          {quickCategories.map((item) => (
            <button
              key={item.key}
              onClick={() => setCategory(item.key)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black sm:text-xs ${category === item.key ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-2 py-2 sm:px-4 sm:py-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">HBS Marketplace</p>
              <h1 className="truncate text-sm font-black sm:text-lg">{t.featured}</h1>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-700">{filtered.length} {countLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((item) => (
              <article key={item.slug} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <Link href={`/product/${item.slug}`} className="block bg-white p-1.5">
                  <div className="aspect-[1/1] overflow-hidden rounded-lg bg-slate-50">
                    <img src={item.image} alt={l(item.name, language)} className="h-full w-full object-contain p-1.5" />
                  </div>
                </Link>
                <div className="px-2 pb-2">
                  <Link href={`/product/${item.slug}`} className="line-clamp-2 min-h-[2rem] text-[12px] font-black leading-4 hover:text-blue-700 sm:text-[13px]">
                    {l(item.name, language)}
                  </Link>
                  <p className="mt-0.5 truncate text-[10px] font-bold text-slate-500">{l(item.category, language)}</p>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span className="truncate text-[11px] font-black text-blue-700">{l(item.price, language)}</span>
                    <Link href={`/product/${item.slug}`} className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-black hover:bg-slate-50">{t.view}</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-blue-100 bg-white/95 py-1.5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-hbs-marquee text-[12px] font-black text-blue-700">
            {openingOffer} • {openingOffer} • {openingOffer} • {openingOffer} •
          </div>
        </div>
      </div>

    </main>
  );
}
