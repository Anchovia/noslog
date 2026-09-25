"use client";

import {
    keepPreviousData,
    useInfiniteQuery,
    useQuery,
} from "@tanstack/react-query";
import { ChevronDown, ListFilter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import AppliedTokens from "@/components/ui/appliedTokens";
import Button from "@/components/ui/Button";
import FilterChips from "@/components/ui/filterChips";
import FilterGroup from "@/components/ui/filterGroup";
import FilterSurface from "@/components/ui/filterSurface";
import MetricSwitch from "@/components/ui/metricSwitch";
import SearchField from "@/components/ui/searchField";
import { LoadingStatus } from "@/components/ui/skeleton";
import SortMenu from "@/components/ui/sortMenu";
import { StatusMessage } from "@/components/ui/statusMessage";
import {
    profileRecordsCountOptions,
    profileRecordsOptions,
    type ProfileRecordsFilter,
} from "@/features/profile/api/profileRecords";
import {
    PROFILE_RECORD_DIFFICULTIES,
    PROFILE_RECORD_LAMPS,
    PROFILE_RECORD_RANKS,
    PROFILE_RECORD_SORTS,
    type ProfileMode,
    type ProfileRecordsPayload,
} from "@/features/profile/schemas/publicProfileSchema";
import useDebouncedValue from "@/lib/hooks/useDebouncedValue";
import useDelayedFlag from "@/lib/hooks/useDelayedFlag";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { rankDisplayName } from "@/components/music/musicDetailConfig";
import ProfilePlayRow, {
    ProfilePlayListHead,
    ProfilePlayListSkeleton,
} from "./profilePlayRow";

type Conditions = Pick<ProfileRecordsFilter, "difficulty" | "rank" | "lamp">;
const NO_CONDITIONS: Conditions = { difficulty: [], rank: [], lamp: [] };

/**
 * 프로필 「기록」 탭(2026-09-25 2단계) — 위 줄: 2단 탭(베스트 50 · 모든 기록) | 검색 · 필터 · 정렬(악곡 목록과 같은 부품),
 * 그 아래 곡 수 · 적용 조건, 표(순번 · 자켓 · 곡 · 난이도 · 점수 · 등급 · 곡 순위 · 날짜 · Grd), 20개씩 「더 보기」.
 * 필터 그릇 = 672 이상 팝오버(즉시 적용) · 폰 전체 화면 창(「기록 N곡 보기」)
 */
export default function ProfileRecords({
    userId,
    counts,
    initialData,
}: {
    userId: number;
    counts: { best: number; all: number };
    initialData: ProfileRecordsPayload | null;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const params = useSearchParams();
    const mode: ProfileMode =
        params.get("mode") === "recital" ? "recital" : "basic";
    const popover = useMediaQuery("(min-width: 672px)");
    const [view, setView] = useState<ProfileRecordsFilter["view"]>("best");
    const [search, setSearch] = useState("");
    const q = useDebouncedValue(search.trim(), 300);
    const [conditions, setConditions] = useState<Conditions>(NO_CONDITIONS);
    const [draft, setDraft] = useState<Conditions>(NO_CONDITIONS);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sort, setSort] = useState<ProfileRecordsFilter["sort"]>("value");
    const filter: ProfileRecordsFilter = {
        view,
        mode,
        q,
        sort,
        ...conditions,
    };
    const isInitial =
        view === "best" &&
        mode === (initialData?.query.mode ?? "basic") &&
        !q &&
        sort === "value" &&
        !conditions.difficulty.length &&
        !conditions.rank.length &&
        !conditions.lamp.length;
    const result = useInfiniteQuery({
        ...profileRecordsOptions(userId, filter),
        initialData:
            isInitial && initialData
                ? { pages: [initialData], pageParams: [0] }
                : undefined,
        placeholderData: keepPreviousData,
    });
    const draftCount = useQuery({
        ...profileRecordsCountOptions(userId, { ...filter, ...draft }),
        enabled: filterOpen && !popover,
    });
    // 보기 · 조건 · 정렬이 바뀌면 순서와 값의 뜻이 바뀐다 — 이전 목록 대신 같은 틀의 스켈레톤(2026-09-19 S1)
    const switching = useDelayedFlag(
        result.isPlaceholderData && result.isFetching
    );
    const pages = result.data?.pages ?? [];
    const plays = pages.flatMap((page) => page.items);
    const total = pages[0]?.total ?? 0;
    const filterCount = [
        conditions.difficulty,
        conditions.rank,
        conditions.lamp,
    ].filter((group) => group.length).length;
    function apply(next: Conditions) {
        setConditions(next);
        setDraft(next);
    }
    function change<Key extends keyof Conditions>(
        key: Key,
        values: Conditions[Key]
    ) {
        const next = { ...draft, [key]: values };
        setDraft(next);
        if (popover) setConditions(next);
    }
    const lampLabel = (lamp: (typeof PROFILE_RECORD_LAMPS)[number]) =>
        t(`profile.records.lamp.${lamp}`);
    const difficultyLabel = (value: string) => value.toUpperCase();
    const filterGroups = (
        <>
            <FilterGroup label={t("profile.column.difficulty")}>
                <FilterChips
                    label={t("profile.column.difficulty")}
                    value={draft.difficulty}
                    onValueChange={(values) => change("difficulty", values)}
                    options={PROFILE_RECORD_DIFFICULTIES.map((value) => ({
                        value,
                        label: difficultyLabel(value),
                    }))}
                />
            </FilterGroup>
            <FilterGroup label={t("profile.column.rank")}>
                <FilterChips
                    label={t("profile.column.rank")}
                    value={draft.rank}
                    onValueChange={(values) => change("rank", values)}
                    options={PROFILE_RECORD_RANKS.map((value) => ({
                        value,
                        label: rankDisplayName(value),
                    }))}
                />
            </FilterGroup>
            <FilterGroup label={t("profile.records.lamp")}>
                <FilterChips
                    label={t("profile.records.lamp")}
                    value={draft.lamp}
                    onValueChange={(values) => change("lamp", values)}
                    options={PROFILE_RECORD_LAMPS.map((value) => ({
                        value,
                        label: lampLabel(value),
                    }))}
                />
            </FilterGroup>
        </>
    );
    const filterTrigger = (
        <ActionButton
            variant="secondary"
            className="nl-filter-trigger"
            aria-label={t("arcades.filters")}
        >
            <ListFilter className="nl-icon-small" aria-hidden />
            {t("arcades.filters")}
            {filterCount ? (
                <span className="nl-filter-count nl-metadata">
                    {filterCount}
                </span>
            ) : null}
            {popover ? (
                <ChevronDown className="nl-icon-small" aria-hidden />
            ) : null}
        </ActionButton>
    );
    const tokens = [
        ...conditions.difficulty.map((value) => ({
            key: `difficulty-${value}`,
            label: difficultyLabel(value),
            group: "difficulty" as const,
            value,
        })),
        ...conditions.rank.map((value) => ({
            key: `rank-${value}`,
            label: rankDisplayName(value),
            group: "rank" as const,
            value,
        })),
        ...conditions.lamp.map((value) => ({
            key: `lamp-${value}`,
            label: lampLabel(value),
            group: "lamp" as const,
            value,
        })),
    ];
    return (
        <section
            className="nl-profile-section nl-profile-records"
            data-kind={view}
            aria-label={t("profile.tabs.records")}
        >
            <div className="nl-profile-records__toolbar">
                <MetricSwitch
                    label={t("profile.records.viewLabel")}
                    value={view}
                    onValueChange={setView}
                    options={[
                        {
                            value: "best",
                            label: t("profile.records.best", {
                                count: counts.best.toLocaleString(locale),
                            }),
                            shortLabel: t("profile.records.best", {
                                count: counts.best.toLocaleString(locale),
                            }),
                        },
                        {
                            value: "all",
                            label: t("profile.records.all", {
                                count: counts.all.toLocaleString(locale),
                            }),
                            shortLabel: t("profile.records.all", {
                                count: counts.all.toLocaleString(locale),
                            }),
                        },
                    ]}
                />
                <div className="nl-profile-records__actions">
                    <SearchField
                        className="nl-profile-records__search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onClear={() => setSearch("")}
                        clearLabel={t("discovery.clearQuery")}
                        placeholder={t("profile.records.search")}
                        aria-label={t("profile.records.search")}
                    />
                    <div className="nl-filter-toolbar">
                        <FilterSurface
                            popover={popover}
                            open={filterOpen}
                            onOpenChange={(open) => {
                                setFilterOpen(open);
                                if (open) setDraft(conditions);
                            }}
                            title={t("arcades.filters")}
                            trigger={filterTrigger}
                            onReset={() => {
                                setDraft(NO_CONDITIONS);
                                if (popover) setConditions(NO_CONDITIONS);
                            }}
                            footer={
                                <ActionButton
                                    className="nl-profile-records__apply"
                                    onClick={() => {
                                        apply(draft);
                                        setFilterOpen(false);
                                    }}
                                >
                                    {t("profile.records.viewResults", {
                                        count: (
                                            draftCount.data ?? total
                                        ).toLocaleString(locale),
                                    })}
                                </ActionButton>
                            }
                        >
                            <div className="nl-profile-records__filters">
                                {filterGroups}
                            </div>
                        </FilterSurface>
                        <SortMenu
                            variant="ghost"
                            label={t("discovery.sortLabel")}
                            value={sort}
                            onValueChange={setSort}
                            options={PROFILE_RECORD_SORTS.map((value) => ({
                                value,
                                label: t(`profile.records.sort.${value}`),
                            }))}
                        />
                    </div>
                </div>
            </div>
            <div className="nl-profile-records__summary">
                <span className="nl-metadata nl-muted">
                    {view === "best"
                        ? t("profile.records.bestNote")
                        : t("profile.records.count", {
                              count: total.toLocaleString(locale),
                          })}
                    {view === "best" && (filterCount || q)
                        ? ` · ${t("profile.records.count", { count: total.toLocaleString(locale) })}`
                        : ""}
                </span>
                <AppliedTokens
                    label={t("arcades.filters")}
                    clearLabel={t("discovery.clearFilters")}
                    onClear={() => apply(NO_CONDITIONS)}
                    tokens={tokens.map((token) => ({
                        key: token.key,
                        label: token.label,
                        removeLabel: t("discovery.removeCondition", {
                            condition: token.label,
                        }),
                        onRemove: () =>
                            apply({
                                ...conditions,
                                [token.group]: (
                                    conditions[token.group] as string[]
                                ).filter((item) => item !== token.value),
                            }),
                    }))}
                />
            </div>
            <div
                className="nl-profile-plays__content"
                aria-busy={result.isFetching}
            >
                {switching || (result.isPending && !plays.length) ? (
                    <>
                        <LoadingStatus label={t("profile.loading")} />
                        <ProfilePlayListSkeleton count={8} />
                    </>
                ) : plays.length ? (
                    <>
                        <ProfilePlayListHead kind={view} metric="grade" />
                        <ol
                            className="nl-profile-play-list"
                            aria-label={t(
                                view === "best"
                                    ? "profile.bestPlays"
                                    : "profile.tabs.records"
                            )}
                        >
                            {plays.map((play) => (
                                <ProfilePlayRow
                                    key={play.id}
                                    play={play}
                                    metric="grade"
                                    position={view === "best"}
                                />
                            ))}
                        </ol>
                    </>
                ) : result.isError ? null : (
                    <StatusMessage title={t("profile.records.empty")} />
                )}
            </div>
            {result.isError ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("profile.sectionFailed")}
                    action={
                        <Button
                            variant="secondary"
                            onClick={() =>
                                void (result.isFetchNextPageError
                                    ? result.fetchNextPage()
                                    : result.refetch())
                            }
                        >
                            {t("common.retry")}
                        </Button>
                    }
                />
            ) : null}
            {!switching && result.hasNextPage ? (
                <div className="nl-profile-list-actions">
                    <Button
                        variant="secondary"
                        disabled={result.isFetching}
                        onClick={() => void result.fetchNextPage()}
                    >
                        {t("profile.more")}
                    </Button>
                </div>
            ) : null}
        </section>
    );
}
