"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import CompactLanguageSwitcher from "@/components/language/CompactLanguageSwitcher";
import { useHbsLanguage } from "@/lib/i18n/useHbsLanguage";
import { HbsLanguageCode } from "@/lib/i18n/translations";
import { translateProductField } from "@/lib/i18n/dynamicContent";

type Bid = {
  id: string;
  tenderId: string;
  storeName: string;
  storeSlug: string;
  amount: string;
  duration: string;
  message: string;
  date: string;
};

type Tender = {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  city: string;
  country: string;
  ownerName: string;
  ownerEmail: string;
  date: string;
};

const initialTenders: Tender[] = [
  {
    id: "tender-1",
    title: "30 Katlı Plaza Dış Cephe Sıva İhalesi",
    category: "İnşaat / Hizmet",
    description: "Batumi merkezdeki 30 katlı rezidans projemizin dış cephe kaba sıva ve dekoratif sıva işleri için tüm iskele ve malzemeler dahil olacak şekilde ihale açılmıştır. Yalnızca profesyonel ekiplerin kapalı zarf tekliflerini bekliyoruz.",
    budget: "45,000 GEL",
    city: "Batumi",
    country: "Gürcistan",
    ownerName: "Altan Cancı (Gökdelen Proje A.Ş.)",
    ownerEmail: "altan@gokdelen.ge",
    date: "26.05.2026 14:15"
  },
  {
    id: "tender-2",
    title: "Özel İngilizce & Almanca Dil Eğitimi Hizmeti",
    category: "Eğitim / Hizmet",
    description: "Şirket içi çalışanlarımızın teknik İngilizce ve temel Almanca dil becerilerini geliştirmek amacıyla, haftada 3 gün ofisimizde yüz yüze eğitim verebilecek kurum veya bireysel eğitmenlerden teklif alacağız.",
    budget: "Anlaşmaya Bağlı",
    city: "İstanbul",
    country: "Türkiye",
    ownerName: "Deniz Yıldız (İK Müdürü)",
    ownerEmail: "deniz@ikgrup.com",
    date: "25.05.2026 11:20"
  },
  {
    id: "tender-3",
    title: "Katalog Fotoğraf Çekimi & Reklam Filmi",
    category: "Fotoğrafçılık / Hizmet",
    description: "Yeni sezon araç diagnostik ve oto yedek parça kataloglarımız için stüdyo ortamında ürün fotoğraf çekimi ve 60 saniyelik sosyal medya tanıtım filmi montaj hizmeti alınacaktır.",
    budget: "3,500 GEL",
    city: "Tbilisi",
    country: "Gürcistan",
    ownerName: "Giorgi Auto Service",
    ownerEmail: "giorgi@auto.ge",
    date: "24.05.2026 09:40"
  }
];

const initialBids: Bid[] = [
  {
    id: "bid-1",
    tenderId: "tender-1",
    storeName: "Yıldız Batum Vitrini",
    storeSlug: "yildiz-hirdavat",
    amount: "42,000 GEL",
    duration: "25 Gün",
    message: "Tüm iskele ekipmanları, dış cephe koruyucu fileler ve çimento/kum dahil olacak şekilde Batum şubemizdeki uzman kadromuzla projeyi teslim etmeye hazırız.",
    date: "26.05.2026 15:30"
  }
];

