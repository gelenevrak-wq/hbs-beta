export type HbsLanguageCode =
  | "tr"
  | "en"
  | "ru"
  | "ka"
  | "de"
  | "zh"
  | "ar"
  | "fr"
  | "es"
  | "it"
  | "pt"
  | "fa";

export type SupportedLanguage = {
  code: HbsLanguageCode;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
};

export const supportedLanguages: SupportedLanguage[] = [
  { code: "tr", name: "Turkish", nativeName: "Türkçe", direction: "ltr" },
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", direction: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", direction: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", direction: "ltr" },
  { code: "fa", name: "Persian", nativeName: "فارسی", direction: "rtl" },
];

export function isHbsLanguageCode(value: string | null): value is HbsLanguageCode {
  return supportedLanguages.some((language) => language.code === value);
}

export function getLanguageDirection(language: HbsLanguageCode) {
  return (
    supportedLanguages.find((item) => item.code === language)?.direction ??
    "ltr"
  );
}

export function normalizeBrowserLanguage(
  value: string | undefined | null
): HbsLanguageCode {
  if (!value) return "en";

  const lowerValue = value.toLowerCase();

  if (lowerValue.startsWith("tr")) return "tr";
  if (lowerValue.startsWith("en")) return "en";
  if (lowerValue.startsWith("ru")) return "ru";
  if (lowerValue.startsWith("ka")) return "ka";
  if (lowerValue.startsWith("de")) return "de";
  if (lowerValue.startsWith("zh")) return "zh";
  if (lowerValue.startsWith("ar")) return "ar";
  if (lowerValue.startsWith("fr")) return "fr";
  if (lowerValue.startsWith("es")) return "es";
  if (lowerValue.startsWith("it")) return "it";
  if (lowerValue.startsWith("pt")) return "pt";
  if (lowerValue.startsWith("fa")) return "fa";

  return "en";
}

export function getInitialLanguage(): HbsLanguageCode {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLanguage = window.localStorage.getItem("hbs-language");

  if (isHbsLanguageCode(savedLanguage)) {
    return savedLanguage;
  }

  return normalizeBrowserLanguage(window.navigator.language);
}

