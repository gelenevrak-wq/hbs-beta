import { HbsLanguageCode } from "./translations";

export type LocalizedText = Partial<Record<HbsLanguageCode, string>> & {
  tr: string;
  en: string;
};

export function pickLocalizedText(
  text: LocalizedText | string,
  language: HbsLanguageCode
): string {
  if (typeof text === "string") return text;

  return text[language] || text.en || text.tr;
}

export const dynamicUi = {
  address: {
    tr: "Adres",
    en: "Address",
    de: "Adresse",
    ru: "Адрес",
    ka: "მისამართი",
  },
  phone: {
    tr: "Telefon",
    en: "Phone",
    de: "Telefon",
    ru: "Телефон",
    ka: "ტელეფონი",
  },
  email: {
    tr: "E-posta",
    en: "Email",
    de: "E-Mail",
    ru: "Эл. почта",
    ka: "ელფოსტა",
  },
  salesMethodLabel: {
    tr: "Satış şekli",
    en: "Sales method",
    de: "Verkaufsart",
    ru: "Способ продажи",
    ka: "გაყიდვის წესი",
  },
  note: {
    tr: "Not",
    en: "Note",
    de: "Hinweis",
    ru: "Примечание",
    ka: "შენიშვნა",
  },
} satisfies Record<string, LocalizedText>;
