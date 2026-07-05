export type LanguageCode = "tr" | "en" | "de" | "ru" | "ka";

export const translations = {
  tr: {
    common: {
      home: "Ana Sayfa",
      close: "Kapat",
      cancel: "Vazgeç",
      apply: "Uygula",
      save: "Kaydet",
      yes: "Evet",
      no: "Hayır",
      error: "Hata",
      success: "Başarılı",
      delete: "Sil",
      edit: "Düzenle",
      confirmDelete: '"{name}" isimli ürünü silmek istediğinize emin misiniz?',
      deletedSuccessfully: '"{name}" başarıyla silindi.',
      loading: "Yükleniyor..."
    },
    auth: {
      oneAccountCompleteControl: "Tek HBS Hesabı, Tüm Güç Elinizde.",
      signIntoHbs: "HBS Giriş",
      pleaseAuthenticate: "Lütfen kimlik bilgilerinizi doğrulayın.",
      usernameOrEmail: "Kullanıcı Adı veya E-Mail",
      password: "Şifre",
      loginBtn: "Giriş Yap",
      forgotPassword: "Şifremi Unuttum",
      registerLink: "Kayıt Ol",
      dontHaveAccount: "Henüz bir HBS hesabınız yok mu?",
      invalidCredentials: "Kullanıcı adı, e-posta veya şifre hatalı.",
      centralWarehouseTitle: "Merkez Depo & Akıllı Raf",
      centralWarehouseDesc: "Sanal mağaza kalıplarını geride bırakın; ürünlerinizi fiziksel konum ve raf bazlı entegre edin.",
      liveB2bTitle: "B2B Canlı Pazarlık & Teklif",
      liveB2bDesc: "Müşterilerinizin iskontolu fiyat ve pazarlık taleplerini tek ekrandan onaylayın.",
      biometricTitle: "Gelişmiş Touch ID & Passkey",
      biometricDesc: "Dünya standartlarında biyometrik güvenlik ile şifresiz, tek dokunuşla hızlı giriş.",
      noAnnualFee: "YILLIK ÜCRET YOK · AÇILIŞA ÖZEL LİSANS",
      placeholderUsername: "örn: MUSTERI veya e-posta"
    },
    forgotPassword: {
      title: "Şifremi Unuttum",
      desc: "E-posta veya telefon bilgisini girin. Canlı sistemde doğrulama kodu gönderilecektir.",
      placeholder: "E-posta veya telefon",
      submitBtn: "Kurtarma bağlantısı gönder",
      successMsg: "Demo kurtarma akışı oluşturuldu.",
      backToLogin: "Giriş ekranına dön"
    },
    layout: {
      admin: "★ Platform Yönetimi",
      dashboard: "Ana Panel",
      businessModels: "İş Modelleri",
      products: "Ürünler",
      services: "Hizmet / Takvim",
      rentals: "Kiralama",
      tours: "Tur / Deneyim",
      stock: "Stok",
      warehouses: "Depo Haritası",
      stockMovements: "Stok Hareketleri",
      orders: "Siparişler",
      customers: "Müşteriler",
      users: "Mağaza Kullanıcıları",
      requests: "Talep Panosu",
      quotes: "Teklif / Proforma",
      reservations: "Randevu / Rezervasyon",
      campaigns: "Reklam / Kampanyalar",
      reviews: "Yorumlar",
      balances: "Müşteri Bakiyeleri",
      reminders: "Ödeme Hatırlatmaları",
      currency: "Kur Ayarları",
      reports: "Raporlar",
      settings: "Firma Ayarları",
      license: "Lisans",
      help: "Yardım Merkezi",
      activeStore: "Aktif Mağaza",
      features: "Ürün + Hizmet + Kiralama",
      hybridStore: "Karma mağaza"
    }
  },
  en: {
    common: {
      home: "Home",
      close: "Close",
      cancel: "Cancel",
      apply: "Apply",
      save: "Save",
      yes: "Yes",
      no: "No",
      error: "Error",
      success: "Success",
      delete: "Delete",
      edit: "Edit",
      confirmDelete: 'Are you sure you want to delete "{name}"?',
      deletedSuccessfully: '"{name}" was successfully deleted.',
      loading: "Loading..."
    },
    auth: {
      oneAccountCompleteControl: "One HBS Account, Complete Control.",
      signIntoHbs: "Sign in to HBS",
      pleaseAuthenticate: "Please authenticate your identity.",
      usernameOrEmail: "Username or Email",
      password: "Password",
      loginBtn: "Sign In",
      forgotPassword: "Forgot password",
      registerLink: "Register",
      dontHaveAccount: "Don't have an HBS account yet?",
      invalidCredentials: "Username, email or password incorrect.",
      centralWarehouseTitle: "Central Warehouse & Smart Shelf",
      centralWarehouseDesc: "Leave placeholders behind; integrate your goods with physical locations and shelves.",
      liveB2bTitle: "Live B2B Offer & Bidding",
      liveB2bDesc: "Approve custom discount requests and negotiation offers in real time.",
      biometricTitle: "Advanced Touch ID & Passkey",
      biometricDesc: "World-class biometric security for passwordless, single-touch logins.",
      noAnnualFee: "NO ANNUAL FEE · OPENING LICENSE",
      placeholderUsername: "e.g. MUSTERI or email"
    },
    forgotPassword: {
      title: "Forgot Password",
      desc: "Enter your email or phone number. A verification link will be sent in the live system.",
      placeholder: "Email or phone",
      submitBtn: "Send recovery link",
      successMsg: "Demo recovery flow initiated.",
      backToLogin: "Return to login screen"
    },
    layout: {
      admin: "★ Platform Administration",
      dashboard: "Main Dashboard",
      businessModels: "Business Models",
      products: "Products",
      services: "Service / Calendar",
      rentals: "Rentals",
      tours: "Tour / Experience",
      stock: "Stock",
      warehouses: "Warehouse Map",
      stockMovements: "Stock Movements",
      orders: "Orders",
      customers: "Customers",
      users: "Store Users",
      requests: "Request Board",
      quotes: "Quotes / Invoices",
      reservations: "Appointments / Booking",
      campaigns: "Ads / Campaigns",
      reviews: "Reviews",
      balances: "Customer Balances",
      reminders: "Payment Reminders",
      currency: "Currency Rates",
      reports: "Reports",
      settings: "Company Settings",
      license: "License",
      help: "Help Center",
      activeStore: "Active Store",
      features: "Product + Service + Rental",
      hybridStore: "Hybrid store"
    }
  },
  de: {
    common: {
      home: "Startseite",
      close: "Schließen",
      cancel: "Abbrechen",
      apply: "Übernehmen",
      save: "Speichern",
      yes: "Ja",
      no: "Nein",
      error: "Fehler",
      success: "Erfolgreich",
      delete: "Löschen",
      edit: "Bearbeiten",
      confirmDelete: 'Sind Sie sicher, dass Sie das Produkt "{name}" löschen möchten?',
      deletedSuccessfully: '"{name}" wurde erfolgreich gelöscht.',
      loading: "Laden..."
    },
    auth: {
      oneAccountCompleteControl: "Ein HBS-Konto, vollständige Kontrolle.",
      signIntoHbs: "Bei HBS anmelden",
      pleaseAuthenticate: "Bitte bestätigen Sie Ihre Identität.",
      usernameOrEmail: "Benutzername oder E-Mail",
      password: "Passwort",
      loginBtn: "Anmelden",
      forgotPassword: "Passwort vergessen",
      registerLink: "Registrieren",
      dontHaveAccount: "Haben Sie noch kein HBS-Konto?",
      invalidCredentials: "Kullanıcı adı, e-posta veya şifre hatalı. (Ungültige Anmeldedaten)",
      centralWarehouseTitle: "Zentrallager & Intelligentes Regal",
      centralWarehouseDesc: "Verzichten Sie auf Platzhalter; integrieren Sie Ihre Waren in physische Standorte und Regale.",
      liveB2bTitle: "Live-B2B-Angebot & Gebote",
      liveB2bDesc: "Genehmigen Sie kundenindividuelle Rabattanfragen und Verhandlungsangebote in Echtzeit.",
      biometricTitle: "Erweiterte Touch ID & Passkey",
      biometricDesc: "Biometrische Sicherheit auf Weltklasseniveau für passwortlose Logins mit nur einer Berührung.",
      noAnnualFee: "KEINE JAHRESGEBÜHR · ERÖFFNUNGSLIZENZ",
      placeholderUsername: "z.B. MUSTERI oder E-Mail"
    },
    forgotPassword: {
      title: "Passwort vergessen",
      desc: "Geben Sie Ihre E-Mail-Adresse oder Telefonnummer ein. Im Live-System wird ein Bestätigungscode gesendet.",
      placeholder: "E-Mail oder Telefonnummer",
      submitBtn: "Wiederherstellungslink senden",
      successMsg: "Demo-Wiederherstellungsablauf gestartet.",
      backToLogin: "Zurück zum Login-Bildschirm"
    },
    layout: {
      admin: "★ Plattformverwaltung",
      dashboard: "Haupt-Dashboard",
      businessModels: "Geschäftsmodelle",
      products: "Produkte",
      services: "Service / Kalender",
      rentals: "Vermietung",
      tours: "Touren / Erlebnisse",
      stock: "Lagerbestand",
      warehouses: "Lagerplan",
      stockMovements: "Lagerbewegungen",
      orders: "Bestellungen",
      customers: "Kunden",
      users: "Shop-Benutzer",
      requests: "Anfrage-Board",
      quotes: "Angebote / Proforma",
      reservations: "Termine / Buchungen",
      campaigns: "Werbung / Kampagnen",
      reviews: "Bewertungen",
      balances: "Kundenbilanzen",
      reminders: "Zahlungserinnerungen",
      currency: "Währungsraten",
      reports: "Berichte",
      settings: "Firmeneinstellungen",
      license: "Lizenz",
      help: "Hilfezentrum",
      activeStore: "Aktiver Shop",
      features: "Produkt + Service + Miete",
      hybridStore: "Hybrid-Shop"
    }
  },
  ru: {
    common: {
      home: "Главная",
      close: "Закрыть",
      cancel: "Отмена",
      apply: "Применить",
      save: "Сохранить",
      yes: "Да",
      no: "Нет",
      error: "Ошибка",
      success: "Успешно",
      delete: "Удалить",
      edit: "Изменить",
      confirmDelete: 'Вы уверены, что хотите удалить товар "{name}"?',
      deletedSuccessfully: '"{name}" был успешно удален.',
      loading: "Загрузка..."
    },
    auth: {
      oneAccountCompleteControl: "Один аккаунт HBS, полный контроль.",
      signIntoHbs: "Войти в HBS",
      pleaseAuthenticate: "Пожалуйста, подтвердите свою личность.",
      usernameOrEmail: "Имя пользователя или Email",
      password: "Пароль",
      loginBtn: "Войти",
      forgotPassword: "Забыли пароль",
      registerLink: "Регистрация",
      dontHaveAccount: "У вас еще нет аккаунта HBS?",
      invalidCredentials: "Неверный логин, email или пароль.",
      centralWarehouseTitle: "Центральный Склад & Умная Полка",
      centralWarehouseDesc: "Оставьте шаблоны позади; интегрируйте товары с физическими полками и адресами.",
      liveB2bTitle: "Живые B2B Предложения & Торги",
      liveB2bDesc: "Утверждайте индивидуальные скидки и согласовывайте цены в реальном времени.",
      biometricTitle: "Улучшенный Touch ID & Passkey",
      biometricDesc: "Биометрическая безопасность мирового класса для беспарольного входа в одно касание.",
      noAnnualFee: "БЕЗ ЕЖЕГОДНОЙ ПЛАТЫ · СТАРТОВАЯ ЛИЦЕНЗИЯ",
      placeholderUsername: "напр. MUSTERI или email"
    },
    forgotPassword: {
      title: "Забыли пароль",
      desc: "Введите ваш email или номер телефона. Код подтверждения будет отправлен в рабочей системе.",
      placeholder: "Email или телефон",
      submitBtn: "Отправить ссылку для сброса",
      successMsg: "Демо-процесс сброса пароля запущен.",
      backToLogin: "Вернуться на экран входа"
    },
    layout: {
      admin: "★ Управление платформой",
      dashboard: "Главная панель",
      businessModels: "Бизнес-модели",
      products: "Товары",
      services: "Услуги / Календарь",
      rentals: "Аренда",
      tours: "Туры / Экскурсии",
      stock: "Склад",
      warehouses: "Карта склада",
      stockMovements: "Движение запасов",
      orders: "Заказы",
      customers: "Клиенты",
      users: "Пользователи магазина",
      requests: "Панель запросов",
      quotes: "Цены / Счета",
      reservations: "Записи / Бронь",
      campaigns: "Реклама / Акции",
      reviews: "Отзывы",
      balances: "Баланс клиентов",
      reminders: "Напоминания о платежах",
      currency: "Настройки валют",
      reports: "Отчеты",
      settings: "Настройки компании",
      license: "Лицензия",
      help: "Справка",
      activeStore: "Активный магазин",
      features: "Товар + Услуга + Аренда",
      hybridStore: "Гибридный магазин"
    }
  },
  ka: {
    common: {
      home: "მთავარი",
      close: "დახურვა",
      cancel: "გაუქმება",
      apply: "გამოყენება",
      save: "შენახვა",
      yes: "დიახ",
      no: "არა",
      error: "შეცდომა",
      success: "წარმატებული",
      delete: "წაშლა",
      edit: "რედაქტირება",
      confirmDelete: 'დარწმუნებული ხართ, რომ გსურთ წაშალოთ პროდუქტი "{name}"?',
      deletedSuccessfully: '"{name}" წარმატებით წაიშალა.',
      loading: "იტვირთება..."
    },
    auth: {
      oneAccountCompleteControl: "ერთი HBS ანგარიში, სრული კონტროლი.",
      signIntoHbs: "HBS შესვლა",
      pleaseAuthenticate: "გთხოვთ, დაადასტუროთ თქვენი ვინეობა.",
      usernameOrEmail: "მომხმარებელი ან ელფოსტა",
      password: "პაროლი",
      loginBtn: "შესვლა",
      forgotPassword: "პაროლი დამავიწყდა",
      registerLink: "რეგისტრაცია",
      dontHaveAccount: "ჯერ არ გაქვთ HBS ანგარიში?",
      invalidCredentials: "მომხმარებელი, ელფოსტა ან პაროლი არასწორია.",
      centralWarehouseTitle: "ცენტრალური საწყობი & ჭკვიანი თარო",
      centralWarehouseDesc: "დატოვეთ დროებითი ადგილები; მოახდინეთ საქონლის ინტეგრაცია ფიზიკურ თაროებთან.",
      liveB2bTitle: "B2B ცოცხალი მოლაპარაკება & შეთავაზება",
      liveB2bDesc: "დაადასტურეთ მომხმარებლის ფასდაკლებისა და მოლაპარაკების მოთხოვნები რეალურ დროში.",
      biometricTitle: "მოწინავე Touch ID & Passkey",
      biometricDesc: "მსოფლიო დონის ბიომეტრიული უსაფრთხოება უპაროლო, ერთი შეხებით შესვლისთვის.",
      noAnnualFee: "ყოველწლიური გადასახადის გარეშე · სალიცენზიო გახსნა",
      placeholderUsername: "მაგ: MUSTERI ან ელფოსტა"
    },
    forgotPassword: {
      title: "პაროლი დამავიწყდა",
      desc: "შეიყვანეთ თქვენი ელფოსტა ან ტელეფონის ნომერი. აღდგენის კოდი გაიგზავნება რეალურ სისტემაში.",
      placeholder: "ელფოსტა ან ტელეფონი",
      submitBtn: "აღდგენის ბმულის გაგზავნა",
      successMsg: "დემო აღდგენის პროცესი ინიცირებულია.",
      backToLogin: "შესვლის ეკრანზე დაბრუნება"
    },
    layout: {
      admin: "★ პლატფორმის ადმინისტრირება",
      dashboard: "მთავარი პანელი",
      businessModels: "ბიზნეს მოდელები",
      products: "პროდუქტები",
      services: "სერვისი / კალენდარი",
      rentals: "გაქირავება",
      tours: "ტური / გამოცდილება",
      stock: "მარაგი",
      warehouses: "საწყობის რუკა",
      stockMovements: "მარაგის მოძრაობა",
      orders: "შეკვეთები",
      customers: "კლიენტები",
      users: "მაღაზიის მომხმარებლები",
      requests: "მოთხოვნების დაფა",
      quotes: "ფასები / პროფორმა",
      reservations: "ჩაწერა / ჯავშანი",
      campaigns: "რეკლამა / კამპანიები",
      reviews: "შეფასებები",
      balances: "კლიენტების ბალანსი",
      reminders: "გადახდის შეხსენებები",
      currency: "ვალუტის კურსი",
      reports: "ანგარიშები",
      settings: "კომპანიის პარამეტრები",
      license: "ლიცენზია",
      help: "დახმარების ცენტრი",
      activeStore: "აქტიური მაღაზია",
      features: "პროდუქტი + სერვისი + გაქირავება",
      hybridStore: "ჰიბრიდული მაღაზია"
    }
  }
} as const;

