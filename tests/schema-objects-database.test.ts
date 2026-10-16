import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";

// Prisma 6 스키마가 표현하지 못해 마이그레이션 SQL 에만 있는 DB 객체(2026-10-16 DB 재설계 C1).
// `prisma migrate diff` 는 이것들을 보지 못하므로, 마이그레이션을 올린 DB 에 실제로 있는지 여기서 확인한다.
// 값 목록이 바뀌면 TS 상수와 이 정의를 같이 고친다 — 한쪽만 바뀌어 사고가 두 번 났다(990k 투표 · 기체 상태 이유)
// 닫힌 값 목록은 2026-10-16 D4-C 1차부터 Prisma enum 이라 스키마에 보이고 migrate diff 가 잡는다 — 값 목록 CHECK 4개는 그때 지웠다
const url = process.env.TEST_DATABASE_URL;

const CHECKS: Record<string, string[]> = {
    CommunityChartEvaluation_rating_range: ["stairs", "chords"],
    ChartGoalVote_scope_value: ["'990k'", "'pianist'"],
    // 목표 값 목록 — 990k 는 enum 이름이 될 수 없어 CHECK(2026-10-16 K2)
    TierList_goal_check: ["'990k'", "'pianist'"],
    ChartGoalVoteAudit_goal_check: ["'990k'", "'pianist'"],
    UserRatingHistory_rating_check: ["rating"],
    ArcadeCabinet_state_check: ["condition_note"],
    ArcadePublicPhoto_slot_check: ["slot"],
    Poll_single_owner_check: ["num_nonnulls"],
};

const INDEXES: Record<string, string[]> = {
    TierList_published_mode_goal_key: ["UNIQUE", "WHERE", "'published'"],
    User_username_normalized_key: ["UNIQUE", "lower", "NFKC"],
    DataSync_one_processing_per_user: ["UNIQUE", "WHERE", "'processing'"],
    chart_field_proposals_one_pending: ["UNIQUE", "WHERE", "'pending'"],
    ExamSubmission_one_pending: ["UNIQUE", "WHERE", "'pending'"],
};

describe.skipIf(!url)("스키마 밖 DB 객체", () => {
    if (url && !["localhost", "127.0.0.1"].includes(new URL(url).hostname))
        throw new Error("Schema object tests require a local database.");
    const db = new PrismaClient({ datasourceUrl: url });

    afterAll(async () => {
        await db.$disconnect();
    });

    it("keeps every hand-written CHECK constraint", async () => {
        const rows = await db.$queryRaw<{ name: string; def: string }[]>`
            SELECT conname AS name, pg_get_constraintdef(oid) AS def
            FROM pg_constraint
            WHERE contype = 'c' AND connamespace = 'public'::regnamespace`;
        const byName = new Map(rows.map((row) => [row.name, row.def]));
        for (const [name, parts] of Object.entries(CHECKS)) {
            const def = byName.get(name);
            expect(def, name).toBeDefined();
            for (const part of parts) expect(def, name).toContain(part);
        }
    });

    it("keeps every partial or expression unique index", async () => {
        const rows = await db.$queryRaw<{ name: string; def: string }[]>`
            SELECT indexname AS name, indexdef AS def
            FROM pg_indexes
            WHERE schemaname = 'public'`;
        const byName = new Map(rows.map((row) => [row.name, row.def]));
        for (const [name, parts] of Object.entries(INDEXES)) {
            const def = byName.get(name);
            expect(def, name).toBeDefined();
            for (const part of parts) expect(def, name).toContain(part);
        }
    });
});
