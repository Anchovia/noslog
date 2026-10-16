import "server-only";

import { createHash } from "node:crypto";

import type { Prisma } from "@prisma/client";

import { getModePianistRatingBasis } from "@/features/tiers/server/tier-browser-data";
import db from "@/lib/db";
import type { TierMode } from "@/lib/tiers";
import { TIER_MODES } from "@/lib/tiers";
import type { BasicRatingRecord } from "@/lib/tiers/basic-rating";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_POLICY_VERSION,
    BASIC_RATING_SCORE_FLOOR,
    calculateBasicRating,
} from "@/lib/tiers/basic-rating";

/**
 * 레이팅 랭킹용 저장 값(2026-10-15 L2-A2) — 사람 · 모드마다 계산해 둔 레이팅.
 * 예전에는 랭킹 캐시가 빌 때마다 모든 사람의 기록(500명이면 약 45만 줄)을 읽어 다시 셌다.
 * 계산 규칙은 그때와 같다: 서열 상수가 있는 채보 · 95만 점 이상 · Recital 은 그 기록의 Recital Grd 가 있을 때만
 */
export interface RatingBasis {
    constants: Map<number, number>;
    theoreticalMax: number;
    /** 계산식 판 + 피아니스트 서열 상수의 지문 — 기준이 바뀌면 달라진다 */
    version: string;
}

export interface PlayerRatingValue {
    userId: number;
    mode: TierMode;
    rating: number;
    filledSlots: number;
    basisVersion: string;
}

/** 랭킹에 쓸 수 있는 기준인지 — 상수가 비었거나 이상하면 null(랭킹은 「준비 중」) */
export async function getRatingBasis(
    mode: TierMode
): Promise<RatingBasis | null> {
    const basis = await getModePianistRatingBasis(mode);
    if (
        !basis.theoreticalMax ||
        basis.entries.some(
            (entry) =>
                !Number.isFinite(entry.value) ||
                entry.value < 1 ||
                entry.value > 14.5
        ) ||
        new Set(basis.entries.map((entry) => entry.chartId)).size !==
            basis.entries.length
    )
        return null;
    const entries = [...basis.entries].sort(
        (left, right) => left.chartId - right.chartId
    );
    const version = createHash("sha256")
        .update(
            JSON.stringify([
                BASIC_RATING_POLICY_VERSION,
                BASIC_RATING_ACTIVE_CURVE,
                mode,
                entries.map((entry) => [entry.chartId, entry.value]),
            ])
        )
        .digest("hex")
        .slice(0, 16);
    return {
        constants: new Map(
            entries.map((entry) => [entry.chartId, entry.value])
        ),
        theoreticalMax: basis.theoreticalMax,
        version,
    };
}

/**
 * 레이팅 계산 한 벌(2026-10-16 DB 재설계 K3) — 랭킹 저장 값 · 프로필 기여 목록 · 레이팅 이력이 같은 기록을 같은 규칙으로 센다.
 * 레이팅 0(기준표 채보에 95만 이상 기록이 없음)은 「레이팅 없음」 — 랭킹에 넣지 않고 프로필 · 이력도 null(예전 집계와 같음)
 */
async function calculateRatings(
    client: Prisma.TransactionClient,
    mode: TierMode,
    basis: RatingBasis,
    userId?: number
) {
    const records = await client.playData.findMany({
        where: {
            ...(userId === undefined ? {} : { userId: userId }),
            chartId: { in: [...basis.constants.keys()] },
            score: { gte: BASIC_RATING_SCORE_FLOOR },
            ...(mode === "recital" ? { gradeRecital: { gt: 0 } } : {}),
        },
        select: { userId: true, chartId: true, score: true },
    });
    const byUser = new Map<number, BasicRatingRecord[]>();
    for (const record of records) {
        const tierConstant = basis.constants.get(record.chartId);
        if (tierConstant === undefined) continue;
        const playerRecords = byUser.get(record.userId) ?? [];
        playerRecords.push({
            chartId: record.chartId,
            score: record.score,
            tierConstant,
        });
        byUser.set(record.userId, playerRecords);
    }
    return [...byUser].flatMap(([userId, playerRecords]) => {
        const result = calculateBasicRating(
            playerRecords,
            basis.theoreticalMax,
            BASIC_RATING_ACTIVE_CURVE
        );
        return result.rating > 0 ? [{ userId, result }] : [];
    });
}

