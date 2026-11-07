import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { evaluateUserAchievements } from "@/features/achievements/server/achievement-service";
import { getMissingJacketIndexes } from "@/features/music/server/jacket-collection-service";
import { recordProfileRatings } from "@/features/profile/server/profile-rating-history-service";
import { refreshUserPlayerRatings } from "@/features/rankings/server/player-rating-service";
import {
    completeSyncAttempt,
    createSyncAttempt,
    failSyncAttempt,
    getSyncUser,
} from "@/features/sync/server/sync-attempt-data";
import { readJsonBody } from "@/lib/api/read-json-body";
import { isSyncTokenExpired, verifySyncToken } from "@/lib/bookmarklet";
import {
    CACHE_TAGS,
    getChartRankingTag,
    getUserProfileTag,
} from "@/lib/cache-tags";
import { updateDummy } from "@/lib/dummy/bingo";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { processBemaniCatalogUpdates } from "@/lib/services/music/catalog-sync";
import { type SyncMusicInput } from "@/lib/services/music/update-music";
import { type ChartIdMap, loadChartIds } from "@/lib/services/user/chart-ids";
import {
    type ChartLimitMap,
    isWithinChartLimits,
    loadChartLimits,
    selectKeptChartIds,
} from "@/lib/services/user/chart-limits";
import { keepTodayGrade, updateGrade } from "@/lib/services/user/update-grade";
import { updatePlayData } from "@/lib/services/user/update-play-data";
import { updatePlayerProfile } from "@/lib/services/user/update-player-profile";
import { updateRecentBestRecords } from "@/lib/services/user/update-recent-best-records";
import { updateRecentPlay } from "@/lib/services/user/update-recent-play";

