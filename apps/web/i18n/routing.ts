import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "fr",
  localePrefix: "always",
  locales: ["fr", "en", "es"],
});

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, string> = {
  fr: "Fran\u00e7ais",
  en: "English",
  es: "Espa\u00f1ol",
};
