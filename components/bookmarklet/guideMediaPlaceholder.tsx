"use client";

import { ImageIcon } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";

export default function GuideMediaPlaceholder({ label }: { label: string }) {
    const t = useTranslations();
    return (
        <div
            className="border-border bg-surface-muted text-text-disabled flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed"
            aria-label={t("sync.gifPlaceholder", { label })}
        >
            <ImageIcon className="size-5" aria-hidden />
            <span className="text-caption">{t("sync.gifPending")}</span>
        </div>
    );
}
