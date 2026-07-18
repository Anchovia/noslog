import { verifySyncToken } from "@/lib/bookmarklet";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { updateDummy } from "@/lib/dummy/bingo";
import {
    type SyncMusicInput,
    updateMusic,
} from "@/lib/services/music/updateMusic";
import { updateGrade } from "@/lib/services/user/updateGrade";
import { updatePlayCount } from "@/lib/services/user/updatePlayCount";
import { updatePlayData } from "@/lib/services/user/updatePlayData";
import { updateRecentPlay } from "@/lib/services/user/updateRecentPlay";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const EAGATE_ORIGIN = "https://p.eagate.573.jp";
const MAX_SYNC_BODY_BYTES = 8 * 1024 * 1024;
const shortText = z.string().min(1).max(256);
const nullableShortText = z.string().max(256).nullable();
const difficultySchema = z.enum(["Normal", "Hard", "Expert", "Real"]);
const recentHistorySchema = z.object({
    difficulty: difficultySchema,
    level: z.number().int().min(1).max(14),
    score: z.number().int().min(0).max(1_000_000),
    max_combo: z.number().int().min(0).max(1_000_000),
    rank: z.string().min(1).max(32),
    play_time: z.string().min(1).max(64),
    music: shortText,
    grade_basic: z.number().int().min(0).max(100_000_000),
});
const musicSheetSchema = z.object({
    difficulty: difficultySchema,
    level: z.number().int().min(1).max(14),
    score: z.number().int().min(0).max(1_000_000),
    rank: z.string().min(1).max(32),
    fc_type: z.number().int().min(0).max(10),
    play_count: z.number().int().min(0).max(10_000_000),
    fullcombo_count: z.number().int().min(0).max(10_000_000),
    pianistic_count: z.number().int().min(0).max(10_000_000),
    max_combo: z.number().int().min(0).max(1_000_000),
    grade_basic: z.number().int().min(0).max(100_000_000),
    grade_recital: z.number().int().min(0).max(100_000_000),
    besttime: z.string().max(64),
});
const musicSchema = z.object({
    "@index": z.string().min(1).max(128),
    artist: nullableShortText,
    category: z.string().min(1).max(128),
    category_short: z.string().min(1).max(32),
    description: z.string().max(5_000).nullable(),
    title: shortText,
    title_kana: z.string().max(256),
    sheet: z.array(musicSheetSchema).min(3).max(4),
});
const syncRequestSchema = z.object({
    token: z.string().min(1).max(512),
    playerData: z.object({
        status: z.number().int(),
        data: z.object({
            player: z.object({
                name: z.string().min(1).max(64),
                play_count: z.number().int().min(0).max(10_000_000),
            }),
        }),
    }),
    recentData: z.object({
        status: z.number().int(),
        data: z.object({
            player: z.object({
                history_list: z.object({
                    history: z.array(recentHistorySchema).max(100),
                }),
            }),
        }),
    }),
    totalData: z
        .object({
            status: z.number().int(),
            data: z.object({
                music: z.array(musicSchema).max(2_000),
            }),
        })
        .nullable(),
});

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": EAGATE_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        "Cache-Control": "no-store",
        Vary: "Origin",
    };
}

function json(
    message: string,
    status: number,
    data: Record<string, unknown> = {}
) {
    return NextResponse.json(
        { message, ...data },
        { status, headers: corsHeaders() }
    );
}

export async function POST(request: NextRequest) {
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return json("허용되지 않은 요청입니다.", 403);
    }

    if (!request.headers.get("content-type")?.startsWith("application/json")) {
        return json("JSON 형식의 요청만 허용됩니다.", 415);
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_SYNC_BODY_BYTES) {
        return json("전송된 데이터가 너무 큽니다.", 413);
    }

    const body = await request.json().catch(() => null);
    const parsed = syncRequestSchema.safeParse(body);
    if (!parsed.success) {
        return json("전송된 데이터 형식이 올바르지 않습니다.", 400);
    }

    const tokenPayload = verifySyncToken(parsed.data.token);
    if (!tokenPayload) {
        return json("연동 토큰이 올바르지 않습니다.", 401);
    }

    const user = await db.user.findUnique({
        where: { id: tokenPayload.userId },
        select: { id: true, sync_token_version: true },
    });
    if (!user || user.sync_token_version !== tokenPayload.version) {
        return json("연동 토큰이 만료되었습니다. 다시 등록해주세요.", 401);
    }

    const { playerData, recentData, totalData } = parsed.data;
    if (
        playerData.status !== 0 ||
        recentData.status !== 0 ||
        (totalData && totalData.status !== 0)
    ) {
        return json("NOSTALGIA 로그인 상태를 확인해주세요.", 400);
    }

    const { name, play_count: playCount } = playerData.data.player;
    const history = recentData.data.player.history_list.history;
    const music: SyncMusicInput[] | null = totalData
        ? totalData.data.music
        : null;
    let syncId: number | null = null;

    try {
        if (music) {
            await updateMusic(music);
        }
        await updatePlayCount(user.id, name, playCount);

        const sync = await db.dataSync.create({
            data: {
                user_id: user.id,
                sync_scope: music ? "full" : "recent",
                received_plays: history.length,
            },
        });
        syncId = sync.id;

        const insertedPlays = await updateRecentPlay(user.id, history, sync.id);
        let changedRecords = 0;
        if (music) {
            changedRecords = await updatePlayData(user.id, music, sync.id);
            await updateGrade(user.id);
            await updateDummy();
        }

        await db.dataSync.update({
            where: { id: sync.id },
            data: {
                status: "completed",
                inserted_plays: insertedPlays,
                changed_records: changedRecords,
                completed_at: new Date(),
            },
        });

        revalidateTag(getUserProfileTag(user.id), "max");

        if (music) {
            revalidateTag(CACHE_TAGS.musicCatalog, "max");
            revalidateTag(CACHE_TAGS.musicDetails, "max");
            revalidateTag(CACHE_TAGS.chartRankings, "max");
            revalidateTag(CACHE_TAGS.userRankings, "max");
            revalidateTag(CACHE_TAGS.bingos, "max");
            revalidateTag(CACHE_TAGS.userProfiles, "max");
        }

        return json(
            music
                ? "전체 기록 동기화가 완료되었습니다."
                : "최근 기록 동기화가 완료되었습니다.",
            200,
            { syncScope: music ? "full" : "recent" }
        );
    } catch (error) {
        console.error("BEMANI data synchronization failed", error);

        if (syncId) {
            await db.dataSync.update({
                where: { id: syncId },
                data: {
                    status: "failed",
                    error_message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                    completed_at: new Date(),
                },
            });
        }

        return json("데이터 처리 중 오류가 발생했습니다.", 500);
    }
}

export async function OPTIONS(request: NextRequest) {
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
