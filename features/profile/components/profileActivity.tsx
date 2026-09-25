"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import StatStrip from "@/components/ui/statStrip";
import type { ProfileActivity as ProfileActivityData } from "@/features/profile/schemas/profileStatsSchema";
import type { ProfileListPayload } from "@/features/profile/schemas/publicProfileSchema";
import { PROFILE_ACTIVITY_BATCH_SIZE } from "@/features/profile/schemas/publicProfileSchema";
import ProfileOnlyMe from "./profileOnlyMe";
import ProfilePlaysList from "./profilePlaysList";

const LEVELS = [0, 1, 2, 3, 4, 5, 6] as const;

/** 달력 칸 단계 — 0 = 플레이 없음, 1–6 = 그 사람의 가장 많이 한 날에 대한 비율(차트 단계 색 6) */
export function activityLevel(count: number, max: number) {
    return count > 0 && max > 0 ? Math.min(6, Math.ceil((count / max) * 6)) : 0;
}

/**
 * 프로필 「활동」 탭(2026-09-26) — 요약 띠(최근 1년 · 이번 달 · 연속 · 가장 긴 연속) →16→ 활동 달력(53주, 칸 폭만큼 보이고
 * 안내 「최근 1년 기록」 · 처음에는 오늘 쪽 끝) → 최근 플레이(한 판씩 · 20판씩 더 보기 · 새 기록 표시). 모드와 관계없는 모든 플레이
 */
export default function ProfileActivity({
    userId,
    activity,
    initialRecent,
    onlyMe = false,
}: {
    userId: number;
    activity: ProfileActivityData;
    /** 점수 비공개 프로필을 남이 보면 null — 목록 없이 달력만 */
    initialRecent: ProfileListPayload | null;
    /** 숨긴 플레이 활동을 본인이 볼 때 — 제목 아래 「나에게만 보입니다」(2026-09-26 P1) */
    onlyMe?: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const max = Math.max(0, ...activity.days.map((day) => day.count));
    const number = (value: number) => value.toLocaleString(locale);
    const dateLabel = (date: string) =>
        new Intl.DateTimeFormat(locale, {
            timeZone: "UTC",
            year: "numeric",
            month: locale === "en" ? "short" : "numeric",
            day: "numeric",
        }).format(new Date(`${date}T00:00:00Z`));
    return (
        <div className="nl-profile-activity">
            <section
                className="nl-profile-section nl-profile-calendar"
                aria-labelledby="profile-activity-title"
            >
                <h2 id="profile-activity-title" className="nl-section-title">
                    {t("profile.tabs.activity")}
                </h2>
                {onlyMe ? <ProfileOnlyMe /> : null}
                <StatStrip
                    label={t("profile.tabs.activity")}
                    items={[
                        {
                            key: "year",
                            label: t("profile.activity.year"),
                            value: number(activity.summary.year),
                            unit: t("profile.activity.playsUnit"),
                        },
                        {
                            key: "month",
                            label: t("profile.activity.month"),
                            value: number(activity.summary.month),
                            unit: t("profile.activity.playsUnit"),
                        },
                        {
                            key: "days",
                            label: t("profile.activity.currentStreak"),
                            value: number(activity.summary.currentStreak),
                            unit: t("profile.activity.daysUnit"),
                        },
                        {
                            key: "streak",
                            label: t("profile.activity.longestStreak"),
                            value: number(activity.summary.longestStreak),
                            unit: t("profile.activity.daysUnit"),
                        },
                    ]}
                />
                <div className="nl-profile-calendar__body">
                    <div
                        className="nl-profile-calendar__scroller"
                        tabIndex={0}
                        role="img"
                        aria-label={t("profile.activity.calendarAria", {
                            start: dateLabel(activity.start),
                            end: dateLabel(activity.end),
                            count: number(activity.summary.year),
                        })}
                    >
                        <div className="nl-profile-calendar__grid">
                            {activity.days.map((day) => (
                                <span
                                    key={day.date}
                                    className="nl-profile-calendar__cell"
                                    data-level={activityLevel(day.count, max)}
                                    title={t("profile.activity.cell", {
                                        date: dateLabel(day.date),
                                        count: number(day.count),
                                    })}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="nl-profile-calendar__foot nl-metadata nl-muted">
                        <span className="nl-profile-calendar__hint">
                            {t("profile.activity.scrollHint")}
                        </span>
                        <ul className="nl-profile-legend" aria-hidden="true">
                            <li>{t("profile.activity.less")}</li>
                            {LEVELS.map((level) => (
                                <li key={level}>
                                    <i
                                        className="nl-profile-calendar__cell"
                                        data-level={level}
                                    />
                                </li>
                            ))}
                            <li>{t("profile.activity.more")}</li>
                        </ul>
                    </div>
                </div>
            </section>
            {initialRecent ? (
                <ProfilePlaysList
                    userId={userId}
                    kind="recent"
                    mode="basic"
                    batch={PROFILE_ACTIVITY_BATCH_SIZE}
                    initialData={initialRecent}
                />
            ) : null}
        </div>
    );
}
