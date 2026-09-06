import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { foundationButtonClass } from "@/components/ui/Button";
import { localizePath } from "@/lib/i18n/routing";
import type { GlobalRankingPayload } from "@/features/rankings/schemas/globalRankingSchema";

export default function RankingPersonalPosition({
    data,
    returnTo,
    pageHref,
    onMyPosition,
    busy,
}: {
    data: GlobalRankingPayload;
    returnTo: string;
    pageHref: (page: number) => string;
    onMyPosition: (page: number, id: number) => void;
    busy: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    if (!data.totalCount || data.rows.some((row) => row.id === data.viewerId))
        return null;
    if (!data.viewerId)
        return (
            <div className="nl-ranking-login">
                <p className="nl-body-secondary nl-muted">
                    {t("rankings.loginPrompt")}
                </p>
                <a
                    className={foundationButtonClass({ variant: "ghost" })}
                    href={`${localizePath("/login", locale)}?returnTo=${encodeURIComponent(returnTo)}`}
                >
                    {t("common.login")}
                </a>
            </div>
        );
    const mine = data.currentUser;
    if (!mine)
        return (
            <p className="nl-ranking-personal nl-ranking-personal--unavailable nl-body-secondary nl-muted">
                {t("rankings.myUnavailable")}
            </p>
        );
    return (
        <div className="nl-ranking-personal">
            <p className="nl-ranking-personal__summary nl-body-secondary">
                <span>{t("rankings.myRank")}</span>
                <span className="nl-muted">
                    {mine.rank.toLocaleString(locale)} /{" "}
                    {data.totalCount.toLocaleString(locale)}
                </span>
            </p>
            <a
                className={foundationButtonClass({ variant: "secondary" })}
                href={`${pageHref(mine.page)}#ranking-player-${mine.id}`}
                aria-disabled={busy || undefined}
                onClick={(event) => {
                    if (busy) {
                        event.preventDefault();
                        return;
                    }
                    if (
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                    )
                        return;
                    event.preventDefault();
                    onMyPosition(mine.page, mine.id);
                }}
            >
                {t("rankings.myPosition")}
            </a>
        </div>
    );
}
