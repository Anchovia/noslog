"use client";

import Image from "next/image";
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { rankAssetNames } from "@/components/music/musicDetailConfig";
import Avatar from "@/components/ui/avatar";
import type { ChartRankingRow } from "@/features/music/schemas/chartRankingSchema";

export function ScoreGrade({ rank }: { rank: string }) {
    const t = useTranslations();
    const asset = rankAssetNames[rank.toUpperCase()];
    return (
        <span className="nl-score-grade">
            {asset ? (
                <Image
                    src={`/grade/grade_${asset}.png`}
                    alt={t("music.record.rankLabel", { rank })}
                    width={18}
                    height={18}
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

export default function ChartLeaderboard({
    rows,
    currentUserId,
}: {
    rows: ChartRankingRow[];
    currentUserId?: number;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const locale = useLocale();
    return (
        <div className="nl-chart-leaderboard">
            <table aria-label={t("detail.ranking")}>
                <thead>
                    <tr className="nl-chart-leaderboard__row nl-chart-leaderboard__header nl-metadata nl-muted">
                        <th scope="col">{t("profile.rank")}</th>
                        <th scope="col">
                            <span className="sr-only">
                                {t("ranking.avatar")}
                            </span>
                        </th>
                        <th scope="col">{t("ranking.player")}</th>
                        <th scope="col">
                            <span className="sr-only">
                                {t("ranking.grade")}
                            </span>
                        </th>
                        <th scope="col">{t("music.trend.score")}</th>
                        <th scope="col">
                            <span className="sr-only">Full Combo</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        const current = row.user_id === currentUserId;
                        const name =
                            row.user.username ?? t("ranking.unknownPlayer");
                        const language = /\p{Script=Hangul}/u.test(name)
                            ? "ko"
                            : /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(
                                    name
                                )
                              ? "ja"
                              : "en";
                        return (
                            <tr
                                key={row.user_id}
                                className="nl-chart-leaderboard__row"
                                data-current={current || undefined}
                            >
                                <td className="nl-metric-value nl-muted">
                                    {row.position.toLocaleString(locale)}
                                </td>
                                <td>
                                    <Avatar size={24} src={row.user.avatar} />
                                </td>
                                <th
                                    scope="row"
                                    className="nl-chart-leaderboard__player"
                                >
                                    <Link
                                        className={
                                            current
                                                ? "nl-emphasis-label nl-link"
                                                : "nl-body-secondary nl-link"
                                        }
                                        lang={language}
                                        href={href(`/profile/${row.user_id}`)}
                                    >
                                        {name}
                                    </Link>
                                    {current ? (
                                        <span className="nl-my-rank-badge nl-metadata">
                                            {t("rankings.myRank")}
                                        </span>
                                    ) : null}
                                </th>
                                <td>
                                    <ScoreGrade
                                        rank={
                                            row.fc_type === 3 ||
                                            row.score >= 1_000_000
                                                ? "P"
                                                : row.rank
                                        }
                                    />
                                </td>
                                <td className="nl-metric-value">
                                    {row.score.toLocaleString(locale)}
                                </td>
                                <td>
                                    <FullComboMark
                                        fcType={
                                            row.score >= 1_000_000
                                                ? 3
                                                : row.fc_type
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
