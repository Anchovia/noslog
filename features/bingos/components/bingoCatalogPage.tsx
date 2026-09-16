"use client";

import { ListFilter, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import AppliedTokens from "@/components/ui/appliedTokens";
import FilterChips from "@/components/ui/filterChips";
import FilterGroup from "@/components/ui/filterGroup";
import FilterSurface from "@/components/ui/filterSurface";
import SearchField from "@/components/ui/searchField";
import SortMenu from "@/components/ui/sortMenu";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import BingoCatalogCard from "@/features/bingos/components/bingoCatalogCard";
import {
    getBingoCatalog,
    getRecentBingo,
} from "@/features/bingos/bingoCatalog";
import {
    bingoCatalogQuerySchema,
    type BingoCatalogItem,
    type BingoCatalogQuery,
} from "@/features/bingos/schemas/publicBingoSchema";

export default function BingoCatalogPage({
    items,
    isAuthenticated,
}: {
    items: BingoCatalogItem[];
    isAuthenticated: boolean;
}) {
    const t = useTranslations();
    const pathname = usePathname();
    const params = useSearchParams();
    const parsed = bingoCatalogQuerySchema.parse(Object.fromEntries(params));
    const query = isAuthenticated
        ? parsed
        : { ...parsed, status: "all" as const, sort: "release" as const };
    // 검색어는 입력 칸이 직접 든다 — URL 을 거쳐 되받으면 한 박자 늦은 값이 덮여 한글 조합이 끊긴다(오락실과 같은 방식).
    // URL 반영은 조합이 끝났을 때만. 뒤로가기처럼 밖에서 바뀐 검색어만 입력 칸으로 받아 온다
    const [search, setSearch] = useState(query.q);
    const [committedQuery, setCommittedQuery] = useState(query.q);
    const composing = useRef(false);
    if (query.q !== committedQuery) {
        setCommittedQuery(query.q);
        setSearch(query.q);
    }
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<BingoCatalogQuery>(query);
    const wide = useMediaQuery("(min-width: 672px)");
    const visible = getBingoCatalog(items, query);
    const searching = query.q.trim() !== "";
    // 검색 중에는 「최근 기록」 을 숨긴다 — 찾는 판과 상관없는 카드가 결과 앞에 끼지 않게
    const recent =
        isAuthenticated && !searching ? getRecentBingo(items) : undefined;
    const statuses = (
        ["all", "progress", "unlocked", "full", "chance"] as const
    ).map((value) => ({ value, label: t(`bingo.catalog.${value}`) }));
    const sorts = (["release", "recent", "progress"] as const).map((value) => ({
        value,
        label: t(`bingo.catalog.sort.${value}`),
    }));
    // 정렬·필터는 한 걸음씩 뒤로가기에 남기고, 검색어 입력은 글자마다 쌓이지 않게 현재 기록을 바꾼다
    function commit(next: BingoCatalogQuery, replace = false) {
        const nextParams = new URLSearchParams({
            status: next.status,
            sort: next.sort,
        });
        if (next.q) nextParams.set("q", next.q);
        const url = `${pathname}?${nextParams}`;
        if (replace) window.history.replaceState({}, "", url);
        else window.history.pushState({}, "", url);
    }
    function commitSearch(q: string) {
        setSearch(q);
        setCommittedQuery(q);
        commit({ ...query, q }, true);
    }
    function setFilterOpen(value: boolean) {
        if (value) setDraft(query);
        setOpen(value);
    }
    // 팝오버(672+)는 즉시 적용, 전체 레이어는 배치 적용
    function changeStatus(status: BingoCatalogQuery["status"]) {
        const next = { ...draft, status };
        setDraft(next);
        if (wide) commit({ ...query, status });
    }
    const draftTotal = getBingoCatalog(items, draft).length;
    const statusLabel = statuses.find(
        (option) => option.value === query.status
    )?.label;
    return (
        <div className="nl-bingo-catalog">
            <div className="nl-bingo-catalog__head">
                <h1 className="nl-page-title">{t("bingo.title")}</h1>
                <SearchField
                    value={search}
                    maxLength={200}
                    aria-label={t("bingo.search")}
                    placeholder={t("bingo.searchPlaceholder")}
                    clearLabel={t("discovery.clearQuery")}
                    onClear={() => commitSearch("")}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        if (!composing.current)
                            commitSearch(event.target.value);
                    }}
                    onCompositionStart={() => {
                        composing.current = true;
                    }}
                    onCompositionEnd={(event) => {
                        composing.current = false;
                        commitSearch(event.currentTarget.value);
                    }}
                />
            </div>
            {recent ? (
                <section
                    className="nl-bingo-recent"
                    aria-labelledby="bingo-recent-title"
                >
                    <h2 id="bingo-recent-title" className="nl-component-title">
                        {t("bingo.recent")}
                    </h2>
                    <div className="nl-bingo-catalog__grid">
                        <BingoCatalogCard item={recent} isAuthenticated />
                    </div>
                </section>
            ) : null}
            {isAuthenticated ? (
                <>
                    <div
                        className={
                            wide
                                ? "nl-bingo-catalog__controls nl-filter-toolbar"
                                : "nl-bingo-catalog__controls nl-filter-toolbar nl-filter-toolbar--split"
                        }
                        data-filter-layout={wide ? "popover" : "fullscreen"}
                    >
                        <SortMenu
                            label={t("discovery.sortLabel")}
                            value={query.sort}
                            options={sorts}
                            onValueChange={(sort) => commit({ ...query, sort })}
                        />
                        <FilterSurface
                            popover={wide}
                            open={open}
                            onOpenChange={setFilterOpen}
                            title={t("bingo.filter")}
                            trigger={
                                <ActionButton
                                    variant="secondary"
                                    className="nl-filter-trigger"
                                    aria-label={t("bingo.filter")}
                                >
                                    <ListFilter
                                        className="nl-icon-small"
                                        aria-hidden
                                    />
                                    {t("bingo.filter")}
                                    {query.status !== "all" ? (
                                        <span className="nl-filter-count nl-metadata">
                                            1
                                        </span>
                                    ) : null}
                                    <ChevronDown
                                        className="nl-icon-small"
                                        aria-hidden
                                    />
                                </ActionButton>
                            }
                            onReset={() => changeStatus("all")}
                            footer={
                                <ActionButton
                                    onClick={() => {
                                        commit(draft);
                                        setOpen(false);
                                    }}
                                >
                                    {t("discovery.apply", {
                                        count: draftTotal,
                                    })}
                                </ActionButton>
                            }
                        >
                            <FilterGroup label={t("bingo.catalog.status")}>
                                <FilterChips
                                    label={t("bingo.catalog.status")}
                                    multiple={false}
                                    value={[draft.status]}
                                    onValueChange={([status]) =>
                                        changeStatus(status)
                                    }
                                    options={statuses}
                                />
                            </FilterGroup>
                        </FilterSurface>
                    </div>
                    <AppliedTokens
                        label={t("bingo.filter")}
                        clearLabel={t("discovery.clearFilters")}
                        onClear={() => commit({ ...query, status: "all" })}
                        tokens={
                            query.status !== "all" && statusLabel
                                ? [
                                      {
                                          key: "status",
                                          label: statusLabel,
                                          removeLabel: t(
                                              "discovery.removeCondition",
                                              { condition: statusLabel }
                                          ),
                                          onRemove: () =>
                                              commit({
                                                  ...query,
                                                  status: "all",
                                              }),
                                      },
                                  ]
                                : []
                        }
                    />
                </>
            ) : null}
            {visible.length ? (
                <ul className="nl-bingo-catalog__grid">
                    {visible.map((item) => (
                        <li key={item.id}>
                            <BingoCatalogCard
                                item={item}
                                isAuthenticated={isAuthenticated}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p
                    className="nl-body-secondary nl-bingo-catalog__empty"
                    role="status"
                >
                    {t(
                        !items.length
                            ? "bingo.catalogMissing"
                            : searching
                              ? "bingo.searchEmpty"
                              : "bingo.empty"
                    )}
                </p>
            )}
        </div>
    );
}
