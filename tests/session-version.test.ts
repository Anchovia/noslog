import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: {} as Record<string, unknown>,
    findUnique: vi.fn(),
    update: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("react", async (original) => ({
    ...(await original<typeof import("react")>()),
    cache: <T>(fn: T) => fn,
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => ({
    default: { user: { findUnique: mocks.findUnique, update: mocks.update } },
}));

import { revokeUserSessions } from "@/features/users/server/user-session-service";
import { getSessionUser } from "@/lib/user";

describe("세션 버전", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session = { id: 1, profileCompleted: true };
        mocks.findUnique.mockResolvedValue({
            id: 1,
            role: "user",
            sessionVersion: 0,
        });
    });

    it("버전이 없는 기존 쿠키는 0 으로 보고 통과시킨다", async () => {
        const { session, user } = await getSessionUser();
        expect(user?.id).toBe(1);
        expect(session.id).toBe(1);
    });

    it("버전이 다르면 로그아웃으로 돌려준다", async () => {
        mocks.findUnique.mockResolvedValue({
            id: 1,
            role: "user",
            sessionVersion: 1,
        });
        const { session, user } = await getSessionUser();
        expect(user).toBeNull();
        expect(session.id).toBeUndefined();
    });

    it("버전이 같으면 통과시킨다", async () => {
        mocks.session.sessionVersion = 3;
        mocks.findUnique.mockResolvedValue({
            id: 1,
            role: "user",
            sessionVersion: 3,
        });
        expect((await getSessionUser()).user?.id).toBe(1);
    });

    it.each([
        [undefined, "user"],
        [false, "user"],
        [true, "admin"],
    ])("mfa %s 인 관리자의 역할은 %s", async (mfa, role) => {
        mocks.session.discordMfaEnabled = mfa;
        mocks.findUnique.mockResolvedValue({
            id: 1,
            role: "admin",
            sessionVersion: 0,
        });
        expect((await getSessionUser()).user?.role).toBe(role);
    });

    it("끊는 함수는 버전을 올리고 기록을 남긴다", async () => {
        const log = vi.spyOn(console, "warn").mockImplementation(() => {});
        await revokeUserSessions(5);
        expect(mocks.update).toHaveBeenCalledWith({
            where: { id: 5 },
            data: { sessionVersion: { increment: 1 } },
            select: { id: true },
        });
        expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({
            event: "auth.sessions-revoked",
            targetUserId: 5,
        });
        log.mockRestore();
    });
});
