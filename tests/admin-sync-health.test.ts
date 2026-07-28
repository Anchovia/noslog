import { describe, expect, it } from "vitest";

import {
    getSyncAttemptHealth,
    getUserSyncHealth,
} from "@/lib/admin/syncHealth";

const now = new Date("2026-07-27T12:00:00.000Z");

describe("관리자 동기화 상태 판정", () => {
    it("10분 이상 처리 중인 동기화를 지연으로 표시한다", () => {
        const result = getSyncAttemptHealth(
            {
                status: "processing",
                startedAt: new Date("2026-07-27T11:49:59.000Z"),
                insertedPlays: 0,
                changedRecords: 0,
                playHistoryCount: 0,
                snapshotCount: 0,
            },
            now
        );

        expect(result.label).toBe("처리 지연");
        expect(result.needsAttention).toBe(true);
    });

    it("저장 집계가 맞는 완료 동기화를 정상으로 표시한다", () => {
        const result = getSyncAttemptHealth(
            {
                status: "completed",
                startedAt: new Date("2026-07-27T11:59:00.000Z"),
                insertedPlays: 3,
                changedRecords: 120,
                playHistoryCount: 3,
                snapshotCount: 120,
            },
            now
        );

        expect(result.label).toBe("정상");
    });

    it("저장된 행 수와 처리 결과가 다르면 집계 불일치로 표시한다", () => {
        const result = getSyncAttemptHealth(
            {
                status: "completed",
                startedAt: new Date("2026-07-27T11:59:00.000Z"),
                insertedPlays: 3,
                changedRecords: 120,
                playHistoryCount: 2,
                snapshotCount: 119,
            },
            now
        );

        expect(result.label).toBe("집계 불일치");
        expect(result.needsAttention).toBe(true);
    });

    it("현재 채보 판정 데이터가 비어 있는 사용자를 점검 대상으로 표시한다", () => {
        const result = getUserSyncHealth(
            {
                latestStatus: "completed",
                latestStartedAt: new Date("2026-07-27T11:00:00.000Z"),
                totalRecords: 120,
                judgementRecords: 119,
                noteRateRecords: 120,
            },
            now
        );

        expect(result.label).toBe("상세 데이터 일부 누락");
        expect(result.needsAttention).toBe(true);
    });
});
