"use client";

import { ListFilter, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import ActionButton from "@/components/ui/actionButton";
import AppliedTokens from "@/components/ui/appliedTokens";
import FilterChips from "@/components/ui/filterChips";
import FilterGroup from "@/components/ui/filterGroup";
import FilterSurface from "@/components/ui/filterSurface";
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
    const parsed = bingoCatalogQuerySchema.parse({
        ...Object.fromEntries(params),
        count: Number(params.get("count") ?? 12),
    });
    const query = isAuthenticated
        ? parsed
        : { ...parsed, status: "all" as const, sort: "release" as const };
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<BingoCatalogQuery>(query);
    const wide = useMediaQuery("(min-width: 672px)");
    const visible = getBingoCatalog(items, query);
    const recent = isAuthenticated ? getRecentBingo(items) : undefined;
    const statuses = (
        ["all", "progress", "unlocked", "full", "chance"] as const
    ).map((value) => ({ value, label: t(`bingo.catalog.${value}`) }));
    const sorts = (["release", "recent", "progress"] as const).map((value) => ({
        value,
        label: t(`bingo.catalog.sort.${value}`),
    }));
    function commit(next: BingoCatalogQuery) {
        const search = new URLSearchParams({
            status: next.status,
            sort: next.sort,
            count: String(next.count),
        });
        window.history.pushState({}, "", `${pathname}?${search}`);
    }
    function setFilterOpen(value: boolean) {
        if (value) setDraft(query);
        setOpen(value);
    }
    // 팝오버(672+)는 즉시 적용, 전체 레이어는 배치 적용
    function changeStatus(status: BingoCatalogQuery["status"]) {
        const next = { ...draft, status, count: 12 };
        setDraft(next);
        if (wide) commit({ ...query, status, count: 12 });
    }
    const draftTotal = getBingoCatalog(items, draft).length;
    const statusLabel = statuses.find(
        (option) => option.value === query.status
    )?.label;
    return (
        <div className="nl-bingo-catalog">
            <h1 className="nl-page-title">{t("bingo.title")}</h1>
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
                        className="nl-bingo-catalog__controls"
                        data-filter-layout={wide ? "popover" : "fullscreen"}
                    >
                        <SortMenu
                            label={t("discovery.sortLabel")}
                            value={query.sort}
                            options={sorts}
                            onValueChange={(sort) =>
                                commit({ ...query, sort, count: 12 })
                            }
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
                            headerAction={
                                <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => changeStatus("all")}
                                >
                                    {t("common.reset")}
                                </ActionButton>
                            }
                            footer={
                                <ActionButton
                                    onClick={() => {
                                        commit({ ...draft, count: 12 });
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
                        onClear={() =>
                            commit({ ...query, status: "all", count: 12 })
                        }
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
                                                  count: 12,
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
                    {visible.slice(0, query.count).map((item) => (
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
                    {t(items.length ? "bingo.empty" : "bingo.catalogMissing")}
                </p>
            )}
            {visible.length > query.count ? (
                <Button
                    appearance="foundation"
                    variant="secondary"
                    onClick={() =>
                        commit({ ...query, count: query.count + 12 })
                    }
                >
                    {t("bingo.more")}
                </Button>
            ) : null}
        </div>
    );
}
