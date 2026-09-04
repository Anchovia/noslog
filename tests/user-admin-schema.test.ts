import { describe, expect, it } from "vitest";

import {
    createUserRoleUpdateFormData,
    createUserSyncTokenResetFormData,
    normalizeUserAdminFilters,
    userRoleUpdateInputFromFormData,
    userRoleUpdateSchema,
    userSyncTokenResetInputFromFormData,
    userSyncTokenResetSchema,
} from "@/features/users/schemas/userAdminSchema";

describe("관리자 사용자 스키마", () => {
    it("검색어를 다듬고 지원하는 상태만 유지한다", () => {
        expect(normalizeUserAdminFilters("  pianist  ", "attention")).toEqual({
            q: "pianist",
            state: "attention",
        });
        expect(normalizeUserAdminFilters(undefined, "unknown")).toEqual({
            q: "",
            state: "all",
        });
    });

    it("권한 변경 FormData를 정규화한다", () => {
        const formData = createUserRoleUpdateFormData(20, "admin");

        expect(
            userRoleUpdateSchema.parse(
                userRoleUpdateInputFromFormData(formData)
            )
        ).toEqual({ userId: 20, role: "admin" });
    });

    it("토큰 초기화 FormData를 정규화한다", () => {
        const formData = createUserSyncTokenResetFormData(20);

        expect(
            userSyncTokenResetSchema.parse(
                userSyncTokenResetInputFromFormData(formData)
            )
        ).toEqual({ userId: 20 });
    });

    it.each(["", "0", "-1", "1.5", "unknown"])(
        "잘못된 사용자 ID %s를 거부한다",
        (userId) => {
            const result = userRoleUpdateSchema.safeParse({
                userId,
                role: "admin",
            });

            expect(result.success).toBe(false);
        }
    );

    it("지원하지 않는 권한을 거부한다", () => {
        const result = userRoleUpdateSchema.safeParse({
            userId: 20,
            role: "owner",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues[0]?.path).toEqual(["role"]);
    });
});
