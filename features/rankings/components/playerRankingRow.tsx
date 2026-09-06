import Link from "next/link";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Avatar from "@/components/ui/avatar";
import CountryMarker from "@/components/ui/countryMarker";
import ExamBadge from "@/components/ui/examBadge";
import { localizePath } from "@/lib/i18n/routing";
import type {
    GlobalRankingQuery,
    GlobalRankingRow,
} from "@/features/rankings/schemas/globalRankingSchema";

export default function PlayerRankingRow({
    row,
    query,
    current,
}: {
    row: GlobalRankingRow;
    query: GlobalRankingQuery;
    current: boolean;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const name = row.username || t("common.unknownUser");
    return (
        <li
            id={`ranking-player-${row.id}`}
            className="nl-player-row"
            value={row.rank}
            data-current={current}
            tabIndex={-1}
            aria-label={current ? t("rankings.myRank") : undefined}
        >
            <span
                className={`nl-player-row__rank ${row.rank <= 3 ? "nl-emphasis-label" : "nl-metric-value"}`}
            >
                {row.rank.toLocaleString(locale)}
            </span>
            <Avatar src={row.avatar} fallbackName={row.username} size={32} />
            <div className="nl-player-row__identity">
                <div className="nl-player-row__name">
                    <Link
                        href={`${localizePath(`/profile/${row.id}`, locale)}?mode=${query.mode}`}
                        className="nl-player-row__link nl-link nl-control"
                        title={name}
                    >
                        {name}
                    </Link>
                    <CountryMarker country={row.country} />
                </div>
                <ExamBadge mode={query.mode} exam={row.exam} />
            </div>
            <span className="nl-player-row__value nl-metric-value">
                {row.value.toLocaleString(locale)}{" "}
                {query.metric === "rating" ? "pt" : "Grd"}
            </span>
        </li>
    );
}
