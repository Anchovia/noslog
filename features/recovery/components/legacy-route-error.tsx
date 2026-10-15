"use client";

import { RotateCcw } from "lucide-react";

import { useTranslations } from "@/components/i18n/locale-provider";
import { foundationButtonClass } from "@/components/ui/button";

// 관리자 · 채보 에디터의 원래 오류 화면(app/error.tsx 가 이 경로에서만 쓴다)
export default function LegacyRouteError({ reset }: { reset: () => void }) {
    const t = useTranslations();

    return (
        <div className="noslog-ui flex flex-col items-center justify-center gap-nl-16 px-nl-24 py-nl-64 text-center">
            <div>
                <h1 className="nl-section-title">{t("common.pageError")}</h1>
                <p className="nl-body-secondary mt-nl-8 text-nl-subdued">
                    {t("common.retryLater")}
                </p>
            </div>
            <button
                type="button"
                onClick={reset}
                className={foundationButtonClass({ variant: "secondary" })}
            >
                <RotateCcw className="nl-icon-small" aria-hidden />
                {t("common.retry")}
            </button>
        </div>
    );
}
