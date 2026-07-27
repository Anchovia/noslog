import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    arcadeFindFirst: vi.fn(),
    userUpdate: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));
vi.mock("@/lib/db", () => ({
    default: {
        arcade: { findFirst: mocks.arcadeFindFirst },
        user: { update: mocks.userUpdate },
    },
}));
vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));

import { regenerateSyncToken } from "@/app/(nevigation)/bookmarklet/action";
import { setPreferredArcade } from "@/app/(nevigation)/gamecenter/actions";

describe("사용자 변경 Server Action 권한", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("비로그인 사용자의 선호 오락실 변경을 거부한다", async () => {
        mocks.getSession.mockResolvedValue({});

        const result = await setPreferredArcade(10);

        expect(result.success).toBe(false);
        expect(mocks.arcadeFindFirst).not.toHaveBeenCalled();
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("선호 오락실은 세션 사용자의 프로필에만 저장한다", async () => {
        mocks.getSession.mockResolvedValue({ id: 7 });
        mocks.arcadeFindFirst.mockResolvedValue({
            id: 10,
            name: "테스트 오락실",
        });

        const result = await setPreferredArcade(10);

        expect(result.success).toBe(true);
        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 7 },
            data: { preferred_arcade_id: 10 },
        });
    });

    it("비로그인 사용자는 동기화 토큰을 재발급할 수 없다", async () => {
        mocks.getSession.mockResolvedValue({});

        const result = await regenerateSyncToken();

        expect(result.success).toBe(false);
        expect(result.message).toBe("로그인이 필요합니다.");
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("동기화 토큰은 세션 사용자의 버전만 변경한다", async () => {
        mocks.getSession.mockResolvedValue({ id: 7 });

        const result = await regenerateSyncToken();

        expect(result.success).toBe(true);
        expect(result.message).toBe(
            "연동 토큰을 재발급했습니다. 북마클릿을 다시 등록해주세요."
        );
        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 7 },
            data: { sync_token_version: { increment: 1 } },
        });
    });
});
