import { z } from "zod";

export const CHART_FORMAT_VERSION = 1;
export const CHART_LANE_COUNT = 28;
export const CHART_LANE_GROUP_BOUNDARIES = [
    0, 3, 6, 9, 12, 16, 19, 22, 25, 28,
] as const;
export const CHART_TICKS_PER_QUARTER = 480;

export function isChartLaneGroupBoundary(lane: number) {
    return CHART_LANE_GROUP_BOUNDARIES.some((boundary) => boundary === lane);
}

export const chartHandSchema = z.enum(["left", "right"]);
export const chartNoteTypeSchema = z.enum([
    "standard",
    "tenuto",
    "glissando",
    "trill",
]);

export const timeSignatureDenominatorSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(4),
    z.literal(8),
    z.literal(16),
    z.literal(32),
]);

export const chartTimingPointSchema = z
    .object({
        id: z.string().min(1).max(64),
        tick: z.number().int().min(-10_000_000).max(1_000_000_000),
        timeMs: z.number().finite().min(-600_000).max(86_400_000),
        bpm: z.number().finite().min(1).max(1_000),
        numerator: z.number().int().min(1).max(64),
        denominator: timeSignatureDenominatorSchema,
    })
    .strict();

export const chartPathPointSchema = z
    .object({
        tickOffset: z.number().int().min(0).max(1_000_000_000),
        lane: z
            .number()
            .int()
            .min(0)
            .max(CHART_LANE_COUNT - 1),
        width: z.number().int().min(1).max(CHART_LANE_COUNT),
        hand: chartHandSchema.optional(),
    })
    .strict()
    .refine((point) => point.lane + point.width <= CHART_LANE_COUNT, {
        message: "노트 경로가 28칸 범위를 벗어났습니다.",
    });

export const chartNoteSchema = z
    .object({
        id: z.string().min(1).max(64),
        type: chartNoteTypeSchema,
        hand: chartHandSchema,
        tick: z.number().int().min(-10_000_000).max(1_000_000_000),
        durationTicks: z.number().int().min(0).max(1_000_000_000),
        lane: z
            .number()
            .int()
            .min(0)
            .max(CHART_LANE_COUNT - 1),
        width: z.number().int().min(1).max(CHART_LANE_COUNT),
        pairLane: z
            .number()
            .int()
            .min(0)
            .max(CHART_LANE_COUNT - 1)
            .optional(),
        pairWidth: z.number().int().min(1).max(CHART_LANE_COUNT).optional(),
        trillSnapDivisor: z.number().int().min(1).max(64).optional(),
        glissandoSnapDivisor: z.number().int().min(1).max(64).optional(),
        points: z.array(chartPathPointSchema).max(10_000).default([]),
    })
    .strict()
    .superRefine((note, context) => {
        if (note.lane + note.width > CHART_LANE_COUNT) {
            context.addIssue({
                code: "custom",
                message: "노트가 28칸 범위를 벗어났습니다.",
                path: ["width"],
            });
        }
        if (note.type === "standard" && note.durationTicks !== 0) {
            context.addIssue({
                code: "custom",
                message: "일반 노트에는 길이를 지정할 수 없습니다.",
                path: ["durationTicks"],
            });
        }
        if (note.type !== "standard" && note.durationTicks <= 0) {
            context.addIssue({
                code: "custom",
                message: "지속 노트에는 1틱 이상의 길이가 필요합니다.",
                path: ["durationTicks"],
            });
        }
        if (note.type === "trill") {
            if (note.pairLane === undefined || note.pairWidth === undefined) {
                context.addIssue({
                    code: "custom",
                    message: "트릴에는 두 번째 위치와 폭이 필요합니다.",
                    path: ["pairLane"],
                });
            } else if (note.pairLane + note.pairWidth > CHART_LANE_COUNT) {
                context.addIssue({
                    code: "custom",
                    message: "트릴의 두 번째 위치가 28칸 범위를 벗어났습니다.",
                    path: ["pairWidth"],
                });
            }
            if (note.glissandoSnapDivisor !== undefined) {
                context.addIssue({
                    code: "custom",
                    message:
                        "트릴에는 글리산도 연결 간격을 지정할 수 없습니다.",
                    path: ["glissandoSnapDivisor"],
                });
            }
        } else if (
            note.pairLane !== undefined ||
            note.pairWidth !== undefined ||
            note.trillSnapDivisor !== undefined
        ) {
            context.addIssue({
                code: "custom",
                message: "트릴 이외의 노트에는 트릴 속성을 지정할 수 없습니다.",
                path: ["pairLane"],
            });
        }
        if (
            note.type !== "glissando" &&
            note.glissandoSnapDivisor !== undefined
        ) {
            context.addIssue({
                code: "custom",
                message:
                    "글리산도 이외의 노트에는 연결 간격을 지정할 수 없습니다.",
                path: ["glissandoSnapDivisor"],
            });
        }
        for (const [index, point] of note.points.entries()) {
            if (point.tickOffset > note.durationTicks) {
                context.addIssue({
                    code: "custom",
                    message: "경로 제어점이 노트의 길이를 벗어났습니다.",
                    path: ["points", index, "tickOffset"],
                });
            }
        }
    });