const pageTranslations: Record<string, Record<string, string>> = {
  tr: {
    home: "Ana Sayfa",
    portal: "Müşteri Portalı",
    heroBadge: "📢 HBS B2B Açık İlan & İhale Panosu",
    heroTitle: "Aradığınız Ürünü veya Hizmeti Bulamadınız mı?",
    heroDesc: "B2B ihale ve ilan panomuzda kural tanımaz özgürlük! İster 30 katlı plaza sıvası yaptırmak isteyin, ister özel dil eğitimi, fotoğraf çekimi veya nadir bir diagnostik soketi arayın... İlanınızı hemen bırakın, kayıtlı HBS mağazaları kapalı-zarf usulüyle size özel gizli tekliflerini sunsun. Teklifleri yalnızca siz görebilirsiniz.",
    activeTitle: "Aktif Açık İlanlar & İhaleler",
    activeSub: "Kayıtlı mağazalar tarafından kapalı-zarf usulüyle iletilen teklifleri yalnızca siz yetkili e-postanızla giriş yaptığınızda görebilirsiniz.",
    postTitle: "Hemen İlan / İhale Açın",
    postSub: "İhtiyacınız olan her türlü ürün veya hizmet için anında ilan verin.",
    labelTitle: "İlan Başlığı *",
    labelTitlePlaceholder: "Örn: NGK Buji Seti Toplu Alım İhalesi",
    labelCategory: "Sektör / Kategori *",
    labelBudget: "Bütçe / Karşılık",
    labelBudgetPlaceholder: "Örn: 5,000 GEL",
    labelCity: "Şehir *",
    labelCityPlaceholder: "Örn: Batumi, İzmir",
    labelDesc: "İlan Detayı & Özel Talepleriniz *",
    labelDescPlaceholder: "İhtiyacınızı detaylandırın. Örneğin sıva kalınlığı, malzeme kalitesi, özel ders süreleri vb...",
    labelContactInfo: "İletişim ve Güvenlik Bilgileri",
    labelName: "Adınız Soyadınız *",
    labelNamePlaceholder: "Örn: Altan Cancı",
    labelEmail: "Yetki E-postanız *",
    labelEmailSub: "* Yetki e-postanız önemlidir. Bu sayfada teklifleri görüntülemek için bu e-posta adresiyle HBS müşteri portalı hesabınız açık olmalıdır. Diğer ziyaretçilerden teklif tutarlarınız tamamen gizlenir.",
    btnPublish: "🚀 Açık İlanı & İhaleyi Canlıya Al",
    btnBid: "Teklif Ver (Gizli Kapalı-Zarf)",
    bidAmount: "Fiyat Teklif Tutarı *",
    bidAmountPlaceholder: "Örn: 42,000 GEL",
    bidDuration: "Teslim Süresi / Gün",
    bidDurationPlaceholder: "Örn: 20 Gün",
    bidMsg: "Teklif Açıklaması & Detaylar *",
    bidMsgPlaceholder: "Sunacağınız hizmetin detayları, malzeme kalitesi veya garanti süresi...",
    btnSendBid: "Kapalı Teklifi Güvenli Gönder",
    owner: "İlan Sahibi",
    budget: "Bütçe",
    location: "Konum",
    statusReceived: "Teklifler Alındı",
    offersCount: "Teklif",
    errorRequired: "Lütfen gerekli tüm alanları doldurun.",
    successPublish: "İlanınız başarıyla yayınlandı! Mağazalar kapalı-zarf tekliflerini ilettikçe bu sayfada görebileceksiniz.",
    successBid: "İhale katılım teklifiniz gizli olarak başarıyla iletildi!",
    loginToBid: "Teklif vermek için mağaza sahibi olarak giriş yapmalısınız.",
    confidentialOffers: "🔒 GİZLİ TEKLİFLER (Sadece İlan Sahibi Görebilir)",
    offerFrom: "Teklif Veren Mağaza",
    offerValue: "Teklif Tutarı",
    offerDuration: "Teslim Süresi",
    offerMsg: "Mağaza Mesajı",
    noOffersYet: "Bu ilana henüz teklif iletilmemiş. Mağazanız adına ilk kapalı teklifi sunarak pazarlığı başlatabilirsiniz!",
    storeOnlyBid: "Yalnızca kayıtlı HBS mağazaları bu ilana teklif sunabilir."
  },
  en: {
    home: "Home",
    portal: "Customer Portal",
    heroBadge: "📢 HBS B2B Open Bulletin & Tenders Board",
    heroTitle: "Didn't Find the Product or Service You Are Looking For?",
    heroDesc: "Unrestricted freedom in our B2B tenders and requests board! Whether you want to award a plastering contract for a 30-story plaza, request private language tutoring, catalog photography, or find a rare diagnostic connector... Leave your request here, and registered HBS stores will submit custom sealed bids. Bids are completely private and visible only to you.",
    activeTitle: "Active Open Requests & Tenders",
    activeSub: "Sealed bids submitted by registered stores are completely confidential and visible only when you log in with your authorized email.",
    postTitle: "Post a Request / Tender Now",
    postSub: "Submit a request instantly for any product or service you need.",
    labelTitle: "Request Title *",
    labelTitlePlaceholder: "e.g., NGK Spark Plug Set Bulk Procurement",
    labelCategory: "Sector / Category *",
    labelBudget: "Budget / Value",
    labelBudgetPlaceholder: "e.g., 5,000 GEL",
    labelCity: "City *",
    labelCityPlaceholder: "e.g., Batumi, Izmir",
    labelDesc: "Request Details & Custom Requirements *",
    labelDescPlaceholder: "Detail your needs. E.g., plaster thickness, material quality, lesson hours, etc.",
    labelContactInfo: "Contact and Security Details",
    labelName: "Full Name *",
    labelNamePlaceholder: "e.g., John Doe",
    labelEmail: "Authorized Email *",
    labelEmailSub: "* Your authorized email is critical. To view bids on this page, you must be logged into your HBS customer account with this email address. Bids are completely hidden from other visitors.",
    btnPublish: "🚀 Publish Request & Go Live",
    btnBid: "Submit Offer (Confidential Sealed-Bid)",
    bidAmount: "Price Offer Amount *",
    bidAmountPlaceholder: "e.g., 42,000 GEL",
    bidDuration: "Delivery Time / Days",
    bidDurationPlaceholder: "e.g., 20 Days",
    bidMsg: "Offer Description & Details *",
    bidMsgPlaceholder: "Details of your service, material quality, or warranty period...",
    btnSendBid: "Send Sealed Bid Securely",
    owner: "Owner",
    budget: "Budget",
    location: "Location",
    statusReceived: "Bids Received",
    offersCount: "Bids",
    errorRequired: "Please fill in all required fields.",
    successPublish: "Your request has been successfully published! As stores submit sealed bids, you will be able to see them here.",
    successBid: "Your bid has been successfully submitted confidentially!",
    loginToBid: "You must be logged in as a store owner to submit an offer.",
    confidentialOffers: "🔒 CONFIDENTIAL BIDS (Visible only to Request Owner)",
    offerFrom: "Bidding Store",
    offerValue: "Offer Value",
    offerDuration: "Delivery Duration",
    offerMsg: "Store Message",
    noOffersYet: "No offers have been submitted for this request yet. Be the first to place a confidential bid on behalf of your store!",
    storeOnlyBid: "Only registered HBS stores can submit bids to this request."
  },
  de: {
    home: "Startseite",
    portal: "Kundenportal",
    heroBadge: "📢 HBS B2B Ausschreibungen & Marktplatz",
    heroTitle: "Nicht das passende Produkt oder Dienstleistung gefunden?",
    heroDesc: "Grenzenlose Freiheit auf unserem B2B-Ausschreibungs- und Anfragen-Board! Ob Sie eine Verputzarbeit für ein 30-stöckiges Gebäude vergeben möchten, privaten Sprachunterricht, Produktfotografie oder einen seltenen Diagnosestecker suchen... Erstellen Sie Ihre Anfrage, und registrierte HBS-Shops werden vertrauliche Angebote abgeben. Die Angebote sind vollkommen privat und nur für Sie sichtbar.",
    activeTitle: "Aktive Ausschreibungen & Anfragen",
    activeSub: "Vertrauliche Angebote, die von registrierten Shops eingereicht werden, sind streng geheim und nur sichtbar, wenn Sie sich mit Ihrer autorisierten E-Mail-Adresse anmelden.",
    postTitle: "Jetzt Ausschreibung erstellen",
    postSub: "Geben Sie sofort eine Anfrage für ein beliebiges Produkt oder eine Dienstleistung auf.",
    labelTitle: "Titel der Anfrage *",
    labelTitlePlaceholder: "z.B., NGK Zündkerzen-Set Großabnahme",
    labelCategory: "Bereich / Kategorie *",
    labelBudget: "Budget / Wert",
    labelBudgetPlaceholder: "z.B., 5.000 GEL",
    labelCity: "Stadt *",
    labelCityPlaceholder: "z.B., Berlin, Hamburg",
    labelDesc: "Details & Spezifische Anforderungen *",
    labelDescPlaceholder: "Beschreiben Sie Ihren Bedarf im Detail. Z. B. Putzstärke, Materialqualität, Unterrichtsstunden, etc.",
    labelContactInfo: "Kontakt- und Sicherheitsdetails",
    labelName: "Vor- und Nachname *",
    labelNamePlaceholder: "z.B., Max Mustermann",
    labelEmail: "Autorisierte E-Mail-Adresse *",
    labelEmailSub: "* Ihre autorisierte E-Mail-Adresse ist entscheidend. Um Angebote auf dieser Seite zu sehen, müssen Sie mit dieser E-Mail-Adresse in Ihrem HBS-Kundenkonto angemeldet sein. Angebote sind für andere Besucher unsichtbar.",
    btnPublish: "🚀 Ausschreibung veröffentlichen",
    btnBid: "Angebot abgeben (Vertraulich & versiegelt)",
    bidAmount: "Angebotener Preis *",
    bidAmountPlaceholder: "z.B., 42.000 GEL",
    bidDuration: "Lieferzeit / Tage",
    bidDurationPlaceholder: "z.B., 20 Tage",
    bidMsg: "Angebotsbeschreibung & Details *",
    bidMsgPlaceholder: "Details zu Ihrem Service, zur Materialqualität oder Garantiezeit...",
    btnSendBid: "Versiegeltes Angebot sicher senden",
    owner: "Auftraggeber",
    budget: "Budget",
    location: "Standort",
    statusReceived: "Angebote eingegangen",
    offersCount: "Angebote",
    errorRequired: "Bitte füllen Sie alle erforderlichen Felder aus.",
    successPublish: "Ihre Ausschreibung wurde erfolgreich veröffentlicht! Sobald Shops versiegelte Angebote abgeben, können Sie diese hier einsehen.",
    successBid: "Ihr Angebot wurde erfolgreich und vertraulich übermittelt!",
    loginToBid: "Sie müssen als Shop-Inhaber angemeldet sein, um ein Angebot abgeben zu können.",
    confidentialOffers: "🔒 VERTRAULICHE ANGEBOTE (Nur für den Auftraggeber sichtbar)",
    offerFrom: "Bietender Shop",
    offerValue: "Angebotssumme",
    offerDuration: "Lieferzeit",
    offerMsg: "Nachricht vom Shop",
    noOffersYet: "Für diese Ausschreibung wurden noch keine Angebote eingereicht. Machen Sie das erste vertrauliche Angebot im Namen Ihres Shops!",
    storeOnlyBid: "Nur registrierte HBS-Shops können Angebote für diese Ausschreibung abgeben."
  },
  ru: {
    home: "Главная",
    portal: "Портал клиента",
    heroBadge: "📢 HBS B2B Открытая доска тендеров и объявлений",
    heroTitle: "Не нашли нужный товар или услугу?",
    heroDesc: "Полная свобода на нашей B2B доске тендеров и запросов! Хотите ли вы заказать штукатурку 30-этажного здания, найти репетитора по языкам, фотографа для каталога или редкий разъем для диагностики... Оставьте запрос здесь, и зарегистрированные магазины HBS отправят вам закрытые индивидуальные предложения. Предложения конфиденциальны и видны только вам.",
    activeTitle: "Активные открытые объявления и тендеры",
    activeSub: "Конфиденциальные предложения, отправленные магазинами, видны только владельцу объявления при авторизации через указанный email.",
    postTitle: "Разместить тендер / объявление",
    postSub: "Создайте запрос мгновенно для любого нужного товара или услуги.",
    labelTitle: "Название объявления *",
    labelTitlePlaceholder: "Например: Оптовая закупка комплектов свечей NGK",
    labelCategory: "Сектор / Категория *",
    labelBudget: "Бюджет",
    labelBudgetPlaceholder: "Например: 5,000 GEL",
    labelCity: "Город *",
    labelCityPlaceholder: "Например: Батуми, Москва",
    labelDesc: "Детали объявления и требования *",
    labelDescPlaceholder: "Опишите подробнее. Например, толщина штукатурки, качество материалов, часы обучения и т.д.",
    labelContactInfo: "Контактная информация и безопасность",
    labelName: "Имя и фамилия *",
    labelNamePlaceholder: "Например: Иван Иванов",
    labelEmail: "Авторизованный email *",
    labelEmailSub: "* Ваш авторизованный email крайне важен. Чтобы увидеть предложения, вы должны войти в аккаунт клиента HBS с этим email. Для других посетителей суммы предложений полностью скрыты.",
    btnPublish: "🚀 Опубликовать тендер",
    btnBid: "Сделать предложение (Конфиденциально)",
    bidAmount: "Сумма предложения *",
    bidAmountPlaceholder: "Например: 42,000 GEL",
    bidDuration: "Срок доставки / дней",
    bidDurationPlaceholder: "Например: 20 дней",
    bidMsg: "Описание предложения и детали *",
    bidMsgPlaceholder: "Детали вашей услуги, качество материалов или гарантийный срок...",
    btnSendBid: "Отправить конфиденциальное предложение",
    owner: "Заказчик",
    budget: "Бюджет",
    location: "Местоположение",
    statusReceived: "Предложения получены",
    offersCount: "Предл.",
    errorRequired: "Пожалуйста, заполните все обязательные поля.",
    successPublish: "Ваш тендер успешно опубликован! По мере поступления закрытых предложений от магазинов они будут отображаться здесь.",
    successBid: "Ваше предложение было успешно и конфиденциально отправлено!",
    loginToBid: "Вы должны войти в систему как владелец магазина, чтобы сделать предложение.",
    confidentialOffers: "🔒 КОНФИДЕНЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ (Видно только заказчику)",
    offerFrom: "Магазин",
    offerValue: "Сумма предложения",
    offerDuration: "Срок поставки",
    offerMsg: "Сообщение от магазина",
    noOffersYet: "Для этого запроса еще нет предложений. Будьте первыми, кто сделает конфиденциальное предложение от имени своего магазина!",
    storeOnlyBid: "Только зарегистрированные магазины HBS могут отправлять предложения по этому запросу."
  },
  ka: {
    home: "მთავარი",
    portal: "კლიენტის პორტალი",
    heroBadge: "📢 HBS B2B ღია განცხადებების & ტენდერების დაფა",
    heroTitle: "ვერ იპოვეთ თქვენთვის საქონელი ან მომსახურება?",
    heroDesc: "სრული თავისუფლება B2B მოთხოვნებისა და ტენდერების დაფაზე! გსურთ 30-სართულიანი შენობის გარე ფასადის შელესვა, კერძო გაკვეთილები, კატალოგის ფოტოგადაღება თუ იშვიათი სადიაგნოსტიკო კონექტორის პოვნა... დატოვეთ თქვენი მოთხოვნა აქ და დარეგისტრირებული HBS მაღაზიები გამოგიგზავნიან ფარულ შემოთავაზებებს. შემოთავაზებები კონფიდენციალურია და მხოლოდ თქვენთვისაა ხილული.",
    activeTitle: "აქტიური ღია განცხადებები & ტენდერები",
    activeSub: "მაღაზიების მიერ გამოგზავნილი ფარული შემოთავაზებები სრულიად კონფიდენციალურია და ხილულია მხოლოდ მაშინ, როდესაც შეხვალთ თქვენი ავტორიზებული ელფოსტით.",
    postTitle: "განათავსეთ განცხადება / ტენდერი ახლავე",
    postSub: "მყისიერად განათავსეთ მოთხოვნა ნებისმიერ საჭირო პროდუქტზე ან სერვისზე.",
    labelTitle: "განცხადების სათაური *",
    labelTitlePlaceholder: "მაგ: NGK სანთლების ნაკრების საბითუმო შესყიდვა",
    labelCategory: "სექტორი / კატეგორია *",
    labelBudget: "ბიუჯეტი",
    labelBudgetPlaceholder: "მაგ: 5,000 GEL",
    labelCity: "ქალაქი *",
    labelCityPlaceholder: "მაგ: ბათუმი, თბილისი",
    labelDesc: "დეტალები & მოთხოვნები *",
    labelDescPlaceholder: "დეტალურად აღწერეთ თქვენი მოთხოვნა. მაგ: ბათქაშის სისქე, მასალის ხარისხი, გაკვეთილის საათები და ა.შ.",
    labelContactInfo: "საკონტაქტო და უსაფრთხოების ინფორმაცია",
    labelName: "სახელი და გვარი *",
    labelNamePlaceholder: "მაგ: ალთან ჯანჯი",
    labelEmail: "ელფოსტა *",
    labelEmailSub: "* თქვენი ელფოსტა მნიშვნელოვანია. შემოთავაზებების სანახავად, ამ ელფოსტით უნდა იყოთ შესული HBS-ის კლიენტის ანგარიშზე. შემოთავაზებების თანხა სხვა ვიზიტორებისთვის სრულიად ფარულია.",
    btnPublish: "🚀 განცხადების გამოქვეყნება",
    btnBid: "შემოთავაზების წარდგენა (ფარული)",
    bidAmount: "შემოთავაზებული ფასი *",
    bidAmountPlaceholder: "მაგ: 42,000 GEL",
    bidDuration: "მიწოდების ვადა / დღე",
    bidDurationPlaceholder: "მაგ: 20 დღე",
    bidMsg: "შემოთავაზების აღწერა & დეტალები *",
    bidMsgPlaceholder: "თქვენი მომსახურების დეტალები, მასალის ხარისხი ან საგარანტიო პერიოდი...",
    btnSendBid: "შემოთავაზების უსაფრთხოდ გაგზავნა",
    owner: "განმცხადებელი",
    budget: "ბიუჯეტი",
    location: "მდებარეობა",
    statusReceived: "შემოთავაზებები მიღებულია",
    offersCount: "შემოთავ.",
    errorRequired: "გთხოვთ შეავსოთ ყველა სავალდებულო ველი.",
    successPublish: "თქვენი განცხადება წარმატებით გამოქვეყნდა! მაღაზიების მიერ გამოგზავნილ ფარულ შემოთავაზებებს აქ იხილავთ.",
    successBid: "თქვენი შემოთავაზება წარმატებით გაიგზავნა ფარულად!",
    loginToBid: "შემოთავაზების წარსადგენად უნდა შეხვიდეთ როგორც მაღაზიის მფლობელი.",
    confidentialOffers: "🔒 ფარული შემოთავაზებები (ხილულია მხოლოდ განმცხადებლისთვის)",
    offerFrom: "მაღაზია",
    offerValue: "შემოთავაზებული თანხა",
    offerDuration: "მიწოდების ვადა",
    offerMsg: "შეტყობინება მაღაზიიდან",
    noOffersYet: "ამ განცხადებაზე შემოთავაზებები ჯერ არ არის. წარადგინეთ პირველი ფარული შემოთავაზება თქვენი მაღაზიის სახელით!",
    storeOnlyBid: "ამ განცხადებაზე შემოთავაზების წარდგენა შეუძლიათ მხოლოდ რეგისტრირებულ HBS მაღაზიებს."
  }
};

