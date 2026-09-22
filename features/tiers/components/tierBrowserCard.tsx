"use client";

import { SkeletonText } from "@/components/ui/skeleton";
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { serializeTierBrowserQuery } from "@/features/tiers/schemas/tierBrowserSchema";
import { isTierGoalAchieved } from "@/lib/tiers";
import type {
    TierBrowserEntry,
    TierBrowserQuery,
    TierBrowserStrip,
} from "@/features/tiers/schemas/tierBrowserSchema";

// 375 미만 4열 카드(66)는 「Expert 10」 판을 못 담아 약칭 — 악곡 상세 난이도 선택과 같은 N · H · EX · R (2026-09-22)
const shortDifficulty: Record<string, string> = {
    Normal: "N",
    Hard: "H",
    Expert: "EX",
    Real: "R",
};

/**
 * 자켓 위 띠 값(2026-09-22 A) — 목록 보기 기여와 같은 형식(Grd 소수 둘째 · 레이팅 첫째 자리).
 * 고른 값이 없는 곡(미플레이 · 공식 Grd 미수집 · 상수 없음)은 띠 없음 — 다른 값으로 채우지 않는다
 */
export function tierStripValue(
    record: TierBrowserEntry["record"],
    strip: TierBrowserStrip,
    locale: string
) {
    const value =
        strip === "grade"
            ? record?.grade
            : strip === "rating"
              ? record?.rating
              : null;
    if (value === null || value === undefined) return null;
    const digits = strip === "grade" ? 2 : 1;
    return `+${value.toLocaleString(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })}`;
}

function useTierEntry(
    entry: TierBrowserEntry,
    query: TierBrowserQuery,
    signedIn: boolean
) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const { chart, record } = entry;
    const pianist = Boolean(
        record && (record.fc_type === 3 || record.score >= 1_000_000)
    );
    const fc = Boolean(record && record.fc_type >= 2 && !pianist);
    const score = record
        ? record.score.toLocaleString(locale)
        : t("tiers.unplayed");
    // 이 표 기준(S · 990k · Pianist)을 달성했는가 — 테두리와 점수가 그 표의 기준 색을 쓴다
    const goalAchieved = signedIn && isTierGoalAchieved(record, query.goal);
    // 테두리: 달성 + FC = 초록 → 기준 색 그라데이션 · 달성 = 기준 색(Pianist 는 퍼펙트라 FC 여도 기준 색 하나).
    // 달성 못 한 FC 는 테두리 없음(2026-09-17 사용자 결정)
    const achievement = goalAchieved ? (fc ? "goal-fc" : "goal") : undefined;
    const strip = signedIn ? tierStripValue(record, query.strip, locale) : null;
    const stripLabel =
        strip && query.strip !== "off"
            ? ` · ${t(query.strip === "grade" ? "rankings.metric.grade" : "rankings.metric.rating")} ${strip}`
            : "";
    const params = new URLSearchParams({
        tab: "tier",
        source: "tiers",
        mode: query.mode,
        goal: query.goal,
        returnTo: href(`/tiers?${serializeTierBrowserQuery(query)}`),
    });
    return {
        t,
        locale,
        chart,
        record,
        score,
        goalAchieved,
        achievement,
        strip,
        link: href(
            `/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}?${params}`
        ),
        label: `${chart.music.title} · ${chart.difficulty} ${chart.level} · ${t("detail.tier")}${signedIn ? ` · ${score}${pianist ? " · Pianist" : fc ? " · Full Combo" : ""}${goalAchieved ? ` · ${t("tiers.goalAchieved")}` : ""}` : ""}`,
        labelWithStrip: `${chart.music.title} · ${chart.difficulty} ${chart.level} · ${t("detail.tier")}${signedIn ? ` · ${score}${stripLabel}${pianist ? " · Pianist" : fc ? " · Full Combo" : ""}${goalAchieved ? ` · ${t("tiers.goalAchieved")}` : ""}` : ""}`,
    };
}

/**
 * 격자 보기 카드 — 자켓 1:1 · 오른쪽 아래 난이도 판 · 로그인하면 아래 점수(달성하면 기준 색),
 * 자켓 위 띠(공식 Grd · 레이팅, 2026-09-22 A) · 목표 미달성은 자켓 흑백(2026-09-22 B)
 */
