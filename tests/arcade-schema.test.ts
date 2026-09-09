import { describe, expect, it } from "vitest";

import { createArcadeAddressQueries } from "@/features/arcades/api/geocodeArcadeAddress";
import {
    arcadeFormInputFromFormData,
    arcadeFormSchema,
    arcadeUpdateInputFromFormData,
    arcadeUpdateSchema,
    createArcadeFormData,
    createArcadeFormDefaultValues,
    type ArcadeFormValues,
} from "@/features/arcades/schemas/arcadeSchema";

function validArcadeInput(): ArcadeFormValues {
    return {
        name: "  테스트 오락실  ",
        region: "서울",
        address: "  서울특별시 중구 세종대로 110  ",
        latitude: "37.5665",
        longitude: "126.978",
        machineCount: "2",
        playPrice: "500",
        coinCount: "1",
        businessHours: {
            monday: { enabled: true, open: "10:00", close: "00:00" },
            tuesday: { enabled: false, open: "", close: "" },
            wednesday: { enabled: false, open: "", close: "" },
            thursday: { enabled: false, open: "", close: "" },
            friday: { enabled: false, open: "", close: "" },
            saturday: { enabled: false, open: "", close: "" },
            sunday: { enabled: false, open: "", close: "" },
            openEveryDay: false,
        },
        machineStatus: "good",
        statusNote: "  상태 양호  ",
        notes: "  이어폰 단자 지원  ",
        isActive: true,
    };
}

describe("관리자 오락실 스키마", () => {
    it("텍스트와 숫자, 좌표, 영업시간을 저장 형식으로 정규화한다", () => {
        expect(arcadeFormSchema.parse(validArcadeInput())).toEqual({
            name: "테스트 오락실",
            region: "서울",
            address: "서울특별시 중구 세종대로 110",
            latitude: 37.5665,
            longitude: 126.978,
            machineCount: 2,
            playPrice: 500,
            coinCount: 1,
            businessHours: {
                weekly: { monday: { open: "10:00", close: "00:00" } },
                openEveryDay: false,
            },
            machineStatus: "good",
            statusNote: "상태 양호",
            notes: "이어폰 단자 지원",
            isActive: true,
        });
    });

    it("필수 입력과 숫자 범위를 검증한다", () => {
        const result = arcadeFormSchema.safeParse({
            ...validArcadeInput(),
            name: " ",
            region: "",
            address: " ",
            machineCount: "21",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors).toMatchObject({
                name: ["오락실 이름을 입력해주세요."],
                region: ["지역을 선택해주세요."],
                address: ["주소를 입력해주세요."],
                machineCount: ["기체 수는 1~20 사이의 정수로 입력해주세요."],
            });
        }
    });

    it("플레이 요금과 코인 수를 반드시 함께 받는다", () => {
        const result = arcadeFormSchema.safeParse({
            ...validArcadeInput(),
            coinCount: "",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors).toMatchObject({
                playPrice: ["플레이 요금과 코인 수를 함께 입력해주세요."],
                coinCount: ["플레이 요금과 코인 수를 함께 입력해주세요."],
            });
        }
    });

    it("좌표 한쪽 누락과 허용 범위를 벗어난 좌표를 거부한다", () => {
        const missingLongitude = arcadeFormSchema.safeParse({
            ...validArcadeInput(),
            longitude: "",
        });
        const invalidRange = arcadeFormSchema.safeParse({
            ...validArcadeInput(),
            latitude: "91",
            longitude: "181",
        });

        expect(missingLongitude.success).toBe(false);
        expect(invalidRange.success).toBe(false);
        if (!invalidRange.success) {
            expect(invalidRange.error.flatten().fieldErrors).toMatchObject({
                latitude: ["위도는 -90~90 사이의 숫자여야 합니다."],
                longitude: ["경도는 -180~180 사이의 숫자여야 합니다."],
            });
        }
    });

    it("연중무휴는 모든 요일 영업시간이 있을 때만 허용한다", () => {
        const input = validArcadeInput();
        input.businessHours.openEveryDay = true;
        const result = arcadeFormSchema.safeParse(input);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors).toMatchObject({
                businessHours: [
                    "연중무휴는 모든 요일의 영업시간을 입력해주세요.",
                ],
            });
        }
    });

    it("생성·수정 FormData 변환을 같은 스키마로 다시 검증한다", () => {
        const values = arcadeFormSchema.parse(validArcadeInput());
        const formData = createArcadeFormData(values, 12);

        expect(
            arcadeUpdateSchema.parse(arcadeUpdateInputFromFormData(formData))
        ).toEqual({ id: 12, ...values });
        expect(
            arcadeFormSchema.parse(arcadeFormInputFromFormData(formData))
        ).toEqual(values);
    });

    it("신규 폼은 지역을 미선택으로 두고 기존 자유 지역과 좌표를 안전하게 보정한다", () => {
        expect(createArcadeFormDefaultValues().region).toBe("");

        const defaults = createArcadeFormDefaultValues({
            name: "기존 오락실",
            region: "서울특별시",
            address: "서울 중구",
            latitude: 91,
            longitude: 127,
            machineCount: null,
            playPrice: null,
            coinCount: null,
            businessHours: null,
            machineStatus: "legacy",
            statusNote: null,
            notes: null,
            isActive: true,
        });

        expect(defaults.region).toBe("서울");
        expect(defaults.latitude).toBe("");
        expect(defaults.longitude).toBe("");
        expect(defaults.machineStatus).toBe("unknown");
    });

    it("카카오 주소 검색 후보에서 상세 주소를 단계적으로 제거한다", () => {
        expect(
            createArcadeAddressQueries("서울특별시 중구 세종대로 110 2층")
        ).toEqual([
            "서울특별시 중구 세종대로 110 2층",
            "서울특별시 중구 세종대로 110",
        ]);
    });
});
