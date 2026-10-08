"use client";

import Link from "next/link";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";

export default function NotFound() {
    const href = useLocalizedHref();
    const t = useTranslations();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div>
                <h1 className="text-title">{t("common.notFoundTitle")}</h1>
                <p className="mt-2 text-body-muted">
                    {t("common.notFoundDescription")}
                </p>
            </div>
            <Link
                href={href("/")}
                className="flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-semibold text-text-primary"
            >
                {t("common.goHome")}
            </Link>
        </div>
    );
}
