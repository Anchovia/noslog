import { useTranslations } from "@/components/i18n/localeProvider";
import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingRow,
} from "@/lib/rankings";
import RankingRow from "./userRankingRow";

interface UserRankingListProps {
    mode: UserRankingMode;
    metric: UserRankingMetric;
    rows: UserRankingRow[];
}

export default function UserRankingList({
    mode,
    metric,
    rows,
}: UserRankingListProps) {
    const t = useTranslations();
    return (
        <section className="bg-surface rounded-card overflow-hidden">
            {rows.length > 0 ? (
                <ol>
                    {rows.map((row) => (
                        <RankingRow
                            key={row.id}
                            mode={mode}
                            metric={metric}
                            row={row}
                        />
                    ))}
                </ol>
            ) : (
                <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                    {t("rankings.empty")}
                </div>
            )}
        </section>
    );
}
