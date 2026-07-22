"use client";

import { useEffect, useMemo, useState } from "react";

import {
    ARCADE_WEEKDAYS,
    type ArcadeBusinessHours,
    type ArcadeWeekday,
    normalizeArcadeBusinessHours,
} from "@/lib/arcadeDetails";

interface ArcadeBusinessHoursProps {
    value: unknown;
}

const weekdayByShortName: Record<string, ArcadeWeekday> = {
    Mon: "monday",
    Tue: "tuesday",
    Wed: "wednesday",
    Thu: "thursday",
    Fri: "friday",
    Sat: "saturday",
    Sun: "sunday",
};

function minutesFromTime(value: string) {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
}

function koreanTime(value: string) {
    const [hour, minute] = value.split(":").map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour % 12 || 12;
    return `${period} ${displayHour}:${String(minute).padStart(2, "0")}`;
}

function scheduleText(schedule: { open: string; close: string }) {
    return `${koreanTime(schedule.open)} - ${koreanTime(schedule.close)}`;
}

function seoulNow(date: Date) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);
    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );
    const weekday = weekdayByShortName[values.weekday];
    if (!weekday) return null;
    return {
        weekday,
        minutes: Number(values.hour) * 60 + Number(values.minute),
    };
}

function activeSchedule(
    businessHours: ArcadeBusinessHours,
    weekday: ArcadeWeekday,
    currentMinutes: number
) {
    const todayIndex = ARCADE_WEEKDAYS.findIndex((day) => day.key === weekday);
    const today = businessHours.weekly[weekday];
    if (today) {
        const open = minutesFromTime(today.open);
        let close = minutesFromTime(today.close);
        if (close <= open) close += 24 * 60;
        if (currentMinutes >= open && currentMinutes < close) return today;
    }

    const previousDay =
        ARCADE_WEEKDAYS[
            (todayIndex - 1 + ARCADE_WEEKDAYS.length) % ARCADE_WEEKDAYS.length
        ];
    const previous = businessHours.weekly[previousDay.key];
    if (previous) {
        const open = minutesFromTime(previous.open);
        const close = minutesFromTime(previous.close);
        if (close <= open && currentMinutes < close) return previous;
    }
    return null;
}

export default function ArcadeBusinessHours({
    value,
}: ArcadeBusinessHoursProps) {
    const businessHours = useMemo(
        () => normalizeArcadeBusinessHours(value),
        [value]
    );
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        const initialTimer = window.setTimeout(() => setNow(new Date()), 0);
        const timer = window.setInterval(() => setNow(new Date()), 60_000);
        return () => {
            window.clearTimeout(initialTimer);
            window.clearInterval(timer);
        };
    }, []);

    if (!businessHours) {
        return (
            <div>
                <p className="text-label">영업시간</p>
                <p className="text-body-muted mt-1">영업시간 정보 미확인</p>
            </div>
        );
    }
    if (
        businessHours.legacyNote &&
        Object.keys(businessHours.weekly).length === 0
    ) {
        return (
            <div>
                <p className="text-label">영업시간</p>
                <p className="text-body-muted mt-1 whitespace-pre-wrap">
                    {businessHours.legacyNote}
                </p>
            </div>
        );
    }

    const current = now ? seoulNow(now) : null;
    const currentDayIndex = current
        ? ARCADE_WEEKDAYS.findIndex((day) => day.key === current.weekday)
        : 0;
    const orderedDays = Array.from(
        { length: ARCADE_WEEKDAYS.length },
        (_, index) =>
            ARCADE_WEEKDAYS[(currentDayIndex + index) % ARCADE_WEEKDAYS.length]
    );
    const openSchedule = current
        ? activeSchedule(businessHours, current.weekday, current.minutes)
        : null;
    const todaySchedule = current
        ? businessHours.weekly[current.weekday]
        : businessHours.weekly[orderedDays[0].key];
    const summarySchedule = openSchedule ?? todaySchedule;

    return (
        <div>
            <p className="text-label">영업시간</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {current ? (
                    <span
                        className={
                            openSchedule
                                ? "text-success text-label"
                                : "text-text-secondary text-label"
                        }
                    >
                        {openSchedule ? "영업 중" : "영업 종료"}
                    </span>
                ) : null}
                {current && summarySchedule ? (
                    <span className="text-text-disabled">·</span>
                ) : null}
                {summarySchedule ? (
                    <span className="text-body-muted">
                        {scheduleText(summarySchedule)}
                    </span>
                ) : current ? (
                    <span className="text-body-muted">오늘 휴무</span>
                ) : null}
            </div>
            <dl className="border-divider mt-3 divide-y">
                {orderedDays.map(({ key, label }) => {
                    const schedule = businessHours.weekly[key];
                    return (
                        <div
                            key={key}
                            className="flex items-center justify-between gap-3 py-2"
                        >
                            <dt className="text-label shrink-0">{label}</dt>
                            <dd className="text-body-muted text-right">
                                {schedule ? scheduleText(schedule) : "휴무"}
                            </dd>
                        </div>
                    );
                })}
            </dl>
            {businessHours.openEveryDay ? (
                <p className="text-success text-label mt-2">연중무휴</p>
            ) : null}
        </div>
    );
}
