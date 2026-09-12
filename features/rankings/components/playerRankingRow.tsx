import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Avatar from "@/components/ui/avatar";
import CountryMarker from "@/components/ui/countryMarker";
import ExamBadge, { isExamGrade } from "@/components/ui/examBadge";
import { localizePath } from "@/lib/i18n/routing";
import type {
    GlobalRankingQuery,
    GlobalRankingRow,
} from "@/features/rankings/schemas/globalRankingSchema";

// 명판은 이름 칸에 다 들어가면 BASIC·RECITAL, 넘치면 먼저 B·R 로 줄이고
// 그래도 넘치면 닉네임을 말줄임한다. 행마다 실제 폭을 잰다.
function useBadgeLabelFit() {
    const ref = useRef<HTMLDivElement>(null);
    const [label, setLabel] = useState<"full" | "short">("short");
    useLayoutEffect(() => {
        const identity = ref.current;
        const badge = identity?.querySelector<HTMLElement>(".nl-exam-badge");
        if (!identity || !badge) return;
        const measure = () => {
            const name = identity.querySelector<HTMLElement>(
                ".nl-player-row__name"
            );
            const link = identity.querySelector<HTMLElement>(
                ".nl-player-row__link"
            );
            const full = badge.querySelector<HTMLElement>(
                ".nl-exam-badge__full"
            );
            const short = badge.querySelector<HTMLElement>(
                ".nl-exam-badge__short"
            );
            if (!name || !link || !full || !short) return;
            const shown = identity.dataset.examLabel === "full" ? full : short;
            const badgeFull =
                badge.getBoundingClientRect().width -
                shown.getBoundingClientRect().width +
                full.getBoundingClientRect().width;
            // 이름 묶음의 자연 폭 = 국기 + 간격 + 닉네임 전체 글자 폭(말줄임 전)
            const nameFull =
                name.getBoundingClientRect().width -
                link.getBoundingClientRect().width +
                link.scrollWidth;
            const gap = parseFloat(getComputedStyle(identity).columnGap) || 0;
            setLabel(
                nameFull + gap + badgeFull <= identity.clientWidth
                    ? "full"
                    : "short"
            );
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(identity);
        void document.fonts?.ready.then(measure);
        return () => observer.disconnect();
    }, []);
    return { ref, label };
}

// 순위 · 아바타 · 국기 · 이름 · 명판 · 값.
// 국기를 이름 앞에 두어 국기 열과 이름 시작선이 행마다 맞고, 명판은 이름 꼬리표로 붙는다.
// 명판은 탭이 고른 모드의 급수만 보여 준다.
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
    const { ref: identityRef, label: badgeLabel } = useBadgeLabelFit();
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
                data-podium={row.rank <= 3 ? row.rank : undefined}
            >
                {row.rank.toLocaleString(locale)}
            </span>
            <Avatar src={row.avatar} fallbackName={row.username} size={32} />
            <div
                ref={identityRef}
                className="nl-player-row__identity"
                data-exam-label={badgeLabel}
            >
                <div className="nl-player-row__name">
                    <CountryMarker country={row.country} />
                    <Link
                        href={`${localizePath(`/profile/${row.id}`, locale)}?mode=${query.mode}`}
                        className="nl-player-row__link nl-link"
                        title={name}
                    >
                        {name}
                    </Link>
                </div>
                {isExamGrade(row.exam) ? (
                    <ExamBadge mode={query.mode} exam={row.exam} />
                ) : null}
            </div>
            {/* 단위는 머리글(공식 Grd · NosLog 레이팅)이 말한다 — 화면에서는 빼고 낭독용으로만 둔다 */}
            <span className="nl-player-row__value nl-metric-value">
                {row.value.toLocaleString(locale)}
                <span className="sr-only">
                    {" "}
                    {query.metric === "rating" ? "pt" : "Grd"}
                </span>
            </span>
        </li>
    );
}
