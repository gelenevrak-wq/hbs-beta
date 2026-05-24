"use client";

export type CountryCode =
  | "GE"
  | "TR"
  | "DE"
  | "AZ"
  | "RU"
  | "GB"
  | "US"
  | "OTHER";

export type CountryOption = {
  code: CountryCode;
  name: string;
  nativeName: string;
  phoneCode: string;
  flag: string;
};

export const countryOptions: CountryOption[] = [
  {
    code: "GE",
    name: "Georgia",
    nativeName: "საქართველო",
    phoneCode: "+995",
    flag: "🇬🇪",
  },
  {
    code: "TR",
    name: "Türkiye",
    nativeName: "Türkiye",
    phoneCode: "+90",
    flag: "🇹🇷",
  },
  {
    code: "DE",
    name: "Germany",
    nativeName: "Deutschland",
    phoneCode: "+49",
    flag: "🇩🇪",
  },
  {
    code: "AZ",
    name: "Azerbaijan",
    nativeName: "Azərbaycan",
    phoneCode: "+994",
    flag: "🇦🇿",
  },
  {
    code: "RU",
    name: "Russia",
    nativeName: "Россия",
    phoneCode: "+7",
    flag: "🇷🇺",
  },
  {
    code: "GB",
    name: "United Kingdom",
    nativeName: "United Kingdom",
    phoneCode: "+44",
    flag: "🇬🇧",
  },
  {
    code: "US",
    name: "United States",
    nativeName: "United States",
    phoneCode: "+1",
    flag: "🇺🇸",
  },
  {
    code: "OTHER",
    name: "Other",
    nativeName: "Other",
    phoneCode: "",
    flag: "🌍",
  },
];

export function getCountryByCode(code: CountryCode) {
  return countryOptions.find((country) => country.code === code);
}

export function getCountryNameByCode(code: CountryCode) {
  return getCountryByCode(code)?.name ?? "Other";
}

export default function CountrySelect({
  value,
  onChange,
  label = "Ülke",
  required = false,
}: {
  value: CountryCode;
  onChange: (value: CountryCode) => void;
  label?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">
        {label}
        {required ? " *" : ""}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CountryCode)}
        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
      >
        {countryOptions.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.code} {country.name}
          </option>
        ))}
      </select>
    </label>
  );
}