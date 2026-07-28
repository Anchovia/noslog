import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
    session: {
        id: 9 as number | undefined,
        profileCompleted: false as boolean | undefined,
        locale: undefined as "ko" | "ja" | "en" | undefined,
        save: vi.fn(),
    },
    getSession: vi.fn(),
    userFindUnique: vi.fn(),
    userUpdate: vi.fn(),
    updateTag: vi.fn(),
    redirect: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));
vi.mock("@/lib/db", () => ({
    default: {
        user: {
            findUnique: mocks.userFindUnique,
            update: mocks.userUpdate,
        },
    },
}));
vi.mock("next/cache", () => ({ updateTag: mocks.updateTag }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { completeOnboarding } from "@/app/(auth)/onboarding/actions";
import { GET as completeOnboardingSession } from "@/app/(auth)/onboarding/complete/route";
import { proxy } from "@/proxy";

function onboardingForm(username = "carol", country = "ko-KR") {
    const formData = new FormData();
    formData.set("username", username);
    formData.set("country", country);
    return formData;
}

describe("최초 프로필 설정", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 9;
        mocks.session.profileCompleted = false;
        mocks.session.locale = undefined;
        mocks.getSession.mockResolvedValue(mocks.session);
        mocks.userFindUnique.mockResolvedValue({
            profile_completed_at: new Date("2026-07-19"),
        });
        mocks.userUpdate.mockResolvedValue({ id: 9 });
    });

    it("닉네임과 국가를 저장하고 온보딩을 완료한다", async () => {
        await completeOnboarding(null, onboardingForm());

        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 9 },
            data: {
                username: "CAROL",
                country: "ko-KR",
                locale: "ko",
                profile_completed_at: expect.any(Date),
            },
        });
        expect(mocks.session.profileCompleted).toBe(true);
        expect(mocks.session.save).toHaveBeenCalledOnce();
        expect(mocks.redirect).toHaveBeenCalledWith("/ko");
    });

    it("한 글자 닉네임을 허용한다", async () => {
        await completeOnboarding(null, onboardingForm("n"));

        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 9 },
            data: {
                username: "N",
                country: "ko-KR",
                locale: "ko",
                profile_completed_at: expect.any(Date),
            },
        });
    });

    it("지원하지 않는 국가는 저장하지 않는다", async () => {
        await expect(
            completeOnboarding(null, onboardingForm("carol", "unknown"))
        ).resolves.toEqual(
            expect.objectContaining({ message: "입력한 정보를 확인해주세요." })
        );
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("미완료 사용자가 다른 화면에 접근하면 온보딩으로 보낸다", async () => {
        const response = await proxy(
            new NextRequest("http://localhost:3000/music")
        );

        expect(response?.headers.get("location")).toBe(
            "http://localhost:3000/en/onboarding"
        );
    });

    it("미완료 사용자의 기존 온보딩 경로를 언어 경로로 보낸다", async () => {
        const response = await proxy(
            new NextRequest("http://localhost:3000/onboarding")
        );

        expect(response?.headers.get("location")).toBe(
            "http://localhost:3000/en/onboarding"
        );
    });

    it("미완료 사용자는 언어별 온보딩 화면에 접근할 수 있다", async () => {
        const response = await proxy(
            new NextRequest("http://localhost:3000/ko/onboarding")
        );

        expect(response?.headers.get("x-middleware-rewrite")).toBe(
            "http://localhost:3000/onboarding"
        );
    });

    it("완료된 프로필 상태를 Route Handler에서 세션에 반영한다", async () => {
        const response = await completeOnboardingSession(
            new NextRequest("http://localhost:3000/onboarding/complete")
        );

        expect(mocks.session.profileCompleted).toBe(true);
        expect(mocks.session.save).toHaveBeenCalledOnce();
        expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("DB 프로필이 미완료라면 설정 화면으로 되돌린다", async () => {
        mocks.userFindUnique.mockResolvedValue({ profile_completed_at: null });

        const response = await completeOnboardingSession(
            new NextRequest("http://localhost:3000/onboarding/complete")
        );

        expect(mocks.session.save).not.toHaveBeenCalled();
        expect(response.headers.get("location")).toBe(
            "http://localhost:3000/onboarding"
        );
    });
});
