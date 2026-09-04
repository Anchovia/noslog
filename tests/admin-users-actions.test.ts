import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    userFindMany: vi.fn(),
    userFindUnique: vi.fn(),
    userUpdate: vi.fn(),
    playDataGroupBy: vi.fn(),
    chartPlayHistoryGroupBy: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        user: {
            findMany: mocks.userFindMany,
            findUnique: mocks.userFindUnique,
            update: mocks.userUpdate,
        },
        playData: { groupBy: mocks.playDataGroupBy },
        chartPlayHistory: { groupBy: mocks.chartPlayHistoryGroupBy },
    },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { resetUserSyncToken, updateUserRole } from "@/app/admin/users/actions";
import { listAdminUsers } from "@/features/users/server/userAdminService";

function roleForm(userId = "2", role = "admin") {
    const formData = new FormData();
    formData.set("userId", userId);
    formData.set("role", role);
    return formData;
}

function tokenForm(userId = "2") {
    const formData = new FormData();
    formData.set("userId", userId);
    return formData;
}

describe("관리자 사용자 관리", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.userFindMany.mockResolvedValue([]);
        mocks.userFindUnique.mockResolvedValue({ id: 2 });
        mocks.userUpdate.mockResolvedValue({
            id: 2,
            sync_token_version: 4,
        });
        mocks.playDataGroupBy.mockResolvedValue([]);
        mocks.chartPlayHistoryGroupBy.mockResolvedValue([]);
    });

    it("사용자와 데이터 적재 상태를 관리자 화면용 타입으로 정규화한다", async () => {
        const createdAt = new Date("2026-01-01T00:00:00.000Z");
        const syncedAt = new Date("2026-09-05T00:00:00.000Z");
        mocks.userFindMany.mockResolvedValue([
            {
                id: 2,
                username: "noslog-user",
                nostalgia_name: "NOSTALGIA USER",
                country: "ko-KR",
                role: "user",
                play_count: 20,
                nostalgia_last_playtime: "2026-09-04 12:00",
                sync_token_version: 3,
                created_at: createdAt,
                dataSyncs: [{ status: "completed", started_at: syncedAt }],
                _count: {
                    dataSyncs: 4,
                    PlayData: 2,
                    chartPlayHistory: 3,
                    chartEvaluations: 1,
                    examAchievements: 1,
                },
            },
        ]);
        mocks.playDataGroupBy
            .mockResolvedValueOnce([{ user_id: 2, _count: { _all: 2 } }])
            .mockResolvedValueOnce([{ user_id: 2, _count: { _all: 2 } }]);
        mocks.chartPlayHistoryGroupBy
            .mockResolvedValueOnce([{ user_id: 2, _count: { _all: 3 } }])
            .mockResolvedValueOnce([{ user_id: 2, _count: { _all: 2 } }]);

        await expect(
            listAdminUsers(
                { q: "NOSTALGIA", state: "all" },
                new Date("2026-09-05T01:00:00.000Z")
            )
        ).resolves.toEqual({
            totalCount: 1,
            attentionCount: 0,
            users: [
                {
                    id: 2,
                    name: "NOSTALGIA USER",
                    country: "ko-KR",
                    role: "user",
                    playCount: 20,
                    nostalgiaLastPlaytime: "2026-09-04 12:00",
                    syncTokenVersion: 3,
                    createdAt: createdAt.toISOString(),
                    latestSyncAt: syncedAt.toISOString(),
                    counts: {
                        dataSyncs: 4,
                        playData: 2,
                        recentPlayHistory: 3,
                        chartEvaluations: 1,
                        examAchievements: 1,
                    },
                    coverage: {
                        judgementRecords: 2,
                        noteRateRecords: 2,
                        recentJudgementRecords: 3,
                        recentFastSlowRecords: 2,
                    },
                    health: {
                        label: "정상",
                        tone: "healthy",
                        needsAttention: false,
                    },
                },
            ],
        });
        expect(mocks.userFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    OR: [
                        { username: { contains: "NOSTALGIA" } },
                        { nostalgia_name: { contains: "NOSTALGIA" } },
                        { discord_name: { contains: "NOSTALGIA" } },
                        { discord_username: { contains: "NOSTALGIA" } },
                    ],
                },
                take: 100,
            })
        );
    });

    it("점검 필요 필터는 문제가 있는 사용자만 반환한다", async () => {
        mocks.userFindMany.mockResolvedValue([
            {
                id: 2,
                username: "noslog-user",
                nostalgia_name: null,
                country: "ko-KR",
                role: "user",
                play_count: null,
                nostalgia_last_playtime: null,
                sync_token_version: 0,
                created_at: new Date("2026-01-01T00:00:00.000Z"),
                dataSyncs: [],
                _count: {
                    dataSyncs: 0,
                    PlayData: 0,
                    chartPlayHistory: 0,
                    chartEvaluations: 0,
                    examAchievements: 0,
                },
            },
        ]);

        const result = await listAdminUsers({ q: "", state: "attention" });

        expect(result.totalCount).toBe(1);
        expect(result.attentionCount).toBe(1);
        expect(result.users).toHaveLength(1);
        expect(result.users[0]?.health.label).toBe("미연동");
    });

    it("다른 사용자에게 관리자 권한을 부여한다", async () => {
        await expect(updateUserRole(roleForm())).resolves.toEqual({
            success: true,
            message: "관리자 권한을 부여했습니다.",
            role: "admin",
        });
        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 2 },
            data: { role: "admin" },
        });
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/users");
    });

    it("관리자는 자신의 관리자 권한을 해제할 수 없다", async () => {
        await expect(updateUserRole(roleForm("1", "user"))).resolves.toEqual({
            success: false,
            message: "자신의 관리자 권한은 해제할 수 없습니다.",
        });
        expect(mocks.userFindUnique).not.toHaveBeenCalled();
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("잘못된 권한 변경 요청은 사용자를 조회하지 않는다", async () => {
        await expect(updateUserRole(roleForm("0"))).resolves.toEqual({
            success: false,
            message: "잘못된 사용자입니다.",
        });
        expect(mocks.userFindUnique).not.toHaveBeenCalled();
    });

    it("사용자의 연동 토큰 버전을 증가시킨다", async () => {
        await expect(resetUserSyncToken(tokenForm())).resolves.toEqual({
            success: true,
            message: "연동 토큰을 초기화했습니다.",
            syncTokenVersion: 4,
        });
        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 2 },
            data: { sync_token_version: { increment: 1 } },
            select: { sync_token_version: true },
        });
    });

    it("존재하지 않는 사용자의 토큰을 변경하지 않는다", async () => {
        mocks.userFindUnique.mockResolvedValue(null);

        await expect(resetUserSyncToken(tokenForm())).resolves.toEqual({
            success: false,
            message: "사용자를 찾을 수 없습니다.",
        });
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("권한 저장 실패를 기록하고 사용자 오류로 반환한다", async () => {
        const error = new Error("database unavailable");
        mocks.userUpdate.mockRejectedValue(error);

        await expect(updateUserRole(roleForm())).resolves.toEqual({
            success: false,
            message: "사용자 권한을 변경하지 못했습니다.",
        });
        expect(mocks.logServerError).toHaveBeenCalledWith(error, {
            event: "admin.user.role-update.failed",
            routePath: "/admin/users",
            routeType: "action",
        });
    });
});
