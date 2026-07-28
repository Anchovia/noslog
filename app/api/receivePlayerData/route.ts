import { verifySyncToken } from "@/lib/bookmarklet";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { updateDummy } from "@/lib/dummy/bingo";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { processBemaniCatalogUpdates } from "@/lib/services/music/catalogSync";
import { type SyncMusicInput } from "@/lib/services/music/updateMusic";
import { updateGrade } from "@/lib/services/user/updateGrade";
import { updatePlayData } from "@/lib/services/user/updatePlayData";
import { updatePlayerProfile } from "@/lib/services/user/updatePlayerProfile";
import { updateRecentPlay } from "@/lib/services/user/updateRecentPlay";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const EAGATE_ORIGIN = "https://p.eagate.573.jp";
const MAX_SYNC_BODY_BYTES = 8 * 1024 * 1024;
const SYNC_COOLDOWN_MS = 30 * 1000;
const SYNC_PROCESSING_TIMEOUT_MS = 15 * 60 * 1000;
const responseCopy = {
    ko: {
        forbidden: "허용되지 않은 요청입니다.",
        jsonOnly: "JSON 형식의 요청만 허용됩니다.",
        tooLarge: "전송된 데이터가 너무 큽니다.",
        invalidPayload: "전송된 데이터 형식이 올바르지 않습니다.",
        invalidToken: "연동 토큰이 올바르지 않습니다.",
        expiredToken: "연동 토큰이 만료되었습니다. 다시 등록해주세요.",
        loginRequired: "NOSTALGIA 로그인 상태를 확인해주세요.",
        processing:
            "이미 동기화를 처리하고 있습니다. 잠시 후 다시 시도해주세요.",
        cooldown: "동기화 요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.",
        fullComplete: "전체 기록 동기화가 완료되었습니다.",
        recentComplete: "최근 기록 동기화가 완료되었습니다.",
        processFailed: "데이터 처리 중 오류가 발생했습니다.",
    },
    ja: {
        forbidden: "許可されていないリクエストです。",
        jsonOnly: "JSON形式のリクエストのみ許可されています。",
        tooLarge: "送信されたデータが大きすぎます。",
        invalidPayload: "送信されたデータ形式が正しくありません。",
        invalidToken: "連携トークンが正しくありません。",
        expiredToken: "連携トークンの期限が切れました。再登録してください。",
        loginRequired: "NOSTALGIAのログイン状態を確認してください。",
        processing: "同期を処理中です。しばらくしてから再試行してください。",
        cooldown:
            "同期リクエストが早すぎます。しばらくしてから再試行してください。",
        fullComplete: "全記録の同期が完了しました。",
        recentComplete: "最近の記録の同期が完了しました。",
        processFailed: "データ処理中にエラーが発生しました。",
    },
    en: {
        forbidden: "This request is not allowed.",
        jsonOnly: "Only JSON requests are allowed.",
        tooLarge: "The submitted data is too large.",
        invalidPayload: "The submitted data format is invalid.",
        invalidToken: "The sync token is invalid.",
        expiredToken: "The sync token has expired. Please register it again.",
        loginRequired: "Please check that you are signed in to NOSTALGIA.",
        processing: "A sync is already in progress. Please try again shortly.",
        cooldown: "Sync requests are too frequent. Please try again shortly.",
        fullComplete: "All records have been synced.",
        recentComplete: "Recent records have been synced.",
        processFailed: "An error occurred while processing the data.",
    },
} as const satisfies Record<Locale, Record<string, string>>;

function getResponseCopy(request: NextRequest) {
    const locale = request.nextUrl.searchParams.get("locale");
    return responseCopy[isLocale(locale) ? locale : "ko"];
}

