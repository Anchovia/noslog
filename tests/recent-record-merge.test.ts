import { describe, expect, it } from "vitest";
import {
    isAfterFullRecord,
    mergeRecentRecord,
    planRecentRecordMerge,
    recentPlayTimestamp,
    recordBestAt,
} from "@/lib/services/user/recent-record-merge";
import type {
    PendingRecordPlay,
    RecordValues,
} from "@/lib/services/user/recent-record-merge";

const chart = { level: 12, noteCount: 1000 };
// 최근 플레이 시각은 played_at(timestamptz) — 공식 KST 글자를 그대로 읽어 만든다(2026-10-16 P5-1)
const at = (value: string) => recordBestAt(value)!;
const attempt = (
    overrides: Partial<PendingRecordPlay> = {}
): PendingRecordPlay => ({
    id: 1,
    chartId: 10,
    recordApplied: false,
    chart,
    level: 12,
    score: 950000,
    rank: "S",
    gradeBasic: 10000,
    maxCombo: 800,
    playedAt: at("2026/09/20 10:00"),
    judgeSjust: 900,
    judgeJust: 80,
    judgeGood: 10,
    judgeMiss: 10,
    judgeNear: 0,
    ...overrides,
});
const fullRecord = (): RecordValues => ({
    ...mergeRecentRecord(null, attempt(), chart),
    playCount: 100,
    fullcomboCount: 20,
    pianisticCount: 4,
    score: 990000,
    fcType: 2,
    maxCombo: 1000,
    gradeBasic: 12000,
    gradeRecital: 5000,
    clearCount: 90,
    clearFlag: 2,
    noteRateStandard: 9900,
    noteRateTenuto: 9800,
    noteRateGlissando: 9700,
    noteRateTrill: 9600,
});

