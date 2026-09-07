"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useArcadeSession } from "@/features/arcades/hooks/useArcadeSession";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";

export function ArcadeAvailability({ arcade }: { arcade: PublicArcade }) {
    const t = useTranslations();
    const known = arcade.cabinets.filter(
        (cabinet) => cabinet.availability !== "unknown" && !cabinet.stale
    );
    if (!known.length) return <>{t("arcades.availabilityUnknown")}</>;
    const available = known.filter(
        (cabinet) => cabinet.availability === "available"
    );
    return (
        <>
            {t("arcades.availabilitySummary", {
                total: arcade.cabinets.length,
                available: available.length,
            })}
            {available.some((cabinet) => cabinet.condition === "caution")
                ? ` · ${t("arcades.includesCaution")}`
                : ""}
        </>
    );
}

export default function ArcadeResultCard({
    arcade,
    distance,
    selected,
    onSelect,
}: {
    arcade: PublicArcade;
    distance: number | null;
    selected: boolean;
    onSelect: (id: number) => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const photo = arcade.photos[0];
    const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
    const saveQuery = useArcadeSession((state) => state.setDiscoveryQuery);
    return (
        <Link
            href={href(`/gamecenter/${arcade.slug}`)}
            prefetch={false}
            className="nl-arcade-result"
            data-selected={selected || undefined}
            onFocus={() => onSelect(arcade.id)}
            onPointerEnter={() => onSelect(arcade.id)}
            onClick={() => {
                const current = new URLSearchParams(window.location.search);
                const query = new URLSearchParams();
                for (const key of [
                    "q",
                    "region",
                    "open",
                    "available",
                    "sort",
                    "mode",
                ]) {
                    const value = current.get(key);
                    if (value !== null) query.set(key, value);
                }
                saveQuery(query.toString());
            }}
        >
            <span className="nl-arcade-result__photo" aria-hidden>
                {photo && failedPhoto !== photo.url ? (
                    <Image
                        src={photo.url}
                        width={64}
                        height={64}
                        alt=""
                        onError={() => setFailedPhoto(photo.url)}
                    />
                ) : (
                    <MapPin className="nl-icon" />
                )}
            </span>
            <span className="nl-arcade-result__copy">
                <span className="nl-arcade-result__heading">
                    <span
                        className="nl-entity-title"
                        lang={arcade.nativeLanguage ?? undefined}
                    >
                        {arcade.name}
                    </span>
                    {arcade.region ? (
                        <span className="nl-body-secondary nl-muted">
                            {[arcade.region, arcade.locality]
                                .filter(Boolean)
                                .join(" · ")}
                        </span>
                    ) : null}
                </span>
                <span className="nl-body-secondary">
                    <ArcadeAvailability arcade={arcade} />
                </span>
                {arcade.preferredCount !== null || distance !== null ? (
                    <span className="nl-metadata nl-muted">
                        {[
                            arcade.preferredCount !== null
                                ? t("arcades.preferredPeople", {
                                      count: arcade.preferredCount,
                                  })
                                : null,
                            distance !== null
                                ? t("arcades.distance", {
                                      distance: distance.toFixed(1),
                                  })
                                : null,
                        ]
                            .filter(Boolean)
                            .join(" · ")}
                    </span>
                ) : null}
            </span>
        </Link>
    );
}
