"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import { Checkbox } from "@/components/ui/checkbox";
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

function ToggleChips({
    label,
    options,
    selected,
    onChange,
    columns,
}: {
    label: string;
    options: readonly { value: string; label: string }[];
    selected: string[];
    onChange: (values: string[]) => void;
    columns: number;
}) {
    return (
        <div
            role="group"
            aria-label={label}
            className="nl-tier-chips"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {options.map((option) => (
                <button
                    type="button"
                    className="nl-tier-chip nl-control"
                    aria-pressed={selected.includes(option.value)}
                    key={option.value}
                    onClick={() =>
                        onChange(
                            selected.includes(option.value)
                                ? selected.filter(
                                      (value) => value !== option.value
                                  )
                                : [...selected, option.value]
                        )
                    }
                >
                    {selected.includes(option.value) ? (
                        <Check className="nl-icon" aria-hidden />
                    ) : null}
                    {option.label}
                </button>
            ))}
        </div>
    );
}

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
    return (
        <>
            <section className="nl-tier-filter-section">
                <div className="nl-tier-filter-heading nl-control">
                    <h3>{t("tiers.bands")}</h3>
                    <div className="nl-tier-filter-actions">
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
                    </div>
                </div>
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
            </section>
            <section className="nl-tier-filter-section">
                <div className="nl-tier-filter-heading nl-control">
                    <h3>{t("tiers.difficulty")}</h3>
                    <button type="button" onClick={() => reset("difficulties")}>
                        {t("tiers.selectAll")}
                    </button>
                </div>
                <ToggleChips
                    label={t("tiers.difficulty")}
                    columns={2}
                    options={TIER_DIFFICULTIES.map((value) => ({
                        value,
                        label: value,
                    }))}
                    selected={query.difficulties}
                    onChange={(values) =>
                        onChange({
                            ...query,
                            difficulties: TIER_DIFFICULTIES.filter((value) =>
                                values.includes(value)
                            ),
                        })
                    }
                />
            </section>
            <section className="nl-tier-filter-section">
                <div className="nl-tier-filter-heading nl-control">
                    <h3>{t("tiers.officialLevel")}</h3>
                    <button type="button" onClick={() => reset("levels")}>
                        {t("tiers.selectAll")}
                    </button>
                </div>
                <p className="nl-metadata nl-muted">Normal / Hard / Expert</p>
                <ToggleChips
                    label="Normal / Hard / Expert"
                    columns={4}
                    options={TIER_REGULAR_LEVELS.map((value) => ({
                        value,
                        label: value,
                    }))}
                    selected={query.levels}
                    onChange={(values) =>
                        onChange({ ...query, levels: values })
                    }
                />
                <ToggleChips
                    label="Real"
                    columns={3}
                    options={TIER_REAL_LEVELS.map((value) => ({
                        value,
                        label: `Real ${value.slice(5)}`,
                    }))}
                    selected={query.levels}
                    onChange={(values) =>
                        onChange({ ...query, levels: values })
                    }
                />
            </section>
        </>
    );
}
