"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CompactLanguageSwitcher, {
  LanguageCode,
} from "@/components/language/CompactLanguageSwitcher";

// Multilingual texts
const translations = {
  tr: {
    eyebrow: "MAĞAZA PERSONEL YÖNETİMİ",
    title: "Personel, Rol ve Erişim Yetkileri",
    description:
      "Mağaza sahibi lisans alırken kaç kullanıcılı olacağını seçmiş ve personelleri kullanıcı adı ve şifreleri ile kendisi tanımlamıştır. Bu yetkileri 'Yönetici' (Manager) olarak tanımladığı kişilere de devredebilir.",
    activeUsersCount: "Aktif Personel Sayısı",
    maxUsersLimit: "Lisans Kullanıcı Limiti",
    upgradeLicense: "Lisansı Yükselt / Satın Al",
    addUserBtn: "Yeni Personel Tanımla",
    userListTitle: "Tanımlı Personel Hesapları",
    roleExplanationTitle: "Yetki Prensibi ve Rol Açıklamaları",
    unauthorizedTitle: "Yetersiz Yetki Seviyesi",
    unauthorizedText: "Kullanıcı ekleme, silme ve yetki yönetimi işlemleri sadece Mağaza Sahibi (Owner) ve Yöneticiler (Manager) tarafından gerçekleştirilebilir.",
    limitWarning: "Maksimum lisans kullanıcı sınırına ulaştınız! Yeni personel eklemek için lütfen HBS lisans paketinizi yükseltin veya mevcut bir hesabı pasife alın.",
    placeholderName: "Örn: Ahmet Yılmaz",
    placeholderUser: "Örn: ahmet@firma.com veya ahmet_obdtr",
    placeholderPass: "Giriş için güvenli şifre belirleyin",
    labelName: "Ad Soyad *",
    labelUsername: "Kullanıcı Adı / E-posta *",
    labelPassword: "Giriş Şifresi *",
    labelRole: "Sistem Rolü *",
    saveSuccess: "Yeni personel başarıyla tanımlandı!",
    deleteSuccess: "Kullanıcı hesabı başarıyla silindi.",
    roleOwner: "Mağaza Sahibi (Owner)",
    roleManager: "Yönetici (Manager)",
    roleSales: "Satış Personeli (Sales)",
    roleWarehouse: "Depo Personeli (Warehouse)",
    roleViewer: "Salt Okunur İzleyici (Viewer)",
    colName: "Kullanıcı",
    colRole: "Rol / Yetki",
    colAccess: "Erişim Seviyesi",
    colActions: "İşlemler",
    delete: "Sil",
    accessAll: "Tam Sistem Kontrolü",
    accessManager: "Ürün, Stok, Müşteri, Teklif Yönetimi",
    accessSales: "Teklif, Satış, Sipariş ve Mesajlar",
    accessWarehouse: "Stok Giriş/Çıkış, Barkod ve Raf İşlemleri",
    accessViewer: "Sadece Rapor ve Veri Görüntüleme",
  },
  en: {
    eyebrow: "STORE STAFF MANAGEMENT",
    title: "Staff, Roles and Access Permissions",
    description:
      "The store owner selects the number of users when purchasing a license and defines their employees with specific usernames and passwords. They can also delegate these user management rights to individuals designated as 'Managers'.",
    activeUsersCount: "Active Staff Count",
    maxUsersLimit: "Licensed User Limit",
    upgradeLicense: "Upgrade License / Purchase",
    addUserBtn: "Define New Staff",
    userListTitle: "Defined Staff Accounts",
    roleExplanationTitle: "Role Hierarchy & Permissions",
    unauthorizedTitle: "Insufficient Authorization Level",
    unauthorizedText: "Adding users, deletion, and privilege management can only be performed by the Store Owner (Owner) and designated Managers (Manager).",
    limitWarning: "You have reached your maximum licensed user limit! To add new staff, please upgrade your HBS license package or remove an existing account.",
    placeholderName: "e.g., John Doe",
    placeholderUser: "e.g., john@company.com or john_obdtr",
    placeholderPass: "Choose a secure login password",
    labelName: "Full Name *",
    labelUsername: "Username / Email *",
    labelPassword: "Login Password *",
    labelRole: "System Role *",
    saveSuccess: "New staff member has been successfully created!",
    deleteSuccess: "User account deleted successfully.",
    roleOwner: "Store Owner (Owner)",
    roleManager: "Manager (Manager)",
    roleSales: "Sales Representative (Sales)",
    roleWarehouse: "Warehouse Personnel (Warehouse)",
    roleViewer: "Read-Only Viewer (Viewer)",
    colName: "User",
    colRole: "Role / Authority",
    colAccess: "Access Level",
    colActions: "Actions",
    delete: "Delete",
    accessAll: "Full System Administration",
    accessManager: "Product, Stock, Customer, Quote Management",
    accessSales: "Quotes, Sales, Orders, and Messages",
    accessWarehouse: "Stock In/Out, Barcodes, and Shelf Mappings",
    accessViewer: "Reports & Data Dashboard Read-Only",
  },
  ru: {
    eyebrow: "УПРАВЛЕНИЕ ПЕРСОНАЛОМ МАГАЗИНА",
    title: "Сотрудники, роли и права доступа",
    description:
      "Владелец магазина выбирает количество пользователей при покупке лицензии и сам определяет сотрудников с их именами пользователей и паролями. Он также может делегировать эти права администратора лицам, определенным как «Менеджер» (Manager).",
    activeUsersCount: "Активный персонал",
    maxUsersLimit: "Лимит пользователей по лицензии",
    upgradeLicense: "Обновить лицензию / Купить",
    addUserBtn: "Создать пользователя",
    userListTitle: "Учетные записи персонала",
    roleExplanationTitle: "Принцип авторизации и роли",
    unauthorizedTitle: "Недостаточный уровень прав",
    unauthorizedText: "Добавление пользователей, удаление и управление правами могут выполнять только Владелец магазина (Owner) и назначенные Менеджеры (Manager).",
    limitWarning: "Вы достигли максимального лимита лицензионных пользователей! Чтобы добавить персонал, обновите лицензию HBS или удалите существующий аккаунт.",
    placeholderName: "Напр.: Иван Иванов",
    placeholderUser: "Напр.: ivan@company.com или ivan_obdtr",
    placeholderPass: "Установите надежный пароль",
    labelName: "Имя Фамилия *",
    labelUsername: "Имя пользователя / E-mail *",
    labelPassword: "Пароль для входа *",
    labelRole: "Системная роль *",
    saveSuccess: "Новый сотрудник успешно добавлен!",
    deleteSuccess: "Учетная запись успешно удалена.",
    roleOwner: "Владелец (Owner)",
    roleManager: "Управляющий (Manager)",
    roleSales: "Сотрудник продаж (Sales)",
    roleWarehouse: "Сотрудник склада (Warehouse)",
    roleViewer: "Просмотрщик (Viewer)",
    colName: "Пользователь",
    colRole: "Роль / Права",
    colAccess: "Уровень доступа",
    colActions: "Действия",
    delete: "Удалить",
    accessAll: "Полное администрирование системы",
    accessManager: "Продукты, Склад, Клиенты, Управление ценами",
    accessSales: "Запросы, Продажи, Заказы и Сообщения",
    accessWarehouse: "Прием/Отпуск товаров, Штрихкоды и Ячейки",
    accessViewer: "Только просмотр отчетов и данных",
  },
  ka: {
    eyebrow: "მაღაზიის პერსონალის მართვა",
    title: "თანამშრომლები, როლები და წვდომის უფლებები",
    description:
      "მაღაზიის მფლობელი ლიცენზიის შეძენისას ირჩევს მომხმარებელთა რაოდენობას და თავად განსაზღვრავს თანამშრომლებს მომხმარებლის სახელითა და პაროლით. მას ასევე შეუძლია ეს ადმინისტრაციული უფლებები გადასცეს 'მენეჯერის' (Manager) სტატუსის მქონე პირებს.",
    activeUsersCount: "აქტიური თანამშრომლები",
    maxUsersLimit: "ლიცენზიის მომხმარებელთა ლიმიტი",
    upgradeLicense: "ლიცენზიის განახლება / შეძენა",
    addUserBtn: "ახალი თანამშრომლის დამატება",
    userListTitle: "პერსონალის ანგარიშები",
    roleExplanationTitle: "როლების იერარქია და უფლებები",
    unauthorizedTitle: "არასაკმარისი უფლებების დონე",
    unauthorizedText: "მომხმარებლების დამატება, წაშლა და უფლებების რედაქტირება შეუძლია მხოლოდ მაღაზიის მფლობელს (Owner) და დანიშნულ მენეჯერებს (Manager).",
    limitWarning: "თქვენ მიაღწიეთ ლიცენზირებულ მომხმარებელთა მაქსიმალურ ლიმიტს! ახალი პერსონალის დასამატებლად, გთხოვთ, განაახლოთ HBS ლიცენზიის პაკეტი ან წაშალოთ არსებული ანგარიში.",
    placeholderName: "მაგ: გიორგი კალანდაძე",
    placeholderUser: "მაგ: giorgi@company.com ან giorgi_obdtr",
    placeholderPass: "შეიყვანეთ უსაფრთხო პაროლი შესვლისთვის",
    labelName: "სახელი გვარი *",
    labelUsername: "მომხმარებლის სახელი / ელფოსტა *",
    labelPassword: "შესვლის პაროლი *",
    labelRole: "სისტემური როლი *",
    saveSuccess: "ახალი თანამшრომელი წარმატებით შეიქმნა!",
    deleteSuccess: "მომხმარებლის ანგარიში წარმატებით წაიშალა.",
    roleOwner: "მაღაზიის მფლობელი (Owner)",
    roleManager: "მენეჯერი (Manager)",
    roleSales: "გაყიდვების პერსონალი (Sales)",
    roleWarehouse: "საწყობის პერსონალი (Warehouse)",
    roleViewer: "მხოლოდ ნახვის უფლება (Viewer)",
    colName: "მომხმარებელი",
    colRole: "როლი / უფლებამოსილება",
    colAccess: "წვდომის დონე",
    colActions: "მოქმედებები",
    delete: "წაშლა",
    accessAll: "სისტემის სრული ადმინისტრირება",
    accessManager: "პროდუქტები, საწყობი, კლიენტები, ფასების მართვა",
    accessSales: "შეთავაზებები, გაყიდვები, შეკვეთები და შეტყობინებები",
    accessWarehouse: "საწყობის მოძრაობები, შტრიხკოდები და თაროები",
    accessViewer: "მხოლოდ ანგარიშებისა და მონაცემების ნახვა",
  },
  de: {
    eyebrow: "PERSONALVERWALTUNG DES LADENS",
    title: "Personal, Rollen und Zugriffsberechtigungen",
    description:
      "Der Ladenbesitzer wählt beim Kauf einer Lizenz die Anzahl der Benutzer aus und definiert seine Mitarbeiter mit Benutzernamen und Passwörtern. Er kann diese Administrationsrechte auch an Personen delegieren, die als 'Manager' definiert sind.",
    activeUsersCount: "Aktive Mitarbeiteranzahl",
    maxUsersLimit: "Lizenzbenutzer-Limit",
    upgradeLicense: "Lizenz upgraden / Kaufen",
    addUserBtn: "Neues Personal anlegen",
    userListTitle: "Definierte Personal-Konten",
    roleExplanationTitle: "Rollenhierarchie & Berechtigungen",
    unauthorizedTitle: "Unzureichende Berechtigungsstufe",
    unauthorizedText: "Das Hinzufügen, Löschen von Benutzern und Verwalten von Privilegien kann nur vom Ladenbesitzer (Owner) und ernannten Managern (Manager) durchgeführt werden.",
    limitWarning: "Sie haben Ihr maximales Lizenzbenutzer-Limit erreicht! Um neues Personal hinzuzufügen, aktualisieren Sie bitte Ihr HBS-Lizenzpaket oder entfernen Sie ein vorhandenes Konto.",
    placeholderName: "z.B. Hans Müller",
    placeholderUser: "z.B. hans@firma.com oder hans_obdtr",
    placeholderPass: "Wählen Sie ein sicheres Login-Passwort",
    labelName: "Vor- und Nachname *",
    labelUsername: "Benutzername / E-Mail *",
    labelPassword: "Passwort *",
    labelRole: "Systemrolle *",
    saveSuccess: "Neuer Mitarbeiter wurde erfolgreich angelegt!",
    deleteSuccess: "Benutzerkonto wurde erfolgreich gelöscht.",
    roleOwner: "Ladenbesitzer (Owner)",
    roleManager: "Manager (Manager)",
    roleSales: "Verkaufspersonal (Sales)",
    roleWarehouse: "Lagerpersonal (Warehouse)",
    roleViewer: "Schreibgeschützter Betrachter (Viewer)",
    colName: "Benutzer",
    colRole: "Rolle / Berechtigung",
    colAccess: "Zugriffsstufe",
    colActions: "Aktionen",
    delete: "Löschen",
    accessAll: "Vollständige Systemadministration",
    accessManager: "Produkt-, Lager-, Kunden- und Angebotsverwaltung",
    accessSales: "Angebote, Verkäufe, Bestellungen und Nachrichten",
    accessWarehouse: "Warenein-/Ausgang, Barcodes und Regalzuweisungen",
    accessViewer: "Nur Berichte und Daten anzeigen",
  },
};

