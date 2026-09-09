"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import { StatusMessage } from "@/components/ui/statusMessage";
import { communityOpinionOptions } from "@/features/music/api/community";
import type { OpinionPage } from "@/features/music/schemas/communitySchema";
import CommunityOpinionRow from "./communityOpinionRow";

export default function CommunityOpinions({
    chartId,
    initialData,
    accountId,
    returnTo,
    onEdit,
}: {
    chartId: number;
    initialData: OpinionPage;
    accountId?: number;
    returnTo: string;
    onEdit: () => void;
}) {
    const t = useTranslations();
    const id = useId();
    const [sort, setSort] = useState<"helpful" | "newest">("helpful");
    const list = useRef<HTMLDivElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const appendFocus = useRef<number | null>(null);
    const query = useInfiniteQuery({
        ...communityOpinionOptions({ chartId, sort }, accountId),
        initialData:
            sort === "helpful"
                ? { pageParams: [0], pages: [initialData] }
                : undefined,
    });
    const items =
        query.data?.pages
            .flatMap((page) => page.items)
            .filter(
                (item, index, all) =>
                    all.findIndex((other) => other.id === item.id) === index
            ) ?? [];
    useEffect(() => {
        if (appendFocus.current === null || items.length <= appendFocus.current)
            return;
        list.current
            ?.querySelectorAll<HTMLElement>("article")
            [appendFocus.current]?.focus();
        appendFocus.current = null;
    }, [items.length]);
    const handleMore = async () => {
        appendFocus.current = items.length;
        const result = await query.fetchNextPage();
        if (result.isError) appendFocus.current = null;
    };
    return (
        <section
            className="nl-opinions"
            aria-labelledby={id}
            aria-busy={query.isFetching}
        >
            <div className="nl-opinions__header">
                <div className="nl-opinions__toolbar">
                    <h2
                        id={id}
                        ref={heading}
                        tabIndex={-1}
                        className="nl-section-title"
                    >
                        {t("community.opinions", {
                            count:
                                query.data?.pages[0].total ?? initialData.total,
                        })}
                    </h2>
                    <div className="nl-opinions__sort">
                        {(["helpful", "newest"] as const).map((value) => (
                            <ActionButton
                                key={value}
                                variant={sort === value ? "secondary" : "ghost"}
                                aria-pressed={sort === value}
                                onClick={() => {
                                    setSort(value);
                                    if (value === sort) void query.refetch();
                                }}
                            >
                                {t(
                                    value === "helpful"
                                        ? "community.sortHelpful"
                                        : "community.sortNewest"
                                )}
                            </ActionButton>
                        ))}
                    </div>
                </div>
            </div>
            <div className="nl-opinions__list" ref={list}>
                {items.map((item) => (
                    <CommunityOpinionRow
                        key={item.id}
                        item={item}
                        chartId={chartId}
                        accountId={accountId}
                        returnTo={returnTo}
                        onEdit={onEdit}
                        onDeleted={() => heading.current?.focus()}
                    />
                ))}
            </div>
            {query.isPending ? (
                <div
                    className="nl-skeleton nl-opinion-placeholder"
                    aria-hidden
                />
            ) : !items.length && !query.isError ? (
                <p className="nl-body-secondary nl-muted">
                    {t("community.noOpinions")}
                </p>
            ) : null}
            {query.isError ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("community.loadError")}
                    action={
                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                void (query.isFetchNextPageError
                                    ? query.fetchNextPage()
                                    : query.refetch())
                            }
                        >
                            {t("common.retry")}
                        </ActionButton>
                    }
                />
            ) : null}
            {query.hasNextPage && !query.isError ? (
                <ActionButton
                    variant="secondary"
                    busy={query.isFetchingNextPage}
                    onClick={() => void handleMore()}
                >
                    {t("community.moreOpinions")}
                </ActionButton>
            ) : null}
        </section>
    );
}
