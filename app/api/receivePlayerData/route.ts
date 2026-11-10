import { NextRequest, NextResponse } from "next/server";

import { getMissingJacketIndexes } from "@/features/music/server/jacket-collection-service";
import {
    type SyncMusicInput,
    syncRequestSchema,
} from "@/features/sync/schemas/sync-request-schema";
import {
    isWithinChartLimits,
    loadChartLimits,
} from "@/features/sync/server/chart-limits";
import {
    eagateCorsHeaders,
    eagateOptions,
    readEagateJson,
} from "@/features/sync/server/eagate-request";
import { runSync } from "@/features/sync/server/run-sync";
import {
    createSyncAttempt,
    failSyncAttempt,
    getSyncUser,
} from "@/features/sync/server/sync-attempt-data";
import { hasDuplicateCharts } from "@/features/sync/server/sync-filters";
import { revalidateSyncCaches } from "@/features/sync/server/sync-revalidate";
import { isSyncTokenExpired, verifySyncToken } from "@/lib/bookmarklet";
import { type Locale, resolveLocale } from "@/lib/i18n/routing";

const MAX_SYNC_BODY_BYTES = 8 * 1024 * 1024;
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
    return responseCopy[resolveLocale(locale)];
}

function json(
    message: string,
    status: number,
    data: Record<string, unknown> = {},
    headers: HeadersInit = {}
) {
    return NextResponse.json(
        { message, ...data },
        { status, headers: { ...eagateCorsHeaders(), ...headers } }
    );
}

export async function POST(request: NextRequest) {
    const copy = getResponseCopy(request);

    const read = await readEagateJson(request, MAX_SYNC_BODY_BYTES);
    if (!read.ok) {
        return json(copy[read.reason], read.status);
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
        const result = await runSync({
            userId: user.id,
            syncAttempt,
            player,
            history,
            historyInRange,
            music,
            chartLimits,
            adminSync,
        });
        const {
            insertedPlays,
            changedRecords,
            catalogUpdates,
            newAchievements,
        } = result;

        revalidateSyncCaches(user, result);

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
    return eagateOptions(request);
}