type RoleCode = "owner" | "manager" | "sales" | "warehouse" | "viewer";

type UserRecord = {
  id: string;
  name: string;
  username: string;
  role: RoleCode;
  access: string;
  status: string;
};

export default function StoreUsersPage() {
  const [language, setLanguage] = useState<LanguageCode>("tr");
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    displayName: string;
    role: string;
    storeSlugs: string[];
  } | null>(null);

  const [maxUsers, setMaxUsers] = useState(3);
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Add User Form States
  const [formName, setFormName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<RoleCode>("sales");

  useEffect(() => {
    // 1. Language detection
    const savedLang = window.localStorage.getItem("hbs-language") as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }

    // 2. Active User Check
    const activeUser = JSON.parse(window.localStorage.getItem("hbs-current-user") || "null");
    setCurrentUser(activeUser);

    // 3. Sync Store limits from registered-stores
    if (activeUser) {
      try {
        const storeSlug = activeUser.storeSlugs?.[0] || "obdtr";
        const registeredStores = JSON.parse(window.localStorage.getItem("hbs-registered-stores") || "[]");
        const myStore = registeredStores.find((s: any) => s.code === storeSlug);
        if (myStore) {
          setMaxUsers(myStore.maxUsers || 3);
        }
      } catch (e) {
        console.error("Error loading store limits:", e);
      }
    }

    // 4. Load users list from LocalStorage
    const storedUsers = window.localStorage.getItem("hbs-store-users");
    if (storedUsers) {
      try {
        setUsersList(JSON.parse(storedUsers));
      } catch {
        initializeDemoUsers(activeUser);
      }
    } else {
      initializeDemoUsers(activeUser);
    }
  }, []);

  // Set default accounts in demo mode
  const initializeDemoUsers = (activeUser: any) => {
    const ownerName = activeUser?.displayName || "Özgür Yıldız";
    const ownerEmail = activeUser?.username || "owner@obdtr.com";

    const initial = [
      {
        id: "usr-1",
        name: ownerName,
        username: ownerEmail,
        role: "owner" as RoleCode,
        access: "",
        status: "Aktif",
      },
      {
        id: "usr-2",
        name: "Hakan Güçlü",
        username: "hakan@obdtr.com",
        role: "manager" as RoleCode,
        access: "",
        status: "Aktif",
      },
      {
        id: "usr-3",
        name: "Elif Sayan",
        username: "elif@obdtr.com",
        role: "sales" as RoleCode,
        access: "",
        status: "Aktif",
      },
    ];
    setUsersList(initial);
    window.localStorage.setItem("hbs-store-users", JSON.stringify(initial));
  };

  const t = translations[language] || translations.tr;

  // Authorization Check
  const hasManagementPermission = useMemo(() => {
    if (!currentUser) return false;
    const roleLower = currentUser.role.toLowerCase();
    return roleLower === "owner" || roleLower === "manager" || roleLower === "superadmin";
  }, [currentUser]);

  // Handle Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!hasManagementPermission) {
      setErrorMsg(t.unauthorizedText);
      return;
    }

    if (usersList.length >= maxUsers) {
      setErrorMsg(t.limitWarning);
      return;
    }

    if (!formName.trim() || !formUsername.trim() || !formPassword.trim()) {
      setErrorMsg(language === "tr" ? "Lütfen tüm zorunlu alanları doldurun." : "Please fill in all required fields.");
      return;
    }

    // Check unique username
    if (usersList.some(u => u.username.toLowerCase() === formUsername.trim().toLowerCase())) {
      setErrorMsg(language === "tr" ? "Bu kullanıcı adı zaten alınmış." : "This username is already taken.");
      return;
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: formName.trim(),
      username: formUsername.trim(),
      role: formRole,
      access: "",
      status: "Aktif",
    };

    const updatedList = [...usersList, newUser];
    setUsersList(updatedList);
    window.localStorage.setItem("hbs-store-users", JSON.stringify(updatedList));

    // Reset Form
    setFormName("");
    setFormUsername("");
    setFormPassword("");
    setFormRole("sales");
    setShowAddForm(false);

    setSuccessMsg(t.saveSuccess);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  // Handle Delete User
  const handleDeleteUser = (id: string) => {
    if (!hasManagementPermission) {
      setErrorMsg(t.unauthorizedText);
      return;
    }

    const targetUser = usersList.find(u => u.id === id);
    if (targetUser?.role === "owner") {
      setErrorMsg(language === "tr" ? "Ana mağaza sahibi (Owner) hesabı silinemez." : "The main store owner account cannot be deleted.");
      return;
    }

    const updatedList = usersList.filter(u => u.id !== id);
    setUsersList(updatedList);
    window.localStorage.setItem("hbs-store-users", JSON.stringify(updatedList));

    setSuccessMsg(t.deleteSuccess);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const getRoleBadgeColor = (role: RoleCode) => {
    switch (role) {
      case "owner":
        return "bg-amber-950 text-amber-200 border border-amber-500/20";
      case "manager":
        return "bg-blue-950 text-blue-200 border border-blue-500/20";
      case "sales":
        return "bg-emerald-950 text-emerald-200 border border-emerald-500/20";
      case "warehouse":
        return "bg-purple-950 text-purple-200 border border-purple-500/20";
      default:
        return "bg-slate-900 text-slate-350 border border-slate-700/20";
    }
  };

  const getTranslatedRole = (role: RoleCode) => {
    switch (role) {
      case "owner":
        return t.roleOwner;
      case "manager":
        return t.roleManager;
      case "sales":
        return t.roleSales;
      case "warehouse":
        return t.roleWarehouse;
      default:
        return t.roleViewer;
    }
  };

  const getTranslatedAccess = (role: RoleCode) => {
    switch (role) {
      case "owner":
        return t.accessAll;
      case "manager":
        return t.accessManager;
      case "sales":
        return t.accessSales;
      case "warehouse":
        return t.accessWarehouse;
      default:
        return t.accessViewer;
    }
  };

  return (
    <DashboardLayout activeMenu="Mağaza Kullanıcıları">
      <div className="space-y-4 text-white">
        
        {/* Interactive Title Banner */}
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600/30 text-blue-300 border-l border-b border-white/10 px-4 py-1 text-[10px] font-black rounded-bl-2xl uppercase tracking-wider">
            {currentUser?.role === "owner" ? "★ Store Owner Mode ★" : `★ Role: ${currentUser?.role || "staff"} ★`}
          </div>
          
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">
                {t.eyebrow}
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-slate-100">
                {t.title}
              </h1>
              <p className="mt-2 max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-300">
                {t.description}
              </p>
            </div>

            {hasManagementPermission && (
              <button
                onClick={() => {
                  setErrorMsg("");
                  setShowAddForm(!showAddForm);
                }}
                className="rounded-2xl bg-white px-5 py-3.5 text-xs font-black text-slate-950 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-white/5"
              >
                👤 {showAddForm ? (language === "tr" ? "Formu Kapat" : "Close Form") : t.addUserBtn}
              </button>
            )}
          </div>
        </header>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/15 p-4 text-xs font-black text-emerald-200 shadow-sm animate-fadeIn">
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/15 p-4 text-xs font-black text-red-200 shadow-sm animate-fadeIn">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* License Usage Indicators */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
            <div className="text-[11px] font-bold uppercase text-slate-550 tracking-wider">{t.activeUsersCount}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{usersList.length}</span>
              <span className="text-sm text-slate-550 font-bold">/ {maxUsers}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
            <div className="text-[11px] font-bold uppercase text-slate-550 tracking-wider">{t.maxUsersLimit}</div>
            <div className="mt-2 text-2xl font-black text-blue-300">
              {maxUsers === 99999 ? (language === "tr" ? "Sınırsız Paket" : "Unlimited Pack") : `${maxUsers} Kullanıcı`}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl flex flex-col justify-center">
            <Link
              href="/dashboard/license"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-center py-2.5 text-xs font-black text-white transition active:scale-95 shadow-md shadow-blue-500/10"
            >
              🚀 {t.upgradeLicense}
            </Link>
          </div>
        </section>

        {/* Add User Interactive Form (Fades In) */}
        {showAddForm && hasManagementPermission && (
          <section className="rounded-3xl border border-blue-500/20 bg-slate-900/80 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl animate-fadeIn space-y-4">
            <h2 className="text-lg font-black text-blue-100 flex items-center gap-2">
              👤 {t.labelName.replace(" *", "")} Tanımlama Formu
            </h2>
            
            <form onSubmit={handleCreateUser} className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-bold text-slate-300">{t.labelName}</span>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t.placeholderName}
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none text-xs font-bold focus:border-blue-500 focus:bg-slate-900 transition-all" id="id-page-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-text-xs-font-bold-focus-border-blue-500-focus-bg-slate-900-transition-all-517" aria-label="Rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none text xs font bold focus border blue 500 focus bg slate 900 transition all" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold text-slate-300">{t.labelUsername}</span>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder={t.placeholderUser}
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none text-xs font-bold focus:border-blue-500 focus:bg-slate-900 transition-all" id="id-page-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-text-xs-font-bold-focus-border-blue-500-focus-bg-slate-900-transition-all-543" aria-label="Rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none text xs font bold focus border blue 500 focus bg slate 900 transition all" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold text-slate-300">{t.labelPassword}</span>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={t.placeholderPass}
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none text-xs font-bold focus:border-blue-500 focus:bg-slate-900 transition-all" id="id-page-rounded-2xl-border-border-white-10-bg-slate-950-px-4-py-3-outline-none-text-xs-font-bold-focus-border-blue-500-focus-bg-slate-900-transition-all-636" aria-label="Rounded 2xl border border white 10 bg slate 950 px 4 py 3 outline none text xs font bold focus border blue 500 focus bg slate 900 transition all" />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold text-slate-300">{t.labelRole}</span>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as RoleCode)}
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none text-xs font-bold focus:border-blue-500 focus:bg-slate-900 transition-all text-white"
                >
                  <option value="manager" className="bg-slate-950">{t.roleManager}</option>
                  <option value="sales" className="bg-slate-950">{t.roleSales}</option>
                  <option value="warehouse" className="bg-slate-950">{t.roleWarehouse}</option>
                  <option value="viewer" className="bg-slate-950">{t.roleViewer}</option>
                </select>
              </label>

              <div className="sm:col-span-2 pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-white/10 bg-transparent px-5 py-3 text-xs font-bold hover:bg-white/5"
                >
                  {language === "tr" ? "İptal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={usersList.length >= maxUsers}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-3 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {t.addUserBtn}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Unauthorized Notification for Non-Managers */}
        {!hasManagementPermission && (
          <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-5 shadow-2xl backdrop-blur-md space-y-2">
            <h3 className="text-red-300 font-black text-base">⚠️ {t.unauthorizedTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-normal font-semibold">
              {t.unauthorizedText}
            </p>
          </div>
        )}

        {/* Main Users Table Grid layout */}
        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              👥 {t.userListTitle}
            </h2>

            <div className="space-y-3">
              {usersList.map((user) => (
                <article
                  key={user.id}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 items-center sm:grid-cols-[1.2fr_1fr_1.5fr_auto]"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-700 font-bold block">{t.colName}</span>
                    <span className="mt-1 font-black text-sm block text-slate-200">{user.name}</span>
                    <span className="text-[10px] text-slate-550 block mt-0.5">{user.username}</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-700 font-bold block mb-1">{t.colRole}</span>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${getRoleBadgeColor(user.role)}`}>
                      {getTranslatedRole(user.role)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-700 font-bold block">{t.colAccess}</span>
                    <span className="mt-1 text-xs text-slate-300 block font-semibold leading-normal">{getTranslatedAccess(user.role)}</span>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    {hasManagementPermission && user.role !== "owner" ? (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-xl border border-red-500/30 hover:border-red-500 bg-red-950/30 hover:bg-red-600 text-red-200 hover:text-white px-3 py-1.5 text-xs font-black transition-all active:scale-95 shadow-sm"
                      >
                        🗑️ {t.delete}
                      </button>
                    ) : (
                      <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">
                        {user.status}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Side Helper Card with Explanations */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-md space-y-4">
            <h2 className="text-lg font-black text-slate-200">ℹ️ {t.roleExplanationTitle}</h2>
            
            <div className="space-y-3">
              {[
                { title: t.roleOwner, text: t.accessAll },
                { title: t.roleManager, text: t.accessManager },
                { title: t.roleSales, text: t.accessSales },
                { title: t.roleWarehouse, text: t.accessWarehouse },
                { title: t.roleViewer, text: t.accessViewer }
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 space-y-1">
                  <h4 className="text-xs font-black text-blue-300">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">{item.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

      </div>
    </DashboardLayout>
  );
}
