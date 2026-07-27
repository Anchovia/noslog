import { describe, expect, it } from "vitest";

import {
    chartDocumentSchema,
    chartExportSchema,
    createDefaultChartDocument,
} from "@/lib/chart-pattern/schema";

describe("채보 문서 스키마", () => {
    it("28칸·480 TPQ 기준의 기본 문서를 만든다", () => {
        const document = createDefaultChartDocument({
            bpm: 180,
            durationMs: 125_400,
        });

        expect(document).toMatchObject({
            version: 1,
            laneCount: 28,
            ticksPerQuarter: 480,
            durationMs: 125_400,
            timingPoints: [
                {
                    tick: 0,
                    timeMs: 0,
                    bpm: 180,
                    numerator: 4,
                    denominator: 4,
                },
            ],
            notes: [],
        });
        expect(chartDocumentSchema.safeParse(document).success).toBe(true);
    });

    it("노트 폭이 28칸을 벗어나면 거부한다", () => {
        const document = createDefaultChartDocument();
        const parsed = chartDocumentSchema.safeParse({
            ...document,
            notes: [
                {
                    id: "note-1",
                    type: "standard",
                    hand: "right",
                    tick: 480,
                    durationTicks: 0,
                    lane: 27,
                    width: 2,
                    points: [],
                },
            ],
        });

        expect(parsed.success).toBe(false);
    });

    it("일반 노트에 지속 시간이 있으면 거부한다", () => {
        const document = createDefaultChartDocument();
        const parsed = chartDocumentSchema.safeParse({
            ...document,
            notes: [
                {
                    id: "note-1",
                    type: "standard",
                    hand: "left",
                    tick: 480,
                    durationTicks: 240,
                    lane: 4,
                    width: 2,
                    points: [],
                },
            ],
        });

        expect(parsed.success).toBe(false);
    });

    it("트릴은 두 위치와 폭을 함께 저장한다", () => {
        const document = createDefaultChartDocument();
        const parsed = chartDocumentSchema.safeParse({
            ...document,
            notes: [
                {
                    id: "trill-1",
                    type: "trill",
                    hand: "left",
                    tick: 480,
                    durationTicks: 960,
                    lane: 8,
                    width: 2,
                    pairLane: 14,
                    pairWidth: 3,
                    points: [],
                },
            ],
        });

        expect(parsed.success).toBe(true);
    });

    it("두 번째 위치가 없는 트릴을 거부한다", () => {
        const document = createDefaultChartDocument();
        const parsed = chartDocumentSchema.safeParse({
            ...document,
            notes: [
                {
                    id: "trill-1",
                    type: "trill",
                    hand: "right",
                    tick: 480,
                    durationTicks: 960,
                    lane: 8,
                    width: 2,
                    points: [],
                },
            ],
        });

        expect(parsed.success).toBe(false);
    });

    it("중복된 노트 ID를 거부한다", () => {
        const document = createDefaultChartDocument();
        const note = {
            id: "same-note",
            type: "standard",
            hand: "left",
            tick: 480,
            durationTicks: 0,
            lane: 8,
            width: 2,
            points: [],
        };
        const parsed = chartDocumentSchema.safeParse({
            ...document,
            notes: [note, { ...note, tick: 960 }],
        });

        expect(parsed.success).toBe(false);
    });

    it("시간과 틱 순서가 뒤집힌 타이밍 포인트를 거부한다", () => {
        const document = createDefaultChartDocument();
        const parsed = chartDocumentSchema.safeParse({
            ...document,
            timingPoints: [
                document.timingPoints[0],
                {
                    id: "timing-1",
                    tick: 1_920,
                    timeMs: -100,
                    bpm: 160,
                    numerator: 3,
                    denominator: 4,
                },
            ],
        });

        expect(parsed.success).toBe(false);
    });

    it("음원 없이 채보와 메타데이터만 내보내는 형식을 허용한다", () => {
        const parsed = chartExportSchema.safeParse({
            format: "noslog-chart",
            exportVersion: 1,
            exportedAt: "2026-07-27T12:00:00.000Z",
            music: {
                index: "test",
                title: "테스트",
                artist: null,
                difficulty: "Expert",
                level: 12,
            },
            chart: createDefaultChartDocument(),
        });

        expect(parsed.success).toBe(true);
    });
});
