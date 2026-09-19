import { describe, expect, it } from "vitest";
import {
    isAfterFullRecord,
    mergeRecentRecord,
    planRecentRecordMerge,
    recentPlayTimestamp,
} from "@/lib/services/user/recentRecordMerge";
import type {
    PendingRecordPlay,
    RecordValues,
} from "@/lib/services/user/recentRecordMerge";

const chart = { level: 12, note_count: 1000 };
const attempt = (
    overrides: Partial<PendingRecordPlay> = {}
): PendingRecordPlay => ({
    id: 1,
    chart_id: 10,
    record_applied: false,
    chart,
    level: 12,
    score: 950000,
    rank: "S",
    grade_basic: 10000,
    max_combo: 800,
    source_play_time: "2026/09/20 10:00",
    judge_sjust: 900,
    judge_just: 80,
    judge_good: 10,
    judge_miss: 10,
    judge_near: 0,
    ...overrides,
});
const fullRecord = (): RecordValues => ({
    ...mergeRecentRecord(null, attempt(), chart),
    play_count: 100,
    fullcombo_count: 20,
    pianistic_count: 4,
    score: 990000,
    fc_type: 2,
    max_combo: 1000,
    grade_basic: 12000,
    grade_recital: 5000,
    clear_count: 90,
    clear_flag: 2,
    note_rate_standard: 9900,
    note_rate_tenuto: 9800,
    note_rate_glissando: 9700,
    note_rate_trill: 9600,
});

