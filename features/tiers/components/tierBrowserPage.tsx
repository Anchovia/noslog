"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, ListFilter } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
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
import SearchField from "@/components/ui/searchField";
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
    function commit(next: TierBrowserQuery, replace = false) {
        window.history[open || replace ? "replaceState" : "pushState"](
            {},
            "",
            href(`/tiers?${serializeTierBrowserQuery(next)}`)
        );
        setOpen(false);
    }
    // 곡 검색(2026-09-22) — 악곡 목록 검색과 같은 방식: 300ms 쉬면 주소 q= 에 반영(기록은 덮어씀), 한글 조합 중에는 기다린다
    const [search, setSearch] = useState(query.q);
    const committedSearch = useRef(query.q);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const composing = useRef(false);
    useEffect(() => {
        // 뒤로 가기 등 바깥에서 검색어가 바뀐 경우만 입력칸을 맞춘다
        if (query.q === committedSearch.current) return;
        committedSearch.current = query.q;
        setSearch(query.q);
    }, [query.q]);
    useEffect(
        () => () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        },
        []
    );
    function commitSearch(value: string) {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        const q = value.trim();
        committedSearch.current = q;
        if (q !== query.q) commit({ ...query, q }, true);
    }
    function scheduleSearch(value: string) {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => commitSearch(value), 300);
    }
    const searchField = (
        <form
            role="search"
            className="nl-tier-search__form"
            noValidate
            onSubmit={(event) => {
                event.preventDefault();
                if (!composing.current) commitSearch(search);
            }}
        >
            <SearchField
                value={search}
                maxLength={100}
                aria-label={t("discovery.musicPlaceholder")}
                placeholder={t("discovery.musicPlaceholder")}
                clearLabel={t("discovery.clearQuery")}
                onClear={() => {
                    setSearch("");
                    commitSearch("");
                }}
                onChange={(event) => {
                    setSearch(event.target.value);
                    if (!composing.current) scheduleSearch(event.target.value);
                }}
                onCompositionStart={() => {
                    composing.current = true;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                }}
                onCompositionEnd={(event) => {
                    composing.current = false;
                    scheduleSearch(event.currentTarget.value);
                }}
            />
        </form>
    );
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
    function changeMode(mode: TierBrowserQuery["mode"]) {
        commit({
            ...query,
            mode,
            goal: normalizeTierModeGoal(mode, query.goal),
            bands: [],
        });
    }
    function changeGoal(goal: TierBrowserQuery["goal"]) {
        commit({ ...query, goal, bands: [] });
    }
    const goalOptions = TIER_MODE_GOALS[query.mode].map((goal) => ({
        value: goal,
        label: t("tiers.goalOption", { goal: tierGoalLabels[goal] }),
    }));
    // 폰 조건 줄(2026-09-22 B안) — 모드 · 목표를 테두리 없는 셀렉트 M 두 개로(악곡 목록 정렬 트리거와 같은 고스트 모양).
    // Recital 은 서열표가 하나라 목표 셀렉트가 없다
    const scopeSelects = (
        <div className="nl-tier-scope__selects">
            <CompactSelect
                label={t("tiers.modeNav")}
                value={query.mode}
                onValueChange={changeMode}
                options={[
                    { value: "basic", label: "Basic" },
                    { value: "recital", label: "Recital" },
                ]}
            />
            {goalOptions.length > 1 ? (
                <CompactSelect
                    label={t("tiers.goal")}
                    value={query.goal}
                    onValueChange={changeGoal}
                    options={goalOptions}
                />
            ) : null}
        </div>
    );
    const modeControl = (
        <div className="nl-tier-browser-mode">
            <span className="nl-control">{t("tiers.modeLabel")}</span>
            <SegmentedControl
                label={t("tiers.modeNav")}
                value={query.mode}
                onValueChange={changeMode}
                options={[
                    { value: "basic", label: "Basic" },
                    { value: "recital", label: "Recital" },
                ]}
            />
        </div>
    );
    // Wide 레일 — 라벨 있는 입력칸형 셀렉트(Recital 은 없음)
    const goalControl =
        goalOptions.length > 1 ? (
            <FormField id={goalId} label={t("tiers.goal")}>
                <CompactSelect
                    id={goalId}
                    label={t("tiers.goal")}
                    outlined
                    className="nl-tier-goal"
                    value={query.goal}
                    onValueChange={changeGoal}
                    options={goalOptions}
                />
            </FormField>
        ) : null;
    // 보기 방식 — 격자(자켓) · 목록(행). 악곡 목록과 같은 부품 · 문구. 폰은 조건 줄에 M, Wide 는 결과 머리 줄에 L
    const viewSwitch = (
        <SegmentedControl
            label={t("discovery.view")}
            value={query.view}
            onValueChange={(view) => commit({ ...query, view })}
            iconOnly
            size={wide ? undefined : "sm"}
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
            {/* Wide 는 악곡 목록처럼 제목 아래 검색 전체 폭 → 레일 | 결과 */}
            {wide ? <div className="nl-tier-search">{searchField}</div> : null}
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
                        {/* 폰 머리 두 줄(2026-09-22 B안): 검색 + ☰ 필터 44 / 모드 · 목표 셀렉트 M · 보기 전환 M
                            — 악곡 목록 폰 머리와 같은 틀 */}
                        <div
                            className={
                                wide ? "nl-tier-toolbar" : "nl-tier-search"
                            }
                        >
                            {wide ? resultCount : searchField}
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
                                        <ActionButton
                                            variant="secondary"
                                            size="icon"
                                            className="nl-filter-icon-trigger"
                                            aria-label={t("music.filter")}
                                        >
                                            <ListFilter
                                                className="nl-icon-small"
                                                aria-hidden
                                            />
                                            {filterCount ? (
                                                <span className="nl-filter-count nl-metadata">
                                                    {filterCount}
                                                </span>
                                            ) : null}
                                        </ActionButton>
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
                            {wide ? viewSwitch : null}
                        </div>
                        {!wide ? (
                            <div className="nl-tier-scope">
                                {scopeSelects}
                                {viewSwitch}
                            </div>
                        ) : null}
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
                            ) : !total && query.q ? (
                                // 검색 결과 없음 — 한 줄 + 「검색어 지우기」(필터는 그대로)
                                <ResultState
                                    message={t("tiers.searchEmpty", {
                                        query: query.q,
                                    })}
                                    action={
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setSearch("");
                                                commitSearch("");
                                            }}
                                        >
                                            {t("discovery.clearQuery")}
                                        </Button>
                                    }
                                />
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
