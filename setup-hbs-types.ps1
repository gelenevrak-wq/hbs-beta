$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Write-HbsFile {
  param (
    [string]$Path,
    [string]$Content
  )

  $fullPath = Join-Path $root $Path
  $folder = Split-Path $fullPath -Parent

  if (!(Test-Path $folder)) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
  }

  Set-Content -Path $fullPath -Value $Content -Encoding UTF8
}

Write-HbsFile "types/hbs.ts" @'
export type LanguageCode = "tr" | "en" | "ru" | "ka" | "de";

export type CurrencyCode = "GEL" | "USD" | "EUR" | "TRY";

export type CompanyAccessMode =
  | "public"
  | "approval_required"
  | "invite_code"
  | "closed";

export type UserRole =
  | "owner"
  | "top_manager"
  | "store_manager"
  | "warehouse_manager"
  | "sales_staff"
  | "accounting"
  | "customer_service"
  | "viewer";

export type OfferableItemType =
  | "product"
  | "service"
  | "rentable_asset";

export type WarehouseType =
  | "raw_material"
  | "semi_finished"
  | "finished_goods"
  | "store"
  | "shipping"
  | "return"
  | "damaged"
  | "quarantine"
  | "branch";

export type StockStatus =
  | "available"
  | "reserved"
  | "in_transfer"
  | "in_delivery"
  | "returned"
  | "damaged"
  | "quarantine";

export type StockMovementType =
  | "stock_in"
  | "stock_out"
  | "sale"
  | "return"
  | "count_adjustment"
  | "warehouse_transfer"
  | "delivery"
  | "reservation";

export type RequestType =
  | "product_request"
  | "service_request"
  | "bulk_purchase"
  | "urgent_request"
  | "rental_request";

export type ReservationStatus =
  | "requested"
  | "waiting_approval"
  | "approved"
  | "deposit_waiting"
  | "active"
  | "completed"
  | "cancelled"
  | "no_show"
  | "late"
  | "blocked";

export type ReviewDirection =
  | "customer_to_store"
  | "store_to_customer";

export type ReminderStatus =
  | "draft"
  | "waiting_approval"
  | "approved"
  | "sent"
  | "cancelled"
  | "paid";

export type LicensePlan =
  | "trial"
  | "monthly"
  | "yearly"
  | "three_year"
  | "five_year"
  | "ten_year"
  | "lifetime";

export type HbsCompany = {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  defaultLanguage: LanguageCode;
  mainCurrency: CurrencyCode;
  accessMode: CompanyAccessMode;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  isCustomerPortalActive: boolean;
  isPublicSearchEnabled: boolean;
  createdAt: string;
};

