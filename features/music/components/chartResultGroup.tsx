"use client";

import { SkeletonText } from "@/components/ui/skeleton";
import Link from "next/link";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import type { DiscoveryResult } from "@/features/music/schemas/discoverySchema";

/**
 * 채보 줄(2026-09-25 A2 · R1 · I2 · D1) — 채보 하나 = 줄 하나 = 링크 하나. 악곡 목록 줄과 같은 틀에
 * 자켓 80 · 이름 · 아티스트 두 줄, 오른쪽 끝 난이도 칩 「Real 3」. 작성자 · 출처 · 공개일은 뷰어에서 본다(2026-09-26, 사용자).
 * 응답이 곡 묶음(난이도 여럿)이어도 난이도마다 줄을 나눈다
 */
export default function ChartResultRows({
    music,
    pending = false,
}: {
    music: DiscoveryResult;
    pending?: boolean;
}) {
    const href = useLocalizedHref();
    const t = useTranslations();
    return music.targets.map((target) => (
        <Link
            key={target.difficulty}
            href={href(
                `/music/${music.index}/${target.difficulty.toLowerCase()}/pattern`
            )}
            className="nl-music-card nl-music-card--list nl-chart-row"
            aria-disabled={pending || undefined}
            onClick={(event) => {
                if (pending) event.preventDefault();
            }}
        >
            <MusicJacket
                index={music.index}
                title={music.title}
                background={music.background}
                appearance="foundation"
            >
                <span
                    className="nl-jacket__category nl-metadata"
                    lang="en"
                    data-category={music.category_short}
                >
                    {music.category_short}
                </span>
            </MusicJacket>
            <span className="nl-music-card__body">
                <span className="nl-music-card__identity">
                    <span
                        className="nl-entity-title"
                        lang={
                            /[぀-ヿ㐀-鿿]/u.test(music.title) ? "ja" : undefined
                        }
                    >
                        {music.title}
                    </span>
                    <span className="nl-body-secondary nl-muted">
                        {music.artist || t("music.unknownArtist")}
                    </span>
                </span>
                <span
                    className={`nl-chart-chip nl-level--${target.difficulty.toLowerCase()}`}
                    lang="en"
                >
                    <span className="nl-control">{target.difficulty}</span>
                    <span className="nl-metric-value">{target.level}</span>
                </span>
            </span>
        </Link>
    ));
}

/** 채보 줄 스켈레톤 — 같은 줄 틀에 자켓 · 이름 · 아티스트 · 난이도 칩 */
export function ChartResultRowSkeleton() {
    return (
        <div
            className="nl-music-card nl-music-card--list nl-chart-row"
            aria-hidden="true"
        >
            <span className="nl-jacket nl-skeleton" />
            <span className="nl-music-card__body">
                <span className="nl-music-card__identity">
                    <SkeletonText className="nl-entity-title" width="l" />
                    <SkeletonText className="nl-body-secondary" width="m" />
                </span>
                <span className="nl-chart-chip nl-skeleton" />
            </span>
        </div>
    );
}
