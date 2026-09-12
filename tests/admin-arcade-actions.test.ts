import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    arcadeCreate: vi.fn(),
    arcadeUpdate: vi.fn(),
    cabinetFindMany: vi.fn(),
    cabinetUpdate: vi.fn(),
    cabinetCreate: vi.fn(),
    cabinetUpdateMany: vi.fn(),
    detailsFindUnique: vi.fn(),
    detailsUpsert: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({
    requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/lib/db", () => {
    const tx = {
        arcade: { create: mocks.arcadeCreate, update: mocks.arcadeUpdate },
        arcadeCabinet: {
            findMany: mocks.cabinetFindMany,
            update: mocks.cabinetUpdate,
            create: mocks.cabinetCreate,
            updateMany: mocks.cabinetUpdateMany,
        },
        arcadePublicDetails: {
            findUnique: mocks.detailsFindUnique,
            upsert: mocks.detailsUpsert,
        },
    };
    return {
        default: {
            $transaction: (run: (client: typeof tx) => unknown) => run(tx),
        },
    };
});

vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { createArcade, updateArcade } from "@/app/admin/arcades/actions";

interface CabinetInput {
    cabinetId?: string;
    label?: string;
    note?: string;
    availability?: string;
    condition?: string;
    confirm?: boolean;
}

function cabinet(input: CabinetInput = {}) {
    return {
        cabinetId: "",
        label: "",
        note: "",
        availability: "available",
        condition: "good",
        confirm: false,
        ...input,
    };
}

function arcadeFormData({
    id,
    name = "테스트 오락실",
    address = "서울특별시 중구 세종대로 110",
    coinCount = "1",
    isActive = true,
    cabinets = [cabinet({ note: "창가 쪽" })],
    monday,
    hoursConfirmed = false,
}: {
    id?: number | string;
    name?: string;
    address?: string;
    coinCount?: string;
    isActive?: boolean;
    cabinets?: ReturnType<typeof cabinet>[];
    monday?: { open: string; close: string };
    hoursConfirmed?: boolean;
} = {}) {
    const formData = new FormData();
    if (id !== undefined) formData.set("id", String(id));
    formData.set("name", name);
    formData.set("region", "서울");
    formData.set("address", address);
    formData.set("latitude", "37.5665");
    formData.set("longitude", "126.978");
    formData.set("playPrice", "500");
    formData.set("coinCount", coinCount);
    formData.set("notes", "  이어폰 단자 지원  ");
    formData.set("isActive", String(isActive));
    formData.set("cabinets", JSON.stringify(cabinets));
    formData.set("hoursConfirmed", String(hoursConfirmed));
    if (monday) {
        formData.set("hours_monday_enabled", "true");
        formData.set("hours_monday_open", monday.open);
        formData.set("hours_monday_close", monday.close);
    }
    return formData;
}

const savedCabinet = {
    arcadeId: 10,
    label: null,
    note: null,
    availability: "available",
    condition: "good",
    isActive: true,
};

