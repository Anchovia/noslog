"use client";

import Image from "next/image";
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    rankAssetNames,
    rankDisplayName,
} from "@/components/music/musicDetailConfig";
import Avatar from "@/components/ui/avatar";
import CountryMarker from "@/components/ui/countryMarker";
import type { ChartRankingRow } from "@/features/music/schemas/chartRankingSchema";
import { SkeletonText } from "@/components/ui/skeleton";

/** 등급 메달 — 순위표는 18(공용 순위표 규격 그대로), 악곡 상세 핀 창은 아이콘 규격 16 */
export function ScoreGrade({
    rank,
    size = 18,
}: {
    rank: string;
    size?: 16 | 18;
}) {
    const t = useTranslations();
    const asset = rankAssetNames[rank.toUpperCase()];
    return (
        <span
            className="nl-score-grade"
            data-size={size === 16 ? "small" : undefined}
        >
            {asset ? (
                <Image
                    src={`/grade/grade_${asset}.png`}
                    alt={t("music.record.rankLabel", {
                        rank: rankDisplayName(rank),
                    })}
                    width={size}
                    height={size}
                />
            ) : (
                <span className="sr-only">{rank || "—"}</span>
            )}
        </span>
    );
}

export function FullComboMark({ fcType }: { fcType: number }) {
    return (
        <span className="nl-full-combo-slot">
            {fcType >= 2 ? (
                <span className="nl-full-combo nl-metadata">FC</span>
            ) : null}
        </span>
    );
}

// 유저 랭킹 페이지와 같은 행(nl-player-row) — 순위 · 아바타 · 국기 · 이름, 오른쪽 끝은 등급 메달 · 점수 · FC.
// 검정 명판은 넣지 않는다 — 곡 순위는 모드와 무관하고, 오른쪽 끝이 넓어 이름 칸이 모자라다
function ChartLeaderboardRow({
    row,
    current,
}: {
    row: ChartRankingRow;
    current: boolean;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const locale = useLocale();
    const name = row.user.username ?? t("ranking.unknownPlayer");
    const language = /\p{Script=Hangul}/u.test(name)
        ? "ko"
        : /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(name)
          ? "ja"
          : "en";
    const pianist = row.fc_type === 3 || row.score >= 1_000_000;
    return (
        <li
            id={`chart-rank-${row.user_id}`}
            className="nl-player-row"
            value={row.position}
            data-current={current || undefined}
        >
            <span
                className={`nl-player-row__rank ${row.position <= 3 ? "nl-emphasis-label" : "nl-metric-value"}`}
                data-podium={row.position <= 3 ? row.position : undefined}
            >
                {row.position.toLocaleString(locale)}
            </span>
            <Avatar
                src={row.user.avatar}
                fallbackName={row.user.username}
                size={32}
            />
            <div className="nl-player-row__identity">
                <div className="nl-player-row__name">
                    <CountryMarker country={row.user.country ?? ""} />
                    <Link
                        href={href(`/profile/${row.user_id}`)}
                        className="nl-player-row__link nl-link"
                        lang={language}
                        title={name}
                    >
                        {name}
                    </Link>
                    {current ? (
                        <span className="sr-only">{t("rankings.myRank")}</span>
                    ) : null}
                </div>
            </div>
            <span className="nl-chart-leaderboard__result">
                <ScoreGrade rank={pianist ? "P" : row.rank} />
                <span className="nl-player-row__value nl-metric-value">
                    {row.score.toLocaleString(locale)}
                </span>
                <FullComboMark
                    fcType={row.score >= 1_000_000 ? 3 : row.fc_type}
                />
            </span>
        </li>
    );
}

/**
 * 곡 순위 줄 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 줄 틀(48 · 순위 32 · 사진 32 · 이름 · 등급 · 점수 · FC 칸)
 */
function ChartLeaderboardRowSkeleton() {
    return (
        <li className="nl-player-row" aria-hidden="true">
            <span className="nl-player-row__rank nl-metric-value">
                <SkeletonText className="nl-metric-value" sample="00" />
            </span>
            <span className="nl-avatar nl-skeleton" />
            <div className="nl-player-row__identity">
                <SkeletonText className="nl-player-row__link" width="m" />
            </div>
            <span className="nl-chart-leaderboard__result">
                <span className="nl-score-grade nl-skeleton" />
                <span className="nl-player-row__value nl-metric-value">
                    <SkeletonText
                        className="nl-metric-value"
                        sample="1,000,000"
                    />
                </span>
                <FullComboMark fcType={0} />
            </span>
        </li>
    );
}

export default function ChartLeaderboard({
    rows,
    currentUserId,
    emptyMessage,
    skeletonRows,
}: {
    rows: ChartRankingRow[];
    currentUserId?: number;
    /** 기록이 0명일 때 머리 줄 아래 줄 한 칸(48) 가운데 안내 (2026-09-19 사용자) */
    emptyMessage?: string;
    /** 불러오는 동안 같은 줄 틀의 스켈레톤 N줄 */
    skeletonRows?: number;
}) {
    const t = useTranslations();
    return (
        <div className="nl-chart-leaderboard">
            <div className="nl-ranking-head nl-metadata nl-muted" aria-hidden>
                <span className="nl-ranking-head__rank">
                    {t("rankings.column.rank")}
                </span>
                <span className="nl-ranking-head__player">
                    {t("rankings.column.player")}
                </span>
                <span className="nl-ranking-head__value">
                    <span>{t("music.trend.score")}</span>
                </span>
            </div>
            {skeletonRows ? (
                <ol className="nl-global-ranking-list" aria-hidden="true">
                    {Array.from({ length: skeletonRows }, (_, index) => (
                        <ChartLeaderboardRowSkeleton key={index} />
                    ))}
                </ol>
            ) : !rows.length && emptyMessage ? (
                <p className="nl-chart-leaderboard__empty nl-body-secondary nl-muted">
                    {emptyMessage}
                </p>
            ) : (
                <ol
                    className="nl-global-ranking-list"
                    aria-label={t("detail.ranking")}
                >
                    {rows.map((row) => (
                        <ChartLeaderboardRow
                            key={row.user_id}
                            row={row}
                            current={row.user_id === currentUserId}
                        />
                    ))}
                </ol>
            )}
        </div>
    );
}
