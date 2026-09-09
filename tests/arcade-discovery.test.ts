import { describe, expect, it } from "vitest";
import {
    arcadeDirections,
    arcadeDistance,
    arcadeOpenState,
    selectArcades,
    arcadeTodayHours,
    formatArcadeTime,
} from "@/features/arcades/arcadeDiscovery";
import {
    arcadeCabinetSchema,
    arcadeDiscoverySchema,
    arcadeHoursSchema,
    publicArcadeSchema,
} from "@/features/arcades/schemas/publicArcadeSchema";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";

const now = new Date("2026-09-07T15:30:00Z"); // Tuesday 00:30 in Tokyo/Seoul.
const base: PublicArcade = {
    id: 1,
    slug: "1",
    name: "ラウンドワン 梅田店",
    nativeLanguage: "ja",
    identities: [
        { locale: "en", name: "Round1 Umeda", aliases: ["ROUND ONE"] },
    ],
    region: "大阪府",
    locality: "大阪市",
    countryCode: "JP",
    timeZone: "Asia/Tokyo",
    currencyCode: "JPY",
    address: "大阪市北区",
    latitude: 34.7,
    longitude: 135.5,
    phone: null,
    website: null,
    playPrice: 100,
    coinCount: 1,
    creditLabel: null,
    notes: null,
    preferredCount: null,
    cabinets: [],
    cabinetVerifiedAt: null,
    hours: {
        weekly: {
            "0": { open: 600, close: 1560 },
            "1": { open: 600, close: 1440 },
        },
        exceptions: {},
    },
    hoursVerifiedAt: "2026-09-01T00:00:00.000Z",
    hoursValidUntil: "2026-10-01T00:00:00.000Z",
    legacyHours: null,
    photos: [],
};
const values = arcadeDiscoverySchema.parse({});

