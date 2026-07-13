import { z } from "zod";

const stageSchema = z.object({
    musicIndex: z.string().trim().min(1),
    position: z.number().int().positive(),
    label: z.string().trim().max(12).nullable(),
    requirementType: z.enum(["single", "cumulative"]),
    requiredValue: z.number().positive("통과 조건을 입력해주세요."),
    allowedChartIds: z
        .array(z.number().int().positive())
        .min(1, "허용 난이도를 한 개 이상 선택해주세요."),
});

const rewardSchema = z.object({
    type: z.enum(["grade", "music_unlock"]),
    label: z.string().trim().min(1, "보상 이름을 입력해주세요.").max(80),
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
        mode: z.enum(["basic", "recital", "event"]),
        scoringType: z.enum(["score", "recital_point"]),
        grade: z.number().int().min(1).max(10).nullable(),
        shortLabel: z
            .string()
            .trim()
            .min(1, "선택 라벨을 입력해주세요.")
            .max(30),
        title: z.string().trim().min(1, "검정명을 입력해주세요.").max(80),
        description: z.string().trim().max(500).nullable(),
        feeNos: z.number().int().nonnegative(),
        requiredGrade: z.number().int().nonnegative(),
        status: z.enum(["draft", "published"]),
        stages: z.array(stageSchema).max(3),
        rewards: z.array(rewardSchema).max(10),
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

export type ExamEditorInput = z.infer<typeof examEditorSchema>;