const trTranslations = {
  common: {
    home: "Ana Sayfa",
    dashboard: "Panel",
    customerPortal: "Müşteri Portalı",
    customerRegister: "Müşteri Kaydı",
    storePanel: "Mağaza Paneli",
    storefront: "Mağaza Vitrini",
    productDetail: "Ürün Detayı",
    addToCart: "Sepete Ekle",
    requestOffer: "Teklif / Sipariş Talebi Bırak",
    askStore: "Mağazaya Soru Sor",
    askProduct: "Ürün Hakkında Sor",
    search: "Arama",
    country: "Ülke",
    city: "Şehir",
    price: "Fiyat",
    store: "Mağaza",
    brand: "Marka",
    model: "Model",
    barcode: "Barkod",
    sku: "SKU",
    oem: "OEM",
    manufacturerCode: "Üretici Kodu",
    stockStatus: "Stok Durumu",
    location: "Konum",
    save: "Kaydet",
    cancel: "İptal",
    back: "Geri Dön",
    notFound: "Bulunamadı",
    demoNotice:
      "Bu ekran şimdilik demo verilerle çalışır. Gerçek sistemde bilgiler veritabanından gelecektir.",
    seoNotice:
      "Bu sayfa SEO dostu URL, ürün kodları, mağaza bilgisi ve structured data mantığıyla Google indekslemeye uygun hazırlanacaktır.",
  },
  product: {
    eyebrow: "HBS Ürün Detay Sayfası",
    codesTitle: "Ürün Kodları",
    storeDeliveryTitle: "Mağaza ve Teslimat Bilgisi",
    similarProducts: "Benzer Ürünler",
    productNotFound: "Ürün bulunamadı",
    productNotFoundText:
      "Bu ürün demo veriler içinde bulunamadı. Gerçek sistemde ürün bilgisi veritabanından gelecek ve SEO uyumlu ürün sayfası otomatik oluşacaktır.",
    goToCustomerPortal: "Müşteri Portalına Dön",
    goToStorePage: "Mağaza Sayfasına Git",
    salesMethod:
      "Ürün mağaza vitrini üzerinden sepete eklenebilir, teklif/sipariş talebi bırakılabilir veya mağazaya soru sorulabilir.",
    realSystemNote:
      "Gerçek sistemde teslimat, ödeme, kargo, mağaza onayı, müşteri yetkileri ve cari hesap bilgileri mağaza ayarlarına göre çalışır.",
    addedToCart: "sepete demo olarak eklendi.",
    questionDemo:
      "hakkında mağaza yetkilisine soru sorma ekranı demo olarak açılacak.",
    offerDemo: "için teklif/sipariş talebi demo olarak oluşturuldu.",
    noSimilarProducts: "Benzer ürün bulunamadı.",
    googleVisibility: "Google bulunabilirlik",
  },
  store: {
    eyebrow: "HBS Mağaza Vitrini",
    contactInfo: "Mağaza iletişim bilgileri",
    storeProducts: "Mağaza Ürünleri",
    productSearch: "Ürün ara",
    cartRequestList: "Sepet / Talep Listesi",
    emptyCart: "Sepette ürün yok.",
    cartItemsAdded: "ürün sepete eklendi.",
    sendCartRequest: "Sepet İçin Teklif / Sipariş Talebi Gönder",
    storefrontPrivacy:
      "Bu ekran müşterinin gördüğü mağaza vitrinidir. İç depo yönetimi, alış fiyatı, kar oranı, tedarikçi bilgisi ve personel işlemleri burada gösterilmez.",
    storeSeoNotice:
      "Bu mağaza vitrini SEO dostu mağaza URL’si ve Store structured data mantığıyla Google indekslemeye uygun hazırlanacaktır.",
    productShowcase: "Ürün Vitrini",
    productsListed: "ürün listeleniyor",
    productNotFoundInStore: "Bu mağazada aramanıza uygun ürün bulunamadı.",
    storeNotFound: "Mağaza bulunamadı",
    storeNotFoundText:
      "Bu mağaza demo veriler içinde bulunamadı. Gerçek sistemde mağaza bilgileri veritabanından gelecek ve mağaza vitrini otomatik oluşacaktır.",
  },
};

type TranslationBundle = typeof trTranslations;

