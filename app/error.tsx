"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div>
                <h1 className="text-title">페이지를 불러오지 못했습니다.</h1>
                <p className="text-body-muted mt-2">
                    잠시 후 다시 시도해주세요.
                </p>
            </div>
            <button
                type="button"
                onClick={reset}
                className="border-border bg-surface text-text-primary flex h-10 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm font-semibold"
            >
                <RotateCcw className="size-4" aria-hidden />
                다시 시도
            </button>
        </div>
    );
}
