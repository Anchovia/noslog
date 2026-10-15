import type { UserRole } from "@/features/users/schemas/user-admin-schema";
import type { SyncHealth } from "@/lib/admin/sync-health";

export interface AdminUserRow {
    country: string;
    counts: {
        chartEvaluations: number;
        dataSyncs: number;
        examAchievements: number;
        playData: number;
        recentPlayHistory: number;
    };
    coverage: {
        judgementRecords: number;
        noteRateRecords: number;
        recentFastSlowRecords: number;
        recentJudgementRecords: number;
    };
    createdAt: string;
    health: SyncHealth;
    id: number;
    latestSyncAt: string | null;
    name: string;
    nostalgiaLastPlaytime: string | null;
    playCount: number;
    role: UserRole;
    syncTokenVersion: number;
}

export interface AdminUserList {
    attentionCount: number;
    totalCount: number;
    users: AdminUserRow[];
}
