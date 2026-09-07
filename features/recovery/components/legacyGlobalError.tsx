"use client";

import { useEffect, useState } from "react";
import { recordClientError } from "@/lib/observability/client";

const errorCopy = {
    ko: {
        title: "NosLog를 불러오지 못했습니다.",
        description: "잠시 후 다시 시도해주세요.",
        retry: "다시 시도",
    },
    ja: {
        title: "NosLogを読み込めませんでした。",
        description: "しばらくしてからもう一度お試しください。",
        retry: "再試行",
    },
    en: {
        title: "Could Not Load NosLog",
        description: "Please try again in a moment.",
        retry: "Try Again",
    },
} as const;

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [locale, setLocale] = useState<keyof typeof errorCopy>("en");

    useEffect(() => {
        recordClientError(error, "global-error-boundary");
        const documentLocale = document.documentElement.lang;
        // 전역 오류 경계는 LocaleProvider 밖에 있어 문서 언어를 마운트 후 반영함
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocale(
            documentLocale === "ko" || documentLocale === "ja"
                ? documentLocale
                : "en"
        );
    }, [error]);
    const copy = errorCopy[locale];

    return (
        <html lang={locale}>
            <body className="bg-bg text-text-primary">
                <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                    <div>
                        <h1 className="text-title">{copy.title}</h1>
                        <p className="text-text-secondary mt-2 text-sm">
                            {copy.description}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={reset}
                        className="border-border bg-surface text-text-primary h-10 cursor-pointer rounded-md border px-4 text-sm font-semibold"
                    >
                        {copy.retry}
                    </button>
                </main>
            </body>
        </html>
    );
}
