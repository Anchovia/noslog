"use client";
import { useTranslations } from "@/components/i18n/localeProvider";
import { normalizeArcadeBusinessHours } from "@/lib/arcadeDetails";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import {
    arcadeWeekHours,
    formatArcadeClose,
    formatArcadeTime,
} from "@/features/arcades/arcadeDiscovery";

const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/**
 * 오늘부터 7일 — 요일·날짜와 함께, 오늘 줄은 굵게. 토요일 · 일요일은 요일·날짜 칸만 파랑 · 빨강(지도 서비스 관례). 날짜별 예외(임시 휴무 등)가 그 날짜 줄에 그대로 보인다.
 * 마감은 요약 줄과 같은 표기(자정 24:00, 넘기면 다음 날 시각)
 */
export default function ArcadeHours({
    arcade,
    now,
}: {
    arcade: PublicArcade;
    now: Date;
}) {
    const t = useTranslations();
    const days = arcadeWeekHours(arcade, now);
    const legacyNote = normalizeArcadeBusinessHours(
        arcade.legacyHours
    )?.legacyNote;
    if (!days)
        return (
            <p className="nl-body-secondary nl-muted">
                {t("arcades.hoursUnknown")}
            </p>
        );
    return (
        <>
            <dl className="nl-arcade-hours nl-body-secondary">
                {days.map((day) => (
                    <div
                        key={day.date}
                        className={day.today ? "nl-emphasis-label" : undefined}
                        data-today={day.today || undefined}
                        data-muted={day.hours ? undefined : true}
                        data-weekend={
                            day.weekday >= 5 ? dayKeys[day.weekday] : undefined
                        }
                    >
                        <dt>
                            {t(`arcades.weekday.${dayKeys[day.weekday]}`)}{" "}
                            {day.month}/{day.day}
                        </dt>
                        <dd>
                            {day.hours
                                ? `${formatArcadeTime(day.hours.open)}–${formatArcadeClose(day.hours.close)}`
                                : t(
                                      day.hours === null
                                          ? "arcades.dayOff"
                                          : "arcades.unknown"
                                  )}
                        </dd>
                    </div>
                ))}
            </dl>
            {legacyNote ? (
                <p className="nl-body-secondary">{legacyNote}</p>
            ) : null}
        </>
    );
}
