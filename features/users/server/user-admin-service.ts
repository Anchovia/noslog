import { revalidatePath } from "next/cache";

import { hasRecentDeletionVerification } from "@/features/settings/schemas/deletion-verification";
import {
    type UserAdminFilters,
    type UserRole,
    userRoleUpdateInputFromFormData,
    userRoleUpdateSchema,
    userSyncTokenResetInputFromFormData,
    userSyncTokenResetSchema,
} from "@/features/users/schemas/user-admin-schema";
import type {
    AdminUserList,
    AdminUserRow,
} from "@/features/users/types/user-admin";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import { getUserSyncHealth } from "@/lib/admin/sync-health";
import db from "@/lib/db";
import { logSecurityEvent, logServerError } from "@/lib/observability/server";
import { formatKstMinute } from "@/lib/player-stats";
import getSession from "@/lib/session";

type ReauthenticationRequired = {
    success: false;
    message: string;
    reauthenticationRequired: true;
};
type UserRoleUpdateResult =
    ActionResult<{ role: UserRole }> | ReauthenticationRequired;
type UserSyncTokenResetResult =
    ActionResult<{ syncTokenVersion: number }> | ReauthenticationRequired;

function logUserAdminError(
    error: unknown,
    event: string,
    routeType = "action"
) {
    logServerError(error, {
        event,
        routePath: "/admin/users",
        routeType,
    });
}

const REAUTHENTICATION_REQUIRED = {
    success: false as const,
    message: "Discord로 다시 인증한 뒤 다시 눌러주세요.",
    reauthenticationRequired: true,
};

async function hasRecentAdminVerification(adminId: number) {
    const [session, admin] = await Promise.all([
        getSession(),
        db.user.findUnique({
            where: { id: adminId },
            select: { discordId: true },
        }),
    ]);
    return hasRecentDeletionVerification(
        session.adminVerification,
        adminId,
        admin?.discordId ?? null
    );
}

function refreshAdminUsers() {
    revalidatePath("/admin/users");
}

