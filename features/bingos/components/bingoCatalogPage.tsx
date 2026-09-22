"use client";

import { LayoutGrid, List } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import FilterChips from "@/components/ui/filterChips";
import SearchField from "@/components/ui/searchField";
import { SegmentedControl } from "@/components/ui/segmentedControl";
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
    const wide = useMediaQuery("(min-width: 672px)");
    const visible = getBingoCatalog(items, query);
    const searching = query.q.trim() !== "";
    // 검색 중에는 「최근 기록」 을 숨긴다 — 찾는 판과 상관없는 카드가 결과 앞에 끼지 않게
    const recent =
        isAuthenticated && !searching ? getRecentBingo(items) : undefined;
    // 상태 칩(2026-09-22) — 필터 창 대신 늘 보이는 한 줄, 칩마다 지금 검색어 기준 개수. 게스트는 기록이 없어 칩 없음
    const statuses = (
        ["all", "progress", "unlocked", "full", "chance"] as const
    ).map((value) => ({
        value,
        label: t(`bingo.catalog.${value}`),
        count: getBingoCatalog(items, { ...query, status: value }).length,
    }));
    const sorts = (["release", "recent", "progress"] as const).map((value) => ({
        value,
        label: t(`bingo.catalog.sort.${value}`),
    }));
    // 정렬 · 상태 · 보기는 한 걸음씩 뒤로가기에 남기고, 검색어 입력은 글자마다 쌓이지 않게 현재 기록을 바꾼다
    function commit(next: BingoCatalogQuery, replace = false) {
        const nextParams = new URLSearchParams({
            status: next.status,
            sort: next.sort,
        });
        if (next.q) nextParams.set("q", next.q);
        if (next.view === "list") nextParams.set("view", "list");
        const url = `${pathname}?${nextParams}`;
        if (replace) window.history.replaceState({}, "", url);
        else window.history.pushState({}, "", url);
    }
    function commitSearch(q: string) {
        setSearch(q);
        setCommittedQuery(q);
        commit({ ...query, q }, true);
    }
    // 보기 전환 — 악곡 목록과 같은 부품 · 문구(폰 M · 672 이상 L)
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
    const listClass =
        query.view === "list"
            ? "nl-bingo-catalog__list"
            : "nl-bingo-catalog__grid";
    return (
        <div className="nl-bingo-catalog">
            {/* 머리(2026-09-22): 제목 → (폰) 개수 메타 → 검색(전체 폭) → 상태 칩(로그인) → 정렬 · 보기 전환 */}
            <div
                className="nl-bingo-catalog__head"
                data-compact={wide ? undefined : ""}
            >
                <h1 className="nl-page-title">{t("bingo.title")}</h1>
                {!wide ? (
                    <p className="nl-bingo-catalog__summary nl-metadata nl-muted">
                        {t("bingo.countShort", { count: visible.length })}
                    </p>
                ) : null}
                <div className="nl-bingo-catalog__search-row">
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
            </div>
            <div className="nl-filter-control-block nl-bingo-catalog__controls">
                {isAuthenticated ? (
                    <FilterChips
                        label={t("bingo.catalog.status")}
                        multiple={false}
                        value={[query.status]}
                        onValueChange={([status]) =>
                            commit({ ...query, status })
                        }
                        options={statuses}
                    />
                ) : null}
                <div className="nl-bingo-catalog__summary-row">
                    {isAuthenticated ? (
                        <SortMenu
                            label={t("discovery.sortLabel")}
                            value={query.sort}
                            options={sorts}
                            onValueChange={(sort) => commit({ ...query, sort })}
                            variant={wide ? undefined : "ghost"}
                            size={wide ? undefined : "sm"}
                        />
                    ) : null}
                    {viewSwitch}
                </div>
            </div>
            {recent ? (
                <section
                    className="nl-bingo-recent"
                    aria-labelledby="bingo-recent-title"
                >
                    <h2 id="bingo-recent-title" className="nl-component-title">
                        {t("bingo.recent")}
                    </h2>
                    <div className={listClass}>
                        <BingoCatalogCard
                            item={recent}
                            isAuthenticated
                            view={query.view}
                        />
                    </div>
                </section>
            ) : null}
            {visible.length ? (
                <ul className={listClass}>
                    {visible.map((item) => (
                        <li key={item.id}>
                            <BingoCatalogCard
                                item={item}
                                isAuthenticated={isAuthenticated}
                                view={query.view}
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
