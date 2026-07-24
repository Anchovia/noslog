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
});