describe("public arcade truth and discovery", () => {
    it("shows today's verified venue-local schedule and preserves overnight notation", () => {
        expect(arcadeTodayHours(base, now)).toEqual({ open: 600, close: 1440 });
        expect(
            arcadeTodayHours({ ...base, hoursValidUntil: null }, now)
        ).toBeUndefined();
        expect(
            arcadeTodayHours(
                {
                    ...base,
                    hours: {
                        ...base.hours!,
                        exceptions: { "2026-09-08": null },
                    },
                },
                now
            )
        ).toBeNull();
        expect(formatArcadeTime(1560)).toBe("26:00");
    });
    it("evaluates overnight hours in the venue time zone", () => {
        expect(arcadeOpenState(base, now)).toBe("open");
        expect(arcadeOpenState(base, new Date("2026-09-07T17:00:00Z"))).toBe(
            "closed"
        );
    });
    it("exceptional closure cancels an overnight opening", () => {
        expect(
            arcadeOpenState(
                {
                    ...base,
                    hours: {
                        ...base.hours!,
                        exceptions: { "2026-09-08": null },
                    },
                },
                now
            )
        ).toBe("closed");
    });
    it("never infers open state from unverified or expired facts", () => {
        for (const override of [
            { hoursVerifiedAt: null },
            { hoursValidUntil: null },
            { hoursValidUntil: now.toISOString() },
            { timeZone: "invalid-zone" },
            { hours: null },
        ]) {
            expect(arcadeOpenState({ ...base, ...override }, now)).toBe(
                "unknown"
            );
        }
    });
    it("missing hours are unknown rather than a closed day", () => {
        expect(
            arcadeOpenState(
                { ...base, hours: { weekly: {}, exceptions: {} } },
                now
            )
        ).toBe("unknown");
    });
    it("validates overnight intervals and rejects negative or inverted times", () => {
        expect(
            arcadeHoursSchema.safeParse({
                weekly: { "0": { open: 600, close: 1560 } },
            }).success
        ).toBe(true);
        for (const interval of [
            { open: -1, close: 100 },
            { open: 600, close: 100 },
            { open: 0, close: 3000 },
        ]) {
            expect(
                arcadeHoursSchema.safeParse({ weekly: { "0": interval } })
                    .success
            ).toBe(false);
        }
    });
    it("requires a playable cabinet and explanation for condition grades", () => {
        const cabinet = {
            id: 1,
            label: null,
            position: 0,
            availability: "available",
            condition: "caution",
            note: "Key input misses",
            verifiedAt: now.toISOString(),
            stale: false,
        };
        expect(arcadeCabinetSchema.safeParse(cabinet).success).toBe(true);
        expect(
            arcadeCabinetSchema.safeParse({
                ...cabinet,
                availability: "unavailable",
            }).success
        ).toBe(false);
        expect(
            arcadeCabinetSchema.safeParse({ ...cabinet, note: " " }).success
        ).toBe(false);
    });
    it("forbids disclosure of one- and two-person preference counts", () => {
        expect(publicArcadeSchema.safeParse(base).success).toBe(true);
        for (const preferredCount of [0, 1, 2]) {
            expect(
                publicArcadeSchema.safeParse({ ...base, preferredCount })
                    .success
            ).toBe(false);
        }
        expect(
            publicArcadeSchema.safeParse({ ...base, preferredCount: 3 }).success
        ).toBe(true);
    });
    it("searches reviewed aliases with Unicode normalization", () => {
        expect(
            selectArcades(
                [base],
                { ...values, q: "ＲＯＵＮＤ ＯＮＥ" },
                "en",
                null,
                null,
                now
            )
        ).toEqual([base]);
        expect(
            selectArcades(
                [base],
                { ...values, q: "not found" },
                "en",
                null,
                null,
                now
            )
        ).toEqual([]);
    });
    it("applies open and cabinet filters to one result set", () => {
        expect(
            selectArcades(
                [base],
                { ...values, open: true },
                "ja",
                null,
                null,
                now
            )
        ).toEqual([base]);
        expect(
            selectArcades(
                [base],
                { ...values, available: true },
                "ja",
                null,
                null,
                now
            )
        ).toEqual([]);
        const available = {
            ...base,
            cabinets: [
                arcadeCabinetSchema.parse({
                    id: 1,
                    label: null,
                    position: 0,
                    availability: "available",
                    condition: "good",
                    note: null,
                    verifiedAt: now.toISOString(),
                    stale: false,
                }),
            ],
        };
        expect(
            selectArcades(
                [available],
                { ...values, available: true, open: true },
                "ja",
                null,
                null,
                now
            )
        ).toEqual([available]);
        expect(
            selectArcades(
                [
                    {
                        ...available,
                        cabinets: [{ ...available.cabinets[0], stale: true }],
                    },
                ],
                { ...values, available: true },
                "ja",
                null,
                null,
                now
            )
        ).toEqual([]);
    });
    it("uses explicit geographic bounds and excludes unknown coordinates", () => {
        const bounds = { south: 34, north: 35, west: 135, east: 136 };
        expect(selectArcades([base], values, "ja", null, bounds, now)).toEqual([
            base,
        ]);
        expect(
            selectArcades(
                [base],
                values,
                "ja",
                null,
                { ...bounds, north: 34.1 },
                now
            )
        ).toEqual([]);
        expect(
            selectArcades(
                [{ ...base, latitude: null }],
                values,
                "ja",
                null,
                bounds,
                now
            )
        ).toEqual([]);
    });
    it("distance sorting puts missing coordinates last and never changes preference", () => {
        const origin = { latitude: 34.7, longitude: 135.5 };
        expect(arcadeDistance(base, origin)).toBe(0);
        const distant = { ...base, id: 2, latitude: 35.7 };
        const missing = { ...base, id: 3, latitude: null };
        expect(
            selectArcades(
                [missing, distant, base],
                { ...values, sort: "distance" },
                "ja",
                origin,
                null,
                now
            ).map((item) => item.id)
        ).toEqual([1, 2, 3]);
        expect(base.preferredCount).toBeNull();
    });
    it("directions follow venue country independently of UI locale", () => {
        expect(arcadeDirections(base)).toContain("google.com/maps/dir/");
        expect(arcadeDirections({ ...base, countryCode: "KR" })).toContain(
            "map.kakao.com/link/to/"
        );
        expect(
            arcadeDirections({ ...base, latitude: null, longitude: null })
        ).toContain(encodeURIComponent(base.address!));
        expect(
            arcadeDirections({
                ...base,
                latitude: null,
                longitude: null,
                address: null,
            })
        ).toBeNull();
    });
});
