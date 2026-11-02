import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined },
    draftFindUnique: vi.fn(),
    draftUpdateMany: vi.fn(),
    commentCreate: vi.fn(),
    claim: vi.fn(),
    tokenCount: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    unstable_cache: (fn: unknown) => fn,
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/upload-rate-limit", () => ({
    claimUploadTokenQuota: mocks.claim,
}));
vi.mock("@/lib/db", () => ({
    default: {
        chartDraft: {
            findUnique: mocks.draftFindUnique,
            updateMany: mocks.draftUpdateMany,
        },
        chartComment: { create: mocks.commentCreate },
        oAuthAccessToken: { count: mocks.tokenCount },
    },
}));

import {
    addChartComment,
    saveMyChartDraft,
} from "@/features/contributions/server/chart-draft-service";
import { isOAuthTokenLimitReached } from "@/features/partner/server/oauth-service";
import { createDefaultChartDocument } from "@/lib/chart-pattern/schema";

const saveInput = {
    chartId: 5,
    baseVersion: 2,
    document: createDefaultChartDocument({ bpm: 120, durationMs: 0 }),
};
const commentInput = {
    chartId: 5,
    draftId: 3,
    timeMs: 0,
    kind: "problem",
    body: "확인",
};

beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.id = 9;
    mocks.draftUpdateMany.mockResolvedValue({ count: 1 });
});

describe("채보 초안 저장 간격", () => {
    function lastSaved(msAgo: number) {
        mocks.draftFindUnique.mockResolvedValue({
            id: 3,
            status: "draft",
            updatedAt: new Date(Date.now() - msAgo),
        });
    }

    it("1초 안에 다시 저장하면 남은 시간을 기다린 뒤 저장한다", async () => {
        vi.useFakeTimers();
        try {
            lastSaved(100);
            const saving = saveMyChartDraft(saveInput, "ko");
            await vi.advanceTimersByTimeAsync(800);
            expect(mocks.draftUpdateMany).not.toHaveBeenCalled();
            await vi.advanceTimersByTimeAsync(200);
            await expect(saving).resolves.toMatchObject({ success: true });
            expect(mocks.draftUpdateMany).toHaveBeenCalledTimes(1);
        } finally {
            vi.useRealTimers();
        }
    });

    it("동시에 보낸 요청은 버전이 맞는 하나만 저장한다", async () => {
        lastSaved(5_000);
        mocks.draftUpdateMany
            .mockResolvedValueOnce({ count: 1 })
            .mockResolvedValueOnce({ count: 0 });
        const results = await Promise.all([
            saveMyChartDraft(saveInput, "ko"),
            saveMyChartDraft(saveInput, "ko"),
        ]);
        expect(results.map((r) => r.success)).toEqual([true, false]);
    });

    it("자동 저장 간격(1.5초)이면 저장된다", async () => {
        lastSaved(1_500);
        await expect(saveMyChartDraft(saveInput, "ko")).resolves.toMatchObject({
            success: true,
            version: 3,
        });
    });
});

describe("자기 초안 댓글 한도", () => {
    beforeEach(() => {
        mocks.draftFindUnique.mockResolvedValue({ userId: 9, chartId: 5 });
    });

    it("한도에 닿으면 댓글을 만들지 않는다", async () => {
        mocks.claim.mockResolvedValue({ allowed: false, grantId: null });
        const result = await addChartComment(commentInput, "ko");
        expect(result.success).toBe(false);
        expect(mocks.claim).toHaveBeenCalledWith(9, "draft-comment");
        expect(mocks.commentCreate).not.toHaveBeenCalled();
    });

    it("한도 안이면 만든다", async () => {
        mocks.claim.mockResolvedValue({ allowed: true, grantId: 1 });
        await expect(
            addChartComment(commentInput, "ko")
        ).resolves.toMatchObject({ success: true });
        expect(mocks.commentCreate).toHaveBeenCalledTimes(1);
    });
});

describe("OAuth 토큰 발급 한도", () => {
    it("지난 1시간 발급이 2,000개면 닿은 것이다", async () => {
        mocks.tokenCount.mockResolvedValue(1_999);
        await expect(isOAuthTokenLimitReached("c")).resolves.toBe(false);
        mocks.tokenCount.mockResolvedValue(2_000);
        await expect(isOAuthTokenLimitReached("c")).resolves.toBe(true);
    });
});
