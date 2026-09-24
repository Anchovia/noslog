import { describe, expect, it } from "vitest";

import {
    chartFieldProposalReviewSchema,
    chartFieldUpdate,
    chartFieldValue,
    createChartFieldProposalSchema,
    formatProposalValue,
    normalizeProposalValue,
} from "@/features/contributions/schemas/chartFieldProposalSchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";

const schema = createChartFieldProposalSchema(
    createTranslator(getMessages("ko"))
);
const base = {
    chartId: 12,
    field: "bpm",
    value: "180",
    evidenceKind: "video",
    evidenceUrl: "https://youtu.be/abc",
    evidenceNote: "1:23",
} as const;

describe("normalizeProposalValue", () => {
    it("BPM 은 하나 또는 최소-최대, 같으면 하나로", () => {
        expect(normalizeProposalValue("bpm", "180")).toBe("180");
        expect(normalizeProposalValue("bpm", "120 ~ 180")).toBe("120-180");
        expect(normalizeProposalValue("bpm", "150–150")).toBe("150");
        expect(normalizeProposalValue("bpm", "180-120")).toBeNull();
        expect(normalizeProposalValue("bpm", "0")).toBeNull();
        expect(normalizeProposalValue("bpm", "1000")).toBeNull();
        expect(normalizeProposalValue("bpm", "12a")).toBeNull();
    });

    it("노트 수는 1–9,999 정수(쉼표 허용)", () => {
        expect(normalizeProposalValue("note_count", "1,284")).toBe("1284");
        expect(normalizeProposalValue("note_count", "0")).toBeNull();
        expect(normalizeProposalValue("note_count", "10000")).toBeNull();
        expect(normalizeProposalValue("note_count", "12.5")).toBeNull();
    });

    it("길이는 m:ss 또는 초 → 초", () => {
        expect(normalizeProposalValue("duration", "2:04")).toBe("124");
        expect(normalizeProposalValue("duration", "124")).toBe("124");
        expect(normalizeProposalValue("duration", "2:60")).toBeNull();
        expect(normalizeProposalValue("duration", "0:00")).toBeNull();
        expect(normalizeProposalValue("duration", "31:00")).toBeNull();
    });

    it("수록일은 2017-01-01 부터 오늘까지 실제 날짜", () => {
        expect(normalizeProposalValue("released_at", "2019-03-14")).toBe(
            "2019-03-14"
        );
        expect(normalizeProposalValue("released_at", "2019-02-30")).toBeNull();
        expect(normalizeProposalValue("released_at", "2016-12-31")).toBeNull();
        expect(normalizeProposalValue("released_at", "2999-01-01")).toBeNull();
        expect(normalizeProposalValue("released_at", "2019/03/14")).toBeNull();
    });
});

describe("chart value helpers", () => {
    const chart = {
        bpm_min: 120,
        bpm_max: 180,
        note_count: null,
        duration_seconds: 124,
        released_at: "2019-03-14T00:00:00.000Z",
    };

    it("지금 값을 제안과 같은 형식으로 읽는다", () => {
        expect(chartFieldValue(chart, "bpm")).toBe("120-180");
        expect(chartFieldValue({ ...chart, bpm_max: 120 }, "bpm")).toBe("120");
        expect(chartFieldValue(chart, "note_count")).toBeNull();
        expect(chartFieldValue(chart, "duration")).toBe("124");
        expect(chartFieldValue(chart, "released_at")).toBe("2019-03-14");
    });

    it("화면 표기와 반영 값", () => {
        expect(formatProposalValue("bpm", "120-180")).toBe("120–180");
        expect(formatProposalValue("duration", "124")).toBe("2:04");
        expect(formatProposalValue("note_count", "1284")).toBe("1,284");
        expect(chartFieldUpdate("bpm", "150")).toEqual({
            bpm_min: 150,
            bpm_max: 150,
        });
        expect(chartFieldUpdate("bpm", "120-180")).toEqual({
            bpm_min: 120,
            bpm_max: 180,
        });
        expect(chartFieldUpdate("released_at", "2019-03-14")).toEqual({
            released_at: new Date("2019-03-14T00:00:00Z"),
        });
    });
});

describe("createChartFieldProposalSchema", () => {
    it("값을 저장 형식으로 바꾸고 빈 근거 칸은 null", () => {
        const result = schema.parse({
            ...base,
            field: "duration",
            value: "2:04",
            evidenceNote: "",
        });
        expect(result.value).toBe("124");
        expect(result.evidenceNote).toBeNull();
    });

    it("영상 · 공식 사이트는 https 주소가 있어야 한다", () => {
        for (const evidenceUrl of ["", "javascript:alert(1)", "youtu.be/abc"]) {
            const result = schema.safeParse({ ...base, evidenceUrl });
            expect(result.success).toBe(false);
            expect(result.error?.issues[0]?.path).toEqual(["evidenceUrl"]);
        }
    });

    it("직접 확인은 주소 없이 설명이 있어야 한다", () => {
        expect(
            schema.safeParse({
                ...base,
                evidenceKind: "direct",
                evidenceUrl: "",
                evidenceNote: "오락실에서 결과 화면 확인",
            }).success
        ).toBe(true);
        const missing = schema.safeParse({
            ...base,
            evidenceKind: "direct",
            evidenceUrl: "",
            evidenceNote: "",
        });
        expect(missing.error?.issues[0]?.path).toEqual(["evidenceNote"]);
    });

    it("알아들을 수 없는 값은 그 칸의 안내로 막는다", () => {
        const result = schema.safeParse({ ...base, value: "빠름" });
        expect(result.error?.issues[0]?.path).toEqual(["value"]);
        expect(result.error?.issues[0]?.message).toContain("1–999");
    });

    it("레벨 상수 같은 다른 칸은 받지 않는다", () => {
        expect(
            schema.safeParse({ ...base, field: "level_constant" }).success
        ).toBe(false);
    });
});

describe("chartFieldProposalReviewSchema", () => {
    it("반려는 사유가 있어야 한다", () => {
        expect(
            chartFieldProposalReviewSchema.safeParse({
                decision: "reject",
                ids: [1],
                reason: " ",
            }).success
        ).toBe(false);
        expect(
            chartFieldProposalReviewSchema.safeParse({
                decision: "apply",
                ids: [1, 2],
            }).success
        ).toBe(true);
        expect(
            chartFieldProposalReviewSchema.safeParse({
                decision: "apply",
                ids: [],
            }).success
        ).toBe(false);
    });
});
