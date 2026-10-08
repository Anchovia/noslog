export const STALE_SYNC_THRESHOLD_MS = 10 * 60 * 1000;

export type SyncHealthTone =
    "healthy" | "processing" | "warning" | "danger" | "muted";

export interface SyncHealth {
    label: string;
    tone: SyncHealthTone;
    needsAttention: boolean;
}

interface SyncAttemptHealthInput {
    status: string;
    startedAt: Date;
    insertedPlays: number;
    changedRecords: number;
    playHistoryCount: number;
    snapshotCount: number;
}

interface UserSyncHealthInput {
    latestStatus: string | null;
    latestStartedAt: Date | null;
    totalRecords: number;
    judgementRecords: number;
    noteRateRecords: number;
}

export function getSyncAttemptHealth(
    input: SyncAttemptHealthInput,
    now = new Date()
): SyncHealth {
    if (input.status === "failed") {
        return { label: "실패", tone: "danger", needsAttention: true };
    }

    if (input.status === "processing") {
        const isStale =
            now.getTime() - input.startedAt.getTime() >=
            STALE_SYNC_THRESHOLD_MS;

        return isStale
            ? { label: "처리 지연", tone: "warning", needsAttention: true }
            : {
                  label: "처리 중",
                  tone: "processing",
                  needsAttention: false,
              };
    }

    if (
        input.insertedPlays !== input.playHistoryCount ||
        input.changedRecords !== input.snapshotCount
    ) {
        return {
            label: "집계 불일치",
            tone: "warning",
            needsAttention: true,
        };
    }

    return { label: "정상", tone: "healthy", needsAttention: false };
}

export function getUserSyncHealth(
    input: UserSyncHealthInput,
    now = new Date()
): SyncHealth {
    if (!input.latestStatus || !input.latestStartedAt) {
        return { label: "미연동", tone: "muted", needsAttention: true };
    }

    if (input.latestStatus === "failed") {
        return {
            label: "최근 동기화 실패",
            tone: "danger",
            needsAttention: true,
        };
    }

    if (input.latestStatus === "processing") {
        const isStale =
            now.getTime() - input.latestStartedAt.getTime() >=
            STALE_SYNC_THRESHOLD_MS;

        return isStale
            ? { label: "동기화 지연", tone: "warning", needsAttention: true }
            : {
                  label: "동기화 중",
                  tone: "processing",
                  needsAttention: false,
              };
    }

    if (input.totalRecords === 0) {
        return {
            label: "전체 기록 없음",
            tone: "warning",
            needsAttention: true,
        };
    }

    if (
        input.judgementRecords < input.totalRecords ||
        input.noteRateRecords < input.totalRecords
    ) {
        return {
            label: "상세 데이터 일부 누락",
            tone: "warning",
            needsAttention: true,
        };
    }

    return { label: "정상", tone: "healthy", needsAttention: false };
}

export function getSyncHealthClassName(tone: SyncHealthTone) {
    if (tone === "healthy") return "bg-success/10 text-success";
    if (tone === "danger") return "bg-danger/10 text-danger";
    if (tone === "warning") return "bg-score/10 text-score";
    if (tone === "processing") return "bg-basic/10 text-basic";
    return "bg-surface-muted text-text-secondary";
}