const EAGATE_ORIGIN = "https://p.eagate.573.jp";
const MAX_SYNC_BODY_BYTES = 8 * 1024 * 1024;
// 바뀐 채보가 이보다 많으면(첫 전체 동기화 등) 채보별 대신 전체 순위 태그 하나로 비운다
const CHART_TAG_REVALIDATE_LIMIT = 200;
const responseCopy = {
    ko: {
        forbidden: "허용되지 않은 요청입니다.",
        jsonOnly: "JSON 형식의 요청만 허용됩니다.",
        tooLarge: "전송된 데이터가 너무 큽니다.",
        invalidPayload: "전송된 데이터 형식이 올바르지 않습니다.",
        invalidToken: "동기화 토큰이 올바르지 않습니다.",
        expiredToken: "동기화 토큰이 만료되었습니다. 다시 등록해주세요.",
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
        invalidToken: "同期トークンが正しくありません。",
        expiredToken: "同期トークンの期限が切れました。再登録してください。",
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
    status: z.number().int().optional(),
    fail_code: z.number().int().optional(),
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
const unwrapSingleton = (value: unknown) =>
    Array.isArray(value) && value.length === 1 ? value[0] : value;
const normalizeCollection = (value: unknown) =>
    value === undefined || Array.isArray(value) ? value : [value];
const syncRequestSchema = z.object({
    token: z.string().min(1).max(512),
    playerData: z.object({
        status: z.number().int(),
        data: sourceStatusSchema.extend({
            player: z.preprocess(
                unwrapSingleton,
                z.object({
                    name: z.string().min(1).max(64),
                    play_count: z.number().int().min(0).max(10_000_000),
                    // 북마클릿이 함께 보내는 NOS(travel_info) · 브로치는 읽는 곳이 없어 받지 않는다(2026-10-16 K5)
                    last: z.object({
                        playtime: z.string().max(64),
                    }),
                })
            ),
        }),
    }),
    recentData: z.object({
        status: z.number().int(),
        data: sourceStatusSchema.extend({
            player: z.preprocess(
                unwrapSingleton,
                z.object({
                    name: z.string().max(64),
                    history_list: z.object({
                        history: z.array(recentHistorySchema).max(100),
                    }),
                })
            ),
        }),
    }),
    totalData: z
        .object({
            status: z.number().int(),
            data: sourceStatusSchema.extend({
                music: z.preprocess(
                    normalizeCollection,
                    z.array(musicSchema).max(2_000)
                ),
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

type SkippedChart = {
    musicIndex: string;
    difficulty: string;
};

function filterKnownMusic(music: SyncMusicInput[], knownCharts: ChartIdMap) {
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
    skippedCharts = [
        ...new Map(
            skippedCharts.map((chart) => [
                `${chart.musicIndex}:${chart.difficulty}`,
                chart,
            ])
        ).values(),
    ];
    if (skippedCharts.length === 0) return null;

    const preview = skippedCharts
        .slice(0, 20)
        .map((chart) => `${chart.musicIndex} (${chart.difficulty})`)
        .join(", ");
    const remainder = skippedCharts.length - 20;

    return `DB에 등록되지 않은 채보 ${skippedCharts.length}개를 건너뛰었습니다: ${preview}${remainder > 0 ? ` 외 ${remainder}개` : ""}`;
}

function dropOutOfRangeSheets(
    music: SyncMusicInput[],
    limits: ChartLimitMap,
    chartIds: ChartIdMap
) {
    const rejectedChartIds: number[] = [];
    const kept = music.flatMap((item) => {
        const sheet = item.sheet.filter((chart) => {
            const key = `${item["@index"]}:${chart.difficulty}`;
            const within = isWithinChartLimits(limits.get(key), {
                difficulty: chart.difficulty,
                judge: chart.judge,
                maxCombo: chart.max_combo,
                gradeBasic: chart.grade_basic,
                gradeRecital: chart.grade_recital,
            });
            const chartId = chartIds.get(key);
            if (!within && chartId) rejectedChartIds.push(chartId);
            return within;
        });
        return sheet.length > 0 ? [{ ...item, sheet }] : [];
    });
    return { kept, rejectedChartIds };
}

// 공식 응답에는 같은 채보가 두 번 오지 않는다. 받으면 클리어 랭크 수가 부푼다
function hasDuplicateCharts(music: SyncMusicInput[]) {
    const seen = new Set<string>();
    for (const item of music) {
        for (const chart of item.sheet) {
            const key = `${item["@index"]}:${chart.difficulty}`;
            if (seen.has(key)) return true;
            seen.add(key);
        }
    }
    return false;
}

function joinNotices(...notices: (string | null)[]) {
    const text = notices.filter(Boolean).join(" ");
    return text || null;
}

function formatOutOfRange(rejected: number) {
    return rejected > 0
        ? `채보 노트 수 · 최대 Grd 를 벗어난 기록 ${rejected}개를 저장하지 않았습니다.`
        : null;
}

export async function POST(request: NextRequest) {
    const copy = getResponseCopy(request);

    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return json(copy.forbidden, 403);
    }

    if (!request.headers.get("content-type")?.startsWith("application/json")) {
        return json(copy.jsonOnly, 415);
    }

    const read = await readJsonBody(request, MAX_SYNC_BODY_BYTES);
    if (read.tooLarge) {
        return json(copy.tooLarge, 413);
    }

    const parsed = syncRequestSchema.safeParse(read.body);
    if (!parsed.success) {
        console.warn("BEMANI sync payload validation failed", {
            issues: parsed.error.issues.slice(0, 10).map((issue) => ({
                code: issue.code,
                path: issue.path.join("."),
            })),
        });
        return json(copy.invalidPayload, 400);
    }

    const verifiedToken = verifySyncToken(parsed.data.token);
    if (verifiedToken.status === "invalid") {
        return json(copy.invalidToken, 401);
    }
    if (verifiedToken.status === "expired") {
        return json(copy.expiredToken, 401);
    }
    const tokenPayload = verifiedToken.payload;

    const user = await getSyncUser(tokenPayload.userId);
    if (
        !user ||
        user.syncTokenVersion !== tokenPayload.version ||
        isSyncTokenExpired(tokenPayload, user.role)
    ) {
        return json(copy.expiredToken, 401);
    }

    // 관리자 권한은 2단계를 켠 세션에서 발급한 토큰에만 준다. 자기 기록 동기화는 어느 토큰이든 된다
    const adminSync = user.role === "admin" && tokenPayload.adminMfa === true;

    const { playerData, recentData, totalData } = parsed.data;
    if (
        playerData.status !== 0 ||
        (playerData.data.status !== undefined &&
            playerData.data.status !== 0) ||
        recentData.status !== 0 ||
        (recentData.data.status !== undefined &&
            recentData.data.status !== 0) ||
        (totalData &&
            (totalData.status !== 0 ||
                (totalData.data.status !== undefined &&
                    totalData.data.status !== 0)))
    ) {
        return json(copy.loginRequired, 400);
    }

    const player = playerData.data.player;
    const history = recentData.data.player.history_list.history;
    const music: SyncMusicInput[] | null = totalData
        ? totalData.data.music
        : null;
    if (music && hasDuplicateCharts(music)) {
        return json(copy.invalidPayload, 400);
    }
    const chartLimits = await loadChartLimits();
    const historyInRange = history.filter((item) =>
        isWithinChartLimits(
            chartLimits.get(`${item.music}:${item.difficulty}`),
            {
                difficulty: item.difficulty,
                judge: item.judge_count,
                maxCombo: item.max_combo,
                gradeBasic: item.grade_basic,
            }
        )
    );
    let outOfRange = history.length - historyInRange.length;
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
    // 바뀐 기록이 없고 직전 동기화가 끝까지 됐으면 Grd · 랭킹 레이팅을 다시 세지 않는다(2026-10-16 DB 재설계 P4 Q1).
    // 직전 시도가 실패로 끝났으면 기록만 커밋되고 파생 계산 전에 멈췄을 수 있어 예전처럼 다시 센다.
    // 랭킹 레이팅은 서열표를 저장할 때 전원 다시 세므로(rebuildStalePlayerRatings) 기록이 그대로면 값도 그대로다.
    // 프로필 레이팅 이력은 그래프 점이라 예전처럼 동기화마다 남기고, Grd 「하루 한 줄」 은 지금 값으로 남긴다
    const refreshDerived = async (changed: number[]) => {
        if (changed.length === 0 && syncAttempt.previousCompleted) {
            await keepTodayGrade(user.id);
            await recordProfileRatings(user.id, syncId);
            return null;
        }
        const result = await updateGrade(user.id);
        await recordProfileRatings(user.id, syncId);
        // 랭킹용 저장 레이팅 — 이 사람만 다시 센다(2026-10-15 L2-A2)
        await refreshUserPlayerRatings(user.id);
        return result;
    };

    try {
        await updatePlayerProfile(user.id, player);

        const { insertedPlays, skippedCharts: skippedRecentCharts } =
            await updateRecentPlay(user.id, historyInRange, syncId);
        let changedRecords = 0;
        let changedChartIds: number[] = [];
        let grades: Awaited<ReturnType<typeof updateGrade>> | null = null;
        let syncNotice = formatSkippedCharts(skippedRecentCharts);
        let catalogUpdates = { detected: 0, pending: 0, applied: 0 };
        if (music) {
            const { overLimit, ...catalogCounts } =
                await processBemaniCatalogUpdates(music, adminSync, user.id);
            catalogUpdates = catalogCounts;
            if (overLimit > 0)
                console.warn("BEMANI catalog candidates over limit", {
                    userId: user.id,
                    syncId,
                    candidates: overLimit,
                });
            // 곡 목록 반영 뒤 채보 지도를 한 번 읽어 확인 · 저장이 같이 쓴다(2026-10-16 Q2 — 예전에는 두 번 더 읽었다)
            const chartIds = await loadChartIds();
            const { knownMusic: registeredMusic, skippedCharts } =
                filterKnownMusic(music, chartIds);
            syncNotice = formatSkippedCharts([
                ...skippedRecentCharts,
                ...skippedCharts,
            ]);
            const { kept: knownMusic, rejectedChartIds } = dropOutOfRangeSheets(
                registeredMusic,
                chartLimits,
                chartIds
            );
            outOfRange += rejectedChartIds.length;

            if (knownMusic.length > 0) {
                ({ changedRecords, changedChartIds } = await updatePlayData(
                    user.id,
                    knownMusic,
                    syncId,
                    chartIds,
                    rejectedChartIds.length > 0
                        ? await selectKeptChartIds(user.id, rejectedChartIds)
                        : []
                ));
                grades = await refreshDerived(changedChartIds);
                await updateDummy();
            }
        } else {
            ({ changedRecords, changedChartIds } =
                await updateRecentBestRecords(user.id, syncId));
            grades = await refreshDerived(changedChartIds);
        }

        // 업적 판정(2026-09-24 N1) — 실패해도 동기화 결과는 그대로. 새 단계는 동기화 결과 화면이 달성 시각으로 모아 보인다
        const newAchievements = await evaluateUserAchievements(user.id).catch(
            (error) => {
                console.error("Achievement evaluation failed", error);
                return [];
            }
        );

        if (outOfRange > 0)
            console.warn("BEMANI sync values out of chart range", {
                userId: user.id,
                syncId,
                rows: outOfRange,
            });
        await completeSyncAttempt(syncId, {
            insertedPlays,
            changedRecords,
            notice: joinNotices(syncNotice, formatOutOfRange(outOfRange)),
        });

        // 공용 캐시는 이번 동기화로 실제로 바뀐 만큼만 비운다(2026-10-15 S3) — 바뀐 게 없으면 본인 프로필만
        const gradeChanged =
            grades !== null &&
            (grades.grade_basic !== (user.stats?.gradeBasic ?? null) ||
                grades.grade_recital !== (user.stats?.gradeRecital ?? null));
        revalidateTag(getUserProfileTag(user.id), "max");
        if (changedChartIds.length > CHART_TAG_REVALIDATE_LIMIT) {
            revalidateTag(CACHE_TAGS.chartRankings, "max");
        } else {
            for (const chartId of changedChartIds)
                revalidateTag(getChartRankingTag(chartId), "max");
        }
        // 전체 랭킹 = Grd · 기록에서 나온 레이팅
        if (gradeChanged || changedChartIds.length > 0)
            revalidateTag(CACHE_TAGS.userRankings, "max");
        // 모든 프로필 = 각자의 Grd 순위 · 업적 달성 인원
        if (gradeChanged || newAchievements.length > 0)
            revalidateTag(CACHE_TAGS.userProfiles, "max");
        // 빙고 · 악곡 정보는 곡 목록이 바뀐 경우만
        if (catalogUpdates.applied > 0) {
            revalidateTag(CACHE_TAGS.bingos, "max");
            revalidateTag(CACHE_TAGS.musicCatalog, "max");
            revalidateTag(CACHE_TAGS.musicDetails, "max");
        }

        // 관리자 동기화만 자켓 없는 곡 목록을 받아 북마클릿이 공식 사이트에서 채운다 — 목록 실패가 동기화 결과를 뒤집지 않게
        const missingJackets = adminSync
            ? await getMissingJacketIndexes().catch((error) => {
                  console.error("Missing jacket lookup failed", error);
                  return [];
              })
            : undefined;

        return json(music ? copy.fullComplete : copy.recentComplete, 200, {
            syncScope: music ? "full" : "recent",
            receivedPlays: history.length,
            insertedPlays,
            changedRecords,
            catalogUpdates,
            newAchievements: newAchievements.length,
            ...(missingJackets ? { missingJackets } : {}),
        });
    } catch (error) {
        console.error("BEMANI data synchronization failed", error);

        await failSyncAttempt(
            syncId,
            error instanceof Error ? error.message : "Unknown error"
        );

        return json(copy.processFailed, 500);
    }
}

export async function OPTIONS(request: NextRequest) {
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
