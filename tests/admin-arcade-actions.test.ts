import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    arcadeCreate: vi.fn(),
    arcadeUpdate: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({
    requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/lib/db", () => ({
    default: {
        arcade: {
            create: mocks.arcadeCreate,
            update: mocks.arcadeUpdate,
        },
    },
}));

vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { createArcade, updateArcade } from "@/app/admin/arcades/actions";

function arcadeFormData({
    id,
    name = "테스트 오락실",
    address = "서울특별시 중구 세종대로 110",
    coinCount = "1",
    isActive = true,
}: {
    id?: number | string;
    name?: string;
    address?: string;
    coinCount?: string;
    isActive?: boolean;
} = {}) {
    const formData = new FormData();
    if (id !== undefined) formData.set("id", String(id));
    formData.set("name", name);
    formData.set("region", "서울");
    formData.set("address", address);
    formData.set("latitude", "37.5665");
    formData.set("longitude", "126.978");
    formData.set("machineCount", "2");
    formData.set("playPrice", "500");
    formData.set("coinCount", coinCount);
    formData.set("machineStatus", "good");
    formData.set("statusNote", "  상태 양호  ");
    formData.set("notes", "  이어폰 단자 지원  ");
    formData.set("isActive", String(isActive));
    formData.set("openEveryDay", "false");
    return formData;
}

describe("관리자 오락실 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.arcadeCreate.mockResolvedValue({ id: 10 });
        mocks.arcadeUpdate.mockResolvedValue({ id: 10 });
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

    it("정규화한 오락실을 생성하고 관련 캐시를 갱신한다", async () => {
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
                machine_count: 2,
                play_price: 500,
                coin_count: 1,
                business_hours: Prisma.DbNull,
                machine_status: "good",
                status_note: "상태 양호",
                notes: "이어폰 단자 지원",
            },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("arcades");
        expect(mocks.updateTag).not.toHaveBeenCalledWith("user-profiles");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/arcades");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/gamecenter");
    });

    it("활성 상태와 오락실 정보를 수정하고 프로필 캐시도 갱신한다", async () => {
        await expect(
            updateArcade(arcadeFormData({ id: 10, isActive: false }))
        ).resolves.toEqual({
            success: true,
            message: "오락실 정보를 저장했습니다.",
        });

        expect(mocks.arcadeUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                name: "테스트 오락실",
                is_active: false,
            }),
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("arcades");
        expect(mocks.updateTag).toHaveBeenCalledWith("user-profiles");
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
