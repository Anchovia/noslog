"use client";

import {
    keepPreviousData,
    useInfiniteQuery,
    useQuery,
} from "@tanstack/react-query";
import {
    ChevronDown,
    Grid3x3,
    LayoutGrid,
    List,
    ListFilter,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import ActionButton from "@/components/ui/actionButton";
import CompactSelect from "@/components/ui/compactSelect";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import SearchField from "@/components/ui/searchField";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import ResultState from "@/components/ui/resultState";
import useDebouncedValue from "@/lib/hooks/useDebouncedValue";
import useWideLayout from "@/lib/hooks/useWideLayout";
import { cn } from "@/lib/utils";
import {
    discoveryOptions,
    discoveryPreviewOptions,
} from "@/features/music/api/discovery";
import {
    discoveryFilterCount,
    discoveryLevelBounds,
    discoveryQuerySchema,
    discoverySearchParams,
    parseDiscoverySearchParams,
} from "@/features/music/schemas/discoverySchema";
import type {
    DiscoveryPage as DiscoveryPageData,
    DiscoveryQuery,
} from "@/features/music/schemas/discoverySchema";
import { musicSearchSchema } from "@/features/music/schemas/musicSearchSchema";
import type { MusicSearchFormValues } from "@/features/music/schemas/musicSearchSchema";
import MusicResultCard from "@/features/music/components/musicResultCard";
import ChartResultGroup from "@/features/music/components/chartResultGroup";
import DiscoveryFilters, {
    DiscoverySortMenu,
} from "@/features/music/components/discoveryFilters";
import AppliedTokens from "@/components/ui/appliedTokens";

export default function DiscoveryPage({
    initialPage,
    initialQuery,
    accountId,
}: {
    initialPage: DiscoveryPageData | null;
    initialQuery: DiscoveryQuery;
    accountId: number | null;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const params = useSearchParams();
    const serialized = params.toString();
    const query = useMemo(() => {
        const parsed = parseDiscoverySearchParams(
            Object.fromEntries(new URLSearchParams(serialized))
        );
        return accountId
            ? parsed
            : {
                  ...parsed,
                  records: [],
                  missMin: undefined,
                  missMax: undefined,
                  sort: parsed.sort === "recent" ? undefined : parsed.sort,
              };
    }, [serialized, accountId]);
    const wide = useWideLayout();
    const [open, setOpen] = useState(false);
    if (wide && open) setOpen(false);
    const summaryRef = useRef<HTMLParagraphElement>(null);
    const focusCommittedSummary = useRef(false);
    const [draft, setDraft] = useState(query);
    const [rangeDraft, setRangeDraft] = useState<DiscoveryQuery | null>(null);
    const [slowKey, setSlowKey] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState("");
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const composing = useRef(false);
    const results = useRef<HTMLDivElement>(null);
    const appendedFocus = useRef<{ queryKey: string; index: number } | null>(
        null
    );
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { isReady },
    } = useForm<MusicSearchFormValues>({
        resolver: zodResolver(musicSearchSchema),
        defaultValues: { search: query.q },
    });
    const search = useWatch({ control, name: "search" }) ?? "";
    const input = register("search");
    const dataQuery = useMemo(
        () => ({ ...query, view: "list" as const }),
        [query]
    );
    const initialDataQuery = { ...initialQuery, view: "list" as const };
    const queryKey = JSON.stringify(dataQuery);
    const collection = useInfiniteQuery({
        ...discoveryOptions(dataQuery, accountId),
        initialData:
            initialPage && queryKey === JSON.stringify(initialDataQuery)
                ? { pages: [initialPage], pageParams: [0] }
                : undefined,
        placeholderData: keepPreviousData,
    });
    const validDraft = discoveryQuerySchema.safeParse(draft).success;
    const delayedDraft = useDebouncedValue(draft, 300);
    const count = useQuery({
        ...discoveryPreviewOptions(delayedDraft, accountId),
        enabled: open && discoveryQuerySchema.safeParse(delayedDraft).success,
    });
    const items = collection.data?.pages.flatMap((page) => page.items) ?? [];
    const total = collection.data?.pages[0]?.total ?? 0;
    const chartTotal = collection.data?.pages[0]?.chartTotal ?? 0;
    const replacing = collection.isFetching && !collection.isFetchingNextPage;
    const pending = replacing && slowKey === queryKey;
    const appliedCount = discoveryFilterCount(query);
    const nextAmount = Math.min(20, total - items.length);
    const summary = t(
        query.scope === "music"
            ? "discovery.musicCount"
            : "discovery.chartCount",
        { count: query.scope === "music" ? total : chartTotal }
    );

    useEffect(() => {
        reset({ search: query.q });
    }, [query.q, reset]);
    useEffect(() => {
        const intent = appendedFocus.current;
        if (!intent) return;
        if (intent.queryKey !== queryKey) {
            appendedFocus.current = null;
            return;
        }
        if (collection.isFetchingNextPage) return;
        const target = results.current
            ?.querySelectorAll<HTMLElement>("[data-result]")
            [intent.index]?.querySelector<HTMLElement>("a");
        if (target) {
            target.focus();
            appendedFocus.current = null;
        }
    }, [items.length, queryKey, collection.isFetchingNextPage]);
    useEffect(() => {
        const timer = setTimeout(
            () => setSlowKey(replacing ? queryKey : null),
            replacing ? 300 : 0
        );
        return () => clearTimeout(timer);
    }, [queryKey, replacing]);
    useEffect(
        () => () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
            if (rangeTimer.current) clearTimeout(rangeTimer.current);
        },
        []
    );

    function commit(next: DiscoveryQuery, replace = false) {
        if (!discoveryQuerySchema.safeParse(next).success) return;
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (rangeTimer.current) clearTimeout(rangeTimer.current);
        const urlParams = discoverySearchParams(next);
        const url = href(`/music${urlParams.size ? `?${urlParams}` : ""}`);
        if (`${window.location.pathname}${window.location.search}` === url)
            return;
        setSlowKey(null);
        window.history[replace || open ? "replaceState" : "pushState"](
            {},
            "",
            url
        );
    }
    function scheduleSearch(value: string) {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(
            () => commit({ ...query, q: value.trim() }, true),
            300
        );
    }
    function changeRange(next: DiscoveryQuery, immediate = false) {
        setRangeDraft(next);
        if (rangeTimer.current) clearTimeout(rangeTimer.current);
        const apply = () => {
            commit(next);
            setRangeDraft(null);
        };
        if (immediate) apply();
        else rangeTimer.current = setTimeout(apply, 300);
    }
    function handleOpen(next: boolean) {
        if (next) setDraft(query);
        setOpen(next);
    }
    async function loadMore() {
        if (collection.isFetching) return;
        const previous = items.length;
        appendedFocus.current = { queryKey, index: previous };
        const response = await collection.fetchNextPage();
        if (response.isError) {
            appendedFocus.current = null;
            return;
        }
        const loaded =
            response.data?.pages.flatMap((page) => page.items).length ??
            previous;
        setAnnouncement(t("discovery.added", { count: loaded - previous }));
    }
    const clearFilters = () =>
        commit({
            ...query,
            categories: [],
            difficulties: [],
            records: [],
            missMin: undefined,
            missMax: undefined,
        });
    const viewSwitch =
        query.scope === "music" ? (
            <SegmentedControl
                label={t("discovery.view")}
                value={query.view}
                onValueChange={(view) => commit({ ...query, view }, true)}
                iconOnly
                options={[
                    {
                        value: "list",
                        label: t("discovery.list"),
                        icon: <List aria-hidden />,
                    },
                    {
                        value: "grid",
                        label: t("discovery.grid"),
                        icon: <LayoutGrid aria-hidden />,
                    },
                    {
                        value: "dense",
                        label: t("discovery.denseGrid"),
                        icon: <Grid3x3 aria-hidden />,
                    },
                ]}
            />
        ) : null;
    const filterTrigger = (
        <ActionButton
            variant="secondary"
            className="nl-filter-trigger"
            aria-label={t("music.filter")}
        >
            <ListFilter className="nl-icon-small" aria-hidden />
            {t("music.filter")}
            {appliedCount ? (
                <span className="nl-filter-count nl-metadata">
                    {appliedCount}
                </span>
            ) : null}
            <ChevronDown className="nl-icon-small" aria-hidden />
        </ActionButton>
    );

    return (
        <PageContainer
            className="nl-discovery"
            data-layout={wide ? "wide" : "compact"}
        >
            <header className="nl-discovery__heading">
                <h1 className="nl-page-title">
                    {t(
                        query.scope === "music"
                            ? "discovery.music"
                            : "discovery.chart"
                    )}
                </h1>
                <form
                    role="search"
                    noValidate
                    onSubmit={(event) => {
                        if (composing.current) {
                            event.preventDefault();
                            return;
                        }
                        if (searchTimer.current)
                            clearTimeout(searchTimer.current);
                        void handleSubmit(({ search }) =>
                            commit({ ...query, q: search?.trim() ?? "" })
                        )(event);
                    }}
                >
                    <SearchField
                        {...input}
                        disabled={!isReady}
                        value={search}
                        maxLength={100}
                        aria-label={t(
                            query.scope === "music"
                                ? "discovery.musicPlaceholder"
                                : "discovery.chartPlaceholder"
                        )}
                        placeholder={t(
                            query.scope === "music"
                                ? "discovery.musicPlaceholder"
                                : "discovery.chartPlaceholder"
                        )}
                        clearLabel={t("discovery.clearQuery")}
                        onClear={() => {
                            if (searchTimer.current)
                                clearTimeout(searchTimer.current);
                            reset({ search: "" });
                            commit({ ...query, q: "" });
                        }}
                        onChange={(event) => {
                            void input.onChange(event);
                            if (!composing.current)
                                scheduleSearch(event.target.value);
                        }}
                        onCompositionStart={() => {
                            composing.current = true;
                            if (searchTimer.current)
                                clearTimeout(searchTimer.current);
                        }}
                        onCompositionEnd={(event) => {
                            composing.current = false;
                            scheduleSearch(event.currentTarget.value);
                        }}
                        leading={
                            <CompactSelect
                                label={t("discovery.scope")}
                                value={query.scope}
                                onValueChange={(scope) => {
                                    if (searchTimer.current)
                                        clearTimeout(searchTimer.current);
                                    commit({
                                        ...query,
                                        q: search.trim(),
                                        scope,
                                        sort: undefined,
                                        order: undefined,
                                    });
                                }}
                                options={[
                                    {
                                        value: "music",
                                        label: t("discovery.musicSearch"),
                                        shortLabel: t("discovery.music"),
                                    },
                                    {
                                        value: "chart",
                                        label: t("discovery.chartSearch"),
                                        shortLabel: t("discovery.chart"),
                                    },
                                ]}
                            />
                        }
                    />
                </form>
            </header>
            <div className="nl-discovery__layout">
                {wide ? (
                    <aside
                        className="nl-discovery__rail"
                        aria-label={t("music.filter")}
                    >
                        <DiscoveryFilters
                            query={rangeDraft ?? query}
                            signedIn={Boolean(accountId)}
                            onChange={(next) => commit(next)}
                            onRangeChange={(next) => changeRange(next)}
                            onRangeCommit={(next) => changeRange(next, true)}
                            variant="rail"
                        />
                    </aside>
                ) : null}
                <div className="nl-discovery__results">
                    {/* 컨트롤 묶음: 정렬·필터 행 + 결과 수·보기 행 = 한 subsection, 안쪽 12 / 목록까지 24 */}
                    <div className="nl-filter-control-block">
                        <div className="nl-discovery__toolbar">
                            <div
                                className={cn(
                                    "nl-discovery__controls",
                                    !wide && "nl-filter-toolbar--split"
                                )}
                            >
                                <DiscoverySortMenu
                                    query={query}
                                    signedIn={Boolean(accountId)}
                                    onChange={(next) => commit(next)}
                                />
                                {!wide ? (
                                    <FullScreenDialog
                                        open={open}
                                        onOpenChange={handleOpen}
                                        onCloseAutoFocus={(event) => {
                                            if (!focusCommittedSummary.current)
                                                return;
                                            event.preventDefault();
                                            focusCommittedSummary.current = false;
                                            summaryRef.current?.focus();
                                        }}
                                        title={t("music.filter")}
                                        trigger={filterTrigger}
                                        headerAction={
                                            <ActionButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setDraft({
                                                        ...draft,
                                                        categories: [],
                                                        difficulties: [],
                                                        records: [],
                                                        missMin: undefined,
                                                        missMax: undefined,
                                                    })
                                                }
                                            >
                                                {t("common.reset")}
                                            </ActionButton>
                                        }
                                        footer={
                                            <ActionButton
                                                disabled={!validDraft}
                                                onClick={() => {
                                                    focusCommittedSummary.current = true;
                                                    commit(draft);
                                                    setOpen(false);
                                                }}
                                            >
                                                {validDraft
                                                    ? count.data &&
                                                      delayedDraft === draft
                                                        ? t("discovery.apply", {
                                                              count: count.data
                                                                  .total,
                                                          })
                                                        : t(
                                                              "discovery.applyWithoutCount"
                                                          )
                                                    : t(
                                                          "discovery.invalidRange"
                                                      )}
                                            </ActionButton>
                                        }
                                    >
                                        <DiscoveryFilters
                                            query={draft}
                                            onChange={setDraft}
                                            signedIn={Boolean(accountId)}
                                            variant="layer"
                                        />
                                    </FullScreenDialog>
                                ) : null}
                            </div>
                            {wide ? viewSwitch : null}
                        </div>
                        {/* Compact: 결과 수 왼쪽 + 보기 전환 오른쪽 (목록 헤더 관례) · 정렬|필터는 위 행에서 1:1 */}
                        <div className="nl-discovery__summary-row">
                            <p
                                ref={summaryRef}
                                tabIndex={-1}
                                className="nl-discovery__summary nl-body-secondary nl-muted"
                            >
                                {summary}
                            </p>
                            {!wide ? viewSwitch : null}
                        </div>
                    </div>
                    <AppliedTokens
                        label={t("music.filter")}
                        clearLabel={t("discovery.clearFilters")}
                        onClear={clearFilters}
                        tokens={[
                            ...query.categories.map((category) => ({
                                key: `category-${category}`,
                                label: category,
                                removeLabel: t("discovery.removeCondition", {
                                    condition: category,
                                }),
                                onRemove: () =>
                                    commit({
                                        ...query,
                                        categories: query.categories.filter(
                                            (item) => item !== category
                                        ),
                                    }),
                            })),
                            ...query.difficulties.map((range) => {
                                const full =
                                    range.min === 1 &&
                                    range.max ===
                                        discoveryLevelBounds[range.difficulty];
                                const label = full
                                    ? range.difficulty
                                    : `${range.difficulty} · Lv.${range.min}–${range.max}`;
                                return {
                                    key: `difficulty-${range.difficulty}`,
                                    label,
                                    removeLabel: t(
                                        "discovery.removeCondition",
                                        { condition: label }
                                    ),
                                    onRemove: () =>
                                        commit({
                                            ...query,
                                            difficulties:
                                                query.difficulties.filter(
                                                    (item) =>
                                                        item.difficulty !==
                                                        range.difficulty
                                                ),
                                        }),
                                };
                            }),
                            ...query.records.map((record) => {
                                const label =
                                    record === "unplayed"
                                        ? t("music.filter.unplayed")
                                        : record === "s"
                                          ? "S"
                                          : record === "fc"
                                            ? "FC"
                                            : "Pianist";
                                return {
                                    key: `record-${record}`,
                                    label,
                                    removeLabel: t(
                                        "discovery.removeCondition",
                                        { condition: label }
                                    ),
                                    onRemove: () =>
                                        commit({
                                            ...query,
                                            records: query.records.filter(
                                                (item) => item !== record
                                            ),
                                        }),
                                };
                            }),
                        ]}
                    />
                    <section
                        aria-label={t("discovery.results")}
                        aria-busy={
                            pending ||
                            collection.isFetchingNextPage ||
                            undefined
                        }
                        className="nl-discovery__collection"
                        data-pending={pending || undefined}
                    >
                        {pending ? (
                            <p
                                role="status"
                                className="nl-body-secondary nl-muted"
                            >
                                {t("discovery.loading")}
                            </p>
                        ) : null}
                        {collection.isError &&
                        !collection.isFetchNextPageError ? (
                            <ResultState
                                error
                                message={t("discovery.error")}
                                action={
                                    <ActionButton
                                        variant="secondary"
                                        onClick={async () => {
                                            const result =
                                                await collection.refetch();
                                            if (!result.isError)
                                                summaryRef.current?.focus();
                                        }}
                                    >
                                        {t("common.retry")}
                                    </ActionButton>
                                }
                            />
                        ) : collection.isPending && pending ? (
                            <div
                                className="nl-discovery__skeleton"
                                aria-label={t("discovery.loading")}
                            >
                                {Array.from({ length: 8 }, (_, index) => (
                                    <div
                                        key={index}
                                        className="nl-result-skeleton"
                                    >
                                        <span />
                                        <div>
                                            <span />
                                            <span />
                                        </div>
                                        <span />
                                    </div>
                                ))}
                            </div>
                        ) : !collection.isPending && !items.length ? (
                            <ResultState
                                message={t(
                                    query.scope === "music"
                                        ? "discovery.emptyMusic"
                                        : "discovery.emptyChart"
                                )}
                            />
                        ) : null}
                        <div
                            ref={results}
                            className={cn(
                                "nl-discovery__items",
                                query.scope === "chart" &&
                                    "nl-discovery__items--chart",
                                query.scope !== "chart" &&
                                    query.view !== "list" &&
                                    "nl-discovery__items--grid",
                                query.scope !== "chart" &&
                                    query.view === "dense" &&
                                    "nl-discovery__items--dense"
                            )}
                        >
                            {items.map((music) => (
                                <div key={music.index} data-result>
                                    {query.scope === "chart" ? (
                                        <ChartResultGroup
                                            music={music}
                                            pending={pending}
                                        />
                                    ) : (
                                        <MusicResultCard
                                            music={music}
                                            view={query.view}
                                            pending={pending}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                    {items.length ? (
                        <div className="nl-discovery__progress">
                            {collection.isFetchNextPageError ? (
                                <p role="alert" className="nl-body-secondary">
                                    {t("discovery.moreError")}
                                </p>
                            ) : null}
                            {collection.hasNextPage ? (
                                <ActionButton
                                    variant="secondary"
                                    busy={collection.isFetchingNextPage}
                                    busyLabel={t("discovery.loading")}
                                    onClick={() => void loadMore()}
                                >
                                    {collection.isFetchNextPageError
                                        ? t("common.retry")
                                        : t("discovery.loadMore", {
                                              count: nextAmount,
                                          })}
                                </ActionButton>
                            ) : (
                                <p className="nl-body-secondary nl-muted">
                                    {t("discovery.complete")}
                                </p>
                            )}
                            <p className="nl-metadata nl-muted">
                                {t("discovery.progress", {
                                    count: items.length,
                                    total,
                                })}
                            </p>
                        </div>
                    ) : null}
                    <p className="sr-only" role="status">
                        {announcement}
                    </p>
                </div>
            </div>
        </PageContainer>
    );
}
