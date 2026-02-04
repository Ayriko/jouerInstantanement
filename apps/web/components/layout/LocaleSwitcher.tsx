"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, routing, type Locale } from "@/i18n/routing";

export const LocaleSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="mt-6 flex items-center gap-2 text-sm">
      <Globe className="h-4 w-4" />
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="bg-transparent text-zinc-400 hover:text-white cursor-pointer outline-none transition-colors [&>option]:bg-zinc-900 [&>option]:text-zinc-100"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
    </div>
  );
};
