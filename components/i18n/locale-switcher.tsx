"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import {
    localizePath,
    stripLocaleFromPath,
    type Locale,
} from "@/lib/i18n/routing";

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
            className="col-span-2 border-t-nl-stroke border-nl-divider pt-nl-12"
            aria-label={t("header.language")}
        >
            <p className="nl-metadata mb-nl-8 text-nl-subdued">
                {t("header.language")}
            </p>
            <div className="grid grid-cols-3 gap-nl-8">
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
                            className="nl-chip nl-control"
                        >
                            {option.label}
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
