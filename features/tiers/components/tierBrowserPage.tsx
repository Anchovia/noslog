"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, ListFilter } from "lucide-react";
import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import Button from "@/components/ui/Button";
import ActionButton from "@/components/ui/actionButton";
import AppliedTokens from "@/components/ui/appliedTokens";
import { FormField } from "@/components/ui/formField";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import ResultState from "@/components/ui/resultState";
import CompactSelect from "@/components/ui/compactSelect";
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
import {
    TIER_MODE_GOALS,
    tierGoalLabels,
    formatTierValue,
    normalizeTierModeGoal,
} from "@/lib/tiers";
import useWideLayout from "@/lib/hooks/useWideLayout";
import { SkeletonText } from "@/components/ui/skeleton";
import {
    TierBrowserCardSkeleton,
    TierBrowserRowSkeleton,
} from "./tierBrowserCard";
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
    const wide = useWideLayout();
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
    if (wide && open) setOpen(false);
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
    // 결과 수 — 폰은 제목 아래 메타 글줄(악곡 목록과 같음), Wide 는 결과 머리 줄 왼쪽(2026-09-22)
    const countClass = wide ? "nl-body-secondary" : "nl-metadata";
    const resultCount = (
        <p className={`${countClass} nl-muted`} role="status">
            {pending ? (
                // 글자 대신 결과 수 자리 스켈레톤(안내는 화면 읽기에만)
                <>
                    <span className="sr-only">{t("tiers.loading")}</span>
                    <SkeletonText className={countClass} width="s" />
                </>
            ) : data?.list ? (
                t("tiers.songCount", {
                    count: total.toLocaleString(locale),
                })
            ) : (
                ""
            )}
        </p>
    );
    const modeControl = (
        <div className="nl-tier-browser-mode">
            {wide ? (
                <span className="nl-control">{t("tiers.modeLabel")}</span>
            ) : null}
            <SegmentedControl
                label={t("tiers.modeNav")}
                value={query.mode}
                onValueChange={(mode) =>
                    commit({
                        ...query,
                        mode,
                        goal: normalizeTierModeGoal(mode, query.goal),
                        bands: [],
                    })
                }
                options={[
                    { value: "basic", label: "Basic" },
                    { value: "recital", label: "Recital" },
                ]}
            />
        </div>
    );
    // Recital 은 서열표가 하나라 목표 선택기를 두지 않는다.
    // 선택지는 「S 서열표」 처럼 표 이름으로 — 폰은 라벨 없이 모드와 한 줄이라 이름이 뜻을 말한다(2026-09-22)
    const goalSelect =
        TIER_MODE_GOALS[query.mode].length > 1 ? (
            <CompactSelect
                id={goalId}
                label={t("tiers.goal")}
                outlined
                className="nl-tier-goal"
                value={query.goal}
                onValueChange={(goal) =>
                    commit({
                        ...query,
                        goal,
                        bands: [],
                    })
                }
                options={TIER_MODE_GOALS[query.mode].map((goal) => ({
                    value: goal,
                    label: t("tiers.goalOption", {
                        goal: tierGoalLabels[goal],
                    }),
                }))}
            />
        ) : null;
    const goalControl = goalSelect ? (
        <FormField id={goalId} label={t("tiers.goal")}>
            {goalSelect}
        </FormField>
    ) : null;
    // 보기 방식 — 격자(자켓) · 목록(행). 악곡 목록과 같은 부품 · 문구, 같은 줄 필터 트리거와 같은 높이(L)
    const viewSwitch = (
        <SegmentedControl
            label={t("discovery.view")}
            value={query.view}
            onValueChange={(view) => commit({ ...query, view })}
            iconOnly
            options={[
                {
                    value: "grid",
                    label: t("discovery.grid"),
                    icon: <LayoutGrid aria-hidden />,
                },
                {
                    value: "list",
                    label: t("discovery.list"),
                    icon: <List aria-hidden />,
                },
            ]}
        />
    );
    return (
        <PageContainer
            className="nl-tiers"
            data-layout={wide ? "wide" : "compact"}
        >
            <div className="nl-page-heading">
                <div className="nl-page-heading__copy">
                    <div className="nl-heading-row">
                        <h1 className="nl-page-title">{t("tiers.title")}</h1>
                        {data ? (
                            <TierRatingGuide query={query} overview={data} />
                        ) : null}
                    </div>
                    {!wide ? resultCount : null}
                </div>
            </div>
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
                    <div className="nl-filter-control-block">
                        {/* 폰 조작부 두 줄(2026-09-22 B안): 모드 · 목표 한 줄, 필터 · 보기 한 줄 — 모두 컨트롤 L */}
                        {!wide ? (
                            <div className="nl-tier-controls">
                                {modeControl}
                                {goalSelect}
                            </div>
                        ) : null}
                        <div className="nl-tier-toolbar">
                            {wide ? resultCount : null}
                            {!wide ? (
                                <FullScreenDialog
                                    open={open}
                                    onOpenChange={(value) => {
                                        if (value) setDraft(query);
                                        setOpen(value);
                                    }}
                                    title={t("tiers.conditions")}
                                    onReset={() =>
                                        setDraft({
                                            ...draft,
                                            bands: [],
                                            difficulties: [],
                                            levels: [],
                                        })
                                    }
                                    trigger={
                                        <Button
                                            variant="secondary"
                                            className="nl-filter-trigger"
                                        >
                                            <ListFilter
                                                className="nl-icon"
                                                aria-hidden
                                            />
                                            {t("music.filter")}
                                            {filterCount ? (
                                                <span className="nl-filter-count nl-metadata">
                                                    {filterCount}
                                                </span>
                                            ) : null}
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
                                                preview.data?.list?.bands ??
                                                bands
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
                            ) : null}
                            {viewSwitch}
                        </div>
                    </div>
                    <AppliedTokens
                        label={t("tiers.conditions")}
                        clearLabel={t("discovery.clearFilters")}
                        onClear={() =>
                            commit({
                                ...query,
                                bands: [],
                                difficulties: [],
                                levels: [],
                            })
                        }
                        tokens={[
                            ...(query.bands.length
                                ? [
                                      {
                                          key: "bands",
                                          label: bandToken(),
                                          removeLabel: t(
                                              "tiers.removeCondition",
                                              {
                                                  condition: `${t("tiers.bands")} ${bandToken()}`,
                                              }
                                          ),
                                          onRemove: () =>
                                              commit({ ...query, bands: [] }),
                                      },
                                  ]
                                : []),
                            ...query.difficulties.map((value) => ({
                                key: `difficulty-${value}`,
                                label: value,
                                removeLabel: t("tiers.removeCondition", {
                                    condition: value,
                                }),
                                onRemove: () =>
                                    commit({
                                        ...query,
                                        difficulties: query.difficulties.filter(
                                            (current) => current !== value
                                        ),
                                    }),
                            })),
                            ...query.levels.map((value) => {
                                const label = value.startsWith("real-")
                                    ? `Real ${value.slice(5)}`
                                    : `Lv.${value}`;
                                return {
                                    key: `level-${value}`,
                                    label,
                                    removeLabel: t("tiers.removeCondition", {
                                        condition: value,
                                    }),
                                    onRemove: () =>
                                        commit({
                                            ...query,
                                            levels: query.levels.filter(
                                                (current) => current !== value
                                            ),
                                        }),
                                };
                            }),
                        ]}
                    />
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
                        // 첫 불러오기 — 서열 구역 하나와 같은 틀(구역 머리 · 카드 격자)의 스켈레톤
                        <div className="nl-tier-bands" aria-hidden="true">
                            <section className="nl-tier-band">
                                <header className="nl-tier-band__header">
                                    <SkeletonText
                                        className="nl-section-title"
                                        width="s"
                                    />
                                </header>
                                {query.view === "list" ? (
                                    <div className="nl-tier-list">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <TierBrowserRowSkeleton
                                                key={index}
                                                signedIn={viewerId !== null}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="nl-tier-grid">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <TierBrowserCardSkeleton
                                                key={index}
                                                signedIn={viewerId !== null}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
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
