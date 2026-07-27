import "server-only";

import { createHash } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { z } from "zod";

import db from "@/lib/db";
import {
    type BemaniMusicCatalogInput,
    type SyncMusicInput,
    updateMusic,
} from "@/lib/services/music/updateMusic";

const difficultySchema = z.enum(["Normal", "Hard", "Expert", "Real"]);
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

export function createMusicCatalogSnapshot(
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
    title_kana: string;
    artist: string | null;
    category: string;
    category_short: string;
    description: string | null;
    license: string | null;
    unlock_type: number | null;
    charts: { difficulty: string; level: number }[];
}): MusicCatalogSnapshot {
    return {
        musicIndex: music.index,
        title: music.title,
        titleKana: music.title_kana,
        artist: music.artist,
        category: music.category,
        categoryShort: music.category_short,
        description: music.description,
        license: music.license ?? "",
        unlockType: music.unlock_type ?? 0,
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
            title_kana: true,
            artist: true,
            category: true,
            category_short: true,
            description: true,
            license: true,
            unlock_type: true,
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
                    : existing.status === "rejected"
                      ? {}
                      : { status: "pending" }),
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

export async function processBemaniCatalogUpdates(
    music: SyncMusicInput[],
    trustedAdminSync: boolean
) {
    const updates = await detectCatalogUpdates(music);
    if (updates.length === 0) {
        return { detected: 0, pending: 0, applied: 0 };
    }

    if (!trustedAdminSync) {
        await Promise.all(
            updates.map((update) => recordCatalogCandidate(update, "pending"))
        );
        return {
            detected: updates.length,
            pending: updates.length,
            applied: 0,
        };
    }

    await updateMusic(updates.map((update) => update.input));
    await Promise.all(
        updates.map((update) => recordCatalogCandidate(update, "applied"))
    );
    return { detected: updates.length, pending: 0, applied: updates.length };
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
