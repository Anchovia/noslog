import "server-only";

import { evaluateUserAchievements } from "@/features/achievements/server/achievement-service";
import { updateDummy } from "@/features/bingos/server/seed-default-bingos";
import { processBemaniCatalogUpdates } from "@/features/music/server/catalog-sync";
import { recordProfileRatings } from "@/features/profile/server/profile-rating-history-service";
import { refreshUserPlayerRatings } from "@/features/rankings/server/player-rating-service";
import type {
    SyncMusicInput,
    SyncPlayerProfile,
    SyncRecentHistoryItem,
} from "@/features/sync/schemas/sync-request-schema";
import { loadChartIds } from "@/features/sync/server/chart-ids";
import {
    type ChartLimitMap,
    selectKeptChartIds,
} from "@/features/sync/server/chart-limits";
import {
    completeSyncAttempt,
    type SyncAttemptResult,
} from "@/features/sync/server/sync-attempt-data";
import {
    dropOutOfRangeSheets,
    filterKnownMusic,
    formatOutOfRange,
    formatSkippedCharts,
    joinNotices,
} from "@/features/sync/server/sync-filters";
import {
    keepTodayGrade,
    updateGrade,
} from "@/features/sync/server/update-grade";
import { updatePlayData } from "@/features/sync/server/update-play-data";
import { updatePlayerProfile } from "@/features/sync/server/update-player-profile";
import { updateRecentBestRecords } from "@/features/sync/server/update-recent-best-records";
import { updateRecentPlay } from "@/features/sync/server/update-recent-play";

type SyncRunInput = {
    userId: number;
    syncAttempt: Extract<SyncAttemptResult, { allowed: true }>;
    player: SyncPlayerProfile;
    history: SyncRecentHistoryItem[];
    historyInRange: SyncRecentHistoryItem[];
    music: SyncMusicInput[] | null;
    chartLimits: ChartLimitMap;
    adminSync: boolean;
};

export async function runSync({
    userId,
    syncAttempt,
    player,
    history,
    historyInRange,
    music,
    chartLimits,
    adminSync,
}: SyncRunInput) {
    let outOfRange = history.length - historyInRange.length;
    const syncId = syncAttempt.syncId;
    // 바뀐 기록이 없고 직전 동기화가 끝까지 됐으면 Grd · 랭킹 레이팅을 다시 세지 않는다(2026-10-16 DB 재설계 P4 Q1).
    // 직전 시도가 실패로 끝났으면 기록만 커밋되고 파생 계산 전에 멈췄을 수 있어 예전처럼 다시 센다.
    // 랭킹 레이팅은 서열표를 저장할 때 전원 다시 세므로(rebuildStalePlayerRatings) 기록이 그대로면 값도 그대로다.
    // 프로필 레이팅 이력은 그래프 점이라 예전처럼 동기화마다 남기고, Grd 「하루 한 줄」 은 지금 값으로 남긴다
    const refreshDerived = async (changed: number[]) => {
        if (changed.length === 0 && syncAttempt.previousCompleted) {
            await keepTodayGrade(userId);
            await recordProfileRatings(userId, syncId);
            return null;
        }
        const result = await updateGrade(userId);
        await recordProfileRatings(userId, syncId);
        // 랭킹용 저장 레이팅 — 이 사람만 다시 센다(2026-10-15 L2-A2)
        await refreshUserPlayerRatings(userId);
        return result;
    };

    await updatePlayerProfile(userId, player);

    const { insertedPlays, skippedCharts: skippedRecentCharts } =
        await updateRecentPlay(userId, historyInRange, syncId);
    let changedRecords = 0;
    let changedChartIds: number[] = [];
    let grades: Awaited<ReturnType<typeof updateGrade>> | null = null;
    let syncNotice = formatSkippedCharts(skippedRecentCharts);
    let catalogUpdates = { detected: 0, pending: 0, applied: 0 };
    if (music) {
        const { overLimit, ...catalogCounts } =
            await processBemaniCatalogUpdates(music, adminSync, userId);
        catalogUpdates = catalogCounts;
        if (overLimit > 0)
            console.warn("BEMANI catalog candidates over limit", {
                userId,
                syncId,
                candidates: overLimit,
            });
        // 곡 목록 반영 뒤 채보 지도를 한 번 읽어 확인 · 저장이 같이 쓴다(2026-10-16 Q2 — 예전에는 두 번 더 읽었다)
        const chartIds = await loadChartIds();
        const { knownMusic: registeredMusic, skippedCharts } = filterKnownMusic(
            music,
            chartIds
        );
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
                userId,
                knownMusic,
                syncId,
                chartIds,
                rejectedChartIds.length > 0
                    ? await selectKeptChartIds(userId, rejectedChartIds)
                    : []
            ));
            grades = await refreshDerived(changedChartIds);
            await updateDummy();
        }
    } else {
        ({ changedRecords, changedChartIds } = await updateRecentBestRecords(
            userId,
            syncId
        ));
        grades = await refreshDerived(changedChartIds);
    }

    // 업적 판정(2026-09-24 N1) — 실패해도 동기화 결과는 그대로. 새 단계는 동기화 결과 화면이 달성 시각으로 모아 보인다
    const newAchievements = await evaluateUserAchievements(userId).catch(
        (error) => {
            console.error("Achievement evaluation failed", error);
            return [];
        }
    );

    if (outOfRange > 0)
        console.warn("BEMANI sync values out of chart range", {
            userId,
            syncId,
            rows: outOfRange,
        });
    await completeSyncAttempt(syncId, {
        insertedPlays,
        changedRecords,
        notice: joinNotices(syncNotice, formatOutOfRange(outOfRange)),
    });

    return {
        insertedPlays,
        changedRecords,
        changedChartIds,
        grades,
        catalogUpdates,
        newAchievements,
    };
}
