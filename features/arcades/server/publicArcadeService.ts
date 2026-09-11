import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import db from "@/lib/db";
import {
    arcadeCabinetSchema,
    arcadeHoursSchema,
    publicArcadeSchema,
} from "@/features/arcades/schemas/publicArcadeSchema";

// 이용자 확인은 30일, 미처리 신고는 60일 창으로 본다
export const CABINET_CHECK_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const CABINET_REPORT_WINDOW_MS = 60 * 24 * 60 * 60 * 1000;

function publicInclude(now: Date) {
    return {
        publicDetails: true,
        cabinets: {
            where: { isActive: true },
            orderBy: { position: "asc" as const },
            include: {
                checks: {
                    where: {
                        checkedAt: {
                            gte: new Date(
                                now.getTime() - CABINET_CHECK_WINDOW_MS
                            ),
                            lte: now,
                        },
                    },
                    select: { userId: true, checkedAt: true },
                },
                reports: {
                    where: {
                        status: "open",
                        arcadeReportType: { in: ["unavailable", "condition"] },
                        createdAt: {
                            gte: new Date(
                                now.getTime() - CABINET_REPORT_WINDOW_MS
                            ),
                        },
                    },
                    select: { createdAt: true },
                },
            },
        },
        publicPhotos: { orderBy: { slot: "asc" as const } },
        identities: true,
        _count: { select: { users: true } },
    } satisfies Prisma.ArcadeInclude;
}

type ArcadeRecord = Prisma.ArcadeGetPayload<{
    include: ReturnType<typeof publicInclude>;
}>;

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
            const adminStale = Boolean(
                cabinet.validUntil && cabinet.validUntil <= now
            );
            const adminVerified = Boolean(
                cabinet.verifiedAt && cabinet.verifiedAt <= now
            );
            const lastCheck = cabinet.checks.reduce<Date | null>(
                (latest, check) =>
                    !latest || check.checkedAt > latest
                        ? check.checkedAt
                        : latest,
                null
            );
            // 이용자 확인이 관리자 검증보다 새로우면 「가동」 으로 본다. 상태(양호·주의)는 관리자 검증만 말한다
            const userConfirmed =
                lastCheck !== null &&
                (!adminVerified || lastCheck > cabinet.verifiedAt!);
            const availability = userConfirmed
                ? "available"
                : adminVerified
                  ? cabinet.availability
                  : "unknown";
            const stale = userConfirmed ? false : adminStale;
            const normalized = {
                id: cabinet.id,
                label: cabinet.label,
                position: cabinet.position,
                availability,
                condition:
                    availability === "available" && adminVerified && !adminStale
                        ? cabinet.condition
                        : "unknown",
                note: cabinet.note,
                verifiedAt: userConfirmed
                    ? lastCheck!.toISOString()
                    : adminVerified
                      ? cabinet.verifiedAt!.toISOString()
                      : null,
                stale,
                lastCheckedAt: lastCheck?.toISOString() ?? null,
                checkCount: new Set(cabinet.checks.map((check) => check.userId))
                    .size,
                openReports: cabinet.reports.length,
                latestReportAt:
                    cabinet.reports
                        .reduce<Date | null>(
                            (latest, report) =>
                                !latest || report.createdAt > latest
                                    ? report.createdAt
                                    : latest,
                            null
                        )
                        ?.toISOString() ?? null,
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
        lastCheckedAt:
            record.cabinets
                .flatMap((cabinet) => cabinet.checks.map((c) => c.checkedAt))
                .reduce<Date | null>(
                    (latest, at) => (!latest || at > latest ? at : latest),
                    null
                )
                ?.toISOString() ?? null,
        checkCount: new Set(
            record.cabinets.flatMap((cabinet) =>
                cabinet.checks.map((c) => c.userId)
            )
        ).size,
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
    const now = new Date();
    const records = await db.arcade.findMany({
        where: { is_active: true },
        include: publicInclude(now),
    });
    return records.map((record) => toPublicArcade(record, now));
});

export const getPublicArcade = cache(async (slug: string) => {
    const numericId =
        /^[1-9]\d*$/.test(slug) && Number.isSafeInteger(Number(slug))
            ? Number(slug)
            : null;
    const now = new Date();
    const include = publicInclude(now);
    // Canonical URLs win over historical aliases and legacy numeric URLs.
    let record = await db.arcade.findFirst({
        where: { is_active: true, publicDetails: { is: { slug } } },
        include,
    });
    record ??= await db.arcade.findFirst({
        where: { is_active: true, slugAliases: { some: { slug } } },
        include,
    });
    if (!record && numericId !== null)
        record = await db.arcade.findFirst({
            where: { is_active: true, id: numericId },
            include,
        });
    return record ? toPublicArcade(record, now) : null;
});
