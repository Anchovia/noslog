"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useTranslations } from "@/components/i18n/locale-provider";
import Button from "@/components/ui/button";

/**
 * 에디터 주소 복사 — 좁은 화면 안내(기여 입구 창 · 에디터 자리)에서 넓은 화면으로 옮겨 열 때.
 * 성공하면 누른 버튼 글자가 잠깐 「복사됨」 으로 바뀌고, 알림은 화면 읽기로만 한다.
 * 주소를 주지 않으면 지금 페이지 주소를 복사한다.
 */
export default function ChartDraftCopyButton({
    href,
    className,
}: {
    href?: string;
    className?: string;
}) {
    const t = useTranslations();
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!copied) return;
        const timer = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timer);
    }, [copied]);
    return (
        <>
            <Button
                className={className}
                onClick={() => {
                    const url = href
                        ? new URL(href, window.location.href).href
                        : window.location.href;
                    void navigator.clipboard.writeText(url).then(
                        () => setCopied(true),
                        () => toast.error(t("tiers.linkCopyFailed"))
                    );
                }}
            >
                {copied ? t("common.copied") : t("contribution.entry.copyLink")}
            </Button>
            {copied ? (
                <span className="sr-only" role="status">
                    {t("contribution.entry.copied")}
                </span>
            ) : null}
        </>
    );
}
