"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import {
    localizePath,
    stripLocaleFromPath,
    type Locale,
} from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

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
            className="col-span-2 border-t border-divider pt-3"
            aria-label={t("header.language")}
        >
            <p className="mb-2 text-caption">{t("header.language")}</p>
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
                                "flex h-10 items-center justify-center rounded-md border border-border bg-bg text-xs font-semibold text-text-secondary transition-colors",
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
