"use client";

import { SkeletonText } from "@/components/ui/skeleton";
import Link from "next/link";
import MusicJacket from "@/components/music/musicJacket";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { BingoCatalogItem } from "@/features/bingos/schemas/publicBingoSchema";

export default function BingoCatalogCard({
    item,
    isAuthenticated,
}: {
    item: BingoCatalogItem;
    isAuthenticated: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const completed = new Set(item.completedPositions);
    return (
        <Link href={href(`/bingo/${item.id}`)} className="nl-bingo-card">
            <MusicJacket
                appearance="foundation"
                index={item.musicIndex}
                background={item.background}
                title={item.title}
                className="nl-bingo-card__cover"
                fallback={<span />}
            >
                {isAuthenticated ? (
                    <>
                        <span className="nl-bingo-mini" aria-hidden="true">
                            {Array.from({ length: 25 }, (_, i) => (
                                <span
                                    key={i}
                                    data-completed={completed.has(i + 1)}
                                />
                            ))}
                        </span>
                        <span
                            className="nl-bingo-card__track"
                            aria-hidden="true"
                        >
                            <span style={{ width: `${completed.size * 4}%` }} />
                        </span>
                    </>
                ) : null}
            </MusicJacket>
            <span className="nl-bingo-card__body">
                <span className="nl-entity-title">{item.title}</span>
                <span className="nl-bingo-card__meta">
                    {isAuthenticated ? (
                        <span className="nl-metadata nl-muted">
                            {completed.size === 25
                                ? t("bingo.fullBoard")
                                : item.completedLines >= item.requiredLines
                                  ? t("bingo.unlocked")
                                  : t("bingo.cells", { count: completed.size })}
                        </span>
                    ) : null}
                    <span className="nl-metric-value">
                        {item.rewardNos.toLocaleString(locale)} nos
                    </span>
                </span>
            </span>
        </Link>
    );
}

/** 빙고 카드 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 카드 틀(자켓 1:1 · 본문 안쪽 12 · 사이 8 · 아래 보상 줄) */
export function BingoCatalogCardSkeleton() {
    return (
        <div className="nl-bingo-card" aria-hidden="true">
            <span className="nl-jacket nl-bingo-card__cover nl-skeleton" />
            <span className="nl-bingo-card__body">
                <SkeletonText className="nl-entity-title" width="l" />
                <span className="nl-bingo-card__meta">
                    <SkeletonText className="nl-metric-value" width="s" />
                </span>
            </span>
        </div>
    );
}