export async function listAdminUsers(
    filters: UserAdminFilters,
    now = new Date()
): Promise<AdminUserList> {
    await requireAdmin();

    try {
        const users = await db.user.findMany({
            where: filters.q
                ? {
                      OR: [
                          { username: { contains: filters.q } },
                          { nostalgiaName: { contains: filters.q } },
                          { discordName: { contains: filters.q } },
                          { discordUsername: { contains: filters.q } },
                      ],
                  }
                : undefined,
            select: {
                id: true,
                username: true,
                nostalgiaName: true,
                country: true,
                role: true,
                // 플레이 수 · 마지막 플레이는 player_stats 에서(2026-10-16 DB 재설계 P4)
                stats: { select: { playCount: true, lastPlayedAt: true } },
                syncTokenVersion: true,
                createdAt: true,
                dataSyncs: {
                    select: { status: true, startedAt: true },
                    orderBy: { startedAt: "desc" },
                    take: 1,
                },
                _count: {
                    select: {
                        dataSyncs: true,
                        playData: true,
                        chartPlayHistory: true,
                        // 「평가」 는 지금 쓰는 채보 의견 · 평가(옛 ChartEvaluation 은 지웠다, 2026-10-16 D6)
                        communityEvaluations: true,
                        examAchievements: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
            take: 100,
        });
        const userIds = users.map((user) => user.id);
        const [
            judgementGroups,
            noteRateGroups,
            recentJudgementGroups,
            recentFastSlowGroups,
        ] = await Promise.all([
            db.playData.groupBy({
                by: ["userId"],
                where: {
                    userId: { in: userIds },
                    judgeSjust: { not: null },
                    judgeJust: { not: null },
                    judgeGood: { not: null },
                    judgeMiss: { not: null },
                    judgeNear: { not: null },
                },
                _count: { _all: true },
            }),
            db.playData.groupBy({
                by: ["userId"],
                where: {
                    userId: { in: userIds },
                    noteRateStandard: { not: null },
                },
                _count: { _all: true },
            }),
            db.chartPlayHistory.groupBy({
                by: ["userId"],
                where: {
                    userId: { in: userIds },
                    judgeSjust: { not: null },
                    judgeJust: { not: null },
                    judgeGood: { not: null },
                    judgeMiss: { not: null },
                    judgeNear: { not: null },
                },
                _count: { _all: true },
            }),
            db.chartPlayHistory.groupBy({
                by: ["userId"],
                where: {
                    userId: { in: userIds },
                    fastCount: { not: null },
                    slowCount: { not: null },
                },
                _count: { _all: true },
            }),
        ]);
        const judgementByUser = new Map(
            judgementGroups.map((row) => [row.userId, row._count._all] as const)
        );
        const noteRateByUser = new Map(
            noteRateGroups.map((row) => [row.userId, row._count._all] as const)
        );
        const recentJudgementByUser = new Map(
            recentJudgementGroups.map(
                (row) => [row.userId, row._count._all] as const
            )
        );
        const recentFastSlowByUser = new Map(
            recentFastSlowGroups.map(
                (row) => [row.userId, row._count._all] as const
            )
        );
        const userRows: AdminUserRow[] = users.map((user) => {
            const latestSync = user.dataSyncs[0] ?? null;
            const judgementRecords = judgementByUser.get(user.id) ?? 0;
            const noteRateRecords = noteRateByUser.get(user.id) ?? 0;

            return {
                id: user.id,
                name: user.nostalgiaName ?? user.username ?? `유저 ${user.id}`,
                country: user.country,
                role: user.role === "admin" ? "admin" : "user",
                playCount: user.stats?.playCount ?? 0,
                nostalgiaLastPlaytime: formatKstMinute(
                    user.stats?.lastPlayedAt
                ),
                syncTokenVersion: user.syncTokenVersion,
                createdAt: user.createdAt.toISOString(),
                latestSyncAt: latestSync?.startedAt.toISOString() ?? null,
                counts: {
                    dataSyncs: user._count.dataSyncs,
                    playData: user._count.playData,
                    recentPlayHistory: user._count.chartPlayHistory,
                    chartEvaluations: user._count.communityEvaluations,
                    examAchievements: user._count.examAchievements,
                },
                coverage: {
                    judgementRecords,
                    noteRateRecords,
                    recentJudgementRecords:
                        recentJudgementByUser.get(user.id) ?? 0,
                    recentFastSlowRecords:
                        recentFastSlowByUser.get(user.id) ?? 0,
                },
                health: getUserSyncHealth(
                    {
                        latestStatus: latestSync?.status ?? null,
                        latestStartedAt: latestSync?.startedAt ?? null,
                        totalRecords: user._count.playData,
                        judgementRecords,
                        noteRateRecords,
                    },
                    now
                ),
            };
        });
        const attentionCount = userRows.filter(
            ({ health }) => health.needsAttention
        ).length;

        return {
            totalCount: userRows.length,
            attentionCount,
            users:
                filters.state === "attention"
                    ? userRows.filter(({ health }) => health.needsAttention)
                    : userRows,
        };
    } catch (error) {
        logUserAdminError(error, "admin.user.list.failed", "page");
        throw error;
    }
}

export async function updateAdminUserRole(
    formData: FormData
): Promise<UserRoleUpdateResult> {
    const admin = await requireAdmin();
    const result = userRoleUpdateSchema.safeParse(
        userRoleUpdateInputFromFormData(formData)
    );
    if (!result.success) {
        return actionValidationFailure(result.error, {
            message: "사용자 권한 변경 요청을 확인해주세요.",
            preferFirstIssue: true,
            fieldPath: false,
        });
    }
    const input = result.data;
    if (admin.id === input.userId && input.role !== "admin") {
        return {
            success: false,
            message: "자신의 관리자 권한은 해제할 수 없습니다.",
        };
    }

    try {
        if (!(await hasRecentAdminVerification(admin.id)))
            return REAUTHENTICATION_REQUIRED;

        const user = await db.user.findUnique({
            where: { id: input.userId },
            select: { id: true },
        });
        if (!user) {
            return { success: false, message: "사용자를 찾을 수 없습니다." };
        }

        await db.user.update({
            where: { id: user.id },
            data: { role: input.role },
        });
        logSecurityEvent({
            event: "admin.user.role-changed",
            actorUserId: admin.id,
            targetUserId: user.id,
            role: input.role,
        });
    } catch (error) {
        logUserAdminError(error, "admin.user.role-update.failed");
        return {
            success: false,
            message: "사용자 권한을 변경하지 못했습니다.",
        };
    }

    refreshAdminUsers();
    return {
        success: true,
        message:
            input.role === "admin"
                ? "관리자 권한을 부여했습니다."
                : "관리자 권한을 해제했습니다.",
        role: input.role,
    };
}

export async function resetAdminUserSyncToken(
    formData: FormData
): Promise<UserSyncTokenResetResult> {
    const admin = await requireAdmin();
    const result = userSyncTokenResetSchema.safeParse(
        userSyncTokenResetInputFromFormData(formData)
    );
    if (!result.success) {
        return actionValidationFailure(result.error, {
            message: "연동 토큰 초기화 요청을 확인해주세요.",
            preferFirstIssue: true,
            fieldPath: false,
        });
    }

    let syncTokenVersion: number;
    try {
        if (!(await hasRecentAdminVerification(admin.id)))
            return REAUTHENTICATION_REQUIRED;

        const user = await db.user.findUnique({
            where: { id: result.data.userId },
            select: { id: true },
        });
        if (!user) {
            return { success: false, message: "사용자를 찾을 수 없습니다." };
        }

        const updated = await db.user.update({
            where: { id: user.id },
            data: { syncTokenVersion: { increment: 1 } },
            select: { syncTokenVersion: true },
        });
        syncTokenVersion = updated.syncTokenVersion;
        logSecurityEvent({
            event: "admin.user.sync-token-reset",
            actorUserId: admin.id,
            targetUserId: user.id,
        });
    } catch (error) {
        logUserAdminError(error, "admin.user.sync-token-reset.failed");
        return {
            success: false,
            message: "연동 토큰을 초기화하지 못했습니다.",
        };
    }

    refreshAdminUsers();
    return {
        success: true,
        message: "연동 토큰을 초기화했습니다.",
        syncTokenVersion,
    };
}