const shortText = z.string().min(1).max(256);
const nullableShortText = z.string().max(256).nullable();
const difficultySchema = z.enum(["Normal", "Hard", "Expert", "Real"]);
const sourceStatusSchema = z.object({
    status: z.number().int(),
    fail_code: z.number().int(),
});
const broochSchema = z.object({
    "@index": z.string().max(128),
    name: z.string().max(256),
    description: z.string().max(5_000),
});
const recentHistorySchema = z.object({
    artist: z.string().max(256),
    best_score: z.number().int().min(0).max(1_000_000),
    class_basic: z.string().max(32),
    difficulty: difficultySchema,
    fast_count: z.number().int().min(0).max(1_000_000),
    is_onehand: z.boolean(),
    judge_count: z.tuple([
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
    ]),
    level: z.number().int().min(1).max(14),
    license: z.string().max(5_000),
    score: z.number().int().min(0).max(1_000_000),
    slow_count: z.number().int().min(0).max(1_000_000),
    max_combo: z.number().int().min(0).max(1_000_000),
    rank: z.string().min(1).max(32),
    play_time: z.string().min(1).max(64),
    music: shortText,
    title: shortText,
    grade_basic: z.number().int().min(0).max(100_000_000),
});
const musicSheetSchema = z.object({
    difficulty: difficultySchema,
    level: z.number().int().min(1).max(14),
    score: z.number().int().min(0).max(1_000_000),
    rank: z.string().min(1).max(32),
    fc_type: z.number().int().min(0).max(10),
    play_count: z.number().int().min(0).max(10_000_000),
    clear_count: z.number().int().min(0).max(10_000_000),
    clear_flag: z.tuple([z.number().int().min(0).max(1_000_000)]),
    fullcombo_count: z.number().int().min(0).max(10_000_000),
    pianistic_count: z.number().int().min(0).max(10_000_000),
    max_combo: z.number().int().min(0).max(1_000_000),
    grade_basic: z.number().int().min(0).max(100_000_000),
    grade_recital: z.number().int().min(0).max(100_000_000),
    judge: z.tuple([
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
        z.number().int().min(0).max(1_000_000),
    ]),
    note_success_rate: z.tuple([
        z.number().int().min(-1).max(10_000),
        z.number().int().min(-1).max(10_000),
        z.number().int().min(-1).max(10_000),
        z.number().int().min(-1).max(10_000),
    ]),
    besttime: z.string().max(64),
});
const musicSchema = z.object({
    "@index": z.string().min(1).max(128),
    artist: nullableShortText,
    category: z.string().min(1).max(128),
    category_short: z.string().min(1).max(32),
    description: z.string().max(5_000).nullable(),
    license: z.string().max(5_000),
    title: shortText,
    title_kana: z.string().max(256),
    unlock_type: z.number().int().min(0).max(100),
    sheet: z.array(musicSheetSchema).min(3).max(4),
});
const syncRequestSchema = z.object({
    token: z.string().min(1).max(512),
    playerData: z.object({
        status: z.number().int(),
        data: sourceStatusSchema.extend({
            player: z.object({
                name: z.string().min(1).max(64),
                play_count: z.number().int().min(0).max(10_000_000),
                travel_info: z.object({
                    money: z.number().int().min(0).max(1_000_000_000),
                }),
                last: z.object({
                    playtime: z.string().max(64),
                    brooch: broochSchema,
                }),
                brooch_list: z.object({
                    brooch: z.array(broochSchema).max(1_000),
                }),
            }),
        }),
    }),
    recentData: z.object({
        status: z.number().int(),
        data: sourceStatusSchema.extend({
            player: z.object({
                name: z.string().max(64),
                history_list: z.object({
                    history: z.array(recentHistorySchema).max(100),
                }),
            }),
        }),
    }),
    totalData: z
        .object({
            status: z.number().int(),
            data: sourceStatusSchema.extend({
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
    data: Record<string, unknown> = {},
    headers: HeadersInit = {}
) {
    return NextResponse.json(
        { message, ...data },
        { status, headers: { ...corsHeaders(), ...headers } }
    );
}

type SyncAttemptResult =
    | { allowed: true; syncId: number }
    | { allowed: false; reason: "processing" | "cooldown"; retryAfter: number };

type SkippedChart = {
    musicIndex: string;
    difficulty: string;
};

async function filterKnownMusic(music: SyncMusicInput[]) {
    const charts = await db.musicChart.findMany({
        where: {
            music_idx: {
                in: [...new Set(music.map((item) => item["@index"]))],
            },
        },
        select: { music_idx: true, difficulty: true },
    });
    const knownCharts = new Set(
        charts.map((chart) => `${chart.music_idx}:${chart.difficulty}`)
    );
    const skippedCharts: SkippedChart[] = [];
    const knownMusic = music.flatMap((item) => {
        const sheet = item.sheet.filter((chart) => {
            const known = knownCharts.has(
                `${item["@index"]}:${chart.difficulty}`
            );
            if (!known) {
                skippedCharts.push({
                    musicIndex: item["@index"],
                    difficulty: chart.difficulty,
                });
            }
            return known;
        });

        return sheet.length > 0 ? [{ ...item, sheet }] : [];
    });

    return { knownMusic, skippedCharts };
}

function formatSkippedCharts(skippedCharts: SkippedChart[]) {
    if (skippedCharts.length === 0) return null;

    const preview = skippedCharts
        .slice(0, 20)
        .map((chart) => `${chart.musicIndex} (${chart.difficulty})`)
        .join(", ");
    const remainder = skippedCharts.length - 20;

    return `DB에 등록되지 않은 채보 ${skippedCharts.length}개를 건너뛰었습니다: ${preview}${remainder > 0 ? ` 외 ${remainder}개` : ""}`;
}

// 사용자별 DB 잠금으로 여러 서버 인스턴스에서도 동기화 시작을 직렬화함
async function createSyncAttempt(
    userId: number,
    syncScope: "full" | "recent",
    receivedPlays: number
): Promise<SyncAttemptResult> {
    return db.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(73051, ${userId}::integer)`;

        const now = new Date();
        const latestSync = await tx.dataSync.findFirst({
            where: { user_id: userId },
            select: { id: true, status: true, started_at: true },
            orderBy: { started_at: "desc" },
        });

        if (latestSync?.status === "processing") {
            const processingAge =
                now.getTime() - latestSync.started_at.getTime();
            if (processingAge < SYNC_PROCESSING_TIMEOUT_MS) {
                return {
                    allowed: false,
                    reason: "processing",
                    retryAfter: Math.max(
                        1,
                        Math.ceil(
                            (SYNC_PROCESSING_TIMEOUT_MS - processingAge) / 1000
                        )
                    ),
                };
            }

            await tx.dataSync.update({
                where: { id: latestSync.id },
                data: {
                    status: "failed",
                    error_message: "동기화 처리 시간이 초과되었습니다.",
                    completed_at: now,
                },
            });
        } else if (latestSync) {
            const elapsed = now.getTime() - latestSync.started_at.getTime();
            if (elapsed < SYNC_COOLDOWN_MS) {
                return {
                    allowed: false,
                    reason: "cooldown",
                    retryAfter: Math.max(
                        1,
                        Math.ceil((SYNC_COOLDOWN_MS - elapsed) / 1000)
                    ),
                };
            }
        }

        const sync = await tx.dataSync.create({
            data: {
                user_id: userId,
                sync_scope: syncScope,
                received_plays: receivedPlays,
            },
            select: { id: true },
        });
        return { allowed: true, syncId: sync.id };
    });
}

export async function POST(request: NextRequest) {
    const copy = getResponseCopy(request);

    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return json(copy.forbidden, 403);
    }

    if (!request.headers.get("content-type")?.startsWith("application/json")) {
        return json(copy.jsonOnly, 415);
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_SYNC_BODY_BYTES) {
        return json(copy.tooLarge, 413);
    }

    const body = await request.json().catch(() => null);
    const parsed = syncRequestSchema.safeParse(body);
    if (!parsed.success) {
        return json(copy.invalidPayload, 400);
    }

    const tokenPayload = verifySyncToken(parsed.data.token);
    if (!tokenPayload) {
        return json(copy.invalidToken, 401);
    }

    const user = await db.user.findUnique({
        where: { id: tokenPayload.userId },
        select: { id: true, sync_token_version: true, role: true },
    });
    if (!user || user.sync_token_version !== tokenPayload.version) {
        return json(copy.expiredToken, 401);
    }

    const { playerData, recentData, totalData } = parsed.data;
    if (
        playerData.status !== 0 ||
        playerData.data.status !== 0 ||
        recentData.status !== 0 ||
        recentData.data.status !== 0 ||
        (totalData && (totalData.status !== 0 || totalData.data.status !== 0))
    ) {
        return json(copy.loginRequired, 400);
    }

    const player = playerData.data.player;
    const history = recentData.data.player.history_list.history;
    const music: SyncMusicInput[] | null = totalData
        ? totalData.data.music
        : null;
    const syncAttempt = await createSyncAttempt(
        user.id,
        music ? "full" : "recent",
        history.length
    );
    if (!syncAttempt.allowed) {
        return json(
            syncAttempt.reason === "processing"
                ? copy.processing
                : copy.cooldown,
            syncAttempt.reason === "processing" ? 409 : 429,
            { retryAfter: syncAttempt.retryAfter },
            { "Retry-After": String(syncAttempt.retryAfter) }
        );
    }

    const syncId = syncAttempt.syncId;

    try {
        await updatePlayerProfile(user.id, player);

        const insertedPlays = await updateRecentPlay(user.id, history, syncId);
        let changedRecords = 0;
        let syncNotice: string | null = null;
        let catalogUpdates = { detected: 0, pending: 0, applied: 0 };
        if (music) {
            catalogUpdates = await processBemaniCatalogUpdates(
                music,
                user.role === "admin"
            );
            const { knownMusic, skippedCharts } = await filterKnownMusic(music);
            syncNotice = formatSkippedCharts(skippedCharts);

            if (knownMusic.length > 0) {
                changedRecords = await updatePlayData(
                    user.id,
                    knownMusic,
                    syncId
                );
                await updateGrade(user.id);
                await updateDummy();
            }
        }

        await db.dataSync.update({
            where: { id: syncId },
            data: {
                status: "completed",
                inserted_plays: insertedPlays,
                changed_records: changedRecords,
                error_message: syncNotice,
                completed_at: new Date(),
            },
        });

        revalidateTag(getUserProfileTag(user.id), "max");

        if (music) {
            revalidateTag(CACHE_TAGS.chartRankings, "max");
            revalidateTag(CACHE_TAGS.userRankings, "max");
            revalidateTag(CACHE_TAGS.bingos, "max");
            revalidateTag(CACHE_TAGS.userProfiles, "max");
            if (catalogUpdates.applied > 0) {
                revalidateTag(CACHE_TAGS.musicCatalog, "max");
                revalidateTag(CACHE_TAGS.musicDetails, "max");
            }
        }

        return json(music ? copy.fullComplete : copy.recentComplete, 200, {
            syncScope: music ? "full" : "recent",
            receivedPlays: history.length,
            insertedPlays,
            changedRecords,
            catalogUpdates,
        });
    } catch (error) {
        console.error("BEMANI data synchronization failed", error);

        await db.dataSync.update({
            where: { id: syncId },
            data: {
                status: "failed",
                error_message:
                    error instanceof Error ? error.message : "Unknown error",
                completed_at: new Date(),
            },
        });

        return json(copy.processFailed, 500);
    }
}

export async function OPTIONS(request: NextRequest) {
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
