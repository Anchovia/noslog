import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    getCachedProfileData: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));
vi.mock("@/features/profile/server/public-profile-data", () => ({
    getCachedProfileData: mocks.getCachedProfileData,
}));
// 그림은 그리지 않고 응답 머리만 본다
vi.mock("next/og", () => ({
    ImageResponse: class {
        constructor(
            _element: unknown,
            init: { headers: Record<string, string> }
        ) {
            return new Response("png", { headers: init.headers });
        }
    },
}));

import { GET } from "@/app/(site)/profile/[id]/card/route";
import { GET as getShareImage } from "@/app/(site)/profile/[id]/share-image/route";
import { LOCALE_REQUEST_HEADER } from "@/lib/i18n/routing";

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

describe("프로필 공유 이미지", () => {
    beforeEach(() => {
        mocks.getSession.mockReset();
        mocks.getCachedProfileData.mockReset();
        mocks.getCachedProfileData.mockResolvedValue({
            user: { avatar: null, country: "ko-KR", hide_play_scores: false },
        });
    });

    it("CDN 에 10분까지만 두고 stale-while-revalidate 는 붙이지 않는다", async () => {
        const response = await getShareImage(
            new NextRequest("http://localhost:3000/profile/1/share-image", {
                headers: { [LOCALE_REQUEST_HEADER]: "ko" },
            }),
            { params: Promise.resolve({ id: "1" }) }
        );
        expect(response.status).toBe(200);
        expect(response.headers.get("Cache-Control")).toBe(
            "public, max-age=0, s-maxage=600"
        );
    });

    it("쿼리가 붙으면 그리지 않고 쿼리 없는 같은 언어 주소로 308", async () => {
        const response = await getShareImage(
            new NextRequest(
                "http://localhost:3000/profile/1/share-image?v=2&x=1",
                { headers: { [LOCALE_REQUEST_HEADER]: "ja" } }
            ),
            { params: Promise.resolve({ id: "1" }) }
        );
        expect(response.status).toBe(308);
        expect(response.headers.get("Location")).toBe(
            "http://localhost:3000/ja/profile/1/share-image"
        );
        expect(mocks.getCachedProfileData).not.toHaveBeenCalled();
    });

    it("언어 앞머리가 이미 있는 주소는 그대로 두고 쿼리만 뗀다", async () => {
        const response = await getShareImage(
            new NextRequest(
                "http://localhost:3000/en/profile/1/share-image?v=2"
            ),
            { params: Promise.resolve({ id: "1" }) }
        );
        expect(response.status).toBe(308);
        expect(response.headers.get("Location")).toBe(
            "http://localhost:3000/en/profile/1/share-image"
        );
    });
});
