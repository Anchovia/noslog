import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import db from "@/lib/db";
import {
    arcadeCabinetSchema,
    arcadeHoursSchema,
    publicArcadeSchema,
} from "@/features/arcades/schemas/publicArcadeSchema";

const publicInclude = {
    publicDetails: true,
    cabinets: {
        where: { isActive: true },
        orderBy: { position: "asc" as const },
    },
    publicPhotos: { orderBy: { slot: "asc" as const } },
    identities: true,
    _count: { select: { users: true } },
} satisfies Prisma.ArcadeInclude;

type ArcadeRecord = Prisma.ArcadeGetPayload<{ include: typeof publicInclude }>;

function publicWebsite(value: string | null | undefined) {
    if (!value) return null;
    try {
        const url = new URL(value);
        return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}

export function toPublicArcade(record: ArcadeRecord, now: Date) {
    const details = record.publicDetails;
    const hours = arcadeHoursSchema.safeParse(details?.hours);
    return publicArcadeSchema.parse({
        id: record.id,
        slug: details?.slug ?? String(record.id),
        name: record.name,
        nativeLanguage: details?.nativeLanguage ?? null,
        identities: record.identities
            .filter((item) => item.reviewedAt <= now)
            .map(({ locale, name, aliases }) => ({ locale, name, aliases })),
        region: details?.administrativeArea ?? record.region,
        locality: details?.locality ?? null,
        countryCode: details?.countryCode ?? "KR",
        timeZone: details?.timeZone ?? "Asia/Seoul",
        currencyCode: details?.currencyCode ?? "KRW",
        address: details?.addressLines.length
            ? details.addressLines.join("\n")
            : record.address,
        latitude: record.latitude,
        longitude: record.longitude,
        phone: details?.phone ?? null,
        website: publicWebsite(details?.website),
        playPrice: record.play_price,
        coinCount:
            record.coin_count && record.coin_count > 0
                ? record.coin_count
                : null,
        creditLabel: details?.creditLabel ?? null,
        notes: record.notes,
        preferredCount: record._count.users >= 3 ? record._count.users : null,
        cabinets: record.cabinets.map((cabinet) => {
            const stale = Boolean(
                cabinet.validUntil && cabinet.validUntil <= now
            );
            const verified = Boolean(
                cabinet.verifiedAt && cabinet.verifiedAt <= now
            );
            const availability = verified ? cabinet.availability : "unknown";
            const normalized = {
                id: cabinet.id,
                label: cabinet.label,
                position: cabinet.position,
                availability,
                condition:
                    availability === "available"
                        ? cabinet.condition
                        : "unknown",
                note: cabinet.note,
                verifiedAt: verified ? cabinet.verifiedAt!.toISOString() : null,
                stale,
            };
            const parsed = arcadeCabinetSchema.safeParse(normalized);
            return parsed.success
                ? parsed.data
                : arcadeCabinetSchema.parse({
                      ...normalized,
                      availability: "unknown",
                      condition: "unknown",
                  });
        }),
        cabinetVerifiedAt:
            details?.cabinetVerifiedAt && details.cabinetVerifiedAt <= now
                ? details.cabinetVerifiedAt.toISOString()
                : null,
        hours: hours.success ? hours.data : null,
        hoursVerifiedAt: details?.hoursVerifiedAt?.toISOString() ?? null,
        hoursValidUntil: details?.hoursValidUntil?.toISOString() ?? null,
        legacyHours: record.business_hours,
        photos: record.publicPhotos
            .filter((photo) => {
                if (
                    photo.slot < 0 ||
                    photo.slot > 2 ||
                    photo.rightsConfirmedAt > now ||
                    photo.publicConsentAt > now
                )
                    return false;
                try {
                    const url = new URL(photo.url);
                    return (
                        url.protocol === "https:" &&
                        url.hostname.endsWith(".public.blob.vercel-storage.com")
                    );
                } catch {
                    return false;
                }
            })
            .map(({ id, slot, url, alt, capturedAt }) => ({
                id,
                slot,
                url,
                alt,
                capturedAt: capturedAt?.toISOString() ?? null,
            })),
    });
}

export const getPublicArcades = cache(async () => {
    const records = await db.arcade.findMany({
        where: { is_active: true },
        include: publicInclude,
    });
    const now = new Date();
    return records.map((record) => toPublicArcade(record, now));
});

export const getPublicArcade = cache(async (slug: string) => {
    const numericId =
        /^[1-9]\d*$/.test(slug) && Number.isSafeInteger(Number(slug))
            ? Number(slug)
            : null;
    // Canonical URLs win over historical aliases and legacy numeric URLs.
    let record = await db.arcade.findFirst({
        where: { is_active: true, publicDetails: { is: { slug } } },
        include: publicInclude,
    });
    record ??= await db.arcade.findFirst({
        where: { is_active: true, slugAliases: { some: { slug } } },
        include: publicInclude,
    });
    if (!record && numericId !== null)
        record = await db.arcade.findFirst({
            where: { is_active: true, id: numericId },
            include: publicInclude,
        });
    return record ? toPublicArcade(record, new Date()) : null;
});
