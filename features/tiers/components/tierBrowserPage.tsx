"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronDown, ListFilter, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import Button from "@/components/ui/Button";
import ActionButton from "@/components/ui/actionButton";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/formField";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import ResultState from "@/components/ui/resultState";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { tierBrowserOverviewOptions } from "@/features/tiers/api/tierBrowser";
import {
    parseTierBrowserQuery,
    serializeTierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";
import type {
    TierBrowserBand,
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";
import { TIER_GOALS, tierGoalLabels, formatTierValue } from "@/lib/tiers";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import TierBrowserBands from "./tierBrowserBands";
import TierFilterFields from "./tierFilterFields";
import TierRatingGuide from "./tierRatingGuide";

export default function TierBrowserPage({
    initialQuery,
    initialOverview,
    initialBand,
    viewerId,
}: {
    initialQuery: TierBrowserQuery;
    initialOverview: TierBrowserOverview | null;
    initialBand: TierBrowserBand | null;
    viewerId: number | null;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const goalId = useId();
    const wide = useMediaQuery("(min-width: 1056px)");
    const searchParams = useSearchParams();
    const query = parseTierBrowserQuery(new URLSearchParams(searchParams));
    const [draft, setDraft] = useState(initialQuery);
    const [open, setOpen] = useState(false);
    const options = tierBrowserOverviewOptions(query, viewerId);
    const initial =
        JSON.stringify(options.queryKey) ===
        JSON.stringify(
            tierBrowserOverviewOptions(initialQuery, viewerId).queryKey
        );
    const result = useQuery({
        ...options,
        initialData: initial ? (initialOverview ?? undefined) : undefined,
        placeholderData: keepPreviousData,
    });
    const preview = useQuery({
        ...tierBrowserOverviewOptions(draft, viewerId),
        enabled: open,
    });
    const data = result.data;
    const pending = result.isPlaceholderData || result.isPending;
    const filterCount =
        Number(query.difficulties.length > 0) +
        Number(query.levels.length > 0) +
        Number(query.bands.length > 0);
    const bands = data?.list?.bands ?? [];
    const total = bands
        .filter(
            (band) => !query.bands.length || query.bands.includes(band.value)
        )
        .reduce((sum, band) => sum + band.totalCount, 0);
    const previewTotal =
        preview.data?.list?.bands
            .filter(
                (band) =>
                    !draft.bands.length || draft.bands.includes(band.value)
            )
            .reduce((sum, band) => sum + band.totalCount, 0) ?? 0;
    useEffect(() => {
        const media = window.matchMedia("(min-width: 1056px)");
        const closeOnWide = (event: MediaQueryListEvent) => {
            if (event.matches) setOpen(false);
        };
        media.addEventListener("change", closeOnWide);
        return () => media.removeEventListener("change", closeOnWide);
    }, []);
    function commit(next: TierBrowserQuery) {
        window.history[open ? "replaceState" : "pushState"](
            {},
            "",
            href(`/tiers?${serializeTierBrowserQuery(next)}`)
        );
        setOpen(false);
    }
    function bandToken() {
        const selected = bands.filter((band) =>
            query.bands.includes(band.value)
        );
        if (!selected.length)
            return query.bands.map(formatTierValue).join(", ");
        if (selected.length === 1) return formatTierValue(selected[0].value);
        const first = bands.indexOf(selected[0]);
        const last = bands.indexOf(selected.at(-1)!);
        return last - first + 1 === selected.length
            ? `${formatTierValue(selected.at(-1)!.value)}–${formatTierValue(selected[0].value)}`
            : t("tiers.moreSelected", {
                  first: formatTierValue(selected[0].value),
                  count: selected.length - 1,
              });
    }
    const modeControl = (
        <div className="nl-tier-browser-mode">
            {wide ? (
                <span className="nl-control">{t("tiers.modeLabel")}</span>
            ) : null}
            <SegmentedControl
                label={t("tiers.modeNav")}
                value={query.mode}
                onValueChange={(mode) => commit({ ...query, mode, bands: [] })}
                options={[
                    { value: "basic", label: "Basic" },
                    { value: "recital", label: "Recital" },
                ]}
            />
        </div>
    );
    const goalControl = (
        <FormField id={goalId} label={t("tiers.goal")}>
            <Select
                id={goalId}
                value={query.goal}
                onChange={(event) =>
                    commit({
                        ...query,
                        goal: event.target.value as TierBrowserQuery["goal"],
                        bands: [],
                    })
                }
            >
                {TIER_GOALS.map((goal) => (
                    <option value={goal} key={goal}>
                        {tierGoalLabels[goal]}
                    </option>
                ))}
            </Select>
        </FormField>
    );
    return (
        <PageContainer className="nl-tiers">
            <h1 className="nl-page-title">{t("tiers.title")}</h1>
            {!wide ? (
                <>
                    {modeControl}
                    {goalControl}
                    {data?.list?.description ? (
                        <p className="nl-body-secondary nl-muted">
                            {data.list.description}
                        </p>
                    ) : null}
                    {data ? (
                        <TierRatingGuide query={query} overview={data} />
                    ) : null}
                </>
            ) : null}
            <div className="nl-tier-layout">
                {wide ? (
                    <aside
                        className="nl-tier-rail"
                        aria-label={t("tiers.conditions")}
                    >
                        {modeControl}
                        {goalControl}
                        <TierFilterFields
                            query={query}
                            onChange={commit}
                            bands={bands}
                        />
                    </aside>
                ) : null}
                <div className="nl-tier-results">
                    {!wide ? (
                        <div className="nl-tier-toolbar">
                            <FullScreenDialog
                                open={open}
                                onOpenChange={(value) => {
                                    if (value) setDraft(query);
                                    setOpen(value);
                                }}
                                title={t("tiers.conditions")}
                                trigger={
                                    <Button
                                        appearance="foundation"
                                        variant="secondary"
                                        className="nl-filter-trigger"
                                    >
                                        <ListFilter
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                        {t("music.filter")}
                                        {filterCount ? (
                                            <span className="nl-filter-count">
                                                {filterCount}
                                            </span>
                                        ) : null}
                                        <ChevronDown
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                    </Button>
                                }
                                footer={
                                    <ActionButton
                                        busy={preview.isFetching}
                                        disabled={
                                            !preview.data || preview.isError
                                        }
                                        onClick={() => commit(draft)}
                                    >
                                        {t("discovery.apply", {
                                            count: previewTotal.toLocaleString(
                                                locale
                                            ),
                                        })}
                                    </ActionButton>
                                }
                            >
                                <div className="nl-tier-filter-body">
                                    <TierFilterFields
                                        query={draft}
                                        onChange={setDraft}
                                        bands={
                                            preview.data?.list?.bands ?? bands
                                        }
                                    />
                                    {preview.isError ? (
                                        <ResultState
                                            message={t("tiers.loadError")}
                                            action={
                                                <ActionButton
                                                    variant="secondary"
                                                    onClick={() =>
                                                        void preview.refetch()
                                                    }
                                                >
                                                    {t("tiers.retry")}
                                                </ActionButton>
                                            }
                                        />
                                    ) : null}
                                </div>
                            </FullScreenDialog>
                            <Checkbox
                                label={t("tiers.detailedView")}
                                checked={query.detailed}
                                onChange={(event) =>
                                    commit({
                                        ...query,
                                        detailed: event.target.checked,
                                    })
                                }
                            />
                        </div>
                    ) : null}
                    {filterCount ? (
                        <div
                            className="nl-tier-criteria"
                            aria-label={t("tiers.conditions")}
                        >
                            {query.bands.length ? (
                                <button
                                    className="nl-tier-applied nl-control"
                                    type="button"
                                    onClick={() =>
                                        commit({ ...query, bands: [] })
                                    }
                                    aria-label={t("tiers.removeCondition", {
                                        condition: `${t("tiers.bands")} ${bandToken()}`,
                                    })}
                                >
                                    {bandToken()}
                                    <X className="nl-icon" aria-hidden />
                                </button>
                            ) : null}
                            {query.difficulties.map((value) => (
                                <button
                                    className="nl-tier-applied nl-control"
                                    type="button"
                                    key={value}
                                    aria-label={t("tiers.removeCondition", {
                                        condition: value,
                                    })}
                                    onClick={() =>
                                        commit({
                                            ...query,
                                            difficulties:
                                                query.difficulties.filter(
                                                    (current) =>
                                                        current !== value
                                                ),
                                        })
                                    }
                                >
                                    {value}
                                    <X className="nl-icon" aria-hidden />
                                </button>
                            ))}
                            {query.levels.map((value) => (
                                <button
                                    className="nl-tier-applied nl-control"
                                    type="button"
                                    key={value}
                                    aria-label={t("tiers.removeCondition", {
                                        condition: value,
                                    })}
                                    onClick={() =>
                                        commit({
                                            ...query,
                                            levels: query.levels.filter(
                                                (current) => current !== value
                                            ),
                                        })
                                    }
                                >
                                    {value.startsWith("real-")
                                        ? `Real ${value.slice(5)}`
                                        : `Lv.${value}`}
                                    <X className="nl-icon" aria-hidden />
                                </button>
                            ))}
                        </div>
                    ) : null}
                    <p className="nl-body-secondary nl-muted" role="status">
                        {pending
                            ? t("tiers.loading")
                            : data?.list
                              ? t("tiers.songCount", {
                                    count: total.toLocaleString(locale),
                                })
                              : ""}
                    </p>
                    {result.isError ? (
                        <ResultState
                            error
                            message={t("tiers.loadError")}
                            action={
                                <ActionButton
                                    variant="secondary"
                                    busy={result.isFetching}
                                    onClick={() => void result.refetch()}
                                >
                                    {t("tiers.retry")}
                                </ActionButton>
                            }
                        />
                    ) : null}
                    {!data && pending ? (
                        <div className="nl-tier-bands" aria-hidden="true">
                            <div className="nl-tier-initial-header" />
                            <div className="nl-tier-grid">
                                {[0, 1, 2].map((index) => (
                                    <div
                                        className="nl-tier-card nl-tier-card--skeleton"
                                        key={index}
                                    >
                                        <span className="nl-tier-card__jacket" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    {data ? (
                        <div
                            aria-busy={pending}
                            data-pending={pending || undefined}
                        >
                            {!data.list ? (
                                <ResultState message={t("tiers.noPublished")} />
                            ) : !total ? (
                                <ResultState
                                    message={t("tiers.noCharts")}
                                    action={
                                        <Button
                                            appearance="foundation"
                                            variant="secondary"
                                            onClick={() =>
                                                commit({
                                                    ...query,
                                                    bands: [],
                                                    difficulties: [],
                                                    levels: [],
                                                })
                                            }
                                        >
                                            {t("discovery.clearFilters")}
                                        </Button>
                                    }
                                />
                            ) : (
                                <TierBrowserBands
                                    query={query}
                                    overview={data}
                                    initialBand={initial ? initialBand : null}
                                    pending={pending}
                                />
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </PageContainer>
    );
}
