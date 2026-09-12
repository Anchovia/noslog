import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { GlobalRankingPayload } from "@/features/rankings/schemas/globalRankingSchema";

// 내 행이 이 페이지에 없을 때만 나타나는 얇은 한 줄 — 내 순위와 그 페이지로 가는 버튼.
// 내 행이 보이면 행 배경이 이미 내 위치를 알려 주므로 아무것도 그리지 않는다.
export default function RankingPersonalPosition({
    data,
    pageHref,
    onMyPosition,
    busy,
}: {
    data: GlobalRankingPayload;
    pageHref: (page: number) => string;
    onMyPosition: (page: number, id: number) => void;
    busy: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    if (
        !data.totalCount ||
        !data.viewerId ||
        data.rows.some((row) => row.id === data.viewerId)
    )
        return null;
    const mine = data.currentUser;
    if (!mine)
        return (
            <p className="nl-ranking-personal nl-body-secondary nl-muted">
                {t("rankings.myUnavailable")}
            </p>
        );
    const rank = mine.rank.toLocaleString(locale);
    return (
        <div className="nl-ranking-personal nl-body-secondary">
            <span className="nl-muted">{t("rankings.myRank")}</span>
            {/* 순위 숫자가 곧 내 행으로 가는 링크라 따로 버튼을 두지 않는다 */}
            <a
                className="nl-ranking-personal__rank nl-link nl-text-link--underlined"
                href={`${pageHref(mine.page)}#ranking-player-${mine.id}`}
                aria-label={`${t("rankings.myPosition")} ${rank}`}
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
                {rank}
            </a>
            <span className="nl-muted">
                / {data.totalCount.toLocaleString(locale)}
            </span>
        </div>
    );
}
