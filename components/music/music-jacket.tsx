"use client";

/* eslint-disable @next/next/no-img-element */

import { Music, Music2 } from "lucide-react";
import { type ReactNode, useState } from "react";

import { getJacketCandidates, getLocalJacketSrcSet } from "@/lib/music-jackets";
import { cn } from "@/lib/cn";
import { useTranslations } from "@/components/i18n/locale-provider";

interface MusicJacketProps {
    index: string;
    background: string | null;
    title: string;
    className?: string;
    children?: ReactNode;
    fallback?: ReactNode;
    appearance?: "legacy" | "foundation";
}

// 저장된 자켓이 없거나 로딩에 실패하면 공통 대체 이미지를 표시함
export default function MusicJacket({
    index,
    background,
    title,
    className,
    children,
    fallback,
    appearance = "legacy",
}: MusicJacketProps) {
    const t = useTranslations();
    const jacketCandidates = getJacketCandidates(index, background);
    const [failedUrls, setFailedUrls] = useState<string[]>([]);
    const jacketUrl = jacketCandidates.find(
        (candidate) => !failedUrls.includes(candidate)
    );
    // 작은 칸은 축소판을 받는다 — sizes="auto" 는 그려지는 폭으로 고르고, 모르는 브라우저는 지금처럼 512px(2026-10-15 S11)
    const srcSet = jacketUrl ? getLocalJacketSrcSet(jacketUrl) : null;

    return (
        <span
            className={cn(
                appearance === "foundation"
                    ? "nl-jacket"
                    : "relative flex overflow-hidden bg-nl-raised",
                className
            )}
            role={appearance === "foundation" ? "img" : undefined}
            aria-label={t("common.jacket", { title })}
            data-empty={appearance === "foundation" ? !jacketUrl : undefined}
        >
            {jacketUrl ? (
                <img
                    src={jacketUrl}
                    srcSet={srcSet ?? undefined}
                    sizes={srcSet ? "auto, 512px" : undefined}
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
            ) : appearance === "foundation" ? (
                <Music className="nl-jacket__fallback" aria-hidden />
            ) : (
                <Music2
                    className="m-auto size-1/3 text-nl-disabled"
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
}
