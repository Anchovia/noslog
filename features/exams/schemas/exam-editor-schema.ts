import { z } from "zod";

const examModeSchema = z.enum(["basic", "recital", "event"], {
    error: "검정 종류를 확인해주세요.",
});

const examScoringTypeSchema = z.enum(["score", "recital_point"], {
    error: "채점 방식을 확인해주세요.",
});

const examStatusSchema = z.enum(["draft", "published"], {
    error: "공개 상태를 확인해주세요.",
});

const examChartOptionSchema = z.object({
    chartId: z.number().int().positive(),
    difficulty: z.string().trim().min(1),
    level: z.number(),
});

const examStageSchema = z.object({
    id: z.number().int().positive().optional(),
    musicIndex: z.string().trim().min(1),
    title: z.string().trim().min(1),
    artist: z.string().trim().nullable(),
    charts: z.array(examChartOptionSchema),
    allowedChartIds: z
        .array(z.number().int().positive())
        .min(1, "허용 난이도를 한 개 이상 선택해주세요."),
    label: z.string().trim().max(12, "과제곡 라벨은 12자 이하로 입력해주세요."),
    requirementType: z.enum(["single", "cumulative"], {
        error: "통과 조건을 확인해주세요.",
    }),
    requiredValue: z
        .number({ error: "통과 조건을 입력해주세요." })
        .positive("통과 조건을 입력해주세요."),
});

const examRewardSchema = z.object({
    id: z.number().int().positive().optional(),
    type: z.enum(["grade", "music_unlock"]),
    label: z
        .string()
        .trim()
        .min(1, "보상 이름을 입력해주세요.")
        .max(80, "보상 이름은 80자 이하로 입력해주세요."),
    musicIndex: z.string().trim().nullable(),
});

export const examEditorSchema = z
    .object({
        id: z.number().int().positive().optional(),
        slug: z
            .string()
            .trim()
            .min(2, "식별자를 입력해주세요.")
            .max(60, "식별자는 60자 이하로 입력해주세요.")
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "영문 소문자, 숫자, 하이픈만 사용할 수 있습니다."
            ),
        mode: examModeSchema,
        scoringType: examScoringTypeSchema,
        grade: z
            .number({ error: "급수를 입력해주세요." })
            .int("급수는 정수로 입력해주세요.")
            .min(1, "급수는 1에서 10 사이로 입력해주세요.")
            .max(10, "급수는 1에서 10 사이로 입력해주세요.")
            .nullable(),
        shortLabel: z
            .string()
            .trim()
            .min(1, "선택 라벨을 입력해주세요.")
            .max(30, "선택 라벨은 30자 이하로 입력해주세요."),
        title: z
            .string()
            .trim()
            .min(1, "검정명을 입력해주세요.")
            .max(80, "검정명은 80자 이하로 입력해주세요."),
        description: z
            .string()
            .trim()
            .max(500, "설명은 500자 이하로 입력해주세요."),
        feeNos: z
            .number({ error: "검정료를 입력해주세요." })
            .int("검정료는 정수로 입력해주세요.")
            .nonnegative("검정료는 0 이상으로 입력해주세요."),
        requiredGrade: z
            .number({ error: "요구 Grd.를 입력해주세요." })
            .int("요구 Grd.는 정수로 입력해주세요.")
            .nonnegative("요구 Grd.는 0 이상으로 입력해주세요."),
        status: examStatusSchema,
        stages: z
            .array(examStageSchema)
            .max(3, "과제곡은 세 곡까지 추가할 수 있습니다."),
        rewards: z
            .array(examRewardSchema)
            .max(10, "합격 보상은 열 개까지 추가할 수 있습니다."),
    })
    .superRefine((data, context) => {
        if (data.mode !== "event" && data.grade === null) {
            context.addIssue({
                code: "custom",
                path: ["grade"],
                message: "Basic과 Recital은 급수가 필요합니다.",
            });
        }
        if (data.mode === "basic" && data.scoringType !== "score") {
            context.addIssue({
                code: "custom",
                path: ["scoringType"],
                message: "Basic 검정은 스코어 방식만 사용할 수 있습니다.",
            });
        }
        if (data.mode === "recital" && data.scoringType !== "recital_point") {
            context.addIssue({
                code: "custom",
                path: ["scoringType"],
                message: "Recital 검정은 리사이틀 포인트 방식을 사용합니다.",
            });
        }
        if (data.status === "published" && data.stages.length !== 3) {
            context.addIssue({
                code: "custom",
                path: ["stages"],
                message: "공개 검정은 과제곡 세 곡이 필요합니다.",
            });
        }
        if (
            data.status === "published" &&
            data.mode === "event" &&
            !data.rewards.some((reward) => reward.type === "music_unlock")
        ) {
            context.addIssue({
                code: "custom",
                path: ["rewards"],
                message: "이벤트 검정의 합격 보상 악곡을 추가해주세요.",
            });
        }
        if (
            new Set(data.stages.map((stage) => stage.musicIndex)).size !==
            data.stages.length
        ) {
            context.addIssue({
                code: "custom",
                path: ["stages"],
                message: "같은 곡을 중복으로 추가할 수 없습니다.",
            });
        }
        for (const [index, reward] of data.rewards.entries()) {
            if (reward.type === "music_unlock" && !reward.musicIndex) {
                context.addIssue({
                    code: "custom",
                    path: ["rewards", index, "musicIndex"],
                    message: "보상 악곡을 선택해주세요.",
                });
            }
        }
    });

export const examMusicSearchSchema = z.object({
    query: z.string().trim().max(100),
});

export const examDeleteSchema = z.object({
    id: z.number().int().positive("잘못된 검정입니다."),
});

export type ExamEditorFormValues = z.input<typeof examEditorSchema>;
export type ExamEditorValues = z.output<typeof examEditorSchema>;
export type ExamMode = ExamEditorValues["mode"];
export type ScoringType = ExamEditorValues["scoringType"];
export type ExamStatus = ExamEditorValues["status"];
export type ExamStageEditor = ExamEditorValues["stages"][number];
export type ExamRewardEditor = ExamEditorValues["rewards"][number];
export type ChartOption = ExamStageEditor["charts"][number];

type ExamTopLevelFieldName = Extract<keyof ExamEditorFormValues, string>;
type ExamStageFieldName = Extract<keyof ExamStageEditor, string>;
type ExamRewardFieldName = Extract<keyof ExamRewardEditor, string>;

export type ExamEditorFieldName =
    | ExamTopLevelFieldName
    | `stages.${number}.${ExamStageFieldName}`
    | `rewards.${number}.${ExamRewardFieldName}`;

export const EMPTY_EXAM: ExamEditorFormValues = {
    slug: "basic-10",
    mode: "basic",
    scoringType: "score",
    grade: 10,
    shortLabel: "10급",
    title: "Basic 10급",
    description: "",
    feeNos: 1000,
    requiredGrade: 800,
    status: "draft",
    stages: [],
    rewards: [{ type: "grade", label: "Basic 10급", musicIndex: null }],
};
