"use client";

import { useRef, useState } from "react";
import {
    keepPreviousData,
    useInfiniteQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import MetricSwitch from "@/components/ui/metricSwitch";
import { StatusMessage } from "@/components/ui/statusMessage";
import { profilePlaysOptions } from "@/features/profile/api/profilePlays";
import type {
    ProfileListPayload,
    ProfileMetric,
    ProfileMode,
} from "@/features/profile/schemas/publicProfileSchema";
import { LoadingStatus } from "@/components/ui/skeleton";
import useDelayedFlag from "@/lib/hooks/useDelayedFlag";
import ProfilePlayRow, {
    ProfilePlayListHead,
    ProfilePlayListSkeleton,
} from "./profilePlayRow";

export default function ProfilePlaysList({
    userId,
    kind,
    mode,
    initialData,
}: {
    userId: number;
    kind: "best" | "recent";
    mode: ProfileMode;
    initialData: ProfileListPayload | null;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const client = useQueryClient();
    const region = useRef<HTMLElement>(null);
    const [metric, setMetric] = useState<ProfileMetric>("grade");
    const key = `${kind}:${kind === "recent" ? "basic" : mode}:${metric}`;
    const [previousKey, setPreviousKey] = useState(key);
    const [visit, setVisit] = useState(0);
    if (previousKey !== key) {
        setPreviousKey(key);
        setVisit(visit + 1);
    }
    const options = profilePlaysOptions(
        userId,
        { kind, mode: kind === "recent" ? "basic" : mode, metric },
        visit
    );
    const result = useInfiniteQuery({
        ...options,
        initialData:
            !visit && initialData
                ? { pages: [initialData], pageParams: [0] }
                : undefined,
        placeholderData: keepPreviousData,
    });
    const [committed, setCommitted] = useState<InfiniteData<
        ProfileListPayload,
        number
    > | null>(null);
    if (result.data && !result.isPlaceholderData && result.data !== committed)
        setCommitted(result.data);
    const data = result.data ?? committed;
    const first = data?.pages[0];
    const hidden = data?.pages.some((page) => page.status === "hidden");
    const plays = data?.pages.flatMap((page) => page.items) ?? [];
    const busy = result.isFetching;
    // 지표 · 모드 전환은 순서와 값의 뜻이 바뀐다 — 이전 목록을 두지 않고 같은 줄 틀의 스켈레톤(2026-09-19 S1).
    // 「더 보기」 는 같은 지표에 줄만 이어 붙으므로 해당 없음(isPlaceholderData 는 키가 바뀔 때만 true)
    const switching = useDelayedFlag(result.isPlaceholderData && busy);
    if (hidden) return null;
    const title = t(
        kind === "best" ? "profile.bestPlays" : "profile.recentPlays"
    );
    function collapse() {
        if (!result.data) return;
        client.setQueryData(options.queryKey, {
            pages: [result.data.pages[0]],
            pageParams: [0],
        });
        region.current?.focus({ preventScroll: true });
        region.current?.scrollIntoView({ block: "start" });
    }
    return (
        <section
            ref={region}
            tabIndex={-1}
            className="nl-profile-section nl-profile-plays"
            data-kind={kind}
            aria-labelledby={`profile-${kind}-title`}
        >
            <div className="nl-profile-section__header">
                <div className="nl-profile-section__title">
                    <h2
                        id={`profile-${kind}-title`}
                        className="nl-section-title"
                    >
                        {title}
                    </h2>
                    {/* 베스트 전체는 「기록」 탭(2026-09-25 2단계) — 모드를 그대로 넘긴다 */}
                    {kind === "best" ? (
                        <Link
                            href={href(
                                `/profile/${userId}/records${mode === "recital" ? "?mode=recital" : ""}`
                            )}
                            className="nl-heading-link nl-control"
                        >
                            {t("achievement.all")}
                            <ChevronRight aria-hidden />
                        </Link>
                    ) : null}
                </div>
                {kind === "best" ? (
                    <MetricSwitch
                        label={title}
                        value={
                            result.isError && first
                                ? first.query.metric
                                : metric
                        }
                        onValueChange={setMetric}
                        options={[
                            {
                                value: "grade",
                                label: t("rankings.metric.grade"),
                                shortLabel: "Grd",
                            },
                            {
                                value: "rating",
                                label: t("rankings.metric.rating"),
                                shortLabel: "Rating",
                            },
                        ]}
                    />
                ) : null}
            </div>
            <div className="nl-profile-plays__content" aria-busy={busy}>
                {first?.status === "unavailable" ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("rankings.ratingUnavailable")}
                    </p>
                ) : switching ? (
                    <>
                        <LoadingStatus label={t("profile.loading")} />
                        <ProfilePlayListSkeleton />
                    </>
                ) : plays.length ? (
                    <>
                        <ProfilePlayListHead
                            kind={kind}
                            metric={first?.query.metric ?? metric}
                        />
                        <ol
                            className="nl-profile-play-list"
                            aria-label={`${kind === "best" ? `${first?.query.mode === "recital" ? "Recital" : "Basic"} · ${t(first?.query.metric === "rating" ? "rankings.metric.rating" : "rankings.metric.grade")} · ` : ""}${title}`}
                        >
                            {plays.map((play) => (
                                <ProfilePlayRow
                                    key={play.id}
                                    play={play}
                                    metric={first?.query.metric ?? metric}
                                    position={kind === "best"}
                                />
                            ))}
                        </ol>
                    </>
                ) : busy ? (
                    // 첫 불러오기 — 글자 대신 같은 줄 틀의 스켈레톤(안내는 화면 읽기에만)
                    <>
                        <LoadingStatus label={t("profile.loading")} />
                        <ProfilePlayListSkeleton />
                    </>
                ) : (
                    <p className="nl-body-secondary nl-muted">
                        {t(
                            kind === "recent"
                                ? "profile.recentEmpty"
                                : "profile.bestEmpty"
                        )}
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
                            onClick={async () => {
                                if (result.isFetchNextPageError)
                                    await result.fetchNextPage();
                                else await result.refetch();
                                region.current?.focus({ preventScroll: true });
                            }}
                        >
                            {t("common.retry")}
                        </Button>
                    }
                />
            ) : null}
            {!switching &&
            plays.length > 0 &&
            (result.hasNextPage || plays.length > 5) ? (
                <div className="nl-profile-list-actions">
                    {result.hasNextPage ? (
                        <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={() => void result.fetchNextPage()}
                        >
                            {t("profile.more")}
                        </Button>
                    ) : null}
                    {plays.length > 5 ? (
                        <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={collapse}
                        >
                            {t("profile.collapse")}
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}
