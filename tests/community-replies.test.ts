import { beforeEach, describe, expect, it, vi } from "vitest";

// 답글(2026-09-22 R1) — 트랜잭션 안에서 쓰는 표만 흉내 낸다
const tx = vi.hoisted(() => ({
    communityChartEvaluation: {
        findFirst: vi.fn(),
        update: vi.fn(),
        deleteMany: vi.fn(),
    },
    communityOpinionReply: {
        findFirst: vi.fn(),
        create: vi.fn(),
        updateMany: vi.fn(),
        delete: vi.fn(),
    },
    communityOpinionReplyLike: {
        upsert: vi.fn(),
        deleteMany: vi.fn(),
        count: vi.fn(),
    },
    communityOpinionHelpful: { deleteMany: vi.fn() },
    communityOpinionReport: { updateMany: vi.fn(), upsert: vi.fn() },
    playData: { findFirst: vi.fn() },
    musicChart: { findUnique: vi.fn() },
}));

vi.mock("@/lib/db", () => ({
    default: {
        $transaction: (run: (client: typeof tx) => unknown) => run(tx),
    },
}));

import { mutateChartCommunity } from "@/features/music/server/communityMutation";
import {
    communityMutationSchema,
    opinionReportSchema,
} from "@/features/music/schemas/communitySchema";

const ME = 7;

describe("의견 답글", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        tx.playData.findFirst.mockResolvedValue({ id: 1 });
        tx.musicChart.findUnique.mockResolvedValue({ id: 3 });
        tx.communityOpinionReplyLike.count.mockResolvedValue(4);
    });

    it("답글은 1~120자, 신고는 의견과 답글 중 하나만", () => {
        const base = { action: "reply-save", chartId: 3, evaluationId: 5 };
        expect(
            communityMutationSchema.safeParse({ ...base, body: "  " }).success
        ).toBe(false);
        expect(
            communityMutationSchema.safeParse({
                ...base,
                body: "가".repeat(121),
            }).success
        ).toBe(false);
        expect(
            communityMutationSchema.safeParse({ ...base, body: "좋아요" })
                .success
        ).toBe(true);
        expect(opinionReportSchema.safeParse({ reason: "spam" }).success).toBe(
            false
        );
        expect(
            opinionReportSchema.safeParse({
                evaluationId: 1,
                replyId: 2,
                reason: "spam",
            }).success
        ).toBe(false);
        expect(
            opinionReportSchema.safeParse({ replyId: 2, reason: "spam" })
                .success
        ).toBe(true);
    });

    it("그 채보 기록이 있어야 답글을 쓴다", async () => {
        tx.communityChartEvaluation.findFirst.mockResolvedValue({
            id: 5,
            opinion: "후반 트릴",
        });
        tx.playData.findFirst.mockResolvedValue(null);
        await expect(
            mutateChartCommunity(
                {
                    action: "reply-save",
                    chartId: 3,
                    evaluationId: 5,
                    body: "동의해요",
                },
                ME
            )
        ).rejects.toMatchObject({ code: "ineligible" });
        expect(tx.communityOpinionReply.create).not.toHaveBeenCalled();
    });

    it("보이는 의견에 답글을 새로 쓰고 번역할 답글 번호를 돌려준다", async () => {
        tx.communityChartEvaluation.findFirst.mockResolvedValue({
            id: 5,
            opinion: "후반 트릴",
        });
        tx.communityOpinionReply.create.mockResolvedValue({ id: 31 });
        const result = await mutateChartCommunity(
            {
                action: "reply-save",
                chartId: 3,
                evaluationId: 5,
                body: "  동의해요  ",
            },
            ME
        );
        expect(tx.communityOpinionReply.create).toHaveBeenCalledWith({
            data: { evaluationId: 5, userId: ME, body: "동의해요" },
            select: { id: true },
        });
        expect(result).toMatchObject({ translate: { kind: "reply", id: 31 } });
    });

    it("지운 의견 자리에는 새 답글을 받지 않는다", async () => {
        tx.communityChartEvaluation.findFirst.mockResolvedValue({
            id: 5,
            opinion: null,
        });
        await expect(
            mutateChartCommunity(
                {
                    action: "reply-save",
                    chartId: 3,
                    evaluationId: 5,
                    body: "안녕",
                },
                ME
            )
        ).rejects.toMatchObject({ code: "unavailable" });
    });

    it("남의 답글은 지울 수 없고 내 답글에는 좋아요를 누를 수 없다", async () => {
        tx.communityOpinionReply.findFirst.mockResolvedValue({
            id: 9,
            userId: 8,
            evaluationId: 5,
        });
        await expect(
            mutateChartCommunity(
                { action: "reply-delete", chartId: 3, replyId: 9 },
                ME
            )
        ).rejects.toMatchObject({ code: "unavailable" });

        tx.communityOpinionReply.findFirst.mockResolvedValue({
            id: 9,
            userId: ME,
            evaluationId: 5,
        });
        await expect(
            mutateChartCommunity(
                {
                    action: "reply-like",
                    chartId: 3,
                    replyId: 9,
                    selected: true,
                },
                ME
            )
        ).rejects.toMatchObject({ code: "unavailable" });
    });

    it("답글 좋아요는 수와 눌림을 돌려준다", async () => {
        tx.communityOpinionReply.findFirst.mockResolvedValue({
            id: 9,
            userId: 8,
            evaluationId: 5,
        });
        await expect(
            mutateChartCommunity(
                {
                    action: "reply-like",
                    chartId: 3,
                    replyId: 9,
                    selected: true,
                },
                ME
            )
        ).resolves.toMatchObject({ likeCount: 4, selected: true });
    });

    it("답글이 달린 평가를 지우면 행은 남기고 평가 · 의견만 비운다", async () => {
        tx.communityChartEvaluation.findFirst.mockResolvedValue({ id: 5 });
        await mutateChartCommunity(
            { action: "delete-evaluation", chartId: 3 },
            ME
        );
        expect(tx.communityChartEvaluation.deleteMany).not.toHaveBeenCalled();
        expect(tx.communityChartEvaluation.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 5 },
                data: expect.objectContaining({ opinion: null, stairs: null }),
            })
        );
    });
});
