"use client";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Link from "next/link";

export default function NotFound() {
    const href = useLocalizedHref();
    const t = useTranslations();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div>
                <h1 className="text-title">{t("common.notFoundTitle")}</h1>
                <p className="text-body-muted mt-2">
                    {t("common.notFoundDescription")}
                </p>
            </div>
            <Link
                href={href("/")}
                className="border-border bg-surface text-text-primary flex h-10 items-center rounded-md border px-4 text-sm font-semibold"
            >
                {t("common.goHome")}
            </Link>
        </div>
    );
}
