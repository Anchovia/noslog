import { z } from "zod";

export const arcadeCabinetSchema = z
    .object({
        id: z.number().int().positive(),
        label: z.string().nullable(),
        position: z.number().int().nonnegative(),
        availability: z.enum(["unknown", "available", "unavailable"]),
        condition: z.enum(["unknown", "good", "normal", "caution"]),
        note: z.string().nullable(),
        verifiedAt: z.iso.datetime().nullable(),
        stale: z.boolean(),
    })
    .superRefine((cabinet, ctx) => {
        if (
            cabinet.availability !== "available" &&
            cabinet.condition !== "unknown"
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["condition"],
                message: "condition_requires_available",
            });
        }
        if (
            ["normal", "caution"].includes(cabinet.condition) &&
            !cabinet.note?.trim()
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["note"],
                message: "condition_note_required",
            });
        }
    });

const hoursIntervalSchema = z
    .object({
        open: z.number().int().min(0).max(1439),
        close: z.number().int().min(1).max(2880),
    })
    .refine(({ open, close }) => close > open, {
        message: "hours_interval_invalid",
    });

export const arcadeHoursSchema = z.object({
    // Monday is zero. null is a verified closed day; a missing key is unknown.
    weekly: z.partialRecord(
        z.enum(["0", "1", "2", "3", "4", "5", "6"]),
        hoursIntervalSchema.nullable()
    ),
    exceptions: z
        .record(
            z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            hoursIntervalSchema.nullable()
        )
        .default({}),
});

export const publicArcadeSchema = z.object({
    id: z.number().int().positive(),
    slug: z.string().min(1),
    name: z.string().min(1),
    nativeLanguage: z.string().nullable(),
    identities: z.array(
        z.object({
            locale: z.string(),
            name: z.string(),
            aliases: z.array(z.string()),
        })
    ),
    region: z.string().nullable(),
    locality: z.string().nullable(),
    countryCode: z.string().length(2),
    timeZone: z.string(),
    currencyCode: z.string().length(3),
    address: z.string().nullable(),
    latitude: z.number().min(-90).max(90).nullable(),
    longitude: z.number().min(-180).max(180).nullable(),
    phone: z.string().nullable(),
    website: z.url().nullable(),
    playPrice: z.number().nonnegative().nullable(),
    coinCount: z.number().int().positive().nullable(),
    creditLabel: z.string().nullable(),
    notes: z.string().nullable(),
    preferredCount: z.number().int().min(3).nullable(),
    cabinets: z.array(arcadeCabinetSchema),
    cabinetVerifiedAt: z.iso.datetime().nullable(),
    hours: arcadeHoursSchema.nullable(),
    hoursVerifiedAt: z.iso.datetime().nullable(),
    hoursValidUntil: z.iso.datetime().nullable(),
    legacyHours: z.unknown(),
    photos: z
        .array(
            z.object({
                id: z.number().int().positive(),
                slot: z.number().int().min(0).max(2),
                url: z.url(),
                alt: z.string(),
                capturedAt: z.iso.datetime().nullable(),
            })
        )
        .max(3),
});

export type PublicArcade = z.infer<typeof publicArcadeSchema>;
export type ArcadeCabinet = z.infer<typeof arcadeCabinetSchema>;
export type ArcadeHours = z.infer<typeof arcadeHoursSchema>;

export const arcadeDiscoverySchema = z.object({
    q: z.string().max(200).default(""),
    region: z.string().max(100).default(""),
    open: z.boolean().default(false),
    available: z.boolean().default(false),
    sort: z
        .enum(["default", "name", "preferred", "distance"])
        .default("default"),
    mode: z.enum(["list", "map"]).default("list"),
});
export type ArcadeDiscoveryValues = z.infer<typeof arcadeDiscoverySchema>;