export default function TierBrowserCard({
    entry,
    query,
    signedIn,
    pending,
}: {
    entry: TierBrowserEntry;
    query: TierBrowserQuery;
    signedIn: boolean;
    pending: boolean;
}) {
    const {
        chart,
        score,
        goalAchieved,
        achievement,
        strip,
        link,
        labelWithStrip,
    } = useTierEntry(entry, query, signedIn);
    return (
        <Link
            className="nl-tier-card"
            data-goal={query.goal}
            data-unachieved={(signedIn && !goalAchieved) || undefined}
            aria-disabled={pending || undefined}
            tabIndex={pending ? -1 : undefined}
            href={link}
            aria-label={labelWithStrip}
            onClick={(event) => {
                if (pending) event.preventDefault();
            }}
        >
            <MusicJacket
                appearance="foundation"
                {...chart.music}
                className="nl-tier-card__jacket"
            >
                {strip ? (
                    <span
                        className="nl-tier-card__strip nl-metadata"
                        aria-hidden
                    >
                        {strip}
                    </span>
                ) : null}
                <span
                    className="nl-tier-card__outline"
                    data-achievement={achievement}
                    aria-hidden
                />
                {/* 자켓 위에는 오른쪽 아래 난이도 판만 — 같은 구간에 한 곡의 여러 난이도가 있어도 구분되게.
                    등급 메달·FC 마크는 테두리와 점수 색이 대신한다 */}
                <span
                    className="nl-tier-card__difficulty nl-metadata"
                    data-difficulty={chart.difficulty.toLowerCase()}
                    aria-hidden
                >
                    <span
                        className="nl-tier-card__difficulty-name"
                        data-short={shortDifficulty[chart.difficulty]}
                    >
                        {chart.difficulty}
                    </span>{" "}
                    {chart.level}
                </span>
            </MusicJacket>
            {signedIn ? (
                <span
                    className="nl-tier-card__score nl-metric-value"
                    data-achieved={goalAchieved || undefined}
                >
                    {score}
                </span>
            ) : null}
        </Link>
    );
}

/**
 * 목록 보기 행(2026-09-22 B안) — 자켓 48(채보 발견 채보 묶음과 같은 크기 · 모서리 4) · 곡 이름 · 난이도,
 * 로그인하면 오른쪽에 점수(달성하면 기준 색)와 공식 Grd(없으면 NosLog 레이팅) 기여. 행 = 48 + 위아래 8, 아래 구분선
 */
export function TierBrowserRow({
    entry,
    query,
    signedIn,
    pending,
}: {
    entry: TierBrowserEntry;
    query: TierBrowserQuery;
    signedIn: boolean;
    pending: boolean;
}) {
    const {
        t,
        locale,
        chart,
        record,
        score,
        goalAchieved,
        achievement,
        link,
        label,
    } = useTierEntry(entry, query, signedIn);
    const contribution =
        record?.grade !== null && record?.grade !== undefined
            ? `${t("rankings.metric.grade")} +${record.grade.toLocaleString(
                  locale,
                  {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  }
              )}`
            : record?.rating !== null && record?.rating !== undefined
              ? `${t("rankings.metric.rating")} +${record.rating.toLocaleString(
                    locale,
                    {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                    }
                )}`
              : null;
    return (
        <Link
            className="nl-tier-row"
            data-goal={query.goal}
            data-unachieved={(signedIn && !goalAchieved) || undefined}
            aria-disabled={pending || undefined}
            tabIndex={pending ? -1 : undefined}
            href={link}
            aria-label={label}
            onClick={(event) => {
                if (pending) event.preventDefault();
            }}
        >
            <MusicJacket
                appearance="foundation"
                {...chart.music}
                className="nl-tier-row__jacket"
            >
                <span
                    className="nl-tier-card__outline"
                    data-achievement={achievement}
                    aria-hidden
                />
            </MusicJacket>
            <span className="nl-tier-row__name">
                <span className="nl-emphasis-label">{chart.music.title}</span>
                {/* 난이도명·레벨 모두 난이도 색 글자(DISC-45, 다른 결과 화면과 같은 nl-level-- 클래스) */}
                <span className="nl-metadata">
                    <span
                        className={`nl-level--${chart.difficulty.toLowerCase()}`}
                    >
                        {chart.difficulty} {chart.level}
                    </span>
                    {chart.music.localizedTitle ? (
                        <span className="nl-muted">
                            {" · "}
                            {chart.music.localizedTitle}
                        </span>
                    ) : null}
                </span>
            </span>
            {signedIn ? (
                <span className="nl-tier-row__record">
                    <span
                        className="nl-tier-card__score nl-metric-value"
                        data-achieved={goalAchieved || undefined}
                        data-unplayed={!record || undefined}
                    >
                        {score}
                    </span>
                    {contribution ? (
                        <span className="nl-metadata nl-muted">
                            {contribution}
                        </span>
                    ) : null}
                </span>
            ) : null}
        </Link>
    );
}

/**
 * 서열 카드 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 카드 틀(자켓 1:1 · 사이 4)에 자켓 · 점수 자리
 */
export function TierBrowserCardSkeleton({ signedIn }: { signedIn: boolean }) {
    return (
        <div className="nl-tier-card" aria-hidden="true">
            <span className="nl-tier-card__jacket nl-skeleton" />
            {signedIn ? (
                <SkeletonText className="nl-metric-value" width="m" />
            ) : null}
        </div>
    );
}

/** 목록 행 스켈레톤 — 같은 행 틀에 자켓 · 이름 · 난이도 · (로그인하면) 점수 · 기여 자리 */
export function TierBrowserRowSkeleton({ signedIn }: { signedIn: boolean }) {
    return (
        <div className="nl-tier-row" aria-hidden="true">
            <span className="nl-tier-row__jacket nl-skeleton" />
            <span className="nl-tier-row__name">
                <SkeletonText className="nl-emphasis-label" width="l" />
                <SkeletonText className="nl-metadata" width="s" />
            </span>
            {signedIn ? (
                <span className="nl-tier-row__record">
                    <SkeletonText
                        className="nl-metric-value"
                        sample="000,000"
                    />
                    <SkeletonText className="nl-metadata" sample="Grd +00.00" />
                </span>
            ) : null}
        </div>
    );
}