describe("관리자 오락실 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.arcadeCreate.mockResolvedValue({ id: 10 });
        mocks.arcadeUpdate.mockResolvedValue({ id: 10 });
        mocks.cabinetFindMany.mockResolvedValue([]);
        mocks.detailsFindUnique.mockResolvedValue(null);
    });

    it("관리자 인증에 실패하면 입력을 처리하지 않는다", async () => {
        mocks.requireAdmin.mockRejectedValueOnce(new Error("forbidden"));

        await expect(createArcade(arcadeFormData())).rejects.toThrow(
            "forbidden"
        );
        expect(mocks.arcadeCreate).not.toHaveBeenCalled();
    });

    it("잘못된 입력은 필드 오류를 반환하고 DB를 수정하지 않는다", async () => {
        await expect(
            createArcade(arcadeFormData({ name: " ", address: " " }))
        ).resolves.toEqual({
            success: false,
            message: "오락실 이름을 입력해주세요.",
            fieldErrors: expect.objectContaining({
                name: ["오락실 이름을 입력해주세요."],
                address: ["주소를 입력해주세요."],
            }),
        });

        expect(mocks.arcadeCreate).not.toHaveBeenCalled();
    });

    it("요금과 코인 수가 짝을 이루지 않으면 저장하지 않는다", async () => {
        const result = await createArcade(arcadeFormData({ coinCount: "" }));

        expect(result).toMatchObject({
            success: false,
            message: "플레이 요금과 코인 수를 함께 입력해주세요.",
        });
        expect(mocks.arcadeCreate).not.toHaveBeenCalled();
    });

    it("오락실과 기체를 만들고 공개 정보에 기체 확인 시각을 남긴다", async () => {
        await expect(createArcade(arcadeFormData())).resolves.toEqual({
            success: true,
            message: "오락실을 추가했습니다.",
        });

        expect(mocks.arcadeCreate).toHaveBeenCalledWith({
            data: {
                name: "테스트 오락실",
                region: "서울",
                address: "서울특별시 중구 세종대로 110",
                latitude: 37.5665,
                longitude: 126.978,
                machine_count: 1,
                play_price: 500,
                coin_count: 1,
                business_hours: Prisma.DbNull,
                notes: "이어폰 단자 지원",
            },
            select: { id: true },
        });
        expect(mocks.cabinetCreate).toHaveBeenCalledWith({
            data: {
                arcadeId: 10,
                position: 0,
                label: null,
                note: "창가 쪽",
                availability: "available",
                condition: "good",
                verifiedAt: expect.any(Date),
                verificationSource: "admin",
            },
        });
        expect(mocks.detailsUpsert).toHaveBeenCalledWith({
            where: { arcadeId: 10 },
            create: {
                arcadeId: 10,
                slug: "10",
                countryCode: "KR",
                timeZone: "Asia/Seoul",
                currencyCode: "KRW",
                cabinetVerifiedAt: expect.any(Date),
            },
            update: { cabinetVerifiedAt: expect.any(Date) },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("arcades");
        expect(mocks.updateTag).not.toHaveBeenCalledWith("user-profiles");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/arcades");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/gamecenter");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/gamecenter/10");
    });

    it("기체를 고치고 뺀 기체는 숨기며 영업시간을 공개 형식으로 저장한다", async () => {
        mocks.cabinetFindMany.mockResolvedValue([
            { ...savedCabinet, id: 1, position: 0 },
            { ...savedCabinet, id: 2, position: 1 },
        ]);
        mocks.detailsFindUnique.mockResolvedValue({
            slug: "jjanggu",
            hours: null,
        });

        await expect(
            updateArcade(
                arcadeFormData({
                    id: 10,
                    isActive: false,
                    cabinets: [
                        cabinet({ cabinetId: "1" }),
                        cabinet({ note: "새로 들어온 기체" }),
                    ],
                    monday: { open: "10:00", close: "01:50" },
                })
            )
        ).resolves.toEqual({
            success: true,
            message: "오락실 정보를 저장했습니다.",
        });

        expect(mocks.arcadeUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                name: "테스트 오락실",
                machine_count: 2,
                is_active: false,
            }),
        });
        // 바뀌지 않았고 「오늘 확인」 도 아니면 확인 시각을 건드리지 않는다
        expect(mocks.cabinetUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                label: null,
                note: null,
                availability: "available",
                condition: "good",
                isActive: true,
            },
        });
        expect(mocks.cabinetCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({ arcadeId: 10, position: 2 }),
        });
        expect(mocks.cabinetUpdateMany).toHaveBeenCalledWith({
            where: { id: { in: [2] } },
            data: { isActive: false },
        });
        expect(mocks.detailsUpsert).toHaveBeenCalledWith(
            expect.objectContaining({
                update: {
                    hours: {
                        weekly: {
                            "0": { open: 600, close: 1550 },
                            "1": null,
                            "2": null,
                            "3": null,
                            "4": null,
                            "5": null,
                            "6": null,
                        },
                        exceptions: {},
                    },
                    hoursVerifiedAt: expect.any(Date),
                    cabinetVerifiedAt: expect.any(Date),
                },
            })
        );
        expect(mocks.updateTag).toHaveBeenCalledWith("user-profiles");
        expect(mocks.revalidatePath).toHaveBeenCalledWith(
            "/gamecenter/jjanggu"
        );
    });

    it("바뀌지 않은 기체·영업시간도 「오늘 확인」 이면 확인 시각을 갱신한다", async () => {
        mocks.cabinetFindMany.mockResolvedValue([
            { ...savedCabinet, id: 1, position: 0 },
        ]);
        mocks.detailsFindUnique.mockResolvedValue({
            slug: "10",
            hours: {
                weekly: {
                    "0": { open: 600, close: 1440 },
                    "1": null,
                    "2": null,
                    "3": null,
                    "4": null,
                    "5": null,
                    "6": null,
                },
                exceptions: { "2026-12-25": null },
            },
        });

        await updateArcade(
            arcadeFormData({
                id: 10,
                cabinets: [cabinet({ cabinetId: "1", confirm: true })],
                monday: { open: "10:00", close: "00:00" },
                hoursConfirmed: true,
            })
        );

        expect(mocks.cabinetUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({
                verifiedAt: expect.any(Date),
                verificationSource: "admin",
            }),
        });
        expect(mocks.detailsUpsert).toHaveBeenCalledWith(
            expect.objectContaining({
                update: expect.objectContaining({
                    hours: expect.objectContaining({
                        exceptions: { "2026-12-25": null },
                    }),
                    hoursVerifiedAt: expect.any(Date),
                }),
            })
        );
    });

    it("다른 오락실의 기체 ID는 저장하지 않는다", async () => {
        const result = await updateArcade(
            arcadeFormData({ id: 10, cabinets: [cabinet({ cabinetId: "99" })] })
        );

        expect(result).toMatchObject({
            success: false,
            message:
                "기체 목록이 바뀌었습니다. 새로고침한 뒤 다시 저장해주세요.",
        });
        expect(mocks.cabinetUpdate).not.toHaveBeenCalled();
        expect(mocks.updateTag).not.toHaveBeenCalled();
    });

    it("잘못된 수정 ID를 거부한다", async () => {
        const result = await updateArcade(arcadeFormData({ id: "invalid" }));

        expect(result).toMatchObject({
            success: false,
            message: "잘못된 오락실입니다.",
        });
        expect(mocks.arcadeUpdate).not.toHaveBeenCalled();
    });

    it("DB 오류를 기록하고 실패 결과를 반환한다", async () => {
        mocks.arcadeCreate.mockRejectedValueOnce(new Error("database error"));

        await expect(createArcade(arcadeFormData())).resolves.toEqual({
            success: false,
            message: "오락실을 추가하지 못했습니다.",
        });
        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({ event: "admin.arcade.create.failed" })
        );
        expect(mocks.updateTag).not.toHaveBeenCalled();
    });
});
