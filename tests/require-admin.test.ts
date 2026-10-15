import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSessionUser: vi.fn(),
    redirect: vi.fn(() => {
        throw new Error("redirect");
    }),
    notFound: vi.fn(() => {
        throw new Error("notFound");
    }),
}));

vi.mock("@/lib/user", () => ({ getSessionUser: mocks.getSessionUser }));
vi.mock("next/navigation", () => ({
    redirect: mocks.redirect,
    notFound: mocks.notFound,
}));

import { requireAdmin } from "@/lib/admin";

const admin = {
    id: 1,
    username: "admin",
    nostalgia_name: "ADMIN",
    avatar: null,
    role: "admin",
    hide_play_scores: false,
};

describe("관리자 권한 검사", () => {
    beforeEach(() => vi.clearAllMocks());

    it("로그인하지 않았으면 로그인으로 보낸다", async () => {
        mocks.getSessionUser.mockResolvedValue({ session: {}, user: null });
        await expect(requireAdmin()).rejects.toThrow("redirect");
        expect(mocks.redirect).toHaveBeenCalledWith("/login");
    });

    it("관리자가 아니면 404", async () => {
        mocks.getSessionUser.mockResolvedValue({
            session: { id: 2 },
            user: { ...admin, id: 2, role: "user" },
        });
        await expect(requireAdmin()).rejects.toThrow("notFound");
    });

    it("요청 캐시의 사용자를 쓰고 필요한 칸만 돌려준다(2026-10-15 CORE-15)", async () => {
        mocks.getSessionUser.mockResolvedValue({
            session: { id: 1 },
            user: admin,
        });
        expect(await requireAdmin()).toEqual({
            id: 1,
            username: "admin",
            nostalgia_name: "ADMIN",
            avatar: null,
            role: "admin",
        });
    });
});
