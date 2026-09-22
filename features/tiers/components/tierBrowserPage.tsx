"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, ListFilter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import ResultState from "@/components/ui/resultState";
import SearchField from "@/components/ui/searchField";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import CompactSelect from "@/components/ui/compactSelect";
import SortMenu from "@/components/ui/sortMenu";
import { tierBrowserOverviewOptions } from "@/features/tiers/api/tierBrowser";
import {
    TIER_BROWSER_SORTS,
    TIER_BROWSER_STRIPS,
    parseTierBrowserQuery,
    serializeTierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";
import type {
    TierBrowserBand,
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";
import { formatTierValue, tierListLabel } from "@/lib/tiers";
import useWideLayout from "@/lib/hooks/useWideLayout";
import { SkeletonText } from "@/components/ui/skeleton";
import {
    TierBrowserCardSkeleton,
    TierBrowserRowSkeleton,
} from "./tierBrowserCard";
import TierBrowserBands from "./tierBrowserBands";
import TierFilterFields from "./tierFilterFields";
import TierExportDialog from "./tierExportDialog";
import TierListSwitcher from "./tierListSwitcher";
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
    function levelToken(value: string) {
        return value.startsWith("real-")
            ? `Real ${value.slice(5)}`
            : `Lv.${value}`;
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
    // 결과 수 — 폰은 악곡 목록처럼 제목(스위처) 아래 메타 글줄 맨 앞, Wide 는 정렬 · 보기 툴바 아래(악곡 목록과 같은 자리)
    const countClass = wide ? "nl-body-secondary" : "nl-metadata";
    const countText = pending ? (
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
    );
    const resultCount = (
        <p className={`${countClass} nl-muted`} role="status">
            {countText}
        </p>
    );
    // 제목 아래 메타 글줄(2026-09-22 A) — 「2,159곡 · 9월 2일 업데이트 · 안내」. Wide 는 곡 수 없이 업데이트 · 안내
    const updated = data?.list ? new Date(data.list.updatedAt) : null;
    const seoulYear = (date: Date) =>
        new Intl.DateTimeFormat("en", {
            year: "numeric",
            timeZone: "Asia/Seoul",
        }).format(date);
    const metaParts = [
        ...(updated
            ? [
                  <span key="updated">
                      {t("tiers.updatedOn", {
                          date: new Intl.DateTimeFormat(locale, {
                              ...(seoulYear(updated) === seoulYear(new Date())
                                  ? {}
                                  : { year: "numeric" }),
                              month: "short",
                              day: "numeric",
                              timeZone: "Asia/Seoul",
                          }).format(updated),
                      })}
                  </span>,
              ]
            : []),
        ...(data?.list
            ? [<TierRatingGuide key="guide" query={query} overview={data} />]
            : []),
    ];
    const meta = (
        <div className="nl-tier-meta nl-metadata nl-muted">
            {!wide ? <span role="status">{countText}</span> : null}
            {metaParts.map((part, index) => (
                <span key={part.key} className="nl-tier-meta__item">
                    {index || !wide ? (
                        <span aria-hidden="true"> · </span>
                    ) : null}
                    {part}
                </span>
            ))}
        </div>
    );
    // 보기 방식 — 격자(자켓) · 목록(행). 악곡 목록과 같은 부품 · 문구. 폰은 결과 줄에 M, Wide 는 결과 머리 줄에 L
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
    // 정렬 — 구간 안 곡 순서(2026-09-22 ②). 악곡 목록과 같은 SortMenu · 자리(폰 결과 줄 왼쪽 고스트 M, Wide 툴바 왼쪽 L).
    // 점수 낮은 순은 로그인했을 때만 보인다 — 구간과 같은 기준(받은 서열 데이터의 viewerId)
    const signedIn = (data?.viewerId ?? viewerId) !== null;
    const sorts = TIER_BROWSER_SORTS.filter(
        (value) => value !== "score" || signedIn
    );
    const sortMenu = (
        <SortMenu
            variant={wide ? undefined : "ghost"}
            size={wide ? undefined : "sm"}
            label={t("discovery.sortLabel")}
            value={sorts.includes(query.sort) ? query.sort : "position"}
            options={sorts.map((value) => ({
                value,
                label: t(
                    value === "level" || value === "name"
                        ? `discovery.sort.${value}`
                        : `tiers.sort.${value}`
                ),
            }))}
            onValueChange={(sort) => commit({ ...query, sort })}
        />
    );
    // 자켓 위 띠 값(2026-09-22 A) — V-ARCHIVE 식 셀렉트, 기존 CompactSelect(폰 결과 줄 M · Wide 툴바 L).
    // 기록이 있어야 뜻이 있어 로그인 · 격자 보기에서만. 값은 보기 · 정렬처럼 주소(strip=, 기본 Grd 는 생략)
    const stripSelect =
        signedIn && query.view === "grid" ? (
            <CompactSelect
                label={t("tiers.strip.label")}
                value={query.strip}
                onValueChange={(strip) => commit({ ...query, strip })}
                options={TIER_BROWSER_STRIPS.map((value) => ({
                    value,
                    label: t(
                        value === "grade"
                            ? "rankings.metric.grade"
                            : value === "rating"
                              ? "rankings.metric.rating"
                              : "tiers.strip.off"
                    ),
                    shortLabel: t(`tiers.strip.short.${value}`),
                }))}
            />
        ) : null;
    return (
        <PageContainer
            className="nl-tiers"
            data-layout={wide ? "wide" : "compact"}
        >
            <div className="nl-page-heading">
                <div className="nl-page-heading__copy">
                    {/* 제목 = 서열표 스위처(2026-09-22 ④) — 네 서열표를 여기서 고른다 */}
                    <h1 className="nl-tier-heading">
                        <span className="sr-only">{t("tiers.title")}</span>
                        <TierListSwitcher
                            value={query}
                            onValueChange={({ mode, goal }) =>
                                commit({ ...query, mode, goal, bands: [] })
                            }
                        />
                    </h1>
                    {meta}
                </div>
                {/* 제목 줄 오른쪽 = 이미지 내보내기(2026-09-22 E3 — 프로필 카드 공유와 같은 자리) */}
                {data?.list ? (
                    <div className="nl-tier-export__trigger nl-page-title">
                        <TierExportDialog
                            query={query}
                            overview={data}
                            title={t("tiers.goalOption", {
                                goal: tierListLabel(query.mode, query.goal),
                            })}
                            conditions={[
                                ...(query.bands.length ? [bandToken()] : []),
                                ...query.difficulties,
                                ...query.levels.map(levelToken),
                                ...(query.q ? [`「${query.q}」`] : []),
                            ]}
                        />
                    </div>
                ) : null}
            </div>
            {/* Wide 는 악곡 목록처럼 제목 아래 검색 전체 폭 → 레일 | 결과 */}
            {wide ? <div className="nl-tier-search">{searchField}</div> : null}
            <div className="nl-tier-layout">
                {wide ? (
                    <aside
                        className="nl-tier-rail"
                        aria-label={t("tiers.conditions")}
                    >
                        <TierFilterFields
                            query={query}
                            onChange={commit}
                            bands={bands}
                        />
                    </aside>
                ) : null}
                <div className="nl-tier-results">
                    <div className="nl-filter-control-block">
                        {/* 폰: 검색 + ☰ 필터 44 / 정렬 · 보기 전환 M. Wide: 정렬 L · 보기 전환 L
                            — 악곡 목록 머리와 같은 틀(2026-09-22) */}
                        <div
                            className={
                                wide ? "nl-tier-toolbar" : "nl-tier-search"
                            }
                        >
                            {wide ? sortMenu : searchField}
                            {wide ? stripSelect : null}
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
                        {/* 폰 결과 줄 — 왼쪽 정렬(고스트 M) · 오른쪽 보기 전환 M, Wide 는 툴바 아래 결과 수 (악곡 목록과 같은 틀) */}
                        {wide ? (
                            resultCount
                        ) : (
                            <div className="nl-tier-scope">
                                {sortMenu}
                                {stripSelect}
                                {viewSwitch}
                            </div>
                        )}
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
                                const label = levelToken(value);
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
