"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Disclosure from "@/components/ui/disclosure";
import SortMenu from "@/components/ui/sortMenu";
import { StatusMessage } from "@/components/ui/statusMessage";
import { communityOpinionOptions } from "@/features/music/api/community";
import type { OpinionPage } from "@/features/music/schemas/communitySchema";
import CommunityOpinionRow, {
    CommunityOpinionRowSkeleton,
} from "./communityOpinionRow";

export default function CommunityOpinions({
    chartId,
    initialData,
    accountId,
    returnTo,
    onEdit,
    composer,
    headerAction,
    editor,
    canReply = false,
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
    /** 로그인했고 이 채보 기록이 있어 답글을 쓸 수 있는지(2026-09-22) */
    canReply?: boolean;
}) {
    const t = useTranslations();
    const id = useId();
    // 최신순 · 좋아요순(2026-09-22 — 좋아요를 되살리며 정렬도 되살림). 첫 화면에 받은 목록은 최신순
    const [sort, setSort] = useState<"newest" | "helpful">("newest");
    const list = useRef<HTMLDivElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const appendFocus = useRef<number | null>(null);
    const query = useInfiniteQuery({
        ...communityOpinionOptions({ chartId, sort }, accountId),
        initialData:
            sort === "newest"
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
                {/* 정렬은 의견이 둘 이상일 때만 — 목록 위 왼쪽 고스트(악곡 · 서열 결과 줄과 같은 자리) */}
                {(query.data?.pages[0].total ?? initialData.total) > 1 ? (
                    <div className="nl-opinions__sort">
                        <SortMenu
                            variant="ghost"
                            size="sm"
                            label={t("discovery.sortLabel")}
                            value={sort}
                            onValueChange={setSort}
                            options={[
                                {
                                    value: "newest",
                                    label: t("community.sort.newest"),
                                },
                                {
                                    value: "helpful",
                                    label: t("community.sort.likes"),
                                },
                            ]}
                        />
                    </div>
                ) : null}
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
                                canReply={canReply}
                                translationEnabled={
                                    query.data?.pages[0].translationEnabled ??
                                    initialData.translationEnabled
                                }
                            />
                        ))}
                    </div>
                ) : null}
                {query.isPending ? (
                    // 불러오는 동안 — 의견 목록과 같은 줄 틀의 스켈레톤
                    <div className="nl-opinions__list" aria-hidden="true">
                        {[0, 1].map((index) => (
                            <CommunityOpinionRowSkeleton key={index} />
                        ))}
                    </div>
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
