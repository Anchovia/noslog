import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    examFindFirst: vi.fn(),
    examFindUnique: vi.fn(),
    chartFindMany: vi.fn(),
    musicCount: vi.fn(),
    transaction: vi.fn(),
    examCreate: vi.fn(),
    examUpdate: vi.fn(),
    stageDeleteMany: vi.fn(),
    stageCreate: vi.fn(),
    rewardDeleteMany: vi.fn(),
    rewardCreateMany: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
}));

const transactionClient = {
    exam: {
        create: mocks.examCreate,
        update: mocks.examUpdate,
    },
    examStage: {
        deleteMany: mocks.stageDeleteMany,
        create: mocks.stageCreate,
    },
    examReward: {
        deleteMany: mocks.rewardDeleteMany,
        createMany: mocks.rewardCreateMany,
    },
};

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        $transaction: mocks.transaction,
        exam: {
            findFirst: mocks.examFindFirst,
            findUnique: mocks.examFindUnique,
        },
        musicChart: { findMany: mocks.chartFindMany },
        music: { count: mocks.musicCount },
    },
}));
vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));

import { saveExam } from "@/app/admin/exams/actions";

function createExamInput(overrides: Record<string, unknown> = {}) {
    return {
        slug: "event-test",
        mode: "event",
        scoringType: "score",
        grade: null,
        shortLabel: "TEST",
        title: "테스트 검정",
        description: "",
        feeNos: 2000,
        requiredGrade: 0,
        status: "draft",
        stages: [
            {
                musicIndex: "music-1",
                title: "Music 1",
                artist: "Artist",
                charts: [
                    { chartId: 11, difficulty: "hard", level: 10 },
                    { chartId: 12, difficulty: "expert", level: 12 },
                ],
                label: "1st",
                requirementType: "single",
                requiredValue: 925000,
                allowedChartIds: [11, 12],
            },
        ],
        rewards: [],
        ...overrides,
    };
}

describe("관리자 검정 저장 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.examFindFirst.mockResolvedValue(null);
        mocks.examFindUnique.mockResolvedValue(null);
        mocks.chartFindMany.mockResolvedValue([
            { id: 11, music_idx: "music-1" },
            { id: 12, music_idx: "music-1" },
        ]);
        mocks.musicCount.mockResolvedValue(0);
        mocks.examCreate.mockResolvedValue({ id: 30 });
        mocks.examUpdate.mockResolvedValue({ id: 30 });
        mocks.transaction.mockImplementation((callback) =>
            callback(transactionClient)
        );
    });

    it("관리자가 아니면 입력 검증 전에도 저장을 중단한다", async () => {
        mocks.requireAdmin.mockRejectedValue(new Error("forbidden"));

        await expect(saveExam(createExamInput())).rejects.toThrow("forbidden");
        expect(mocks.examFindFirst).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("공개 이벤트 검정에 과제곡과 보상 악곡이 부족하면 거부한다", async () => {
        const result = await saveExam(
            createExamInput({ status: "published", stages: [] })
        );

        expect(result).toEqual({
            success: false,
            message: "공개 검정은 과제곡 세 곡이 필요합니다.",
            fieldErrors: {
                stages: ["공개 검정은 과제곡 세 곡이 필요합니다."],
                rewards: ["이벤트 검정의 합격 보상 악곡을 추가해주세요."],
            },
        });
        expect(mocks.examFindFirst).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("이미 사용 중인 식별자는 저장하지 않는다", async () => {
        mocks.examFindFirst.mockResolvedValueOnce({ id: 99 });

        await expect(saveExam(createExamInput())).resolves.toEqual({
            success: false,
            message: "이미 사용 중인 식별자입니다.",
            fieldErrors: {
                slug: ["이미 사용 중인 식별자입니다."],
            },
        });
        expect(mocks.chartFindMany).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("선택한 채보가 과제곡 소속이 아니면 거부한다", async () => {
        mocks.chartFindMany.mockResolvedValue([
            { id: 11, music_idx: "other-music" },
            { id: 12, music_idx: "music-1" },
        ]);

        await expect(saveExam(createExamInput())).resolves.toEqual({
            success: false,
            message: "과제곡의 허용 난이도를 다시 선택해주세요.",
            fieldErrors: {
                stages: ["과제곡의 허용 난이도를 다시 선택해주세요."],
            },
        });
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("인증 이력이 있는 검정의 과제곡 변경을 막는다", async () => {
        mocks.examFindUnique.mockResolvedValue({
            mode: "event",
            scoringType: "score",
            stages: [
                {
                    musicIndex: "old-music",
                    position: 1,
                    label: "1st",
                    requirementType: "single",
                    requiredValue: 900000,
                    allowedCharts: [{ chartId: 21 }],
                },
            ],
            _count: { submissions: 1, achievements: 0 },
        });

        await expect(saveExam(createExamInput({ id: 30 }))).resolves.toEqual({
            success: false,
            message:
                "인증 이력이 있는 검정의 모드, 채점 방식과 과제곡은 수정할 수 없습니다.",
        });
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("새 검정과 과제곡을 하나의 트랜잭션으로 저장한다", async () => {
        await expect(saveExam(createExamInput())).resolves.toEqual({
            success: true,
            message: "검정을 추가했습니다.",
            id: 30,
        });

        expect(mocks.examCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                slug: "event-test",
                mode: "event",
                grade: null,
                feeNos: 2000,
            }),
            select: { id: true },
        });
        expect(mocks.stageDeleteMany).toHaveBeenCalledWith({
            where: { examId: 30 },
        });
        expect(mocks.stageCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                examId: 30,
                musicIndex: "music-1",
                position: 1,
                allowedCharts: {
                    create: [{ chartId: 11 }, { chartId: 12 }],
                },
            }),
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("exams");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/exams");
    });
});
