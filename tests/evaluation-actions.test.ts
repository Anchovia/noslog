import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    chartFindUnique: vi.fn(),
    playDataFindFirst: vi.fn(),
    evaluationUpsert: vi.fn(),
    evaluationFindUnique: vi.fn(),
    evaluationFindFirst: vi.fn(),
    evaluationDelete: vi.fn(),
    reactionFindUnique: vi.fn(),
    reactionUpsert: vi.fn(),
    reactionDelete: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));

vi.mock("@/lib/db", () => ({
    default: {
        musicChart: { findUnique: mocks.chartFindUnique },
        playData: { findFirst: mocks.playDataFindFirst },
        chartEvaluation: {
            upsert: mocks.evaluationUpsert,
            findUnique: mocks.evaluationFindUnique,
            findFirst: mocks.evaluationFindFirst,
            delete: mocks.evaluationDelete,
        },
        chartEvaluationReaction: {
            findUnique: mocks.reactionFindUnique,
            upsert: mocks.reactionUpsert,
            delete: mocks.reactionDelete,
        },
    },
}));

vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));

import {
    deleteChartEvaluation,
    submitChartEvaluation,
    toggleChartEvaluationReaction,
} from "@/app/(nevigation)/music/[index]/[difficulty]/action";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";

const evaluationInput = {
    chartId: 10,
    perceivedConstant: 12.3,
    stairs: 1,
    chord: 2,
    trill: 3,
    glissando: 4,
    repetition: 0,
    comment: "패턴 의견",
};

const chart = {
    id: 10,
    music_idx: "test-music",
    difficulty: "Expert",
};

describe("체감 난이도와 패턴 투표 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({ id: 2 });
        mocks.chartFindUnique.mockResolvedValue(chart);
        mocks.playDataFindFirst.mockResolvedValue({ id: 20 });
        mocks.evaluationUpsert.mockResolvedValue({ id: 30 });
        mocks.evaluationFindUnique.mockResolvedValue({ id: 30, chart });
        mocks.evaluationFindFirst.mockResolvedValue({ id: 30, chart });
        mocks.evaluationDelete.mockResolvedValue({ id: 30 });
        mocks.reactionFindUnique.mockResolvedValue(null);
        mocks.reactionUpsert.mockResolvedValue({ id: 40 });
        mocks.reactionDelete.mockResolvedValue({ id: 40 });
    });

    it("비로그인 사용자의 투표를 DB 조회 전에 거부한다", async () => {
        mocks.getSession.mockResolvedValue({});

        await expect(submitChartEvaluation(evaluationInput)).resolves.toEqual({
            success: false,
            message: "로그인 후 투표할 수 있습니다.",
        });
        expect(mocks.chartFindUnique).not.toHaveBeenCalled();
    });

    it("범위를 벗어난 패턴 값은 저장하지 않는다", async () => {
        await expect(
            submitChartEvaluation({ ...evaluationInput, stairs: 5 })
        ).resolves.toEqual(expect.objectContaining({ success: false }));
        expect(mocks.evaluationUpsert).not.toHaveBeenCalled();
    });

    it.each(SUPPORTED_LOCALES)(
        "%s 서버 검증 실패 문구를 유지한다",
        async (locale) => {
            const t = createTranslator(getMessages(locale));
            await expect(
                submitChartEvaluation(
                    { ...evaluationInput, comment: "  " },
                    locale
                )
            ).resolves.toEqual({
                success: false,
                message: t("music.action.voteInvalid"),
            });
            expect(mocks.chartFindUnique).not.toHaveBeenCalled();
            expect(mocks.evaluationUpsert).not.toHaveBeenCalled();
        }
    );

    it("서버가 직접 받은 코멘트도 정규화한 뒤 저장한다", async () => {
        await submitChartEvaluation({
            ...evaluationInput,
            comment: ` ${"a".repeat(120)} `,
        });
        expect(mocks.evaluationUpsert).toHaveBeenCalledWith(
            expect.objectContaining({
                create: expect.objectContaining({ comment: "a".repeat(120) }),
                update: expect.objectContaining({ comment: "a".repeat(120) }),
            })
        );
    });

    it("플레이 기록이 없는 사용자는 투표할 수 없다", async () => {
        mocks.playDataFindFirst.mockResolvedValue(null);

        await expect(submitChartEvaluation(evaluationInput)).resolves.toEqual({
            success: false,
            message: "해당 채보의 플레이 기록 연동 후 투표할 수 있습니다.",
        });
        expect(mocks.evaluationUpsert).not.toHaveBeenCalled();
    });

    it("사용자와 채보 조합으로 평가를 생성하거나 갱신한다", async () => {
        await expect(submitChartEvaluation(evaluationInput)).resolves.toEqual({
            success: true,
            message: "투표가 반영되었습니다.",
        });

        expect(mocks.evaluationUpsert).toHaveBeenCalledWith({
            where: { chart_id_user_id: { chart_id: 10, user_id: 2 } },
            create: expect.objectContaining({
                chart_id: 10,
                user_id: 2,
                perceived_constant: 12.3,
                comment: "패턴 의견",
            }),
            update: expect.objectContaining({
                perceived_constant: 12.3,
                comment: "패턴 의견",
            }),
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("chart-evaluations");
        expect(mocks.revalidatePath).toHaveBeenCalledWith(
            "/music/test-music/expert"
        );
    });

    it("같은 반응을 다시 누르면 기존 반응을 취소한다", async () => {
        mocks.reactionFindUnique.mockResolvedValue({ id: 40, value: 1 });

        await toggleChartEvaluationReaction({ evaluationId: 30, value: 1 });

        expect(mocks.reactionDelete).toHaveBeenCalledWith({
            where: { id: 40 },
        });
        expect(mocks.reactionUpsert).not.toHaveBeenCalled();
    });

    it("다른 반응을 누르면 사용자별 반응을 교체한다", async () => {
        mocks.reactionFindUnique.mockResolvedValue({ id: 40, value: -1 });

        await toggleChartEvaluationReaction({ evaluationId: 30, value: 1 });

        expect(mocks.reactionUpsert).toHaveBeenCalledWith({
            where: {
                evaluation_id_user_id: {
                    evaluation_id: 30,
                    user_id: 2,
                },
            },
            create: { evaluation_id: 30, user_id: 2, value: 1 },
            update: { value: 1 },
        });
    });

    it("다른 사용자의 평가는 삭제할 수 없다", async () => {
        mocks.evaluationFindFirst.mockResolvedValue(null);

        await expect(
            deleteChartEvaluation({ evaluationId: 30 })
        ).resolves.toEqual({
            success: false,
            message: "삭제할 수 있는 본인 투표를 찾지 못했습니다.",
        });
        expect(mocks.evaluationFindFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 30, user_id: 2 },
            })
        );
        expect(mocks.evaluationDelete).not.toHaveBeenCalled();
    });

    it("본인 평가를 삭제하면 투표 캐시를 갱신한다", async () => {
        await expect(
            deleteChartEvaluation({ evaluationId: 30 })
        ).resolves.toEqual({
            success: true,
            message: "투표와 의견이 삭제되었습니다.",
        });

        expect(mocks.evaluationDelete).toHaveBeenCalledWith({
            where: { id: 30 },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("chart-evaluations");
    });
});
