"use client";

import { useRef, useState } from "react";
import {
    keepPreviousData,
    useInfiniteQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import MetricSwitch from "@/components/ui/metricSwitch";
import { StatusMessage } from "@/components/ui/statusMessage";
import { profilePlaysOptions } from "@/features/profile/api/profilePlays";
import type {
    ProfileListPayload,
    ProfileMetric,
    ProfileMode,
} from "@/features/profile/schemas/publicProfileSchema";
import ProfilePlayRow from "./profilePlayRow";

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
            aria-labelledby={`profile-${kind}-title`}
        >
            <div className="nl-profile-section__header">
                <h2 id={`profile-${kind}-title`} className="nl-section-title">
                    {title}
                </h2>
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
                ) : plays.length ? (
                    <ol
                        className="nl-profile-play-list"
                        aria-label={`${kind === "best" ? `${first?.query.mode === "recital" ? "Recital" : "Basic"} · ${t(first?.query.metric === "rating" ? "rankings.metric.rating" : "rankings.metric.grade")} · ` : ""}${title}`}
                    >
                        {plays.map((play) => (
                            <ProfilePlayRow
                                key={play.id}
                                play={play}
                                metric={first?.query.metric ?? metric}
                            />
                        ))}
                    </ol>
                ) : (
                    <p className="nl-body-secondary nl-muted">
                        {t(
                            busy
                                ? "profile.loading"
                                : kind === "recent"
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
                            appearance="foundation"
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
            {plays.length > 0 && (result.hasNextPage || plays.length > 5) ? (
                <div className="nl-profile-list-actions">
                    {result.hasNextPage ? (
                        <Button
                            appearance="foundation"
                            variant="secondary"
                            disabled={busy}
                            onClick={() => void result.fetchNextPage()}
                        >
                            {t("profile.more")}
                        </Button>
                    ) : null}
                    {plays.length > 5 ? (
                        <Button
                            appearance="foundation"
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
