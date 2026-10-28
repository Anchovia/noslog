import { z } from "zod";

/**
 * 뮤즈캣 기록 봉투 `musecat-records/v1`(뮤즈캣 Partner Integration Spec v1 · record-adapters.md).
 * 키 이름 · 한도는 뮤즈캣이 정한 값이다 — 바꾸지 않는다(「표준 키의 뜻을 바꾸지 말 것」).
 */
export const MUSECAT_RECORDS_SPEC = "musecat-records/v1";
export const MUSECAT_NOSTALGIA_GAME_SCHEMA = "musecat-game/nostalgia/v1";
export const MUSECAT_RECORDS_MAX_BYTES = 256 * 1024;

const httpsUrlSchema = z
    .url()
    .refine((value) => value.startsWith("https://"), "HTTPS only");

export const musecatLabelSchema = z.object({
    en: z.string().min(1),
    ko: z.string().min(1).optional(),
    ja: z.string().min(1).optional(),
});

const fieldTypeSchema = z.enum([
    "integer",
    "decimal",
    "string",
    "percent",
    "datetime",
    "date",
    "rank",
]);

export const musecatFieldSchema = z.object({
    key: z.string().min(1).max(128),
    label: musecatLabelSchema,
    type: fieldTypeSchema,
    value: z.union([z.string(), z.number().finite(), z.null()]),
    precision: z.number().int().min(0).max(6).optional(),
});

const sectionSchema = z.object({
    key: z.string().min(1).max(128),
    label: musecatLabelSchema,
    columns: z
        .array(
            z.object({
                key: z.string().min(1),
                label: musecatLabelSchema,
                type: fieldTypeSchema,
            })
        )
        .min(1)
        .max(8),
    rows: z.array(z.array(z.union([z.string(), z.number(), z.null()]))).max(50),
    total: z.number().int().min(0).optional(),
    more_url: httpsUrlSchema.optional(),
});

const playSchema = z.object({
    id: z.string().min(1).optional(),
    played_at: z.iso.datetime(),
    song: z.object({
        title: z.string().min(1),
        id: z.string().min(1).optional(),
        artist: z.string().min(1).optional(),
        image_url: httpsUrlSchema.optional(),
    }),
    chart: z.object({
        difficulty: z.string().min(1),
        id: z.string().min(1).optional(),
        level: z.string().min(1).optional(),
        mode: z.string().min(1).optional(),
    }),
    fields: z.array(musecatFieldSchema).max(16),
});

const selectionKeySchema = z
    .string()
    .regex(/^(player|fields|sections|recent_plays|(fields|sections)\..+)$/);

export const musecatSelectionSchema = z.object({
    key: selectionKeySchema,
    status: z.enum(["denied", "no_data", "unsupported"]),
});

export const musecatRecordsSchema = z
    .object({
        spec: z.literal(MUSECAT_RECORDS_SPEC),
        service: z.literal("nostalgia"),
        sub: z.string().min(1).max(256),
        visibility: z.enum(["public", "private"]),
        updated_at: z.iso.datetime(),
        source: z.object({ name: z.string().min(1), url: httpsUrlSchema }),
        game_schema: z.literal(MUSECAT_NOSTALGIA_GAME_SCHEMA),
        player: z
            .object({
                name: z.string().min(1),
                title: z.string().min(1).optional(),
            })
            .optional(),
        fields: z.array(musecatFieldSchema).max(24),
        sections: z.array(sectionSchema).max(4),
        recent_plays: z
            .object({
                plays: z.array(playSchema).max(50),
                total: z.number().int().min(0).optional(),
                more_url: httpsUrlSchema.optional(),
            })
            .optional(),
        selection: z.array(musecatSelectionSchema).max(64),
    })
    .superRefine((value, context) => {
        // 막은 그룹에는 데이터가 없어야 한다(뮤즈캣 spec「User-selected export」)
        for (const { key } of value.selection) {
            if (
                (key === "player" && value.player) ||
                (key === "recent_plays" && value.recent_plays) ||
                (key === "fields" && value.fields.length > 0) ||
                (key === "sections" && value.sections.length > 0) ||
                (key.startsWith("fields.") &&
                    value.fields.some(
                        (field) => `fields.${field.key}` === key
                    )) ||
                (key.startsWith("sections.") &&
                    value.sections.some(
                        (section) => `sections.${section.key}` === key
                    ))
            ) {
                context.addIssue({
                    code: "custom",
                    message: `Withheld ${key} must not carry data`,
                });
            }
        }
    });

export type MusecatField = z.infer<typeof musecatFieldSchema>;
export type MusecatSelection = z.infer<typeof musecatSelectionSchema>;
export type MusecatRecords = z.infer<typeof musecatRecordsSchema>;
