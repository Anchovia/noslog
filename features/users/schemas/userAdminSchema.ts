import { z } from "zod";

export const USER_ROLES = ["user", "admin"] as const;
export const USER_ADMIN_STATES = ["all", "attention"] as const;

export const userRoleSchema = z.enum(USER_ROLES, {
    error: "사용자 권한을 확인해주세요.",
});

export const userAdminStateSchema = z.enum(USER_ADMIN_STATES, {
    error: "사용자 조회 상태를 확인해주세요.",
});

export const userAdminFilterSchema = z.object({
    q: z.string().trim(),
    state: userAdminStateSchema,
});

const userIdSchema = z.coerce
    .number({ error: "잘못된 사용자입니다." })
    .int("잘못된 사용자입니다.")
    .positive("잘못된 사용자입니다.");

export const userRoleUpdateSchema = z.object({
    userId: userIdSchema,
    role: userRoleSchema,
});

export const userSyncTokenResetSchema = z.object({
    userId: userIdSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserAdminState = z.infer<typeof userAdminStateSchema>;
export type UserAdminFilters = z.output<typeof userAdminFilterSchema>;

export function normalizeUserAdminFilters(
    q: string | undefined,
    state: string | undefined
): UserAdminFilters {
    const result = userAdminFilterSchema.safeParse({
        q: q ?? "",
        state: state ?? "all",
    });
    return result.success ? result.data : { q: (q ?? "").trim(), state: "all" };
}

export function userRoleUpdateInputFromFormData(formData: FormData) {
    return {
        userId: formData.get("userId"),
        role: String(formData.get("role") ?? ""),
    };
}

export function userSyncTokenResetInputFromFormData(formData: FormData) {
    return { userId: formData.get("userId") };
}

export function createUserRoleUpdateFormData(userId: number, role: UserRole) {
    const formData = new FormData();
    formData.set("userId", String(userId));
    formData.set("role", role);
    return formData;
}

export function createUserSyncTokenResetFormData(userId: number) {
    const formData = new FormData();
    formData.set("userId", String(userId));
    return formData;
}
