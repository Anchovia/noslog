"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCardTools,
    AdminPager,
    AdminStatus,
    AdminTable,
} from "@/components/admin/admin-card";
import AdminLinkRow from "@/components/admin/admin-link-row";
import SearchField from "@/components/ui/search-field";
import MusicTranslationApproveButton from "@/features/music/components/admin/music-translation-approve-button";
import type { AdminMusicListParams } from "@/features/music/server/admin-music-list-service";
import type { AdminMusicListData } from "@/features/music/types/music-admin";
import { ADMIN_PAGE_SIZE, adminPageHref } from "@/lib/admin/page";
import useDebouncedValue from "@/lib/hooks/use-debounced-value";

/**
 * 관리자 악곡 목록(판 2) — 입력하면 300ms 뒤 자동 검색(대소문자 무시 · 번역 제목 · 가나 읽기)하고 1쪽으로 돌아간다.
 * 쪽 · 검색어 · 필터(상수 없음 · 번역 상태)는 모두 주소 값이라 새로고침 · 뒤로 가기에 그대로 남는다.
 */
export default function AdminMusicList({
    data,
    filters,
}: {
    data: AdminMusicListData;
    filters: Omit<AdminMusicListParams, "q">;
}) {
    const router = useRouter();
    const [draft, setDraft] = useState(data.query);
    const q = useDebouncedValue(draft.trim(), 300);
    const [searching, startSearch] = useTransition();
    const currentQuery = data.query.trim();

    useEffect(() => {
        if (q === currentQuery) return;
        startSearch(() =>
            router.replace(
                adminPageHref("/admin/music", { ...filters, q }, 1),
                {
                    scroll: false,
                }
            )
        );
    }, [q, currentQuery, filters, router]);

    const locale = data.activeLocale;

    return (
        <AdminCard>
            <AdminCardHead title="악곡" />
            <AdminCardTools>
                <div role="search" className="ml-auto">
                    <SearchField
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onClear={() => setDraft("")}
                        clearLabel="검색어 지우기"
                        busy={searching}
                        busyLabel="검색 중"
                        placeholder="곡 제목 · 한국어 · 영어 번역 · 아티스트 · 식별자 검색"
                        aria-label="악곡 검색"
                    />
                </div>
            </AdminCardTools>
            {data.musics.length === 0 ? (
                <AdminCardEmpty>검색 결과가 없습니다.</AdminCardEmpty>
            ) : (
                <AdminTable>
                    <thead>
                        <tr>
                            <th scope="col">제목</th>
                            <th scope="col">분류</th>
                            {locale ? (
                                <>
                                    <th scope="col">
                                        {locale.toUpperCase()} 번역
                                    </th>
                                    <th scope="col">번역 상태</th>
                                    <th scope="col">
                                        <span className="sr-only">승인</span>
                                    </th>
                                </>
                            ) : (
                                <>
                                    <th scope="col">아티스트</th>
                                    <th scope="col">상수</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody aria-busy={searching}>
                        {data.musics.map((music) => (
                            <AdminLinkRow
                                key={music.index}
                                href={
                                    "/admin/music/" +
                                    encodeURIComponent(music.index)
                                }
                            >
                                <td className="nl-admin-table__wrap">
                                    <Link
                                        href={
                                            "/admin/music/" +
                                            encodeURIComponent(music.index)
                                        }
                                    >
                                        {music.title}
                                    </Link>
                                </td>
                                <td>{music.categoryShort}</td>
                                {locale ? (
                                    <>
                                        <td className="nl-admin-table__wrap">
                                            {music.translation
                                                ? music.translation.title
                                                : "번역 없음"}
                                        </td>
                                        <td>
                                            {music.translation ? (
                                                <AdminStatus
                                                    tone={
                                                        music.translation
                                                            .status ===
                                                        "approved"
                                                            ? "success"
                                                            : "empty"
                                                    }
                                                >
                                                    {music.translation
                                                        .status === "approved"
                                                        ? "승인"
                                                        : "초안"}
                                                </AdminStatus>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td>
                                            {music.translation?.status ===
                                            "draft" ? (
                                                <MusicTranslationApproveButton
                                                    musicIndex={music.index}
                                                    locale={locale}
                                                />
                                            ) : null}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            {music.artist ?? "아티스트 미상"}
                                        </td>
                                        <td>
                                            {music.configuredChartCount}/
                                            {music.chartCount}
                                        </td>
                                    </>
                                )}
                            </AdminLinkRow>
                        ))}
                    </tbody>
                </AdminTable>
            )}
            <AdminPager
                page={data.page}
                pageSize={ADMIN_PAGE_SIZE}
                total={data.totalCount}
                unit="곡"
                hrefFor={(target) =>
                    adminPageHref(
                        "/admin/music",
                        { ...filters, q: currentQuery },
                        target
                    )
                }
            />
        </AdminCard>
    );
}
