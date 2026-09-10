"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import LineChart from "@/components/ui/lineChart";
import MetricSwitch from "@/components/ui/metricSwitch";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/statusMessage";
import { profileProgressOptions } from "@/features/profile/api/profileProgress";
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
                <h2 id="profile-progress-title" className="nl-section-title">
                    {t("profile.progress")}
                </h2>
                <div className="nl-profile-progress__controls">
                    <MetricSwitch
                        label={t("profile.progress")}
                        value={
                            result.isError && data ? data.query.metric : metric
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
                    <Select
                        aria-label={t("profile.rangeLabel")}
                        value={
                            result.isError && data ? data.query.range : range
                        }
                        onChange={(event) =>
                            setRange(
                                event.target
                                    .value as ProfileProgressQuery["range"]
                            )
                        }
                    >
                        <option value="30">{t("profile.range.30")}</option>
                        <option value="90">{t("profile.range.90")}</option>
                        <option value="year">{t("profile.range.year")}</option>
                        <option value="all">{t("profile.all")}</option>
                    </Select>
                </div>
            </div>
            <div
                className="nl-profile-progress__content"
                aria-busy={result.isFetching}
            >
                {/* 플롯 기하 유지 (2026-09-10 사용자 결정): 기록이 없거나 부족해도 플롯 틀을 그대로 두고 그 안에 상태를 적는다 */}
                {
                    <LineChart
                        label={`${data?.query.mode === "recital" ? "Recital" : "Basic"} · ${metricLabel} · ${t("profile.progress")}`}
                        dimensionLabel={t("record.date")}
                        valueLabel={metricLabel}
                        keepPlotGeometry
                        plotSurface
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
                            })
                        )}
                        domain={[Math.max(0, minimum - inset), maximum + inset]}
                        formatValue={(value) => `${format(value)} ${unit}`}
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
                        singleMessage={t("profile.progressInsufficient")}
                        responsivePlot
                        showValueAxis={false}
                        showPoints={false}
                        dimensionTickIndices={[0, points.length - 1]}
                        tableVisibility="screen-reader"
                    />
                }
                {
                    <dl
                        className="nl-profile-progress__summary nl-body-secondary"
                        aria-label={metricLabel}
                    >
                        <div>
                            <dt className="nl-muted">{t("profile.start")}</dt>
                            <dd className="nl-metric-value">
                                {first === null ? "—" : format(first)}
                            </dd>
                        </div>
                        <div>
                            <dt className="nl-muted">{t("profile.current")}</dt>
                            <dd className="nl-metric-value">
                                {current === null ? "—" : format(current)}
                            </dd>
                        </div>
                        <div>
                            <dt className="nl-muted">{t("profile.change")}</dt>
                            <dd className="nl-metric-value">
                                {change === null
                                    ? "—"
                                    : `${change > 0 ? "+" : ""}${format(change)}`}
                            </dd>
                        </div>
                    </dl>
                }
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