export const chartDocumentSchema = z
    .object({
        version: z.literal(CHART_FORMAT_VERSION),
        laneCount: z.literal(CHART_LANE_COUNT),
        ticksPerQuarter: z.literal(CHART_TICKS_PER_QUARTER),
        durationMs: z.number().int().min(0).max(86_400_000),
        timingPoints: z.array(chartTimingPointSchema).min(1).max(10_000),
        notes: z.array(chartNoteSchema).max(100_000),
    })
    .strict()
    .superRefine((document, context) => {
        const ids = new Set<string>();
        for (const [index, point] of document.timingPoints.entries()) {
            if (ids.has(point.id)) {
                context.addIssue({
                    code: "custom",
                    message: "중복된 타이밍 포인트 ID입니다.",
                    path: ["timingPoints", index, "id"],
                });
            }
            ids.add(point.id);
        }
        for (const [index, note] of document.notes.entries()) {
            if (ids.has(note.id)) {
                context.addIssue({
                    code: "custom",
                    message: "중복된 노트 ID입니다.",
                    path: ["notes", index, "id"],
                });
            }
            ids.add(note.id);
        }

        const sorted = [...document.timingPoints].sort(
            (a, b) => a.tick - b.tick || a.timeMs - b.timeMs
        );
        for (let index = 1; index < sorted.length; index += 1) {
            if (
                sorted[index].tick <= sorted[index - 1].tick ||
                sorted[index].timeMs <= sorted[index - 1].timeMs
            ) {
                context.addIssue({
                    code: "custom",
                    message:
                        "타이밍 포인트의 틱과 시간은 이전 구간보다 커야 합니다.",
                    path: ["timingPoints"],
                });
                break;
            }
        }
    });

export const chartExportSchema = z
    .object({
        format: z.literal("noslog-chart"),
        exportVersion: z.literal(1),
        exportedAt: z.iso.datetime(),
        music: z
            .object({
                index: z.string().min(1),
                title: z.string().min(1),
                artist: z.string().nullable(),
                difficulty: z.string().min(1),
                level: z.number().int().min(0),
            })
            .strict(),
        chart: chartDocumentSchema,
    })
    .strict();

export type ChartHand = z.infer<typeof chartHandSchema>;
export type ChartNoteType = z.infer<typeof chartNoteTypeSchema>;
export type ChartTimingPoint = z.infer<typeof chartTimingPointSchema>;
export type ChartPathPoint = z.infer<typeof chartPathPointSchema>;
export type ChartNote = z.infer<typeof chartNoteSchema>;
export type ChartDocument = z.infer<typeof chartDocumentSchema>;
export type ChartExport = z.infer<typeof chartExportSchema>;

export function createDefaultChartDocument({
    bpm = 120,
    durationMs = 0,
}: {
    bpm?: number | null;
    durationMs?: number | null;
} = {}): ChartDocument {
    return {
        version: CHART_FORMAT_VERSION,
        laneCount: CHART_LANE_COUNT,
        ticksPerQuarter: CHART_TICKS_PER_QUARTER,
        durationMs: Math.max(0, Math.round(durationMs ?? 0)),
        timingPoints: [
            {
                id: "timing-0",
                tick: 0,
                timeMs: 0,
                bpm: Math.min(1_000, Math.max(1, bpm ?? 120)),
                numerator: 4,
                denominator: 4,
            },
        ],
        notes: [],
    };
}
