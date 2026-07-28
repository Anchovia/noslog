"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import {
    localizePath,
    stripLocaleFromPath,
    type Locale,
} from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const localeOptions: {
    value: Locale;
    label: string;
    languageTag: string;
}[] = [
    { value: "ko", label: "한국어", languageTag: "ko" },
    { value: "ja", label: "日本語", languageTag: "ja" },
    { value: "en", label: "English", languageTag: "en" },
];

export default function LocaleSwitcher({
    onNavigate,
}: {
    onNavigate?: () => void;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = useLocale();
    const t = useTranslations();
    const barePathname = stripLocaleFromPath(pathname);
    const query = searchParams.toString();

    return (
        <section
            className="border-divider col-span-2 border-t pt-3"
            aria-label={t("header.language")}
        >
            <p className="text-caption mb-2">{t("header.language")}</p>
            <div className="grid grid-cols-3 gap-2">
                {localeOptions.map((option) => {
                    const selected = option.value === locale;

                    return (
                        <a
                            key={option.value}
                            href={`${localizePath(barePathname, option.value)}${
                                query ? `?${query}` : ""
                            }`}
                            hrefLang={option.languageTag}
                            lang={option.languageTag}
                            aria-current={selected ? "page" : undefined}
                            onClick={onNavigate}
                            className={cn(
                                "border-border bg-bg text-text-secondary flex h-10 items-center justify-center rounded-md border text-xs font-semibold transition-colors",
                                selected &&
                                    "border-chart bg-surface-muted text-text-primary"
                            )}
                        >
                            {option.label}
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
