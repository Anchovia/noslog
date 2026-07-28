import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    queryRaw: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: {
        $queryRaw: mocks.queryRaw,
    },
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("DB 연결이 정상이면 최소 상태 정보만 반환한다", async () => {
        mocks.queryRaw.mockResolvedValue([{ "?column?": 1 }]);

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe("no-store");
        expect(body).toEqual(
            expect.objectContaining({
                status: "ok",
                database: "reachable",
            })
        );
        expect(body).not.toHaveProperty("databaseUrl");
    });

    it("DB 연결 실패 시 상세 오류를 노출하지 않고 503을 반환한다", async () => {
        const error = new Error("connection secret");
        mocks.queryRaw.mockRejectedValue(error);

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(503);
        expect(response.headers.get("retry-after")).toBe("30");
        expect(body).toEqual(
            expect.objectContaining({
                status: "unavailable",
                database: "unreachable",
            })
        );
        expect(JSON.stringify(body)).not.toContain("connection secret");
        expect(mocks.logServerError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({
                event: "health.database.unreachable",
            })
        );
    });
});
