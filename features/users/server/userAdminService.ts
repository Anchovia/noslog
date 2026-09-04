import { revalidatePath } from "next/cache";

import {
    userRoleUpdateInputFromFormData,
    userRoleUpdateSchema,
    userSyncTokenResetInputFromFormData,
    userSyncTokenResetSchema,
    type UserAdminFilters,
    type UserRole,
} from "@/features/users/schemas/userAdminSchema";
import type {
    AdminUserList,
    AdminUserRow,
} from "@/features/users/types/userAdmin";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { getUserSyncHealth } from "@/lib/admin/syncHealth";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type UserRoleUpdateResult = ActionResult<{ role: UserRole }>;
type UserSyncTokenResetResult = ActionResult<{ syncTokenVersion: number }>;

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
                          { nostalgia_name: { contains: filters.q } },
                          { discord_name: { contains: filters.q } },
                          { discord_username: { contains: filters.q } },
                      ],
                  }
                : undefined,
            select: {
                id: true,
                username: true,
                nostalgia_name: true,
                country: true,
                role: true,
                play_count: true,
                nostalgia_last_playtime: true,
                sync_token_version: true,
                created_at: true,
                dataSyncs: {
                    select: { status: true, started_at: true },
                    orderBy: { started_at: "desc" },
                    take: 1,
                },
                _count: {
                    select: {
                        dataSyncs: true,
                        PlayData: true,
                        chartPlayHistory: true,
                        chartEvaluations: true,
                        examAchievements: true,
                    },
                },
            },
            orderBy: { updated_at: "desc" },
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
                by: ["user_id"],
                where: {
                    user_id: { in: userIds },
                    judge_sjust: { not: null },
                    judge_just: { not: null },
                    judge_good: { not: null },
                    judge_miss: { not: null },
                    judge_near: { not: null },
                },
                _count: { _all: true },
            }),
            db.playData.groupBy({
                by: ["user_id"],
                where: {
                    user_id: { in: userIds },
                    note_rate_standard: { not: null },
                },
                _count: { _all: true },
            }),
            db.chartPlayHistory.groupBy({
                by: ["user_id"],
                where: {
                    user_id: { in: userIds },
                    judge_sjust: { not: null },
                    judge_just: { not: null },
                    judge_good: { not: null },
                    judge_miss: { not: null },
                    judge_near: { not: null },
                },
                _count: { _all: true },
            }),
            db.chartPlayHistory.groupBy({
                by: ["user_id"],
                where: {
                    user_id: { in: userIds },
                    fast_count: { not: null },
                    slow_count: { not: null },
                },
                _count: { _all: true },
            }),
        ]);
        const judgementByUser = new Map(
            judgementGroups.map(
                (row) => [row.user_id, row._count._all] as const
            )
        );
        const noteRateByUser = new Map(
            noteRateGroups.map((row) => [row.user_id, row._count._all] as const)
        );
        const recentJudgementByUser = new Map(
            recentJudgementGroups.map(
                (row) => [row.user_id, row._count._all] as const
            )
        );
        const recentFastSlowByUser = new Map(
            recentFastSlowGroups.map(
                (row) => [row.user_id, row._count._all] as const
            )
        );
        const userRows: AdminUserRow[] = users.map((user) => {
            const latestSync = user.dataSyncs[0] ?? null;
            const judgementRecords = judgementByUser.get(user.id) ?? 0;
            const noteRateRecords = noteRateByUser.get(user.id) ?? 0;

            return {
                id: user.id,
                name: user.nostalgia_name ?? user.username ?? `유저 ${user.id}`,
                country: user.country,
                role: user.role === "admin" ? "admin" : "user",
                playCount: user.play_count ?? 0,
                nostalgiaLastPlaytime: user.nostalgia_last_playtime,
                syncTokenVersion: user.sync_token_version,
                createdAt: user.created_at.toISOString(),
                latestSyncAt: latestSync?.started_at.toISOString() ?? null,
                counts: {
                    dataSyncs: user._count.dataSyncs,
                    playData: user._count.PlayData,
                    recentPlayHistory: user._count.chartPlayHistory,
                    chartEvaluations: user._count.chartEvaluations,
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
                        latestStartedAt: latestSync?.started_at ?? null,
                        totalRecords: user._count.PlayData,
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
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "사용자 권한 변경 요청을 확인해주세요.",
        };
    }
    const input = result.data;
    if (admin.id === input.userId && input.role !== "admin") {
        return {
            success: false,
            message: "자신의 관리자 권한은 해제할 수 없습니다.",
        };
    }

    try {
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
    await requireAdmin();
    const result = userSyncTokenResetSchema.safeParse(
        userSyncTokenResetInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "연동 토큰 초기화 요청을 확인해주세요.",
        };
    }

    let syncTokenVersion: number;
    try {
        const user = await db.user.findUnique({
            where: { id: result.data.userId },
            select: { id: true },
        });
        if (!user) {
            return { success: false, message: "사용자를 찾을 수 없습니다." };
        }

        const updated = await db.user.update({
            where: { id: user.id },
            data: { sync_token_version: { increment: 1 } },
            select: { sync_token_version: true },
        });
        syncTokenVersion = updated.sync_token_version;
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
