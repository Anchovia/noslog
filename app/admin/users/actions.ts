"use server";

import {
    resetAdminUserSyncToken,
    updateAdminUserRole,
} from "@/features/users/server/userAdminService";

export async function updateUserRole(formData: FormData) {
    return updateAdminUserRole(formData);
}

export async function resetUserSyncToken(formData: FormData) {
    return resetAdminUserSyncToken(formData);
}
