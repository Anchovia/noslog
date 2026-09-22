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

export type BingoCatalogView = "grid" | "list";

/** 25칸 미니 판 — 채운 칸만 켠다. 격자 카드는 자켓 위(오른쪽 아래), 목록 행은 오른쪽 끝 */
function BingoMini({ completed }: { completed: ReadonlySet<number> }) {
    return (
        <span className="nl-bingo-mini" aria-hidden="true">
            {Array.from({ length: 25 }, (_, i) => (
                <span key={i} data-completed={completed.has(i + 1)} />
            ))}
        </span>
    );
}

/**
 * 빙고 목록 항목(2026-09-22 재설계) — 격자(기본) = 자켓 + 아래 이름 · 상태, 목록 = 자켓 48 행 + 글 아래 진행 막대.
 * 로그인하면 미니 판 · 진행 막대 · 상태(칸 · 해금 · 풀보드 · 찬스), 게스트는 버전 · 보상만
 */
export default function BingoCatalogCard({
    item,
    isAuthenticated,
    view = "grid",
}: {
    item: BingoCatalogItem;
    isAuthenticated: boolean;
    view?: BingoCatalogView;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const completed = new Set(item.completedPositions);
    const reward = `${item.rewardNos.toLocaleString(locale)} nos`;
    const status =
        completed.size === 25
            ? t("bingo.fullBoard")
            : item.completedLines >= item.requiredLines
              ? t("bingo.unlocked")
              : t("bingo.cells", { count: completed.size });
    const meta = isAuthenticated ? (
        <span className="nl-metadata nl-muted nl-bingo-card__status">
            <span className="nl-bingo-card__state">{status}</span>
            {item.chanceLines > 0 ? (
                <>
                    {" · "}
                    <span className="nl-bingo-card__chance">
                        {t("bingo.chance", { count: item.chanceLines })}
                    </span>
                </>
            ) : null}
        </span>
    ) : (
        <span className="nl-metadata nl-muted nl-bingo-card__status">
            {[item.sourceVersion, reward].filter(Boolean).join(" · ")}
        </span>
    );
    const track = (
        <span className="nl-bingo-card__track" aria-hidden="true">
            <span style={{ width: `${completed.size * 4}%` }} />
        </span>
    );
    if (view === "list")
        return (
            <Link
                href={href(`/bingo/${item.id}`)}
                className="nl-bingo-row-item"
            >
                <MusicJacket
                    appearance="foundation"
                    index={item.musicIndex}
                    background={item.background}
                    title={item.title}
                    className="nl-bingo-row-item__cover"
                />
                <span className="nl-bingo-row-item__body">
                    <span className="nl-emphasis-label nl-bingo-row-item__title">
                        {item.title}
                    </span>
                    {isAuthenticated ? (
                        <span className="nl-metadata nl-muted nl-bingo-card__status">
                            {[item.sourceVersion, status]
                                .filter(Boolean)
                                .join(" · ")}
                            {item.chanceLines > 0 ? (
                                <>
                                    {" · "}
                                    <span className="nl-bingo-card__chance">
                                        {t("bingo.chance", {
                                            count: item.chanceLines,
                                        })}
                                    </span>
                                </>
                            ) : null}
                        </span>
                    ) : (
                        meta
                    )}
                    {isAuthenticated ? (
                        // 진행 막대 = 상세 진행 막대와 같은 규격(높이 4 · border/divider 트랙 · local-data/single)
                        <span className="nl-bingo-summary__bar" aria-hidden>
                            <i style={{ width: `${completed.size * 4}%` }} />
                        </span>
                    ) : null}
                </span>
                {isAuthenticated ? <BingoMini completed={completed} /> : null}
            </Link>
        );
    return (
        <Link href={href(`/bingo/${item.id}`)} className="nl-bingo-card">
            <MusicJacket
                appearance="foundation"
                index={item.musicIndex}
                background={item.background}
                title={item.title}
                className="nl-bingo-card__cover"
            >
                {isAuthenticated ? (
                    <>
                        <BingoMini completed={completed} />
                        {track}
                    </>
                ) : null}
            </MusicJacket>
            <span className="nl-bingo-card__body">
                <span className="nl-emphasis-label nl-bingo-card__title">
                    {item.title}
                </span>
                {meta}
            </span>
        </Link>
    );
}

/** 빙고 카드 스켈레톤 — 같은 틀(격자: 자켓 1:1 + 이름 · 상태 두 줄 / 목록: 자켓 48 + 두 줄) */
export function BingoCatalogCardSkeleton({
    view = "grid",
}: {
    view?: BingoCatalogView;
}) {
    if (view === "list")
        return (
            <div className="nl-bingo-row-item" aria-hidden="true">
                <span className="nl-jacket nl-bingo-row-item__cover nl-skeleton" />
                <span className="nl-bingo-row-item__body">
                    <SkeletonText className="nl-emphasis-label" width="l" />
                    <SkeletonText className="nl-metadata" width="s" />
                </span>
            </div>
        );
    return (
        <div className="nl-bingo-card" aria-hidden="true">
            <span className="nl-jacket nl-bingo-card__cover nl-skeleton" />
            <span className="nl-bingo-card__body">
                <SkeletonText className="nl-emphasis-label" width="l" />
                <SkeletonText className="nl-metadata" width="s" />
            </span>
        </div>
    );
}
