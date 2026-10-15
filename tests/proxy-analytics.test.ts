import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    userFindUnique: vi.fn(),
    recordApiCall: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));
vi.mock("@/lib/db", () => ({
    default: { user: { findUnique: mocks.userFindUnique } },
}));
vi.mock("@/lib/analytics", () => ({ recordApiCall: mocks.recordApiCall }));

import { proxy } from "@/proxy";

describe("API 통계 수집", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("MAINTENANCE_MODE", "false");
        mocks.getSession.mockResolvedValue({});
        mocks.userFindUnique.mockResolvedValue({ locale: "ko", role: "user" });
        mocks.recordApiCall.mockResolvedValue(true);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("관리자의 API 호출은 기록하지 않는다", async () => {
        const session = { id: 1, locale: "ko", save: vi.fn() };
        mocks.getSession.mockResolvedValue(session);
        mocks.userFindUnique.mockResolvedValue({
            locale: "ko",
            role: "admin",
        });
        const event = { waitUntil: vi.fn() };

        await proxy(
            new NextRequest("http://localhost:3000/api/rankings"),
            event as never
        );

        expect(mocks.userFindUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            select: { locale: true, role: true },
        });
        expect(mocks.recordApiCall).not.toHaveBeenCalled();
        expect(event.waitUntil).not.toHaveBeenCalled();
        // 역할을 세션에 채워 다음 호출부터는 DB 를 읽지 않는다(2026-10-15 S8)
        expect(session).toMatchObject({ role: "admin" });
        expect(session.save).toHaveBeenCalledOnce();
    });

    it("세션에 역할이 있으면 DB 를 읽지 않는다", async () => {
        mocks.getSession.mockResolvedValue({
            id: 2,
            locale: "ko",
            role: "user",
            save: vi.fn(),
        });
        const event = { waitUntil: vi.fn() };

        await proxy(
            new NextRequest("http://localhost:3000/api/rankings"),
            event as never
        );

        expect(mocks.userFindUnique).not.toHaveBeenCalled();
        expect(mocks.recordApiCall).toHaveBeenCalledWith("/api/rankings");
    });

    it("일반 회원의 API 호출은 응답 뒤에 기록한다", async () => {
        mocks.getSession.mockResolvedValue({
            id: 2,
            locale: "ko",
            save: vi.fn(),
        });
        const event = { waitUntil: vi.fn() };

        await proxy(
            new NextRequest("http://localhost:3000/api/rankings"),
            event as never
        );

        expect(mocks.recordApiCall).toHaveBeenCalledWith("/api/rankings");
        expect(event.waitUntil).toHaveBeenCalledOnce();
    });
});