export type HbsUser = {
  id: string;
  companyId: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export type HbsWarehouse = {
  id: string;
  companyId: string;
  name: string;
  type: WarehouseType;
  address?: string;
  isVisibleToCustomers: boolean;
  isSalesEnabled: boolean;
  isTransferEnabled: boolean;
  responsibleUserId?: string;
};

export type HbsWarehouseLocation = {
  id: string;
  warehouseId: string;
  name: string;
  parentLocationId?: string;
  sortOrder: number;
};

export type HbsOfferableItem = {
  id: string;
  companyId: string;
  type: OfferableItemType;
  name: string;
  code: string;
  barcode?: string;
  qrCode?: string;
  oemCodes?: string[];
  category?: string;
  brand?: string;
  description?: string;
  photoUrls: string[];
  videoUrls: string[];
  currency: CurrencyCode;
  salePrice?: number;
  purchasePrice?: number;
  isVisibleInStorefront: boolean;
  isVisibleInPublicSearch: boolean;
  createdAt: string;
};

export type HbsProductStock = {
  id: string;
  productId: string;
  warehouseId: string;
  locationId?: string;
  status: StockStatus;
  quantity: number;
  averageCost?: number;
  saleValue?: number;
};

export type HbsStockMovement = {
  id: string;
  companyId: string;
  productId: string;
  movementType: StockMovementType;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  fromLocationId?: string;
  toLocationId?: string;
  quantity: number;
  unitCost?: number;
  unitSalePrice?: number;
  currency: CurrencyCode;
  userId: string;
  customerId?: string;
  orderId?: string;
  note?: string;
  createdAt: string;
};

export type HbsCustomer = {
  id: string;
  fullName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  city?: string;
  trustScore?: number;
  createdAt: string;
};

export type HbsCompanyCustomer = {
  id: string;
  companyId: string;
  customerId: string;
  status: "waiting_approval" | "approved" | "rejected" | "passive";
  priceGroup?: string;
  creditLimit?: number;
  balance?: number;
  currency: CurrencyCode;
  createdAt: string;
};

export type HbsCustomerRequest = {
  id: string;
  customerId: string;
  requestType: RequestType;
  title: string;
  description: string;
  category?: string;
  city?: string;
  quantity?: number;
  budgetMin?: number;
  budgetMax?: number;
  currency?: CurrencyCode;
  isUrgent: boolean;
  isPaidPromotion: boolean;
  status: "open" | "quoted" | "closed" | "cancelled";
  createdAt: string;
  expiresAt?: string;
};

export type HbsQuote = {
  id: string;
  companyId: string;
  customerId: string;
  language: LanguageCode;
  currency: CurrencyCode;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  exchangeRateSnapshot?: Record<CurrencyCode, number>;
  validUntil?: string;
  createdAt: string;
};

export type HbsOrder = {
  id: string;
  companyId: string;
  customerId: string;
  quoteId?: string;
  status:
    | "new"
    | "preparing"
    | "in_delivery"
    | "delivered"
    | "cancelled"
    | "returned";
  currency: CurrencyCode;
  totalAmount: number;
  createdAt: string;
};

export type HbsReservation = {
  id: string;
  companyId: string;
  customerId: string;
  itemId: string;
  status: ReservationStatus;
  startAt: string;
  endAt: string;
  capacity: number;
  totalPrice?: number;
  depositAmount?: number;
  currency: CurrencyCode;
  createdAt: string;
};

export type HbsReview = {
  id: string;
  direction: ReviewDirection;
  companyId: string;
  customerId: string;
  orderId?: string;
  reservationId?: string;
  rating: number;
  comment?: string;
  visibility: "public" | "company_internal" | "platform_score_only";
  status: "published" | "waiting_review" | "reported" | "hidden";
  createdAt: string;
};

export type HbsPaymentReminder = {
  id: string;
  companyId: string;
  customerId: string;
  amount: number;
  currency: CurrencyCode;
  dueDate: string;
  delayDays: number;
  reminderLevel: 1 | 2 | 3 | 4;
  language: LanguageCode;
  status: ReminderStatus;
  approvedByUserId?: string;
  sentAt?: string;
  createdAt: string;
};

export type HbsCampaign = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  type:
    | "homepage_featured"
    | "category_ad"
    | "city_ad"
    | "sponsored_search"
    | "story"
    | "premium_badge";
  status: "draft" | "waiting_approval" | "live" | "paused" | "expired" | "rejected";
  targetCity?: string;
  targetCategory?: string;
  startsAt: string;
  endsAt: string;
  isPaid: boolean;
};

export type HbsLicense = {
  id: string;
  companyId: string;
  plan: LicensePlan;
  trialEndsAt?: string;
  licenseEndsAt?: string;
  activeModules: string[];
  maxUsers?: number;
  maxProducts?: number;
  isActive: boolean;
};
'@

Write-Host ""
Write-Host "HBS veri tipleri olusturuldu: types/hbs.ts" -ForegroundColor Green
Write-Host "Bu dosya ileride veritabani ve gerçek çalışma mantığının omurgası olacak." -ForegroundColor Cyan