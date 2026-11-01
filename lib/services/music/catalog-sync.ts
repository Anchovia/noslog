import "server-only";

import { createHash } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { z } from "zod";

import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import {
    type BemaniMusicCatalogInput,
    type SyncMusicInput,
    updateMusic,
} from "@/lib/services/music/update-music";

const difficultySchema = z.enum(["Normal", "Hard", "Expert", "Real"]);
// 일반 사용자 동기화가 새로 만드는 곡 후보 상한 — 동기화 한 번 · 사람별 24시간
const NEW_CANDIDATES_PER_SYNC = 20;
const NEW_CANDIDATES_PER_DAY = 100;
const CANDIDATE_WINDOW_MS = 24 * 60 * 60 * 1000;
// 검토 대기 후보 전체 상한 — 계정을 여럿 써도 표가 끝없이 자라지 않게. 전곡이 한꺼번에 바뀌어도 들어가는 크기
const MAX_PENDING_CANDIDATES = 1000;
// 한 사람이 전체 상한을 혼자 채우지 못하게
const MAX_PENDING_CANDIDATES_PER_SUBMITTER = 200;
const difficultyOrder = new Map(
    ["Normal", "Hard", "Expert", "Real"].map((difficulty, index) => [
        difficulty,
        index,
    ])
);

export const musicCatalogSnapshotSchema = z.object({
    musicIndex: z.string().min(1).max(128),
    title: z.string().min(1).max(256),
    titleKana: z.string().min(1).max(256),
    artist: z.string().max(256).nullable(),
    category: z.string().min(1).max(128),
    categoryShort: z.string().min(1).max(128),
    description: z.string().max(5_000).nullable(),
    license: z.string().max(5_000),
    unlockType: z.number().int(),
    charts: z
        .array(
            z.object({
                difficulty: difficultySchema,
                level: z.number().int().min(1).max(14),
            })
        )
        .min(1)
        .max(4),
});

export type MusicCatalogSnapshot = z.infer<typeof musicCatalogSnapshotSchema>;

interface DetectedCatalogUpdate {
    input: SyncMusicInput;
    payload: MusicCatalogSnapshot;
    beforeSnapshot: MusicCatalogSnapshot | null;
    fingerprint: string;
}

function sortCharts<T extends { difficulty: string }>(charts: T[]) {
    return [...charts].sort(
        (left, right) =>
            (difficultyOrder.get(left.difficulty) ?? 99) -
            (difficultyOrder.get(right.difficulty) ?? 99)
    );
}

function createMusicCatalogSnapshot(
    input: BemaniMusicCatalogInput
): MusicCatalogSnapshot {
    return {
        musicIndex: input["@index"],
        title: input.title,
        titleKana: input.title_kana,
        artist: input.artist,
        category: input.category,
        categoryShort: input.category_short,
        description: input.description,
        license: input.license,
        unlockType: input.unlock_type,
        charts: sortCharts(
            input.sheet.map((chart) => ({
                difficulty: difficultySchema.parse(chart.difficulty),
                level: chart.level,
            }))
        ),
    };
}

function storedMusicSnapshot(music: {
    index: string;
    title: string;
    titleKana: string;
    artist: string | null;
    category: string;
    categoryShort: string;
    description: string | null;
    license: string | null;
    unlockType: number | null;
    charts: { difficulty: string; level: number }[];
}): MusicCatalogSnapshot {
    return {
        musicIndex: music.index,
        title: music.title,
        titleKana: music.titleKana,
        artist: music.artist,
        category: music.category,
        categoryShort: music.categoryShort,
        description: music.description,
        license: music.license ?? "",
        unlockType: music.unlockType ?? 0,
        charts: sortCharts(
            music.charts.map((chart) => ({
                difficulty: difficultySchema.parse(chart.difficulty),
                level: chart.level,
            }))
        ),
    };
}

function hasCatalogDifference(
    before: MusicCatalogSnapshot | null,
    payload: MusicCatalogSnapshot
) {
    if (!before) return true;

    for (const key of [
        "title",
        "titleKana",
        "artist",
        "category",
        "categoryShort",
        "description",
        "license",
        "unlockType",
    ] as const) {
        if (before[key] !== payload[key]) return true;
    }

    const storedCharts = new Map(
        before.charts.map((chart) => [chart.difficulty, chart.level])
    );
    return payload.charts.some(
        (chart) => storedCharts.get(chart.difficulty) !== chart.level
    );
}

