"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { ScoreTrendPoint } from "@/components/music/musicDetailTypes";
import LineChart from "@/components/ui/lineChart";

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
            emptyMessage={t("record.empty")}
            singleMessage={t("record.single")}
        />
    );
}
