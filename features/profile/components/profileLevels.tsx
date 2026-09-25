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
import type { ProfileLevelRow } from "@/features/profile/schemas/profileStatsSchema";

type View = "lamp" | "rank";
type Difficulty = "all" | "normal" | "hard" | "expert" | "real";

const DIFFICULTIES = [
    ["normal", "N"],
    ["hard", "H"],
    ["expert", "EX"],
    ["real", "R"],
] as const;
/** 칸 색 — 램프는 달성 색 + 차트 단일 색, 랭크는 차트 단계 색(높을수록 밝게). 「안 함」 은 트랙 면 그대로 */
const NONE = "var(--nl-surface-raised)";
const LAMP_COLORS = {
    pianist: "var(--nl-achievement-pianist)",
    fc: "var(--nl-achievement-full-combo)",
    clear: "var(--nl-local-data-single)",
    fail: "var(--nl-content-disabled)",
} as const;
const RANK_COLORS = {
    P: "var(--nl-local-data-bucket-6)",
    S: "var(--nl-local-data-bucket-5)",
    "A+": "var(--nl-local-data-bucket-4)",
    A: "var(--nl-local-data-bucket-3)",
    B: "var(--nl-local-data-bucket-2)",
} as const;

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
            rows.set(key, {
                ...row,
                lamp: { ...row.lamp },
                rank: { ...row.rank },
                label,
            });
            continue;
        }
        current.total += row.total;
        for (const lamp of Object.keys(row.lamp) as (keyof typeof row.lamp)[])
            current.lamp[lamp] += row.lamp[lamp];
        for (const rank of Object.keys(row.rank) as (keyof typeof row.rank)[])
            current.rank[rank] += row.rank[rank];
    }
    return [...rows.values()];
}

/**
 * 레벨별 달성(2026-09-26 R2) — 레벨마다 누적 막대(`StackedBar`) · 오른쪽 달성 비율. 램프(Pianist · FC · 클리어 · 실패 · 안 함) ↔
 * 랭크(P · S · A+ · A · B 이하 · 안 함) 전환. 개요 옆 열은 요약(9 이상 + REAL, 제목 옆 「모두 보기」 = 통계 탭),
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
    const [view, setView] = useState<View>("lamp");
    const [difficulty, setDifficulty] = useState<Difficulty>("all");
    const rows = profileLevelRows(
        levels,
        variant === "full" ? difficulty : "all"
    ).filter(
        (row) =>
            variant === "full" || row.difficulty === "real" || row.level >= 9
    );
    const keys =
        view === "lamp"
            ? (["pianist", "fc", "clear", "fail"] as const)
            : (["P", "S", "A+", "A", "B"] as const);
    const label = (key: (typeof keys)[number] | "none") =>
        key === "pianist"
            ? "Pianist"
            : key === "fc"
              ? t("profile.fullComboShort")
              : key === "clear" || key === "fail" || key === "none"
                ? t(`profile.levels.${key}`)
                : key === "B"
                  ? t("profile.levels.rankLow")
                  : key;
    const percent = (value: number, total: number) =>
        `${(total ? Math.round((value / total) * 100) : 0).toLocaleString(locale)}%`;
    const counts = (row: ProfileLevelRow) =>
        view === "lamp"
            ? (keys as readonly (keyof ProfileLevelRow["lamp"])[]).map(
                  (key) => row.lamp[key]
              )
            : (keys as readonly (keyof ProfileLevelRow["rank"])[]).map(
                  (key) => row.rank[key]
              );
    const colors: Record<string, string> =
        view === "lamp" ? LAMP_COLORS : RANK_COLORS;
    const pageHref = href(`/profile/${userId}/stats`);
    return (
        <section
            className="nl-profile-section nl-profile-levels"
            data-variant={variant}
            aria-labelledby={`profile-levels-${variant}`}
        >
            {/* 제목 링크가 있으면 제목 줄 오른쪽 끝(가이드 2절), 전환은 다음 줄 — 목록 바로 위(2026-09-26 A) */}
            <div
                className="nl-profile-section__header"
                data-linked={variant === "summary" || undefined}
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
                <SegmentedControl
                    size="sm"
                    label={t("profile.levels.viewLabel")}
                    value={view}
                    onValueChange={setView}
                    options={[
                        { value: "lamp", label: t("profile.levels.lamp") },
                        { value: "rank", label: t("profile.levels.rank") },
                    ]}
                />
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
                rows={rows.map((row) => {
                    const values = counts(row);
                    const played = values.reduce(
                        (sum, value) => sum + value,
                        0
                    );
                    return {
                        key: `${row.difficulty}:${row.level}`,
                        label: row.label,
                        segments: [
                            ...keys.map((key, index) => ({
                                key,
                                value: values[index],
                                color: colors[key],
                            })),
                            {
                                key: "none",
                                value: Math.max(0, row.total - played),
                                color: NONE,
                            },
                        ],
                        // 램프 = 클리어 이상, 랭크 = S 이상의 비율
                        value: percent(
                            values[0] +
                                values[1] +
                                (view === "lamp" ? values[2] : 0),
                            row.total
                        ),
                    };
                })}
            />
            <ul
                className="nl-profile-legend nl-metadata nl-muted"
                aria-hidden="true"
            >
                {[...keys, "none" as const].map((key) => (
                    <li key={key}>
                        <i
                            style={{
                                background: key === "none" ? NONE : colors[key],
                            }}
                            data-empty={key === "none" || undefined}
                        />
                        {label(key)}
                    </li>
                ))}
                <li>
                    {t(
                        view === "lamp"
                            ? "profile.levels.valueLamp"
                            : "profile.levels.valueRank"
                    )}
                </li>
            </ul>
            {/* 막대 · 범례는 화면 읽기에서 숨기고 줄마다 수를 글로 */}
            <ul className="sr-only">
                {rows.map((row) => {
                    const values = counts(row);
                    const played = values.reduce(
                        (sum, value) => sum + value,
                        0
                    );
                    return (
                        <li key={`${row.difficulty}:${row.level}`}>
                            {t("profile.levels.rowSummary", {
                                level: row.label,
                                parts: [
                                    ...keys.map(
                                        (key, index) =>
                                            `${label(key)} ${values[index]}`
                                    ),
                                    `${label("none")} ${Math.max(0, row.total - played)}`,
                                ].join(", "),
                                total: row.total,
                            })}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
