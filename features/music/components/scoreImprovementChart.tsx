"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { ScoreTrendPoint } from "@/components/music/musicDetailTypes";
import LineChart from "@/components/ui/lineChart";
import { formatDaysAgo } from "@/lib/music/scoreTrend";

export default function ScoreImprovementChart({
    points,
}: {
    points: ScoreTrendPoint[];
}) {
    const t = useTranslations();
    const locale = useLocale();
    const values = points.map((point) => point.score);
    const minimum = Math.floor(Math.min(...values) / 10_000) * 10_000;
    const maximum = Math.ceil(Math.max(...values) / 10_000) * 10_000;
    return (
        <LineChart
            points={points.map((point) => {
                const dimension = point.play_time
                    .split(/[T ]/)[0]
                    .replaceAll("/", "-")
                    .replaceAll(".", "-");
                return {
                    id: point.id,
                    dimension,
                    shortDimension: dimension.slice(5),
                    value: point.score,
                    detail: formatDaysAgo(dimension, locale),
                };
            })}
            label={t("music.record.bestScore")}
            dimensionLabel={t("record.date")}
            valueLabel={t("music.record.bestScore")}
            formatValue={(value) =>
                t("music.record.points", {
                    count: value.toLocaleString(locale),
                })
            }
            formatAxis={(value) => `${value / 1000}k`}
            domain={
                values.length
                    ? [minimum, maximum > minimum ? maximum : minimum + 10_000]
                    : [0, 1]
            }
            // 점이 없으면 빈 틀(위 · 아래 선) + 가운데 「기록 없음」 (선 그래프 규칙)
            emptyMessage={t("music.record.noRecord")}
            keepPlotGeometry
            // 바닥선만 · 주황 선 — 프로필 성장 추이와 같은 모양 (2026-09-19 G1 · C1)
            baselineOnly
            tone="growth"
            // 툴팁 = 「956,666점」 위 · 「N일 전」 아래 — osu! 방식 (2026-09-17)
            tooltipValueLabel={false}
            // 점마다 날짜 · 점수는 툴팁이 말하므로 표는 화면 읽기용으로만 (2026-09-16)
            tableVisibility="screen-reader"
        />
    );
}