describe("recent-only record merge (no database writes)", () => {
    it("builds a first record while leaving unavailable Recital and note rates unknown", () => {
        expect(mergeRecentRecord(null, attempt(), chart)).toMatchObject({
            score: 950000,
            rank: "S",
            gradeBasic: 10000,
            playCount: 1,
            fullcomboCount: 0,
            pianisticCount: 0,
            gradeRecital: null,
            clearCount: null,
            clearFlag: null,
            noteRateStandard: null,
            bestAt: at("2026-09-20 10:00"),
        });
    });
    it("retains independent best values and official metadata after Pass expiry", () => {
        const previous = fullRecord();
        const result = mergeRecentRecord(
            previous,
            attempt({ score: 900000, rank: "A", gradeBasic: 9000 }),
            chart
        );
        expect(result).toEqual({ ...previous, playCount: 101 });
        expect(previous.playCount).toBe(100);
    });
    it("updates score and its judgement/date without erasing a higher Grd or combo", () => {
        const previous = fullRecord();
        const play = attempt({
            score: 995000,
            gradeBasic: 11000,
            maxCombo: 900,
            judgeSjust: 980,
            playedAt: at("2026/09/20 11:00"),
        });
        expect(mergeRecentRecord(previous, play, chart)).toEqual({
            ...previous,
            score: 995000,
            playCount: 101,
            bestAt: new Date("2026-09-20T02:00:00.000Z"),
            judgeSjust: 980,
            judgeJust: 80,
            judgeGood: 10,
            judgeMiss: 10,
            judgeNear: 0,
        });
    });
    it("updates a higher Grd even when the score does not improve", () => {
        const previous = fullRecord();
        expect(
            mergeRecentRecord(previous, attempt({ gradeBasic: 13000 }), chart)
        ).toEqual({ ...previous, gradeBasic: 13000, playCount: 101 });
    });
    it("retains the original achievement date and judgements on an equal score", () => {
        const previous = fullRecord();
        expect(
            mergeRecentRecord(
                previous,
                attempt({ score: previous.score, judgeSjust: 999 }),
                chart
            ).bestAt
        ).toBe(previous.bestAt);
        expect(
            mergeRecentRecord(
                previous,
                attempt({ score: previous.score, judgeSjust: 999 }),
                chart
            ).judgeSjust
        ).toBe(previous.judgeSjust);
    });
    it("increments observed full combo and Pianist counts without lowering official counts", () => {
        const previous = fullRecord();
        expect(
            mergeRecentRecord(
                previous,
                attempt({ score: 1000000, rank: "P", maxCombo: 1000 }),
                chart
            )
        ).toMatchObject({
            playCount: 101,
            fullcomboCount: 21,
            pianisticCount: 5,
            fcType: 3,
        });
    });
    it("records a NEAR full combo as the yellow-F lamp without counting it as a full combo", () => {
        // 공식 Op.3: 1 = NEAR 섞인 풀콤보(노란 F), 2 = 무지개 F — FC 는 2 이상만 센다(2026-10-16 K1)
        expect(
            mergeRecentRecord(
                null,
                attempt({ maxCombo: 1000, judgeNear: 2 }),
                chart
            )
        ).toMatchObject({ fcType: 1, fullcomboCount: 0 });
        expect(
            mergeRecentRecord(
                null,
                attempt({ maxCombo: 1000, judgeNear: 0 }),
                chart
            )
        ).toMatchObject({ fcType: 2, fullcomboCount: 1 });
    });
    it("does not invent a full combo from an unknown note count", () => {
        expect(
            mergeRecentRecord(null, attempt({ maxCombo: 9999 }), {
                ...chart,
                noteCount: null,
            })
        ).toMatchObject({ fcType: 0, fullcomboCount: 0 });
    });
    it("does not use historical bestScore without the accompanying Grd and judgement", () => {
        const play = { ...attempt(), bestScore: 999999 };
        expect(mergeRecentRecord(null, play, chart).score).toBe(play.score);
    });
    it.each([
        "2026/09/20 10:00",
        "2026-09-20 10:00",
        "2026.09.20 10:00",
        "2026-09-20T10:00:00",
    ])("normalizes official calendar timestamp %s", (time) => {
        expect(recentPlayTimestamp(time)).toBe(
            Date.parse("2026-09-20T01:00:00Z")
        );
    });
    it.each([
        "garbage",
        "2026-02-30 10:00",
        "2026-13-20 10:00",
        "2026-09-20 24:00",
    ])("rejects invalid calendar timestamp %s", (time) => {
        expect(recentPlayTimestamp(time)).toBeNull();
    });
    it("excludes an overlap at the full import's minute boundary", () => {
        const fullAt = new Date("2026-09-20T01:00:30Z");
        expect(isAfterFullRecord(at("2026/09/20 09:59"), fullAt)).toBe(false);
        expect(isAfterFullRecord(at("2026/09/20 10:00"), fullAt)).toBe(false);
        expect(isAfterFullRecord(at("2026/09/20 10:01"), fullAt)).toBe(true);
    });
    it("deduplicates receipts and does not increment again after retry", () => {
        const play = attempt();
        const first = planRecentRecordMerge(new Map(), [play, play], null);
        expect(first.changes.get(10)?.playCount).toBe(1);
        expect(first.appliedIds).toEqual([1]);
        const retry = planRecentRecordMerge(
            first.changes,
            [{ ...play, recordApplied: true }],
            null
        );
        expect(retry.changes.size).toBe(0);
        expect(retry.appliedIds).toEqual([]);
    });
    it("handles overlapping recent batches and updates each chart independently", () => {
        const firstPlay = attempt();
        const first = planRecentRecordMerge(new Map(), [firstPlay], null);
        const second = planRecentRecordMerge(
            first.changes,
            [
                { ...firstPlay, recordApplied: true },
                attempt({
                    id: 2,
                    score: 980000,
                    playedAt: at("2026/09/20 11:00"),
                }),
                attempt({ id: 3, chartId: 20, score: 900000, rank: "A" }),
            ],
            null
        );
        expect(second.changes.get(10)).toMatchObject({
            score: 980000,
            playCount: 2,
        });
        expect(second.changes.get(20)).toMatchObject({
            score: 900000,
            playCount: 1,
        });
        expect(second.appliedIds.sort()).toEqual([2, 3]);
    });
    it("counts separate same-minute attempts with different database identities", () => {
        const result = planRecentRecordMerge(
            new Map(),
            [attempt(), attempt({ id: 2, score: 960000 })],
            null
        );
        expect(result.changes.get(10)).toMatchObject({
            score: 960000,
            playCount: 2,
        });
    });
    it("preserves full records, consumes overlap, and adds only post-expiry plays", () => {
        const fullAt = new Date("2026-09-20T01:00:30Z");
        const result = planRecentRecordMerge(
            new Map([[10, fullRecord()]]),
            [
                attempt(),
                attempt({
                    id: 2,
                    score: 995000,
                    playedAt: at("2026/09/20 11:00"),
                }),
                attempt({
                    id: 3,
                    chartId: 20,
                    playedAt: at("2026/09/19 10:00"),
                }),
            ],
            fullAt
        );
        expect(result.changes.get(10)).toMatchObject({
            score: 995000,
            playCount: 101,
            gradeRecital: 5000,
        });
        expect(result.changes.has(20)).toBe(false);
        expect(result.appliedIds).toHaveLength(3);
    });
    it("uses the new authoritative counts after Pass renewal instead of adding the old partial counts", () => {
        const corrected = { ...fullRecord(), playCount: 250 };
        const result = planRecentRecordMerge(
            new Map([[10, corrected]]),
            [
                attempt({ id: 3, playedAt: at("2026/09/21 10:00") }),
                attempt({ id: 4, playedAt: at("2026/09/21 12:00") }),
            ],
            new Date("2026-09-21T02:00:00Z")
        );
        expect(result.changes.get(10)?.playCount).toBe(251);
    });
    it("sorts history by play time before selecting a best achievement date", () => {
        const result = planRecentRecordMerge(
            new Map(),
            [
                attempt({
                    id: 3,
                    score: 980000,
                    playedAt: at("2026/09/20 12:00"),
                }),
                attempt({
                    id: 2,
                    score: 980000,
                    playedAt: at("2026/09/20 11:00"),
                }),
                attempt(),
            ],
            null
        );
        expect(result.changes.get(10)).toMatchObject({
            score: 980000,
            playCount: 3,
            bestAt: at("2026-09-20 11:00"),
        });
    });
});