export function getLocalizedField(fieldValue: string | null | undefined, lang: string): string {
  if (!fieldValue) return "";
  const clean = String(fieldValue).trim();
  
  const isWarning = (val: string) => {
    const l = val.toLowerCase();
    return l.includes("exceeded") || l.includes("limit") || l.includes("mymemory") || l.includes("warning");
  };

  if (clean.startsWith("{") && clean.endsWith("}")) {
    try {
      const parsed = JSON.parse(clean);
      let val = parsed[lang];
      if (val === undefined || val === null || isWarning(String(val))) {
        val = parsed["tr"];
      }
      if (val === undefined || val === null || isWarning(String(val))) {
        val = parsed["en"];
      }
      if (val !== undefined && val !== null) return String(val);
    } catch (e) {
      try {
        const regex = new RegExp(`"${lang}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i");
        const match = clean.match(regex);
        if (match && match[1] !== undefined && !isWarning(match[1])) {
          return match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
        }
        for (const fallback of ["tr", "en"]) {
          const fallbackRegex = new RegExp(`"${fallback}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i");
          const fallbackMatch = clean.match(fallbackRegex);
          if (fallbackMatch && fallbackMatch[1] !== undefined && !isWarning(fallbackMatch[1])) {
            return fallbackMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
          }
        }
      } catch (err) {}
    }
  }
  return fieldValue;
}

export async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text || !text.trim()) return "";
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }
    }
  } catch (e) {
    console.error("Translation helper error:", e);
  }
  return text;
}

export async function translateAllFields(text: string, fromLang: string): Promise<string> {
  if (!text || !text.trim()) return "";
  const targets = ["tr", "en", "de", "ru", "ka"];
  const result: Record<string, string> = {};
  result[fromLang] = text;
  
  await Promise.all(
    targets
      .filter(t => t !== fromLang)
      .map(async (targetLang) => {
        result[targetLang] = await translateText(text, fromLang, targetLang);
      })
  );
  
  return JSON.stringify(result);
}
