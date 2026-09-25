"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { LoadingStatus } from "@/components/ui/skeleton";
import SortMenu from "@/components/ui/sortMenu";
import { StatusMessage } from "@/components/ui/statusMessage";
import {
    profileRecordsOptions,
    type ProfileRecordsFilter,
} from "@/features/profile/api/profileRecords";
import {
    PROFILE_RECORD_SORTS,
    type ProfileMode,
    type ProfileRecordsPayload,
} from "@/features/profile/schemas/publicProfileSchema";
import useDelayedFlag from "@/lib/hooks/useDelayedFlag";
import ProfilePlayRow, {
    ProfilePlayListHead,
    ProfilePlayListSkeleton,
} from "./profilePlayRow";

/**
 * 프로필 「기록」 탭(2026-09-25 2단계) — 위 줄: 세그먼트 M(베스트 50 · 모든 기록) | 고스트 정렬 M(2026-09-26 R1),
 * 표(순번 · 자켓 · 곡 · 난이도 · 점수 · 등급 · 곡 순위 · 날짜 · Grd), 20개씩 「더 보기」.
 * 검색 · 필터 · 베스트 설명 줄은 두지 않는다(2026-09-26, 사용자 — 필요 없음 · 설명 없이도 안다)
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
    const [view, setView] = useState<ProfileRecordsFilter["view"]>("best");
    const [sort, setSort] = useState<ProfileRecordsFilter["sort"]>("value");
    const filter: ProfileRecordsFilter = { view, mode, sort };
    const isInitial =
        view === "best" &&
        sort === "value" &&
        mode === (initialData?.query.mode ?? "basic");
    const result = useInfiniteQuery({
        ...profileRecordsOptions(userId, filter),
        initialData:
            isInitial && initialData
                ? { pages: [initialData], pageParams: [0] }
                : undefined,
        placeholderData: keepPreviousData,
    });
    // 보기 · 정렬이 바뀌면 순서와 값의 뜻이 바뀐다 — 이전 목록 대신 같은 틀의 스켈레톤(2026-09-19 S1)
    const switching = useDelayedFlag(
        result.isPlaceholderData && result.isFetching
    );
    const plays = result.data?.pages.flatMap((page) => page.items) ?? [];
    const viewLabel = (key: "best" | "all") =>
        t(`profile.records.${key}`, {
            count: counts[key].toLocaleString(locale),
        });
    return (
        <section
            className="nl-profile-section nl-profile-records"
            data-kind={view}
            aria-label={t("profile.tabs.records")}
        >
            <div className="nl-profile-records__toolbar">
                {/* 보기 전환 = 세그먼트 M + 고스트 정렬 M(같은 줄 한 단계, 2026-09-26 R1) */}
                <SegmentedControl
                    size="sm"
                    label={t("profile.records.viewLabel")}
                    value={view}
                    onValueChange={setView}
                    options={(["best", "all"] as const).map((key) => ({
                        value: key,
                        label: viewLabel(key),
                    }))}
                />
                <SortMenu
                    variant="ghost"
                    size="sm"
                    label={t("discovery.sortLabel")}
                    value={sort}
                    onValueChange={setSort}
                    options={PROFILE_RECORD_SORTS.map((value) => ({
                        value,
                        label: t(`profile.records.sort.${value}`),
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
                            aria-label={viewLabel(view)}
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
                    <p className="nl-body-secondary nl-muted">
                        {t("profile.bestEmpty")}
                    </p>
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