describe("recent-only record merge (no database writes)", () => {
    it("builds a first record while leaving unavailable Recital and note rates unknown", () => {
        expect(mergeRecentRecord(null, attempt(), chart)).toMatchObject({
            score: 950000,
            rank: "S",
            grade_basic: 10000,
            play_count: 1,
            fullcombo_count: 0,
            pianistic_count: 0,
            grade_recital: null,
            clear_count: null,
            clear_flag: null,
            note_rate_standard: null,
            besttime: "2026/09/20 10:00",
        });
    });
    it("retains independent best values and official metadata after Pass expiry", () => {
        const previous = fullRecord();
        const result = mergeRecentRecord(
            previous,
            attempt({ score: 900000, rank: "A", grade_basic: 9000 }),
            chart
        );
        expect(result).toEqual({ ...previous, play_count: 101 });
        expect(previous.play_count).toBe(100);
    });
    it("updates score and its judgement/date without erasing a higher Grd or combo", () => {
        const previous = fullRecord();
        const play = attempt({
            score: 995000,
            grade_basic: 11000,
            max_combo: 900,
            judge_sjust: 980,
            source_play_time: "2026/09/20 11:00",
        });
        expect(mergeRecentRecord(previous, play, chart)).toEqual({
            ...previous,
            score: 995000,
            play_count: 101,
            besttime: play.source_play_time,
            judge_sjust: 980,
            judge_just: 80,
            judge_good: 10,
            judge_miss: 10,
            judge_near: 0,
        });
    });
    it("updates a higher Grd even when the score does not improve", () => {
        const previous = fullRecord();
        expect(
            mergeRecentRecord(previous, attempt({ grade_basic: 13000 }), chart)
        ).toEqual({ ...previous, grade_basic: 13000, play_count: 101 });
    });
    it("retains the original achievement date and judgements on an equal score", () => {
        const previous = fullRecord();
        expect(
            mergeRecentRecord(
                previous,
                attempt({ score: previous.score, judge_sjust: 999 }),
                chart
            ).besttime
        ).toBe(previous.besttime);
        expect(
            mergeRecentRecord(
                previous,
                attempt({ score: previous.score, judge_sjust: 999 }),
                chart
            ).judge_sjust
        ).toBe(previous.judge_sjust);
    });
    it("increments observed full combo and Pianist counts without lowering official counts", () => {
        const previous = fullRecord();
        expect(
            mergeRecentRecord(
                previous,
                attempt({ score: 1000000, rank: "P", max_combo: 1000 }),
                chart
            )
        ).toMatchObject({
            play_count: 101,
            fullcombo_count: 21,
            pianistic_count: 5,
            fc_type: 3,
        });
    });
    it("does not invent a full combo from an unknown note count", () => {
        expect(
            mergeRecentRecord(null, attempt({ max_combo: 9999 }), {
                ...chart,
                note_count: null,
            })
        ).toMatchObject({ fc_type: 0, fullcombo_count: 0 });
    });
    it("does not use historical best_score without the accompanying Grd and judgement", () => {
        const play = { ...attempt(), best_score: 999999 };
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
        expect(isAfterFullRecord("2026/09/20 09:59", fullAt)).toBe(false);
        expect(isAfterFullRecord("2026/09/20 10:00", fullAt)).toBe(false);
        expect(isAfterFullRecord("2026/09/20 10:01", fullAt)).toBe(true);
    });
    it("deduplicates receipts and does not increment again after retry", () => {
        const play = attempt();
        const first = planRecentRecordMerge(new Map(), [play, play], null);
        expect(first.changes.get(10)?.play_count).toBe(1);
        expect(first.appliedIds).toEqual([1]);
        const retry = planRecentRecordMerge(
            first.changes,
            [{ ...play, record_applied: true }],
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
                { ...firstPlay, record_applied: true },
                attempt({
                    id: 2,
                    score: 980000,
                    source_play_time: "2026/09/20 11:00",
                }),
                attempt({ id: 3, chart_id: 20, score: 900000, rank: "A" }),
            ],
            null
        );
        expect(second.changes.get(10)).toMatchObject({
            score: 980000,
            play_count: 2,
        });
        expect(second.changes.get(20)).toMatchObject({
            score: 900000,
            play_count: 1,
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
            play_count: 2,
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
                    source_play_time: "2026/09/20 11:00",
                }),
                attempt({
                    id: 3,
                    chart_id: 20,
                    source_play_time: "2026/09/19 10:00",
                }),
            ],
            fullAt
        );
        expect(result.changes.get(10)).toMatchObject({
            score: 995000,
            play_count: 101,
            grade_recital: 5000,
        });
        expect(result.changes.has(20)).toBe(false);
        expect(result.appliedIds).toHaveLength(3);
    });
    it("uses the new authoritative counts after Pass renewal instead of adding the old partial counts", () => {
        const corrected = { ...fullRecord(), play_count: 250 };
        const result = planRecentRecordMerge(
            new Map([[10, corrected]]),
            [
                attempt({ id: 3, source_play_time: "2026/09/21 10:00" }),
                attempt({ id: 4, source_play_time: "2026/09/21 12:00" }),
            ],
            new Date("2026-09-21T02:00:00Z")
        );
        expect(result.changes.get(10)?.play_count).toBe(251);
    });
    it("sorts history by play time before selecting a best achievement date", () => {
        const result = planRecentRecordMerge(
            new Map(),
            [
                attempt({
                    id: 3,
                    score: 980000,
                    source_play_time: "2026/09/20 12:00",
                }),
                attempt({
                    id: 2,
                    score: 980000,
                    source_play_time: "2026/09/20 11:00",
                }),
                attempt(),
            ],
            null
        );
        expect(result.changes.get(10)).toMatchObject({
            score: 980000,
            play_count: 3,
            besttime: "2026/09/20 11:00",
        });
    });
    it("leaves the source data untouched and fails before planning any invalid timestamp", () => {
        const previous = fullRecord();
        const records = new Map([[10, previous]]);
        expect(() =>
            planRecentRecordMerge(
                records,
                [attempt(), attempt({ id: 2, source_play_time: "invalid" })],
                null
            )
        ).toThrow(RangeError);
        expect(records.get(10)).toEqual(previous);
        expect(previous.play_count).toBe(100);
    });
});

describe("zero Grd repair", () => {
    const zero = () =>
        attempt({
            grade_basic: 0,
            is_onehand: false,
            chart: { ...chart, difficulty: "Expert", level_constant: 12 },
        });
    it("fills a new zero record but retains an official positive value", () => {
        const play = zero();
        expect(
            mergeRecentRecord(null, play, play.chart).grade_basic
        ).toBeGreaterThan(0);
        expect(
            mergeRecentRecord(null, { ...play, grade_basic: 12345 }, play.chart)
                .grade_basic
        ).toBe(12345);
    });
    it("repairs an applied record once without changing counts or other bests", () => {
        const play = { ...zero(), record_applied: true };
        const record = { ...fullRecord(), grade_basic: 0 };
        const plan = planRecentRecordMerge(
            new Map([[10, record]]),
            [play],
            null
        );
        const fixed = plan.changes.get(10)!;
        expect(fixed.grade_basic).toBeGreaterThan(0);
        expect({ ...fixed, grade_basic: 0 }).toEqual(record);
        expect(plan.appliedIds).toEqual([]);
        expect(
            planRecentRecordMerge(new Map([[10, fixed]]), [play], null).changes
                .size
        ).toBe(0);
    });
    it("does not supersede full-import coverage or a better official Grd", () => {
        const play = { ...zero(), record_applied: true };
        const records = new Map([[10, { ...fullRecord(), grade_basic: 0 }]]);
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
