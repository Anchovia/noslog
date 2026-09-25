"use client";

import { SkeletonText } from "@/components/ui/skeleton";
import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import type { DiscoveryResult } from "@/features/music/schemas/discoverySchema";

/** 공개일 — 서울 기준 월 · 일, 올해가 아니면 연도까지(서열표 업데이트 날짜와 같은 규칙) */
function formatPublished(value: string, locale: string) {
    const date = new Date(value);
    const year = (target: Date) =>
        new Intl.DateTimeFormat("en", {
            year: "numeric",
            timeZone: "Asia/Seoul",
        }).format(target);
    return new Intl.DateTimeFormat(locale, {
        ...(year(date) === year(new Date()) ? {} : { year: "numeric" }),
        month: "short",
        day: "numeric",
        timeZone: "Asia/Seoul",
    }).format(date);
}

/**
 * 채보 줄(2026-09-25 A2 · R1 · I2 · D1) — 채보 하나 = 줄 하나 = 링크 하나. 악곡 목록 줄과 같은 틀에
 * 자켓 80 · 이름 · 아티스트 · 메타(작성자 · 영상에서 추출 · 공개일) 세 줄, 오른쪽 끝 난이도 칩 「Real 3」.
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
    const locale = useLocale();
    const chart = music.chart;
    const meta = chart
        ? [
              chart.author
                  ? `${chart.author}${
                        chart.authorLevel
                            ? ` ${t("discovery.chartAuthorLevel", { level: chart.authorLevel })}`
                            : ""
                    }`
                  : null,
              chart.extracted ? t("discovery.chartExtracted") : null,
              chart.publishedAt
                  ? t("discovery.chartPublished", {
                        date: formatPublished(chart.publishedAt, locale),
                    })
                  : null,
          ].filter(Boolean)
        : [];
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
                    {meta.length ? (
                        <span className="nl-metadata nl-muted">
                            {meta.join(" · ")}
                        </span>
                    ) : null}
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

/** 채보 줄 스켈레톤 — 같은 줄 틀에 자켓 · 이름 · 아티스트 · 메타 · 난이도 칩 */
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
                    <SkeletonText className="nl-metadata" width="m" />
                </span>
                <span className="nl-chart-chip nl-skeleton" />
            </span>
        </div>
    );
}
