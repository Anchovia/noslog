"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import LineChart from "@/components/ui/lineChart";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/statusMessage";
import { profileProgressOptions } from "@/features/profile/api/profileProgress";
import { formatDaysAgo } from "@/lib/music/scoreTrend";
import { gradeBandTone } from "@/lib/music/scoreTone";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import useDelayedFlag from "@/lib/hooks/useDelayedFlag";
import type {
    ProfileMetric,
    ProfileMode,
    ProfileProgressPayload,
    ProfileProgressQuery,
} from "@/features/profile/schemas/publicProfileSchema";

export default function ProfileProgress({
    userId,
    mode,
    initialData,
}: {
    userId: number;
    mode: ProfileMode;
    initialData: ProfileProgressPayload | null;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [metric, setMetric] = useState<ProfileMetric>("grade");
    const [range, setRange] = useState<ProfileProgressQuery["range"]>("90");
    const result = useQuery({
        ...profileProgressOptions(userId, { mode, metric, range }),
        initialData:
            initialData?.query.mode === mode &&
            metric === "grade" &&
            range === "90"
                ? initialData
                : undefined,
        placeholderData: keepPreviousData,
    });
    const [committed, setCommitted] = useState<ProfileProgressPayload | null>(
        initialData
    );
    if (result.data && !result.isPlaceholderData && result.data !== committed)
        setCommitted(result.data);
    const data = result.data ?? committed;
    // 지표 · 기간 · 모드 전환은 값의 뜻이 바뀐다 — 새 값을 받는 동안 이전 선을 두지 않고 같은 틀의 스켈레톤(2026-09-19 S1).
    // 짧게 끝나면(--nl-motion-delay-skeleton 안) 스켈레톤 없이 바로 새 선
    const switching = useDelayedFlag(
        result.isPlaceholderData && result.isFetching
    );
    const unit = data?.query.metric === "rating" ? "pt" : "Grd";
    const metricLabel = t(
        data?.query.metric === "rating"
            ? "rankings.metric.rating"
            : "rankings.metric.grade"
    );
    const format = (value: number) =>
        value.toLocaleString(locale, { maximumFractionDigits: 2 });
    const points = data?.points ?? [];
    const current = data?.current ?? null;
    const first = points[0]?.value ?? null;
    const change = first === null || current === null ? null : current - first;
    const values = points.map((point) => point.value);
    const peak =
        current === null && !values.length
            ? null
            : Math.max(...values, current ?? -Infinity);
    // 주당 변화 — 기록 기간이 1주 이상일 때만(짧으면 과장된다)
    const spanDays =
        points.length > 1
            ? (Date.parse(points[points.length - 1].date) -
                  Date.parse(points[0].date)) /
              86_400_000
            : 0;
    const perWeek =
        change !== null && spanDays >= 7 ? (change / spanDays) * 7 : null;
    const signed = (value: number) => `${value > 0 ? "+" : ""}${format(value)}`;
    const shownRange = data?.query.range ?? range;
    const rangeLabel = t(
        shownRange === "all" ? "profile.all" : `profile.range.${shownRange}`
    );
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const inset = Math.max(1, (maximum - minimum) / 10);
    const dateFormat = new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <section
            id="profile-progress"
            className="nl-profile-section nl-profile-progress"
            aria-labelledby="profile-progress-title"
        >
            <div className="nl-profile-progress__header">
                <div className="nl-profile-progress__title">
                    <h2
                        id="profile-progress-title"
                        className="nl-section-title"
                    >
                        {t("profile.progress")}
                    </h2>
                    {/* 요약 먼저(2026-09-25 G2) — 그래프를 읽지 않아도 결론이 보이게(차트 지침 4/4) */}
                    {current !== null && change !== null && !switching ? (
                        <p className="nl-body-secondary nl-muted">
                            {t("profile.progressSummary", {
                                range: rangeLabel,
                                change: signed(change),
                                current: format(current),
                            })}
                            {peak !== null && current >= peak
                                ? ` — ${t("profile.progressAtPeak")}`
                                : ""}
                        </p>
                    ) : null}
                </div>
                <div className="nl-profile-progress__controls">
                    <SegmentedControl
                        label={t("profile.progressMetric")}
                        value={
                            result.isError && data ? data.query.metric : metric
                        }
                        onValueChange={setMetric}
                        options={[
                            // 짧은 라벨(2026-09-25 G2) — 세그먼트 한 줄에 들어가게. 긴 이름은 요약 · 표 라벨이 말한다
                            { value: "grade", label: "Grd" },
                            {
                                value: "rating",
                                label: t("profile.ratingShort"),
                            },
                        ]}
                    />
                    <Select
                        aria-label={t("profile.rangeLabel")}
                        value={
                            result.isError && data ? data.query.range : range
                        }
                        onValueChange={(next) =>
                            setRange(next as ProfileProgressQuery["range"])
                        }
                        options={[
                            { value: "30", label: t("profile.range.30") },
                            { value: "90", label: t("profile.range.90") },
                            { value: "year", label: t("profile.range.year") },
                            { value: "all", label: t("profile.all") },
                        ]}
                    />
                </div>
            </div>
            <div
                className="nl-profile-progress__content"
                aria-busy={result.isFetching}
            >
                {switching ? (
                    <>
                        <LoadingStatus label={t("profile.loading")} />
                        <ProfileProgressSkeleton />
                    </>
                ) : (
                    <>
                        <dl
                            className="nl-profile-progress__summary nl-body-secondary"
                            aria-label={metricLabel}
                        >
                            <div>
                                <dt className="nl-muted">
                                    {t("profile.current")}
                                </dt>
                                <dd
                                    className="nl-metric-value nl-toned"
                                    data-tone={gradeBandTone(current)}
                                >
                                    {current === null ? "—" : format(current)}
                                </dd>
                            </div>
                            <div>
                                <dt className="nl-muted">
                                    {t("profile.change")}
                                </dt>
                                <dd className="nl-metric-value">
                                    {change === null ? "—" : signed(change)}
                                </dd>
                            </div>
                            {perWeek !== null ? (
                                <div>
                                    <dt className="nl-muted">
                                        {t("profile.perWeek")}
                                    </dt>
                                    <dd className="nl-metric-value">
                                        {signed(perWeek)}
                                    </dd>
                                </div>
                            ) : null}
                            <div>
                                <dt className="nl-muted">
                                    {t("profile.peak")}
                                </dt>
                                <dd
                                    className="nl-metric-value nl-toned"
                                    data-tone={gradeBandTone(peak)}
                                >
                                    {peak === null ? "—" : format(peak)}
                                </dd>
                            </div>
                        </dl>
                        {/* 플롯 기하 유지 (2026-09-10 사용자 결정): 기록이 없거나 부족해도 플롯 틀을 그대로 두고 그 안에 상태를 적는다 */}
                        {
                            <LineChart
                                label={`${data?.query.mode === "recital" ? "Recital" : "Basic"} · ${metricLabel} · ${t("profile.progress")}`}
                                dimensionLabel={t("record.date")}
                                valueLabel={metricLabel}
                                keepPlotGeometry
                                // 면 없음 · 바닥선만 · 주황 선 (2026-09-19 B1 · G1 · C1)
                                baselineOnly
                                tone="growth"
                                points={(current === null ? [] : points).map(
                                    (point) => ({
                                        id: point.date,
                                        dimension: dateFormat.format(
                                            new Date(point.date)
                                        ),
                                        shortDimension: dateFormat.format(
                                            new Date(point.date)
                                        ),
                                        value: point.value,
                                        coordinate: Date.parse(point.date),
                                        detail: formatDaysAgo(
                                            point.date,
                                            locale
                                        ),
                                    })
                                )}
                                domain={[
                                    Math.max(0, minimum - inset),
                                    maximum + inset,
                                ]}
                                formatValue={(value) =>
                                    `${format(value)} ${unit}`
                                }
                                formatAxis={format}
                                emptyMessage={t(
                                    current !== null
                                        ? "profile.noRecord"
                                        : result.isPending
                                          ? "profile.loading"
                                          : data?.query.metric === "rating"
                                            ? "rankings.ratingUnavailable"
                                            : "profile.noRecord"
                                )}
                                singleMessage={t(
                                    "profile.progressInsufficient"
                                )}
                                plotHeight={200}
                                showValueAxis={false}
                                showPoints={false}
                                dimensionTickIndices={[
                                    ...new Set([0, points.length - 1]),
                                ]}
                                // 툴팁 = 「5,723.05 Grd」 위 · 「N일 전」 아래 — 악곡 상세 성장 추이와 같음(osu!, 2026-09-17)
                                tooltipValueLabel={false}
                                tableVisibility="screen-reader"
                            />
                        }
                    </>
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
                            onClick={() => void result.refetch()}
                        >
                            {t("common.retry")}
                        </Button>
                    }
                />
            ) : null}
        </section>
    );
}