function catalogFingerprint(payload: MusicCatalogSnapshot) {
    return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

async function detectCatalogUpdates(
    music: SyncMusicInput[]
): Promise<DetectedCatalogUpdate[]> {
    const indexes = [...new Set(music.map((item) => item["@index"]))];
    const stored = await db.music.findMany({
        where: { index: { in: indexes } },
        select: {
            index: true,
            title: true,
            titleKana: true,
            artist: true,
            category: true,
            categoryShort: true,
            description: true,
            license: true,
            unlockType: true,
            charts: {
                select: { difficulty: true, level: true },
            },
        },
    });
    const storedByIndex = new Map(
        stored.map((item) => [item.index, storedMusicSnapshot(item)])
    );

    return music.flatMap((input) => {
        const payload = createMusicCatalogSnapshot(input);
        const beforeSnapshot = storedByIndex.get(payload.musicIndex) ?? null;
        if (!hasCatalogDifference(beforeSnapshot, payload)) return [];

        return [
            {
                input,
                payload,
                beforeSnapshot,
                fingerprint: catalogFingerprint(payload),
            },
        ];
    });
}

async function recordCatalogCandidate(
    update: DetectedCatalogUpdate,
    status: "pending" | "applied"
) {
    const where = {
        musicIndex_fingerprint: {
            musicIndex: update.payload.musicIndex,
            fingerprint: update.fingerprint,
        },
    };
    const existing = await db.musicCatalogCandidate.findUnique({
        where,
        select: { id: true, status: true },
    });
    const now = new Date();
    const payload = update.payload as Prisma.InputJsonValue;
    const beforeSnapshot = update.beforeSnapshot
        ? (update.beforeSnapshot as Prisma.InputJsonValue)
        : undefined;

    if (existing) {
        return db.musicCatalogCandidate.update({
            where: { id: existing.id },
            data: {
                payload,
                seenCount: { increment: 1 },
                lastSeenAt: now,
                ...(status === "applied"
                    ? {
                          status,
                          reviewedAt: now,
                          appliedAt: now,
                      }
                    : {}),
            },
            select: { id: true },
        });
    }

    return db.musicCatalogCandidate.create({
        data: {
            musicIndex: update.payload.musicIndex,
            fingerprint: update.fingerprint,
            payload,
            ...(beforeSnapshot ? { beforeSnapshot } : {}),
            status,
            ...(status === "applied"
                ? { reviewedAt: now, appliedAt: now }
                : {}),
        },
        select: { id: true },
    });
}

/**
 * 일반 사용자 동기화가 본 카탈로그 차이 — 한 번 읽고 묶어서 쓴다(2026-10-15 S9, 예전에는 곡마다 읽기 + 쓰기를 동시에).
 * 같은 지문이면 payload 도 같아(지문 = payload 해시) 다시 쓰지 않는다. 상태 규칙은 recordCatalogCandidate 와 같다.
 * 새 후보만 상한을 센다. 넘친 수를 돌려준다
 */
async function recordPendingCatalogCandidates(
    updates: DetectedCatalogUpdate[],
    submittedById: number
) {
    const key = (musicIndex: string, fingerprint: string) =>
        `${musicIndex}:${fingerprint}`;
    const existing = await db.musicCatalogCandidate.findMany({
        where: {
            OR: updates.map((update) => ({
                musicIndex: update.payload.musicIndex,
                fingerprint: update.fingerprint,
            })),
        },
        select: { id: true, musicIndex: true, fingerprint: true, status: true },
    });
    const found = new Set(
        existing.map((item) => key(item.musicIndex, item.fingerprint))
    );
    const unseen = updates.filter(
        (update) =>
            !found.has(key(update.payload.musicIndex, update.fingerprint))
    );
    const pending = existing
        .filter((item) => item.status === "pending")
        .map((item) => item.id);
    // 반려 · 반영한 후보는 다시 봐도 검토 대기로 되돌리지 않는다
    const settled = existing
        .filter((item) => item.status !== "pending")
        .map((item) => item.id);
    const now = new Date();
    const [submittedToday, pendingTotal, pendingMine] = unseen.length
        ? await Promise.all([
              db.musicCatalogCandidate.count({
                  where: {
                      submittedById,
                      createdAt: {
                          gte: new Date(now.getTime() - CANDIDATE_WINDOW_MS),
                      },
                  },
              }),
              db.musicCatalogCandidate.count({
                  where: { status: "pending" },
              }),
              db.musicCatalogCandidate.count({
                  where: { status: "pending", submittedById },
              }),
          ])
        : [0, 0, 0];
    if (unseen.length && pendingTotal >= MAX_PENDING_CANDIDATES)
        logServerError(new Error("Pending catalog candidates are full"), {
            event: "catalog.candidates.full",
            routePath: "/api/receivePlayerData",
            routeType: "route",
        });
    const created = unseen.slice(
        0,
        Math.max(
            0,
            Math.min(
                NEW_CANDIDATES_PER_SYNC,
                NEW_CANDIDATES_PER_DAY - submittedToday,
                MAX_PENDING_CANDIDATES - pendingTotal,
                MAX_PENDING_CANDIDATES_PER_SUBMITTER - pendingMine
            )
        )
    );
    await db.$transaction([
        ...(created.length
            ? [
                  db.musicCatalogCandidate.createMany({
                      data: created.map((update) => ({
                          musicIndex: update.payload.musicIndex,
                          fingerprint: update.fingerprint,
                          payload: update.payload as Prisma.InputJsonValue,
                          ...(update.beforeSnapshot
                              ? {
                                    beforeSnapshot:
                                        update.beforeSnapshot as Prisma.InputJsonValue,
                                }
                              : {}),
                          status: "pending" as const,
                          submittedById,
                      })),
                      skipDuplicates: true,
                  }),
              ]
            : []),
        ...(pending.length
            ? [
                  db.musicCatalogCandidate.updateMany({
                      where: { id: { in: pending } },
                      data: {
                          seenCount: { increment: 1 },
                          lastSeenAt: now,
                          status: "pending",
                      },
                  }),
              ]
            : []),
        ...(settled.length
            ? [
                  db.musicCatalogCandidate.updateMany({
                      where: { id: { in: settled } },
                      data: { seenCount: { increment: 1 }, lastSeenAt: now },
                  }),
              ]
            : []),
    ]);

    return unseen.length - created.length;
}

export async function processBemaniCatalogUpdates(
    music: SyncMusicInput[],
    trustedAdminSync: boolean,
    submittedById: number
) {
    const updates = await detectCatalogUpdates(music);
    if (updates.length === 0) {
        return { detected: 0, pending: 0, applied: 0, overLimit: 0 };
    }

    if (!trustedAdminSync) {
        const overLimit = await recordPendingCatalogCandidates(
            updates,
            submittedById
        );
        return {
            detected: updates.length,
            pending: updates.length - overLimit,
            applied: 0,
            overLimit,
        };
    }

    await updateMusic(updates.map((update) => update.input));
    await Promise.all(
        updates.map((update) => recordCatalogCandidate(update, "applied"))
    );
    return {
        detected: updates.length,
        pending: 0,
        applied: updates.length,
        overLimit: 0,
    };
}

export function parseMusicCatalogSnapshot(value: unknown) {
    return musicCatalogSnapshotSchema.parse(value);
}

export function describeMusicCatalogChanges(
    before: MusicCatalogSnapshot | null,
    payload: MusicCatalogSnapshot
) {
    if (!before) return ["신규 악곡과 채보 추가"];

    const changes: string[] = [];
    const beforeCharts = new Map(
        before.charts.map((chart) => [chart.difficulty, chart.level])
    );
    for (const chart of payload.charts) {
        const previousLevel = beforeCharts.get(chart.difficulty);
        if (previousLevel === undefined) {
            changes.push(`${chart.difficulty} ${chart.level} 추가`);
        } else if (previousLevel !== chart.level) {
            changes.push(
                `${chart.difficulty} 레벨 ${previousLevel} → ${chart.level}`
            );
        }
    }

    if (
        before.title !== payload.title ||
        before.titleKana !== payload.titleKana ||
        before.artist !== payload.artist ||
        before.category !== payload.category ||
        before.categoryShort !== payload.categoryShort ||
        before.description !== payload.description ||
        before.license !== payload.license ||
        before.unlockType !== payload.unlockType
    ) {
        changes.push("악곡 정보 변경");
    }

    return changes.length > 0 ? changes : ["카탈로그 정보 변경"];
}

export async function applyMusicCatalogSnapshot(
    snapshot: MusicCatalogSnapshot
) {
    await updateMusic([
        {
            "@index": snapshot.musicIndex,
            title: snapshot.title,
            title_kana: snapshot.titleKana,
            artist: snapshot.artist,
            category: snapshot.category,
            category_short: snapshot.categoryShort,
            description: snapshot.description,
            license: snapshot.license,
            unlock_type: snapshot.unlockType,
            sheet: snapshot.charts,
        },
    ]);
}
