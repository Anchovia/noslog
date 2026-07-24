import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));

import { proxy } from "@/proxy";

describe("점검 모드", () => {
    const originalMaintenanceMode = process.env.MAINTENANCE_MODE;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.MAINTENANCE_MODE = "true";
    });

    afterEach(() => {
        if (originalMaintenanceMode === undefined) {
            delete process.env.MAINTENANCE_MODE;
        } else {
            process.env.MAINTENANCE_MODE = originalMaintenanceMode;
        }
    });

    it("일반 페이지를 503 점검 화면으로 전환한다", async () => {
        const response = await proxy(
            new NextRequest("https://noslog.app/music?category=bemani")
        );

        expect(response?.status).toBe(503);
        expect(response?.headers.get("x-middleware-rewrite")).toBe(
            "https://noslog.app/maintenance"
        );
        expect(response?.headers.get("Cache-Control")).toBe("no-store");
        expect(mocks.getSession).not.toHaveBeenCalled();
    });

    it("API 요청에는 503 JSON을 반환한다", async () => {
        const response = await proxy(
            new NextRequest("https://noslog.app/api/rankings")
        );

        expect(response?.status).toBe(503);
        await expect(response?.json()).resolves.toEqual({
            message: "현재 서비스 점검 중입니다.",
        });
        expect(response?.headers.get("Retry-After")).toBe("3600");
    });

    it.each(["/maintenance", "/login", "/discord/start", "/admin"])(
        "%s 경로는 점검 중에도 허용한다",
        async (pathname) => {
            mocks.getSession.mockResolvedValue({});

            const response = await proxy(
                new NextRequest(`https://noslog.app${pathname}`)
            );

            expect(response).toBeUndefined();
            expect(mocks.getSession).not.toHaveBeenCalled();
        }
    );
});
