"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/pageContainer";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MetricSummary from "@/components/ui/metricSummary";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { StatusMessage } from "@/components/ui/statusMessage";
import { foundationButtonClass } from "@/components/ui/Button";
import ProfileProgress from "./profileProgress";
import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import type {
    ProfileListPayload,
    ProfileMode,
    ProfileProgressPayload,
} from "@/features/profile/schemas/publicProfileSchema";
import type { ProfileOverviewContext } from "@/features/profile/server/profileOverviewService";
import ProfileIdentity from "./profileIdentity";
import ProfilePlaysList from "./profilePlaysList";
import ProfileRecordOverview from "./profileRecordOverview";

export default function PublicProfilePage({
    user,
    isOwner,
    overview,
    initialBest,
    initialRecent,
    initialProgress,
    syncLabel,
}: {
    user: ProfileUser;
    isOwner: boolean;
    overview: ProfileOverviewContext;
    initialBest: ProfileListPayload | null;
    initialRecent: ProfileListPayload | null;
    initialProgress: ProfileProgressPayload | null;
    syncLabel?: string;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const params = useSearchParams();
    const pathname = usePathname();
    const mode: ProfileMode =
        params.get("mode") === "recital" ? "recital" : "basic";
    const grade = mode === "basic" ? user.grade_basic : user.grade_recital;
    const rank = mode === "basic" ? user.rank_basic : user.rank_recital;
    const countryRank =
        mode === "basic" ? user.rank_basic_country : user.rank_recital_country;
    const rating = overview.ratings[mode];
    const hasRecords = Boolean(
        overview.hasRecords ||
        user.grade_basic ||
        user.grade_recital ||
        initialBest?.items.length ||
        initialRecent?.items.length
    );
    function selectMode(value: ProfileMode) {
        if (value === mode) return;
        const next = new URLSearchParams(params);
        next.set("mode", value);
        window.history.pushState(null, "", `${pathname}?${next}`);
    }
    return (
        <PageContainer className="nl-profile">
            <ProfileIdentity
                user={user}
                isOwner={isOwner}
                mode={mode}
                syncLabel={syncLabel}
                showSyncAction={
                    isOwner &&
                    Boolean(
                        overview.sync &&
                        ["failed", "partial"].includes(overview.sync.status)
                    )
                }
            />
            {hasRecords ? (
                <>
                    <section
                        className="nl-profile-competitive"
                        aria-label={t("profile.modeAria")}
                    >
                        <div aria-controls="profile-performance-summary profile-progress profile-best-title">
                            <SegmentedControl
                                label={t("profile.modeAria")}
                                value={mode}
                                onValueChange={selectMode}
                                options={[
                                    { value: "basic", label: "Basic" },
                                    { value: "recital", label: "Recital" },
                                ]}
                            />
                        </div>
                        <dl
                            id="profile-performance-summary"
                            className="nl-profile-summary"
                            aria-label={`${mode === "basic" ? "Basic" : "Recital"} · ${t("profile.grade")}`}
                        >
                            <MetricSummary
                                label={t("rankings.metric.grade")}
                                prominent
                                value={
                                    grade && grade > 0
                                        ? Math.round(
                                              grade / 100
                                          ).toLocaleString(locale)
                                        : "—"
                                }
                                unit={grade && grade > 0 ? "Grd" : undefined}
                            />
                            <MetricSummary
                                label={t("rankings.metric.rating")}
                                prominent
                                value={
                                    rating === null
                                        ? "—"
                                        : rating.toLocaleString(locale)
                                }
                                unit={rating === null ? undefined : "pt"}
                                description={
                                    rating === null
                                        ? t("rankings.ratingUnavailable")
                                        : undefined
                                }
                            />
                            <MetricSummary
                                label={t("profile.globalRank")}
                                prominent
                                value={
                                    rank
                                        ? `#${rank.toLocaleString(locale)}`
                                        : "—"
                                }
                            />
                            <MetricSummary
                                label={t("profile.countryPosition")}
                                prominent
                                value={
                                    countryRank
                                        ? `#${countryRank.toLocaleString(locale)}`
                                        : "—"
                                }
                            />
                        </dl>
                    </section>
                    <div className="nl-profile-body">
                        <ProfileProgress
                            userId={user.id}
                            mode={mode}
                            initialData={initialProgress}
                        />
                        <ProfilePlaysList
                            userId={user.id}
                            kind="best"
                            mode={mode}
                            initialData={initialBest}
                        />
                        <ProfileRecordOverview
                            user={user}
                            judgement={overview.judgement}
                        />
                        {initialRecent?.status !== "hidden" ? (
                            <ProfilePlaysList
                                userId={user.id}
                                kind="recent"
                                mode="basic"
                                initialData={initialRecent}
                            />
                        ) : null}
                    </div>
                </>
            ) : (
                <StatusMessage
                    title={t("profile.noSyncedRecords")}
                    action={
                        isOwner ? (
                            <Link
                                href={href("/bookmarklet")}
                                className={foundationButtonClass({
                                    variant: "primary",
                                })}
                            >
                                {t("sync.title")}
                            </Link>
                        ) : undefined
                    }
                />
            )}
        </PageContainer>
    );
}
