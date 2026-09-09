import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    getCachedProfileData: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));
vi.mock("@/app/(nevigation)/profile/[id]/data", () => ({
    getCachedProfileData: mocks.getCachedProfileData,
}));

import { GET } from "@/app/(nevigation)/profile/[id]/card/route";

describe("프로필 카드 이미지", () => {
    beforeEach(() => {
        mocks.getSession.mockReset();
        mocks.getCachedProfileData.mockReset();
    });

    it("다른 사용자의 카드 이미지 요청을 거부한다", async () => {
        mocks.getSession.mockResolvedValue({ id: 2 });

        const response = await GET(
            new NextRequest("http://localhost:3000/profile/1/card?mode=basic"),
            { params: Promise.resolve({ id: "1" }) }
        );

        expect(response.status).toBe(403);
        expect(mocks.getCachedProfileData).not.toHaveBeenCalled();
    });

    it("비로그인 요청에서는 프로필 데이터를 읽지 않는다", async () => {
        mocks.getSession.mockResolvedValue({});
        const response = await GET(
            new NextRequest("http://localhost:3000/profile/1/card"),
            { params: Promise.resolve({ id: "1" }) }
        );
        expect(response.status).toBe(403);
        expect(mocks.getCachedProfileData).not.toHaveBeenCalled();
    });

    it.each(["0", "-1", "1.5", "invalid"])(
        "잘못된 사용자 ID %s를 거부한다",
        async (id) => {
            const response = await GET(
                new NextRequest(`http://localhost:3000/profile/${id}/card`),
                { params: Promise.resolve({ id }) }
            );
            expect(response.status).toBe(404);
            expect(mocks.getSession).not.toHaveBeenCalled();
            expect(mocks.getCachedProfileData).not.toHaveBeenCalled();
        }
    );

    it("소유자 세션이어도 삭제된 프로필은 이미지로 만들지 않는다", async () => {
        mocks.getSession.mockResolvedValue({ id: 1 });
        mocks.getCachedProfileData.mockResolvedValue(null);
        const response = await GET(
            new NextRequest("http://localhost:3000/profile/1/card"),
            { params: Promise.resolve({ id: "1" }) }
        );
        expect(response.status).toBe(404);
    });
});
