"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import StackedBar from "@/components/ui/stackedBar";
import {
    PROFILE_TIER_KEYS,
    type ProfileLevelRow,
    type ProfileTierKey,
} from "@/features/profile/schemas/profileStatsSchema";

type Difficulty = "all" | "normal" | "hard" | "expert" | "real";

const DIFFICULTIES = [
    ["normal", "N"],
    ["hard", "H"],
    ["expert", "EX"],
    ["real", "R"],
] as const;
/** 칸 색 = 등급 색(랭크 분포와 같음, 2026-09-26 C2a · L1). 고른 칸 밖은 흐린 회색, 「안 함」 은 트랙 면 그대로 */
const NONE = "var(--nl-surface-raised)";
const DIMMED = "var(--nl-content-disabled)";
const TIER_COLORS: Record<ProfileTierKey, string> = {
    pianist: "var(--nl-score-goal-pianist)",
    fc: "var(--nl-achievement-full-combo)",
    S: "var(--nl-score-goal-s)",
    "A+": "var(--nl-score-grade-a-plus)",
    A: "var(--nl-score-grade-a)",
    B: "var(--nl-score-grade-b)",
};

const LOW_LEVEL_MAX = 8;

/** 전체 = NORMAL · HARD · EXPERT 를 레벨마다 합치고(1–8 은 한 줄) REAL 은 따로(「REAL 3」), 난이도를 고르면 그 난이도의 레벨만 */
export function profileLevelRows(
    levels: readonly ProfileLevelRow[],
    difficulty: Difficulty
) {
    const rows = new Map<string, ProfileLevelRow & { label: string }>();
    for (const row of levels) {
        if (difficulty !== "all" && row.difficulty !== difficulty) continue;
        const real = row.difficulty === "real";
        // 전체는 낮은 레벨(1–8)을 한 줄로 묶는다 — 레벨마다 한 줄이면 15줄이라 옆 구역보다 길어져서(2026-09-26 D4)
        const low = difficulty === "all" && !real && row.level <= LOW_LEVEL_MAX;
        const key = low
            ? "low"
            : difficulty === "all" && !real
              ? `${row.level}`
              : `${row.difficulty}:${row.level}`;
        const label = low
            ? `1–${LOW_LEVEL_MAX}`
            : difficulty === "all" && real
              ? `REAL ${row.level}`
              : `${row.level}`;
        const current = rows.get(key);
        if (!current) {
            rows.set(key, { ...row, tiers: { ...row.tiers }, label });
            continue;
        }
        current.total += row.total;
        for (const tier of PROFILE_TIER_KEYS)
            current.tiers[tier] += row.tiers[tier];
    }
    return [...rows.values()];
}

/**
 * 레벨별 달성(2026-09-26 R2 · L1) — 레벨마다 한 막대(`StackedBar`): 채보마다 가장 높은 한 칸(Pianist → FC → S → A+ → A → B 이하),
 * 칠하지 않은 트랙 = 안 함. 범례 항목을 누르면 그 칸만 제 색 · 나머지는 흐린 회색이 되고 오른쪽 % 가 그 칸의 비율(한 번 더 누르면 풀림),
 * 고르지 않았으면 % = 여섯 칸을 합친 비율(친 채보). 개요 옆 열은 요약(9 이상 + REAL, 제목 줄 오른쪽 끝 「모두 보기」 = 통계 탭),
 * 통계 탭은 전체 + 난이도 세그먼트
 */
