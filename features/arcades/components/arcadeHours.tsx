"use client";
import { useTranslations } from "@/components/i18n/localeProvider";
import {
    ARCADE_WEEKDAYS,
    normalizeArcadeBusinessHours,
} from "@/lib/arcadeDetails";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import { formatArcadeTime } from "@/features/arcades/arcadeDiscovery";

const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export default function ArcadeHours({ arcade }: { arcade: PublicArcade }) {
    const t = useTranslations();
    const legacy = normalizeArcadeBusinessHours(arcade.legacyHours);
    if (!arcade.hours && !legacy)
        return (
            <p className="nl-body-secondary nl-muted">
                {t("arcades.hoursUnknown")}
            </p>
        );
    return (
        <>
            <dl className="nl-arcade-hours nl-control">
                {dayKeys.map((day, index) => {
                    const hours =
                        arcade.hours?.weekly[
                            String(index) as keyof typeof arcade.hours.weekly
                        ];
                    const old = legacy?.weekly[ARCADE_WEEKDAYS[index].key];
                    const label = hours
                        ? `${formatArcadeTime(hours.open)}–${formatArcadeTime(hours.close)}`
                        : hours === null
                          ? t("arcades.dayOff")
                          : old
                            ? `${old.open}–${old.close}`
                            : t("arcades.unknown");
                    return (
                        <div key={day}>
                            <dt>{t(`arcades.weekday.${day}`)}</dt>
                            <dd>{label}</dd>
                        </div>
                    );
                })}
            </dl>
            {legacy?.legacyNote ? (
                <p className="nl-body-secondary">{legacy.legacyNote}</p>
            ) : null}
        </>
    );
}
