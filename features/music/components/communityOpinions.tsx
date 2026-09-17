"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Disclosure from "@/components/ui/disclosure";
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
    composer,
    headerAction,
    editor,
}: {
    chartId: number;
    initialData: OpinionPage;
    accountId?: number;
    returnTo: string;
    onEdit: () => void;
    /** 구역 제목 아래 새 의견 작성 칸 */
    composer?: ReactNode;
    /** 제목 줄 오른쪽 끝 — 로그아웃이면 「로그인하고 의견 남기기 ›」 */
    headerAction?: ReactNode;
    /** 내 의견을 고치는 중이면 그 줄에 넣을 작성 칸 */
    editor?: ReactNode;
}) {
    const t = useTranslations();
    const id = useId();
    // 의견은 최신순 하나 — 추천 기능을 없애 「추천순」 도 뺐다(2026-09-16)
    const sort = "newest" as const;
    const list = useRef<HTMLDivElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const appendFocus = useRef<number | null>(null);
    const query = useInfiniteQuery({
        ...communityOpinionOptions({ chartId, sort }, accountId),
        initialData: { pageParams: [0], pages: [initialData] },
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
        <Disclosure
            className="nl-opinions"
            heading="section"
            open
            aria-busy={query.isFetching}
            title={t("community.opinions", {
                count: query.data?.pages[0].total ?? initialData.total,
            })}
            titleId={id}
            titleRef={heading}
        >
            {/* 제목 줄이 펼침 줄이 되면서 로그인 링크는 내용 첫 줄로 (2026-09-18 아코디언) */}
            {headerAction ? (
                <div className="nl-heading-row">{headerAction}</div>
            ) : null}
            <div className="nl-opinions__body">
                {composer}
                {items.length ? (
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
                                editor={item.own ? editor : undefined}
                            />
                        ))}
                    </div>
                ) : null}
                {query.isPending ? (
                    <div
                        className="nl-skeleton nl-opinion-placeholder"
                        aria-hidden
                    />
                ) : !items.length && !composer && !query.isError ? (
                    // 작성 칸이 없는 로그아웃 화면에서는 구역이 통째로 비므로 한 줄을 남긴다 (2026-09-18 E2)
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
                                size="sm"
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
                        busyLabel={t("discovery.loading")}
                        onClick={() => void handleMore()}
                    >
                        {t("community.moreOpinions")}
                    </ActionButton>
                ) : null}
            </div>
        </Disclosure>
    );
}
