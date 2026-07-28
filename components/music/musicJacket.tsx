"use client";

/* eslint-disable @next/next/no-img-element */

import { Music2 } from "lucide-react";
import { type ReactNode, useState } from "react";

import { getJacketCandidates } from "@/lib/musicJackets";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/localeProvider";

interface MusicJacketProps {
    index: string;
    background: string | null;
    title: string;
    className?: string;
    children?: ReactNode;
    fallback?: ReactNode;
}

// 저장된 자켓이 없거나 로딩에 실패하면 공통 대체 이미지를 표시함
export default function MusicJacket({
    index,
    background,
    title,
    className,
    children,
    fallback,
}: MusicJacketProps) {
    const t = useTranslations();
    const jacketCandidates = getJacketCandidates(index, background);
    const [failedUrls, setFailedUrls] = useState<string[]>([]);
    const jacketUrl = jacketCandidates.find(
        (candidate) => !failedUrls.includes(candidate)
    );

    return (
        <span
            className={cn(
                "bg-surface-muted relative flex overflow-hidden",
                className
            )}
            aria-label={t("common.jacket", { title })}
        >
            {jacketUrl ? (
                <img
                    src={jacketUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover"
                    onError={() =>
                        setFailedUrls((current) =>
                            current.includes(jacketUrl)
                                ? current
                                : [...current, jacketUrl]
                        )
                    }
                />
            ) : fallback ? (
                fallback
            ) : (
                <Music2
                    className="text-text-disabled m-auto size-1/3"
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
}
