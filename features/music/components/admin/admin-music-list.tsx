"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronRight, LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { listAdminMusic } from "@/app/admin/music/actions";
import MusicTranslationApproveButton from "@/features/music/components/admin/music-translation-approve-button";
import type { AdminMusicListParams } from "@/features/music/server/music-translation-admin-service";
import type {
    AdminMusicListData,
    AdminMusicPage,
} from "@/features/music/types/music-admin";
import useDebouncedValue from "@/lib/hooks/use-debounced-value";

/**
 * 관리자 악곡 목록(2026-09-25) — 사용자 악곡 검색처럼 입력하면 300ms 뒤 자동 검색(대소문자 무시 · 번역 제목 · 가나 읽기),
 * 40곡씩 무한 스크롤. 모양은 기존 관리자 목록 그대로. 필터(상수 없음 · 번역 상태)는 주소 값을 그대로 쓴다.
 */
export default function AdminMusicList({
    initial,
    filters,
}: {
    initial: AdminMusicListData;
    filters: Omit<AdminMusicListParams, "q">;
}) {
    const [draft, setDraft] = useState(initial.query);
    const q = useDebouncedValue(draft.trim(), 300);
    const sentinel = useRef<HTMLDivElement>(null);
    const initialQuery = initial.query.trim();

    // 검색어를 주소에도 남긴다(새로고침 · 뒤로 가기 뒤에도 같은 목록)
    useEffect(() => {
        const url = new URL(window.location.href);
        if (q) url.searchParams.set("q", q);
        else url.searchParams.delete("q");
        window.history.replaceState(null, "", url);
    }, [q]);

    const list = useInfiniteQuery({
        queryKey: ["admin-music", q, filters],
        queryFn: ({ pageParam }) =>
            listAdminMusic({ ...filters, q }, pageParam),
        initialPageParam: 0,
        getNextPageParam: (last: AdminMusicPage, pages) =>
            last.hasMore
                ? pages.reduce((sum, page) => sum + page.musics.length, 0)
                : undefined,
        initialData:
            q === initialQuery
                ? {
                      pages: [
                          { musics: initial.musics, hasMore: initial.hasMore },
                      ],
                      pageParams: [0],
                  }
                : undefined,
        staleTime: 30_000,
    });

    const { hasNextPage, isFetchingNextPage, fetchNextPage } = list;
    useEffect(() => {
        const target = sentinel.current;
        if (!target || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !isFetchingNextPage)
                    void fetchNextPage();
            },
            { rootMargin: "400px 0px" }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const musics = list.data?.pages.flatMap((page) => page.musics) ?? [];
    const searching = list.isFetching && !isFetchingNextPage;

    return (
        <>
            <div className="relative" role="search">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-disabled" />
                <input
                    type="search"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="곡 제목 · 한국어 · 영어 번역 · 아티스트 · 식별자 검색"
                    aria-label="악곡 검색"
                    className="h-11 w-full rounded-md border border-border bg-surface pr-10 pl-10 text-input"
                />
                {searching ? (
                    <LoaderCircle
                        aria-hidden
                        className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-text-disabled"
                    />
                ) : null}
            </div>
            <section
                className="overflow-hidden rounded-card bg-surface"
                aria-busy={searching}
            >
                {musics.map((music, index) => (
                    <div
                        key={music.index}
                        className={
                            "flex min-h-16 items-center gap-2 px-3 " +
                            (index > 0 ? "border-t border-divider" : "")
                        }
                    >
                        <Link
                            href={
                                "/admin/music/" +
                                encodeURIComponent(music.index)
                            }
                            className="-mx-1 flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-2 hover:bg-surface-muted"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-surface-muted text-xs font-bold text-text-secondary">
                                {music.categoryShort}
                            </span>
                            <span className="min-w-0 flex-1">
                                <strong className="block truncate text-body font-bold">
                                    {music.title}
                                </strong>
                                {initial.activeLocale ? (
                                    <span className="block truncate text-caption">
                                        {music.translation
                                            ? music.translation.title +
                                              " · " +
                                              (music.translation.status ===
                                              "approved"
                                                  ? "승인"
                                                  : "초안")
                                            : initial.activeLocale.toUpperCase() +
                                              " 번역 없음"}
                                    </span>
                                ) : (
                                    <span className="block truncate text-caption">
                                        {music.artist ?? "아티스트 미상"} · 상수{" "}
                                        {music.configuredChartCount}/
                                        {music.chartCount}
                                    </span>
                                )}
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-text-disabled" />
                        </Link>
                        {initial.activeLocale &&
                        music.translation?.status === "draft" ? (
                            <MusicTranslationApproveButton
                                musicIndex={music.index}
                                locale={initial.activeLocale}
                                onApproved={() => void list.refetch()}
                            />
                        ) : null}
                    </div>
                ))}
                {musics.length === 0 && !list.isFetching ? (
                    <p className="py-12 text-center text-body-muted">
                        {list.isError
                            ? "목록을 불러오지 못했습니다."
                            : "검색 결과가 없습니다."}
                    </p>
                ) : null}
                <div ref={sentinel} aria-hidden />
                {isFetchingNextPage ? (
                    <p className="border-t border-divider py-3 text-center text-caption">
                        불러오는 중...
                    </p>
                ) : null}
            </section>
        </>
    );
}