const mockTranslations: Record<string, Record<string, string>> = {
  "30 Katlı Plaza Dış Cephe Sıva İhalesi": {
    tr: "30 Katlı Plaza Dış Cephe Sıva İhalesi",
    en: "30-Story Plaza Exterior Plastering Tender",
    de: "Ausschreibung für Außenputzarbeiten an 30-stöckigem Plaza",
    ru: "Тендер на наружную штукатурку 30-этажного плазы",
    ka: "30-სართულიანი პლაზას გარე ფასადის შელესვის ტენდერი"
  },
  "İnşaat / Hizmet": {
    tr: "İnşaat / Hizmet",
    en: "Construction / Service",
    de: "Bauwesen / Dienstleistung",
    ru: "Строительство / Услуги",
    ka: "მშენებლობა / სერვისი"
  },
  "Batumi merkezdeki 30 katlı rezidans projemizin dış cephe kaba sıva ve dekoratif sıva işleri için tüm iskele ve malzemeler dahil olacak şekilde ihale açılmıştır. Yalnızca profesyonel ekiplerin kapalı zarf tekliflerini bekliyoruz.": {
    tr: "Batumi merkezdeki 30 katlı rezidans projemizin dış cephe kaba sıva ve dekoratif sıva işleri için tüm iskele ve malzemeler dahil olacak şekilde ihale açılmıştır. Yalnızca profesyonel ekiplerin kapalı zarf tekliflerini bekliyoruz.",
    en: "A tender has been opened for the exterior rough plastering and decorative plastering works of our 30-story residence project in central Batumi, including all scaffolding and materials. We only expect sealed bids from professional teams.",
    de: "Für die Außenputz- und Dekorphasen unseres 30-stöckigen Wohnprojekts im Zentrum von Batumi wurde eine Ausschreibung eröffnet, einschließlich aller Gerüste und Materialien. Wir erwarten nur versiegelte Angebote von professionellen Teams.",
    ru: "Открыт тендер на черновые и декоративные наружные штукатурные работы для нашего проекта 30-этажной резиденции в центре Батуми, включая все леса и материалы. Мы ожидаем только закрытых предложений от профессиональных бригад.",
    ka: "ტენდერი გამოცხადდა ბათუმის ცენტრში ჩვენი 30-სართულიანი საცხოვრებელი პროექტის გარე უხეში და დეკორატიული შელესვის სამუშაოებზე, ყველა ხარაჩოსა და მასალის ჩათვლით. ველოდებით ფარულ შემოთავაზებებს მხოლოდ პროფესიონალური გუნდებისგან."
  },
  "Özel İngilizce & Almanca Dil Eğitimi Hizmeti": {
    tr: "Özel İngilizce & Almanca Dil Eğitimi Hizmeti",
    en: "Private English & German Language Training Service",
    de: "Privater Englisch- & Deutschunterricht",
    ru: "Частные уроки английского и немецкого языков",
    ka: "ინგლისური & გერმანული ენის კერძო გაკვეთილების სერვისი"
  },
  "Eğitim / Hizmet": {
    tr: "Eğitim / Hizmet",
    en: "Education / Service",
    de: "Bildung / Dienstleistung",
    ru: "Образование / Услуги",
    ka: "განათლება / სერვისი"
  },
  "Şirket içi çalışanlarımızın teknik İngilizce ve temel Almanca dil becerilerini geliştirmek amacıyla, haftada 3 gün ofisimizde yüz yüze eğitim verebilecek kurum veya bireysel eğitmenlerden teklif alacağız.": {
    tr: "Şirket içi çalışanlarımızın teknik İngilizce ve temel Almanca dil becerilerini geliştirmek amacıyla, haftada 3 gün ofisimizde yüz yüze eğitim verebilecek kurum veya bireysel eğitmenlerden teklif alacağız.",
    en: "To improve the technical English and basic German language skills of our in-house employees, we will receive offers from institutions or individual instructors who can provide face-to-face training in our office 3 days a week.",
    de: "Um die technischen Englisch- und Deutschkenntnisse unserer Mitarbeiter zu verbessern, suchen wir Angebote von Instituten oder Einzellehrern, die 3 Tage pro Woche Präsenzunterricht in unserem Büro erteilen können.",
    ru: "Для улучшения навыков технического английского и разговорного немецкого языков наших сотрудников мы принимаем предложения от учебных центров или индивидуальных преподавателей, готовых проводить очные занятия в нашем офисе 3 дня в неделю.",
    ka: "ჩვენი თანამშრომლების ტექნიკური ინგლისურისა და საბაზისო გერმანული ენის ცოდნის გასაუმჯობესებლად, მივიღებთ შემოთავაზებებს ორგანიზაციებისგან ან ინდივიდუალური მასწავლებლებისგან, რომლებიც შეძლებენ კვირაში 3 დღე ჩვენს ოფისში პირისპირ ტრენინგის ჩატარებას."
  },
  "Katalog Fotoğraf Çekimi & Reklam Filmi": {
    tr: "Katalog Fotoğraf Çekimi & Reklam Filmi",
    en: "Catalog Photography & Promotional Video",
    de: "Katalogfotografie & Werbevideo",
    ru: "Каталожная фотосъемка и промо-ролик",
    ka: "კატალოგის ფოტოგადაღება & სარეკლამო ვიდეო"
  },
  "Fotoğrafçılık / Hizmet": {
    tr: "Fotoğrafçılık / Hizmet",
    en: "Photography / Service",
    de: "Fotografie / Dienstleistung",
    ru: "Фотография / Услуги",
    ka: "ფოტოგრაფია / სერვისი"
  },
  "Yeni sezon araç diagnostik ve oto yedek parça kataloglarımız için stüdyo ortamında ürün fotoğraf çekimi ve 60 saniyelik sosyal medya tanıtım filmi montaj hizmeti alınacaktır.": {
    tr: "Yeni sezon araç diagnostik ve oto yedek parça kataloglarımız için stüdyo ortamında ürün fotoğraf çekimi ve 60 saniyelik sosyal medya tanıtım filmi montaj hizmeti alınacaktır.",
    en: "Studio product photography and 60-second social media promotional video editing service will be purchased for our new season vehicle diagnostic and auto spare parts catalogs.",
    de: "Für unsere Fahrzeugdiagnose- und Ersatzteilkataloge der neuen Saison suchen wir Studio-Produktfotografie und die Erstellung eines 60-sekündigen Social-Media-Promo-Videos.",
    ru: "Требуются услуги студийной фотосъемки товаров и монтажа 60-секундного рекламного ролика для соцсетей для наших новых каталогов автодиагностики и автозапчастей.",
    ka: "ახალი სეზონის ავტო დიაგნოსტიკისა და სათადარიგო ნაწილების კატალოგებისთვის საჭიროა სტუდიური ფოტოგადაღება და 60-წამიანი სარეკლამო ვიდეოს მონტაჟის სერვისი სოციალური ქსელებისთვის."
  },
  "Anlaşmaya Bağlı": {
    tr: "Anlaşmaya Bağlı",
    en: "Subject to Agreement",
    de: "Verhandlungssache",
    ru: "По договоренности",
    ka: "შეთანხმებით"
  },
  "Gürcistan": {
    tr: "Gürcistan",
    en: "Georgia",
    de: "Georgien",
    ru: "Грузия",
    ka: "საქართველო"
  },
  "Türkiye": {
    tr: "Türkiye",
    en: "Turkey",
    de: "Türkei",
    ru: "Турция",
    ka: "თურქეთი"
  },
  "Tesisatçı çağır": {
    tr: "Tesisatçı çağır",
    en: "Call a Plumber",
    de: "Klempner rufen",
    ru: "Вызвать сантехника",
    ka: "სანტექნიკოსის გამოძახება"
  },
  "İşlem tamamlanınca elden ödeme.": {
    tr: "İşlem tamamlanınca elden ödeme.",
    en: "Cash payment upon job completion.",
    de: "Barzahlung nach Fertigstellung.",
    ru: "Оплата наличными по завершении.",
    ka: "ნაღდი ანგარიშსწორება სამუშაოს დასრულებისას."
  },
  "Tesisatçı": {
    tr: "Tesisatçı",
    en: "Plumber",
    de: "Klempner",
    ru: "Сантехник",
    ka: "სანტექნიკოსი"
  },
  "Tüm iskele ekipmanları, dış cephe koruyucu fileler ve çimento/kum dahil olacak şekilde Batum şubemizdeki uzman kadromuzla projeyi teslim etmeye hazırız.": {
    tr: "Tüm iskele ekipmanları, dış cephe koruyucu fileler ve çimento/kum dahil olacak şekilde Batum şubemizdeki uzman kadromuzla projeyi teslim etmeye hazırız.",
    en: "We are ready to deliver the project with our expert team at our Batumi branch, including all scaffolding equipment, exterior protective nets, and cement/sand.",
    de: "Wir sind bereit, das Projekt mit unserem Expertenteam in unserer Filiale in Batumi zu übergeben, einschließlich aller Gerüste, Schutznetze und Zement/Sand.",
    ru: "Мы готовы сдать проект с нашей экспертной командой в филиале в Батуми, включая все леса, защитные сетки и цемент/песок.",
    ka: "ჩვენ მზად ვართ ჩავაბაროთ პროექტი ჩვენს ექსპერტთა გუნდთან ერთად ბათუმის ფილიალში, ყველა ხარაჩოს, დამცავი ბადეებისა და ცემენტის/ქვიშის ჩათვლით."
  },
  "Belirtilmedi": {
    tr: "Belirtilmedi",
    en: "Not Specified",
    de: "Nicht angegeben",
    ru: "Не указано",
    ka: "არ არის მითითებული"
  },
  "25 Gün": {
    tr: "25 Gün",
    en: "25 Days",
    de: "25 Tage",
    ru: "25 дней",
    ka: "25 დღე"
  }
};