/**
 * 성장 추이 스켈레톤(2026-09-19 로딩 시안 S1 · 2026-09-25 G2) — 실제와 같은 순서: 요약 줄(지금 · 변화 · 최고 라벨은 실제 글자) →
 * 선 그래프 틀(플롯 200 →16→ 날짜 줄). 프로필 로딩 화면과 지표 · 기간 · 모드 전환이 함께 쓴다
 */
export function ProfileProgressSkeleton() {
    const t = useTranslations();
    return (
        <>
            <dl
                className="nl-profile-progress__summary nl-body-secondary"
                aria-hidden="true"
            >
                {(["current", "change", "peak"] as const).map((key) => (
                    <div key={key}>
                        <dt className="nl-muted">{t(`profile.${key}`)}</dt>
                        <dd className="nl-metric-value">
                            <SkeletonText
                                className="nl-metric-value"
                                sample="0,000.00"
                            />
                        </dd>
                    </div>
                ))}
            </dl>
            <figure className="nl-line-chart" aria-hidden="true">
                <div className="nl-line-chart__plot">
                    <div className="nl-line-chart__area">
                        <div className="nl-line-chart__series nl-profile-loading__plot nl-skeleton" />
                        <div className="nl-line-chart__x nl-metadata">
                            <SkeletonText
                                className="nl-metadata"
                                sample="2026. 09. 10."
                            />
                            <SkeletonText
                                className="nl-metadata"
                                sample="2026. 09. 10."
                            />
                        </div>
                    </div>
                </div>
            </figure>
        </>
    );
}
