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
const difficultySchema = z.enum(["Normal", "Hard", "Expert", "Real"]);
const recentHistorySchema = z.object({
    difficulty: difficultySchema,
    level: z.number().int().positive(),
    score: z.number().int().nonnegative(),
    max_combo: z.number().int().nonnegative(),
    rank: z.string().min(1),
    play_time: z.string().min(1),
    music: z.string().min(1),
    grade_basic: z.number().int().nonnegative(),
});
const musicSheetSchema = z.object({
    difficulty: difficultySchema,
    level: z.number().int().positive(),
    score: z.number().int().nonnegative(),
    rank: z.string().min(1),
    fc_type: z.number().int().nonnegative(),
    play_count: z.number().int().nonnegative(),
    fullcombo_count: z.number().int().nonnegative(),
    pianistic_count: z.number().int().nonnegative(),
    max_combo: z.number().int().nonnegative(),
    grade_basic: z.number().int().nonnegative(),
    grade_recital: z.number().int().nonnegative(),
    besttime: z.string(),
});
const musicSchema = z.object({
    "@index": z.string().min(1),
    artist: z.string().nullable(),
    category: z.string().min(1),
    category_short: z.string().min(1),
    description: z.string().nullable(),
    title: z.string().min(1),
    title_kana: z.string(),
    sheet: z.array(musicSheetSchema).min(3).max(4),
});
const syncRequestSchema = z.object({
    token: z.string().min(1),
    playerData: z.object({
        status: z.number(),
        data: z.object({
            player: z.object({
                name: z.string().min(1),
                play_count: z.number().int().nonnegative(),
            }),
        }),
    }),
    recentData: z.object({
        status: z.number(),
        data: z.object({
            player: z.object({
                history_list: z.object({
                    history: z.array(recentHistorySchema),
                }),
            }),
        }),
    }),
    totalData: z
        .object({
            status: z.number(),
            data: z.object({
                music: z.array(musicSchema),
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