export default function RequestsBoardPage() {
  const { t: commonT, language, isReady } = useHbsLanguage();
  
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  
  // Current user & Store owner states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [currentStore, setCurrentStore] = useState<any>(null);

  // Form States - Posting a new Tender
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("İnşaat / Hizmet");
  const [newDescription, setNewDescription] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("Türkiye");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");

  // Bidding form states
  const [activeTenderId, setActiveTenderId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDuration, setBidDuration] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const t = pageTranslations[language] || pageTranslations.tr;

  const l = (val: string): string => {
    if (!val) return "";
    const key = val.trim();
    if (mockTranslations[key] && mockTranslations[key][language]) {
      return mockTranslations[key][language];
    }
    return translateProductField(val, "name", language);
  };

  useEffect(() => {
    // Load currentUser
    const userStr = window.localStorage.getItem("hbs-current-user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        if (user.role === "owner" || user.role === "superadmin" || user.role === "storeOwner") {
          setIsStoreOwner(true);
          // Look up active store
          const localStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
          const store = localStores.find((st: any) => user.storeSlugs?.includes(st.code)) || {
            name: "OBDTR Diagnostics",
            code: "obdtr"
          };
          setCurrentStore(store);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Load Tenders
    const localTenders = window.localStorage.getItem("hbs-tender-requests");
    if (localTenders) {
      setTenders(JSON.parse(localTenders));
    } else {
      window.localStorage.setItem("hbs-tender-requests", JSON.stringify(initialTenders));
      setTenders(initialTenders);
    }

    // Load Bids
    const localBids = window.localStorage.getItem("hbs-tender-bids");
    if (localBids) {
      setBids(JSON.parse(localBids));
    } else {
      window.localStorage.setItem("hbs-tender-bids", JSON.stringify(initialBids));
      setBids(initialBids);
    }
  }, []);

  function handleCreateTender(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newTitle.trim() || !newDescription.trim() || !newOwnerEmail.trim() || !newOwnerName.trim() || !newCity.trim()) {
      setError(t.errorRequired);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const newTenderObj: Tender = {
      id: `tender-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      budget: newBudget.trim() || "Anlaşmaya Bağlı",
      city: newCity.trim() || "İstanbul",
      country: newCountry,
      ownerName: newOwnerName.trim(),
      ownerEmail: newOwnerEmail.trim().toLowerCase(),
      date: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", {hour: "2-digit", minute: "2-digit"})
    };

    const updatedTenders = [newTenderObj, ...tenders];
    window.localStorage.setItem("hbs-tender-requests", JSON.stringify(updatedTenders));
    setTenders(updatedTenders);

    // Clear form
    setNewTitle("");
    setNewDescription("");
    setNewBudget("");
    setNewCity("");
    setNewOwnerName("");
    setNewOwnerEmail("");

    setMessage(t.successPublish);
  }

  function handleSubmitBid(tenderId: string) {
    if (!bidAmount.trim() || !bidMessage.trim()) {
      alert(t.errorRequired);
      return;
    }

    const newBidObj: Bid = {
      id: `bid-${Date.now()}`,
      tenderId,
      storeName: currentStore?.name || "OBDTR Diagnostics",
      storeSlug: currentStore?.code || "obdtr",
      amount: bidAmount.trim(),
      duration: bidDuration.trim() || "Belirtilmedi",
      message: bidMessage.trim(),
      date: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", {hour: "2-digit", minute: "2-digit"})
    };

    const updatedBids = [newBidObj, ...bids];
    window.localStorage.setItem("hbs-tender-bids", JSON.stringify(updatedBids));
    setBids(updatedBids);

    // Reset bidding states
    setBidAmount("");
    setBidDuration("");
    setBidMessage("");
    setActiveTenderId(null);

    alert(t.successBid);
  }

  if (!isReady) return <main className="min-h-screen bg-[#f3f6fc]" />;

  return (
    <main className="min-h-screen bg-[#f3f6fc] text-slate-950 px-3 py-3 sm:px-6 sm:py-8 selection:bg-blue-600 selection:text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Link href="/" className="text-base font-black sm:text-xl text-blue-700">HBS Market</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">{t.home}</Link>
            <Link href="/customer" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm">{t.portal}</Link>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="mb-6 rounded-[2rem] border border-indigo-150 bg-gradient-to-r from-blue-500 via-indigo-600 to-indigo-700 p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-100 mb-3 animate-pulse">
            {t.heroBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-blue-100/90 max-w-4xl leading-relaxed font-semibold">
            {t.heroDesc}
          </p>
        </section>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-black text-emerald-850 shadow-sm animate-fadeIn">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-black text-red-850 shadow-sm animate-fadeIn">
            ⚠ {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
          {/* Active Tenders List */}
          <section className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm space-y-1">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">{t.activeTitle}</h2>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                {t.activeSub}
              </p>
            </div>

            <div className="space-y-4">
              {tenders.map((tender) => {
                const tenderBidsCount = bids.filter((b) => b.tenderId === tender.id).length;
                const isOwner = currentUser && currentUser.username === tender.ownerEmail;
                
                return (
                  <article key={tender.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 relative overflow-hidden transition hover:shadow-md">
                    <span className="absolute right-0 top-0 bg-blue-100 border-l border-b border-blue-200 text-blue-800 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                      {l(tender.category)}
                    </span>

                    <div className="space-y-1.5 pr-20">
                      <h3 className="text-lg font-black text-slate-900 leading-tight">
                        {l(tender.title)}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {t.owner}: {tender.ownerName} · {tender.date}
                      </p>
                    </div>

                    <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                      {l(tender.description)}
                    </p>

                    <div className="grid gap-3 grid-cols-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center font-bold text-slate-700 text-xs">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">{t.budget}</span>
                        <span className="mt-0.5 block text-slate-900 font-black">{l(tender.budget)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">{t.location}</span>
                        <span className="mt-0.5 block text-blue-700 font-black">📍 {l(tender.city)}, {l(tender.country)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">{t.offersCount}</span>
                        <span className="mt-0.5 block text-indigo-700 font-black">{tenderBidsCount} {t.offersCount}</span>
                      </div>
                    </div>

                    {/* Sealed Confidential Bids (Visible only to the Tender Owner) */}
                    {isOwner && (
                      <div className="rounded-2xl border border-indigo-150 bg-indigo-50/50 p-4 space-y-3">
                        <span className="text-xs font-black text-indigo-900 tracking-wider block">
                          {t.confidentialOffers}
                        </span>

                        {tenderBidsCount === 0 ? (
                          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                            {t.noOffersYet}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {bids
                              .filter((b) => b.tenderId === tender.id)
                              .map((b) => (
                                <div key={b.id} className="bg-white p-3 rounded-xl border border-indigo-100 text-xs space-y-2 shadow-sm animate-fadeIn">
                                  <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                                    <span className="font-black text-slate-900">🏢 {b.storeName}</span>
                                    <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      {t.offerValue}: {l(b.amount)}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-semibold text-slate-700">
                                    <b>{t.offerDuration}:</b> {l(b.duration)}
                                  </p>
                                  <p className="text-[11px] text-slate-500 leading-normal">
                                    <b>{t.offerMsg}:</b> {l(b.message)}
                                  </p>
                                  <span className="text-[9px] text-slate-400 block font-bold text-right">{b.date}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bidding trigger button for Store Owners */}
                    {isStoreOwner && !isOwner && activeTenderId !== tender.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTenderId(tender.id);
                          setBidAmount("");
                          setBidDuration("");
                          setBidMessage("");
                        }}
                        className="w-full py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-black shadow-sm hover:bg-indigo-100 transition active:scale-[0.99]"
                      >
                        💼 {t.btnBid}
                      </button>
                    )}

                    {/* Login notice for regular visitors who want to bid */}
                    {!isStoreOwner && (
                      <p className="text-[10px] text-slate-400 font-semibold italic text-center">
                        ℹ {t.storeOnlyBid}
                      </p>
                    )}

                    {/* Bidding inputs section */}
                    {activeTenderId === tender.id && (
                      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-900 tracking-wider">💼 {t.btnBid}</span>
                          <button
                            type="button"
                            onClick={() => setActiveTenderId(null)}
                            className="text-xs text-slate-450 hover:text-slate-750 font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-1">
                            <span className="text-[11px] font-black text-indigo-800">{t.bidAmount}</span>
                            <input
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder={t.bidAmountPlaceholder}
                              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-[11px] font-black text-indigo-800">{t.bidDuration}</span>
                            <input
                              value={bidDuration}
                              onChange={(e) => setBidDuration(e.target.value)}
                              placeholder={t.bidDurationPlaceholder}
                              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                            />
                          </label>
                        </div>

                        <label className="grid gap-1">
                          <span className="text-[11px] font-black text-indigo-800">{t.bidMsg}</span>
                          <textarea
                            value={bidMessage}
                            onChange={(e) => setBidMessage(e.target.value)}
                            placeholder={t.bidMsgPlaceholder}
                            rows={3}
                            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleSubmitBid(tender.id)}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-750 font-black text-white text-xs shadow-md transition active:scale-[0.99]"
                        >
                          Kapalı Teklifi Güvenli Gönder
                        </button>
                      </div>
                    )}

                  </article>
                );
              })}
            </div>
          </section>

          {/* Posting a new B2B Request/Tender Section */}
          <aside className="space-y-4">
            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider">{t.postTitle}</h3>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">{t.postSub}</p>
              </div>

              <form onSubmit={handleCreateTender} noValidate className="space-y-4">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.labelTitle}</span>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder={t.labelTitlePlaceholder}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.labelCategory}</span>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    <option value="İnşaat / Hizmet">{l("İnşaat / Hizmet")}</option>
                    <option value="Eğitim / Hizmet">{l("Eğitim / Hizmet")}</option>
                    <option value="Fotoğrafçılık / Hizmet">{l("Fotoğrafçılık / Hizmet")}</option>
                    <option value="Oto Yedek Parça">{l("Oto Yedek Parça")}</option>
                    <option value="Danışmanlık / Hizmet">{l("Danışmanlık / Hizmet")}</option>
                    <option value="Diğer Sektörler">{l("Diğer Sektörler")}</option>
                  </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-600">{t.labelBudget}</span>
                    <input
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      placeholder={t.labelBudgetPlaceholder}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs font-bold text-slate-600">{t.labelCity}</span>
                    <input
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      required
                      placeholder={t.labelCityPlaceholder}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </label>
                </div>

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-slate-600">{t.labelDesc}</span>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    placeholder={t.labelDescPlaceholder}
                    rows={4}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </label>

                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">{t.labelContactInfo}</span>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-bold text-slate-600">{t.labelName}</span>
                      <input
                        value={newOwnerName}
                        onChange={(e) => setNewOwnerName(e.target.value)}
                        required
                        placeholder={t.labelNamePlaceholder}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-bold text-slate-600">{t.labelEmail}</span>
                      <input
                        type="email"
                        value={newOwnerEmail}
                        onChange={(e) => setNewOwnerEmail(e.target.value)}
                        required
                        placeholder="altan@gokdelen.ge"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold leading-normal">
                    {t.labelEmailSub}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3.5 text-xs font-black text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300"
                >
                  {t.btnPublish}
                </button>
              </form>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
