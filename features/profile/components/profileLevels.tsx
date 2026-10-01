"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import StackedBar from "@/components/ui/stackedBar";
import { tierValueColor } from "@/lib/music/tierValueColor";
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
export const PROFILE_TIER_COLORS: Record<ProfileTierKey, string> = {
    pianist: "var(--nl-score-goal-pianist)",
    fc: "var(--nl-achievement-full-combo)",
    S: "var(--nl-score-goal-s)",
    "A+": "var(--nl-score-grade-a-plus)",
    A: "var(--nl-score-grade-a)",
    B: "var(--nl-score-grade-b)",
};

const LOW_LEVEL_MAX = 8;

type Translate = ReturnType<typeof useTranslations>;

/** 범례 · 화면 읽기 글의 칸 이름 — 스켈레톤(profileLoading)도 같은 글자를 쓴다 */
export function profileTierLabel(key: ProfileTierKey, t: Translate) {
    return key === "pianist"
        ? "Pianist"
        : key === "fc"
          ? t("profile.fullComboShort")
          : key === "B"
            ? t("profile.levels.rankLow")
            : key;
}

/** 통계 탭 난이도 세그먼트 칸 — 난이도 색 글자, 고른 칸은 기본 글자색(세그먼트 공용 규칙) */
export function profileLevelDifficultyOptions(t: Translate) {
    return [
        { value: "all" as Difficulty, label: t("profile.all") },
        ...DIFFICULTIES.map(([value, short]) => ({
            value: value as Difficulty,
            label: (
                <span className={`nl-level--${value}`}>
                    <span className="nl-profile-levels__full">
                        {value.toUpperCase()}
                    </span>
                    <span className="nl-profile-levels__short" aria-hidden>
                        {short}
                    </span>
                </span>
            ),
        })),
    ];
}

type ProfileLevelGroup = ProfileLevelRow & {
    label: string;
    /** 여러 레벨을 묶은 줄(「1–8」) — 레벨 색이 하나로 정해지지 않는다 */
    grouped: boolean;
};

/**
 * 전체 = NORMAL · HARD · EXPERT 를 레벨마다 합치고(1–8 은 한 줄, `expanded` 면 레벨마다) REAL 은 따로(「REAL 3」),
 * 난이도를 고르면 그 난이도의 레벨만
 */
export function profileLevelRows(
    levels: readonly ProfileLevelRow[],
    difficulty: Difficulty,
    expanded = false
) {
    const rows = new Map<string, ProfileLevelGroup>();
    for (const row of levels) {
        if (difficulty !== "all" && row.difficulty !== difficulty) continue;
        const real = row.difficulty === "real";
        // 전체는 낮은 레벨(1–8)을 한 줄로 묶는다 — 레벨마다 한 줄이면 15줄이라 옆 구역보다 길어져서(2026-09-26 D4). 「전체 레벨 보기」 로 펼친다(2026-09-30)
        const low =
            difficulty === "all" &&
            !expanded &&
            !real &&
            row.level <= LOW_LEVEL_MAX;
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
            rows.set(key, {
                ...row,
                tiers: { ...row.tiers },
                label,
                grouped: low,
            });
            continue;
        }
        current.total += row.total;
        for (const tier of PROFILE_TIER_KEYS)
            current.tiers[tier] += row.tiers[tier];
    }
    // 묶음 → 레벨 오름차순 → REAL (입력 순서와 무관하게)
    const order = (row: ProfileLevelGroup) =>
        row.grouped
            ? 0
            : row.difficulty === "real"
              ? 100 + row.level
              : row.level;
    return [...rows.values()].sort((a, b) => order(a) - order(b));
}

/** 레벨 글자 색 = 레벨 1–12 는 서열 값 색(악곡 상세 「공식 레벨」 과 같은 색), REAL 1–3 은 난이도 Real 보라(2026-09-30 사용자). 묶은 줄(「1–8」)은 색이 하나로 정해지지 않아 막대 기본 subdued(2026-10-01 D1) */
const levelColor = (row: ProfileLevelGroup) =>
    row.grouped
        ? undefined
        : row.difficulty === "real"
          ? "var(--nl-difficulty-text-real)"
          : tierValueColor(row.level);

/**
 * 레벨별 달성(2026-09-26 R2 · L1) — 레벨마다 한 막대(`StackedBar`): 채보마다 가장 높은 한 칸(Pianist → FC → S → A+ → A → B 이하),
 * 칠하지 않은 트랙 = 안 함. 범례 항목을 누르면 그 칸만 제 색 · 나머지는 흐린 회색이 되고 오른쪽 % 가 그 칸의 비율(한 번 더 누르면 풀림),
 * 고르지 않았으면 % = 여섯 칸을 합친 비율(친 채보). 개요 옆 열은 요약(「1–8」 묶음 + 9 이상 + REAL, 제목 줄 오른쪽 끝 「모두 보기」 = 통계 탭),
 * 통계 탭은 전체 + 난이도 세그먼트. 「전체 레벨 보기」 를 누르면 1–12 + REAL 을 레벨마다(랭크 분포의 펼치기와 같은 버튼, 2026-09-30)
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
    const [expanded, setExpanded] = useState(false);
    const shownDifficulty = variant === "full" ? difficulty : "all";
    // 개요 요약도 묶음 줄(「1–8」)은 남긴다 — 낮은 레벨을 통째로 빼면 달성이 있는데 없는 것처럼 보인다(2026-10-01 사용자)
    const rows = profileLevelRows(levels, shownDifficulty, expanded).filter(
        (row) =>
            variant === "full" ||
            expanded ||
            row.grouped ||
            row.difficulty === "real" ||
            row.level >= 9
    );
    const listId = `profile-levels-${variant}-rows`;
    const label = (key: ProfileTierKey) => profileTierLabel(key, t);
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
                    options={profileLevelDifficultyOptions(t)}
                />
            ) : null}
            <StackedBar
                rows={rows.map((row) => ({
                    key: `${row.difficulty}:${row.level}`,
                    label: row.label,
                    labelColor: levelColor(row),
                    segments: [
                        ...PROFILE_TIER_KEYS.map((key) => ({
                            key,
                            value: row.tiers[key],
                            color:
                                selected === null || selected === key
                                    ? PROFILE_TIER_COLORS[key]
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
            {/* 난이도를 고르면 이미 레벨마다라 펼칠 것이 없다 */}
            {shownDifficulty === "all" ? (
                <button
                    type="button"
                    className="nl-profile-disclosure nl-control"
                    aria-expanded={expanded}
                    aria-controls={listId}
                    onClick={() => setExpanded((value) => !value)}
                >
                    {t(expanded ? "profile.collapse" : "profile.showAllLevels")}
                    <ChevronDown aria-hidden />
                </button>
            ) : null}
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
                            style={{ background: PROFILE_TIER_COLORS[key] }}
                        />
                        {label(key)}
                    </button>
                ))}
            </div>
            {/* 막대는 화면 읽기에서 숨기고 줄마다 수를 글로 */}
            <ul id={listId} className="sr-only">
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
