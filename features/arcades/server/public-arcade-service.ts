import "server-only";

import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
    arcadeCabinetSchema,
    arcadeHoursSchema,
    publicArcadeSchema,
} from "@/features/arcades/schemas/public-arcade-schema";
import {
    ARCADE_CABINET_TAGS,
    ARCADE_FACILITIES,
    knownArcadeValues,
    knownFeatureValue,
    legacyToPublicArcadeHours,
} from "@/lib/arcade-details";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";

// 이용자 확인은 30일, 미처리 신고는 60일 창으로 본다
const CABINET_CHECK_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
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
                    select: { createdAt: true, userId: true },
                },
            },
        },
        publicPhotos: { orderBy: { slot: "asc" as const } },
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

function toPublicArcade(record: ArcadeRecord, now: Date) {
    const details = record.publicDetails;
    const hours = arcadeHoursSchema.safeParse(details?.hours);
    return publicArcadeSchema.parse({
        id: record.id,
        slug: details?.slug ?? String(record.id),
        name: record.name,
        nativeLanguage: details?.nativeLanguage ?? null,
        // 지역 · 주소는 공개 정보가 정본(2026-10-16 D6 — 옛 칸은 백필 뒤 쓰지 않는다)
        region: details?.administrativeArea ?? null,
        locality: details?.locality ?? null,
        countryCode: details?.countryCode ?? "KR",
        timeZone: details?.timeZone ?? "Asia/Seoul",
        currencyCode: details?.currencyCode ?? "KRW",
        address: details?.addressLines.length
            ? details.addressLines.join("\n")
            : null,
        latitude: record.latitude,
        longitude: record.longitude,
        phone: details?.phone ?? null,
        website: publicWebsite(details?.website),
        playPrice: record.playPrice,
        coinCount:
            record.coinCount && record.coinCount > 0 ? record.coinCount : null,
        creditLabel: details?.creditLabel ?? null,
        facilities: knownArcadeValues(ARCADE_FACILITIES, details?.facilities),
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
                conditionNote: cabinet.conditionNote,
                tags: knownArcadeValues(ARCADE_CABINET_TAGS, cabinet.tags),
                features: {
                    keyWeight: knownFeatureValue(
                        "keyWeight",
                        cabinet.keyWeight
                    ),
                    screenLag: knownFeatureValue(
                        "screenLag",
                        cabinet.screenLag
                    ),
                    soundVolume: knownFeatureValue(
                        "soundVolume",
                        cabinet.soundVolume
                    ),
                },
                featureNote: cabinet.featureNote,
                verifiedAt: userConfirmed
                    ? lastCheck!.toISOString()
                    : adminVerified
                      ? cabinet.verifiedAt!.toISOString()
                      : null,
                stale,
                lastCheckedAt: lastCheck?.toISOString() ?? null,
                checkCount: new Set(cabinet.checks.map((check) => check.userId))
                    .size,
                // 같은 사람이 여러 번 보낸 신고는 한 건으로 — 한 사람이 수를 부풀리지 못하게
                openReports: new Set(
                    cabinet.reports.map((report) => report.userId)
                ).size,
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
        // 공개 영업시간이 없으면 옛 영업시간을 옮겨 쓴다 — 영업 중·종료와 7일 표가 같은 값을 본다
        hours: hours.success
            ? hours.data
            : legacyToPublicArcadeHours(record.businessHours),
        hoursVerifiedAt: details?.hoursVerifiedAt?.toISOString() ?? null,
        hoursValidUntil: details?.hoursValidUntil?.toISOString() ?? null,
        legacyHours: record.businessHours,
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

/*
 * 공개 오락실은 모두에게 같다 — arcades 태그로 캐시하고(2026-10-15 S7) 확인 · 신고 · 선호 · 관리자 저장 때 비운다.
 * 30일 확인 · 60일 신고 창과 예약 공개(사진 · 다른 이름) · 유효 기간은 캐시를 만든 시각 기준이라 최대 한 시간 늦게 바뀔 수 있다.
 * 내 확인 기체는 사람마다 달라 캐시 밖에서 따로 읽는다
 */
const queryPublicArcades = unstable_cache(
    async () => {
        const now = new Date();
        const records = await db.arcade.findMany({
            where: { isActive: true },
            include: publicInclude(now),
        });
        return records.map((record) => toPublicArcade(record, now));
    },
    ["public-arcades-v1"],
    { tags: [CACHE_TAGS.arcades], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

export const getPublicArcades = cache(() => queryPublicArcades());

const queryPublicArcade = unstable_cache(
    async (slug: string) => {
        const numericId =
            /^[1-9]\d*$/.test(slug) && Number.isSafeInteger(Number(slug))
                ? Number(slug)
                : null;
        const now = new Date();
        const include = publicInclude(now);
        // 공개 주소가 먼저, 없으면 예전 번호 주소
        let record = await db.arcade.findFirst({
            where: { isActive: true, publicDetails: { is: { slug } } },
            include,
        });
        if (!record && numericId !== null)
            record = await db.arcade.findFirst({
                where: { isActive: true, id: numericId },
                include,
            });
        return record ? toPublicArcade(record, now) : null;
    },
    ["public-arcade-v1"],
    { tags: [CACHE_TAGS.arcades], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

export const getPublicArcade = cache((slug: string) => queryPublicArcade(slug));
