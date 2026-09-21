import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    userFindUnique: vi.fn(),
    recordPageView: vi.fn(),
    recordExternalCall: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));
vi.mock("@/lib/db", () => ({
    default: { user: { findUnique: mocks.userFindUnique } },
}));
vi.mock("@/lib/analytics", () => ({
    recordPageView: mocks.recordPageView,
    recordExternalCall: mocks.recordExternalCall,
}));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { POST } from "@/app/api/analytics/route";

const CHROME =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";

function request(body: object) {
    return new Request("http://localhost:3000/api/analytics", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "sec-fetch-site": "same-origin",
            "user-agent": CHROME,
            "x-forwarded-for": "203.0.113.7, 10.0.0.1",
        },
        body: JSON.stringify(body),
    });
}

describe("브라우저 통계 수집", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({});
        mocks.userFindUnique.mockResolvedValue({ role: "user" });
        mocks.recordPageView.mockResolvedValue(true);
        mocks.recordExternalCall.mockResolvedValue(true);
    });

    it("관리자의 방문과 외부 서비스 호출은 기록하지 않는다", async () => {
        mocks.getSession.mockResolvedValue({ id: 1 });
        mocks.userFindUnique.mockResolvedValue({ role: "admin" });

        const view = await POST(request({ type: "view", path: "/ko/music" }));
        const event = await POST(request({ type: "event", name: "kakao-map" }));

        expect(view.status).toBe(204);
        expect(event.status).toBe(204);
        expect(mocks.recordPageView).not.toHaveBeenCalled();
        expect(mocks.recordExternalCall).not.toHaveBeenCalled();
    });

    it("일반 회원의 방문은 로그인 이용자로 기록한다", async () => {
        mocks.getSession.mockResolvedValue({ id: 2 });

        await POST(request({ type: "view", path: "/ko/music" }));

        expect(mocks.userFindUnique).toHaveBeenCalledWith({
            where: { id: 2 },
            select: { role: true },
        });
        expect(mocks.recordPageView).toHaveBeenCalledWith({
            path: "/ko/music",
            ip: "203.0.113.7",
            userAgent: CHROME,
            signedIn: true,
        });
    });

    it("비회원의 외부 서비스 호출은 계정 조회 없이 기록한다", async () => {
        await POST(request({ type: "event", name: "kakao-map" }));

        expect(mocks.userFindUnique).not.toHaveBeenCalled();
        expect(mocks.recordExternalCall).toHaveBeenCalledWith("kakao-map");
    });
});
