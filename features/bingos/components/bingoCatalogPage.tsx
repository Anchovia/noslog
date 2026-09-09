"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListFilter, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import BingoFilterSurface from "@/features/bingos/components/bingoFilterSurface";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import RadioGroup from "@/components/ui/radioGroup";
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
    const wide = useMediaQuery("(min-width: 672px)");
    const form = useForm<
        z.input<typeof bingoCatalogQuerySchema>,
        unknown,
        BingoCatalogQuery
    >({ resolver: zodResolver(bingoCatalogQuerySchema), defaultValues: query });
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
        if (value) form.reset(query);
        setOpen(value);
    }
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
                <div
                    className="nl-bingo-catalog__controls"
                    data-filter-layout={wide ? "popover" : "fullscreen"}
                >
                    <BingoFilterSurface
                        wide={wide}
                        open={open}
                        onOpenChange={setFilterOpen}
                        title={t("discovery.filterSort")}
                        trigger={
                            <Button
                                appearance="foundation"
                                variant="secondary"
                                size="sm"
                            >
                                <ListFilter className="nl-icon" aria-hidden />
                                {t("discovery.filterSort")}
                                {query.status !== "all" ? " (1)" : ""}
                                <ChevronDown className="nl-icon" aria-hidden />
                            </Button>
                        }
                        footer={
                            <Button
                                appearance="foundation"
                                onClick={form.handleSubmit((next) => {
                                    commit({ ...next, count: 12 });
                                    setOpen(false);
                                })}
                            >
                                {t("bingo.apply")}
                            </Button>
                        }
                    >
                        <form
                            className="nl-bingo-catalog__filter-form"
                            noValidate
                            onSubmit={form.handleSubmit((next) => {
                                commit({ ...next, count: 12 });
                                setOpen(false);
                            })}
                        >
                            <Controller
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <RadioGroup
                                        label={t("bingo.filter")}
                                        value={field.value ?? "all"}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            if (wide)
                                                commit({
                                                    ...query,
                                                    status: value,
                                                    count: 12,
                                                });
                                        }}
                                        options={statuses}
                                    />
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="sort"
                                render={({ field }) => (
                                    <RadioGroup
                                        label={t("discovery.sortLabel")}
                                        value={field.value ?? "release"}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            if (wide)
                                                commit({
                                                    ...query,
                                                    sort: value,
                                                    count: 12,
                                                });
                                        }}
                                        options={sorts}
                                    />
                                )}
                            />
                        </form>
                    </BingoFilterSurface>
                    <p className="nl-metadata nl-muted">
                        {
                            statuses.find(
                                (option) => option.value === query.status
                            )?.label
                        }{" "}
                        ·{" "}
                        {
                            sorts.find((option) => option.value === query.sort)
                                ?.label
                        }
                    </p>
                </div>
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