describe("zero Grd repair", () => {
    const zero = () =>
        attempt({
            gradeBasic: 0,
            isOnehand: false,
            chart: { ...chart, difficulty: "Expert", levelConstant: 12 },
        });
    it("fills a new zero record but retains an official positive value", () => {
        const play = zero();
        expect(
            mergeRecentRecord(null, play, play.chart).gradeBasic
        ).toBeGreaterThan(0);
        expect(
            mergeRecentRecord(null, { ...play, gradeBasic: 12345 }, play.chart)
                .gradeBasic
        ).toBe(12345);
    });
    it("repairs an applied record once without changing counts or other bests", () => {
        const play = { ...zero(), recordApplied: true };
        const record = { ...fullRecord(), gradeBasic: 0 };
        const plan = planRecentRecordMerge(
            new Map([[10, record]]),
            [play],
            null
        );
        const fixed = plan.changes.get(10)!;
        expect(fixed.gradeBasic).toBeGreaterThan(0);
        expect({ ...fixed, gradeBasic: 0 }).toEqual(record);
        expect(plan.appliedIds).toEqual([]);
        expect(
            planRecentRecordMerge(new Map([[10, fixed]]), [play], null).changes
                .size
        ).toBe(0);
    });
    it("does not supersede full-import coverage or a better official Grd", () => {
        const play = { ...zero(), recordApplied: true };
        const records = new Map([[10, { ...fullRecord(), gradeBasic: 0 }]]);
        expect(
            planRecentRecordMerge(
                records,
                [play],
                new Date("2026-09-20T02:00:00Z")
            ).changes.size
        ).toBe(0);
        expect(
            planRecentRecordMerge(new Map([[10, fullRecord()]]), [play], null)
                .changes.size
        ).toBe(0);
    });
});

describe("기록 시각 timestamptz", () => {
    it("reads official KST times and keeps unknown times empty", () => {
        expect(recordBestAt("2026-09-20 11:00")).toEqual(
            new Date("2026-09-20T02:00:00.000Z")
        );
        expect(recordBestAt("2026/09/20 11:00")).toEqual(
            new Date("2026-09-20T02:00:00.000Z")
        );
        expect(recordBestAt("1970-01-01 09:00")).toBeNull();
        expect(recordBestAt("2026-02-30 11:00")).toBeNull();
        expect(recordBestAt("")).toBeNull();
    });
});
