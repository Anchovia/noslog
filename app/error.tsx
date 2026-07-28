"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations();
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div>
                <h1 className="text-title">{t("common.pageError")}</h1>
                <p className="text-body-muted mt-2">{t("common.retryLater")}</p>
            </div>
            <button
                type="button"
                onClick={reset}
                className="border-border bg-surface text-text-primary flex h-10 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm font-semibold"
            >
                <RotateCcw className="size-4" aria-hidden />
                {t("common.retry")}
            </button>
        </div>
    );
}