/** 한 사람 · 한 모드의 레이팅과 곡별 기여 — 기준이 없거나 레이팅이 0 이면 null */
export async function calculateUserRating(userId: number, mode: TierMode) {
    const basis = await getRatingBasis(mode);
    if (!basis) return null;
    const [row] = await calculateRatings(db, mode, basis, userId);
    return row?.result ?? null;
}

async function computeRatings(
    tx: Prisma.TransactionClient,
    mode: TierMode,
    basis: RatingBasis,
    userId?: number
): Promise<PlayerRatingValue[]> {
    const rows = await calculateRatings(tx, mode, basis, userId);
    return rows.map(({ userId, result }) => ({
        userId,
        mode,
        rating: result.rating,
        filledSlots: result.filledSlots,
        basisVersion: basis.version,
    }));
}

// 같은 모드를 동시에 다시 쓰지 않게 — 트랜잭션이 끝나면 풀린다
function lockMode(tx: Prisma.TransactionClient, mode: TierMode) {
    return tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`player-rating:${mode}`}))`;
}

/**
 * 한 모드의 모든 사람을 다시 센다 — 한 트랜잭션으로 바꿔 끼우므로 다 셀 때까지는 옛 값이 보이고,
 * 옛 값과 새 값이 섞이지 않는다. 서열 상수 · 계산식이 바뀌었거나 표가 비었을 때
 */
export async function rebuildPlayerRatings(mode: TierMode, basis: RatingBasis) {
    return db.$transaction(
        async (tx) => {
            await lockMode(tx, mode);
            const rows = await computeRatings(tx, mode, basis);
            await tx.playerRating.deleteMany({ where: { mode } });
            if (rows.length) await tx.playerRating.createMany({ data: rows });
            return rows;
        },
        { timeout: 30000 }
    );
}

/** 동기화로 기록이 바뀐 사람의 두 모드 값을 다시 센다(한 사람 약 30ms) */
export async function refreshUserPlayerRatings(userId: number) {
    for (const mode of TIER_MODES) {
        const basis = await getRatingBasis(mode);
        if (!basis) continue;
        await db.$transaction(
            async (tx) => {
                await lockMode(tx, mode);
                const [row] = await computeRatings(tx, mode, basis, userId);
                if (!row) {
                    await tx.playerRating.deleteMany({
                        where: { userId: userId, mode },
                    });
                    return;
                }
                await tx.playerRating.upsert({
                    where: { userId_mode: { userId: userId, mode } },
                    create: row,
                    update: {
                        rating: row.rating,
                        filledSlots: row.filledSlots,
                        basisVersion: row.basisVersion,
                        computedAt: new Date(),
                    },
                });
            },
            // 전원 재계산(rebuildPlayerRatings, 최대 30초)이 같은 모드 잠금을 쥐고 있으면 끝날 때까지 기다린다 —
            // 기본 5초 안에 못 잡으면 기록은 저장됐는데 동기화가 실패로 남았다(2026-10-16 DB 재설계 B2)
            { timeout: 35000 }
        );
    }
}

/** 서열표를 저장한 뒤 — 기준이 바뀐 모드만 다시 센다(응답 뒤 after() 에서 부른다) */
export async function rebuildStalePlayerRatings() {
    for (const mode of TIER_MODES) {
        const basis = await getRatingBasis(mode);
        if (!basis) continue;
        const stale = await db.playerRating.findFirst({
            where: { mode, basisVersion: { not: basis.version } },
            select: { userId: true },
        });
        if (stale) await rebuildPlayerRatings(mode, basis);
    }
}
