import { describe, expect, it, vi } from "vitest";

import {
    createServerErrorEvent,
    logServerError,
} from "@/lib/observability/server";

describe("서버 오류 관측", () => {
    it("요청 쿼리와 헤더 없이 구조화된 오류를 만든다", () => {
        const error = Object.assign(new Error("database failed"), {
            digest: "digest-123",
        });
        const event = createServerErrorEvent(error, {
            event: "next.request.error",
            method: "GET",
            path: "/music?token=secret#section",
            routePath: "/music",
            routeType: "render",
            routerKind: "App Router",
        });

        expect(event.request).toEqual({
            method: "GET",
            path: "/music",
        });
        expect(event.error).toEqual({
            name: "Error",
            message: "database failed",
            digest: "digest-123",
        });
        expect(JSON.stringify(event)).not.toContain("secret");
    });

    it("한 줄 JSON 로그로 기록한다", () => {
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => undefined);

        logServerError(new Error("failed"), {
            event: "health.database.unreachable",
            path: "/api/health",
        });

        expect(consoleError).toHaveBeenCalledTimes(1);
        expect(() =>
            JSON.parse(String(consoleError.mock.calls[0]?.[0]))
        ).not.toThrow();
        consoleError.mockRestore();
    });
});