export const translations: Partial<Record<HbsLanguageCode, TranslationBundle>> = {
  tr: trTranslations,

  en: {
    common: {
      home: "Home",
      dashboard: "Dashboard",
      customerPortal: "Customer Portal",
      customerRegister: "Customer Registration",
      storePanel: "Store Panel",
      storefront: "Storefront",
      productDetail: "Product Detail",
      addToCart: "Add to Cart",
      requestOffer: "Request Quote / Order",
      askStore: "Ask Store",
      askProduct: "Ask About Product",
      search: "Search",
      country: "Country",
      city: "City",
      price: "Price",
      store: "Store",
      brand: "Brand",
      model: "Model",
      barcode: "Barcode",
      sku: "SKU",
      oem: "OEM",
      manufacturerCode: "Manufacturer Code",
      stockStatus: "Stock Status",
      location: "Location",
      save: "Save",
      cancel: "Cancel",
      back: "Back",
      notFound: "Not Found",
      demoNotice:
        "This screen currently uses demo data. In the real system, information will come from the database.",
      seoNotice:
        "This page will be prepared for Google indexing with SEO-friendly URLs, product codes, store information and structured data.",
    },
    product: {
      eyebrow: "HBS Product Detail Page",
      codesTitle: "Product Codes",
      storeDeliveryTitle: "Store and Delivery Information",
      similarProducts: "Similar Products",
      productNotFound: "Product not found",
      productNotFoundText:
        "This product was not found in demo data. In the real system, product information will come from the database and an SEO-friendly product page will be created automatically.",
      goToCustomerPortal: "Return to Customer Portal",
      goToStorePage: "Go to Store Page",
      salesMethod:
        "The product can be added to cart, requested as a quote/order, or discussed with the store through the storefront.",
      realSystemNote:
        "In the real system, delivery, payment, shipping, store approval, customer permissions and current account details will work according to store settings.",
      addedToCart: "was added to the cart in demo mode.",
      questionDemo:
        "question screen will be opened in demo mode for the store representative.",
      offerDemo: "quote/order request was created in demo mode.",
      noSimilarProducts: "No similar products found.",
      googleVisibility: "Google visibility",
    },
    store: {
      eyebrow: "HBS Storefront",
      contactInfo: "Store contact information",
      storeProducts: "Store Products",
      productSearch: "Search product",
      cartRequestList: "Cart / Request List",
      emptyCart: "Cart is empty.",
      cartItemsAdded: "items added to cart.",
      sendCartRequest: "Send Quote / Order Request for Cart",
      storefrontPrivacy:
        "This is the customer-facing storefront. Internal warehouse management, purchase price, profit margin, supplier data and staff operations are not shown here.",
      storeSeoNotice:
        "This storefront will be prepared for Google indexing with SEO-friendly store URLs and Store structured data.",
      productShowcase: "Product Showcase",
      productsListed: "products listed",
      productNotFoundInStore: "No matching product was found in this store.",
      storeNotFound: "Store not found",
      storeNotFoundText:
        "This store was not found in demo data. In the real system, store information will come from the database and the storefront will be created automatically.",
    },
  },

  ru: {
    common: {
      home: "Главная",
      dashboard: "Панель",
      customerPortal: "Портал клиента",
      customerRegister: "Регистрация клиента",
      storePanel: "Панель магазина",
      storefront: "Витрина магазина",
      productDetail: "Детали товара",
      addToCart: "Добавить в корзину",
      requestOffer: "Запросить предложение / заказ",
      askStore: "Спросить магазин",
      askProduct: "Спросить о товаре",
      search: "Поиск",
      country: "Страна",
      city: "Город",
      price: "Цена",
      store: "Магазин",
      brand: "Бренд",
      model: "Модель",
      barcode: "Штрихкод",
      sku: "SKU",
      oem: "OEM",
      manufacturerCode: "Код производителя",
      stockStatus: "Наличие",
      location: "Местоположение",
      save: "Сохранить",
      cancel: "Отмена",
      back: "Назад",
      notFound: "Не найдено",
      demoNotice:
        "Этот экран сейчас работает с демо-данными. В реальной системе информация будет поступать из базы данных.",
      seoNotice:
        "Эта страница будет подготовлена для индексации Google с SEO URL, кодами товаров, данными магазина и structured data.",
    },
    product: {
      eyebrow: "Страница товара HBS",
      codesTitle: "Коды товара",
      storeDeliveryTitle: "Информация о магазине и доставке",
      similarProducts: "Похожие товары",
      productNotFound: "Товар не найден",
      productNotFoundText:
        "Этот товар не найден в демо-данных. В реальной системе информация будет поступать из базы данных, и SEO-страница будет создана автоматически.",
      goToCustomerPortal: "Вернуться в портал клиента",
      goToStorePage: "Перейти на страницу магазина",
      salesMethod:
        "Товар можно добавить в корзину, запросить предложение/заказ или задать вопрос магазину.",
      realSystemNote:
        "В реальной системе доставка, оплата, отгрузка, подтверждение магазина, права клиента и расчётный счёт работают по настройкам магазина.",
      addedToCart: "добавлен в корзину в демо-режиме.",
      questionDemo:
        "экран вопроса представителю магазина будет открыт в демо-режиме.",
      offerDemo: "запрос предложения/заказа создан в демо-режиме.",
      noSimilarProducts: "Похожие товары не найдены.",
      googleVisibility: "Видимость в Google",
    },
    store: {
      eyebrow: "Витрина магазина HBS",
      contactInfo: "Контакты магазина",
      storeProducts: "Товары магазина",
      productSearch: "Поиск товара",
      cartRequestList: "Корзина / список запроса",
      emptyCart: "Корзина пуста.",
      cartItemsAdded: "товаров добавлено в корзину.",
      sendCartRequest: "Отправить запрос предложения / заказа",
      storefrontPrivacy:
        "Это витрина, которую видит клиент. Внутренний склад, закупочные цены, маржа, поставщики и действия персонала здесь не показываются.",
      storeSeoNotice:
        "Эта витрина будет подготовлена для индексации Google с SEO URL магазина и Store structured data.",
      productShowcase: "Витрина товаров",
      productsListed: "товаров показано",
      productNotFoundInStore: "В этом магазине не найден подходящий товар.",
      storeNotFound: "Магазин не найден",
      storeNotFoundText:
        "Этот магазин не найден в демо-данных. В реальной системе информация магазина будет поступать из базы данных.",
    },
  },

  ka: {
    common: {
      home: "მთავარი",
      dashboard: "პანელი",
      customerPortal: "კლიენტის პორტალი",
      customerRegister: "კლიენტის რეგისტრაცია",
      storePanel: "მაღაზიის პანელი",
      storefront: "მაღაზიის ვიტრინა",
      productDetail: "პროდუქტის დეტალი",
      addToCart: "კალათაში დამატება",
      requestOffer: "შეთავაზების / შეკვეთის მოთხოვნა",
      askStore: "ჰკითხე მაღაზიას",
      askProduct: "პროდუქტზე კითხვა",
      search: "ძებნა",
      country: "ქვეყანა",
      city: "ქალაქი",
      price: "ფასი",
      store: "მაღაზია",
      brand: "ბრენდი",
      model: "მოდელი",
      barcode: "ბარკოდი",
      sku: "SKU",
      oem: "OEM",
      manufacturerCode: "მწარმოებლის კოდი",
      stockStatus: "მარაგის სტატუსი",
      location: "მდებარეობა",
      save: "შენახვა",
      cancel: "გაუქმება",
      back: "უკან",
      notFound: "ვერ მოიძებნა",
      demoNotice:
        "ეს ეკრანი ამჟამად დემო მონაცემებით მუშაობს. რეალურ სისტემაში ინფორმაცია ბაზიდან მოვა.",
      seoNotice:
        "ეს გვერდი Google ინდექსაციისთვის მომზადდება SEO URL-ებით, პროდუქტის კოდებით, მაღაზიის ინფორმაციით და structured data-თი.",
    },
    product: {
      eyebrow: "HBS პროდუქტის დეტალური გვერდი",
      codesTitle: "პროდუქტის კოდები",
      storeDeliveryTitle: "მაღაზიისა და მიწოდების ინფორმაცია",
      similarProducts: "მსგავსი პროდუქტები",
      productNotFound: "პროდუქტი ვერ მოიძებნა",
      productNotFoundText:
        "ეს პროდუქტი დემო მონაცემებში ვერ მოიძებნა. რეალურ სისტემაში ინფორმაცია ბაზიდან მოვა და SEO გვერდი ავტომატურად შეიქმნება.",
      goToCustomerPortal: "კლიენტის პორტალში დაბრუნება",
      goToStorePage: "მაღაზიის გვერდზე გადასვლა",
      salesMethod:
        "პროდუქტი შეიძლება დაემატოს კალათაში, მოთხოვნილი იყოს შეთავაზება/შეკვეთა ან დაისვას კითხვა მაღაზიასთან.",
      realSystemNote:
        "რეალურ სისტემაში მიწოდება, გადახდა, გაგზავნა, მაღაზიის დადასტურება, კლიენტის უფლებები და მიმდინარე ანგარიში მაღაზიის პარამეტრებით იმუშავებს.",
      addedToCart: "დემო რეჟიმში კალათაში დაემატა.",
      questionDemo:
        "მაღაზიის წარმომადგენელთან კითხვის ეკრანი დემო რეჟიმში გაიხსნება.",
      offerDemo: "შეთავაზების/შეკვეთის მოთხოვნა დემო რეჟიმში შეიქმნა.",
      noSimilarProducts: "მსგავსი პროდუქტები ვერ მოიძებნა.",
      googleVisibility: "Google-ში ხილვადობა",
    },
    store: {
      eyebrow: "HBS მაღაზიის ვიტრინა",
      contactInfo: "მაღაზიის საკონტაქტო ინფორმაცია",
      storeProducts: "მაღაზიის პროდუქტები",
      productSearch: "პროდუქტის ძებნა",
      cartRequestList: "კალათა / მოთხოვნის სია",
      emptyCart: "კალათა ცარიელია.",
      cartItemsAdded: "პროდუქტი დაემატა კალათაში.",
      sendCartRequest: "კალათის შეთავაზების / შეკვეთის მოთხოვნის გაგზავნა",
      storefrontPrivacy:
        "ეს არის კლიენტისთვის ხილული ვიტრინა. შიდა საწყობი, შესყიდვის ფასი, მოგების მარჟა, მომწოდებლები და პერსონალის ოპერაციები აქ არ ჩანს.",
      storeSeoNotice:
        "ეს ვიტრინა Google ინდექსაციისთვის მომზადდება SEO URL-ით და Store structured data-თი.",
      productShowcase: "პროდუქტის ვიტრინა",
      productsListed: "პროდუქტი ნაჩვენებია",
      productNotFoundInStore: "ამ მაღაზიაში შესაბამისი პროდუქტი ვერ მოიძებნა.",
      storeNotFound: "მაღაზია ვერ მოიძებნა",
      storeNotFoundText:
        "ეს მაღაზია დემო მონაცემებში ვერ მოიძებნა. რეალურ სისტემაში მაღაზიის ინფორმაცია ბაზიდან მოვა.",
    },
  },

  de: {
    common: {
      home: "Startseite",
      dashboard: "Panel",
      customerPortal: "Kundenportal",
      customerRegister: "Kundenregistrierung",
      storePanel: "Shop-Panel",
      storefront: "Shop-Schaufenster",
      productDetail: "Produktdetails",
      addToCart: "In den Warenkorb",
      requestOffer: "Angebot / Bestellung anfragen",
      askStore: "Shop fragen",
      askProduct: "Zum Produkt fragen",
      search: "Suche",
      country: "Land",
      city: "Stadt",
      price: "Preis",
      store: "Shop",
      brand: "Marke",
      model: "Modell",
      barcode: "Barcode",
      sku: "SKU",
      oem: "OEM",
      manufacturerCode: "Herstellercode",
      stockStatus: "Bestand",
      location: "Standort",
      save: "Speichern",
      cancel: "Abbrechen",
      back: "Zurück",
      notFound: "Nicht gefunden",
      demoNotice:
        "Dieser Bildschirm nutzt derzeit Demodaten. Im echten System kommen die Informationen aus der Datenbank.",
      seoNotice:
        "Diese Seite wird mit SEO-URLs, Produktcodes, Shopdaten und structured data für Google vorbereitet.",
    },
    product: {
      eyebrow: "HBS Produktdetailseite",
      codesTitle: "Produktcodes",
      storeDeliveryTitle: "Shop- und Lieferinformationen",
      similarProducts: "Ähnliche Produkte",
      productNotFound: "Produkt nicht gefunden",
      productNotFoundText:
        "Dieses Produkt wurde in den Demodaten nicht gefunden. Im echten System kommen Produktdaten aus der Datenbank und eine SEO-Seite wird automatisch erstellt.",
      goToCustomerPortal: "Zurück zum Kundenportal",
      goToStorePage: "Zur Shop-Seite",
      salesMethod:
        "Das Produkt kann in den Warenkorb gelegt, als Angebot/Bestellung angefragt oder beim Shop nachgefragt werden.",
      realSystemNote:
        "Im echten System funktionieren Lieferung, Zahlung, Versand, Shopfreigabe, Kundenrechte und Kontoinformationen nach den Shop-Einstellungen.",
      addedToCart: "wurde im Demo-Modus in den Warenkorb gelegt.",
      questionDemo:
        "Fragebildschirm für den Shop-Mitarbeiter wird im Demo-Modus geöffnet.",
      offerDemo: "Angebots-/Bestellanfrage wurde im Demo-Modus erstellt.",
      noSimilarProducts: "Keine ähnlichen Produkte gefunden.",
      googleVisibility: "Google-Sichtbarkeit",
    },
    store: {
      eyebrow: "HBS Shop-Schaufenster",
      contactInfo: "Shop-Kontaktinformationen",
      storeProducts: "Shop-Produkte",
      productSearch: "Produkt suchen",
      cartRequestList: "Warenkorb / Anfrageliste",
      emptyCart: "Der Warenkorb ist leer.",
      cartItemsAdded: "Produkte im Warenkorb.",
      sendCartRequest: "Angebot / Bestellung für Warenkorb senden",
      storefrontPrivacy:
        "Dies ist das Kundenschaufenster. Interne Lagerverwaltung, Einkaufspreise, Marge, Lieferanten und Personalvorgänge werden hier nicht angezeigt.",
      storeSeoNotice:
        "Dieses Schaufenster wird mit SEO-Shop-URL und Store structured data für Google vorbereitet.",
      productShowcase: "Produkt-Schaufenster",
      productsListed: "Produkte gelistet",
      productNotFoundInStore: "Kein passendes Produkt in diesem Shop gefunden.",
      storeNotFound: "Shop nicht gefunden",
      storeNotFoundText:
        "Dieser Shop wurde in den Demodaten nicht gefunden. Im echten System kommen Shopdaten aus der Datenbank.",
    },
  },

  zh: {
    common: {
      home: "首页",
      dashboard: "控制面板",
      customerPortal: "客户门户",
      customerRegister: "客户注册",
      storePanel: "商店面板",
      storefront: "商店页面",
      productDetail: "产品详情",
      addToCart: "加入购物车",
      requestOffer: "请求报价 / 下单",
      askStore: "询问商店",
      askProduct: "询问产品",
      search: "搜索",
      country: "国家",
      city: "城市",
      price: "价格",
      store: "商店",
      brand: "品牌",
      model: "型号",
      barcode: "条形码",
      sku: "SKU",
      oem: "OEM",
      manufacturerCode: "制造商代码",
      stockStatus: "库存状态",
      location: "位置",
      save: "保存",
      cancel: "取消",
      back: "返回",
      notFound: "未找到",
      demoNotice: "此页面当前使用演示数据。真实系统中信息将来自数据库。",
      seoNotice:
        "此页面将使用 SEO 友好的 URL、产品代码、商店信息和结构化数据，以便 Google 索引。",
    },
    product: {
      eyebrow: "HBS 产品详情页",
      codesTitle: "产品代码",
      storeDeliveryTitle: "商店与配送信息",
      similarProducts: "类似产品",
      productNotFound: "未找到产品",
      productNotFoundText:
        "演示数据中找不到此产品。真实系统中产品信息将来自数据库，并自动生成 SEO 产品页面。",
      goToCustomerPortal: "返回客户门户",
      goToStorePage: "前往商店页面",
      salesMethod: "产品可加入购物车，可请求报价/订单，也可向商店提问。",
      realSystemNote:
        "真实系统中，配送、付款、物流、商店确认、客户权限和账务信息将根据商店设置运行。",
      addedToCart: "已在演示模式下加入购物车。",
      questionDemo: "商店咨询页面将在演示模式下打开。",
      offerDemo: "报价/订单请求已在演示模式下创建。",
      noSimilarProducts: "未找到类似产品。",
      googleVisibility: "Google 可见性",
    },
    store: {
      eyebrow: "HBS 商店页面",
      contactInfo: "商店联系方式",
      storeProducts: "商店产品",
      productSearch: "搜索产品",
      cartRequestList: "购物车 / 请求列表",
      emptyCart: "购物车为空。",
      cartItemsAdded: "件产品已加入购物车。",
      sendCartRequest: "发送购物车报价 / 订单请求",
      storefrontPrivacy:
        "这是客户看到的商店页面。内部仓库管理、采购价、利润率、供应商信息和员工操作不会显示。",
      storeSeoNotice:
        "此商店页面将使用 SEO 友好 URL 和 Store structured data 以便 Google 索引。",
      productShowcase: "产品展示",
      productsListed: "件产品已列出",
      productNotFoundInStore: "此商店中未找到匹配产品。",
      storeNotFound: "未找到商店",
      storeNotFoundText:
        "演示数据中找不到此商店。真实系统中商店信息将来自数据库。",
    },
  },

  ar: {
    common: {
      home: "الصفحة الرئيسية",
      dashboard: "لوحة التحكم",
      customerPortal: "بوابة العميل",
      customerRegister: "تسجيل العميل",
      storePanel: "لوحة المتجر",
      storefront: "واجهة المتجر",
      productDetail: "تفاصيل المنتج",
      addToCart: "أضف إلى السلة",
      requestOffer: "طلب عرض / طلب شراء",
      askStore: "اسأل المتجر",
      askProduct: "اسأل عن المنتج",
      search: "بحث",
      country: "الدولة",
      city: "المدينة",
      price: "السعر",
      store: "المتجر",
      brand: "العلامة التجارية",
      model: "الموديل",
      barcode: "الباركود",
      sku: "SKU",
      oem: "OEM",
      manufacturerCode: "رمز الشركة المصنعة",
      stockStatus: "حالة المخزون",
      location: "الموقع",
      save: "حفظ",
      cancel: "إلغاء",
      back: "رجوع",
      notFound: "غير موجود",
      demoNotice:
        "تعمل هذه الشاشة حالياً ببيانات تجريبية. في النظام الحقيقي ستأتي المعلومات من قاعدة البيانات.",
      seoNotice:
        "سيتم تجهيز هذه الصفحة للفهرسة في Google باستخدام روابط صديقة لمحركات البحث، وأكواد المنتجات، ومعلومات المتجر، والبيانات المنظمة.",
    },
    product: {
      eyebrow: "صفحة تفاصيل المنتج في HBS",
      codesTitle: "أكواد المنتج",
      storeDeliveryTitle: "معلومات المتجر والتسليم",
      similarProducts: "منتجات مشابهة",
      productNotFound: "المنتج غير موجود",
      productNotFoundText:
        "لم يتم العثور على هذا المنتج في البيانات التجريبية. في النظام الحقيقي ستأتي معلومات المنتج من قاعدة البيانات وسيتم إنشاء صفحة SEO تلقائياً.",
      goToCustomerPortal: "العودة إلى بوابة العميل",
      goToStorePage: "الذهاب إلى صفحة المتجر",
      salesMethod:
        "يمكن إضافة المنتج إلى السلة أو طلب عرض/طلب شراء أو سؤال المتجر عنه.",
      realSystemNote:
        "في النظام الحقيقي، يعمل التسليم والدفع والشحن وموافقة المتجر وصلاحيات العميل والحساب الجاري وفق إعدادات المتجر.",
      addedToCart: "تمت إضافته إلى السلة في الوضع التجريبي.",
      questionDemo: "سيتم فتح شاشة سؤال المتجر في الوضع التجريبي.",
      offerDemo: "تم إنشاء طلب عرض/شراء في الوضع التجريبي.",
      noSimilarProducts: "لم يتم العثور على منتجات مشابهة.",
      googleVisibility: "الظهور في Google",
    },
    store: {
      eyebrow: "واجهة متجر HBS",
      contactInfo: "معلومات الاتصال بالمتجر",
      storeProducts: "منتجات المتجر",
      productSearch: "بحث عن منتج",
      cartRequestList: "السلة / قائمة الطلبات",
      emptyCart: "السلة فارغة.",
      cartItemsAdded: "منتجات مضافة إلى السلة.",
      sendCartRequest: "إرسال طلب عرض / شراء للسلة",
      storefrontPrivacy:
        "هذه هي واجهة المتجر التي يراها العميل. لا تظهر هنا إدارة المستودع الداخلية أو سعر الشراء أو هامش الربح أو الموردون أو عمليات الموظفين.",
      storeSeoNotice:
        "سيتم تجهيز واجهة المتجر هذه للفهرسة في Google باستخدام رابط متجر صديق لمحركات البحث وبيانات Store structured data.",
      productShowcase: "عرض المنتجات",
      productsListed: "منتجات معروضة",
      productNotFoundInStore: "لم يتم العثور على منتج مطابق في هذا المتجر.",
      storeNotFound: "المتجر غير موجود",
      storeNotFoundText:
        "لم يتم العثور على هذا المتجر في البيانات التجريبية. في النظام الحقيقي ستأتي معلومات المتجر من قاعدة البيانات.",
    },
  },
};

export function getTranslations(language: HbsLanguageCode): TranslationBundle {
  return translations[language] ?? translations.en ?? trTranslations;
}