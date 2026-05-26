"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import CompactLanguageSwitcher, { LanguageCode } from "@/components/language/CompactLanguageSwitcher";
import { supabase } from "@/lib/supabaseClient";

type RegisterMode = "select" | "customer" | "store" | "done";
type DoneKind = "customer" | "store";

const texts = {
  tr: {
    home: "Ana sayfa",
    title: "HBS kaydı",
    subtitle: "Hesap türünü seç ve devam et.",
    customerButton: "Ziyaretçi kaydı",
    storeButton: "Mağaza kaydı",
    customerTitle: "Ziyaretçi kaydı",
    storeTitle: "Mağaza kaydı",
    fullName: "Ad soyad",
    email: "E-posta",
    phone: "Telefon",
    password: "Şifre",
    country: "Ülke",
    cityOptional: "Şehir (zorunlu değil)",
    company: "Mağaza / işletme adı",
    representative: "Yetkili ad soyad",
    address: "Mağaza adresi",
    whatsapp: "WhatsApp hattı",
    maps: "Google Maps bağlantısı (opsiyonel)",
    customerCampaign: "Ziyaret ettiğim ve ayrıca onay verdiğim mağazalardan kampanya mesajı almak istiyorum.",
    ownerDeclaration: "Bu mağazayı/işletmeyi temsil etmeye yetkili olduğumu beyan ederim.",
    customerSubmit: "Ziyaretçi hesabı oluştur",
    storeSubmit: "Mağaza hesabı oluştur",
    back: "Geri",
    login: "Zaten hesabım var",
    customerDone: "Ziyaretçi hesabı oluşturuldu. Şimdi ürün ve hizmetleri keşfetmeye devam edebilirsin.",
    storeDone: "Mağaza hesabı oluşturuldu. İlk kullanıcı mağaza yetkilisi kabul edilir; panelden kullanıcı ekleyebilir, askıya alabilir ve yetkileri değiştirebilir.",
    goMarketplace: "Ürünleri keşfet",
    goDashboard: "Mağaza paneline git",
    storeNote: "Ürün, hizmet, kiralama, tur veya açık artırma modülleri ilk girişten sonra panelden açılıp kapatılabilir.",
  },
  en: {
    home: "Home",
    title: "HBS registration",
    subtitle: "Choose the account type and continue.",
    customerButton: "Visitor registration",
    storeButton: "Store registration",
    customerTitle: "Visitor registration",
    storeTitle: "Store registration",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    country: "Country",
    cityOptional: "City (optional)",
    company: "Store / business name",
    representative: "Authorized person",
    address: "Store address",
    whatsapp: "WhatsApp line",
    maps: "Google Maps link (optional)",
    customerCampaign: "I want campaign messages only from stores I visit and explicitly approve.",
    ownerDeclaration: "I declare that I am authorized to represent this store/business.",
    customerSubmit: "Create visitor account",
    storeSubmit: "Create store account",
    back: "Back",
    login: "I already have an account",
    customerDone: "Visitor account created. You can now continue exploring products and services.",
    storeDone: "Store account created. The first user is accepted as store owner; users and permissions can be managed later from the panel.",
    goMarketplace: "Explore products",
    goDashboard: "Go to store panel",
    storeNote: "Product, service, rental, tour or auction modules can be enabled later from the panel.",
  },
  de: {
    home: "Startseite",
    title: "HBS-Registrierung",
    subtitle: "Kontotyp wählen und fortfahren.",
    customerButton: "Besucherregistrierung",
    storeButton: "Shop-Registrierung",
    customerTitle: "Besucherregistrierung",
    storeTitle: "Shop-Registrierung",
    fullName: "Name",
    email: "E-Mail",
    phone: "Telefon",
    password: "Passwort",
    country: "Land",
    cityOptional: "Stadt (optional)",
    company: "Shop / Firma",
    representative: "Bevollmächtigte Person",
    address: "Shop-Adresse",
    whatsapp: "WhatsApp",
    maps: "Google Maps Link (optional)",
    customerCampaign: "Ich möchte Kampagnen nur von besuchten und bestätigten Shops erhalten.",
    ownerDeclaration: "Ich erkläre, dass ich berechtigt bin, diesen Shop/dieses Unternehmen zu vertreten.",
    customerSubmit: "Besucherkonto erstellen",
    storeSubmit: "Shop-Konto erstellen",
    back: "Zurück",
    login: "Ich habe bereits ein Konto",
    customerDone: "Besucherkonto erstellt. Sie können jetzt Produkte und Services entdecken.",
    storeDone: "Shop-Konto erstellt. Der erste Benutzer gilt als Shop-Inhaber; Benutzer und Rechte können später im Panel verwaltet werden.",
    goMarketplace: "Produkte entdecken",
    goDashboard: "Zum Shop-Panel",
    storeNote: "Produkt-, Service-, Miet-, Tour- oder Auktionsmodule können später im Panel aktiviert werden.",
  },
  ru: {
    home: "Главная",
    title: "Регистрация HBS",
    subtitle: "Выберите тип аккаунта и продолжайте.",
    customerButton: "Регистрация посетителя",
    storeButton: "Регистрация магазина",
    customerTitle: "Регистрация посетителя",
    storeTitle: "Регистрация магазина",
    fullName: "Имя и фамилия",
    email: "Email",
    phone: "Телефон",
    password: "Пароль",
    country: "Страна",
    cityOptional: "Город (необязательно)",
    company: "Магазин / бизнес",
    representative: "Уполномоченное лицо",
    address: "Адрес магазина",
    whatsapp: "WhatsApp",
    maps: "Ссылка Google Maps (необязательно)",
    customerCampaign: "Хочу получать кампании только от посещенных и подтвержденных мной магазинов.",
    ownerDeclaration: "Я подтверждаю, что имею право представлять этот магазин/бизнес.",
    customerSubmit: "Создать аккаунт посетителя",
    storeSubmit: "Создать аккаунт магазина",
    back: "Назад",
    login: "У меня уже есть аккаунт",
    customerDone: "Аккаунт посетителя создан. Теперь можно продолжить поиск товаров и услуг.",
    storeDone: "Аккаунт магазина создан. Первый пользователь считается владельцем магазина; пользователей и права можно менять позже в панели.",
    goMarketplace: "Смотреть товары",
    goDashboard: "В панель магазина",
    storeNote: "Модули товаров, услуг, аренды, туров или аукционов можно включить позже из панели.",
  },
  ka: {
    home: "მთავარი",
    title: "HBS რეგისტრაცია",
    subtitle: "აირჩიეთ ანგარიშის ტიპი და გააგრძელეთ.",
    customerButton: "მომხმარებლის რეგისტრაცია",
    storeButton: "მაღაზიის რეგისტრაცია",
    customerTitle: "მომხმარებლის რეგისტრაცია",
    storeTitle: "მაღაზიის რეგისტრაცია",
    fullName: "სახელი და გვარი",
    email: "ელფოსტა",
    phone: "ტელეფონი",
    password: "პაროლი",
    country: "ქვეყანა",
    cityOptional: "ქალაქი (არასავალდებულო)",
    company: "მაღაზია / ბიზნესი",
    representative: "უფლებამოსილი პირი",
    address: "მაღაზიის მისამართი",
    whatsapp: "WhatsApp",
    maps: "Google Maps ბმული (არასავალდებულო)",
    customerCampaign: "კამპანიების მიღება მინდა მხოლოდ იმ მაღაზიებისგან, რომლებსაც ვესტუმრები და დავადასტურებ.",
    ownerDeclaration: "ვადასტურებ, რომ მაქვს ამ მაღაზიის/ბიზნესის წარმოდგენის უფლება.",
    customerSubmit: "მომხმარებლის ანგარიშის შექმნა",
    storeSubmit: "მაღაზიის ანგარიშის შექმნა",
    back: "უკან",
    login: "უკვე მაქვს ანგარიში",
    customerDone: "მომხმარებლის ანგარიში შეიქმნა. ახლა შეგიძლიათ პროდუქტებისა და სერვისების დათვალიერება.",
    storeDone: "მაღაზიის ანგარიში შეიქმნა. პირველი მომხმარებელი ითვლება მფლობელად; მომხმარებლებისა და უფლებების მართვა პანელიდან შეიძლება.",
    goMarketplace: "პროდუქტების ნახვა",
    goDashboard: "მაღაზიის პანელი",
    storeNote: "პროდუქტის, სერვისის, ქირაობის, ტურის ან აუქციონის მოდულები მოგვიანებით პანელიდან ჩაირთვება.",
  },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "tr" || value === "en" || value === "ru" || value === "ka" || value === "de";
}

