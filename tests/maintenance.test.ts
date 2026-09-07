import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));

import { proxy } from "@/proxy";
import { getMaintenanceConfig } from "@/features/recovery/server/maintenanceConfig";

describe("점검 모드", () => {
    const originalMaintenanceMode = process.env.MAINTENANCE_MODE;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.MAINTENANCE_MODE = "true";
        vi.stubEnv("MAINTENANCE_EXPECTED_END_AT", "");
        vi.stubEnv("MAINTENANCE_UPDATED_AT", "");
        vi.stubEnv("MAINTENANCE_RETRY_AFTER_SECONDS", "");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
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
        await expect(response?.json()).resolves.toMatchObject({
            isSuccess: false,
            code: "MAINTENANCE",
            result: null,
            message: expect.any(String),
        });
        expect(response?.headers.get("Retry-After")).toBeNull();
    });

    it.each(["/login", "/discord/start", "/admin"])(
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

    it.each(["ko", "ja", "en"])(
        "%s maintenance preserves locale for pages and APIs",
        async (locale) => {
            const page = await proxy(
                new NextRequest(`https://noslog.app/${locale}/maintenance`)
            );
            expect(page?.status).toBe(503);
            expect(
                page?.headers.get("x-middleware-request-x-noslog-locale")
            ).toBe(locale);
            const api = await proxy(
                new NextRequest("https://noslog.app/api/rankings", {
                    headers: { "accept-language": locale },
                })
            );
            const message = (await api!.json()).message;
            expect(message).toBe(
                locale === "ko"
                    ? "더 안정적인 서비스를 위해 잠시 점검하고 있습니다. 잠시 후 다시 이용해주세요."
                    : locale === "ja"
                      ? "より安定したサービス提供のため、現在メンテナンスを実施しています。しばらくしてからご利用ください。"
                      : "We're briefly improving service stability. Please try again soon."
            );
        }
    );

    it("uses a real maintained future end, not an expired or fabricated promise", () => {
        const now = new Date("2026-09-07T00:00:00Z");
        expect(
            getMaintenanceConfig(
                {
                    MAINTENANCE_EXPECTED_END_AT: "2026-09-07T10:00:00+09:00",
                    MAINTENANCE_UPDATED_AT: "2026-09-07T08:00:00+09:00",
                },
                now
            )
        ).toEqual({
            expectedEnd: "2026-09-07T10:00:00+09:00",
            updatedAt: "2026-09-07T08:00:00+09:00",
            retryAfter: "Mon, 07 Sep 2026 01:00:00 GMT",
        });
        expect(
            getMaintenanceConfig(
                {
                    MAINTENANCE_EXPECTED_END_AT: "2026-09-06T10:00:00+09:00",
                    MAINTENANCE_UPDATED_AT: "tomorrow",
                },
                now
            )
        ).toEqual({ expectedEnd: null, updatedAt: null, retryAfter: null });
        expect(
            getMaintenanceConfig(
                { MAINTENANCE_RETRY_AFTER_SECONDS: "120" },
                now
            ).retryAfter
        ).toBe("120");
        expect(
            getMaintenanceConfig(
                {
                    MAINTENANCE_RETRY_AFTER_SECONDS: "-1",
                    MAINTENANCE_EXPECTED_END_AT: "invalid",
                },
                now
            ).retryAfter
        ).toBeNull();
    });
});
