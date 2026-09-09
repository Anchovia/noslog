import { describe, expect, it } from "vitest";

import {
    chartMetadataInputFromFormData,
    chartMetadataSchema,
    createChartMetadataFormData,
    createMusicMetadataFormData,
    musicMetadataInputFromFormData,
    musicMetadataSchema,
} from "@/features/music/schemas/musicAdminSchema";

describe("관리자 악곡 메타데이터 스키마", () => {
    it("공통 텍스트와 숫자를 저장 형식으로 정규화한다", () => {
        expect(
            musicMetadataSchema.parse({
                musicIndex: "  test-music  ",
                description: "  악곡 설명  ",
                bpmMin: "120.4",
                bpmMax: "180.6",
                durationSeconds: "125.7",
            })
        ).toEqual({
            musicIndex: "test-music",
            description: "악곡 설명",
            bpmMin: 120,
            bpmMax: 181,
            durationSeconds: 126,
        });
    });

    it("비어 있는 선택 입력은 null로 정규화한다", () => {
        expect(
            musicMetadataSchema.parse({
                musicIndex: "test-music",
                description: " ",
                bpmMin: "",
                bpmMax: "",
                durationSeconds: "",
            })
        ).toEqual({
            musicIndex: "test-music",
            description: null,
            bpmMin: null,
            bpmMax: null,
            durationSeconds: null,
        });
    });

    it("공통 숫자의 최소 범위와 숫자 형식을 검증한다", () => {
        const result = musicMetadataSchema.safeParse({
            musicIndex: "test-music",
            description: "",
            bpmMin: "0",
            bpmMax: "invalid",
            durationSeconds: "-1",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors).toMatchObject({
            bpmMin: ["최소 BPM을 1 이상으로 입력해주세요."],
            bpmMax: ["최대 BPM을 숫자로 입력해주세요."],
            durationSeconds: ["길이는 0 이상으로 입력해주세요."],
        });
    });

    it("채보 값과 날짜, 선택 텍스트를 저장 형식으로 정규화한다", () => {
        expect(
            chartMetadataSchema.parse({
                chartId: "10",
                musicIndex: "test-music",
                levelConstant: "11.25",
                noteCount: "999.6",
                releasedAt: "2026-07-17",
                unlockCondition: "  해금 조건  ",
                playVideoUrl: " https://example.com/play ",
                chartPreviewUrl: "",
            })
        ).toEqual({
            chartId: 10,
            musicIndex: "test-music",
            levelConstant: 11.25,
            noteCount: 1000,
            releasedAt: new Date("2026-07-17T00:00:00.000Z"),
            unlockCondition: "해금 조건",
            playVideoUrl: "https://example.com/play",
            chartPreviewUrl: null,
        });
    });

    it("레벨 상수 범위와 자릿수, 날짜와 URL 형식을 검증한다", () => {
        const result = chartMetadataSchema.safeParse({
            chartId: "10",
            musicIndex: "test-music",
            levelConstant: "14.001",
            noteCount: "0",
            releasedAt: "2026-02-30",
            unlockCondition: "",
            playVideoUrl: "invalid-url",
            chartPreviewUrl: "",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors).toMatchObject({
            levelConstant: [
                "공식 레벨 상수는 1~14 사이로 입력해주세요.",
                "공식 레벨 상수는 소수점 둘째 자리까지 입력해주세요.",
            ],
            releasedAt: ["수록일을 확인해주세요."],
            playVideoUrl: ["플레이 영상 URL을 올바른 URL로 입력해주세요."],
        });
    });

    it("공통 정보와 채보 FormData를 같은 스키마로 다시 검증한다", () => {
        const musicValues = musicMetadataSchema.parse({
            musicIndex: "test-music",
            description: "악곡 설명",
            bpmMin: "120",
            bpmMax: "180",
            durationSeconds: "126",
        });
        const chartValues = chartMetadataSchema.parse({
            chartId: "10",
            musicIndex: "test-music",
            levelConstant: "11.2",
            noteCount: "1000",
            releasedAt: "2026-07-17",
            unlockCondition: "",
            playVideoUrl: "",
            chartPreviewUrl: "https://example.com/chart",
        });

        expect(
            musicMetadataSchema.parse(
                musicMetadataInputFromFormData(
                    createMusicMetadataFormData(musicValues)
                )
            )
        ).toEqual(musicValues);
        expect(
            chartMetadataSchema.parse(
                chartMetadataInputFromFormData(
                    createChartMetadataFormData(chartValues)
                )
            )
        ).toEqual(chartValues);
    });
});