export default function RegisterPage() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [mode, setMode] = useState<RegisterMode>("select");
  const [doneKind, setDoneKind] = useState<DoneKind>("customer");
  const [error, setError] = useState("");
  const t = texts[language];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("hbs-language");
    setLanguage(isLanguageCode(savedLanguage) ? savedLanguage : "tr");
  }, []);

  async function submitCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;

    if (isSupabaseConfigured) {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            country,
            city,
            role: "customer",
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // public.customers tablosuna da kaydet
        await supabase.from("customers").insert({
          id: data.user.id,
          full_name: fullName,
          phone,
          email,
          city,
          trust_score: 100,
        });

        // Local storage'a kaydet (uyumluluk için)
        window.localStorage.setItem(
          "hbs-current-user",
          JSON.stringify({
            username: email,
            displayName: fullName,
            role: "customer",
            storeSlugs: [],
            signedInAt: new Date().toISOString(),
          })
        );
      }
    } else {
      // Offline fallback için local storage'a kaydet
      window.localStorage.setItem(
        "hbs-current-user",
        JSON.stringify({
          username: email,
          displayName: fullName,
          role: "customer",
          storeSlugs: [],
          signedInAt: new Date().toISOString(),
        })
      );
    }

    setDoneKind("customer");
    setMode("done");
    window.localStorage.removeItem("hbs-register-draft");
  }

  async function submitStore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

    const formData = new FormData(event.currentTarget);
    const company = formData.get("company") as string;
    const representative = formData.get("representative") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const maps = formData.get("maps") as string;

    if (isSupabaseConfigured) {
      // 1. Supabase Auth signup
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: representative,
            phone,
            country,
            city,
            role: "owner",
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // 2. Şirketi (Company) oluştur
        const companyCode = company.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const { data: companyData, error: compError } = await supabase
          .from("companies")
          .insert({
            name: company,
            code: companyCode,
            default_language: language,
            main_currency: "GEL",
            phone,
            whatsapp,
            address,
          })
          .select("id")
          .single();

        if (compError) {
          setError("Mağaza kaydı sırasında hata oluştu: " + compError.message);
          return;
        }

        // 3. Profili güncelle (company_id ve role set et)
        if (companyData) {
          await supabase
            .from("profiles")
            .update({
              company_id: companyData.id,
              role: "owner",
            })
            .eq("id", data.user.id);
        }

        // Local storage'a kaydet (uyumluluk için)
        window.localStorage.setItem(
          "hbs-current-user",
          JSON.stringify({
            username: email,
            displayName: representative,
            role: "owner",
            storeSlugs: [companyCode],
            signedInAt: new Date().toISOString(),
          })
        );
      }
    } else {
      // Offline fallback
      const companyCode = company.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      window.localStorage.setItem(
        "hbs-current-user",
        JSON.stringify({
          username: email,
          displayName: representative,
          role: "owner",
          storeSlugs: [companyCode],
          signedInAt: new Date().toISOString(),
        })
      );
    }

    setDoneKind("store");
    setMode("done");
    window.localStorage.removeItem("hbs-register-draft");
  }

  return (
    <main className="hbs-market-page min-h-screen px-3 py-3 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-base font-black tracking-wide sm:text-xl">HBS</Link>
          <div className="flex items-center gap-2">
            <CompactLanguageSwitcher />
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black">{t.home}</Link>
          </div>
        </header>

        <section className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-lg sm:p-5">
          {mode === "select" && (
            <div className="grid gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{t.title}</h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">{t.subtitle}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/customer-register" className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left shadow-sm transition hover:border-blue-500 hover:bg-blue-100 block">
                  <div className="text-xl font-black text-blue-950">{t.customerButton}</div>
                  <p className="text-xs text-slate-500 mt-1">Sadece e-posta ve telefon ile anında kayıt olun.</p>
                </Link>
                <Link href="/store-register" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left shadow-sm transition hover:border-emerald-500 hover:bg-emerald-100 block">
                  <div className="text-xl font-black text-emerald-950">{t.storeButton}</div>
                  <p className="text-xs text-slate-500 mt-1">Firma detayları ve depo haritanızla SaaS panelinizi kurun.</p>
                </Link>
              </div>
              <Link href="/login" className="inline-flex w-fit rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50">{t.login}</Link>
            </div>
          )}

          {mode === "customer" && (
            <form onSubmit={submitCustomer} className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-black tracking-tight">{t.customerTitle}</h1>
                <button type="button" onClick={() => setMode("select")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black">{t.back}</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="fullName" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.fullName} autoComplete="off" />
                <input name="email" required type="email" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.email} autoComplete="off" />
                <input name="phone" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.phone} autoComplete="off" />
                <input name="password" required type="password" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.password} autoComplete="new-password" />
                <input name="country" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.country} autoComplete="off" />
                <input name="city" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.cityOptional} autoComplete="off" />
              </div>
              <label className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-700">
                <input type="checkbox" className="mt-1" />
                <span>{t.customerCampaign}</span>
              </label>
              {error && <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-bold text-red-700">{error}</div>}
              <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">{t.customerSubmit}</button>
            </form>
          )}

          {mode === "store" && (
            <form onSubmit={submitStore} className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-black tracking-tight">{t.storeTitle}</h1>
                <button type="button" onClick={() => setMode("select")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black">{t.back}</button>
              </div>
              <p className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold leading-5 text-blue-900">{t.storeNote}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="company" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.company} autoComplete="off" />
                <input name="representative" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.representative} autoComplete="off" />
                <input name="email" required type="email" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.email} autoComplete="off" />
                <input name="phone" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.phone} autoComplete="off" />
                <input name="password" required type="password" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.password} autoComplete="new-password" />
                <input name="country" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.country} autoComplete="off" />
                <input name="city" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.cityOptional.replace("(zorunlu değil)", "").replace("(optional)", "").replace("(необязательно)", "").replace("(არასავალდებულო)", "")} autoComplete="off" />
                <input name="address" required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.address} autoComplete="off" />
                <input name="whatsapp" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.whatsapp} autoComplete="off" />
                <input name="maps" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={t.maps} autoComplete="off" />
              </div>
              <label className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-black leading-5 text-amber-950">
                <input required type="checkbox" className="mt-1" />
                <span>{t.ownerDeclaration}</span>
              </label>
              {error && <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-bold text-red-700">{error}</div>}
              <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">{t.storeSubmit}</button>
            </form>
          )}

          {mode === "done" && (
            <div className="grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-black leading-6 text-emerald-950">{doneKind === "customer" ? t.customerDone : t.storeDone}</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">{t.goMarketplace}</Link>
                {doneKind === "store" && <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black hover:bg-slate-50">{t.goDashboard}</Link>}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
