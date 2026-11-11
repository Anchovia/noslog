import { beforeEach, describe, expect, it, vi } from "vitest";

// 답글(2026-09-22 R1) — 트랜잭션 안에서 쓰는 표만 흉내 낸다
const tx = vi.hoisted(() => ({
    $executeRaw: vi.fn(),
    communityChartEvaluation: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        deleteMany: vi.fn(),
    },
    communityOpinionReply: {
        findFirst: vi.fn(),
        count: vi.fn(),
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
    chartGoalVote: { findUnique: vi.fn(), delete: vi.fn() },
    playData: { findFirst: vi.fn() },
    musicChart: { findUnique: vi.fn() },
}));

const transaction = vi.hoisted(() =>
    vi.fn((run: (client: typeof tx) => unknown) => run(tx))
);
vi.mock("@/lib/db", () => ({ default: { $transaction: transaction } }));
const claim = vi.hoisted(() => vi.fn());
vi.mock("@/lib/upload-rate-limit", () => ({ claimUploadTokenQuota: claim }));

import { mutateChartCommunity } from "@/features/music/server/community-mutation";
import {
    communityMutationSchema,
    opinionReportSchema,
} from "@/features/music/schemas/community-schema";

const ME = 7;

describe("의견 답글", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        tx.playData.findFirst.mockResolvedValue({ id: 1 });
        tx.musicChart.findUnique.mockResolvedValue({ id: 3 });
        tx.communityOpinionReplyLike.count.mockResolvedValue(4);
        tx.communityOpinionReply.count.mockResolvedValue(0);
        tx.communityChartEvaluation.findUnique.mockResolvedValue(null);
        tx.communityChartEvaluation.findFirst.mockResolvedValue(null);
        claim.mockResolvedValue({ allowed: true, grantId: 1 });
    });

    it("DB id 범위를 넘는 값은 스키마에서 거절한다", () => {
        expect(
            communityMutationSchema.safeParse({
                action: "delete-evaluation",
                chartId: 2_147_483_648,
            }).success
        ).toBe(false);
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

    it("새 답글은 사람마다 잠근 채 최근 24시간 답글을 센다", async () => {
        vi.useFakeTimers({ now: new Date("2026-10-29T12:00:00.000Z") });
        try {
            tx.communityChartEvaluation.findFirst.mockResolvedValue({
                id: 5,
                opinion: "후반 트릴",
            });
            tx.communityOpinionReply.count.mockResolvedValue(49);
            tx.communityOpinionReply.create.mockResolvedValue({ id: 32 });
            await mutateChartCommunity(
                {
                    action: "reply-save",
                    chartId: 3,
                    evaluationId: 5,
                    body: "동의해요",
                },
                ME
            );
            expect(tx.$executeRaw.mock.calls[0].slice(1)).toEqual([
                `community-reply-daily:${ME}`,
            ]);
            expect(tx.communityOpinionReply.count).toHaveBeenCalledWith({
                where: {
                    userId: ME,
                    createdAt: { gte: new Date("2026-10-28T12:00:00.000Z") },
                },
            });
            expect(tx.communityOpinionReply.create).toHaveBeenCalledTimes(1);
        } finally {
            vi.useRealTimers();
        }
    });

    it("하루 50건을 넘는 새 답글은 넣지 않고, 고치기는 한도와 따로다", async () => {
        tx.communityChartEvaluation.findFirst.mockResolvedValue({
            id: 5,
            opinion: "후반 트릴",
        });
        tx.communityOpinionReply.count.mockResolvedValue(50);
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
        ).rejects.toMatchObject({ code: "dailyLimit" });
        expect(tx.communityOpinionReply.create).not.toHaveBeenCalled();

        tx.communityOpinionReply.updateMany.mockResolvedValue({ count: 1 });
        await expect(
            mutateChartCommunity(
                {
                    action: "reply-save",
                    chartId: 3,
                    evaluationId: 5,
                    replyId: 31,
                    body: "고친 답글",
                },
                ME
            )
        ).resolves.toMatchObject({ translate: { kind: "reply", id: 31 } });
    });

    it("새 답글만 기본 격리로 센다 — 직렬화 격리에서는 잠금 뒤에도 앞 요청의 답글이 보이지 않는다", async () => {
        tx.communityChartEvaluation.findFirst.mockResolvedValue({
            id: 5,
            opinion: "후반 트릴",
        });
        tx.communityOpinionReply.create.mockResolvedValue({ id: 33 });
        await mutateChartCommunity(
            {
                action: "reply-save",
                chartId: 3,
                evaluationId: 5,
                body: "동의해요",
            },
            ME
        );
        expect(transaction).toHaveBeenLastCalledWith(
            expect.any(Function),
            undefined
        );

        tx.communityOpinionReply.updateMany.mockResolvedValue({ count: 1 });
        await mutateChartCommunity(
            {
                action: "reply-save",
                chartId: 3,
                evaluationId: 5,
                replyId: 33,
                body: "고친 답글",
            },
            ME
        );
        expect(transaction).toHaveBeenLastCalledWith(expect.any(Function), {
            isolationLevel: "Serializable",
        });
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

    it("운영자가 제외한 평가 · 체감 투표는 본인이 지우지 못한다", async () => {
        tx.communityChartEvaluation.findUnique.mockResolvedValue({
            excluded: true,
        });
        await expect(
            mutateChartCommunity(
                { action: "delete-evaluation", chartId: 3 },
                ME
            )
        ).rejects.toMatchObject({ message: "evaluation_excluded" });
        expect(tx.communityChartEvaluation.deleteMany).not.toHaveBeenCalled();

        tx.chartGoalVote.findUnique.mockResolvedValue({
            id: 9,
            excluded: true,
        });
        await expect(
            mutateChartCommunity(
                {
                    action: "delete-vote",
                    input: { chartId: 3, mode: "basic", goal: "s" },
                },
                ME
            )
        ).rejects.toMatchObject({ message: "vote_excluded" });
        expect(tx.chartGoalVote.delete).not.toHaveBeenCalled();
    });

    it("평가 · 투표 · 좋아요는 5분 한도에 닿으면 쓰지 않고, 답글 쓰기는 세지 않는다", async () => {
        claim.mockResolvedValue({ allowed: false, grantId: null });
        await expect(
            mutateChartCommunity(
                { action: "delete-evaluation", chartId: 3 },
                ME
            )
        ).rejects.toMatchObject({ code: "rateLimited" });
        expect(claim).toHaveBeenCalledWith(ME, "community-write");
        expect(transaction).not.toHaveBeenCalled();

        claim.mockClear();
        await mutateChartCommunity(
            { action: "reply-delete", chartId: 3, replyId: 8 },
            ME
        ).catch(() => null);
        expect(claim).not.toHaveBeenCalled();
    });

    it("운영자가 숨긴 의견은 평가를 지워도 행을 남겨 숨김을 유지한다", async () => {
        tx.communityChartEvaluation.findFirst.mockResolvedValue({ id: 5 });
        await mutateChartCommunity(
            { action: "delete-evaluation", chartId: 3 },
            ME
        );
        expect(
            tx.communityChartEvaluation.findFirst.mock.calls[0][0].where
        ).toMatchObject({
            OR: [{ replies: { some: {} } }, { opinionHidden: true }],
        });
        expect(tx.communityChartEvaluation.deleteMany).not.toHaveBeenCalled();
    });
});
