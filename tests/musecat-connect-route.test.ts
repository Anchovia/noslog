import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined },
    mode: vi.fn(),
    begin: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/features/musecat/server/musecat-mode", () => ({
    getMusecatMode: mocks.mode,
}));
vi.mock("@/features/musecat/server/musecat-connection-service", () => ({
    beginMusecatConnect: mocks.begin,
}));

import { GET } from "@/app/api/musecat/connect/route";

function connect(fetchSite?: string) {
    return GET(
        new NextRequest(
            "https://noslog.test/api/musecat/connect?returnTo=%2Fsettings%3Fcategory%3Dconnections",
            fetchSite ? { headers: { "sec-fetch-site": fetchSite } } : {}
        )
    );
}

describe("뮤즈캣 연결 시작은 NosLog 화면에서 연 요청만 받는다", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 9;
        mocks.mode.mockReturnValue("live");
        mocks.begin.mockResolvedValue("https://musecat.example/authorize");
    });

    it("다른 사이트에서 온 요청은 연결을 시작하지 않고 돌아갈 곳으로 303", async () => {
        for (const site of ["cross-site", "same-site"]) {
            const response = await connect(site);
            expect(response.status).toBe(303);
            expect(response.headers.get("location")).toBe(
                "https://noslog.test/settings?category=connections"
            );
        }
        expect(mocks.begin).not.toHaveBeenCalled();
    });

    it("같은 출처 · 주소창 · 헤더 없는 옛 브라우저는 지금처럼 시작한다", async () => {
        for (const site of ["same-origin", "none", undefined]) {
            const response = await connect(site);
            expect(response.status).toBe(303);
            expect(response.headers.get("location")).toBe(
                "https://musecat.example/authorize"
            );
        }
        expect(mocks.begin).toHaveBeenCalledTimes(3);
        expect(mocks.begin).toHaveBeenCalledWith(
            "/settings?category=connections"
        );
    });
});
