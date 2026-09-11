"use client";

import { useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import { Checkbox } from "@/components/ui/checkbox";
import FilterChips from "@/components/ui/filterChips";
import FilterGroup from "@/components/ui/filterGroup";
import {
    TIER_DIFFICULTIES,
    TIER_REAL_LEVELS,
    TIER_REGULAR_LEVELS,
    formatTierValue,
} from "@/lib/tiers";
import type {
    TierBrowserBandSummary,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";

const difficultyTone = (value: string) =>
    value.toLowerCase() as "normal" | "hard" | "expert" | "real";

export default function TierFilterFields({
    query,
    onChange,
    bands,
}: {
    query: TierBrowserQuery;
    onChange: (query: TierBrowserQuery) => void;
    bands: TierBrowserBandSummary[];
}) {
    const t = useTranslations();
    const [range, setRange] = useState(false);
    const [rangeStart, setRangeStart] = useState<number | null>(null);
    function chooseBand(value: number) {
        if (!range) {
            onChange({
                ...query,
                bands: query.bands.includes(value)
                    ? query.bands.filter((current) => current !== value)
                    : [...query.bands, value],
            });
            return;
        }
        if (rangeStart === null) {
            setRangeStart(value);
            return;
        }
        const start = bands.findIndex((band) => band.value === rangeStart);
        const end = bands.findIndex((band) => band.value === value);
        onChange({
            ...query,
            bands: bands
                .slice(Math.min(start, end), Math.max(start, end) + 1)
                .map((band) => band.value),
        });
        setRange(false);
        setRangeStart(null);
    }
    const reset = (field: "difficulties" | "levels" | "bands") =>
        onChange({ ...query, [field]: [] });
    // 그룹 오른쪽: 선택이 있을 때만 「전체 선택」(= 조건 해제) — 값이 비면 제약 없음이 기본 상태
    const clearAction = (field: "difficulties" | "levels") =>
        query[field].length ? (
            <button type="button" onClick={() => reset(field)}>
                {t("tiers.selectAll")}
            </button>
        ) : null;
    return (
        <>
            <FilterGroup
                label={t("tiers.bands")}
                aside={
                    <>
                        <button
                            type="button"
                            aria-pressed={range}
                            onClick={() => {
                                setRange(!range);
                                setRangeStart(null);
                            }}
                        >
                            {t(
                                rangeStart !== null
                                    ? "tiers.selectRangeEnd"
                                    : "tiers.selectRange"
                            )}
                        </button>
                        {query.bands.length ? (
                            <button
                                type="button"
                                onClick={() => {
                                    reset("bands");
                                    setRange(false);
                                    setRangeStart(null);
                                }}
                            >
                                {t("tiers.selectAll")}
                            </button>
                        ) : null}
                    </>
                }
            >
                <div
                    className="nl-tier-band-options"
                    role="group"
                    aria-label={t("tiers.bands")}
                >
                    {bands.map((band) => (
                        <Checkbox
                            key={band.id}
                            className="nl-tier-band-option"
                            checked={query.bands.includes(band.value)}
                            data-range-start={
                                rangeStart === band.value || undefined
                            }
                            onChange={() => chooseBand(band.value)}
                            label={
                                <>
                                    <span>{formatTierValue(band.value)}</span>
                                    <span className="nl-muted">
                                        {band.achievedCount === null
                                            ? t("tiers.songCount", {
                                                  count: band.totalCount,
                                              })
                                            : t("tiers.achieved", {
                                                  count: band.achievedCount,
                                                  total: band.totalCount,
                                              })}
                                    </span>
                                </>
                            }
                        />
                    ))}
                </div>
                {range ? (
                    <p className="nl-metadata nl-muted" role="status">
                        {t(
                            rangeStart === null
                                ? "tiers.selectRangeStart"
                                : "tiers.selectRangeEnd"
                        )}
                    </p>
                ) : null}
            </FilterGroup>
            <FilterGroup
                label={t("tiers.difficulty")}
                aside={clearAction("difficulties")}
            >
                <FilterChips
                    label={t("tiers.difficulty")}
                    options={TIER_DIFFICULTIES.map((value) => ({
                        value,
                        label: value,
                        tone: difficultyTone(value),
                    }))}
                    value={query.difficulties}
                    onValueChange={(values) =>
                        onChange({
                            ...query,
                            difficulties: TIER_DIFFICULTIES.filter((value) =>
                                values.includes(value)
                            ),
                        })
                    }
                />
            </FilterGroup>
            <FilterGroup
                label={t("tiers.officialLevel")}
                aside={clearAction("levels")}
            >
                <p className="nl-metadata nl-muted">Normal / Hard / Expert</p>
                <FilterChips
                    label="Normal / Hard / Expert"
                    options={TIER_REGULAR_LEVELS.map((value) => ({
                        value,
                        label: value,
                    }))}
                    value={query.levels}
                    onValueChange={(values) =>
                        onChange({ ...query, levels: values })
                    }
                />
                <p className="nl-metadata nl-muted">Real</p>
                <FilterChips
                    label="Real"
                    options={TIER_REAL_LEVELS.map((value) => ({
                        value,
                        label: `Real ${value.slice(5)}`,
                    }))}
                    value={query.levels}
                    onValueChange={(values) =>
                        onChange({ ...query, levels: values })
                    }
                />
            </FilterGroup>
        </>
    );
}
