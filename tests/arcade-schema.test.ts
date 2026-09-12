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
import {
    fromPublicArcadeWeekly,
    toPublicArcadeWeekly,
} from "@/lib/arcadeDetails";

const offDay = { enabled: false, open: "", close: "" };

function validArcadeInput(): ArcadeFormValues {
    return {
        name: "  테스트 오락실  ",
        region: "서울",
        address: "  서울특별시 중구 세종대로 110  ",
        latitude: "37.5665",
        longitude: "126.978",
        playPrice: "500",
        coinCount: "1",
        businessHours: {
            monday: { enabled: true, open: "10:00", close: "00:00" },
            tuesday: offDay,
            wednesday: offDay,
            thursday: offDay,
            friday: offDay,
            saturday: offDay,
            sunday: offDay,
        },
        hoursConfirmed: false,
        cabinets: [
            {
                cabinetId: "",
                label: "  ",
                note: "  창가 쪽  ",
                availability: "available",
                condition: "good",
                confirm: false,
            },
        ],
        notes: "  이어폰 단자 지원  ",
        isActive: true,
    };
}

describe("관리자 오락실 스키마", () => {
    it("텍스트와 숫자, 좌표, 영업시간, 기체를 저장 형식으로 정규화한다", () => {
        expect(arcadeFormSchema.parse(validArcadeInput())).toEqual({
            name: "테스트 오락실",
            region: "서울",
            address: "서울특별시 중구 세종대로 110",
            latitude: 37.5665,
            longitude: 126.978,
            playPrice: 500,
            coinCount: 1,
            businessHours: {
                weekly: { monday: { open: "10:00", close: "00:00" } },
                openEveryDay: false,
            },
            hoursConfirmed: false,
            cabinets: [
                {
                    cabinetId: null,
                    label: null,
                    note: "창가 쪽",
                    availability: "available",
                    condition: "good",
                    confirm: false,
                },
            ],
            notes: "이어폰 단자 지원",
            isActive: true,
        });
    });

    it("필수 입력을 검증한다", () => {
        const result = arcadeFormSchema.safeParse({
            ...validArcadeInput(),
            name: " ",
            region: "",
            address: " ",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors).toMatchObject({
                name: ["오락실 이름을 입력해주세요."],
                region: ["지역을 선택해주세요."],
                address: ["주소를 입력해주세요."],
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

    it("기체 상태는 가동일 때만 남기고 보통·주의에는 메모를 요구한다", () => {
        const [cabinet] = validArcadeInput().cabinets;
        const unavailable = arcadeFormSchema.parse({
            ...validArcadeInput(),
            cabinets: [{ ...cabinet, availability: "unavailable" }],
        });
        expect(unavailable.cabinets[0].condition).toBe("unknown");

        const caution = arcadeFormSchema.safeParse({
            ...validArcadeInput(),
            cabinets: [{ ...cabinet, condition: "caution", note: " " }],
        });
        expect(caution.success).toBe(false);
        if (!caution.success) {
            expect(caution.error.flatten().fieldErrors).toMatchObject({
                cabinets: ["보통·주의 상태는 메모에 이유를 적어주세요."],
            });
        }

        const tooMany = arcadeFormSchema.safeParse({
            ...validArcadeInput(),
            cabinets: Array.from({ length: 21 }, () => cabinet),
        });
        expect(tooMany.success).toBe(false);
        if (!tooMany.success) {
            expect(tooMany.error.flatten().fieldErrors).toMatchObject({
                cabinets: ["기체는 20대까지 등록할 수 있습니다."],
            });
        }
    });

    it("생성·수정 FormData 변환을 같은 스키마로 다시 검증한다", () => {
        const input = validArcadeInput();
        input.cabinets.push({
            cabinetId: "7",
            label: "입구 쪽",
            note: "",
            availability: "unknown",
            condition: "unknown",
            confirm: true,
        });
        const values = arcadeFormSchema.parse(input);
        const formData = createArcadeFormData(values, 12);

        expect(
            arcadeUpdateSchema.parse(arcadeUpdateInputFromFormData(formData))
        ).toEqual({ id: 12, ...values });
        expect(
            arcadeFormSchema.parse(arcadeFormInputFromFormData(formData))
        ).toEqual(values);
    });

    it("기존 값으로 폼을 채울 때 공개 영업시간과 기체를 먼저 쓴다", () => {
        expect(createArcadeFormDefaultValues().region).toBe("");

        const defaults = createArcadeFormDefaultValues({
            name: "기존 오락실",
            region: "서울특별시",
            address: "서울 중구",
            latitude: 91,
            longitude: 127,
            playPrice: null,
            coinCount: null,
            businessHours: {
                weekly: { tuesday: { open: "12:00", close: "22:00" } },
            },
            hours: {
                weekly: { "0": { open: 600, close: 1440 }, "1": null },
                exceptions: {},
            },
            cabinets: [
                {
                    id: 3,
                    label: null,
                    note: "입구",
                    availability: "legacy",
                    condition: "good",
                },
            ],
            notes: null,
            isActive: true,
        });

        expect(defaults.region).toBe("서울");
        expect(defaults.latitude).toBe("");
        expect(defaults.longitude).toBe("");
        expect(defaults.businessHours.monday).toEqual({
            enabled: true,
            open: "10:00",
            close: "00:00",
        });
        expect(defaults.businessHours.tuesday.enabled).toBe(false);
        expect(defaults.cabinets).toEqual([
            {
                cabinetId: "3",
                label: "",
                note: "입구",
                availability: "unknown",
                condition: "good",
                confirm: false,
            },
        ]);
    });

    it("요일 입력과 공개 영업시간을 서로 바꾼다 — 자정 넘김은 다음 날, 해제한 요일은 휴무", () => {
        const weekly = {
            monday: { open: "10:00", close: "01:50" },
            friday: { open: "10:00", close: "23:00" },
        };
        expect(toPublicArcadeWeekly(weekly)).toEqual({
            "0": { open: 600, close: 1550 },
            "1": null,
            "2": null,
            "3": null,
            "4": { open: 600, close: 1380 },
            "5": null,
            "6": null,
        });
        expect(toPublicArcadeWeekly({})).toBeNull();
        expect(fromPublicArcadeWeekly(toPublicArcadeWeekly(weekly)!)).toEqual(
            weekly
        );
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