export default function ProfileLevels({
    userId,
    levels,
    variant,
}: {
    userId: number;
    levels: readonly ProfileLevelRow[];
    variant: "summary" | "full";
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const [difficulty, setDifficulty] = useState<Difficulty>("all");
    const [selected, setSelected] = useState<ProfileTierKey | null>(null);
    const rows = profileLevelRows(
        levels,
        variant === "full" ? difficulty : "all"
    ).filter(
        (row) =>
            variant === "full" || row.difficulty === "real" || row.level >= 9
    );
    const label = (key: ProfileTierKey) =>
        key === "pianist"
            ? "Pianist"
            : key === "fc"
              ? t("profile.fullComboShort")
              : key === "B"
                ? t("profile.levels.rankLow")
                : key;
    const percent = (value: number, total: number) =>
        `${(total ? Math.round((value / total) * 100) : 0).toLocaleString(locale)}%`;
    const played = (row: ProfileLevelRow) =>
        PROFILE_TIER_KEYS.reduce((sum, key) => sum + row.tiers[key], 0);
    const pageHref = href(`/profile/${userId}/stats`);
    return (
        <section
            className="nl-profile-section nl-profile-levels"
            data-variant={variant}
            aria-labelledby={`profile-levels-${variant}`}
        >
            <div className="nl-heading-row">
                <h2
                    id={`profile-levels-${variant}`}
                    className="nl-section-title"
                >
                    {t("profile.levels.title")}
                </h2>
                {variant === "summary" ? (
                    <Link
                        href={pageHref}
                        className="nl-heading-link nl-control"
                    >
                        {t("achievement.all")}
                        <ChevronRight aria-hidden />
                    </Link>
                ) : null}
            </div>
            {variant === "full" ? (
                <SegmentedControl
                    size="sm"
                    className="nl-profile-levels__difficulty"
                    label={t("profile.levels.difficultyLabel")}
                    value={difficulty}
                    onValueChange={setDifficulty}
                    options={[
                        { value: "all", label: t("profile.all") },
                        ...DIFFICULTIES.map(([value, short]) => ({
                            value,
                            label: (
                                <>
                                    <span className="nl-profile-levels__full">
                                        {value.toUpperCase()}
                                    </span>
                                    <span
                                        className="nl-profile-levels__short"
                                        aria-hidden
                                    >
                                        {short}
                                    </span>
                                </>
                            ),
                        })),
                    ]}
                />
            ) : null}
            <StackedBar
                rows={rows.map((row) => ({
                    key: `${row.difficulty}:${row.level}`,
                    label: row.label,
                    segments: [
                        ...PROFILE_TIER_KEYS.map((key) => ({
                            key,
                            value: row.tiers[key],
                            color:
                                selected === null || selected === key
                                    ? TIER_COLORS[key]
                                    : DIMMED,
                        })),
                        {
                            key: "none",
                            value: Math.max(0, row.total - played(row)),
                            color: NONE,
                        },
                    ],
                    value: percent(
                        selected ? row.tiers[selected] : played(row),
                        row.total
                    ),
                }))}
            />
            {/* 범례 = 칸 강조 전환(누르는 버튼, 고른 항목은 글자가 진해진다) + 지금 % 가 무엇인지 */}
            <div
                className="nl-profile-legend nl-metadata nl-muted"
                role="group"
                aria-label={t("profile.levels.legendLabel")}
            >
                {PROFILE_TIER_KEYS.map((key) => (
                    <button
                        key={key}
                        type="button"
                        className="nl-profile-legend__item"
                        aria-pressed={selected === key}
                        onClick={() =>
                            setSelected((current) =>
                                current === key ? null : key
                            )
                        }
                    >
                        <i
                            aria-hidden
                            style={{ background: TIER_COLORS[key] }}
                        />
                        {label(key)}
                    </button>
                ))}
                <span>
                    {selected
                        ? t("profile.levels.valueTier", {
                              name: label(selected),
                          })
                        : t("profile.levels.valuePlayed")}
                </span>
            </div>
            {/* 막대는 화면 읽기에서 숨기고 줄마다 수를 글로 */}
            <ul className="sr-only">
                {rows.map((row) => (
                    <li key={`${row.difficulty}:${row.level}`}>
                        {t("profile.levels.rowSummary", {
                            level: row.label,
                            parts: [
                                ...PROFILE_TIER_KEYS.map(
                                    (key) => `${label(key)} ${row.tiers[key]}`
                                ),
                                `${t("profile.levels.none")} ${Math.max(0, row.total - played(row))}`,
                            ].join(", "),
                            total: row.total,
                        })}
                    </li>
                ))}
            </ul>
        </section>
    );
}
