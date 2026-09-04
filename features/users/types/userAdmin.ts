import type { UserRole } from "@/features/users/schemas/userAdminSchema";
import type { SyncHealth } from "@/lib/admin/syncHealth";

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
